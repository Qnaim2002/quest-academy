/* Tests for v27: livelier bosses, secret levels, Boss Rush, the Endless Tower, subject mix, "why?" questions,
   hero perks, weapon upgrades, chests, team play, auto-resume, story skip and the zone-boss clock. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const { game: G } = await loadGame({ lang: 'en', band: 3 });
const J = (code) => JSON.parse(G.ev(`JSON.stringify(${code})`));
const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('every v27 text exists in English and Malay', () => {
  const keys = J(`Object.keys(STR).filter(k => /^(tl|rg|mn|cm27|bc|co|rs|subj\\.mix|steam\\.mix|goal\\.mix|mx|sc27|ru|tw|pk27|ch|up|wy|sk|pp27|nav\\.tower|lg\\.secret|lg\\.upg)(\\.|$)/.test(k))`);
  assert.ok(keys.length > 120, 'found ' + keys.length);
  for (const k of keys) { const v = J(`STR[${JSON.stringify(k)}]`); assert.ok(v[0] && v[1], k); }
  assert.ok(read('index.html').includes('id="nav-tower"') && read('index.html').includes('id="tab-tower"'));
  assert.ok(read('src/style.css').includes("css/18-v27.css"));
});

test('each zone boss archetype has its own rage move, and some bosses summon minions', () => {
  const r = J('RAGE.map(x => x.k)'); assert.equal(r.length, 10); assert.equal(new Set(r).size, 10);
  const arch = J("Array.from({ length: 10 }, (_, z) => levelOf('math', z * 10 + 10).mon.arch)");
  assert.deepEqual([...new Set(arch)].sort(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.ok(J('rageOf(levelOf("math", 50)).k')); assert.equal(J('rageOf(levelOf("math", 9))'), null);
  assert.deepEqual(J('SUMMONERS'), [1, 3, 6, 8, 9]);
  /* every boss has its own taunt and beaten line, in both languages */
  const tb = J('TALK.boss'); assert.equal(tb.length, 10); tb.forEach(p => p.forEach(l => assert.ok(l[0] && l[1])));
});

test('a boss battle: charged attack, minions, dodging and the boss clock that keeps running', () => {
  G.ev("S.pace = 'standard'; S.sensory = false; UI.run = null; startBattle('bm:10')");
  assert.equal(J('B.hMax'), J('heroMaxHP()'));
  /* level 10: the clock does not fill up again after an answer */
  G.ev('B.tleft = 5000; resetThink()'); assert.equal(J('B.tleft'), 5000);
  G.ev("B.lv = levelOf('bm', 9); B.keepT = B.token; B.tleft = 5000; resetThink()"); assert.ok(J('B.tleft') > 5000, 'normal levels refill the clock');
  G.ev("B.lv = levelOf('bm', 10)");
  /* charging, then a right answer dodges and makes the next hit stronger */
  G.ev('teleStart()'); assert.ok(J('!!B.tele && B.tele.max >= 5000'));
  G.ev('teleDodge()'); assert.equal(J('B.tele'), null); assert.ok(J('dmgBoost()') > 1); assert.equal(J('dmgBoost()'), 1);
  /* phase 2 calls one minion, phase 3 two more; a right answer knocks one out */
  G.ev('B.waves = {}; B.minions = []; minionWave(2)'); assert.equal(J('B.minions.length'), 1);
  G.ev('minionWave(2)'); assert.equal(J('B.minions.length'), 1, 'each wave comes once');
  G.ev('minionWave(3)'); assert.equal(J('B.minions.length'), 3);
  G.ev('minionHit(B.token)'); assert.equal(J('B.minions.length'), 2);
  /* the Titan's quake shuffles the answers but keeps the right one right */
  G.ev("for (let i = 0; i < 40; i++) { nextQuestion(); if (B.q.kind !== 'wx' && B.q.options.length > 1 && B.q.correct >= 0) break; }");
  const before = J('B.q.options[B.q.correct]'); G.ev('quakeShuffle()'); assert.equal(J('B.q.options[B.q.correct]'), before);
  /* a boss heal never brings the fight back out of phase 3 */
  G.ev('B.mHp = 10; bossHeal(.5)'); assert.ok(J('B.mHp < B.mMax / 3'));
  G.ev('leaveBattle()'); assert.equal(J('S.resume'), null);
});

