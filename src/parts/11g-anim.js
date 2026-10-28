/* ================= v24: livelier characters =================
   The pixel sheets step through 4 idle frames; on top of that every character now has a smooth, eased body
   motion that suits it (CSS, sub-pixel, never fighting the frame steps):
     hero    breathes (chest rises, a soft settle)              float   drifts up and down with a slow tilt
     heavy   sways its weight from foot to foot                  bounce  squashes and springs like jelly
     sway    shifts its weight and leans a little
   Hits get a short squash-and-jolt, attacks leave a quick motion trail, and new monsters land with dust.
   Calm sensory mode and reduced-motion turn all of this off. */
const IDLE_KIND = {
  float: ['wraith', 'dryad', 'seraph', 'fire', 'squid', 'bat', 'thunderbird', 'bee', 'lantern', 'crystal', 'puffer', 'wau', 'sheep', 'jelly', 'moth', 'rocket', 'rafflesia', 'boss1', 'boss4', 'boss5', 'boss6'],
  heavy: ['golem', 'troll', 'cyclops', 'owlbear', 'yeti', 'rex', 'treant', 'automaton', 'gargoyle', 'crab', 'turtle', 'mole', 'croc', 'tapir', 'beetle', 'boss0', 'boss2', 'boss3', 'boss7', 'boss8', 'boss9'],
  bounce: ['slime', 'cupcake', 'durian', 'frog', 'mushroom', 'mimic', 'cactus', 'alien', 'snowman', 'teapot', 'dumpling', 'mango', 'chili', 'icecream', 'luckycat', 'liondance', 'pineapple', 'cococrab', 'moonrabbit']
};
function idleKind(m) {
  const k = m.big ? 'boss' + m.arch : (m.sp || MON2.BODY[m.b] || 'slime');
  return Object.keys(IDLE_KIND).find(x => IDLE_KIND[x].includes(k)) || 'sway';
}
function setIdle(lv) {
  const m = $('#monSprite'), h = $('#heroSprite'); if (!m || !h) return;
  m.dataset.idle = idleKind(lv.mon); h.dataset.idle = 'hero';
  /* the monster lands with a little dust when it arrives */
  if (!S.sensory) setTimeout(() => { if (B.lv === lv && m.isConnected) { const p = fx.pos(m); fx.dust && fx.dust(p.x, p.y + p.h * .42); } }, 560);
}
