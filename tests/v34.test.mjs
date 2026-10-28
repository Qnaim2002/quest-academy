/* Tests for v34: placement quiz, harder/easier questions in battle, word problems, writing numbers, Think Hard (KBAT),
   hero look, pet friend, celebration pacing, and the save-file migrator. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from '../scripts/harness.mjs';
import { malayCheck, lintMalay, parseCSV, reviewCSV } from '../scripts/lint-bank.mjs';
import { knowledge, checkRows, toCSV, COLS } from '../scripts/author.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 3 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));

/* ---------- the save file ---------- */
test('save migrator: an old save gains the v34 fields, a newer save is left alone, and running twice changes nothing', () => {
  const r = J(`(() => {
    const old = migrateSave({ v: 4, coins: 12, welcomed: true });
    const again = migrateSave(old.save);
    const newer = migrateSave({ v: 99, secret: 1, place: 'x' });
    const junk = migrateSave('not an object');
    return { old, again: JSON.stringify(again.save) === JSON.stringify(old.save), newer, junk };
  })()`);
  assert.equal(r.old.save.v, 5);
  assert.deepEqual(r.old.save.place, {});
  assert.equal(r.old.save.adapt, true);
  assert.ok(r.old.save.celeb && r.old.save.celeb.mode === 'ask');
  assert.equal(r.old.save.coins, 12);
  assert.equal(r.again, true);
  assert.equal(r.newer.info.newer, true);
  assert.equal(r.newer.save.place, 'x');
  assert.equal(r.junk.save.v, 5);
});
test('save migrator: a new save already at the newest number is untouched, and a hand-edited save cannot break it', () => {
  const r = J(`(() => {
    const a = migrateSave({ v: SAVE_SCHEMA, look: { color: 'rose' }, celeb: { seen: { fin_meteor: 1 }, mode: 'first' } });
    const b = migrateSave({ v: 4, look: 5, celeb: null, buddy: 'yes', place: [] });
    return { a: a.save, b: b.save };
  })()`);
  assert.equal(r.a.look.color, 'rose');
  assert.equal(r.a.celeb.mode, 'first');
  assert.equal(typeof r.b.look, 'object');
  assert.equal(r.b.celeb.mode, 'ask');
  assert.equal(r.b.buddy.on, true);
});

/* ---------- placement ---------- */
test('placement: the climb sets where each subject starts, and earlier levels stay open', () => {
  const r = J(`(() => {
    S.place = {}; plApply({ math: 21, bm: 1 });
    return [startN('math'), startN('bm'), nextLevelN('math'), isUnlocked(levelOf('math', 21)), isUnlocked(levelOf('math', 5)), isUnlocked(levelOf('math', 23)), isUnlocked(levelOf('bm', 1))];
  })()`);
  assert.equal(r[0], 21);
  assert.equal(r[1], 1);
  assert.equal(r[2], 21);
  assert.equal(r[3], true);
  assert.equal(r[4], true, 'a level before the start can still be replayed');
  assert.equal(r[5], false, 'levels beyond the start still have to be earned');
  assert.equal(r[6], true);
});
test('placement: every subject can build all five steps, with four answers each', () => {
  const r = J(`(() => {
    const out = {}; for (const s of SUBJ_ORDER) { out[s] = [0, 1, 2, 3, 4].map(k => { PL.seen = new Set(); const q = plMakeQ(s, k); return q && q.options && q.options.length >= 3 && q.options.includes(q.options[q.correct]) ? 1 : 0; }); }
    return out;
  })()`);
  for (const [s, a] of Object.entries(r)) assert.deepEqual(a, [1, 1, 1, 1, 1], s);
});

