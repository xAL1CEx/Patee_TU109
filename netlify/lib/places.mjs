// Restaurant search for the "where to eat" feature.
// Data © OpenStreetMap contributors (ODbL): restaurants come from Overpass mirrors, place names from Nominatim.
// If FOURSQUARE_API_KEY is set, Foursquare places (free fields only: name, position, type, phone, website) are merged in.
// Pure logic: network calls go through an injectable fetch, so it can be tested without the internet.
import { HttpError } from "./groups.mjs";

const MIRRORS = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const UA = "Splitly/1.0 (student prototype; https://github.com/xAL1CEx/Patee_TU109)";

const LAT = [5.5, 20.6], LNG = [97.3, 105.7];           // roughly Thailand
const R_MIN = 500, R_MAX = 10000, NEAR = 1500;   // any radius from 0.5 to 10 km in 500 m steps; NEAR is always asked for separately
const PLACES_TTL = 30 * 60 * 1000, GEO_TTL = 24 * 60 * 60 * 1000, CACHE_MAX = 200;
const LIMIT_N = 40, LIMIT_MS = 10 * 60 * 1000;          // searches per person per 10 minutes

const sleep = (ms, signal) => new Promise((ok, no) => {
  const t = setTimeout(ok, ms);
  signal?.addEventListener("abort", () => { clearTimeout(t); no(new Error("aborted")); });
});

/* ---------- small helpers ---------- */
const clip = (v, n) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, n);

function cleanPhone(v) {
  const first = String(v || "").split(/[;,]/)[0].trim();
  return /^\+?[0-9][0-9 ()-]{5,18}[0-9]$/.test(first) ? first : "";
}

// Only plain http(s) links ever reach the browser (no javascript: etc.).
function cleanUrl(v) {
  let s = String(v || "").split(";")[0].trim();
  if (!s) return "";
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.href.length <= 200 ? u.href : "";
  } catch { return ""; }
}

const rad = d => d * Math.PI / 180;
function meters(lat1, lng1, lat2, lng2) {
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return Math.round(2 * 6371000 * Math.asin(Math.sqrt(a)));
}

/* ---------- input checks ---------- */
export function cleanCoords(lat, lng) {
  if (lat == null || lng == null || String(lat).trim() === "" || String(lng).trim() === "") throw new HttpError(400, "bad_location");
  const la = Number(lat), ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) throw new HttpError(400, "bad_location");
  if (la < LAT[0] || la > LAT[1] || ln < LNG[0] || ln > LNG[1]) throw new HttpError(400, "outside_thailand");
  return { lat: la, lng: ln };
}

export function cleanRadius(r) {
  const n = Number(r);
  if (r == null || String(r).trim() === "" || !Number.isFinite(n)) return 1000;
  return Math.min(R_MAX, Math.max(R_MIN, Math.round(n / 500) * 500));
}

/* ---------- per-person limit and small caches (in memory: lasts while the function instance is warm) ---------- */
const hits = new Map();
export function limitPerUser(uid, now = Date.now()) {
  const recent = (hits.get(uid) || []).filter(t => now - t < LIMIT_MS);
  if (recent.length >= LIMIT_N) throw new HttpError(429, "slow_down");
  recent.push(now);
  hits.set(uid, recent);
}

const cache = new Map();
function cached(key, ttl, now = Date.now()) {
  const e = cache.get(key);
  return e && now - e.at < ttl ? e.value : null;
}
function remember(key, value, now = Date.now()) {
  cache.set(key, { at: now, value });
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
}

