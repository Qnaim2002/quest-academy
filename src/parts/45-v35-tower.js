/* ================= v35: a Tower with choices =================
   The Endless Tower (21) used to be the same decision on floor 5 and floor 55: answer, climb. Now a climb has a shape.
   Everything here belongs to ONE climb (it lives in UI.run and starts again from nothing next time):
     PERKS       after every 5th floor the child picks 1 of 3 perks (+1 heart, a forgiven mistake, double coins ...).
     MODIFIERS   about one normal floor in three is special and says so in a banner: Speed, Zen, Order, Mirror, Lucky.
     ROOMS       now and then a quiet room instead of a monster: Campfire, Merchant, Shrine or Puzzle Room.
     SUBJECTS    a climb "mixes" subjects but leans toward the ones the child finds hard; at every 5th floor the
                 child (or a grown-up, through today's focus) can choose a subject, weak spots, or even rotation.
     STORY       a short story beat every 10 floors, and a finale on floor 100.
     MAP         a tall tower with the hero, the next boss as a shadow, check-points and sibling "ghosts".
   Sibling ghosts: the best floor each child reached TODAY is kept in their own save (tower.today); the tower page reads
   the other children's saves on the same device. Nothing leaves the device.
   The run object (UI.run, mode 'tower') gets: seed, perks {id: count}, spent, focus, steps [], sub {floor: subject}, coin2. */
const twRun = () => (UI.run && UI.run.mode === 'tower' ? UI.run : null);
const TW_PERKS = [
  { id: 'heart', em: '❤️', max: 9 }, { id: 'forgive', em: '🛟', max: 1 }, { id: 'coin2', em: '💰', max: 1 }, { id: 'hint4', em: '🦉', max: 1 },
  { id: 'regen', em: '🌿', max: 5 }, { id: 'power', em: '💪', max: 5 }, { id: 'time', em: '⏳', max: 5 }
];
const TW_MODS = [
  { id: 'speed', em: '⚡', rew: 1.5 }, { id: 'zen', em: '🧘', rew: .6 }, { id: 'order', em: '🧩', rew: 1.25 }, { id: 'mirror', em: '🪞', rew: 1.25 }, { id: 'lucky', em: '🍀', rew: 2 }
];
const TW_ROOMS = ['camp', 'shop', 'shrine', 'puzzle'], TW_ROOM_EM = { camp: '🔥', shop: '🧺', shrine: '⛩️', puzzle: '🧩' };
const TW_FOCUS_EM = { mix: '🔀', weak: '🎯', rotate: '🔁' };
const twPerk = id => TW_PERKS.find(p => p.id === id);
const twN = id => { const r = twRun(); return r && r.perks ? r.perks[id] || 0 : 0; };

/* a new climb: seed (so the specials are the same if a floor is retried), perks, wallet, subject plan */
function twNewRun() {
  const o = openSubjects(), f = UI.twFocus;
  return { seed: 1 + Math.floor(Math.random() * 99999), perks: {}, spent: 0, steps: [], sub: {}, coin2: 0, focus: f && (TW_FOCUS_EM[f] || o.includes(f)) ? f : 'mix', asc: Math.max(0, Math.min(tower().asc | 0, UI.twAsc | 0)), rolls: 0, rr: 0, ban: [], curse: null };   // v36: ascension level, rerolls, banished perks, a curse deal (49)
}
/* ---------- which subject a floor asks about ---------- */
/* 0 (strong) to 1 (weak): the share of recent tower answers that needed more than one try; before there are enough
   of them, the child's topic mastery (kept by every battle) stands in; unknown means "a little weak" */
