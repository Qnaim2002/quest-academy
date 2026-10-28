/* ================= v27: a hero who grows =================
   HERO PERKS. The hero level (from stars and wins) unlocks passive perks: more health, a stronger attack,
     more thinking time, a little guard, healing and bonus coins.
   GEAR UPGRADES. Coins upgrade the weapon you wear, up to level 5 (each level gives +2 attack).
   TREASURE CHESTS. Beating a boss for the first time (and other big wins) gives a chest. Tap it open for a
     treasure that is never sold in the Armory. Treasures are kept in the Cards tab; one at a time can be used.
   "WHY?" STEP. From age 6, after a right math answer the child sometimes picks the reason too. A right reason
     makes the hit stronger and gives 2 coins; a wrong reason just shows the right working (no penalty).
   STORY SKIP. Stories a child has seen before get a big "Skip" button and an "Always skip this story" switch,
     remembered for each child and each story.
   PARENT SETTINGS. Boss camera and slow motion, monster talk, the "why?" step and charged attacks can each be
     turned off in the Parent Portal.
   Hooks used by 10 and 11: atkBonus(), timeBonus(), guardBonus(), healBonus(). */
const HERO_PERKS = [[3, 'hp', 5], [5, 'atk', 1], [7, 'time', .05], [9, 'hp', 5], [11, 'atk', 2], [13, 'coin', 2], [15, 'guard', .03], [18, 'hp', 10], [21, 'atk', 3],
  [24, 'heal', 1], [27, 'time', .05], [30, 'hp', 10], [35, 'atk', 3], [40, 'guard', .03]];
const heroLevel = () => 1 + Math.floor(heroXP() / 10);
function perkSum(kind, lvl = heroLevel()) { return HERO_PERKS.reduce((a, [l, k, v]) => a + (k === kind && lvl >= l ? v : 0), 0); }
function perkText(k, v) { return t('pk27.' + k, { n: k === 'time' || k === 'guard' ? Math.round(v * 100) : v }); }

/* ---------------- treasures (chest-only items) ---------------- */
const RELICS = [
  ['r_acorn', '🌰', 'Lucky Acorn', 'Biji Oak Bertuah', 'coin', 3], ['r_feather', '🪶', 'Swift Feather', 'Bulu Pantas', 'time', .08], ['r_heart', '💗', 'Crystal Heart', 'Hati Kristal', 'hp', 10],
  ['r_fang', '🦷', 'Dragon Tooth', 'Gigi Naga', 'atk', 3], ['r_shell', '🐚', 'Echo Shell', 'Cangkerang Gema', 'guard', .05], ['r_leaf', '🍀', 'Clover Charm', 'Azimat Semanggi', 'coin', 4],
  ['r_moon', '🌙', 'Moon Pebble', 'Batu Bulan', 'heal', 1], ['r_bell', '🔔', 'Brave Bell', 'Loceng Berani', 'atk', 2], ['r_drop', '💧', 'Dew Drop', 'Titisan Embun', 'heal', 1],
  ['r_mushroom', '🍄', 'Bouncy Mushroom', 'Cendawan Melantun', 'hp', 12],
  ['r_star', '⭐', 'Fallen Star', 'Bintang Jatuh', 'atk', 4], ['r_hourglass', '⏳', 'Tiny Hourglass', 'Jam Pasir Kecil', 'time', .12], ['r_crown', '👑', 'Paper Crown', 'Mahkota Kertas', 'hp', 15],
  ['r_rainbow', '🌈', 'Rainbow Ribbon', 'Reben Pelangi', 'guard', .07], ['r_compass', '🧭', 'Old Compass', 'Kompas Lama', 'time', .1], ['r_gem', '💎', 'Wishing Gem', 'Permata Hajat', 'coin', 5],
  ['r_snow', '❄️', 'Snow Globe', 'Glob Salji', 'guard', .06], ['r_sun', '☀️', 'Sun Medal', 'Pingat Matahari', 'heal', 2],
  ['r_key', '🗝️', 'Secret Key', 'Kunci Rahsia', 'atk', 5], ['r_owl', '🦉', 'Hoot’s Feather', 'Bulu Hoot', 'time', .15], ['r_dice', '🎲', 'Lucky Dice', 'Dadu Bertuah', 'coin', 6],
  ['r_rocket', '🚀', 'Toy Rocket', 'Roket Mainan', 'atk', 6], ['r_lantern', '🏮', 'Glow Lantern', 'Tanglung Bercahaya', 'hp', 20], ['r_egg', '🥚', 'Golden Egg', 'Telur Emas', 'guard', .08]
].map(([id, em, en, msn, kind, v], i) => ({ id, em, en, ms: msn, kind, v, rar: i < 10 ? 0 : i < 18 ? 1 : 2 }));
const RELIC = Object.fromEntries(RELICS.map(r => [r.id, r]));
const RAR27 = ['common', 'rare', 'epic'];
const relicName = r => S.lang === 'ms' ? r.ms : r.en;
const relics = () => Array.isArray(S.relics) ? S.relics : (S.relics = []);
const relicOn = () => RELIC[S.relicOn] && relics().includes(S.relicOn) ? RELIC[S.relicOn] : null;   // the first slot
/* v35: more slots (2 at hero level 20, 3 at level 40). S.relicOn is slot 1, S.relicX the others. Pairs can give a bonus (46). */
const relicX = () => Array.isArray(S.relicX) ? S.relicX : (S.relicX = []);
const relicSlotsN = () => heroLevel() >= 40 ? 3 : heroLevel() >= 20 ? 2 : 1;
const relicActive = () => [S.relicOn, ...relicX()].filter((id, i, a) => RELIC[id] && relics().includes(id) && a.indexOf(id) === i).slice(0, relicSlotsN()).map(id => RELIC[id]);
const relicV = kind => relicActive().reduce((a, r) => a + (r.kind === kind ? r.v : 0), 0) + relicSynV(kind);

