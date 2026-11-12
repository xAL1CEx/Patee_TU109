// Splitly API. Accounts and groups are JSON blobs in Netlify Blobs; the session is an HttpOnly cookie.
//
// Accounts
//   POST /api/auth/register  {username, password, profile}  create account (username must be unused)
//   POST /api/auth/login     {username, password}
//   POST /api/auth/logout
//   POST /api/auth/password  {current, next}                 change password, signs out other devices
//   GET  /api/me                                             account, profile and group list (isAdmin for the admin account)
//   GET  /api/admin/stats                                    account statistics (admin account only)
//   PUT  /api/me             {profile}                       update profile
// Groups (signed in)
//   POST   /api/groups                      create          -> {group}
//   GET    /api/groups/:id[?rev=N]          read (members only)
//   POST   /api/groups/:id/ops   {ops}      write (members only)
//   GET    /api/groups/:id/preview?t=INVITE  see a group before joining
//   POST   /api/groups/:id/join?t=INVITE {claim?}  join, or take over a friend entry
//   POST   /api/groups/:id/leave            remove from my list
//   DELETE /api/groups/:id                  delete (group creator only)
// Notifications (signed in)
//   GET  /api/push/key  ·  POST /api/push/subscribe {sub}  ·  POST /api/push/status|unsubscribe {endpoint}
import { getStore } from "@netlify/blobs";
import { newGroup, applyOps, joinGroup, memberOf, amountOwed, hasOpenDebts, viewFor, previewOf, validGroupId, rid, HttpError } from "../lib/groups.mjs";
import { searchPlaces, findPlace, limitPerUser } from "../lib/places.mjs";
import { vapidKeys, cleanSubscription, saveDevice, removeDevice, hasDevice, eventsOf, notify } from "../lib/push.mjs";
import { hashPassword, verifyPassword, signSession, readSession, cleanUsername, checkPassword, cleanProfile, newSecret, readCookie, sessionCookie, SESSION_DAYS } from "../lib/auth.mjs";

const COOKIE = "sp_session";
const MAX_FAILS = 8, LOCK_MS = 10 * 60 * 1000;

export default (req) => handle(req, {
  groups: getStore({ name: "splitly-groups", consistency: "strong" }),
  users: getStore({ name: "splitly-users", consistency: "strong" }),
});

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

async function readBody(req) {
  const text = await req.text();
  if (text.length > 200_000) throw new HttpError(413, "body_too_large");
  try { return JSON.parse(text || "{}"); } catch { throw new HttpError(400, "bad_json"); }
}

const sleep = ms => new Promise(ok => setTimeout(ok, ms));

// Read-modify-write that retries if someone else wrote in between.
async function mutate(store, key, fn) {
  for (let i = 0; i < 6; i++) {
    const r = await store.getWithMetadata(key, { type: "json" });
    if (!r || !r.data) throw new HttpError(404, "not_found");
    const out = await fn(r.data);
    const res = await store.setJSON(key, r.data, r.etag ? { onlyIfMatch: r.etag } : {});
    if (!res || res.modified !== false) return out;
    await sleep(40 + Math.random() * 120);
  }
  throw new HttpError(409, "busy");
}

let cachedSecret = null;
async function secretOf(users) {
  if (process.env.SPLITLY_SECRET) return process.env.SPLITLY_SECRET;
  if (cachedSecret) return cachedSecret;
  const fresh = newSecret();
  await users.setJSON("config:secret", { s: fresh }, { onlyIfNew: true });
  const saved = await users.get("config:secret", { type: "json" });
  return (cachedSecret = saved.s);
}

const userKey = u => "user:" + u;

// The one account allowed to see the statistics. Set ADMIN_USERNAME to use another name.
const adminName = () => (process.env.ADMIN_USERNAME || "admin").toLowerCase();
const isAdmin = u => u.username === adminName();

// Accounts: how many in total, how many are new, and who they are. Never includes passwords or payment details.
async function adminStats(stores) {
  const keys = (await stores.users.list({ prefix: "user:" })).blobs.map(b => b.key);
  const users = [];
  for (let i = 0; i < keys.length; i += 25)
    users.push(...(await Promise.all(keys.slice(i, i + 25).map(k => stores.users.get(k, { type: "json" })))).filter(Boolean));
  const now = Date.now(), DAY = 864e5, TZ = 7 * 36e5;   // days are counted in Thai time
  const day = t => new Date(t + TZ).toISOString().slice(0, 10);
  const at = u => Date.parse(u.createdAt) || 0;
  const perDay = Object.fromEntries(Array.from({ length: 14 }, (_, i) => [day(now - i * DAY), 0]));
  for (const u of users) { const d = day(at(u)); if (d in perDay) perDay[d]++; }
  const since = n => users.filter(u => at(u) >= now - n * DAY).length;
  return {
    total: users.length,
    today: users.filter(u => day(at(u)) === day(now)).length,
    last7: since(7), last30: since(30),
    perDay: Object.entries(perDay).map(([date, n]) => ({ date, n })).reverse(),
    groups: (await stores.groups.list()).blobs.length,
    accounts: users.sort((a, b) => at(b) - at(a)).map(u => ({ username: u.username, name: u.profile?.name || "", createdAt: u.createdAt, groups: (u.groups || []).length })),
  };
}
const publicUser = u => ({ id: u.id, username: u.username, profile: u.profile });

