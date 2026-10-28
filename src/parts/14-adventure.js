/* ================= v5: adventure = subject -> levels -> briefing -> battle ================= */
const starKey = (subj, n, band = S.band) => `${subj}:${band}:${n}`;
const starsAt = (subj, n) => S.stars[starKey(subj, n)] || 0;
/* v34: the placement quiz can set a later starting level for a subject (S.place); levels before it stay open to replay */
const placeKey = (s, band = S.band) => band + ':' + s;   // one starting level per subject and age
const startN = s => Math.max(1, Math.min(LEVELS_PER, +((S.place || {})[placeKey(s)]) || 1));
const isUnlocked = l => !!S.openAll || l.n === 1 || l.n <= startN(l.subj) || clearAt(l.subj, l.n - 1);
const subjStars = s => { let a = 0; for (let n = 1; n <= LEVELS_PER; n++) a += starsAt(s, n); return a; };
const nextLevelN = s => { for (let n = startN(s); n <= LEVELS_PER; n++) if (!clearAt(s, n)) return n; return 0; };
/* v11: every age band has its own saga, zone names and level names (src/content/saga.js) */
const sagaOf = (band = S.band) => SAGA[band] || SAGA[3];
const LI = () => S.lang === 'ms' ? 1 : 0;
const zoneName = (z, band) => sagaOf(band).zones[Math.max(0, Math.min(9, z))].n[LI()];
const levelName = (n, band) => { const z = Math.floor((n - 1) / 10); return sagaOf(band).zones[Math.max(0, Math.min(9, z))].lv[(n - 1) % 10][LI()]; };
/* v26: how far this subject's saga has come (pages filled, stars lit, trials passed, seals relit) */
function sagaProgHTML(s) {
  const p = sagaOf().prog; if (!p || !SUBJ_ORDER.includes(s)) return '';
  const n = Array.from({ length: 10 }, (_, z) => z).filter(z => clearAt(s, z * 10 + 10)).length, txt = p[1 + LI()].replace('{n}', n);
  return `<p class="sagaprog"><span aria-hidden="true">${p[0]}</span> <b>${esc(txt)}</b> <span class="sp-pips" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span></p>`;
}
/* a zone opens once the boss of the zone before it has been beaten (or a grown-up turned on "open all levels") */
const zoneUnlocked = (s, z) => !!S.openAll || z <= 0 || z * 10 < startN(s) || clearAt(s, z * 10);
const getLevel = id => specialLevel(id) || (([s, n]) => levelOf(s, +n))(id.split(':'));   // v27: secret levels, Boss Rush and the Endless Tower have their own ids (21)
function lvT() { return HOOK.call('lvT', lvTBase, arguments); }   // v31: extensions register with HOOK (00c)
function lvTBase(l) {
  const zone = zoneName(l.z);
  if (l.steam) return { name: `${t('adv.level', { n: l.n })} · ${t('steam.' + l.subj)}`, goal: t(l.boss ? 'goal.boss' : 'goal.' + l.subj), tip: t('tip.' + l.mon.t), zone: t('steam.' + l.subj), place: t('steam.' + l.subj) };
  const place = levelName(l.n);
  return { name: `${t('adv.level', { n: l.n })} · ${place}`, goal: t(l.boss ? 'goal.boss' : 'goal.' + l.subj), tip: t('tip.' + l.mon.t), zone, place };
}
/* Rematch questions interleave the subject's skills, weighted toward the ones practised least or missed most */
function reviewEntries(subj) {
  const ts = TOPICS.filter(x => x.subj === subj && !(S.band <= 3 && x.id === 'math_frac'));
  ts.sort((a, b) => (mastery(a.id) ?? .45) - (mastery(b.id) ?? .45));
  const pool = []; ts.forEach((x, i) => { for (let k = 0; k < (i === 0 ? 4 : i === 1 ? 3 : 1); k++) pool.push(x.entry); });
  return pool;
}
function heroStripHTML() {
  const total = Object.values(S.stars).reduce((a, b) => a + b, 0), xp = heroXP(), lvl = 1 + Math.floor(xp / 10);   // v22: the daily quest was removed
  return `<div class="herostrip"><div class="hs-av">${heroSVG(S.equipped)}</div><div class="hs-info"><b>${t('hero.lvl', { n: lvl })}</b>${typeof lookTitleChip === 'function' ? lookTitleChip() : ''}<div class="xp"><i style="width:${(xp % 10) * 10}%"></i></div><small>⭐ ${total} · 🪙 ${S.coins}</small></div>${typeof heroStripExtra === 'function' ? heroStripExtra() : ''}</div>`;
}
const diffChips = () => [1, 2, 3, 4].map(b => `<button class="chip big" data-act="diff" data-v="${b}" aria-pressed="${S.band === b}">${t('band.' + b)}</button>`).join('');
/* v31: a compact age picker: "Age  4 5 6 7" in one short row */
const ageBarHTML = () => `<div class="agebar" role="group" aria-label="${esc(t('adv.diff'))}"><span aria-hidden="true">${t('adv.age')}</span>${[1, 2, 3, 4].map(b => `<button class="chip" data-act="diff" data-v="${b}" aria-pressed="${S.band === b}" aria-label="${esc(t('band.' + b))}">${b + 3}</button>`).join('')}</div>`;
/* v31: a simpler subject screen: small tiles (picture, name, stars) instead of big cards with a sentence each */
function renderSubjects() { return HOOK.call('renderSubjects', renderSubjectsBase, arguments); }   // v31: extensions register with HOOK (00c)
function renderSubjectsBase() {
  const cards = SUBJ_ORDER.map(s => {
    const st = subjStars(s), off = !subjOpen(s), max = LEVELS_PER * 3;
    return `<button class="sj sj31 ${off ? 'off' : ''}" style="--c:${SUBJ_COL[s]}" data-act="subj" data-v="${s}" ${off ? `aria-disabled="true"` : ''} aria-label="${esc(`${t('subj.' + s)}. ${t('advd.' + s)}. ⭐ ${st}/${max}${off ? '. ' + t('sj.offTag') : ''}`)}">${off ? `<span class="offtag" aria-hidden="true">🔒</span>` : ''}<span class="em" aria-hidden="true">${SUBJ_EM[s]}</span><b>${t('subj.' + s)}</b><span class="sj-st" aria-hidden="true">⭐ ${st}<i class="sj-bar"><u style="width:${Math.round(st / max * 100)}%"></u></i></span></button>`;
  }).join('');
  $('#mapView').innerHTML = `<div class="wrap adv31">${heroStripHTML()}<div class="adv-top"><h1 class="title">${t('adv.pick')}</h1>${ageBarHTML()}</div>${subjBannerHTML()}<div class="subjgrid">${cards}</div></div>`;
}
function renderLevels() { return HOOK.call('renderLevels', renderLevelsBase, arguments); }   // v31: extensions register with HOOK (00c)
function renderLevelsBase() {
  const s = UI.subj, nx = nextLevelN(s);
  if (UI.zoneOpen[s] === undefined || UI.zoneOpen[s] === null || (UI.zoneOpen[s] >= 0 && !zoneUnlocked(s, UI.zoneOpen[s]))) UI.zoneOpen[s] = nx ? Math.floor((nx - 1) / 10) : 9;
  const zones = Array.from({ length: LEVELS_PER / 10 }, (_, z) => {
    let zs = 0; for (let n = z * 10 + 1; n <= z * 10 + 10; n++) zs += starsAt(s, n);
    const zlo = zoneUnlocked(s, z), open = zlo && UI.zoneOpen[s] === z, zem = sagaOf().zones[z].em;
    const nodes = !open ? '' : Array.from({ length: 10 }, (_, i) => {
      const n = z * 10 + i + 1, lv = levelOf(s, n), lo = isUnlocked(lv), st = starsAt(s, n), next = lo && !clearAt(s, n), nm = levelName(n);
      const aria = t('map.aria', { id: n, name: nm, boss: lv.big ? ', ' + t('tier.big') : lv.mini ? ', ' + t('tier.mini') : '', s: lo ? t('map.stars', { n: st }) + '. ' + goalAria(s, n) : t('map.lockedAria') });
      return `<button class="lnode zn ${lv.tier} ${lo ? '' : 'locked'} ${next ? 'next' : ''}" style="--i:${i}" data-act="level" data-v="${lv.id}" aria-label="${esc(aria)}"><span class="orb">${lo ? (lv.big ? '<em>👑</em>' : lv.mini ? '<em>⚔️</em>' : '') + `<b>${n}</b>` : '🔒'}</span>${lo ? goalsHTML(s, n, lo) : `<span class="goals" aria-hidden="true"></span>`}<span class="lname" aria-hidden="true">${esc(nm)}</span></button>`;
    }).join('');
    const bossOpen = open && isUnlocked(levelOf(s, z * 10 + 10));
    const pct = Math.round(zs / 30 * 100);
    return `<section class="zone ${zlo ? '' : 'zlocked'} ${open ? 'zopen' : 'zslim'}" style="--zh:${sagaOf().zones[z].hue};${open ? zoneSceneStyle(z) : ''}"><button class="zhead ${open ? 'scene' : 'slim'}" data-act="zone" data-v="${z}" aria-expanded="${open}" ${zlo ? '' : `aria-disabled="true" aria-label="${esc(t('map.zoneLockedAria', { z: zoneName(z) }))}"`}><span class="zn-n">${zlo ? zem : '🔒'}</span><b>${esc(zoneName(z))}<small>${zlo ? t('adv.zoneLv', { a: z * 10 + 1, b: z * 10 + 10 }) : t('map.zoneLocked', { z: zoneName(z - 1) })}</small><span class="zbar" aria-hidden="true"><i style="width:${pct}%"></i></span></b><span class="zp">${zlo ? `★ ${zs}/30` : ''}</span></button>${open ? `<div class="zstories"><button class="chip big storybtn" data-act="comic" data-v="${z}">${t('cm.replay')}</button>${bossOpen ? `<button class="chip big storybtn boss" data-act="bossStory" data-v="${z}">${t('cn.bossStory')}</button>` : ''}${clearAt(s, z * 10 + 10) ? `<button class="chip big storybtn vict" data-act="victStory" data-v="${z}">${t('cn.victStory')}</button>` : ''}</div><div class="zgrid">${nodes}</div>` : ''}</section>`;
  }).join('');
  /* v31: one header row (back, subject, age), one story line, slim rows for the zones that are not open */
  $('#mapView').innerHTML = `<div class="wrap adv31 lv31"><div class="lvhead"><button class="btn ghost" data-act="subjBack" aria-label="${esc(t('adv.back'))}">←</button><h1 class="title" style="margin:0">${SUBJ_EM[s]} ${t('subj.' + s)}</h1>${ageBarHTML()}</div><div class="saga31"><span class="sagaline">📖 ${esc(sagaOf().title[LI()])}</span>${sagaProgHTML(s)}</div><div class="zones">${zones}</div></div>`;
  warmFor('map'); requestAnimationFrame(placeHeroMarker);   // v22: hero on the path
}
function renderMap() { return HOOK.call('renderMap', renderMapBase, arguments); }   // v31: extensions register with HOOK (00c)
function renderMapBase() { if (UI.screen === 'levels') renderLevels(); else renderSubjects(); }

