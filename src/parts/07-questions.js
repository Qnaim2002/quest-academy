/* ================= Question generators ================= */
function makeOptions(answer, trap) {
  const set = new Set([answer]);
  if (trap && trap > 0 && trap !== answer) set.add(trap);
  const big = answer > 100; let guard = 0;
  while (set.size < OPT_N && guard++ < 80) { const d = (big ? rnd(10, 40) : rnd(1, 6)) * (Math.random() < .5 ? -1 : 1); if (answer + d > 0) set.add(answer + d); }
  const options = shuffle([...set]); return { options, correct: options.indexOf(answer) };
}
const MATH_TYPES = {
  1: { pw: ['pw_total', 'pw_part'], cmp: ['cmp_more', 'cmp_diff'], units: ['pw_total', 'pw_part'], frac: ['pw_total', 'pw_part'] },
  2: { pw: ['pw_total', 'pw_part'], cmp: ['cmp_more', 'cmp_diff'], units: ['groups'], frac: ['frac_name', 'frac_of'] },
  3: { pw: ['pw_part', 'pw_total'], cmp: ['cmp_total', 'cmp_diff', 'cmp_more'], units: ['groups_div', 'ratio'], frac: ['frac_name', 'frac_of'] }
};
const unitSlots = (n, o) => Array.from({ length: n }, () => ({ ...o }));

function misspell(w) {
  const vowels = 'aeiou', ops = [
    s => { const i = rnd(1, s.length - 2); return s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2); },
    s => { const i = rnd(1, s.length - 1); return s.slice(0, i) + s[i] + s.slice(i); },
    s => { const i = rnd(1, s.length - 1); return s.slice(0, i) + s.slice(i + 1); },
    s => { const idx = [...s].map((c, i) => vowels.includes(c) && i > 0 ? i : -1).filter(i => i > 0); if (!idx.length) return s + 'e'; const i = pick(idx); const v = pick([...vowels].filter(c => c !== s[i])); return s.slice(0, i) + v + s.slice(i + 1); }
  ];
  return pick(ops)(w);
}
function syllQ(band) {
  const [w, e, sy] = pick(SYL[band]), n = sy.length;
  const cand = shuffle([n - 2, n - 1, n + 1, n + 2, n + 3].filter(v => v >= 1 && v !== n)).slice(0, OPT_N - 1), options = shuffle([n, ...cand]);
  return { kind: 'syll', type: 'syll', topic: 'lit_syll', tag: t('tag.syll'), text: t('q.syll', { w }), options, correct: options.indexOf(n), cls: '', key: w, word: w, ansText: String(n),
    steps: () => t('s.syll', { w, chunks: sy.join(' · '), n }), speak: [[t('q.syllSay')], [w, 'en-US'], [`${t('choices')}: ${options.join(', ')}.`]],
    viz: hl => `<div class="clue" aria-label="Picture clue">${e}</div><div class="wordbig">${hl ? sy.map((c, i) => `<span class="chunk k${i % 3}">${esc(c)}</span>`).join('·') : esc(w)}</div>` };
}
function ceQ(band, topics) {
  let list = CE[band]; if (topics) { const f = list.filter(i => topics.includes(i.topic)); if (f.length >= 2) list = f; }
  const it = pick(list), a = it[S.lang] || [it.text, it.answer, it.wrongs[0], it.wrongs[1], it.hints[0], it.hints[1]];
  const x4 = borrowWrong(CE[band], it, [a[1], a[2], a[3]], y => y.topic !== it.topic), options = shuffle([a[1], a[2], a[3]].concat(x4 ? [x4] : []));
  return { kind: 'ce', type: 'ce', topic: 'stem_' + it.topic, tag: t('tag.ce'), text: a[0], options, correct: options.indexOf(a[1]), cls: 'txt', key: it.text, ansText: a[1], customSteps: true,
    steps: () => [t('s.ce0'), a[4], a[5], t('s.ce3', { a: a[1] })], speak: [[`${a[0]} ${t('choices')}: ${options.join('. ')}.`]],
    viz: hl => `<div class="cause ${hl ? 'hl' : ''}" aria-hidden="true">${it.cause.map(c => `<span>${c}</span>`).join('<b>+</b>')}<b>➜</b><span class="qm">?</span></div>` };
}

