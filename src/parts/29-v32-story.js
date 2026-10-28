/* ================= v32: a bigger story =================
   What is new (the scripts are in src/content/cutscenes/x1-x4.js and shared.js, the engine is here and in 25):
     RIVAL        Sir Kilat, a rival knight, challenges the hero at levels 25, 50 and 75 (a card on the subject screen).
                  Each duel has a story before it, a battle that mixes questions from three subjects, and a story after.
     VILLAIN ARC  Puff, Momo, Murk and Drakmor now have ten steps: a shadow (zones 1-3), a rival (4-6), a mistake (7-9)
                  and a redemption or a reveal in zone 10. Each step is a scene inside the chapter or the victory story.
     SUBJECT BEATS  after the shared chapter, each subject adds its own beats (the villain steals the melodies in Music,
                  drains the colours in Science ...).
     MINI-BOSS    a short scene (mode 'mini') plays the first time a child reaches level 5 of a zone.
     CLIFFHANGER  every victory story ends by teasing the next land.
     BOSS VOICES  each of the ten boss archetypes has its own voice (pitch and pace) and its own lines.
     CHOICES      a 'fork' beat lets the child choose; each choice has a one-line result and a small reward (once).
     GLOSSARY     Hoot teaches a few Malay or English words with a picture pop-up.
     MOOD MUSIC   every beat picks a tune: story, sad, tense or triumph.
     VOICES       the narrator, hero, Hoot, villain, monsters, the rival and the pet each speak with their own pitch and pace.
     EVOLUTION    a pet that reaches stage 2 or 3 gets a short film (glow, data rings, flash, reveal) before the overlay. */

/* ---------------- the rival ---------------- */
const RIVAL_NAME = ['Sir Kilat', 'Sir Kilat'];
const rivalName = () => RIVAL_NAME[LI()];
const RIVAL_EQ = [
  { knight: 'knight_aldric', weapon: 'weapon_sabre', shield: 'shield_scale', cape: 'cape_red', aura: 'aura_none', skin: 'skin_3', hair: 'hair_spiky_blue', outfit: 'outfit_armor', hat: 'hat_helm', boots: 'boots_red' },
  { knight: 'knight_onyx', weapon: 'weapon_thunder', shield: 'shield_bolt', cape: 'cape_night', aura: 'aura_shadow', skin: 'skin_3', hair: 'hair_spiky_blue', outfit: 'outfit_armor', hat: 'hat_helm', boots: 'boots_blue' },
  { knight: 'knight_sol', weapon: 'weapon_starhammer', shield: 'shield_crown', cape: 'cape_gold', aura: 'aura_sun', skin: 'skin_3', hair: 'hair_spiky_blue', outfit: 'outfit_armor', hat: 'hat_crown', boots: 'boots_gold' }
];
const rivalSVG = st => heroSVG({ ...DEFAULT_EQUIP, ...RIVAL_EQ[Math.max(0, Math.min(2, st | 0))] });
const rivalIdx = subj => { const m = /^rival(\d)/.exec(String(subj || '')); return m ? Math.max(0, Math.min(2, +m[1])) : 0; };
const rivalStage = c => rivalIdx(c && c.subj);
/* the rival drawn facing left, standing at x,y (a 320 x 240 story picture) */
function rivalFig(c, x, y, w) { const iw = w * .76, cx = x + iw / 2; return `<g transform="translate(${(2 * cx).toFixed(1)} 0) scale(-1 1)">${inner(rivalSVG(rivalStage(c)), x, y, iw, w)}</g>`; }
/* the story kinds that are not tied to a subject carry what they need in the subject text: 'rival1' (the duel number)
   and 'pet_cat@2' (the pet and the stage it just reached) */
function storyX(subj, mode) {
  if (mode === 'rival' || mode === 'rivalend') return { rival: rivalIdx(subj) };
  if (mode === 'evolve') { const m = /^(.+)@(\d)$/.exec(String(subj || '')); return m ? { pet: m[1], stage: +m[2] } : null; }
  return null;
}
function petShown(b, c) {
  const x = c && c.mode === 'evolve' ? storyX(c.subj, c.mode) : null;
  if (x) { const old = ['old', 'glow', 'digi'].includes(b && b.prop); return [x.pet, old ? Math.max(1, x.stage - 1) : x.stage]; }
  const id = petOn(); return [id, id ? petStage(id) : 1];
}
function storyKeyOf(mode, subj, z) {
  if (!mode || mode === 'chapter') return comicKey(subj, z);
  if (mode === 'boss') return bossStoryKey(subj, z);
  if (mode === 'victory') return victKey(subj, z);
  return `${STORY_PRE[mode] || mode}:${S.band}:${subj}:${z}`;
}