/* ---- Pre-battle briefing (monster, goal, stars, and how the child wants to answer) ---- */
function reopenBrief() { const sh = $('#briefSheet'), y = sh ? sh.scrollTop : 0; UI.bopts = true; openBrief(UI.brief); if (sh) sh.scrollTop = y; }
function openBrief(id) {
  const l = getLevel(id), T = lvT(l), st = starsAt(l.subj, l.n);
  if (!subjOpen(l.subj)) { toast(t('sj.off')); return; }
  if (UI.brief !== id) UI.bopts = false; UI.brief = id;
  const say = t('br.say', { id: l.n, name: T.name, m: l.mon.n, goal: T.goal });
  const tag = l.big ? t('tier.big') : l.mini ? t('tier.mini') : t('br.enemy');
  const rp = S.repPick || 'concrete';
  const reps = l.subj === 'math' ? ['concrete', 'pictorial', 'abstract'].map((n, i) => `<button class="chip big" data-act="repPick" data-v="${n}" aria-pressed="${rp === n}">${['🧱', '🖼️', '🔢'][i]} ${t('rep.' + n)}</button>`).join('') : '';
  const styles = [['tap', 'ex.tap'], ['draw', 'ex.draw'], ['voice', 'ex.voice'], ...(l.subj === 'math' ? [['write', 'ex.write']] : [])].map(([v, k]) => `<button class="chip big" data-act="style" data-v="${v}" aria-pressed="${S.expr === v}">${t(k)}</button>`).join('');
  /* v23: a calmer card. The monster and the three goals up front, one big button; the answer settings are tucked away */
  const g = goalsAt(l.subj, l.n);
  $('#briefSheet').innerHTML = `<div class="brief-head"><div><small>${SUBJ_EM[l.subj]} ${t('subj.' + l.subj)}</small><h2>${esc(T.name)}</h2></div><button class="speak" data-act="say" data-say="${esc(say)}" aria-label="${esc(t('br.listen'))}">🔊</button></div>
    <div class="bfoe ${l.boss ? 'boss' : ''}"><div class="bfoe-av">${monsterSVG(l.mon, l.hue || 0)}</div>${l.boss ? `<span class="tag boss">${tag}</span>` : ''}<b class="bfoe-n">${esc(l.mon.n)}</b><p class="bfoe-goal">${esc(T.goal)}</p></div>
    <div class="bgoals" role="list" aria-label="${esc(t('br.stars'))}">${GOALS.map(([b, ic, k]) => `<span role="listitem" class="bgoal ${g & b ? 'got' : ''}" title="${esc(t(k + 'D'))}"><i aria-hidden="true">${ic}</i><b>${t(k)}</b><em aria-label="${esc(t(g & b ? 'gl.got' : 'gl.notyet'))}">${g & b ? '★' : '☆'}</em></span>`).join('')}</div>
    <div class="brief-actions"><button class="btn big" data-act="engage" data-v="${l.id}">${t('br.engage')}</button></div>
    <details class="bopts" ${UI.bopts ? 'open' : ''}><summary>⚙️ ${t('br.opts')}</summary>
      ${reps ? `<h3 class="bsec">${t('br.rep')}</h3><div class="seg stylebar" role="group">${reps}</div>` : ''}
      <h3 class="bsec">${t('ex.how')}</h3><div class="seg stylebar" role="group">${styles}</div></details>`;
  $('#briefOverlay').classList.add('on');
}

