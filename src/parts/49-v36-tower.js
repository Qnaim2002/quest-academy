/* ================= v36: the Tower grows up =================
   BUILDS        the perks now belong to three builds. Taking 3 perks of one build wakes a small power, 6 a bigger one:
                   📘 Scholar  (Extra Time, Hoot's Hint, Strong Arm)     3: Clear Mind +15% damage on first tries    6: Sharp Focus, a quick first try charges the super move
                   🛡️ Tank     (+1 Heart, Second Chance, Healing Leaf)  3: Thick Skin +10% health               6: Second Wind, +20% health after every floor
                   🍀 Lucky    (Double Coins, Lucky Charm, Coin Magnet) 3: Haggler, shop 15% cheaper, rerolls cheaper   6: Fortune, +25% coins and the first reroll of a sheet is free
                 Two perks are new: Lucky Charm (a chance of 2 coins on a right answer) and Coin Magnet (more coins from every floor).
   REROLL/BANISH on the perk sheet the climb's coins can reroll the 3 offers, or banish one perk for the rest of the climb.
   ASCENSION     reaching floor 100 opens Ascension (New Game+): a title, and 5 steps of harder twists with bigger coin rewards.
   CURSE DEALS   a third choice at the Shrine, only for ages 6 and 7 (band 3 and 4): five floors of harder questions, a faster clock
                 or tougher foes, paid back with double coins, a free perk now and a chest at the end. The child opts in.
   MILESTONES    floors 25, 50, 75 and 100 (and every 100 after) each break one rule:
                   25 Twin Strike  damage lands on every second right answer, and twice as hard
                   50 Hourglass    the clock only runs after a wrong answer
                   75 Trickster    a wrong answer shuffles the answers and the boss heals a little
                   100 Grand Finale  all three, one for each third of the boss's health */
const TW_BUILDS = [
  { id: 'scholar', em: '📘', perks: ['time', 'hint4', 'power'] },
  { id: 'tank', em: '🛡️', perks: ['heart', 'forgive', 'regen'] },
  { id: 'lucky', em: '🍀', perks: ['coin2', 'charm', 'magnet'] }
];
TW_PERKS.push({ id: 'charm', em: '🧿', max: 3 }, { id: 'magnet', em: '🧲', max: 3 });
const ASC_MAX = 5;
const TW_RULES = { 25: 'pairs', 50: 'hourglass', 75: 'reshuffle', 0: 'finale' };
const TW_RULE_EM = { pairs: '👯', hourglass: '⏳', reshuffle: '🎭', finale: '🌟' };
const TW_CURSES = [{ id: 'hard', em: '🔥' }, { id: 'rush', em: '⏱️' }, { id: 'fierce', em: '👹' }];
const CURSE_FLOORS = 5;

