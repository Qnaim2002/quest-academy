/* ================= v18: heroic pixel knights =================
   Style guide: classic 16-bit fantasy knights. Real proportions, a wide action stance, muted steel with
   gold trim, flat chunky shading and a dark outline. Every knight shares one body plan and wears its own
   armour; every Armory item (weapons, shields, capes) is real medieval gear drawn onto that body.
   Coordinates are 32 "design units" (3 pixels each on the 96x96 grid since v19). The knight faces right:
   sword arm raised on the left, shield forward on the right, toward the monster. */
const KNIGHTS = (() => {
  const GOLD = '#D9A93B', LEATHER = '#5A3A22', WOOD = '#7A5232', IRON = '#8E979E', BLADE = '#C9D1D6';
  const GX = 8.6, GY = 13.8;                 // sword hand (grip centre)
  const SX = 25.2, SY = 19.6;                // shield centre
  const kit = () => PX.kit;

  /* ---------------- weapons, held up in the sword hand ---------------- */
  const sword = (a, o) => {
    const { lt, dk } = kit(), top = o.top, w = o.w || .85, bc = o.blade || BLADE;
    a({ g: 'weap', c: bc, m: m => m.p([[GX - w, GY - .8], [GX - w, top + 1.4], [GX, top], [GX + w, top + 1.4], [GX + w, GY - .8]]), fine: [[GX - w + .5, top + 2.5], [GX - w + .5, top + 4], [GX - w + .5, top + 6]] });
    a({ g: 'weap', c: lt(bc, .25), flat: true, sep: false, m: m => m.l(GX - .1, GY - 1.6, GX - .1, top + 2.4, .45) });
    a({ g: 'weap', c: dk(bc, .28), flat: true, sep: false, m: m => m.l(GX + .38, GY - 1.8, GX + .38, top + 3.2, .34) });                 // v19 fuller groove
    a({ g: 'weap', c: dk(bc, .2), flat: true, sep: false, m: m => m.l(GX + w - .1, GY - 1, GX + w - .1, top + 1.8, .34) });             // blade edge shade
    a({ g: 'weap', c: o.guard || GOLD, m: m => m.r(GX - (o.gw || 2.5), GY - 1.1, (o.gw || 2.5) * 2, 1.1) });
    a({ g: 'weap', c: o.grip || LEATHER, m: m => m.r(GX - .45, GY - .1, .9, 2.3) });
    a({ g: 'weap', c: o.guard || GOLD, m: m => m.e(GX, GY + 2.6, .8, .8).e(GX - (o.gw || 2.5), GY - .55, .6, .75).e(GX + (o.gw || 2.5), GY - .55, .6, .75), fine: [[GX - .3, GY + 2.3]] });
    a({ g: 'weap', c: dk(o.grip || LEATHER, .35), flat: true, sep: false, m: m => m.r(GX - .45, GY + .4, .9, .34).r(GX - .45, GY + 1.2, .9, .34) });   // grip wrap
    if (o.glow) [[GX + 1.6, top + 3, [0, 2]], [GX - 1.8, top + 6, [1, 3]], [GX + 1.4, top + 9, [0, 1]]].forEach(([x, y, fr]) => a({ g: 'weap', c: o.glow, flat: true, sep: false, fr, m: m => m.pts([[x, y], [x, y - 1]]) }));
  };
  const haft = (a, top, bottom = GY + 3, c = WOOD) => a({ g: 'weap', c, m: m => m.l(GX, bottom, GX, top, 1) });
  const WEAPONS = {
    sword: a => sword(a, { top: 3 }),                                                     // arming sword
    longsword: a => sword(a, { top: 1.2 }),
    greatsword: a => sword(a, { top: .6, w: 1.25, gw: 3.2 }),
    spear: a => { haft(a, 3.4, GY + 4.4); a({ g: 'weap', c: BLADE, m: m => m.p([[GX - 1.1, 4.4], [GX, .6], [GX + 1.1, 4.4], [GX, 5.4]]) }); a({ g: 'weap', c: '#8E2A2A', m: m => m.p([[GX + .5, 5.6], [GX + 3.8, 6.5], [GX + .5, 7.6]]) }); },
    axe: a => { haft(a, 2.2); a({ g: 'weap', c: BLADE, m: m => m.p([[GX + .4, 2.6], [GX + 4, 1.2], [GX + 4.4, 4.6], [GX + 4, 8], [GX + .4, 6.6]]), fine: [[GX + 3.5, 2.5], [GX + 3.5, 3.5]] }); a({ g: 'weap', c: BLADE, m: m => m.p([[GX - .4, 3.2], [GX - 2.4, 2.4], [GX - 2.4, 6.4], [GX - .4, 5.8]]) }); },
    mace: a => { haft(a, GY - 6.4); a({ g: 'weap', c: IRON, m: m => m.e(GX, GY - 8.2, 1.9, 2.1).r(GX - .4, GY - 11.2, .8, 1.4).r(GX - 2.6, GY - 8.6, .8, .8).r(GX + 1.8, GY - 8.6, .8, .8) }); },
    handaxe: a => { haft(a, GY - 8.6); a({ g: 'weap', c: BLADE, m: m => m.p([[GX + .4, GY - 9.6], [GX + 3.4, GY - 11.2], [GX + 3.6, GY - 7.8], [GX + 3.4, GY - 5.2], [GX + .4, GY - 6.8]]) }); },
    hammer: a => { haft(a, GY - 8.8); a({ g: 'weap', c: IRON, m: m => m.r(GX - 2.6, GY - 11, 5.2, 2.6) }); a({ g: 'weap', c: IRON, m: m => m.p([[GX - .5, GY - 11], [GX, GY - 13], [GX + .5, GY - 11]]) }); a({ g: 'weap', c: GOLD, flat: true, sep: false, m: m => m.r(GX - 2.6, GY - 9.6, 5.2, .4) }); },
    morningstar: a => { haft(a, GY - 5.6); a({ g: 'weap', c: '#555B63', flat: true, m: m => m.pts([[GX - .5, GY - 6.6], [GX - 1, GY - 7.4]]) }); a({ g: 'weap', c: '#6B7279', m: m => m.e(GX - 1.6, GY - 9.4, 2, 2) }); a({ g: 'weap', c: BLADE, flat: true, m: m => m.pts([[GX - 1.6, GY - 12], [GX - 4, GY - 9.4], [GX + .8, GY - 9.4], [GX - 1.6, GY - 7]]) }); },
    halberd: a => { haft(a, 1.6, GY + 4.4); a({ g: 'weap', c: BLADE, m: m => m.p([[GX + .4, 3.6], [GX + 3.6, 2.6], [GX + 3.8, 6], [GX + 3.6, 8], [GX + .4, 6.8]]) }); a({ g: 'weap', c: BLADE, m: m => m.p([[GX - .6, 2.2], [GX, -.2], [GX + .6, 2.2]]) }); a({ g: 'weap', c: BLADE, m: m => m.p([[GX - .4, 4.6], [GX - 2.6, 5.4], [GX - .4, 6.2]]) }); },
    flame: a => { sword(a, { top: 1.8, blade: '#E87A3E', guard: '#7A2A2A', glow: '#FFD166' }); a({ g: 'weap', c: '#FFD166', flat: true, sep: false, fr: [0, 2, 4], m: m => m.p([[GX - .5, 2.6], [GX, .2], [GX + .5, 2.6]]) }); a({ g: 'weap', c: '#FFE9A8', flat: true, sep: false, fr: [1, 3, 5], m: m => m.p([[GX - .5, 2.8], [GX + .3, .6], [GX + .5, 2.8]]) }); },
    frost: a => { haft(a, 4, GY + 4.4, '#5E6E80'); a({ g: 'weap', c: '#9ED8F0', m: m => m.p([[GX - .4, 6.2], [GX + .6, 1], [GX + 3.4, 3.6], [GX + 1.6, 4.4], [GX + .6, 7.4]]), fine: [[GX + 1, 2.5], [GX + 1.5, 3]] }); a({ g: 'weap', c: '#E8F8FF', flat: true, sep: false, fr: [0, 2], m: m => m.pts([[GX + 3.2, 1.4], [GX - 1.4, 4.4]]) }); },
    goldsword: a => sword(a, { top: .4, w: 1.3, gw: 3.4, blade: '#E3C25A', guard: '#8E2A2A', glow: '#FFF3C4' }),
    /* v23 */
    keris: a => {   /* a wavy Malay blade with a bird-head hilt */
      a({ g: 'weap', c: '#B8C2CC', m: m => m.p([[GX - .7, GY - .8], [GX - 1.3, GY - 3], [GX - .3, GY - 5], [GX - 1.1, GY - 7], [GX - .1, GY - 9], [GX - .7, GY - 11], [GX + .2, GY - 13.2], [GX + .8, GY - 11.2], [GX + .3, GY - 9], [GX + 1.1, GY - 7], [GX + .3, GY - 5], [GX + 1.1, GY - 3], [GX + .7, GY - .8]]) });
      a({ g: 'weap', c: '#E3EAF0', flat: true, sep: false, m: m => m.l(GX, GY - 1.6, GX + .1, GY - 11.6, .3) });
      a({ g: 'weap', c: GOLD, m: m => m.p([[GX - 2.2, GY - .6], [GX + 1.6, GY - 1.2], [GX + 1.8, GY], [GX - 2, GY + .2]]) });
      a({ g: 'weap', c: '#6B3E26', m: m => m.p([[GX - .5, GY], [GX + .5, GY], [GX + .9, GY + 2.2], [GX + 2, GY + 2.6], [GX + .2, GY + 3.2], [GX - .5, GY + 2.4]]) });
    },
    trident: a => { haft(a, 4.6, GY + 4.4, '#5E6E80'); a({ g: 'weap', c: '#4FC9D9', m: m => m.r(GX - 3, 4.2, 6, 1).l(GX - 2.6, 4.6, GX - 2.6, 1.4, .8).l(GX + 2.6, 4.6, GX + 2.6, 1.4, .8).l(GX, 4.6, GX, .2, .9) }); a({ g: 'weap', c: '#B8F2F8', flat: true, sep: false, m: m => m.p([[GX - 3.2, 1.8], [GX - 2.6, .4], [GX - 2, 1.8]]).p([[GX + 2, 1.8], [GX + 2.6, .4], [GX + 3.2, 1.8]]).p([[GX - .6, .8], [GX, -.8], [GX + .6, .8]]) }); },
    crystal: a => sword(a, { top: 1, w: 1.1, gw: 2.8, blade: '#B58CF2', guard: '#5A3E8A', glow: '#E8D8FF' }),
    leaf: a => { sword(a, { top: 1.6, w: 1.2, blade: '#5FB85A', guard: '#7A5232', grip: '#3E6A2E' }); a({ g: 'weap', c: '#2E6A3A', flat: true, sep: false, m: m => m.l(GX, GY - 2, GX, 3.6, .3).l(GX, 6, GX - .9, 5, .25).l(GX, 8.4, GX + .9, 7.4, .25).l(GX, 10.6, GX - .9, 9.6, .25) }); },
    thunder: a => { haft(a, 3.4, GY + 4.4, '#3E4A6E'); a({ g: 'weap', c: '#F2D24E', m: m => m.p([[GX - 1.2, 4.6], [GX + .4, 1.6], [GX - .3, 1.6], [GX + 1.2, -1.2], [GX + .9, 1.2], [GX + 1.6, 1.2], [GX, 4.6]]) }); [[GX + 2.4, 3, [0, 2]], [GX - 2.4, 5, [1, 3]]].forEach(([x, y, fr]) => a({ g: 'weap', c: '#FFF3A8', flat: true, sep: false, fr, m: m => m.pts([[x, y], [x + .6, y + .8], [x, y + 1.6]]) })); },
    moon: a => { haft(a, 2.2, GY + 3, '#5E6E80'); a({ g: 'weap', c: '#C9D8F2', m: m => m.e(GX + 2.6, 4.4, 3.4, 3.8).sub(t => t.e(GX + 4.6, 4.2, 2.8, 3.2)) }); a({ g: 'weap', c: '#F2F8FF', flat: true, sep: false, fr: [0, 2, 4], m: m => m.pts([[GX + .2, 2.4], [GX + .4, 6.2]]) }); },
    /* v25: shop pieces never share a shape with a knight's own signature weapon */
    shortsword: a => { sword(a, { top: 5.6, w: .95, gw: 2.1, guard: '#B8C2CC' }); a({ g: 'weap', c: '#C8402F', flat: true, sep: false, m: m => m.e(GX, GY + 2.6, .45, .45) }); },
    bastard: a => { sword(a, { top: 1.4, w: .95, gw: 3, guard: '#8E979E', grip: '#2E4F86' }); a({ g: 'weap', c: '#4FA8E8', flat: true, sep: false, m: m => m.e(GX, GY + 2.6, .5, .5).r(GX - .3, GY - 1, .6, .6) }); },
    pike: a => { haft(a, 2.6, GY + 4.4); a({ g: 'weap', c: BLADE, m: m => m.p([[GX - .9, 4.6], [GX, .2], [GX + .9, 4.6], [GX, 6]]) }); a({ g: 'weap', c: '#3E6BD6', m: m => m.p([[GX + .5, 6.4], [GX + 4.4, 7], [GX + 3.2, 7.9], [GX + 4.4, 8.8], [GX + .5, 9.2]]) }); a({ g: 'weap', c: '#F2EAD8', flat: true, sep: false, m: m => m.l(GX + .8, 7.8, GX + 3, 7.9, .3) }); },
    /* the three new knights' own weapons */
    rapier: a => { sword(a, { top: .8, w: .5, gw: 1.6, guard: '#E8C8D4' }); a({ g: 'weap', c: '#F2C14E', flat: true, sep: false, m: m => m.e(GX + .9, GY + .9, 1.4, 1.6).sub(t => t.e(GX + .9, GY + .9, .9, 1.1)) }); },
    glaive: a => { haft(a, 4, GY + 4.4, '#2E6E6A'); a({ g: 'weap', c: '#E8F4FF', m: m => m.p([[GX - .6, 5], [GX - 1, 2.4], [GX - .2, -.2], [GX + 1.8, 1.6], [GX + .6, 3.6], [GX + .6, 5.4]]) }); a({ g: 'weap', c: '#E8704E', m: m => m.r(GX - 1, 5, 2, 1) }); },
    warpick: a => { haft(a, 2.8, GY + 3, '#7A4E22'); a({ g: 'weap', c: '#C98A3E', m: m => m.r(GX - .9, 2.2, 1.8, 2.4) }); a({ g: 'weap', c: BLADE, m: m => m.p([[GX + .8, 2.6], [GX + 5.2, 3.6], [GX + .8, 4.4]]) }); a({ g: 'weap', c: IRON, m: m => m.r(GX - 2.8, 2.4, 1.9, 2) }); a({ g: 'weap', c: '#FFD166', flat: true, sep: false, fr: [0, 2, 4], m: m => m.pts([[GX, 1.4], [GX - .6, .6]]) }); },
    /* v25 shop weapons */
    scepter: a => { haft(a, 4.6, GY + 3, GOLD); a({ g: 'weap', c: GOLD, m: m => m.r(GX - 1.4, 5, 2.8, .8) }); a({ g: 'weap', c: '#7FD3F2', m: m => m.e(GX, 3.2, 2.2, 2.2) }); a({ g: 'weap', c: '#E8F8FF', flat: true, sep: false, m: m => m.e(GX - .7, 2.5, .6, .6) }); [[GX + 2.8, 1.2, [0, 2]], [GX - 2.6, .4, [1, 3]], [GX + 1.8, -.8, [2, 4]]].forEach(([x, y, fr]) => a({ g: 'weap', c: '#B8ECFA', flat: true, sep: false, fr, m: m => m.e(x, y, .55, .55) })); },
    lance: a => { a({ g: 'weap', c: '#E8704E', m: m => m.p([[GX - 1.1, 8.6], [GX, -.4], [GX + 1.1, 8.6]]) }); a({ g: 'weap', c: '#F2EAD8', flat: true, sep: false, m: m => m.p([[GX - 1.1, 8.6], [GX, -.4], [GX + 1.1, 8.6]]).and(t => t.r(0, 2.6, 32, 1).r(0, 5.4, 32, 1.1)) }); a({ g: 'weap', c: '#B8C2CC', m: m => m.p([[GX - 2.3, 12.4], [GX - .9, 8.4], [GX + .9, 8.4], [GX + 2.3, 12.4]]) }); a({ g: 'weap', c: LEATHER, m: m => m.r(GX - .45, GY - .6, .9, 3) }); },
    bow: a => { a({ g: 'weap', c: '#2A2A33', m: m => m.l(GX, GY + 3, GX - 2.4, GY - 1, .9).l(GX - 2.4, GY - 1, GX - 2.4, GY - 7, .9).l(GX - 2.4, GY - 7, GX, GY - 12, .9) }); a({ g: 'weap', c: '#F2C14E', m: m => m.e(GX + .2, GY - 12.2, .9, .8).e(GX + .2, GY + 3.2, .8, .7) }); a({ g: 'weap', c: '#E8402E', flat: true, sep: false, m: m => m.r(GX - .3, GY - 13.4, 1.2, .6) }); a({ g: 'weap', c: '#F2EAD8', flat: true, sep: false, m: m => m.l(GX + .4, GY + 3, GX + .4, GY - 12, .3) }); a({ g: 'weap', c: '#8B5E3C', flat: true, sep: false, m: m => m.l(GX + 1.4, GY + 1, GX + 1.4, GY - 10, .35) }); a({ g: 'weap', c: BLADE, m: m => m.p([[GX + .6, GY - 10], [GX + 1.4, GY - 12], [GX + 2.2, GY - 10]]) }); },
    flail: a => { haft(a, GY - 4.4, GY + 3); a({ g: 'weap', c: '#6B7279', flat: true, m: m => m.pts([[GX, GY - 5.4], [GX - .6, GY - 6.4], [GX - 1.2, GY - 7.4], [GX - 1.6, GY - 8.4]]) }); a({ g: 'weap', c: '#4FA8E8', m: m => m.e(GX - 2.6, GY - 10.2, 1.9, 1.9) }); a({ g: 'weap', c: '#E8F8FF', flat: true, sep: false, m: m => m.pts([[GX - 2.6, GY - 12.7], [GX - 5.1, GY - 10.2], [GX - 2.6, GY - 7.7], [GX - .1, GY - 10.2]]) }); a({ g: 'weap', c: '#B8F2F8', flat: true, sep: false, fr: [0, 2, 4], m: m => m.l(GX - 4, GY - 11.4, GX - 6.4, GY - 13, .4) }); a({ g: 'weap', c: '#B8F2F8', flat: true, sep: false, fr: [1, 3], m: m => m.l(GX - 4, GY - 10.8, GX - 6.8, GY - 11.6, .4) }); },
    sabre: a => { a({ g: 'weap', c: BLADE, m: m => m.p([[GX - .8, GY - .8], [GX - 1.2, GY - 5], [GX - .6, GY - 9], [GX + .8, GY - 12.4], [GX + 1.6, GY - 11.6], [GX + .6, GY - 8.6], [GX + .4, GY - 4.6], [GX + .8, GY - .8]]) }); a({ g: 'weap', c: lt(BLADE, .3), flat: true, sep: false, m: m => m.l(GX - .5, GY - 2, GX - .2, GY - 8, .3) }); a({ g: 'weap', c: GOLD, m: m => m.e(GX + .6, GY + .6, 1.8, 1.8).sub(t => t.e(GX + .6, GY + .6, 1.1, 1.1)) }); a({ g: 'weap', c: '#3A2A1E', m: m => m.r(GX - .45, GY - .1, .9, 2.4) }); }
  };
  const lt = (c, k) => kit().lt(c, k);
  /* Armory tool id -> weapon (the starter keeps each knight's own signature weapon) */
  const W_ITEM = { weapon_crayon: 'shortsword', weapon_ruler: 'mace', weapon_paintbrush: 'handaxe', weapon_wand: 'pike', weapon_magnify: 'bastard', weapon_book: 'hammer',
    weapon_lollipop: 'morningstar', weapon_quill: 'halberd', weapon_torch: 'flame', weapon_rainbow: 'frost', weapon_starhammer: 'goldsword',
    weapon_keris: 'keris', weapon_trident: 'trident', weapon_crystal: 'crystal', weapon_leaf: 'leaf', weapon_thunder: 'thunder', weapon_moon: 'moon',
    weapon_scepter: 'scepter', weapon_lance: 'lance', weapon_bow: 'bow', weapon_flail: 'flail', weapon_sabre: 'sabre' };

  /* ---------------- shields, held forward ---------------- */
  const shapes = {
    heater: (m, k = 0) => m.p([[21.4 + k, 13.2 + k], [29 - k, 13.2 + k], [29 - k, 20.2], [SX, 26.6 - k * 1.4], [21.4 + k, 20.2]]),
    kite: (m, k = 0) => m.p([[21.6 + k, 12.6 + k], [SX, 11.8 + k], [28.8 - k, 12.6 + k], [28.8 - k, 19], [SX, 28.2 - k * 1.6], [21.6 + k, 19]]),
    round: (m, k = 0) => m.e(SX, SY, 4.3 - k, 4.3 - k),
    tower: (m, k = 0) => m.p([[21.2 + k, 13.6], [SX, 12 + k], [29.2 - k, 13.6], [29.2 - k, 27 - k], [21.2 + k, 27 - k]]),
    buckler: (m, k = 0) => m.e(SX - .4, SY - .4, 3 - k, 3 - k),
    oval: (m, k = 0) => m.e(SX, SY + .6, 3.7 - k, 5.6 - k)   // v25
  };
  const EMB = {
    cross: (m, c = SY) => m.r(SX - .6, c - 4.4, 1.2, 8).r(SX - 2.9, c - 2.4, 5.8, 1.2),
    chevron: m => m.p([[21.8, 18.4], [SX, 15.6], [28.6, 18.4], [28.6, 20], [SX, 17.2], [21.8, 20]]),
    star: m => m.p(kit().star(SX, SY - .6, 2.7, 1.1)),
    sun: m => m.e(SX, SY - .6, 1.7, 1.7).pts([[SX, SY - 3.6], [SX, SY + 2.4], [SX - 3, SY - .6], [SX + 3, SY - .6], [SX - 2, SY - 2.6], [SX + 2, SY - 2.6], [SX - 2, SY + 1.4], [SX + 2, SY + 1.4]]),
    boss: m => m.e(SX, SY, 1.2, 1.2),
    bands: m => m.r(21.4, 17, 7.8, .9).r(21.4, 21.6, 7.8, .9),
    eye: m => m.e(SX, SY, 2.2, 1.2),
    studs: m => m.pts([[SX, SY - 3], [SX - 3, SY], [SX + 3, SY], [SX, SY + 3], [SX - 2, SY - 2], [SX + 2, SY + 2], [SX - 2, SY + 2], [SX + 2, SY - 2]]),
    stripe: m => m.r(SX - .8, 12, 1.6, 16),
    /* v23 */
    moon: m => m.e(SX - .4, SY - .6, 2.6, 2.6).sub(t => t.e(SX + .8, SY - 1.2, 2.2, 2.2)),
    tiger: m => m.l(21.6, 15, 24.6, 16.4, .8).l(28.8, 15, 25.8, 16.4, .8).l(21.6, 19, 24.2, 20, .8).l(28.8, 19, 26.2, 20, .8).l(23, 23, 24.6, 23.6, .7).l(27.4, 23, 25.8, 23.6, .7),
    gem: m => m.p([[SX, SY - 4], [SX + 2.4, SY - 1], [SX, SY + 3.2], [SX - 2.4, SY - 1]]),
    hex: m => [[SX, SY - 2.4], [SX - 2.2, SY + 1], [SX + 2.2, SY + 1]].forEach(([x, y]) => m.p([[x - 1.1, y - .7], [x, y - 1.4], [x + 1.1, y - .7], [x + 1.1, y + .7], [x, y + 1.4], [x - 1.1, y + .7]])),
    flower: m => { for (let i = 0; i < 6; i++) { const t = i * Math.PI / 3; m.e(SX + Math.cos(t) * 1.7, SY + Math.sin(t) * 1.7, .9, .9); } },
    /* v25 */
    wave: m => [16.4, 20.2].forEach(y => m.l(21.8, y + 1.2, 23.4, y, .8).l(23.4, y, 25, y + 1.2, .8).l(25, y + 1.2, 26.6, y, .8).l(26.6, y, 28.4, y + 1.2, .8)),
    paw: m => m.e(SX, SY + 1, 1.8, 1.5).e(SX - 2, SY - 1.4, .8, .9).e(SX - .7, SY - 2.6, .8, .9).e(SX + .7, SY - 2.6, .8, .9).e(SX + 2, SY - 1.4, .8, .9),
    bolt: m => m.p([[SX + .6, SY - 5], [SX - 1.8, SY + .4], [SX - .2, SY + .4], [SX - 1, SY + 5], [SX + 1.8, SY - .8], [SX + .2, SY - .8], [SX + 1.2, SY - 5]]),
    crown: m => m.p([[SX - 2.8, SY + 1.6], [SX - 2.8, SY - 2], [SX - 1.4, SY - .6], [SX, SY - 2.8], [SX + 1.4, SY - .6], [SX + 2.8, SY - 2], [SX + 2.8, SY + 1.6]]),
    scales: m => [[SX - 1.2, 16.4], [SX + 1.2, 16.4], [SX - 2.4, 19], [SX, 19], [SX + 2.4, 19], [SX - 1.2, 21.6], [SX + 1.2, 21.6], [SX, 24.2]].forEach(([x, y]) => m.e(x, y, 1.2, 1.2).sub(t => t.e(x, y + .7, 1.2, 1.2)))
  };
  const shield = (a, shape, face, rim, emb, embC) => {
    const { lt, dk } = kit();
    a({ g: 'shield', c: rim, m: m => shapes[shape](m) });
    a({ g: 'shield', c: face, sep: false, m: m => shapes[shape](m, shape === 'round' || shape === 'buckler' ? .8 : .8) });
    /* v19: bevel (light top-left inner edge, dark bottom-right), boss rivets round the rim */
    a({ g: 'shield', c: lt(face, .28), flat: true, sep: false, m: m => { shapes[shape](m, .8); m.sub(t => shapes[shape](t, 1.25)).and(t => t.p([[SX - 20, SY - 20], [SX + 20, SY - 20], [SX - 20, SY + 20]])); } });
    a({ g: 'shield', c: dk(face, .3), flat: true, sep: false, m: m => { shapes[shape](m, .8); m.sub(t => shapes[shape](t, 1.25)).and(t => t.p([[SX + 20, SY - 20], [SX + 20, SY + 20], [SX - 20, SY + 20]])); } });
    if (emb) a({ g: 'shield', c: embC || rim, sep: false, m: m => { EMB[emb](m); m.and(t => shapes[shape](t, .8)); } });
    const RV = { heater: [[21.95, 13.75], [28.45, 13.75], [21.95, 19.8], [28.45, 19.8], [SX, 25.7]], kite: [[22.15, 13.1], [28.25, 13.1], [SX, 12.35], [22.15, 18.6], [28.25, 18.6], [SX, 27.1]],
      tower: [[21.75, 14.2], [28.65, 14.2], [21.75, 26.3], [28.65, 26.3], [21.75, 20.2], [28.65, 20.2]], round: [0, 1, 2, 3, 4, 5, 6, 7].map(i => [SX + Math.cos(i * Math.PI / 4) * 3.85, SY + Math.sin(i * Math.PI / 4) * 3.85]),
      buckler: [0, 1, 2, 3, 4, 5].map(i => [SX - .4 + Math.cos(i * Math.PI / 3) * 2.6, SY - .4 + Math.sin(i * Math.PI / 3) * 2.6]),
      oval: [0, 1, 2, 3, 4, 5, 6, 7].map(i => [SX + Math.cos(i * Math.PI / 4) * 3.25, SY + .6 + Math.sin(i * Math.PI / 4) * 5.1]) }[shape] || [];
    a({ g: 'shield', c: lt(rim, .45), flat: true, sep: false, m: m => RV.forEach(([x, y]) => m.r(x - .34, y - .34, .68, .68)), fine: RV.map(([x, y]) => [x - .34, y - .34]) });
  };
  const S_ITEM = {
    shield_wood: a => shield(a, 'buckler', '#8B5E3C', '#5E6670', 'boss', '#9AA3AE'),
    shield_lid: a => shield(a, 'round', '#7E878F', '#4A525A', 'boss', '#B8C2CC'),
    shield_cookie: a => shield(a, 'round', '#7A4E2D', '#4A525A', 'studs', '#C9D1D6'),
    shield_book: a => shield(a, 'heater', '#2E4F86', GOLD, 'chevron', GOLD),
    shield_heart: a => shield(a, 'kite', '#8E2A2A', GOLD, 'stripe', GOLD),
    shield_rainbow: a => shield(a, 'heater', '#2F5A4A', GOLD, 'sun', GOLD),
    shield_star: a => shield(a, 'heater', '#25304F', '#B8C2CC', 'star', GOLD),
    shield_planet: a => shield(a, 'tower', '#3B2D4F', GOLD, 'eye', '#E0573B'),
    /* v23 */
    shield_batik: a => { shield(a, 'round', '#2E7A7A', GOLD, 'flower', '#F2C14E'); a({ g: 'shield', c: '#8E2A5A', flat: true, sep: false, m: m => m.e(SX, SY, .8, .8) }); },
    shield_turtle: a => shield(a, 'round', '#4E8A3E', '#7A5232', 'hex', '#9AC94E'),
    shield_moon: a => shield(a, 'kite', '#1E2E5A', '#B8C2CC', 'moon', '#F2EAD8'),
    shield_tiger: a => shield(a, 'heater', '#E8862E', '#3A2A1E', 'tiger', '#2A1E14'),
    /* v25 */
    shield_wave: a => shield(a, 'kite', '#2E6A9A', '#E8F4FF', 'wave', '#9EE0F0'),
    shield_paw: a => shield(a, 'round', '#C98A3E', '#5A3A22', 'paw', '#F2EAD8'),
    shield_bolt: a => { shield(a, 'tower', '#2B3550', '#F2D24E', 'bolt', '#F2D24E'); a({ g: 'shield', c: '#FFF8C8', flat: true, sep: false, fr: [0, 2, 4], m: m => m.pts([[22.4, 15], [28, 25]]) }); },
    shield_crown: a => shield(a, 'heater', '#5A2E7A', GOLD, 'crown', '#F2C14E'),
    shield_scale: a => shield(a, 'oval', '#2E7A4E', '#B8C2CC', 'scales', '#7AD08A'),
    shield_crystal: a => { shield(a, 'heater', '#7A5AC9', '#E8D8FF', 'gem', '#E8D8FF'); [[22.6, 14.6, [0, 2]], [27.6, 22, [1, 3]]].forEach(([x, y, fr]) => a({ g: 'shield', c: '#FFFFFF', flat: true, sep: false, fr, m: m => m.pts([[x, y - .6], [x - .6, y], [x, y], [x + .6, y], [x, y + .6]]) })); }
  };

  /* ---------------- capes and wings, hung behind ---------------- */
  const capeShape = m => m.p([[12.6, 12], [21.4, 12], [24.6, 28], [22.2, 30.2], [19.2, 28.6], [16.2, 30.4], [13.2, 28.6], [10.2, 30.2], [8.6, 28]]);
  const cape = (a, c, trim) => { a({ g: 'cape', c, tex: 'cloth', m: capeShape }); a({ g: 'cape', c: kit().dk(c, .3), flat: true, sep: false, m: m => capeShape(m).and(t => t.l(14.6, 14, 12.2, 29.6, .5).l(19.6, 14, 22, 29.4, .5).l(17, 15, 17.2, 29.8, .4)) }); if (trim) a({ g: 'cape', c: trim, sep: false, m: m => capeShape(m).and(t => t.r(0, 28.4, 32, 3)) }); };
  const C_ITEM = {
    cape_red: a => cape(a, '#8E2A2A', GOLD),
    cape_leaf: a => { cape(a, '#3F5F3A'); a({ g: 'cape', c: '#2E4A2C', flat: true, sep: false, m: m => capeShape(m).and(t => t.l(16.5, 12, 16.5, 30, .6)) }); },
    cape_star: a => cape(a, '#2E3F86', GOLD),
    wings_butterfly: a => { a({ g: 'cape', c: '#2A2338', m: m => m.p([[12.6, 12], [21.4, 12], [25, 27], [23, 30.6], [21, 28], [19, 31], [16.5, 28.4], [14, 31], [12, 28], [10, 30.6], [8, 27]]) }); },
    wings_angel: a => { a({ g: 'cape', c: '#C8B89A', m: m => m.p([[13, 13], [4, 6], [2, 11], [4, 14], [2.6, 18], [6, 20], [12.6, 18]]).p([[20, 13], [29, 6], [31, 11], [29, 14], [30.4, 18], [27, 20], [20.4, 18]]) }); a({ g: 'cape', c: '#8E7A5E', flat: true, sep: false, m: m => m.l(5, 9, 11, 14, .6).l(4, 15, 11, 17, .6).l(28, 9, 22, 14, .6).l(29, 15, 22, 17, .6) }); },
    cape_rainbow: a => { a({ g: 'cape', c: '#8E2A2A', m: capeShape }); a({ g: 'cape', c: '#C9A13B', sep: false, m: m => capeShape(m).and(t => t.r(16.5, 0, 16, 32)) }); },
    cape_gold: a => { cape(a, '#C9A13B'); a({ g: 'cape', c: '#F2EAD8', m: m => m.e(12.4, 12.4, 2.4, 1.6).e(21.6, 12.4, 2.4, 1.6).r(12, 11.4, 10, 1.6) }); },
    /* v23 */
    cape_ocean: a => { cape(a, '#2E6A9A', '#C9D8E8'); a({ g: 'cape', c: '#8ED0F2', flat: true, sep: false, m: m => capeShape(m).and(t => t.l(9.6, 24, 12, 22.8, .5).l(12, 22.8, 14.4, 24, .5).l(14.4, 24, 16.8, 22.8, .5).l(16.8, 22.8, 19.2, 24, .5).l(19.2, 24, 21.6, 22.8, .5).l(21.6, 22.8, 24, 24, .5)) }); },
    cape_tiger: a => { cape(a, '#E0802E'); a({ g: 'cape', c: '#2A1E14', flat: true, sep: false, m: m => capeShape(m).and(t => t.l(11, 16, 14.6, 17.6, .8).l(23, 16, 19.4, 17.6, .8).l(10.2, 21, 14, 22.4, .8).l(24, 21, 20.2, 22.4, .8).l(10, 26, 13.4, 27, .7).l(24.2, 26, 20.8, 27, .7)) }); },
    cape_batik: a => { cape(a, '#6A2E7A', GOLD); a({ g: 'cape', c: '#F2C14E', flat: true, sep: false, m: m => capeShape(m).and(t => [[13, 17], [20.4, 18], [16.6, 22], [12.4, 25], [21.2, 25.6]].forEach(([x, y]) => { for (let i = 0; i < 5; i++) { const q = i * Math.PI * 2 / 5; t.e(x + Math.cos(q) * .9, y + Math.sin(q) * .9, .5, .5); } })) }); },
    cape_night: a => { cape(a, '#1E1E4A', '#B8C2CC'); a({ g: 'cape', c: '#FFF3C4', flat: true, sep: false, m: m => capeShape(m).and(t => t.pts([[12, 16], [19, 15], [15.6, 19], [21.6, 21], [11.4, 23], [17.6, 25.6], [14, 28], [20.6, 27.6]])) }); a({ g: 'cape', c: '#F2EAD8', flat: true, sep: false, m: m => capeShape(m).and(t => t.e(20.4, 17.6, 1.2, 1.2).sub(u => u.e(21, 17.2, 1, 1))) }); },
    /* v25 */
    cape_sunset: a => { cape(a, '#E8702E', '#F2C14E'); a({ g: 'cape', c: '#D9487A', sep: false, m: m => capeShape(m).and(t => t.r(0, 21, 32, 4)) }); a({ g: 'cape', c: '#7A3E9A', sep: false, m: m => capeShape(m).and(t => t.r(0, 25, 32, 3.4)) }); a({ g: 'cape', c: '#FFE98A', flat: true, sep: false, m: m => capeShape(m).and(t => t.e(17, 19.4, 2.4, 2.4)) }); },
    cape_checker: a => { cape(a, '#F2EAD8', '#2A2A33'); a({ g: 'cape', c: '#2A2A33', flat: true, sep: false, m: m => capeShape(m).and(t => { for (let y = 0; y < 8; y++) for (let x = 0; x < 9; x++) if ((x + y) % 2) t.r(8 + x * 2, 12 + y * 2, 2, 2); }) }); },
    cape_feather: a => { cape(a, '#1E1E24', '#F2C14E'); a({ g: 'cape', c: '#F2EAD8', sep: false, m: m => capeShape(m).and(t => t.r(0, 23.4, 32, 3.2)) }); a({ g: 'cape', c: '#3A3A44', flat: true, sep: false, m: m => capeShape(m).and(t => t.l(11, 14, 12.4, 22, .4).l(14.4, 14, 15.2, 22, .4).l(18.4, 14, 18.6, 22, .4).l(21.6, 14, 21.2, 22, .4)) }); a({ g: 'cape', c: '#E8402E', flat: true, sep: false, m: m => capeShape(m).and(t => t.r(0, 28.4, 32, .8)) }); },
    cape_galaxy: a => { cape(a, '#2A1E5A', '#B58CF2'); a({ g: 'cape', c: '#7A5AC9', flat: true, sep: false, m: m => capeShape(m).and(t => t.e(17, 21, 4.6, 3).sub(u => u.e(17.6, 21.4, 3.4, 2))) }); [[12, 16, [0, 2], '#FFF3C4'], [21, 15.6, [1, 3], '#9ED8F0'], [14.4, 26, [2, 0], '#FFB8E0'], [20.6, 26.4, [3, 1], '#FFF3C4']].forEach(([x, y, fr, c]) => a({ g: 'cape', c, flat: true, sep: false, fr, m: m => capeShape(m).and(t => t.pts([[x, y - 1], [x - 1, y], [x, y], [x + 1, y], [x, y + 1]])) })); },
    wings_dragon: a => { const W = [[13, 13], [6, 5], [4.6, 8.4], [2, 8.6], [3, 12], [.8, 13.6], [3.6, 16], [2.6, 19], [7, 18.4], [12.6, 18]]; a({ g: 'cape', c: '#3E8A5A', m: m => m.p(W).p(W.map(([x, y]) => [33 - x, y])) }); a({ g: 'cape', c: '#25603C', flat: true, sep: false, m: m => m.l(12, 13.6, 4.6, 8.4, .5).l(12, 14.6, 3, 12, .5).l(12, 15.6, 3.6, 16, .5).l(21, 13.6, 28.4, 8.4, .5).l(21, 14.6, 30, 12, .5).l(21, 15.6, 29.4, 16, .5) }); a({ g: 'cape', c: '#D8CDB0', flat: true, sep: false, m: m => m.pts([[6, 5], [27, 5]]) }); },
    wings_phoenix: a => { a({ g: 'cape', c: '#E8602E', m: m => m.p([[13, 13], [4, 6], [2, 11], [4, 14], [2.6, 18], [6, 20], [12.6, 18]]).p([[20, 13], [29, 6], [31, 11], [29, 14], [30.4, 18], [27, 20], [20.4, 18]]) }); a({ g: 'cape', c: '#F2C14E', flat: true, sep: false, m: m => m.l(5, 9, 11, 14, .6).l(4, 15, 11, 17, .6).l(28, 9, 22, 14, .6).l(29, 15, 22, 17, .6) }); a({ g: 'cape', c: '#FFF3A8', flat: true, sep: false, fr: [0, 2], m: m => m.pts([[3, 11], [30, 11]]) }); }
  };

  /* ---------------- v38: armour pieces (helmets, body armor, gauntlets, leg armor) ----------------
     Every piece changes the part of the knight it covers, so each one draws a different knight. A piece that is not worn leaves
     the knight's own armour alone (the 'none' items). */
  const eb = (a, g, c, m, fr) => a({ g, c, flat: true, sep: false, fr, m });
  const EMX = {   // a badge on the breastplate
    star: c => (a, { star }) => eb(a, 'torso', c, m => m.p(star(17, 15.2, 2.3, .95))),
    sun: c => a => { eb(a, 'torso', c, m => m.e(17, 15.2, 1.3, 1.3)); eb(a, 'torso', c, m => m.pts([[17, 12.4], [17, 18], [14.2, 15.2], [19.8, 15.2], [15, 13.2], [19, 13.2], [15, 17.2], [19, 17.2]])); },
    wave: c => a => [13.4, 16.2].forEach(y => eb(a, 'torso', c, m => m.l(13.6, y + 1, 15.2, y, .7).l(15.2, y, 16.8, y + 1, .7).l(16.8, y + 1, 18.4, y, .7).l(18.4, y, 20, y + 1, .7))),
    bolt: c => a => eb(a, 'torso', c, m => m.p([[17.8, 12], [15.2, 15.6], [16.8, 15.6], [16, 18.6], [19, 14.6], [17.2, 14.6], [18.4, 12]])),
    heart: c => a => eb(a, 'torso', c, m => m.e(16, 14.6, 1.3, 1.3).e(18, 14.6, 1.3, 1.3).p([[14.8, 15.2], [19.2, 15.2], [17, 18]])),
    crown: c => a => eb(a, 'torso', c, m => m.p([[14.6, 17.4], [14.6, 13.8], [15.8, 15.2], [17, 13], [18.2, 15.2], [19.4, 13.8], [19.4, 17.4]])),
    leaf: c => a => { eb(a, 'torso', c, m => m.e(17, 15.2, 1.5, 2.8)); eb(a, 'torso', '#171A21', m => m.l(17, 12.8, 17, 17.8, .3)); },
    rings: c => a => [13.6, 15.6, 17.6].forEach(y => eb(a, 'torso', c, m => m.r(14.2, y, 5.6, .5)))
  };
  const GLX = {   // marks on the gauntlets
    spikes: c => a => eb(a, 'weap', c, m => m.p([[GX - 1.1, GY - .5], [GX - 1.9, GY - 1.7], [GX - .5, GY - 1]]).p([[GX + .2, GY - 1], [GX + .4, GY - 2.2], [GX + 1.2, GY - .8]])),
    glow: c => a => eb(a, 'weap', c, m => m.pts([[GX, GY - 1.6], [GX - 1.2, GY + .6]]), [0, 2]),
    studs: c => a => eb(a, 'weap', c, m => m.pts([[10.4, 15.4], [9.6, 16.2], [11.2, 14.6]])),
    cuff: c => a => eb(a, 'weap', c, m => m.r(9.2, 16.2, 2.4, .8))
  };
  const LGX = {   // marks on the leg armour
    flame: c => a => eb(a, 'legs', c, m => m.pts([[11.2, 28.2], [12.8, 27.6], [20.4, 27.8], [21.6, 28.4]]), [0, 2]),
    glow: c => a => eb(a, 'legs', c, m => m.pts([[12, 23.4], [20.6, 23.6]]), [1, 3]),
    stripe: c => a => eb(a, 'legs', c, m => m.l(13.4, 21.4, 12, 24.4, .5).l(19.8, 21.4, 20.4, 24.4, .5)),
    spots: c => a => eb(a, 'legs', c, m => m.pts([[13, 22.4], [12, 24], [20, 22.6], [20.6, 24]]))
  };
  const HLX = {   // marks on the helmets
    side: c => a => eb(a, 'head', c, m => m.r(13.5, 6, .5, 3.4).r(20, 6, .5, 3.4)),
    brow: c => a => eb(a, 'head', c, m => m.r(14.2, 5.6, 5.8, .6)),
    cheek: c => a => eb(a, 'head', c, m => m.r(13.7, 8.6, 1, 2).r(19.4, 8.6, 1, 2))
  };
  const ARM = {
    /* helmets */
    helm_bucket: { helm: 'box', visor: 'slit', plume: null, hSteel: '#8E979E', hDark: '#5A6068', hTrim: '#B8C2CC', hx: HLX.brow('#5A6068') },
    helm_ranger: { helm: 'sallet', visor: 'slit', plume: '#E8C44E', hSteel: '#5E8A4E', hDark: '#2E4A2C', hTrim: '#C9D86A', hGem: '#C9D86A' },
    helm_viking: { helm: 'horned', visor: 't', plume: null, hSteel: '#B0A590', hDark: '#6A6050', hTrim: '#C9A13B', hx: HLX.side('#6A6050') },
    helm_dragon: { helm: 'fin', crest: '#E8502E', visor: 'bars', plume: null, hSteel: '#8E3A2E', hDark: '#5A241C', hTrim: '#FFB84D', hGem: '#FFD166' },
    helm_wing: { helm: 'winged', visor: 'slit', plume: null, hSteel: '#E6EEF6', hDark: '#9AA8B8', hTrim: '#F2C14E', hx: HLX.cheek('#9AA8B8') },
    helm_sun: { helm: 'crown', visor: 'grill', plume: '#FFD166', hSteel: '#C98A3E', hDark: '#7A4E22', hTrim: '#FFF3A8', hGem: '#E8402E' },
    helm_shadow: { helm: 'great', visor: 'glow', glow: '#B58CF2', plume: null, hSteel: '#3A3650', hDark: '#221E34', hTrim: '#8C7BD8', hGem: '#B58CF2' },
    helm_frost: { helm: 'box', visor: 'cross', plume: '#9EE0F0', hSteel: '#BFE3F2', hDark: '#6A9AB8', hTrim: '#FFFFFF', hx: HLX.side('#FFFFFF') },
    /* body armor */
    chest_leather: { cSteel: '#8A5A32', cDark: '#5A3A22', cloth: '#C9A874', trim: '#5A3A22', cx: EMX.rings('#5A3A22') },
    chest_mail: { cSteel: '#A5ADB5', cDark: '#5A6068', cloth: '#3E5A7A', trim: '#D8DEE4' },
    chest_cross: { cSteel: '#CDD4DC', cDark: '#8792A3', cloth: '#F2EAD8', trim: '#C0392B', emblem: 'cross' },
    chest_forest: { cSteel: '#5E8A4E', cDark: '#2E4A2C', cloth: '#2E4A2C', trim: '#C9D86A', cx: EMX.leaf('#C9D86A') },
    chest_flame: { cSteel: '#B8442E', cDark: '#6A2418', cloth: '#2A1E14', trim: '#FFB84D', cx: EMX.sun('#FFD166') },
    chest_tide: { cSteel: '#4E9AB8', cDark: '#2E6A88', cloth: '#1E3A5A', trim: '#E8F4FF', cx: EMX.wave('#E8F4FF') },
    chest_royal: { cSteel: '#D9B24B', cDark: '#8A6A1E', cloth: '#5A2E7A', trim: '#F2EAD8', cx: EMX.crown('#5A2E7A') },
    chest_storm: { cSteel: '#6A7890', cDark: '#3A4660', cloth: '#2B3550', trim: '#F2D24E', cx: EMX.bolt('#F2D24E') },
    /* gauntlets */
    glove_leather: { gSteel: '#8A5A32', gDark: '#5A3A22', gTrim: '#C9A874', gx: GLX.cuff('#C9A874') },
    glove_iron: { gSteel: '#8E979E', gDark: '#4A525A', gTrim: '#B8C2CC', gx: GLX.studs('#C9D1D6') },
    glove_gold: { gSteel: '#D9B24B', gDark: '#8A6A1E', gTrim: '#FFF3C4', gx: GLX.cuff('#FFF3C4') },
    glove_spike: { gSteel: '#555B63', gDark: '#2A2E33', gTrim: '#C0392B', gx: GLX.spikes('#C9D1D6') },
    glove_frost: { gSteel: '#BFE3F2', gDark: '#6A9AB8', gTrim: '#FFFFFF', gx: GLX.glow('#FFFFFF') },
    glove_ember: { gSteel: '#B8442E', gDark: '#6A2418', gTrim: '#FFB84D', gx: GLX.glow('#FFD166') },
    glove_vine: { gSteel: '#5E8A4E', gDark: '#2E4A2C', gTrim: '#9AC94E', gx: GLX.studs('#C9D86A') },
    glove_star: { gSteel: '#2E3F86', gDark: '#1E2A5A', gTrim: '#F2D24E', gx: GLX.glow('#F2D24E') },
    /* leg armor */
    legs_leather: { lSteel: '#8A5A32', lDark: '#5A3A22', lx: LGX.stripe('#C9A874') },
    legs_mail: { lSteel: '#A5ADB5', lDark: '#53656A', lx: LGX.spots('#6A7280') },
    legs_plate: { lSteel: '#B4BEC8', lDark: '#6A7480', lx: LGX.stripe('#E8EEF4') },
    legs_gold: { lSteel: '#D9B24B', lDark: '#8A6A1E', lx: LGX.stripe('#FFF3C4') },
    legs_leaf: { lSteel: '#5E8A4E', lDark: '#2E4A2C', lx: LGX.spots('#C9D86A') },
    legs_flame: { lSteel: '#B8442E', lDark: '#6A2418', lx: LGX.flame('#FFD166') },
    legs_wave: { lSteel: '#4E9AB8', lDark: '#1E3A5A', lx: LGX.stripe('#E8F4FF') },
    legs_shadow: { lSteel: '#3A3650', lDark: '#221E34', lx: LGX.glow('#B58CF2') }
  };
  const armored = (k, eq) => { let o = k; for (const sl of ['helmet', 'chest', 'gloves', 'legs']) { const id = eq && eq[sl]; if (id && ARM[id]) o = { ...o, ...ARM[id] }; } return o; };

  /* ---------------- the body ---------------- */
  function body(k0, eq) {
    const k = armored(k0, eq);   // v38: helmet, body armor, gauntlets and leg armor change how this knight looks
    const { lt, dk } = kit(), P = [], a = o => P.push(o);
    let st = k.steel, sd = k.dark, sl = lt(k.steel, .2);
    const W0 = eq.weapon || 'weapon_pencil', evo = W0.endsWith('+'), W = evo ? W0.slice(0, -1) : W0, SH = eq.shield || 'shield_none', CP = eq.cape || 'cape_none';   // v35: '+' = evolved
    /* cape */
    if (CP !== 'cape_none' && C_ITEM[CP]) C_ITEM[CP](a); else if (k.cape) cape(a, k.cape, k.capeTrim);
    /* horns behind the helm */
    if (k.helm === 'horned') a({ g: 'head', c: '#D8CDB0', m: m => m.l(14.4, 6.4, 11.6, 4.6, 1.5).l(11.6, 4.6, 10.8, 1.6, 1.1).l(19.6, 6.4, 22.4, 4.6, 1.5).l(22.4, 4.6, 23.2, 1.6, 1.1) });
    /* legs: wide stance, back leg reaching left, front leg planted right */
    st = k.lSteel || k.steel; sd = k.lDark || k.dark; sl = lt(st, .2);
    a({ g: 'legs', c: st, m: m => m.l(14.8, 20.4, 12.4, 25.2, 3.4).l(12.4, 25.2, 10.6, 29.2, 2.8) });
    a({ g: 'legs', c: st, m: m => m.l(19.2, 20.4, 20.4, 25.2, 3.4).l(20.4, 25.2, 21, 29.2, 2.8) });
    a({ g: 'legs', c: lt(st, .38), flat: true, sep: false, m: m => m.l(12.2, 26.4, 11, 28.6, .4).l(20.7, 26.4, 20.9, 28.6, .4).l(14.2, 21, 13, 24, .34).l(19.6, 21, 20.2, 24, .34) });   // v19 greave ridges
    a({ g: 'legs', c: sl, m: m => m.e(12.4, 25.2, 1.7, 1.5).e(20.4, 25.2, 1.7, 1.5), fine: [[12, 24.6], [20, 24.6]] });
    a({ g: 'legs', c: dk(sl, .32), flat: true, sep: false, m: m => m.e(12.4, 25.2, 1.7, 1.5).and(t => t.r(0, 25.7, 32, .34)).e(12.4, 25.2, 1.7, 1.5).and(t => t.r(0, 25.7, 32, .34)).e(20.4, 25.2, 1.7, 1.5).and(t => t.r(0, 25.7, 32, .34)) });
    a({ g: 'legs', c: sd, m: m => m.p([[6.8, 31], [7.6, 29.2], [11.6, 28.8], [12.4, 31]]).p([[19.4, 31], [19.8, 28.8], [23.6, 29.4], [25.2, 31]]) });
    a({ g: 'legs', c: dk(sd, .38), flat: true, sep: false, m: m => m.l(7.6, 30, 11.8, 29.7, .34).l(20, 29.8, 24, 30.2, .34) });   // sabaton lames
    if (k.lx) k.lx(a, kit());
    /* tabard, breastplate, belt */
    st = k.cSteel || k.steel; sd = k.cDark || k.dark;
    a({ g: 'torso', c: IRON, tex: 'mail', m: m => m.p([[13.6, 19], [20.4, 19], [21.6, 23.4], [12.4, 23.4]]) });   // v19 mail skirt peeking out
    a({ g: 'torso', c: k.cloth, tex: 'cloth', m: m => m.p([[14.2, 19], [19.8, 19], [21.2, 27], [17.2, 28.2], [12.8, 27]]) });
    a({ g: 'torso', c: dk(k.cloth, .32), flat: true, sep: false, m: m => m.l(15.6, 20, 14.6, 27.2, .4).l(18.6, 20, 19.6, 27.2, .4) });   // tabard folds
    a({ g: 'torso', c: k.trim, flat: true, sep: false, m: m => m.l(12.9, 26.8, 17.2, 28, .7).l(17.2, 28, 21.1, 26.8, .7) });
    a({ g: 'torso', c: st, m: m => m.p([[12.8, 11.6], [21.2, 11.6], [21, 16.6], [19.6, 19.4], [14.4, 19.4], [13, 16.6]]), dots: [[14, 13], [15, 13], [14, 14]] });
    a({ g: 'torso', c: sd, flat: true, sep: false, m: m => m.l(17, 12.6, 17, 18.6, .5) });
    a({ g: 'torso', c: lt(st, .4), flat: true, sep: false, m: m => m.l(16.4, 12.8, 16.4, 16.4, .34) });                    // ridge catch-light
    a({ g: 'torso', c: dk(st, .34), flat: true, sep: false, m: m => m.p([[12.8, 11.6], [21.2, 11.6], [21, 16.6], [19.6, 19.4], [14.4, 19.4], [13, 16.6]]).and(t => t.r(0, 16.9, 32, .34).r(0, 17.9, 32, .34)) });   // fauld lames
    a({ g: 'torso', c: lt(st, .5), flat: true, sep: false, m: m => m.r(13.9, 17.3, .34, .34).r(19.8, 17.3, .34, .34).r(14.2, 12.3, .34, .34).r(19.5, 12.3, .34, .34) });   // rivets
    if (k.emblem === 'cross') a({ g: 'torso', c: k.trim, flat: true, sep: false, m: m => m.r(16.4, 13.2, 1.2, 4.4).r(15.2, 14.4, 3.6, 1.1) });
    if (k.emblem === 'gem') a({ g: 'torso', c: k.glow || '#7FE7F2', flat: true, sep: false, m: m => m.e(17, 15.4, 1.1, 1.1) });
    a({ g: 'torso', c: LEATHER, sep: false, m: m => m.r(13.9, 18.6, 6.4, 1.3) });
    a({ g: 'torso', c: k.trim, sep: false, m: m => m.r(16.4, 18.4, 1.4, 1.7) });
    /* shoulder on the sword side */
    a({ g: 'torso', c: st, m: m => m.e(11.6, 12.8, 3.1, 2.4), dots: [[10, 11]] });
    a({ g: 'torso', c: k.trim, sep: false, m: m => m.e(11.6, 12.8, 3.1, 2.4).and(t => t.r(0, 14, 32, 1)) });
    a({ g: 'torso', c: dk(st, .36), flat: true, sep: false, m: m => m.e(11.6, 12.8, 3.1, 2.4).and(t => t.r(0, 12.9, 32, .34)) });
    a({ g: 'torso', c: lt(k.trim, .5), flat: true, sep: false, m: m => m.r(9.6, 14.2, .34, .34).r(11.6, 14.4, .34, .34).r(13.4, 14.2, .34, .34) });
    if (k.cx) k.cx(a, kit());
    /* sword arm, weapon, gauntlet */
    st = k.gSteel || k.steel; sd = k.gDark || k.dark;
    a({ g: 'weap', c: lt(sd, .12), tex: 'mail', m: m => m.l(11.6, 13.6, 9.6, 16.8, 2.6) });      // v19 mail sleeve
    a({ g: 'weap', c: st, m: m => m.l(9.6, 16.8, 8.6, 14.4, 2.4) });
    a({ g: 'weap', c: k.trim, flat: true, sep: false, m: m => m.l(10.4, 15.8, 8.9, 16.6, .4) });          // vambrace band
    if (evo) {   /* v35: the evolved weapon is tinted gold and sparkles */
      const mix = c => /^#[0-9a-f]{6}$/i.test(c || '') ? '#' + [1, 3, 5].map((i, j) => Math.round(parseInt(c.substr(i, 2), 16) * .62 + [255, 214, 102][j] * .38).toString(16).padStart(2, '0')).join('') : c;
      (WEAPONS[W_ITEM[W] || k.weapon] || WEAPONS.sword)(o => a(o.g === 'weap' && o.c ? { ...o, c: mix(o.c) } : o));
      a({ g: 'weap', c: '#FFF3C4', flat: true, sep: false, fr: [0, 2], m: m => m.pts([[GX + 1.8, 2.4], [GX - 2, 5.6]]) }); a({ g: 'weap', c: '#FFD166', flat: true, sep: false, fr: [1, 3], m: m => m.pts([[GX - 1.6, 1.4], [GX + 2.2, 7]]) });
    } else (WEAPONS[W_ITEM[W] || k.weapon] || WEAPONS.sword)(a);
    a({ g: 'weap', c: sd, m: m => m.e(GX, GY + .2, 1.5, 1.4), fine: [[GX - .7, GY - .7]] });
    a({ g: 'weap', c: dk(sd, .45), flat: true, sep: false, m: m => m.r(GX - .55, GY - .5, .34, 1.3).r(GX + .25, GY - .5, .34, 1.3) });   // gauntlet fingers
    /* helm */
    if (k.gx) k.gx(a, kit());
    st = k.hSteel || k.steel; sd = k.hDark || k.dark;
    const kh = { ...k, trim: k.hTrim || k.trim };
    a({ g: 'head', c: lt(sd, .1), tex: 'mail', m: m => m.r(14.2, 10, 5.6, 1.8) });   // v19 mail coif / gorget
    const helm = {
      great: m => m.p([[13.9, 5.2], [14.8, 3.6], [19.2, 3.6], [20.1, 5.2], [20.3, 10.6], [13.7, 10.6]]),
      sallet: m => m.e(17, 7.2, 3.6, 3.8).r(13.4, 7.2, 7.2, 3.4),
      horned: m => m.p([[13.9, 5.6], [15, 3.4], [19, 3.4], [20.1, 5.6], [20.3, 10.6], [13.7, 10.6]]),
      box: m => m.r(13.8, 3.8, 6.6, 6.8).sub(t => t.pts([[13.8, 3.8], [19.8, 3.8]])),
      /* v25 */
      winged: m => m.e(17, 7.2, 3.6, 3.8).r(13.4, 7.2, 7.2, 3.4),
      fin: m => m.p([[13.9, 5.2], [14.8, 3.6], [19.2, 3.6], [20.1, 5.2], [20.3, 10.6], [13.7, 10.6]]),
      crown: m => m.p([[13.9, 5.6], [14.4, 4.2], [19.6, 4.2], [20.1, 5.6], [20.3, 10.6], [13.7, 10.6]])
    }[k.helm] || (m => m);
    a({ g: 'head', c: st, m: helm, dots: [[15, 4], [15, 5], [14, 6]] });
    /* v25 helm crests */
    if (k.helm === 'winged') { a({ g: 'head', c: '#F2EAD8', m: m => m.p([[13.8, 6.6], [10.2, 2.8], [10.8, 5.2], [9.2, 5.4], [11.4, 7.4], [13.8, 8.4]]) }); a({ g: 'head', c: '#C9B8A8', flat: true, sep: false, m: m => m.l(13.2, 6.8, 10.8, 4.4, .3).l(13.2, 7.6, 10.4, 6, .3) }); }
    if (k.helm === 'fin') { a({ g: 'plume', c: k.crest, m: m => m.p([[14.6, 4.2], [15.2, 1.2], [18.8, .2], [17.8, 2.2], [19.8, 3.8]]) }); a({ g: 'plume', c: lt(k.crest, .35), flat: true, sep: false, m: m => m.l(15.6, 3.6, 16.2, 1.4, .3).l(17, 3.6, 17.6, 1.2, .3) }); }
    if (k.helm === 'crown') { a({ g: 'head', c: GOLD, m: m => m.p([[14.2, 4.6], [14.2, 1.8], [15.5, 3.2], [17.1, 1], [18.7, 3.2], [20, 1.8], [20, 4.6]]) }); a({ g: 'head', c: '#E8402E', flat: true, sep: false, m: m => m.r(16.8, 3, .6, .6) }); }
    /* v19 helm detail: centre ridge, side rivets, breathing holes */
    if (k.helm !== 'sallet' && k.helm !== 'winged') a({ g: 'head', c: lt(st, .36), flat: true, sep: false, m: m => m.l(17.1, 3.9, 17.1, 5.6, .34) });
    a({ g: 'head', c: lt(st, .55), flat: true, sep: false, m: m => m.r(14.1, 9.7, .34, .34).r(19.6, 9.7, .34, .34) });
    if (kh.visor === 't' || kh.visor === 'cross' || kh.visor === 'glow') a({ g: 'head', c: '#11141A', flat: true, sep: false, m: m => m.r(18.4, 9.4, .34, .34).r(19.1, 9.4, .34, .34).r(18.75, 10, .34, .34).r(14.8, 9.4, .34, .34).r(15.5, 9.4, .34, .34) });
    const vis = {
      t: () => { a({ g: 'head', c: kh.trim, sep: false, m: m => m.r(14, 6.8, 6.2, 1.1).r(16.5, 6.8, 1.3, 3.6) }); a({ g: 'head', c: '#11141A', flat: true, sep: false, m: m => m.r(14.4, 8.1, 1.8, .9).r(18.1, 8.1, 1.8, .9) }); },
      bars: () => { a({ g: 'head', c: '#11141A', flat: true, sep: false, m: m => m.r(15, 6.4, 5, 3.6) }); a({ g: 'head', c: st, flat: true, sep: false, m: m => m.r(16.4, 6.4, .6, 3.6).r(18.2, 6.4, .6, 3.6) }); a({ g: 'head', c: kh.trim, sep: false, m: m => m.r(14.6, 5.8, 5.6, .7) }); },
      slit: () => { a({ g: 'head', c: '#11141A', flat: true, sep: false, m: m => m.r(14.6, 7.4, 5.6, 1) }); a({ g: 'head', c: kh.trim, sep: false, m: m => m.r(13.6, 9.6, 6.8, .7) }); },
      cross: () => { a({ g: 'head', c: kh.trim, sep: false, m: m => m.r(16.4, 4.4, 1.4, 6).r(14, 7, 6.4, 1.2) }); a({ g: 'head', c: '#11141A', flat: true, sep: false, m: m => m.r(14.4, 8.4, 1.6, .9).r(18.2, 8.4, 1.6, .9) }); },
      grill: () => { a({ g: 'head', c: '#11141A', flat: true, sep: false, m: m => m.r(14.8, 6.4, 5, 3.4) }); a({ g: 'head', c: kh.trim, flat: true, sep: false, m: m => m.r(14.8, 7.3, 5, .5).r(14.8, 8.5, 5, .5).r(16.9, 6.4, .6, 3.4) }); },
      glow: () => { a({ g: 'head', c: '#11141A', flat: true, sep: false, m: m => m.r(14.4, 6.6, 5.8, 2) }); a({ g: 'head', c: kh.glow || '#7FE7F2', flat: true, sep: false, m: m => m.r(14.8, 7.2, 5, .8).r(16.6, 5, 1, 2.2) }); }
    }[kh.visor]; if (vis) vis();
    if (k.plume) {
      a({ g: 'plume', c: k.plume, m: m => m.l(16.6, 3.8, 13.6, 1.8, 1.8).l(13.6, 1.8, 10.8, 3.4, 1.7).l(10.8, 3.4, 10, 6.8, 1.4), dots: [[14, 2]] });
      a({ g: 'plume', c: dk(k.plume, .34), flat: true, sep: false, m: m => m.l(15.8, 3.5, 13.6, 2.3, .34).l(13.4, 2.4, 11.4, 3.6, .34).l(11.3, 3.8, 10.6, 6.4, .34).l(10.4, 4.6, 9.8, 7.2, .34) });   // v19 feather strands
      a({ g: 'plume', c: lt(k.plume, .3), flat: true, sep: false, m: m => m.l(15.2, 2.7, 13.8, 1.6, .34).l(12.6, 1.9, 11.2, 2.8, .34) });
    }
    if (k.hGem) a({ g: 'head', c: k.hGem, flat: true, sep: false, fr: [0, 2], m: m => m.e(17.1, 5.2, .8, .8) });
    if (k.hx) k.hx(a, kit());
    st = k.cSteel || k.steel; sd = k.gDark || k.dark;
    /* shield arm + shield, out in front */
    a({ g: 'shield', c: lt(sd, .12), tex: 'mail', m: m => m.l(22.2, 13.6, 24.2, 17.6, 2.6) });
    a({ g: 'torso', c: st, m: m => m.e(22.4, 12.8, 3.1, 2.4), dots: [[21, 11]] });
    a({ g: 'torso', c: k.trim, sep: false, m: m => m.e(22.4, 12.8, 3.1, 2.4).and(t => t.r(0, 14, 32, 1)) });
    a({ g: 'torso', c: dk(st, .36), flat: true, sep: false, m: m => m.e(22.4, 12.8, 3.1, 2.4).and(t => t.r(0, 12.9, 32, .34)) });
    a({ g: 'torso', c: lt(k.trim, .5), flat: true, sep: false, m: m => m.r(20.4, 14.2, .34, .34).r(22.4, 14.4, .34, .34).r(24.2, 14.2, .34, .34) });
    if (SH !== 'shield_none' && S_ITEM[SH]) S_ITEM[SH](a); else shield(a, k.shield[0], k.shield[1], k.shield[2], k.shield[3], k.shield[4]);
    return P;
  }

  /* ---------------- the five knights ---------------- */
  const K = (o) => ({ ...o, build: eq => body(o, eq) });
  Object.defineProperty(K, 'body', { value: body });
  return {
    __body: body,
    __arm: ARM,
    knight_tobias: K({ name: 'Tiny Tobias', steel: '#9AA3AE', dark: '#5F6873', cloth: '#7A2A2A', trim: GOLD, helm: 'great', visor: 'bars', plume: '#C8402F', weapon: 'sword', shield: ['heater', '#8E2A2A', GOLD, 'chevron', GOLD] }),
    knight_aldric: K({ name: 'Sir Aldric', steel: '#8C9C9E', dark: '#53656A', cloth: '#2D4A50', trim: GOLD, helm: 'great', visor: 't', emblem: 'cross', weapon: 'longsword', shield: ['heater', '#2F5A68', GOLD, 'cross', GOLD] }),
    knight_elowen: K({ name: 'Lady Elowen', steel: '#C6CED8', dark: '#8792A3', cloth: '#34509A', trim: '#C9A13B', helm: 'sallet', visor: 'slit', plume: '#3E6BD6', weapon: 'spear', shield: ['kite', '#3B5C9E', '#C6CED8', 'star', '#F2F4F8'] }),
    knight_bram: K({ name: 'Bulwark Bram', steel: '#6D84AE', dark: '#465878', cloth: '#2B3550', trim: GOLD, helm: 'box', visor: 'cross', cape: '#9B2C2C', weapon: 'greatsword', shield: ['tower', '#3D4F78', GOLD, 'bands', GOLD] }),
    knight_onyx: K({ name: 'Onyx Warden', steel: '#3E3A58', dark: '#26223B', cloth: '#4B2C86', trim: '#8C7BD8', helm: 'horned', visor: 'glow', glow: '#7FE7F2', emblem: 'gem', cape: '#4B2C86', weapon: 'axe', shield: ['round', '#2A2640', '#8C7BD8', 'eye', '#7FE7F2'] }),
    /* v25 */
    knight_sakura: K({ name: 'Sakura Ranger', steel: '#E2C6D2', dark: '#9C7488', cloth: '#4E7A42', trim: '#F2C14E', helm: 'winged', visor: 'slit', cape: '#F2A3BE', capeTrim: '#FFF3F8', weapon: 'rapier', shield: ['buckler', '#E07A9A', '#F2EAD8', 'flower', '#FFF3F8'] }),
    knight_coral: K({ name: 'Coral Tidewarden', steel: '#5FB8B0', dark: '#2E6E6A', cloth: '#E8704E', trim: '#F2EAD8', helm: 'fin', crest: '#E8704E', visor: 't', weapon: 'glaive', shield: ['kite', '#2E6A9A', '#F2EAD8', 'stripe', '#9EE0F0'] }),
    knight_sol: K({ name: 'Sunforge Paladin', steel: '#C98A3E', dark: '#7A4E22', cloth: '#F2EAD8', trim: '#E8602E', helm: 'crown', visor: 'grill', plume: '#FFD166', emblem: 'cross', cape: '#E8602E', capeTrim: GOLD, weapon: 'warpick', shield: ['tower', '#E8602E', '#F2C14E', 'sun', '#FFF3A8'] })
  };
})();