function twWeak(s) {
  const a = (tower().sm || {})[s] || [];
  let m = a.length >= 4 ? a.reduce((x, y) => x + y, 0) / a.length : null;
  if (m == null) {
    const pre = s === 'math' ? 'math_' : s === 'bm' || s === 'en' ? 'lit_' : 'stem_';
    const v = Object.keys(S.topics || {}).filter(k => k.startsWith(pre)).map(k => mastery(k)).filter(x => x != null);
    m = v.length ? v.reduce((x, y) => x + y, 0) / v.length : .6;
  }
  return Math.max(0, Math.min(1, 1 - m));
}
function twSubj(f) {
  const r = twRun(); if (!r || r.focus === 'rotate') return null;
  r.sub = r.sub || {}; if (r.sub[f]) return r.sub[f];
  const o = openSubjects(), L = o.length ? o : ['math']; let s;
  if (L.includes(r.focus)) s = r.focus;
  else {
    const weak = r.focus === 'weak', last = r.sub[f - 1];
    const w = L.map(x => Math.max(.05, (weak ? .15 + Math.pow(twWeak(x), 2) * 3 : .5 + twWeak(x) * 1.5) * (x === last && L.length > 1 ? .4 : 1)));
    let x = rng((r.seed || 1) * 977 + f * 13)() * w.reduce((a, b) => a + b, 0), i = 0;
    for (; i < w.length - 1; i++) { x -= w[i]; if (x < 0) break; }
    s = L[i];
  }
  return (r.sub[f] = s);
}
/* ---------- floor modifiers ---------- */
function twMod(f) {
  const r = twRun(); if (!r || f < 3 || towerTier(f) !== 'normal') return null;
  const x = rng((r.seed || 1) * 53 + f * 29)(), rate = twModRate(); if (x > rate) return null;   // v36: a high ascension has more special floors
  return TW_MODS[Math.min(TW_MODS.length - 1, Math.floor(x / rate * TW_MODS.length))];
}
HOOK.filter('specialLevel', lv => {
  if (!lv || lv.special !== 'tower') return lv;
  const r = twRun(); if (!r) return lv;
  const out = Object.assign({}, lv), m = twMod(lv.floor), p = r.perks || {};
  if (p.time) out.timeMul = lv.timeMul * (1 + .12 * p.time);
  if (m) {
    out.mod = m.id; out.rewMul = m.rew;
    if (m.id === 'speed') out.timeMul *= .7;
    if (m.id === 'zen') out.timeMul = 1e-6;   // rounds to "no clock" (a plain 0 would count as "not set")
    if (m.id === 'order') out.only = ['order', 'match', 'sent', 'memory'];
  }
  return out;
});
/* coins for clearing a floor: the floor's modifier, and a Double Coins perk that waits for the next win */
function twReward(rw, lv, run) {
  let m = ((lv && lv.rewMul) || 1) * twRewMul(run);   // v36: ascension, Coin Magnet, Fortune and a curse deal change the coins (49)
  if (run && run.coin2) { m *= 2; run.coin2 = 0; }
  return Math.max(1, Math.round(rw * m));
}
/* ---------- perks that change the fight ---------- */
HOOK.filter('heroMaxHP', v => { const n = twN('heart'); v = n ? Math.round(v * (1 + .15 * n)) : v; return twBuildTier('tank') >= 1 ? Math.round(v * 1.1) : v; });   // v36: Thick Skin (49)
HOOK.filter('dmgBoost', v => { const n = twN('power'); return n && B.lv && B.lv.special === 'tower' ? v * (1 + .12 * n) : v; });
HOOK.on('answer:right', () => {
  const r = twRun(); if (!r || !B.lv || B.lv.special !== 'tower') return;
  const sm = tower().sm || (tower().sm = {}), a = sm[B.lv.subj] || (sm[B.lv.subj] = []); a.push(B.wrong === 0 ? 1 : 0); if (a.length > 10) a.shift();   // what the weak-spot choice reads
  const g = twN('regen'); if (g && B.hHp < B.hMax) { B.hHp = Math.min(B.hMax, B.hHp + Math.max(1, Math.round(B.hMax * .03 * g))); updateHud(); }
});
HOOK.claim('enemyStrike', () => {   // Second Chance: the first mistake on each floor does not hurt
  if (!twN('forgive') || !B.lv || B.lv.special !== 'tower' || B.forgave) return undefined;
  B.forgave = true; B.locked = false; setMsg(t('tp.forgave')); sfx.ok();
  const pm = fx.pos(hs()); if (!S.sensory) fx.num(pm.x, pm.y - pm.h * .6, '🛟', 'warn');
  return Promise.resolve();
});
HOOK.on('nextQuestion', () => {   // Hoot's Hint: every 4th question loses wrong answers (or shows its hint)
  if (!twN('hint4') || !B.lv || B.lv.special !== 'tower' || !B.q || (B.asked + 1) % 4 !== 0) return;
  const q = B.q, n = q.options ? q.options.length : 0;
  if (n > 2 && !q.mount && !['order', 'match', 'trace', 'phonics', 'wx'].includes(q.kind)) {
    shuffle(q.options.map((_, i) => i).filter(i => i !== q.correct && !B.picked.has(i))).slice(0, n >= 4 ? 2 : 1).forEach(i => B.picked.add(i));
  } else B.tier = Math.max(B.tier, 1);
  renderAnswers(); setMsg(t('tp.hint4.say'));
});
/* each fight: forgiveness comes back, the Mirror Floor flips the answers, the banner names a special floor */
HOOK.on('startBattle', () => {
  B.forgave = false;
  const lv = B.lv, bv = $('#battleView'), r = twRun();
  if (bv) bv.classList.toggle('tw-mirror', !!(lv && lv.mod === 'mirror' && r));
  const old = $('#twBanner'); if (old) old.remove();
  if (!lv || lv.special !== 'tower' || !r) return;
  const pn = $('#placeName'), m = lv.mod && TW_MODS.find(x => x.id === lv.mod), pk = TW_PERKS.filter(p => twN(p.id));
  if (pn) pn.insertAdjacentHTML('beforeend', `${m ? ` <span class="tw-chip">${m.em} ${esc(t('twm.' + m.id))}</span>` : ''}${pk.length ? ` <span class="tw-chip pk" aria-label="${esc(pk.map(p => t('tp.' + p.id)).join(', '))}">${pk.map(p => p.em + (twN(p.id) > 1 ? twN(p.id) : '')).join(' ')}</span>` : ''}`);
  if (m && bv) {
    bv.insertAdjacentHTML('beforeend', `<div id="twBanner" class="tw-banner" role="status"><b>${m.em} ${esc(t('twm.' + m.id))}</b><span>${esc(t('twm.' + m.id + '.d'))}</span></div>`);
    announce(t('twm.' + m.id) + '. ' + t('twm.' + m.id + '.d'), true);
    setTimeout(() => { const b = $('#twBanner'); if (b) b.remove(); }, S.sensory ? 3600 : 3000);
  }
});
/* the sibling scoreboard + a line of perks under the win card */
HOOK.on('win', () => {
  const lv = B.lv; if (!lv || lv.special !== 'tower') return;
  const tw = tower(), td = todayKey();
  if (!tw.today || tw.today.day !== td) tw.today = { day: td, floor: 0 };
  tw.today.floor = Math.max(tw.today.floor, lv.floor); save();
  const r = twRun(), w = $('#winSheet .wline');
  if (r && w) {
    const pk = TW_PERKS.filter(p => twN(p.id)), nx = r.floor;
    w.insertAdjacentHTML('afterend', `<p class="tw-perks">${pk.length ? pk.map(p => `<span title="${esc(t('tp.' + p.id))}">${p.em}${twN(p.id) > 1 ? '×' + twN(p.id) : ''}</span>`).join('') : ''}${nx % 5 === 1 ? `<small>${esc(t('tw.gate'))}</small>` : ''}</p>`);
  }
});

