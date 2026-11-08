import assert from "node:assert/strict";
import { handle } from "../netlify/functions/api.mjs";
import { inferCuisine } from "../netlify/lib/places.mjs";
import { memStore } from "./memstore.mjs";
delete process.env.FOURSQUARE_API_KEY;   // tests must never depend on a real key

const stores = { groups: memStore(), users: memStore() };

// A tiny "phone": keeps its own session cookie.
function phone(deps) {
  let cookie = "";
  return async (method, path, body) => {
    const res = await handle(new Request("https://splitly.test" + path, {
      method, headers: { cookie }, body: body ? JSON.stringify(body) : undefined,
    }), stores, deps);
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

let gid, invite, tonMid;
await test("host creates a group and gets an invite", async () => {
  const r = await ton("POST", "/api/groups", { meta: { name: "ทริปเชียงใหม่", kind: "ทริป" } });
  assert.equal(r.status, 201);
  gid = r.body.group.id; invite = r.body.group.invite; tonMid = r.body.group.me;
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
  const r = await prae("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "expenses", id: "e1", doc: { trip: gid, title: "ข้าวซอย", amount: 900, payer: offlineId, split: { [offlineId]: 450, [tonMid]: 450 } } }] });
  const rev = r.body.group.rev;
  assert.deepEqual((await ton("GET", `/api/groups/${gid}?rev=${rev}`)).body, { unchanged: true, rev });
  assert.equal((await ton("GET", `/api/groups/${gid}`)).body.group.expenses.e1.amount, 900);
});

await test("concurrent writes from both phones all survive", async () => {
  const w = (p, n) => { const who = p === ton ? tonMid : offlineId; return p("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "expenses", id: "c" + n, doc: { amount: n, payer: who, split: { [who]: n } } }] }); };
  const rs = await Promise.all([w(ton, 1), w(prae, 2), w(ton, 3), w(prae, 4)]);
  rs.forEach(r => assert.equal(r.status, 200));
  const ids = Object.keys((await ton("GET", `/api/groups/${gid}`)).body.group.expenses);
  for (const id of ["c1", "c2", "c3", "c4"]) assert.ok(ids.includes(id));
});

await test("only the payer records an expense; only who recorded it can change it", async () => {
  const put = (p, id, doc) => p("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "expenses", id, doc }] });
  // ton can't say that prae (who has an account) paid
  assert.equal((await put(ton, "f1", { amount: 300, payer: offlineId, split: { [tonMid]: 300 } })).body.error, "payer_must_record");
  // ...but can record for a friend with no account
  await ton("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "put", col: "members", id: "nobody", doc: { name: "บอส" } }] });
  const ok = await put(ton, "f2", { amount: 300, payer: "nobody", split: { [tonMid]: 150, nobody: 150 }, by: offlineId });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.group.expenses.f2.by, tonMid, "the server sets who recorded it");
  // prae can't edit or delete what ton or prae's friends didn't let her
  assert.equal((await put(prae, "f2", { amount: 1, payer: "nobody", split: { nobody: 1 } })).body.error, "not_your_expense");
  assert.equal((await prae("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "del", col: "expenses", id: "f2" }] })).body.error, "not_your_expense");
  assert.equal((await ton("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "del", col: "expenses", id: "e1" }] })).body.error, "not_your_expense");
  // amounts and splits must add up
  assert.equal((await put(ton, "f3", { amount: 100, payer: tonMid, split: { [tonMid]: 60 } })).body.error, "bad_split");
  assert.equal((await put(ton, "f4", { amount: -5, payer: tonMid, split: { [tonMid]: -5 } })).body.error, "bad_amount");
  // the owner can still edit and delete their own
  assert.equal((await put(ton, "f2", { amount: 200, payer: "nobody", split: { [tonMid]: 100, nobody: 100 } })).status, 200);
  assert.equal((await ton("POST", `/api/groups/${gid}/ops`, { ops: [{ op: "del", col: "expenses", id: "f2" }] })).status, 200);
});

await test("you can't leave a group while you still owe someone", async () => {
  // ton owes prae 450 for the ข้าวซอย
  const r = await ton("POST", `/api/groups/${gid}/leave`);
  assert.equal(r.status, 409);
  assert.equal(r.body.error, "still_owe");
  assert.equal(r.body.amount, 450);
  assert.deepEqual((await ton("GET", "/api/me")).body.groups.map(g => g.id), [gid]);
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

await test("a transfer only counts once the receiver confirms it; only they can confirm", async () => {
  const ops = (p, o) => p("POST", `/api/groups/${gid}/ops`, { ops: [o] });
  // ton reports paying prae the 450 he owes
  const r = await ops(ton, { op: "put", col: "payments", id: "pay1", doc: { from: tonMid, to: offlineId, amount: 450, confirmed: true } });
  assert.equal(r.body.group.payments.pay1.confirmed, false, "the sender can't confirm their own transfer");
  // still owing until prae confirms, so ton still can't leave and the group can't be deleted
  assert.equal((await ton("POST", `/api/groups/${gid}/leave`)).body.error, "still_owe");
  assert.equal((await ton("DELETE", `/api/groups/${gid}`)).body.error, "has_debts");
  // nobody else can report transfers for other people, or confirm someone else's
  assert.equal((await ops(prae, { op: "put", col: "payments", id: "pay2", doc: { from: tonMid, to: "nobody", amount: 1 } })).body.error, "not_your_payment");
  assert.equal((await ops(ton, { op: "put", col: "payments", id: "pay1", doc: { confirmed: true } })).body.error, "payment_locked");
  assert.equal((await ops(prae, { op: "put", col: "payments", id: "pay1", doc: { amount: 1, confirmed: false } })).body.error, "payment_locked");
  // prae confirms; now ton is clear
  const c = await ops(prae, { op: "put", col: "payments", id: "pay1", doc: { confirmed: true, amount: 1 } });
  assert.equal(c.body.group.payments.pay1.confirmed, true);
  assert.equal(c.body.group.payments.pay1.amount, 450, "confirming can't change the amount");
  // the sender can no longer withdraw a confirmed transfer
  assert.equal((await ops(ton, { op: "del", col: "payments", id: "pay1" })).body.error, "payment_locked");
});

await test("only the creator can delete, and only once nobody owes anybody; leaving keeps history", async () => {
  assert.equal((await prae("DELETE", `/api/groups/${gid}`)).status, 403);
  await prae("POST", `/api/groups/${gid}/leave`);
  assert.deepEqual((await prae("GET", "/api/me")).body.groups, []);
  assert.equal((await ton("DELETE", `/api/groups/${gid}`)).status, 200);
  assert.equal((await ton("GET", `/api/groups/${gid}`)).status, 404);
});

/* ---------- where to eat ---------- */
const el = (type, id, lat, lon, tags) => ({ type, id, ...(type === "way" ? { center: { lat, lon } } : { lat, lon }), tags });
const OVERPASS = { elements: [
  el("node", 1, 13.7470, 100.5350, { name: "ครัวอร่อย", cuisine: "Thai; Barbecue", website: "javascript:alert(1)", phone: "02-123 4567", amenity: "restaurant" }),
  el("way", 2, 13.7468, 100.5351, { name: "ครัวอร่อย", amenity: "restaurant" }),                       // same place mapped twice
  el("way", 3, 13.7500, 100.5360, { name: "Hot Pot House", cuisine: "hot pot", website: "www.example.com/menu", opening_hours: "Mo-Su 10:00-22:00" }),
  el("node", 4, 13.7471, 100.5352, { cuisine: "thai" }),                                              // no name
  { type: "node", id: 5, tags: { name: "ไม่มีพิกัด" } },                                              // no position
  el("node", 6, 13.7480, 100.5340, { name: "<img src=x onerror=alert(1)>", phone: "ไม่ใช่เบอร์" }),
] };
const okJson = body => ({ ok: true, status: 200, json: async () => body });

await test("restaurant search: needs login, stays inside Thailand, cleans the data, falls back to another mirror, caches", async () => {
  const calls = [];
  const fakeFetch = async (url) => {
    calls.push(url);
    if (url.includes("openstreetmap.fr")) return { ok: false, status: 500, json: async () => ({}) };
    return okJson(OVERPASS);
  };
  const eater = phone({ fetch: fakeFetch, hedgeMs: 10 });
  assert.equal((await phone({ fetch: async () => { throw new Error("must not be called"); } })("GET", "/api/places?lat=13.7466&lng=100.5347")).status, 401);   // signed out
  await eater("POST", "/api/auth/register", { username: "eater", password: "eatpass123", profile: { name: "กิน", pp: "0811110000" } });
  assert.equal((await eater("GET", "/api/places?lat=51.5&lng=-0.1")).body.error, "outside_thailand");
  assert.equal((await eater("GET", "/api/places?lat=abc&lng=100")).body.error, "bad_location");
  assert.equal((await eater("GET", "/api/places")).body.error, "bad_location");

  const r = await eater("GET", "/api/places?lat=13.7466&lng=100.5347&r=1000");
  assert.equal(r.status, 200);
  const names = r.body.places.map(p => p.name);
  assert.equal(names.length, 3, "unnamed, positionless and duplicate entries are dropped");
  assert.equal(names[0], "ครัวอร่อย", "nearest first");
  const first = r.body.places[0];
  assert.deepEqual(first.cuisine, ["thai", "barbecue"]);
  assert.equal(first.web, "", "javascript: links are never passed on");
  assert.equal(first.phone, "02-123 4567");
  const pot = r.body.places.find(p => p.name === "Hot Pot House");
  assert.equal(pot.web, "https://www.example.com/menu");
  assert.equal(pot.hours, "Mo-Su 10:00-22:00");
  assert.equal(r.body.places.find(p => p.name.startsWith("<img")).phone, "", "junk phone numbers are dropped");
  assert.ok(calls[0].includes("openstreetmap.fr") && calls.some(u => u.includes("overpass-api.de")), "tried the next mirror after a failure");

  const before = calls.length;
  await eater("GET", "/api/places?lat=13.7466&lng=100.5347&r=1000");
  assert.equal(calls.length, before, "same search again is served from the cache");
  assert.equal((await eater("GET", "/api/places?lat=13.7466&lng=100.5347&r=99999")).status, 200, "odd radius falls back to a safe one");
});

await test("restaurant search: an 'I gave up' answer from one mirror is skipped, not shown or cached", async () => {
  const seen = [];
  const f = async (url) => { seen.push(url); return url.includes("openstreetmap.fr") ? okJson({ elements: [], remark: "runtime error: Query timed out" }) : okJson(OVERPASS); };
  const u = phone({ fetch: f, hedgeMs: 10 });
  await u("POST", "/api/auth/register", { username: "remarkuser", password: "remarkpass1", profile: { name: "ร", pp: "0811110004" } });
  const r = await u("GET", "/api/places?lat=16.4322&lng=102.8236&r=2000");
  assert.equal(r.body.places.length, 3, "got the real answer from the next mirror");
  assert.ok(seen.some(x => x.includes("overpass-api.de")));
});

await test("restaurant search: all sources down gives a clear error", async () => {
  const down = phone({ fetch: async () => { throw new Error("offline"); }, hedgeMs: 5 });
  await down("POST", "/api/auth/register", { username: "downuser", password: "downpass123", profile: { name: "ด", pp: "0811110001" } });
  const r = await down("GET", "/api/places?lat=18.7999&lng=98.9677");
  assert.equal(r.status, 503);
  assert.equal(r.body.error, "places_unavailable");
});

await test("place-name lookup works, rejects too-short text and is cached", async () => {
  let n = 0;
  const geo = phone({ fetch: async (url) => { n++; assert.ok(url.includes("countrycodes=th")); return okJson([{ name: "สยามพารากอน", display_name: "สยามพารากอน, ปทุมวัน, กรุงเทพมหานคร, ประเทศไทย", lat: "13.7468", lon: "100.5347" }, { lat: "x", lon: "y", name: "bad" }]); } });
  await geo("POST", "/api/auth/register", { username: "geouser", password: "geopass1234", profile: { name: "จ", pp: "0811110002" } });
  assert.equal((await geo("GET", "/api/geocode?q=a")).body.error, "bad_query");
  const r = await geo("GET", "/api/geocode?q=" + encodeURIComponent("สยามพารากอน"));
  assert.equal(r.body.results.length, 1, "entries without a valid position are dropped");
  assert.deepEqual([r.body.results[0].name, r.body.results[0].lat], ["สยามพารากอน", 13.7468]);
  await geo("GET", "/api/geocode?q=" + encodeURIComponent("สยามพารากอน"));
  assert.equal(n, 1, "second lookup is cached");
});

await test("place-name lookup: abbreviations are spelled out, bus stops come last, other spellings are tried", async () => {
  const asked = [];
  const fake = async (url) => {
    const q = decodeURIComponent(url.split("q=")[1]);
    asked.push(q);
    if (q.includes("ไหน")) return okJson([]);
    return okJson([
      { name: "ป้ายรถเมล์", type: "bus_stop", display_name: "ป้ายรถเมล์, รังสิต", lat: "14.07", lon: "100.60" },
      { name: "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", type: "university", display_name: "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต, ปทุมธานี", lat: "14.0728", lon: "100.6069" },
    ]);
  };
  const g = phone({ fetch: fake });
  await g("POST", "/api/auth/register", { username: "aliasuser", password: "aliaspass12", profile: { name: "อ", pp: "0811110005" } });
  const r = await g("GET", "/api/geocode?q=" + encodeURIComponent("มธ.รังสิต"));
  assert.equal(asked[0], "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", "the short name is spelled out before asking");
  assert.equal(r.body.results[0].name, "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", "the real place comes first");
  assert.equal(r.body.results[1].name, "ป้ายรถเมล์", "bus stops come last");
  asked.length = 0;
  const none = await g("GET", "/api/geocode?q=" + encodeURIComponent("ที่.ไหน"));
  assert.deepEqual(none.body.results, []);
  assert.equal(asked.length, 2, "tried the text as typed and without the dot");
  await g("GET", "/api/geocode?q=" + encodeURIComponent("ที่.ไหน"));
  assert.equal(asked.length, 4, "'nothing found' is not remembered");
});

const FSQ = { results: [
  { fsq_place_id: "a1", name: "Hot Pot House (ฮอทพอท เฮ้าส์)", latitude: 13.7500, longitude: 100.5361, tel: "02-555 1111", website: "https://hotpot.example", categories: [{ name: "Hotpot Restaurant" }] },  // same place as the OSM entry
  { fsq_place_id: "a2", name: "ร้านส้มตำป้าแดง", latitude: 13.7452, longitude: 100.5352, tel: "081 222 3333", categories: [{ name: "Som Tum Restaurant" }, { name: "Thai Restaurant" }] },
  { fsq_place_id: "a3", name: "Rooftop Beer Bar", latitude: 13.7455, longitude: 100.5350, categories: [{ name: "Beer Bar" }] },
  { fsq_place_id: "a4", name: "ปิดไปแล้ว", latitude: 13.7456, longitude: 100.5351, date_closed: "2024-01-01", categories: [{ name: "Thai Restaurant" }] },
  { fsq_place_id: "a5", name: "Evil Cafe", latitude: 13.7457, longitude: 100.5352, website: "javascript:alert(1)", tel: "x", categories: [{ name: "Cafe" }] },
] };
const router = (log, { osm = true, fsq = 200 } = {}) => async (url, opts = {}) => {
  log.push({ url, opts });
  if (url.includes("places-api.foursquare.com")) return fsq === 200 ? okJson(FSQ) : { ok: false, status: fsq, json: async () => ({}) };
  if (!osm) throw new Error("osm down");
  return okJson(OVERPASS);
};

await test("restaurant search merges Foursquare with OpenStreetMap (free fields only, key never leaves the server)", async () => {
  const log = [];
  const u = phone({ fetch: router(log), hedgeMs: 10, fsqKey: "test-key-123" });
  await u("POST", "/api/auth/register", { username: "mergeuser", password: "mergepass12", profile: { name: "ม", pp: "0811110006" } });
  const r = await u("GET", "/api/places?lat=13.7466&lng=100.5400");
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.sources, ["OpenStreetMap", "Foursquare"]);
  assert.equal(r.body.partial, false, "both sources answered");
  const names = r.body.places.map(p => p.name);
  assert.ok(!names.includes("Rooftop Beer Bar"), "bars are not 'where to eat'");
  assert.ok(!names.includes("ปิดไปแล้ว"), "closed places are dropped");
  assert.equal(names.filter(n => n.startsWith("Hot Pot House")).length, 1, "the same place from both sources is shown once");
  assert.equal(r.body.places.length, 5, "3 from OpenStreetMap + 2 new from Foursquare");
  const pot = r.body.places.find(p => p.name.startsWith("Hot Pot House"));
  assert.equal(pot.phone, "02-555 1111", "the phone number is filled in from Foursquare");
  assert.equal(pot.web, "https://www.example.com/menu", "OpenStreetMap's own data is kept");
  assert.deepEqual(pot.src, ["osm", "fsq"]);
  assert.deepEqual(r.body.places.find(p => p.name === "ร้านส้มตำป้าแดง").cuisine, ["isan", "thai"]);
  const evil = r.body.places.find(p => p.name === "Evil Cafe");
  assert.deepEqual([evil.web, evil.phone], ["", ""], "junk links and phone numbers are dropped");
  const call = log.find(c => c.url.includes("places-api.foursquare.com"));
  assert.equal(call.opts.headers.authorization, "Bearer test-key-123");
  assert.ok(!/photos|rating|hours|price|popularity|tastes/.test(call.url), "only free fields are requested");
  assert.ok(!JSON.stringify(r.body).includes("test-key-123"), "the key is never sent to the browser");
});

await test("restaurant search: a failing source doesn't break it, and a half answer is not kept", async () => {
  const log = [];
  const u = phone({ fetch: router(log, { fsq: 429 }), hedgeMs: 10, fsqKey: "k" });
  await u("POST", "/api/auth/register", { username: "halfuser", password: "halfpass123", profile: { name: "ห", pp: "0811110007" } });
  const r = await u("GET", "/api/places?lat=13.80&lng=100.60");
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.sources, ["OpenStreetMap"], "falls back to OpenStreetMap alone");
  assert.equal(r.body.partial, true, "the app is told the answer is incomplete");
  const fsqCalls = () => log.filter(c => c.url.includes("foursquare")).length;
  const before = fsqCalls();
  await u("GET", "/api/places?lat=13.80&lng=100.60");
  assert.ok(fsqCalls() > before, "asked Foursquare again instead of caching the half answer");

  const only = phone({ fetch: router([], { osm: false }), hedgeMs: 5, fsqKey: "k" });
  await only("POST", "/api/auth/register", { username: "fsqonly", password: "fsqonlypass1", profile: { name: "ฟ", pp: "0811110008" } });
  const r2 = await only("GET", "/api/places?lat=14.5&lng=101.0");
  assert.equal(r2.status, 200, "Foursquare alone is enough when OpenStreetMap is down");
  assert.deepEqual(r2.body.sources, ["Foursquare"]);
  assert.equal(r2.body.partial, true);
  assert.ok(r2.body.places.length >= 2);

  const log3 = [];
  const none = phone({ fetch: router(log3), hedgeMs: 5, fsqKey: "" });
  await none("POST", "/api/auth/register", { username: "nokeyuser", password: "nokeypass12", profile: { name: "น", pp: "0811110009" } });
  await none("GET", "/api/places?lat=15.2&lng=100.3");
  assert.ok(!log3.some(c => c.url.includes("foursquare")), "no key, no Foursquare call");
});

await test("food type is guessed from the name when the data has none", async () => {
  assert.deepEqual(inferCuisine("ก๋วยเตี๋ยวป้าหยวก"), ["noodle"]);
  assert.deepEqual(inferCuisine("Black Canyon Coffee"), ["cafe"]);
  assert.deepEqual(inferCuisine("Starbucks Reserve"), ["cafe"]);
  assert.deepEqual(inferCuisine("Oppa Daek"), ["korean"]);
  assert.deepEqual(inferCuisine("ร้านหมูกระทะลุงหนวด"), ["barbecue"]);
  assert.deepEqual(inferCuisine("ชาบูชิ ชาบู"), ["hot_pot"]);
  assert.deepEqual(inferCuisine("ต้มยำกุ้งแม่น้ำ"), ["thai", "seafood"]);
  assert.deepEqual(inferCuisine("ครัวมี้"), [], "no clear word, no guess");
  assert.deepEqual(inferCuisine(""), []);
  // a place with a cuisine tag keeps it; one without gets a guess
  const log = [];
  const u = phone({ fetch: async () => okJson({ elements: [
    el("node", 21, 15.0010, 101.0010, { name: "Coffee Corner" }),
    el("node", 22, 15.0011, 101.0011, { name: "Coffee Palace", cuisine: "thai" }),
  ] }), hedgeMs: 5, fsqKey: "" });
  await u("POST", "/api/auth/register", { username: "guessuser", password: "guesspass12", profile: { name: "ก", pp: "0811110010" } });
  const r = await u("GET", "/api/places?lat=15.0&lng=101.0");
  assert.deepEqual(r.body.places.find(p => p.name === "Coffee Corner").cuisine, ["cafe"]);
  assert.deepEqual(r.body.places.find(p => p.name === "Coffee Palace").cuisine, ["thai"], "an explicit tag wins over the name");
});

await test("searches are limited per person", async () => {
  const busy = phone({ fetch: async () => okJson(OVERPASS), hedgeMs: 5 });
  await busy("POST", "/api/auth/register", { username: "busyuser", password: "busypass123", profile: { name: "ว", pp: "0811110003" } });
  let last;
  for (let i = 0; i < 21; i++) last = await busy("GET", "/api/places?lat=14.0717&lng=100.6045");
  assert.equal(last.status, 429);
  assert.equal(last.body.error, "slow_down");
});

await test("logout clears the cookie", async () => {
  const r = await ton("POST", "/api/auth/logout");
  assert.match(r.setCookie, /Max-Age=0/);
  assert.equal((await ton("GET", "/api/me")).status, 401);
});

console.log(`\n${passed} tests passed`);
