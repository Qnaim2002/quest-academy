/* Tests for v28: lesson ladders, quick checks, teach-back, picture-first cards, the notebook, print pages,
   lesson battles and topic bosses, study buffs, battle tips, and the ten Studies activities. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 3 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));
await G.ev("Promise.all(SUBJ_ORDER.map(s => ensureLessons(s)))");

test('every v28 text exists in English and Malay, and the stylesheet is loaded', () => {
  const keys = J(`Object.keys(STR).filter(k => /^(ld|qc|tb|nb|pt|lb|sg|sb|pp28|ac|wb|sf|lab|col|mp2|mpf|mu|fl|sf2|ph|tr2|shp)\\./.test(k) || k === 'lc.pic' || k === 'lg.tboss')`);
  assert.ok(keys.length > 250, 'found ' + keys.length);
  for (const k of keys) { const v = J(`STR[${JSON.stringify(k)}]`); assert.ok(v[0] && v[1], k); }
  assert.ok(readFileSync(new URL('../src/style.css', import.meta.url), 'utf8').includes('css/19-v28.css'));
});

test('ladders: every topic has Starter, Builder and Expert, opened in order', () => {
  G.ev('S.learned = {}; S.pracDay = {}; S.quiz = {}; S.openAll = false');
  for (const s of J('SUBJ_ORDER')) for (const age of [0, 1, 3]) {
    const L = J(`ladders('${s}', ${age}).map(T => ({ n: T.lessons.length, r: T.lessons.map(x => x.rung) }))`);
    for (const T of L) {
      assert.ok(T.n >= 1); T.r.forEach((r, i) => { assert.ok(r >= 0 && r <= 2); if (i) assert.ok(r >= T.r[i - 1], 'easier lessons first'); });
      if (T.n >= 3) assert.deepEqual([...new Set(T.r)], [0, 1, 2], s + ' has all three rungs');
    }
  }
  const T0 = "ladders('math', 3).find(T => T.lessons.length >= 3)";
  assert.ok(J(`rungOpen(${T0}, 0)`)); assert.ok(!J(`rungOpen(${T0}, 1)`)); assert.ok(!J(`rungOpen(${T0}, 2)`));
  G.ev(`rungItems(${T0}, 0).forEach(x => { S.learned[x.m.id] = true; })`);
  assert.ok(J(`rungOpen(${T0}, 1)`)); assert.ok(!J(`rungOpen(${T0}, 2)`));
  /* a short topic: the missing rungs are a practice set and a quiz */
  const short = "ladders('math', 0).find(T => T.lessons.length === 1)";
  if (J(`!!${short}`)) {
    assert.ok(!J(`rungDone(${short}, 1)`)); G.ev(`S.pracDay[${short}.last.id] = todayKey()`); assert.ok(J(`rungDone(${short}, 1)`));
    G.ev(`S.quiz[${short}.last.id] = 4`); assert.ok(J(`rungDone(${short}, 2)`));
  }
  const html = J("laddersHTML('math')"); assert.match(html, /Starter/); assert.match(html, /Builder/); assert.match(html, /Expert/);
  G.ev('S.learned = {}; S.pracDay = {}; S.quiz = {}');
});

test('quick check: two warm-ups for age 6-7 only, and "Skip to practice" after two right answers', () => {
  const m = "MODULES.find(x => x.id === 'm_pw')";
  G.ev(`UI.qcFor = null; UI.prac = null; S.band = 3; qcFor(${m})`); assert.equal(J('UI.qc.qs.length'), 2);
  G.ev('qcPick(UI.qc.qs[0].correct); qcPick(UI.qc.qs[1].correct)'); assert.ok(J('UI.qc.done')); assert.equal(J('UI.qc.ok'), 2);
  assert.match(J(`qcHTML(${m})`), /qcSkip/);
  G.ev(`UI.qcFor = null; S.band = 2; qcFor(${m})`); assert.equal(J('UI.qc'), null, 'not for age 5');
  G.ev(`UI.qcFor = null; S.band = 3; S.sensory = true; qcFor(${m})`); assert.equal(J('UI.qc'), null, 'not in calm mode');
  G.ev(`UI.qcFor = null; S.sensory = false; S.studyBonus = false; qcFor(${m})`); assert.equal(J('UI.qc'), null, 'not with bonus modes off');
  G.ev('S.studyBonus = true; UI.qcFor = null; UI.qc = null');
});