/* ---------------- weapon upgrades ---------------- */
const UPG_MAX = 5;
const upg = () => S.upg || (S.upg = {});
const upgLv = id => Math.max(0, Math.min(UPG_MAX, +(upg()[id] || 0)));
const upgCost = id => { const it = ITEM[id], l = upgLv(id); return l >= UPG_MAX ? 0 : 25 * (l + 1) + Math.round(((it && it.cost) || 0) * .15); };

/* the hooks */
function atkBonus() { return HOOK.call('atkBonus', atkBonusBase, arguments); }   // v31: extensions register with HOOK (00c)
function atkBonusBase() { return perkSum('atk') + upgLv(S.equipped.weapon) * 2 + relicV('atk'); }
function timeBonus() { return HOOK.call('timeBonus', timeBonusBase, arguments); }   // v32: gear rolls and pet gear add to these (31)
const timeBonusBase = () => perkSum('time') + relicV('time');
function guardBonus() { return HOOK.call('guardBonus', guardBonusBase, arguments); }
const guardBonusBase = () => perkSum('guard') + relicV('guard');
function healBonus() { return HOOK.call('healBonus', healBonusBase, arguments); }
const healBonusBase = () => perkSum('heal') + relicV('heal');
function coinWinBonus() { return HOOK.call('coinWinBonus', coinWinBonusBase, arguments); }
const coinWinBonusBase = () => perkSum('coin') + relicV('coin');
function heroMaxHP() { return HOOK.call('heroMaxHP', heroMaxHPBase, arguments); }
const heroMaxHPBase = () => Math.round(100 * (1 + perkSum('hp') / 100)) + relicV('hp');

/* the hero strip on the Adventure screen shows the perks */
function heroStripExtra() {
  const lvl = heroLevel(), got = HERO_PERKS.filter(([l]) => lvl >= l).length, nx = HERO_PERKS.find(([l]) => lvl < l), rs = relicActive();
  return `<div class="hs-extra"><button class="hs-perks chip" data-act="perks" aria-label="${esc(t('pk27.open'))}"><span aria-hidden="true">✨</span> ${t('pk27.count', { n: got })}${nx ? `<small>${esc(t('pk27.next', { n: nx[0] }))}</small>` : ''}</button>${rs.map(r => `<span class="hs-relic" title="${esc(relicName(r))}" aria-label="${esc(relicName(r))}">${r.em}</span>`).join('')}</div>`;
}
function overlay27(id, cls) {
  let ov = $('#' + id);
  if (!ov) { ov = document.createElement('div'); ov.className = 'overlay'; ov.id = id; ov.innerHTML = `<div class="mwrap"><button class="mclose" data-act="ov27Close" data-v="${id}" aria-label="Close">✕</button><div class="sheet ${cls}" id="${id}Sheet" role="dialog" aria-modal="true"></div></div>`; document.body.appendChild(ov); }
  return ov;
}
function openPerks() {   // v37.2: a big level, a bar to the next level, the perks you have, and the next one
  const ov = overlay27('perkOverlay', 'perksheet'), lvl = heroLevel(), xp = heroXP(), IC = { hp: '❤️', atk: '⚔️', time: '⏱️', guard: '🛡️', coin: '🪙', heal: '💚' };
  const got = HERO_PERKS.filter(([l]) => lvl >= l), nx = HERO_PERKS.find(([l]) => lvl < l), pc = (xp % 10) * 10;
  const row = ([l, k, v], on) => `<li class="${on ? 'got' : ''}"><span class="pk-ic" aria-hidden="true">${IC[k] || '✨'}</span><b>${esc(perkText(k, v))}</b><span aria-hidden="true">${on ? '✔' : '🔒 ' + t('hero.lvl', { n: l })}</span></li>`;
  $('#perkOverlaySheet').setAttribute('aria-label', t('pk27.title'));
  $('#perkOverlaySheet').innerHTML = `<h2>⭐ ${t('hero.lvl', { n: lvl })}</h2><div class="pk-bar" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${xp % 10}"><i style="width:${pc}%"></i></div>
    <ul class="pk-list">${got.slice(-4).map(r => row(r, true)).join('')}${nx ? row(nx, false) : ''}</ul>`;
  ov.classList.add('on');
}

