/* ================= v35: damage depends on how you answered =================
   Before, every right answer hit the same. Now the hit is worked out from three things the game already knew:
     speed        a right answer while the thinking bar is still above two thirds hits 25% harder, above one third 10%
                  harder (only when the thinking bar is on: with "no time limit" or calm mode nobody is hurried)
     first try    right the first time +10%, right on the second try -20%, on the third or later -35%
     streak       a quick first-try answer charges the super attack twice, and a super attack from a long streak
                  gets +3% per answer in the streak (up to +36%)
   The total is kept between x0.5 and x1.7. A small label shows the bonus (⚡ Quick!, 🎯 First try!, 🔥 Streak!). */
const DQ = { MIN: .5, MAX: 1.7 };
function answerQuality(q) {
  const timer = !!B.tmax && !S.sensory, left = timer ? Math.max(0, Math.min(1, B.tleft / B.tmax)) : 0;
  const first = B.wrong === 0, quick = timer && left >= .66, ok = timer && left >= .33;
  let mul = first ? 1.1 : B.wrong === 1 ? .8 : .65;
  if (timer) mul *= quick ? 1.25 : ok ? 1.1 : 1;
  const extra = first && quick ? 1 : 0, charge = Math.min(3, (B.charge || 0) + extra + (first ? 1 : 0)), combo = (B.combo || 0) + 1;
  const fin = combo > 0 && combo % FIN_EVERY === 0, crit = !fin && charge >= 3;
  if (crit) mul *= 1 + Math.min(combo, 12) * .03;
  mul = Math.max(DQ.MIN, Math.min(DQ.MAX, mul));
  const label = crit && combo >= 5 ? 'dq.streak' : quick ? 'dq.quick' : first && combo >= 3 ? 'dq.first' : '';
  return { mul, extra, label, quick, first, crit };
}
HOOK.on('answer:right', q => {
  if (!q || !B.active) return;
  const a = answerQuality(q); B.qmul = a.mul; B.quickN = (B.quickN || 0) + (a.quick ? 1 : 0);
  if (a.extra) B.charge = Math.min(3, (B.charge || 0) + a.extra);
  if (a.label && !S.sensory) { try { const ph = fx.pos(hs()); fx.num(ph.x + ph.w * .3, ph.y - ph.h * .95, t(a.label), 'combo'); } catch (e) { /* stage not ready */ } }
  if (a.label) announce(t(a.label));
});
HOOK.filter('dmgBoost', v => { const m = B.qmul || 1; B.qmul = 1; return v * m; });
HOOK.on('startBattle', () => { B.qmul = 1; B.quickN = 0; });
Object.assign(STR, {
  'dq.quick': ['⚡ Quick!', '⚡ Pantas!'], 'dq.first': ['🎯 First try!', '🎯 Kali pertama!'], 'dq.streak': ['🔥 Streak!', '🔥 Berturut-turut!']
});
if (window.__quest) window.__quest.v35 = Object.assign(window.__quest.v35 || {}, { answerQuality, DQ });
