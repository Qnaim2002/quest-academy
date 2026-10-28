/* ================= v32: sound =================
   1. THREE NEW TUNES for the stories: sad (soft, slow, minor), tense (a pulse under a creeping line) and triumph (bright, quick).
      29-v32-story.js picks one for each scene through comicTune().
   2. A SOUND FOR EVERY ACTION IN A BATTLE. Tapping an answer, a new question, a combo going up, the clock running low,
      a hint, a charged attack, a dodge, a phase change, helpers arriving, the boss healing, the hero healing, the pet cheering,
      the angry bar filling, each of the ten boss kinds' rage moves, the boss falling, the team combo ...
      Everything is made live with the same small synth as the older sounds (no audio files) and obeys the sound switch and calm mode.
   3. SHOT SOUNDS for the new story pictures (rain, campfire, running, the duel, the evolution film ...). */

Object.assign(SONGS, {
  /* A minor, A F C G: a lullaby that has lost its way */
  sad: { bpm: 66, key: 57, prog: [[0, 'm'], [8, 'M'], [3, 'M'], [10, 'M']], lead: 'bell', drums: 0, bass: 'soft',
    mel: [19, HD, HD, HD, 15, HD, 12, HD, 20, HD, HD, HD, 15, HD, 12, HD, 19, HD, HD, HD, 15, HD, 19, HD, 17, HD, 14, HD, 10, HD, HD, HD,
      24, HD, HD, HD, 19, HD, 15, HD, 20, HD, 24, HD, 20, HD, 15, HD, 22, HD, 19, HD, 15, HD, 19, HD, 17, HD, 14, HD, 10, HD, HD, HD] },
  /* G minor with a flat second: something is creeping closer */
  tense: { bpm: 108, key: 55, prog: [[0, 'm'], [1, 'M'], [0, 'm'], [10, 'M']], lead: 'square', drums: 0, bass: 'pump',
    mel: [12, HD, 15, 12, 19, HD, 15, HD, 13, HD, 17, 13, 20, HD, 17, HD, 12, HD, 15, 12, 19, HD, 18, HD, 17, HD, 14, 17, 22, HD, 17, HD,
      24, HD, 19, 15, 19, HD, 15, HD, 25, HD, 20, 17, 20, HD, 17, HD, 24, HD, 22, 19, 18, HD, 15, HD, 17, HD, 14, HD, 10, HD, HD, HD] },
  /* C major, quick and bright: a fanfare that keeps going */
  triumph: { bpm: 126, key: 60, prog: [[0, 'M'], [5, 'M'], [7, 'M'], [0, 'M']], lead: 'pluck', drums: 1, bass: 'pump',
    mel: [12, 16, 19, HD, 24, HD, 19, 16, 17, 21, 24, HD, 29, HD, 24, 21, 19, 23, 26, HD, 31, HD, 26, 23, 24, HD, 19, 16, 19, 24, 28, HD,
      24, 24, 28, HD, 31, HD, 28, 24, 29, HD, 24, 21, 24, HD, 21, 17, 26, 23, 19, 23, 26, 31, 26, HD, 24, HD, 28, 31, 36, HD, HD, HD] }
});

