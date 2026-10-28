/* ================= v28: lessons that build on each other =================
   LADDERS. A subject's lessons are grouped by topic. Each topic is a ladder of three rungs: 🌱 Starter,
     🧱 Builder and 🏆 Expert (easier lessons first). A rung opens when the rung below it is finished. A topic with
     fewer than three lessons fills the missing rungs with a practice set (Builder) and a quiz (Expert).
   QUICK CHECK (age 6-7). Two warm-up questions open a new lesson; two right answers offer "Skip to practice".
   TEACH-BACK (age 6-7). After the last card the child picks the sentence that explains what the lesson taught.
   PICTURE FIRST (age 4). The first card of a lesson is a big emoji picture with one short sentence.
   NOTEBOOK. Every finished lesson adds its "Remember" tip to the child's notebook (Studies > My notebook).
   PRINT & COLOUR. Art lessons (and tracing practice, 24) have a printable colouring page.
   LESSON BATTLES. After practice: a 3-round battle with only that lesson's questions. A whole topic finished
     wakes a 👑 topic boss (a mini-boss fight with only that topic's questions).
   STUDY BUFFS. Finishing a practice gives +3 attack in the next battle of that subject.
   BATTLE TIPS. A win with several misses (or a lost Boss Rush / tower climb) suggests the lesson for the topic
     that was missed most, with a one-tap link.
   Quick checks, lesson battles, topic bosses and study buffs are "bonus modes": they are off in calm mode and
   behind one Parent Portal switch ("Study buffs and bonus modes"). */
const bonusOn = () => S.studyBonus !== false && !S.sensory;
const olderBand = () => S.band >= 3;
const LKINDS = new Set(['lesson', 'tboss']);
const RUNG_EM = ['🌱', '🧱', '🏆'];
const hashStr = s => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const learnedAt = id => !!(S.learned || {})[id];
const topicName = (s, tp) => { const k = STR['tp.' + s + '_' + tp]; return k ? k[L()] : tp; };

/* ---------------- ladders ---------------- */
function ladders(subj, age = UI.sage) {
  const mods = MODULES.filter(m => m.subject === subj && (!age || m.bands.includes(age))), by = new Map();
  mods.forEach((m, i) => { const tp = lessonTopic(m); if (!by.has(tp)) by.set(tp, []); by.get(tp).push([m, i]); });
  return [...by.entries()].map(([tp, list]) => {
    const sorted = list.sort((a, b) => Math.min(...a[0].bands) - Math.min(...b[0].bands) || a[1] - b[1]).map(x => x[0]), n = sorted.length;
    return { subj, topic: tp, name: topicName(subj, tp), last: sorted[n - 1], lessons: sorted.map((m, i) => ({ m, rung: n >= 3 ? Math.floor(i * 3 / n) : i })) };
  });
}
const rungItems = (T, r) => T.lessons.filter(x => x.rung === r);
function rungDone(T, r) {
  const it = rungItems(T, r);
  if (it.length) return it.every(x => learnedAt(x.m.id));
  return r === 1 ? !!(S.pracDay || {})[T.last.id] : ((S.quiz || {})[T.last.id] || 0) >= 3;   // the practice set and the quiz that fill a short ladder
}
function rungOpen(T, r) { if (S.openAll || r === 0) return true; return rungOpen(T, r - 1) && rungDone(T, r - 1); }
const topicDone = T => T.lessons.every(x => learnedAt(x.m.id));
function ladderHTML(T) {
  const total = T.lessons.length, got = T.lessons.filter(x => learnedAt(x.m.id)).length;
  const rungs = [0, 1, 2].map(r => {
    const it = rungItems(T, r), open = rungOpen(T, r), done = rungDone(T, r);
    const body = !open && it.length ? `<p class="rung-shut">🔒 ${t('ld.shut', { n: it.length })}</p>` : it.length ? it.map(({ m }) => `<button class="lcard ${open ? '' : 'locked'} ${learnedAt(m.id) ? 'done' : ''}" data-act="${open ? 'open' : 'ladLocked'}" data-v="${open ? m.id : r}"><span class="em">${open ? m.em : '🔒'}</span><span class="t">${esc(tr(m, 'title'))}<small>${t('st.min', { n: m.min })}${learnedAt(m.id) ? ' · ✔' : ''}</small></span></button>`).join('')
      : `<button class="lcard filler ${open ? '' : 'locked'} ${done ? 'done' : ''}" data-act="${open ? 'ladPrac' : 'ladLocked'}" data-v="${open ? T.last.id + ':' + (r === 1 ? 'prac' : 'quiz') : r}"><span class="em">${open ? (r === 1 ? '🎯' : '📝') : '🔒'}</span><span class="t">${t(r === 1 ? 'ld.fillPrac' : 'ld.fillQuiz')}<small>${esc(tr(T.last, 'title'))}${done ? ' · ✔' : ''}</small></span></button>`;
    return `<div class="rung r${r} ${open ? 'open' : 'locked'} ${done ? 'done' : ''}"><div class="rung-h"><span aria-hidden="true">${RUNG_EM[r]}</span><b>${t('ld.r' + r)}</b>${done ? '<em aria-label="✔">✔</em>' : open ? '' : `<small>🔒 ${t('ld.lockedShort')}</small>`}</div><div class="rung-b">${body}</div></div>`;
  }).join('');
  let boss = '';
  if (bonusOn() && SUBJ_ORDER.includes(T.subj)) {
    const key = T.subj + ':' + T.topic, beat = !!(S.tboss || {})[key + ':' + S.band];
    boss = topicDone(T) ? `<button class="tboss ${beat ? 'beat' : ''}" data-act="tbossGo" data-v="${key}"><span aria-hidden="true">👑</span><b>${t('ld.boss')}</b><small>${t(beat ? 'ld.bossAgain' : 'ld.bossGo')}</small></button>`
      : `<div class="tboss locked" role="note"><span aria-hidden="true">💤</span><b>${t('ld.boss')}</b><small>${t('ld.bossHow', { n: got, m: total })}</small></div>`;
  }
  return `<section class="ladder"><div class="ld-h"><b>${esc(T.name)}</b><small>${t('ld.prog', { n: got, m: total })}</small><span class="ld-bar" aria-hidden="true"><i style="width:${total ? Math.round(got / total * 100) : 0}%"></i></span></div><div class="rungs">${rungs}</div>${boss}</section>`;
}
function laddersHTML(subj) {
  const L2 = ladders(subj);
  return L2.length ? `<p class="sub ld-note">${t('ld.note')}</p><div class="ladders">${L2.map(ladderHTML).join('')}</div>` : `<p class="note">${t('st.none')}</p>`;
}

