/* ================= Battle screen ================= */
function buildAdventure() {
  $('#tab-adventure').innerHTML = `<div id="mapView"></div><div id="battleView" class="adv" hidden>
    <div class="stage" id="stage"><div class="cambg" aria-hidden="true"></div><div class="scenery" id="scenery" aria-hidden="true"></div><div class="arena-sky" aria-hidden="true"><i class="rays"></i><i class="bolt"></i></div><div class="arena-floor" aria-hidden="true"><i class="ped hero"></i><i class="ped mon"></i></div><canvas class="wx" id="wx" aria-hidden="true"></canvas><div class="fog" id="fogLayer" hidden aria-hidden="true"><span>☁️</span><span>☁️</span><span>☁️</span></div><div class="phasebar" id="phasebar" hidden></div><div class="phase-banner" id="phaseBanner" hidden role="status"></div>
      <div class="stage-top"><span class="lvbadge" id="placeName"></span><span class="tierchip" id="tierChip" hidden></span><span class="chip static cl" id="comboChip" hidden></span><span class="chip static turnchip" id="turnChip" hidden></span></div>
      <div class="sprite hero" id="heroSprite"></div><div class="sprite monster" id="monSprite"></div><div class="minions" id="minions" aria-hidden="true"></div>
      <div class="plate hero" id="hPlate"><div class="pn"><span id="hName"></span><span class="pips" id="pips" role="img"><i></i><i></i><i></i></span></div><div class="bar"><b class="ghost" id="hGhost"></b><i id="hBar"></i><span id="hTxt"></span></div></div>
      <div class="plate mon" id="mPlate"><div class="pn"><span id="mName"></span></div><div class="bar mon"><b class="ghost" id="mGhost"></b><i id="mBar"></i><span id="mTxt"></span></div></div>
      <div class="sr-only" id="srLive" aria-live="polite" aria-atomic="true"></div><div class="sr-only" id="srAlert" aria-live="assertive" aria-atomic="true"></div><div class="fx" id="fxLayer" aria-hidden="true"></div><div class="vs-intro" id="vsIntro" hidden aria-hidden="true"></div><div class="tele" id="tele" hidden role="status"><b></b><i><u></u></i></div><div class="mtalk" id="mTalk" hidden aria-hidden="true"></div><button class="mclose" data-act="retreat" aria-label="Close">✕</button>
    </div>
    <div class="combat">
      <div class="cL">
        <div class="qcard"><div class="qhead"><span class="tag cl" id="qTag"></span><button class="speak" id="qSpeak" data-act="sayQ">🔊</button></div>
          <div class="wcard" id="wcard" hidden></div>
          <div class="think" id="think" hidden><i></i></div><div class="think enrage" id="enrage" hidden aria-hidden="true"><i></i></div><p id="qText"></p>
          <div class="qviz" id="qViz"></div><p class="qfb" id="qFb" hidden aria-live="polite"></p></div>
      </div>
      <div class="cR"><div id="expr"></div><div class="answers" id="answers"></div></div>
    </div></div>`;
  retitleBattle();
}
function retitleBattle() {
  $('#hName').textContent = t('b.hero'); $('#qSpeak').setAttribute('aria-label', t('b.readq'));
  $('#battleView .mclose').setAttribute('aria-label', t('st.close'));
}
function updateHud() { return HOOK.call('updateHud', updateHudBase, arguments); }   // v32: sounds and the team bar listen (30, 32)
function updateHudBase() {
  const hp = Math.max(0, B.hHp), mp = Math.max(0, B.mHp), hpc = hp / B.hMax * 100, mpc = mp / B.mMax * 100, ch = B.charge || 0;
  $('#hBar').style.width = hpc + '%'; $('#mBar').style.width = mpc + '%'; $('#hGhost').style.width = hpc + '%'; $('#mGhost').style.width = mpc + '%';
  $('#hTxt').textContent = `${hp} / ${B.hMax}`; $('#mTxt').textContent = `${mp} / ${B.mMax}`;
  $('#hPlate').classList.toggle('low', hpc <= 30); $('#mPlate').classList.toggle('low', mpc <= 30);
  const m = $('#monSprite'); if (m) m.classList.toggle('weak', mpc > 0 && mpc <= 30);
  $$('#pips i').forEach((p, i) => p.classList.toggle('on', i < ch)); const pp = $('#pips'); pp.classList.toggle('full', ch >= 3); pp.setAttribute('aria-label', t('b.charge', { n: ch }));
  const c = $('#comboChip'), k = (B.combo || 0) % FIN_EVERY; c.hidden = (B.combo || 0) < 1; c.innerHTML = comboHTML(); c.classList.toggle('hot', k === FIN_EVERY - 1); c.setAttribute('aria-label', t('fin.combo', { n: k }));
}
/* the word card: the target word is always visible first, then (for older ages) hides and can be peeked at again */
const qKey = q => q.kind === 'wx' ? q.key : q.kind === 'trace' ? 'trace:' + q.glyph : (q.kind || '') + ':' + (q.text || '') + ':' + (q.options || []).map(String).sort().join('|');
function nextQuestion() { return HOOK.call('nextQuestion', nextQuestionBase, arguments); }   // v31: extensions register with HOOK (00c)
function nextQuestionBase(forced) {   // forced: a ready question (used by tests and the lesson practice)
  let q, g = 0;
  /* v24: a question counts as "the same" when its words and its set of answers match, whatever their order,
     so no question repeats inside a battle (or across the last 80 questions) */
  const fresh = x => { if (!x) return false; const k = qKey(x); return k !== B.lastKey && !B.seen.has(k) && !RECENT.includes(k); };
  if (forced && forced.options) q = forced;
  else if (wantsTrace(B.lv)) q = traceQ(B.lv.subj);   // v21: age 4 tracing
  else {
    const band = Math.max(1, Math.min(4, S.band + (B.shift || 0)));
    q = QT.pickFor(B.lv, band);   // v22: order, match, odd one out, true or false; v35: more formats, and a plain "no" (null) is no longer re-rolled
    if (q) {   // v36: a few candidates, then the one this child has not seen (or saw longest ago)
      const cands = [q]; for (let k = 0; k < 5 && cands.length < 4; k++) { const c = QT.pickFor({ ...B.lv, force: true }, band); if (c) cands.push(c); }
      const ok = cands.filter(fresh); q = seenBest(ok.length ? ok : cands);
    }
    if (!fresh(q)) { q = null; do { q = makeQ(pick(B.pool), S.band, B.lv); } while (!fresh(q) && g++ < 60); }
  }
  const qk = qKey(q); seenBump(q); B.seen.add(qk); B.seen.add(q.key); RECENT.push(qk, q.key); while (RECENT.length > 160) RECENT.shift();   // both keys: the bank picker looks up the plain one
  if (q.memKey) { const m = qMem(q.memSubj); m.push(q.memKey); if (m.length > q.memCap) m.splice(0, m.length - q.memCap); }
  clearTimeout(B.wTimer);
  Object.assign(B, { q, lastKey: qk, wrong: 0, picked: new Set(), locked: false, tier: 0, step: 0, msg: null, lead: '', strokes: [], vState: 'idle', vHeard: '', vErr: '', vMode: '', rightIdx: -1, wordVisible: true, fog: null, enraged: false });
  $('#qTag').textContent = q.tag; $('#qText').textContent = q.text;
  renderQViz(); renderHint(); renderExpr();
  const an = $('#answers'); an.classList.add('fresh'); clearTimeout(B.freshT); B.freshT = setTimeout(() => an.classList.remove('fresh'), 1000);
  renderAnswers(); resetThink();
  if (!S.sensory) { replayClass($('#battleView .qcard'), 'qin'); }
  renderWord();
  B.qStart = Date.now();
  if (!S.voice.auto) announce(t('sr.q', { q: q.text }));   // v21: screen readers hear each new question
  bossSetup();
  if (S.voice.auto) speakSeq(q.speak);
}
function renderQViz() {
  const q = B.q; if (!q) return; const v = $('#qViz');
  if (!q.manip) { v.innerHTML = q.viz(B.tier >= 1); return; }
  if (q.rep === 'concrete') { v.innerHTML = ''; const host = document.createElement('div'); v.appendChild(host); mountManip(host, q.manip); }
  else if (q.rep === 'pictorial') v.innerHTML = q.viz(B.tier >= 1);
  else v.innerHTML = `<div class="eq">${esc(q.eq)}</div>`;
}
function renderAnswers() {
  const q = B.q; if (!q) return; const a = $('#answers');
  if (q.kind === 'trace') { if (a.__q !== q || !a.querySelector('.trace')) { a.__q = q; mountTraceAnswer(); } return; }   // v23: a new trace question always gets a fresh pad
  if (q.mount) {   // v35: new-format widgets (content/formats.js) mount themselves; hints just refresh them
    if (a.__q === q && a.firstElementChild) { if (q.refresh) q.refresh(); return; }
    a.__q = q; a.hidden = false; a.style.gridTemplateColumns = '1fr'; a.classList.remove('long'); q.mount(a, wxHooks(q)); setTimeout(() => { try { if (B.q === q && a.getBoundingClientRect().bottom > innerHeight) a.scrollIntoView({ block: 'end', behavior: S.sensory ? 'auto' : 'smooth' }); } catch (e) { /* ignore */ } }, 60); return;
  }
  if (q.kind === 'order' || q.kind === 'match') {   // v22: drag/tap widgets keep their state; hints just refresh them
    if (a.__q === q && a.querySelector('.ordr,.mtch')) { if (q.refresh) q.refresh(); return; }
    a.__q = q; a.hidden = false; a.style.gridTemplateColumns = '1fr'; a.classList.remove('long'); (q.kind === 'order' ? mountOrder : mountQtMatch)(a, q); return;
  }
  a.__q = null; a.hidden = voiceOn(q) || writeOn(q);   // v34: the writing pad replaces the buttons
  const n = q.options.length, wide = !!(window.matchMedia && matchMedia('(min-width:900px)').matches);
  const cols = n <= 3 ? n : q.cls === 'txt' || q.cls === 'odd' ? 2 : n === 4 ? (wide || q.cls === 'spell' ? 2 : 4) : 3;
  a.style.gridTemplateColumns = `repeat(${cols},minmax(0,1fr))`; a.classList.toggle('long', q.cls === 'txt');
  const nextTile = q.kind === 'phonics' ? q.options.findIndex((o, i) => !q.used.has(i) && o === q.parts[q.pos]) : -1;
  a.innerHTML = q.options.map((o, i) => {
    const used = q.used && q.used.has(i), soft = B.picked.has(i);
    return `<button class="ans ${q.cls} ${used ? 'used' : ''} ${soft ? 'soft' : ''} ${B.rightIdx === i ? 'right' : ''} ${B.fog && B.fog.has(i) ? 'fogged' : ''} ${B.tier >= 1 && i === nextTile ? 'hl' : ''}" data-act="pick" data-v="${i}" style="--i:${i}" ${B.fog && B.fog.has(i) ? `aria-label="${esc(t('boss.fogTap'))}"` : ''} ${used || soft ? 'disabled' : ''}>${esc(o)}</button>`;
  }).join('');
}