/* dress-up items (hair, hats, outfits...) are worn by the Explorer Kid skin.
   When a knight is worn, their cards preview on the Explorer Kid so you still see the item. */
const DRESS = new Set(['skin', 'hair', 'face', 'outfit', 'hat', 'boots']);
function dressLook(eq) { return eq; }   // v17: the Armory is knights-only, so no Explorer Kid previews
Object.assign(STR, {
  'sl.knight': ['Knights', 'Kesatria'],
  'kn.sentinel': ['Plumed Sentinel · your first knight', 'Pengawal Berjambul · kesatria pertama kamu'],
  'kn.crusader': ['Crusader · cross shield and longsword', 'Pahlawan · perisai salib dan pedang panjang'],
  'kn.guardian': ['Silver Guardian · kite shield and blue plume', 'Penjaga Perak · perisai layang dan jambul biru'],
  'kn.bastion': ['Blue Bastion · tower shield and greatsword', 'Benteng Biru · perisai menara dan pedang besar'],
  'kn.onyx': ['Shadow Warden · glowing visor and battle axe', 'Pengawal Bayang · visor bercahaya dan kapak'],
  'kn.blossom': ['Blossom Ranger · winged helm and rapier', 'Renjer Bunga · topi keledar bersayap dan pedang rapier'],
  'kn.tide': ['Tide Warden · fin crest and sea glaive', 'Pengawal Ombak · jambul sirip dan glaive laut'],
  'kn.sunforge': ['Sun Paladin · crowned helm and war pick', 'Paladin Suria · topi keledar bermahkota dan beliung perang'],
  'kn.note': ['Hair, faces, outfits, hats and boots are worn by the Explorer Kid. Knights keep their armour, but tools, shields, capes and auras work on every knight!', 'Rambut, wajah, pakaian, topi dan kasut dipakai oleh Budak Penjelajah. Kesatria kekal dengan baju besi, tetapi alat, perisai, jubah dan aura boleh dipakai semua kesatria!'],
  'kn.wearKid': ['Wear Explorer Kid', 'Pakai Budak Penjelajah']
});

