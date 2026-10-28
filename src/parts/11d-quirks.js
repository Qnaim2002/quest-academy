/* ================= v21: per-species idle quirks =================
   Every 8-14 seconds of calm (no attack, no hint shake, no overlay) the monster does something only its
   species does: the slime squishes, the mimic licks its lips, the wolf howls, the golem stomps, and so on.
   The quirk animates the sprite picture inside #monSprite (the attack and hurt moves animate the box
   around it, so the two never fight). Off in calm sensory mode and when the device asks for reduced motion. */
const QK = (frames, d, extra) => ({ frames, d, extra });
const QUIRKS = {
  slime: QK([[0, 1, 1, 0], [.18, 1.2, .76, 6], [.36, .9, 1.14, -8], [.55, 1.08, .92, 0], [.75, .97, 1.03, 0], [1, 1, 1, 0]], 900, p => { sx([{ f: 300, f2: 150, d: .18, v: .05 }, { f: 210, f2: 320, d: .16, v: .035, delay: .2 }]); }),
  goblin: QK([[0, 1, 1, 0], [.2, -1, 1, 0], [.45, -1, 1, 0], [.55, 1, 1, 0], [.7, 1, .9, 0], [.82, 1, 1.06, -10], [1, 1, 1, 0]], 1300, p => fx.num(p.x, p.y - p.h * .55, '?', 'quirk')),
  mushroom: QK([[0, 1, 1, 0], [.3, 1.06, .9, 0], [.5, .96, 1.08, -4], [1, 1, 1, 0]], 1000, p => { fx.burst(p.x, p.y - p.h * .35, 4, ['·', '✨', '•'], 34); sx([{ n: 1, ft: 'highpass', f: 3000, d: .3, v: .02 }]); }),
  wraith: QK([[0, 1, 1, 0, 1], [.3, 1, 1.04, -10, .35], [.6, 1, 1.04, -10, .4], [1, 1, 1, 0, 1]], 1500, () => sx([{ f: 620, f2: 420, d: .7, type: 'sine', v: .02, a: .2, sus: true, r: .3 }])),
  golem: QK([[0, 1, 1, 0], [.3, 1, 1.05, -12], [.45, 1.06, .9, 4], [.6, 1, 1, 0], [1, 1, 1, 0]], 900, p => { setTimeout(() => { fx.dust(p.x, p.y + p.h * .42); fx.shake($('#stage'), 3, 200); sx([{ f: 90, f2: 40, d: .25, v: .14 }]); }, 380); }),
  gargoyle: QK([[0, 1, 1, 0], [.15, 1.12, .96, -4], [.3, .94, 1, -6], [.45, 1.12, .96, -8], [.6, .94, 1, -4], [1, 1, 1, 0]], 1000, () => sx([{ n: 1, ft: 'bandpass', f: 600, d: .12, v: .03 }, { n: 1, ft: 'bandpass', f: 600, d: .12, v: .03, delay: .3 }])),
  crystal: QK([[0, 1, 1, 0, 1, 1], [.4, 1.03, 1.03, 0, 1, 1.5], [1, 1, 1, 0, 1, 1]], 1100, p => { fx.burst(p.x, p.y - p.h * .2, 5, ['✨', '💎'], 50); sx([84, 88, 91].map((m, i) => ({ f: NF(m + 12), d: .3, v: .02, delay: i * .07 }))); }),
  troll: QK([[0, 1, 1, 0], [.35, .96, 1.1, -4], [.65, .96, 1.1, -4], [1, 1, 1, 0]], 1500, p => fx.num(p.x, p.y - p.h * .5, '😮 yawn', 'quirk')),
  drake: QK([[0, 1, 1, 0], [.3, 1.04, .96, 0], [.5, .98, 1.02, -4], [1, 1, 1, 0]], 1000, p => { setTimeout(() => fx.burst(p.x - p.w * .3, p.y - p.h * .2, 4, ['💨'], 40), 300); sx([{ n: 1, ft: 'lowpass', f: 900, f2: 300, d: .4, v: .04, delay: .3 }]); }),
  shadow: QK([[0, 1, 1, 0, 1], [.2, 1, 1, 0, .1], [.45, 1, 1, 0, .1], [.6, 1.06, .94, 0, 1], [1, 1, 1, 0, 1]], 1200),
  mimic: QK([[0, 1, 1, 0], [.25, 1, 1.08, -6, 1, 1, -6], [.6, 1, 1.08, -6, 1, 1, -6], [.8, 1.04, .94, 0], [1, 1, 1, 0]], 1300, p => { fx.num(p.x - p.w * .2, p.y - p.h * .05, '👅', 'quirk'); sx([{ n: 1, ft: 'bandpass', f: 2600, f2: 1100, d: .18, v: .035, q: 2, delay: .25 }]); }),
  imp: QK([[0, 1, 1, 0], [.2, 1, 1, -16], [.4, 1, 1, 0], [.55, 1, 1, -12], [.75, 1, 1, 0], [1, 1, 1, 0]], 1100, p => { fx.num(p.x, p.y - p.h * .55, 'hee hee!', 'quirk'); sx([0, .12, .24].map(dl => ({ f: 900, f2: 1300, d: .08, type: 'triangle', v: .025, delay: dl }))); }),
  dryad: QK([[0, 1, 1, 0, 1, 1, 0], [.3, 1, 1, 0, 1, 1, -5], [.65, 1, 1, 0, 1, 1, 5], [1, 1, 1, 0, 1, 1, 0]], 1800, p => fx.burst(p.x, p.y - p.h * .3, 3, ['🍃'], 44)),
  skeleton: QK([[0, 1, 1, 0], [.1, 1, 1, 0, 1, 1, 3], [.2, 1, 1, 0, 1, 1, -3], [.3, 1, 1, 0, 1, 1, 3], [.4, 1, 1, 0, 1, 1, -3], [.5, 1, 1, 0], [1, 1, 1, 0]], 900, () => sx([0, .06, .12, .2, .26].map(dl => ({ f: 1800 + Math.random() * 600, d: .04, type: 'square', v: .012, lp: 3000, delay: dl })))),
  automaton: QK([[0, 1, 1, 0], [.3, 1, 1.03, 0], [.5, 1, .98, 0], [1, 1, 1, 0]], 900, p => { fx.burst(p.x, p.y - p.h * .45, 3, ['💨'], 30); sx([{ n: 1, ft: 'highpass', f: 4000, d: .35, v: .03 }, { f: 1500, d: .03, type: 'square', v: .015, delay: .4 }]); }),
  seraph: QK([[0, 1, 1, 0, 1, 1], [.4, 1, 1, -16, 1, 1.35], [.7, 1, 1, -14, 1, 1.2], [1, 1, 1, 0, 1, 1]], 1800, p => { fx.burst(p.x, p.y - p.h * .35, 3, ['✨'], 46); sx([{ f: NF(88), d: .6, v: .02, a: .1 }, { f: NF(95), d: .6, v: .015, a: .1, delay: .1 }]); }),
  fire: QK([[0, 1, 1, 0, 1, 1], [.25, 1.08, 1.12, -4, 1, 1.4], [.55, .96, .96, 0, 1, 1.1], [1, 1, 1, 0, 1, 1]], 900, p => { fx.burst(p.x, p.y - p.h * .3, 5, ['🔥', '✨'], 50); sx([{ n: 1, ft: 'lowpass', f: 1500, f2: 400, d: .35, v: .05 }]); }),
  cyclops: QK([[0, 1, 1, 0, 1, 1, 0], [.3, 1.06, 1.06, 0, 1, 1, -6], [.6, 1.06, 1.06, 0, 1, 1, -6], [1, 1, 1, 0, 1, 1, 0]], 1400, p => fx.num(p.x - p.w * .1, p.y - p.h * .55, '👁️', 'quirk')),
  wolf: QK([[0, 1, 1, 0, 1, 1, 0], [.25, 1, 1.04, -6, 1, 1, 12], [.75, 1, 1.04, -6, 1, 1, 12], [1, 1, 1, 0, 1, 1, 0]], 1700, p => { fx.num(p.x - p.w * .25, p.y - p.h * .6, 'Awoooo! 🌙', 'quirk'); sx([{ f: 380, f2: 760, d: 1.1, glide: .4, type: 'triangle', v: .05, a: .1, sus: true, r: .35, delay: .25 }, { f: 383, f2: 765, d: 1.1, glide: .4, type: 'sine', v: .03, a: .1, sus: true, r: .35, delay: .25 }]); }),
  owlbear: QK([[0, 1, 1, 0, 1, 1, 0], [.2, 1, 1, 0, 1, 1, 10], [.45, 1, 1, 0, 1, 1, 10], [.6, 1, 1, 0, 1, 1, -8], [.8, 1, 1, 0, 1, 1, -8], [1, 1, 1, 0, 1, 1, 0]], 1600, p => { fx.num(p.x, p.y - p.h * .55, 'hoo?', 'quirk'); sx([{ f: 420, f2: 380, d: .25, v: .04 }, { f: 420, f2: 360, d: .3, v: .04, delay: .32 }]); }),
  boss: QK([[0, 1, 1, 0, 1, 1], [.35, 1.05, 1.05, -4, 1, 1.15], [.7, 1.05, 1.05, -4, 1, 1.15], [1, 1, 1, 0, 1, 1]], 1800, p => { fx.shake($('#stage'), 4, 500); sx([{ f: 110, f2: 70, d: .8, type: 'sawtooth', v: .06, lp: 600, a: .1 }, { f: 113, f2: 72, d: .8, type: 'sawtooth', v: .04, lp: 500, a: .1 }]); })
};
/* v22: the ten newest species */
Object.assign(QUIRKS, {
  squid: QK([[0, 1, 1, 0], [.25, .9, 1.14, -10], [.5, 1.08, .9, -4], [.75, .96, 1.06, -8], [1, 1, 1, 0]], 1500, p => { fx.burst(p.x, p.y - p.h * .1, 4, ['🫧', '•'], 40); sx([{ f: 500, f2: 900, d: .15, type: 'sine', v: .03 }, { f: 600, f2: 1100, d: .15, type: 'sine', v: .025, delay: .2 }]); }),
  cactus: QK([[0, 1, 1, 0], [.2, 1.08, .94, 0], [.4, 1.1, .96, -2], [.6, 1.08, .94, 0], [1, 1, 1, 0]], 1200, p => fx.num(p.x, p.y - p.h * .55, '💪 flex!', 'quirk')),
  bat: QK([[0, 1, 1, 0, 1, 1, 0], [.25, 1, 1, -10, 1, 1, 180], [.6, 1, 1, -10, 1, 1, 180], [1, 1, 1, 0, 1, 1, 0]], 1800, p => { fx.num(p.x, p.y - p.h * .55, 'eek eek!', 'quirk'); sx([0, .1, .2].map(dl => ({ f: 2400, f2: 3000, d: .05, type: 'square', v: .012, delay: dl }))); }),
  pumpkin: QK([[0, 1, 1, 0, 1, 1], [.3, 1, 1, 0, 1, 1.5], [.5, 1, 1, 0, 1, .8], [.7, 1, 1, 0, 1, 1.4], [1, 1, 1, 0, 1, 1]], 1300, p => fx.num(p.x, p.y - p.h * .55, 'mwa-ha-ha!', 'quirk')),
  yeti: QK([[0, 1, 1, 0], [.3, 1.04, 1.06, -6], [.5, .98, 1, 0], [1, 1, 1, 0]], 1300, p => { fx.burst(p.x - p.w * .2, p.y - p.h * .2, 5, ['❄️', '✨'], 46); sx([{ n: 1, ft: 'highpass', f: 3500, d: .5, v: .03 }]); }),
  thunderbird: QK([[0, 1, 1, 0, 1, 1], [.2, 1.1, 1.1, -10, 1, 1.6], [.4, 1, 1, -4, 1, 1], [.55, 1.08, 1.08, -8, 1, 1.5], [1, 1, 1, 0, 1, 1]], 1200, p => { fx.burst(p.x, p.y - p.h * .3, 4, ['⚡'], 50); sx([{ n: 1, ft: 'lowpass', f: 2000, f2: 200, d: .5, v: .06 }]); }),
  crab: QK([[0, 1, 1, 0], [.15, 1, 1, 0, 1, 1, -4], [.3, 1, 1, 0, 1, 1, 4], [.45, 1, 1, 0, 1, 1, -4], [.6, 1, 1, 0, 1, 1, 4], [1, 1, 1, 0]], 1100, () => sx([0, .14, .28].map(dl => ({ f: 1400, f2: 900, d: .05, type: 'square', v: .02, delay: dl })))),
  turtle: QK([[0, 1, 1, 0], [.3, 1, .9, 4], [.6, 1, .9, 4], [.8, 1.02, 1.04, -2], [1, 1, 1, 0]], 1600, p => fx.num(p.x, p.y - p.h * .5, '🛡️', 'quirk')),
  bee: QK([[0, 1, 1, 0, 1, 1, 0], [.2, 1, 1, -6, 1, 1, -6], [.4, 1, 1, -2, 1, 1, 6], [.6, 1, 1, -6, 1, 1, -6], [.8, 1, 1, -2, 1, 1, 6], [1, 1, 1, 0, 1, 1, 0]], 1400, () => sx([{ f: 210, f2: 230, d: .7, type: 'sawtooth', v: .018, lp: 900 }])),
  cupcake: QK([[0, 1, 1, 0], [.25, 1.1, .9, 0], [.5, .94, 1.08, -8], [.75, 1.04, .96, 0], [1, 1, 1, 0]], 1000, p => fx.burst(p.x, p.y - p.h * .45, 4, ['🍒', '✨'], 36)),
  raccoon: QK([[0, 1, 1, 0], [.2, -1, 1, 0], [.5, -1, 1, 0], [.6, 1, 1, 0], [1, 1, 1, 0]], 1400, p => fx.num(p.x, p.y - p.h * .55, '🪙 mine!', 'quirk')),
  durian: QK([[0, 1, 1, 0], [.3, 1.08, 1.08, 0], [.5, .96, .96, 0], [1, 1, 1, 0]], 1100, p => fx.num(p.x, p.y - p.h * .55, '💨 phew!', 'quirk')),
  lantern: QK([[0, 1, 1, 0, 1, 1, 0], [.3, 1, 1, -6, 1, 1.4, -6], [.6, 1, 1, -6, 1, 1.3, 6], [1, 1, 1, 0, 1, 1, 0]], 1800, p => fx.burst(p.x, p.y - p.h * .3, 3, ['✨'], 40)),
  alien: QK([[0, 1, 1, 0], [.2, 1, 1, -10], [.4, 1, 1, 0], [.6, 1, 1, -6], [1, 1, 1, 0]], 1200, p => { fx.num(p.x, p.y - p.h * .55, 'beep boop!', 'quirk'); sx([{ f: 900, f2: 1600, d: .12, type: 'sine', v: .03 }, { f: 1600, f2: 700, d: .12, type: 'sine', v: .03, delay: .14 }]); }),
  scarecrow: QK([[0, 1, 1, 0, 1, 1, 0], [.25, 1, 1, 0, 1, 1, -6], [.5, 1, 1, 0, 1, 1, 6], [.75, 1, 1, 0, 1, 1, -4], [1, 1, 1, 0, 1, 1, 0]], 1600, p => fx.num(p.x - p.w * .3, p.y - p.h * .3, 'caw!', 'quirk')),
  snail: QK([[0, 1, 1, 0], [.4, 1.06, .94, 0], [.7, 1.06, .94, 0], [1, 1, 1, 0]], 2000, p => fx.num(p.x, p.y - p.h * .4, '🐌 slow and steady', 'quirk')),
  mole: QK([[0, 1, 1, 0], [.3, 1, .9, 6], [.6, 1, .9, 6], [.8, 1, 1.04, -4], [1, 1, 1, 0]], 1300, p => fx.dust(p.x, p.y + p.h * .42)),
  treant: QK([[0, 1, 1, 0, 1, 1, 0], [.35, 1, 1, 0, 1, 1, -4], [.7, 1, 1, 0, 1, 1, 4], [1, 1, 1, 0, 1, 1, 0]], 2000, p => fx.burst(p.x, p.y - p.h * .5, 3, ['🍃', '🍎'], 44)),
  frog: QK([[0, 1, 1, 0], [.2, 1.1, .86, 0], [.45, .94, 1.1, -18], [.7, 1.06, .92, 0], [1, 1, 1, 0]], 1000, p => { fx.num(p.x, p.y - p.h * .5, 'ribbit!', 'quirk'); sx([{ f: 220, f2: 160, d: .12, type: 'square', v: .03 }, { f: 240, f2: 170, d: .12, type: 'square', v: .03, delay: .16 }]); }),
  snowman: QK([[0, 1, 1, 0], [.3, 1.04, .96, 0], [.55, .98, 1.03, -3], [1, 1, 1, 0]], 1400, p => fx.burst(p.x, p.y - p.h * .5, 4, ['❄️'], 40)),
  parrot: QK([[0, 1, 1, 0, 1, 1, 0], [.2, 1, 1, -4, 1, 1, -8], [.4, 1, 1, 0, 1, 1, 0], [.6, 1, 1, -4, 1, 1, -8], [1, 1, 1, 0, 1, 1, 0]], 1300, p => { fx.num(p.x, p.y - p.h * .55, 'Ahoy!', 'quirk'); sx([{ f: 1400, f2: 2000, d: .08, type: 'square', v: .015 }, { f: 1600, f2: 2200, d: .08, type: 'square', v: .015, delay: .12 }]); }),
  gnome: QK([[0, 1, 1, 0, 1, 1], [.4, 1, 1, -4, 1, 1.4], [.7, 1, 1, -2, 1, 1.2], [1, 1, 1, 0, 1, 1]], 1500, p => { fx.burst(p.x - p.w * .3, p.y - p.h * .2, 4, ['✨', '⭐'], 40); sx([88, 91, 95].map((m, i) => ({ f: NF(m), d: .25, v: .015, delay: i * .08 }))); }),
  beetle: QK([[0, 1, 1, 0, 1, 1, 0], [.3, 1, 1, 0, 1, 1, -6], [.6, 1, 1, 0, 1, 1, -6], [1, 1, 1, 0, 1, 1, 0]], 1200, () => sx([{ f: 160, f2: 180, d: .3, type: 'sawtooth', v: .02, lp: 600 }])),
  puffer: QK([[0, 1, 1, 0], [.3, 1.18, 1.18, 0], [.7, 1.18, 1.18, 0], [1, 1, 1, 0]], 1600, p => fx.burst(p.x, p.y - p.h * .2, 4, ['🫧'], 40)),
  croc: QK([[0, 1, 1, 0], [.25, 1, 1.04, -2], [.5, 1, 1, 0], [1, 1, 1, 0]], 1000, p => { fx.num(p.x - p.w * .3, p.y - p.h * .4, 'snap!', 'quirk'); sx([{ n: 1, ft: 'bandpass', f: 1200, d: .06, v: .05 }]); }),
  tapir: QK([[0, 1, 1, 0, 1, 1, 0], [.4, 1, 1, 0, 1, 1, -3], [.8, 1, 1, 0, 1, 1, -3], [1, 1, 1, 0, 1, 1, 0]], 1800, p => fx.num(p.x - p.w * .3, p.y - p.h * .4, 'sniff sniff', 'quirk')),
  wau: QK([[0, 1, 1, 0, 1, 1, 0], [.25, 1, 1, -6, 1, 1, -6], [.5, 1, 1, -2, 1, 1, 6], [.75, 1, 1, -8, 1, 1, -4], [1, 1, 1, 0, 1, 1, 0]], 2000, () => sx([{ n: 1, ft: 'bandpass', f: 800, f2: 1600, d: .6, v: .02 }])),
  sheep: QK([[0, 1, 1, 0], [.4, 1.04, .98, -6], [.8, 1, 1, -2], [1, 1, 1, 0]], 1600, p => { fx.num(p.x, p.y - p.h * .55, 'baa!', 'quirk'); sx([{ f: 420, f2: 380, d: .5, type: 'sawtooth', v: .02, lp: 1200, vib: .03 }]); }),
  teapot: QK([[0, 1, 1, 0, 1, 1, 0], [.3, 1, 1, 0, 1, 1, -10], [.6, 1, 1, 0, 1, 1, -10], [1, 1, 1, 0, 1, 1, 0]], 1400, p => { fx.burst(p.x - p.w * .35, p.y - p.h * .4, 3, ['☁️'], 30); sx([{ n: 1, ft: 'highpass', f: 5000, d: .6, v: .025 }]); }),
  rex: QK([[0, 1, 1, 0], [.3, 1.06, 1.04, -4, 1, 1, -4], [.6, 1.06, 1.04, -4, 1, 1, -4], [1, 1, 1, 0]], 1300, p => { fx.num(p.x - p.w * .3, p.y - p.h * .55, 'ROAR!', 'quirk'); fx.shake($('#stage'), 2, 250); sx([{ f: 160, f2: 90, d: .6, type: 'sawtooth', v: .05, lp: 700 }]); })
});
/* v32: the ten newest species */
Object.assign(QUIRKS, {
  jelly: QK([[0, 1, 1, 0], [.3, .92, 1.12, -8], [.6, 1.06, .92, -2], [1, 1, 1, 0]], 1500, p => { fx.burst(p.x, p.y - p.h * .2, 4, ['🫧', '✨'], 40); sx([{ f: 500, f2: 800, d: .4, type: 'sine', v: .04 }]); }),
  dumpling: QK([[0, 1, 1, 0], [.3, 1.06, .92, 2], [.6, .96, 1.06, -6], [1, 1, 1, 0]], 1200, p => { fx.burst(p.x + p.w * .2, p.y - p.h * .6, 3, ['☁️'], 30); sx([{ f: 320, f2: 500, d: .25, type: 'triangle', v: .04 }]); }),
  mango: QK([[0, 1, 1, 0], [.25, 1, 1, -12], [.5, 1, 1, 0], [.7, 1, 1, -6], [1, 1, 1, 0]], 1100, p => fx.num(p.x, p.y - p.h * .55, 'yum!', 'quirk')),
  moth: QK([[0, 1, 1, 0, 1, 1, 0], [.25, 1.1, .9, -8, 1, 1, -6], [.5, .9, 1.08, -4, 1, 1, 6], [.75, 1.1, .9, -8, 1, 1, -6], [1, 1, 1, 0, 1, 1, 0]], 1400, p => { fx.burst(p.x, p.y - p.h * .4, 4, ['✨', '🌙'], 36); sx([{ f: 900, f2: 1100, d: .3, type: 'sine', v: .03 }]); }),
  rocket: QK([[0, 1, 1, 0], [.2, 1, 1, 4], [.5, .96, 1.1, -30, .6], [.75, 1, 1, -10], [1, 1, 1, 0]], 1300, p => { fx.num(p.x, p.y - p.h * .55, '3, 2, 1... zoom!', 'quirk'); sx([{ n: 1, ft: 'highpass', f: 1200, d: .5, v: .04 }]); }),
  chili: QK([[0, 1, 1, 0, 1, 1], [.25, 1.05, 1.05, -2, 1, 1.5], [.5, 1, 1, 0, 1, 1], [.75, 1.05, 1.05, -2, 1, 1.5], [1, 1, 1, 0, 1, 1]], 1200, p => { fx.burst(p.x, p.y - p.h * .4, 4, ['🔥', '✨'], 36); fx.num(p.x, p.y - p.h * .6, 'hot hot!', 'quirk'); }),
  rafflesia: QK([[0, 1, 1, 0], [.3, 1.1, 1.1, -2], [.6, 1.12, 1.12, -2], [1, 1, 1, 0]], 1400, p => { fx.burst(p.x, p.y - p.h * .5, 4, ['🌸', '💨'], 40); sx([{ f: 140, f2: 100, d: .5, type: 'sawtooth', v: .03, lp: 600 }]); }),
  icecream: QK([[0, 1, 1, 0], [.3, .94, 1.08, -4, 1, 1, -5], [.6, .94, 1.08, -4, 1, 1, 5], [1, 1, 1, 0]], 1300, p => { fx.burst(p.x, p.y - p.h * .5, 4, ['🍦', '❄️'], 34); sx([{ f: 1200, f2: 1500, d: .3, type: 'triangle', v: .03 }]); }),
  liondance: QK([[0, 1, 1, 0], [.15, 1.06, .94, 2], [.3, .96, 1.08, -8], [.45, 1.06, .94, 2], [.6, .96, 1.08, -8], [1, 1, 1, 0]], 1400, p => { fx.burst(p.x, p.y - p.h * .4, 5, ['🧧', '✨'], 44); fx.num(p.x, p.y - p.h * .6, 'dong dong cha!', 'quirk'); sx([0, .12, .24].map(dl => ({ f: 180, f2: 120, d: .12, type: 'square', v: .04, delay: dl, lp: 800 }))); }),
  luckycat: QK([[0, 1, 1, 0, 1, 1, 0], [.25, 1, 1, 0, 1, 1, -8], [.5, 1, 1, 0, 1, 1, 8], [.75, 1, 1, 0, 1, 1, -8], [1, 1, 1, 0, 1, 1, 0]], 1300, p => { fx.num(p.x, p.y - p.h * .55, 'lucky~', 'quirk'); fx.burst(p.x, p.y - p.h * .5, 3, ['🪙'], 34); sx([{ f: 1500, f2: 1900, d: .2, type: 'sine', v: .04 }]); }),
  /* v38: the ten MALT6 species */
  firefly: QK([[0, 1, 1, 0], [.3, 1.04, 1.04, -3], [.6, .98, .98, 3], [1, 1, 1, 0]], 1300, p => { fx.burst(p.x, p.y - p.h * .4, 5, ['✨', '💛'], 38); sx([{ f: 1300, f2: 1700, d: .25, type: 'sine', v: .03 }]); }),
  pangolin: QK([[0, 1, 1, 0], [.3, .92, .92, 0], [.6, .92, .92, 0], [1, 1, 1, 0]], 1200, p => { fx.num(p.x, p.y - p.h * .6, 'curl up!', 'quirk'); sx([{ f: 220, f2: 160, d: .2, type: 'triangle', v: .04 }]); }),
  hornbill: QK([[0, 1, 1, 0], [.25, 1, 1, -6], [.5, 1, 1, 6], [.75, 1, 1, -6], [1, 1, 1, 0]], 1200, p => { fx.num(p.x, p.y - p.h * .6, 'honk honk!', 'quirk'); sx([{ f: 500, f2: 380, d: .18, type: 'square', v: .03 }]); }),
  seaturtle: QK([[0, 1, 1, 0], [.4, 1.05, .96, -2], [.8, .97, 1.04, 2], [1, 1, 1, 0]], 1500, p => { fx.burst(p.x, p.y - p.h * .3, 4, ['🫧', '🌊'], 34); }),
  paperlamp: QK([[0, 1, 1, 0], [.3, 1.06, 1.06, 0], [.6, 1, 1, 0], [1, 1, 1, 0]], 1300, p => { fx.burst(p.x, p.y - p.h * .5, 4, ['🏮', '✨'], 36); sx([{ f: 880, f2: 990, d: .2, type: 'sine', v: .03 }]); }),
  pineapple: QK([[0, 1, 1, 0], [.2, 1.06, .94, -3], [.4, .96, 1.06, 3], [.6, 1.06, .94, -3], [1, 1, 1, 0]], 1200, p => { fx.num(p.x, p.y - p.h * .6, 'pointy!', 'quirk'); fx.burst(p.x, p.y - p.h * .5, 3, ['🍍'], 30); }),
  rainsnail: QK([[0, 1, 1, 0], [.5, 1.04, .96, 1], [1, 1, 1, 0]], 1500, p => { fx.burst(p.x, p.y - p.h * .5, 5, ['🌈', '✨'], 36); fx.num(p.x, p.y - p.h * .6, 'slooow~', 'quirk'); }),
  clouddragon: QK([[0, 1, 1, 0], [.3, 1.04, 1.04, -3], [.6, 1.04, 1.04, 3], [1, 1, 1, 0]], 1400, p => { fx.burst(p.x, p.y - p.h * .5, 5, ['☁️', '⚡'], 40); sx([{ f: 120, f2: 80, d: .4, type: 'sawtooth', v: .03, lp: 500 }]); }),
  cococrab: QK([[0, 1, 1, 0], [.15, 1.04, .96, 2], [.3, .96, 1.04, -2], [.45, 1.04, .96, 2], [.6, .96, 1.04, -2], [1, 1, 1, 0]], 1200, p => { fx.num(p.x, p.y - p.h * .6, 'snip snip!', 'quirk'); fx.burst(p.x, p.y - p.h * .4, 3, ['🥥'], 34); }),
  moonrabbit: QK([[0, 1, 1, 0], [.25, .94, 1.08, -4], [.5, 1.04, .96, 0], [.75, .94, 1.08, -4], [1, 1, 1, 0]], 1300, p => { fx.burst(p.x, p.y - p.h * .5, 4, ['🌙', '✨'], 38); fx.num(p.x, p.y - p.h * .65, 'bonk!', 'quirk'); })
});
const speciesOfMon = m => m.big ? 'boss' : (m.sp || MON2.BODY[m.b] || 'slime');
/* each frame: [offset, scaleX, scaleY, translateY px, opacity?, brightness?, rotate deg?] */
const quirkKF = fr => fr.map(([o, sx2, sy, ty, op = 1, br = 1, rot = 0]) => ({ offset: o, transform: `translateY(${ty}px) rotate(${rot}deg) scale(${sx2},${sy})`, opacity: op, filter: br === 1 ? 'none' : `brightness(${br})` }));
let quirkAnim = null;
function playQuirk(kind) {
  const box = ms(), el = box && box.firstElementChild; if (!el || !B.lv) return false;
  const q = QUIRKS[kind || speciesOfMon(B.lv.mon)] || QUIRKS.slime;
  el.style.transformOrigin = '50% 92%';
  if (quirkAnim) quirkAnim.cancel();
  quirkAnim = el.animate(quirkKF(q.frames), { duration: q.d, easing: 'ease-in-out' });
  quirkAnim.onfinish = quirkAnim.oncancel = () => { quirkAnim = null; };
  if (q.extra) try { q.extra(fx.pos(box)); } catch (e) { /* effects are optional */ }
  return true;
}
const reducedMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
function quirkTick() {
  const now = Date.now();
  if (!B.active || !B.lv) { B.quirkAt = 0; return; }
  if (!B.quirkAt) { B.quirkAt = now + 4000 + Math.random() * 3000; return; }
  if (now < B.quirkAt) return;
  const box = ms(), busy = !box || B.locked || UI.tab !== 'adventure' || UI.adv !== 'battle' || document.hidden || timeUp || bedUp || $('.overlay.on') || (B.introUntil || 0) > now || [...box.classList].some(c => c.startsWith('pose-') || c === 'windup');
  if (S.sensory || reducedMotion()) { B.quirkAt = now + 60000; return; }
  if (busy) { B.quirkAt = now + 1500; return; }
  playQuirk(); B.quirkAt = now + 8000 + Math.random() * 6000;
}
