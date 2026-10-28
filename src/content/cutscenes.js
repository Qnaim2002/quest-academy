/* v29: the cutscene scripts of the four age sagas (one file per age band). Format: src/parts/25-v29-cutscenes.js
   v31: each age's script is its own chunk, loaded the first time that age's story is needed (or quietly in the
   background), like the lesson text. CUTS[band] is filled in by loadCuts(band).
   v32: each age also has an "extras" file (cutscenes/x1-x4.js: villain arc, mini-boss scenes, choices, cliffhangers,
   words in another language) and all ages share cutscenes/shared.js (subject beats, boss voices, rival and pet
   evolution scenes). XTRA[band] and SHARED are filled in by loadCuts(band) together with the script. */
const LOAD = { 1: () => import('./cutscenes/b1.js'), 2: () => import('./cutscenes/b2.js'), 3: () => import('./cutscenes/b3.js'), 4: () => import('./cutscenes/b4.js') };
const XLOAD = { 1: () => import('./cutscenes/x1.js'), 2: () => import('./cutscenes/x2.js'), 3: () => import('./cutscenes/x3.js'), 4: () => import('./cutscenes/x4.js') };
export const CUTS = {};
export const XTRA = {};
export const SHARED = {};
const P = {};
export function loadCuts(band) {
  if (CUTS[band]) return Promise.resolve(CUTS[band]);
  if (!LOAD[band]) return Promise.resolve(null);
  return P[band] || (P[band] = Promise.all([
    LOAD[band](),
    XLOAD[band]().then(m => (XTRA[band] = m.default)).catch(() => (XTRA[band] = {})),   // the extras are optional: without them the older story still plays
    SHARED.ready ? 0 : import('./cutscenes/shared.js').then(m => { Object.assign(SHARED, m.default, { ready: true }); }).catch(() => { SHARED.ready = true; })
  ]).then(r => (CUTS[band] = r[0].default)).catch(e => { delete P[band]; throw e; }));
}
