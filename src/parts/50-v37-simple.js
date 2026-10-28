/* ================= v37: a simpler home for small children =================
   Four big buttons at the bottom: Learn, Play, Hero, Cards. Grown-ups use the 🔒 button at the top.
   LEARN is three steps with one choice on each: 1 pick a subject, 2 pick a lesson, 3 press Go.
   The old subject-list pop-up, the age buttons, the pet strip and the activity wall are gone from this screen
   (the child's age is the one a grown-up chose; the games have their own big-button page).
   PLAY holds three big buttons: Battle (the old Adventure), Tower and Think (KBAT). Each has a back arrow.
   Nothing was removed from the game itself: every old tab, action and save key still works. */
Object.assign(STR, {
  'nav.studies': ['Learn', 'Belajar'], 'nav.armory': ['Hero', 'Wira'], 'nav.play': ['Play', 'Main'],
  'v37.pick': ['What do you want to learn?', 'Kamu mahu belajar apa?'],
  'v37.play': ['What shall we play?', 'Nak main apa?'],
  'v37.battle': ['Battle', 'Pertarungan'], 'v37.battleD': ['Fight monsters', 'Lawan raksasa'],
  'v37.tower': ['Tower', 'Menara'], 'v37.towerD': ['Climb up high', 'Panjat tinggi-tinggi'],
  'v37.think': ['Think', 'Fikir'], 'v37.thinkD': ['Clever puzzles', 'Teka-teki bijak'],
  'v37.games': ['Games', 'Permainan'], 'v37.ready': ['Ready?', 'Sedia?'], 'v37.go': ['Go!', 'Mula!'],
  'v37.back': ['Back', 'Kembali'], 'v37.prev': ['Earlier', 'Sebelumnya'], 'v37.next': ['More', 'Lagi'],
  'v37.locked': ['Do the lessons before this one first. 🔒', 'Buat pelajaran sebelum ini dahulu. 🔒'],
  'v37.step': ['Step {i} of 3', 'Langkah {i} daripada 3'],
  'v37.lock': ['Grown-ups only', 'Untuk orang dewasa sahaja'],
  'v37.none': ['No lessons here yet.', 'Belum ada pelajaran di sini.'],
  'v37.page': ['Page {i} of {n}', 'Halaman {i} daripada {n}'],
  'v37.lnext': ['Next', 'Seterusnya'], 'v37.lback': ['Back', 'Kembali'], 'v37.finish': ['Finish', 'Siap'],
  'v37.lpos': ['Step {i} of {n}', 'Langkah {i} daripada {n}']
});
const V37_PLAY = ['adventure', 'tower', 'kbat'];
const v37Key = name => name === 'adventure' ? 'battle' : name === 'kbat' ? 'think' : name;   // the word used for each Play screen
const V37_PER = 4, V37_LESSONS = 3;   // 4 subjects on a page (2 x 2), 3 lessons on a page
const v37 = () => UI.v37 || (UI.v37 = { step: 'subj', pg: 0, subj: null, lp: 0, lesson: null });
const v37Dots = a => `<div class="v37-steps" role="img" aria-label="${esc(t('v37.step', { i: a }))}">${[1, 2, 3].map(i => `${i > 1 ? `<u class="${i <= a ? 'done' : ''}"></u>` : ''}<b class="${i === a ? 'on' : i < a ? 'done' : ''}">${i < a ? '✓' : i}</b>`).join('')}</div>`;
const v37Pager = (pg, n, prevAct, nextAct) => n < 2 ? '' : `<div class="v37-pager"><button class="v37-arrow" data-act="${prevAct}" aria-label="${esc(t('v37.prev'))}"><span aria-hidden="true">‹</span></button><span class="v37-pdots" role="img" aria-label="${esc(t('v37.page', { i: pg + 1, n }))}">${Array.from({ length: n }, (_, i) => `<i class="${i === pg ? 'on' : ''}"></i>`).join('')}</span><button class="v37-arrow" data-act="${nextAct}" aria-label="${esc(t('v37.next'))}"><span aria-hidden="true">›</span></button></div>`;

