import { CUTS, XTRA, SHARED, loadCuts } from './content/cutscenes.js';
/* ================= v29: stories that play like game cutscenes =================
   Every chapter, boss intro and victory is now a scripted cutscene (src/content/cutscenes/b1-b4.js) instead of
   six fixed pictures. A script is a list of beats: [shot, speaker, English, Malay, prop].
     shot     how the camera frames the beat. The older shots still work (wide, prob, owl, hero, foe, win,
              lair, reveal, ready, vbeat, vfix, vnext, finale) and v29 adds:
                talk    two characters face each other, with a speech bubble
                close   a close-up of whoever is speaking, with a feeling (prop) popping up
                clash   an action shot: the hero lunges at a monster, speed lines and a big hit
                item    something special glows in the middle of the scene (prop)
                crowd   a crowd of townsfolk (prop) with the hero in front
                dark    a scary dark shot: glowing eyes around the hero
                travel  a journey path to somewhere new (prop)
                villain the age's villain floats in (Puff, Momo, Murk or Drakmor)
     speaker  n narrator · h the hero · o Hoot · v the villain · m a zone monster · b the zone boss
              p the pet (the beat is left out when no pet is worn) · x:EMOJI:English name:Malay name (townsfolk)
     prop     an emoji used by the shot (the thing in the item shot, the crowd, the feeling in a close-up,
              the place in a travel shot); for the villain it can be 'sad' or 'happy'; 'red' gives a dark shot red eyes.
   Speakers talk in a dialogue box with their portrait and name; the narrator speaks without a box.
   Lines use {hero}, {boss}, {z} (this land), {next} (the next land) and {pet}. A zone with no script falls back
   to the older six lines in saga.js. Stories were rewritten, so every chapter and boss story plays once more.
   v32: a beat can carry a sixth item, an options object: { mood: 'sad'|'tense'|'triumph' (the music), gloss: [[word, meaning, picture, 'ms'|'en']]
   (a picture glossary pop-up), a, b: (choice buttons for a 'fork' shot) }. New shots: chase, rain, campfire, map, split, fork, duel, evo.
   New speakers: c (the mini boss), r (the rival knight), k (the boss as a captain). New story kinds: mini (level 5), rival, evolve.
   The villain arc, mini-boss scenes, choices, cliffhangers and subject beats are merged in by 29-v32-story.js (hook 'cutRaw'). */
