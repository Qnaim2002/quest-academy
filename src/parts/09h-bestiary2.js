/* ================= v22: the bestiary grows — ten more species =================
   Jelly Squid (sea), Cactus Brute (desert), Vampire Bat (night), Pumpkin Knight (harvest),
   Snow Yeti (ice), Thunderbird (storm), Robo Crab (construct), Shell Knight (turtle),
   Bee Queen (insect) and Dino Rex (dinosaur). Same kit and API as 09f; they join BEAST.species and the
   third species mapping MALT2 in 03, so every level's monster stays one of a kind.
   Monsters face LEFT toward the hero; the design space is 32 x 32 with the ground at y = 30. */
(() => {
  const { mix, dk, lt } = PX.kit;
  const { GOLD, STEEL, IRON, BONE, WOOD, LEATHER, INK, MOUTH, TEETH, TONGUE } = MON2.kit;
  const SWAY_A = [0, 1, 4], SWAY_B = [2, 3, 5];
  const more = {
    /* JELLY SQUID: a see-through dome with glowing spots and six curling tentacles that sway */
    squid: {
      pals: [{ b: '#E87AB8', s: '#FFC8E6', d: '#A8407A', g: '#FFF08F' }, { b: '#6FB8F2', s: '#CDEBFF', d: '#2E6AA8', g: '#8FF2E8' }, { b: '#9A7AF2', s: '#DCCFFF', d: '#5A3EA8', g: '#FFB8F2' }, { b: '#5FD8A8', s: '#CFFFEA', d: '#2E8A6A', g: '#FFE08F' }],
      draw(h, P, m) {
        const { a, fl } = h, bd = P.b;
        for (let i = 0; i < 6; i++) {
          const x = 8.6 + i * 2.95, s = i % 2 ? 1 : -1;
          a({ g: 'tail', c: i % 2 ? bd : dk(bd, .12), fr: SWAY_A, m: mm => mm.l(x, 17, x + s * 1.2, 23, 1.5).l(x + s * 1.2, 23, x - s * .4, 27.4, 1.2).e(x - s * .9, 27.8, .9, .9) });
          a({ g: 'tail', c: i % 2 ? bd : dk(bd, .12), fr: SWAY_B, m: mm => mm.l(x, 17, x - s * 1.2, 23, 1.5).l(x - s * 1.2, 23, x + s * .4, 27.4, 1.2).e(x + s * .9, 27.8, .9, .9) });
        }
        fl('tail', lt(bd, .45), mm => { for (let i = 0; i < 6; i++) mm.r(8.4 + i * 2.95, 19, .5, .5).r(8.4 + i * 2.95, 21.4, .5, .5); });
        const dome = mm => mm.e(16, 11.4, 8.4, 8).r(7.6, 11.4, 16.8, 6.4).sub(t => t.r(0, 17.8, 32, 14));
        a({ g: 'body', c: bd, round: 6, m: dome });
        a({ g: 'body', c: P.s, flat: true, sep: false, m: mm => mm.e(12.6, 7.2, 3.2, 2.2) });
        fl('body', '#FFFFFF', mm => mm.e(11.6, 6.6, 1.1, .7));
        a({ g: 'body', c: dk(bd, .22), sep: false, m: mm => mm.p([[7.6, 16.4], [24.4, 16.4], [24.4, 18], [22.4, 17.2], [20.4, 18.2], [18.2, 17.2], [16, 18.2], [13.8, 17.2], [11.6, 18.2], [9.6, 17.2], [7.6, 18]]) });
        a({ g: 'body', c: P.g, flat: true, sep: false, fr: [0, 2, 4, 5], m: mm => mm.e(20.6, 6.4, .9, .9).e(22.4, 10.4, .7, .7).e(9.2, 11.2, .6, .6) });
        a({ g: 'body', c: lt(P.g, .4), flat: true, sep: false, fr: [1, 3], m: mm => mm.e(20.6, 6.4, 1.1, 1.1).e(22.4, 10.4, .9, .9).e(9.2, 11.2, .8, .8) });
        h.dot('float', lt(bd, .6), [[4.4, 8, [0, 1]], [27.4, 4.6, [2, 3]], [26.6, 20, [1, 2]]]);
        return { eyes: [[12.8, 12.6], [18.6, 12.6]], er: 1.55, iris: P.d, browC: dk(bd, .55), lidC: bd, mouth: { x: 15.6, y: 15.8, w: 1.7 }, threeOK: true, cyclopsOK: true, head: { cx: 16, top: 3.4, w: 7.4 }, hand: null, floaty: true, gear: ['hat'], hats: ['crown', 'hood'] };
      }
    },
    /* CACTUS BRUTE: a tall prickly cactus with flexing arms, a desert flower and a spiked club */
    cactus: {
      pals: [{ g: '#4E9A4E', d: '#2E6A3A', f: '#F28AB0', s: '#FFF6C8' }, { g: '#7AA83E', d: '#4A6A2A', f: '#F2C14E', s: '#FFFFFF' }, { g: '#3E8A7A', d: '#245A4E', f: '#FF7A5A', s: '#F2EDE0' }, { g: '#8AA85A', d: '#5A6A3A', f: '#C97FFF', s: '#FFF6C8' }],
      draw(h, P, m) {
        const { a, fl } = h, cg = P.g, cd = P.d;
        a({ g: 'feet', c: cd, m: mm => mm.r(11.4, 25, 3.2, 4.2).r(17.6, 25, 3.2, 4.2) });
        a({ g: 'feet', c: '#B8703E', tex: 'stone', m: mm => mm.r(10.6, 28.4, 4.8, 1.8).r(16.8, 28.4, 4.8, 1.8) });
        a({ g: 'back', c: cg, round: 2, m: mm => mm.l(21.6, 15.4, 25.4, 15.4, 2.8).l(25.4, 15.6, 25.6, 9.4, 2.6).e(25.6, 9.2, 1.4, 1.4) });
        const col = mm => mm.r(10, 7.6, 12, 18.6).e(16, 7.8, 6, 4.4);
        a({ g: 'body', c: cg, round: 4, m: col });
        fl('body', cd, mm => col(mm).and(t => t.r(12.6, 0, .4, 32).r(16, 13, .4, 32).r(19.4, 0, .4, 32)));
        a({ g: 'body', c: lt(cg, .2), sep: false, m: mm => mm.e(13.6, 18.4, 2.2, 5) });
        fl('body', P.s, mm => { [[10.2, 9], [10.2, 14], [10.2, 19], [10.2, 24], [21.6, 11], [21.6, 16], [21.6, 21], [14.4, 22], [17.8, 19], [17.8, 25], [14.4, 4.4], [18, 4.2]].forEach(([x, y]) => mm.r(x - .6, y, 1, .34).r(x - .2, y - .4, .34, 1)); });
        a({ g: 'body', c: P.f, m: mm => { for (let i = 0; i < 5; i++) { const t = i * Math.PI * 2 / 5 - .3; mm.e(20.6 + Math.cos(t) * 1.3, 4.2 + Math.sin(t) * 1.3, .95, .95); } } });
        a({ g: 'body', c: GOLD, sep: false, m: mm => mm.e(20.6, 4.2, .75, .75) });
        a({ g: 'weap', c: cg, arm: 1, round: 2, m: mm => mm.l(10.4, 16, 6.6, 17.6, 2.8).l(6.6, 17.6, 6.4, 20.4, 2.4) });
        return { eyes: [[13.2, 10.6], [17.8, 10.6]], er: 1.2, iris: '#5A3A1E', browC: cd, lidC: cg, mouth: { x: 15.4, y: 14.2, w: 2.2 }, head: { cx: 16, top: 3.6, w: 5.6 }, neck: { x: 16, y: 15, w: 11 }, chest: { cx: 16, cy: 19, rx: 4.4, ry: 3 }, hand: { x: 6.2, y: 20.4 }, weapons: [0, 5], handC: cg, gear: ['hat', 'amulet', 'paint'], hats: ['crown', 'horned'] };
      }
    },
    /* VAMPIRE BAT: a furry little body, giant ears, a cape of leathery wings and two shiny fangs */
    bat: {
      pals: [{ f: '#5A4A6E', w: '#3A2A4E', i: '#E86F9A', e: '#F2503B' }, { f: '#6E5A4A', w: '#4A3A2A', i: '#E8A07A', e: '#F2C14E' }, { f: '#3E4A6E', w: '#2A2E4E', i: '#8AB8E8', e: '#8FF2B8' }, { f: '#8A4A6E', w: '#5A2A4A', i: '#F2A0C8', e: '#FFF08F' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, fu = P.f, wg = P.w;
        const wingL = (lift) => mm => mm.p([[12, 13], [7, 8 - lift], [2.4, 7.4 - lift], [.8, 12 - lift * .5], [2.6, 14.4], [4, 18.2], [6.4, 16.6], [8.4, 19.6], [10.4, 17.2], [12.4, 18]]);
        const wingR = (lift) => mm => mm.p([[20, 13], [25, 8 - lift], [29.6, 7.4 - lift], [31.2, 12 - lift * .5], [29.4, 14.4], [28, 18.2], [25.6, 16.6], [23.6, 19.6], [21.6, 17.2], [19.6, 18]]);
        a({ g: 'wing', c: wg, round: 2, fr: [0, 1, 4], m: mm => { wingL(0)(mm); wingR(0)(mm); } });
        a({ g: 'wing', c: wg, round: 2, fr: [2, 3, 5], m: mm => { wingL(2.6)(mm); wingR(2.6)(mm); } });
        fl('wing', lt(wg, .25), mm => mm.l(12, 13, 2.4, 8.4, .34).l(12, 13, 4, 17, .34).l(12, 13, 8.4, 18.4, .34).l(20, 13, 29.6, 8.4, .34).l(20, 13, 28, 17, .34).l(20, 13, 23.6, 18.4, .34), { fr: [0, 1, 4] });
        a({ g: 'feet', c: dk(fu, .3), m: mm => mm.l(14.4, 20, 13.8, 23, .9).l(17.6, 20, 18.2, 23, .9) });
        h.dot('feet', BONE, [[13.2, 23], [14.2, 23.2], [17.8, 23.2], [18.8, 23]]);
        a({ g: 'face', c: fu, m: mm => { tri(mm, 12.2, 9.4, 2, 6); tri(mm, 19.8, 9.4, 2, 6); } });
        fl('face', P.i, mm => { tri(mm, 12.2, 8.8, 1, 4); tri(mm, 19.8, 8.8, 1, 4); });
        a({ g: 'body', c: fu, tex: 'fur', round: 5, m: mm => mm.e(16, 15, 5.4, 5.8) });
        a({ g: 'body', c: lt(fu, .3), tex: 'fur', sep: false, m: mm => mm.e(16, 17.6, 3, 2.8) });
        fl('body', TEETH, mm => { tri(mm, 14.6, 17.6, .45, -1.4); tri(mm, 17, 17.6, .45, -1.4); });
        fl('body', '#FFFFFF', mm => mm.r(14.4, 16.6, .3, .3).r(16.8, 16.6, .3, .3));
        fl('body', dk(fu, .45), mm => mm.e(15.8, 14.8, .5, .35));
        return { eyes: [[13.6, 13], [18.2, 13]], er: 1.25, iris: P.e, browC: dk(fu, .5), lidC: fu, mouth: { x: 15.8, y: 16.6, w: 1.8 }, head: { cx: 16, top: 9.6, w: 5 }, hand: null, floaty: true, gear: ['hat'], hats: ['crown', 'hood'] };
      }
    },
    /* PUMPKIN KNIGHT: a carved, candle-lit pumpkin head on a little suit of armour, with a cape and a blade */
    pumpkin: {
      pals: [{ p: '#F28A2E', d: '#B8501E', c: '#5A2E6E', g: '#FFD54A' }, { p: '#E8C13E', d: '#A8781E', c: '#2E4A6E', g: '#FF8A3A' }, { p: '#9AC94E', d: '#5A8A2E', c: '#6E2E2E', g: '#C9FF8F' }, { p: '#E8E0C8', d: '#A89A7A', c: '#2E5A4A', g: '#7FE7F2' }],
      draw(h, P, m) {
        const { a, fl } = h, pk = P.p, pd = P.d, gl = P.g;
        a({ g: 'feet', c: STEEL, gloss: 1, m: mm => mm.l(13.4, 22, 12.6, 28.4, 2.2).l(18.4, 22, 19.4, 28.4, 2.2) });
        a({ g: 'feet', c: IRON, gloss: 1, m: mm => mm.p([[9.8, 30.4], [10.6, 28], [14, 28], [14.2, 30.4]]).p([[18, 30.4], [18.4, 28], [21.6, 28], [22.4, 30.4]]) });
        a({ g: 'body', c: STEEL, gloss: 1, m: mm => mm.l(19.6, 15, 22, 19.4, 1.8).e(22.4, 20, 1.3, 1.3) });
        const tor = mm => mm.p([[11.4, 14], [20.4, 14], [21, 19.4], [19.8, 23], [12, 23], [10.8, 19.4]]);
        a({ g: 'body', c: STEEL, tex: 'plate', gloss: 1, round: 3, m: tor });
        fl('body', dk(STEEL, .3), mm => tor(mm).and(t => t.r(15.8, 0, .34, 32).r(0, 18.6, 32, .34)));
        a({ g: 'body', c: LEATHER, sep: false, m: mm => mm.r(11, 21, 9.8, 1.4) });
        a({ g: 'body', c: GOLD, gloss: 1, sep: false, m: mm => mm.r(15, 20.8, 1.8, 1.8) });
        a({ g: 'face', c: '#3E6A2E', m: mm => mm.l(14.6, 4.6, 15.6, 2.2, 1.2).l(15.6, 2.2, 17.2, 1.8, .8) });
        const head = mm => mm.e(14.6, 9.2, 6, 4.8);
        a({ g: 'face', c: pk, round: 4, m: head });
        fl('face', pd, mm => head(mm).and(t => t.l(11.4, 5, 10.4, 13.6, .45).l(14.6, 4.4, 14.6, 14, .45).l(17.8, 5, 18.8, 13.6, .45)));
        a({ g: 'face', c: lt(pk, .3), sep: false, m: mm => mm.e(11.6, 7, 1.6, 1) });
        a({ g: 'face', c: '#2A1408', flat: true, m: mm => mm.p([[10.4, 10.8], [18.8, 10.8], [18, 12.4], [16.8, 11.8], [15.8, 13], [14.4, 11.8], [13, 13], [11.8, 11.8], [11.2, 12.4]]) });
        a({ g: 'face', c: gl, flat: true, sep: false, fr: [0, 2, 5], m: mm => mm.p([[11.4, 11.2], [17.8, 11.2], [17.4, 11.9], [16.6, 11.4], [15.8, 12.4], [14.4, 11.4], [13, 12.4], [12, 11.4]]) });
        a({ g: 'face', c: lt(gl, .4), flat: true, sep: false, fr: [1, 3], m: mm => mm.p([[11.4, 11.2], [17.8, 11.2], [17.4, 11.9], [16.6, 11.4], [15.8, 12.4], [14.4, 11.4], [13, 12.4], [12, 11.4]]) });
        a({ g: 'weap', c: STEEL, arm: 1, gloss: 1, m: mm => mm.l(12.2, 16, 8.2, 19.2, 1.9) });
        return { eyes: [[12, 8.6], [17, 8.6]], er: 1.1, eyeStyle: 'fixed', glow: gl, brows: false, noMouth: true, head: { cx: 14.6, top: 4.4, w: 6 }, chest: { cx: 15.8, cy: 18, rx: 3.6, ry: 2.6 }, hand: { x: 8, y: 19.4 }, weapons: [7, 3, 5], handC: STEEL, capeC: P.c, gear: ['cape', 'amulet'] };
      }
    },
    /* SNOW YETI: a huge shaggy snow-beast with a blue face, curled horns and frosty breath */
    yeti: {
      pals: [{ f: '#F2F4FA', s: '#7A9AC9', d: '#B8C4DA', e: '#5FC4F2' }, { f: '#E8DCC8', s: '#9A7A6A', d: '#C9B8A0', e: '#F2C14E' }, { f: '#D8E8F2', s: '#6A8AA8', d: '#9AB4C9', e: '#8FF2B8' }, { f: '#E0D8F2', s: '#8A7AB8', d: '#B8ACD8', e: '#F28AB0' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, fu = P.f, fd = P.d, sk = P.s;
        a({ g: 'feet', c: fu, tex: 'fur', m: mm => mm.l(12.4, 22, 11.4, 28.2, 3.8).l(20, 22, 21, 28.2, 3.8) });
        a({ g: 'feet', c: sk, m: mm => mm.e(10.6, 29.4, 2.8, 1.2).e(21.6, 29.4, 2.8, 1.2) });
        a({ g: 'body', c: fd, tex: 'fur', m: mm => mm.l(22, 13.6, 25.6, 19, 3.4).e(25.8, 21, 2.2, 2.2) });
        const tor = mm => mm.e(16.4, 18, 8.2, 7.6);
        a({ g: 'body', c: fu, tex: 'fur', round: 6, m: tor });
        a({ g: 'body', c: mix(fu, sk, .18), tex: 'fur', sep: false, m: mm => mm.e(15.4, 19.6, 4.4, 4.8) });
        fl('body', fd, mm => { for (let i = 0; i < 6; i++) tri(mm, 9.4 + i * 2.8, 25.8, .9, -1.6); });
        a({ g: 'face', c: dk(fd, .25), gloss: 1, m: mm => mm.l(10.2, 6.4, 8.4, 3.4, 1.2).l(8.4, 3.4, 9.8, 1.8, .9).l(17.8, 6.4, 19.6, 3.4, 1.2).l(19.6, 3.4, 18.2, 1.8, .9) });
        a({ g: 'face', c: fu, tex: 'fur', round: 4, m: mm => mm.e(14, 9.2, 5.6, 5) });
        a({ g: 'face', c: sk, round: 3, m: mm => mm.e(13.4, 10.4, 3.8, 3.2) });
        a({ g: 'face', c: fu, tex: 'fur', sep: false, m: mm => mm.p([[9, 7.6], [11, 6.4], [13.4, 7.6], [15.6, 6.4], [18, 7.6], [17.6, 5], [10, 5]]) });
        a({ g: 'weap', c: fu, arm: 1, tex: 'fur', m: mm => mm.l(10.6, 14.6, 6.4, 19, 3.4).e(5.8, 20.2, 2.3, 2.3) });
        h.dot('weap', '#FFFFFF', [[4.2, 21.6], [5.4, 22.2], [6.8, 21.8]]);
        a({ g: 'float', c: '#E8F4FF', flat: true, sep: false, fr: [5], m: mm => mm.e(7.4, 12.8, 1.6, .9).e(5, 12.2, 1.2, .8).e(3.2, 11.4, .8, .6) });
        h.spark('float', '#FFFFFF', [[4, 4, [0, 1]], [27, 6, [2, 3]], [28.4, 24, [1, 2]], [3, 26, [3, 0]]]);
        return { eyes: [[11.8, 9.8], [15.2, 9.8]], er: 1, iris: P.e, browC: dk(sk, .45), lidC: sk, mouth: { x: 13.4, y: 12.4, w: 2.4 }, head: { cx: 14, top: 4.4, w: 5.4 }, neck: { x: 14, y: 14, w: 8 }, chest: { cx: 15.4, cy: 19.4, rx: 4.4, ry: 4 }, hand: null, gear: ['hat', 'amulet'], hats: ['crown', 'hood'] };
      }
    },
    /* THUNDERBIRD: a storm eagle with lightning feathers, a hooked beak and sparks crackling around it */
    thunderbird: {
      pals: [{ b: '#3E6AC9', w: '#F2C14E', l: '#FFF08F', e: '#FFFFFF' }, { b: '#6E3EC9', w: '#7FE7F2', l: '#CFFFFF', e: '#FFF08F' }, { b: '#C93E3E', w: '#F2A03D', l: '#FFE08F', e: '#FFFFFF' }, { b: '#2E8A7A', w: '#E8F2F8', l: '#FFFFFF', e: '#F2C14E' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, bd = P.b, wg = P.w;
        const wing = up => mm => mm.p([[17, 13], [21, 5 - up], [25.4, 1.6 - up], [27.4, 4 - up], [30.8, 4.6 - up], [29.2, 8.2 - up * .5], [31, 10.6 - up * .4], [27.4, 12.6], [28, 15.6], [23.4, 16.6]]);
        a({ g: 'wing', c: wg, tex: 'feather', round: 2, fr: [0, 1, 4], m: wing(0) });
        a({ g: 'wing', c: wg, tex: 'feather', round: 2, fr: [2, 3, 5], m: wing(2.4) });
        fl('wing', bd, mm => mm.l(18.6, 12.4, 25.4, 3, .5).l(20, 13.6, 29.4, 6, .45).l(21.4, 15, 29.6, 11, .45), { fr: [0, 1, 4] });
        a({ g: 'tail', c: bd, tex: 'feather', m: mm => mm.p([[19.6, 20], [27.6, 24.4], [28.6, 27], [25.6, 26.4], [26, 28.6], [22.6, 26.4], [18.6, 23]]) });
        fl('tail', wg, mm => mm.l(20.4, 21.6, 26.6, 25.8, .45));
        a({ g: 'feet', c: GOLD, m: mm => mm.l(14.6, 22, 14, 27.6, 1).l(18, 22, 18.6, 27.6, 1) });
        h.dot('feet', INK, [[12.8, 27.8], [13.8, 28.2], [18, 28.2], [19, 27.8]]);
        const tor = mm => mm.e(16.6, 17.4, 5.4, 6);
        a({ g: 'body', c: bd, tex: 'feather', round: 5, m: tor });
        a({ g: 'body', c: lt(bd, .45), tex: 'feather', sep: false, m: mm => mm.e(14.8, 19, 2.8, 3.8) });
        a({ g: 'body', c: P.l, flat: true, sep: false, m: mm => mm.p([[15.4, 15], [13.6, 18.6], [15.2, 18.6], [14, 22.2], [16.8, 17.6], [15.2, 17.6], [16.6, 15]]) });
        a({ g: 'face', c: wg, m: mm => mm.p([[12, 6.8], [13.6, 2.6], [14.4, 5.4], [16.2, 2.2], [16.4, 6], [18.4, 4.4], [17, 8.6]]) });
        a({ g: 'face', c: bd, tex: 'feather', round: 3, m: mm => mm.e(13, 9.8, 3.8, 3.4).l(14, 11.6, 15.6, 14, 2.6) });
        a({ g: 'face', c: GOLD, gloss: 1, m: mm => mm.p([[10, 9], [6, 9.6], [5, 11.2], [6, 12.4], [6.4, 11.2], [10.2, 12]]) });
        fl('face', dk(GOLD, .4), mm => mm.l(6.6, 10.8, 9.6, 10.8, .34));
        a({ g: 'weap', c: bd, tex: 'feather', arm: 1, m: mm => mm.p([[13.4, 14], [6.4, 16.6], [4.4, 19.4], [7, 19], [6.6, 21], [9.2, 19.6], [13.6, 18.6]]) });
        a({ g: 'float', c: P.l, flat: true, fr: [0, 2, 5], m: mm => mm.l(4.4, 3, 3, 5.4, .45).l(3, 5.4, 4.6, 5.4, .45).l(4.6, 5.4, 3.2, 8, .45).l(27.6, 18.6, 26.6, 20.4, .45).l(26.6, 20.4, 27.8, 20.4, .45).l(27.8, 20.4, 26.8, 22.4, .45) });
        h.spark('float', P.l, [[2.6, 22, [1, 3]], [29.6, 1.6, [1, 3]]]);
        return { profile: true, eyes: [[11.8, 9.2]], er: 1, iris: P.e, browC: dk(bd, .5), lidC: bd, noMouth: true, head: { cx: 13, top: 6.4, w: 3.6 }, hand: null, floaty: true, gear: ['hat'], hats: ['crown'] };
      }
    },
    /* ROBO CRAB: a riveted metal crab with periscope eyes, one giant pincer and a blinking antenna */
    crab: {
      pals: [{ s: '#D8603E', d: '#8A3A2A', g: '#7FE7F2' }, { s: '#9AA8B8', d: '#5A6A7A', g: '#F2C14E' }, { s: '#3E9AC9', d: '#2A5A8A', g: '#8FF2B8' }, { s: '#C9A83E', d: '#7A5A2A', g: '#F2503B' }],
      draw(h, P, m) {
        const { a, fl } = h, sh = P.s, sd = P.d;
        for (let i = 0; i < 3; i++) {
          const x = 10 + i * 2.6, X = 22 - i * 2.6;
          a({ g: 'feet', c: sd, gloss: 1, m: mm => mm.l(x + 1, 23, x - 1.6, 26.4, 1).l(x - 1.6, 26.4, x - 2.2, 29.6, .8).l(X - 1, 23, X + 1.6, 26.4, 1).l(X + 1.6, 26.4, X + 2.2, 29.6, .8) });
        }
        a({ g: 'back', c: sd, gloss: 1, m: mm => mm.l(23, 19, 26, 16.6, 1.3).e(27, 15.4, 2, 1.8) });
        a({ g: 'back', c: sh, gloss: 1, m: mm => mm.p([[26, 14], [29.6, 12.6], [29.8, 14.2], [27.6, 15.4]]).p([[26.4, 16.6], [30, 17], [29, 18.2], [27.4, 17.4]]) });
        a({ g: 'body', c: IRON, gloss: 1, m: mm => mm.r(12.6, 9.6, 1, 6).r(18.4, 9.6, 1, 6) });
        const shell = mm => mm.e(16, 20, 9.2, 5).r(6.8, 20, 18.4, 3.4);
        a({ g: 'body', c: sh, gloss: 1, round: 4, m: shell });
        fl('body', sd, mm => shell(mm).and(t => t.r(0, 21.6, 32, .4)));
        fl('body', lt(sh, .55), mm => { for (let i = 0; i < 6; i++) mm.r(8.6 + i * 2.9, 22.4, .5, .5); });
        a({ g: 'body', c: '#1E2228', sep: false, m: mm => mm.r(11, 17.2, 10, 2.4) });
        a({ g: 'body', c: P.g, flat: true, sep: false, fr: [0, 2, 4, 5], m: mm => mm.r(11.6, 17.8, 1.4, 1.2).r(14, 17.8, 1.4, 1.2).r(16.4, 17.8, 1.4, 1.2).r(18.8, 17.8, 1.4, 1.2) });
        a({ g: 'body', c: P.g, flat: true, sep: false, fr: [1, 3], m: mm => mm.r(11.6, 17.8, 3.8, 1.2).r(16.4, 17.8, 3.8, 1.2) });
        a({ g: 'face', c: IRON, m: mm => mm.r(15.8, 11.4, .6, 4) });
        a({ g: 'face', c: P.g, flat: true, fr: [0, 1, 5], m: mm => mm.e(16.1, 11, .8, .8) });
        a({ g: 'face', c: dk(P.g, .4), flat: true, fr: [2, 3, 4], m: mm => mm.e(16.1, 11, .8, .8) });
        a({ g: 'face', c: STEEL, gloss: 1, m: mm => mm.e(13.1, 9, 2, 2).e(18.9, 9, 2, 2) });
        a({ g: 'weap', c: sd, gloss: 1, arm: 1, m: mm => mm.l(8, 20, 5, 16.6, 1.4) });
        a({ g: 'weap', c: sh, gloss: 1, round: 2, m: mm => mm.e(4.4, 14.4, 3.2, 2.8).p([[2, 13], [.6, 8.6], [3.4, 9.4], [4.6, 12.2]]) });
        a({ g: 'weap', c: sh, gloss: 1, fr: [0, 1, 2, 3, 4], m: mm => mm.p([[5.6, 12.2], [6.8, 8.2], [8, 9.2], [7.6, 12.8]]) });
        a({ g: 'weap', c: sh, gloss: 1, fr: [5], m: mm => mm.p([[5.6, 12.2], [8.6, 9.6], [9.4, 11], [7.4, 13]]) });
        fl('weap', lt(sh, .5), mm => mm.r(3.2, 15.4, .5, .5).r(5.2, 15.8, .5, .5));
        return { eyes: [[13.1, 9], [18.9, 9]], er: 1.2, eyeStyle: 'fixed', iris: P.g, brows: false, noMouth: true, head: { cx: 16, top: 6.6, w: 5 }, hand: null, gear: ['hat'], hats: ['crown', 'helm'] };
      }
    },
    /* SHELL KNIGHT: an upright turtle in a domed, plated shell with a helmet visor and a spear */
    turtle: {
      pals: [{ k: '#7AB84E', s: '#8A5A2E', p: '#C9A86A', b: '#F2E0A8' }, { k: '#5FA8A0', s: '#3E5A7A', p: '#7AA0C9', b: '#E0F0E8' }, { k: '#A8B84E', s: '#6E3E2E', p: '#B87A4E', b: '#F2E8C8' }, { k: '#8AC97A', s: '#5A4A6E', p: '#9A88C9', b: '#F0E8FF' }],
      draw(h, P, m) {
        const { a, fl } = h, sk = P.k, sd = dk(sk, .28);
        const shell = mm => mm.e(19.4, 17.6, 6.6, 7.6);
        a({ g: 'back', c: P.s, round: 5, m: shell });
        fl('back', P.p, mm => mm.p([[19, 12], [22.4, 13.6], [22.4, 17.4], [19, 19], [15.8, 17.4], [15.8, 13.6]]).p([[23.6, 19], [25.6, 20.6], [24.4, 23.6], [21.6, 22.8]]).p([[23.8, 11], [25.4, 13.4], [24, 16], [23.2, 13.2]]));
        fl('back', dk(P.s, .3), mm => shell(mm).sub(t => t.e(19.4, 17.6, 5.8, 6.8)));
        a({ g: 'feet', c: sk, m: mm => mm.l(13.6, 22, 13, 28.4, 2.6).l(18.2, 22, 18.8, 28.4, 2.6) });
        a({ g: 'feet', c: sd, m: mm => mm.e(12.4, 29.2, 2.2, 1.1).e(19, 29.2, 2.2, 1.1) });
        h.dot('feet', BONE, [[10.6, 29.4], [17.2, 29.4]]);
        const tor = mm => mm.e(15.2, 18.4, 4.6, 5.4);
        a({ g: 'body', c: sk, round: 4, m: tor });
        a({ g: 'body', c: P.b, sep: false, m: mm => mm.e(14.6, 19, 3.2, 4.4) });
        fl('body', dk(P.b, .25), mm => mm.e(14.6, 19, 3.2, 4.4).and(t => t.r(0, 16.6, 32, .34).r(0, 19.2, 32, .34).r(0, 21.8, 32, .34)));
        a({ g: 'face', c: sk, round: 3, m: mm => mm.e(12.4, 10, 3.8, 3.4).r(11.4, 12, 3.4, 3) });
        a({ g: 'face', c: STEEL, gloss: 1, round: 2, m: mm => mm.e(12.8, 8, 4.2, 2.6).sub(t => t.r(0, 8.4, 32, 6)) });
        a({ g: 'face', c: '#C2403A', m: mm => mm.l(15.4, 5.4, 18.6, 4, 1).l(18.6, 4, 20, 5.6, .8) });
        fl('face', dk(sk, .4), mm => mm.l(9.4, 11.6, 10.6, 11.2, .34));
        a({ g: 'weap', c: sk, arm: 1, m: mm => mm.l(12.6, 16, 8.4, 18.8, 1.8) });
        return { eyes: [[11, 9.8], [14, 9.8]], er: .95, iris: '#5A3A1E', browC: dk(sk, .55), lidC: sk, mouth: { x: 11.6, y: 12.4, w: 1.8 }, head: { cx: 12.6, top: 5.4, w: 4 }, chest: { cx: 14.6, cy: 18, rx: 3, ry: 3 }, hand: { x: 8, y: 19 }, weapons: [2, 6, 3], handC: sk, capeC: '#C2403A', gear: ['amulet', 'scar'] };
      }
    },
    /* BEE QUEEN: a fuzzy striped queen bee with buzzing glass wings, a stinger and a honey-dipper sceptre */
    bee: {
      pals: [{ y: '#F2C12E', k: '#3A2A1E', w: '#DFF4FF', h: '#F28A2E' }, { y: '#F2A0C8', k: '#5A2A4A', w: '#FFF0FA', h: '#E86F9A' }, { y: '#8FD8F2', k: '#1E3A5A', w: '#F0FFFF', h: '#3E9AC9' }, { y: '#C9F27A', k: '#2A3A1E', w: '#F4FFE8', h: '#7AB83E' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, yl = P.y, bk = P.k;
        const wings = up => mm => mm.p([[17.4, 12.6], [19.6, 6.6 - up], [23, 3.4 - up], [25.6, 4.2 - up], [24.6, 8.4 - up * .6], [20.4, 12.8]]).p([[18.6, 14], [24, 11.6 - up * .5], [27.4, 12.4 - up * .4], [26.4, 14.8], [21, 15.4]]);
        const wc = mix(P.w, '#9AC9E8', .3);
        a({ g: 'wing', c: wc, flat: true, round: 2, fr: [0, 2, 4], m: wings(0) });
        a({ g: 'wing', c: wc, flat: true, round: 2, fr: [1, 3, 5], m: wings(1.8) });
        fl('wing', '#FFFFFF', mm => mm.p([[19.4, 9.6], [21.6, 6], [23.6, 4.8], [22, 7.8]]), { fr: [0, 2, 4] });
        fl('wing', dk(wc, .3), mm => mm.l(18, 12.4, 23.6, 4.6, .3).l(19.6, 10, 24.6, 7.6, .3).l(19.4, 14.2, 26.6, 12.8, .3), { fr: [0, 2, 4] });
        const abd = mm => mm.e(20.6, 20.4, 5.6, 5);
        a({ g: 'tail', c: yl, tex: 'fur', round: 4, m: abd });
        fl('tail', bk, mm => abd(mm).and(t => t.r(18, 0, 1.6, 32).r(21.6, 0, 1.6, 32).r(25.2, 0, 1.6, 32)));
        a({ g: 'tail', c: bk, m: mm => mm.p([[25.6, 22], [29.4, 24.4], [25.2, 24.4]]) });
        a({ g: 'feet', c: bk, m: mm => mm.l(13.4, 20.6, 12.6, 27.6, .9).l(16.6, 21, 17, 27.6, .9) });
        a({ g: 'feet', c: bk, m: mm => mm.e(12.2, 28, 1.1, .6).e(17.4, 28, 1.1, .6) });
        a({ g: 'body', c: yl, tex: 'fur', round: 3, m: mm => mm.e(15, 16.2, 3.8, 4) });
        a({ g: 'body', c: lt(yl, .45), tex: 'fur', sep: false, m: mm => mm.e(14.4, 15, 2.2, 1.4) });
        a({ g: 'body', c: bk, m: mm => mm.l(17.6, 16, 20, 18.4, 1).e(20.2, 18.6, .8, .8) });
        a({ g: 'face', c: bk, m: mm => mm.l(12, 6.4, 10, 2.6, .5).l(15.2, 6, 16.6, 2.4, .5) });
        a({ g: 'face', c: yl, m: mm => mm.e(9.8, 2.4, .9, .9).e(16.8, 2.2, .9, .9) });
        a({ g: 'face', c: yl, round: 3, m: mm => mm.e(13.6, 9.6, 3.8, 3.6) });
        fl('face', mix(yl, '#FF6F7E', .35), mm => mm.e(11.2, 11.4, .8, .5).e(16, 11.4, .8, .5));
        a({ g: 'weap', c: bk, arm: 1, m: mm => mm.l(12.6, 15, 8.8, 18, .95) });
        return { eyes: [[12.2, 9.4], [15.4, 9.4]], er: 1.15, iris: '#3A2A10', browC: bk, lidC: yl, mouth: { x: 13.6, y: 11.8, w: 1.6 }, head: { cx: 13.6, top: 6, w: 3.8 }, neck: { x: 14, y: 13, w: 4 }, chest: { cx: 15, cy: 16.4, rx: 2.6, ry: 2.4 }, hand: { x: 8.6, y: 18.4 }, weapons: [4], gemC: P.h, handC: bk, floaty: true, gear: ['hat', 'amulet'], hats: ['crown'] };
      }
    },
    /* DINO REX: a big-headed T. rex with a toothy jaw, tiny arms, back plates and a heavy tail */
    rex: {
      pals: [{ s: '#5FA84E', d: '#3E6A2E', b: '#E0E8A8', p: '#F28A2E', e: '#F2C14E' }, { s: '#C9603E', d: '#7A3A2A', b: '#F2D8B8', p: '#F2C14E', e: '#FFF08F' }, { s: '#4E7AC9', d: '#2E4A7A', b: '#D8E8F8', p: '#8FF2E8', e: '#F2C14E' }, { s: '#8A5AC9', d: '#4E2E7A', b: '#E8D8F8', p: '#F28AB0', e: '#8FF2B8' }],
      draw(h, P, m) {
        const { a, fl, tri } = h, sk = P.s, sd = P.d;
        a({ g: 'tail', c: sk, tex: 'scale', round: 3, m: mm => mm.p([[20, 15], [27, 17.6], [31.4, 22.4], [30.6, 23.4], [25, 22], [20, 22]]) });
        a({ g: 'back', c: P.p, m: mm => { [[13.6, 8.2], [16.8, 10.6], [19.8, 12.6], [22.8, 14.6], [25.6, 16.6]].forEach(([x, y], i) => tri(mm, x, y + 1.4, 1.3 - i * .1, 2.6 - i * .2)); } });
        a({ g: 'feet', c: sd, tex: 'scale', m: mm => mm.e(19.6, 22, 3.4, 3.6).l(20.6, 24, 21.4, 29, 2) });
        a({ g: 'feet', c: sk, tex: 'scale', m: mm => mm.e(15, 22, 3.6, 3.8).l(14.6, 24.6, 13.4, 29, 2.2) });
        a({ g: 'feet', c: sd, m: mm => mm.e(12.4, 29.6, 2.2, .9).e(21, 29.6, 2, .9) });
        h.dot('feet', BONE, [[10.2, 29.6], [11.2, 30], [19, 29.8]]);
        const tor = mm => mm.e(17.4, 17.2, 6.2, 5.6);
        a({ g: 'body', c: sk, tex: 'scale', round: 5, m: tor });
        a({ g: 'body', c: P.b, sep: false, m: mm => mm.e(14.8, 19.4, 3.2, 3.6) });
        fl('body', dk(P.b, .2), mm => mm.e(14.8, 19.4, 3.2, 3.6).and(t => t.r(0, 18, 32, .34).r(0, 20.4, 32, .34)));
        a({ g: 'body', c: sk, m: mm => mm.l(12.4, 15.8, 9.6, 17.6, 1).l(9.6, 17.6, 9.4, 18.8, .8) });
        h.dot('body', BONE, [[8.8, 18.8]]);
        a({ g: 'face', c: sk, tex: 'scale', round: 3, m: mm => mm.p([[14.4, 5.4], [7.4, 4.8], [3, 6.6], [2, 9.6], [2.4, 11], [14.6, 11.4], [15.6, 8]]) });
        a({ g: 'face', c: sd, sep: false, m: mm => mm.l(9.4, 6.4, 12.4, 6, .7) });
        a({ g: 'face', c: INK, m: mm => mm.e(3.6, 7.6, .55, .45) });
        fl('face', TEETH, mm => { for (let i = 0; i < 5; i++) tri(mm, 3.4 + i * 1.8, 11.2, .4, -1.1); });
        a({ g: 'jaw', c: sk, tex: 'scale', round: 2, m: mm => mm.p([[3, 11.4], [14.6, 11.4], [14, 14.2], [5.6, 13.6], [3.4, 12.6]]) });
        a({ g: 'jaw', c: P.b, sep: false, m: mm => mm.p([[5, 13], [13.6, 13.2], [13.4, 14], [6, 13.6]]) });
        fl('jaw', TEETH, mm => { for (let i = 0; i < 4; i++) tri(mm, 4.6 + i * 2, 11.6, .38, 1); });
        a({ g: 'jaw', c: MOUTH, flat: true, fr: [5], m: mm => mm.p([[3.2, 11.4], [14, 11.4], [13.4, 12.6], [5, 12.6]]) });
        fl('jaw', TONGUE, mm => mm.e(8.4, 12.2, 2.4, .5), { fr: [5] });
        return { profile: true, eyes: [[10.6, 7.6]], er: 1, iris: P.e, browC: sd, lidC: sk, noMouth: true, head: { cx: 10, top: 4.8, w: 4.4 }, hand: null, gear: ['hat', 'scar'], hats: ['crown', 'helm'] };
      }
    }
  };
  Object.assign(BEAST.species, more);
})();