/* the tiles of step 1: the open subjects, tracing, and the games (a page of four at a time) */
function v37Tiles() {
  const subj = SUBJECTS.filter(([id]) => subjOpen(id)).map(([id, em]) => ({ act: 'v37Subj', v: id, em, name: t('subj.' + id), c: SUBJ_COL[id] }));
  const trace = { act: 'traceOpen', v: '', em: '✍️', name: t('tr.title'), c: '#3FBF7F' };
  const games = { act: 'v37Games', v: '', em: '🎮', name: t('v37.games'), c: '#1F78B4' };
  return [...(S.band === 1 ? [trace] : []), ...subj, ...(S.band === 1 ? [] : [trace]), games];
}
/* the lessons of one subject, in ladder order, with what each one is doing right now */
function v37Lessons(subj) {
  const out = [];
  ladders(subj, S.band).forEach(T => T.lessons.forEach(({ m, rung }) => out.push({ m, topic: T.name, done: learnedAt(m.id), open: rungOpen(T, rung) })));
  return out;
}
const v37Next = list => list.findIndex(x => x.open && !x.done);

function v37HTML() {
  const v = v37();
  if (v.step === 'games') {
    const keys = ['notebook', 'story', 'word', 'sifir', 'lab', 'map', 'music', 'feel', 'safety', 'phonics'].filter(k => actOK(k));
    const tiles = keys.map(k => { const A = ACTS[k], young = A.bands && !A.bands.includes(S.band); return `<button class="v37-big small ${young ? 'young' : ''}" style="--c:${A.col}" data-act="actOpen" data-v="${k}"><i aria-hidden="true">${A.em}</i><span>${t('ac.' + k)}</span></button>`; }).join('');
    return `<div class="v37-title"><button class="v37-back" data-act="v37To" data-v="subj" aria-label="${esc(t('v37.back'))}"><span aria-hidden="true">‹</span></button><h1>🎮 ${t('v37.games')}</h1></div><div class="v37-grid">${tiles}</div>`;
  }
  if (v.step === 'ready' && v.lesson && MODULES.find(m => m.id === v.lesson)) {
    const m = MODULES.find(x => x.id === v.lesson);
    return `${v37Dots(3)}<div class="v37-title"><button class="v37-back" data-act="v37To" data-v="lessons" aria-label="${esc(t('v37.back'))}"><span aria-hidden="true">‹</span></button><h1>${t('v37.ready')}</h1></div>
      <div class="v37-ready" style="--c:${SUBJ_COL[m.subject]}"><div class="v37-face" aria-hidden="true">${m.em}</div><h2>${esc(tr(m, 'title'))}</h2>
      <div class="v37-vs"><span class="v37-hero" aria-hidden="true">${heroSVG(S.equipped)}</span><small>${t('st.min', { n: m.min })}</small></div></div>
      <button class="btn big v37-go" data-act="open" data-v="${m.id}">▶ ${t('v37.go')}</button>`;
  }
  if (v.step === 'lessons' && v.subj) {
    const sub = SUBJECTS.find(x => x[0] === v.subj), list = v37Lessons(v.subj), n = Math.max(1, Math.ceil(list.length / V37_LESSONS));
    v.lp = Math.max(0, Math.min(n - 1, v.lp)); const nx = v37Next(list);
    const cards = list.slice(v.lp * V37_LESSONS, v.lp * V37_LESSONS + V37_LESSONS).map((x, k) => {
      const i = v.lp * V37_LESSONS + k, st = x.done ? 'done' : !x.open ? 'locked' : i === nx ? 'next' : '';
      return `<button class="v37-lesson ${st}" data-act="v37Lesson" data-v="${x.m.id}" ${x.open ? '' : 'aria-disabled="true"'}><span class="le" aria-hidden="true">${x.m.em}</span><span class="ln">${esc(tr(x.m, 'title'))}<small>${esc(x.topic)}</small></span><span class="ls" aria-hidden="true">${x.done ? '⭐' : !x.open ? '🔒' : i === nx ? '▶' : ''}</span></button>`;
    }).join('');
    return `${v37Dots(2)}<div class="v37-title" style="--c:${SUBJ_COL[v.subj]}"><button class="v37-back" data-act="v37To" data-v="subj" aria-label="${esc(t('v37.back'))}"><span aria-hidden="true">‹</span></button><h1>${sub[1]} ${t('subj.' + v.subj)}</h1></div>
      <div class="v37-list" style="--c:${SUBJ_COL[v.subj]}">${cards || `<p class="note">${t('v37.none')}</p>`}</div>${v37Pager(v.lp, n, 'v37Lp', 'v37Ln')}`;
  }
  const tiles = v37Tiles(), n = Math.max(1, Math.ceil(tiles.length / V37_PER)); v.pg = ((v.pg % n) + n) % n;
  const page = tiles.slice(v.pg * V37_PER, v.pg * V37_PER + V37_PER).map(x => `<button class="v37-big" style="--c:${x.c}" data-act="${x.act}" data-v="${x.v}"><i aria-hidden="true">${x.em}</i><span>${esc(x.name)}</span></button>`).join('');
  return `${v37Dots(1)}<h1 class="v37-h">${t('v37.pick')}</h1><div class="v37-grid">${page}</div>${v37Pager(v.pg, n, 'v37Pp', 'v37Pn')}`;
}
function v37Paint() {
  const el = $('#tab-studies'); if (!el) return;
  const top = el.scrollTop;
  if (setHTML(el, `<div class="wrap v37">${v37HTML()}<div class="actslot" hidden></div></div>`)) el.scrollTop = top;
}
/* the old subject-list pop-up never opens now; the age is the one a grown-up chose */
HOOK.around('renderStudies', (next, ...a) => { UI.sage = S.band; UI.list = null; const r = next(...a); v37Paint(); v37Lesson(); return r; });

