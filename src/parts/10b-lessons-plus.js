/* ================= v22: lessons that lead into battles =================
   Every lesson ends with a Practice section:
   - "Try 3 practice questions": a mini training battle against a straw dummy, using questions from the
     matching topic. A wrong pick just says "try again" with a hint, so it is safe to learn.
   - "Quick quiz": five multiple-choice questions from the same topic, one try each, scored. The best score
     is kept (S.quiz) and shown to grown-ups.
   - A button to go straight to that subject's Adventure.
   The lesson -> topic link is worked out from the lesson's id with a small keyword table per subject, so new
   lessons are linked automatically. Parents can also pin a "Lesson of the week" (S.lotw) that shows first
   in Lessons. */
const LTOPIC_KEYS = {
  math: [['pola', ['pola', 'pattern']], ['wang', ['money', 'coin']], ['masa', ['time', 'clock', 'days', 'month']], ['bentuk', ['shape', '3d', 'sides', 'perim']], ['ukuran', ['measure', 'long', 'heavy']], ['data', ['tally', 'data', 'chart']], ['ruang', ['ruang', 'position']], ['nombor', ['']]],
  bm: [['sukukata', ['suku', 'kvkvk']], ['huruf', ['huruf', 'vokal', 'konsonan', 'diftong', 'digraf']], ['lawan', ['lawan']], ['bahasa', ['peribahasa', 'pantun']], ['ayat', ['ayat', 'tanya']], ['tatabahasa', ['penjodoh', 'imbuhan', 'kataganti', 'katasifat', 'katasendi', 'katagand', 'hubung', 'bm_kata']], ['kata', ['']]],
  en: [['opp', ['opp']], ['read', ['read', 'story']], ['grammar', ['noun', 'plural', 'tense', 'adj', 'sentence', 'prep', 'thisthat', 'aan', '_wh']], ['words', ['colour', 'number', 'family', 'body', 'food', 'animals', 'greetings']], ['abc', ['']]],
  sc: [['digital', ['digital']], ['manusia', ['sense', 'body', 'food', 'germs', 'sleepmove']], ['tumbuhan', ['plant', 'seed', 'fruits']], ['haiwan', ['animal', 'life', 'chain', 'homes', 'eats', 'insects', 'wildlife', 'vertebrates']], ['bahan', ['matter', 'material', 'larut', 'apung', 'recycle', 'hotcold']], ['bumi', ['day', 'water', 'weather', 'space', 'moon', 'air']], ['tenaga', ['']]],
  pm: [['jujur', ['jujur', 'maaf', 'janji', 'sayno']], ['syukur', ['syukur']], ['kerjasama', ['gotong', 'classteam', 'perpaduan', 'adil']], ['tanggung', ['tanggung', 'kemas', 'selamat', 'rajin', 'jimat', 'helphome', 'alam']], ['baik', ['baik', 'animals', 'caresick', 'nobully', 'sharefood', 'courage']], ['hormat', ['']]],
  pk: [['keluarga', ['keluarga']], ['lambang', ['mercu', 'flag', 'symbols', 'rukunnegara']], ['komuniti', ['sekolah', 'jiran', 'helpers', 'signs', 'recycle', 'transport']], ['negara', ['malaysia', 'map', 'agong', 'merdeka', 'languages', 'foods', 'costumes']], ['diri', ['']]],
  se: [['sebab', ['sebab']], ['budaya', ['perayaan']], ['urus', ['tenang', 'sabar', 'anger', 'mistakes', 'newthings', 'askhelp']], ['sosial', ['main', 'friend', 'listen', 'quarrel']], ['emosi', ['']]],
  fk: [['makan', ['makan', 'water', 'rainbow', 'breakfast']], ['bersih', ['tangan', 'gigi', 'batuk']], ['selamat', ['diri', 'jalan', 'sunsafe', 'seatbelt', 'fire']], ['sakit', ['sleep', 'firstaid']], ['gerak', ['']]],
  sv: [['kraf', ['kraf', 'batik', 'anyam', 'mask', 'shadowpuppet']], ['warna', ['warna', 'campur', 'lightdark', 'wheel']], ['bahan', ['alat', 'clay', 'recycle', 'boat']], ['garis', ['garis', 'thickthin', 'dots', 'bentuk']], ['corak', ['']]],
  mz: [['alat', ['alat', 'tradisi', 'care', 'shaker', 'angklung', 'sape', 'orchestra']], ['irama', ['irama', 'rentak', 'bodyperc', 'taiti', 'rest']], ['nada', ['nada', 'melodi', 'handsigns', 'same']], ['lagu', ['lagu', 'iring', 'negara', 'callresponse', 'rasasayang', 'rounds']], ['bunyi', ['']]]
};
/* math lessons about the bar model and groups practise with the generated word problems instead */
const LMATH_FAM = { m_pw: 'pw', m_add: 'pw', m_sub: 'pw', math2_subtractstory: 'pw', m_cmp: 'cmp', math2_moreless: 'cmp', m_groups: 'units', m_times: 'units', m_div: 'units', math2_doubling: 'units', m_frac: 'frac', math2_halves: 'frac' };
function lessonTopic(m) {
  const id = m.id.toLowerCase(), rules = LTOPIC_KEYS[m.subject] || [];
  for (const [tp, keys] of rules) if (keys.some(k => k === '' || id.includes(k))) return tp;
  return (BTOP[m.subject] || [])[0];
}
/* v23: practice questions follow the lesson itself, not just its broad topic. Every bank question in the
   subject is scored by the words it shares with the lesson (title, id and text; rare words count more), and
   the best matches become the lesson's own pool. Lessons with too few matches fall back to the topic. */