/* ---- Vygotskian hint ladder: look closer -> easier example -> guided steps ---- */
/* v24: no help in battle. A wrong answer or a time-out only says "try again"; the hint ladder, Hoot's
   help panel and the "More help" button are gone (lessons and practice still teach step by step). */
function setTier() { B.msg = null; renderAnswers(); renderHint(); if (B.hintSpeech[0]) announce(B.hintSpeech[0][0]); }
function renderHint() {
  const q = B.q, fb = $('#qFb'); if (!q || !fb) return;
  let plain = '', html = '';
  if (B.msg) { plain = B.msg.plain; html = B.msg.html; }
  else if (B.wrong || B.lead) { plain = B.lead || t('fb.wrong'); html = esc(plain); }
  fb.innerHTML = html; fb.hidden = !html; fb.classList.toggle('bad', !B.msg && !!html); B.hintSpeech = plain ? [[plain]] : [];
  if (html && !B.msg && !S.sensory) { replayClass(fb, 'shake'); }
}
function setMsg(plain, html) { B.msg = { plain, html: html || esc(plain) }; renderHint(); announce(plain); }

/* ---- pacing: a gentle thinking timer that only ever offers help ---- */
function resetThink() {
  /* v27: on a zone boss (levels 10, 20 ... 100) the clock keeps running from one question to the next; it only fills up again when it runs out */
  const p = effPace(), lv = B.lv, keep = !!(lv && lv.big && B.keepT === B.token && B.tmax && B.tleft > 0);
  const tmax = Math.round((PACE_MS[p] || 0) * (1 + perk('time') + timeBonus()) * ((lv && lv.timeMul) || 1) * (B.q && B.q.timeMul ? B.q.timeMul : B.q && B.q.kind === 'trace' ? 2.5 : B.q && (B.q.kind === 'order' || B.q.kind === 'match') ? 1.8 : 1));
  B.tleft = keep ? Math.min(B.tleft, tmax) : tmax; B.tmax = tmax; B.keepT = B.token; B.nudges = 0;
  $('#think').hidden = !B.tmax; updateThink();
}
function updateThink() { const i = $('#think i'); if (i) i.style.width = B.tmax ? Math.max(0, B.tleft / B.tmax * 100) + '%' : '0%'; }
function thinkTick() { return HOOK.call('thinkTick', thinkTickBase, arguments); }   // v31: extensions register with HOOK (00c)
function thinkTickBase() {
  if (!B.tmax || !B.q || B.locked || UI.tab !== 'adventure' || UI.adv !== 'battle' || document.hidden || timeUp || bedUp || $('.overlay.on') || (B.introUntil || 0) > Date.now()) return;
  B.tleft -= 250;
  if (B.tleft <= 0) {   // time limit reached: the enemy attacks, Hoot offers the next hint, and a new countdown starts
    B.lead = t('fb.time'); B.tleft = B.tmax; B.timeouts = (B.timeouts || 0) + 1;   // v22: misses the ⚡ speed star
    setTier(B.tier + 1); enemyStrike();
  }
  updateThink();
}

