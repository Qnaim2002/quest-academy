/* ================= v22: epic storytelling =================
   Stories now play like a film: black letterbox bars slide in, the chapter title card gets a drum hit and a
   brass chord, every shot change has a soft swell, light rays fall through the sky, dark foreground
   silhouettes drift past the camera for depth, and boss shots get embers. The story theme music plays
   underneath. The hero's name (from the welcome screen or the Parent Portal) and the equipped pet are written
   into the lines, and the pet walks beside the hero in the pictures. */
document.addEventListener('input', e => { if (e.target && e.target.id === 'wlName') UI.wlName = e.target.value; });   // keep the typed name when the welcome card redraws
/* v26: with no name given, the hero is called by the knight they wear (Tiny Tobias, Sir Aldric ...) */
const heroName = () => { const p = typeof curProfile === 'function' ? curProfile() : null; if (p && p.name) return p.name; const k = S.equipped && ITEM[S.equipped.knight]; return k && k.slot === 'knight' ? itemName(k) : t('ep.defaultHero'); };
function storyPeople() { const id = petOn(); return { hero: heroName(), pet: id ? petName(id) : '' }; }
/* extra layers drawn inside each story picture (320 x 240 view) */
/* v31: returns HTML for the story's effect layer (above the picture, moved by the graphics chip): light rays, embers
   and the dark foreground shapes, which now sit in their own small picture so the camera can slide them cheaply */
function epicLayers(kind, boss, R, night) {
  if (S.sensory) return '';
  let s = '';
  if (!boss && !night) s += '<span class="fx-rays"><i></i><i></i><i></i><i></i></span>';
  if (boss || kind === 'lair' || kind === 'reveal') for (let i = 0; i < 6; i++) s += fxPart('rise ember', '', R() * 320, 0, 2 + R() * 4, (3 + R() * 3).toFixed(1), (-R() * 6).toFixed(1), R() < .5 ? '#FF9A3D' : '#FFD166');
  /* foreground silhouettes: big dark shapes close to the camera that move faster than the scene */
  const fg = night || boss ? '#0b0718' : '#1d2a1a';
  s += `<svg class="cn-fgs" viewBox="0 0 320 240" preserveAspectRatio="__PAR__" aria-hidden="true"><path opacity=".85" d="M-30 270 Q-10 216 18 230 Q30 190 52 226 Q66 206 72 270Z" fill="${fg}"/><path opacity=".85" d="M352 270 Q340 200 312 226 Q300 180 280 222 Q262 208 258 270Z" fill="${fg}"/></svg>`;
  return s;
}
/* sound for each shot: a drum and brass chord on the title card, a soft swell on the others */
function epicBeat(c, title) {
  if (S.sensory || !sfxOn()) return;
  if (title) sx([{ f: 70, f2: 48, d: .9, v: .2 }, { n: 1, ft: 'lowpass', f: 600, f2: 120, d: .8, v: .12 }].concat([50, 57, 62, 65].map((m, i) => ({ f: NF(m + 12), d: 1.6, type: 'sawtooth', v: .018, lp: 1400, a: .25, sus: true, r: .6, delay: .15 + i * .02 }))));
  else sx([{ n: 1, ft: 'bandpass', f: 400, f2: 1600, d: .5, v: .03, q: 1.2 }, { f: NF(74 + (c.i % 3) * 3), d: .7, v: .02, a: .1, delay: .1 }]);
}

/* ================= v25: smooth story playback =================
   Every shot used to draw its pictures (hero, pet, monsters, props) at the moment the page turned, so the
   camera move and the text stuttered. Now the sprites are drawn by the sprite worker as soon as the story
   opens, and the NEXT shot's picture is built while the current one is still playing. */
const comicPreKey = i => i + ':' + S.lang + ':' + (S.pixel ? 1 : 0);
/* the monsters a story will show (so the worker can draw them before they are needed) */
function comicMons(c) {
  const sub = SUBJ_ORDER.includes(c.subj) ? c.subj : 'math', out = [];
  cineKindsOf(c.z, c.mode).forEach((kind, k) => {
    if (kind === 'foe') out.push(monsterFor(sub, c.z * 10 + 3 + (k % 3)));
    else if (['vbeat', 'btitle', 'reveal', 'ready'].includes(kind)) out.push(bossOfZone(c.subj, c.z));
  });
  if (c.mode === 'boss') out.push(bossOfZone(c.subj, c.z));
  return out;
}
function comicWarm(c) {
  if (!S.pixel || !SPRW.able() || c.warm) return c.warm || Promise.resolve();
  return (c.warm = Promise.all([SPRW.ask('hero', S.equipped)].concat(comicMons(c).map(m => SPRW.ask('mon', m)))).catch(() => null));
}
function comicPrep(c) {
  if (!c || UI.comic !== c) return;
  const pre = c.pre || (c.pre = {}), n = c.i + 1, pk = comicPreKey(n);
  if (n > c.last || pre[pk]) return;
  Promise.resolve(comicWarm(c)).then(() => idle(() => {
    if (UI.comic !== c || pre[pk]) return;
    try { pre[pk] = cineScene(c.z, n - 1, c.subj, false, c.mode); if (S.pixel) cineSpeaker({ ...c, i: n }); } catch (e) { /* drawn on demand instead */ }
  }));
}
