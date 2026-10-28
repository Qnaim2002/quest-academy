/* ================= v22: flashcards with spaced review =================
   A deck per subject (words, shapes, sifir, opposites, colours, instruments, feelings…). Tap a card to flip
   it, then "I knew it" or "Again". Each card sits in a Leitner box (S.cards[deck][card] = [box, dueDay]):
   "I knew it" moves it up a box and it comes back after 1, 2, 4, 7 or 14 days; "Again" sends it to box 0 and
   shows it once more in this session. A session is the cards due today plus up to 5 new ones. */
const FC_GAP = [0, 1, 2, 4, 7, 14];
const dayNum = (d = new Date()) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
const FC = (() => {
  const G = QT.G, li = () => L();
  const pic = (list, w) => list.map(it => ({ id: it[0] + it[1], f: it[0], b: () => it[w === 'bm' ? 2 : w === 'en' ? 1 : 1 + li()], sub: () => w === 'bm' ? it[1] : w === 'en' ? it[2] : '' }));
  const pairs = (list) => list.map(([a, b, ka]) => ({ id: ka || a + '=' + b, f: a, b: () => b }));
  const sifir = (lo, hi) => { const out = []; for (let a = lo; a <= hi; a++) for (let b = 2; b <= 9; b++) out.push([`${a} × ${b}`, String(a * b)]); return pairs(out); };
  const bonds = () => pairs(Array.from({ length: 9 }, (_, i) => [`${i + 1} + ? = 10`, String(9 - i)]));
  const OPP_EN = [['big', 'small'], ['hot', 'cold'], ['up', 'down'], ['fast', 'slow'], ['happy', 'sad'], ['day', 'night'], ['open', 'close'], ['tall', 'short'], ['full', 'empty'], ['old', 'new']];
  const OPP_BM = [['besar', 'kecil'], ['panas', 'sejuk'], ['atas', 'bawah'], ['cepat', 'lambat'], ['gembira', 'sedih'], ['siang', 'malam'], ['buka', 'tutup'], ['tinggi', 'rendah'], ['penuh', 'kosong'], ['tua', 'muda']];
  const DAYS = [['Isnin', 'Monday'], ['Selasa', 'Tuesday'], ['Rabu', 'Wednesday'], ['Khamis', 'Thursday'], ['Jumaat', 'Friday'], ['Sabtu', 'Saturday'], ['Ahad', 'Sunday']];
  const D = [
    { id: 'math_shapes', s: 'math', em: '🔷', n: ['Shapes', 'Bentuk'], cards: () => pic([...G.shape, ['🎲', 'cube', 'kubus'], ['⚽', 'sphere', 'sfera'], ['🥫', 'cylinder', 'silinder'], ['🍦', 'cone', 'kon']]) },
    { id: 'math_bonds', s: 'math', em: '🔟', n: ['Partners of 10', 'Pasangan 10'], bands: [1, 2], cards: bonds },
    { id: 'math_sifir2', s: 'math', em: '✖️', n: ['Sifir 2 to 5', 'Sifir 2 hingga 5'], bands: [3, 4], cards: () => sifir(2, 5) },
    { id: 'math_sifir6', s: 'math', em: '✖️', n: ['Sifir 6 to 9', 'Sifir 6 hingga 9'], bands: [4], cards: () => sifir(6, 9) },
    { id: 'bm_words', s: 'bm', em: '📖', n: ['Malay words', 'Perkataan'], cards: () => pic([...G.fruit, ...G.animal, ...G.vehicle, ...G.school, ...G.clothes], 'bm') },
    { id: 'bm_opp', s: 'bm', em: '🔁', n: ['Opposites', 'Lawan kata'], bands: [2, 3, 4], cards: () => pairs(OPP_BM) },
    { id: 'bm_days', s: 'bm', em: '📅', n: ['Days in Malay', 'Hari dalam seminggu'], cards: () => pairs(DAYS) },
    { id: 'en_words', s: 'en', em: '🔤', n: ['English words', 'Perkataan Inggeris'], cards: () => pic([...G.fruit, ...G.animal, ...G.vehicle, ...G.school, ...G.sky], 'en') },
    { id: 'en_opp', s: 'en', em: '🔁', n: ['Opposites', 'Lawan kata'], bands: [2, 3, 4], cards: () => pairs(OPP_EN) },
    { id: 'sc_body', s: 'sc', em: '🔬', n: ['Body and senses', 'Badan dan deria'], cards: () => pic([...G.body, ['👅', 'tongue', 'lidah']]) },
    { id: 'sc_living', s: 'sc', em: '🌱', n: ['Living things', 'Benda hidup'], cards: () => pic([...G.living, ...G.water]) },
    { id: 'pm_polite', s: 'pm', em: '🤝', n: ['Polite words', 'Kata-kata sopan'], cards: () => pic([['🎁', 'Thank you', 'Terima kasih'], ['😣', 'Sorry', 'Maaf'], ['🙋', 'Please', 'Tolong'], ['👋', 'Good morning', 'Selamat pagi'], ['🌙', 'Good night', 'Selamat malam'], ['🚪', 'Excuse me', 'Tumpang lalu']]) },
    { id: 'pk_symbols', s: 'pk', em: '🇲🇾', n: ['Symbols of Malaysia', 'Lambang Malaysia'], cards: () => pic(G.my) },
    { id: 'se_feel', s: 'se', em: '💛', n: ['Feelings', 'Perasaan'], cards: () => pic([...G.happy, ...G.sad, ['😠', 'angry', 'marah'], ['😨', 'scared', 'takut']]) },
    { id: 'fk_food', s: 'fk', em: '🥦', n: ['Healthy food', 'Makanan sihat'], cards: () => pic([...G.healthy, ...G.fruit.slice(0, 4)]) },
    { id: 'sv_colours', s: 'sv', em: '🎨', n: ['Colours', 'Warna'], cards: () => pic([...G.warm, ...G.cool, ['⬛', 'black', 'hitam'], ['⬜', 'white', 'putih'], ['🟫', 'brown', 'coklat']]) },
    { id: 'mz_inst', s: 'mz', em: '🎵', n: ['Instruments', 'Alat muzik'], cards: () => pic(G.instrument) }
  ];
  return { D, deck: id => D.find(d => d.id === id) };
})();
const fcBox = deck => { const C = S.cards || (S.cards = {}); return C[deck] || (C[deck] = {}); };
function fcCounts(d) {
  const box = fcBox(d.id), today = dayNum(), cards = d.cards();
  const due = cards.filter(c => box[c.id] && box[c.id][1] <= today).length, fresh = cards.filter(c => !box[c.id]).length;
  return { due, fresh, total: cards.length, known: cards.filter(c => box[c.id] && box[c.id][0] >= 3).length };
}
const fcDecks = () => FC.D.filter(d => SUBJ_ORDER.includes(d.s) && subjOpen(d.s) && (!d.bands || d.bands.includes(S.band)));
const fcDueAll = () => fcDecks().reduce((a, d) => a + fcCounts(d).due, 0);
/* UI.fc = { deck, queue: [cardId…], flip, seen, knew, again } */
function fcStart(id) {
  const d = FC.deck(id), box = fcBox(id), today = dayNum(), cards = d.cards();
  const due = shuffle(cards.filter(c => box[c.id] && box[c.id][1] <= today)).slice(0, 12), fresh = cards.filter(c => !box[c.id]).slice(0, 5);
  UI.fc = { deck: id, queue: [...due, ...fresh].map(c => c.id), flip: false, seen: 0, knew: 0, again: 0 };
  if (!UI.fc.queue.length) UI.fc.queue = shuffle(cards).slice(0, 5).map(c => c.id);   // nothing due: a short extra round
}
function fcAnswer(knew) {
  const f = UI.fc; if (!f || !f.queue.length) return;
  const id = f.queue.shift(), box = fcBox(f.deck), cur = box[id] ? box[id][0] : 0, today = dayNum();
  if (knew) { const nb = Math.min(FC_GAP.length - 1, cur + 1); box[id] = [nb, today + FC_GAP[nb]]; f.knew++; sfx.ok(); }
  else { box[id] = [0, today]; f.again++; if (!f.queue.includes(id)) f.queue.splice(Math.min(3, f.queue.length), 0, id); sfx.soft(); }
  f.seen++; f.flip = false;
  if (!f.queue.length) { const day = todayKey(), F = S.fcDay || (S.fcDay = {}); if (F[f.deck] !== day) { F[f.deck] = day; addCoins(2); f.gain = 2; } }
  save(); renderFlash();
}
function renderFlash() {
  const ov = $('#lessonOverlay'), sheet = $('#lessonSheet'), f = UI.fc;
  if (!f || !f.deck) {
    const decks = fcDecks(), bySubj = SUBJ_ORDER.map(s => [s, decks.filter(d => d.s === s)]).filter(([, ds]) => ds.length);
    sheet.innerHTML = `<div class="lhead"><span class="em">🃏</span><h2>${t('fc.title')}</h2></div><p class="sub" style="margin:2px 0 12px">${t('fc.sub')}</p>
      ${bySubj.map(([s, ds]) => `<h3 class="sub-h">${SUBJ_EM[s]} ${t('subj.' + s)}</h3><div class="fc-decks">${ds.map(d => { const c = fcCounts(d); return `<button class="fc-deck" data-act="fcDeck" data-v="${d.id}"><span class="em" aria-hidden="true">${d.em}</span><b>${esc(d.n[L()])}</b><small>${c.due ? `<em class="due">${t('fc.due', { n: c.due })}</em> · ` : ''}${t('fc.known', { n: c.known, m: c.total })}</small></button>`; }).join('')}</div>`).join('')}
      <button class="btn ghost" style="width:100%;margin-top:14px" data-act="fcClose">${t('st.close')}</button>`;
    ov.classList.add('on'); return;
  }
  const d = FC.deck(f.deck);
  if (!f.queue.length) {
    sheet.innerHTML = `<div class="lhead"><span class="em">${d.em}</span><h2>${esc(d.n[L()])}</h2></div><div class="fc-end"><b>🎉 ${t('fc.done')}</b><p>${t('fc.doneTxt', { n: f.seen, k: f.knew })}</p>${f.gain ? `<p class="note">+${f.gain} 🪙</p>` : ''}<p class="sub">${t('fc.next')}</p></div>
      <div class="seg" style="justify-content:center"><button class="btn" data-act="fcDeck" data-v="${d.id}">↺ ${t('fc.more')}</button><button class="btn ghost" data-act="fcBack">${t('fc.decks')}</button></div>`;
    return;
  }
  const c = d.cards().find(x => x.id === f.queue[0]), left = f.queue.length, big = /^\p{Extended_Pictographic}/u.test(c.f) && c.f.length <= 4;
  const say = f.flip ? c.b() : (big ? '' : c.f);
  sheet.innerHTML = `<div class="lhead"><span class="em">${d.em}</span><h2>${esc(d.n[L()])}</h2></div><p class="sub" style="margin:0 0 8px">${t('fc.left', { n: left })}</p>
    <button class="fcard3 ${f.flip ? 'flip' : ''}" data-act="fcFlip" aria-label="${esc(f.flip ? c.b() : t('fc.tap'))}"><span class="fc-in"><span class="fc-f"><span class="${big ? 'fc-big' : 'fc-txt'}">${esc(c.f)}</span><small>${t('fc.tap')}</small></span><span class="fc-b"><span class="fc-txt">${esc(c.b())}</span>${c.sub && c.sub() ? `<small>${esc(c.sub())}</small>` : ''}</span></span></button>
    ${f.flip ? `<div class="fc-acts"><button class="btn big ghost" data-act="fcAgain">↺ ${t('fc.again')}</button><button class="btn big good" data-act="fcKnew">✓ ${t('fc.knew')}</button></div>` : `<p class="sub" style="text-align:center">${t('fc.think')}</p>`}
    ${say ? `<div class="seg" style="justify-content:center"><button class="speak" data-act="say" data-say="${esc(say)}" aria-label="${esc(t('st.listen'))}">🔊</button></div>` : ''}
    <button class="btn ghost" style="width:100%;margin-top:12px" data-act="fcBack">${t('fc.decks')}</button>`;
}
function flashEvent(a, v) {
  switch (a) {
    case 'fcGo': showTab('studies'); return flashEvent('fcOpen');
    case 'fcOpen': UI.fc = { deck: null }; UI.open = null; $('#lessonSheet').scrollTop = 0; renderFlash(); return true;
    case 'fcDeck': fcStart(v); renderFlash(); return true;
    case 'fcFlip': if (UI.fc) { UI.fc.flip = !UI.fc.flip; sfx.pop(); renderFlash(); } return true;
    case 'fcKnew': fcAnswer(true); return true;
    case 'fcAgain': fcAnswer(false); return true;
    case 'fcBack': UI.fc = { deck: null }; renderFlash(); return true;
    case 'fcClose': UI.fc = null; $('#lessonOverlay').classList.remove('on'); $('#lessonSheet').innerHTML = ''; renderStudies(); return true;
  }
  return false;
}
/* a reminder on the Adventure hero strip when cards are due */
function heroStripExtra() { const n = fcDueAll(); return n ? `<button class="fc-pill" data-act="fcGo">🃏 ${t('fc.pill', { n })}</button>` : ''; }