/* ---------- guess the food type from the name when the data doesn't say ---------- */
// Many places have no cuisine tag. A few clear words in the name are enough to put them under the right filter.
const NAME_RULES = [
  [/กาแฟ|คาเฟ่|coffee|café|cafe|espresso|roaster|latte|starbucks|สตาร์บัคส์|amazon|อเมซอน|inthanin|อินทนิล|arabica|punthai|พันธุ์ไทย|dean & deluca/i, "cafe"],
  [/ชานม|ชาไข่มุก|ไข่มุก|bubble|boba|matcha|มัทฉะ/i, "bubble_tea"],
  [/ก๋วยเตี๋ยว|ก๊วยเตี๋ยว|เตี๋ยว|noodle|บะหมี่|เย็นตาโฟ|ราดหน้า|ผัดซีอิ๊ว|ข้าวซอย/i, "noodle"],
  [/ราเมน|ramen/i, "ramen"],
  [/ชาบู|shabu|สุกี้|หม้อไฟ|hot ?pot|mookata/i, "hot_pot"],
  [/หมูกระทะ|ปิ้งย่าง|บาร์บีคิว|bbq|barbecue|yakiniku|ยากินิกุ|เนื้อย่าง|grill/i, "barbecue"],
  [/บุฟเฟ่ต์|บุฟเฟ่|buffet/i, "buffet"],
  [/ซูชิ|sushi|ซาซิมิ|sashimi|โอมากาเสะ|omakase/i, "sushi"],
  [/ญี่ปุ่น|japan|izakaya|อิซากายะ|ข้าวหน้า|ทงคัตสึ|tonkatsu|udon|อุด้ง|โยชิโนยะ|yayoi|ซูกิยะ/i, "japanese"],
  [/เกาหลี|korea|kimchi|กิมจิ|ต๊อกบกกี|tteok|oppa/i, "korean"],
  [/ส้มตำ|อีสาน|ลาบ|isan|ไก่ย่าง|ซุปหน่อไม้/i, "isan"],
  [/ข้าวมันไก่|ข้าวหมูแดง|ข้าวขาหมู|ข้าวแกง|ตามสั่ง|กะเพรา|ผัดไทย|ต้มยำ|thai/i, "thai"],
  [/ติ่มซำ|dim ?sum/i, "dim_sum"],
  [/จีน|chinese|เป็ดย่าง|ซาลาเปา|เกี๊ยว|แต้จิ๋ว|ห้องจีน/i, "chinese"],
  [/ทะเล|seafood|กุ้ง|หอยนางรม/i, "seafood"],
  [/pizza|พิซซ่า|พิซซา/i, "pizza"],
  [/burger|เบอร์เกอร์|mcdonald|แมคโดนัลด์|kfc|เคเอฟซี|burger king/i, "burger"],
  [/steak|สเต็ก|sizzler/i, "steak_house"],
  [/pasta|พาสต้า|spaghetti|สปาเกตตี/i, "pasta"],
  [/sandwich|แซนด์วิช|subway/i, "sandwich"],
  [/เบเกอรี่|bakery|เค้ก|cake|ขนมปัง|โดนัท|donut|ครัวซองต์|croissant/i, "bakery"],
  [/ไอศกรีม|ไอติม|ice ?cream|gelato|เจลาโต้|swensen|baskin/i, "ice_cream"],
  [/ของหวาน|dessert|ขนมหวาน|บิงซู|bingsu|วาฟเฟิล|waffle|น้ำแข็งใส/i, "dessert"],
  [/มังสวิรัติ|vegetarian|vegan|วีแกน/i, "vegetarian"],
  [/สลัด|salad/i, "salad"],
];
export function inferCuisine(name) {
  const n = String(name || "");
  return [...new Set(NAME_RULES.filter(([re]) => re.test(n)).map(([, k]) => k))].slice(0, 3);
}

/* ---------- restaurants (Overpass) ---------- */
export function overpassQuery(lat, lng, r, limit = 200) {
  return `[out:json][timeout:8];nwr(around:${r},${lat},${lng})[amenity~"^(restaurant|food_court)$"][name];out center tags ${limit};`;
}

// Ask the mirrors one after another-ish: the first starts now, the next ones start only if it is slow or fails.
async function overpass(query, fetchFn, hedgeMs) {
  const ctl = new AbortController();
  const stop = setTimeout(() => ctl.abort(), 8500);   // Netlify cuts functions at 10 s
  const attempts = MIRRORS.map((url, i) => (async () => {
    if (i) await sleep(i * hedgeMs, ctl.signal);
    const res = await fetchFn(url, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": UA },
      body: "data=" + encodeURIComponent(query),
      signal: ctl.signal,
    });
    if (!res.ok) throw new Error("http_" + res.status);
    const j = await res.json();
    if (!Array.isArray(j.elements)) throw new Error("bad_response");
    if (/timeout|error|out of memory/i.test(String(j.remark || ""))) throw new Error("overpass_gave_up");   // 200 but an empty/partial answer
    return j;
  })());
  try { return await Promise.any(attempts); }
  catch { throw new HttpError(503, "places_unavailable"); }
  finally { clearTimeout(stop); ctl.abort(); }
}