/* Web Animations fallback so the game never breaks on very old browsers */
if (!Element.prototype.animate) { Element.prototype.animate = function () { return { finished: Promise.resolve(), cancel() { }, set onfinish(f) { setTimeout(f, 0); } }; }; }
if (!Element.prototype.getAnimations) { Element.prototype.getAnimations = function () { return []; }; }
/* ================= v4 generators ================= */
const DK = () => B.dk || 1;
const X = (lo, hi) => rnd(lo, Math.max(lo, lo + Math.round((hi - lo) * DK())));
/* pick from a list ordered easy -> hard, opening up harder items as the level's difficulty rises */
const pickDK = (arr, key) => { const s = [...arr].sort((a, b) => key(a) - key(b)), n = Math.max(3, Math.ceil(s.length * Math.max(.45, DK()))); return pick(s.slice(0, n)); };

function mathQ(band, fam) {
  const ti = rnd(0, 7), th = THINGS[L()][ti], n1 = pick(NAMES); let n2; do { n2 = pick(NAMES); } while (n2 === n1);
  fam = fam || pick(['pw', 'cmp', 'units']);
  const type = pick(MATH_TYPES[band][fam]);
  const R = (a, b, c) => { const r = band === 1 ? a : band === 2 ? b : c; return X(r[0], r[1]); };
  const P = { n1, n2, th }; let model, answer, trap, eq, manip, optionsOverride = null, fr = null;
  const TEN = { type: 'ten', hundreds: band === 3, use: true };
  if (type === 'pw_total') {
    const a = R([1, 5], [12, 45], [120, 480]), b = R([1, 5], [12, 45], [120, 480]); Object.assign(P, { a, b });
    model = { rows: [{ segs: [{ w: a, label: a }, { w: b, label: b }] }], total: { label: '?', row: 0 } }; answer = a + b; trap = Math.abs(a - b) || a + b + 1; eq = `${a} + ${b} = ?`;
    manip = band === 1 ? { type: 'unit', use: true, ask: 0, is: 'total', tracks: [{ name: '', slots: unitSlots(a, { c: 1 }).concat(unitSlots(b, { c: 2 })) }] } : TEN;
  } else if (type === 'pw_part') {
    const tot = band === 1 ? X(4, 10) : band === 2 ? X(30, 99) : X(300, 950), a = band === 1 ? rnd(1, tot - 1) : band === 2 ? rnd(10, tot - 10) : rnd(100, tot - 100); Object.assign(P, { tot, a });
    model = { rows: [{ segs: [{ w: a, label: a }, { w: tot - a, label: '?', q: true }] }], total: { label: tot, row: 0 } }; answer = tot - a; trap = tot + a; eq = `${tot} − ${a} = ?`;
    manip = band === 1 ? { type: 'unit', use: true, ask: 0, is: 'placed', tracks: [{ name: '', slots: unitSlots(a, { pre: true, c: 1 }).concat(unitSlots(tot - a, { c: 2, q: true })) }] } : TEN;
  } else if (type === 'groups') {
    const n = X(2, 5), v = X(2, 6); Object.assign(P, { n, v });
    model = { rows: [{ segs: Array.from({ length: n }, () => ({ w: 1, label: v })) }], total: { label: '?', row: 0 } }; answer = n * v; trap = n + v; eq = `${n} × ${v} = ?`; manip = TEN;
  } else if (type === 'groups_div') {
    const n = X(3, 8), v = X(4, 12), tot = n * v; Object.assign(P, { n, v, tot });
    model = { rows: [{ segs: Array.from({ length: n }, () => ({ w: 1, label: '?', q: true })) }], total: { label: tot, row: 0 } }; answer = v; trap = tot - n; eq = `${tot} ÷ ${n} = ?`; manip = TEN;
  } else if (type === 'cmp_more') {
    const x = R([2, 6], [10, 40], [120, 480]), y = R([1, 4], [5, 20], [30, 150]); Object.assign(P, { x, y });
    model = { rows: [{ name: n1, segs: [{ w: x, label: x }] }, { name: n2, segs: [{ w: x, label: x }, { w: y, label: '+' + y }], after: '?' }] }; answer = x + y; trap = Math.abs(x - y) || x + y + 1; eq = `${x} + ${y} = ?`;
    manip = band === 1 ? { type: 'unit', use: true, ask: 1, is: 'total', tracks: [{ name: n1, slots: unitSlots(x, { pre: true, c: 1 }) }, { name: n2, slots: unitSlots(x, { pre: true, c: 1 }).concat(unitSlots(y, { c: 2 })) }] } : TEN;
  } else if (type === 'cmp_diff') {
    let big, small; if (band === 1) { big = X(4, 10); small = rnd(1, big - 2); } else if (band === 2) { big = X(20, 60); small = rnd(5, big - 5); } else { big = X(150, 900); small = rnd(40, big - 40); } Object.assign(P, { big, small });
    model = { rows: [{ name: n1, segs: [{ w: small, label: '' }, { w: big - small, label: '?', q: true }], after: big }, { name: n2, segs: [{ w: small, label: small }] }] }; answer = big - small; trap = big + small; eq = `${big} − ${small} = ?`;
    manip = band === 1 ? { type: 'unit', use: true, ask: 0, is: 'placed', tracks: [{ name: n1, slots: unitSlots(small, { pre: true, c: 1 }).concat(unitSlots(big - small, { c: 2, q: true })) }, { name: n2, slots: unitSlots(small, { pre: true, c: 1 }) }] } : TEN;
  } else if (type === 'cmp_total') {
    const x = X(120, 400), y = X(30, 120); Object.assign(P, { x, y, x2: x + y });
    model = { rows: [{ name: n1, segs: [{ w: x, label: x }] }, { name: n2, segs: [{ w: x, label: x }, { w: y, label: '+' + y }] }], total: { label: '?', vertical: true } }; answer = 2 * x + y; trap = x + y; eq = `${x} + ${x + y} = ?`; manip = TEN;
  } else if (type === 'ratio') {
    const u = X(3, 12), k = X(2, 4), tot = u * (k + 1); Object.assign(P, { k, tot, boxes: k + 1 });
    model = { rows: [{ name: n2, segs: [{ w: 1, label: '?', q: true }] }, { name: n1, segs: Array.from({ length: k }, () => ({ w: 1, label: '' })) }], total: { label: tot, vertical: true } }; answer = u; trap = u * k; eq = `${tot} ÷ ${k + 1} = ?`; manip = TEN;
  } else if (type === 'frac_name') {
    const n = band === 2 ? pick([2, 3, 4]) : pick([3, 4, 5, 6, 8]), k = rnd(1, n - 1); Object.assign(P, { n, k });
    answer = `${k}/${n}`; fr = { n, k, tot: 0 }; eq = t('eq.fracname', { k, n });
    const dis = shuffle([...new Set([`${n - k}/${n}`, `${k}/${n + 1}`, `${n}/${k}`, `${k + 1}/${n}`, `${k}/${n + 2}`])].filter(x => x !== answer)).slice(0, OPT_N - 1);
    optionsOverride = shuffle([answer, ...dis]); manip = { type: 'frac', n0: n, shade: Array.from({ length: k }, (_, i) => i), total: 0 };
  } else {
    const n = band === 2 ? pick([2, 4]) : pick([3, 4, 5, 6, 8]), part = band === 2 ? rnd(2, 6) : rnd(3, 9), tot = n * part, k = rnd(1, n - 1); Object.assign(P, { n, k, tot, part });
    answer = k * part; trap = k > 1 ? part : tot - part; fr = { n, k, tot, q: true }; eq = `${k}/${n} × ${tot} = ?`; manip = { type: 'frac', n0: 1, shade: [], total: tot };
  }
  const fam2 = type.startsWith('pw') ? 'pw' : type.startsWith('cmp') ? 'cmp' : type.startsWith('frac') ? 'frac' : 'units';
  let options, correct;
  if (optionsOverride) { options = optionsOverride; correct = options.indexOf(answer); } else ({ options, correct } = makeOptions(answer, trap));
  const one = n => (L() || n !== 1) ? th : THING1[ti];   // v22: singular for 1 in English
  Object.assign(P, { thA: one(P.a), thB: one(P.b), thX: one(P.x), thBig: one(P.big), isA: P.a === 1 ? 'is' : 'are' });
  const text = t('q.' + type, P);
  const q = {
    kind: 'math', type, fam: fam2, topic: 'math_' + fam2, tag: t('tag.' + fam2), text, options, correct, cls: '', key: text, eq, manip, ansText: String(answer), steps: () => t('s.' + type, { ...P, ans: answer }),
    speak: [[`${text} ${t('choices')}: ${options.join(', ')}.`]],
    viz: hl => fr ? fracSVG(fr.n, fr.k, fr.tot, hl, fr.q) : barSVG(model, hl)
  };
  q.rep = S.repPick || 'concrete'; return q;   // the way to solve is chosen in the level briefing and locked during the battle

}