test('teach-back: the right sentence is the lesson\'s own idea; picture-first cards for age 4', () => {
  G.ev("UI.tb = null; UI.open = 'm_pw'; S.band = 3; S.learned.m_pw = true");
  const b = J("tbFor(MODULES.find(x => x.id === 'm_pw'))");
  assert.equal(b.opts.length, 3); assert.equal(b.opts[b.right], J("ideaOf(MODULES.find(x => x.id === 'm_pw'))"));
  G.ev('tbPick(UI.tb.right)'); assert.equal(J('S.teach.m_pw'), 1);
  G.ev('S.band = 2'); assert.equal(J("tbHTML(MODULES.find(x => x.id === 'm_pw'))"), '', 'two-step chains only for age 6 and 7');
  G.ev('S.band = 1');
  const c = J("lessonCards(MODULES.find(x => x.id === 'm_pw'))"); assert.equal(c[0].kind, 'pic'); assert.ok(c[0].em.length >= 1 && c[0].text.length <= 72);
  G.ev('S.band = 3'); assert.notEqual(J("lessonCards(MODULES.find(x => x.id === 'm_pw'))")[0].kind, 'pic');
  G.ev('UI.open = null; S.learned = {}');
});

test('notebook: a finished lesson saves its "Remember" tip in both languages', () => {
  G.ev("S.notebook = {}; S.learned = {}; famEvent('lessonDone', 'm_pw')");
  const n = J('S.notebook.m_pw'); assert.ok(n.en && n.ms && n.en !== n.ms);
  assert.match(J('notebookHTML()'), /m_pw|Parts/);
});

test('print pages: art lessons get a colouring page; every picture is valid SVG', () => {
  for (const k of J('Object.keys(ART)')) assert.match(J(`artSVG('${k}')`), /^<svg[^>]*>.*<\/svg>$/s);
  const sv = J("MODULES.filter(m => m.subject === 'sv').map(m => artFor(m))"); assert.ok(sv.length > 10 && sv.every(k => J(`!!ART['${k}']`)));
  assert.ok(J("printSecHTML(MODULES.find(m => m.subject === 'sv'))").includes('printLesson'));
  assert.equal(J("printSecHTML(MODULES.find(m => m.subject === 'math'))"), '');
  G.ev("printPage('Test', artSVG('fish'))");
});

test('lesson battle and topic boss: questions only from the lesson or topic', () => {
  G.ev("UI.run = null; S.studyBonus = true"); assert.equal(J("specialLevel('lesson:no_such_lesson')"), null);
  G.ev("startBattle('lesson:' + MODULES.find(m => m.subject === 'bm').id)");
  assert.equal(J('B.lv.special'), 'lesson'); assert.equal(J('B.lv.rounds'), 3);
  const subj = J('B.lv.subj'); for (let i = 0; i < 4; i++) { G.ev('nextQuestion()'); assert.ok(J('B.q.topic').startsWith(subj), J('B.q.topic')); }
  G.ev('S.chestQ = 0; S.tboss = {}'); const tp = J("lessonTopic(MODULES.find(m => m.subject === 'bm'))");
  G.ev(`startBattle('tboss:bm:${tp}')`); assert.ok(J('B.lv.mini && B.lv.boss')); assert.equal(J('B.lv.rounds'), 6);
  G.ev('B.mHp = 0; win()'); assert.equal(J(`S.tboss['bm:${tp}:' + S.band]`), 1); assert.equal(J('S.chestQ'), 1, 'first topic-boss win gives a chest');
  G.ev('S.chestQ = 0; B.active = false');
});

test('battle tips suggest the lesson for the missed topic; study buffs give +3 attack once', () => {
  const m = J("lessonForTopic('bm_huruf', 'bm')"); assert.equal(m.subject, 'bm');
  assert.equal(J("lessonForTopic('math_pw', 'math').subject"), 'math');
  G.ev("startBattle('bm:3'); B.miss = { bm_huruf: 2 }"); assert.equal(J('lessonSuggestion().subject'), 'bm');
  G.ev('B.miss = { bm_huruf: 1 }; B.ko = 0'); assert.equal(J('lessonSuggestion()'), null, 'one slip is not enough');
  G.ev("leaveBattle(); const _m = MODULES.find(x => x.id === 'm_pw'); pracFinish(_m, { mode: 'prac', score: 3, firstTry: 3 })");
  assert.equal(J('S.sbuff.subj'), 'math');
  const a0 = J('(() => { B.active = false; return atk(); })()');
  G.ev("startBattle('math:2')"); assert.ok(J('B.sbuff')); assert.equal(J('atk()'), a0 + 3); assert.equal(J('S.sbuff'), null, 'used up');
  G.ev("leaveBattle(); startBattle('math:2')"); assert.ok(!J('B.sbuff')); G.ev('leaveBattle()');
});