/* ---------------- merging the extras into a story ---------------- */
const choicesOn = () => S.choices !== false;
function wordBeat(band, z) {
  const W = XTRA[band] && XTRA[band].words && XTRA[band].words[z]; if (!W || !W.length || !SHARED.wordsT) return null;
  const li = LI(), w = W[0], tx = SHARED.wordsT;
  const fill = s => s.replace('{w}', li ? w[1] : w[0]).replace('{m}', li ? w[0] : w[1]);
  return ['owl', 'o', fill(tx[0]), fill(tx[1]), null, { gloss: W }];
}
function subjectBeats(subj, z) {
  const D = SHARED.subj && SHARED.subj[subj]; if (!D) return [];
  const ph = z <= 2 ? 0 : z <= 5 ? 1 : 2;
  return [['item', 'n', D.p[ph][0], D.p[ph][1], D.em], ['owl', 'o', D.s[0], D.s[1]]];
}
function choiceBeats(z) {
  const C = SHARED.choice && SHARED.choice[z]; if (!C || !choicesOn()) return [];
  return [['fork', C.who || 'n', C.q[0], C.q[1], null, { a: C.a, b: C.b, mood: 'saga' }], ['forkr', 'n', '', '']];
}
HOOK.around('cutRaw', (next, z, mode, band = S.band, subj) => {
  mode = mode || 'chapter';
  if (mode === 'mini') return SHARED.mini && SHARED.mini[z] ? SHARED.mini[z] : null;
  if (mode === 'rival' || mode === 'rivalend') { const R = SHARED.rival && SHARED.rival[rivalIdx(subj)]; return R ? R[mode === 'rival' ? 'intro' : 'win'] : null; }
  if (mode === 'evolve') { const x = storyX(subj, mode); return x && SHARED.evolve && SHARED.evolve[x.stage] ? SHARED.evolve[x.stage] : null; }
  const base = next(z, mode, band, subj); if (!base) return null;
  const X = XTRA[band] || {}, A = X.arc && X.arc[z], out = base.slice();
  if (mode === 'chapter') {
    let at = out.findIndex(b => b[0] === 'foe'); if (at < 0) at = Math.max(1, out.length - 2);
    const add = []; const wb = wordBeat(band, z); if (wb) add.push(wb);
    if (A && A.c) add.push(...A.c);
    add.push(...choiceBeats(z));
    out.splice(at, 0, ...add);
    out.push(...subjectBeats(subj, z));
  } else if (mode === 'victory') {
    if (A && A.v) { const at = out.findIndex(b => b[0] === 'finale' || b[0] === 'vnext'); out.splice(at < 0 ? out.length : at, 0, ...A.v); }
    const CL = (X.cliff && X.cliff[z]) || (SHARED.cliff && SHARED.cliff[z]); if (CL && z < 9) out.push(...CL);
  } else if (mode === 'boss') {
    const arch = bossOfZone(subj, z).arch, V = SHARED.bossVoice && SHARED.bossVoice[arch % 10];
    if (V) { const at = out.findIndex(b => b[0] === 'reveal'); out.splice(at < 0 ? 1 : at + 1, 0, ['reveal', 'b', V.intro[0], V.intro[1]]); }
  }
  return out;
});
function beatText(b, bs, i) {
  if (b.shot === 'forkr') { const f = bs[i - 1], pk = UI.comic && UI.comic.picks && UI.comic.picks[i]; return pk && f && f[pk] ? f[pk].res + (typeof pathNote === 'function' ? pathNote(pk) : '') : '…'; }   // v36: the line says what the choice changes next
  return b.text;
}

/* ---------------- the mini-boss scene (level 5) ---------------- */
const needsMiniStory = l => !!(l && l.mini && !l.special && !l.steam && SUBJ_ORDER.includes(l.subj) && SHARED.ready && SHARED.mini && SHARED.mini[l.z] && !(S.comics || {})[storyKeyOf('mini', l.subj, l.z)]);

/* ---------------- who speaks how (text to speech) ---------------- */
const VROLES = {
  narr: { p: 1, r: 1 }, hero: { p: 1.3, r: 1.05 }, owl: { p: .78, r: .9 }, villain: { p: .5, r: .82, male: 1 }, villainSad: { p: .9, r: .76 }, monster: { p: 1.55, r: 1.12 },
  captain: { p: .72, r: .95, male: 1 }, rival: { p: .98, r: 1.18, male: 1 }, pet: { p: 1.95, r: 1.22 }, folk: { p: 1.12, r: 1 }, folk2: { p: .9, r: .95 }
};
const BOSS_TTS = [{ p: .42, r: .8, male: 1 }, { p: .62, r: .78, male: 1 }, { p: .3, r: .7, male: 1 }, { p: .7, r: .98, male: 1 }, { p: 1.08, r: .86 }, { p: .88, r: 1.2, male: 1 }, { p: 1.7, r: 1 }, { p: .6, r: 1.12, male: 1 }, { p: .5, r: 1.02 }, { p: .8, r: 1.22, male: 1 }];
function voiceRole(role) {
  if (!role || (S.voice && S.voice.roles === false)) return { p: 1, r: 1, male: false };
  if (typeof role === 'object') return { p: role.p || 1, r: role.r || 1, male: !!role.male };
  const v = VROLES[role] || VROLES.narr; return { p: v.p, r: v.r, male: !!v.male };
}
function roleOfBeat(b, c) {
  const k = (b.spk || 'n')[0];
  switch (k) {
    case 'h': return 'hero';
    case 'o': return 'owl';
    case 'v': return b.prop === 'sad' ? 'villainSad' : 'villain';
    case 'm': return 'monster';
    case 'c': return 'captain';
    case 'r': return 'rival';
    case 'p': return 'pet';
    case 'b': { const a = bossOfZone(c.subj, c.z).arch; return BOSS_TTS[(a == null ? 0 : a) % 10]; }
    case 'x': return (b.spk.length + (b.spk.charCodeAt(2) || 0)) % 2 ? 'folk' : 'folk2';
    default: return 'narr';
  }
}
function comicSpeak(c, i = c.i) {
  if (!c) return;
  const txt = comicCaps(c.z, c.subj, c.mode)[i]; if (!txt) return;
  const b = i > 0 ? beatAt({ ...c, i }) : null;
  speakSeq([[txt, undefined, b ? roleOfBeat(b, c) : 'narr']]);
}

