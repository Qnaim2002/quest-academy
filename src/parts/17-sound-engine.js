/* ================= v8: sound engine (music and effects are synthesised live: no audio files, works offline) ================= */
const AU = { ctx: null, master: null, fxBus: null, mus: null, noise: null, track: '', want: '', next: 0, step: 0, swapT: 0 };
const MUS_VOL = .5;
/* v21: volume sliders (Parent Portal). 80 is the old fixed level, so 100 is a little louder than before. */
const volK = (k, base = 80) => { const v = (S.vol || {})[k]; return (v === undefined ? base : v) / base; };
const musLevel = () => MUS_VOL * volK('music');
function applyVolume() {
  if (!AU.ctx) return; const now = AU.ctx.currentTime;
  AU.fxBus.gain.setTargetAtTime(volK('sfx'), now, .05);
  if (AU.track && musicOn() && AU.want) AU.mus.gain.setTargetAtTime(musLevel(), now, .1);
}
function auCtx() {
  try {
    if (!AU.ctx) {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      const c = new C(); AU.ctx = c;
      const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 5; comp.connect(c.destination);
      AU.master = c.createGain(); AU.master.gain.value = .9; AU.master.connect(comp);
      AU.fxBus = c.createGain(); AU.fxBus.gain.value = volK('sfx'); AU.fxBus.connect(AU.master);
      AU.mus = c.createGain(); AU.mus.gain.value = 0; AU.mus.connect(AU.master);
      const n = c.sampleRate, buf = c.createBuffer(1, n, n), d = buf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; AU.noise = buf;
    }
    if (AU.ctx.state === 'suspended' && !document.hidden) AU.ctx.resume().catch(() => { });
    return AU.ctx;
  } catch (e) { return null; }
}
const sfxOn = () => !!S.sfx && !S.sensory;
const musicOn = () => S.music !== false && !S.sensory;
const NF = m => 440 * Math.pow(2, (m - 69) / 12);
/* one synth voice: oscillator -> optional low-pass -> envelope -> bus */
function voice(o) {
  const c = AU.ctx; if (!c) return;
  const t0 = o.at != null ? o.at : c.currentTime + (o.delay || 0), d = o.d || .2, v = o.v || .05;
  const osc = c.createOscillator(), g = c.createGain(); osc.type = o.type || 'sine';
  osc.frequency.setValueAtTime(o.f, t0); if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t0 + (o.glide || d));
  if (o.det) osc.detune.value = o.det;
  if (o.vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = o.vibRate || 5.5; lg.gain.setValueAtTime(0, t0); lg.gain.linearRampToValueAtTime(o.f * o.vib, t0 + Math.min(.25, d * .5)); l.connect(lg); lg.connect(osc.frequency); l.start(t0); l.stop(t0 + d + .05); }   // v24: vibrato
  let node = osc;
  if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(o.lp, t0); if (o.lp2) f.frequency.exponentialRampToValueAtTime(o.lp2, t0 + d); f.Q.value = o.q || .7; node.connect(f); node = f; }
  const a = o.a || .008;
  g.gain.setValueAtTime(.0001, t0); g.gain.linearRampToValueAtTime(v, t0 + a);
  if (o.sus) { g.gain.setValueAtTime(v, Math.max(t0 + a, t0 + d - (o.r || .1))); g.gain.linearRampToValueAtTime(.0001, t0 + d); }
  else g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
  node.connect(g); g.connect(o.bus || AU.fxBus); osc.start(t0); osc.stop(t0 + d + .05);
}
/* filtered noise: whooshes, impacts, drums */
function hiss(o) {
  const c = AU.ctx; if (!c) return;
  const t0 = o.at != null ? o.at : c.currentTime + (o.delay || 0), d = o.d || .1;
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = AU.noise;
  f.type = o.ft || 'bandpass'; f.frequency.setValueAtTime(o.f || 1500, t0); if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t0 + d); f.Q.value = o.q || 1;
  g.gain.setValueAtTime(.0001, t0); g.gain.linearRampToValueAtTime(o.v || .05, t0 + (o.a || .005)); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
  s.connect(f); f.connect(g); g.connect(o.bus || AU.fxBus); s.start(t0, Math.random() * .4); s.stop(t0 + d + .05);
}
function sx(list) { if (!sfxOn() || !auCtx()) return; try { list.forEach(o => (o.n ? hiss : voice)(o)); } catch (e) { /* audio unavailable */ } }

