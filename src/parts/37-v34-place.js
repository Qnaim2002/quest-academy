/* ================= v34: the first-launch placement quiz, and questions that follow the child in battle =================
   PLACEMENT. The first time a child plays (and any time a grown-up asks, in the Parents tab) a short "quick check"
   goes through the subjects one by one. Each subject is a little staircase of up to five questions, easy to harder
   (the harder steps come from the next age's questions and from higher levels). The first question the child misses
   ends that subject. The number of steps climbed sets the level where that subject starts (S.place, one per subject
   and per age). Earlier levels stay open to replay. A child can skip a subject, or the whole quick check, at any time.
   IN BATTLE. Two right answers in a row (first try) make the next question a little harder; two misses in a row make it
   a little easier. The "level" moves by one step each time, between -3 and +3. Every step changes how big the numbers
   are (B.dk), and from +2 / -2 the questions come from the next / the earlier age. It is reset in every battle and
   a grown-up can switch it off (S.adapt). */
const PL_RUNGS = [{ n: 2, off: -1 }, { n: 12, off: 0 }, { n: 24, off: 0 }, { n: 40, off: 1 }, { n: 60, off: 1 }];   // the staircase: a level and an age offset
const PL_START = [1, 1, 11, 21, 31, 41];                                                                           // start level for 0..5 steps climbed
const PL = { list: [], i: 0, rung: 0, q: null, res: {}, seen: new Set(), lock: false, open: false };
const clampBand = b => Math.max(1, Math.min(4, b | 0));

Object.assign(STR, {
  'pl.title': ['Find your starting level', 'Cari tahap permulaan kamu'],
  'pl.sub': ['Answer a few quick questions so every subject starts in the right place. It is only a game, so do not worry!', 'Jawab beberapa soalan cepat supaya setiap mata pelajaran bermula di tempat yang betul. Ini hanya permainan, jangan risau!'],
  'pl.time': ['About 3 minutes. You can skip any time.', 'Kira-kira 3 minit. Boleh langkau bila-bila masa.'],
  'pl.go': ["Let's go!", 'Jom mula!'], 'pl.later': ['Not now', 'Bukan sekarang'],
  'pl.of': ['Subject {i} of {n}', 'Mata pelajaran {i} daripada {n}'],
  'pl.skip': ['Not sure', 'Tidak pasti'], 'pl.skipAll': ['Skip the quick check', 'Langkau semakan cepat'],
  'pl.q': ['Question {i}', 'Soalan {i}'], 'pl.read': ['Read the question', 'Baca soalan'],
  'pl.done': ['All set!', 'Siap!'], 'pl.doneSub': ['This is where each subject will start. You can still play earlier levels.', 'Inilah tempat setiap mata pelajaran bermula. Kamu masih boleh main tahap yang lebih awal.'],
  'pl.lv': ['Level {n}', 'Tahap {n}'], 'pl.play': ['Start playing', 'Mula bermain'],
  'pl.retake': ['Take the quick check again', 'Ambil semakan cepat sekali lagi'],
  'pl.reset': ['Start every subject at level 1', 'Mulakan semua mata pelajaran di tahap 1'],
  'pl.nowAge': ['For {age}', 'Untuk {age}'],
  'pl.closeAria': ['Close', 'Tutup'],
  'pl.tip': ['Tip: a grown-up can run this again in the Parents tab.', 'Tip: orang dewasa boleh menjalankannya semula dalam tab Ibu Bapa.'],
  'ad.up': ['Tougher questions', 'Soalan lebih sukar'], 'ad.down': ['Gentler questions', 'Soalan lebih mudah'],
  'ad.aria': ['Question level {n}', 'Tahap soalan {n}'],
  'v34.card': ['Learning helpers', 'Pembantu pembelajaran'],
  'v34.adapt': ['Harder or easier questions in battle: {s}', 'Soalan lebih sukar atau mudah dalam pertarungan: {s}'],
  'v34.placeInfo': ['Starting levels from the quick check', 'Tahap permulaan daripada semakan cepat']
});

