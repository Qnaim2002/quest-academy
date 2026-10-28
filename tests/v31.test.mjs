/* Tests for v31: hooks instead of replaced functions, crash log, question generators, bank linter, small-letter
   tracing, mistake review, parent code recovery, vibration, lessons and stories split by age. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';
import { lintBank } from '../scripts/lint-bank.mjs';

const { game: G, ctx } = await loadGame({ lang: 'en', band: 3 });
const J = (s) => G.ev(`JSON.parse(JSON.stringify(${s}))`);
const PARTS = readdirSync(new URL('../src/parts/', import.meta.url)).filter((f) => f.endsWith('.js') && f !== '10c-flashcards.js').sort();
const SRC = Object.fromEntries(PARTS.map((f) => [f, readFileSync(new URL('../src/parts/' + f, import.meta.url), 'utf8')]));

/* ---------------- 6. question generators ---------------- */
test('every math question has its answer among 4 different options (every age and family, 300 tries each)', () => {
  for (const band of [1, 2, 3]) for (const fam of ['pw', 'cmp', 'units', 'frac']) for (let i = 0; i < 300; i++) {
    if (fam === 'frac' && band === 1) continue;
    const q = G.mathQ(band, fam), o = q.options.map(String);
    assert.ok(q.correct >= 0 && q.correct < o.length, `${band} ${fam}: "${q.text}" answer not in ${o.join('|')}`);
    assert.equal(o[q.correct], String(q.ansText), `${band} ${fam}: the marked option is the answer`);
    assert.equal(new Set(o).size, o.length, `${band} ${fam}: repeated option in ${o.join('|')}`);
    assert.equal(o.length, 4, `${band} ${fam}: 4 options`);
    o.forEach((x) => assert.ok(!/^-|NaN|undefined/.test(x), `${band} ${fam}: odd option ${x}`));
  }
});
test('every question-bank row (written and generated) shows 4 different choices with the answer among them, in both languages', () => {
  let n = 0;
  for (const lang of ['en', 'ms']) {
    G.setLang(lang);
    for (const subj of Object.keys(G.BANK)) for (const band of Object.keys(G.BANK[subj])) G.BANK[subj][band].forEach((r, i) => {
      for (let k = 0; k < 2; k++) {
        const q = G.bankQ(subj, +band, null, new Set([r])), o = q.options.map(String);
        assert.equal(o.length, 4, `${lang} ${subj} bank ${band} #${i + 1}: ${o.join(' | ')}`);
        assert.equal(new Set(o).size, 4, `${lang} ${subj} bank ${band} #${i + 1} repeats: ${o.join(' | ')}`);
        assert.equal(o[q.correct], String(q.ansText), `${lang} ${subj} bank ${band} #${i + 1}: answer marked`);
        n++;
      }
    });
  }
  G.setLang('en');
  assert.ok(n > 4000, `${n} questions built`);
});
test('warm/cool colours and high/low sounds are now four-choice questions', () => {
  const rows = [...G.BANK.sv[2], ...G.BANK.mz[2]].filter((r) => r.grp === 'temp' || r.grp === 'pitch');
  assert.equal(rows.length, 12);
  rows.forEach((r) => { assert.equal(r.w[0].length, 3); assert.equal(r.w[1].length, 3); assert.ok(!r.w[0].includes(r.a[0])); });
});

/* ---------------- 7. bank linter ---------------- */
test('the bank linter passes on the real banks and catches the mistakes it is meant to catch', () => {
  const real = lintBank(G);
  assert.equal(real.errors.length, 0, JSON.stringify(real.errors.slice(0, 5)));
  const rows = G.BANK.bm[1], keep = rows.length;
  rows.push({ topic: 'kata', grp: 'zz1', em: '🧪', q: ['Test one?', 'Ujian satu?'], a: ['Yes', 'Ya'], w: [['No', 'No ', 'Maybe'], ['Tidak', 'Tidak']] });
  rows.push({ topic: 'kata', grp: 'zz2', em: '🧪', q: ['Test two?', ''], a: ['Cat', 'Kucing'], w: [['Dog', 'Cat', 'Hen'], ['Anjing', 'Kucing', 'Ayam']] });
  try {
    const kinds = new Set(lintBank(G).errors.map(([k]) => k));
    for (const k of ['duplicate-wrong', 'answer-is-wrong', 'missing-bm', 'bm-length', 'not-4-choices']) assert.ok(kinds.has(k), k);
  } finally { rows.length = keep; }
});

