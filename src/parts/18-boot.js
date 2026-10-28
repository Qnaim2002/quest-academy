/* ================= Boot ================= */
/* ================= v8: Malaysian syllabus text (EN + BM only) ================= */
(() => {
  const X = (en, ms) => [en, ms];
  const subj = { math: ['Matematik', 'Matematik'], bm: ['Bahasa Melayu', 'Bahasa Melayu'], en: ['English', 'Bahasa Inggeris'], sc: ['Science', 'Sains'], pm: ['Moral Education', 'Pendidikan Moral'], pk: ['Citizenship', 'Pendidikan Kewarganegaraan'], se: ['Feelings and Friends', 'Sosioemosi'], fk: ['Health and Movement', 'Fizikal dan Kesejahteraan Diri'], sv: ['Art', 'Pendidikan Seni'], mz: ['Music', 'Pendidikan Muzik'] };
  const advd = { math: ['Numbers, money, time and shapes', 'Nombor, wang, masa dan bentuk'], bm: ['Letters, words and sentences', 'Huruf, perkataan dan ayat'], en: ['Letters, words and grammar', 'Huruf, perkataan dan tatabahasa'], sc: ['Body, animals, plants and Earth', 'Badan, haiwan, tumbuhan dan Bumi'], pm: ['Good values every day', 'Nilai murni setiap hari'], pk: ['Family, school and Malaysia', 'Keluarga, sekolah dan Malaysia'], se: ['Feelings, friends and festivals', 'Perasaan, kawan dan perayaan'], fk: ['Moving, eating well and staying safe', 'Bergerak, makan sihat dan selamat'], sv: ['Colours, lines and crafts', 'Warna, garisan dan kraf'], mz: ['Sounds, beats and songs', 'Bunyi, rentak dan lagu'] };
  const goal = { math: ['Solve the number questions to beat the monster.', 'Selesaikan soalan nombor untuk kalahkan raksasa.'], bm: ['Answer the Bahasa Melayu questions to beat the monster.', 'Jawab soalan Bahasa Melayu untuk kalahkan raksasa.'], en: ['Answer the English questions to beat the monster.', 'Jawab soalan Bahasa Inggeris untuk kalahkan raksasa.'], sc: ['Answer the science questions to beat the monster.', 'Jawab soalan sains untuk kalahkan raksasa.'], pm: ['Pick the good action to beat the monster.', 'Pilih tindakan yang baik untuk kalahkan raksasa.'], pk: ['Answer the citizenship questions to beat the monster.', 'Jawab soalan kewarganegaraan untuk kalahkan raksasa.'], se: ['Pick the kind and calm answer to beat the monster.', 'Pilih jawapan yang baik dan tenang untuk kalahkan raksasa.'], fk: ['Answer the health questions to beat the monster.', 'Jawab soalan kesihatan untuk kalahkan raksasa.'], sv: ['Answer the art questions to beat the monster.', 'Jawab soalan seni untuk kalahkan raksasa.'], mz: ['Answer the music questions to beat the monster.', 'Jawab soalan muzik untuk kalahkan raksasa.'] };
  const cms = { math: ['Numbers will help.', 'Nombor akan membantu.'], bm: ['Letters and words will help.', 'Huruf dan perkataan akan membantu.'], en: ['Letters and words will help.', 'Huruf dan perkataan akan membantu.'], sc: ['Science will help.', 'Sains akan membantu.'], pm: ['Kindness will help.', 'Kebaikan akan membantu.'], pk: ['Love for our country will help.', 'Cinta kepada negara akan membantu.'], se: ['Calm feelings will help.', 'Perasaan tenang akan membantu.'], fk: ['A healthy body will help.', 'Badan yang sihat akan membantu.'], sv: ['Colours will help.', 'Warna akan membantu.'], mz: ['Music will help.', 'Muzik akan membantu.'] };
  Object.keys(subj).forEach(k => { STR['subj.' + k] = X(...subj[k]); STR['advd.' + k] = X(...advd[k]); STR['goal.' + k] = X(...goal[k]); STR['cm.s.' + k] = X(...cms[k]); });
  Object.assign(STR, {
    'band.1': X('Age 4', 'Umur 4'), 'band.2': X('Age 5', 'Umur 5'), 'band.3': X('Age 6', 'Umur 6'), 'band.4': X('Age 7', 'Umur 7'),
    'band.d1': X('Very easy questions for age 4', 'Soalan sangat mudah untuk umur 4'), 'band.d2': X('Easy questions for age 5', 'Soalan mudah untuk umur 5'), 'band.d3': X('Questions for age 6', 'Soalan untuk umur 6'), 'band.d4': X('Questions for age 7', 'Soalan untuk umur 7'), 'tu.g4': X('Great job today!', 'Tahniah hari ini!'),
    's.bank0': X('Look at the picture and read the question slowly.', 'Lihat gambar dan baca soalan perlahan-lahan.'),
    's.bank1': X('Think about what you learned in class.', 'Fikir apa yang kamu belajar di kelas.'),
    's.bank2': X('Take out the answers that cannot be right.', 'Buang jawapan yang tidak mungkin betul.'),
    'adv.sub': X('Pick a subject to play.', 'Pilih subjek untuk bermain.'),
    'st.title': X('Lessons', 'Pelajaran'), 'st.sub': X('Short and easy lessons. Tap 🔊 to listen.', 'Pelajaran pendek dan mudah. Sentuh 🔊 untuk dengar.'),
    'st.min': X('{n} min', '{n} min'), 'st.age': X('Pick your level', 'Pilih tahap kamu'), 'st.ageAll': X('All', 'Semua'),
    'st.learnbtn': X('I learned this! +5 🪙', 'Saya sudah belajar! +5 🪙'), 'st.already': X('You learned this. Well done!', 'Kamu sudah belajar ini. Bagus!'),
    'st.none': X('No lessons here yet.', 'Belum ada pelajaran di sini.'), 'st.count': X('{n} lessons', '{n} pelajaran'), 'st.learned': X('{d}/{n} done', '{d}/{n} siap'),
    'pet.lessonDone': X('I learned this! ✔', 'Saya sudah belajar! ✔'), 'pet.lessonAgain': X('You learned this. Well done!', 'Kamu sudah belajar ini. Bagus!'),
    'pet.lessonHint': X('Your pet gets {n} XP.', 'Haiwan kamu dapat {n} XP.'), 'pet.lessonNoPet': X('Pick a pet to get XP.', 'Pilih haiwan untuk dapat XP.'),
    'st.listen': X('Listen', 'Dengar'),
    'tp.math_pw': X('Bars: parts and whole', 'Bar: bahagian dan keseluruhan'), 'tp.math_cmp': X('Bars: comparing', 'Bar: membandingkan'), 'tp.math_units': X('Bars: groups', 'Bar: kumpulan'), 'tp.math_frac': X('Fractions', 'Pecahan')
  });
})();
/* v21: pick the sprite quality, then load last session's sprites from IndexedDB (at most ~0.35 s) so the
   first screen does not redraw them; the device speed check and cache tidy-up run once the app is idle. */
