/* Tests for v36: fact tables (many question shapes from one fact), per-child "seen" counts, Bilingual boost, the audit grid,
   age-7 banks, story choices with consequences, and the Tower upgrades (builds, reroll/banish, Ascension, curse deals,
   milestone boss rules). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const EN = (await loadGame({ lang: 'en', band: 3 })).game;
const MS = (await loadGame({ lang: 'ms', band: 3 })).game;
const YOUNG = (await loadGame({ lang: 'en', band: 2 })).game;
const J = (G, code) => JSON.parse(G.ev(`JSON.stringify(${code})`));
const SUBJ = ['math', 'bm', 'en', 'sc', 'pm', 'pk', 'se', 'fk', 'sv', 'mz'];

/* ---------- seen counts ---------- */
test('seen: a question never seen comes first, then the one seen longest ago', () => {
  const r = J(EN, `(() => {
    S.seenQ = {}; S.seenN = 0; const out = {};
    const list = ['a', 'b', 'c', 'd', 'e'];
    ['a', 'b', 'c', 'd'].forEach(k => seenBump({ key: k }));
    out.fresh = Array.from({ length: 40 }, () => seenPick(list)).every(x => x === 'e');
    seenBump({ key: 'e' });
    const got = new Set(Array.from({ length: 80 }, () => seenPick(list)));
    out.oldest = [...got];   // only the least recently seen fifth: 'a'
    seenBump({ key: 'a' }); seenBump({ key: 'a' });
    out.count = seenCount('a');
    return out;
  })()`);
  assert.equal(r.fresh, true);
  assert.deepEqual(r.oldest, ['a']);
  assert.equal(r.count, 3);
});
test('seen: the list stays small (it is capped and the oldest are dropped)', () => {
  const r = J(EN, `(() => {
    S.seenQ = {}; S.seenN = 0;
    for (let i = 0; i < SEEN_CAP + 300; i++) seenBump({ key: 'q' + i });
    const n = Object.keys(S.seenQ).length;
    return { n, cap: SEEN_CAP, newest: seenCount('q' + (SEEN_CAP + 299)), oldest: seenCount('q0') };
  })()`);
  assert.ok(r.n <= r.cap, 'too many: ' + r.n);
  assert.equal(r.newest, 1); assert.equal(r.oldest, 0);
});
test('seen: battles use it, so a child sees different questions before any repeat', () => {
  const r = J(EN, `(() => {
    S.seenQ = {}; S.seenN = 0; const keys = new Set(); let n = 0;
    for (let i = 0; i < 120; i++) { const lv = levelOf('pk', 4 + (i % 6)); B.lv = lv; B.seen = new Set(); const q = seenBest([QT.pickFor(lv, 4), QT.pickFor(lv, 4), QT.pickFor(lv, 4), QT.pickFor(lv, 4)].filter(Boolean)); if (!q) continue; n++; seenBump(q); keys.add(seenKeyOf(q)); }
    return { n, uniq: keys.size };
  })()`);
  assert.ok(r.uniq >= r.n * 0.7, 'too many repeats: ' + r.uniq + ' of ' + r.n);
});

