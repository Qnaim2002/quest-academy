/* ================= v34: make the hero yours, a pet friend who cheers, and calmer celebrations =================
   1. THE HERO LOOK (S.look). Gear is bought; these are free and personal: a favourite colour, a title earned by playing,
      a battle cry, a victory pose, a portrait frame, and the hero's name. They live on their own page (Armory > Me).
   2. THE PET FRIEND (S.buddy). After a streak, and after a wrong answer, the pet on the hero's side says a short kind line
      (Hoot the owl if no pet is worn). A grown-up or the child can switch it off.
   3. CELEBRATION PACING (S.celeb). The finisher light shows are rich. After the first show a card offers "skip the big show
      after the first time". Modes: ask (full shows until someone answers), always, first (full only the first time each
      finisher is used) and short (a quick hit every time). Boss finishing blows and the Armory preview are always full. */
Object.assign(STR, {
  'lk.tab': ['Me', 'Saya'], 'lk.title': ['My hero', 'Wira saya'], 'lk.sub': ['Make your hero feel like you. Everything here is free!', 'Jadikan wira kamu seperti kamu. Semua di sini percuma!'],
  'lk.name': ['Hero name', 'Nama wira'], 'lk.namePh': ['Type a name', 'Taip nama'],
  'lk.color': ['Favourite colour', 'Warna kegemaran'], 'lk.none': ['Standard', 'Biasa'],
  'lk.ttl': ['Title', 'Gelaran'], 'lk.cry': ['Battle cry', 'Laungan perang'], 'lk.pose': ['Victory pose', 'Aksi menang'], 'lk.frame': ['Picture frame', 'Bingkai gambar'],
  'lk.lock': ['Locked', 'Berkunci'],
  'lk.p.cheer': ['Cheer', 'Sorak'], 'lk.p.wave': ['Wave', 'Lambai'], 'lk.p.hop': ['Hop', 'Lompat'],
  'lk.f.none': ['None', 'Tiada'], 'lk.f.round': ['Round', 'Bulat'], 'lk.f.hex': ['Hexagon', 'Heksagon'], 'lk.f.shield': ['Shield', 'Perisai'], 'lk.f.diamond': ['Diamond', 'Berlian'],
  'lk.try': ['Try it', 'Cuba'], 'lk.saved': ['Saved!', 'Disimpan!'],
  'lk.buddy': ['Pet friend', 'Kawan haiwan'], 'lk.buddyOn': ['Pet chat: {s}', 'Sembang haiwan: {s}'], 'lk.chat': ['Chat with {n}', 'Sembang dengan {n}'],
  'lk.celeb': ['Big light shows', 'Pertunjukan cahaya besar'], 'lk.c.always': ['Every time', 'Setiap kali'], 'lk.c.first': ['First time only', 'Kali pertama sahaja'], 'lk.c.short': ['Quick hit', 'Pukulan pantas'],
  'lk.celebNote': ['The big light show can be shortened so battles stay quick.', 'Pertunjukan cahaya besar boleh dipendekkan supaya pertarungan kekal pantas.'],
  'lk.offer': ['That was a big finisher! Skip the long show after the first time?', 'Itu serangan penamat yang hebat! Langkau pertunjukan panjang selepas kali pertama?'],
  'lk.offerYes': ['Yes, skip it', 'Ya, langkau'], 'lk.offerNo': ['Keep every show', 'Kekalkan semua'],
  'lk.hit': ['{f}!', '{f}!'],
  'lk.hoot': ['Hoot', 'Hoot'],
  'lk.col.sun': ['Sun', 'Matahari'], 'lk.col.sky': ['Sky', 'Langit'], 'lk.col.mint': ['Mint', 'Pudina'], 'lk.col.rose': ['Rose', 'Mawar'], 'lk.col.grape': ['Grape', 'Anggur'], 'lk.col.flame': ['Flame', 'Api'], 'lk.col.leaf': ['Leaf', 'Daun'],
  'v34.buddy': ['Pet chat: {s}', 'Sembang haiwan: {s}'], 'v34.celeb': ['Big light shows', 'Pertunjukan cahaya besar'], 'v34.look': ['Hero look', 'Rupa wira'],
});
const LK_COLORS = [['sun', '#FFB84D'], ['sky', '#4FA8E8'], ['mint', '#3CCFA0'], ['rose', '#FF6FA3'], ['grape', '#9B7BFF'], ['flame', '#FF6B4A'], ['leaf', '#8BD13F']];
const LK_CRIES = [['For the stars!', 'Demi bintang!'], ['Here I come!', 'Aku datang!'], ['Let’s learn!', 'Jom belajar!'], ['Brain power!', 'Kuasa otak!'], ['Never give up!', 'Jangan putus asa!'], ['Time to shine!', 'Masa untuk bersinar!']];
const LK_POSES = ['cheer', 'wave', 'hop'];
const LK_FRAMES = ['none', 'round', 'hex', 'shield', 'diamond'];
const lkSubjStars = s => Object.entries(S.stars || {}).reduce((a, [k, v]) => a + (k.startsWith(s + ':') ? v : 0), 0);
const lkTotalStars = () => Object.values(S.stars || {}).reduce((a, b) => a + b, 0);
const LK_TITLES = [
  ['brave', 'Brave Knight', 'Kesatria Berani', () => true, ['', '']],
  ['curious', 'Curious Mind', 'Minda Ingin Tahu', () => true, ['', '']],
  ['kind', 'Kind Friend', 'Kawan Baik', () => true, ['', '']],
  ['stars', 'Star Collector', 'Pengumpul Bintang', () => lkTotalStars() >= 10, ['Win 10 stars', 'Menangi 10 bintang']],
  ['math', 'Number Ninja', 'Ninja Nombor', () => lkSubjStars('math') >= 10, ['10 stars in Matematik', '10 bintang dalam Matematik']],
  ['bm', 'Bintang Bahasa', 'Bintang Bahasa', () => lkSubjStars('bm') >= 10, ['10 stars in Bahasa Melayu', '10 bintang dalam Bahasa Melayu']],
  ['en', 'Word Wizard', 'Ahli Sihir Kata', () => lkSubjStars('en') >= 10, ['10 stars in English', '10 bintang dalam Bahasa Inggeris']],
  ['sc', 'Nature Explorer', 'Penjelajah Alam', () => lkSubjStars('sc') >= 10, ['10 stars in Science', '10 bintang dalam Sains']],
  ['think', 'Deep Thinker', 'Pemikir Hebat', () => ((S.kbat || {}).rounds | 0) >= 3, ['Play 3 Think Hard rounds', 'Main 3 pusingan Think Hard']],
  ['scholar', 'Little Scholar', 'Sarjana Kecil', () => lkTotalStars() >= 100, ['Win 100 stars', 'Menangi 100 bintang']],
];
const lk = () => (S.look && typeof S.look === 'object') ? S.look : (S.look = {});
const lkColor = () => { const c = LK_COLORS.find(x => x[0] === lk().color); return c ? c[1] : ''; };
const lkTitle = () => { const x = LK_TITLES.find(r => r[0] === lk().title); return x && x[3]() ? x : null; };
const lkTitleText = () => { const x = lkTitle(); return x ? (S.lang === 'ms' ? x[2] : x[1]) : ''; };
const lkWinPose = () => LK_POSES.includes(lk().win) ? lk().win : 'cheer';
const lkName = () => { try { return cleanName(curProfile().name || ''); } catch (e) { return ''; } };

