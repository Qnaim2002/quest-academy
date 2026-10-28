/* ================= v34: stay up to date, install for offline play, and (only if a grown-up opts in) local play counts =================
   1. UPDATE PROMPT. A new build now waits in the background (the service worker no longer swaps itself in under a running
      page, which could leave a child on old files). A small bar says "New version ready", outside of battles, and Reload
      switches over (the save is written first). The page also asks for updates when it is opened again after an hour.
   2. INSTALL NUDGE. On the first visit (after the welcome card), a small card speaks to grown-ups: install the app to play
      offline. Chrome and Android get an Install button; iPhone and iPad get the two steps. "Not now" asks again after a
      week (three times at most), "Do not ask again" is final. The Parents tab always keeps an install card.
   3. PLAY COUNTS (opt-in, off by default, never sent anywhere). Per level: starts, wins, leaves, questions, misses.
      They are kept in this browser only. A grown-up sees which levels children leave most often, can copy or save the
      counts to share, and can clear them. Counts have no names, no times of day and no answers. */
Object.assign(STR, {
  'pwa.new': ['New version ready!', 'Versi baharu sudah sedia!'], 'pwa.reload': ['Reload', 'Muat semula'], 'pwa.later': ['Later', 'Nanti'],
  'pwa.inst.t': ['Grown-ups: play offline', 'Untuk orang dewasa: main tanpa internet'],
  'pwa.inst.b': ['Install Quest Academy on this device so it opens fast and works without internet.', 'Pasang Quest Academy pada peranti ini supaya cepat dibuka dan boleh digunakan tanpa internet.'],
  'pwa.inst.go': ['Install', 'Pasang'], 'pwa.inst.not': ['Not now', 'Bukan sekarang'], 'pwa.inst.never': ['Do not ask again', 'Jangan tanya lagi'],
  'pwa.ios': ['On iPhone or iPad: tap Share, then “Add to Home Screen”.', 'Pada iPhone atau iPad: ketik Kongsi, kemudian “Tambah ke Skrin Utama”.'],
  'pwa.other': ['Open the browser menu and choose “Install app” or “Add to Home screen”.', 'Buka menu pelayar dan pilih “Pasang aplikasi” atau “Tambah ke skrin utama”.'],
  'pwa.done': ['Installed on this device. It works offline.', 'Dipasang pada peranti ini. Ia berfungsi tanpa internet.'],
  'pwa.card': ['Offline app', 'Aplikasi luar talian'],
  'an.title': ['Play counts', 'Kiraan permainan'], 'an.on': ['Keep play counts on this device: {s}', 'Simpan kiraan permainan pada peranti ini: {s}'],
  'an.note': ['Off by default. Only numbers per level (starts, wins, times a child left). No names. Nothing is sent anywhere.', 'Dimatikan secara lalai. Hanya nombor bagi setiap tahap (mula, menang, kali kanak-kanak keluar). Tiada nama. Tiada apa-apa dihantar ke mana-mana.'],
  'an.stuck': ['Levels children leave most', 'Tahap yang paling kerap ditinggalkan'], 'an.none': ['Not enough plays yet.', 'Belum cukup permainan.'],
  'an.row': ['{lv}: left {a} of {s} tries', '{lv}: tinggal {a} daripada {s} cubaan'],
  'an.copy': ['Copy counts', 'Salin kiraan'], 'an.save': ['Save counts file', 'Simpan fail kiraan'], 'an.clear': ['Clear counts', 'Padam kiraan'], 'an.copied': ['Copied!', 'Disalin!'], 'an.cleared': ['Counts cleared.', 'Kiraan dipadam.'],
});

