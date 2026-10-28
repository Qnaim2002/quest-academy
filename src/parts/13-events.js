/* ================= Events ================= */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  if (b.dataset.suppress) return;                       // a drag just ended on this block
  if (UI.tab === 'parent') gate.t = Date.now();
  const a = b.dataset.act, v = b.dataset.v, host = b.closest('.mp-host'), w = host && host.__mp;
  if (a !== 'pick' && a !== 'vpick' && a !== 'sfx') sfx.tap();
  if (famEvent(a, v)) return;   // v21: children, subjects, bedtime, listening, graphics (12b)
  if (lessonEvent(a, v) || dexEvent(a, v)) return;   // v22: lesson practice and quiz, lesson of the week
  switch (a) {
    case 'tab': showTab(v); break;
    case 'langCycle': setLang(LANG_ORDER[(LANG_ORDER.indexOf(S.lang) + 1) % LANG_ORDER.length]); break;
    case 'lang': setLang(v); break;
    case 'say': speak(b.dataset.say); break;
    case 'sayQ': if (B.q) speakSeq(B.q.speak); break;
    case 'sayHint': speakSeq(B.hintSpeech); break;
    case 'sayWord': if (B.q && B.q.word) speak(B.q.word, 'en-US'); break;
    case 'peek': if (B.q) showWord(3000); break;
    case 'preview': { const it = ITEM[v]; if (!it) break; const pv = UI.pv || (UI.pv = {}); if (pv[it.slot] === v || (!pv[it.slot] && S.equipped[it.slot] === v)) delete pv[it.slot]; else if (S.equipped[it.slot] === v) delete pv[it.slot]; else pv[it.slot] = v; sfx.soft(); renderArmory(); heroPose($('#tab-armory .preview'), 'cheer', 900); break; }
    case 'pvReset': UI.pv = {}; renderArmory(); break;
    case 'pvBuy': { const its = Object.values(UI.pv || {}).map(id => ITEM[id]).filter(i => i && !S.owned.includes(i.id)); const cost = its.reduce((a, i) => a + i.cost, 0); if (S.coins >= cost) { S.coins -= cost; $('#coinVal').textContent = S.coins; its.forEach(i => { S.owned.push(i.id); logEvent('lg.bought', { name: itemName(i) }); }); Object.values(UI.pv).forEach(id => { S.equipped[ITEM[id].slot] = id; }); UI.pv = {}; save(); sfx.ok(); armKeep(renderArmory); heroPose($('#tab-armory .preview'), 'cheer', 1200); } break; }
    case 'pvWear': Object.values(UI.pv || {}).forEach(id => { if (S.owned.includes(id)) S.equipped[ITEM[id].slot] = id; }); UI.pv = {}; save(); renderArmory(); break;
    case 'pose': heroPose(b, 'cheer', 1300); break;
    /* manipulatives */
    case 'mpSlot': w && w.slot(+b.dataset.t, +b.dataset.s); break;
    case 'mpStamp': w && w.add(b.dataset.k === 'u' ? null : b.dataset.k); break;
    case 'mpTen': w && w.del(b.dataset.k); break;
    case 'mpUndo': w && w.undo(); break;
    case 'mpReset': w && w.reset(); break;
    case 'mpUse': w && useMy(w); break;
    case 'mpCut': w && w.cut(+v); break;
    case 'mpPiece': w && w.piece(+b.dataset.i); break;
    case 'fade': UI.fade = +v; renderStudies(); break;
    /* studies */
    case 'subject': if (!subjOpen(v)) { toast(t('sj.off')); break; } UI.subject = v; UI.list = v; UI.open = null; renderStudies(); break;
    case 'closeList': UI.list = null; UI.open = null; renderStudies(); break;
    case 'open': UI.open = v; UI.lc = 0; UI.fade = 0; UI.lit = new Set(); UI.blended = false; UI.react = -1; $('#lessonSheet').scrollTop = 0; renderStudies(); break;
    case 'traceOpen': UI.trace = UI.trace || 'A'; UI.traceSet = /\d/.test(UI.trace) ? '123' : /^[a-z]$/.test(UI.trace) ? 'abc' : 'ABC'; renderTracePractice(); break;
    case 'traceSet': UI.traceSet = v; UI.trace = traceChars(v)[0]; renderTracePractice(); break;
    case 'traceGlyph': UI.trace = v; renderTracePractice(); break;
    case 'traceNext': { const cs = traceChars(UI.traceSet); UI.trace = cs[(cs.indexOf(UI.trace) + 1) % cs.length]; renderTracePractice(); break; }
    case 'traceClose': closeLessonSheet(); break;
    case 'closeLesson': closeLessonSheet(); break;   // v25: closes a lesson, practice, quiz or tracing sheet
    case 'sage': UI.sage = +v; renderStudies(); break;
    case 'blendTile': UI.lit.add(+v); UI.blended = false; renderStudies(); break;
    case 'blend': UI.blended = true; speak(BLEND_WORDS[UI.blendIdx % BLEND_WORDS.length][0], 'en-US'); renderStudies(); break;
    case 'blendNext': UI.blendIdx++; UI.lit = new Set(); UI.blended = false; renderStudies(); break;
    case 'react': UI.react = +v; renderStudies(); speak(t('rx.cause', { c: tr(REACTIONS[+v], 'label'), e: tr(REACTIONS[+v], 't') })); break;
    /* armory */
    case 'slot': armSwitchSlot(v); break;
    case 'finPv': { const h = $('#finPv'); if (h) { h.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); finPreview(v, h); } break; }
    case 'buy': { const it = ITEM[v]; if (S.coins >= it.cost && !S.owned.includes(v)) { S.coins -= it.cost; $('#coinVal').textContent = S.coins; S.owned.push(v); S.equipped[it.slot] = v; if (UI.pv) delete UI.pv[it.slot]; logEvent('lg.bought', { name: itemName(it) }); save(); sfx.ok(); renderArmory(); heroPose($('#tab-armory .preview'), 'cheer', 1200); } break; }
    case 'equip': S.equipped[ITEM[v].slot] = v; if (UI.pv) delete UI.pv[ITEM[v].slot]; save(); armKeep(renderArmory); break;
    /* map, briefing, battle */
    case 'level': { const l = getLevel(v); if (!isUnlocked(l)) { toast(t('map.locked', { id: l.n - 1 })); break; } const go = () => { $('#winOverlay').classList.remove('on'); setAdvView('map'); gotoLevel(v); }; if ($('#winOverlay').classList.contains('on')) pxWipe(go); else go(); break; }
    case 'nextLevel': $('#winOverlay').classList.remove('on'); setAdvView('map'); gotoLevel(v, true); break;   // straight into the next battle, no level modal
    case 'closeBrief': $('#briefOverlay').classList.remove('on'); break;
    case 'briefArmory': $('#briefOverlay').classList.remove('on'); showTab('armory'); break;
    case 'equipRec': S.equipped[ITEM[v].slot] = v; save(); openBrief(UI.brief); break;
    case 'engage': pxWipe(() => { $('#briefOverlay').classList.remove('on'); enterBattle(v); }); break;
    case 'retreat': $('#leaveOverlay').classList.add('on'); break;
    case 'stay': $('#leaveOverlay').classList.remove('on'); break;
    case 'leave': pxWipe(() => leaveBattle()); break;
    case 'toMap': pxWipe(() => { $('#winOverlay').classList.remove('on'); setAdvView('map'); }); break;
    case 'retry': $('#winOverlay').classList.remove('on'); startBattle(v); break;
    case 'music': S.music = S.music === false; save(); syncMusic(); toast(t(musicOn() ? 'mus.on' : 'mus.off')); if (UI.tab === 'parent' && gate.unlocked) renderParent(); break;
    case 'toArmory': $('#winOverlay').classList.remove('on'); showTab('armory'); break;
    case 'pick': onPick(+v); break;
    case 'padTool': B.tool = v; $$('.pad-tools [data-act="padTool"]').forEach(x => x.setAttribute('aria-pressed', x.dataset.v === v)); break;
    case 'padUndo': B.strokes.pop(); { const cv = $('#padCv'); cv && cv.__paint && cv.__paint(); } break;
    case 'padClear': B.strokes = []; { const cv = $('#padCv'); cv && cv.__paint && cv.__paint(); } break;
    case 'mic': micListen(); break;
    case 'vpick': B.vState = 'idle'; onPick(+v); renderExpr(); break;
    /* welcome */
    case 'wlLang': setLang(v); break;
    case 'wlBand': S.band = +v; applyTheme(); renderWelcome(); break;
    case 'wlGo': { const nm = $('#wlName'); if (nm && nm.value.trim()) { curProfile().name = cleanName(nm.value); saveDev(); syncWhoBtn(); } }   // v22: the hero's name is used in the stories
      S.welcomed = true; save(); $('#welcomeOverlay').classList.remove('on'); showTab('studies', true); break;
    /* parent code + settings */
    case 'key': pinDigit(v); break;
    case 'pinForgot': if (DEV.rec) { gate.mode = 'recover'; gate.msg = ''; gate.forgot = false; renderGate(); } else if (gate.forgot) { eraseAll(true); } else { gate.forgot = true; renderGate(); } break;   // v31: the recovery question comes first
    case 'pinCancel': { const rs = gate.mode === 'reset1' || gate.mode === 'reset2'; gate.mode = 'enter'; gate.buf = ''; gate.first = ''; gate.unlocked = !rs; renderParent(); break; }
    case 'pinBack': showTab('studies', true); break;
    case 'pinChange': gate.unlocked = false; gate.mode = 'change1'; gate.buf = ''; gate.first = ''; gate.msg = ''; renderGate(); break;
    case 'band': S.band = +v; applyTheme(); save(); renderParent(); if (B.q && !B.locked) nextQuestion(); break;
    case 'theme': S.theme = v; applyTheme(); save(); renderParent(); break;
    case 'pixel': S.pixel = !S.pixel; applyTheme(); save(); renderParent(); repaintSprites(); break;
    case 'sensory': S.sensory = !S.sensory; applyTheme(); save(); renderParent(); updateTimer(); if (B.q) resetThink(); syncMusic(); break;
    case 'dys': S.dys = !S.dys; applyTheme(); save(); renderParent(); break;
    case 'fs': S.fs = +v; applyTheme(); save(); renderParent(); break;
    case 'vauto': S.voice.auto = !S.voice.auto; save(); renderParent(); if (S.voice.auto) speak(t('pp.autoOn')); break;
    case 'sfx': S.sfx = !S.sfx; save(); renderParent(); sfx.ok(); break;
    case 'vrate': S.voice.rate = +v; save(); renderParent(); speak(t('pp.testSay')); break;
    case 'testVoice': speak(t('pp.testSay')); break;
    case 'pace': S.pace = v; save(); renderParent(); if (B.q) resetThink(); break;
    case 'timer': S.timerMin = +v; S.timerWe = null; S.session.extra = 0; warned = false; save(); renderParent(); checkTimer(); break;
    case 'showTimer': S.showTimer = !S.showTimer; save(); renderParent(); break;
    case 'addTime': S.session.extra += (+v) * 60000; save(); checkTimer(); toast(t('tt.added', { n: v })); break;
    case 'restartClock': S.session = { day: todayKey(), elapsed: 0, extra: 0 }; sess.solved = sess.coins = sess.stars = 0; warned = false; save(); checkTimer(); toast(t('tt.restart')); break;
    case 'timeParent': showTab('parent', true); break;
    case 'sample': UI.sample = !UI.sample; renderParent(); break;
    case 'export': exportData(); break;
    case 'import': { const f = $('#impFile'); f && f.click(); break; }
    case 'erase': if (UI.eraseArmed) eraseAll(); else { UI.eraseArmed = true; renderParent(); setTimeout(() => { UI.eraseArmed = false; if (UI.tab === 'parent' && gate.unlocked) renderParent(); }, 4000); } break;
    case 'subj': { if (!subjOpen(v)) { toast(t('sj.off')); break; } UI.subj = v; UI.screen = 'levels'; setAdvView('map'); pxEnter($('#mapView .wrap')); const nx = nextLevelN(v), z0 = nx ? Math.floor((nx - 1) / 10) : 9; if (!(S.comics || {})[comicKey(v, z0)]) openComic(z0, null, v); break; }
    case 'subjBack': UI.screen = 'subjects'; setAdvView('map'); pxEnter($('#mapView .wrap'), 'back'); break;
    case 'diff': S.band = +v; applyTheme(); save(); renderMap(); break;
    case 'bossStory': openComic(+v, null, UI.subj, 'boss'); break;
    case 'victStory': openComic(+v, null, UI.subj, 'victory'); break;
    case 'zone': { const z = +v, sj = UI.subj; if (!zoneUnlocked(sj, z)) { toast(t('map.zoneLocked', { z: zoneName(z - 1) })); fx.shake(b, 6, 300); break; } const opening = UI.zoneOpen[sj] !== z; if (opening && !(S.comics || {})[comicKey(sj, z)]) { openComic(z, null, sj); break; } UI.zoneOpen[sj] = opening ? z : -1; renderMap(); syncMusic(); if (opening) zoneSting(z); break; }
    case 'style': S.expr = v; save(); reopenBrief(); break;
    case 'repPick': S.repPick = v; save(); reopenBrief(); break;
    case 'openAll': S.openAll = !S.openAll; save(); renderParent(); break;
    case 'vstyle': S.voice.style = v; save(); renderParent(); speak(t('pp.testSay')); break;
    case 'armView': UI.arm = v; UI.hvSel = null; renderArmory(); break;
    case 'hvTab': armKeep(() => { UI.hvTab = v; renderHaven(); }); break;
    case 'hvGear': UI.arm = 'gear'; UI.slot = 'pet'; renderArmory(); break;
    case 'hvPet': hvPetTap(v); break;
    case 'hvBuyPet': { const it = ITEM[v]; if (it && it.slot === 'pet' && S.coins >= it.cost && !S.owned.includes(v)) { S.coins -= it.cost; $('#coinVal').textContent = S.coins; S.owned.push(v); if (!petOn()) S.equipped.pet = v; logEvent('lg.bought', { name: itemName(it) }); save(); sfx.ok(); renderHaven(); toast(t('hv.petBought', { p: itemName(it) })); } break; }
    case 'hvEquip': S.equipped.pet = v; save(); renderHaven(); toast(t('hv.hi', { p: petName(v) })); break;
    case 'hvBuy': { const f = FURNI[v]; if (f && S.coins >= f.cost && !hv().furn.includes(v)) { S.coins -= f.cost; $('#coinVal').textContent = S.coins; hv().furn.push(v); hvPlaceItem(v); logEvent('lg.bought', { name: fname(f) }); save(); sfx.ok(); toast(t('hv.bought', { n: fname(f) })); renderHaven(); } break; }
    case 'hvPlace': hvPlaceItem(v); save(); renderHaven(); break;
    case 'hvAway': { const h = hv(); h.placed = h.placed.filter(p => p.id !== v); UI.hvSel = null; save(); renderHaven(); break; }
    case 'hvAwaySel': { const h = hv(); if (UI.hvSel != null) h.placed.splice(UI.hvSel, 1); UI.hvSel = null; save(); renderHaven(); break; }
    case 'hvSize': { const pl = hv().placed[UI.hvSel]; if (pl) { pl.s = Math.max(.6, Math.min(2, (pl.s || 1) + (+v) * .2)); save(); renderHaven(); } break; }
    case 'hvDone': UI.hvSel = null; renderHaven(); break;
    case 'hvTheme': { const x = THEMEI[v], h = hv(); if (!x) break; if (!h.themes.includes(v)) { if (S.coins < x.cost) break; S.coins -= x.cost; $('#coinVal').textContent = S.coins; h.themes.push(v); sfx.ok(); } h.theme = v; save(); renderHaven(); break; }
    case 'evoClose': $('#evoOverlay').classList.remove('on'); break;
    case 'lessonDone': { if (!S.learned[v]) { S.learned[v] = true; const evo = addPetXP(10); logEvent('lg.learned', { name: tr(MODULES.find(m => m.id === v), 'title') }); save(); if (petOn()) toast(t('pet.gain', { p: petName(petOn()), n: 10 })); UI.open = null; renderStudies(); if (evo) showEvolve(petOn(), evo); } else { UI.open = null; renderStudies(); } break; }
    case 'comic': openComic(+v, null, UI.subj); break;
    case 'comicNext': comicAdvance(); break;
    case 'comicBack': comicBack(); break;
    case 'comicTap': { const r = b.getBoundingClientRect(); if (e.clientX - r.left < r.width * .28) comicBack(); else comicAdvance(); break; }
    /* v11 lesson cards */
    case 'lcard': UI.lc = +v; renderStudies(); break;
    case 'lcPrev': UI.lc = Math.max(0, (UI.lc || 0) - 1); renderStudies(); break;
    case 'lcNext': { const n = +b.dataset.n; if ((UI.lc || 0) >= n - 1) { const d = $('#lessonSheet [data-act="lessonDone"], #lessonSheet .ldone'); if (d) d.scrollIntoView({ behavior: S.sensory ? 'auto' : 'smooth', block: 'center' }); } else { UI.lc = (UI.lc || 0) + 1; renderStudies(); } break; }
    case 'comicPause': comicTogglePause(); break;
    case 'fullscreen': toggleFullscreen(); break;
    case 'comicSay': if (UI.comic) comicSpeak(UI.comic, +v); break;
    case 'comicEnter': case 'comicSkip': closeComic(true); break;
    case 'lock': gate.unlocked = false; gate.mode = 'enter'; showTab('studies', true); break;
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'voiceSel') { S.voice.name = e.target.value; save(); speak(t('pp.testSay')); return; }
  if (e.target.id === 'impFile' && e.target.files[0]) { const r = new FileReader(); r.onload = () => importData(String(r.result)); r.readAsText(e.target.files[0]); }
});
document.addEventListener('keydown', e => {
  if (UI.comic && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.key === 'ArrowLeft' ? comicBack() : comicAdvance(); return; }
  if (UI.open && !UI.comic && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !/INPUT|SELECT|TEXTAREA/.test((e.target.tagName || ''))) { const n = $$('#lessonSheet .lstep').length; if (n) { UI.lc = Math.max(0, Math.min(n - 1, (UI.lc || 0) + (e.key === 'ArrowLeft' ? -1 : 1))); renderStudies(); } return; }
  if (e.key === 'Escape') { if (UI.comic) closeComic(true); if (UI.open || UI.trace || UI.prac) closeLessonSheet(); else if (UI.list) { UI.list = null; renderStudies(); } $('#briefOverlay').classList.remove('on'); $('#leaveOverlay').classList.remove('on'); return; }
  if (UI.tab !== 'parent' || gate.unlocked) return;
  if (/^[0-9]$/.test(e.key)) pinDigit(e.key); else if (e.key === 'Backspace') pinDigit('back');
});
$('#lessonListOverlay').addEventListener('click', e => { if (e.target.id === 'lessonListOverlay') { UI.list = null; renderStudies(); } });
$('#lessonOverlay').addEventListener('click', e => { if (e.target.id === 'lessonOverlay') { UI.open = null; renderStudies(); } });
$('#briefOverlay').addEventListener('click', e => { if (e.target.id === 'briefOverlay') e.target.classList.remove('on'); });
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
window.addEventListener('pagehide', save);

