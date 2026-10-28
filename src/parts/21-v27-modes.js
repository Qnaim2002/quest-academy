/* ================= v27: new ways to play =================
   SECRET LEVELS. Get all 3 goals (🎯 ⚡ 🛡️) on every level of a zone and a hidden 🌟 secret level opens there.
   BOSS RUSH. Fight every zone boss a child has already beaten, one after another. Health carries over
     (with a little healing between bosses). The best run is remembered.
   ENDLESS TOWER (new tab). Floor after floor, each one a little harder: tougher hits, more health,
     less time. Every 5th floor is a mini boss, every 10th a big boss with a chest. A knock-out ends the climb;
     the best floor is remembered for each age. A child who reached floor 10, 20 ... can start from there.
   SUBJECT MIX. 20 levels that mix questions from three subjects in one battle.
   TEAM PLAY. Two or three children share the device and take turns answering (set up on the Adventure screen).
   Special levels have ids of their own ("secret:math:2", "rush:math:4", "tower:12"), built by specialLevel(). */
SUBJ_EM.mix = '🔀'; SUBJ_COL.mix = '#8E6CFF';
const tower = () => S.tower || (S.tower = { best: {}, runs: 0 });
const secretKey = (s, z, band = S.band) => `${s}:${band}:${z}`;
const secretDone = (s, z) => !!(S.secret || {})[secretKey(s, z)];
/* goals earned in a zone (0 to 30); all 30 open the secret level */
function zoneGoals(s, z) { let g = 0; for (let n = z * 10 + 1; n <= z * 10 + 10; n++) g += bits3(goalsAt(s, n)); return g; }
const secretOpen = (s, z) => zoneGoals(s, z) >= 30;
const rushZones = s => Array.from({ length: 10 }, (_, z) => z).filter(z => clearAt(s, z * 10 + 10));
const rushRec = s => ((S.rush || {})[s + ':' + S.band]) || { best: 0, done: 0 };
/* moves a level number to the nearest level of the wanted kind (normal, mini boss, zone boss) */
function tierN(n, tier) {
  n = Math.max(1, Math.min(100, n));
  if (tier === 'big') return Math.min(100, Math.ceil(n / 10) * 10);
  if (tier === 'mini') return Math.floor((n - 1) / 10) * 10 + 5;
  return tierOf(n) === 'normal' ? n : n - 1;
}
const towerTier = f => f % 10 === 0 ? 'big' : f % 5 === 0 ? 'mini' : 'normal';
function towerSubjBase(f) { const o = openSubjects(), L = o.length ? o : ['math']; return L[(f - 1) % L.length]; }
const towerSubj = f => (typeof twSubj === 'function' && twSubj(f)) || towerSubjBase(f);   // v35: a climb can pick its subjects and favour weak spots (45)
function specialLevel() { return HOOK.call('specialLevel', specialLevelBase, arguments); }   // v31: extensions register with HOOK (00c)
function specialLevelBase(id) {
  const p = String(id || '').split(':'), k = p[0];
  if (k === 'secret' && p.length === 3) {
    const s = p[1], z = Math.max(0, Math.min(9, +p[2] || 0)), base = levelOf(s, z * 10 + 10);
    return { ...base, id, special: 'secret', tier: 'mini', boss: true, big: false, mini: true, rounds: 9, chip: base.chip + 2, dk: 1, timeMul: .9, hue: 48, mon: monsterFor(s, z * 10 + 7) };
  }
  if (k === 'rush' && p.length === 3) {
    const s = p[1], z = Math.max(0, Math.min(9, +p[2] || 0)), base = levelOf(s, z * 10 + 10);
    return { ...base, id, special: 'rush', rounds: 7 };
  }
  if (k === 'tower' && p.length === 2) {
    const f = Math.max(1, Math.floor(+p[1] || 1)), tier = towerTier(f), s = towerSubj(f);
    const dn = tierN(Math.min(100, f * 2), tier), base = levelOf(s, dn);
    const mn = tier === 'big' ? ((f / 10 - 1) % 10) * 10 + 10 : tier === 'mini' ? (Math.floor(f / 10) % 10) * 10 + 5 : tierN(((f * 7) % 100) + 1, 'normal');
    return { ...base, id, special: 'tower', floor: f, n: f, tier, boss: tier !== 'normal', big: tier === 'big', mini: tier === 'mini',
      rounds: tier === 'big' ? 9 : tier === 'mini' ? 7 : Math.min(6, 3 + Math.floor(f / 15)), chip: Math.min(34, 6 + Math.floor(f * .6)) + (tier === 'big' ? 3 : tier === 'mini' ? 1 : 0),
      dk: Math.min(1, .35 + f * .02), timeMul: 1 - Math.min(.4, f * .012), hpMul: Math.min(2.5, 1 + Math.max(0, f - 20) * .02), hue: f > 100 ? (f * 37) % 360 : 0, mon: monsterFor(tier === 'normal' ? s : towerSubjBase(f), mn) };   // v35: bosses keep their look, so the map can show the next boss
  }
  return null;
}
/* ---------------- subject mix levels ---------------- */
const MIXC = {};
function mixSubjects(n) { const o = openSubjects(), L = o.length ? o : ['math'], a = (n - 1) % L.length; return [...new Set([L[a], L[(a + 3) % L.length], L[(a + 6) % L.length]])]; }
function mixLevel(n) {
  n = Math.max(1, Math.min(STEAM_N, Math.floor(+n) || 1));
  const subs = mixSubjects(n), key = n + ':' + subs.join(','); if (MIXC[key]) return MIXC[key];
  const tier = tierOf(n), big = tier === 'big', mini = tier === 'mini', bn = big || mini ? n * 5 : n * 5 - 2, z = Math.min(9, Math.floor((n - 1) / 2));
  const bases = subs.map(s => levelOf(s, bn));
  return (MIXC[key] = { id: 'mix:' + n, subj: 'mix', n, z, tier, boss: tier !== 'normal', big, mini, steam: true, mixSubs: subs, rounds: big ? 10 : mini ? 8 : 4 + Math.floor((n - 1) / 6),
    chip: 6 + n + (mini ? 2 : 0) + (big ? 4 : 0), dk: bases[0].dk, mon: monsterFor(subs[0], bn), pool: bases.flatMap(b => b.pool), skills: [], bg: stageBG(subs[0], z), scene: ((n + 5) % 6) + 1 });
}
HOOK.claim('levelOf', (subj, n) => subj === 'mix' ? mixLevel(n) : undefined);
const mixStars = () => { let a = 0; for (let n = 1; n <= STEAM_N; n++) a += starsAt('mix', n); return a; };
function mixCardHTML() {
  const st = mixStars();
  return `<button class="sj sj31 mixcard" style="--c:${SUBJ_COL.mix}" data-act="subj" data-v="mix" aria-label="${esc(`${t('subj.mix')}. ${t('mx.sub')}. ⭐ ${st}/${STEAM_N * 3}`)}"><span class="em" aria-hidden="true">🔀</span><b>${t('subj.mix')}</b><span class="sj-st" aria-hidden="true">⭐ ${st}<i class="sj-bar"><u style="width:${Math.round(st / (STEAM_N * 3) * 100)}%"></u></i></span></button>`;
}
function renderMix() {
  const nodes = Array.from({ length: STEAM_N }, (_, i) => {
    const n = i + 1, lv = levelOf('mix', n), lo = isUnlocked(lv), st = starsAt('mix', n), next = lo && !clearAt('mix', n);
    const aria = t('map.aria', { id: n, name: t('subj.mix'), boss: lv.big ? ', ' + t('tier.big') : lv.mini ? ', ' + t('tier.mini') : '', s: lo ? t('map.stars', { n: st }) + '. ' + goalAria('mix', n) : t('map.lockedAria') });
    return `<button class="lnode zn ${lv.tier} ${lo ? '' : 'locked'} ${next ? 'next' : ''}" style="--i:${i % 10}" data-act="level" data-v="${lv.id}" aria-label="${esc(aria)}"><span class="orb">${lo ? (lv.big ? '<em>👑</em>' : lv.mini ? '<em>⚔️</em>' : '') + `<b>${n}</b>` : '🔒'}</span>${lo ? goalsHTML('mix', n, lo) : '<span class="goals" aria-hidden="true"></span>'}<span class="lname mixem" aria-hidden="true">${lv.mixSubs.map(s => SUBJ_EM[s]).join('')}</span></button>`;
  }).join('');
  $('#mapView').innerHTML = `<div class="wrap"><div class="lvhead"><button class="btn ghost" data-act="subjBack">${t('adv.back')}</button><h1 class="title" style="margin:0">🔀 ${t('subj.mix')}</h1></div><div class="seg diffbar">${diffChips()}</div><p class="sub">${t('mx.long')}</p>
    <div class="zones"><section class="zone zopen mixzone"><div class="zhead static"><span class="zn-n">🔀</span><b>${t('subj.mix')}<small>${t('mx.levels', { n: STEAM_N })}</small></b><span class="zp">★ ${mixStars()}/${STEAM_N * 3}</span></div><div class="zgrid">${nodes}</div></section></div></div>`;
}
HOOK.claim('renderMap', () => { if (UI.screen === 'mix') { renderMix(); return true; } });
/* the subject screen gets the Subject Mix card and the team-play bar */
/* v31: one small button (the player count and names are in its pop-up) */
function coopBarHTML() {
  const n = coopN();
  return `<div class="coopbar31"><button class="btn ghost small" data-act="coopNames">👫 ${t('co.title')}: <b>${n === 1 ? t('co.solo') : t('co.n', { n })}</b></button>${n > 1 ? `<span class="co-who">${Array.from({ length: n }, (_, i) => `<span class="co-p" data-p="${i}">${COOP_EM[i]} ${esc(coopName(i))}</span>`).join(' ')}</span>` : ''}</div>`;
}
HOOK.on('renderSubjects', () => {
  const g = $('#mapView .subjgrid'); if (g && g.insertAdjacentHTML) { g.insertAdjacentHTML('beforeend', mixCardHTML()); g.insertAdjacentHTML('afterend', coopBarHTML()); }
});
/* the zone map gets the Boss Rush button and each open zone its secret level (or a hint how to open it) */
HOOK.on('renderLevels', () => {
  const s = UI.subj, zs = rushZones(s), z = UI.zoneOpen[s], host = $('#mapView .zones');
  if (host && host.insertAdjacentHTML && zs.length >= 2) {
    const r = rushRec(s);
    host.insertAdjacentHTML('beforebegin', `<div class="rushbar"><button class="btn rushbtn" data-act="rushGo" data-v="${s}">⚔️ ${t('ru.go', { n: zs.length })}</button><small>${r.best ? '🏆 ' + t('ru.best', { n: r.best, m: zs.length }) : t('ru.sub')}</small></div>`);
  }
  const zone = z >= 0 ? $('#mapView .zone.zopen .zgrid') : null;
  if (zone && zone.insertAdjacentHTML && SUBJ_ORDER.includes(s)) {
    const g = zoneGoals(s, z), open = secretOpen(s, z), done = secretDone(s, z);
    zone.insertAdjacentHTML('afterend', open
      ? `<button class="secretnode ${done ? 'done' : ''}" data-act="secretGo" data-v="secret:${s}:${z}"><span class="sn-orb" aria-hidden="true">🌟</span><b>${t('sc27.name')}</b><small>${done ? '✔ ' + t('sc27.again') : t('sc27.open')}</small></button>`
      : `<div class="secretnode locked" role="note"><span class="sn-orb" aria-hidden="true">🔒</span><b>${t('sc27.hidden')}</b><small>${t('sc27.how', { n: g })}</small><span class="sn-bar" aria-hidden="true"><i style="width:${Math.round(g / 30 * 100)}%"></i></span></div>`);
  }
});
HOOK.claim('lvT', l => {
  if (!l || !l.special) return undefined;
  const zone = zoneName(l.z), tip = t('tip.' + l.mon.t), run = UI.run;
  let place;
  if (l.special === 'secret') place = `🌟 ${t('sc27.name')} · ${zone}`;
  else if (l.special === 'rush') place = `⚔️ ${t('ru.title')}` + (run && run.mode === 'rush' ? ` ${run.idx + 1}/${run.list.length}` : '');
  else place = `🗼 ${t('tw.floor', { n: l.floor })}`;
  return { name: place, goal: t(l.special === 'tower' ? 'tw.goal' : l.special === 'secret' ? 'sc27.goal' : 'goal.boss'), tip, zone, place };
});
/* after startBattle(): the badge shows the special name; tower monsters get tougher with every floor */
function specialStart(lv) {
  if (!lv || !lv.special) return;
  const pn = $('#placeName'); if (pn) pn.innerHTML = `<b>${esc(lvT(lv).place)}</b>`;
  if (lv.hpMul && lv.hpMul > 1) { B.mMax = B.mHp = Math.round(B.mMax * lv.hpMul); updateHud(); }
}
/* the hero's health carries over inside a Boss Rush or a tower climb (called by 22 once the hero's max health is known) */
function runCarryHP() {
  const r = UI.run; if (!r || !B.lv || B.lv.special !== r.mode || r.hHp == null) return;
  B.hHp = Math.max(1, Math.min(B.hMax, r.hHp)); updateHud();
}
HOOK.on('startBattle', () => specialStart(B.lv));

