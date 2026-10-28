/* Loads the real game code (src/parts/*.js, joined exactly as the Vite plugin does) inside Node, with a
   stand-in for the browser (DOM, storage, timers, audio). Used by `npm run check` and `npm test`.
   Nothing is drawn; the game's own functions (questions, levels, monsters, strings) run unchanged. */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src'), PARTS = join(SRC, 'parts');

/* a do-nothing object: any property, call or `new` gives back itself, so UI code can run without a page */
function stub(name = 'stub') {
  const f = function () { return P; };
  const P = new Proxy(f, {
    get(t, k) {
      if (k === Symbol.toPrimitive) return () => '';
      if (k === Symbol.iterator) return function* () {};
      if (k === 'then') return undefined;
      if (k === 'length') return 0;
      if (k === 'toString' || k === 'valueOf') return () => '';
      if (k === 'style') return t.__style || (t.__style = new Proxy({}, { get: (s, kk) => kk === 'setProperty' ? () => {} : s[kk] ?? '', set: (s, kk, v) => { s[kk] = v; return true; } }));
      if (k === 'dataset') return t.__ds || (t.__ds = {});
      if (k === 'classList') return { add() {}, remove() {}, toggle() {}, contains: () => false };
      if (k in t && typeof t[k] !== 'function') return t[k];
      return P;
    },
    set(t, k, v) { t[k] = v; return true; },
    apply: () => P, construct: () => P, has: () => true
  });
  return P;
}

export async function loadGame({ lang = 'en', band = 3, state = {} } = {}) {
  const RETIRED = new Set(['10c-flashcards.js']);   // v31: removed files an update zip cannot delete (same list as vite.config.js)
  const files = readdirSync(PARTS).filter((f) => f.endsWith('.js') && !RETIRED.has(f)).sort();
  const mods = {};
  let code = '';
  for (const f of files) {
    for (const line of readFileSync(join(PARTS, f), 'utf8').split('\n')) {
      let m = line.match(/^import \* as (\w+) from '(.+)';\s*$/);
      if (m) { mods[m[1]] = await import(pathToFileURL(join(SRC, m[2]))); continue; }
      m = line.match(/^import \{ ([\w, ]+) \} from '(.+)';\s*$/);
      if (m) { const mod = await import(pathToFileURL(join(SRC, m[2]))); m[1].split(',').map((s) => s.trim()).forEach((n) => { mods[n] = mod[n]; }); continue; }
      code += line + '\n';
    }
  }
  /* v31: lesson text lives in content/lessons/<subject>/b<band>.js */
  const LDIR = join(SRC, 'content/lessons'), lessonFiles = readdirSync(LDIR, { withFileTypes: true }).filter((d) => d.isDirectory()).flatMap((d) => readdirSync(join(LDIR, d.name)).filter((f) => f.endsWith('.js')).map((f) => d.name + '/' + f));
  const ONE_GLOB = Object.fromEntries(['vfx', 'kbat', 'formats'].map((n) => ['./content/' + n + '.js', () => import(pathToFileURL(join(SRC, 'content/' + n + '.js')))]));
  const LESSON_GLOB = Object.fromEntries(lessonFiles.map((f) => ['./content/lessons/' + f, () => import(pathToFileURL(join(LDIR, f)))]));
  code = code
    .replace(/import\.meta\.glob\('\.\/content\/lessons\/\*\/\*\.js'\)/g, '__LESSON_GLOB')
    .replace(/import\.meta\.glob\('\.\/content\/(?:vfx|kbat|formats)\.js'\)/g, '__ONE_GLOB')
    .replace(/import\.meta\.env\.PROD/g, 'false').replace(/import\.meta\.env\.DEV/g, 'false')
    .replace(/import\.meta\.url/g, "'file:///src/main.js'");

  const store = new Map(Object.entries({ 'quest-academy-v4': JSON.stringify({ v: 4, lang, band, welcomed: true, coins: 100, sfx: false, music: false, ...state }) }));
  const doc = stub('document');
  const ctx = {
    console, Math, Date, JSON, Promise, Map, Set, WeakMap, Array, Object, String, Number, Boolean, RegExp, Error, TypeError, Symbol, Proxy, Reflect, Intl,
    parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent, structuredClone,
    Uint8Array, Uint8ClampedArray, Int16Array, Float32Array, ArrayBuffer, TextEncoder, TextDecoder, URL, URLSearchParams, Blob, fetch,
    performance, crypto: webcrypto, atob, btoa,
    ImageData: class { constructor(w, h) { this.width = w; this.height = h; this.data = new Uint8ClampedArray(w * h * 4); } },
    document: doc, navigator: { language: lang === 'ms' ? 'ms-MY' : 'en-US', storage: {}, userAgent: 'node' },
    location: { protocol: 'file:', hostname: '', search: '', href: 'file:///' },
    localStorage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {}, requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
    speechSynthesis: stub(), SpeechSynthesisUtterance: function () {}, innerWidth: 1024, innerHeight: 768,
    Element: stub(), HTMLElement: stub(), __LESSON_GLOB: LESSON_GLOB, __ONE_GLOB: ONE_GLOB, __SPRITE_VER__: 'test', __APP_VERSION__: JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version, ...mods
  };
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(`(() => {\n'use strict';\n${code}\nwindow.__game = { STR, BANK, BTOP, TOPICS, MODULES, ITEMS, LEVELS_PER, SUBJ_ORDER, SUBJ_IDX, MBODY, MEYES, BANK_FOR_AGE, LIFE: typeof LIFE !== 'undefined' ? LIFE : null, ensureLessons, levelOf, monsterFor, mathQ, freshSum, bankQ, makeQ, todayKey, t, S: () => S, setLang: (l) => { S.lang = l; }, ev: (s) => eval(s) };\n})();`, ctx, { filename: 'quest-academy.js' });
  if (mods.loadCuts) await Promise.all([1, 2, 3, 4].map((b) => mods.loadCuts(b)));   // v31: cutscenes load per age; tests see them all
  if (ctx.__game.ev('typeof kbLoad') === 'function') await ctx.__game.ev('kbLoad()');   // v34: KBAT questions load on demand; tests see them loaded
  if (ctx.__game.ev('typeof vfxLoad') === 'function') await ctx.__game.ev('vfxLoad()');
  if (ctx.__game.ev('typeof fmLoad') === 'function') await ctx.__game.ev('fmLoad()');   // v35: the new question formats load on demand too
  return { game: ctx.__game, ctx, store };
}
