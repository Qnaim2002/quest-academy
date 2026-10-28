/* ================= v17: more unique questions =================
   Some question families follow a clear pattern ("Which letter comes after M?", "What is 🐔 in Malay?",
   "How many claps: 👏👏👏?"). The banks only held a few of each, so children met the same ones again and
   again. Here every family is completed from the row that is already in the bank, keeping that row's
   age band, topic and answer group, so the new questions slot into the same levels.
   Nothing here changes an existing question. Generated rows are skipped if the text already exists. */
(function growBanks() {
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DAYS = [['Monday', 'Isnin'], ['Tuesday', 'Selasa'], ['Wednesday', 'Rabu'], ['Thursday', 'Khamis'], ['Friday', 'Jumaat'], ['Saturday', 'Sabtu'], ['Sunday', 'Ahad']];
  const NOUNS = [['🐄', 'Cow', 'Lembu'], ['🐐', 'Goat', 'Kambing'], ['🦆', 'Duck', 'Itik'], ['🐒', 'Monkey', 'Monyet'], ['🐍', 'Snake', 'Ular'], ['🍇', 'Grapes', 'Anggur'], ['🥭', 'Mango', 'Mangga'],
    ['🍉', 'Watermelon', 'Tembikai'], ['🚲', 'Bicycle', 'Basikal'], ['✈️', 'Aeroplane', 'Kapal terbang'], ['🚢', 'Ship', 'Kapal'], ['👟', 'Shoe', 'Kasut'], ['🪑', 'Chair', 'Kerusi'], ['🛏️', 'Bed', 'Katil'],
    ['🌧️', 'Rain', 'Hujan'], ['🌈', 'Rainbow', 'Pelangi'], ['🦋', 'Butterfly', 'Rama-rama'], ['🐜', 'Ant', 'Semut'], ['🐝', 'Bee', 'Lebah'], ['🥚', 'Egg', 'Telur'], ['🍚', 'Rice', 'Nasi'],
    ['🥛', 'Milk', 'Susu'], ['🐸', 'Frog', 'Katak'], ['🐰', 'Rabbit', 'Arnab'], ['🦁', 'Lion', 'Singa'], ['🐯', 'Tiger', 'Harimau'], ['🐢', 'Turtle', 'Kura-kura'], ['🍞', 'Bread', 'Roti'],
    ['🚌', 'Bus', 'Bas'], ['🌻', 'Sunflower', 'Bunga matahari'], ['🐦', 'Bird', 'Burung'], ['🍓', 'Strawberry', 'Strawberi'], ['🧢', 'Cap', 'Topi'], ['🔑', 'Key', 'Kunci'], ['☂️', 'Umbrella', 'Payung']];
  const START = [['🐜', 'ant'], ['🥚', 'egg'], ['🐐', 'goat'], ['🎩', 'hat'], ['🧊', 'ice'], ['🍯', 'jam'], ['🪁', 'kite'], ['🦁', 'lion'], ['🌙', 'moon'], ['🦉', 'owl'], ['🐷', 'pig'], ['👑', 'queen'],
    ['🐰', 'rabbit'], ['🐯', 'tiger'], ['☂️', 'umbrella'], ['🚐', 'van'], ['⌚', 'watch'], ['🦓', 'zebra'], ['🐝', 'bee'], ['🦆', 'duck'], ['🌳', 'tree'], ['🥛', 'milk'], ['🍇', 'grapes'], ['🐻', 'bear']];
  const INSTR = [['🎷', 'Saxophone', 'Saksofon'], ['🪗', 'Accordion', 'Akordion'], ['🔔', 'Bell', 'Loceng']];
  const add = (subj, band, tpl, q, a, qm, am) => {
    const rows = BANK[subj][band], k = q.toLowerCase();
    if (rows.some(r => r.q[0].toLowerCase() === k)) return;
    rows.push({ topic: tpl.topic, grp: tpl.grp, em: tpl.em2 || tpl.em, q: [q, qm], a: [a, am], w: null, gen: 1 });
  };
  const fam = (subj, re, fn) => Object.keys(BANK[subj] || {}).forEach(band => {
    const rows = BANK[subj][band], tpl = rows.find(r => re.test(r.q[0]));
    if (tpl) fn(+band, tpl, (q, a, qm, am, em) => add(subj, band, em ? { ...tpl, em2: em } : tpl, q, a, qm, am));
  });
  /* letters: after and before (English and Bahasa Melayu subjects) */
  fam('en', /^Which letter comes after [A-Z]\?$/, (b, tpl, put) => {
    for (let i = 0; i < 25; i++) put(`Which letter comes after ${ABC[i]}?`, ABC[i + 1], `Huruf apakah selepas ${ABC[i]}?`, ABC[i + 1]);
    for (let i = 1; i < 26; i++) put(`Which letter comes before ${ABC[i]}?`, ABC[i - 1], `Huruf apakah sebelum ${ABC[i]}?`, ABC[i - 1]);
  });
  /* v24: the Bahasa Melayu subject asks about the Malay alphabet, so its questions never repeat English ones */
  fam('bm', /^Which letter comes after [A-Z] in the Malay alphabet\?$/, (b, tpl, put) => {
    for (let i = 0; i < 25; i++) put(`Which letter comes after ${ABC[i]} in the Malay alphabet?`, ABC[i + 1], `Dalam abjad Melayu, huruf apakah selepas ${ABC[i]}?`, ABC[i + 1]);
    for (let i = 1; i < 26; i++) put(`Which letter comes before ${ABC[i]} in the Malay alphabet?`, ABC[i - 1], `Dalam abjad Melayu, huruf apakah sebelum ${ABC[i]}?`, ABC[i - 1]);
  });
  /* days of the week */
  fam('en', /^Which day comes after \w+\?$/, (b, tpl, put) => DAYS.forEach((d, i) => {
    const nx = DAYS[(i + 1) % 7], pv = DAYS[(i + 6) % 7];
    put(`Which day comes after ${d[0]}?`, nx[0], `Hari apakah selepas ${d[0]}?`, nx[0]);
    put(`Which day comes before ${d[0]}?`, pv[0], `Hari apakah sebelum ${d[0]}?`, pv[0]);
  }));
  fam('bm', /^Which day comes after \w+ \(\w+\)\?$/, (b, tpl, put) => DAYS.forEach((d, i) => {
    const nx = DAYS[(i + 1) % 7], pv = DAYS[(i + 6) % 7];
    put(`Which day comes after ${d[0]} (${d[1]})?`, nx[1], `Hari apakah selepas hari ${d[1]}?`, nx[1]);
    put(`Which day comes before ${d[0]} (${d[1]})?`, pv[1], `Hari apakah sebelum hari ${d[1]}?`, pv[1]);
  }));
  /* naming things from a picture */
  fam('en', /^What is \S+\?$/, (b, tpl, put) => NOUNS.forEach(([e, en]) => put(`What is ${e}?`, en, `Apakah ${e}?`, en, e)));
  fam('bm', /^What is \S+ in Malay\?$/, (b, tpl, put) => NOUNS.forEach(([e, en, ms]) => put(`What is ${e} in Malay?`, ms, `Apakah nama untuk ${e}?`, ms, e)));
  /* first letter of a word */
  fam('en', /^Which letter does '\w+' start with\?$/, (b, tpl, put) => START.forEach(([e, w]) => put(`Which letter does '${w}' start with?`, w[0].toUpperCase(), `Perkataan '${w}' bermula dengan huruf apa?`, w[0].toUpperCase(), e)));
  /* music: claps and instruments */
  fam('mz', /^How many claps: (?:👏)+\?$/, (b, tpl, put) => { for (let n = 2; n <= 8; n++) { const c = '👏'.repeat(n); put(`How many claps: ${c}?`, String(n), `Berapakah tepukan: ${c}?`, String(n), c); } });
  fam('mz', /^Which instrument is \S+\?$/, (b, tpl, put) => INSTR.forEach(([e, en, ms]) => put(`Which instrument is ${e}?`, en, `Apakah nama alat muzik ${e}?`, ms, e)));
})();