/* ---------------- 5. hooks ---------------- */
test('no part replaces a function any more: every extension goes through HOOK', () => {
  for (const [f, s] of Object.entries(SRC)) {
    assert.ok(!/^\s*const\s+_\w+\s*=\s*[A-Za-z_]\w*\s*;\s*$/m.test(s), `${f} keeps a copy of a function to wrap it`);
    assert.ok(!/^[A-Za-z_]\w*\s*=\s*(async\s+)?function\b/m.test(s), `${f} assigns a new function to an old name`);
  }
  const L = J('HOOK.list()');
  for (const [name, min] of [['startBattle', 5], ['win', 4], ['famEvent', 6], ['renderParent', 3], ['renderComic', 3], ['nextQuestion', 2], ['wrongPick', 2], ['heroKO', 3], ['answer:wrong', 2], ['answer:right', 1]]) assert.ok((L[name] || 0) >= min, `${name}: ${L[name]} hooks`);
});
test('HOOK keeps the old wrapping order and keeps going when an extra breaks', () => {
  const out = G.ev(`(() => {
    const log = [];
    const core = x => { log.push('core ' + x); return x * 2; };
    HOOK.before('t31', () => log.push('before A')); HOOK.on('t31', (x, r) => log.push('after A ' + r));
    HOOK.before('t31', () => log.push('before B')); HOOK.on('t31', () => { throw new Error('broken extra'); });
    HOOK.filter('t31', v => v + 1); HOOK.claim('t31', x => x === 9 ? 'claimed' : undefined);
    const r1 = HOOK.call('t31', core, [3]), r2 = HOOK.call('t31', core, [9]);
    return { log, r1, r2, crash: CRASH.list().some(c => c.msg === 'broken extra' && c.where === 'hook t31') };
  })()`);
  assert.equal(JSON.stringify(out.log), JSON.stringify(['before B', 'before A', 'core 3', 'after A 6']));
  assert.equal(out.r1, 7); assert.equal(out.r2, 'claimed');
  assert.ok(out.crash, 'the broken extra went to the crash log');
});

/* ---------------- 9. crash log ---------------- */
test('crash log: the same problem is counted once, at most 30 are kept, and it can be cleared', () => {
  G.ev('CRASH.clear()');
  G.ev("CRASH.add(new Error('Boom'), 'x.js:1'); CRASH.add(new Error('Boom'), 'x.js:1'); CRASH.add('plain text problem', 'promise')");
  const L = J('CRASH.list()');
  assert.equal(L.length, 2); assert.equal(L[0].n, 2); assert.equal(L[0].msg, 'Boom'); assert.equal(G.ev('CRASH.count()'), 3);
  for (let i = 0; i < 40; i++) G.ev(`CRASH.add(new Error('p${i}'), 'loop')`);
  assert.equal(G.ev('CRASH.size()'), 30);
  assert.ok(G.ev("localStorage.getItem('quest-academy-crashlog').length") > 100, 'kept in local storage only');
  G.ev('CRASH.clear()'); assert.equal(G.ev('CRASH.size()'), 0);
});

/* ---------------- 1. small letters ---------------- */
test('tracing: every small letter has a guide, a careful trace passes and a scribble or a missing stroke does not', () => {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  for (const g of lower) {
    assert.ok(G.ev(`GLYPHS['${g}'].length >= 1`), g);
    const good = G.ev(`traceScore('${g}', GLYPHS['${g}'].map(s => s.map(p => [p[0] + 2, p[1] - 1])))`);
    assert.ok(good.ok, `${g} traced: ${JSON.stringify(good)}`);
    assert.ok(!G.ev(`traceScore('${g}', [[[5, 2], [95, 2], [95, 6], [5, 6]]]).ok`), `${g} scribble`);
    G.ev(`GLYPHS['${g}'].flat().forEach(([x, y]) => { if (x < 0 || x > 100 || y < 0 || y > 100) throw new Error('${g} outside the pad'); })`);
  }
  for (const g of ['i', 'j', 't', 'f', 'A', 'E', 'k']) assert.ok(!G.ev(`traceScore('${g}', GLYPHS['${g}'].slice(0, -1))`).ok, `${g} with its last stroke left out`);
  assert.deepEqual(J("traceChars('abc').slice(0, 3)"), ['a', 'b', 'c']);
  assert.match(G.ev("traceSay('b')"), /small letter b/);
  const seen = new Set(); for (let i = 0; i < 300; i++) seen.add(G.ev("traceQ('en').glyph"));
  assert.ok([...seen].some((c) => /[a-z]/.test(c)) && [...seen].some((c) => /[A-Z]/.test(c)), 'battles ask for capitals and small letters');
});

