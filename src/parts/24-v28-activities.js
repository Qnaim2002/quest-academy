/* ================= v28: activities in Studies =================
   A row of activity tiles under the subjects. Each opens in the lesson sheet (UI.act) and keeps its state in
   UI.av while it is open; progress that matters is saved in S.
     📖 Story builder     put three pictures in order (beginning, middle, end) with the order widget (07c)
     🔤 Word bench        tap letter tiles to build the word for a picture; extra words found are a bonus
     ✖️ Sifir race        a calm, untimed times-table ladder (2 to 9) with a progress tree (age 6-7)
     🧪 Science lab       mix colours, melt ice, plant a seed, each with a prediction first
     🗺️ Map explorer      tap the states of Malaysia to learn their names and capitals (Citizenship)
     🎵 Music maker       an eight-step, four-note tune maker that plays the tune back
     📔 Feelings journal  a daily emoji check-in (Socio-emotional), only kept on this device
     🦺 Safety scenes     tap every unsafe thing in a kitchen or a street
     ✍️ Tracing           letters, numbers, words, shapes and number-line hops, with a neatness rating
     🔊 Sound pad         letter sounds (English) or syllables (Malay), then "blend two sounds" (and spell, age 6-7)
     📒 My notebook       the "Remember" tips from finished lessons (23) */
const av = (k, init) => { const A = UI.av || (UI.av = {}); return A[k] || (A[k] = init()); };
const L2 = (en, ms) => S.lang === 'ms' ? ms : en;
const firstTime = (bag, k) => { const B2 = S[bag] || (S[bag] = {}); if (B2[k]) return false; B2[k] = Date.now(); return true; };
const ACTS = {
  notebook: { em: '📒', col: '#B07D3E', html: () => notebookHTML() },
  story: { em: '📖', col: '#E5484D', subj: 'bm', html: storyHTML, mount: storyMount },
  word: { em: '🔤', col: '#3E7BFA', subj: 'en', html: wordHTML },
  sifir: { em: '✖️', col: '#FF8A1F', subj: 'math', bands: [3, 4], html: sifirHTML },
  lab: { em: '🧪', col: '#17A99B', subj: 'sc', html: labHTML },
  map: { em: '🗺️', col: '#D6342C', subj: 'pk', html: mapHTML },
  music: { em: '🎵', col: '#7C5CFF', subj: 'mz', html: musicHTML },
  feel: { em: '📔', col: '#F06FA8', subj: 'se', html: feelHTML },
  safety: { em: '🦺', col: '#2E9E5B', subj: 'fk', html: safetyHTML },
  phonics: { em: '🔊', col: '#3E7BFA', subj: 'en', html: phonicsHTML }
};
const actOK = k => { const A = ACTS[k]; return !!A && (!A.subj || subjOpen(A.subj) || (k === 'word' || k === 'phonics' || k === 'story') && subjOpen('bm')); };
function actTilesHTML() {
  const keys = ['notebook', 'story', 'word', 'sifir', 'lab', 'map', 'music', 'feel', 'safety', 'phonics'].filter(k => actOK(k));
  const tile = k => { const A = ACTS[k], young = A.bands && !A.bands.includes(S.band), n = k === 'notebook' ? Object.keys(S.notebook || {}).length : 0;
    return `<button class="acttile ${young ? 'young' : ''}" style="--c:${A.col}" data-act="actOpen" data-v="${k}"><span class="em" aria-hidden="true">${A.em}</span><b>${t('ac.' + k)}</b><small>${young ? t('ac.olderOnly') : t('ac.' + k + 'D')}${n ? ' · ' + n : ''}</small></button>`; };
  return `<h2 class="section acts-h">🎮 ${t('ac.title')}</h2><div class="acts">${keys.map(tile).join('')}</div>`;
}
function renderActivity() {
  const k = UI.act, A = ACTS[k], ov = $('#lessonOverlay'), sheet = $('#lessonSheet'); if (!A || !sheet) return;
  const top = sheet.scrollTop;
  sheet.innerHTML = `${k === 'notebook' ? '' : `<div class="lhead"><span class="em">${A.em}</span><h2>${t('ac.' + k)}</h2></div>`}<div class="actbody act-${k}">${A.html()}</div><button class="btn ghost" style="width:100%;margin-top:14px" data-act="closeLesson">${t('st.close')}</button>`;
  sheet.style.setProperty('--c', A.col);
  ov.classList.add('on'); sheet.scrollTop = top;
  if (A.mount) A.mount(sheet);
}
HOOK.on('renderStudies', () => {
  setHTML($('#tab-studies .actslot'), actTilesHTML());
  const lh = UI.list && !UI.act ? $('#lessonListSheet .lhead') : null;
  if (lh && lh.insertAdjacentHTML && !$('#lessonListSheet .actlink')) { const k = UI.list === 'pk' ? 'map' : UI.list === 'se' ? 'feel' : UI.list === 'mz' ? 'music' : UI.list === 'sc' ? 'lab' : UI.list === 'fk' ? 'safety' : null; if (k) lh.insertAdjacentHTML('afterend', `<button class="btn actlink" data-act="actOpen" data-v="${k}">${ACTS[k].em} ${t('ac.' + k)}</button>`); }
  if (UI.act) renderActivity();
});
HOOK.before('closeLessonSheet', () => { UI.act = null; UI.av = {}; });

/* ---------------- 📖 story builder ---------------- */
const STORIES = [
  ['🌻', 'A seed grows', 'Biji benih tumbuh', [['🌰', 'Plant a seed', 'Tanam biji benih'], ['🌱', 'A little sprout grows', 'Tunas kecil tumbuh'], ['🌻', 'A big flower blooms', 'Bunga besar berkembang']]],
  ['🐔', 'From egg to hen', 'Dari telur ke ayam', [['🥚', 'There is an egg', 'Ada sebiji telur'], ['🐣', 'A chick hatches', 'Anak ayam menetas'], ['🐔', 'It grows into a hen', 'Ia membesar menjadi ayam']]],
  ['🎒', 'My morning', 'Pagi saya', [['⏰', 'I wake up', 'Saya bangun tidur'], ['🪥', 'I brush my teeth', 'Saya gosok gigi'], ['🎒', 'I go to school', 'Saya pergi ke sekolah']]],
  ['🌈', 'After the rain', 'Selepas hujan', [['☁️', 'Dark clouds come', 'Awan gelap datang'], ['🌧️', 'It rains', 'Hujan turun'], ['🌈', 'A rainbow comes out', 'Pelangi muncul']]],
  ['🦋', 'The hungry caterpillar', 'Ulat yang lapar', [['🐛', 'A tiny caterpillar hatches', 'Ulat kecil menetas'], ['🍃', 'It eats lots of leaves', 'Ia makan banyak daun'], ['🦋', 'It becomes a butterfly', 'Ia menjadi rama-rama']]],
  ['🪁', 'Flying a wau', 'Main wau', [['✂️', 'We make a wau', 'Kami membuat wau'], ['💨', 'The wind blows', 'Angin bertiup'], ['🪁', 'The wau flies high', 'Wau terbang tinggi']]],
  ['🐟', 'Going fishing', 'Pergi memancing', [['🎣', 'Throw the line', 'Lempar tali kail'], ['⏳', 'Wait quietly', 'Tunggu dengan senyap'], ['🐟', 'Catch a fish!', 'Dapat ikan!']]],
  ['🏰', 'At the beach', 'Di pantai', [['🏖️', 'We go to the beach', 'Kami pergi ke pantai'], ['🏰', 'We build a sandcastle', 'Kami bina istana pasir'], ['🌊', 'A wave washes it away', 'Ombak menghanyutkannya']]],
  ['😴', 'Bedtime', 'Waktu tidur', [['🛁', 'I take a bath', 'Saya mandi'], ['📖', 'Mum reads a story', 'Ibu membaca cerita'], ['😴', 'I fall asleep', 'Saya tertidur']]],
  ['🎂', 'Making a cake', 'Membuat kek', [['🥣', 'Mix the eggs and flour', 'Campurkan telur dan tepung'], ['♨️', 'Bake it in the oven', 'Bakar dalam ketuhar'], ['🎂', 'Eat the cake together', 'Makan kek bersama-sama']]]
];
function storyQ(i) {
  const [, , , steps] = STORIES[i], li = S.lang === 'ms' ? 2 : 1;
  let tray; do { tray = shuffle([0, 1, 2]); } while (tray.join() === '0,1,2');
  return { key: 'story:' + i, si: i, lang: S.lang, items: steps.map(s => ({ e: s[0], w: s[li] })), placed: [], tray };
}
function storyHTML() {
  const st = av('story', () => ({ i: Math.floor(Math.random() * STORIES.length), q: null, done: false, miss: 0 }));
  if (!st.q || st.q.si !== st.i || st.q.lang !== S.lang) { st.q = storyQ(st.i); st.done = false; st.miss = 0; }
  const [em, en, msn, steps] = STORIES[st.i], li = S.lang === 'ms' ? 2 : 1, lc1 = x => /^I\b/.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1);
  const tell = st.done ? `<div class="sb-tell"><p>${steps.map((s, k) => `<span>${s[0]} ${esc(t(['sb.first', 'sb.then', 'sb.end'][k], { s: lc1(s[li]) }))}</span>`).join(' ')}</p><button class="speak" data-act="say" data-say="${esc(steps.map((s, k) => t(['sb.first', 'sb.then', 'sb.end'][k], { s: lc1(s[li]) })).join(' '))}" aria-label="${esc(t('st.listen'))}">🔊</button></div>` : '';
  return `<p class="sub">${t('sb.sub')}</p><h3 class="ac-h">${em} ${esc(L2(en, msn))}</h3><div id="acStory" class="${st.done ? 'solved' : ''}"></div>${st.done ? `<p class="ac-ok">🌟 ${t('sb.yes')}</p>${tell}` : st.miss >= 2 ? `<p class="ac-tip">💡 ${t('sb.hint')}</p>` : ''}
    <div class="seg ac-row"><button class="btn ${st.done ? 'big' : 'ghost'}" data-act="acStoryNext">${t('sb.next')} ▶</button></div>`;
}
function storyMount(sheet) {
  const st = av('story', () => ({})), host = sheet.querySelector('#acStory'); if (!host || !st.q) return;
  if (st.done) st.q.placed = [0, 1, 2];
  mountOrder(host, st.q, {
    locked: () => st.done, still: () => UI.act === 'story' && av('story', () => ({})).q === st.q, hint: () => st.miss >= 2,
    ok: () => { st.done = true; sfx.ok(); if (firstTime('storyDone', st.i)) { addCoins(2); toast('+2 🪙'); } save(); setTimeout(() => { if (UI.act === 'story') renderStudies(); }, 500); },
    miss: () => { st.miss++; sfx.soft(); if (st.miss === 2) setTimeout(() => { if (UI.act === 'story' && !st.done) renderStudies(); }, 650); }
  });
  host.querySelectorAll('.o-slot .o-n').forEach((n, k) => { n.textContent = t(['sb.b', 'sb.m', 'sb.e'][k]); n.classList.add('sb-lbl'); });
}