/* ---------------- winning and losing a special battle ---------------- */
HOOK.around('win', next => {
  victoryPrelude();
  if (B.lv && B.lv.special) return specialWin();
  return next();
});
async function specialWin() {
  const lv = B.lv, tk = B.token, run = UI.run && UI.run.mode === lv.special ? UI.run : null, sp = lv.special;
  S.battles++; S.defeated++;
  let reward = 0, chest = 0, newBest = false, first = false;
  if (sp === 'secret') { const k = secretKey(lv.subj, lv.z); first = !(S.secret || {})[k]; (S.secret || (S.secret = {}))[k] = 1; reward = first ? 40 : 12; chest = first ? 1 : 0; logEvent('lg.secret', { name: zoneName(lv.z) }); }
  else if (sp === 'rush') reward = 15;
  else if (sp === 'tower') { reward = twReward(Math.min(30, 3 + lv.floor), lv, run); const tw = tower(); if (lv.floor > (tw.best[S.band] || 0)) { tw.best[S.band] = lv.floor; newBest = true; } if (lv.floor % 10 === 0) chest = 1; }
  let last = false;
  if (run) {
    run.coins = (run.coins || 0) + reward; run.hHp = Math.min(B.hMax, B.hHp + Math.round(B.hMax * (sp === 'rush' ? .3 : .25)));
    if (sp === 'rush') { run.idx++; last = run.idx >= run.list.length; const R = S.rush || (S.rush = {}), k = lv.subj + ':' + S.band, rec = R[k] || (R[k] = { best: 0, done: 0 }); rec.best = Math.max(rec.best, run.idx); if (last) { rec.done++; chest = 1; } }
    else run.floor = lv.floor + 1;
  }
  if (chest) chestGive(1);
  addCoins(reward); save(); setMusic(''); sfx.win(); wxStop(); cleanBossFx(); { const vi = $('#vsIntro'); if (vi) vi.hidden = true; }
  const m = ms(), h = hs(), pm = fx.pos(m);
  if (!S.sensory) {
    pose(h, 'cheer', 1500); fx.burst(pm.x, pm.y, lv.big ? 36 : 24, ['⭐', '✨', '🌟', '💫', '🎉']); fx.ring(pm.x, pm.y, '#FFD166', 200); fx.coins(m, 6);
    m.animate([{ transform: 'scale(1) rotate(0)', opacity: 1 }, { transform: 'scale(1.12) rotate(-8deg)', offset: .22 }, { transform: 'translate(26px,-60px) scale(.15) rotate(540deg)', opacity: 0 }], { duration: 1000, easing: 'ease-in', fill: 'forwards' });
  }
  announce(t('sr.win', { m: lv.mon.n, n: 0 }), true);
  await wait(S.sensory ? 400 : 1500); if (B.token !== tk) return;
  B.q = null; B.token++; B.active = false; lockUI(); $('#answers').innerHTML = ''; setAdvView('map');
  let head, body, btns;
  const small = (extra = '') => `<div class="wsmall">${extra}<button class="btn ghost" data-act="toMap">${sp === 'tower' ? '🗼 ' + t('tw.rest') : '🗺️ ' + t('v.map')}</button></div>`;
  if (sp === 'secret') {
    head = `🌟 ${t('sc27.won')}`; body = `<p class="sub">${esc(t(first ? 'sc27.wonFirst' : 'sc27.wonAgain', { z: zoneName(lv.z) }))}</p>`;
    btns = small(`<button class="btn ghost" data-act="retry" data-v="${lv.id}">🔁 ${t('v.retry')}</button>`);
  } else if (sp === 'rush') {
    head = last ? `🏆 ${t('ru.done')}` : `⚔️ ${t('ru.beat', { n: run ? run.idx : 1, m: run ? run.list.length : 1 })}`;
    body = `<p class="sub">${esc(t(last ? 'ru.doneSub' : 'ru.heal'))}</p>`;
    btns = last || !run ? small() : `<button class="btn big" data-act="runNext">${t('ru.next')} ▶</button>` + small();
  } else {
    head = `🗼 ${t('tw.cleared', { n: lv.floor })}`;
    body = `<p class="sub">${newBest ? '🏆 ' + esc(t('tw.newBest')) + ' ' : ''}${esc(t('tw.heal'))}</p><p class="tw-next">${esc(t('tw.nextIs', { n: lv.floor + 1 }))} ${towerTier(lv.floor + 1) === 'big' ? '👑' : towerTier(lv.floor + 1) === 'mini' ? '⚔️' : ''}</p>`;
    btns = run ? `<button class="btn big" data-act="runNext">${t('tw.next')} ▶</button>` + small() : small();
  }
  $('#winSheet').innerHTML = `<h2>${head}</h2><div class="win-av"><div class="wa-h pose-cheer">${heroSVG(S.equipped)}</div><div class="wa-m">${monsterSVG(lv.mon, lv.hue || 0)}</div></div>
    ${body}<div class="wline"><span class="gain">+${reward} 🪙</span>${chestBtnHTML()}</div>${coopSummaryHTML()}<div class="wbtns">${btns}</div>`;
  $('#winOverlay').classList.add('on'); setTimeout(syncMusic, 2600);
  if (S.voice.auto) speak(head.replace(/^\S+\s/, ''));
}
/* a knock-out inside a Boss Rush or the tower ends the run (Hoot carries the hero home; nothing is lost) */
HOOK.claim('heroKO', () => UI.run && B.lv && B.lv.special === UI.run.mode ? runOver().then(() => false) : undefined);
async function runOver() {
  const run = UI.run, lv = B.lv, tk = B.token, h = hs(), ph = fx.pos(h);
  UI.lastRun = run; UI.run = null; B.locked = true; teleClear(); resumeClear(); save();   // the run is over at once (the page could close during the animation)
  sfx.ko(); if (h) h.classList.add('ko'); fx.num(ph.x, ph.y - ph.h * .5, t('ko.oops'), 'warn');
  await wait(S.sensory ? 300 : 1100); if (B.token !== tk) return;
  if (h) h.classList.remove('ko');
  B.q = null; B.token++; B.active = false; lockUI(); wxStop(); cleanBossFx(); camReset(); $('#answers').innerHTML = ''; setAdvView('map'); setMusic('');
  let head, body, again;
  if (run.mode === 'tower') {
    const got = Math.max(0, (run.floor || 1) - (run.start || 1)), best = tower().best[S.band] || 0;
    head = `🗼 ${t('tw.over')}`; body = `<p class="sub">${esc(t('tw.overSub', { n: got, f: lv.floor }))}</p><p class="tw-best"><span>🏆 ${esc(t('tw.best', { n: best }))}</span></p>`;
    again = `<button class="btn big" data-act="towerGo" data-v="${run.start || 1}">🔁 ${t('tw.again')}</button>`;
  } else {
    head = `⚔️ ${t('ru.over')}`; body = `<p class="sub">${esc(t('ru.overSub', { n: run.idx, m: run.list.length }))}</p>`;
    again = `<button class="btn big" data-act="rushGo" data-v="${run.subj}">🔁 ${t('ru.again')}</button>`;
  }
  $('#winSheet').innerHTML = `<h2>${head}</h2><div class="win-av"><div class="wa-h">${heroSVG(S.equipped)}</div><div class="wa-m">${monsterSVG(lv.mon, lv.hue || 0)}</div></div>${body}
    <div class="wline"><span class="gain">+${run.coins || 0} 🪙</span>${chestBtnHTML()}</div>${coopSummaryHTML()}<div class="wbtns">${again}<div class="wsmall"><button class="btn ghost" data-act="toMap">${run.mode === 'tower' ? '🗼 ' + t('tw.back') : '🗺️ ' + t('v.map')}</button></div></div>`;
  $('#winOverlay').classList.add('on');
}
function runStart(run, id) {
  UI.run = run; $('#winOverlay').classList.remove('on');
  if (UI.tab !== 'adventure') showTab('adventure', true);
  pxWipe(() => startBattle(id));
}
function towerGo(f) {
  f = Math.max(1, Math.floor(+f) || 1); const tw = tower(); tw.runs = (tw.runs || 0) + 1; save();
  runStart(Object.assign({ mode: 'tower', floor: f, start: f, coins: 0, hHp: null }, twNewRun()), 'tower:' + f);   // v35: perks, seed, focus (45)
}
function rushGo(s) {
  const list = rushZones(s); if (list.length < 2) { toast(t('ru.need')); return; }
  UI.subj = s; UI.screen = 'levels';
  runStart({ mode: 'rush', subj: s, list, idx: 0, coins: 0, hHp: null }, `rush:${s}:${list[0]}`);
  toast(t('ru.start', { n: list.length }));
}
function runNext() {
  const r = UI.run; if (!r) return; $('#winOverlay').classList.remove('on');
  const id = r.mode === 'tower' ? 'tower:' + r.floor : `rush:${r.subj}:${r.list[r.idx]}`;
  pxWipe(() => startBattle(id));
}
/* leaving a run (or its end card) goes back to where it started */
function runHome() {
  const r = UI.run || UI.lastRun; UI.run = null; UI.lastRun = null;
  pxWipe(() => { $('#winOverlay').classList.remove('on'); if (r && r.mode === 'tower') showTab('tower', true); else setAdvView('map'); });
}

