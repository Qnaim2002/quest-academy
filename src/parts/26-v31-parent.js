/* ================= v31: parent code recovery, problem log, vibration =================
   RECOVERY. "Forgot the code?" used to erase every child's progress. A grown-up can now save a recovery question
   in the Parent Portal. The answer is stored like the code: a one-way PBKDF2 hash with its own salt, on this device
   only. The right answer opens "pick a new code"; nothing is erased. Three wrong answers in a row lock the question
   for a minute (longer each time). Erasing everything is still there as a last resort.
   PROBLEM LOG. The crash log (00b) is shown in the Privacy card with Export and Clear buttons.
   VIBRATION. A short buzz for a right answer, a double buzz for a wrong one, a long pattern for a finisher and a light
   tick when a story scene changes (a stronger one for action scenes). Only on devices that support it; off in calm
   mode and with the Parent Portal switch. */

/* ---------------- recovery question ---------------- */
const REC_QS = ['pet', 'town', 'school', 'friend', 'custom'];
const recNorm = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9À-￿]+/g, ' ').replace(/\s+/g, ' ').trim();
const recQuestion = r => !r ? '' : r.q === 'custom' ? (r.txt || '') : t('rc.q.' + r.q);
async function recHash(ans, salt, n) { return hasSubtle() ? pinHash2(ans, salt, n || PIN_ITER) : pinHash(ans, salt); }
async function recSave(q, txt, ans) {
  const a = recNorm(ans); if (a.length < 2 || !REC_QS.includes(q) || (q === 'custom' && !String(txt || '').trim())) return false;
  const s = hasSubtle() ? hex(crypto.getRandomValues(new Uint8Array(16))) : Array.from({ length: 16 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
  DEV.rec = { q, txt: q === 'custom' ? String(txt).replace(/[<>]/g, '').trim().slice(0, 80) : '', v: hasSubtle() ? 2 : 1, n: PIN_ITER, s, h: await recHash(a, s, PIN_ITER), at: Date.now() };
  DEV.recUntil = 0; saveDev(); return true;
}
async function recCheck(ans) {
  const r = DEV.rec; if (!r) return false;
  if (r.v === 2 && !hasSubtle()) return false;
  return (await recHash(recNorm(ans), r.s, r.n)) === r.h;
}
async function recTry(typed) {
  if (gate.busy || (DEV.recUntil || 0) > Date.now()) return;
  const i = typed === undefined ? $('#recAns') : null, ans = typed !== undefined ? String(typed) : i ? i.value : '';
  if (!recNorm(ans)) { gate.msg = t('rc.empty'); renderGate(); return; }
  gate.busy = true; let ok = false; try { ok = await recCheck(ans); } finally { gate.busy = false; }
  if (ok) { gate.recFails = 0; gate.mode = 'reset1'; gate.buf = ''; gate.first = ''; gate.msg = t('rc.right'); sfx.ok(); renderGate(); return; }
  gate.recFails = (gate.recFails || 0) + 1; gate.shake = true; gate.msg = t('rc.wrong');
  if (gate.recFails % 3 === 0) { DEV.recUntil = Date.now() + 60000 * (gate.recFails / 3); saveDev(); setTimeout(() => { if (gate.mode === 'recover' && UI.tab === 'parent') renderGate(); }, 60000 * (gate.recFails / 3) + 200); }
  renderGate(); setTimeout(() => { gate.shake = false; }, 600);
}
function recCardHTML() {
  const r = DEV.rec, pick = UI.recQ || (r ? r.q : 'pet');
  const opts = REC_QS.map(q => `<option value="${q}" ${pick === q ? 'selected' : ''}>${esc(t('rc.q.' + q))}</option>`).join('');
  const form = `<div class="rc-form"><label class="rc-l"><span>${t('rc.pick')}</span><select id="recQ" class="rc-sel">${opts}</select></label>
    ${pick === 'custom' ? `<label class="rc-l"><span>${t('rc.own')}</span><input id="recTxt" class="kid-name" maxlength="80" autocomplete="off" value="${esc(r && r.q === 'custom' ? r.txt : '')}"></label>` : ''}
    <label class="rc-l"><span>${t('rc.answer')}</span><input id="recNew" class="kid-name" maxlength="60" autocomplete="off" autocapitalize="off" spellcheck="false"></label>
    <div class="seg"><button class="btn" data-act="recSave">💾 ${t('rc.save')}</button>${r ? `<button class="btn ghost" data-act="recEdit" data-v="0">${t('pin.cancel')}</button>` : ''}</div><p class="sub rc-tip">${t('rc.tip')}</p></div>`;
  const body = r && !UI.recEdit
    ? `<p class="rc-on">✔ ${t('rc.isSet')} <b>${esc(recQuestion(r))}</b></p><div class="seg"><button class="btn ghost" data-act="recEdit" data-v="1">✏️ ${t('rc.change')}</button><button class="btn ghost" data-act="recDel">${UI.recDelArmed ? t('rc.del2') : t('rc.del')}</button></div>`
    : form;
  return `<div class="card rc-card" id="recCard"><h3 style="margin:0 0 6px">🛟 ${t('rc.cardTitle')}</h3><p class="sub" style="margin:0 0 10px">${t('rc.cardSub')}</p>${body}</div>`;
}

/* ---------------- problem log ---------------- */
function crashCardHTML() {
  const n = CRASH.size(), list = CRASH.list().slice(-3).reverse();
  const rows = list.map(x => `<li><b>${esc(x.msg.slice(0, 90))}</b><small>${esc(new Date(x.last).toLocaleString())}${x.n > 1 ? ' · ×' + x.n : ''}${x.where ? ' · ' + esc(x.where) : ''}</small></li>`).join('');
  return `<div class="card crash-card"><h3 style="margin:0 0 6px">🩺 ${t('cr.title')}</h3><p class="sub" style="margin:0 0 8px">${t('cr.sub')}</p>
    <p class="cr-n">${n ? esc(t('cr.count', { n })) : '✔ ' + t('cr.none')}</p>${rows ? `<ul class="cr-list">${rows}</ul>` : ''}
    ${n ? `<div class="seg"><button class="btn ghost" data-act="crashExport">⬇ ${t('cr.export')}</button><button class="btn ghost" data-act="crashClear">🗑 ${t('cr.clear')}</button></div>` : ''}</div>`;
}

/* ---------------- vibration ---------------- */
const HAPTIC = { right: 22, wrong: [60, 50, 60], finisher: [30, 40, 30, 40, 160], story: 10, action: [24, 30, 60], boss: [50, 40, 120] };
const hapticOn = () => S.haptics !== false && !S.sensory && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
function haptic(kind) { if (!hapticOn()) return false; try { return navigator.vibrate(HAPTIC[kind] || 20); } catch (e) { return false; } }
HOOK.on('answer:right', () => haptic('right'));
HOOK.on('answer:wrong', () => haptic('wrong'));
HOOK.before('finisherSeq', () => haptic('finisher'));
const ACTION_SHOTS = new Set(['clash', 'foe', 'reveal', 'dark', 'btitle']);
HOOK.on('comic:shot', c => {
  if (!c) return;
  const kind = c.i > 0 ? (cineKindsOf(c.z, c.mode) || [])[c.i - 1] : (c.mode === 'boss' ? 'btitle' : '');
  haptic(c.i === 0 && c.mode === 'boss' ? 'boss' : ACTION_SHOTS.has(kind) ? 'action' : 'story');
});

/* ---------------- the Parent Portal ---------------- */
HOOK.on('renderParent', () => {
  if (!gate.unlocked) return;
  const pc = $('#tab-parent [data-act="pinChange"]'), priv = pc && pc.closest ? pc.closest('.card') : null;
  if (priv && priv.insertAdjacentHTML) { priv.insertAdjacentHTML('afterend', crashCardHTML()); priv.insertAdjacentHTML('afterend', recCardHTML()); }
  if (!DEV.rec) { const title = $('#tab-parent .wrap > .sub'); if (title && title.insertAdjacentHTML) title.insertAdjacentHTML('afterend', `<p class="note rc-nudge">🛟 ${t('rc.nudge')} <button class="linkbtn" data-act="recGo">${t('rc.nudgeGo')}</button></p>`); }
  const sfxB = $('#tab-parent [data-act="sfx"]');
  if (sfxB && sfxB.insertAdjacentHTML && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') sfxB.insertAdjacentHTML('afterend', tog('haptics', 'pp31.haptics', S.haptics !== false && !S.sensory));
});
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'recCheck': recTry(); return true;
    case 'recBack': gate.mode = 'enter'; gate.msg = ''; renderGate(); return true;
    case 'recErase': if (gate.forgot) eraseAll(true); else { gate.forgot = true; renderGate(); const d = $('#tab-parent .rc-erase'); if (d) d.open = true; } return true;
    case 'recGo': { UI.recEdit = true; renderParent(); const c = $('#recCard'); if (c && c.scrollIntoView) c.scrollIntoView({ block: 'center', behavior: S.sensory ? 'auto' : 'smooth' }); return true; }
    case 'recEdit': UI.recEdit = v === '1'; UI.recQ = null; renderParent(); return true;
    case 'recSave': {
      const q = ($('#recQ') || {}).value || 'pet', txt = ($('#recTxt') || {}).value || '', ans = ($('#recNew') || {}).value || '';
      gate.t = Date.now();
      recSave(q, txt, ans).then(ok => { if (!ok) { toast(t(q === 'custom' && !txt.trim() ? 'rc.needQ' : 'rc.short')); return; } UI.recEdit = false; UI.recQ = null; toast(t('rc.saved')); renderParent(); });
      return true;
    }
    case 'recDel': if (UI.recDelArmed) { DEV.rec = null; saveDev(); UI.recDelArmed = false; toast(t('rc.deleted')); renderParent(); } else { UI.recDelArmed = true; renderParent(); setTimeout(() => { if (UI.recDelArmed) { UI.recDelArmed = false; if (UI.tab === 'parent' && gate.unlocked) renderParent(); } }, 4000); } return true;
    case 'crashExport': CRASH.exportFile(); return true;
    case 'crashClear': CRASH.clear(); toast(t('cr.cleared')); renderParent(); return true;
    case 'haptics': S.haptics = S.haptics === false; save(); renderParent(); if (S.haptics !== false) haptic('right'); return true;
  }
  return undefined;
});
document.addEventListener('change', e => { if (e.target && e.target.id === 'recQ') { UI.recQ = e.target.value; UI.recEdit = true; gate.t = Date.now(); renderParent(); const s = $('#recQ'); if (s && s.focus) s.focus(); } });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target && e.target.id === 'recAns') { e.preventDefault(); recTry(); } });

