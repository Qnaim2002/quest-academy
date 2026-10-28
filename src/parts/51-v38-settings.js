/* ================= v38: "Settings" - a tab for the child (sound and voice, boss battles, reading comfort) =================
   Big picture switches and big buttons, no menus. It uses the same saved values as the Parent Portal (S.voice, S.sfx, S.music,
   S.vol, S.cine, S.talk, S.tele, S.why, S.dys, S.fs, S.sensory), so a grown-up can still change them there too. */
Object.assign(STR, {
  'nav.settings': ['Settings', 'Tetapan'], 'v38.title': ['My settings', 'Tetapan saya'],
  'v38.sound': ['Sound and voice', 'Bunyi dan suara'], 'v38.boss': ['Boss battle', 'Pertarungan bos'], 'v38.read': ['Easy reading', 'Bacaan mudah'],
  'v38.vauto': ['Read to me', 'Baca untuk saya'], 'v38.sfx': ['Sounds', 'Bunyi'], 'v38.music': ['Music', 'Muzik'],
  'v38.vstyle': ['Voice', 'Suara'], 'v38.vrate': ['Speed', 'Kelajuan'], 'v38.test': ['Hear it', 'Dengar'],
  'v38.cine': ['Big moves', 'Aksi besar'], 'v38.talk': ['Boss talks', 'Bos bercakap'], 'v38.tele': ['Boss warns me', 'Bos beri amaran'], 'v38.why': ['Tell me why', 'Beritahu sebab'],
  'v38.dys': ['Easy letters', 'Huruf mudah'], 'v38.sensory': ['Calm screen', 'Skrin tenang'], 'v38.size': ['Letter size', 'Saiz huruf'],
  'v38.on': ['ON', 'HIDUP'], 'v38.off': ['OFF', 'MATI'], 'v38.sample': ['The quick fox jumps.', 'Rubah cepat melompat.'],
  'v38.vol': ['Loudness', 'Kelantangan'],
  'v38.cineD': ['Camera zooms in the boss fight', 'Kamera zum dalam pertarungan bos'], 'v38.talkD': ['The boss says things', 'Bos bercakap semasa bertarung'],
  'v38.teleD': ['A sign shows before a big hit', 'Tanda muncul sebelum serangan besar'], 'v38.whyD': ['Hear why an answer is right', 'Dengar kenapa jawapan itu betul'],
  'v38.sensoryD': ['Less movement and no flashing', 'Kurang gerakan dan tiada kelipan']
});
const V38_SZ = [[.9, 'A', 'sz.s'], [1, 'A', 'sz.m'], [1.15, 'A', 'sz.l'], [1.3, 'A', 'sz.xl']];
function v38Row(act, v, em, key, on, desc) {
  return `<button class="v38-row ${on ? 'on' : ''}" data-act="v38T" data-v="${v}" aria-pressed="${on}"><i aria-hidden="true">${em}</i><span>${t('v38.' + key)}${desc ? `<small>${t('v38.' + key + 'D')}</small>` : ''}</span><b>${t(on ? 'v38.on' : 'v38.off')}</b></button>`;
}
function renderSettings() {
  const el = $('#tab-settings'); if (!el) return;
  const chip = (act, v, label, cur, st = '') => `<button class="v38-chip" data-act="${act}" data-v="${v}" aria-pressed="${cur === v}" ${st ? `style="${st}"` : ''}>${label}</button>`;
  const vol = k => `<label class="v38-vol"><span aria-hidden="true">${k === 'music' ? '🎵' : k === 'sfx' ? '🔔' : '🗣️'}</span><input type="range" min="0" max="100" step="5" value="${volOf(k)}" data-vol="${k}" aria-label="${esc(t('vol.' + k))}"></label>`;
  setHTML(el, `<div class="wrap v38"><h1 class="v37-h">${t('v38.title')}</h1>
    <section class="v38-card" style="--c:#2B63D9"><h2><i aria-hidden="true">🔊</i>${t('v38.sound')}</h2>
      ${v38Row('', 'vauto', '📣', 'vauto', !!S.voice.auto)}${v38Row('', 'sfx', '🔔', 'sfx', !!(S.sfx && !S.sensory))}${v38Row('', 'music', '🎵', 'music', musicOn())}
      <div class="v38-vols"><h3>${t('v38.vol')}</h3>${vol('voice')}${vol('sfx')}${vol('music')}</div>
      <h3>${t('v38.vstyle')}</h3><div class="v38-chips">${[['gentle', t('vs.gentle')], ['warm', t('vs.warm')], ['bright', t('vs.bright')]].map(([v, l]) => chip('v38Vs', v, l, S.voice.style)).join('')}</div>
      <h3>${t('v38.vrate')}</h3><div class="v38-chips">${[[.7, t('rt.soft')], [.82, t('rt.calm')], [1, t('rt.norm')]].map(([v, l]) => chip('v38Vr', v, l, S.voice.rate)).join('')}<button class="v38-chip test" data-act="v38Test">🔊 ${t('v38.test')}</button></div></section>
    <section class="v38-card" style="--c:#C9304F"><h2><i aria-hidden="true">⚔️</i>${t('v38.boss')}</h2>
      ${v38Row('', 'cine', '🎥', 'cine', S.cine !== false, 1)}${v38Row('', 'talk', '💬', 'talk', S.talk !== false, 1)}${v38Row('', 'tele', '⚠️', 'tele', S.tele !== false, 1)}${v38Row('', 'why', '💡', 'why', S.why !== false, 1)}</section>
    <section class="v38-card" style="--c:#0F8F7A"><h2><i aria-hidden="true">📖</i>${t('v38.read')}</h2>
      ${v38Row('', 'dys', '🔤', 'dys', !!S.dys)}${v38Row('', 'sensory', '🌿', 'sensory', !!S.sensory, 1)}
      <h3>${t('v38.size')}</h3><div class="v38-chips">${V38_SZ.map(([v, l], i) => chip('v38Fs', v, l, S.fs, `font-size:${[1, 1.25, 1.5, 1.8][i]}rem`)).join('')}</div>
      <p class="v38-sample">${t('v38.sample')}</p></section></div>`);
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-act^="v38"]'); if (!b) return;
  const a = b.dataset.act, v = b.dataset.v;
  if (a === 'v38T') {
    if (v === 'vauto') { S.voice.auto = !S.voice.auto; if (S.voice.auto) speak(t('pp.autoOn')); }
    else if (v === 'sfx') { S.sfx = !S.sfx; if (S.sfx) sfx.ok(); }
    else if (v === 'music') { S.music = S.music === false; syncMusic(); }
    else if (v === 'dys') { S.dys = !S.dys; applyTheme(); }
    else if (v === 'sensory') { S.sensory = !S.sensory; applyTheme(); updateTimer(); syncMusic(); }
    else if (['cine', 'talk', 'tele', 'why'].includes(v)) S[v] = S[v] === false;
  } else if (a === 'v38Vs') { S.voice.style = v; speak(t('pp.testSay')); }
  else if (a === 'v38Vr') { S.voice.rate = +v; speak(t('pp.testSay')); }
  else if (a === 'v38Fs') { S.fs = +v; applyTheme(); }
  else if (a === 'v38Test') { speak(t('pp.testSay')); return; }
  save(); renderSettings();
});
HOOK.on('showTab', () => { if (UI.tab === 'settings') renderSettings(); });