/* ---------------- picture first (age 4) ---------------- */
const EMO_RX = /\p{Extended_Pictographic}(️|‍\p{Extended_Pictographic})*/gu;
function picScene(m) {
  const txt = [...(m.body || []), ...((m.ms && m.ms.body) || [])].join(' '), found = [...new Set((txt.match(EMO_RX) || []).filter(e => e !== m.em))].slice(0, 3);
  return [m.em, ...found];
}
function picSentence(text) {
  let s = lcSentences(String(text || ''))[0] || String(text || '');
  if (s.length > 70) { const c = s.search(/[,;:–—]/); s = (c > 12 ? s.slice(0, c) : s.split(/\s+/).slice(0, 9).join(' ')).replace(/[\s,;:]+$/, '') + '.'; }
  return s;
}
LC_KIND.pic = ['🖼️', 'lc.pic'];
HOOK.filter('lessonCards', (c, m) => S.band === 1 && c.length && UI.open === m.id ? [{ kind: 'pic', text: picSentence(c[0].text), em: picScene(m) }].concat(c) : c);
HOOK.filter('lessonCardsHTML', (h, m) => {
  if (S.band === 1 && UI.open === m.id && !(UI.lc > 0)) {
    const c = lessonCards(m)[0];
    if (c && c.kind === 'pic') h = h.replace(/<ul class="lp-lines">[\s\S]*?<\/ul>/, `<div class="lp-pic" aria-hidden="true">${c.em.map((e, i) => `<span class="pe${i}">${e}</span>`).join('')}</div><p class="lp-one">${esc(c.text)}</p>`);
  }
  return h;
});

/* ---------------- quick check (age 6-7, bonus mode) ---------------- */
function qcFor(m) {
  if (UI.qcFor === m.id) return UI.qc;
  UI.qcFor = m.id; UI.qc = null;
  if (!bonusOn() || !olderBand() || learnedAt(m.id) || (UI.prac && UI.prac.id === m.id)) return null;
  const keys = new Set(), qs = [];
  for (let k = 0; k < 2; k++) { const q = lessonQ(m, keys); if (!q) return null; keys.add(q.key); qs.push(q); }
  return (UI.qc = { id: m.id, qs, i: 0, ok: 0, fb: '', done: false, hidden: false });
}
function qcHTML(m) {
  const c = qcFor(m); if (!c || c.hidden) return '';
  if (c.done) {
    const all = c.ok === 2;
    return lsec('⚡', t('qc.title'), '', `<div class="qc lpanel done"><p class="qc-res">${all ? '🌟 ' + t('qc.both') : '📘 ' + t('qc.learn', { n: c.ok })}</p><div class="seg">${all ? `<button class="btn big" data-act="qcSkip">⏩ ${t('qc.skip')}</button>` : ''}<button class="btn ${all ? 'ghost' : 'big'}" data-act="qcHide">📖 ${t('qc.read')}</button></div></div>`, 'qcheck');
  }
  const q = c.qs[c.i];
  return lsec('⚡', t('qc.title'), '', `<div class="qc lpanel"><p class="sub" style="margin:0 0 8px">${t('qc.sub', { i: c.i + 1 })}</p><div class="pr-q"><button class="speak" data-act="say" data-say="${esc(q.text)}" aria-label="${esc(t('st.listen'))}">🔊</button><p>${esc(q.text)}</p></div>
    <div class="pr-opts ${q.options.length > 3 || q.cls === 'txt' ? 'two' : ''}">${q.options.map((o, i) => `<button class="ans pr-ans ${q.cls || ''}" data-act="qcPick" data-v="${i}">${esc(o)}</button>`).join('')}</div>${c.fb ? `<p class="pr-fb">${esc(c.fb)}</p>` : ''}<button class="linkbtn" data-act="qcHide">${t('qc.skipWarm')}</button></div>`, 'qcheck');
}
function qcPick(i) {
  const c = UI.qc; if (!c || c.done) return;
  const q = c.qs[c.i], ok = i === q.correct;
  if (ok) { c.ok++; sfx.ok(); c.fb = t('qc.yes'); } else { sfx.soft(); c.fb = t('qc.no', { a: q.options[q.correct] }); }
  recordTopic(q.topic, ok);
  c.i++; if (c.i >= c.qs.length) c.done = true;
  renderStudies();
}

