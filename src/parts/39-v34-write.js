/* ================= v34: write the answer (handwriting for numbers) =================
   In Maths the child can choose "✍️ Write" in the level briefing. When the answer is a number (1 to 3 digits) the
   answer buttons are replaced by one writing box for every digit. The game reads each box:
     1. all the ink in a box is made the same size (so a big 7 and a small 7 look alike) and moved to the middle,
     2. it is compared with the stroke guides of the digits 0-9 that the tracing pads already use (GLYPHS, 11b), plus a few
        other ways children write 1, 4, 7, 8 and 9,
     3. the closest digit wins, if it is close enough. If not, the box shows "?" and no answer is counted.
   The child sees what the game read under each box while writing, so a misread can be fixed before pressing Done.
   A number that is read clearly but is wrong counts as a wrong answer, like tapping the wrong button.
   Nothing leaves the device; this is plain geometry, not a trained model. */
const DG_VARIANTS = (() => {
  const v = {}; for (const d of '0123456789') v[d] = [GLYPHS[d]];
  v[1].push([[[50, 8], [50, 92]]], [[[34, 24], [52, 8], [52, 92]], [[34, 92], [70, 92]]]);                              // a plain stick; a stick with a foot
  v[4].push([[[60, 8], [22, 66], [80, 66]], [[62, 34], [62, 92]]], [[[26, 8], [26, 52], [78, 52]], [[64, 8], [64, 92]]]);   // an open 4; a 4 made of an L and a stick
  v[7].push([[[24, 8], [76, 8], [42, 92]], [[34, 52], [66, 52]]]);                                                       // a 7 with a bar through it
  v[9].push([arcPts(50, 30, 24, 22, 0, 360, 20), [[74, 30], [68, 70], [50, 92]]], [arcPts(50, 30, 24, 22, 0, 360, 20), [[74, 30], [74, 92]]]);   // a 9 with a curved or a straight tail
  v[8].push([arcPts(50, 28, 20, 18, -90, 270, 18), arcPts(50, 70, 24, 22, -90, 270, 18)]);                              // two stacked rings
  v[2].push([[[26, 26], [34, 12], [50, 8], [66, 12], [74, 26], [70, 40], [26, 92]], [[26, 92], [76, 92]]]);
  v[5].push([[[28, 8], [74, 8]], [[28, 8], [26, 44], [48, 40], [66, 46], [76, 62], [72, 82], [56, 92], [36, 90], [26, 82]]]);
  v[0].push([arcPts(50, 50, 24, 42, -90, -450, 24)]);                                                                    // a thin 0
  return v;
})();
/* the same size, in the middle: points of all strokes (dense), then scaled so the longer side is 80 */
function dgNorm(strokes) {
  const pts = []; strokes.forEach(s => { if (!s || !s.length) return; if (s.length === 1) pts.push([s[0][0], s[0][1]]); else resample(s, 3).forEach(p => pts.push(p)); });
  if (pts.length < 3) return null;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(([x, y]) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; });
  const w = x1 - x0, h = y1 - y0, m = Math.max(w, h);
  if (m < 8) return null;                                                           // only a dot: not a digit
  const k = 80 / m, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const out = pts.map(([x, y]) => [50 + (x - cx) * k, 50 + (y - cy) * k]);
  const step = Math.max(1, Math.ceil(out.length / 90));                              // at most about 90 points
  return { pts: out.filter((_, i) => i % step === 0), w, h };
}
const DG_T = {};   // the guides, normalised once
function dgTemplates() {
  if (DG_T.ready) return DG_T;
  DG_T.list = [];
  Object.keys(DG_VARIANTS).forEach(d => DG_VARIANTS[d].forEach(g => { const n = dgNorm(g); if (n) DG_T.list.push({ d, pts: n.pts }); }));
  DG_T.ready = true; return DG_T;
}
const dgAvgMin = (A, Bp) => { let s = 0; for (const a of A) { let m = 1e9; for (const b of Bp) { const d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2; if (d < m) m = d; } s += m; } return Math.sqrt(s / A.length); };   // root-mean-square: far-away ink counts more
/* which digit is in these strokes? -> { digit: '7' | null, dist, second }  (strokes are lists of [x, y] in a 100 x 100 box) */
function recognizeDigit(strokes) {
  const ink = dgNorm(strokes); if (!ink) return { digit: null, dist: 99, second: 99 };
  const best = {};
  dgTemplates().list.forEach(tp => { const d = (dgAvgMin(ink.pts, tp.pts) + dgAvgMin(tp.pts, ink.pts)) / 2; if (best[tp.d] === undefined || d < best[tp.d]) best[tp.d] = d; });
  const rank = Object.entries(best).sort((a, b) => a[1] - b[1]), [d1, s1] = rank[0], s2 = rank[1][1];
  return { digit: s1 <= DG_MAX ? d1 : null, dist: s1, second: s2 };
}
const DG_MAX = 7.5;
/* a number question with a 1 to 3 digit whole-number answer can be written */
function isNumAns(q) { return !!q && Array.isArray(q.options) && q.options.length > 1 && q.options.every(o => /^\d{1,3}$/.test(String(o))) && /^\d{1,3}$/.test(String(q.options[q.correct])); }
function writeOn(q) { return S.expr === 'write' && !!q && !['trace', 'order', 'match', 'phonics', 'wx'].includes(q.kind) && B.noWrite !== q && isNumAns(q); }

