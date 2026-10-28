/* v36: the fact engine. partD(K) turns the fact tables (facts-data.js) into questions, and adds the Bilingual boost.
   gens.fact    one non-multiple-choice question from a fact: true or false, fill the gap, odd one out, sort, tap the picture.
   gens.bi      (only when "Bilingual boost" is on) English <-> Malay words: fill, join, true or false, tap the picture.
   K.factMcq    a multiple-choice question from a fact (or a translation) that replaces a normal bank question some of the time;
                makeQ (13-events) asks for it, so these stay inside the normal multiple-choice share. */
import { SETS, VOCAB } from './facts-data.js';

export function partD(K) {
  const { C, T, sl, cap } = K, { t, L, pick, shuffle, rnd, QT } = C;
  const aAn = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
  const S = () => C.S();

  /* ---- the tables, ready to use ---- */
  const TABLE = SETS.map(s => {
    const items = s.items.map(r => ({ e: r[0], n: [r[1], r[2]], v: r[3], m: r[4] === 'm' }));
    const keys = Object.keys(s.vals), by = {}; keys.forEach(k => { by[k] = items.filter(i => i.v === k); });
    return { ...s, items, keys, by };
  });
  const setsFor = (subj, band) => TABLE.filter(s => s.subj.includes(subj) && band >= s.b[0] && band <= s.b[1]);

  /* ---- words inside the sentences ---- */
  const name = (set, it, li, up) => { let w = it.n[li]; if (li === 0 && set.art && !it.m) w = aAn(w); return up ? cap(w) : w; };
  const fmt = (tpl, set, it, li, vk) => tpl.replace(/\{(x|X|v)\}/g, (m, k) => (k === 'v' ? (vk != null ? set.vals[vk][li] : '') : name(set, it, li, k === 'X')));
  const val = (set, k, li) => set.vals[k][li];
  const bare = (it, li) => cap(it.n[li]);
  const picOf = (set, it) => set.viz || it.e;
  const KEY = (set, it, shape, more = '') => `fact:${set.id}:${it.n[0]}:${shape}${more}`;

  /* ---- 1. multiple choice (only through K.factMcq) ---- */
  function mcq(set, it, li, subj) {
    if (set.keys.length < 3 || !set.ask) return null;
    const others = shuffle(set.keys.filter(k => k !== it.v)).slice(0, 3), ans = val(set, it.v, li);
    const options = shuffle([ans, ...others.map(k => val(set, k, li))]);
    const text = fmt(set.ask[li], set, it, li, null);
    return { kind: 'bank', type: 'life', topic: subj + '_fact', tag: set.tag ? set.tag[li] : t('subj.' + subj), text, options, correct: options.indexOf(ans), cls: 'txt', key: KEY(set, it, 'mcq'), ansText: ans, customSteps: true, memSubj: subj,
      steps: () => [t('s.bank0'), t('s.bank1'), t('s.bank2'), t('s.ce3', { a: ans })], speak: [[`${text} ${t('choices')}: ${options.join('. ')}.`, K.lc(subj)]],
      viz: hl => `<div class="clue big ${hl ? 'glowp' : ''}" aria-hidden="true">${picOf(set, it)}</div>` };
  }

  /* ---- 2. true or false ---- */
  function tf(set, it, li, subj) {
    if (!set.tf) return null;
    const ok = Math.random() < .5, vk = ok || set.keys.length < 2 ? it.v : pick(set.keys.filter(k => k !== it.v));
    const s = fmt(set.tf[li], set, it, li, vk), options = [t('tf.true'), t('tf.false')], correct = ok ? 0 : 1;
    return QT.base(subj, 'tf', { text: s, options, correct, cls: 'tf', key: KEY(set, it, 'tf', ':' + (ok ? 1 : 0)), ansText: options[correct], why: ok ? '' : fmt(set.tf[li], set, it, li, it.v),
      speak: [[`${t('tf.ask')} ${s}`, K.lc(subj)]], viz: () => `<div class="clue big tfclue" aria-hidden="true">${picOf(set, it)}</div>` });
  }

  /* ---- 3. fill the gap ---- */
  function fill(set, it, li, subj, band) {
    if (!set.fill || band < 2) return null;
    const sentence = fmt(set.fill[li], set, it, li, null), parts = sentence.split('___'); if (parts.length < 2) return null;
    const ans = val(set, it.v, li), decoys = shuffle(set.keys.filter(k => k !== it.v)).slice(0, 2).map(k => val(set, k, li));
    if (decoys.length < 1) return null;
    return K.fillQ(subj, band, false, { before: parts[0].trim(), after: parts[1].trim(), ans, opts: [ans, ...decoys], em: picOf(set, it) });
  }

  /* ---- 4. odd one out ---- */
  function odd(set, it, li, subj) {
    if (!set.odd || set.plain) return null;
    const fullKeys = set.keys.filter(k => set.by[k].length >= 3); if (!fullKeys.length) return null;
    const vk = pick(fullKeys), three = shuffle(set.by[vk]).slice(0, 3), xs = set.items.filter(i => i.v !== vk && !three.some(y => y.e === i.e)); if (!xs.length) return null;
    const x = pick(xs), all = shuffle([...three, x]), label = i => `${i.e} ${bare(i, li)}`, options = all.map(label);
    if (new Set(options).size < 4) return null;
    const text = set.odd[li].replace('{v}', val(set, vk, li));
    return QT.base(subj, 'odd', { text, options, correct: options.indexOf(label(x)), cls: 'odd', key: KEY(set, x, 'odd', ':' + three.map(i => i.n[0]).sort().join(',')), ansText: label(x), why: fmt(set.tf[li], set, x, li, x.v),
      speak: [[`${text} ${all.map(i => i.n[li]).join(', ')}.`, K.lc(subj)]], viz: () => `<div class="clue big" aria-hidden="true">🧩</div>` });
  }

  /* ---- 5. sort into boxes ---- */
  function sort(set, it, li, subj, band) {
    if (set.plain) return null;
    const many = set.keys.filter(k => set.by[k].length >= 3), two = set.keys.filter(k => set.by[k].length >= 2);
    const hard = band >= 3 && many.length >= 2, pool = hard ? many : two; if (pool.length < 2) return null;
    const ks = shuffle(pool).slice(0, hard && pool.length >= 3 && band >= 4 ? 3 : 2);
    const boxes = ks.map(k => ({ label: [set.vals[k][2], set.vals[k][3]], items: set.by[k].map(i => [i.e, i.n[0], i.n[1]]) }));
    return K.bucketQ(subj, band, false, { boxes, per: hard ? (ks.length === 3 ? 2 : 3) : 2 });
  }

  /* ---- 6. tap the picture ---- */
  function pic(set, it, li, subj) {
    if (!set.pic || set.nopic) return null;
    const bad = shuffle(set.items.filter(i => i.v !== it.v && i.e !== it.e)).filter((i, k, a) => a.findIndex(y => y.e === i.e) === k).slice(0, 2); if (bad.length < 2) return null;
    const opts = shuffle([it, ...bad]), options = opts.map(i => i.e), text = set.pic[li].replace('{v}', val(set, it.v, li)), correct = opts.indexOf(it);
    return { kind: 'bank', type: 'life', topic: subj + '_fact', tag: set.tag ? set.tag[li] : t('subj.' + subj), text, options, correct, cls: '', key: KEY(set, it, 'pic', ':' + opts.map(i => i.e).sort().join('')), ansText: `${it.e} ${bare(it, li)}`, customSteps: true, memSubj: subj,
      steps: () => [t('s.bank0'), t('s.bank1'), t('s.bank2'), t('s.ce3', { a: `${it.e} ${bare(it, li)}` })], speak: [[`${text} ${opts.map(i => i.n[li]).join(', ')}.`, K.lc(subj)]], viz: () => `<div class="clue big" aria-hidden="true">👆</div>` };
  }

  const SHAPES = { tf, fill, odd, sort, pic };
  const SHAPE_W = (band) => [['tf', 3], ['fill', band >= 2 ? 3 : 0], ['odd', 2], ['sort', 2], ['pic', band <= 3 ? 3 : 1]].filter(x => x[1] > 0);
  function factQ(subj, band) {
    const sets = setsFor(subj, band); if (!sets.length) return null;
    const li = sl(subj);
    for (let tries = 0; tries < 10; tries++) {
      const set = pick(sets), it = pick(set.items), ws = shuffle(SHAPE_W(band)), tot = ws.reduce((a, [, n]) => a + n, 0);
      let x = Math.random() * tot, kind = ws[0][0]; for (const [k, n] of ws) { if ((x -= n) < 0) { kind = k; break; } }
      const q = SHAPES[kind](set, it, li, subj, band); if (q) return q;
    }
    return null;
  }

  /* ---- the Bilingual boost: words in both languages ---- */
  let ALLV = null;
  const allWords = () => ALLV || (ALLV = (() => {
    const out = [], seen = new Set(), add = (e, en, ms, g) => { const k = en.toLowerCase(); if (en.split(' ').length > 2 || ms.split(' ').length > 3 || seen.has(k) || en.toLowerCase() === ms.toLowerCase()) return; seen.add(k); out.push({ e, en, ms, g }); };
    TABLE.filter(s => !s.nov).forEach(s => s.items.forEach(i => { if (i.n[0] !== 'face') add(i.e, i.n[0], i.n[1], s.id); }));
    ['fruit', 'animal', 'vehicle', 'school', 'clothes', 'sky', 'instrument', 'body'].forEach(g => (QT.G[g] || []).forEach(r => add(r[0], r[1], r[2], 'g:' + g)));
    VOCAB.forEach(r => add(r[0], r[1], r[2], 'v'));
    return out;
  })());
  const wordPool = subj => { const mine = TABLE.filter(s => s.subj.includes(subj) && !s.nov).flatMap(s => s.items.map(i => i.n[0])), all = allWords(), m = all.filter(w => mine.includes(w.en)); return m.length >= 8 ? m : all; };
  function biPick(subj) {
    const pool = wordPool(subj), w = pick(pool), dir = Math.random() < .5 ? 0 : 1;   // dir 0: English word, find the Malay. dir 1: Malay word, find the English.
    const src = dir ? w.ms : w.en, tgt = dir ? w.en : w.ms;
    const same = shuffle(pool.filter(x => x.en !== w.en && x.g === w.g)), rest = shuffle(allWords().filter(x => x.en !== w.en && x.g !== w.g));
    const bad = [...same, ...rest].filter((x, i, a) => a.findIndex(y => (dir ? y.en : y.ms) === (dir ? x.en : x.ms)) === i);
    return { w, dir, src, tgt, bad, tOf: x => (dir ? x.en : x.ms), sOf: x => (dir ? x.ms : x.en), lang: dir ? T('English', 'bahasa Inggeris') : T('Malay', 'bahasa Melayu'), langTag: dir ? 'en-US' : 'ms-MY' };
  }
  const biTag = () => T('🔤 Two languages', '🔤 Dua bahasa');
  function biMcq(subj) {
    const b = biPick(subj), opts = shuffle([b.tgt, ...b.bad.slice(0, 3).map(b.tOf)]), text = T(`What is “${b.src}” in ${b.lang}?`, `Apakah “${b.src}” dalam ${b.lang}?`);
    return { kind: 'bank', type: 'life', topic: subj + '_fact', tag: biTag(), text, options: opts, correct: opts.indexOf(b.tgt), cls: 'txt', key: `bi:${b.dir}:${b.w.en}:mcq`, ansText: b.tgt, customSteps: true, memSubj: subj,
      steps: () => [t('s.bank0'), t('s.bank1'), t('s.bank2'), t('s.ce3', { a: b.tgt })], speak: [[text, K.lc(subj)], [b.src, b.dir ? 'ms-MY' : 'en-US'], [`${t('choices')}: ${opts.join('. ')}.`, b.langTag]], viz: hl => `<div class="clue big ${hl ? 'glowp' : ''}" aria-hidden="true">${b.w.e}</div>` };
  }
  function biFill(subj, band) {
    const b = biPick(subj), opts = [b.tgt, ...b.bad.slice(0, 2).map(b.tOf)];
    return K.fillQ(subj, band, false, { before: T(`In ${b.lang}, “${b.src}” is`, `Dalam ${b.lang}, “${b.src}” ialah`), after: '', ans: b.tgt, opts, em: b.w.e, text: T('Drag the right word into the gap.', 'Seret perkataan yang betul ke tempat kosong.') });
  }
  function biMatch(subj, band, small) {
    const dir = Math.random() < .5 ? 0 : 1, n = small || band <= 2 ? 3 : 4, pool = wordPool(subj), ws = shuffle(pool).slice(0, n);
    const pairs = ws.map(w => [cap(dir ? w.ms : w.en), cap(dir ? w.en : w.ms)]);
    if (new Set(pairs.map(p => p[0])).size < n || new Set(pairs.map(p => p[1])).size < n) return null;
    const text = dir ? T('Join each Malay word to its English word.', 'Padankan setiap perkataan Melayu dengan perkataan Inggerisnya.') : T('Join each English word to its Malay word.', 'Padankan setiap perkataan Inggeris dengan perkataan Melayunya.');
    return QT.base(subj, 'match', { text, pairs, right: shuffle(pairs.map((p, i) => i)), done: new Set(), options: pairs.map(p => p[0]), correct: -1, key: 'bi:match:' + pairs.map(p => p[0]).sort().join('|'), ansText: pairs.map(p => `${p[0]} – ${p[1]}`).join(', '),
      speak: [[`${text} ${pairs.map(p => p[0]).join(', ')}.`, K.lc(subj)]], viz: () => `<div class="clue big" aria-hidden="true">🔤</div>` });
  }
  function biTf(subj) {
    const b = biPick(subj), ok = Math.random() < .5, shown = ok ? b.tgt : b.tOf(b.bad[0]), options = [t('tf.true'), t('tf.false')];
    const s = T(`“${b.src}” means “${shown}” in ${b.lang}.`, `“${b.src}” bermaksud “${shown}” dalam ${b.lang}.`);
    return QT.base(subj, 'tf', { text: s, options, correct: ok ? 0 : 1, cls: 'tf', key: `bi:${b.dir}:${b.w.en}:tf:${ok ? 1 : 0}`, ansText: options[ok ? 0 : 1], why: ok ? '' : T(`“${b.src}” means “${b.tgt}”.`, `“${b.src}” bermaksud “${b.tgt}”.`),
      speak: [[`${t('tf.ask')} ${s}`, K.lc(subj)]], viz: () => `<div class="clue big tfclue" aria-hidden="true">${b.w.e}</div>` });
  }
  function biPic(subj) {
    const b = biPick(subj), others = b.bad.filter(x => x.e !== b.w.e).filter((x, i, a) => a.findIndex(y => y.e === x.e) === i).slice(0, 2); if (others.length < 2) return null;
    const opts = shuffle([b.w, ...others]), word = b.tgt, text = T(`Tap the picture for “${word}”.`, `Sentuh gambar untuk “${word}”.`);
    const shownWord = word;   // the word the child reads and hears: the picture is the meaning
    return { kind: 'bank', type: 'life', topic: subj + '_fact', tag: biTag(), text, options: opts.map(x => x.e), correct: opts.indexOf(b.w), cls: '', key: `bi:pic:${b.dir}:${b.w.en}:${opts.map(x => x.e).sort().join('')}`, ansText: `${b.w.e} ${shownWord}`, customSteps: true, memSubj: subj,
      steps: () => [t('s.bank0'), t('s.bank1'), t('s.bank2'), t('s.ce3', { a: `${b.w.e} ${shownWord}` })], speak: [[T('Tap the picture for', 'Sentuh gambar untuk'), K.lc(subj)], [shownWord, b.langTag]], viz: () => `<div class="clue big" aria-hidden="true">👆</div>` };
  }
  const BI = { fill: biFill, match: biMatch, tf: biTf, pic: biPic };
  function biQ(subj, band, small) {
    if (!S().bilingual) return null;
    const ws = [['match', 3], ['pic', band <= 2 ? 4 : 2], ['tf', 2], ['fill', band >= 2 ? 3 : 0]].filter(x => x[1] > 0), tot = ws.reduce((a, [, n]) => a + n, 0);
    let x = Math.random() * tot, kind = ws[0][0]; for (const [k, n] of ws) { if ((x -= n) < 0) { kind = k; break; } }
    return BI[kind](subj, band, small) || biTf(subj);
  }

  /* ---- multiple choice from facts and translations (called by makeQ for bank entries) ---- */
  K.factMcq = (subj, band) => {
    const bi = !!S().bilingual && (subj === 'bm' || subj === 'en' ? Math.random() < .3 : Math.random() < .1);
    if (bi) { try { return biMcq(subj); } catch (e) { return null; } }
    const sets = setsFor(subj, band).filter(s => s.keys.length >= 3 && s.ask); if (!sets.length || Math.random() > .22) return null;
    const set = pick(sets); return mcq(set, pick(set.items), sl(subj), subj);
  };

  K.gens.fact = factQ; K.gens.bi = biQ;
  K.weights.fact = (s, b) => (setsFor(s, b).length ? 4 : 0);
  K.weights.bi = (s, b, small) => (S().bilingual ? (s === 'bm' || s === 'en' ? 7 : 2) : 0);
  K.FACTS = { TABLE, setsFor, mcq, tf, fill, odd, sort, pic, factQ, biQ, biMcq, allWords, SHAPES, BI };
}