/* ---------- the steps between two floors ---------- */
function twPlan(f) {   // f = the floor just cleared
  const st = [];
  if (f === 100 && !tower().finale) st.push('finale'); else if (f === 100 && twAscendReady()) st.push('ascend'); else if (f % 10 === 0) st.push('story');   // v36
  if (f % 5 === 0) { st.push('perk'); if (openSubjects().length > 1) st.push('subj'); }
  else if (f % 5 === 2 && f >= 7) st.push('room');
  return st;
}
function twRoomKind(f) { const r = twRun(); return TW_ROOMS[(Math.floor(f / 5) + (r ? r.seed : 0)) % TW_ROOMS.length]; }
function twSheet(inner, cls = '') {
  const sh = $('#winSheet'); if (!sh) return;
  sh.innerHTML = `<div class="tw-sheet ${cls}">${inner}</div>`; $('#winOverlay').classList.add('on');
  const b = sh.querySelector('button.btn.big, button'); if (b && b.focus) try { b.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
}
const twNextBtn = (key = 'tw.go') => `<div class="wbtns"><button class="btn big" data-act="twNext">${esc(t(key))} ▶</button></div>`;
function twStart() {   // the "Next floor" button of a tower win card
  const r = twRun(); if (!r) return; r.steps = twPlan(r.floor - 1); twNext();
}
function twNext() {
  const r = twRun(); if (!r) return;
  const k = (r.steps || []).shift();
  if (!k) { $('#winOverlay').classList.remove('on'); const id = 'tower:' + r.floor; pxWipe(() => startBattle(id)); return; }
  ({ story: twStory, finale: twFinale, ascend: twAscend, perk: twPerkSheet, subj: twSubjSheet, room: twRoom })[k]();
}
function twStory() {
  const r = twRun(), f = r.floor - 1, d = Math.min(10, Math.floor(f / 10));
  twSheet(`<h2>📖 ${esc(t('tw.floor', { n: f }))}</h2><div class="tw-art" aria-hidden="true">${owlSVG()}</div><p class="tw-story">${esc(t('tws.' + d))}</p>${twNextBtn()}`);
  if (S.voice.auto) speak(t('tws.' + d));
}
function twFinale() {
  const tw = tower(); tw.finale = 1; const asc = twAscendGain(); chestGive(1); addCoins(100);   // v36: the first top also opens Ascension (49) const r = twRun(); if (r) r.coins = (r.coins || 0) + 100; save(); sfx.win();
  if (!S.sensory) { const p = { x: innerWidth / 2, y: innerHeight / 3 }; fx.burst(p.x, p.y, 40, ['⭐', '✨', '🌟', '👑', '🎉']); }
  twSheet(`<h2>👑 ${esc(t('tws.fin.t'))}</h2><div class="tw-art fin" aria-hidden="true"><i>${heroSVG(S.equipped)}</i><i>${owlSVG()}</i></div>
    <p class="tw-story">${esc(t('tws.fin.1'))}</p><p class="tw-story">${esc(t('tws.fin.2'))}</p>${asc ? twAscendHTML(asc) : ''}<div class="wline"><span class="gain">+100 🪙</span>${chestBtnHTML()}</div>${twNextBtn('tw.keep')}`, 'fin');
  if (S.voice.auto) speak(t('tws.fin.t') + '. ' + t('tws.fin.1'));
}
/* ---------- perks ---------- */
function twPerkChoices(r) {
  const have = id => (r.perks[id] || 0) >= twPerk(id).max || (id === 'coin2' && r.coin2) || (r.ban || []).includes(id) || (id === 'forgive' && (r.asc | 0) >= 5);   // v36: banished perks never come back; Ascension 5 has no Second Chance
  const pool = TW_PERKS.filter(p => !have(p.id)), rnd = rng((r.seed || 1) * 31 + r.floor * 7 + (r.rolls | 0) * 101);
  return pool.map(p => [rnd(), p]).sort((a, b) => a[0] - b[0]).slice(0, (r.asc | 0) >= 4 ? 2 : 3).map(x => x[1]);
}
const twPerkCard = (p, act, extra = '', dis = false) => `<button class="tw-card" data-act="${act}" data-v="${p.id}" ${dis ? 'disabled' : ''}><span class="tw-em" aria-hidden="true">${p.em}</span><b>${esc(t('tp.' + p.id))}</b><i class="tw-bd" aria-hidden="true">${twBuildEm(p.id)}</i><small>${esc(t('tp.' + p.id + '.d'))}</small>${extra}</button>`;
function twPerkSheet(title, again) {
  const r = twRun(), ch = twPerkChoices(r);
  if (!ch.length) { twNext(); return; }
  if (!again) { r.rrSheet = 0; r.sheetTitle = title || ''; }
  twSheet(`<h2>🎁 ${esc(title || t('tw.pickPerk'))}</h2><p class="sub">${esc(t('tw.pickSub'))}</p>${twBuildHTML(r)}<div class="tw-cards">${ch.map(p => twPerkCard(p, 'twPerk', r.perks[p.id] ? `<i class="tw-have">×${r.perks[p.id]}</i>` : '')).join('')}</div>${twRerollHTML(r, ch)}`);   // v36: builds, reroll and banish (49)
}
function twGivePerk(id) {
  const r = twRun(), p = twPerk(id); if (!r || !p) return false;
  if ((r.perks[id] || 0) >= p.max) return false;
  const before = heroMaxHP(), cur = r.hHp == null ? before : r.hHp;
  r.perks[id] = (r.perks[id] || 0) + 1;
  if (id === 'heart') r.hHp = Math.min(heroMaxHP(), cur + Math.round(before * .15));
  if (id === 'coin2') r.coin2 = 1;
  sfx.ok(); return true;
}
/* ---------- choosing the subjects ---------- */
function twFocusChips(cur, act) {
  const o = openSubjects(), items = [['mix', '🔀', t('tw.f.mix')], ['weak', '🎯', t('tw.f.weak')], ['rotate', '🔁', t('tw.f.rotate')]].concat(o.length > 1 ? o.map(s => [s, SUBJ_EM[s], t('subj.' + s)]) : []);
  return items.map(([id, em, nm]) => `<button class="chip tw-fc" data-act="${act}" data-v="${id}" aria-pressed="${cur === id}"><span aria-hidden="true">${em}</span> ${esc(nm)}</button>`).join('');
}
function twFocusNote() { const f = focusToday(); return f ? `<p class="tw-fnote">⭐ ${esc(t('tw.todayFocus', { s: f.map(s => t('subj.' + s)).join(', ') }))}</p>` : ''; }
function twSubjSheet() {
  const r = twRun();
  twSheet(`<h2>🧭 ${esc(t('tw.pickSubj'))}</h2><p class="sub">${esc(t('tw.pickSubjSub'))}</p>${twFocusNote()}<div class="tw-chips">${twFocusChips(r.focus, 'twFocus')}</div>${twNextBtn()}`);
}
/* ---------- rooms ---------- */
const twHeal = (r, frac) => { const mx = heroMaxHP(), cur = r.hHp == null ? mx : r.hHp; r.hHp = Math.min(mx, cur + Math.round(mx * frac)); return Math.round(r.hHp / mx * 100); };
function twRoom() {
  const r = twRun(), f = r.floor - 1, k = twRoomKind(f);
  if (k === 'camp') twCamp(r, f); else if (k === 'shop') twShop(r, f); else if (k === 'shrine') twShrine(r, f); else twPuzzle(r, f);
}
const twRoomHead = k => `<h2>${TW_ROOM_EM[k]} ${esc(t('twr.' + k))}</h2>`;
function twCamp(r, f) {
  const pc = twHeal(r, (r.asc | 0) >= 3 ? .25 : .4);   // v36: Ascension 3 has a weaker campfire
  twSheet(`${twRoomHead('camp')}<div class="tw-art" aria-hidden="true">🔥🏕️</div><p class="tw-story">${esc(t('twc.' + (1 + (f + r.seed) % 6)))}</p><p class="sub">❤️ ${esc(t('twr.healed', { n: pc }))}</p>${twNextBtn()}`);
}
function twShop(r, f) {
  if (!r.shop || r.shop.f !== f) {
    const rnd = rng((r.seed || 1) * 17 + f), pool = TW_PERKS.filter(p => (p.id !== 'coin2' || !r.coin2) && !(r.ban || []).includes(p.id)).map(p => [rnd(), p]).sort((a, b) => a[0] - b[0]).slice(0, 2).map(x => x[1]);
    r.shop = { f, items: pool.map(p => ({ id: p.id, price: twPrice(12 + Math.floor(f / 2)), sold: false })).concat([{ id: 'heal', price: twPrice(8 + Math.floor(f / 3)), sold: false }]) };
  }
  const left = (r.coins || 0) - (r.spent || 0);
  twSheet(`${twRoomHead('shop')}<p class="sub">${esc(t('twr.shopSub'))}</p><p class="tw-wallet">🪙 ${esc(t('twr.wallet', { n: Math.max(0, left) }))}</p><div class="tw-cards">${r.shop.items.map((it, i) => {
    const p = it.id === 'heal' ? { id: 'heal', em: '🍎' } : twPerk(it.id), full = it.id !== 'heal' && (r.perks[it.id] || 0) >= p.max, off = it.sold || full || left < it.price;
    return twPerkCard(p, 'twBuy', `<i class="tw-price">${it.sold ? '✔' : '🪙 ' + it.price}</i>`, off).replace(`data-v="${p.id}"`, `data-v="${i}"`);
  }).join('')}</div>${twNextBtn('twr.leave')}`);
}
function twBuy(i) {
  const r = twRun(), it = r && r.shop && r.shop.items[+i]; if (!it || it.sold) return;
  const left = (r.coins || 0) - (r.spent || 0); if (left < it.price || S.coins < it.price) { toast(t('twr.poor')); return; }
  if (it.id === 'heal') twHeal(r, .5); else if (!twGivePerk(it.id)) return;
  S.coins -= it.price; r.spent = (r.spent || 0) + it.price; it.sold = true; const cv = $('#coinVal'); if (cv) cv.textContent = S.coins; save(); twShop(r, r.shop.f);
}
function twShrineQ(r) {
  const lv = specialLevel('tower:' + r.floor);
  for (let i = 0; i < 40; i++) {
    const q = makeQ(pick(lv.pool), S.band, lv);
    if (q && q.options && q.options.length >= 3 && !q.mount && !q.viz && !q.word && !['order', 'match', 'trace', 'phonics', 'wx', 'missing', 'spell'].includes(q.kind)) return q;
  }
  return null;
}
function twShrine(r) {
  r.shrine = null;
  twSheet(`${twRoomHead('shrine')}<div class="tw-art" aria-hidden="true">⛩️✨</div><p class="tw-story">${esc(t('twr.shrineAsk'))}</p><div class="wbtns"><button class="btn big" data-act="twShrineYes">🎲 ${esc(t('twr.risk'))}</button>${twCurseBtn(r)}<button class="btn ghost" data-act="twNext">${esc(t('twr.pass'))}</button></div>`);
}
function twShrineAsk() {
  const r = twRun(), q = twShrineQ(r); if (!r) return;
  if (!q) { twPerkSheet(t('twr.shrineWin')); return; }
  r.shrine = q;
  twSheet(`${twRoomHead('shrine')}<p class="sub">${esc(t('twr.shrineQ'))}</p><p class="tw-q">${esc(q.text)}</p><div class="tw-opts">${q.options.map((o, i) => `<button class="ans ${q.cls || ''}" data-act="twShrinePick" data-v="${i}">${esc(o)}</button>`).join('')}</div>`);
}
function twShrinePick(i) {
  const r = twRun(), q = r && r.shrine; if (!q) return; r.shrine = null;
  if (+i === q.correct) { sfx.ok(); twPerkSheet(t('twr.shrineWin')); return; }
  sfx.soft(); const mx = heroMaxHP(), cur = r.hHp == null ? mx : r.hHp; r.hHp = Math.max(1, cur - Math.round(mx * .25));
  twSheet(`${twRoomHead('shrine')}<p class="tw-story">${esc(t('twr.shrineLose'))}</p><p class="sub">${esc(t('twr.answerWas', { a: q.ansText || q.options[q.correct] }))}</p>${twNextBtn()}`);
}
/* the Puzzle Room: three puzzles, no monster, no damage; wrong tries just show a hint */
function twPuzzle(r) {
  const subj = twSubj(r.floor) || towerSubjBase(r.floor), band = Math.max(1, Math.min(4, S.band));
  twSheet(`${twRoomHead('puzzle')}<p class="sub">${esc(t('twr.puzzleSub'))}</p><p class="tw-q">…</p>`);
  Promise.resolve(typeof fmLoad === 'function' ? fmLoad().catch(() => null) : null).then(() => {
    if (twRun() !== r) return;
    const list = [], kinds = (FM.mod ? FM.mod.weights(subj, band, false) : []).map(x => x[0]);
    shuffle(kinds).forEach(k => { if (list.length < 3) { const q = FM.mod.make(k, subj, band, true); if (q && q.mount) list.push(q); } });
    for (let i = 0; list.length < 3 && i < 12; i++) { const q = QT.orderQ(subj, band, true); if (q) list.push(q); }
    if (!list.length) { twNext(); return; }
    r.pz = { list, i: 0, miss: 0, lock: false }; twPuzzleShow(r);
  });
}
function twPuzzleShow(r) {
  const pz = r.pz, q = pz.list[pz.i];
  twSheet(`${twRoomHead('puzzle')}<p class="tw-dots" aria-label="${esc(t('twr.puzzleN', { n: pz.i + 1, m: pz.list.length }))}">${pz.list.map((_, k) => `<i class="${k < pz.i ? 'on' : k === pz.i ? 'now' : ''}"></i>`).join('')}</p><p class="qtag">${esc(q.tag || '')}</p><p class="tw-q">${esc(q.text)}</p><div id="twPz" class="tw-pz"></div>`, 'pz');
  pz.miss = 0; pz.lock = false;
  const host = $('#twPz'), H = {
    locked: () => pz.lock, still: () => r.pz === pz && pz.list[pz.i] === q, tier: () => pz.miss, hint: () => pz.miss >= 1 && !pz.lock,
    ok: () => { pz.lock = true; sfx.ok(); setTimeout(() => { if (r.pz !== pz) return; pz.i++; if (pz.i >= pz.list.length) twPuzzleDone(r); else twPuzzleShow(r); }, S.sensory ? 150 : 700); },
    miss: () => { pz.miss++; sfx.soft(); if (q.refresh) q.refresh(); }
  };
  if (q.mount) q.mount(host, H); else if (q.kind === 'order') mountOrder(host, q, H);
}
function twPuzzleDone(r) {
  r.pz = null; const gain = 10 + Math.floor(r.floor / 2), pc = twHeal(r, .2);
  addCoins(gain); r.coins = (r.coins || 0) + gain; save();
  twSheet(`${twRoomHead('puzzle')}<div class="tw-art" aria-hidden="true">🌟</div><p class="tw-story">${esc(t('twr.puzzleDone'))}</p><div class="wline"><span class="gain">+${gain} 🪙</span></div><p class="sub">❤️ ${esc(t('twr.healed', { n: pc }))}</p>${twNextBtn()}`);
}
/* ---------- events ---------- */
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'runNext': if (twRun()) { twStart(); return true; } break;
    case 'twNext': twNext(); return true;
    case 'twPerk': { const r = twRun(); if (r && twGivePerk(v)) { toast(t('tw.got', { p: t('tp.' + v) })); twNext(); } return true; }
    case 'twFocus': { const r = twRun(); if (r) { r.focus = v; r.sub = {}; UI.twFocus = v; twSubjSheet(); } return true; }
    case 'twFocusSet': UI.twFocus = v; if (UI.tab === 'tower') renderTower(); return true;
    case 'twBuy': twBuy(v); return true;
    case 'twShrineYes': twShrineAsk(); return true;
    case 'twShrinePick': twShrinePick(v); return true;
  }
  return undefined;
});

