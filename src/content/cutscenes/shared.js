/* v32: story pieces shared by all four ages (format: src/parts/25-v29-cutscenes.js and 29-v32-story.js).
   Every beat is [shot, speaker, English, Malay, prop, options?]. {hero} {pet} {v} (the villain) {z} {next} {boss} {rival} {old} {new} are filled in.
     rival[0..2]   { intro, win }   the three duels with Sir Kilat (levels 25, 50, 75)
     evolve[2|3]   the short film when a pet reaches stage 2 or 3
     subj[id]      { em, p: [[en,ms] x3 (zones 1-3, 4-6, 7-10)], s: [en,ms] }   the beats a subject adds to a chapter
     mini[z]       the three beats of the mini-boss scene at level 5 of each zone
     choice[z]     { who?, q, a, b }   a choice; a / b = { em, t: label, r: result, c: coins }
     cliff[z]      two beats that end a victory story by teasing the next land
     wordsT        Hoot's line that introduces the picture glossary ({w} = the new word, {m} = what it means)
     bossVoice[n]  { intro, rematch, rage, win }   the voice of each of the ten boss kinds (0 dragon ... 9 hydra) */
export default {
  wordsT: [
    'Hoot has a new word for you! “{m}” is “{w}”. Tap a word to hear it!',
    'Hoot ada perkataan baru untuk kamu! “{m}” ialah “{w}”. Sentuh perkataan untuk mendengarnya!'
  ],

  /* ------------------------------ the rival knight ------------------------------ */
  rival: [
    {
      intro: [
        ['chase', 'r', 'Whoosh! Catch me if you can, slowpoke!', 'Wuus! Tangkap saya kalau boleh, lambat!'],
        ['duel', 'r', 'I am {rival}, the fastest knight in the land. Duel me, {hero}!', 'Saya {rival}, kesatria paling pantas di negeri ini. Berduel dengan saya, {hero}!'],
        ['close', 'h', 'A duel? Okay! I will do my very best!', 'Berduel? Baiklah! Saya akan cuba sehabis baik!', '😤'],
        ['owl', 'o', '{rival} is quick, {hero}. Do not rush. Think first, then tap!', '{rival} sangat pantas, {hero}. Jangan tergesa-gesa. Fikir dahulu, kemudian sentuh!'],
        ['duel', 'r', 'Questions from three subjects, one after another. Ready? Go!', 'Soalan daripada tiga subjek, satu demi satu. Sedia? Mula!']
      ],
      win: [
        ['win', 'n', 'The duel is over. {rival} sits down on the grass, puffing and panting.', 'Duel sudah tamat. {rival} duduk di atas rumput, tercungap-cungap.'],
        ['close', 'r', 'You are quick AND clever. I lost fair and square.', 'Kamu pantas DAN bijak. Saya kalah dengan adil.', '😮'],
        ['hero', 'h', 'That was fun! Let us duel again one day!', 'Seronok betul! Mari berduel lagi suatu hari nanti!'],
        ['campfire', 'r', 'Hmph. I will train harder. You will see me again, {hero}!', 'Hmph. Saya akan berlatih lebih keras. Kita akan bertemu lagi, {hero}!']
      ]
    },
    {
      intro: [
        ['rain', 'n', 'Rain drums on the road. Someone is waiting in the middle of it.', 'Hujan menimpa jalan. Seseorang menunggu di tengahnya.', 'storm'],
        ['duel', 'r', 'I trained all night, {hero}. This time I will not lose!', 'Saya berlatih sepanjang malam, {hero}. Kali ini saya tidak akan kalah!'],
        ['close', 'h', 'You look different. Your armour is dark now.', 'Kamu nampak lain. Baju besi kamu gelap sekarang.', '😟'],
        ['dark', 'r', '{v} gave me a gift. A little shadow power. It makes me FAST!', '{v} memberi saya hadiah. Sedikit kuasa bayang. Ia menjadikan saya PANTAS!', 'red'],
        ['owl', 'o', 'Be careful, {hero}. That power is not his own. But you can still win by thinking!', 'Hati-hati, {hero}. Kuasa itu bukan miliknya. Tetapi kamu masih boleh menang dengan berfikir!'],
        ['duel', 'r', 'Come on! Show me what you have got!', 'Mari! Tunjukkan apa yang kamu ada!']
      ],
      win: [
        ['win', 'n', 'The shadow cracks and fades from the armour. {rival} falls to his knees in the rain.', 'Bayang itu retak dan hilang daripada baju besi. {rival} melutut dalam hujan.'],
        ['close', 'r', 'It is gone... I feel light again. I think I made a big mistake.', 'Ia sudah hilang... Saya rasa ringan semula. Saya rasa saya telah buat kesilapan besar.', '😔'],
        ['hero', 'h', 'Everybody makes mistakes. You can always start again!', 'Semua orang buat silap. Kamu boleh mula semula pada bila-bila masa!'],
        ['campfire', 'r', 'Thank you, {hero}. I will not take shadow gifts again. Next time, I fight with my own heart!', 'Terima kasih, {hero}. Saya tidak akan menerima hadiah bayang lagi. Lain kali, saya berlawan dengan hati saya sendiri!']
      ]
    },
    {
      intro: [
        ['wide', 'n', 'A golden dawn. {rival} stands on a hill, with a shining crown on his helmet.', 'Fajar keemasan. {rival} berdiri di atas bukit, dengan mahkota bersinar di topi besinya.'],
        ['duel', 'r', 'No shadows this time, {hero}. Only me. One last duel between friends!', 'Tiada bayang kali ini, {hero}. Hanya saya. Satu duel terakhir antara sahabat!'],
        ['close', 'h', 'Yes! Friends! Let us do our best!', 'Ya! Sahabat! Mari kita cuba sehabis baik!', '🤩'],
        ['owl', 'o', 'This is the hardest duel of all. Three subjects, many questions. Stay calm!', 'Ini duel paling sukar. Tiga subjek, banyak soalan. Bertenang!'],
        ['duel', 'r', 'Ready? Three... two... one... GO!', 'Sedia? Tiga... dua... satu... MULA!']
      ],
      win: [
        ['win', 'n', 'The golden dawn shines on two knights. Both are smiling.', 'Fajar keemasan menyinari dua orang kesatria. Kedua-duanya tersenyum.'],
        ['close', 'r', 'You are the better knight, {hero}. And the better friend.', 'Kamu kesatria yang lebih baik, {hero}. Dan sahabat yang lebih baik.', '🥹'],
        ['hero', 'h', 'We are both good! Together we are the best!', 'Kita berdua hebat! Bersama kita yang terbaik!'],
        ['campfire', 'r', 'From today I will watch your back. Call me and I will run to you, fast as the wind!', 'Mulai hari ini saya akan menjaga kamu. Panggil saya dan saya akan berlari ke arah kamu, pantas seperti angin!'],
        ['win', 'n', '{rival} is now a true friend of {hero}. The end of one story is the start of a new one!', '{rival} kini sahabat sejati {hero}. Penghujung satu cerita ialah permulaan cerita baru!']
      ]
    }
  ],

  /* ------------------------------ pet evolution ------------------------------ */
  evolve: {
    2: [
      ['evo', 'n', 'Something is happening to {pet}! A soft light begins to shine.', 'Sesuatu berlaku kepada {pet}! Cahaya lembut mula bersinar.', 'glow'],
      ['evo', 'p', 'I feel warm and tingly! What is going on?', 'Saya rasa hangat dan geli! Apa yang berlaku?', 'glow'],
      ['evo', 'o', 'All your hard work made {pet} stronger. It is growing, {hero}!', 'Semua usaha keras kamu menjadikan {pet} lebih kuat. Ia sedang membesar, {hero}!', 'digi'],
      ['evo', 'n', 'Rings of light spin around {pet}. Tiny sparkles float up like stars.', 'Cincin cahaya berputar di sekeliling {pet}. Kilauan kecil terapung ke atas seperti bintang.', 'digi'],
      ['evo', 'n', 'FLASH!', 'KILAT!', 'burst'],
      ['evo', 'p', 'I am {new}! Look how big I am now!', 'Saya {new}! Lihat betapa besarnya saya sekarang!', 'new'],
      ['close', 'h', 'Wow! {old} became {new}! You are amazing!', 'Wah! {old} menjadi {new}! Kamu hebat!', '🤩']
    ],
    3: [
      ['evo', 'n', 'The sky goes quiet. A golden glow rises around {pet}. This is a very special moment!', 'Langit menjadi sunyi. Cahaya keemasan naik di sekeliling {pet}. Ini saat yang sangat istimewa!', 'glow'],
      ['evo', 'p', 'My heart is beating so fast! I can feel big power inside me!', 'Jantung saya berdegup laju! Saya rasa kuasa besar dalam diri saya!', 'glow'],
      ['evo', 'o', 'Every question you answered gave {pet} strength. Now it will reach its final form!', 'Setiap soalan yang kamu jawab memberi kekuatan kepada {pet}. Kini ia akan mencapai bentuk terakhirnya!', 'digi'],
      ['evo', 'n', 'Rings of light spin faster and faster. Numbers and sparks swirl around {old}!', 'Cincin cahaya berputar makin laju. Nombor dan percikan api berpusar di sekeliling {old}!', 'digi'],
      ['evo', 'n', 'BOOM! A burst of golden light fills the whole land!', 'DUM! Letusan cahaya keemasan memenuhi seluruh negeri!', 'ultra'],
      ['evo', 'p', 'I am {new}! Together we can do anything!', 'Saya {new}! Bersama-sama kita boleh buat apa sahaja!', 'new'],
      ['close', 'h', 'You are the strongest {new} ever! Thank you, friend!', '{new} terkuat sepanjang masa! Terima kasih, sahabat!', '🥰']
    ]
  },

  /* ------------------------------ what each subject adds to a chapter ------------------------------ */
  subj: {
    math: { em: '🔢', p: [['Numbers start to hop and count along the path. One, two, three!', 'Nombor mula melompat dan mengira di sepanjang jalan. Satu, dua, tiga!'], ['{v} muddles up the numbers! They need the right answers to line up again.', '{v} mengelirukan nombor! Mereka perlukan jawapan yang betul untuk beratur semula.'], ['A giant number lock blocks the way. Only a clever knight can open it!', 'Sebuah kunci nombor gergasi menghalang jalan. Hanya kesatria bijak boleh membukanya!']], s: ['Counting makes us brave. Count with me!', 'Mengira membuat kita berani. Mari mengira bersama!'] },
    bm: { em: '📖', p: [['Letters float down like leaves. Each one is a sound in Bahasa Malaysia.', 'Huruf melayang turun seperti daun. Setiap satu ialah bunyi dalam Bahasa Malaysia.'], ['{v} tears the words out of the books! The story needs its words back.', '{v} mengoyakkan perkataan daripada buku! Cerita itu mahu perkataannya semula.'], ['A giant book opens and a whole story waits to be read aloud.', 'Sebuah buku gergasi terbuka dan seluruh cerita menunggu untuk dibaca.']], s: ['Read slowly and say each word out loud!', 'Baca perlahan-lahan dan sebut setiap perkataan dengan kuat!'] },
    en: { em: '🔤', p: [['ABC letters dance in a line. A, B, C... can you spot them?', 'Huruf ABC menari berbaris. A, B, C... boleh kamu cari?'], ['{v} hides the vowels! The words sound funny without them.', '{v} menyembunyikan huruf vokal! Perkataan jadi lucu bunyinya tanpa huruf itu.'], ['A talking book speaks in English. Listen carefully and answer!', 'Sebuah buku bercakap dalam bahasa Inggeris. Dengar baik-baik dan jawab!']], s: ['Listen to the sounds, then say them back to me!', 'Dengar bunyinya, kemudian sebut semula kepada saya!'] },
    sc: { em: '🔬', p: [['A tiny seed pops open. Is it a flower or a tree? Let us find out!', 'Sebiji benih kecil merekah. Bunga atau pokok? Mari kita cari tahu!'], ['{v} drains the colours from the plants and the rainbow! We must find out why.', '{v} menyedut warna daripada tumbuhan dan pelangi! Kita mesti cari sebabnya.'], ['Glowing machines hum and bubble. A real science puzzle waits for you!', 'Mesin bercahaya berdengung dan berbuih. Satu teka-teki sains sebenar menanti kamu!']], s: ['Look, wonder and ask “why?”. That is how scientists think!', 'Lihat, hairan dan tanya “kenapa?”. Begitulah saintis berfikir!'] },
    pm: { em: '🤝', p: [['Two friends argue over a toy. What would a kind knight do?', 'Dua orang kawan bergaduh kerana sebuah mainan. Apa yang akan dibuat kesatria yang baik hati?'], ['{v} tells a little fib, and the fib grows bigger and bigger. Truth is brave!', '{v} bercakap bohong sedikit, dan bohong itu makin besar. Jujur itu berani!'], ['A crowd needs help. A good knight shares, listens and tells the truth.', 'Orang ramai perlukan bantuan. Kesatria yang baik berkongsi, mendengar dan bercakap benar.']], s: ['Kind words are the strongest magic of all!', 'Kata-kata baik ialah sihir paling kuat!'] },
    pk: { em: '🇲🇾', p: [['A big flag waves in the wind. Red, white, blue and yellow! It is the Jalur Gemilang.', 'Sebuah bendera besar berkibar ditiup angin. Merah, putih, biru dan kuning! Itulah Jalur Gemilang.'], ['{v} muddles up the maps and the songs! The people need to remember their home.', '{v} mengelirukan peta dan lagu! Rakyat perlu mengingati tanah air mereka.'], ['The whole land gathers together. Many friends, many foods, one Malaysia!', 'Seluruh negeri berkumpul. Ramai kawan, banyak makanan, satu Malaysia!']], s: ['Our land has many friends who help each other. That is real strength!', 'Negara kita ada ramai kawan yang saling membantu. Itulah kekuatan sebenar!'] },
    se: { em: '💛', p: [['A little heart glows yellow. It means “I feel happy”. How do you feel today?', 'Sebuah hati kecil bersinar kuning. Maksudnya “saya rasa gembira”. Apa perasaan kamu hari ini?'], ['{v} is grumpy and sad. Big feelings are okay. Let us breathe in and out together.', '{v} merajuk dan sedih. Perasaan besar tidak mengapa. Mari tarik dan hembus nafas bersama-sama.'], ['A friend feels left out. A kind knight notices and says “come and play”.', 'Seorang kawan rasa tersisih. Kesatria yang baik perasan dan berkata “mari bermain”.']], s: ['All feelings are welcome. Name it, breathe, and feel better!', 'Semua perasaan dialu-alukan. Namakannya, bernafas, dan rasa lebih baik!'] },
    fk: { em: '🏃', p: [['Stretch up high like a tall tree! Then touch your toes. Good morning, body!', 'Regang tinggi seperti pokok yang tinggi! Kemudian sentuh jari kaki. Selamat pagi, badan!'], ['{v} says “stay on the sofa!” But moving makes the heart happy and strong.', '{v} berkata “duduk sahaja di sofa!” Tetapi bergerak menjadikan hati gembira dan kuat.'], ['A great race begins! Run, jump and play, then drink water and rest.', 'Perlumbaan besar bermula! Berlari, melompat dan bermain, kemudian minum air dan berehat.']], s: ['Move a little every day. Fit knights are happy knights!', 'Bergeraklah sedikit setiap hari. Kesatria yang cergas ialah kesatria yang gembira!'] },
    sv: { em: '🎨', p: [['A bucket of paint splashes red, yellow and blue. Mix two of them and see!', 'Sebalang cat memercik merah, kuning dan biru. Campurkan dua warna dan lihat!'], ['{v} turns every picture grey! We must bring the colours back, one by one.', '{v} menjadikan setiap lukisan kelabu! Kita mesti bawa warna kembali, satu demi satu.'], ['A giant blank canvas waits. What will you make? Anything you imagine!', 'Sehelai kanvas kosong yang besar menanti. Apa yang akan kamu cipta? Apa sahaja yang kamu bayangkan!']], s: ['There is no wrong way to draw. Be brave with colour!', 'Tiada cara yang salah untuk melukis. Beranilah dengan warna!'] },
    mz: { em: '🎵', p: [['Pom, pom, pom! A drum beats softly. Clap along to the rhythm!', 'Dum, dum, dum! Gendang berbunyi perlahan. Tepuk tangan mengikut irama!'], ['{v} steals the melodies! The birds forget their songs. We must bring the music home.', '{v} mencuri melodi! Burung lupa lagu mereka. Kita mesti bawa pulang muzik itu.'], ['A whole orchestra waits for a conductor. High notes, low notes, loud and soft!', 'Seluruh orkestra menunggu seorang konduktor. Nada tinggi, nada rendah, kuat dan perlahan!']], s: ['Listen with your ears and your heart. Music is for everyone!', 'Dengar dengan telinga dan hati. Muzik untuk semua orang!'] }
  },

  /* ------------------------------ level 5: the mini boss ------------------------------ */
  mini: [
    [['foe', 'c', 'Halt! I am the guard of this path. Nobody passes without a challenge!', 'Berhenti! Saya pengawal jalan ini. Tiada siapa lalu tanpa cabaran!'], ['hero', 'h', 'A challenge? Okay! I am not scared!', 'Cabaran? Baiklah! Saya tidak takut!'], ['clash', 'n', 'The little guard puffs up his chest. “Mini boss” is written on his belt!', 'Pengawal kecil itu mengembungkan dadanya. “Bos mini” tertulis pada tali pinggangnya!']],
    [['talk', 'c', 'Psst! I am just a mini boss. Small, but VERY mighty!', 'Psst! Saya hanya bos mini. Kecil, tetapi SANGAT hebat!'], ['owl', 'o', 'Do not be fooled by his size, {hero}. Think before you tap!', 'Jangan tertipu dengan saiznya, {hero}. Fikir dahulu sebelum menyentuh!'], ['foe', 'c', 'Hee hee! Let us see how clever you are!', 'Hi hi! Mari kita lihat betapa bijaknya kamu!']],
    [['dark', 'n', 'A shadow darts across the path. Something quick is hiding behind the trees.', 'Satu bayang meluru melintasi jalan. Sesuatu yang pantas bersembunyi di sebalik pokok.'], ['foe', 'c', 'Surprise! You cannot see me, but I can see you!', 'Kejutan! Kamu tidak nampak saya, tetapi saya nampak kamu!'], ['hero', 'h', 'Come out and play fair!', 'Keluarlah dan bermain dengan adil!']],
    [['chase', 'c', 'Catch me if you can! Nyah nyah!', 'Tangkap saya kalau boleh! Nyah nyah!', '💨'], ['close', 'h', 'Wait for me! I will answer all your questions!', 'Tunggu saya! Saya akan jawab semua soalan kamu!', '😆'], ['foe', 'c', 'Okay, okay. You may try!', 'Baiklah, baiklah. Kamu boleh cuba!']],
    [['wide', 'n', 'The path is blocked by a big, grumpy monster with a very small crown.', 'Jalan dihalang oleh raksasa besar yang merajuk dengan mahkota yang sangat kecil.'], ['foe', 'c', 'Bow to me! I am the Mini King of this land!', 'Tunduk kepada saya! Saya Raja Mini negeri ini!'], ['owl', 'o', 'Kings who are kind do not need to shout. Show him how it is done!', 'Raja yang baik hati tidak perlu menjerit. Tunjukkan caranya kepadanya!']],
    [['rain', 'n', 'Splish, splash! A little puddle monster jumps out and drenches {hero}.', 'Splish, splash! Seekor raksasa lopak kecil melompat keluar dan membasahkan {hero}.', 'storm'], ['foe', 'c', 'Hee hee, you are all wet! Now answer my puzzle!', 'Hi hi, kamu basah kuyup! Sekarang jawab teka-teki saya!'], ['hero', 'h', 'Brrr! I will dry off and beat you!', 'Brrr! Saya akan keringkan badan dan kalahkan kamu!']],
    [['campfire', 'n', 'A tiny campfire crackles. A small monster tends it, looking sleepy.', 'Unggun api kecil meletup-letup. Seekor raksasa kecil menjaganya, kelihatan mengantuk.'], ['foe', 'c', 'Yawn... no one gets past before I finish my tea. And I am a slow drinker!', 'Menguap... tiada siapa lalu sebelum saya habis minum teh. Dan saya minum perlahan!'], ['owl', 'o', 'Let us be quick and kind. We will answer his questions and be on our way!', 'Mari kita cepat dan berbudi bahasa. Kita jawab soalannya dan terus bergerak!']],
    [['split', 'n', 'Two things at once! Over here, a mini boss. Over there, a friend in trouble.', 'Dua perkara serentak! Di sini, bos mini. Di sana, seorang kawan dalam kesusahan.', '⚔️|🆘'], ['foe', 'c', 'You cannot save him AND beat me!', 'Kamu tidak boleh selamatkan dia DAN kalahkan saya!'], ['hero', 'h', 'Watch me! I will do both!', 'Tengok saya! Saya akan lakukan kedua-duanya!']],
    [['clash', 'c', 'Clang! My little sword is sharp, and so is my brain!', 'Klang! Pedang kecil saya tajam, dan otak saya juga!'], ['owl', 'o', 'Sharp brains win over sharp swords, {hero}. Show him your smarts!', 'Otak yang tajam menang atas pedang yang tajam, {hero}. Tunjukkan kebijaksanaan kamu!'], ['hero', 'h', 'Ready when you are!', 'Sedia bila-bila masa!']],
    [['dark', 'n', 'The air turns cold. The last mini boss of the land steps forward with a deep growl.', 'Udara menjadi sejuk. Bos mini terakhir negeri ini melangkah ke hadapan dengan geraman yang dalam.', 'red'], ['foe', 'c', 'You came far, little knight. But I am the final test before the great boss!', 'Kamu sudah sampai jauh, kesatria kecil. Tetapi saya ujian terakhir sebelum bos besar!'], ['hero', 'h', 'I have learned so much! Bring it on!', 'Saya sudah belajar begitu banyak! Silakan!']]
  ],

  /* ------------------------------ choices (they do not change the main story) ------------------------------ */
  choice: [
    { q: ['Two paths! One has big footprints, and a villager is calling for help on the other.', 'Dua laluan! Satu ada tapak kaki besar, dan seorang penduduk memanggil minta tolong di satu lagi.'],
      a: { em: '🙋', t: ['Help the villager', 'Tolong penduduk'], r: ['The villager says thank you with a big smile. A warm feeling fills your heart!', 'Penduduk itu berterima kasih dengan senyuman lebar. Hati kamu terasa hangat!'], c: 3 },
      b: { em: '👣', t: ['Follow the footprints', 'Ikut tapak kaki'], r: ['The footprints lead to a hidden shiny coin. Sparkle!', 'Tapak kaki membawa kepada syiling berkilat yang tersembunyi. Berkilau!'], c: 3 } },
    { q: ['Hoot spots a stream with stepping stones and a hollow log.', 'Hoot nampak sebatang sungai dengan batu loncatan dan sebatang kayu berongga.'],
      a: { em: '🪨', t: ['Hop on the stones', 'Lompat atas batu'], r: ['Hop, hop, hop! You cross without getting wet and find a pretty pebble.', 'Hop, hop, hop! Kamu melintas tanpa basah dan menjumpai batu kerikil yang cantik.'], c: 3 },
      b: { em: '🪵', t: ['Crawl through the log', 'Merangkak melalui kayu'], r: ['Inside the log lives a sleepy hedgehog. It waves hello!', 'Di dalam kayu itu tinggal seekor landak mengantuk. Ia melambai salam!'], c: 3 } },
    { q: ['A little voice says “help”, but a trail of bright petals goes the other way.', 'Suara kecil berkata “tolong”, tetapi jejak kelopak bunga berwarna cerah ke arah lain.'],
      a: { em: '🐣', t: ['Rescue the voice', 'Selamatkan suara itu'], r: ['It is a baby bird who fell out of its nest. You put it back safely!', 'Ia anak burung yang jatuh dari sarang. Kamu meletakkannya kembali dengan selamat!'], c: 4 },
      b: { em: '🌸', t: ['Follow the petals', 'Ikut kelopak bunga'], r: ['The petals lead to a secret garden full of butterflies!', 'Kelopak bunga membawa ke taman rahsia penuh rama-rama!'], c: 4 } },
    { q: ['You find a wobbly bridge and a long, safe path around the hill.', 'Kamu jumpa jambatan goyang dan laluan panjang yang selamat di sekeliling bukit.'],
      a: { em: '🌉', t: ['Cross the bridge', 'Seberang jambatan'], r: ['Wobble, wobble... you made it! You are so brave!', 'Goyang, goyang... kamu berjaya! Kamu sungguh berani!'], c: 4 },
      b: { em: '🚶', t: ['Take the safe path', 'Ikut laluan selamat'], r: ['Along the way, you find a picnic basket left by a friendly traveller.', 'Dalam perjalanan, kamu menjumpai bakul piknik yang ditinggalkan pengembara yang mesra.'], c: 4 } },
    { q: ['A merchant has lost his cart wheel. A shiny map also lies in the grass.', 'Seorang pedagang kehilangan roda keretanya. Sebuah peta berkilat juga terbaring di atas rumput.'],
      a: { em: '🛒', t: ['Fix the cart', 'Baiki kereta'], r: ['The merchant is so glad he gives you a bag of coins!', 'Pedagang itu begitu gembira sehingga memberi kamu sebeg syiling!'], c: 5 },
      b: { em: '🗺️', t: ['Read the map', 'Baca peta'], r: ['The map shows a secret shortcut. Hoot is impressed by your good eyes!', 'Peta itu menunjukkan jalan pintas rahsia. Hoot kagum dengan mata kamu yang tajam!'], c: 5 } },
    { q: ['It is getting late. You can set up camp now, or walk on under the stars.', 'Hari sudah lewat. Kamu boleh berkhemah sekarang, atau berjalan di bawah bintang.'],
      a: { em: '⛺', t: ['Camp and rest', 'Berkhemah dan berehat'], r: ['You sleep well and wake up full of energy. Good rest is good magic!', 'Kamu tidur lena dan bangun penuh tenaga. Rehat yang baik ialah sihir yang baik!'], c: 4 },
      b: { em: '🌟', t: ['Walk under the stars', 'Berjalan di bawah bintang'], r: ['A shooting star streaks past. You make a wish!', 'Bintang jatuh melintas. Kamu membuat satu hajat!'], c: 4 } },
    { q: ['Two doors in the cave. One hums a song. The other glows green.', 'Dua pintu di dalam gua. Satu mendendangkan lagu. Satu lagi bersinar hijau.'],
      a: { em: '🎶', t: ['The humming door', 'Pintu yang bersenandung'], r: ['Behind it, crystals sing a tune. You hum along!', 'Di sebaliknya, kristal menyanyikan sebuah lagu. Kamu bersenandung bersama!'], c: 5 },
      b: { em: '💚', t: ['The glowing door', 'Pintu yang bersinar'], r: ['Behind it, glow-worms light up a tiny room. Pretty!', 'Di sebaliknya, kelip-kelip menerangi sebuah bilik kecil. Cantik!'], c: 5 } },
    { q: ['A sleepy giant snores across the road. You can tiptoe or wake him softly.', 'Seorang gergasi mengantuk berdengkur di tengah jalan. Kamu boleh berjingkit atau mengejutkannya dengan lembut.'],
      a: { em: '🤫', t: ['Tiptoe past', 'Berjingkit lalu'], r: ['Shhh... you slip by without a sound. Quiet like a mouse!', 'Shhh... kamu lalu tanpa bunyi. Senyap seperti tikus!'], c: 5 },
      b: { em: '👋', t: ['Wake him gently', 'Kejutkan dengan lembut'], r: ['The giant yawns, smiles and carries you across the river!', 'Gergasi itu menguap, tersenyum dan mendukung kamu menyeberangi sungai!'], c: 5 } },
    { q: ['A lost kitten mews near a rainbow puddle, and a bell rings far away.', 'Seekor anak kucing sesat mengiau di tepi lopak pelangi, dan loceng berbunyi jauh di sana.'],
      a: { em: '🐱', t: ['Take the kitten home', 'Hantar anak kucing pulang'], r: ['Its family purrs with joy. They give you a warm hug!', 'Keluarganya mendengkur gembira. Mereka memeluk kamu dengan erat!'], c: 5 },
      b: { em: '🔔', t: ['Find the bell', 'Cari loceng itu'], r: ['The bell is a lucky one. Ring-a-ding! Coins fall out!', 'Loceng itu loceng bertuah. Ring-a-ding! Syiling jatuh keluar!'], c: 5 } },
    { q: ['This is the last land! A tired traveller asks for water. A glowing shortcut shimmers ahead.', 'Ini negeri terakhir! Seorang pengembara penat meminta air. Jalan pintas bercahaya berkilau di hadapan.'],
      a: { em: '💧', t: ['Share your water', 'Kongsi air kamu'], r: ['The traveller whispers, “I will remember your kindness.” You feel proud!', 'Pengembara itu berbisik, “Saya akan ingat kebaikan kamu.” Kamu berasa bangga!'], c: 6 },
      b: { em: '✨', t: ['Take the shortcut', 'Ambil jalan pintas'], r: ['The shortcut leads to a secret chest of star coins!', 'Jalan pintas membawa ke peti rahsia berisi syiling bintang!'], c: 6 } }
  ],

  /* ------------------------------ cliffhangers: the end of a victory story ------------------------------ */
  cliff: [
    [['travel', 'n', 'But what is that, far away? A strange light blinks over {next}.', 'Tetapi apa itu, jauh di sana? Cahaya pelik berkelip di atas {next}.', '🌟'], ['dark', 'n', 'Hoot ruffles his feathers. “Something is waiting for us in {next}, {hero}.”', 'Hoot mengembangkan bulunya. “Sesuatu menunggu kita di {next}, {hero}.”']],
    [['travel', 'n', 'A bright path opens. It leads straight to {next}!', 'Satu laluan terang terbuka. Ia terus menuju ke {next}!', '🌈'], ['dark', 'n', 'But a tiny shadow slips along the path ahead of you... Who could it be?', 'Tetapi bayang kecil menyelinap di sepanjang laluan di hadapan kamu... Siapakah itu?']],
    [['dark', 'n', 'In the night, a faraway bell rings. Ding... dong... It comes from {next}.', 'Pada waktu malam, loceng jauh berbunyi. Ding... dong... Ia datang dari {next}.'], ['travel', 'n', '{hero} looks at the map. “Tomorrow, we go to {next}!”', '{hero} melihat peta. “Esok, kita pergi ke {next}!”', '🗺️']],
    [['travel', 'n', 'The wind blows a note towards {next}. Someone is calling for help.', 'Angin meniupkan satu nota ke arah {next}. Seseorang memanggil minta tolong.', '💨'], ['dark', 'n', 'The sky darkens over {next}. Is it a storm or something else?', 'Langit menjadi gelap di atas {next}. Ribut atau sesuatu yang lain?']],
    [['dark', 'n', 'Far away, big footsteps shake the ground. Boom... boom... They come from {next}!', 'Jauh di sana, langkah besar menggegarkan tanah. Dum... dum... Ia datang dari {next}!', 'red'], ['travel', 'n', '“Are you ready?” asks Hoot. {hero} nods. “Let us go to {next}!”', '“Sudah bersedia?” tanya Hoot. {hero} mengangguk. “Mari kita pergi ke {next}!”', '⚔️']],
    [['travel', 'n', 'A golden road shines in the distance. At its end, a mystery waits in {next}.', 'Jalan keemasan bersinar di kejauhan. Di hujungnya, satu misteri menunggu di {next}.', '🛤️'], ['dark', 'n', 'But the road is not empty. A hooded shape watches from the trees...', 'Tetapi jalan itu tidak kosong. Satu bayang berhud memerhati dari celah pokok...']],
    [['dark', 'n', 'A whisper floats on the wind: “Come to {next}... if you dare...”', 'Satu bisikan terapung di angin: “Datanglah ke {next}... jika berani...”'], ['travel', 'n', '{hero} takes a deep breath. “I dare! Hoot, to {next}!”', '{hero} menarik nafas dalam-dalam. “Saya berani! Hoot, ke {next}!”', '🔥']],
    [['travel', 'n', 'A new door appears in the air. On it is written: {next}.', 'Sebuah pintu baru muncul di udara. Tertulis padanya: {next}.', '🚪'], ['dark', 'n', 'The door creaks open just a little. Something inside is breathing...', 'Pintu itu berkeriut terbuka sedikit. Sesuatu di dalamnya sedang bernafas...']],
    [['travel', 'n', 'This is it! The last land, {next}, glows at the top of the world.', 'Inilah dia! Negeri terakhir, {next}, bersinar di puncak dunia.', '🏰'], ['dark', 'n', 'Black clouds swirl around it. The big finale is waiting for {hero}!', 'Awan hitam berpusar di sekelilingnya. Kemuncak besar sedang menanti {hero}!', 'red']]
  ],

  /* ------------------------------ the ten boss voices ------------------------------ */
  bossVoice: [
    { intro: ['Rrroar! I am the boss of this land. My flames are hot, my pride is hotter!', 'Rraaum! Saya bos negeri ini. Api saya panas, bangga saya lebih panas!'],
      rematch: ['Back again? I warmed up my fire just for you!', 'Datang lagi? Saya sudah panaskan api saya khas untuk kamu!'], rage: ['Now I am REALLY hot! Feel my fire!', 'Sekarang saya BENAR-BENAR panas! Rasakan api saya!'], win: ['My fire is out... but my heart still glows. Well done, knight.', 'Api saya padam... tetapi hati saya masih bercahaya. Syabas, kesatria.'] },
    { intro: ['Welcome, welcome. How nice of you to drop in. Do take a seat... of bones.', 'Selamat datang, selamat datang. Baik hati kamu singgah. Silakan duduk... atas tulang.'],
      rematch: ['Oh, it is you again. I do hope you brought a better brain this time.', 'Oh, kamu lagi. Saya harap kamu bawa otak yang lebih baik kali ini.'], rage: ['Now you will see my true bony self!', 'Sekarang kamu akan lihat diri saya yang sebenar!'], win: ['Hmm. I am rather rattled. You have my respect... and a rib.', 'Hmm. Saya agak tergoncang. Kamu ada penghormatan saya... dan sebatang tulang rusuk.'] },
    { intro: ['Me... Titan. Me... big. Me... slow. Me... think... you... small.', 'Saya... Titan. Saya... besar. Saya... lambat. Saya... fikir... kamu... kecil.'],
      rematch: ['You... come... again. Good. Me... like... small friend.', 'Kamu... datang... lagi. Bagus. Saya... suka... kawan kecil.'], rage: ['ME... ANGRY... RUMBLE!', 'SAYA... MARAH... GEGAR!'], win: ['Small... you... strong. Me... proud.', 'Kecil... kamu... kuat. Saya... bangga.'] },
    { intro: ['Hah! A tiny knight? I have eaten bigger ones for breakfast. Just kidding. I love toast.', 'Hah! Kesatria kecil? Saya sudah makan yang lebih besar untuk sarapan. Gurau sahaja. Saya suka roti bakar.'],
      rematch: ['Oh look, my favourite sparring partner is back. Try not to cry this time!', 'Oh lihat, kawan latihan kegemaran saya sudah kembali. Cuba jangan menangis kali ini!'], rage: ['Now it is getting spicy! Hee hee hee!', 'Sekarang makin pedas! Hi hi hi!'], win: ['Okay, okay, you win. But I made it look good, did I not?', 'Baiklah, baiklah, kamu menang. Tetapi saya buat ia nampak hebat, bukan?'] },
    { intro: ['Behold. I am the light that guards this place. Speak true and think with care.', 'Lihatlah. Akulah cahaya yang mengawal tempat ini. Bercakap benar dan fikir dengan teliti.'],
      rematch: ['You return, young knight. This time, let wisdom guide your hand.', 'Kamu kembali, kesatria muda. Kali ini, biarlah kebijaksanaan memandu tangan kamu.'], rage: ['The light grows fierce! Stand firm!', 'Cahaya menjadi garang! Berdiri teguh!'], win: ['The light bows to you. Walk well, brave one.', 'Cahaya tunduk kepada kamu. Berjalanlah dengan baik, wahai yang berani.'] },
    { intro: ['BOOM! CRACKLE! I AM THE STORM! THE SKY OBEYS ME! WAIT, WHY ARE YOU SO LITTLE?', 'DUM! PETIR! AKULAH RIBUT! LANGIT PATUH KEPADAKU! TUNGGU, KENAPA KAMU KECIL SANGAT?'],
      rematch: ['THE THUNDER REMEMBERS YOU! LET US DANCE AGAIN!', 'GURUH MENGINGATI KAMU! MARI MENARI LAGI!'], rage: ['STORM! STORM! STORM!', 'RIBUT! RIBUT! RIBUT!'], win: ['The clouds are clearing... Ahh, a rainbow. That was fun!', 'Awan semakin cerah... Ahh, pelangi. Seronoknya!'] },
    { intro: ['Oh, how sweet, a visitor! Tee hee! Can you guess my little riddle? Or shall I tickle you?', 'Oh, comelnya, tetamu! Hi hi! Boleh kamu teka teka-teki kecil saya? Atau saya geletek kamu?'],
      rematch: ['Tee hee! My favourite guest! I made new riddles just for you!', 'Hi hi! Tetamu kegemaran saya! Saya buat teka-teki baru khas untuk kamu!'], rage: ['No more nice games! Sparkle, sparkle, snap!', 'Tiada lagi permainan yang baik! Berkilau, berkilau, pap!'], win: ['Oh my, you guessed them all! Take a flower for your trouble.', 'Aduhai, kamu teka semuanya! Ambil sekuntum bunga untuk kesusahan kamu.'] },
    { intro: ['Head one: ROAR! Head two: Baa! Head three: Hiss! Together: Welcome to our land!', 'Kepala satu: NGAUM! Kepala dua: Mek! Kepala tiga: Sss! Bersama: Selamat datang ke negeri kami!'],
      rematch: ['Head one: Same knight! Head two: Hooray! Head three: Hmm, hungry...', 'Kepala satu: Kesatria yang sama! Kepala dua: Hore! Kepala tiga: Hmm, lapar...'], rage: ['All heads together: GRAAAH!', 'Semua kepala bersama: GRAAAH!'], win: ['Head one: We lost. Head two: Good game! Head three: Snack time?', 'Kepala satu: Kami kalah. Kepala dua: Permainan yang bagus! Kepala tiga: Masa makan snek?'] },
    { intro: ['BEEP. SCANNING. TARGET: SMALL KNIGHT. CHANCE OF WINNING: ZERO. BEEP.', 'BIP. MENGIMBAS. SASARAN: KESATRIA KECIL. PELUANG MENANG: SIFAR. BIP.'],
      rematch: ['BEEP. DATA FOUND: YOU WON LAST TIME. RECALCULATING... BOOP.', 'BIP. DATA DITEMUI: KAMU MENANG KALI LEPAS. MENGIRA SEMULA... BUP.'], rage: ['WARNING. SPEED UP. TICK-TOCK-TICK-TOCK.', 'AMARAN. LAJUKAN. TIK-TOK-TIK-TOK.'], win: ['BEEP. ERROR. I... AM... HAPPY. SHUTTING DOWN. GOOD JOB.', 'BIP. RALAT. SAYA... GEMBIRA. MEMATIKAN DIRI. KERJA YANG BAGUS.'] },
    { intro: ['Head one: Who goes there? Head two: A knight! Head three: A snack! Head four: Be NICE!', 'Kepala satu: Siapa itu? Kepala dua: Seorang kesatria! Kepala tiga: Snek! Kepala empat: Berbudi bahasa!'],
      rematch: ['We remember you! Last time, one head got dizzy. Not this time!', 'Kami ingat kamu! Kali lepas, satu kepala pening. Kali ini tidak!'], rage: ['Five heads, one big roar! GRAAAH!', 'Lima kepala, satu ngauman besar! GRAAAH!'], win: ['All heads agree: you are clever. Thank you for the game!', 'Semua kepala setuju: kamu bijak. Terima kasih untuk permainan ini!'] }
  ]
};
