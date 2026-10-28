/* ================= v7: multi-phase boss gimmicks ================= */
const bossOn = () => !!(B.lv && B.lv.big && B.active);
const bossPhaseOf = () => { const r = B.mHp / Math.max(1, B.mMax); return r > 2 / 3 ? 1 : r > 1 / 3 ? 2 : 3; };
function cleanBossFx() {
  const m = $('#monSprite'); if (m) m.classList.remove('shielded', 'enraged', 'raging');
  ['#phasebar', '#fogLayer', '#enrage', '#phaseBanner'].forEach(s => { const e = $(s); if (e) e.hidden = true; });
}
function bossReset() { Object.assign(B, { phase: 0, rune: 2, runeBroken: false, fog: null, enraged: false, eLeft: 0, eMax: 0 }); cleanBossFx(); }
function phaseBanner(p) {
  const el = $('#phaseBanner'); if (!el) return;
  el.textContent = ['☁️', '🔷', '💢'][p - 1] + ' ' + t('boss.phase', { n: p }) + ' · ' + t('boss.p' + p);
  el.hidden = false; replayClass(el, 'show'); announce(t('boss.phase', { n: p }) + ': ' + t('boss.p' + p) + '.', true);
  clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; }, 2600);
  if (!S.sensory) sfx.crit();
}
function renderPhaseBar() {
  const el = $('#phasebar'); if (!el) return; el.hidden = false;
  el.innerHTML = [1, 2, 3].map(n => `<span class="pp ${B.phase === n ? 'on' : B.phase > n ? 'past' : ''}">${['☁️', '🔷', '💢'][n - 1]} <b>${t('boss.p' + n)}</b></span>`).join('');
}
function updateRuneText() {
  const m = $('#monSprite'); if (!m) return;
  const need = Math.max(0, B.rune);
  m.dataset.runes = B.phase === 2 && !B.runeBroken ? '🔷'.repeat(2 - need) + '◻️'.repeat(need) : '';
  m.setAttribute('aria-label', B.phase === 2 && !B.runeBroken ? t('boss.rune', { n: need }) : '');
}
function updateEnrage() { const i = $('#enrage i'); if (i) i.style.width = B.eMax ? Math.max(0, B.eLeft / B.eMax * 100) + '%' : '0%'; }
function bossSetup() { return HOOK.call('bossSetup', bossSetupBase, arguments); }   // v31: extensions register with HOOK (00c)
function bossSetupBase() {
  if (!bossOn()) { cleanBossFx(); return; }
  const p = bossPhaseOf(), changed = p !== B.phase, q = B.q, m = $('#monSprite');
  if (changed) { B.phase = p; if (p === 2) { B.rune = 2; B.runeBroken = false; } phaseBanner(p); }
  B.enraged = false;
  B.fog = p === 1 && S.expr !== 'voice' && q ? new Set(q.options.map((_, i) => i)) : null;
  renderAnswers();
  $('#fogLayer').hidden = p !== 1;
  m.classList.toggle('shielded', p === 2 && !B.runeBroken); m.classList.remove('enraged'); m.classList.toggle('raging', p === 3);
  updateRuneText();
  const pace = effPace(); B.eMax = p === 3 ? (ENRAGE_MS[pace] || 0) : 0; B.eLeft = B.eMax;
  const en = $('#enrage'); en.hidden = !B.eMax; en.classList.remove('hot'); updateEnrage(); renderPhaseBar();
  if (changed) setMsg(t('boss.p' + p + '.msg') + (p === 3 && !B.eMax ? ' ' + t('boss.enrageOff') : ''));
}
function enrageTick() { return HOOK.call('enrageTick', enrageTickBase, arguments); }   // v31: extensions register with HOOK (00c)
function enrageTickBase() {
  if (!bossOn() || B.phase !== 3 || !B.eMax || B.enraged || !B.q || B.locked || UI.tab !== 'adventure' || UI.adv !== 'battle' || document.hidden || timeUp || bedUp || $('.overlay.on') || (B.introUntil || 0) > Date.now()) return;
  B.eLeft -= 250; updateEnrage();
  if (B.eLeft <= 0) {
    B.enraged = true; $('#enrage').classList.add('hot'); $('#monSprite').classList.add('enraged');
    announce(t('boss.p3') + '!', true); setMsg(t('boss.enraged')); if (!S.sensory) { const pm = fx.pos(ms()); fx.num(pm.x, pm.y - pm.h * .5, '💢', 'warn'); }
  }
}

/* the Subject Mix levels (21) have 20 levels each and use the 'steam' flag of the old STEAM quests */
const STEAM_N = 20;

/* ================= v10: cinematic chapter saga =================
   One story across the ten zones: Murk, a lonely grey fog, has drained the colour from the land.
   Each zone is a chapter of one title card + six shots. Scenes are layered SVG with slow camera moves. */
const CINE_KINDS = ['wide', 'prob', 'owl', 'hero', 'foe', 'win'];
const CINE_OVERRIDE = { 4: ['wide', 'prob', 'murk', 'murk', 'foe', 'win'], 9: ['wide', 'prob', 'murk', 'foe', 'hero', 'finale'] };
/* v26: every age band's chapter text lives in src/content/saga.js (the old band 3 CINE_TXT is gone) */
STR['cn.chapter'] = ['Chapter {n}', 'Bab {n}']; STR['cn.next'] = ['Next ▶', 'Seterusnya ▶'];
STR['cn.shot'] = ['Scene {i} of {n}', 'Babak {i} daripada {n}'];
STR['ar.tryOn'] = ['Try on {name}', 'Cuba {name}']; STR['ar.trying'] = ['Trying on', 'Sedang dicuba']; STR['ar.pvReset'] = ['Reset', 'Set semula'];
/* ================= v11: livelier cinematics, Back button, boss intros, a saga for every age ================= */
STR['cn.back'] = ['Previous scene', 'Babak sebelumnya']; STR['cn.backS'] = ['Back', 'Kembali'];
STR['cn.bossTitle'] = ['Boss battle: {z}', 'Pertarungan bos: {z}']; STR['cn.bossLabel'] = ['Boss battle', 'Pertarungan bos'];
STR['cn.fight'] = ['⚔️ Fight {m}!', '⚔️ Lawan {m}!']; STR['cn.bossStory'] = ['👑 Boss story', '👑 Cerita bos'];
STR['map.zoneLocked'] = ['Beat the boss of {z} to open this zone.', 'Kalahkan bos {z} untuk membuka zon ini.'];
STR['map.zoneLockedAria'] = ['{z}, locked', '{z}, berkunci'];
STR['saga.line'] = ['{s} · a story for {b}', '{s} · cerita untuk {b}'];
STR['b.lv'] = ['Lv {n}', 'Tahap {n}'];
/* ================= v16: victory stories =================
   After the zone boss (levels 10, 20 ... 100) is beaten for the first time, a short victory story plays
   before the rewards. v26: the words come from the saga itself (band.beat, zone.vict.fix / .next, band.fin),
   so each victory moves that age's story on; {boss}, {hero}, {next} are filled in. */