Object.assign(sfx, {
  tap() { sx([{ f: 1046, d: .06, type: 'triangle', v: .035 }, { f: 1568, d: .05, v: .018, delay: .02 }]); },
  ok() { sx([[72, 0], [76, .06], [79, .12], [84, .18]].map(([m, dl]) => ({ f: NF(m), d: .24, type: 'triangle', v: .06, delay: dl })).concat([{ n: 1, ft: 'highpass', f: 6000, d: .35, v: .015, delay: .12 }])); },
  soft() { sx([{ f: 520, f2: 390, d: .18, v: .06 }, { f: 390, f2: 330, d: .22, v: .05, delay: .13 }]); },
  pop() { sx([{ f: 600, f2: 900, d: .09, v: .05 }]); },
  whoosh() { sx([{ n: 1, ft: 'bandpass', f: 500, f2: 2600, d: .26, v: .08, q: 1.2 }]); },
  hit() { sx([{ f: 180, f2: 55, d: .22, v: .16 }, { n: 1, ft: 'lowpass', f: 2200, f2: 400, d: .14, v: .1 }, { f: 90, d: .12, type: 'triangle', v: .08 }]); },
  crit() { sx([{ f: 220, f2: 50, d: .3, v: .18 }, { n: 1, ft: 'lowpass', f: 3000, f2: 300, d: .22, v: .12 }].concat([79, 83, 86, 91].map((m, i) => ({ f: NF(m), d: .2, type: 'square', v: .022, lp: 3200, delay: .05 + i * .06 })))); },
  block() { sx([{ f: 1250, d: .14, type: 'square', v: .03, lp: 4000 }, { f: 1870, d: .3, v: .04, delay: .02 }, { n: 1, ft: 'highpass', f: 5000, d: .08, v: .05 }]); },
  growl() { sx([{ f: 120, f2: 80, d: .38, type: 'sawtooth', v: .07, lp: 700, lp2: 300 }, { f: 123, f2: 82, d: .38, type: 'sawtooth', v: .05, lp: 600, det: 12 }]); },
  spit() { sx([{ f: 300, f2: 900, d: .18, type: 'triangle', v: .06 }, { n: 1, ft: 'bandpass', f: 1200, f2: 3000, d: .2, v: .04 }]); },
  hurt() { sx([{ f: 420, f2: 210, d: .22, type: 'triangle', v: .09 }, { n: 1, ft: 'lowpass', f: 1600, d: .12, v: .07 }]); },
  coin() { sx([{ f: NF(88), d: .07, type: 'square', v: .022, lp: 5000 }, { f: NF(93), d: .2, type: 'square', v: .022, lp: 5000, delay: .07 }]); },
  win() {
    sx([[72, 0, .14], [76, .14, .14], [79, .28, .14], [84, .42, .55]].map(([m, dl, d]) => ({ f: NF(m), d, type: 'triangle', v: .08, delay: dl }))
      .concat([60, 64, 67, 72].map(m => ({ f: NF(m), d: .95, v: .035, delay: .42 })), [{ n: 1, ft: 'highpass', f: 7000, d: .8, v: .02, delay: .42 }]));
  },
  star(i) { sx([{ f: NF(79 + i * 5), d: .35, type: 'triangle', v: .07 }, { f: NF(91 + i * 5), d: .3, v: .03, delay: .02 }]); },
  charge(i) { sx([{ f: NF(74 + i * 4), d: .14, type: 'triangle', v: .05 }, { f: NF(86 + i * 4), d: .12, v: .025, delay: .03 }]); },
  superUp() { sx([{ f: 160, f2: 1400, d: .5, glide: .45, type: 'sawtooth', v: .05, lp: 500, lp2: 5000 }, { n: 1, ft: 'bandpass', f: 400, f2: 4000, d: .5, v: .05 }]); },
  ko() { sx([{ f: 520, f2: 180, d: .7, type: 'triangle', v: .07 }, { f: 260, f2: 90, d: .7, v: .05, delay: .1 }]); },
  revive() { sx([60, 64, 67, 72, 76, 79, 84].map((m, i) => ({ f: NF(m + 12), d: .3, v: .05, delay: i * .06 })).concat([{ n: 1, ft: 'highpass', f: 6000, d: .7, v: .025 }])); },
  shatter() { sx(Array.from({ length: 7 }, (_, i) => ({ f: 2000 + Math.random() * 3000, d: .25 + Math.random() * .2, v: .03, delay: i * .025 })).concat([{ n: 1, ft: 'highpass', f: 3500, d: .4, v: .09 }])); },
  fog() { sx([{ n: 1, ft: 'highpass', f: 1200, f2: 4000, d: .35, v: .05 }]); },
  open() { sx([{ f: 660, d: .09, v: .05 }, { f: 990, d: .12, v: .04, delay: .06 }]); },
  enter() { sx([{ f: 200, f2: 520, d: .3, type: 'triangle', v: .05 }, { n: 1, ft: 'bandpass', f: 800, f2: 2000, d: .3, v: .03 }]); }
});

