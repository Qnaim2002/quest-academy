/* ================= v24: ten more species =================
   Snow Buddy, Pirate Parrot, Gnome Wizard, Beetle Knight, Puffer Fish, Sang Buaya (crocodile), Malayan Tapir,
   Wau Spirit (a living Malaysian moon kite), Cloud Sheep and Teapot Spirit. Same kit and API as 09f/09h/09i; they
   join BEAST.species and the fifth species mapping MALT4 in 03. Monsters face LEFT; 32 x 32, ground at y = 30. */
(() => {
  const { mix, dk, lt } = PX.kit;
  const { GOLD, STEEL, WOOD, INK, MOUTH, TEETH } = MON2.kit;
  const more = {
    /* SNOW BUDDY: two snowballs, a carrot nose, coal smile, stick arms and a knitted scarf */
    snowman: {
      pals: [{ w: '#F4F8FF', s: '#E5484D', b: '#4FA8E8' }, { w: '#EEF4FA', s: '#4E9A5A', b: '#F2C14E' }, { w: '#F8F4FF', s: '#9A6AC9', b: '#E86F9A' }, { w: '#F2FAF8', s: '#3E7AC9', b: '#E8862E' }],
      draw(h, P, m) {
        const { a, fl } = h, sh = mix(P.w, '#8AA8C9', .3);
        a({ g: 'back', c: WOOD, m: mm => mm.l(21.6, 19.6, 27, 15, .7).l(25.6, 16.2, 27.6, 16.6, .5) });
        a({ g: 'body', c: P.w, round: 6, m: mm => mm.e(16, 23.2, 7.4, 6.6) });
        fl('body', sh, mm => mm.e(16, 23.2, 7.4, 6.6).sub(t => t.e(15, 22.2, 7, 6.2)));
        fl('body', '#2A2A33', mm => mm.e(16, 20.4, .7, .7).e(16, 23.4, .7, .7).e(16, 26.4, .7, .7));
        a({ g: 'face', c: P.w, round: 4, m: mm => mm.e(16, 11.8, 5, 4.6) });
        fl('face', sh, mm => mm.e(16, 11.8, 5, 4.6).sub(t => t.e(15.2, 11, 4.8, 4.4)));
        a({ g: 'face', c: '#F28A2E', m: mm => mm.p([[14, 12.6], [8.6, 13.8], [14, 14.2]]) });
        fl('face', '#2A2A33', mm => mm.r(13.4, 15.4, .7, .7).r(14.8, 15.9, .7, .7).r(16.3, 16, .7, .7).r(17.8, 15.6, .7, .7));
        a({ g: 'body', c: P.s, tex: 'cloth', m: mm => mm.e(16, 16.6, 5.4, 1.4).p([[18, 16.6], [20.4, 16.8], [21, 21.6], [19, 21.2]]) });
        fl('body', P.b, mm => mm.r(11, 16.2, 10, .5).r(19.2, 19.4, 1.8, .5));
        a({ g: 'weap', c: WOOD, m: mm => mm.l(10.4, 19.8, 5.4, 16.4, .7).l(6.6, 17.2, 5.2, 15.4, .45).l(6.4, 17, 4.4, 17.6, .45) });
        h.spark('float', '#FFFFFF', [[4, 6, [0, 2]], [27, 8, [1, 3]], [3, 22, [2, 0]]]);
        return { eyes: [[14.2, 10.8], [17.8, 10.8]], er: .85, iris: '#1E1A2E', browC: '#2A2A33', lidC: P.w, noMouth: true, head: { cx: 16, top: 7.2, w: 5 }, hand: null, gear: ['hat'], hats: ['crown', 'hood'] };
      }
    },
    /* PIRATE PARROT: a bright parrot in a tricorn hat with a curved beak, long tail and a little cutlass */
    parrot: {
      pals: [{ b: '#4E9A3E', h: '#E5484D', w: '#3E7AC9', t: '#F2C14E' }, { b: '#3E7AC9', h: '#F2C14E', w: '#E5484D', t: '#4E9A3E' }, { b: '#E5484D', h: '#F28A2E', w: '#F2C14E', t: '#3E7AC9' }, { b: '#9A6AC9', h: '#E86F9A', w: '#5FC4F2', t: '#F2C14E' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'tail', c: P.w, m: mm => mm.p([[18.4, 21], [25, 27.6], [23.6, 29.4], [17.4, 24]]) });
        a({ g: 'tail', c: P.t, m: mm => mm.p([[19.4, 21.4], [27.4, 25.4], [26.4, 27], [18.6, 23.4]]) });
        a({ g: 'feet', c: '#5A5A66', m: mm => mm.l(15.4, 23.6, 15, 27.6, .7).l(18, 23.6, 18.4, 27.6, .7) });
        h.dot('feet', '#2A2A33', [[14, 27.8], [15, 28], [18, 28], [19, 27.8]]);
        a({ g: 'body', c: P.b, tex: 'feather', round: 4, m: mm => mm.e(17, 18.4, 5, 6.2) });
        a({ g: 'body', c: lt(P.b, .35), tex: 'feather', sep: false, m: mm => mm.e(15.4, 20, 2.6, 3.8) });
        a({ g: 'face', c: P.h, tex: 'feather', round: 3, m: mm => mm.e(13.6, 10.6, 4, 3.8).l(14.4, 13, 15.8, 15, 2.4) });
        a({ g: 'face', c: '#F2EAD8', sep: false, m: mm => mm.e(12, 10.4, 1.8, 1.6) });
        a({ g: 'face', c: '#F2C14E', gloss: 1, m: mm => mm.p([[10.2, 9.4], [7, 10.2], [6.6, 12.4], [7.6, 13.4], [8, 11.8], [10.4, 12.4]]) });
        a({ g: 'jaw', c: '#C9952E', m: mm => mm.p([[8.4, 12.4], [10.4, 12.6], [10, 13.8], [8.6, 13.6]]) });
        a({ g: 'face', c: '#2A2A33', m: mm => mm.p([[9.6, 7.8], [13.6, 4.4], [18.2, 7.8], [16.8, 8.6], [13.6, 7.4], [10.8, 8.6]]) });
        fl('face', '#F2EAD8', mm => mm.e(13.6, 6.4, .6, .6));
        fl('face', GOLD, mm => mm.r(10.6, 8, 6.4, .34));
        a({ g: 'weap', c: P.w, tex: 'feather', arm: 1, m: mm => mm.p([[15.4, 15], [9.4, 18.4], [10.8, 20.4], [15.6, 19.2]]) });
        return { profile: true, eyes: [[12.2, 10.2]], er: .9, iris: '#2A2A33', browC: dk(P.h, .5), lidC: P.h, noMouth: true, head: { cx: 13.6, top: 4.4, w: 4 }, hand: { x: 9.4, y: 19.6 }, weapons: [1], handC: P.w, gear: [] };
      }
    },
    /* GNOME WIZARD: a tiny wizard with a tall starry hat, a fluffy white beard, a red nose and a gem staff */
    gnome: {
      pals: [{ h: '#3E5AC9', r: '#5A3E9A', g: '#7FE7F2' }, { h: '#C9453A', r: '#3E7A5A', g: '#F2C14E' }, { h: '#4E9A5A', r: '#8A4A2E', g: '#F28AB0' }, { h: '#9A6AC9', r: '#2E5A8A', g: '#8FF2B8' }],
      draw(h, P, m) {
        const { a, fl } = h, skin = '#F2C8A8';
        a({ g: 'feet', c: '#5A3A22', gloss: 1, m: mm => mm.e(13, 29.4, 2, .9).e(18.8, 29.4, 2, .9) });
        const robe = mm => mm.p([[11.4, 16.6], [20.6, 16.6], [23, 29], [9, 29]]);
        a({ g: 'body', c: P.r, tex: 'cloth', round: 3, m: robe });
        fl('body', GOLD, mm => robe(mm).and(t => t.r(0, 27.4, 32, .6)));
        a({ g: 'face', c: '#F4F4F8', round: 3, m: mm => mm.p([[11.2, 13.2], [20, 13.2], [19.2, 19], [16, 22.6], [12.8, 19]]) });
        fl('face', '#D8D8E4', mm => mm.l(14, 15, 14.6, 20, .3).l(17.6, 15, 17.2, 20, .3));
        a({ g: 'face', c: skin, round: 2, m: mm => mm.e(15.6, 12, 3.6, 2.6) });
        a({ g: 'face', c: '#E8806E', gloss: 1, m: mm => mm.e(15.2, 13.4, 1.1, 1) });
        a({ g: 'face', c: P.h, tex: 'cloth', round: 2, m: mm => mm.p([[9.6, 11.2], [21.6, 11.2], [18.4, 6], [18, 1.2], [15.4, 4.8]]).e(15.6, 11, 6.6, 1.3) });
        fl('face', GOLD, mm => mm.p(PX.kit.star(16.2, 6.8, 1.1, .45)));
        h.dot('face', lt(P.h, .5), [[13.6, 8.8], [18.6, 9.2]]);
        a({ g: 'weap', c: P.r, arm: 1, tex: 'cloth', m: mm => mm.l(12, 18, 9, 19.4, 1.4) });
        return { eyes: [[14, 11.4], [17.2, 11.4]], er: .75, iris: '#3A5A8A', brows: false, lidC: skin, noMouth: true, threeOK: false, head: { cx: 15.6, top: 1, w: 6 }, hand: { x: 8.6, y: 19.6 }, weapons: [4], gemC: P.g, handC: skin, gear: [] };
      }
    },
    /* BEETLE KNIGHT: a rhinoceros beetle with a shiny shell, a great curved horn and six busy legs */
    beetle: {
      pals: [{ s: '#3E4A8A', h: '#C9A13B', g: '#7FE7F2' }, { s: '#2E6A4A', h: '#D8C49A', g: '#F2C14E' }, { s: '#8A2E3E', h: '#F2D27A', g: '#8FF2B8' }, { s: '#5A3E7A', h: '#B8C2CC', g: '#F28AB0' }],
      draw(h, P, m) {
        const { a, fl } = h, sd = dk(P.s, .35);
        for (let i = 0; i < 3; i++) a({ g: 'feet', c: '#2A2A33', m: mm => mm.l(12 + i * 4.4, 22.6, 10.6 + i * 4.6, 26.6, .6).l(10.6 + i * 4.6, 26.6, 11.6 + i * 4.6, 29.4, .5) });
        const shell = mm => mm.e(18.4, 19.4, 7.4, 6);
        a({ g: 'body', c: P.s, gloss: 1, round: 5, m: shell });
        fl('body', sd, mm => shell(mm).and(t => t.l(13, 15, 25.4, 22, .4)));
        fl('body', lt(P.s, .45), mm => mm.e(16.4, 16.4, 2.4, 1));
        h.dot('body', lt(P.s, .3), [[20.4, 21.4], [22.4, 18.6], [18.6, 23.4]]);
        a({ g: 'face', c: sd, gloss: 1, round: 2, m: mm => mm.e(11.4, 17.4, 3.6, 3.2) });
        a({ g: 'face', c: P.h, gloss: 1, m: mm => mm.p([[10.4, 15.4], [6.4, 11.4], [5, 6.4], [7.4, 9.4], [12.2, 14.2]]).p([[12.6, 14.6], [13, 11.6], [14.4, 14.6]]) });
        a({ g: 'face', c: '#2A2A33', m: mm => mm.l(9, 19.4, 6.6, 20.8, .4).l(9.6, 20, 7.6, 22, .4) });
        return { profile: true, eyes: [[10, 16.8]], er: .8, glow: P.g, brows: false, noMouth: true, head: { cx: 11.4, top: 14, w: 3 }, hand: null, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* PUFFER FISH: a round, spiky puffer with big lips and tiny fins, floating in a stream of bubbles */
    puffer: {
      pals: [{ b: '#F2D27A', l: '#FFF6D8', f: '#F28A2E', s: '#C9952E' }, { b: '#8AC9F2', l: '#E8F6FF', f: '#3E7AC9', s: '#4E8AB8' }, { b: '#F2A0C8', l: '#FFF0F8', f: '#C9457A', s: '#C9708A' }, { b: '#A8E08A', l: '#F0FFE8', f: '#4E9A3E', s: '#6EA85A' }],
      draw(h, P, m) {
        const { a, fl, tri } = h;
        a({ g: 'tail', c: P.f, m: mm => mm.p([[22.6, 17], [29, 12.6], [28, 17.4], [29.4, 22.2]]) });
        a({ g: 'body', c: P.s, m: mm => { for (let i = 0; i < 14; i++) { const t = i * Math.PI / 7, x = 15.6 + Math.cos(t) * 7.6, y = 17 + Math.sin(t) * 7.2; mm.p([[x - Math.sin(t) * .8, y + Math.cos(t) * .8], [15.6 + Math.cos(t) * 9.4, 17 + Math.sin(t) * 9], [x + Math.sin(t) * .8, y - Math.cos(t) * .8]]); } } });
        a({ g: 'body', c: P.b, round: 6, m: mm => mm.e(15.6, 17, 8, 7.6) });
        a({ g: 'body', c: P.l, sep: false, m: mm => mm.e(15, 20.6, 6, 3.4) });
        fl('body', P.s, mm => mm.e(17, 13, .7, .7).e(19.6, 15, .7, .7).e(20.4, 18.6, .6, .6).e(14.4, 11.6, .6, .6));
        a({ g: 'body', c: P.f, m: mm => mm.e(18.6, 18.6, 1.8, 1.1).p([[15, 9.8], [17, 7.6], [18.4, 10]]) });
        a({ g: 'face', c: '#F28AB0', gloss: 1, m: mm => mm.e(8.2, 17.6, 1.4, 1.1) });
        fl('face', MOUTH, mm => mm.r(7, 17.5, 2.2, .3));
        h.dot('float', mix(P.b, '#FFFFFF', .7), [[4, 8, [0, 1]], [2.6, 12, [1, 2]], [5, 4, [2, 3]], [27, 6, [3, 0]]]);
        return { eyes: [[11.4, 14.4], [15.4, 14.2]], er: 1.35, iris: '#1E1A2E', browC: dk(P.b, .5), lidC: P.b, noMouth: true, head: { cx: 14, top: 9, w: 5 }, hand: null, floaty: true, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* SANG BUAYA: the crocodile of the old Sang Kancil stories, long and scaly with a toothy grin */
    croc: {
      pals: [{ g: '#4E8A3E', b: '#C9D88A', e: '#F2C14E' }, { g: '#6A7A3E', b: '#E0D8A8', e: '#F28A2E' }, { g: '#3E7A6A', b: '#B8E0C8', e: '#F2C14E' }, { g: '#5A6A4E', b: '#D8C8A0', e: '#8FF2B8' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, gd = dk(P.g, .3);
        a({ g: 'tail', c: P.g, tex: 'scale', round: 2, m: mm => mm.p([[21.6, 17.6], [27.6, 15.4], [31.2, 11.6], [31, 15], [26, 21.6], [22.6, 22.8]]) });
        a({ g: 'feet', c: gd, m: mm => mm.l(10.4, 22.6, 9.4, 27.8, 1.6).l(14.6, 23, 15, 28, 1.6).l(19.6, 23, 20.2, 28, 1.6).l(23.2, 22, 24.2, 27.6, 1.6) });
        a({ g: 'feet', c: dk(gd, .2), m: mm => mm.e(8.8, 28.4, 1.6, .7).e(14.6, 28.6, 1.6, .7).e(20.6, 28.6, 1.6, .7).e(24.8, 28.2, 1.5, .7) });
        const body = mm => mm.p([[8.4, 17], [21.6, 15.8], [25, 18.4], [23.6, 23.4], [9, 24]]);
        a({ g: 'body', c: P.g, tex: 'scale', round: 3, m: body });
        a({ g: 'body', c: P.b, sep: false, m: mm => body(mm).and(t => t.r(0, 21.6, 32, 4)) });
        a({ g: 'body', c: gd, m: mm => { for (let i = 0; i < 6; i++) tri(mm, 11 + i * 2.4, 16.6 - (i > 3 ? .6 : 0), .7, 1.2); } });
        a({ g: 'face', c: P.g, tex: 'scale', round: 2, m: mm => mm.p([[11.4, 15], [3, 16.4], [1.4, 17.8], [3, 19.4], [11.6, 20]]) });
        a({ g: 'face', c: P.g, round: 2, m: mm => mm.e(9.4, 14.6, 1.8, 1.5) });
        fl('face', TEETH, mm => { for (let i = 0; i < 4; i++) tri(mm, 3.4 + i * 1.8, 19.6, .35, -.9); });
        a({ g: 'jaw', c: P.g, tex: 'scale', m: mm => mm.p([[2, 19.6], [11.2, 20], [10.8, 21.8], [3.6, 21.2]]) });
        a({ g: 'jaw', c: MOUTH, flat: true, fr: [5], m: mm => mm.p([[2.4, 19.6], [11, 20], [10.6, 20.8], [3.4, 20.6]]) });
        fl('jaw', TEETH, mm => { for (let i = 0; i < 4; i++) tri(mm, 4.2 + i * 1.8, 20, .3, .8); });
        a({ g: 'face', c: INK, m: mm => mm.e(2.4, 17, .4, .35) });
        return { profile: true, eyes: [[9.4, 14.4]], er: .8, iris: P.e, browC: gd, lidC: P.g, noMouth: true, head: { cx: 8, top: 12.8, w: 3 }, hand: null, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* MALAYAN TAPIR: black at the front and back with a white middle, a bendy little trunk and sleepy eyes */
    tapir: {
      pals: [{ d: '#2A2A33', w: '#EDEDF2', e: '#8A6A4A' }, { d: '#4A3424', w: '#F2E4C8', e: '#5A3A1E' }, { d: '#2A3456', w: '#E8EEF8', e: '#3E5A8A' }, { d: '#5A5A66', w: '#F8E8EE', e: '#8A4A6A' }],
      draw(h, P, m) {
        const { a, fl, tri } = h;
        a({ g: 'feet', c: P.d, m: mm => mm.r(10.6, 22, 2.2, 6.6).r(14.6, 22, 2.2, 6.6).r(19.6, 22, 2.2, 6.6).r(23.4, 21.6, 2.2, 6.8) });
        h.dot('feet', '#5A5A66', [[10.8, 28.4], [14.8, 28.4], [19.8, 28.4], [23.6, 28.4]]);
        const body = mm => mm.e(18, 19.2, 8.4, 5.4);
        a({ g: 'body', c: P.d, round: 5, m: body });
        a({ g: 'body', c: P.w, sep: false, m: mm => body(mm).and(t => t.p([[15.2, 10], [23.4, 10], [24.6, 30], [16.4, 30]])) });
        fl('body', mix(P.w, P.d, .15), mm => body(mm).and(t => t.p([[15.2, 10], [23.4, 10], [24.6, 30], [16.4, 30]]).and(u => u.r(0, 22, 32, 3))));
        a({ g: 'face', c: P.d, m: mm => { tri(mm, 11, 13.4, 1.1, 2.2); } });
        fl('face', P.w, mm => mm.r(10.4, 11.4, 1.2, .5));
        a({ g: 'face', c: P.d, round: 3, m: mm => mm.e(9.6, 16.6, 3.8, 3.4).l(6.6, 17.2, 3.4, 19.6, 1.8).l(3.4, 19.6, 2.8, 21.4, 1.2) });
        fl('face', mix(P.d, '#FFFFFF', .25), mm => mm.l(5.4, 17.8, 4.2, 19.2, .3));
        return { profile: true, eyes: [[8.6, 15.6]], er: .7, eyeStyle: 'sleepy', iris: P.e, browC: mix(P.d, '#FFFFFF', .3), lidC: P.d, noMouth: true, head: { cx: 9.6, top: 13.2, w: 3 }, hand: null, gear: ['hat'], hats: ['crown', 'hood'] };
      }
    },
    /* WAU SPIRIT: a living moon kite (wau bulan) with painted wings, a crescent tail and a fluttering string */
    wau: {
      pals: [{ w: '#E5484D', b: '#F2C14E', p: '#3E7AC9' }, { w: '#3E7AC9', b: '#F2C14E', p: '#E5484D' }, { w: '#4E9A5A', b: '#F28AB0', p: '#F2C14E' }, { w: '#9A6AC9', b: '#7FE7F2', p: '#F2C14E' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'tail', c: '#F2EAD8', fr: [0, 1, 4], m: mm => mm.l(16, 25, 18.6, 27.4, .3).l(18.6, 27.4, 17, 29.4, .3).l(17, 29.4, 20, 31.4, .3) });
        a({ g: 'tail', c: '#F2EAD8', fr: [2, 3, 5], m: mm => mm.l(16, 25, 13.6, 27.4, .3).l(13.6, 27.4, 15.4, 29.4, .3).l(15.4, 29.4, 12.6, 31.4, .3) });
        const wings = mm => mm.p([[16, 5.6], [3, 11], [2.2, 14.4], [16, 13.4]]).p([[16, 5.6], [29, 11], [29.8, 14.4], [16, 13.4]]);
        a({ g: 'wing', c: P.w, round: 1, m: wings });
        fl('wing', P.p, mm => wings(mm).and(t => t.l(4, 13, 14.6, 8, .5).l(28, 13, 17.4, 8, .5)));
        fl('wing', P.b, mm => mm.e(8.6, 11.6, 1.2, .8).e(23.4, 11.6, 1.2, .8).e(11.6, 10.4, .8, .6).e(20.4, 10.4, .8, .6));
        const moon = mm => mm.e(16, 22, 8.4, 4.6).sub(t => t.e(16, 19.4, 7.4, 3.8));
        a({ g: 'body', c: P.w, round: 1, m: moon });
        fl('body', P.b, mm => moon(mm).and(t => t.r(0, 24.4, 32, .7)));
        a({ g: 'body', c: dk(P.w, .35), m: mm => mm.r(15.4, 4.6, 1.2, 20) });
        a({ g: 'face', c: P.b, round: 3, m: mm => mm.e(16, 10.4, 3.4, 4) });
        fl('face', P.p, mm => mm.p([[16, 5.2], [17.2, 7], [16, 7.8], [14.8, 7]]));
        return { eyes: [[14.6, 10.2], [17.4, 10.2]], er: .9, iris: '#1E1A2E', browC: dk(P.b, .5), lidC: P.b, mouth: { x: 16, y: 12.6, w: 1.4 }, threeOK: false, head: { cx: 16, top: 5, w: 3.4 }, hand: null, floaty: true, gear: [] };
      }
    },
    /* CLOUD SHEEP: a fluffy sheep made of cloud, with curly horns, little black legs and a dreamy face */
    sheep: {
      pals: [{ w: '#F6F4FA', f: '#3A3448', h: '#D8C49A' }, { w: '#FFE8F4', f: '#5A3A4A', h: '#F2C14E' }, { w: '#E8F4FF', f: '#2E3A56', h: '#B8C2CC' }, { w: '#FFF8E0', f: '#4A3A2A', h: '#E8A07A' }],
      draw(h, P, m) {
        const { a, fl } = h, sh = mix(P.w, '#8A9AC9', .25);
        a({ g: 'feet', c: P.f, m: mm => mm.l(12.4, 21, 12, 25.4, .9).l(15.6, 21.4, 15.6, 25.8, .9).l(19.6, 21.4, 20, 25.8, .9).l(22.6, 21, 23.2, 25.2, .9) });
        const wool = mm => mm.e(17.6, 16.8, 7.4, 4.8).e(12.4, 15.4, 3.2, 3).e(17, 12.6, 3.6, 3).e(22.4, 14, 3.2, 3).e(24.4, 18, 2.6, 2.6).e(13.4, 19.6, 3, 2.4).e(19.6, 21, 3.4, 2.4);
        a({ g: 'body', c: P.w, round: 6, m: wool });
        fl('body', sh, mm => wool(mm).and(t => t.r(0, 20.4, 32, 6)));
        fl('body', '#FFFFFF', mm => mm.e(16, 11.6, 1.4, .8).e(21.6, 13, 1, .6));
        a({ g: 'face', c: P.h, gloss: 1, m: mm => mm.e(11.8, 12.2, 1.6, 1.6).sub(t => t.e(11.8, 12.2, .8, .8)) });
        a({ g: 'face', c: P.f, round: 3, m: mm => mm.e(9.6, 15.4, 3, 3.4).e(7, 13.8, 1.4, .8) });
        fl('face', mix(P.f, '#F28AB0', .5), mm => mm.e(8.2, 17.4, .6, .4));
        h.spark('float', '#FFFFFF', [[4, 6, [0, 2]], [28, 6, [1, 3]], [27, 24, [2, 0]]]);
        return { eyes: [[8.6, 14.8], [10.8, 14.8]], er: .75, iris: '#FFFFFF', glow: '#F6F4FA', brows: false, mouth: { x: 9.6, y: 17.2, w: 1.1 }, threeOK: false, head: { cx: 10, top: 11.4, w: 3 }, hand: null, floaty: true, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* TEAPOT SPIRIT: a round painted teapot with a face, a curly spout, a shiny lid and puffs of steam */
    teapot: {
      pals: [{ c: '#F4F0E8', p: '#3E7AC9', k: GOLD }, { c: '#E86F9A', p: '#FFFFFF', k: GOLD }, { c: '#4E9A7A', p: '#F2C14E', k: '#F2EAD8' }, { c: '#F2C14E', p: '#C9453A', k: '#B8C2CC' }],
      draw(h, P, m) {
        const { a, fl } = h;
        a({ g: 'back', c: P.c, gloss: 1, m: mm => mm.e(25, 18, 3.4, 4).sub(t => t.e(25, 18, 1.9, 2.6)) });
        a({ g: 'feet', c: dk(P.c, .3), m: mm => mm.e(12.4, 28.4, 2, .9).e(19.6, 28.4, 2, .9) });
        a({ g: 'weap', c: P.c, gloss: 1, m: mm => mm.p([[9.6, 20.6], [5.4, 15.4], [3.4, 11.6], [4.6, 11.2], [7, 14], [10.6, 17.4]]) });
        const body = mm => mm.e(16, 20, 8.2, 7);
        a({ g: 'body', c: P.c, gloss: 1, round: 6, m: body });
        fl('body', P.p, mm => body(mm).and(t => t.r(0, 22.6, 32, 1.2)));
        fl('body', P.p, mm => { [[11, 25.4], [16, 26], [21, 25.4]].forEach(([x, y]) => { for (let i = 0; i < 5; i++) { const q = i * Math.PI * 2 / 5; mm.e(x + Math.cos(q) * .8, y + Math.sin(q) * .8, .45, .45); } }); });
        a({ g: 'face', c: dk(P.c, .12), gloss: 1, m: mm => mm.e(16, 13.2, 5.4, 1.7) });
        a({ g: 'face', c: P.k, gloss: 1, m: mm => mm.e(16, 11, 1.3, 1.3) });
        a({ g: 'float', c: '#FFFFFF', fr: [0, 1, 4], m: mm => mm.e(3.6, 9, 1.4, 1).e(4.6, 6.4, 1.1, .9) });
        a({ g: 'float', c: '#FFFFFF', fr: [2, 3, 5], m: mm => mm.e(4.2, 8.4, 1.2, 1).e(3.2, 5.6, 1.3, 1) });
        return { eyes: [[13.4, 18], [18.6, 18]], er: 1.1, iris: '#3A2A1E', browC: dk(P.c, .55), lidC: P.c, mouth: { x: 16, y: 21.4, w: 2 }, head: { cx: 16, top: 9.6, w: 5 }, hand: null, gear: [] };
      }
    }
  };
  Object.assign(BEAST.species, more);
})();