/* ---------------- chests ---------------- */
function chestGive(n = 1) { S.chestQ = Math.max(0, (S.chestQ || 0) + n); save(); }
const chestBtnHTML = () => (S.chestQ || 0) > 0 ? `<button class="wchip chestbtn" data-act="chestOpen"><span aria-hidden="true">🎁</span> ${t('ch.open')}${S.chestQ > 1 ? ` ×${S.chestQ}` : ''}</button>` : '';
const CHEST_SVG = `<svg class="chest-svg" viewBox="0 0 120 100" aria-hidden="true"><g class="ch-base"><rect x="14" y="46" width="92" height="46" rx="6" fill="#8B4A1F" stroke="#3B1F0C" stroke-width="4"/><rect x="14" y="58" width="92" height="7" fill="#F2B632"/><rect x="52" y="52" width="16" height="20" rx="3" fill="#F2B632" stroke="#7A4A08" stroke-width="3"/><circle cx="60" cy="62" r="3" fill="#3B1F0C"/></g><g class="ch-lid"><path d="M14 48 Q14 18 60 18 Q106 18 106 48 Z" fill="#A5592A" stroke="#3B1F0C" stroke-width="4"/><path d="M30 46 Q30 26 60 26 Q90 26 90 46" fill="none" stroke="#F2B632" stroke-width="6"/></g></svg>`;
function rollRelic() {
  const left = RELICS.filter(r => !relics().includes(r.id)); if (!left.length) return null;
  const w = [60, 30, 10], tot = left.reduce((a, r) => a + w[r.rar], 0); let x = Math.random() * tot;
  for (const r of left) { x -= w[r.rar]; if (x <= 0) return r; }
  return left[left.length - 1];
}
function chestOpen() {
  if (!(S.chestQ > 0)) return;
  const ov = overlay27('chestOverlay', 'chestsheet'), sh = $('#chestOverlaySheet');
  sh.setAttribute('aria-label', t('ch.title'));
  sh.innerHTML = `<h2>🎁 ${t('ch.title')}</h2><p class="sub">${t('ch.tap')}</p><button class="chest" data-act="chestTap" aria-label="${esc(t('ch.tap'))}"><i class="ch-rays" aria-hidden="true"></i>${CHEST_SVG}</button><div class="ch-out" id="chOut" aria-live="polite"></div>`;
  ov.classList.add('on'); sfx.pop && sfx.pop();
}
async function chestTap(btn) {
  if (!btn || btn.dataset.busy || !(S.chestQ > 0)) return; btn.dataset.busy = '1';
  const r = rollRelic(); S.chestQ--;
  if (r) relics().push(r.id); else addCoins(25);
  save();
  if (!S.sensory) { btn.classList.add('shake'); sfx.growl(); await wait(700); }
  btn.classList.remove('shake'); btn.classList.add('open'); sfx.crit(); sfx.win();
  if (!S.sensory) { const b = btn.getBoundingClientRect ? btn.getBoundingClientRect() : null; void b; }
  await wait(S.sensory ? 50 : 450);
  const out = $('#chOut'); if (!out) return;
  out.innerHTML = r
    ? `<div class="relic-card r-${RAR27[r.rar]}"><span class="rc-em" aria-hidden="true">${r.em}</span><small>${t('ch.rar.' + RAR27[r.rar])}</small><b>${esc(relicName(r))}</b><p>${esc(perkText(r.kind, r.v))}</p></div>
      <div class="brief-actions"><button class="btn big" data-act="relicOn" data-v="${r.id}">✔ ${t('ch.use')}</button>${S.chestQ > 0 ? `<button class="btn" data-act="chestOpen">🎁 ${t('ch.another', { n: S.chestQ })}</button>` : ''}<button class="btn ghost" data-act="ov27Close" data-v="chestOverlay">${t('ch.later')}</button></div>`
    : `<div class="relic-card r-epic"><span class="rc-em" aria-hidden="true">🪙</span><b>+25 🪙</b><p>${esc(t('ch.all'))}</p></div><div class="brief-actions"><button class="btn big" data-act="ov27Close" data-v="chestOverlay">${t('ch.yay')}</button></div>`;
  announce(r ? t('ch.got', { n: relicName(r) }) : t('ch.all'), true);
  $$('.chestbtn').forEach(b => { b.outerHTML = chestBtnHTML(); });
}
function relicUse(id) {
  if (!relics().includes(id)) return;
  const act = relicActive().map(r => r.id), was = act.includes(id); let list = act.slice();
  if (was && UI.tab === 'cards') list = list.filter(x => x !== id);   // tapping a worn treasure in the shelf takes it off
  else if (!was) { if (list.length >= relicSlotsN()) list.shift(); list.push(id); }   // full: the one worn longest makes room
  S.relicOn = list[0] || null; S.relicX = list.slice(1); save();
  toast(list.includes(id) ? t('ch.using', { n: relicName(RELIC[id]) }) : t('ch.off'));
  if (list.includes(id) && relicSynV('any')) toast(t('sy.on', { n: relicSynNames().join(', ') }));
  const ov = $('#chestOverlay'); if (ov) ov.classList.remove('on');
  if (UI.tab === 'cards') renderCards();
  if (UI.tab === 'adventure' && !B.active) renderMap();
}
/* the Cards tab gets a Treasures shelf */
function relicsHTML() {
  const own = relics(), act = new Set(relicActive().map(r => r.id));
  const tiles = RELICS.map(r => { const got = own.includes(r.id); return `<button class="relic r-${RAR27[r.rar]} ${got ? '' : 'unknown'} ${act.has(r.id) ? 'on' : ''}" ${got ? `data-act="relicOn" data-v="${r.id}"` : 'disabled'} aria-pressed="${act.has(r.id)}"><span class="rc-em" aria-hidden="true">${got ? r.em : '❔'}</span><b>${got ? esc(relicName(r)) : '???'}</b><small>${got ? esc(perkText(r.kind, r.v)) : t('ch.rar.' + RAR27[r.rar])}</small>${act.has(r.id) ? `<em>${t('ch.inUse')}</em>` : ''}</button>`; }).join('');
  return `<div class="wrap"><div class="dexhead"><button class="btn ghost small" data-act="relicView" data-v="0">← ${t('dx.back')}</button><h2>💎 ${t('ch.shelf')}</h2><p class="sub">${esc(t('ch.shelfSub', { n: own.length, m: RELICS.length }))}</p>${S.chestQ > 0 ? chestBtnHTML() : ''}</div><div class="relicgrid">${tiles}</div></div>`;
}
HOOK.around('renderCards', next => {
  const host = $('#tab-cards'); if (!host) return;
  if (UI.relicView) { host.innerHTML = relicsHTML(); return; }
  next();
  const hd = $('#tab-cards .dexhead');
  if (hd && hd.insertAdjacentHTML && !UI.dexSp) hd.insertAdjacentHTML('beforeend', `<button class="btn relicbtn" data-act="relicView" data-v="1">💎 ${t('ch.shelf')} <small>${relics().length}/${RELICS.length}</small>${S.chestQ > 0 ? ' 🎁' : ''}</button>`);
});

