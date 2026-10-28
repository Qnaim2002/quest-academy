/* ================= Welcome (first run) ================= */
function renderWelcome() {
  $('#welcomeSheet').innerHTML = `<div class="wl-hero">${heroSVG(S.equipped)}</div><h2>${curProfile().name ? esc(t('fam.hi', { n: curProfile().name })) : t('wl.title')}</h2><p class="sub">${t('wl.sub')}</p>
    <h3 class="sub-h">${t('wl.name')}</h3><input id="wlName" class="kid-name" maxlength="16" value="${esc(UI.wlName !== undefined ? UI.wlName : curProfile().name || '')}" placeholder="${esc(t('wl.namePh'))}" aria-label="${esc(t('wl.name'))}" autocomplete="off">
    <h3 class="sub-h">${t('pp.lang')}</h3><div class="seg">${LANG_ORDER.map(l => `<button class="chip" data-act="wlLang" data-v="${l}" aria-pressed="${S.lang === l}">${LANGS[l].n}</button>`).join('')}</div>
    <h3 class="sub-h">${t('wl.age')}</h3><div class="seg">${[1, 2, 3, 4].map(b => `<button class="chip" data-act="wlBand" data-v="${b}" aria-pressed="${S.band === b}">${t('band.' + b)}</button>`).join('')}</div>
    <div class="brief-actions"><button class="btn big" data-act="wlGo">${t('wl.go')}</button></div>`;
}

