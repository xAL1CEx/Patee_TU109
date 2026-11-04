import assert from "node:assert/strict";
import { handle } from "../netlify/functions/api.mjs";
import { memStore } from "./memstore.mjs";

const stores = { groups: memStore(), users: memStore() };

// A tiny "phone": keeps its own session cookie.
function phone() {
  let cookie = "";
  return async (method, path, body) => {
    const res = await handle(new Request("https://splitly.test" + path, {
      method, headers: { cookie }, body: body ? JSON.stringify(body) : undefined,
    }), stores);
    const sc = res.headers.get("set-cookie");
    if (sc) cookie = sc.split(";")[0];
    return { status: res.status, body: await res.json(), setCookie: sc };
  };
}

let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log("ok -", name); };

const ton = phone(), prae = phone(), stranger = phone();
const tonProfile = { name: "ต้น", pp: "0812345678", bank: "กสิกรไทย", acct: "012-3-45678-9" };

await test("sign up needs a nickname and a valid username/password", async () => {
  assert.equal((await ton("POST", "/api/auth/register", { username: "ton", password: "secret123", profile: { name: "" } })).body.error, "bad_name");
  assert.equal((await ton("POST", "/api/auth/register", { username: "t", password: "secret123", profile: tonProfile })).body.error, "bad_username");
  assert.equal((await ton("POST", "/api/auth/register", { username: "ton", password: "short", profile: tonProfile })).body.error, "bad_password");
});

await test("sign up must pick PromptPay or a bank account, and fill it in", async () => {
  const reg = profile => ton("POST", "/api/auth/register", { username: "payer", password: "secret123", profile });
  assert.equal((await reg({ name: "x" })).body.error, "bad_bank");
  assert.equal((await reg({ name: "x", pay: "pp", pp: "" })).body.error, "bad_promptpay");
  assert.equal((await reg({ name: "x", pay: "pp", pp: "12345" })).body.error, "bad_promptpay");
  assert.equal((await reg({ name: "x", pay: "bank", bank: "", acct: "1234567890" })).body.error, "bad_bank");
  assert.equal((await reg({ name: "x", pay: "bank", bank: "กสิกรไทย", acct: "12345" })).body.error, "bad_acct");
  const ok = await phone()("POST", "/api/auth/register", { username: "payer", password: "secret123", profile: { name: "x", pay: "bank", bank: "กสิกรไทย", acct: "123-4-56789-0", pp: "0812345678" } });
  assert.equal(ok.status, 201);
  assert.deepEqual([ok.body.user.profile.pay, ok.body.user.profile.pp, ok.body.user.profile.acct], ["bank", "", "123-4-56789-0"], "only the chosen method is kept");
});

await test("sign up sets an HttpOnly session cookie", async () => {
  const r = await ton("POST", "/api/auth/register", { username: "Ton", password: "secret123", profile: tonProfile });
  assert.equal(r.status, 201);
  assert.equal(r.body.user.username, "ton");
  assert.equal(r.body.user.pass, undefined, "password hash must never be sent");
  assert.match(r.setCookie, /HttpOnly/);
  assert.match(r.setCookie, /Secure/);
});

await test("usernames are unique (case-insensitive), even when racing", async () => {
  const a = phone(), b = phone();
  const r = await stranger("POST", "/api/auth/register", { username: "TON", password: "other1234", profile: { name: "อีกคน", pp: "0811111111" } });
  assert.equal(r.status, 409);
  assert.equal(r.body.error, "username_taken");
  const [x, y] = await Promise.all([
    a("POST", "/api/auth/register", { username: "same", password: "password1", profile: { name: "A", pp: "0811111112" } }),
    b("POST", "/api/auth/register", { username: "same", password: "password2", profile: { name: "B", pay: "bank", bank: "กสิกรไทย", acct: "123-4-56789-0" } }),
  ]);
  assert.deepEqual([x.status, y.status].sort(), [201, 409]);
});

await test("signed-out requests are refused", async () => {
  assert.equal((await stranger("GET", "/api/me")).status, 401);
  assert.equal((await stranger("POST", "/api/groups", { meta: { name: "x" } })).status, 401);
});

let gid, invite;
await test("host creates a group and gets an invite", async () => {
  const r = await ton("POST", "/api/groups", { meta: { name: "ทริปเชียงใหม่", kind: "ทริป" } });
  assert.equal(r.status, 201);
  gid = r.body.group.id; invite = r.body.group.invite;
  assert.ok(gid && invite);
  assert.equal(r.body.group.members[r.body.group.me].name, "ต้น");
  assert.equal(r.body.group.members[r.body.group.me].uid, undefined, "account ids are not exposed");
  const me = await ton("GET", "/api/me");
  assert.deepEqual(me.body.groups.map(g => g.id), [gid]);
});

await test("group dates: end may not be before start", async () => {
  const mk = meta => ton("POST", "/api/groups", { meta: { name: "d", ...meta } });
  assert.equal((await mk({ start: "2026-12-03", end: "2026-12-01" })).body.error, "bad_dates");
  assert.equal((await mk({ start: "", end: "2026-12-01" })).body.error, "bad_dates");
  assert.equal((await mk({ start: "3 Dec" })).body.error, "bad_dates");
  const r = await mk({ start: "2026-12-01", end: "2026-12-03", dates: "1–3 ธ.ค." });
  assert.equal(r.status, 201);
  assert.deepEqual([r.body.group.start, r.body.group.end], ["2026-12-01", "2026-12-03"]);
  assert.equal((await ton("POST", `/api/groups/${r.body.group.id}/ops`, { ops: [{ op: "meta", doc: { start: "2026-12-05", end: "2026-12-04" } }] })).status, 400);
  await ton("DELETE", `/api/groups/${r.body.group.id}`);
});

