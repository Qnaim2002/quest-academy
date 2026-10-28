/* ================= v33/v34: the light show =================
   The painting code lives in src/content/vfx.js (a real ES module). It is fetched the first time a finisher plays,
   so it is not part of the first download. If it cannot be fetched (offline and not cached) the old emoji effects play alone. */
const VFX_LOAD = import.meta.glob('./content/vfx.js');
let VFX_MOD = null, VFX_P = null;
function vfxLoad() {
  if (VFX_MOD) return Promise.resolve(VFX_MOD);
  return VFX_P || (VFX_P = VFX_LOAD['./content/vfx.js']().then(m => (VFX_MOD = m.makeVFX($, fx, pick, document, window, requestAnimationFrame))).catch(e => { VFX_P = null; throw e; }));
}
const VFX = { get ids() { return VFX_MOD ? VFX_MOD.ids : []; }, get REC() { return VFX_MOD && VFX_MOD.REC; }, get scene() { return VFX_MOD && VFX_MOD.scene; }, get colors() { return VFX_MOD && VFX_MOD.colors; }, load: vfxLoad, run: (...a) => vfxLoad().then(v => v.run(...a)).catch(() => undefined) };
HOOK.around('runFinisher', (next, id, L, h, m, W, H) => {
  const base = next(id, L, h, m, W, H);
  if (S.sensory || (typeof reducedMotion === 'function' && reducedMotion()) || S.vfx === false) return base;
  return Promise.all([base, VFX.run(id, L, h, m, W, H)]).then(() => undefined);
});
/* load it quietly a few seconds after start, so the first finisher is not delayed */
setTimeout(() => { if (!S.sensory && S.vfx !== false) vfxLoad().catch(() => { }); }, 4000);
if (window.__quest) { window.__quest.v33 = Object.assign(window.__quest.v33 || {}, { vfx: VFX, finisherSeq }); }
