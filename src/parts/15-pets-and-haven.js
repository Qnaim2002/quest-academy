/* ================= v7: pets (XP, evolution, perks) ================= */
const PET_STAGES = [0, 40, 120], PET_MULT = [1, 1.6, 2.4];
const PET_PERK = {
  pet_cat: ['atk', 2], pet_dog: ['guard', .06], pet_bunny: ['time', .12], pet_penguin: ['heal', 2], pet_slime: ['coin', 1], pet_robot: ['atk', 2],
  pet_dragon: ['atk', 3], pet_unicorn: ['heal', 3], pet_fox: ['coin', 1], pet_panda: ['guard', .07], pet_turtle: ['guard', .09], pet_hedgehog: ['atk', 2],
  pet_tiger: ['atk', 3], pet_axolotl: ['heal', 2], pet_kancil: ['time', .14], pet_owl: ['time', .16], pet_phoenix: ['heal', 4], pet_whale: ['coin', 1],
  pet_frog: ['time', .13], pet_octopus: ['heal', 2], pet_elephant: ['guard', .08], pet_orangutan: ['coin', 1], pet_hornbill: ['atk', 3]   // v25
};
const petOn = () => S.equipped.pet && S.equipped.pet !== 'pet_none' ? S.equipped.pet : null;
const petXPof = id => (S.petXP && S.petXP[id]) || 0;
const petStage = id => { const x = petXPof(id); return x >= PET_STAGES[2] ? 3 : x >= PET_STAGES[1] ? 2 : 1; };
function petName(id, stage = petStage(id)) {
  const it = ITEM[id], base = itemName(it);
  if (stage === 1) return base;
  if (id === 'pet_dragon') return t('pet.dragon' + stage);
  return t('pet.s' + stage, { n: base });
}
function petPerkVal(id, stage = petStage(id)) {
  const pk = PET_PERK[id]; if (!pk) return null; const raw = pk[1] * PET_MULT[stage - 1];
  return { type: pk[0], v: pk[0] === 'guard' || pk[0] === 'time' ? raw : Math.max(1, Math.round(raw)) };
}
function petPerkText(id, stage = petStage(id)) {
  const p = petPerkVal(id, stage); if (!p) return '';
  return t('pet.perk.' + p.type, { n: p.type === 'guard' || p.type === 'time' ? Math.round(p.v * 100) : p.v });
}
const perk = type => { const id = petOn(); if (!id) return 0; const p = petPerkVal(id); return p && p.type === type ? p.v : 0; };
const petGuard = () => perk('guard');
function petProgress(id) {
  const x = petXPof(id), st = petStage(id);
  if (st >= 3) return { pct: 100, txt: t('pet.max') };
  const lo = PET_STAGES[st - 1], hi = PET_STAGES[st];
  return { pct: Math.round((x - lo) / (hi - lo) * 100), txt: t('pet.next', { n: hi - x }) };
}
/* adds XP to the equipped pet. Returns the new stage number when it just evolved, otherwise 0 */
function addPetXP(n) {
  const id = petOn(); if (!id) return 0;
  if (!S.petXP) S.petXP = {};
  const before = petStage(id); S.petXP[id] = petXPof(id) + n; save();
  const after = petStage(id); return after > before ? after : 0;
}
function petAlone(id, stage, cls = '') {
  return `<svg class="pet-svg ${cls}" viewBox="-30 100 134 140" role="img" aria-label="${esc(petName(id, stage))}">${petSVG(id, stage)}</svg>`;
}
function petStripHTML() {
  const id = petOn();
  if (!id) return '';
  const st = petStage(id), pr = petProgress(id);
  return `<div class="petstrip"><div class="pe">${petTight(id, st)}</div><div class="pi"><b>${esc(petName(id))}</b><span class="pstages" aria-label="${esc(t('pet.stage', { n: st }))}">${[1, 2, 3].map(k => `<i class="${k <= st ? 'on' : ''}"></i>`).join('')}</span><div class="xp"><i style="width:${pr.pct}%"></i></div><small>${st >= 3 ? pr.txt : petXPof(id) + ' / ' + PET_STAGES[st] + ' ' + t('pet.xp')} · ${petPerkText(id)}</small></div></div>`;
}
/* evolution celebration */
function showEvolve() { return HOOK.call('showEvolve', showEvolveBase, arguments); }   // v32: a short film plays first (29)
function showEvolveBase(id, stage) {
  const ov = $('#evoOverlay'); if (!ov) return;
  $('#evoSheet').innerHTML = `<h2>${t('pet.evolved', { p: esc(petName(id, stage - 1)) })}</h2><div class="evo-art"><div class="evo-old">${petTight(id, stage - 1)}</div><span class="evo-arrow">➜</span><div class="evo-new">${petTight(id, stage)}</div></div>
    <p class="evo-name">${esc(petName(id, stage))}</p><p class="sub">${esc(petPerkText(id, stage))}</p><button class="btn big" data-act="evoClose">${t('pet.yay')}</button>`;
  ov.classList.add('on');
  const say = t('pet.evolvedSay', { n: petName(id, stage) }); if (S.voice.auto) speak(say);
  if (!S.sensory) { sfx.win(); setTimeout(() => { const r = $('#evoSheet .evo-new').getBoundingClientRect(); fx.burstAt && fx.burstAt(r.left + r.width / 2, r.top + r.height / 2); }, 400); }
}