STR['cn.victLabel'] = ['Victory!', 'Kemenangan!']; STR['cn.victBeat'] = ['{boss} is beaten', '{boss} dikalahkan'];
STR['cn.victTitle'] = ['Victory: {z}', 'Kemenangan: {z}']; STR['cn.claim'] = ['🏆 Collect my rewards', '🏆 Ambil ganjaran saya'];
STR['cn.victStory'] = ['🏆 Victory story', '🏆 Cerita kemenangan'];
const victKey = (subj, z) => 'vict:' + S.band + ':' + subj + ':' + z;
function cineKindsOf() { return HOOK.call('cineKindsOf', cineKindsOfBase, arguments); }   // v31: extensions register with HOOK (00c)
function cineKindsOfBase(z, mode) { return mode === 'boss' ? ['lair', 'reveal', 'ready'] : mode === 'victory' ? ['vbeat', 'vfix', z === 9 ? 'finale' : 'vnext'] : (CINE_OVERRIDE[z] || CINE_KINDS); }   // v29: a function, so the cutscene scripts (25) can replace it
function victCaps(z, subj) {
  const li = LI(), sg = sagaOf(), zones = sg.zones, zn = zones[z].n[li], nx = z < 9 ? zones[z + 1].n[li] : '', bn = bossOfZone(subj, z).n, V = zones[z].vict;
  const f = s => storyFill(s[li], { boss: bn, z: zn, next: nx });
  const P = storyPeople();   // v22: the story names the hero and their pet
  return [t('cn.victTitle', { z: zn }), f(sg.beat) + ' ' + t('ep.victHero', P), f(V.fix) + (P.pet ? ' ' + t('ep.victPet', P) : ''), f(z === 9 ? sg.fin : V.next) + ' ' + t(z === 9 ? 'ep.finHero' : 'ep.nextHero', P)];
}
/* v26: fills {hero}, {boss}, {z}, {next} in a story line; the hero's name is capitalised at the start of a sentence */
function storyFill(s, o = {}) {
  const hero = heroName(), capH = hero.charAt(0).toUpperCase() + hero.slice(1);
  return s.replace(/\{(hero|boss|z|next)\}/g, (m, k, off) => k !== 'hero' ? (o[k] ?? m) : (/(^|[.!?…]["”]?\s+|["“]\s*)$/.test(s.slice(0, off)) ? capH : hero));
}
/* v26: is the age's villain shown sad (zone 5 shots, zone 10 shot 3) or beaten (finale)? set per saga */
function villainSad(z, kind) {
  const sg = sagaOf(), vs = sg.vsad || [true, true];
  if (kind === 'finale') return sg.vfin ? true : 'happy';   // beaten for good, or friends again
  return z === 4 ? !!vs[0] : z === 9 ? !!vs[1] : false;
}
const comicKey = (subj, z) => 'cine5:' + S.band + ':' + subj + ':' + z;   // each age band has its own saga, so its chapters play fresh (v26: new sagas, so cine4; v29: new cutscenes, so cine5)
const bossOfZone = (subj, z) => levelOf(SUBJ_ORDER.includes(subj) ? subj : 'math', z * 10 + 10).mon;
function comicCaps() { return HOOK.call('comicCaps', comicCapsBase, arguments); }   // v31: extensions register with HOOK (00c)
function comicCapsBase(z, subj, mode) {
  mode = mode || (UI.comic && UI.comic.mode) || 'chapter';
  const li = LI(), zd = sagaOf().zones[z], zn = zd.n[li], sk = SUBJ_ORDER.includes(subj) ? subj : 'math';
  const P = storyPeople();
  if (mode === 'boss') { const bn = bossOfZone(subj, z).n, L2 = zd.boss.map(x => storyFill(x[li], { boss: bn, z: zn })); L2[L2.length - 1] += ' ' + t(P.pet ? 'ep.bossPet' : 'ep.boss', P); return [t('cn.bossTitle', { z: zn }), ...L2]; }
  if (mode === 'victory') return victCaps(z, subj);
  const shots = zd.story.map(x => storyFill(x[li], { z: zn }));
  shots[4] = shots[4] + ' ' + t('cm.s.' + sk);
  if (P.pet) shots[0] = shots[0] + ' ' + t('ep.petJoins', P);   // v26: the chapter's own first line names the hero
  return [t('cn.chapter', { n: z + 1 }) + ': ' + zn, ...shots];
}
function inner(svg, x, y, w, h) { return svg.replace(/^<svg /, `<svg x="${x}" y="${y}" width="${w}" height="${h}" `); }
function murkSVG(sad, sm) {
  return `<svg viewBox="0 0 120 90" aria-hidden="true"><g fill="#9AA0B5"><circle cx="38" cy="50" r="26"/><circle cx="64" cy="38" r="30"/><circle cx="88" cy="52" r="24"/><rect x="26" y="52" width="76" height="24" rx="12"/></g><g fill="#fff"><ellipse cx="52" cy="50" rx="7" ry="${sad ? 8 : 9}"/><ellipse cx="76" cy="50" rx="7" ry="${sad ? 8 : 9}"/></g><g fill="#2a2233"><circle cx="53" cy="${sad ? 53 : 51}" r="3.6"/><circle cx="77" cy="${sad ? 53 : 51}" r="3.6"/></g>${sad ? '<path d="M54 68 Q64 61 74 68" stroke="#2a2233" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M45 38 L58 42 M83 38 L70 42" stroke="#2a2233" stroke-width="2.5" stroke-linecap="round"/><path d="M50 60 q-3 8 0 10 q3-2 0-10z" fill="#9fd4ff"/>' : '<path d="M52 66 Q64 76 76 66" stroke="#2a2233" stroke-width="3" fill="none" stroke-linecap="round"/>'}</svg>`;
}
/* the "villain" of each age band: Puff (4), Momo (5), Murk (6) and, since v26, the demon Drakmor (7) */
function villainSVG(mood, band = S.band) {
  const v = sagaOf(band).villain, ink = '#2a2233', sad = mood === true;
  if (S.pixel) return PXV.svg(v, mood);
  const tear = (x, y) => `<path d="M${x} ${y} q-3 8 0 10 q3-2 0-10z" fill="#9fd4ff"/>`;
  const mouth = (x, y, w) => sad ? `<path d="M${x - w} ${y + 4} Q${x} ${y - 4} ${x + w} ${y + 4}" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>` : `<path d="M${x - w} ${y} Q${x} ${y + 10} ${x + w} ${y}" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (v === 'puff') return `<svg viewBox="0 0 120 90" aria-hidden="true"><g fill="#E3D4FA" stroke="#B9A3E3" stroke-width="2"><circle cx="36" cy="52" r="22"/><circle cx="62" cy="40" r="27"/><circle cx="88" cy="54" r="21"/><rect x="24" y="52" width="80" height="24" rx="12"/></g><circle cx="44" cy="62" r="5" fill="#FFB3C7" opacity=".8"/><circle cx="84" cy="62" r="5" fill="#FFB3C7" opacity=".8"/>${sad ? `<g fill="${ink}"><circle cx="52" cy="54" r="3.4"/><circle cx="74" cy="54" r="3.4"/></g>${tear(48, 58)}` : `<path d="M47 52 q5 4 10 0 M69 52 q5 4 10 0" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`}${mouth(63, 64, 6)}<text x="96" y="30" font-size="12">${sad ? '' : 'z'}</text></svg>`;
  if (v === 'momo') return `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M86 70 Q110 64 104 40 Q100 52 90 58" stroke="#8B5A2B" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="74" rx="22" ry="14" fill="#8B5A2B"/><circle cx="32" cy="40" r="11" fill="#8B5A2B"/><circle cx="32" cy="40" r="6" fill="#E8C39E"/><circle cx="88" cy="40" r="11" fill="#8B5A2B"/><circle cx="88" cy="40" r="6" fill="#E8C39E"/><circle cx="60" cy="42" r="26" fill="#8B5A2B"/><path d="M44 46 Q44 30 60 32 Q76 30 76 46 Q78 64 60 64 Q42 64 44 46Z" fill="#E8C39E"/><path d="M56 18 q4 -8 8 0" stroke="#8B5A2B" stroke-width="4" fill="none"/><g fill="${ink}"><circle cx="53" cy="${sad ? 46 : 44}" r="3.4"/><circle cx="67" cy="${sad ? 46 : 44}" r="3.4"/></g><circle cx="54" cy="43" r="1.1" fill="#fff"/><circle cx="68" cy="43" r="1.1" fill="#fff"/>${mouth(60, 54, 6)}${sad ? tear(50, 50) : ''}<circle cx="80" cy="74" r="7" fill="#FFD166" stroke="#E0A800" stroke-width="2"/></svg>`;
  if (v === 'demon') {   /* v26: Drakmor; sad = sealed in chains */
    const sk = sad ? '#4A3E5C' : '#3A1E4A', wing = sad ? '#2E2638' : '#24102E', eye = sad ? '#8A8AA8' : '#FF3B3B';
    return `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M40 50 L6 18 L12 40 L0 50 L14 58 L8 74 L38 64Z" fill="${wing}"/><path d="M80 50 L114 18 L108 40 L120 50 L106 58 L112 74 L82 64Z" fill="${wing}"/><ellipse cx="60" cy="80" rx="34" ry="14" fill="${sk}"/><path d="M42 30 Q28 12 32 2 Q40 16 49 23Z" fill="#E8D8C0"/><path d="M78 30 Q92 12 88 2 Q80 16 71 23Z" fill="#E8D8C0"/><circle cx="60" cy="44" r="24" fill="${sk}"/><path d="M44 38 L57 43 L45 46Z" fill="${eye}"/><path d="M76 38 L63 43 L75 46Z" fill="${eye}"/>${sad ? `<path d="M50 58 Q60 54 70 58" stroke="#1A0A1E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M18 36 L102 82 M102 36 L18 82" stroke="#9AA3AE" stroke-width="4" stroke-dasharray="7 3"/>` : `<path d="M45 53 Q60 68 75 53Z" fill="#1A0A1E"/><path d="M50 54 l3 6 l3 -5 M64 54 l3 5 l3 -6" fill="#fff"/><path d="M58 70 l2 -4 l2 4z" fill="#FF6B3B"/>`}</svg>`;
  }
  if (v === 'glitch') return `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M60 10 V22" stroke="#6B7488" stroke-width="3"/><circle cx="60" cy="9" r="5" fill="${sad ? '#7FB8FF' : '#FF6B6B'}"/><rect x="30" y="22" width="60" height="46" rx="12" fill="#AAB4C8" stroke="#6B7488" stroke-width="3"/><rect x="38" y="30" width="44" height="28" rx="7" fill="#1d2a3a"/><circle cx="24" cy="44" r="7" fill="#8591AB"/><circle cx="96" cy="44" r="7" fill="#8591AB"/>${sad ? '<path d="M45 42 l10 4 M75 42 l-10 4" stroke="#7FD6FF" stroke-width="3" stroke-linecap="round"/><path d="M50 52 q5 -3 10 0 q5 3 10 0" stroke="#7FD6FF" stroke-width="2.4" fill="none"/>' : '<path d="M45 44 q5 -6 10 0 M65 44 q5 -6 10 0" stroke="#7FFFD4" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M50 50 Q60 57 70 50" stroke="#7FFFD4" stroke-width="2.6" fill="none" stroke-linecap="round"/>'}<rect x="40" y="68" width="40" height="16" rx="5" fill="#F3F6FA" stroke="#9AA9BD" stroke-width="2"/><circle cx="60" cy="76" r="4" fill="${sad ? '#FFD166' : '#6BD18B'}"/></svg>`;
  return murkSVG(sad);
}
/* one shot of a chapter (or of a boss intro) as a layered, moving SVG scene */
/* v31: one particle of the story's HTML effect layer. x, y and size are in the picture's 320 x 240 units.
   mode: fall / rise (move over the whole stage), twk (twinkles in place), plus extra classes (dust, conf, ember). */
