/* ================= Language + navigation ================= */
function applyLang() {
  $$('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  $('#langCode').textContent = LANGS[S.lang].c; $('#langName').textContent = LANGS[S.lang].n;
  $('#langBtn').setAttribute('aria-label', t('lang.change')); document.documentElement.lang = S.lang;
  $$('.mclose').forEach(b => b.setAttribute('aria-label', t('st.close')));
  syncFS(); updMusBtn();
  if ($('#wcard')) retitleBattle();
}
/* ---- fullscreen (top-left button) ---- */
const fsRoot = document.documentElement;
const fsSupported = !!(fsRoot.requestFullscreen || fsRoot.webkitRequestFullscreen);
const fsActive = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
function syncFS() {
  const b = $('#fsBtn'); if (!b) return; const on = fsActive();
  b.hidden = !fsSupported; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.setAttribute('aria-label', t(on ? 'fs.exit' : 'fs.enter'));
}
function toggleFullscreen() {
  try {
    const p = fsActive() ? (document.exitFullscreen || document.webkitExitFullscreen).call(document) : (fsRoot.requestFullscreen || fsRoot.webkitRequestFullscreen).call(fsRoot, { navigationUI: 'hide' });
    if (p && p.catch) p.catch(() => { });
  } catch (_) { }
}
document.addEventListener('fullscreenchange', syncFS); document.addEventListener('webkitfullscreenchange', syncFS);
function setLang(l) {
  S.lang = l; save(); applyTheme(); applyLang(); showTab(UI.tab, true);
  if ($('#briefOverlay').classList.contains('on') && UI.brief) openBrief(UI.brief);
  if ($('#welcomeOverlay').classList.contains('on')) renderWelcome();
  if (bedUp) showBedtime(); else if (timeUp) showTimeUp();
  syncWhoBtn();
  if (UI.tab === 'adventure' && UI.adv === 'battle' && B.q && !B.locked) nextQuestion();
}
/* while a battle is running every other tab is closed and cannot be opened */
function lockUI() { document.documentElement.dataset.battle = B.active ? '1' : '0'; const n = $('.nav'); if (B.active) n.setAttribute('inert', ''); else n.removeAttribute('inert'); }
function showTab() { return HOOK.call('showTab', showTabBase, arguments); }   // v31: extensions register with HOOK (00c)
function showTabBase(name, force) {
  if (name !== 'armory') { clearInterval(havenTimer); UI.pv = {}; }
  if (B.active && name !== 'adventure' && !force) { toast(t('lock.toast')); return; }
  if (UI.tab === 'parent' && name !== 'parent') gate.unlocked = false;
  if (name === 'adventure' && UI.tab !== 'adventure' && !B.active) UI.screen = 'subjects';
  UI.tab = name; if (name !== 'studies' && UI.list) { UI.list = null; UI.open = null; renderStudies(); }
  $$('.tab').forEach(x => x.classList.toggle('on', x.id === 'tab-' + name));
  $$('.nav button').forEach(b => { const on = b.dataset.v === name; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  if (name === 'studies') renderStudies();
  if (name === 'armory') renderArmory();
  if (name === 'parent') { gate.t = Date.now(); renderParent(); }
  if (name === 'cards') renderCards();
  if (name === 'adventure') enterAdventure();
  lockUI(); syncTimeOverlay(); syncMusic();
}

/* ================= Studies (with concreteness-fading lab) ================= */
function mountStudyManips() {
  $$('#tab-studies [data-manip], #lessonSheet [data-manip]').forEach(h => {
    const k = h.dataset.manip;
    if (k === 'ten') mountManip(h, { type: 'ten', hundreds: true });
    else if (k === 'frac') mountManip(h, { type: 'frac', n0: 1, shade: [], total: 12 });
    else { const m = MODULES.find(x => x.id === k); mountManip(h, { type: 'unit', ...m.fade.unit }); }
  });
}
/* ---- v11: every lesson section shares one look: a heading, a row of chips, and one card at a time ---- */
const LCX = (en, ms) => [en, ms];
Object.assign(STR, {
  'lc.title': LCX('Learn it step by step', 'Belajar langkah demi langkah'),
  'lc.idea': LCX('Big idea', 'Idea utama'), 'lc.ex': LCX('Example', 'Contoh'), 'lc.try': LCX('Try it', 'Cuba'),
  'lc.tip': LCX('Remember', 'Ingat'), 'lc.fact': LCX('Fun fact', 'Fakta menarik'), 'lc.warn': LCX('Watch out', 'Awas'),
  'lc.next': LCX('Next ▶', 'Seterusnya ▶'), 'lc.back': LCX('◀ Back', '◀ Kembali'), 'lc.done': LCX('All done ✔', 'Selesai ✔'),
  'lc.step': LCX('Card {i} of {n}', 'Kad {i} daripada {n}'), 'lc.picture': LCX('Picture it', 'Lihat gambarnya'),
  'lc.words': LCX('Key words', 'Kata kunci'), 'lc.play': LCX('Play with it', 'Main dengannya')
});
const LC_KIND = { idea: ['💡', 'lc.idea'], ex: ['👀', 'lc.ex'], try: ['✋', 'lc.try'], tip: ['🧠', 'lc.tip'], fact: ['✨', 'lc.fact'], warn: ['⚠️', 'lc.warn'] };
const LC_RX = [
  ['try', /^(try it|try this|cuba ini|cuba)\s*:\s*/i],
  ['tip', /^(memory tip|tip ingatan|tip ingat|tip|remember|ingat)\s*:\s*/i],
  ['fact', /^(fun fact|fakta menarik|good to know|baik diketahui)\s*:\s*/i],
  ['warn', /^(careful|common mistake|mistake to avoid|awas|kesilapan biasa|kesilapan untuk dielak|kesilapan yang perlu dielakkan)\s*:\s*/i],
  ['ex', /^(another example|examples?|contoh lain|contoh|one more|read|baca)\s*:\s*/i]
];
/* split a lesson into small cards: the first line is the big idea, then examples, a try-it, a tip, a fun fact or a watch-out */
function lessonCards() { return HOOK.call('lessonCards', lessonCardsBase, arguments); }   // v31: extensions register with HOOK (00c)
function lessonCardsBase(m) {
  return tr(m, 'body').map((line, i) => {
    let kind = i === 0 ? 'idea' : 'ex', text = String(line).trim();
    for (const [k, rx] of LC_RX) if (rx.test(text)) { kind = k; text = text.replace(rx, ''); break; }
    if (kind === 'ex' && /activity below|aktiviti di bawah|^try |^cuba /i.test(text)) kind = 'try';
    return { kind, text };
  });
}
/* one sentence per line, with numbers and sums picked out so they are easy to spot */
const lcSentences = txt => (txt.match(/[^.!?]+(?:[.!?]+["”’']?|$)/g) || [txt]).map(x => x.trim()).filter(Boolean);
const lcMark = s => esc(s).replace(/(“[^”]{1,40}”|&quot;(?:(?!&quot;).){1,40}&quot;)/g, '\u0001$1\u0002').replace(/(\d+(?:[.,]\d+)*(?:\s*[+−×÷=–-]\s*\d+(?:[.,]\d+)*)+|\d+(?:[.,]\d+)*)/g, '<b class="lc-n">$1</b>').replace(/\u0001/g, '<b class="lc-q">').replace(/\u0002/g, '</b>');
/* the shared section shell: icon + heading, a chip bar, then the panel */
const lsec = (ic, title, chips, panel, cls = '') => `<section class="lsec ${cls}"><div class="lsec-h"><span class="lsec-ic" aria-hidden="true">${ic}</span><h3>${esc(title)}</h3></div>${chips ? `<div class="seg lsteps" role="group">${chips}</div>` : ''}${panel}</section>`;
function lessonCardsHTML() { return HOOK.call('lessonCardsHTML', lessonCardsHTMLBase, arguments); }   // v31: extensions register with HOOK (00c)
function lessonCardsHTMLBase(m) {
  const cards = lessonCards(m), n = cards.length, cur = Math.max(0, Math.min(n - 1, UI.lc || 0)), c = cards[cur], [ic, key] = LC_KIND[c.kind];
  const chips = cards.map((x, i) => `<button class="chip lstep k-${x.kind} ${i < cur ? 'seen' : ''}" data-act="lcard" data-v="${i}" aria-pressed="${i === cur}" aria-label="${esc(t(LC_KIND[x.kind][1]))}"><span aria-hidden="true">${LC_KIND[x.kind][0]}</span><b>${t(LC_KIND[x.kind][1])}</b></button>`).join('');
  const sents = lcSentences(c.text);
  const panel = `<article class="lpanel k-${c.kind}" aria-live="polite"><header><span class="lp-ic" aria-hidden="true">${ic}</span><b>${t(key)}</b><small>${t('lc.step', { i: cur + 1, n })}</small><button class="speak" data-act="say" data-say="${esc(c.text)}" aria-label="${esc(t('st.listen'))}">🔊</button></header><ul class="lp-lines">${sents.map((x, i) => `<li style="--i:${i}">${lcMark(x)}</li>`).join('')}</ul></article>
    <div class="lc-nav"><button class="btn ghost" data-act="lcPrev" ${cur === 0 ? 'disabled' : ''}>${t('lc.back')}</button><span class="lc-dots" aria-hidden="true">${cards.map((_, i) => `<i class="${i === cur ? 'on' : i < cur ? 'seen' : ''}"></i>`).join('')}</span><button class="btn ${cur === n - 1 ? 'good' : ''}" data-act="lcNext" data-n="${n}">${cur === n - 1 ? t('lc.done') : t('lc.next')}</button></div>`;
  return lsec('📘', t('lc.title'), chips, panel, 'learn');
}
function fadeDemo(m) {
  const names = ['concrete', 'pictorial', 'abstract'], st = UI.fade;
  const seg = names.map((n, i) => `<button class="chip lstep" data-act="fade" data-v="${i}" aria-pressed="${st === i}"><span aria-hidden="true">${['🧱', '🖼️', '🔢'][i]}</span><b>${t('rep.' + n)}</b></button>`).join('');
  const body = st === 0 ? `<div data-manip="${m.id}"></div>` : st === 1 ? barSVG(m.bar) : `<div class="eq">${esc(m.fade.eq)}</div>`;
  const panel = `<article class="lpanel k-see"><header><span class="lp-ic" aria-hidden="true">${['🧱', '🖼️', '🔢'][st]}</span><b>${t('rep.' + names[st])}</b><small>${st + 1}/3</small></header><p class="lp-note">${t('rep.' + names[st] + 'Txt')}</p><div class="lp-viz">${body}</div></article>`;
  return lsec('👁️', t('rep.title'), seg, panel, 'see');
}
function blendDemo() {
  const [w, e, parts] = BLEND_WORDS[UI.blendIdx % BLEND_WORDS.length], ready = UI.lit.size >= parts.length;
  return `<div class="viz lpanel k-see"><div class="clue">${UI.blended ? e : '❓'}</div>
    <div class="btiles ${UI.blended ? 'joined' : ''}">${parts.map((p, i) => `<button class="btile ${UI.lit.has(i) || UI.blended ? 'lit' : ''}" data-act="blendTile" data-v="${i}">${esc(p)}</button>`).join('')}</div>
    <div class="seg" style="justify-content:center"><button class="btn" data-act="blend" ${ready ? '' : 'disabled'}>${t('bl.go')}</button><button class="btn ghost" data-act="blendNext">${t('bl.next')}</button></div>
    ${UI.blended ? `<p class="note" style="margin-top:10px;text-align:center">${parts.join(' + ')} = <b>${w}</b></p>` : `<p class="sub" style="text-align:center;margin:10px 0 0">${t('bl.pick')}</p>`}</div>`;
}
function reactDemo() {
  const r = UI.react >= 0 ? REACTIONS[UI.react] : null;
  return `<div class="viz lpanel k-see"><div class="react-row">${REACTIONS.map((x, i) => `<button class="btn ${UI.react === i ? '' : 'ghost'}" data-act="react" data-v="${i}"><span style="font-size:1.3rem">${x.c}</span>${esc(tr(x, 'label'))}</button>`).join('')}</div>
    ${r ? `<div class="effect"><span class="e">${r.e}</span><p style="flex:1"><b>${t('rx.effect')}</b> ${esc(tr(r, 't'))}</p><button class="speak" data-act="say" data-say="${esc(t('rx.cause', { c: tr(r, 'label'), e: tr(r, 't') }))}" aria-label="${esc(t('st.listen'))}">🔊</button></div>` : `<p class="sub" style="margin:4px 0 0">${t('rx.pick')}</p>`}</div>`;
}
function renderStudies() { return HOOK.call('renderStudies', renderStudiesBase, arguments); }   // v31: extensions register with HOOK (00c)
function renderStudiesBase() {
  if (UI.sage === undefined || UI.sage === null) UI.sage = S.band;
  const ageOk = m => UI.sage === 0 || m.bands.includes(UI.sage);
  const subjTiles = SUBJECTS.map(([id, em]) => {
    const n = MODULES.filter(m => m.subject === id).length, off = !subjOpen(id);
    return `<button class="subject ${off ? 'off' : ''}" style="--c:${SUBJ_COL[id]}" data-act="subject" data-v="${id}" ${off ? `aria-disabled="true"` : ''}>${off ? `<span class="offtag">🔒 ${t('sj.offTag')}</span>` : ''}<span class="em">${em}</span><b>${t('subj.' + id)}</b><small>${t('st.count', { n })}</small></button>`;
  }).join('');
  const traceTile = `<button class="subject trace-tile" style="--c:#3FBF7F" data-act="traceOpen"><span class="em">✍️</span><b>${t('tr.title')}</b><small>${t('tr.tileSub')}</small></button>`;   // v21: tracing practice (shown first for age 4)
  /* v25: the flashcards tile is gone from Studies */
  setHTML($('#tab-studies'), `<div class="wrap"><h1 class="title">${t('st.title')}</h1>${petStripHTML()}${subjBannerHTML()}${lotwCardHTML()}<div class="subjects">${S.band === 1 ? traceTile + subjTiles : subjTiles + traceTile}</div><div class="actslot"></div></div>`);
  /* lesson list modal: opens when a subject card is tapped */
  const lo = $('#lessonListOverlay'), ls = $('#lessonListSheet'), sub = UI.list && SUBJECTS.find(x => x[0] === UI.list);
  if (!sub) { lo.classList.remove('on'); setHTML(ls, ''); }
  else {
    const mods = MODULES.filter(m => m.subject === sub[0] && ageOk(m)); ensureLessonsBand(sub[0], S.band).catch(() => {});
    const ages = [1, 2, 3, 4, 0].map(b => `<button class="chip" data-act="sage" data-v="${b}" aria-pressed="${UI.sage === b}">${b ? t('band.' + b) : t('st.ageAll')}</button>`).join('');
    const cards = mods.map(m => `<button class="lcard" data-act="open" data-v="${m.id}"><span class="em">${m.em}</span><span class="t">${esc(tr(m, 'title'))}<small>${t('st.min', { n: m.min })}${S.learned[m.id] ? ' · ✔' : ''}</small></span></button>`).join('') || `<p class="note">${t('st.none')}</p>`;
    const top = ls.scrollTop;
    ls.style.setProperty('--c', SUBJ_COL[sub[0]]);
    setHTML(ls, `<div class="lhead"><span class="em">${sub[1]}</span><h2>${t('subj.' + sub[0])}</h2></div><div class="seg" style="margin:8px 0 12px">${ages}</div><div class="lgrid">${cards}</div>`);
    lo.classList.add('on'); ls.scrollTop = top;
  }
  const ov = $('#lessonOverlay'), sheet = $('#lessonSheet'), m = UI.open && MODULES.find(x => x.id === UI.open);
  if (!m) { if (UI.trace) return renderTracePractice(); ov.classList.remove('on'); sheet.innerHTML = ''; mountStudyManips(); return; }
  if (!m.body) {   // v21: lesson text for this subject is still loading
    sheet.innerHTML = `<div class="lhead"><span class="em">${m.em}</span><h2>${esc(tr(m, 'title'))}</h2></div><p class="sub lload">⏳ ${t('st.loading')}</p>`; ov.classList.add('on');
    ensureLesson(m).then(() => { if (UI.open === m.id) renderStudies(); }, () => { if (UI.open === m.id) sheet.querySelector('.lload').textContent = t('st.loadFail'); });
    return;
  }
  const top = sheet.scrollTop, title = tr(m, 'title'), body = tr(m, 'body'), say = [title, ...body].join('. ');
  sheet.innerHTML = `<div class="lhead"><span class="em">${m.em}</span><h2>${esc(title)}</h2></div>
    <p class="sub" style="margin:2px 0 8px">${t('st.min', { n: m.min })} · ${m.bands.map(b => t('band.' + b)).join(', ')}</p>
    <div class="listen"><button class="speak" data-act="say" data-say="${esc(say)}" aria-label="${esc(t('st.listen'))}">🔊</button><span class="sub" style="margin:0">${t('st.listen')}</span></div>
    <div class="lbody">${lessonCardsHTML(m)}
    ${m.fade ? fadeDemo(m) : m.bar ? lsec('🖼️', t('lc.picture'), '', `<div class="viz lpanel k-see">${barSVG(m.bar)}</div>`, 'see') : ''}${m.demo === 'blend' ? lsec('🎮', t('lc.play'), '', blendDemo(), 'see') : ''}${m.demo === 'react' ? lsec('🎮', t('lc.play'), '', reactDemo(), 'see') : ''}${m.demo === 'ten' ? lsec('🎮', t('lc.play'), '', '<div class="viz lpanel k-see"><div data-manip="ten"></div></div>', 'see') : ''}${m.demo === 'frac' ? lsec('🎮', t('lc.play'), '', '<div class="viz lpanel k-see"><div data-manip="frac"></div></div>', 'see') : ''}</div>
    ${demoHTML(m)}${pracHTML(m)}${lessonDoneHTML(m)}<button class="btn ghost" style="width:100%;margin-top:12px" data-act="closeLesson">${t('st.close')}</button>`;
  ov.classList.add('on'); sheet.scrollTop = top; mountStudyManips(); mountDemos(sheet);
}

/* ================= Armory ================= */
/* v22 balance: the hero was too strong. Monsters have more health (more in later zones), hit a little harder,
   and tools and shields help a little less. */
const BAL = { hpRound: 21, hpZone: 1.2, atkBase: 9, atkPower: .35, hit: 2.0, guard: .4 };   // v38: a weaker hero (was atkBase 13, atkPower .45, hit 1.7, guard .55)
const atk = () => BAL.atkBase + Math.round(power() * BAL.atkPower) + atkBonus();   // v27: hero level perks, weapon upgrades, relics (22)
function renderArmory() { return HOOK.call('renderArmory', renderArmoryBase, arguments); }   // v31: extensions register with HOOK (00c)
function renderArmoryBase() {
  if (UI.arm === 'haven') { renderHaven(); return; }
  lazyReset();
  clearInterval(havenTimer);
  const pv = UI.pv || (UI.pv = {});
  const slots = S.pixel ? KNIGHT_SLOTS : SLOTS.filter(id => id !== 'knight');
  if (!slots.includes(UI.slot)) UI.slot = slots[0];
  const look0 = dressLook({ ...S.equipped, ...pv }, Object.keys(pv).find(k => DRESS.has(k))), look = Object.keys(pv).length ? look0 : markMe(look0);   // v35: the wardrobe and an evolved weapon show on the hero (not on a try-on)
  const items = ITEMS.filter(i => i.slot === UI.slot).sort((a, b) => a.cost - b.cost);
  const inSlots = ITEMS.filter(i => slots.includes(i.slot)), owned = inSlots.filter(i => S.owned.includes(i.id)).length;
  const chips = slots.map(id => `<button class="chip" data-act="slot" data-v="${id}" aria-pressed="${UI.slot === id}"><span aria-hidden="true">${SLOT_EM[id]}</span> ${t('sl.' + id)}</button>`).join('');
  const cards = items.map(it => {
    const own = S.owned.includes(it.id), worn = S.equipped[it.slot] === it.id;
    const stat = it.slot === 'knight' ? t('kn.' + it.role) : it.slot === 'pet' && it.id !== 'pet_none' ? petPerkText(it.id, petStage(it.id)) : it.power !== undefined ? (it.power ? t('ar.powerStat', { n: it.power }) : t('ar.starter')) : it.guard !== undefined ? (it.guard ? t('ar.guardStat', { n: Math.round(it.guard * 100) }) : '') : (it.cost ? t('ar.style') : t('ar.free'));
    let btn;
    if (worn) btn = `<button class="btn good" disabled>${t('ar.wearing')}</button>`;
    else if (own) btn = `<button class="btn ghost" data-act="equip" data-v="${it.id}">${t('ar.wear')}</button>`;
    else if (S.coins >= it.cost) btn = `<button class="btn" data-act="buy" data-v="${it.id}">${t('ar.buy', { c: it.cost })}</button>`;
    else btn = `<button class="btn ghost" disabled>${t('ar.need', { n: it.cost - S.coins })}</button>`;
    const trying = pv[it.slot] === it.id;
    if (it.slot === 'finisher') return `<div class="item fin ${worn ? 'worn' : ''}"><button class="item-pv finic" data-act="finPv" data-v="${it.id}" aria-label="${esc(t('fin.preview') + ' ' + itemName(it))}"><span aria-hidden="true">${it.fem}</span><em>${t('fin.preview')}</em></button><b>${esc(itemName(it))}</b><small>${t('fin.stat')}</small>${btn}</div>`;   // v22
    return `<div class="item ${worn ? 'worn' : ''} ${trying ? 'trying' : ''}" data-act="preview" data-v="${it.id}"><button class="item-pv" data-act="preview" data-v="${it.id}" aria-pressed="${trying}" aria-label="${esc(t('ar.tryOn', { name: itemName(it) }))}">${it.slot === 'pet' && it.id !== 'pet_none' ? `<span class="pv-pet">${petTight(it.id, own ? petStage(it.id) : 1)}</span>` : lazyHero(dressLook({ ...S.equipped, [it.slot]: it.id }, it.slot))}${trying ? `<span class="pv-badge">${t('ar.trying')}</span>` : ''}</button><b>${esc(itemName(it))}</b><small>${stat}</small>${btn}</div>`;
  }).join('');
  $('#tab-armory').innerHTML = `<div class="wrap">${armTabs()}<h1 class="title">${t('ar.title')}</h1>
    <div class="arm-top"><button class="preview ${Object.keys(pv).length ? 'is-pv' : ''}" data-act="pose" aria-label="${esc(t('ar.pose'))}">${heroSVG(look)}</button><div><h2 style="font-size:1.3rem">${t('ar.hero')}</h2><div class="statline"><span class="stat">${t('ar.power', { n: atk() })}${pvDelta('p')}</span><span class="stat">${t('ar.guard', { n: Math.round(guardPct() * 100) })}${pvDelta('g')}</span><span class="stat">${t('ar.collect', { n: owned, m: inSlots.length })}</span></div><p class="sub" style="margin-top:12px">${t('ar.tip')} ${t('ar.pose')}</p></div></div>
    ${pvBanner()}${petStripHTML()}<div class="slotbar" role="group">${chips}</div>${UI.slot === 'finisher' ? finStageHTML() : ''}<div class="items ${UI.slot === 'knight' ? 'knights' : ''}">${cards}</div></div>`;
  flushLazy(); warmFor('armory');
}
/* v25: switching between Knights / Weapon / Shield / ... keeps the screen still: the chip row keeps its sideways
   scroll, the row stays at the same height on screen, and the page never gets shorter under the player's finger */
function armSwitchSlot(v) { armKeep(() => { UI.slot = v; renderArmory(); }); }
function armKeep(draw) {
  const tab = $('#tab-armory'), bar = tab && tab.querySelector('.slotbar'), wrap = tab && tab.querySelector('.wrap');
  if (!bar) { draw(); return; }
  const top = bar.getBoundingClientRect().top, sl = bar.scrollLeft, h = wrap ? wrap.offsetHeight : 0, st = tab.scrollTop, se = document.scrollingElement, wst = se ? se.scrollTop : 0;
  draw();
  const bar2 = tab.querySelector('.slotbar'), wrap2 = tab.querySelector('.wrap');
  if (wrap2 && h) wrap2.style.minHeight = h + 'px';
  tab.scrollTop = st; if (se) se.scrollTop = wst;
  if (!bar2) return;
  bar2.scrollLeft = sl;
  const d = bar2.getBoundingClientRect().top - top; if (Math.abs(d) > 1) { if (tab.scrollHeight > tab.clientHeight) tab.scrollTop += d; else if (se) se.scrollTop += d; }
  /* the chosen chip slides into view inside the row only if it is cut off (never moves the page) */
  const chip = bar2.querySelector('[aria-pressed="true"]');
  if (chip) { const cr = chip.getBoundingClientRect(), br = bar2.getBoundingClientRect(); if (cr.left < br.left) bar2.scrollLeft -= br.left - cr.left + 8; else if (cr.right > br.right) bar2.scrollLeft += cr.right - br.right + 8; }
  if (chip) try { chip.focus({ preventScroll: true }); } catch (_) { /* old browsers */ }
}
/* ---- try-on preview: tapping a gear card dresses the hero in it without buying ---- */
function pvStats(eq) {
  const bk = S.equipped; S.equipped = eq;
  let r; try { r = { p: atk(), g: Math.round(guardPct() * 100) }; } finally { S.equipped = bk; }
  return r;
}
function pvDelta(k) {
  if (!UI.pv || !Object.keys(UI.pv).length) return '';
  const a = pvStats(S.equipped), b = pvStats({ ...S.equipped, ...UI.pv }), d = b[k] - a[k];
  return d ? ` <b class="pvd ${d > 0 ? 'up' : 'dn'}">${d > 0 ? '▲+' : '▼'}${d}${k === 'g' ? '%' : ''}</b>` : '';
}
function pvBanner() {
  const ids = Object.values(UI.pv || {}).filter(id => ITEM[id]);
  if (!ids.length) return '';
  const unowned = ids.map(id => ITEM[id]).filter(it => !S.owned.includes(it.id));
  const cost = unowned.reduce((a, it) => a + it.cost, 0);
  const names = ids.map(id => esc(itemName(ITEM[id]))).join(', ');
  let buy = '';
  if (unowned.length) buy = S.coins >= cost ? `<button class="btn" data-act="pvBuy">${t('ar.buy', { c: cost })}</button>` : `<button class="btn ghost" disabled>${t('ar.need', { n: cost - S.coins })}</button>`;
  else buy = `<button class="btn" data-act="pvWear">${t('ar.wear')}</button>`;
  return `<div class="pv-banner" role="status"><span class="pv-ico" aria-hidden="true">👀</span><div><b>${t('ar.trying')}</b><small>${names}</small></div>${buy}<button class="btn ghost" data-act="pvReset">${t('ar.pvReset')}</button></div>`;
}
function heroPose(el, name, ms = 900) { if (S.sensory || !el) return; replayClass(el, 'pose-' + name); setTimeout(() => el.classList.remove('pose-' + name), ms); }

/* ================= World map ================= */
const heroXP = () => Object.values(S.stars).reduce((a, b) => a + b, 0) * 3 + S.defeated;
function setAdvView(v) {
  UI.adv = v; $('#mapView').hidden = v !== 'map'; $('#battleView').hidden = v !== 'battle';
  if (v === 'map') { renderMap(); if (!B.active && AU.track) syncMusic(); }   // v21: map music follows the zone mood
}
function enterAdventure() {
  if (UI.adv === 'battle' && B.q) { $('#heroSprite').innerHTML = heroSVG(S.equipped); setAdvView('battle'); renderQViz(); }
  else setAdvView('map');
}

/* ---- Pre-battle briefing ---- */