/* ---------- builds ---------- */
const twBuildEm = id => { const b = TW_BUILDS.find(x => x.perks.includes(id)); return b ? b.em : ''; };
function twBuildPts(r) {
  r = r || twRun(); const out = {};
  TW_BUILDS.forEach(b => { out[b.id] = r && r.perks ? b.perks.reduce((a, id) => a + (r.perks[id] || 0), 0) : 0; });
  return out;
}
const tierOfPts = n => (n >= 6 ? 2 : n >= 3 ? 1 : 0);
function twBuildTier(id) { const r = twRun(); return r ? tierOfPts(twBuildPts(r)[id] || 0) : 0; }
function twBuildHTML(r) {
  const pts = twBuildPts(r), act = [];
  const chips = TW_BUILDS.map(b => {
    const n = pts[b.id], tier = tierOfPts(n), nx = tier === 0 ? 3 : tier === 1 ? 6 : 0;
    for (let k = 1; k <= tier; k++) act.push(`✨ ${t('v36.tb.' + b.id + '.' + k)}: ${t('v36.tb.' + b.id + '.' + k + '.d')}`);
    return `<span class="tw-bchip t${tier}">${b.em} ${esc(t('v36.tb.' + b.id))} <b>${n}${nx ? '/' + nx : ' ★'}</b></span>`;
  }).join('');
  return `<div class="tw-builds" role="group" aria-label="${esc(t('v36.tb.title'))}">${chips}</div>${act.length ? `<ul class="tw-syn">${act.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : `<p class="tw-fnote">${esc(t('v36.tb.hint'))}</p>`}`;
}

/* ---------- the climb's wallet, reroll and banish ---------- */
const twLeft = r => Math.max(0, Math.min((r.coins || 0) - (r.spent || 0), S.coins));
function twPay(c) {
  const r = twRun(); if (!r || twLeft(r) < c) return false;
  S.coins -= c; r.spent = (r.spent || 0) + c; const cv = $('#coinVal'); if (cv) cv.textContent = S.coins; save(); return true;
}
const twRerollCost = r => Math.max(1, 4 + 2 * (r.rr | 0) - (twBuildTier('lucky') >= 1 ? 2 : 0));
const twRerollFree = r => twBuildTier('lucky') >= 2 && !(r.rrSheet | 0);
const twBanCost = r => 8 + 4 * (r.ban || []).length;
function twRerollHTML(r, ch) {
  const rc = twRerollFree(r) ? 0 : twRerollCost(r), bc = twBanCost(r), left = twLeft(r);
  return `<p class="tw-wallet">🪙 ${esc(t('twr.wallet', { n: left }))}</p>
    <div class="tw-tools"><button class="btn" data-act="twReroll" ${left < rc ? 'disabled' : ''}>🎲 ${esc(t('v36.reroll'))} <i>${rc ? '🪙 ' + rc : esc(t('v36.free'))}</i></button></div>
    <p class="sub tw-bansub">${esc(t('v36.ban.sub', { c: bc }))}</p>
    <div class="tw-bans">${ch.map(p => `<button class="chip tw-ban" data-act="twBan" data-v="${p.id}" ${left < bc ? 'disabled' : ''} aria-label="${esc(t('v36.ban.one', { p: t('tp.' + p.id), c: bc }))}">🚫 ${p.em}</button>`).join('')}</div>`;
}
function twReroll() {
  const r = twRun(); if (!r) return false;
  const free = twRerollFree(r), c = free ? 0 : twRerollCost(r);
  if (c && !twPay(c)) { toast(t('twr.poor')); return false; }
  if (!free) r.rr = (r.rr | 0) + 1;
  r.rrSheet = (r.rrSheet | 0) + 1; r.rolls = (r.rolls | 0) + 1; save(); sfx.pop && sfx.pop();
  twPerkSheet(r.sheetTitle, true); return true;
}
function twBan(id) {
  const r = twRun(); if (!r || !twPerk(id) || (r.ban || []).includes(id)) return false;
  if (!twPay(twBanCost(r))) { toast(t('twr.poor')); return false; }
  (r.ban || (r.ban = [])).push(id); r.rolls = (r.rolls | 0) + 1; save(); sfx.soft && sfx.soft();
  toast('🚫 ' + t('tp.' + id));
  twPerkSheet(r.sheetTitle, true); return true;
}

/* ---------- what the builds do ---------- */
function twRuleOf(f) { return (f >= 25 && TW_RULES[f % 100]) || null; }
function twRuleNow() {   // the rule in force right now (the Grand Finale changes with the boss's health)
  const lv = B.lv; if (!lv || lv.special !== 'tower' || !lv.rule) return null;
  if (lv.rule !== 'finale') return lv.rule;
  const p = B.mMax ? B.mHp / B.mMax : 1; return p > .66 ? 'pairs' : p > .33 ? 'hourglass' : 'reshuffle';
}
HOOK.filter('dmgBoost', v => {
  const lv = B.lv; if (!lv || lv.special !== 'tower' || !twRun()) return v;
  if (twBuildTier('scholar') >= 1 && B.wrong === 0) v *= 1.15;   // Clear Mind
  if (twRuleNow() === 'pairs' && B.active) {   // Twin Strike: every second right answer lands, twice as hard
    const fin = B.combo > 0 && B.combo % FIN_EVERY === 0, sup = (B.charge || 0) >= 3;
    B.pairN = (B.pairN | 0) + 1;
    if (B.pairN % 2 === 1 && !fin && !sup) { B.pairHalf = true; return 0; }
    B.pairHalf = false; return v * 2;
  }
  return v;
});
HOOK.claim('attackSeq', (dmg, crit, blocked) => {   // the first answer of a pair: a small hop, no hit
  if (!B.pairHalf) return undefined; B.pairHalf = false; if (blocked) return undefined;
  const tk = B.token, h = hs(), pm = fx.pos(ms());
  setMsg(t('v36.rule.half')); sfx.charge && sfx.charge(1); pose(h, 'attack', 500);
  if (!S.sensory) fx.num(pm.x, pm.y - pm.h * .4, '½', 'combo');
  return wait(S.sensory ? 150 : 520).then(() => B.token === tk);
});
HOOK.claim('thinkTick', () => (B.lv && B.lv.special === 'tower' && B.wrong === 0 && twRuleNow() === 'hourglass' ? true : undefined));   // Hourglass: no clock until a mistake
HOOK.on('answer:wrong', () => {   // Trickster: the answers swap places and the boss heals a little (never past the part of the fight it is in)
  if (!B.lv || B.lv.special !== 'tower' || !B.active || twRuleNow() !== 'reshuffle') return;
  quakeShuffle();
  const cap = Math.round(B.mMax * (B.lv.rule === 'finale' ? .32 : .7)), heal = Math.round(B.mMax * .06);
  if (B.mHp < cap) { const to = Math.min(cap, B.mHp + heal), d = to - B.mHp; B.mHp = to; const pm = fx.pos(ms()); fx.num(pm.x, pm.y - pm.h * .5, '+' + d, 'safe'); updateHud(); }
  setMsg(t('v36.rule.trick'));
});
HOOK.on('answer:right', () => {
  const r = twRun(); if (!r || !B.lv || B.lv.special !== 'tower' || !B.active) return;
  if (twBuildTier('scholar') >= 2 && B.wrong === 0 && (!B.tmax || B.tleft > B.tmax / 2)) B.charge = Math.min(3, (B.charge || 0) + 1);   // Sharp Focus
  const c = twN('charm');
  if (c && Math.random() < .12 * c) { addCoins(2); r.coins = (r.coins || 0) + 2; if (!S.sensory) { const p = fx.pos(hs()); fx.num(p.x, p.y - p.h * .7, '🧿 +2', 'combo'); } }
});
function twAfterWin() {
  const lv = B.lv, r = twRun(); if (!lv || lv.special !== 'tower' || !r) return;
  if (twBuildTier('tank') >= 2) { const mx = heroMaxHP(); r.hHp = Math.min(mx, (r.hHp == null ? mx : r.hHp) + Math.round(mx * .2)); }   // Second Wind
  if (r.curse) {
    r.curse.left--;
    if (r.curse.left <= 0) { r.curse = null; chestGive(1); toast('🎁 ' + t('v36.curse.done')); }
    else { const w = $('#winSheet .wline'); if (w) w.insertAdjacentHTML('afterend', `<p class="tw-perks curse">😈 ${esc(t('v36.curse.left', { n: r.curse.left }))}</p>`); }
  }
  save();
}
HOOK.on('win', twAfterWin);

/* ---------- coins ---------- */
function twModRate() { const r = twRun(); return r && (r.asc | 0) >= 4 ? .55 : .38; }
function twPrice(p) { const r = twRun(), a = r ? r.asc | 0 : 0; return Math.max(1, Math.round(p * (twBuildTier('lucky') >= 1 ? .85 : 1) * (a >= 3 ? 1.3 : 1))); }
function twRewMul(run) {
  if (!run) return 1;
  let m = 1 + .25 * (run.asc | 0);
  m *= 1 + .2 * ((run.perks && run.perks.magnet) || 0);
  if (run.perks && tierOfPts(twBuildPts(run).lucky) >= 2) m *= 1.25;
  if (run.curse && run.curse.left > 0) m *= 2;
  return m;
}

/* ---------- the fight itself: ascension, curses and milestone rules change the floor ---------- */
HOOK.filter('specialLevel', lv => {
  if (!lv || lv.special !== 'tower') return lv;
  const r = twRun(), out = Object.assign({}, lv), rule = twRuleOf(lv.floor);
  if (rule) { out.rule = rule; out.rewMul = (out.rewMul || 1) * 1.5; }
  if (!r) return out;
  const a = r.asc | 0, cu = r.curse && r.curse.left > 0 ? r.curse.id : null;
  if (a >= 1) out.hpMul = (out.hpMul || 1) * (a >= 5 ? 1.44 : 1.2);
  if (a >= 2) out.timeMul = out.timeMul * .88;
  if (cu === 'hard') out.dk = Math.min(1, (out.dk || 1) + .25);
  if (cu === 'rush') out.timeMul = out.timeMul * .7;
  if (cu === 'fierce') out.hpMul = (out.hpMul || 1) * 1.3;
  if (cu) out.curse = cu;
  return out;
});
function twRuleBanner(force) {
  const lv = B.lv, bv = $('#battleView'); if (!lv || lv.special !== 'tower' || !lv.rule || !bv) return;
  const k = twRuleNow(); if (!k || (!force && B.ruleShown === k)) return; B.ruleShown = k;
  const old = $('#twBanner'); if (old) old.remove();
  bv.insertAdjacentHTML('beforeend', `<div id="twBanner" class="tw-banner rule" role="status"><b>${TW_RULE_EM[k]} ${esc(t('v36.rule.' + k))}</b><span>${esc(t('v36.rule.' + k + '.d'))}</span></div>`);
  announce(t('v36.rule.' + k) + '. ' + t('v36.rule.' + k + '.d'), true);
  setTimeout(() => { const b = $('#twBanner'); if (b) b.remove(); }, S.sensory ? 4200 : 3600);
  const rc = $('#twRuleChip'); if (rc) rc.textContent = TW_RULE_EM[k] + ' ' + t('v36.rule.' + k);
}
HOOK.on('startBattle', () => {
  B.pairN = 0; B.pairHalf = false; B.ruleShown = null;
  const lv = B.lv, r = twRun(), rc = $('#twRuleChip'); if (rc) rc.remove();
  if (!lv || lv.special !== 'tower' || !r) return;
  const pn = $('#placeName');
  if (pn) pn.insertAdjacentHTML('beforeend', `${(r.asc | 0) ? ` <span class="tw-chip asc">⭐${r.asc}</span>` : ''}${lv.curse ? ` <span class="tw-chip curse" title="${esc(t('v36.curse.' + lv.curse))}">😈 ${r.curse ? r.curse.left : ''}</span>` : ''}${lv.rule ? ` <span id="twRuleChip" class="tw-chip rule"></span>` : ''}`);
  if (lv.curse === 'hard' && B.ad) { B.ad.lvl = Math.max(B.ad.lvl, 2); if (typeof adApply === 'function') adApply(false); }   // the questions start a step harder
  twRuleBanner(true);
});
HOOK.on('nextQuestion', () => twRuleBanner(false));

/* ---------- ascension ---------- */
const twAscTitleId = n => 'asc' + n;
[['Tower Master', 'Penakluk Menara'], ['Sky Climber', 'Pendaki Awan'], ['Star Keeper', 'Penjaga Bintang'], ['Cloud Sage', 'Bijak Awan'], ['Tower Legend', 'Legenda Menara']].forEach((nm, i) => {
  LK_TITLES.push([twAscTitleId(i + 1), nm[0], nm[1], () => (tower().asc | 0) >= i + 1, ['Reach floor 100 in the tower' + (i ? ' on Ascension ' + i : ''), 'Capai tingkat 100 di menara' + (i ? ' pada Kenaikan ' + i : '')]]);
});
function twAscendReady() { const r = twRun(); return !!r && (r.asc | 0) >= (tower().asc | 0) && (tower().asc | 0) < ASC_MAX; }
function twAscendGain() {   // reaching floor 100 on the newest step opens the next one
  if (!twAscendReady()) return 0;
  const tw = tower(); tw.asc = (tw.asc | 0) + 1;
  lk().title = twAscTitleId(tw.asc);   // the new title is worn at once (the Me page can change it)
  save(); return tw.asc;
}
const twAscName = n => { const x = LK_TITLES.find(r => r[0] === twAscTitleId(n)); return x ? (S.lang === 'ms' ? x[2] : x[1]) : ''; };
const twAscendHTML = n => `<p class="tw-story asc">⭐ ${esc(t('v36.asc.got', { n, t: twAscName(n) }))}</p>`;
function twAscend() {
  const n = twAscendGain(); if (!n) { twStory(); return; }
  sfx.win(); if (!S.sensory) { const p = { x: innerWidth / 2, y: innerHeight / 3 }; fx.burst(p.x, p.y, 36, ['⭐', '✨', '🌟', '🎉']); }
  chestGive(1); addCoins(50); const r = twRun(); if (r) r.coins = (r.coins || 0) + 50; save();
  twSheet(`<h2>⭐ ${esc(t('v36.asc.title'))} ${n}</h2><div class="tw-art fin" aria-hidden="true"><i>${heroSVG(S.equipped)}</i><i>${owlSVG()}</i></div>${twAscendHTML(n)}<p class="tw-story">${esc(t('v36.asc.say'))}</p><div class="wline"><span class="gain">+50 🪙</span>${chestBtnHTML()}</div>${twNextBtn('tw.keep')}`, 'fin');
  if (S.voice.auto) speak(t('v36.asc.title') + ' ' + n);
}
function twAscPanel() {
  const a = Math.min(ASC_MAX, tower().asc | 0), sel = Math.min(UI.twAsc | 0, a), head = `<h2>⭐ ${esc(t('v36.asc.title'))}</h2>`;
  if (!a) return `<div class="tw-asc locked">${head}<p class="sub">${esc(t('v36.asc.lock'))}</p></div>`;
  const chips = Array.from({ length: a + 1 }, (_, i) => `<button class="chip tw-fc" data-act="twAscSet" data-v="${i}" aria-pressed="${sel === i}">${i ? '⭐' + i : esc(t('v36.asc.normal'))}</button>`).join('');
  const list = Array.from({ length: sel }, (_, i) => `<li>⭐${i + 1} ${esc(t('v36.asc.' + (i + 1)))}</li>`).join('');
  return `<div class="tw-asc">${head}<p class="sub">${esc(t('v36.asc.have', { t: twAscName(a) }))}</p><div class="tw-chips">${chips}</div>${list ? `<ul class="tw-syn">${list}</ul><p class="tw-fnote">${esc(t('v36.asc.pay'))}</p>` : ''}</div>`;
}

/* ---------- curse deals at the Shrine ---------- */
const twCurseOK = r => !!r && S.band >= 3 && !r.curse;
const twCurseBtn = r => (twCurseOK(r) ? `<button class="btn ghost" data-act="twCurse">🕯️ ${esc(t('v36.curse.btn'))}</button>` : '');
function twCurseSheet() {
  const r = twRun(); if (!twCurseOK(r)) { twNext(); return; }
  twSheet(`${twRoomHead('shrine')}<p class="tw-story">${esc(t('v36.curse.ask'))}</p><p class="sub">${esc(t('v36.curse.deal', { n: CURSE_FLOORS }))}</p><div class="tw-cards">${TW_CURSES.map(c => `<button class="tw-card" data-act="twCurseTake" data-v="${c.id}"><span class="tw-em" aria-hidden="true">${c.em}</span><b>${esc(t('v36.curse.' + c.id))}</b><small>${esc(t('v36.curse.' + c.id + '.d'))}</small></button>`).join('')}</div><div class="wbtns"><button class="btn ghost" data-act="twNext">${esc(t('v36.curse.no'))}</button></div>`);
}
function twCurseTake(id) {
  const r = twRun(); if (!twCurseOK(r) || !TW_CURSES.some(c => c.id === id)) return false;
  r.curse = { id, left: CURSE_FLOORS }; save(); sfx.growl && sfx.growl(); toast('😈 ' + t('v36.curse.' + id));
  twPerkSheet(t('v36.curse.perk')); return true;
}

HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'twReroll': twReroll(); return true;
    case 'twBan': twBan(v); return true;
    case 'twCurse': twCurseSheet(); return true;
    case 'twCurseTake': twCurseTake(v); return true;
    case 'twAscSet': UI.twAsc = Math.max(0, Math.min(ASC_MAX, +v | 0)); if (UI.tab === 'tower') renderTower(); return true;
  }
  return undefined;
});

Object.assign(STR, {
  'tp.charm': ['Lucky Charm', 'Azimat Bertuah'], 'tp.charm.d': ['A right answer may find 2 coins.', 'Jawapan betul mungkin menjumpai 2 syiling.'],
  'tp.magnet': ['Coin Magnet', 'Magnet Syiling'], 'tp.magnet.d': ['Every floor gives 20% more coins.', 'Setiap tingkat memberi 20% lebih syiling.'],
  'v36.tb.title': ['Your build', 'Binaan kamu'], 'v36.tb.hint': ['Take 3 perks from one build to wake its power.', 'Ambil 3 kelebihan daripada satu binaan untuk membangkitkan kuasanya.'],
  'v36.tb.scholar': ['Scholar', 'Sarjana'], 'v36.tb.tank': ['Tank', 'Perisai'], 'v36.tb.lucky': ['Lucky', 'Bertuah'],
  'v36.tb.scholar.1': ['Clear Mind', 'Minda Jernih'], 'v36.tb.scholar.1.d': ['+15% damage on first tries', '+15% kerosakan pada cubaan pertama'],
  'v36.tb.scholar.2': ['Sharp Focus', 'Fokus Tajam'], 'v36.tb.scholar.2.d': ['a quick first try charges the super move more', 'cubaan pertama yang pantas mengecas serangan super lebih'],
  'v36.tb.tank.1': ['Thick Skin', 'Kulit Tebal'], 'v36.tb.tank.1.d': ['+10% health', '+10% nyawa'],
  'v36.tb.tank.2': ['Second Wind', 'Nafas Kedua'], 'v36.tb.tank.2.d': ['heal 20% after every floor', 'pulih 20% selepas setiap tingkat'],
  'v36.tb.lucky.1': ['Haggler', 'Pandai Tawar'], 'v36.tb.lucky.1.d': ['shop 15% cheaper, rerolls cost less', 'kedai 15% lebih murah, undi semula lebih murah'],
  'v36.tb.lucky.2': ['Fortune', 'Tuah'], 'v36.tb.lucky.2.d': ['+25% coins, the first reroll is free', '+25% syiling, undi semula pertama percuma'],
  'v36.reroll': ['Reroll', 'Undi semula'], 'v36.free': ['free', 'percuma'],
  'v36.ban.sub': ['Banish a perk for the rest of the climb (🪙 {c}):', 'Buang satu kelebihan sehingga pendakian tamat (🪙 {c}):'],
  'v36.ban.one': ['Banish {p} for {c} coins', 'Buang {p} dengan {c} syiling'],
  'v36.tw.lg.rule': ['milestone boss with a special rule', 'bos pencapaian dengan peraturan istimewa'],
  'v36.tw.r7': ['Floors 25, 50, 75 and 100 each break one rule. Reach floor 100 to open Ascension.', 'Tingkat 25, 50, 75 dan 100 masing-masing melanggar satu peraturan. Capai tingkat 100 untuk membuka Kenaikan.'],
  'v36.rule.pairs': ['Twin Strike', 'Serangan Kembar'], 'v36.rule.pairs.d': ['Every second right answer lands, twice as hard.', 'Setiap jawapan betul yang kedua mengenai, dua kali lebih kuat.'],
  'v36.rule.hourglass': ['Hourglass', 'Jam Pasir'], 'v36.rule.hourglass.d': ['The clock only runs after a wrong answer.', 'Jam hanya berjalan selepas jawapan salah.'],
  'v36.rule.reshuffle': ['Trickster', 'Si Penipu'], 'v36.rule.reshuffle.d': ['A wrong answer shuffles the answers and the boss heals a little.', 'Jawapan salah mengocok jawapan dan bos pulih sedikit.'],
  'v36.rule.finale': ['Grand Finale', 'Kemuncak Agung'], 'v36.rule.finale.d': ['Three rules, one for each third of the boss’s health.', 'Tiga peraturan, satu untuk setiap sepertiga nyawa bos.'],
  'v36.rule.half': ['One of two! Answer once more to strike.', 'Satu daripada dua! Jawab sekali lagi untuk menyerang.'], 'v36.rule.trick': ['The answers swapped places!', 'Jawapan bertukar tempat!'],
  'v36.asc.title': ['Ascension', 'Kenaikan'], 'v36.asc.normal': ['Normal', 'Biasa'],
  'v36.asc.lock': ['Reach floor 100 to open Ascension: a title and a harder climb with bigger rewards.', 'Capai tingkat 100 untuk membuka Kenaikan: satu gelaran dan pendakian lebih sukar dengan ganjaran lebih besar.'],
  'v36.asc.have': ['Your title: {t}. Pick how hard you want to climb.', 'Gelaran kamu: {t}. Pilih tahap pendakian kamu.'],
  'v36.asc.pay': ['Harder climbs give 25% more coins for each step.', 'Pendakian lebih sukar memberi 25% lebih syiling untuk setiap langkah.'],
  'v36.asc.1': ['Tougher foes', 'Musuh lebih kuat'], 'v36.asc.2': ['Less time to think', 'Masa berfikir lebih singkat'], 'v36.asc.3': ['Dearer shop, weaker campfire', 'Kedai lebih mahal, unggun api lebih lemah'],
  'v36.asc.4': ['More special floors, pick 1 of 2 perks', 'Lebih banyak tingkat istimewa, pilih 1 daripada 2 kelebihan'], 'v36.asc.5': ['No Second Chance, the toughest foes', 'Tiada Peluang Kedua, musuh paling kuat'],
  'v36.asc.got': ['Ascension {n} opened! New title: {t}.', 'Kenaikan {n} dibuka! Gelaran baharu: {t}.'],
  'v36.asc.say': ['“The tower grows taller for those who keep climbing,” says Hoot. “Are you ready for a harder climb?”', '“Menara bertambah tinggi untuk mereka yang terus mendaki,” kata Hoot. “Sudah bersedia untuk pendakian lebih sukar?”'],
  'v36.curse.btn': ['Dark bargain', 'Perjanjian gelap'], 'v36.curse.ask': ['A candle flickers: “I can give you more… if you can take more.”', 'Sebatang lilin berkelip: “Aku boleh beri lebih… jika kamu sanggup menanggung lebih.”'],
  'v36.curse.deal': ['For {n} floors you get double coins. You also get a free perk now and a chest at the end.', 'Selama {n} tingkat kamu dapat syiling berganda. Kamu juga dapat satu kelebihan percuma sekarang dan peti di hujung.'],
  'v36.curse.hard': ['Hard Questions', 'Soalan Sukar'], 'v36.curse.hard.d': ['The questions are a step harder.', 'Soalan lebih sukar satu langkah.'],
  'v36.curse.rush': ['Rush Hour', 'Waktu Kelam-kabut'], 'v36.curse.rush.d': ['The clock is 30% faster.', 'Jam 30% lebih laju.'],
  'v36.curse.fierce': ['Fierce Foes', 'Musuh Garang'], 'v36.curse.fierce.d': ['Monsters have 30% more health.', 'Raksasa mempunyai 30% lebih nyawa.'],
  'v36.curse.no': ['No, thank you', 'Tidak, terima kasih'], 'v36.curse.perk': ['The candle gives you a perk!', 'Lilin memberi kamu satu kelebihan!'],
  'v36.curse.left': ['Curse deal: {n} floors left, coins count twice.', 'Perjanjian gelap: {n} tingkat lagi, syiling dikira dua kali.'],
  'v36.curse.done': ['The deal is over! You get a chest.', 'Perjanjian tamat! Kamu dapat satu peti.']
});
if (window.__quest) window.__quest.v36 = Object.assign(window.__quest.v36 || {}, { TW_BUILDS, TW_RULES, TW_CURSES, ASC_MAX, twBuildPts, twBuildTier, twRuleOf, twRuleNow, twReroll, twBan, twRerollCost, twBanCost, twRewMul, twPrice, twCurseOK, twCurseTake, twAscendReady, twAscendGain, twAscPanel, twLeft, twPay, twAfterWin });
