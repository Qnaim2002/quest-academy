/* ================= v35: thirteen new question formats =================
   The widgets and the question banks live in content/formats.js (+ formats-a/b/c.js), a lazy chunk that is fetched
   in the background a moment after the game starts, so the first download stays small. Until it arrives the old
   formats are used. QT.pickFor (07c) asks FM.mod.weights() what may be asked and FM.mod.make() for the question.
   Share of non-multiple-choice questions: age 4 = 60%, age 5 = 58%, age 6 = 55%, age 7 = 52% (bosses too, with short forms). */
const FM_LOAD = import.meta.glob('./content/formats.js');
const FM = { mod: null, p: null };
function fmLoad() {
  return FM.p || (FM.p = FM_LOAD['./content/formats.js']().then(m => {
    FM.mod = m.makeFormats({
      t, L, pick, shuffle, rnd, esc, STR, sfx, QT, HOOK, GLYPHS, traceScore, mountTrace, voice, auCtx, sfxOn, speakSeq,
      S: () => S, B: () => B, get STATES() { return STATES; }
    });
    return FM.mod;
  }).catch(e => { FM.p = null; throw e; }));
}
HOOK.before('startBattle', () => { if (!FM.mod) fmLoad().catch(() => { }); });
setTimeout(() => { fmLoad().catch(() => { }); }, 1500);
Object.assign(window.__quest || (window.__quest = {}), { v35: { FM, fmLoad, QT, GLYPHS } });
