/* Tests for v29: the stories are scripted cutscenes (src/content/cutscenes/b1-b4.js, played by 25-v29-cutscenes.js). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 3 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));
const SHOTS = ['wide', 'walk', 'prob', 'owl', 'hero', 'foe', 'win', 'lair', 'reveal', 'ready', 'vbeat', 'vfix', 'vnext', 'finale', 'talk', 'close', 'clash', 'item', 'crowd', 'dark', 'travel', 'villain'];
const MODES = { c: 'chapter', b: 'boss', v: 'victory' };

test('every age has a full cutscene for every chapter, boss intro and victory, in English and Malay', () => {
  const C = J('CUTS');
  for (const band of ['1', '2', '3', '4']) for (let z = 0; z < 10; z++) {
    const Z = C[band][z]; assert.ok(Z, `band ${band} zone ${z}`);
    assert.ok(Z.c.length >= 9, `chapter ${band}:${z} has ${Z.c.length} beats`); assert.ok(Z.b.length >= 4); assert.ok(Z.v.length >= 4);
    assert.ok(new Set(Z.c.map(b => b[0])).size >= 5, `chapter ${band}:${z} uses at least five kinds of shot`);
    for (const k of ['c', 'b', 'v']) for (const [shot, spk, en, ms] of Z[k]) {
      assert.ok(SHOTS.includes(shot), `${band}:${z}:${k} shot ${shot}`);
      assert.match(spk, /^(n|h|o|v|m|b|p|x:[^:]+:[^:]+:[^:]+)$/, `${band}:${z}:${k} speaker ${spk}`);
      assert.ok(en && ms && en !== ms, `${band}:${z}:${k} text: ${en}`);
      for (const s of [en, ms]) { const ph = (s.match(/\{(\w+)\}/g) || []).filter(x => !['{hero}', '{boss}', '{z}', '{next}', '{pet}'].includes(x)); assert.deepEqual(ph, [], s); }
      if (k === 'v' && z === 9) assert.ok(!/\{next\}/.test(en));
    }
    assert.equal(Z.v[Z.v.length - 1][0], z === 9 ? 'finale' : Z.v[Z.v.length - 1][0], 'the last victory ends with the finale');
  }
});

test('the villain is only named after the meeting in zone 5', () => {
  const C = J('CUTS');
  for (const band of ['1', '2', '3', '4']) for (let z = 0; z < 4; z++) for (const k of ['c', 'b', 'v']) for (const [, spk, en] of C[band][z][k]) assert.notEqual(spk, 'v', `${band}:${z}:${k} ${en}`);
});

test('stories play as cutscenes: captions, pictures and dialogue boxes, with and without a pet, in both looks', () => {
  for (const band of [1, 2, 3, 4]) for (const lang of ['en', 'ms']) for (const pix of [true, false]) for (const pet of ['pet_none', null]) {
    G.ev(`S.band = ${band}; S.lang = '${lang}'; S.pixel = ${pix}; ${pet ? `S.equipped.pet = '${pet}'` : `S.equipped.pet = ITEMS.find(i => i.slot === 'pet' && i.id !== 'pet_none').id`}`);
    for (let z = 0; z < 10; z += 3) for (const mode of Object.values(MODES)) {
      const caps = J(`comicCaps(${z}, 'math', '${mode}')`), raw = J(`cutRaw(${z}, '${mode}', S.band, 'math')`);
      assert.equal(caps.length, 1 + raw.filter(b => b[1] !== 'p' || !pet).length);
      caps.forEach(c => assert.ok(!/[{}]|undefined|null/.test(c), c));
      for (let i = 1; i < caps.length; i++) {
        G.ev(`UI.comic = { z: ${z}, subj: 'math', mode: '${mode}', i: ${i} }`);
        const svg = J(`cineScene(${z}, ${i - 1}, 'math', false, '${mode}')`); assert.ok(svg.startsWith('<svg') && !/undefined|NaN/.test(svg), `${band} ${z} ${mode} ${i}`);
        const d = J(`cineDialog(UI.comic, ${JSON.stringify(caps[i])})`), spk = J(`cutBeats(${z}, 'math', '${mode}')[${i - 1}].spk`);
        assert.ok(spk === 'n' ? d.includes('narr') : d.includes('cn-who'), `${spk}: ${d.slice(0, 80)}`);
      }
      G.ev('UI.comic = null');
    }
  }
  G.ev("S.band = 3; S.lang = 'en'; S.pixel = true; S.equipped.pet = 'pet_none'");
});

test('the camera follows the shot, and the new stories play once more for everyone', () => {
  assert.equal(J("cineKindsOf(0, 'chapter')[0]"), J('CUTS[3][0].c[0][0]'));
  assert.equal(G.ev("comicKey('math', 0)").split(':')[0], 'cine5'); assert.equal(G.ev("bossStoryKey('math', 0)").split(':')[0], 'boss4');
  assert.ok(J("cineMs({ z: 0, subj: 'math', mode: 'chapter', i: 1 })") >= 4200);
});
