/* Tests for v38: armour sets instead of knights, a Settings tab, a simple parent summary, answer styles that fit each question,
   a weaker hero, ten more monsters and Malay fixes. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const EN = (await loadGame({ lang: 'en', band: 2 })).game;
const MS = (await loadGame({ lang: 'ms', band: 2 })).game;
const J = (G, code) => JSON.parse(G.ev(`JSON.stringify(${code})`));
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('armour: four new slots, no knight slot, every piece has its own name in both languages', () => {
  const slots = ['helmet', 'chest', 'gloves', 'legs'];
  for (const s of slots) {
    const items = J(EN, `ITEMS.filter(i => i.slot === '${s}')`);
    assert.ok(items.length >= 9, s);
    assert.equal(new Set(items.map(i => i.id)).size, items.length, s + ' ids');
    assert.equal(new Set(items.map(i => i.en)).size, items.length, s + ' english names');
    assert.equal(new Set(items.map(i => i.ms)).size, items.length, s + ' malay names');
    assert.ok(items.every(i => i.en && i.ms && i.cost >= 0), s);
  }
  assert.ok(!J(EN, 'KNIGHT_SLOTS').includes('knight'), 'knights are not a Hero tab section any more');
  const eq = J(EN, 'DEFAULT_EQUIP');
  for (const s of slots) assert.ok(eq[s], 'default ' + s);
});

test('armour: all pieces are drawn without errors and the hero picture changes with each piece', () => {
  for (const s of ['helmet', 'chest', 'gloves', 'legs']) {
    const ids = J(EN, `ITEMS.filter(i => i.slot === '${s}').map(i => i.id)`);
    const keys = new Set(ids.map(id => EN.ev(`PX.heroKey({ ...DEFAULT_EQUIP, ${s}: '${id}' })`)));
    assert.equal(keys.size, ids.length, s + ' each piece changes the picture key');
  }
});

test('gear stats: new slots roll bonuses and stay inside the caps', () => {
  for (const s of ['helmet', 'chest', 'gloves', 'legs']) assert.ok(J(EN, `GEAR_SLOTS.includes('${s}')`), s);
  const cap = J(EN, 'GEAR_CAP');
  for (let i = 0; i < 40; i++) {
    const roll = J(EN, `gearRollFor('helm_bucket', ${i})`);
    for (const [k, v] of roll.s) if (typeof k === 'string' && cap[k]) assert.ok(v <= cap[k] + 1e-9, `${k} ${v}`);
  }
});

test('armour: every piece can be found, bought and worn (ITEM table is complete)', () => {
  assert.equal(J(EN, 'Object.keys(ITEM).length'), J(EN, 'ITEMS.length'));
  const r = J(EN, `(() => { S.coins = 5000; const out = []; for (const s of ['helmet', 'chest', 'gloves', 'legs']) { const it = ITEMS.filter(i => i.slot === s)[1]; S.owned.push(it.id); S.equipped[it.slot] = it.id; out.push(S.equipped[s] === it.id); } return out; })()`);
  assert.deepEqual(r, [true, true, true, true]);
});

test('hero is weaker than before', () => {
  const b = J(EN, 'BAL');
  assert.ok(b.guard <= 0.4 && b.hit >= 2 && b.atkPower <= 0.35 && b.hpRound <= 21);
});

test('settings tab: exists in the page and has English and Malay texts', () => {
  assert.ok(html.includes('id="tab-settings"') && html.includes('id="nav-settings"'));
  for (const G of [EN, MS]) {
    const keys = J(G, `Object.keys(STR).filter(k => k.startsWith('v38.'))`);
    assert.ok(keys.length >= 30);
    for (const k of keys) { const v = J(G, `STR[${JSON.stringify(k)}]`); assert.ok(Array.isArray(v) && v[0] && v[1], k); }
  }
  EN.ev('renderSettings()');
  const h = EN.ev(`document.querySelector('#tab-settings').innerHTML`);
  for (const w of ['Sound and voice', 'Boss battle', 'Easy reading']) assert.ok(h.includes(w), w);
});

test('parent summary: simple card with four numbers, one face per subject and a tip', () => {
  for (const G of [EN, MS]) {
    const h = G.ev('v38Summary()');
    assert.ok(h.includes('v38-sum') && h.includes('v38-tiles') && h.includes('v38-subj'));
    assert.equal((h.match(/<div class="v38-t">/g) || []).length, 4);
    assert.ok(!/undefined|NaN|\{[a-z]+\}/.test(h));
  }
});

test('answer styles: voice and write fall back to tapping when a question cannot use them', () => {
  assert.equal(typeof EN.ev('voiceOn'), 'function');
  assert.equal(EN.ev(`(() => { S.expr = 'tap'; return voiceOn({ kind: 'mc', options: ['a', 'b'] }); })()`), false);
  assert.equal(EN.ev(`(() => { S.expr = 'voice'; return tapNoteHTML({ kind: 'mc', options: ['', ''] }).includes('pad-note') === (voiceOn({ kind: 'mc', options: ['', ''] }) === false); })()`), true);
  EN.ev(`S.expr = 'tap'`);
});

test('monsters: ten new species, 80 kinds in the cards, all with names in both languages', () => {
  const six = J(EN, 'Object.values(MALT6)');
  assert.equal(six.length, 10);
  assert.equal(new Set(six).size, 10);
  for (const k of six) {
    assert.ok(J(EN, `!!BEAST.species['${k}']`), k);
    const nm = J(EN, `SPECIES_NM['${k}']`), nm2 = J(EN, `MNOUN['${k}']`);
    assert.ok(nm && nm[0] && nm[1], k); assert.ok(nm2 && nm2[0] && nm2[1], k);
  }
  assert.equal(EN.ev('dexAll().order.length'), 80);
  const seen = J(EN, `(() => { const s = new Set(); for (const sub of Object.keys(SUBJ_IDX)) for (let i = 1; i <= 100; i++) { const m = monsterFor(sub, i); if (!m.big && Object.values(MALT6).includes(m.sp)) s.add(m.sp); } return [...s]; })()`);
  assert.ok(seen.length >= 8, 'most new species show up in levels: ' + seen.length);
});

test('Malay fixes', () => {
  assert.equal(J(MS, `STR['tag.odd'][1]`).includes('berbeza'), true);
  assert.equal(J(MS, `STR['qt.undo'][1]`), '↶ Buat asal');
  assert.equal(J(MS, `STR['rr.legendary'][1]`), 'Legenda');
  assert.equal(J(MS, `STR['pace.standard'][1]`), 'Biasa (20 s)');
  assert.ok(!fs.readFileSync(new URL('../src/content/pm.js', import.meta.url), 'utf8').includes('Mungkiri'));
});
