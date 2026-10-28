/* ================= v38: a simple "How is my child doing?" card for grown-ups =================
   Four big numbers, one face per subject (great / on track / needs practice / just starting) and one tip. The long analytics
   (this week, progress, mastery heatmap, tricky questions, activity log) are still there, folded under "More details". */
Object.assign(STR, {
  'v38.how': ['How is {n} doing?', 'Bagaimana prestasi {n}?'], 'v38.q': ['Questions', 'Soalan'], 'v38.right': ['Right first time', 'Betul kali pertama'],
  'v38.lessons': ['Lessons done', 'Pelajaran siap'], 'v38.stars': ['Stars', 'Bintang'],
  'v38.great': ['Doing great', 'Sangat baik'], 'v38.ok': ['On track', 'Sedang baik'], 'v38.help': ['Needs practice', 'Perlu latihan'], 'v38.new': ['Just starting', 'Baru bermula'],
  'v38.more': ['More details for grown-ups', 'Butiran lanjut untuk orang dewasa'], 'v38.tip': ['Tip', 'Petua'], 'v38.focus': ['Try more: {t}', 'Cuba lagi: {t}']
});
function v38Summary() {
  const T = Object.values(S.topics || {}), done = T.reduce((a, x) => a + x.n, 0), first = T.reduce((a, x) => a + x.f, 0);
  const stars = Object.values(S.stars || {}).reduce((a, b) => a + b, 0), learned = Object.keys(S.learned || {}).filter(k => MODULES.some(m => m.id === k)).length;
  const tile = (em, n, l) => `<div class="v38-t"><i aria-hidden="true">${em}</i><b>${n}</b><span>${l}</span></div>`;
  const rows = DOMAINS.map(d => {
    const vals = d.topics.map(mv).filter(v => v !== null && v !== undefined), avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length * 100 : null;
    const tries = d.topics.reduce((a, id) => a + (S.topics[id] ? S.topics[id].n : 0), 0), bench = d.bench[S.band] || 70;
    let f = '🌱', k = 'v38.new', c = 'new';
    if (avg !== null && tries >= 5) { if (avg >= bench + 5) { f = '😀'; k = 'v38.great'; c = 'hi'; } else if (avg >= bench - 5) { f = '🙂'; k = 'v38.ok'; c = 'ok'; } else { f = '💪'; k = 'v38.help'; c = 'lo'; } }
    return `<li class="${c}"><span class="v38-f" aria-hidden="true">${f}</span><b>${d.em} ${t(d.key)}</b><em>${t(k)}</em></li>`;
  }).join('');
  const weak = DOMAINS.map(d => { const v = d.topics.map(mv).filter(x => x !== null && x !== undefined), n = d.topics.reduce((a, id) => a + (S.topics[id] ? S.topics[id].n : 0), 0); return { d, avg: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null, n }; })
    .filter(x => x.avg !== null && x.n >= 5 && x.avg < .8).sort((a, b) => a.avg - b.avg)[0];
  const tip = weak ? t('v38.focus', { t: t(weak.d.key) }) : '';
  return `<section class="v38-sum"><h2>🌟 ${esc(t('v38.how', { n: kidName(curProfile()) }))}</h2>
    <div class="v38-tiles">${tile('❓', done, t('v38.q'))}${tile('✅', (done ? Math.round(first / done * 100) : 0) + '%', t('v38.right'))}${tile('📘', learned, t('v38.lessons'))}${tile('⭐', stars, t('v38.stars'))}</div>
    <ul class="v38-subj">${rows}</ul>${tip ? `<p class="v38-tip">💡 <b>${t('v38.tip')}:</b> ${esc(tip)}</p>` : ''}</section>`;
}
HOOK.on('renderParent', () => {
  const el = $('#tab-parent'); if (!el || !gate.unlocked || el.querySelector('.v38-sum')) return;
  const wrap = el.querySelector('.wrap'); if (!wrap) return;
  const h2 = [...wrap.children].filter(x => x.tagName === 'H2'), has = (h, key) => h.textContent.includes(t(key).replace(/\{.*?\}/g, '').trim());
  const wk = h2.find(h => has(h, 'wk.title')), pg = h2.find(h => has(h, 'pp.progress')), pv = h2.find(h => has(h, 'pp.priv'));
  if (!pg || !pv) return;
  const more = document.createElement('details'); more.className = 'v38-more';
  more.innerHTML = `<summary>${esc(t('v38.more'))}</summary>`;
  const grab = (from, to) => { let n = from; while (n && n !== to) { const nx = n.nextElementSibling; more.appendChild(n); n = nx; } };
  if (wk) { const nx = wk.nextElementSibling; more.appendChild(wk); if (nx && !/^H2$/.test(nx.tagName)) more.appendChild(nx); }
  grab(pg, pv);
  wrap.insertBefore(more, pv);
  const sub = wrap.querySelector(':scope > p.sub'); (sub || wrap.firstElementChild).insertAdjacentHTML('afterend', v38Summary());
});