async function issue(req, users, user, status = 200, extra = {}) {
  const token = signSession(user, await secretOf(users));
  return json({ user: publicUser(user), ...extra }, status, { "set-cookie": sessionCookie(COOKIE, token, req, SESSION_DAYS * 86400) });
}

async function currentUser(req, users) {
  const s = readSession(readCookie(req, COOKIE), await secretOf(users));
  if (!s) throw new HttpError(401, "signed_out");
  const u = await users.get(userKey(s.u), { type: "json" });
  if (!u || u.id !== s.i || (u.sv || 0) !== s.v) throw new HttpError(401, "signed_out");
  return u;
}

async function groupList(stores, user) {
  const out = [];
  for (const gid of user.groups || []) {
    const g = await stores.groups.get(gid, { type: "json" });
    if (g && memberOf(g, user.id)) out.push({ id: g.id, name: g.name, kind: g.kind, dates: g.dates });
  }
  return out;
}

const addGroupToUser = (users, user, gid) =>
  mutate(users, userKey(user.username), u => { u.groups = [...new Set([...(u.groups || []), gid])]; });

export async function handle(req, stores, deps = {}) {
  try {
    const { users, groups } = stores;
    const url = new URL(req.url);
    const seg = url.pathname.split("/").filter(Boolean);
    if (seg[0] !== "api") return json({ error: "not_found" }, 404);
    const M = req.method;

    /* ---------- accounts ---------- */
    if (seg[1] === "auth") {
      if (M !== "POST") return json({ error: "method_not_allowed" }, 405);
      const action = seg[2];

      if (action === "logout") return json({ ok: true }, 200, { "set-cookie": sessionCookie(COOKIE, "", req, 0) });

      if (action === "register") {
        const b = await readBody(req);
        const username = cleanUsername(b.username);
        const password = checkPassword(b.password);
        const profile = cleanProfile(b.profile);
        const user = { id: rid(16), username, pass: await hashPassword(password), sv: 0, profile, groups: [], createdAt: new Date().toISOString() };
        const res = await users.setJSON(userKey(username), user, { onlyIfNew: true });
        if (res && res.modified === false) throw new HttpError(409, "username_taken");
        return issue(req, users, user, 201);
      }

      if (action === "login") {
        const b = await readBody(req);
        let username;
        try { username = cleanUsername(b.username); } catch { throw new HttpError(401, "wrong_login"); }
        const failKey = "fail:" + username;
        const fails = (await users.get(failKey, { type: "json" })) || { n: 0, until: 0 };
        if (fails.until > Date.now()) throw new HttpError(429, "too_many_attempts");
        const u = await users.get(userKey(username), { type: "json" });
        const ok = u ? await verifyPassword(b.password, u.pass) : (await hashPassword("x"), false); // same work either way
        if (!ok) {
          const n = fails.n + 1;
          await users.setJSON(failKey, n >= MAX_FAILS ? { n: 0, until: Date.now() + LOCK_MS } : { n, until: 0 });
          throw new HttpError(401, "wrong_login");
        }
        if (fails.n) await users.delete(failKey);
        return issue(req, users, u);
      }

      if (action === "password") {
        const me = await currentUser(req, users);
        const b = await readBody(req);
        if (!(await verifyPassword(b.current, me.pass))) throw new HttpError(401, "wrong_password");
        const pass = await hashPassword(checkPassword(b.next));
        const updated = await mutate(users, userKey(me.username), u => { u.pass = pass; u.sv = (u.sv || 0) + 1; return u; });
        return issue(req, users, updated);
      }
      return json({ error: "not_found" }, 404);
    }

    const me = await currentUser(req, users);

    if (seg[1] === "me" && seg.length === 2) {
      if (M === "GET") return json({ user: publicUser(me), groups: await groupList(stores, me), ...(isAdmin(me) ? { isAdmin: true } : {}) });
      if (M === "PUT") {
        const { profile } = await readBody(req);
        const p = cleanProfile(profile);
        await mutate(users, userKey(me.username), u => { u.profile = p; });
        return json({ user: publicUser({ ...me, profile: p }) });
      }
      return json({ error: "method_not_allowed" }, 405);
    }

    /* ---------- admin statistics (looks like any unknown address to everyone else) ---------- */
    if (seg[1] === "admin") {
      if (!isAdmin(me) || seg[2] !== "stats" || M !== "GET") return json({ error: "not_found" }, 404);
      return json(await adminStats(stores));
    }

    /* ---------- phone notifications (Web Push) ---------- */
    if (seg[1] === "push") {
      if (seg[2] === "key" && M === "GET") return json({ key: (await vapidKeys(users)).publicKey });
      if (seg[2] === "subscribe" && M === "POST") {
        const sub = cleanSubscription((await readBody(req)).sub);
        if (!sub) throw new HttpError(400, "bad_subscription");
        await saveDevice(users, me.id, sub);
        return json({ ok: true });
      }
      if (seg[2] === "status" && M === "POST") return json({ on: await hasDevice(users, me.id, (await readBody(req)).endpoint) });
      if (seg[2] === "unsubscribe" && M === "POST") { await removeDevice(users, me.id, (await readBody(req)).endpoint); return json({ ok: true }); }
      return json({ error: "not_found" }, 404);
    }

    /* ---------- where to eat (OpenStreetMap data) ---------- */
    if ((seg[1] === "places" || seg[1] === "geocode") && seg.length === 2) {
      if (M !== "GET") return json({ error: "method_not_allowed" }, 405);
      limitPerUser(me.id);
      return json(seg[1] === "places" ? await searchPlaces(url.searchParams, deps) : await findPlace(url.searchParams, deps));
    }

    /* ---------- groups ---------- */
    if (seg[1] !== "groups") return json({ error: "not_found" }, 404);

    if (seg.length === 2) {
      if (M !== "POST") return json({ error: "method_not_allowed" }, 405);
      const { meta } = await readBody(req);
      const g = newGroup(meta, me.profile, me.id);
      await groups.setJSON(g.id, g);
      await addGroupToUser(users, me, g.id);
      return json({ group: viewFor(g, me.id) }, 201);
    }

    const id = seg[2];
    if (!validGroupId(id)) return json({ error: "not_found" }, 404);
    const action = seg[3];
    const invite = url.searchParams.get("t") || "";

    const loadMember = async () => {
      const g = await groups.get(id, { type: "json" });
      if (!g || !memberOf(g, me.id)) throw new HttpError(404, "not_found");
      return g;
    };

    if (!action && M === "GET") {
      const g = await loadMember();
      if (url.searchParams.get("rev") === String(g.rev)) return json({ unchanged: true, rev: g.rev });
      return json({ group: viewFor(g, me.id) });
    }

    if (action === "ops" && M === "POST") {
      const { ops } = await readBody(req);
      let before = null;
      const g = await mutate(groups, id, g => {
        if (!memberOf(g, me.id)) throw new HttpError(404, "not_found");
        before = structuredClone(g);   // taken again on every retry, so it always matches what was written
        applyOps(g, ops, me.id);
        return g;
      });
      await notify(users, eventsOf(before, g, me.id), deps.send);
      return json({ group: viewFor(g, me.id) });
    }

    if (action === "preview" && M === "GET") {
      const g = await groups.get(id, { type: "json" });
      if (!g || g.token !== invite) throw new HttpError(404, "bad_invite");
      return json({ preview: previewOf(g), joined: !!memberOf(g, me.id) });
    }

    if (action === "join" && M === "POST") {
      const { claim } = await readBody(req);
      const g = await mutate(groups, id, g => {
        if (g.token !== invite) throw new HttpError(404, "bad_invite");
        joinGroup(g, me.id, me.profile, claim || null);
        return g;
      });
      await addGroupToUser(users, me, id);
      return json({ group: viewFor(g, me.id) });
    }

    if (action === "leave" && M === "POST") {
      // You can't walk away from a group while you still owe someone in it.
      const g = await groups.get(id, { type: "json" });
      const m = g && memberOf(g, me.id);
      if (m) { const owed = amountOwed(g, m.id); if (owed > 0) return json({ error: "still_owe", amount: owed }, 409); }
      await mutate(users, userKey(me.username), u => { u.groups = (u.groups || []).filter(x => x !== id); });
      return json({ ok: true });
    }

    if (!action && M === "DELETE") {
      const g = await loadMember();
      if (g.owner !== memberOf(g, me.id).id) throw new HttpError(403, "owner_only");
      if (hasOpenDebts(g)) throw new HttpError(409, "has_debts");   // nobody's debts vanish with the group
      await groups.delete(id);
      await mutate(users, userKey(me.username), u => { u.groups = (u.groups || []).filter(x => x !== id); });
      return json({ ok: true });
    }

    return json({ error: "method_not_allowed" }, 405);
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    console.error(e);
    return json({ error: "server_error" }, 500);
  }
}

export const config = { path: "/api/*" };
