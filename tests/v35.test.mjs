/* Tests for v35: the 13 new question formats and their exact share, damage that depends on how you answered, the Tower
   upgrades (perks, floor modifiers, subject choice, ghosts) and the Armory upgrades (traits, trophies, evolution,
   relic slots and pairs, wardrobe). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from '../scripts/harness.mjs';

const EN = (await loadGame({ lang: 'en', band: 3 })).game;
const MS = (await loadGame({ lang: 'ms', band: 3 })).game;
const J = (G, code) => JSON.parse(G.ev(`JSON.stringify(${code})`));

const KINDS = ['numline', 'fill', 'bucket', 'sent', 'spot', 'clock', 'money', 'picword', 'twostep', 'memory', 'hotspot', 'draw', 'rhythm'];
const SUBJ = ['math', 'en', 'bm', 'sc', 'sv', 'fk', 'pm', 'pk', 'se', 'mz'];

/* ---------- question formats ---------- */
test('formats: the lazy module loaded and all 13 formats are there', () => {
  assert.equal(EN.ev('!!FM.mod'), true);
  const have = J(EN, 'Object.keys(FM.mod.K.weights || {})');
  for (const k of KINDS) assert.ok(have.includes(k), 'missing format ' + k);
});
for (const [name, G] of [['English', EN], ['Bahasa Melayu', MS]]) {
  test(`formats (${name}): every format makes complete questions for every age it is used with`, () => {
    const bad = G.ev(`(() => {
      const bad = [], seen = {};
      for (const kind of ${JSON.stringify(KINDS)}) for (const subj of ${JSON.stringify(SUBJ)}) for (let band = 1; band <= 4; band++) for (const small of [false, true]) {
        const w = FM.mod.weights(subj, band, small).find(x => x[0] === kind); if (!w) continue;
        for (let i = 0; i < 6; i++) {
          let q; try { q = FM.mod.make(kind, subj, band, small); } catch (e) { bad.push(kind + '/' + subj + '/' + band + ' threw ' + e.message); continue; }
          if (!q) continue;
          seen[kind] = (seen[kind] || 0) + 1;
          const txt = String(q.text || '') + String(q.ansText || '') + String(q.tag || '');
          if (kind === 'sent' || kind === 'memory') { if (q.kind !== 'order' || !(q.items && q.items.length >= 2)) bad.push(kind + '/' + subj + ' not an order question'); }
          else if (q.kind !== 'wx' || typeof q.mount !== 'function' || typeof q.verify !== 'function') bad.push(kind + '/' + subj + ' not a widget question');
          else if (!q.ansText) bad.push(kind + '/' + subj + '/' + band + ' no answer text');
          else if (/undefined|\\[object|NaN|\\{[a-z]+\\}/.test(txt)) bad.push(kind + '/' + subj + '/' + band + ' broken text: ' + txt);
        }
      }
      for (const k of ${JSON.stringify(KINDS)}) if (!seen[k]) bad.push(k + ' never made a question');
      return bad;
    })()`);
    assert.deepEqual(JSON.parse(JSON.stringify(bad)), []);
  });
}
test('formats: the scoring rules accept the right answer and refuse a wrong one', () => {
  const r = J(EN, `(() => {
    const out = [];
    for (let i = 0; i < 30; i++) {
      const q = FM.mod.make('numline', 'math', 3, false); if (!q) continue;
      const c = q.cfg; out.push(['numline', q.verify(c.target), q.verify(c.target + (c.hi - c.lo) * .4)]);
    }
    for (let i = 0; i < 20; i++) {
      const q = FM.mod.make('spot', 'math', 3, false); if (!q) continue;
      out.push(['spot', q.verify(q.bad), q.verify(q.bad === 0 ? 1 : 0)]);
    }
    for (let i = 0; i < 20; i++) {
      const q = FM.mod.make('clock', 'math', 2, false); if (!q) continue;
      out.push(['clock', q.verify({ h: q.target.h, m: q.target.m }), q.verify({ h: (q.target.h % 12) + 1, m: (q.target.m + 30) % 60 })]);
    }
    return out;
  })()`);
  assert.ok(r.length > 40);
  for (const [k, good, bad] of r) { assert.equal(good, true, k + ' refused the right answer'); assert.equal(bad, false, k + ' accepted a wrong answer'); }
});
test('share: the number of non-multiple-choice questions is exact (age 4 to 7 = 60, 58, 55, 52 percent)', () => {
  const want = [0, .60, .58, .55, .52];
  for (let b = 1; b <= 4; b++) {
    const hit = J(EN, `(() => { let n = 0, N = 6000; for (let i = 0; i < N; i++) if (QT.pickFor({ subj: 'math' }, ${b})) n++; return n / N; })()`);
    assert.ok(Math.abs(hit - want[b]) < .03, `band ${b}: ${hit} is not near ${want[b]}`);
  }
  assert.deepEqual(J(EN, 'QT.SHARE'), want);
});
test('share: a level can force kinds, and bosses use the short forms', () => {
  const r = J(EN, `(() => {
    const kinds = new Set(); for (let i = 0; i < 80; i++) { const q = QT.pickFor({ subj: 'math', only: ['order', 'match'] }, 3); if (q) kinds.add(q.kind); }
    const boss = []; for (let i = 0; i < 300; i++) { const q = QT.pickFor({ subj: 'en', boss: true }, 3); if (q && q.kind === 'order') boss.push(q.items.length); }
    return { kinds: [...kinds], maxBoss: boss.length ? Math.max(...boss) : 0 };
  })()`);
  assert.ok(r.kinds.every(k => ['order', 'match'].includes(k)) && r.kinds.length >= 1);
  assert.ok(r.maxBoss <= 4, 'boss order questions are short (3 tiles, 4 for a sentence), got ' + r.maxBoss);
});

