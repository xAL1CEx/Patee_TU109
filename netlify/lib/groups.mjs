// Group storage rules shared by the API function. Pure logic, no Netlify imports, so it can be tested with plain Node.
import { randomBytes } from "node:crypto";

export const COLS = ["members", "expenses", "payments", "plans", "reminders"];
const KINDS = ["ทริป", "กลุ่ม", "กิจกรรม"];
const MAX_DOC = 8 * 1024;          // one expense / member / payment
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

function cleanMeta(meta = {}) {
  const out = {};
  if ("name" in meta) out.name = str(meta.name, 60) || "กลุ่มใหม่";
  if ("kind" in meta) out.kind = KINDS.includes(meta.kind) ? meta.kind : "กลุ่ม";
  if ("dates" in meta) out.dates = str(meta.dates, 40);
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
    expenses: {}, payments: {}, plans: {}, reminders: {},
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

// uid = the account making the change. Account-linked members can only be edited or removed by that account.
export function applyOps(g, ops, uid) {
  if (!Array.isArray(ops) || !ops.length || ops.length > 100) throw new HttpError(400, "bad_ops");
  for (const op of ops) {
    if (op.op === "meta") { Object.assign(g, cleanMeta(op.doc)); continue; }
    if (!COLS.includes(op.col)) throw new HttpError(400, "bad_collection");
    if (!ID_RE.test(op.id || "")) throw new HttpError(400, "bad_id");
    g[op.col] = g[op.col] || {};
    const cur = g[op.col][op.id];
    if (op.col === "members" && cur?.uid && cur.uid !== uid) throw new HttpError(403, "not_your_member");
    if (op.op === "put") {
      let doc = op.doc;
      if (op.col === "members") {
        const { uid: _u, claimed: _c, ...rest } = doc || {};
        doc = { ...rest, ...(cur?.uid ? { uid: cur.uid } : {}), claimed: !!cur?.uid, joinedAt: cur?.joinedAt || rest.joinedAt || new Date().toISOString() };
      }
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