/* Spelling, phonics and missing-letter challenges always show the target word (see wordCard in the UI) */
function spellQ(band) {
  const [w, e] = pickDK(WORDS[band], x => x[0].length), wrong = new Set(); let guard = 0;
  while (wrong.size < OPT_N - 1 && guard++ < 90) { const m = misspell(w); if (m !== w && m.length > 2) wrong.add(m); }
  while (wrong.size < OPT_N - 1) wrong.add(w + 'e'.repeat(wrong.size + 1));
  const options = shuffle([w, ...wrong]), last = w.length - 1;
  return { kind: 'spell', type: 'spell', topic: 'lit_spell', tag: t('tag.spell'), text: t('q.spell'), options, correct: options.indexOf(w), cls: 'spell', key: w, word: w, reveal: 'always', ansText: w,
    steps: () => t('s.spell', { w, len: w.length, f: w[0] }), speak: [[t('q.spellSay')], [w, 'en-US']],
    viz: hl => `<div class="clue" aria-label="Picture clue">${e}</div>${hl ? `<div class="slots">${[...w].map((c, i) => `<span class="slot ${i === 0 || i === last ? 'full' : ''}">${i === 0 || i === last ? c : ''}</span>`).join('')}</div>` : ''}` };
}
function phonicsQ(band) {
  const [w, e, parts] = pickDK(PHON[band], x => x[2].length), key = band === 3 ? 'q.phon3' : 'q.phon';
  const q = { kind: 'phonics', type: 'phon', topic: 'lit_phonics', tag: t('tag.phon'), text: t(key), word: w, emoji: e, parts, options: shuffle(parts.concat(phonDecoy(band, parts))), used: new Set(), pos: 0, cls: 'tile', key: w, noTap: true, reveal: 'always',
    steps: () => t('s.phon', { parts: parts.join(' · '), first: parts[0] }), speak: [[t(key)]] };
  q.viz = hl => `<div class="clue" aria-label="Picture clue">${e}</div><div class="slots" aria-live="polite">${parts.map((p, i) => `<span class="slot ${i < q.pos ? 'full' : ''} ${hl && i === q.pos ? 'hl' : ''}">${i < q.pos ? esc(p) : ''}</span>`).join('')}</div>`;
  return q;
}
const RH = {
  1: [['at', ['cat', 'hat', 'bat', 'mat', 'sat']], ['og', ['dog', 'log', 'frog', 'fog']], ['un', ['sun', 'run', 'fun', 'bun']], ['ig', ['pig', 'wig', 'dig', 'big']], ['ug', ['bug', 'hug', 'mug', 'rug']], ['en', ['hen', 'pen', 'ten', 'men']]],
  2: [['ake', ['cake', 'lake', 'snake', 'bake']], ['ain', ['rain', 'train', 'chain', 'brain']], ['ight', ['light', 'night', 'right', 'tight', 'fight']], ['oat', ['boat', 'coat', 'goat', 'float']], ['ook', ['book', 'cook', 'look', 'hook']], ['ell', ['bell', 'shell', 'well', 'tell']]],
  3: [['ound', ['sound', 'round', 'found', 'ground']], ['eam', ['dream', 'cream', 'team', 'steam']], ['ower', ['flower', 'tower', 'power', 'shower']], ['ore', ['more', 'store', 'shore', 'before']], ['ear', ['hear', 'near', 'clear', 'dear']], ['oice', ['voice', 'choice', 'rejoice']]]
};
function rhymeQ(band) {
  const fams = RH[band], f = pick(fams), [end, words] = f, w = pick(words), ans = pick(words.filter(x => x !== w));
  const others = shuffle(fams.filter(x => x !== f)).slice(0, OPT_N - 1).map(x => pick(x[1])), options = shuffle([ans, ...others]);
  return { kind: 'rhyme', type: 'rhyme', topic: 'lit_rhyme', tag: t('tag.rhyme'), text: t('q.rhyme', { w }), options, correct: options.indexOf(ans), cls: 'spell', key: w + ans, word: w, reveal: 'always', ansText: ans,
    steps: () => t('s.rhyme', { w, end, ans }), speak: [[t('q.rhymeSay')], [w, 'en-US'], [`${t('choices')}: ${options.join(', ')}.`, 'en-US']],
    viz: hl => `<div class="wordbig big">${hl ? `${esc(w.slice(0, w.length - end.length))}<b class="end">${end}</b>` : esc(w)}</div>` };
}
function missingQ(band) {
  const [w, e] = pickDK(WORDS[band], x => x[0].length), V = 'aeiou', C = 'bcdfghklmnprstw';
  const cand = [...w].map((c, i) => i).filter(i => band === 1 ? V.includes(w[i]) || i > 0 : i > 0 && i < w.length);
  const gi = pick(cand.length ? cand : [1]), ans = w[gi], pool = V.includes(ans) ? V : C;
  const options = shuffle([ans, ...shuffle([...pool].filter(c => c !== ans && !isWord(w.slice(0, gi) + c + w.slice(gi + 1)))).slice(0, OPT_N - 1)]);
  return { kind: 'missing', type: 'missing', topic: 'lit_missing', tag: t('tag.missing'), text: t('q.missing'), options, correct: options.indexOf(ans), cls: 'tile', key: w + gi, gi, word: w, reveal: 'never', ansText: ans,
    steps: () => t('s.missing', { w, ans }), speak: [[t('q.missing')], [w, 'en-US']],
    viz: hl => `<div class="clue" aria-label="Picture clue">${e}</div><div class="slots">${[...w].map((c, i) => `<span class="slot ${i === gi ? 'q' : 'full'} ${hl && i === gi ? 'hl' : ''}">${i === gi ? '?' : esc(c)}</span>`).join('')}</div>` };
}
const SORTS = {
  living: { set: [['living', ['🐶', '🌳', '🦋', '🐟', '🌻', '🐝', '🍄']], ['nonliving', ['🪨', '🚗', '⚽', '📱', '🧸', '🪑']]], topicKey: 'q.sort.living' },
  float: { set: [['float', ['🪵', '🍎', '🦆', '🛶', '🍊']], ['sink', ['🪨', '🔑', '🪙', '⚓', '🧱']]], topicKey: 'q.sort.float' },
  habitat: { set: [['ocean', ['🐋', '🦈', '🐙', '🐠']], ['forest', ['🦌', '🐻', '🦊', '🐿️']], ['desert', ['🐪', '🦂', '🦎']]], topicKey: 'q.sort.habitat' },
  state: { set: [['solid', ['🧊', '🪨', '🧱', '📕', '🔑']], ['liquid', ['💧', '🥛', '🧃', '🍯', '🌊']], ['gas', ['💨', '♨️', '🌬️']]], topicKey: 'q.sort.state' }
};
function sortQ(band) {
  const sets = band === 1 ? ['living', 'float', 'habitat'] : ['living', 'float', 'habitat', 'state'], key = pick(sets), S0 = SORTS[key];
  const [cat, items] = pick(S0.set), item = pick(items), options = shuffle(S0.set.map(([c]) => c)), labels = options.map(c => t('cat.' + c));
  return { kind: 'sort', type: 'sort', topic: 'stem_sort', tag: t('tag.sort'), text: t(S0.topicKey), options: labels, correct: options.indexOf(cat), cls: 'txt', key: item + key, ansText: t('cat.' + cat),
    steps: () => t('s.sort', { emoji: item, ans: t('cat.' + cat) }), speak: [[`${t(S0.topicKey)} ${t('choices')}: ${labels.join(', ')}.`]],
    viz: hl => `<div class="clue big ${hl ? 'glowp' : ''}" aria-label="Picture clue">${item}</div>` };
}