PX.Q.tier = qualityTier(); markLite();
function bootUI() { return HOOK.call('bootUI', bootUIBase, arguments); }   // v31: extensions register with HOOK (00c)
function bootUIBase() {
  ensureSession();
  applyTheme(); applyLang();
  $('#coinVal').textContent = S.coins;
  buildAdventure();
  showTab('studies', true);   // v37: Learn is the home screen
  warmFor('boot');
  checkTimer();
  setInterval(tick, 1000);
  setInterval(() => { thinkTick(); enrageTick(); quirkTick(); }, 250);
  checkBedtime(); syncWhoBtn();
  if (!S.welcomed) { renderWelcome(); $('#welcomeOverlay').classList.add('on'); } else maybeAskWho();
  idle(() => { measureQuality(); SPRITES.prune(); });
  /* v26: the sprite worker quietly draws the Cards tab's monsters in the background, so the tab opens complete */
  setTimeout(() => { try { if (!S.pixel || !SPRW.able()) return; const A = dexAll(); A.order.forEach(k => { const l = A.by[k], g = l.find(c => hasCard(c.subj, c.n)); SPRW.ask('mon', (g || l[0]).m); }); } catch (e) { /* only a speed-up */ } }, 2500);
}
const LAB = new URLSearchParams(location.search).has('lab');   // ?lab opens the Sprite Lab (19) instead of the game
if (LAB) S.pixel = true;
(S.pixel && !import.meta.env.DEV ? SPRITES.preload(350) : Promise.resolve()).catch(() => {}).then(() => LAB ? startSpriteLab() : bootUI());
/* v21: offline app. The service worker (built into dist/sw.js) only runs in the production build, over
   https or on localhost; lesson text for every subject is fetched in the background once the app is idle. */
if (import.meta.env.PROD && 'serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) addEventListener('load', () => navigator.serviceWorker.register('./sw.js').then(r => { if (typeof pwaWatch === 'function') pwaWatch(r); }).catch(() => { /* still works online */ }));
/* v31: this age's lesson text and story first, then everything else */
setTimeout(() => { const b0 = S.band; loadCuts(b0).catch(() => {}); SUBJ_ORDER.reduce((p, s) => p.then(() => ensureLessonsBand(s, b0)).catch(() => {}), Promise.resolve()).then(() => SUBJ_ORDER.reduce((p, s) => p.then(() => ensureLessons(s)).catch(() => {}), Promise.resolve())).then(() => [1, 2, 3, 4].forEach(b => loadCuts(b).catch(() => {}))); }, 6000);
window.__quest = { zoneSting, ZINSTR, ZMOTIF, musicZone, AU_: () => AU, renderCards, dex, dexAll, dexNew, nextQuestion, heroSVGx: heroSVG, monsterSVGx: monsterSVG, AU, SONGS, setMusic, syncMusic, musicOn, heroKO, counterSeq, onPick, updateHud, win, S: () => S, musicFor, petStage, petSVG, petAlone, addPetXP, openComic, renderHaven, wxKind, gotoLevel, bossPhaseOf, B, UI, gate, makeQ, mathQ, levelOf, monsterFor, ITEMS, MODULES, tick, checkTimer, thinkTick, setLang, STR, t, getLevel, openBrief, startBattle, renderParent, mountManip, reviewEntries, sha256, pinHash, pinCheck, monsterSVG, heroSVG, showTab, leaveBattle, GLYPHS, traceQ, traceScore, matchSpoken, spokenNumbers, recordQ, weekSummary, trickyQuestions, DEV, switchKid, addKid, removeKid, subjOpen, bedtimeNow, checkBedtime, dayStat, playQuirk, QUIRKS, speciesOfMon, musIntensity, announce, QT, finPreview, runFinisher, renderArmory, lessonTopic, renderStudies };
window.__px = PX;
window.__bank = BANK;
