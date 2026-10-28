/* ================= v22: Monster Cards — the collection tab =================
   Beating a level's monster for the first time adds its card (S.dex['subj:n']). The Cards tab groups the
   1000 monsters by species (30 species + the 10 zone bosses). A species stays a dark "?" until its first
   card is won. Inside a species, every card shows the monster, its species, the zone and subject it lives
   in, its tier (Captain = mini-boss, Great = zone boss) and the best goal-stars won against it in any age
   band. New cards wear a "NEW" ribbon until the child opens that species, and the nav button counts them.
   Old saves: every level already cleared gives its card once (dexV). */
const SPECIES_NM = {
  slime: ['Slime', 'Lendir'], goblin: ['Goblin', 'Goblin'], mushroom: ['Mushroom Imp', 'Cendawan Nakal'], wraith: ['Wraith', 'Roh Kabus'],
  golem: ['Golem', 'Golem Batu'], gargoyle: ['Gargoyle', 'Gargoyle'], crystal: ['Crystal Sprite', 'Pari Kristal'], troll: ['Troll', 'Troll'],
  drake: ['Drake', 'Naga Kecil'], shadow: ['Shadow', 'Bayang'],
  mimic: ['Mimic', 'Peti Ajaib'], imp: ['Horned Imp', 'Imp Bertanduk'], dryad: ['Pixie Dryad', 'Pari-pari Hutan'], skeleton: ['Skeleton Warrior', 'Pahlawan Rangka'],
  automaton: ['Clockwork Automaton', 'Robot Jam'], seraph: ['Seraph Sentinel', 'Pengawal Bersayap'], fire: ['Fire Elemental', 'Makhluk Api'],
  cyclops: ['Cyclops', 'Gergasi Mata Satu'], wolf: ['Dire Wolf', 'Serigala Gergasi'], owlbear: ['Owlbear', 'Beruang Burung Hantu'],
  squid: ['Jelly Squid', 'Sotong Jeli'], cactus: ['Cactus Brute', 'Kaktus Perkasa'], bat: ['Vampire Bat', 'Kelawar Taring'], pumpkin: ['Pumpkin Knight', 'Kesatria Labu'],
  yeti: ['Snow Yeti', 'Yeti Salji'], thunderbird: ['Thunderbird', 'Burung Guruh'], crab: ['Robo Crab', 'Ketam Robot'], turtle: ['Shell Knight', 'Kesatria Kura-kura'],
  bee: ['Bee Queen', 'Ratu Lebah'], rex: ['Dino Rex', 'Dino Rex'],
  cupcake: ['Cupcake Critter', 'Makhluk Kek Cawan'], raccoon: ['Bandit Raccoon', 'Rakun Penyamun'], durian: ['Durian Brute', 'Durian Perkasa'], lantern: ['Ghost Lantern', 'Tanglung Hantu'],
  alien: ['Little Alien', 'Makhluk Asing Kecil'], scarecrow: ['Scarecrow', 'Orang-orang'], snail: ['Spiral Snail', 'Siput Pusar'], mole: ['Digger Mole', 'Tikus Mondok Penggali'],
  treant: ['Treant', 'Gergasi Pokok'], frog: ['Frog Warrior', 'Pahlawan Katak'],
  snowman: ['Snow Buddy', 'Kawan Salji'], parrot: ['Pirate Parrot', 'Kakak Tua Lanun'], gnome: ['Gnome Wizard', 'Ahli Sihir Kerdil'], beetle: ['Beetle Knight', 'Kesatria Kumbang'],
  puffer: ['Puffer Fish', 'Ikan Buntal'], croc: ['Sang Buaya', 'Sang Buaya'], tapir: ['Malayan Tapir', 'Tapir Malaya'], wau: ['Wau Spirit', 'Roh Wau Bulan'],
  sheep: ['Cloud Sheep', 'Biri-biri Awan'], teapot: ['Teapot Spirit', 'Roh Teko'],
  jelly: ['Moon Jelly', 'Obor-obor Bulan'], dumpling: ['Dumpling Buddy', 'Kawan Ladu'], mango: ['Mango Sprite', 'Pari Mangga'], moth: ['Moon Moth', 'Rama-rama Bulan'], rocket: ['Rocket Bot', 'Robot Roket'],
  chili: ['Chili Imp', 'Jin Cili'], rafflesia: ['Giant Bloom', 'Bunga Pakma'], icecream: ['Scoop Critter', 'Makhluk Aiskrim'], liondance: ['Lion Dancer', 'Tarian Singa'], luckycat: ['Lucky Cat', 'Kucing Bertuah'],
  firefly: ['Firefly', 'Kelip-kelip'], pangolin: ['Pangolin', 'Tenggiling'], hornbill: ['Hornbill', 'Burung Enggang'], seaturtle: ['Sea Turtle', 'Penyu'], paperlamp: ['Paper Lantern', 'Tanglung Kertas'],
  pineapple: ['Pineapple Guard', 'Pengawal Nanas'], rainsnail: ['Rainbow Snail', 'Siput Pelangi'], clouddragon: ['Cloud Dragon', 'Naga Awan'], cococrab: ['Coconut Crab', 'Ketam Kelapa'], moonrabbit: ['Moon Rabbit', 'Arnab Bulan'],
  boss0: ['Ancient Dragon', 'Naga Purba'], boss1: ['Lich King', 'Raja Tulang'], boss2: ['Stone Titan', 'Titan Batu'], boss3: ['Fiend Lord', 'Raja Bertanduk'],
  boss4: ['Archon', 'Pahlawan Cahaya'], boss5: ['Elemental Lord', 'Raja Unsur'], boss6: ['Fey Queen', 'Ratu Pari-pari'], boss7: ['Chimera', 'Kimera'],
  boss8: ['Clockwork Colossus', 'Gergasi Jam'], boss9: ['Hydra', 'Hidra']
};
const cardSp = m => m.big ? 'boss' + m.arch : (m.sp || MON2.BODY[m.b] || 'slime');
const spName = k => (SPECIES_NM[k] || [k, k])[LI()];
const dexKey = (subj, n) => `${subj}:${n}`;
/* every level monster, grouped by species, in a fixed order: the ten classic, the ten v20, the ten v22, then bosses */
let DEX_ALL = null;
function dexAll() {
  if (DEX_ALL) return DEX_ALL;
  const order = [...Object.values(MON2.BODY), ...Object.values(MALT), ...Object.values(MALT2), ...Object.values(MALT3), ...Object.values(MALT4), ...Object.values(MALT5), ...Object.values(MALT6), ...Array.from({ length: 10 }, (_, i) => 'boss' + i)];
  const by = {}; order.forEach(k => { by[k] = []; });
  SUBJ_ORDER.forEach(s => { for (let n = 1; n <= LEVELS_PER; n++) { const m = monsterFor(s, n), k = cardSp(m); (by[k] || (by[k] = [])).push({ subj: s, n, m }); } });
  return (DEX_ALL = { order: order.filter(k => by[k].length), by });
}
/* the collection itself, created (and filled from old saves) on first use, per child */
function dex() {
  if (!S.dex) S.dex = {};
  if (!S.dexV) {
    Object.keys(S.clear || {}).concat(Object.keys(S.stars || {}).filter(k => S.stars[k] > 0)).forEach(k => {
      const [s, , n] = k.split(':'); if (SUBJ_IDX[s] !== undefined && +n >= 1 && +n <= LEVELS_PER && !S.dex[dexKey(s, n)]) S.dex[dexKey(s, n)] = { t: 0 };
    });
    S.dexV = 1;
  }
  return S.dex;
}
const hasCard = (s, n) => !!dex()[dexKey(s, n)];
/* v24: rarity and foils. Zone bosses are Legendary, captains Epic, and two monsters in every zone (levels ending
   in 3 and 7) are Rare; the rest are Common. A card turns into a shiny FOIL once all three star goals are won
   against that monster (in any age band). */
