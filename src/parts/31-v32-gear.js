/* ================= v32: gear rarity and stat rolls, and pet equipment =================
   GEAR ROLLS. Every piece of gear that costs coins (weapons, shields, hats, outfits, capes, boots) has its own roll for
   each child: a rarity (Common, Good, Rare, Epic, Legendary), a small epithet ("of Sparks") and 0 to 3 extra stats
   (damage, health, thinking time, guard, healing, coins). The roll is made the first time the child looks at the item
   (so what you see in the shop is what you get), and is kept in S.gear. It uses a seed that belongs to the child, so two
   children never get the same gear. The 🔨 button re-forges an item you own: the old and the new roll are shown side by
   side and the child keeps the one they like, so a re-forge can never make a child weaker by accident. All the bonuses are
   small and are capped, and nothing is sold for more coins to be stronger: the roll does not depend on the price.
   PET GEAR. Pets can wear a hat, a collar and a back item (bow, party hat, crown ... scarf, medal ... cape, wings ...).
   Each pet remembers its own outfit. Every piece also gives a very small bonus while that pet is the active pet.
   Everything is added through HOOK (00c); see 22 (bonus functions) and 15 (petBase). */
const GEAR_SLOTS = ['weapon', 'shield', 'hat', 'outfit', 'cape', 'boots', 'helmet', 'chest', 'gloves', 'legs'];
const GEAR_RAR = [
  { k: 'common', n: ['Common', 'Biasa'], c: '#9AA3B5', x: 0, w: 50 }, { k: 'good', n: ['Good', 'Baik'], c: '#4CBF7A', x: 1, w: 26 },
  { k: 'rare', n: ['Rare', 'Jarang'], c: '#4B9BFF', x: 1, w: 14 }, { k: 'epic', n: ['Epic', 'Epik'], c: '#B06BFF', x: 2, w: 7 }, { k: 'legend', n: ['Legendary', 'Lagenda'], c: '#FFC933', x: 3, w: 3 }
];
const GEAR_BASE = { atk: 1, hp: 4, time: .02, guard: .01, heal: 1, coin: 1 };
const GEAR_CAP = { atk: 6, hp: 30, time: .25, guard: .1, heal: 3, coin: 6 };   // v38: a weaker hero (was atk 10, hp 40, time .3, guard .15, heal 4, coin 8)
const GEAR_POOL = {
  weapon: ['atk', 'atk', 'time', 'coin', 'heal'], shield: ['guard', 'guard', 'hp', 'heal', 'time'], hat: ['time', 'heal', 'coin', 'hp'],
  outfit: ['hp', 'guard', 'heal'], cape: ['coin', 'time', 'hp'], boots: ['coin', 'heal', 'time'],
  helmet: ['time', 'heal', 'hp', 'coin'], chest: ['hp', 'guard', 'guard', 'heal'], gloves: ['atk', 'coin', 'time', 'heal'], legs: ['hp', 'guard', 'heal', 'coin']
};
const GEAR_EPI = [['of Sparks', 'Percikan'], ['of Courage', 'Keberanian'], ['of the Owl', 'Burung Hantu'], ['of Sunshine', 'Sinaran'], ['of Kindness', 'Kebaikan'], ['of Giggles', 'Ketawa'], ['of Rainbows', 'Pelangi'], ['of the Tiger', 'Harimau'],
  ['of Starlight', 'Cahaya Bintang'], ['of Moonbeams', 'Sinar Bulan'], ['of Mangoes', 'Mangga'], ['of Thunder', 'Guruh'], ['of Bubbles', 'Gelembung'], ['of the Wind', 'Angin'], ['of Wonder', 'Keajaiban'], ['of Friends', 'Sahabat'],
  ['of Cleverness', 'Kebijakan'], ['of Hugs', 'Pelukan'], ['of Fireflies', 'Kelip-kelip'], ['of Treasure', 'Harta']];