export function normalize(elements, lat, lng) {
  const out = [];
  for (const el of elements || []) {
    const t = el?.tags || {};
    const name = clip(t["name:th"] || t.name, 80);
    const plat = Number(el.lat ?? el.center?.lat), plng = Number(el.lon ?? el.center?.lon);
    if (!name || !Number.isFinite(plat) || !Number.isFinite(plng)) continue;
    let cuisine = String(t.cuisine || "").toLowerCase().split(";")
      .map(s => s.trim().replace(/\s+/g, "_")).filter(s => /^[a-z_]{2,24}$/.test(s)).slice(0, 3);
    if (!cuisine.length) cuisine = inferCuisine(name);
    out.push({
      id: String(el.type || "n")[0] + String(el.id || "").replace(/\D/g, "").slice(0, 15),
      name, lat: Math.round(plat * 1e5) / 1e5, lng: Math.round(plng * 1e5) / 1e5,
      dist: meters(lat, lng, plat, plng),
      cuisine,
      hours: clip(t.opening_hours, 120),
      phone: cleanPhone(t.phone || t["contact:phone"]),
      web: cleanUrl(t.website || t["contact:website"]),
    });
  }
  out.sort((a, b) => a.dist - b.dist);
  // the same place is often mapped twice (a point and a building outline)
  const kept = [];
  for (const p of out) {
    const twin = kept.find(k => k.name.toLowerCase() === p.name.toLowerCase() && meters(k.lat, k.lng, p.lat, p.lng) < 80);
    if (!twin) { kept.push(p); continue; }
    // keep the nearer entry but fill its gaps from the duplicate
    if (!twin.cuisine.length) twin.cuisine = p.cuisine;
    for (const f of ["hours", "phone", "web"]) if (!twin[f]) twin[f] = p[f];
  }
  return kept.slice(0, 100);
}

/* ---------- Foursquare (optional): only the free fields; photos, ratings and hours are paid ---------- */
const FSQ_URL = "https://places-api.foursquare.com/places/search";
const FSQ_HOST = "places-api.foursquare.com";
const NOT_FOOD = /\b(bar|pub|nightclub|night club|lounge|brewery|cocktail|wine|speakeasy|karaoke|hookah|gastropub)\b/i;
const CUISINE_RULES = [
  [/som tum|isan|northeastern/, "isan"], [/thai/, "thai"], [/dim sum/, "dim_sum"], [/chinese/, "chinese"],
  [/sushi/, "sushi"], [/ramen/, "ramen"], [/japanese|izakaya/, "japanese"], [/korean/, "korean"],
  [/bbq|barbecue|grill|yakiniku/, "barbecue"], [/hot ?pot|shabu/, "hot_pot"], [/buffet/, "buffet"],
  [/seafood/, "seafood"], [/noodle/, "noodle"], [/pizza/, "pizza"], [/italian/, "italian"], [/burger/, "burger"],
  [/steak/, "steak_house"], [/vietnamese/, "vietnamese"], [/indian/, "indian"], [/vegetarian|vegan/, "vegetarian"],
  [/salad/, "salad"], [/sandwich/, "sandwich"], [/bakery/, "bakery"], [/ice cream/, "ice_cream"], [/dessert/, "dessert"],
  [/cafe|coffee|tea room/, "cafe"],
];

async function foursquare(lat, lng, r, key, fetchFn) {
  const ctl = new AbortController();
  const stop = setTimeout(() => ctl.abort(), 6000);
  try {
    let url = `${FSQ_URL}?ll=${lat},${lng}&radius=${r}&limit=50&fsq_category_ids=4d4b7105d754a06374d81259&fields=fsq_place_id,name,latitude,longitude,categories,tel,website,date_closed`;
    const all = [];
    for (let i = 0; i < 3 && url; i++) {
      const res = await fetchFn(url, { headers: { authorization: `Bearer ${key}`, accept: "application/json", "x-places-api-version": "2025-06-17" }, signal: ctl.signal });
      if (!res.ok) throw new Error("http_" + res.status);
      const j = await res.json();
      if (!Array.isArray(j.results)) throw new Error("bad_response");
      all.push(...j.results);
      const next = (res.headers?.get?.("link") || "").match(/<([^>]+)>;\s*rel="next"/)?.[1];
      url = null;
      if (next) { try { const u = new URL(next); if (u.protocol === "https:" && u.host === FSQ_HOST) url = u.href; } catch { /* ignore a bad link */ } }
    }
    return all;
  } finally { clearTimeout(stop); }
}