/* ---- answer styles (UDL): tap, scratchpad drawing, voice (v21: real speech recognition, see 11b) ---- */
function renderExpr() {
  if (writeOn(B.q)) { $('#answers').hidden = true; writeMount(); return; }   // v34: write the answer (39)
  const own = B.q && (['trace', 'order', 'match'].includes(B.q.kind) || B.q.mount);   // these answer on their own pad
  const e = $('#expr'); $('#answers').hidden = voiceOn(B.q) && !own;
  if (own) { e.innerHTML = ''; return; }
  if (S.expr === 'draw') { e.innerHTML = `<div class="pad"><canvas id="padCv" aria-label="${esc(t('pad.note'))}"></canvas><div class="pad-tools">${['pen', 'eraser'].map(k => `<button class="chip" data-act="padTool" data-v="${k}" aria-pressed="${B.tool === k}">${t('pad.' + k)}</button>`).join('')}<button class="chip" data-act="padUndo">${t('pad.undo')}</button><button class="chip" data-act="padClear">${t('pad.clear')}</button></div><small class="pad-note">${t('pad.note')}</small></div>`; mountPad(); }
  else if (voiceOn(B.q)) e.innerHTML = voicePanelHTML();
  else e.innerHTML = tapNoteHTML(B.q);
}
function mountPad() {
  const cv = $('#padCv'); if (!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d'); if (!ctx) return;
  const dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect(), W = Math.max(280, r.width || 300), H = 190;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px';
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#3B2A4F';
  function paint() {
    ctx.clearRect(0, 0, cv.width, cv.height); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    B.strokes.forEach(s => {
      ctx.globalCompositeOperation = s.tool === 'eraser' ? 'destination-out' : 'source-over'; ctx.strokeStyle = ink; ctx.lineWidth = (s.tool === 'eraser' ? 30 : 4) * dpr;
      ctx.beginPath(); s.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); if (s.pts.length === 1) ctx.lineTo(s.pts[0][0] + .1, s.pts[0][1]); ctx.stroke();
    });
  }
  cv.__paint = paint; paint();
  let cur = null; const pt = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) * (cv.width / (b.width || cv.width)), (e.clientY - b.top) * (cv.height / (b.height || cv.height))]; };
  cv.addEventListener('pointerdown', e => { cur = { tool: B.tool, pts: [pt(e)] }; B.strokes.push(cur); try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } paint(); });
  cv.addEventListener('pointermove', e => { if (!cur) return; cur.pts.push(pt(e)); paint(); });
  const end = () => { cur = null; }; cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
}