/* ---------- sibling ghosts ---------- */
function twGhosts() {
  const td = todayKey();
  return (DEV.profiles || []).filter(p => p.id !== DEV.active).map(p => {
    const o = kidSave(p.id), d = o && o.tower && o.tower.today;
    return d && d.day === td && d.floor > 0 ? { id: p.id, name: kidName(p), floor: d.floor } : null;
  }).filter(Boolean);
}
/* ---------- the tower map ---------- */
function renderTowerNew() {
  const host = $('#tab-tower'); if (!host) return true;
  const tw = tower(), best = tw.best[S.band] || 0, cp = Math.floor(best / 10) * 10, hero = best + 1, nb = Math.ceil(hero / 5) * 5;
  const hi = nb + 2, lo = Math.max(1, hero - 4), gh = twGhosts(), td = tw.today && tw.today.day === todayKey() ? tw.today.floor : 0;
  let nbl = null; try { nbl = specialLevel('tower:' + nb); } catch (e) { /* ignore */ }
  const rows = [];
  for (let f = hi; f >= lo; f--) {
    const tr = towerTier(f), cls = f <= best ? 'done' : f === hero ? 'next' : '', here = gh.filter(g => g.floor === f);
    rows.push(`<div class="tw-floor ${tr} ${cls}" style="--i:${hi - f}"><b>${f}</b><span class="tw-ic" aria-hidden="true">${tr === 'big' ? '👑🎁' : tr === 'mini' ? '⚔️' : ''}${twRuleOf(f) ? TW_RULE_EM[twRuleOf(f)] : ''}${f % 10 === 0 && f <= best ? '🚩' : ''}</span>`
      + `${f === nb && nbl ? `<i class="tw-sil" aria-hidden="true">${monsterSVG(nbl.mon, nbl.hue || 0)}</i><em class="tw-qm" aria-hidden="true">?</em>` : ''}`
      + `${here.map(g => `<u class="tw-gh" title="${esc(g.name)}">👻<small>${esc(g.name)}</small></u>`).join('')}`
      + `${f === hero ? `<i class="tw-hero" aria-hidden="true">${heroSVG(S.equipped)}</i>` : f <= best ? '<em aria-hidden="true">✔</em>' : ''}</div>`);
  }
  const list = gh.concat(td ? [{ me: 1, name: t('tw.you'), floor: td }] : []).sort((a, b) => b.floor - a.floor);
  host.innerHTML = `<div class="wrap towerwrap"><h1 class="title">🗼 ${t('tw.title')}</h1><p class="sub">${t('tw.sub')}</p>
    <div class="tw-top"><div class="tw-best"><span>🏆 ${esc(t('tw.best', { n: best }))}</span><small>${t('band.' + S.band)} · ${esc(t('tw.runs', { n: tw.runs || 0 }))}</small></div><div class="seg diffbar">${diffChips()}</div></div>
    ${list.length ? `<ul class="tw-board" aria-label="${esc(t('tw.boardTitle'))}">${list.map(g => `<li class="${g.me ? 'me' : ''}"><span aria-hidden="true">${g.me ? '⭐' : '👻'}</span> ${esc(t('tw.ghostLine', { name: g.name, n: g.floor }))}</li>`).join('')}</ul>` : ''}
    <div class="tw-col" role="img" aria-label="${esc(t('tw.aria2', { n: best, b: nb }))}">${rows.join('')}<div class="tw-base" aria-hidden="true"></div></div>
    <p class="tw-legend"><span>🚩 ${esc(t('tw.lg.cp'))}</span><span>⚔️ ${esc(t('tw.lg.mini'))}</span><span>👑 ${esc(t('tw.lg.big'))}</span><span>❓ ${esc(t('tw.lg.sil'))}</span><span>🌀 ${esc(t('v36.tw.lg.rule'))}</span></p>
    <div class="tw-start"><h2>${esc(t('tw.pickSubj'))}</h2>${twFocusNote()}<div class="tw-chips">${twFocusChips(UI.twFocus || 'mix', 'twFocusSet')}</div></div>${twAscPanel()}
    <div class="brief-actions"><button class="btn big" data-act="towerGo" data-v="1">▶ ${t('tw.start')}</button>${cp >= 10 && !(UI.twAsc | 0) ? `<button class="btn" data-act="towerGo" data-v="${cp + 1}">⏩ ${esc(t('tw.from', { n: cp + 1 }))}</button>` : ''}</div>
    <ul class="tw-rules"><li>📈 ${t('tw.r1')}</li><li>⚔️ ${t('tw.r2')}</li><li>💖 ${t('tw.r3')}</li><li>🏆 ${t('tw.r4')}</li><li>🎁 ${t('tw.r5')}</li><li>🎲 ${t('tw.r6')}</li><li>🌀 ${t('v36.tw.r7')}</li></ul></div>`;
  return true;
}
HOOK.claim('renderTower', () => renderTowerNew());