/* ---------- a modal that this file (and the other v34 files) can use ---------- */
function v34Sheet(id, label, closeAct) {
  let ov = document.getElementById(id);
  if (!ov) {
    document.body.insertAdjacentHTML('beforeend', `<div class="overlay v34ov" id="${id}"><div class="mwrap"><button class="mclose" data-act="${closeAct}" aria-label="${esc(t('pl.closeAria'))}">✕</button><div class="sheet v34sheet" id="${id}Sheet" role="dialog" aria-modal="true" aria-label="${esc(label)}"></div></div></div>`);
    ov = document.getElementById(id);
  }
  return ov;
}
const v34On = (id, on) => { const o = document.getElementById(id); if (o) o.classList.toggle('on', !!on); };

/* ---------- the quick check ---------- */
const plSubjects = () => SUBJ_ORDER.filter(s => subjOpen(s));
function plPlacedLevel(passed) { return PL_START[Math.max(0, Math.min(PL_START.length - 1, passed | 0))]; }
function plMakeQ(subj, rung) {
  const r = PL_RUNGS[Math.max(0, Math.min(PL_RUNGS.length - 1, rung))], lv = levelOf(subj, r.n), band = clampBand(S.band + r.off), keep = B.dk;
  let q = null;
  try {
    B.dk = lv.dk || 1;
    for (let g = 0; g < 40; g++) {
      const c = makeQ(pick(lv.pool), band, lv);
      if (c && c.options && c.options.length >= 2 && c.kind !== 'phonics' && !PL.seen.has(qKey(c))) { q = c; break; }
    }
  } finally { B.dk = keep; }
  if (q) PL.seen.add(qKey(q));
  return q;
}
function plOffer() {
  v34Sheet('plOverlay', t('pl.title'), 'plClose');
  $('#plOverlaySheet').innerHTML = `<div class="pl-hero" aria-hidden="true">${heroSVG(S.equipped)}</div><h2>${esc(t('pl.title'))}</h2><p class="sub">${esc(t('pl.sub'))}</p><p class="note">⏱️ ${esc(t('pl.time'))}</p>
    <div class="brief-actions"><button class="btn big" data-act="plStart">${esc(t('pl.go'))}</button><button class="btn ghost" data-act="plLater">${esc(t('pl.later'))}</button></div>`;
  v34On('plOverlay', true);
}
function plStart() {
  Object.assign(PL, { list: plSubjects(), i: 0, rung: 0, q: null, res: {}, seen: new Set(), lock: false, open: true });
  if (!PL.list.length) { plFinish(); return; }
  plAsk();
}
function plAsk() {
  const subj = PL.list[PL.i]; if (!subj) { plFinish(); return; }
  const q = plMakeQ(subj, PL.rung);
  if (!q) { plSubjectDone(subj); return; }   // no question could be made: this subject starts at the beginning
  PL.q = q; PL.lock = false;
  const n = PL.list.length, pct = Math.round((PL.i + PL.rung / PL_RUNGS.length) / n * 100);
  let viz = ''; try { viz = q.viz ? q.viz(false) : ''; } catch (e) { viz = ''; }
  $('#plOverlaySheet').innerHTML = `<div class="pl-top"><span class="pl-subj">${SUBJ_EM[subj]} ${esc(t('subj.' + subj))}</span><span class="pl-count">${esc(t('pl.of', { i: PL.i + 1, n }))}</span></div>
    <div class="pl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
    <div class="pl-q"><div class="pl-qhead"><span class="tag">${esc(t('pl.q', { i: PL.rung + 1 }))}</span><button class="speak" data-act="plSay" aria-label="${esc(t('pl.read'))}">🔊</button></div>
    <p class="pl-text">${esc(q.text)}</p><div class="qviz pl-viz">${viz}</div></div>
    <div class="pl-opts">${q.options.map((o, i) => `<button class="plopt ${q.cls || ''}" data-act="plPick" data-v="${i}">${esc(o)}</button>`).join('')}</div>
    <div class="pl-foot"><button class="linkbtn" data-act="plNotSure">${esc(t('pl.skip'))}</button><button class="linkbtn" data-act="plAbort">${esc(t('pl.skipAll'))}</button></div>`;
  announce(q.text);
}
function plPick(i) {
  const q = PL.q; if (!q || PL.lock) return; PL.lock = true;
  const btn = $(`#plOverlaySheet .plopt[data-v="${i}"]`); if (btn) btn.classList.add('chosen');
  const ok = i === q.correct;
  setTimeout(() => { if (!PL.open) return; if (ok) { PL.rung++; if (PL.rung >= PL_RUNGS.length) plSubjectDone(PL.list[PL.i]); else plAsk(); } else plSubjectDone(PL.list[PL.i]); }, S.sensory ? 120 : 380);
}
function plSubjectDone(subj) {
  PL.res[subj] = plPlacedLevel(PL.rung); PL.i++; PL.rung = 0;
  if (PL.i >= PL.list.length) plFinish(); else plAsk();
}
function plApply(res) {
  S.place = S.place || {};
  Object.keys(res).forEach(s => { const lv = Math.max(1, Math.min(LEVELS_PER, res[s] | 0)); if (lv > 1) S.place[placeKey(s)] = lv; else delete S.place[placeKey(s)]; });
  S.placed = true; S.placeAt = Date.now(); save();
}
function plFinish() {
  PL.open = false; PL.q = null; plApply(PL.res);
  const rows = Object.keys(PL.res).map(s => `<li><span>${SUBJ_EM[s]} ${esc(t('subj.' + s))}</span><b>${esc(t('pl.lv', { n: PL.res[s] }))}</b></li>`).join('');
  $('#plOverlaySheet').innerHTML = `<div class="pl-hero pose-cheer" aria-hidden="true">${heroSVG(S.equipped)}</div><h2>🎉 ${esc(t('pl.done'))}</h2><p class="sub">${esc(t('pl.doneSub'))}</p><ul class="pl-res">${rows}</ul><p class="note">${esc(t('pl.tip'))}</p>
    <div class="brief-actions"><button class="btn big" data-act="plPlay">${esc(t('pl.play'))}</button></div>`;
  sfx.win && sfx.win();
  if (UI.tab === 'parent' && gate.unlocked) renderParent();
}
function plClose(markDone = true) {
  const mid = PL.open; PL.open = false;
  if (mid && Object.keys(PL.res).length) plApply(PL.res);   // subjects already finished keep their start level
  if (markDone && !S.placed) { S.placed = true; save(); }
  v34On('plOverlay', false);
  if (UI.tab === 'adventure' && UI.screen === 'levels') renderLevels(); else if (UI.tab === 'adventure') renderMap();
}
function plReset() { S.place = {}; S.placed = true; save(); if (UI.tab === 'parent' && gate.unlocked) renderParent(); toast(t('pl.reset')); }