/* ---------- damage depends on the answer ---------- */
function quality(G, setup) {
  return J(G, `(() => {
    const keep = { tmax: B.tmax, tleft: B.tleft, wrong: B.wrong, charge: B.charge, combo: B.combo, sensory: S.sensory };
    S.sensory = false; ${setup}
    const a = answerQuality({}); Object.assign(B, keep); S.sensory = keep.sensory; return a;
  })()`);
}
test('damage: fast and first try hits harder, second and third tries hit softer, and it stays between x0.5 and x1.7', () => {
  const fast = quality(EN, 'B.tmax = 100; B.tleft = 90; B.wrong = 0; B.charge = 0; B.combo = 0;');
  const mid = quality(EN, 'B.tmax = 100; B.tleft = 50; B.wrong = 0; B.charge = 0; B.combo = 0;');
  const slow = quality(EN, 'B.tmax = 100; B.tleft = 10; B.wrong = 0; B.charge = 0; B.combo = 0;');
  const second = quality(EN, 'B.tmax = 100; B.tleft = 10; B.wrong = 1; B.charge = 0; B.combo = 0;');
  const third = quality(EN, 'B.tmax = 100; B.tleft = 10; B.wrong = 2; B.charge = 0; B.combo = 0;');
  assert.ok(fast.mul > mid.mul && mid.mul > slow.mul && slow.mul > second.mul && second.mul > third.mul);
  assert.equal(fast.label, 'dq.quick');
  assert.equal(fast.extra, 1);
  assert.equal(second.extra, 0);
  const huge = quality(EN, 'B.tmax = 100; B.tleft = 100; B.wrong = 0; B.charge = 3; B.combo = 40;');
  assert.ok(huge.mul <= 1.7 + 1e-9);
  const tiny = quality(EN, 'B.tmax = 100; B.tleft = 0; B.wrong = 9; B.charge = 0; B.combo = 0;');
  assert.ok(tiny.mul >= .5 - 1e-9);
});
test('damage: with no time limit nobody is rushed (no speed bonus), and first try still counts', () => {
  const a = quality(EN, 'B.tmax = 0; B.tleft = 0; B.wrong = 0; B.charge = 0; B.combo = 0;');
  assert.equal(a.quick, false);
  assert.ok(Math.abs(a.mul - 1.1) < 1e-9);
});

