/* ================= v35: an Armory with more to find and more to decide =================
   TRAITS     a Rare, Epic or Legendary piece of gear may carry a trait that changes how a fight plays, not only a number:
              Sharp Eye (a first-try answer charges the big hit faster), Dragon Bane (more damage to bosses), Mender
              (heals every 3rd right answer), Brave Heart (stronger when health is low), Calm Mind (more time on puzzle
              questions), Lucky Charm (sometimes finds coins). Which piece has which trait is worked out from the child's own
              gear seed, so it never changes by itself and needs no save change.
   COMPARE    trying something on shows a before/after panel for every stat and trait.
   SOURCES    some gear cannot be bought: zone-boss drops (first win over a zone boss), Tower milestone drops (floors 10, 20,
              30, 50, 75, 100) and a weekly piece (win 5 battles in a week). They are the same gear as the shop sells, with a
              guaranteed Rare-or-better roll and a trait. Pieces the child already owns are never taken away; a child who
              already beat those bosses or floors gets the drop the first time the Armory opens.
   RELICS     more slots (2 at hero level 20, 3 at level 40, see 22) and pairs that give a bonus when worn together.
   EVOLUTION  a weapon at upgrade level 5 can evolve once: +3 attack, a short ceremony, and a gold weapon with sparkles
              in every art style (the '+' on the weapon id is understood by 09, 09b and 09c).
   WARDROBE   a "look" for weapon, shield and cape (and, in the classic art, hat, outfit and boots): the hero WEARS one piece
              while the stats stay with the gear actually worn. Stored in S.wardrobe; drawn by dressEq (09b). */
const GT = [
  { id: 'sharp', em: '🎯', slots: ['weapon', 'boots', 'gloves'] }, { id: 'bane', em: '🐉', slots: ['weapon', 'cape', 'gloves'] }, { id: 'mender', em: '💚', slots: ['shield', 'outfit', 'chest'] },
  { id: 'brave', em: '🦁', slots: ['shield', 'outfit', 'chest', 'legs'] }, { id: 'patient', em: '🧘', slots: ['hat', 'boots', 'helmet'] }, { id: 'lucky', em: '🍀', slots: ['hat', 'cape', 'helmet', 'legs'] }
];
const GT_BY = Object.fromEntries(GT.map(g => [g.id, g]));
/* ---------- where special gear comes from ---------- */
const TROPHY = {
  boss: ['shield_heart', 'weapon_quill', 'cape_ocean', 'shield_star', 'weapon_torch', 'cape_batik', 'shield_batik', 'weapon_rainbow', 'cape_night', 'weapon_starhammer'],   // zone 1 to 10
  tower: [[10, 'cape_feather'], [20, 'shield_moon'], [30, 'weapon_keris'], [50, 'shield_crown'], [75, 'wings_dragon'], [100, 'weapon_sabre']],
  week: ['weapon_trident', 'shield_tiger', 'cape_tiger', 'weapon_crystal', 'shield_crystal', 'cape_checker', 'weapon_lance', 'shield_wave'],
  need: 5   // battles to win in a week
};
const weekNo = () => Math.floor(Date.parse(weekKey() + 'T12:00:00Z') / 6048e5);
const weeklyPiece = () => TROPHY.week[((weekNo() % TROPHY.week.length) + TROPHY.week.length) % TROPHY.week.length];
function trophySrc(id) {
  let z = TROPHY.boss.indexOf(id); if (z >= 0) return { k: 'boss', z };
  const f = TROPHY.tower.find(x => x[1] === id); if (f) return { k: 'tower', f: f[0] };
  if (id === weeklyPiece()) return { k: 'week' };
  return null;
}
function trophyMinR(id) { return trophySrc(id) ? 2 : 0; }
function trophyLocked(id) { return !!trophySrc(id) && !!ITEM[id] && !S.owned.includes(id); }
function weekly() { const w = weekKey(), x = S.weekly; if (!x || x.w !== w) S.weekly = { w, n: 0 }; return S.weekly; }
function trophyLabel(id) {
  const s = trophySrc(id); if (!s) return '';
  if (s.k === 'boss') return t('tr.boss', { z: zoneName(s.z) });
  if (s.k === 'tower') return t('tr.tower', { f: s.f });
  return t('tr.week', { n: Math.min(TROPHY.need, weekly().n), m: TROPHY.need });
}
function trophyGive(id) {
  if (!ITEM[id] || S.owned.includes(id)) return false;
  S.owned.push(id); if (isGear(ITEM[id])) gearRoll(id); save(); return true;
}
/* the drops for what the child has done (called after a win, and when the Armory opens for children who did it before v35) */
function trophyEarn() {
  const got = [];
  TROPHY.boss.forEach((id, z) => { if (!S.owned.includes(id) && SUBJ_ORDER.some(s => clearAt(s, z * 10 + 10))) { if (trophyGive(id)) got.push(id); } });
  const best = Object.values(tower().best || {}).reduce((a, b) => Math.max(a, b), 0);
  TROPHY.tower.forEach(([f, id]) => { if (best >= f && trophyGive(id)) got.push(id); });
  const w = weekly(); if (w.n >= TROPHY.need && trophyGive(weeklyPiece())) got.push(weeklyPiece());
  return got;
}
HOOK.on('win', () => {
  const lv = B.lv; if (!lv) return;
  const w = weekly(); w.n++;
  const got = trophyEarn(); save();
  if (!got.length) return;
  const wl = $('#winSheet .wline');
  if (wl && wl.insertAdjacentHTML) wl.insertAdjacentHTML('afterend', `<p class="tr-got">${got.map(id => `🏆 ${esc(t('tr.got', { n: itemName(ITEM[id]) }))}`).join('<br>')}</p>`);
  sfx.rarity && sfx.rarity(3);
});
HOOK.claim('famEvent', (a, v) => {
  if (a === 'buy' && trophyLocked(v)) { toast(t('tr.locked', { w: trophyLabel(v) })); return true; }
  if (a === 'pvBuy') { const bad = Object.values(UI.pv || {}).find(trophyLocked); if (bad) { toast(t('tr.locked', { w: trophyLabel(bad) })); return true; } }
  return undefined;
});