const GEAR_BAN = id => /_none$/.test(id);
const isGear = it => !!it && GEAR_SLOTS.includes(it.slot) && it.cost > 0 && !GEAR_BAN(it.id);
function gearHash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function gearRng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t0 = a; t0 = Math.imul(t0 ^ (t0 >>> 15), t0 | 1); t0 ^= t0 + Math.imul(t0 ^ (t0 >>> 7), t0 | 61); return ((t0 ^ (t0 >>> 14)) >>> 0) / 4294967296; }; }
function gearRollFor(id, n) {
  const it = ITEM[id]; if (!S.gearSeed) S.gearSeed = 1 + Math.floor(Math.random() * 2147483000);
  const rnd = gearRng(gearHash(S.gearSeed + ':' + id + ':' + n));
  let x = rnd() * 100, r = 0; for (; r < GEAR_RAR.length - 1; r++) { x -= GEAR_RAR[r].w; if (x <= 0) break; }
  r = Math.max(r, typeof trophyMinR === 'function' ? trophyMinR(id) : 0);   // v35: boss, tower and weekly pieces are never plain
  const pool = GEAR_POOL[it.slot].slice(), s = [], used = new Set();
  for (let i = 0; i < GEAR_RAR[r].x; i++) {
    let k = pool[Math.floor(rnd() * pool.length)], g = 0; while (used.has(k) && g++ < 12) k = pool[Math.floor(rnd() * pool.length)];
    if (used.has(k)) break; used.add(k);
    const tier = 1 + Math.floor(rnd() * (r + 1)), raw = GEAR_BASE[k] * tier, v = k === 'time' || k === 'guard' ? Math.round(raw * 100) / 100 : Math.max(1, Math.round(raw));
    s.push([k, Math.min(v, GEAR_CAP[k] || v)]);
  }
  return { r, e: Math.floor(rnd() * GEAR_EPI.length), s, n };
}
function gearRoll(id) {
  const it = ITEM[id]; if (!isGear(it)) return null;
  const G = S.gear || (S.gear = {}); if (!G[id]) G[id] = gearRollFor(id, 0);
  return G[id];
}
function gearV(kind) {
  let sum = 0;
  GEAR_SLOTS.forEach(slot => { const id = S.equipped && S.equipped[slot], rl = id && gearRoll(id); if (rl) rl.s.forEach(([k, v]) => { if (k === kind) sum += v; }); });
  return Math.min(GEAR_CAP[kind] || 99, sum);
}
const gearRarName = r => GEAR_RAR[r].n[LI()];
const gearEpi = r => GEAR_EPI[r.e][LI()];
const forgeCost = id => { const rl = gearRoll(id); return Math.min(120, 15 + 15 * ((rl && rl.n) || 0) + Math.round(((ITEM[id] && ITEM[id].cost) || 0) * .1)); };
const gearStatsHTML = rl => rl.s.length ? rl.s.map(([k, v]) => `<li>${esc(perkText(k, v))}</li>`).join('') : `<li class="none">${esc(t('v32.gear.plain'))}</li>`;
function gearBadgeHTML(id, rl, mini) {
  const R = GEAR_RAR[rl.r];
  return `<div class="gr r${rl.r}" style="--rc:${R.c}"><span class="gr-r">${'★'.repeat(rl.r + 1)} ${esc(gearRarName(rl.r))}</span><em>${esc(gearEpi(rl))}</em>${mini ? '' : `<ul>${gearStatsHTML(rl)}</ul>`}</div>`;
}
/* the bonuses join the hero's other bonuses (hero level perks, upgrades, treasures) */
['atk:atkBonus', 'time:timeBonus', 'guard:guardBonus', 'heal:healBonus', 'coin:coinWinBonus'].forEach(p => {
  const [k, fn] = p.split(':'); HOOK.filter(fn, v => v + gearV(k) + petGearV(k));
});
HOOK.filter('heroMaxHP', v => v + gearV('hp') + petGearV('hp'));

