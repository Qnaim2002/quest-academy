/* Tests for v30: code clean-up and smoother running. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 3 });
const PARTS = readdirSync(new URL('../src/parts/', import.meta.url)).filter(f => f.endsWith('.js') && f !== '10c-flashcards.js').sort();   // v31: a retired file the build skips
const SRC = Object.fromEntries(PARTS.map(f => [f, readFileSync(new URL('../src/parts/' + f, import.meta.url), 'utf8')]));

test('no function is declared twice (a second copy silently replaces the first)', () => {
  const seen = {};
  for (const [f, s] of Object.entries(SRC)) for (const m of s.matchAll(/^function\s+([\w$]+)\s*\(/gm)) {
    assert.ok(!seen[m[1]], `${m[1]} is declared in ${seen[m[1]]} and ${f}`); seen[m[1]] = f;
  }
});

test('no part forces a layout with the old "read offsetWidth" animation trick', () => {
  for (const [f, s] of Object.entries(SRC)) assert.ok(!/void\s+[\w$.()'#\s]+\.offsetWidth/.test(s), f);
});

test('the old STEAM quest screen and its strings are gone', () => {
  for (const name of ['renderSteam', 'steamMSQ', 'steamLLQ', 'steamLevel']) assert.equal(G.ev(`typeof ${name}`), 'undefined', name);
  assert.equal(G.ev('STEAM_N'), 20);
  assert.equal(Object.keys(G.STR).filter(k => /^steam\.(ms|ll)/.test(k)).length, 0);
});

test('spelling questions still get word distractors (the sound pad has its own misspell helper)', () => {
  assert.equal(G.ev('typeof misspell'), 'function');
  assert.equal(G.ev('typeof phMisspell'), 'function');
  const w = G.ev('misspell("rabbit")');
  assert.equal(typeof w, 'string');
});

test('setHTML only rewrites when the markup changed', () => {
  const r = G.ev(`(() => { let n = 0; const el = { set innerHTML(v) { n++; } }; setHTML(el, '<b>a</b>'); setHTML(el, '<b>a</b>'); setHTML(el, '<i>b</i>'); return n; })()`);
  assert.equal(r, 2);
});

test('replayClass adds a missing class straight away', () => {
  const r = G.ev(`(() => { const c = new Set(['old']); const el = { classList: { contains: x => c.has(x), add: x => c.add(x), remove: x => c.delete(x) } }; replayClass(el, 'pop', ['old']); return [...c].join(','); })()`);
  assert.equal(r, 'pop');
});

test('orderQ groups big numbers with spaces without toLocaleString', () => {
  assert.ok(!/toLocaleString/.test(SRC['07c-question-types.js']));
});
