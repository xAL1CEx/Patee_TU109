// Accounts: password hashing, signed session tokens and input rules. Pure Node, no Netlify imports.
import { scrypt, randomBytes, timingSafeEqual, createHmac } from "node:crypto";
import { promisify } from "node:util";
import { HttpError } from "./groups.mjs";

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;
export const SESSION_DAYS = 60;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  const key = await scryptAsync(password.normalize("NFKC"), salt, KEYLEN, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt}$${key.toString("base64url")}`;
}

export async function verifyPassword(password, stored) {
  const [alg, salt, hash] = String(stored || "").split("$");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const key = await scryptAsync(String(password).normalize("NFKC"), salt, KEYLEN, { N: 16384, r: 8, p: 1 });
  const want = Buffer.from(hash, "base64url");
  return want.length === key.length && timingSafeEqual(want, key);
}

export const newSecret = () => randomBytes(32).toString("base64url");

const sign = (data, secret) => createHmac("sha256", secret).update(data).digest("base64url");

// token = base64url(JSON{u: username, i: userId, v: sessionVersion, e: expiry ms}) + "." + hmac
export function signSession(user, secret, now = Date.now()) {
  const body = Buffer.from(JSON.stringify({ u: user.username, i: user.id, v: user.sv || 0, e: now + SESSION_DAYS * 864e5 })).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function readSession(token, secret, now = Date.now()) {
  const [body, mac] = String(token || "").split(".");
  if (!body || !mac) return null;
  const want = Buffer.from(sign(body, secret));
  const got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    return p.e > now ? p : null;
  } catch { return null; }
}

export function cleanUsername(v) {
  const u = String(v || "").trim().toLowerCase();
  if (!/^[a-z0-9_.]{3,20}$/.test(u)) throw new HttpError(400, "bad_username");
  return u;
}

export function checkPassword(v) {
  const p = String(v || "");
  if (p.length < 8 || p.length > 200) throw new HttpError(400, "bad_password");
  return p;
}

const str = (v, max) => String(v ?? "").trim().slice(0, max);
export function cleanProfile(p = {}) {
  const pp = String(p.pp || "").replace(/\D/g, "");
  if (pp && ![10, 13, 15].includes(pp.length)) throw new HttpError(400, "bad_promptpay");
  const out = { name: str(p.name, 30), pp, bank: str(p.bank, 40), acct: str(p.acct, 30) };
  if (!out.name) throw new HttpError(400, "bad_name");
  return out;
}

export function readCookie(req, name) {
  const raw = req.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export function sessionCookie(name, value, req, maxAgeSec) {
  const secure = new URL(req.url).protocol === "https:" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`;
}