/* ---------------- mood music ---------------- */
function beatMood(b) {
  if (b.mood && b.mood !== 'saga') return b.mood;
  if (b.mood === 'saga') return 'saga';
  const s = b.shot;
  if (s === 'dark' || s === 'lair' || s === 'duel' || s === 'rain') return 'tense';
  if ((s === 'villain' || s === 'murk') && b.prop === 'sad') return 'sad';
  if (s === 'forkr' || s === 'vbeat' || s === 'finale' || s === 'win') return 'triumph';
  if (s === 'evo' && ['burst', 'ultra', 'new'].includes(b.prop)) return 'triumph';
  if (s === 'evo' && b.prop === 'digi') return 'tense';
  return 'saga';
}
function comicTune(c = UI.comic) {
  if (!c) return 'saga';
  const b = c.i > 0 ? beatAt(c) : null, m = b ? beatMood(b) : 'saga';
  return SONGS[m] ? m : 'saga';
}
HOOK.on('comic:shot', c => { if (c === UI.comic && musicOn()) setMusic(comicTune(c)); });

/* ---------------- choices and the picture glossary ---------------- */
HOOK.before('renderComic', () => {
  const c = UI.comic; if (!c) return;
  const b = c.i > 0 ? beatAt(c) : null; c.hold = !!(b && b.fork && !(c.picks && c.picks[c.i]));
});
HOOK.on('renderComic', () => {
  const c = UI.comic; if (!c) return; const b = c.i > 0 ? beatAt(c) : null, sh = $('#comicSheet'); if (!b || !sh || !sh.querySelector) return;
  if (b.fork) {
    const pk = c.picks && c.picks[c.i], nx = sh.querySelector('[data-act="comicNext"]');
    const ctl = sh.querySelector('.cn-ctl');
    if (nx && !pk) { nx.remove(); if (ctl) ctl.insertAdjacentHTML('beforebegin', `<div class="fork-btns" role="group" aria-label="${esc(t('v32.choose'))}">${['a', 'b'].map(k => `<button class="btn big fork-btn" data-act="forkPick" data-v="${k}"><span aria-hidden="true">${b[k].em}</span> ${esc(b[k].label)}</button>`).join('')}</div>`); }
    else if (nx && pk && ctl) ctl.insertAdjacentHTML('beforebegin', `<span class="fork-chosen">✔ ${esc(b[pk].label)}</span>`);
  }
  if (b.gloss) {
    const li = LI(), st = sh.querySelector('.cn-stage'); if (!st || !st.insertAdjacentHTML) return;
    const items = b.gloss.map((g, k) => { const w = li ? g[1] : g[0], m = li ? g[0] : g[1], lang = li ? 'en-US' : 'ms-MY', fresh = !(S.words || {})[g[0]]; return `<button class="gl" data-act="glSay" data-v="${k}" style="--i:${k}"><span class="gl-em" aria-hidden="true">${g[2]}</span><b>${esc(w)}</b><small>${esc(m)}</small>${fresh ? `<em class="gl-new">${esc(t('v32.new'))}</em>` : ''}<i aria-hidden="true">🔊</i><span class="sr-only"> ${esc(lang)}</span></button>`; }).join('');
    st.insertAdjacentHTML('beforeend', `<div class="cn-gloss" role="group" aria-label="${esc(t('v32.words'))}"><b class="gl-h">📚 ${esc(t('v32.words'))}</b>${items}</div>`);
  }
});
function forkPick(k) {
  const c = UI.comic; if (!c) return; const b = beatAt(c); if (!b || !b.fork || !b[k] || c.picks[c.i]) return;
  c.picks[c.i] = k; c.hold = false;
  const key = storyKeyOf(c.mode, c.subj, c.z) + '#' + c.i, G = S.choiceGot || (S.choiceGot = {});
  S.choicePick = S.choicePick || {}; S.choicePick[key] = k;
  const o = b[k]; let msg = '';
  if (typeof pathPick === 'function') pathPick(c, k);   // v36: the choice picks the twist of the next land (48)
  if (!G[key] && o.coins) { G[key] = 1; addCoins(o.coins); msg = ' +' + o.coins + ' 🪙'; }
  save(); sfx.pop && sfx.pop(); if (msg) toast(o.em + msg);
  clearTimeout(comicTimer); setTimeout(() => { if (UI.comic === c) { comicAdvance(); } }, 260);
  renderComic();
}
function glossSay(k) {
  const c = UI.comic, b = c && c.i > 0 ? beatAt(c) : null, g = b && b.gloss && b.gloss[+k]; if (!g) return;
  const li = LI(); speakSeq([[li ? g[1] : g[0], li ? 'en-US' : 'ms-MY', 'owl']]);
  const W = S.words || (S.words = {}); if (!W[g[0]]) { W[g[0]] = 1; save(); toast('📚 ' + t('v32.learned', { w: li ? g[1] : g[0] })); const el = $(`#comicSheet .gl[data-v="${k}"] .gl-new`); if (el) el.remove(); }
  const el = $(`#comicSheet .gl[data-v="${k}"]`); if (el && !S.sensory) replayClass(el, 'pop');
}