let offlineId;
await test("host adds a friend who has no account yet", async () => {
  offlineId = "off1";
  const r = await ton("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "members", id: offlineId, doc: { name: "แพร (จดไว้)", uid: "hijack", claimed: true } }] });
  assert.equal(r.body.group.members[offlineId].claimed, false, "client cannot mark an entry as claimed");
});

await test("non-members cannot read the group, even signed in", async () => {
  await prae("POST", "/api/auth/register", { username: "prae", password: "praepass1", profile: { name: "แพร", pp: "0898765432" } });
  assert.equal((await prae("GET", `/api/groups/${gid}`)).status, 404);
  assert.equal((await prae("GET", `/api/groups/${gid}/preview?t=wrong`)).status, 404);
});

await test("friend previews and claims the entry the host made", async () => {
  const p = await prae("GET", `/api/groups/${gid}/preview?t=${invite}`);
  assert.equal(p.body.preview.name, "ทริปเชียงใหม่");
  assert.equal(p.body.joined, false);
  const j = await prae("POST", `/api/groups/${gid}/join?t=${invite}`, { claim: offlineId });
  assert.equal(j.status, 200);
  assert.equal(j.body.group.me, offlineId);
  assert.equal(j.body.group.members[offlineId].name, "แพร");
  assert.equal(j.body.group.members[offlineId].claimed, true);
  const again = await stranger("POST", "/api/auth/register", { username: "third", password: "thirdpass", profile: { name: "สาม", pp: "0811111113" } });
  assert.equal(again.status, 201);
  assert.equal((await stranger("POST", `/api/groups/${gid}/join?t=${invite}`, { claim: offlineId })).body.error, "already_claimed");
});

await test("nobody can edit or remove someone else's account member", async () => {
  const g = (await ton("GET", `/api/groups/${gid}`)).body.group;
  const r = await ton("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "members", id: offlineId, doc: { name: "แก้ชื่อ" } }] });
  assert.equal(r.status, 403);
  assert.equal((await ton("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "del", col: "members", id: offlineId }] })).status, 403);
  const own = await prae("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "members", id: offlineId, doc: { name: "แพรวา", pp: "0898765432" } }] });
  assert.equal(own.body.group.members[offlineId].name, "แพรวา");
  assert.equal(own.body.group.members[offlineId].claimed, true);
  assert.ok(g.members[g.me]);
});

await test("expenses sync between the two accounts; rev polling", async () => {
  const r = await prae("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "expenses", id: "e1", doc: { trip: gid, title: "ข้าวซอย", amount: 900 } }] });
  const rev = r.body.group.rev;
  assert.deepEqual((await ton("GET", `/api/groups/${gid}?rev=${rev}`)).body, { unchanged: true, rev });
  assert.equal((await ton("GET", `/api/groups/${gid}`)).body.group.expenses.e1.amount, 900);
});

await test("concurrent writes from both phones all survive", async () => {
  const w = (p, n) => p("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "expenses", id: "c" + n, doc: { amount: n } }] });
  const rs = await Promise.all([w(ton, 1), w(prae, 2), w(ton, 3), w(prae, 4)]);
  rs.forEach(r => assert.equal(r.status, 200));
  const ids = Object.keys((await ton("GET", `/api/groups/${gid}`)).body.group.expenses);
  for (const id of ["c1", "c2", "c3", "c4"]) assert.ok(ids.includes(id));
});

await test("log in on a new device sees the same groups", async () => {
  const laptop = phone();
  assert.equal((await laptop("POST", "/api/auth/login", { username: "prae", password: "wrong-pass" })).status, 401);
  const r = await laptop("POST", "/api/auth/login", { username: "PRAE", password: "praepass1" });
  assert.equal(r.status, 200);
  assert.deepEqual((await laptop("GET", "/api/me")).body.groups.map(g => g.id), [gid]);
});

await test("too many wrong passwords locks the username for a while", async () => {
  const bad = phone();
  for (let i = 0; i < 8; i++) await bad("POST", "/api/auth/login", { username: "ton", password: "nope" + i });
  assert.equal((await bad("POST", "/api/auth/login", { username: "ton", password: "secret123" })).body.error, "too_many_attempts");
  stores.users._map.delete("fail:ton");
});

await test("password change signs out other devices", async () => {
  const other = phone();
  await other("POST", "/api/auth/login", { username: "ton", password: "secret123" });
  const r = await ton("POST", "/api/auth/password", { current: "secret123", next: "newsecret99" });
  assert.equal(r.status, 200);
  assert.equal((await other("GET", "/api/me")).status, 401);
  assert.equal((await ton("GET", "/api/me")).status, 200, "the device that changed it stays signed in");
});

await test("only the creator can delete; leaving keeps history", async () => {
  assert.equal((await prae("DELETE", `/api/groups/${gid}`)).status, 403);
  await prae("POST", `/api/groups/${gid}/leave`);
  assert.deepEqual((await prae("GET", "/api/me")).body.groups, []);
  assert.equal((await ton("DELETE", `/api/groups/${gid}`)).status, 200);
  assert.equal((await ton("GET", `/api/groups/${gid}`)).status, 404);
});

await test("logout clears the cookie", async () => {
  const r = await ton("POST", "/api/auth/logout");
  assert.match(r.setCookie, /Max-Age=0/);
  assert.equal((await ton("GET", "/api/me")).status, 401);
});

console.log(`\n${passed} tests passed`);
