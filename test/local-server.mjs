// Quick local preview without the Netlify CLI: serves public/ and the API with an in-memory store.
// Data is lost when the server stops. Run: node test/local-server.mjs  (http://localhost:8787)
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
// Local keys (e.g. FOURSQUARE_API_KEY) live in an untracked .env file next to package.json
try { process.loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url))); } catch { /* no .env: that's fine */ }
import { handle } from "../netlify/functions/api.mjs";
import { memStore } from "./memstore.mjs";

const root = fileURLToPath(new URL("../public/", import.meta.url));
const stores = { groups: memStore(), users: memStore() };
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };
const port = Number(process.env.PORT || 8787);

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const r = await handle(new Request(url, { method: req.method, headers: { cookie: req.headers.cookie || "" }, body: ["GET", "HEAD"].includes(req.method) ? undefined : body }), stores);
    const h = Object.fromEntries(r.headers);
    const sc = r.headers.getSetCookie?.();
    if (sc && sc.length) h["set-cookie"] = sc;
    res.writeHead(r.status, h);
    res.end(Buffer.from(await r.arrayBuffer()));
    return;
  }
  const path = normalize(join(root, url.pathname === "/" ? "index.html" : url.pathname));
  if (!path.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const data = await readFile(path);
    res.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream" }).end(data);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(port, () => console.log(`Splitly local preview: http://localhost:${port}`));