const WR = { boxes: [], q: null };
Object.assign(STR, {
  'ex.write': ['✍️ Write', '✍️ Tulis'], 'wr.title': ['Write the answer', 'Tulis jawapan'],
  'wr.done': ['Done', 'Siap'], 'wr.clear': ['Clear', 'Padam'], 'wr.tap': ['Use buttons instead', 'Guna butang sahaja'],
  'wr.read': ['I see: {n}', 'Saya nampak: {n}'], 'wr.none': ['Write a number in every box.', 'Tulis nombor dalam setiap kotak.'],
  'wr.unclear': ['I could not read that. Try writing bigger and clearer.', 'Saya tidak dapat membacanya. Cuba tulis lebih besar dan jelas.'],
  'wr.box': ['Writing box {i}', 'Kotak menulis {i}']
});
function writeMount() {
  const q = B.q, e = $('#expr'); if (!e || !q) return;
  const n = String(q.options[q.correct]).length; WR.q = q; WR.boxes = [];
  const wide = Math.min(116, Math.floor(((e.getBoundingClientRect().width || 300) - 24 - (n - 1) * 10) / n));
  const size = Math.max(84, Math.min(wide, Math.round((innerHeight || 700) * (innerWidth > innerHeight ? .34 : .2))));
  e.innerHTML = `<div class="wpad" role="group" aria-label="${esc(t('wr.title'))}"><p class="wr-title">✍️ ${esc(t('wr.title'))}</p><div class="wboxes">${Array.from({ length: n }, (_, i) => `<div class="wcell"><canvas class="wbox" data-i="${i}" aria-label="${esc(t('wr.box', { i: i + 1 }))}"></canvas><b class="wdig" aria-hidden="true">·</b></div>`).join('')}</div>
    <p class="wr-read" aria-live="polite"></p>
    <div class="trbar"><button class="btn ghost" data-wr="clear">↺ ${esc(t('wr.clear'))}</button><button class="btn" data-wr="done">✓ ${esc(t('wr.done'))}</button></div>
    <button class="linkbtn" data-wr="tap">${esc(t('wr.tap'))}</button></div>`;
  const css = getComputedStyle(document.documentElement), ink = css.getPropertyValue('--accent').trim() || '#7C5CFF', dpr = window.devicePixelRatio || 1;
  e.querySelectorAll('canvas.wbox').forEach((cv, i) => {
    cv.width = cv.height = size * dpr; cv.style.width = cv.style.height = size + 'px';
    const g = cv.getContext('2d'); if (!g) return;
    const box = { cv, g, strokes: [], cur: null, digit: null, k: size * dpr / 100 };
    const pt = ev => { const b = cv.getBoundingClientRect(); return [(ev.clientX - b.left) / b.width * 100, (ev.clientY - b.top) / b.height * 100]; };
    const paint = () => {
      const k = box.k; g.clearRect(0, 0, cv.width, cv.height); g.lineCap = g.lineJoin = 'round';
      g.strokeStyle = 'rgba(150,140,190,.35)'; g.lineWidth = 1.5 * k; g.setLineDash([3 * k, 3 * k]); g.beginPath(); g.moveTo(10 * k, 50 * k); g.lineTo(90 * k, 50 * k); g.moveTo(10 * k, 92 * k); g.lineTo(90 * k, 92 * k); g.stroke(); g.setLineDash([]);
      g.strokeStyle = ink; g.lineWidth = 7 * k; box.strokes.forEach(s => { g.beginPath(); s.forEach(([x, y], j) => j ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k)); if (s.length === 1) g.lineTo(s[0][0] * k + .1, s[0][1] * k); g.stroke(); });
    };
    box.paint = paint;
    cv.addEventListener('pointerdown', ev => { if (B.locked) return; ev.preventDefault(); box.cur = [pt(ev)]; box.strokes.push(box.cur); try { cv.setPointerCapture(ev.pointerId); } catch (x) { /* ok */ } paint(); });
    cv.addEventListener('pointermove', ev => { if (box.cur) { box.cur.push(pt(ev)); paint(); } });
    const end = () => { if (!box.cur) return; box.cur = null; writeRead(); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    WR.boxes.push(box); paint();
  });
  e.querySelector('[data-wr="clear"]').onclick = () => { WR.boxes.forEach(b => { b.strokes.length = 0; b.paint(); }); writeRead(); };
  e.querySelector('[data-wr="done"]').onclick = writeDone;
  e.querySelector('[data-wr="tap"]').onclick = () => { B.noWrite = q; e.innerHTML = ''; renderAnswers(); };
}
function writeRead() {
  const cells = $$('#expr .wdig'); let txt = '';
  WR.boxes.forEach((b, i) => { const r = b.strokes.length ? recognizeDigit(b.strokes) : null; b.digit = r ? r.digit : null; if (cells[i]) cells[i].textContent = b.strokes.length ? (b.digit === null ? '?' : b.digit) : '·'; txt += b.strokes.length ? (b.digit === null ? '?' : b.digit) : '_'; });
  const rd = $('#expr .wr-read'); if (rd) rd.textContent = /[0-9]/.test(txt) ? t('wr.read', { n: txt }) : '';
}
function writeDone() {
  const q = WR.q; if (!q || B.q !== q || B.locked) return;
  writeRead(); const msg = $('#expr .wr-read');
  if (WR.boxes.some(b => !b.strokes.length)) { if (msg) msg.textContent = t('wr.none'); return; }
  if (WR.boxes.some(b => b.digit === null)) { if (msg) msg.textContent = t('wr.unclear'); return; }
  const val = WR.boxes.map(b => b.digit).join('');
  if (val === String(q.options[q.correct])) { B.locked = true; B.rightIdx = q.correct; renderAnswers(); onCorrect(); }
  else { wrongPick(-1); setTimeout(() => { if (B.q === q) { WR.boxes.forEach(b => { b.strokes.length = 0; b.paint(); }); writeRead(); } }, 700); }
}
Object.assign(window.__quest || (window.__quest = {}), { v34w: { recognizeDigit, dgNorm, DG_VARIANTS, isNumAns, writeOn } });