/* ---------- first launch: after the welcome screen closes ---------- */
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'wlGo': if (!S.placed) setTimeout(() => { if (!S.placed && !B.active && !$('#welcomeOverlay').classList.contains('on')) plOffer(); }, 650); return undefined;
    case 'plStart': plStart(); return true;
    case 'plLater': plClose(true); return true;
    case 'plClose': plClose(true); return true;
    case 'plAbort': plClose(true); return true;
    case 'plPick': plPick(+v); return true;
    case 'plNotSure': if (PL.open && PL.q && !PL.lock) { PL.lock = true; plSubjectDone(PL.list[PL.i]); } return true;
    case 'plSay': if (PL.q) speakSeq(PL.q.speak); return true;
    case 'plPlay': plClose(true); showTab('adventure', true); return true;
    case 'plRetake': S.placed = false; plOffer(); return true;
    case 'plReset': plReset(); return true;
    case 'adaptToggle': S.adapt = S.adapt === false; save(); renderParent(); return true;
  }
  return undefined;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && PL.open) plClose(true); });

/* ================= in battle: the next question follows how the child is doing ================= */
const AD_MAX = 3;
function adReset() { B.ad = { r: 0, w: 0, lvl: 0 }; B.shift = 0; adApply(false); }
function adBase() { return B.lv ? (B.lv.dk || 1) : (B.dk || 1); }
function adApply(flash) {
  const ad = B.ad || (B.ad = { r: 0, w: 0, lvl: 0 }), on = S.adapt !== false;
  const lvl = on ? ad.lvl : 0;
  B.dk = Math.max(.2, Math.min(1, adBase() + .1 * lvl));
  B.shift = lvl >= 2 ? 1 : lvl <= -2 ? -1 : 0;
  adChip(flash);
}
function adChip(flash) {
  const top = $('#battleView .stage-top'); if (!top) return;
  let c = $('#adChip');
  if (!c) { top.insertAdjacentHTML('beforeend', '<span class="chip static adchip" id="adChip" hidden></span>'); c = $('#adChip'); if (!c) return; }
  const l = (B.ad && S.adapt !== false) ? B.ad.lvl : 0;
  c.hidden = !l; if (!l) return;
  c.textContent = (l > 0 ? '⬆️ ' : '⬇️ ') + Math.abs(l); c.classList.toggle('down', l < 0);
  c.setAttribute('aria-label', t('ad.aria', { n: l > 0 ? '+' + l : l }));
  if (flash && !S.sensory) replayClass(c, 'adpop');
}
function adAnswer(right) {
  if (S.adapt === false || !B.active || !B.q) return;
  const ad = B.ad || (B.ad = { r: 0, w: 0, lvl: 0 });
  if (right) {
    if (B.wrong > 0) { ad.r = 0; return; }   // only a first-try answer counts as "right"
    ad.r++; ad.w = 0;
    if (ad.r >= 2) { ad.r = 0; if (ad.lvl < AD_MAX) { ad.lvl++; announce(t('ad.up')); adApply(true); } }
  } else {
    if (B.wrong > 0) return;   // only the first miss on a question counts
    ad.w++; ad.r = 0;
    if (ad.w >= 2) { ad.w = 0; if (ad.lvl > -AD_MAX) { ad.lvl--; announce(t('ad.down')); adApply(true); } }
  }
}
HOOK.before('startBattle', () => { B.shift = 0; B.ad = { r: 0, w: 0, lvl: 0 }; });
HOOK.on('startBattle', () => adReset());
HOOK.on('answer:right', () => adAnswer(true));
HOOK.on('answer:wrong', () => adAnswer(false));

