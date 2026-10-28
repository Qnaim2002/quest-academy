/* ================= v21: per-question stats and daily records =================
   S.qstats: for each question (subject + question text, or the math question type) how often it was asked
   and how often the first try was wrong. The Parent zone lists the most confusing ones.
   S.days: per calendar day, time played, questions answered, first-try correct, per subject and topic.
   Kept for 6 weeks; it feeds the weekly summary. Both stay on this device like the rest of the save. */
function qStatKey(q) {
  const subj = q.memSubj || (q.kind === 'math' ? 'math' : (B.lv && B.lv.subj) || 'x');
  return subj + '|' + (q.memKey || (q.kind === 'math' ? 'type:' + q.type : q.kind === 'trace' ? 'trace:' + q.glyph : q.key || q.type));
}
function recordQ(q, wrongs) {
  const st = S.qstats || (S.qstats = {}), k = qStatKey(q), o = st[k] || (st[k] = { n: 0, w: 0, t: 0, x: '' });
  o.n++; if (wrongs > 0) o.w++; o.t = Date.now(); o.x = q.kind === 'math' ? (q.tag || q.type) : String(q.text || '').slice(0, 140);
  const keys = Object.keys(st); if (keys.length > 450) keys.sort((a, b) => st[a].t - st[b].t).slice(0, keys.length - 400).forEach(k2 => delete st[k2]);
  const d = dayStat(), subj = k.split('|')[0], first = wrongs === 0 ? 1 : 0;
  d.q++; d.ok += first;
  const s = d.s[subj] || (d.s[subj] = [0, 0]); s[0]++; s[1] += first;
  if (q.topic) { const tk = subj + '|' + q.topic, tp = d.tp[tk] || (d.tp[tk] = [0, 0]); tp[0]++; tp[1] += first; }
}
function dayStat(day = todayKey()) {
  const D = S.days || (S.days = {});
  if (!D[day]) {
    D[day] = { ms: 0, q: 0, ok: 0, s: {}, tp: {} };
    const keep = Object.keys(D).sort().slice(-42); Object.keys(D).forEach(k => { if (!keep.includes(k)) delete D[k]; });
  }
  return D[day];
}
/* the most confusing questions: missed on the first try at least twice, and in at least 40% of tries */
function trickyQuestions(n = 8) {
  const st = S.qstats || {};
  return Object.entries(st).filter(([, o]) => o.w >= 2 && o.w / o.n >= .4).sort((a, b) => (b[1].w / b[1].n) - (a[1].w / a[1].n) || b[1].w - a[1].w).slice(0, n)
    .map(([k, o]) => ({ subj: k.split('|')[0], text: o.x, n: o.n, w: o.w }));
}
/* the last 7 days, today included */
function weekSummary() {
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return todayKey(d); });
  const D = S.days || {}, rows = days.map(k => ({ k, ...(D[k] || { ms: 0, q: 0, ok: 0, s: {}, tp: {} }) }));
  const tot = rows.reduce((a, r) => ({ ms: a.ms + r.ms, q: a.q + r.q, ok: a.ok + r.ok }), { ms: 0, q: 0, ok: 0 });
  const tp = {}; rows.forEach(r => Object.entries(r.tp || {}).forEach(([k, [q, ok]]) => { const o = tp[k] || (tp[k] = [0, 0]); o[0] += q; o[1] += ok; }));
  const ranked = Object.entries(tp).filter(([, [q]]) => q >= 4).map(([k, [q, ok]]) => ({ k, q, acc: ok / q })).sort((a, b) => b.acc - a.acc || b.q - a.q);
  return { rows, tot, best: ranked.slice(0, 2), weak: ranked.length > 1 ? ranked.slice(-2).reverse().filter(x => x.acc < .8) : [], daysPlayed: rows.filter(r => r.ms > 60000 || r.q > 0).length };
}