/* ---------- traits ---------- */
function gearTrait(id) {
  const it = ITEM[id]; if (!isGear(it)) return null;
  const rl = gearRoll(id); if (!rl || rl.r < 2) return null;
  const rnd = gearRng(gearHash(S.gearSeed + ':trait:' + id + ':' + (rl.n || 0)));
  if (rnd() * 100 >= (trophySrc(id) ? 100 : [0, 0, 40, 70, 100][rl.r])) return null;
  const pool = GT.filter(g => g.slots.includes(it.slot)); return pool.length ? pool[Math.floor(rnd() * pool.length)].id : null;
}
const traitsOf = eq => GEAR_SLOTS.map(s => eq && eq[s] && gearTrait(eq[s])).filter(Boolean);
const traitN = id => Math.min(2, traitsOf(S.equipped).filter(x => x === id).length);
const traitText = id => `${GT_BY[id].em} ${t('gt.' + id)}: ${t('gt.' + id + '.d')}`;
HOOK.on('answer:right', () => {
  if (!B.lv || !B.active) return;
  const sh = traitN('sharp'); if (sh && B.wrong === 0) B.charge = Math.min(3, (B.charge || 0) + sh);
  const me = traitN('mender'); if (me && (B.asked + 1) % 3 === 0 && B.hHp < B.hMax) { B.hHp = Math.min(B.hMax, B.hHp + Math.max(1, Math.round(B.hMax * .04 * me))); updateHud(); }
  const lu = traitN('lucky');
  if (lu && Math.random() < .2 * lu) { addCoins(3); if (!S.sensory) { const p = fx.pos(hs()); fx.num(p.x, p.y - p.h * .7, '🍀 +3', 'combo'); } }
});
HOOK.filter('dmgBoost', v => {
  if (!B.active || !B.lv) return v;
  const bn = traitN('bane'), br = traitN('brave');
  return v * (bn && B.lv.boss ? 1 + .12 * bn : 1) * (br && B.hMax && B.hHp / B.hMax <= .35 ? 1 + .15 * br : 1);
});
HOOK.filter('timeBonus', v => { const n = traitN('patient'); return n && B.active && B.q && (B.q.mount || ['order', 'match', 'trace'].includes(B.q.kind)) ? v + .2 * n : v; });

