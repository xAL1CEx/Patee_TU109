// In-memory stand-in for a Netlify Blobs store (only the calls the API uses).
export function memStore() {
  const m = new Map();
  let n = 0;
  return {
    async get(key) { const v = m.get(key); return v ? structuredClone(v.data) : null; },
    async getWithMetadata(key) { const v = m.get(key); return v ? { data: structuredClone(v.data), etag: v.etag, metadata: {} } : null; },
    async setJSON(key, data, opts = {}) {
      const cur = m.get(key);
      if (opts.onlyIfMatch && (!cur || cur.etag !== opts.onlyIfMatch)) return { modified: false };
      if (opts.onlyIfNew && cur) return { modified: false };
      const etag = "e" + ++n;
      m.set(key, { data: structuredClone(data), etag });
      return { modified: true, etag };
    },
    async delete(key) { m.delete(key); },
    _map: m,
  };
}