test('special levels: secret, Boss Rush and tower floors that get harder', () => {
  const sec = J("specialLevel('secret:math:2')"); assert.equal(sec.special, 'secret'); assert.equal(sec.subj, 'math'); assert.ok(sec.boss && !sec.big);
  const ru = J("specialLevel('rush:sc:4')"); assert.equal(ru.special, 'rush'); assert.ok(ru.big); assert.equal(ru.n, 50);
  const f = n => J(`specialLevel('tower:${n}')`);
  assert.equal(f(5).tier, 'mini'); assert.equal(f(10).tier, 'big'); assert.equal(f(7).tier, 'normal');
  assert.ok(f(40).chip > f(2).chip); assert.ok(f(40).timeMul < f(2).timeMul); assert.ok(f(80).hpMul > f(10).hpMul);
  assert.equal(J("getLevel('tower:12').id"), 'tower:12'); assert.equal(J("getLevel('math:12').id"), 'math:12');
  assert.match(J("lvT(specialLevel('tower:12')).place"), /Floor 12/);
  /* the secret level opens with all 30 goals of a zone */
  G.ev("S.goals = {}; for (let n = 1; n <= 10; n++) S.goals[starKey('math', n)] = 7");
  assert.equal(J("zoneGoals('math', 0)"), 30); assert.ok(J("secretOpen('math', 0)")); assert.ok(!J("secretOpen('math', 1)"));
  G.ev("S.goals[starKey('math', 4)] = 3"); assert.ok(!J("secretOpen('math', 0)"));
});

test('the tower: a floor win records the best floor, a knock-out ends the climb', () => {
  /* (the harness has no timers, so only the part of win() before its first pause runs: that is where the records are kept) */
  G.ev("S.tower = null; S.chestQ = 0; towerGo(1); startBattle('tower:1')");
  assert.equal(J('UI.run.mode'), 'tower');
  G.ev('B.mHp = 0; win()');
  assert.equal(J('tower().best[S.band]'), 1); assert.equal(J('UI.run.floor'), 2);
  G.ev("startBattle('tower:10'); win()");
  assert.equal(J('tower().best[S.band]'), 10); assert.equal(J('S.chestQ'), 1, 'every 10th floor gives a chest');
  G.ev("startBattle('tower:11'); heroKO()"); assert.equal(J('UI.run'), null); assert.equal(J('UI.lastRun.mode'), 'tower');
  G.ev('UI.lastRun = null; S.chestQ = 0; B.active = false');
});

test('subject mix: 20 levels with questions from three subjects', () => {
  const lv = J("levelOf('mix', 10)"); assert.equal(lv.id, 'mix:10'); assert.ok(lv.big && lv.steam); assert.equal(lv.mixSubs.length, 3);
  const subs = new Set(lv.pool.map(p => p.split(':')[1])); assert.ok(subs.size >= 2, [...subs].join());
  assert.equal(J("getLevel('mix:3').n"), 3); assert.equal(J("lvT(levelOf('mix', 3)).zone"), 'Subject Mix');
  for (let n = 1; n <= 20; n++) { const q = J(`(() => { const l = levelOf('mix', ${n}); const q = makeQ(l.pool[0], S.band, l); return { t: q.text, o: q.options.length }; })()`); assert.ok(q.t && q.o >= 2, 'mix ' + n); }
});

test('"why?" reasons: the true working and two wrong ones, only from age 6', () => {
  for (let i = 0; i < 40; i++) {
    const w = J("(() => { const q = mathQ(1); return { w: whyOptions(q), ans: q.options[q.correct], eq: q.eq }; })()");
    if (!w.w) continue;
    assert.equal(w.w.opts.length, 3); assert.equal(new Set(w.w.opts).size, 3);
    const right = w.w.opts[w.w.right], m = right.match(/^(\d+) (.) (\d+) = (\d+)$/); assert.ok(m, right);
    assert.equal(m[4], String(w.ans));
  }
  assert.equal(J("whyOptions({ options: ['5', '6'], correct: 0, eq: '2 + 2 = ?' })"), null, 'a wrong equation is never used');
  G.ev('S.band = 2'); assert.ok(!J('whyOn()')); G.ev('S.band = 3'); assert.ok(J('whyOn()'));
  G.ev('S.why = false'); assert.ok(!J('whyOn()')); G.ev('S.why = true');
});