/* v37.2: the same pet, zoomed in so it fills its picture, with a soft shadow on the ground (the stories keep the roomy petAlone) */
function petTight(id, stage, cls = '') {
  const vb = stage >= 3 ? '-14 122 110 128' : stage === 2 ? '-8 150 100 100' : '-4 156 92 96', y = stage >= 3 ? 244 : stage === 2 ? 247 : 249;
  return `<svg class="pet-svg ${cls}" viewBox="${vb}" role="img" aria-label="${esc(petName(id, stage))}"><ellipse cx="34" cy="${y}" rx="${stage >= 2 ? 34 : 30}" ry="4.5" fill="#000" opacity=".16"/>${petSVG(id, stage)}</svg>`;
}
/* ----- pet drawing: evolution wrapper + 10 new pets ----- */
function petSVG(p, stage = null) {
  if (stage === null) stage = petStage(p);
  const base = petBase(p); if (!base) return '';
  if (stage <= 1) return base;
  const sc = stage === 2 ? 1.12 : 1.25, px = 22, py = 228;
  let pre = '', post = '', style = '';
  if (stage === 2) post += [[2, 150], [62, 168]].map(([x, y], i) => `<polygon class="twinkle" style="animation-delay:${-i * .6}s" points="${star5(x, y, 6, 2.5)}" fill="#FFE98A"/>`).join('');
  if (stage === 3) {
    pre += `<circle cx="34" cy="200" r="44" fill="#FFE98A" opacity=".28" class="halo-pulse"/><circle cx="34" cy="200" r="30" fill="#fff" opacity=".18"/>`;
    post += `<g class="evo-crown"><path d="M18 142 L22 130 L28 138 L34 126 L40 138 L46 130 L50 142Z" fill="#FFD166" stroke="#E0A800" stroke-width="1.5" stroke-linejoin="round"/></g>` + [[0, 160], [66, 156], [70, 196]].map(([x, y], i) => `<polygon class="twinkle" style="animation-delay:${-i * .5}s" points="${star5(x, y, 7, 3)}" fill="#FFE98A"/>`).join('');
    if (p === 'pet_dragon') style = ' style="filter:hue-rotate(140deg) saturate(1.25)"';
  }
  let extra = '';
  if (p === 'pet_dragon') extra = `<g transform="translate(6 170)"><path d="M40 16 Q74 -6 66 36Z" fill="#4FAE6E" class="h-wingR"/>${stage === 3 ? '<path d="M44 20 Q62 8 62 28" stroke="#FFE98A" stroke-width="2" fill="none"/>' : ''}</g>`;
  return `<g>${pre}<g transform="translate(${px} ${py}) scale(${sc}) translate(${-px} ${-py})"${style}>${extra}${base}</g>${post}</g>`;
}
function petBase() { return HOOK.call('petBase', petBaseBase, arguments); }   // v32: pet gear is drawn on top (31)
function petBaseBase(p) {
  const ey = (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#22222B"/>`;
  switch (p) {
    case 'pet_fox': return `<g transform="translate(8 176)"><path d="M44 36 Q72 40 64 8 Q58 22 46 24Z" fill="#FF8A3D" class="m-tail"/><path d="M64 8 Q62 18 56 22 L63 26Z" fill="#fff" class="m-tail"/><ellipse cx="26" cy="32" rx="22" ry="16" fill="#FF8A3D"/><ellipse cx="22" cy="38" rx="12" ry="8" fill="#FFF3E0"/><circle cx="20" cy="14" r="14" fill="#FF8A3D"/><polygon points="7,9 7,-9 19,3" fill="#FF8A3D"/><polygon points="33,9 33,-9 21,3" fill="#FF8A3D"/><polygon points="10,6 10,-3 16,3" fill="#3B2A20"/><polygon points="30,6 30,-3 24,3" fill="#3B2A20"/><path d="M7 19 Q20 32 33 19 Q20 22 7 19Z" fill="#FFF3E0"/>${ey(14, 13)}${ey(26, 13)}<circle cx="20" cy="21" r="2.6" fill="#22222B"/></g>`;
    case 'pet_panda': return `<g transform="translate(8 176)"><ellipse cx="26" cy="32" rx="22" ry="16" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><ellipse cx="12" cy="46" rx="8" ry="6" fill="#2B2B33"/><ellipse cx="38" cy="46" rx="8" ry="6" fill="#2B2B33"/><circle cx="8" cy="2" r="6.5" fill="#2B2B33"/><circle cx="32" cy="2" r="6.5" fill="#2B2B33"/><circle cx="20" cy="14" r="14" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><ellipse cx="13.5" cy="13" rx="4.5" ry="6.2" fill="#2B2B33" transform="rotate(20 13.5 13)"/><ellipse cx="26.5" cy="13" rx="4.5" ry="6.2" fill="#2B2B33" transform="rotate(-20 26.5 13)"/><circle cx="14" cy="13" r="2" fill="#fff"/><circle cx="26" cy="13" r="2" fill="#fff"/><ellipse cx="20" cy="19" rx="3" ry="2" fill="#2B2B33"/></g>`;
    case 'pet_turtle': return `<g transform="translate(6 184)"><path d="M56 32 L68 36 L56 38Z" fill="#7FD6A0" class="m-tail"/><ellipse cx="16" cy="38" rx="7" ry="5" fill="#7FD6A0"/><ellipse cx="44" cy="38" rx="7" ry="5" fill="#7FD6A0"/><circle cx="-1" cy="22" r="10" fill="#7FD6A0"/>${ey(-4, 20)}<path d="M-8 26 Q-2 30 3 26" stroke="#22222B" stroke-width="2" fill="none"/><path d="M4 38 Q6 4 30 4 Q54 4 58 38Z" fill="#4FAE6E"/><path d="M30 4 V38 M17 10 L20 38 M43 10 L40 38 M8 24 H54" stroke="#2E8A53" stroke-width="2.5" fill="none"/></g>`;
    case 'pet_hedgehog': return `<g transform="translate(6 180)"><path d="M8 40 Q0 6 30 2 Q60 6 58 40Z" fill="#7A5230"/><path d="M10 30 L2 22 L13 24 L8 12 L21 17 L20 4 L30 13 L37 2 L40 15 L50 6 L48 19 L58 18 L52 32Z" fill="#5B3A1E"/><circle cx="12" cy="30" r="13" fill="#F5CBA7"/><circle cx="-1" cy="34" r="3.4" fill="#22222B"/>${ey(9, 25)}<ellipse cx="22" cy="42" rx="6" ry="3.5" fill="#F5CBA7"/><ellipse cx="46" cy="42" rx="6" ry="3.5" fill="#F5CBA7"/></g>`;
    case 'pet_tiger': return `<g transform="translate(8 176)"><path d="M44 30 Q62 28 58 10" stroke="#FF9A3D" stroke-width="7" fill="none" stroke-linecap="round" class="m-tail"/><path d="M52 24 l4 -3 M56 16 l4 -2" stroke="#2B2B33" stroke-width="3" class="m-tail"/><ellipse cx="26" cy="32" rx="22" ry="16" fill="#FF9A3D"/><path d="M14 20 Q16 28 12 34 M26 18 Q28 28 24 36 M38 22 Q38 30 34 34" stroke="#2B2B33" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="8" cy="3" r="6" fill="#FF9A3D"/><circle cx="32" cy="3" r="6" fill="#FF9A3D"/><circle cx="20" cy="14" r="14" fill="#FF9A3D"/><ellipse cx="20" cy="19" rx="8" ry="6" fill="#FFF3E0"/><path d="M20 3 V8 M12 5 L14 9 M28 5 L26 9" stroke="#2B2B33" stroke-width="2.6" stroke-linecap="round"/>${ey(14, 12)}${ey(26, 12)}<ellipse cx="20" cy="17" rx="2.6" ry="1.8" fill="#22222B"/></g>`;
    case 'pet_axolotl': return `<g transform="translate(8 178)"><path d="M44 34 Q64 34 62 44 Q50 46 44 40Z" fill="#FFB3C7" class="m-tail"/><ellipse cx="26" cy="34" rx="22" ry="13" fill="#FFB3C7"/><ellipse cx="24" cy="38" rx="13" ry="7" fill="#FFE0EA"/>${[[-1, 10, -30], [-4, 16, -10], [-1, 22, 14]].map(([x, y, r]) => `<ellipse cx="${x + 4}" cy="${y}" rx="9" ry="3.2" fill="#FF6F91" transform="rotate(${r} ${x + 12} ${y})" class="m-ant"/>`).join('')}${[[39, 10, 30], [42, 16, 10], [39, 22, -14]].map(([x, y, r]) => `<ellipse cx="${x - 2}" cy="${y}" rx="9" ry="3.2" fill="#FF6F91" transform="rotate(${r} ${x - 10} ${y})" class="m-ant"/>`).join('')}<circle cx="20" cy="18" r="14" fill="#FFB3C7"/><circle cx="13" cy="15" r="2.8" fill="#22222B"/><circle cx="27" cy="15" r="2.8" fill="#22222B"/><path d="M14 22 Q20 28 26 22" stroke="#22222B" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="9" cy="21" r="3" fill="#FF8FA3" opacity=".5"/><circle cx="31" cy="21" r="3" fill="#FF8FA3" opacity=".5"/></g>`;
    case 'pet_kancil': return `<g transform="translate(8 176)"><path d="M44 28 Q52 22 50 16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" class="m-tail"/><path d="M10 44 L8 58 M20 46 L19 58 M34 46 L35 58 M44 42 L46 58" stroke="#8A6034" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="28" cy="32" rx="22" ry="14" fill="#C9965E"/>${[[16, 28], [26, 24], [36, 30], [30, 38], [20, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff"/>`).join('')}<ellipse cx="6" cy="2" rx="4.5" ry="10" fill="#C9965E" transform="rotate(-24 6 2)"/><ellipse cx="6" cy="2" rx="2.4" ry="6.5" fill="#FF9FB0" transform="rotate(-24 6 2)"/><ellipse cx="26" cy="2" rx="4.5" ry="10" fill="#C9965E" transform="rotate(24 26 2)"/><ellipse cx="26" cy="2" rx="2.4" ry="6.5" fill="#FF9FB0" transform="rotate(24 26 2)"/><circle cx="16" cy="16" r="12" fill="#C9965E"/><ellipse cx="16" cy="22" rx="6" ry="4.5" fill="#F3DDBE"/><circle cx="10.5" cy="14" r="3.4" fill="#22222B"/><circle cx="21.5" cy="14" r="3.4" fill="#22222B"/><circle cx="11.5" cy="13" r="1.1" fill="#fff"/><circle cx="22.5" cy="13" r="1.1" fill="#fff"/><ellipse cx="16" cy="20" rx="2.2" ry="1.6" fill="#22222B"/></g>`;
    case 'pet_owl': return `<g transform="translate(10 172)"><polygon points="4,6 6,-8 16,2" fill="#8A6034"/><polygon points="40,6 38,-8 28,2" fill="#8A6034"/><ellipse cx="22" cy="30" rx="20" ry="24" fill="#A9763F"/><ellipse cx="22" cy="38" rx="12" ry="14" fill="#F3DDBE"/><path d="M14 34 q4 3 8 0 q4 3 8 0 M14 42 q4 3 8 0 q4 3 8 0" stroke="#C99B64" stroke-width="2" fill="none"/><ellipse cx="3" cy="32" rx="6" ry="14" fill="#8A6034" class="h-wingL"/><ellipse cx="41" cy="32" rx="6" ry="14" fill="#8A6034" class="h-wingR"/><circle cx="13" cy="18" r="9" fill="#fff"/><circle cx="31" cy="18" r="9" fill="#fff"/><circle cx="14" cy="19" r="4.4" fill="#22222B"/><circle cx="30" cy="19" r="4.4" fill="#22222B"/><circle cx="15.4" cy="17.4" r="1.4" fill="#fff"/><circle cx="31.4" cy="17.4" r="1.4" fill="#fff"/><path d="M18 24 L22 31 L26 24Z" fill="#FFA45C"/><path d="M14 54 h6 M24 54 h6" stroke="#FFA45C" stroke-width="3" stroke-linecap="round"/></g>`;
    case 'pet_phoenix': return `<g transform="translate(6 172)"><g class="m-tail"><path d="M44 38 Q70 46 74 22 Q60 30 48 28Z" fill="#FF6B3D"/><path d="M44 42 Q66 60 72 44 Q58 46 46 36Z" fill="#FFB84D"/><path d="M44 34 Q60 28 68 8 Q52 16 44 26Z" fill="#FFD166"/></g><ellipse cx="28" cy="38" rx="20" ry="16" fill="#FF5A3D"/><ellipse cx="26" cy="44" rx="11" ry="8" fill="#FFD166"/><path d="M16 30 Q-6 14 6 42Z" fill="#FF8A3D" class="h-wingL"/><circle cx="22" cy="18" r="13" fill="#FF5A3D"/><path d="M14 8 Q12 -6 18 -2 Q20 -12 24 -4 Q30 -8 28 8Z" fill="#FFD166"/><path d="M8 20 L-4 24 L8 28Z" fill="#FFB84D"/><circle cx="17" cy="17" r="2.8" fill="#22222B"/><circle cx="18" cy="16" r="1" fill="#fff"/><circle cx="28" cy="17" r="2.8" fill="#22222B"/><circle cx="29" cy="16" r="1" fill="#fff"/></g>`;
    case 'pet_whale': return `<g transform="translate(6 180)"><path d="M26 2 Q22 -10 14 -8 M26 2 Q30 -12 38 -8" stroke="#BFE3FF" stroke-width="3" fill="none" stroke-linecap="round" class="rise" style="animation-duration:2.4s"/><path d="M52 30 Q66 14 66 4 Q58 8 56 12 Q60 2 70 -4 Q74 14 62 36Z" fill="#4DA3FF" class="m-tail"/><path d="M2 34 Q2 4 28 4 Q58 4 56 34 Q56 48 30 48 Q2 48 2 34Z" fill="#4DA3FF"/><path d="M6 38 Q30 56 54 38 Q54 48 30 48 Q6 48 6 38Z" fill="#E8F4FF"/>${ey(16, 24)}<path d="M8 32 Q16 38 24 32" stroke="#22222B" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="11" cy="30" r="3.2" fill="#FF8FA3" opacity=".5"/><ellipse cx="34" cy="38" rx="8" ry="3.5" fill="#3E86D6" transform="rotate(-14 34 38)"/></g>`;
    /* v25 */
    case 'pet_frog': return `<g transform="translate(8 184)"><ellipse cx="6" cy="40" rx="10" ry="5" fill="#3E9A4E" transform="rotate(-18 6 40)"/><ellipse cx="46" cy="40" rx="10" ry="5" fill="#3E9A4E" transform="rotate(18 46 40)"/><ellipse cx="26" cy="30" rx="24" ry="16" fill="#5FC46A"/><ellipse cx="26" cy="36" rx="15" ry="9" fill="#D8F2B8"/><circle cx="13" cy="12" r="9" fill="#5FC46A"/><circle cx="39" cy="12" r="9" fill="#5FC46A"/><circle cx="13" cy="11" r="5.5" fill="#fff"/><circle cx="39" cy="11" r="5.5" fill="#fff"/>${ey(14, 12)}${ey(38, 12)}<path d="M14 28 Q26 36 38 28" stroke="#22222B" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="9" cy="26" r="3" fill="#FF8FA3" opacity=".5"/><circle cx="43" cy="26" r="3" fill="#FF8FA3" opacity=".5"/><circle cx="20" cy="20" r="1.6" fill="#3E9A4E"/><circle cx="33" cy="22" r="1.4" fill="#3E9A4E"/></g>`;
    case 'pet_octopus': return `<g transform="translate(8 172)">${[[6, -20], [14, -8], [22, 4], [30, -4], [38, 10], [46, 22]].map(([x, r], i) => `<path d="M${x} 44 Q${x - 6} 58 ${x + 2} 66 Q${x + 6} 70 ${x + 8} 64" stroke="#C86ACF" stroke-width="7" fill="none" stroke-linecap="round" class="m-ant" style="animation-delay:${-i * .25}s" transform="rotate(${r / 3} ${x} 44)"/>`).join('')}<path d="M0 42 Q-2 4 26 2 Q54 4 52 42Z" fill="#D97ADF"/><ellipse cx="26" cy="42" rx="26" ry="6" fill="#C86ACF"/><circle cx="16" cy="16" r="3.5" fill="#F2B8F2"/><circle cx="38" cy="12" r="2.6" fill="#F2B8F2"/><circle cx="34" cy="22" r="2" fill="#F2B8F2"/><circle cx="17" cy="28" r="6" fill="#fff"/><circle cx="35" cy="28" r="6" fill="#fff"/>${ey(18, 29)}${ey(34, 29)}<path d="M21 37 Q26 41 31 37" stroke="#22222B" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`;
    case 'pet_elephant': return `<g transform="translate(10 178)"><path d="M48 30 Q58 30 58 40" stroke="#8E9AAE" stroke-width="3" fill="none" stroke-linecap="round" class="m-tail"/><rect x="10" y="38" width="9" height="16" rx="4" fill="#8E9AAE"/><rect x="36" y="38" width="9" height="16" rx="4" fill="#8E9AAE"/><ellipse cx="30" cy="30" rx="22" ry="16" fill="#A6B2C6"/><ellipse cx="2" cy="18" rx="11" ry="14" fill="#8E9AAE" class="m-ant"/><ellipse cx="2" cy="18" rx="7" ry="9" fill="#F2B8C8"/><circle cx="14" cy="16" r="14" fill="#A6B2C6"/>${ey(10, 13)}<path d="M4 22 Q-6 30 -4 42 Q-3 46 1 44 Q0 34 8 28Z" fill="#A6B2C6" class="m-tail"/><path d="M6 26 L2 30" stroke="#F4F4F8" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="22" r="3" fill="#FF8FA3" opacity=".45"/></g>`;
    case 'pet_orangutan': return `<g transform="translate(8 172)"><path d="M6 30 Q-8 44 0 60" stroke="#C8642E" stroke-width="8" fill="none" stroke-linecap="round" class="h-wingL"/><path d="M46 30 Q60 44 52 60" stroke="#C8642E" stroke-width="8" fill="none" stroke-linecap="round" class="h-wingR"/><ellipse cx="26" cy="38" rx="20" ry="18" fill="#D9762E"/><ellipse cx="26" cy="42" rx="11" ry="10" fill="#F2A86A"/>${[[10, 28], [42, 28], [14, 50], [38, 50]].map(([x, y]) => `<path d="M${x} ${y} l-3 5 M${x + 3} ${y} l-1 6" stroke="#B0521E" stroke-width="2" stroke-linecap="round"/>`).join('')}<circle cx="26" cy="14" r="15" fill="#D9762E"/><path d="M14 4 Q18 -6 22 2 Q26 -8 30 2 Q34 -6 38 4" fill="#D9762E"/><ellipse cx="26" cy="17" rx="11" ry="10" fill="#F2C08E"/>${ey(21, 14)}${ey(31, 14)}<ellipse cx="26" cy="21" rx="5" ry="3" fill="#E8A070"/><path d="M22 24 Q26 27 30 24" stroke="#22222B" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
    case 'pet_hornbill': return `<g transform="translate(8 172)"><path d="M44 38 Q66 44 70 30 Q58 36 46 32Z" fill="#F4F4F8" class="m-tail"/><path d="M46 40 Q64 52 66 42 Q56 44 46 36Z" fill="#2A2A33" class="m-tail"/><ellipse cx="30" cy="38" rx="18" ry="15" fill="#2A2A33"/><ellipse cx="28" cy="44" rx="10" ry="7" fill="#F4F4F8"/><path d="M34 30 Q52 26 50 46 Q40 40 34 36Z" fill="#1E1E24" class="h-wingR"/><circle cx="24" cy="18" r="12" fill="#2A2A33"/><path d="M14 12 Q-2 10 -14 22 Q2 20 14 22Z" fill="#F2C14E"/><path d="M14 10 Q2 2 -6 8 Q4 9 14 14Z" fill="#E8402E"/><circle cx="21" cy="15" r="4.2" fill="#fff"/>${ey(20, 15)}<path d="M18 52 v6 M28 52 v6" stroke="#F2C14E" stroke-width="3" stroke-linecap="round"/></g>`;
    default: return basePetOld(p);
  }
}

