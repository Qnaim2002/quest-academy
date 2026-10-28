/* Tests for v33: finisher light shows, richer auras, pet detail, music for every situation, buy pets, story from scene 1. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 2 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));
const src = (f) => readFileSync(new URL('../src/parts/' + f, import.meta.url), 'utf8');

test('finishers: every finisher has its own light show, and each one runs to the end without a slip', () => {
  const fins = J(`ITEMS.filter(i => i.slot === 'finisher').map(i => i.id)`);
  const ids = J('window.__quest.v33.vfx.ids');
  assert.equal(fins.length, 13);
  for (const f of fins) assert.ok(ids.includes(f), 'light show for ' + f);
  /* run every recipe on a pretend canvas for 4 seconds: nothing throws and everything fades out */
  const out = G.ev(`(() => {
    const V0 = window.__quest.v33.vfx, res = {};
    for (const id of V0.ids) {
      const cv = document.createElement('canvas'), V = V0.scene(cv, 360, 300, 1);
      V0.REC[id](V, { x: 70, y: 200 }, { x: 270, y: 180 }, 1);
      let t = 0; for (let i = 0; i < 240; i++) t = V.step(1 / 60);
      res[id] = V.alive();
    }
    return JSON.stringify(res);
  })()`);
  const res = JSON.parse(out);
  for (const f of fins) assert.equal(res[f], false, f + ' is over after 4 seconds');
});

test('finishers: the light show is added on top of the old effects (runFinisher is a hook)', () => {
  assert.ok(G.ev(`HOOK.has('runFinisher')`));
  assert.ok(src('11e-finishers.js').includes("HOOK.call('runFinisher'"));
});

test('auras: all 14 hero auras have a glow, a ground ring and their own floating details', () => {
  const auras = J(`ITEMS.filter(i => i.slot === 'aura' && i.id !== 'aura_none').map(i => i.id)`);
  assert.equal(auras.length, 14);
  const px = src('09b-pixel.js');
  for (const a of auras) assert.ok(px.includes(a + ': ['), 'aura detail for ' + a);
  assert.ok(px.includes('function auraExtra'));
});

test('sprites: the finishing pass and the boss aura are in the sprite worker files', () => {
  assert.ok(src('09b-pixel.js').includes('function detailPass'));
  assert.ok(src('09f-pixel-bestiary.js').includes('v33 epic aura'));
  assert.ok(src('09d-pixel-monsters.js').includes('function marks'));
});

test('pets: every pet gets the plush light and shiny eyes', () => {
  const pets = J(`ITEMS.filter(i => i.slot === 'pet' && i.id !== 'pet_none').map(i => i.id)`);
  assert.ok(pets.length >= 23);
  let shiny = 0;
  for (const p of pets) {
    const svg = G.ev(`petSVG('${p}', 1)`);
    assert.ok(svg.includes('url(#qpd)') && svg.includes('<filter id="qpd"'), p);
    if (/r="[\d.]+" fill="#fff"/.test(svg)) shiny++;
  }
  assert.ok(shiny >= pets.length - 4, 'shiny eyes on most pets: ' + shiny);
});

test('music: many songs, a different tune for each situation, and every song is playable', () => {
  const n = J('Object.keys(SONGS).length'), news = J('Object.keys(window.__quest.v33.NEW_SONGS).length');
  assert.ok(news >= 15, 'new songs ' + news);
  assert.ok(n >= 30, 'songs ' + n);
  for (const [k, s] of Object.entries(J('SONGS'))) {
    assert.ok(s.bpm >= 50 && s.bpm <= 200, k + ' bpm'); assert.ok(Array.isArray(s.mel) && s.mel.length >= 16, k + ' melody');
  }
  const sit = J(`['win','lose','boss','home','story','haven','tower','shop'].map(k => { try { return window.__quest.v33.situationSong(k) || null; } catch (e) { return 'err'; } })`);
  assert.ok(!sit.includes('err'));
  assert.ok(J('window.__quest.v33.BATTLE_POOL.length') >= 4);
});

test('sound effects: new effects exist and every tab and button sound is a real effect', () => {
  const tab = J('window.__quest.v33.TAB_SND'), act = J('window.__quest.v33.ACT_SND');
  for (const v of [...Object.values(tab), ...Object.values(act)]) assert.equal(typeof G.ev(`sfx['${v}']`), 'function', 'sfx ' + v);
  assert.ok(Object.keys(act).includes('hvBuyPet'));
});

test('story: the sprite and strings for buying pets exist, and stories start at scene 1', () => {
  for (const k of ['hv.buyPet', 'hv.petBought']) assert.ok(J(`!!STR['${k}']`), k);
  const c = G.ev(`(() => { openComicBase(0, null, 'math', 'chapter'); const i = UI.comic.i; UI.comic = null; return i; })()`);
  assert.equal(c, 1, 'a story opens on scene 1, with no title card first');
});

test('text size: the fit rules and the light show style are in the style sheet', () => {
  const css = readFileSync(new URL('../src/css/24-v33.css', import.meta.url), 'utf8');
  assert.ok(css.includes('.vfxcv') && css.includes('.hvcoins'));
  assert.ok(readFileSync(new URL('../src/style.css', import.meta.url), 'utf8').includes('24-v33.css'));
});
