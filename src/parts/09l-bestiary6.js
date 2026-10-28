/* ================= v38: ten more species (MALT6) =================
   Firefly, Pangolin, Hornbill, Sea Turtle, Paper Lantern, Pineapple Guard, Rainbow Snail, Cloud Dragon,
   Coconut Crab and Moon Rabbit. They join BEAST.species; the mapping MALT6 in 03 picks one for about one
   ordinary level in seven. Same kit and API as 09k. Monsters face LEFT; 32 x 32. */
(() => {
  const { mix, dk, lt } = PX.kit;
  const { INK } = MON2.kit;
  const more = {
    /* FIREFLY: a round glowing tail, little wings, two antennae */
    firefly: {
      pals: [{ b: '#4A3E6A', g: '#F2F26A', w: '#CFE8F8' }, { b: '#3E5A4A', g: '#8AF2A8', w: '#D8F8E8' }, { b: '#6A3E4A', g: '#F2A86A', w: '#F8E4D4' }, { b: '#3E4A8A', g: '#8AD8F2', w: '#E0ECFF' }],
      draw(h, P) {
        const { a, fl } = h;
        a({ g: 'back', c: P.w, m: mm => mm.e(20, 12, 5, 8).e(25, 14, 4, 6) });
        a({ g: 'body', c: P.b, round: 5, gloss: 1, m: mm => mm.e(14, 17, 7, 7) });
        a({ g: 'body', c: P.g, round: 6, gloss: 1, m: mm => mm.e(23.4, 21, 5.4, 5.6) });
        fl('body', lt(P.g, .6), mm => mm.e(22, 19.4, 1.8, 1.4));
        a({ g: 'head', c: P.b, round: 4, m: mm => mm.e(10, 14, 5.6, 5.4) });
        a({ g: 'head', c: P.b, m: mm => mm.l(8, 9.4, 5.4, 4, .7).l(11.4, 9, 12, 3.6, .7) });
        fl('head', P.g, mm => mm.e(5.2, 3.6, 1.2, 1.2).e(12, 3.4, 1.2, 1.2));
        a({ g: 'feet', c: dk(P.b, .3), m: mm => mm.l(11, 23, 10, 28, .8).l(15, 24, 15, 29, .8) });
        h.spark('float', P.g, [[3, 22, [0, 1]], [28, 8, [1, 2]], [29, 28, [2, 3]]]);
        return { eyes: [[8.4, 13.4], [12.4, 13.4]], er: 1.4, iris: '#1E1A2E', browC: P.b, lidC: P.b, mouth: { x: 10, y: 16.6, w: 1.8 }, head: { cx: 10, top: 8.6, w: 6 }, hand: null, floaty: true, gear: [] };
      }
    },
    /* PANGOLIN: a long body covered in overlapping scales, curled tail */
    pangolin: {
      pals: [{ s: '#A8866A', d: '#6E5440', k: '#E4CDB4' }, { s: '#9A8A6A', d: '#5E5238', k: '#E8DCBC' }, { s: '#8A9A8A', d: '#4E5E52', k: '#D8E4D4' }, { s: '#B07A7A', d: '#6E4444', k: '#F0D0D0' }],
      draw(h, P) {
        const { a, fl } = h;
        a({ g: 'tail', c: P.s, round: 4, m: mm => mm.l(22, 22, 29, 24, 3.4).l(29, 24, 29, 28, 2.4) });
        a({ g: 'feet', c: P.d, m: mm => mm.e(10, 29.4, 2.4, 1).e(19, 29.4, 2.4, 1) });
        a({ g: 'body', c: P.s, round: 6, gloss: 1, m: mm => mm.e(17, 21, 11.4, 7.8) });
        fl('body', P.d, mm => { for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) mm.e(10.4 + i * 3.4 + (r % 2) * 1.7, 17.6 + r * 3.6, 1.6, 1.3); });
        a({ g: 'head', c: P.k, round: 4, m: mm => mm.e(7, 19.6, 4.6, 3.8).l(4, 21, 1.4, 22.6, 1.6) });
        fl('head', INK, mm => mm.e(1.6, 22.4, .7, .7));
        return { eyes: [[7, 18.2]], er: 1.2, iris: '#1E1A2E', browC: P.d, lidC: P.k, mouth: { x: 5.6, y: 22, w: 1.4 }, head: { cx: 7, top: 15.6, w: 5 }, hand: null, gear: [] };
      }
    },
    /* HORNBILL: a big curved beak with a casque on top, bright tail feathers */
    hornbill: {
      pals: [{ f: '#2E2E3E', w: '#F4EEE0', k: '#F2A83A', c: '#E5484D' }, { f: '#3E2E2E', w: '#F8E8D0', k: '#F2C23A', c: '#F2703A' }, { f: '#2E3E4E', w: '#E8F0F4', k: '#F2B04A', c: '#4AB8D8' }, { f: '#2E3E2E', w: '#EEF4E0', k: '#F2C84A', c: '#8AD84A' }],
      draw(h, P) {
        const { a, fl } = h;
        a({ g: 'tail', c: P.w, m: mm => mm.p([[22, 20], [31, 16], [31, 22], [31, 28], [22, 26]]) });
        fl('tail', P.f, mm => mm.r(27, 14, 3, 15));
        a({ g: 'feet', c: P.k, m: mm => mm.l(14, 26, 13, 30, .8).l(19, 26, 20, 30, .8) });
        a({ g: 'body', c: P.f, round: 6, gloss: 1, m: mm => mm.e(17, 20, 8.4, 8) });
        a({ g: 'body', c: P.w, sep: false, m: mm => mm.e(14.6, 22, 4.6, 4.6) });
        a({ g: 'head', c: P.f, round: 5, m: mm => mm.e(11, 11.6, 5.8, 5.6) });
        a({ g: 'weap', c: P.k, round: 3, m: mm => mm.p([[7, 10], [1, 12.4], [1.4, 15.6], [4, 17.4], [8, 16]]) });
        a({ g: 'weap', c: P.c, round: 2, m: mm => mm.p([[6, 10.4], [9, 5.4], [14, 5.8], [12, 10]]) });
        return { eyes: [[11, 10.8]], er: 1.5, iris: '#1E1A2E', browC: P.f, lidC: P.f, mouth: { x: 5, y: 14.8, w: 1.2 }, head: { cx: 11, top: 6.4, w: 6 }, hand: null, gear: [] };
      }
    },
    /* SEA TURTLE: a domed shell with hex pattern, flippers and a happy face */
    seaturtle: {
      pals: [{ s: '#4AA88A', d: '#2E7A62', k: '#A8D8A0' }, { s: '#6AA84A', d: '#487A2E', k: '#C8E0A0' }, { s: '#4A8AB8', d: '#2E5E8A', k: '#A8D0E0' }, { s: '#B8884A', d: '#7A5A2E', k: '#E0CC9A' }],
      draw(h, P) {
        const { a, fl } = h;
        a({ g: 'feet', c: P.k, m: mm => mm.e(10, 28.4, 3.2, 1.6).e(23, 28.4, 3.2, 1.6) });
        a({ g: 'tail', c: P.k, m: mm => mm.p([[27, 24], [31, 26], [27, 27]]) });
        a({ g: 'body', c: P.s, round: 6, gloss: 1, m: mm => mm.e(17, 20, 11.6, 8.6).and(t => t.r(0, 0, 32, 27)) });
        fl('body', P.d, mm => { mm.l(17, 12, 17, 27, .5).l(10, 15, 24, 15, .5).l(8, 21, 26, 21, .5); });
        a({ g: 'head', c: P.k, round: 4, m: mm => mm.e(6.6, 19, 4.6, 4.2) });
        a({ g: 'weap', c: P.k, m: mm => mm.l(14, 26, 11, 30, 1.8) });
        return { eyes: [[5.4, 17.6]], er: 1.4, iris: '#1E1A2E', browC: P.d, lidC: P.k, mouth: { x: 5, y: 21, w: 1.8 }, head: { cx: 6.6, top: 14.8, w: 5 }, hand: null, gear: [] };
      }
    },
    /* PAPER LANTERN: a round red lantern with ribs, tassel and a flame glow inside */
    paperlamp: {
      pals: [{ r: '#E5484D', d: '#A82A32', g: '#F2C14E' }, { r: '#F2A83A', d: '#B8741E', g: '#FFE08A' }, { r: '#E56AA0', d: '#A83E70', g: '#F8E066' }, { r: '#4AB8D8', d: '#2E7A9A', g: '#FFF2A0' }],
      draw(h, P) {
        const { a, fl } = h;
        a({ g: 'tail', c: P.g, m: mm => mm.r(15.4, 27, 1.4, 4).l(14, 29, 13.4, 31.4, .6).l(17, 29, 17.6, 31.4, .6) });
        a({ g: 'body', c: P.r, round: 6, gloss: 1, m: mm => mm.e(16, 17, 11, 9.6) });
        fl('body', P.d, mm => { mm.l(16, 7.6, 16, 26.6, .5).l(10, 8.6, 9, 25.6, .5).l(22, 8.6, 23, 25.6, .5); });
        a({ g: 'body', c: P.g, m: mm => mm.r(11, 5.4, 10, 2.4).r(11, 25.6, 10, 2.4) });
        a({ g: 'float', c: P.g, flat: true, sep: false, fr: [0, 2], m: mm => mm.p([[16, 0], [14.6, 3], [16, 4.4], [17.4, 3]]) });
        return { eyes: [[12.4, 15], [19.6, 15]], er: 1.6, iris: '#1E1A2E', browC: P.d, lidC: P.r, mouth: { x: 16, y: 19.2, w: 2.4 }, head: { cx: 16, top: 7, w: 7 }, hand: null, floaty: true, gear: [] };
      }
    },
    /* PINEAPPLE GUARD: a spiky pineapple with a leafy crown and little stubby arms */
    pineapple: {
      pals: [{ y: '#F2C23A', d: '#B8861E', l: '#4AA84A' }, { y: '#F2A83A', d: '#B8661E', l: '#3E8A3E' }, { y: '#F2DC6A', d: '#B8A03E', l: '#6AB84A' }, { y: '#E8A04A', d: '#9A6A2E', l: '#2E7A5A' }],
      draw(h, P) {
        const { a, fl, tri } = h;
        a({ g: 'back', c: P.l, m: mm => { tri(mm, 11, 7, 2.6, 7); tri(mm, 16, 5, 2.6, 8); tri(mm, 21, 7, 2.6, 7); } });
        a({ g: 'feet', c: P.d, m: mm => mm.e(12, 29.8, 2.6, 1).e(20, 29.8, 2.6, 1) });
        a({ g: 'body', c: P.y, round: 6, gloss: 1, m: mm => mm.e(16, 19.6, 8.6, 10) });
        fl('body', P.d, mm => { for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) mm.l(9.6 + i * 4 + (r % 2) * 2, 12 + r * 4.2, 11.6 + i * 4 + (r % 2) * 2, 14 + r * 4.2, .4); });
        a({ g: 'weap', c: P.y, round: 3, m: mm => mm.l(8, 19, 4.4, 22, 2.4) });
        a({ g: 'weap', c: P.y, round: 3, m: mm => mm.l(24, 19, 27.6, 22, 2.4) });
        return { eyes: [[12.6, 18], [19.4, 18]], er: 1.7, iris: '#1E1A2E', browC: P.d, lidC: P.y, mouth: { x: 16, y: 22, w: 2.4 }, head: { cx: 16, top: 10, w: 7 }, hand: null, gear: [] };
      }
    },
    /* RAINBOW SNAIL: a slow snail with a swirly rainbow shell */
    rainsnail: {
      pals: [{ b: '#F2D8B0', s: '#E5484D', t: '#F2C14E' }, { b: '#D8E8C8', s: '#3E7BE0', t: '#8AD84A' }, { b: '#F2D0E0', s: '#9A6AC9', t: '#F2A0C8' }, { b: '#D0E8F2', s: '#2EA88A', t: '#F2E066' }],
      draw(h, P) {
        const { a, fl } = h;
        a({ g: 'body', c: P.b, round: 5, m: mm => mm.e(14, 27, 14, 3).e(5.6, 24, 3.6, 4.4) });
        a({ g: 'head', c: P.b, m: mm => mm.l(4.4, 21, 3.4, 15.4, .8).l(7.4, 21, 9, 15.6, .8) });
        fl('head', P.s, mm => mm.e(3.4, 14.6, 1.2, 1.2).e(9.2, 14.8, 1.2, 1.2));
        a({ g: 'back', c: P.s, round: 6, gloss: 1, m: mm => mm.e(20, 16.6, 8.4, 8.8) });
        fl('back', P.t, mm => mm.e(20, 16.6, 5.4, 5.6));
        fl('back', P.s, mm => mm.e(20, 16.6, 2.8, 2.8));
        fl('back', lt(P.t, .5), mm => mm.e(19.6, 16.6, .9, .9));
        return { eyes: [[5.2, 23.2]], er: 1.2, iris: '#1E1A2E', browC: dk(P.b, .4), lidC: P.b, mouth: { x: 5, y: 26, w: 1.4 }, head: { cx: 5.6, top: 19.6, w: 4 }, hand: null, gear: [] };
      }
    },
    /* CLOUD DRAGON: a long wispy dragon made of cloud, with tiny horns and a lightning-bolt tail */
    clouddragon: {
      pals: [{ c: '#F4F8FF', d: '#BCCCEA', b: '#F2D84A' }, { c: '#FCEEF4', d: '#E4B4CC', b: '#8AD8F2' }, { c: '#EEF8F0', d: '#B0D8BC', b: '#F2A83A' }, { c: '#F2ECFC', d: '#C4B4E8', b: '#F26A8A' }],
      draw(h, P) {
        const { a, fl, tri } = h;
        a({ g: 'tail', c: P.b, flat: true, m: mm => mm.p([[22, 22], [30, 20], [27, 24], [31, 28], [23, 26]]) });
        a({ g: 'body', c: P.c, round: 6, gloss: 1, m: mm => mm.e(10, 22, 6.6, 5).e(17, 22.6, 6.6, 5.4).e(23, 22, 5.2, 4.2) });
        a({ g: 'head', c: P.c, round: 6, gloss: 1, m: mm => mm.e(10, 12.4, 7.4, 6.4) });
        a({ g: 'head', c: P.b, m: mm => { tri(mm, 7, 6, 1.4, 4); tri(mm, 13, 6, 1.4, 4); } });
        fl('body', P.d, mm => mm.l(12, 26.6, 22, 26.6, .5));
        fl('head', P.d, mm => mm.e(5.4, 15.4, 1.4, 1).e(14.6, 15.4, 1.4, 1));
        return { eyes: [[7.4, 12], [12.8, 12]], er: 1.5, iris: '#1E1A2E', browC: P.d, lidC: P.c, mouth: { x: 10, y: 15, w: 2 }, head: { cx: 10, top: 6.2, w: 7 }, hand: null, floaty: true, gear: [] };
      }
    },
    /* COCONUT CRAB: a crab carrying a coconut shell, two big claws */
    cococrab: {
      pals: [{ c: '#E8663A', d: '#A8381E', n: '#7A5236' }, { c: '#8A5AC9', d: '#5E3A9A', n: '#8A6240' }, { c: '#3EA8C8', d: '#1E7A9A', n: '#6E4A30' }, { c: '#E8A83A', d: '#A8741E', n: '#7A5236' }],
      draw(h, P) {
        const { a, fl } = h;
        a({ g: 'feet', c: P.d, m: mm => { [[8, 26], [12, 28], [20, 28], [24, 26]].forEach(([x, y]) => mm.l(x, y - 2, x + (x < 16 ? -2 : 2), y + 3, .9)); } });
        a({ g: 'weap', c: P.c, round: 3, m: mm => mm.l(7, 20, 4, 15, 1.8).e(3.6, 12, 3.4, 3).l(25, 20, 28, 15, 1.8).e(28.4, 12, 3.4, 3) });
        a({ g: 'body', c: P.c, round: 6, gloss: 1, m: mm => mm.e(16, 22, 10, 6) });
        a({ g: 'back', c: P.n, round: 5, gloss: 1, m: mm => mm.e(16, 12.4, 7.6, 7.2) });
        fl('back', dk(P.n, .35), mm => mm.e(13.6, 10.6, .8, .8).e(17.4, 9, .8, .8).e(16, 13.4, .8, .8));
        return { eyes: [[12.4, 21], [19.6, 21]], er: 1.6, iris: '#1E1A2E', browC: P.d, lidC: P.c, mouth: { x: 16, y: 24.6, w: 2.6 }, head: { cx: 16, top: 16.6, w: 7 }, hand: null, gear: [] };
      }
    },
    /* MOON RABBIT: a round white rabbit with long ears, holding a rice-cake mallet */
    moonrabbit: {
      pals: [{ w: '#F8F4F8', e: '#F2A0B8', m: '#C8A86A' }, { w: '#EAE4F8', e: '#C8A0F2', m: '#B8A0D8' }, { w: '#F8F0DC', e: '#F2B87A', m: '#B8884A' }, { w: '#E4F4F8', e: '#8AD0F2', m: '#8AB8C8' }],
      draw(h, P) {
        const { a, fl } = h;
        a({ g: 'feet', c: dk(P.w, .15), m: mm => mm.e(11.4, 29.8, 3, 1.1).e(20.6, 29.8, 3, 1.1) });
        a({ g: 'back', c: P.w, round: 4, m: mm => mm.e(11, 5.4, 2.4, 6).e(21, 5.4, 2.4, 6) });
        fl('back', P.e, mm => mm.e(11, 5.6, 1, 4).e(21, 5.6, 1, 4));
        a({ g: 'body', c: P.w, round: 6, gloss: 1, m: mm => mm.e(16, 22.4, 8.6, 7.4) });
        a({ g: 'face', c: P.w, round: 6, gloss: 1, m: mm => mm.e(16, 14, 8, 6.6) });
        a({ g: 'weap', c: P.m, round: 3, m: mm => mm.l(26, 28, 26, 14, 1.4).e(26, 12.6, 3.2, 2.4) });
        fl('face', P.e, mm => mm.e(10.2, 16, 1.6, 1.1).e(21.8, 16, 1.6, 1.1));
        return { eyes: [[12.6, 13.2], [19.4, 13.2]], er: 1.5, iris: '#1E1A2E', browC: dk(P.w, .4), lidC: P.w, mouth: { x: 16, y: 17.2, w: 1.8 }, head: { cx: 16, top: 7.6, w: 7 }, hand: null, gear: [] };
      }
    }
  };
  Object.assign(BEAST.species, more);
})();