/* ---------------- the armory: weapon upgrades ---------------- */
function upgPanelHTML() {
  const id = S.equipped.weapon, it = ITEM[id]; if (!it) return '';
  const l = upgLv(id), c = upgCost(id), pips = Array.from({ length: UPG_MAX }, (_, i) => `<i class="${i < l ? 'on' : ''}"></i>`).join('');
  const btn = l >= UPG_MAX ? `<button class="btn good" disabled>${t('up.max')}</button>` : S.coins >= c ? `<button class="btn" data-act="upg" data-v="${id}">⚒️ ${t('up.buy', { c })}</button>` : `<button class="btn ghost" disabled>${t('ar.need', { n: c - S.coins })}</button>`;
  return `<div class="upg card"><div><b>⚒️ ${t('up.title')}</b><small>${esc(itemName(it))} · ${t('up.lv', { n: l, m: UPG_MAX })} · ${t('up.each')}</small><span class="upips" aria-hidden="true">${pips}</span></div>${btn}</div>`;
}
HOOK.on('renderArmory', () => {
  if (UI.arm === 'haven') return;
  const top = $('#tab-armory .arm-top'); if (top && top.insertAdjacentHTML) top.insertAdjacentHTML('afterend', upgPanelHTML());
  if (UI.slot === 'weapon') $$('#tab-armory .item[data-v]').forEach(el => { const l = upgLv(el.dataset.v); if (l && el.insertAdjacentHTML) el.insertAdjacentHTML('afterbegin', `<span class="upbadge">⚒️ +${l}</span>`); });
});
function doUpgrade(id) {
  const c = upgCost(id); if (!ITEM[id] || !c || S.coins < c || upgLv(id) >= UPG_MAX) return;
  S.coins -= c; $('#coinVal').textContent = S.coins; upg()[id] = upgLv(id) + 1; save(); sfx.ok();
  logEvent('lg.upg', { name: itemName(ITEM[id]), n: upgLv(id) }); toast(t('up.done', { n: itemName(ITEM[id]), l: upgLv(id) }));
  armKeep(renderArmory); heroPose($('#tab-armory .preview'), 'cheer', 1200);
}