export function normalizeFsq(results, lat, lng) {
  const out = [];
  for (const r of results || []) {
    const name = clip(r?.name, 80);
    const plat = Number(r?.latitude), plng = Number(r?.longitude);
    if (!name || !Number.isFinite(plat) || !Number.isFinite(plng) || r.date_closed) continue;
    const cats = (r.categories || []).map(c => String(c?.name || "").toLowerCase());
    if (cats[0] && NOT_FOOD.test(cats[0])) continue;                    // bars and nightlife are not "where to eat"
    let cuisine = [...new Set(cats.flatMap(c => CUISINE_RULES.filter(([re]) => re.test(c)).map(([, k]) => k)))].slice(0, 3);
    if (!cuisine.length) cuisine = inferCuisine(name);
    out.push({
      id: "f" + String(r.fsq_place_id || "").replace(/[^a-z0-9]/gi, "").slice(0, 24),
      name, lat: Math.round(plat * 1e5) / 1e5, lng: Math.round(plng * 1e5) / 1e5,
      dist: meters(lat, lng, plat, plng), cuisine, hours: "",
      phone: cleanPhone(r.tel), web: cleanUrl(r.website),
    });
  }
  return out;
}

/* ---------- merging the two sources ---------- */
const THAI = /[฀-๿]+/g;
function nameKeys(n) {
  const s = String(n).toLowerCase();
  return { thai: (s.match(THAI) || []).join(""), latin: s.replace(THAI, " ").replace(/[^a-z0-9]+/g, "") };
}
// Same place if the Thai parts or the English parts of the names contain each other ("Hot Pot House" / "Hot Pot House (ฮอทพอท)").
export function sameName(a, b) {
  const A = nameKeys(a), B = nameKeys(b);
  const hit = (x, y) => x.length >= 3 && y.length >= 3 && (x.includes(y) || y.includes(x));
  return hit(A.thai, B.thai) || hit(A.latin, B.latin);
}

// Put `extra` into `base`: a place found in both is shown once, and gaps in the base entry are filled from the extra one.
function mergeLists(base, extra, cap) {
  const out = base.map(p => ({ ...p, src: [...p.src] }));
  for (const f of extra) {
    const twin = out.find(o => meters(o.lat, o.lng, f.lat, f.lng) < 80 && sameName(o.name, f.name));
    if (!twin) { out.push({ ...f, src: [...f.src] }); continue; }
    if (!twin.cuisine.length) twin.cuisine = f.cuisine;
    for (const k of ["hours", "phone", "web"]) if (!twin[k]) twin[k] = f[k];
    if (!/[฀-๿]/.test(twin.name) && /[฀-๿]/.test(f.name)) twin.name = f.name;
    for (const s of f.src) if (!twin.src.includes(s)) twin.src.push(s);
  }
  out.sort((a, b) => a.dist - b.dist);
  return out.slice(0, cap);
}
export const mergePlaces = (osm, fsq) =>
  mergeLists(osm.map(p => ({ ...p, src: ["osm"] })), fsq.map(p => ({ ...p, src: ["fsq"] })), 150);

// One search area: OpenStreetMap + Foursquare, merged. Cached, but a half answer is never kept.
async function area(lat, lng, r, deps) {
  const key = `s:${lat.toFixed(3)}:${lng.toFixed(3)}:${r}`;
  const hit = cached(key, PLACES_TTL);
  if (hit) return hit;
  const f = deps.fetch || fetch;
  const fsqKey = deps.fsqKey ?? process.env.FOURSQUARE_API_KEY ?? "";
  const [o, q] = await Promise.allSettled([
    overpass(overpassQuery(lat, lng, r, r > 2000 ? 300 : 200), f, deps.hedgeMs ?? 3000),
    fsqKey ? foursquare(lat, lng, r, fsqKey, f) : Promise.resolve(null),
  ]);
  const osmOk = o.status === "fulfilled", fsqOk = q.status === "fulfilled" && Array.isArray(q.value);
  if (!osmOk && !fsqOk) throw new HttpError(503, "places_unavailable");   // one working source is enough
  const value = {
    places: mergePlaces(osmOk ? normalize(o.value.elements, lat, lng) : [], fsqOk ? normalizeFsq(q.value, lat, lng) : []),
    sources: [...(osmOk ? ["OpenStreetMap"] : []), ...(fsqOk ? ["Foursquare"] : [])],
    partial: !osmOk || Boolean(fsqKey && !fsqOk),                          // a source we meant to use didn't answer
  };
  if (!value.partial) remember(key, value);
  return value;
}

