/* ================= v34: save schema and migrations =================
   Every save carries a number, S.v (the "schema"). When the game starts, or when a backup file is imported, the save
   goes through migrateSave(): each step below turns version N into version N+1, in order, until it reaches
   SAVE_SCHEMA. Steps only ever touch a plain copy of the save (never the live game), they can be run twice without
   harm, and a step that fails is skipped (the save is kept as it was). A save from a NEWER game is left alone.
   To change the shape of a save later: raise SAVE_SCHEMA, add one step, and add a test in tests/v34.test.mjs. */
const SAVE_SCHEMA = 5;
const SAVE_STEPS = {
  /* a save with no number, or an old one: the clean-ups that used to be loose "delete S.xxx" lines in load() */
  0(o) { ['rematch', 'rmMode', 'daily', 'dailyGoal'].forEach(k => { delete o[k]; }); o.v = 4; },
  1(o) { SAVE_STEPS[0](o); },
  2(o) { SAVE_STEPS[0](o); },
  3(o) { SAVE_STEPS[0](o); },
  /* v34: the placement quiz, harder/easier questions, hero looks, the pet friend, celebration pacing, local counts */
  4(o) {
    const played = !!o.welcomed || (o.battles | 0) > 0 || (o.defeated | 0) > 0;
    if (!o.place || typeof o.place !== 'object' || Array.isArray(o.place)) o.place = {};
    if (typeof o.placed !== 'boolean') o.placed = played;   // a child who already plays is not asked to take the first-launch quiz
    if (typeof o.adapt !== 'boolean') o.adapt = true;
    if (!o.look || typeof o.look !== 'object') o.look = {};
    if (!o.celeb || typeof o.celeb !== 'object') o.celeb = { seen: {}, mode: 'ask' };
    if (!o.kbat || typeof o.kbat !== 'object') o.kbat = {};
    if (!o.buddy || typeof o.buddy !== 'object') o.buddy = { on: true };
    if (!o.inst || typeof o.inst !== 'object') o.inst = {};
    o.v = 5;
  }
};
function migrateSave(src) {
  const info = { from: 0, to: 0, steps: 0, newer: false, failed: [] };
  let o; try { o = JSON.parse(JSON.stringify(src || {})); } catch (e) { o = {}; }
  if (!o || typeof o !== 'object' || Array.isArray(o)) o = {};
  let v = Number.isFinite(+o.v) ? Math.floor(+o.v) : 0; if (v < 0) v = 0;
  info.from = v;
  if (v > SAVE_SCHEMA) { info.newer = true; info.to = v; return { save: o, info }; }   // saved by a newer game: do not touch it
  while (v < SAVE_SCHEMA) {
    const step = SAVE_STEPS[v], before = JSON.stringify(o);
    try { if (typeof step === 'function') step(o); else o.v = v + 1; } catch (e) { info.failed.push(v); o = JSON.parse(before); o.v = v + 1; }
    const nv = Number.isFinite(+o.v) ? Math.floor(+o.v) : v + 1; v = nv > v ? nv : v + 1; o.v = v; info.steps++;
  }
  info.to = v;
  return { save: o, info };
}