/* ---- apply: colour and frame are set on the page, so every screen follows ---- */
function applyLook() {
  const r = document.documentElement, c = lkColor();
  try { if (c) r.style.setProperty('--hero-c', c); else r.style.removeProperty('--hero-c'); } catch (e) { /* a test page without styles */ }
  r.dataset.heroc = c ? '1' : '0';
  r.dataset.frame = LK_FRAMES.includes(lk().frame) ? lk().frame : 'none';
}
function lookTitleChip() { try { const x = lkTitleText(); return x ? `<span class="lk-chip" aria-label="${esc(t('lk.ttl'))}">${esc(x)}</span>` : ''; } catch (e) { return ''; } }   // safe even before this part has run

/* ---- the Me page ---- */
const lkBtn = (act, v, on, label, extra = '') => `<button class="chip big ${extra}" data-act="${act}" data-v="${esc(v)}" aria-pressed="${on}">${label}</button>`;
function renderMe() {
  const nm = lkName(), bud = buddyWho(), cl = lk();
  const colors = lkBtn('lkColor', '', !lkColor(), `<span class="lk-sw none" aria-hidden="true">✕</span> ${esc(t('lk.none'))}`) + LK_COLORS.map(([id, hex]) => lkBtn('lkColor', id, lk().color === id, `<span class="lk-sw" style="background:${hex}" aria-hidden="true"></span> ${esc(t('lk.col.' + id))}`)).join('');
  const titles = LK_TITLES.map(x => { const ok = x[3](); return ok ? lkBtn('lkTitle', x[0], lk().title === x[0], esc(S.lang === 'ms' ? x[2] : x[1])) : `<button class="chip big lk-locked" disabled aria-label="${esc(t('lk.lock') + ': ' + x[4][S.lang === 'ms' ? 1 : 0])}">🔒 ${esc(x[4][S.lang === 'ms' ? 1 : 0])}</button>`; }).join('');
  const cries = lkBtn('lkCry', '-1', !(cl.cry >= 0), esc(t('lk.none'))) + LK_CRIES.map((c, i) => lkBtn('lkCry', i, cl.cry === i, esc(c[S.lang === 'ms' ? 1 : 0]))).join('');
  const poses = LK_POSES.map(p => lkBtn('lkPose', p, lkWinPose() === p, esc(t('lk.p.' + p)))).join('');
  const frames = LK_FRAMES.map(f => lkBtn('lkFrame', f, (cl.frame || 'none') === f, esc(t('lk.f.' + f)))).join('');
  const cm = celebMode();
  const celeb = ['always', 'first', 'short'].map(m => lkBtn('lkCeleb', m, cm === m, esc(t('lk.c.' + m)))).join('');
  $('#tab-armory').innerHTML = `<div class="wrap lkwrap">${armTabs()}<h1 class="title">✨ ${t('lk.title')}</h1><p class="sub">${t('lk.sub')}</p>
    <div class="lk-top"><button class="preview lk-prev" data-act="lkTry" aria-label="${esc(t('lk.try'))}">${heroSVG(S.equipped)}</button>
      <div class="lk-id"><label class="lk-lab" for="lkName">${t('lk.name')}</label><input id="lkName" class="kid-name" maxlength="16" value="${esc(nm)}" placeholder="${esc(t('lk.namePh'))}" autocomplete="off">
        <div class="lk-show">${lookTitleChip()}</div>
        <button class="chip" data-act="lkChat">${bud.em} ${esc(t('lk.chat', { n: bud.name }))}</button><div class="lk-say" id="lkSay" aria-live="polite"></div></div></div>
    <h3 class="lk-h">${t('lk.color')}</h3><div class="seg lk-seg" role="group">${colors}</div>
    <h3 class="lk-h">${t('lk.ttl')}</h3><div class="seg lk-seg" role="group">${titles}</div>
    <h3 class="lk-h">${t('lk.cry')}</h3><div class="seg lk-seg" role="group">${cries}</div>
    <h3 class="lk-h">${t('lk.pose')}</h3><div class="seg lk-seg" role="group">${poses}</div>
    <h3 class="lk-h">${t('lk.frame')}</h3><div class="seg lk-seg" role="group">${frames}</div>
    <h3 class="lk-h">${t('lk.buddy')}</h3><div class="seg lk-seg">${tog('buddyToggle', 'lk.buddyOn', buddyOn())}</div>
    <h3 class="lk-h">${t('lk.celeb')}</h3><p class="note">${t('lk.celebNote')}</p><div class="seg lk-seg" role="group">${celeb}</div></div>`;
}
HOOK.claim('renderArmory', () => { if (UI.arm === 'me') { renderMe(); return true; } });
HOOK.on('renderArmory', () => { applyLook(); });
document.addEventListener('change', e => {
  const el = e.target; if (!el || el.id !== 'lkName') return;
  try { curProfile().name = cleanName(el.value); saveDev(); syncWhoBtn(); toast(t('lk.saved')); } catch (x) { /* ignore */ }
  const s = $('#tab-armory .lk-show'); if (s) s.innerHTML = lookTitleChip();
});
function lkSet(k, v) { lk()[k] = v; save(); applyLook(); }
function lkRedraw() { const y = window.scrollY, sc = $('#tab-armory'), top = sc ? sc.scrollTop : 0; renderMe(); if (sc) sc.scrollTop = top; window.scrollTo(0, y); }
HOOK.claim('famEvent', (a, v) => {
  switch (a) {
    case 'lkColor': lkSet('color', v || ''); lkRedraw(); return true;
    case 'lkTitle': { const x = LK_TITLES.find(r => r[0] === v); if (x && x[3]()) { lkSet('title', v); lkRedraw(); } return true; }
    case 'lkCry': { const i = parseInt(v, 10); lkSet('cry', i >= 0 ? i : -1); lkRedraw(); if (i >= 0) { const e = $('#lkSay'); if (e) e.textContent = '💬 ' + LK_CRIES[i][S.lang === 'ms' ? 1 : 0]; if (S.voice && S.voice.auto) speak(LK_CRIES[i][S.lang === 'ms' ? 1 : 0]); } return true; }
    case 'lkPose': lkSet('win', LK_POSES.includes(v) ? v : 'cheer'); lkRedraw(); heroPose($('#tab-armory .lk-prev'), lkWinPose(), 1300); return true;
    case 'lkFrame': lkSet('frame', LK_FRAMES.includes(v) ? v : 'none'); lkRedraw(); return true;
    case 'lkTry': heroPose($('#tab-armory .lk-prev'), lkWinPose(), 1300); return true;
    case 'lkChat': { const b = buddyWho(), e = $('#lkSay'), line = buddyLine(Math.random() < .5 ? 'streak' : 'wrong', 3); if (e) { e.innerHTML = `<b>${b.em} ${esc(b.name)}:</b> ${esc(line)}`; replayClass(e, 'pop'); } if (S.voice && S.voice.auto) speak(line); return true; }
    case 'buddyToggle': S.buddy = Object.assign({ on: true }, S.buddy); S.buddy.on = !buddyOn(); save(); if (UI.tab === 'parent') renderParent(); else lkRedraw(); return true;
    case 'lkCeleb': setCelebMode(v); if (UI.tab === 'parent') renderParent(); else lkRedraw(); return true;
    case 'celebOffer': setCelebMode(v === 'yes' ? 'first' : 'always'); { const o = $('#winSheet .celeb-offer'); if (o) o.remove(); toast(t('lk.saved')); } return true;
  }
});

