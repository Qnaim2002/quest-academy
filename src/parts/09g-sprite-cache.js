/* ================= v21: sprite cache (IndexedDB), sprite worker, adaptive quality =================
   1. SPRITES keeps every drawn sheet in IndexedDB, keyed by the sprite-code version (__SPRITE_VER__, a hash
      of the art files made at build time) + quality tier + the sprite key. At launch the sheets used most
      recently are loaded back before the first screen, so nothing has to be redrawn.
   2. SPRW draws sprites in a Web Worker with OffscreenCanvas (dist bundles src/sprite-worker.js from the same
      art code). The idle warm-up queue and the Armory cards use it, so the main thread stays smooth.
      Browsers without OffscreenCanvas simply keep drawing on the main thread.
   3. Quality: "auto" times one sprite at launch; slow devices switch to "lite" (no aura glow, two idle
      poses instead of four, smaller PNGs). Parents can force Full or Lite. */
const SPRITE_VER = typeof __SPRITE_VER__ !== 'undefined' ? __SPRITE_VER__ : 'dev';
const SPRITES = (() => {
  let db = null, opening = null, flushT = 0;
  const pend = new Map(), hot = new Map(), ver = () => SPRITE_VER + ':' + PX.Q.tier, k2 = k => ver() + '|' + k;
  const open = () => opening || (opening = new Promise(res => {
    try {
      const r = indexedDB.open('quest-academy-sprites', 1);
      r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('sheets')) d.createObjectStore('sheets'); if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta'); };
      r.onsuccess = () => { db = r.result; res(db); }; r.onerror = () => res(null); r.onblocked = () => res(null);
    } catch (e) { res(null); }
  }));
  const store = (name, mode) => db.transaction(name, mode).objectStore(name);
  const req = r => new Promise(res => { r.onsuccess = () => res(r.result); r.onerror = () => res(undefined); });
  function put(k, v) { if (import.meta.env.DEV || !v || typeof v !== 'string' && !(v instanceof Blob)) return; pend.set(k, v); if (!flushT) flushT = setTimeout(flush, 2000); }
  async function flush() {
    flushT = 0; if (!pend.size || !(await open())) return;
    const items = [...pend]; pend.clear();
    /* data: URLs from main-thread drawing become Blobs (decoded by fetch, off the main thread) */
    const rows = await Promise.all(items.map(([k, v]) => (typeof v === 'string' && v.startsWith('data:') ? fetch(v).then(r => r.blob()).catch(() => null) : Promise.resolve(v)).then(b => [k, b])));
    try { const st = store('sheets', 'readwrite'), now = Date.now(); rows.forEach(([k, v]) => { if (v) st.put({ v, t: now }, k2(k)); }); } catch (e) { /* storage full or blocked: drawing still works */ }
  }
  function touch(k) { hot.delete(k); hot.set(k, 1); if (hot.size > 260) hot.delete(hot.keys().next().value); }
  async function saveHot() { if (!(await open())) return; try { store('meta', 'readwrite').put([...hot.keys()].slice(-220), 'hot:' + ver()); } catch (e) { /* ignore */ } }
  /* load the sheets used last time into the in-memory cache (gives up after `timeout` ms) */
  async function preload(timeout = 350) {
    const work = (async () => {
      if (!(await open())) return 0;
      const keys = (await req(store('meta', 'readonly').get('hot:' + ver()))) || [];
      const st = store('sheets', 'readonly'), got = await Promise.all(keys.map(k => req(st.get(k2(k))).then(r => [k, r])));
      let n = 0; got.forEach(([k, r]) => { if (r && r.v && !PX.CACHE.has(k)) { PX.CACHE.set(k, typeof r.v === 'string' ? r.v : URL.createObjectURL(r.v)); hot.set(k, 1); n++; } });
      return n;
    })();
    return Promise.race([work, new Promise(r => setTimeout(() => r(-1), timeout))]);
  }
  /* look up one sheet that was not in the hot list */
  async function get(k) { if (import.meta.env.DEV || !(await open())) return null; const r = await req(store('sheets', 'readonly').get(k2(k))); return r && r.v ? (typeof r.v === 'string' ? r.v : URL.createObjectURL(r.v)) : null; }
  /* drop sheets from older art versions, and the oldest ones beyond 1200 */
  async function prune() {
    if (!(await open())) return;
    const all = []; await new Promise(res => { const c = store('sheets', 'readonly').openCursor(); c.onsuccess = () => { const cur = c.result; if (!cur) return res(); all.push([cur.key, cur.value.t || 0]); cur.continue(); }; c.onerror = res; });
    const v = ver(), old = all.filter(([k]) => !k.startsWith(SPRITE_VER + ':')), cur = all.filter(([k]) => k.startsWith(v)).sort((a, b) => a[1] - b[1]);
    const drop = old.concat(cur.slice(0, Math.max(0, cur.length - 1200))).map(([k]) => k);
    if (drop.length) { const st = store('sheets', 'readwrite'); drop.forEach(k => st.delete(k)); }
  }
  addEventListener('pagehide', () => { flush(); saveHot(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { flush(); saveHot(); } });
  return { put, touch, preload, get, flush, saveHot, prune, open, hot };
})();

