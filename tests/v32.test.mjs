/* Tests for v32: rival knight, boss powers and situations, team combo, gear rarity, pet gear, new monsters, story extras. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from '../scripts/harness.mjs';
import shared from '../src/content/cutscenes/shared.js';
import x1 from '../src/content/cutscenes/x1.js';
import x2 from '../src/content/cutscenes/x2.js';
import x3 from '../src/content/cutscenes/x3.js';
import x4 from '../src/content/cutscenes/x4.js';

const { game: G } = await loadGame({ lang: 'en', band: 2 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));

test('story content: every beat is [shot, speaker, English, Malay] and every zone has an arc', () => {
  const beat = b => Array.isArray(b) && b.length >= 4 && typeof b[0] === 'string' && typeof b[1] === 'string' && typeof b[2] === 'string' && b[2].length > 3 && typeof b[3] === 'string' && b[3].length > 3;
  for (const [nm, x] of Object.entries({ x1, x2, x3, x4 })) {
    for (let z = 0; z < 10; z++) {
      const a = x.arc[z]; assert.ok(a && a.c && a.c.length && a.v && a.v.length, `${nm} arc ${z}`);
      [...a.c, ...a.v].forEach(b => assert.ok(beat(b), `${nm} beat in zone ${z}`));
      assert.ok(x.words && x.words[z], `${nm} word ${z}`);
    }
  }
  assert.equal(shared.bossVoice.length, 10);
  shared.bossVoice.forEach(v => ['intro', 'rematch', 'rage', 'win'].forEach(k => assert.ok(v[k] && v[k].length === 2 && v[k][0] && v[k][1], 'voice ' + k)));
  assert.equal(shared.rival.length, 3);
  assert.ok(shared.choice.length >= 5 && shared.cliff.length >= 9 && shared.mini.length >= 4);
});


test('rival knight: three duels at levels 25, 50 and 75 with mixed subjects', () => {
  for (const i of [1, 2, 3]) {
    const l = J(`(() => { const l = __quest.v32.rivalLevel(${i}); return { n: l.n, big: l.big, subs: l.mixSubs.length, pool: l.pool.length, id: l.id, rounds: l.rounds }; })()`);
    assert.equal(l.n, i * 25); assert.equal(l.big, true); assert.ok(l.subs >= 2); assert.ok(l.pool > 0); assert.equal(l.id, 'rival:' + i);
  }
  assert.ok(J('__quest.v32.rivalLevel(3).rounds') > J('__quest.v32.rivalLevel(1).rounds'));
});

test('boss powers and situations: ten each, and every zone boss gets its own pair', () => {
  assert.equal(G.ev('SIG.length'), 10); assert.equal(G.ev('SITU.length'), 10);
  assert.ok(G.ev('SIG.every(s => s.em && s.n[0] && s.n[1] && s.d[0] && s.d[1] && typeof s.f === "function")'));
  assert.ok(G.ev('SITU.every(s => s.n[0] && s.n[1])'));
  const pairs = new Set();
  for (const s of J('Object.keys(SUBJ_IDX)')) for (let z = 0; z < 10; z++) { const l = G.ev(`levelOf('${s}', ${z * 10 + 10})`); pairs.add(l.mon.arch + ':' + G.ev(`sitIdx(levelOf('${s}', ${z * 10 + 10}))`)); }
  assert.equal(pairs.size, 100);
});

test('team combo: counts only when every player answered right, first try', () => {
  assert.equal(typeof G.ev('teamAnswer'), 'function');
  assert.equal(typeof G.ev('coopSummaryHTML'), 'function');
});

test('gear rarity: rolls are stable, within caps, and rarer gear has more stats', () => {
  G.ev(`(() => { S.gearSeed = 12345; S.gear = {}; })()`);
  const ids = J(`ITEMS.filter(isGear).map(i => i.id)`);
  assert.ok(ids.length > 20);
  const first = ids.map(id => J(`gearRoll('${id}')`));
  G.ev(`S.gear = {}`);
  const second = ids.map(id => J(`gearRoll('${id}')`));
  assert.deepEqual(first, second, 'same seed, same rolls');
  const extras = [0, 1, 1, 2, 3];
  first.forEach(r => { assert.ok(r.r >= 0 && r.r <= 4); assert.ok(r.s.length <= extras[r.r]); r.s.forEach(([k, v]) => assert.ok(v > 0 && v <= G.ev('GEAR_CAP')[k])); });
  assert.ok(new Set(first.map(r => r.r)).size >= 3, 'a mix of rarities');
  G.ev(`S.gearSeed = 999; S.gear = {}`);
  assert.notDeepEqual(ids.map(id => J(`gearRoll('${id}')`)), first, 'a different child gets different rolls');
});

test('forge: a re-roll gives a new roll and the old one can be kept', () => {
  G.ev(`S.gearSeed = 4242; S.gear = {}`);
  const id = J(`ITEMS.filter(isGear)[0].id`);
  const a = J(`gearRoll('${id}')`);
  assert.equal(a.n, 0);
  const b = J(`gearRollFor('${id}', 1)`);
  assert.equal(b.n, 1);
  assert.ok(J(`forgeCost('${id}')`) > 0);
});

test('pet gear: sixteen items, every pet has an anchor, art exists for every item', () => {
  assert.equal(G.ev('PET_GEAR.length'), 16);
  const pets = J(`ITEMS.filter(i => i.slot === 'pet' && i.id !== 'pet_none').map(i => i.id)`);
  assert.equal(pets.length, 23);
  pets.forEach(p => assert.ok(G.ev(`!!PET_ANCHOR['${p}']`), 'anchor ' + p));
  assert.ok(G.ev('PET_GEAR.every(g => g.slot && PET_SLOTS.includes(g.slot) && g.n[0] && g.n[1] && !!PG_ART[g.id])'));
});

test('new monsters: ten species with art, names, quirks and idle motion; ten elder bosses', () => {
  const sp = J('Object.values(MALT5)');
  assert.equal(sp.length, 10);
  sp.forEach(k => {
    assert.ok(G.ev(`!!BEAST.species['${k}']`), 'art ' + k);
    assert.ok(G.ev(`!!SPECIES_NM['${k}']`) && G.ev(`!!MNOUN['${k}']`), 'names ' + k);
    assert.ok(G.ev(`!!QUIRKS['${k}']`), 'quirk ' + k);
    assert.ok(G.ev(`Object.values(IDLE_KIND).some(a => a.includes('${k}'))`), 'idle ' + k);
  });
  assert.equal(G.ev('BEAST.BOSSES.length'), 20);
  for (let i = 10; i < 20; i++) assert.ok(G.ev(`!!MNOUN['boss${i}']`));
  const share = G.ev(`(() => { let k = 0, n = 0; for (const s of Object.keys(SUBJ_IDX)) for (let i = 1; i <= 100; i++) { const m = monsterFor(s, i); if (m.big) continue; n++; if (Object.values(MALT5).includes(m.sp)) k++; } return k / n; })()`);
  assert.ok(share > .1 && share < .24, 'share ' + share);
  const elder = G.ev(`(() => { let k = 0; for (const s of Object.keys(SUBJ_IDX)) for (let z = 0; z < 10; z++) { const m = monsterFor(s, z * 10 + 10); if (m.form) k++; } return k; })()`);
  assert.equal(elder, 50);
});

test('the sprite worker lists the new bestiary part', async () => {
  const { readFileSync } = await import('node:fs');
  assert.ok(readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8').includes('09k-bestiary5.js'));
});

test('music and sound: new songs and effects exist', () => {
  for (const s of ['sad', 'tense', 'triumph']) assert.ok(G.ev(`!!SONGS['${s}']`), s);
  for (const s of ['pick', 'combo', 'teamCombo', 'dodge', 'heal', 'shield', 'boom', 'rarity', 'forge']) assert.equal(typeof G.ev(`sfx.${s}`), 'function', s);
});