Object.assign(STR, {
  'rc.title': ['Reset the parent code', 'Tetapkan semula kod ibu bapa'], 'rc.sub': ['Answer your recovery question to choose a new code. Nothing is erased.', 'Jawab soalan pemulihan anda untuk memilih kod baharu. Tiada apa yang dipadam.'],
  'rc.answer': ['Your answer', 'Jawapan anda'], 'rc.check': ['Check answer', 'Semak jawapan'], 'rc.empty': ['Type your answer first.', 'Taip jawapan anda dahulu.'],
  'rc.wrong': ['That answer is not right. Try again.', 'Jawapan itu tidak betul. Cuba lagi.'], 'rc.right': ['Correct! Now choose a new 6-digit code.', 'Betul! Sekarang pilih kod baharu 6 digit.'],
  'rc.eraseTxt': ['The last resort: erase every child\'s progress and the code on this device.', 'Pilihan terakhir: padam kemajuan semua kanak-kanak dan kod pada peranti ini.'],
  'rc.done': ['New code saved. All progress is still here.', 'Kod baharu disimpan. Semua kemajuan masih ada.'], 'rc.still': ['Still stuck?', 'Masih tidak dapat?'],
  'rc.q.pet': ['What was the name of your first pet?', 'Apakah nama haiwan peliharaan pertama anda?'], 'rc.q.town': ['In which town were you born?', 'Di bandar manakah anda dilahirkan?'],
  'rc.q.school': ['What was the name of your primary school?', 'Apakah nama sekolah rendah anda?'], 'rc.q.friend': ['What was the name of your best friend as a child?', 'Siapakah nama kawan baik anda semasa kecil?'],
  'rc.q.custom': ['My own question…', 'Soalan saya sendiri…'], 'rc.pick': ['Question', 'Soalan'], 'rc.own': ['Write your question', 'Tulis soalan anda'],
  'rc.save': ['Save recovery question', 'Simpan soalan pemulihan'], 'rc.tip': ['Pick an answer a child cannot guess. Capital letters and spaces do not matter.', 'Pilih jawapan yang tidak dapat diteka oleh kanak-kanak. Huruf besar dan jarak tidak penting.'],
  'rc.isSet': ['Recovery question is set:', 'Soalan pemulihan sudah ditetapkan:'], 'rc.change': ['Change', 'Tukar'], 'rc.del': ['Remove', 'Buang'], 'rc.del2': ['Tap again to remove', 'Sentuh sekali lagi untuk membuang'],
  'rc.cardTitle': ['Recovery question', 'Soalan pemulihan'], 'rc.cardSub': ['If you forget the parent code, answering this question lets you choose a new one without erasing anything. The answer stays on this device as a one-way hash.', 'Jika anda terlupa kod ibu bapa, menjawab soalan ini membolehkan anda memilih kod baharu tanpa memadam apa-apa. Jawapan kekal pada peranti ini sebagai cincangan sehala.'],
  'rc.saved': ['Recovery question saved.', 'Soalan pemulihan disimpan.'], 'rc.deleted': ['Recovery question removed.', 'Soalan pemulihan dibuang.'],
  'rc.short': ['Please type an answer (at least 2 letters).', 'Sila taip jawapan (sekurang-kurangnya 2 huruf).'], 'rc.needQ': ['Please write your question.', 'Sila tulis soalan anda.'],
  'rc.nudge': ['Set a recovery question, so a forgotten code never erases progress.', 'Tetapkan soalan pemulihan supaya kod yang terlupa tidak memadam kemajuan.'], 'rc.nudgeGo': ['Set it now', 'Tetapkan sekarang'],
  'cr.title': ['Problem log', 'Log masalah'], 'cr.sub': ['If the game hits an error, a short note is kept on this device. Nothing is sent anywhere. Export it to share with whoever helps you with the game.', 'Jika permainan mengalami ralat, nota ringkas disimpan pada peranti ini. Tiada apa yang dihantar. Eksport untuk dikongsi dengan orang yang membantu anda.'],
  'cr.count': ['{n} problem(s) saved', '{n} masalah disimpan'], 'cr.none': ['No problems found.', 'Tiada masalah ditemui.'],
  'cr.export': ['Export log', 'Eksport log'], 'cr.clear': ['Clear log', 'Kosongkan log'], 'cr.cleared': ['Problem log cleared.', 'Log masalah dikosongkan.'],
  'pp31.haptics': ['Vibration: {s}', 'Getaran: {s}'], 'adv.age': ['Age', 'Umur']
});
STR['pin.forgotTxt'] = ['No recovery question was set, so the only way to reset the code is to erase all progress on this device. Next time, set a recovery question in the Parent Portal.', 'Tiada soalan pemulihan ditetapkan, jadi satu-satunya cara menetapkan semula kod ialah memadam semua kemajuan pada peranti ini. Lain kali, tetapkan soalan pemulihan dalam Portal Ibu Bapa.'];