/* ---------------- 2. mistake review ---------------- */
test('mistake review: wrong answers in a battle are kept and each gets a reason', () => {
  const r = G.ev(`(() => {
    startBattle('math:1'); B.misses = [];
    const q = mathQ(2, 'pw'); nextQuestion(q);
    const w = q.options.findIndex((o, i) => i !== q.correct); wrongPick(w);
    const tf = QT.tfQ('math', 2); nextQuestion(tf); wrongPick(1 - tf.correct);
    const L = mistakeList(); leaveBattle(); return { n: L.length, first: L[0], picks: L[0].picks.length, btn: mxButtonHTML() };
  })()`);
  assert.equal(r.n, 2); assert.equal(r.picks, 1);
  assert.ok(r.first.why.length > 10, r.first.why); assert.ok(r.first.ans);
  assert.match(r.btn, /mxOpen/);
  const why = G.ev('whyWrong'), q = G.mathQ(2, 'pw'), a = +q.ansText;
  assert.match(why(q, String(a + 1)), /1 too many/);
  const ar = G.ev('mxArith')(q); if (q.type === 'pw_part') assert.match(why(q, String(ar.a + ar.b)), /add/);
  const fr = G.ev("(() => { for (;;) { const q = mathQ(3, 'frac'); if (q.type === 'frac_name') return q; } })()"), [k, n] = fr.ansText.split('/').map(Number);
  assert.match(why(fr, `${n - k}/${n}`), /NOT shaded/);
  const bq = G.bankQ('bm', 1, 'kata'), wrong = bq.options.find((o, i) => i !== bq.correct);
  assert.ok(why(bq, wrong).length > 5);
  G.setLang('ms'); assert.match(why(q, String(a + 1)), /lebih 1/); G.setLang('en');
});

/* ---------------- 3. parent code recovery ---------------- */
test('parent code recovery: the answer is stored hashed, matches loosely, and a right answer resets the code without erasing anything', async () => {
  await G.ev("pinSet('123456')");
  assert.equal(await G.ev("recSave('pet', '', '  Mr.  WHISKERS ')"), true);
  const rec = J('DEV.rec');
  assert.equal(rec.q, 'pet'); assert.ok(rec.h && rec.s && !JSON.stringify(rec).toLowerCase().includes('whisker'), 'only a hash is kept');
  assert.equal(await G.ev("recCheck('mr whiskers')"), true);
  assert.equal(await G.ev("recCheck('Mr Whisker')"), false);
  assert.equal(await G.ev("recSave('custom', '', 'abc')"), false, 'a custom question needs its text');
  assert.equal(await G.ev("recSave('pet', '', 'a')"), false, 'too short');
  G.S().coins = 4321;
  G.ev("gate.unlocked = false; gate.mode = 'recover'; gate.recFails = 0");
  await G.ev("recTry('wrong guess')"); assert.equal(G.ev('gate.mode'), 'recover'); assert.equal(G.ev('gate.recFails'), 1);
  await G.ev("recTry('MR WHISKERS')");
  assert.equal(G.ev('gate.mode'), 'reset1', 'the right answer asks for a new code');
  assert.equal(G.S().coins, 4321, 'nothing was erased');
  G.ev("gate.mode = 'enter'; DEV.rec = null; DEV.recUntil = 0");
});