/* ---------------- teach-back (age 6-7) ---------------- */
const ideaOf = m => { const c = lessonCardsBase(m); if (!c.length) return ''; const s = lcSentences(c[0].text); return (s[0] && s[0].length < 25 && s[1] ? s[0] + ' ' + s[1] : s[0]) || c[0].text; };
function tbFor(m) {
  if (UI.tb && UI.tb.id === m.id) return UI.tb;
  const right = ideaOf(m), tp = lessonTopic(m); if (!right) return null;
  const others = shuffle(MODULES.filter(x => x.subject === m.subject && x.id !== m.id && x.body && lessonTopic(x) !== tp)).map(ideaOf).filter(s => s && s !== right && s.length > 12);
  if (others.length < 2) return null;
  const opts = shuffle([right, ...others.slice(0, 2)]);
  return (UI.tb = { id: m.id, opts, right: opts.indexOf(right), picked: -1, tries: 0 });
}
function tbHTML(m) {
  if (!olderBand()) return '';
  const n = lessonCards(m).length; if (!learnedAt(m.id) && (UI.lc || 0) < n - 1) return '';
  const b = tbFor(m); if (!b) return '';
  const solved = b.picked === b.right;
  return lsec('🗣️', t('tb.title'), '', `<div class="tb lpanel"><p class="sub" style="margin:0 0 8px">${t('tb.sub')}</p><div class="tb-opts">${b.opts.map((o, i) => `<button class="ans tb-ans ${solved && i === b.right ? 'right' : ''} ${!solved && b.picked === i ? 'soft' : ''}" data-act="tbPick" data-v="${i}" ${solved ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>${b.picked >= 0 ? `<p class="pr-fb">${esc(solved ? t(b.tries === 1 ? 'tb.yesFirst' : 'tb.yes') : t('tb.no'))}</p>` : ''}</div>`, 'teach');
}
function tbPick(i) {
  const b = UI.tb; if (!b || b.picked === b.right) return;
  b.picked = i; b.tries++;
  if (i === b.right) { sfx.ok(); const T = S.teach || (S.teach = {}); if (b.tries === 1 && !T[b.id]) { T[b.id] = 1; addCoins(2); save(); } }
  else sfx.soft();
  renderStudies();
}

/* ---------------- notebook ---------------- */
function cardsIn(m, lang) { const l0 = S.lang; S.lang = lang; try { return lessonCardsBase(m); } finally { S.lang = l0; } }
function tipOf(m, lang) {
  const c = cardsIn(m, lang); if (!c.length) return '';
  const tip = c.find(x => x.kind === 'tip'); return tip ? tip.text : lcSentences(c[0].text)[0] || c[0].text;
}
function noteAdd(m) {
  if (!m || !m.body) return false;
  const N = S.notebook || (S.notebook = {}); if (N[m.id]) return false;
  N[m.id] = { at: Date.now(), en: tipOf(m, 'en'), ms: tipOf(m, 'ms') }; return true;
}
/* old saves: lessons learned before v28 fill the notebook the first time it opens */
function noteBackfill() {
  const subs = [...new Set(MODULES.filter(m => learnedAt(m.id) && !(S.notebook || {})[m.id]).map(m => m.subject))];
  subs.forEach(s => ensureLessons(s).then(() => { let ch = false; MODULES.filter(m => m.subject === s && learnedAt(m.id)).forEach(m => { ch = noteAdd(m) || ch; }); if (ch) { save(); if (UI.act === 'notebook') renderStudies(); } }).catch(() => {}));
}
function notebookHTML() {
  noteBackfill();
  const N = S.notebook || {}, ids = Object.keys(N).filter(id => MODULES.some(m => m.id === id)), li = S.lang === 'ms' ? 'ms' : 'en';
  const groups = SUBJECTS.map(([s, em]) => { const ms2 = MODULES.filter(m => m.subject === s && N[m.id]); return ms2.length ? `<section class="nb-sec" style="--c:${SUBJ_COL[s]}"><h3>${em} ${t('subj.' + s)} <small>${ms2.length}</small></h3>${ms2.map(m => { const tip = N[m.id][li] || N[m.id].en; return `<div class="nb-note"><span class="nb-em" aria-hidden="true">${m.em}</span><div><b>${esc(tr(m, 'title'))}</b><p>🧠 ${esc(tip)}</p></div><button class="speak" data-act="say" data-say="${esc(tip)}" aria-label="${esc(t('st.listen'))}">🔊</button></div>`; }).join('')}</section>` : ''; }).join('');
  return `<div class="lhead"><span class="em">📒</span><h2>${t('nb.title')}</h2></div><p class="sub">${t('nb.sub', { n: ids.length })}</p>${groups || `<div class="nb-empty"><span aria-hidden="true">📒</span><p>${t('nb.empty')}</p></div>`}`;
}

/* ---------------- print & colour ---------------- */
const LINE = 'fill="#fff" stroke="#222" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
const ART = {
  flower: `<path d="M100 120 C98 150 102 175 100 196" ${LINE} fill="none"/><path d="M100 160 C80 150 62 154 52 166 C66 176 84 174 100 164Z" ${LINE}/><path d="M100 172 C120 160 138 162 148 174 C134 184 116 182 100 176Z" ${LINE}/>${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="100" cy="62" rx="18" ry="34" transform="rotate(${a} 100 90)" ${LINE}/>`).join('')}<circle cx="100" cy="90" r="18" ${LINE}/>`,
  fish: `<path d="M30 100 C60 50 140 50 160 100 C140 150 60 150 30 100Z" ${LINE}/><path d="M160 100 L192 72 L190 128Z" ${LINE}/><circle cx="62" cy="92" r="7" ${LINE}/><path d="M90 70 C100 84 100 116 90 130 M115 70 C125 84 125 116 115 130" ${LINE} fill="none"/><path d="M84 58 C96 34 124 36 132 58" ${LINE}/>${[[40, 40, 6], [28, 22, 9], [50, 14, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${LINE}/>`).join('')}`,
  house: `<rect x="40" y="90" width="120" height="96" ${LINE}/><path d="M28 94 L100 34 L172 94Z" ${LINE}/><rect x="86" y="130" width="30" height="56" ${LINE}/><rect x="52" y="110" width="26" height="24" ${LINE}/><rect x="124" y="110" width="26" height="24" ${LINE}/><circle cx="170" cy="30" r="16" ${LINE}/><path d="M10 186 H190" ${LINE}/>`,
  butterfly: `<ellipse cx="100" cy="104" rx="7" ry="44" ${LINE}/><path d="M96 66 C86 44 78 36 70 32 M104 66 C114 44 122 36 130 32" ${LINE} fill="none"/><path d="M94 90 C60 30 16 46 26 86 C32 108 70 112 94 100Z" ${LINE}/><path d="M106 90 C140 30 184 46 174 86 C168 108 130 112 106 100Z" ${LINE}/><path d="M94 112 C64 116 36 146 56 164 C74 176 92 148 96 124Z" ${LINE}/><path d="M106 112 C136 116 164 146 144 164 C126 176 108 148 104 124Z" ${LINE}/><circle cx="56" cy="76" r="12" ${LINE}/><circle cx="144" cy="76" r="12" ${LINE}/>`,
  kite: `<path d="M100 14 L150 70 L118 92 L150 132 L100 176 L50 132 L82 92 L50 70Z" ${LINE}/><path d="M100 14 V176 M50 70 H150 M50 132 H150" ${LINE} fill="none"/><path d="M100 176 C90 186 110 192 98 198" ${LINE} fill="none"/><circle cx="100" cy="92" r="12" ${LINE}/>`,
  pattern: Array.from({ length: 9 }, (_, i) => { const x = 36 + (i % 3) * 64, y = 36 + Math.floor(i / 3) * 64; return `<rect x="${x - 30}" y="${y - 30}" width="60" height="60" ${LINE}/>${[0, 90, 180, 270].map(a => `<ellipse cx="${x}" cy="${y - 14}" rx="7" ry="13" transform="rotate(${a} ${x} ${y})" ${LINE}/>`).join('')}<circle cx="${x}" cy="${y}" r="6" ${LINE}/>`; }).join('')
};
function artFor(m) {
  const id = (m.id + ' ' + (m.title || '')).toLowerCase();
  if (/batik|corak|pattern|anyam/.test(id)) return 'pattern';
  if (/wau|kite|kraf/.test(id)) return 'kite';
  if (/warna|colou?r|campur|wheel/.test(id)) return 'butterfly';
  return ['flower', 'fish', 'house', 'butterfly', 'kite'][hashStr(m.id) % 5];
}
const artSVG = k => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img">${ART[k] || ART.flower}</svg>`;
function printPage(title, inner, note = '') {
  try {
    const fr = document.createElement('iframe'); fr.setAttribute('aria-hidden', 'true'); fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0'; document.body.appendChild(fr);
    const d = fr.contentWindow.document;
    d.open(); d.write(`<!doctype html><html lang="${S.lang}"><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:A4;margin:12mm}body{font-family:system-ui,sans-serif;text-align:center;margin:0;color:#222}h1{font-size:22pt;margin:2mm 0 2mm}p{margin:0 0 5mm;font-size:12pt}.name{text-align:left;font-size:12pt;margin-bottom:3mm}svg{width:100%;max-height:215mm}.row{display:flex;gap:4mm;justify-content:center}.row svg{width:30%}</style></head><body><div class="name">${esc(t('pt.name'))} __________________________</div><h1>${esc(title)}</h1>${note ? `<p>${esc(note)}</p>` : ''}${inner}</body></html>`); d.close();
    setTimeout(() => { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { toast(t('pt.fail')); } setTimeout(() => fr.remove(), 60000); }, 350);
  } catch (e) { toast(t('pt.fail')); }
}
function printSecHTML(m) {
  if (m.subject !== 'sv') return '';
  return lsec('🖨️', t('pt.title'), '', `<div class="lpanel ptp"><div class="pt-prev" aria-hidden="true">${artSVG(artFor(m))}</div><div><p class="sub" style="margin:0 0 10px">${t('pt.sub')}</p><button class="btn" data-act="printLesson" data-v="${m.id}">🖨️ ${t('pt.go')}</button></div></div>`, 'print');
}

/* ---------------- lesson battles and the topic boss ---------------- */
const topicLessons = (s, tp) => { const all = MODULES.filter(m => m.subject === s && lessonTopic(m) === tp), mine = all.filter(m => m.bands.includes(S.band)); return mine.length ? mine : all; };
HOOK.claim('specialLevel', id => {
  const p = String(id || '').split(':');
  if (p[0] === 'lesson' && p.length === 2) {
    const m = MODULES.find(x => x.id === p[1]); if (!m || !SUBJ_ORDER.includes(m.subject)) return null;
    const s = m.subject, base = levelOf(s, 2 + Math.min(3, S.band - 1) * 2);
    return { ...base, id, special: 'lesson', lessonId: m.id, tier: 'normal', boss: false, big: false, mini: false, rounds: 3, mon: monsterFor(s, 1 + hashStr(m.id) % 9) };
  }
  if (p[0] === 'tboss' && p.length === 3 && SUBJ_ORDER.includes(p[1])) {
    const s = p[1], tp = p[2], base = levelOf(s, 5 + Math.min(3, S.band - 1) * 10);
    return { ...base, id, special: 'tboss', topic: tp, rounds: 6, mon: monsterFor(s, (hashStr(tp) % 10) * 10 + 5) };
  }
  return undefined;
});
function specialQ(lv) {
  if (lv.special === 'lesson') { const m = MODULES.find(x => x.id === lv.lessonId); return m ? lessonQ(m, B.seen || new Set()) : null; }
  const list = topicLessons(lv.subj, lv.topic); return list.length ? lessonQ(pick(list), B.seen || new Set()) : null;
}
HOOK.around('nextQuestion', (next, forced) => {
  if (!forced && B.lv && LKINDS.has(B.lv.special)) { const q = specialQ(B.lv); if (q && q.options && q.options.length > 1) forced = q; }
  return next(forced);
});
HOOK.claim('lvT', l => {
  if (!l || !LKINDS.has(l.special)) return undefined;
  const m = l.lessonId && MODULES.find(x => x.id === l.lessonId), place = l.special === 'lesson' ? `📘 ${m ? tr(m, 'title') : ''}` : `👑 ${topicName(l.subj, l.topic)}`;
  return { name: place, goal: t(l.special === 'lesson' ? 'lb.goal' : 'lb.bossGoal'), tip: t('tip.' + l.mon.t), zone: t('subj.' + l.subj), place };
});
function lessonBattle(id) {
  if (B.active) return;
  UI.open = null; UI.list = null; UI.prac = null; UI.act = null; UI.run = null; renderStudies();
  showTab('adventure', true);
  pxWipe(() => startBattle(id));
}
async function lessonWin() {
  const lv = B.lv, tk = B.token, day = todayKey(); let reward, chest = false, head;
  S.battles++; S.defeated++;
  if (lv.special === 'lesson') {
    const D = S.bridgeDay || (S.bridgeDay = {}); reward = D[lv.lessonId] === day ? 2 : 6; D[lv.lessonId] = day; head = t('lb.won');
  } else {
    const T = S.tboss || (S.tboss = {}), k = lv.subj + ':' + lv.topic + ':' + S.band, first = !T[k]; T[k] = (T[k] || 0) + 1;
    reward = first ? 30 : 8; if (first) { chestGive(1); chest = true; } head = t('lb.bossWon');
    logEvent('lg.tboss', { name: topicName(lv.subj, lv.topic) });
  }
  addCoins(reward); save(); setMusic(''); sfx.win(); wxStop(); cleanBossFx(); { const vi = $('#vsIntro'); if (vi) vi.hidden = true; }
  const m = ms(), h = hs(), pm = fx.pos(m);
  if (!S.sensory) { pose(h, 'cheer', 1500); fx.burst(pm.x, pm.y, 24, ['⭐', '✨', '📘', '🎉']); fx.coins(m, 5); m.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'translate(26px,-60px) scale(.15) rotate(540deg)', opacity: 0 }], { duration: 1000, easing: 'ease-in', fill: 'forwards' }); }
  announce(t('sr.win', { m: lv.mon.n, n: 0 }), true);
  await wait(S.sensory ? 400 : 1500); if (B.token !== tk) return;
  B.q = null; B.token++; B.active = false; lockUI(); $('#answers').innerHTML = ''; setAdvView('map');
  const back = lv.special === 'lesson' ? `<button class="btn big" data-act="lessonGo" data-v="${lv.lessonId}">📘 ${t('lb.back')}</button>` : `<button class="btn big" data-act="studiesGo" data-v="${lv.subj}">📚 ${t('lb.backStudies')}</button>`;
  $('#winSheet').innerHTML = `<h2>${lv.special === 'lesson' ? '📘' : '👑'} ${esc(head)}</h2><div class="win-av"><div class="wa-h pose-cheer">${heroSVG(S.equipped)}</div><div class="wa-m">${monsterSVG(lv.mon, lv.hue || 0)}</div></div>
    <p class="sub">${esc(lvT(lv).place)}</p><div class="wline"><span class="gain">+${reward} 🪙</span>${chest || S.chestQ > 0 ? chestBtnHTML() : ''}</div>${coopSummaryHTML()}
    <div class="wbtns">${back}<div class="wsmall"><button class="btn ghost" data-act="retry" data-v="${lv.id}">🔁 ${t('v.retry')}</button><button class="btn ghost" data-act="toMap">🗺️ ${t('v.map')}</button></div></div>`;
  $('#winOverlay').classList.add('on'); setTimeout(syncMusic, 2600);
}
function openLesson(id) {
  const m = MODULES.find(x => x.id === id); if (!m) return;
  $('#winOverlay').classList.remove('on');
  showTab('studies', true); UI.act = null; UI.list = m.subject; UI.open = id; UI.lc = 0; UI.fade = 0; UI.lit = new Set(); UI.blended = false; UI.react = -1;
  renderStudies();
}