/* ---- v11: the VS splash that opens every battle (stage only, never blocks the question) ---- */
function vsIntro(lv, T) {
  const v = $('#vsIntro'); if (!v) return; clearTimeout(v._t);
  if (S.sensory) { v.hidden = true; B.introUntil = 0; return; }
  const tag = lv.big ? t('tier.big') : lv.mini ? t('tier.mini') : t('b.lv', { n: lv.n });
  v.className = 'vs-intro ' + (lv.big ? 'big' : lv.mini ? 'mini' : '');
  v.innerHTML = `<div class="vs-side l"><div class="vs-av">${heroSVG(S.equipped)}</div><b>${esc(t('b.hero'))}</b></div><div class="vs-mid"><span class="vs-tag">${esc(tag)}</span><b class="vs-word">VS</b><span class="vs-place">${esc(T.place)}</span></div><div class="vs-side r"><div class="vs-av">${monsterSVG(lv.mon, lv.hue || 0)}</div><b>${esc(lv.mon.n)}</b></div>`;
  v.hidden = false; replayClass(v, 'go');
  const ms = lv.boss ? 2300 : 1700; B.introUntil = Date.now() + ms;
  v._t = setTimeout(() => { v.hidden = true; v.classList.remove('go'); }, ms);
  if (lv.boss) setTimeout(() => sfx.growl(), 500);
}
/* the boss intro story plays the first time a child reaches a zone's level-10 boss */
const bossStoryKey = (subj, z) => 'boss4:' + S.band + ':' + subj + ':' + z;
const needsBossStory = l => !!(l && l.big && !l.steam && !(S.comics || {})[bossStoryKey(l.subj, l.z)]);
function enterBattle(id) {
  const l = getLevel(id);
  if (needsBossStory(l)) { openComic(l.z, () => startBattle(id), l.subj, 'boss'); return; }
  if (needsMiniStory(l)) { openComic(l.z, () => startBattle(id), l.subj, 'mini'); return; }   // v32: a short scene at level 5 of every zone (29)
  startBattle(id);
}

