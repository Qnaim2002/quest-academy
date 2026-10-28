/* Tests for v26: quicker tabs, odd-one-out questions that say what the group is, and four new connected sagas. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 2 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));

test('odd one out says what three of the pictures have in common, in both languages', () => {
  for (const lang of ['en', 'ms']) {
    G.ev(`S.lang = '${lang}'`);
    for (const s of ['math', 'bm', 'en', 'sc', 'pm', 'pk', 'se', 'fk', 'sv', 'mz']) for (const b of [1, 3]) {
      const q = J(`(() => { const q = QT.oddQ('${s}', ${b}); return { text: q.text, o: q.options, c: q.correct }; })()`);
      assert.match(q.text, lang === 'en' ? /^Three of these .+ Which one is NOT .+\?$/ : /^Tiga daripada .+ Yang manakah BUKAN .+\?$/, q.text);
      assert.equal(q.o.length, 4); assert.ok(q.c >= 0);
    }
  }
  G.ev("S.lang = 'en'");
});

test('four different sagas, ten connected chapters each, every line in English and Malay', () => {
  const sg = J('Object.fromEntries([1, 2, 3, 4].map(b => [b, sagaOf(b)]))');
  const titles = new Set(), lines = new Map();
  for (const b of ['1', '2', '3', '4']) {
    const s = sg[b]; titles.add(s.title[0]);
    assert.ok(s.title[1] && s.vname[0] && s.prog.length === 3 && s.beat[1] && s.fin[1], b);
    assert.equal(s.zones.length, 10);
    s.zones.forEach((z, i) => {
      assert.equal(z.story.length, 6, b + ':' + i); assert.equal(z.boss.length, 3, b + ':' + i);
      assert.ok(z.vict && z.vict.fix[0] && z.vict.fix[1], b + ':' + i);
      if (i < 9) assert.ok(z.vict.next[0].includes('{next}') && z.vict.next[1].includes('{next}'), b + ':' + i + ' points to the next zone');
      for (const p of [...z.story, ...z.boss]) { assert.ok(p[0] && p[1]); const k = p[0]; assert.ok(!lines.has(k) || lines.get(k) === b, 'line shared by two ages: ' + k); lines.set(k, b); }
    });
  }
  assert.equal(titles.size, 4);
  assert.match(sg[1].title[0], /Wonder/); assert.match(sg[2].title[0], /Lone Knight/); assert.match(sg[3].title[0], /King/); assert.equal(sg[4].villain, 'demon');
  /* the progress counts up through the saga: victory n mentions n */
  for (const b of ['3', '4']) sg[b].zones.forEach((z, i) => assert.ok(z.vict.fix[0].includes(String(i + 1) + ' of 10'), b + ':' + i));
});

test('every story caption is filled in (hero, boss, next zone) for every age, zone and story kind', () => {
  const bad = J(`(() => { const out = []; for (const lang of ['en', 'ms']) for (const b of [1, 2, 3, 4]) { S.lang = lang; S.band = b;
    for (let z = 0; z < 10; z++) for (const mode of ['chapter', 'boss', 'victory']) comicCaps(z, 'math', mode).forEach(c => { if (/[{}]|undefined|null/.test(c)) out.push(c); }); }
    S.lang = 'en'; S.band = 2; return out; })()`);
  assert.deepEqual(bad, []);
  assert.equal(G.ev("storyFill('{hero} waves. Then {hero} smiles.')").split(' ')[0].charAt(0), G.ev("storyFill('{hero}')").charAt(0).toUpperCase());
  assert.equal(G.ev("comicKey('math', 0)").split(':')[0], 'cine5', 'new stories play fresh (v29: cutscenes)');
});

test('villains: Drakmor is drawn, and each saga sets how its villain looks', () => {
  assert.deepEqual(J('[1, 2, 3, 4].map(b => sagaOf(b).vfin)'), [false, false, false, true]);
  const px = G.ev('S.pixel'); G.ev('S.pixel = false');
  const v = J("[villainSVG(false, 4), villainSVG(true, 4)]"); G.ev(`S.pixel = ${px}`);
  assert.ok(v[0].startsWith('<svg') && v[0] !== v[1] && v[1].includes('stroke-dasharray'), 'sealed Drakmor is chained');
  G.ev('S.band = 4'); assert.equal(G.ev("villainSad(9, 'finale')"), true); G.ev('S.band = 1'); assert.equal(G.ev("villainSad(9, 'finale')"), 'happy'); G.ev('S.band = 2');
});

test('tabs change quickly and the Cards tab draws its monsters after it opens', () => {
  const css = readFileSync(new URL('../src/css/12-royal.css', import.meta.url), 'utf8');
  const m = css.match(/\.tab\.on\{animation:pxTabIn ([.\d]+)s/); assert.ok(m && +m[1] <= .16, 'pixel tab animation is short');
  assert.ok(!/pxTabIn [.\d]+s steps/.test(css), 'no stepped (choppy) tab animation');
  const src = readFileSync(new URL('../src/parts/14c-collection.js', import.meta.url), 'utf8');
  assert.ok(src.includes('lazyMon(') && src.includes('flushLazyMon()'));
});