/* ================= v5: Life Skills challenge ================= */
function lifeQ(band, topics) {
  let list = LIFE[band]; if (topics) { const f = list.filter(i => topics.includes(i.topic)); if (f.length) list = f; }
  const it = pick(list), a = it[S.lang] || [it.text, it.answer, it.wrongs[0], it.wrongs[1], it.hints[0], it.hints[1]];
  const x4 = borrowWrong(LIFE[band], it, [a[1], a[2], a[3]]), options = shuffle([a[1], a[2], a[3]].concat(x4 ? [x4] : []));
  return { kind: 'life', type: 'life', topic: 'life_' + it.topic, tag: t('tag.life'), text: a[0], options, correct: options.indexOf(a[1]), cls: 'txt', key: it.text, ansText: a[1], customSteps: true,
    steps: () => [t('s.life0'), a[4], a[5], t('s.ce3', { a: a[1] })], speak: [[`${a[0]} ${t('choices')}: ${options.join('. ')}.`]],
    viz: hl => `<div class="clue big ${hl ? 'glowp' : ''}" aria-hidden="true">${it.em}</div>` };
}
const RECENT = [];
/* v17: each age has its own question bank (age 7 finally gets the hardest set), and a saved memory per
   subject means a child sees EVERY question in that subject before any question comes back. */
