/* ================= v21: family, focus, bedtime and the new Parent Portal sections =================
   FAMILY. Several children can share one device. Each child has their own save (see DEV in 05); the parent
   code, the list of children and the graphics setting belong to the device. When more than one child is
   set up, the game asks "Who is playing?" once per visit, and the name button in the top bar changes player.
   Changing player saves at once and reloads the page, so nothing from one child can leak into another.
   SUBJECTS. S.locks hides subjects until a grown-up turns them on again; S.focus picks subjects for today only.
   BEDTIME. S.bedtime.at is a local clock time; from then until 06:00 the game is stopped and only the parent
   code opens it (15 more minutes, or no bedtime tonight). */
const WHO_KEY = 'quest-academy-who', MAX_KIDS = 6, WAKE_MIN = 6 * 60;
const kidName = (p, i = DEV.profiles.indexOf(p)) => (p && p.name) || t('fam.child', { n: i + 1 });
function kidSave(id) {
  if (id === DEV.active) return S;
  try { return JSON.parse(localStorage.getItem(profKey(id)) || (id === 'p1' ? localStorage.getItem(OLD_KEY) : null) || '{}') || {}; } catch (e) { return {}; }
}
const kidEquip = o => { const eq = Object.assign({ ...DEFAULT_EQUIP }, o.equipped || {}); Object.keys(eq).forEach(k => { if (!ITEM[eq[k]]) eq[k] = DEFAULT_EQUIP[k]; }); if (!ITEM[eq.knight]) eq.knight = 'knight_tobias'; return eq; };
function kidCard(p, i, act) {
  const o = kidSave(p.id), eq = kidEquip(o), stars = Object.values(o.stars || {}).reduce((a, b) => a + b, 0);
  return `<button class="kid ${p.id === DEV.active ? 'on' : ''}" data-act="${act}" data-v="${p.id}"><span class="kid-av" aria-hidden="true">${heroSVG(eq)}</span><b>${esc(kidName(p, i))}</b><small>${o.welcomed ? `${t('band.' + (o.band || 2))} · ${t('fam.stars', { n: stars })}` : t('fam.new')}</small></button>`;
}
/* ---- "Who is playing?" ---- */
function whoOverlay() {
  let ov = $('#whoOverlay');
  if (!ov) {
    ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'whoOverlay';
    ov.innerHTML = '<div class="mwrap"><button class="mclose" data-act="whoClose" aria-label="Close">✕</button><div class="sheet who" id="whoSheet" role="dialog" aria-modal="true"></div></div>';
    document.body.appendChild(ov);
  }
  return ov;
}
function openWho() {
  if (B.active) { toast(t('lock.toast')); return; }
  const ov = whoOverlay();
  $('#whoSheet').setAttribute('aria-label', t('fam.who'));
  $('#whoSheet').innerHTML = `<h2>${t('fam.who')}</h2><p class="sub">${t('fam.whoSub')}</p><div class="kids">${DEV.profiles.map((p, i) => kidCard(p, i, 'whoPick')).join('')}</div><p class="sub" style="margin-top:12px;font-size:.8rem">${t('fam.addHint')}</p>`;
  ov.classList.add('on');
}
function closeWho() { const ov = $('#whoOverlay'); if (ov) ov.classList.remove('on'); try { sessionStorage.setItem(WHO_KEY, '1'); } catch (e) { /* private mode */ } }
function switchKid(id) {
  if (!DEV.profiles.some(p => p.id === id)) return;
  try { sessionStorage.setItem(WHO_KEY, '1'); } catch (e) { /* private mode */ }
  if (id === DEV.active) { closeWho(); return; }
  saveNow(); saveOff = true; DEV.active = id; saveDev(); location.reload();
}
function syncWhoBtn() {
  const b = $('#whoBtn'); if (!b) return;
  const many = DEV.profiles.length > 1, p = curProfile(), nm = kidName(p);
  b.hidden = !many; if (!many) return;
  b.innerHTML = `<i aria-hidden="true">${esc(nm.slice(0, 1).toUpperCase())}</i><span>${esc(nm)}</span>`;
  b.setAttribute('aria-label', `${t('fam.switch')}: ${nm}`);
}
function maybeAskWho() {
  let seen = false; try { seen = !!sessionStorage.getItem(WHO_KEY); } catch (e) { seen = true; }
  if (DEV.profiles.length > 1 && !seen && S.welcomed) openWho();
}
/* ---- managing children (Parent Portal) ---- */
const cleanName = s => String(s || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
function addKid(name) {
  if (DEV.profiles.length >= MAX_KIDS) { toast(t('fam.max')); return; }
  const id = 'p' + Date.now().toString(36), p = { id, name: cleanName(name), made: Date.now() };
  DEV.profiles.push(p); saveDev();
  try { localStorage.setItem(profKey(id), JSON.stringify({ v: SAVE_SCHEMA, lang: S.lang, welcomed: false })); } catch (e) { storageOK = false; }
  toast(t('fam.added', { n: kidName(p) })); syncWhoBtn(); renderParent();
}
function renameKid(id, name) { const p = DEV.profiles.find(x => x.id === id); if (!p) return; p.name = cleanName(name); saveDev(); syncWhoBtn(); toast(t('fam.renamed')); renderParent(); if (id === DEV.active) applyLang(); }
function removeKid(id) {
  const i = DEV.profiles.findIndex(x => x.id === id); if (i < 0 || DEV.profiles.length < 2) return;
  const [p] = DEV.profiles.splice(i, 1);
  try { localStorage.removeItem(profKey(id)); if (id === 'p1') localStorage.removeItem(OLD_KEY); } catch (e) { /* ignore */ }
  UI.kidArmed = null;
  if (id === DEV.active) { saveOff = true; DEV.active = DEV.profiles[0].id; saveDev(); location.reload(); return; }
  saveDev(); syncWhoBtn(); toast(t('fam.removed', { n: kidName(p, i) })); renderParent();
}
function familyHTML() {
  const rows = DEV.profiles.map((p, i) => {
    const o = kidSave(p.id), stars = Object.values(o.stars || {}).reduce((a, b) => a + b, 0), me = p.id === DEV.active, armed = UI.kidArmed === p.id;
    return `<div class="kidrow ${me ? 'on' : ''}"><span class="kid-av sm" aria-hidden="true">${heroSVG(kidEquip(o))}</span>
      <div class="kid-main"><input class="kid-name" id="kn-${p.id}" maxlength="16" value="${esc(p.name || '')}" placeholder="${esc(kidName(p, i))}" aria-label="${esc(t('fam.nameAria', { n: kidName(p, i) }))}"><small>${o.welcomed ? `${t('band.' + (o.band || 2))} · ⭐ ${stars} · 🪙 ${o.coins || 0}` : t('fam.new')}${me ? ` · <b>${t('fam.playing')}</b>` : ''}</small></div>
      <div class="seg kid-acts"><button class="chip" data-act="kidRename" data-v="${p.id}">${t('fam.rename')}</button>${me ? '' : `<button class="chip" data-act="kidPlay" data-v="${p.id}">${t('fam.play', { n: esc(kidName(p, i)) })}</button>`}${DEV.profiles.length > 1 ? `<button class="chip ${armed ? 'danger' : ''}" data-act="kidRemove" data-v="${p.id}">${armed ? t('fam.remove2', { n: esc(kidName(p, i)) }) : t('fam.remove')}</button>` : ''}</div></div>`;
  }).join('');
  const add = DEV.profiles.length < MAX_KIDS ? `<div class="kidadd"><input id="kidNew" maxlength="16" placeholder="${esc(t('fam.namePh'))}" aria-label="${esc(t('fam.namePh'))}"><button class="btn" data-act="kidAdd">＋ ${t('fam.add')}</button></div>` : `<p class="sub">${t('fam.max')}</p>`;
  return `<h2 class="section">👨‍👩‍👧 ${t('fam.title')}</h2><div class="card"><div class="kidlist">${rows}</div>${add}<p class="sub" style="margin:10px 0 0">${t('fam.note')}</p></div>`;
}

/* ---- subjects: always-on list and today's focus ---- */
const focusToday = () => (S.focus && S.focus.day === todayKey() && S.focus.s && S.focus.s.length) ? S.focus.s : null;
const subjOpen = s => { if (!SUBJ_ORDER.includes(s)) return true; const f = focusToday(); return f ? f.includes(s) : !(S.locks || []).includes(s); };
function openSubjects() { return SUBJ_ORDER.filter(subjOpen); }
function subjBannerHTML() {
  const f = focusToday(), locked = (S.locks || []).length;
  if (!f && !locked) return '';
  return `<p class="note subjbanner">${esc(f ? t('sj.banner', { s: f.map(s => t('subj.' + s)).join(', ') }) : t('sj.banner', { s: openSubjects().map(s => t('subj.' + s)).join(', ') }))}</p>`;
}
function toggleLock(s) {
  const L = S.locks || (S.locks = []), i = L.indexOf(s);
  if (i >= 0) L.splice(i, 1); else { if (SUBJ_ORDER.filter(x => !L.includes(x)).length <= 1) { toast(t('sj.needOne')); return; } L.push(s); }
  save(); renderParent();
}
function toggleFocus(s) {
  if (!S.focus || S.focus.day !== todayKey()) S.focus = { day: todayKey(), s: [] };
  const i = S.focus.s.indexOf(s); if (i >= 0) S.focus.s.splice(i, 1); else S.focus.s.push(s);
  save(); renderParent();
}
function subjectsHTML() {
  const f = focusToday() || [], L = S.locks || [];
  const chip = (act, s, on) => `<button class="chip" data-act="${act}" data-v="${s}" aria-pressed="${on}">${SUBJ_EM[s]} ${t('subj.' + s)}</button>`;
  return `<h2 class="section">${t('sj.title')}</h2><div class="card"><h3 class="sub-h" style="margin-top:0">${t('sj.always')}</h3><div class="seg">${SUBJ_ORDER.map(s => chip('subjLock', s, !L.includes(s))).join('')}</div><p class="sub" style="margin:8px 0 0">${t('sj.alwaysNote')}</p>
    <h3 class="sub-h">🎯 ${t('sj.focus')}</h3><div class="seg">${SUBJ_ORDER.map(s => chip('subjFocus', s, f.includes(s))).join('')}</div><p class="sub" style="margin:8px 0 0">${t('sj.focusNote')}</p>${f.length ? `<div class="seg" style="margin-top:8px"><button class="btn ghost" data-act="focusClear">${t('sj.focusClear')}</button></div>` : ''}</div>`;
}

/* ---- bedtime ---- */
let bedUp = false, bedWarn = '';
const BED_TIMES = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
const clockLabel = (hm) => { const [h, m] = hm.split(':').map(Number), d = new Date(); d.setHours(h, m, 0, 0); return d.toLocaleTimeString(S.lang === 'ms' ? 'ms-MY' : 'en-GB', { hour: 'numeric', minute: '2-digit' }); };
const bedMin = () => { const [h, m] = S.bedtime.at.split(':').map(Number); return h * 60 + m; };
function bedtimeNow(d = new Date()) {
  const b = S.bedtime; if (!b || !b.at) return false;
  if (b.ok && Date.now() < b.ok) return false;
  const mins = d.getHours() * 60 + d.getMinutes();
  return mins >= bedMin() || mins < WAKE_MIN;
}
function nextWake() { const d = new Date(); if (d.getHours() * 60 + d.getMinutes() >= WAKE_MIN) d.setDate(d.getDate() + 1); d.setHours(WAKE_MIN / 60, 0, 0, 0); return d.getTime(); }
function showBedtime() {
  const text = `${t('bed.sheetT')}. ${t('bed.sheetB')}`;
  $('#timeSheet').innerHTML = `<div class="bedmoon" aria-hidden="true">🌙</div>${owlSVG()}<h2>${t('bed.sheetT')}</h2><p>${esc(t('bed.sheetB'))}</p><div class="seg" style="justify-content:center"><button class="btn" data-act="say" data-say="${esc(text)}">${t('tu.hear')}</button><button class="btn ghost" data-act="timeParent">${t('tu.ask')}</button></div>`;
  $('#timeSheet').setAttribute('aria-label', t('bed.sheetT'));
  syncTimeOverlay(); if (S.voice.auto) speak(text);
}
function checkBedtime() {
  const on = bedtimeNow();
  if (on && !bedUp) { bedUp = true; showBedtime(); }
  else if (!on && bedUp) { bedUp = false; $('#timeSheet').setAttribute('aria-label', 'Time for a break'); if (timeUp) showTimeUp(); syncTimeOverlay(); }
  if (!on && S.bedtime && S.bedtime.at) {
    const d = new Date(), mins = d.getHours() * 60 + d.getMinutes(), left = bedMin() - mins;
    if (left > 0 && left <= 10 && bedWarn !== todayKey() && !(S.bedtime.ok > Date.now())) { bedWarn = todayKey(); toast(t('bed.soon')); }
  }
}
function bedtimeHTML() {
  const b = S.bedtime || {}, at = b.at || '';
  const chips = [['', t('bed.off')], ...BED_TIMES.map(x => [x, clockLabel(x)])].map(([v, l]) => `<button class="chip" data-act="bed" data-v="${v}" aria-pressed="${at === v}">${l}</button>`).join('');
  let status = '';
  if (at) {
    const paused = b.ok && Date.now() < b.ok;
    if (paused) status = `<p class="note" style="margin:10px 0 0">${t('bed.ok', { t: new Date(b.ok).toLocaleTimeString(S.lang === 'ms' ? 'ms-MY' : 'en-GB', { hour: 'numeric', minute: '2-digit' }) })}</p><div class="seg" style="margin-top:8px"><button class="btn ghost" data-act="bedResume">${t('bed.resume')}</button></div>`;
    else if (bedtimeNow()) status = `<p class="note" style="margin:10px 0 0">🌙 ${t('bed.now')}</p><div class="seg" style="margin-top:8px"><button class="btn" data-act="bedMore">${t('bed.more')}</button><button class="btn ghost" data-act="bedSkip">${t('bed.skip')}</button></div>`;
  }
  return `<h3 class="sub-h">🌙 ${t('bed.title')}</h3><div class="seg">${chips}</div>${status}<p class="sub" style="margin:10px 0 0">${t('bed.note', { w: clockLabel('06:00') })}</p>`;
}

/* ---- weekly summary and tricky questions ---- */
const topicLabel = k => { const [s, tp] = k.split('|'); if (/_trace$/.test(tp || '')) return `${t('tr.title')} (${t('subj.' + s)})`; return STR['tp.' + tp] ? t('tp.' + tp) : t('subj.' + s); };
function weekHTML() {
  const w = weekSummary(), max = Math.max(...w.rows.map(r => r.ms), 60000), lc = S.lang === 'ms' ? 'ms-MY' : 'en-GB';
  const dayName = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString(lc, { weekday: 'short' }); };
  const bars = w.rows.map(r => { const n = Math.round(r.ms / 60000); return `<div class="wk-col" role="img" aria-label="${esc(t('wk.barAria', { d: dayName(r.k), n }))}"><small>${n || ''}</small><i style="height:${Math.max(r.ms ? 6 : 2, r.ms / max * 100)}%"></i><span>${esc(dayName(r.k))}</span></div>`; }).join('');
  const hm = ms => { const m = Math.round(ms / 60000); return m >= 60 ? t('wk.hm', { h: Math.floor(m / 60), m: m % 60 }) : t('wk.min', { n: m }); };
  if (!w.tot.ms && !w.tot.q) return `<h2 class="section">📅 ${t('wk.title')}</h2><div class="card"><p class="sub" style="margin:0">${t('wk.none')}</p></div>`;
  const names = list => list.map(x => topicLabel(x.k) + ` (${Math.round(x.acc * 100)}%)`).join(', ');
  const focus = w.weak[0], fs = focus && focus.k.split('|')[0];
  return `<h2 class="section">📅 ${t('wk.title')}</h2><div class="card"><div class="wk-bars">${bars}</div>
    <div class="pgrid" style="margin-top:12px"><div class="tile"><b>${hm(w.tot.ms)}</b><span>${t('wk.time')}</span></div><div class="tile"><b>${w.daysPlayed}/7</b><span>${t('wk.days')}</span></div><div class="tile"><b>${w.tot.q}</b><span>${t('wk.q')}</span></div><div class="tile"><b>${w.tot.q ? Math.round(w.tot.ok / w.tot.q * 100) : 0}%</b><span>${t('wk.first')}</span></div></div>
    ${w.best.length ? `<p class="sub" style="margin:12px 0 4px">${esc(t('wk.best', { t: names(w.best) }))}</p>` : ''}${w.weak.length ? `<p class="sub" style="margin:4px 0">${esc(t('wk.weak', { t: names(w.weak) }))}</p>` : ''}
    ${focus ? `<p class="note" style="margin:10px 0 0">${esc(t('wk.focus', { t: topicLabel(focus.k), s: t('subj.' + fs) }))}</p>${SUBJ_ORDER.includes(fs) ? `<div class="seg" style="margin-top:8px"><button class="btn ghost" data-act="focusSuggest" data-v="${fs}">${t('wk.focusBtn', { s: t('subj.' + fs) })}</button></div>` : ''}` : `<p class="note" style="margin:10px 0 0">${t('wk.noFocus')}</p>`}</div>`;
}
function trickyHTML() {
  const list = trickyQuestions(8);
  const rows = list.map(x => `<li><span class="tq-em" aria-hidden="true">${SUBJ_EM[x.subj] || '❓'}</span><span class="tq-t">${esc(x.text)}<small>${t('subj.' + x.subj)} · ${t('tq.row', { w: x.w, n: x.n })}</small></span></li>`).join('');
  return `<h2 class="section">🧩 ${t('tq.title')}</h2><div class="card"><p class="sub" style="margin:0 0 8px">${t('tq.sub')}</p>${list.length ? `<ol class="tricky">${rows}</ol>` : `<p class="note" style="margin:0">${t('tq.none')}</p>`}${Object.keys(S.qstats || {}).length ? `<div class="seg" style="margin-top:10px"><button class="btn ghost" data-act="qstatsClear">${t('tq.clear')}</button></div>` : ''}</div>`;
}

