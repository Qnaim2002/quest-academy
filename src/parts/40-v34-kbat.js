/* ================= v34: the KBAT tab (higher-order thinking) =================
   KBAT = Kemahiran Berfikir Aras Tinggi. These questions ask the child to APPLY what they know in a new place,
   ANALYSE (find the rule or the reason), EVALUATE (judge which is best) and CREATE (make or design something).
   A round is five questions, one of each skill where possible, chosen from this age and the age below. After every answer
   the child reads a short "why". Coins are small and capped each day so the tab rewards thinking, not speed.
   The questions are in src/content/kbat.js (checked by npm run check). Progress is kept in S.kbat. */
/* v34: the question file (38 KB) is fetched the first time the KBAT tab opens (and quietly in idle time), not at start-up */
const KB_LOAD = import.meta.glob('./content/kbat.js');
let KB_SKILLS = {}, KB_ROWS = [], KB_P = null;
function kbLoad() {
  if (KB_ROWS.length) return Promise.resolve(KB_ROWS);
  return KB_P || (KB_P = KB_LOAD['./content/kbat.js']().then(m => {
    KB_SKILLS = m.skills;
    KB_ROWS = m.rows.map((r, i) => ({ id: i, subj: r[0], band: r[1], skill: r[2], em: r[3], q: [r[4], r[7]], a: [r[5], r[8]], w: [r[6], r[9]], why: [r[10], r[11]] }));
    return KB_ROWS;
  }).catch(e => { KB_P = null; throw e; }));
}
const KB = { round: null, filter: 'all' };
const KB_LEN = 5, KB_COIN = 2, KB_DAY_CAP = 40;
Object.assign(STR, {
  'nav.kbat': ['KBAT', 'KBAT'],
  'kb.title': ['Think Hard', 'Fikir Mendalam'], 'kb.sub': ['Questions that make you think, not just remember.', 'Soalan yang membuat kamu berfikir, bukan sekadar mengingat.'],
  'kb.start': ['Start a round', 'Mulakan pusingan'], 'kb.again': ['Play another round', 'Main pusingan lagi'], 'kb.home': ['Back', 'Kembali'],
  'kb.all': ['All subjects', 'Semua mata pelajaran'], 'kb.q': ['Question {i} of {n}', 'Soalan {i} daripada {n}'],
  'kb.why': ['Why?', 'Mengapa?'], 'kb.next': ['Next', 'Seterusnya'], 'kb.finish': ['See my result', 'Lihat keputusan'],
  'kb.right': ['Great thinking!', 'Pemikiran yang bagus!'], 'kb.wrong': ['Good try! Look at the answer:', 'Cubaan yang baik! Lihat jawapannya:'],
  'kb.result': ['You got {r} of {n}', 'Kamu betul {r} daripada {n}'], 'kb.coins': ['+{c} coins', '+{c} syiling'],
  'kb.capped': ['You have earned all the KBAT coins for today. Keep thinking for fun!', 'Kamu sudah mendapat semua syiling KBAT hari ini. Teruskan berfikir untuk keseronokan!'],
  'kb.skills': ['Your thinking skills', 'Kemahiran berfikir kamu'], 'kb.rounds': ['Rounds played', 'Pusingan dimainkan'], 'kb.best': ['Best score', 'Skor terbaik'],
  'kb.read': ['Read aloud', 'Baca dengan kuat'], 'kb.leave': ['Leave round', 'Tinggalkan pusingan'], 'kb.none': ['No questions here yet. Try all subjects.', 'Belum ada soalan di sini. Cuba semua mata pelajaran.'],
  'kb.d.apply': ['Use what you know in a new place.', 'Guna apa yang kamu tahu di tempat baharu.'], 'kb.d.analyse': ['Find the rule or the reason.', 'Cari peraturan atau sebabnya.'],
  'kb.d.evaluate': ['Decide which choice is best.', 'Tentukan pilihan yang terbaik.'], 'kb.d.create': ['Make or design something new.', 'Buat atau reka sesuatu yang baharu.'],
  'kb.loading': ['Getting the questions ready…', 'Menyediakan soalan…'], 'kb.offline': ['The questions could not load. Check the internet, then try again.', 'Soalan tidak dapat dimuatkan. Semak internet, kemudian cuba lagi.'], 'kb.retry': ['Try again', 'Cuba lagi'],
  'kb.card': ['KBAT thinking', 'Pemikiran KBAT'], 'kb.cardLine': ['{r} rounds · {a}% right', '{r} pusingan · {a}% betul']
});
const kbS = () => (S.kbat = Object.assign({ rounds: 0, asked: 0, right: 0, best: 0, skills: {}, recent: [], day: '', coins: 0 }, S.kbat || {}));
function kbPool(filter = KB.filter, band = S.band) {
  const lo = Math.max(1, band - 1);
  return KB_ROWS.filter(r => r.band >= lo && r.band <= band && (filter === 'all' || r.subj === filter));
}
function kbPickRound(filter = KB.filter, band = S.band, n = KB_LEN) {
  const pool = kbPool(filter, band), st = kbS(), out = [], used = new Set();
  const skills = shuffle(Object.keys(KB_SKILLS));
  for (let i = 0; i < n; i++) {
    const want = skills[i % skills.length];
    const fresh = r => !used.has(r.id) && !st.recent.includes(r.id);
    let c = pool.filter(r => r.skill === want && fresh(r));
    if (!c.length) c = pool.filter(r => r.skill === want && !used.has(r.id));
    if (!c.length) c = pool.filter(r => !used.has(r.id));
    if (!c.length) break;
    const r = pick(c); used.add(r.id); out.push(r);
  }
  return out;
}
function kbMake(row) {
  const li = L(), options = shuffle([row.a[li], ...row.w[li]]);
  return { row, text: row.q[li], options, correct: options.indexOf(row.a[li]), why: row.why[li], picked: -1 };
}
function kbStart() {
  const rows = kbPickRound();
  if (!rows.length) { toast(t('kb.none')); return; }
  KB.round = { qs: rows.map(kbMake), i: 0, right: 0, done: false, coins: 0 };
  renderKbat();
}
function kbSubjects() { return SUBJ_ORDER.filter(s => KB_ROWS.some(r => r.subj === s)); }
function kbHomeHTML() {
  const st = kbS(), acc = st.asked ? Math.round(st.right / st.asked * 100) : 0;
  const skills = Object.keys(KB_SKILLS).map(k => { const s = st.skills[k] || [0, 0], pct = s[0] ? Math.round(s[1] / s[0] * 100) : 0; return `<div class="kb-skill"><span class="kb-ic" aria-hidden="true">${KB_SKILLS[k][2]}</span><b>${esc(KB_SKILLS[k][L()])}</b><small>${esc(t('kb.d.' + k))}</small><div class="pl-bar" role="img" aria-label="${pct}%"><i style="width:${pct}%"></i></div></div>`; }).join('');
  const chips = ['all', ...kbSubjects()].map(s => `<button class="chip" data-act="kbFilter" data-v="${s}" aria-pressed="${KB.filter === s}">${s === 'all' ? '' : SUBJ_EM[s] + ' '}${esc(s === 'all' ? t('kb.all') : t('subj.' + s))}</button>`).join('');
  return `<div class="wrap kbat"><h1 class="title">🧠 ${esc(t('kb.title'))}</h1><p class="sub">${esc(t('kb.sub'))}</p>
    <div class="seg kb-chips">${chips}</div>
    <div class="brief-actions"><button class="btn big" data-act="kbStart">${esc(t('kb.start'))}</button></div>
    <h3 class="sub-h">${esc(t('kb.skills'))}</h3><div class="kb-skills">${skills}</div>
    <p class="note kb-stats">${esc(t('kb.rounds'))}: <b>${st.rounds}</b> · ${esc(t('kb.best'))}: <b>${st.best}/${KB_LEN}</b></p></div>`;
}
function kbQuestionHTML(R) {
  const q = R.qs[R.i], row = q.row, sk = KB_SKILLS[row.skill], answered = q.picked >= 0;
  const opts = q.options.map((o, i) => `<button class="plopt kb-opt ${answered ? (i === q.correct ? 'right' : i === q.picked ? 'wrong' : 'dim') : ''}" data-act="kbPick" data-v="${i}" ${answered ? 'disabled' : ''}>${esc(o)}</button>`).join('');
  const fb = answered ? `<div class="kb-fb ${q.picked === q.correct ? 'ok' : 'no'}" role="status"><b>${esc(t(q.picked === q.correct ? 'kb.right' : 'kb.wrong'))}</b> ${q.picked === q.correct ? '' : `<em>${esc(q.options[q.correct])}</em>`}<p><span aria-hidden="true">💡</span> <b>${esc(t('kb.why'))}</b> ${esc(q.why)}</p></div>
    <div class="brief-actions"><button class="btn big" data-act="kbNext">${esc(t(R.i + 1 >= R.qs.length ? 'kb.finish' : 'kb.next'))}</button></div>` : '';
  return `<div class="wrap kbat"><div class="pl-top"><span class="pl-subj">${sk[2]} ${esc(sk[L()])} · ${SUBJ_EM[row.subj] || ''}</span><span class="pl-count">${esc(t('kb.q', { i: R.i + 1, n: R.qs.length }))}</span></div>
    <div class="pl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${R.qs.length}" aria-valuenow="${R.i}"><i style="width:${Math.round(R.i / R.qs.length * 100)}%"></i></div>
    <div class="pl-q"><div class="pl-qhead"><span class="tag">${row.em} ${esc(t('kb.d.' + row.skill))}</span><button class="speak" data-act="kbSay" aria-label="${esc(t('kb.read'))}">🔊</button></div><p class="pl-text">${esc(q.text)}</p></div>
    <div class="pl-opts kb-opts">${opts}</div>${fb}
    <div class="pl-foot"><button class="linkbtn" data-act="kbLeave">${esc(t('kb.leave'))}</button></div></div>`;
}
function kbResultHTML(R) {
  const st = kbS(), stars = R.right >= KB_LEN - 1 ? 3 : R.right >= 3 ? 2 : R.right >= 1 ? 1 : 0;
  return `<div class="wrap kbat kb-result"><div class="pl-hero pose-cheer" aria-hidden="true">${heroSVG(S.equipped)}</div><h2>${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</h2><h2>${esc(t('kb.result', { r: R.right, n: R.qs.length }))}</h2>
    <p class="gain">${R.coins ? esc(t('kb.coins', { c: R.coins })) + ' 🪙' : ''}</p>${R.capped ? `<p class="note">${esc(t('kb.capped'))}</p>` : ''}
    <div class="brief-actions"><button class="btn big" data-act="kbStart">${esc(t('kb.again'))}</button><button class="btn ghost" data-act="kbLeave">${esc(t('kb.home'))}</button></div></div>`;
}
function renderKbat() {
  const el = $('#tab-kbat'); if (!el) return;
  if (!KB_ROWS.length) {   // questions not here yet: show a short message, then draw the tab when they arrive
    el.innerHTML = `<div class="wrap kbat"><h1 class="title">🧠 ${esc(t('kb.title'))}</h1><p class="sub" role="status">${esc(t('kb.loading'))}</p></div>`;
    const fail = () => { el.innerHTML = `<div class="wrap kbat"><h1 class="title">🧠 ${esc(t('kb.title'))}</h1><p class="sub" role="status">${esc(t('kb.offline'))}</p><div class="brief-actions"><button class="btn big" data-act="kbRetry">${esc(t('kb.retry'))}</button></div></div>`; };
    kbLoad().then(() => (KB_ROWS.length ? renderKbat() : fail()), fail);
    return;
  }
  const R = KB.round;
  el.innerHTML = !R ? kbHomeHTML() : R.done ? kbResultHTML(R) : kbQuestionHTML(R);
  if (R && !R.done) { const q = R.qs[R.i]; if (q.picked < 0) announce(q.text); }
}
function kbPick(i) {
  const R = KB.round; if (!R || R.done) return; const q = R.qs[R.i]; if (q.picked >= 0) return;
  q.picked = i; const ok = i === q.correct, st = kbS(), sk = q.row.skill;
  st.asked++; if (ok) { st.right++; R.right++; sfx.ok(); } else sfx.soft();
  const sc = st.skills[sk] || (st.skills[sk] = [0, 0]); sc[0]++; if (ok) sc[1]++;
  st.recent.push(q.row.id); while (st.recent.length > 40) st.recent.shift();
  if (ok) {   // a small, capped reward
    const day = todayKey(); if (st.day !== day) { st.day = day; st.coins = 0; }
    const c = Math.max(0, Math.min(KB_COIN, KB_DAY_CAP - st.coins));
    if (c) { st.coins += c; R.coins += c; addCoins(c); } else R.capped = true;
  }
  save(); HOOK.emit('kbat:answer', q.row, ok); renderKbat();
}
function kbNext() {
  const R = KB.round; if (!R) return;
  if (R.i + 1 >= R.qs.length) { R.done = true; const st = kbS(); st.rounds++; st.best = Math.max(st.best, R.right); save(); sfx.win && sfx.win(); HOOK.emit('kbat:round', R); }
  else R.i++;
  renderKbat();
}
HOOK.on('showTab', name => { if (name === 'kbat') renderKbat(); });
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'kbRetry': renderKbat(); return true;
    case 'kbStart': kbStart(); return true;
    case 'kbFilter': KB.filter = v; renderKbat(); return true;
    case 'kbPick': kbPick(+v); return true;
    case 'kbNext': kbNext(); return true;
    case 'kbLeave': KB.round = null; renderKbat(); return true;
    case 'kbSay': { const R = KB.round, q = R && R.qs[R.i]; if (q) speakSeq([[q.text + ' ' + q.options.join('. ')]]); return true; }
  }
  return undefined;
});
setTimeout(() => { kbLoad().catch(() => { }); }, 6000);   // fetch quietly while the child plays
function kbatSummaryHTML() {
  const st = kbS(), acc = st.asked ? Math.round(st.right / st.asked * 100) : 0;
  return `<p class="note">🧠 ${esc(t('kb.card'))}: ${esc(t('kb.cardLine', { r: st.rounds, a: acc }))}</p>`;
}