function fxPart(mode, ch, x, y, sz, d, dl, col) {
  const k = mode.split(' ')[0], st = `left:${(x / 3.2).toFixed(1)}%;${k === 'twk' ? `top:${(y / 2.4).toFixed(1)}%;` : ''}--w:${(sz * (ch && S.pixel ? 1.24 : 1) / 3.2).toFixed(2)}%;--s:${sz};--d:${d}s;animation-delay:${dl}s${col ? ';--c:' + col : ''}`;
  const inner = !ch ? '<i></i>' : S.pixel ? `<img src="${PX.emo(ch)}" alt="" draggable="false">` : `<b>${ch}</b>`;
  return `<span class="fxp ${mode}" style="${st}"><em style="animation-delay:${dl}s">${inner}</em></span>`;
}
function cineScene() { return HOOK.call('cineScene', cineSceneBase, arguments); }   // v31: extensions register with HOOK (00c)
function cineSceneBase(z, k, subj, title, mode) {
  const zd = sagaOf().zones[z], boss = mode === 'boss', night = zd.night || boss, h = boss ? (zd.hue + 320) % 360 : zd.hue;
  const vict = mode === 'victory', kinds = cineKindsOf(z, mode), kind = title ? (boss ? 'btitle' : vict ? 'vtitle' : 'wide') : kinds[k];
  const dull = kind === 'prob' || (z === 9 && kind === 'murk' && !title), u = 'cs' + (uid++), R = rng(z * 131 + (k + 2) * 17 + (boss ? 7 : 0) + S.band * 1009 + (title ? 3 : 0));
  const sat = dull ? 10 : 80, hi = night ? (dull ? 16 : boss ? 20 : 24) : (dull ? 58 : 78), lo = night ? (dull ? 10 : boss ? 16 : 14) : (dull ? 48 : 90);
  const sky1 = `hsl(${h} ${night ? 42 : sat}% ${hi}%)`, sky2 = `hsl(${(h + 30) % 360} ${night ? 38 : sat}% ${lo}%)`;
  const far = `hsl(${(h + 60) % 360} ${dull ? 8 : 38}% ${night ? 22 : dull ? 46 : 70}%)`, mid = `hsl(${(h + 100) % 360} ${dull ? 10 : 42}% ${night ? 26 : dull ? 40 : 58}%)`, gr = `hsl(${(h + 110) % 360} ${dull ? 10 : 48}% ${night ? 20 : dull ? 34 : 48}%)`;
  /* pixel mode: every emoji prop becomes a tiny outlined pixel sprite (PX.emo) */
  const T = (ch, x, y, sz, cls, style) => S.pixel ? `<image href="${PX.emo(ch)}" x="${(x - sz * .62).toFixed(1)}" y="${(y - sz * .98).toFixed(1)}" width="${(sz * 1.24).toFixed(1)}" height="${(sz * 1.24).toFixed(1)}" image-rendering="pixelated" class="${cls}" style="${style}"/>` : `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="middle" class="${cls}" style="${style}">${ch}</text>`;
  const E = (ch, x, y, sz, cls = '', dl = 0) => T(ch, x, y, sz, cls, `animation-delay:${dl}s`);
  const sub = SUBJ_ORDER.includes(subj) ? subj : 'math';
  const H = (x, y, w) => inner(heroSVG(S.equipped), x, y, w, w * 1.32);
  const O = (x, y, w) => inner(owlSVG(), x, y, w, w);
  const PT = (x, y, w, dl = .3) => { const id = petOn(); return id ? `<g class="cn-pet" style="animation-delay:${dl}s">${inner(petAlone(id, petStage(id)).replace('class="pet-svg ', 'class="'), x, y, w, w)}</g>` : ''; };   // v22: the hero's pet joins the story
  const V = (x, y, w, sad) => inner(villainSVG(sad), x, y, w, w * .75);
  const SH = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${(rx * .2).toFixed(1)}" fill="rgba(0,0,0,.22)" class="cn-shadow"/>`;
  const walk = (inside, dl = 0) => `<g class="cn-walkin" style="animation-delay:${dl}s"><g class="cn-step" style="animation-delay:${dl}s">${inside}</g></g>`;
  const fly = (inside, dl = 0) => `<g class="cn-flyin" style="animation-delay:${dl}s"><g class="cn-flap">${inside}</g></g>`;
  const pop = (inside, dl = 0) => `<g class="cn-pop" style="animation-delay:${dl}s">${inside}</g>`;
  const bubble = (x, y, ch, dl = .7) => pop(`<path d="M${x - 18} ${y - 16} h36 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-14 l-8 8 l1 -8 h-15 a8 8 0 0 1 -8 -8 v-14 a8 8 0 0 1 8 -8z" fill="#fff" stroke="#2a2233" stroke-width="2"/>${T(ch, x, y + 7, 17, '', '')}`, dl);
  /* ambient particles that suit the zone (petals fall, bubbles rise, stars twinkle).
     v31: they live in an HTML layer above the picture (fxPart), so the graphics chip moves them and the main thread
     does not repaint the whole scene every frame (that was the story stutter on tablets). */
  const part = dull || kind === 'lair' || kind === 'btitle' ? 'dust' : zd.part, pmode = part === '🫧' ? 'rise' : part === '⭐' || part === '✨' ? 'twk' : part === 'dust' ? 'dust' : 'fall';
  let fx = Array.from({ length: pmode === 'twk' ? 9 : 8 }, () => {
    const x = 10 + R() * 300, d = (5 + R() * 6).toFixed(1), dl = (-R() * 11).toFixed(1), sz = Math.round(8 + R() * 9);
    if (pmode === 'dust') return fxPart('fall dust', '', x, 0, 3 + R() * 5, d, dl, boss ? '#FF9A8A' : '#D3D6E0');
    if (pmode === 'twk') return fxPart('twk', part, x, R() * 120 + 30, sz, (1.4 + R() * 1.6).toFixed(1), dl);
    return fxPart(pmode, part, x, 0, sz, d, dl);
  }).join('');
  let b = `<defs><linearGradient id="${u}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="210"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient><radialGradient id="${u}a"><stop offset="0" stop-color="${boss ? '#FF4D6D' : '#FFE98A'}" stop-opacity=".75"/><stop offset="1" stop-color="${boss ? '#FF4D6D' : '#FFE98A'}" stop-opacity="0"/></radialGradient></defs><rect x="-600" y="-600" width="1520" height="1200" fill="url(#${u})"/><rect x="-600" y="205" width="1520" height="600" fill="${gr}"/><g transform="translate(0 30)">`;
  if (S.pixel) { const bc = PX.bgCols(z, S.band, boss); b = b.replace(`fill="url(#${u})"/>`, `fill="${bc.sky}"/>`).replace(`height="600" fill="${gr}"/>`, `height="600" fill="${bc.ground}"/>`); }
  if (S.pixel) b += `<image href="${PX.bg(z, S.band, boss)}" x="-71" y="-36" width="462" height="260" preserveAspectRatio="none" image-rendering="pixelated" class="cn-pxbg${dull ? ' dull' : ''}"/>`;
  else {
  if (night) b += Array.from({ length: 14 }, (_, i) => `<circle cx="${Math.round(R() * 320)}" cy="${Math.round(R() * 90)}" r="${(1 + (i % 3) * .6).toFixed(1)}" fill="#FFF6C8" class="cm-tw" style="animation-delay:${(-i * .3).toFixed(1)}s"/>`).join('') + (dull || boss ? '' : `<g class="cn-glowp"><circle cx="256" cy="34" r="26" fill="#FFF3C4" opacity=".25"/><circle cx="256" cy="34" r="16" fill="#FFF3C4" opacity=".95"/></g>`);
  else if (!dull) b += `<g class="cn-spin" style="transform-origin:256px 36px">${Array.from({ length: 12 }, (_, i) => `<path d="M256 36 L${256 + Math.cos(i * .5236) * 44} ${36 + Math.sin(i * .5236) * 44}" stroke="#FFF3A0" stroke-width="5" stroke-linecap="round" opacity=".35"/>`).join('')}</g><circle cx="256" cy="36" r="20" fill="#FFF3A0" class="cn-sun"/>`;
  b += `<g class="cn-drift" style="--d:22s">${E('☁️', 40, 38, 30)}${E('☁️', 270, 60, 20)}</g><g class="cn-drift r" style="--d:15s">${E('☁️', 170, 26, 24)}</g>`;
  b += `<g class="cn-par1"><path d="M-40 118 Q20 74 90 110 T220 98 T360 114 V180 H-40Z" fill="${far}"/></g><g class="cn-par2"><path d="M-40 134 Q50 102 140 130 T360 124 V180 H-40Z" fill="${mid}"/></g><path d="M-40 152 Q90 138 180 150 T360 148 V180 H-40Z" fill="${gr}"/>`;
  }
  /* confetti falls in the HTML layer too (v31) */
  const conf = n => { for (let i = 0; i < n; i++) fx += fxPart('fall conf', '', R() * 320, 0, 5, (3 + R() * 3).toFixed(1), (-R() * 5).toFixed(1), ['#FF6B6B', '#FFD166', '#6BD18B', '#4DA3FF', '#B79CFF'][i % 5]); return ''; };
  const row = (ch, n, y, sz, x0 = 24, gap = 66, cls = 'cm-bob') => Array.from({ length: n }, (_, i) => E(ch, x0 + i * gap + (i % 2) * 10, y + (i % 2) * 6, sz + (i % 3) * 5, cls, (-i * .4).toFixed(1))).join('');
  if (kind === 'wide') b += row(zd.em, 5, 150, 22) + SH(60, 156, 26) + walk(H(34, 84, 52)) + walk(PT(74, 108, 50), .25) + fly(O(104, 106, 34), .5) + pop(E('👋', 152, 108, 16), 1.5) + pop(E('✨', 130, 96, 12, 'cm-tw'), 1.8);
  if (kind === 'prob') b += E(zd.bad, 210, 142, 66, 'cm-shake') + E(zd.bad, 270, 152, 32, 'cm-shake', -.3) + E(zd.bad, 150, 156, 26, 'cm-shake', -.15) + SH(70, 160, 24) + walk(H(46, 92, 50)) + pop(E('😟', 112, 118, 18), 1) + pop(E('❗', 124, 84, 24, 'cm-bob'), 1.3) + `<g class="cn-drift cn-fog" style="--d:9s" opacity=".55"><ellipse cx="60" cy="140" rx="90" ry="20" fill="#B9BDCB"/><ellipse cx="230" cy="150" rx="110" ry="22" fill="#B9BDCB"/></g>`;
  if (kind === 'owl') b += SH(52, 160, 22) + walk(H(28, 92, 46)) + `<g class="cn-hop">${O(124, 44, 108)}</g>` + bubble(222, 40, '💡') + row(zd.em, 2, 160, 14, 90, 140);
  if (kind === 'hero') b += row(zd.em, 4, 160, 16, 40, 80, 'cm-bob') + `<ellipse cx="160" cy="160" rx="58" ry="10" fill="url(#${u}a)" class="cn-pulse"/>` + `<g class="cn-rise-in"><g class="cn-stand">${H(110, 28, 100)}</g></g>` + PT(204, 104, 58, .6) + `<g class="cn-orbit" style="transform-origin:160px 92px">${E('✨', 160, 22, 16)}${E('⭐', 236, 96, 14)}${E('✨', 160, 168, 12)}${E('⭐', 84, 96, 14)}</g>`;
  if (kind === 'foe') { const m = monsterFor(sub, z * 10 + 3 + (k % 3)); b += SH(66, 152, 30) + walk(H(30, 62, 72)) + `<g class="cn-stompin">${inner(monsterSVG(m), 170, 28, 130, 122)}</g>` + pop(E('⚔️', 150, 112, 28, 'cn-clash'), 1.1) + E('💥', 156, 80, 20, 'cn-burst', -.2) + E('✨', 134, 76, 16, 'cn-burst', -1.1); }
  if (kind === 'win') b += row(zd.good, 5, 152, 24, 28, 64, 'cn-jump') + `<g class="cn-jump2"><g class="pose-cheer">${H(112, 42, 82)}</g></g>` + PT(56, 100, 56) + `<g class="cn-flap">${O(228, 90, 40)}</g>` + conf(10) + (z === 9 ? E('👑', 152, 44, 26, 'cm-bob') : '');
  /* v16 victory story shots */
  if (kind === 'vtitle') b += `<ellipse cx="160" cy="150" rx="110" ry="16" fill="url(#${u}a)" class="cn-pulse"/>` + `<g class="cn-rise-in"><g class="cn-stand">${H(54, 52, 76)}</g></g>` + PT(8, 104, 52, .5) + pop(E('🏆', 196, 128, 70, 'cm-bob'), .5) + [[120, 40], [260, 34], [196, 20]].map(([x, y], i) => E(S.pixel ? '🎉' : '🎆', x, y, 24, 'cn-burst', (-i * .6).toFixed(1))).join('') + conf(12);
  if (kind === 'vbeat') { const m = bossOfZone(subj, z); b += SH(66, 156, 28) + `<g class="cn-jump2"><g class="pose-cheer">${H(30, 62, 74)}</g></g>` + `<g class="cn-dizzy">${inner(monsterSVG(m), 176, 46, 116, 108)}</g>` + E('💫', 234, 52, 22, 'cn-twk') + pop(E('✋', 150, 104, 22, 'cn-clash'), .8) + E('⭐', 140, 60, 16, 'cn-burst', -.3) + E('✨', 286, 90, 14, 'cn-burst', -1) + conf(8); }
  if (kind === 'vfix') b += `<g class="cn-spin" style="transform-origin:160px 60px">${Array.from({ length: 12 }, (_, i) => `<path d="M160 60 L${160 + Math.cos(i * .5236) * 150} ${60 + Math.sin(i * .5236) * 150}" stroke="#FFF3A0" stroke-width="10" opacity=".14"/>`).join('')}</g>` + row(zd.good, 5, 152, 24, 28, 64, 'cn-jump') + PT(52, 104, 56) + `<g class="cn-jump2"><g class="pose-cheer">${H(112, 44, 82)}</g></g>` + `<g class="cn-flap">${O(228, 92, 40)}</g>` + conf(10);
  if (kind === 'vnext') { const nz = sagaOf().zones[Math.min(9, z + 1)]; b += `<g class="cn-float">${E(nz.em, 262, 128, 58, 'cm-bob')}</g>` + E('🚩', 220, 140, 22, 'cm-bob') + SH(70, 160, 22) + walk(H(46, 96, 50)) + walk(PT(4, 116, 46), .2) + fly(O(112, 98, 34), .5) + pop(E('🗺️', 150, 92, 22, 'cm-bob'), 1.1) + pop(E('➡️', 186, 120, 20, 'cm-bob'), 1.5); }
  if (kind === 'murk') { const sad = villainSad(z, 'murk'); b += `<g class="cn-float">${V(112, 40, 96, sad)}</g>` + SH(48, 160, 22) + walk(H(26, 98, 46)) + fly(O(250, 112, 34), .4) + (sad ? pop(E('💧', 206, 60, 14, 'cm-bob'), 1.2) : bubble(238, 50, '💬', 1)); }
  if (kind === 'finale') b += row('⭐', 6, 40, 20, 30, 52, 'cm-tw') + `<g class="cn-float">${V(60, 52, 96, villainSad(z, 'finale'))}</g>` + `<g class="cn-jump2"><g class="pose-cheer">${H(190, 56, 66)}</g></g>` + `<g class="cn-flap">${O(248, 100, 38)}</g>` + E('👑', 160, 40, 28, 'cm-bob') + [[40, 30], [280, 24], [150, 12]].map(([x, y], i) => E(S.pixel ? '✨' : '🎆', x, y, 26, 'cn-burst', (-i * .7).toFixed(1))).join('');
  if (kind === 'btitle') { const m = bossOfZone(subj, z); b += `<ellipse cx="160" cy="150" rx="120" ry="18" fill="url(#${u}a)" class="cn-pulse"/><g class="cn-rise-in slow"><g class="cn-shadowmon">${inner(monsterSVG(m), 80, -6, 160, 150)}</g></g>` + pop(E('⚠️', 160, 18, 22, 'cm-bob'), 1); }
  if (kind === 'lair') b += `<g class="cn-lair">${E(zd.em, 236, 150, 118)}</g>` + SH(70, 162, 22) + walk(H(46, 104, 44)) + pop(E('❓', 104, 100, 20, 'cm-bob'), 1.2) + `<g class="cn-drift cn-fog" style="--d:8s" opacity=".5"><ellipse cx="200" cy="158" rx="140" ry="18" fill="#6E5B7B"/></g>`;
  if (kind === 'reveal') { const m = bossOfZone(subj, z); b += `<ellipse cx="160" cy="150" rx="100" ry="16" fill="url(#${u}a)" class="cn-pulse"/><g class="cn-rise-in"><g class="cm-shake slow">${inner(monsterSVG(m), 76, 0, 168, 158)}</g></g>` + pop(E('❗', 70, 50, 26, 'cm-bob'), .9) + pop(E('❗', 254, 40, 22, 'cm-bob'), 1.1) + E('💢', 230, 30, 20, 'cn-burst', -.4); }
  if (kind === 'ready') { const m = bossOfZone(subj, z); b += `<g opacity=".55">${inner(monsterSVG(m), 236, 66, 76, 72)}</g><ellipse cx="128" cy="158" rx="50" ry="10" fill="url(#${u}a)" class="cn-pulse"/><circle cx="128" cy="98" r="58" fill="none" stroke="#FFD166" stroke-width="3" opacity=".6" class="cn-ring"/>` + `<g class="cn-rise-in"><g class="cn-stand">${H(86, 30, 84)}</g></g>` + fly(O(30, 92, 40), .3) + `<g class="cn-orbit" style="transform-origin:128px 98px">${E('✨', 128, 34, 14)}${E('⚡', 190, 102, 14)}${E('✨', 66, 102, 14)}</g>` + pop(E('⚔️', 196, 60, 22, 'cn-clash'), 1.2); }
  fx += epicLayers(kind, boss, R, night, S.pixel ? 'slice' : null);   // v22: foreground silhouettes, light rays, embers (v31: HTML layer)
  if (dull) b += `<g class="cn-drift cn-fog" style="--d:11s" opacity=".5"><ellipse cx="60" cy="140" rx="90" ry="20" fill="#B9BDCB"/><ellipse cx="220" cy="150" rx="110" ry="22" fill="#B9BDCB"/></g>`;
  b += '</g>';
  if (boss) b += `<rect x="-600" y="-600" width="1520" height="1200" fill="#fff" class="cn-flash"/>`;
  const wide = window.matchMedia && window.matchMedia('(min-aspect-ratio: 5/4)').matches;
  const par = `xMidYMid ${wide ? 'slice' : 'meet'}`;
  return `<svg class="cn-world" viewBox="0 0 320 240" role="img" aria-label="${esc(comicCaps(z, subj, mode)[title ? 0 : k + 1])}" preserveAspectRatio="${par}" data-sky="${sky1}" data-gr="${gr}">${b}</svg>` + (fx ? `<div class="cn-fxl" aria-hidden="true">${fx.replace(/__PAR__/g, par)}</div>` : '');
}
function openComic() { return HOOK.call('openComic', openComicBase, arguments); }   // v31: extensions register with HOOK (00c)
function openComicBase(z, then, subj = UI.subj, mode = 'chapter') {
  UI.comic = { z, i: Math.min(1, Math.max(0, comicCaps(z, subj, mode).length - 1)), then: then || null, subj, mode, picks: {}, last: comicCaps(z, subj, mode).length - 1 };
  comicWarm(UI.comic);   // v25: the sprite worker starts drawing this story's pictures while the wipe plays
  setMusic(musicOn() ? comicTune() : '');   // v22: the story theme (v32: the tune follows the mood of each scene)
  pxWipe(() => { if (!UI.comic) return; renderComic(); $('#comicOverlay').classList.add('on'); }); if (S.voice.auto) comicSpeak(UI.comic);
  if (mode === 'boss' && !S.sensory) setTimeout(() => sfx.growl(), 400);
  if (mode === 'victory' && !S.sensory) setTimeout(() => sfx.win(), 500);
}
const ICO_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4.5" height="16" rx="1.5"/><rect x="13.5" y="4" width="4.5" height="16" rx="1.5"/></svg>';
const ICO_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>';
const ICO_BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
let comicTimer = 0;
const cineMs = (c) => { const txt = comicCaps(c.z, c.subj, c.mode)[c.i] || ''; return c.i === 0 ? 3400 : Math.min(10000, Math.max(4200, 1200 + txt.length * 62)); };   // v29: shorter beats, so a little quicker
function comicAdvance() {
  const c = UI.comic; if (!c || c.i >= c.last || c.hold) return;   // v32: a choice must be made first
  c.i++; renderComic(); sfx.soft(); if (S.voice.auto) comicSpeak(c);   // v32: each speaker has a voice of their own (29)
}
function comicBack() {
  const c = UI.comic; if (!c || c.i <= 1) return;   // v33: scene 1 is the first one
  c.i--; renderComic(); sfx.soft(); if (S.voice.auto) comicSpeak(c);
}
function comicSchedule() {
  clearTimeout(comicTimer); const c = UI.comic; if (!c) return;
  const run = c.i < c.last && !c.paused && !c.hold;
  if (run) comicTimer = setTimeout(() => { if (UI.comic === c && !c.paused) comicAdvance(); }, cineMs(c));
}
function comicTogglePause() {
  const c = UI.comic; if (!c) return; c.paused = !c.paused;
  const sh = $('#comicSheet'); if (sh) sh.classList.toggle('paused', !!c.paused);
  const b = $('#comicSheet [data-act="comicPause"]');
  if (b) { b.innerHTML = c.paused ? ICO_PLAY : ICO_PAUSE; b.setAttribute('aria-pressed', c.paused ? 'true' : 'false'); b.setAttribute('aria-label', t(c.paused ? 'cm.play' : 'cm.pause')); }
  comicSchedule();
}
function renderComic() { return HOOK.call('renderComic', renderComicBase, arguments); }   // v31: extensions register with HOOK (00c)
function renderComicBase() {
  const c = UI.comic; if (!c) return; const caps = comicCaps(c.z, c.subj, c.mode), zn = zoneName(c.z), title = c.i === 0, boss = c.mode === 'boss';
  c.last = caps.length - 1; const last = c.i >= c.last, bn = boss ? bossOfZone(c.subj, c.z).n : '';
  const moves = ['zin', 'zout', 'panl', 'panr', 'zin', 'zout', 'panl'], mv = moves[c.i % moves.length];
  const segs = caps.map((_, k) => k === 0 ? '' : `<i class="${k < c.i ? 'done' : k === c.i ? 'now' : ''}"${k === c.i && !last ? ` style="--d:${cineMs(c)}ms"` : ''}></i>`).join('');
  const words = caps[c.i].split(/\s+/).map((w, i) => `<span style="--w:${i}">${esc(w)}</span>`).join(' ');
  const text = title
    ? (boss ? `<div class="cn-title boss"><small>👑 ${esc(t('cn.bossLabel'))}</small><h2>${esc(bn)}</h2><span class="cn-tz">${esc(zn)}</span></div>` : c.mode === 'victory' ? `<div class="cn-title vict"><small>🏆 ${esc(t('cn.victLabel'))}</small><h2>${esc(zn)}</h2><span class="cn-tz">${esc(t('cn.victBeat', { m: '', boss: bossOfZone(c.subj, c.z).n }))}</span></div>` : `<div class="cn-title"><small>${esc(t('cn.chapter', { n: c.z + 1 }))}</small><h2>${esc(zn)}</h2><span class="cn-tz">${esc(sagaOf().title[LI()])}</span></div>`)
    : S.pixel ? cineDialog(c, caps[c.i]) : `<p class="cn-sub" aria-live="polite" aria-label="${esc(caps[c.i])}">${words}</p>`;
  const pk = comicPreKey(c.i), scn = (c.pre && c.pre[pk]) || cineScene(c.z, c.i - 1, c.subj, title, c.mode), _m = scn.match(/data-sky="([^"]+)" data-gr="([^"]+)"/);
  const sh = $('#comicSheet'); sh.className = 'sheet cine' + (c.paused ? ' paused' : '') + (boss ? ' bossmode' : '');
  sh.innerHTML = `<div class="cn-stage cn-${mv}${title ? ' epic' : ''}" style="--sky:${_m[1]};--gr:${_m[2]}" data-act="comicTap">${scn}<div class="cn-vig"></div>${S.sensory ? '' : '<i class="cn-iris" aria-hidden="true"></i><i class="cn-lb t" aria-hidden="true"></i><i class="cn-lb b" aria-hidden="true"></i>'}</div>
    <div class="cn-bar top"><div class="cn-seg" aria-hidden="true" role="presentation">${segs}</div><span class="cn-chap">${boss ? '👑' : '📖'} ${esc(zn)} <small>${esc(t('cn.shot', { i: c.i, n: caps.length - 1 }))}</small></span></div>
    <div class="cn-bar bot">${text}<div class="cn-ctl">${last ? `<button class="btn big good" data-act="comicEnter">${esc(boss ? t('cn.fight', { m: bn }) : c.mode === 'victory' ? t('cn.claim') : t('cm.enter', { z: zn }))}</button>` : `<button class="btn big" data-act="comicNext">${t('cn.next')}</button>`}<button class="btn ghost icon" data-act="comicSay" data-v="${c.i}" aria-label="${esc(t('cm.listen'))}">🔊</button></div></div>`;
  comicSchedule(); cineFit(); epicBeat(c, title); comicPrep(c);
  if (c.shotSeen !== c.i) { c.shotSeen = c.i; HOOK.emit('comic:shot', c); }   // v31: vibration (26)
}
/* v13 pixel mode: the caption becomes an RPG dialogue window with a portrait of whoever the shot is about,
   a gold name plate, letter-by-letter typing and a blinking arrow when the line is done */
