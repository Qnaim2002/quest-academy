/* Tests for v25: smoother stories, Studies modals close, flashcards removed, more (and all different) Armory gear,
   a still Armory when switching slots, and the Pet Haven tabs. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 2 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));
const SLOTS = ['knight', 'weapon', 'shield', 'cape', 'aura', 'pet', 'finisher'];

test('the Armory has the new gear in every slot, named in both languages', () => {
  const n = J(`Object.fromEntries(${JSON.stringify(SLOTS)}.map(s => [s, ITEMS.filter(i => i.slot === s).length]))`);
  assert.deepEqual(n, { knight: 8, weapon: 23, shield: 19, cape: 18, aura: 15, pet: 24, finisher: 13 });
  for (const s of SLOTS) {
    const it = J(`ITEMS.filter(i => i.slot === '${s}').map(i => [i.id, i.en, i.ms])`);
    assert.equal(new Set(it.map((x) => x[0])).size, it.length, s + ' ids');
    assert.equal(new Set(it.map((x) => x[1])).size, it.length, s + ' English names');
    assert.equal(new Set(it.map((x) => x[2])).size, it.length, s + ' Malay names');
    it.forEach(([id, en, ms]) => assert.ok(en && ms, id));
  }
  assert.ok(G.ev("ITEMS.filter(i => i.slot === 'weapon').every((w, i, a) => !i || w.power > a[i - 1].power)"), 'every weapon is stronger than the one before');
  const g = J("ITEMS.filter(i => i.slot === 'shield' && i.guard).map(i => Math.round(i.guard * 100))");
  assert.equal(new Set(g).size, g.length, 'no two shields show the same guard %');
});

test('no two pieces of gear look the same, on any knight', () => {
  const r = J(`(() => {
    const hash = eq => { const [, rc] = PX.job.hero(eq); const d = PX.sheetImageOnly(...rc()).img.data; let h = 0; for (let i = 0; i < d.length; i += 3) h = (h * 31 + d[i]) | 0; return h; };
    const base = { ...DEFAULT_EQUIP, pet: 'pet_none', aura: 'aura_none', cape: 'cape_none', shield: 'shield_none', weapon: 'weapon_pencil' }, dup = [], kn = [];
    for (const k of ITEMS.filter(i => i.slot === 'knight').map(i => i.id)) {
      kn.push(hash({ ...base, knight: k }));
      for (const slot of ['weapon', 'shield', 'cape', 'aura', 'helmet', 'chest', 'gloves', 'legs']) {
        const seen = new Map();
        for (const it of ITEMS.filter(i => i.slot === slot)) { const h = hash({ ...base, knight: k, [slot]: it.id }); if (seen.has(h)) dup.push(k + ': ' + seen.get(h) + ' = ' + it.id); else seen.set(h, it.id); }
      }
    }
    return { dup, kn: new Set(kn).size };
  })()`);
  assert.deepEqual(r.dup, []);
  assert.equal(r.kn, 8, 'eight different knights');
});

test('every pet has its own drawing and a perk; the five new pets are drawn fresh', () => {
  const p = J(`ITEMS.filter(i => i.slot === 'pet' && i.id !== 'pet_none').map(i => [i.id, petBase(i.id), !!PET_PERK[i.id]])`);
  assert.equal(new Set(p.map((x) => x[1])).size, p.length);
  p.forEach(([id, art, perk]) => { assert.ok(art.length > 200, id); assert.ok(perk, id); });
  for (const id of ['pet_frog', 'pet_octopus', 'pet_elephant', 'pet_orangutan', 'pet_hornbill']) assert.notEqual(G.ev(`petBase('${id}')`), G.ev(`basePetOld('${id}')`), id);
});

test('every finisher has its own emoji, sound and animation', () => {
  const f = J("ITEMS.filter(i => i.slot === 'finisher').map(i => [i.id, i.fem, typeof FIN_SFX[i.id]])");
  assert.equal(new Set(f.map((x) => x[1])).size, f.length, 'emoji');
  f.forEach(([id, , snd]) => assert.equal(snd, 'function', id));
  const src = readFileSync(new URL('../src/parts/11e-finishers.js', import.meta.url), 'utf8');
  f.filter(([id]) => id !== 'fin_starfall').forEach(([id]) => assert.ok(src.includes(`case '${id}'`), id + ' animation'));
  assert.equal(new Set(J('Object.values(FIN_SFX).map(f => f.toString())')).size, f.length, 'sounds differ');
});

test('Studies: flashcards are gone and every lesson sheet closes', () => {
  /* v31: the file may still sit in an old folder (an update zip cannot delete it); the build and tests skip it */
  assert.ok(!existsSync(new URL('../src/parts/10c-flashcards.js', import.meta.url)) || readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8').includes("'10c-flashcards.js'"));
  assert.equal(G.ev("typeof renderFlash"), 'undefined');
  G.ev("UI.trace = 'x'; UI.prac = { q: 1 }; UI.open = 'm_count'; closeLessonSheet()");
  assert.deepEqual(J('[UI.trace, UI.prac, UI.open]'), [null, null, null]);
});

test('Pet Haven has three chip tabs: your pets, furniture & deco, themes', () => {
  assert.deepEqual(J('HV_TABS.map(x => x[0])'), ['pets', 'furn', 'themes']);
  for (const [, , k] of J('HV_TABS')) { G.ev("S.lang = 'en'"); const en = G.ev(`t('${k}')`); G.ev("S.lang = 'ms'"); const ms = G.ev(`t('${k}')`); G.ev("S.lang = 'en'"); assert.ok(en && ms && en !== k && en !== ms, k); }
});

test('stories get their pictures ready ahead of time', () => {
  assert.equal(G.ev("typeof comicPrep"), 'function');
  const m = J("comicMons({ z: 2, subj: 'math', mode: 'boss' }).map(x => x.n)");
  assert.ok(m.length >= 1, 'a boss story warms up its boss');
  assert.notEqual(G.ev('comicPreKey(1)'), G.ev('comicPreKey(2)'));
  const css = readFileSync(new URL('../src/css/14-v22.css', import.meta.url), 'utf8');
  assert.ok(!css.includes('titleShine'), 'no endless background-clip shine on the title card');
});