/* ---------------- the Armory: badges and the re-forge button ---------------- */
function gearDecorate() {
  $$('#tab-armory .items .item[data-v]').forEach(card => {
    const id = card.dataset.v, it = ITEM[id]; if (!isGear(it) || card.querySelector('.gr')) return;
    const rl = gearRoll(id), own = S.owned.includes(id), host = document.createElement('div'); host.className = 'gr-wrap';
    host.innerHTML = gearBadgeHTML(id, rl, false) + (own ? `<button class="btn ghost small gr-forge" data-act="gearForge" data-v="${id}" aria-label="${esc(t('v32.gear.forgeAria', { n: itemName(it) }))}">🔨 ${forgeCost(id)} 🪙</button>` : '');
    card.appendChild(host); card.classList.add('rar' + rl.r);
  });
}
HOOK.on('renderArmory', () => { try { gearDecorate(); petGearDecorate(); } catch (e) { /* never breaks the Armory */ } });
function forgeOverlay() { return overlay27('forgeOverlay', 'forgesheet'); }
function forgeOpen(id, note) {
  const it = ITEM[id]; if (!isGear(it) || !S.owned.includes(id)) return;
  const ov = forgeOverlay(), rl = gearRoll(id), cost = forgeCost(id);
  $('#forgeOverlaySheet').setAttribute('aria-label', t('v32.gear.forge'));
  $('#forgeOverlaySheet').innerHTML = `<h2>🔨 ${esc(itemName(it))}</h2><p class="sub">${esc(note || t('v32.gear.forgeSub'))}</p>
    <div class="fg-one">${gearBadgeHTML(id, rl, false)}</div>
    <div class="brief-actions">${S.coins >= cost ? `<button class="btn big" data-act="gearForgeGo" data-v="${id}">🔨 ${t('v32.gear.forgeGo', { c: cost })}</button>` : `<button class="btn ghost" disabled>${esc(t('ar.need', { n: cost - S.coins }))}</button>`}<button class="btn ghost" data-act="ov27Close" data-v="forgeOverlay">${t('v32.gear.close')}</button></div>`;
  ov.classList.add('on');
}
function forgeGo(id) {
  const it = ITEM[id]; if (!isGear(it) || !S.owned.includes(id)) return;
  const cost = forgeCost(id); if (S.coins < cost) { toast(t('ar.need', { n: cost - S.coins })); return; }
  S.coins -= cost; const cv = $('#coinVal'); if (cv) cv.textContent = S.coins;
  const old = gearRoll(id), nw = gearRollFor(id, old.n + 1); old.alt = nw; save();
  if (typeof sfx.forge === 'function') sfx.forge();
  const sh = $('#forgeOverlaySheet'); if (!sh) return;
  sh.innerHTML = `<h2>🔨 ${esc(itemName(it))}</h2><p class="sub">${esc(t('v32.gear.pick'))}</p>
    <div class="fg-two"><div class="fg-c"><small>${esc(t('v32.gear.old'))}</small>${gearBadgeHTML(id, old, false)}<button class="btn ghost" data-act="gearKeep" data-v="${id}|old">✔ ${t('v32.gear.keepOld')}</button></div>
    <div class="fg-c new"><small>${esc(t('v32.gear.new'))}</small>${gearBadgeHTML(id, nw, false)}<button class="btn" data-act="gearKeep" data-v="${id}|new">✔ ${t('v32.gear.keepNew')}</button></div></div>`;
  setTimeout(() => { if (typeof sfx.rarity === 'function') sfx.rarity(nw.r); }, 250);
  announce(t('v32.gear.pickSr', { o: gearRarName(old.r), n: gearRarName(nw.r) }), true);
}
function forgeKeep(v) {
  const [id, which] = String(v).split('|'), G = S.gear || {}, old = G[id]; if (!old) return;
  if (which === 'new' && old.alt) { const nw = old.alt; delete old.alt; G[id] = nw; toast(t('v32.gear.keptNew', { r: gearRarName(nw.r) })); if (typeof sfx.rarity === 'function') sfx.rarity(nw.r); }
  else { delete old.alt; old.n = (old.n || 0) + 1; toast(t('v32.gear.keptOld')); }
  save(); const ov = $('#forgeOverlay'); if (ov) ov.classList.remove('on');
  if (UI.tab === 'armory') armKeep(renderArmory);
}