Object.assign(STR, {
  'tw.go': ['Go on', 'Teruskan'], 'tw.keep': ['Keep climbing', 'Teruskan mendaki'], 'tw.gate': ['A reward waits before the next floor!', 'Ganjaran menanti sebelum tingkat seterusnya!'],
  'tw.pickPerk': ['Pick a perk', 'Pilih satu kelebihan'], 'tw.pickSub': ['It lasts until this climb ends. Pick 1 of 3.', 'Kelebihan ini kekal sehingga pendakian tamat. Pilih 1 daripada 3.'],
  'tw.got': ['You got: {p}', 'Kamu dapat: {p}'],
  'tw.pickSubj': ['What do you want to climb with?', 'Mahu mendaki dengan subjek apa?'], 'tw.pickSubjSub': ['Pick the questions for the next floors.', 'Pilih soalan untuk tingkat seterusnya.'],
  'tw.f.mix': ['Mix (helps weak spots)', 'Campuran (bantu bahagian lemah)'], 'tw.f.weak': ['Weak spots', 'Bahagian lemah'], 'tw.f.rotate': ['Even turns', 'Bergilir sama rata'],
  'tw.todayFocus': ['Today’s focus from your grown-up: {s}', 'Fokus hari ini daripada orang dewasa: {s}'],
  'tw.aria2': ['The tower. Your best floor is {n}. The next boss waits on floor {b}.', 'Menara. Tingkat terbaik kamu ialah {n}. Bos seterusnya menunggu di tingkat {b}.'],
  'tw.you': ['You', 'Kamu'], 'tw.boardTitle': ['Today in the tower', 'Hari ini di menara'], 'tw.ghostLine': ['{name} reached floor {n} today', '{name} sampai tingkat {n} hari ini'],
  'tw.lg.cp': ['check-point (start there next time)', 'tempat singgah (mula di sini lain kali)'], 'tw.lg.mini': ['mini boss', 'bos kecil'], 'tw.lg.big': ['big boss + chest', 'bos besar + peti'], 'tw.lg.sil': ['the next boss, in shadow', 'bos seterusnya, dalam bayang'],
  'tw.r5': ['After a boss floor you pick a perk. It lasts until the climb ends.', 'Selepas tingkat bos, kamu pilih satu kelebihan. Ia kekal sehingga pendakian tamat.'],
  'tw.r6': ['Some floors are special, and some are quiet rooms with a campfire, a merchant, a shrine or puzzles.', 'Ada tingkat istimewa, dan ada bilik tenang dengan unggun api, pedagang, kuil atau teka-teki.'],
  'tp.heart': ['+1 Heart', '+1 Hati'], 'tp.heart.d': ['Your health bar is 15% bigger, and you heal a little now.', 'Bar nyawa 15% lebih besar, dan kamu pulih sedikit sekarang.'],
  'tp.forgive': ['Second Chance', 'Peluang Kedua'], 'tp.forgive.d': ['The first mistake on every floor does not hurt.', 'Kesilapan pertama pada setiap tingkat tidak mencederakan.'],
  'tp.coin2': ['Double Coins', 'Syiling Berganda'], 'tp.coin2.d': ['The coins from the next floor count twice.', 'Syiling dari tingkat seterusnya dikira dua kali.'],
  'tp.hint4': ['Hoot’s Hint', 'Petunjuk Hoot'], 'tp.hint4.d': ['Hoot helps you on every 4th question.', 'Hoot membantu kamu pada setiap soalan ke-4.'], 'tp.hint4.say': ['🦉 Hoot helps with this one!', '🦉 Hoot membantu soalan ini!'],
  'tp.regen': ['Healing Leaf', 'Daun Penyembuh'], 'tp.regen.d': ['You heal a little after each right answer.', 'Kamu pulih sedikit selepas setiap jawapan betul.'],
  'tp.power': ['Strong Arm', 'Lengan Kuat'], 'tp.power.d': ['Your hits are 12% stronger.', 'Serangan kamu 12% lebih kuat.'],
  'tp.time': ['Extra Time', 'Masa Tambahan'], 'tp.time.d': ['Each question gives you 12% more time.', 'Setiap soalan memberi 12% lebih masa.'],
  'tp.heal': ['Apple', 'Epal'], 'tp.heal.d': ['Heal half of your health bar.', 'Pulihkan separuh bar nyawa kamu.'],
  'tp.forgave': ['🛟 Second Chance! That mistake did not hurt.', '🛟 Peluang Kedua! Kesilapan itu tidak mencederakan.'],
  'twm.speed': ['Speed Floor', 'Tingkat Laju'], 'twm.speed.d': ['Less time, more coins!', 'Masa lebih singkat, lebih banyak syiling!'],
  'twm.zen': ['Zen Floor', 'Tingkat Tenang'], 'twm.zen.d': ['No clock. Take your time. Fewer coins.', 'Tiada jam. Ambil masa kamu. Syiling lebih sedikit.'],
  'twm.order': ['Order Floor', 'Tingkat Susunan'], 'twm.order.d': ['Only put-in-order and memory puzzles.', 'Hanya teka-teki susunan dan ingatan.'],
  'twm.mirror': ['Mirror Floor', 'Tingkat Cermin'], 'twm.mirror.d': ['The answers are flipped left to right.', 'Jawapan diterbalikkan dari kiri ke kanan.'],
  'twm.lucky': ['Lucky Floor', 'Tingkat Bertuah'], 'twm.lucky.d': ['Double coins on this floor!', 'Syiling berganda di tingkat ini!'],
  'twr.camp': ['Campfire', 'Unggun Api'], 'twr.shop': ['Merchant', 'Pedagang'], 'twr.shrine': ['Shrine', 'Kuil'], 'twr.puzzle': ['Puzzle Room', 'Bilik Teka-teki'],
  'twr.healed': ['Your health is now {n}%.', 'Nyawa kamu kini {n}%.'], 'twr.leave': ['Leave', 'Pergi'],
  'twr.shopSub': ['Spend the coins you won on this climb.', 'Guna syiling yang kamu menangi dalam pendakian ini.'], 'twr.wallet': ['Climb coins left: {n}', 'Syiling pendakian tinggal: {n}'], 'twr.poor': ['Not enough coins from this climb.', 'Syiling pendakian tidak cukup.'],
  'twr.shrineAsk': ['A quiet shrine glows. Answer one question: a right answer gives a free perk, but a wrong one costs a quarter of your health.', 'Sebuah kuil senyap bersinar. Jawab satu soalan: jawapan betul beri kelebihan percuma, tetapi jawapan salah menyebabkan kamu hilang suku nyawa.'],
  'twr.risk': ['Take the risk', 'Ambil risiko'], 'twr.pass': ['Walk past', 'Berjalan lalu'], 'twr.shrineQ': ['The shrine asks:', 'Kuil bertanya:'],
  'twr.shrineWin': ['The shrine smiles. Pick a free perk!', 'Kuil tersenyum. Pilih kelebihan percuma!'], 'twr.shrineLose': ['The shrine goes dim. You lose some health, but you are still standing.', 'Kuil malap. Nyawa kamu berkurang, tetapi kamu masih berdiri.'],
  'twr.answerWas': ['The answer was: {a}', 'Jawapannya: {a}'],
  'twr.puzzleSub': ['Three puzzles. No monster, no damage. Take your time.', 'Tiga teka-teki. Tiada raksasa, tiada kecederaan. Ambil masa kamu.'], 'twr.puzzleN': ['Puzzle {n} of {m}', 'Teka-teki {n} daripada {m}'],
  'twr.puzzleDone': ['All three solved! You win coins and rest a little.', 'Ketiga-tiganya selesai! Kamu dapat syiling dan berehat sedikit.'],
  'twc.1': ['Hoot warms his wings by the fire. “Every floor you beat makes you stronger.”', 'Hoot menghangatkan sayapnya di tepi api. “Setiap tingkat yang kamu menangi menjadikan kamu lebih kuat.”'],
  'twc.2': ['The fire crackles. You eat a warm bun and your feet stop aching.', 'Api berdetik. Kamu makan pau panas dan kaki tidak lagi sakit.'],
  'twc.3': ['A tiny frog sings a quiet song by the flames. It sounds like a lullaby.', 'Seekor katak kecil menyanyi lagu perlahan di tepi api. Bunyinya seperti lagu tidur.'],
  'twc.4': ['Hoot counts the stars through a crack in the wall. “One, two, three… you can do it too.”', 'Hoot mengira bintang melalui celah dinding. “Satu, dua, tiga… kamu pun boleh.”'],
  'twc.5': ['You write your name in the dust. Brave climbers have signed here before you.', 'Kamu menulis nama di atas debu. Pendaki berani pernah menandatangani di sini sebelum kamu.'],
  'twc.6': ['The warm light makes you smile. A short rest, then up you go!', 'Cahaya hangat membuat kamu tersenyum. Berehat sebentar, kemudian naik lagi!'],
  'tws.1': ['Hoot says: “This tower was built by a wizard who loved questions. Each floor keeps one secret.”', 'Hoot berkata: “Menara ini dibina oleh ahli sihir yang suka soalan. Setiap tingkat menyimpan satu rahsia.”'],
  'tws.2': ['The walls get colder. Far above, a light blinks. “Somebody is waiting up there,” whispers Hoot.', 'Dinding semakin sejuk. Jauh di atas, ada cahaya berkelip. “Ada orang menunggu di atas sana,” bisik Hoot.'],
  'tws.3': ['You find a map pinned to the wall. It is drawn in crayon, by a child just like you.', 'Kamu menjumpai peta yang dilekatkan pada dinding. Ia dilukis dengan krayon, oleh seorang kanak-kanak seperti kamu.'],
  'tws.4': ['The monsters here are not angry. They only want to be asked the right question.', 'Raksasa di sini tidak marah. Mereka hanya mahu ditanya soalan yang betul.'],
  'tws.5': ['Halfway! The stairs turn into silver. “Keep your head up,” says Hoot, “and your feet moving.”', 'Separuh jalan! Tangga bertukar menjadi perak. “Angkat kepala,” kata Hoot, “dan terus melangkah.”'],
  'tws.6': ['Clouds drift through the windows. You can see the whole land below, small as a toy.', 'Awan berarak melalui tingkap. Kamu boleh melihat seluruh negeri di bawah, kecil seperti mainan.'],
  'tws.7': ['A tiny dragon naps on the stairs. It opens one eye, nods at you, and goes back to sleep.', 'Seekor naga kecil tidur di tangga. Ia membuka sebelah mata, mengangguk kepada kamu, lalu tidur semula.'],
  'tws.8': ['The wizard’s old notes say: “The tallest thing in the world is a question that nobody is afraid of.”', 'Nota lama ahli sihir tertulis: “Perkara paling tinggi di dunia ialah soalan yang tiada siapa takut.”'],
  'tws.9': ['Almost there. You hear music from the top. Hoot’s wings are shaking with joy.', 'Hampir sampai. Kamu mendengar muzik dari puncak. Sayap Hoot bergetar kegembiraan.'],
  'tws.10': ['Above the clouds, the tower keeps going. “There is always a next floor,” smiles Hoot. “And you are ready.”', 'Di atas awan, menara terus ke atas. “Sentiasa ada tingkat seterusnya,” senyum Hoot. “Dan kamu sudah bersedia.”'],
  'tws.fin.t': ['You reached the top!', 'Kamu sampai ke puncak!'],
  'tws.fin.1': ['The last door opens onto the sky. The wizard’s old lamp lights up and a thousand stars say hello.', 'Pintu terakhir terbuka ke langit. Pelita lama ahli sihir menyala dan seribu bintang menyapa.'],
  'tws.fin.2': ['“The tower was waiting for someone who never gave up,” says Hoot. “It was you.” The tower is yours, and it can still grow taller.', '“Menara ini menunggu seseorang yang tidak pernah berputus asa,” kata Hoot. “Itu kamu.” Menara ini milik kamu, dan ia masih boleh bertambah tinggi.']
});
if (window.__quest) window.__quest.v35 = Object.assign(window.__quest.v35 || {}, { TW_PERKS, TW_MODS, tw: { twRun, twPlan, twMod, twSubj, twWeak, twGivePerk, twRoomKind, twGhosts, twNewRun, twReward, twStart, twNext, twCamp, twShop, twShrine, twPuzzle, twPuzzleDone, twStory, twFinale, twPerkSheet, twSubjSheet }, B: () => B, UI: () => UI });