/* ---- starting and winning a battle ---- */
function startBattle() { return HOOK.call('startBattle', startBattleBase, arguments); }   // v31: extensions register with HOOK (00c)
function startBattleBase(id) {
  const lv = getLevel(id), hp = Math.round(lv.rounds * (BAL.hpRound + (lv.z || 0) * BAL.hpZone));   // v22: tougher monsters, more so in later zones
  Object.assign(B, { lv, dk: lv.dk || 1, pool: lv.pool, mMax: hp, mHp: hp, hMax: 100, hHp: 100, combo: 0, charge: 0, ko: 0, timeouts: 0, hints: 0, tUsed: 0, tAllow: 0, fins: 0, asked: 0, first: 0, locked: false, token: B.token + 1, lastKey: '', seen: new Set(), active: true });
  UI.adv = 'battle'; $('#mapView').hidden = true; $('#battleView').hidden = false; lockUI(); retitleBattle();
  const T = lvT(lv), m = $('#monSprite'), h = $('#heroSprite');
  const stg = $('#stage'); stg.style.background = S.pixel ? `url(${PX.bg(lv.z, S.band, !!lv.big)}) center bottom / cover no-repeat, #1a1430` : lv.bg; stg.dataset.tier = lv.tier; $('#scenery').innerHTML = sceneryHTML(lv.scene);
  $('#placeName').innerHTML = `<b>${esc(t('b.lv', { n: lv.n }))}</b> ${esc(T.place)}`;
  $('#tierChip').hidden = !lv.boss; $('#tierChip').textContent = lv.big ? '👑 ' + t('tier.big') : '⚔️ ' + t('tier.mini');
  $('#mName').textContent = (lv.big ? '👑 ' : lv.mini ? '⚔️ ' : '') + lv.mon.n;
  vsIntro(lv, T);
  m.getAnimations().forEach(a => a.cancel()); h.getAnimations().forEach(a => a.cancel());
  m.className = 'sprite monster' + (lv.big ? ' big' : lv.mini ? ' boss' : ''); m.innerHTML = monsterSVG(lv.mon, lv.hue || 0); m.style.visibility = ''; h.className = 'sprite hero'; h.innerHTML = heroSVG(S.equipped); setIdle(lv);   // v24: smooth idle motion for each kind of character
  if (!S.sensory) {
    m.animate([{ transform: 'translateX(120px) scale(.6)', opacity: 0 }, { transform: 'translateX(-14px) scale(1.06,.94)', opacity: 1, offset: .65 }, { transform: 'translateX(0) scale(1)', opacity: 1 }], { duration: 760, easing: 'cubic-bezier(.2,.8,.3,1)' });
    h.animate([{ transform: 'translateX(-90px)', opacity: 0 }, { transform: 'translateX(8px)', opacity: 1, offset: .7 }, { transform: 'translateX(0)', opacity: 1 }], { duration: 640, easing: 'cubic-bezier(.2,.8,.3,1)' });
  }
  bossReset(); wxStart(wxKind(lv)); updateHud(); nextQuestion(); syncMusic(); sfx.enter();
}
function win() { return HOOK.call('win', winBase, arguments); }   // v31: extensions register with HOOK (00c)
async function winBase() {
  const lv = B.lv, tk = B.token, ko = B.ko || 0, now = battleGoals(), T = lvT(lv);
  S.battles++; S.defeated++;
  let reward, firstClear = false;
  {
    const k = starKey(lv.subj, lv.n), prev = S.stars[k] || 0, G2 = S.goals || (S.goals = {}), C2 = S.clear || (S.clear = {});
    firstClear = !C2[k] && !prev; C2[k] = 1; G2[k] = (G2[k] || 0) | now; S.stars[k] = bits3(G2[k]); sess.stars += Math.max(0, S.stars[k] - prev);
    var stars = bits3(now);   // stars earned in this battle (the level keeps the best of every try)
    reward = 8 + (lv.big ? 16 : lv.mini ? 8 : 0) + stars * 3 + (firstClear ? 10 : 0);
    if (firstClear) UI.walk = { subj: lv.subj, n: lv.n };
    var newCard = dexAdd(lv);   // v22: a monster card for the collection
    var newFoil = dexFoil(lv);   // v24: three stars turn the card into a foil
    logEvent('lg.cleared', { id: lv.n, name: T.zone, n: stars });
  }
  addCoins(reward); const evo = addPetXP(5); save(); setMusic(''); sfx.win(); announce(t('sr.win', { m: lv.mon.n, n: stars }), true); wxStop(); cleanBossFx(); { const vi = $('#vsIntro'); if (vi) vi.hidden = true; }
  const m = ms(), h = hs(), pm = fx.pos(m);
  if (!S.sensory) {
    pose(h, 'cheer', 1500); fx.burst(pm.x, pm.y, lv.big ? 36 : 26, ['⭐', '✨', '🌟', '💫', '🎉']); fx.ring(pm.x, pm.y, '#FFD166', 200); fx.coins(m, Math.min(12, 4 + stars * 2 + (lv.big ? 3 : 0)));
    m.animate([{ transform: 'scale(1) rotate(0)', opacity: 1 }, { transform: 'scale(1.12) rotate(-8deg)', offset: .22 }, { transform: 'translate(26px,-60px) scale(.15) rotate(540deg)', opacity: 0 }], { duration: 1000, easing: 'ease-in', fill: 'forwards' });
  }
  await wait(S.sensory ? 400 : 1500); if (B.token !== tk) return;
  B.q = null; B.token++; B.active = false; lockUI(); $('#answers').innerHTML = ''; setAdvView('map');
  const nextLv = lv.n >= (lv.steam ? STEAM_N : LEVELS_PER) ? null : levelOf(lv.subj, lv.n + 1);
  /* v23: a simpler victory card: stars, coins, one tip for next time, and three clear buttons */
  const miss = GOALS.find(([b]) => !(now & b)), card = newCard || newFoil ? `<button class="wchip ${newFoil ? 'foil' : ''}" data-act="dexGo"><span aria-hidden="true">${newFoil ? '✨' : '🎴'}</span> ${t(newFoil ? 'rr.gotFoil' : 'dx.got')}</button>` : '';
  const extra = `<div class="wstars" aria-label="${esc(t('map.stars', { n: stars }))}">${GOALS.map(([b, ic]) => `<i class="${now & b ? 'on' : ''}"><span>★</span><em>${ic}</em></i>`).join('')}</div>`;
  $('#winSheet').innerHTML = `<h2>${lv.big ? t('v.boss') : lv.mini ? t('v.boss') : t('v.title')}</h2><div class="win-av"><div class="wa-h pose-cheer">${heroSVG(S.equipped)}</div><div class="wa-m">${monsterSVG(lv.mon, lv.hue || 0)}</div></div>${extra}
    <div class="wline"><span class="gain">+${reward} 🪙</span>${card}</div>
    ${miss ? `<p class="wtip"><span aria-hidden="true">${miss[1]}</span> ${esc(t('v.tip.' + miss[2].split('.')[1]))}</p>` : `<p class="wtip all">🌟 ${esc(t('v.tip.all'))}</p>`}${ko ? `<p class="sub kon">🦉 ${esc(t('ko.note'))}</p>` : ''}
    <div class="wbtns">${nextLv ? `<button class="btn big" data-act="nextLevel" data-v="${nextLv.id}">${t('v.next')} ▶</button>` : ''}<div class="wsmall"><button class="btn ghost" data-act="retry" data-v="${lv.id}">🔁 ${t('v.retry')}</button><button class="btn ghost" data-act="toMap">🗺️ ${t('v.map')}</button></div></div>`;
  const showWin = () => { $('#winOverlay').classList.add('on'); for (let k = 1; k <= stars; k++) setTimeout(() => sfx.star(k), 380 + k * 230); setTimeout(syncMusic, 2600); if (S.voice.auto) speak(t('v.spoken', { n: stars })); if (evo) setTimeout(() => showEvolve(petOn(), evo), 700); };
  /* v16: the first time a zone boss falls, its victory story plays before the rewards */
  if (lv.big && firstClear && !lv.steam && SUBJ_ORDER.includes(lv.subj) && !(S.comics || {})[victKey(lv.subj, lv.z)]) { openComic(lv.z, showWin, lv.subj, 'victory'); return; }
  showWin();   // v8: Hoot's Think-Back modal removed
}
/* the word card always shows the word. Nothing hides it, and the 🔊 button reads it aloud */
function renderWord() {
  const q = B.q, wc = $('#wcard'); if (!q) return;
  wc.hidden = !q.word; if (!q.word) return;
  const w = q.word, txt = q.kind === 'missing' && !B.locked ? [...w].map((c, i) => i === q.gi ? '_' : c).join(' ') : w;
  wc.innerHTML = `<div class="wmain"><span class="wlabel">${t('wc.word')}</span><span class="wtxt" aria-live="polite">${esc(txt)}</span></div><div class="wbtns"><button class="speak" data-act="sayWord" aria-label="${esc(t('wc.say'))}">🔊</button></div>`;
}
function showWord() { renderWord(); }