const SHOTS_NEW = new Set(['talk', 'close', 'clash', 'item', 'crowd', 'dark', 'travel', 'villain', 'chase', 'rain', 'campfire', 'map', 'split', 'fork', 'forkr', 'duel', 'evo']);
const SHOT_ALIAS = { walk: 'wide' };
const SHOT_CAM = { chase: 'panr', rain: 'zout', campfire: 'zin', map: 'zout', split: 'zout', fork: 'zin', forkr: 'zin', duel: 'zin', evo: 'zin', close: 'zin', talk: 'panl', clash: 'zin', item: 'zin', crowd: 'zout', wide: 'zout', walk: 'panr', travel: 'panr', dark: 'zin', foe: 'panr', prob: 'zout', owl: 'panl', hero: 'zin', villain: 'zin', murk: 'zin', win: 'zout', lair: 'panr', reveal: 'zin', ready: 'zin', vbeat: 'zin', vfix: 'zout', vnext: 'panr', finale: 'zout' };
function cutRaw() { return HOOK.call('cutRaw', cutRawBase, arguments); }   // v32: 29-v32-story.js merges the extras in
function cutRawBase(z, mode, band = S.band) { const B = CUTS[band] || {}, Z = B[z]; const k = mode === 'boss' ? 'b' : mode === 'victory' ? 'v' : mode && mode !== 'chapter' ? null : 'c'; return k && Z && Array.isArray(Z[k]) && Z[k].length ? Z[k] : null; }
/* the beats a child actually sees: pet beats only with a pet, the lines filled in with names */
/* v31: worked out once per story (comicCaps, cineKindsOf, beatAt and the dialogue box all ask for it on every scene) */
const CUT_MEMO = new Map();
function cutBeats(z, subj, mode) {
  let pet = ''; try { pet = petOn() || ''; } catch (e) { pet = ''; }
  const k = [S.band, S.lang, z, subj, mode || 'chapter', pet, heroName(), !!CUTS[S.band], !!XTRA[S.band], !!SHARED.ready].join('|');
  if (!CUT_MEMO.has(k)) { if (CUT_MEMO.size > 40) CUT_MEMO.clear(); CUT_MEMO.set(k, cutBeatsNow(z, subj, mode)); }
  return CUT_MEMO.get(k);
}
function cutBeatsNow(z, subj, mode) {
  const raw = cutRaw(z, mode || 'chapter', S.band, subj); if (!raw) return null;
  const li = LI(), sg = sagaOf(), zn = sg.zones[z].n[li], nx = z < 9 ? sg.zones[z + 1].n[li] : '', P = storyPeople(), bn = bossOfZone(subj, z).n;
  const fill = (str, o) => storyFill(String(str), { boss: bn, z: zn, next: nx }).replace(/\{pet\}/g, (o && o.old) || P.pet || '').replace(/\{v\}/g, sg.vname[li]).replace(/\{good\}/g, sg.zones[z].good).replace(/\{rival\}/g, rivalName()).replace(/\{old\}/g, (o && o.old) || '').replace(/\{new\}/g, (o && o.nw) || '');
  const xo = storyX(subj, mode), ev = xo && xo.pet ? { old: petName(xo.pet, Math.max(1, (xo.stage || 2) - 1)), nw: petName(xo.pet, xo.stage || 2) } : null;
  const out = raw.filter(b => b[1] !== 'p' || P.pet || ev).map(b => {
    const op = b[5] || null, o = { shot: b[0], spk: b[1], prop: b[4] || '', text: fill(b[2 + li] || b[2], ev), mood: op && op.mood || '' };
    if (op) { if (op.gloss) o.gloss = op.gloss; if (op.a) { o.fork = true; o.a = forkOpt(op.a, li, fill, ev); o.b = forkOpt(op.b, li, fill, ev); } }
    return o;
  });
  if (P.pet && mode !== 'boss' && mode !== 'victory' && (!mode || mode === 'chapter')) { const n = out.find(b => b.spk === 'n'); if (n && !out.some(b => b.spk === 'p')) n.text += ' ' + t('ep.petJoins', P); }
  return out;
}
const forkOpt = (x, li, fill, ev) => ({ em: x.em, label: fill(x.t[li] || x.t[0], ev), res: fill(x.r[li] || x.r[0], ev), coins: x.c || 0 });
HOOK.around('comicCaps', (next, z, subj, mode) => {
  mode = mode || (UI.comic && UI.comic.mode) || 'chapter';
  const bs = cutBeats(z, subj, mode); if (!bs) return next(z, subj, mode);
  return [next(z, subj, mode)[0], ...bs.map((b, i) => beatText(b, bs, i))];
});
HOOK.claim('cineKindsOf', (z, mode) => {
  const bs = cutBeats(z, UI.comic ? UI.comic.subj : 'math', mode || 'chapter');
  return bs ? bs.map(b => SHOT_ALIAS[b.shot] || b.shot) : undefined;
});
const beatAt = c => { if (!c || c.i < 1) return null; const bs = cutBeats(c.z, c.subj, c.mode); return bs ? bs[c.i - 1] || null : null; };

/* ---------------- who is talking ---------------- */
const emoSVG = (e, sz = 70) => S.pixel ? `<svg viewBox="0 0 100 100" aria-hidden="true"><image href="${PX.emo(e)}" x="12" y="10" width="76" height="76" image-rendering="pixelated"/></svg>` : `<svg viewBox="0 0 100 100" aria-hidden="true"><text x="50" y="${50 + sz * .36}" font-size="${sz}" text-anchor="middle">${e}</text></svg>`;
function speakerOf(b, c) {
  const sub = SUBJ_ORDER.includes(c.subj) ? c.subj : 'math', sg = sagaOf(), li = LI(), kn = KNIGHTS[S.equipped.knight];
  switch ((b.spk || 'n')[0]) {
    case 'h': return { svg: heroSVG(S.equipped), name: heroName() + (kn && heroName() !== kn.name ? ' · ' + kn.name : '') };
    case 'o': return { svg: owlSVG(), name: 'Hoot' };
    case 'v': { const mood = b.prop === 'sad' ? true : b.prop === 'happy' ? 'happy' : false; return { svg: villainSVG(mood), name: sg.vname[li], foe: mood === false }; }
    case 'm': { const m = monsterFor(sub, c.z * 10 + 3); return { svg: monsterSVG(m), name: m.n, foe: 1 }; }
    case 'b': { const m = bossOfZone(c.subj, c.z); return { svg: monsterSVG(m), name: m.n, foe: c.mode !== 'victory' }; }
    case 'c': { const m = monsterFor(sub, c.z * 10 + 5); return { svg: monsterSVG(m), name: m.n, foe: 1 }; }
    case 'r': return { svg: rivalSVG(rivalStage(c)), name: rivalName(), foe: c.mode === 'rival' && c.i < 3 };
    case 'p': { const [id, st] = petShown(b, c); return id ? { svg: petAlone(id, st), name: petName(id, st) } : { svg: owlSVG(), name: 'Hoot' }; }
    case 'x': { const [, e, en, ms] = b.spk.split(':'); return { svg: emoSVG(e || '🙂'), name: (li ? ms : en) || en || '' }; }
    default: return { narr: true };
  }
}
HOOK.claim('cineSpeaker', c => { const b = beatAt(c); if (!b) return undefined; const s = speakerOf(b, c); return s.narr ? { svg: owlSVG(), name: '', narr: true } : s; });
HOOK.claim('cineDialog', (c, line) => {
  const b = beatAt(c); if (!b) return undefined;
  const sp = speakerOf(b, c); let n = 0;
  const chars = line.split(/\s+/).map(w => { const c0 = n; n += [...w].length; return `<span class="w" style="--c:${c0}">${esc(w)}</span>`; }).join(' ');   // v31: word by word (one animation per word, not per letter)
  if (sp.narr) return `<div class="cn-dlg narr"><div class="cn-say"><p class="cn-sub" aria-live="polite" aria-label="${esc(line)}">${chars}</p><i class="cn-more" aria-hidden="true" style="--n:${n}">▼</i></div></div>`;
  return `<div class="cn-dlg${sp.foe ? ' foe' : ''}"><div class="cn-port" aria-hidden="true">${sp.svg}</div><div class="cn-say"><b class="cn-who">${esc(sp.name)}</b><p class="cn-sub" aria-live="polite" aria-label="${esc(line)}">${chars}</p><i class="cn-more" aria-hidden="true" style="--n:${n}">▼</i></div></div>`;
});