/* ---------------- the sounds ---------------- */
const SPECIES_VOICE = {   // pet species: [start pitch, end pitch, wave, length]
  pet_cat: [900, 620, 'triangle', .22], pet_dog: [420, 260, 'sawtooth', .16], pet_bunny: [1500, 1200, 'sine', .08], pet_penguin: [700, 520, 'square', .14],
  pet_slime: [300, 700, 'sine', .2], pet_robot: [800, 800, 'square', .1], pet_dragon: [300, 180, 'sawtooth', .28], pet_unicorn: [1100, 1700, 'triangle', .26],
  pet_fox: [1000, 700, 'triangle', .16], pet_hedgehog: [1300, 1100, 'triangle', .1], pet_turtle: [260, 240, 'sine', .22], pet_kancil: [1250, 900, 'triangle', .12],
  pet_panda: [380, 300, 'triangle', .22], pet_owl: [520, 430, 'sine', .3], pet_axolotl: [500, 900, 'sine', .18], pet_tiger: [200, 120, 'sawtooth', .3],
  pet_whale: [200, 330, 'sine', .45], pet_phoenix: [1500, 2100, 'triangle', .3], pet_frog: [260, 340, 'square', .1], pet_octopus: [350, 600, 'sine', .22],
  pet_elephant: [320, 520, 'sawtooth', .32], pet_orangutan: [600, 420, 'square', .16], pet_hornbill: [900, 1300, 'square', .12]
};
Object.assign(sfx, {
  pick() { sx([{ f: 880, d: .05, type: 'triangle', v: .03 }, { f: 1320, d: .04, v: .015, delay: .015 }]); },
  qIn() { sx([{ f: 520, f2: 780, d: .1, type: 'triangle', v: .02 }]); },
  combo(n = 2) { const k = Math.min(8, Math.max(1, n)); sx([0, 4, 7].map((m, i) => ({ f: NF(76 + k + m), d: .12, type: 'triangle', v: .035, delay: i * .045 }))); },
  tick() { sx([{ f: 1500, d: .03, type: 'square', v: .02, lp: 3000 }]); },
  hint() { sx([{ f: NF(91), d: .22, v: .03 }, { f: NF(98), d: .3, v: .02, delay: .07 }]); },
  alarm() { sx([{ f: 880, d: .09, type: 'square', v: .03, lp: 2400 }, { f: 880, d: .09, type: 'square', v: .03, lp: 2400, delay: .14 }, { f: 1175, d: .16, type: 'square', v: .03, lp: 2600, delay: .28 }]); },
  dodge() { sx([{ n: 1, ft: 'bandpass', f: 3000, f2: 700, d: .16, v: .07, q: 1.5 }, { f: 700, f2: 1400, d: .12, type: 'triangle', v: .04, delay: .05 }]); },
  heal() { sx([60, 64, 67, 72].map((m, i) => ({ f: NF(m + 12), d: .22, v: .035, delay: i * .06 })).concat([{ n: 1, ft: 'highpass', f: 7000, d: .3, v: .012, delay: .1 }])); },
  drain() { sx([{ f: 700, f2: 150, d: .5, type: 'sawtooth', v: .04, lp: 1200, vib: .03 }, { f: 120, f2: 60, d: .5, type: 'sine', v: .08, delay: .05 }]); },
  shield() { sx([{ f: NF(84), d: .5, v: .04 }, { f: NF(91), d: .5, v: .03, delay: .03 }, { f: NF(96), d: .5, v: .02, delay: .06 }, { n: 1, ft: 'highpass', f: 5000, d: .1, v: .04 }]); },
  phase(p = 2) { const base = p >= 3 ? 40 : 46; sx([{ f: NF(base), f2: NF(base - 12), d: .9, type: 'sawtooth', v: .06, lp: 500 }, { n: 1, ft: 'lowpass', f: 2200, f2: 200, d: .7, v: .12 }, { f: NF(base + 12), d: .6, type: 'square', v: .02, lp: 1500, delay: .12 }]); },
  summon() { sx([{ n: 1, ft: 'bandpass', f: 200, f2: 1800, d: .5, v: .08, q: 2 }, { f: 220, f2: 440, d: .45, type: 'sawtooth', v: .04, lp: 900 }, { f: 330, f2: 660, d: .4, type: 'triangle', v: .03, delay: .12 }]); },
  enrage() { sx([{ f: 90, f2: 60, d: .7, type: 'sawtooth', v: .09, lp: 600 }, { f: 93, f2: 62, d: .7, type: 'sawtooth', v: .07, lp: 500, det: 20 }, { n: 1, ft: 'bandpass', f: 600, f2: 3000, d: .5, v: .08, q: 1.8, delay: .1 }]); },
  bossDown() { sx([{ f: 160, f2: 40, d: 1.1, type: 'sawtooth', v: .1, lp: 700, lp2: 120 }, { n: 1, ft: 'lowpass', f: 3000, f2: 100, d: 1, v: .16 }, { f: 520, f2: 130, d: .9, type: 'triangle', v: .05, delay: .15 }]); },
  teamCombo() { sx([0, 4, 7, 12, 16, 19, 24].map((m, i) => ({ f: NF(72 + m), d: .26, type: 'triangle', v: .05, delay: i * .06 })).concat([{ f: 100, f2: 40, d: .5, v: .16, delay: .42 }, { n: 1, ft: 'highpass', f: 6000, d: .6, v: .03, delay: .42 }])); },
  turn() { sx([{ f: NF(79), d: .08, type: 'triangle', v: .04 }, { f: NF(86), d: .14, type: 'triangle', v: .04, delay: .07 }]); },
  clang() { sx([{ f: 1350, d: .3, type: 'square', v: .04, lp: 5000 }, { f: 2030, d: .35, v: .04 }, { n: 1, ft: 'highpass', f: 4000, d: .12, v: .09 }, { f: 190, f2: 90, d: .15, v: .1 }]); },
  petCheer() {
    const id = typeof petOn === 'function' ? petOn() : null, v = SPECIES_VOICE[id] || [1000, 1500, 'triangle', .15];
    sx([{ f: v[0], f2: v[1], d: v[3], type: v[2], v: .035, lp: 3600 }, { f: v[1], f2: v[0], d: v[3] * .7, type: v[2], v: .025, lp: 3600, delay: v[3] * .8 }]);
  },
  rarity(r = 0) { const base = [72, 74, 77, 79, 84][Math.min(4, Math.max(0, r))]; sx([0, 4, 7, 12].slice(0, 2 + Math.min(2, r)).map((m, i) => ({ f: NF(base + m), d: .24 + r * .06, type: 'triangle', v: .05, delay: i * .07 })).concat(r >= 3 ? [{ n: 1, ft: 'highpass', f: 6500, d: .6, v: .025, delay: .15 }] : [])); },
  forge() { sx([{ f: 180, f2: 90, d: .12, v: .12 }, { n: 1, ft: 'bandpass', f: 3500, d: .1, v: .08, q: 3 }, { f: NF(88), d: .3, v: .03, delay: .08 }]); },
  riser() { sx([{ f: 200, f2: 1600, d: .9, glide: .85, type: 'sawtooth', v: .04, lp: 700, lp2: 6000 }, { n: 1, ft: 'highpass', f: 800, f2: 7000, d: .9, v: .04 }]); },
  boom() { sx([{ f: 130, f2: 35, d: .8, v: .2 }, { n: 1, ft: 'lowpass', f: 2800, f2: 120, d: .7, v: .16 }]); },
  sparkle() { sx([0, 1, 2, 3, 4].map(i => ({ f: NF(88 + i * 3), d: .22, v: .025, delay: i * .05 }))); },
  digi() { sx([0, 1, 2, 3, 4, 5].map(i => ({ f: 700 + (i % 3) * 400, d: .04, type: 'square', v: .02, lp: 3500, delay: i * .06 }))); },
  footsteps() { sx([0, 1, 2, 3, 4, 5].map(i => ({ n: 1, ft: 'lowpass', f: 700, d: .07, v: .05, delay: i * .14 }))); },
  rain() { sx([{ n: 1, ft: 'highpass', f: 3000, d: 1.4, v: .03, a: .3 }]); },
  crackle() { sx(Array.from({ length: 6 }, (_, i) => ({ n: 1, ft: 'bandpass', f: 1800 + (i % 3) * 900, d: .04, v: .03, delay: i * .11 + (i % 2) * .03 }))); },
  quill() { sx([0, 1, 2, 3].map(i => ({ n: 1, ft: 'bandpass', f: 2400 + i * 200, d: .06, v: .025, delay: i * .1 }))); },
  question() { sx([{ f: NF(79), d: .12, type: 'triangle', v: .04 }, { f: NF(83), d: .22, type: 'triangle', v: .04, delay: .12 }]); }
});