/* ---------------- pet gear ---------------- */
const PET_SLOTS = ['head', 'neck', 'back'];
const PET_SLOT_EM = { head: '🎩', neck: '🧣', back: '🦸' };
const PET_GEAR = [
  { id: 'pg_bow', slot: 'head', em: '🎀', n: ['Red Bow', 'Reben Merah'], cost: 20, k: 'time', v: .03 }, { id: 'pg_party', slot: 'head', em: '🥳', n: ['Party Hat', 'Topi Parti'], cost: 25, k: 'coin', v: 1 },
  { id: 'pg_flower', slot: 'head', em: '🌼', n: ['Flower', 'Bunga'], cost: 25, k: 'heal', v: 1 }, { id: 'pg_wiz', slot: 'head', em: '🧙', n: ['Wizard Hat', 'Topi Ahli Sihir'], cost: 45, k: 'time', v: .05 },
  { id: 'pg_halo', slot: 'head', em: '😇', n: ['Little Halo', 'Halo Kecil'], cost: 60, k: 'guard', v: .03 }, { id: 'pg_crown', slot: 'head', em: '👑', n: ['Mini Crown', 'Mahkota Kecil'], cost: 70, k: 'atk', v: 1 },
  { id: 'pg_bell', slot: 'neck', em: '🔔', n: ['Bell Collar', 'Kolar Loceng'], cost: 20, k: 'coin', v: 1 }, { id: 'pg_bandana', slot: 'neck', em: '🏴‍☠️', n: ['Bandana', 'Bandana'], cost: 25, k: 'guard', v: .02 },
  { id: 'pg_scarf', slot: 'neck', em: '🧣', n: ['Cosy Scarf', 'Selendang Selesa'], cost: 30, k: 'guard', v: .03 }, { id: 'pg_bowtie', slot: 'neck', em: '🎩', n: ['Bow Tie', 'Tali Leher Reben'], cost: 35, k: 'hp', v: 5 },
  { id: 'pg_medal', slot: 'neck', em: '🏅', n: ['Gold Medal', 'Pingat Emas'], cost: 55, k: 'atk', v: 1 },
  { id: 'pg_pack', slot: 'back', em: '🎒', n: ['Backpack', 'Beg Galas'], cost: 35, k: 'hp', v: 8 }, { id: 'pg_balloon', slot: 'back', em: '🎈', n: ['Balloon', 'Belon'], cost: 25, k: 'coin', v: 1 },
  { id: 'pg_cape', slot: 'back', em: '🦸', n: ['Hero Cape', 'Jubah Wira'], cost: 40, k: 'atk', v: 1 }, { id: 'pg_wings', slot: 'back', em: '🧚', n: ['Fairy Wings', 'Sayap Pari-pari'], cost: 55, k: 'heal', v: 1 },
  { id: 'pg_rainbow', slot: 'back', em: '🌈', n: ['Rainbow Cape', 'Jubah Pelangi'], cost: 70, k: 'time', v: .05 }
];
const PGEAR = Object.fromEntries(PET_GEAR.map(g => [g.id, g]));
const pgName = g => g.n[LI()];
const petOwn = () => S.petOwn || (S.petOwn = []);
const petWear = p => (S.petGear || (S.petGear = {}))[p] || {};
function petGearV(kind) {
  const p = petOn(); if (!p) return 0; const w = petWear(p); let sum = 0;
  PET_SLOTS.forEach(s => { const g = PGEAR[w[s]]; if (g && g.k === kind) sum += g.v; });
  return sum;
}
/* where each pet's head, neck and back are, in the pet's own drawing space: [head x, head top y, head width, neck x, neck y, back x, back y] */
const PET_ANCHOR = {
  pet_cat: [20.8, 174.2, 24, 29.2, 196.6, 46.2, 191.0], pet_dog: [31.4, 174.9, 24, 37.0, 192.4, 53.9, 189.6], pet_bunny: [29.9, 180.5, 18, 34.9, 198.0, 49.0, 205.0],
  pet_penguin: [27.8, 178.4, 20, 27.8, 196.6, 41.9, 203.6], pet_slime: [34.2, 191.0, 26, 24.3, 212.0, 50.4, 201.5], pet_robot: [34.2, 185.4, 22, 34.2, 199.4, 48.3, 205.0],
  pet_dragon: [27.8, 168.6, 24, 30.6, 193.8, 55.3, 195.2], pet_unicorn: [25.7, 170.7, 22, 32.8, 193.8, 53.9, 198.7], pet_fox: [29.2, 174.2, 24, 29.2, 193.8, 46.9, 195.2],
  pet_hedgehog: [19.4, 189.6, 20, 32.1, 198.7, 49.7, 186.8], pet_turtle: [1.0, 199.4, 14, 10.2, 207.8, 38.4, 189.6], pet_kancil: [24.3, 179.1, 18, 34.2, 195.2, 50.4, 191.7],
  pet_panda: [29.2, 173.5, 26, 32.1, 195.9, 48.3, 195.9], pet_owl: [31.4, 174.9, 28, 31.4, 192.4, 53.9, 199.4], pet_axolotl: [27.1, 181.9, 22, 36.3, 199.4, 52.5, 202.9],
  pet_tiger: [26.4, 173.5, 24, 32.1, 190.3, 53.2, 195.9], pet_whale: [25.7, 184.0, 28, 36.3, 202.9, 46.9, 192.4], pet_phoenix: [22.2, 171.4, 20, 29.2, 185.4, 46.9, 192.4],
  pet_frog: [30.6, 186.1, 26, 30.6, 200.1, 48.3, 196.6], pet_octopus: [34.9, 175.6, 30, 37.0, 210.6, 56.0, 196.6], pet_elephant: [22.9, 179.1, 26, 29.9, 193.1, 52.5, 186.1],
  pet_orangutan: [33.5, 170.0, 24, 33.5, 186.1, 49.7, 189.6], pet_hornbill: [29.9, 175.6, 20, 29.9, 193.1, 57.4, 196.6]
};
const PG_ART = {   // drawn around (0,0); hats sit above it, collars hang from it, back items grow to the right
  pg_bow: '<path d="M0 -3 Q-10 -13 -11 -3 Q-6 2 0 -3 Q6 2 11 -3 Q10 -13 0 -3Z" fill="#FF4F7B" stroke="#C72355" stroke-width="1.2"/><circle cx="0" cy="-3" r="2.6" fill="#FFB3C7"/>',
  pg_party: '<path d="M-8 1 L0 -21 L8 1Z" fill="#A66CFF" stroke="#6E3FC9" stroke-width="1.2"/><path d="M-5 -7 L5 -7 M-3 -13 L3 -13" stroke="#FFE066" stroke-width="2"/><circle cx="0" cy="-22" r="3" fill="#FFE066"/>',
  pg_flower: '<g><circle cx="-5" cy="-2" r="4.2" fill="#FF8FB1"/><circle cx="5" cy="-2" r="4.2" fill="#FF8FB1"/><circle cx="0" cy="-7" r="4.2" fill="#FF8FB1"/><circle cx="0" cy="-1" r="3" fill="#FFE066"/></g>',
  pg_wiz: '<ellipse cx="0" cy="0" rx="12" ry="3.4" fill="#4B3FA8"/><path d="M-7 0 L3 -25 L8 0Z" fill="#5B4FC9" stroke="#3B2F98" stroke-width="1"/><polygon points="1,-12 2.2,-9 5,-9 2.8,-7.4 3.6,-4.6 1,-6.2 -1.6,-4.6 -.8,-7.4 -3,-9 -.2,-9" fill="#FFE066"/>',
  pg_halo: '<ellipse cx="0" cy="-9" rx="9" ry="3" fill="none" stroke="#FFF1A6" stroke-width="4" opacity=".5"/><ellipse cx="0" cy="-9" rx="9" ry="3" fill="none" stroke="#FFD23F" stroke-width="2.4"/>',
  pg_crown: '<path d="M-9 1 L-10 -10 L-4 -5 L0 -13 L4 -5 L10 -10 L9 1Z" fill="#FFD166" stroke="#C9952E" stroke-width="1.2" stroke-linejoin="round"/><circle cx="0" cy="-9" r="1.6" fill="#E5484D"/>',
  pg_bell: '<rect x="-10" y="-3" width="20" height="3.6" rx="1.8" fill="#E5484D"/><circle cx="0" cy="3.4" r="3.6" fill="#FFD166" stroke="#C9952E" stroke-width="1"/><path d="M-1.4 3.6 H1.4" stroke="#8A5A00" stroke-width="1"/>',
  pg_bandana: '<path d="M-10 -3 L10 -3 L0 10Z" fill="#E5484D" stroke="#B3262C" stroke-width="1"/><circle cx="-3" cy="0" r="1" fill="#fff"/><circle cx="3" cy="0" r="1" fill="#fff"/><circle cx="0" cy="4" r="1" fill="#fff"/>',
  pg_scarf: '<rect x="-10" y="-3" width="20" height="5.4" rx="2.7" fill="#3E7BE0"/><path d="M5 1 L8 11 L13 9 L10 0Z" fill="#3E7BE0"/><path d="M-4 -3 V2.4 M2 -3 V2.4" stroke="#fff" stroke-width="1.6"/>',
  pg_bowtie: '<path d="M0 0 L-9 -5.5 L-9 5.5Z M0 0 L9 -5.5 L9 5.5Z" fill="#E5484D" stroke="#B3262C" stroke-width="1"/><circle cx="0" cy="0" r="2.4" fill="#C72355"/>',
  pg_medal: '<path d="M-6 -4 L0 4 L6 -4" stroke="#3E7BE0" stroke-width="3" fill="none" stroke-linejoin="round"/><circle cx="0" cy="7" r="4.4" fill="#FFD166" stroke="#C9952E" stroke-width="1"/><polygon points="0,4.6 1.1,6.5 3.2,6.7 1.6,8.1 2,10.1 0,9.1 -2,10.1 -1.6,8.1 -3.2,6.7 -1.1,6.5" fill="#FFF1A6"/>',
  pg_pack: '<rect x="-4" y="-2" width="13" height="15" rx="4.5" fill="#3E9A4E" stroke="#27682F" stroke-width="1.2"/><rect x="-1.4" y="5" width="8" height="5" rx="2" fill="#7FD6A0"/><path d="M-4 1 Q-8 6 -4 11" stroke="#27682F" stroke-width="1.6" fill="none"/>',
  pg_balloon: '<path d="M0 2 Q4 -8 8 -22" stroke="#9AA3B5" stroke-width="1" fill="none"/><ellipse cx="9" cy="-30" rx="7" ry="9" fill="#FF6FA0" stroke="#C72355" stroke-width="1.2"/><path d="M9 -21 L7 -18 L11 -18Z" fill="#FF6FA0"/><ellipse cx="6.4" cy="-33" rx="1.6" ry="2.6" fill="#fff" opacity=".6"/>',
  pg_cape: '<path d="M-2 -2 Q14 2 19 22 Q9 17 -2 15Z" fill="#E5484D" stroke="#B3262C" stroke-width="1.2" class="m-tail"/><path d="M-2 -2 Q4 4 4 15" stroke="#FF9AA0" stroke-width="1.2" fill="none"/>',
  pg_wings: '<path d="M-1 4 Q16 -16 24 -4 Q15 10 -1 9Z" fill="#CDEBFF" stroke="#8FC8F0" stroke-width="1.2" opacity=".92" class="m-tail"/><path d="M0 9 Q12 8 16 18 Q6 20 0 12Z" fill="#E3F4FF" stroke="#8FC8F0" stroke-width="1" opacity=".92" class="m-tail"/>',
  pg_rainbow: '<g class="m-tail"><path d="M-2 -2 Q14 2 19 22 L-2 15Z" fill="#E5484D"/><path d="M-2 1 Q12 4 16 20 L-2 15Z" fill="#FFB020"/><path d="M-2 5 Q10 7 13 18 L-2 15Z" fill="#4CC38A"/><path d="M-2 9 Q8 10 10 16 L-2 15Z" fill="#4B9BFF"/></g>'
};
function petGearSVG(p) {
  const w = petWear(p), a = PET_ANCHOR[p]; if (!a) return '';
  const sc = Math.max(.45, a[2] / 24);
  return PET_SLOTS.map(s => {
    const g = PGEAR[w[s]]; if (!g) return '';
    const [x, y] = s === 'head' ? [a[0], a[1]] : s === 'neck' ? [a[3] - 2, a[4] + 9] : [a[5] - 3, a[6] + 3], k = s === 'back' ? sc * .82 : s === 'neck' ? sc * .9 : sc;
    return `<g class="pgear pg-${s}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k.toFixed(2)})">${PG_ART[g.id]}</g>`;
  }).join('');
}
HOOK.filter('petBase', (svg, p) => svg ? svg + petGearSVG(p) : svg);