/* ---------- compare ---------- */
function armStats(eq) {
  const bk = S.equipped; S.equipped = eq;
  try { return { atk: atk(), hp: heroMaxHP(), time: Math.round(timeBonus() * 100), guard: Math.round(guardPct() * 100), heal: healBonus(), coin: coinWinBonus(), tr: traitsOf(eq) }; } finally { S.equipped = bk; }
}
const CMP_ROWS = [['atk', '⚔️', ''], ['hp', '❤️', ''], ['time', '⏱️', '%'], ['guard', '🛡️', '%'], ['heal', '💚', ''], ['coin', '🪙', '']];
function compareHTML() {
  const pv = UI.pv || {}; if (!Object.keys(pv).length) return '';
  const a = armStats(S.equipped), b = armStats({ ...S.equipped, ...pv });
  const rows = CMP_ROWS.map(([k, em, u]) => {
    const d = b[k] - a[k], cls = d > 0 ? 'up' : d < 0 ? 'dn' : '';
    return `<li class="${cls}"><span aria-hidden="true">${em}</span><b>${esc(t('cmp.' + k))}</b><span>${a[k]}${u} → ${b[k]}${u}</span><i>${d ? (d > 0 ? '▲ +' : '▼ ') + d + u : '='}</i></li>`;
  }).join('');
  const tr = x => (x.length ? x.map(id => GT_BY[id].em + ' ' + t('gt.' + id)).join(', ') : t('cmp.none'));
  const same = a.tr.join() === b.tr.join();
  return `<section class="cmp" aria-label="${esc(t('cmp.title'))}"><h3>${esc(t('cmp.title'))}</h3><ul>${rows}</ul><p class="cmp-tr ${same ? '' : 'chg'}"><b>${esc(t('cmp.traits'))}</b> ${esc(tr(a.tr))}${same ? '' : ' → ' + esc(tr(b.tr))}</p></section>`;
}
/* ---------- the armory screen: traits, sources, compare, evolution ---------- */
const armGearTab = () => !UI.arm || UI.arm === 'gear';
HOOK.on('renderArmory', () => {
  if (!armGearTab()) return;
  try { const got = trophyEarn(); if (got.length) toast(t('tr.catch', { n: got.length })); } catch (e) { /* never breaks the Armory */ }
  const tab = $('#tab-armory'); if (!tab) return;
  /* traits on the gear cards */
  tab.querySelectorAll('.items .item[data-v]').forEach(card => {
    const id = card.dataset.v, it = ITEM[id]; if (!it) return;
    const gr = card.querySelector('.gr'), tid = isGear(it) ? gearTrait(id) : null;
    if (gr && tid && !gr.querySelector('.gr-trait')) gr.insertAdjacentHTML('beforeend', `<p class="gr-trait"><span aria-hidden="true">${GT_BY[tid].em}</span> <b>${esc(t('gt.' + tid))}</b><small>${esc(t('gt.' + tid + '.d'))}</small></p>`);
    const src = trophySrc(id);
    if (src && !card.querySelector('.tr-src')) {
      card.insertAdjacentHTML('afterbegin', `<span class="tr-src ${S.owned.includes(id) ? 'own' : ''}">🏆 ${esc(trophyLabel(id))}</span>`);
      if (!S.owned.includes(id)) { const b = [...card.querySelectorAll('button')].find(x => x.dataset.act === 'buy' || (x.disabled && x.classList.contains('ghost') && !x.classList.contains('gr-forge'))); if (b) b.outerHTML = `<button class="btn ghost" disabled>🔒 ${esc(t('tr.earn'))}</button>`; }
    }
    if (it.slot === 'weapon' && S.evo && S.evo[id]) card.insertAdjacentHTML('afterbegin', '<span class="upbadge evo" aria-label="evolved">✨</span>');
  });
  /* compare panel (and a buy button that cannot buy a drop) */
  const pvb = tab.querySelector('.pv-banner');
  if (pvb) {
    pvb.insertAdjacentHTML('afterend', compareHTML());
    const bad = Object.values(UI.pv || {}).find(trophyLocked), bb = pvb.querySelector('[data-act="pvBuy"]');
    if (bad && bb) bb.outerHTML = `<button class="btn ghost" disabled>🔒 ${esc(t('tr.earn'))}</button>`;
  }
  /* evolution */
  const up = tab.querySelector('.upg.card'), wid = S.equipped.weapon;
  if (up && ITEM[wid] && upgLv(wid) >= UPG_MAX) {
    const done = !!(S.evo && S.evo[wid]), c = evoCost(wid);
    up.insertAdjacentHTML('afterend', done
      ? `<div class="evo-card done"><b>✨ ${esc(t('evo.done'))}</b><small>${esc(t('evo.doneSub'))}</small></div>`
      : `<div class="evo-card"><div><b>✨ ${esc(t('evo.title'))}</b><small>${esc(t('evo.sub'))}</small></div>${S.coins >= c ? `<button class="btn big" data-act="evoGo" data-v="${wid}">✨ ${esc(t('evo.go', { c }))}</button>` : `<button class="btn ghost" disabled>${esc(t('ar.need', { n: c - S.coins }))}</button>`}</div>`);
  }
});
/* ---------- weapon evolution ---------- */
const evoCost = id => 100 + Math.round(((ITEM[id] && ITEM[id].cost) || 0) * .25);
HOOK.filter('atkBonus', v => v + (S.evo && S.equipped && S.evo[S.equipped.weapon] ? 3 : 0));
function evoGo(id) {
  const it = ITEM[id]; if (!it || it.slot !== 'weapon' || !S.owned.includes(id) || upgLv(id) < UPG_MAX || (S.evo && S.evo[id])) return;
  const c = evoCost(id); if (S.coins < c) { toast(t('ar.need', { n: c - S.coins })); return; }
  S.coins -= c; { const cv = $('#coinVal'); if (cv) cv.textContent = S.coins; }
  const ev = S.evo || (S.evo = {}), ov = overlay27('wevoOverlay', 'evosheet'), sh = $('#wevoOverlaySheet'), eq = S.equipped;
  /* the "before" picture: the weapon without its evolution */
  ev[id] = 0; const before = heroSVG(eq); ev[id] = 1;
  logEvent('lg.evo', { name: itemName(it) }); save();
  sh.setAttribute('aria-label', t('evo.title'));
  sh.innerHTML = `<h2>✨ ${esc(itemName(it))}</h2><div class="evo-stage charge" id="evoStage"><i class="evo-rays" aria-hidden="true"></i><div class="evo-hero" id="evoHero">${before}</div></div><p class="sub" id="evoMsg" aria-live="polite">${esc(t('evo.charging'))}</p><div class="brief-actions" id="evoBtns"></div>`;
  ov.classList.add('on'); sfx.pop && sfx.pop();
  const finish = () => {
    const st = $('#evoStage'), hh = $('#evoHero'); if (!st || !hh) return;
    hh.innerHTML = heroSVG(eq); st.classList.remove('charge'); st.classList.add('flash');
    sfx.crit && sfx.crit(); sfx.win && sfx.win(); setTimeout(() => sfx.rarity && sfx.rarity(4), 250);
    if (!S.sensory) { const b = st.getBoundingClientRect(); fx.burst(b.left + b.width / 2, b.top + b.height / 2, 40, ['✨', '⭐', '🌟', '💫']); }
    $('#evoMsg').textContent = t('evo.done2', { n: itemName(it) });
    $('#evoBtns').innerHTML = `<button class="btn big" data-act="ov27Close" data-v="wevoOverlay">${esc(t('evo.ok'))}</button>`;
    announce(t('evo.done2', { n: itemName(it) }), true);
    if (UI.tab === 'armory') armKeep(renderArmory);
  };
  if (S.sensory) finish(); else setTimeout(finish, 1700);
}
/* ---------- relic pairs ---------- */
const SYN = [['r_owl', 'r_hourglass', 'time', .05], ['r_fang', 'r_bell', 'atk', 2], ['r_heart', 'r_mushroom', 'hp', 8], ['r_acorn', 'r_leaf', 'coin', 2],
  ['r_shell', 'r_rainbow', 'guard', .03], ['r_moon', 'r_drop', 'heal', 1], ['r_star', 'r_key', 'atk', 3], ['r_gem', 'r_dice', 'coin', 3]];