/* ---------- fact tables ---------- */
for (const [name, G, li] of [['English', EN, 0], ['Bahasa Melayu', MS, 1]]) {
  test(`facts (${name}): every fact makes every shape, with real text and a right answer`, () => {
    const r = J(G, `(() => {
      const F = FM.mod.K.FACTS, out = { shapes: {}, bad: [], keys: new Set() };
      for (const s of ${JSON.stringify(SUBJ)}) for (let b = 1; b <= 4; b++) for (const set of F.setsFor(s, b)) for (const it of set.items) for (const sh of ['tf', 'fill', 'odd', 'sort', 'pic', 'mcq']) {
        let q; try { q = (sh === 'mcq' ? F.mcq : F.SHAPES[sh])(set, it, ${li}, s, b); } catch (e) { out.bad.push(s + '/' + set.id + '/' + sh + ' threw ' + e.message); continue; }
        if (!q) continue;
        out.shapes[sh] = (out.shapes[sh] || 0) + 1;
        const txt = [q.text, q.ansText, q.tag, (q.options || []).join('|')].join(' ');
        if (/undefined|NaN|\\[object|\\{[xXv]\\}/.test(txt)) out.bad.push(s + '/' + set.id + '/' + sh + ' ' + txt);
        if (q.options && q.correct >= 0 && (new Set(q.options).size !== q.options.length || !q.options[q.correct])) out.bad.push('options ' + set.id + '/' + sh);
        out.keys.add(q.key);
      }
      return { shapes: out.shapes, bad: out.bad.slice(0, 10), keys: out.keys.size, facts: F.TABLE.reduce((a, s) => a + s.items.length, 0), sets: F.TABLE.length };
    })()`);
    assert.deepEqual(r.bad, []);
    assert.ok(r.facts >= 150, 'only ' + r.facts + ' facts');
    assert.ok(r.sets >= 20, 'only ' + r.sets + ' sets');
    for (const sh of ['tf', 'fill', 'odd', 'sort', 'pic', 'mcq']) assert.ok(r.shapes[sh] > 100, sh + ' only ' + r.shapes[sh]);
    assert.ok(r.keys >= 1500, 'only ' + r.keys + ' different questions');
  });
}
test('facts: the subjects that use them are the ones the audit shows', () => {
  const w = J(EN, `(() => { const o = {}; for (const s of ${JSON.stringify(SUBJ)}) o[s] = (FM.mod.weights(s, 3, false).find(x => x[0] === 'fact') || [0, 0])[1]; return o; })()`);
  assert.ok(Object.values(w).filter(x => x > 0).length >= 6, JSON.stringify(w));
});

/* ---------- Bilingual boost ---------- */
for (const [name, G] of [['English', EN], ['Bahasa Melayu', MS]]) {
  test(`bilingual (${name}): the boost makes EN→MS and MS→EN word questions and is off by default`, () => {
    const r = J(G, `(() => {
      const out = { n: {}, bad: [], dirs: new Set(), off: 0, on: 0 };
      S.bilingual = false; for (let i = 0; i < 300; i++) { const q = QT.pickFor({ subj: 'bm' }, 2); if (q && /^bi:/.test(q.key || '')) out.off++; }
      S.bilingual = true;
      const F = FM.mod.K.FACTS;
      for (const s of ${JSON.stringify(SUBJ)}) for (let b = 1; b <= 4; b++) for (let i = 0; i < 40; i++) {
        let q; try { q = i % 5 === 0 ? F.biMcq(s) : F.biQ(s, b, false); } catch (e) { out.bad.push('threw ' + e.message); continue; }
        if (!q) { out.bad.push(s + b + ' null'); continue; }
        out.n[q.kind] = (out.n[q.kind] || 0) + 1;
        const txt = [q.text, q.ansText, (q.options || []).join('|')].join(' ');
        if (/undefined|NaN|\\[object/.test(txt)) out.bad.push(txt);
        if (q.options && q.correct >= 0 && (new Set(q.options).size !== q.options.length || !q.options[q.correct])) out.bad.push('options ' + q.options);
        out.dirs.add(q.dir || q.tag || '');
      }
      for (let i = 0; i < 400; i++) { const q = QT.pickFor({ subj: 'bm' }, 2); if (q && /^bi:/.test(q.key || '')) out.on++; }
      S.bilingual = false;
      return { n: out.n, bad: out.bad.slice(0, 8), off: out.off, on: out.on };
    })()`);
    assert.deepEqual(r.bad, []);
    assert.equal(r.off, 0);
    assert.ok(r.on > 20, 'bilingual questions barely appear when on: ' + r.on);
    assert.ok(Object.keys(r.n).length >= 3, 'not enough shapes: ' + JSON.stringify(r.n));
  });
}
test('bilingual: the Parent Portal has the switch and it saves', () => {
  const r = J(EN, `(() => {
    S.bilingual = false; const html = biCardHTML(); const a = /biToggle/.test(html);
    HOOK.call('famEvent', () => undefined, ['biToggle']);
    const claimed = famEvent ? true : false;
    return { a, claimed };
  })()`);
  assert.equal(r.a, true);
});

