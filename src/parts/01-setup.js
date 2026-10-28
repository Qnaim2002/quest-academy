/* ================= Helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* v21: the local calendar day (the session timer and daily records roll over at local midnight, not 08:00 UTC+8) */
const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
let uid = 0;
/* v30: only touch the page when the new markup is different (rebuilding the same screen again costs style + layout + paint) */
function setHTML(el, html) { if (!el) return false; if (el.__h === html) return false; el.__h = html; el.innerHTML = html; return true; }
/* restart a CSS animation class without forcing the browser to lay out the page in the middle of a script
   (the old trick was "remove class, read offsetWidth, add class", which costs a full layout every time).
   A new element just gets the class; a running animation is rewound; otherwise the class comes back two frames later. */
function replayClass(el, cls, drop = []) {
  if (!el) return;
  drop.forEach(c => { if (c !== cls) el.classList.remove(c); });
  if (!el.classList.contains(cls)) { el.classList.add(cls); return; }
  const an = el.getAnimations ? el.getAnimations().filter(a => a.animationName) : [];
  if (an.length) { an.forEach(a => { a.currentTime = 0; a.play(); }); return; }
  el.classList.remove(cls); cancelAnimationFrame(el.__rp || 0);
  el.__rp = requestAnimationFrame(() => { el.__rp = requestAnimationFrame(() => { el.__rp = 0; el.classList.add(cls); }); });
}

/* ================= Languages (English / Bahasa Melayu) ================= */
const LANGS = {
  en: { n: 'English', c: 'EN', tts: 'en-US', i: 0 },
  ms: { n: 'Bahasa Melayu', c: 'BM', tts: 'ms-MY', i: 1 }
};
const LANG_ORDER = ['en', 'ms'];
const L = () => LANGS[S.lang].i;
const fmtv = (s, v) => v ? s.replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m) : s;
/* t('key', {vars}) returns a string, or an array of strings for step lists */
function t(k, v) {
  const e = STR[k]; if (!e) return k;
  let s = e[L()]; if (s === undefined) s = e[0];
  return Array.isArray(s) ? s.map(x => fmtv(x, v)) : fmtv(s, v);
}
/* pick a translated field from a data record that stores {ms:...} beside its English default */
const tr = (rec, field) => (S.lang !== 'en' && rec[S.lang] && rec[S.lang][field] !== undefined) ? rec[S.lang][field] : rec[field];