/* ---------------- 🔤 word bench ---------------- */
const BENCH = {
  en: [['🐱', 'CAT', 'S', ['CATS', 'ACT', 'SAT', 'AT', 'AS']], ['🐶', 'DOG', 'S', ['DOGS', 'DO', 'GO', 'SO']], ['🎩', 'HAT', 'S', ['HATS', 'HAS', 'AT', 'AS']], ['🐷', 'PIG', 'S', ['PIGS', 'IS', 'SIP']],
    ['🚌', 'BUS', 'T', ['BUT', 'TUB', 'US']], ['☀️', 'SUN', 'T', ['NUT']], ['🐟', 'FISH', 'A', ['HIS', 'IS', 'AS', 'HAS', 'ASH']], ['⭐', 'STAR', 'T', ['START', 'RAT', 'ART', 'SAT', 'AT', 'AS', 'RATS', 'ARTS']],
    ['🧢', 'CAP', 'E', ['CAPE', 'APE', 'PEA', 'PACE']], ['🥚', 'EGG', 'S', ['EGGS']]],
  ms: [['🐟', 'IKAN', '', ['NAIK', 'KAIN']], ['👁️', 'MATA', 'K', ['KATA', 'TAMAK']], ['🦌', 'RUSA', 'T', ['SURAT', 'RATUS']], ['🏠', 'RUMAH', '', ['MURAH']], ['🧂', 'GARAM', '', ['RAGAM']],
    ['🔥', 'API', 'T', ['PITA', 'TAPI']], ['🐍', 'ULAR', '', []], ['🦆', 'ITIK', '', []], ['⚽', 'BOLA', '', []], ['📚', 'BUKU', '', []]]
};
function benchNew(st) {
  const list = BENCH[st.lang].filter(p => S.band >= 3 || p[1].length <= 4 || st.lang === 'ms'), p = list[st.i % list.length];
  Object.assign(st, { p, tiles: shuffle([...(p[1] + p[2])]), built: [], solved: false, found: [], msg: '' });
}
function wordHTML() {
  const st = av('word', () => ({ lang: S.lang === 'ms' && subjOpen('bm') || !subjOpen('en') ? 'ms' : 'en', i: Math.floor(Math.random() * 10) }));
  if (!st.p) benchNew(st);
  const [em, word, , extras] = st.p, bonus = bonusOn() && extras.length, w = st.built.map(i => st.tiles[i]).join('');
  const langs = ['en', 'ms'].filter(l => subjOpen(l === 'en' ? 'en' : 'bm')).map(l => `<button class="chip" data-act="acWbLang" data-v="${l}" aria-pressed="${st.lang === l}">${l === 'en' ? 'English' : 'Bahasa Melayu'}</button>`).join('');
  return `<div class="seg">${langs}</div><p class="sub">${t(st.solved && bonus ? 'wb.more' : 'wb.sub')}</p><div class="wb-pic" aria-hidden="true">${em}</div>
    <div class="wb-built" aria-live="polite">${st.solved ? `<b class="wb-word">${esc(word)}</b>` : ''}<span class="wb-slots">${(st.solved && !w ? [] : Array.from({ length: Math.max(word.length, w.length) }, (_, k) => `<i class="${w[k] ? 'on' : ''}">${esc(w[k] || '')}</i>`)).join('')}</span></div>
    <div class="wb-tiles">${st.tiles.map((c, i) => `<button class="wb-tile" data-act="acWbTile" data-v="${i}" ${st.built.includes(i) ? 'disabled' : ''}>${esc(c)}</button>`).join('')}</div>
    <div class="seg ac-row"><button class="btn ghost" data-act="acWbDel" ${st.built.length ? '' : 'disabled'}>⌫ ${t('wb.del')}</button><button class="btn" data-act="acWbCheck" ${st.built.length ? '' : 'disabled'}>✔ ${t('wb.check')}</button><button class="btn ${st.solved ? 'big' : 'ghost'}" data-act="acWbNext">${t('wb.next')} ▶</button></div>
    ${st.msg ? `<p class="ac-msg">${esc(st.msg)}</p>` : ''}${bonus ? `<p class="wb-bonus">✨ ${t('wb.bonus', { n: st.found.length, m: extras.length })} ${st.found.map(x => `<b>${esc(x)}</b>`).join(' ')}</p>` : ''}`;
}
function wordCheck() {
  const st = av('word', () => ({})); if (!st.p) return; const [, word, , extras] = st.p, w = st.built.map(i => st.tiles[i]).join('');
  if (!st.solved && w === word) { st.solved = true; st.msg = t('wb.yes', { w: word }); sfx.ok(); speak(word.toLowerCase(), st.lang === 'ms' ? 'ms-MY' : 'en-US'); if (firstTime('benchDone', st.lang + ':' + word)) addCoins(2); }
  else if (w === word) st.msg = t('wb.again');
  else if (bonusOn() && extras.includes(w) && !st.found.includes(w)) { st.found.push(w); st.msg = t('wb.found', { w }); sfx.ok(); if (firstTime('benchBonus', st.lang + ':' + w)) addCoins(1); }
  else if (st.found.includes(w)) st.msg = t('wb.had', { w });
  else { st.msg = t('wb.no'); sfx.soft(); }
  st.built = []; save(); renderStudies();
}