const LSTOP = new Set('the and for are with you your this that what which how many can does did has have was were from into our out not all one two three four five more most some when where who why its it is in on at to of a an be we us do by as or so if they them their there then than his her him she he i me my very just like look say said use used also each every time make made see try tip memory common mistake mistakes'.split(' '));
const lwords = s => (String(s || '').toLowerCase().match(/[a-zà-ÿ'-]{3,}/g) || []).map(w => w.replace(/^'+|'+$/g, '').replace(/(ing|es|s)$/, '')).filter(w => w.length >= 3 && !LSTOP.has(w));
const LPOOL = {};
function lessonPool(m) {
  const k = m.id + (m.body ? '+' : ''); if (LPOOL[k]) return LPOOL[k];
  const rows = [1, 2, 3].flatMap(b => (BANK[m.subject] && BANK[m.subject][b]) || []); if (!rows.length) return (LPOOL[k] = []);
  const words = r => new Set(lwords([r.q[0], r.a[0], r.q[1], r.a[1], r.grp].join(' ')));
  const W = rows.map(words), df = {}; W.forEach(ws => ws.forEach(w => { df[w] = (df[w] || 0) + 1; }));
  const N = rows.length, idf = w => Math.log((N + 1) / ((df[w] || 0) + 1));
  const head = new Set(lwords([m.title, m.ms && m.ms.title, m.id.replace(/[_\d]+/g, ' ')].join(' ')));
  const body = new Set(lwords([...(m.body || []), ...((m.ms && m.ms.body) || [])].join(' ')));
  const sc = W.map((ws, i) => { let s = 0, h = 0; ws.forEach(w => { if (head.has(w)) { s += 2.2 * idf(w); h++; } else if (body.has(w)) s += idf(w); }); if (head.has(String(rows[i].grp).toLowerCase())) { s += 3; h++; } return [s, h, rows[i]]; }).sort((a, b) => b[0] - a[0]);
  /* inside the lesson's own topic any real overlap counts; outside it, only a question that shares two
     title words with the lesson (a very strong match) */
  const tp = lessonTopic(m), strong = sc.filter(([s, h, r]) => h >= 1 && (r.topic === tp ? s >= 8 : s >= 14));
  return (LPOOL[k] = (strong.length >= 3 ? strong : sc.filter(([s, h, r]) => r.topic === tp ? s >= 5 : h >= 2 && s >= 14)).slice(0, 24).map(x => x[2]));
}
/* times, groups, sharing and halves lessons practise the matching word problems at the right level */
const lessonMathBand = (fam, band) => fam === 'units' || fam === 'frac' ? (band >= 4 ? 3 : 2) : band >= 4 ? 2 : 1;
function lessonQ(m, avoid) {
  const fam = m.subject === 'math' && LMATH_FAM[m.id], band = S.band, own = fam ? null : lessonPool(m);
  for (let i = 0; i < 12; i++) {
    let q;
    if (fam) q = mathQ(lessonMathBand(fam, band), fam);
    else q = own.length >= 3 ? bankQ(m.subject, band, lessonTopic(m), new Set(own)) : bankQ(m.subject, band, lessonTopic(m));
    if (q && !avoid.has(q.key) && q.options && q.options.length > 1) return q;
  }
  return bankQ(m.subject, band, lessonTopic(m));
}
/* UI.prac = { id, mode: 'prac' | 'quiz', n, i, q, keys, picked, right, score, done, fb } */
function pracStart(m, mode) {
  B.dk = Math.min(1, .3 + .2 * S.band);
  const p = UI.prac = { id: m.id, mode, n: mode === 'quiz' ? 5 : 3, i: 0, keys: new Set(), picked: new Set(), right: -1, score: 0, done: false, fb: '', firstTry: 0 };
  pracNext(m, p);
}
function pracNext(m, p) {
  if (p.i >= p.n) return pracFinish(m, p);
  p.q = lessonQ(m, p.keys); p.keys.add(p.q.key); p.picked = new Set(); p.right = -1; p.fb = ''; p.answered = false;
  if (S.voice.auto) speakSeq(p.q.speak);
}
function pracPick(m, i) {
  const p = UI.prac; if (!p || p.done || p.answered) return;
  const q = p.q, ok = i === q.correct, first = p.picked.size === 0;
  recordTopic(q.topic, ok && first); if (ok || p.mode === 'quiz') recordQ(q, ok && first ? 0 : 1);
  if (ok) { p.right = i; p.answered = true; if (first) { p.score++; p.firstTry++; } sfx.ok(); p.fb = t(p.mode === 'quiz' ? 'pr.right' : 'pr.hit'); }
  else if (p.mode === 'quiz') { p.picked.add(i); p.right = q.correct; p.answered = true; sfx.soft(); p.fb = t('pr.wrongQuiz', { a: q.options[q.correct] }); }
  else { p.picked.add(i); sfx.soft(); const st = q.steps ? q.steps() : []; p.fb = t('pr.again') + (st.length ? ' 💡 ' + st[Math.min(p.picked.size - 1, st.length - 1)] : ''); }
  renderStudies();
}
function pracFinish() { return HOOK.call('pracFinish', pracFinishBase, arguments); }   // v31: extensions register with HOOK (00c)
function pracFinishBase(m, p) {
  p.done = true; const day = todayKey();
  if (p.mode === 'quiz') {
    const Q = S.quiz || (S.quiz = {}), prev = Q[m.id] || 0; if (p.score > prev) { Q[m.id] = p.score; addCoins((p.score - prev) * 2); p.gain = (p.score - prev) * 2; }
    logEvent('lg.quiz', { name: tr(m, 'title'), n: p.score });
  } else {
    const D = S.pracDay || (S.pracDay = {}); if (D[m.id] !== day) { D[m.id] = day; addCoins(3); p.gain = 3; }
  }
  save();
}
function pracHTML(m) {
  const p = UI.prac && UI.prac.id === m.id ? UI.prac : null, best = (S.quiz || {})[m.id];
  const goBtn = SUBJ_ORDER.includes(m.subject) ? `<button class="btn ghost" data-act="pracGo" data-v="${m.subject}">⚔️ ${t('pr.go', { s: t('subj.' + m.subject) })}</button>` : '';
  if (!p) return lsec('⚔️', t('pr.title'), '', `<div class="prac lpanel"><p class="sub" style="margin:0 0 10px">${t('pr.sub')}</p><div class="seg"><button class="btn big" data-act="pracStart" data-v="prac">🎯 ${t('pr.try3')}</button><button class="btn big ghost" data-act="pracStart" data-v="quiz">📝 ${t('pr.quiz5')}</button></div>${best !== undefined ? `<p class="sub" style="margin:8px 0 0">${t('pr.best', { n: best })} ${'★'.repeat(quizStars(best))}</p>` : ''}</div>`, 'practice');
  if (p.done) {
    const stars = p.mode === 'quiz' ? quizStars(p.score) : 0;
    return lsec('⚔️', t('pr.title'), '', `<div class="prac lpanel done"><div class="pr-end">${p.mode === 'quiz' ? `<b class="pr-score">${p.score}/5</b><span class="pr-stars" aria-label="${stars}">${[1, 2, 3].map(k => `<i class="${k <= stars ? 'on' : ''}">★</i>`).join('')}</span><p>${t(p.score === 5 ? 'pr.quizAll' : p.score >= 3 ? 'pr.quizGood' : 'pr.quizMore')}</p>` : `<b class="pr-score">🎯 ${p.firstTry}/3</b><p>${t('pr.pracDone')}</p>`}${p.gain ? `<p class="note">+${p.gain} 🪙</p>` : ''}</div>
      <div class="seg" style="justify-content:center"><button class="btn" data-act="pracStart" data-v="${p.mode === 'quiz' ? 'quiz' : 'prac'}">↺ ${t('pr.again2')}</button>${p.mode === 'prac' ? `<button class="btn ghost" data-act="pracStart" data-v="quiz">📝 ${t('pr.quiz5')}</button>` : ''}${goBtn}</div></div>`, 'practice');
  }
  const q = p.q, hp = p.n - p.i - (p.answered && p.right === q.correct && p.mode === 'prac' ? 1 : 0);
  const opts = q.options.map((o, i) => `<button class="ans pr-ans ${q.cls || ''} ${p.picked.has(i) ? 'soft' : ''} ${p.right === i ? 'right' : ''}" data-act="pracPick" data-v="${i}" ${p.answered || p.picked.has(i) ? 'disabled' : ''}>${esc(o)}</button>`).join('');
  const arena = p.mode === 'prac' ? `<div class="pr-arena" aria-hidden="true"><div class="pr-hero">${heroSVG(S.equipped)}</div><div class="pr-dummy ${p.answered ? 'hit' : ''}"><span>🪵</span><div class="pr-hp">${Array.from({ length: p.n }, (_, k) => `<i class="${k < hp ? 'on' : ''}"></i>`).join('')}</div></div></div>` : `<div class="pr-prog" aria-hidden="true">${Array.from({ length: p.n }, (_, k) => `<i class="${k < p.i ? 'past' : k === p.i ? 'now' : ''}"></i>`).join('')}</div>`;
  return lsec('⚔️', t(p.mode === 'quiz' ? 'pr.quizN' : 'pr.pracN', { i: p.i + 1, n: p.n }), '', `<div class="prac lpanel">${arena}<div class="pr-q"><button class="speak" data-act="say" data-say="${esc(q.text)}" aria-label="${esc(t('st.listen'))}">🔊</button><p>${esc(q.text)}</p></div>${q.viz ? `<div class="pr-viz">${q.viz(false)}</div>` : ''}
    <div class="pr-opts ${q.options.length > 3 || q.cls === 'txt' ? 'two' : ''}">${opts}</div><p class="pr-fb" aria-live="polite">${esc(p.fb)}</p>${p.answered ? `<button class="btn big" style="width:100%" data-act="pracNext">${p.i + 1 >= p.n ? t('pr.finish') : t('pr.next')} ▶</button>` : ''}</div>`, 'practice');
}
const quizStars = n => n >= 5 ? 3 : n >= 4 ? 2 : n >= 3 ? 1 : 0;

/* ---- lesson of the week (set by a grown-up) ---- */
const weekKey = (d = new Date()) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return todayKey(x); };   // the Monday of this week
function lotwModule() { const L = S.lotw; return L && L.id ? MODULES.find(m => m.id === L.id) : null; }
function lotwCardHTML() {
  const m = lotwModule(); if (!m) return '';
  return `<button class="lotw" data-act="open" data-v="${m.id}"><span class="lotw-em" aria-hidden="true">${m.em}</span><span class="lotw-t"><small>⭐ ${t('lw.badge')}</small><b>${esc(tr(m, 'title'))}</b><small>${SUBJ_EM[m.subject] || ''} ${t('subj.' + m.subject)} · ${t('st.min', { n: m.min })}${S.learned[m.id] ? ' · ✔' : ''}${(S.quiz || {})[m.id] !== undefined ? ` · 📝 ${(S.quiz || {})[m.id]}/5` : ''}</small></span></button>`;
}
function lotwParentHTML() {
  const cur = lotwModule(), subj = UI.lwSubj || (cur && cur.subject) || 'math';
  const list = MODULES.filter(m => m.subject === subj && m.bands.includes(S.band)).concat(MODULES.filter(m => m.subject === subj && !m.bands.includes(S.band)));
  return `<h2 class="section">⭐ ${t('lw.title')}</h2><div class="card"><p class="sub" style="margin:0 0 10px">${t('lw.note')}</p>
    <div class="lw-row"><label><span>${t('lw.subj')}</span><select id="lwSubj" data-lw="subj">${SUBJ_ORDER.map(s => `<option value="${s}" ${s === subj ? 'selected' : ''}>${SUBJ_EM[s]} ${t('subj.' + s)}</option>`).join('')}</select></label>
    <label><span>${t('lw.lesson')}</span><select id="lwLesson">${list.map(m => `<option value="${m.id}" ${cur && cur.id === m.id ? 'selected' : ''}>${m.em} ${esc(tr(m, 'title'))}${m.bands.includes(S.band) ? '' : ' (' + m.bands.map(b => t('band.' + b)).join(', ') + ')'}</option>`).join('')}</select></label></div>
    <div class="seg" style="margin-top:10px"><button class="btn" data-act="lwPin">📌 ${t('lw.pin')}</button>${cur ? `<button class="btn ghost" data-act="lwClear">${t('lw.clear')}</button>` : ''}</div>
    ${cur ? `<p class="note" style="margin:10px 0 0">📌 ${esc(t('lw.now', { t: tr(cur, 'title') }))}${S.learned[cur.id] ? ' ✔ ' + t('lw.done') : ''}${(S.quiz || {})[cur.id] !== undefined ? ` · 📝 ${(S.quiz || {})[cur.id]}/5` : ''}</p>` : ''}</div>`;
}
document.addEventListener('change', e => { const s = e.target.closest && e.target.closest('select[data-lw="subj"]'); if (!s) return; UI.lwSubj = s.value; if (UI.tab === 'parent') { gate.t = Date.now(); renderParent(); } });
function lessonEvent(a, v) {
  const m = UI.open && MODULES.find(x => x.id === UI.open);
  switch (a) {
    case 'pracStart': if (m) { pracStart(m, v); renderStudies(); setTimeout(() => { const el = $('#lessonSheet .lsec.practice'); if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 30); } return true;
    case 'pracPick': if (m) pracPick(m, +v); return true;
    case 'pracNext': if (m && UI.prac) { UI.prac.i++; pracNext(m, UI.prac); renderStudies(); } return true;
    case 'pracGo': UI.open = null; UI.list = null; UI.prac = null; renderStudies(); showTab('adventure'); UI.subj = v; UI.screen = 'levels'; setAdvView('map'); return true;
    case 'lwPin': { const sel = $('#lwLesson'); if (sel && sel.value) { S.lotw = { id: sel.value, week: weekKey(), at: Date.now() }; save(); toast(t('lw.pinned')); renderParent(); } return true; }
    case 'lwClear': S.lotw = null; save(); renderParent(); return true;
  }
  return false;
}