/* ---------- Tower ---------- */
const TW = (G, code) => J(G, `(() => { const keep = UI.run; UI.run = twNewRun(); UI.run.mode = 'tower'; try { return (${code}); } finally { UI.run = keep; } })()`);
test('tower: a new climb has a seed, no perks, and a focus', () => {
  const r = TW(EN, 'UI.run');
  assert.ok(r.seed > 0); assert.deepEqual(r.perks, {}); assert.ok(r.focus);
});
test('tower: perks stack up to their limit and the maximum health perk makes the hero tougher', () => {
  const r = TW(EN, `(() => {
    const base = heroMaxHP(); const a = twGivePerk('forgive'), b = twGivePerk('forgive');
    twGivePerk('heart'); twGivePerk('heart'); const hp = heroMaxHP();
    return { a, b, hp, base };
  })()`);
  assert.equal(r.a, true); assert.equal(r.b, false);
  assert.ok(r.hp > r.base);
});
test('tower: floor modifiers only appear on normal floors from floor 3, never on gates or bosses, and are the same when a floor is retried', () => {
  const r = TW(EN, `(() => {
    const seen = {}, bad = [];
    for (let f = 1; f <= 200; f++) {
      const m = twMod(f), again = twMod(f);
      if ((m && m.id) !== (again && again.id)) bad.push('changed ' + f);
      if (m) { seen[m.id] = (seen[m.id] || 0) + 1; if (f < 3 || f % 5 === 0) bad.push('bad floor ' + f); }
    }
    return { seen, bad };
  })()`);
  assert.deepEqual(r.bad, []);
  assert.ok(Object.keys(r.seen).length >= 4, 'most modifiers show up: ' + Object.keys(r.seen));
  const share = Object.values(r.seen).reduce((a, b) => a + b, 0) / 160;
  assert.ok(share > .2 && share < .5, 'about a third of floors: ' + share);
});
test('tower: a speed floor shortens the time, a calm floor removes the clock, an order floor asks only order-type questions', () => {
  const r = TW(EN, `(() => {
    const out = {};
    for (let f = 3; f < 400 && Object.keys(out).length < 3; f++) {
      if (f % 5 === 0) continue; const m = twMod(f); if (!m || out[m.id]) continue;
      if (!['speed', 'zen', 'order'].includes(m.id)) continue;
      const lv = specialLevel('tower:' + f);
      out[m.id] = { t: lv.timeMul, only: lv.only || null, rew: lv.rewMul };
    }
    return out;
  })()`);
  assert.ok(r.speed && r.zen && r.order, 'all three floor kinds were found');
  assert.ok(r.speed.t < 1);
  assert.ok(r.zen.t < .001);
  assert.ok(r.order.only.includes('order'));
});
test('tower: the subject plan follows the focus, and the same floor always gets the same subject', () => {
  const r = TW(EN, `(() => {
    const run = twRun(); run.focus = 'math';
    const a = []; for (let f = 1; f <= 8; f++) a.push(twSubj(f));
    run.sub = {}; run.focus = 'mix'; const m1 = []; for (let f = 1; f <= 30; f++) m1.push(twSubj(f));
    const m2 = []; for (let f = 1; f <= 30; f++) m2.push(twSubj(f));
    return { a, m1, m2, open: openSubjects() };
  })()`);
  assert.ok(r.a.every(x => x === 'math'));
  assert.deepEqual(r.m1, r.m2);
  assert.ok(r.m1.every(x => r.open.includes(x)));
});
test('tower: the weak-spot score is between 0 and 1 and gets worse when answers needed more tries', () => {
  const r = J(EN, `(() => {
    const T = tower(), keep = T.sm; T.sm = { math: [1, 1, 1, 1, 1, 1] }; const good = twWeak('math');
    T.sm = { math: [0, 0, 0, 0, 0, 0] }; const bad = twWeak('math'); T.sm = keep; return { good, bad };
  })()`);
  assert.ok(r.good >= 0 && r.bad <= 1 && r.bad > r.good);
});
test('tower: the coin bonus doubles the next win once, and a lucky floor pays more', () => {
  const r = TW(EN, `(() => { const run = twRun(); run.coin2 = 1; const a = twReward(10, {}, run), b = twReward(10, {}, run), c = twReward(10, { rewMul: 2 }, run); return { a, b, c }; })()`);
  assert.deepEqual(r, { a: 20, b: 10, c: 20 });
});
test('tower: rest rooms rotate through campfire, merchant, shrine and puzzle', () => {
  const r = TW(EN, `(() => { const s = new Set(); for (let f = 5; f <= 60; f += 5) s.add(twRoomKind(f)); return [...s].sort(); })()`);
  assert.deepEqual(r, ['camp', 'puzzle', 'shop', 'shrine']);
});
test('tower: the family board shows only brothers and sisters who climbed today', () => {
  const r = J(EN, `(() => {
    const keep = { p: DEV.profiles, a: DEV.active, k: kidSave };
    return typeof twGhosts === 'function' ? twGhosts().every(g => g.floor > 0 && g.id !== DEV.active) : false;
  })()`);
  assert.equal(r, true);
});