/* ================= v7 strings ================= */
Object.assign(STR, {
  'pp.themeNote': ['Auto uses the Royal Night look with pixel art, and the warm look with the classic drawings. Changing the age never changes the look or size.', 'Auto menggunakan rupa Malam Diraja dengan seni piksel, dan rupa hangat dengan lukisan klasik. Menukar umur tidak mengubah rupa atau saiz.'],
  /* ---- pets ---- */
  'pet.xp': ['Pet XP', 'XP haiwan'],
  'pet.stage': ['Stage {n}/3', 'Peringkat {n}/3'],
  'pet.s2': ['Young {n}', '{n} remaja'],
  'pet.s3': ['Mystic {n}', '{n} mistik'],
  'pet.next': ['{n} XP to evolve', '{n} XP lagi untuk berevolusi'],
  'pet.max': ['Fully evolved!', 'Evolusi penuh!'],
  'pet.perk.atk': ['Perk: +{n} damage', 'Kelebihan: +{n} kerosakan'],
  'pet.perk.guard': ['Perk: {n}% less damage taken', 'Kelebihan: {n}% kurang kerosakan diterima'],
  'pet.perk.heal': ['Perk: heals {n} after each answer', 'Kelebihan: pulih {n} selepas setiap jawapan'],
  'pet.perk.coin': ['Perk: +{n} coin per answer', 'Kelebihan: +{n} syiling setiap jawapan'],
  'pet.perk.time': ['Perk: {n}% more thinking time', 'Kelebihan: {n}% lebih masa berfikir'],
  'pet.gain': ['{p} gained {n} Pet XP!', '{p} dapat {n} XP!'],
  'pet.evolved': ['{p} evolved!', '{p} telah berevolusi!'],
  'pet.evolvedSay': ['Wow! Your pet evolved into {n}. Its perk got stronger!', 'Wah! Haiwan anda berevolusi menjadi {n}. Kelebihannya lebih kuat!'],
  'pet.yay': ['Hooray!', 'Hore!'],
  'pet.lessonDone': ['I finished this lesson ✔', 'Saya sudah habis pelajaran ini ✔'],
  'pet.lessonHint': ['Your pet gets +{n} XP the first time. No coins.', 'Haiwan anda dapat +{n} XP kali pertama. Tiada syiling.'],
  'pet.lessonAgain': ['You already finished this one. Nice!', 'Anda sudah habiskan ini. Bagus!'],
  'pet.lessonNoPet': ['Equip a pet in the Hero tab to give it XP next time.', 'Pakai haiwan di tab Wira untuk beri XP lain kali.'],
  /* ---- armory sub-tabs + haven ---- */
  'ar.gear': ['Gear', 'Kelengkapan'], 'ar.haven': ['Pet Haven', 'Taman Haiwan'],
  'hv.title': ['Pet Haven', 'Taman Haiwan'],
  'hv.sub': ['A cosy room where your pets roam. Buy furniture with coins, then drag it where you like.', 'Bilik selesa tempat haiwan anda berjalan. Beli perabot dengan syiling, kemudian seret ke mana-mana.'],
  'hv.empty': ['Buy a pet in the Hero tab and it will move in here!', 'Beli haiwan di tab Wira dan ia akan tinggal di sini!'],
  'hv.place': ['Place', 'Letak'], 'hv.placed': ['In room', 'Dalam bilik'],
  'hv.away': ['Put away', 'Simpan'], 'hv.bigger': ['Bigger', 'Lebih besar'], 'hv.smaller': ['Smaller', 'Lebih kecil'],
  'hv.done': ['Done', 'Siap'],
  'hv.drag': ['Drag items to move them. Tap one to resize or put it away.', 'Seret untuk alih. Sentuh satu untuk ubah saiz atau simpan.'],
  'hv.full': ['The room is full. Put something away first.', 'Bilik penuh. Simpan sesuatu dahulu.'],
  'hv.bought': ['Bought {n}!', 'Dibeli {n}!'],
  'hv.use': ['Use theme', 'Guna tema'], 'hv.using': ['In use', 'Sedang digunakan'],
  'hv.hi': ['{p} loves it here!', '{p} suka di sini!'],
  'hv.equip': ['Take along', 'Bawa bersama'], 'hv.equipped': ['With you', 'Bersama anda'],
  'hv.buyPet': ['Not yours yet. Buy it here!', 'Belum milik anda. Beli di sini!'], 'hv.petBought': ['{p} is yours now!', '{p} kini milik anda!'],
  'hv.toArmory': ['Go to Gear', 'Ke kelengkapan'],
  /* ---- boss phases ---- */
  'boss.phase': ['Phase {n}', 'Fasa {n}'],
  'boss.p1': ['Fog', 'Kabus'], 'boss.p2': ['Rune Shield', 'Perisai rune'], 'boss.p3': ['Enrage', 'Kemarahan'],
  'boss.p1.msg': ['Fog hides the answers. Tap a cloud to sweep it away!', 'Kabus menutup jawapan. Sentuh awan untuk menyapunya!'],
  'boss.p2.msg': ['A rune shield! Get 2 first-try answers in a row to shatter it.', 'Perisai rune! Jawab betul 2 kali berturut-turut pada percubaan pertama untuk memecahkannya.'],
  'boss.p3.msg': ['The boss is getting angry. Answer before the angry 💢 bar runs out! You can never be knocked out.', 'Bos semakin marah. Jawab sebelum bar marah 💢 habis! Anda tidak akan tewas.'],
  'boss.rune': ['Rune shield: {n} more first-try answer(s) to break it', 'Perisai rune: {n} jawapan percubaan pertama lagi untuk memecahkannya'],
  'boss.holds': ['The shield holds! One more first-try answer in a row.', 'Perisai bertahan! Satu lagi jawapan percubaan pertama berturut-turut.'],
  'boss.reset': ['The runes flickered. Try again, no worries!', 'Rune berkelip. Cuba lagi, tak mengapa!'],
  'boss.shatter': ['Shield shattered!', 'Perisai pecah!'], 'boss.blocked': ['Blocked!', 'Disekat!'],
  'boss.fogTap': ['Fog. Tap to clear.', 'Kabus. Sentuh untuk bersihkan.'],
  'boss.enrageHit': ['ENRAGED CRIT!', 'KRITIKAL MARAH!'],
  'boss.enraged': ['The boss is fuming! Its next hit is a double crit. You are still safe.', 'Bos sangat marah! Serangan seterusnya kritikal dua kali ganda. Anda masih selamat.'],
  'boss.enrageOff': ['Enrage timer is off for your pacing setting.', 'Pemasa kemarahan dimatikan mengikut tetapan rentak anda.'],
  /* ---- comic ---- */
  'cm.enter': ['Enter {z}!', 'Masuk {z}!'], 'cm.skip': ['Skip story', 'Langkau cerita'],
  'cm.pause': ['Pause auto-play', 'Jeda main automatik'], 'cm.play': ['Resume auto-play', 'Sambung main automatik'],
  'fs.enter': ['Full screen', 'Skrin penuh'], 'fs.exit': ['Exit full screen', 'Keluar skrin penuh'],
  'cm.replay': ['📖 Story', '📖 Cerita'],
  'cm.listen': ['Hear this panel', 'Dengar panel ini'],
  'cm.s.math': ['Numbers and bar models will help.', 'Nombor dan model bar akan membantu.'],
  'cm.s.lit': ['Letters, sounds and words will help.', 'Huruf, bunyi dan perkataan akan membantu.'],
  'cm.s.stem': ['Science and clear thinking will help.', 'Sains dan pemikiran jelas akan membantu.'],
  'cm.s.life': ['Kindness and calm choices will help.', 'Kebaikan dan pilihan tenang akan membantu.'],
  });