test('hero perks, weapon upgrades and treasures', () => {
  G.ev('S.stars = {}; S.defeated = 0'); assert.equal(J('heroLevel()'), 1); assert.equal(J('heroMaxHP()'), 100); assert.equal(J('atkBonus()'), J('upgLv(S.equipped.weapon) * 2 + relicV("atk")'));
  G.ev('S.defeated = 300'); assert.ok(J('heroLevel()') >= 30); assert.ok(J('heroMaxHP()') > 100); assert.ok(J("perkSum('atk')") > 0);
  G.ev('S.defeated = 0; S.upg = {}; S.coins = 1000');
  const w = J('S.equipped.weapon'), a0 = J('atk()'), c = J(`upgCost('${w}')`);
  G.ev(`doUpgrade('${w}')`); assert.equal(J(`upgLv('${w}')`), 1); assert.equal(J('S.coins'), 1000 - c); assert.equal(J('atk()'), a0 + 2);
  for (let i = 0; i < 8; i++) G.ev(`doUpgrade('${w}')`); assert.equal(J(`upgLv('${w}')`), 5, 'max level 5');
  /* treasures never appear in the Armory, and a chest gives one you don't have yet */
  const ids = J('RELICS.map(r => r.id)'); assert.equal(ids.length, 24); assert.ok(ids.every(id => !J(`!!ITEM['${id}']`)));
  G.ev('S.relics = []; S.chestQ = 0; chestGive(2)'); assert.equal(J('S.chestQ'), 2);
  const got = new Set(); for (let i = 0; i < 24; i++) { const r = J('(() => { const r = rollRelic(); S.relics.push(r.id); return r.id; })()'); assert.ok(!got.has(r)); got.add(r); }
  assert.equal(J('rollRelic()'), null, 'all found');
  G.ev("S.relicOn = 'r_heart'"); assert.equal(J('heroMaxHP()'), 110); G.ev('S.relicOn = null; S.relics = []');
});

test('team play rotates turns; auto-resume saves the battle and restores it', () => {
  G.ev("DEV.coop = { n: 3, names: ['Ali', 'Mei', ''] }; startBattle('math:3')");
  const turns = [J('B.turn')]; for (let i = 0; i < 3; i++) { G.ev('nextQuestion()'); turns.push(J('B.turn')); }
  assert.deepEqual(turns, [0, 1, 2, 0]); assert.equal(J('coopName(0)'), 'Ali'); assert.match(J('coopName(2)'), /Player 3|^\S/);
  G.ev('DEV.coop = { n: 1, names: [] }');
  G.ev('B.mHp = 7; B.hHp = 55; B.combo = 2; resumeSnap()');
  const r = J('S.resume'); assert.equal(r.id, 'math:3'); assert.equal(r.mHp, 7); assert.equal(r.hHp, 55);
  G.ev("const _r = S.resume; startBattle('math:3'); resumeApply(_r)");
  assert.equal(J('B.mHp'), 7); assert.equal(J('B.hHp'), 55); assert.equal(J('B.combo'), 2);
  G.ev('leaveBattle()'); assert.equal(J('S.resume'), null);
});

test('story skip: "always skip" is remembered for each story, and only skips automatic plays', () => {
  G.ev("S.comics = { 'boss4:3:math:0': 1 }; S.storySkip = {}; UI.comic = { z: 0, subj: 'math', mode: 'boss', i: 0 }; storyAlways()");
  assert.equal(J("S.storySkip['boss:3:math:0']"), 1);
  assert.ok(J("storySeen({ z: 0, subj: 'math', mode: 'boss' })")); assert.ok(!J("storySeen({ z: 1, subj: 'math', mode: 'boss' })"));
  let ran = false; G.ev('UI.comic = null; UI.storyManual = 0'); G.ev('window.__ran = false');
  G.ev("openComic(0, () => { window.__ran = true; }, 'math', 'boss')"); ran = J('window.__ran'); assert.ok(ran, 'skipped straight to what comes next');
  G.ev("UI.comic = { z: 0, subj: 'math', mode: 'boss', i: 0 }; storyAlways()"); assert.equal(J("S.storySkip['boss:3:math:0'] || 0"), 0);
});

test('parent settings switch the v27 extras off', () => {
  for (const k of ['cine', 'talk', 'tele', 'why']) { G.ev(`S.${k} = true; famEvent('set27', '${k}')`); assert.equal(J(`S.${k}`), false, k); G.ev(`famEvent('set27', '${k}')`); assert.equal(J(`S.${k}`), true, k); }
  G.ev("S.cine = false; startBattle('math:10')"); assert.ok(!J('camOn()'));
  G.ev("S.tele = false"); assert.ok(!J('teleOn()')); G.ev("S.tele = true; S.cine = true; leaveBattle()");
});