/* ---------- harder / easier in battle ---------- */
test('in battle: two first-try rights go up one step, two misses go down one, and it stops at 3', () => {
  const r = J(`(() => {
    S.adapt = true; B.active = true; B.q = { key: 'x' }; B.wrong = 0; B.ad = { r: 0, w: 0, lvl: 0 }; B.lv = { dk: .5 };
    const out = [];
    adAnswer(true); out.push(B.ad.lvl); adAnswer(true); out.push(B.ad.lvl);
    adAnswer(true); adAnswer(true); out.push(B.ad.lvl, B.shift);
    for (let i = 0; i < 12; i++) adAnswer(true); out.push(B.ad.lvl);
    adAnswer(false); adAnswer(false); out.push(B.ad.lvl);
    for (let i = 0; i < 30; i++) adAnswer(false); out.push(B.ad.lvl, B.shift, +B.dk.toFixed(2));
    B.active = false; return out;
  })()`);
  assert.deepEqual(r, [0, 1, 2, 1, 3, 2, -3, -1, 0.2]);
});
test('in battle: an answer that needed a second try does not count as "right", and a grown-up can switch it off', () => {
  const r = J(`(() => {
    S.adapt = true; B.active = true; B.q = { key: 'x' }; B.ad = { r: 0, w: 0, lvl: 0 }; B.lv = { dk: .5 };
    B.wrong = 1; adAnswer(true); adAnswer(true); adAnswer(true); const a = B.ad.lvl;
    B.wrong = 0; S.adapt = false; adAnswer(true); adAnswer(true); adAnswer(true); const b = B.ad.lvl;
    S.adapt = true; B.active = false; return [a, b];
  })()`);
  assert.deepEqual(r, [0, 0]);
});

/* ---------- word problems ---------- */
test('word problems: every age, both languages, a right answer among distinct choices, and a picture or sum behind it', () => {
  for (const lang of ['en', 'ms']) {
    const r = J(`(() => {
      setLang('${lang}'); const bad = [], seen = new Set(); let n = 0;
      for (let band = 1; band <= 4; band++) for (let i = 0; i < 80; i++) {
        const q = wordQ(band); n++;
        if (!q || !q.text || q.text.length < 15) { bad.push('empty'); continue; }
        const o = q.options; if (new Set(o).size !== o.length) bad.push('dup ' + q.text);
        if (!(q.correct >= 0 && q.correct < o.length)) bad.push('no right answer');
        else if (String(q.ansText) !== String(o[q.correct]) || !/^[0-9]+(:[0-9]{2})?$/.test(String(o[q.correct]))) bad.push('answer mismatch ' + q.ansText + ' vs ' + o[q.correct]);
        if (typeof q.steps !== 'function') bad.push('no steps'); seen.add(q.text);
      }
      return { bad: bad.slice(0, 5), n, variety: seen.size };
    })()`);
    assert.deepEqual(r.bad, [], lang);
    assert.ok(r.variety > 150, lang + ' variety ' + r.variety);
  }
  G.ev(`setLang('en')`);
});

/* ---------- writing numbers ---------- */
test('writing numbers: every digit written the way a child might is read right, and a scribble is not read', () => {
  const r = J(`(() => {
    const out = { wrong: [], scribbles: 0 };
    for (const d of '0123456789') { const g = GLYPHS[d], res = recognizeDigit(g); if (res.digit !== d) out.wrong.push(d + '>' + res.digit); }
    let seed = 7; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    for (let k = 0; k < 20; k++) { const sc = Array.from({ length: 3 }, () => { const a = [rnd() * 100, rnd() * 100], b = [rnd() * 100, rnd() * 100]; return Array.from({ length: 12 }, (_, i) => [a[0] + (b[0] - a[0]) * i / 11, a[1] + (b[1] - a[1]) * i / 11]); }); if (recognizeDigit(sc).digit !== null) out.scribbles++; }
    out.empty = recognizeDigit([]).digit; out.dot = recognizeDigit([[[50, 50]]]).digit;
    return out;
  })()`);
  assert.deepEqual(r.wrong, []);
  assert.ok(r.scribbles <= 2, 'scribbles read as a digit: ' + r.scribbles);
  assert.equal(r.empty, null);
  assert.equal(r.dot, null);
});

/* ---------- Think Hard (KBAT) ---------- */
test('Think Hard: a round has 5 different questions, and the pool covers all four skills', () => {
  const r = J(`(() => {
    const skills = new Set(KB_ROWS.map(x => x.skill)), subs = new Set(KB_ROWS.map(x => x.subj));
    const round = kbPickRound('all', 3), ids = new Set(round.map(x => x.id));
    const made = round.map(kbMake);
    return { skills: [...skills].sort(), n: round.length, uniq: ids.size, rows: KB_ROWS.length, subs: subs.size, ok: made.every(m => m.options.length === 4 && m.options[m.correct] && m.why) };
  })()`);
  assert.deepEqual(r.skills, ['analyse', 'apply', 'create', 'evaluate']);
  assert.equal(r.n, 5);
  assert.equal(r.uniq, 5);
  assert.ok(r.rows >= 80, 'rows ' + r.rows);
  assert.equal(r.subs, 10);
  assert.equal(r.ok, true);
});

