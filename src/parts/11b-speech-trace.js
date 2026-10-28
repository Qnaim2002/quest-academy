/* ================= v21: real speech answers + letter/number tracing =================
   SPEECH. The 🎤 answer style now really listens (Web Speech SpeechRecognition, ms-MY or en-US) and matches
   what the child said to the answer buttons (numbers can be said as words: "twenty eight", "dua puluh lapan").
   Privacy: when the browser can recognise speech on the device itself, that is used. If it would have to
   send the voice to an online speech service, listening stays off until a parent allows it in the Parent
   zone. Quest Academy never records or keeps audio. Without speech support the child taps what they said.
   TRACING. Age 4 battles in English, Bahasa Melayu and Math sometimes ask the child to trace a capital letter
   or a number on the drawing pad: a grey guide path with numbered start dots, then a simple check of how
   much of the path was covered and how much of the ink stayed near it. */

/* ---------------- speech ---------------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const SPEECH = { rec: null, local: null, checking: null };
const srLang = () => S.lang === 'ms' ? 'ms-MY' : 'en-US';
/* can this device listen without sending audio away? (Chrome 139+: SpeechRecognition.available + processLocally) */
function speechLocal() {
  if (!SR) return Promise.resolve(false);
  if (SPEECH.local !== null && SPEECH.local.lang === srLang()) return Promise.resolve(SPEECH.local.ok);
  if (typeof SR.available !== 'function') { SPEECH.local = { lang: srLang(), ok: false }; return Promise.resolve(false); }
  const slow = new Promise(res => setTimeout(() => res('timeout'), 3000));   // never wait on the check for long
  return (SPEECH.checking = Promise.race([SR.available({ langs: [srLang()], processLocally: true }), slow]).then(st => {
    const ok = st === 'available';
    SPEECH.local = { lang: srLang(), ok };
    return ok;
  }).catch(() => { SPEECH.local = { lang: srLang(), ok: false }; return false; }));
}
/* 'local' (on-device), 'online' (parent allowed the online service), 'blocked' (needs a parent's OK), 'none' (no support) */
async function speechMode() {
  if (!SR) return 'none';
  if (S.micOff) return 'blocked';
  if (await speechLocal()) return 'local';
  return S.micOnline ? 'online' : 'blocked';
}
const NUM_EN = { zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const NUM_MS = { kosong: 0, sifar: 0, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, lapan: 8, sembilan: 9 };
/* every number spoken in a phrase, in English or Malay words, or as digits */
function spokenNumbers(txt) {
  const out = [], w = txt.split(' ');
  (txt.match(/\d+/g) || []).forEach(d => out.push(+d));
  let cur = null, total = 0;
  const flush = () => { if (cur !== null || total) out.push(total + (cur || 0)); cur = null; total = 0; };
  for (let i = 0; i < w.length; i++) {
    const x = w[i];
    if (x in NUM_EN) { const v = NUM_EN[x]; if (cur !== null && v < 10 && cur % 10 === 0 && cur >= 20) cur += v; else if (cur !== null && cur < 100 && v < 100) { flush(); cur = v; } else cur = (cur || 0) + v; continue; }
    if (x === 'hundred') { cur = (cur || 1) * 100; continue; }
    if (x === 'thousand') { total += (cur || 1) * 1000; cur = null; continue; }
    if (x === 'and' && cur !== null) continue;
    if (x === 'sepuluh') { cur = (cur || 0) + 10; continue; }
    if (x === 'seratus') { cur = (cur || 0) + 100; continue; }
    if (x === 'seribu') { total += 1000; continue; }
    if (x in NUM_MS) {
      const v = NUM_MS[x], nx = w[i + 1];
      if (nx === 'puluh') { cur = (cur || 0) + v * 10; i++; continue; }
      if (nx === 'belas') { cur = (cur || 0) + 10 + v; i++; continue; }
      if (nx === 'ratus') { cur = (cur || 0) + v * 100; i++; continue; }
      if (nx === 'ribu') { total += v * 1000; i++; continue; }
      cur = (cur || 0) + v; continue;
    }
    if (x === 'sebelas') { cur = (cur || 0) + 11; continue; }
    flush();
  }
  flush();
  return out;
}
const normTxt = s => String(s).replace(/[✔✘✓✗]/g, ' ').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[“”"'’.,!?:;()]/g, ' ').replace(/\s+/g, ' ').trim();
function editRatio(a, b) {
  if (a === b) return 1; const m = a.length, n = b.length; if (!m || !n) return 0;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return 1 - prev[n] / Math.max(m, n);
}
/* which answer option did the child say? -> index, or -1 when unsure */
function matchSpoken(alts, options) {
  const opts = options.map(o => normTxt(o)), score = opts.map(() => 0);
  alts.forEach(raw => {
    const t2 = normTxt(raw), nums = spokenNumbers(t2);
    opts.forEach((o, i) => {
      let s = 0;
      if (t2 === o) s = 3;
      else if (/^\d+$/.test(o.replace(/\s/g, '')) && nums.includes(+o.replace(/\s/g, ''))) s = 3;
      else if ((' ' + t2 + ' ').includes(' ' + o + ' ')) s = 2;
      else if (editRatio(t2, o) >= .78) s = 1.5;
      else if (o.length > 3 && t2.split(' ').some(w => editRatio(w, o) >= .8)) s = 1;
      score[i] = Math.max(score[i], s);
    });
  });
  const best = Math.max(...score); if (best < 1) return -1;
  const tops = score.map((s, i) => s === best ? i : -1).filter(i => i >= 0);
  return tops.length === 1 ? tops[0] : -1;
}
function micListen() {
  const q = B.q; if (!q) return;
  speechMode().then(mode => {
    if (mode !== 'local' && mode !== 'online') { B.vState = 'heard'; B.vMode = mode; B.vHeard = ''; renderExpr(); return; }   // tap what you said
    try { if (SPEECH.rec) SPEECH.rec.abort(); } catch (e) { /* ignore */ }
    const r = new SR(), tk = B.token; SPEECH.rec = r;
    r.lang = srLang(); r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
    if (mode === 'local' && 'processLocally' in r) r.processLocally = true;
    B.vState = 'listen'; B.vMode = mode; B.vHeard = ''; renderExpr();
    r.onresult = e => {
      if (B.token !== tk || B.q !== q) return;
      const alts = [...e.results[0]].map(a => a.transcript);
      B.vHeard = alts[0] || '';
      const idx = matchSpoken(alts, q.options.map((o, i) => (q.used && q.used.has(i)) || B.picked.has(i) ? '\u0000' : o));
      if (idx >= 0) { B.vState = 'idle'; renderExpr(); onPick(idx); renderExpr(); }
      else { B.vState = 'heard'; renderExpr(); }
    };
    r.onerror = e => { if (B.token !== tk) return; B.vState = 'heard'; B.vErr = e.error; renderExpr(); };
    r.onend = () => { if (B.token === tk && B.vState === 'listen') { B.vState = 'heard'; renderExpr(); } };
    try { r.start(); } catch (e) { B.vState = 'heard'; B.vErr = 'start'; renderExpr(); }
  });
}
function voicePanelHTML() {
  const q = B.q, st = B.vState || 'idle', mode = B.vMode || (SR ? '' : 'none');
  const cands = q ? q.options.map((o, i) => ({ o, i })).filter(c => !(q.used && q.used.has(c.i)) && !B.picked.has(c.i)) : [];
  const msg = st === 'listen' ? t('voice.listening') : st === 'heard' ? (B.vHeard ? t('voice.notSure', { w: B.vHeard }) : B.vErr === 'not-allowed' ? t('voice.denied') : B.vErr === 'no-speech' ? t('voice.noSpeech') : t('voice.heard')) : t('voice.mic');
  const note = mode === 'none' ? t('voice.noSupport') : mode === 'blocked' ? t('voice.blocked') : mode === 'online' ? t('voice.online') : t('voice.local');
  return `<div class="voice"><button class="mic ${st === 'listen' ? 'live' : ''}" data-act="mic" aria-label="${esc(t('voice.mic'))}">🎤</button>
    <p class="vtxt" aria-live="polite">${esc(msg)}</p>
    ${st === 'heard' ? `<div class="vopts">${cands.map(c => `<button class="btn" data-act="vpick" data-v="${c.i}">“${esc(c.o)}”</button>`).join('')}<button class="btn ghost" data-act="mic">${t('voice.again')}</button></div>` : ''}<small class="pad-note">🔒 ${esc(note)}</small></div>`;
}

/* v38: the child's chosen way to answer (How to answer) must work for the question in front of them.
   Voice needs a microphone and answers that can be said (words or numbers, not pictures); write needs a whole-number answer. Otherwise the
   buttons stay and a small note says "tap the answer for this one", so the child never sees an empty screen. */
const voiceOk = q => !!q && !!SR && !S.micOff && Array.isArray(q.options) && q.options.length > 1 && q.options.every(o => /[\p{L}\p{N}]/u.test(String(o)));
const voiceOn = q => S.expr === 'voice' && (!q || voiceOk(q) || q.kind === 'order' || q.kind === 'match' || q.kind === 'trace' || !!q.mount);
const tapNoteHTML = q => (q && ((S.expr === 'voice' && !voiceOn(q)) || (S.expr === 'write' && !writeOn(q) && !['trace', 'order', 'match'].includes(q.kind) && !q.mount))) ? `<small class="pad-note">👆 ${t('v38.tapThis')}</small>` : '';
Object.assign(STR, { 'v38.tapThis': ['Tap the answer for this one', 'Sentuh jawapan untuk soalan ini'] });
/* ---------------- tracing ---------------- */
const arcPts = (cx, cy, rx, ry, a0, a1, n = 18) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
/* stroke paths in a 100 x 100 box, in the order a child is taught to write them */
const GLYPHS = {
  A: [[[50, 8], [18, 92]], [[50, 8], [82, 92]], [[31, 62], [69, 62]]],
  B: [[[26, 8], [26, 92]], [[26, 8], [56, 8], [70, 15], [74, 27], [68, 40], [54, 47], [26, 47]], [[54, 47], [70, 54], [76, 68], [70, 83], [56, 92], [26, 92]]],
  C: [arcPts(55, 50, 36, 42, -40, -320)],
  D: [[[26, 8], [26, 92]], [[26, 8], [50, 8], [70, 18], [80, 36], [80, 64], [70, 82], [50, 92], [26, 92]]],
  E: [[[26, 8], [26, 92]], [[26, 8], [72, 8]], [[26, 50], [64, 50]], [[26, 92], [72, 92]]],
  F: [[[26, 8], [26, 92]], [[26, 8], [72, 8]], [[26, 50], [62, 50]]],
  G: [arcPts(55, 50, 36, 42, -40, -335), [[58, 56], [80, 56], [80, 84]]],
  H: [[[24, 8], [24, 92]], [[76, 8], [76, 92]], [[24, 50], [76, 50]]],
  I: [[[50, 8], [50, 92]], [[32, 8], [68, 8]], [[32, 92], [68, 92]]],
  J: [[[66, 8], [66, 70], [60, 86], [46, 92], [33, 86], [28, 72]], [[44, 8], [84, 8]]],
  K: [[[26, 8], [26, 92]], [[74, 8], [26, 56]], [[42, 42], [76, 92]]],
  L: [[[28, 8], [28, 92], [74, 92]]],
  M: [[[18, 92], [18, 8], [50, 60], [82, 8], [82, 92]]],
  N: [[[24, 92], [24, 8], [76, 92], [76, 8]]],
  O: [arcPts(50, 50, 34, 42, -90, -450, 24)],
  P: [[[26, 8], [26, 92]], [[26, 8], [56, 8], [72, 16], [76, 30], [70, 44], [56, 52], [26, 52]]],
  Q: [arcPts(50, 50, 34, 42, -90, -450, 24), [[58, 70], [82, 94]]],
  R: [[[26, 8], [26, 92]], [[26, 8], [56, 8], [72, 16], [76, 30], [70, 44], [56, 52], [26, 52]], [[50, 52], [78, 92]]],
  S: [[[74, 18], [62, 9], [44, 8], [30, 14], [25, 26], [32, 40], [50, 48], [68, 56], [76, 70], [70, 86], [52, 92], [34, 90], [24, 80]]],
  T: [[[20, 8], [80, 8]], [[50, 8], [50, 92]]],
  U: [[[24, 8], [24, 64], [30, 82], [42, 92], [58, 92], [70, 82], [76, 64], [76, 8]]],
  V: [[[20, 8], [50, 92], [80, 8]]],
  W: [[[12, 8], [30, 92], [50, 30], [70, 92], [88, 8]]],
  X: [[[22, 8], [78, 92]], [[78, 8], [22, 92]]],
  Y: [[[22, 8], [50, 48]], [[78, 8], [50, 48], [50, 92]]],
  Z: [[[22, 8], [78, 8], [22, 92], [78, 92]]],
  0: [arcPts(50, 50, 30, 42, -90, -450, 24)],
  1: [[[34, 24], [52, 8], [52, 92]]],
  2: [[[26, 26], [34, 12], [50, 8], [66, 12], [74, 26], [70, 40], [26, 92], [76, 92]]],
  3: [[[26, 16], [40, 8], [60, 8], [72, 18], [72, 32], [62, 44], [46, 48], [62, 52], [74, 64], [74, 80], [60, 92], [40, 92], [26, 84]]],
  4: [[[62, 92], [62, 8], [22, 66], [80, 66]]],
  5: [[[72, 8], [32, 8], [28, 44], [48, 40], [66, 46], [76, 62], [72, 82], [56, 92], [36, 90], [26, 82]]],
  6: [[[70, 12], [54, 8], [38, 14], [28, 34], [26, 58], [30, 80], [46, 92], [62, 90], [74, 76], [72, 58], [58, 48], [42, 50], [30, 60]]],
  7: [[[24, 8], [76, 8], [42, 92]]],
  8: [[[50, 48], [34, 40], [30, 26], [38, 12], [50, 8], [62, 12], [70, 26], [66, 40], [50, 48], [32, 58], [26, 74], [34, 88], [50, 92], [66, 88], [74, 74], [68, 58], [50, 48]]],
  9: [[[72, 40], [62, 50], [46, 52], [32, 44], [28, 28], [36, 13], [50, 8], [64, 12], [72, 28], [72, 60], [66, 82], [52, 92], [34, 88]]]
};
/* v31: small letters. x-height 40-80, ascenders from 8, descenders to 98, so a small letter sits where it would on
   lined paper; the strokes follow the order taught in Malaysian preschools (c-shape first, then the stick). */
const LC = (cx, rx = 19) => arcPts(cx, 60, rx, 20, 0, -360, 24);   // a round bowl, starting at its right side, going up and over
Object.assign(GLYPHS, {
  a: [LC(48), [[67, 40], [67, 80]]],
  b: [[[30, 8], [30, 80]], arcPts(49, 60, 19, 20, -180, 180, 24)],
  c: [arcPts(52, 60, 19, 20, -40, -320, 18)],
  d: [LC(50), [[69, 8], [69, 80]]],
  e: [[[31, 60], [69, 60], ...arcPts(50, 60, 19, 20, 0, -315, 20).slice(1)]],
  f: [[[66, 14], [58, 8], [48, 9], [43, 18], [43, 80]], [[30, 40], [60, 40]]],
  g: [arcPts(48, 58, 19, 18, 0, -360, 24), [[67, 40], [67, 88], [60, 96], [46, 98], [34, 92]]],
  h: [[[30, 8], [30, 80]], [[30, 56], [38, 44], [50, 40], [62, 44], [68, 54], [68, 80]]],
  i: [[[50, 40], [50, 80]], [[50, 22], [50, 25]]],
  j: [[[58, 40], [58, 90], [52, 96], [42, 98], [34, 93]], [[58, 22], [58, 25]]],
  k: [[[32, 8], [32, 80]], [[66, 40], [32, 64]], [[44, 56], [68, 80]]],
  l: [[[50, 8], [50, 80]]],
  m: [[[22, 40], [22, 80]], [[22, 52], [30, 42], [40, 40], [48, 46], [50, 56], [50, 80]], [[50, 52], [58, 42], [68, 40], [76, 46], [78, 56], [78, 80]]],
  n: [[[30, 40], [30, 80]], [[30, 54], [38, 43], [50, 40], [62, 44], [68, 54], [68, 80]]],
  o: [arcPts(50, 60, 20, 20, -90, -450, 24)],
  p: [[[30, 40], [30, 98]], arcPts(49, 60, 19, 20, -180, 180, 24)],
  q: [LC(50), [[69, 40], [69, 98]]],
  r: [[[34, 40], [34, 80]], [[34, 56], [42, 44], [54, 40], [66, 44]]],
  s: [[[66, 46], [58, 40], [44, 40], [34, 46], [36, 56], [50, 60], [64, 64], [68, 72], [60, 80], [44, 80], [32, 74]]],
  t: [[[46, 14], [46, 74], [52, 80], [62, 80], [68, 76]], [[32, 40], [62, 40]]],
  u: [[[30, 40], [30, 66], [36, 78], [48, 80], [60, 76], [68, 66]], [[68, 40], [68, 80]]],
  v: [[[28, 40], [50, 80], [72, 40]]],
  w: [[[16, 40], [32, 80], [50, 52], [68, 80], [84, 40]]],
  x: [[[30, 40], [70, 80]], [[70, 40], [30, 80]]],
  y: [[[30, 40], [50, 74]], [[70, 40], [50, 74], [40, 96]]],
  z: [[[30, 40], [70, 40], [30, 80], [70, 80]]]
});
const resample = (pts, step = 2) => { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(d / step)); for (let k = 1; k <= n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]); } return out; };
/* how well do the child's strokes follow the guide? coverage = guide covered, precision = ink near the guide */
/* v31: works for small letters too, and every stroke must be traced at least half way (before, the dot of an i,
   the bar of a t or an A could be left out and still pass). A dot is a stroke shorter than 6 units: one tap near it counts.
   Small letters are drawn smaller, so the ink only has to stay a little closer than for capitals. */