const RARITY = ['common', 'rare', 'epic', 'legendary'];
const rarityOf = (m, n) => m.big ? 3 : m.boss ? 2 : (n % 10 === 3 || n % 10 === 7) ? 1 : 0;
const isFoil = (s, n) => bits3(dexGoals(s, n)) === 3;
/* called from win() after the goals are saved: true the first time this card becomes a foil */
function dexFoil(lv) {
  if (!lv || lv.steam || SUBJ_IDX[lv.subj] === undefined) return false;
  const e = dex()[dexKey(lv.subj, lv.n)]; if (!e || e.foil || !isFoil(lv.subj, lv.n)) return false;
  e.foil = Date.now(); e.nw = 1; dexBadge(); return true;
}
/* best goals against this monster in any age band */
function dexGoals(s, n) { let g = 0; Object.keys(SAGA).forEach(b => { g |= (S.goals || {})[starKey(s, n, +b)] || 0; }); return g; }
/* called from win(): returns true when the card is new */
function dexAdd(lv) {
  if (!lv || lv.steam || SUBJ_IDX[lv.subj] === undefined) return false;
  const d = dex(), k = dexKey(lv.subj, lv.n); if (d[k]) return false;
  d[k] = { t: Date.now(), nw: 1 }; dexBadge(); return true;
}
const dexNew = () => Object.values(dex()).filter(x => x.nw).length;
function dexBadge() {
  const b = $('#nav-cards'); if (!b) return;
  const n = dexNew(); let i = b.querySelector('.nbadge');
  if (!n) { if (i) i.remove(); return; }
  if (!i) { i = document.createElement('span'); i.className = 'nbadge'; b.appendChild(i); }
  i.textContent = n > 99 ? '99+' : n; i.setAttribute('aria-label', t('dx.newN', { n }));
}
function dexCardHTML(c, big) {
  const { subj, n, m } = c, g = dexGoals(subj, n), sp = cardSp(m), z = Math.floor((n - 1) / 10), em = (SUBJECTS.find(x => x[0] === subj) || [, '❔'])[1];
  const tier = m.big ? 'great' : m.boss ? 'captain' : 'normal', nw = (dex()[dexKey(subj, n)] || {}).nw, r = RARITY[rarityOf(m, n)], foil = bits3(g) === 3;
  return `<article class="mcard ${tier} r-${r} ${foil ? 'foil' : ''}" aria-label="${esc(`${m.n}, ${spName(sp)}, ${t('rr.' + r)}${foil ? ', ' + t('rr.foil') : ''}, ${zoneName(z)}. ${t('map.stars', { n: bits3(g) })}`)}">
    ${nw ? `<span class="mc-new">${t('dx.new1')}</span>` : ''}<span class="mc-tier"><i class="gem" aria-hidden="true"></i>${t('rr.' + r)}</span>
    <div class="mc-art" style="--zbg:url(${PX.bg(z, S.band, !!m.big)})">${lazyMon(m)}${foil ? `<span class="mc-holo" aria-hidden="true"></span><span class="mc-foil">✨ ${t('rr.foil')}</span>` : ''}</div>
    <div class="mc-body"><b class="mc-name">${esc(m.n)}</b><span class="mc-sp">${esc(spName(sp))}</span>
      <span class="mc-zone">🗺️ ${esc(zoneName(z))}</span><span class="mc-subj">${em} ${esc(t('subj.' + subj))} · ${t('dx.lv', { n })}</span>
      <span class="goals mc-goals">${GOALS.map(([b, ic, k]) => `<i class="${g & b ? 'on' : ''}" title="${esc(t(k))}">${ic}</i>`).join('')}</span></div>
  </article>`;
}
function renderCards() { return HOOK.call('renderCards', renderCardsBase, arguments); }   // v31: extensions register with HOOK (00c)
function renderCardsBase() {
  const host = $('#tab-cards'); if (!host) return;
  LAZYM.length = 0;
  const A = dexAll(), d = dex(), total = A.order.reduce((s, k) => s + A.by[k].length, 0), have = Object.keys(d).length;
  const sel = UI.dexSp && A.by[UI.dexSp] ? UI.dexSp : null;
  if (!sel) {
    const tiles = A.order.map(k => {
      const list = A.by[k], got = list.filter(c => hasCard(c.subj, c.n)), rep = got[0] || list[0], known = got.length > 0, nw = got.some(c => (d[dexKey(c.subj, c.n)] || {}).nw);
      const foils = got.filter(c => isFoil(c.subj, c.n)).length;
      return `<button class="sptile ${known ? '' : 'unknown'} ${k.startsWith('boss') ? 'boss' : ''} ${foils ? 'hasfoil' : ''}" data-act="dexSp" data-v="${k}" aria-label="${esc(known ? spName(k) : t('dx.unknown'))}, ${got.length} / ${list.length}">
        ${nw ? `<span class="mc-new">${t('dx.new1')}</span>` : ''}<span class="sp-art">${lazyMon(rep.m)}</span>
        <b>${esc(known ? spName(k) : '???')}</b><span class="sp-bar"><i style="width:${Math.round(got.length / list.length * 100)}%"></i></span><small>${got.length} / ${list.length}${foils ? ` · ✨${foils}` : ''}</small></button>`;
    }).join('');
    host.innerHTML = `<div class="wrap"><div class="dexhead"><h1 class="title">🎴 ${t('dx.title')}</h1><p class="sub">${t('dx.sub')}</p>
      <div class="dexprog" role="img" aria-label="${esc(t('dx.prog', { n: have, m: total }))}"><span class="sp-bar big"><i style="width:${Math.max(have ? 2 : 0, Math.round(have / total * 100))}%"></i></span><b>${have} / ${total}</b></div>
      <p class="dexsum">${t('dx.species', { n: A.order.filter(k => A.by[k].some(c => hasCard(c.subj, c.n))).length, m: A.order.length })}</p>
      <div class="rarebar">${RARITY.map((r, i) => { const all = A.order.flatMap(k => A.by[k]).filter(c => rarityOf(c.m, c.n) === i), got = all.filter(c => hasCard(c.subj, c.n)).length; return `<span class="rchip r-${r}"><i class="gem" aria-hidden="true"></i>${t('rr.' + r)} <b>${got}/${all.length}</b></span>`; }).join('')}<span class="rchip r-foil">✨ ${t('rr.foil')} <b>${Object.keys(d).filter(k => { const [s, n] = k.split(':'); return isFoil(s, +n); }).length}</b></span></div></div>
      <div class="spgrid">${tiles}</div></div>`;
  } else {
    const list = A.by[sel], got = list.filter(c => hasCard(c.subj, c.n)).sort((a, b) => SUBJ_IDX[a.subj] - SUBJ_IDX[b.subj] || a.n - b.n), known = got.length > 0;
    const left = list.length - got.length;
    host.innerHTML = `<div class="wrap"><div class="dexhead"><button class="btn ghost small" data-act="dexBack">← ${t('dx.back')}</button>
      <h2>${esc(known ? spName(sel) : '???')}</h2><p class="sub">${t('dx.have', { n: got.length, m: list.length })}</p></div>
      ${known ? `<div class="mcgrid">${got.map(c => dexCardHTML(c)).join('')}</div>` : `<div class="dexempty"><span class="sp-art unknown">${monsterSVG(list[0].m)}</span><p>${t('dx.none')}</p></div>`}
      ${left && known ? `<p class="dexleft">${t('dx.left', { n: left })}</p>` : ''}</div>`;
    /* opening a species "reads" its new cards */
    let ch = false; got.forEach(c => { const e = d[dexKey(c.subj, c.n)]; if (e && e.nw) { delete e.nw; ch = true; } }); if (ch) { save(); dexBadge(); }
  }  flushLazyMon();   // v26: monsters are drawn after the tab is already on screen
}
function dexEvent(a, v) {
  switch (a) {
    case 'dexSp': UI.dexSp = v; sfx.pop && sfx.pop(); renderCards(); $('#tab-cards').scrollTop = 0; window.scrollTo && window.scrollTo(0, 0); return true;
    case 'dexBack': UI.dexSp = null; renderCards(); return true;
    case 'dexGo': { const lv = B.lv; UI.dexSp = lv && lv.mon ? cardSp(lv.mon) : null; $('#winOverlay').classList.remove('on'); showTab('cards'); return true; }
  }
  return false;
}
setTimeout(dexBadge, 0);
