/* ================= v13: smoothness helpers =================
   1. lazyHero(): a gear card shows a light placeholder first, and the pixel sprite is drawn a few
      frames later in small time slices, so opening a tab never freezes on slow tablets.
   2. pxWarm(): sprites we will probably need next are drawn while the device is idle. */
const LAZY = [];
let lazyRaf = 0;
function lazyHero(eq) {
  eq = dressEq(eq);   // v35: the worker must draw what heroSVG will show
  if (!S.pixel || PX.heroReady(eq)) return heroSVG(eq);
  const id = LAZY.push(eq) - 1;
  return `<span class="px-lazy" data-lz="${id}" aria-hidden="true"></span>`;
}
function lazyReset() { LAZY.length = 0; cancelAnimationFrame(lazyRaf); lazyRaf = 0; }
function flushLazy() {
  cancelAnimationFrame(lazyRaf);
  /* v21: with the sprite worker, each card is drawn off the main thread and swapped in when ready */
  if (SPRW.able()) {
    $$('.px-lazy[data-lz]').forEach(el => {
      const eq = LAZY[+el.dataset.lz]; el.removeAttribute('data-lz'); if (!eq) { el.remove(); return; }
      SPRW.ask('hero', eq).then(() => { if (!el.isConnected) return; const tmp = document.createElement('div'); tmp.innerHTML = heroSVG(eq); const svg = tmp.firstElementChild; svg.classList.add('px-in'); el.replaceWith(svg); });
    });
    return;
  }
  const step = () => {
    const t0 = performance.now(); let el;
    while ((el = document.querySelector('.px-lazy[data-lz]')) && performance.now() - t0 < 10) {
      const eq = LAZY[+el.dataset.lz]; el.removeAttribute('data-lz');
      if (eq) { const tmp = document.createElement('div'); tmp.innerHTML = heroSVG(eq); const svg = tmp.firstElementChild; svg.classList.add('px-in'); el.replaceWith(svg); } else el.remove();
    }
    lazyRaf = document.querySelector('.px-lazy[data-lz]') ? requestAnimationFrame(step) : 0;
  };
  lazyRaf = requestAnimationFrame(step);
}
/* v26: the same for monsters (the Cards tab shows up to 60 at once). A card shows a light placeholder and its
   monster is drawn by the sprite worker, or in small idle slices without one, so the tab opens at once. */