/* ---- the pet friend ---- */
const BUDDY_SND = {
  pet_cat: ['Meow!', 'Meow!'], pet_dog: ['Woof!', 'Guk guk!'], pet_bunny: ['Boing!', 'Boing!'], pet_penguin: ['Waddle waddle!', 'Terhuyung-hayang!'], pet_slime: ['Blub blub!', 'Blub blub!'],
  pet_robot: ['Beep boop!', 'Bip bop!'], pet_dragon: ['Roar!', 'Roar!'], pet_unicorn: ['Neigh!', 'Hihihi!'], pet_fox: ['Yip yip!', 'Yip yip!'], pet_hedgehog: ['Snuffle!', 'Snuffle!'],
  pet_turtle: ['Slow and steady!', 'Perlahan tapi pasti!'], pet_kancil: ['Clever kancil!', 'Kancil bijak!'], pet_panda: ['Munch munch!', 'Nyam nyam!'], pet_owl: ['Hoo hoo!', 'Hu hu!'],
  pet_axolotl: ['Blub blub!', 'Blub blub!'], pet_tiger: ['Grrr!', 'Grrr!'], pet_whale: ['Whooo!', 'Whooo!'], pet_phoenix: ['Whoosh!', 'Whoosh!'], pet_frog: ['Ribbit!', 'Ribbit!'],
  pet_octopus: ['Splash!', 'Splash!'], pet_elephant: ['Toot toot!', 'Toot toot!'], pet_orangutan: ['Oo oo!', 'Uu uu!'], pet_hornbill: ['Kwak kwak!', 'Kwak kwak!']
};
const BUDDY_EM = { pet_cat: '🐱', pet_dog: '🐶', pet_bunny: '🐰', pet_penguin: '🐧', pet_slime: '🟢', pet_robot: '🤖', pet_dragon: '🐲', pet_unicorn: '🦄', pet_fox: '🦊', pet_hedgehog: '🦔', pet_turtle: '🐢', pet_kancil: '🦌', pet_panda: '🐼', pet_owl: '🦉', pet_axolotl: '🦎', pet_tiger: '🐯', pet_whale: '🐳', pet_phoenix: '🔥', pet_frog: '🐸', pet_octopus: '🐙', pet_elephant: '🐘', pet_orangutan: '🦧', pet_hornbill: '🐦' };
const BUDDY_LINES = {
  streak: [['You are on fire! Keep going!', 'Kamu hebat sungguh! Teruskan!'], ['Wow, {n} in a row!', 'Wah, {n} berturut-turut!'], ['I knew you could do it!', 'Saya tahu kamu boleh!'], ['Super brain power!', 'Kuasa otak super!'], ['Go, go, go! I am so proud!', 'Jom, jom! Saya bangga!'], ['What a team we are!', 'Hebatnya pasukan kita!']],
  wrong: [['That is okay. Try again, I believe in you!', 'Tak apa. Cuba lagi, saya percaya kamu!'], ['Mistakes help us learn!', 'Kesilapan membantu kita belajar!'], ['Take a breath. You can do it!', 'Tarik nafas. Kamu boleh!'], ['Almost! Let us look at it together.', 'Hampir! Mari kita lihat bersama.'], ['I am right here with you!', 'Saya ada di sini bersama kamu!'], ['Every hero tries again!', 'Setiap wira cuba lagi!']]
};
const buddyOn = () => !S.buddy || S.buddy.on !== false;
function buddyWho() {
  const id = petOn();
  if (id) return { id, em: BUDDY_EM[id] || '🐾', name: petName(id), snd: (BUDDY_SND[id] || ['Yay!', 'Yey!'])[S.lang === 'ms' ? 1 : 0] };
  return { id: null, em: '🦉', name: t('lk.hoot'), snd: BUDDY_SND.pet_owl[S.lang === 'ms' ? 1 : 0] };
}
let buddyLast = -1, buddyAt = 0, buddyKind = '';
function buddyLine(kind, n) {
  const pool = BUDDY_LINES[kind], ms = S.lang === 'ms' ? 1 : 0;
  let i = Math.floor(Math.random() * pool.length); if (i === buddyLast && pool.length > 1) i = (i + 1) % pool.length; buddyLast = i;
  return pool[i][ms].replace('{n}', n);
}
function heroTalk(html, ms2 = 2600, cls = '') {
  const st = $('#stage'), h = hs(); if (!st || !h) return;
  let el = $('#hTalk'); if (!el) { el = document.createElement('div'); el.id = 'hTalk'; el.className = 'mtalk lk-talk'; el.setAttribute('aria-hidden', 'true'); st.appendChild(el); }
  const p = fx.pos(h); el.className = 'mtalk lk-talk ' + cls;
  el.innerHTML = html; el.style.left = Math.round(Math.min(Math.max(p.x, 80), st.clientWidth - 80)) + 'px'; el.style.top = Math.round(Math.max(34, p.y - p.h * .6)) + 'px';
  el.hidden = false; replayClass(el, 'pop'); clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; }, ms2);
}
function buddySay(kind, n) {
  if (!buddyOn() || !B.active) return;
  const now = Date.now(); if (now - buddyAt < 4500) return; buddyAt = now;
  const b = buddyWho(), line = buddyLine(kind, n);
  const tk = B.token;
  setTimeout(() => {
    if (B.token !== tk || !B.active) return;
    heroTalk(`<small>${b.em} ${esc(b.name)}</small>${esc(b.snd)} ${esc(line)}`, 3200, 'pet');
    const el = hs(); if (el && el.animate && !S.sensory) el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 320, easing: 'ease-out' });   // a little hop of joy
    if (S.voice && S.voice.auto) speak(line);
  }, kind === 'wrong' ? 500 : 800);
  announce(b.name + ': ' + line);
}
HOOK.on('startBattle', () => { buddyAt = 0; buddyKind = ''; });
HOOK.on('answer:right', () => { const c = B.combo | 0; if (c === 3 || (c > 5 && c % 4 === 2)) buddySay('streak', c); });
HOOK.on('answer:wrong', () => { buddySay('wrong'); });