/* ---------- 1. the update prompt ---------- */
const PWA = { reg: null, pending: false, reloading: false, last: Date.now(), snooze: false };
function pwaWatch(reg) {
  if (!reg || PWA.reg) return; PWA.reg = reg;
  const offer = () => { if (navigator.serviceWorker.controller) { PWA.pending = true; } };
  reg.addEventListener('updatefound', () => { const w = reg.installing; if (w) w.addEventListener('statechange', () => { if (w.state === 'installed') offer(); }); });
  if (reg.waiting) offer();
  document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - PWA.last > 3600e3) { PWA.last = Date.now(); reg.update().catch(() => {}); } });
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (PWA.reloading) location.reload(); });
}
function pwaApply() {
  PWA.reloading = true; try { saveNow(); } catch (e) { /* ignore */ }
  const w = PWA.reg && PWA.reg.waiting;
  if (w) w.postMessage({ type: 'SKIP_WAITING' });
  setTimeout(() => location.reload(), w ? 2500 : 0);
}
const pwaQuiet = () => UI.tab !== 'parent' && !B.active && !(PL && PL.open) && !document.querySelector('.overlay.on') && !document.hidden;
function pwaBar(id, html) {
  let el = document.getElementById(id); if (el) return el;
  el = document.createElement('div'); el.id = id; el.className = 'pwabar'; el.setAttribute('role', 'status'); el.innerHTML = html; document.body.appendChild(el); return el;
}
function pwaBarOff(id) { const el = document.getElementById(id); if (el) el.remove(); }
function pwaTick() {
  document.querySelectorAll('.pwabar').forEach(el => { el.style.display = UI.tab === 'parent' ? 'none' : ''; });   // v35: never over the Parent Portal keypad
  if (!pwaQuiet()) return;
  if (PWA.pending && !PWA.snooze) { pwaBar('updBar', `<span>✨ ${esc(t('pwa.new'))}</span><button class="btn" data-act="pwaReload">${esc(t('pwa.reload'))}</button><button class="chip" data-act="pwaLater">${esc(t('pwa.later'))}</button>`); return; }
  if (nudgeDue(Date.now()) && !document.getElementById('instBar')) {
    const ios = pwaIOS(), canPrompt = !!PWA.deferred;
    pwaBar('instBar', `<div class="pw-t"><b>📲 ${esc(t('pwa.inst.t'))}</b><small>${esc(t('pwa.inst.b'))}${!canPrompt ? ' ' + esc(t(ios ? 'pwa.ios' : 'pwa.other')) : ''}</small></div>${canPrompt ? `<button class="btn" data-act="pwaInstall">${esc(t('pwa.inst.go'))}</button>` : ''}<button class="chip" data-act="pwaNot">${esc(t('pwa.inst.not'))}</button><button class="linkbtn" data-act="pwaNever">${esc(t('pwa.inst.never'))}</button>`);
    DEV.inst.shown = (DEV.inst.shown | 0) + 1; DEV.inst.at = Date.now(); saveDev();
  }
}
setInterval(() => { try { pwaTick(); } catch (e) { /* ignore */ } }, 4000);

/* ---------- 2. the install nudge ---------- */
const pwaStandalone = () => { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
const pwaIOS = () => /iphone|ipad|ipod/i.test((typeof navigator !== 'undefined' && navigator.userAgent) || '') || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
DEV.inst = Object.assign({ shown: 0, at: 0, never: false, done: false }, DEV.inst || {});
function nudgeDue(now) {
  const d = DEV.inst;
  if (d.never || d.done || pwaStandalone() || !S.welcomed) return false;
  if (typeof location !== 'undefined' && location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) return false;   // a home screen app needs a secure page
  if (d.shown >= 3) return false;
  return d.shown === 0 || now - d.at >= 7 * 864e5;
}
window.addEventListener && window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); PWA.deferred = e; });
window.addEventListener && window.addEventListener('appinstalled', () => { DEV.inst.done = true; saveDev(); pwaBarOff('instBar'); toast(t('pwa.done')); PWA.deferred = null; });
async function pwaInstall() {
  const e = PWA.deferred; if (!e) { toast(t(pwaIOS() ? 'pwa.ios' : 'pwa.other')); return; }
  try { e.prompt(); const r = await e.userChoice; if (r && r.outcome === 'accepted') { DEV.inst.done = true; saveDev(); } } catch (x) { /* ignore */ }
  PWA.deferred = null; pwaBarOff('instBar'); if (UI.tab === 'parent') renderParent();
}
function pwaCardHTML() {
  if (pwaStandalone() || DEV.inst.done) return `<p class="note">📲 ${esc(t('pwa.done'))}</p>`;
  return `<div class="seg">${PWA.deferred ? `<button class="btn" data-act="pwaInstall">📲 ${esc(t('pwa.inst.go'))}</button>` : ''}</div><p class="note">${esc(t('pwa.inst.b'))} ${PWA.deferred ? '' : esc(t(pwaIOS() ? 'pwa.ios' : 'pwa.other'))}</p>`;
}