test('the ten activities render in every age and both languages', () => {
  for (const lang of ['en', 'ms']) for (const band of [1, 2, 3, 4]) {
    G.ev(`S.lang = '${lang}'; S.band = ${band}; UI.av = {}`);
    for (const k of J('Object.keys(ACTS)')) { const h = J(`ACTS['${k}'].html()`); assert.ok(typeof h === 'string' && h.length > 40, `${k} ${lang} ${band}`); assert.ok(!/undefined|\[object/.test(h), `${k} ${lang} ${band}: ${h.match(/.{30}(undefined|\[object).{30}/)}`); }
  }
  G.ev("S.lang = 'en'; S.band = 3; UI.av = {}");
});

test('activities: sifir climbs, the word bench checks words, map, journal, safety, sound pad, tracing', () => {
  /* sifir: a right answer climbs one rung */
  G.ev('S.sifir = {}; UI.av = {}; sifirHTML()'); const q = J('UI.av.sifir.q'); G.ev(`sifirPick(${q.ans})`); assert.equal(J('S.sifir[UI.av.sifir.tb]'), 1);
  G.ev('sifirPick(-5)'); assert.ok(J('UI.av.sifir.hint'), 'a wrong answer shows the count-up hint, no penalty');
  /* word bench */
  G.ev("UI.av = {}; UI.av.word = { lang: 'en', i: 0 }; wordHTML(); const st = UI.av.word; st.built = [...st.p[1]].map(c => st.tiles.findIndex((x, i) => x === c && !st.built.includes(i)) ); ");
  G.ev("(() => { const st = UI.av.word; st.built = []; for (const c of st.p[1]) st.built.push(st.tiles.findIndex((x, i) => x === c && !st.built.includes(i))); wordCheck(); })()");
  assert.ok(J('UI.av.word.solved'));
  G.ev("(() => { const st = UI.av.word, w = st.p[3][0]; st.built = []; for (const c of w) st.built.push(st.tiles.findIndex((x, i) => x === c && !st.built.includes(i))); wordCheck(); })()");
  assert.equal(J('UI.av.word.found.length'), 1, 'bonus word found');
  /* every bonus word can be made from the tiles */
  for (const lang of ['en', 'ms']) for (const [, w, x, extras] of J(`BENCH.${lang}`)) { const tiles = [...(w + x)]; for (const e of extras) { const left = [...tiles]; for (const c of e) { const i = left.indexOf(c); assert.ok(i >= 0, `${e} from ${w}+${x}`); left.splice(i, 1); } } }
  /* map, journal, safety */
  assert.equal(J('STATES.length'), 16); G.ev("S.mapSeen = {}; UI.av = {}; mapHTML(); mapTap('sabah')"); assert.equal(J('S.mapSeen.sabah'), 1);
  G.ev('S.feel = {}; feelSet(2); feelSet(undefined, 1)'); assert.deepEqual(J('S.feel[todayKey()]'), { f: 2, r: 1 });
  G.ev("UI.av = {}; safetyHTML(); SCENES.kitchen.forEach((x, i) => { if (x[3]) safetyTap(i); })"); assert.ok(J('!!S.safety.kitchen'));
  /* sound pad: the two right sounds blend; the spelling options hold the right word once */
  G.ev("UI.av = {}; UI.av.phon = { lang: 'en', i: 0 }; phonicsHTML(); const _s = UI.av.phon; phTile(_s.tiles.indexOf(_s.b[0])); phTile(_s.tiles.indexOf(_s.b[1]))");
  assert.ok(J('UI.av.phon.blended'));
  for (const lang of ['en', 'ms']) for (const b of J(`BLENDS.${lang}`)) { assert.equal(b[0] + b[1], b[2]); const ms2 = J(`phMisspell('${b[2]}', '${lang}')`); assert.ok(ms2.length === 2 && !ms2.includes(b[2])); }
  /* tracing: shapes and number-line hops are traceable; neatness stars */
  for (const k of ['sh_circle', 'sh_square', 'sh_triangle', 'sh_star', 'sh_heart', 'sh_diamond', 'nlGlyph(2, 5)']) {
    const g = k.startsWith('nl') ? J(k) : k;
    const good = J(`traceScore('${g}', GLYPHS['${g}'].map(s => s.map(p => [p[0] + 1, p[1] - 1])))`); assert.ok(good.ok, g);
    assert.ok(!J(`traceScore('${g}', [[[5, 5], [10, 6], [12, 9], [6, 8]]])`).ok);
  }
  assert.equal(J('neatStars({ ok: true, cover: .95, prec: .9 })'), 3); assert.equal(J('neatStars({ ok: false, cover: 0, prec: 0 })'), 0);
});

test('the parent switch turns the bonus modes off', () => {
  G.ev("S.studyBonus = true; famEvent('set28')"); assert.equal(J('S.studyBonus'), false); assert.ok(!J('bonusOn()'));
  G.ev("famEvent('set28')"); assert.ok(J('bonusOn()'));
  G.ev('S.sensory = true'); assert.ok(!J('bonusOn()')); G.ev('S.sensory = false');
});
