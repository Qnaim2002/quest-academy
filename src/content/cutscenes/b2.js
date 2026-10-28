/* Age 5: The Lone Knight and the Star of Tomorrow. Cutscene scripts (format: src/parts/25-v29-cutscenes.js).
   c = chapter, b = boss intro, v = victory. Each beat: [shot, speaker, English, Malay, prop]. */
export default {
  0: {
    c: [
      ['wide', 'n', 'Far away, by the golden Paddy Fields, lives a lone knight called {hero}.', 'Jauh di sana, di tepi Sawah Padi yang keemasan, tinggal seorang kesatria bernama {hero}.'],
      ['item', 'n', '{hero} has a shiny sword and a plain, empty shield. Not one mark on it.', '{hero} ada pedang berkilat dan perisai kosong. Tiada satu tanda pun padanya.', '🛡️'],
      ['close', 'h', 'Who am I? What am I good at? I wish I knew...', 'Siapakah saya? Apa kebolehan saya? Kalaulah saya tahu...', '🤔'],
      ['prob', 'n', 'One morning, a cold grey fog rolls over the fields. Nobody can see a thing!', 'Pada suatu pagi, kabus kelabu yang sejuk menyelubungi sawah. Tiada siapa nampak apa-apa!', '🌫️'],
      ['talk', 'x:👩‍🌾:Farmer Aminah:Peladang Aminah', 'The fog has been here for days. Our rice will not grow. Tomorrow looks so gloomy.', 'Kabus sudah berhari-hari di sini. Padi kami tidak tumbuh. Hari esok nampak suram.'],
      ['owl', 'o', 'Hoo! I am Hoot. Above the clouds shines the Star of Tomorrow. It grows dim when nobody believes things can get better.', 'Hu! Saya Hoot. Di atas awan bersinar Bintang Hari Esok. Ia menjadi malap apabila tiada siapa percaya keadaan boleh menjadi lebih baik.'],
      ['hero', 'h', 'Then I will make tomorrow better! And maybe I will find out who I am on the way.', 'Kalau begitu saya akan jadikan hari esok lebih baik! Dan mungkin saya akan tahu siapa diri saya dalam perjalanan.'],
      ['dark', 'n', 'Squelch... squelch... Something is moving in the muddy fog.', 'Plok... plok... Ada sesuatu bergerak dalam kabus berlumpur.'],
      ['foe', 'm', 'Blurrgh! The fog is ours! Nobody sees tomorrow!', 'Blurrgh! Kabus ini milik kami! Tiada siapa nampak hari esok!'],
      ['clash', 'n', '{hero} is scared, but steps forward anyway. Swish! The fog monsters back away!', '{hero} takut, tetapi tetap melangkah ke hadapan. Wusy! Raksasa kabus berundur!'],
      ['item', 'n', 'Sunlight touches the rice... and look! A tiny star appears on {hero}\'s shield!', 'Cahaya matahari menyentuh padi... dan lihat! Sebuah bintang kecil muncul pada perisai {hero}!', '⭐']
    ],
    b: [
      ['lair', 'n', 'At the edge of the fields stands an old scarecrow, wrapped in thick fog.', 'Di hujung sawah berdiri sebuah orang-orang tua, dibalut kabus tebal.'],
      ['reveal', 'b', 'A lonely knight like YOU cannot change anything! Go home!', 'Kesatria seorang diri seperti KAMU tidak boleh mengubah apa-apa! Baliklah!'],
      ['talk', 'x:👩‍🌾:Farmer Aminah:Peladang Aminah', 'Please be careful! That monster has scared away every helper.', 'Tolong hati-hati! Raksasa itu sudah menakutkan semua penolong.'],
      ['owl', 'o', 'Show it what you can do. Your heart is bigger than you think.', 'Tunjukkan kepadanya apa yang kamu boleh buat. Hati kamu lebih besar daripada yang kamu sangka.'],
      ['ready', 'h', 'I might be alone, but I will not give up. Let us go!', 'Saya mungkin seorang diri, tetapi saya tidak akan berputus asa. Mari!']
    ],
    v: [
      ['vbeat', 'b', 'Oof! You really are something special, {hero}.', 'Aduh! Kamu memang istimewa, {hero}.'],
      ['item', 'n', 'The fog melts away, and the rice fields glow gold in the sun.', 'Kabus cair, dan sawah padi bersinar keemasan di bawah matahari.', '🌾'],
      ['crowd', 'x:👩‍🌾:Farmers:Para peladang', 'Hooray! We can see again! Thank you, brave knight!', 'Hore! Kami boleh nampak semula! Terima kasih, kesatria berani!', '👩‍🌾'],
      ['vfix', 'o', 'First lesson: "I am brave." Look up! The first Future Star is shining!', 'Pelajaran pertama: "Saya berani." Lihat ke atas! Bintang Masa Depan pertama sedang bersinar!'],
      ['vnext', 'n', 'Far away, a little monkey watches from a tree. Then it scampers off toward {next}.', 'Jauh di sana, seekor monyet kecil memerhati dari pokok. Kemudian ia berlari ke arah {next}.']
    ]
  },
  1: {
    c: [
      ['wide', 'n', 'With one star shining, {hero} walks into Durian Grove. Mmm, it smells strong!', 'Dengan satu bintang bersinar, {hero} berjalan masuk ke Dusun Durian. Mmm, baunya kuat!'],
      ['prob', 'n', 'But every fruit basket is empty. Someone took all the fruit!', 'Tetapi setiap bakul buah kosong. Ada yang mengambil semua buah!', '🧺'],
      ['crowd', 'x:👨‍👩‍👧:Villagers:Penduduk kampung', 'Who did this? It was the bats! No, the wind! No, it was YOU!', 'Siapa buat ini? Kelawar! Bukan, angin! Bukan, KAMU!', '👨‍👩‍👧'],
      ['close', 'h', 'Wait! I should fight the thief! Where is it?', 'Tunggu! Saya patut lawan pencuri itu! Di mana dia?', '⚔️'],
      ['owl', 'o', 'Hold on. A good knight does not only fight. A good knight also listens.', 'Sabar. Kesatria yang baik bukan sahaja berlawan. Kesatria yang baik juga mendengar.'],
      ['talk', 'x:👴:Tok Mat:Tok Mat', 'Thank you for listening, young one. This grove was always shared. We just want that back.', 'Terima kasih kerana mendengar, anak muda. Dusun ini selalu dikongsi. Kami cuma mahu itu kembali.'],
      ['item', 'n', 'In the mud, {hero} spots small footprints. They look like... monkey feet?', 'Di dalam lumpur, {hero} ternampak tapak kaki kecil. Macam... tapak kaki monyet?', '🐾'],
      ['foe', 'm', 'Roll! Roll! Spiky and prickly!', 'Golek! Golek! Berduri dan tajam!'],
      ['clash', 'n', 'Prickly monsters roll down from the durian trees! {hero} jumps out of the way. Boing!', 'Raksasa berduri bergolek turun dari pokok durian! {hero} melompat ke tepi. Boing!'],
      ['win', 'n', 'Together, everyone gathers new fruit. And a second mark appears on the shield: a little ear!', 'Bersama-sama, semua orang mengumpul buah baharu. Dan tanda kedua muncul pada perisai: sebuah telinga kecil!']
    ],
    b: [
      ['lair', 'n', 'The oldest durian tree creaks in the wind. Something is hiding up there.', 'Pokok durian paling tua berkeriut ditiup angin. Ada sesuatu bersembunyi di atas sana.'],
      ['reveal', 'b', 'MINE! All mine! Nobody EVER shares with me!', 'AKU punya! Semua aku punya! Tiada siapa PERNAH berkongsi dengan aku!'],
      ['talk', 'x:👴:Tok Mat:Tok Mat', 'Hmm... nobody shares with it? That is sad, really.', 'Hmm... tiada siapa berkongsi dengannya? Kasihan, sebenarnya.'],
      ['owl', 'o', 'Listen to what it really means. Then do your best.', 'Dengar apa maksud sebenarnya. Kemudian buat yang terbaik.'],
      ['ready', 'h', 'I hear you, {boss}. Let us settle this, and then let us share!', 'Saya dengar kamu, {boss}. Mari selesaikan ini, kemudian kita berkongsi!']
    ],
    v: [
      ['vbeat', 'b', 'You... you heard me? Nobody ever listens to me...', 'Kamu... kamu dengar aku? Tiada siapa pernah dengar aku...'],
      ['item', 'n', '{hero} shares the very first mango with {boss}. Chomp! Its eyes go wide with joy.', '{hero} berkongsi mangga pertama dengan {boss}. Ngap! Matanya terbeliak gembira.', '🥭'],
      ['crowd', 'x:👨‍👩‍👧:Villagers:Penduduk kampung', 'Fruit for everyone! Ha ha ha!', 'Buah untuk semua! Ha ha ha!', '🥭'],
      ['vfix', 'o', 'Second lesson: "I am a good listener." Two Future Stars shine!', 'Pelajaran kedua: "Saya pendengar yang baik." Dua Bintang Masa Depan bersinar!'],
      ['vnext', 'n', 'The monkey footprints lead on, out of the grove, toward {next}.', 'Tapak kaki monyet terus menuju keluar dari dusun, ke arah {next}.']
    ]
  },
  2: {
    c: [
      ['wide', 'n', 'Two stars! {hero} follows the footprints to Turtle Beach. Waves go swish, swoosh.', 'Dua bintang! {hero} mengikut tapak kaki ke Pantai Penyu. Ombak berbunyi sus, sus.'],
      ['prob', 'n', 'Oh no. Rubbish blocks the way to the sea. Bottles, bags and old nets everywhere!', 'Alamak. Sampah menghalang jalan ke laut. Botol, beg dan jaring lama di mana-mana!', '🗑️'],
      ['talk', 'x:🐢:Baby Turtle:Anak Penyu', 'Mama said to swim to the sea tonight. But I cannot climb over all this!', 'Mak suruh berenang ke laut malam ini. Tetapi saya tidak boleh panjat semua ini!'],
      ['close', 'h', 'There is SO much rubbish. I will never finish!', 'BANYAKNYA sampah. Saya tidak akan habiskan!', '😩'],
      ['owl', 'o', 'Big changes start with small, careful steps. One piece at a time.', 'Perubahan besar bermula dengan langkah kecil yang berhati-hati. Satu demi satu.'],
      ['hero', 'n', 'So {hero} picks up one bottle. Then another. Then another. Without giving up.', 'Jadi {hero} mengutip satu botol. Kemudian satu lagi. Dan satu lagi. Tanpa berputus asa.'],
      ['villain', 'x:🐒:A little voice:Satu suara kecil', 'Why bother? It will only get messy again!', 'Buat apa? Nanti kotor lagi!'],
      ['owl', 'o', 'Did you hear that? A little voice, hiding in the trees...', 'Kamu dengar itu? Satu suara kecil, bersembunyi di pokok...'],
      ['foe', 'm', 'Snip! Snap! Our beach! Our mess!', 'Kap! Kup! Pantai kami! Sampah kami!'],
      ['clash', 'n', 'Crabby monsters snap their claws. {hero} stays patient, and keeps going!', 'Raksasa ketam mengetap sepit. {hero} tetap sabar, dan terus berusaha!'],
      ['win', 'n', 'The path is clear! The baby turtles waddle into the waves. A shell mark appears on the shield.', 'Laluan sudah bersih! Anak-anak penyu terkedek-kedek masuk ke ombak. Tanda kulit kerang muncul pada perisai.']
    ],
    b: [
      ['lair', 'n', 'Moonlight shines on the last turtle nests, right next to a mountain of rubbish.', 'Cahaya bulan menyinari sarang penyu terakhir, betul-betul di sebelah timbunan sampah.'],
      ['reveal', 'b', 'Why bother cleaning? It will only get messy again! Raaah!', 'Buat apa bersihkan? Nanti kotor lagi! Raaah!'],
      ['talk', 'x:🐢:Baby Turtle:Anak Penyu', 'My little sister is still in the nest! Please help!', 'Adik saya masih dalam sarang! Tolonglah!'],
      ['owl', 'o', 'Patience is not waiting. Patience is keeping going.', 'Sabar bukan bermaksud menunggu. Sabar bermaksud terus berusaha.'],
      ['ready', 'h', 'Because tomorrow matters. I will not stop now!', 'Kerana hari esok penting. Saya tidak akan berhenti sekarang!']
    ],
    v: [
      ['vbeat', 'b', 'Hmph. You really did not give up. Not even once.', 'Hmph. Kamu betul-betul tidak berputus asa. Langsung tidak.'],
      ['item', 'n', 'The last little turtle pops out of the sand and paddles into the moonlit sea.', 'Penyu kecil terakhir keluar dari pasir dan berenang ke laut yang diterangi bulan.', '🐢'],
      ['crowd', 'x:🐢:Turtles:Penyu-penyu', 'Goodbye! Thank you! We will come back one day!', 'Selamat tinggal! Terima kasih! Kami akan kembali suatu hari nanti!', '🐢'],
      ['vfix', 'o', 'Third lesson: "I can be patient." Three Future Stars shine!', 'Pelajaran ketiga: "Saya boleh bersabar." Tiga Bintang Masa Depan bersinar!'],
      ['vnext', 'n', 'As night falls, tiny lights blink from {next}.', 'Apabila malam tiba, cahaya kecil berkelip dari {next}.']
    ]
  },
  3: {
    c: [
      ['wide', 'n', 'Three stars! {hero} paddles a little wooden boat down Firefly River.', 'Tiga bintang! {hero} mendayung sebuah perahu kayu kecil di Sungai Kelip-Kelip.'],
      ['dark', 'n', 'But the fireflies are hiding. Without their light, the river is dark and scary.', 'Tetapi kelip-kelip sedang bersembunyi. Tanpa cahaya mereka, sungai gelap dan menakutkan.', '🛶'],
      ['close', 'h', 'I... I do not like the dark. What if something grabs the boat?', 'Saya... saya tidak suka gelap. Bagaimana kalau ada yang tarik perahu?', '😨'],
      ['owl', 'o', 'Being brave does not mean you are never scared. It means you keep going.', 'Berani bukan bermakna kamu tidak pernah takut. Ia bermakna kamu terus melangkah.'],
      ['hero', 'n', '{hero} takes a deep breath... in... out... and paddles on.', '{hero} menarik nafas dalam-dalam... masuk... keluar... dan terus mendayung.'],
      ['talk', 'x:✨:Tiny Firefly:Kelip-kelip Kecil', 'P-psst! We are scared too. Something keeps blowing our lights out!', 'P-psst! Kami pun takut. Ada sesuatu yang asyik meniup cahaya kami!'],
      ['foe', 'm', 'SPLOOSH! Lights out! Lights out!', 'CEBUR! Padam! Padam!'],
      ['clash', 'n', 'Shadowy monsters splash out of the dark water! The boat rocks, but {hero} holds on!', 'Raksasa bayang memercik keluar dari air gelap! Perahu bergoyang, tetapi {hero} berpaut kuat!'],
      ['win', 'n', 'Blink... blink... blink! The fireflies come back, one by one.', 'Kelip... kelip... kelip! Kelip-kelip kembali, satu demi satu.'],
      ['item', 'n', 'A glowing firefly mark appears on the shield!', 'Tanda kelip-kelip yang bercahaya muncul pada perisai!', '✨']
    ],
    b: [
      ['lair', 'n', 'A huge mangrove tree hangs low over the river. Its roots look like giant fingers.', 'Sebatang pokok bakau besar menjuntai rendah di atas sungai. Akarnya seperti jari gergasi.'],
      ['reveal', 'b', 'Fwoooo! Lights out! Everything stays DARK forever!', 'Fuuuu! Padam! Semuanya kekal GELAP selama-lamanya!'],
      ['talk', 'x:✨:Tiny Firefly:Kelip-kelip Kecil', 'Do not let it blow us out again! Please!', 'Jangan biar ia tiup kami lagi! Tolonglah!'],
      ['owl', 'o', 'Your light is inside you. Nobody can blow that out.', 'Cahaya kamu ada di dalam diri kamu. Tiada siapa boleh memadamkannya.'],
      ['ready', 'h', 'I am scared... and I am going anyway!', 'Saya takut... dan saya tetap akan pergi!']
    ],
    v: [
      ['vbeat', 'b', 'Your light... is too bright! I give up!', 'Cahaya kamu... terlalu terang! Aku mengalah!'],
      ['item', 'n', 'Thousands of fireflies rise from the trees. The river sparkles like a sky full of stars.', 'Beribu-ribu kelip-kelip naik dari pokok. Sungai berkilau seperti langit penuh bintang.', '✨'],
      ['crowd', 'x:✨:Fireflies:Kelip-kelip', 'Blink, blink! You are the bravest knight ever!', 'Kelip, kelip! Kamu kesatria paling berani!', '✨'],
      ['vfix', 'o', 'Fourth lesson: "I can face my fears." Four Future Stars shine!', 'Pelajaran keempat: "Saya boleh menghadapi ketakutan saya." Empat Bintang Masa Depan bersinar!'],
      ['vnext', 'n', 'On the riverbank sits the little monkey, all alone. It runs off toward {next}.', 'Di tebing sungai duduk monyet kecil itu, seorang diri. Ia berlari ke arah {next}.']
    ]
  },
  4: {
    c: [
      ['wide', 'n', 'Halfway there! Four stars light {hero}\'s way to Orchid Hills.', 'Separuh jalan! Empat bintang menerangi jalan {hero} ke Bukit Orkid.'],
      ['prob', 'n', 'But the orchids have turned grey. Every single flower droops.', 'Tetapi orkid-orkid sudah menjadi kelabu. Setiap kuntum bunga layu.', '🩶'],
      ['villain', 'v', 'Sniff... I am Momo. I took the colours. And the fruit. And the fireflies\' light.', 'Sedu... Saya Momo. Saya ambil warna-warna. Dan buah. Dan cahaya kelip-kelip.', 'sad'],
      ['close', 'h', 'Momo! But... why?', 'Momo! Tetapi... kenapa?', '❓'],
      ['villain', 'v', 'Nobody ever wanted me around. So why should tomorrow be bright for anyone?', 'Tiada siapa pernah mahu saya ada. Jadi kenapa hari esok perlu cerah untuk sesiapa?', 'sad'],
      ['talk', 'h', 'I was alone too, Momo. But I learned I can change things. So can you.', 'Saya pun dulu seorang diri, Momo. Tetapi saya belajar yang saya boleh mengubah keadaan. Kamu pun boleh.'],
      ['owl', 'o', 'Hoo... being kind to someone who was unkind. That is the hardest kindness of all.', 'Hu... berbuat baik kepada yang pernah tidak baik. Itulah kebaikan yang paling sukar.'],
      ['foe', 'm', 'Momo is grumpy! So WE are grumpy! CHARGE!', 'Momo merajuk! Jadi KAMI pun merajuk! SERBU!'],
      ['clash', 'n', 'Momo\'s grumpy monsters do not want to listen. {hero} holds them back, gently but firmly!', 'Raksasa merajuk Momo tidak mahu mendengar. {hero} menahan mereka, dengan lembut tetapi tegas!'],
      ['win', 'n', 'Pink, purple, white! The orchids bloom again...', 'Merah jambu, ungu, putih! Orkid mekar semula...'],
      ['villain', 'v', '...and Momo smiles. Just a little bit.', '...dan Momo tersenyum. Sedikit sahaja.', 'happy']
    ],
    b: [
      ['lair', 'n', 'At the top of the hill, a giant orchid is wrapped in thorny grey vines.', 'Di puncak bukit, sekuntum orkid gergasi dibalut sulur kelabu berduri.'],
      ['reveal', 'b', 'Hissss! Momo says tomorrow is GREY!', 'Hissss! Momo kata hari esok KELABU!'],
      ['villain', 'v', 'Maybe... maybe I was wrong. Be careful, {hero}!', 'Mungkin... mungkin saya silap. Hati-hati, {hero}!', 'sad'],
      ['owl', 'o', 'Kindness is strong. Show it.', 'Kebaikan itu kuat. Tunjukkannya.'],
      ['ready', 'h', 'Watch, Momo. Tomorrow can be beautiful!', 'Tengok, Momo. Hari esok boleh jadi indah!']
    ],
    v: [
      ['vbeat', 'b', 'The vines... let go... so many colours...', 'Sulur... terlepas... banyaknya warna...'],
      ['item', 'n', 'The giant orchid opens, wide and bright, purple as a sunset.', 'Orkid gergasi itu mekar, luas dan terang, ungu seperti senja.', '🌺'],
      ['vfix', 'o', 'Fifth lesson: "I can be kind, even to someone who was unkind." Five Future Stars shine!', 'Pelajaran kelima: "Saya boleh berbuat baik, walaupun kepada yang pernah tidak baik." Lima Bintang Masa Depan bersinar!'],
      ['villain', 'v', 'Um... can I come with you to {next}? I am good at climbing trees!', 'Erm... boleh saya ikut kamu ke {next}? Saya pandai memanjat pokok!', 'happy'],
      ['crowd', 'h', 'Of course, Momo! Jump on!', 'Tentu sekali, Momo! Naiklah!', '🐒'],
      ['vnext', 'n', 'Momo hops onto {hero}\'s shoulder. The lone knight is not so alone now.', 'Momo melompat ke atas bahu {hero}. Kesatria seorang diri itu tidak lagi keseorangan.']
    ]
  },
  5: {
    c: [
      ['wide', 'n', 'Five stars! {hero}, Hoot and Momo march into the deep, green rainforest.', 'Lima bintang! {hero}, Hoot dan Momo berarak masuk ke hutan hujan yang hijau dan tebal.'],
      ['villain', 'v', 'Ooh! Bananas! Wait, no, that is a caterpillar. Eww!', 'Ooh! Pisang! Eh, bukan, itu ulat. Eee!', 'happy'],
      ['prob', 'n', 'Then the mist rolls in. The path disappears. Which way now?', 'Kemudian kabus datang. Laluan hilang. Ke mana sekarang?', '🌫️'],
      ['close', 'h', 'Left? Right? I have no idea!', 'Kiri? Kanan? Saya tidak tahu langsung!', '😵'],
      ['owl', 'o', 'When you are lost, stop and think. Look for clues.', 'Bila kamu sesat, berhenti dan fikir. Cari petunjuk.'],
      ['item', 'n', '{hero} looks closely. Broken twigs... and a bright red feather!', '{hero} melihat dengan teliti. Ranting patah... dan sehelai bulu merah terang!', '🪶'],
      ['hero', 'h', 'Someone went this way! Follow the clues!', 'Ada yang lalu di sini! Ikut petunjuk!'],
      ['foe', 'm', 'Swiiing! We are the vine monsters!', 'Hayuuun! Kami raksasa sulur!'],
      ['clash', 'n', 'Vine monsters swing down from the trees! {hero} thinks fast and dodges!', 'Raksasa sulur berayun turun dari pokok! {hero} berfikir pantas dan mengelak!'],
      ['win', 'n', 'The mist lifts. Colourful birds sing, and a feather mark appears on the shield!', 'Kabus terangkat. Burung berwarna-warni menyanyi, dan tanda bulu muncul pada perisai!']
    ],
    b: [
      ['lair', 'n', 'The tallest tree in the forest blocks the path. It is as tall as ten houses.', 'Pokok paling tinggi di hutan menghalang laluan. Tingginya seperti sepuluh buah rumah.'],
      ['reveal', 'b', 'Ha! You will NEVER find your way out of my forest!', 'Ha! Kamu TIDAK AKAN jumpa jalan keluar dari hutan aku!'],
      ['villain', 'v', 'Ha yourself! My friend {hero} always finds a way!', 'Ha juga! Kawan saya {hero} sentiasa jumpa jalan!', 'happy'],
      ['owl', 'o', 'Think it through, one clue at a time.', 'Fikir baik-baik, satu petunjuk pada satu masa.'],
      ['ready', 'h', 'Thinking cap on. Let us go!', 'Pakai topi berfikir. Mari!']
    ],
    v: [
      ['vbeat', 'b', 'You found the way... by THINKING? Clever, clever knight.', 'Kamu jumpa jalan... dengan BERFIKIR? Bijaknya kesatria ini.'],
      ['item', 'n', 'Whoosh! Great hornbills fly overhead and show the way out.', 'Wusy! Burung enggang terbang di atas dan menunjukkan jalan keluar.', '🦜'],
      ['crowd', 'x:🦜:Hornbills:Burung enggang', 'Follow us! This way, this way!', 'Ikut kami! Ke sini, ke sini!', '🦜'],
      ['vfix', 'o', 'Sixth lesson: "I can think my way through." Six Future Stars shine.', 'Pelajaran keenam: "Saya boleh berfikir untuk mencari jalan." Enam Bintang Masa Depan bersinar.'],
      ['vnext', 'n', 'The sound of rushing water comes from {next}. Splash!', 'Bunyi air deras datang dari {next}. Cebur!']
    ]
  },
  6: {
    c: [
      ['wide', 'n', 'Six stars! {hero} reaches a roaring waterfall. ROOOAR goes the water!', 'Enam bintang! {hero} tiba di air terjun yang bergemuruh. GRUUUH bunyi airnya!'],
      ['prob', 'n', 'But big rocks have blocked the stream. The village below has no water!', 'Tetapi batu-batu besar menyekat anak sungai. Kampung di bawah tiada air!', '🪨'],
      ['talk', 'x:👦:Village Boy Ali:Ali Budak Kampung', 'Our well is empty! We need that water!', 'Perigi kami kosong! Kami perlukan air itu!'],
      ['hero', 'n', '{hero} pushes the biggest rock. Hnnnngh! It does not move at all.', '{hero} menolak batu paling besar. Hnnnngh! Ia langsung tidak bergerak.'],
      ['close', 'h', 'It is too heavy... I cannot do it alone.', 'Ia terlalu berat... saya tidak boleh buat seorang diri.', '😓'],
      ['owl', 'o', 'Some jobs are too heavy for one. That is what friends are for.', 'Sesetengah kerja terlalu berat untuk seorang. Untuk itulah ada kawan.'],
      ['crowd', 'h', 'Everyone! Will you help me? Please!', 'Semua! Boleh tolong saya? Tolonglah!', '👦'],
      ['villain', 'v', 'Momo is here! I will push with my tail!', 'Momo ada! Saya akan tolak dengan ekor saya!', 'happy'],
      ['foe', 'm', 'Rumble, rumble! Rocks rule!', 'Gruh, gruh! Batu berkuasa!'],
      ['clash', 'n', 'Rocky monsters roll out of the cave. But with friends, {hero} is unstoppable!', 'Raksasa batu bergolek keluar dari gua. Tetapi dengan kawan-kawan, {hero} tidak dapat dihalang!'],
      ['win', 'n', 'One, two, three, PUSH! The rocks roll away, and fresh water splashes down!', 'Satu, dua, tiga, TOLAK! Batu bergolek pergi, dan air segar memercik turun!']
    ],
    b: [
      ['lair', 'n', 'Behind the waterfall hides a secret cave. Drip... drip... drip.', 'Di sebalik air terjun tersembunyi sebuah gua rahsia. Titik... titik... titik.'],
      ['reveal', 'b', 'Nobody moves MY rock! Not one person. Not even ten!', 'Tiada siapa boleh alihkan batu AKU! Seorang pun tidak. Sepuluh orang pun tidak!'],
      ['villain', 'v', 'How about ALL of us? Together we are strong!', 'Bagaimana dengan KAMI SEMUA? Bersama kita kuat!', 'happy'],
      ['owl', 'o', 'Asking for help is not weak. It is wise.', 'Meminta bantuan bukan lemah. Ia bijak.'],
      ['ready', 'h', 'Team, are you ready? Let us go!', 'Pasukan, sudah sedia? Mari!']
    ],
    v: [
      ['vbeat', 'b', 'You... all worked TOGETHER? No fair! That is too strong!', 'Kamu... semua bekerjasama? Tak adil! Itu terlalu kuat!'],
      ['item', 'n', 'Splash! The stream flows again, all the way to the village well.', 'Cebur! Anak sungai mengalir semula, sampai ke perigi kampung.', '💧'],
      ['crowd', 'x:👦:Villagers:Penduduk kampung', 'Water! Fresh water! Thank you, friends!', 'Air! Air segar! Terima kasih, kawan-kawan!', '👦'],
      ['vfix', 'o', 'Seventh lesson: "It is okay to ask for help." Look at the shield: a hand mark! Seven Future Stars!', 'Pelajaran ketujuh: "Tidak apa meminta bantuan." Lihat perisai itu: tanda tangan! Tujuh Bintang Masa Depan!'],
      ['vnext', 'n', 'The stream winds toward the twisty roots of {next}.', 'Anak sungai berliku menuju akar-akar berselirat di {next}.']
    ]
  },
  7: {
    c: [
      ['wide', 'n', 'Seven stars! {hero} steps into the Mangrove Maze. Roots twist every way!', 'Tujuh bintang! {hero} melangkah masuk ke Paya Bakau. Akar berselirat ke semua arah!'],
      ['villain', 'v', 'Ooh, a shortcut! Follow me! ...Wait... where am I?', 'Ooh, jalan pintas! Ikut saya! ...Eh... di mana saya?'],
      ['prob', 'n', 'Momo took a wrong turn. Now Momo is lost in the maze!', 'Momo tersalah jalan. Sekarang Momo sesat dalam paya!', '🔀'],
      ['close', 'h', 'Momo! MOMO! Where are you?', 'Momo! MOMO! Kamu di mana?', '😟'],
      ['owl', 'o', 'Hoo... a true friend comes back for you.', 'Hu... kawan sejati akan kembali untuk kamu.'],
      ['dark', 'n', 'Somewhere deep in the maze, a small voice cries, "Help..."', 'Di suatu tempat jauh dalam paya, satu suara kecil menangis, "Tolong..."'],
      ['hero', 'h', 'I will never leave a friend behind. Hold on, Momo!', 'Saya tidak akan tinggalkan kawan. Tunggu, Momo!'],
      ['foe', 'm', 'Blub blub! Mud for you!', 'Blub blub! Lumpur untuk kamu!'],
      ['clash', 'n', 'Muddy monsters bubble up from the swamp. {hero} fights through, root by root!', 'Raksasa lumpur menggelegak dari paya. {hero} berlawan menembusi, akar demi akar!'],
      ['villain', 'v', '{hero}! You came for me! You really came!', '{hero}! Kamu datang untuk saya! Kamu betul-betul datang!', 'happy'],
      ['win', 'n', 'The two friends hug. And a heart mark appears on the shield!', 'Dua sahabat itu berpelukan. Dan tanda hati muncul pada perisai!']
    ],
    b: [
      ['lair', 'n', 'In the middle of the maze lies an old wooden boat, half sunk in mud.', 'Di tengah-tengah paya terletak sebuah perahu kayu lama, separuh tenggelam dalam lumpur.'],
      ['reveal', 'b', 'Gloop! Friends always leave in the end! ALWAYS!', 'Glup! Kawan-kawan selalu pergi akhirnya! SELALU!'],
      ['villain', 'v', 'That is what I used to think...', 'Itulah yang saya fikir dulu...', 'sad'],
      ['owl', 'o', 'Show it what a loyal friend looks like.', 'Tunjukkan kepadanya rupa kawan yang setia.'],
      ['ready', 'h', 'Not this friend. Hold my hand, Momo. Let us go!', 'Bukan kawan ini. Pegang tangan saya, Momo. Mari!']
    ],
    v: [
      ['vbeat', 'b', 'You stayed... together... Hmph. Maybe some friends DO stay.', 'Kamu kekal... bersama... Hmph. Mungkin ada kawan yang memang kekal.'],
      ['item', 'n', 'Momo draws a map of the maze with a stick, so nobody ever gets lost again.', 'Momo melukis peta paya dengan sebatang kayu, supaya tiada siapa sesat lagi.', '🗺️'],
      ['villain', 'v', 'Look! I drew YOU too, {hero}. With a big cape!', 'Lihat! Saya lukis KAMU juga, {hero}. Dengan jubah besar!', 'happy'],
      ['vfix', 'o', 'Eighth lesson: "I am a loyal friend." Eight Future Stars shine.', 'Pelajaran kelapan: "Saya kawan yang setia." Lapan Bintang Masa Depan bersinar.'],
      ['vnext', 'n', 'Cold air blows from the green hills of {next}. Brrr!', 'Udara sejuk bertiup dari bukit-bukit hijau di {next}. Brrr!']
    ]
  },
  8: {
    c: [
      ['wide', 'n', 'Eight stars! The road climbs up, up, up to the cool Tea Hills.', 'Lapan bintang! Jalan mendaki naik, naik, naik ke Bukit Teh yang sejuk.'],
      ['prob', 'n', 'Frost covers the tea bushes and the strawberries. Everything is cold and white.', 'Fros menutupi pokok teh dan strawberi. Semuanya sejuk dan putih.', '🥶'],
      ['talk', 'x:👨‍🌾:Farmer Lim:Peladang Lim', 'It is no use. Nothing grows. We are giving up and going home.', 'Tiada gunanya. Tiada apa yang tumbuh. Kami berputus asa dan pulang.'],
      ['owl', 'o', 'When others lose hope, a hero shares some of theirs.', 'Apabila orang lain hilang harapan, wira berkongsi sedikit harapannya.'],
      ['item', 'h', 'Look at my shield. When I started, it was empty. Now it is full!', 'Lihat perisai saya. Bila saya mula, ia kosong. Sekarang ia penuh!', '🛡️'],
      ['crowd', 'h', 'If I could change, this place can change too! Do not give up!', 'Kalau saya boleh berubah, tempat ini pun boleh berubah! Jangan berputus asa!', '👨‍🌾'],
      ['villain', 'v', 'It is true! I was grumpy for SO long. Now look at me!', 'Betul! Saya merajuk BEGITU lama. Sekarang tengoklah saya!', 'happy'],
      ['foe', 'm', 'Brrr! Freeze! Give up! Give up!', 'Brrr! Beku! Mengalah! Mengalah!'],
      ['clash', 'n', 'Icy monsters slide down the slopes! {hero} stands strong in the cold!', 'Raksasa ais menggelongsor turun cerun! {hero} berdiri teguh dalam kesejukan!'],
      ['win', 'n', 'The sun warms the hills. Red strawberries peek out, and a sun mark appears on the shield!', 'Matahari memanaskan bukit. Strawberi merah mengintai keluar, dan tanda matahari muncul pada perisai!']
    ],
    b: [
      ['lair', 'n', 'The old tea factory stands silent, covered in frost.', 'Kilang teh lama berdiri sunyi, diselaputi fros.'],
      ['reveal', 'b', 'Hoooo! Give up! Nothing EVER gets better!', 'Huuuu! Mengalahlah! Tiada apa PERNAH menjadi lebih baik!'],
      ['villain', 'v', 'That is what I used to say. It is NOT true!', 'Itulah yang saya selalu cakap dulu. Ia TIDAK betul!', 'happy'],
      ['owl', 'o', 'Hope is like sunshine. Share it, and it grows.', 'Harapan seperti cahaya matahari. Kongsikan, dan ia bertambah.'],
      ['ready', 'h', 'Things CAN get better. Let me show you!', 'Keadaan BOLEH menjadi lebih baik. Mari saya tunjukkan!']
    ],
    v: [
      ['vbeat', 'b', 'Melting... warm... maybe tomorrow IS better...', 'Mencair... hangat... mungkin hari esok MEMANG lebih baik...'],
      ['item', 'n', 'The frost melts away. Tea leaves shine green, and strawberries turn bright red.', 'Fros cair. Daun teh bersinar hijau, dan strawberi menjadi merah terang.', '🍓'],
      ['crowd', 'x:👨‍🌾:Farmers:Para peladang', 'We will stay! We will try again! Thank you!', 'Kami akan tinggal! Kami akan cuba lagi! Terima kasih!', '👨‍🌾'],
      ['vfix', 'o', 'Ninth lesson: "I can give others hope." Nine Future Stars shine!', 'Pelajaran kesembilan: "Saya boleh memberi harapan kepada orang lain." Sembilan Bintang Masa Depan bersinar!'],
      ['vnext', 'n', 'Above the clouds rises the last mountain: {next}. The Star of Tomorrow waits at the top.', 'Di atas awan menjulang gunung terakhir: {next}. Bintang Hari Esok menanti di puncak.']
    ]
  },
  9: {
    c: [
      ['wide', 'n', 'Nine stars! Step by step, {hero} climbs the very last mountain.', 'Sembilan bintang! Langkah demi langkah, {hero} mendaki gunung yang terakhir.'],
      ['prob', 'n', 'At the top, a thick cloud hides the Star of Tomorrow. It is almost out!', 'Di puncak, awan tebal menyembunyikan Bintang Hari Esok. Ia hampir padam!', '🌫️'],
      ['villain', 'v', 'Oh no... this cloud grew from all my grumpy wishes. It is my fault. I am so sorry.', 'Alamak... awan ini tumbuh daripada semua hajat merajuk saya. Salah saya. Saya minta maaf.', 'sad'],
      ['talk', 'h', 'Momo, you are not the same Momo any more. And neither am I.', 'Momo, kamu bukan Momo yang dulu lagi. Dan saya pun bukan.'],
      ['foe', 'm', 'ROAAAR! No tomorrow! No tomorrow!', 'NGAUUUM! Tiada hari esok! Tiada hari esok!'],
      ['clash', 'n', 'The cloud twists into the biggest monsters yet. {hero} fights with all their heart!', 'Awan itu berpusing menjadi raksasa paling besar. {hero} berlawan dengan sepenuh hati!'],
      ['item', 'n', '{hero} lifts the shield high. It is full of marks now: everything {hero} has learned.', '{hero} mengangkat perisai tinggi-tinggi. Ia penuh tanda sekarang: semua yang {hero} pelajari.', '🛡️'],
      ['close', 'h', 'I am brave. I listen. I am patient. I face my fears. I am kind. And I am not alone!', 'Saya berani. Saya mendengar. Saya sabar. Saya hadapi ketakutan. Saya baik hati. Dan saya tidak keseorangan!', '✨'],
      ['win', 'n', 'The Star of Tomorrow blazes bright! The whole land below glows with a better future.', 'Bintang Hari Esok menyala terang! Seluruh negeri di bawah bercahaya dengan masa depan yang lebih baik.']
    ],
    b: [
      ['lair', 'n', 'The wind howls at the very top of the mountain. Whoooosh!', 'Angin melolong di puncak gunung. Wuuuusy!'],
      ['reveal', 'b', 'A LONE knight cannot change the future! Turn back!', 'Kesatria SEORANG DIRI tidak boleh mengubah masa depan! Berpatah balik!'],
      ['villain', 'v', '{hero} is not alone any more!', '{hero} tidak lagi keseorangan!', 'happy'],
      ['owl', 'o', 'We are right beside you. All of us.', 'Kami ada di sisi kamu. Kami semua.'],
      ['ready', 'h', 'For tomorrow! Together, let us go!', 'Untuk hari esok! Bersama-sama, mari!']
    ],
    v: [
      ['vbeat', 'b', 'You... are not alone... I see it now...', 'Kamu... tidak keseorangan... Aku nampak sekarang...'],
      ['item', 'n', 'The cloud melts into warm sunshine. The Star of Tomorrow shines brighter than ever.', 'Awan cair menjadi cahaya matahari yang hangat. Bintang Hari Esok bersinar lebih terang daripada sebelumnya.', '🌞'],
      ['vfix', 'o', 'Tenth lesson: "I know who I am, and I can make tomorrow better."', 'Pelajaran kesepuluh: "Saya tahu siapa diri saya, dan saya boleh menjadikan hari esok lebih baik."'],
      ['crowd', 'x:🐒:All your friends:Semua kawan kamu', 'Hooray for {hero}! Hooray for tomorrow!', 'Hore untuk {hero}! Hore untuk hari esok!', '🧑'],
      ['finale', 'v', 'All ten Future Stars are shining. The lone knight found a family of friends. That is us!', 'Kesemua sepuluh Bintang Masa Depan bersinar. Kesatria seorang diri itu menemui keluarga sahabat. Itulah kita!', 'happy']
    ]
  }
};