/* ---- music: three looping 8-bar songs (calm map, upbeat battle, boss) ---- */
const CHORD = { M: [0, 4, 7], m: [0, 3, 7], M7: [0, 4, 7, 11], m7: [0, 3, 7, 10], D7: [0, 4, 7, 10], sus: [0, 5, 7], dim: [0, 3, 6], M6: [0, 4, 7, 9] };   // v33: more chord colours
const HD = '_';   // holds the previous melody note
const SONGS = {
  map: { bpm: 92, key: 60, prog: [[0, 'M'], [9, 'm'], [5, 'M'], [7, 'M']], lead: 'bell', drums: 0, bass: 'soft',
    mel: [16, HD, 19, HD, 24, HD, 19, 16, 21, HD, 19, 16, 12, HD, 16, HD, 17, HD, 21, HD, 24, HD, 21, 19, 19, HD, 14, HD, 11, HD, HD, HD,
      24, HD, 19, HD, 16, 19, 24, HD, 21, HD, HD, 19, 16, HD, 12, HD, 17, 19, 21, HD, 17, HD, 12, HD, 14, HD, 11, 14, 19, HD, HD, HD] },
  battle: { bpm: 124, key: 62, prog: [[0, 'M'], [7, 'M'], [9, 'm'], [5, 'M']], lead: 'pluck', drums: 1, bass: 'pump',
    mel: [12, 14, 16, HD, 19, HD, 16, 14, 19, HD, 16, 14, 11, HD, 14, HD, 21, HD, 19, 16, 14, HD, 16, 19, 17, HD, 16, 14, 12, HD, HD, HD,
      24, HD, 21, 19, 16, HD, 19, HD, 23, HD, 19, HD, 16, 14, 11, HD, 21, 19, 16, 19, 21, HD, 24, HD, 21, HD, 19, HD, 17, 16, 14, HD] },
  boss: { bpm: 134, key: 57, prog: [[0, 'm'], [8, 'M'], [10, 'M'], [7, 'M']], lead: 'square', drums: 2, bass: 'drive',
    mel: [12, HD, 15, 12, 19, HD, 17, 15, 20, HD, 19, HD, 17, 15, 12, HD, 22, HD, 19, HD, 17, HD, 14, HD, 19, HD, 23, HD, 19, HD, 14, HD,
      24, HD, 22, HD, 19, HD, 15, HD, 20, 19, 17, 15, 17, HD, 12, HD, 22, HD, 19, HD, 17, 19, 22, HD, 23, HD, HD, HD, 19, HD, HD, HD] },
  /* v21: one more map song and one more battle song for each zone mood (zones 1-3 bright, 4-6 mystic, 7-10 wild),
     and an epic song for the zone bosses */
  map2: { bpm: 84, key: 62, prog: [[0, 'm'], [5, 'M'], [3, 'M'], [10, 'M']], lead: 'bell', drums: 0, bass: 'soft',
    mel: [12, HD, 10, HD, 7, HD, 9, HD, 14, HD, 12, HD, 9, HD, 7, HD, 15, HD, 14, 12, 10, HD, 12, HD, 7, HD, HD, HD, 5, HD, 7, HD,
      12, HD, 15, HD, 14, 12, 10, HD, 9, HD, 7, HD, 14, HD, HD, HD, 10, 12, 14, HD, 15, HD, 17, HD, 14, HD, 12, HD, 10, HD, HD, HD] },
  map3: { bpm: 100, key: 65, prog: [[0, 'M'], [2, 'M'], [9, 'm'], [7, 'M']], lead: 'pluck', drums: 0, bass: 'soft',
    mel: [7, HD, 9, 11, 12, HD, 11, 9, 7, HD, 4, HD, 2, HD, HD, HD, 9, HD, 12, HD, 16, HD, 14, 12, 11, HD, 9, HD, 7, HD, HD, HD,
      12, HD, 14, HD, 16, 14, 12, HD, 14, HD, 11, HD, 9, HD, 7, HD, 4, 7, 9, HD, 12, HD, 9, HD, 7, HD, HD, HD, HD, HD, HD, HD] },
  battle2: { bpm: 118, key: 64, prog: [[0, 'm'], [8, 'M'], [3, 'M'], [10, 'M']], lead: 'pluck', drums: 1, bass: 'pump',
    mel: [12, HD, 15, HD, 19, HD, 17, 15, 20, HD, 19, HD, 15, HD, 12, HD, 15, HD, 19, HD, 22, HD, 19, 17, 17, HD, 14, HD, 10, HD, HD, HD,
      24, HD, 22, HD, 19, HD, 15, HD, 20, 19, 15, HD, 12, HD, 15, HD, 19, HD, 22, HD, 19, 17, 15, HD, 14, HD, 17, HD, 22, HD, HD, HD] },
  battle3: { bpm: 140, key: 57, prog: [[0, 'M'], [10, 'M'], [5, 'M'], [0, 'M']], lead: 'square', drums: 1, bass: 'drive',
    mel: [12, 12, 16, HD, 19, HD, 16, 12, 22, HD, 19, HD, 17, HD, 16, HD, 17, 17, 21, HD, 24, HD, 21, 17, 16, HD, 14, HD, 12, HD, HD, HD,
      19, HD, 22, HD, 24, 22, 19, HD, 22, HD, 19, 16, 14, HD, 10, HD, 17, HD, 21, 24, 21, HD, 17, HD, 16, HD, 12, HD, HD, HD, HD, HD] },
  /* v22: the story theme: slow, wide and heroic (D minor to F major), soft drums */
  saga: { bpm: 76, key: 62, prog: [[0, 'm'], [10, 'M'], [3, 'M'], [8, 'M']], lead: 'bell', drums: 0, bass: 'soft',
    mel: [12, HD, HD, HD, 15, HD, 19, HD, 22, HD, HD, 19, 17, HD, 14, HD, 15, HD, 19, HD, 22, HD, 24, HD, 20, HD, HD, HD, 19, HD, HD, HD,
      24, HD, 22, HD, 19, HD, 15, HD, 17, HD, 22, HD, 26, HD, HD, HD, 27, HD, 26, 24, 22, HD, 19, HD, 20, HD, 19, HD, 15, HD, HD, HD] },
  boss2: { bpm: 128, key: 62, prog: [[0, 'm'], [10, 'M'], [8, 'M'], [7, 'M']], lead: 'square', drums: 2, bass: 'drive',
    mel: [12, HD, HD, 15, 19, HD, 15, 12, 22, HD, 17, HD, 14, HD, 10, HD, 20, HD, 17, 15, 12, HD, 8, HD, 11, HD, 14, HD, 19, HD, HD, HD,
      24, HD, 22, HD, 19, HD, 15, HD, 22, HD, 19, 17, 14, HD, 10, HD, 15, 17, 20, HD, 24, HD, 20, HD, 23, HD, 19, HD, 14, HD, 11, HD] }
};
/* v33: more instruments, basses and beats for the new songs (34-v33-audio.js). A song picks them by name:
   lead: flute, mallet, box, harp, brass, organ, pad, kalimba     bass: walk, off, sub, none     drums: 3 march, 4 latin, 5 half-time, 6 brush, 7 dance */
