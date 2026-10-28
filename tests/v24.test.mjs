/* Tests for v24: zone music, card rarity and foils, per-child screen time, unique questions, no help in battle,
   ten more species. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 2 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));

test('every zone has its own instrument and motif', () => {
  assert.equal(G.ev('ZINSTR.length'), 10);
  assert.equal(G.ev('ZMOTIF.length'), 10);
  assert.equal(new Set(J('ZMOTIF.map(m => JSON.stringify(m))')).size, 10, 'ten different motifs');
  assert.doesNotThrow(() => G.ev('(() => { AU.zone = 3; zoneMotif(3, 0, 0, .1, 60, [0, 4, 7], SONGS.battle); zoneSting(4); })()'));
});

test('card rarity: 600 common, 200 rare, 100 epic, 100 legendary; foils need all three stars', () => {
  const c = J(`(() => { const n = [0, 0, 0, 0]; for (const s of SUBJ_ORDER) for (let i = 1; i <= 100; i++) n[rarityOf(monsterFor(s, i), i)]++; return n; })()`);
  assert.deepEqual(c, [600, 200, 100, 100]);
  G.ev(`(() => { S.dex = { 'math:4': { t: 1 } }; S.dexV = 1; S.goals = { [starKey('math', 4, 2)]: 3 }; })()`);
  assert.equal(G.ev("isFoil('math', 4)"), false);
  G.ev(`S.goals[starKey('math', 4, 3)] = 4`);
  assert.equal(G.ev("isFoil('math', 4)"), true, 'goals add up across age bands');
  assert.equal(G.ev("dexFoil(getLevel('math:4'))"), true);
  assert.equal(G.ev("dexFoil(getLevel('math:4'))"), false, 'only once');
});

test('screen time: each child has school-day and weekend limits', () => {
  const sat = 'new Date(2026, 9, 17)', mon = 'new Date(2026, 9, 19)';
  assert.equal(G.ev(`limitMin({ timerMin: 30, timerWe: 60 }, ${sat})`), 60);
  assert.equal(G.ev(`limitMin({ timerMin: 30, timerWe: 60 }, ${mon})`), 30);
  assert.equal(G.ev(`limitMin({ timerMin: 20, timerWe: null }, ${sat})`), 20, 'weekend "same as school days"');
  assert.equal(G.ev(`limitMin({}, ${mon})`), 0);
});

test('no question repeats inside a battle, and no question text is shared by two subjects', () => {
  const r = J(`(() => { let rep = 0, n = 0; for (const s of SUBJ_ORDER) for (const lv of [3, 25, 60]) { startBattle(s + ':' + lv); const seen = new Set(); for (let k = 0; k < 12; k++) { nextQuestion(); const key = qKey(B.q); if (seen.has(key)) rep++; seen.add(key); n++; } B.active = false; } return { rep, n }; })()`);
  assert.equal(r.rep, 0, `${r.rep} repeats in ${r.n} questions`);
  const dups = J(`(() => { const norm = s => String(s).toLowerCase().replace(/[.,!?'"…:;]+/g, '').replace(/\\s+/g, ' ').trim(), seen = {}, out = []; Object.keys(BANK).forEach(s => Object.keys(BANK[s]).forEach(b => BANK[s][b].forEach(r => [0, 1].forEach(li => { const k = li + norm(r.q[li]); if (seen[k] && seen[k] !== s) out.push(r.q[li]); seen[k] = seen[k] || s; })))); return out; })()`);
  assert.deepEqual(dups, []);
  assert.equal(G.ev("qKey({ kind: 'odd', text: 'X', options: ['b', 'a'] })"), G.ev("qKey({ kind: 'odd', text: 'X', options: ['a', 'b'] })"), 'the same choices in another order are the same question');
});

test('battle has no help panel, hint ladder or More help button', () => {
  const src = readFileSync(new URL('../src/parts/11-battle.js', import.meta.url), 'utf8');
  assert.ok(!src.includes('id="hint"') && !src.includes('moreHelp') && !src.includes('id="moreBtn"'));
  const ev = readFileSync(new URL('../src/parts/13-events.js', import.meta.url), 'utf8');
  assert.ok(!ev.includes("case 'moreHelp'") && !ev.includes("case 'nextStep'"));
  assert.equal(G.ev("GOALS[2][1]"), '🛡️');
});

test('ten more species with names, cards, quirks and an idle style', () => {
  const sp = J('Object.values(MALT4)');
  assert.equal(new Set(sp).size, 10);
  for (const s of sp) {
    assert.ok(G.ev(`!!BEAST.species['${s}'] && !!QUIRKS['${s}'] && !!SPECIES_NM['${s}'] && !!MNOUN['${s}']`), s);
    for (let c = 0; c < 4; c++) assert.ok(G.ev(`MON2.parts({ b: 'blob', c: ${c}, e: 'two', m: 'teeth', f: ['crown'], t: 1, sp: '${s}' }).length`) > 8, s + c);
  }
  assert.equal(G.ev("idleKind({ sp: 'puffer' })"), 'float');
  assert.equal(G.ev("idleKind({ sp: 'croc' })"), 'heavy');
});
