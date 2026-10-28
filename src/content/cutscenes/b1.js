/* Age 4: The Little Knight's Wonder Book. Cutscene scripts (format: src/parts/25-v29-cutscenes.js).
   Short, simple sentences for little listeners. c = chapter, b = boss intro, v = victory. */
export default {
  0: {
    c: [
      ['wide', 'n', 'Good morning, Teddy Garden! A little knight is going on an adventure.', 'Selamat pagi, Taman Teddy! Seorang kesatria kecil mahu pergi mengembara.'],
      ['close', 'h', 'Hello! I am {hero}. I want to see every wonder in the world!', 'Helo! Saya {hero}. Saya mahu lihat setiap keajaiban di dunia!', '😄'],
      ['prob', 'n', 'Oh no! The garden is grey. Where did all the colours go?', 'Alamak! Taman ini kelabu. Ke mana perginya semua warna?', '🩶'],
      ['talk', 'x:🧸:Teddy Bear:Beruang Teddy', 'Boo hoo! My flowers lost their colours. Can you help?', 'Huhu! Bunga saya hilang warna. Boleh kamu tolong?'],
      ['owl', 'o', 'Hoo hoo! I am Hoot. Here is a magic Wonder Book for you!', 'Hu hu! Saya Hoot. Ini Buku Keajaiban ajaib untuk kamu!'],
      ['item', 'o', 'It has ten empty pages. Every land has one special wonder to find!', 'Ada sepuluh halaman kosong. Setiap tempat ada satu keajaiban istimewa untuk dicari!', '📖'],
      ['hero', 'h', 'Ten wonders? Yay! I will find them all!', 'Sepuluh keajaiban? Yeay! Saya akan cari semuanya!'],
      ['villain', 'x:☁️:Grey cloud:Awan kelabu', 'Hmph! Nothing is special. Huff!', 'Hmph! Tiada yang istimewa. Huh!'],
      ['owl', 'o', 'Who was that grumpy grey cloud? Hmm...', 'Siapakah awan kelabu yang merajuk itu? Hmm...'],
      ['foe', 'm', 'Grr! Grumpy, grumpy! This garden is ours!', 'Grr! Merajuk, merajuk! Taman ini kami punya!'],
      ['clash', 'n', 'Swish! {hero} answers well. The grumpy monsters run away!', 'Wusy! {hero} menjawab dengan baik. Raksasa merajuk lari!'],
      ['win', 'n', 'Pop! Pop! Red and pink tulips wake up. So pretty!', 'Pop! Pop! Bunga tulip merah dan merah jambu bangun. Cantiknya!']
    ],
    b: [
      ['lair', 'n', 'Here is the Big Teddy Tree. It is the oldest tree in the garden.', 'Inilah Pokok Teddy Besar. Ia pokok paling tua di taman.'],
      ['reveal', 'b', 'Stomp, stomp! This tree is MINE!', 'Hentak, hentak! Pokok ini SAYA punya!'],
      ['talk', 'x:🧸:Teddy Bear:Beruang Teddy', 'Eek! It is so big! Be careful!', 'Eek! Besarnya! Hati-hati!'],
      ['owl', 'o', 'Be brave, little knight. Think, then tap!', 'Beranilah, kesatria kecil. Fikir, kemudian tekan!'],
      ['ready', 'h', 'I am small, but I am brave. Let us go!', 'Saya kecil, tetapi saya berani. Jom!']
    ],
    v: [
      ['vbeat', 'b', 'Hee hee! You win! High five!', 'Hi hi! Kamu menang! Tepuk tangan!'],
      ['item', 'n', 'Listen! The Big Teddy Tree hums a sleepy song. That is its wonder!', 'Dengar! Pokok Teddy Besar menyanyikan lagu dodoi. Itulah keajaibannya!', '🌳'],
      ['crowd', 'x:🧸:Teddy Bears:Beruang-beruang Teddy', 'Yay! Our garden is pretty again! Thank you, {hero}!', 'Yeay! Taman kami cantik semula! Terima kasih, {hero}!', '🧸'],
      ['vfix', 'o', 'Look! Page 1 of the Wonder Book fills with flowers!', 'Lihat! Halaman 1 Buku Keajaiban dipenuhi bunga!'],
      ['vnext', 'n', 'Look up! The grumpy grey cloud floats away to {next}.', 'Lihat ke atas! Awan kelabu yang merajuk terapung pergi ke {next}.']
    ]
  },
  1: {
    c: [
      ['wide', 'n', 'One page done! {hero} skips to Bubble Pond. Quack, quack!', 'Satu halaman siap! {hero} melompat-lompat ke Kolam Buih. Kuek, kuek!'],
      ['prob', 'n', 'Whoosh! A big wind blew all the bubbles away.', 'Wusy! Angin besar meniup semua buih pergi.', '💨'],
      ['talk', 'x:🦆:Mama Duck:Ibu Itik', 'Quack! My ducklings love bubbles. Now they are sad.', 'Kuek! Anak-anak itik saya suka buih. Sekarang mereka sedih.'],
      ['villain', 'x:☁️:Grey cloud:Awan kelabu', 'Huff! Puff! Bubbles are silly!', 'Huh! Puh! Buih itu mengarut!'],
      ['owl', 'o', 'That grey cloud again! It huffs when it is grumpy.', 'Awan kelabu itu lagi! Ia menghembus bila merajuk.'],
      ['hero', 'h', 'Do not worry, little ducks. I will help you!', 'Jangan risau, anak-anak itik. Saya akan tolong!'],
      ['foe', 'm', 'Splish! Splash! Go away!', 'Plip! Plap! Pergi!'],
      ['clash', 'n', 'Splashy monsters jump out of the water. {hero} is not scared!', 'Raksasa percik melompat keluar dari air. {hero} tidak takut!'],
      ['win', 'n', 'Pop, pop, pop! Shiny bubbles float up again.', 'Pop, pop, pop! Buih berkilat terapung semula.'],
      ['crowd', 'x:🦆:Ducklings:Anak-anak itik', 'Quack quack! Let us dance!', 'Kuek kuek! Jom menari!', '🦆']
    ],
    b: [
      ['lair', 'n', 'The Bubble Fountain is very, very quiet.', 'Pancuran Buih sangat-sangat senyap.'],
      ['reveal', 'b', 'I sit on top. No more bubbles!', 'Saya duduk di atas. Tiada lagi buih!'],
      ['talk', 'x:🦆:Mama Duck:Ibu Itik', 'Quack! Please bring our bubbles back!', 'Kuek! Tolong bawa balik buih kami!'],
      ['owl', 'o', 'Think, then tap. You can do it!', 'Fikir, kemudian tekan. Kamu boleh!'],
      ['ready', 'h', 'Bubbles, here I come!', 'Buih, saya datang!']
    ],
    v: [
      ['vbeat', 'b', 'Blub blub! Okay, okay. You win!', 'Blub blub! Baiklah, baiklah. Kamu menang!'],
      ['item', 'n', 'The fountain blows rainbow bubbles. Big ones and tiny ones!', 'Pancuran meniup buih pelangi. Yang besar dan yang kecil!', '🫧'],
      ['crowd', 'x:🦆:Ducklings:Anak-anak itik', 'Bubbles! Bubbles! Thank you, {hero}!', 'Buih! Buih! Terima kasih, {hero}!', '🦆'],
      ['vfix', 'o', 'Every bubble is different. That is the wonder! Page 2 shines!', 'Setiap buih berbeza. Itulah keajaibannya! Halaman 2 bersinar!'],
      ['vnext', 'n', 'Tiny footprints lead to {next}. Let us follow them!', 'Tapak kaki kecil menuju ke {next}. Jom kita ikut!']
    ]
  },
  2: {
    c: [
      ['wide', 'n', 'Two pages done! {hero} tiptoes into Ladybug Lane. Everything is tiny here.', 'Dua halaman siap! {hero} berjengket masuk ke Lorong Kepik. Semuanya kecil di sini.'],
      ['prob', 'n', 'Crunch, crunch. Dry leaves cover the path.', 'Krup, krup. Daun kering menutup jalan.', '🍂'],
      ['talk', 'x:🐞:Little Ladybug:Kepik Kecil', 'I cannot find my home! The leaves are everywhere!', 'Saya tidak jumpa rumah saya! Daun ada di mana-mana!'],
      ['close', 'h', 'Hello, little ladybug! You are so small and so pretty.', 'Helo, kepik kecil! Kamu sangat kecil dan sangat cantik.', '🐞'],
      ['owl', 'o', 'Look closely. Small things can be special too.', 'Lihat betul-betul. Benda kecil pun boleh jadi istimewa.'],
      ['hero', 'h', 'Let us sweep the leaves away. Swish, swish!', 'Jom sapu daun-daun ini. Sap, sap!'],
      ['foe', 'm', 'Bzzz! Bzzz! We are the buzzy monsters!', 'Bzzz! Bzzz! Kami raksasa berdengung!'],
      ['clash', 'n', 'Buzzy monsters zoom around. Stay calm and think!', 'Raksasa berdengung terbang laju. Bertenang dan fikir!'],
      ['win', 'n', 'The path is clean. Yellow daisies pop up!', 'Jalan sudah bersih. Bunga daisi kuning muncul!'],
      ['crowd', 'x:🐞:Ladybugs:Kepik-kepik', 'Hooray! We found our homes!', 'Hore! Kami jumpa rumah kami!', '🐞']
    ],
    b: [
      ['lair', 'n', 'Ladybug Castle is made of leaves. It is so tall!', 'Istana Kepik dibuat daripada daun. Tingginya!'],
      ['reveal', 'b', 'Bzzz! Go away! This castle is mine!', 'Bzzz! Pergi! Istana ini saya punya!'],
      ['talk', 'x:🐞:Little Ladybug:Kepik Kecil', 'Our queen is inside! Please help!', 'Ratu kami di dalam! Tolonglah!'],
      ['owl', 'o', 'Small knights can be brave too!', 'Kesatria kecil pun boleh berani!'],
      ['ready', 'h', 'I will stand firm. Here I go!', 'Saya akan berdiri teguh. Saya pergi!']
    ],
    v: [
      ['vbeat', 'b', 'Bzz... you win. I will be nice now.', 'Bzz... kamu menang. Saya akan jadi baik sekarang.'],
      ['item', 'n', 'Look! Every ladybug has its own spots. No two are the same!', 'Lihat! Setiap kepik ada bintik sendiri. Tiada dua yang sama!', '🐞'],
      ['crowd', 'x:👑:Ladybug Queen:Ratu Kepik', 'Thank you, brave little knight!', 'Terima kasih, kesatria kecil yang berani!', '🐞'],
      ['vfix', 'o', 'That is the wonder! Page 3 fills with tiny dots!', 'Itulah keajaibannya! Halaman 3 dipenuhi titik-titik kecil!'],
      ['vnext', 'n', 'Sniff, sniff! Something smells sweet. It comes from {next}!', 'Hidu, hidu! Ada bau manis. Ia datang dari {next}!']
    ]
  },
  3: {
    c: [
      ['wide', 'n', 'Three pages done! Mmm! Cupcake Corner smells yummy.', 'Tiga halaman siap! Mmm! Sudut Kek Cawan berbau sedap.'],
      ['villain', 'x:☁️:Grey cloud:Awan kelabu', 'Sniff... nobody shares with me. Drip, drip!', 'Sedu... tiada siapa berkongsi dengan saya. Titik, titik!', 'sad'],
      ['prob', 'n', 'Oh no! The grey cloud rained on the cupcakes. The sprinkles washed away!', 'Alamak! Awan kelabu itu menurunkan hujan ke atas kek cawan. Taburannya hanyut!', '🩶'],
      ['talk', 'x:🧑‍🍳:Baker Bun:Pembuat Roti Bun', 'My cupcakes! Now they are soggy and grey!', 'Kek cawan saya! Sekarang semuanya lembik dan kelabu!'],
      ['owl', 'o', 'Treats are fun. But fruit and water make knights strong!', 'Manisan memang seronok. Tetapi buah dan air buat kesatria kuat!'],
      ['hero', 'h', 'Let me wash my hands. I will help the bakers!', 'Saya basuh tangan dulu. Saya akan tolong pembuat kek!'],
      ['foe', 'm', 'Wheee! We are sticky monsters!', 'Wiii! Kami raksasa melekit!'],
      ['clash', 'n', 'Sticky monsters slide down the jelly. Boing! {hero} jumps over them!', 'Raksasa melekit menggelongsor di atas jeli. Boing! {hero} melompat atas mereka!'],
      ['win', 'n', 'New sprinkles sparkle on the cupcakes. Hooray!', 'Taburan baharu berkilau di atas kek cawan. Hore!'],
      ['crowd', 'x:🧑‍🍳:Bakers:Pembuat kek', 'Snack time! There is one for everybody!', 'Masa makan! Ada satu untuk semua orang!', '🧁']
    ],
    b: [
      ['lair', 'n', 'A giant cupcake sits on the bakery roof.', 'Sebiji kek cawan gergasi di atas bumbung kedai roti.'],
      ['reveal', 'b', 'Slurp! All the icing is mine! Mine, mine, mine!', 'Slurp! Semua aising saya punya! Saya, saya, saya!'],
      ['talk', 'x:🧑‍🍳:Baker Bun:Pembuat Roti Bun', 'That cupcake is for the whole town!', 'Kek cawan itu untuk seluruh pekan!'],
      ['owl', 'o', 'Let us show {boss} how to share.', 'Mari tunjukkan kepada {boss} cara berkongsi.'],
      ['ready', 'h', 'Sharing is caring. Let us go!', 'Berkongsi tanda sayang. Jom!']
    ],
    v: [
      ['vbeat', 'b', 'Yum... maybe sharing is nice. Sorry!', 'Sedap... mungkin berkongsi itu bagus. Maaf!'],
      ['item', 'n', 'The bakers make one big cupcake for everyone.', 'Pembuat kek membuat sebiji kek cawan besar untuk semua orang.', '🧁'],
      ['crowd', 'x:🧑‍🍳:Bakers:Pembuat kek', 'Sharing makes it taste even better!', 'Berkongsi buat rasanya lebih sedap!', '🧁'],
      ['vfix', 'o', 'That is the wonder! Page 4 is done!', 'Itulah keajaibannya! Halaman 4 siap!'],
      ['villain', 'x:☁️:Grey cloud:Awan kelabu', 'Sniff... they shared with everyone... not me...', 'Sedu... mereka berkongsi dengan semua... bukan saya...', 'sad'],
      ['vnext', 'n', 'The grey cloud cries over {next}. Let us go and see!', 'Awan kelabu menangis di atas {next}. Jom kita pergi lihat!']
    ]
  },
  4: {
    c: [
      ['wide', 'n', 'Halfway! Four pages shine as {hero} reaches Rainbow Slide.', 'Separuh jalan! Empat halaman bersinar apabila {hero} tiba di Gelongsor Pelangi.'],
      ['prob', 'n', 'The slide is grey. Nobody wants to play.', 'Gelongsor itu kelabu. Tiada siapa mahu bermain.', '🩶'],
      ['villain', 'v', 'Sniff! I am Puff. Nothing is special. I am not special.', 'Sedu! Saya Puff. Tiada yang istimewa. Saya tidak istimewa.', 'sad'],
      ['close', 'h', 'Puff, you look so sad.', 'Puff, kamu nampak sangat sedih.', '🥺'],
      ['item', 'h', 'Look at my Wonder Book! Everything is special. You too!', 'Lihat Buku Keajaiban saya! Semuanya istimewa. Kamu pun!', '📖'],
      ['villain', 'v', 'Me? Special? No... no, I do not believe you! Grumble!', 'Saya? Istimewa? Tidak... tidak, saya tidak percaya! Hmph!', 'sad'],
      ['foe', 'm', 'Rumble, rumble! Puff is grumpy, so we are grumpy!', 'Gruh, gruh! Puff merajuk, jadi kami pun merajuk!'],
      ['clash', 'n', 'More monsters wake up. {hero} is brave and kind!', 'Lebih banyak raksasa bangun. {hero} berani dan baik hati!'],
      ['win', 'n', 'Red, orange, yellow! The slide starts to glow.', 'Merah, jingga, kuning! Gelongsor mula bercahaya.'],
      ['crowd', 'x:🧒:Kids:Kanak-kanak', 'Wheee! Can we slide now?', 'Wiii! Boleh kami main gelongsor sekarang?', '🧒']
    ],
    b: [
      ['lair', 'n', 'At the top, all the colours are stuck in a big knot.', 'Di atas, semua warna tersangkut dalam satu simpulan besar.'],
      ['reveal', 'b', 'I hold the knot! Catch me if you can!', 'Saya pegang simpulan ini! Tangkaplah kalau boleh!'],
      ['villain', 'v', 'Be careful, little knight!', 'Hati-hati, kesatria kecil!', 'sad'],
      ['owl', 'o', 'Puff is starting to care. That is a wonder too.', 'Puff mula ambil peduli. Itu pun satu keajaiban.'],
      ['ready', 'h', 'Watch this, Puff! Here I go!', 'Tengok ini, Puff! Saya pergi!']
    ],
    v: [
      ['vbeat', 'b', 'Wheee! The knot is untied! You win!', 'Wiii! Simpulan terlerai! Kamu menang!'],
      ['item', 'n', 'The rainbow is back! Seven colours side by side.', 'Pelangi sudah kembali! Tujuh warna bersebelahan.', '🌈'],
      ['villain', 'v', 'Wow... it is so pretty. Maybe things ARE special.', 'Wah... cantiknya. Mungkin memang ada benda yang istimewa.', 'happy'],
      ['vfix', 'o', 'Page 5 is a rainbow! Halfway done!', 'Halaman 5 menjadi pelangi! Separuh siap!'],
      ['vnext', 'v', 'Um... can I come to {next} with you?', 'Erm... boleh saya ikut kamu ke {next}?', 'happy'],
      ['crowd', 'h', 'Of course, Puff! Friends go together!', 'Tentu sekali, Puff! Kawan pergi bersama-sama!', '🌈']
    ]
  },
  5: {
    c: [
      ['wide', 'n', 'Five pages done! Puff floats along to Bunny Burrow. It is almost bedtime.', 'Lima halaman siap! Puff terapung bersama ke Lubang Arnab. Hampir waktu tidur.'],
      ['dark', 'n', 'Click! The lights go out. It is very dark.', 'Klik! Lampu padam. Gelap sungguh.'],
      ['talk', 'x:🐰:Baby Bunny:Anak Arnab', 'Eek! I am scared of the dark!', 'Eek! Saya takut gelap!'],
      ['owl', 'o', 'It is okay to feel scared. We can be brave together.', 'Tidak apa rasa takut. Kita boleh berani bersama-sama.'],
      ['item', 'n', '{hero} lifts a little lamp. Puff glows softly too!', '{hero} mengangkat sebuah lampu kecil. Puff pun bercahaya lembut!', '🏮'],
      ['villain', 'v', 'Look! I can glow! I never knew!', 'Lihat! Saya boleh bercahaya! Saya tidak pernah tahu!', 'happy'],
      ['foe', 'm', 'Boo! We are shadow monsters!', 'Bu! Kami raksasa bayang!'],
      ['clash', 'n', 'Shadows wiggle on the walls. They are just shadows!', 'Bayang-bayang bergoyang di dinding. Itu cuma bayang!'],
      ['win', 'n', 'The burrow glows warm. The bunnies munch carrots.', 'Lubang arnab bercahaya hangat. Arnab-arnab makan lobak.'],
      ['crowd', 'x:🐰:Bunnies:Arnab-arnab', 'Crunch, crunch! Thank you! We are not scared now!', 'Krup, krup! Terima kasih! Kami tidak takut lagi!', '🐰']
    ],
    b: [
      ['lair', 'n', 'The Bunny Bedroom is the darkest room of all.', 'Bilik Tidur Arnab ialah bilik paling gelap.'],
      ['reveal', 'b', 'Hee hee! I hid the night-light!', 'Hi hi! Saya sorokkan lampu tidur!'],
      ['villain', 'v', 'You are brave. I believe in you!', 'Kamu berani. Saya percaya pada kamu!', 'happy'],
      ['owl', 'o', 'A little light can beat a big dark.', 'Cahaya kecil boleh kalahkan gelap yang besar.'],
      ['ready', 'h', 'Lamp up! Here I come!', 'Angkat lampu! Saya datang!']
    ],
    v: [
      ['vbeat', 'b', 'Okay! Here is the night-light. Goodnight!', 'Baiklah! Ini lampu tidurnya. Selamat malam!'],
      ['item', 'n', 'The bunnies share a secret. The stars are brightest from their hill!', 'Arnab berkongsi rahsia. Bintang paling terang dilihat dari bukit mereka!', '⭐'],
      ['crowd', 'x:🐰:Bunnies:Arnab-arnab', 'Look up! Twinkle, twinkle!', 'Lihat ke atas! Kelip, kelip!', '🐰'],
      ['vfix', 'o', 'That is the wonder! Page 6 twinkles!', 'Itulah keajaibannya! Halaman 6 berkelip-kelip!'],
      ['vnext', 'n', 'The sea is calling from {next}. Swish, swish!', 'Laut memanggil dari {next}. Sus, sus!']
    ]
  },
  6: {
    c: [
      ['wide', 'n', 'Six pages done! {hero}, Hoot and Puff reach Jelly Beach.', 'Enam halaman siap! {hero}, Hoot dan Puff tiba di Pantai Jeli.'],
      ['prob', 'n', 'Yuck! Rubbish covers the sand.', 'Eee! Sampah menutup pasir.', '🗑️'],
      ['talk', 'x:🦀:Mr. Crab:Encik Ketam', 'Snip snap! I cannot play. There is rubbish everywhere!', 'Kap kap! Saya tidak boleh bermain. Sampah ada di mana-mana!'],
      ['owl', 'o', 'Rubbish goes in the bin. Let us clean up!', 'Sampah dibuang ke dalam tong. Jom kita bersihkan!'],
      ['hero', 'h', 'I will pick up the rubbish. One, two, three!', 'Saya akan kutip sampah. Satu, dua, tiga!'],
      ['villain', 'v', 'And I will make a gentle rain to wash the sand!', 'Dan saya akan turunkan hujan lembut untuk mencuci pasir!', 'happy'],
      ['foe', 'm', 'Boing, boing! Wobbly jelly monsters!', 'Boing, boing! Raksasa jeli bergoyang!'],
      ['clash', 'n', 'Jelly monsters bounce on the shore. Boing! {hero} bounces back!', 'Raksasa jeli melantun di pantai. Boing! {hero} melantun balik!'],
      ['win', 'n', 'The beach sparkles. Pretty shells peek out!', 'Pantai berkilau. Kulit kerang cantik mengintai keluar!'],
      ['crowd', 'x:🦀:Crabs:Ketam-ketam', 'Snip snap hooray! Clean sand!', 'Kap kap hore! Pasir bersih!', '🦀']
    ],
    b: [
      ['lair', 'n', 'A big sandcastle stands by the waves.', 'Sebuah istana pasir besar berdiri di tepi ombak.'],
      ['reveal', 'b', 'This beach is MY playground! Splash!', 'Pantai ini taman permainan SAYA! Cebur!'],
      ['talk', 'x:🦀:Mr. Crab:Encik Ketam', 'The beach is for everyone!', 'Pantai ini untuk semua orang!'],
      ['owl', 'o', 'Let us keep the beach clean for everyone.', 'Mari jaga pantai ini supaya bersih untuk semua.'],
      ['ready', 'h', 'Ready, set, go!', 'Sedia, mula, mara!']
    ],
    v: [
      ['vbeat', 'b', 'Splash... okay. We can share the beach.', 'Cebur... baiklah. Kita boleh berkongsi pantai.'],
      ['item', 'n', 'Hold a shell to your ear. You can hear the sea!', 'Dekatkan kulit kerang ke telinga. Kamu boleh dengar laut!', '🐚'],
      ['crowd', 'x:🦀:Crabs:Ketam-ketam', 'Shhh... listen! Swoosh, swoosh!', 'Syhh... dengar! Sus, sus!', '🐚'],
      ['vfix', 'o', 'That is the wonder! Page 7 is full of shells!', 'Itulah keajaibannya! Halaman 7 penuh dengan kulit kerang!'],
      ['vnext', 'n', 'Soft music comes from {next}. La, la, la!', 'Muzik lembut datang dari {next}. La, la, la!']
    ]
  },
  7: {
    c: [
      ['wide', 'n', 'Seven pages done! {hero} climbs Lullaby Hill.', 'Tujuh halaman siap! {hero} mendaki Bukit Dodoi.'],
      ['prob', 'n', 'Shh! The hill is too quiet.', 'Syhh! Bukit ini terlalu senyap.', '🔇'],
      ['talk', 'x:🐦:Little Bird:Burung Kecil', 'Tweet? I forgot my song!', 'Ciap? Saya lupa lagu saya!'],
      ['owl', 'o', 'Every bird has its own song. Let us help them remember.', 'Setiap burung ada lagunya sendiri. Jom bantu mereka ingat.'],
      ['hero', 'h', 'Clap, clap, clap! Let us make a beat!', 'Tepuk, tepuk, tepuk! Jom buat rentak!'],
      ['villain', 'v', 'Hmm, hmm, hmm! I can hum along!', 'Hmm, hmm, hmm! Saya boleh menyanyi bersama!', 'happy'],
      ['foe', 'm', 'BANG! CRASH! We are the noisy monsters!', 'DUM! PRANG! Kami raksasa bising!'],
      ['clash', 'n', 'Noisy monsters bang and crash. Cover your ears!', 'Raksasa bising berdentum. Tutup telinga!'],
      ['win', 'n', 'Tweet, tweet! The birds sing again.', 'Ciap, ciap! Burung-burung menyanyi semula.'],
      ['crowd', 'x:🐦:Birds:Burung-burung', 'Every song is different. Tweet!', 'Setiap lagu berbeza. Ciap!', '🐦']
    ],
    b: [
      ['lair', 'n', 'A giant music box sits on the hilltop.', 'Sebuah kotak muzik gergasi di atas bukit.'],
      ['reveal', 'b', 'I have the key! No more songs!', 'Kunci ada pada saya! Tiada lagi lagu!'],
      ['villain', 'v', 'Let us sing together, little knight!', 'Jom kita menyanyi bersama, kesatria kecil!', 'happy'],
      ['owl', 'o', 'One, two, three... go!', 'Satu, dua, tiga... mula!'],
      ['ready', 'h', 'La la la! Here I come!', 'La la la! Saya datang!']
    ],
    v: [
      ['vbeat', 'b', 'La la... oh! I love singing too!', 'La la... oh! Saya pun suka menyanyi!'],
      ['item', 'n', 'The music box plays a lullaby. Everyone smiles.', 'Kotak muzik memainkan lagu dodoi. Semua orang tersenyum.', '🎶'],
      ['crowd', 'x:🐦:Birds:Burung-burung', 'Tweet tweet! What a lovely song!', 'Ciap ciap! Merdunya lagu itu!', '🐦'],
      ['vfix', 'o', 'That is the wonder! Page 8 sings!', 'Itulah keajaibannya! Halaman 8 menyanyi!'],
      ['vnext', 'n', 'Lights twinkle far away in {next}.', 'Lampu berkelip jauh di {next}.']
    ]
  },
  8: {
    c: [
      ['wide', 'n', 'Eight pages done! {hero} walks into Twinkle Town at night.', 'Lapan halaman siap! {hero} berjalan masuk ke Pekan Kelip pada waktu malam.'],
      ['dark', 'n', 'The lanterns are dark. The town feels lonely.', 'Tanglung-tanglung gelap. Pekan itu terasa sunyi.', '🏮'],
      ['talk', 'x:👵:Granny Mo:Nenek Mo', 'Everyone stays inside. Nobody says hello any more.', 'Semua orang duduk di dalam. Tiada siapa menyapa lagi.'],
      ['owl', 'o', 'A town is special because of the friends who live in it.', 'Pekan itu istimewa kerana kawan-kawan yang tinggal di dalamnya.'],
      ['hero', 'h', 'Knock, knock! Come out! Let us light the lanterns together!', 'Tok, tok! Keluarlah! Jom nyalakan tanglung bersama-sama!'],
      ['foe', 'm', 'Fwoo! We blow out the candles!', 'Fuu! Kami tiup lilin!'],
      ['clash', 'n', 'Sneaky monsters blow out the candles. {hero} lights them again!', 'Raksasa licik meniup lilin. {hero} menyalakannya semula!'],
      ['win', 'n', 'One by one, the lanterns glow. Hello, neighbours!', 'Satu demi satu, tanglung menyala. Helo, jiran-jiran!'],
      ['crowd', 'x:🧑:Neighbours:Jiran-jiran', 'Hello! Hello! We missed you!', 'Helo! Helo! Kami rindu kamu!', '🧑']
    ],
    b: [
      ['lair', 'n', 'The town clock has stopped at bedtime.', 'Jam pekan berhenti pada waktu tidur.'],
      ['reveal', 'b', 'I sit on the clock. Nobody goes home!', 'Saya duduk di atas jam. Tiada siapa boleh pulang!'],
      ['villain', 'v', 'Only one more land after this! You can do it!', 'Cuma satu tempat lagi selepas ini! Kamu boleh!', 'happy'],
      ['owl', 'o', 'Be brave, little knight.', 'Beranilah, kesatria kecil.'],
      ['ready', 'h', 'Tick tock! Here I come!', 'Tik tok! Saya datang!']
    ],
    v: [
      ['vbeat', 'b', 'Tick... tock... okay, everyone can go home.', 'Tik... tok... baiklah, semua boleh pulang.'],
      ['item', 'n', 'Everyone shares lanterns and stories.', 'Semua orang berkongsi tanglung dan cerita.', '🏮'],
      ['crowd', 'x:🧑:Neighbours:Jiran-jiran', 'Friends are the best! Thank you, {hero}!', 'Kawan yang terbaik! Terima kasih, {hero}!', '🧑'],
      ['vfix', 'o', 'Friends are a wonder too! Page 9 glows warm!', 'Kawan juga satu keajaiban! Halaman 9 bercahaya hangat!'],
      ['vnext', 'n', 'Only one page is left. The moon shines over {next}.', 'Tinggal satu halaman lagi. Bulan bersinar di atas {next}.']
    ]
  },
  9: {
    c: [
      ['wide', 'n', 'Nine pages done! {hero} floats up to Moon Pillow Palace, high in the sky.', 'Sembilan halaman siap! {hero} terapung naik ke Istana Bantal Bulan, tinggi di langit.'],
      ['prob', 'n', 'But the moon is grey and dim. The last page stays empty.', 'Tetapi bulan kelabu dan malap. Halaman terakhir masih kosong.', '🌌'],
      ['villain', 'v', 'Oh no! The moon is sad, like I was. Can we help it?', 'Alamak! Bulan sedih, macam saya dulu. Boleh kita tolong?', 'sad'],
      ['talk', 'x:🌙:The Moon:Bulan', 'Yawn... I feel so tired and grey...', 'Uwaa... saya rasa sangat penat dan kelabu...'],
      ['foe', 'm', 'Yaaawn! The sleepy monsters wake up! Here we come!', 'Uwaaa! Raksasa mengantuk bangun! Kami datang!'],
      ['clash', 'n', 'The sleepiest monsters of all! {hero} gives it everything!', 'Raksasa yang paling mengantuk! {hero} berusaha sehabis baik!'],
      ['item', 'n', '{hero} holds the Wonder Book up high. Nine pages glow like stars!', '{hero} mengangkat Buku Keajaiban tinggi-tinggi. Sembilan halaman bercahaya seperti bintang!', '📖'],
      ['close', 'h', 'Look, Moon! The whole world is full of wonders. And so are you!', 'Lihat, Bulan! Seluruh dunia penuh keajaiban. Kamu juga!', '✨'],
      ['win', 'n', 'The moon shines silver again!', 'Bulan bersinar keperakan semula!'],
      ['villain', 'v', 'Look at me! I am a RAINBOW cloud now!', 'Lihat saya! Saya awan PELANGI sekarang!', 'happy']
    ],
    b: [
      ['lair', 'n', 'The throne room is soft and full of pillows.', 'Bilik takhta lembut dan penuh bantal.'],
      ['reveal', 'b', 'Boing! I jump on the biggest pillow. No more wonders!', 'Boing! Saya lompat atas bantal paling besar. Tiada lagi keajaiban!'],
      ['villain', 'v', 'Last page, little knight! You can do it!', 'Halaman terakhir, kesatria kecil! Kamu boleh!', 'happy'],
      ['owl', 'o', 'Everything you learned is in your heart. Go!', 'Semua yang kamu pelajari ada dalam hati kamu. Pergi!'],
      ['ready', 'h', 'For the last page! Here I come!', 'Untuk halaman terakhir! Saya datang!']
    ],
    v: [
      ['vbeat', 'b', 'Yawn... you win. What a wonderful knight!', 'Uwaa... kamu menang. Hebatnya kesatria ini!'],
      ['item', 'n', 'The moon shines on every land {hero} visited. Each one is special.', 'Bulan menyinari setiap tempat yang {hero} lawati. Setiap satu istimewa.', '🌙'],
      ['vfix', 'o', 'The last page fills with a picture of {hero}, Hoot and Puff together!', 'Halaman terakhir dipenuhi gambar {hero}, Hoot dan Puff bersama-sama!'],
      ['crowd', 'x:🧸:All your friends:Semua kawan kamu', 'Hooray for {hero}! The Wonder Book is complete!', 'Hore untuk {hero}! Buku Keajaiban sudah lengkap!', '🧸'],
      ['finale', 'v', 'Thank you for showing me that everything is special. Even me!', 'Terima kasih kerana menunjukkan bahawa semuanya istimewa. Saya pun!', 'happy']
    ]
  }
};