const LEADS = {
  flute: (f, d, bus, at) => { voice({ f, d: d + .12, v: .05, a: .05, vib: .012, sus: true, r: .12, bus, at }); hiss({ ft: 'bandpass', f: f * 2, q: 6, d: Math.min(.25, d), v: .005, bus, at }); },
  mallet: (f, d, bus, at) => { voice({ f, d: .5, v: .07, bus, at }); voice({ f: f * 4, d: .08, v: .012, bus, at }); },
  box: (f, d, bus, at) => { voice({ f: f * 2, d: .55, v: .04, bus, at }); voice({ f: f * 4.02, d: .2, v: .01, bus, at }); },
  harp: (f, d, bus, at, tones) => { [0, 1, 2].forEach((m, i) => voice({ f: f * [1, 1.26, 1.5][i], d: .8, type: 'triangle', v: i ? .02 : .04, lp: 3400, bus, at: at + i * .04 })); },
  brass: (f, d, bus, at) => { voice({ f, d: d * .9 + .1, type: 'sawtooth', v: .03, a: .05, lp: 800, lp2: 2600, sus: true, r: .1, vib: .005, bus, at }); },
  organ: (f, d, bus, at) => { [1, 2, 3].forEach((m, i) => voice({ f: f * m, d: d + .1, v: [.03, .018, .01][i], a: .03, sus: true, r: .08, bus, at })); },
  pad: (f, d, bus, at) => { voice({ f, d: d + .5, type: 'triangle', v: .04, a: .18, sus: true, r: .35, lp: 1800, bus, at }); voice({ f: f * 1.004, d: d + .5, type: 'sine', v: .02, a: .2, sus: true, r: .35, bus, at }); },
  kalimba: (f, d, bus, at) => { voice({ f, d: .38, type: 'triangle', v: .06, lp: 4200, bus, at }); voice({ f: f * 5.4, d: .06, v: .008, bus, at }); }
};
const BASSES = {
  walk: (pos, root, tones, e16, beat, bus, at) => { if (pos % 4 === 0) { const q = [0, tones[1] || 4, tones[2] || 7, tones[1] || 4][(pos >> 2) % 4]; voice({ f: NF(root - 12 + q), d: beat * .9, type: 'triangle', v: .09, lp: 1000, bus, at }); } },
  off: (pos, root, tones, e16, beat, bus, at) => { if (pos % 4 === 2) voice({ f: NF(root - 12), d: e16 * 2.2, type: 'triangle', v: .09, lp: 900, bus, at }); if (pos === 0) voice({ f: NF(root - 24), d: beat * 1.5, v: .08, bus, at }); },
  sub: (pos, root, tones, e16, beat, bus, at) => { if (pos === 0) voice({ f: NF(root - 24), d: beat * 3.6, v: .1, a: .05, sus: true, r: .3, bus, at }); if (pos === 10) voice({ f: NF(root - 17), d: beat, v: .07, bus, at }); }
};
const DRUMS = {
  3: (pos, bus, at, e16) => { if (pos === 0 || pos === 8) voice({ f: 150, f2: 45, d: .18, v: .2, bus, at }); if (pos === 4 || pos === 12 || pos === 14) { hiss({ ft: 'bandpass', f: 1900, d: .1, v: .07, bus, at }); voice({ f: 220, f2: 140, d: .07, type: 'triangle', v: .04, bus, at }); } if (pos % 4 === 2) hiss({ ft: 'highpass', f: 7500, d: .03, v: .02, bus, at }); },
  4: (pos, bus, at, e16) => { if (pos === 0 || pos === 6 || pos === 10) voice({ f: 140, f2: 50, d: .16, v: .19, bus, at }); if (pos % 4 === 3) hiss({ ft: 'bandpass', f: 3200, q: 3, d: .05, v: .05, bus, at }); if (pos === 2 || pos === 10) voice({ f: 820, d: .06, type: 'square', v: .014, lp: 2600, bus, at }); if (pos === 12) hiss({ ft: 'bandpass', f: 1700, d: .1, v: .06, bus, at }); if (pos % 2 === 0) hiss({ ft: 'highpass', f: 8000, d: .025, v: .012, bus, at }); },
  5: (pos, bus, at, e16) => { if (pos === 0 || pos === 10) voice({ f: 130, f2: 40, d: .22, v: .22, bus, at }); if (pos === 8) { hiss({ ft: 'bandpass', f: 1500, d: .18, v: .09, bus, at }); voice({ f: 190, f2: 100, d: .12, type: 'triangle', v: .06, bus, at }); } if (pos % 2 === 0) hiss({ ft: 'highpass', f: 7000, d: .03, v: .012, bus, at }); },
  6: (pos, bus, at, e16) => { if (pos === 0) voice({ f: 120, f2: 55, d: .2, v: .1, bus, at }); hiss({ ft: 'highpass', f: pos % 4 === 0 ? 5200 : 7200, d: pos % 4 === 0 ? .09 : .04, v: pos % 4 === 0 ? .016 : .008, bus, at }); if (pos === 8) hiss({ ft: 'bandpass', f: 1800, d: .1, v: .02, bus, at }); },
  7: (pos, bus, at, e16) => { if (pos % 4 === 0) voice({ f: 150, f2: 45, d: .16, v: .2, bus, at }); if (pos === 4 || pos === 12) hiss({ ft: 'bandpass', f: 2200, q: 1.5, d: .09, v: .07, bus, at }); if (pos % 4 === 2) hiss({ ft: 'highpass', f: 8500, d: .06, v: .026, bus, at }); }
};
/* v21: dynamic music. Layers join as the monster's health drops (0 = full, 1 = two thirds, 2 = one third)
   and in a zone boss's third phase (3): sixteenth hi-hats and an echo line, then doubled bass and snare
   pick-ups, then toms, crashes and a high lead double, with the tempo nudged up a little each time. */
