// Web Push: who gets a phone notification when something in a group changes.
import * as wp from "web-push";
const webpush = wp.default || wp;

const MAX_DEVICES = 5;   // per account
const baht = n => "฿" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });

// VAPID keys identify this server to the push services. Set VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY to choose your
// own; otherwise a pair is made once and kept in the users store (like the session secret).
let cachedKeys = null;
export async function vapidKeys(users) {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
    return { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
  if (cachedKeys) return cachedKeys;
  await users.setJSON("config:vapid", webpush.generateVAPIDKeys(), { onlyIfNew: true });
  return (cachedKeys = await users.get("config:vapid", { type: "json" }));
}

export function cleanSubscription(s) {
  const ok = s && typeof s.endpoint === "string" && s.endpoint.startsWith("https://") && s.endpoint.length < 600
    && s.keys && typeof s.keys.p256dh === "string" && typeof s.keys.auth === "string" && s.keys.p256dh.length < 200 && s.keys.auth.length < 100;
  return ok ? { endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth } } : null;
}

// Devices live in their own record per account, so a notification never has to look the account up by name.
const devKey = uid => "push:" + uid;
export async function saveDevice(users, uid, sub) {
  const cur = (await users.get(devKey(uid), { type: "json" })) || { devices: [] };
  cur.devices = [...cur.devices.filter(d => d.endpoint !== sub.endpoint), { ...sub, at: new Date().toISOString() }].slice(-MAX_DEVICES);
  await users.setJSON(devKey(uid), cur);
}
export async function removeDevice(users, uid, endpoint) {
  const cur = await users.get(devKey(uid), { type: "json" });
  if (!cur) return;
  cur.devices = cur.devices.filter(d => d.endpoint !== endpoint);
  await users.setJSON(devKey(uid), cur);
}
export async function hasDevice(users, uid, endpoint) {
  const cur = await users.get(devKey(uid), { type: "json" });
  return !!cur?.devices.some(d => d.endpoint === endpoint);
}

// What changed between two copies of a group, as [{uid, title, body}]. Never tells people about their own actions.
export function eventsOf(before, after, actorUid) {
  const out = [], mem = after.members || {};
  const name = id => mem[id]?.name || "เพื่อน";
  const uidOf = id => mem[id]?.uid;
  const add = (id, title, body) => { const uid = uidOf(id); if (uid && uid !== actorUid) out.push({ uid, title, body, gid: after.id }); };

  for (const [id, e] of Object.entries(after.expenses || {})) {
    if (before.expenses?.[id]) continue;
    for (const [k, v] of Object.entries(e.split || {})) if (k !== e.payer) add(k, `${after.name}: ${name(e.payer)} เพิ่มรายการ`, `${e.title} · ส่วนของคุณ ${baht(v)}`);
  }
  for (const [id, p] of Object.entries(after.payments || {})) {
    const was = before.payments?.[id];
    if (!was && !p.confirmed) add(p.to, `${after.name}: ${name(p.from)} โอนเงินให้คุณ`, `${baht(p.amount)} · เปิดแอปเพื่อกดยืนยันว่าได้รับแล้ว`);
    else if ((!was && p.confirmed) || (was && !was.confirmed && p.confirmed)) add(p.from, `${after.name}: ${name(p.to)} ยืนยันการรับเงิน`, `${baht(p.amount)} หักจากยอดค้างของคุณแล้ว`);
  }
  for (const [id, r] of Object.entries(after.reminders || {})) {
    if (!before.reminders?.[id]) add(r.to, `${after.name}: ${name(r.from)} ทวงเงิน`, `ยอดที่ค้างอยู่ ${baht(r.amount)}`);
  }
  return out;
}

// Sends each event to every device its account has registered. Dead subscriptions are removed.
// `send` can be replaced in tests. Never throws: a failed notification must not fail the request.
export async function notify(users, events, send) {
  try {
    if (!events.length) return;
    let doSend = send;
    if (!doSend) {
      const { publicKey, privateKey } = await vapidKeys(users);
      doSend = (sub, payload) => webpush.sendNotification(sub, payload, { TTL: 86400, vapidDetails: { subject: process.env.URL || "https://splitly-tu109.netlify.app", publicKey, privateKey } });
    }
    const byUid = new Map();
    for (const e of events) byUid.set(e.uid, [...(byUid.get(e.uid) || []), e]);
    await Promise.race([
      Promise.allSettled([...byUid].map(async ([uid, list]) => {
        const rec = await users.get(devKey(uid), { type: "json" });
        if (!rec?.devices.length) return;
        for (const ev of list) {
          const payload = JSON.stringify({ title: ev.title, body: ev.body, url: "/?g=" + ev.gid, tag: ev.gid });
          await Promise.all(rec.devices.map(d => Promise.resolve().then(() => doSend({ endpoint: d.endpoint, keys: d.keys }, payload)).catch(err => {
            if (err?.statusCode === 404 || err?.statusCode === 410) return removeDevice(users, uid, d.endpoint);
            console.error("push rejected", err?.statusCode, String(err?.body || err?.message).slice(0, 200));
          })));
        }
      })),
      new Promise(ok => setTimeout(ok, 4000).unref?.()),
    ]);
  } catch (e) { console.error("push failed", e); }
}