/* ---------- the Parents tab card ---------- */
function v34CardHTML() {
  const pl = Object.entries(S.place || {}).filter(([k]) => k.startsWith(S.band + ':')).map(([k, n]) => `${SUBJ_EM[k.split(':')[1]] || ''} ${n}`).join(' · ');
  return `<div class="card v34card" id="v34Card"><h3>🧭 ${esc(t('v34.card'))}</h3>
    <div class="seg">${tog('adaptToggle', 'v34.adapt', S.adapt !== false)}</div>
    <p class="note">${esc(t('v34.placeInfo'))}: ${pl ? esc(pl) : '—'}</p>${typeof kbatSummaryHTML === 'function' ? kbatSummaryHTML() : ''}${typeof v34LookCardHTML === 'function' ? v34LookCardHTML() : ''}${typeof v34PwaCardHTML === 'function' ? v34PwaCardHTML() : ''}
    <div class="seg"><button class="chip" data-act="plRetake">🧭 ${esc(t('pl.retake'))}</button><button class="chip" data-act="plReset">↺ ${esc(t('pl.reset'))}</button></div></div>`;
}
HOOK.on('renderParent', () => {
  if (!gate.unlocked) return;
  const pc = $('#tab-parent [data-act="pinChange"]'), priv = pc && pc.closest ? pc.closest('.card') : null;
  if (priv && priv.insertAdjacentHTML) priv.insertAdjacentHTML('afterend', v34CardHTML());
});