/* ---- listening, graphics, colour-blind palette, volume ---- */
function micHTML() {
  return `<h3 class="sub-h">🎤 ${t('mic.title')}</h3><div class="seg">${tog('micOff', 'mic.use', !S.micOff)}${tog('micOnline', 'mic.online', !!S.micOnline)}</div>
    <p class="note" id="micStatus" style="margin:10px 0 0" aria-live="polite">${t('mic.st.check')}</p><p class="sub" style="margin:8px 0 0">${t('mic.note')}</p>`;
}
/* the on-device check (SpeechRecognition.available) only runs when a grown-up asks for it or a child taps
   the microphone; some browsers load a speech component for it, so it is never started just by opening a page */
function fillMicStatus(force) {
  const el = $('#micStatus'); if (!el) return;
  const known = !SR || S.micOff || (SPEECH.local && SPEECH.local.lang === srLang());
  if (!known && !force) { el.innerHTML = `${t('mic.st.unknown')} <button class="chip" data-act="micCheck">${t('mic.check')}</button>`; return; }
  el.textContent = t('mic.st.check');
  speechMode().then(m => { const e2 = $('#micStatus'); if (e2) e2.textContent = t('mic.st.' + m); }).catch(() => { });
}
function qualityHTML() {
  const pref = DEV.quality || 'auto', chips = ['auto', 'high', 'lite'].map(v => `<button class="chip" data-act="quality" data-v="${v}" aria-pressed="${pref === v}">${t('gq.' + v)}</button>`).join('');
  const auto = pref === 'auto' ? `<p class="sub" style="margin:8px 0 0">${DEV.qMeasured ? t('gq.chose', { q: t('gq.' + DEV.qMeasured), ms: Math.round(DEV.qMs || 0) }) : t('gq.wait')}</p>` : '';
  return `<div class="card" style="margin-bottom:12px"><h3 class="sub-h" style="margin-top:0">${t('gq.title')}</h3><div class="seg">${chips}</div>${auto}<p class="sub" style="margin:8px 0 0">${t('gq.note')}</p></div>
    <div class="card" style="margin-bottom:12px"><div class="seg">${tog('cbSafe', 'cb.toggle', !!S.cb)}</div><p class="sub" style="margin:10px 0 0">${t('cb.note')}</p></div>`;
}
const volOf = k => { const v = (S.vol || {})[k]; return v === undefined ? 80 : v; };
function volumeHTML() {
  return ['music', 'sfx', 'voice'].map(k => `<label class="vol"><span>${t('vol.' + k)}</span><input type="range" min="0" max="100" step="5" value="${volOf(k)}" data-vol="${k}" aria-label="${esc(t('vol.' + k))}"><b>${volOf(k)}%</b></label>`).join('');
}
document.addEventListener('input', e => {
  const r = e.target.closest && e.target.closest('input[data-vol]'); if (!r) return;
  const k = r.dataset.vol, v = Math.max(0, Math.min(100, +r.value || 0));
  (S.vol || (S.vol = {}))[k] = v; save(); applyVolume();
  const b = r.parentElement.querySelector('b'); if (b) b.textContent = v + '%';
  if (UI.tab === 'parent') gate.t = Date.now();
});
document.addEventListener('change', e => { const r = e.target.closest && e.target.closest('input[data-vol]'); if (!r) return; if (r.dataset.vol === 'sfx') sfx.ok(); if (r.dataset.vol === 'voice') speak(t('pp.sample')); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !e.target.matches) return;
  if (e.target.matches('#kidNew')) { e.preventDefault(); addKid(e.target.value); }
  else if (e.target.matches('.kid-name')) { e.preventDefault(); renameKid(e.target.id.slice(3), e.target.value); }
});
function famEvent() { return HOOK.call('famEvent', famEventBase, arguments); }   // v31: extensions register with HOOK (00c)
function famEventBase(a, v) {
  switch (a) {
    case 'who': openWho(); return true;
    case 'whoPick': switchKid(v); return true;
    case 'whoClose': closeWho(); return true;
    case 'kidPlay': switchKid(v); return true;
    case 'kidAdd': { const i = $('#kidNew'); addKid(i ? i.value : ''); return true; }
    case 'kidRename': { const i = $('#kn-' + v); renameKid(v, i ? i.value : ''); return true; }
    case 'kidRemove': if (UI.kidArmed === v) removeKid(v); else { UI.kidArmed = v; renderParent(); setTimeout(() => { if (UI.kidArmed === v) { UI.kidArmed = null; if (UI.tab === 'parent' && gate.unlocked) renderParent(); } }, 4000); } return true;
    case 'subjLock': toggleLock(v); return true;
    case 'subjFocus': toggleFocus(v); return true;
    case 'focusClear': S.focus = null; save(); renderParent(); return true;
    case 'focusSuggest': S.focus = { day: todayKey(), s: [v] }; save(); renderParent(); toast(t('sj.banner', { s: t('subj.' + v) })); return true;
    case 'bed': S.bedtime = { at: v || '', ok: 0 }; save(); checkBedtime(); renderParent(); return true;
    case 'bedMore': S.bedtime.ok = Date.now() + 15 * 60000; save(); checkBedtime(); renderParent(); return true;
    case 'bedSkip': S.bedtime.ok = nextWake(); save(); checkBedtime(); renderParent(); return true;
    case 'bedResume': S.bedtime.ok = 0; save(); checkBedtime(); renderParent(); return true;
    case 'micOff': S.micOff = !S.micOff; save(); renderParent(); return true;
    case 'micOnline': S.micOnline = !S.micOnline; save(); renderParent(); return true;
    case 'micCheck': fillMicStatus(true); return true;
    case 'quality': DEV.quality = v; saveDev(); PX.Q.tier = qualityTier(); markLite(); PX.clear(); repaintSprites(); renderParent(); if (v === 'auto') idle(measureQuality); return true;
    case 'cbSafe': S.cb = !S.cb; save(); applyTheme(); renderParent(); return true;
    case 'qstatsClear': S.qstats = {}; save(); toast(t('tq.cleared')); renderParent(); return true;
  }
  return false;
}