/* ---------------- battle tips: "Try the lesson on this" ---------------- */
function lessonForTopic(topic, subj) {
  if (!topic) return null;
  const s = String(topic).split('_')[0], tp = String(topic).slice(s.length + 1), sub = SUBJ_ORDER.includes(s) ? s : subj;
  const list = MODULES.filter(m => m.subject === sub && (lessonTopic(m) === tp || (sub === 'math' && LMATH_FAM[m.id] === tp)));
  const mine = list.filter(m => m.bands.includes(S.band));
  return (mine.find(m => !learnedAt(m.id)) || mine[0] || list[0]) || null;
}
function lessonSuggestion() {
  const miss = B.miss || {}, top = Object.entries(miss).sort((a, b) => b[1] - a[1])[0];
  if (!top || !(top[1] >= 2 || (B.ko || 0) > 0)) return null;
  return lessonForTopic(top[0], B.lv && B.lv.subj);
}
const sugHTML = m => `<button class="wchip lessonsug" data-act="lessonGo" data-v="${m.id}"><span aria-hidden="true">📘</span> ${t('sg.try')} <b>${esc(tr(m, 'title'))}</b></button>`;
HOOK.before('wrongPick', () => { if (B.q && B.wrong === 0 && B.q.topic) { const M = B.miss || (B.miss = {}); M[B.q.topic] = (M[B.q.topic] || 0) + 1; } });
HOOK.around('win', async next => {
  if (B.lv && LKINDS.has(B.lv.special)) { victoryPrelude(); return lessonWin(); }
  const sug = lessonSuggestion();
  await next();
  const wb = $('#winSheet .wbtns'); if (sug && wb && wb.insertAdjacentHTML && !$('#winSheet .lessonsug')) wb.insertAdjacentHTML('beforebegin', sugHTML(sug));
});
HOOK.around('heroKO', async next => {
  const sug = UI.run ? lessonSuggestion() || lessonForTopic(B.q && B.q.topic, B.lv && B.lv.subj) : null;
  const r = await next();
  const wb = $('#winSheet .wbtns'); if (sug && !UI.run && UI.lastRun && wb && wb.insertAdjacentHTML && !$('#winSheet .lessonsug')) wb.insertAdjacentHTML('beforebegin', sugHTML(sug));
  return r;
});