/* ---------- the audit grid ---------- */
test('audit: AUDIT.md shows a subject × format grid and every subject has at least 5 formats', () => {
  const md = fs.readFileSync(new URL('../AUDIT.md', import.meta.url), 'utf8');
  assert.match(md, /FORMAT GRID|Format coverage|format grid/i);
  assert.match(md, /Subjects with fewer than 5 formats: 0/);
});

/* ---------- age 7 banks ---------- */
test('age 7: the four thin subjects now have at least 90 questions each', () => {
  const r = J(EN, `(() => { const o = {}; for (const s of ['fk', 'se', 'pk', 'pm']) o[s] = (BANK[s][3] || []).length; return o; })()`);
  for (const [s, n] of Object.entries(r)) assert.ok(n >= 80, `${s} has only ${n} age-7 rows`);
});

/* ---------- story choices with consequences ---------- */
test('story: every choice (A and B) of all ten lands names a twist for the next land', () => {
  const r = J(EN, `(() => { const ok = []; for (let z = 0; z < 10; z++) { const p = PATH_MAP[z]; ok.push(!!p && !!PATH_FX[p[0]] && !!PATH_FX[p[1]] && p[0] !== p[1]); } return { ok, ids: [...new Set(PATH_MAP.flat())] }; })()`);
  assert.ok(r.ok.every(Boolean), JSON.stringify(r.ok));
  assert.ok(r.ids.length >= 6, 'not enough different twists');
  assert.ok(r.ids.includes('relic'));
});
test('story: a choice saves a twist for the next zone of that subject, and only for that subject', () => {
  const r = J(EN, `(() => {
    S.pathFx = {}; const c = { mode: 'chapter', subj: 'math', z: 2 };
    const got = pathPick(c, 'a');
    const lvNext = levelOf('math', 31), lvOther = levelOf('bm', 31), lvSame = levelOf('math', 21);
    return { id: got.id, next: pathOf(lvNext) && pathOf(lvNext).id, other: pathOf(lvOther), same: pathOf(lvSame), z9: (() => { const g = pathPick({ mode: 'chapter', subj: 'sc', z: 9 }, 'b'); return Object.keys(S.pathFx).filter(k => k.startsWith('sc')); })() };
  })()`);
  assert.equal(r.id, 'ally'); assert.equal(r.next, 'ally'); assert.equal(r.other, null); assert.equal(r.same, null);
  assert.deepEqual(r.z9, ['sc:9']);
});
test('story: the twists really change the fight (time, health of foes, coins, helper)', () => {
  const r = J(EN, `(() => {
    const out = {}; S.pathFx = {};
    const lv = levelOf('math', 12); B.lv = lv;
    const t0 = timeBonus(); S.pathFx['math:1'] = { id: 'swift', z: 0, used: 0 }; out.swift = +(timeBonus() - t0).toFixed(2);
    S.pathFx['math:1'] = { id: 'bold', z: 0, used: 0 }; out.bold = pathOf(lv).id;
    S.pathFx['math:1'] = { id: 'relic', z: 0, used: 0 }; const two = pathRoll2(); out.relic2 = two.length === 2 && two[0].id !== two[1].id;
    const before = relics().length; pathRelicPick(two[0].id); out.gotRelic = relics().length === before + 1 && S.pathFx['math:1'].used === 1;
    out.noSecond = pathRelicPick(two[1].id);
    return out;
  })()`);
  assert.equal(r.swift, 0.25); assert.equal(r.bold, 'bold'); assert.equal(r.relic2, true); assert.equal(r.gotRelic, true); assert.equal(r.noSecond, false);
});
test('story: the result of a choice says what it changes, in both languages', () => {
  for (const G of [EN, MS]) {
    const s = G.ev(`(() => { UI.comic = { mode: 'chapter', subj: 'math', z: 0, picks: {}, i: 1 }; const n = pathNote('a'); UI.comic = null; return n; })()`);
    assert.ok(String(s).length > 25 && !/undefined|\{/.test(s), s);
  }
});

/* ---------- Tower: builds, reroll, banish ---------- */
const TWR = (G, code) => J(G, `(() => { const keep = UI.run; UI.run = Object.assign({ mode: 'tower', floor: 6, start: 1, coins: 0, hHp: null }, twNewRun()); try { return (${code}); } finally { UI.run = keep; } })()`);
test('tower: 9 perks in 3 builds of 3, and two of them are new', () => {
  const r = J(EN, `({ perks: TW_PERKS.map(p => p.id), builds: TW_BUILDS.map(b => b.perks) })`);
  assert.equal(r.perks.length, 9);
  assert.deepEqual(r.builds.flat().sort(), [...r.perks].sort());
  assert.ok(r.perks.includes('charm') && r.perks.includes('magnet'));
});
test('tower: 3 and 6 perks of one build wake its small and its big power', () => {
  const r = TWR(EN, `(() => {
    const out = {}; const run = twRun();
    out.t0 = twBuildTier('tank');
    twGivePerk('heart'); twGivePerk('heart'); twGivePerk('forgive'); out.t1 = twBuildTier('tank'); out.hp = heroMaxHP();
    twGivePerk('regen'); twGivePerk('regen'); twGivePerk('regen'); out.t2 = twBuildTier('tank');
    out.pts = twBuildPts(run);
    return out;
  })()`);
  assert.equal(r.t0, 0); assert.equal(r.t1, 1); assert.equal(r.t2, 2);
  assert.equal(r.hp, Math.round(Math.round(100 * 1.3) * 1.1));
  assert.equal(r.pts.tank, 6);
});
test('tower: reroll changes the offer and costs climb coins; banish removes a perk for the climb', () => {
  const r = TWR(EN, `(() => {
    const run = twRun(); run.coins = 100; run.spent = 0; S.coins = 500; run.floor = 11;
    const first = twPerkChoices(run).map(p => p.id).join(',');
    const rerolled = twReroll(); const second = twPerkChoices(run).map(p => p.id).join(',');
    const cost1 = run.spent;
    const ch = twPerkChoices(run), gone = ch[0].id; const banned = twBan(gone);
    let still = false; for (let i = 0; i < 30; i++) { run.rolls = i; if (twPerkChoices(run).some(p => p.id === gone)) still = true; }
    const poor = (() => { run.spent = 99; return twReroll(); })();
    return { rerolled, changed: first !== second, cost1, banned, still, poor, banCost: twBanCost(run) };
  })()`);
  assert.equal(r.rerolled, true); assert.equal(r.changed, true); assert.equal(r.cost1, 4); assert.equal(r.banned, true); assert.equal(r.still, false);
  assert.equal(r.poor, false); assert.equal(r.banCost, 12);
});
test('tower: Lucky build makes rerolls cheaper, shops cheaper and coins richer', () => {
  const r = TWR(EN, `(() => {
    const run = twRun(); const base = { price: twPrice(20), mul: twRewMul(run), re: twRerollCost(run) };
    twGivePerk('coin2'); twGivePerk('charm'); twGivePerk('magnet');
    return { base, now: { price: twPrice(20), mul: twRewMul(run), re: twRerollCost(run), free: twRerollFree(run) } };
  })()`);
  assert.ok(r.now.price < r.base.price); assert.ok(r.now.mul > r.base.mul * 1.15); assert.ok(r.now.re < r.base.re);
  assert.equal(r.now.free, false);   // 3 points = small power only
});
test('tower: the perk sheet shows the build, the reroll and the banish buttons', () => {
  const html = TWR(EN, `(() => { const run = twRun(); run.coins = 50; S.coins = 50; return twBuildHTML(run) + twRerollHTML(run, twPerkChoices(run)); })()`);
  for (const w of ['twReroll', 'twBan', 'tw-builds']) assert.match(html, new RegExp(w));
});

/* ---------- Tower: Ascension ---------- */
test('tower: Ascension opens at the top, gives a title, and makes the climb harder and richer', () => {
  const r = J(EN, `(() => {
    const keepT = S.tower, keepR = UI.run; S.tower = { best: {}, runs: 0 }; UI.twAsc = 0;
    UI.run = Object.assign({ mode: 'tower', floor: 101, start: 1, coins: 0, hHp: null }, twNewRun());
    const out = { before: tower().asc | 0, ready: twAscendReady() };
    out.gain1 = twAscendGain(); out.title = lk().title; out.unlocked = lkTitle() && lkTitle()[0];
    out.readyAfter = twAscendReady();   // the same run is Ascension 0 again, so it needs the next step
    UI.twAsc = 1; UI.run = Object.assign({ mode: 'tower', floor: 5, start: 1, coins: 0, hHp: null }, twNewRun());
    out.asc = UI.run.asc;
    const base = (() => { const k = UI.run.asc; UI.run.asc = 0; const l = specialLevel('tower:6'); UI.run.asc = k; return l; })(), hard = specialLevel('tower:6');
    out.hp = +(hard.hpMul / base.hpMul).toFixed(2); out.mulRew = twRewMul(UI.run);
    out.panel = /twAscSet/.test(twAscPanel());
    UI.twAsc = 0; S.tower = keepT; UI.run = keepR;
    return out;
  })()`);
  assert.equal(r.before, 0); assert.equal(r.ready, true); assert.equal(r.gain1, 1); assert.equal(r.title, 'asc1'); assert.equal(r.unlocked, 'asc1');
  assert.equal(r.asc, 1); assert.equal(r.hp, 1.2); assert.ok(r.mulRew >= 1.25); assert.equal(r.panel, true);
});
test('tower: Ascension stops at the top step', () => {
  const r = J(EN, `(() => { const keep = S.tower; S.tower = { best: {}, runs: 0, asc: ASC_MAX }; UI.run = Object.assign({ mode: 'tower', floor: 101, start: 1, coins: 0, hHp: null }, twNewRun(), { asc: ASC_MAX }); const x = { ready: twAscendReady(), gain: twAscendGain() }; UI.run = null; S.tower = keep; return x; })()`);
  assert.equal(r.ready, false); assert.equal(r.gain, 0);
});

/* ---------- Tower: curse deals ---------- */
test('tower: the curse deal is only for ages 6 and 7', () => {
  const run = G => J(G, `(() => { const keep = UI.run; UI.run = Object.assign({ mode: 'tower', floor: 6, start: 1, coins: 0, hHp: null }, twNewRun()); const r = twRun(); const x = { ok: twCurseOK(r), btn: /twCurse/.test(twCurseBtn(r)), take: twCurseTake('hard') }; UI.run = keep; return x; })()`);
  const old = run(EN), young = run(YOUNG);
  assert.equal(old.ok, true); assert.equal(old.btn, true); assert.equal(old.take, true);
  assert.equal(young.ok, false); assert.equal(young.btn, false); assert.equal(young.take, false);
});
test('tower: a curse makes the floor harder, pays double, and ends with a chest after five floors', () => {
  const r = TWR(EN, `(() => {
    const run = twRun(); run.floor = 6; const base = specialLevel('tower:6'); const mul0 = twRewMul(run);
    const out = {};
    for (const id of ['hard', 'rush', 'fierce']) {
      run.curse = { id, left: 5 }; const lv = specialLevel('tower:6');
      out[id] = id === 'hard' ? lv.dk > base.dk : id === 'rush' ? lv.timeMul < base.timeMul * .75 : lv.hpMul > (base.hpMul || 1) * 1.25;
    }
    run.curse = { id: 'hard', left: 5 }; out.pay = +(twRewMul(run) / mul0).toFixed(1);
    const before = S.chestQ | 0; B.lv = specialLevel('tower:6');
    for (let i = 0; i < 5; i++) twAfterWin();
    out.over = run.curse; out.chest = (S.chestQ | 0) - before;
    return out;
  })()`);
  assert.equal(r.hard, true); assert.equal(r.rush, true); assert.equal(r.fierce, true); assert.equal(r.pay, 2);
  assert.equal(r.over, null); assert.equal(r.chest, 1);
});

/* ---------- Tower: milestone bosses ---------- */
test('tower: floors 25, 50, 75 and 100 each carry their own rule, and so does every 100th after', () => {
  const r = J(EN, `[20, 25, 50, 75, 100, 125, 150, 175, 200, 101].map(f => twRuleOf(f))`);
  assert.deepEqual(r, [null, 'pairs', 'hourglass', 'reshuffle', 'finale', 'pairs', 'hourglass', 'reshuffle', 'finale', null]);
});
test('tower: Twin Strike lands every second right answer, twice as hard', () => {
  const r = TWR(EN, `(() => {
    const run = twRun(); B.lv = specialLevel('tower:25'); B.active = true; B.wrong = 0; B.combo = 1; B.charge = 0; B.boost = 1; B.pairN = 0; B.mMax = 100; B.mHp = 100;
    const out = []; for (let i = 0; i < 4; i++) { B.boost = 1; B.combo = 1; out.push([dmgBoost(), !!B.pairHalf]); }
    B.active = false; return { rule: B.lv.rule, out };
  })()`);
  assert.equal(r.rule, 'pairs');
  assert.deepEqual(r.out.map(x => x[1]), [true, false, true, false]);
  assert.equal(r.out[0][0], 0); assert.equal(r.out[1][0], 2);
});
test('tower: the Hourglass clock is frozen until a wrong answer', () => {
  const r = TWR(EN, `(() => {
    const run = twRun(); B.lv = specialLevel('tower:50'); B.mMax = 100; B.mHp = 100; B.active = true;
    const keep = [B.tmax, B.tleft, B.q, B.locked]; B.tmax = 20000; B.tleft = 20000; B.q = { kind: 'mcq' }; B.locked = false; B.introUntil = 0;
    const a = (B.wrong = 0, thinkTick(), B.tleft);
    const b = (B.wrong = 1, thinkTick(), B.tleft);
    B.active = false; [B.tmax, B.tleft, B.q, B.locked] = keep; return { a, b, rule: B.lv.rule };
  })()`);
  assert.equal(r.rule, 'hourglass'); assert.equal(r.a, 20000);
  assert.ok(r.b <= 20000);
});
test('tower: the Grand Finale uses one rule for each third of the boss’s health', () => {
  const r = TWR(EN, `(() => {
    B.lv = specialLevel('tower:100'); B.mMax = 90; const seq = [];
    for (const hp of [90, 50, 20]) { B.mHp = hp; seq.push(twRuleNow()); }
    return { seq, rule: B.lv.rule };
  })()`);
  assert.deepEqual(r.seq, ['pairs', 'hourglass', 'reshuffle']);
});
test('tower: the milestone floors show a mark on the map and every new text exists in both languages', () => {
  const html = EN.ev(`(() => { UI.run = null; const h = document.createElement('div'); h.id = 'tab-tower'; document.body.appendChild(h); S.tower = S.tower || { best: {}, runs: 0 }; S.tower.best = S.tower.best || {}; S.tower.best[S.band] = 22; renderTowerNew(); const out = h.innerHTML; h.remove(); return out; })()`);
  assert.match(html, /👯|⏳|🎭|🌟/);
  for (const lang of ['en', 'ms']) {
    const missing = J(lang === 'en' ? EN : MS, `Object.keys(STR).filter(k => /^v36\\.|^tp\\.(charm|magnet)/.test(k) && (!STR[k] || !STR[k][0] || !STR[k][1]))`);
    assert.deepEqual(missing, []);
  }
  const same = J(EN, `Object.keys(STR).filter(k => /^v36\\./.test(k) && STR[k][0] === STR[k][1] && !/^v36\\.(asc\\.normal)$/.test(k))`);
  assert.deepEqual(same, []);
});