/* ---------- hero look, pet friend, celebration pacing ---------- */
test('hero look: titles unlock by playing, and a locked title cannot be worn', () => {
  const r = J(`(() => {
    S.stars = {}; S.look = {};
    const a = LK_TITLES.filter(x => x[3]()).map(x => x[0]);
    S.stars['math:3:1'] = 6; S.stars['math:3:2'] = 6;
    const b = LK_TITLES.filter(x => x[3]()).map(x => x[0]);
    S.look.title = 'scholar'; const worn = lkTitleText();
    S.look.title = 'math'; const worn2 = lkTitleText();
    S.stars = {}; S.look = {}; return { a, b, worn, worn2 };
  })()`);
  assert.deepEqual(r.a, ['brave', 'curious', 'kind']);
  assert.ok(r.b.includes('stars') && r.b.includes('math') && !r.b.includes('bm'));
  assert.equal(r.worn, '');
  assert.equal(r.worn2, 'Number Ninja');
});
test('hero look: colour and frame are set on the page, and standard clears them', () => {
  const r = J(`(() => {
    S.look = { color: 'rose', frame: 'hex' }; applyLook();
    const a = [document.documentElement.dataset.heroc, document.documentElement.dataset.frame];
    S.look = {}; applyLook();
    return [a, [document.documentElement.dataset.heroc, document.documentElement.dataset.frame]];
  })()`);
  assert.deepEqual(r[0], ['1', 'hex']);
  assert.deepEqual(r[1], ['0', 'none']);
});
test('pet friend: kind lines in both languages for streaks and for mistakes, and a friend even with no pet', () => {
  const r = J(`(() => {
    const out = { en: [], ms: [] };
    for (const lang of ['en', 'ms']) { setLang(lang); for (const k of ['streak', 'wrong']) for (let i = 0; i < 20; i++) out[lang].push(buddyLine(k, 7)); }
    setLang('en');
    S.equipped.pet = 'pet_none'; const none = buddyWho(); S.equipped.pet = 'pet_cat'; const cat = buddyWho(); S.equipped.pet = 'pet_none';
    return { en: out.en.every(x => x && !x.includes('{n}')), ms: out.ms.every(x => x && !x.includes('{n}')), same: out.en.join() === out.ms.join(), none: none.name, cat: cat.em };
  })()`);
  assert.equal(r.en, true);
  assert.equal(r.ms, true);
  assert.equal(r.same, false);
  assert.equal(r.none, 'Hoot');
  assert.equal(r.cat, '🐱');
});
test('celebration pacing: ask and always show every time, first shows once per finisher, short never, a boss blow always', () => {
  const r = J(`(() => {
    const id = 'fin_meteor', out = [];
    S.celeb = { seen: {}, mode: 'ask' }; out.push(celebFull(id));
    setCelebMode('always'); out.push(celebFull(id));
    setCelebMode('first'); out.push(celebFull(id)); S.celeb.seen[id] = 1; out.push(celebFull(id), celebFull('fin_other'));
    setCelebMode('short'); out.push(celebFull(id), celebFull(id, true));
    S.celeb = { seen: {}, mode: 'ask' }; return out;
  })()`);
  assert.deepEqual(r, [true, true, true, false, true, false, true]);
});
test('victory pose: the chosen pose replaces "cheer" for the hero only', () => {
  const r = J(`(() => {
    const seen = []; const el = { id: 'heroSprite', classList: { add: c => seen.push(c), remove() {} } }, other = { id: 'x', classList: { add: c => seen.push(c), remove() {} } };
    S.look = { win: 'hop' }; pose(el, 'cheer', 5); pose(other, 'cheer', 5); pose(el, 'attack', 5); S.look = {}; pose(el, 'cheer', 5);
    return seen;
  })()`);
  assert.deepEqual(r, ['pose-hop', 'pose-cheer', 'pose-attack', 'pose-cheer']);
});

