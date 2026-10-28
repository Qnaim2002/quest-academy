/* ================= v22: star goals, zone landmarks, hero on the path =================
   STAR GOALS. Each level has three stars, and each star is one goal the child can see and aim for:
     🎯 first try   at least 80% of the questions right on the first try
     ⚡ speed       answers given in good time (no time-outs, and quicker than the answer timer on average)
     💡 no hints    won without tapping "More help" and without Hoot having to help the hero up
   Goals add up across replays (S.goals[key] bitmask), so a child can earn ⚡ on one try and 💡 on the next.
   Winning always clears the level (S.clear) and opens the next one, even with no goal yet.
   LANDMARKS. Every zone header is a little pixel scene drawn by the battle-background generator (castle,
   lighthouse, forest, city…), with the zone's own landmark emoji.
   HERO ON THE PATH. The hero stands on the next level to play; after a first clear the hero walks there. */
const GOALS = [[1, '🎯', 'gl.first'], [2, '⚡', 'gl.speed'], [4, '🛡️', 'gl.nohint']];   // v24: help is gone from battle, so the third star is "no knock-outs"
const goalsAt = (subj, n) => ((S.goals || {})[starKey(subj, n)]) || 0;
const bits3 = b => (b & 1) + (b >> 1 & 1) + (b >> 2 & 1);
const clearAt = (subj, n) => !!((S.clear || {})[starKey(subj, n)]) || starsAt(subj, n) > 0;
/* old saves: stars 1-3 became goals in order, and every starred level counts as cleared */
(function migrateGoals() {
  if (S.goalsV) return; S.goals = S.goals || {}; S.clear = S.clear || {};
  Object.entries(S.stars || {}).forEach(([k, n]) => { if (n > 0) { S.clear[k] = 1; S.goals[k] = (S.goals[k] || 0) | ((1 << Math.min(3, n)) - 1); } });
  S.goalsV = 1;
})();
function goalsHTML(subj, n, lo) {
  const g = goalsAt(subj, n);
  return `<span class="goals" aria-hidden="true">${GOALS.map(([b, ic]) => `<i class="${g & b ? 'on' : ''} ${lo && clearAt(subj, n) && !(g & b) ? 'miss' : ''}">${ic}</i>`).join('')}</span>`;
}
function goalAria(subj, n) { const g = goalsAt(subj, n); return GOALS.map(([b, , k]) => `${t(k)}: ${t(g & b ? 'gl.got' : 'gl.notyet')}`).join(', '); }
/* what this battle earned */
function battleGoals() {
  const ratio = B.asked ? B.first / B.asked : 0;
  const fast = !(B.timeouts > 0) && (B.tUsed || 0) <= (B.tAllow || 0);
  const noHelp = !(B.hints > 0) && !(B.ko > 0);
  return (ratio >= .8 ? 1 : 0) | (fast ? 2 : 0) | (noHelp ? 4 : 0);
}
/* zone landmark scene */
function zoneSceneStyle(z, big) { try { return `--zbg:url(${PX.bg(z, S.band, !!big)})`; } catch (e) { return ''; } }
/* hero marker on the next node; walks there after a clear */
function placeHeroMarker() {
  const grid = $('#mapView .zone.zopen .zgrid'); if (!grid) return;
  const s = UI.subj, nx = nextLevelN(s), node = nx && grid.querySelector(`.lnode[data-v="${s}:${nx}"]`); if (!node) return;
  const mk = document.createElement('div'); mk.className = 'heromark'; mk.setAttribute('aria-hidden', 'true'); mk.innerHTML = heroSVG(S.equipped); grid.appendChild(mk);
  const at = el => { const g = grid.getBoundingClientRect(), r = el.querySelector('.orb').getBoundingClientRect(); return { x: r.left - g.left + r.width / 2, y: r.top - g.top }; };
  const to = at(node); mk.style.left = to.x + 'px'; mk.style.top = to.y + 'px';
  const w = UI.walk; if ($('.overlay.on')) { if (w) mk.style.visibility = 'hidden'; return; }   // wait until the victory card closes
  UI.walk = null;
  const from = w && w.subj === s && grid.querySelector(`.lnode[data-v="${s}:${w.n}"]`);
  if (from && !S.sensory) {
    const a = at(from), dx = a.x - to.x, dy = a.y - to.y, steps = [];
    for (let i = 0; i <= 8; i++) { const f = i / 8; steps.push({ transform: `translate(${dx * (1 - f)}px,${dy * (1 - f) - Math.abs(Math.sin(f * Math.PI * 3)) * 12}px) translate(-50%,-100%)` }); }
    setTimeout(() => { mk.animate(steps, { duration: 1300, easing: 'linear', fill: 'backwards' }); sfx.whoosh && setTimeout(() => sfx.pop(), 1250); }, 350);
  }
}
