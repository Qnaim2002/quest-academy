/* ================= v33: music and sound for every situation =================
   1. NINETEEN NEW SONGS, each with its own key, speed, instrument, bass and beat (the instruments, basses and beats
      are in 17-sound-engine.js: LEADS, BASSES, DRUMS). The melodies are composed by a small deterministic composer
      (genMel below): chord tones on the strong beats, steps on the weak ones, a repeat of the first phrase, and a
      resting note at the end of each half, so every song is its own tune and the same one every time.
      Where each plays:   Studies tab 'study'            Armory and forge 'shop'          Pet Haven and bedtime 'haven'
                          Cards tab 'cards'              Tower 'tower'                    Parent Portal 'parent'
                          Welcome and who-is-playing 'welcome'                            Win screen 'victory' (after the jingle)
                          Rival duel 'rival'             Speed rush 'rush'                Secret level 'secret'
                          Pet evolution 'evolve'         Lesson battle 'study'
                          Zone bosses by kind: 'boss3' fire (dragon, fiend lord), 'boss4' eerie (lich, hydra),
                          'boss5' bright (archon, fey queen, elemental lord), 'boss6' heavy (titan, chimera, colossus),
                          and 'final' for every boss of the last zone.
                          Ordinary battles now pick from five songs by subject and zone ('battle' ... 'battle5').
   2. A SOUND FOR EVERY TAP: each tab, each subject, buying, wearing, placing furniture, flipping a flash card, opening a
      lesson, a chest, starting a mode (tower, rush, secret, topic boss, rival duel), a pet in the haven (its own voice) ...
      Everything is made live with the same small synth as before (no audio files) and obeys the sound switch and calm mode. */