/* ---------------- the Endless Tower tab ---------------- */
function renderTower() { return HOOK.call('renderTower', renderTowerBase, arguments); }   // v35: the new map and start options (45)
function renderTowerBase() {
  const host = $('#tab-tower'); if (!host) return;
  const tw = tower(), best = tw.best[S.band] || 0, cp = Math.floor(best / 10) * 10, top = Math.max(best + 3, 7);
  const floors = Array.from({ length: 8 }, (_, i) => top - i).filter(f => f >= 1).map(f => {
    const tr = towerTier(f), cls = f <= best ? 'done' : f === best + 1 ? 'next' : '';
    return `<div class="tw-floor ${tr} ${cls}" style="--i:${top - f}"><b>${f}</b><span aria-hidden="true">${tr === 'big' ? '👑🎁' : tr === 'mini' ? '⚔️' : ''}</span>${f === best + 1 ? `<i class="tw-hero" aria-hidden="true">${heroSVG(S.equipped)}</i>` : f <= best ? '<em aria-hidden="true">✔</em>' : ''}</div>`;
  }).join('');
  host.innerHTML = `<div class="wrap towerwrap"><h1 class="title">🗼 ${t('tw.title')}</h1><p class="sub">${t('tw.sub')}</p>
    <div class="tw-top"><div class="tw-best"><span>🏆 ${esc(t('tw.best', { n: best }))}</span><small>${t('band.' + S.band)} · ${esc(t('tw.runs', { n: tw.runs || 0 }))}</small></div><div class="seg diffbar">${diffChips()}</div></div>
    <div class="tw-col" role="img" aria-label="${esc(t('tw.aria', { n: best }))}">${floors}<div class="tw-base" aria-hidden="true"></div></div>
    <div class="brief-actions"><button class="btn big" data-act="towerGo" data-v="1">▶ ${t('tw.start')}</button>${cp >= 10 ? `<button class="btn" data-act="towerGo" data-v="${cp + 1}">⏩ ${esc(t('tw.from', { n: cp + 1 }))}</button>` : ''}</div>
    <ul class="tw-rules"><li>📈 ${t('tw.r1')}</li><li>⚔️ ${t('tw.r2')}</li><li>💖 ${t('tw.r3')}</li><li>🏆 ${t('tw.r4')}</li></ul></div>`;
}
HOOK.on('showTab', name => { if (name === 'tower' && UI.tab === 'tower') renderTower(); });

