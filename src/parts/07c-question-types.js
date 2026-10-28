/* ================= v22: question types beyond tapping =================
   ORDER  drag (or tap) tiles into the right order: days, months, numbers, letters, syllables of a word,
          life cycles, daily routines, the rainbow, do-re-mi.
   MATCH  join each word to its picture (tap one, then its partner).
   ODD    tap the one that does not belong (three from one group, one from another).
   TF     true or false blast: one short statement, two big buttons. Quick, and the most common type at age 4.
   Every item is [emoji, English, Malay]. In the Bahasa Melayu and English subjects the words on the tiles are
   in that subject's language; everywhere else they follow the game language. */
const QT = (() => {
  const F = { fruit: ['fruit', 'buah'], animal: ['animal', 'haiwan'], vehicle: ['vehicle', 'kenderaan'], school: ['school thing', 'barang sekolah'], clothes: ['piece of clothing', 'pakaian'], sky: ['thing in the sky', 'benda di langit'], instrument: ['musical instrument', 'alat muzik'], shape: ['shape', 'bentuk'], healthy: ['healthy food', 'makanan sihat'], treat: ['sweet treat', 'makanan manis'], living: ['living thing', 'benda hidup'], nonliving: ['non-living thing', 'benda bukan hidup'], water: ['animal that lives in water', 'haiwan yang hidup dalam air'], body: ['part of the body', 'anggota badan'], happy: ['happy face', 'wajah gembira'], sad: ['sad face', 'wajah sedih'], kind: ['kind action', 'perbuatan baik'], unkind: ['unkind action', 'perbuatan tidak baik'], my: ['symbol of Malaysia', 'lambang Malaysia'], abroad: ['thing from another country', 'benda dari negara lain'], warm: ['warm colour', 'warna panas'], cool: ['cool colour', 'warna sejuk'] };
  /* v26: plural group names, so an odd-one-out question can say what the three have in common */
  const FP = { fruit: 'fruits', animal: 'animals', vehicle: 'vehicles', school: 'school things', clothes: 'clothes', sky: 'things in the sky', instrument: 'musical instruments', shape: 'shapes', healthy: 'healthy foods', treat: 'sweet treats', living: 'living things', nonliving: 'non-living things', water: 'animals that live in water', body: 'parts of the body', happy: 'happy faces', sad: 'sad faces', kind: 'kind actions', unkind: 'unkind actions', my: 'symbols of Malaysia', abroad: 'things from other countries', warm: 'warm colours', cool: 'cool colours' };
  const aAn = w => (/^[aeiou]/.test(w) ? 'an ' : 'a ') + w;
  const G = {
    fruit: [['🍎', 'apple', 'epal'], ['🍌', 'banana', 'pisang'], ['🍇', 'grapes', 'anggur'], ['🍉', 'watermelon', 'tembikai'], ['🥭', 'mango', 'mangga'], ['🍍', 'pineapple', 'nanas'], ['🍓', 'strawberry', 'strawberi']],
    animal: [['🐱', 'cat', 'kucing'], ['🐶', 'dog', 'anjing'], ['🐘', 'elephant', 'gajah'], ['🐔', 'hen', 'ayam'], ['🐄', 'cow', 'lembu'], ['🐒', 'monkey', 'monyet'], ['🐯', 'tiger', 'harimau'], ['🐰', 'rabbit', 'arnab']],
    vehicle: [['🚗', 'car', 'kereta'], ['🚌', 'bus', 'bas'], ['🚲', 'bicycle', 'basikal'], ['✈️', 'aeroplane', 'kapal terbang'], ['🚂', 'train', 'kereta api'], ['🚢', 'ship', 'kapal']],
    school: [['📖', 'book', 'buku'], ['✏️', 'pencil', 'pensel'], ['🎒', 'school bag', 'beg sekolah'], ['📏', 'ruler', 'pembaris'], ['✂️', 'scissors', 'gunting']],
    clothes: [['👕', 'shirt', 'baju'], ['👟', 'shoe', 'kasut'], ['🧢', 'cap', 'topi'], ['🧦', 'socks', 'stoking'], ['👗', 'dress', 'gaun']],
    sky: [['☀️', 'sun', 'matahari'], ['🌙', 'moon', 'bulan'], ['⭐', 'star', 'bintang'], ['☁️', 'cloud', 'awan'], ['🌈', 'rainbow', 'pelangi']],
    instrument: [['🥁', 'drum', 'gendang'], ['🎹', 'piano', 'piano'], ['🎸', 'guitar', 'gitar'], ['🎺', 'trumpet', 'trompet'], ['🎻', 'violin', 'biola'], ['🪇', 'maracas', 'marakas']],
    shape: [['🔵', 'circle', 'bulatan'], ['🟦', 'square', 'segi empat sama'], ['🔺', 'triangle', 'segi tiga'], ['⭐', 'star', 'bintang'], ['💜', 'heart', 'hati']],
    healthy: [['🥦', 'broccoli', 'brokoli'], ['🥕', 'carrot', 'lobak merah'], ['🍎', 'apple', 'epal'], ['🥛', 'milk', 'susu'], ['🐟', 'fish', 'ikan'], ['🍚', 'rice', 'nasi']],
    treat: [['🍭', 'lollipop', 'lolipop'], ['🍩', 'doughnut', 'donat'], ['🍬', 'sweet', 'gula-gula'], ['🥤', 'fizzy drink', 'minuman bergas'], ['🍰', 'cake', 'kek']],
    living: [['🌳', 'tree', 'pokok'], ['🐦', 'bird', 'burung'], ['🌻', 'flower', 'bunga'], ['🐟', 'fish', 'ikan'], ['🐛', 'caterpillar', 'ulat']],
    nonliving: [['🪨', 'stone', 'batu'], ['🚗', 'car', 'kereta'], ['⚽', 'ball', 'bola'], ['🪑', 'chair', 'kerusi'], ['📱', 'phone', 'telefon']],
    water: [['🐟', 'fish', 'ikan'], ['🐙', 'octopus', 'sotong kurita'], ['🐬', 'dolphin', 'ikan lumba-lumba'], ['🦀', 'crab', 'ketam'], ['🐳', 'whale', 'ikan paus']],
    body: [['👁️', 'eye', 'mata'], ['👂', 'ear', 'telinga'], ['👃', 'nose', 'hidung'], ['✋', 'hand', 'tangan'], ['🦶', 'foot', 'kaki'], ['👄', 'mouth', 'mulut']],
    happy: [['😀', 'happy', 'gembira'], ['😄', 'very happy', 'sangat gembira'], ['😊', 'smiling', 'tersenyum'], ['🥳', 'excited', 'teruja']],
    sad: [['😢', 'sad', 'sedih'], ['😭', 'crying', 'menangis'], ['😞', 'upset', 'kecewa'], ['😟', 'worried', 'risau']],
    kind: [['🤝', 'helping a friend', 'membantu kawan'], ['🙏', 'saying thank you', 'berterima kasih'], ['🧹', 'tidying up', 'mengemas'], ['🎁', 'sharing', 'berkongsi'], ['🫂', 'comforting', 'memujuk']],
    unkind: [['😝', 'teasing', 'mengejek'], ['🗑️', 'littering', 'membuang sampah merata'], ['👊', 'hitting', 'memukul'], ['🙉', 'not listening', 'tidak mendengar kata']],
    my: [['🇲🇾', 'Jalur Gemilang', 'Jalur Gemilang'], ['🌺', 'bunga raya', 'bunga raya'], ['🐯', 'Harimau Malaya', 'Harimau Malaya'], ['🏙️', 'Petronas Twin Towers', 'Menara Berkembar Petronas'], ['🪁', 'wau', 'wau']],
    abroad: [['🗽', 'Statue of Liberty', 'Patung Liberty'], ['🗼', 'Eiffel Tower', 'Menara Eiffel'], ['🐨', 'koala', 'koala'], ['🍁', 'maple leaf', 'daun mapel']],
    warm: [['🟥', 'red', 'merah'], ['🟧', 'orange', 'oren'], ['🟨', 'yellow', 'kuning']],
    cool: [['🟦', 'blue', 'biru'], ['🟩', 'green', 'hijau'], ['🟪', 'purple', 'ungu']]
  };
  /* odd one out: [group, other groups] per subject */
  const ODD = {
    math: [['shape', ['fruit', 'animal']]], bm: [['fruit', ['vehicle', 'animal']], ['animal', ['school', 'fruit']], ['vehicle', ['fruit', 'clothes']], ['clothes', ['animal', 'sky']]],
    en: [['fruit', ['vehicle', 'clothes']], ['animal', ['school', 'sky']], ['vehicle', ['animal', 'fruit']], ['sky', ['clothes', 'school']]], sc: [['living', ['nonliving']], ['nonliving', ['living']], ['water', ['animal']], ['animal', ['vehicle']]],
    pm: [['kind', ['unkind']]], pk: [['my', ['abroad']]], se: [['happy', ['sad']], ['sad', ['happy']]], fk: [['healthy', ['treat']], ['body', ['fruit', 'vehicle']]],
    sv: [['warm', ['cool']], ['cool', ['warm']], ['shape', ['fruit']]], mz: [['instrument', ['animal', 'fruit', 'vehicle']]]
  };
  /* match pairs: lists of [left, right] where an item is [emoji, EN, BM]; the side marked e shows the emoji */
  const MATCH = {
    sc: [['🐸', 'tadpole', 'berudu'], ['🦋', 'caterpillar', 'ulat beluncas'], ['🐔', 'chick', 'anak ayam'], ['🐶', 'puppy', 'anak anjing'], ['🐱', 'kitten', 'anak kucing']],
    senses: [['👁️', 'see', 'melihat'], ['👂', 'hear', 'mendengar'], ['👃', 'smell', 'menghidu'], ['👅', 'taste', 'merasa'], ['✋', 'touch', 'menyentuh']],
    pm: [['🎁', 'Thank you', 'Terima kasih'], ['😣', 'Sorry', 'Maaf'], ['🙋', 'Please', 'Tolong'], ['👋', 'Good morning', 'Selamat pagi'], ['🌙', 'Good night', 'Selamat malam']],
    se: [['😀', 'happy', 'gembira'], ['😢', 'sad', 'sedih'], ['😠', 'angry', 'marah'], ['😨', 'scared', 'takut'], ['😴', 'sleepy', 'mengantuk']],
    sv: [['🟥', 'red', 'merah'], ['🟦', 'blue', 'biru'], ['🟨', 'yellow', 'kuning'], ['🟩', 'green', 'hijau'], ['🟪', 'purple', 'ungu'], ['🟧', 'orange', 'oren']]
  };
  /* sequences: [EN title, BM title, items] */
  const SEQ = {
    sc: [['The life of a butterfly', 'Kitaran hidup rama-rama', [['🥚', 'egg', 'telur'], ['🐛', 'caterpillar', 'ulat beluncas'], ['🫘', 'pupa', 'pupa'], ['🦋', 'butterfly', 'rama-rama']]],
      ['The life of a chicken', 'Kitaran hidup ayam', [['🥚', 'egg', 'telur'], ['🐣', 'hatching', 'menetas'], ['🐥', 'chick', 'anak ayam'], ['🐔', 'hen', 'ayam']]],
      ['A seed grows', 'Biji benih bercambah', [['🌰', 'seed', 'biji benih'], ['🌱', 'sprout', 'anak pokok'], ['🪴', 'young plant', 'pokok muda'], ['🌻', 'flower', 'bunga']]],
      ['Planting a seed', 'Menanam biji benih', [['⛏️', 'dig a hole', 'gali lubang'], ['🌰', 'put the seed in', 'masukkan biji benih'], ['🟫', 'cover with soil', 'tutup dengan tanah'], ['💧', 'water it', 'siram']]]],
    pm: [['Getting ready for school', 'Bersiap ke sekolah', [['⏰', 'wake up', 'bangun tidur'], ['🪥', 'brush your teeth', 'gosok gigi'], ['🍳', 'eat breakfast', 'sarapan'], ['🎒', 'go to school', 'pergi ke sekolah']]],
      ['Saying sorry', 'Meminta maaf', [['🛑', 'stop', 'berhenti'], ['👀', 'look at the person', 'pandang orang itu'], ['🗣️', 'say sorry', 'minta maaf'], ['🤝', 'make it right', 'perbaiki keadaan']]]],
    fk: [['Washing your hands', 'Mencuci tangan', [['💧', 'wet your hands', 'basahkan tangan'], ['🧼', 'add soap', 'sapu sabun'], ['🙌', 'scrub', 'gosok tangan'], ['🚿', 'rinse', 'bilas'], ['🧻', 'dry', 'keringkan']]],
      ['Crossing the road', 'Melintas jalan', [['🛑', 'stop at the kerb', 'berhenti di tepi jalan'], ['👀', 'look right and left', 'lihat kanan dan kiri'], ['👂', 'listen', 'dengar'], ['🚶', 'walk across', 'lintas']]]],
    se: [['Calming down', 'Menenangkan diri', [['🛑', 'stop', 'berhenti'], ['🌬️', 'take a deep breath', 'tarik nafas dalam-dalam'], ['🔢', 'count to five', 'kira hingga lima'], ['🗣️', 'talk about it', 'bercakap tentangnya']]]],
    pk: [['Rukun Negara', 'Rukun Negara', [['1️⃣', 'Belief in God', 'Kepercayaan kepada Tuhan'], ['2️⃣', 'Loyalty to King and Country', 'Kesetiaan kepada Raja dan Negara'], ['3️⃣', 'Supremacy of the Constitution', 'Keluhuran Perlembagaan'], ['4️⃣', 'Rule of Law', 'Kedaulatan Undang-undang'], ['5️⃣', 'Courtesy and Morality', 'Kesopanan dan Kesusilaan']]]],
    sv: [['The rainbow', 'Pelangi', [['🔴', 'red', 'merah'], ['🟠', 'orange', 'oren'], ['🟡', 'yellow', 'kuning'], ['🟢', 'green', 'hijau'], ['🔵', 'blue', 'biru'], ['🟣', 'purple', 'ungu']]]],
    mz: [['Do-re-mi', 'Do-re-mi', ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Ti'].map(n => ['🎵', n, n])]],
    size: [['Smallest to biggest', 'Paling kecil ke paling besar', [['🐜', 'ant', 'semut'], ['🐭', 'mouse', 'tikus'], ['🐱', 'cat', 'kucing'], ['🐄', 'cow', 'lembu'], ['🐘', 'elephant', 'gajah']]]]
  };
  const DAYS = [['Monday', 'Isnin'], ['Tuesday', 'Selasa'], ['Wednesday', 'Rabu'], ['Thursday', 'Khamis'], ['Friday', 'Jumaat'], ['Saturday', 'Sabtu'], ['Sunday', 'Ahad']];
  const MONTHS = [['January', 'Januari'], ['February', 'Februari'], ['March', 'Mac'], ['April', 'April'], ['May', 'Mei'], ['June', 'Jun'], ['July', 'Julai'], ['August', 'Ogos'], ['September', 'September'], ['October', 'Oktober'], ['November', 'November'], ['December', 'Disember']];
  const SYL_BM = [['kucing', '🐱', ['ku', 'cing']], ['kereta', '🚗', ['ke', 're', 'ta']], ['sekolah', '🏫', ['se', 'ko', 'lah']], ['buku', '📖', ['bu', 'ku']], ['pelangi', '🌈', ['pe', 'la', 'ngi']], ['kelapa', '🥥', ['ke', 'la', 'pa']], ['rumah', '🏠', ['ru', 'mah']], ['bola', '⚽', ['bo', 'la']], ['gajah', '🐘', ['ga', 'jah']], ['pisang', '🍌', ['pi', 'sang']], ['kasut', '👟', ['ka', 'sut']], ['harimau', '🐯', ['ha', 'ri', 'mau']], ['basikal', '🚲', ['ba', 'si', 'kal']], ['tembikai', '🍉', ['tem', 'bi', 'kai']], ['matahari', '☀️', ['ma', 'ta', 'ha', 'ri']]];
  /* true or false: [emoji, EN statement, BM statement, true?] */
  const TF = {
    math: [['🔺', 'A triangle has 3 sides.', 'Segi tiga ada 3 sisi.', 1], ['🟦', 'A square has 5 sides.', 'Segi empat sama ada 5 sisi.', 0], ['🔟', '10 comes after 9.', '10 datang selepas 9.', 1], ['🕐', 'One hour has 60 minutes.', 'Satu jam ada 60 minit.', 1], ['📅', 'A week has 5 days.', 'Seminggu ada 5 hari.', 0]],
    sc: [['🐟', 'Fish live in water.', 'Ikan hidup di dalam air.', 1], ['☀️', 'The sun is cold.', 'Matahari itu sejuk.', 0], ['🌱', 'Plants need water to grow.', 'Tumbuhan perlukan air untuk membesar.', 1], ['🐱', 'A cat lays eggs.', 'Kucing bertelur.', 0], ['🧊', 'Ice is hot.', 'Ais itu panas.', 0], ['👂', 'We hear with our ears.', 'Kita mendengar dengan telinga.', 1], ['🧲', 'A magnet pulls iron.', 'Magnet menarik besi.', 1], ['🪨', 'A stone floats on water.', 'Batu terapung di atas air.', 0]],
    pm: [['🙏', 'Saying thank you is polite.', 'Berterima kasih itu sopan.', 1], ['🚶', 'It is fine to push in a line.', 'Tidak apa-apa menolak orang semasa beratur.', 0], ['🧸', 'We can share our toys.', 'Kita boleh berkongsi mainan.', 1], ['💬', 'We should tell the truth.', 'Kita patut bercakap benar.', 1], ['🎒', 'Taking a friend’s things without asking is fine.', 'Mengambil barang kawan tanpa izin tidak apa-apa.', 0]],
    pk: [['🇲🇾', 'Malaysia’s flag is the Jalur Gemilang.', 'Bendera Malaysia ialah Jalur Gemilang.', 1], ['🌹', 'Our national flower is the rose.', 'Bunga kebangsaan kita ialah bunga mawar.', 0], ['🏙️', 'Kuala Lumpur is the capital city of Malaysia.', 'Kuala Lumpur ialah ibu negara Malaysia.', 1], ['🎵', 'We sit and chat when Negaraku is played.', 'Kita duduk dan berbual semasa lagu Negaraku dimainkan.', 0]],
    se: [['😢', 'It is okay to feel sad sometimes.', 'Tidak mengapa berasa sedih sekali-sekala.', 1], ['🌬️', 'When we are angry, we can take a deep breath.', 'Apabila marah, kita boleh tarik nafas dalam-dalam.', 1], ['😝', 'Laughing at a crying friend is kind.', 'Mentertawakan kawan yang menangis itu baik.', 0], ['🙇', 'We can say sorry when we make a mistake.', 'Kita boleh minta maaf apabila melakukan kesilapan.', 1]],
    fk: [['🥦', 'Vegetables help us grow strong.', 'Sayur membantu kita membesar dengan kuat.', 1], ['🪥', 'We brush our teeth only once a week.', 'Kita gosok gigi seminggu sekali sahaja.', 0], ['🧼', 'We wash our hands before we eat.', 'Kita mencuci tangan sebelum makan.', 1], ['🍭', 'Sweets are the best breakfast.', 'Gula-gula ialah sarapan terbaik.', 0], ['🏃', 'Exercise makes our body strong.', 'Senaman menguatkan badan kita.', 1]],
    sv: [['🟧', 'Red and yellow make orange.', 'Merah dan kuning menjadi oren.', 1], ['🟪', 'Blue and yellow make purple.', 'Biru dan kuning menjadi ungu.', 0], ['⚪', 'A circle has corners.', 'Bulatan ada bucu.', 0], ['👘', 'Batik is a Malaysian craft.', 'Batik ialah kraf Malaysia.', 1]],
    mz: [['🥁', 'We play a drum by hitting it.', 'Kita memainkan gendang dengan memukulnya.', 1], ['🦁', 'A lion’s roar is a soft sound.', 'Ngauman singa ialah bunyi yang lembut.', 0], ['🤫', 'A whisper is quiet.', 'Bisikan itu perlahan.', 1], ['🎸', 'We blow into a guitar to play it.', 'Kita meniup gitar untuk memainkannya.', 0]]
  };
  const COLOURS = [['🍌', 'yellow', 'kuning'], ['🍓', 'red', 'merah'], ['🥦', 'green', 'hijau'], ['🍆', 'purple', 'ungu'], ['🍊', 'orange', 'oren'], ['☁️', 'white', 'putih'], ['🍫', 'brown', 'coklat'], ['🌊', 'blue', 'biru']];
  const NAMED = [...G.fruit, ...G.animal, ...G.vehicle, ...G.school, ...G.clothes, ...G.sky];
  const wl = subj => subj === 'bm' ? 2 : subj === 'en' ? 1 : 1 + L();   // which word column a tile shows
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const base = (subj, type, extra) => ({ kind: type, type, topic: subj + '_' + type, tag: t('tag.' + type), memSubj: subj, cls: '', customSteps: true, noTap: type === 'order' || type === 'match', ansText: '', steps: () => [t('qs.' + type + '1'), t('qs.' + type + '2'), t('qs.' + type + '3')], ...extra });

  function tfQ(subj, band) {
    const li = L(), r = Math.random(), pool = [];
    (TF[subj] || []).forEach(x => pool.push(() => ({ e: x[0], s: x[1 + li], ok: !!x[3] })));
    /* naming: "🐱 is called 'kucing'" (in the subject's language for BM and English) */
    if (['bm', 'en'].includes(subj)) for (let k = 0; k < 4; k++)   /* v23: naming stays in the language subjects */ pool.push(() => { const it = pick(NAMED), ok = Math.random() < .5, w = ok ? it : pick(NAMED.filter(x => x !== it)); return { e: it[0], s: t('tf.called', { w: w[wl(subj)] }), ok }; });
    if (subj === 'sv') for (let k = 0; k < 2; k++)   /* v23: colours stay in Art */ pool.push(() => { const c = pick(COLOURS), ok = Math.random() < .5, w = ok ? c : pick(COLOURS.filter(x => x !== c)); return { e: c[0], s: t('tf.colour', { c: w[1 + li] }), ok }; });
    if (subj === 'math') for (let k = 0; k < 4; k++) pool.push(() => {
      const hi = [5, 10, 50, 500][band - 1] || 10, a = rnd(1, hi), b = rnd(1, hi), sum = Math.random() < .5, ok = Math.random() < .5;
      if (band === 1 && Math.random() < .5) { const n = rnd(2, 6), m = ok ? n : n + pick([-1, 1]), e = pick(['🍎', '⭐', '🐟', '🎈']); return { e: e.repeat(n), s: t('tf.count', { n: m, e }), ok }; }
      if (!sum) { const big = Math.max(a, b === a ? a + 1 : b), small = Math.min(a, b === a ? a + 1 : b); return ok ? { e: '⚖️', s: t('tf.bigger', { a: big, b: small }), ok: true } : { e: '⚖️', s: t('tf.bigger', { a: small, b: big }), ok: false }; }
      const v = a + b + (ok ? 0 : pick([-2, -1, 1, 2])); return { e: '➕', s: `${a} + ${b} = ${Math.max(0, v)}`, ok: Math.max(0, v) === a + b };
    });
    if (subj === 'en' || subj === 'bm') pool.push(() => { const i = rnd(0, 23), ok = Math.random() < .5, A = String.fromCharCode(65 + i), Bc = String.fromCharCode(66 + i); return { e: '🔤', s: ok ? t('tf.after', { a: Bc, b: A }) : t('tf.after', { a: A, b: Bc }), ok }; });
    if (!pool.length) return null;
    const it = pick(pool)();
    const options = [t('tf.true'), t('tf.false')], correct = it.ok ? 0 : 1;
    return base(subj, 'tf', { text: it.s, options, correct, cls: 'tf', key: 'tf:' + it.s, memKey: 'tf:' + it.s, ansText: options[correct], speak: [[`${t('tf.ask')} ${it.s}`]], viz: () => `<div class="clue big tfclue" aria-hidden="true">${it.e}</div>` });
  }
  function oddQ(subj, band) {
    const sets = ODD[subj]; if (!sets) return null;
    const [g, others] = pick(sets), og = pick(others), li = wl(subj);
    if (subj === 'math' && band >= 2) {   // numbers: three even and one odd (or the other way)
      const even = Math.random() < .5, hi = band === 2 ? 20 : 100, mk2 = par => { let n; do { n = rnd(1, hi); } while (n % 2 !== par); return n; };
      const nums = new Set(); while (nums.size < 3) nums.add(mk2(even ? 0 : 1)); const odd = mk2(even ? 1 : 0), options = shuffle([...nums, odd].map(String));
      const text = t(even ? 'qt.oddEven' : 'qt.oddOdd');
      return base(subj, 'odd', { text, options, correct: options.indexOf(String(odd)), cls: 'odd', key: 'odd:' + options.join(','), memKey: 'odd:' + options.join(','), ansText: String(odd), why: t(even ? 'qt.notEven' : 'qt.notOdd', { x: odd }), speak: [[`${text} ${options.join(', ')}.`]], viz: () => `<div class="clue big" aria-hidden="true">🔢</div>` });
    }
    const three = shuffle(G[g]).slice(0, 3), x = pick(G[og].filter(i => !three.some(y => y[0] === i[0]))), all = shuffle([...three, x]);
    const label = it => `${it[0]} ${cap(it[li])}`, options = all.map(label);
    const text = t('qt.oddCtx', { gp: L() ? F[g][1] : FP[g], g1: L() ? F[g][1] : aAn(F[g][0]) });   // v26: "Three of these are fruits. Which one is NOT a fruit?"
    return base(subj, 'odd', { text, options, correct: options.indexOf(label(x)), cls: 'odd', key: 'odd:' + options.join(','), memKey: 'odd:' + three.map(i => i[0]).sort().join('') + x[0], ansText: label(x), why: t('qt.oddWhy', { x: cap(x[li]), g: L() ? F[g][1] : (/^[aeiou]/.test(F[g][0]) ? 'an ' : 'a ') + F[g][0] }), speak: [[`${text} ${all.map(i => i[li]).join(', ')}.`]], viz: () => `<div class="clue big" aria-hidden="true">🤔</div>` });
  }
  function matchQ(subj, band, small) {
    const n = small || band <= 2 ? 3 : 4, li = wl(subj);   // v35: bosses get the short form
    let pairs, text = t('qt.match');
    if (subj === 'math') {
      if (band === 1) pairs = shuffle([1, 2, 3, 4, 5, 6]).slice(0, n).map(k => [String(k), '●'.repeat(k)]);
      else if (band === 2) pairs = (() => { const out = [], seen = new Set(); while (out.length < n) { const a = rnd(1, 9), b = rnd(1, 9); if (seen.has(a + b)) continue; seen.add(a + b); out.push([`${a} + ${b}`, String(a + b)]); } return out; })();
      else pairs = (() => { const out = [], seen = new Set(); while (out.length < n) { const a = rnd(2, 9), b = rnd(2, band === 3 ? 5 : 9); if (seen.has(a * b)) continue; seen.add(a * b); out.push([`${a} × ${b}`, String(a * b)]); } return out; })();
      text = t('qt.matchSum');
    } else {
      const src = subj === 'sc' ? (Math.random() < .5 ? MATCH.sc : MATCH.senses) : subj === 'fk' ? MATCH.senses : MATCH[subj] || (subj === 'mz' ? G.instrument : subj === 'pk' ? G.my : shuffle([...G.fruit, ...G.animal, ...G.vehicle, ...G.school]));
      pairs = shuffle(src).slice(0, n).map(it => [cap(it[li]), it[0]]);
      if (subj === 'sc' && src === MATCH.sc) text = t('qt.matchBaby'); else if (src === MATCH.senses) text = t('qt.matchSense'); else if (subj === 'pm') text = t('qt.matchPolite'); else if (subj === 'se') text = t('qt.matchFeel');
    }
    return base(subj, 'match', { text, pairs, right: shuffle(pairs.map((p, i) => i)), done: new Set(), options: pairs.map(p => p[0]), correct: -1, key: 'match:' + pairs.map(p => p[0]).join('|'), memKey: 'match:' + pairs.map(p => p[0]).sort().join('|'), ansText: pairs.map(p => `${p[0]} – ${p[1]}`).join(', '), speak: [[`${text} ${pairs.map(p => p[0]).join(', ')}.`]], viz: () => `<div class="clue big" aria-hidden="true">🔗</div>` });
  }
  function orderQ(subj, band, small) {
    const li = L(), wli = wl(subj), n = small ? 3 : band === 1 ? 3 : band === 2 ? 4 : 5, kinds = [];   // v35: bosses get 3 tiles
    if (subj === 'math') { kinds.push('numUp', 'numUp', 'numDown'); if (band === 1) kinds.push('size'); }
    if (subj === 'bm') { kinds.push('syl', 'syl', 'days'); if (band <= 2) kinds.push('abc'); if (band >= 3) kinds.push('months'); }
    if (subj === 'en') { kinds.push('syl', 'days'); if (band <= 2) kinds.push('abc', 'abc'); if (band >= 3) kinds.push('months'); }
    if (SEQ[subj] && !(subj === 'pk' && band < 3)) kinds.push('seq', 'seq');   // the Rukun Negara is for ages 6 and 7
    if (subj === 'mz') kinds.push('seq');
    if (!kinds.length) return null;
    const kind = pick(kinds); let items, text, emo = '🔢';
    const run = (list, k) => { const s = rnd(0, list.length - k); return list.slice(s, s + k); };
    if (kind === 'numUp' || kind === 'numDown') {
      const hi = [10, 50, 1000, 10000][band - 1] || 50, set = new Set(); while (set.size < n) set.add(rnd(band >= 3 ? 10 : 1, hi));
      items = [...set].sort((a, b) => kind === 'numUp' ? a - b : b - a).map(v => ({ e: '', w: band >= 3 ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(v) })); text = t(kind === 'numUp' ? 'qt.numUp' : 'qt.numDown');
    } else if (kind === 'days') { items = run(DAYS, n).map(d => ({ e: '', w: d[subj === 'bm' ? 1 : subj === 'en' ? 0 : li] })); text = t('qt.days'); emo = '📅'; }
    else if (kind === 'months') { items = run(MONTHS, n).map(d => ({ e: '', w: d[subj === 'bm' ? 1 : subj === 'en' ? 0 : li] })); text = t('qt.months'); emo = '🗓️'; }
    else if (kind === 'abc') { const s = rnd(0, 26 - n); items = Array.from({ length: n }, (_, i) => ({ e: '', w: String.fromCharCode(65 + s + i) })); text = t('qt.abc'); emo = '🔤'; }
    else if (kind === 'syl') {
      const pool = subj === 'bm' ? SYL_BM : [...(SYL[Math.min(3, band)] || SYL[2]), ...(SYL[Math.max(1, Math.min(3, band - 1))] || [])].filter(w => w[2].length > 1);
      const [word, e, parts] = pick(pool.filter(w => w[2].length <= n + 1)); items = parts.map(p => ({ e: '', w: p })); text = t('qt.syl', { e }); emo = e;
    } else {
      const seqs = kind === 'size' ? SEQ.size : SEQ[subj], [ten, tms, list] = pick(seqs), k = Math.min(list.length, kind === 'size' ? n : Math.max(n, list.length >= 5 && band >= 3 ? 5 : n));
      const part = list.length > k && subj !== 'pk' ? (subj === 'mz' || kind === 'size' || subj === 'sv' ? run(list, k) : list.slice(0, k)) : list;
      items = part.map(it => ({ e: it[0] === '🎵' ? '' : it[0], w: cap(it[wli]) })); text = t('qt.seq', { s: [ten, tms][li] }); emo = '🧭';
    }
    const ws = items.map(i => i.w); if (new Set(ws).size !== ws.length) return null;   // repeated tiles would be ambiguous
    let tray; do { tray = shuffle(items.map((_, i) => i)); } while (items.length > 1 && tray.every((v, i) => v === i));
    return base(subj, 'order', { text, items, tray, placed: [], options: ws, correct: -1, key: 'order:' + ws.join('|'), memKey: 'order:' + ws.join('|'), ansText: ws.join(' → '), speak: [[`${text} ${shuffle(ws).join(', ')}.`]], viz: () => `<div class="clue big" aria-hidden="true">${emo}</div>` });
  }
  /* which new type (if any) the next battle question should be.
     v35: the share is exact now (before, a "no" was re-rolled up to three times, so the real share was far higher and
     nobody could tune it): age 4 = 60%, age 5 = 58%, age 6 = 55%, age 7 = 52%. Bosses use the same share with short
     forms (3 tiles, 3 pairs). A level can carry lv.only = ['order', 'match', ...] to force those kinds (tower Order Floor). */
  const SHARE = [0, .60, .58, .55, .52];
  const GEN = { tf: tfQ, odd: oddQ, match: matchQ, order: orderQ };
  function pickFor(lv, band) {
    if (!lv || lv.steam || !SUBJ_ORDER.includes(lv.subj)) return null;
    const subj = lv.subj, only = lv.only || null, small = !!lv.boss;
    if (!only && !lv.force && Math.random() > (SHARE[band] || .5)) return null;   // v36: lv.force = a second candidate for the same draw
    let opts = band === 1 ? [['tf', 5], ['odd', 2], ['match', 2], ['order', 1]] : band === 2 ? [['tf', 2], ['odd', 2], ['match', 3], ['order', 3]] : [['tf', 1], ['odd', 2], ['match', 3], ['order', 4]];
    if (typeof FM !== 'undefined' && FM.mod) opts = opts.concat(FM.mod.weights(subj, band, small));
    if (only) opts = opts.filter(([k]) => only.includes(k));
    const make = kind => (GEN[kind] ? GEN[kind](subj, band, small) : FM.mod.make(kind, subj, band, small));
    while (opts.length) {   // weighted pick; a kind that cannot make a question for this subject is dropped
      const tot = opts.reduce((a, [, n]) => a + n, 0); let x = Math.random() * tot, at = 0;
      for (let i = 0; i < opts.length; i++) { if ((x -= opts[i][1]) < 0) { at = i; break; } }
      const kind = opts[at][0]; opts.splice(at, 1);
      for (let i = 0; i < 3; i++) { const q = make(kind); if (q) return q; }
    }
    return only ? null : tfQ(subj, band);
  }
  return { tfQ, oddQ, matchQ, orderQ, pickFor, G, SEQ, F, FP, TF, base, cap, SHARE };
})();

/* ---- answer widgets for ORDER and MATCH (drag or tap; keyboard works through buttons) ---- */
function qtMiss(q) {
  HOOK.emit('answer:wrong', q, -1);
  B.wrong++; B.lead = t('fb.wrong'); sfx.soft(); B.combo = 0; B.charge = 0; updateHud();
  if (bossOn() && B.phase === 2 && !B.runeBroken) { if (B.rune < 2) toast(t('boss.reset')); B.rune = 2; updateRuneText(); }
  B.tleft = B.tmax; setTier(B.wrong); enemyStrike();
}
/* v35: how a new-format widget (kind 'wx', see content/formats.js) talks to the battle */
function wxHooks(q) {
  return { locked: () => B.locked, still: () => B.q === q, tier: () => B.tier, ok: () => { B.locked = true; setTimeout(() => onCorrect(), S.sensory ? 50 : 350); }, miss: () => qtMiss(q) };
}
/* v28: hooks let Studies (the Story builder) use the same widget outside a battle */
function mountOrder(host, q, hooks) {
  const H = hooks || { locked: () => B.locked, still: () => B.q === q, hint: () => B.tier >= 1 && !B.locked, ok: () => { B.locked = true; setTimeout(() => onCorrect(), S.sensory ? 50 : 350); }, miss: () => qtMiss(q) };
  host.innerHTML = `<div class="ordr" data-k="${esc(q.key)}"><div class="o-slots" role="list">${q.items.map((_, i) => `<div class="o-slot" role="listitem" data-s="${i}"><span class="o-n">${i + 1}</span></div>`).join('')}</div>
    <div class="o-tray" role="group" aria-label="${esc(t('qt.tray'))}"></div><div class="o-acts"><button class="chip" data-o="undo">${t('qt.undo')}</button></div></div>`;
  const root = host.querySelector('.ordr'), slots = [...root.querySelectorAll('.o-slot')], tray = root.querySelector('.o-tray');
  const tile = i => `<button class="o-tile" data-i="${i}" aria-label="${esc(q.items[i].w)}">${q.items[i].e ? `<i>${q.items[i].e}</i>` : ''}<b>${esc(q.items[i].w)}</b></button>`;
  function draw() {
    slots.forEach((s, k) => { const i = q.placed[k]; s.classList.toggle('full', i !== undefined); s.classList.toggle('ok', !!q.lockOk && q.lockOk[k]); s.querySelectorAll('.o-tile').forEach(x => x.remove()); if (i !== undefined) s.insertAdjacentHTML('beforeend', tile(i)); });
    const want = q.placed.length;   // the hint shows the tile that belongs in the next empty slot
    tray.innerHTML = q.tray.filter(i => !q.placed.includes(i)).map(tile).join('');
    if (H.hint()) { const b = tray.querySelector(`.o-tile[data-i="${want}"]`); if (b) b.classList.add('hl'); }
  }
  function place(i, at) {
    if (H.locked() || !H.still() || q.placed.includes(i)) return;
    if (at === undefined || at >= q.placed.length) q.placed.push(i); else q.placed.splice(at, 0, i);
    q.placed = q.placed.slice(0, q.items.length); sfx.pop(); draw();
    if (q.placed.length === q.items.length) check();
  }
  function check() {
    const ok = q.placed.every((v, k) => v === k);
    if (ok) { slots.forEach(s => s.classList.add('ok')); H.ok(); return; }
    const keep = []; for (let k = 0; k < q.placed.length; k++) { if (q.placed[k] === k && keep.length === k) keep.push(k); else break; }   // the right start stays put
    root.classList.add('bad'); setTimeout(() => root.classList.remove('bad'), 450);
    setTimeout(() => { if (!H.still()) return; q.placed = keep; draw(); }, 600);
    H.miss();
  }
  q.refresh = draw;
  root.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || root.dataset.drag) return;
    if (b.dataset.o === 'undo') { if (!H.locked() && q.placed.length) { q.placed.pop(); draw(); } return; }
    const i = +b.dataset.i; if (Number.isNaN(i)) return;
    if (q.placed.includes(i)) { if (!H.locked()) { q.placed = q.placed.filter(x => x !== i); draw(); } } else place(i);
  });
  /* drag a tile from the tray onto a slot */
  root.addEventListener('pointerdown', e => {
    const b = e.target.closest('.o-tray .o-tile'); if (!b || H.locked()) return;
    const i = +b.dataset.i, r = b.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY; let ghost = null, moved = false;
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;
      if (!moved) { moved = true; root.dataset.drag = '1'; ghost = b.cloneNode(true); ghost.classList.add('o-ghost'); ghost.style.width = r.width + 'px'; document.body.appendChild(ghost); b.classList.add('lift'); }
      ghost.style.transform = `translate(${ev.clientX - r.width / 2}px,${ev.clientY - r.height / 2}px)`;
      slots.forEach(s => { const sr = s.getBoundingClientRect(); s.classList.toggle('over', ev.clientX > sr.left && ev.clientX < sr.right && ev.clientY > sr.top && ev.clientY < sr.bottom); });
    };
    const up = ev => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      if (!moved) return;
      const at = slots.findIndex(s => s.classList.contains('over')); slots.forEach(s => s.classList.remove('over'));
      if (ghost) ghost.remove(); b.classList.remove('lift'); setTimeout(() => { delete root.dataset.drag; }, 0);
      if (at >= 0) place(i, Math.min(at, q.placed.length));
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });
  draw();
}
function mountQtMatch(host, q) {
  host.innerHTML = `<div class="mtch" data-k="${esc(q.key)}"><div class="m-col m-l">${q.pairs.map((p, i) => `<button class="m-it" data-side="l" data-i="${i}">${esc(p[0])}</button>`).join('')}</div>
    <div class="m-col m-r">${q.right.map(i => `<button class="m-it pic" data-side="r" data-i="${i}" aria-label="${esc(q.pairs[i][1])}">${esc(q.pairs[i][1])}</button>`).join('')}</div></div>`;
  const root = host.querySelector('.mtch'); let sel = null;
  const HUES = ['#4FD1C5', '#FFB547', '#B28CFF', '#FF7EB6', '#7CC4FF'];
  function draw() {
    root.querySelectorAll('.m-it').forEach(b => {
      const i = +b.dataset.i, done = q.done.has(i), k = [...q.done].indexOf(i);
      b.classList.toggle('done', done); b.disabled = done || B.locked; b.style.setProperty('--mh', done ? HUES[k % HUES.length] : '');
      b.classList.toggle('sel', !!sel && sel.side === b.dataset.side && sel.i === i);
      b.classList.toggle('hl', B.tier >= 1 && !done && !sel && b.dataset.side === 'l' && i === [...Array(q.pairs.length).keys()].find(x => !q.done.has(x)));
      b.classList.toggle('hl', b.classList.contains('hl') || (B.tier >= 2 && !!sel && sel.side === 'l' && b.dataset.side === 'r' && i === sel.i));
    });
  }
  q.refresh = draw;
  root.addEventListener('click', e => {
    const b = e.target.closest('.m-it'); if (!b || B.locked || B.q !== q) return;
    const side = b.dataset.side, i = +b.dataset.i;
    if (!sel || sel.side === side) { sel = { side, i }; sfx.pop(); draw(); return; }
    if (sel.i === i) { q.done.add(i); sel = null; sfx.ok(); draw(); if (q.done.size === q.pairs.length) { B.locked = true; draw(); setTimeout(() => onCorrect(), S.sensory ? 50 : 300); } return; }
    const other = root.querySelector(`.m-it[data-side="${sel.side}"][data-i="${sel.i}"]`); [b, other].forEach(x => x && !S.sensory && x.classList.add('nope'));
    setTimeout(() => root.querySelectorAll('.nope').forEach(x => x.classList.remove('nope')), 450);
    sel = null; draw(); qtMiss(q);
  });
  draw();
}