export async function searchPlaces(params, deps = {}) {
  const { lat, lng } = cleanCoords(params.get("lat"), params.get("lng"));
  const r = cleanRadius(params.get("r"));
  // Past ~1.5 km a busy city has more places than one query can return, and what comes back is a spread-out sample
  // (not the nearest ones). So the area right around the person is always asked for on its own and kept in full.
  const jobs = [area(lat, lng, r, deps), ...(r > NEAR ? [area(lat, lng, NEAR, deps)] : [])];
  const done = await Promise.allSettled(jobs);
  const ok = done.filter(d => d.status === "fulfilled").map(d => d.value);
  if (!ok.length) throw new HttpError(503, "places_unavailable");
  const [wide, near] = ok.length === 2 ? [ok[0], ok[1]] : [ok[0], null];
  return {
    places: near ? mergeLists(near.places, wide.places, 200) : wide.places,
    radius: r,
    sources: [...new Set(ok.flatMap(a => a.sources))],
    partial: ok.length < jobs.length || ok.some(a => a.partial),
  };
}

/* ---------- place names (Nominatim; its policy: at most one request per second) ---------- */
// Nominatim doesn't understand the short names Thai people use ("มธ.รังสิต" finds a bus stop), so the common ones
// are spelled out first. Keys have no dots, spaces or ฯ.
const ALIASES = {
  "มธรังสิต": "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", "มธศูนย์รังสิต": "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
  "ธรรมศาสตร์รังสิต": "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", "มหาวิทยาลัยธรรมศาสตร์รังสิต": "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
  "turangsit": "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต", "thammasatrangsit": "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
  "มธท่าพระจันทร์": "มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์", "มธ": "มหาวิทยาลัยธรรมศาสตร์", "ธรรมศาสตร์": "มหาวิทยาลัยธรรมศาสตร์",
  "จุฬา": "จุฬาลงกรณ์มหาวิทยาลัย", "มก": "มหาวิทยาลัยเกษตรศาสตร์", "เกษตร": "มหาวิทยาลัยเกษตรศาสตร์",
  "มช": "มหาวิทยาลัยเชียงใหม่", "มข": "มหาวิทยาลัยขอนแก่น", "มอ": "มหาวิทยาลัยสงขลานครินทร์",
  "มหิดล": "มหาวิทยาลัยมหิดล", "มรังสิต": "มหาวิทยาลัยรังสิต", "สจล": "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
  "มจธ": "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี", "มศว": "มหาวิทยาลัยศรีนครินทรวิโรฒ", "มศิลปากร": "มหาวิทยาลัยศิลปากร",
};
const keyOf = q => q.toLowerCase().replace(/[\s.ฯ]/g, "");

// Things that are not really "a place to go to" are listed after the real ones.
const WEAK = new Set(["bus_stop", "proposed", "platform", "stop_position", "construction", "residential", "yes", "station"]);

// What to ask Nominatim, in order: the spelled-out name, the text as typed, the text without dots.
export function placeQueries(q) {
  const alias = ALIASES[keyOf(q)];
  return [...new Set([alias, q, q.replace(/\./g, " ").replace(/\s+/g, " ").trim()].filter(Boolean))].slice(0, 3);
}

let lastGeo = 0;
async function nominatim(q, fetchFn) {
  const now = Date.now(), slot = Math.max(now, lastGeo + 1100);   // take the next free one-second slot
  lastGeo = slot;
  if (slot > now) await sleep(slot - now);
  const res = await fetchFn(`${NOMINATIM}?format=jsonv2&limit=6&countrycodes=th&accept-language=th&q=${encodeURIComponent(q)}`,
    { headers: { "user-agent": UA }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error("http_" + res.status);
  const list = await res.json();
  if (!Array.isArray(list)) throw new Error("bad_response");
  return list;
}

export async function findPlace(params, deps = {}) {
  const q = clip(params.get("q"), 80);
  if (q.length < 2) throw new HttpError(400, "bad_query");
  const key = "g:" + q.toLowerCase();
  const hit = cached(key, GEO_TTL);
  if (hit) return hit;
  let list = [];
  try {
    for (const variant of placeQueries(q)) {
      list = await nominatim(variant, deps.fetch || fetch);
      if (list.length) break;          // stop at the first spelling that finds something
    }
  } catch { throw new HttpError(503, "places_unavailable"); }
  list = list.map((e, i) => ({ e, i, weak: WEAK.has(e.type) })).sort((a, b) => a.weak - b.weak || a.i - b.i).map(x => x.e);
  const value = {
    results: list.slice(0, 5).map(e => ({
      name: clip(e.name || String(e.display_name || "").split(",")[0], 80),
      detail: clip(String(e.display_name || "").split(",").slice(1, 4).join(","), 100),
      lat: Number(e.lat), lng: Number(e.lon),
    })).filter(e => e.name && Number.isFinite(e.lat) && Number.isFinite(e.lng)),
  };
  if (value.results.length) remember(key, value);   // don't remember "nothing found"
  return value;
}
