/* ================= v27: livelier boss fights =================
   1. TELEGRAPHED ATTACKS. On boss levels the boss sometimes starts charging: "❗ Charging!" and a bar that
      shrinks. A right answer before the bar runs out dodges the attack (and the counter-hit is stronger);
      if the bar runs out, the boss lands a heavy hit. Off in calm sensory mode and with "no time limit".
   2. RAGE MOVES. In phase 3 every zone boss archetype has its own move (fire breath, life drain, quake ...).
   3. MINION WAVES. Some bosses call 1 or 2 small minions when a new phase starts. While they stand guard,
      each right answer knocks one minion out instead of hitting the boss.
   4. BOSS CAMERA + SLOW-MOTION FINAL HIT. On boss levels the camera leans in on whoever attacks, and the last
      hit plays in slow motion with a freeze frame. Parents can turn this off (Parent Portal).
   5. MONSTER TALK. Monsters tease on a wrong answer and say something funny when they lose.
   6. TEAM PLAY. Two or three children take turns: each new question goes to the next player.
   7. AUTO-RESUME. The battle is saved as it goes; after the page closes the game offers "Continue this battle".
   Hooks used by 11-battle.js: preCorrect(), minionHit(), dmgBoost(). */
const camOn = () => S.cine !== false && !S.sensory && !reducedMotion();
const talkOn = () => S.talk !== false;
/* a damage bonus for the next hero hit (dodge, "why?" step, Archon barrier), used once */
function dmgBoost() { return HOOK.call('dmgBoost', dmgBoostBase, arguments); }   // v35: the quality of the answer scales it (44)
function dmgBoostBase() { const b = B.boost || 1; B.boost = 1; return b; }
const boostBy = k => { B.boost = (B.boost || 1) * k; };

/* ---------------- 1. telegraphed attacks ---------------- */
const TELE_MIN = 5000;
const teleOn = () => !!(B.active && B.lv && B.lv.boss && S.tele !== false && !S.sensory && PACE_MS[effPace()]);
function teleRender() {
  const el = $('#tele'); if (!el) return;
  if (!B.tele) { el.hidden = true; el.classList.remove('hot'); return; }
  el.hidden = false; const p = Math.max(0, B.tele.left / B.tele.max);
  const b = el.querySelector('b'), u = el.querySelector('u'); if (b) b.textContent = '❗ ' + t('tl.charge'); if (u) u.style.width = (p * 100) + '%';
  el.classList.toggle('hot', p < .34);
}
function teleStart() {
  const max = Math.max(TELE_MIN, Math.round((PACE_MS[effPace()] || 20000) * .55));
  B.tele = { left: max, max }; teleRender();
  const m = ms(); if (m && !S.sensory) m.classList.add('charging2');
  sfx.growl(); announce(t('tl.sr'), true);
}
function teleClear() { B.tele = null; teleRender(); const m = ms(); if (m) m.classList.remove('charging2'); }
function teleMaybe() {
  if (!teleOn() || B.tele || !B.q || B.q.kind === 'trace') return;
  if (bossOn() && B.phase === 3) return;   // phase 3 is rage time (its own moves)
  B.teleWait = (B.teleWait === undefined ? 1 : B.teleWait) - 1;
  if (B.teleWait > 0 || Math.random() > .55) return;
  B.teleWait = 2 + Math.floor(Math.random() * 2); teleStart();
}
function teleTick() {
  if (!B.tele || !B.q || B.locked || UI.tab !== 'adventure' || UI.adv !== 'battle' || document.hidden || timeUp || bedUp || $('.overlay.on') || (B.introUntil || 0) > Date.now()) return;
  B.tele.left -= 250; teleRender();
  if (B.tele.left <= 0) {   // too slow: the charged attack lands
    teleClear(); B.nextHit = (B.nextHit || 1) * 1.6; B.teleHits = (B.teleHits || 0) + 1;
    setMsg(t('tl.hit')); const pm = fx.pos(ms()); fx.num(pm.x, pm.y - pm.h * .6, '💥 ' + t('tl.big'), 'crit'); enemyStrike();
  }
}
function teleDodge() {
  teleClear(); B.dodges = (B.dodges || 0) + 1; boostBy(1.25);
  const h = hs(), ph = fx.pos(h); sfx.block();
  fx.num(ph.x, ph.y - ph.h * .7, '💨 ' + t('tl.dodge'), 'safe'); fx.ring(ph.x, ph.y, '#9fe8ff', 120);
  if (!S.sensory && h) h.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-26px,-30px) rotate(-8deg)', offset: .4 }, { transform: 'translate(0,0)' }], { duration: 520, easing: 'ease-out' });
  announce(t('tl.dodgeSr'));
}