/* ---------------- the new shots ---------------- */
function cutLayer(kind, b, c, R) {
  const E = (ch, x, y, sz, cls = '', dl = 0) => S.pixel ? `<image href="${PX.emo(ch)}" x="${(x - sz * .62).toFixed(1)}" y="${(y - sz * .98).toFixed(1)}" width="${(sz * 1.24).toFixed(1)}" height="${(sz * 1.24).toFixed(1)}" image-rendering="pixelated" class="${cls}" style="animation-delay:${dl}s"/>` : `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="middle" class="${cls}" style="animation-delay:${dl}s">${ch}</text>`;
  const H = (x, y, w) => inner(heroSVG(S.equipped), x, y, w, w * 1.32), O = (x, y, w) => inner(owlSVG(), x, y, w, w);
  const SH = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${(rx * .2).toFixed(1)}" fill="rgba(0,0,0,.22)"/>`;
  const pop = (s, dl = 0) => `<g class="cn-pop" style="animation-delay:${dl}s">${s}</g>`, walk = (s, dl = 0) => `<g class="cn-walkin" style="animation-delay:${dl}s"><g class="cn-step" style="animation-delay:${dl}s">${s}</g></g>`;
  const bubble = (x, y, ch, dl = .7) => pop(`<path d="M${x - 18} ${y - 16} h36 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-14 l-8 8 l1 -8 h-15 a8 8 0 0 1 -8 -8 v-14 a8 8 0 0 1 8 -8z" fill="#fff" stroke="#2a2233" stroke-width="2"/>${E(ch, x, y + 7, 17)}`, dl);
  const sub = SUBJ_ORDER.includes(c.subj) ? c.subj : 'math', zd = sagaOf().zones[c.z], pet = petShown(b, c)[0];
  const PT = (x, y, w, dl = .3) => pet ? `<g class="cn-pet" style="animation-delay:${dl}s">${inner(petAlone(pet, petShown(b, c)[1]).replace('class="pet-svg ', 'class="'), x, y, w, w)}</g>` : '';
  /* the figure that stands for a speaker in the scene */
  const fig = (spk, x, y, w) => {
    const k = (spk || 'n')[0];
    if (k === 'h') return H(x, y, w * .76);
    if (k === 'v') return inner(villainSVG(b.prop === 'sad' ? true : b.prop === 'happy' ? 'happy' : false), x, y, w, w * .75);
    if (k === 'm') return inner(monsterSVG(monsterFor(sub, c.z * 10 + 3)), x, y, w, w * .94);
    if (k === 'b') return inner(monsterSVG(bossOfZone(c.subj, c.z)), x, y, w, w * .94);
    if (k === 'p' && pet) return inner(petAlone(pet, petShown(b, c)[1]).replace('class="pet-svg ', 'class="'), x, y + w * .3, w * .7, w * .7);
    if (k === 'c') return inner(monsterSVG(monsterFor(sub, c.z * 10 + 5)), x, y, w, w * .94);
    if (k === 'r') return rivalFig(c, x, y, w);
    if (k === 'x') return E(spk.split(':')[1] || '🙂', x + w / 2, y + w * .9, w * .8, 'cm-bob');
    return O(x, y + w * .25, w * .75);
  };
  const isProp = b.prop && !['sad', 'happy', 'red', 'old', 'new', 'glow', 'digi', 'burst', 'ultra', 'storm', 'sun'].includes(b.prop), eye = b.prop === 'red' ? '#FF3B3B' : '#FFE066';
  let s = '';
  if (kind === 'talk') {
    const left = b.spk === 'h' ? (isProp ? 'x:' + b.prop : 'o') : b.spk;   // the other side of the conversation
    s += SH(70, 158, 26) + walk(H(36, 74, 62)) + SH(232, 158, 34) + `<g class="cn-rise-in">${fig(b.spk === 'h' ? left : b.spk, 186, 64, 96)}</g>` + PT(102, 116, 42, .5);
    s += b.spk === 'h' ? bubble(74, 52, '💬', .6) : bubble(250, 40, isProp ? b.prop : '💬', .6);
  } else if (kind === 'close') {
    const who = b.spk === 'n' ? null : b.spk;
    s += `<rect x="-600" y="-600" width="1520" height="1200" fill="rgba(10,6,24,.32)"/><ellipse cx="160" cy="150" rx="120" ry="18" fill="rgba(255,240,180,.25)" class="cn-pulse"/>`;
    s += who ? `<g class="cn-rise-in"><g class="cn-stand">${who === 'h' ? H(104, 4, 112) : fig(who, 82, 18, 156)}</g></g>` : `<g class="cn-float">${E(isProp ? b.prop : zd.em, 160, 150, 120)}</g>`;
    if (isProp && who) s += pop(E(b.prop, 252, 48, 34, 'cm-bob'), .6);
  } else if (kind === 'clash') {
    const m = monsterFor(sub, c.z * 10 + 4 + Math.floor(R() * 4));
    s += `<g class="cn-speed" opacity=".55">${Array.from({ length: 7 }, (_, i) => `<path d="M-20 ${40 + i * 18} H${120 + R() * 140}" stroke="#fff" stroke-width="${1 + (i % 3)}" stroke-linecap="round" style="animation-delay:${(-i * .13).toFixed(2)}s"/>`).join('')}</g>`;
    s += SH(84, 158, 28) + `<g class="cn-lunge">${H(40, 64, 72)}</g>` + `<g class="cm-shake">${inner(monsterSVG(m), 178, 40, 124, 116)}</g>` + PT(4, 118, 44, .2);
    s += E('💥', 166, 96, 46, 'cn-burst') + E('⭐', 150, 60, 18, 'cn-burst', -.4) + E('✨', 196, 128, 16, 'cn-burst', -.9) + (isProp ? pop(E(b.prop, 162, 40, 26, 'cm-bob'), .4) : '');
  } else if (kind === 'item') {
    const it = isProp ? b.prop : zd.good;
    s += `<g class="cn-spin" style="transform-origin:180px 80px">${Array.from({ length: 12 }, (_, i) => `<path d="M180 80 L${(180 + Math.cos(i * .5236) * 150).toFixed(1)} ${(80 + Math.sin(i * .5236) * 150).toFixed(1)}" stroke="#FFF3A0" stroke-width="10" opacity=".16"/>`).join('')}</g>`;
    s += `<circle cx="180" cy="80" r="38" fill="#FFF3C4" opacity=".35" class="cn-pulse"/><g class="cn-float">${E(it, 180, 104, 64)}</g>` + [[140, 46], [226, 60], [208, 22], [150, 112]].map(([x, y], i) => E('✨', x, y, 14, 'cn-twk', (-i * .5).toFixed(1))).join('');
    s += SH(56, 160, 22) + walk(H(30, 96, 50)) + PT(84, 124, 36, .4) + pop(E(b.spk === 'h' ? '😮' : '❗', 90, 92, 18, 'cm-bob'), 1);
  } else if (kind === 'crowd') {
    const who = isProp ? b.prop : zd.em;
    s += Array.from({ length: 7 }, (_, i) => E(who, 22 + i * 46, 160 + (i % 2) * 8, 30 + (i % 3) * 4, 'cm-bob', (-i * .3).toFixed(1))).join('');
    s += SH(160, 150, 26) + `<g class="cn-rise-in"><g class="cn-stand">${H(132, 58, 60)}</g></g>` + PT(190, 112, 40, .4) + pop(E('👋', 196, 84, 18, 'cm-bob'), 1) + (b.spk.startsWith('x') ? bubble(46, 110, '💬', .6) : '');
  } else if (kind === 'dark') {
    s += `<rect x="-600" y="-600" width="1520" height="1200" fill="rgba(6,4,18,.62)"/><ellipse cx="96" cy="150" rx="64" ry="16" fill="rgba(255,226,140,.3)" class="cn-pulse"/>`;
    s += [[200, 70], [262, 104], [236, 40], [40, 54], [292, 140]].map(([x, y], i) => `<g class="cn-eyes" style="animation-delay:${(-i * .7).toFixed(1)}s"><ellipse cx="${x}" cy="${y}" rx="4" ry="5" fill="${eye}"/><ellipse cx="${x + 12}" cy="${y}" rx="4" ry="5" fill="${eye}"/></g>`).join('');
    s += SH(96, 156, 22) + `<g class="cn-stand">${H(70, 84, 54)}</g>` + PT(124, 120, 36, .3) + (isProp ? E(b.prop, 132, 112, 22, 'cn-pulse') : '') + pop(E('😨', 70, 82, 16, 'cm-bob'), 1.2);
  } else if (kind === 'villain') {
    s += `<ellipse cx="200" cy="150" rx="80" ry="14" fill="rgba(120,110,160,.3)" class="cn-pulse"/><g class="cn-rise-in"><g class="cn-float">${fig('v', 136, 30, 140)}</g></g>`;
    s += SH(52, 158, 20) + walk(H(28, 100, 46)) + PT(74, 126, 32, .4) + bubble(270, 44, b.prop === 'sad' ? '💧' : b.prop === 'happy' ? '💖' : '😈', .7);
  } else if (kind === 'travel') {
    const to = isProp ? b.prop : (sagaOf().zones[Math.min(9, c.z + 1)] || zd).em;
    s += `<path d="M30 150 Q110 120 170 140 T300 110" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" opacity=".8"/>`;
    s += E(zd.em, 34, 140, 26, 'cm-bob') + `<g class="cn-float">${E(to, 286, 112, 52)}</g>` + E('🚩', 262, 104, 18, 'cm-bob');
    s += SH(120, 156, 20) + walk(H(96, 96, 48)) + walk(PT(64, 118, 38), .2) + `<g class="cn-flyin" style="animation-delay:.5s"><g class="cn-flap">${O(156, 70, 30)}</g></g>`;
  } else s += cutLayer2(kind, b, c, R, { E, H, O, SH, pop, walk, bubble, PT, fig, isProp, zd, sub, eye, inner });   // v32: chase, rain, campfire, map, split, fork, duel, evo (29)
  return s;
}
HOOK.filter('cineScene', (svg, z, k, subj, title, mode) => {
  if (title) return svg;
  const c = { z, subj, mode, i: k + 1 }, b = beatAt(c); if (!b || !SHOTS_NEW.has(b.shot)) return svg;
  const at = svg.lastIndexOf('</g>'); if (at < 0) return svg;
  return svg.slice(0, at) + cutLayer(b.shot, b, c, rng(z * 977 + k * 31 + S.band * 7)) + svg.slice(at);
});
/* classic look: character lines get the same dialogue box as pixel mode; the camera follows the shot */
HOOK.on('renderComic', () => {
  const c = UI.comic, b = beatAt(c); if (!b) return;
  const sh = $('#comicSheet'); if (!sh || !sh.querySelector) return;
  const st = sh.querySelector('.cn-stage'), cam = SHOT_CAM[b.shot];
  if (st && cam && st.className) { st.className = st.className.replace(/\bcn-(zin|zout|panl|panr)\b/, 'cn-' + cam); st.classList.add('shot-' + b.shot); }
  if (!S.pixel && b.spk !== 'n') { const p = sh.querySelector('.cn-bar.bot .cn-sub'); if (p && p.outerHTML !== undefined) p.outerHTML = cineDialog(c, comicCaps(c.z, c.subj, c.mode)[c.i]); }
});
STR['cn.shot'] = ['{i} / {n}', '{i} / {n}'];

/* v31: each age's script is loaded on demand (content/cutscenes.js). A story waits for its script (a fraction of a
   second the first time); if it cannot load (offline before it was ever cached) the older six lines in saga.js play. */
HOOK.around('openComic', (next, ...a) => {
  CUT_MEMO.clear(); const b = S.band; if (CUTS[b]) return next(...a);
  const go = () => next(...a); loadCuts(b).then(go, go); return undefined;
});
HOOK.on('renderLevels', () => { loadCuts(S.band).catch(() => { }); });