/* ---------------- the "why?" step (age 6 and 7) ---------------- */
const OPS = { '+': (a, b) => a + b, '−': (a, b) => a - b, '-': (a, b) => a - b, '×': (a, b) => a * b, 'x': (a, b) => a * b, '*': (a, b) => a * b, '÷': (a, b) => b && a % b === 0 ? a / b : NaN };
const OPN = { '+': '+', '−': '−', '-': '−', '×': '×', 'x': '×', '*': '×', '÷': '÷' };
/* the reasons to choose from: the true working and two that use the wrong operation */
function whyOptions(q) {
  if (!q || !q.options || ['trace', 'order', 'match', 'phonics'].includes(q.kind)) return null;
  const src = (q.eq || '') + ' ' + (q.text || ''), m = src.match(/(\d+)\s*([+\-−x×÷*])\s*(\d+)\s*(=|\?)/); if (!m) return null;
  const a = +m[1], b = +m[3], op = OPN[m[2]], ans = Number(String(q.options[q.correct]).replace(/\s/g, ''));
  if (!Number.isFinite(ans) || OPS[op](a, b) !== ans) return null;
  const say = (o, r) => `${a} ${o} ${b} = ${r}`, right = say(op, ans), wrong = [];
  ['+', '−', '×', '÷'].filter(o => o !== op).forEach(o => { const r = OPS[o](a, b); if (Number.isInteger(r) && r >= 0 && r !== ans && r <= 999) wrong.push(say(o, ans)); });
  [ans + 1, ans - 1, ans + 2].forEach(r => { if (r >= 0 && wrong.length < 4) wrong.push(say(op, r)); });
  const opts = shuffle([right, ...shuffle([...new Set(wrong)]).slice(0, 2)]);
  return { opts, right: opts.indexOf(right) };
}
const whyOn = () => S.band >= 3 && S.why !== false;
function whyStep(q, tk) {
  if (!whyOn() || !B.active || q !== B.q || (B.lv && B.lv.subj !== 'math' && B.lv.subj !== 'mix')) return Promise.resolve();
  if ((B.whyGap = (B.whyGap || 0) - 1) > 0 || Math.random() > .4) return Promise.resolve();
  const w = whyOptions(q); if (!w) return Promise.resolve();
  B.whyGap = 2;
  return new Promise(res => {
    const a = $('#answers'); if (!a) { res(); return; }
    B.why = { w, res, tk, done: false };
    a.__q = null; a.hidden = false; a.style.gridTemplateColumns = '1fr';
    a.innerHTML = `<div class="whybox" role="group" aria-label="${esc(t('wy.q'))}"><b>🤔 ${t('wy.q')}</b><small>${t('wy.sub')}</small><div class="whyopts">${w.opts.map((o, i) => `<button class="ans why" data-act="whyPick" data-v="${i}" style="--i:${i}">${esc(t('wy.because', { e: o }))}</button>`).join('')}</div></div>`;
    announce(t('wy.q') + ' ' + w.opts.map(o => t('wy.because', { e: o })).join('. '));
    if (S.voice.auto) speak(t('wy.q'));
    setTimeout(() => { if (B.why && B.why.res === res && (B.token !== tk || !B.active)) { B.why = null; res(); } }, 60000);
  });
}
async function whyPick(i) {
  const y = B.why; if (!y || y.done) return; y.done = true;
  const ok = i === y.w.right, btns = $$('#answers .ans.why');
  btns.forEach((b, k) => { b.disabled = true; if (k === y.w.right) b.classList.add('right'); else if (k === i) b.classList.add('nope'); });
  if (ok) { boostBy(1.3); addCoins(2); sfx.ok(); B.whys = (B.whys || 0) + 1; const ph = fx.pos(hs()); fx.num(ph.x, ph.y - ph.h * .7, '🧠 ' + t('wy.smart'), 'combo'); setMsg(t('wy.yes')); }
  else { sfx.soft(); setMsg(t('wy.no', { e: y.w.opts[y.w.right] })); }
  await wait(ok ? 650 : 1500);
  B.why = null; if (B.token === y.tk) renderAnswers();
  y.res();
}