function traceScore(glyph, strokes, loose) {   // v35: loose = drawn from memory with the guide hidden, so the ink may wander a little more
  const G = GLYPHS[glyph]; if (!G) return { cover: 0, prec: 0, strokes: [], ok: false };
  const small = /^[a-z]$/.test(glyph), R = loose ? 17 : small ? 11 : 12;
  const segs = G.map(s => resample(s)), guide = segs.flat(), ink = strokes.flatMap(s => s.length > 1 ? resample(s, 3) : s);
  if (ink.length < (small ? 3 : 4)) return { cover: 0, prec: 0, strokes: segs.map(() => 0), ok: false };
  const near = (p, list) => list.some(q => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 <= R * R);
  /* each stroke is judged on its own part: the points that are not close to any other stroke (where the bar of an A
     meets the legs, the legs' ink would otherwise count for the bar) */
  const per = segs.map((sg, i) => { const others = segs.filter((_, k) => k !== i).flat(), own = sg.filter(p => !near(p, others)), pts = own.length >= 3 ? own : sg; return pts.filter(p => near(p, ink)).length / pts.length; });
  const cover = guide.filter(p => near(p, ink)).length / guide.length, prec = ink.filter(p => near(p, guide)).length / ink.length;
  return { cover, prec, strokes: per, ok: loose ? cover >= .66 && prec >= .5 && per.every(v => v >= .45) : cover >= .72 && prec >= .55 && per.every(v => v >= .5) };
}
/* the tracing pad: draws the guide and the child's ink, calls done(score) when they tap Done */
function mountTrace(host, glyph, done, maxSize = 300, opts) {   // v35: opts.hide hides the guide until the first miss; opts.loose scores a little kinder (draw-to-answer)
  host.innerHTML = `<div class="trace"><canvas class="trcv" aria-label="${esc(t('tr.aria', { g: glyph }))}"></canvas><div class="trbar"><button class="btn ghost" data-tr="clear">↺ ${t('tr.clear')}</button><button class="btn" data-tr="done">✓ ${t('tr.done')}</button></div><p class="trmsg" aria-live="polite"></p></div>`;
  const cv = host.querySelector('canvas'), g = cv.getContext('2d'); if (!g) return;
  const css = typeof getComputedStyle === 'function' ? getComputedStyle(document.documentElement) : null, ink = (css && css.getPropertyValue('--accent').trim()) || '#7C5CFF', guideC = 'rgba(150,140,190,.38)';
  const size = Math.min(maxSize, Math.max(Math.min(200, maxSize), (host.getBoundingClientRect().width || 300) - 8)), dpr = window.devicePixelRatio || 1;
  cv.width = cv.height = size * dpr; cv.style.width = cv.style.height = size + 'px';
  const k = size * dpr / 100, strokes = []; let cur = null, missed = null, hideG = !!(opts && opts.hide);
  function paint() {
    g.clearRect(0, 0, cv.width, cv.height); g.lineCap = g.lineJoin = 'round';
    if (!hideG) GLYPHS[glyph].forEach(s => { g.strokeStyle = guideC; g.lineWidth = 15 * k; g.beginPath(); s.forEach(([x, y], i) => i ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k)); g.stroke(); g.setLineDash([2 * k, 3 * k]); g.lineWidth = 1.2 * k; g.strokeStyle = 'rgba(110,100,150,.7)'; g.stroke(); g.setLineDash([]); });
    if (!hideG) GLYPHS[glyph].map((s, i) => { const [x0, y0] = s[0], c = GLYPHS[glyph].slice(0, i).filter(q => Math.hypot(q[0][0] - x0, q[0][1] - y0) < 9).length; return [s, i, x0 + c * 9, y0]; }).reverse().forEach(([s, i, x, y]) => { g.fillStyle = '#3FBF7F'; g.beginPath(); g.arc(x * k, y * k, 5.5 * k, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `bold ${7 * k}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(i + 1), x * k, y * k + .4 * k); });
    if (missed) { g.fillStyle = 'rgba(232,87,59,.75)'; missed.forEach(([x, y]) => { g.beginPath(); g.arc(x * k, y * k, 2.2 * k, 0, 7); g.fill(); }); }
    g.strokeStyle = ink; g.lineWidth = 7 * k;
    strokes.forEach(s => { g.beginPath(); s.forEach(([x, y], i) => i ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k)); if (s.length === 1) g.lineTo(s[0][0] * k + .1, s[0][1] * k); g.stroke(); });
  }
  const pt = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) / b.width * 100, (e.clientY - b.top) / b.height * 100]; };
  cv.addEventListener('pointerdown', e => { e.preventDefault(); cur = [pt(e)]; strokes.push(cur); missed = null; try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } paint(); });
  cv.addEventListener('pointermove', e => { if (cur) { cur.push(pt(e)); paint(); } });
  const end = () => { cur = null; }; cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  host.querySelector('[data-tr="clear"]').onclick = () => { strokes.length = 0; missed = null; host.querySelector('.trmsg').textContent = ''; paint(); };
  host.querySelector('[data-tr="done"]').onclick = () => {
    const sc = traceScore(glyph, strokes, !!(opts && opts.loose));
    if (!sc.ok) { hideG = false; const inkPts = strokes.flatMap(s => s.length > 1 ? resample(s, 3) : s); missed = GLYPHS[glyph].flatMap(s => resample(s, 4)).filter(p => !inkPts.some(q => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 <= 144)); paint(); }
    host.querySelector('.trmsg').textContent = sc.ok ? t('tr.great') : strokes.length ? t('tr.almost') : t('tr.start');
    done(sc, () => { strokes.length = 0; missed = null; paint(); });
  };
  paint();
  return { reset: () => { strokes.length = 0; missed = null; paint(); } };
}
const TRACE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', TRACE_LOWER = 'abcdefghijklmnopqrstuvwxyz', TRACE_DIGITS = '0123456789';
const traceChars = set => (set === '123' ? TRACE_DIGITS : set === 'abc' ? TRACE_LOWER : TRACE_LETTERS).split('');   // v31: the tracing sets
const traceSay = g => t(/\d/.test(g) ? 'tr.sayNum' : /[a-z]/.test(g) ? 'tr.sayLower' : 'tr.sayLetter', { g });
/* a tracing "question" for age 4 battles */
function traceQ(subj) {
  const num = subj === 'math', g = pick((num ? TRACE_DIGITS : Math.random() < .4 ? TRACE_LOWER : TRACE_LETTERS).split('')), say = traceSay(g);   // v31: small letters too
  return { kind: 'trace', type: 'trace', glyph: g, topic: subj + '_trace', tag: t('tr.tag'), text: say, options: [], correct: -1, cls: '', key: 'trace:' + subj + ':' + g, noTap: true, customSteps: true,
    ansText: g, steps: () => [t('tr.s1'), t('tr.s2'), t('tr.s3')], speak: [[say]], viz: () => `<div class="trglyph" aria-hidden="true">${esc(g)}</div>` };
}
const wantsTrace = lv => S.band === 1 && lv && ['en', 'bm', 'math'].includes(lv.subj) && !lv.boss && Math.random() < .25;
function mountTraceAnswer() {
  const a = $('#answers'), q = B.q; if (!q || q.kind !== 'trace') return;
  a.hidden = false; a.style.gridTemplateColumns = '1fr'; a.classList.remove('long');
  mountTrace(a, q.glyph, (sc, reset) => {
    if (B.locked || B.q !== q) return;
    if (sc.ok) { B.locked = true; onCorrect(); return; }
    HOOK.emit('answer:wrong', q, -1);
    B.wrong++; B.lead = t('fb.wrong'); sfx.soft(); B.combo = 0; B.charge = 0; updateHud();
    B.tleft = B.tmax; setTier(B.wrong); setTimeout(() => { if (B.q === q && !B.locked) reset(); }, 1400);
  }, Math.max(150, Math.min(190, innerHeight * .24)));   // v23: a smaller pad in battle
}

STR['tr.sayLower'] = ['Trace the small letter {g}. Start at the green dot.', 'Surih huruf kecil {g}. Mula di titik hijau.'];   // v31
