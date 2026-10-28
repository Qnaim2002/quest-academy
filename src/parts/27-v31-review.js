/* ================= v31: mistake review after a battle =================
   Every question answered wrong in a battle is kept (with each wrong choice the child tapped). When the battle ends,
   the end card gets a "Look at my mistakes" button. Each mistake shows the question, the wrong choice, the right
   answer and a short reason why the choice was wrong, worked out from the question itself:
     numbers   "11 is what you get when you add. This question takes away: 7 − 4 = 3", or "close, but 1 too many"
     fractions "3/4 counts the parts that are NOT shaded"
     words     "'Mata' goes with 👁️" (the wrong word is the answer to another question in the bank)
     the rest  the question's own worked steps or hints (spelling, syllables, cause and effect, life skills ...)
   Every card has a 🔊 button. Nothing here changes stars or coins. */
HOOK.on('startBattle', () => { B.misses = []; });
HOOK.on('answer:wrong', (q, i) => {
  if (!q || !B.active) return;
  const M = B.misses || (B.misses = []);
  let e = M.find(x => x.q === q);
  if (!e) { if (M.length >= 12) return; e = { q, text: q.reviewText || q.text || '', picks: [] }; M.push(e); }
  const p = i >= 0 && q.options ? String(q.options[i]) : null;
  if (p !== null && !e.picks.includes(p)) e.picks.push(p);
});

