/* ================= State + offline persistence ================= */
const KEY = 'quest-academy-v4', OLD_KEY = 'quest-academy-v3', DEV_KEY = 'quest-academy-device';
let storageOK = true;
/* v21: device-level store. Holds the parent code and the list of children on this device; each child has
   their own save (the first child keeps the original key, so old saves simply become "child 1"). */
const DEV = (() => {
  let d = null; try { d = JSON.parse(localStorage.getItem(DEV_KEY) || 'null'); } catch (e) { d = null; }
  d = Object.assign({ v: 1, pin: null, pinUntil: 0, active: 'p1', profiles: [{ id: 'p1', name: '', made: Date.now() }] }, d || {});
  if (!d.profiles.length) d.profiles = [{ id: 'p1', name: '', made: Date.now() }];
  if (!d.profiles.some(p => p.id === d.active)) d.active = d.profiles[0].id;
  return d;
})();
function saveDev() { try { localStorage.setItem(DEV_KEY, JSON.stringify(DEV)); } catch (e) { storageOK = false; } }
const profKey = id => id === 'p1' ? KEY : KEY + ':' + id;
const curProfile = () => DEV.profiles.find(p => p.id === DEV.active) || DEV.profiles[0];
/* ---- Malaysian syllabus lessons: simple words, short sentences ----
   v21: only the titles load with the app. The lesson text of each subject is a separate file that is
   fetched the first time one of its lessons opens (and quietly in the background once the app is idle). */
(function simpleLessons() {
  const keep = LESSONS.KEEP, old = MODULES.splice(0, MODULES.length).filter(m => keep[m.id]);
  const rb = bs => [...new Set(bs.flatMap(b => b === 1 ? [1, 2] : b === 2 ? [3, 4] : [4]))].sort();
  old.forEach(m => { m.bands = rb(m.bands); const k = keep[m.id]; m.subject = k[0]; m.title = k[1]; m.body = null; m.ms = { title: k[2], body: null }; MODULES.push(m); });
  LESSONS.NEW.forEach(([id, subject, em, bands, min, en, ms, tiles]) => MODULES.push({ id, subject, em, bands: rb(bands), min, title: en, body: null, ms: { title: ms, body: null }, tiles }));
  const order = SUBJ_ORDER; MODULES.sort((x, y) => order.indexOf(x.subject) - order.indexOf(y.subject));
})();
/* v31: lesson text is split by subject AND age (content/lessons/<subject>/b<age band>.js); a lesson lives in the file of
   the youngest age that has it. Opening a lesson loads only its file; a subject's list loads the files for this age. */
