/* ================= v36: story choices that change the next land =================
   A fork in a chapter story used to give a small coin reward and nothing else. Now each choice also picks a TWIST for the
   NEXT zone of that subject (the choice in zone 10 shapes zone 10 itself, the last land). The twist is kept in
   S.pathFx = { 'math:3': { id, z, used } } and shows as a chip on every fight in that land:
     ally    🛟  the first mistake in each fight does not hurt
     bounty  💰  every win gives extra coins
     swift   🪶  25% more thinking time
     bold    ⚔️  tougher foes (+25% health) and a big coin bonus
     charge  ⚡  a right first try charges the super move faster
     heal    🍎  a little healing after each right answer
     relic   🎁  the first win in that land lets the child choose 1 of 2 treasures
   PATH_MAP lists, for each zone, what the "A" and the "B" choice lead to. Nothing is lost by either choice. */
const PATH_MAP = [['ally', 'relic'], ['swift', 'heal'], ['ally', 'relic'], ['bold', 'heal'], ['bounty', 'swift'], ['heal', 'charge'], ['charge', 'relic'], ['swift', 'ally'], ['ally', 'bounty'], ['relic', 'bold']];
const PATH_FX = { ally: '🛟', bounty: '💰', swift: '🪶', bold: '⚔️', charge: '⚡', heal: '🍎', relic: '🎁' };
const pathMap = () => (S.pathFx && typeof S.pathFx === 'object' ? S.pathFx : (S.pathFx = {}));
const pathTarget = z => Math.max(0, Math.min(9, (z | 0) + 1));
const pathKey = (subj, z) => subj + ':' + z;
function pathOf(lv) {   // the twist active on this level, or null
  if (!lv || lv.special || lv.steam || lv.z == null || !SUBJ_ORDER.includes(lv.subj)) return null;
  return pathMap()[pathKey(lv.subj, lv.z)] || null;
}
const pathNow = () => pathOf(B.lv);
function pathPick(c, k) {   // called when a fork is chosen in a chapter story
  if (!c || c.mode && c.mode !== 'chapter' || !SUBJ_ORDER.includes(c.subj)) return null;
  const pair = PATH_MAP[c.z | 0]; if (!pair) return null;
  const id = pair[k === 'b' ? 1 : 0], key = pathKey(c.subj, pathTarget(c.z)), old = pathMap()[key];
  if (old && old.used) return old;   // a treasure that was already taken stays taken
  pathMap()[key] = { id, z: c.z | 0, used: 0 }; save(); return pathMap()[key];
}
function pathNote(k) {   // the line added to the result of a choice
  const c = UI.comic; if (!c || !SUBJ_ORDER.includes(c.subj) || (c.mode && c.mode !== 'chapter')) return '';
  const pair = PATH_MAP[c.z | 0]; if (!pair) return '';
  const id = pair[k === 'b' ? 1 : 0];
  return ' ' + PATH_FX[id] + ' ' + t(c.z >= 9 ? 'v36.path.here' : 'v36.path.next', { n: t('v36.fx.' + id), d: t('v36.fx.' + id + '.d') });
}

/* ---------- the effects ---------- */
HOOK.filter('timeBonus', v => { const p = pathNow(); return p && p.id === 'swift' && B.lv ? v + .25 : v; });
HOOK.on('startBattle', () => {
  B.allyUsed = false;
  const lv = B.lv, p = pathOf(lv), old = $('#pathChip'); if (old) old.remove();
  if (!p || !lv) return;
  if (p.id === 'bold' && B.mMax) { B.mMax = Math.round(B.mMax * 1.25); B.mHp = B.mMax; if (typeof updateHud === 'function') updateHud(); }
  const pn = $('#placeName'); if (pn) pn.insertAdjacentHTML('beforeend', ` <span id="pathChip" class="tw-chip path" title="${esc(t('v36.fx.' + p.id + '.d'))}">${PATH_FX[p.id]} ${esc(t('v36.fx.' + p.id))}</span>`);
  if (!p.seen) { p.seen = 1; save(); announce(t('v36.fx.' + p.id) + '. ' + t('v36.fx.' + p.id + '.d'), true); if (!S.sensory) toast(PATH_FX[p.id] + ' ' + t('v36.fx.' + p.id)); }
});
HOOK.claim('enemyStrike', () => {   // the helper: the first mistake in each fight does not hurt
  const p = pathNow(); if (!p || p.id !== 'ally' || B.allyUsed || B.forgave) return undefined;
  B.allyUsed = true; B.locked = false; setMsg(t('v36.ally.say')); sfx.ok();
  const pm = fx.pos(hs()); if (!S.sensory) fx.num(pm.x, pm.y - pm.h * .6, '🛟', 'warn');
  return Promise.resolve();
});
HOOK.on('answer:right', () => {
  const p = pathNow(); if (!p || !B.active) return;
  if (p.id === 'charge' && B.wrong === 0) B.charge = Math.min(3, (B.charge || 0) + 1);
  if (p.id === 'heal' && B.hHp < B.hMax) { B.hHp = Math.min(B.hMax, B.hHp + Math.max(1, Math.round(B.hMax * .04))); updateHud(); }
});
HOOK.on('win', () => {
  const lv = B.lv, p = pathOf(lv); if (!p) return;
  const w = $('#winSheet .wline'); if (!w) return;
  let gain = 0;
  if (p.id === 'bounty') gain = lv.big ? 10 : lv.mini ? 7 : 5;
  if (p.id === 'bold') gain = lv.big ? 16 : lv.mini ? 11 : 8;
  if (gain) { addCoins(gain); save(); w.insertAdjacentHTML('beforeend', `<span class="gain path">${PATH_FX[p.id]} +${gain} 🪙</span>`); }
  if (p.id === 'relic' && !p.used) w.insertAdjacentHTML('beforeend', `<button class="wchip pathbtn" data-act="pathRelic"><span aria-hidden="true">🎁</span> ${esc(t('v36.relic.btn'))}</button>`);
});