/* a different rage sound for each boss kind (0 dragon ... 9 hydra), played when a rage move starts */
const RAGE_SFX = [
  () => sx([{ n: 1, ft: 'lowpass', f: 900, f2: 200, d: .9, v: .16 }, { f: 100, f2: 70, d: .9, type: 'sawtooth', v: .06, lp: 500 }, { n: 1, ft: 'highpass', f: 3000, d: .6, v: .05, delay: .2 }]),
  () => sx([{ f: 700, f2: 160, d: .7, type: 'sawtooth', v: .04, lp: 1100, vib: .04 }, { f: 90, f2: 50, d: .7, v: .1 }, { n: 1, ft: 'highpass', f: 5000, d: .4, v: .03, delay: .3 }]),
  () => sx([{ f: 55, f2: 40, d: 1, type: 'sawtooth', v: .1, lp: 260 }, { n: 1, ft: 'lowpass', f: 220, d: 1, v: .22 }, { f: 90, f2: 40, d: .3, v: .2, delay: .35 }]),
  () => sx([{ n: 1, ft: 'bandpass', f: 4200, f2: 900, d: .12, v: .1, q: 2 }, { n: 1, ft: 'bandpass', f: 4200, f2: 900, d: .12, v: .1, q: 2, delay: .16 }, { f: 1600, d: .25, type: 'square', v: .03, lp: 4500, delay: .3 }]),
  () => sx([60, 64, 67, 72, 76].map((m, i) => ({ f: NF(m + 12), d: .7, v: .035, delay: i * .05 })).concat([{ n: 1, ft: 'highpass', f: 6000, d: .5, v: .03 }])),
  () => sx([{ n: 1, ft: 'highpass', f: 3500, d: .25, v: .16 }, { n: 1, ft: 'lowpass', f: 600, f2: 120, d: 1.1, v: .22, delay: .1 }, { f: 70, f2: 38, d: .9, v: .14, delay: .1 }]),
  () => sx([0, 3, 7, 10, 14, 17].map((m, i) => ({ f: NF(84 + m), d: .4, v: .03, delay: i * .08 })).concat([{ n: 1, ft: 'highpass', f: 7000, d: .5, v: .03 }])),
  () => sx([0, 1, 2].flatMap(i => [{ f: 220, f2: 90, d: .2, type: 'sawtooth', v: .07, lp: 800, delay: i * .22 }, { n: 1, ft: 'bandpass', f: 2200, d: .06, v: .08, delay: i * .22 + .1 }])),
  () => sx([0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ f: i % 2 ? 1500 : 1100, d: .04, type: 'square', v: .03, lp: 3000, delay: i * .08 })).concat([{ f: 120, f2: 300, d: .6, type: 'sawtooth', v: .04, lp: 700, delay: .1 }])),
  () => sx([{ f: 200, f2: 520, d: .5, type: 'sine', v: .07 }, { f: 160, f2: 420, d: .5, type: 'sine', v: .05, delay: .08 }, { n: 1, ft: 'bandpass', f: 600, f2: 1800, d: .4, v: .06, q: 2, delay: .1 }])
];

