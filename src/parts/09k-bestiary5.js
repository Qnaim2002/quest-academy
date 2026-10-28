/* ================= v32: ten more species, and ten "elder" zone bosses =================
   Species (pixel art, they join BEAST.species and the sixth species mapping MALT5 in 03): Moon Jelly, Dumpling Buddy,
   Mango Sprite, Moon Moth, Rocket Bot, Chili Imp, Giant Bloom (a rafflesia), Scoop Critter (ice cream), Lion Dancer
   and Lucky Cat. About one ordinary level in six now uses one of them. Same kit and API as 09f to 09j.
   Elder bosses: every zone boss kind (0 Dragon ... 9 Hydra) now also has an ELDER form with its own colours, name,
   glow and extra pieces (ice spikes, thorn crown, crystals ...). The form is picked in 03 (monsterFor, field "form"),
   so each subject meets some elders, and with them 20 different zone bosses are drawn. Monsters face LEFT; 32 x 32. */
(() => {
  const { mix, dk, lt } = PX.kit;
  const { GOLD, STEEL, BONE, WOOD, INK, MOUTH, TEETH } = MON2.kit;
  const SP = (a, g, c, list) => list.forEach(([x, y, fr]) => a({ g, c, flat: true, sep: false, fr, m: m => m.pts([[x, y - 1], [x - 1, y], [x, y], [x + 1, y], [x, y + 1]]) }));
  const more = {
    /* MOON JELLY: a glowing dome with soft spots and four trailing tentacles, drifting along */
    jelly: {
      pals: [{ d: '#9A8AF2', l: '#E2DCFF', t: '#7A6AD8' }, { d: '#F28AB8', l: '#FFE0EE', t: '#D86A98' }, { d: '#6AD8D8', l: '#D4FAFA', t: '#4AB8B8' }, { d: '#8AF2A8', l: '#DDFFE8', t: '#5AD888' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'tail', c: P.t, m: mm => { [[9, 20], [13.4, 21], [18, 21], [22.4, 20]].forEach(([x, y], i) => { const s = i % 2 ? 1.8 : -1.8; mm.l(x, y, x + s, y + 4.6, 1.1).l(x + s, y + 4.6, x - s * .6, y + 9, .8); }); } });
        a({ g: 'back', c: lt(P.t, .25), m: mm => mm.l(16, 21, 15, 27, .7).l(15, 27, 17, 30.6, .5) });
        const dome = mm => mm.e(16, 14, 10.4, 8.8).p([[5.6, 16], [26.4, 16], [27, 20.6], [24, 19], [21, 21], [16, 19.6], [11, 21], [8, 19], [5, 20.6]]);
        a({ g: 'body', c: P.d, round: 6, gloss: 1, m: dome });
        a({ g: 'body', c: P.l, sep: false, m: mm => mm.e(11.6, 9.4, 3.2, 1.8) });
        fl('body', P.l, mm => mm.e(21, 10.6, .9, .9).e(23.4, 14, .8, .8).e(8.6, 14.6, .8, .8).e(18, 7.4, .6, .6));
        fl('body', dk(P.d, .25), mm => mm.l(6, 18.2, 26, 18.2, .35));
        h.spark('float', '#FFFFFF', [[3, 8, [0, 2]], [28.4, 6, [1, 3]], [4, 25, [2, 0]]]);
        return { eyes: [[12.2, 13.4], [19.6, 13.4]], er: 1.55, iris: '#2A1E4A', browC: dk(P.d, .5), lidC: P.d, mouth: { x: 15.9, y: 16.8, w: 2 }, head: { cx: 16, top: 5.4, w: 6 }, hand: null, floaty: true, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* DUMPLING BUDDY: a plump steamed dumpling with pleats on top, rosy cheeks and a puff of steam */
    dumpling: {
      pals: [{ d: '#F8EEDC', s: '#D8C09A', k: '#F2A0B0' }, { d: '#F2E4B0', s: '#CDB06A', k: '#F28A8A' }, { d: '#DCF2D4', s: '#9AC890', k: '#F2A0B0' }, { d: '#F8D8E0', s: '#D89AAE', k: '#F2708A' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'feet', c: dk(P.d, .25), m: mm => mm.e(11.6, 29.6, 2.4, 1).e(20.4, 29.6, 2.4, 1) });
        const body = mm => mm.e(16, 21.4, 11, 8).p([[6.4, 19], [8.6, 13.6], [12.4, 10], [16, 8.4], [19.6, 10], [23.4, 13.6], [25.6, 19]]);
        a({ g: 'body', c: P.d, round: 6, gloss: 1, m: body });
        a({ g: 'body', c: P.s, sep: false, m: mm => body(mm).and(t => t.r(0, 27, 32, 4)) });
        fl('body', P.s, mm => { for (let i = 0; i < 7; i++) mm.l(9.4 + i * 2.2, 11.4 + Math.abs(i - 3) * .9, 10 + i * 2.2, 15.4, .4); });
        a({ g: 'body', c: P.d, round: 2, m: mm => mm.p([[13.6, 9.4], [15, 6], [17, 6], [18.4, 9.4]]) });
        a({ g: 'float', c: '#FFFFFF', fr: [0, 1, 4], m: mm => mm.e(25, 6, 1.4, 1).e(26, 3.2, 1.1, .9) });
        a({ g: 'float', c: '#FFFFFF', fr: [2, 3, 5], m: mm => mm.e(25.6, 5.4, 1.2, 1).e(24.4, 2.6, 1.3, 1) });
        fl('face', P.k, mm => mm.e(8.4, 22.6, 1.7, 1).e(23.6, 22.6, 1.7, 1));
        return { eyes: [[12, 19.4], [20, 19.4]], er: 1.3, iris: '#2A1E1E', browC: dk(P.d, .6), lidC: P.d, mouth: { x: 16, y: 23, w: 2.4 }, head: { cx: 16, top: 6.4, w: 6 }, hand: null, gear: [] };
      }
    },
    /* MANGO SPRITE: a juicy mango with a blush, a leaf and a little stem, hopping along */
    mango: {
      pals: [{ b: '#F2A63B', r: '#E5484D', l: '#4E9A3E' }, { b: '#F2C84E', r: '#F28A2E', l: '#3E8A5A' }, { b: '#E8743B', r: '#B83A3A', l: '#5EAA3E' }, { b: '#F2D27A', r: '#F2A63B', l: '#3E7A5A' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'feet', c: dk(P.b, .4), m: mm => mm.e(12.6, 29.6, 2, .9).e(19.4, 29.6, 2, .9) });
        const body = mm => mm.e(16, 19.4, 8.4, 9.8).p([[10, 12], [22, 11], [24, 17], [8, 17]]);
        a({ g: 'body', c: P.b, round: 6, gloss: 1, m: body });
        fl('body', P.r, mm => body(mm).and(t => t.p([[19, 8], [30, 8], [30, 31], [21, 31], [24, 20]])));
        a({ g: 'body', c: lt(P.b, .4), sep: false, m: mm => mm.e(11.8, 16.4, 1.6, 3.6) });
        a({ g: 'top', c: WOOD, m: mm => mm.l(16, 10.8, 16.6, 7.4, .8) });
        a({ g: 'top', c: P.l, gloss: 1, m: mm => mm.p([[16.8, 8], [23, 4.2], [25, 7.4], [19.6, 9.6]]) });
        fl('top', dk(P.l, .3), mm => mm.l(17.2, 8, 23.4, 5.4, .35));
        return { eyes: [[12.6, 17.2], [18.8, 17.2]], er: 1.3, iris: '#2A1E1E', browC: dk(P.b, .55), lidC: P.b, mouth: { x: 15.8, y: 21.4, w: 2.4 }, head: { cx: 16, top: 7, w: 5 }, hand: null, gear: [] };
      }
    },
    /* MOON MOTH: fluffy and silver, with big eye-spotted wings and feathery antennae */
    moth: {
      pals: [{ w: '#C8D2F2', x: '#9AA8E0', b: '#E8E4F4', e: '#F2C14E' }, { w: '#F2D2C8', x: '#E0A89A', b: '#F6EAE4', e: '#7FD8F2' }, { w: '#CFF2D8', x: '#9AD8AC', b: '#EAF6EC', e: '#E85AA8' }, { w: '#E8D2F8', x: '#C09AE0', b: '#F4EAFA', e: '#F28A3D' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'wing', c: P.w, round: 2, m: mm => mm.p([[14, 12], [9, 4], [3, 5], [1, 13], [4.4, 20], [12.4, 19]]).p([[18, 12], [23, 4], [29, 5], [31, 13], [27.6, 20], [19.6, 19]]) });
        a({ g: 'wing', c: P.x, sep: false, m: mm => mm.p([[12.6, 17], [6, 18], [3.6, 25], [10, 26.6]]).p([[19.4, 17], [26, 18], [28.4, 25], [22, 26.6]]) });
        fl('wing', P.e, mm => mm.e(6.4, 11.4, 2.4, 2.4).e(25.6, 11.4, 2.4, 2.4));
        fl('wing', INK, mm => mm.e(6.4, 11.4, 1.1, 1.1).e(25.6, 11.4, 1.1, 1.1));
        fl('wing', P.b, mm => mm.l(10, 7, 13, 12, .4).l(22, 7, 19, 12, .4).l(6, 19, 11, 22.4, .4).l(26, 19, 21, 22.4, .4));
        a({ g: 'feet', c: dk(P.b, .45), m: mm => mm.l(14.4, 26, 13.4, 29.8, .6).l(17.6, 26, 18.6, 29.8, .6) });
        a({ g: 'body', c: P.b, tex: 'feather', round: 5, m: mm => mm.e(16, 20, 4.4, 7) });
        a({ g: 'body', c: lt(P.b, .4), sep: false, m: mm => mm.e(15.4, 16.6, 2.4, 2.6) });
        a({ g: 'face', c: dk(P.b, .4), m: mm => mm.l(14.2, 9.6, 10.6, 3.6, .5).l(17.8, 9.6, 21.4, 3.6, .5) });
        a({ g: 'face', c: P.b, tex: 'feather', round: 3, m: mm => mm.e(16, 12.2, 4.6, 3.8) });
        fl('face', lt(P.w, .5), mm => mm.e(10.2, 3.8, .8, .8).e(21.8, 3.8, .8, .8));
        h.spark('float', '#FFFFFF', [[2, 28, [0, 2]], [29.6, 28, [1, 3]]]);
        return { eyes: [[14, 12], [18.4, 12]], er: 1.15, iris: '#2A1E3A', browC: dk(P.b, .5), lidC: P.b, noMouth: true, head: { cx: 16, top: 8.4, w: 4 }, hand: null, floaty: true, gear: [] };
      }
    },
    /* ROCKET BOT: a cheerful toy rocket with a round window face, stubby fins and a flickering flame */
    rocket: {
      pals: [{ b: '#F4F6FA', n: '#E5484D', f: '#3E7BE0', s: '#E5484D' }, { b: '#F8E8C8', n: '#3E7BE0', f: '#E5484D', s: '#3E7BE0' }, { b: '#DDE8DA', n: '#F2A63B', f: '#4E9A5A', s: '#F2A63B' }, { b: '#E8DDF4', n: '#9A6AC9', f: '#F28AB0', s: '#9A6AC9' }],
      draw(h, P, m) {
        const { a, fl, tri } = h;
        a({ g: 'tail', c: '#F28A2E', m: mm => mm.p([[12, 25], [16, 31.6], [20, 25]]) });
        a({ g: 'tail', c: '#FFE066', sep: false, fr: [0, 1, 4], m: mm => mm.p([[13.6, 25], [16, 29.6], [18.4, 25]]) });
        a({ g: 'tail', c: '#FFF4B0', sep: false, fr: [2, 3, 5], m: mm => mm.p([[14, 25], [16, 28], [18, 25]]) });
        a({ g: 'feet', c: P.f, m: mm => mm.p([[10.4, 17], [4.6, 26], [10.6, 24.6]]).p([[21.6, 17], [27.4, 26], [21.4, 24.6]]) });
        const body = mm => mm.p([[16, 2.4], [20.6, 7.4], [22, 25.4], [10, 25.4], [11.4, 7.4]]);
        a({ g: 'body', c: P.b, round: 5, gloss: 1, m: body });
        a({ g: 'body', c: P.n, m: mm => mm.p([[16, 1.4], [20.4, 6.6], [11.6, 6.6]]) });
        fl('body', P.s, mm => body(mm).and(t => t.r(0, 21, 32, 1.8)));
        a({ g: 'face', c: dk(P.b, .3), m: mm => mm.e(16, 13.8, 6, 6) });
        a({ g: 'face', c: '#8FE0F8', gloss: 1, m: mm => mm.e(16, 13.8, 4.8, 4.8) });
        return { eyes: [[14.2, 13.6], [18, 13.6]], er: .95, iris: '#1E2A3A', browC: dk(P.b, .55), lidC: '#8FE0F8', mouth: { x: 16.1, y: 16.2, w: 1.5 }, head: { cx: 16, top: 7, w: 4 }, hand: null, floaty: true, gear: [] };
      }
    },
    /* CHILI IMP: a hot red chili with a green cap, angry brows, little feet and sparks of heat */
    chili: {
      pals: [{ r: '#E5484D', g: '#4E9A3E' }, { r: '#F28A2E', g: '#5EAA3E' }, { r: '#B83A6E', g: '#3E8A5A' }, { r: '#F2C84E', g: '#4E9A3E' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'feet', c: dk(P.r, .4), m: mm => mm.e(11.6, 29.6, 2.2, .9).e(18.4, 29.6, 2.2, .9) });
        a({ g: 'tail', c: P.r, round: 3, m: mm => mm.p([[22, 21], [27, 22], [29.6, 27], [30.6, 31], [26.6, 29.6], [22, 26]]) });
        const body = mm => mm.e(13.4, 18, 8.4, 10.4).p([[16, 10], [22, 16], [25, 24], [22, 28], [13, 28]]);
        a({ g: 'body', c: P.r, round: 6, gloss: 1, m: body });
        a({ g: 'body', c: lt(P.r, .4), sep: false, m: mm => mm.e(8.6, 14.4, 1.4, 3.6) });
        fl('body', dk(P.r, .3), mm => mm.l(14, 26.6, 22, 24, .4).l(17, 12, 21.6, 17, .4));
        a({ g: 'top', c: P.g, m: mm => mm.p([[6.6, 11], [8, 7.6], [13, 6.4], [18, 8.4], [19, 12], [13, 11]]) });
        a({ g: 'top', c: dk(P.g, .25), m: mm => mm.l(12, 7.4, 11, 3, 1).l(11, 3, 13.6, 1.4, .6) });
        h.spark('float', '#FFD166', [[27, 8, [0, 2]], [3, 22, [1, 3]], [28, 16, [2, 0]]]);
        return { eyes: [[9.8, 15.4], [14.8, 15]], er: 1.2, iris: '#2A1010', brows: true, browC: '#2A1010', browTilt: 1, lidC: P.r, mouth: { x: 11.6, y: 19.4, w: 2.6 }, head: { cx: 12.4, top: 6.4, w: 5 }, hand: null, gear: [] };
      }
    },
    /* GIANT BLOOM: a huge spotted flower (like the rafflesia of Malaysia) with a grumpy face in the middle */
    rafflesia: {
      pals: [{ p: '#C9453A', s: '#F2C8A8', c: '#7A3A2E' }, { p: '#E86F9A', s: '#FFE0EA', c: '#8A3E5E' }, { p: '#F28A3D', s: '#FFE4B0', c: '#8A5A2E' }, { p: '#9A6AC9', s: '#EAD8F8', c: '#4A3E7A' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'feet', c: '#3E8A4E', m: mm => mm.p([[7, 27], [13.6, 22], [14.4, 28]]).p([[25, 27], [18.4, 22], [17.6, 28]]).r(14.6, 20, 2.8, 9) });
        const pet = mm => { for (let i = 0; i < 5; i++) { const t = (i * 72 - 90) * Math.PI / 180; mm.e(16 + Math.cos(t) * 8.6, 14.6 + Math.sin(t) * 7.8, 5.2, 4.8); } };
        a({ g: 'back', c: P.p, round: 4, gloss: 1, m: pet });
        fl('back', P.s, mm => { [[16, 4.6], [24.2, 10.4], [21, 20.2], [11, 20.2], [7.8, 10.4], [13, 8], [20.6, 8.4], [24, 15.4], [8.2, 15.6], [16, 21.4]].forEach(([x, y]) => mm.e(x, y, .9, .9)); });
        a({ g: 'body', c: P.c, round: 4, m: mm => mm.e(16, 14.6, 6.8, 6.2) });
        a({ g: 'face', c: dk(P.c, .3), m: mm => mm.e(16, 14.6, 5.2, 4.8) });
        return { eyes: [[13.6, 13], [18.6, 13]], er: 1.05, glow: '#F2E14E', brows: false, mouth: { x: 16, y: 17.2, w: 2.6 }, head: { cx: 16, top: 4, w: 7 }, hand: null, gear: [] };
      }
    },
    /* SCOOP CRITTER: two scoops of ice cream on a waffle cone, with a cherry on top and sprinkles */
    icecream: {
      pals: [{ a: '#F2A0C8', b: '#FFF4E0', k: '#E5484D' }, { a: '#8AD8F2', b: '#F8F0FF', k: '#E5484D' }, { a: '#A8E8B0', b: '#FFE8F0', k: '#F2A63B' }, { a: '#F2D27A', b: '#E8D2F8', k: '#E5484D' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'feet', c: '#E0A458', m: mm => mm.p([[9.6, 19.6], [22.4, 19.6], [16, 31]]) });
        fl('feet', '#B87A32', mm => { mm.l(11, 21, 19, 27, .4).l(14, 20.4, 21, 25, .4).l(21, 21, 13, 27, .4).l(18, 20.4, 11.6, 24.6, .4); });
        const s1 = mm => mm.e(16, 17, 9, 5.2).p([[7, 18], [25, 18], [24, 22], [21, 20.4], [18.6, 23], [16, 20.6], [12.6, 22.6], [10.6, 20.6], [8, 22]]);
        a({ g: 'body', c: P.a, round: 5, gloss: 1, m: s1 });
        a({ g: 'face', c: P.b, round: 5, gloss: 1, m: mm => mm.e(16, 10.4, 7, 5.4) });
        a({ g: 'top', c: P.k, gloss: 1, m: mm => mm.e(16, 4.4, 2, 2) });
        a({ g: 'top', c: '#6E4A30', m: mm => mm.l(16.6, 3, 18.6, 1, .5) });
        fl('face', '#4EA8E8', mm => mm.r(11, 8, 1.2, .5).r(18.6, 9.6, 1.2, .5));
        fl('face', '#F2C14E', mm => mm.r(14, 7, 1.2, .5).r(20, 12, 1.2, .5));
        fl('body', '#FFFFFF', mm => mm.r(9, 16.4, 1.2, .5).r(21.8, 15.4, 1.2, .5));
        return { eyes: [[12.8, 16], [19.2, 16]], er: 1.3, iris: '#3A1E2E', browC: dk(P.a, .5), lidC: P.a, mouth: { x: 16, y: 19.2, w: 2.2 }, head: { cx: 16, top: 3.4, w: 6 }, hand: null, gear: [] };
      }
    },
    /* LION DANCER: the red and gold lion of the Chinese New Year, with a big mane, huge eyes and a swishing skirt */
    liondance: {
      pals: [{ h: '#D8353A', g: '#F2C14E', s: '#3E7BE0', w: '#FFFFFF' }, { h: '#2E8A5A', g: '#F2C14E', s: '#E5484D', w: '#FFFFFF' }, { h: '#3E7BE0', g: '#F8F0FF', s: '#F2C14E', w: '#FFFFFF' }, { h: '#E86F9A', g: '#F2C14E', s: '#9A6AC9', w: '#FFFFFF' }],
      draw(h, P, m) {
        const { a, fl, tri } = h;
        a({ g: 'back', c: P.g, m: mm => { for (let i = 0; i < 14; i++) { const t = i * Math.PI * 2 / 14; tri(mm, 16 + Math.cos(t) * 10.4, 15.6 + Math.sin(t) * 9.4, 2.1, 0); mm.l(16, 15.6, 16 + Math.cos(t) * 12, 15.6 + Math.sin(t) * 11, 1.8); } } });
        a({ g: 'feet', c: P.h, m: mm => mm.e(10.6, 29.6, 2.4, 1).e(21.4, 29.6, 2.4, 1) });
        a({ g: 'body', c: P.s, tex: 'cloth', round: 3, m: mm => mm.p([[8.6, 23], [23.4, 23], [26.4, 29.4], [5.6, 29.4]]) });
        fl('body', P.g, mm => mm.r(6, 27.4, 20, .8).r(8.4, 23, 15.2, .8));
        const head = mm => mm.e(16, 16, 9, 8.2);
        a({ g: 'face', c: P.h, round: 5, gloss: 1, m: head });
        a({ g: 'top', c: P.g, m: mm => mm.p([[13.6, 8.6], [16, 2.2], [18.4, 8.6]]) });
        a({ g: 'top', c: P.w, sep: false, m: mm => mm.e(16, 4.6, .9, .9) });
        fl('face', P.g, mm => mm.e(16, 19.4, 3.2, 1.9).e(8.2, 19, 1.3, 1).e(23.8, 19, 1.3, 1));
        a({ g: 'face', c: P.w, m: mm => mm.e(12, 13.2, 3, 3).e(20, 13.2, 3, 3) });
        fl('face', INK, mm => mm.e(16, 19, .6, .5));
        return { eyes: [[12, 13.2], [20, 13.2]], er: 1.6, iris: '#1E1410', browC: P.g, lidC: P.h, mouth: { x: 16, y: 21.6, w: 3 }, head: { cx: 16, top: 7.8, w: 7 }, hand: null, gear: [] };
      }
    },
    /* LUCKY CAT: the white waving cat of good fortune, with a red bib, a gold bell and a little coin */
    luckycat: {
      pals: [{ w: '#F8F4EC', r: '#E5484D', g: '#F2C14E', e: '#F2A0B0' }, { w: '#F2E4C8', r: '#3E7BE0', g: '#F2C14E', e: '#F28A8A' }, { w: '#EEE8F4', r: '#9A6AC9', g: '#F8E066', e: '#F2A0C8' }, { w: '#2A2A33', r: '#E5484D', g: '#F2C14E', e: '#8A6A8A' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, sd = dk(P.w, .12);
        a({ g: 'feet', c: sd, m: mm => mm.e(11.4, 29.6, 2.6, 1).e(20.6, 29.6, 2.6, 1) });
        a({ g: 'body', c: P.w, round: 6, gloss: 1, m: mm => mm.e(16, 22, 8.6, 8) });
        a({ g: 'weap', c: P.w, round: 3, m: mm => mm.l(8.4, 20, 6, 12, 2.6).e(5.6, 10.4, 2.6, 2.8) });
        fl('weap', P.e, mm => mm.e(5.2, 10.8, 1.2, 1.2));
        a({ g: 'body', c: sd, sep: false, m: mm => mm.l(23.6, 20, 23.6, 26, 2.2) });
        a({ g: 'face', c: P.w, round: 5, gloss: 1, m: mm => mm.e(16, 13, 8.2, 6.6) });
        a({ g: 'face', c: P.w, m: mm => { tri(mm, 10, 8.6, 2.4, 5); tri(mm, 22, 8.6, 2.4, 5); } });
        fl('face', P.e, mm => { tri(mm, 10, 8, 1.2, 2.6); tri(mm, 22, 8, 1.2, 2.6); mm.e(8.4, 15, 1.5, 1).e(23.6, 15, 1.5, 1); });
        a({ g: 'body', c: P.r, m: mm => mm.r(9, 18.4, 14, 2.2) });
        a({ g: 'body', c: P.g, gloss: 1, m: mm => mm.e(16, 22, 2.6, 2.6) });
        fl('body', INK, mm => mm.r(15.4, 21.4, 1.2, 1.2));
        fl('face', INK, mm => mm.l(12, 17.2, 10.6, 18.6, .3).l(20, 17.2, 21.4, 18.6, .3));
        return { eyes: [[12.8, 12.6], [19.2, 12.6]], er: 1.2, iris: '#1E1A2E', browC: sd, lidC: P.w, mouth: { x: 16, y: 16, w: 1.8 }, head: { cx: 16, top: 6.4, w: 6 }, hand: null, gear: [] };
      }
    }
  };
  Object.assign(BEAST.species, more);

  /* ---------------------------------- the elder zone bosses ---------------------------------- */
  const BOSSES = BEAST.BOSSES, base = BOSSES.slice(0, 10);
  const elder = (i, o) => {
    const B0 = base[i], E = { name: o.name, aura: o.aura, floaty: B0.floaty, elder: i };
    if (B0.pals) E.pals = o.pals;
    E.draw = (a, c, m, h, P) => {
      const c2 = o.p ? { ...c, p: mix(c.p, o.p, .72), c0: mix(c.c0, o.p, .5) } : c;
      B0.draw(a, c2, m, h, P);
      if (o.extra) o.extra(a, c2, m, h, P);
    };
    return E;
  };
  const crystal = (a, g, c, x, y, w, hh) => a({ g, c, m: mm => mm.p([[x - w, y], [x - w * .4, y - hh], [x + w * .4, y - hh * .8], [x + w, y]]) });
  BOSSES.push(
    /* 10 FROST WYRM: an ice-blue dragon with an icicle crest */
    elder(0, { name: 'Frost Wyrm', aura: '#8FE0FF', pals: [{ s: '#5AA0D8', b: '#E8F6FF', w: '#2A5A9A', e: '#FFF08F' }, { s: '#7A8AD8', b: '#EEF0FF', w: '#3A3E8A', e: '#8FF2B8' }, { s: '#4AB8C8', b: '#E8FCFF', w: '#1E6A7A', e: '#F2C14E' }, { s: '#9AB8E8', b: '#FFFFFF', w: '#4A6AA8', e: '#F28AB0' }],
      extra(a) { [[12.6, 9], [15.2, 11.6], [18.2, 12.8], [21.6, 13.2], [25, 15]].forEach(([x, y]) => a({ g: 'plume', c: '#E8FAFF', m: mm => mm.p([[x - 1, y], [x, y - 3.4], [x + 1, y]]) })); SP(a, 'float', '#FFFFFF', [[4, 4, [0, 2]], [28, 6, [1, 3]], [3, 26, [2, 0]], [30, 24, [3, 1]]]); } }),
    /* 11 PLAGUE LICH: a sickly green lich with a crown of green flames */
    elder(1, { name: 'Plague Lich', aura: '#B8F27F', p: '#7AC93E',
      extra(a) { [[12, 1.4], [14.6, 0], [17.4, 0], [20, 1.4]].forEach(([x, y], i) => a({ g: 'plume', c: i % 2 ? '#D8FF9A' : '#9AF27F', m: mm => mm.p([[x - 1.1, y + 3], [x, y - 1.4], [x + 1.1, y + 3]]) })); SP(a, 'float', '#B8F27F', [[4, 14, [0, 2]], [28, 16, [1, 3]], [6, 28, [2, 0]], [26, 28, [3, 1]]]); } }),
    /* 12 CRYSTAL TITAN: crystals grow from its shoulders */
    elder(2, { name: 'Crystal Titan', aura: '#F28AF2', pals: [{ s: '#8A7CC8', g: '#7FF2F2', m: '#4E8A9A' }, { s: '#C87CB8', g: '#F2F28A', m: '#8A4E7A' }, { s: '#7CA0C8', g: '#F28AB8', m: '#4E6A8A' }, { s: '#9A9AA8', g: '#8AF2B8', m: '#5E7A6A' }],
      extra(a, c, m, h, P) { const g = (P && P.g) || '#7FF2F2'; [[7, 9, 1.8, 6], [10, 7, 1.4, 5], [25, 9, 1.8, 6], [22, 7, 1.4, 5]].forEach(([x, y, w, hh]) => crystal(a, 'plume', g, x, y, w, hh)); SP(a, 'float', g, [[3, 18, [0, 2]], [29, 18, [1, 3]]]); } }),
    /* 13 SHADOW FIEND: a dark purple fiend wearing a ring of red fire */
    elder(3, { name: 'Shadow Fiend', aura: '#C05AF2', p: '#5A3A8A',
      extra(a) { [[10, 4], [13, 2.6], [16, 2], [19, 2.6], [22, 4]].forEach(([x, y], i) => a({ g: 'plume', c: i % 2 ? '#FF7A5A' : '#FF3B6B', m: mm => mm.p([[x - 1.2, y + 3.2], [x, y - 1.6], [x + 1.2, y + 3.2]]) })); SP(a, 'float', '#FF3B6B', [[3, 12, [0, 2]], [29, 12, [1, 3]]]); } }),
    /* 14 STARLIGHT ARCHON: a night-blue archon with a double halo and stars */
    elder(4, { name: 'Starlight Archon', aura: '#9AB8FF', pals: [{ a: '#5A6AC8', r: '#DCE4FF', g: '#FFE27A' }, { a: '#7A5AC8', r: '#EADCFF', g: '#7FF2F2' }, { a: '#3E8AC8', r: '#DCF2FF', g: '#F28AD8' }, { a: '#3E5A8A', r: '#E4ECFF', g: '#FFFFFF' }],
      extra(a) { a({ g: 'plume', c: '#FFF1A6', flat: true, sep: false, m: mm => mm.e(16, 1.8, 9, 1.4).sub(t => t.e(16, 1.8, 7.6, .7)) }); SP(a, 'float', '#FFF1A6', [[3, 6, [0, 2]], [29, 8, [1, 3]], [4, 24, [2, 0]], [28, 26, [3, 1]], [16, 30, [0, 3]]]); } }),
    /* 15 MAGMA LORD: a molten lord with a flame crest */
    elder(5, { name: 'Magma Lord', aura: '#FF8A3D', p: '#D8452E',
      extra(a) { [[11, 4], [14, 2], [16, 1], [18, 2], [21, 4]].forEach(([x, y], i) => a({ g: 'plume', c: i % 2 ? '#FFD166' : '#FF8A3D', m: mm => mm.p([[x - 1.4, y + 3.4], [x, y - 2], [x + 1.4, y + 3.4]]) })); SP(a, 'float', '#FFB84D', [[3, 20, [0, 2]], [29, 22, [1, 3]], [5, 29, [2, 0]]]); } }),
    /* 16 AUTUMN QUEEN: a fey queen of orange and gold leaves */
    elder(6, { name: 'Autumn Queen', aura: '#FFB84D', pals: [{ w: '#E0883A', g: '#8A5A2E', e: '#E8452E' }, { w: '#D8B83A', g: '#7A5A2E', e: '#E8742E' }, { w: '#C8503A', g: '#6A3A2E', e: '#F2C14E' }, { w: '#B8883A', g: '#5A4A2E', e: '#F2742E' }],
      extra(a) { [[10, 2], [13, 0.6], [16, 0], [19, 0.6], [22, 2]].forEach(([x, y], i) => a({ g: 'plume', c: ['#E8452E', '#F2A63B', '#D8B83A', '#F2A63B', '#E8452E'][i], m: mm => mm.e(x, y + 1, 1.5, 2.2) })); SP(a, 'float', '#F2A63B', [[3, 10, [0, 2]], [29, 14, [1, 3]], [5, 24, [2, 0]], [27, 28, [3, 1]]]); } }),
    /* 17 CYBER CHIMERA: a metal chimera with glowing circuit lines */
    elder(7, { name: 'Cyber Chimera', aura: '#6AF2F2', pals: [{ f: '#8A9AB0', m: '#2E4A6A' }, { f: '#A0A8B8', m: '#4A2E6A' }, { f: '#7A9AA8', m: '#2E5A5A' }, { f: '#B0A8A0', m: '#5A3A2E' }],
      extra(a) { a({ g: 'plume', c: '#6AF2F2', flat: true, sep: false, m: mm => mm.l(9, 14, 14, 14, .45).l(14, 14, 14, 19, .45).l(17, 18, 23, 18, .45).l(23, 18, 23, 14, .45) }); SP(a, 'float', '#6AF2F2', [[3, 8, [0, 2]], [29, 10, [1, 3]], [4, 28, [2, 0]]]); } }),
    /* 18 GOLDEN COLOSSUS: a gleaming gold colossus with a gem crown */
    elder(8, { name: 'Golden Colossus', aura: '#FFD84D', p: '#E0A82E',
      extra(a) { a({ g: 'plume', c: '#FFE066', m: mm => mm.p([[12.6, 3.6], [13, .6], [14.8, 2.6], [16, -.4], [17.2, 2.6], [19, .6], [19.4, 3.6]]) }); a({ g: 'plume', c: '#E5484D', flat: true, sep: false, m: mm => mm.e(16, 2.6, .8, .8) }); SP(a, 'float', '#FFE066', [[3, 14, [0, 2]], [29, 16, [1, 3]], [5, 29, [2, 0]], [27, 29, [3, 1]]]); } }),
    /* 19 STORM HYDRA: a dark blue hydra crackling with lightning */
    elder(9, { name: 'Storm Hydra', aura: '#8AB8FF', pals: [{ s: '#3E5A9A', b: '#C8D8F2', w: '#E8E04A', e: '#FFF08F' }, { s: '#4A3E8A', b: '#D8D0F2', w: '#7FF2F2', e: '#F2F28A' }, { s: '#2E6A8A', b: '#D0F0F2', w: '#F2E04A', e: '#F2C14E' }, { s: '#5A4A9A', b: '#E0D8F8', w: '#F28AF2', e: '#8FF2B8' }],
      extra(a) { a({ g: 'plume', c: '#FFF08F', flat: true, sep: false, m: mm => mm.p([[26, 1], [23.4, 5.6], [25.2, 5.6], [22.6, 10.4], [27.2, 4.6], [25.2, 4.6], [27.8, 1]]) }); SP(a, 'float', '#FFF08F', [[3, 8, [0, 2]], [29, 12, [1, 3]], [4, 28, [2, 0]]]); } })
  );
  BEAST.names.push(...BOSSES.slice(10).map(b => b.name));
})();
