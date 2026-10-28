/* Tests for the v21 features: spoken answers, tracing, bedtime, subject locks, weekly summary, stats.
   `G.ev(code)` runs code inside the game's own scope (see scripts/harness.mjs). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 1 });
const S = () => G.S();

test('spokenNumbers: English and Malay number words', () => {
  const n = (s) => JSON.parse(G.ev(`JSON.stringify(spokenNumbers(${JSON.stringify(s)}))`));   // plain arrays from the game's realm
  assert.deepEqual(n('twenty eight'), [28]);
  assert.deepEqual(n('one hundred and five'), [105]);
  assert.deepEqual(n('dua puluh lapan'), [28]);
  assert.deepEqual(n('seratus lima'), [105]);
  assert.deepEqual(n('dua belas'), [12]);
  assert.deepEqual(n('it is 7'), [7]);
});

test('matchSpoken: picks the option the child said, or none when unsure', () => {
  const m = (alts, opts) => G.ev(`matchSpoken(${JSON.stringify(alts)}, ${JSON.stringify(opts)})`);
  assert.equal(m(['I think seventy'], ['7', '70', '700']), 1);
  assert.equal(m(['kucing'], ['kucing', 'kambing', 'kuda']), 0);
  assert.equal(m(['the cat'], ['cat', 'hat', 'bat']), 0);
  assert.equal(m(['banana'], ['cat', 'hat', 'bat']), -1);
});

test('traceScore: following the guide passes, a scribble does not', () => {
  for (const g of ['A', 'B', 'S', '2', '8']) {
    const good = G.ev(`traceScore('${g}', GLYPHS['${g}'].map(s => s.map(p => [p[0] + 2, p[1] - 1])))`);
    assert.ok(good.ok, `${g} traced along the guide: ${JSON.stringify(good)}`);
    const bad = G.ev(`traceScore('${g}', [[[5, 95], [95, 95], [95, 90], [5, 90]]])`);
    assert.ok(!bad.ok, `${g} scribble`);
  }
  assert.equal(G.ev('Object.keys(GLYPHS).filter(k => k.length === 1).length'), 62, 'A-Z, a-z (v31) and 0-9 (v28 adds shapes and number-line hops with longer names)');
});

test('bedtime: stops from the set time until 06:00, and a grown-up can pause it', () => {
  S().bedtime = { at: '19:30', ok: 0 };
  const at = (h, m) => G.ev(`bedtimeNow(new Date(2026, 9, 14, ${h}, ${m}))`);
  assert.equal(at(19, 29), false);
  assert.equal(at(19, 30), true);
  assert.equal(at(23, 59), true);
  assert.equal(at(2, 0), true);
  assert.equal(at(6, 0), false);
  assert.equal(at(12, 0), false);
  S().bedtime = { at: '19:30', ok: Date.now() + 60000 };
  assert.equal(at(20, 0), false, 'paused for tonight');
  S().bedtime = { at: '', ok: 0 };
  assert.equal(at(23, 0), false, 'off');
});

test('subjects: always-on list and today’s focus', () => {
  S().locks = ['sc', 'mz']; S().focus = null;
  assert.equal(G.ev("subjOpen('sc')"), false);
  assert.equal(G.ev("subjOpen('math')"), true);
  S().focus = { day: G.todayKey(), s: ['sc'] };
  assert.equal(G.ev("subjOpen('sc')"), true, 'focus wins for today');
  assert.equal(G.ev("subjOpen('math')"), false);
  S().focus = { day: '2001-01-01', s: ['sc'] };
  assert.equal(G.ev("subjOpen('math')"), true, 'yesterday’s focus has expired');
  S().locks = []; S().focus = null;
});

test('per-question stats, tricky list and weekly summary', () => {
  S().qstats = {}; S().days = {};
  G.ev("B.lv = levelOf('math', 3)");
  const q = { kind: 'bank', memSubj: 'bm', memKey: 'Suku kata pertama?', text: 'Suku kata pertama?', topic: 'bm_suku' };
  G.ev(`recordQ(${JSON.stringify(q)}, 1); recordQ(${JSON.stringify(q)}, 2); recordQ(${JSON.stringify(q)}, 0); recordQ(${JSON.stringify(q)}, 1)`);
  const easy = { kind: 'bank', memSubj: 'en', memKey: 'cat?', text: 'cat?', topic: 'en_words' };
  for (let i = 0; i < 5; i++) G.ev(`recordQ(${JSON.stringify(easy)}, 0)`);
  const tricky = G.ev('trickyQuestions()');
  assert.equal(tricky.length, 1);
  assert.equal(tricky[0].subj, 'bm'); assert.equal(tricky[0].w, 3); assert.equal(tricky[0].n, 4);
  G.ev('dayStat().ms += 600000');
  const w = G.ev('weekSummary()');
  assert.equal(w.rows.length, 7);
  assert.equal(w.rows[6].k, G.todayKey());
  assert.equal(w.tot.q, 9); assert.equal(w.tot.ok, 6); assert.equal(w.tot.ms, 600000);
  assert.equal(w.daysPlayed, 1);
  assert.equal(w.best[0].k, 'en|en_words');
  assert.equal(w.weak[0].k, 'bm|bm_suku');
});

test('question stats stay small', () => {
  S().qstats = {};
  for (let i = 0; i < 500; i++) G.ev(`recordQ({ kind: 'bank', memSubj: 'en', memKey: 'q${i}', text: 'q${i}', topic: 'x' }, 0)`);
  assert.ok(Object.keys(S().qstats).length <= 450);
});

test('every species has an idle quirk', () => {
  const names = G.ev("[...Object.values(MON2.BODY), ...Object.values(MALT), ...Object.values(MALT2), ...Object.values(MALT3), ...Object.values(MALT4), ...Object.values(MALT5), ...Object.values(MALT6), 'boss']");
  for (const n of names) assert.ok(G.ev(`!!QUIRKS[${JSON.stringify(n)}]`), n);
});
