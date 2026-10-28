/* Age 7: The Ten Star Seals. Cutscene scripts (format: src/parts/25-v29-cutscenes.js).
   c = chapter, b = boss intro, v = victory. Each beat: [shot, speaker, English, Malay, prop]. */
export default {
  0: {
    c: [
      ['wide', 'n', 'Sky Harbour, at dawn. Airships float above the clouds like giant whales, and gulls cry over the docks.', 'Pelabuhan Langit, waktu subuh. Kapal udara terapung di atas awan seperti ikan paus gergasi, dan camar berbunyi di atas jeti.'],
      ['hero', 'n', 'A young knight called {hero} is polishing armour for the hundredth time, dreaming of a real adventure.', 'Seorang kesatria muda bernama {hero} sedang menggilap baju besi buat kali keseratus, bermimpi tentang pengembaraan sebenar.'],
      ['clash', 'n', 'RUMBLE! The whole harbour shakes. Crates tumble, ropes snap, and the bells ring by themselves!', 'GEGAR! Seluruh pelabuhan bergoncang. Peti jatuh, tali putus, dan loceng berbunyi sendiri!', '⚠️'],
      ['item', 'n', 'An ancient scroll falls from a crack in the harbour wall. Glowing letters appear: THE SEALS ARE BREAKING.', 'Sebuah skrol purba jatuh dari celah dinding pelabuhan. Huruf bercahaya muncul: METERAI-METERAI SEDANG PECAH.', '📜'],
      ['owl', 'o', 'Hoo... I hoped this day would never come. I am Hoot, keeper of the old stories.', 'Hu... Saya berharap hari ini tidak akan tiba. Saya Hoot, penjaga cerita-cerita lama.'],
      ['owl', 'o', 'Long ago, the giant demon Drakmor was locked under the world by ten Star Seals. Now, one by one, they are cracking.', 'Dahulu kala, raksasa gergasi Drakmor dikurung di bawah dunia oleh sepuluh Meterai Bintang. Kini, satu demi satu, ia sedang retak.'],
      ['talk', 'x:👩‍✈️:Captain Rina:Kapten Rina', 'The old songs say only a true knight can relight the seals. Every adult I asked ran away screaming.', 'Lagu-lagu lama mengatakan hanya kesatria sejati boleh menyalakan semula meterai. Setiap orang dewasa yang saya tanya lari menjerit.'],
      ['close', 'h', 'Then I will relight every seal before Drakmor wakes up. All ten of them.', 'Kalau begitu, saya akan nyalakan semula setiap meterai sebelum Drakmor bangun. Kesemua sepuluh.', '⚔️'],
      ['dark', 'n', 'But black smoke is already leaking from the cracks. Shadowy shapes crawl onto the docks...', 'Tetapi asap hitam sudah bocor dari celahan. Bentuk-bentuk bayang merangkak ke atas jeti...'],
      ['foe', 'm', 'The master is waking! Feed the dark! Grrraah!', 'Tuan kami sedang bangun! Beri makan kepada kegelapan! Grrraah!'],
      ['clash', 'n', 'Wild monsters swarm the harbour! {hero} draws a sword and leaps into battle!', 'Raksasa liar menyerbu pelabuhan! {hero} menghunus pedang dan melompat ke medan pertempuran!'],
      ['item', 'n', 'The docks are safe for now. On the scroll, a golden compass needle spins... and points to the lighthouse.', 'Jeti selamat buat masa ini. Pada skrol, jarum kompas keemasan berpusing... dan menunjuk ke rumah api.', '🧭']
    ],
    b: [
      ['lair', 'n', 'Beneath the old lighthouse, the first Star Seal flickers weakly, like a candle in the wind.', 'Di bawah rumah api lama, Meterai Bintang pertama berkelip lemah, seperti lilin ditiup angin.'],
      ['reveal', 'b', 'Too late, little knight! The shadow fills me with POWER! The master is waking!', 'Terlambat, kesatria kecil! Bayang memenuhi aku dengan KUASA! Tuan sedang bangun!'],
      ['talk', 'x:👩‍✈️:Captain Rina:Kapten Rina', 'That thing used to be a harmless sea dragon! The shadow has twisted it!', 'Makhluk itu dulunya naga laut yang tidak berbahaya! Bayang telah mengubahnya!'],
      ['owl', 'o', 'Answer true, and the seal will answer you. Every right answer is a spark of starlight.', 'Jawab dengan betul, dan meterai akan menjawab kamu. Setiap jawapan betul ialah percikan cahaya bintang.'],
      ['ready', 'h', 'Then let us light it up. Here I come!', 'Kalau begitu, mari kita nyalakannya. Saya datang!']
    ],
    v: [
      ['vbeat', 'b', 'Wha... where am I? The shadow... is gone? Thank you, knight!', 'Ap... di mana aku? Bayang itu... sudah hilang? Terima kasih, kesatria!'],
      ['item', 'n', 'The seal blazes back to life in a ring of starlight. The ground stops shaking, for now.', 'Meterai itu menyala semula dalam gelang cahaya bintang. Tanah berhenti bergegar, buat masa ini.', '🔆'],
      ['crowd', 'x:👩‍✈️:Harbour crew:Kru pelabuhan', 'Three cheers for {hero}! Hip hip HOORAY!', 'Tiga sorakan untuk {hero}! Hip hip HORE!', '⚓'],
      ['vfix', 'o', '1 of 10 Star Seals relit! One down, nine to go.', '1 daripada 10 Meterai Bintang dinyalakan semula! Satu selesai, sembilan lagi.'],
      ['dark', 'x:👁️:A deep voice:Suara garau', 'Hmmmm... someone... is playing... with my seals...', 'Hmmmm... ada yang... bermain-main... dengan meterai aku...', 'red'],
      ['vnext', 'n', 'Captain Rina lends {hero} her fastest airship. The compass points to {next}.', 'Kapten Rina meminjamkan kapal udaranya yang paling laju kepada {hero}. Kompas menunjuk ke {next}.']
    ]
  },
  1: {
    c: [
      ['travel', 'n', 'One seal glowing! {hero} steers the airship toward Cog Canyon, a valley full of giant gears.', 'Satu meterai bersinar! {hero} mengemudi kapal udara menuju Ngarai Gear, lembah yang penuh gear gergasi.', '⚙️'],
      ['wide', 'n', 'Clank, whirr, tick! The whole canyon is one enormous machine, older than any kingdom.', 'Klang, wirr, tik! Seluruh ngarai ialah satu mesin yang sangat besar, lebih tua daripada mana-mana kerajaan.'],
      ['prob', 'n', 'But bolts are popping loose. Pop! Pop! The great gears that guard the second seal are grinding to a halt.', 'Tetapi bolt-bolt tercabut. Pop! Pop! Gear-gear besar yang menjaga meterai kedua semakin perlahan dan berhenti.', '🔩'],
      ['talk', 'x:👷:Engineer Gizmo:Jurutera Gizmo', 'Oi! You there! Something stole a gear from the middle of the machine. Without it, nothing turns!', 'Oi! Kamu di sana! Ada yang mencuri gear dari tengah mesin. Tanpanya, tiada apa yang berpusing!'],
      ['owl', 'o', 'Every gear needs the others. Find the missing one, and the machine will turn again.', 'Setiap gear memerlukan yang lain. Cari yang hilang, dan mesin akan berpusing semula.'],
      ['hero', 'n', '{hero} studies the machine piece by piece, counting teeth and following belts, like a giant puzzle.', '{hero} mengkaji mesin itu sedikit demi sedikit, mengira gigi gear dan mengikut tali sawat, seperti teka-teki gergasi.'],
      ['close', 'h', 'Wait... this gear turns that one, which turns that one... so the missing gear must go HERE!', 'Tunggu... gear ini memusingkan yang itu, yang memusingkan yang itu... jadi gear yang hilang mesti di SINI!', '💡'],
      ['foe', 'm', 'CLANK! CLANK! Scrap and smash! Scrap and smash!', 'KLANG! KLANG! Besi buruk dan hancur! Besi buruk dan hancur!'],
      ['clash', 'n', 'Clanking monsters made of scrap metal leap from the gears! Sparks fly as {hero} fights back!', 'Raksasa berdenting yang diperbuat daripada besi buruk melompat dari gear! Percikan api berterbangan ketika {hero} melawan!'],
      ['item', 'n', 'Inside the biggest scrap monster: the missing gear! {hero} slots it into place. Click.', 'Di dalam raksasa besi buruk yang paling besar: gear yang hilang! {hero} memasangnya ke tempatnya. Klik.', '⚙️'],
      ['win', 'n', 'Click, clunk, WHIRRR! The gears turn again, and the canyon hums like a happy song.', 'Klik, klang, WIRRR! Gear-gear berpusing semula, dan ngarai berdengung seperti lagu gembira.']
    ],
    b: [
      ['lair', 'n', 'At the heart of the canyon stands a giant clock. The second seal glows inside its face.', 'Di tengah-tengah ngarai berdiri sebuah jam gergasi. Meterai kedua bercahaya di dalam mukanya.'],
      ['reveal', 'b', 'TICK. TOCK. I have jammed the hands. Time is UP for your little world!', 'TIK. TOK. Aku sudah sekat jarumnya. Masa sudah TAMAT untuk dunia kecil kamu!'],
      ['talk', 'x:👷:Engineer Gizmo:Jurutera Gizmo', 'If the clock stops for good, the seal goes dark. Hurry, but do not rush!', 'Jika jam berhenti terus, meterai akan padam. Cepat, tetapi jangan gopoh!'],
      ['owl', 'o', 'A clock is just a puzzle that ticks. Solve it piece by piece.', 'Jam cuma teka-teki yang berdetik. Selesaikannya sedikit demi sedikit.'],
      ['ready', 'h', 'Time is not up while I am here. Let us go!', 'Masa belum tamat selagi saya ada di sini. Mari!']
    ],
    v: [
      ['vbeat', 'b', 'Tick... tock... The shadow is leaving my gears. I feel... wound up... in a good way!', 'Tik... tok... Bayang meninggalkan gear aku. Aku rasa... bersemangat... dengan cara yang baik!'],
      ['item', 'n', 'The great clock ticks again. DONG! The second seal flashes awake.', 'Jam besar berdetik semula. DONG! Meterai kedua menyala bangun.', '🔆'],
      ['crowd', 'x:👷:Gear builders:Pembina gear', 'It works! It WORKS! Somebody get this knight a medal!', 'Ia berfungsi! Ia BERFUNGSI! Seseorang berikan pingat kepada kesatria ini!', '👷'],
      ['vfix', 'o', '2 of 10 Star Seals relit! Your clever thinking saved the canyon.', '2 daripada 10 Meterai Bintang dinyalakan semula! Pemikiran bijak kamu menyelamatkan ngarai.'],
      ['dark', 'x:👁️:A deep voice:Suara garau', 'Two seals... Clever little bug. But I am patient. Very... patient...', 'Dua meterai... Serangga kecil yang bijak. Tetapi aku sabar. Sangat... sabar...', 'red'],
      ['vnext', 'n', 'The compass swings toward the ocean. The third seal lies beneath the waves of {next}.', 'Kompas berpusing ke arah lautan. Meterai ketiga terletak di bawah ombak {next}.']
    ]
  },
  2: {
    c: [
      ['wide', 'n', 'Two seals! Wearing a bubble helmet, {hero} dives down, down, down to the Coral Kingdom.', 'Dua meterai! Dengan topi keledar buih, {hero} menyelam turun, turun, turun ke Kerajaan Karang.'],
      ['prob', 'n', 'Drakmor\'s shadow has drained the coral. Grey reefs stretch as far as the eye can see.', 'Bayang Drakmor telah menyedut warna karang. Terumbu kelabu terbentang sejauh mata memandang.', '🩶'],
      ['talk', 'x:🧜:Princess Marina:Puteri Marina', 'Halt, surface-dweller! The last stranger who came here stole our pearls. Why should we trust you?', 'Berhenti, orang daratan! Orang asing terakhir yang datang mencuri mutiara kami. Kenapa kami patut percaya kamu?'],
      ['owl', 'o', 'The sea people know where the seal is. Earn their trust first. Words are cheap; help is not.', 'Orang laut tahu di mana meterai itu. Dapatkan kepercayaan mereka dahulu. Kata-kata itu murah; pertolongan tidak.'],
      ['item', 'n', 'Nearby, a school of little fish is tangled in an old fishing net, wriggling helplessly.', 'Berhampiran, sekumpulan ikan kecil terperangkap dalam jaring lama, menggeliat tidak berdaya.', '🐟'],
      ['hero', 'n', 'Without a word, {hero} untangles every knot, one by one, until the last little fish swims free.', 'Tanpa sepatah kata, {hero} meleraikan setiap simpulan, satu demi satu, sehingga ikan kecil terakhir berenang bebas.'],
      ['talk', 'x:🧜:Princess Marina:Puteri Marina', '...You helped them and did not even ask for anything. Come. I will show you the way.', '...Kamu menolong mereka dan langsung tidak meminta apa-apa. Mari. Saya akan tunjukkan jalannya.'],
      ['dark', 'n', 'The water grows colder and darker as they swim toward the Great Trench.', 'Air semakin sejuk dan gelap ketika mereka berenang ke arah Palung Besar.'],
      ['foe', 'm', 'Glooob! The deep belongs to the dark!', 'Gluuub! Lautan dalam milik kegelapan!'],
      ['clash', 'n', 'Shadowy sea monsters burst out of the trench! {hero} and the sea guards fight side by side!', 'Raksasa laut bayang meletus keluar dari palung! {hero} dan pengawal laut berlawan bahu-membahu!'],
      ['win', 'n', 'As the shadows flee, colour flows back into the coral: pink, orange and gold!', 'Apabila bayang-bayang lari, warna mengalir kembali ke karang: merah jambu, jingga dan emas!']
    ],
    b: [
      ['lair', 'n', 'At the very bottom of the sea rests a giant clam, older than the oldest whale. The seal glows inside.', 'Di dasar laut terletak seekor kima gergasi, lebih tua daripada ikan paus paling tua. Meterai bercahaya di dalamnya.'],
      ['reveal', 'b', 'SNAP! The clam stays shut! Drakmor will rule the seas!', 'KETAP! Kima kekal tertutup! Drakmor akan menguasai lautan!'],
      ['crowd', 'x:🧜:The sea people:Orang laut', 'We fight with you, {hero}! For the Coral Kingdom!', 'Kami berlawan bersama kamu, {hero}! Demi Kerajaan Karang!', '🧜'],
      ['owl', 'o', 'Trust is the strongest armour. You earned it today.', 'Kepercayaan ialah perisai paling kuat. Kamu memperolehnya hari ini.'],
      ['ready', 'h', 'For the sea! Let us go!', 'Demi lautan! Mari!']
    ],
    v: [
      ['vbeat', 'b', 'Blub... my mind is clear again. I am so sorry, sea people!', 'Blub... fikiran aku jernih semula. Aku minta maaf, orang laut!'],
      ['item', 'n', 'The clam opens wide. The seal\'s light shoots up through the water and lights the whole reef.', 'Kima terbuka luas. Cahaya meterai memancar naik menembusi air dan menerangi seluruh terumbu.', '🔆'],
      ['talk', 'x:🧜:Princess Marina:Puteri Marina', 'Take this pearl, {hero}. If you ever need us, hold it up and call. We will come.', 'Ambil mutiara ini, {hero}. Jika kamu memerlukan kami, angkat dan panggil. Kami akan datang.'],
      ['vfix', 'o', '3 of 10 Star Seals relit! And you made new friends. That may matter more than you know.', '3 daripada 10 Meterai Bintang dinyalakan semula! Dan kamu ada kawan baharu. Itu mungkin lebih penting daripada yang kamu sangka.'],
      ['vnext', 'n', 'Back on the surface, thunder booms. Storm clouds gather over {next}.', 'Kembali di permukaan, guruh berdentum. Awan ribut berkumpul di atas {next}.']
    ]
  },
  3: {
    c: [
      ['wide', 'n', 'Three seals! {hero} climbs the jagged Thunder Peaks. The rocks are black and the sky is purple.', 'Tiga meterai! {hero} mendaki Puncak Guruh yang bergerigi. Batunya hitam dan langitnya ungu.'],
      ['clash', 'n', 'KRAKA-BOOM! Lightning strikes the cliff right beside {hero}. Pebbles rain down!', 'KRAK-DUM! Kilat menyambar tebing betul-betul di sebelah {hero}. Batu kecil berguguran!', '⚡'],
      ['prob', 'n', 'Wild storms crash over the mountains, and every bolt makes the demon\'s shadow stronger.', 'Ribut liar melanda gunung, dan setiap panahan kilat menjadikan bayang raksasa itu lebih kuat.', '⛈️'],
      ['close', 'h', 'I have to get to the top NOW, before the next bolt hits!', 'Saya mesti sampai ke puncak SEKARANG, sebelum kilat seterusnya menyambar!', '😰'],
      ['owl', 'o', 'Wait! Storms pass. Stay steady, and wait for the right moment.', 'Tunggu! Ribut akan berlalu. Bertenang, dan tunggu masa yang sesuai.'],
      ['talk', 'x:🧘:Old Monk Tenzin:Sami Tua Tenzin', 'Count the seconds between the flash and the boom. When the count grows, the storm moves away.', 'Kira saat antara kilat dan dentuman. Apabila kiraan bertambah, ribut semakin jauh.'],
      ['hero', 'n', 'Flash! One... two... three... BOOM. {hero} plants both feet and moves only when it is safe.', 'Kilat! Satu... dua... tiga... DUM. {hero} memasak kedua-dua kaki dan bergerak hanya apabila selamat.'],
      ['foe', 'm', 'Kzzzt! Ride the storm! Strike the knight!', 'Kzzzt! Tunggang ribut! Serang kesatria!'],
      ['clash', 'n', 'Crackling storm monsters dive out of the clouds! {hero} stays calm and strikes back, bolt after bolt!', 'Raksasa ribut berdesir menjunam keluar dari awan! {hero} kekal tenang dan menyerang balas, kilat demi kilat!'],
      ['win', 'n', 'Slowly, the thunder rolls away. A sunbeam peeks over the peaks.', 'Perlahan-lahan, guruh berlalu. Seberkas cahaya matahari mengintai di atas puncak.']
    ],
    b: [
      ['lair', 'n', 'The fourth seal sits on the highest peak, struck by lightning again and again. It is cracking!', 'Meterai keempat terletak di puncak paling tinggi, disambar kilat berulang kali. Ia sedang retak!'],
      ['reveal', 'b', 'I RIDE the storm! Drakmor grows stronger with every bolt! KRAKA-BOOM!', 'Aku MENUNGGANG ribut! Drakmor semakin kuat dengan setiap kilat! KRAK-DUM!'],
      ['talk', 'x:🧘:Old Monk Tenzin:Sami Tua Tenzin', 'The storm is loud, but it is not wise. Be the calm in the middle of it.', 'Ribut itu kuat bunyinya, tetapi ia tidak bijak. Jadilah ketenangan di tengah-tengahnya.'],
      ['owl', 'o', 'A calm mind wins against any storm.', 'Fikiran yang tenang menang melawan mana-mana ribut.'],
      ['ready', 'h', 'Breathe in. Breathe out. Now!', 'Tarik nafas. Hembus. Sekarang!']
    ],
    v: [
      ['vbeat', 'b', 'The storm... is quiet... and so am I. Thank you, calm one.', 'Ribut itu... sudah reda... dan aku pun. Terima kasih, si tenang.'],
      ['item', 'n', 'The clouds break apart, and the fourth seal shines through like a second sun.', 'Awan berpecah, dan meterai keempat bersinar menembusinya seperti matahari kedua.', '🔆'],
      ['vfix', 'o', '4 of 10 Star Seals relit! You are getting stronger, {hero}. I can feel it.', '4 daripada 10 Meterai Bintang dinyalakan semula! Kamu semakin kuat, {hero}. Saya dapat merasainya.'],
      ['dark', 'x:👁️:A deep voice:Suara garau', 'ENOUGH! Who DARES to stop me?!', 'CUKUP! Siapa BERANI menghalang aku?!', 'red'],
      ['vnext', 'n', 'The voice booms from the deep caves of {next}. The ground trembles beneath {hero}\'s boots.', 'Suara itu bergema dari gua-gua dalam di {next}. Tanah bergegar di bawah but {hero}.']
    ]
  },
  4: {
    c: [
      ['wide', 'n', 'Four seals, and halfway there! {hero} enters the glittering Crystal Caverns. Every wall sparkles like a rainbow.', 'Empat meterai, dan separuh jalan! {hero} memasuki Gua Kristal yang berkilauan. Setiap dinding berkilau seperti pelangi.'],
      ['prob', 'n', 'Then, one by one, the crystals go dark. Something is drinking their light.', 'Kemudian, satu demi satu, kristal-kristal menjadi gelap. Ada sesuatu yang meminum cahayanya.', '🌑'],
      ['dark', 'n', 'Two enormous red eyes open in the darkness. They are bigger than doors.', 'Dua mata merah yang sangat besar terbuka dalam kegelapan. Ia lebih besar daripada pintu.', 'red'],
      ['villain', 'v', 'So YOU are the little knight. I am DRAKMOR. Four tiny seals will not hold me for long!', 'Jadi KAMULAH kesatria kecil itu. Aku DRAKMOR. Empat meterai kecil tidak akan dapat menahan aku lama!'],
      ['close', 'h', 'You are... much bigger than I thought.', 'Kamu... jauh lebih besar daripada yang saya sangka.', '😨'],
      ['villain', 'v', 'Join me, little knight. Together we could rule everything! Or... be swallowed by the dark.', 'Sertai aku, kesatria kecil. Bersama kita boleh menguasai segala-galanya! Atau... ditelan kegelapan.'],
      ['owl', 'o', 'He wants you to be afraid. Fear is his weapon. Do not give it to him.', 'Dia mahu kamu takut. Ketakutan ialah senjatanya. Jangan berikan kepadanya.'],
      ['talk', 'h', 'No, Drakmor. I will not join you, and I will not run.', 'Tidak, Drakmor. Saya tidak akan menyertai kamu, dan saya tidak akan lari.'],
      ['villain', 'v', 'Then my crystal monsters will crush you! RAAAAH!', 'Kalau begitu, raksasa kristal aku akan menghancurkan kamu! RAAAAH!'],
      ['clash', 'n', 'Crystal monsters crack out of the walls! {hero} fights with everything they have!', 'Raksasa kristal pecah keluar dari dinding! {hero} berlawan dengan sepenuh tenaga!'],
      ['win', 'n', 'With every brave answer, a crystal flickers back to life. Hope is spreading through the cave!', 'Dengan setiap jawapan berani, sebutir kristal berkelip hidup semula. Harapan merebak di dalam gua!']
    ],
    b: [
      ['lair', 'n', 'The fifth seal hangs from the cave roof like a frozen star, wrapped in black chains of shadow.', 'Meterai kelima tergantung dari bumbung gua seperti bintang beku, dibalut rantai bayang yang hitam.'],
      ['reveal', 'b', 'The master says your journey ENDS here! Crunch, crunch, crunch!', 'Tuan kata perjalanan kamu TAMAT di sini! Krup, krup, krup!'],
      ['villain', 'v', 'Hahaha! Run, little knight! Run home to your little harbour!', 'Hahaha! Larilah, kesatria kecil! Lari pulang ke pelabuhan kecil kamu!'],
      ['owl', 'o', 'You were scared, and you stayed. That is what makes a hero.', 'Kamu takut, dan kamu tetap bertahan. Itulah yang menjadikan seorang wira.'],
      ['ready', 'h', 'My journey is not over. It is only halfway! Let us go!', 'Perjalanan saya belum tamat. Baru separuh jalan! Mari!']
    ],
    v: [
      ['vbeat', 'b', 'The shadow chains... are breaking! I am free!', 'Rantai bayang... sedang putus! Aku bebas!'],
      ['item', 'n', 'Every crystal in the cave blazes at once. The fifth seal rings like a giant bell.', 'Setiap kristal dalam gua menyala serentak. Meterai kelima berbunyi seperti loceng gergasi.', '💎'],
      ['villain', 'v', 'NOOOO! My light! My power! You will PAY for this, knight!', 'TIDAAAK! Cahaya aku! Kuasa aku! Kamu akan MENERIMA BALASAN, kesatria!'],
      ['vfix', 'o', 'Drakmor\'s shadow shrinks back, howling. 5 of 10 Star Seals relit! Halfway!', 'Bayang Drakmor mengecut sambil melolong. 5 daripada 10 Meterai Bintang dinyalakan semula! Separuh jalan!'],
      ['vnext', 'o', 'The scroll shows the sixth seal is buried in {next}, under a sea of sand.', 'Skrol menunjukkan meterai keenam tertanam di {next}, di bawah lautan pasir.']
    ]
  },
  5: {
    c: [
      ['travel', 'n', 'Five seals! The airship crosses a burning desert to the Sandstorm Ruins.', 'Lima meterai! Kapal udara merentasi gurun yang panas terik ke Runtuhan Ribut Pasir.', '🏜️'],
      ['prob', 'n', 'A howling sandstorm swirls around an ancient city. The sixth seal is buried somewhere inside.', 'Ribut pasir melolong berpusing di sekeliling sebuah kota purba. Meterai keenam tertanam di suatu tempat di dalamnya.', '🌪️'],
      ['talk', 'x:🧕:Explorer Zara:Penjelajah Zara', 'I have searched these ruins for ten years! The walls are covered in pictures, but nobody can read them.', 'Saya sudah mencari di runtuhan ini selama sepuluh tahun! Dindingnya penuh gambar, tetapi tiada siapa boleh membacanya.'],
      ['owl', 'o', 'The old builders left clues on the walls. Read them carefully, in order.', 'Pembina zaman dahulu meninggalkan petunjuk di dinding. Bacalah dengan teliti, mengikut urutan.'],
      ['item', 'n', '{hero} brushes the sand away. A picture of a sun... then a moon... then ten stars in a circle.', '{hero} menyapu pasir. Gambar matahari... kemudian bulan... kemudian sepuluh bintang dalam bulatan.', '🏺'],
      ['close', 'h', 'Sun, moon, stars! It is a path! Follow the sun pictures in the morning, the moon pictures at night!', 'Matahari, bulan, bintang! Ia satu laluan! Ikut gambar matahari pada waktu pagi, gambar bulan pada waktu malam!', '💡'],
      ['talk', 'x:🧕:Explorer Zara:Penjelajah Zara', 'Ten years, and you solved it in ten minutes! Show me!', 'Sepuluh tahun, dan kamu selesaikannya dalam sepuluh minit! Tunjukkan saya!'],
      ['foe', 'm', 'Hsssss! Sand in your eyes! Sand in your boots!', 'Hsssss! Pasir dalam mata kamu! Pasir dalam but kamu!'],
      ['clash', 'n', 'Sand monsters rise up from the dunes! {hero} slashes through the swirling grains!', 'Raksasa pasir bangkit dari bukit pasir! {hero} menetak menembusi butiran pasir yang berpusing!'],
      ['win', 'n', 'The storm settles. In the quiet, an old jar glows with a hidden map.', 'Ribut reda. Dalam kesunyian, sebuah tempayan lama bercahaya dengan peta tersembunyi.']
    ],
    b: [
      ['lair', 'n', 'Deep in the ruins, a stone door is carved with ten stars. Six of them are dark.', 'Jauh di dalam runtuhan, sebuah pintu batu diukir dengan sepuluh bintang. Enam daripadanya gelap.'],
      ['reveal', 'b', 'TURN BACK! Or be buried under a thousand years of sand!', 'BERPATAH BALIK! Atau ditanam di bawah seribu tahun pasir!'],
      ['talk', 'x:🧕:Explorer Zara:Penjelajah Zara', 'I will hold the torch. You do the brave part!', 'Saya pegang obor. Kamu buat bahagian yang berani!'],
      ['owl', 'o', 'You have come so far. Every step has led here.', 'Kamu sudah datang begitu jauh. Setiap langkah membawa ke sini.'],
      ['ready', 'h', 'I have come too far to turn back now!', 'Saya sudah datang terlalu jauh untuk berpatah balik sekarang!']
    ],
    v: [
      ['vbeat', 'b', 'Hsss... the sand settles... the shadow is gone...', 'Hsss... pasir mendap... bayang sudah hilang...'],
      ['item', 'n', 'The stone door grinds open, and the seal\'s light shoots into the sky like a beacon.', 'Pintu batu terbuka dengan bunyi berdesir, dan cahaya meterai memancar ke langit seperti suar.', '🔆'],
      ['talk', 'x:🧕:Explorer Zara:Penjelajah Zara', 'This map in the jar... it shows a library made of ice! I will write about you in every book, {hero}!', 'Peta dalam tempayan ini... ia menunjukkan perpustakaan diperbuat daripada ais! Saya akan menulis tentang kamu dalam setiap buku, {hero}!'],
      ['vfix', 'o', '6 of 10 Star Seals relit! Your sharp eyes saw what others missed.', '6 daripada 10 Meterai Bintang dinyalakan semula! Mata kamu yang tajam nampak apa yang orang lain terlepas.'],
      ['vnext', 'n', 'The map points north, to a frozen library at {next}.', 'Peta menunjuk ke utara, ke sebuah perpustakaan beku di {next}.']
    ]
  },
  6: {
    c: [
      ['wide', 'n', 'Six seals! {hero} reaches the Frost Archive, the oldest library in the whole world.', 'Enam meterai! {hero} tiba di Arkib Fros, perpustakaan paling tua di seluruh dunia.'],
      ['prob', 'n', 'Brrr! Drakmor\'s cold breath has frozen every book solid. The secret of the last seals is trapped in ice.', 'Brrr! Nafas sejuk Drakmor telah membekukan setiap buku. Rahsia meterai-meterai terakhir terperangkap dalam ais.', '🧊'],
      ['talk', 'x:🧓:Librarian Pages:Pustakawan Pages', 'Shhh! Oh... it does not matter now. The books are silent anyway. A library without readers is just a cold room.', 'Syhh! Oh... tidak penting lagi. Buku-buku sudah senyap. Perpustakaan tanpa pembaca cuma bilik yang sejuk.'],
      ['owl', 'o', 'Knowledge is light, and light is warm. Warm the books with what you know.', 'Ilmu ialah cahaya, dan cahaya itu hangat. Hangatkan buku-buku dengan apa yang kamu tahu.'],
      ['hero', 'n', '{hero} picks up a frozen book and starts to read aloud. Every right answer melts a little more ice.', '{hero} mengambil sebuah buku beku dan mula membaca dengan kuat. Setiap jawapan betul mencairkan sedikit lagi ais.'],
      ['item', 'n', 'Drip... drip... drip! A book thaws in {hero}\'s hands, and its pages flutter open.', 'Titik... titik... titik! Sebuah buku cair di tangan {hero}, dan halamannya terselak terbuka.', '📚'],
      ['talk', 'x:🧓:Librarian Pages:Pustakawan Pages', 'A reader! A real reader! Oh, I have not been this happy in a hundred years!', 'Seorang pembaca! Pembaca sebenar! Oh, saya tidak segembira ini selama seratus tahun!'],
      ['foe', 'm', 'CRACK! Freeze the words! Freeze the knight!', 'KRAK! Bekukan perkataan! Bekukan kesatria!'],
      ['clash', 'n', 'Icy monsters crack out of the frozen shelves! {hero} fights them with facts and courage!', 'Raksasa ais pecah keluar dari rak beku! {hero} melawan mereka dengan fakta dan keberanian!'],
      ['win', 'n', 'Shelf by shelf, the books wake up. One of them opens to a page that glows gold.', 'Rak demi rak, buku-buku bangun. Salah satunya terbuka pada halaman yang bercahaya keemasan.']
    ],
    b: [
      ['lair', 'n', 'In the great reading hall, the seventh seal is locked inside a block of ice the size of a house.', 'Di dewan bacaan besar, meterai ketujuh terkunci di dalam bongkah ais sebesar rumah.'],
      ['reveal', 'b', 'Drakmor will freeze every word you know! Every letter! Every number!', 'Drakmor akan membekukan setiap perkataan yang kamu tahu! Setiap huruf! Setiap nombor!'],
      ['talk', 'x:🧓:Librarian Pages:Pustakawan Pages', 'Use the books, child! Everything ever learned is on these shelves!', 'Gunakan buku-buku itu, nak! Semua ilmu yang pernah dipelajari ada di rak-rak ini!'],
      ['owl', 'o', 'Then let us show him how much we know.', 'Kalau begitu, mari kita tunjukkan kepadanya betapa banyak yang kita tahu.'],
      ['ready', 'h', 'Knowledge is light. Let us melt that ice!', 'Ilmu ialah cahaya. Mari cairkan ais itu!']
    ],
    v: [
      ['vbeat', 'b', 'Melting... the words are warm... I remember how to read!', 'Mencair... perkataan-perkataan hangat... aku ingat cara membaca!'],
      ['item', 'n', 'The ice shatters into a million sparkles, and the seventh seal shines.', 'Ais pecah menjadi sejuta kilauan, dan meterai ketujuh bersinar.', '🔆'],
      ['talk', 'x:🧓:Librarian Pages:Pustakawan Pages', 'The golden page! It says the last seal must be lit inside Drakmor\'s own fortress. Oh dear.', 'Halaman emas itu! Ia berkata meterai terakhir mesti dinyalakan di dalam kubu Drakmor sendiri. Aduhai.'],
      ['vfix', 'o', '7 of 10 Star Seals relit! Now we know how this ends. We just have to be brave enough to get there.', '7 daripada 10 Meterai Bintang dinyalakan semula! Sekarang kita tahu bagaimana ini berakhir. Kita cuma perlu cukup berani untuk sampai ke sana.'],
      ['vnext', 'n', 'But first, the eighth seal. It is hidden in the bright city of {next}.', 'Tetapi dahulu, meterai kelapan. Ia tersembunyi di kota terang {next}.']
    ]
  },
  7: {
    c: [
      ['travel', 'n', 'Seven seals! The airship glides into the Neon Metropolis at night.', 'Tujuh meterai! Kapal udara meluncur masuk ke Metropolis Neon pada waktu malam.', '🏙️'],
      ['dark', 'n', 'Every light in the city is out. Drakmor\'s shadow creeps along the empty streets like ink.', 'Setiap lampu di kota padam. Bayang Drakmor merayap di jalan-jalan yang kosong seperti dakwat.'],
      ['talk', 'x:🧑‍💼:Mayor Lumen:Datuk Bandar Lumen', 'Psst! In here! Everyone is hiding. The shadow whispers terrible things in the dark.', 'Psst! Di sini! Semua orang bersembunyi. Bayang itu membisikkan perkara mengerikan dalam gelap.'],
      ['owl', 'o', 'The people are scared. A hero does not only fight. A hero gives others courage.', 'Rakyat ketakutan. Wira bukan sahaja berlawan. Wira memberi keberanian kepada orang lain.'],
      ['hero', 'n', '{hero} climbs onto the fountain in the city square and raises a glowing sword high.', '{hero} memanjat air pancut di dataran kota dan mengangkat pedang yang bercahaya tinggi-tinggi.'],
      ['crowd', 'h', 'Do not be afraid! I have faced Drakmor and I am still standing. Help me turn the lights back on!', 'Jangan takut! Saya sudah berdepan dengan Drakmor dan saya masih berdiri. Tolong saya nyalakan semula lampu-lampu!', '🧑‍💼'],
      ['crowd', 'x:🧒:A small girl:Seorang budak perempuan', 'I am not scared! I will turn on my lamp!', 'Saya tidak takut! Saya akan nyalakan lampu saya!', '🏮'],
      ['foe', 'm', 'BZZZZT! Darkness forever! No more lights!', 'BZZZZT! Gelap selama-lamanya! Tiada lagi lampu!'],
      ['clash', 'n', 'Electric monsters spark out of every wire! {hero} leaps between the rooftops, fighting them off!', 'Raksasa elektrik memercik keluar dari setiap wayar! {hero} melompat di antara bumbung, melawan mereka!'],
      ['win', 'n', 'Window by window, the city glows. The people pour out into the streets and cheer!', 'Tingkap demi tingkap, kota bercahaya. Rakyat berpusu-pusu keluar ke jalan dan bersorak!']
    ],
    b: [
      ['lair', 'n', 'The eighth seal powers the tallest tower in the city. Shadow wraps around it like a giant snake.', 'Meterai kelapan memberi kuasa kepada menara paling tinggi di kota. Bayang membelitnya seperti ular gergasi.'],
      ['reveal', 'b', 'This city belongs to Drakmor now! Lights OFF, forever!', 'Kota ini milik Drakmor sekarang! Lampu PADAM, selama-lamanya!'],
      ['crowd', 'x:🧑‍💼:The whole city:Seluruh kota', 'We are with you, {hero}! Lights ON!', 'Kami bersama kamu, {hero}! Lampu NYALA!', '💡'],
      ['owl', 'o', 'Look behind you. Thousands of lights. The whole city is watching.', 'Lihat di belakang kamu. Beribu-ribu lampu. Seluruh kota sedang melihat.'],
      ['ready', 'h', 'Then let us give them a show. Here I come!', 'Kalau begitu, mari kita beri mereka persembahan. Saya datang!']
    ],
    v: [
      ['vbeat', 'b', 'So bright... I forgot how beautiful the city looks with its lights on.', 'Terangnya... aku lupa betapa cantiknya kota ini dengan lampunya menyala.'],
      ['item', 'n', 'The tower beams starlight across the whole sky. You can see it from a hundred miles away!', 'Menara itu memancarkan cahaya bintang ke seluruh langit. Ia boleh dilihat dari seratus batu jauhnya!', '🔆'],
      ['crowd', 'x:🧑‍💼:Mayor Lumen:Datuk Bandar Lumen', 'From today, this square is called {hero} Square!', 'Mulai hari ini, dataran ini dinamakan Dataran {hero}!', '🧑'],
      ['vfix', 'o', '8 of 10 Star Seals relit! Only two left.', '8 daripada 10 Meterai Bintang dinyalakan semula! Tinggal dua sahaja.'],
      ['villain', 'v', 'ENOUGH! If I cannot break the seals from below, I will smash them from ABOVE!', 'CUKUP! Jika aku tidak boleh memecahkan meterai dari bawah, aku akan menghancurkannya dari ATAS!'],
      ['vnext', 'n', 'Meteors streak across the sky. They are falling toward {next}!', 'Meteor-meteor meluncur di langit. Ia jatuh ke arah {next}!']
    ]
  },
  8: {
    c: [
      ['wide', 'n', 'Eight seals! {hero}\'s airship lands on the floating rocks of Asteroid Garden, high above the clouds.', 'Lapan meterai! Kapal udara {hero} mendarat di batu-batu terapung Taman Asteroid, tinggi di atas awan.'],
      ['prob', 'n', 'WHOOSH! BOOM! Drakmor is pulling meteors down to smash the ninth seal and the gardens around it.', 'WUSY! DUM! Drakmor sedang menarik meteor turun untuk menghancurkan meterai kesembilan dan taman di sekelilingnya.', '☄️'],
      ['close', 'h', 'There are too many! I cannot stop them all by myself!', 'Terlalu banyak! Saya tidak boleh menghalang semuanya seorang diri!', '😰'],
      ['owl', 'o', 'You do not have to. Everyone you helped is with you now. Look!', 'Kamu tidak perlu. Semua orang yang kamu tolong kini bersama kamu. Lihat!'],
      ['crowd', 'x:🧜:Princess Marina:Puteri Marina', 'You called with the pearl! The sea people are here!', 'Kamu memanggil dengan mutiara! Orang laut sudah tiba!', '🧜'],
      ['crowd', 'x:👷:Engineer Gizmo:Jurutera Gizmo', 'And the gear builders! We brought a giant shield machine!', 'Dan pembina gear! Kami bawa mesin perisai gergasi!', '👷'],
      ['crowd', 'x:🧑‍💼:Mayor Lumen:Datuk Bandar Lumen', 'The city is here too! Every light we have!', 'Kota pun ada di sini! Setiap lampu yang kami ada!', '💡'],
      ['foe', 'm', 'CRASH! SMASH! Rocks from the sky!', 'PRANG! HANCUR! Batu dari langit!'],
      ['clash', 'n', 'Rocky monsters crash down from the sky! Together, everyone fights to shield the garden!', 'Raksasa batu jatuh dari langit! Bersama-sama, semua orang berjuang melindungi taman!'],
      ['win', 'n', 'The meteors bounce off the giant shield. Little green sprouts push up between the rocks.', 'Meteor-meteor melantun dari perisai gergasi. Tunas hijau kecil tumbuh di celah-celah batu.']
    ],
    b: [
      ['lair', 'n', 'The ninth seal floats at the centre of the garden, cracked almost in half.', 'Meterai kesembilan terapung di tengah taman, retak hampir terbelah dua.'],
      ['reveal', 'b', 'Wheee! I ride a BLAZING meteor! One more seal, and Drakmor is FREE!', 'Wiii! Aku menunggang meteor yang MENYALA! Satu lagi meterai, dan Drakmor BEBAS!'],
      ['villain', 'v', 'Yes! YES! Smash it! I can almost taste freedom!', 'Ya! YA! Hancurkannya! Aku hampir dapat merasai kebebasan!'],
      ['owl', 'o', 'This is where we stop him. Together.', 'Di sinilah kita hentikan dia. Bersama-sama.'],
      ['ready', 'h', 'Everyone, behind me! For the ninth seal!', 'Semua, di belakang saya! Demi meterai kesembilan!']
    ],
    v: [
      ['vbeat', 'b', 'Whoa... the meteor is out of fuel. And so am I. Good game, knight!', 'Wah... meteor kehabisan bahan api. Aku pun sama. Permainan yang bagus, kesatria!'],
      ['item', 'n', 'The ninth seal mends itself in a flash of light. Crack by crack, it glows whole again.', 'Meterai kesembilan bercantum semula dalam kilauan cahaya. Retak demi retak, ia bercahaya sempurna semula.', '🔆'],
      ['crowd', 'x:🧑‍💼:All your friends:Semua kawan kamu', 'Hooray! One more to go! We believe in you, {hero}!', 'Hore! Satu lagi! Kami percaya pada kamu, {hero}!', '🧑'],
      ['vfix', 'o', '9 of 10 Star Seals relit! Only one remains, deep in the demon\'s own fortress.', '9 daripada 10 Meterai Bintang dinyalakan semula! Tinggal satu sahaja, jauh di dalam kubu raksasa itu sendiri.'],
      ['vnext', 'n', 'The sky over {next} turns black as night. The ground rumbles. Drakmor is waking.', 'Langit di atas {next} menjadi hitam seperti malam. Tanah bergemuruh. Drakmor sedang bangun.']
    ]
  },
  9: {
    c: [
      ['wide', 'n', 'Nine seals shine as {hero} reaches the Shadow Citadel, at the very edge of the world.', 'Sembilan meterai bersinar apabila {hero} tiba di Kubu Bayang, di hujung dunia.'],
      ['clash', 'n', 'KRAAAKOOOM! The ground splits open! The last seal is shattering!', 'KRAAAKUUUM! Tanah terbelah! Meterai terakhir sedang pecah!', '⚠️'],
      ['villain', 'v', 'AT LAST! After a thousand years, I am FREE! Nothing can stop me now!', 'AKHIRNYA! Selepas seribu tahun, aku BEBAS! Tiada apa yang boleh menghalang aku sekarang!'],
      ['dark', 'n', 'Drakmor rises as tall as a mountain. His wings blot out the stars.', 'Drakmor bangkit setinggi gunung. Sayapnya menutup bintang-bintang.', 'red'],
      ['villain', 'v', 'Shadows of the world, come to me! Destroy the little knight!', 'Bayang-bayang dunia, datanglah kepada aku! Musnahkan kesatria kecil itu!'],
      ['foe', 'm', 'ROOOAAAR! For the master!', 'NGAUUUUM! Demi tuan!'],
      ['clash', 'n', 'Every shadow monster in the world charges at once! {hero} fights through wave after wave!', 'Setiap raksasa bayang di dunia menyerbu serentak! {hero} berlawan menembusi gelombang demi gelombang!'],
      ['owl', 'o', '{hero}! The nine seals you lit, they are still yours! Call them!', '{hero}! Sembilan meterai yang kamu nyalakan, ia masih milik kamu! Panggil mereka!'],
      ['item', 'n', '{hero} raises the sword. Nine beams of starlight shoot across the sky and pour into the blade!', '{hero} mengangkat pedang. Sembilan pancaran cahaya bintang melintasi langit dan mengalir ke dalam bilah!', '⚔️'],
      ['close', 'h', 'For the harbour, the sea, the city and everyone! Drakmor, this ends NOW!', 'Demi pelabuhan, lautan, kota dan semua orang! Drakmor, ini berakhir SEKARANG!', '✨'],
      ['win', 'n', 'With one mighty strike, the tenth seal blazes. Drakmor shrinks back into the stone, roaring...', 'Dengan satu tetakan yang hebat, meterai kesepuluh menyala. Drakmor mengecut kembali ke dalam batu, mengaum...']
    ],
    b: [
      ['lair', 'n', 'But the Demon Throne still trembles. Red light pours through the cracks.', 'Tetapi Takhta Raksasa masih bergegar. Cahaya merah memancar melalui celahan.'],
      ['reveal', 'b', 'I am Drakmor\'s last guardian! You will NEVER reach the final seal!', 'Akulah penjaga terakhir Drakmor! Kamu TIDAK AKAN sampai ke meterai terakhir!'],
      ['villain', 'v', 'Hold the knight back, my guardian! Give me time to break free!', 'Tahan kesatria itu, penjagaku! Beri aku masa untuk bebas!'],
      ['owl', 'o', 'Everything you have learned has led to this moment. The whole world is counting on you.', 'Segala yang kamu pelajari membawa kepada saat ini. Seluruh dunia bergantung kepada kamu.'],
      ['ready', 'h', 'Then I will not let them down. FOR THE WORLD!', 'Kalau begitu, saya tidak akan mengecewakan mereka. DEMI DUNIA!']
    ],
    v: [
      ['vbeat', 'b', 'The red light... fades... You are the knight of the songs...', 'Cahaya merah... pudar... Kamulah kesatria dalam lagu-lagu itu...'],
      ['villain', 'v', 'NO! NOOOO! Not again! Not for another thousand years!', 'TIDAK! TIDAAAK! Bukan lagi! Bukan untuk seribu tahun lagi!', 'sad'],
      ['item', 'n', 'The ten Star Seals ring the world like a crown of light, and Drakmor is sealed away for good.', 'Sepuluh Meterai Bintang mengelilingi dunia seperti mahkota cahaya, dan Drakmor dikurung untuk selama-lamanya.', '🔆'],
      ['vfix', 'o', '10 of 10 Star Seals relit. Hoo... you did it, {hero}. You really did it.', '10 daripada 10 Meterai Bintang dinyalakan semula. Hu... kamu berjaya, {hero}. Kamu betul-betul berjaya.'],
      ['crowd', 'x:👩‍✈️:The whole world:Seluruh dunia', 'All hail {hero}, the knight who saved the world!', 'Hidup {hero}, kesatria yang menyelamatkan dunia!', '🧑'],
      ['finale', 'n', 'The citadel\'s shadows melt into morning light. And every land sings the song of {hero}. The end!', 'Bayang-bayang kubu cair menjadi cahaya pagi. Dan setiap negeri menyanyikan lagu {hero}. Tamat!']
    ]
  }
};
