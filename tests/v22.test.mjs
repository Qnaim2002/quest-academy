/* Tests for v22: the new question types, finishers and balance. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 2 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));

test('new question types: every subject and age gets sound questions in both languages', () => {
  for (const lang of ['en', 'ms']) {
    G.setLang(lang);
    for (const subj of G.SUBJ_ORDER) for (const band of [1, 2, 3, 4]) for (const kind of ['tfQ', 'oddQ', 'matchQ', 'orderQ']) for (let i = 0; i < 25; i++) {
      const q = J(`(() => { const q = QT.${kind}('${subj}', ${band}); return q && { kind: q.kind, text: q.text, options: q.options, correct: q.correct, items: q.items, pairs: q.pairs, tray: q.tray, why: q.why }; })()`);
      if (!q) continue;
      const where = `${lang} ${subj} age ${band + 3} ${kind}: ${q.text}`;
      assert.ok(q.text && !/undefined|NaN|\{[a-z]+\}/.test(q.text), where);
      assert.ok(q.options.every((o) => o && !/undefined|NaN/.test(String(o))), `${where} options ${q.options}`);
      assert.equal(new Set(q.options).size, q.options.length, `${where} repeated option ${q.options}`);
      if (q.kind === 'tf') { assert.equal(q.options.length, 2); assert.ok(q.correct === 0 || q.correct === 1); }
      if (q.kind === 'odd') { assert.equal(q.options.length, 4, where); assert.ok(q.correct >= 0 && q.correct < 4, where); assert.ok(q.why && !/undefined/.test(q.why), where); }
      if (q.kind === 'order') { assert.ok(q.items.length >= 2, where); assert.deepEqual([...q.tray].sort(), q.items.map((_, k) => k).sort(), where); assert.ok(q.tray.some((v, k) => v !== k), `${where}: tray already in order`); }
      if (q.kind === 'match') { assert.ok(q.pairs.length >= 3, where); assert.equal(new Set(q.pairs.map((p) => p[1])).size, q.pairs.length, `${where} repeated picture`); }
    }
  }
  G.setLang('en');
});

test('true or false statements about sums are right', () => {
  for (let i = 0; i < 300; i++) {
    const q = J(`(() => { const q = QT.tfQ('math', 2); return { text: q.text, correct: q.correct }; })()`);
    const m = q.text.match(/^(\d+) \+ (\d+) = (\d+)$/); if (m) assert.equal(+m[1] + +m[2] === +m[3], q.correct === 0, q.text);
    const b = q.text.match(/^(\d+) is bigger than (\d+)\.$/); if (b) assert.equal(+b[1] > +b[2], q.correct === 0, q.text);
  }
});

test('finishers: thirteen to collect (v25), one free, every finisher has a sound', () => {
  const f = J(`ITEMS.filter(i => i.slot === 'finisher').map(i => ({ id: i.id, cost: i.cost, fem: i.fem, snd: typeof FIN_SFX[i.id] }))`);
  assert.equal(f.length, 13);
  assert.equal(f.filter((x) => x.cost === 0).length, 1);
  f.forEach((x) => { assert.ok(x.fem); assert.equal(x.snd, 'function', x.id); });
  assert.equal(G.ev('DEFAULT_EQUIP.finisher'), 'fin_starfall');
  assert.ok(G.ev("S.owned.includes('fin_starfall')"), 'the free finisher is owned from the start');
});

test('balance: monsters are tougher in later zones and hit harder than before', () => {
  const hp = (id) => G.ev(`(() => { const l = getLevel('${id}'); return Math.round(l.rounds * (BAL.hpRound + l.z * BAL.hpZone)); })()`);
  assert.ok(hp('math:1') >= 80, 'level 1 is at least as tough as v21 (80)');
  assert.ok(hp('math:100') > hp('math:50') && hp('math:50') > hp('math:5'));
  assert.ok(hp('math:100') >= 300, 'the last zone boss has 300+ health');
  assert.ok(G.ev("getLevel('math:1').chip") >= 7);
});

test('bestiary: ten new species, each draws every palette, and a third of levels use them', () => {
  const sp = J('Object.values(MALT2)');
  assert.equal(new Set(sp).size, 10);
  for (const s of sp) {
    assert.ok(G.ev(`!!BEAST.species[${JSON.stringify(s)}]`), s);
    for (let c = 0; c < 4; c++) assert.ok(G.ev(`MON2.parts({ b: 'blob', c: ${c}, e: 'two', m: 'teeth', f: ['crown', 'scarf'], t: 1, sp: ${JSON.stringify(s)} }).length`) > 8, s + c);
  }
  const share = G.ev(`(() => { let k = 0, n = 0; for (const s of Object.keys(SUBJ_IDX)) for (let i = 1; i <= 100; i++) { const m = monsterFor(s, i); if (m.big) continue; n++; if (Object.values(MALT2).includes(m.sp)) k++; } return k / n; })()`);
  assert.ok(share > .11 && share < .27, 'share ' + share);
});

test('monster cards: every monster has a named species, old clears give cards, a win adds one once', () => {
  assert.equal(G.ev('dexAll().order.length'), 80);
  assert.equal(G.ev('dexAll().order.reduce((s, k) => s + dexAll().by[k].length, 0)'), 1000);
  assert.ok(G.ev('dexAll().order.every(k => SPECIES_NM[k] && SPECIES_NM[k][0] && SPECIES_NM[k][1])'));
  G.ev(`(() => { S.dex = undefined; S.dexV = undefined; S.clear = { 'math:3:4': 1 }; S.stars = { 'bm:2:7': 2 }; })()`);
  assert.deepEqual(J('Object.keys(dex()).sort()'), ['bm:7', 'math:4']);
  assert.equal(G.ev("dexAdd(getLevel('math:5'))"), true);
  assert.equal(G.ev("dexAdd(getLevel('math:5'))"), false, 'only the first defeat');
  assert.equal(G.ev('dexNew()'), 1);
});

test('the sprite worker is built with every file that adds monster species', async () => {
  const { readFileSync, readdirSync } = await import('node:fs');
  const cfg = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  const dir = new URL('../src/parts/', import.meta.url);
  for (const f of readdirSync(dir)) {
    const src = readFileSync(new URL(f, dir), 'utf8');
    if (/BEAST\.species|const BEAST =/.test(src) && !f.startsWith('19-') && !f.startsWith('11d') && !f.startsWith('14c')) assert.ok(cfg.includes(`'${f}'`), f + ' must be in WORKER_PARTS');
  }
});