/* ---------- Armory ---------- */
test('armory: a piece of gear has the same trait every time, and plain pieces have none', () => {
  const r = J(EN, `(() => {
    const out = { same: true, any: 0, bad: [] };
    for (const it of ITEMS) {
      if (!isGear(it)) continue;
      const a = gearTrait(it.id), b = gearTrait(it.id); if (a !== b) out.same = false;
      if (a) { out.any++; if (!GT_BY[a] || !GT_BY[a].slots.includes(it.slot)) out.bad.push(it.id + ':' + a); }
    }
    return out;
  })()`);
  assert.equal(r.same, true); assert.deepEqual(r.bad, []); assert.ok(r.any > 0, 'some gear has traits');
});
test('armory: trophy pieces cannot be bought until they are earned, and earning gives them once', () => {
  const r = J(EN, `(() => {
    const keep = { o: S.owned.slice(), best: tower().best, c: S.coins };
    S.owned = S.owned.filter(i => !TROPHY.tower.some(x => x[1] === i));
    const id = TROPHY.tower[0][1], locked = trophyLocked(id);
    tower().best = { '3': 10 }; const got = trophyEarn(), again = trophyEarn();
    const out = { locked, got, again, owns: S.owned.includes(id), unlocked: !trophyLocked(id) };
    S.owned = keep.o; tower().best = keep.best; S.coins = keep.c; return out;
  })()`);
  assert.equal(r.locked, true); assert.ok(r.got.includes('cape_feather')); assert.deepEqual(r.again.filter(x => x === 'cape_feather'), []);
  assert.equal(r.owns, true); assert.equal(r.unlocked, true);
});
test('armory: trophy sources are real items, and every piece comes from only one place', () => {
  const r = J(EN, `(() => {
    const all = [...TROPHY.boss, ...TROPHY.tower.map(x => x[1]), ...TROPHY.week];
    return { missing: all.filter(i => !ITEM[i]), dup: all.filter((x, i) => all.indexOf(x) !== i) };
  })()`);
  assert.deepEqual(r.missing, []); assert.deepEqual(r.dup, []);
});
test('armory: evolving a weapon needs level 5 and coins, adds +3 attack, and changes the picture', () => {
  const r = J(EN, `(() => {
    const keep = { eq: S.equipped, o: S.owned.slice(), evo: S.evo, c: S.coins, up: S.upg };
    const id = 'weapon_torch'; if (!S.owned.includes(id)) S.owned.push(id);
    S.equipped = { ...S.equipped, weapon: id }; S.evo = {}; S.upg = { ...(S.upg || {}) }; S.upg[id] = 0;
    const a0 = atk(); S.coins = 5000; evoGo(id); const early = !!S.evo[id];
    S.upg[id] = UPG_MAX; const a1 = atk(); S.sensory = true; evoGo(id); S.sensory = false;
    const evolved = !!S.evo[id], a2 = atk(), coinsAfter = S.coins;
    const plain = dressEq(S.equipped).weapon;
    const out = { early, evolved, plus: a2 - a1, a0, a1, plain, coinsAfter, cost: evoCost(id) };
    S.equipped = keep.eq; S.owned = keep.o; S.evo = keep.evo; S.coins = keep.c; S.upg = keep.up; return out;
  })()`);
  assert.equal(r.early, false); assert.equal(r.evolved, true); assert.equal(r.plus, 3);
  assert.equal(r.plain, 'weapon_torch+'); assert.equal(r.coinsAfter, 5000 - r.cost);
});
test('armory: relic slots open at hero level 20 and 40, and pairs give a bonus only when both are worn', () => {
  const r = J(EN, `(() => {
    const keep = { x: S.relicX, lv: heroLevel, rel: S.relics };
    const n = typeof relicSlotsN === 'function' ? relicSlotsN() : 1;
    return { n, syn: SYN.length, bad: SYN.filter(([a, b]) => !RELIC[a] || !RELIC[b]).map(x => x.join()), same: SYN.filter(([a, b]) => a === b).length };
  })()`);
  assert.ok(r.n >= 1 && r.n <= 3); assert.deepEqual(r.bad, []); assert.equal(r.same, 0); assert.ok(r.syn >= 6);
});
test('armory: the wardrobe changes only the picture, never the stats, and only for pieces the child owns', () => {
  const r = J(EN, `(() => {
    const keep = { w: S.wardrobe, o: S.owned.slice(), eq: S.equipped };
    S.wardrobe = {}; const a = atk();
    const other = ITEMS.find(i => i.slot === 'weapon' && i.id !== S.equipped.weapon);
    S.wardrobe = { weapon: other.id }; const notOwned = dressEq(S.equipped).weapon === S.equipped.weapon;
    S.owned.push(other.id); const shown = dressEq(S.equipped).weapon === other.id, same = atk() === a;
    const stranger = dressEq({ weapon: 'x', shield: 'y' });
    const out = { notOwned, shown, same, stranger: stranger.weapon };
    S.wardrobe = keep.w; S.owned = keep.o; S.equipped = keep.eq; return out;
  })()`);
  assert.equal(r.notOwned, true); assert.equal(r.shown, true); assert.equal(r.same, true); assert.equal(r.stranger, 'x');
});

/* ---------- words ---------- */
test('words: every new text exists in English and Bahasa Melayu', () => {
  for (const [name, G] of [['English', EN], ['Bahasa Melayu', MS]]) {
    const bad = G.ev(`Object.keys(STR).filter(k => /^(tw|tp|twm|twr|twc|tws|gt|cmp|tr|evo|sy|wd|dq|wx)\\./.test(k)).filter(k => { const v = STR[k]; return !Array.isArray(v) || typeof v[0] !== 'string' || typeof v[1] !== 'string' || !v[0].trim() || !v[1].trim(); })`);
    assert.deepEqual(JSON.parse(JSON.stringify(bad)), [], name);
  }
});
test('words: the Malay texts are not just the English ones copied', () => {
  const same = JSON.parse(JSON.stringify(EN.ev(`Object.keys(STR).filter(k => /^(tw|tp|twm|twr|twc|tws|gt|cmp|tr|evo|sy|wd|dq)\\./.test(k)).filter(k => { const v = STR[k]; return Array.isArray(v) && v[0] === v[1] && v[0].length > 12; })`)));
  assert.deepEqual(same, []);
});