/* the Armory's pet screen: a small panel with what the pet can wear */
function petGearPanelHTML() {
  const p = petOn(); if (!p) return '';
  const w = petWear(p), own = petOwn(), st = petStage(p);
  const rows = PET_SLOTS.map(s => `<div class="pg-row"><span class="pg-h"><span aria-hidden="true">${PET_SLOT_EM[s]}</span> ${esc(t('v32.pg.' + s))}</span><span class="pg-items">${
    PET_GEAR.filter(g => g.slot === s).map(g => {
      const has = own.includes(g.id), on = w[s] === g.id;
      return `<button class="pg ${on ? 'on' : ''} ${has ? '' : 'buy'}" data-act="pgItem" data-v="${g.id}" aria-pressed="${on}" aria-label="${esc(pgName(g) + ' — ' + perkText(g.k, g.v) + (has ? '' : ' — ' + g.cost))}" title="${esc(pgName(g) + ': ' + perkText(g.k, g.v))}"><span class="pg-em" aria-hidden="true">${g.em}</span><small>${on ? '✔' : has ? '' : g.cost + '🪙'}</small></button>`;
    }).join('')}${w[s] ? `<button class="pg off" data-act="pgItem" data-v="off:${s}" aria-label="${esc(t('v32.pg.off'))}"><span class="pg-em" aria-hidden="true">✕</span></button>` : ''}</span></div>`).join('');
  const sum = PET_SLOTS.map(s => PGEAR[w[s]]).filter(Boolean);
  return `<div class="petgear"><h3>🐾 ${esc(t('v32.pg.title', { n: petName(p, st) }))}</h3><p class="sub">${esc(t('v32.pg.sub'))}</p>${rows}${sum.length ? `<ul class="pg-sum">${sum.map(g => `<li>${g.em} ${esc(pgName(g))}: ${esc(perkText(g.k, g.v))}</li>`).join('')}</ul>` : ''}</div>`;
}
function petGearDecorate() {
  const old = $('#tab-armory .petgear'); if (old) old.remove();
  if (UI.slot !== 'pet' || !petOn()) return;
  const host = $('#tab-armory .petstrip'); if (!host) return;
  host.insertAdjacentHTML('afterend', petGearPanelHTML());
}
function pgItem(v) {
  const p = petOn(); if (!p) return;
  const W = (S.petGear || (S.petGear = {})), w = W[p] || (W[p] = {});
  if (String(v).startsWith('off:')) { delete w[String(v).slice(4)]; save(); if (typeof sfx.pick === 'function') sfx.pick(); armKeep(renderArmory); return; }
  const g = PGEAR[v]; if (!g) return;
  if (!petOwn().includes(g.id)) {
    if (S.coins < g.cost) { toast(t('ar.need', { n: g.cost - S.coins })); return; }
    S.coins -= g.cost; const cv = $('#coinVal'); if (cv) cv.textContent = S.coins; petOwn().push(g.id); w[g.slot] = g.id;
    if (typeof sfx.rarity === 'function') sfx.rarity(1); toast(t('v32.pg.bought', { n: pgName(g) }));
  } else if (w[g.slot] === g.id) { delete w[g.slot]; if (typeof sfx.pick === 'function') sfx.pick(); }
  else { w[g.slot] = g.id; if (typeof sfx.pick === 'function') sfx.pick(); }
  save(); armKeep(renderArmory);
}
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'gearForge': forgeOpen(v); return true;
    case 'gearForgeGo': forgeGo(v); return true;
    case 'gearKeep': forgeKeep(v); return true;
    case 'pgItem': pgItem(v); return true;
    default: return undefined;
  }
});