/* ---------------- hearing the battle ---------------- */
HOOK.claim('famEvent', a => { if (a === 'pick' || a === 'vpick') sfx.pick(); return undefined; });
HOOK.on('nextQuestion', () => { if (B.active && B.q) sfx.qIn(); });
HOOK.on('answer:right', () => {
  if (!B.active) return;
  const n = (B.combo || 0) + 1;   // answer:right is sent before the combo goes up
  if (n >= 2 && n % FIN_EVERY !== 0) setTimeout(() => sfx.combo(n), 90);
  petCheer();
});
/* the pet hops and squeaks for every right answer */
function petCheer() {
  if (!petOn()) return;
  sfx.petCheer();
  if (S.sensory) return;
  const el = document.querySelector('#heroSprite .h-pet'); if (!el || !el.animate) return;
  el.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-14px) scale(1.12,.94)', offset: .4 }, { transform: 'translateY(0) scale(.96,1.05)', offset: .75 }, { transform: 'translateY(0) scale(1)' }], { duration: 520, easing: 'ease-out' });
}
/* the clock: a soft tick each second when under a quarter of the thinking time is left, and an alarm for a charged attack */
HOOK.on('thinkTick', () => {
  if (!B.active || !B.q || B.locked) return;
  if (B.tmax && B.tleft > 0 && B.tleft / B.tmax < .25) { const sec = Math.ceil(B.tleft / 1000); if (B._tk !== sec) { B._tk = sec; sfx.tick(); } }
  if (B.tele) { const step = Math.ceil(B.tele.left / 1000); if (B._tl !== step) { B._tl = step; if (B.tele.left / B.tele.max < .6) sfx.tick(); } }
  if (B.enraged && !B._enSeen) { B._enSeen = 1; sfx.enrage(); } else if (!B.enraged) B._enSeen = 0;
});
HOOK.on('nextQuestion', () => { B._tk = 0; B._tl = 0; if (B.tele) sfx.alarm(); });
HOOK.before('wrongPick', () => { if (B.active && B.hintSpeech && B.hintSpeech.length) setTimeout(() => sfx.hint(), 260); });
/* hearts, the boss's health, phases and helpers */
let hudPrev = null;
HOOK.on('updateHud', () => {
  const now = { h: B.hHp, m: B.mHp, ph: B.phase || 0, mn: (B.minions || []).length, rb: !!B.runeBroken, ba: !!B.barrier, lv: B.lv && B.lv.id };
  const p = hudPrev; hudPrev = now;
  if (!p || p.lv !== now.lv || !B.active) return;
  if (now.h > p.h) sfx.heal();
  if (now.m > p.m) sfx.drain();
  if (now.ph > p.ph) sfx.phase(now.ph);
  if (now.mn > p.mn) sfx.summon();
  if (now.ba && !p.ba) sfx.shield();
});
HOOK.on('startBattle', () => { hudPrev = null; });
HOOK.before('counterSeq', () => {
  if (!(bossOn() && B.phase === 3)) return;
  const r = rageOf(B.lv), arch = B.lv && B.lv.mon && Number.isInteger(B.lv.mon.arch) ? B.lv.mon.arch % 10 : -1;
  if (r && arch >= 0 && RAGE_SFX[arch]) setTimeout(RAGE_SFX[arch], 220);
});
HOOK.before('win', () => { if (B.lv && B.lv.big) sfx.bossDown(); });

/* ---------------- hearing the stories ---------------- */
const SHOT_SND = {
  chase: () => sfx.footsteps(), rain: () => sfx.rain(), campfire: () => sfx.crackle(), map: () => sfx.quill(), split: () => sfx.whoosh(),
  fork: () => sfx.question(), forkr: () => sfx.coin(), duel: () => { sfx.clang(); setTimeout(sfx.whoosh, 160); }
};
const EVO_SND = { glow: () => sfx.riser(), digi: () => sfx.digi(), burst: () => { sfx.boom(); setTimeout(sfx.sparkle, 120); }, ultra: () => { sfx.boom(); setTimeout(sfx.sparkle, 120); setTimeout(sfx.rarity, 380, 4); }, new: () => sfx.rarity(3) };
HOOK.on('comic:shot', c => {
  if (!c || c !== UI.comic || c.i < 1) return;
  const b = beatAt(c); if (!b) return;
  if (b.shot === 'evo') { (EVO_SND[b.prop || 'glow'] || EVO_SND.glow)(); return; }
  if (SHOT_SND[b.shot]) SHOT_SND[b.shot]();
});