/* ---------------- team play setup ---------------- */
function coopOverlay() {
  let ov = $('#coopOverlay');
  if (!ov) { ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'coopOverlay'; ov.innerHTML = '<div class="mwrap"><button class="mclose" data-act="coopClose" aria-label="Close">✕</button><div class="sheet coopsheet" id="coopSheet" role="dialog" aria-modal="true"></div></div>'; document.body.appendChild(ov); }
  const n = coopN(), sh = $('#coopSheet'); sh.setAttribute('aria-label', t('co.title'));
  sh.innerHTML = `<h2>👫 ${t('co.title')}</h2><p class="sub">${t('co.sub')} ${t('co.how')}</p><div class="seg co-n">${[1, 2, 3].map(k => `<button class="chip big" data-act="coopN" data-v="${k}" aria-pressed="${n === k}">${k === 1 ? t('co.solo') : t('co.n', { n: k })}</button>`).join('')}</div>${Array.from({ length: n }, (_, i) => `<label class="co-in" data-p="${i}"><span>${COOP_EM[i]} ${t('co.player', { n: i + 1 })}</span><input id="coopName${i}" maxlength="16" value="${esc(coopName(i))}" autocomplete="off"></label>`).join('')}
    <div class="brief-actions"><button class="btn big" data-act="coopSave">✔ ${t('co.save')}</button></div>`;
  ov.classList.add('on');
}
function coopSave() {
  const c = coopCfg(); c.names = [0, 1, 2].map(i => { const el = $('#coopName' + i); return el && el.value !== undefined ? cleanName(el.value) : (c.names || [])[i] || ''; });
  saveDev(); $('#coopOverlay') && $('#coopOverlay').classList.remove('on'); if (UI.tab === 'adventure' && !B.active) renderMap();
}