function relicSynList() { const ids = relicActive().map(r => r.id); return SYN.filter(([a, b]) => ids.includes(a) && ids.includes(b)); }
function relicSynV(kind) { const L = relicSynList(); return kind === 'any' ? L.length : L.reduce((s, x) => s + (x[2] === kind ? x[3] : 0), 0); }
function relicSynNames() { return relicSynList().map(([a, b]) => relicName(RELIC[a]) + ' + ' + relicName(RELIC[b])); }
HOOK.on('renderCards', () => {
  if (!UI.relicView) return;
  const hd = $('#tab-cards .dexhead'); if (!hd || !hd.insertAdjacentHTML) return;
  const act = relicActive(), n = relicSlotsN(), act2 = new Set(act.map(r => r.id));
  const slots = Array.from({ length: 3 }, (_, i) => i < n ? `<span class="rs ${act[i] ? 'full' : ''}" aria-label="${esc(act[i] ? relicName(act[i]) : t('sy.empty'))}">${act[i] ? act[i].em : '＋'}</span>` : `<span class="rs lock" aria-label="${esc(t('sy.lock', { n: i === 1 ? 20 : 40 }))}">🔒<small>${t('hero.lvl', { n: i === 1 ? 20 : 40 })}</small></span>`).join('');
  const syn = SYN.filter(([a, b]) => relics().includes(a) || relics().includes(b)).map(([a, b, k, v]) => `<li class="${act2.has(a) && act2.has(b) ? 'on' : ''}"><span aria-hidden="true">${RELIC[a].em}+${RELIC[b].em}</span> ${esc(relicName(RELIC[a]))} + ${esc(relicName(RELIC[b]))}: <b>${esc(perkText(k, v))}</b></li>`).join('');
  hd.insertAdjacentHTML('afterend', `<div class="relic-slots"><b>${esc(t('sy.slots', { n, m: 3 }))}</b><div class="rs-row">${slots}</div>${syn ? `<h3>🔗 ${esc(t('sy.title'))}</h3><ul class="syn">${syn}</ul>` : ''}</div>`);
});
/* ---------- the wardrobe ---------- */
const WD_SLOTS = () => (S.pixel ? ['weapon', 'shield', 'cape'] : ['weapon', 'shield', 'hat', 'outfit', 'cape', 'boots']);
function markMe(o) { try { Object.defineProperty(o, '__me', { value: 1 }); } catch (e) { /* ignore */ } return o; }
function renderWardrobe() {
  const wd = S.wardrobe || {}, look = markMe({ ...S.equipped });
  const rows = WD_SLOTS().map(s => {
    const mine = ITEMS.filter(i => i.slot === s && S.owned.includes(i.id)), worn = ITEM[S.equipped[s]];
    return `<div class="wd-row"><h3><span aria-hidden="true">${SLOT_EM[s]}</span> ${t('sl.' + s)}</h3><div class="wd-chips" role="group" aria-label="${esc(t('sl.' + s))}">
      <button class="chip" data-act="wdSet" data-v="${s}|" aria-pressed="${!wd[s]}">${esc(t('wd.same'))}${worn ? ` <small>(${esc(itemName(worn))})</small>` : ''}</button>
      ${mine.map(i => `<button class="chip" data-act="wdSet" data-v="${s}|${i.id}" aria-pressed="${wd[s] === i.id}">${esc(itemName(i))}</button>`).join('')}</div></div>`;
  }).join('');
  $('#tab-armory').innerHTML = `<div class="wrap">${armTabs()}<h1 class="title">👗 ${t('wd.title')}</h1><p class="sub">${esc(t('wd.sub'))}</p>
    <div class="wd-top"><div class="preview wd-prev" data-act="pose" aria-label="${esc(t('ar.pose'))}">${heroSVG(look)}</div><p class="wd-note">${esc(t('wd.note'))}</p></div>${rows}</div>`;
  flushLazy();
}
HOOK.claim('renderArmory', () => { if (UI.arm === 'wd') { renderWardrobe(); return true; } });
function wdSet(v) {
  const [s, id] = String(v).split('|'); if (!WD_SLOTS().includes(s)) return;
  const w = S.wardrobe || (S.wardrobe = {});
  if (!id) delete w[s]; else if (ITEM[id] && ITEM[id].slot === s && S.owned.includes(id)) w[s] = id; else return;
  if (!Object.keys(w).length) delete S.wardrobe;
  save(); sfx.pop && sfx.pop(); armKeep(renderArmory); heroPose($('#tab-armory .wd-prev'), 'cheer', 900);
}
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'evoGo': evoGo(v); return true;
    case 'wdSet': wdSet(v); return true;
  }
  return undefined;
});