/* ---------------- the new shots ---------------- */
const CUT2 = new Set(['chase', 'rain', 'campfire', 'map', 'split', 'fork', 'forkr', 'duel', 'evo']);
const MAP_NODES = [[34, 176], [78, 146], [124, 172], [168, 140], [214, 166], [262, 134], [280, 86], [234, 62], [184, 90], [130, 62]];
function cutLayer2(kind, b, c, R, K) {
  const { E, H, O, SH, pop, walk, bubble, PT, fig, isProp, zd, inner } = K;
  const dark = a => `<rect x="-600" y="-600" width="1520" height="1200" fill="${a}"/>`;
  let s = '';
  if (kind === 'chase') {
    const hills = Array.from({ length: 2 }, (_, k) => `<path transform="translate(${k * 320} 0)" d="M0 150 Q40 108 80 150 T160 150 T240 150 T320 150 V240 H0Z" fill="rgba(255,255,255,.16)"/>`).join('');
    const trees = Array.from({ length: 2 }, (_, k) => Array.from({ length: 6 }, (_, i) => E(zd.em === '🏜️' ? '🌵' : '🌲', k * 320 + 26 + i * 54, 160, 30 + (i % 3) * 4)).join('')).join('');
    const grass = Array.from({ length: 2 }, (_, k) => `<g transform="translate(${k * 320} 0)"><rect x="0" y="168" width="320" height="80" fill="rgba(40,70,30,.35)"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${14 + i * 32} 178 l4 -8 l4 8 M${22 + i * 32} 196 l3 -6 l3 6" stroke="rgba(255,255,255,.4)" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}</g>`).join('');
    const ahead = isProp ? E(b.prop, 252, 150, 40, 'cn-jog') : fig(b.spk === 'h' || b.spk === 'n' || b.spk === 'o' ? 'v' : b.spk, 206, 70, 92);
    s += `<g class="cn-par p1">${hills}</g><g class="cn-par p2">${trees}</g><g class="cn-par p3">${grass}</g>`;
    s += `<g class="cn-speed" opacity=".5">${Array.from({ length: 5 }, (_, i) => `<path d="M-20 ${52 + i * 24} H${80 + R() * 120}" stroke="#fff" stroke-width="${1 + (i % 3)}" stroke-linecap="round" style="animation-delay:${(-i * .11).toFixed(2)}s"/>`).join('')}</g>`;
    s += `<g class="cn-jog">${ahead}</g>` + SH(70, 168, 24) + `<g class="cn-run">${H(40, 92, 58)}</g>` + PT(100, 134, 36, .2) + E('💨', 24, 160, 22, 'cn-dust') + E('💨', 8, 148, 16, 'cn-dust', .3);
  } else if (kind === 'rain') {
    s += dark('rgba(18,28,64,.42)');
    s += Array.from({ length: 34 }, () => `<path class="cn-rain" d="M${(R() * 340).toFixed(0)} ${(R() * 260 - 20).toFixed(0)} l-5 14" stroke="#CFE6FF" stroke-width="1.6" stroke-linecap="round" opacity=".75" style="animation-delay:${(-R() * 1.2).toFixed(2)}s;animation-duration:${(.7 + R() * .5).toFixed(2)}s"/>`).join('');
    if (b.prop === 'storm') s += `<rect class="cn-lightning" x="-600" y="-600" width="1520" height="1200" fill="#fff"/>`;
    s += [[60, 176, 22], [150, 184, 28], [230, 172, 20]].map(([x, y, r], i) => `<ellipse class="cn-rip" cx="${x}" cy="${y}" rx="${r}" ry="${(r * .25).toFixed(1)}" fill="none" stroke="rgba(207,230,255,.7)" stroke-width="2" style="animation-delay:${-i * .5}s"/>`).join('');
    s += SH(100, 160, 26) + walk(H(66, 84, 58)) + E('☂️', 96, 100, 46, 'cn-umbrella') + PT(122, 128, 38, .3);
    if (b.spk && !'hn'.includes(b.spk[0])) s += `<g class="cn-rise-in">${fig(b.spk, 188, 66, 92)}</g>` + bubble(262, 52, '💬', .7);
  } else if (kind === 'campfire') {
    s += dark('rgba(8,6,28,.58)');
    s += [[30, 30], [90, 18], [150, 38], [230, 24], [290, 44], [200, 60], [60, 70]].map(([x, y], i) => E('✨', x, y, 9 + (i % 3) * 2, 'cn-star', (-i * .4).toFixed(1))).join('');
    s += `<circle cx="160" cy="146" r="86" fill="#FFB347" opacity=".12"/><circle cx="160" cy="146" r="58" fill="#FFB347" opacity=".2"/><circle cx="160" cy="148" r="32" fill="#FFD27A" opacity=".34"/>`;
    s += `<path d="M124 172 L196 156" stroke="#6B4423" stroke-width="9" stroke-linecap="round"/><path d="M126 156 L196 172" stroke="#8A5A2E" stroke-width="9" stroke-linecap="round"/>`;
    s += `<g class="cn-flick">${E('🔥', 160, 162, 54)}</g>` + [0, 1, 2, 3, 4].map(i => E(i % 2 ? '✨' : '🔸', 148 + i * 8, 130, 10, 'cn-spark', (-i * .45).toFixed(2))).join('');
    s += SH(70, 172, 24) + `<g class="cn-rise-in">${H(40, 100, 54)}</g>` + PT(96, 138, 36, .4) + `<g class="cn-rise-in">${O(214, 112, 44)}</g>`;
    if (b.spk && !'hnop'.includes(b.spk[0])) s += `<g class="cn-rise-in">${fig(b.spk, 244, 98, 64)}</g>`;
    if (isProp) s += pop(E(b.prop, 160, 70, 24, 'cm-bob'), .8);
  } else if (kind === 'map') {
    const z0 = Math.max(0, Math.min(9, c.z)), z1 = Math.min(9, z0 + 1), li = LI(), sg = sagaOf();
    const seg = i => { const [x0, y0] = MAP_NODES[i], [x1, y1] = MAP_NODES[i + 1]; return `M${x0} ${y0} Q${((x0 + x1) / 2).toFixed(0)} ${(((y0 + y1) / 2) - 14).toFixed(0)} ${x1} ${y1}`; };
    s += `<rect x="14" y="20" width="292" height="196" rx="14" fill="#F4E3B8" stroke="#B98B4A" stroke-width="4"/><rect x="22" y="28" width="276" height="180" rx="10" fill="none" stroke="#C9A36B" stroke-width="1.5" stroke-dasharray="3 4"/>`;
    for (let i = 0; i < 9; i++) s += i < z0 ? `<path d="${seg(i)}" fill="none" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/>` : `<path d="${seg(i)}" fill="none" stroke="#C9A36B" stroke-width="2.5" stroke-dasharray="2 6" stroke-linecap="round"/>`;
    if (z1 > z0) s += `<path class="cn-draw" d="${seg(z0)}" pathLength="100" fill="none" stroke="#E5484D" stroke-width="4" stroke-linecap="round"/>`;
    s += MAP_NODES.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="10" fill="${i < z0 ? '#6BD18B' : i === z0 ? '#FFD166' : i === z1 ? '#fff' : '#E9D6A4'}" stroke="#8B5A2B" stroke-width="2.5"/>` + E(sg.zones[i].em, x, y + 5, 12)).join('');
    if (z1 > z0) {
      const [x0, y0] = MAP_NODES[z0];
      s += `<g transform="translate(0 0)"><animateMotion dur="2.8s" begin=".4s" fill="freeze" path="${seg(z0)}" keyTimes="0;1" keySplines=".4 0 .2 1" calcMode="spline"/>${H(-9, -30, 18)}</g>`;
      void x0; void y0;
      const [nx, ny] = MAP_NODES[z1];
      s += pop(`<text x="${nx}" y="${ny > 150 ? ny - 18 : ny + 27}" font-size="9" font-weight="800" fill="#5a3b12" text-anchor="middle" stroke="#F4E3B8" stroke-width="3" paint-order="stroke">${esc(sg.zones[z1].n[li])}</text>`, 1.8);
      s += E('🚩', nx + 13, ny - 6, 15, 'cn-bobx');
    }
    s += E('🧭', 284, 52, 22, 'cm-bob');
  } else if (kind === 'split') {
    const [pa, pb] = String(b.prop || '').split('|');
    s += `<polygon points="-10,0 188,0 128,240 -10,240" fill="rgba(255,220,140,.28)"/><polygon points="188,0 330,0 330,240 128,240" fill="rgba(120,140,255,.3)"/><path d="M188 0 L128 240" stroke="#fff" stroke-width="3" opacity=".9"/>`;
    s += SH(60, 164, 24) + walk(H(30, 92, 54)) + PT(86, 130, 34, .3) + pop(E(pa || zd.good, 110, 70, 34, 'cm-bob'), .5);
    s += `<g class="cn-rise-in">${fig(b.spk === 'h' || b.spk === 'n' ? 'v' : b.spk, 196, 70, 96)}</g>` + pop(E(pb || '❗', 262, 56, 30, 'cm-bob'), .8);
  } else if (kind === 'fork') {
    const bs = cutBeats(c.z, c.subj, c.mode), fk = bs && bs[c.i - 1], a = fk && fk.a ? fk.a.em : '❔', bb = fk && fk.b ? fk.b.em : '❔';
    s += `<path d="M160 244 L160 176 Q160 146 104 112 M160 176 Q160 146 216 112" fill="none" stroke="#C9A36B" stroke-width="26" stroke-linecap="round"/><path d="M160 244 L160 176 Q160 146 104 112 M160 176 Q160 146 216 112" fill="none" stroke="#E6C88F" stroke-width="16" stroke-linecap="round"/>`;
    s += `<g class="cn-rise-in">${E(a, 84, 108, 44, 'cn-bobx')}${E(bb, 236, 108, 44, 'cn-bobx', .4)}</g>`;
    s += SH(160, 206, 26) + walk(H(130, 134, 56)) + PT(184, 160, 34, .4) + pop(E('❓', 160, 118, 26, 'cm-bob'), .6);
  } else if (kind === 'forkr') {
    const bs = cutBeats(c.z, c.subj, c.mode), fk = bs && bs[c.i - 2], pk = UI.comic && UI.comic.picks && UI.comic.picks[c.i - 1], em = fk && pk && fk[pk] ? fk[pk].em : '✨';
    s += `<ellipse cx="160" cy="170" rx="90" ry="14" fill="rgba(255,240,180,.3)"/>` + `<g class="cn-float">${E(em, 160, 110, 70)}</g>` + [[96, 70], [226, 76], [120, 130], [208, 134]].map(([x, y], i) => E('✨', x, y, 14, 'cn-burst', (-i * .5).toFixed(1))).join('');
    s += SH(70, 168, 24) + `<g class="cn-lunge2">${H(40, 100, 54)}</g>` + PT(100, 134, 36, .2) + pop(E('😄', 76, 98, 18, 'cm-bob'), .6);
  } else if (kind === 'duel') {
    const st = rivalStage(c);
    s += dark('rgba(10,6,30,.4)');
    s += `<g class="cn-speed" opacity=".5">${Array.from({ length: 7 }, (_, i) => `<path d="M-20 ${30 + i * 26} H${100 + R() * 160}" stroke="#fff" stroke-width="${1 + (i % 3)}" stroke-linecap="round" style="animation-delay:${(-i * .13).toFixed(2)}s"/>`).join('')}</g>`;
    s += `<polyline class="cn-bolt" points="150,30 138,80 162,96 142,150 168,170" fill="none" stroke="#FFE066" stroke-width="5" stroke-linejoin="round"/><polyline class="cn-bolt" points="150,30 138,80 162,96 142,150 168,170" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>`;
    s += SH(70, 164, 28) + `<g class="cn-rise-in">${H(24, 76, 72)}</g>` + SH(246, 164, 28) + `<g class="cn-rise-in" style="animation-delay:.15s">${rivalFig(c, 210, 70, 94)}</g>`;
    s += pop(`<text x="160" y="58" font-size="${34 + st * 3}" font-weight="900" fill="#FFD166" stroke="#2a1a3a" stroke-width="4" paint-order="stroke" text-anchor="middle">VS</text>`, .5);
    s += E('⚡', 160, 124, 28, 'cn-burst') + E('💥', 160, 150, 22, 'cn-burst', -.5);
  } else if (kind === 'evo') {
    const [id, st] = petShown(b, c), p = b.prop || 'glow', big = p === 'burst' || p === 'ultra' || p === 'new';
    const petS = inner(petAlone(id || 'pet_cat', st).replace('class="pet-svg ', 'class="'), 100, 28, 120, 128);
    if (p === 'glow') {
      s += dark('rgba(20,16,50,.36)') + [48, 70, 92].map((r, i) => `<circle class="cn-evring" cx="160" cy="100" r="${r}" fill="none" stroke="#fff" stroke-width="3" opacity=".55" style="animation-delay:${-i * .5}s"/>`).join('');
      s += [88, 124, 160, 196, 232].map((x, i) => `<rect class="cn-pillar" x="${x - 5}" y="0" width="10" height="170" fill="#FFF7C8" opacity=".35" style="animation-delay:${-i * .3}s"/>`).join('');
      s += `<g class="cn-pgl">${petS}</g>`;
    } else if (p === 'digi') {
      s += dark('rgba(6,10,40,.66)');
      s += Array.from({ length: 12 }, (_, i) => `<text class="cn-digit" x="${12 + i * 26}" y="0" font-size="11" font-family="monospace" fill="#7FFFD4" opacity=".8" style="animation-delay:${(-R() * 2).toFixed(2)}s;animation-duration:${(1.4 + R()).toFixed(2)}s">${Array.from({ length: 9 }, () => `<tspan x="${12 + i * 26}" dy="13">${R() < .5 ? '0' : '1'}</tspan>`).join('')}</text>`).join('');
      s += `<ellipse class="cn-evring r1" cx="160" cy="96" rx="78" ry="22" fill="none" stroke="#7FFFD4" stroke-width="3"/><ellipse class="cn-evring r2" cx="160" cy="96" rx="64" ry="54" fill="none" stroke="#B79CFF" stroke-width="3"/><ellipse class="cn-evring r3" cx="160" cy="96" rx="40" ry="88" fill="none" stroke="#FFE066" stroke-width="3"/>`;
      s += `<g class="cn-sil">${petS}</g>`;
    } else {
      const ultra = p === 'ultra';
      s += ultra ? dark('rgba(18,8,40,.55)') : '';
      s += `<g class="cn-rays evr" style="transform-origin:160px 96px">${Array.from({ length: 14 }, (_, i) => `<path d="M160 96 L${(160 + Math.cos(i * .4488) * 220).toFixed(1)} ${(96 + Math.sin(i * .4488) * 220).toFixed(1)}" stroke="${ultra ? '#FFD166' : '#FFF7C8'}" stroke-width="${ultra ? 14 : 10}" opacity=".26"/>`).join('')}</g>`;
      s += `<rect class="cn-whiteout" x="-600" y="-600" width="1520" height="1200" fill="#fff"/>`;
      if (ultra) s += `<polyline class="cn-bolt" points="40,0 58,60 34,84 62,150" fill="none" stroke="#FFE066" stroke-width="5" stroke-linejoin="round"/><polyline class="cn-bolt" points="286,0 268,60 292,84 262,150" fill="none" stroke="#FFE066" stroke-width="5" stroke-linejoin="round" style="animation-delay:.4s"/>`;
      s += `<g class="cn-reveal">${petS}</g>` + [[90, 60], [236, 54], [70, 120], [256, 118], [160, 20]].map(([x, y], i) => E(ultra ? '🌟' : '⭐', x, y, 16, 'cn-burst', (-i * .3).toFixed(1))).join('');
      void big;
    }
    s += SH(52, 168, 20) + `<g class="cn-rise-in">${H(28, 112, 46)}</g>` + `<g class="cn-rise-in">${O(254, 126, 40)}</g>`;
  }
  return s;
}

/* ---------------- actions ---------------- */
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'forkPick': forkPick(v); return true;
    case 'glSay': glossSay(v); return true;
  }
  return undefined;
});

/* ---------------- pet evolution: a short film before the overlay ---------------- */
HOOK.around('showEvolve', (next, id, stage) => {
  const go = () => next(id, stage);
  if (!id || !(stage >= 2)) return go();
  const subj = `${id}@${stage}`;
  const open = () => {
    const bs = cutBeats(9, subj, 'evolve');
    if (!bs || !bs.length) { go(); return; }
    openComic(9, go, subj, 'evolve');
  };
  if (SHARED.ready && XTRA[S.band]) open(); else loadCuts(S.band).then(open, go);
  return undefined;
});

/* ---------------- the rival duel ---------------- */
const RIVAL_Z = [2, 5, 8], RIVAL_COINS = [30, 60, 100], RIVAL_CHESTS = [0, 1, 2];
const rivalRec = () => S.rival || (S.rival = {});
const rivalWon = i => !!rivalRec()[i];
const rivalOpen = i => !!S.openAll || (SUBJ_ORDER.some(s => clearAt(s, i * 25)) && (i === 1 || rivalWon(i - 1)));
function rivalLevel(i) {
  i = Math.max(1, Math.min(3, Math.floor(+i) || 1));
  const o = openSubjects(), L2 = o.length >= 3 ? o : SUBJ_ORDER, a = (i * 2) % L2.length, subs = [...new Set([L2[a], L2[(a + 3) % L2.length], L2[(a + 6) % L2.length]])];
  const n = i * 25 - 1, bases = subs.map(s => levelOf(s, n)), z = RIVAL_Z[i - 1];
  const mon = { seed: 'Sir Kilat' + i, rival: i, b: 'blob', c: 0, e: 'two', m: 'smile', f: [], t: i + 2, boss: 1, big: true, lv: i * 25, z, tier: 'big' };
  Object.defineProperty(mon, 'n', { enumerable: true, get() { return rivalName(); } });
  return { id: 'rival:' + i, subj: 'mix', n: i * 25, z, tier: 'big', boss: true, big: true, mini: false, steam: true, special: 'rival', rival: i, mixSubs: subs, rounds: 9 + i * 2, chip: 11 + i * 4, dk: Math.min(1, bases[0].dk + .12), mon,
    pool: bases.flatMap(b => b.pool), skills: [], bg: stageBG(subs[0], z), scene: ((i + 2) % 6) + 1, hue: 0 };
}
HOOK.around('specialLevel', (next, id) => {
  const p = String(id || '').split(':'); if (p[0] === 'rival' && p.length === 2) return rivalLevel(p[1]);
  return next(id);
});
HOOK.claim('lvT', l => {
  if (!l || l.special !== 'rival') return undefined;
  return { name: '⚔️ ' + rivalName(), goal: t('v32.rival.goal'), tip: t('tip.' + l.mon.t), zone: zoneName(l.z), place: '⚔️ ' + t('v32.rival.duel', { n: l.rival }) };
});
function rivalCardHTML() {
  const rows = [1, 2, 3].map(i => {
    const open = rivalOpen(i), won = rivalWon(i), cls = won ? 'won' : open ? 'ready' : 'lock';
    const need = i === 1 || rivalWon(i - 1) ? t('v32.rival.need', { n: i * 25 }) : t('v32.rival.needPrev');
    return `<button class="rv-i ${cls}" ${open ? `data-act="rivalGo" data-v="${i}"` : 'disabled'} aria-label="${esc(t('v32.rival.duel', { n: i }) + '. ' + (won ? t('v32.rival.won') : open ? t('v32.rival.ready') : need))}"><span class="rv-n" aria-hidden="true">${won ? '✔' : open ? '⚔️' : '🔒'}</span><b>${esc(t('v32.rival.duel', { n: i }))}</b><small>${won ? esc(t('v32.rival.again')) : open ? esc(t('v32.rival.ready')) : esc(need)}</small></button>`;
  }).join('');
  return `<section class="rivalcard" aria-label="${esc(t('v32.rival.title'))}"><div class="rv-head"><div class="rv-av" aria-hidden="true">${rivalSVG(Math.max(0, [1, 2, 3].filter(rivalWon).length - (rivalWon(3) ? 1 : 0)))}</div><div><b>⚔️ ${esc(t('v32.rival.title', { n: rivalName() }))}</b><small>${esc(t('v32.rival.sub'))}</small></div></div><div class="rv-rows">${rows}</div></section>`;
}
/* v37.2: the rival card is no longer shown on the subject list */
function rivalGo(i) {
  i = +i; if (!rivalOpen(i)) { toast(t('v32.rival.need', { n: i * 25 })); return; }
  const id = 'rival:' + i, go = () => { UI.run = null; $('#briefOverlay') && $('#briefOverlay').classList.remove('on'); startBattle(id); };
  const play = () => { if ((S.comics || {})[storyKeyOf('rival', 'rival' + (i - 1), RIVAL_Z[i - 1])] && rivalWon(i)) { go(); return; } openComic(RIVAL_Z[i - 1], go, 'rival' + (i - 1), 'rival'); };
  if (SHARED.ready && XTRA[S.band]) play(); else loadCuts(S.band).then(play, go);
}
HOOK.claim('famEvent', (a, v) => { if (a === 'rivalGo') { rivalGo(v); return true; } return undefined; });
/* winning the duel: the story after it, then the rewards */
HOOK.around('win', async (next, ...a) => {
  const lv = B.lv; if (!lv || lv.special !== 'rival') return next(...a);
  victoryPrelude();
  const i = lv.rival, tk = B.token, first = !rivalWon(i);
  S.battles++; S.defeated++;
  const reward = first ? RIVAL_COINS[i - 1] : 12, chest = first ? RIVAL_CHESTS[i - 1] : 0;
  rivalRec()[i] = 1; if (chest) chestGive(chest); addCoins(reward); const evo = addPetXP(5); save(); setMusic(''); sfx.win(); wxStop(); cleanBossFx();
  { const vi = $('#vsIntro'); if (vi) vi.hidden = true; }
  const m = ms(), h = hs(), pm = fx.pos(m);
  if (!S.sensory) { pose(h, 'cheer', 1500); fx.burst(pm.x, pm.y, 30, ['⭐', '✨', '🌟', '💫', '⚡']); fx.ring(pm.x, pm.y, '#FFD166', 200); fx.coins(m, 8); }
  await wait(S.sensory ? 400 : 1300); if (B.token !== tk) return;
  B.q = null; B.token++; B.active = false; lockUI(); $('#answers').innerHTML = ''; setAdvView('map');
  const show = () => {
    const rv = rivalSVG(i - 1);
    $('#winSheet').innerHTML = `<h2>⚔️ ${esc(t('v32.rival.beat', { n: rivalName() }))}</h2><div class="win-av"><div class="wa-h pose-cheer">${heroSVG(S.equipped)}</div><div class="wa-m rvwin">${rv}</div></div>
      <p class="sub">${esc(t(i === 3 ? 'v32.rival.final' : 'v32.rival.next', { n: rivalName() }))}</p><div class="wline"><span class="gain">+${reward} 🪙</span>${chestBtnHTML()}</div>
      <div class="wbtns"><div class="wsmall"><button class="btn ghost" data-act="retry" data-v="rival:${i}">🔁 ${t('v.retry')}</button><button class="btn ghost" data-act="toMap">🗺️ ${t('v.map')}</button></div></div>`;
    $('#winOverlay').classList.add('on'); setTimeout(syncMusic, 2600); if (S.voice.auto) speak(t('v32.rival.beat', { n: rivalName() }));
    if (evo) setTimeout(() => showEvolve(petOn(), evo), 900);
  };
  const subj = 'rival' + (i - 1);
  if (first && SHARED.ready && cutBeats(RIVAL_Z[i - 1], subj, 'rivalend')) openComic(RIVAL_Z[i - 1], show, subj, 'rivalend'); else show();
});

/* the rival is drawn as a knight in the battle (09b asks for it) */
const rivalBattleSVG = i => rivalSVG(i - 1).replace(/^<svg /, '<svg style="transform:scaleX(-1)" ');
HOOK.on('renderSubjects', () => { loadCuts(S.band).catch(() => { }); });

/* ---------------- strings ---------------- */
Object.assign(STR, {
  'v32.choose': ['Choose what to do', 'Pilih apa yang hendak dibuat'],
  'v32.words': ['New words', 'Perkataan baru'], 'v32.new': ['NEW', 'BARU'], 'v32.learned': ['New word: {w}', 'Perkataan baru: {w}'],
  'v32.rival.title': ['Rival: {n}', 'Pesaing: {n}'], 'v32.rival.sub': ['A fast knight who wants a duel. Three questions from three subjects in every round!', 'Seorang kesatria pantas yang mahu berduel. Soalan daripada tiga subjek dalam setiap pusingan!'],
  'v32.rival.duel': ['Duel {n}', 'Duel {n}'], 'v32.rival.ready': ['Ready! Tap to duel', 'Sedia! Sentuh untuk berduel'], 'v32.rival.won': ['Won', 'Menang'], 'v32.rival.again': ['Beaten. Duel again', 'Dikalahkan. Berduel lagi'],
  'v32.rival.need': ['Clear level {n} in any subject', 'Selesaikan tahap {n} dalam mana-mana subjek'], 'v32.rival.needPrev': ['Win the duel before this one', 'Menangi duel sebelum ini'],
  'v32.rival.goal': ['A duel! Questions from three subjects, one after another.', 'Duel! Soalan daripada tiga subjek, satu demi satu.'],
  'v32.rival.beat': ['You beat {n}!', 'Kamu menewaskan {n}!'], 'v32.rival.next': ['{n} nods. “Good duel. I will train harder!”', '{n} mengangguk. “Duel yang bagus. Saya akan berlatih lebih keras!”'],
  'v32.rival.final': ['{n} is your friend now. He will help you on your journey!', '{n} kini sahabat kamu. Dia akan membantu dalam perjalanan kamu!']
});