function musIntensity() {
  if (!(B.active && B.lv && UI.tab === 'adventure' && UI.adv === 'battle') || S.sensory) return 0;
  if (typeof bossOn === 'function' && bossOn() && B.phase === 3) return 3;
  const r = B.mMax ? B.mHp / B.mMax : 1;
  return r <= .34 ? 2 : r <= .67 ? 1 : 0;
}
function musStep(song, s, at, e16, I = 0) {
  const bar = s >> 4, pos = s & 15, [off, ty] = song.prog[bar % 4], root = song.key + off, tones = CHORD[ty], bus = AU.mus, beat = e16 * 4;
  if (pos === 0) tones.forEach(tt => voice({ f: NF(root + tt), d: beat * 4, type: 'triangle', v: .02, lp: 1300, a: .3, sus: true, r: .35, bus, at }));
  /* bass */
  if (song.bass === 'soft' && (pos === 0 || pos === 8)) voice({ f: NF(root - 12), d: beat * 1.7, v: .09, bus, at });
  if (song.bass === 'pump' && pos % 2 === 0) voice({ f: NF(root - (pos % 4 ? 12 : 24)), d: e16 * 1.8, type: 'triangle', v: .1, lp: 900, bus, at });
  if (song.bass === 'drive' && pos % 2 === 0) voice({ f: NF(root - 24), d: e16 * 1.6, type: 'sawtooth', v: .055, lp: 520, bus, at });
  if (BASSES[song.bass]) BASSES[song.bass](pos, root, tones, e16, beat, bus, at);   // v33: walking, off-beat and sub basses
  /* lead melody on eighth notes; '_' holds the previous note */
  if (pos % 2 === 0) {
    const i = (bar % 8) * 8 + pos / 2, n = song.mel[i];
    if (typeof n === 'number') {
      let len = 1; while (song.mel[i + len] === HD && (i + len) % 8 !== 0) len++;
      const d = len * e16 * 2, f = NF(song.key + n);
      if (LEADS[song.lead]) LEADS[song.lead](f, d, bus, at, tones, root);   // v33: flute, marimba, music box, harp, brass, organ and pad leads
      else if (song.lead === 'bell') { voice({ f, d: d + .35, v: .05, bus, at }); voice({ f: f * 2, d: .5, v: .012, bus, at }); }
      else if (song.lead === 'pluck') { voice({ f, d: d * .95, type: 'triangle', v: .06, lp: 3200, bus, at }); voice({ f, d: d * .6, type: 'square', v: .01, lp: 2400, bus, at }); }
      else voice({ f, d: d * .95, type: 'square', v: .026, lp: 2200, bus, at });
    }
  }
  zoneMotif(bar, pos, at, e16, root, tones, song);   // v24: the zone's own instrument
  /* soft arpeggio on the calm song */
  if ((song.lead === 'bell' || song.arp) && pos % 4 === 2) voice({ f: NF(root + 12 + tones[(pos >> 2) % 3]), d: .3, v: .016, bus, at });
  /* drums */
  if (song.drums === 0 && pos % 4 === 2) hiss({ ft: 'highpass', f: 6500, d: .035, v: .01, bus, at });
  if (DRUMS[song.drums]) DRUMS[song.drums](pos, bus, at, e16);   // v33: march, latin, half-time, brush and dance beats
  else if (song.drums >= 1) {
    const kicks = song.drums === 2 ? [0, 7, 8, 14] : [0, 8];
    if (kicks.includes(pos)) voice({ f: 150, f2: 45, d: .18, v: .22, bus, at });
    if (pos === 4 || pos === 12) { hiss({ ft: 'bandpass', f: 1800, d: .12, v: .06, bus, at }); voice({ f: 210, f2: 130, d: .08, type: 'triangle', v: .04, bus, at }); }
    if (song.drums === 2 || pos % 2 === 0) hiss({ ft: 'highpass', f: 7000, d: pos === 14 ? .12 : .035, v: .02, bus, at });
  }
  if (!I || !song.drums || (song.drums > 2 && !song.layers)) return;
  /* intensity layers (battle songs only) */
  if (song.drums === 1 || pos % 2) hiss({ ft: 'highpass', f: 8500, d: .025, v: pos % 4 === 0 ? .016 : .009, bus, at });
  if (pos % 4 === 0) voice({ f: NF(root + 12 + tones[(pos >> 2) % 3]), d: e16 * 1.6, type: 'triangle', v: .022, lp: 2600, bus, at });
  if (I >= 2) {
    if (pos % 2) voice({ f: NF(root - 12), d: e16 * .9, type: 'triangle', v: .05, lp: 800, bus, at });
    if (pos === 14 || pos === 15) hiss({ ft: 'bandpass', f: 1900, d: .07, v: .035, bus, at });
  }
  if (I >= 3) {
    if (pos === 0 && bar % 2 === 0) hiss({ ft: 'highpass', f: 4500, d: .7, v: .035, bus, at });
    if (pos === 6 || pos === 10 || pos === 13) voice({ f: pos === 13 ? 120 : 190, f2: pos === 13 ? 70 : 100, d: .16, v: .12, bus, at });
    if (pos % 2 === 0) { const i = (bar % 8) * 8 + pos / 2, n = song.mel[i]; if (typeof n === 'number') voice({ f: NF(song.key + n + 12), d: e16 * 1.5, type: 'square', v: .009, lp: 3600, bus, at }); }
  }
}
function musTick() {
  AU.zone = musicZone();
  const c = AU.ctx; if (!c || !AU.track || c.state !== 'running') return;
  const I = musIntensity(), song = SONGS[AU.track], e16 = 60 / (song.bpm * (1 + I * .035)) / 4;
  if (I > (AU.int || 0) && song.drums) hiss({ ft: 'bandpass', f: 400, f2: 5000, d: .45, v: .05, q: 1.4, bus: AU.mus });   // a short riser when a layer joins
  AU.int = I;
  if (AU.next < c.currentTime - .2) AU.next = c.currentTime + .05;   // fell behind (the tab was hidden)
  let guard = 0;
  while (AU.next < c.currentTime + .2 && guard++ < 16) { try { musStep(song, AU.step, AU.next, e16, I); } catch (e) { /* skip */ } AU.next += e16; AU.step = (AU.step + 1) % 128; }
}
setInterval(musTick, 50);
function setMusic(name) {
  AU.want = name;
  if (!AU.ctx && navigator.userActivation && !navigator.userActivation.hasBeenActive) return;   // wait for the first tap
  const c =musicOn() && name ? auCtx() : AU.ctx; if (!c) return;
  const g = AU.mus.gain, now = c.currentTime;
  if (!musicOn() || !name) { g.cancelScheduledValues(now); g.setTargetAtTime(0, now, .12); clearTimeout(AU.swapT); AU.swapT = setTimeout(() => { if (!musicOn() || !AU.want) AU.track = ''; }, 600); return; }
  if (AU.track === name) { g.cancelScheduledValues(now); g.setTargetAtTime(musLevel(), now, .3); return; }
  g.cancelScheduledValues(now); g.setTargetAtTime(0, now, .08); clearTimeout(AU.swapT);
  AU.swapT = setTimeout(() => {
    if (AU.want !== name || !musicOn()) return;
    AU.track = name; AU.step = 0; AU.next = c.currentTime + .08;
    g.cancelScheduledValues(c.currentTime); g.setTargetAtTime(musLevel(), c.currentTime, .4);
  }, AU.track ? 380 : 0);
}
const zoneMood = z => (z || 0) < 3 ? 0 : z < 6 ? 1 : 2;
function musicFor() { return HOOK.call('musicFor', musicForBase, arguments); }   // v33: more situations have their own music (34)
function musicForBase() {
  if (UI.comic) return typeof comicTune === 'function' ? comicTune() : 'saga';   // v22: stories have their own theme (v32: sad, tense and triumph tunes follow each scene)
  if (UI.tab === 'adventure' && B.active && B.lv) return B.lv.big ? 'boss2' : B.lv.boss ? 'boss' : ['battle', 'battle2', 'battle3'][zoneMood(B.lv.z)];
  if (UI.tab === 'adventure' && UI.screen === 'levels' && UI.zoneOpen[UI.subj] >= 0) return ['map', 'map2', 'map3'][zoneMood(UI.zoneOpen[UI.subj])];
  return 'map';
}
function syncMusic() { setMusic(musicOn() ? musicFor() : ''); updMusBtn(); }
function updMusBtn() {
  const b = $('#musBtn'); if (!b) return; const on = musicOn();
  b.classList.toggle('off', !on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.setAttribute('aria-label', t(on ? 'mus.turnOff' : 'mus.turnOn'));
}
/* browsers only allow sound after the first tap */
document.addEventListener('pointerdown', () => { if (!sfxOn() && !musicOn()) return; auCtx(); if (musicOn() && AU.track !== musicFor()) syncMusic(); }, true);
document.addEventListener('visibilitychange', () => { if (!AU.ctx) return; if (document.hidden) AU.ctx.suspend().catch(() => { }); else if (musicOn() || sfxOn()) AU.ctx.resume().catch(() => { }); });

/* ================= v8: battle helpers ================= */
fx.dust = (x, y) => {
  if (S.sensory || !fx.layer()) return;
  for (let i = 0; i < 4; i++) {
    const d = document.createElement('i'), dir = i < 2 ? -1 : 1; d.className = 'fxdust'; d.style.left = x + 'px'; d.style.top = y + 'px'; fx.layer().appendChild(d);
    d.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: .9 }, { transform: `translate(calc(-50% + ${dir * (16 + (i % 2) * 14)}px),calc(-50% - ${6 + i * 3}px)) scale(1.4)`, opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => d.remove();
  }
};
function flashSprite(el) { if (S.sensory || !el) return; replayClass(el, 'hitflash'); setTimeout(() => el.classList.remove('hitflash'), 170); }
/* the monster sometimes throws a glowing orb instead of charging in */
function monShot(pm, ph) {
  return new Promise(res => {
    const L = fx.layer(); if (!L || S.sensory) { res(); return; }
    const col = PAL[B.lv.mon.c] || '#B28CFF', o = document.createElement('div'); o.className = 'fxorb'; o.style.setProperty('--c', col); L.appendChild(o);
    const x0 = pm.x - pm.w * .3, y0 = pm.y - pm.h * .05, x1 = ph.x + ph.w * .1, y1 = ph.y;
    const an = o.animate([{ transform: `translate(${x0}px,${y0}px) scale(.3)` }, { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 60}px) scale(1.15)`, offset: .5 }, { transform: `translate(${x1}px,${y1}px) scale(.9)` }], { duration: 460, easing: 'cubic-bezier(.4,0,.6,1)' });
    an.onfinish = () => { o.remove(); res(); }; an.oncancel = () => { o.remove(); res(); };
  });
}
function owlFly(ph) {
  const L = fx.layer(), st = $('#stage'); if (!L || !st || S.sensory) return;
  const o = document.createElement('div'), W = st.getBoundingClientRect().width; o.className = 'fxowl'; o.innerHTML = owlSVG(); L.appendChild(o);
  o.animate([{ transform: `translate(${W * .55}px,-90px) scale(.6) rotate(-10deg)`, opacity: 0 }, { transform: `translate(${ph.x - 36}px,${ph.y - ph.h * .95}px) scale(1) rotate(6deg)`, opacity: 1, offset: .4 },
    { transform: `translate(${ph.x - 36}px,${ph.y - ph.h * 1.02}px) scale(1.06) rotate(-4deg)`, opacity: 1, offset: .72 }, { transform: `translate(${ph.x - 160}px,-100px) scale(.6) rotate(-14deg)`, opacity: 0 }], { duration: 1700, easing: 'ease-in-out' }).onfinish = () => o.remove();
}
/* the hero can now run out of hearts: Hoot flies in and helps them up (no progress is lost, the win just gives one star less) */
function heroKO() { return HOOK.call('heroKO', heroKOBase, arguments); }   // v31: extensions register with HOOK (00c)
async function heroKOBase() {
  const tk = B.token, h = hs(), ph = fx.pos(h);
  B.ko = (B.ko || 0) + 1; B.combo = 0; B.charge = 0; updateHud();
  sfx.ko(); h.classList.add('ko'); fx.num(ph.x, ph.y - ph.h * .5, t('ko.oops'), 'warn');
  await wait(S.sensory ? 300 : 1000); if (B.token !== tk) return false;
  owlFly(ph);
  await wait(S.sensory ? 100 : 700); if (B.token !== tk) return false;
  h.classList.remove('ko'); B.hHp = Math.round(B.hMax * .6); sfx.revive();
  fx.burst(ph.x, ph.y, 16, ['✨', '💖', '⭐']); fx.ring(ph.x, ph.y, '#FFD166', 160); fx.num(ph.x, ph.y - ph.h * .6, t('ko.up'), 'safe');
  B.lead = ''; setMsg(t('ko.hoot')); updateHud(); pose(h, 'cheer', 900);
  await wait(S.sensory ? 100 : 500);
  return B.token === tk;
}
/* more answer choices: a wrong answer borrowed from another question of the same kind */
const OPT_N = 4;
function borrowWrong(list, it, have, keep) {
  for (const x of shuffle(list.filter(y => y !== it && (!keep || keep(y))))) {
    const b = x[S.lang] || [x.text, x.answer, x.wrongs[0], x.wrongs[1]], w = pick([b[2], b[3]]);
    if (w && !have.includes(w)) return w;
  }
  return null;
}
let ALLWORDS = null;
const isWord = w => { if (!ALLWORDS) ALLWORDS = new Set(Object.values(WORDS).flat().map(x => x[0])); return ALLWORDS.has(w); };

Object.assign(STR, {
  'v.retry': ['Retry', 'Cuba lagi'],
  'b.super': ['Super attack!', 'Serangan super!'],
  'b.charge': ['Super meter: {n} of 3', 'Meter super: {n} daripada 3'],
  'ko.oops': ['Oof!', 'Aduh!'],
  'ko.up': ['Back up!', 'Bangun semula!'],
  'ko.hoot': ['Hoot helped you up! Take a breath and try again.', 'Hoot bantu anda bangun! Tarik nafas dan cuba lagi.'],
  'ko.note': ['Hoot helped you up in this battle, so the win gives one star less. Retry for more stars!', 'Hoot membantu anda dalam pertarungan ini, jadi kurang satu bintang. Cuba lagi untuk lebih bintang!'],
  'pp.music': ['Music: {s}', 'Muzik: {s}'],
  'mus.turnOn': ['Turn music on', 'Hidupkan muzik'],
  'mus.turnOff': ['Turn music off', 'Matikan muzik'],
  'mus.on': ['Music on', 'Muzik dihidupkan'],
  'mus.off': ['Music off', 'Muzik dimatikan']
});

function phonDecoy(band, parts) { const p = shuffle(PHON[band].flatMap(x => x[2]).filter(x => !parts.includes(x))); return p.length ? [p[0]] : []; }

/* ================= v24: per-zone music motifs =================
   Every zone has a signature instrument built from the same little synth (oscillators, filters, noise):
   1 flute, 2 marimba, 3 harp, 4 gamelan bonang, 5 glockenspiel, 6 desert oud, 7 music box, 8 brass horn,
   9 kompang drums, 10 pipe organ. The instrument answers the melody with a short call-and-response motif at the
   end of every phrase, plays a soft counter-line in the zone's battles, and greets the child when the zone opens
   on the map. Music follows the zone the child is in: the battle level's zone, the open zone on the map, or the
   zone of the story being told. */
function musicZone() {
  if (UI.comic && UI.comic.z >= 0) return UI.comic.z;
  if (B.active && B.lv && UI.tab === 'adventure') return Math.max(0, Math.min(9, B.lv.z || 0));
  if (UI.tab === 'adventure' && UI.screen === 'levels' && UI.zoneOpen && UI.zoneOpen[UI.subj] >= 0) return UI.zoneOpen[UI.subj];
  return -1;
}
const ZINSTR = [
  /* 0 flute: soft sine with breath and a gentle vibrato */
  (f, d, at, bus, v = 1) => { voice({ f, d: d + .1, v: .045 * v, a: .06, vib: .012, sus: true, r: .12, bus, at }); hiss({ ft: 'bandpass', f: f * 2, q: 6, d: Math.min(.25, d), v: .006 * v, bus, at }); },
  /* 1 marimba: a wooden bar, quick decay with a bright 4x partial */
  (f, d, at, bus, v = 1) => { voice({ f, d: .45, v: .07 * v, bus, at }); voice({ f: f * 4, d: .08, v: .012 * v, bus, at }); },
  /* 2 harp: a plucked string, rolled as a little arpeggio */
  (f, d, at, bus, v = 1) => { [0, 1.26, 1.5].forEach((m, i) => voice({ f: f * (i ? m : 1), d: .9, type: 'triangle', v: (i ? .022 : .04) * v, lp: 3400, bus, at: at + i * .045 })); },
  /* 3 gamelan bonang: a bronze gong pot with an inharmonic shimmer */
  (f, d, at, bus, v = 1) => { voice({ f, d: 1.1, v: .05 * v, bus, at }); voice({ f: f * 2.76, d: .5, v: .016 * v, bus, at }); voice({ f: f * 1.003, d: 1.1, v: .02 * v, bus, at, det: 6 }); },
  /* 4 glockenspiel: a high metal bar */
  (f, d, at, bus, v = 1) => { voice({ f: f * 2, d: .7, v: .05 * v, bus, at }); voice({ f: f * 8, d: .12, v: .01 * v, bus, at }); },
  /* 5 oud: a plucked, slightly bent string with a warm filter */
  (f, d, at, bus, v = 1) => { voice({ f: f * .985, f2: f, glide: .06, d: Math.max(.3, d), type: 'sawtooth', v: .055 * v, lp: 1800, lp2: 600, bus, at }); },
  /* 6 music box: tiny, very high and twinkly */
  (f, d, at, bus, v = 1) => { voice({ f: f * 4, d: .5, v: .04 * v, bus, at }); voice({ f: f * 8.02, d: .2, v: .01 * v, bus, at }); },
  /* 7 brass horn: a swelling sawtooth through a filter that opens */
  (f, d, at, bus, v = 1) => { voice({ f: f / 2, d: d + .1, type: 'sawtooth', v: .03 * v, a: .07, lp: 700, lp2: 2200, sus: true, r: .12, vib: .006, bus, at }); },
  /* 8 kompang: frame drums, a deep "dung" and a bright "tak" */
  (f, d, at, bus, v = 1) => { voice({ f: 180, f2: 90, d: .22, v: .1 * v, bus, at }); hiss({ ft: 'bandpass', f: 2200, q: 2, d: .08, v: .05 * v, bus, at: at + .002 }); },
  /* 9 pipe organ: stacked sustained harmonics */
  (f, d, at, bus, v = 1) => { [1, 2, 3, 4].forEach((m, i) => voice({ f: f * m / 2, d: d + .15, v: [.03, .02, .01, .008][i] * v, a: .04, sus: true, r: .1, bus, at })); }
];
/* each zone's motif: [16th step, interval above the chord root, length in 16ths] for one bar */
const ZMOTIF = [
  [[0, 12, 2], [2, 16, 2], [4, 19, 4], [10, 16, 2], [12, 14, 4]],
  [[0, 12, 1], [1, 16, 1], [2, 19, 1], [4, 24, 2], [8, 19, 1], [9, 16, 1], [10, 12, 2]],
  [[0, 12, 4], [6, 19, 2], [8, 24, 6]],
  [[0, 12, 2], [3, 14, 1], [4, 19, 2], [7, 16, 1], [8, 12, 4], [14, 7, 2]],
  [[0, 24, 1], [2, 28, 1], [4, 31, 1], [6, 28, 1], [8, 24, 2], [12, 19, 2]],
  [[0, 12, 3], [3, 13, 1], [4, 16, 2], [6, 15, 2], [8, 12, 6]],
  [[0, 19, 2], [2, 24, 2], [4, 23, 2], [6, 19, 2], [8, 16, 4], [12, 12, 4]],
  [[0, 7, 3], [3, 12, 1], [4, 12, 4], [8, 16, 3], [11, 19, 1], [12, 19, 4]],
  [[0, 0, 1], [3, 0, 1], [4, 0, 1], [6, 0, 1], [8, 0, 1], [10, 0, 1], [11, 0, 1], [14, 0, 1]],
  [[0, 12, 4], [4, 16, 4], [8, 19, 8]]
];
function zoneMotif(bar, pos, at, e16, root, tones, song) {
  const z = AU.zone; if (!(z >= 0) || S.sensory) return;
  const ins = ZINSTR[z % 10], mot = ZMOTIF[z % 10], bus = AU.mus;
  /* the call and response: the motif closes every 4-bar phrase */
  if (bar % 4 === 3) mot.forEach(([p, iv, len]) => { if (p === pos) ins(NF(root + iv), len * e16, at, bus, 1); });
  /* a soft counter-line in battles: chord tones on the off-beats of bars 2 and 3 */
  if (song.drums && bar % 4 === 1 && (pos === 6 || pos === 14)) ins(NF(root + 12 + tones[(pos >> 3) % 3]), e16 * 2, at, bus, .6);
  /* the kompang keeps a light pattern all through battles in its zone */
  if (z % 10 === 8 && song.drums && bar % 4 !== 3 && (pos === 3 || pos === 11)) ins(0, e16, at, bus, .5);
}
/* a short greeting phrase when a zone opens on the map */
function zoneSting(z) {
  if (!musicOn() || !auCtx() || !(z >= 0)) return;
  const c = AU.ctx, at = c.currentTime + .05, e16 = .11, root = 60;
  try { ZMOTIF[z % 10].forEach(([p, iv, len]) => ZINSTR[z % 10](NF(root + iv), len * e16, at + p * e16, AU.fxBus, .9)); } catch (e) { /* audio unavailable */ }
}