/* ================= Parent portal: 6-digit code ================= */
const dots = n => Array.from({ length: 6 }, (_, i) => `<i class="pd ${i < n ? 'on' : ''}"></i>`).join('');
function gateMode() { if (gate.mode === 'enter' && !DEV.pin) gate.mode = 'create1'; return gate.mode; }
function renderGate() {
  const el = $('#tab-parent'), mode = gateMode();
  if (mode === 'recover') return renderRecover();   // v31: answer the recovery question instead of erasing everything
  const title = mode === 'enter' ? t('pin.enter') : mode === 'create1' ? t('pin.create') : mode === 'change1' || mode === 'reset1' ? t('pin.new') : t('pin.confirm');
  const wait = Math.ceil((DEV.pinUntil - Date.now()) / 1000);
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-act="key" data-v="${n}" aria-label="${n}">${n}</button>`).join('') + `<button data-act="key" data-v="back" aria-label="${esc(t('pg.del'))}">⌫</button><button data-act="key" data-v="0" aria-label="0">0</button><button class="go" data-act="key" data-v="clear" aria-label="${esc(t('pad.clear'))}">C</button>`;
  const forgot = mode === 'enter' ? `<button class="btn ghost" data-act="pinForgot">${gate.forgot && !DEV.rec ? t('pin.forgot2') : t('pin.forgot')}</button>` : '';
  el.innerHTML = `<div class="wrap"><div class="gate card ${gate.shake ? 'shake' : ''}"><h1 class="title">🔒 ${t('pin.title')}</h1><p class="sub">${esc(title)}</p>
    <div class="pdots" role="img" aria-label="${esc(t('pin.dots', { n: gate.buf.length }))}">${dots(gate.buf.length)}</div>
    <p class="pmsg ${gate.msg && gate.msg === t('rc.right') ? 'ok' : ''}" aria-live="polite">${wait > 0 ? esc(t('pin.wait', { s: wait })) : esc(gate.msg || '')}</p><div class="keys">${keys}</div>
    <div class="seg" style="justify-content:center;margin-top:12px">${B.active ? `<button class="btn ghost" data-act="pinBack">${t('pin.back')}</button>` : ''}${['change1', 'change2', 'reset1', 'reset2'].includes(mode) ? `<button class="btn ghost" data-act="pinCancel">${t('pin.cancel')}</button>` : ''}${forgot}</div>
    ${gate.forgot && !DEV.rec && mode === 'enter' ? `<p class="note" style="margin-top:10px">${t('pin.forgotTxt')}</p>` : ''}<p class="sub" style="margin:12px 0 0;font-size:.78rem">${t('pin.note')}</p></div></div>`;
}
/* v31: the recovery question. A right answer lets a grown-up pick a new code; nothing is erased */
function renderRecover() {
  const el = $('#tab-parent'), r = DEV.rec, wait = Math.ceil(((DEV.recUntil || 0) - Date.now()) / 1000);
  el.innerHTML = `<div class="wrap"><div class="gate card rec ${gate.shake ? 'shake' : ''}"><h1 class="title">🛟 ${t('rc.title')}</h1><p class="sub">${t('rc.sub')}</p>
    <p class="rc-q"><b>${esc(recQuestion(r))}</b></p>
    <input id="recAns" class="kid-name rc-in" type="text" maxlength="60" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(t('rc.answer'))}" placeholder="${esc(t('rc.answer'))}" ${wait > 0 ? 'disabled' : ''}>
    <p class="pmsg" aria-live="polite">${wait > 0 ? esc(t('pin.wait', { s: wait })) : esc(gate.msg || '')}</p>
    <div class="seg" style="justify-content:center"><button class="btn" data-act="recCheck" ${wait > 0 ? 'disabled' : ''}>✔ ${t('rc.check')}</button><button class="btn ghost" data-act="recBack">${t('pin.cancel')}</button></div>
    <details class="rc-erase"><summary>${t('rc.still')}</summary><p class="note">${t('rc.eraseTxt')}</p><button class="btn ghost" data-act="recErase">${gate.forgot ? t('pin.forgot2') : t('pp.erase')}</button></details></div></div>`;
  const i = $('#recAns'); if (i && i.focus && wait <= 0) setTimeout(() => { try { i.focus(); } catch (e) { /* ok */ } }, 30);
}
function pinDigit(v) {
  if (DEV.pinUntil > Date.now()) return;
  if (v === 'back') gate.buf = gate.buf.slice(0, -1); else if (v === 'clear') gate.buf = ''; else if (gate.buf.length < 6) gate.buf += v;
  gate.msg = ''; gate.shake = false; renderGate();
  if (gate.buf.length === 6) setTimeout(processPin, 160);
}
async function processPin() {
  const mode = gateMode(), b = gate.buf; if (b.length !== 6 || gate.busy) return;
  gate.buf = '';
  if (mode === 'enter') {
    gate.busy = true; let ok = false; try { ok = await pinCheck(b); } finally { gate.busy = false; }
    if (ok) { gate.unlocked = true; gate.fails = 0; gate.msg = ''; gate.t = Date.now(); return renderParent(); }
    gate.fails++; gate.shake = true; gate.msg = t('pin.wrong');
    if (gate.fails % 5 === 0) DEV.pinUntil = Date.now() + 30000 * (gate.fails / 5); saveDev();
    renderGate(); setTimeout(() => { gate.shake = false; }, 600); return;
  }
  if (mode === 'create1' || mode === 'change1' || mode === 'reset1') { gate.first = b; gate.mode = mode.slice(0, -1) + '2'; gate.msg = ''; return renderGate(); }
  if (b === gate.first) { gate.busy = true; try { await pinSet(b); } finally { gate.busy = false; } gate.first = ''; gate.mode = 'enter'; gate.unlocked = true; gate.fails = 0; gate.forgot = false; gate.t = Date.now(); toast(t(mode === 'create2' ? 'pin.set' : mode === 'reset2' ? 'rc.done' : 'pin.changed')); return renderParent(); }
  gate.mode = mode.slice(0, -1) + '1'; gate.first = ''; gate.shake = true; gate.msg = t('pin.mismatch'); renderGate(); setTimeout(() => { gate.shake = false; }, 600);
}
const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const remainingMs = () => limitMin() * 60000 + S.session.extra - S.session.elapsed;   // v24: per-child, school days and weekends
const tog = (act, key, on) => `<button class="chip" data-act="${act}" aria-pressed="${on}">${t(key, { s: t(on ? 'on' : 'off') })}</button>`;
const mv = id => UI.sample ? SAMPLE[id] : mastery(id);

function dashboardHTML() {
  const band = S.band;
  const doms = DOMAINS.map(d => {
    const vals = d.topics.map(mv).filter(v => v !== null && v !== undefined);
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 100) : null;
    const tries = UI.sample ? 24 : d.topics.reduce((a, id) => a + (S.topics[id] ? S.topics[id].n : 0), 0), bench = d.bench[band];
    let st = 'dm.collect', cls = 'na';
    if (avg !== null && tries >= 5) { if (avg >= bench + 5) { st = 'dm.above'; cls = 'hi'; } else if (avg >= bench - 5) { st = 'dm.on'; cls = 'ok'; } else { st = 'dm.below'; cls = 'lo'; } }
    return `<div class="dom"><div class="dm-h"><span>${d.em} ${t(d.key)}</span><b>${avg === null ? '–' : avg + '%'}</b></div>
      <div class="gauge" role="img" aria-label="${esc(t(d.key))}: ${avg === null ? t('hm.nodata') : avg + '%'}, ${esc(t('pp.bench', { n: bench }))}"><i style="width:${avg || 0}%"></i><u style="left:${bench}%"></u></div>
      <div class="dm-f"><span>${t('pp.bench', { n: bench })}</span><span class="st ${cls}">${t(st)}</span></div></div>`;
  }).join('');
  const att = TOPICS.map(x => ({ id: x.id, m: mv(x.id) })).filter(x => x.m !== null && x.m !== undefined && x.m < .8).sort((a, b) => a.m - b.m)[0];
  const heat = SUBJECTS.map(([id, em]) => {
    const ts = TOPICS.filter(x => x.subj === id), ms2 = ts.map(x => mv(x.id)).filter(v => v !== null && v !== undefined);
    const avg = ms2.length ? Math.round(ms2.reduce((a, b) => a + b, 0) / ms2.length * 100) : null;
    const cells = ts.map(x => {
      const m = mv(x.id), n = UI.sample ? 6 : (S.topics[x.id] ? S.topics[x.id].n : 0), name = t('tp.' + x.id);
      if (m === null || m === undefined) return `<div class="heat none" role="img" aria-label="${esc(t('hm.ariaNone', { name }))}"><div class="in"><b>–</b><span>${esc(name)}</span><small>${t('hm.none')}</small></div></div>`;
      const p = Math.round(m * 100), lvl = t(p >= 80 ? 'lg.strong' : p >= 50 ? 'lg.growing' : 'lg.needs').replace(/ \(.*\)/, '');
      return `<div class="heat" style="--m:${m}" role="img" aria-label="${esc(t('hm.aria', { name, p, lvl }))}"><div class="in"><b>${p}%</b><span>${esc(name)}</span><small>${lvl} · ${t('hm.tries', { n })}</small></div></div>`;
    }).join('');
    return `<div class="hm-row"><div class="hm-h"><span>${em} ${t('subj.' + id)}</span><span>${avg === null ? t('hm.nodata') : t('hm.avg', { n: avg })}</span></div><div class="hm-grid">${cells}</div></div>`;
  }).join('');
  return `<div class="doms">${doms}</div>${att ? `<p class="note" style="margin:10px 0">🎯 ${esc(t('pp.focus', { t: t('tp.' + att.id) }))}</p>` : ''}<p class="sub">${t('pp.diagNote')}</p>
    <div class="seg" style="margin-bottom:12px">${tog('sample', 'pp.demo', UI.sample)}</div>
    <h3 class="sub-h">${t('pp.heat')}</h3><div class="card">${heat}<div class="legend"><span><i style="--m:.3"></i>${t('lg.needs')}</span><span><i style="--m:.65"></i>${t('lg.growing')}</span><span><i style="--m:1"></i>${t('lg.strong')}</span></div></div>`;
}
function renderParent() { return HOOK.call('renderParent', renderParentBase, arguments); }   // v31: extensions register with HOOK (00c)
function renderParentBase() {
  const el = $('#tab-parent');
  if (!gate.unlocked) return renderGate();
  const done = Object.values(S.topics).reduce((a, x) => a + x.n, 0), first = Object.values(S.topics).reduce((a, x) => a + x.f, 0);
  const starTotal = Object.values(S.stars).reduce((a, b) => a + b, 0), learned = Object.keys(S.learned).filter(k => MODULES.some(m => m.id === k)).length;
  let advice = t('pp.adv0');
  if (S.recent.length >= 6) {
    const r = Math.round(S.recent.reduce((a, b) => a + b, 0) / S.recent.length * 100);
    advice = r >= 85 && S.band < 4 ? t('pp.advUp', { r, b: t('band.' + (S.band + 1)) }) : r <= 40 && S.band > 1 ? t('pp.advDown', { r, b: t('band.' + (S.band - 1)) }) : t('pp.advOk', { r });
  }
  const chips = (act, arr, cur) => arr.map(([v, label]) => `<button class="chip" data-act="${act}" data-v="${v}" aria-pressed="${cur === v}">${label}</button>`).join('');
  const bands = [1, 2, 3, 4].map(b => `<button class="band" data-act="band" data-v="${b}" aria-pressed="${S.band === b}"><b>${t('band.' + b)}</b><small>${t('band.d' + b)}</small></button>`).join('');
  const log = S.log.length ? S.log.map(l => `<li><span>${esc(l.k ? t(l.k, l.p) : l.m)}</span><time>${new Date(l.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></li>`).join('') : `<li><span>${t('pp.noact')}</span></li>`;
  const sizes = [[.9, 'sz.s'], [1, 'sz.m'], [1.15, 'sz.l'], [1.3, 'sz.xl']].map(([v, k], i) => `<button class="chip" data-act="fs" data-v="${v}" aria-pressed="${S.fs === v}" style="font-size:${[.8, .95, 1.1, 1.3][i]}rem">A<span style="font-size:.7rem;margin-left:4px">${t(k)}</span></button>`).join('');
  const many = DEV.profiles.length > 1;
  el.innerHTML = `<div class="wrap"><h1 class="title">${t('pp.title')}</h1><p class="sub">${many ? esc(t('fam.portalFor', { n: kidName(curProfile()) })) : t('pp.sub')}</p>
    ${familyHTML()}${weekHTML()}
    <h2 class="section">${t('pp.lang')}</h2><div class="seg">${LANG_ORDER.map(l => `<button class="chip" data-act="lang" data-v="${l}" aria-pressed="${S.lang === l}">${LANGS[l].n}</button>`).join('')}</div>
    <h2 class="section">${t('pp.timer')}</h2>
    <div class="card timerbox"><div class="seg">${chips('timer', [[0, t('off')], [10, t('pp.min', { n: 10 })], [15, t('pp.min', { n: 15 })], [20, t('pp.min', { n: 20 })], [30, t('pp.min', { n: 30 })], [45, t('pp.min', { n: 45 })]], S.timerMin)}</div>
      <div class="row"><div><span>${t('pp.played')}</span><b class="big" id="tPlayed">0:00</b></div><div><span>${t('pp.left')}</span><b class="big" id="tLeft">–</b></div></div>
      <div class="seg"><button class="btn" data-act="addTime" data-v="5">${t('pp.add5')}</button><button class="btn ghost" data-act="addTime" data-v="10">${t('pp.add10')}</button><button class="btn ghost" data-act="restartClock">${t('pp.restart')}</button></div>
      <div class="seg" style="margin-top:12px">${tog('showTimer', 'pp.showTimer', S.showTimer)}</div><p class="sub" style="margin:10px 0 0">${t('pp.timerNote')}</p>${screenTimeHTML()}${bedtimeHTML()}</div>
    <h2 class="section">${t('pp.pace')}</h2><div class="card"><div class="seg">${chips('pace', PACES.map(k => [k, t('pace.' + k)]), S.pace)}</div><p class="sub" style="margin:10px 0 0">${t('pp.paceNote')}</p>
      </div>
    <h2 class="section">${t('pp.diff')}</h2><div class="seg">${bands}</div>
    <div class="card" style="margin-top:12px"><div class="seg">${tog('openAll', 'pp.openAll', S.openAll)}</div><p class="sub" style="margin:10px 0 0">${t('pp.openAllNote')}</p></div>${subjectsHTML()}${lotwParentHTML()}
    <h2 class="section">${t('pp.look')}</h2><div class="seg">${chips('theme', [['auto', t('th.auto')], ['warm', t('th.warm')], ['dark', t('th.dark')]], S.theme)}</div><p class="sub" style="margin-top:8px">${t('pp.themeNote')}</p>
    <div class="card" style="margin-bottom:12px"><div class="seg">${tog('pixel', 'pp.pixel', !!S.pixel)}</div><p class="sub" style="margin:10px 0 0">${t('pp.pixelNote')}</p></div>${qualityHTML()}
    <div class="card"><div class="seg">${tog('sensory', 'pp.sensory', S.sensory)}</div><p class="sub" style="margin:10px 0 0">${t('pp.sensoryNote')}</p></div>
    <h2 class="section">${t('pp.read')}</h2>
    <div class="card"><div class="seg">${tog('dys', 'pp.dys', S.dys)}</div><h3 class="sub-h">${t('pp.size')}</h3><div class="fsrow">${sizes}</div><p class="sample">${t('pp.sample')}</p></div>
    <h2 class="section">${t('pp.voice')}</h2>
    <div class="card"><div class="seg">${tog('vauto', 'pp.auto', S.voice.auto)}${tog('sfx', 'pp.sfx', S.sfx && !S.sensory)}${tog('music', 'pp.music', musicOn())}</div><div class="vols">${volumeHTML()}</div>
      <h3 class="sub-h">${t('pp.vstyle')}</h3><div class="seg">${chips('vstyle', [['gentle', t('vs.gentle')], ['warm', t('vs.warm')], ['bright', t('vs.bright')]], S.voice.style)}</div>
      <h3 class="sub-h">${t('pp.rate')}</h3><div class="seg">${chips('vrate', [[.7, t('rt.soft')], [.82, t('rt.calm')], [1, t('rt.norm')]], S.voice.rate)}<button class="btn ghost" data-act="testVoice">${t('pp.test')}</button></div>
      <h3 class="sub-h">${t('pp.vname')}</h3>${voiceSelectHTML()}<p class="sub" style="margin:10px 0 0">${t('pp.voiceNote')}</p>${micHTML()}</div>
    <h2 class="section">${t('pp.progress')}</h2>
    <div class="pgrid"><div class="tile"><b>${done}</b><span>${t('pp.q')}</span></div><div class="tile"><b>${done ? Math.round(first / done * 100) : 0}%</b><span>${t('pp.fr')}</span></div><div class="tile"><b>${starTotal}/${SUBJ_ORDER.length * LEVELS_PER * 3 * 3}</b><span>${t('pp.starsT')}</span></div><div class="tile"><b>${learned}/${MODULES.length}</b><span>${t('pp.lessons')}</span></div><div class="tile"><b>${S.earned}</b><span>${t('pp.coins')}</span></div></div>
    <h2 class="section">${t('pp.diag')}</h2>${dashboardHTML()}
    <p class="note" style="margin-top:12px">${esc(advice)}</p>${trickyHTML()}
    <h2 class="section">${t('pp.activity')}</h2><div class="card"><ul class="log">${log}</ul></div>
    <h2 class="section">${t('pp.priv')}</h2>
    <div class="card"><p class="note">🔒 ${t('pp.privTxt')}</p><p class="sub" style="margin:10px 0">${storageOK ? t('pp.saved', { t: new Date(S.savedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }) : t('pp.nosave')}</p>
      <div class="seg"><button class="btn ghost" data-act="pinChange">🔑 ${t('pin.change')}</button><button class="btn ghost" data-act="export">${t('pp.export')}</button><button class="btn ghost" data-act="import">${t('pp.import')}</button><button class="btn ghost" data-act="erase">${UI.eraseArmed ? t('pp.erase2') : t('pp.erase')}</button></div><p class="sub" style="margin:10px 0 0;font-size:.78rem">${t('pin.note')}</p><input type="file" id="impFile" accept="application/json,.json" hidden><p class="sub" style="margin:10px 0 0;font-size:.74rem">Quest Academy v${__APP_VERSION__}</p></div>
    <div class="seg" style="margin-top:18px"><button class="btn" data-act="lock">${t('pp.lock')}</button></div></div>`;
  updateTimer(); fillMicStatus();
}
/* ---- backup, restore and erase (all local, nothing is uploaded) ---- */
function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }), a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'quest-academy-backup.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importData(text) {
  try {
    const o0 = JSON.parse(text), o = migrateSave(o0).save;   // v34: an older backup is brought up to date first
    if (!o || typeof o.coins !== 'number' || !Array.isArray(o.owned) || typeof o.equipped !== 'object') throw new Error('bad');
    S = Object.assign(defaults(), o); S.equipped = Object.assign(defaults().equipped, S.equipped); save(); B.q = null; B.token++; B.active = false; UI.adv = 'map'; applyTheme(); applyLang(); $('#coinVal').textContent = S.coins; lockUI(); updateTimer(); renderParent(); toast(t('pp.imported'));
  } catch (e) { toast(t('pp.badfile')); }
}
/* erase this child's progress; everything = true (forgotten parent code) wipes every child and the code too */
function eraseAll(everything) {
  try {
    if (everything) {
      DEV.profiles.forEach(p => localStorage.removeItem(profKey(p.id))); localStorage.removeItem(OLD_KEY);
      Object.assign(DEV, { pin: null, pinUntil: 0, rec: null, recUntil: 0, active: 'p1', profiles: [{ id: 'p1', name: '', made: Date.now() }] }); saveDev(); saveKey = profKey('p1');
    } else localStorage.removeItem(profKey(DEV.active));
  } catch (e) { /* ignore */ }
  const lang = S.lang; S = defaults(); S.lang = lang; S.welcomed = true; Object.assign(gate, { unlocked: false, mode: 'enter', buf: '', first: '', msg: '', forgot: false, fails: 0 }); UI.eraseArmed = false; B.q = null; B.token++; B.active = false; timeUp = false; UI.adv = 'map';
  $('#coinVal').textContent = S.coins; applyTheme(); applyLang(); syncWhoBtn(); lockUI(); showTab('studies', true); updateTimer(); saveNow();
}

/* ================= Session timer ================= */
let timeUp = false, warned = false, ticks = 0;
function ensureSession() { if (S.session.day !== todayKey()) S.session = { day: todayKey(), elapsed: 0, extra: 0 }; }
function updateTimer() {
  const pill = $('#timerPill');
  if (limitMin() > 0 && S.showTimer && !S.sensory) { pill.hidden = false; const r = remainingMs(); $('#timerTxt').textContent = fmt(r); pill.classList.toggle('low', r <= 120000); pill.setAttribute('aria-label', t('time.left', { t: fmt(r) })); } else pill.hidden = true;
  const tp = $('#tPlayed'), tl = $('#tLeft');
  if (tp) tp.textContent = fmt(S.session.elapsed);
  if (tl) tl.textContent = limitMin() > 0 ? fmt(remainingMs()) : t('pp.nolimit');
}
function syncTimeOverlay() { $('#timeOverlay').classList.toggle('on', (timeUp || bedUp) && UI.tab !== 'parent'); }
function showTimeUp() {
  if (bedUp) return showBedtime();
  const text = `${t('tu.g' + S.band)} ${t('tu.body', { n: sess.solved, c: sess.coins })}`;
  $('#timeSheet').innerHTML = `${owlSVG()}<h2>${t('tu.title')}</h2><p>${esc(text)}</p><div class="seg" style="justify-content:center"><button class="btn" data-act="say" data-say="${esc(text)}">${t('tu.hear')}</button><button class="btn ghost" data-act="timeParent">${t('tu.ask')}</button></div>`;
  syncTimeOverlay(); if (S.voice.auto) speak(text);
}
function checkTimer() {
  if (limitMin() > 0) {
    const r = remainingMs();
    if (r <= 0 && !timeUp) { timeUp = true; showTimeUp(); }
    else if (r > 0 && timeUp) { timeUp = false; syncTimeOverlay(); }
    if (r > 0 && r <= 120000 && !warned) { warned = true; toast(t('tt.two')); }
    if (r > 120000) warned = false;
  } else if (timeUp) { timeUp = false; syncTimeOverlay(); }
  updateTimer();
}
function tick() {
  if (document.hidden) return;
  ensureSession(); checkBedtime(); if (!bedUp) { S.session.elapsed += 1000; dayStat().ms += 1000; }
  if (++ticks % 10 === 0) save();
  if (gate.unlocked && UI.tab === 'parent' && Date.now() - gate.t > 300000) { gate.unlocked = false; renderParent(); toast(t('pin.idle')); }
  checkTimer();
}