/* ---- the battle cry and the hero's name in battle ---- */
HOOK.on('startBattle', () => {
  const nm = lkName(), hn = $('#hName'); if (nm && hn) hn.textContent = nm;
  const i = lk().cry; if (!(i >= 0) || !LK_CRIES[i]) return;
  const tk = B.token;
  setTimeout(() => { if (B.token !== tk || !B.active) return; const c = LK_CRIES[i][S.lang === 'ms' ? 1 : 0]; heroTalk(esc(c), 2200, 'cry'); if (S.voice && S.voice.auto) speak(c); }, B.lv && B.lv.boss ? 2500 : 1900);
});
/* the victory pose follows the choice (the older code always cheered) */
HOOK.around('pose', (next, el, name, ms) => next(el, name === 'cheer' && el && el.id === 'heroSprite' && lkWinPose() !== 'cheer' ? lkWinPose() : name, ms));

/* ---- celebration pacing ---- */
const celebMode = () => { const m = (S.celeb || {}).mode; return m === 'first' || m === 'short' ? m : 'always'; };
function setCelebMode(m) { if (!['always', 'first', 'short'].includes(m)) m = 'always'; S.celeb = Object.assign({ seen: {} }, S.celeb); S.celeb.mode = m; S.celeb.asked = 1; save(); }
function celebFull(id, final) {
  if (final) return true;
  const m = celebMode(), seen = (S.celeb && S.celeb.seen) || {};
  if (m === 'short') return false;
  if (m === 'first') return !seen[id];
  return true;
}
HOOK.around('finisherSeq', async (next, dmg) => {
  const it = finOf(), tk = B.token, final = !!(B.lv && B.lv.boss) && B.mHp - dmg <= 0;
  if (celebFull(it.id, final)) {
    const ok = await next(dmg);
    S.celeb = Object.assign({ seen: {}, mode: 'ask' }, S.celeb); S.celeb.seen = S.celeb.seen || {};
    if (!S.celeb.seen[it.id]) { S.celeb.seen[it.id] = 1; if (!S.celeb.asked && celebMode() === 'always') S.celeb.offerNext = 1; save(); }
    return ok;
  }
  /* the quick version: the hit, the number and the name, then straight back to the question */
  const h = hs(), m = ms(); if (!h || !m) return next(dmg);
  const pm = fx.pos(m);
  announce(t('fin.sr', { f: finName(it), m: monName(), d: dmg }));
  if (!S.sensory) { pose(h, 'attack', 700); }
  await wait(S.sensory ? 150 : 280); if (B.token !== tk) return false;
  B.mHp = Math.max(0, B.mHp - dmg);
  if (!S.sensory) { pose(m, 'hurt', 600); flashSprite(m); }
  sfx.crit(); fx.num(pm.x, pm.y - pm.h * .45, `${it.fem || '✨'} −${dmg}`, 'crit'); updateHud();
  await wait(S.sensory ? 150 : 380);
  return B.token === tk;
});
/* the offer: on the victory card after the first big show (only while no one has answered yet) */
HOOK.on('win', () => {
  if (!S.celeb || !S.celeb.offerNext || S.celeb.asked) return;
  const wb = $('#winSheet .wbtns'); if (!wb || $('#winSheet .celeb-offer')) return;
  wb.insertAdjacentHTML('beforebegin', `<div class="celeb-offer"><p>🎆 ${esc(t('lk.offer'))}</p><div class="seg"><button class="chip" data-act="celebOffer" data-v="yes">⏭ ${esc(t('lk.offerYes'))}</button><button class="chip" data-act="celebOffer" data-v="no">${esc(t('lk.offerNo'))}</button></div></div>`);
});

/* ---- the Parents card gets the two switches ---- */
function v34LookCardHTML() {
  const cm = celebMode(), chips = ['always', 'first', 'short'].map(m => `<button class="chip" data-act="lkCeleb" data-v="${m}" aria-pressed="${cm === m}">${esc(t('lk.c.' + m))}</button>`).join('');
  return `<div class="seg">${tog('buddyToggle', 'v34.buddy', buddyOn())}</div><p class="note">${esc(t('v34.celeb'))}</p><div class="seg" role="group">${chips}</div>`;
}
try { applyLook(); } catch (e) { /* ignore */ }
HOOK.on('bootUI', () => applyLook());
Object.assign(window.__quest || (window.__quest = {}), { v34l: { LK_TITLES, LK_CRIES, LK_COLORS, buddyLine, celebFull, celebMode, setCelebMode, applyLook, lkTitle, buddyWho, renderMe, lk } });
