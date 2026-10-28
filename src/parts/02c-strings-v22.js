/* ================= v22 strings (English / Bahasa Melayu) ================= */
Object.assign(STR, {
  /* new question types */
  'tag.tf': ['⚡ True or false', '⚡ Betul atau salah'], 'tag.odd': ['🤔 Odd one out', '🤔 Yang berbeza'], 'tag.match': ['🔗 Match', '🔗 Padankan'], 'tag.order': ['🧭 Put in order', '🧭 Susun ikut urutan'],
  'tf.true': ['✔ True', '✔ Betul'], 'tf.false': ['✘ False', '✘ Salah'], 'tf.ask': ['True or false?', 'Betul atau salah?'],
  'tf.called': ['This is called “{w}”.', 'Ini dipanggil “{w}”.'], 'tf.colour': ['This is {c}.', 'Ini berwarna {c}.'],
  'tf.count': ['There are {n} {e} here.', 'Ada {n} {e} di sini.'], 'tf.bigger': ['{a} is bigger than {b}.', '{a} lebih besar daripada {b}.'], 'tf.after': ['{a} comes after {b}.', '{a} datang selepas {b}.'],
  'qt.oddWhy': ['{x} is not {g}.', '{x} bukan {g}.'],
  'qt.notEven': ['{x} is odd. The others are even.', '{x} nombor ganjil. Yang lain nombor genap.'], 'qt.notOdd': ['{x} is even. The others are odd.', '{x} nombor genap. Yang lain nombor ganjil.'],
  'qt.match': ['Match each word to its picture.', 'Padankan setiap perkataan dengan gambarnya.'], 'qt.matchSum': ['Match each sum to its answer.', 'Padankan setiap soalan dengan jawapannya.'],
  'qt.matchBaby': ['Match each baby to its grown-up animal.', 'Padankan setiap anak dengan haiwan dewasanya.'], 'qt.matchSense': ['Match each action to the body part we use.', 'Padankan setiap perbuatan dengan anggota badan yang kita guna.'],
  'qt.matchPolite': ['Match each picture to the right words.', 'Padankan setiap gambar dengan kata-kata yang betul.'], 'qt.matchFeel': ['Match each face to its feeling.', 'Padankan setiap wajah dengan perasaannya.'],
  'qt.numUp': ['Put the numbers in order, from smallest to biggest.', 'Susun nombor dari yang paling kecil ke paling besar.'], 'qt.numDown': ['Put the numbers in order, from biggest to smallest.', 'Susun nombor dari yang paling besar ke paling kecil.'],
  'qt.days': ['Put the days in order.', 'Susun hari mengikut urutan.'], 'qt.months': ['Put the months in order.', 'Susun bulan mengikut urutan.'], 'qt.abc': ['Put the letters in ABC order.', 'Susun huruf mengikut urutan abjad.'],
  'qt.syl': ['Put the syllables in order to make the word for {e}.', 'Susun suku kata untuk membentuk perkataan bagi {e}.'], 'qt.seq': ['{s}: put the steps in order.', '{s}: susun langkah mengikut urutan.'],
  'qt.tray': ['Tiles to place', 'Jubin untuk disusun'], 'qt.undo': ['↶ Undo', '↶ Buat asal'],
  'qs.tf1': ['Look at the picture.', 'Lihat gambar.'], 'qs.tf2': ['Read the sentence. Does it match the picture and what you know?', 'Baca ayat itu. Adakah ia sepadan dengan gambar dan apa yang kamu tahu?'], 'qs.tf3': ['Yes means True. No means False.', 'Ya bermaksud Betul. Tidak bermaksud Salah.'],
  'qs.odd1': ['Name each picture.', 'Namakan setiap gambar.'], 'qs.odd2': ['Find the group that three of them share.', 'Cari kumpulan yang dikongsi oleh tiga daripadanya.'], 'qs.odd3': ['Tap the one that does not fit.', 'Sentuh yang tidak sesuai.'],
  'qs.match1': ['Tap the first word.', 'Sentuh perkataan pertama.'], 'qs.match2': ['Tap the picture that goes with it.', 'Sentuh gambar yang sepadan.'], 'qs.match3': ['Do the same for the rest.', 'Buat yang sama untuk yang lain.'],
  'qs.order1': ['Find the one that comes first and tap it (or drag it to box 1).', 'Cari yang pertama dan sentuhnya (atau seret ke kotak 1).'], 'qs.order2': ['Then find the next one.', 'Kemudian cari yang seterusnya.'], 'qs.order3': ['Tap a placed tile to take it back.', 'Sentuh jubin yang sudah diletakkan untuk mengambilnya semula.'],
  /* finishers */
  'fin.combo': ['Combo {n}/5', 'Kombo {n}/5'], 'fin.hit': ['{f}! −{d}', '{f}! −{d}'],
  'fin.sr': ['Five in a row! {f} hits {m} for {d}.', 'Lima berturut-turut! {f} menyerang {m} sebanyak {d}.'],
  'sl.finisher': ['Finishers', 'Serangan penamat'], 'fin.note': ['A finisher fires after 5 right answers in a row. Each one looks different; they all hit just as hard.', 'Serangan penamat berlaku selepas 5 jawapan betul berturut-turut. Setiap satu kelihatan berbeza; kekuatannya sama.'],
  'fin.preview': ['▶ Watch', '▶ Tonton'], 'fin.stat': ['Combo 5 finisher', 'Penamat kombo 5']
,
  /* lesson practice and quick quiz */
  'pr.title': ['Practice', 'Latihan'], 'pr.sub': ['Ready to use what you learned? Train against the straw dummy, or take the quick quiz.', 'Sedia menggunakan apa yang kamu belajar? Berlatih dengan patung latihan, atau cuba kuiz pantas.'],
  'pr.try3': ['Try 3 practice questions', 'Cuba 3 soalan latihan'], 'pr.quiz5': ['Quick quiz (5 questions)', 'Kuiz pantas (5 soalan)'],
  'pr.pracN': ['Practice {i} of {n}', 'Latihan {i} daripada {n}'], 'pr.quizN': ['Quiz: question {i} of {n}', 'Kuiz: soalan {i} daripada {n}'],
  'pr.hit': ['Right! Your hero hits the dummy! 💥', 'Betul! Wira kamu memukul patung latihan! 💥'], 'pr.right': ['Right! ✅', 'Betul! ✅'],
  'pr.again': ['Not yet. Try again!', 'Belum tepat. Cuba lagi!'], 'pr.wrongQuiz': ['The answer is: {a}', 'Jawapannya: {a}'],
  'pr.next': ['Next', 'Seterusnya'], 'pr.finish': ['See my score', 'Lihat markah saya'], 'pr.again2': ['Again', 'Sekali lagi'],
  'pr.best': ['Best quiz score: {n}/5', 'Markah kuiz terbaik: {n}/5'], 'pr.go': ['Battle in {s}', 'Bertarung dalam {s}'],
  'pr.pracDone': ['Training done! You are ready for a real battle.', 'Latihan selesai! Kamu sedia untuk pertarungan sebenar.'],
  'pr.quizAll': ['Perfect! You know this lesson very well.', 'Sempurna! Kamu sangat faham pelajaran ini.'], 'pr.quizGood': ['Well done! Look at the lesson once more to get them all.', 'Bagus! Lihat pelajaran sekali lagi untuk dapat semuanya.'], 'pr.quizMore': ['Good try! Read the lesson again, then try the quiz.', 'Cubaan yang baik! Baca pelajaran sekali lagi, kemudian cuba kuiz.'],
  'lg.quiz': ['Quiz: {name} ({n}/5)', 'Kuiz: {name} ({n}/5)'],
  /* lesson of the week */
  'lw.title': ['Lesson of the week', 'Pelajaran minggu ini'], 'lw.badge': ['Lesson of the week', 'Pelajaran minggu ini'],
  'lw.note': ['Pick a lesson to pin at the top of Lessons. It stays there until you change or clear it.', 'Pilih satu pelajaran untuk dipaparkan di atas Pelajaran. Ia kekal sehingga anda menukar atau mengosongkannya.'],
  'lw.subj': ['Subject', 'Subjek'], 'lw.lesson': ['Lesson', 'Pelajaran'], 'lw.pin': ['Pin this lesson', 'Semat pelajaran ini'], 'lw.clear': ['Remove', 'Buang'],
  'lw.now': ['Pinned now: {t}', 'Disemat sekarang: {t}'], 'lw.done': ['learned', 'sudah dipelajari'], 'lw.pinned': ['Lesson of the week pinned.', 'Pelajaran minggu ini telah disemat.'],
  /* demos */
  'dm.oclock': ['{h} o’clock', 'pukul {h} tepat'], 'dm.half': ['half past {h}', 'pukul {h} setengah'], 'dm.qpast': ['quarter past {h}', 'pukul {h} suku'], 'dm.qto': ['quarter to {h}', 'pukul {h} kurang suku'], 'dm.hm': ['{m} minutes past {h}', 'pukul {h} lebih {m} minit'],
  'dm.showTime': ['Show {t} on the clock', 'Tunjukkan pukul {t} pada jam'], 'dm.yes': ['Yes! That is the time.', 'Ya! Itulah masanya.'], 'dm.newGoal': ['New time', 'Masa baharu'], 'dm.hour': ['hour', 'jam'],
  'dm.dragHands': ['Drag the long or short hand, or use the buttons.', 'Seret jarum panjang atau pendek, atau guna butang.'],
  'dm.nlStart': ['The frog starts at {n}. Tap a hop!', 'Katak bermula di {n}. Sentuh lompatan!'], 'dm.nlTip': ['Tap a number to start there. + hops right, − hops left.', 'Sentuh nombor untuk mula di situ. + lompat ke kanan, − lompat ke kiri.'],
  'dm.payExact': ['Tap coins and notes to pay the exact price. Tap a coin in the purse to take it back.', 'Sentuh duit syiling dan wang kertas untuk membayar harga yang tepat. Sentuh duit dalam dompet untuk mengambilnya semula.'],
  'dm.purse': ['Your purse', 'Dompet kamu'], 'dm.purseEmpty': ['Your purse is empty.', 'Dompet kamu kosong.'], 'dm.total': ['Total: {t}', 'Jumlah: {t}'], 'dm.tooMuch': ['Too much!', 'Terlalu banyak!'], 'dm.nextSnack': ['Next snack', 'Snek seterusnya'],
  'dm.clap': ['Clap', 'Tepuk'], 'dm.check': ['Check', 'Semak'], 'dm.clapTip': ['Say the word slowly and clap once for each part.', 'Sebut perkataan perlahan-lahan dan tepuk sekali bagi setiap bahagian.'],
  'dm.clapOk': ['Yes! {n} syllables.', 'Ya! {n} suku kata.'], 'dm.clapNo': ['Listen again: it has {n} syllables.', 'Dengar lagi: ia ada {n} suku kata.'], 'dm.nextWord': ['Next word', 'Perkataan seterusnya'],
  'dm.guess': ['will it float or sink?', 'adakah ia terapung atau tenggelam?'], 'dm.floats': ['Floats', 'Terapung'], 'dm.sinks': ['Sinks', 'Tenggelam'],
  'dm.didFloat': ['The {o} floats.', '{o} terapung.'], 'dm.didSink': ['The {o} sinks.', '{o} tenggelam.'], 'dm.flPick': ['Pick a thing to test.', 'Pilih satu benda untuk diuji.'], 'dm.flAll': ['All tested! {n} of {m} float.', 'Semua sudah diuji! {n} daripada {m} terapung.'],
  'dm.magYes': ['Magnetic', 'Bermagnet'], 'dm.magNo': ['Not magnetic', 'Tidak bermagnet'], 'dm.sticks': ['The magnet pulls the {o}!', 'Magnet menarik {o}!'], 'dm.noStick': ['The {o} does not move.', '{o} tidak bergerak.'],
  'dm.magPick': ['Tap a thing to test it with the magnet.', 'Sentuh satu benda untuk diuji dengan magnet.'], 'dm.magAll': ['Things made of iron or steel stick to a magnet.', 'Benda yang diperbuat daripada besi atau keluli melekat pada magnet.']
,
  /* star goals */
  'gl.first': ['First try', 'Kali pertama'], 'gl.speed': ['Speed', 'Pantas'], 'gl.nohint': ['No hints', 'Tanpa bantuan'],
  'gl.firstD': ['Get 8 out of 10 right on the first try.', 'Jawab 8 daripada 10 dengan betul pada kali pertama.'], 'gl.speedD': ['Answer before the timer runs out, nice and quick.', 'Jawab sebelum masa tamat, dengan pantas.'],
  'gl.nohintD': ['Win without “More help” and without Hoot helping you up.', 'Menang tanpa “Bantuan lagi” dan tanpa Hoot membantu kamu bangun.'],
  'gl.got': ['done', 'selesai'], 'gl.notyet': ['not yet', 'belum'], });