/* ---------------- ✖️ sifir race ---------------- */
function sifirQ(st) {
  const a = st.tb, b = (S.sifir || {})[a] >= 10 ? 1 + Math.floor(Math.random() * 10) : ((S.sifir || {})[a] || 0) + 1, ans = a * b;
  const opts = new Set([ans]); [ans + a, ans - a, ans + 1, ans - 1, ans + 2 * a].forEach(x => { if (opts.size < 3 && x > 0) opts.add(x); });
  st.q = { a, b, ans, opts: shuffle([...opts]) }; st.hint = false;
}
function sifirTree() {
  const sf = S.sifir || {};
  const br = [2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => { const x = i % 2 ? 150 + (i >> 1) * 6 : 50 - (i >> 1) * 6, y = 150 - (i >> 1) * 30, v = sf[n] || 0;
    return `<path d="M100 ${y + 14} Q${(x + 100) / 2} ${y} ${x} ${y - 6}" stroke="#7A4A22" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y - 10}" r="${10 + v}" fill="${v >= 10 ? '#3CB371' : v ? '#A6D96A' : '#D9E7C9'}"/><text x="${x}" y="${y - 6}" text-anchor="middle" font-size="${v >= 10 ? 16 : 11}" font-weight="800" fill="#1d3b1d">${v >= 10 ? '🍎' : n}</text>`; }).join('');
  return `<svg class="sf-tree" viewBox="0 0 200 200" role="img" aria-label="${esc(t('sf.treeAria', { n: [2, 3, 4, 5, 6, 7, 8, 9].filter(n => (sf[n] || 0) >= 10).length }))}"><rect x="92" y="40" width="16" height="150" rx="6" fill="#8B5A2B"/>${br}<ellipse cx="100" cy="192" rx="70" ry="7" fill="#7BB661"/></svg>`;
}
function sifirHTML() {
  if (!olderBand()) return `<p class="note">${t('sf.older')}</p>`;
  const st = av('sifir', () => ({ tb: [2, 3, 4, 5, 6, 7, 8, 9].find(n => ((S.sifir || {})[n] || 0) < 10) || 2 }));
  if (!st.q || st.q.a !== st.tb) sifirQ(st);
  const sf = S.sifir || {}, rung = Math.min(10, sf[st.tb] || 0), q = st.q;
  const tabs = [2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="chip ${(sf[n] || 0) >= 10 ? 'done' : ''}" data-act="acSfTab" data-v="${n}" aria-pressed="${st.tb === n}">× ${n}${(sf[n] || 0) >= 10 ? ' 🍎' : ''}</button>`).join('');
  const ladder = Array.from({ length: 10 }, (_, k) => 10 - k).map(b => `<li class="${b <= rung ? 'done' : b === rung + 1 ? 'now' : ''}"><span>${st.tb} × ${b}</span><b>${b <= rung ? st.tb * b : b === rung + 1 ? '🧗' : ''}</b></li>`).join('');
  const hint = st.hint ? `<p class="ac-tip">💡 ${t('sf.hint', { a: q.a })} ${Array.from({ length: q.b }, (_, k) => `<b>${q.a * (k + 1)}</b>`).join(' ')}</p>` : '';
  return `<p class="sub">${t('sf.sub')}</p><div class="seg sf-tabs">${tabs}</div>
    <div class="sf-q"><p class="sf-eq">${q.a} × ${q.b} = <b>?</b></p><div class="sf-opts">${q.opts.map(o => `<button class="ans" data-act="acSfPick" data-v="${o}">${o}</button>`).join('')}</div>${hint}${st.msg ? `<p class="ac-msg">${esc(st.msg)}</p>` : ''}</div>
    <div class="sf-wrap"><ol class="sf-ladder" aria-label="${esc(t('sf.ladder', { n: rung }))}">${ladder}</ol><div class="sf-side">${sifirTree()}</div></div>`;
}
function sifirPick(v) {
  const st = av('sifir', () => ({})), q = st.q; if (!q) return;
  if (v === q.ans) {
    const sf = S.sifir || (S.sifir = {}), before = sf[q.a] || 0; sfx.ok();
    if (before < 10 && q.b === before + 1) { sf[q.a] = before + 1; st.msg = t('sf.up', { n: sf[q.a] }); if (sf[q.a] === 10) { st.msg = t('sf.done', { a: q.a }); if (firstTime('sifirDone', q.a)) addCoins(5); } }
    else st.msg = t('sf.yes', { e: `${q.a} × ${q.b} = ${q.ans}` });
    save(); sifirQ(st);
  } else { sfx.soft(); st.hint = true; st.msg = t('sf.no'); }
  renderStudies();
}

/* ---------------- 🧪 science lab ---------------- */
const MIXES = [['red', 'yellow', 'orange', '#E5484D', '#F7C948', '#FF8A1F'], ['blue', 'yellow', 'green', '#3E7BFA', '#F7C948', '#2E9E5B'], ['red', 'blue', 'purple', '#E5484D', '#3E7BFA', '#8E44AD']];
const LAB_PRED = { mix: ['orange', 'green', 'purple'], ice: ['sun', 'shade', 'fridge'], seed: ['need', 'sweets', 'tv'] };
function labHTML() {
  const st = av('lab', () => ({ ex: 'mix', pair: 0, pred: -1, run: false, water: 0, sun: 0 }));
  const tabs = ['mix', 'ice', 'seed'].map(k => `<button class="chip ${(S.lab || {})[k] ? 'done' : ''}" data-act="acLabEx" data-v="${k}" aria-pressed="${st.ex === k}">${{ mix: '🎨', ice: '🧊', seed: '🌱' }[k]} ${t('lab.' + k)}</button>`).join('');
  let q, opts, stage = '', res = '';
  if (st.ex === 'mix') {
    const [a, b, c, ca, cb, cc] = MIXES[st.pair]; q = t('lab.mixQ', { a: t('col.' + a), b: t('col.' + b) });
    opts = LAB_PRED.mix.map(k => [k, t('col.' + k)]);
    stage = `<div class="lab-mix ${st.run ? 'run' : ''}" aria-hidden="true"><i style="--c:${ca}"></i><i style="--c:${cb}"></i>${st.run ? `<b style="--c:${cc}"></b>` : ''}</div>`;
    if (st.run) res = t('lab.mixRes', { a: t('col.' + a), b: t('col.' + b), c: t('col.' + c) });
  } else if (st.ex === 'ice') {
    q = t('lab.iceQ'); opts = LAB_PRED.ice.map(k => [k, t('lab.ice_' + k)]);
    stage = `<div class="lab-ice ${st.run ? 'run' : ''}" aria-hidden="true"><div><span>☀️</span><i class="cube sun">🧊</i><small>${t('lab.ice_sun')}</small></div><div><span>🌳</span><i class="cube shade">🧊</i><small>${t('lab.ice_shade')}</small></div></div>`;
    if (st.run) res = t('lab.iceRes');
  } else {
    q = t('lab.seedQ'); opts = LAB_PRED.seed.map(k => [k, t('lab.seed_' + k)]);
    const g = Math.min(3, Math.min(st.water, st.sun));
    stage = `<div class="lab-seed" aria-live="polite"><span class="pot" aria-hidden="true">${['🌰', '🌱', '🌿', '🌻'][g]}</span><p>${t('lab.day', { n: Math.max(st.water, st.sun) })} · 💧 ${st.water} · ☀️ ${st.sun}</p>${st.run && g < 3 ? `<div class="seg"><button class="btn" data-act="acLabSeed" data-v="water">💧 ${t('lab.water')}</button><button class="btn" data-act="acLabSeed" data-v="sun">☀️ ${t('lab.sun')}</button></div>` : ''}</div>`;
    if (st.run && g >= 3) res = t('lab.seedRes');
  }
  const right = st.ex === 'mix' ? MIXES[st.pair][2] : st.ex === 'ice' ? 'sun' : 'need';
  const pred = st.pred >= 0 ? `<p class="ac-msg">${opts[st.pred][0] === right ? '🎯 ' + t('lab.predYes') : '🤔 ' + t('lab.predNo')}</p>` : '';
  return `<div class="seg">${tabs}</div><p class="sub">${t('lab.sub')}</p><div class="lab-step"><b>1. ${t('lab.predict')}</b><p>${esc(q)}</p><div class="lab-opts">${opts.map(([k, txt], i) => `<button class="ans ${st.pred === i ? (k === right ? 'right' : 'soft') : ''}" data-act="acLabPred" data-v="${i}" ${st.pred >= 0 ? 'disabled' : ''}>${esc(txt)}</button>`).join('')}</div>${pred}</div>
    <div class="lab-step ${st.pred < 0 ? 'wait' : ''}"><b>2. ${t('lab.test')}</b>${stage}${st.pred >= 0 && !st.run ? `<button class="btn big" data-act="acLabRun">🔬 ${t('lab.go')}</button>` : ''}${res ? `<p class="ac-ok">✅ ${esc(res)}</p><button class="btn" data-act="acLabNext">${t('lab.next')} ▶</button>` : ''}</div>`;
}

/* ---------------- 🗺️ map explorer ---------------- */
const STATES = [
  ['perlis', 'Perlis', 'Kangar', 9, 6, 's', 'perlis'], ['kedah', 'Kedah', 'Alor Setar', 15, 14, 'm', 'kedah'], ['penang', 'Pulau Pinang', 'George Town', 6, 22, 's', 'penang'], ['perak', 'Perak', 'Ipoh', 17, 31, 'l', 'perak'],
  ['kelantan', 'Kelantan', 'Kota Bharu', 30, 17, 'm', 'kelantan'], ['terengganu', 'Terengganu', 'Kuala Terengganu', 38, 28, 'm', 'terengganu'], ['pahang', 'Pahang', 'Kuantan', 33, 44, 'l', 'pahang'],
  ['selangor', 'Selangor', 'Shah Alam', 16, 47, 'm', 'selangor'], ['kl', 'Kuala Lumpur', 'Kuala Lumpur', 23, 52, 'xs', 'kl'], ['putrajaya', 'Putrajaya', 'Putrajaya', 21, 59, 'xs', 'putrajaya'],
  ['ns', 'Negeri Sembilan', 'Seremban', 27, 63, 'm', 'ns'], ['melaka', 'Melaka', 'Bandar Melaka', 26, 73, 's', 'melaka'], ['johor', 'Johor', 'Johor Bahru', 38, 78, 'l', 'johor'],
  ['labuan', 'Labuan', 'Victoria', 67, 21, 'xs', 'labuan'], ['sabah', 'Sabah', 'Kota Kinabalu', 84, 24, 'l', 'sabah'], ['sarawak', 'Sarawak', 'Kuching', 68, 52, 'xl', 'sarawak']
];
const FT = new Set(['kl', 'putrajaya', 'labuan']);
function mapHTML() {
  const st = av('map', () => ({ mode: 'learn', sel: null, target: null, found: 0, msg: '' }));
  if (st.mode === 'find' && !st.target) st.target = pick(STATES)[0];
  const seen = S.mapSeen || {}, sel = st.sel && STATES.find(s => s[0] === st.sel), tg = st.target && STATES.find(s => s[0] === st.target);
  const dots = STATES.map(([id, nm, , x, y, sz]) => `<button class="mstate sz-${sz} ${st.sel === id ? 'on' : ''} ${seen[id] ? 'seen' : ''} ${FT.has(id) ? 'ft' : ''}" style="left:${x}%;top:${y}%" data-act="acMapTap" data-v="${id}" aria-label="${esc(st.mode === 'find' ? t('mp2.which') : nm)}"><span>${st.mode === 'learn' || seen[id] && st.mode !== 'find' ? esc(nm) : ''}</span></button>`).join('');
  const info = st.mode === 'learn' && sel ? `<div class="map-info"><b>${esc(sel[1])}</b><small>${t(FT.has(sel[0]) ? 'mp2.ft' : 'mp2.state')}</small><p>🏙️ ${esc(t(FT.has(sel[0]) ? 'mp2.cityFT' : 'mp2.capital', { c: sel[2] }))}</p><p>✨ ${esc(t('mpf.' + sel[6]))}</p><button class="speak" data-act="say" data-say="${esc(sel[1] + '. ' + t('mpf.' + sel[6]))}" aria-label="${esc(t('st.listen'))}">🔊</button></div>` : st.mode === 'learn' ? `<p class="sub map-tip">👆 ${t('mp2.tapOne')}</p>` : '';
  const ask = st.mode === 'find' && tg ? `<p class="map-ask">🔎 ${esc(t('mp2.find', { s: tg[1] }))} <small>✔ ${st.found}</small></p>` : '';
  return `<div class="seg"><button class="chip" data-act="acMapMode" data-v="learn" aria-pressed="${st.mode === 'learn'}">📖 ${t('mp2.learn')}</button><button class="chip" data-act="acMapMode" data-v="find" aria-pressed="${st.mode === 'find'}">🔎 ${t('mp2.findMode')}</button></div>
    <p class="sub">${t('mp2.sub', { n: Object.keys(seen).length, m: STATES.length })}</p>${ask}<div class="mymap" role="group" aria-label="${esc(t('mp2.aria'))}"><i class="land pen" aria-hidden="true"></i><i class="land bor" aria-hidden="true"></i><span class="sea s1" aria-hidden="true">${t('mp2.sea1')}</span><span class="sea s2" aria-hidden="true">${t('mp2.sea2')}</span>${dots}</div>${info}${st.msg ? `<p class="ac-msg">${esc(st.msg)}</p>` : ''}<p class="note map-note">${t('mp2.note')}</p>`;
}
function mapTap(id) {
  const st = av('map', () => ({})), s = STATES.find(x => x[0] === id); if (!s) return;
  if (st.mode === 'learn') { st.sel = id; st.msg = ''; const M = S.mapSeen || (S.mapSeen = {}); if (!M[id]) { M[id] = 1; if (Object.keys(M).length === STATES.length && firstTime('mapAll', 'all')) { addCoins(5); st.msg = t('mp2.all'); } save(); } speak(s[1]); }
  else if (id === st.target) { st.found++; sfx.ok(); st.msg = t('mp2.yes', { s: s[1] }); let n; do { n = pick(STATES)[0]; } while (n === id); st.target = n; }
  else { sfx.soft(); st.msg = t('mp2.no', { s: s[1] }); }
  renderStudies();
}

/* ---------------- 🎵 music maker ---------------- */
const NOTES = [['Do', 60, '#E5484D'], ['Re', 62, '#FF8A1F'], ['Mi', 64, '#F2A900'], ['So', 67, '#2E9E5B']];
const tune = () => { if (!Array.isArray(S.tune) || S.tune.length !== 8) S.tune = [0, 1, 2, -1, 2, 1, 0, -1]; return S.tune; };
function playNote(n, delay = 0) {
  try { if (!auCtx()) return; voice({ f: NF(NOTES[n][1]), d: .38, type: 'triangle', v: S.sensory ? .035 : .075, delay }); voice({ f: NF(NOTES[n][1] + 12), d: .2, type: 'sine', v: .015, delay }); } catch (e) { /* no audio */ }
}
function musicHTML() {
  const tn = tune();
  const rows = [3, 2, 1, 0].map(n => `<div class="mu-row"><span class="mu-n" style="--n:${NOTES[n][2]}">${NOTES[n][0]}</span>${tn.map((v, s) => `<button class="mu-cell ${v === n ? 'on' : ''}" style="--n:${NOTES[n][2]}" data-act="acMuCell" data-v="${s}:${n}" data-step="${s}" aria-pressed="${v === n}" aria-label="${esc(t('mu.cell', { s: s + 1, n: NOTES[n][0] }))}"></button>`).join('')}</div>`).join('');
  return `<p class="sub">${t('mu.sub')}</p><div class="mu-grid" role="group" aria-label="${esc(t('mu.aria'))}">${rows}<div class="mu-row steps"><span class="mu-n"></span>${tn.map((_, s) => `<small>${s + 1}</small>`).join('')}</div></div>
    <div class="seg ac-row"><button class="btn big" data-act="acMuPlay">▶ ${t('mu.play')}</button><button class="btn ghost" data-act="acMuRand">🎲 ${t('mu.rand')}</button><button class="btn ghost" data-act="acMuClear">🧹 ${t('mu.clear')}</button></div>${S.sfx === false ? `<p class="note">🔈 ${t('mu.quiet')}</p>` : ''}`;
}
function musicPlay() {
  const tn = tune(), step = .42; clearTimeout(UI.muT);
  tn.forEach((n, s) => { if (n >= 0) playNote(n, s * step); });
  tn.forEach((_, s) => setTimeout(() => { $$('.mu-cell.play').forEach(c => c.classList.remove('play')); $$(`.mu-cell[data-step="${s}"]`).forEach(c => c.classList.add('play')); }, s * step * 1000));
  UI.muT = setTimeout(() => $$('.mu-cell.play').forEach(c => c.classList.remove('play')), tn.length * step * 1000);
  if (firstTime('tuneMade', 'first')) { addCoins(2); toast('🎵 +2 🪙'); save(); }
}

/* ---------------- 📔 feelings journal ---------------- */
const FEELS = [['😀', 'happy'], ['😌', 'calm'], ['😢', 'sad'], ['😠', 'angry'], ['😟', 'worried'], ['😴', 'tired']];
const WHY = [['👨‍👩‍👧', 'family'], ['🧒', 'friends'], ['🏫', 'school'], ['⚽', 'play'], ['🍽️', 'food'], ['🛌', 'sleep']];
function feelHTML() {
  const F = S.feel || {}, today = todayKey(), e = F[today];
  const faces = FEELS.map(([em, k], i) => `<button class="feel ${e && e.f === i ? 'on' : ''}" data-act="acFeel" data-v="${i}" aria-pressed="${!!(e && e.f === i)}"><span aria-hidden="true">${em}</span><b>${t('fl.' + k)}</b></button>`).join('');
  const why = e ? `<h3 class="ac-h">${t('fl.why')}</h3><div class="seg">${WHY.map(([em, k], i) => `<button class="chip" data-act="acFeelWhy" data-v="${i}" aria-pressed="${e.r === i}">${em} ${t('fl.r.' + k)}</button>`).join('')}</div><p class="fl-say">💬 ${esc(t('fl.say.' + FEELS[e.f][1]))}</p>` : '';
  const days = Array.from({ length: 7 }, (_, k) => { const d = new Date(); d.setDate(d.getDate() - (6 - k)); const key = todayKey(d), x = F[key]; return `<span class="${key === today ? 'today' : ''}"><i aria-hidden="true">${x ? FEELS[x.f][0] : '·'}</i><small>${d.toLocaleDateString(S.lang === 'ms' ? 'ms-MY' : 'en-GB', { weekday: 'short' })}</small></span>`; }).join('');
  return `<p class="sub">${t('fl.sub')}</p><div class="feels">${faces}</div>${why}<h3 class="ac-h">${t('fl.week')}</h3><div class="fl-week" aria-label="${esc(t('fl.week'))}">${days}</div><p class="note">🔒 ${t('fl.private')}</p>`;
}
function feelSet(f, r) {
  const F = S.feel || (S.feel = {}), k = todayKey(), e = F[k] || (F[k] = { f: 0, r: -1 });
  if (f !== undefined) { e.f = f; sfx.soft(); } if (r !== undefined) e.r = e.r === r ? -1 : r;
  const keys = Object.keys(F).sort(); while (keys.length > 60) delete F[keys.shift()];
  save(); renderStudies();
}

/* ---------------- 🦺 safety scenes ---------------- */
const SCENES = {
  kitchen: [['🔪', 22, 30, 1, 'knife'], ['🔥', 70, 26, 1, 'stove'], ['🔌', 12, 70, 1, 'plug'], ['💊', 48, 22, 1, 'pills'], ['🧴', 86, 62, 1, 'cleaner'], ['🍎', 40, 62, 0, 'apple'], ['🥛', 60, 66, 0, 'milk'], ['🧽', 82, 34, 0, 'sponge'], ['🪑', 30, 80, 0, 'chair']],
  street: [['⚽', 46, 70, 1, 'ball'], ['📱', 18, 40, 1, 'phone'], ['🛹', 74, 76, 1, 'skate'], ['🕳️', 88, 46, 1, 'drain'], ['🚗', 62, 58, 1, 'car'], ['🚦', 30, 24, 0, 'lights'], ['🚸', 40, 44, 0, 'crossing'], ['⛑️', 10, 76, 0, 'helmet'], ['🦺', 80, 22, 0, 'vest']]
};
function safetyHTML() {
  const st = av('safety', () => ({ sc: 'kitchen', found: [], msg: '' })), items = SCENES[st.sc], bad = items.filter(x => x[3]).length, all = st.found.length >= bad;
  const tabs = Object.keys(SCENES).map(k => `<button class="chip ${(S.safety || {})[k] ? 'done' : ''}" data-act="acSafeSc" data-v="${k}" aria-pressed="${st.sc === k}">${k === 'kitchen' ? '🍳' : '🛣️'} ${t('sf2.' + k)}</button>`).join('');
  const dots = items.map(([em, x, y, b, k], i) => `<button class="sitem ${st.found.includes(i) ? 'found' : ''}" style="left:${x}%;top:${y}%" data-act="acSafeTap" data-v="${i}" aria-label="${esc(t('sf2.i.' + k))}"><span aria-hidden="true">${em}</span>${st.found.includes(i) ? '<em aria-hidden="true">⚠️</em>' : ''}</button>`).join('');
  return `<div class="seg">${tabs}</div><p class="sub">${t('sf2.sub')}</p><p class="sf2-count">⚠️ ${t('sf2.count', { n: st.found.length, m: bad })}</p><div class="scene sc-${st.sc}" role="group" aria-label="${esc(t('sf2.' + st.sc))}">${dots}</div>${st.msg ? `<p class="ac-msg">${esc(st.msg)}</p>` : ''}${all ? `<p class="ac-ok">🌟 ${t('sf2.all')}</p>` : ''}`;
}
function safetyTap(i) {
  const st = av('safety', () => ({})), it = SCENES[st.sc][i]; if (!it) return;
  const txt = t('sf2.t.' + it[4]);
  if (it[3]) { if (!st.found.includes(i)) { st.found.push(i); sfx.ok(); } st.msg = '⚠️ ' + txt; const bad = SCENES[st.sc].filter(x => x[3]).length; if (st.found.length >= bad && firstTime('safety', st.sc)) { addCoins(3); save(); } }
  else { sfx.soft(); st.msg = '✅ ' + t('sf2.safe', { t: txt }); }
  speak(st.msg.replace(/^\S+\s/, '')); renderStudies();
}

/* ---------------- 🔊 sound pad (phonics) ---------------- */
const SOUNDS = {
  en: [['a', '🍎', 'apple'], ['b', '⚽', 'ball'], ['c', '🐱', 'cat'], ['d', '🐶', 'dog'], ['e', '🥚', 'egg'], ['f', '🐟', 'fish'], ['g', '🐐', 'goat'], ['h', '🎩', 'hat'], ['i', '🐞', 'insect'], ['m', '🌙', 'moon'], ['n', '🥅', 'net'], ['o', '🐙', 'octopus'], ['p', '🐷', 'pig'], ['s', '☀️', 'sun'], ['t', '🐯', 'tiger'], ['u', '☂️', 'umbrella']],
  ms: [['ba', '⚽', 'bola'], ['bi', '🐐', 'biri-biri'], ['bu', '📚', 'buku'], ['ka', '🦶', 'kaki'], ['ku', '🐴', 'kuda'], ['ma', '👁️', 'mata'], ['mi', '🍜', 'mi'], ['ro', '🍞', 'roti'], ['sa', '🧺', 'sayur'], ['su', '🥛', 'susu'], ['ta', '🧤', 'tangan'], ['tu', '🪨', 'batu']]
};
const BLENDS = {
  en: [['c', 'at', 'cat', '🐱'], ['d', 'og', 'dog', '🐶'], ['s', 'un', 'sun', '☀️'], ['h', 'at', 'hat', '🎩'], ['p', 'ig', 'pig', '🐷'], ['b', 'us', 'bus', '🚌'], ['m', 'op', 'mop', '🧹'], ['b', 'ed', 'bed', '🛏️'], ['n', 'et', 'net', '🥅'], ['f', 'ox', 'fox', '🦊']],
  ms: [['ba', 'tu', 'batu', '🪨'], ['bu', 'ku', 'buku', '📚'], ['ma', 'ta', 'mata', '👁️'], ['ku', 'da', 'kuda', '🐴'], ['bo', 'la', 'bola', '⚽'], ['su', 'su', 'susu', '🥛'], ['ro', 'ti', 'roti', '🍞'], ['ba', 'ju', 'baju', '👕'], ['ka', 'ki', 'kaki', '🦶'], ['gu', 'ru', 'guru', '🧑‍🏫']]
};
const VOW = 'aeiou';
function phMisspell(w, lang) {
  const out = new Set(), cs = [...w];
  cs.forEach((c, i) => { if (VOW.includes(c)) VOW.split('').filter(v => v !== c).forEach(v => out.add(cs.slice(0, i).join('') + v + cs.slice(i + 1).join(''))); });
  if (lang === 'en' && w[0] === 'c') out.add('k' + w.slice(1));
  return shuffle([...out].filter(x => x !== w)).slice(0, 2);
}
function phonNew(st) {
  const list = BLENDS[st.lang], b = list[st.i % list.length], others = list.filter(x => x !== b);
  const extra = shuffle([...new Set(others.flatMap(x => [x[0], x[1]]))].filter(x => x !== b[0] && x !== b[1])).slice(0, 2);
  Object.assign(st, { b, tiles: shuffle([b[0], b[1], ...extra]), picked: [], blended: false, spell: null, spellPick: -1, msg: '' });
}
function phonicsHTML() {
  const st = av('phon', () => ({ lang: S.lang === 'ms' && subjOpen('bm') || !subjOpen('en') ? 'ms' : 'en', i: Math.floor(Math.random() * 10) }));
  if (!st.b) phonNew(st);
  const langs = ['en', 'ms'].filter(l => subjOpen(l === 'en' ? 'en' : 'bm')).map(l => `<button class="chip" data-act="acPhLang" data-v="${l}" aria-pressed="${st.lang === l}">${l === 'en' ? 'English' : 'Bahasa Melayu'}</button>`).join('');
  const pad = SOUNDS[st.lang].map(([s, em, w]) => `<button class="ph-key" data-act="acPhSay" data-v="${esc(s)}"><b>${esc(s)}</b><span aria-hidden="true">${em}</span><small>${esc(w)}</small></button>`).join('');
  const [a, b2, word, em] = st.b, built = st.picked.map(i => st.tiles[i]);
  let chal = `<p class="sub">${t('ph.chal', { e: em })}</p><div class="ph-pic" aria-hidden="true">${st.blended ? em : '❓'}</div><div class="ph-built">${[0, 1].map(k => `<i class="${built[k] ? 'on' : ''}">${esc(built[k] || '')}</i>`).join('<span>+</span>')}${st.blended ? ` = <b>${esc(word)}</b>` : ''}</div>
    ${st.blended ? '' : `<div class="wb-tiles">${st.tiles.map((x, i) => `<button class="wb-tile" data-act="acPhTile" data-v="${i}" ${st.picked.includes(i) ? 'disabled' : ''}>${esc(x)}</button>`).join('')}</div>`}`;
  if (st.blended && olderBand()) {
    if (!st.spell) st.spell = shuffle([word, ...phMisspell(word, st.lang)]);
    const ok = st.spellPick >= 0 && st.spell[st.spellPick] === word;
    chal += `<h3 class="ac-h">✏️ ${t('ph.spell', { e: em })}</h3><div class="lab-opts">${st.spell.map((w, i) => `<button class="ans ${st.spellPick === i ? (w === word ? 'right' : 'soft') : ''}" data-act="acPhSpell" data-v="${i}" ${ok ? 'disabled' : ''}>${esc(w)}</button>`).join('')}</div>`;
  }
  return `<div class="seg">${langs}</div><p class="sub">${t(st.lang === 'en' ? 'ph.subEn' : 'ph.subMs')}</p><div class="ph-pad">${pad}</div><h3 class="ac-h">🧩 ${t('ph.blendT')}</h3>${chal}${st.msg ? `<p class="ac-msg">${esc(st.msg)}</p>` : ''}
    <div class="seg ac-row">${built.length && !st.blended ? `<button class="btn ghost" data-act="acPhUndo">⌫ ${t('wb.del')}</button>` : ''}<button class="btn ${st.blended ? 'big' : 'ghost'}" data-act="acPhNext">${t('wb.next')} ▶</button></div>`;
}
const phLang = st => st.lang === 'ms' ? 'ms-MY' : 'en-US';
function phSay(s) { const st = av('phon', () => ({})), row = SOUNDS[st.lang || 'en'].find(x => x[0] === s); speak(row ? (st.lang === 'ms' ? `${s}. ${row[2]}` : `${s}... ${s}... ${row[2]}`) : s, phLang(st)); }
function phTile(i) {
  const st = av('phon', () => ({})); if (!st.b || st.blended || st.picked.includes(i)) return;
  st.picked.push(i); speak(st.tiles[i], phLang(st)); st.msg = '';
  if (st.picked.length === 2) {
    const [x, y] = st.picked.map(k => st.tiles[k]);
    if (x === st.b[0] && y === st.b[1]) { st.blended = true; sfx.ok(); st.msg = t('ph.yes', { w: st.b[2] }); setTimeout(() => speak(st.b[2], phLang(st)), 500); if (firstTime('blendDone', st.lang + ':' + st.b[2])) addCoins(1); save(); }
    else { sfx.soft(); st.msg = t('ph.no'); st.picked = []; }
  }
  renderStudies();
}

/* ---------------- ✍️ tracing upgrades ---------------- */
GLYPHS.sh_circle = [arcPts(50, 50, 38, 38, -90, 270, 32)];
GLYPHS.sh_square = [[[16, 16], [84, 16], [84, 84], [16, 84], [16, 16]]];
GLYPHS.sh_triangle = [[[50, 12], [88, 86], [12, 86], [50, 12]]];
GLYPHS.sh_diamond = [[[50, 8], [86, 50], [50, 92], [14, 50], [50, 8]]];
GLYPHS.sh_star = [Array.from({ length: 11 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, r = i % 2 ? 18 : 42; return [Math.round(50 + Math.cos(a) * r), Math.round(52 + Math.sin(a) * r)]; })];
GLYPHS.sh_heart = [[[50, 88], [18, 56], [12, 38], [18, 22], [34, 16], [50, 28], [66, 16], [82, 22], [88, 38], [82, 56], [50, 88]]];
const SHAPE_KEYS = ['circle', 'square', 'triangle', 'diamond', 'star', 'heart'], SHAPE_EM = { circle: '⚪', square: '⬜', triangle: '🔺', diamond: '🔷', star: '⭐', heart: '❤️' };
const NL_SUMS = [[0, 3], [2, 5], [1, 6], [3, 7], [4, 9], [5, 10]];
/* the number line shows 7 numbers around the sum, so the hops are big enough to trace */
const nlSp = (a, b) => 80 / Math.max(3, b - a), nlX = (k, a, b) => 14 + nlSp(a, b) * (k - a);
function nlGlyph(a, b) {
  const key = `nl_${a}_${b}`, sp = nlSp(a, b);
  if (!GLYPHS[key]) GLYPHS[key] = [[[2, 66], [98, 66]], ...Array.from({ length: b - a }, (_, k) => arcPts(nlX(a + k, a, b) + sp / 2, 66, sp / 2, 22, 180, 360, 14))];
  return key;
}
const TRACE_WORDS = { en: [['🐱', 'CAT'], ['☀️', 'SUN'], ['🐶', 'DOG'], ['🚌', 'BUS'], ['🎩', 'HAT'], ['🐟', 'FISH']], ms: [['👩', 'IBU'], ['⚽', 'BOLA'], ['🐟', 'IKAN'], ['📚', 'BUKU'], ['👁️', 'MATA'], ['🔥', 'API']] };
const neatStars = sc => !sc.ok ? 0 : sc.cover >= .9 && sc.prec >= .85 ? 3 : (sc.cover + sc.prec) / 2 >= .8 ? 2 : 1;
const starsTxt = n => '★'.repeat(n) + '☆'.repeat(3 - n);
function traceBest(k, n) { const T = S.traceStars || (S.traceStars = {}); if (n > (T[k] || 0)) T[k] = n; }
function renderTracePractice() {
  const ov = $('#lessonOverlay'), sheet = $('#lessonSheet'); if (!UI.trace || !sheet) return;
  const set = UI.traceSet || 'ABC', TS = S.traceStars || {}, li = S.lang === 'ms' ? 'ms' : 'en';
  const sets = [['ABC', 'A B C'], ['abc', 'a b c'], ['123', '1 2 3'], ['WORD', '✏️ ' + t('tr2.words')], ['SHAPE', '⬛ ' + t('tr2.shapes')]].map(([k, l]) => `<button class="chip" data-act="traceSet" data-v="${k}" aria-pressed="${set === k}">${l}</button>`).join('');
  let picks = '', g, say, extra = '', name;
  if (set === 'WORD') {
    const [wi, pos] = String(UI.trace).startsWith('w:') ? UI.trace.slice(2).split(':').map(Number) : [0, 0], W = TRACE_WORDS[li], [em, word] = W[wi % W.length];
    g = word[pos] || word[0]; UI.trace = `w:${wi % W.length}:${pos}`; name = word; say = t('tr2.sayWord', { w: word, l: g });
    picks = W.map(([e2, w2], i) => `<button class="chip ${TS['w:' + w2] ? 'done' : ''}" data-act="traceGlyph" data-v="w:${i}:0" aria-pressed="${i === wi % W.length}">${e2} ${w2}${TS['w:' + w2] ? ' ' + starsTxt(TS['w:' + w2]) : ''}</button>`).join('');
    extra = `<div class="tr-word" aria-hidden="true"><span class="em">${em}</span>${[...word].map((c, k) => `<b class="${k < pos ? 'done' : k === pos ? 'now' : ''}">${c}</b>`).join('')}</div>`;
  } else if (set === 'SHAPE') {
    if (!String(UI.trace).startsWith('sh_')) UI.trace = 'sh_circle';
    g = UI.trace; const k = g.slice(3); name = t('shp.' + k); say = t('tr2.sayShape', { s: name });
    picks = SHAPE_KEYS.map(s => `<button class="chip ${TS['sh_' + s] ? 'done' : ''}" data-act="traceGlyph" data-v="sh_${s}" aria-pressed="${g === 'sh_' + s}">${SHAPE_EM[s]} ${t('shp.' + s)}${TS['sh_' + s] ? ' ' + starsTxt(TS['sh_' + s]) : ''}</button>`).join('');
  } else if (set === 'LINE') {
    if (!String(UI.trace).startsWith('nl_')) UI.trace = nlGlyph(...NL_SUMS[0]);
    const [a, b] = UI.trace.slice(3).split('_').map(Number); g = nlGlyph(a, b); name = `${a} + ${b - a}`; say = t('tr2.sayLine', { a, n: b - a, b });
    picks = NL_SUMS.map(([x, y]) => `<button class="chip ${TS[nlGlyph(x, y)] ? 'done' : ''}" data-act="traceGlyph" data-v="${nlGlyph(x, y)}" aria-pressed="${g === nlGlyph(x, y)}">${x} + ${y - x}</button>`).join('');
    UI.nlLabels = `<div class="tr-nl" aria-hidden="true">${Array.from({ length: b - a + 1 }, (_, i) => a + i).map(k => `<span style="left:${nlX(k, a, b)}%" class="${k === a ? 'from' : k === b ? 'to' : ''}">${k}</span>`).join('')}</div>`;
  } else {
    const chars = traceChars(set);
    if (!chars.includes(UI.trace)) UI.trace = chars[0];
    g = UI.trace; name = g; say = traceSay(g);
    picks = chars.map(c => `<button class="chip ${(S.traced || {})[c] ? 'done' : ''}" data-act="traceGlyph" data-v="${c}" aria-pressed="${c === g}">${c}${TS[c] ? `<small class="trst">${'★'.repeat(TS[c])}</small>` : ''}</button>`).join('');
  }
  const best = set === 'WORD' ? TS['w:' + name] : TS[g];
  sheet.innerHTML = `<div class="lhead"><span class="em">✍️</span><h2>${t('tr.title')}</h2></div>
    <div class="seg" style="margin:6px 0 10px">${sets}</div><div class="trpick">${picks}</div>
    <p class="sub" style="margin:8px 0">${esc(say)} <button class="speak" data-act="say" data-say="${esc(say)}" aria-label="🔊">🔊</button></p>${extra}
    <div id="tracePractice" class="tp-${set.toLowerCase()}"></div><p class="tr-neat" aria-live="polite">${best ? `${t('tr2.best')} <b>${starsTxt(best)}</b>` : t('tr2.neatHow')}</p>
    <div class="seg" style="margin-top:10px"><button class="btn ghost" data-act="traceNext">${t('tr.next')} ▶</button><button class="btn ghost" data-act="acPrintTrace">🖨️ ${t('tr2.print')}</button><button class="btn ghost" data-act="traceClose">${t('st.close')}</button></div>`;
  ov.classList.add('on');
  const host = $('#tracePractice'); if (!host) return;
  mountTrace(host, g, sc => {
    if (!sc.ok) { sfx.soft(); return; }
    const n = neatStars(sc), msg = host.querySelector ? host.querySelector('.trmsg') : null; sfx.ok();
    if (msg) msg.textContent = `${t('tr.great')} ${t('tr2.neat')} ${starsTxt(n)}`;
    if (set === 'WORD') {
      const [wi, pos] = UI.trace.slice(2).split(':').map(Number), word = TRACE_WORDS[li][wi][1];
      UI.tws = (pos === 0 ? [] : UI.tws || []).concat(n);
      if (pos + 1 < word.length) { setTimeout(() => { if (UI.trace === `w:${wi}:${pos}`) { UI.trace = `w:${wi}:${pos + 1}`; renderTracePractice(); } }, 900); return; }
      const avg = Math.max(1, Math.round(UI.tws.reduce((a, b) => a + b, 0) / UI.tws.length)), first = !TS['w:' + word];
      traceBest('w:' + word, avg); if (first) { addCoins(2); toast(t('tr2.wordDone', { w: word }) + ' +2 🪙'); } save();
      setTimeout(() => { if (UI.trace === `w:${wi}:${pos}`) { UI.trace = `w:${wi}:0`; renderTracePractice(); } }, 1400);
      return;
    }
    const first = !(S.traced || {})[g]; S.traced = S.traced || {}; S.traced[g] = (S.traced[g] || 0) + 1; traceBest(g, n);
    if (first) { addCoins(1); toast(t('tr.coin')); } save();
    if (set === 'LINE') { const [a, b] = g.slice(3).split('_').map(Number); if (msg) msg.textContent += ` · ${a} + ${b - a} = ${b}`; speak(t('tr2.sayLineDone', { a, n: b - a, b })); return; }
    setTimeout(() => { if (UI.trace === g) { traceNextGlyph(); } }, 1200);
  });
  const cv = host.querySelector ? host.querySelector('canvas') : null; if (cv && cv.setAttribute) cv.setAttribute('aria-label', t('tr2.aria', { g: name }));
  if (set === 'LINE' && cv && cv.parentNode && document.createElement) {   // the numbers sit under the line, on top of the pad
    const wrap = document.createElement('div'); wrap.className = 'nlwrap'; wrap.style.width = cv.style.width; cv.parentNode.insertBefore(wrap, cv); wrap.appendChild(cv); wrap.insertAdjacentHTML('beforeend', UI.nlLabels || '');
  }
}
function traceNextGlyph() {
  const set = UI.traceSet || 'ABC', li = S.lang === 'ms' ? 'ms' : 'en';
  if (set === 'WORD') { const wi = String(UI.trace).startsWith('w:') ? +UI.trace.split(':')[1] : 0; UI.trace = `w:${(wi + 1) % TRACE_WORDS[li].length}:0`; }
  else if (set === 'SHAPE') { const i = SHAPE_KEYS.indexOf(String(UI.trace).slice(3)); UI.trace = 'sh_' + SHAPE_KEYS[(i + 1) % SHAPE_KEYS.length]; }
  else if (set === 'LINE') { const i = NL_SUMS.findIndex(([a, b]) => nlGlyph(a, b) === UI.trace); UI.trace = nlGlyph(...NL_SUMS[(i + 1) % NL_SUMS.length]); }
  else { const cs = traceChars(set); UI.trace = cs[(cs.indexOf(UI.trace) + 1) % cs.length]; }
  renderTracePractice();
}
const glyphSVG = (g, w = 100) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="${w}">${(GLYPHS[g] || []).map((s, i) => `<polyline points="${s.map(p => p.join(',')).join(' ')}" fill="none" stroke="#888" stroke-width="2.2" stroke-dasharray="1.5 3" stroke-linecap="round"/><circle cx="${s[0][0]}" cy="${s[0][1]}" r="2.6" fill="#3FBF7F"/><text x="${s[0][0]}" y="${s[0][1] - 4}" font-size="5" text-anchor="middle" fill="#2a7">${i + 1}</text>`).join('')}</svg>`;
function printTrace() {
  const set = UI.traceSet || 'ABC', li = S.lang === 'ms' ? 'ms' : 'en'; let title, body;
  if (set === 'WORD') { const wi = +String(UI.trace).split(':')[1] || 0, [em, word] = TRACE_WORDS[li][wi]; title = `${em} ${word}`; body = `<div class="row">${[...word].map(c => glyphSVG(c)).join('')}</div><div class="row">${[...word].map(c => glyphSVG(c)).join('')}</div>`; }
  else if (set === 'LINE') { const [a, b] = UI.trace.slice(3).split('_').map(Number); title = `${a} + ${b - a} = ${b}`; body = `${glyphSVG(UI.trace)}<p>${Array.from({ length: b - a + 1 }, (_, i) => a + i).join(' · ')}</p>`; }
  else { const g = UI.trace; title = set === 'SHAPE' ? t('shp.' + g.slice(3)) : g; body = `${glyphSVG(g)}<div class="row">${glyphSVG(g)}${glyphSVG(g)}${glyphSVG(g)}</div>`; }
  printPage(title, body, t('pt.trace'));
}

/* ---------------- events ---------------- */
HOOK.claim('famEvent', (a, v) => {
  const R = () => { renderStudies(); return true; };
  switch (a) {
    case 'actOpen': if (!ACTS[v]) return true; if (UI.tab !== 'studies') showTab('studies', true); UI.open = null; UI.prac = null; UI.trace = null; UI.act = v; $('#lessonSheet').scrollTop = 0; return R();
    case 'traceSet': if (['WORD', 'SHAPE', 'LINE'].includes(v)) { UI.traceSet = v; UI.trace = v === 'WORD' ? 'w:0:0' : v === 'SHAPE' ? 'sh_circle' : nlGlyph(...NL_SUMS[0]); renderTracePractice(); return true; } break;
    case 'traceNext': traceNextGlyph(); return true;
    case 'acPrintTrace': printTrace(); return true;
    case 'acStoryNext': { const st = av('story', () => ({})); st.i = ((st.i || 0) + 1) % STORIES.length; st.q = null; return R(); }
    case 'acWbLang': { const st = av('word', () => ({})); st.lang = v; st.p = null; return R(); }
    case 'acWbTile': { const st = av('word', () => ({})); if (st.tiles && !st.built.includes(+v)) { st.built.push(+v); st.msg = ''; sfx.pop && sfx.pop(); } return R(); }
    case 'acWbDel': { const st = av('word', () => ({})); if (st.built) st.built.pop(); return R(); }
    case 'acWbCheck': wordCheck(); return true;
    case 'acWbNext': { const st = av('word', () => ({})); st.i = (st.i || 0) + 1; st.p = null; return R(); }
    case 'acSfTab': { const st = av('sifir', () => ({})); st.tb = +v; st.q = null; st.msg = ''; return R(); }
    case 'acSfPick': sifirPick(+v); return true;
    case 'acLabEx': { const st = av('lab', () => ({})); Object.assign(st, { ex: v, pred: -1, run: false, water: 0, sun: 0 }); return R(); }
    case 'acLabPred': { const st = av('lab', () => ({})); if (st.pred < 0) { st.pred = +v; sfx.soft(); } return R(); }
    case 'acLabRun': { const st = av('lab', () => ({})); st.run = true; sfx.whoosh && sfx.whoosh(); if (st.ex !== 'seed' && firstTime('lab', st.ex)) { addCoins(2); save(); } return R(); }
    case 'acLabSeed': { const st = av('lab', () => ({})); st[v] = (st[v] || 0) + 1; if (Math.min(st.water, st.sun) >= 3) { sfx.ok(); if (firstTime('lab', 'seed')) { addCoins(2); save(); } } else sfx.pop && sfx.pop(); return R(); }
    case 'acLabNext': { const st = av('lab', () => ({})); if (st.ex === 'mix') st.pair = (st.pair + 1) % MIXES.length; else st.ex = st.ex === 'ice' ? 'seed' : 'mix'; Object.assign(st, { pred: -1, run: false, water: 0, sun: 0 }); return R(); }
    case 'acMapMode': { const st = av('map', () => ({})); st.mode = v; st.msg = ''; st.sel = null; st.target = null; st.found = 0; return R(); }
    case 'acMapTap': mapTap(v); return true;
    case 'acMuCell': { const [s, n] = String(v).split(':').map(Number), tn = tune(); tn[s] = tn[s] === n ? -1 : n; if (tn[s] >= 0) playNote(n); save(); return R(); }
    case 'acMuPlay': musicPlay(); return true;
    case 'acMuRand': { const tn = tune(); for (let i = 0; i < 8; i++) tn[i] = Math.random() < .15 ? -1 : Math.floor(Math.random() * 4); save(); renderStudies(); musicPlay(); return true; }
    case 'acMuClear': { const tn = tune(); tn.fill(-1); save(); return R(); }
    case 'acFeel': feelSet(+v); return true;
    case 'acFeelWhy': feelSet(undefined, +v); return true;
    case 'acSafeSc': { const st = av('safety', () => ({})); st.sc = v; st.found = []; st.msg = ''; return R(); }
    case 'acSafeTap': safetyTap(+v); return true;
    case 'acPhLang': { const st = av('phon', () => ({})); st.lang = v; st.b = null; return R(); }
    case 'acPhSay': phSay(v); return true;
    case 'acPhTile': phTile(+v); return true;
    case 'acPhUndo': { const st = av('phon', () => ({})); if (st.picked) st.picked.pop(); return R(); }
    case 'acPhSpell': { const st = av('phon', () => ({})); st.spellPick = +v; if (st.spell[+v] === st.b[2]) { sfx.ok(); st.msg = t('ph.spellYes'); if (firstTime('spellDone', st.lang + ':' + st.b[2])) addCoins(1); save(); } else { sfx.soft(); st.msg = t('ph.spellNo'); } return R(); }
    case 'acPhNext': { const st = av('phon', () => ({})); st.i = (st.i || 0) + 1; st.b = null; return R(); }
  }
  return undefined;
});

Object.assign(STR, {
  'ac.title': ['Activities', 'Aktiviti'], 'ac.olderOnly': ['For age 6 and 7', 'Untuk umur 6 dan 7'],
  'ac.notebook': ['My notebook', 'Buku nota saya'], 'ac.notebookD': ['Tips from your lessons', 'Tip daripada pelajaran kamu'],
  'ac.story': ['Story builder', 'Bina cerita'], 'ac.storyD': ['Beginning, middle, end', 'Permulaan, pertengahan, akhir'],
  'ac.word': ['Word bench', 'Meja perkataan'], 'ac.wordD': ['Build words from letters', 'Bina perkataan daripada huruf'],
  'ac.sifir': ['Sifir race', 'Lumba sifir'], 'ac.sifirD': ['Times tables 2 to 9', 'Sifir 2 hingga 9'],
  'ac.lab': ['Science lab', 'Makmal sains'], 'ac.labD': ['Predict, then test', 'Ramal, kemudian uji'],
  'ac.map': ['Map explorer', 'Peneroka peta'], 'ac.mapD': ['The states of Malaysia', 'Negeri-negeri di Malaysia'],
  'ac.music': ['Music maker', 'Pembuat muzik'], 'ac.musicD': ['Make a tune with 4 notes', 'Cipta lagu dengan 4 not'],
  'ac.feel': ['Feelings journal', 'Jurnal perasaan'], 'ac.feelD': ['How do you feel today?', 'Apa perasaan kamu hari ini?'],
  'ac.safety': ['Safety scenes', 'Situasi keselamatan'], 'ac.safetyD': ['Find what is not safe', 'Cari yang tidak selamat'],
  'ac.phonics': ['Sound pad', 'Papan bunyi'], 'ac.phonicsD': ['Hear sounds, blend them', 'Dengar bunyi, gabungkan'],
  'sb.sub': ['Put the pictures in order to tell the story. Tap a picture, or drag it to a box.', 'Susun gambar mengikut urutan untuk bercerita. Sentuh gambar, atau seret ke kotak.'],
  'sb.b': ['Beginning', 'Permulaan'], 'sb.m': ['Middle', 'Pertengahan'], 'sb.e': ['End', 'Akhir'],
  'sb.yes': ['You told the story in the right order!', 'Kamu bercerita mengikut urutan yang betul!'], 'sb.hint': ['What happens first? Look for the very start.', 'Apa yang berlaku dahulu? Cari permulaannya.'],
  'sb.first': ['First, {s}.', 'Mula-mula, {s}.'], 'sb.then': ['Then, {s}.', 'Kemudian, {s}.'], 'sb.end': ['At the end, {s}.', 'Akhirnya, {s}.'], 'sb.next': ['Next story', 'Cerita seterusnya'],
  'wb.sub': ['Tap the letters to build the word for the picture.', 'Sentuh huruf untuk membina perkataan bagi gambar itu.'], 'wb.more': ['Great! Can you make more words from the same letters?', 'Bagus! Boleh kamu bina lagi perkataan daripada huruf yang sama?'],
  'wb.del': ['Undo', 'Buang'], 'wb.check': ['Check', 'Semak'], 'wb.next': ['Next', 'Seterusnya'],
  'wb.yes': ['Yes! {w}!', 'Ya! {w}!'], 'wb.again': ['You already built that one.', 'Kamu sudah membinanya.'], 'wb.found': ['Bonus word: {w}!', 'Perkataan bonus: {w}!'], 'wb.had': ['You found {w} already.', 'Kamu sudah jumpa {w}.'],
  'wb.no': ['Not this time. Try again!', 'Belum betul. Cuba lagi!'], 'wb.bonus': ['Bonus words: {n}/{m}', 'Perkataan bonus: {n}/{m}'],
  'sf.sub': ['Climb one step for each times fact. No clock, no rush.', 'Naik satu anak tangga untuk setiap fakta sifir. Tiada jam, tidak perlu tergesa-gesa.'],
  'sf.older': ['Sifir race is for age 6 and 7. Pick that age in the Parent Portal or on the Adventure screen.', 'Lumba sifir untuk umur 6 dan 7. Pilih umur itu di Portal Ibu Bapa atau skrin Pengembaraan.'],
  'sf.hint': ['Count in {a}s:', 'Kira dengan langkah {a}:'], 'sf.no': ['Not quite. Count up and try again.', 'Belum tepat. Kira dan cuba lagi.'], 'sf.up': ['Up you go! Step {n} of 10.', 'Naik! Anak tangga {n} daripada 10.'],
  'sf.yes': ['Right: {e}', 'Betul: {e}'], 'sf.done': ['You climbed the whole {a} times table! A fruit grows on your tree.', 'Kamu mendaki seluruh sifir {a}! Sebiji buah tumbuh pada pokok kamu.'],
  'sf.ladder': ['Your ladder: step {n} of 10', 'Tangga kamu: anak tangga {n} daripada 10'], 'sf.treeAria': ['Your times-table tree has {n} fruits.', 'Pokok sifir kamu ada {n} biji buah.'],
  'lab.mix': ['Mix colours', 'Campur warna'], 'lab.ice': ['Melt ice', 'Cairkan ais'], 'lab.seed': ['Plant a seed', 'Tanam biji benih'],
  'lab.sub': ['Scientists guess first, then test. It is fine to guess wrong!', 'Saintis meneka dahulu, kemudian menguji. Tidak mengapa jika tekaan salah!'],
  'lab.predict': ['Predict', 'Ramal'], 'lab.test': ['Test it', 'Uji'], 'lab.go': ['Do the experiment', 'Jalankan eksperimen'], 'lab.next': ['Next experiment', 'Eksperimen seterusnya'],
  'lab.predYes': ['Your prediction was right!', 'Ramalan kamu betul!'], 'lab.predNo': ['Let’s test it and see what really happens.', 'Mari uji dan lihat apa yang sebenarnya berlaku.'],
  'lab.mixQ': ['What colour do you get when you mix {a} and {b}?', 'Apakah warna yang terhasil jika {a} dicampur dengan {b}?'], 'lab.mixRes': ['{a} and {b} make {c}!', '{a} dan {b} menghasilkan {c}!'],
  'col.red': ['red', 'merah'], 'col.yellow': ['yellow', 'kuning'], 'col.blue': ['blue', 'biru'], 'col.orange': ['orange', 'jingga'], 'col.green': ['green', 'hijau'], 'col.purple': ['purple', 'ungu'],
  'lab.iceQ': ['Where will an ice cube melt fastest?', 'Di manakah ketulan ais cair paling cepat?'], 'lab.ice_sun': ['In the sun', 'Di bawah matahari'], 'lab.ice_shade': ['In the shade', 'Di tempat teduh'], 'lab.ice_fridge': ['In the fridge', 'Di dalam peti sejuk'],
  'lab.iceRes': ['The ice in the sun melted first. Heat makes ice melt into water.', 'Ais di bawah matahari cair dahulu. Haba mencairkan ais menjadi air.'],
  'lab.seedQ': ['What does a seed need to grow into a plant?', 'Apakah yang diperlukan oleh biji benih untuk tumbuh menjadi pokok?'],
  'lab.seed_need': ['Water and sunlight', 'Air dan cahaya matahari'], 'lab.seed_sweets': ['Sweets', 'Gula-gula'], 'lab.seed_tv': ['Watching TV', 'Menonton TV'],
  'lab.water': ['Water it', 'Siram'], 'lab.sun': ['Sunshine', 'Cahaya matahari'], 'lab.day': ['Day {n}', 'Hari {n}'],
  'lab.seedRes': ['Water and sunlight helped the seed grow into a flower!', 'Air dan cahaya matahari membantu biji benih tumbuh menjadi bunga!'],
  'mp2.learn': ['Learn', 'Belajar'], 'mp2.findMode': ['Find it', 'Cari'], 'mp2.sub': ['A simple map of Malaysia. You have met {n} of {m} places.', 'Peta mudah Malaysia. Kamu sudah kenal {n} daripada {m} tempat.'],
  'mp2.tapOne': ['Tap a state to learn its name.', 'Sentuh sebuah negeri untuk mengetahui namanya.'], 'mp2.which': ['A place on the map', 'Satu tempat di peta'],
  'mp2.state': ['State', 'Negeri'], 'mp2.ft': ['Federal Territory', 'Wilayah Persekutuan'], 'mp2.capital': ['Capital: {c}', 'Ibu negeri: {c}'], 'mp2.cityFT': ['Main town: {c}', 'Bandar utama: {c}'],
  'mp2.find': ['Where is {s}?', 'Di manakah {s}?'], 'mp2.yes': ['Yes! That is {s}.', 'Ya! Itulah {s}.'], 'mp2.no': ['That is {s}. Try again!', 'Itu {s}. Cuba lagi!'],
  'mp2.all': ['You have met every state and territory! +5 🪙', 'Kamu sudah kenal semua negeri dan wilayah! +5 🪙'],
  'mp2.aria': ['Map of Malaysia', 'Peta Malaysia'], 'mp2.sea1': ['Peninsular Malaysia', 'Semenanjung Malaysia'], 'mp2.sea2': ['Sabah and Sarawak (Borneo)', 'Sabah dan Sarawak (Borneo)'],
  'mp2.note': ['The map is drawn simply: shapes and sizes are not exact.', 'Peta ini dilukis secara ringkas: bentuk dan saiznya tidak tepat.'],
  'mpf.perlis': ['Perlis is the smallest state in Malaysia.', 'Perlis ialah negeri paling kecil di Malaysia.'], 'mpf.kedah': ['Kedah is called the rice bowl of Malaysia.', 'Kedah digelar Jelapang Padi Malaysia.'],
  'mpf.penang': ['Penang is an island state. George Town is a World Heritage city.', 'Pulau Pinang ialah negeri pulau. George Town ialah bandar warisan dunia.'], 'mpf.perak': ['Perak was famous for tin mining.', 'Perak terkenal dengan perlombongan bijih timah.'],
  'mpf.kelantan': ['Kelantan is famous for the wau, a big kite.', 'Kelantan terkenal dengan wau.'], 'mpf.terengganu': ['Terengganu has beautiful islands and beaches.', 'Terengganu mempunyai pulau dan pantai yang indah.'],
  'mpf.pahang': ['Pahang is the biggest state in Peninsular Malaysia. Taman Negara is there.', 'Pahang ialah negeri terbesar di Semenanjung Malaysia. Taman Negara terletak di sana.'], 'mpf.selangor': ['More people live in Selangor than in any other state.', 'Selangor mempunyai penduduk paling ramai.'],
  'mpf.kl': ['Kuala Lumpur is the capital city of Malaysia. The Petronas Twin Towers are there.', 'Kuala Lumpur ialah ibu negara Malaysia. Menara Berkembar Petronas terletak di sana.'], 'mpf.putrajaya': ['Putrajaya is where the government works.', 'Putrajaya ialah pusat pentadbiran kerajaan.'],
  'mpf.ns': ['Negeri Sembilan has houses with curved Minangkabau roofs.', 'Negeri Sembilan mempunyai rumah berbumbung Minangkabau yang melengkung.'], 'mpf.melaka': ['Melaka is a historic city and a World Heritage site.', 'Melaka ialah bandar bersejarah dan tapak warisan dunia.'],
  'mpf.johor': ['Johor is at the southern tip of Peninsular Malaysia.', 'Johor terletak di hujung selatan Semenanjung Malaysia.'], 'mpf.labuan': ['Labuan is an island and a Federal Territory.', 'Labuan ialah pulau dan Wilayah Persekutuan.'],
  'mpf.sabah': ['Sabah has Mount Kinabalu, the highest mountain in Malaysia.', 'Sabah mempunyai Gunung Kinabalu, gunung tertinggi di Malaysia.'], 'mpf.sarawak': ['Sarawak is the biggest state in Malaysia.', 'Sarawak ialah negeri terbesar di Malaysia.'],
  'mu.sub': ['Tap the boxes to make a tune of 8 notes, then press Play.', 'Sentuh kotak untuk mencipta lagu 8 not, kemudian tekan Main.'], 'mu.play': ['Play', 'Main'], 'mu.rand': ['Surprise me', 'Kejutan'], 'mu.clear': ['Clear', 'Kosongkan'],
  'mu.cell': ['Step {s}, {n}', 'Langkah {s}, {n}'], 'mu.aria': ['Tune maker', 'Pembuat lagu'], 'mu.quiet': ['Sounds are off in the Parent Portal, but your tune still plays here.', 'Bunyi dimatikan di Portal Ibu Bapa, tetapi lagu kamu tetap dimainkan di sini.'],
  'fl.sub': ['How do you feel today? Tap a face.', 'Apa perasaan kamu hari ini? Sentuh satu muka.'], 'fl.why': ['What is it about?', 'Tentang apa?'], 'fl.week': ['This week', 'Minggu ini'],
  'fl.private': ['Your journal stays on this device. It is not shared.', 'Jurnal kamu kekal dalam peranti ini. Ia tidak dikongsi.'],
  'fl.happy': ['Happy', 'Gembira'], 'fl.calm': ['Calm', 'Tenang'], 'fl.sad': ['Sad', 'Sedih'], 'fl.angry': ['Angry', 'Marah'], 'fl.worried': ['Worried', 'Risau'], 'fl.tired': ['Tired', 'Penat'],
  'fl.r.family': ['Family', 'Keluarga'], 'fl.r.friends': ['Friends', 'Kawan'], 'fl.r.school': ['School', 'Sekolah'], 'fl.r.play': ['Play', 'Bermain'], 'fl.r.food': ['Food', 'Makanan'], 'fl.r.sleep': ['Sleep', 'Tidur'],
  'fl.say.happy': ['Yay! Happy feelings are great to share.', 'Seronoknya! Perasaan gembira elok dikongsi.'], 'fl.say.calm': ['Calm is a lovely feeling. Take a slow breath and enjoy it.', 'Tenang ialah perasaan yang indah. Tarik nafas perlahan-lahan dan nikmatinya.'],
  'fl.say.sad': ['It is okay to feel sad. Talking to someone you trust can help.', 'Tidak mengapa berasa sedih. Bercakap dengan orang yang kamu percaya boleh membantu.'], 'fl.say.angry': ['Angry feelings are okay. Try three slow breaths, then talk about it.', 'Perasaan marah tidak mengapa. Cuba tarik nafas perlahan tiga kali, kemudian ceritakan.'],
  'fl.say.worried': ['When you feel worried, tell a grown-up. You do not have to feel it alone.', 'Apabila kamu risau, beritahu orang dewasa. Kamu tidak perlu menanggungnya seorang diri.'], 'fl.say.tired': ['Your body may need rest. A good sleep helps you feel better.', 'Badan kamu mungkin perlu rehat. Tidur yang cukup membantu kamu berasa lebih baik.'],
  'sf2.kitchen': ['Kitchen', 'Dapur'], 'sf2.street': ['Street', 'Jalan raya'], 'sf2.sub': ['Tap all the things that are NOT safe.', 'Sentuh semua benda yang TIDAK selamat.'],
  'sf2.count': ['Found {n} of {m}', 'Jumpa {n} daripada {m}'], 'sf2.all': ['You found everything that is not safe. Well done, safety star!', 'Kamu jumpa semua yang tidak selamat. Syabas, bintang keselamatan!'], 'sf2.safe': ['That one is safe: {t}', 'Itu selamat: {t}'],
  'sf2.i.knife': ['Knife', 'Pisau'], 'sf2.i.stove': ['Hot stove', 'Dapur panas'], 'sf2.i.plug': ['Plug', 'Palam'], 'sf2.i.pills': ['Medicine', 'Ubat'], 'sf2.i.cleaner': ['Cleaning liquid', 'Cecair pencuci'], 'sf2.i.apple': ['Apple', 'Epal'], 'sf2.i.milk': ['Milk', 'Susu'], 'sf2.i.sponge': ['Sponge', 'Span'], 'sf2.i.chair': ['Chair', 'Kerusi'],
  'sf2.i.ball': ['Ball on the road', 'Bola di jalan raya'], 'sf2.i.phone': ['Phone while walking', 'Telefon semasa berjalan'], 'sf2.i.skate': ['Skateboard on the road', 'Papan luncur di jalan raya'], 'sf2.i.drain': ['Open drain', 'Longkang terbuka'], 'sf2.i.car': ['Moving car', 'Kereta bergerak'],
  'sf2.i.lights': ['Traffic lights', 'Lampu isyarat'], 'sf2.i.crossing': ['Zebra crossing', 'Lintasan belang'], 'sf2.i.helmet': ['Helmet', 'Topi keledar'], 'sf2.i.vest': ['Bright vest', 'Jaket terang'],
  'sf2.t.knife': ['Knives are sharp. Only grown-ups use them.', 'Pisau tajam. Hanya orang dewasa yang menggunakannya.'], 'sf2.t.stove': ['The stove is hot. Stay away from it.', 'Dapur itu panas. Jauhkan diri.'],
  'sf2.t.plug': ['Never touch plugs and sockets, especially with wet hands.', 'Jangan sentuh palam dan soket, terutama dengan tangan basah.'], 'sf2.t.pills': ['Only take medicine from a grown-up you trust.', 'Hanya ambil ubat daripada orang dewasa yang kamu percaya.'],
  'sf2.t.cleaner': ['Cleaning liquids can make you very sick. Do not touch.', 'Cecair pencuci boleh membuatkan kamu sakit. Jangan sentuh.'], 'sf2.t.apple': ['An apple is a healthy snack.', 'Epal ialah snek yang sihat.'], 'sf2.t.milk': ['Milk is good to drink.', 'Susu elok diminum.'],
  'sf2.t.sponge': ['A sponge is safe for washing.', 'Span selamat untuk mencuci.'], 'sf2.t.chair': ['Sit on the chair, do not stand on it.', 'Duduk di atas kerusi, jangan berdiri di atasnya.'],
  'sf2.t.ball': ['Never run after a ball onto the road. Ask a grown-up.', 'Jangan kejar bola ke jalan raya. Minta bantuan orang dewasa.'], 'sf2.t.phone': ['Look at the road, not a phone, when you cross.', 'Lihat jalan, bukan telefon, semasa melintas.'],
  'sf2.t.skate': ['Do not skate or ride on the road. Use a park or path.', 'Jangan meluncur di jalan raya. Gunakan taman atau laluan.'], 'sf2.t.drain': ['Stay away from open drains. You could fall in.', 'Jauhi longkang terbuka. Kamu boleh terjatuh.'],
  'sf2.t.car': ['Never play near moving cars.', 'Jangan bermain berhampiran kereta yang bergerak.'], 'sf2.t.lights': ['Cross when the green man shows.', 'Melintas apabila lampu hijau pejalan kaki menyala.'],
  'sf2.t.crossing': ['Use the zebra crossing and hold a grown-up’s hand.', 'Gunakan lintasan belang dan pegang tangan orang dewasa.'], 'sf2.t.helmet': ['A helmet keeps your head safe on a bike.', 'Topi keledar melindungi kepala semasa berbasikal.'],
  'sf2.t.vest': ['Bright clothes help drivers see you.', 'Pakaian terang membantu pemandu nampak kamu.'],
  'ph.subEn': ['Tap a letter to hear its sound and a word that starts with it.', 'Sentuh huruf untuk mendengar bunyinya dan perkataan yang bermula dengannya.'],
  'ph.subMs': ['Tap a syllable to hear it and a word that uses it.', 'Sentuh suku kata untuk mendengarnya dan perkataan yang menggunakannya.'],
  'ph.blendT': ['Blend two sounds', 'Gabungkan dua bunyi'], 'ph.chal': ['Which two sounds make the word for {e}? Tap them in order.', 'Dua bunyi manakah membentuk perkataan untuk {e}? Sentuh mengikut urutan.'],
  'ph.yes': ['You blended it: {w}!', 'Kamu berjaya menggabungkan: {w}!'], 'ph.no': ['Not those two. Listen and try again!', 'Bukan dua itu. Dengar dan cuba lagi!'],
  'ph.spell': ['Now spell it! Which one spells {e}?', 'Sekarang eja! Yang manakah ejaan untuk {e}?'], 'ph.spellYes': ['Perfect spelling!', 'Ejaan yang tepat!'], 'ph.spellNo': ['Look closely at each letter and try again.', 'Lihat setiap huruf dengan teliti dan cuba lagi.'],
  'tr2.words': ['Words', 'Perkataan'], 'tr2.shapes': ['Shapes', 'Bentuk'], 'tr2.line': ['Number line', 'Garis nombor'],
  'tr2.sayWord': ['Trace the word {w}. Now the letter {l}.', 'Surih perkataan {w}. Sekarang huruf {l}.'], 'tr2.sayShape': ['Trace the {s}.', 'Surih {s}.'],
  'tr2.sayLine': ['Trace the number line, then hop from {a}, {n} times. Where do you land?', 'Surih garis nombor, kemudian lompat dari {a} sebanyak {n} kali. Di mana kamu mendarat?'],
  'tr2.sayLineDone': ['{a} plus {n} is {b}!', '{a} tambah {n} ialah {b}!'], 'tr2.wordDone': ['You traced {w}!', 'Kamu menyurih {w}!'],
  'tr2.neat': ['Neatness:', 'Kekemasan:'], 'tr2.best': ['Best neatness:', 'Kekemasan terbaik:'], 'tr2.neatHow': ['Stay on the dotted line for more neatness stars.', 'Ikut garis titik-titik untuk lebih banyak bintang kekemasan.'],
  'tr2.print': ['Print', 'Cetak'], 'tr2.aria': ['Tracing pad: {g}', 'Pad surih: {g}'],
  'shp.circle': ['circle', 'bulatan'], 'shp.square': ['square', 'segi empat sama'], 'shp.triangle': ['triangle', 'segi tiga'], 'shp.diamond': ['diamond', 'bentuk berlian'], 'shp.star': ['star', 'bintang'], 'shp.heart': ['heart', 'hati']
});