/* ================= v21: procedural questions for Seni Visual and Muzik (ages 5-7) =================
   These two subjects had only ~17 questions per age bank. Each family below is generated once at start-up
   from a fixed seed, so the same questions appear on every device and the bank stays reviewable
   (`npm run check`). Every row lists its own wrong answers, so the options are always sensible. */
(function artMusicFamilies() {
  const R = rng(20211014), pickR = a => a[Math.floor(R() * a.length)], shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const put = (subj, band, topic, grp, em, qen, aen, qms, ams, wen, wms) => {
    const rows = BANK[subj][band], k = qen.toLowerCase(); if (rows.some(r => r.q[0].toLowerCase() === k)) return;
    rows.push({ topic, grp, em, q: [qen, qms], a: [aen, ams], w: [wen, wms], gen: 2 });
  };
  /* ---- colours: mixing, which two make a colour, warm or cool ---- */
  const C = { red: ['Red', 'Merah', '🟥'], yellow: ['Yellow', 'Kuning', '🟨'], blue: ['Blue', 'Biru', '🟦'], white: ['White', 'Putih', '⬜'], black: ['Black', 'Hitam', '⬛'], orange: ['Orange', 'Oren', '🟧'], green: ['Green', 'Hijau', '🟩'], purple: ['Purple', 'Ungu', '🟪'], pink: ['Pink', 'Merah jambu', '🩷'], grey: ['Grey', 'Kelabu', '🩶'], brown: ['Brown', 'Coklat', '🟫'], lblue: ['Light blue', 'Biru muda', '🩵'] };
  const MIX = [['red', 'yellow', 'orange'], ['red', 'blue', 'purple'], ['blue', 'yellow', 'green'], ['red', 'white', 'pink'], ['black', 'white', 'grey'], ['blue', 'white', 'lblue'], ['red', 'green', 'brown']];
  const others = (ans, pool) => shuf(pool.filter(x => x !== ans)).slice(0, 3);
  MIX.forEach(([a, b, c], i) => [[a, b], [b, a]].forEach(([x, y], k) => {
    const band = i < 4 && !k ? 2 : 3, w = others(c, ['orange', 'purple', 'green', 'pink', 'grey', 'brown', 'lblue']);
    put('sv', band, 'warna', 'mixg', C[x][2] + C[y][2], `${C[x][0]} mixed with ${C[y][0].toLowerCase()} makes which colour?`, C[c][0], `${C[x][1]} dicampur dengan ${C[y][1].toLowerCase()} menjadi warna apa?`, C[c][1], w.map(z => C[z][0]), w.map(z => C[z][1]));
  }));
  MIX.forEach(([a, b, c]) => {
    const pairs = MIX.filter(m => m[2] !== c).map(m => [m[0], m[1]]), w = shuf(pairs).slice(0, 3);
    const en = p => `${C[p[0]][0]} + ${C[p[1]][0].toLowerCase()}`, ms = p => `${C[p[0]][1]} + ${C[p[1]][1].toLowerCase()}`;
    put('sv', 3, 'warna', 'mixr', C[c][2], `Which two colours mix to make ${C[c][0].toLowerCase()}?`, en([a, b]), `Dua warna manakah yang dicampur untuk menjadi ${C[c][1].toLowerCase()}?`, ms([a, b]), w.map(en), w.map(ms));
  });
  /* v31: four choices (one warm colour and the three cool ones, or the other way) instead of just "warm or cool?" */
  const WARM = ['red', 'orange', 'yellow'], COOL = ['blue', 'green', 'purple'];
  const TEMP_Q = { 1: [['Which one of these is a warm colour?', 'Yang manakah warna panas?'], ['Find the warm colour.', 'Cari warna panas.'], ['Pick the colour that feels warm, like the sun.', 'Pilih warna yang terasa panas, seperti matahari.']],
    0: [['Which one of these is a cool colour?', 'Yang manakah warna sejuk?'], ['Find the cool colour.', 'Cari warna sejuk.'], ['Pick the colour that feels cool, like the sea.', 'Pilih warna yang terasa sejuk, seperti laut.']] };
  [1, 0].forEach(warm => (warm ? WARM : COOL).forEach((c, i) => {
    const w = warm ? COOL : WARM, [qe, qm] = TEMP_Q[warm][i];
    put('sv', 2, 'warna', 'temp', '🌡️', qe, C[c][0], qm, C[c][1], w.map(z => C[z][0]), w.map(z => C[z][1]));
  }));
  /* ---- patterns: what comes next? ---- */
  const SYM = ['🔴', '🔵', '🟡', '🟢', '⭐', '🔺', '🟦', '🌸', '🍃', '🌙'], SHAPES = { AB: 'ab', ABB: 'abb', AAB: 'aab', ABC: 'abc', AABB: 'aabb' };
  const seen = new Set();
  [['AB', 2, 8], ['ABB', 2, 6], ['AAB', 3, 6], ['ABC', 3, 8], ['AABB', 3, 6]].forEach(([shape, band, n]) => {
    for (let k = 0, tries = 0; k < n && tries < 200; tries++) {
      const syms = shuf(SYM).slice(0, 3), unit = SHAPES[shape].split('').map(ch => syms['abc'.indexOf(ch)]);
      const len = unit.length, show = Math.max(len * 2, 5) + (k % 2), seq = Array.from({ length: show }, (_, i) => unit[i % len]), ans = unit[show % len];
      const key = seq.join(''); if (seen.has(key)) continue; seen.add(key); k++;
      const wrong = shuf(SYM.filter(s => s !== ans && !unit.includes(s))).slice(0, 1).concat([...new Set(unit)].filter(s => s !== ans)).slice(0, 3);
      put('sv', band, 'corak', 'next', '🧩', `What comes next? ${seq.join(' ')} …`, ans, `Apakah yang seterusnya? ${seq.join(' ')} …`, ans, wrong, wrong);
    }
  });
  /* ---- music: count the beats, notes before and after ---- */
  const BEAT = [['ta', 1], ['ti-ti', 1], ['ta-a', 2], ['sh', 1]], beatsSeen = new Set();
  [[2, 3, 4, 10, false], [3, 4, 6, 12, true]].forEach(([band, lo, hi, n, rests]) => {
    for (let k = 0, tries = 0; k < n && tries < 400; tries++) {
      const parts = []; let sum = 0; const target = lo + Math.floor(R() * (hi - lo + 1));
      while (sum < target) { const opts = BEAT.filter(([w, b]) => (rests || w !== 'sh') && sum + b <= target); const p = pickR(opts); parts.push(p[0]); sum += p[1]; }
      const txt = parts.join(' · '); if (beatsSeen.has(txt) || parts.length < 2) continue; beatsSeen.add(txt); k++;
      const w = shuf([sum - 2, sum - 1, sum + 1, sum + 2].filter(x => x > 0)).slice(0, 3).map(String);
      put('mz', band, 'irama', 'beats', '🥁', `Clap and count: ${txt}. How many beats?`, String(sum), `Tepuk dan kira: ${txt}. Berapa ketukan?`, String(sum), w, w);
    }
  });
  const SOL = ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Ti'];
  SOL.forEach((nm, i) => {
    const nx = SOL[(i + 1) % 7], pv = SOL[(i + 6) % 7], wNx = shuf(SOL.filter(x => x !== nx && x !== nm)).slice(0, 3), wPv = shuf(SOL.filter(x => x !== pv && x !== nm)).slice(0, 3);
    const up = i ? `${SOL[i - 1]}, ${nm}` : nm, dn = i < 6 ? `${SOL[i + 1]}, ${nm}` : `Do, ${nm}`;   // v22: show the notes sung so far, so "next" is clear
    if (i < 6) put('mz', 2, 'nada', 'solup', '🎼', `Sing up the scale: ${up}, … which note comes next?`, nx, `Nyanyi tangga nada naik: ${up}, … not apakah seterusnya?`, nx, wNx, wNx);
    if (i > 0) put('mz', 3, 'nada', 'soldn', '🎼', `Sing down the scale: ${dn}, … which note comes next?`, pv, `Nyanyi tangga nada turun: ${dn}, … not apakah seterusnya?`, pv, wPv, wPv);
  });
  /* v31: four choices (one high sound and three low ones, or the other way) instead of just "high or low?" */
  const HIGH = [['🐦', 'A bird’s tweet', 'Kicauan burung'], ['🐭', 'A mouse’s squeak', 'Ciut tikus'], ['🔔', 'A tiny bell', 'Loceng kecil']];
  const LOW = [['🐘', 'An elephant’s stomp', 'Hentakan gajah'], ['🦁', 'A lion’s roar', 'Ngauman singa'], ['🥁', 'A big drum', 'Gendang besar']];
  const PITCH_Q = { 1: [['Which one makes a high sound?', 'Yang manakah menghasilkan bunyi tinggi?'], ['Find the high sound.', 'Cari bunyi tinggi.'], ['Which sound is high, like a whistle?', 'Bunyi manakah yang tinggi, seperti wisel?']],
    0: [['Which one makes a low sound?', 'Yang manakah menghasilkan bunyi rendah?'], ['Find the low sound.', 'Cari bunyi rendah.'], ['Which sound is low and deep?', 'Bunyi manakah yang rendah dan dalam?']] };
  [1, 0].forEach(high => (high ? HIGH : LOW).forEach(([em, en, ms], i) => {
    const w = high ? LOW : HIGH, [qe, qm] = PITCH_Q[high][i];
    put('mz', 2, 'bunyi', 'pitch', '🎵', qe, en, qm, ms, w.map(x => x[1]), w.map(x => x[2]));
  }));
})();