/* ================= v7: Pet Haven ================= */
const FURN = [
  ['bed', '🛏️', 40, 'Cosy Bed', 'Katil selesa', 'floor'], ['sofa', '🛋️', 60, 'Sofa', 'Sofa', 'floor'],
  ['plant', '🪴', 15, 'House Plant', 'Pokok hiasan', 'floor'], ['shelf', '📚', 45, 'Bookshelf', 'Rak buku', 'wall'],
  ['paint', '🖼️', 25, 'Painting', 'Lukisan', 'wall'], ['lantern', '🏮', 20, 'Lantern', 'Tanglung', 'wall'],
  ['teddy', '🧸', 15, 'Teddy Bear', 'Patung beruang', 'floor'], ['fish', '🐠', 55, 'Fish Tank', 'Akuarium', 'floor'],
  ['fountain', '⛲', 70, 'Mini Fountain', 'Air pancut', 'floor'], ['piano', '🎹', 80, 'Toy Piano', 'Piano mainan', 'floor'],
  ['rainbow', '🌈', 50, 'Rainbow', 'Pelangi', 'wall'], ['starlamp', '🌟', 35, 'Star Lamp', 'Lampu bintang', 'wall'],
  ['mirror', '🪞', 30, 'Mirror', 'Cermin', 'wall'], ['clock', '🕰️', 25, 'Clock', 'Jam', 'wall'],
  ['tree', '🌳', 40, 'Little Tree', 'Pokok kecil', 'floor'], ['balloons', '🎈', 20, 'Balloons', 'Belon', 'wall'],
  ['bowl', '🍎', 10, 'Snack Bowl', 'Mangkuk buah', 'floor'], ['ball', '⚽', 10, 'Play Ball', 'Bola', 'floor'],
  ['tent', '⛺', 65, 'Play Tent', 'Khemah main', 'floor'], ['drum', '🥁', 35, 'Drum', 'Dram', 'floor']
].map(([id, em, cost, en, ms, spot]) => ({ id, em, cost, en, ms, spot }));
const FURNI = Object.fromEntries(FURN.map(f => [f.id, f]));
const THEMES = [
  { id: 'sunny', cost: 0, wall: 'linear-gradient(#FFF1C2,#FFE0A3)', floor: 'linear-gradient(#EBC184,#D9A765)', en: 'Sunny Room', ms: 'Bilik cerah' },
  { id: 'meadow', cost: 30, wall: 'linear-gradient(#D8F6DE,#BFEBC9)', floor: 'linear-gradient(#9EDB9E,#7CC47C)', en: 'Meadow Room', ms: 'Bilik padang' },
  { id: 'candy', cost: 40, wall: 'linear-gradient(#FFDDE9,#FFC4D8)', floor: 'linear-gradient(#FFB9CF,#FF9FBE)', en: 'Candy Room', ms: 'Bilik gula-gula' },
  { id: 'ocean', cost: 50, wall: 'linear-gradient(#CBEEFF,#A8DEF5)', floor: 'linear-gradient(#8ADBEE,#62C4DC)', en: 'Ocean Room', ms: 'Bilik lautan' },
  { id: 'night', cost: 60, wall: 'linear-gradient(#3A3F7A,#5A4FB0)', floor: 'linear-gradient(#4A4A8C,#3A3A72)', en: 'Starry Night Room', ms: 'Bilik malam berbintang' }
];
const THEMEI = Object.fromEntries(THEMES.map(x => [x.id, x]));
const hv = () => S.haven || (S.haven = { furn: [], placed: [], theme: 'sunny', themes: ['sunny'] });
const fname = f => f[S.lang] || f.en;
const MAX_PLACED = 14;
let havenTimer = 0;
function armTabs() {
  const a = UI.arm === 'haven' ? 'haven' : UI.arm === 'me' ? 'me' : UI.arm === 'wd' ? 'wd' : 'gear';
  return `<div class="armtabs seg" role="group"><button class="chip big" data-act="armView" data-v="gear" aria-pressed="${a === 'gear'}">🛡️ ${t('ar.gear')}</button><button class="chip big" data-act="armView" data-v="haven" aria-pressed="${a === 'haven'}">🏡 ${t('ar.haven')}</button><button class="chip big" data-act="armView" data-v="me" aria-pressed="${a === 'me'}">✨ ${t('lk.tab')}</button><button class="chip big" data-act="armView" data-v="wd" aria-pressed="${a === 'wd'}">👗 ${t('wd.tab')}</button></div>`;
}
function ownedPets() { return ITEMS.filter(i => i.slot === 'pet' && i.id !== 'pet_none' && S.owned.includes(i.id)); }
function roomPetsHTML() {
  const ps = ownedPets().slice(0, 8);
  return ps.map((p, i) => {
    const st = petStage(p.id), w = 96 + st * 20;
    return `<button class="rp" data-act="hvPet" data-v="${p.id}" style="left:${18 + (i * 37) % 70}%;top:${62 + (i * 23) % 26}%;--w:${w}px;animation-delay:${-i * .5}s" aria-label="${esc(petName(p.id))}">${petTight(p.id, st)}<span class="rp-bubble" hidden></span></button>`;
  }).join('');
}
function roomItemsHTML() {
  const h = hv();
  return h.placed.map((pl, i) => {
    const f = FURNI[pl.id]; if (!f) return '';
    return `<div class="fi ${UI.hvSel === i ? 'sel' : ''}" data-i="${i}" style="left:${pl.x}%;top:${pl.y}%;font-size:${Math.round(46 * (pl.s || 1))}px" role="button" tabindex="0" aria-label="${esc(fname(f))}">${f.em}</div>`;
  }).join('');
}
/* v25: in the Pet Haven the chip row under the room switches between Your pets, Furniture & deco and Themes
   (the same way the Gear chips switch between Knights, Weapon, Shield ...) */