/* ---------------- study buffs ---------------- */
HOOK.on('pracFinish', (m, p) => {
  if (p.mode === 'prac' && bonusOn() && SUBJ_ORDER.includes(m.subject)) { S.sbuff = { subj: m.subject, at: Date.now() }; p.buff = true; save(); }
});
HOOK.filter('atkBonus', v => v + (B.active && B.sbuff ? 3 : 0));
HOOK.on('startBattle', () => {
  B.miss = {}; B.sbuff = false;
  const sb = S.sbuff;
  if (sb && Date.now() - (sb.at || 0) > 3 * 864e5) S.sbuff = null;
  else if (sb && bonusOn() && B.lv && B.lv.subj === sb.subj) { B.sbuff = true; S.sbuff = null; save(); toast('📚 ' + t('sb.on', { s: t('subj.' + sb.subj) })); }
});

/* ---------------- the lesson sheet and the lesson list ---------------- */
function lessonExtras() {
  const sh = $('#lessonSheet'); if (!sh || !sh.querySelector) return;
  if (UI.list) {   // the lesson list: ladders instead of a flat grid
    const ls = $('#lessonListSheet'), g = ls && ls.querySelector ? ls.querySelector('.lgrid') : null;
    if (g && g.insertAdjacentHTML) { g.insertAdjacentHTML('afterend', '<div class="ldwrap"></div>'); g.remove(); }
    setHTML(ls && ls.querySelector ? ls.querySelector('.ldwrap') : null, laddersHTML(UI.list));   // v30: the list itself is only rebuilt when it changed
  }
  const m = UI.open && MODULES.find(x => x.id === UI.open); if (!m || !m.body || UI.act) return;
  const lb = sh.querySelector('.lbody'); if (!lb || !lb.insertAdjacentHTML) return;
  const qc = qcHTML(m); if (qc) lb.insertAdjacentHTML('afterbegin', qc);
  const learn = sh.querySelector('.lsec.learn'), tb = tbHTML(m); if (learn && tb) learn.insertAdjacentHTML('afterend', tb);
  const prac = sh.querySelector('.lsec.practice'), pt = printSecHTML(m); if (prac && pt) prac.insertAdjacentHTML('beforebegin', pt);
  const p = UI.prac && UI.prac.id === m.id ? UI.prac : null, seg = p && p.done ? sh.querySelector('.prac.done .seg') : null;
  if (seg && seg.insertAdjacentHTML && p.mode === 'prac' && bonusOn() && SUBJ_ORDER.includes(m.subject)) {
    seg.insertAdjacentHTML('beforeend', `<button class="btn bridge" data-act="bridgeGo" data-v="${m.id}">⚔️ ${t('lb.go')}</button>`);
    if (p.buff) seg.insertAdjacentHTML('afterend', `<p class="sbuff">📚 ${t('sb.ready', { s: t('subj.' + m.subject) })}</p>`);
  }
  const nb = (S.notebook || {})[m.id], done = sh.querySelector('.ldone');
  if (nb && done && done.insertAdjacentHTML) done.insertAdjacentHTML('afterend', `<p class="nb-saved">📒 ${t('nb.saved')} <button class="linkbtn" data-act="actOpen" data-v="notebook">${t('nb.open')}</button></p>`);
}
HOOK.on('renderStudies', () => lessonExtras());