function cineSpeaker() { return HOOK.call('cineSpeaker', cineSpeakerBase, arguments); }   // v31: extensions register with HOOK (00c)
function cineSpeakerBase(c) {
  const k = c.i - 1, kind = cineKindsOf(c.z, c.mode)[k];
  const sub = SUBJ_ORDER.includes(c.subj) ? c.subj : 'math', kn = KNIGHTS[S.equipped.knight];
  const hero = { svg: heroSVG(S.equipped), name: heroName() + (kn && heroName() !== kn.name ? ' · ' + kn.name : '') }, owl = { svg: owlSVG(), name: 'Hoot' };
  if (kind === 'foe') { const m = monsterFor(sub, c.z * 10 + 3 + (k % 3)); return { svg: monsterSVG(m), name: m.n, foe: 1 }; }
  if (kind === 'vbeat') { const m = bossOfZone(c.subj, c.z); return { svg: monsterSVG(m), name: m.n }; }
  if (kind === 'vnext') return owl;
  if (kind === 'vfix') return hero;
  if (kind === 'reveal') { const m = bossOfZone(c.subj, c.z); return { svg: monsterSVG(m), name: m.n, foe: 1 }; }
  if (kind === 'murk') return { svg: villainSVG(villainSad(c.z, kind)), name: sagaOf().vname[LI()], foe: 1 };
  if (kind === 'finale') return hero;   // v26: the last shot belongs to the hero
  if (kind === 'hero' || kind === 'win' || kind === 'ready' || kind === 'prob') return hero;
  return owl;
}
function cineDialog() { return HOOK.call('cineDialog', cineDialogBase, arguments); }   // v31: extensions register with HOOK (00c)
function cineDialogBase(c, line) {
  const sp = cineSpeaker(c); let n = 0;
  const chars = line.split(/\s+/).map(w => { const c0 = n; n += [...w].length; return `<span class="w" style="--c:${c0}">${esc(w)}</span>`; }).join(' ');   // v31: word by word (one animation per word, not per letter)
  return `<div class="cn-dlg${sp.foe ? ' foe' : ''}"><div class="cn-port" aria-hidden="true">${sp.svg}</div><div class="cn-say"><b class="cn-who">${esc(sp.name)}</b><p class="cn-sub" aria-live="polite" aria-label="${esc(line)}">${chars}</p><i class="cn-more" aria-hidden="true" style="--n:${n}">▼</i></div></div>`;
}
/* v15: the picture fills the space ABOVE the caption box, so characters are never hidden low behind it */
/* v30: measured in the next frame, after the new scene is on screen, so the script never waits for a layout */
let cineFitRaf = 0;
function cineFit() { cancelAnimationFrame(cineFitRaf); cineFitRaf = requestAnimationFrame(cineFitNow); }
function cineFitNow() {
  cineFitRaf = 0;
  const sh = $('#comicSheet'), st = sh && sh.querySelector('.cn-stage'), bot = sh && sh.querySelector('.cn-bar.bot'), top = sh && sh.querySelector('.cn-bar.top');
  if (!st || !bot) return;
  const tall = sh.clientHeight > sh.clientWidth * 1.1;
  st.style.setProperty('--cn-top', (top ? Math.round(top.offsetHeight * (tall ? .9 : .4)) : 0) + 'px');
  st.style.setProperty('--cn-bot', Math.max(0, bot.offsetHeight - (tall ? 6 : 24)) + 'px');
}
window.addEventListener('resize', () => { if (UI.comic) cineFit(); });
function closeComic(seen) {
  const c = UI.comic; if (!c) return; clearTimeout(comicTimer); typeStop();   // v31: the word-by-word typing (28)
  if (seen) { (S.comics || (S.comics = {}))[storyKeyOf(c.mode, c.subj, c.z, c)] = 1; save(); }
  UI.comic = null; try { speechSynthesis.cancel(); } catch (_) { } setTimeout(syncMusic, 50);
  pxWipe(() => { $('#comicOverlay').classList.remove('on'); storyDone(c); });
}
function storyDone(c) {
  if (c.then) { c.then(); return; }
  /* v15: a story with nowhere else to go opens the level card for where the story happens */
  const id = storyNextLevel(c.subj, c.z, c.mode);
  if (id && UI.tab === 'adventure') { UI.zoneOpen[c.subj] = c.z; if (UI.screen === 'levels') renderMap(); setTimeout(() => { if (!UI.comic && !B.active) openBrief(id); }, 60); }
}
/* the level a story leads to: the boss after a boss story, else the next level to play in that zone, else its first level */
function storyNextLevel(subj, z, mode) {
  if (!SUBJ_ORDER.includes(subj)) return null;
  const cand = mode === 'boss' ? [z * 10 + 10] : [];
  for (let n = z * 10 + 1; n <= z * 10 + 10; n++) if (isUnlocked(levelOf(subj, n)) && !starsAt(subj, n)) { cand.push(n); break; }
  cand.push(z * 10 + 1);
  for (const n of cand) { const lv = levelOf(subj, n); if (isUnlocked(lv)) return lv.id; }
  return null;
}
function gotoLevel(id, direct) {
  const l = getLevel(id), go = () => direct ? enterBattle(id) : openBrief(id);
  if (!l.steam && !((S.comics || {})[comicKey(l.subj, l.z)])) { openComic(l.z, go, l.subj); return; }
  go();
}
/* ================= v7: stage weather (canvas) ================= */
const WX_BY_Z = ['sun', 'leaves', 'bubbles', 'puffs', 'confetti', 'stars', 'dust', 'gold', 'fireflies', 'cosmic'];
const wxKind = lv => lv.subj === 'sc' ? 'lab' : WX_BY_Z[lv.z % 10];
const WX = { raf: 0, kind: null, parts: [], w: 0, h: 0, ctx: null, fit: null };
const WXN = { sun: 22, leaves: 20, bubbles: 22, puffs: 9, confetti: 28, stars: 30, dust: 30, gold: 24, fireflies: 16, cosmic: 34, lab: 26 };
function wxSpawn(kind, init) {
  const w = WX.w, h = WX.h, r = Math.random, p = { x: r() * w, y: init ? r() * h : -12, vx: 0, vy: 0, s: 3 + r() * 5, rot: r() * 6.28, vr: (r() - .5) * 2, ph: r() * 6.28, c: '#fff', t: 0 };
  switch (kind) {
    case 'leaves': p.vy = 26 + r() * 26; p.vx = 8 + r() * 14; p.s = 5 + r() * 5; p.c = ['#6BD18B', '#F2B93B', '#E08A3C', '#8FD16B', '#FF9F7A'][Math.floor(r() * 5)]; break;
    case 'lab': p.t = r() < .3 ? 1 : 0; if (p.t) { p.y = init ? r() * h : h * .3 + r() * h * .5; p.vy = 0; p.s = 2 + r() * 2; p.life = 0; } else { p.y = init ? r() * h : h + 10; p.vy = -(18 + r() * 28); p.s = 3 + r() * 7; p.vx = (r() - .5) * 10; } break;
    case 'stars': case 'cosmic': p.vx = -(3 + r() * 8); p.vy = (r() - .5) * 3; p.s = 2 + r() * 4; p.y = r() * h * .85; p.x = init ? r() * w : w + 10; p.c = kind === 'cosmic' && r() < .3 ? '#C9A8FF' : '#FFF2B0'; break;
    case 'sun': p.vx = 6 + r() * 8; p.vy = -(4 + r() * 8); p.s = 2 + r() * 3; p.y = init ? r() * h : h + 6; p.c = '#FFF0A8'; break;
    case 'puffs': p.vx = 8 + r() * 14; p.vy = 0; p.s = 10 + r() * 14; p.x = init ? r() * w : -30; p.y = r() * h * .6; break;
    case 'confetti': p.vy = 20 + r() * 20; p.vx = (r() - .5) * 16; p.s = 3 + r() * 3; p.c = ['#FF6B6B', '#FFD166', '#6BD18B', '#4DA3FF', '#B79CFF', '#FF8FB1'][Math.floor(r() * 6)]; break;
    case 'dust': p.vx = 30 + r() * 40; p.vy = (r() - .5) * 8; p.s = 1.5 + r() * 2.5; p.x = init ? r() * w : -8; p.y = r() * h; p.c = r() < .2 ? '#FFB066' : '#E8D2A6'; break;
    case 'gold': p.vy = -(10 + r() * 16); p.vx = (r() - .5) * 8; p.s = 2.5 + r() * 4; p.y = init ? r() * h : h + 8; p.c = '#FFD54A'; break;
    case 'fireflies': p.vx = (r() - .5) * 16; p.vy = (r() - .5) * 12; p.s = 2.5 + r() * 2; p.y = h * .2 + r() * h * .65; p.c = '#E6FF7A'; break;
  }
  return p;
}
function wxDraw(dt, time) {
  const c = WX.ctx, w = WX.w, h = WX.h, k = WX.kind; c.clearRect(0, 0, w, h);
  for (let i = 0; i < WX.parts.length; i++) {
    const p = WX.parts[i]; let dead = false;
    p.rot += p.vr * dt; p.ph += dt * 2;
    if (k === 'fireflies') { p.vx += (Math.random() - .5) * 20 * dt; p.vy += (Math.random() - .5) * 16 * dt; p.vx = Math.max(-18, Math.min(18, p.vx)); p.vy = Math.max(-14, Math.min(14, p.vy)); }
    if (!(k === 'lab' && p.t)) { p.x += (p.vx + (k === 'leaves' || k === 'confetti' ? Math.sin(p.ph) * 14 : 0)) * dt; p.y += p.vy * dt; }
    if (p.x > w + 40) p.x = -20; if (p.x < -40 && k !== 'leaves') p.x = w + 20;
    if (k === 'leaves' || k === 'confetti') dead = p.y > h + 14; else if (k === 'bubbles' || k === 'sun' || k === 'gold' || (k === 'lab' && !p.t)) dead = p.y < -14; else if (k === 'fireflies') { if (p.y < 0 || p.y > h) p.vy *= -1; }
    c.save(); c.translate(p.x, p.y);
    switch (k) {
      case 'leaves': c.rotate(p.rot); c.fillStyle = p.c; c.beginPath(); c.ellipse(0, 0, p.s, p.s * .5, 0, 0, 6.283); c.fill(); c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-p.s, 0); c.lineTo(p.s, 0); c.stroke(); break;
      case 'bubbles': case 'lab':
        if (k === 'lab' && p.t) { const a = .35 + .65 * Math.abs(Math.sin(p.ph * 1.6)); c.globalAlpha = a; c.fillStyle = '#FFE98A'; c.fillRect(-p.s, -.6, p.s * 2, 1.2); c.fillRect(-.6, -p.s, 1.2, p.s * 2); c.fillRect(-1.5, -1.5, 3, 3); break; }
        c.strokeStyle = 'rgba(255,255,255,.85)'; c.fillStyle = 'rgba(190,235,255,.28)'; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, p.s, 0, 6.283); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(-p.s * .35, -p.s * .35, p.s * .22, 0, 6.283); c.fill(); break;
      case 'stars': case 'cosmic': { const a = .45 + .55 * Math.abs(Math.sin(p.ph + time)); c.globalAlpha = a; c.fillStyle = p.c; const s = p.s; c.beginPath(); c.moveTo(0, -s * 1.8); c.lineTo(s * .45, -s * .45); c.lineTo(s * 1.8, 0); c.lineTo(s * .45, s * .45); c.lineTo(0, s * 1.8); c.lineTo(-s * .45, s * .45); c.lineTo(-s * 1.8, 0); c.lineTo(-s * .45, -s * .45); c.closePath(); c.fill(); break; }
      case 'sun': c.globalAlpha = .35 + .35 * Math.sin(p.ph); c.fillStyle = p.c; c.beginPath(); c.arc(0, 0, p.s, 0, 6.283); c.fill(); break;
      case 'puffs': c.globalAlpha = .38; c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, p.s, 0, 6.283); c.arc(p.s * .9, p.s * .2, p.s * .75, 0, 6.283); c.arc(-p.s * .9, p.s * .25, p.s * .7, 0, 6.283); c.fill(); break;
      case 'confetti': c.rotate(p.rot * 3); c.fillStyle = p.c; c.globalAlpha = .9; c.fillRect(-p.s, -p.s * .45, p.s * 2, p.s * .9); break;
      case 'dust': c.globalAlpha = .5; c.fillStyle = p.c; c.beginPath(); c.arc(0, 0, p.s, 0, 6.283); c.fill(); break;
      case 'gold': { const a = .4 + .6 * Math.abs(Math.sin(p.ph * 1.5)); c.globalAlpha = a; c.fillStyle = p.c; const s = p.s; c.rotate(.785); c.fillRect(-s * .35, -s * 1.4, s * .7, s * 2.8); c.rotate(1.571); c.fillRect(-s * .35, -s * 1.4, s * .7, s * 2.8); break; }
      case 'fireflies': { const a = .35 + .65 * Math.abs(Math.sin(p.ph)); c.globalAlpha = a * .35; c.fillStyle = p.c; c.beginPath(); c.arc(0, 0, p.s * 3.2, 0, 6.283); c.fill(); c.globalAlpha = a; c.beginPath(); c.arc(0, 0, p.s, 0, 6.283); c.fill(); break; }
    }
    c.restore();
    if (dead) WX.parts[i] = wxSpawn(k, false);
  }
}
function wxStop() { cancelAnimationFrame(WX.raf); WX.raf = 0; if (WX.ctx) { try { WX.ctx.clearRect(0, 0, WX.w, WX.h); } catch (_) { } } }
function wxStart(kind) {
  wxStop(); const cv = $('#wx'); if (!cv) return;
  if (S.sensory || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  const ctx = cv.getContext && cv.getContext('2d'); if (!ctx) return;
  const st = $('#stage'), dpr = S.pixel ? .34 : Math.min(1.5, window.devicePixelRatio || 1);   // pixel mode draws weather at low resolution so it comes out blocky
  WX.fit = () => { const r = st.getBoundingClientRect(); WX.w = Math.max(10, r.width); WX.h = Math.max(10, r.height); cv.width = WX.w * dpr; cv.height = WX.h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  WX.fit(); WX.ctx = ctx; WX.kind = kind; WX.parts = Array.from({ length: WXN[kind] || 20 }, () => wxSpawn(kind, true));
  let last = 0;
  const loop = ts => {
    WX.raf = requestAnimationFrame(loop); if (ts - last < 33) return;
    const dt = Math.min(.1, (ts - last) / 1000); last = ts;
    if (UI.tab !== 'adventure' || UI.adv !== 'battle' || document.hidden) return;
    wxDraw(dt, ts / 1000);
  };
  WX.raf = requestAnimationFrame(loop);
}
window.addEventListener('resize', () => { if (WX.fit && WX.raf) WX.fit(); });

/* ================= v7: idle fidgets so characters feel alive ================= */
setInterval(() => {
  if (S.sensory || document.hidden) return;
  if (UI.tab === 'adventure' && UI.adv === 'battle' && B.active && !B.locked) {
    const h = $('#heroSprite'), m = $('#monSprite');
    if (h) heroPose(h, pick(['wave', 'hop', 'look']), 1500);
    if (m && Math.random() < .6) pose(m, 'taunt', 1000);
  } else if (UI.tab === 'armory' && UI.arm !== 'haven') { const p = $('.arm-top .preview'); if (p) heroPose(p, pick(['wave', 'hop', 'look']), 1500); }
}, 6500);

function lessonDoneHTML(m) {
  if (S.learned[m.id]) return `<p class="note ldone" style="margin-top:12px">${t('pet.lessonAgain')}</p>`;
  return `<button class="btn good big" style="width:100%;margin-top:12px" data-act="lessonDone" data-v="${m.id}">${t('pet.lessonDone')}</button>`;
}
