/* Unit tests for the game's own logic, run with `npm test` (Node's built-in test runner; no extra packages).
   The real game code is loaded through scripts/harness.mjs. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 3 });
const SUBJ = G.SUBJ_ORDER, N = G.LEVELS_PER;

test('monsterFor: every one of the 1000 levels has its own monster', () => {
  const full = new Set(), combo = new Set();
  for (const s of SUBJ) for (let n = 1; n <= N; n++) {
    const m = G.monsterFor(s, n);
    full.add([m.b, m.sp || '', m.c, m.e].join('|'));
    combo.add([m.b, m.c, m.e].join('|'));
  }
  assert.equal(full.size, SUBJ.length * N, 'species + colour + eyes is unique per level');
  assert.equal(combo.size, 960, 'body + colour + eyes covers all 960 combos');
});

test('monsterFor: tiers, zones and boss archetypes', () => {
  for (const s of SUBJ) {
    const arch = new Set();
    for (let n = 1; n <= N; n++) {
      const m = G.monsterFor(s, n);
      assert.equal(m.big, n % 10 === 0, `${s}:${n} big boss`);
      assert.equal(!!m.boss, n % 5 === 0, `${s}:${n} boss flag`);
      assert.equal(m.z, Math.floor((n - 1) / 10));
      assert.ok(['two', 'big', 'one', 'three', 'stalk', 'sleepy'].includes(m.e));
      assert.ok(m.c >= 0 && m.c < 16);
      if (m.big) { assert.ok(Number.isInteger(m.arch) && m.arch >= 0 && m.arch < 10); arch.add(m.arch); }
      else assert.equal(m.arch, undefined);
      assert.deepEqual(G.monsterFor(s, n), m, 'same level, same monster');
    }
    assert.equal(arch.size, 10, `${s}: all ten zone bosses are different`);
  }
});

test('levelOf: every level is well formed and stable', () => {
  for (const s of SUBJ) for (let n = 1; n <= N; n++) {
    const lv = G.levelOf(s, n);
    assert.equal(lv.id, `${s}:${n}`);
    assert.equal(lv.n, n);
    assert.equal(lv.z, Math.floor((n - 1) / 10));
    assert.equal(lv.tier, n % 10 === 0 ? 'big' : n % 5 === 0 ? 'mini' : 'normal');
    assert.equal(lv.big, n % 10 === 0);
    assert.ok(Array.isArray(lv.pool) && lv.pool.length > 0, `${lv.id} has questions`);
    assert.ok(lv.rounds > 0);
    assert.deepEqual(G.monsterFor(s, n), lv.mon);
  }
});

test('mathQ: sensible questions in both languages', () => {
  for (const lang of ['en', 'ms']) {
    G.setLang(lang);
    for (const band of [1, 2, 3]) for (const fam of ['pw', 'cmp', 'units', 'frac']) for (let i = 0; i < 60; i++) {
      const q = G.mathQ(band, fam);
      assert.ok(q.text && !/undefined|NaN|null/.test(q.text), `text: ${q.text}`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, 'has options');
      assert.equal(new Set(q.options.map(String)).size, q.options.length, `options are different: ${q.options}`);
      assert.ok(q.correct >= 0 && q.correct < q.options.length, 'correct index in range');
      q.options.forEach((o) => { if (typeof o === 'number') assert.ok(Number.isFinite(o) && o >= 0, `option ${o}`); });
    }
  }
  G.setLang('en');
});

test('freshSum: new numbers, same kind of sum, right answer', () => {
  const rows = [];
  for (const b of Object.keys(G.BANK.math)) G.BANK.math[b].forEach((r) => { if (/^What is [\d ]+ [+\-x×÷] [\d ]+\?$/.test(r.q[0])) rows.push(r); });
  assert.ok(rows.length > 0, 'the bank has arithmetic rows');
  const num = (s) => +s.replace(/ /g, '');
  for (const r of rows) for (let li = 0; li < 2; li++) for (let i = 0; i < 200; i++) {
    const f = G.freshSum(r, li);
    assert.ok(f, 'generated');
    const m = f.q.match(/^(What is|Berapakah) ([\d ]+) ([+\-x×÷]) ([\d ]+)\?$/);
    assert.ok(m, `format: ${f.q}`);
    assert.equal(m[1], li ? 'Berapakah' : 'What is');
    const a = num(m[2]), b = num(m[4]), op = m[3], want = op === '+' ? a + b : op === '-' ? a - b : op === 'x' || op === '×' ? a * b : a / b;
    assert.equal(String(want), f.a, `${f.q} = ${f.a}`);
    assert.ok(want >= 0 && Number.isInteger(want), 'whole, not negative');
    assert.equal(r.q[0].match(/[+\-x×÷]/)[0], op, 'same operation as the original');
  }
});

test('todayKey uses the local calendar day', () => {
  assert.equal(G.todayKey(new Date(2026, 9, 14, 7, 30)), '2026-10-14');
  assert.equal(G.todayKey(new Date(2026, 0, 1, 0, 5)), '2026-01-01');
  assert.equal(G.todayKey(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
});
