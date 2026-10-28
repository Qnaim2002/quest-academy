/* Tests for v23: names that match monsters, on-subject questions, lesson practice, new gear and species. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 2 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));

test('every monster name says what the monster is, in both languages', () => {
  for (const lang of ['en', 'ms']) {
    G.setLang(lang);
    const bad = J(`(() => { const li = ${lang === 'ms' ? 1 : 0}, out = []; for (const s of SUBJ_ORDER) for (let n = 1; n <= 100; n++) { const m = monsterFor(s, n), noun = MNOUN[monKind(m)][li]; if (!m.n.includes(noun)) out.push(s + n + ' ' + m.n); } return out; })()`);
    assert.deepEqual(bad, []);
  }
  G.setLang('en');
  assert.match(G.ev("monsterFor('math', 10).n"), / the /, 'zone bosses read "<Boss> the <word>"');
  assert.match(G.ev("monsterFor('math', 5).n"), /^Captain /);
  assert.ok(G.ev("monsterFor('math', 3).seed.length > 0"), 'the art keeps a stable seed');
});

test('true or false questions stay in their own subject', () => {
  const called = G.ev("t('tf.called', { w: '@@' })").split('@@')[0], colour = G.ev("t('tf.colour', { c: '@@' })").split('@@')[0];
  for (const subj of ['math', 'sc', 'pm', 'pk', 'se', 'fk', 'mz']) for (const band of [1, 2, 3, 4]) {
    const texts = J(`Array.from({ length: 80 }, () => { const q = QT.pickFor({ subj: '${subj}', n: 3, boss: false }, ${band}); return q && q.kind === 'tf' ? q.text : ''; })`);
    texts.filter(Boolean).forEach((x) => { assert.ok(!x.startsWith(called), `${subj}: ${x}`); assert.ok(!x.startsWith(colour), `${subj}: ${x}`); });
  }
});

test('lesson practice uses questions about the lesson itself', async () => {
  await G.ev('Promise.all(SUBJ_ORDER.map(s => ensureLessons(s)))');
  const weak = ['math2_heavylight', 'math2_patternabc', 'bm2_anggota', 'bm2_salam', 'bm2_digraf', 'bm2_bulan', 'bm2_pantun', 'en_sentence', 'en2_thisthat', 'en2_digraph', 'en2_magice', 'en2_wh', 'en2_story', 'pk2_costumes', 'fk2_sleep', 'fk2_sunsafe', 'sv2_mask', 'mz2_same'];
  for (const id of weak) assert.ok(G.ev(`lessonPool(MODULES.find(m => m.id === '${id}')).length`) >= 3, id);
  /* times-table lessons practise groups, not adding */
  const txt = J(`(() => { S.band = 3; const m = MODULES.find(x => x.id === 'm_times'); return [0, 1, 2, 3].map(() => lessonQ(m, new Set()).text); })()`);
  txt.forEach((x) => assert.match(x, /each|groups|rows|share|equal/i, x));
});

test('the Armory has 21 new pieces of gear with names in both languages', () => {
  const ids = ['weapon_keris', 'weapon_trident', 'weapon_crystal', 'weapon_leaf', 'weapon_thunder', 'weapon_moon', 'shield_batik', 'shield_turtle', 'shield_moon', 'shield_tiger', 'shield_crystal',
    'cape_ocean', 'cape_tiger', 'cape_batik', 'cape_night', 'wings_phoenix', 'aura_leaves', 'aura_bubbles', 'aura_snow', 'aura_fire', 'aura_rainbow'];
  for (const id of ids) { const it = J(`ITEM['${id}']`); assert.ok(it && it.cost > 0 && it.en && it.ms, id); }
  assert.ok(G.ev("ITEMS.filter(i => i.slot === 'weapon').every((w, i, a) => !i || w.power >= a[i - 1].power)"), 'weapons get stronger in shop order');
});

test('ten more species draw in every colour set and each has a quirk', () => {
  const sp = J('Object.values(MALT3)');
  assert.equal(new Set(sp).size, 10);
  for (const s of sp) {
    assert.ok(G.ev(`!!QUIRKS['${s}'] && !!SPECIES_NM['${s}'] && !!MNOUN['${s}']`), s);
    for (let c = 0; c < 4; c++) assert.ok(G.ev(`MON2.parts({ b: 'blob', c: ${c}, e: 'two', m: 'teeth', f: ['crown'], t: 1, sp: '${s}' }).length`) > 8, s + c);
  }
});