const STR = {
  /* navigation + common */
  'nav.studies': ['Studies', 'Pelajaran'],
  'nav.armory': ['Armory', 'Perkakas'],
  'nav.adventure': ['Adventure', 'Kembara'],
  'nav.parent': ['Parents', 'Ibu Bapa'],
  'lang.change': ['Change language', 'Tukar bahasa'],
  'on': ['On', 'Hidup'], 'off': ['Off', 'Mati'],
  'time.left': ['Time left: {t}', 'Masa berbaki: {t}'],
  'subj.math': ['Math', 'Matematik'], 'subj.lit': ['Literacy', 'Literasi'], 'subj.stem': ['STEM', 'STEM'],

  /* studies */
  'st.title': ['Studies', 'Pelajaran'],
  'st.sub': ['Short lessons that help your hero win. Tap 🔊 to hear any lesson read aloud.', 'Pelajaran ringkas untuk membantu wira anda menang. Sentuh 🔊 untuk mendengar pelajaran dibacakan.'],
  'st.learned': ['{d}/{n} learned', '{d}/{n} dipelajari'],
  'st.min': ['{n} min read', '{n} min bacaan'],
  'st.listen': ['Listen to this lesson', 'Dengar pelajaran ini'],
  'st.learnbtn': ['I learned this! +5 🪙', 'Saya sudah belajar! +5 🪙'],
  'st.already': ['You already learned this one. Nice work!', 'Anda sudah belajar ini. Bagus!'],
  'st.none': ['No lessons here for this age yet.', 'Belum ada pelajaran untuk umur ini.'],
  'rep.title': ['See it three ways', 'Lihat dalam tiga cara'],
  'rep.concrete': ['Build it', 'Bina'], 'rep.pictorial': ['Picture', 'Gambar'], 'rep.abstract': ['Numbers', 'Nombor'],
  'rep.concreteTxt': ['Build it with blocks. Drag a block into the bar, or tap it.', 'Bina dengan blok. Seret blok ke dalam bar atau sentuh.'],
  'rep.pictorialTxt': ['Now the same idea as a bar picture.', 'Kini idea yang sama sebagai gambar bar.'],
  'rep.abstractTxt': ['Finally, the same idea with numbers only.', 'Akhir sekali, idea yang sama dengan nombor sahaja.'],
  'rep.hint': ['Try the picture or numbers view too.', 'Cuba juga paparan gambar atau nombor.'],

  /* manipulatives */
  'mp.count': ['Your count: {n}', 'Kiraan anda: {n}'],
  'mp.number': ['Your number: {n}', 'Nombor anda: {n}'],
  'mp.use': ['Use my count', 'Guna kiraan saya'],
  'mp.useNum': ['Use my number', 'Guna nombor saya'],
  'mp.reset': ['Start over', 'Mula semula'],
  'mp.add': ['Add a block', 'Tambah blok'],
  'mp.h': ['Hundreds', 'Ratus'], 'mp.t': ['Tens', 'Puluh'], 'mp.o': ['Ones', 'Sa'],
  'mp.trade1': ['10 ones traded for 1 ten!', '10 sa ditukar dengan 1 puluh!'],
  'mp.trade2': ['10 tens traded for 1 hundred!', '10 puluh ditukar dengan 1 ratus!'],
  'mp.cap': ['That is the biggest number here.', 'Itu nombor terbesar di sini.'],
  'mp.nomatch': ['None of the choices equals {n}. Check your blocks.', 'Tiada pilihan bersamaan {n}. Semak blok anda.'],
  'mp.cut': ['Cut into', 'Potong kepada'],
  'mp.shaded': ['Shaded: {k}/{n}', 'Berlorek: {k}/{n}'],
  'mp.piece': ['Each piece = {v}', 'Setiap kepingan = {v}'],
  'mp.hintUnit': ['Drag a block into the bar, or tap a box. Tap a block to take it back.', 'Seret blok ke dalam bar atau sentuh petak. Sentuh blok untuk mengeluarkannya.'],
  'mp.hintTen': ['Drag blocks onto the mat, or tap them. Tap a block on the mat to take it away.', 'Seret blok ke atas tikar atau sentuh. Sentuh blok pada tikar untuk mengeluarkannya.'],
  'mp.hintFrac': ['Cut the bar into equal pieces, then tap pieces to shade them.', 'Potong bar kepada kepingan sama besar, kemudian sentuh untuk melorek.'],

  /* armory */
  'ar.title': ['Hero Armory', 'Gedung Senjata Wira'],
  'ar.hero': ['Your hero', 'Wira anda'],
  'ar.tip': ['Tools add attack power. Shields soften the monster’s attacks.', 'Alat menambah kuasa serangan. Perisai melembutkan serangan raksasa.'],
  'ar.power': ['⚔️ Power {n}', '⚔️ Kuasa {n}'], 'ar.guard': ['🛡️ Guard {n}%', '🛡️ Pertahanan {n}%'],
  'ar.wearing': ['Wearing ✔', 'Dipakai ✔'], 'ar.wear': ['Wear', 'Pakai'],
  'ar.buy': ['🪙 {c} · Buy', '🪙 {c} · Beli'], 'ar.need': ['🪙 Need {n} more', '🪙 Perlu {n} lagi'],
  'ar.starter': ['Starter', 'Permulaan'], 'ar.style': ['Style', 'Gaya'],
  'ar.powerStat': ['+{n} power', '+{n} kuasa'], 'ar.guardStat': ['{n}% guard', '{n}% pertahanan'],
  'sl.hat': ['Hats', 'Topi'], 'sl.cape': ['Capes', 'Jubah'], 'sl.weapon': ['Tools', 'Alat'], 'sl.shield': ['Shields', 'Perisai'], 'sl.outfit': ['Outfits', 'Pakaian'],

  /* world map, briefing */
  'map.locked': ['Clear level {id} first to unlock this one.', 'Tamatkan tahap {id} dahulu untuk membuka yang ini.'],
  'map.aria': ['Level {id}, {name}{boss}, {s}', 'Tahap {id}, {name}{boss}, {s}'],
  'map.stars': ['{n} of 3 stars', '{n} daripada 3 bintang'], 'map.lockedAria': ['locked', 'berkunci'],

  'br.enemy': ['Enemy', 'Musuh'],
  'br.stars': ['Stars', 'Bintang'],
  'br.rep': ['Pick how to solve it', 'Pilih cara menyelesaikannya'],
  'br.engage': ['⚔️ Engage Battle!', '⚔️ Mulakan Pertempuran!'],
  'br.say': ['Level {id}, {name}. Your enemy is {m}. {goal}', 'Tahap {id}, {name}. Musuh anda ialah {m}. {goal}'],
  'br.listen': ['Listen to the briefing', 'Dengar taklimat'],

  /* battle */
  'b.hero': ['Hero', 'Wira'],
  'b.readq': ['Read the question aloud', 'Bacakan soalan'],
  'b.yes': ['Yes! Nice one. Your hero strikes for {d}!', 'Ya! Bagus. Wira anda menyerang dengan {d}!'],
  'b.blend': ['Nice blend! Now find the next sound.', 'Gabungan bagus! Sekarang cari bunyi seterusnya.'],
  'v.title': ['Victory!', 'Kemenangan!'], 'v.boss': ['Boss cleared!', 'Bos tewas!'],
  'v.next': ['Next level', 'Tahap seterusnya'], 'v.map': ['Back to map', 'Kembali ke peta'],
  'v.spoken': ['Victory! You earned {n} stars.', 'Kemenangan! Anda dapat {n} bintang.'],


  /* question text + tags */
  'tag.pw': ['Part-Whole model', 'Model bahagian-keseluruhan'], 'tag.cmp': ['Comparison model', 'Model perbandingan'],
  'tag.units': ['Equal-units model', 'Model unit sama'], 'tag.frac': ['Fraction bar', 'Bar pecahan'],
  'tag.spell': ['Spelling spell', 'Mantera ejaan'], 'tag.phon': ['Sound tiles', 'Jubin bunyi'],
  'tag.syll': ['Syllable claps', 'Tepukan suku kata'], 'tag.ce': ['Cause and effect', 'Sebab dan akibat'],
  'choices': ['The choices are', 'Pilihan jawapan ialah'],
  'q.pw_total': ['{n1} has {a} big {thA} and {b} small {thB}. How many {th} are there in all?', '{n1} ada {a} {th} besar dan {b} {th} kecil. Berapakah jumlah {th} semuanya?'],
  'q.pw_part': ['{n1} has {tot} {th}. {a} of them {isA} big. The rest are small. How many small {th} are there?', '{n1} ada {tot} {th}. {a} daripadanya besar. Selebihnya kecil. Berapakah {th} yang kecil?'],
  'q.groups': ['{n1} has {n} boxes with {v} {th} in each box. How many {th} in all?', '{n1} ada {n} kotak dengan {v} {th} dalam setiap kotak. Berapakah jumlah {th} semuanya?'],
  'q.groups_div': ['{n1} shares {tot} {th} equally into {n} bags. How many {th} in each bag?', '{n1} membahagikan {tot} {th} sama banyak ke dalam {n} beg. Berapakah {th} dalam setiap beg?'],
  'q.cmp_more': ['{n1} has {x} {thX}. {n2} has {y} more than {n1}. How many {th} does {n2} have?', '{n1} ada {x} {th}. {n2} ada {y} lebih daripada {n1}. Berapakah {th} yang {n2} ada?'],
  'q.cmp_diff': ['{n1} has {big} {thBig}. {n2} has {small}. How many more {th} does {n1} have?', '{n1} ada {big} {th}. {n2} ada {small}. Berapa banyak {th} lebih yang {n1} ada?'],
  'q.cmp_total': ['{n1} has {x} {th}. {n2} has {y} more than {n1}. How many {th} do they have altogether?', '{n1} ada {x} {th}. {n2} ada {y} lebih daripada {n1}. Berapakah jumlah {th} mereka bersama?'],
  'q.ratio': ['{n1} has {k} times as many {th} as {n2}. Together they have {tot}. How many does {n2} have?', '{n1} ada {k} kali ganda {th} berbanding {n2}. Bersama mereka ada {tot}. Berapakah yang {n2} ada?'],
  'q.frac_name': ['The bar is cut into {n} equal parts. {k} parts are shaded. What fraction is shaded?', 'Bar dibahagi kepada {n} bahagian sama. {k} bahagian berlorek. Apakah pecahan yang berlorek?'],
  'q.frac_of': ['{n1} has {tot} {th}. {k}/{n} of them are big. How many big {th} are there?', '{n1} ada {tot} {th}. {k}/{n} daripadanya besar. Berapakah {th} yang besar?'],
  'q.spell': ['Which spelling is correct?', 'Ejaan manakah yang betul?'],
  'q.spellSay': ['Which spelling is correct? The word is', 'Ejaan manakah yang betul? Perkataannya ialah'],
  'q.phon': ['Tap the sound tiles in order to build the word for the picture.', 'Sentuh jubin bunyi mengikut urutan untuk membina perkataan bagi gambar itu.'],
  'q.phon3': ['Tap the syllable tiles in order to build the word for the picture.', 'Sentuh jubin suku kata mengikut urutan untuk membina perkataan bagi gambar itu.'],
  'q.syll': ['How many syllables (claps) are in the word “{w}”?', 'Berapakah suku kata (tepukan) dalam perkataan “{w}”?'],
  'q.syllSay': ['How many syllables, or claps, are in the word', 'Berapakah suku kata, atau tepukan, dalam perkataan'],

  /* worked steps for the bar-model questions (shown in lesson practice) */
  's.pw_total': [['Look at the bar. The parts are {a} and {b}.', 'We want the whole, so we put the parts together.', '{a} + {b} = {ans}.'], ['Lihat bar itu. Bahagiannya ialah {a} dan {b}.', 'Kita mahu keseluruhan, jadi kita tambah bahagian.', '{a} + {b} = {ans}.']],
  's.pw_part': [['Look at the bar. The whole is {tot} and one part is {a}.', 'We want the other part, so we take away.', '{tot} − {a} = {ans}.'], ['Lihat bar itu. Keseluruhan ialah {tot} dan satu bahagian ialah {a}.', 'Kita mahu bahagian lain, jadi kita tolak.', '{tot} − {a} = {ans}.']],
  's.groups': [['There are {n} equal boxes with {v} in each.', 'We count by {v}, {n} times, or multiply.', '{n} × {v} = {ans}.'], ['Ada {n} kotak sama dengan {v} dalam setiap satu.', 'Kita kira {v}, sebanyak {n} kali, atau darab.', '{n} × {v} = {ans}.']],
  's.groups_div': [['The whole bar is {tot} and it has {n} equal boxes.', 'One box is the whole divided by {n}.', '{tot} ÷ {n} = {ans}.'], ['Keseluruhan bar ialah {tot} dan ada {n} kotak sama.', 'Satu kotak ialah keseluruhan dibahagi {n}.', '{tot} ÷ {n} = {ans}.']],
  's.cmp_more': [['Both bars start the same: {x}.', '{n2} has an extra {y}, so the long bar is longer.', '{x} + {y} = {ans}.'], ['Kedua-dua bar bermula sama: {x}.', '{n2} ada {y} tambahan, jadi bar panjang lebih panjang.', '{x} + {y} = {ans}.']],
  's.cmp_diff': [['Line up the bars. {n1} has {big} and {n2} has {small}.', 'The extra part on the long bar is the difference, so we take away.', '{big} − {small} = {ans}.'], ['Susun bar. {n1} ada {big} dan {n2} ada {small}.', 'Bahagian lebih pada bar panjang ialah beza, jadi kita tolak.', '{big} − {small} = {ans}.']],
  's.cmp_total': [['{n1} has {x}. {n2} has {x} plus {y} more.', 'We need both bars, so we add them together.', '{x} + {x2} = {ans}.'], ['{n1} ada {x}. {n2} ada {x} tambah {y}.', 'Kita perlukan kedua-dua bar, jadi kita tambah.', '{x} + {x2} = {ans}.']],
  's.ratio': [['{n2} is 1 box and {n1} is {k} boxes.', 'Together that is {boxes} equal boxes, and they make {tot}.', '{tot} ÷ {boxes} = {ans}.'], ['{n2} ialah 1 kotak dan {n1} ialah {k} kotak.', 'Bersama ada {boxes} kotak sama, dan jumlahnya {tot}.', '{tot} ÷ {boxes} = {ans}.']],
  's.frac_name': [['Count all the equal parts: there are {n}.', 'Count the shaded parts: there are {k}.', 'Shaded over total is {k}/{n}.'], ['Kira semua bahagian sama: ada {n}.', 'Kira bahagian berlorek: ada {k}.', 'Berlorek di atas jumlah ialah {k}/{n}.']],
  's.frac_of': [['Cut {tot} into {n} equal parts. Each part is {tot} ÷ {n} = {part}.', 'We need {k} of those parts.', '{k} × {part} = {ans}.'], ['Bahagi {tot} kepada {n} bahagian sama. Setiap bahagian ialah {tot} ÷ {n} = {part}.', 'Kita perlukan {k} bahagian itu.', '{k} × {part} = {ans}.']],
  's.phon': [['Look at the picture and say the word slowly.', 'The sounds are: {parts}.', 'Tap them in order, starting with “{first}”.'], ['Lihat gambar dan sebut perkataan perlahan-lahan.', 'Bunyinya ialah: {parts}.', 'Sentuh mengikut urutan, bermula dengan “{first}”.']],
  's.spell': [['Look at the picture and say the word: {w}.', 'It has {len} letters and starts with “{f}”.', 'The right spelling is {w}.'], ['Lihat gambar dan sebut perkataan: {w}.', 'Ia ada {len} huruf dan bermula dengan “{f}”.', 'Ejaan yang betul ialah {w}.']],
  's.syll': [['Say the word “{w}” slowly.', 'Clap each beat: {chunks}.', 'That is {n} claps.'], ['Sebut perkataan “{w}” perlahan-lahan.', 'Tepuk setiap rentak: {chunks}.', 'Itu {n} tepukan.']],
  's.ce0': ['Look at the cause pictures first.', 'Lihat gambar sebab dahulu.'],
  's.ce3': ['So the effect is “{a}”. Tap it!', 'Jadi akibatnya ialah “{a}”. Sentuhlah!'],
  'eq.fracname': ['{k} shaded parts out of {n} equal parts = ?', '{k} bahagian berlorek daripada {n} bahagian sama = ?'],

  /* answer styles (UDL) */
  'ex.how': ['How do you want to answer?', 'Bagaimana anda mahu menjawab?'],
  'ex.tap': ['✋ Tap', '✋ Sentuh'], 'ex.draw': ['✏️ Draw', '✏️ Lukis'], 'ex.voice': ['🎤 Speak', '🎤 Cakap'],
  'pad.pen': ['✏️ Pen', '✏️ Pen'], 'pad.eraser': ['🧽 Eraser', '🧽 Pemadam'], 'pad.undo': ['↩ Undo', '↩ Buat asal'], 'pad.clear': ['🗑 Clear', '🗑 Kosongkan'],
  'pad.note': ['Use the scratchpad to work it out, then tap your answer.', 'Guna papan conteng untuk mengira, kemudian sentuh jawapan anda.'],
  'voice.mic': ['Tap the microphone and say your answer out loud.', 'Sentuh mikrofon dan sebut jawapan anda dengan kuat.'],
  'voice.listening': ['Listening…', 'Mendengar…'], 'voice.heard': ['Which one did you say?', 'Yang mana anda sebut?'],
  'voice.again': ['Try again', 'Cuba lagi'],

  /* parent portal */
  'pg.del': ['Delete', 'Padam'],
  'pp.title': ['Parent Portal', 'Portal Ibu Bapa'],
  'pp.sub': ['Set the level, comfort options and screen time, and follow your child’s progress.', 'Tetapkan tahap, pilihan keselesaan dan masa skrin, serta pantau kemajuan anak anda.'],
  'pp.timer': ['Session timer', 'Pemasa sesi'], 'pp.min': ['{n} min', '{n} min'],
  'pp.played': ['Played this session', 'Dimainkan sesi ini'], 'pp.left': ['Time left', 'Masa berbaki'], 'pp.nolimit': ['No limit', 'Tiada had'],
  'pp.add5': ['+5 min', '+5 min'], 'pp.add10': ['+10 min', '+10 min'], 'pp.restart': ['Restart clock', 'Mulakan semula jam'],
  'pp.timerNote': ['When time is up, Hoot shows a friendly wrap-up and asks for a grown-up. A gentle reminder appears 2 minutes before.', 'Apabila masa tamat, Hoot menunjukkan mesej penutup mesra dan memanggil orang dewasa. Peringatan lembut muncul 2 minit sebelum itu.'],
  'pp.showTimer': ['Show remaining time to my child: {s}', 'Tunjuk masa berbaki kepada anak saya: {s}'],
  'pp.lang': ['Language', 'Bahasa'],
  'pp.diff': ['Difficulty', 'Tahap kesukaran'],
  'band.1': ['Ages 5–6', 'Umur 5–6'], 'band.2': ['Ages 7–8', 'Umur 7–8'], 'band.3': ['Ages 9–12', 'Umur 9–12'],
  'band.d1': ['Numbers up to 10 · 3-sound words · blocks first · warm, extra-round look', 'Nombor hingga 10 · perkataan 3 bunyi · blok dahulu · rupa hangat dan bulat'],
  'band.d2': ['Numbers up to 100 · base-ten blocks · fractions · warm look', 'Nombor hingga 100 · blok asas sepuluh · pecahan · rupa hangat'],
  'band.d3': ['Bigger numbers · sharing and ratio bars · syllable tiles · dark mode on Auto', 'Nombor lebih besar · bar pembahagian dan nisbah · jubin suku kata · mod gelap pada Auto'],
  'pp.look': ['Look and feel', 'Rupa dan rasa'], 'th.auto': ['Auto', 'Auto'], 'th.warm': ['Warm', 'Hangat'], 'th.dark': ['Dark', 'Gelap'],
  'pp.sensory': ['Sensory-friendly mode: {s}', 'Mod mesra deria: {s}'],
  'pp.sensoryNote': ['Calming mode for ADHD and autism: stops flashing effects and animations, softens colours, mutes sound effects, hides extra on-screen details and removes response countdowns.', 'Mod menenangkan untuk ADHD dan autisme: menghentikan kesan berkelip dan animasi, melembutkan warna, menyenyapkan bunyi, menyembunyikan butiran tambahan dan membuang kiraan detik.'],
  'pp.read': ['Reading comfort', 'Keselesaan membaca'],
  'pp.dys': ['Dyslexia-friendly font: {s}', 'Fon mesra disleksia: {s}'], 'pp.size': ['Text size', 'Saiz teks'],
  'sz.s': ['Small', 'Kecil'], 'sz.m': ['Default', 'Biasa'], 'sz.l': ['Large', 'Besar'], 'sz.xl': ['Extra large', 'Sangat besar'],
  'pp.sample': ['The little fox jumped over the big blue box. 12 + 8 = 20.', 'Rubah kecil melompat ke atas kotak biru besar. 12 + 8 = 20.'],
  'pp.voice': ['Voice and sound', 'Suara dan bunyi'],
  'pp.auto': ['Read each question aloud automatically: {s}', 'Bacakan setiap soalan secara automatik: {s}'],
  'pp.rate': ['Voice speed', 'Kelajuan suara'],
  'pp.test': ['🔊 Test voice', '🔊 Uji suara'], 'pp.testSay': ['Hello! I am Hoot, your learning buddy.', 'Helo! Saya Hoot, rakan belajar anda.'],
  'pp.voiceNote': ['The 🔊 buttons on questions, lessons and Hoot’s hints always work. Voices come from your device; if a language is missing, install its voice in your device settings.', 'Butang 🔊 pada soalan, pelajaran dan petunjuk sentiasa berfungsi. Suara datang daripada peranti anda; jika bahasa tiada, pasang suaranya dalam tetapan.'],
  'pp.sfx': ['Sound effects: {s}', 'Kesan bunyi: {s}'],
  'pp.autoOn': ['Questions will now be read aloud.', 'Soalan kini akan dibacakan.'],
  'pp.pace': ['Response pacing', 'Kadar menjawab'],
  'pace.p10': ['Fast (10 s)', 'Pantas (10 s)'], 'pace.p15': ['Quick (15 s)', 'Cepat (15 s)'],
  'pace.standard': ['Standard (20 s)', 'Biasa (20 s)'], 'pace.extended': ['Extended (45 s)', 'Dilanjutkan (45 s)'], 'pace.unlimited': ['Unlimited (no countdown)', 'Tanpa had (tiada kiraan detik)'],
  'pp.paceNote': ['The thinking timer is the time limit for each question. When it runs out, the enemy attacks and Hoot offers a little help. Choose Unlimited to remove it completely.', 'Pemasa ialah had masa bagi setiap soalan. Apabila tamat, musuh menyerang dan Hoot menawarkan bantuan. Pilih Tanpa had untuk membuangnya.'],
  'pp.progress': ['Progress', 'Kemajuan'],
  'pp.q': ['Questions solved', 'Soalan diselesaikan'], 'pp.fr': ['Solved on first try', 'Selesai percubaan pertama'], 'pp.starsT': ['Stars earned', 'Bintang diperoleh'], 'pp.lessons': ['Lessons finished', 'Pelajaran selesai'], 'pp.coins': ['Coins earned', 'Syiling diperoleh'],
  'pp.diag': ['Diagnostic mastery dashboard', 'Papan pemuka penguasaan diagnostik'],
  'pp.bench': ['Benchmark {n}%', 'Penanda aras {n}%'],
  'dm.above': ['Above benchmark', 'Melebihi penanda aras'], 'dm.on': ['On track', 'Di landasan betul'], 'dm.below': ['Needs practice', 'Perlu latihan'], 'dm.collect': ['Collecting data', 'Mengumpul data'],
  'pp.diagNote': ['Mastery is the share of the last 8 tries in each skill solved without a hint. Benchmarks are the app’s own foundational targets for the chosen age band, not an official test.', 'Penguasaan ialah bahagian 8 percubaan terakhir bagi setiap kemahiran yang diselesaikan tanpa petunjuk. Penanda aras ialah sasaran asas aplikasi ini untuk peringkat umur, bukan ujian rasmi.'],
  'pp.demo': ['Preview with sample data: {s}', 'Pratonton dengan data contoh: {s}'],
  'pp.focus': ['Suggested focus: {t}', 'Fokus dicadangkan: {t}'],
  'pp.heat': ['Skill mastery heatmap', 'Peta haba penguasaan kemahiran'],
  'lg.needs': ['Needs practice (under 50%)', 'Perlu latihan (bawah 50%)'], 'lg.growing': ['Growing (50–79%)', 'Berkembang (50–79%)'], 'lg.strong': ['Strong (80%+)', 'Kukuh (80%+)'],
  'hm.none': ['Not tried yet', 'Belum dicuba'], 'hm.avg': ['{n}% average', 'Purata {n}%'], 'hm.nodata': ['No data yet', 'Belum ada data'], 'hm.tries': ['{n} tries', '{n} percubaan'], 'hm.aria': ['{name}: {p} percent, {lvl}', '{name}: {p} peratus, {lvl}'], 'hm.ariaNone': ['{name}: not tried yet', '{name}: belum dicuba'],
  'tp.math_pw': ['Part-Whole', 'Bahagian-keseluruhan'], 'tp.math_cmp': ['Comparison', 'Perbandingan'], 'tp.math_units': ['Equal units', 'Unit sama'], 'tp.math_frac': ['Fractions', 'Pecahan'],
  'tp.lit_phonics': ['Phonics blending', 'Gabungan fonik'], 'tp.lit_syll': ['Syllables', 'Suku kata'], 'tp.lit_spell': ['Spelling', 'Ejaan'],
  'tp.stem_matter': ['Matter & heat', 'Jirim dan haba'], 'tp.stem_forces': ['Forces & magnets', 'Daya dan magnet'], 'tp.stem_living': ['Plants & living things', 'Tumbuhan dan benda hidup'], 'tp.stem_react': ['Reactions & light', 'Tindak balas dan cahaya'],
  'pp.adv0': ['Play a few more battles and we’ll show how well the level fits.', 'Main beberapa pertempuran lagi dan kami akan tunjukkan kesesuaian tahap.'],
  'pp.advUp': ['Recent first-try rate is {r}%. {b} could add some challenge.', 'Kadar percubaan pertama terkini ialah {r}%. {b} boleh menambah cabaran.'],
  'pp.advDown': ['Recent first-try rate is {r}%. {b} may feel friendlier for now.', 'Kadar percubaan pertama terkini ialah {r}%. {b} mungkin lebih mesra buat masa ini.'],
  'pp.advOk': ['Recent first-try rate is {r}%. The current level looks well matched.', 'Kadar percubaan pertama terkini ialah {r}%. Tahap semasa kelihatan sesuai.'],
  'pp.activity': ['Recent activity', 'Aktiviti terkini'], 'pp.noact': ['No activity yet.', 'Belum ada aktiviti.'],
  'lg.cleared': ['Cleared {id} {name} with {n} star(s)', 'Tamat {id} {name} dengan {n} bintang'],
  'lg.learned': ['Learned: {name}', 'Dipelajari: {name}'], 'lg.bought': ['Bought: {name}', 'Dibeli: {name}'],
  'pp.priv': ['Privacy and offline data', 'Privasi dan data luar talian'],
  'pp.privTxt': ['Everything stays on this device. No accounts, no analytics, no ads and no network requests. Progress, coins, gear and star ratings save automatically in this browser’s local storage and work offline.', 'Semuanya kekal pada peranti ini. Tiada akaun, analitik, iklan atau permintaan rangkaian. Kemajuan, syiling, peralatan dan bintang disimpan secara automatik dalam storan setempat dan berfungsi tanpa talian.'],
  'pp.saved': ['✔ Saved on this device at {t}', '✔ Disimpan pada peranti ini pada {t}'],
  'pp.nosave': ['Saving is unavailable in this browser (private window?). Progress will be lost when the app closes.', 'Penyimpanan tidak tersedia dalam pelayar ini (tetingkap peribadi?). Kemajuan akan hilang apabila aplikasi ditutup.'],
  'pp.export': ['⬇ Export backup', '⬇ Eksport sandaran'], 'pp.import': ['⬆ Import backup', '⬆ Import sandaran'],
  'pp.erase': ['Erase all progress', 'Padam semua kemajuan'], 'pp.erase2': ['Tap again to erase everything', 'Sentuh sekali lagi untuk memadam semuanya'],
  'pp.imported': ['Backup restored.', 'Sandaran dipulihkan.'], 'pp.badfile': ['That file is not a Quest Academy backup.', 'Fail itu bukan sandaran Quest Academy.'],
  'pp.lock': ['🔒 Lock portal', '🔒 Kunci portal'],
  'tu.title': ['Time for a break!', 'Masa untuk berehat!'],
  'tu.g1': ['Wow, you worked so hard today!', 'Wah, anda berusaha gigih hari ini!'], 'tu.g2': ['Great adventuring today!', 'Kembara yang hebat hari ini!'], 'tu.g3': ['Excellent work today, adventurer!', 'Kerja cemerlang hari ini, pengembara!'],
  'tu.body': ['You solved {n} challenges and earned {c} coins. Your brain and your eyes need a rest now. Stretch, drink some water, and tell a grown-up one thing you learned. See you next time!', 'Anda menyelesaikan {n} cabaran dan mendapat {c} syiling. Otak dan mata anda perlu berehat. Regangkan badan, minum air dan ceritakan kepada orang dewasa satu perkara yang anda pelajari. Jumpa lagi!'],
  'tu.hear': ['🔊 Hear Hoot', '🔊 Dengar Hoot'], 'tu.ask': ['Ask a grown-up', 'Minta orang dewasa'],
  'tt.two': ['Hoot says: 2 minutes left. Let’s finish this battle!', 'Hoot berkata: tinggal 2 minit. Mari tamatkan pertempuran ini!'],
  'tt.added': ['Added {n} minutes of play time.', '{n} minit masa bermain ditambah.'], 'tt.restart': ['Session clock restarted.', 'Jam sesi dimulakan semula.'],
  'tt.novoice': ['Voice is not available on this device.', 'Suara tidak tersedia pada peranti ini.'],
  'skill.phon': ['Phonics blending', 'Gabungan fonik'], 'skill.spell': ['Spelling', 'Ejaan'], 'skill.syll': ['Syllables', 'Suku kata'],
  'skill.pw': ['Part-whole models', 'Model bahagian-keseluruhan'], 'skill.cmp': ['Comparison models', 'Model perbandingan'], 'skill.units': ['Equal units', 'Unit sama'], 'skill.frac': ['Fractions', 'Pecahan'],
  'skill.matter': ['Matter & heat', 'Jirim dan haba'], 'skill.forces': ['Forces & magnets', 'Daya dan magnet'], 'skill.living': ['Plants & living things', 'Tumbuhan dan benda hidup'], 'skill.react': ['Reactions & light', 'Tindak balas dan cahaya'],
  'rx.pick': ['Pick a cause to see its effect.', 'Pilih sebab untuk melihat akibatnya.'], 'rx.cause': ['Cause: {c}. Effect: {e}', 'Sebab: {c}. Akibat: {e}'], 'rx.effect': ['Effect:', 'Akibat:'],
  'bl.pick': ['Tap each sound tile, then blend them.', 'Sentuh setiap jubin bunyi, kemudian gabungkan.'], 'bl.go': ['Blend it! 🔊', 'Gabungkan! 🔊'], 'bl.next': ['Next word', 'Perkataan seterusnya']
};