/* ---- answering and the choreographed fight ---- */
const hs = () => $('#heroSprite'), ms = () => $('#monSprite');
function pose() { return HOOK.call('pose', poseBase, arguments); }   // v34: the victory pose can be chosen (41)
function poseBase(el, name, ms = 700) { if (S.sensory || !el) return; el.classList.add('pose-' + name); setTimeout(() => el.classList.remove('pose-' + name), ms); }
function onPick(i) {
  const q = B.q; if (B.locked || !q || B.picked.has(i)) return;
  if (B.fog && B.fog.has(i)) { B.fog.delete(i); sfx.fog(); renderAnswers(); return; }
  if (q.kind === 'phonics') {
    if (q.used.has(i)) return;
    if (q.options[i] === q.parts[q.pos]) {
      q.used.add(i); q.pos++; B.picked = new Set(); sfx.soft();
      if (q.pos === q.parts.length) { B.locked = true; showWord(0); renderQViz(); renderAnswers(); renderExpr(); speak(q.word, 'en-US'); onCorrect(); }
      else { renderQViz(); renderAnswers(); renderExpr(); setMsg(t('b.blend')); }
    } else wrongPick(i);
    return;
  }
  if (i === q.correct) { B.locked = true; B.rightIdx = i; if (q.word) showWord(0); renderAnswers(); onCorrect(); } else wrongPick(i);
}
function wrongPick() { return HOOK.call('wrongPick', wrongPickBase, arguments); }   // v31: extensions register with HOOK (00c)
function wrongPickBase(i) {
  HOOK.emit('answer:wrong', B.q, i);   // v31: mistake review (27) and vibration (26) listen
  B.picked.add(i); B.wrong++; B.lead = t('fb.wrong'); sfx.soft(); B.combo = 0; B.charge = 0; updateHud();
  if (bossOn() && B.phase === 2 && !B.runeBroken) { if (B.rune < 2) toast(t('boss.reset')); B.rune = 2; updateRuneText(); }
  if (!(B.lv && B.lv.big)) B.tleft = B.tmax;   // v27: the zone boss clock keeps running
  setTier(B.wrong); renderAnswers(); if (voiceOn(B.q)) { B.vState = 'idle'; renderExpr(); }
  const nb = $(`#answers .ans[data-v="${i}"]`); if (nb && !S.sensory) nb.classList.add('nope');

  enemyStrike();
}
function useMy(w) {
  const q = B.q; if (!q || B.locked) return; const v = w.value();
  const idx = q.options.findIndex(o => String(o) === String(v));
  if (idx < 0) { toast(t('mp.nomatch', { n: v })); return; }
  onPick(idx);
}
function attackSeq() { return HOOK.call('attackSeq', attackSeqBase, arguments); }   // v31: extensions register with HOOK (00c)
async function attackSeqBase(dmg, crit, blocked, shattered) {
  const tk = B.token, h = hs(), m = ms(), ph = fx.pos(h), pm = fx.pos(m), dx = Math.max(50, pm.x - ph.x - ph.w * .45);
  if (crit && !S.sensory) {   // super attack: the hero powers up first
    h.classList.add('charging'); sfx.superUp(); fx.ring(ph.x, ph.y, '#FFD166', 120); fx.num(ph.x, ph.y - ph.h * .7, t('b.super'), 'combo');
    await wait(560); h.classList.remove('charging'); if (B.token !== tk) return false;
  }
  sfx.whoosh(); pose(h, 'attack', 700); if (!S.sensory) { h.classList.add('dash'); setTimeout(() => h.classList.remove('dash'), 560); }
  const run = S.sensory ? null : h.animate([{ transform: 'translate(0,0) scale(1,1)' }, { transform: 'translate(-14px,4px) scale(.92,1.08)', offset: .18 }, { transform: `translate(${dx}px,-22px) scale(1.1,.92)`, offset: .5 }, { transform: `translate(${dx}px,0) scale(1,1)`, offset: .6 }, { transform: 'translate(0,-10px) scale(1,1)', offset: .85 }, { transform: 'translate(0,0) scale(1.04,.96)', offset: .94 }, { transform: 'translate(0,0) scale(1,1)' }], { duration: 800, easing: 'cubic-bezier(.35,.05,.25,1)' });
  await wait(S.sensory ? 250 : 400); if (B.token !== tk) return false;
  const ix = pm.x - pm.w * .15, iy = pm.y - pm.h * .1;
  fx.slash(ix, iy, crit ? '#FFD166' : '#fff', crit); if (crit) setTimeout(() => fx.slash(ix + 10, iy + 6, '#FF8FB1', true), 90);
  fx.burst(ix, iy, crit ? 20 : 10, crit ? ['⭐', '✨', '💥', '🌟'] : ['✨', '⭐']); fx.flash(crit ? 'rgba(255,230,120,.7)' : 'rgba(255,255,255,.5)'); fx.shake($('#stage'), crit ? 12 : 6);
  const st = $('#stage'); if (!S.sensory) { st.classList.add('hitstop'); await wait(crit ? 130 : 80); st.classList.remove('hitstop'); }
  sfx.hit(); if (crit) sfx.crit();
  pose(m, 'hurt', 600); flashSprite(m);
  if (!S.sensory) m.animate([{ transform: 'translate(0,0) scale(1,1)' }, { transform: `translate(${crit ? 48 : 34}px,-8px) scale(.86,1.14) rotate(6deg)`, offset: .22 }, { transform: 'translate(-10px,2px) scale(1.1,.9)', offset: .5 }, { transform: 'translate(3px,0) scale(.98,1.02)', offset: .75 }, { transform: 'translate(0,0) scale(1,1)' }], { duration: 600, easing: 'ease-out' });
  if (blocked) { sfx.block(); fx.ring(pm.x, pm.y, '#8fd6ff', 140); fx.num(pm.x, pm.y - pm.h * .4, '🛡️ ' + t('boss.blocked'), 'safe'); announce(t('sr.blocked', { m: monName() })); }
  else { B.mHp = Math.max(0, B.mHp - dmg); fx.num(pm.x, pm.y - pm.h * .4, '-' + dmg, crit ? 'crit' : ''); announce(t(crit ? 'sr.crit' : 'sr.hit', { d: dmg, m: monName(), h: B.mHp, x: B.mMax })); }
  if (shattered) { announce(t('boss.shatter')); sfx.shatter(); fx.burst(pm.x, pm.y, 24, ['✨', '💎', '🔷']); fx.num(pm.x, pm.y - pm.h * .75, t('boss.shatter'), 'combo'); ms().classList.remove('shielded'); }
  updateRuneText(); updateHud();
  if (run) await run.finished.catch(() => { });
  if (!S.sensory) fx.dust(ph.x, ph.y + ph.h * .44);
  return B.token === tk;
}
function counterSeq() { return HOOK.call('counterSeq', counterSeqBase, arguments); }   // v31: extensions register with HOOK (00c)
async function counterSeqBase() {
  const tk = B.token, h = hs(), m = ms(), ph = fx.pos(h), pm = fx.pos(m), dx = -Math.max(50, pm.x - ph.x - pm.w * .45), enr = bossOn() && B.enraged;
  const ranged = !S.sensory && Math.random() < .45;
  if (!S.sensory) { m.classList.add('windup'); sfx.growl(); fx.num(pm.x, pm.y - pm.h * .62, '❗', 'warn'); m.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14,.86) rotate(-5deg)', offset: .35 }, { transform: 'scale(.92,1.12) rotate(5deg)', offset: .7 }, { transform: 'scale(1)' }], { duration: 480, easing: 'ease-in-out' }); }
  await wait(S.sensory ? 150 : 500); m.classList.remove('windup'); if (B.token !== tk) return false;
  let run = null;
  if (ranged) { pose(m, 'taunt', 500); sfx.spit(); await monShot(pm, ph); }
  else {
    run = S.sensory ? null : m.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${dx * .4}px,-24px) scale(1.06,.94)`, offset: .4 }, { transform: `translate(${dx}px,0) scale(1.12,.88)`, offset: .55 }, { transform: 'translate(0,0) scale(1)' }], { duration: 640, easing: 'cubic-bezier(.35,.05,.25,1)' });
    await wait(S.sensory ? 150 : 340);
  }
  if (B.token !== tk) return false;
  const guard = Math.min(.4, guardPct() * BAL.guard + petGuard() + guardBonus()), dmg = Math.max(1, Math.round(B.lv.chip * BAL.hit * (1 - guard) * (enr ? 2 : 1) * (B.hitMul || 1)));   // v27: hero perks, relics, charged and rage attacks
  B.hHp = Math.max(0, B.hHp - dmg); pose(h, 'hurt', 600); flashSprite(h); sfx.hurt();
  if (enr) { fx.num(ph.x + ph.w * .5, ph.y - ph.h * .85, t('boss.enrageHit'), 'crit'); fx.shake($('#stage'), 12); }
  fx.shake(h, 7); fx.burst(ph.x, ph.y, 6, ['💫', '💥']); fx.num(ph.x, ph.y - ph.h * .5, '-' + dmg, ''); announce(t('sr.hurt', { d: dmg, m: monName(), h: B.hHp, x: B.hMax }));
  if (guard > .05 && !S.sensory) { fx.ring(ph.x - ph.w * .25, ph.y, '#9fe8ff', 90); }
  updateHud(); if (run) await run.finished.catch(() => { }); if (B.token !== tk) return false;
  if (B.hHp <= 0) return heroKO();
  return true;
}
/* the enemy only attacks when the player misses: a wrong answer, or the time limit running out */
function enemyStrike() { return HOOK.call('enemyStrike', enemyStrikeBase, arguments); }   // v35: a tower perk can forgive a mistake (45)
async function enemyStrikeBase() {
  const q = B.q, tk = B.token; if (!q || B.locked) return;
  B.locked = true;
  const ok = await counterSeq();
  if (!ok || B.token !== tk || B.q !== q) return;
  B.locked = false;
}
function onCorrect() { return HOOK.call('onCorrect', onCorrectBase, arguments); }   // v31: extensions register with HOOK (00c)
async function onCorrectBase() {
  const q = B.q, tk = B.token;
  HOOK.emit('answer:right', q);
  await preCorrect(q, tk); if (B.token !== tk || B.q !== q) return;   // v27: dodging a charged attack, the "why?" step
  B.asked++; if (B.wrong === 0) B.first++;
  B.tUsed = (B.tUsed || 0) + (Date.now() - (B.qStart || Date.now())); B.tAllow = (B.tAllow || 0) + (B.tmax || 20000) * .6 + B.wrong * 1800 + 900;   // v22 speed star
  recordTopic(q.topic, B.wrong === 0); recordQ(q, B.wrong); sess.solved++;
  S.recent.push(B.wrong === 0 ? 1 : 0); S.recent = S.recent.slice(-10);
  B.combo++; if (B.wrong === 0) { B.charge = Math.min(3, (B.charge || 0) + 1); const c = B.charge; setTimeout(() => sfx.charge(c), 200); }
  addCoins(2 + perk('coin')); sfx.ok(); updateHud();
  const heal = perk('heal') + healBonus(); if (heal && B.hHp < B.hMax) { B.hHp = Math.min(B.hMax, B.hHp + heal); updateHud(); }
  if (await minionHit(tk)) return;   // v27: while minions stand guard, each right answer knocks one out
  const fin = B.combo > 0 && B.combo % FIN_EVERY === 0;   // v22: five in a row fires the finisher
  const crit = !fin && (B.charge || 0) >= 3, dmg = Math.round((fin ? Math.round((atk() + perk('atk')) * 1.9) + 6 : atk() + perk('atk') + Math.min(B.combo - 1, 3) * 2 + (crit ? Math.round(atk() * .4) : 0)) * dmgBoost());   // v27: dodge and "why?" bonuses   // v8: smaller combo bonus; the super attack needs 3 first-try answers in a row
  let blocked = false, shattered = false;
  if (bossOn() && B.phase === 2 && !B.runeBroken) {
    if (B.wrong === 0) { B.rune--; if (B.rune <= 0) { B.runeBroken = true; shattered = true; } else blocked = true; } else blocked = true;
    updateRuneText();
  }
  B.tier = 0;
  if (blocked) setMsg(t('boss.holds')); else setMsg((q.why ? q.why + ' ' : '') + t('b.yes', { d: dmg }), `${q.why ? esc(q.why) + ' ' : ''}<b>${esc(t('b.yes', { d: dmg }))}</b>`);
  const ok = fin && !blocked ? await finisherSeq(dmg) : await attackSeq(blocked ? 0 : dmg, crit && !blocked, blocked, shattered); save(); if (!ok || B.token !== tk) return;
  if (fin && !blocked) { B.fins = (B.fins || 0) + 1; if (shattered) { ms().classList.remove('shielded'); updateRuneText(); } }
  if (crit && !blocked) { B.charge = 0; updateHud(); }
  await wait(S.sensory ? 180 : 180); if (B.token !== tk) return;
  if (B.mHp <= 0) return win();
  await wait(120); if (B.token === tk) nextQuestion();
}
function leaveBattle() { return HOOK.call('leaveBattle', leaveBattleBase, arguments); }   // v31: extensions register with HOOK (00c)
function leaveBattleBase() { const vi = $('#vsIntro'); if (vi) vi.hidden = true; B.introUntil = 0; B.token++; B.q = null; B.active = false; wxStop(); cleanBossFx(); lockUI(); $('#leaveOverlay').classList.remove('on'); setAdvView('map'); syncMusic(); }
