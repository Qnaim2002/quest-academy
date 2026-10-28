/* ================= v20: the bestiary — ten more species and the ten zone bosses =================
   Species: Mimic (monstrosity), Horned Imp (fiend), Pixie Dryad (fey), Skeleton Warrior (undead),
   Clockwork Automaton (construct), Seraph Sentinel (celestial), Fire Elemental (elemental),
   Cyclops (giant), Dire Wolf (beast), Owlbear (monstrosity). They use the shared kit from 09d.
   Zone bosses (each subject meets all ten, in a different order): Ancient Dragon, Lich King,
   Stone Titan, Fiend Lord, Archon, Elemental Lord, Fey Queen, Chimera, Clockwork Colossus, Hydra.
   Bosses fill the frame and carry a glowing aura. Monsters face LEFT toward the hero. */
const BEAST = (() => {
  const { mix, dk, lt, star, IDLE, NOTHURT, F } = PX.kit;
  const { GOLD, STEEL, IRON, BONE, WOOD, LEATHER, INK, MOUTH, TEETH, TONGUE } = MON2.kit;
  const rgba = (h, al) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${al})`;
  const seam = (a, g, c, fn) => a({ g, c, flat: true, sep: false, m: fn });
  const tri = (m, x, y, w, h) => m.p([[x - w, y], [x, y - h], [x + w, y]]);
  const spark = (a, g, c, list) => list.forEach(([x, y, fr]) => a({ g, c, flat: true, sep: false, fr, m: m => m.pts([[x, y - 1], [x - 1, y], [x, y], [x + 1, y], [x, y + 1]]) }));
  const ember = (a, g, c, list) => list.forEach(([x, y, fr]) => a({ g, c, flat: true, sep: false, fr, m: m => m.r(x, y, .7, .7) }));
  Object.assign(MON2.off, {
    h1: F([[0, 0], [-.5, -.5], [-.5, -1], [0, -.5]], [2, 0], [-3, 1]),
    h2: F([[0, 0], [0, -1], [.5, -1], [.5, 0]], [2, 1], [-3, 0]),
    h3: F([[0, -.5], [.5, -1], [.5, 0], [0, 0]], [2, 0], [-2, 1]),
    h4: F([[0, 0], [.5, .5], [0, 1], [-.5, .5]], [1, 0], [-3, -1]),
    jaw: F([[0, 0], [0, 0], [0, .5], [0, .5]], [2, 1], [-2, 1.2]),
    pulse: F([[0, 0], [0, 0], [0, 0], [0, 0]], [0, 0], [0, 0])
  });
  /* a fan of tapered feathers (wings), from root (x,y), angles in degrees, mirrored with dir=-1 */
  const featherFan = (mm, x, y, dir, list) => list.forEach(([ang, len, w]) => { const t = ang * Math.PI / 180, X = x + Math.cos(t) * len * dir, Y = y + Math.sin(t) * len; mm.l(x, y, (x + X) / 2, (y + Y) / 2, w).l((x + X) / 2, (y + Y) / 2, X, Y, w * .62); });

  /* =================================== SPECIES =================================== */
  const species = {
    /* MIMIC: a treasure chest with a fanged, glowing-eyed mouth, a lolling tongue and little claw legs */
    mimic: {
      pals: [{ w: '#8A5A36', m: '#A8B2BC', f: '#C2405E' }, { w: '#6E4A3A', m: '#D9A93B', f: '#9A3EC2' }, { w: '#A07A4E', m: '#7E8C96', f: '#D8604A' }, { w: '#5A4A5E', m: '#C9A13B', f: '#3EA8C2' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, wd = P.w, mt = P.m, tg = P.f;
        a({ g: 'feet', c: dk(tg, .25), m: mm => mm.l(8, 25.6, 6.2, 29.8, 1.6).l(12, 26.4, 11.4, 30, 1.5).l(20, 26.4, 20.6, 30, 1.5).l(24, 25.6, 25.8, 29.8, 1.6) });
        h.dot('feet', BONE, [[5.6, 29.8], [11, 30.2], [20.4, 30.2], [25.6, 29.8]]);
        a({ g: 'body', c: '#2A0A18', flat: true, m: mm => mm.p([[5.4, 18.4], [26.6, 18.4], [26.8, 13.4], [6.4, 10.6]]) });
        a({ g: 'body', c: tg, m: mm => mm.e(15.6, 17.6, 7, 2) });
        const chest = mm => mm.p([[4.8, 18], [27.2, 18], [27.4, 27.8], [4.6, 27.8]]);
        a({ g: 'body', c: wd, tex: 'wood', round: 2, m: chest });
        a({ g: 'body', c: mt, gloss: 1, round: 1.5, m: mm => mm.r(4.4, 17.4, 23.2, 1.7).r(8.2, 18, 1.7, 9.8).r(22.2, 18, 1.7, 9.8).r(4.4, 26.4, 23.2, 1.6) });
        a({ g: 'body', c: mt, gloss: 1, m: mm => mm.p([[4.2, 17.2], [7.4, 17.2], [7.4, 19], [5.8, 20.6], [4.2, 20.6]]).p([[27.8, 17.2], [24.6, 17.2], [24.6, 19], [26.2, 20.6], [27.8, 20.6]]).p([[4.2, 28.2], [7.6, 28.2], [7.6, 26.2], [4.2, 26.2]]).p([[27.8, 28.2], [24.4, 28.2], [24.4, 26.2], [27.8, 26.2]]) });
        fl('body', lt(mt, .5), mm => { [[9.05, 20], [9.05, 24.6], [23.05, 20], [23.05, 24.6], [13, 18.2], [18.6, 18.2]].forEach(([x, y]) => mm.r(x - .25, y - .25, .5, .5)); });
        a({ g: 'body', c: GOLD, gloss: 1, m: mm => mm.p([[14.2, 18.8], [17.8, 18.8], [17.8, 22], [16, 23.2], [14.2, 22]]) });
        fl('body', '#2A1A10', mm => mm.e(16, 20.4, .55, .55).r(15.75, 20.6, .5, 1.3));
        fl('body', GOLD, mm => mm.e(6, 28.2, 1.2, .55).e(8.4, 28.6, 1.1, .5).e(27.2, 28.6, 1, .5));
        const lid = mm => mm.p([[4.2, 10.8], [27.6, 13.6], [28.2, 8.6], [26.4, 5.6], [22, 4.2], [9.6, 3.4], [5.6, 4.8], [4, 7]]);
        a({ g: 'face', c: wd, tex: 'wood', round: 3, m: lid });
        a({ g: 'face', c: mt, gloss: 1, sep: false, m: mm => lid(mm).and(t => t.l(4.2, 10.2, 27.6, 13, 1.4).r(9, 0, 1.7, 32).r(21.8, 0, 1.7, 32)) });
        fl('face', lt(mt, .5), mm => { [[9.85, 5.6], [9.85, 8.6], [22.65, 6.4], [22.65, 9.6]].forEach(([x, y]) => mm.r(x - .25, y - .25, .5, .5)); });
        a({ g: 'face', c: TEETH, m: mm => { for (let i = 0; i < 6; i++) { const x = 7 + i * 3.4, y = 11.2 + i * .4; mm.p([[x - 1.1, y], [x + 1.1, y + .3], [x + .1, y + 2.8]]); } } });
        a({ g: 'body', c: TEETH, m: mm => { for (let i = 0; i < 6; i++) tri(mm, 7.8 + i * 3.4, 18, 1.1, 2.8); } });
        a({ g: 'weap', c: tg, fr: [0, 1, 4], m: mm => mm.l(10, 17, 5.6, 19.4, 2.2).l(5.6, 19.4, 3, 23, 1.9).e(3.2, 23.4, 1.2, 1) });
        a({ g: 'weap', c: tg, fr: [2, 3, 5], m: mm => mm.l(10, 17, 5, 18.6, 2.2).l(5, 18.6, 1.8, 20.8, 1.9).e(1.8, 21.2, 1.2, 1) });
        fl('weap', dk(tg, .35), mm => mm.l(9, 17.6, 5, 20, .4));
        return { eyes: [[12.8, 7.2], [18.8, 7.8]], er: 1.15, glow: '#F2D27A', brows: false, noMouth: true, threeOK: false, head: { cx: 16, top: 4, w: 9 }, chest: { cx: 16, cy: 23, rx: 8, ry: 3 }, gear: ['hat'], hats: ['crown', 'horned', 'hood'] };
      }
    },
    /* HORNED IMP: a wiry little fiend with goat legs, bat wings, a spade tail and a trident */
    imp: {
      pals: [{ s: '#C9453A', w: '#6E1E2A', e: '#F2C14E' }, { s: '#7A4EC9', w: '#3A1E6E', e: '#8FF2B8' }, { s: '#3E8EC9', w: '#1E3A6E', e: '#F2C14E' }, { s: '#E8743A', w: '#8A2E1E', e: '#FFF08F' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, sk = P.s, sd = dk(sk, .3), hf = '#2A1A1A';
        a({ g: 'wing', c: P.w, round: 2, m: mm => mm.p([[17.4, 13.6], [21, 6], [25.6, 3.4], [29.6, 5.8], [27.8, 9.4], [29.4, 13.2], [26, 12.8], [25.4, 17], [21.6, 15.6]]).p([[13.4, 13], [10.8, 7.6], [7.4, 6.4], [6.6, 9.6], [8.6, 12], [8.4, 15.6], [11.6, 15.6]]) });
        fl('wing', dk(P.w, .4), mm => mm.l(18, 13.6, 25.6, 3.8, .5).l(25.6, 3.8, 27.8, 9.4, .34).l(25.6, 3.8, 26, 12.8, .34).l(13, 13, 7.6, 6.8, .5));
        a({ g: 'tail', c: sk, m: mm => mm.l(18, 23.6, 25, 26, 1.1).l(25, 26, 28.6, 21, 1) });
        a({ g: 'tail', c: sd, m: mm => mm.p([[27.2, 21.6], [28.8, 17.4], [30.6, 21.4], [28.8, 20.6]]) });
        a({ g: 'feet', c: sd, m: mm => mm.l(13.4, 21, 11.6, 25, 2.6).l(11.6, 25, 12.8, 28.6, 1.7).l(18.4, 21, 20, 25, 2.6).l(20, 25, 18.8, 28.6, 1.7) });
        a({ g: 'feet', c: hf, gloss: 1, m: mm => mm.r(11, 28.4, 3, 1.8).r(17.6, 28.4, 3, 1.8) });
        a({ g: 'body', c: sk, m: mm => mm.l(19.4, 15, 22, 19.4, 1.8).e(22.4, 20, 1.2, 1.2) });
        const tor = mm => mm.e(15.6, 18, 4.6, 4.8);
        a({ g: 'body', c: sk, round: 4, m: tor });
        a({ g: 'body', c: lt(sk, .25), sep: false, m: mm => mm.e(15, 19.4, 2.4, 3) });
        fl('body', sd, mm => mm.l(13.6, 16.4, 15.4, 17, .34).l(16.4, 17, 18, 16.4, .34).r(14.8, 18.6, 1, .34).r(14.8, 20, 1, .34));
        a({ g: 'body', c: LEATHER, sep: false, m: mm => mm.p([[11.4, 21], [19.8, 21], [20.4, 23.6], [16, 24.6], [11, 23.6]]) });
        a({ g: 'body', c: GOLD, gloss: 1, sep: false, m: mm => mm.r(14.8, 21, 2, 1.2) });
        a({ g: 'face', c: sk, m: mm => mm.p([[9.6, 9.6], [5, 7], [9.4, 12]]).p([[17, 9.6], [21, 7], [17.4, 12]]) });
        a({ g: 'face', c: sk, round: 4, m: mm => mm.e(13.4, 10.4, 4.4, 4.2).e(13, 12.6, 3.4, 2.2) });
        a({ g: 'face', c: hf, gloss: 1, m: mm => mm.l(11.2, 7.4, 9.6, 4, 1.4).l(9.6, 4, 11, 2, 1).l(15.6, 7.4, 17.6, 4, 1.4).l(17.6, 4, 16.4, 2, 1) });
        a({ g: 'weap', c: sk, arm: 1, m: mm => mm.l(12.4, 16, 7.6, 19.6, 1.9) });
        return { eyes: [[11.6, 10], [15, 10.2]], er: 1.2, iris: P.e, browC: dk(sk, .55), lidC: sk, mouth: { x: 12.8, y: 13, w: 2.4 }, head: { cx: 13.4, top: 6.4, w: 4.4 }, neck: { x: 13.6, y: 14, w: 5 }, chest: { cx: 15.6, cy: 18.6, rx: 3.6, ry: 3 }, hand: { x: 7.6, y: 19.6 }, weapons: [6], handC: sk, gear: ['hat', 'cape', 'amulet', 'paint'], hats: ['crown', 'hood'], capeC: P.w };
      }
    },
    /* PIXIE DRYAD: a slender forest spirit with bark skin, leafy hair, glassy wings and a seed staff */
    dryad: {
      pals: [{ l: '#5FA84E', k: '#D8B48A', h: '#3E7A3E', f: '#F28AB0', g: '#4E9A2E' }, { l: '#E08A3A', k: '#E0B48E', h: '#B8502E', f: '#F2D27A', g: '#B8501E' }, { l: '#E88AB0', k: '#EAC6B0', h: '#B85A8A', f: '#FFFFFF', g: '#A8306A' }, { l: '#7AB8D8', k: '#D6DEE8', h: '#4E7AA8', f: '#E8F4FF', g: '#2E6AA8' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, wc = mix(P.l, '#FFFFFF', .62);
        a({ g: 'wing', c: wc, flat: true, m: mm => mm.p([[17.6, 11.6], [22, 5], [27.6, 2], [30.6, 4.6], [27.6, 9.6], [21.6, 13.6]]).p([[17.8, 14.4], [24.6, 15.4], [28, 19.6], [25.4, 21.6], [20, 17.6]]).p([[14.6, 11], [11.4, 5.4], [8.4, 4.4], [8.2, 7.6], [12.6, 13]]) });
        fl('wing', mix(P.l, '#FFFFFF', .82), mm => mm.p([[19, 11.4], [23, 6.4], [27.4, 4], [28.4, 6], [24.6, 9.6]]).p([[19.6, 15.2], [24.4, 16.6], [26.4, 19.6], [24.4, 19.6]]));
        fl('wing', mix(P.l, '#FFFFFF', .2), mm => mm.l(18, 12.2, 28.6, 3.6, .34).l(22, 9.6, 26, 9.6, .34).l(18.4, 14.8, 26.4, 20.2, .34).l(14.4, 11.4, 9, 5.6, .34));
        a({ g: 'body', c: P.h, round: 3, m: mm => mm.p([[13.4, 5.6], [18.6, 4.6], [21.4, 8], [22.8, 13.6], [21.8, 19.4], [19.4, 16.6], [18.8, 11.6]]) });
        a({ g: 'body', c: P.h, m: mm => { tri(mm, 22.4, 20.2, .7, -1.6); tri(mm, 20.8, 18, .6, -1.4); } });
        a({ g: 'feet', c: P.k, m: mm => mm.l(14.8, 25, 14.2, 29.6, 1.1).l(17.4, 25, 17.8, 29.6, 1.1) });
        const gown = mm => mm.p([[12.6, 14.4], [19.4, 14.4], [21.4, 19], [24, 26.4], [21, 25.6], [19.4, 28.4], [16.6, 26.4], [14, 28.6], [12, 25.8], [9, 26.8], [11, 19]]);
        a({ g: 'body', c: P.l, round: 4, m: gown });
        a({ g: 'body', c: lt(P.l, .18), sep: false, m: mm => mm.p([[12.6, 14.4], [19.4, 14.4], [20.6, 18.6], [18.4, 21.4], [16, 19.4], [13.6, 21.4], [11.4, 18.6]]) });
        fl('body', dk(P.l, .3), mm => gown(mm).and(t => t.l(14.6, 20, 12.6, 26, .4).l(17.6, 20, 19.8, 26.6, .4)));
        a({ g: 'body', c: dk(P.l, .12), round: 3, m: mm => mm.p([[13, 10.6], [18.8, 10.6], [19.6, 15], [12.4, 15]]) });
        fl('body', P.h, mm => mm.r(12.4, 14.4, 7.2, .7));
        a({ g: 'body', c: P.k, m: mm => mm.l(18.6, 11.8, 21, 15.4, 1.1) });
        a({ g: 'face', c: P.k, m: mm => mm.r(14.6, 9.2, 2.4, 1.8) });
        a({ g: 'face', c: P.k, round: 3, m: mm => mm.e(15.2, 7, 3.2, 3.5) });
        fl('face', dk(P.k, .3), mm => mm.l(17.4, 7.6, 17.8, 9, .34).l(12.6, 9, 13.2, 9.6, .34));
        a({ g: 'face', c: P.h, round: 2, m: mm => mm.p([[11.8, 6.4], [12.8, 3.4], [15.8, 2.4], [18.8, 3.4], [19.4, 6.6], [17, 5], [14.6, 5.4], [12.8, 7.4]]) });
        fl('face', P.f, mm => mm.e(13.2, 3.8, .8, .8).e(16.2, 2.6, .9, .9).e(18.8, 4, .8, .8));
        fl('face', GOLD, mm => mm.r(13, 3.6, .45, .45).r(16, 2.4, .45, .45).r(18.6, 3.8, .45, .45));
        fl('face', MOUTH, mm => mm.l(13.8, 9.2, 15.2, 9.5, .34), { fr: IDLE });
        fl('face', MOUTH, mm => mm.e(14.4, 9.5, .6, .6), { fr: [4, 5] });
        a({ g: 'weap', c: P.k, arm: 1, m: mm => mm.l(13.4, 11.6, 10, 15.4, 1.2) });
        h.spark('float', mix(P.l, '#FFFFFF', .5), [[5, 6, [0, 1]], [27.6, 25, [2, 3]], [6.6, 25.6, [1, 2]], [24, 2, [3, 0]]]);
        return { eyes: [[13.8, 7.1], [16.6, 7.1]], er: .82, iris: P.g, brows: false, lidC: P.k, noMouth: true, threeOK: false, head: { cx: 15.6, top: 2.4, w: 3.6 }, hand: { x: 9.6, y: 15.8 }, weapons: [4], gemC: mix(P.g, '#FFFFFF', .4), handC: P.k, floaty: true, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* SKELETON WARRIOR: old bones in a tattered loincloth, a notched blade and a battered round shield */
    skeleton: {
      pals: [{ b: '#E6DCC0', g: '#7FE7F2', c: '#8A2E2E' }, { b: '#D8D0C0', g: '#8FF2B8', c: '#2E4A6A' }, { b: '#E8D8B8', g: '#F2503B', c: '#4A2E5A' }, { b: '#CFC8D8', g: '#C97FFF', c: '#5A4A2A' }],
      draw(h, P, m) {
        const { a, fl } = h, bn = P.b, bd = dk(bn, .3), hole = '#1E1622';
        a({ g: 'back', c: WOOD, tex: 'wood', round: 3, m: mm => mm.e(24.6, 18.4, 3.8, 4) });
        fl('back', P.c, mm => mm.e(24.6, 18.4, 3.2, 3.4).and(t => t.r(0, 18.4, 32, 6)));
        a({ g: 'back', c: IRON, sep: false, m: mm => mm.e(24.6, 18.4, 3.8, 4).sub(t => t.e(24.6, 18.4, 3.2, 3.4)) });
        a({ g: 'back', c: STEEL, gloss: 1, m: mm => mm.e(24.6, 18.4, 1.1, 1.1) });
        fl('back', '#3A2A1C', mm => mm.l(22, 16, 23.4, 18.6, .34).l(26.4, 20.4, 27.2, 22, .34));
        a({ g: 'feet', c: bn, m: mm => mm.l(14.2, 20.8, 12.8, 25, 1.1).l(12.8, 25, 11.8, 28.8, 1).l(17.8, 20.8, 19.4, 25, 1.1).l(19.4, 25, 20, 28.8, 1) });
        a({ g: 'feet', c: bn, m: mm => mm.e(12.8, 25, .95, .9).e(19.4, 25, .95, .9).p([[9.4, 30.4], [10.4, 28.6], [12.6, 28.6], [13, 30.4]]).p([[19, 30.4], [19.4, 28.6], [21.8, 28.8], [22.4, 30.4]]) });
        a({ g: 'body', c: bn, m: mm => mm.l(19.8, 12.8, 22.4, 16.6, .95).e(22.4, 16.6, .8, .8).l(22.4, 16.6, 23.4, 18.8, .9).e(23.6, 19.2, .9, .9) });
        a({ g: 'body', c: bn, m: mm => mm.p([[12.8, 19], [19.2, 19], [18.6, 21.6], [16, 22.4], [13.4, 21.6]]) });
        a({ g: 'body', c: P.c, round: 2, m: mm => mm.p([[12.6, 20.6], [19.6, 20.6], [20.4, 24.8], [18.4, 23.6], [17, 25.8], [15, 23.8], [13.2, 25], [12.2, 23.2]]) });
        a({ g: 'body', c: bn, m: mm => { for (let y = 12.8; y < 19.4; y += 1.1) mm.e(16, y, .78, .5); } });
        for (let i = 0; i < 4; i++) { const y0 = 12.8 + i * 1.35, rx = 4.2 - i * .28; a({ g: 'body', c: bn, m: mm => mm.e(16, y0 + .9, rx, 1.35).sub(t => t.e(16, y0 + 1.35, rx - .8, .9)).and(t => t.r(0, y0, 32, 2.4)) }); }
        a({ g: 'body', c: bn, m: mm => mm.r(15.5, 12.6, 1, 4.8).l(12, 12.4, 15.6, 12.8, .8).l(16.4, 12.8, 20, 12.4, .8) });
        a({ g: 'face', c: bn, round: 3, m: mm => mm.e(14.2, 7.4, 3.9, 3.6) });
        a({ g: 'face', c: bn, round: 2, m: mm => mm.p([[10.6, 7.8], [17.6, 7.8], [17.2, 10.4], [15.6, 11.2], [12.2, 11.2], [10.8, 10.2]]) });
        fl('face', hole, mm => mm.e(12.4, 8.8, 1.25, 1.15).e(15.8, 8.8, 1.25, 1.15).p([[13.7, 10.6], [14.5, 10.6], [14.1, 9.6]]));
        fl('face', bd, mm => mm.l(16, 4.6, 16.8, 6.4, .34).l(16.8, 6.4, 16.2, 7.2, .34));
        a({ g: 'jaw', c: bn, m: mm => mm.p([[11.4, 11], [16.8, 11], [16.2, 12.9], [12, 12.9]]) });
        fl('jaw', hole, mm => mm.r(12, 11, 4.4, .34).r(12.8, 11, .34, 1).r(14, 11, .34, 1).r(15.2, 11, .34, 1));
        a({ g: 'weap', c: bn, arm: 1, m: mm => mm.l(12.6, 12.8, 10.6, 16, .95).e(10.6, 16, .8, .8).l(10.6, 16, 8.2, 18.4, .9) });
        return { eyes: [[12.4, 8.9], [15.8, 8.9]], er: .72, glow: P.g, brows: false, noMouth: true, threeOK: false, head: { cx: 14.2, top: 4, w: 4 }, neck: { x: 15, y: 12.4, w: 4 }, chest: { cx: 16, cy: 15.4, rx: 3.4, ry: 2.6 }, hand: { x: 8, y: 18.6 }, weapons: [7, 1, 3, 5], handC: bn, capeC: P.c, gear: ['hat', 'cape'], hats: ['helm', 'horned', 'crown'] };
      }
    },
    /* CLOCKWORK AUTOMATON: a brass walker with a turning chest gear, a steam stack and a wind-up key */
    automaton: {
      pals: [{ b: '#C9953E', c: '#9A5A32', g: '#7FE7F2' }, { b: '#B8BFC9', c: '#5A6A7A', g: '#F2C14E' }, { b: '#6FA88E', c: '#3E6A5A', g: '#F28A6F' }, { b: '#B86A4A', c: '#7A3E2E', g: '#8FF2B8' }],
      draw(h, P, m) {
        const { a, fl } = h, br = P.b, cu = P.c, ir = '#4A5058';
        a({ g: 'back', c: GOLD, gloss: 1, m: mm => mm.r(25.6, 15.6, 3, 1.1) });
        a({ g: 'back', c: GOLD, gloss: 1, fr: [0, 1, 4, 5], m: mm => mm.e(29, 14.4, 1.3, 1.3).e(29, 17.6, 1.3, 1.3).sub(t => t.e(29, 14.4, .5, .5).e(29, 17.6, .5, .5)) });
        a({ g: 'back', c: GOLD, gloss: 1, fr: [2, 3], m: mm => mm.e(29, 16, 2.2, .8) });
        a({ g: 'back', c: ir, gloss: 1, m: mm => mm.r(21.6, 3.4, 2.2, 6.6) });
        a({ g: 'back', c: cu, sep: false, m: mm => mm.r(21.4, 3.2, 2.6, .9).r(21.4, 6.2, 2.6, .7) });
        a({ g: 'float', c: '#E4E8EE', fr: [0, 1], m: mm => mm.e(23, 1.6, 1.4, 1.1) });
        a({ g: 'float', c: '#E4E8EE', fr: [2, 3], m: mm => mm.e(24.4, .9, 1.6, .9).e(22.4, 2.2, .8, .7) });
        a({ g: 'feet', c: ir, gloss: 1, m: mm => mm.r(10.6, 22, 3, 5.4).r(18.6, 22, 3, 5.4) });
        fl('feet', lt(ir, .45), mm => mm.r(11.6, 22.4, .5, 4.6).r(19.6, 22.4, .5, 4.6));
        a({ g: 'feet', c: br, gloss: 1, m: mm => mm.p([[8.4, 30.2], [9, 27], [14.4, 27], [14.8, 30.2]]).p([[17.4, 30.2], [17.6, 27], [23, 27], [23.6, 30.2]]) });
        a({ g: 'body', c: ir, gloss: 1, m: mm => mm.e(25, 13.6, 2.4, 2.2).r(24, 15.6, 2.8, 5).e(25.4, 21, 1.8, 1.6) });
        const tor = mm => mm.p([[8, 11], [24, 11], [25.4, 16], [24, 23], [8, 23], [6.6, 16]]);
        a({ g: 'body', c: br, gloss: 1, round: 5, m: tor });
        fl('body', dk(br, .3), mm => tor(mm).and(t => t.r(0, 13.4, 32, .34).r(0, 20.6, 32, .34)));
        fl('body', lt(br, .5), mm => { for (let i = 0; i < 7; i++) mm.r(9.2 + i * 2.2, 12, .5, .5).r(9.2 + i * 2.2, 21.8, .5, .5); });
        a({ g: 'body', c: dk(br, .4), m: mm => mm.e(16, 17, 4, 4) });
        const teeth = rot => mm => { for (let i = 0; i < 8; i++) { const t = rot + i * Math.PI / 4; mm.e(16 + Math.cos(t) * 3.4, 17 + Math.sin(t) * 3.4, .8, .8); } };
        a({ g: 'body', c: cu, gloss: 1, sep: false, fr: [0, 2, 4], m: mm => { mm.e(16, 17, 3, 3); teeth(0)(mm); } });
        a({ g: 'body', c: cu, gloss: 1, sep: false, fr: [1, 3, 5], m: mm => { mm.e(16, 17, 3, 3); teeth(Math.PI / 8)(mm); } });
        a({ g: 'body', c: ir, gloss: 1, sep: false, m: mm => mm.e(16, 17, 1.2, 1.2) });
        a({ g: 'face', c: br, gloss: 1, round: 3, m: mm => mm.r(11, 4.6, 10, 6.4).e(16, 5, 5, 2.6) });
        a({ g: 'face', c: ir, sep: false, m: mm => mm.r(11, 7, 10, 2.6) });
        fl('face', '#1E2228', mm => mm.r(12, 10, 8, .34).r(13, 10, .34, .8).r(15, 10, .34, .8).r(17, 10, .34, .8).r(19, 10, .34, .8));
        a({ g: 'face', c: '#1E2228', m: mm => mm.e(15.6, 8.2, 1.7, 1.5) });
        a({ g: 'weap', c: ir, arm: 1, gloss: 1, m: mm => mm.e(8.6, 13.4, 2.6, 2.4).l(8.6, 14, 6.6, 18.6, 2.4) });
        return { eyes: [[15.6, 8.2]], er: 1.15, eyeStyle: 'fixed', glow: P.g, brows: false, noMouth: true, head: { cx: 16, top: 2.6, w: 5.6 }, neck: { x: 16, y: 11, w: 9 }, chest: { cx: 16, cy: 17, rx: 3, ry: 3 }, hand: { x: 6.4, y: 19.4 }, weapons: [5, 3], handC: br, gear: ['hat'], hats: ['crown', 'helm'] };
      }
    },
    /* SERAPH SENTINEL: a golden-armoured angel with layered feathered wings, a halo and a sun spear */
    seraph: {
      pals: [{ a: '#E3BC4E', r: '#F2EDE0', g: '#7FD8FF' }, { a: '#C9D1DE', r: '#E8EEF8', g: '#FFD27A' }, { a: '#E8A0A0', r: '#FFF0F0', g: '#FFFFFF' }, { a: '#9AC9A8', r: '#F0FFF4', g: '#FFE08F' }],
      draw(h, P, m) {
        const { a, fl } = h, gd = P.a, wh = P.r, fe = mix(wh, '#C9C0B0', .15);
        const wingR = [[18.4, 13.4], [19.6, 8.4], [22.6, 4.2], [26.6, 1.6], [31.4, 1.2], [30, 3.6], [31.6, 5.4], [29.6, 7.4], [31.2, 9.6], [28.8, 11], [30, 13.4], [27, 14.2], [27.8, 16.8], [24.4, 16.6], [24.4, 19.4], [21.2, 17.6]];
        const wingL = wingR.map(([x, y]) => [32 - x + (x - 18.4) * -.08, y + .4]);
        a({ g: 'wing', c: fe, tex: 'feather', round: 3, m: mm => mm.p(wingR).p(wingL) });
        fl('wing', mix(fe, '#7A7090', .45), mm => mm.l(21, 12, 30, 3.8, .4).l(21.6, 13.4, 30.2, 9.4, .4).l(21.8, 15, 28.4, 13.8, .4).l(11, 12.4, 2, 4.2, .4).l(10.4, 13.8, 1.8, 9.8, .4).l(10.2, 15.4, 3.6, 14.2, .4));
        a({ g: 'wing', c: wh, round: 3, m: mm => mm.e(21.4, 10.4, 3.4, 2.8).e(10.6, 10.8, 3.2, 2.6) });
        fl('wing', gd, mm => mm.l(19, 8.4, 26.6, 1.8, .55).l(13, 8.8, 5.4, 2.2, .55));
        a({ g: 'float', c: lt(gd, .4), gloss: 1, m: mm => mm.e(15.4, 1.8, 4, 1.15).sub(t => t.e(15.4, 1.8, 2.9, .5)) });
        const robe = mm => mm.p([[11.6, 15], [20.4, 15], [23, 28.4], [9, 28.4]]);
        a({ g: 'body', c: wh, round: 4, m: robe });
        fl('body', mix(wh, '#9A90B0', .35), mm => robe(mm).and(t => t.l(14, 16, 12.4, 28, .4).l(18, 16, 19.6, 28, .4)));
        a({ g: 'body', c: gd, gloss: 1, sep: false, m: mm => robe(mm).and(t => t.r(0, 27.2, 32, 1.2)) });
        a({ g: 'body', c: gd, gloss: 1, round: 3, m: mm => mm.p([[11.8, 10.6], [20.2, 10.6], [20.6, 15.8], [11.4, 15.8]]) });
        fl('body', P.g, mm => mm.p(star(16, 13, 1.5, .6)));
        fl('body', dk(gd, .3), mm => mm.r(11.8, 14.6, 8.6, .34));
        a({ g: 'body', c: gd, gloss: 1, m: mm => mm.e(20.6, 11.4, 2.4, 1.8) });
        a({ g: 'face', c: gd, gloss: 1, round: 3, m: mm => mm.e(15.4, 7, 3.2, 3.4).p([[17.6, 5.2], [21.6, 2.6], [20.2, 6.6]]).p([[13, 5.2], [10.4, 3], [11.4, 6.6]]) });
        a({ g: 'face', c: '#1E1A2A', flat: true, m: mm => mm.r(12.6, 6.6, 4.6, 1.2).r(14.3, 6.6, 1.2, 3.4) });
        fl('face', P.g, mm => mm.r(12.8, 6.8, 4.2, .6).r(14.6, 6.8, .6, 2.8), { fr: NOTHURT });
        a({ g: 'weap', c: gd, gloss: 1, m: mm => mm.l(9.6, 26, 8.2, 3.8, .9) });
        a({ g: 'weap', c: lt(gd, .45), gloss: 1, m: mm => mm.p([[7.4, 4.2], [8, 0.4], [8.8, 4.2]]).e(8.1, 5.2, 1.6, 1.6) });
        fl('weap', P.g, mm => mm.e(8.1, 5.2, .8, .8));
        a({ g: 'weap', c: gd, gloss: 1, arm: 1, m: mm => mm.e(11.4, 11.4, 2.4, 1.8).l(11.4, 12, 9, 15.4, 1.8) });
        a({ g: 'weap', c: gd, gloss: 1, arm: 1, m: mm => mm.e(8.8, 15.8, 1.3, 1.3) });
        h.spark('float', lt(P.g, .4), [[3, 20, [0, 1]], [29, 21, [2, 3]], [26, 27, [1, 2]]]);
        return { noFace: true, head: { cx: 15.4, top: 3.8, w: 3.4 }, neck: { x: 15.4, y: 10.6, w: 4 }, chest: { cx: 16, cy: 13, rx: 3.6, ry: 2.4 }, hand: null, floaty: true, gear: [] };
      }
    },
    /* FIRE ELEMENTAL: a living blaze with coal fists, a white-hot heart and an angry face */
    fire: {
      pals: [{ o: '#E8542B', m: '#F59A2E', y: '#FFD54A', w: '#FFF6C8' }, { o: '#3E6AE8', m: '#4FA8F5', y: '#9FE8FF', w: '#F0FCFF' }, { o: '#4EA83A', m: '#8FE84A', y: '#E0FF8A', w: '#FAFFE8' }, { o: '#8A3EE8', m: '#C97AF5', y: '#F0B8FF', w: '#FFF0FF' }],
      draw(h, P, m) {
        const { a, fl } = h, coal = '#3A2A28';
        const shellA = [[16, 1.2], [18.2, 5.6], [21, 2.6], [22.4, 8.6], [25.6, 6.8], [24.8, 14.4], [26.4, 20], [23.4, 26], [19.4, 29.4], [12.6, 29.4], [8.6, 26], [5.8, 20], [7.4, 14], [6.4, 7.2], [9.8, 9.6], [10.8, 3.4], [13.4, 6.6]];
        const shellB = [[15.4, .8], [18.6, 6], [21.8, 3.6], [22.2, 9.4], [26.2, 8.2], [24.6, 15], [26, 20.4], [23.2, 26.2], [19.2, 29.4], [12.8, 29.4], [8.8, 26.2], [6, 20.2], [7.6, 14.6], [5.6, 8.2], [9.8, 10.4], [11.6, 2.8], [13.2, 7.4]];
        a({ g: 'body', c: P.o, flat: true, fr: [0, 2, 4], m: mm => mm.p(shellA) });
        a({ g: 'body', c: P.o, flat: true, fr: [1, 3, 5], m: mm => mm.p(shellB) });
        fl('body', P.m, mm => mm.p([[16, 5.6], [18.6, 9.6], [20.6, 8], [21, 13.6], [22.8, 19.6], [19.8, 26], [12.2, 26], [9.2, 19.6], [10.8, 13.6], [10.4, 9], [13, 11]]), { fr: [0, 2, 4] });
        fl('body', P.m, mm => mm.p([[15.4, 6.4], [18, 9.2], [21, 8.8], [20.8, 14.4], [22.6, 20], [19.6, 26.4], [12.4, 26.4], [9.4, 19.8], [11.2, 14.2], [11, 8.8], [13.4, 11.2]]), { fr: [1, 3, 5] });
        fl('body', P.y, mm => mm.p([[16, 10.6], [17.6, 13.6], [19.6, 16.4], [19.6, 21.6], [16, 24.4], [12.4, 21.6], [12.4, 16.4], [14.4, 13.6]]));
        fl('body', P.w, mm => mm.e(16, 20.4, 2.2, 2.8));
        fl('body', dk(P.o, .5), mm => mm.l(11.6, 12.6, 14.6, 14, .7).l(20.4, 12.6, 17.4, 14, .7));
        a({ g: 'weap', c: coal, round: 2, m: mm => mm.e(5.4, 17.4, 2.6, 2.4) });
        a({ g: 'body', c: coal, round: 2, m: mm => mm.e(27, 15.6, 2.2, 2.2) });
        fl('weap', P.m, mm => mm.l(4.4, 18.6, 6, 16.6, .34).l(5.6, 18.2, 6.6, 18.8, .34));
        fl('body', P.m, mm => mm.l(26.2, 16.6, 27.6, 15, .34));
        h.dot('float', P.y, [[3, 9, [0, 2]], [28, 6, [1, 3]], [29, 24, [0, 1]], [4, 26, [2, 3]], [24, 2, [3, 0]]]);
        return { eyes: [[13.4, 15.6], [18.6, 15.6]], er: 1.15, glow: dk(P.o, .62), brows: false, mouth: { x: 16, y: 19.4, w: 2.4 }, threeOK: false, head: { cx: 16, top: 4, w: 6 }, hand: null, floaty: true, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* CYCLOPS: a bald one-eyed giant with tusks, a topknot, leather bracers and a spiked club */
    cyclops: {
      pals: [{ s: '#D0A27A', h: '#5A3A2A' }, { s: '#9AAF7A', h: '#3A4A2A' }, { s: '#8EA2C2', h: '#2E2A4A' }, { s: '#C28A7A', h: '#4A2A2A' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, sk = P.s, sd = dk(sk, .22);
        a({ g: 'feet', c: sd, m: mm => mm.l(12.6, 22, 11.4, 28.6, 3.6).l(19.6, 22, 20.6, 28.6, 3.6) });
        a({ g: 'feet', c: LEATHER, m: mm => mm.p([[8, 30.4], [8.6, 28.4], [13.6, 28.4], [14, 30.4]]).p([[18.4, 30.4], [18.6, 28.4], [23.6, 28.4], [24.4, 30.4]]) });
        fl('feet', dk(LEATHER, .35), mm => mm.l(10.6, 26.4, 12.6, 27.6, .34).l(19.6, 26.4, 21.4, 27.6, .34));
        a({ g: 'body', c: sd, round: 3, m: mm => mm.e(22.6, 13.4, 2.8, 2.6).l(23, 14.4, 25.4, 20, 3.2).e(25.8, 21, 2.4, 2.4) });
        a({ g: 'body', c: LEATHER, sep: false, m: mm => mm.l(24.2, 16.8, 25, 18.8, 3) });
        const tor = mm => mm.e(10.4, 13.6, 3.4, 2.8).e(21.4, 13.4, 3.2, 2.8).e(16, 17.6, 7.4, 6.6);
        a({ g: 'body', c: sk, round: 7, m: tor });
        fl('body', sd, mm => mm.l(11, 15.2, 15.2, 16.6, .45).l(16.8, 16.6, 21, 15.2, .45).r(15.8, 17.8, .45, 4.4).r(13.4, 19, 1.8, .34).r(17, 19, 1.8, .34).r(13.4, 20.6, 1.8, .34).r(17, 20.6, 1.8, .34));
        a({ g: 'body', c: '#7A5A3A', tex: 'fur', m: mm => mm.p([[9.4, 21.4], [22.6, 21.4], [23.6, 26.6], [19, 25.6], [16, 27.6], [13, 25.6], [8.8, 26.6]]) });
        a({ g: 'body', c: dk(LEATHER, .2), sep: false, m: mm => mm.r(9.4, 21, 13.4, 1.4) });
        a({ g: 'body', c: BONE, m: mm => mm.e(16, 21.6, 1.3, 1.2) });
        fl('body', INK, mm => mm.r(15.4, 21.4, .45, .45).r(16.2, 21.4, .45, .45));
        a({ g: 'face', c: P.h, round: 2, m: mm => mm.e(15.4, 2, 1.6, 1.4).l(15.4, 3, 15.2, 4, 1) });
        a({ g: 'face', c: sk, m: mm => mm.e(18.8, 7.8, 1.1, 1.5) });
        a({ g: 'face', c: sk, round: 4, m: mm => mm.e(14.6, 7.2, 4.6, 4.4).e(14, 10.2, 3.8, 2.4) });
        a({ g: 'face', c: sd, sep: false, m: mm => mm.p([[10.4, 5.4], [18.6, 5], [18.2, 6.2], [10.6, 6.6]]) });
        a({ g: 'face', c: BONE, m: mm => { tri(mm, 11.8, 11.8, .45, 1.6); tri(mm, 16, 11.8, .45, 1.6); } });
        a({ g: 'weap', c: sk, arm: 1, round: 3, m: mm => mm.l(9.8, 13.6, 6.8, 19, 3.4) });
        a({ g: 'weap', c: LEATHER, arm: 1, sep: false, m: mm => mm.l(8.2, 16.2, 7.4, 17.8, 3.2) });
        return { eyes: [[14.2, 7.8]], eyeStyle: 'fixed', er: 2, iris: '#4A8AD8', browC: dk(sk, .55), brows: false, lidC: sk, mouth: { x: 14, y: 11, w: 2.8 }, head: { cx: 14.6, top: 2.8, w: 4.6 }, neck: { x: 13.6, y: 12, w: 5 }, chest: { cx: 16, cy: 17, rx: 5, ry: 3.4 }, hand: { x: 6.2, y: 19.6 }, weapons: [0, 5, 3], handC: sk, gear: ['hat', 'amulet', 'paint', 'scar'], hats: ['crown', 'helm'] };
      }
    },
    /* DIRE WOLF: a huge shaggy wolf with raised hackles, a snarling muzzle and a bushy tail */
    wolf: {
      pals: [{ f: '#7E7A8A', l: '#CFCAD4', d: '#3E3A4A', e: '#F2C14E' }, { f: '#8E6A4A', l: '#D9B88E', d: '#4A3424', e: '#F2C14E' }, { f: '#C8CCD8', l: '#FFFFFF', d: '#7A7E96', e: '#5FC4F2' }, { f: '#3E3A4A', l: '#7A748A', d: '#1E1A26', e: '#F2503B' }],
      draw(h, P, m, F2) {
        const { a, fl, tri } = h, fu = P.f, fd = dk(fu, .28);
        a({ g: 'tail', c: fu, tex: 'fur', round: 3, m: mm => mm.p([[24, 15.4], [27.6, 11.6], [30.6, 10.6], [31.4, 13], [29.6, 16.6], [26.6, 19.4], [24.6, 19.6]]) });
        fl('tail', P.l, mm => mm.e(30.4, 11.4, 1.2, .9));
        a({ g: 'feet', c: fd, m: mm => mm.l(11.8, 20.6, 11, 29.4, 1.8).l(22.6, 21.6, 23.2, 29.4, 1.8) });
        a({ g: 'feet', c: dk(fd, .1), m: mm => mm.e(10.6, 29.8, 1.5, .85).e(23.2, 29.8, 1.5, .85) });
        const tor = mm => mm.e(18.6, 18.4, 7.8, 4.6);
        a({ g: 'body', c: fu, tex: 'fur', round: 4, m: tor });
        a({ g: 'body', c: P.l, sep: false, m: mm => mm.e(18.2, 21.4, 6.2, 1.6) });
        a({ g: 'body', c: P.d, m: mm => { for (let i = 0; i < 6; i++) tri(mm, 12.6 + i * 2.3, 14.4 - Math.max(0, 1.4 - i * .45), 1.1, 2); } });
        a({ g: 'feet', c: fu, tex: 'fur', m: mm => mm.e(24.2, 20, 3.2, 3.8).l(25, 23, 25.8, 26.4, 1.9).l(25.8, 26.4, 24.6, 29.4, 1.6) });
        a({ g: 'feet', c: fu, m: mm => mm.l(13.6, 19.6, 13.2, 26, 2.2).l(13.2, 26, 12.8, 29.4, 1.8) });
        a({ g: 'feet', c: dk(fu, .12), m: mm => mm.e(12.2, 29.8, 1.7, 1).e(24, 29.8, 1.7, 1) });
        h.dot('feet', BONE, [[10.6, 30], [11.4, 30.2], [22.4, 30], [23.2, 30.2]]);
        a({ g: 'body', c: mix(fu, P.l, .55), tex: 'fur', round: 3, m: mm => mm.p([[9.6, 12.4], [12.6, 11.4], [14.6, 13.6], [15.6, 17.4], [14.8, 19.6], [13.8, 19], [13.2, 21], [12, 19.8], [11, 21.4], [10.4, 19], [9.2, 18.4], [9.8, 16.4], [8.8, 14.8]]) });
        if (F2.has('scarf') || F2.has('bowtie') || F2.has('ring')) { a({ g: 'body', c: dk(LEATHER, .1), m: mm => mm.l(10, 14.6, 14.4, 13.4, 1.2) }); a({ g: 'body', c: STEEL, gloss: 1, m: mm => { tri(mm, 10.8, 14.6, .4, -1.2); tri(mm, 12.4, 14.2, .4, -1.2); tri(mm, 13.8, 13.8, .4, -1.2); } }); }
        a({ g: 'face', c: P.d, m: mm => mm.p([[8, 8.2], [9, 3.6], [10.8, 8]]).p([[10.2, 8.4], [11.8, 4.4], [12.8, 8.8]]) });
        fl('face', mix(P.d, '#E86F7E', .4), mm => mm.p([[8.8, 7.6], [9.2, 5.2], [10, 7.6]]));
        a({ g: 'face', c: fu, tex: 'fur', round: 3, m: mm => mm.e(9.2, 10.8, 3.8, 3.4) });
        a({ g: 'face', c: P.l, round: 2, m: mm => mm.p([[10.4, 11.6], [13.4, 10.6], [12.8, 14.6], [10, 15]]) });
        a({ g: 'face', c: fu, round: 2, m: mm => mm.p([[6.6, 9.4], [2.6, 10.4], [1.2, 11.6], [1.4, 12.8], [6.6, 13.4]]) });
        a({ g: 'jaw', c: P.l, m: mm => mm.p([[2, 13.2], [6.8, 13.2], [7.6, 14.6], [3.6, 14.8]]) });
        fl('face', MOUTH, mm => mm.l(1.8, 13.2, 7.2, 13.2, .4));
        fl('face', TEETH, mm => { tri(mm, 2.8, 13.2, .35, -1); tri(mm, 5, 13.2, .35, -.8); });
        a({ g: 'face', c: INK, gloss: 1, m: mm => mm.e(1.6, 11.6, .8, .7) });
        fl('face', dk(fu, .3), mm => mm.l(3, 10.6, 6, 10, .34));
        return { profile: true, eyes: [[7.2, 9.8]], er: .95, iris: P.e, browC: P.d, lidC: fu, noMouth: true, head: { cx: 9.4, top: 7.6, w: 3.6 }, hand: null, gear: ['patch', 'scar'] };
      }
    },
    /* OWLBEAR: a bear's body with an owl's feathered face, hooked beak, ear tufts and raised claws */
    owlbear: {
      pals: [{ f: '#8A6440', d: '#E8D4AE', e: '#F2C14E', fe: '#C9A87A' }, { f: '#6A6A7A', d: '#E0E0EA', e: '#F2A03D', fe: '#A8A8B8' }, { f: '#A0703A', d: '#F2E0B8', e: '#8FF2B8', fe: '#D8B07A' }, { f: '#5A4A3A', d: '#C9B89A', e: '#F2503B', fe: '#8A7A64' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, fu = P.f, fd = dk(fu, .28);
        a({ g: 'feet', c: fu, tex: 'fur', m: mm => mm.l(12.6, 22, 11.6, 28.6, 3.6).l(19.4, 22, 20.4, 28.6, 3.6) });
        a({ g: 'feet', c: fd, m: mm => mm.e(11, 29.4, 2.6, 1.3).e(21, 29.4, 2.6, 1.3) });
        h.dot('feet', BONE, [[8.4, 29.4], [9.4, 29.8], [18.4, 29.4], [19.4, 29.8]]);
        a({ g: 'body', c: fu, tex: 'fur', m: mm => mm.l(21.6, 14, 25.4, 9.4, 3.2).e(26, 8.2, 2.2, 2.2) });
        a({ g: 'body', c: BONE, m: mm => { tri(mm, 25, 6.4, .5, 1.6); tri(mm, 26.4, 6.2, .5, 1.8); tri(mm, 27.8, 6.6, .5, 1.6); } });
        const tor = mm => mm.e(16, 18.6, 7.4, 7);
        a({ g: 'body', c: fu, tex: 'fur', round: 6, m: tor });
        a({ g: 'body', c: P.fe, sep: false, tex: 'feather', m: mm => mm.e(15, 19.6, 4.4, 5) });
        a({ g: 'face', c: fd, m: mm => mm.p([[9.6, 7], [8.6, 1.4], [12.4, 5.4]]).p([[17, 5.4], [19.8, 1.2], [19, 7]]) });
        a({ g: 'face', c: P.fe, tex: 'feather', round: 4, m: mm => mm.e(14, 9.4, 5.4, 4.8) });
        a({ g: 'face', c: P.d, sep: false, m: mm => mm.e(11.1, 9.7, 2.6, 2.6).e(16.5, 9.7, 2.6, 2.6) });
        fl('face', mix(P.d, fu, .45), mm => mm.e(11.1, 9.7, 2.6, 2.6).sub(t => t.e(11.1, 9.7, 2.25, 2.25)).e(16.5, 9.7, 2.6, 2.6).sub(t => t.e(16.5, 9.7, 2.25, 2.25)).and(t => t.r(0, 9.6, 32, 6)));
        a({ g: 'face', c: '#D9A93B', gloss: 1, m: mm => mm.p([[12.6, 10.8], [15, 10.8], [14.2, 13.8], [13.2, 13]]) });
        a({ g: 'weap', c: fu, arm: 1, tex: 'fur', m: mm => mm.l(11, 14.6, 7, 17.6, 3.2).e(6.4, 18.2, 2.2, 2.2) });
        a({ g: 'weap', c: BONE, arm: 1, m: mm => { tri(mm, 4.4, 17.4, .5, 1.6); tri(mm, 5.6, 16.6, .5, 1.8); tri(mm, 7, 16.6, .5, 1.6); } });
        return { eyes: [[11.1, 9.7], [16.5, 9.7]], er: 1.55, eyeStyle: m.e === 'sleepy' ? 'sleepy' : 'two', iris: P.e, browC: fd, lidC: P.fe, noMouth: true, head: { cx: 14, top: 4.6, w: 5.2 }, neck: { x: 14, y: 13.6, w: 7 }, chest: { cx: 15, cy: 19, rx: 4, ry: 4 }, hand: null, gear: ['hat', 'amulet'], hats: ['crown', 'helm'] };
      }
    }
  };

  /* ---------- mini-bosses: a golden elite glow and drifting embers ---------- */
  function elite(a) {
    a({ g: 'pulse', flat: true, sep: false, glow: { r: 1.6, pulse: .4, c1: 'rgba(255,214,102,.55)', c2: 'rgba(255,214,102,.24)' }, c: '#000000', m: m => m });
    [[3, 12, [0, 1]], [28.6, 9, [1, 2]], [29, 22, [2, 3]], [2.6, 24, [3, 0]]].forEach(([x, y, fr]) => a({ g: 'float', c: '#F2D27A', flat: true, sep: false, fr, m: m => m.r(x, y, .7, .7) }));
  }

  /* =================================== BOSSES =================================== */
  /* each draws a frame-filling creature; the aura and the ground shadow are added around it */
  const glowEye = (a, g, x, y, col, w = 1.8, h = .8) => {
    a({ g, c: col, flat: true, fr: NOTHURT, m: m => m.e(x, y, w / 2 + .2, h / 2 + .2) });
    a({ g, c: '#FFFFFF', flat: true, sep: false, fr: NOTHURT, m: m => m.r(x - .5, y - .2, .5, .4) });
    a({ g, c: INK, flat: true, sep: false, fr: [4], m: m => m.l(x - w / 2, y + .4, x + w / 2, y - .2, .5) });   // squint when hit
  };
  const BOSSES = [
    /* 0 ANCIENT DRAGON */
    { name: 'Ancient Dragon', aura: '#E8743B', pals: [{ s: '#C23A2E', b: '#F2C46F', w: '#7A1E2A', e: '#F2C14E' }, { s: '#2E8A5A', b: '#E8D88A', w: '#1E5A3E', e: '#F28A3D' }, { s: '#4A4660', b: '#C8B8D8', w: '#241E36', e: '#E0573B' }, { s: '#D89A2E', b: '#FFF0B8', w: '#8A4E1E', e: '#7FE7F2' }], draw(a, c, m, h, P) {
      const s = P.s, sd = dk(s, .3), mem = P.w, bel = P.b;
      a({ g: 'wing', c: mem, round: 2, m: q => q.p([[16, 12], [13, 4], [9, .6], [6.4, 2], [8.2, 5], [7.6, 8.6], [11, 9], [12.4, 13]]).p([[17, 12], [21, 3.4], [26.4, .4], [31.6, 2.4], [30, 8], [31.6, 13.4], [27, 12.6], [27, 17], [22.6, 15]]) });
      seam(a, 'wing', dk(mem, .45), q => q.l(17, 12, 26.4, .6, .8).l(26.4, .6, 30, 8, .5).l(26.4, .6, 27, 12.6, .5).l(26.4, .6, 23, 14.6, .5).l(16, 12, 9, .8, .7).l(9, .8, 8, 8, .5));
      ember(a, 'wing', BONE, [[26, .2], [8.8, .2]]);
      a({ g: 'tail', c: s, tex: 'scale', m: q => q.l(21, 25.6, 26.6, 28, 3).l(26.6, 28, 30.4, 25, 2.2).l(30.4, 25, 30.8, 20.6, 1.5) });
      a({ g: 'tail', c: mem, m: q => q.p([[29.4, 21.2], [30.8, 17], [31.8, 21.2], [30.8, 20.4]]) });
      a({ g: 'feet', c: s, tex: 'scale', m: q => q.e(22, 23.4, 3.4, 3.6).l(22.4, 25, 23.6, 29.6, 2.4).p([[20.4, 31], [21, 29.4], [25, 29.4], [25.6, 31]]) });
      ember(a, 'feet', BONE, [[20.2, 30.4], [25.4, 30.4]]);
      a({ g: 'body', c: s, tex: 'scale', round: 5, m: q => q.e(18.6, 20, 7.4, 6.2).l(14, 17, 10.6, 11.6, 4.6).l(10.6, 11.6, 8.4, 8.6, 3.6) });
      const belly = q => q.p([[12, 17.4], [15.6, 15.4], [17.6, 26], [13, 25.8], [10.8, 21.6]]).l(12.6, 15.4, 9.4, 10.6, 1.6);
      a({ g: 'body', c: bel, sep: false, m: belly });
      seam(a, 'body', dk(bel, .3), q => { for (let y = 11.4; y < 26; y += 1.5) q.r(8, y, 10, .34); q.and(t => belly(t)); });
      a({ g: 'body', c: mem, m: q => { [[12.6, 9.6], [15.2, 12.6], [18.2, 13.8], [21.6, 14.2], [25, 16]].forEach(([x, y]) => tri(q, x, y, 1, 2.2)); } });
      /* a big horned head; the jaw drops on the attack frame with a gout of fire */
      a({ g: 'face', c: BONE, m: q => q.l(9.4, 6.6, 13.6, 2.6, 1.4).l(13.6, 2.6, 16.2, 2, .9).l(10.6, 8, 15, 5.6, 1.1).l(15, 5.6, 17, 5.8, .7) });
      a({ g: 'face', c: s, tex: 'scale', round: 3, m: q => q.p([[.8, 9.2], [3.6, 7], [7.6, 5.6], [10.6, 6.2], [12, 8.6], [11.4, 11.4], [7, 11.8], [1, 11.6]]) });
      a({ g: 'face', c: mem, m: q => { tri(q, 6.4, 6.4, .7, 1.4); tri(q, 8.6, 6, .7, 1.6); } });
      a({ g: 'face', c: bel, fr: IDLE.concat(4), m: q => q.p([[1.4, 11.4], [8.4, 11.2], [10.6, 12.8], [5.4, 13.8], [2, 13]]) });
      a({ g: 'face', c: bel, fr: [5], m: q => q.p([[1.6, 12.8], [8.4, 11.6], [10.6, 13.2], [4.4, 16], [1.2, 15.4]]) });
      seam(a, 'face', MOUTH, q => q.l(1.4, 11.5, 8.4, 11.3, .45));
      a({ g: 'face', c: MOUTH, flat: true, sep: false, fr: [5], m: q => q.p([[1.4, 11.6], [8.4, 11.4], [4.4, 15], [1.4, 14.6]]) });
      a({ g: 'face', c: TEETH, flat: true, sep: false, m: q => { tri(q, 2.4, 11.4, .4, -1.2); tri(q, 4.2, 11.4, .4, -1.2); tri(q, 6, 11.3, .4, -1); } });
      a({ g: 'face', c: INK, flat: true, sep: false, m: q => q.r(1.6, 9.4, .55, .55) });
      seam(a, 'face', sd, q => q.l(4.6, 7.2, 8.6, 6.8, .55));
      h.face({ eyes: [[6.8, 8.6]], er: 1.1, eyeStyle: 'fixed', profile: true, iris: P.e, browC: dk(s, .55), lidC: s });
      a({ g: 'float', c: '#B8B4C8', flat: true, sep: false, fr: [0, 1], m: q => q.e(.8, 7.4, .9, .6) });
      a({ g: 'float', c: '#B8B4C8', flat: true, sep: false, fr: [2, 3], m: q => q.e(1.4, 6.2, .8, .5) });
      a({ g: 'face', c: '#E8743B', flat: true, sep: false, fr: [5], m: q => q.p([[1.6, 12.6], [-1, 8.6], [-1, 19], [1.2, 15.4]]) });
      a({ g: 'face', c: '#F7C948', flat: true, sep: false, fr: [5], m: q => q.p([[1.6, 13.2], [-1, 11.4], [-1, 16.4], [1.2, 14.6]]) });
      a({ g: 'weap', c: s, tex: 'scale', m: q => q.l(14.6, 20, 12, 24.6, 3).l(12, 24.6, 12.4, 29, 2.2).p([[9.4, 31], [10, 29.2], [13.6, 29.2], [14.2, 31]]) });
      ember(a, 'weap', BONE, [[9.2, 30.4], [10.8, 30.6]]);
      ember(a, 'float', '#F7C948', [[3, 22, [0, 1]], [29, 29, [1, 2]], [5, 2, [2, 3]], [16, 29, [3, 0]]]);
    } },
    /* 1 LICH KING */
    { name: 'Lich King', aura: '#7FF2B8', floaty: true, draw(a, c) {
      const robe = mix(c.p, '#2E2448', .62), rd = dk(robe, .35), bn = '#DCD6C0', gl = '#7FF2B8', gd = '#B8973A';
      a({ g: 'cape', c: rd, m: m => m.p([[7.4, 5.6], [11, 11], [21, 11], [24.6, 5.6], [22.6, 14], [9.4, 14]]) });
      a({ g: 'cape', c: '#5A3A8A', flat: true, sep: false, m: m => m.p([[9, 7.2], [11.6, 10.6], [20.4, 10.6], [23, 7.2], [21.6, 12.6], [10.4, 12.6]]) });
      const gown = m => m.p([[9, 13], [23, 13], [26.6, 29], [24, 27.4], [22, 30.6], [19.6, 28], [17, 31], [14.4, 28], [12, 30.6], [9.6, 27.6], [5.6, 29.4]]);
      a({ g: 'body', c: robe, tex: 'cloth', m: gown });
      a({ g: 'body', c: rd, sep: false, m: m => m.p([[13.6, 15], [18.4, 15], [20, 28.6], [16, 29.6], [12, 28.6]]) });
      seam(a, 'body', gd, m => m.l(13.6, 15, 12, 28.6, .5).l(18.4, 15, 20, 28.6, .5));
      seam(a, 'body', '#14101E', m => gown(m).and(t => t.l(10, 18, 8, 28, .4).l(22, 18, 24, 28, .4)));
      a({ g: 'body', c: gd, sep: false, m: m => m.r(11, 19.2, 10, 1.3) });
      a({ g: 'body', c: gl, flat: true, sep: false, fr: [0, 1, 4, 5], m: m => m.e(16, 19.8, 1.3, 1.3) });
      a({ g: 'body', c: lt(gl, .5), flat: true, sep: false, fr: [2, 3], m: m => m.e(16, 19.8, 1.5, 1.5) });
      a({ g: 'body', c: robe, m: m => m.e(10.4, 13, 3, 2.2).e(21.6, 13, 3, 2.2) });
      a({ g: 'body', c: bn, m: m => { tri(m, 9.4, 11.4, .7, 2.2); tri(m, 11.2, 11.2, .6, 1.8); tri(m, 22.6, 11.4, .7, 2.2); tri(m, 20.8, 11.2, .6, 1.8); } });
      a({ g: 'body', c: bn, m: m => m.e(16, 8, 3.4, 3.4).r(14, 9.8, 4, 2) });
      a({ g: 'body', c: '#14101E', flat: true, sep: false, m: m => m.e(14.6, 8, 1.1, 1.1).e(17.4, 8, 1.1, 1.1).p([[15.6, 9.4], [16.4, 9.4], [16, 10.2]]) });
      seam(a, 'body', '#14101E', m => m.r(14.2, 11, 3.6, .34).r(14.8, 10.4, .34, 1).r(15.8, 10.4, .34, 1).r(16.8, 10.4, .34, 1));
      a({ g: 'body', c: gl, flat: true, sep: false, fr: NOTHURT, m: m => m.e(14.6, 8, .5, .5).e(17.4, 8, .5, .5) });
      a({ g: 'body', c: gd, m: m => m.p([[12.4, 5.6], [12.4, 2], [13.8, 4], [15, .8], [16, 3.6], [17, .8], [18.2, 4], [19.6, 2], [19.6, 5.6]]), dots: [[13, 4]] });
      a({ g: 'body', c: gl, flat: true, sep: false, m: m => m.e(16, 4.6, .6, .6) });
      /* skull staff */
      a({ g: 'weap', c: '#3A2A22', m: m => m.l(6.2, 29.6, 6.8, 6.6, 1.2) });
      a({ g: 'weap', c: bn, m: m => m.l(6.8, 7.6, 4.4, 4.4, .7).l(6.8, 7.6, 9.2, 4.4, .7).l(4.4, 4.4, 5.2, 2, .6).l(9.2, 4.4, 8.4, 2, .6) });
      a({ g: 'weap', c: gl, flat: true, fr: [0, 2, 4], m: m => m.e(6.8, 4.6, 1.9, 1.9) });
      a({ g: 'weap', c: lt(gl, .4), flat: true, fr: [1, 3, 5], m: m => m.e(6.8, 4.6, 2.2, 2.2) });
      a({ g: 'weap', c: robe, m: m => m.l(10.4, 14, 7.6, 16, 2.4) });
      a({ g: 'weap', c: bn, m: m => m.e(7, 16.2, 1.3, 1.3) });
      a({ g: 'body', c: robe, m: m => m.l(21.6, 14, 25.6, 17.4, 2.4) });
      a({ g: 'body', c: bn, m: m => m.e(26.4, 18, 1.2, 1.2) });
      a({ g: 'float', c: gl, flat: true, fr: [0, 2, 4], m: m => m.p([[25.4, 16.6], [26.6, 12.6], [27.6, 16.6]]) });
      a({ g: 'float', c: gl, flat: true, fr: [1, 3, 5], m: m => m.p([[25.6, 16.6], [26, 13.4], [27.8, 16.6]]) });
      spark(a, 'float', lt(gl, .3), [[2, 14, [0, 1]], [29, 4, [1, 2]], [30, 25, [2, 3]], [2.6, 27, [3, 0]]]);
    } },
    /* 2 STONE TITAN */
    { name: 'Stone Titan', aura: '#F28A3D', pals: [{ s: '#8E8C9C', g: '#F28A3D', m: '#5E8A44' }, { s: '#9C8670', g: '#5FD4E8', m: '#6E8A3E' }, { s: '#6E8296', g: '#E87AF2', m: '#4E7A5A' }, { s: '#7A6A5E', g: '#8FF2B8', m: '#5E8A44' }], draw(a, c, m, h, P) {
      const st = P.s, sd = dk(st, .16), gl = P.g;
      a({ g: 'feet', c: sd, tex: 'stone', round: 3, m: q => q.e(10.6, 25.6, 3.8, 3.8).e(21.4, 25.6, 3.8, 3.8) });
      a({ g: 'feet', c: dk(st, .28), m: q => q.p([[6, 30.8], [6.8, 28.6], [14.6, 28.6], [15.4, 30.8]]).p([[16.6, 30.8], [17.4, 28.6], [25.2, 28.6], [26, 30.8]]) });
      a({ g: 'back', c: sd, tex: 'stone', round: 3, m: q => q.e(26.4, 11.4, 4.2, 3.8).e(28, 17.4, 3.2, 3.4).e(28, 23.4, 3.8, 3.4) });
      seam(a, 'back', gl, q => q.l(27, 15.6, 28.6, 19.4, .45));
      const tor = q => q.e(16, 14.6, 10.6, 8.4).e(16, 20.4, 7.4, 3.8);
      a({ g: 'body', c: st, tex: 'stone', round: 7, m: tor });
      seam(a, 'body', dk(st, .45), q => q.l(8.6, 10.6, 10.6, 14, .5).l(22.6, 17, 24.6, 20.4, .5).l(7.4, 17.4, 9.6, 19.6, .5));
      seam(a, 'body', gl, q => q.l(11, 12, 14, 15.6, .55).l(14, 15.6, 12.4, 20.4, .55).l(20.6, 11, 21.6, 15, .55).l(21.6, 15, 18.4, 15.6, .55));
      a({ g: 'body', c: '#2A1E1A', m: q => q.e(16, 15.6, 2.9, 2.9) });
      a({ g: 'body', c: gl, flat: true, sep: false, fr: [0, 1, 4, 5], m: q => q.e(16, 15.6, 2, 2) });
      a({ g: 'body', c: lt(gl, .6), flat: true, sep: false, fr: [2, 3], m: q => q.e(16, 15.6, 2.3, 2.3) });
      seam(a, 'body', P.m, q => tor(q).and(t => t.r(0, 0, 32, 8.6)).e(6.4, 9.4, 2, 1.4).e(25.6, 9, 2, 1.4));
      seam(a, 'body', dk(P.m, .25), q => q.l(8, 8.6, 8, 11.6, .5).l(23.4, 8.4, 23.4, 12, .5).l(19.4, 8, 19.4, 9.6, .4));
      a({ g: 'body', c: WOOD, m: q => q.r(23.6, 3.6, .8, 4.6).r(7.6, 4.8, .7, 3.8) });
      a({ g: 'body', c: '#5E8A44', round: 2, m: q => q.e(24, 3.2, 2, 1.8).e(8, 4.4, 1.7, 1.5) });
      a({ g: 'body', c: lt(gl, .3), gloss: 1, m: q => q.p([[19.6, 8], [20.6, 4.6], [21.6, 8]]).p([[4.6, 8.6], [5.4, 6.2], [6.4, 8.6]]) });
      a({ g: 'face', c: st, tex: 'stone', round: 3, m: q => q.e(13.6, 6.4, 4.6, 4).p([[9.6, 7.6], [17.6, 7.6], [17, 10.8], [10.4, 10.8]]) });
      a({ g: 'face', c: dk(st, .2), sep: false, m: q => q.p([[9, 4.8], [18.4, 4.4], [18, 6.2], [9.2, 6.4]]) });
      h.face({ eyes: [[11.6, 7.2], [15.8, 7.2]], er: 1.05, eyeStyle: 'fixed', glow: gl, brows: false });
      seam(a, 'face', gl, q => q.l(10.8, 9.6, 16.6, 9.4, .5));
      a({ g: 'weap', c: st, tex: 'stone', round: 3, m: q => q.e(6.4, 11.4, 4.2, 3.8).e(4.8, 17.6, 3.2, 3.6).e(4.6, 24, 4, 3.6) });
      seam(a, 'weap', dk(st, .45), q => q.l(1.6, 23.2, 7.6, 22.6, .45).l(1.8, 25.2, 7.8, 24.8, .45));
      seam(a, 'weap', gl, q => q.l(4.2, 15.6, 5.4, 19.4, .45).r(3.4, 17.4, 2.4, .45));
      ember(a, 'float', '#9AA0A8', [[1.6, 30, [5]], [9, 31, [5]]]);
      ember(a, 'float', gl, [[2, 4, [0, 2]], [30, 3, [1, 3]], [30.6, 28, [0, 1]]]);
    } },
    /* 3 FIEND LORD */
    { name: 'Fiend Lord', aura: '#E0573B', draw(a, c) {
      const sk = mix('#9A2A26', c.p, .2), sd = dk(sk, .3), mem = '#4A1A22', hn = '#2A1E22', fl = '#F28A2E', fy = '#F7C948';
      a({ g: 'wing', c: mem, m: m => m.p([[18, 11], [24, 2], [31.6, .6], [30, 6], [31.6, 10], [28, 9.6], [29, 15], [25, 13], [24, 18], [20, 15]]).p([[14, 11], [9.6, 3], [3, 1], [3.6, 5.6], [1, 9], [4.6, 9], [3.4, 14], [7.6, 12.4], [9, 17], [12, 15]]) });
      seam(a, 'wing', dk(mem, .45), m => m.l(18, 11, 31, 1, .7).l(24.6, 6, 28.6, 10, .4).l(24.6, 6, 25, 13, .4).l(14, 11, 3.4, 1.4, .7).l(7.6, 5.6, 4.4, 9, .4).l(7.6, 5.6, 7.4, 12.4, .4));
      a({ g: 'tail', c: sk, m: m => m.l(21, 25, 27, 28, 1.6).l(27, 28, 30.4, 24, 1.3) });
      a({ g: 'tail', c: hn, m: m => m.p([[29, 24.4], [30.6, 20.4], [32, 24.4], [30.6, 23.6]]) });
      a({ g: 'feet', c: sk, m: m => m.l(13, 21, 11, 25, 3.4).l(11, 25, 12.6, 29, 2.2).l(19, 21, 21, 25, 3.4).l(21, 25, 19.8, 29, 2.2) });
      a({ g: 'feet', c: hn, m: m => m.r(10.8, 28.6, 3.4, 2.2).r(18.2, 28.6, 3.4, 2.2) });
      a({ g: 'feet', c: fl, flat: true, sep: false, fr: [0, 2, 4], m: m => { tri(m, 8, 31.4, 1.2, 3); tri(m, 16, 31.4, 1.4, 3.6); tri(m, 24, 31.4, 1.2, 2.6); } });
      a({ g: 'feet', c: fl, flat: true, sep: false, fr: [1, 3, 5], m: m => { tri(m, 9, 31.4, 1.2, 2.4); tri(m, 15, 31.4, 1.4, 3); tri(m, 23.4, 31.4, 1.2, 3.4); } });
      a({ g: 'body', c: sk, m: m => m.l(21.6, 12.6, 25, 17, 2.8).e(25.4, 17.6, 1.7, 1.7) });
      const tor = m => m.p([[10, 11], [22, 11], [23, 17], [20.6, 23], [11.4, 23], [9, 17]]);
      a({ g: 'body', c: sk, m: tor, dots: [[11, 12], [12, 12]] });
      seam(a, 'body', sd, m => m.l(12, 14.6, 15.4, 15.6, .5).l(16.6, 15.6, 20, 14.6, .5).r(15.8, 16.4, .5, 5).r(13.4, 17.6, 1.8, .34).r(17, 17.6, 1.8, .34).r(13.4, 19.4, 1.8, .34).r(17, 19.4, 1.8, .34));
      a({ g: 'body', c: IRON, tex: 'mail', sep: false, m: m => m.l(10.4, 12, 21, 20.6, .9) });
      a({ g: 'body', c: '#3A3540', m: m => m.p([[11, 21.4], [21, 21.4], [22, 25.6], [16, 27], [10, 25.6]]) });
      a({ g: 'body', c: GOLD, sep: false, m: m => m.r(10.6, 21.2, 10.8, 1) });
      a({ g: 'body', c: BONE, m: m => m.e(16, 22.4, 1.4, 1.3) });
      a({ g: 'body', c: sk, m: m => m.e(15.6, 7.6, 3.4, 3.4).p([[13, 9], [18.2, 9], [17.4, 11.6], [13.8, 11.6]]) });
      a({ g: 'back', c: hn, m: m => m.l(13.6, 5.4, 10, 3, 1.6).l(10, 3, 9.2, .4, 1.1).l(17.8, 5.4, 21.4, 3, 1.6).l(21.4, 3, 22.4, .4, 1.1) });
      a({ g: 'back', c: BONE, m: m => m.e(9.2, .6, .6, .6).e(22.4, .6, .6, .6) });
      seam(a, 'body', INK, m => m.l(13, 6.2, 15.2, 6.8, .5).l(18.2, 6.2, 16, 6.8, .5).r(14, 10, 3.4, .5));
      a({ g: 'body', c: BONE, flat: true, sep: false, m: m => { tri(m, 14.4, 10, .4, -1); tri(m, 16.8, 10, .4, -1); } });
      glowEye(a, 'body', 14.2, 7.4, fy, 1.5, .7); glowEye(a, 'body', 17, 7.4, fy, 1.5, .7);
      /* the flaming sword */
      a({ g: 'weap', c: sk, m: m => m.l(10.4, 12.6, 6.6, 17, 2.8) });
      a({ g: 'weap', c: '#3A2A2A', m: m => m.p([[5, 16.4], [3.4, 3], [4.4, .6], [6.6, 2.8], [7.2, 16]]) });
      seam(a, 'weap', fl, m => m.l(3.6, 3.4, 5.2, 16, .4));
      a({ g: 'weap', c: fl, flat: true, sep: false, fr: [0, 2, 4], m: m => { tri(m, 3, 6, .7, 2.4); tri(m, 3.2, 10, .7, 2); tri(m, 7.6, 8, .7, 2.4); tri(m, 7.6, 13, .7, 2); } });
      a({ g: 'weap', c: fy, flat: true, sep: false, fr: [1, 3, 5], m: m => { tri(m, 3, 8, .7, 2.4); tri(m, 3.4, 12.4, .7, 2); tri(m, 7.6, 5.6, .7, 2.4); tri(m, 7.6, 10.6, .7, 2); } });
      a({ g: 'weap', c: GOLD, m: m => m.r(3, 15.6, 6, 1.1) });
      a({ g: 'weap', c: sk, m: m => m.e(6.2, 17.6, 1.6, 1.6) });
      ember(a, 'float', fy, [[2, 26, [0, 1]], [30, 28, [1, 2]], [12, 1, [2, 3]], [27, 20, [3, 0]]]);
    } },
    /* 4 ARCHON (celestial) */
    { name: 'Archon', aura: '#FFE9A0', floaty: true, pals: [{ a: '#E3C25A', r: '#F2EDE0', g: '#7FD8FF' }, { a: '#C9D1DE', r: '#EEF2FA', g: '#FFD27A' }, { a: '#E8B0A0', r: '#FFF4F0', g: '#FFFFFF' }, { a: '#A8D8B8', r: '#F0FFF4', g: '#FFE08F' }], draw(a, c, m, h, P) {
      const gd = P.a, wh = P.r, fe = mix(wh, '#FFE6B0', .18), lg = '#FFF3C4';
      const W = [[[18, 9], [21, 4], [25.6, 1], [31.6, .6], [30, 3.4], [31.6, 5.6], [28, 7.8], [22, 10.4]], [[18.6, 11.4], [24, 8.4], [31.6, 8.6], [30.2, 11], [31.6, 13.4], [26, 14], [20, 14.4]], [[18.6, 14.6], [24.6, 15], [30.4, 18.4], [28.6, 20], [29.6, 21.6], [24.6, 21], [19.6, 17.8]]];
      W.forEach(w => a({ g: 'wing', c: fe, tex: 'feather', round: 2, m: q => q.p(w).p(w.map(([x, y]) => [32 - x, y])) }));
      seam(a, 'wing', mix(fe, '#7A7090', .45), q => q.l(21, 8.4, 30, 2, .4).l(21.6, 11.6, 30.6, 10, .4).l(21.6, 15.6, 28.6, 19.4, .4).l(11, 8.4, 2, 2, .4).l(10.4, 11.6, 1.4, 10, .4).l(10.4, 15.6, 3.4, 19.4, .4));
      seam(a, 'wing', gd, q => q.l(21, 4, 31.6, .6, .5).l(11, 4, .4, .6, .5));
      a({ g: 'cape', c: gd, flat: true, m: q => q.e(16, 5, 5, 5).sub(t => t.e(16, 5, 3.9, 3.9)) });
      seam(a, 'cape', lg, q => { for (let i = 0; i < 12; i++) { const t = i * Math.PI / 6; q.l(16 + Math.cos(t) * 5.2, 5 + Math.sin(t) * 5.2, 16 + Math.cos(t) * 6.6, 5 + Math.sin(t) * 6.6, .5); } });
      const skirt = q => q.p([[11, 17], [21, 17], [23.4, 28], [20, 30], [16, 28.6], [12, 30], [8.6, 28]]);
      a({ g: 'body', c: wh, round: 4, m: skirt });
      a({ g: 'body', c: gd, gloss: 1, sep: false, m: q => skirt(q).and(t => t.r(0, 27, 32, 4)).sub(t => t.p([[8, 28.6], [12, 28.6], [16, 27.4], [20, 28.6], [24, 28.6], [24, 32], [8, 32]])) });
      seam(a, 'body', mix(wh, '#9A90B0', .35), q => skirt(q).and(t => t.l(13.4, 18, 11.6, 27, .4).l(18.6, 18, 20.4, 27, .4)));
      a({ g: 'body', c: gd, gloss: 1, round: 3, m: q => q.p([[11.6, 10.6], [20.4, 10.6], [21, 17.4], [11, 17.4]]) });
      seam(a, 'body', lg, q => q.p(star(16, 13.6, 2, .8)));
      seam(a, 'body', dk(gd, .3), q => q.r(11.2, 16, 9.6, .34));
      a({ g: 'body', c: gd, gloss: 1, m: q => q.e(20.6, 11, 2.6, 1.9) });
      a({ g: 'body', c: gd, gloss: 1, round: 3, m: q => q.e(16, 7, 3, 3.2).p([[18.4, 5.2], [22.6, 2.4], [21, 6.8]]).p([[13.6, 5.2], [9.4, 2.4], [11, 6.8]]) });
      a({ g: 'body', c: '#1E1A2A', flat: true, m: q => q.r(13.6, 6.6, 4.8, 1.2).r(15.4, 6.6, 1.2, 3.4) });
      a({ g: 'body', c: P.g, flat: true, sep: false, fr: NOTHURT, m: q => q.r(13.8, 6.8, 4.4, .6).r(15.7, 6.8, .6, 2.8) });
      a({ g: 'weap', c: gd, gloss: 1, m: q => q.e(11.4, 11, 2.6, 1.9).l(11.4, 11.6, 8, 15.6, 2.2) });
      a({ g: 'weap', c: lg, gloss: 1, m: q => q.p([[6.8, 15], [6.4, 2.6], [7.6, .6], [8.8, 2.6], [8.4, 15]]) });
      seam(a, 'weap', '#FFFFFF', q => q.l(7.6, 2.4, 7.6, 14, .5));
      a({ g: 'weap', c: gd, gloss: 1, m: q => q.r(5, 14.6, 5.2, 1.1).p([[5, 14.6], [3.4, 13], [5.6, 14]]).p([[10.2, 14.6], [11.8, 13], [9.6, 14]]) });
      a({ g: 'weap', c: gd, gloss: 1, m: q => q.e(7.6, 16.2, 1.4, 1.4) });
      a({ g: 'body', c: gd, gloss: 1, m: q => q.l(20.6, 11.6, 23.6, 15, 2.2) });
      a({ g: 'body', c: P.g, gloss: 1, m: q => q.e(24.4, 16, 1.6, 1.6) });
      spark(a, 'float', lg, [[3, 24, [0, 1]], [29, 25, [1, 2]], [2, 29, [2, 3]], [30, 30, [3, 0]]]);
    } },
    /* 5 ELEMENTAL LORD */
    { name: 'Elemental Lord', aura: '#7FB8FF', floaty: true, draw(a, c) {
      const cl = mix(c.p, '#4A5468', .6), cd = dk(cl, .3), cL = lt(cl, .25), bolt = '#BFF4FF', yb = '#F7E37A';
      a({ g: 'body', c: cd, m: m => m.p([[10, 20], [22, 20], [19.6, 25], [17.6, 30.6], [14.6, 30.6], [12.4, 25]]) });
      seam(a, 'body', cL, m => m.p([[10, 20], [22, 20], [19.6, 25], [17.6, 30.6], [14.6, 30.6], [12.4, 25]]).and(t => t.l(11, 21, 21, 22.4, .5).l(12.6, 24.4, 19.6, 25.4, .5).l(14, 27.6, 18, 28.4, .5)));
      const tor = m => m.e(16, 15, 7.6, 6).e(9.6, 12, 4, 3.6).e(22.4, 12, 4, 3.6);
      a({ g: 'body', c: cl, m: tor, dots: [[9, 10], [10, 9]] });
      a({ g: 'body', c: cL, sep: false, m: m => m.e(12, 11, 2.4, 1.4).e(20, 11, 2.4, 1.4).e(16, 17.4, 3, 1.4) });
      a({ g: 'body', c: '#6E6A72', tex: 'stone', m: m => m.p([[12.6, 12.6], [19.4, 12.6], [20, 17.6], [16, 19.6], [12, 17.6]]) });
      a({ g: 'body', c: bolt, flat: true, sep: false, fr: [0, 2, 4], m: m => m.l(16, 13, 15, 15.4, .5).l(15, 15.4, 17, 16.4, .5).l(17, 16.4, 16, 19, .5) });
      a({ g: 'body', c: yb, flat: true, sep: false, fr: [1, 3, 5], m: m => m.l(15.4, 13, 17, 15, .5).l(17, 15, 15, 16.6, .5).l(15, 16.6, 16.4, 19, .5) });
      a({ g: 'body', c: cl, m: m => m.e(16, 7, 3.6, 3.6) });
      glowEye(a, 'body', 14.6, 7.2, bolt, 1.5, .7); glowEye(a, 'body', 17.4, 7.2, bolt, 1.5, .7);
      a({ g: 'body', c: yb, flat: true, sep: false, fr: [0, 2, 4], m: m => m.l(12.6, 4.4, 13.4, 1.4, .6).l(13.4, 1.4, 14.4, 3, .6).l(14.4, 3, 16, .2, .6).l(16, .2, 17.6, 3, .6).l(17.6, 3, 18.6, 1.4, .6).l(18.6, 1.4, 19.4, 4.4, .6) });
      a({ g: 'body', c: bolt, flat: true, sep: false, fr: [1, 3, 5], m: m => m.l(12.6, 4.4, 13, 1, .6).l(13, 1, 14.6, 3.4, .6).l(14.6, 3.4, 16, .6, .6).l(16, .6, 17.4, 3.4, .6).l(17.4, 3.4, 19, 1, .6).l(19, 1, 19.4, 4.4, .6) });
      a({ g: 'weap', c: cl, m: m => m.l(10, 12.6, 5, 17.6, 3.4) });
      a({ g: 'weap', c: bolt, flat: true, sep: false, fr: [0, 2, 4], m: m => m.l(5, 17.6, 3, 21, .6).l(3, 21, 4.6, 22.6, .6).l(4.6, 22.6, 2, 27, .6) });
      a({ g: 'weap', c: yb, flat: true, sep: false, fr: [1, 3, 5], m: m => m.l(5, 17.6, 6.2, 21, .6).l(6.2, 21, 4, 23, .6).l(4, 23, 5.4, 27.4, .6) });
      a({ g: 'body', c: cl, m: m => m.l(22, 12.6, 27, 17.6, 3.4) });
      /* the four element orbs circle the lord (positions change frame by frame) */
      const orbs = [['#F08A2E', '#F7C948'], ['#4FA8E8', '#BFE6FF'], ['#7A6A52', '#B8A888'], ['#BFE8E0', '#FFFFFF']];
      orbs.forEach(([o, h], i) => [0, 1, 2, 3].forEach(f => {
        const t = (i / 4 + f / 16) * Math.PI * 2, x = 16 + Math.cos(t) * 13.6, y = 17 + Math.sin(t) * 4.6, fr = f === 0 ? [0, 4, 5] : [f];
        a({ g: 'pulse', c: o, fr, m: m => m.e(x, y, 1.6, 1.6), fine: [[x - .6, y - .6, h]] });
      }));
    } },
    /* 6 FEY QUEEN */
    { name: 'Fey Queen', aura: '#E8B0FF', floaty: true, pals: [{ w: '#8A6AE0', g: '#3E7A5A', e: '#B85AE8' }, { w: '#E07AB0', g: '#5A3E8A', e: '#E85AA8' }, { w: '#4FA8D8', g: '#2E5A6E', e: '#2E8AD8' }, { w: '#E8A03E', g: '#7A3E2E', e: '#D8781E' }], draw(a, c, m, h, P) {
      const wc = P.w, wd = dk(wc, .35), gw = P.g, sk = '#F6DCC8', hair = lt(wc, .5), ant = '#D9C9A0';
      const up = [[17, 12], [23, 2], [29.6, 1], [31.4, 6], [28, 12], [21, 14]], lo = [[17, 14], [26, 15], [29, 21], [25, 24], [20, 19]];
      a({ g: 'wing', c: wc, round: 3, m: q => q.p(up).p(lo).p(up.map(([x, y]) => [32 - x, y])).p(lo.map(([x, y]) => [32 - x, y])) });
      seam(a, 'wing', lt(wc, .35), q => q.p([[18.6, 11.6], [23.6, 4], [28.4, 3.4], [29.4, 6.4], [26.4, 10.8], [21, 12.6]]).p([[13.4, 11.6], [8.4, 4], [3.6, 3.4], [2.6, 6.4], [5.6, 10.8], [11, 12.6]]).p([[18.6, 15], [24.6, 16], [26.6, 20.4], [24.4, 21.6], [20.6, 18]]).p([[13.4, 15], [7.4, 16], [5.4, 20.4], [7.6, 21.6], [11.4, 18]]));
      seam(a, 'wing', '#FFFFFF', q => q.e(26.6, 6.4, 2, 1.8).e(5.4, 6.4, 2, 1.8));
      seam(a, 'wing', wd, q => q.e(26.6, 6.4, 1.2, 1.1).e(5.4, 6.4, 1.2, 1.1).e(24.6, 19.4, 1, 1).e(7.4, 19.4, 1, 1));
      seam(a, 'wing', '#F2D27A', q => q.e(26.6, 6.4, .55, .55).e(5.4, 6.4, .55, .55));
      seam(a, 'wing', wd, q => q.l(18, 12.6, 29, 2, .4).l(18, 12.6, 30.6, 8, .4).l(18, 14.6, 27.6, 21, .4).l(14, 12.6, 3, 2, .4).l(14, 12.6, 1.4, 8, .4).l(14, 14.6, 4.4, 21, .4));
      a({ g: 'body', c: hair, round: 3, m: q => q.e(16.6, 8.2, 3.9, 4.2).p([[18.6, 9], [21.6, 17.6], [18.6, 15.4]]) });
      const gown = q => q.p([[12.4, 14], [19.6, 14], [23, 29], [20, 30.6], [16, 29.4], [12, 30.6], [9, 29]]);
      a({ g: 'body', c: gw, round: 5, m: gown });
      a({ g: 'body', c: lt(gw, .3), sep: false, m: q => gown(q).and(t => t.e(9.6, 29.6, 1.8, 1.4).e(13, 30, 1.8, 1.4).e(16.4, 29.6, 1.8, 1.4).e(19.8, 30, 1.8, 1.4).e(22.6, 29.4, 1.6, 1.4)) });
      seam(a, 'body', dk(gw, .3), q => gown(q).and(t => t.l(14.4, 15, 12, 28, .4).l(17.6, 15, 20, 28, .4)));
      a({ g: 'body', c: dk(gw, .12), round: 3, m: q => q.p([[13, 11.6], [19, 11.6], [19.6, 15.4], [12.4, 15.4]]) });
      a({ g: 'body', c: GOLD, gloss: 1, sep: false, m: q => q.r(12.4, 14.6, 7.2, .8) });
      a({ g: 'face', c: sk, round: 3, m: q => q.e(15.4, 8.8, 2.9, 3.1).r(14.6, 11, 1.8, 1.2) });
      a({ g: 'face', c: hair, round: 2, m: q => q.p([[12.6, 7.4], [13.4, 5.4], [16.4, 4.8], [18.6, 6], [18.6, 9.4], [17.6, 7], [14.4, 6.6]]) });
      a({ g: 'back', c: ant, m: q => q.l(14.6, 6, 12.6, 2.6, .7).l(12.6, 2.6, 11, 1.6, .5).l(13.4, 4.2, 11.6, 4.6, .5).l(17.6, 6, 19.6, 2.6, .7).l(19.6, 2.6, 21.2, 1.4, .5).l(19, 4.2, 21, 4.6, .5) });
      seam(a, 'back', '#F28AB0', q => q.e(12.6, 2.6, .7, .7).e(19.6, 2.6, .7, .7).e(16.4, 5, .6, .6));
      h.face({ eyes: [[14.2, 9], [16.8, 9]], er: .9, eyeStyle: 'fixed', iris: P.e, browC: '#6A5A7A', lidC: sk });
      seam(a, 'face', '#B8475E', q => q.l(14.8, 10.6, 16, 10.4, .34));
      a({ g: 'weap', c: dk(gw, .15), m: q => q.l(13, 12.4, 9.6, 15.6, 1.6) });
      a({ g: 'weap', c: sk, m: q => q.e(9.2, 16, 1, 1) });
      a({ g: 'weap', c: STEEL, gloss: 1, m: q => q.l(9.2, 16.6, 7.6, 8.6, .6) });
      a({ g: 'weap', c: '#F2D27A', gloss: 1, fr: [0, 2, 4], m: q => q.p(star(7.4, 7, 2, .8)) });
      a({ g: 'weap', c: '#FFF3C4', gloss: 1, fr: [1, 3, 5], m: q => q.p(star(7.4, 7, 2.4, 1)) });
      spark(a, 'float', lt(wc, .5), [[3, 25, [0, 1]], [29, 27, [1, 2]], [27, 13, [2, 3]], [4, 13, [3, 0]], [11, 1, [0, 2]]]);
    } },
    /* 7 CHIMERA (the Beast King) */
    { name: 'Chimera', aura: '#F2A03D', pals: [{ f: '#D8A040', m: '#8A3E1E' }, { f: '#E0D0B0', m: '#9A6A4A' }, { f: '#9A6A4A', m: '#2E1E1A' }, { f: '#C9A86A', m: '#5A2E5A' }], draw(a, c, m, h, P) {
      const fu = P.f, fd = dk(fu, .3), mn = P.m, gt = '#9A8E80', sn = '#4E8A4A', mem = '#6A3A3A';
      a({ g: 'wing', c: mem, round: 2, m: q => q.p([[19, 15], [21, 4], [26, 1], [31, 3], [29, 7.6], [31, 11.6], [27, 11], [26.6, 16]]) });
      seam(a, 'wing', dk(mem, .45), q => q.l(20, 14, 26, 1.4, .6).l(26, 1.4, 29, 7.6, .4).l(26, 1.4, 27, 11, .4));
      a({ g: 'tail', c: sn, tex: 'scale', m: q => q.l(26, 20, 29.6, 17, 1.8).l(29.6, 17, 30, 12, 1.6).e(29.8, 10.4, 1.8, 1.4) });
      a({ g: 'tail', c: '#E0573B', flat: true, sep: false, m: q => q.r(28.8, 10, .6, .6) });
      a({ g: 'tail', c: '#E0573B', flat: true, sep: false, fr: [1, 3], m: q => q.l(29.8, 9.2, 31.4, 8.4, .34) });
      a({ g: 'feet', c: fd, m: q => q.l(11.6, 22, 11, 30, 2.2).l(23, 22, 24, 30, 2.2) });
      a({ g: 'body', c: fu, tex: 'fur', round: 5, m: q => q.e(18.4, 19.4, 8.2, 5.2) });
      a({ g: 'body', c: lt(fu, .25), sep: false, m: q => q.e(17, 22.6, 6, 1.6) });
      a({ g: 'back', c: gt, tex: 'fur', m: q => q.l(21, 16, 22.6, 11, 2.6).e(22.4, 9.6, 2.2, 2) });
      a({ g: 'back', c: BONE, m: q => q.l(23.2, 8.4, 25.6, 6.4, .9).l(25.6, 6.4, 26.4, 8.6, .7).l(21.6, 8.2, 20.6, 5.6, .8) });
      glowEye(a, 'back', 21.4, 9.6, '#F2C14E', 1, .5);
      a({ g: 'feet', c: fu, m: q => q.l(13, 21, 12, 29.6, 3).e(11.6, 29.8, 2, 1.2).e(24, 21, 3, 3.4).l(24.4, 23, 25.6, 29.6, 2.6).e(25.8, 29.8, 2, 1.2) });
      ember(a, 'feet', BONE, [[10, 30], [11, 30.4], [24.4, 30], [25.4, 30.4]]);
      /* a spiky mane round the lion's head */
      const mane = [], N2 = 22; for (let i = 0; i < N2; i++) { const t = i / N2 * Math.PI * 2, r = i % 2 ? 6 : 8.2; mane.push([8.6 + Math.cos(t) * r * .95, 10.8 + Math.sin(t) * r]); }
      a({ g: 'face', c: mn, tex: 'fur', round: 3, m: q => q.p(mane) });
      a({ g: 'face', c: lt(mn, .2), tex: 'fur', sep: false, m: q => q.e(9.4, 10.6, 5.6, 6) });
      a({ g: 'face', c: fu, round: 3, m: q => q.e(7.8, 11, 4, 3.8) });
      a({ g: 'face', c: lt(fu, .35), sep: false, m: q => q.e(5.6, 13.2, 2.8, 2) });
      a({ g: 'face', c: INK, flat: true, sep: false, m: q => q.p([[3.6, 11.6], [5.6, 11.6], [4.6, 12.8]]) });
      seam(a, 'face', dk(fu, .45), q => q.l(4.6, 12.8, 4.6, 13.6, .34));
      h.face({ eyes: [[6.4, 9.8], [9.6, 9.8]], er: .95, eyeStyle: 'fixed', iris: '#F2C14E', browC: dk(mn, .4), lidC: fu, mouth: { x: 5, y: 14.4, w: 2 } }, 'fang');
      a({ g: 'face', c: GOLD, gloss: 1, m: q => q.p([[5, 4.6], [5, 1.6], [6.4, 3], [7.6, .8], [8.8, 3], [10.2, 1.6], [10.2, 4.6]]) });
      seam(a, 'face', '#C23A4A', q => q.e(7.6, 3.6, .5, .5));
      ember(a, 'float', '#F7C948', [[2, 24, [0, 1]], [30, 28, [1, 2]], [15, 1, [2, 3]]]);
    } },
    /* 8 CLOCKWORK COLOSSUS */
    { name: 'Clockwork Colossus', aura: '#7FE7F2', draw(a, c) {
      const br = mix('#B8893A', c.p, .15), bd = dk(br, .3), ir = '#3E434A', cu = '#9A5A32', gl = '#7FE7F2';
      a({ g: 'back', c: ir, m: m => m.r(21.4, 1.6, 2.2, 7).r(24.6, 3, 2, 6) });
      a({ g: 'back', c: cu, sep: false, m: m => m.r(21.2, 1.4, 2.6, .8).r(24.4, 2.8, 2.4, .8).r(21.2, 5, 2.6, .6) });
      a({ g: 'float', c: '#DCE1E6', flat: true, fr: [0, 1], m: m => m.e(22.6, .6, 1.6, .9).e(26, 1.8, 1, .7) });
      a({ g: 'float', c: '#DCE1E6', flat: true, fr: [2, 3], m: m => m.e(23.4, .4, 1.2, .6).e(25.4, 1.2, 1.6, .9) });
      a({ g: 'feet', c: ir, m: m => m.p([[9, 22], [14.4, 22], [15, 28.6], [8.4, 28.6]]).p([[17.6, 22], [23, 22], [23.6, 28.6], [17, 28.6]]) });
      a({ g: 'feet', c: br, m: m => m.e(11.7, 24.6, 1.6, 1.6).e(20.3, 24.6, 1.6, 1.6).r(6.4, 28.4, 9.8, 2.6).r(16, 28.4, 9.8, 2.6) });
      a({ g: 'back', c: ir, m: m => m.e(26.6, 11.6, 3, 2.8).l(26.6, 13, 28.6, 19, 2.6) });
      a({ g: 'back', c: STEEL, m: m => m.p([[27, 19], [30.6, 19.6], [31, 23], [29.4, 21], [28, 23.4]]) });
      const tor = m => m.p([[6, 8.6], [26, 8.6], [27.6, 15], [25, 22.4], [7, 22.4], [4.4, 15]]);
      a({ g: 'body', c: br, tex: 'plate', m: tor, dots: [[7, 9], [8, 9]] });
      a({ g: 'body', c: lt(br, .45), flat: true, sep: false, m: m => { for (let i = 0; i < 9; i++) m.r(7.4 + i * 2.2, 9.6, .5, .5).r(8.4 + i * 1.9, 21.2, .5, .5); } });
      a({ g: 'body', c: '#1E2228', m: m => m.e(16, 15, 4, 4) });
      const teeth = rot => m => { for (let i = 0; i < 8; i++) { const t = rot + i * Math.PI / 4; m.e(16 + Math.cos(t) * 3.2, 15 + Math.sin(t) * 3.2, .6, .6); } };
      a({ g: 'body', c: cu, sep: false, fr: [0, 2, 4], m: m => { m.e(16, 15, 3.4, 3.4).sub(t => t.e(16, 15, 2.6, 2.6)); teeth(0)(m); } });
      a({ g: 'body', c: cu, sep: false, fr: [1, 3, 5], m: m => { m.e(16, 15, 3.4, 3.4).sub(t => t.e(16, 15, 2.6, 2.6)); teeth(Math.PI / 8)(m); } });
      a({ g: 'body', c: gl, flat: true, sep: false, fr: [0, 1, 4, 5], m: m => m.e(16, 15, 1.8, 1.8) });
      a({ g: 'body', c: '#E8FFFF', flat: true, sep: false, fr: [2, 3], m: m => m.e(16, 15, 2.1, 2.1) });
      a({ g: 'body', c: ir, m: m => m.p([[12, 3], [20, 3], [21, 8.8], [11, 8.8]]), dots: [[12, 4]] });
      a({ g: 'body', c: '#14181E', sep: false, m: m => m.r(11.6, 5, 9, 2) });
      [12.2, 13.6, 15, 13.6].forEach((x, f) => a({ g: 'body', c: gl, flat: true, sep: false, fr: f === 0 ? [0, 4, 5] : [f], m: m => m.r(x, 5.4, 2.4, 1.2) }));
      a({ g: 'weap', c: br, m: m => m.e(6, 11, 3.2, 3.2) });
      a({ g: 'weap', c: ir, m: m => m.l(5, 13, 3.6, 19.6, 3.2) });
      a({ g: 'weap', c: STEEL, fr: [0, 2, 4], m: m => m.p([[.8, 20], [6.4, 20], [3.6, 29]]) });
      a({ g: 'weap', c: STEEL, fr: [1, 3, 5], m: m => m.p([[.8, 20], [6.4, 20], [3.6, 29]]) });
      seam(a, 'weap', dk(STEEL, .4), m => m.p([[.8, 20], [6.4, 20], [3.6, 29]]).and(t => t.l(0, 21, 7, 23, .5).l(0, 24, 7, 26, .5)), );
      a({ g: 'weap', c: dk(STEEL, .4), flat: true, sep: false, fr: [1, 3, 5], m: m => m.p([[.8, 20], [6.4, 20], [3.6, 29]]).and(t => t.l(0, 22.6, 7, 21.2, .5).l(0, 25.6, 7, 24.2, .5)) });
      ember(a, 'float', '#F7C948', [[2, 30, [0, 2]], [6, 30.4, [1, 3]]]);
    } },
    /* 9 HYDRA */
    { name: 'Hydra', aura: '#5FD48A', pals: [{ s: '#3E8A5A', b: '#D8C98A', w: '#2A4A6A', e: '#F2E14E' }, { s: '#4A6AA8', b: '#C9D8E8', w: '#2A2E5A', e: '#F2C14E' }, { s: '#9A3E3E', b: '#F2C48A', w: '#4A1E2E', e: '#FFE08F' }, { s: '#6A4A8A', b: '#E8C9E8', w: '#2E1E4A', e: '#8FF2B8' }], draw(a, c, m, h, P) {
      const bd = P.s, dd = dk(bd, .3), bel = P.b, sp = P.w;
      a({ g: 'tail', c: bd, tex: 'scale', m: q => q.l(25, 25, 30.6, 28, 2.6).l(30.6, 28, 31.4, 24, 1.4) });
      a({ g: 'feet', c: dd, m: q => q.l(12, 26, 11, 30.4, 2.8).l(23, 26, 24, 30.4, 2.8) });
      ember(a, 'feet', BONE, [[9.6, 30.4], [10.6, 30.6], [22.8, 30.4], [23.8, 30.6]]);
      const heads = [[5, 10.6, 'h1', 1.05], [9.6, 5.4, 'h2', 1.15], [16.2, 3.6, 'h3', 1.35], [22.6, 5.8, 'h4', 1.15], [27.4, 10.8, 'h1', 1.05]];
      const bases = [[12, 20], [14.4, 19], [17, 18.6], [19.6, 19], [22.4, 20]];
      heads.forEach(([x, y, g, s2], i) => {
        const [bx, by] = bases[i], mx = (bx + x) / 2 + (i < 2 ? -1.6 : i > 2 ? 1.6 : 0), my = (by + y) / 2 + 1;
        a({ g, c: bd, tex: 'scale', m: q => q.l(bx, by, mx, my, 2.9).l(mx, my, x + 1.2, y + 1.2, 2.5) });
        a({ g, c: bel, sep: false, m: q => q.l(bx - .7, by, mx - .8, my, 1).l(mx - .8, my, x + .2, y + 1.8, .9) });
      });
      const body = q => q.e(18, 23, 9.6, 6.2);
      a({ g: 'body', c: bd, tex: 'scale', round: 6, m: body });
      a({ g: 'body', c: bel, sep: false, m: q => q.e(16, 25.8, 6.2, 2.8) });
      seam(a, 'body', dk(bel, .3), q => q.e(16, 25.8, 6.2, 2.8).and(t => t.r(0, 24.6, 32, .34).r(0, 26, 32, .34).r(0, 27.4, 32, .34)));
      a({ g: 'body', c: sp, m: q => { for (let i = 0; i < 5; i++) tri(q, 12 + i * 3.2, 17.6 + Math.abs(i - 2) * .6, 1, 2.2); } });
      heads.forEach(([x, y, g, s2], i) => {
        const S = s2;
        a({ g, c: sp, m: q => { tri(q, x + 1.4 * S, y - 1.2 * S, .6 * S, 1.6 * S); tri(q, x + 2.6 * S, y - .6 * S, .5 * S, 1.3 * S); } });
        a({ g, c: bd, tex: 'scale', round: 2, m: q => q.p([[x - 3.6 * S, y + .1 * S], [x - 1.6 * S, y - 1.6 * S], [x + 1.4 * S, y - 1.8 * S], [x + 2.6 * S, y + .2 * S], [x + 1.6 * S, y + 1.4 * S], [x - 3.4 * S, y + 1.1 * S]]) });
        a({ g, c: bel, fr: IDLE.concat(4), m: q => q.p([[x - 3.2 * S, y + 1.1 * S], [x + 1.4 * S, y + 1.3 * S], [x + .6 * S, y + 2.3 * S], [x - 2.6 * S, y + 2 * S]]) });
        a({ g, c: bel, fr: [5], m: q => q.p([[x - 2.8 * S, y + 2.8 * S], [x + 1.4 * S, y + 1.3 * S], [x + .4 * S, y + 2.6 * S], [x - 2.2 * S, y + 3.8 * S]]) });
        a({ g, c: MOUTH, flat: true, sep: false, fr: [5], m: q => q.p([[x - 3.4 * S, y + 1.1 * S], [x + 1.2 * S, y + 1.3 * S], [x - 2.6 * S, y + 3 * S]]) });
        a({ g, c: TEETH, flat: true, sep: false, m: q => { tri(q, x - 2.6 * S, y + 1.1 * S, .3 * S, -.9 * S); tri(q, x - 1 * S, y + 1.2 * S, .3 * S, -.8 * S); } });
        seam(a, g, MOUTH, q => q.l(x - 3.4 * S, y + 1.1 * S, x + 1.2 * S, y + 1.3 * S, .34));
        seam(a, g, INK, q => q.r(x - 3.1 * S, y - .2 * S, .5, .5));
        a({ g, c: P.e, flat: true, sep: false, fr: NOTHURT, m: q => q.e(x - .2 * S, y - .5 * S, .75 * S, .55 * S) });
        seam(a, g, INK, q => q.r(x - .35 * S, y - 1 * S, .4, 1 * S));
        a({ g, c: INK, flat: true, sep: false, fr: [4], m: q => q.l(x - .9 * S, y - .5 * S, x + .6 * S, y - .5 * S, .45) });
        seam(a, g, dk(bd, .5), q => q.l(x - 1.2 * S, y - 1.3 * S, x + .8 * S, y - 1 * S, .5));
      });
      a({ g: 'h3', c: BONE, m: q => q.l(17.8, 1.6, 20.4, .2, .8).l(16.6, 1.4, 16, -.4, .7) });
      ember(a, 'float', lt(bd, .5), [[2, 25, [0, 1]], [30, 17, [1, 2]], [3, 17, [2, 3]]]);
    } },
  ];

  function boss(m) {
    const p = PAL[m.c] || '#8E2A2A', c = { p, c0: mix(p, '#707784', .3) };
    const ai = Number.isInteger(m.arch) ? m.arch : [...String(m.seed || m.n)].reduce((s, ch) => s + ch.charCodeAt(0), 0) % 10, B = BOSSES[(ai % 10) + (m.form && BOSSES.length >= 20 ? 10 : 0)];
    const R = [], a = o => R.push(o);
    a({ g: 'feet', c: 'rgba(15,18,24,.36)', shadow: true, flat: true, m: mm => mm.e(16, 30.9, 13.6, 1.4) });
    /* the aura: a pulsing glow hugging the silhouette, then a wider faint halo */
    a({ g: 'pulse', flat: true, sep: false, glow: { r: 2, pulse: .5, c1: rgba(B.aura, .78), c2: rgba(B.aura, .36) }, c: '#000000', m: mm => mm });
    /* v33 epic aura: a double ground ring with turning rune dots, embers that rise behind the boss, and bright sparks at the corners */
    const ac = B.aura, acl = mix(ac, '#FFFFFF', .45);
    a({ g: 'feet', c: ac, flat: true, sep: false, fr: [0, 2], m: mm => mm.e(16, 30.6, 14.8, 2.5).sub(t => t.e(16, 30.6, 13.9, 1.9)) });
    a({ g: 'feet', c: ac, flat: true, sep: false, fr: [1, 3], m: mm => mm.e(16, 30.6, 14, 2.2).sub(t => t.e(16, 30.6, 13.1, 1.6)) });
    for (let i = 0; i < 8; i++) [0, 1, 2, 3].forEach(f => { const q = i * Math.PI / 4 + f * Math.PI / 16; a({ g: 'feet', c: acl, flat: true, sep: false, fr: [f], m: mm => mm.e(16 + Math.cos(q) * 14.4, 30.6 + Math.sin(q) * 2.2, .6, .5) }); });
    [[2.6, 27], [6, 30], [26, 30], [29.4, 26], [4, 20], [28, 18], [9, 25], [23, 27]].forEach(([x, y], i) => [0, 1, 2, 3].forEach(f => { const k = (f + i) % 4; if (k === 3) return; a({ g: 'float', c: i % 2 ? acl : ac, flat: true, sep: false, fr: [f], m: mm => mm.e(x + Math.sin((f + i) * 1.57) * .7, y - k * 3.4, .62, .62) }); }));
    const P = B.pals ? B.pals[(m.c || 0) % B.pals.length] : null, h = MON2.kit.mk(a);
    h.face = (A, mo) => MON2.kit.face(h, { faceG: 'face', ...A }, { e: 'two', m: mo || 'teeth' }, new Set());
    B.draw(a, c, m, h, P);
    [[3, 5, [0, 2]], [28.6, 3.6, [1, 3]], [29, 15, [2, 0]], [2.8, 15, [3, 1]]].forEach(([x, y, fr]) => a({ g: 'float', c: acl, flat: true, sep: false, fr, m: mm => mm.p([[x, y - 1.8], [x + .5, y - .5], [x + 1.8, y], [x + .5, y + .5], [x, y + 1.8], [x - .5, y + .5], [x - 1.8, y], [x - .5, y - .5]]) }));
    if (B.floaty) R.forEach(q => { if (q.shadow || q.g === 'pulse' || /^h\d$/.test(q.g)) return; q.g = q.g === 'weap' ? 'flyw' : q.g === 'float' ? q.g : 'fly'; });
    return R;
  }
  return { species, boss, elite, BOSSES, names: BOSSES.map(b => b.name) };
})();
