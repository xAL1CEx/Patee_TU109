// Group storage rules shared by the API function. Pure logic, no Netlify imports, so it can be tested with plain Node.
import { randomBytes } from "node:crypto";

export const COLS = ["members", "expenses", "payments", "plans", "reminders", "spots"];
const MAX_SPOTS = 40;              // restaurants saved for the wheel
const KINDS = ["ทริป", "กลุ่ม", "กิจกรรม"];
const MAX_DOC = 12 * 1024;         // one expense / member / payment (a member carries a small profile photo)
const MAX_GROUP = 1024 * 1024;     // whole group blob
const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const ALPHA = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function rid(n) {
  const b = randomBytes(n);
  let s = "";
  for (let i = 0; i < n; i++) s += ALPHA[b[i] % ALPHA.length];
  return s;
}

const str = (v, max) => String(v ?? "").trim().slice(0, max);

// A small square profile photo, already shrunk by the app (about 4 KB). Anything else is dropped.
const PHOTO_RE = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/;
export const cleanPhoto = v => (typeof v === "string" && v.length <= 7000 && PHOTO_RE.test(v) ? v : "");

function cleanMeta(meta = {}) {
  const out = {};
  if ("name" in meta) out.name = str(meta.name, 60) || "กลุ่มใหม่";
  if ("kind" in meta) out.kind = KINDS.includes(meta.kind) ? meta.kind : "กลุ่ม";
  if ("dates" in meta) out.dates = str(meta.dates, 40);
  // Optional start/end days (YYYY-MM-DD). The end may not be before the start.
  if ("start" in meta || "end" in meta) {
    const day = v => { const s = str(v, 10); if (!s) return ""; if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || isNaN(Date.parse(s))) throw new HttpError(400, "bad_dates"); return s; };
    out.start = day(meta.start); out.end = day(meta.end);
    if (out.end && !out.start) throw new HttpError(400, "bad_dates");
    if (out.start && out.end && out.end < out.start) throw new HttpError(400, "bad_dates");
  }
  if ("activities" in meta) {
    const a = Array.isArray(meta.activities) ? meta.activities : [];
    out.activities = [...new Set(a.map(x => str(x, 30)).filter(Boolean))].slice(0, 50);
    if (!out.activities.length) out.activities = ["ทั่วไป"];
  }
  return out;
}

function cleanDoc(doc, id) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) throw new HttpError(400, "bad_doc");
  const d = { ...doc, id };
  if (JSON.stringify(d).length > MAX_DOC) throw new HttpError(413, "doc_too_large");
  return d;
}

// profile = the creator's account profile, uid = their account id.
export function newGroup(meta, profile, uid) {
  if (!uid) throw new HttpError(400, "bad_member");
  const now = new Date().toISOString();
  const m = cleanMeta({ name: "", kind: "ทริป", dates: "", activities: ["ทั่วไป"], ...meta });
  const mid = rid(12);
  return {
    id: rid(10), token: rid(22), rev: 1, createdAt: now, updatedAt: now,
    ...m,
    owner: mid,
    members: { [mid]: cleanDoc({ ...profile, uid, claimed: true, joinedAt: now }, mid) },
    expenses: {}, payments: {}, plans: {}, reminders: {}, spots: {},
  };
}

export const memberOf = (g, uid) => Object.values(g.members || {}).find(m => m.uid === uid) || null;

// Add an account to a group, or let it take over a friend entry the group added by hand.
export function joinGroup(g, uid, profile, claimId) {
  const already = memberOf(g, uid);
  if (already) return already.id;
  const now = new Date().toISOString();
  let mid;
  if (claimId) {
    const m = g.members?.[claimId];
    if (!m || m.uid) throw new HttpError(409, "already_claimed");
    mid = claimId;
    g.members[mid] = cleanDoc({ ...m, ...profile, uid, claimed: true }, mid);
  } else {
    mid = rid(12);
    g.members[mid] = cleanDoc({ ...profile, uid, claimed: true, joinedAt: now }, mid);
  }
  g.rev = (g.rev || 0) + 1;
  g.updatedAt = now;
  return mid;
}

const r2 = n => Math.round(n * 100) / 100;