Object.assign(STR, {
  'v32.gear.plain': ['No extra bonus', 'Tiada bonus tambahan'], 'v32.gear.forge': ['Re-forge', 'Tempa semula'], 'v32.gear.forgeAria': ['Re-forge {n}', 'Tempa semula {n}'],
  'v32.gear.forgeSub': ['Re-forge to roll new bonuses. You can keep the old ones if you like them better.', 'Tempa semula untuk bonus baharu. Kamu boleh simpan yang lama jika lebih suka.'],
  'v32.gear.forgeGo': ['Re-forge for {c} 🪙', 'Tempa semula {c} 🪙'], 'v32.gear.close': ['Not now', 'Tidak sekarang'],
  'v32.gear.pick': ['Which one do you keep?', 'Yang mana kamu mahu simpan?'], 'v32.gear.old': ['Old', 'Lama'], 'v32.gear.new': ['New', 'Baharu'],
  'v32.gear.keepOld': ['Keep old', 'Simpan lama'], 'v32.gear.keepNew': ['Keep new', 'Simpan baharu'],
  'v32.gear.pickSr': ['The old one is {o}. The new one is {n}. Choose which to keep.', 'Yang lama {o}. Yang baharu {n}. Pilih yang mana mahu disimpan.'],
  'v32.gear.keptNew': ['New roll kept: {r}!', 'Bonus baharu disimpan: {r}!'], 'v32.gear.keptOld': ['Old roll kept.', 'Bonus lama disimpan.'],
  'v32.pg.head': ['Head', 'Kepala'], 'v32.pg.neck': ['Neck', 'Leher'], 'v32.pg.back': ['Back', 'Belakang'], 'v32.pg.off': ['Take it off', 'Tanggalkan'],
  'v32.pg.title': ['{n}’s gear', 'Pakaian {n}'], 'v32.pg.sub': ['Dress your pet! Each piece gives a small bonus.', 'Pakaikan haiwan kamu! Setiap barang memberi bonus kecil.'],
  'v32.pg.bought': ['{n} bought!', '{n} dibeli!']
});