const MX_OPS = { '+': (a, b) => a + b, '−': (a, b) => Math.abs(a - b), '×': (a, b) => a * b, '÷': (a, b) => b && a % b === 0 ? a / b : NaN };
const MX_OPN = { '+': '+', '-': '−', '−': '−', 'x': '×', '×': '×', '*': '×', '÷': '÷', '/': '÷' };
const mxNum = s => { const v = String(s).replace(/[\s,]/g, ''); return /^-?\d+(\.\d+)?$/.test(v) ? +v : null; };
/* the first "a op b" in a question (numbers may be written with spaces: 1 250) */
function mxArith(q) {
  const src = ((q.eq || '') + ' ' + (q.text || '')).replace(/(\d) (?=\d{3}\b)/g, '$1');
  const m = src.match(/(\d+)\s*([+\-−x×*÷/])\s*(\d+)/); if (!m) return null;
  const op = MX_OPN[m[2]]; if (!op) return null;
  return { a: +m[1], b: +m[3], op };
}
const mxSteps = q => { try { const s = q.steps ? q.steps() : []; return (Array.isArray(s) ? s : [s]).filter(Boolean).map(String); } catch (e) { return []; } };
/* why this choice is wrong (one or two short sentences, in the game language) */
function whyWrong(q, pick) {
  const ans = String(q.ansText !== undefined ? q.ansText : (q.options || [])[q.correct]), out = [];
  const pn = pick === null ? null : mxNum(pick), an = mxNum(ans), ar = mxArith(q);
  if (q.kind === 'trace') return t('mx.trace', { g: q.glyph });
  if (q.kind === 'wx') return (q.why ? q.why + ' ' : '') + t('mx.plain', { a: ans });   // v35: the new formats say their own reason
  if (q.kind === 'order' || q.kind === 'match') return t(q.kind === 'order' ? 'mx.order' : 'mx.match', { a: ans });
  if (pn !== null && an !== null) {
    let other = null;
    const inText = n => new RegExp('(^|\\D)' + n + '(\\D|$)').test(String(q.text || '').replace(/(\d) (?=\d{3}\b)/g, '$1'));
    if (ar && MX_OPS[ar.op] && MX_OPS[ar.op](ar.a, ar.b) === an && inText(ar.a) && inText(ar.b)) {
      for (const op of ['+', '−', '×', '÷']) if (op !== ar.op && MX_OPS[op](ar.a, ar.b) === pn) { other = op; break; }
    }
    const eq = ar && MX_OPS[ar.op] && MX_OPS[ar.op](ar.a, ar.b) === an ? `${ar.a} ${ar.op} ${ar.b} = ${an}` : '';
    const d = Math.abs(pn - an), close = d === 1 || (d <= 3 && an >= 10), stepsHaveEq = eq && mxSteps(q).join(' ').includes(eq), work = eq && !stepsHaveEq ? ' ' + t('mx.work', { eq }) : '';
    if (other) out.push(t('mx.op', { p: pick, did: t('mx.do' + MX_OP_KEY[other]), need: t('mx.do' + MX_OP_KEY[ar.op]), eq }));
    else if (close) out.push(t(pn > an ? 'mx.many' : 'mx.few', { p: pick, d }) + work);
    else out.push(t(pn > an ? 'mx.big' : 'mx.small', { p: pick }) + work);
  } else if (pick !== null && /^\d+\/\d+$/.test(ans) && /^\d+\/\d+$/.test(pick)) {
    const [k, n] = ans.split('/').map(Number), [x, y] = pick.split('/').map(Number);
    if (y === n && x === n - k) out.push(t('mx.fracOther', { p: pick, a: ans }));
    else if (y !== n) out.push(t('mx.fracBottom', { n, a: ans }));
    else out.push(t('mx.fracTop', { k, a: ans }));
  } else if (q.type === 'tf') {
    const m = String(q.text).match(/^(\d+)\s*\+\s*(\d+)\s*=\s*(\d+)$/);
    out.push(m ? t(q.correct === 0 ? 'mx.tfSumOk' : 'mx.tfSum', { a: m[1], b: m[2], s: +m[1] + +m[2], c: m[3] }) : t(q.correct === 0 ? 'mx.tfTrue' : 'mx.tfFalse'));
  } else if (q.type === 'odd' && pick !== null) {
    out.push(t('mx.oddPick', { p: pick }));
  } else if (pick !== null && q.row && q.memSubj && BANK[q.memSubj]) {
    const li = L(), rows = Object.values(BANK[q.memSubj]).flat();
    const r2 = rows.find(r => r !== q.row && String(r.a[li]) === pick && r.grp === q.row.grp) || rows.find(r => r !== q.row && String(r.a[li]) === pick);
    if (r2 && r2.em && r2.em !== q.row.em && r2.grp === q.row.grp) out.push(t('mx.goes', { p: pick, e: r2.em }));
    else if (r2) out.push(t('mx.other', { p: pick, q: r2.q[li] }));
  }
  /* the reason, from the question's own help */
  const st = mxSteps(q);
  if (q.why) out.push(q.why);
  else if (q.kind === 'math' || ['syll', 'spell', 'rhyme', 'missing', 'sort', 'phonics'].includes(q.kind || q.type)) out.push(st.slice(1).join(' '));
  else if ((q.kind === 'life' || q.type === 'ce' || q.kind === 'ce') && st.length >= 3) out.push(st.slice(1, 3).join(' '));
  if (!out.filter(Boolean).length) out.push(t('mx.plain', { a: ans }));
  return out.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
const MX_OP_KEY = { '+': 'Add', '−': 'Sub', '×': 'Mul', '÷': 'Div' };
function mistakeList() {
  return (B.misses || []).map(e => {
    const q = e.q, ans = String(q.ansText !== undefined ? q.ansText : (q.options || [])[q.correct]);
    let les = null; try { les = typeof lessonForTopic === 'function' ? lessonForTopic(q.topic, B.lv && B.lv.subj) : null; } catch (x) { les = null; }
    return { text: e.text, em: q.row ? q.row.em : '', picks: e.picks, ans, why: whyWrong(q, e.picks.length ? e.picks[0] : null), les };
  });
}
function mxButtonHTML() {
  const n = (B.misses || []).length; if (!n) return '';
  return `<button class="wchip mxbtn" data-act="mxOpen"><span aria-hidden="true">🔍</span> ${esc(t('mx.btn', { n }))}</button>`;
}
function mxAddButton() {
  const wb = $('#winSheet .wbtns'); if (!wb || !wb.insertAdjacentHTML || $('#winSheet .mxbtn')) return;
  const h = mxButtonHTML(); if (h) wb.insertAdjacentHTML('beforebegin', h);
}
HOOK.on('win', () => mxAddButton());
HOOK.on('heroKO', () => { if (!B.active) mxAddButton(); });   // a knock-out that ends a Boss Rush or a tower climb
function mxOpen() {
  let ov = $('#mxOverlay');
  if (!ov) { ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'mxOverlay'; ov.innerHTML = '<div class="mwrap"><button class="mclose" data-act="mxClose" aria-label="Close">✕</button><div class="sheet mxsheet" id="mxSheet" role="dialog" aria-modal="true"></div></div>'; document.body.appendChild(ov); }
  const L2 = mistakeList(), sh = $('#mxSheet'); sh.setAttribute('aria-label', t('mx.title'));
  sh.innerHTML = `<h2>🔍 ${t('mx.title')}</h2><p class="sub">${t('mx.sub')}</p><ol class="mx-list">${L2.map((m, i) => {
    const say = `${m.text} ${m.picks.length ? t('mx.you') + ': ' + m.picks.join(', ') + '. ' : ''}${m.ans ? t('mx.right') + ': ' + m.ans + '. ' : ''}${m.why}`;
    return `<li class="mx-item" style="--i:${i}"><div class="mx-top">${m.em ? `<span class="mx-em" aria-hidden="true">${m.em}</span>` : ''}<p class="mx-q">${esc(m.text)}</p><button class="speak" data-act="say" data-say="${esc(say)}" aria-label="🔊">🔊</button></div>
      ${m.picks.length ? `<p class="mx-you"><span aria-hidden="true">❌</span> ${t('mx.you')}: <b>${m.picks.map(esc).join(', ')}</b></p>` : ''}
      ${m.ans ? `<p class="mx-ok"><span aria-hidden="true">✅</span> ${t('mx.right')}: <b>${esc(m.ans)}</b></p>` : ''}<p class="mx-why"><span aria-hidden="true">💡</span> ${esc(m.why)}</p>${m.les ? `<button class="linkbtn mx-les" data-act="lessonGo" data-v="${m.les.id}">📘 ${t('mx.learn')}: ${esc(tr(m.les, 'title'))}</button>` : ''}</li>`;
  }).join('')}</ol><div class="brief-actions"><button class="btn big" data-act="mxClose">${t('mx.done')}</button></div>`;
  ov.classList.add('on'); sh.scrollTop = 0;
  if (S.voice.auto && L2[0]) speak(t('mx.title'));
}
HOOK.claim('famEvent', a => {
  if (a === 'mxOpen') { mxOpen(); return true; }
  if (a === 'mxClose') { const o = $('#mxOverlay'); if (o) o.classList.remove('on'); return true; }
  if (a === 'lessonGo' || a === 'toMap' || a === 'retry' || a === 'nextLevel') { const o = $('#mxOverlay'); if (o) o.classList.remove('on'); }   // then the usual action runs
  return undefined;
});

Object.assign(STR, {
  'mx.btn': ['Look at my mistakes ({n})', 'Lihat kesilapan saya ({n})'], 'mx.title': ['My mistakes', 'Kesilapan saya'],
  'mx.sub': ['Mistakes help us learn. Here is why each answer was not right.', 'Kesilapan membantu kita belajar. Inilah sebab setiap jawapan tidak betul.'],
  'mx.you': ['You picked', 'Kamu pilih'], 'mx.right': ['Right answer', 'Jawapan betul'], 'mx.done': ['Got it!', 'Faham!'],
  'mx.doAdd': ['add', 'tambah'], 'mx.doSub': ['take away', 'tolak'], 'mx.doMul': ['multiply', 'darab'], 'mx.doDiv': ['divide', 'bahagi'],
  'mx.op': ['{p} is what you get when you {did}. This question asks you to {need}: {eq}.', '{p} ialah jawapan jika kamu {did}. Soalan ini minta kamu {need}: {eq}.'],
  'mx.many': ['{p} is close, but it is {d} too many.', '{p} hampir betul, tetapi lebih {d}.'], 'mx.few': ['{p} is close, but it is {d} too few.', '{p} hampir betul, tetapi kurang {d}.'],
  'mx.big': ['{p} is too big.', '{p} terlalu besar.'], 'mx.small': ['{p} is too small.', '{p} terlalu kecil.'], 'mx.work': ['Work it out: {eq}.', 'Kira semula: {eq}.'],
  'mx.fracOther': ['{p} counts the parts that are NOT shaded. Count the shaded parts: {a}.', '{p} mengira bahagian yang TIDAK berlorek. Kira bahagian berlorek: {a}.'],
  'mx.fracBottom': ['The bottom number is how many equal parts there are: {n}. So the answer is {a}.', 'Nombor bawah ialah bilangan bahagian sama: {n}. Jadi jawapannya {a}.'],
  'mx.fracTop': ['The top number is how many parts are shaded: {k}. So the answer is {a}.', 'Nombor atas ialah bilangan bahagian berlorek: {k}. Jadi jawapannya {a}.'],
  'mx.tfSum': ['{a} + {b} makes {s}, not {c}, so it is not true.', '{a} + {b} ialah {s}, bukan {c}, jadi ia tidak betul.'], 'mx.tfSumOk': ['{a} + {b} really makes {c}, so it is true.', '{a} + {b} memang {c}, jadi ia betul.'],
  'mx.learn': ['Learn more', 'Belajar lagi'], 'mx.tfTrue': ['This sentence is true.', 'Ayat ini betul.'], 'mx.tfFalse': ['This sentence is not true.', 'Ayat ini tidak betul.'],
  'mx.oddPick': ['“{p}” belongs with the others.', '“{p}” sama kumpulan dengan yang lain.'],
  'mx.goes': ['“{p}” goes with {e}.', '“{p}” untuk {e}.'], 'mx.other': ['“{p}” is the answer to another question: “{q}”', '“{p}” ialah jawapan bagi soalan lain: “{q}”'],
  'mx.trace': ['Start at the green dot 1 and follow every line of {g}, then the next dot.', 'Mula di titik hijau 1 dan ikut setiap garisan {g}, kemudian titik seterusnya.'],
  'mx.order': ['The right order is: {a}.', 'Susunan yang betul: {a}.'], 'mx.match': ['Each word goes with its own picture.', 'Setiap perkataan ada gambarnya sendiri.'],
  'mx.plain': ['The right answer is “{a}”.', 'Jawapan yang betul ialah “{a}”.']
});
