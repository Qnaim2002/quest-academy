/* ================= v32: boss powers, team boss fights, boss voices and a much cooler finisher =================
   1. SIGNATURE POWER. Every zone boss kind (10) has an opening move when its second phase starts, on top of the rage
      move it already had (20). The move has a name, so the child sees "Ember Roar!" and not just a bigger number.
   2. BATTLE SITUATION. Every boss also fights in one of 10 situations (hot floor, mist, bodyguard, weak spot ...).
      The situation is picked by (kind * 3 + zone) % 10. A boss is one pair (kind, zone), and that pair maps to exactly one
      (kind, situation) pair, so all 100 zone bosses (10 subjects x 10 zones) play differently.
   3. TEAM BOSS. When two or three children play together, the boss bar is shared and a team strip shows who has
      answered right. When EVERY player has answered right (first try) in a row, the team combo fires (double damage).
      One wrong answer puts the lights out again, so the whole team cheers for each other.
   4. BOSS VOICES. The boss speaks when you come back for a rematch, when it gets angry and when it falls (text in
      src/content/cutscenes/shared.js, voice in 29: BOSS_TTS).
   5. FINISHER CUT-IN. A hero cut-in panel, speed lines and letterbox bars play before the finisher, and a shockwave
      and a big BOOM after it. Off in calm sensory mode and with reduced motion (the old finisher still plays).
   Everything is added through HOOK (00c); nothing in the old battle code was replaced. */
const bigBoss = () => !!(B.lv && B.lv.big && B.lv.mon && Number.isInteger(B.lv.mon.arch));
const archOf = lv => (lv && lv.mon && Number.isInteger(lv.mon.arch) ? lv.mon.arch : 0) % 10;
const hasMin = () => !!(B.minions && B.minions.length);