const SPRW = (() => {
  let w = null, dead = false, seq = 0;
  const waits = new Map(), inflight = new Map();
  const able = () => !dead && typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && OffscreenCanvas.prototype && 'convertToBlob' in OffscreenCanvas.prototype;
  function start() {
    if (w || !able()) return w;
    try {
      w = new Worker(new URL('./sprite-worker.js', import.meta.url), { type: 'module' });
      w.onmessage = e => {
        const { id, key, blob, err } = e.data, f = waits.get(id); waits.delete(id); if (!f) return;
        if (err || !blob) { f.res(null); return; }
        if (!PX.CACHE.has(key)) { PX.CACHE.set(key, URL.createObjectURL(blob)); SPRITES.put(key, blob); }
        f.res(PX.CACHE.get(key));
      };
      w.onerror = () => { dead = true; w = null; waits.forEach(f => f.res(null)); waits.clear(); };
    } catch (e) { dead = true; w = null; }
    return w;
  }
  /* draw `kind` ('hero' | 'mon') off the main thread; resolves to the sheet URL, or null (caller draws it) */
  function ask(kind, arg) {
    if (!S.pixel) return Promise.resolve(null);
    const [key] = PX.job[kind](arg);
    if (PX.CACHE.has(key)) return Promise.resolve(PX.CACHE.get(key));
    if (inflight.has(key)) return inflight.get(key);
    const p = SPRITES.get(key).then(url => {
      if (url) { if (!PX.CACHE.has(key)) PX.CACHE.set(key, url); return PX.CACHE.get(key); }
      if (!start()) return null;
      const id = ++seq;
      return new Promise(res => { waits.set(id, { res }); w.postMessage({ id, kind, arg: JSON.parse(JSON.stringify(arg)), tier: PX.Q.tier }); });
    }).finally(() => inflight.delete(key));
    inflight.set(key, p);
    return p;
  }
  return { ask, able, start };
})();

/* quality tier: 'auto' measures this device once (kept in the device store), 'high' / 'lite' are fixed */
function qualityTier() {
  const pref = DEV.quality || 'auto';
  if (pref !== 'auto') return pref;
  return DEV.qMeasured || 'high';
}
function measureQuality() {
  if ((DEV.quality || 'auto') !== 'auto' || DEV.qMeasured || !S.pixel) return;
  const t0 = performance.now(); let ms = 0;
  try { const [, recipe] = PX.job.mon({ n: '__bench', b: 'cloud', c: 3, e: 'two', m: 'teeth', f: ['crown', 'scarf'], t: 1, sp: 'cyclops' }); PX.sheetImageOnly(...recipe()); ms = performance.now() - t0; } catch (e) { return; }
  DEV.qMeasured = ms > 140 ? 'lite' : 'high'; DEV.qMs = Math.round(ms); saveDev();
  if (DEV.qMeasured === 'lite' && PX.Q.tier !== 'lite') { PX.Q.tier = 'lite'; markLite(); }
}
/* v30: tell the CSS too, so slow devices skip the decorative looping effects */
function markLite() { document.documentElement.dataset.lite = PX.Q.tier === 'lite' ? '1' : '0'; }
SPR_HOOK = SPRITES;