/* ---------------- events ---------------- */
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'subj': if (v === 'mix') { UI.screen = 'mix'; setAdvView('map'); pxEnter($('#mapView .wrap')); return true; } break;
    case 'secretGo': { const p = String(v).split(':'); if (!secretOpen(p[1], +p[2]) && !S.openAll) { toast(t('sc27.how', { n: zoneGoals(p[1], +p[2]) })); return true; } UI.run = null; pxWipe(() => startBattle(v)); return true; }
    case 'rushGo': rushGo(v); return true;
    case 'towerGo': towerGo(v); return true;
    case 'runNext': runNext(); return true;
    case 'toMap': if (UI.run || UI.lastRun) { runHome(); return true; } break;
    case 'leave': if (UI.run) { const r = UI.run; pxWipe(() => { leaveBattle(); UI.run = null; if (r.mode === 'tower') showTab('tower', true); }); return true; } break;
    case 'diff': if (UI.tab === 'tower') { S.band = +v; applyTheme(); save(); renderTower(); return true; } break;
    case 'coopN': { const c = coopCfg(); [0, 1, 2].forEach(i => { const el = $('#coopName' + i); if (el && el.value !== undefined) (c.names || (c.names = ['', '', '']))[i] = cleanName(el.value); }); }
      coopCfg().n = Math.max(1, Math.min(3, +v || 1)); saveDev(); renderMap(); if ($('#coopOverlay.on')) coopOverlay(); return true;
    case 'coopNames': coopOverlay(); return true;
    case 'coopSave': coopSave(); return true;
    case 'coopClose': $('#coopOverlay') && $('#coopOverlay').classList.remove('on'); return true;
    case 'resumeGo': resumeGo(); return true;
    case 'resumeNo': resumeNo(); return true;
  }
  return undefined;
});