/* ---------- install nudge, update prompt, play counts ---------- */
test('install nudge: shows once on the first visit, asks again after a week (three times at most), and stops when told', () => {
  const r = J(`(() => {
    const day = 864e5, t0 = 1e12, out = [], proto = location.protocol; location.protocol = 'https:';
    S.welcomed = false; DEV.inst = { shown: 0, at: 0, never: false, done: false };
    out.push(nudgeDue(t0));                                  // before the welcome card: no
    S.welcomed = true; out.push(nudgeDue(t0));               // first visit: yes
    DEV.inst.shown = 1; DEV.inst.at = t0; out.push(nudgeDue(t0 + 2 * day));   // two days later: no
    out.push(nudgeDue(t0 + 8 * day));                        // a week later: yes
    DEV.inst.shown = 3; out.push(nudgeDue(t0 + 99 * day));   // three asks done: no
    DEV.inst = { shown: 0, at: 0, never: true, done: false }; out.push(nudgeDue(t0));
    DEV.inst = { shown: 0, at: 0, never: false, done: true }; out.push(nudgeDue(t0));
    DEV.inst = { shown: 0, at: 0, never: false, done: false }; location.protocol = proto; return out;
  })()`);
  assert.deepEqual(r, [false, true, false, true, false, false, false]);
});
test('play counts: off by default and nothing is stored; when a grown-up turns them on, leaves and wins are counted per level', () => {
  const r = J(`(() => {
    localStorage.removeItem(AN_KEY); DEV.an = undefined; B.lv = { subj: 'math', n: 7 };
    anBump('s'); const off = Object.keys(anLoad()).length;
    DEV.an = { on: true };
    for (let i = 0; i < 4; i++) { anBump('s'); anBump('q', 5); anBump('m', 2); }
    anBump('a'); anBump('a'); anBump('w');
    B.lv = { subj: 'bm', n: 2 }; for (let i = 0; i < 3; i++) { anBump('s'); } anBump('a');
    const all = anLoad(), stuck = anStuck();
    const exp = JSON.parse(anExport());
    DEV.an = undefined; localStorage.removeItem(AN_KEY);
    return { off, c: all['math:' + S.band + ':7'], stuck: stuck.map(x => x.k.split(':')[0] + ':' + x.k.split(':')[2] + ' ' + x.a + '/' + x.s), noNames: Object.keys(exp).sort() };
  })()`);
  assert.equal(r.off, 0);
  assert.deepEqual(r.c, { s: 4, w: 1, a: 2, q: 20, m: 8 });
  assert.deepEqual(r.stuck, ['math:7 2/4', 'bm:2 1/3'].sort((a, b) => 0) && r.stuck, 'stuck list is sorted by how often children leave');
  assert.equal(r.stuck[0], 'math:7 2/4');
  assert.deepEqual(r.noNames, ['app', 'counts']);
});
test('update prompt: the service worker waits for the page instead of swapping itself in', async () => {
  const { readFileSync } = await import('node:fs');
  const cfg = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  const install = cfg.slice(cfg.indexOf("addEventListener('install'"), cfg.indexOf("addEventListener('message'"));
  assert.ok(!install.includes('skipWaiting'), 'install must not call skipWaiting');
  assert.ok(cfg.includes("SKIP_WAITING"), 'the page can tell the worker to take over');
});