/* ---------- the treasure choice (1 of 2) ---------- */
function pathRoll2(own) {
  const left = RELICS.filter(r => !relics().includes(r.id)), w = [60, 30, 10], out = [];
  const pool = left.slice(); const rnd = own || Math.random;
  while (out.length < 2 && pool.length) {
    const tot = pool.reduce((a, r) => a + w[r.rar], 0); let x = rnd() * tot, i = 0;
    for (; i < pool.length - 1; i++) { x -= w[pool[i].rar]; if (x <= 0) break; }
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}
function pathRelicSheet(p) {
  p = p || pathNow(); if (!p || p.id !== 'relic' || p.used) return false;
  if (!p.offer || !p.offer.length || p.offer.some(id => relics().includes(id))) { p.offer = pathRoll2().map(r => r.id); save(); }
  const ov = overlay27('pathOverlay', 'chestsheet'), sh = $('#pathOverlaySheet'); if (!ov || !sh) return false;
  sh.setAttribute('aria-label', t('v36.relic.title'));
  const cards = p.offer.map(id => RELIC[id]).filter(Boolean);
  sh.innerHTML = `<h2>🎁 ${esc(t('v36.relic.title'))}</h2><p class="sub">${esc(t('v36.relic.sub'))}</p><div class="tw-cards path-cards">${cards.map(r => `<button class="relic-card r-${RAR27[r.rar]} path-card" data-act="pathRelicPick" data-v="${r.id}"><span class="rc-em" aria-hidden="true">${r.em}</span><small>${esc(t('ch.rar.' + RAR27[r.rar]))}</small><b>${esc(relicName(r))}</b><p>${esc(perkText(r.kind, r.v))}</p></button>`).join('')}</div>${cards.length ? '' : `<div class="brief-actions"><button class="btn big" data-act="pathRelicPick" data-v="coins">+25 🪙</button></div>`}`;
  ov.classList.add('on'); sfx.pop && sfx.pop(); return true;
}
function pathRelicPick(id) {
  const p = pathNow() || Object.values(pathMap()).find(x => x && x.id === 'relic' && !x.used); if (!p || p.used) return false;
  if (id === 'coins' || !RELIC[id]) { addCoins(25); toast('+25 🪙'); }
  else { if (!relics().includes(id)) relics().push(id); toast(t('ch.got', { n: relicName(RELIC[id]) })); }
  p.used = 1; p.offer = null; save(); sfx.crit && sfx.crit();
  const ov = $('#pathOverlay'); if (ov) ov.classList.remove('on');
  $$('.pathbtn').forEach(b => b.remove());
  return true;
}
HOOK.claim('famEvent', (a, v) => {
  if (a === 'pathRelic') { pathRelicSheet(); return true; }
  if (a === 'pathRelicPick') { pathRelicPick(v); return true; }
  return undefined;
});

Object.assign(STR, {
  'v36.path.next': ['Next land: {n}. {d}', 'Negeri seterusnya: {n}. {d}'], 'v36.path.here': ['In this last land: {n}. {d}', 'Di negeri terakhir ini: {n}. {d}'],
  'v36.ally.say': ['🛟 Your helper stepped in! That mistake did not hurt.', '🛟 Pembantu kamu membantu! Kesilapan itu tidak mencederakan.'],
  'v36.fx.ally': ['Helper', 'Pembantu'], 'v36.fx.ally.d': ['The first mistake in each fight does not hurt.', 'Kesilapan pertama dalam setiap pertarungan tidak mencederakan.'],
  'v36.fx.bounty': ['Bounty', 'Ganjaran'], 'v36.fx.bounty.d': ['Every win gives extra coins.', 'Setiap kemenangan memberi syiling tambahan.'],
  'v36.fx.swift': ['Steady Mind', 'Fikiran Tenang'], 'v36.fx.swift.d': ['You get 25% more time to think.', 'Kamu mendapat 25% lebih masa untuk berfikir.'],
  'v36.fx.bold': ['Bold Road', 'Jalan Berani'], 'v36.fx.bold.d': ['Tougher foes, but many more coins.', 'Musuh lebih kuat, tetapi lebih banyak syiling.'],
  'v36.fx.charge': ['Spark Trail', 'Laluan Percikan'], 'v36.fx.charge.d': ['Right first tries charge your super move faster.', 'Jawapan betul pada cubaan pertama mengecas serangan super lebih cepat.'],
  'v36.fx.heal': ['Healing Spring', 'Mata Air Penyembuh'], 'v36.fx.heal.d': ['You heal a little after each right answer.', 'Kamu pulih sedikit selepas setiap jawapan betul.'],
  'v36.fx.relic': ['Treasure Hunt', 'Pemburuan Harta'], 'v36.fx.relic.d': ['Win a fight there and pick 1 of 2 treasures.', 'Menang satu pertarungan di sana dan pilih 1 daripada 2 harta.'],
  'v36.relic.btn': ['Pick your treasure', 'Pilih harta kamu'], 'v36.relic.title': ['Pick one treasure', 'Pilih satu harta'], 'v36.relic.sub': ['You found two. Keep the one you like.', 'Kamu jumpa dua. Simpan yang kamu suka.']
});
if (window.__quest) window.__quest.v36 = Object.assign(window.__quest.v36 || {}, { PATH_MAP, PATH_FX, pathOf, pathPick, pathNote, pathRelicSheet, pathRelicPick, pathRoll2, pathMap });