Object.assign(STR, {
  'nav.tower': ['Tower', 'Menara'],
  'subj.mix': ['Subject Mix', 'Campuran Subjek'], 'steam.mix': ['Subject Mix', 'Campuran Subjek'], 'goal.mix': ['Questions from three subjects in one battle!', 'Soalan daripada tiga subjek dalam satu pertarungan!'],
  'mx.sub': ['Three subjects in one battle', 'Tiga subjek dalam satu pertarungan'], 'mx.levels': ['{n} levels', '{n} tahap'],
  'mx.long': ['Each level mixes questions from three subjects. The little pictures show which ones.', 'Setiap tahap mencampurkan soalan daripada tiga subjek. Gambar kecil menunjukkan subjeknya.'],
  'sc27.name': ['Secret Level', 'Tahap Rahsia'], 'sc27.hidden': ['A secret level is hidden here', 'Ada tahap rahsia tersembunyi di sini'],
  'sc27.how': ['Get all 3 goals on every level in this zone to open it ({n}/30 goals).', 'Dapatkan semua 3 matlamat pada setiap tahap dalam zon ini untuk membukanya ({n}/30 matlamat).'],
  'sc27.open': ['Open! Tap to play', 'Terbuka! Sentuh untuk main'], 'sc27.again': ['Cleared. Play again', 'Selesai. Main lagi'],
  'sc27.goal': ['A tricky hidden battle with questions from the whole zone.', 'Pertarungan rahsia yang mencabar dengan soalan dari seluruh zon.'],
  'sc27.won': ['Secret level cleared!', 'Tahap rahsia selesai!'], 'sc27.wonFirst': ['You found the secret of {z}! A treasure chest is yours.', 'Kamu menemui rahsia {z}! Peti harta untuk kamu.'],
  'sc27.wonAgain': ['You beat the secret of {z} again. Great!', 'Kamu kalahkan rahsia {z} sekali lagi. Hebat!'],
  'lg.secret': ['Cleared the secret level of {name}', 'Menamatkan tahap rahsia {name}'],
  'ru.title': ['Boss Rush', 'Serbuan Bos'], 'ru.go': ['Boss Rush ({n} bosses)', 'Serbuan Bos ({n} bos)'], 'ru.sub': ['Fight every boss you beat, one after another!', 'Lawan semua bos yang kamu kalahkan, satu demi satu!'],
  'ru.best': ['Best: {n}/{m} bosses', 'Terbaik: {n}/{m} bos'], 'ru.need': ['Beat 2 zone bosses first.', 'Kalahkan 2 bos zon dahulu.'], 'ru.start': ['Boss Rush! Beat {n} bosses in a row.', 'Serbuan Bos! Kalahkan {n} bos berturut-turut.'],
  'ru.beat': ['Boss {n} of {m} beaten!', 'Bos {n} daripada {m} tumbang!'], 'ru.heal': ['You get back a little health. Ready for the next boss?', 'Kamu pulih sedikit. Bersedia untuk bos seterusnya?'],
  'ru.next': ['Next boss', 'Bos seterusnya'], 'ru.done': ['Boss Rush complete!', 'Serbuan Bos selesai!'], 'ru.doneSub': ['You beat every boss in a row. Amazing! Here is a chest.', 'Kamu kalahkan semua bos berturut-turut. Hebat! Ini peti harta untuk kamu.'],
  'ru.over': ['Boss Rush over', 'Serbuan Bos tamat'], 'ru.overSub': ['You beat {n} of {m} bosses. Try again to go further!', 'Kamu kalahkan {n} daripada {m} bos. Cuba lagi untuk pergi lebih jauh!'], 'ru.again': ['Try again', 'Cuba lagi'],
  'tw.title': ['Endless Tower', 'Menara Tanpa Hujung'], 'tw.sub': ['Climb as high as you can. Every floor is a little harder!', 'Panjat setinggi yang boleh. Setiap tingkat lebih sukar sedikit!'],
  'tw.best': ['Best floor: {n}', 'Tingkat terbaik: {n}'], 'tw.runs': ['{n} climbs', '{n} kali mendaki'], 'tw.aria': ['The tower. Your best floor is {n}.', 'Menara. Tingkat terbaik kamu ialah {n}.'],
  'tw.start': ['Start climbing', 'Mula mendaki'], 'tw.from': ['Start at floor {n}', 'Mula di tingkat {n}'], 'tw.floor': ['Floor {n}', 'Tingkat {n}'],
  'tw.goal': ['Beat the monster to climb to the next floor.', 'Kalahkan raksasa untuk naik ke tingkat seterusnya.'],
  'tw.r1': ['Monsters hit harder and the clock gets shorter as you climb.', 'Raksasa makin kuat dan masa makin singkat semasa kamu mendaki.'],
  'tw.r2': ['Every 5th floor is a mini boss. Every 10th floor is a big boss with a treasure chest.', 'Setiap tingkat ke-5 ada bos kecil. Setiap tingkat ke-10 ada bos besar dengan peti harta.'],
  'tw.r3': ['Your health carries on to the next floor (you heal a little).', 'Nyawa kamu dibawa ke tingkat seterusnya (kamu pulih sedikit).'],
  'tw.r4': ['If you are knocked out, the climb ends. Your best floor is saved.', 'Jika kamu tumbang, pendakian tamat. Tingkat terbaik disimpan.'],
  'tw.cleared': ['Floor {n} cleared!', 'Tingkat {n} selesai!'], 'tw.newBest': ['New best floor!', 'Tingkat terbaik baharu!'], 'tw.heal': ['You heal a little.', 'Kamu pulih sedikit.'],
  'tw.nextIs': ['Next: floor {n}', 'Seterusnya: tingkat {n}'], 'tw.next': ['Next floor', 'Tingkat seterusnya'], 'tw.rest': ['Rest', 'Berehat'],
  'tw.over': ['The climb is over', 'Pendakian tamat'], 'tw.overSub': ['You climbed {n} floor(s) and reached floor {f}. Well done!', 'Kamu mendaki {n} tingkat dan sampai ke tingkat {f}. Syabas!'],
  'tw.again': ['Climb again', 'Daki lagi'], 'tw.back': ['Back to the tower', 'Kembali ke menara'],
  'co.title': ['Team play', 'Main berpasukan'], 'co.sub': ['Brothers and sisters take turns answering.', 'Adik-beradik bergilir-gilir menjawab.'],
  'co.solo': ['Just me', 'Saya sahaja'], 'co.n': ['{n} players', '{n} pemain'], 'co.names': ['Names', 'Nama'],
  'co.how': ['Each new question goes to the next player. Type everyone’s name.', 'Setiap soalan baharu untuk pemain seterusnya. Taip nama semua pemain.'], 'co.save': ['Save', 'Simpan']
});
