/* ================= v23: ten more species =================
   Cupcake Critter, Bandit Raccoon, Durian Brute, Ghost Lantern, Little Alien, Scarecrow, Spiral Snail,
   Digger Mole, Treant and Frog Warrior. Same kit and API as 09f/09h; they join BEAST.species and the fourth
   species mapping MALT3 in 03. Monsters face LEFT toward the hero; design space 32 x 32, ground at y = 30. */
(() => {
  const { mix, dk, lt } = PX.kit;
  const { GOLD, STEEL, WOOD, INK, MOUTH, TEETH } = MON2.kit;
  const more = {
    /* CUPCAKE CRITTER: a frosted cupcake with a cherry on top, sprinkles and a ridged paper wrapper */
    cupcake: {
      pals: [{ w: '#E86F9A', f: '#FFF0F5', c: '#E5484D' }, { w: '#4FA8E8', f: '#FFE8C8', c: '#E5484D' }, { w: '#7AB84E', f: '#8A5A3A', c: '#F2C14E' }, { w: '#B58CF2', f: '#CFF2FF', c: '#E86F9A' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'feet', c: dk(P.w, .35), m: mm => mm.e(12.4, 29.6, 1.9, .9).e(19.6, 29.6, 1.9, .9) });
        const wrap = mm => mm.p([[8.2, 19.4], [23.8, 19.4], [21.8, 29], [10.2, 29]]);
        a({ g: 'body', c: P.w, round: 2, m: wrap });
        fl('body', dk(P.w, .25), mm => wrap(mm).and(t => { for (let i = 0; i < 6; i++) t.l(10.4 + i * 2.2, 19.6, 11.4 + i * 1.8, 29, .4); }));
        a({ g: 'weap', c: P.f, arm: 1, m: mm => mm.l(9.6, 21.4, 6.4, 19.4, 1.3).e(6, 19, 1, 1) });
        const top = mm => mm.e(16, 16.4, 8.8, 4.2).e(16, 12.6, 6.6, 3.6).e(16, 9.4, 4, 2.6).e(9.8, 20, 1.3, 1.6).e(15, 20.6, 1.2, 1.8).e(21, 20, 1.3, 1.6);
        a({ g: 'face', c: P.f, round: 3, m: top });
        fl('face', lt(P.f, .5), mm => mm.e(12.6, 11.4, 2, 1).e(14.4, 8.6, 1.2, .6));
        fl('face', dk(P.f, .14), mm => top(mm).and(t => t.l(8.6, 15.6, 23.4, 15.6, .34).l(10.4, 12.2, 21.6, 12.2, .34)));
        [['#F2C14E', [[10.6, 17.6], [20.8, 11], [22.2, 17.2]]], ['#4FA8E8', [[12.6, 10.2], [21, 16.4], [18.6, 9.2]]], ['#5FB85A', [[11.4, 13.6], [19.6, 19], [13.8, 19.2]]]].forEach(([c, ps]) => fl('face', c, mm => ps.forEach(([x, y]) => mm.l(x, y, x + .7, y - .4, .4))));
        a({ g: 'face', c: '#3E6A2E', m: mm => mm.l(16.8, 5, 18.6, 2.6, .45) });
        a({ g: 'face', c: P.c, gloss: 1, m: mm => mm.e(16.4, 6.2, 1.9, 1.9) });
        return { eyes: [[13.2, 14.4], [18.8, 14.4]], er: 1.2, iris: '#5A3A1E', browC: dk(P.f, .5), lidC: P.f, mouth: { x: 16, y: 17.4, w: 2 }, head: { cx: 16, top: 6, w: 6 }, hand: null, gear: [] };
      }
    },
    /* BANDIT RACCOON: a masked raccoon with a ringed tail and a sack of shiny coins */
    raccoon: {
      pals: [{ f: '#8E8C9C', l: '#E0DCE8', d: '#3A3448', e: '#F2C14E' }, { f: '#9A7A5E', l: '#EAD8C0', d: '#4A3424', e: '#8FF2B8' }, { f: '#6E7A8E', l: '#D8E0EA', d: '#2A3040', e: '#F28AB0' }, { f: '#B08A6A', l: '#F2E4D0', d: '#5A3E2A', e: '#7FE7F2' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, fu = P.f;
        const tail = mm => mm.p([[19.6, 25], [23.4, 20.6], [25.4, 15.6], [26.2, 10.6], [28.4, 9.2], [30.4, 11.6], [30.2, 16.4], [28.4, 21.4], [23.6, 26.4]]);
        a({ g: 'tail', c: fu, tex: 'fur', round: 3, m: tail });
        fl('tail', P.d, mm => tail(mm).and(t => t.r(0, 12, 32, 1.6).r(0, 16.4, 32, 1.6).r(0, 20.8, 32, 1.6)));
        fl('tail', P.d, mm => tail(mm).and(t => t.r(0, 0, 32, 10.4)));
        a({ g: 'feet', c: P.d, m: mm => mm.e(12.6, 29.4, 2, 1).e(19.4, 29.4, 2, 1) });
        a({ g: 'body', c: fu, tex: 'fur', round: 5, m: mm => mm.e(16, 21.6, 6, 6.4) });
        a({ g: 'body', c: P.l, tex: 'fur', sep: false, m: mm => mm.e(15.2, 23, 3.6, 4.2) });
        a({ g: 'face', c: fu, m: mm => { tri(mm, 11.4, 8.6, 1.8, 3.4); tri(mm, 18.8, 8.6, 1.8, 3.4); } });
        fl('face', P.l, mm => { tri(mm, 11.4, 8.2, .9, 2); tri(mm, 18.8, 8.2, .9, 2); });
        a({ g: 'face', c: fu, tex: 'fur', round: 4, m: mm => mm.e(15, 11.4, 5.6, 4.6) });
        a({ g: 'face', c: P.l, sep: false, m: mm => mm.e(13.4, 13.8, 2.8, 1.8).e(15, 8.6, 1.4, 1) });
        a({ g: 'face', c: P.d, sep: false, m: mm => mm.e(13.2, 10.8, 2.4, 1.6).e(17.2, 10.8, 2.4, 1.6).r(13.2, 10.2, 4, 1.2) });
        a({ g: 'face', c: INK, gloss: 1, m: mm => mm.e(11.4, 13.2, .8, .65) });
        a({ g: 'weap', c: '#D8C49A', tex: 'cloth', round: 3, m: mm => mm.e(7, 21.4, 3.4, 3.6) });
        fl('weap', dk('#D8C49A', .35), mm => mm.l(5.4, 18.6, 8.8, 18.6, .5));
        h.dot('weap', GOLD, [[6.2, 17.2, [0, 2]], [7.6, 16.8, [1, 3]], [5.4, 22, [0, 1]]]);
        a({ g: 'weap', c: fu, arm: 1, tex: 'fur', m: mm => mm.l(11.4, 18.4, 8.6, 18.8, 1.4).e(8.4, 18.8, 1, 1) });
        return { eyes: [[13.2, 10.8], [17.2, 10.8]], er: .95, iris: P.e, browC: P.d, lidC: fu, mouth: { x: 13.6, y: 14.8, w: 1.6 }, head: { cx: 15, top: 6.8, w: 5 }, chest: { cx: 15.2, cy: 22, rx: 3, ry: 3 }, hand: null, gear: ['hat', 'amulet'], hats: ['hood', 'crown'] };
      }
    },
    /* DURIAN BRUTE: the king of fruits, all spikes and a big grin, with a whiff of durian in the air */
    durian: {
      pals: [{ h: '#8AA83E', s: '#5A7A2A', y: '#F2D27A' }, { h: '#A8903E', s: '#6E5A2A', y: '#FFE8A8' }, { h: '#5FA85A', s: '#3E6A3A', y: '#F2C14E' }, { h: '#B8A04E', s: '#7A6A2E', y: '#FFF0B8' }],
      draw(h, P, m) {
        const { a, fl, tri } = h;
        a({ g: 'feet', c: P.s, m: mm => mm.l(12.4, 25, 11.8, 29.2, 1.6).l(19.6, 25, 20.2, 29.2, 1.6).e(11.2, 29.6, 1.8, .8).e(20.8, 29.6, 1.8, .8) });
        a({ g: 'body', c: dk(P.h, .1), m: mm => { for (let i = 0; i < 16; i++) { const t = i * Math.PI / 8, x = 16 + Math.cos(t) * 8.6, y = 17.6 + Math.sin(t) * 8.2; mm.p([[x - Math.sin(t) * 1.2, y + Math.cos(t) * 1.2], [16 + Math.cos(t) * 10.6, 17.6 + Math.sin(t) * 10.2], [x + Math.sin(t) * 1.2, y - Math.cos(t) * 1.2]]); } } });
        a({ g: 'body', c: P.h, tex: 'scale', round: 6, m: mm => mm.e(16, 17.6, 8.6, 8.2) });
        fl('body', P.s, mm => { for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const x = 10 + c * 3 + (r % 2) * 1.5, y = 11.6 + r * 3.4; if ((x - 16) ** 2 / 64 + (y - 17.6) ** 2 / 56 < .9) { tri(mm, x, y, .5, .9); } } });
        a({ g: 'body', c: '#6B4A2A', m: mm => mm.r(15.4, 6.8, 1.2, 3) });
        a({ g: 'body', c: P.y, sep: false, fr: [5], m: mm => mm.e(16, 21, 3.6, 2.2) });
        h.dot('float', mix(P.h, '#FFFFFF', .3), [[4, 8, [0, 1]], [27.6, 10, [2, 3]], [26, 4, [1, 2]]]);
        fl('float', mix(P.h, '#FFFFFF', .2), mm => mm.l(4.6, 12, 5.6, 10.6, .4).l(5.6, 10.6, 4.6, 9.2, .4).l(27, 15, 28, 13.6, .4).l(28, 13.6, 27, 12.2, .4), { fr: [0, 2] });
        return { eyes: [[13, 16], [19, 16]], er: 1.3, iris: '#5A3A1E', browC: dk(P.s, .4), lidC: P.h, mouth: { x: 16, y: 20.2, w: 2.8 }, head: { cx: 16, top: 7.4, w: 6 }, hand: null, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* GHOST LANTERN: a floating paper lantern lit from inside, with a flame face and a swinging tassel */
    lantern: {
      pals: [{ l: '#E5484D', g: '#FFD54A', c: GOLD }, { l: '#F28A2E', g: '#FFF3A8', c: GOLD }, { l: '#6E4AC9', g: '#8FF2E8', c: '#C9D1DE' }, { l: '#3E9A7A', g: '#F2F8A8', c: GOLD }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'tail', c: P.c, m: mm => mm.l(16, 23.6, 16, 27, .7) });
        a({ g: 'tail', c: P.l, fr: [0, 1, 4], m: mm => mm.p([[14.8, 26.6], [17.2, 26.6], [17.8, 30], [14.2, 30]]) });
        a({ g: 'tail', c: P.l, fr: [2, 3, 5], m: mm => mm.p([[14.8, 26.6], [17.2, 26.6], [18.6, 29.6], [15, 30.2]]) });
        a({ g: 'body', c: P.c, gloss: 1, m: mm => mm.e(16, 4.2, 2.2, 1.8).sub(t => t.e(16, 4.2, 1.3, 1)).r(12.4, 6, 7.2, 1.7).r(12.4, 22.4, 7.2, 1.7) });
        const body = mm => mm.e(16, 15, 7.4, 7.8);
        a({ g: 'body', c: P.l, round: 6, m: body });
        a({ g: 'body', c: mix(P.l, P.g, .45), flat: true, sep: false, fr: [0, 2, 4, 5], m: mm => mm.e(16, 15.4, 4.6, 5.4) });
        a({ g: 'body', c: mix(P.l, P.g, .6), flat: true, sep: false, fr: [1, 3], m: mm => mm.e(16, 15.4, 5, 5.8) });
        fl('body', dk(P.l, .3), mm => body(mm).and(t => t.l(8.8, 11, 23.2, 11, .34).l(8.6, 15, 23.4, 15, .34).l(8.8, 19, 23.2, 19, .34)));
        h.spark('float', P.g, [[5, 6, [0, 2]], [27, 8, [1, 3]], [26.6, 22, [0, 2]]]);
        return { eyes: [[13.4, 13.8], [18.6, 13.8]], er: 1.15, glow: P.g, brows: false, mouth: { x: 16, y: 17.8, w: 2.2 }, head: { cx: 16, top: 2.6, w: 4 }, hand: null, floaty: true, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* LITTLE ALIEN: a big-headed visitor with bobbing antennae, a space suit and a toy ray gun */
    alien: {
      pals: [{ k: '#7AD86A', s: '#B8C2D8', g: '#F28AB0' }, { k: '#8AC9F2', s: '#E8E0F2', g: '#F2C14E' }, { k: '#C9A0F2', s: '#C8D8E0', g: '#8FF2B8' }, { k: '#F2D27A', s: '#9AA8C9', g: '#7FE7F2' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'feet', c: dk(P.s, .3), gloss: 1, m: mm => mm.e(13.4, 29.4, 2, 1).e(18.6, 29.4, 2, 1) });
        a({ g: 'feet', c: P.s, m: mm => mm.r(12.6, 25, 1.8, 4).r(17.6, 25, 1.8, 4) });
        a({ g: 'body', c: P.s, gloss: 1, round: 3, m: mm => mm.e(16, 22.4, 4.6, 4.8) });
        a({ g: 'body', c: P.g, sep: false, m: mm => mm.r(11.6, 23, 8.8, 1.2) });
        a({ g: 'body', c: GOLD, gloss: 1, sep: false, m: mm => mm.e(16, 20.4, 1, 1) });
        a({ g: 'face', c: P.k, m: mm => mm.l(13, 7.6, 11, 3, .5).l(19, 7.6, 21, 3, .5) });
        a({ g: 'face', c: P.g, gloss: 1, fr: [0, 1, 4, 5], m: mm => mm.e(11, 2.6, 1.1, 1.1).e(21, 2.6, 1.1, 1.1) });
        a({ g: 'face', c: P.g, gloss: 1, fr: [2, 3], m: mm => mm.e(10.6, 3, 1.1, 1.1).e(21.4, 3, 1.1, 1.1) });
        a({ g: 'face', c: P.k, round: 5, m: mm => mm.e(16, 12, 7.2, 6).e(16, 16.4, 4, 2) });
        fl('face', lt(P.k, .35), mm => mm.e(13, 8.6, 2.4, 1.2));
        a({ g: 'weap', c: P.s, arm: 1, m: mm => mm.l(12, 21, 8.6, 21.6, 1.3) });
        a({ g: 'weap', c: dk(P.s, .2), gloss: 1, m: mm => mm.r(4.6, 20, 4.2, 1.8).r(7.2, 21.4, 1.2, 1.8) });
        a({ g: 'weap', c: P.g, flat: true, fr: [5], m: mm => mm.e(3.2, 20.8, 1.6, .9) });
        return { eyes: [[13.2, 12.4], [18.8, 12.4]], er: 1.65, iris: '#1E1A2E', brows: false, lidC: P.k, mouth: { x: 16, y: 16, w: 1.8 }, threeOK: true, head: { cx: 16, top: 6, w: 7 }, chest: { cx: 16, cy: 22.6, rx: 3, ry: 2.6 }, hand: null, gear: ['hat'], hats: ['crown', 'helm'] };
      }
    },
    /* SCARECROW: a stitched sack head under a straw hat, a patched shirt on a pole, and a crow friend */
    scarecrow: {
      pals: [{ s: '#4E7AC9', h: '#E8C15A', p: '#C9453A' }, { s: '#C9453A', h: '#D8B04E', p: '#4E9A5A' }, { s: '#5FA85A', h: '#F2D27A', p: '#9A6AC9' }, { s: '#9A6AC9', h: '#E0B86A', p: '#E8862E' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, sack = '#D8C49A', straw = P.h;
        a({ g: 'back', c: WOOD, tex: 'wood', m: mm => mm.r(15.4, 14, 1.2, 16).r(4.6, 15.2, 22.8, 1.2) });
        a({ g: 'body', c: straw, m: mm => { tri(mm, 12.4, 27, 1.2, -3); tri(mm, 15, 27.4, 1.2, -3.4); tri(mm, 17.6, 27.4, 1.2, -3.4); tri(mm, 20, 27, 1.2, -3); } });
        a({ g: 'body', c: straw, m: mm => mm.p([[3, 14.4], [5.4, 15.8], [3, 17.4]]).p([[29, 14.4], [26.6, 15.8], [29, 17.4]]) });
        const shirt = mm => mm.p([[11, 13.6], [21, 13.6], [22, 24.6], [10, 24.6]]).l(11, 15.6, 5.4, 15.8, 2.6).l(21, 15.6, 26.6, 15.8, 2.6);
        a({ g: 'body', c: P.s, tex: 'cloth', round: 2, m: shirt });
        a({ g: 'body', c: P.p, sep: false, m: mm => mm.r(17.6, 19.4, 2.4, 2.4).r(7.4, 14.8, 1.8, 1.8) });
        fl('body', INK, mm => mm.l(17.6, 19.4, 20, 21.8, .25).l(20, 19.4, 17.6, 21.8, .25));
        fl('body', dk(P.s, .35), mm => shirt(mm).and(t => t.r(15.8, 13.6, .34, 11)));
        a({ g: 'face', c: sack, tex: 'cloth', round: 3, m: mm => mm.e(16, 9.6, 4.4, 4.4) });
        fl('face', '#6B4A2A', mm => mm.l(12.6, 12, 19.4, 12, .3));
        fl('face', '#6B4A2A', mm => { for (let i = 0; i < 6; i++) mm.l(13 + i * 1.2, 11.4, 13 + i * 1.2, 12.6, .25); });
        a({ g: 'face', c: straw, gloss: 1, m: mm => mm.e(16, 5.8, 7.4, 1.3).p([[12, 5.6], [13, 1.8], [19, 1.8], [20, 5.6]]) });
        a({ g: 'face', c: P.p, sep: false, m: mm => mm.r(12.6, 4.2, 6.8, 1.1) });
        a({ g: 'weap', c: '#2A2A33', m: mm => mm.e(6.4, 12.8, 1.6, 1.3).e(5, 11.4, 1, 1) });
        a({ g: 'weap', c: '#F2C14E', m: mm => mm.p([[4.2, 11.2], [2.8, 11.6], [4.2, 12]]) });
        h.dot('weap', '#FFFFFF', [[4.8, 11, [0, 1, 2, 3]]]);
        return { eyes: [[14.4, 9], [17.6, 9]], er: .9, iris: '#1E1A2E', brows: false, lidC: sack, noMouth: true, threeOK: false, head: { cx: 16, top: 5, w: 4 }, hand: null, gear: [] };
      }
    },
    /* SPIRAL SNAIL: a slow and steady snail with a swirly shell and eyes on stalks */
    snail: {
      pals: [{ b: '#E8C08A', s: '#C9603E', r: '#F2C14E' }, { b: '#C8D8B8', s: '#6E4AC9', r: '#F28AB0' }, { b: '#F2D2C8', s: '#3E9A7A', r: '#8FF2E8' }, { b: '#D8C8E8', s: '#E8862E', r: '#FFF0B8' }],
      draw(h, P, m) {
        const { a, fl } = h;
        const foot = mm => mm.p([[2.4, 26.4], [3.4, 20], [6.6, 17.6], [11.4, 19.6], [13, 25.4], [28.6, 26.8], [29.2, 29.2], [3.2, 29.4]]);
        a({ g: 'feet', c: P.b, round: 3, m: foot });
        fl('feet', dk(P.b, .2), mm => foot(mm).and(t => t.r(0, 28, 32, 2)));
        a({ g: 'face', c: P.b, m: mm => mm.l(6.4, 18.4, 6.8, 12.6, .9).l(9.4, 18.4, 10.6, 11.8, .9) });
        const shell = mm => mm.e(19.2, 18.4, 7.8, 7.6);
        a({ g: 'body', c: P.s, round: 6, m: shell });
        const ring = (mm, x, y, r) => mm.e(x, y, r, r).sub(t => t.e(x, y, r - .7, r - .7));
        fl('body', dk(P.s, .35), mm => { ring(mm, 19.6, 18.2, 6.2); ring(mm, 20.2, 18, 4.4); ring(mm, 20.6, 17.8, 2.6); });
        fl('body', P.r, mm => mm.e(20.8, 17.8, 1, 1));
        fl('body', lt(P.s, .35), mm => mm.e(15.4, 13.6, 1.8, 1));
        return { eyes: [[6.8, 12], [10.6, 11.2]], er: .95, iris: '#1E1A2E', brows: false, lidC: P.b, mouth: { x: 5.6, y: 22, w: 1.6 }, threeOK: false, head: { cx: 8.6, top: 10, w: 3 }, hand: null, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* DIGGER MOLE: a sleepy-eyed mole in a miner's helmet, with a pink snout, big claws and a shovel */
    mole: {
      pals: [{ f: '#6E5A4A', l: '#A88E78', h: '#F2C14E' }, { f: '#4A4A5A', l: '#8A8A9C', h: '#E8862E' }, { f: '#8A6A4A', l: '#C9A880', h: '#5FC4F2' }, { f: '#5A4A3A', l: '#9A8670', h: '#E5484D' }],
      draw(h, P, m) {
        const { a, fl } = h, pink = '#F2A0B0', fu = P.f;
        a({ g: 'weap', c: WOOD, tex: 'wood', m: mm => mm.l(6.8, 24.6, 6.8, 9.6, .7) });
        a({ g: 'weap', c: STEEL, gloss: 1, m: mm => mm.p([[5.2, 9.4], [8.4, 9.4], [8.2, 5.6], [6.8, 4.2], [5.4, 5.6]]) });
        a({ g: 'feet', c: pink, m: mm => mm.e(12.4, 29.4, 2.2, 1).e(19.6, 29.4, 2.2, 1) });
        a({ g: 'body', c: fu, tex: 'fur', round: 5, m: mm => mm.e(16, 21, 7, 7.2) });
        a({ g: 'body', c: P.l, tex: 'fur', sep: false, m: mm => mm.e(15.4, 22.6, 4, 4.6) });
        a({ g: 'face', c: fu, tex: 'fur', round: 4, m: mm => mm.e(15, 12, 5.6, 4.8) });
        a({ g: 'face', c: pink, round: 2, m: mm => mm.e(10.2, 13.4, 2.4, 1.6) });
        a({ g: 'face', c: dk(pink, .3), gloss: 1, m: mm => mm.e(8.4, 13, .9, .8) });
        fl('face', dk(fu, .4), mm => mm.l(10.4, 14.6, 7.8, 15.4, .25).l(10.6, 15, 8.6, 16.4, .25));
        a({ g: 'face', c: P.h, gloss: 1, round: 2, m: mm => mm.e(15.6, 8.4, 5.6, 3).sub(t => t.r(0, 8.8, 32, 6)).r(9.8, 8.2, 11.6, 1) });
        a({ g: 'face', c: '#FFF3A8', flat: true, fr: [0, 1, 2, 3, 5], m: mm => mm.e(11.2, 7.4, 1.2, 1.2) });
        a({ g: 'weap', c: fu, arm: 1, tex: 'fur', m: mm => mm.l(11.4, 18, 7.4, 19, 1.8) });
        a({ g: 'weap', c: pink, m: mm => mm.e(7, 19.2, 1.4, 1.3) });
        h.dot('weap', '#F2EAD8', [[5.4, 18.6], [5.6, 19.8]]);
        return { eyes: [[12.8, 11.4], [15.8, 11.2]], er: .75, eyeStyle: 'sleepy', iris: '#1E1A2E', brows: false, lidC: fu, mouth: { x: 11.8, y: 15.4, w: 1.4 }, threeOK: false, head: { cx: 15, top: 5.6, w: 5 }, hand: null, gear: [] };
      }
    },
    /* TREANT: a walking tree with root feet, branch arms, a leafy crown and a kind, knotty face */
    treant: {
      pals: [{ b: '#7A5232', l: '#4E9A3E', f: '#E5484D', e: '#F2C14E' }, { b: '#6B4A3A', l: '#E0862E', f: '#F2C14E', e: '#8FF2B8' }, { b: '#8A6A4E', l: '#E88AB0', f: '#FFFFFF', e: '#5FC4F2' }, { b: '#5A4A3A', l: '#3E7A5A', f: '#F28A2E', e: '#F2C14E' }],
      draw(h, P, m) {
        const { a, fl } = h, bd = dk(P.b, .25);
        a({ g: 'feet', c: bd, m: mm => mm.l(11, 27, 8, 30, 1.4).l(13.6, 27.4, 13, 30.4, 1.2).l(18.6, 27.4, 19.4, 30.4, 1.2).l(21, 27, 24, 30, 1.4) });
        a({ g: 'back', c: P.b, tex: 'wood', m: mm => mm.l(21, 16.4, 26.4, 12.4, 1.4).l(26.4, 12.4, 28.6, 13, .7).l(25, 13.6, 26, 10.4, .6) });
        const trunk = mm => mm.p([[10.6, 11.6], [21.4, 11.6], [22.8, 28], [9.2, 28]]);
        a({ g: 'body', c: P.b, tex: 'wood', round: 2, m: trunk });
        fl('body', bd, mm => trunk(mm).and(t => t.l(12, 23, 12.6, 27.6, .34).l(20, 22, 20.6, 27.6, .34).e(19.6, 13.6, .9, .7)));
        const crown = mm => mm.e(16, 7.4, 8.8, 5.4).e(9, 10.4, 4, 3.4).e(23, 10.4, 4, 3.4).e(16, 3.4, 5.2, 3);
        a({ g: 'face', c: P.l, round: 4, m: crown });
        fl('face', lt(P.l, .25), mm => mm.e(12.6, 5, 2.4, 1.4).e(19.6, 4.2, 1.8, 1.1).e(8.6, 9, 1.6, 1));
        fl('face', dk(P.l, .25), mm => crown(mm).and(t => t.r(0, 11, 32, 3)));
        h.dot('face', P.f, [[11.6, 7.6], [19.4, 8.4], [15.4, 2.6], [23.4, 10.6]]);
        a({ g: 'weap', c: P.b, arm: 1, tex: 'wood', m: mm => mm.l(11, 17, 5.6, 14, 1.5).l(5.6, 14, 4.2, 11.6, .7) });
        a({ g: 'weap', c: P.l, m: mm => mm.e(4.4, 12.8, 1.9, 1.5) });
        return { eyes: [[13.6, 17.2], [18.4, 17.2]], er: 1.15, iris: P.e, browC: dk(P.b, .5), lidC: P.b, mouth: { x: 16, y: 21.4, w: 2.4 }, head: { cx: 16, top: .8, w: 6 }, hand: null, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* FROG WARRIOR: a bold little frog with bulging eyes, a wide grin and a spear */
    frog: {
      pals: [{ g: '#5FB85A', b: '#E8F2B8', e: '#F2C14E' }, { g: '#4FA8E8', b: '#D8F0FF', e: '#F2C14E' }, { g: '#E8862E', b: '#FFE8C8', e: '#5A3A1E' }, { g: '#B58CF2', b: '#F0E8FF', e: '#8FF2B8' }],
      draw(h, P, m) {
        const { a, fl } = h, gd = dk(P.g, .25);
        a({ g: 'feet', c: P.g, round: 3, m: mm => mm.e(22, 25.6, 4, 3.2) });
        a({ g: 'feet', c: lt(P.g, .2), m: mm => mm.e(25, 29.4, 2.8, .9).e(11, 29.4, 2.4, .9) });
        a({ g: 'feet', c: P.g, m: mm => mm.l(12.4, 25, 11.6, 29, 1.4) });
        a({ g: 'body', c: P.g, round: 5, m: mm => mm.e(16, 20.6, 6.6, 6) });
        a({ g: 'body', c: P.b, sep: false, m: mm => mm.e(14.6, 22.4, 4.2, 4) });
        fl('body', gd, mm => mm.e(20, 17.4, .8, .7).e(21.4, 21, .7, .6).e(18.6, 24.2, .6, .5));
        a({ g: 'face', c: P.g, round: 4, m: mm => mm.e(14.4, 13.4, 6.6, 4.4).e(11.2, 9.8, 2.5, 2.5).e(17.4, 9.8, 2.5, 2.5) });
        fl('face', MOUTH, mm => mm.l(9, 15, 12, 15.8, .4).l(12, 15.8, 16, 15.8, .4).l(16, 15.8, 19.4, 15, .4), { fr: [0, 1, 2, 3] });
        a({ g: 'face', c: MOUTH, flat: true, fr: [4, 5], m: mm => mm.e(14.2, 15.6, 3.6, 1.4) });
        a({ g: 'weap', c: P.g, arm: 1, m: mm => mm.l(12, 18.6, 8.4, 20, 1.4) });
        return { eyes: [[11.2, 9.8], [17.4, 9.8]], er: 1.45, iris: P.e, browC: gd, lidC: P.g, noMouth: true, head: { cx: 14.4, top: 7.4, w: 6 }, hand: { x: 8, y: 20.4 }, weapons: [2, 6], handC: P.g, gear: ['hat'], hats: ['crown', 'helm'] };
      }
    }
  };
  Object.assign(BEAST.species, more);
})();