STR['ko.note'] = ['Hoot helped you up in this battle, so the 💡 no-hints star waits for next time. Retry for more stars!', 'Hoot membantu kamu bangun dalam pertarungan ini, jadi bintang 💡 tanpa bantuan menunggu lain kali. Cuba lagi untuk lebih bintang!'];
Object.assign(STR, {
  /* stories: hero name and pet */
  'ep.defaultHero': ['Little Knight', 'Kesatria Kecil'],   // v26: the sagas are about a knight; used when no name was given
  'ep.arrive': ['{hero} steps into {z}, ready for adventure.', '{hero} melangkah ke {z}, sedia untuk pengembaraan.'],
  'ep.boss': ['{hero} takes a deep breath. This is it!', '{hero} menarik nafas dalam-dalam. Inilah masanya!'],
  'ep.bossPet': ['{hero} and {pet} stand tall together. This is it!', '{hero} dan {pet} berdiri tegak bersama. Inilah masanya!'],
  'ep.victHero': ['Well done, {hero}!', 'Syabas, {hero}!'], 'ep.victPet': ['{pet} does a happy dance for {hero}!', '{pet} menari gembira untuk {hero}!'],
  'ep.nextHero': ['Onward, {hero}!', 'Mara ke hadapan, {hero}!'], 'ep.finHero': ['{hero}, you are a true hero of Quest Academy!', '{hero}, kamu wira sejati Quest Academy!'],
  'wl.name': ['What is your hero’s name?', 'Siapakah nama wira kamu?'], 'wl.namePh': ['Type a name', 'Taip nama']
});