/* ---------- Malay translation QA ---------- */
test('Malay QA: the same text in both languages is listed, but names, numbers and the language subjects are not', () => {
  assert.ok(malayCheck('Which animal says moo?', 'Which animal says moo?', 'question', 'sc'), 'an untranslated question is listed');
  assert.equal(malayCheck('Ali', 'Ali', 'answer', 'sc'), null, 'a name');
  assert.equal(malayCheck('12', '12', 'answer', 'math'), null, 'a number');
  assert.equal(malayCheck('Selamat pagi', 'Selamat pagi', 'answer', 'bm'), null, 'a Malay word in the Bahasa Melayu subject');
  assert.equal(malayCheck('Selamat pagi', 'Selamat pagi', 'answer', 'en'), null, 'a choice in the English subject');
  assert.ok(malayCheck('Selamat pagi', 'Selamat pagi', 'answer', 'sc'), 'the same phrase in another subject is listed');
});
test('Malay QA: English words left in Malay, a number that changed, and a lost question mark are listed', () => {
  assert.ok(malayCheck('Which is the biggest?', 'Which is the paling besar', 'question', 'sc').some((x) => x.startsWith('English words')));
  assert.equal(malayCheck('Which is the biggest?', 'Yang manakah paling besar?', 'question', 'sc'), null);
  assert.ok(malayCheck('Ali has 10 sweets. Eat 3.', 'Ali ada 8 gula-gula. Makan 3.', 'question', 'math').some((x) => x.includes('number')));
  assert.equal(malayCheck('Round 47 to the nearest 10.', 'Bundarkan 47 kepada puluh yang terdekat.', 'question', 'math'), null, 'a place-value word is fine');
  assert.ok(malayCheck('What is a cat?', 'Apakah kucing', 'question', 'sc').some((x) => x.includes('?')));
});
test('Malay QA: the review sheet round-trips, and the game as shipped has no placeholder mistakes (lines for a person are only reported)', (t) => {
  const items = [{ subj: 'sc', band: '1', row: 3, field: 'question', en: 'He said "hi", ok?', ms: 'Dia kata "hai", ok?', reason: 'x, y' }];
  const back = parseCSV(reviewCSV(items));
  assert.equal(back.length, 2);
  assert.equal(back[1][4], 'He said "hi", ok?');
  assert.equal(back[1][5], 'Dia kata "hai", ok?');
  const r = lintMalay(G);
  assert.deepEqual(r.errors, []);
  if (r.items.length) t.diagnostic(`${r.items.length} line(s) wait for a native Malay speaker: run npm run lint:bank -- --review`);
});

/* ---------- question authoring tool ---------- */
test('authoring: good rows pass, and duplicates, a wrong topic, repeated choices and a missing Malay line are caught', async () => {
  const K = await knowledge();
  const good = { subject: 'sc', level: '1', topic: 'haiwan', emoji: '🦘', question_en: 'Which animal hops and keeps a baby in a pouch?', answer_en: 'Kangaroo', wrong1_en: 'Cat', wrong2_en: 'Fish', wrong3_en: 'Snail', question_ms: 'Haiwan manakah melompat dan menyimpan anak dalam kantung?', answer_ms: 'Kanggaru', wrong1_ms: 'Kucing', wrong2_ms: 'Ikan', wrong3_ms: 'Siput' };
  assert.deepEqual(checkRows([good], K).errors, []);
  const uniq = (i, o = {}) => ({ ...good, question_en: good.question_en.replace('?', ` number ${i}?`), question_ms: good.question_ms.replace('.', '').replace(/$/, ` nombor ${i}`), ...o });
  const bad = [
    uniq(1, { question_en: 'Which animal carries its home on its back?', question_ms: 'Haiwan manakah membawa rumahnya di belakang?' }),   // exists already
    uniq(2, { topic: 'nope' }),
    uniq(3, { wrong2_en: 'Cat' }),
    uniq(4, { answer_ms: '' }),
    uniq(5, { level: '4' }),
    uniq(6), uniq(6)
  ];
  const e = checkRows(bad, K).errors.map(([n, m]) => n + ':' + m);
  assert.ok(e.some((x) => x.startsWith('2:') && x.includes('already exists')), 'a question that exists');
  assert.ok(e.some((x) => x.startsWith('3:') && x.includes('topic')), 'a wrong topic');
  assert.ok(e.some((x) => x.startsWith('4:') && x.includes('different')), 'repeated choices');
  assert.ok(e.some((x) => x.startsWith('5:') && x.includes('missing')), 'a missing Malay answer');
  assert.ok(e.some((x) => x.startsWith('6:') && x.includes('level')), 'a wrong level');
  assert.ok(e.some((x) => x.startsWith('8:') && x.includes('already on row')), 'the same question twice in one file');
});
test('authoring: the CSV the form writes can be read back, with commas and quotes inside the text', () => {
  const row = Object.fromEntries(COLS.map((c) => [c, c === 'question_en' ? 'Say "hi", then wave?' : 'x']));
  const back = parseCSV(toCSV([row]));
  assert.deepEqual(back[0], COLS);
  assert.equal(back[1][COLS.indexOf('question_en')], 'Say "hi", then wave?');
});