const LESSON_TEXT = import.meta.glob('./content/lessons/*/*.js'), LESSON_P = {};
const lessonMinBand = m => Math.min(...m.bands);
function ensureLessonFile(subj, b) {
  const k = subj + '/b' + b; if (LESSON_P[k]) return LESSON_P[k];
  const ld = LESSON_TEXT['./content/lessons/' + k + '.js'];
  if (!ld) return Promise.resolve();
  return (LESSON_P[k] = ld().then(mod => {
    const T = mod.default; MODULES.forEach(m => { const x = T[m.id]; if (x) { m.body = x[0]; m.ms.body = x[1]; } });
  }).catch(e => { delete LESSON_P[k]; throw e; }));
}
/* every age's text for a subject (the notebook, the content check and the background preload use this) */
function ensureLessons(subj) { return Promise.all([1, 2, 3, 4].map(b => ensureLessonFile(subj, b))).then(() => { }); }
/* only what one age needs: the files of every lesson shown at that age */
function ensureLessonsBand(subj, band) { const bs = new Set(MODULES.filter(m => m.subject === subj && m.bands.includes(band)).map(lessonMinBand)); return Promise.all([...bs].map(b => ensureLessonFile(subj, b))).then(() => { }); }
const ensureLesson = m => ensureLessonFile(m.subject, lessonMinBand(m));
function detectLang() { try { const l = (navigator.language || 'en').slice(0, 2); return l === 'ms' ? 'ms' : 'en'; } catch (e) { return 'en'; } }
const defaults = () => ({
  v: SAVE_SCHEMA, lang: detectLang(), coins: 60, earned: 0, band: 2, theme: 'auto', dys: false, fs: 1, sensory: false, sfx: true, pixel: true,
  repPick: 'concrete', pace: 'standard', showTimer: true, voice: { auto: false, rate: .82, style: 'gentle', name: '' }, vol: { music: 80, sfx: 80, voice: 100 }, timerMin: 0, session: { day: todayKey(), elapsed: 0, extra: 0 },
  owned: ITEMS.filter(i => i.cost === 0).map(i => i.id), equipped: { ...DEFAULT_EQUIP },
  stars: {}, defeated: 0, battles: 0, qstats: {}, days: {}, learned: {}, topics: {}, recent: [], log: [], expr: 'tap', savedAt: 0,
  welcomed: false, openAll: false, quiz: {}, pracDay: {}, cards: {}, fcDay: {}, lotw: null, goals: {}, locks: [], focus: null, bedtime: { at: '', ok: 0 }, micOff: false, micOnline: false, cb: false,
  petXP: {}, haven: { furn: [], placed: [], theme: 'sunny', themes: ['sunny'] }, comics: {}, reflect: [],
  place: {}, placed: false, adapt: true, look: {}, celeb: { seen: {}, mode: 'ask' }, kbat: {}, buddy: { on: true }, inst: {}   // v34
});
let S, MIGRATED = null;
(function load() {
  let raw = null;
  try { raw = localStorage.getItem(profKey(DEV.active)) || (DEV.active === 'p1' ? localStorage.getItem(OLD_KEY) : null); } catch (e) { storageOK = false; }
  let o = {}; try { o = JSON.parse(raw || '{}') || {}; } catch (e) { o = {}; }
  const MG = migrateSave(o); o = MG.save; MIGRATED = MG.info;   // v34: the numbered save steps (04z)
  S = Object.assign(defaults(), o);
  if (S.lang !== 'ms') S.lang = 'en';
  if (!(S.band >= 1 && S.band <= 4)) S.band = 2;
  if (o.voice && o.voice.style === undefined && o.voice.rate >= .9) o.voice.rate = .82;
  S.voice = Object.assign({ auto: false, rate: .82, style: 'gentle', name: '' }, S.voice || {});
  S.equipped = Object.assign(defaults().equipped, S.equipped || {});
  S.vol = Object.assign({ music: 80, sfx: 80, voice: 100 }, S.vol || {}); S.bedtime = Object.assign({ at: '', ok: 0 }, S.bedtime || {}); if (!Array.isArray(S.locks)) S.locks = [];
  ITEMS.filter(i => i.cost === 0).forEach(i => { if (!S.owned.includes(i.id)) S.owned.push(i.id); });
  if (S.pin && !DEV.pin) { DEV.pin = S.pin; DEV.pinUntil = S.pinUntil || 0; saveDev(); }   // v21: the parent code moves to the device store
  delete S.pin; delete S.pinUntil;
  if (!ITEM[S.equipped.knight]) S.equipped.knight = 'knight_tobias';   // v17: Explorer Kid retired
  if (!o.welcomed && (o.coins !== undefined)) S.welcomed = true;
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* local-only request */ }
})();
/* v21: save() is debounced: many quick changes (every answer, coin, star) become one write ~0.6 s later.
   saveNow() writes at once; it also runs when the page is hidden or closed, so nothing is lost. */
/* S always goes back to the child it was loaded for (saveKey); saveOff stops writes while the page reloads
   into another child, so a late write can never land in the wrong child's save. */
