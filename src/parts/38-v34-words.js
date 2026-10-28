/* ================= v34: real-world word problems =================
   Short stories from everyday Malaysian life (the pasar malam, the canteen, the bus, a kuih stall, a rice bag, a
   film at the cinema) that need the child to choose the sum, not just do it. They are made from templates in
   English and Malay, with numbers that grow with the child's age and with the level (DK, see 07). They are a new
   maths family called "word" (pool code "wp"), so they appear in maths levels next to the bar models, and
   makeQ('math:word') makes one on its own. Younger children get a picture of the things in the story. */
const WP_NAMES = [...NAMES, 'Mei Ling', 'Siti', 'Kumar', 'Amir', 'Nurul'];
/* [emoji, English one, English many, Malay] */
const WP_ITEMS = [
  ['🥭', 'mango', 'mangoes', 'mangga'], ['🍌', 'banana', 'bananas', 'pisang'], ['🍉', 'watermelon', 'watermelons', 'tembikai'], ['🥥', 'coconut', 'coconuts', 'kelapa'],
  ['🍍', 'pineapple', 'pineapples', 'nanas'], ['🥚', 'egg', 'eggs', 'telur'], ['🍪', 'biscuit', 'biscuits', 'biskut'], ['🥟', 'curry puff', 'curry puffs', 'karipap'],
  ['🍎', 'apple', 'apples', 'epal'], ['🍊', 'orange', 'oranges', 'oren'], ['🍩', 'doughnut', 'doughnuts', 'donat'], ['🧁', 'cupcake', 'cupcakes', 'kek cawan']
];
const WP_PRICEY = [['nasi lemak', 'nasi lemak', '🍛'], ['roti canai', 'roti canai', '🫓'], ['kuih', 'kuih', '🍡'], ['ice cream', 'aiskrim', '🍦'], ['notebook', 'buku nota', '📓'], ['pencil case', 'bekas pensel', '✏️']];
const wpName = () => pick(WP_NAMES);
const wpMany = (n, it) => L() ? `${n} ${it[3]}` : `${n} ${n === 1 ? it[1] : it[2]}`;
const wpPics = (e, n, cap = 18) => n <= cap ? e.repeat(n) : e.repeat(cap) + '…';
/* one word problem: text in both languages, the answer, a tempting wrong answer, a picture, and the sum */
function wordBuild(band) {
  const D = DK(), K = (lo, hi) => rnd(lo, Math.max(lo, lo + Math.round((hi - lo) * D)));
  const n1 = wpName(); let n2; do { n2 = wpName(); } while (n2 === n1);
  const it = pick(WP_ITEMS), pr = pick(WP_PRICEY);
  const kinds = band === 1 ? ['add', 'sub'] : band === 2 ? ['add', 'sub', 'bus', 'more'] : band === 3 ? ['add', 'sub', 'bus', 'more', 'groups', 'share', 'money', 'time'] : ['groups', 'share', 'money', 'time', 'two', 'weight', 'half', 'more'];
  const kind = pick(kinds), P = { kind };
  let en, ms, answer, trap, eq, pic = '', textOpts = null;
  const rr = (a, b, c, d) => band === 1 ? K(a[0], a[1]) : band === 2 ? K(b[0], b[1]) : band === 3 ? K(c[0], c[1]) : K(d[0], d[1]);
  if (kind === 'add') {
    const a = rr([1, 5], [4, 12], [20, 60], [100, 400]), b = rr([1, 4], [3, 8], [10, 35], [50, 300]); answer = a + b; trap = Math.abs(a - b) || a + 1; eq = `${a} + ${b} = ?`; pic = wpPics(it[0], a) + ' ➕ ' + wpPics(it[0], b);
    en = `${n1} has ${wpMany(a, it)}. ${n2} gives ${n1} ${b} more. How many ${it[2]} does ${n1} have now?`; ms = `${n1} ada ${wpMany(a, it)}. ${n2} beri ${b} lagi kepada ${n1}. Berapakah ${it[3]} yang ${n1} ada sekarang?`;
  } else if (kind === 'sub') {
    const tot = rr([4, 10], [10, 20], [30, 90], [150, 500]), a = rr([1, tot - 2], [3, tot - 3], [8, tot - 8], [40, tot - 40]), a2 = Math.min(a, tot - 1); answer = tot - a2; trap = tot + a2; eq = `${tot} − ${a2} = ?`; pic = wpPics(it[0], tot);
    en = `${n1} had ${wpMany(tot, it)}. ${n1} ate ${a2} of them. How many ${it[2]} are left?`; ms = `${n1} ada ${wpMany(tot, it)}. ${n1} makan ${a2} daripadanya. Berapakah ${it[3]} yang tinggal?`;
  } else if (kind === 'bus') {
    const a = rr([2, 6], [6, 14], [15, 30], [20, 60]), b = rr([1, 4], [2, 8], [5, 14], [8, 24]), on = Math.random() < .5; answer = on ? a + b : a - Math.min(b, a - 1); trap = on ? Math.abs(a - b) : a + b; const bb = on ? b : Math.min(b, a - 1); eq = `${a} ${on ? '+' : '−'} ${bb} = ?`; pic = '🚌 ' + wpPics('🧒', a, 14);
    en = on ? `There are ${a} children on the bus. ${bb} more children get on at the next stop. How many children are on the bus now?` : `There are ${a} children on the bus. ${bb} children get off at the school. How many children are still on the bus?`;
    ms = on ? `Ada ${a} orang kanak-kanak di dalam bas. ${bb} lagi naik di perhentian seterusnya. Berapakah kanak-kanak di dalam bas sekarang?` : `Ada ${a} orang kanak-kanak di dalam bas. ${bb} turun di sekolah. Berapakah kanak-kanak yang masih di dalam bas?`;
  } else if (kind === 'more') {
    const x = rr([2, 6], [6, 14], [20, 50], [60, 200]), y = rr([1, 4], [2, 6], [5, 25], [20, 90]); answer = y; trap = x + y; eq = `${x + y} − ${x} = ?`; pic = n1 + ' ' + wpPics(it[0], x, 10) + '  ' + n2 + ' ' + wpPics(it[0], x + y, 12);
    en = `${n1} has ${wpMany(x, it)}. ${n2} has ${wpMany(x + y, it)}. How many more ${it[2]} does ${n2} have than ${n1}?`; ms = `${n1} ada ${wpMany(x, it)}. ${n2} ada ${wpMany(x + y, it)}. Berapa banyak lebih ${it[3]} yang ${n2} ada berbanding ${n1}?`;
  } else if (kind === 'groups') {
    const g = rr([2, 3], [2, 4], [2, 6], [3, 9]), k = rr([2, 4], [2, 5], [2, 6], [3, 9]); answer = g * k; trap = g + k; eq = `${g} × ${k} = ?`; pic = Array.from({ length: Math.min(g, 6) }, () => '🍽️' + wpPics(it[0], Math.min(k, 6), 6)).join(' ');
    en = `There are ${g} plates. Each plate has ${wpMany(k, it)}. How many ${it[2]} are there altogether?`; ms = `Ada ${g} biji pinggan. Setiap pinggan ada ${wpMany(k, it)}. Berapakah ${it[3]} semuanya?`;
  } else if (kind === 'share') {
    const g = rr([2, 3], [2, 4], [2, 5], [2, 8]), k = rr([2, 4], [2, 5], [2, 6], [3, 9]), tot = g * k; answer = k; trap = tot - g; eq = `${tot} ÷ ${g} = ?`; pic = wpPics(it[0], tot, 20);
    en = `${n1} shares ${wpMany(tot, it)} equally among ${g} friends. How many ${it[2]} does each friend get?`; ms = `${n1} berkongsi ${wpMany(tot, it)} sama banyak dengan ${g} orang kawan. Berapakah ${it[3]} yang setiap kawan dapat?`;
  } else if (kind === 'money') {
    const p = rr([1, 3], [1, 4], [1, 6], [2, 12]), k = rr([2, 3], [2, 3], [2, 5], [3, 8]), type = band === 3 ? pick(['total', 'change']) : pick(['total', 'change', 'sen']);
    if (type === 'sen') { const s = pick([10, 20, 30, 40, 50]); answer = s * k; trap = s + k; eq = `${k} × ${s} sen = ?`; pic = '🪙'.repeat(Math.min(k, 8));
      en = `A sweet costs ${s} sen. ${n1} buys ${k} sweets. How many sen does ${n1} pay?`; ms = `Sebiji gula-gula berharga ${s} sen. ${n1} membeli ${k} biji. Berapa sen yang ${n1} bayar?`; }
    else if (type === 'total') { answer = p * k; trap = p + k; eq = `${k} × RM${p} = ?`; pic = pr[2].repeat(Math.min(k, 8));
      en = `One ${pr[0]} costs RM${p}. ${n1} buys ${k}. How much does ${n1} pay in RM?`; ms = `Satu ${pr[1]} berharga RM${p}. ${n1} membeli ${k}. Berapa RM yang ${n1} bayar?`; }
    else { const pay = Math.ceil((p * k + 1) / 5) * 5; answer = pay - p * k; trap = pay + p * k; eq = `RM${pay} − RM${p * k} = ?`; pic = '💵';
      en = `${n1} buys ${k === 1 ? 'one' : k} ${pr[0]}${k === 1 ? '' : (/s$/.test(pr[0]) ? '' : 's')} at RM${p} each and pays RM${pay}. How much change in RM does ${n1} get?`; ms = `${n1} membeli ${k} ${pr[1]} pada harga RM${p} setiap satu dan membayar RM${pay}. Berapa RM baki yang ${n1} dapat?`; }
    P.cur = 'RM';
  } else if (kind === 'time') {
    const h = rr([1, 3], [1, 5], [1, 8], [1, 9]), d = rr([1, 2], [1, 2], [1, 3], [1, 4]), fmt = x => `${x > 12 ? x - 12 : x}:00`; answer = h + d; textOpts = fmt(answer); eq = `${h}:00 + ${d}h`; pic = '🎬🕒';
    const o = new Set([textOpts]); [answer - 1, answer + 1, answer + 2, answer - 2, h].forEach(x => { if (x > 0 && x <= 12 && o.size < 4) o.add(fmt(x)); }); trap = null; P.opts = [...o];
    en = `A film starts at ${h}:00 p.m. and lasts ${d} hour${d > 1 ? 's' : ''}. What time does it end?`; ms = `Sebuah filem bermula pada pukul ${h}:00 petang dan berlangsung selama ${d} jam. Pukul berapakah ia tamat?`;
  } else if (kind === 'two') {
    const p = K(2, 9), k = K(2, 5), pay = Math.ceil((p * k + 1) / 10) * 10; answer = pay - p * k; trap = p * k; eq = `RM${pay} − ${k} × RM${p} = ?`; pic = pr[2].repeat(k) + ' 💵';
    en = `${n1} buys ${k} ${pr[0]}${/s$/.test(pr[0]) ? '' : 's'} at RM${p} each. ${n1} pays with RM${pay}. How much change in RM does ${n1} get?`; ms = `${n1} membeli ${k} ${pr[1]} pada harga RM${p} setiap satu. ${n1} membayar dengan RM${pay}. Berapa RM baki yang ${n1} dapat?`;
  } else if (kind === 'weight') {
    const w = K(2, 10), m = K(2, 6); answer = w * m; trap = w + m; eq = `${m} × ${w} kg = ?`; pic = '🌾'.repeat(Math.min(m, 8));
    en = `One bag of rice weighs ${w} kg. ${n1} buys ${m} bags. How many kg of rice is that altogether?`; ms = `Satu beg beras beratnya ${w} kg. ${n1} membeli ${m} beg. Berapa kg beras semuanya?`;
  } else {   // half
    const tot = 2 * K(3, 20); answer = tot / 2; trap = tot - 2; eq = `${tot} ÷ 2 = ?`; pic = wpPics(it[0], tot, 20);
    en = `${n1} has ${wpMany(tot, it)} and gives half of them to ${n2}. How many ${it[2]} does ${n2} get?`; ms = `${n1} ada ${wpMany(tot, it)} dan memberi separuh daripadanya kepada ${n2}. Berapakah ${it[3]} yang ${n2} dapat?`;
  }
  return { kind, en, ms, answer, trap, eq, pic, textOpts, opts: P.opts, cur: P.cur };
}
function wordQ(band) {
  band = Math.max(1, Math.min(4, band | 0 || 1));
  let w, guard = 0; do { w = wordBuild(band); } while (guard++ < 8 && !(w.answer > 0));
  const text = L() ? w.ms : w.en;
  let options, correct;
  if (w.textOpts) { options = shuffle(w.opts); correct = options.indexOf(w.textOpts); }
  else ({ options, correct } = makeOptions(w.answer, w.trap));
  const ansTxt = w.textOpts || String(w.answer), eqLine = w.eq.replace('?', ansTxt);
  return {
    kind: 'math', type: 'word_' + w.kind, fam: 'word', topic: 'math_word', tag: t('tag.word'), text, options, correct, cls: 'txt', key: text, eq: w.eq, ansText: ansTxt,
    steps: () => [t('s.word0'), t('s.word1'), t('s.word2', { eq: eqLine })].join(' '), speak: [[`${text} ${t('choices')}: ${options.join(', ')}.`]],
    viz: hl => `<div class="clue wp" aria-hidden="true">${esc(w.pic)}</div>${hl ? `<div class="eq">${esc(w.eq)}</div>` : ''}`,
    rep: S.repPick || 'concrete', word: null
  };
}
Object.assign(STR, {
  'tag.word': ['Word problem', 'Soalan cerita'], 'tp.math_word': ['Word problems', 'Soalan cerita'], 'skill.word': ['Word problems', 'Soalan cerita'],
  's.word0': ['Read the story slowly and find the numbers.', 'Baca cerita perlahan-lahan dan cari nombor.'],
  's.word1': ['Ask: do we put together, take away, share or compare?', 'Tanya: adakah kita menggabung, menolak, berkongsi atau membanding?'],
  's.word2': ['Write the sum and solve it: {eq}', 'Tulis ayat matematik dan selesaikan: {eq}']
});