/* ---- the lesson page: one small thing at a time ----
   The old page was one long scroll (quick check, six cards with a chip row, "see it three ways", practice, done).
   Now the same parts are shown as steps: each card on its own (big text, big arrows), then one "Try it" step
   (picture, demo, teach-back, practice), then one "Done" step. Nothing is removed; the parts are only shown one step at a time. */
/* v37.2: a child's lesson keeps only the big idea, two examples and the try-it (the tips, fun facts and watch-outs are left out of the steps) */
const v37Cut = all => { let ex = 0; const out = all.filter(x => x.kind !== 'tip' && x.kind !== 'fact' && x.kind !== 'warn' && (x.kind !== 'ex' || ++ex <= 2)); return out.length ? out : all; };
HOOK.around('lessonCardsHTML', (next, ...a) => { v37Cutting = true; try { return next(...a); } finally { v37Cutting = false; } });
HOOK.around('lessonCards', (next, ...a) => { const all = next(...a); return v37Cutting ? v37Cut(all) : all; });
let v37Cutting = false;
function v37Lesson() {
  const sh = $('#lessonSheet'), m = UI.open && MODULES.find(x => x.id === UI.open);
  if (!sh || !sh.querySelector) return;
  if (!m || !m.body || UI.act || UI.trace) { if (sh.removeAttribute) sh.removeAttribute('data-v37'); return; }
  if (UI.v37pFor !== m.id) { UI.v37pFor = m.id; UI.v37p = UI.prac && UI.prac.id === m.id ? 'try' : 'learn'; }
  const n = v37Cut(lessonCards(m)).length, p = UI.v37p || 'learn', lc = Math.max(0, Math.min(n - 1, UI.lc || 0));
  sh.dataset.v37 = p === 'learn' ? (lc === 0 ? 'learn0' : 'learn') : p;
  /* sort every part of the page into its step */
  let afterDone = false;
  const mark = (el, k) => el.classList.add('v37-s-' + k);
  [...sh.children].forEach(el => {
    if (el.classList.contains('lhead')) return;
    if (el.matches('.listen, [data-act="closeLesson"]') && !afterDone) { mark(el, 'hide'); return; }
    if (el.matches('.sub') && !afterDone) { mark(el, 'hide'); return; }
    if (el.matches('[data-act="lessonDone"], .ldone')) { afterDone = true; mark(el, 'done'); return; }
    if (afterDone) { mark(el, el.matches('[data-act="closeLesson"]') ? 'hide' : 'done'); return; }
    if (el.classList.contains('lbody')) { [...el.children].forEach(c => mark(c, c.matches('.lsec.learn') ? 'learn' : c.matches('.lsec.qcheck') ? 'q' : 'try')); return; }
    mark(el, 'try');
  });
  const idx = p === 'learn' ? lc : p === 'try' ? n : n + 1, total = n + 2;
  const dots = Array.from({ length: total }, (_, i) => `<i class="${i === idx ? 'on' : i < idx ? 'seen' : ''}"></i>`).join('');
  const nxt = p === 'done' ? `<button class="btn good v37-finish" data-act="closeLesson">✔ ${t('v37.finish')}</button>` : `<button class="v37-arrow go" data-act="v37Sn" aria-label="${esc(t('v37.lnext'))}"><span aria-hidden="true">›</span></button>`;
  sh.insertAdjacentHTML('beforeend', `<div class="v37-lnav"><button class="v37-arrow" data-act="v37Sb" aria-label="${esc(t('v37.lback'))}" ${idx === 0 ? 'disabled' : ''}><span aria-hidden="true">‹</span></button><span class="v37-pdots" role="img" aria-label="${esc(t('v37.lpos', { i: idx + 1, n: total }))}">${dots}</span>${nxt}</div>`);
}