// Who may change an expense: the member who recorded it (older entries without "by": the payer).
const expenseOwner = e => e.by || e.payer;

// An expense is recorded by the person who paid. The one exception is a friend who has no account
// (nobody could record it for them otherwise); then the member who records it owns the entry.
function cleanExpense(g, doc, cur, mine) {
  if (!doc || typeof doc !== "object") throw new HttpError(400, "bad_doc");
  const payer = g.members?.[doc.payer];
  if (!payer) throw new HttpError(400, "bad_payer");
  if (doc.payer !== mine && payer.uid) throw new HttpError(403, "payer_must_record");
  const amount = r2(Number(doc.amount));
  if (!(amount > 0) || amount > 10_000_000) throw new HttpError(400, "bad_amount");
  const split = {};
  for (const [k, v] of Object.entries(doc.split || {})) {
    const n = r2(Number(v));
    if (!g.members[k] || !(n >= 0)) throw new HttpError(400, "bad_split");
    if (n > 0) split[k] = n;
  }
  const sum = Object.values(split).reduce((a, v) => a + v, 0);
  if (!Object.keys(split).length || Math.abs(sum - amount) > 0.011) throw new HttpError(400, "bad_split");
  return { ...doc, amount, split, by: cur ? expenseOwner(cur) : mine };
}

// What each person owes each other person (same rule as the app). A transfer only counts
// once the receiver has confirmed it.
function pairDebts(g) {
  const owe = {};
  const add = (a, b, v) => { if (a !== b && v) owe[a + "|" + b] = (owe[a + "|" + b] || 0) + v; };
  for (const e of Object.values(g.expenses || {})) for (const k in e.split || {}) add(k, e.payer, Number(e.split[k]) || 0);
  for (const p of Object.values(g.payments || {})) if (p.confirmed) add(p.from, p.to, -(Number(p.amount) || 0));
  return (a, b) => (owe[a + "|" + b] || 0) - (owe[b + "|" + a] || 0);   // > 0: a owes b
}

// How much a member still owes, in total.
export function amountOwed(g, mid) {
  const net = pairDebts(g);
  let total = 0;
  for (const other of Object.keys(g.members || {})) if (other !== mid && net(mid, other) > 0.009) total += net(mid, other);
  return r2(total);
}

// Does anyone in the group still owe anyone?
export function hasOpenDebts(g) {
  const net = pairDebts(g), ids = Object.keys(g.members || {});
  return ids.some(a => ids.some(b => a !== b && net(a, b) > 0.009));
}

// A transfer is reported by the person who sent it (it then waits for the receiver to confirm),
// or recorded by the receiver (confirmed right away). Money sent to a friend without an account
// counts at once, since nobody could confirm it.
function cleanPayment(g, doc, mine) {
  if (!doc || typeof doc !== "object") throw new HttpError(400, "bad_doc");
  if (!g.members?.[doc.from] || !g.members?.[doc.to] || doc.from === doc.to) throw new HttpError(400, "bad_payment");
  if (mine !== doc.from && mine !== doc.to) throw new HttpError(403, "not_your_payment");
  const amount = r2(Number(doc.amount));
  if (!(amount > 0) || amount > 10_000_000) throw new HttpError(400, "bad_amount");
  return { ...doc, amount, by: mine, confirmed: mine === doc.to || !g.members[doc.to].uid };
}

// A restaurant someone added for the group wheel: just a name, a place to open on the map and who added it.
function cleanSpot(g, doc, cur, mine) {
  if (!doc || typeof doc !== "object") throw new HttpError(400, "bad_doc");
  const name = str(doc.name, 80);
  if (!name) throw new HttpError(400, "bad_spot");
  if (!cur && Object.keys(g.spots || {}).length >= MAX_SPOTS) throw new HttpError(409, "too_many_spots");
  const num = v => (Number.isFinite(Number(v)) && v !== null && v !== "" ? Math.round(Number(v) * 1e5) / 1e5 : null);
  return { id: doc.id, name, kind: str(doc.kind, 30), lat: num(doc.lat), lng: num(doc.lng), by: cur?.by || mine, createdAt: cur?.createdAt || new Date().toISOString() };
}