/* ---------------- story skip on replays ---------------- */
const STORY_PRE = { chapter: 'cine5', boss: 'boss4', victory: 'vict', mini: 'mini', rival: 'rival', rivalend: 'rivale', evolve: 'evo' };   // v32: the new story kinds   // v29: new cutscenes
const storyId = (mode, subj, z) => `${mode || 'chapter'}:${S.band}:${subj}:${z}`;
function storySeen(c) { const pre = STORY_PRE[c.mode || 'chapter'], tail = ':' + c.subj + ':' + c.z; return Object.keys(S.comics || {}).some(k => k.startsWith(pre + ':') && k.endsWith(tail)); }
const storySkipOn = c => !!(S.storySkip || {})[storyId(c.mode, c.subj, c.z)];
document.addEventListener('click', e => { const b = e.target && e.target.closest && e.target.closest('[data-act]'); if (b && ['comic', 'bossStory', 'victStory'].includes(b.dataset.act)) UI.storyManual = Date.now(); }, true);
HOOK.claim('openComic', (z, then, subj = UI.subj, mode = 'chapter') => {
  const c = { z, then: then || null, subj, mode }, manual = Date.now() - (UI.storyManual || 0) < 1500;
  if (!manual && storySkipOn(c) && storySeen(c)) {   // the child chose "always skip": mark it seen and carry on
    const S2 = S.comics || (S.comics = {}); S2[storyKeyOf(mode, subj, z)] = 1; save();
    toast(t('sk.auto')); storyDone(c); return true;
  }
  return undefined;
});
HOOK.on('renderComic', () => {
  const c = UI.comic; if (!c || !storySeen(c)) return;
  const top = $('#comicSheet .cn-bar.top'); if (!top || !top.insertAdjacentHTML) return;
  const on = storySkipOn(c);
  top.insertAdjacentHTML('beforeend', `<div class="cn-skip27"><button class="btn small skipnow" data-act="comicSkip">⏭ ${t('sk.skip')}</button><button class="chip" data-act="storyAlways" aria-pressed="${on}">${t('sk.always', { s: t(on ? 'on' : 'off') })}</button></div>`);
});
function storyAlways() {
  const c = UI.comic; if (!c) return; const k = storyId(c.mode, c.subj, c.z), m = S.storySkip || (S.storySkip = {});
  if (m[k]) delete m[k]; else m[k] = 1; save(); renderComic();
  toast(t(m[k] ? 'sk.saved' : 'sk.unsaved'));
}

/* ---------------- parent settings ---------------- */
HOOK.on('renderParent', () => {
  const sc = $('#tab-parent [data-act="sensory"]'), card = sc && sc.closest ? sc.closest('.card') : null; if (!card || !card.insertAdjacentHTML) return;
  card.insertAdjacentHTML('afterend', `<div class="card set27"><h3 style="margin:0 0 8px">🎬 ${t('pp27.title')}</h3><div class="seg">${tog('set27', 'pp27.cine', S.cine !== false).replace('data-act="set27"', 'data-act="set27" data-v="cine"')}${tog('set27', 'pp27.talk', S.talk !== false).replace('data-act="set27"', 'data-act="set27" data-v="talk"')}${tog('set27', 'pp27.tele', S.tele !== false).replace('data-act="set27"', 'data-act="set27" data-v="tele"')}${tog('set27', 'pp27.why', S.why !== false).replace('data-act="set27"', 'data-act="set27" data-v="why"')}</div><p class="sub" style="margin:10px 0 0">${t('pp27.note')}</p></div>`);
});

