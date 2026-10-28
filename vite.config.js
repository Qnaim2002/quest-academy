import { defineConfig } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The game is one big scope split over several files for easier editing.
   src/parts/*.js are joined in file-name order, wrapped once, and served as src/main.js. */
const partsDir = fileURLToPath(new URL('./src/parts/', import.meta.url));
/* v31: files from older versions that were removed (an update zip cannot delete them, so they are skipped here) */
export const RETIRED_PARTS = new Set(['10c-flashcards.js']);
const partFiles = () => readdirSync(partsDir).filter((f) => f.endsWith('.js') && !RETIRED_PARTS.has(f)).sort();

function questParts() {
  return {
    name: 'quest-parts',
    enforce: 'pre',
    load(id) {
      const clean = id.split('?')[0].replace(/\\/g, '/');
      if (clean.endsWith('/src/sprite-worker.js')) return spriteWorker(this);
      if (!clean.endsWith('/src/main.js')) return null;
      const imports = [];
      const bodies = [];
      for (const f of partFiles()) {
        this.addWatchFile(join(partsDir, f));
        const lines = readFileSync(join(partsDir, f), 'utf8').split('\n');
        const rest = [];
        for (const l of lines) (l.startsWith('import ') ? imports : rest).push(l);
        bodies.push(`/* ===== ${f} ===== */`, ...rest);
      }
      return `${imports.join('\n')}\n(() => {\n'use strict';\n${bodies.join('\n')}\n})();\n`;
    },
    handleHotUpdate({ file, server }) {
      if (file.replace(/\\/g, '/').includes('/src/parts/')) {
        server.moduleGraph.fileToModulesMap.get(fileURLToPath(new URL('./src/main.js', import.meta.url)))?.forEach((m) => server.moduleGraph.invalidateModule(m));
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    }
  };
}

/* v21: the sprite worker is built from the same art files as the game (helpers, items, the pixel engine,
   knights, monsters and bosses) plus a tiny stand-in for the game state, so both draw identical sprites. */
const WORKER_PARTS = ['00c-hooks.js', '01-setup.js', '03-items-and-levels.js', '09-sprites.js', '09b-pixel.js', '09c-pixel-knights.js', '09d-pixel-monsters.js', '09f-pixel-bestiary.js', '09h-bestiary2.js', '09i-bestiary3.js', '09j-bestiary4.js', '09k-bestiary5.js', '09l-bestiary6.js'];
function spriteWorker(ctx) {
  const bodies = WORKER_PARTS.map((f) => { ctx.addWatchFile(join(partsDir, f)); return `/* ===== ${f} ===== */\n` + readFileSync(join(partsDir, f), 'utf8').split('\n').filter((l) => !l.startsWith('import ')).join('\n'); });
  return `(() => {
'use strict';
const S = { pixel: true, band: 3, lang: 'en', sensory: false, equipped: {} };
${bodies.join('\n')}
self.onmessage = async (e) => {
  const { id, kind, arg, tier } = e.data;
  try { PX.Q.tier = tier || 'high'; const [key, recipe] = PX.job[kind](arg); const blob = await PX.sheetBlob(...recipe()); self.postMessage({ id, key, blob }); }
  catch (err) { self.postMessage({ id, err: String((err && err.message) || err) }); }
};
})();
`;
}
/* a hash of the art code: sprites saved in IndexedDB by an older version are not reused */
const SPRITE_VER = createHash('sha256').update(WORKER_PARTS.map((f) => readFileSync(join(partsDir, f), 'utf8')).join('')).digest('hex').slice(0, 10);

/* v21: installable offline app (PWA) without extra npm packages.
   After the build, every output file (scripts, styles, fonts, lesson chunks, icons) goes into a precache
   list inside dist/sw.js. The cache name is a hash of that list, so a new build replaces the old cache. */
function questPWA() {
  let outDir = 'dist', pub = 'public';
  return {
    name: 'quest-pwa',
    apply: 'build',
    configResolved(c) { outDir = c.build.outDir; pub = c.publicDir; },
    generateBundle(_, bundle) {
      const walk = (dir, pre = '') => { try { return readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? walk(join(dir, d.name), pre + d.name + '/') : [pre + d.name]); } catch (e) { return []; } };
      const files = [...Object.keys(bundle), ...walk(pub)].filter((f) => !f.endsWith('.map') && f !== 'sw.js');
      const list = ['./', ...files.filter((f) => f !== 'index.html'), 'index.html'];
      const version = createHash('sha256').update(list.join('|') + JSON.stringify(Object.values(bundle).map((b) => b.code ? b.code.length : (b.source ? b.source.length : 0)))).digest('hex').slice(0, 12);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: swSource(version, list) });
    }
  };
}
const swSource = (version, list) => `/* Quest Academy service worker (generated at build time) */
const CACHE = 'quest-academy-${version}';
const PRECACHE = ${JSON.stringify(list)};
self.addEventListener('install', (e) => {
  /* v34: a new build waits until the page says so (the "New version ready" bar), so a running page never loses its files */
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
});
self.addEventListener('message', (e) => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('quest-academy-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    /* pages: try the network (to pick up updates), fall back to the cached app when offline */
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put('index.html', copy)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  /* files: cache first (they have content hashes in their names), then the network.
     v34: ignoreVary, because a page's lazy import() asks with different headers than the install did, and the file was missed offline */
  e.respondWith(caches.match(req, { ignoreVary: true }).then((hit) => hit || fetch(req).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return r; })));
});
`;

const APP_VERSION = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version;   // shown in the Parent Portal
/* v31: readable names for the lesson-text and story chunks (lesson-math-b1-xxxx.js, story-b3-xxxx.js) */
const chunkFileNames = (ci) => {
  const id = (ci.facadeModuleId || '').replace(/\\/g, '/'), m = id.match(/content\/lessons\/(\w+)\/b(\d)\.js$/), c = id.match(/content\/cutscenes\/b(\d)\.js$/);
  return m ? `assets/lesson-${m[1]}-b${m[2]}-[hash].js` : c ? `assets/story-b${c[1]}-[hash].js` : 'assets/[name]-[hash].js';
};
export default defineConfig({ build: { rolldownOptions: { output: { chunkFileNames } } }, base: './', define: { __SPRITE_VER__: JSON.stringify(SPRITE_VER), __APP_VERSION__: JSON.stringify(APP_VERSION) }, plugins: [questParts(), questPWA()], worker: { format: 'es', plugins: () => [questParts()] } });