const BANK_FOR_AGE = { 1: [1], 2: [1, 2], 3: [2, 3], 4: [3] };
function qMem(subj) { const m = S.qmem || (S.qmem = {}); return m[subj + ':' + S.band] || (m[subj + ':' + S.band] = []); }
/* sums like "What is 245 + 378?" get fresh numbers of the same size every time */
function freshSum(it, li) {
  const m = /^(What is|Berapakah) ([\d ]+?) ([+\-x×÷]) ([\d ]+?)\?$/;
  const e = it.q[0].match(m); if (!e) return null;
  const A = +e[2].replace(/ /g, ''), Bn = +e[4].replace(/ /g, ''), op = e[3], dig = n => String(n).length;
  const rnd = (d, lo = 1) => { const min = Math.max(lo, d > 1 ? 10 ** (d - 1) : 1), max = 10 ** d - 1; return min + Math.floor(Math.random() * (max - min + 1)); };
  let a = rnd(dig(A), 2), b = rnd(dig(Bn), 2), ans;
  if (op === '-') { if (b > a) [a, b] = [b, a]; if (a === b) a += 1; ans = a - b; }
  else if (op === '+') ans = a + b;
  else if (op === 'x' || op === '×') { a = rnd(Math.min(dig(A), 2), 2); b = rnd(1, 2); ans = a * b; }
  else { b = Math.max(2, rnd(1, 2)); ans = rnd(Math.min(dig(Math.round(A / Math.max(1, Bn))), 2), 2); a = ans * b; }
  const f = n => n >= 1000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n);
  const body = `${f(a)} ${op} ${f(b)}`;
  return { q: [`What is ${body}?`, `Berapakah ${body}?`][li], a: String(ans) };
}
function bankQ(subj, band, topic, only) {   // only: a set of bank rows to choose from (v23: a lesson's own questions)
  const banks = BANK_FOR_AGE[band] || [band >= 3 ? 2 : 1];
  const all = banks.flatMap(b => (BANK[subj] && BANK[subj][b]) || []), other = [1, 2, 3].flatMap(b => (BANK[subj] && BANK[subj][b]) || []);
  const li = L(), mem = qMem(subj), memS = new Set(mem), seenNow = k => (B.seen && B.seen.has(k)), usedK = k => seenNow(k) || RECENT.includes(k) || k === B.lastKey || memS.has(k);
  const base = all.length ? all : other, byTopic = only ? other.filter(i => only.has(i)) : topic ? base.filter(i => i.topic === topic) : base;
  if (!base.some(i => !memS.has(i.q[li]))) { mem.length = 0; memS.clear(); }   // everything asked once: start a fresh round
  const tiers = only && byTopic.length ? [byTopic.filter(i => !usedK(i.q[li])), byTopic.filter(i => !seenNow(i.q[li])), byTopic] : [byTopic.filter(i => !usedK(i.q[li])), base.filter(i => !usedK(i.q[li])), byTopic.filter(i => !seenNow(i.q[li])), base.filter(i => !seenNow(i.q[li])), byTopic.length ? byTopic : base];
  const list = tiers.find(a => a.length) || base, it = seenPick(list, i => i.q[li]);   // v36: never seen first, then least recently seen
  const fresh = subj === 'math' ? freshSum(it, li) : null;
  const ans = fresh ? fresh.a : it.a[li], text = fresh ? fresh.q : it.q[li];
  let wr = it.w && !fresh ? it.w[li].slice() : [];
  if (wr.length < 3) {
    const num = /^-?\d+$/.test(fresh ? ans.replace(/ /g, '') : it.a[0]), base = num ? +(fresh ? ans.replace(/ /g, '') : it.a[0]) : 0;
    if (num) [1, -1, 2, -2, 10, -10, 3].forEach(d => { const v = base + d; if (v >= 0 && !wr.includes(String(v)) && String(v) !== ans) wr.push(String(v)); });
    else shuffle(other.concat(all).filter(i => i.grp === it.grp && i.a[li] !== ans)).forEach(i => { if (!wr.includes(i.a[li]) && i.a[li] !== ans) wr.push(i.a[li]); });
  }
  const options = shuffle([ans].concat(shuffle(wr.filter(x => x !== ans)).slice(0, 3))), nm = STR['tp.' + subj + '_' + it.topic];
  return { memSubj: subj, memKey: it.q[li], memCap: base.length, row: it, kind: 'bank', type: 'life', topic: subj + '_' + it.topic, tag: nm ? nm[li] : t('subj.' + subj), text, options, correct: options.indexOf(ans), cls: 'txt', key: text, ansText: ans, customSteps: true,
    steps: () => [t('s.bank0'), t('s.bank1'), t('s.bank2'), t('s.ce3', { a: ans })], speak: [[`${text} ${t('choices')}: ${options.join('. ')}.`]],
    viz: hl => `<div class="clue big ${hl ? 'glowp' : ''}" aria-hidden="true">${it.em}</div>` };
}
function makeQ(entry, band, lv) {
  if (B.active && B.shift) band = Math.max(1, Math.min(4, band + B.shift));   // v34: a child doing well (or struggling) in battle gets the next (or earlier) age's questions
  const [a, b, c] = entry.split(':'); let q;
  /* v36: some multiple-choice questions come from the fact tables (and, with the Bilingual boost, from word lists) */
  if (a === 'bank' && B.active && lv && lv.subj === b && typeof FM !== 'undefined' && FM.mod && FM.mod.factMcq) { try { q = FM.mod.factMcq(b, band); } catch (e) { q = null; } if (q) return q; }
  if (a === 'bank') q = bankQ(b, band, c);
  else if (a === 'math') q = b === 'word' ? wordQ(band) : mathQ(band >= 4 ? 2 : 1, b);   // v34: wordQ = real-world word problems (38)
  else if (a === 'life') q = lifeQ(band, c ? [c] : null);
  else if (b === 'phonics') q = phonicsQ(band); else if (b === 'syll') q = syllQ(band); else if (b === 'spell') q = spellQ(band);
  else if (b === 'rhyme') q = rhymeQ(band); else if (b === 'missing') q = missingQ(band); else if (b === 'sort') q = sortQ(band);
  else q = ceQ(band, c ? [c] : (lv && lv.stem));
  return q;
}