/* ---------------- battles: health perks, rewards after a win ---------------- */
HOOK.on('startBattle', () => {
  B.hMax = heroMaxHP(); B.hHp = B.hMax; B.whyGap = 1; B.why = null; runCarryHP(); updateHud(); resumeSnap();
});
HOOK.around('win', async next => {
  const lv = B.lv, lvl0 = heroLevel(), bossFirst = !!(lv && lv.boss && !lv.special && !clearAt(lv.subj, lv.n)), tk = B.token;
  if (bossFirst) chestGive(1);
  const bonus = coinWinBonus(); if (bonus) addCoins(bonus);
  const sh = $('#winSheet'); if (sh) sh.innerHTML = '';   // the card is built fresh by win(); if it stays empty the win was interrupted
  await next(); void tk;
  const wl = sh && sh.querySelector ? sh.querySelector('.wline') : null, lvl = heroLevel();
  if (wl && wl.insertAdjacentHTML && !(lv && lv.special)) {
    if (bonus) wl.insertAdjacentHTML('beforeend', `<span class="gain perkgain">+${bonus} 🪙 ✨</span>`);
    if (S.chestQ > 0 && !wl.querySelector('.chestbtn')) wl.insertAdjacentHTML('beforeend', chestBtnHTML());
    const co = coopSummaryHTML(); if (co) wl.insertAdjacentHTML('afterend', co);
  }
  if (lvl > lvl0 && wl && wl.insertAdjacentHTML) {
    const np = HERO_PERKS.filter(([l]) => l > lvl0 && l <= lvl);
    wl.insertAdjacentHTML('afterend', `<p class="lvup"><b>⬆️ ${esc(t('pk27.up', { n: lvl }))}</b>${np.map(([, k, v]) => ` <span>✨ ${esc(perkText(k, v))}</span>`).join('')}</p>`);
    announce(t('pk27.up', { n: lvl }), true);
  }
});
/* auto-resume: offer the saved battle once the game has started */
HOOK.on('bootUI', () => { setTimeout(() => { try { offerResume(); } catch (e) { /* nothing to resume */ } }, 900); });

/* for tests and the debug console: the v27 parts (the older entries of window.__quest stay as they were) */
if (window.__quest) window.__quest.v27 = { teleStart, teleClear, minionWave, specialLevel, mixLevel, heroLevel, perkSum, heroMaxHP, whyOptions, rollRelic, chestGive, startBattle: id => startBattle(id), nextQuestion: f => nextQuestion(f), win: () => win(), camFocus, mTalk, talkLine, rageOf, towerGo, rushGo, offerResume, renderTower };

/* ---------------- events ---------------- */
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'perks': openPerks(); return true;
    case 'ov27Close': { const o = $('#' + v); if (o) o.classList.remove('on'); return true; }
    case 'chestOpen': chestOpen(); return true;
    case 'chestTap': chestTap($('#chestOverlay .chest')); return true;
    case 'relicOn': relicUse(v); return true;
    case 'relicView': UI.relicView = v === '1'; renderCards(); return true;
    case 'upg': doUpgrade(v); return true;
    case 'whyPick': whyPick(+v); return true;
    case 'storyAlways': storyAlways(); return true;
    case 'set27': if (['cine', 'talk', 'tele', 'why'].includes(v)) { S[v] = S[v] === false; save(); renderParent(); if (v === 'cine' && S.cine === false) camReset(); if (v === 'tele' && S.tele === false) teleClear(); } return true;
    case 'tab': if (v !== 'cards') UI.relicView = false; break;
  }
  return undefined;
});