let saveT = 0, saveKey = profKey(DEV.active), saveOff = false;
function saveNow() {
  clearTimeout(saveT); saveT = 0; if (saveOff) return; S.savedAt = Date.now();
  try { localStorage.setItem(saveKey, JSON.stringify(S)); storageOK = true; } catch (e) { storageOK = false; }
}
function save() { if (!saveT) saveT = setTimeout(saveNow, 600); }
addEventListener('pagehide', saveNow);
document.addEventListener('visibilitychange', () => { if (document.hidden && saveT) saveNow(); });
const logEvent = (k, p) => { S.log.unshift({ t: Date.now(), k, p }); S.log = S.log.slice(0, 8); };
const UI = { arm: 'gear', hvSel: null, comic: null, rf: null, tab: 'studies', adv: 'map', screen: 'subjects', subj: 'math', zoneOpen: {}, subject: 'math', open: null, all: false, slot: 'knight', eraseArmed: false, brief: null, blendIdx: 0, lit: new Set(), blended: false, react: -1, fade: 0, sample: false };
const gate = { unlocked: false, mode: 'enter', buf: '', first: '', msg: '', shake: false, t: 0, fails: 0, forgot: false };
const B = { lv: null, mHp: 1, mMax: 1, hHp: 100, hMax: 100, combo: 0, q: null, wrong: 0, locked: false, picked: new Set(), asked: 0, first: 0, lastKey: '', seen: new Set(), token: 0, hintSpeech: [], tier: 0, step: 0, tleft: 0, tmax: 0, nudges: 0, strokes: [], tool: 'pen', active: false, dk: 1, wordVisible: true, wTimer: 0, pool: [], vState: 'idle', rightIdx: -1, msg: null, lead: '' };
const sess = { solved: 0, coins: 0, stars: 0 };
const power = () => ITEM[S.equipped.weapon].power || 0;
const guardPct = () => ITEM[S.equipped.shield].guard || 0;
const effPace = () => S.sensory ? 'unlimited' : S.pace;
/* v16: answer time per question (ms) and the boss "enrage" countdown for each pacing choice */
const PACE_MS = { p10: 10000, p15: 15000, standard: 20000, extended: 45000, unlimited: 0 };
const ENRAGE_MS = { p10: 8000, p15: 11000, standard: 15000, extended: 30000, unlimited: 0 };
const PACES = ['p10', 'p15', 'standard', 'extended', 'unlimited'];

function addCoins(n) {
  S.coins += n; S.earned += n; sess.coins += n;
  $('#coinVal').textContent = S.coins;
  if (!S.sensory) { replayClass($('#coins'), 'pop'); }
}
function applyTheme() {
  const th = S.theme === 'auto' ? (S.pixel ? 'dark' : 'warm') : S.theme;   // v13: pixel mode defaults to the royal-night look
  const r = document.documentElement;
  r.dataset.theme = th; r.dataset.band = S.band; r.dataset.dys = S.dys ? '1' : '0'; r.dataset.sensory = S.sensory ? '1' : '0'; r.dataset.pixel = S.pixel ? '1' : '0'; r.dataset.cb = S.cb ? '1' : '0';
  r.style.setProperty('--fs', S.fs); r.lang = S.lang;
  if (S.pixel && typeof PX !== 'undefined') r.style.setProperty('--px-backdrop', `url(${PX.uiBg(th === 'dark')})`); else r.style.removeProperty('--px-backdrop');
  $('meta[name=theme-color]').content = th === 'dark' ? (S.pixel ? '#14112E' : '#0E1226') : (S.pixel ? '#E9D9B4' : '#FFF0B3');
}
function recordTopic(id, first) {
  const o = S.topics[id] || (S.topics[id] = { n: 0, f: 0, recent: [] });
  o.n++; if (first) o.f++;
  o.recent.push(first ? 1 : 0); o.recent = o.recent.slice(-8);
}
const mastery = id => { const o = S.topics[id]; return o && o.recent.length ? o.recent.reduce((a, b) => a + b, 0) / o.recent.length : null; };
let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.innerHTML = `${owlSVG()}<span>${esc(msg)}</span>`; el.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), 5000);
}

/* ================= Voice narration (on-device speech synthesis) ================= */
function toSpeech(s) {
  return String(s)
    .replace(/(\d+)\/(\d+)/g, '$1 over $2').replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/\+/g, ' plus ').replace(/=/g, ' equals ')
    .replace(/[\u{1F000}-\u{1FFFF}\u{2190}-\u{2BFF}\u{FE0F}\u{200D}]/gu, ' ').replace(/[_·•→➜]/g, ' ').replace(/\s+/g, ' ').trim();
}
/* parts: [[text, langCode?], ...] spoken in order, so English words inside Malay prompts keep an English voice */
const speak = (text, lc) => speakSeq([[text, lc]]);

/* ================= Gentle sound effects (muted in sensory mode) ================= */
/* tone() is kept for older calls; it now runs through the v8 mixer (see the sound engine further down) */
function tone(f, d, type = 'sine', v = .04, delay = 0) { sx([{ f, d, type, v: v * 1.6, delay }]); }
const sfx = {
  ok() { tone(660, .15); tone(880, .2, 'sine', .04, .1); },
  hit() { tone(200, .16, 'triangle', .05); },
  soft() { tone(330, .22, 'sine', .025); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .25, 'sine', .04, i * .12)); }
};