/* ---------------- the composer ---------------- */
const SCALES = {
  maj: [0, 2, 4, 5, 7, 9, 11], min: [0, 2, 3, 5, 7, 8, 10], dor: [0, 2, 3, 5, 7, 9, 10], mix: [0, 2, 4, 5, 7, 9, 10], lyd: [0, 2, 4, 6, 7, 9, 11],
  harm: [0, 2, 3, 5, 7, 8, 11], phr: [0, 1, 3, 5, 7, 8, 10], pent: [0, 2, 4, 7, 9], mpent: [0, 3, 5, 7, 10]
};
function mulberry(a) { return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function genMel(o) {
  const rnd = mulberry(o.seed), sc = SCALES[o.scale], lo = o.lo ?? 7, hi = o.hi ?? 26, pitches = [];
  for (let p = lo; p <= hi; p++) if (sc.includes(p % 12)) pitches.push(p);
  const toneSet = bar => { const [off, ty] = o.prog[bar % 4]; return new Set(CHORD[ty].map(x => (off + x) % 12)); };
  const near = (p, list) => list.reduce((b, q) => Math.abs(q - p) < Math.abs(b - p) ? q : b, list[0]);
  let prev = near(o.start ?? 12, pitches), dir = 1;
  const bar = (b, rh, last) => {
    const out = [], tones = toneSet(b);
    for (let i = 0; i < 8; i++) {
      const ch = rh[i];
      if (ch === '-') { out.push(HD); continue; }
      if (ch === '.') { out.push(null); continue; }
      let p;
      const strong = i === 0 || i === 4;
      if (last && i === 0) { const root = o.prog[b % 4][0] % 12, cand = pitches.filter(q => q % 12 === root); p = near(prev, cand.length ? cand : pitches); }
      else if (strong) {
        const cand = pitches.filter(q => tones.has(q % 12));
        const near2 = cand.filter(q => Math.abs(q - prev) <= 5), pool = near2.length ? near2 : cand;
        p = pool[Math.floor(rnd() * pool.length)];
        if (rnd() < .5) p = near(prev + dir * 3, pool);
      } else {
        const k = pitches.indexOf(prev), r = rnd(), step = r < .6 ? 1 : r < .85 ? 2 : r < .93 ? 0 : 3;
        if (rnd() < .22) dir = -dir;
        let j = k + dir * step; if (j < 0 || j >= pitches.length) { dir = -dir; j = k + dir * step; }
        p = pitches[Math.max(0, Math.min(pitches.length - 1, j))];
      }
      prev = p; out.push(p);
    }
    return out;
  };
  const R = o.rhythms, bars = [];
  const m1 = [bar(0, R[0]), bar(1, R[1])], m2 = [bar(2, R[2 % R.length]), bar(3, R[3 % R.length], true)];
  prev = near(o.start ?? 12, pitches);
  const m3 = [bar(6, R[1]), bar(7, R[3 % R.length], true)];
  bars.push(...m1, ...m2, ...m1, ...m3);
  return bars.flat();
}
const R8 = {
  steady: 'x-x-x-x-', lilt: 'x-xx-x-x', run: 'xxxxxxxx', sparse: 'x-----x-', skip: 'x--xx-x-', drive: 'x-xxx-xx', calm: 'x---x---', pulse: 'x-x-xxx-', end: 'x-------', dance: 'xx-xx-x-'
};
const NEW_SONGS = {
  study: { bpm: 98, key: 60, scale: 'maj', prog: [[0, 'M7'], [9, 'm7'], [2, 'm7'], [7, 'D7']], lead: 'mallet', drums: 6, bass: 'walk', seed: 11, r: ['lilt', 'steady', 'skip', 'end'], arp: true },
  shop: { bpm: 116, key: 62, scale: 'mix', prog: [[0, 'M'], [5, 'M'], [7, 'M'], [0, 'M']], lead: 'pluck', drums: 3, bass: 'off', seed: 23, r: ['pulse', 'skip', 'lilt', 'end'] },
  haven: { bpm: 70, key: 65, scale: 'pent', prog: [[0, 'M7'], [7, 'M'], [9, 'm7'], [5, 'M7']], lead: 'box', drums: 0, bass: 'sub', seed: 35, r: ['sparse', 'calm', 'sparse', 'end'], arp: true },
  cards: { bpm: 108, key: 64, scale: 'lyd', prog: [[0, 'M'], [2, 'M'], [0, 'M'], [7, 'sus']], lead: 'harp', drums: 6, bass: 'off', seed: 47, r: ['skip', 'lilt', 'run', 'end'] },
  tower: { bpm: 124, key: 57, scale: 'harm', prog: [[0, 'm'], [8, 'M'], [5, 'M'], [7, 'M']], lead: 'brass', drums: 3, bass: 'drive', seed: 59, r: ['drive', 'steady', 'drive', 'end'], layers: true },
  parent: { bpm: 58, key: 60, scale: 'pent', prog: [[0, 'M7'], [5, 'M7'], [0, 'M7'], [7, 'sus']], lead: 'pad', drums: 0, bass: 'sub', seed: 61, r: ['calm', 'sparse', 'calm', 'end'] },
  welcome: { bpm: 104, key: 67, scale: 'maj', prog: [[0, 'M'], [7, 'M'], [9, 'm'], [5, 'M']], lead: 'pluck', drums: 1, bass: 'pump', seed: 73, r: ['lilt', 'pulse', 'skip', 'end'], arp: true },
  victory: { bpm: 136, key: 60, scale: 'maj', prog: [[0, 'M'], [5, 'M'], [7, 'M'], [0, 'M']], lead: 'brass', drums: 3, bass: 'walk', seed: 83, r: ['drive', 'run', 'pulse', 'end'] },
  rival: { bpm: 148, key: 59, scale: 'phr', prog: [[0, 'm'], [10, 'M'], [8, 'M'], [7, 'M']], lead: 'square', drums: 4, bass: 'drive', seed: 97, r: ['drive', 'dance', 'drive', 'end'], layers: true },
  final: { bpm: 138, key: 55, scale: 'harm', prog: [[0, 'm'], [8, 'M'], [10, 'M'], [7, 'D7']], lead: 'organ', drums: 2, bass: 'drive', seed: 101, r: ['drive', 'steady', 'run', 'end'] },
  boss3: { bpm: 142, key: 54, scale: 'phr', prog: [[0, 'm'], [1, 'M'], [0, 'm'], [10, 'M']], lead: 'square', drums: 2, bass: 'drive', seed: 113, r: ['drive', 'pulse', 'drive', 'end'] },
  boss4: { bpm: 120, key: 56, scale: 'harm', prog: [[0, 'm'], [6, 'dim'], [0, 'm'], [7, 'M']], lead: 'organ', drums: 5, bass: 'sub', seed: 127, r: ['skip', 'sparse', 'skip', 'end'], layers: true },
  boss5: { bpm: 130, key: 62, scale: 'lyd', prog: [[0, 'M'], [7, 'M'], [9, 'm'], [5, 'M']], lead: 'brass', drums: 3, bass: 'walk', seed: 131, r: ['pulse', 'lilt', 'drive', 'end'], layers: true },
  boss6: { bpm: 112, key: 52, scale: 'min', prog: [[0, 'm'], [0, 'm'], [8, 'M'], [7, 'M']], lead: 'brass', drums: 5, bass: 'drive', seed: 139, r: ['steady', 'pulse', 'steady', 'end'], layers: true },
  battle4: { bpm: 126, key: 63, scale: 'mix', prog: [[0, 'M'], [3, 'M'], [5, 'M'], [7, 'M']], lead: 'kalimba', drums: 1, bass: 'pump', seed: 149, r: ['pulse', 'skip', 'lilt', 'end'] },
  battle5: { bpm: 120, key: 60, scale: 'dor', prog: [[0, 'm'], [5, 'M'], [0, 'm'], [10, 'M']], lead: 'flute', drums: 4, bass: 'off', seed: 151, r: ['skip', 'lilt', 'dance', 'end'], layers: true },
  evolve: { bpm: 84, key: 65, scale: 'lyd', prog: [[0, 'M7'], [2, 'M'], [4, 'm7'], [7, 'sus']], lead: 'harp', drums: 0, bass: 'sub', seed: 163, r: ['sparse', 'steady', 'sparse', 'end'], arp: true },
  rush: { bpm: 158, key: 64, scale: 'maj', prog: [[0, 'M'], [5, 'M'], [7, 'M'], [5, 'M']], lead: 'square', drums: 7, bass: 'pump', seed: 173, r: ['run', 'drive', 'run', 'end'] },
  secret: { bpm: 90, key: 58, scale: 'mpent', prog: [[0, 'm7'], [5, 'm7'], [3, 'M7'], [10, 'sus']], lead: 'kalimba', drums: 6, bass: 'sub', seed: 181, r: ['skip', 'sparse', 'lilt', 'end'], arp: true }
};
Object.entries(NEW_SONGS).forEach(([name, s]) => {
  const rh = s.r.map(k => R8[k]);
  SONGS[name] = { bpm: s.bpm, key: s.key, prog: s.prog, lead: s.lead, drums: s.drums, bass: s.bass, arp: !!s.arp, layers: !!s.layers, mel: genMel({ prog: s.prog, scale: s.scale, rhythms: rh, seed: s.seed, lo: s.lo, hi: s.hi, start: s.start }) };
});

/* ---------------- which song for which situation ---------------- */
const BOSS_SONG = ['boss3', 'boss4', 'boss6', 'boss3', 'boss5', 'boss5', 'boss5', 'boss6', 'boss6', 'boss4'];
const BATTLE_POOL = ['battle', 'battle2', 'battle3', 'battle4', 'battle5'];
const MUS_WIN = { t: 0 };
const ovOn = id => { const e = document.querySelector(id); return !!(e && e.classList.contains('on')); };
function situationSong() {
  if (UI.comic) return undefined;
  if (ovOn('#winOverlay')) { if (!MUS_WIN.t) MUS_WIN.t = Date.now(); return Date.now() - MUS_WIN.t < 1700 ? '' : 'victory'; }
  MUS_WIN.t = 0;
  if (ovOn('#evoOverlay')) return 'evolve';
  if (ovOn('#welcomeOverlay') || ovOn('#whoOverlay')) return 'welcome';
  if (ovOn('#timeOverlay')) return 'haven';
  if (ovOn('#forgeOverlay')) return 'shop';
  if (B.active && B.lv && UI.tab === 'adventure') {
    const lv = B.lv, sp = lv.special;
    if (sp === 'rival') return 'rival';
    if (sp === 'tower') return 'tower';
    if (sp === 'rush') return 'rush';
    if (sp === 'secret') return 'secret';
    if (sp === 'lesson') return 'study';
    if (lv.big && lv.mon && Number.isInteger(lv.mon.arch)) return (lv.z || 0) >= 9 ? 'final' : BOSS_SONG[lv.mon.arch % 10];
    if (sp === 'tboss') return 'boss3';
    if (lv.boss) return 'boss';
    const si = Math.max(0, SUBJ_ORDER.indexOf(lv.subj));
    return BATTLE_POOL[(si + zoneMood(lv.z) + ((lv.n || 0) > 50 ? 1 : 0)) % 5];
  }
  if (!B.active) {
    if (UI.tab === 'studies') return 'study';
    if (UI.tab === 'play') return 'map';   // v37: the Play screen sounds like the map
    if (UI.tab === 'armory') return UI.arm === 'haven' ? 'haven' : 'shop';
    if (UI.tab === 'cards') return 'cards';
    if (UI.tab === 'tower') return 'tower';
    if (UI.tab === 'parent') return 'parent';
  }
  return undefined;
}
HOOK.claim('musicFor', () => { const n = situationSong(); return n === undefined ? undefined : (n === '' || SONGS[n] ? n : undefined); });
setInterval(() => { try { if (AU.ctx && musicOn() && AU.want !== musicFor()) syncMusic(); } catch (e) { /* ignore */ } }, 450);

/* ---------------- a sound for every tap ---------------- */
const SUBJ_PITCH = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
Object.assign(sfx, {
  tabStudies() { sx([{ f: NF(79), d: .3, v: .05, type: 'triangle' }, { f: NF(83), d: .4, v: .045, type: 'triangle', delay: .08 }, { f: NF(79 + 24), d: .08, v: .01, delay: .08 }]); },
  tabArmory() { sx([{ f: 1450, d: .22, type: 'square', v: .03, lp: 5200 }, { f: 2170, d: .26, v: .03 }, { n: 1, ft: 'highpass', f: 4500, d: .08, v: .06 }, { f: 170, f2: 100, d: .12, v: .08, delay: .03 }]); },
  tabAdventure() { sx([{ f: NF(67), d: .28, type: 'sawtooth', v: .03, lp: 1400, a: .03 }, { f: NF(74), d: .4, type: 'sawtooth', v: .035, lp: 1600, a: .03, delay: .12 }]); },
  tabCards() { sx([0, .05, .1, .15].map(d => ({ n: 1, ft: 'bandpass', f: 3500, f2: 1500, d: .06, v: .04, q: 2, delay: d })).concat([{ f: NF(91), d: .12, v: .02, delay: .2 }])); },
  tabTower() { sx([{ f: 85, f2: 50, d: .35, type: 'triangle', v: .13 }, { n: 1, ft: 'lowpass', f: 700, d: .25, v: .09 }, { f: NF(52), d: .5, type: 'sawtooth', v: .02, lp: 600, delay: .1 }]); },
  tabParent() { sx([{ f: 2400, d: .02, type: 'square', v: .03, lp: 5000 }, { f: 1500, d: .05, type: 'square', v: .03, lp: 3600, delay: .09 }, { n: 1, ft: 'highpass', f: 5000, d: .05, v: .03, delay: .09 }]); },
  subject(i = 0) { const p = SUBJ_PITCH[Math.max(0, i) % 10]; sx([{ f: NF(72 + p), d: .2, type: 'triangle', v: .05 }, { f: NF(79 + p), d: .22, type: 'sine', v: .03, delay: .06 }]); },
  cash() { sx([{ f: NF(88), d: .06, type: 'square', v: .02, lp: 5000 }, { f: NF(93), d: .08, type: 'square', v: .02, lp: 5000, delay: .06 }, { f: NF(100), d: .5, v: .045, delay: .13 }, { f: NF(105), d: .6, v: .02, delay: .13 }, { n: 1, ft: 'highpass', f: 6500, d: .25, v: .03, delay: .12 }]); },
  equipSnd() { sx([{ n: 1, ft: 'bandpass', f: 900, f2: 2600, d: .14, v: .06, q: 1.4 }, { f: 700, d: .05, type: 'square', v: .02, lp: 2400, delay: .1 }, { f: 1400, d: .12, v: .035, delay: .13 }]); },
  place() { sx([{ f: 150, f2: 80, d: .14, type: 'triangle', v: .13 }, { n: 1, ft: 'lowpass', f: 900, d: .08, v: .07 }]); },
  away() { sx([{ f: 700, f2: 300, d: .16, type: 'triangle', v: .05 }, { n: 1, ft: 'bandpass', f: 1200, f2: 400, d: .12, v: .04 }]); },
  menu() { sx([{ f: 740, d: .05, type: 'triangle', v: .028 }, { f: 988, d: .06, v: .018, delay: .035 }]); },
  page() { sx([{ n: 1, ft: 'bandpass', f: 2800, f2: 1200, d: .12, v: .05, q: 1 }, { n: 1, ft: 'bandpass', f: 3400, f2: 1800, d: .1, v: .04, q: 1, delay: .09 }]); },
  flip() { sx([{ n: 1, ft: 'bandpass', f: 2200, f2: 4200, d: .09, v: .05, q: 2 }, { f: NF(86), d: .1, type: 'triangle', v: .025, delay: .07 }]); },
  chest() { sx([{ f: 130, f2: 90, d: .3, type: 'sawtooth', v: .04, lp: 600, vib: .03 }, { n: 1, ft: 'bandpass', f: 600, f2: 1400, d: .3, v: .04 }].concat([84, 88, 91, 96].map((m, i) => ({ f: NF(m), d: .3, v: .03, delay: .28 + i * .06 })))); },
  startTower() { sx([55, 59, 62, 67].map((m, i) => ({ f: NF(m), d: .3, type: 'sawtooth', v: .035, lp: 1100, delay: i * .1 })).concat([{ f: 85, f2: 45, d: .4, v: .12, delay: .3 }])); },
  startRush() { sx([{ n: 1, ft: 'bandpass', f: 400, f2: 5000, d: .4, v: .07, q: 1.5 }].concat([0, .08, .16, .24].map((d, i) => ({ f: NF(84 + i * 2), d: .06, type: 'square', v: .025, lp: 3600, delay: d })))); },
  startSecret() { sx([0, 3, 7, 10, 14].map((m, i) => ({ f: NF(76 + m), d: .6, v: .03, a: .05, delay: i * .12 })).concat([{ n: 1, ft: 'highpass', f: 6500, d: .7, v: .015, delay: .1 }])); },
  startBoss() { sx([{ f: 110, f2: 55, d: .9, type: 'sawtooth', v: .07, lp: 500 }, { n: 1, ft: 'lowpass', f: 1800, f2: 200, d: .8, v: .1 }, { f: 1350, d: .7, type: 'square', v: .02, lp: 3000, delay: .02 }]); },
  startRival() { sx([{ f: 1400, d: .3, type: 'square', v: .035, lp: 5000 }, { f: 2100, d: .35, v: .035 }, { n: 1, ft: 'highpass', f: 4000, d: .15, v: .09 }, { f: 1400, d: .3, type: 'square', v: .03, lp: 5000, delay: .22 }, { n: 1, ft: 'highpass', f: 4000, d: .12, v: .08, delay: .22 }]); },
  petVoice(id) { const v = (typeof SPECIES_VOICE !== 'undefined' && SPECIES_VOICE[id]) || [1000, 1500, 'triangle', .15]; sx([{ f: v[0], f2: v[1], d: v[3], type: v[2], v: .045, lp: 3600 }, { f: v[1], f2: v[0], d: v[3] * .7, type: v[2], v: .03, lp: 3600, delay: v[3] * .85 }]); },
  magic() { sx([0, 4, 7, 11, 14, 19].map((m, i) => ({ f: NF(84 + m), d: .3, v: .025, delay: i * .045 })).concat([{ n: 1, ft: 'highpass', f: 7000, d: .4, v: .015 }])); },
  lock() { sx([{ f: 1800, d: .03, type: 'square', v: .03, lp: 4200 }, { f: 1100, d: .06, type: 'square', v: .03, lp: 3000, delay: .08 }]); },
  stamp() { sx([{ f: 420, f2: 300, d: .08, type: 'triangle', v: .06 }, { n: 1, ft: 'lowpass', f: 1500, d: .05, v: .04 }]); },
  snip() { sx([{ n: 1, ft: 'highpass', f: 4000, d: .04, v: .07 }, { n: 1, ft: 'highpass', f: 5200, d: .04, v: .07, delay: .06 }]); },
  chime(i = 0) { sx([{ f: NF(84 + (i % 7) * 2), d: .4, v: .04 }, { f: NF(96 + (i % 7) * 2), d: .3, v: .015, delay: .03 }]); }
});
const TAB_SND = { studies: 'tabStudies', armory: 'tabArmory', adventure: 'tabAdventure', cards: 'tabCards', tower: 'tabTower', parent: 'tabParent' };
const ACT_SND = {
  buy: 'cash', pvBuy: 'cash', hvBuy: 'cash', hvBuyPet: 'cash', upg: 'cash',
  equip: 'equipSnd', pvWear: 'equipSnd', hvEquip: 'equipSnd', gearKeep: 'equipSnd', pgItem: 'equipSnd',
  hvPlace: 'place', hvAway: 'away', hvAwaySel: 'away', hvSize: 'menu', hvDone: 'ok',
  armView: 'menu', hvTab: 'menu', slot: 'menu', diff: 'menu', band: 'menu', zone: 'whoosh', level: 'open',
  lessonGo: 'page', open: 'page', lcard: 'page', lcNext: 'page', lcPrev: 'page', closeLesson: 'soft',
  fcFlip: 'flip', fcGo: 'page', fcKnew: 'ok', fcAgain: 'soft',
  chestOpen: 'chest', chestTap: 'chest', relicOn: 'magic', gearForge: 'menu',
  towerGo: 'startTower', rushGo: 'startRush', secretGo: 'startSecret', tbossGo: 'startBoss', rivalGo: 'startRival', bossStory: 'startBoss',
  lock: 'lock', pinBack: 'lock', pinCancel: 'lock', pinForgot: 'lock',
  mpStamp: 'stamp', mpTen: 'stamp', mpSlot: 'stamp', mpCut: 'snip', mpPiece: 'stamp', mpUndo: 'soft', mpReset: 'soft', mpUse: 'ok',
  traceGlyph: 'chime', traceNext: 'chime', traceSet: 'menu', blendTile: 'chime', blend: 'magic', react: 'magic'
};
HOOK.claim('famEvent', (a, v) => {
  try {
    if (a === 'tab') { const k = TAB_SND[v]; if (k) sfx[k](); }
    else if (a === 'subject' || a === 'subj') sfx.subject(Math.max(0, SUBJ_ORDER.indexOf(v)));
    else if (a === 'hvPet') sfx.petVoice(v);
    else if (a === 'hvTheme') sfx.equipSnd();
    else if (ACT_SND[a] && typeof sfx[ACT_SND[a]] === 'function') sfx[ACT_SND[a]]();
  } catch (e) { /* a missing sound never stops a tap */ }
  return undefined;
});

Object.assign(window.__quest, { v33: { SONGS, NEW_SONGS, genMel, musStep, situationSong, BOSS_SONG, BATTLE_POOL, TAB_SND, ACT_SND, LEADS, BASSES, DRUMS, CHORD } });