/* ---------- 3. play counts (opt-in, local only) ---------- */
const AN_KEY = 'quest-academy-counts';
const anOn = () => !!(DEV.an && DEV.an.on);
function anLoad() { try { const o = JSON.parse(localStorage.getItem(AN_KEY) || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } }
function anSave(o) { try { localStorage.setItem(AN_KEY, JSON.stringify(o)); } catch (e) { /* storage full or blocked: counts are optional */ } }
function anKey(lv) { return lv && lv.subj ? `${lv.subj}:${lv.band || S.band}:${lv.n}` : ''; }
function anBump(field, by = 1) {
  if (!anOn() || !B.lv || !B.lv.subj || B.lv.special && !B.lv.n) return;
  const k = anKey(B.lv); if (!k) return;
  const o = anLoad(), c = o[k] || (o[k] = { s: 0, w: 0, a: 0, q: 0, m: 0 }); c[field] = (c[field] | 0) + by; anSave(o);
}
let anOpen = false;   // a battle that has been counted as started and not yet as won or left
HOOK.on('startBattle', () => { if (!anOn()) return; anOpen = true; anBump('s'); });
HOOK.on('answer:right', () => anBump('q'));
HOOK.on('answer:wrong', () => { anBump('q'); anBump('m'); });
HOOK.on('win', () => { if (anOpen) { anBump('w'); anOpen = false; } });
HOOK.before('leaveBattle', () => { if (anOpen && B.active) { anBump('a'); } anOpen = false; });
window.addEventListener && window.addEventListener('pagehide', () => { if (anOpen && B.active) { anBump('a'); anOpen = false; } });
function anStuck(n = 5) {
  const o = anLoad();
  return Object.entries(o).map(([k, c]) => ({ k, s: c.s | 0, a: c.a | 0, w: c.w | 0, m: c.m | 0, q: c.q | 0, rate: (c.s | 0) ? (c.a | 0) / c.s : 0 }))
    .filter(r => r.s >= 3 && r.a >= 1).sort((a, b) => b.rate - a.rate || b.s - a.s).slice(0, n);
}
const anName = k => { const [s, b, n] = k.split(':'); return `${SUBJ_EM[s] || ''} ${t('subj.' + s)} ${t('adv.level', { n })}`; };
function anCardHTML() {
  const rows = anStuck(), body = rows.length ? `<ul class="an-list">${rows.map(r => `<li>${esc(t('an.row', { lv: anName(r.k), a: r.a, s: r.s }))}</li>`).join('')}</ul>` : `<p class="note">${esc(t('an.none'))}</p>`;
  return `<h4 class="an-h">📊 ${esc(t('an.title'))}</h4><div class="seg">${tog('anToggle', 'an.on', anOn())}</div><p class="note">${esc(t('an.note'))}</p>
    ${anOn() ? `<h5 class="an-h">${esc(t('an.stuck'))}</h5>${body}<div class="seg"><button class="chip" data-act="anCopy">📋 ${esc(t('an.copy'))}</button><button class="chip" data-act="anSave">💾 ${esc(t('an.save'))}</button><button class="chip" data-act="anClear">🗑️ ${esc(t('an.clear'))}</button></div>` : ''}`;
}
function anExport() { return JSON.stringify({ app: 'quest-academy', counts: anLoad() }, null, 1); }
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'pwaReload': pwaApply(); return true;
    case 'pwaLater': PWA.snooze = true; pwaBarOff('updBar'); return true;
    case 'pwaInstall': pwaInstall(); return true;
    case 'pwaNot': DEV.inst.at = Date.now(); saveDev(); pwaBarOff('instBar'); return true;
    case 'pwaNever': DEV.inst.never = true; saveDev(); pwaBarOff('instBar'); return true;
    case 'anToggle': DEV.an = Object.assign({ on: false }, DEV.an); DEV.an.on = !DEV.an.on; saveDev(); if (UI.tab === 'parent') renderParent(); return true;
    case 'anClear': anSave({}); toast(t('an.cleared')); if (UI.tab === 'parent') renderParent(); return true;
    case 'anCopy': { const txt = anExport(); try { navigator.clipboard.writeText(txt).then(() => toast(t('an.copied')), () => toast(txt.slice(0, 80))); } catch (e) { toast(t('an.copied')); } return true; }
    case 'anSave': { try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([anExport()], { type: 'application/json' })); a.download = 'quest-academy-counts.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); } catch (e) { /* ignore */ } return true; }
  }
});
function v34PwaCardHTML() { return `<h4 class="an-h">📲 ${esc(t('pwa.card'))}</h4>${pwaCardHTML()}${anCardHTML()}`; }
Object.assign(window.__quest || (window.__quest = {}), { v34p: { PWA, nudgeDue, anBump, anLoad, anStuck, anOn, anExport, pwaIOS } });