/* ---------------- 4. vibration ---------------- */
test('vibration: right, wrong and finisher patterns, off in calm mode and with the parent switch', () => {
  const calls = []; ctx.navigator.vibrate = (p) => { calls.push(p); return true; };
  G.S().sensory = false; G.S().haptics = true;
  G.ev("HOOK.emit('answer:right', null); HOOK.emit('answer:wrong', null, 0); haptic('finisher')");
  assert.equal(JSON.stringify(calls), '[22,[60,50,60],[30,40,30,40,160]]');
  G.S().sensory = true; G.ev("haptic('right')"); G.S().sensory = false;
  G.S().haptics = false; G.ev("haptic('right')"); G.S().haptics = true;
  assert.equal(calls.length, 3);
  delete ctx.navigator.vibrate; assert.equal(G.ev("haptic('right')"), false, 'no vibration on devices without it');
});

/* ---------------- 8. lessons and stories split by age ---------------- */
test('lesson text: one file per subject and age; every lesson sits in the file of its youngest age, exactly once', async () => {
  const dir = new URL('../src/content/lessons/', import.meta.url), where = {};
  for (const subj of readdirSync(dir).filter((d) => !d.endsWith('.js'))) for (const f of readdirSync(new URL(subj + '/', dir))) {
    const mod = await import(new URL(subj + '/' + f, dir)), b = +f.match(/^b(\d)\.js$/)[1];
    for (const id of Object.keys(mod.default)) { assert.ok(!where[id], `${id} is in two files`); where[id] = [subj, b]; }
  }
  for (const m of G.MODULES) {
    assert.ok(where[m.id], `${m.id} has text`);
    assert.deepEqual(where[m.id], [m.subject, Math.min(...m.bands)], `${m.id} file`);
  }
});
test('a subject opened at one age loads only that age\'s lesson files', async () => {
  const { game: G2 } = await loadGame({ lang: 'en', band: 1 });
  await G2.ev("ensureLessonsBand('math', 1)");
  assert.equal(G2.ev("JSON.stringify(Object.keys(LESSON_P).sort())"), '["math/b1"]');
  assert.ok(G2.ev("MODULES.filter(m => m.subject === 'math' && m.bands.includes(1)).every(m => m.body && m.body.length)"));
  await G2.ev("ensureLesson(MODULES.find(m => m.id === 'm_round'))");
  assert.ok(G2.ev("MODULES.find(m => m.id === 'm_round').body.length > 0"));
});
test('stories: each age\'s cutscene script is its own chunk, loaded on demand', async () => {
  const src = readFileSync(new URL('../src/content/cutscenes.js', import.meta.url), 'utf8');
  for (const b of [1, 2, 3, 4]) assert.match(src, new RegExp(`import\\('\\./cutscenes/b${b}\\.js'\\)`));
  assert.ok(!/^import B\d/m.test(src), 'no static imports');
  for (const b of [1, 2, 3, 4]) assert.ok(G.ev(`CUTS[${b}] && CUTS[${b}][0] && CUTS[${b}][0].c.length > 5`), `age band ${b}`);
  assert.ok(G.ev("HOOK.has('openComic')"));
});

/* ---------------- 11. smooth stories ---------------- */
test('stories: particles, rays and foreground shapes are in an HTML layer, and lines are typed by words', () => {
  G.S().pixel = true; G.S().sensory = false;
  G.ev("UI.comic = { z: 0, i: 1, subj: 'math', mode: 'chapter' }");
  const html = G.ev("cineScene(0, 0, 'math', false, 'chapter')");
  const svg = html.slice(0, html.indexOf('</svg>'));
  assert.ok(/class="cn-world"/.test(svg));
  assert.ok(!/cn-fall|cn-rise|cn-ember|cn-rays|cn-fg"/.test(svg), 'no ambient loops left inside the picture');
  assert.match(html, /<div class="cn-fxl"/); assert.match(html, /class="fxp /); assert.match(html, /class="cn-fgs"/);
  assert.ok(!html.includes('__PAR__'));
  const dlg = G.ev("cineDialog(UI.comic, 'One two three four')");
  assert.equal((dlg.match(/class="w"/g) || []).length, 4); assert.ok(!/<i style="--c/.test(dlg), 'no element per letter');
  G.ev('UI.comic = null');
});
test('the story memo works the script out once per story', () => {
  G.ev("UI.comic = { z: 1, i: 1, subj: 'math', mode: 'chapter' }; CUT_MEMO.clear()");
  const a = G.ev("cutBeats(1, 'math', 'chapter')"), b = G.ev("cutBeats(1, 'math', 'chapter')");
  assert.ok(a && a === b, 'same object the second time');
  G.ev('UI.comic = null');
});
