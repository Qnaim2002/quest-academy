/* ================= v24: screen-time limits for each child =================
   Every child keeps their own daily limit in their own save: S.timerMin for school days (Monday to Friday)
   and S.timerWe for weekends (null = the same as school days). The Parent Portal shows one row per child with
   the minutes played today and the two limits, so grown-ups can set every child's limit without switching
   player. The running clock (S.session) is per child too, and starts again each day. */
const LIMIT_OPTS = [0, 10, 15, 20, 30, 45, 60, 90, 120];
const isWeekend = (d = new Date()) => d.getDay() === 0 || d.getDay() === 6;
function limitMin(o = S, d = new Date()) {
  const we = isWeekend(d) && o.timerWe !== null && o.timerWe !== undefined;
  return +(we ? o.timerWe : o.timerMin) || 0;
}
/* another child's save (or the live one for the child playing now) */
function kidPatch(id, fn) {
  if (id === DEV.active) { fn(S); save(); return; }
  try { const k = profKey(id), o = JSON.parse(localStorage.getItem(k) || (id === 'p1' ? localStorage.getItem(OLD_KEY) : null) || '{}') || {}; fn(o); localStorage.setItem(k, JSON.stringify(o)); } catch (e) { storageOK = false; }
}
function kidPlayedToday(o) { const s = o.session || {}; return s.day === todayKey() ? Math.round((s.elapsed || 0) / 60000) : 0; }
function screenTimeHTML() {
  const opt = (sel, v0, wk) => `<select data-st="${sel}" aria-label="${esc(t(wk ? 'scr.we' : 'scr.wd'))}">${wk ? `<option value="same" ${v0 === null || v0 === undefined ? 'selected' : ''}>${t('scr.same')}</option>` : ''}${LIMIT_OPTS.map(n => `<option value="${n}" ${v0 !== null && v0 !== undefined && +v0 === n ? 'selected' : ''}>${n ? t('pp.min', { n }) : t('off')}</option>`).join('')}</select>`;
  const rows = DEV.profiles.map((p, i) => {
    const o = kidSave(p.id), lim = limitMin(o), used = kidPlayedToday(o);
    return `<div class="strow ${p.id === DEV.active ? 'on' : ''}"><b class="st-n">${esc(kidName(p, i))}</b>
      <span class="st-used"><span class="sp-bar"><i style="width:${lim ? Math.min(100, Math.round(used / lim * 100)) : 0}%"></i></span><small>${t('scr.today', { n: used })}${lim ? ' / ' + t('pp.min', { n: lim }) : ''}</small></span>
      <label><span>${t('scr.wd')}</span>${opt(p.id + ':wd', o.timerMin || 0, false)}</label><label><span>${t('scr.we')}</span>${opt(p.id + ':we', o.timerWe, true)}</label></div>`;
  }).join('');
  return `<h3 class="sub-h" style="margin-top:14px">${t('scr.title')}</h3><div class="strows">${rows}</div><p class="sub" style="margin:8px 0 0">${t('scr.note')}</p>`;
}
document.addEventListener('change', e => {
  const s = e.target.closest && e.target.closest('select[data-st]'); if (!s) return;
  if (!(gate.unlocked && UI.tab === 'parent')) return;
  const [id, which] = s.dataset.st.split(':'), v = s.value;
  kidPatch(id, o => { if (which === 'wd') o.timerMin = +v; else o.timerWe = v === 'same' ? null : +v; if (o.session) o.session.extra = 0; });
  gate.t = Date.now(); warned = false; checkTimer(); renderParent(); toast(t('scr.saved'));
});