/* v22: monster cards */
Object.assign(STR, {
  'nav.cards': ['Cards', 'Kad'],
  'dx.title': ['Monster Cards', 'Kad Raksasa'],
  'dx.sub': ['Beat a monster to win its card. Can you find every kind?', 'Kalahkan raksasa untuk dapat kadnya. Boleh kamu cari semua jenis?'],
  'dx.prog': ['{n} of {m} cards collected', '{n} daripada {m} kad dikumpul'],
  'dx.species': ['Kinds found: {n} of {m}', 'Jenis dijumpai: {n} daripada {m}'],
  'dx.have': ['You have {n} of {m} cards', 'Kamu ada {n} daripada {m} kad'],
  'dx.left': ['{n} more to find on your adventure!', '{n} lagi untuk dicari dalam kembara!'],
  'dx.none': ['Not found yet. Keep exploring the map!', 'Belum dijumpai. Teruskan meneroka peta!'],
  'dx.unknown': ['Unknown kind', 'Jenis belum diketahui'],
  'dx.back': ['All kinds', 'Semua jenis'],
  'dx.new1': ['NEW', 'BARU'],
  'dx.newN': ['{n} new cards', '{n} kad baru'],
  'dx.got': ['New monster card!', 'Kad raksasa baru!'],
  'dx.lv': ['Level {n}', 'Tahap {n}']
});

/* v23: simpler level card and victory card */
Object.assign(STR, {
  'br.opts': ['How to answer', 'Cara menjawab'],
  'v.tip.first': ['Next time: get 8 out of 10 right on the first try.', 'Lain kali: jawab 8 daripada 10 dengan betul pada kali pertama.'],
  'v.tip.speed': ['Next time: answer a little faster.', 'Lain kali: jawab dengan lebih pantas.'],
  'v.tip.nohint': ['Next time: try it without "More help".', 'Lain kali: cuba tanpa "Bantuan lagi".'],
  'v.tip.all': ['All three stars. Amazing!', 'Ketiga-tiga bintang. Hebat!']
});