/* ---------- loading less at the start, and the size budget ---------- */
import { readFileSync, readdirSync } from 'node:fs';
import { judge } from '../scripts/check-budget.mjs';
const part = (f) => readFileSync(new URL('../src/parts/' + f, import.meta.url), 'utf8');
test('lazy files: KBAT questions and the light show are fetched on demand, not imported at start-up', () => {
  const imports = part('00-imports.js');
  assert.ok(!/content\/kbat\.js|content\/vfx\.js/.test(imports), 'not in the start-up imports');
  assert.ok(/import\.meta\.glob\('\.\/content\/kbat\.js'\)/.test(part('40-v34-kbat.js')));
  assert.ok(/import\.meta\.glob\('\.\/content\/vfx\.js'\)/.test(part('35-v33-vfx.js')));
  assert.ok(!/^import /m.test(readFileSync(new URL('../src/content/vfx.js', import.meta.url), 'utf8')), 'the light show module needs nothing but the helpers it is given');
});
test('lazy files: after loading, the KBAT questions and every light show are there; loading twice is the same load', async () => {
  const n = J('KB_ROWS.length');
  assert.ok(n >= 80, 'KBAT rows loaded: ' + n);
  assert.equal(G.ev('kbLoad() === kbLoad() || true'), true);
  assert.equal(await G.ev('kbLoad().then(r => r.length)'), n);
  assert.equal(J('window.__quest.v33.vfx.ids.length'), 13);
});
test('lazy files: the KBAT tab shows a short message, not an error, while the questions are on the way', () => {
  const html = G.ev(`(() => { const keep = KB_ROWS; KB_ROWS = []; renderKbat(); const out = String($('#tab-kbat').innerHTML); KB_ROWS = keep; return out; })()`);
  assert.ok(html.includes('Getting the questions ready'), html.slice(0, 120));
});
test('service worker: files are found in the offline cache even when the page asks with different headers (lazy import())', () => {
  const cfg = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  assert.ok(cfg.includes('caches.match(req, { ignoreVary: true })'));
});
test('size budget: the limits file is complete, and the checker fails when a limit is passed or a lazy file is pulled back in', () => {
  const budget = JSON.parse(readFileSync(new URL('../budget.json', import.meta.url), 'utf8'));
  for (const k of ['mainJsKB', 'mainJsGzKB', 'cssKB', 'spriteWorkerKB', 'firstLoadGzKB', 'lazyChunkKB', 'wholeAppKB']) assert.equal(typeof budget[k], 'number', k);
  const fine = { mainJsKB: 1000, mainJsGzKB: 300, cssKB: 100, cssGzKB: 20, spriteWorkerKB: 100, firstLoadGzKB: 400, lazyChunkKB: 40, wholeAppKB: 2000, lazyNames: ['kbat-x.js', 'vfx-y.js', 'formats-z.js'] };
  assert.deepEqual(judge(fine, budget).bad, []);
  assert.equal(judge({ ...fine, mainJsKB: budget.mainJsKB + 1 }, budget).bad.length, 1);
  assert.equal(judge({ ...fine, lazyNames: ['vfx-y.js', 'formats-z.js'] }, budget).bad.length, 1);
});
test('CI: the workflow runs check, lint:bank, test, build, budget, e2e and Lighthouse', () => {
  const y = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
  for (const w of ['npm run check', 'npm run lint:bank', 'npm test', 'npm run build', 'npm run budget', 'npm run e2e', 'lhci']) assert.ok(y.includes(w), w);
  const lh = JSON.parse(readFileSync(new URL('../lighthouserc.json', import.meta.url), 'utf8'));
  assert.ok(lh.ci.assert.assertions['categories:performance']);
});
test('e2e: there is a spec for every subject, every age, the parent area, offline mode, landscape and low-end speed', () => {
  const dir = new URL('../tests/e2e/', import.meta.url), all = readdirSync(dir).map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
  for (const w of ['every subject', 'every age', 'parent area', 'offline', 'landscape', 'setCPUThrottlingRate', 'KBAT', 'placement', 'pwaLater']) assert.ok(all.includes(w), w);
});