Object.assign(STR, {
  'gt.sharp': ['Sharp Eye', 'Mata Tajam'], 'gt.sharp.d': ['A first-try answer charges your big hit faster.', 'Jawapan cuba pertama mengecas serangan besar lebih cepat.'],
  'gt.bane': ['Dragon Bane', 'Penumpas Naga'], 'gt.bane.d': ['Hits bosses 12% harder.', 'Memukul bos 12% lebih kuat.'],
  'gt.mender': ['Mender', 'Penyembuh'], 'gt.mender.d': ['Heals a little every 3rd right answer.', 'Pulih sedikit setiap jawapan betul ke-3.'],
  'gt.brave': ['Brave Heart', 'Hati Berani'], 'gt.brave.d': ['15% stronger hits when your health is low.', 'Serangan 15% lebih kuat apabila nyawa rendah.'],
  'gt.patient': ['Calm Mind', 'Fikiran Tenang'], 'gt.patient.d': ['20% more time on puzzle questions.', '20% lebih masa untuk soalan teka-teki.'],
  'gt.lucky': ['Lucky Charm', 'Azimat Bertuah'], 'gt.lucky.d': ['Sometimes finds 3 coins after a right answer.', 'Kadangkala menjumpai 3 syiling selepas jawapan betul.'],
  'cmp.title': ['Compare with what you wear', 'Banding dengan yang kamu pakai'], 'cmp.atk': ['Attack', 'Serangan'], 'cmp.hp': ['Health', 'Nyawa'], 'cmp.time': ['Time', 'Masa'], 'cmp.guard': ['Guard', 'Pelindung'],
  'cmp.heal': ['Healing', 'Pemulihan'], 'cmp.coin': ['Coins', 'Syiling'], 'cmp.traits': ['Traits:', 'Sifat:'], 'cmp.none': ['none', 'tiada'],
  'tr.boss': ['Dropped by the boss of {z}', 'Dijatuhkan oleh bos {z}'], 'tr.tower': ['Tower reward: floor {f}', 'Ganjaran menara: tingkat {f}'], 'tr.week': ['This week: win {n}/{m} battles', 'Minggu ini: menang {n}/{m} pertarungan'],
  'tr.earn': ['Earn it', 'Dapatkan melalui permainan'], 'tr.locked': ['This one cannot be bought. {w}', 'Yang ini tidak boleh dibeli. {w}'], 'tr.got': ['New gear: {n}!', 'Peralatan baharu: {n}!'],
  'tr.catch': ['{n} special gear unlocked from your past wins!', '{n} peralatan istimewa dibuka daripada kemenangan lalu kamu!'],
  'evo.title': ['Evolve this weapon', 'Evolusikan senjata ini'], 'evo.sub': ['One time only: +3 attack and a golden look.', 'Sekali sahaja: +3 serangan dan rupa keemasan.'], 'evo.go': ['Evolve ({c} 🪙)', 'Evolusi ({c} 🪙)'],
  'evo.done': ['Evolved!', 'Telah berevolusi!'], 'evo.doneSub': ['+3 attack. It shines gold.', '+3 serangan. Ia bersinar emas.'], 'evo.charging': ['The weapon begins to glow…', 'Senjata mula bercahaya…'],
  'evo.done2': ['{n} evolved! +3 attack.', '{n} telah berevolusi! +3 serangan.'], 'evo.ok': ['Wonderful!', 'Hebat!'], 'lg.evo': ['Evolved {name}', 'Mengevolusikan {name}'],
  'sy.slots': ['Treasure slots: {n} of {m}', 'Slot harta: {n} daripada {m}'], 'sy.empty': ['Empty slot', 'Slot kosong'], 'sy.lock': ['Opens at hero level {n}', 'Dibuka pada tahap wira {n}'],
  'sy.title': ['Pairs that work together', 'Pasangan yang bekerjasama'], 'sy.on': ['Pair bonus: {n}', 'Bonus pasangan: {n}'],
  'wd.tab': ['Wardrobe', 'Almari'], 'wd.title': ['Wardrobe', 'Almari'], 'wd.sub': ['Choose how your hero looks. Only the picture changes.', 'Pilih rupa wira kamu. Hanya gambar yang berubah.'],
  'wd.same': ['Same as my gear', 'Sama seperti peralatan saya'], 'wd.note': ['Your power comes from the gear you really wear in the Gear tab.', 'Kekuatan kamu datang daripada peralatan yang sebenar-benarnya dipakai di tab Peralatan.']
});
if (window.__quest) window.__quest.v35 = Object.assign(window.__quest.v35 || {}, { arm: { gearTrait, traitsOf, armStats, trophySrc, trophyEarn, weeklyPiece, trophyLocked, evoGo, evoCost, relicSynList, relicSynV, wdSet, TROPHY, GT, SYN } });