const HV_TABS = [['pets', '🐾', 'hv.tPets'], ['furn', '🛋️', 'hv.tFurn'], ['themes', '🎨', 'hv.tThemes']];
function renderHaven() {
  const h = hv(), th = THEMEI[h.theme] || THEMES[0], pets = ownedPets();
  const tab = HV_TABS.some(x => x[0] === UI.hvTab) ? UI.hvTab : (UI.hvTab = 'pets');
  const petCards = ITEMS.filter(i => i.slot === 'pet' && i.id !== 'pet_none').map(p => {
    const own = S.owned.includes(p.id), st = petStage(p.id), pr = petProgress(p.id), worn = S.equipped.pet === p.id;
    return `<div class="pcard ${own ? '' : 'locked'} ${worn ? 'worn' : ''}">${petTight(p.id, own ? st : 1)}<b>${esc(own ? petName(p.id) : itemName(p))}</b>
      ${own ? `<div class="xp"><i style="width:${pr.pct}%"></i></div><small>${t('pet.stage', { n: st })} · ${petXPof(p.id)} ${t('pet.xp')}</small><small>${esc(petPerkText(p.id))}</small>${worn ? `<button class="btn good" disabled>${t('hv.equipped')}</button>` : `<button class="btn ghost" data-act="hvEquip" data-v="${p.id}">${t('hv.equip')}</button>`}` : `<small>${esc(petPerkText(p.id, 1))}</small><small>${t('hv.buyPet')}</small>${S.coins >= p.cost ? `<button class="btn" data-act="hvBuyPet" data-v="${p.id}">${t('ar.buy', { c: p.cost })}</button>` : `<button class="btn ghost" disabled>${t('ar.need', { n: p.cost - S.coins })}</button>`}`}</div>`;
  }).join('');
  const shop = FURN.map(f => {
    const own = h.furn.includes(f.id), placed = h.placed.some(p => p.id === f.id);
    let btn;
    if (own) btn = placed ? `<button class="btn ghost" data-act="hvAway" data-v="${f.id}">${t('hv.away')}</button>` : `<button class="btn" data-act="hvPlace" data-v="${f.id}">${t('hv.place')}</button>`;
    else if (S.coins >= f.cost) btn = `<button class="btn" data-act="hvBuy" data-v="${f.id}">${t('ar.buy', { c: f.cost })}</button>`;
    else btn = `<button class="btn ghost" disabled>${t('ar.need', { n: f.cost - S.coins })}</button>`;
    return `<div class="fcard ${placed ? 'worn' : ''}"><span class="fe" aria-hidden="true">${f.em}</span><b>${esc(fname(f))}</b>${placed ? `<small>${t('hv.placed')}</small>` : ''}${btn}</div>`;
  }).join('');
  const themes = THEMES.map(x => {
    const own = h.themes.includes(x.id), cur = h.theme === x.id;
    let btn;
    if (cur) btn = `<button class="btn good" disabled>${t('hv.using')}</button>`;
    else if (own) btn = `<button class="btn ghost" data-act="hvTheme" data-v="${x.id}">${t('hv.use')}</button>`;
    else if (S.coins >= x.cost) btn = `<button class="btn" data-act="hvTheme" data-v="${x.id}">${t('ar.buy', { c: x.cost })}</button>`;
    else btn = `<button class="btn ghost" disabled>${t('ar.need', { n: x.cost - S.coins })}</button>`;
    return `<div class="tcard ${cur ? 'worn' : ''}"><span class="tsw" style="background:${x.wall}"><i style="background:${x.floor}"></i></span><b>${esc(fname(x))}</b>${btn}</div>`;
  }).join('');
  const sel = UI.hvSel != null && h.placed[UI.hvSel] ? h.placed[UI.hvSel] : null;
  $('#tab-armory').innerHTML = `<div class="wrap">${armTabs()}<h1 class="title">${t('hv.title')}</h1><p class="sub">${t('hv.sub')}</p>
    <div class="room" id="room" style="--wall:${th.wall};--floor:${th.floor}"><div class="room-win" aria-hidden="true"><i></i><i></i></div><div class="room-floor"></div>${roomItemsHTML()}${roomPetsHTML()}${pets.length ? '' : `<p class="room-empty">${t('hv.empty')}</p>`}</div>
    <p class="sub" style="margin:8px 0">${t('hv.drag')}</p>
    ${sel ? `<div class="seg hvbar"><button class="btn ghost" data-act="hvSize" data-v="1">➕ ${t('hv.bigger')}</button><button class="btn ghost" data-act="hvSize" data-v="-1">➖ ${t('hv.smaller')}</button><button class="btn ghost" data-act="hvAwaySel">🧺 ${t('hv.away')}</button><button class="btn" data-act="hvDone">${t('hv.done')}</button></div>` : ''}
    <div class="slotbar hvtabs" role="group" aria-label="${esc(t('ar.haven'))}">${HV_TABS.map(([id, em, k]) => `<button class="chip" data-act="hvTab" data-v="${id}" aria-pressed="${tab === id}"><span aria-hidden="true">${em}</span> ${t(k)}</button>`).join('')}</div>
    ${tab === 'pets' ? `<p class="sub hvcoins">🪙 ${S.coins}</p><div class="pcards">${petCards}</div>` : tab === 'furn' ? `<p class="sub hvcoins">🪙 ${S.coins}</p><div class="fcards">${shop}</div>` : `<div class="tcards">${themes}</div>`}</div>`;
  bindRoom(); clearInterval(havenTimer); havenTimer = setInterval(havenRoam, 3200); setTimeout(havenRoam, 300);
}
function havenRoam() {
  const room = $('#room'); if (!room || UI.tab !== 'armory' || UI.arm !== 'haven' || document.hidden) return;
  room.querySelectorAll('.rp').forEach(el => {
    if (el.classList.contains('held')) return;
    const x = 10 + Math.random() * 78, y = 56 + Math.random() * 34, cur = parseFloat(el.style.left) || 50;
    el.classList.toggle('flip', x > cur); el.style.left = x + '%'; el.style.top = y + '%';
  });
}
function bindRoom() {
  const room = $('#room'); if (!room) return;
  room.querySelectorAll('.fi').forEach(el => {
    el.addEventListener('pointerdown', e => {
      const i = +el.dataset.i, pl = hv().placed[i]; if (!pl) return;
      e.preventDefault(); el.setPointerCapture(e.pointerId);
      const r = room.getBoundingClientRect(), sx = e.clientX, sy = e.clientY; let moved = false;
      const mv = ev => {
        if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 8) moved = true;
        if (!moved) return;
        pl.x = Math.max(6, Math.min(94, (ev.clientX - r.left) / r.width * 100)); pl.y = Math.max(8, Math.min(94, (ev.clientY - r.top) / r.height * 100));
        el.style.left = pl.x + '%'; el.style.top = pl.y + '%';
      };
      const up = () => {
        el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
        if (moved) save(); else { UI.hvSel = UI.hvSel === i ? null : i; renderHaven(); }
      };
      el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { UI.hvSel = UI.hvSel === +el.dataset.i ? null : +el.dataset.i; renderHaven(); } });
  });
}
function hvPetTap(id) {
  const el = $(`#room .rp[data-v="${id}"]`); if (!el) return;
  const b = el.querySelector('.rp-bubble'); b.hidden = false; b.textContent = '💗 ' + t('hv.hi', { p: petName(id) });
  if (!S.sensory) { replayClass(el, 'hop'); }
  sfx.soft(); clearTimeout(el._bt); el._bt = setTimeout(() => { b.hidden = true; }, 2200);
}
function hvPlaceItem(id) {
  const h = hv(), f = FURNI[id]; if (!f || h.placed.some(p => p.id === id)) return;
  if (h.placed.length >= MAX_PLACED) { toast(t('hv.full')); return; }
  const k = h.placed.length;
  h.placed.push({ id, x: f.spot === 'wall' ? 16 + (k * 17) % 70 : 14 + (k * 23) % 72, y: f.spot === 'wall' ? 22 + (k * 7) % 14 : 70 + (k * 9) % 18, s: 1 });
}