// Who may change something that sits between two people (a transfer, a plan, a reminder).
function checkPairDoc(col, op, cur, doc, mine) {
  if (col === "payments") {
    if (op === "put") {
      if (!cur) return;
      if (mine !== cur.to || doc?.confirmed !== true) throw new HttpError(403, "payment_locked");   // only the receiver, only to confirm
    } else if (mine !== cur.to && !((mine === cur.from || mine === cur.by) && !cur.confirmed)) {
      throw new HttpError(403, "payment_locked");   // receiver can reject/undo; sender can withdraw until it's confirmed
    }
  }
  if (col === "plans") {
    const d = cur || doc || {};
    if (mine !== d.from && mine !== d.to) throw new HttpError(403, "not_your_plan");
  }
  if (col === "reminders") {
    if (op === "put" && !cur && doc?.from !== mine) throw new HttpError(403, "not_your_reminder");
    if (cur && mine !== cur.from && mine !== cur.to) throw new HttpError(403, "not_your_reminder");
  }
}

// uid = the account making the change. Account-linked members can only be edited or removed by that account.
export function applyOps(g, ops, uid) {
  if (!Array.isArray(ops) || !ops.length || ops.length > 100) throw new HttpError(400, "bad_ops");
  const mine = memberOf(g, uid)?.id;
  for (const op of ops) {
    if (op.op === "meta") { Object.assign(g, cleanMeta(op.doc)); continue; }
    if (!COLS.includes(op.col)) throw new HttpError(400, "bad_collection");
    if (!ID_RE.test(op.id || "")) throw new HttpError(400, "bad_id");
    g[op.col] = g[op.col] || {};
    const cur = g[op.col][op.id];
    if (op.col === "members" && cur?.uid && cur.uid !== uid) throw new HttpError(403, "not_your_member");
    if (op.col === "expenses" && cur && expenseOwner(cur) !== mine) throw new HttpError(403, "not_your_expense");
    checkPairDoc(op.col, op.op, cur, op.doc, mine);
    if (op.op === "put") {
      let doc = op.doc;
      if (op.col === "members") {
        const { uid: _u, claimed: _c, img: _i, ...rest } = doc || {};
        if (cleanPhoto(doc?.img)) rest.img = cleanPhoto(doc.img);
        doc = { ...rest, ...(cur?.uid ? { uid: cur.uid } : {}), claimed: !!cur?.uid, joinedAt: cur?.joinedAt || rest.joinedAt || new Date().toISOString() };
      }
      if (op.col === "expenses") doc = cleanExpense(g, doc, cur, mine);
      if (op.col === "spots") doc = cleanSpot(g, doc, cur, mine);
      if (op.col === "payments") doc = cur ? { ...cur, confirmed: true, confirmedAt: new Date().toISOString() } : cleanPayment(g, doc, mine);
      g[op.col][op.id] = cleanDoc(doc, op.id);
    } else if (op.op === "del") {
      if (op.col === "members" && cur?.uid) throw new HttpError(403, "cannot_remove_account");
      delete g[op.col][op.id];
    } else throw new HttpError(400, "bad_op");
  }
  g.rev = (g.rev || 0) + 1;
  g.updatedAt = new Date().toISOString();
  if (JSON.stringify(g).length > MAX_GROUP) throw new HttpError(413, "group_full");
  return g;
}

// What a member sees: everything but account ids, plus which member they are and the invite token.
export function viewFor(g, uid) {
  const m = memberOf(g, uid);
  const { token, ...rest } = g;
  const members = Object.fromEntries(Object.entries(g.members || {}).map(([k, v]) => { const { uid: _u, ...pub } = v; return [k, pub]; }));
  return { ...rest, members, me: m?.id || null, invite: token };
}

// What someone holding an invite sees before joining.
export function previewOf(g) {
  return {
    id: g.id, name: g.name, kind: g.kind, dates: g.dates,
    members: Object.values(g.members || {}).map(m => ({ id: m.id, name: m.name, claimed: !!m.uid })),
  };
}

export function validGroupId(id) {
  return /^[A-Za-z0-9]{6,32}$/.test(id || "");
}