const LAZYM = [];
function lazyMon(m) {
  if (!S.pixel || PX.monReady(m)) return monsterSVG(m);
  const id = LAZYM.push(m) - 1;
  return `<span class="px-lazy" data-lzm="${id}" aria-hidden="true"></span>`;
}
function flushLazyMon() {
  const swap = (el, m) => { if (!el.isConnected) return; const tmp = document.createElement('div'); tmp.innerHTML = monsterSVG(m); const svg = tmp.firstElementChild; svg.classList.add('px-in'); el.replaceWith(svg); };
  const els = $$('.px-lazy[data-lzm]');
  if (SPRW.able()) { els.forEach(el => { const m = LAZYM[+el.dataset.lzm]; el.removeAttribute('data-lzm'); if (!m) { el.remove(); return; } SPRW.ask('mon', m).then(() => swap(el, m)); }); return; }
  const step = () => {
    const t0 = performance.now(); let el;
    while ((el = document.querySelector('.px-lazy[data-lzm]')) && performance.now() - t0 < 10) { const m = LAZYM[+el.dataset.lzm]; el.removeAttribute('data-lzm'); if (m) swap(el, m); else el.remove(); }
    if (document.querySelector('.px-lazy[data-lzm]')) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
/* idle-time drawing queue (requestIdleCallback where it exists, short timeouts elsewhere) */
const WARMQ = [], WARMED = new Set();
let warmBusy = false;
const idle = window.requestIdleCallback ? (f => requestIdleCallback(f, { timeout: 1200 })) : (f => setTimeout(() => f({ timeRemaining: () => 8 }), 60));
function pxWarm(key, fn, kind, arg) {
  if (!S.pixel || WARMED.has(key)) return; WARMED.add(key);
  if (kind && SPRW.able()) { SPRW.ask(kind, arg); return; }   // v21: drawn by the sprite worker
  WARMQ.push(fn);
  if (!warmBusy) { warmBusy = true; idle(warmRun); }
}
function warmRun(dl) {
  while (WARMQ.length && dl.timeRemaining() > 6) { try { WARMQ.shift()(); } catch (e) { /* a warm-up miss only costs speed later */ } }
  if (WARMQ.length) idle(warmRun); else warmBusy = false;
}
/* what to get ready, depending on where the player is */
function warmFor(where) {
  if (!S.pixel) return;
  const eq = S.equipped;
  pxWarm('hero:' + JSON.stringify(eq), () => heroSVG(eq), 'hero', eq);
  if (where === 'armory' || where === 'boot') {
    ITEMS.filter(i => i.slot === 'knight').forEach(k => pxWarm('kn:' + k.id + JSON.stringify(eq), () => heroSVG({ ...eq, knight: k.id }), 'hero', { ...eq, knight: k.id }));
    const slot = UI.slot || 'knight';
    ITEMS.filter(i => i.slot === slot).forEach(it => { const e2 = dressLook({ ...eq, [slot]: it.id }, slot); pxWarm('it:' + JSON.stringify(e2), () => heroSVG(e2), 'hero', e2); });
  }
  if (where === 'map' || where === 'boot') {
    const subj = UI.subj || 'math';
    for (let n = 1; n <= LEVELS_PER; n++) {
      const st = typeof starsAt === 'function' ? starsAt(subj, n) : 0;
      if (!st) { for (let k = n; k < n + 3 && k <= LEVELS_PER; k++) { const lv = levelOf(subj, k); pxWarm('mon:' + lv.id, () => monsterSVG(lv.mon, lv.hue || 0), 'mon', lv.mon); pxWarm('bg:' + lv.z + ':' + S.band + (lv.big ? 1 : 0), () => PX.bg(lv.z, S.band, !!lv.big)); } break; }
    }
  }
}

/* ================= v15: pixel transitions =================
   pxWipe(fn): square pixels sweep across the screen diagonally, fn() runs while the screen is
   covered, then the pixels clear away again. Used for going into / out of battles and stories.
   Off in sensory mode and for reduced motion (fn just runs). */
let WIPE = null;
function pxWipe(fn, color = '#0B0919') {
  const reduce = S.sensory || !S.pixel || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce || WIPE) { fn(); return; }
  const cv = document.createElement('canvas'), W = innerWidth, H = innerHeight, sz = Math.max(18, Math.round(Math.min(W, H) / 16));
  cv.className = 'px-wipe'; cv.width = Math.ceil(W / sz); cv.height = Math.ceil(H / sz); document.body.appendChild(cv);
  const g = cv.getContext('2d'), cols = cv.width, rows = cv.height, R = rng(Date.now() & 0xffff);
  const order = []; for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) order.push([x, y, (x + y) / (cols + rows) * .75 + R() * .25]);
  const T = 230, t0 = performance.now(); let phase = 0, ran = false;
  WIPE = cv;
  const draw = now => {
    const p = Math.min(1, (now - (phase ? t1 : t0)) / T);
    g.clearRect(0, 0, cols, rows); g.fillStyle = color;
    for (const [x, y, k] of order) { const on = phase ? k > p : k <= p; if (on) g.fillRect(x, y, 1, 1); }
    if (p < 1) { requestAnimationFrame(draw); return; }
    if (!phase) { if (!ran) { ran = true; try { fn(); } catch (e) { console.error(e); } } phase = 1; t1 = performance.now() + 60; requestAnimationFrame(draw); return; }
    cv.remove(); WIPE = null;
  };
  let t1 = 0;
  requestAnimationFrame(draw);
}
/* a quick slide/pop for a screen that just changed (stepped, so it reads as pixel motion) */
function pxEnter(el, kind = 'slide') { if (!el || S.sensory || !S.pixel) return; replayClass(el, 'px-enter-' + kind, ['px-enter-slide', 'px-enter-pop', 'px-enter-back']); }