/* ---- buttons of the Learn steps ---- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act^="v37"]'); if (!b) return;
  const v = v37(), a = b.dataset.act, x = b.dataset.v;
  if (a === 'v37Pp') v.pg--; else if (a === 'v37Pn') v.pg++;
  else if (a === 'v37Lp') { v.lp--; const n = Math.ceil(v37Lessons(v.subj).length / V37_LESSONS); if (v.lp < 0) v.lp = n - 1; }
  else if (a === 'v37Ln') { v.lp++; if (v.lp >= Math.ceil(v37Lessons(v.subj).length / V37_LESSONS)) v.lp = 0; }
  else if (a === 'v37Subj') {
    if (!subjOpen(x)) { toast(t('sj.off')); return; }
    v.subj = x; v.step = 'lessons'; UI.subject = x; ensureLessonsBand(x, S.band).catch(() => {});
    const list = v37Lessons(x), nx = v37Next(list); v.lp = nx < 0 ? 0 : Math.floor(nx / V37_LESSONS);   // open on the page with the next lesson
  }
  else if (a === 'v37Lesson') { const L = v37Lessons(v.subj).find(y => y.m.id === x); if (!L || !L.open) { toast(t('v37.locked')); return; } v.lesson = x; v.step = 'ready'; }
  else if (a === 'v37Games') v.step = 'games';
  else if (a === 'v37To') v.step = x;
  else if (a === 'v37Sn' || a === 'v37Sb') {
    const m = UI.open && MODULES.find(y => y.id === UI.open); if (!m) return;
    const n = v37Cut(lessonCards(m)).length, p = UI.v37p || 'learn', lc = Math.max(0, Math.min(n - 1, UI.lc || 0));
    if (a === 'v37Sn') { if (p === 'learn') { if (lc < n - 1) UI.lc = lc + 1; else UI.v37p = 'try'; } else if (p === 'try') UI.v37p = 'done'; }
    else if (p === 'done') UI.v37p = 'try'; else if (p === 'try') { UI.v37p = 'learn'; UI.lc = n - 1; } else UI.lc = Math.max(0, lc - 1);
    try { speechSynthesis.cancel(); } catch (_) { /* no speech */ }
    renderStudies(); const sh = $('#lessonSheet'); if (sh) sh.scrollTop = 0; return;
  }
  renderStudies();
  const w = $('#tab-studies'); if (w) w.scrollTop = 0;
});
/* a quick-check "skip to practice" or a practice start lands on the Try step */
document.addEventListener('click', e => { const b = e.target.closest('[data-act="qcSkip"], [data-act="pracStart"], [data-act="bridgeGo"]'); if (b && UI.open) { UI.v37p = 'try'; renderStudies(); } });
/* "Go!" is the ordinary "open" action; when the lesson is closed the child lands on the lesson list again */
document.addEventListener('click', e => { const b = e.target.closest('.v37-go[data-act="open"]'); if (b) v37().step = 'lessons'; });

/* ---- Play: three big buttons ---- */
function renderPlay() {
  const card = (v, em, c) => `<button class="v37-hub" style="--c:${c}" data-act="tab" data-v="${v}"><i aria-hidden="true">${em}</i><span>${t('v37.' + v37Key(v))}<small>${t('v37.' + v37Key(v) + 'D')}</small></span></button>`;
  setHTML($('#tab-play'), `<div class="wrap v37"><h1 class="v37-h">${t('v37.play')}</h1>${card('adventure', '⚔️', '#C9304F')}${card('tower', '🗼', '#6B47D6')}${card('kbat', '🧠', '#0F8F7A')}</div>`);
}
/* nav highlight, back arrow and title for the three screens inside Play */
function v37Sync(name) {
  const inPlay = name === 'play' || V37_PLAY.includes(name);
  $$('.nav button').forEach(b => { const on = b.dataset.v === name || (inPlay && b.dataset.v === 'play'); b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  const sub = $('#v37Sub'), show = V37_PLAY.includes(name);
  if (sub) { sub.hidden = !show; if (show) $('#v37SubT').textContent = t('v37.' + v37Key(name)); }
  document.documentElement.dataset.v37sub = show ? '1' : '0';
  if (name === 'play') renderPlay();
  const lk = $('#v37Lock'); if (lk) lk.setAttribute('aria-label', t('v37.lock'));
}
HOOK.before('showTab', name => { if (name === 'studies' && UI.tab !== 'studies') { const v = v37(); v.step = 'subj'; v.pg = 0; } });   // coming back to Learn starts at step 1
HOOK.on('showTab', () => v37Sync(UI.tab));   // UI.tab, not the name: a blocked tab change (a battle is running) leaves the old tab