/* ---------------- 2. rage moves (phase 3), one per zone boss archetype ---------------- */
const RAGE = [
  { em: '🔥', k: 'rg.fire', mul: 1.5 },                 // 0 Ancient Dragon
  { em: '💀', k: 'rg.drain', mul: 1, heal: .06 },        // 1 Lich King
  { em: '🪨', k: 'rg.quake', mul: 1.1, quake: true },    // 2 Stone Titan
  { em: '⚔️', k: 'rg.double', mul: 1.3, twin: true },    // 3 Fiend Lord
  { em: '🛡️', k: 'rg.barrier', mul: 1, barrier: true },  // 4 Archon
  { em: '⚡', k: 'rg.storm', mul: 1.1, zap: true },       // 5 Elemental Lord
  { em: '✨', k: 'rg.charm', mul: .8, fog: 2 },           // 6 Fey Queen
  { em: '🦁', k: 'rg.bite', mul: 1.4, twin: true },       // 7 Chimera
  { em: '⚙️', k: 'rg.clock', mul: 1.1, fast: true },      // 8 Clockwork Colossus
  { em: '🐍', k: 'rg.regrow', mul: 1, heal: .08 }         // 9 Hydra
];
const rageOf = lv => lv && lv.big && lv.mon && Number.isInteger(lv.mon.arch) ? RAGE[lv.mon.arch % RAGE.length] : null;
function rageShout(r) {
  const el = $('#phaseBanner'), txt = r.em + ' ' + t(r.k) + '!';
  if (el) { el.textContent = txt; el.hidden = false; el.classList.add('rage'); replayClass(el, 'show'); clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; el.classList.remove('rage'); }, 1700); }
  announce(txt, true);
}
/* the answer buttons swap places (the Titan's quake) */
function quakeShuffle() {
  const q = B.q; if (!q || !q.options || q.options.length < 2 || ['order', 'match', 'trace', 'phonics', 'wx'].includes(q.kind)) return;
  const perm = shuffle(q.options.map((_, i) => i)), inv = {};
  perm.forEach((old, nw) => { inv[old] = nw; });
  q.options = perm.map(i => q.options[i]); q.correct = inv[q.correct];
  B.picked = new Set([...B.picked].map(i => inv[i])); if (B.fog) B.fog = new Set([...B.fog].map(i => inv[i]));
  renderAnswers();
}
function bossHeal(f) {   // never heals back past phase 3, so the fight always moves forward
  const cap = Math.floor(B.mMax / 3) - 1, to = Math.min(cap, B.mHp + Math.round(B.mMax * f));
  if (to <= B.mHp) return;
  const d = to - B.mHp; B.mHp = to; updateHud(); const pm = fx.pos(ms()); fx.num(pm.x, pm.y - pm.h * .5, '+' + d, 'safe');
}
function rageAfter(r) {
  if (r.heal) bossHeal(r.heal);
  if (r.quake) { quakeShuffle(); fx.shake($('#stage'), 10, 500); setMsg(t('rg.quakeMsg')); }
  if (r.barrier) { B.barrier = true; setMsg(t('rg.barrierMsg')); }
  if (r.zap && B.tmax) { B.tleft = Math.round(B.tleft * .7); updateThink(); setMsg(t('rg.stormMsg')); }
  if (r.fog && B.q && B.q.options && !['order', 'match', 'trace', 'wx'].includes(B.q.kind) && S.expr !== 'voice') {
    const free = shuffle(B.q.options.map((_, i) => i).filter(i => !B.picked.has(i))).slice(0, r.fog);
    B.fog = new Set([...(B.fog || []), ...free]); renderAnswers(); setMsg(t('rg.charmMsg'));
  }
  if (r.fast) { B.eFast = true; setMsg(t('rg.clockMsg')); }
  if (r.twin && !S.sensory) { const ph = fx.pos(hs()); setTimeout(() => { fx.burst(ph.x, ph.y, 6, ['💥', '💫']); fx.num(ph.x + 20, ph.y - ph.h * .3, '×2', 'warn'); }, 120); }
}