/* ---------------- parent switch ---------------- */
HOOK.on('renderParent', () => {
  const c = $('#tab-parent .set27') || $('#tab-parent [data-act="sensory"]'), card = c && c.closest ? (c.classList && c.classList.contains('set27') ? c : c.closest('.card')) : null;
  if (!card || !card.insertAdjacentHTML) return;
  card.insertAdjacentHTML('afterend', `<div class="card set28"><h3 style="margin:0 0 8px">📚 ${t('pp28.title')}</h3><div class="seg">${tog('set28', 'pp28.bonus', S.studyBonus !== false)}</div><p class="sub" style="margin:10px 0 0">${t('pp28.note')}</p></div>`);
});

/* ---------------- events ---------------- */
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'open': if (UI.tb && UI.tb.id !== v) UI.tb = null; if (UI.qcFor !== v) { UI.qcFor = null; UI.qc = null; } break;
    case 'lessonDone': { const m = MODULES.find(x => x.id === v); if (m && !learnedAt(v) && noteAdd(m)) toast('📒 ' + t('nb.added')); break; }
    case 'ladLocked': toast(t('ld.locked', { r: t('ld.r' + Math.max(0, (+v || 1) - 1)) })); return true;
    case 'ladPrac': { const [id, mode] = String(v).split(':'), m = MODULES.find(x => x.id === id); if (!m) return true; UI.open = id; UI.lc = 0; UI.qcFor = id; UI.qc = null; pracStart(m, mode === 'quiz' ? 'quiz' : 'prac'); renderStudies(); setTimeout(() => { const el = $('#lessonSheet .lsec.practice'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' }); }, 60); return true; }
    case 'qcPick': qcPick(+v); return true;
    case 'qcHide': if (UI.qc) UI.qc.hidden = true; renderStudies(); return true;
    case 'qcSkip': { const m = UI.open && MODULES.find(x => x.id === UI.open); if (UI.qc) UI.qc.hidden = true; if (m) { pracStart(m, 'prac'); renderStudies(); setTimeout(() => { const el = $('#lessonSheet .lsec.practice'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: S.sensory ? 'auto' : 'smooth' }); }, 40); } return true; }
    case 'tbPick': tbPick(+v); return true;
    case 'printLesson': { const m = MODULES.find(x => x.id === v); if (m) printPage(tr(m, 'title'), artSVG(artFor(m)), t('pt.note')); return true; }
    case 'bridgeGo': lessonBattle('lesson:' + v); return true;
    case 'tbossGo': lessonBattle('tboss:' + v); return true;
    case 'lessonGo': if (!B.active) openLesson(v); return true;
    case 'studiesGo': if (!B.active) { $('#winOverlay').classList.remove('on'); showTab('studies', true); UI.list = v; UI.open = null; renderStudies(); } return true;
    case 'set28': S.studyBonus = S.studyBonus === false; save(); renderParent(); return true;
  }
  return undefined;
});