/* v18: Armory items keep their ids (saves keep what they own) but become real knightly gear */
[
  ['weapon_pencil', "Knight's Own Blade", 'Senjata kesatria'], ['weapon_crayon', 'Short Sword', 'Pedang pendek'],
  ['weapon_ruler', 'Iron Mace', 'Cokmar besi'], ['weapon_paintbrush', 'Hand Axe', 'Kapak tangan'],
  ['weapon_wand', "Knight's Spear", 'Lembing kesatria'], ['weapon_magnify', 'Longsword', 'Pedang panjang'],
  ['weapon_book', 'War Hammer', 'Tukul perang'], ['weapon_lollipop', 'Morning Star', 'Cokmar berduri'],
  ['weapon_quill', 'Halberd', 'Halberd'], ['weapon_torch', 'Flame Blade', 'Pedang api'],
  ['weapon_rainbow', 'Frost Glaive', 'Glaive ais'], ['weapon_starhammer', 'Golden Greatsword', 'Pedang besar emas'],
  ['shield_none', "Knight's Own Shield", 'Perisai kesatria'], ['shield_wood', 'Wooden Buckler', 'Perisai kayu kecil'],
  ['shield_lid', 'Iron Round Shield', 'Perisai bulat besi'], ['shield_cookie', 'Studded Shield', 'Perisai berpaku'],
  ['shield_book', 'Heraldic Shield', 'Perisai heraldik'], ['shield_heart', 'Crimson Kite Shield', 'Perisai layang merah'],
  ['shield_rainbow', 'Sunburst Shield', 'Perisai matahari'], ['shield_star', 'Star Crest Shield', 'Perisai jata bintang'],
  ['shield_planet', 'Dragon Tower Shield', 'Perisai menara naga'],
  ['cape_none', "Knight's Own Look", 'Gaya kesatria'], ['cape_red', 'Crimson Cape', 'Jubah merah'],
  ['cape_leaf', 'Ranger Cloak', 'Jubah renjer'], ['cape_star', 'Royal Cape', 'Jubah diraja'],
  ['wings_butterfly', 'Shadow Cloak', 'Jubah bayang'], ['wings_angel', 'Griffin Wings', 'Sayap grifon'],
  ['cape_rainbow', 'Banner Cape', 'Jubah panji'], ['cape_gold', 'Golden Mantle', 'Mantel emas'],
  ['aura_sparkle', 'Holy Glimmer', 'Kilauan suci'], ['aura_hearts', 'Ember Sparks', 'Percikan bara'],
  ['aura_ring', 'Rune Circle', 'Bulatan rune'], ['aura_stars', 'Storm Sparks', 'Percikan ribut']
].forEach(([id, en, ms]) => { if (ITEM[id]) Object.assign(ITEM[id], { en, ms }); });
Object.assign(STR, {
  'sl.weapon': ['Weapons', 'Senjata'], 'sl.cape': ['Capes', 'Jubah'],
  'sl.helmet': ['Helmets', 'Topi keledar'], 'sl.chest': ['Body armor', 'Baju besi'], 'sl.gloves': ['Gauntlets', 'Sarung tangan'], 'sl.legs': ['Leg armor', 'Kaki besi'],
  'ar.tip': ['Weapons add attack power. Shields soften the monster’s attacks.', 'Senjata menambah kuasa serangan. Perisai melembutkan serangan raksasa.']
});