/* ================= v5: a gentle voice (soft, slower, sentence by sentence) ================= */
let VOICES = [];
function loadVoices() { try { VOICES = speechSynthesis.getVoices() || []; } catch (e) { /* none */ } }
try { if ('speechSynthesis' in window) { loadVoices(); if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', loadVoices); } } catch (e) { /* none */ }
const MALEV = /(daniel|alex\b|fred|david|mark\b|george|james|rishi|thomas|\bmale\b|\bguy\b|ryan|jorge|diego|juan|pablo|carlos|arthur|oliver|reed|rocko)/i;
const SOFTV = /(samantha|karen|tessa|moira|serena|fiona|victoria|allison|\bava\b|susan|zira|jenny|aria|sonia|libby|natasha|paulina|monica|helena|laura|sabina|female|siri|zoe|joanna|salli|kendra|kimberly|emma|amy|nova|catherine|hazel|yasmin|amira|yunxi|xiaoxiao)/i;
const VSTYLE = { gentle: { pitch: 1.1, vol: .85 }, warm: { pitch: 1, vol: .9 }, bright: { pitch: 1.25, vol: .95 } };
function voicesFor(lang) { const l = lang.slice(0, 2).toLowerCase(); return VOICES.filter(v => v.lang && v.lang.toLowerCase().startsWith(l)); }
function pickVoice(lang, male) {
  const all = voicesFor(lang); if (!all.length) return null;
  const named = all.find(v => v.name === S.voice.name); if (named) return named;
  if (male) { const m = all.filter(v => MALEV.test(v.name)); if (m.length) return m.find(v => /(neural|natural|premium|enhanced)/i.test(v.name)) || m[0]; }   // v32: deep voices for villains and bosses
  const f = all.filter(v => !MALEV.test(v.name)), pool = f.length ? f : all;
  return pool.find(v => /(neural|natural|premium|enhanced)/i.test(v.name) && SOFTV.test(v.name)) || pool.find(v => SOFTV.test(v.name)) || pool.find(v => /google/i.test(v.name)) || pool[0];
}
function speakSeq(parts) {
  try {
    if (!('speechSynthesis' in window)) { toast(t('tt.novoice')); return; }
    speechSynthesis.cancel(); loadVoices(); const st = VSTYLE[S.voice.style] || VSTYLE.gentle;
    parts.forEach(([txt, lc, role]) => {
      const lang = lc || LANGS[S.lang].tts, R = voiceRole(role), v = pickVoice(lang, R.male);
      (toSpeech(txt).match(/[^.!?…]+[.!?…]*/g) || []).map(x => x.trim()).filter(Boolean).forEach(ch => {
        const u = new SpeechSynthesisUtterance(ch); u.lang = lang; if (v) u.voice = v; u.rate = Math.max(.1, Math.min(2, S.voice.rate * R.r)); u.pitch = Math.max(.1, Math.min(2, st.pitch * R.p)); u.volume = Math.min(1, st.vol * volK('voice', 100)); speechSynthesis.speak(u);
      });
    });
  } catch (e) { /* speech unavailable */ }
}
function voiceSelectHTML() {
  const list = voicesFor(LANGS[S.lang].tts);
  return `<select id="voiceSel" class="vsel" aria-label="${esc(t('pp.vname'))}"><option value="">${esc(t('pp.vauto'))}</option>${list.map(v => `<option value="${esc(v.name)}" ${S.voice.name === v.name ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select>`;
}

/* v25: the lesson sheet is shared by lessons, lesson practice and quizzes, and letter tracing. Closing it clears
   all of them, so the ✕ button and Escape always close it (before, tracing practice reopened itself). */
function closeLessonSheet() { return HOOK.call('closeLessonSheet', closeLessonSheetBase, arguments); }   // v31: extensions register with HOOK (00c)
function closeLessonSheetBase() {
  UI.open = null; UI.trace = null; UI.prac = null;
  try { speechSynthesis.cancel(); } catch (_) { /* no speech */ }
  $('#lessonOverlay').classList.remove('on'); $('#lessonSheet').innerHTML = '';
  renderStudies();
}