/* ---------------- 1. signature powers ---------------- */
function callMinions(n) {   // a guard (or two) steps in front of the boss; each right answer knocks one out
  const lv = B.lv; if (!lv) return;
  const s = SUBJ_ORDER.includes(lv.subj) ? lv.subj : 'math', z = Math.max(0, Math.min(9, lv.z || 0));
  B.minions = (B.minions || []).concat(Array.from({ length: n }, (_, k) => { const mn = z * 10 + [2, 3, 4, 6, 7, 8][(k + (B.sq || 0)) % 6]; return { n: mn, m: monsterFor(s, mn) }; }));
  renderMinions();
  if (!S.sensory) $$('#minions .minion').forEach((el, i) => el.animate([{ transform: 'translateY(-60px) scale(.3)', opacity: 0 }, { transform: 'translateY(4px) scale(1.1)', opacity: 1, offset: .7 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: i * 120, easing: 'ease-out' }));
  if (typeof sfx.summon === 'function') sfx.summon(); else sfx.growl();
  setMsg((B.msg ? B.msg.plain + ' ' : '') + t('mn.summon', { n: B.minions.length }));
}
function fogSome(n) {
  const q = B.q; if (!q || !q.options || ['order', 'match', 'trace', 'phonics', 'wx'].includes(q.kind) || S.expr === 'voice') return false;
  const free = shuffle(q.options.map((_, i) => i).filter(i => i !== q.correct && !B.picked.has(i))).slice(0, n); if (!free.length) return false;
  B.fog = new Set([...(B.fog || []), ...free]); renderAnswers(); return true;
}
const SIG = [
  { em: '🔥', n: ['Ember Roar', 'Ngauman Bara'], d: ['The next boss hit is stronger. Answer with care!', 'Serangan bos seterusnya lebih kuat. Jawab dengan teliti!'], f: () => { B.nextHit = (B.nextHit || 1) * 1.3; fx.shake($('#stage'), 8, 400); } },
  { em: '👻', n: ['Grave Whisper', 'Bisikan Kubur'], d: ['A ghost hides one wrong answer in mist. Tap it to clear.', 'Hantu menyembunyikan satu jawapan salah dalam kabus. Sentuh untuk membersihkan.'], f: () => { fogSome(1); } },
  { em: '🪨', n: ['Boulder Toss', 'Lontaran Batu'], d: ['A boulder lands! The answers swap places.', 'Batu besar jatuh! Jawapan bertukar tempat.'], f: () => { quakeShuffle(); fx.shake($('#stage'), 10, 500); } },
  { em: '🐂', n: ['Horn Charge', 'Serudukan Tanduk'], d: ['The Fiend charges! Answer fast to dodge it.', 'Syaitan menyerbu! Jawab cepat untuk mengelak.'], f: () => { if (teleOn()) teleStart(); else B.nextHit = (B.nextHit || 1) * 1.3; } },
  { em: '😇', n: ['Halo Flash', 'Kilat Cahaya'], d: ['A bright barrier! Your next hit is weaker.', 'Perisai bercahaya! Serangan seterusnya lebih lemah.'], f: () => { B.barrier = true; } },
  { em: '⚡', n: ['Spark Dance', 'Tarian Bunga Api'], d: ['Sparks jump! The clock runs ahead a little.', 'Bunga api melompat! Masa berkurang sedikit.'], f: () => { if (B.tmax) { B.tleft = Math.round(B.tleft * .8); updateThink(); } } },
  { em: '🧚', n: ['Pixie Dust', 'Debu Pari-pari'], d: ['Glitter covers two wrong answers. Tap to clear.', 'Kilauan menutup dua jawapan salah. Sentuh untuk membersihkan.'], f: () => { fogSome(2); } },
  { em: '🦁', n: ['Beast Pounce', 'Terkaman Binatang'], d: ['The Chimera calls a guard to its side!', 'Chimera memanggil seorang pengawal ke sisinya!'], f: () => { callMinions(1); } },
  { em: '⚙️', n: ['Cog Spin', 'Putaran Gear'], d: ['The gears spin faster. The angry bar will run faster!', 'Gear berputar lebih laju. Bar marah bergerak lebih cepat!'], f: () => { B.eFast = true; } },
  { em: '🐍', n: ['Many Heads', 'Banyak Kepala'], d: ['Another head hides a wrong answer in mist.', 'Satu lagi kepala menyembunyikan jawapan salah dalam kabus.'], f: () => { fogSome(1); B.nextHit = (B.nextHit || 1) * 1.15; } }
];
const sigOf = lv => SIG[archOf(lv)];
function sigFire() {
  if (!bigBoss() || B.sigDone) return; B.sigDone = true;
  const sg = sigOf(B.lv), li = LI(), pm = fx.pos(ms());
  try { sg.f(); } catch (e) { /* a signature never stops the fight */ }
  if (typeof sfx.phase === 'function') sfx.phase();
  if (!S.sensory) { fx.num(pm.x, pm.y - pm.h * .85, sg.em + ' ' + sg.n[li] + '!', 'warn'); fx.ring(pm.x, pm.y, '#FFB4C8', 160); }
  setMsg(sg.em + ' ' + sg.n[li] + '! ' + sg.d[li]); announce(sg.n[li] + '. ' + sg.d[li], true);
}

/* ---------------- 2. battle situations ---------------- */
const SITU = [
  { em: '🌋', n: ['Hot Floor', 'Lantai Panas'], d: ['Every 3rd question has less time.', 'Setiap soalan ketiga masa lebih singkat.'] },
  { em: '🌫️', n: ['Thick Mist', 'Kabus Tebal'], d: ['Mist hides a wrong answer now and then.', 'Kabus menutup jawapan salah sekali-sekala.'] },
  { em: '🛡️', n: ['Armour Plates', 'Plat Perisai'], d: ['Right on the first try? A stronger hit!', 'Betul kali pertama? Serangan lebih kuat!'] },
  { em: '💚', n: ['Healing Spring', 'Mata Air Penyembuh'], d: ['A wrong answer heals the boss a little.', 'Jawapan salah memulihkan bos sedikit.'] },
  { em: '⚡', n: ['Lightning Round', 'Pusingan Kilat'], d: ['Every 4th question is fast, and hits double!', 'Setiap soalan keempat laju, dan serangannya berganda!'] },
  { em: '🌬️', n: ['Wild Wind', 'Angin Liar'], d: ['Sometimes the answers swap places.', 'Kadang-kadang jawapan bertukar tempat.'] },
  { em: '👥', n: ['Bodyguard', 'Pengawal'], d: ['A guard stands in front of the boss.', 'Seorang pengawal berdiri di hadapan bos.'] },
  { em: '🎯', n: ['Weak Spot', 'Titik Lemah'], d: ['Every 3rd question shows a weak spot: big damage!', 'Setiap soalan ketiga ada titik lemah: kerosakan besar!'] },
  { em: '💰', n: ['Treasure Hoard', 'Timbunan Harta'], d: ['Right on the first try? Extra coins!', 'Betul kali pertama? Syiling tambahan!'] },
  { em: '🌙', n: ['Moonlight', 'Cahaya Bulan'], d: ['If you wait, the moon lights the right answer.', 'Jika menunggu, bulan menyinari jawapan yang betul.'] }
];
const sitIdx = lv => (archOf(lv) * 3 + Math.max(0, Math.min(9, (lv && lv.z) || 0))) % 10;
const sitOf = lv => SITU[sitIdx(lv)];
/* the boss's own title: the signature plus the situation, e.g. "🔥 Ember Roar · 🌋 Hot Floor" */
const bossTitle = lv => { const li = LI(), sg = sigOf(lv), st = sitOf(lv); return `${sg.em} ${sg.n[li]} · ${st.em} ${st.n[li]}`; };
function sitClear() { clearTimeout(B.sitT); B.sitT = 0; B.sitFlag = ''; const m = ms(); if (m) m.classList.remove('weakspot'); $$('#answers .ans.moonlit').forEach(e => e.classList.remove('moonlit')); const s = $('#stage'); if (s) s.classList.remove('eclipse'); }
function sitMsg(txt) { setMsg((B.msg ? B.msg.plain + ' ' : '') + txt); }
function sitQuestion() {
  if (!bigBoss() || !B.active || !B.q) return;
  sitClear();
  const n = B.sq || 1, i = sitIdx(B.lv), q = B.q, li = LI(), st = SITU[i];
  switch (i) {
    case 0: if (n % 3 === 0 && B.tmax) { B.tleft = Math.round(B.tleft * .75); updateThink(); sitMsg(st.em + ' ' + st.n[li] + '!'); } break;
    case 1: if (n % 3 === 2 && fogSome(1)) sitMsg(st.em + ' ' + st.n[li] + '!'); break;
    case 4: if (n % 4 === 0) { B.sitFlag = 'fast'; if (B.tmax) { B.tleft = Math.round(B.tleft * .8); updateThink(); } sitMsg('⚡ ' + t('v32.sit.fast')); } break;
    case 5: if (n % 2 === 0) B.sitT = setTimeout(() => { if (B.q === q && !B.locked && B.active && !B.picked.size) { quakeShuffle(); if (!S.sensory) { const pm = fx.pos(ms()); fx.num(pm.x, pm.y - pm.h * .6, '🌬️', 'warn'); } } }, 3500); break;
    case 7: if (n % 3 === 0) { B.sitFlag = 'weak'; const m = ms(); if (m) m.classList.add('weakspot'); sitMsg('🎯 ' + t('v32.sit.weak')); if (!S.sensory) { const pm = fx.pos(ms()); fx.num(pm.x, pm.y - pm.h * .4, '🎯', 'combo'); } } break;
    case 9: B.sitT = setTimeout(() => { if (B.q === q && !B.locked && B.active) { const s = $('#stage'); if (s) s.classList.add('eclipse'); const a = $(`#answers .ans[data-v="${q.correct}"]`); if (a) a.classList.add('moonlit'); } }, 8000); break;
    default: break;
  }
}
function sitStart() {
  if (!bigBoss()) return;
  const i = sitIdx(B.lv); if (i === 6) callMinions(1);
}
HOOK.before('startBattle', () => { B.sqOn = false; B.sq = 0; B.sigDone = false; sitClear(); B.teamLit = []; B.teamCombos = 0; B.sayDone = {}; });
HOOK.on('startBattle', () => {
  sigChip(); teamInit();
  if (!bigBoss()) return;
  B.sq = 1; B.sqOn = true; sitStart(); sitQuestion(); bossIntroVS();
  const lv = B.lv, k = starKey(lv.subj, lv.n);
  if ((S.clear || {})[k]) bossSay('rematch', 2500, 2400);   // a rematch: the boss remembers you
});
HOOK.on('nextQuestion', () => { if (!B.sqOn || !B.active) return; B.sq = (B.sq || 0) + 1; sitQuestion(); });
HOOK.before('leaveBattle', () => { sitClear(); teamHide(); });
HOOK.before('win', () => { sitClear(); });
HOOK.on('wrongPick', () => {
  if (!bigBoss() || !B.active) return;
  if (sitIdx(B.lv) === 3 && B.mHp > 0) {   // Healing Spring: never heals back into an earlier phase
    const ph = bossPhaseOf(), cap = ph === 1 ? B.mMax : ph === 2 ? Math.floor(B.mMax * 2 / 3) : Math.floor(B.mMax / 3) - 1, to = Math.min(cap, B.mHp + Math.max(1, Math.round(B.mMax * .03)));
    if (to > B.mHp) { const d = to - B.mHp; B.mHp = to; updateHud(); const pm = fx.pos(ms()); if (!S.sensory) fx.num(pm.x, pm.y - pm.h * .5, '💚+' + d, 'safe'); }
  }
});
HOOK.before('onCorrect', () => {
  if (!B.active) return;
  if (bigBoss() && B.q) {
    const i = sitIdx(B.lv), first = B.wrong === 0;
    if (!hasMin()) {
      if (i === 2) boostBy(first ? 1.15 : .75);
      if (i === 4 && B.sitFlag === 'fast') boostBy(1.4);
      if (i === 7 && B.sitFlag === 'weak') boostBy(first ? 1.6 : 1.2);
      if (i === 9 && $('#stage') && $('#stage').classList.contains('eclipse')) boostBy(1.15);
    }
    if (i === 8 && first) { addCoins(2); if (!S.sensory) { const pm = fx.pos(hs()); fx.num(pm.x, pm.y - pm.h * .8, '💰 +2', 'safe'); } }
  }
  teamAnswer();
});
HOOK.around('bossSetup', next => {
  const prev = B.phase, r = next();
  if (bossOn() && B.phase !== prev) {
    if (B.phase === 2) setTimeout(() => { if (B.active && bossOn()) sigFire(); }, 900);
    if (B.phase === 3) bossSay('rage', 2200, 700);
  }
  return r;
});

/* the VS splash and a small chip under the boss name show the signature and the situation */
function bossIntroVS() {
  const mid = $('#vsIntro .vs-mid'); if (!mid || !bigBoss()) return;
  const old = mid.querySelector('.vs-sig'); if (old) old.remove();
  const sp = document.createElement('span'); sp.className = 'vs-sig'; sp.textContent = bossTitle(B.lv); mid.appendChild(sp);
}
function sigChip() {
  let el = $('#sigChip'); const top = $('#stage .stage-top');
  if (!bigBoss() || !top) { if (el) el.hidden = true; return; }
  if (!el) { el = document.createElement('span'); el.id = 'sigChip'; el.className = 'chip static sigchip'; top.appendChild(el); }
  const st = sitOf(B.lv), li = LI(); el.hidden = false; el.textContent = bossTitle(B.lv); el.title = st.d[li]; el.setAttribute('aria-label', t('v32.sit.aria', { s: sigOf(B.lv).n[li], t: st.n[li], d: st.d[li] }));
}

/* ---------------- 3. boss voices (rematch, rage, defeat) ---------------- */
function bossLine(kind) {
  const V = SHARED && SHARED.bossVoice && SHARED.bossVoice[archOf(B.lv)]; return V && V[kind] ? V[kind][LI()] : '';
}
function bossSay(kind, ms2 = 2200, delay = 0) {
  if (!bigBoss() || (B.sayDone && B.sayDone[kind])) return;
  const line = bossLine(kind); if (!line) return; (B.sayDone || (B.sayDone = {}))[kind] = 1;
  const tk = B.token;
  setTimeout(() => {
    if (B.token !== tk || !B.active) return;
    mTalk(line, ms2);
    if (S.voice && S.voice.auto && S.voice.roles !== false) { try { speakSeq([[line, undefined, BOSS_TTS[archOf(B.lv)]]]); } catch (e) { /* no speech */ } }
  }, delay);
}
HOOK.claim('talkLine', kind => {
  if (kind !== 'beaten' || !B.lv || !B.lv.big || !B.lv.mon || !Number.isInteger(B.lv.mon.arch)) return undefined;
  const line = bossLine('win'); if (!line) return undefined;
  if (S.voice && S.voice.auto && S.voice.roles !== false) { try { speakSeq([[line, undefined, BOSS_TTS[archOf(B.lv)]]]); } catch (e) { /* no speech */ } }
  return line;
});

/* ---------------- 4. team boss: a shared bar and a team combo ---------------- */
const teamOn = () => !!(coopOn() && B.active && B.lv && B.lv.boss);
function teamHide() { const el = $('#teamBar'); if (el) el.hidden = true; }
function teamInit() {
  let el = $('#teamBar'); const st = $('#stage');
  if (!teamOn() || !st) { if (el) el.hidden = true; return; }
  if (!el) { el = document.createElement('div'); el.id = 'teamBar'; el.className = 'teambar'; el.setAttribute('role', 'group'); st.appendChild(el); }
  el.hidden = false; teamRender();
}
function teamRender() {
  const el = $('#teamBar'); if (!el || el.hidden || !teamOn()) return;
  const n = coopN(), lit = new Set(B.teamLit || []), mp = Math.max(0, B.mHp) / Math.max(1, B.mMax) * 100;
  el.innerHTML = `<span class="tb-t">👫 ${esc(t('v32.team.boss'))}</span><span class="tb-pl">${Array.from({ length: n }, (_, i) => `<i class="${lit.has(i) ? 'on' : ''} ${(B.turn || 0) === i ? 'now' : ''}" title="${esc(coopName(i))}">${COOP_EM[i]}<u>${lit.has(i) ? '⭐' : '·'}</u></i>`).join('')}</span><span class="tb-m" aria-hidden="true"><b style="width:${mp}%"></b></span>`;
  el.setAttribute('aria-label', t('v32.team.aria', { a: lit.size, n, c: B.teamCombos || 0 }));
}
function teamBanner(txt) {
  const st = $('#stage'); if (!st || S.sensory) return;
  const b = document.createElement('div'); b.className = 'teamfire'; b.innerHTML = `<span>👫</span><b>${esc(txt)}</b>`; st.appendChild(b);
  b.animate([{ opacity: 0, transform: 'translate(-50%,-50%) scale(.3) rotate(-8deg)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1.15) rotate(2deg)', offset: .2 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: .75 }, { opacity: 0, transform: 'translate(-50%,-70%) scale(1.1)' }], { duration: 1500, fill: 'forwards' }).onfinish = () => b.remove();
}
/* called just before the answer is counted: lights this player's star, or puts every light out after a slip */
function teamAnswer() {
  if (!teamOn()) return;
  B.teamLit = B.teamLit || [];
  if (B.wrong > 0) { if (B.teamLit.length) setMsg((B.msg ? B.msg.plain + ' ' : '') + t('v32.team.lost')); B.teamLit = []; teamRender(); return; }
  const me = B.turn || 0; if (!B.teamLit.includes(me)) B.teamLit.push(me);
  if (B.teamLit.length >= coopN() && !hasMin()) {   // every player answered right: the team combo
    B.teamLit = []; B.teamCombos = (B.teamCombos || 0) + 1; boostBy(2);
    teamBanner(t('v32.team.combo')); setMsg(t('v32.team.fire'));
    if (typeof sfx.teamCombo === 'function') sfx.teamCombo(); else sfx.crit();
    if (!S.sensory) { const pm = fx.pos(ms()); fx.ring(pm.x, pm.y, '#8FF2B8', 200); fx.burst(pm.x, pm.y, 18, ['👫', '⭐', '✨', '💥']); fx.shake($('#stage'), 8, 500); }
    for (let i = 0; i < coopN(); i++) if (B.coopPts) B.coopPts[i] = (B.coopPts[i] || 0) + 1;
  }
  teamRender();
}
HOOK.on('updateHud', () => { try { teamRender(); } catch (e) { /* not built yet */ } });
HOOK.on('nextQuestion', () => { teamRender(); });
HOOK.filter('coopSummaryHTML', h => h && B.teamCombos ? h.replace(/<\/div><\/div>$/, `</div><span class="co-team">👫 ×${B.teamCombos} ${esc(t('v32.team.combos'))}</span></div>`) : h);

/* ---------------- 5. a much cooler finisher ---------------- */
const finCineOn = () => !S.sensory && !reducedMotion() && S.cine !== false;
HOOK.around('finisherSeq', async (next, dmg) => {
  const st = $('#stage'), tk = B.token;
  if (!finCineOn() || !st) return next(dmg);
  const it = finOf(), h = hs(), m = ms(), pm0 = fx.pos(m), parts = [];
  const add = el => { st.appendChild(el); parts.push(el); return el; };
  /* letterbox bars + speed lines + hero cut-in with the finisher's name */
  const bars = add(document.createElement('div')); bars.className = 'fin-bars'; bars.innerHTML = '<i></i><i></i>';
  const lines = add(document.createElement('div')); lines.className = 'fin-lines';
  const cut = add(document.createElement('div')); cut.className = 'fin-cut';
  cut.innerHTML = `<div class="fc-hero">${heroSVG(S.equipped)}</div><div class="fc-txt"><small>${esc(t('v32.fin.lead'))}</small><b>${esc(finName(it))}</b></div><span class="fc-em" aria-hidden="true">${it.fem || '✨'}</span>`;
  st.classList.add('fin-cine');
  if (typeof sfx.riser === 'function') sfx.riser();
  const slide = cut.animate([{ transform: 'translateX(-120%) skewX(-12deg)', opacity: 0 }, { transform: 'translateX(0) skewX(-12deg)', opacity: 1, offset: .18, easing: 'linear' }, { transform: 'translateX(4%) skewX(-12deg)', opacity: 1, offset: .86, easing: 'ease-in' }, { transform: 'translateX(120%) skewX(-12deg)', opacity: 0 }], { duration: 1400, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
  lines.animate([{ opacity: 0 }, { opacity: .85, offset: .2 }, { opacity: .85, offset: .8 }, { opacity: 0 }], { duration: 1400, fill: 'forwards' });
  bars.animate([{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { duration: 1500, fill: 'forwards' });
  try { await slide.finished; } catch (e) { /* cancelled */ }
  parts.forEach(e => e.remove()); st.classList.remove('fin-cine');
  if (B.token !== tk) return false;
  const ok = await next(dmg);
  if (B.token !== tk || !ok) return ok;
  /* the shockwave and the BOOM, right where the monster was hit */
  const pm = fx.pos(ms()) || pm0;
  if (typeof sfx.boom === 'function') sfx.boom();
  [0, 140, 280].forEach((d, i) => setTimeout(() => { if (B.token === tk) fx.ring(pm.x, pm.y, ['#FFE08A', '#FF9FC2', '#9FE8FF'][i], 130 + i * 70); }, d));
  fx.shake(st, 14, 600); fx.flash('rgba(255,255,255,.7)');
  const bw = document.createElement('div'); bw.className = 'fin-boom'; bw.textContent = t('v32.fin.boom'); bw.style.left = Math.round(Math.max(90, Math.min((st.clientWidth || 400) - 90, pm.x))) + 'px'; bw.style.top = Math.round(Math.max(40, pm.y - pm.h * .3)) + 'px'; st.appendChild(bw);
  bw.animate([{ opacity: 0, transform: 'translate(-50%,-50%) scale(.2) rotate(-14deg)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1.25) rotate(4deg)', offset: .25 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1) rotate(-2deg)', offset: .7 }, { opacity: 0, transform: 'translate(-50%,-90%) scale(1.1)' }], { duration: 900, fill: 'forwards' }).onfinish = () => bw.remove();
  fx.burst(pm.x, pm.y, 26, [it.fem || '✨', '⭐', '✨', '💥', '🌟']);
  try { fx.coins(ms(), 6); } catch (e) { /* no coins */ }
  await wait(420);
  return B.token === tk;
});

Object.assign(STR, {
  'v32.sit.fast': ['Fast round! A right answer hits double.', 'Pusingan laju! Jawapan betul memukul dua kali ganda.'],
  'v32.sit.weak': ['A weak spot! Answer right for a big hit.', 'Titik lemah! Jawab betul untuk serangan besar.'],
  'v32.sit.aria': ['Boss power: {s}. Situation: {t}. {d}', 'Kuasa bos: {s}. Keadaan: {t}. {d}'],
  'v32.team.boss': ['Team boss', 'Bos pasukan'], 'v32.team.aria': ['Team combo: {a} of {n} players right. Team combos so far: {c}.', 'Kombo pasukan: {a} daripada {n} pemain betul. Kombo setakat ini: {c}.'],
  'v32.team.combo': ['TEAM COMBO!', 'KOMBO PASUKAN!'], 'v32.team.fire': ['Everyone answered right! The team hits double!', 'Semua menjawab betul! Pasukan memukul dua kali ganda!'],
  'v32.team.lost': ['The team lights went out. Start again together!', 'Lampu pasukan padam. Mulakan semula bersama-sama!'], 'v32.team.combos': ['team combos', 'kombo pasukan'],
  'v32.fin.lead': ['Finisher!', 'Serangan Penamat!'], 'v32.fin.boom': ['BOOM!', 'DUM!']
});