Object.assign(STR, {
  'lc.pic': ['Look', 'Lihat'],
  'ld.r0': ['Starter', 'Permulaan'], 'ld.r1': ['Builder', 'Pembina'], 'ld.r2': ['Expert', 'Pakar'],
  'ld.note': ['Each topic is a ladder: finish the Starter lessons to open Builder, then Expert.', 'Setiap topik ialah tangga: habiskan pelajaran Permulaan untuk membuka Pembina, kemudian Pakar.'],
  'ld.prog': ['{n} of {m} lessons done', '{n} daripada {m} pelajaran siap'], 'ld.lockedShort': ['Locked', 'Berkunci'], 'ld.shut': ['{n} lesson(s) wait here', '{n} pelajaran menunggu di sini'],
  'ld.locked': ['Finish the {r} lessons first.', 'Habiskan pelajaran {r} dahulu.'],
  'ld.fillPrac': ['Practice set: 3 questions', 'Set latihan: 3 soalan'], 'ld.fillQuiz': ['Expert quiz: get 3 or more', 'Kuiz pakar: dapatkan 3 atau lebih'],
  'ld.boss': ['Topic boss', 'Bos topik'], 'ld.bossGo': ['Awake! Tap to fight', 'Sudah bangun! Sentuh untuk lawan'], 'ld.bossAgain': ['Beaten. Fight again', 'Sudah dikalahkan. Lawan lagi'],
  'ld.bossHow': ['Finish all lessons to wake it ({n}/{m})', 'Habiskan semua pelajaran untuk membangunkannya ({n}/{m})'],
  'qc.title': ['Quick check', 'Semakan pantas'], 'qc.sub': ['Warm-up question {i} of 2', 'Soalan memanaskan badan {i} daripada 2'],
  'qc.yes': ['Right!', 'Betul!'], 'qc.no': ['The answer is: {a}', 'Jawapannya: {a}'], 'qc.skipWarm': ['Skip the warm-up', 'Langkau memanaskan badan'],
  'qc.both': ['Both right! You already know a lot about this.', 'Kedua-duanya betul! Kamu sudah tahu banyak tentang ini.'],
  'qc.learn': ['You got {n} of 2. This lesson will help!', 'Kamu dapat {n} daripada 2. Pelajaran ini akan membantu!'],
  'qc.skip': ['Skip to practice', 'Terus ke latihan'], 'qc.read': ['Read the lesson', 'Baca pelajaran'],
  'tb.title': ['Explain it', 'Terangkan'], 'tb.sub': ['Which sentence explains what this lesson taught?', 'Ayat manakah yang menerangkan apa yang diajar dalam pelajaran ini?'],
  'tb.yesFirst': ['Yes! You really understand it. +2 🪙', 'Ya! Kamu betul-betul faham. +2 🪙'], 'tb.yes': ['Yes, that is the one!', 'Ya, itulah jawapannya!'],
  'tb.no': ['That sentence is from another lesson. Try again!', 'Ayat itu daripada pelajaran lain. Cuba lagi!'],
  'nb.title': ['My notebook', 'Buku nota saya'], 'nb.sub': ['{n} tips to remember, one from each lesson you finished.', '{n} tip untuk diingat, satu daripada setiap pelajaran yang kamu habiskan.'],
  'nb.empty': ['Finish a lesson and its "Remember" tip will be saved here.', 'Habiskan satu pelajaran dan tip "Ingat" akan disimpan di sini.'],
  'nb.added': ['Tip saved to your notebook!', 'Tip disimpan dalam buku nota kamu!'], 'nb.saved': ['This tip is in your notebook.', 'Tip ini ada dalam buku nota kamu.'], 'nb.open': ['Open notebook', 'Buka buku nota'],
  'pt.title': ['Print & colour', 'Cetak & warna'], 'pt.sub': ['Print this page and colour it in with crayons.', 'Cetak halaman ini dan warnakan dengan krayon.'], 'pt.go': ['Print colouring page', 'Cetak halaman mewarna'],
  'pt.name': ['Name:', 'Nama:'], 'pt.note': ['Colour me in!', 'Warnakan saya!'], 'pt.fail': ['Printing is not available here.', 'Cetakan tidak tersedia di sini.'],
  'pt.trace': ['Trace the dotted lines, then colour!', 'Surih garis titik-titik, kemudian warnakan!'],
  'lb.go': ['3-round battle', 'Pertarungan 3 pusingan'], 'lb.goal': ['Questions from this lesson only.', 'Soalan daripada pelajaran ini sahaja.'],
  'lb.bossGoal': ['A mini boss with questions from this topic only.', 'Bos kecil dengan soalan daripada topik ini sahaja.'],
  'lb.won': ['Lesson battle won!', 'Pertarungan pelajaran dimenangi!'], 'lb.bossWon': ['Topic boss beaten!', 'Bos topik dikalahkan!'],
  'lb.back': ['Back to the lesson', 'Kembali ke pelajaran'], 'lb.backStudies': ['Back to Studies', 'Kembali ke Pelajaran'],
  'lg.tboss': ['Beat the topic boss of {name}', 'Mengalahkan bos topik {name}'],
  'sg.try': ['Try the lesson on this:', 'Cuba pelajaran tentang ini:'],
  'sb.ready': ['Study buff ready: +3 attack in your next {s} battle!', 'Kuasa belajar sedia: +3 serangan dalam pertarungan {s} seterusnya!'],
  'sb.on': ['Study buff: +3 attack this battle ({s})', 'Kuasa belajar: +3 serangan dalam pertarungan ini ({s})'],
  'pp28.title': ['Studies', 'Pelajaran'], 'pp28.bonus': ['Study buffs and bonus modes: {s}', 'Kuasa belajar dan mod bonus: {s}'],
  'pp28.note': ['Quick checks, lesson battles, topic bosses, study buffs and bonus words. Turn off to keep Studies simple. Calm mode turns them off too.', 'Semakan pantas, pertarungan pelajaran, bos topik, kuasa belajar dan perkataan bonus. Matikan supaya Pelajaran lebih ringkas. Mod tenang juga mematikannya.']
});
