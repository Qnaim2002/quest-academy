/* ================= v21: screen reader announcements in battle =================
   Two hidden live regions inside the battle view: a polite one for the new question, hits, damage and
   Hoot's hints, and an assertive one for boss phase changes and the enrage warning. Messages that arrive
   together are joined into one announcement, so the screen reader is not interrupted mid-sentence. */
const SR_Q = { polite: [], alert: [], t: 0 };
function srFlush() {
  SR_Q.t = 0;
  [['polite', '#srLive'], ['alert', '#srAlert']].forEach(([k, sel]) => {
    const el = $(sel), list = SR_Q[k]; if (!el || !list.length) return;
    const msg = [...new Set(list)].join(' '); list.length = 0;
    el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 40);
  });
}
function announce(msg, urgent) {
  if (!msg) return;
  SR_Q[urgent ? 'alert' : 'polite'].push(String(msg).replace(/\s+/g, ' ').trim());
  if (!SR_Q.t) SR_Q.t = setTimeout(srFlush, 160);
}
const monName = () => (B.lv && B.lv.mon && B.lv.mon.n) || t('b.monster');
