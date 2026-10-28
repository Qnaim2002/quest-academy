/* ================= v20: monster redesign — shared kit + the first ten species =================
   Every monster is drawn in the "monster style" of the pixel engine (09b): rounded volume shading lit
   from the top-left, warm lights and cool purple shadows, coloured outlines and gloss on wet or shiny
   things. This file holds the shared kit (eyes, mouths, weapons, gear) and the first ten species;
   09f adds the other ten species and the ten zone bosses.
   The level data still drives them: body (+ the species variant) -> species, colour -> one of the species'
   own colour schemes, eyes -> eye style, mouth -> mouth style, features -> gear that suits that creature.
   There are 960 body+colour+eye combos; the species variant breaks the 40 repeats, so all 1000 levels differ.
   All monsters face LEFT toward the hero. 6 frames: 0-3 idle, 4 hurt, 5 attack. */
const MON2 = (() => {
  const { mix, dk, lt, IDLE, NOTHURT, F, flipP } = PX.kit;
  const GOLD = '#D9A93B', STEEL = '#B4BDC6', IRON = '#6E7782', BONE = '#E8DEC4', WOOD = '#7E5434', LEATHER = '#6E4A30', INK = '#1C1426', EYEW = '#F7F1E0', MOUTH = '#3A1020', TEETH = '#FBF4E2', TONGUE = '#E8667A';
  const OFF = {
    body: F([[0, 0], [0, 0], [0, .5], [0, .5]], [2, 0], [-2, 0]),
    face: F([[0, 0], [0, 0], [0, .5], [0, .5]], [2, 0], [-2, 0]),
    back: F([[0, 0], [0, 0], [0, .5], [0, .5]], [2, 0], [-2, 0]),
    wing: F([[0, 0], [0, -1], [0, -1], [0, 0]], [2, 1], [-2, -1]),
    tail: F([[0, 0], [.5, 0], [.5, .5], [0, .5]], [2, 0], [-1, 0]),
    cape: F([[0, 0], [.5, 0], [.5, .5], [0, .5]], [2, 0], [0, 0]),
    weap: F([[0, 0], [0, .5], [0, .5], [0, 0]], [2, 1], [-4, -1]),
    float: F([[0, 0], [0, -1], [0, -1], [0, 0]], [2, -1], [-2, 0]),
    feet: F([[0, 0], [0, 0], [0, 0], [0, 0]], [1, 0], [-1, 0]),
    fly: F([[0, 0], [0, -1], [0, -1.5], [0, -.5]], [2, 0], [-2, -1]),
    flyw: F([[0, 0], [0, -1], [0, -1], [0, 0]], [2, 1], [-4, -2]),
    legs: F([[0, 0], [0, 0], [0, 0], [0, 0]], [1, 0], [-1, 0]),
    torso: F([[0, 0], [0, 0], [0, .5], [0, .5]], [1.5, 0], [-1, 0]),
    head: F([[0, 0], [0, 0], [0, .5], [0, .5]], [2, .5], [-1, 0]),
    arm: F([[0, 0], [0, .5], [0, .5], [0, 0]], [1, .5], [-2, -1]),
    shield: F([[0, 0], [0, .5], [0, .5], [0, 0]], [1, 0], [-2, 0]),
    plume: F([[0, 0], [-.5, 0], [-.5, .5], [0, .5]], [2, 1], [0, 0])
  };
  /* drawing helpers handed to every species */
  const kit = a => ({
    a,
    fl: (g, c, m, x = {}) => a({ g, c, flat: true, sep: false, m, ...x }),
    tri: (m, x, y, w, h) => m.p([[x - w, y], [x, y - h], [x + w, y]]),
    spark: (g, c, list) => list.forEach(([x, y, fr]) => a({ g, c, flat: true, sep: false, fr, m: m => m.pts([[x, y - 1], [x - 1, y], [x, y], [x + 1, y], [x, y + 1]]) })),
    dot: (g, c, list) => list.forEach(([x, y, fr]) => a({ g, c, flat: true, sep: false, fr, m: m => m.r(x, y, .7, .7) }))
  });

  /* ---------------- weapons, held at the front hand (hx,hy), pointing up ---------------- */
  const WEAPONS = [
    /* 0 spiked club */
    (h, x, y) => { h.a({ c: WOOD, tex: 'wood', m: m => m.l(x + .6, y + 3.6, x - 2.4, y - 7, 1.8).e(x - 3.2, y - 9.6, 2.8, 3.8) }); h.fl('weap', dk(WOOD, .35), m => m.l(x - 4.2, y - 11, x - 3.4, y - 9, .4).l(x - 2, y - 8, x - 1.6, y - 6.6, .4)); h.a({ c: STEEL, gloss: 1, m: m => m.p([[x - 6, y - 10.4], [x - 7.6, y - 10.8], [x - 6, y - 11.2]]).p([[x - 3.6, y - 13.2], [x - 3.2, y - 14.8], [x - 2.6, y - 13.2]]).p([[x - .6, y - 10.4], [x + .8, y - 10.6], [x - .6, y - 11.4]]).p([[x - 5.6, y - 7.4], [x - 7, y - 7], [x - 5.4, y - 6.6]]) }); },
    /* 1 curved dagger */
    (h, x, y) => { h.a({ c: STEEL, gloss: 1, m: m => m.p([[x - .6, y - 1.6], [x - 2.6, y - 6], [x - 2.4, y - 9.6], [x - 1.2, y - 7], [x + .6, y - 2]]) }); h.fl('weap', lt(STEEL, .5), m => m.l(x - 2, y - 8.4, x - 1.2, y - 3, .34)); h.a({ c: GOLD, m: m => m.l(x - 2.4, y - 1.4, x + 1.8, y - 2.2, 1) }); h.a({ c: LEATHER, m: m => m.l(x, y - 1, x + .6, y + 1.6, 1.2) }); },
    /* 2 spear with tassel */
    (h, x, y) => { h.a({ c: WOOD, m: m => m.l(x + 1, y + 6, x - 3, y - 12, 1.2) }); h.a({ c: STEEL, gloss: 1, m: m => m.p([[x - 3.2, y - 11.4], [x - 5, y - 14.6], [x - 4.2, y - 18.2], [x - 2.2, y - 15], [x - 2.2, y - 12]]) }); h.a({ c: '#C2403A', m: m => m.p([[x - 2.6, y - 11.2], [x - .6, y - 10.4], [x - 1.4, y - 7.6], [x - 2.4, y - 9]]) }); h.fl('weap', GOLD, m => m.l(x - 3.4, y - 11.6, x - 2, y - 11.2, .6)); },
    /* 3 crescent axe */
    (h, x, y) => { h.a({ c: WOOD, m: m => m.l(x + 1, y + 4, x - 1, y - 12, 1.4) }); h.a({ c: STEEL, gloss: 1, m: m => m.p([[x - 1.6, y - 12.6], [x - 5, y - 15.6], [x - 8.4, y - 13.2], [x - 9.2, y - 10], [x - 8, y - 6.8], [x - 5, y - 5.6], [x - 1.6, y - 8.6]]) }); h.fl('weap', dk(STEEL, .35), m => m.l(x - 2.4, y - 12, x - 2.4, y - 9, .5)); h.fl('weap', lt(STEEL, .55), m => m.l(x - 8.6, y - 12.6, x - 8.6, y - 8.4, .34)); },
    /* 4 gnarled staff with a glowing gem (gem colour = c) */
    (h, x, y, c) => { const gc = c || '#7FE7F2'; h.a({ c: WOOD, tex: 'wood', m: m => m.l(x + 1, y + 6, x - .6, y - 9, 1.4).l(x - .6, y - 9, x - 2.2, y - 11, 1).l(x - .6, y - 9, x + 1, y - 11.4, 1) }); h.a({ c: gc, gloss: 1, fr: [0, 1, 4, 5], m: m => m.e(x - .6, y - 12.4, 1.8, 1.8) }); h.a({ c: lt(gc, .3), gloss: 1, fr: [2, 3], m: m => m.e(x - .6, y - 12.4, 2, 2) }); h.spark('float', lt(gc, .5), [[x - 3.6, y - 14.6, [1, 3]], [x + 2, y - 13, [0, 2]]]); },
    /* 5 flanged mace */
    (h, x, y) => { h.a({ c: WOOD, m: m => m.l(x + .6, y + 3.4, x - 2, y - 6.4, 1.3) }); h.a({ c: IRON, gloss: 1, m: m => m.e(x - 2.6, y - 8.6, 2.6, 2.8).p([[x - 2.6, y - 13.4], [x - 1.4, y - 10.6], [x - 3.8, y - 10.6]]).p([[x - 7, y - 8.6], [x - 4.6, y - 7.4], [x - 4.6, y - 9.8]]).p([[x + 1.8, y - 8.6], [x - .6, y - 9.8], [x - .6, y - 7.4]]) }); h.fl('weap', GOLD, m => m.l(x - 1.6, y - 5.8, x - 1, y - 4.4, .7)); },
    /* 6 trident */
    (h, x, y) => { h.a({ c: WOOD, m: m => m.l(x + 1, y + 6, x - 2.2, y - 9.6, 1.2) }); h.a({ c: STEEL, gloss: 1, m: m => { m.l(x - 6.4, y - 10.8, x + 1.4, y - 9.4, 1).l(x - 6, y - 10.6, x - 6.8, y - 15.6, .9).l(x - 2.4, y - 10, x - 3.2, y - 17.2, 1).l(x + 1, y - 9.6, x + .6, y - 14.6, .9); h.tri(m, x - 6.8, y - 15.4, .8, 1.6); h.tri(m, x - 3.2, y - 17, .9, 1.8); h.tri(m, x + .6, y - 14.4, .8, 1.6); } }); },
    /* 7 scimitar */
    (h, x, y) => { h.a({ c: STEEL, gloss: 1, m: m => m.p([[x - .6, y - 2], [x - 1.2, y - 8], [x - 3, y - 13], [x - 5.6, y - 16.2], [x - 3.6, y - 11.6], [x - 1.6, y - 6], [x + .8, y - 2]]) }); h.fl('weap', lt(STEEL, .5), m => m.l(x - 1.8, y - 9, x - 4.4, y - 14.4, .34)); h.a({ c: GOLD, m: m => m.l(x - 2.4, y - 1.6, x + 2, y - 2.4, 1.1) }); h.a({ c: LEATHER, m: m => m.l(x + .2, y - 1.2, x + .8, y + 1.6, 1.2) }); h.a({ c: GOLD, m: m => m.e(x + .9, y + 2, .7, .7) }); }
  ];

  /* ---------------- eyes and mouths ---------------- */
  function face(h, A, m, F2) {
    const { a, fl } = h, g = A.faceG || 'face', style = A.eyeStyle || m.e, r0 = A.er || 1.6;
    let eyes = A.eyes ? A.eyes.map(e => e.slice()) : [], r = r0;
    if (style === 'big') r = r0 * 1.22;
    if (style === 'one' && A.cyclopsOK && eyes.length === 2) { eyes = [[(eyes[0][0] + eyes[1][0]) / 2, (eyes[0][1] + eyes[1][1]) / 2 - .2]]; r = r0 * 1.55; }
    if (style === 'three' && eyes.length === 2 && !A.profile && A.threeOK !== false) eyes.push([(eyes[0][0] + eyes[1][0]) / 2, Math.min(eyes[0][1], eyes[1][1]) - r0 * 1.9, .7]);
    const stalk = style === 'stalk' && A.stalkOK;
    if (stalk) eyes = eyes.map(([x, y], i) => { const X = x + (i ? 1.4 : -1.4), Y = y - 6.6; a({ g, c: A.stalkC || A.lidC, m: mm => mm.l(x, y + 1, X, Y + 1.2, 1.1) }); return [X, Y]; });
    const browC = A.browC || INK, G = A.gear || [], patched = F2.has('glasses') && G.includes('patch') && eyes.length > 1;
    eyes.forEach(([x, y, sc], i) => {
      const R = r * (sc || 1), left = i === 0;
      if (patched && i === 1) {
        a({ g, c: '#2A2030', m: mm => mm.e(x, y, R * 1.05, R * 1.05) });
        fl(g, '#2A2030', mm => mm.l(x - R * 2.8, y - R * 2, x + R * 1.8, y - R * .2, .5));
        return;
      }
      if (A.glow) {
        a({ g, c: A.glow, flat: true, fr: NOTHURT, m: mm => mm.e(x, y, R * 1.1, R * .72) });
        fl(g, lt(A.glow, .65), mm => mm.e(x - R * .25, y - R * .08, R * .48, R * .3), { fr: NOTHURT });
      } else {
        a({ g, c: EYEW, flat: true, fr: NOTHURT, m: mm => mm.e(x, y, R, R * 1.06) });
        fl(g, mix(EYEW, '#8C7EAE', .4), mm => mm.e(x, y, R, R * 1.06).and(t => t.r(0, y + R * .42, 32, 6)), { fr: NOTHURT });
        const ix = x - R * .3, iy = y + R * .06, ir = R * .64, ic = A.iris || '#C9862E';
        fl(g, ic, mm => mm.e(ix, iy, ir, ir * 1.08).and(t => t.e(x, y, R, R * 1.06)), { fr: NOTHURT });
        fl(g, dk(ic, .35), mm => mm.e(ix, iy, ir, ir * 1.08).and(t => t.e(x, y, R, R * 1.06).and(u => u.r(0, 0, 32, iy - ir * .3))), { fr: NOTHURT });
        fl(g, INK, mm => mm.e(ix - .1, iy + .05, ir * .48, ir * .62), { fr: NOTHURT });
        fl(g, '#FFFFFF', mm => mm.r(ix - ir * .62, iy - ir * .72, .45, .45), { fr: NOTHURT });
      }
      if (style === 'sleepy' && A.lidC) a({ g, c: A.lidC, sep: false, fr: NOTHURT, m: mm => mm.e(x, y, R + .2, R * 1.06 + .2).and(t => t.r(0, 0, 32, y - R * .05)) });
      /* angry brows slope down toward the middle of the face */
      if (A.brows !== false && !stalk && !sc) {
        const w = F2.has('eyebrows') ? .95 : .7;
        fl(g, browC, mm => (left && eyes.length > 1) || (A.profile) ? mm.l(x - R * 1.15, y - R * 1.55, x + R * .95, y - R * .85, w) : mm.l(x - R * .95, y - R * .85, x + R * 1.15, y - R * 1.55, w));
      }
      /* hurt: eyes squeezed shut */
      a({ g, c: INK, flat: true, sep: false, fr: [4], m: mm => left ? mm.l(x - R, y - R * .7, x + R * .7, y, .55).l(x + R * .7, y, x - R, y + R * .7, .55) : mm.l(x + R, y - R * .7, x - R * .7, y, .55).l(x - R * .7, y, x + R, y + R * .7, .55) });
    });
    if (F2.has('freckles') && G.includes('scar') && eyes.length) { const [x, y] = eyes[eyes.length - 1]; fl(g, mix(A.lidC || '#C08070', '#5A1E2E', .55), mm => mm.l(x + r * .2, y - r * 2.2, x + r * 1.2, y + r * 2, .5)); }
    if (F2.has('cheeks') && G.includes('paint') && eyes.length) eyes.slice(0, 2).forEach(([x, y]) => fl(g, '#C23A3A', mm => mm.l(x - r * .9, y + r * 1.9, x + r * .5, y + r * 1.5, .5).l(x - r * .7, y + r * 2.6, x + r * .7, y + r * 2.2, .5)));
    if (A.mouth && !A.noMouth) mouth(h, A.mouth, m.mo || m.m, g);
  }
  function mouth(h, M, style, g) {
    const { a, fl, tri } = h, { x, y, w } = M;
    if (style === 'teeth' || style === 'zig') {
      /* a toothy grin: dark mouth, a row of pointed teeth on top and two little fangs below */
      a({ g, c: MOUTH, flat: true, fr: IDLE, m: mm => mm.p([[x - w, y - .7], [x + w, y - .9], [x + w * .62, y + 1.2], [x, y + 1.5], [x - w * .62, y + 1.3]]) });
      const n = Math.max(3, Math.round(w * 1.3));
      fl(g, TEETH, mm => { for (let i = 0; i < n; i++) { const tx = x - w + .55 + i * (2 * w - 1.1) / (n - 1); tri(mm, tx, y - .8 - (tx - x) * .07, .36, style === 'zig' ? -1.3 : -.95); } tri(mm, x - w * .45, y + 1.4, .34, .9); tri(mm, x + w * .4, y + 1.4, .34, .9); }, { fr: IDLE });
    } else if (style === 'open') {
      a({ g, c: MOUTH, flat: true, fr: IDLE, m: mm => mm.e(x, y + .4, w * .72, 1.3) });
      fl(g, TONGUE, mm => mm.e(x + .2, y + 1.1, w * .45, .55), { fr: IDLE });
      fl(g, TEETH, mm => { tri(mm, x - w * .45, y - .7, .4, -.9); tri(mm, x + w * .45, y - .7, .4, -.9); }, { fr: IDLE });
    } else if (style === 'oh') {
      a({ g, c: MOUTH, flat: true, fr: IDLE, m: mm => mm.e(x, y + .3, .95, 1.15) });
    } else {
      /* smirk / fangs / tongue */
      a({ g, c: MOUTH, flat: true, fr: IDLE, m: mm => mm.l(x - w, y - .6, x - w * .1, y + .4, .62).l(x - w * .1, y + .4, x + w, y - .3, .62) });
      fl(g, TEETH, mm => { tri(mm, x - w * .55, y + .1, .42, -1.1); if (style === 'fang' || style === 'smile') tri(mm, x + w * .45, y + .3, .42, -1.1); }, { fr: IDLE });
      if (style === 'tongue') a({ g, c: TONGUE, fr: IDLE, m: mm => mm.p([[x + .1, y + .2], [x + 1.4, y + .1], [x + 1.4, y + 1.8], [x + .7, y + 2.3], [x + .1, y + 1.6]]) });
    }
    /* hurt: a wobbly little gasp; attack: a full roar */
    a({ g, c: MOUTH, flat: true, fr: [4], m: mm => mm.e(x, y + .4, w * .42, .95) });
    a({ g, c: MOUTH, flat: true, fr: [5], m: mm => mm.e(x, y + .7, w * .9, 1.9) });
    fl(g, TONGUE, mm => mm.e(x + .2, y + 1.8, w * .55, .7), { fr: [5] });
    fl(g, TEETH, mm => { for (let i = 0; i < 3; i++) tri(mm, x - w * .6 + i * w * .6, y - 1, .42, -1); tri(mm, x - w * .55, y + 2.5, .4, 1); tri(mm, x + w * .55, y + 2.5, .4, 1); }, { fr: [5] });
  }

  /* ---------------- gear that suits the creature (chosen by its features) ---------------- */
  function gear(h, A, m, F2) {
    const { a, fl, tri } = h, G = new Set(A.gear || []), hd = A.head, ng = A.neckG || 'body';
    const hatOf = F2.has('crown') ? 'crown' : F2.has('partyHat') ? 'helm' : F2.has('topHat') ? 'horned' : F2.has('wizardHat') ? 'hood' : null;
    const hats = A.hats || ['crown', 'helm', 'horned', 'hood'], hatOn = hd && G.has('hat') && hatOf && hats.includes(hatOf);
    if (hatOn) {
      const { cx, top, w } = hd, g = A.hatG || 'face';
      if (hatOf === 'crown') { a({ g, c: GOLD, gloss: 1, m: mm => mm.p([[cx - w * .62, top + 1.2], [cx - w * .7, top - 2.6], [cx - w * .32, top - .6], [cx, top - 3.6], [cx + w * .32, top - .6], [cx + w * .7, top - 2.6], [cx + w * .62, top + 1.2]]) }); fl(g, '#C23A4A', mm => mm.e(cx, top - .2, .55, .55)); fl(g, '#3E7AD8', mm => mm.e(cx - w * .42, top + .2, .45, .45).e(cx + w * .42, top + .2, .45, .45)); }
      if (hatOf === 'helm') { a({ g, c: STEEL, gloss: 1, m: mm => mm.e(cx, top + 1.2, w * .78, 3).and(t => t.r(0, 0, 32, top + 1.6)).r(cx - w * .95, top + 1, w * 1.9, 1.2) }); fl(g, lt(STEEL, .5), mm => mm.r(cx - w * .7, top + 1.15, .5, .5).r(cx + w * .6, top + 1.15, .5, .5)); }
      if (hatOf === 'horned') { a({ g, c: BONE, m: mm => mm.l(cx - w * .6, top, cx - w * 1.15, top - 2.6, 1.3).l(cx - w * 1.15, top - 2.6, cx - w * .9, top - 4.6, .8).l(cx + w * .6, top, cx + w * 1.15, top - 2.6, 1.3).l(cx + w * 1.15, top - 2.6, cx + w * .9, top - 4.6, .8) }); a({ g, c: IRON, gloss: 1, m: mm => mm.e(cx, top + 1.2, w * .74, 2.8).and(t => t.r(0, 0, 32, top + 1.6)).r(cx - w * .85, top + 1, w * 1.7, 1.1) }); fl(g, GOLD, mm => mm.r(cx - .3, top - 1.4, .6, 2.6)); }
      if (hatOf === 'hood') { a({ g, c: '#4A3A7A', m: mm => mm.p([[cx - w * .85, top + 1.6], [cx - w * .4, top - 1.4], [cx + w * .2, top - 5.6], [cx + w * 1.1, top - 4.4], [cx + w * .6, top - 2.6], [cx + w * .85, top + 1.6]]) }); fl(g, GOLD, mm => mm.r(cx - w * .9, top + .9, w * 1.8, .7).e(cx + w * 1.05, top - 4.4, .6, .6)); }
    }
    if (G.has('horns') && hd && !hatOn && (F2.has('horns') || F2.has('horn'))) {
      const { cx, top, w } = hd, g = A.hatG || 'face';
      if (F2.has('horn')) a({ g, c: BONE, m: mm => mm.p([[cx - .9, top + 1.2], [cx - .2, top - 3.4], [cx + .9, top + 1.2]]) });
      else a({ g, c: BONE, m: mm => mm.l(cx - w * .55, top + .8, cx - w * .95, top - 1.8, 1.2).l(cx - w * .95, top - 1.8, cx - w * .6, top - 3.4, .7).l(cx + w * .55, top + .8, cx + w * .95, top - 1.8, 1.2).l(cx + w * .95, top - 1.8, cx + w * .6, top - 3.4, .7) });
    }
    const nk = A.neck, ch = A.chest;
    if (nk && G.has('cape') && F2.has('scarf')) { const cc = A.capeC || '#8E2E3A'; a({ g: 'cape', c: cc, m: mm => mm.p([[nk.x - nk.w * .3, nk.y], [nk.x + nk.w * .6, nk.y - .2], [nk.x + nk.w * 1.2, nk.y + 8.6], [nk.x + nk.w * .8, nk.y + 7.6], [nk.x + nk.w * .5, nk.y + 9], [nk.x + nk.w * .1, nk.y + 6.4]]) }); a({ g: ng, c: cc, m: mm => mm.e(nk.x, nk.y + .2, nk.w * .55, .9) }); fl(ng, GOLD, mm => mm.e(nk.x - nk.w * .2, nk.y + .3, .5, .5)); }
    if (nk && G.has('amulet') && (F2.has('bowtie') || F2.has('ring'))) { fl(ng, dk(LEATHER, .2), mm => mm.l(nk.x - nk.w * .45, nk.y - .2, nk.x, nk.y + 1.4, .34).l(nk.x, nk.y + 1.4, nk.x + nk.w * .45, nk.y - .2, .34)); if (F2.has('bowtie')) a({ g: ng, c: BONE, m: mm => { tri(mm, nk.x - 1.2, nk.y + .6, .35, -1.2); tri(mm, nk.x + 1.2, nk.y + .6, .35, -1.2); tri(mm, nk.x, nk.y + 1.4, .4, -1.4); } }); else a({ g: ng, c: A.gemC || '#3EC2B8', gloss: 1, m: mm => mm.e(nk.x, nk.y + 1.9, .8, .9) }); }
    if (ch && G.has('armor') && (F2.has('belly') || F2.has('bolt'))) { a({ g: ng, c: STEEL, gloss: 1, m: mm => mm.e(ch.cx, ch.cy, ch.rx * .8, ch.ry * .8) }); fl(ng, GOLD, mm => mm.e(ch.cx, ch.cy, ch.rx * .8, ch.ry * .8).sub(t => t.e(ch.cx, ch.cy, ch.rx * .8 - .5, ch.ry * .8 - .5))); }
    if (ch && G.has('paint') && (F2.has('stripes') || F2.has('spots'))) { const c2 = A.paintC || '#C23A3A'; fl(ng, c2, mm => F2.has('stripes') ? mm.l(ch.cx - ch.rx * .6, ch.cy - ch.ry * .5, ch.cx + ch.rx * .2, ch.cy - ch.ry * .1, .5).l(ch.cx - ch.rx * .6, ch.cy + ch.ry * .1, ch.cx + ch.rx * .2, ch.cy + ch.ry * .5, .5) : mm.e(ch.cx - ch.rx * .4, ch.cy - ch.ry * .3, .6, .6).e(ch.cx + ch.rx * .3, ch.cy + ch.ry * .1, .5, .5).e(ch.cx - ch.rx * .1, ch.cy + ch.ry * .5, .45, .45)); }
    if (F2.has('bubbles') || F2.has('stars')) {
      const pts = [[3, 9, [0, 1]], [28.6, 6, [1, 2]], [29, 22, [2, 3]], [3.4, 24, [3, 0]]];
      if (F2.has('stars')) h.spark('float', '#F2D27A', pts); else h.dot('float', '#F28A3D', pts);
    }
  }

  /* ================================ the first ten species ================================ */
  const SP = {
    /* GEL SLIME: a glossy jelly dome with something it swallowed floating inside */
    slime: {
      pals: [{ b: '#5ECB72', i: '#2E7A4A' }, { b: '#58A8EE', i: '#2A5AA8' }, { b: '#EE6FA8', i: '#A8306A' }, { b: '#A06CE6', i: '#5A2EA0' }, { b: '#F2A03E', i: '#A8561E' }, { b: '#3FC9B4', i: '#1E7A6E' }],
      draw(h, P, m) {
        const { a, fl } = h, b = P.b;
        a({ g: 'weap', c: b, gloss: 1, m: mm => mm.l(7.4, 24, 3.2, 20.4, 2.6).e(3, 19.6, 1.7, 1.7) });
        a({ g: 'body', c: b, gloss: 1, round: 7, m: mm => mm.e(16, 21.4, 11.8, 9.2).r(4.2, 21.4, 23.6, 7.6).e(16, 28.8, 13, 2).e(5.4, 29.6, 2, 1.2).e(26.8, 29.6, 1.8, 1.1) });
        const t = m.t % 3, ins = c => mix(c, b, .5);
        if (t === 0) { fl('body', ins('#C9D1D6'), mm => mm.l(19.6, 27.6, 25, 17.4, 1.2)); fl('body', ins(GOLD), mm => mm.l(18.6, 24.6, 22.2, 26.2, 1)); fl('body', ins(LEATHER), mm => mm.l(18.2, 28.4, 19.6, 27.4, .9)); }
        else if (t === 1) { fl('body', ins(BONE), mm => mm.e(22.2, 25, 2.4, 2.2).r(20.8, 26.2, 2.8, 1.6)); fl('body', ins(INK), mm => mm.e(21.3, 25, .7, .7).e(23.1, 25, .7, .7).r(21.4, 27, .34, .6).r(22.4, 27, .34, .6)); }
        else fl('body', ins(GOLD), mm => mm.e(21, 27, 1.3, .7).e(23.8, 26, 1.3, .7).e(22.2, 24.6, 1.3, .7).e(24.6, 23.6, 1.1, .6));
        fl('body', mix(b, '#FFFFFF', .5), mm => mm.e(8.4, 25.6, .8, .8).e(25.2, 20.2, .6, .6).e(11, 28, .5, .5).e(23.4, 28.2, .7, .7));
        fl('body', mix(b, '#FFFFFF', .72), mm => mm.l(7.6, 19.4, 10.4, 14.8, .9).e(12.6, 13.6, .6, .6));
        return { head: { cx: 15.6, top: 12.4, w: 8 }, eyes: [[11.4, 19.4], [17.8, 19.6]], er: 2.1, iris: P.i, browC: mix(P.i, INK, .5), lidC: b, stalkC: b, stalkOK: true, cyclopsOK: true, mouth: { x: 14.6, y: 24.2, w: 3.4 }, chest: { cx: 16, cy: 25, rx: 6, ry: 3.6 }, gear: ['hat', 'horns', 'paint', 'patch'], hand: null };
      }
    },
    /* GOBLIN RAIDER: big head, long ears, hooked nose, leather armour and a raider's weapon */
    goblin: {
      pals: [{ s: '#86C25A', e: '#F2C14E', t: '#7A5236', c: '#8E3A2E' }, { s: '#A8B24E', e: '#E8573B', t: '#5E4A3A', c: '#3E5A8E' }, { s: '#5FB892', e: '#F2E14E', t: '#7A5236', c: '#7A2E5A' }, { s: '#C9784A', e: '#F2C14E', t: '#4E3E2E', c: '#2E5A3E' }],
      draw(h, P, m) {
        const { a, fl } = h, s = P.s, sd = dk(s, .25), bootC = mix(P.t, INK, .35);
        a({ g: 'feet', c: sd, m: mm => mm.l(12.6, 22, 11.4, 27.6, 2).l(17.6, 22, 18.8, 27.6, 2) });
        a({ g: 'feet', c: bootC, m: mm => mm.p([[8.4, 30.4], [9.2, 27], [12.8, 27], [13.6, 30.4]]).p([[17.4, 30.4], [17.8, 27], [21.6, 27], [22.8, 30.4]]) });
        fl('feet', lt(bootC, .25), mm => mm.r(9.2, 27.2, 3.6, .5).r(17.8, 27.2, 3.6, .5));
        a({ g: 'body', c: s, m: mm => mm.l(19.4, 16.4, 22, 20.6, 1.9).e(22.2, 21.2, 1.3, 1.3) });
        const tun = mm => mm.p([[10, 15.2], [18.6, 14.8], [20.6, 22.8], [18.6, 24.2], [16.6, 23.2], [14.4, 24.4], [12.2, 23.2], [10.2, 23.8]]);
        a({ g: 'body', c: P.t, m: tun });
        fl('body', dk(P.t, .3), mm => tun(mm).and(t => t.l(12, 16, 13, 23, .4).l(16.4, 15.4, 17.6, 23, .4)));
        a({ g: 'body', c: dk(LEATHER, .3), sep: false, m: mm => mm.r(10.2, 20.2, 10.2, 1.2) });
        a({ g: 'body', c: GOLD, gloss: 1, m: mm => mm.r(14.4, 19.9, 1.8, 1.8) });
        fl('body', dk(LEATHER, .2), mm => mm.l(10.8, 15.6, 19.6, 20.6, .6));
        /* ears, head, nose */
        a({ g: 'face', c: s, m: mm => mm.p([[9, 9.6], [1.4, 6], [2.4, 8.4], [4.4, 10.6], [8.6, 12.8]]).p([[16.4, 9.2], [23.8, 5], [23, 7.8], [21, 10.6], [17, 12.6]]) });
        fl('face', mix(s, '#E86F7E', .45), mm => mm.p([[8, 10], [3.2, 7.4], [5, 10], [8, 11.6]]).p([[17.4, 9.6], [22.4, 6.4], [20.6, 9.8], [17.6, 11.4]]));
        a({ g: 'face', c: s, round: 4, m: mm => mm.e(12.8, 10.4, 5.2, 4.6).e(12.2, 13.2, 4.4, 2.6) });
        a({ g: 'face', c: s, m: mm => mm.e(8, 12.6, 1.7, 1.4).p([[8.6, 11], [6.2, 12.8], [7.4, 13.8]]) });
        fl('face', sd, mm => mm.r(7, 13.2, .5, .5));
        if ((m.seed || m.n).length % 3 === 0) fl('face', sd, mm => mm.e(15.4, 8, .5, .5).e(16.4, 12.6, .4, .4));
        a({ g: 'weap', c: s, arm: 1, m: mm => mm.l(11, 16.8, 7.8, 19.8, 1.9) });
        a({ g: 'body', c: STEEL, gloss: 1, m: mm => mm.e(11.6, 15.8, 2.8, 1.9) });
        fl('body', lt(STEEL, .5), mm => mm.r(10.6, 15.4, .45, .45).r(12.4, 15.4, .45, .45));
        return { head: { cx: 12.8, top: 6, w: 5.4 }, eyes: [[10.4, 10], [14.8, 10.2]], er: 1.45, iris: P.e, browC: dk(s, .55), lidC: s, mouth: { x: 11.8, y: 14.2, w: 3 }, neck: { x: 13.6, y: 14.6, w: 5 }, chest: { cx: 15.2, cy: 18.4, rx: 4.2, ry: 3.2 }, hand: { x: 7.4, y: 20 }, weapons: [0, 1, 2, 3, 7], capeC: P.c, gear: ['hat', 'cape', 'amulet', 'armor', 'paint', 'patch', 'scar'] };
      }
    },
    /* MYCONID GUARD: a glossy spotted cap over a sturdy stem, standing guard with a polearm */
    mushroom: {
      pals: [{ c: '#D8453B', s: '#F7EEDA' }, { c: '#8E5AD0', s: '#F2D27A' }, { c: '#4F86D6', s: '#E8F4FF' }, { c: '#E8873A', s: '#FFF0C8' }, { c: '#B0613E', s: '#F2E4C8' }],
      draw(h, P, m) {
        const { a, fl } = h, st = '#EDE0C4', sd = mix(st, '#8A6A4A', .3);
        a({ g: 'feet', c: sd, m: mm => mm.e(12.6, 28.6, 2.8, 2).e(19.4, 28.6, 2.8, 2) });
        a({ g: 'body', c: st, m: mm => mm.l(20.6, 16.6, 23.2, 20.2, 1.7).e(23.4, 20.8, 1.2, 1.2) });
        a({ g: 'body', c: st, round: 4, m: mm => mm.p([[11.2, 13.2], [20.8, 13.2], [22.2, 21.6], [21.2, 26.8], [10.8, 26.8], [9.8, 21.6]]) });
        a({ g: 'body', c: dk(LEATHER, .1), sep: false, m: mm => mm.r(10.1, 22, 12, 1.2) });
        a({ g: 'body', c: LEATHER, m: mm => mm.e(20, 24, 1.5, 1.6) });
        fl('body', mix(st, '#E86F7E', .35), mm => mm.e(13, 19.4, .9, .55).e(20.4, 19.4, .9, .55));
        a({ g: 'face', c: mix(st, '#7A5A4A', .45), m: mm => mm.e(16, 13.2, 10.6, 1.6) });
        fl('face', mix(st, '#5A3A2A', .55), mm => { for (let x = 7; x <= 25; x += 1.4) mm.r(x, 12.4, .34, 1.6); mm.and(t => t.e(16, 13.2, 10.6, 1.6)); });
        a({ g: 'face', c: P.c, gloss: 1, round: 6, m: mm => mm.e(16, 10.6, 12.4, 7.8).and(t => t.r(0, 0, 32, 12.4)).e(16, 12, 12.8, 1.6) });
        fl('face', P.s, mm => mm.e(9.4, 8.6, 1.9, 1.4).e(15.6, 5.2, 2.3, 1.6).e(21.8, 7.6, 1.9, 1.4).e(25.2, 10.6, 1.2, .9).e(12.6, 11, 1.2, .8).e(19, 10.2, 1.1, .8).e(6.4, 11, .9, .7));
        fl('face', dk(P.c, .3), mm => mm.e(16, 12.2, 12.8, 1.4).and(t => t.r(0, 12.4, 32, 2)));
        a({ g: 'weap', c: st, arm: 1, m: mm => mm.l(10.6, 17.6, 8, 19.8, 1.7) });
        return { head: { cx: 16, top: 3.4, w: 9 }, eyes: [[14.2, 16.8], [19, 16.8]], er: 1.45, iris: '#6A4A2E', browC: '#5A3A2A', lidC: st, cyclopsOK: true, mouth: { x: 16.6, y: 20.4, w: 2.4 }, neck: { x: 16, y: 14.2, w: 6 }, chest: { cx: 16, cy: 23.6, rx: 4, ry: 2.4 }, hand: { x: 7.8, y: 20 }, weapons: [2, 4, 6], gemC: P.c, gear: ['hat', 'amulet', 'patch'], hats: ['crown'] };
      }
    },
    /* WRAITH: a tattered hooded spirit with burning eyes, a bony hand and a ghost-flame lantern */
    wraith: {
      pals: [{ r: '#4E4A80', g: '#8FF2D8' }, { r: '#3E5E78', g: '#9AD8FF' }, { r: '#644478', g: '#F2A8FF' }, { r: '#3E5446', g: '#C8FF8F' }, { r: '#6E3E4E', g: '#FFB08F' }],
      draw(h, P, m) {
        const { a, fl } = h, r = P.r, gl = P.g;
        fl('float', mix(r, gl, .35), mm => mm.l(22, 27, 26.6, 29.6, .7).l(18, 29.4, 19.4, 31.4, .6), { fr: [0, 2] });
        fl('float', mix(r, gl, .35), mm => mm.l(22.6, 26.4, 27.4, 28.4, .7).l(17.6, 29.6, 18.4, 31.6, .6), { fr: [1, 3] });
        const robe = mm => mm.p([[16.4, 3.4], [19.8, 4.8], [22.6, 8.6], [23.8, 13.4], [24.2, 18.6], [26, 23.8], [24.2, 24.4], [24, 27.8], [21.8, 26.4], [20.4, 30], [18.2, 27.4], [16.2, 30.4], [14.2, 27.2], [12, 29.6], [11.6, 25.4], [9.2, 26.2], [10, 21], [9, 16], [9.6, 10.6], [12.4, 5.8]]);
        a({ g: 'body', c: r, round: 5, m: robe });
        fl('body', dk(r, .38), mm => robe(mm).and(t => t.l(18.6, 15, 19.6, 27, .5).l(14, 18, 13.4, 27, .5).l(21.6, 13, 23.4, 23, .4)));
        fl('body', lt(r, .2), mm => mm.e(14.4, 11.6, 4.6, 4.9).sub(t => t.e(14.4, 11.6, 3.7, 4)).and(t => robe(t)));
        fl('body', '#0C0816', mm => mm.e(14.4, 11.6, 3.7, 4));
        a({ g: 'weap', c: r, round: 3, m: mm => mm.l(13.4, 15.6, 8.6, 19.2, 3.2).p([[7, 18.6], [9.6, 17], [10.4, 21.4], [8.4, 22.2]]) });
        a({ g: 'weap', c: BONE, m: mm => mm.e(7.6, 20.4, 1.1, 1) });
        fl('weap', dk(BONE, .35), mm => mm.l(6.8, 20.8, 6.6, 21.8, .34).l(7.6, 21.2, 7.6, 22.2, .34));
        fl('weap', '#555B63', mm => mm.l(7.2, 21.4, 6.8, 23.4, .4));
        a({ g: 'weap', c: IRON, gloss: 1, m: mm => mm.p([[5, 23.4], [8.6, 23.4], [8, 24.4], [5.6, 24.4]]).r(5.2, 24.2, .6, 3.6).r(7.8, 24.2, .6, 3.6).p([[5, 27.8], [8.6, 27.8], [8, 28.8], [5.6, 28.8]]) });
        fl('weap', gl, mm => mm.r(5.8, 24.4, 2, 3.4), { fr: [0, 2, 4] });
        fl('weap', lt(gl, .45), mm => mm.r(5.8, 24.4, 2, 3.4), { fr: [1, 3, 5] });
        fl('weap', '#FFFFFF', mm => mm.p([[6.2, 27.4], [6.8, 25.2], [7.4, 27.4]]));
        return { head: { cx: 15.8, top: 3.6, w: 6 }, hatG: 'body', eyes: [[13, 11.6], [16, 11.4]], er: 1.05, glow: gl, brows: false, noMouth: true, threeOK: false, neck: { x: 15.4, y: 15.6, w: 5 }, chest: { cx: 17, cy: 19, rx: 4, ry: 3 }, hand: null, floaty: true, gear: ['hat', 'amulet'], hats: ['crown'], gemC: gl };
      }
    },
    /* STONE GOLEM: stacked boulders, mossy shoulders, a glowing rune heart and fists like millstones */
    golem: {
      pals: [{ s: '#8E8C9C', r: '#5FD4E8', m: '#5E8A44' }, { s: '#9C8670', r: '#F2A03D', m: '#6E8A3E' }, { s: '#70869A', r: '#8FF2B8', m: '#4E7A5A' }, { s: '#867A96', r: '#E87AF2', m: '#5E8A6A' }],
      draw(h, P, m) {
        const { a, fl } = h, s = P.s, sd = dk(s, .14);
        a({ g: 'feet', c: sd, tex: 'stone', round: 3, m: mm => mm.e(11.2, 26.4, 3.4, 3.4).e(20.8, 26.4, 3.4, 3.4) });
        a({ g: 'feet', c: dk(s, .25), m: mm => mm.p([[7.2, 30.6], [8, 28.6], [14.4, 28.6], [15, 30.6]]).p([[17, 30.6], [17.6, 28.6], [24, 28.6], [24.8, 30.6]]) });
        a({ g: 'back', c: sd, tex: 'stone', round: 3, m: mm => mm.e(24.8, 12.4, 3.6, 3.2).e(26.2, 17.6, 2.8, 3).e(26.4, 22.8, 3.4, 3) });
        const tor = mm => mm.p([[7.4, 10.4], [23.6, 9.8], [26, 15], [24, 22.4], [19, 24.2], [12, 24.2], [7.6, 22], [6, 15.4]]);
        a({ g: 'body', c: s, tex: 'stone', round: 6, m: tor });
        fl('body', dk(s, .45), mm => mm.l(10, 12, 12.4, 15.6, .5).l(21, 18.6, 23.4, 22, .5).l(8, 17, 10, 19.4, .5));
        fl('body', dk(P.r, .5), mm => mm.e(16, 16.4, 3.2, 3.2));
        fl('body', P.r, mm => mm.e(16, 16.4, 3.2, 3.2).sub(t => t.e(16, 16.4, 2.4, 2.4)).r(15.6, 13.6, .8, 5.6).r(13.2, 16, 5.6, .8), { fr: [0, 1, 4, 5] });
        fl('body', lt(P.r, .45), mm => mm.e(16, 16.4, 3.2, 3.2).sub(t => t.e(16, 16.4, 2.4, 2.4)).r(15.6, 13.6, .8, 5.6).r(13.2, 16, 5.6, .8), { fr: [2, 3] });
        fl('body', P.r, mm => mm.l(18.4, 16.4, 21, 14, .4).l(13.6, 17.6, 11.4, 21, .4));
        a({ g: 'face', c: s, tex: 'stone', round: 3, m: mm => mm.p([[11.4, 4.6], [19.4, 4.2], [20.6, 7.4], [19.6, 10.8], [12, 11], [10.8, 7.6]]) });
        a({ g: 'face', c: dk(s, .1), sep: false, m: mm => mm.r(11, 6.2, 9.4, 1.6) });
        fl('body', P.m, mm => tor(mm).and(t => t.r(0, 0, 32, 11.6)).e(6.6, 12, 1.6, 1.2).e(25.6, 11.4, 1.6, 1.2));
        fl('body', dk(P.m, .25), mm => mm.l(9, 11.4, 9, 13.6, .5).l(22.4, 11, 22.4, 14, .5).l(14.4, 11.4, 14.4, 12.6, .4));
        fl('face', P.m, mm => mm.r(12, 4.2, 7.4, 1.2).e(18.6, 4.8, 1.4, .9));
        fl('face', '#F2D27A', mm => mm.e(19.6, 4.2, .5, .5));
        a({ g: 'weap', c: s, tex: 'stone', round: 3, m: mm => mm.e(7.4, 12.6, 3.6, 3.2).e(5.8, 17.6, 2.8, 3).e(5.2, 23, 3.6, 3.2) });
        fl('weap', dk(s, .4), mm => mm.l(2.4, 22.6, 7.4, 22, .4).l(2.6, 24.4, 7.6, 24, .4));
        fl('weap', P.r, mm => mm.l(5.4, 15.6, 6.4, 19, .4));
        return { head: { cx: 15.6, top: 4.2, w: 4.6 }, eyes: [[13.4, 8.4], [17.4, 8.4]], er: .95, glow: P.r, brows: false, noMouth: true, threeOK: false, neck: { x: 15.6, y: 11, w: 6 }, chest: { cx: 16, cy: 16.4, rx: 4.6, ry: 4 }, hand: null, gear: ['hat'], hats: ['crown', 'horned'] };
      }
    },
    /* GARGOYLE: a crouching stone beast with ribbed wings, curled horns and a spade tail */
    gargoyle: {
      pals: [{ s: '#8C90A2', e: '#F2503B' }, { s: '#7E9078', e: '#F2C14E' }, { s: '#A08A8C', e: '#7FE7F2' }, { s: '#6E7896', e: '#C97FFF' }],
      draw(h, P, m) {
        const { a, fl } = h, s = P.s, w = dk(s, .16);
        a({ g: 'wing', c: w, round: 2, m: mm => mm.p([[18.6, 12.6], [22, 5], [26.4, 1.6], [31.4, 3.6], [30, 8], [31.6, 12.6], [28.4, 12], [28.6, 17], [24.6, 15.4], [21.6, 18]]).p([[13.4, 12], [10.4, 5.4], [6.2, 2.6], [2, 4.6], [3.6, 8.4], [1.6, 12.2], [5, 12.2], [5, 16.4], [9, 14.8], [11.6, 17]]) });
        fl('wing', dk(s, .45), mm => mm.l(19, 12.6, 26.4, 1.8, .6).l(26.4, 1.8, 30, 8, .4).l(26.4, 1.8, 28.4, 12, .4).l(26.4, 1.8, 24.6, 15.2, .4).l(13, 12, 6.2, 2.8, .6).l(6.2, 2.8, 3.6, 8.4, .4).l(6.2, 2.8, 5, 12.2, .4).l(6.2, 2.8, 9, 14.6, .4));
        a({ g: 'tail', c: s, m: mm => mm.l(19.6, 25, 25.6, 26.6, 1.6).l(25.6, 26.6, 28.6, 22.4, 1.3) });
        a({ g: 'tail', c: w, m: mm => mm.p([[27.4, 22.8], [28.8, 18.8], [30.6, 22.6], [28.8, 21.8]]) });
        a({ g: 'feet', c: s, tex: 'stone', m: mm => mm.e(19.8, 23, 3.6, 3.6).l(20.6, 25, 21.4, 29.2, 2.1) });
        a({ g: 'feet', c: w, m: mm => mm.p([[18.4, 30.6], [19, 28.8], [23.4, 28.8], [24.2, 30.6]]) });
        h.dot('feet', BONE, [[18.2, 30], [23.8, 30]]);
        a({ g: 'body', c: s, tex: 'stone', round: 4, m: mm => mm.e(16.4, 19.4, 5.6, 5.8) });
        fl('body', dk(s, .3), mm => mm.l(14.4, 17, 16.8, 18, .4).l(14.2, 19.6, 16.6, 20.6, .4).l(14.4, 22.2, 16.6, 23, .4));
        a({ g: 'face', c: BONE, m: mm => mm.l(12.4, 8.8, 15.4, 4.6, 1.3).l(15.4, 4.6, 17.6, 4.8, .9).l(10.6, 8.6, 9.8, 4.4, 1).l(9.8, 4.4, 8.4, 3.6, .7) });
        a({ g: 'face', c: s, tex: 'stone', round: 3, m: mm => mm.e(11.6, 11.4, 4.2, 3.8).p([[8.6, 10.6], [4.2, 12], [4.4, 14.6], [8.6, 15.2]]) });
        a({ g: 'face', c: dk(s, .08), m: mm => mm.p([[14.4, 9.6], [17.4, 8], [16.4, 11.4]]) });
        fl('face', INK, mm => mm.r(4.8, 12.4, .45, .45));
        a({ g: 'weap', c: s, tex: 'stone', m: mm => mm.l(12.6, 18.4, 10.6, 25.6, 2.3).p([[8, 28.4], [9, 25.4], [12.4, 25.4], [12.8, 28.4]]) });
        h.dot('weap', BONE, [[7.8, 27.8], [9.2, 28.2], [10.6, 28.2]]);
        return { head: { cx: 11.8, top: 7.6, w: 4 }, eyes: [[9.6, 11], [13, 11]], er: .95, glow: P.e, browC: dk(s, .5), threeOK: false, mouth: { x: 6.4, y: 14.2, w: 2 }, neck: { x: 13.6, y: 14.6, w: 5 }, chest: { cx: 16.4, cy: 19.4, rx: 4, ry: 4 }, hand: null, gear: ['hat', 'amulet'], hats: ['crown', 'helm'] };
      }
    },
    /* CRYSTAL ELEMENTAL: a floating cluster of cut gems with a glowing core and orbiting shards */
    crystal: {
      pals: [{ c: '#6FD6F2' }, { c: '#B489F2' }, { c: '#F27AB8' }, { c: '#6FF2A8' }, { c: '#F2C46F' }],
      draw(h, P, m) {
        const { a, fl } = h, c = P.c;
        /* a faceted crystal: light left facet, dark right facet, white edge glint */
        const gem = (g, x, y, w, ht, tilt = 0, fr) => {
          const T = [x + tilt, y - ht / 2], L1 = [x - w / 2, y - ht / 2 + w * .55], L2 = [x - w / 2 + tilt * .2, y + ht / 2 - w * .45], B = [x, y + ht / 2], R2 = [x + w / 2 + tilt * .2, y + ht / 2 - w * .45], R1 = [x + w / 2, y - ht / 2 + w * .55], C1 = [x + tilt * .5, y - ht / 2 + w * .7], C2 = [x, y + ht / 2 - w * .6], o = fr ? { fr } : {};
          a({ g, c, flat: true, ...o, m: mm => mm.p([T, R1, R2, B, L2, L1]) });
          fl(g, lt(c, .4), mm => mm.p([T, L1, L2, C2, C1]), o);
          fl(g, dk(c, .3), mm => mm.p([T, R1, R2, C2, C1]).and(t => t.r(x + w * .08, 0, 32, 32)), o);
          fl(g, dk(c, .45), mm => mm.p([C2, L2, B, R2]), o);
          fl(g, '#FFFFFF', mm => mm.l(T[0] - .2, T[1] + 1, L1[0] + .5, L1[1] + .4, .34).l(L1[0] + .5, L1[1] + 1, L2[0] + .6, L2[1] - .6, .34), o);
        };
        gem('body', 22, 16, 4, 8, 1.2); gem('body', 10, 16.6, 4, 7.6, -1.2);
        gem('body', 16, 19.4, 9, 17);
        fl('body', '#FFFFFF', mm => mm.e(16, 20.4, 1.6, 1.8), { fr: [2, 3] });
        fl('body', lt(c, .6), mm => mm.e(16, 20.4, 2.2, 2.6), { fr: [0, 1, 4, 5] });
        gem('face', 15.4, 7.8, 6.4, 8.4, .4);
        gem('weap', 5.4, 17.6, 3.4, 6.4, -.6); gem('body', 27, 16.4, 3, 5.6, .6);
        [[3.6, 6, [0, 1]], [27.8, 4, [2, 3]], [28.4, 26, [1, 2]], [4, 27, [3, 0]]].forEach(([x, y, fr]) => gem('float', x, y, 1.8, 3.2, 0, fr));
        return { head: { cx: 15.4, top: 3.8, w: 4 }, eyes: [[13.6, 8.4], [17, 8.4]], er: 1.05, glow: mix(c, '#1C0E36', .72), brows: false, noMouth: true, threeOK: false, neck: null, chest: null, hand: null, floaty: true, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* TROLL BRUTE: a hulking long-armed troll with tusks, a big nose, a fur loincloth and a spiked club */
    troll: {
      pals: [{ s: '#7FA06A', h: '#4A3A2A' }, { s: '#6E90A6', h: '#2E2A3A' }, { s: '#A0946A', h: '#5A3A2A' }, { s: '#8E80A8', h: '#3A2A3A' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, s = P.s, sd = dk(s, .18), fur = '#7A5A3A';
        a({ g: 'feet', c: sd, m: mm => mm.l(12.4, 22.6, 11.4, 27.8, 3.4).l(19.6, 22.6, 20.6, 27.8, 3.4).e(10.6, 29.4, 3.4, 1.6).e(21.4, 29.4, 3.4, 1.6) });
        fl('feet', dk(sd, .3), mm => mm.l(8, 30.2, 8, 29.2, .34).l(9.6, 30.4, 9.6, 29.2, .34).l(23.6, 30.2, 23.6, 29.2, .34).l(22, 30.4, 22, 29.2, .34));
        a({ g: 'body', c: sd, m: mm => mm.l(22.4, 13.2, 25.4, 20, 3.2).l(25.4, 20, 25.6, 24.4, 2.8).e(25.6, 25.4, 2.4, 2.2) });
        const tor = mm => mm.p([[8, 12.6], [16, 10.4], [22.6, 11.4], [24.8, 17], [22.4, 23.6], [11.2, 24.2], [8.4, 19]]);
        a({ g: 'body', c: s, round: 6, m: tor });
        a({ g: 'body', c: lt(s, .2), sep: false, m: mm => mm.e(15.4, 19.6, 4.6, 3.4) });
        fl('body', dk(s, .3), mm => mm.l(12, 15.6, 15.4, 16.6, .4).l(16.6, 16.6, 20, 15.4, .4));
        a({ g: 'body', c: fur, tex: 'fur', m: mm => mm.p([[10.4, 21.6], [22.2, 21.6], [23, 26.4], [19.4, 25.2], [16.4, 27], [13.6, 25.2], [9.6, 26.4]]) });
        a({ g: 'body', c: dk(LEATHER, .2), sep: false, m: mm => mm.r(10.2, 21.2, 12.4, 1.1) });
        a({ g: 'face', c: P.h, m: mm => { tri(mm, 9.4, 8.4, 1.2, 2.4); tri(mm, 11.6, 8, 1.2, 2.8); tri(mm, 13.6, 8.6, 1, 2); } });
        a({ g: 'face', c: s, round: 4, m: mm => mm.e(10.8, 11.4, 4.2, 3.8).p([[13.6, 9.8], [16.2, 9], [14.6, 12.4]]) });
        a({ g: 'face', c: s, m: mm => mm.e(6.8, 12.6, 2.2, 1.9) });
        fl('face', dk(s, .35), mm => mm.r(5.4, 13.4, .5, .5));
        a({ g: 'face', c: BONE, m: mm => { tri(mm, 8.6, 15.2, .5, 1.8); tri(mm, 12.4, 15.4, .5, 1.8); } });
        a({ g: 'weap', c: s, arm: 1, round: 3, m: mm => mm.l(9.4, 14.4, 6.6, 19.8, 3.2) });
        return { head: { cx: 11, top: 7.6, w: 4.4 }, eyes: [[9, 10.6], [12.4, 10.8]], er: 1.2, iris: '#E8C83A', browC: dk(s, .6), lidC: s, cyclopsOK: true, mouth: { x: 10.4, y: 14.4, w: 2.6 }, neck: { x: 13.4, y: 13.6, w: 6 }, chest: { cx: 15.6, cy: 17.4, rx: 5, ry: 3.6 }, hand: { x: 6.2, y: 20.6 }, weapons: [0, 5], handC: s, gear: ['hat', 'amulet', 'paint', 'patch', 'scar'] };
      }
    },
    /* YOUNG DRAKE: a scaly wyvern with a horned head, ribbed wing and spade tail; it breathes fire */
    drake: {
      pals: [{ s: '#D8503E', b: '#F2C46F', w: '#8E2E3A' }, { s: '#4FA85A', b: '#E8D88A', w: '#2E6A4A' }, { s: '#4A78D8', b: '#BFE0F2', w: '#2E3E8E' }, { s: '#8A5AD0', b: '#F2C4E8', w: '#4E2E8A' }, { s: '#E8A83A', b: '#FFF0B8', w: '#A8562E' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, s = P.s;
        a({ g: 'wing', c: P.w, round: 2, m: mm => mm.p([[18, 13], [21.6, 5.6], [25.6, 2.4], [30.6, 4.4], [29.2, 8.6], [30.6, 12.6], [27.6, 12.4], [27.4, 16.4], [23.6, 15.6]]).p([[15, 12.6], [13.6, 6.6], [16.6, 8.6]]) });
        fl('wing', dk(P.w, .4), mm => mm.l(18.4, 12.8, 25.6, 2.6, .6).l(25.6, 2.6, 29.2, 8.6, .4).l(25.6, 2.6, 27.6, 12.4, .4).l(25.6, 2.6, 24, 15.4, .4));
        a({ g: 'tail', c: s, tex: 'scale', m: mm => mm.l(21, 24.4, 26.6, 26, 2.6).l(26.6, 26, 29.6, 22.4, 1.8).l(29.6, 22.4, 30, 18.6, 1.2) });
        a({ g: 'tail', c: P.w, m: mm => mm.p([[28.8, 19.4], [30, 15.6], [31.6, 19.4], [30, 18.6]]) });
        a({ g: 'feet', c: s, tex: 'scale', m: mm => mm.e(20.4, 22.4, 3.4, 3.6).l(21, 25, 21.8, 29.2, 2) });
        a({ g: 'feet', c: dk(s, .2), m: mm => mm.p([[19.4, 30.6], [20, 28.8], [23.8, 28.8], [24.6, 30.6]]) });
        h.dot('feet', BONE, [[19.2, 30], [24.2, 30]]);
        a({ g: 'body', c: s, tex: 'scale', round: 4, m: mm => mm.e(17.6, 20, 6, 5.4).l(13.6, 16.4, 10.6, 11.6, 3.6) });
        const bel = mm => mm.p([[12.4, 15.6], [15.6, 15], [18.4, 25], [14.4, 25.6], [11.8, 21]]).l(12.2, 15.6, 9.8, 12.4, 1.4);
        a({ g: 'body', c: P.b, sep: false, m: bel });
        fl('body', dk(P.b, .3), mm => { for (let y = 13.6; y < 25.6; y += 1.5) mm.r(9, y, 10, .34); mm.and(t => bel(t)); });
        a({ g: 'body', c: P.w, m: mm => { [[12.6, 10.6], [15, 13.6], [18.4, 14.8], [21.6, 16]].forEach(([x, y]) => tri(mm, x, y, .8, 1.6)); } });
        a({ g: 'face', c: BONE, m: mm => mm.l(10.6, 7.6, 14.2, 4.4, 1.1).l(14.2, 4.4, 15.8, 4.4, .7).l(11.6, 9, 15, 7.6, .9) });
        a({ g: 'face', c: s, tex: 'scale', round: 3, m: mm => mm.p([[11.6, 6.6], [13.6, 8.6], [13.4, 12], [10.4, 13], [6, 12.6], [2.8, 11.6], [2.6, 10.2], [5.6, 8.6], [9, 6.8]]) });
        a({ g: 'face', c: s, fr: IDLE.concat(4), m: mm => mm.p([[3.2, 11.8], [9.6, 12.6], [10.6, 13.6], [6, 14.6], [3.4, 13.4]]) });
        a({ g: 'face', c: s, fr: [5], m: mm => mm.p([[3.4, 13.2], [9.6, 12.8], [10.6, 14], [5.4, 16.6], [2.6, 15.6]]) });
        fl('face', MOUTH, mm => mm.p([[3, 12], [9.6, 12.6], [5.4, 15.6], [2.8, 14.6]]), { fr: [5] });
        fl('face', MOUTH, mm => mm.l(3.2, 12.4, 9.4, 12.8, .45), { fr: IDLE.concat(4) });
        fl('face', TEETH, mm => { tri(mm, 4.4, 12.4, .4, -1); tri(mm, 6.6, 12.6, .4, -1); }, { fr: IDLE });
        fl('face', INK, mm => mm.r(3, 10.2, .5, .5));
        a({ g: 'face', c: P.w, m: mm => { tri(mm, 10, 7.4, .7, 1.4); tri(mm, 12.4, 8.2, .6, 1.2); } });
        fl('face', '#E8743B', mm => mm.p([[2.6, 13.4], [-1, 9.6], [-1, 18.6], [2.4, 15.4]]), { fr: [5] });
        fl('face', '#F7C948', mm => mm.p([[2.6, 13.8], [-1, 12], [-1, 16], [2.4, 14.8]]), { fr: [5] });
        a({ g: 'weap', c: s, m: mm => mm.l(14, 19.6, 11.4, 22.8, 2) });
        a({ g: 'weap', c: dk(s, .15), m: mm => mm.e(11, 23.2, 1.3, 1.1) });
        h.dot('weap', BONE, [[9.6, 23.4], [10.4, 24.2]]);
        return { head: { cx: 9.2, top: 6.8, w: 3.6 }, profile: true, eyes: [[8.4, 9.6]], er: 1.25, iris: '#F2C14E', browC: dk(s, .55), lidC: s, noMouth: true, neck: { x: 12.2, y: 14.6, w: 4 }, chest: null, hand: null, gear: ['hat', 'patch'], hats: ['crown'] };
      }
    },
    /* SHADOW KNIGHT: a dark mirror of the hero in blackened plate with a burning visor */
    shadow: {
      pals: [{ steel: '#4A4660', cloth: '#5A2E4A', glow: '#E0573B' }, { steel: '#3E4A5E', cloth: '#2E4A6A', glow: '#7FE7F2' }, { steel: '#4E3E52', cloth: '#6A2E2E', glow: '#F2C14E' }, { steel: '#3A4A44', cloth: '#2E5A44', glow: '#8FF2B8' }],
      draw(h, P, m) {
        const W = ['weapon_crayon', 'weapon_ruler', 'weapon_paintbrush', 'weapon_wand', 'weapon_magnify', 'weapon_book', 'weapon_lollipop', 'weapon_quill'][m.t % 8], trim = '#8A7E9A';
        const k = { steel: P.steel, dark: dk(P.steel, .35), cloth: P.cloth, trim, helm: (m.seed || m.n).length % 2 ? 'horned' : 'great', visor: 'glow', glow: P.glow, cape: m.n.length % 3 ? P.cloth : null, weapon: 'sword', shield: [['kite', 'heater', 'round'][m.c % 3], dk(P.cloth, .2), trim, ['eye', 'bands', 'boss'][m.c % 3], P.glow] };
        KNIGHTS.__body(k, { weapon: W }).forEach(p => h.a({ ...flipP(p), band: true }));
        return { noFace: true, head: null, neck: null, chest: null, hand: null, gear: [] };
      }
    }
  };
  const BODY = { blob: 'slime', round: 'goblin', egg: 'mushroom', ghost: 'wraith', box: 'golem', tri: 'gargoyle', star: 'crystal', cloud: 'troll', fish: 'drake', bean: 'shadow' };

  /* v33 markings: every ordinary monster gets one or two small details of its own, chosen from its name, so two
     monsters of the same kind no longer look alike: freckles, a belly patch, brow stripes, a battle scar,
     a forehead gem, cheek swirls or a few spots on the body. */
  function marks(h, A, P, m) {
    if (!A || !A.eyes || !A.eyes.length || A.noFace === true) return;
    const seed = String(m.seed || m.n || m.sp || 'x') + (m.c || 0), hh = [...seed].reduce((s, ch) => (Math.imul(s, 31) + ch.charCodeAt(0)) >>> 0, 7);
    const base = P.d || P.o || P.b || P.s || Object.values(P).find(v => typeof v === 'string' && v[0] === '#') || '#8a8a8a';
    const L1 = lt(base, .42), D1 = dk(base, .38), pick2 = k => (hh >> (k * 3)) % 7;
    const ex = A.eyes.reduce((s, e) => s + e[0], 0) / A.eyes.length, ey = A.eyes.reduce((s, e) => s + e[1], 0) / A.eyes.length;
    const hd = A.head || { cx: ex, top: ey - 5, w: 5 }, ch = A.chest;
    const kinds = [pick2(0), (pick2(1) + 3) % 7].slice(0, (m.t || 0) >= 2 || (hh & 1) ? 2 : 1);
    kinds.forEach((k, i) => {
      const hi = i ? 1 : 0;
      switch (k) {
        case 0: h.fl('body', D1, mm => A.eyes.forEach(([x, y]) => { mm.e(x - .6, y + 2.2, .22, .22).e(x + .5, y + 2.6, .22, .22).e(x + 1.5, y + 2.1, .22, .22); }));  break;   // freckles
        case 1: if (ch) h.fl('body', L1, mm => mm.e(ch.cx, ch.cy + ch.ry * .35, ch.rx * .62, ch.ry * .62)); break;                                                  // belly patch
        case 2: h.fl('face', D1, mm => A.eyes.forEach(([x, y]) => mm.l(x - 1.4, y - 2.6, x + 1.2, y - 2, .38)));  break;                                             // brow stripes
        case 3: { const [x, y] = A.eyes[hi % A.eyes.length]; h.fl('face', '#F4E8E0', mm => mm.l(x - 1.6, y - 2.6, x + 1.8, y + 2.6, .4)); h.fl('face', D1, mm => mm.l(x - 1.1, y - 1.9, x - .2, y - 2.6, .26).l(x + 1.2, y + 1.6, x + 2, y + 1, .26)); break; } // scar
        case 4: { const gc = P.l || lt(base, .6); h.fl('face', '#FFF3B0', mm => mm.p([[hd.cx, hd.top + .1], [hd.cx + .9, hd.top + 1.2], [hd.cx, hd.top + 2.3], [hd.cx - .9, hd.top + 1.2]])); h.fl('face', gc, mm => mm.e(hd.cx, hd.top + 1.2, .35, .35)); break; }   // forehead gem
        case 5: h.fl('face', mix(base, '#FF7A9A', .55), mm => A.eyes.forEach(([x, y]) => { mm.e(x + (x < ex ? -1.6 : 1.6), y + 2.4, .75, .5); })); break;   // cheek blush
        default: if (ch) h.fl('body', D1, mm => mm.e(ch.cx - ch.rx * .5, ch.cy - ch.ry * .1, .7, .7).e(ch.cx + ch.rx * .35, ch.cy + ch.ry * .3, .6, .6).e(ch.cx + ch.rx * .1, ch.cy - ch.ry * .55, .5, .5)); break;   // body spots
      }
    });
  }

  /* ---------------- one monster -> parts ---------------- */
  function parts(m) {
    if (m.big && typeof BEAST !== 'undefined') return BEAST.boss(m);
    const all = typeof BEAST !== 'undefined' ? { ...SP, ...BEAST.species } : SP;
    const key = (m.sp && all[m.sp]) ? m.sp : BODY[m.b] || 'slime', S2 = all[key];
    const P = S2.pals[(m.c || 0) % S2.pals.length], F2 = new Set(m.f || []), R = [], a = o => R.push(o), h = kit(a);
    a({ g: 'feet', c: 'rgba(15,10,30,.34)', shadow: true, flat: true, m: mm => mm.e(16, 30.8, 11, 1.3) });
    const A = S2.draw(h, P, m, F2);
    const arm = R.length;
    if (!A.noFace) face(h, A, m, F2);
    if (A.hand) {
      const list = A.weapons || [0, 1, 2, 3, 4, 5, 6, 7], W = WEAPONS[list[m.t % list.length]];
      W({ ...h, a: o => a({ g: 'weap', ...o }), fl: (g, c, mm, x = {}) => a({ g: 'weap', c, flat: true, sep: false, m: mm, ...x }) }, A.hand.x, A.hand.y, A.gemC);
      /* the front arm goes over the weapon handle; then the fist */
      const hands = R.filter((p, i) => i < arm && p.arm); hands.forEach(q => { R.splice(R.indexOf(q), 1); R.push(q); });
      a({ g: 'weap', c: A.handC || R[R.length - 1].c, m: mm => mm.e(A.hand.x + .4, A.hand.y + .4, 1.5, 1.5) });
    }
    gear(h, A, m, F2);
    try { marks(h, A, P, m); } catch (e) { /* a marking slip never breaks a monster */ }
    if (m.boss && !m.big && typeof BEAST !== 'undefined') BEAST.elite(a, A);
    if (A.floaty) R.forEach(p => { if (p.shadow) return; p.g = p.g === 'weap' ? 'flyw' : p.g === 'float' ? p.g : 'fly'; });
    return R;
  }
  return { parts, off: OFF, SP, BODY, kit: { GOLD, STEEL, IRON, BONE, WOOD, LEATHER, INK, EYEW, MOUTH, TEETH, TONGUE, WEAPONS, mk: kit, mouth, face } };
})();

/* ---------- the four friendly villains of the age-band sagas, in pixels ---------- */
const PXV = (() => {
  const { sheet, svgOf, memo, F, INK, GOLD, lt, dk } = PX.kit;
  const OFF = { body: F([[0, 0], [0, -1], [0, -1], [0, 0]], [0, 0], [0, 0]), bob: F([[0, 0], [0, 0], [0, -1], [0, -1]], [0, 0], [0, 0]), z: F([[0, 0], [1, -1], [2, -2], [3, -3]], [0, 0], [0, 0]) };
  const face = (a, ex, ey, gap, mx, my, sad, ink = INK) => {
    a({ g: 'body', c: '#ffffff', flat: true, m: m => m.r(ex - gap, ey, 3, 3).r(ex + gap - 2, ey, 3, 3) });
    a({ g: 'body', c: ink, flat: true, sep: false, m: m => m.r(ex - gap + 1, ey + (sad ? 1 : 0), 2, 2).r(ex + gap - 1, ey + (sad ? 1 : 0), 2, 2), dots: [[ex - gap + 1, ey + (sad ? 1 : 0), '#ffffff'], [ex + gap - 1, ey + (sad ? 1 : 0), '#ffffff']] });
    if (sad) { a({ g: 'body', c: ink, flat: true, sep: false, m: m => m.pts([[mx - 2, my + 1], [mx - 1, my], [mx, my], [mx + 1, my], [mx + 2, my + 1]]).pts([[ex - gap - 1, ey - 2], [ex - gap, ey - 2], [ex - gap + 1, ey - 1], [ex + gap + 1, ey - 2], [ex + gap, ey - 2], [ex + gap - 1, ey - 1]]) }); a({ g: 'body', c: '#9FD4FF', flat: true, sep: false, m: m => m.r(ex - gap, ey + 3, 1, 2).pts([[ex - gap, ey + 5]]) }); }
    else a({ g: 'body', c: ink, flat: true, sep: false, m: m => m.pts([[mx - 2, my], [mx - 1, my + 1], [mx, my + 1], [mx + 1, my + 1], [mx + 2, my]]) });
  };
  function parts(v, mood) {
    /* mood: true = sad, 'happy' = friends again at the end of the saga (v26), anything else = the usual look */
    const R = [], a = o => R.push(o), sad = mood === true, happy = mood === 'happy';
    a({ g: 'bob', c: 'rgba(20,10,40,.25)', shadow: true, flat: true, m: m => m.e(16, 30.6, 10, 1.3) });
    if (v === 'puff') {
      a({ g: 'body', c: '#E3D4FA', m: m => m.e(9, 19, 7, 6).e(16, 13.5, 9, 8).e(23.5, 18, 7, 6.5).r(4, 19, 24, 7).e(16, 25, 11, 3), dots: [[10, 9, '#ffffff'], [11, 8, '#ffffff'], [9, 10, '#ffffff']] });
      a({ g: 'body', c: '#FFB3C7', flat: true, sep: false, m: m => m.r(8, 20, 2, 1).r(23, 20, 2, 1) });
      if (sad) face(a, 16, 15, 4, 16, 21, true);
      else if (happy) { face(a, 16, 15, 4, 16, 21, false); ['#FF6B6B', '#FFD166', '#6BD18B', '#4DA3FF'].forEach((c, i) => a({ g: 'body', c, flat: true, sep: false, m: m => m.e(16, 13.5, 9 - i * .9, 8 - i * .9).sub(t => t.e(16, 13.5, 8.1 - i * .9, 7.1 - i * .9)).and(t => t.r(0, 0, 32, 9)) })); }
      else { a({ g: 'body', c: INK, flat: true, sep: false, m: m => m.pts([[11, 16], [12, 17], [13, 16], [19, 16], [20, 17], [21, 16]]) }); a({ g: 'body', c: INK, flat: true, sep: false, m: m => m.r(15, 20, 3, 1) }); a({ g: 'z', c: '#7C5CFF', flat: true, m: m => m.r(25, 4, 4, 1).pts([[27, 5], [26, 6]]).r(25, 7, 4, 1) }); }
    } else if (v === 'momo') {
      a({ g: 'bob', c: '#8B5A2B', m: m => m.l(22, 27, 28, 25, 2).l(28, 25, 28, 19, 2).l(28, 19, 25, 18, 2) });
      a({ g: 'bob', c: '#8B5A2B', m: m => m.e(16, 26, 6.5, 4.5) });
      a({ g: 'body', c: '#8B5A2B', m: m => m.e(6.5, 12, 3.5, 3.5).e(25.5, 12, 3.5, 3.5) });
      a({ g: 'body', c: '#E8C39E', flat: true, sep: false, m: m => m.e(6.5, 12, 1.8, 1.8).e(25.5, 12, 1.8, 1.8) });
      a({ g: 'body', c: '#8B5A2B', m: m => m.e(16, 12.5, 9, 8.5), dots: [[11, 6, '#B98450'], [12, 5, '#B98450']] });
      a({ g: 'body', c: '#E8C39E', sep: false, soft: true, m: m => m.e(16, 14.5, 6.5, 5.5).e(13, 10.5, 3, 3).e(19, 10.5, 3, 3) });
      face(a, 16, 10, 3, 16, 17, sad);
      a({ g: 'bob', c: '#FFD166', m: m => m.e(23.5, 26, 3, 3), dots: [[22, 25, '#FFF3C4']] });
    } else if (v === 'glitch') {
      a({ g: 'body', c: '#6B7488', flat: true, m: m => m.r(15, 2, 2, 5) });
      a({ g: 'body', c: sad ? '#7FB8FF' : '#FF6B6B', m: m => m.e(16, 2.5, 2.2, 2.2), dots: [[15, 1, '#ffffff']] });
      a({ g: 'body', c: '#8591AB', m: m => m.e(6, 13, 2.6, 3).e(26, 13, 2.6, 3) });
      a({ g: 'body', c: '#AAB4C8', m: m => m.r(7, 6, 18, 14).sub(t => t.pts([[7, 6], [24, 6], [7, 19], [24, 19]])), dots: [[9, 7, '#ffffff'], [10, 7, '#ffffff']] });
      a({ g: 'body', c: '#1D2A3A', flat: true, sep: false, m: m => m.r(9, 8, 14, 10) });
      const gl = sad ? '#7FD6FF' : '#7FFFD4';
      if (sad) a({ g: 'body', c: gl, flat: true, sep: false, m: m => m.pts([[11, 11], [12, 12], [13, 12], [19, 12], [20, 12], [21, 11], [13, 15], [14, 14], [15, 15], [16, 14], [17, 15], [18, 14], [19, 15]]) });
      else a({ g: 'body', c: gl, flat: true, sep: false, m: m => m.pts([[11, 12], [12, 11], [13, 12], [19, 12], [20, 11], [21, 12], [13, 14], [14, 15], [15, 15], [16, 15], [17, 15], [18, 15], [19, 14]]) });
      a({ g: 'bob', c: '#F3F6FA', m: m => m.r(10, 21, 12, 8) });
      a({ g: 'bob', c: sad ? GOLD : '#6BD18B', m: m => m.e(16, 25, 2, 2) });
      a({ g: 'bob', c: '#8591AB', m: m => m.r(11, 29, 3, 2).r(18, 29, 3, 2) });
    } else if (v === 'demon') {   /* v26: Drakmor, the giant shadow demon of the age 7 saga (sad = sealed away in chains) */
      const sk = sad ? '#4A3E5C' : '#3A1E4A', wing = sad ? '#2E2638' : '#24102E', bone = sad ? '#B8B0A4' : '#E8D8C0';
      a({ g: 'bob', c: wing, m: m => m.p([[9, 14], [1, 5], [2.5, 11], [0, 14], [3, 17.5], [1, 22], [9, 20]]).p([[23, 14], [31, 5], [29.5, 11], [32, 14], [29, 17.5], [31, 22], [23, 20]]) });
      a({ g: 'bob', c: lt(wing, .25), flat: true, sep: false, m: m => m.l(8, 15, 2.5, 7, .4).l(8, 17, 1.5, 15, .4).l(24, 15, 29.5, 7, .4).l(24, 17, 30.5, 15, .4) });
      a({ g: 'bob', c: sk, m: m => m.e(16, 25.5, 10, 5.5).r(7, 22, 18, 9) });
      a({ g: 'bob', c: sad ? '#6A6A86' : '#FF6B3B', flat: true, sep: false, m: m => m.p([[16, 22.5], [18, 25.5], [16, 28.5], [14, 25.5]]) });
      a({ g: 'body', c: sk, m: m => m.e(16, 13, 8, 7.5), dots: [[12, 8, lt(sk, .4)], [13, 7, lt(sk, .4)]] });
      a({ g: 'body', c: bone, m: m => m.p([[9.5, 9.5], [5, 3.5], [5.5, 1], [11.5, 7.5]]).p([[22.5, 9.5], [27, 3.5], [26.5, 1], [20.5, 7.5]]) });
      a({ g: 'body', c: dk(sk, .45), flat: true, sep: false, m: m => m.p([[10, 11], [15, 12.8], [15, 13.8], [10, 12.4]]).p([[22, 11], [17, 12.8], [17, 13.8], [22, 12.4]]) });
      a({ g: 'body', c: sad ? '#8A8AA8' : '#FF3B3B', flat: true, m: m => sad ? m.r(11, 14, 3, 1).r(18, 14, 3, 1) : m.r(11, 13, 3, 2).r(18, 13, 3, 2) });
      if (!sad) a({ g: 'body', c: '#FFE14D', flat: true, sep: false, m: m => m.pts([[12, 13], [19, 13]]) });
      a({ g: 'body', c: '#1A0A1E', flat: true, sep: false, m: m => sad ? m.r(13, 18, 6, 1) : m.p([[11, 17], [21, 17], [19, 20], [13, 20]]) });
      if (!sad) a({ g: 'body', c: '#FFFFFF', flat: true, sep: false, m: m => m.pts([[12, 17], [14, 17], [18, 17], [20, 17], [13, 18], [19, 18]]) });
      if (!sad) [[4, 29, [0, 2]], [28, 28, [1, 3]], [8, 31, [1, 3]], [24, 31, [0, 2]]].forEach(([x, y, fr]) => a({ g: 'bob', c: '#FF8A3D', flat: true, fr, m: m => m.p([[x - 1.2, y], [x, y - 3.5], [x + 1.2, y]]) }));
      else { a({ g: 'bob', c: '#9AA3AE', flat: true, sep: false, m: m => m.l(4, 19, 28, 29, .9).l(28, 19, 4, 29, .9) }); a({ g: 'z', c: '#FFF3A8', flat: true, fr: [0, 2], m: m => m.p(PX.kit.star(26, 6, 2, .8)) }); }
    } else {
      const c = '#9AA0B5';
      a({ g: 'body', c, m: m => m.e(9.5, 19, 7, 6.5).e(17, 13, 9.5, 8.5).e(24, 19.5, 6.5, 6).r(4, 19, 25, 8), dots: [[11, 8, lt(c, .5)], [12, 7, lt(c, .5)]] });
      a({ g: 'body', c: dk(c, .2), flat: true, sep: false, m: m => m.r(6, 26, 21, 1) });
      face(a, 16, 15, 4, 16, 21, sad);
      if (happy) a({ g: 'body', c: '#FFB3C7', flat: true, sep: false, m: m => m.r(9, 19, 2, 1).r(21, 19, 2, 1) });
      else if (!sad) a({ g: 'body', c: INK, flat: true, sep: false, m: m => m.pts([[10, 12], [11, 12], [12, 13], [22, 12], [21, 12], [20, 13]]) });
      a({ g: 'z', c: '#C9CED8', flat: true, fr: [0, 1, 2], m: m => m.e(27, 8, 1.5, 1.5) });
    }
    return R;
  }
  const NAMES = { puff: 'Puff', momo: 'Momo', murk: 'Murk', glitch: 'Professor Glitch', demon: 'Drakmor' };
  return { svg: (v, mood) => { const k = mood === true ? 1 : mood === 'happy' ? 'h' : 0; return svgOf(memo('v:' + v + k, () => sheet(parts(v, mood === true || mood === 'happy' ? mood : false), OFF, 4)), 'px-villain', NAMES[v] || v, 4); } };
})();