/* ---------------- 3. minion waves ---------------- */
const SUMMONERS = [1, 3, 6, 8, 9];   // Lich King, Fiend Lord, Fey Queen, Colossus, Hydra
function renderMinions() {
  const el = $('#minions'); if (!el) return;
  el.innerHTML = (B.minions || []).map((x, i) => `<div class="minion" data-i="${i}" style="--i:${i}">${monsterSVG(x.m)}</div>`).join('');
}
function minionWave(phase) {
  const lv = B.lv; if (!lv || !lv.big || !lv.mon || !SUMMONERS.includes(lv.mon.arch)) return;
  B.waves = B.waves || {}; if (B.waves[phase]) return; B.waves[phase] = 1;
  const s = SUBJ_ORDER.includes(lv.subj) ? lv.subj : 'math', z = Math.max(0, Math.min(9, lv.z || 0)), n = phase >= 3 ? 2 : 1;
  B.minions = (B.minions || []).concat(Array.from({ length: n }, (_, k) => { const mn = z * 10 + [1, 2, 3, 4, 6, 7, 8, 9][(phase * 3 + k) % 8]; return { n: mn, m: monsterFor(s, mn) }; }));
  renderMinions();
  if (!S.sensory) $$('#minions .minion').forEach((el, i) => el.animate([{ transform: 'translateY(-60px) scale(.3)', opacity: 0 }, { transform: 'translateY(4px) scale(1.1)', opacity: 1, offset: .7 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: i * 140, easing: 'ease-out', fill: 'backwards' }));
  sfx.growl(); announce(t('mn.summon', { n: B.minions.length }), true);
  const prev = B.msg ? B.msg.plain + ' ' : ''; setMsg(prev + t('mn.summon', { n: B.minions.length }));
}
/* a right answer while minions stand guard: one minion is knocked out (no boss damage, no boss counter) */
async function minionHit(tk) {
  if (!B.minions || !B.minions.length) return false;
  const els = $$('#minions .minion'), el = els[els.length - 1]; B.minions.pop();
  const h = hs(), ph = fx.pos(h), pm = el ? fx.pos(el) : fx.pos(ms());
  sfx.whoosh(); pose(h, 'attack', 600);
  if (!S.sensory && h) h.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${Math.max(40, pm.x - ph.x - 40)}px,-18px)`, offset: .5 }, { transform: 'translate(0,0)' }], { duration: 640, easing: 'cubic-bezier(.35,.05,.25,1)' });
  await wait(S.sensory ? 150 : 320); if (B.token !== tk) return true;
  fx.slash(pm.x, pm.y, '#fff'); fx.burst(pm.x, pm.y, 10, ['✨', '💫', '⭐']); sfx.hit(); fx.num(pm.x, pm.y - pm.h * .5, t('mn.ko'), 'combo');
  if (el && !S.sensory) { const an = el.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(20px,-40px) scale(.2) rotate(360deg)', opacity: 0 }], { duration: 480, easing: 'ease-in', fill: 'forwards' }); an.onfinish = renderMinions; } else renderMinions();
  addCoins(1); B.minionKOs = (B.minionKOs || 0) + 1;
  setMsg(B.minions.length ? t('mn.left', { n: B.minions.length }) : t('mn.clear'));
  announce(t('mn.koSr', { n: B.minions.length }));
  await wait(S.sensory ? 250 : 640); if (B.token === tk) nextQuestion();
  return true;
}

/* ---------------- 4. boss camera and the slow-motion final hit ----------------
   The camera leans in with the CSS "translate" and "scale" properties, which add to the sprites' own
   attack animations (those use "transform"), so nothing fights. The battle backdrop zooms with them. */
function camFocus(target, s) {
  const st = $('#stage'); if (!st) return;
  const bgs = ['.cambg', '#scenery', '.arena-sky', '.arena-floor'].map(q => st.querySelector(q)).filter(Boolean), els = bgs.concat([hs(), ms(), $('#minions')].filter(Boolean));
  if (!target || !camOn() || !(B.lv && B.lv.boss)) { els.forEach(el => { el.style.translate = ''; el.style.scale = ''; }); st.classList.remove('camin'); return; }
  const sc = s || 1.12, tEl = target === 'hero' ? hs() : ms(); if (!tEl) return;
  const W = st.clientWidth || 0, H = st.clientHeight || 0, cen = el => ({ x: (el.offsetLeft || 0) + (el.offsetWidth || 0) / 2, y: (el.offsetTop || 0) + (el.offsetHeight || 0) / 2 });
  const F = cen(tEl); if (!W || !(F.x >= 0)) return;
  els.forEach(el => {
    const C = bgs.includes(el) ? { x: W / 2, y: H / 2 } : cen(el);
    el.style.translate = `${Math.round((C.x - F.x) * (sc - 1))}px ${Math.round((C.y - F.y) * (sc - 1))}px`; el.style.scale = String(sc);
  });
  st.classList.add('camin');
}
/* the lead-in: the scene darkens, letterbox bars slide in, the hero gathers power slowly */
async function finalLead(tk) {
  const st = $('#stage'), h = hs(), ph = fx.pos(h); if (!st) return;
  st.classList.add('slowmo'); camFocus('hero', 1.16); h.classList.add('charging'); sfx.superUp();
  fx.num(ph.x, ph.y - ph.h * .8, '⚡ ' + t('cm27.final'), 'combo'); announce(t('cm27.final'));
  await wait(820); h.classList.remove('charging'); if (B.token !== tk) { st.classList.remove('slowmo'); return; }
  camFocus('mon', 1.3);
}
/* after the last blow: a freeze frame, a flash, then everything plays on in slow motion for a moment */
async function finalFreeze(tk) {
  const st = $('#stage'); if (!st) return;
  let an = []; try { an = st.getAnimations ? st.getAnimations({ subtree: true }) : []; } catch (e) { an = []; }
  an.forEach(a => { try { a.pause(); } catch (e) { /* finished */ } });
  fx.flash('rgba(255,255,255,.85)'); sfx.crit();
  await wait(260);
  an.forEach(a => { try { a.playbackRate = .3; a.play(); } catch (e) { /* finished */ } });
  const pm = fx.pos(ms()); fx.num(pm.x, pm.y - pm.h * .7, t('cm27.ko'), 'crit');
  await wait(700);
  an.forEach(a => { try { a.playbackRate = 1; } catch (e) { /* gone */ } });
  void tk;
}
function camReset() { camFocus(null); const st = $('#stage'); if (st) st.classList.remove('slowmo'); }
HOOK.around('attackSeq', async (next, dmg, crit, blocked, shattered) => {
  const tk = B.token, final = !blocked && !!(B.lv && B.lv.boss) && B.mHp - dmg <= 0 && camOn();
  if (final) { await finalLead(tk); if (B.token !== tk) return false; } else camFocus('mon');
  const ok = await next(dmg, crit, blocked, shattered);
  if (final && ok) await finalFreeze(tk); else camFocus(null);
  return ok && B.token === tk;
});
HOOK.around('finisherSeq', async (next, dmg) => {
  const tk = B.token, final = !!(B.lv && B.lv.boss) && B.mHp - dmg <= 0 && camOn();
  camFocus('mon', final ? 1.3 : 1.12); if (final) $('#stage').classList.add('slowmo');
  const ok = await next(dmg);
  if (final && ok) await finalFreeze(tk); else camReset();
  return ok && B.token === tk;
});
HOOK.around('counterSeq', async next => {
  const rage = bossOn() && B.phase === 3 ? rageOf(B.lv) : null;
  B.hitMul = (B.nextHit || 1) * (rage ? rage.mul : 1); B.nextHit = 1;
  if (rage) rageShout(rage);
  camFocus('hero');
  const ok = await next();
  B.hitMul = 1; camFocus(null);
  if (ok && rage && B.active) rageAfter(rage);
  return ok;
});

/* ---------------- 5. monster talk ---------------- */
const TALK = {
  taunt: [['Hehe, missed me!', 'Hehe, tak kena!'], ['Is that all you’ve got?', 'Itu sahaja kebolehan kamu?'], ['Nyeh nyeh! Try again!', 'Nyeh nyeh! Cuba lagi!'],
    ['Too tricky for you?', 'Susah sangat ke?'], ['Ooh, so close!', 'Ooh, hampir betul!'], ['My pet snail knows that one!', 'Siput peliharaan saya pun tahu!'],
    ['Ha! I win this round!', 'Ha! Saya menang pusingan ini!'], ['Think harder, hero!', 'Fikir lagi, wira!'], ['Wobble wobble, wrong!', 'Goyang-goyang, salah!'],
    ['I’m not scared of you!', 'Saya tak takut dengan kamu!'], ['Oopsie daisy!', 'Alamak, silap!'], ['You can’t catch me!', 'Kamu tak dapat tangkap saya!']],
  beaten: [['I’ll be back... after my nap!', 'Saya akan kembali... selepas tidur!'], ['Ouch! My poor tummy!', 'Aduh! Perut saya!'], ['Okay, okay, you’re super smart!', 'Baiklah, kamu memang bijak!'],
    ['Tell my mum I was brave!', 'Beritahu emak saya, saya berani!'], ['I need a snack... and a hug.', 'Saya perlukan snek... dan pelukan.'], ['No fair! You studied!', 'Tak adil! Kamu belajar!'],
    ['Wheee, I’m flying away!', 'Wheee, saya terbang pergi!'], ['That was fun. Again tomorrow?', 'Seronoknya. Esok lagi?'], ['My socks are dizzy!', 'Stoking saya pening!'],
    ['I give up! You win the cookie!', 'Saya mengalah! Kamu menang biskut!'], ['Brains beat my muscles!', 'Otak kamu kalahkan otot saya!'], ['Bye-bye! Study hard!', 'Selamat tinggal! Belajar rajin-rajin!']],
  boss: [[['I breathe fire, not facts!', 'Saya hembus api, bukan fakta!'], ['My flames... went out!', 'Api saya... padam!']], [['Your answer is bone-headed!', 'Jawapan kamu kosong macam tengkorak!'], ['I am going back to my bone bed.', 'Saya mahu balik ke katil tulang.']],
    [['I am a rock. You are a pebble!', 'Saya batu besar. Kamu batu kecil!'], ['I am crumbling... into gravel!', 'Saya hancur... jadi batu kerikil!']], [['My horns are sharper than your brain!', 'Tanduk saya lebih tajam daripada otak kamu!'], ['My horns are tangled! I lose!', 'Tanduk saya tersangkut! Saya kalah!']],
    [['The light says: wrong!', 'Cahaya berkata: salah!'], ['Too bright... you are too bright!', 'Terlalu terang... kamu terlalu bijak!']], [['Thunder says NO!', 'Guruh berkata TIDAK!'], ['My storm just fizzled.', 'Ribut saya sudah reda.']],
    [['A little fairy told me you were wrong!', 'Pari-pari kecil kata kamu salah!'], ['Even my wings are clapping for you.', 'Sayap saya pun bertepuk untuk kamu.']], [['Lion says roar, goat says no!', 'Singa kata ngaum, kambing kata tidak!'], ['All three of my heads agree: you win.', 'Ketiga-tiga kepala saya setuju: kamu menang.']],
    [['Tick-tock, wrong o’clock!', 'Tik-tok, jam salah!'], ['My gears need oiling...', 'Gear saya perlu minyak...']], [['Five heads are better than yours!', 'Lima kepala lebih baik daripada kepala kamu!'], ['All my heads need a rest.', 'Semua kepala saya mahu berehat.']]]
};
const talkDeck = {};
function talkLine() { return HOOK.call('talkLine', talkLineBase, arguments); }   // v32: boss voices (30)
function talkLineBase(kind) {
  const lv = B.lv, li = L(), boss = lv && lv.big && lv.mon && Number.isInteger(lv.mon.arch) ? TALK.boss[lv.mon.arch % 10] : null;
  if (boss && Math.random() < .5) return boss[kind === 'beaten' ? 1 : 0][li];
  const d = talkDeck[kind] && talkDeck[kind].length ? talkDeck[kind] : (talkDeck[kind] = shuffle(TALK[kind].map((_, i) => i)));
  return TALK[kind][d.pop()][li];
}
function mTalk(text, ms2 = 2200) {
  const el = $('#mTalk'), m = ms(); if (!el || !m || !talkOn()) return;
  const pm = fx.pos(m); el.textContent = text; el.style.left = Math.round(pm.x) + 'px'; el.style.top = Math.round(Math.max(28, pm.y - pm.h * .55)) + 'px';
  el.hidden = false; replayClass(el, 'pop');
  clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; }, ms2);
}
const mTalkHide = () => { const el = $('#mTalk'); if (el) el.hidden = true; };
HOOK.on('wrongPick', () => { if (B.active) { mTalk(talkLine('taunt')); resumeSnap(); save(); } });

/* ---------------- 6. team play (2 or 3 children take turns) ---------------- */
const coopCfg = () => DEV.coop || (DEV.coop = { n: 1, names: ['', '', ''] });
const coopN = () => Math.max(1, Math.min(3, +coopCfg().n || 1));
const coopOn = () => coopN() > 1;
const COOP_EM = ['🧒', '👧', '👦'];
function coopName(i) { const nm = (coopCfg().names || [])[i]; if (nm && nm.trim()) return nm.trim(); const p = DEV.profiles[i]; return p && p.name ? p.name : t('co.player', { n: i + 1 }); }
function renderTurn() {
  const el = $('#turnChip'); if (!el) return;
  if (!coopOn() || !B.active) { el.hidden = true; return; }
  const i = B.turn || 0; el.hidden = false; el.dataset.p = i; el.textContent = `${COOP_EM[i]} ${t('co.turn', { n: coopName(i) })}`;
  replayClass(el, 'pop');
}
function coopSummaryHTML() { return HOOK.call('coopSummaryHTML', coopSummaryHTMLBase, arguments); }   // v32: team combos (30)
function coopSummaryHTMLBase() {
  if (!coopOn() || !B.coopPts) return '';
  const rows = Array.from({ length: coopN() }, (_, i) => `<span class="co-p" data-p="${i}">${COOP_EM[i]} <b>${esc(coopName(i))}</b> ${'⭐'.repeat(Math.min(6, B.coopPts[i] || 0)) || '·'} <small>${B.coopPts[i] || 0}</small></span>`).join('');
  return `<div class="co-sum"><b>👫 ${t('co.team')}</b><div>${rows}</div></div>`;
}

/* ---------------- 7. auto-resume ---------------- */
function resumeSnap() {
  if (!B.active || !B.lv || !B.q || !B.lv.id || !(B.mHp > 0)) return;
  S.resume = { id: B.lv.id, band: S.band, at: Date.now(), name: B.lv.mon ? B.lv.mon.n : '', mHp: B.mHp, mMax: B.mMax, hHp: B.hHp, hMax: B.hMax, combo: B.combo || 0, charge: B.charge || 0,
    asked: B.asked || 0, first: B.first || 0, ko: B.ko || 0, timeouts: B.timeouts || 0, hints: B.hints || 0, fins: B.fins || 0, tUsed: B.tUsed || 0, tAllow: B.tAllow || 0,
    phase: B.phase || 0, rune: B.rune, runeBroken: !!B.runeBroken, waves: B.waves || {}, minions: (B.minions || []).map(x => x.n), turn: B.turn || 0, coopPts: B.coopPts || [0, 0, 0],
    run: UI.run ? JSON.parse(JSON.stringify(UI.run)) : null };
}
const resumeClear = () => { if (S.resume) { S.resume = null; save(); } };
addEventListener('pagehide', () => { if (B.active) { resumeSnap(); saveNow(); } });
document.addEventListener('visibilitychange', () => { if (document.hidden && B.active) { resumeSnap(); saveNow(); } });
/* restores a saved battle into the one startBattle() just set up */
function resumeApply(r) {
  const keep = ['combo', 'charge', 'asked', 'first', 'ko', 'timeouts', 'hints', 'fins', 'tUsed', 'tAllow', 'rune', 'runeBroken', 'turn'];
  keep.forEach(k => { if (r[k] !== undefined) B[k] = r[k]; });
  B.mHp = Math.max(1, Math.min(B.mMax, r.mHp)); B.hHp = Math.max(1, Math.min(B.hMax, r.hHp)); B.waves = r.waves || {}; B.coopPts = (r.coopPts || [0, 0, 0]).slice();
  const s = SUBJ_ORDER.includes(B.lv.subj) ? B.lv.subj : 'math'; B.minions = (r.minions || []).filter(n => n > 0).map(n => ({ n, m: monsterFor(s, n) })); renderMinions();
  B.phase = r.phase && bossOn() && r.phase === bossPhaseOf() ? r.phase : 0; bossSetup(); updateHud(); renderTurn(); resumeSnap();
}
function resumeOverlay() {
  let ov = $('#resumeOverlay');
  if (!ov) { ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'resumeOverlay'; ov.innerHTML = '<div class="mwrap"><button class="mclose" data-act="resumeNo" aria-label="Close">✕</button><div class="sheet resume" id="resumeSheet" role="dialog" aria-modal="true"></div></div>'; document.body.appendChild(ov); }
  return ov;
}
function offerResume(tries = 0) {
  const r = S.resume; if (!r || !r.id) return;
  if (Date.now() - (r.at || 0) > 3 * 864e5) { resumeClear(); return; }   // older than three days: start fresh
  if (B.active || $('#welcomeOverlay.on') || $('#whoOverlay.on') || $('#comicOverlay.on')) { if (tries < 30) setTimeout(() => offerResume(tries + 1), 1000); return; }
  let lv = null; try { lv = getLevel(r.id); } catch (e) { lv = null; }
  if (!lv || !lv.mon) { resumeClear(); return; }
  const ov = resumeOverlay(), hp = Math.round(r.hHp / Math.max(1, r.hMax) * 100), mp = Math.round(r.mHp / Math.max(1, r.mMax) * 100);
  $('#resumeSheet').setAttribute('aria-label', t('rs.title'));
  $('#resumeSheet').innerHTML = `<h2>⚔️ ${t('rs.title')}</h2><p class="sub">${esc(t('rs.sub', { m: lv.mon.n }))}</p>
    <div class="rs-vs"><div class="rs-h">${heroSVG(S.equipped)}<span class="rs-bar"><i style="width:${hp}%"></i></span></div><b>VS</b><div class="rs-m">${monsterSVG(lv.mon, lv.hue || 0)}<span class="rs-bar mon"><i style="width:${mp}%"></i></span></div></div>
    <p class="rs-where">${esc(lvT(lv).name)}</p>
    <div class="brief-actions"><button class="btn big" data-act="resumeGo">▶ ${t('rs.go')}</button><button class="btn ghost" data-act="resumeNo">${t('rs.no')}</button></div>`;
  ov.classList.add('on');
}
function resumeGo() {
  const r = S.resume; $('#resumeOverlay') && $('#resumeOverlay').classList.remove('on'); if (!r) return;
  if (r.band >= 1 && r.band <= 4 && r.band !== S.band) { S.band = r.band; applyTheme(); }
  UI.run = r.run || null; S.resume = null;
  showTab('adventure', true);
  pxWipe(() => { startBattle(r.id); resumeApply(r); toast(t('rs.back')); });
}
function resumeNo() { $('#resumeOverlay') && $('#resumeOverlay').classList.remove('on'); resumeClear(); }

/* ---------------- shared wrappers ---------------- */
function v27Reset() {
  teleClear(); B.teleWait = 1; B.nextHit = 1; B.hitMul = 1; B.boost = 1; B.barrier = false; B.eFast = false; B.waves = {}; B.minions = []; B.dodges = 0; B.teleHits = 0;
  B.turn = 0; B.coopPts = [0, 0, 0]; B.qn = 1;   // startBattle() has already asked the first question
  renderMinions(); camReset(); mTalkHide(); renderTurn();
}
HOOK.on('startBattle', () => { v27Reset(); if (B.lv && B.lv.big && B.tmax) setMsg((B.msg ? B.msg.plain + ' ' : '') + t('bc.note')); resumeSnap(); });
HOOK.on('nextQuestion', () => {
  B.eFast = false;
  if (coopOn() && B.active) { if ((B.qn = (B.qn || 0) + 1) > 1) B.turn = ((B.turn || 0) + 1) % coopN(); renderTurn(); }
  teleMaybe();
  if (B.active) { resumeSnap(); save(); }
});
HOOK.around('bossSetup', next => { const prev = B.phase, r = next(); if (bossOn() && B.phase !== prev && B.phase >= 2) minionWave(B.phase); return r; });
HOOK.on('thinkTick', () => teleTick());
HOOK.on('enrageTick', () => { if (B.eFast) enrageTickBase(); });   // Overclock: the angry bar runs twice as fast
HOOK.before('leaveBattle', () => { B.why = null; teleClear(); camReset(); mTalkHide(); B.minions = []; renderMinions(); resumeClear(); });
/* everything a battle does at the start of a win, whatever kind of level it is */
function victoryPrelude() {
  teleClear(); resumeClear(); B.minions = []; renderMinions();
  if (B.lv && B.lv.mon) mTalk(talkLine('beaten'), 1700);
}
/* called at the start of onCorrect (11): dodge a charged attack, the Archon's barrier, team points, the "why?" step */
async function preCorrect(q, tk) {
  if (B.tele) teleDodge();
  if (B.barrier) { B.barrier = false; boostBy(.5); const pm = fx.pos(ms()); fx.num(pm.x, pm.y - pm.h * .4, '🛡️ ' + t('rg.barrierHit'), 'safe'); }
  if (coopOn() && B.coopPts && B.wrong === 0) B.coopPts[B.turn || 0] = (B.coopPts[B.turn || 0] || 0) + 1;
  await whyStep(q, tk);
}
setTimeout(() => { try { renderTurn(); } catch (e) { /* battle not built yet */ } }, 0);

Object.assign(STR, {
  'tl.charge': ['Charging!', 'Sedang mengumpul kuasa!'], 'tl.big': ['Charged attack!', 'Serangan berkuasa!'],
  'tl.sr': ['The boss is charging a big attack! Answer right, fast, to dodge it.', 'Bos sedang mengumpul kuasa! Jawab betul dengan cepat untuk mengelak.'],
  'tl.hit': ['Too slow! The charged attack hit you. Keep going!', 'Terlalu lambat! Serangan berkuasa kena kamu. Teruskan!'],
  'tl.dodge': ['Dodged!', 'Elak!'], 'tl.dodgeSr': ['You dodged the charged attack! Your hit is stronger.', 'Kamu berjaya mengelak! Serangan kamu lebih kuat.'],
  'rg.fire': ['Fire Breath', 'Hembusan Api'], 'rg.drain': ['Life Drain', 'Sedut Tenaga'], 'rg.quake': ['Earthquake', 'Gempa Bumi'], 'rg.double': ['Double Slash', 'Tetak Berganda'],
  'rg.barrier': ['Holy Barrier', 'Perisai Cahaya'], 'rg.storm': ['Lightning Storm', 'Ribut Petir'], 'rg.charm': ['Glitter Charm', 'Sihir Kilauan'], 'rg.bite': ['Triple Bite', 'Gigitan Tiga Kali'],
  'rg.clock': ['Overclock', 'Laju Berganda'], 'rg.regrow': ['Regrow', 'Tumbuh Semula'],
  'rg.quakeMsg': ['Earthquake! The answers swapped places.', 'Gempa bumi! Jawapan bertukar tempat.'], 'rg.barrierMsg': ['A barrier! Your next hit will be weaker.', 'Perisai cahaya! Serangan kamu seterusnya lebih lemah.'],
  'rg.barrierHit': ['Barrier!', 'Perisai!'], 'rg.stormMsg': ['Lightning! The clock jumped ahead.', 'Petir! Masa berkurang.'], 'rg.charmMsg': ['Glitter covers some answers. Tap to clear them!', 'Kilauan menutup beberapa jawapan. Sentuh untuk membersihkannya!'],
  'rg.clockMsg': ['Overclock! The angry bar runs faster.', 'Laju berganda! Bar marah bergerak lebih cepat.'],
  'mn.summon': ['The boss called {n} minion(s)! Each right answer knocks one out.', 'Bos memanggil {n} orang suruhan! Setiap jawapan betul menjatuhkan seorang.'],
  'mn.ko': ['Minion out!', 'Suruhan jatuh!'], 'mn.left': ['{n} minion(s) left. Then the boss!', 'Tinggal {n} orang suruhan. Kemudian bos!'], 'mn.clear': ['All minions gone! Now hit the boss!', 'Semua suruhan tumbang! Sekarang serang bos!'],
  'mn.koSr': ['A minion is knocked out. {n} left.', 'Seorang suruhan jatuh. Tinggal {n}.'],
  'cm27.final': ['Final hit!', 'Serangan terakhir!'], 'cm27.ko': ['K.O.!', 'Tumbang!'],
  'bc.note': ['Zone boss! The clock keeps ticking between questions.', 'Bos zon! Masa terus berjalan antara soalan.'],
  'co.player': ['Player {n}', 'Pemain {n}'], 'co.turn': ['{n}’s turn', 'Giliran {n}'], 'co.team': ['Team score', 'Markah pasukan'],
  'rs.title': ['Continue this battle?', 'Sambung pertarungan ini?'], 'rs.sub': ['You were fighting {m} when the game closed.', 'Kamu sedang melawan {m} semasa permainan ditutup.'],
  'rs.go': ['Continue this battle', 'Sambung pertarungan ini'], 'rs.no': ['No, start fresh', 'Tidak, mula baharu'], 'rs.back': ['Welcome back! The battle goes on.', 'Selamat kembali! Pertarungan diteruskan.']
});