Object.assign(STR, {
  'pk27.hp': ['+{n}% health', '+{n}% nyawa'], 'pk27.atk': ['+{n} attack', '+{n} serangan'], 'pk27.time': ['+{n}% thinking time', '+{n}% masa berfikir'],
  'pk27.guard': ['{n}% less damage', '{n}% kurang kecederaan'], 'pk27.coin': ['+{n} coins per win', '+{n} syiling setiap kemenangan'], 'pk27.heal': ['Heal {n} per right answer', 'Pulih {n} setiap jawapan betul'],
  'pk27.count': ['{n} perks', '{n} kelebihan'], 'pk27.next': ['Next at level {n}', 'Seterusnya pada tahap {n}'], 'pk27.open': ['See hero perks', 'Lihat kelebihan wira'],
  'pk27.title': ['Hero perks', 'Kelebihan wira'], 'pk27.sub': ['Hero level {n}. {x} more XP to the next level. Stars and wins give XP.', 'Tahap wira {n}. {x} XP lagi ke tahap seterusnya. Bintang dan kemenangan memberi XP.'],
  'pk27.up': ['Hero level {n}!', 'Tahap wira {n}!'],
  'ch.title': ['Treasure chest', 'Peti harta'], 'ch.open': ['Open chest', 'Buka peti'], 'ch.tap': ['Tap the chest to open it!', 'Sentuh peti untuk membukanya!'],
  'ch.rar.common': ['Common', 'Biasa'], 'ch.rar.rare': ['Rare', 'Jarang'], 'ch.rar.epic': ['Epic', 'Epik'],
  'ch.use': ['Use it', 'Gunakan'], 'ch.another': ['Open the next chest ({n})', 'Buka peti seterusnya ({n})'], 'ch.later': ['Later', 'Nanti'], 'ch.yay': ['Yay!', 'Hore!'],
  'ch.all': ['You have every treasure! Here are coins instead.', 'Kamu ada semua harta! Ini syiling sebagai ganti.'], 'ch.got': ['You found {n}!', 'Kamu jumpa {n}!'],
  'ch.using': ['Using {n}', 'Menggunakan {n}'], 'ch.off': ['Treasure put away', 'Harta disimpan'], 'ch.inUse': ['In use', 'Sedang digunakan'],
  'ch.shelf': ['Treasures', 'Harta'], 'ch.shelfSub': ['{n} of {m} found. Treasures only come from chests. Tap one to use it.', '{n} daripada {m} dijumpai. Harta hanya datang dari peti. Sentuh satu untuk menggunakannya.'],
  'up.title': ['Upgrade weapon', 'Naik taraf senjata'], 'up.lv': ['Level {n}/{m}', 'Tahap {n}/{m}'], 'up.each': ['+2 attack each level', '+2 serangan setiap tahap'],
  'up.buy': ['Upgrade · {c} 🪙', 'Naik taraf · {c} 🪙'], 'up.max': ['Max level!', 'Tahap maksimum!'], 'up.done': ['{n} is now level {l}!', '{n} kini tahap {l}!'],
  'lg.upg': ['Upgraded {name} to level {n}', 'Naik taraf {name} ke tahap {n}'],
  'wy.q': ['Why is it right?', 'Kenapa betul?'], 'wy.sub': ['Pick the reason for a stronger hit!', 'Pilih sebabnya untuk serangan lebih kuat!'], 'wy.because': ['Because {e}', 'Kerana {e}'],
  'wy.smart': ['Smart!', 'Bijak!'], 'wy.yes': ['Great thinking! Your hit is stronger.', 'Pemikiran hebat! Serangan kamu lebih kuat.'], 'wy.no': ['Your answer was right! The reason is: {e}', 'Jawapan kamu betul! Sebabnya: {e}'],
  'sk.skip': ['Skip story', 'Langkau cerita'], 'sk.always': ['Always skip this story: {s}', 'Sentiasa langkau cerita ini: {s}'], 'sk.auto': ['Story skipped (you chose to skip it)', 'Cerita dilangkau (kamu pilih untuk langkau)'],
  'sk.saved': ['This story will be skipped next time.', 'Cerita ini akan dilangkau lain kali.'], 'sk.unsaved': ['This story will play again.', 'Cerita ini akan dimainkan semula.'],
  'pp27.title': ['Boss battles', 'Pertarungan bos'], 'pp27.cine': ['Boss camera & slow motion: {s}', 'Kamera bos & gerak perlahan: {s}'], 'pp27.talk': ['Monster talk: {s}', 'Raksasa bercakap: {s}'],
  'pp27.tele': ['Charged attacks: {s}', 'Serangan berkuasa: {s}'], 'pp27.why': ['"Why?" questions (age 6–7): {s}', 'Soalan "Kenapa?" (umur 6–7): {s}'],
  'pp27.note': ['Turn off the camera zoom and slow motion if the movement is too much. Calm mode turns all of these off.', 'Matikan zum kamera dan gerak perlahan jika pergerakan terlalu banyak. Mod tenang mematikan semuanya.']
});
