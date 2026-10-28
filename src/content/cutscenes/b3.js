/* Age 6: The Young Knight Who Would Be King. Cutscene scripts (format: src/parts/25-v29-cutscenes.js).
   c = chapter, b = boss intro, v = victory. Each beat: [shot, speaker, English, Malay, prop]. */
export default {
  0: {
    c: [
      ['wide', 'n', 'Morning bells ring over a peaceful kingdom. In a tiny cottage, {hero} jumps out of bed.', 'Loceng pagi berbunyi di sebuah kerajaan yang aman. Di sebuah pondok kecil, {hero} melompat dari katil.'],
      ['close', 'h', 'Today is the day! I am going to the castle to become a knight of the King!', 'Hari inilah harinya! Saya akan ke istana untuk menjadi kesatria Raja!', '✨'],
      ['prob', 'n', 'But on the road, the flowers of Sunny Start hang their heads. Their petals are turning brown.', 'Tetapi di jalan, bunga-bunga di Permulaan Cerah tertunduk. Kelopaknya menjadi perang.'],
      ['talk', 'x:👩‍🌾:Farmer Mei:Peladang Mei', 'The old King is tired, little one. When the kingdom has no strong heart, even the flowers feel it.', 'Raja tua sudah penat, anak kecil. Apabila kerajaan tiada hati yang kuat, bunga pun dapat merasainya.'],
      ['owl', 'o', 'Hoo! I am Hoot, the King\'s owl. The King is looking for someone to wear the crown one day.', 'Hu! Saya Hoot, burung hantu Raja. Raja sedang mencari seseorang untuk memakai mahkota suatu hari nanti.'],
      ['item', 'o', 'Whoever passes the Ten Royal Trials will be the next king. Courage, care, fairness, and seven more!', 'Sesiapa yang lulus Sepuluh Ujian Diraja akan menjadi raja seterusnya. Keberanian, penjagaan, keadilan, dan tujuh lagi!', '📜'],
      ['hero', 'h', 'Ten trials? I will pass every single one!', 'Sepuluh ujian? Saya akan lulus setiap satu!'],
      ['owl', 'o', 'Ha! Big words. A king must be more than strong. Let us see what is in your heart.', 'Ha! Kata-kata besar. Seorang raja mesti lebih daripada kuat. Mari kita lihat isi hati kamu.'],
      ['dark', 'n', 'Rustle, rustle... the thorny bushes shake. Something is watching from the shadows.', 'Sresek, sresek... semak berduri bergoyang. Ada sesuatu yang memerhati dari dalam gelap.'],
      ['foe', 'm', 'Grrr! Nobody passes through our garden!', 'Grrr! Tiada siapa boleh lalu di taman kami!'],
      ['clash', 'n', 'The first trial has begun! {hero} raises a shield and charges forward.', 'Ujian pertama sudah bermula! {hero} mengangkat perisai dan meluru ke hadapan.', '🛡️'],
      ['win', 'n', 'One by one, the flowers lift their heads toward the sun. But the trial is not over yet...', 'Satu demi satu, bunga mengangkat kepala ke arah matahari. Tetapi ujian belum selesai...']
    ],
    b: [
      ['lair', 'n', 'At the end of the meadow stands the Royal Gate, wrapped in thorns and locked tight.', 'Di hujung padang berdiri Pintu Diraja, dibalut duri dan berkunci rapat.'],
      ['reveal', 'b', 'ROAR! I am {boss}, guard of this gate. Only the brave may pass!', 'NGAUM! Aku {boss}, penjaga pintu ini. Hanya yang berani boleh lalu!'],
      ['talk', 'x:👩‍🌾:Farmer Mei:Peladang Mei', 'That monster is as big as a barn! Be careful, little knight!', 'Raksasa itu sebesar bangsal! Hati-hati, kesatria kecil!'],
      ['owl', 'o', 'This is the Trial of Courage. Being brave does not mean you are not scared. It means you try anyway.', 'Inilah Ujian Keberanian. Berani bukan bermaksud tidak takut. Ia bermaksud kamu tetap mencuba.'],
      ['ready', 'h', 'My knees are shaking... but I will not run. Here I come!', 'Lutut saya menggeletar... tetapi saya tidak akan lari. Saya datang!']
    ],
    v: [
      ['vbeat', 'b', 'Ooof! You were scared, but you stayed. That is real courage. The gate is yours.', 'Aduh! Kamu takut, tetapi kamu tetap bertahan. Itulah keberanian sebenar. Pintu ini milik kamu.'],
      ['item', 'n', 'Creeeak! The Royal Gate swings open, and golden light spills over the meadow.', 'Kriiik! Pintu Diraja terbuka luas, dan cahaya keemasan memenuhi padang.', '🚪'],
      ['crowd', 'x:👩‍🌾:Farmer Mei:Peladang Mei', 'Hooray! The flowers are blooming again! Thank you, {hero}!', 'Hore! Bunga-bunga mekar semula! Terima kasih, {hero}!', '🌻'],
      ['vfix', 'o', 'Stamp! Trial 1 of 10, Courage: passed! Nine more to go, young knight.', 'Cop! Ujian 1 daripada 10, Keberanian: lulus! Sembilan lagi, kesatria muda.'],
      ['villain', 'x:👤:Grey shadow:Bayang kelabu', 'Hmph! Lucky beginner. The crown will be MINE!', 'Hmph! Pemula yang bertuah. Mahkota itu akan jadi MILIK SAYA!'],
      ['vnext', 'n', 'A grey shadow zips away, laughing, toward {next}. Who was that?', 'Satu bayang kelabu meluncur pergi sambil ketawa, ke arah {next}. Siapakah itu?']
    ]
  },
  1: {
    c: [
      ['wide', 'n', 'With one trial passed, {hero} marches into Green Glade, a forest full of birdsong.', 'Dengan satu ujian lulus, {hero} berarak masuk ke Lapangan Hijau, hutan yang penuh kicauan burung.'],
      ['prob', 'n', 'Splosh! Oily barrels are leaking into the stream. The water is black and smelly.', 'Plup! Tong-tong berminyak bocor ke dalam sungai. Airnya hitam dan berbau.', '🛢️'],
      ['talk', 'x:🦌:Little Deer:Anak Rusa', 'Please help! My mama drank the water and now her tummy hurts.', 'Tolong! Ibu saya minum air itu dan sekarang perutnya sakit.'],
      ['close', 'h', 'Who would do something so mean?', 'Siapa yang sanggup buat perkara sejahat ini?', '😠'],
      ['owl', 'o', 'This is the Trial of Care. A king looks after the land, the water, and everything that lives on it.', 'Inilah Ujian Penjagaan. Raja menjaga tanah, air, dan semua yang hidup di atasnya.'],
      ['item', 'n', 'Next to a barrel lies a grey feather. It smells like smoke and mischief.', 'Di sebelah tong ada sehelai bulu kelabu. Ia berbau asap dan nakal.', '🪶'],
      ['hero', 'h', 'No time to be angry. Let us clean this glade, together!', 'Tiada masa untuk marah. Mari bersihkan lapangan ini, bersama-sama!'],
      ['crowd', 'x:🐿️:Squirrel:Tupai', 'We will help! Squirrels are great at carrying things!', 'Kami akan tolong! Tupai memang pandai mengangkat barang!', '🐿️'],
      ['foe', 'm', 'Blub blub! We like it dirty! Go away!', 'Blub blub! Kami suka kotor! Pergi dari sini!'],
      ['clash', 'n', 'Slimy monsters ooze out of the barrels. {hero} pushes them back, step by step!', 'Raksasa berlendir meleleh keluar dari tong. {hero} menolak mereka ke belakang, langkah demi langkah!'],
      ['win', 'n', 'The barrels roll away, and the stream begins to sparkle again. Fish do happy flips!', 'Tong-tong bergolek pergi, dan sungai mula berkilau semula. Ikan-ikan melompat gembira!'],
      ['talk', 'x:🦌:Little Deer:Anak Rusa', 'But look! The oldest oak tree is still turning brown...', 'Tetapi lihat! Pokok oak paling tua masih menjadi perang...']
    ],
    b: [
      ['lair', 'n', 'Deep in the glade, the Grandfather Oak creaks sadly. Its leaves fall like tears.', 'Jauh di dalam lapangan, Pokok Oak Datuk berkeriut sedih. Daunnya gugur seperti air mata.'],
      ['reveal', 'b', 'This is MY tree now! Who cares about some old, wrinkly oak?', 'Pokok ini milik AKU sekarang! Siapa peduli tentang pokok oak tua yang berkedut?'],
      ['talk', 'x:🐿️:Squirrel:Tupai', 'Hey! That tree is our home! Three hundred acorns live in there!', 'Hei! Pokok itu rumah kami! Tiga ratus biji oak tinggal di situ!'],
      ['owl', 'o', 'A good king cares even for the old and the small. Especially for them.', 'Raja yang baik menjaga yang tua dan yang kecil. Terutamanya mereka.'],
      ['ready', 'h', 'I care about this tree, and everyone in it. Stand aside, {boss}!', 'Saya peduli tentang pokok ini, dan semua yang tinggal di dalamnya. Ke tepi, {boss}!']
    ],
    v: [
      ['vbeat', 'b', 'Ow, ow! Fine, fine! I will plant ten new trees to say sorry!', 'Aduh, aduh! Baiklah, baiklah! Aku akan tanam sepuluh pokok baharu untuk minta maaf!'],
      ['item', 'n', 'Whoosh! Green leaves burst from every branch of the Grandfather Oak.', 'Wusy! Daun hijau memancar dari setiap dahan Pokok Oak Datuk.', '🌳'],
      ['crowd', 'x:🦌:Little Deer:Anak Rusa', 'Mama feels better! Thank you, {hero}! You are the best!', 'Ibu sudah sihat! Terima kasih, {hero}! Kamu yang terbaik!', '🦌'],
      ['vfix', 'o', 'Stamp! Trial 2 of 10, Care: passed! The kingdom feels a little warmer already.', 'Cop! Ujian 2 daripada 10, Penjagaan: lulus! Kerajaan sudah terasa lebih mesra.'],
      ['vnext', 'o', 'Hmm. Someone has been playing tricks in {next} too. We must hurry!', 'Hmm. Ada yang bermain helah di {next} juga. Kita mesti cepat!']
    ]
  },
  2: {
    c: [
      ['wide', 'n', 'Two trials passed! {hero} arrives at Crystal Cove, where the sea glitters like a thousand diamonds.', 'Dua ujian lulus! {hero} tiba di Teluk Kristal, tempat laut berkilau seperti seribu berlian.'],
      ['crowd', 'x:🧒:Village kids:Kanak-kanak kampung', 'Water! Water! Our taps only go drip... drip... nothing!', 'Air! Air! Paip kami cuma menitis... titik... habis!', '🧒'],
      ['prob', 'n', 'The big houses on the hill have full tanks. But the little houses by the shore are bone dry.', 'Rumah besar di atas bukit ada tangki penuh. Tetapi rumah kecil di tepi pantai kering kontang.', '🚰'],
      ['talk', 'x:🎩:Rich Mr. Bubbles:Tuan Buih yang Kaya', 'Ahem! The water goes to the important people first. That means ME.', 'Ehem! Air pergi kepada orang penting dahulu. Maksudnya SAYA.'],
      ['close', 'h', 'Everyone is important. Everyone gets thirsty!', 'Semua orang penting. Semua orang boleh dahaga!', '💧'],
      ['owl', 'o', 'This is the Trial of Fairness. A king treats every person the same, big house or small.', 'Inilah Ujian Keadilan. Raja melayan setiap orang sama rata, rumah besar atau kecil.'],
      ['item', 'h', 'I have a plan! We split the water into equal parts, so every home gets the same.', 'Saya ada rancangan! Kita bahagikan air sama banyak, supaya setiap rumah dapat sama rata.', '🗺️'],
      ['foe', 'm', 'Splish! Splash! Nobody touches our pipes!', 'Plip! Plap! Tiada siapa boleh sentuh paip kami!'],
      ['clash', 'n', 'Watery monsters spray from every pipe. {hero} ducks, jumps and splashes back!', 'Raksasa air menyembur dari setiap paip. {hero} menunduk, melompat dan memercik balik!'],
      ['win', 'n', 'Glug, glug, WHOOSH! Clean water flows to every single home.', 'Gluk, gluk, WUSY! Air bersih mengalir ke setiap rumah.'],
      ['talk', 'x:🎩:Mr. Bubbles:Tuan Buih', 'Hmph. I suppose... sharing is not so terrible. Achoo! Too much dust in my big house anyway.', 'Hmph. Mungkin... berkongsi tidaklah teruk sangat. Haci! Rumah besar saya banyak habuk pun.']
    ],
    b: [
      ['lair', 'n', 'Under the cove lies the great Crystal Tank, where all the water is kept.', 'Di bawah teluk terletak Tangki Kristal yang besar, tempat semua air disimpan.'],
      ['reveal', 'b', 'Gurgle! I sit on the tap. Water only for those who PAY me!', 'Gurgle! Aku duduk di atas paip. Air hanya untuk yang BAYAR aku!'],
      ['talk', 'x:🧒:Little Siti:Siti Kecil', 'But I only have one marble... is that enough?', 'Tetapi saya cuma ada sebiji guli... cukupkah?'],
      ['owl', 'o', 'Fair is not always easy. Stay strong, and stay fair.', 'Adil tidak selalu mudah. Kuatkan hati, dan kekal adil.'],
      ['ready', 'h', 'Keep your marble, Siti. Water belongs to everyone. Let us go!', 'Simpan guli kamu, Siti. Air milik semua orang. Mari!']
    ],
    v: [
      ['vbeat', 'b', 'Bloop... I am all drained out. You win, fair and square.', 'Blup... aku sudah kering. Kamu menang, dengan adil.'],
      ['item', 'n', 'The Crystal Tank glows blue, and its water splits into equal streams for every street.', 'Tangki Kristal bercahaya biru, dan airnya terbahagi sama rata untuk setiap jalan.', '💧'],
      ['crowd', 'x:🧒:Village kids:Kanak-kanak kampung', 'Splash party! Everybody in!', 'Pesta air! Semua masuk!', '🧒'],
      ['vfix', 'o', 'Stamp! Trial 3 of 10, Fairness: passed! You did not just win. You made it fair.', 'Cop! Ujian 3 daripada 10, Keadilan: lulus! Kamu bukan sekadar menang. Kamu menjadikannya adil.'],
      ['vnext', 'n', 'High above the sea, a path of fluffy clouds winds up to {next}. That is a LOT of steps.', 'Jauh di atas laut, laluan awan gebu berliku naik ke {next}. Itu BANYAK anak tangga.']
    ]
  },
  3: {
    c: [
      ['wide', 'n', 'Three trials passed! {hero} starts the long climb into the sky. Cloud Climb is soft, white and very, very high.', 'Tiga ujian lulus! {hero} memulakan pendakian panjang ke langit. Pendakian Awan lembut, putih dan sangat-sangat tinggi.'],
      ['prob', 'n', 'Then the fog rolls in. Thick, grey fog. {hero} cannot even see their own boots!', 'Kemudian kabus datang. Kabus kelabu yang tebal. {hero} tidak nampak but sendiri pun!', '🌫️'],
      ['talk', 'x:🐑:Cloud Sheep:Biri-biri Awan', 'Baaa! Careful! Some of these clouds are only pretend steps. Poof, and down you go!', 'Mbeek! Hati-hati! Sesetengah awan ini anak tangga palsu. Puf, dan kamu jatuh!'],
      ['close', 'h', 'I want to run to the top right now!', 'Saya mahu lari ke puncak sekarang juga!', '😤'],
      ['owl', 'o', 'This is the Trial of Patience. A king does not rush. One careful step at a time.', 'Inilah Ujian Kesabaran. Raja tidak tergesa-gesa. Satu langkah berhati-hati pada satu masa.'],
      ['hero', 'n', '{hero} takes a slow breath. Tap... tap... test the cloud. Safe! Next step.', '{hero} menarik nafas perlahan. Tuk... tuk... uji awan itu. Selamat! Langkah seterusnya.'],
      ['villain', 'x:👤:Grey shadow:Bayang kelabu', 'Hurry UP, slowcoach! At this speed you will be king when you are a hundred years old!', 'Cepatlah, si lambat! Dengan kelajuan ini, kamu jadi raja bila sudah berumur seratus tahun!'],
      ['talk', 'h', 'Thanks for the advice, but I will take my time and get it right.', 'Terima kasih atas nasihat itu, tetapi saya akan ambil masa dan buat dengan betul.'],
      ['foe', 'm', 'Boing! Boing! Bounce, bounce, fall down!', 'Boing! Boing! Lantun, lantun, jatuh!'],
      ['clash', 'n', 'Puffy monsters bounce out of the fog, trying to make {hero} slip!', 'Raksasa gebu melantun keluar dari kabus, cuba membuat {hero} tergelincir!'],
      ['win', 'n', 'At last the fog breaks. Gentle rain falls from the clouds onto the dry farms far below.', 'Akhirnya kabus pecah. Hujan lembut turun dari awan ke ladang-ladang kering jauh di bawah.']
    ],
    b: [
      ['lair', 'n', 'At the very top hangs the Cloud Bell. When it rings, the rain comes. But it is wrapped in fog.', 'Di puncak sekali tergantung Loceng Awan. Apabila ia berbunyi, hujan turun. Tetapi ia dibalut kabus.'],
      ['reveal', 'b', 'Hurry! Hurry! Hurry! Tick-tock! You will never be quick enough!', 'Cepat! Cepat! Cepat! Tik-tok! Kamu tidak akan cukup pantas!'],
      ['talk', 'x:🐑:Cloud Sheep:Biri-biri Awan', 'Baaa! It wants you to panic. Do not fall for it!', 'Mbeek! Ia mahu kamu panik. Jangan terpedaya!'],
      ['owl', 'o', 'Breathe in. Breathe out. Think first, then act.', 'Tarik nafas. Hembus. Fikir dahulu, kemudian bertindak.'],
      ['ready', 'h', 'Calm and steady. I am ready, {boss}.', 'Tenang dan mantap. Saya sudah sedia, {boss}.']
    ],
    v: [
      ['vbeat', 'b', 'Whew... I am so tired from all that rushing. You were calm the whole time!', 'Fuh... aku sangat penat tergesa-gesa. Kamu tenang sepanjang masa!'],
      ['item', 'n', 'DONG... DONG... The Cloud Bell rings across the whole sky.', 'DONG... DONG... Loceng Awan berbunyi di seluruh langit.', '🔔'],
      ['crowd', 'x:👩‍🌾:Farmers below:Peladang di bawah', 'Rain! Real rain! Our rice will grow!', 'Hujan! Hujan sebenar! Padi kami akan tumbuh!', '👩‍🌾'],
      ['vfix', 'o', 'Stamp! Trial 4 of 10, Patience: passed! Slow and steady climbs the highest.', 'Cop! Ujian 4 daripada 10, Kesabaran: lulus! Perlahan tetapi pasti, mendaki paling tinggi.'],
      ['vnext', 'n', 'Far away over {next}, the grey shadow is waiting. And this time, it has a plan.', 'Jauh di atas {next}, bayang kelabu itu sedang menunggu. Dan kali ini, ia ada rancangan.']
    ]
  },
  4: {
    c: [
      ['wide', 'n', 'Halfway! Four trials passed as {hero} reaches Rainbow Ridge, the most colourful hill in the kingdom.', 'Separuh jalan! Empat ujian lulus apabila {hero} tiba di Bukit Pelangi, bukit paling berwarna-warni di kerajaan.'],
      ['prob', 'n', 'Or it was. Today the rainbow is grey. Every colour has been stolen!', 'Atau dulunya begitu. Hari ini pelangi kelabu. Setiap warna telah dicuri!', '🩶'],
      ['villain', 'v', 'Ta-daa! Finally we meet. I am MURK, and I want the crown too!', 'Ta-da! Akhirnya kita bertemu. Aku MURK, dan aku juga mahukan mahkota itu!'],
      ['close', 'h', 'You! You leaked the barrels and blocked the water!', 'Kamu! Kamu yang bocorkan tong dan menyekat air!', '❗'],
      ['villain', 'v', 'Trials are for slowpokes. I stole the rainbow AND the Royal Badges. Look at them shine!', 'Ujian untuk si lambat. Aku curi pelangi DAN Lencana Diraja. Lihat betapa ia berkilau!'],
      ['item', 'v', 'Here. Take one. Pin it on and skip the trials. Nobody will ever know.', 'Nah. Ambil satu. Pakai dan langkau ujian. Tiada siapa akan tahu.', '🏅'],
      ['talk', 'h', 'No thanks, Murk. Nobody else would know... but I would know.', 'Tidak, terima kasih, Murk. Orang lain mungkin tidak tahu... tetapi saya tahu.'],
      ['owl', 'o', 'Hoo-hoo! This is the Trial of Honesty, and you just took the first step.', 'Hu-hu! Inilah Ujian Kejujuran, dan kamu baru sahaja mengambil langkah pertama.'],
      ['villain', 'v', 'Fine! Then my monsters will make you sorry!', 'Baiklah! Raksasa aku akan buat kamu menyesal!'],
      ['clash', 'n', 'Murk\'s monsters charge down the grey hill. {hero} fights the honest way: no tricks, no shortcuts!', 'Raksasa Murk meluru turun dari bukit kelabu. {hero} berlawan dengan jujur: tiada helah, tiada jalan pintas!'],
      ['win', 'n', 'Red, orange, yellow! With every honest answer, a stripe of colour comes back.', 'Merah, jingga, kuning! Dengan setiap jawapan jujur, satu jalur warna kembali.']
    ],
    b: [
      ['lair', 'n', 'At the top of the ridge, all the rainbow\'s colours are locked in an iron chest.', 'Di puncak bukit, semua warna pelangi dikunci di dalam peti besi.'],
      ['reveal', 'b', 'Murk says winners take shortcuts! I know a secret key. Want it?', 'Murk kata pemenang ambil jalan pintas! Aku tahu kunci rahsia. Mahu?'],
      ['villain', 'v', 'Go on, take the key! Why work hard when you can cheat?', 'Ambillah kunci itu! Kenapa susah payah kalau boleh menipu?'],
      ['owl', 'o', 'A crown won by cheating is just a heavy hat. Earn it.', 'Mahkota yang dimenangi dengan menipu cuma topi yang berat. Usahakannya.'],
      ['ready', 'h', 'No shortcuts! I will open this chest the honest way!', 'Tiada jalan pintas! Saya akan buka peti ini dengan cara yang jujur!']
    ],
    v: [
      ['vbeat', 'b', 'Clunk! The chest... it opened for the honest knight, not for the trick key!', 'Klang! Peti itu... terbuka untuk kesatria yang jujur, bukan untuk kunci helah!'],
      ['item', 'n', 'WHOOSH! Seven colours fly out of the chest and paint a giant rainbow across the sky.', 'WUSY! Tujuh warna terbang keluar dari peti dan melukis pelangi gergasi di langit.', '🌈'],
      ['crowd', 'x:🧚:Colour sprites:Pari-pari warna', 'Wheee! We are free! Thank you, honest knight!', 'Wiii! Kami sudah bebas! Terima kasih, kesatria yang jujur!', '🧚'],
      ['vfix', 'o', 'Stamp! Trial 5 of 10, Honesty: passed! Halfway to the crown!', 'Cop! Ujian 5 daripada 10, Kejujuran: lulus! Separuh jalan ke mahkota!'],
      ['villain', 'v', 'This is NOT over! You will see!', 'Ini BELUM selesai! Tengoklah nanti!'],
      ['vnext', 'n', 'Murk stomps off into the night toward {next}, dropping a stolen badge as he goes.', 'Murk menghentak kaki pergi ke dalam malam menuju {next}, sambil terjatuh satu lencana curi.']
    ]
  },
  5: {
    c: [
      ['wide', 'n', 'Five trials passed! Under a sky full of stars, {hero} begins to climb the Starlit Steps.', 'Lima ujian lulus! Di bawah langit penuh bintang, {hero} mula mendaki Tangga Bintang.'],
      ['dark', 'n', 'But the lamps on the steps have all gone out. It is so dark, {hero} can hear their own heartbeat.', 'Tetapi semua lampu di tangga sudah padam. Gelap sungguh, {hero} boleh dengar degupan jantung sendiri.', '🏮'],
      ['talk', 'x:🧳:Lost Traveller:Pengembara Sesat', 'Hello? Is someone there? I have been lost on these steps since sunset!', 'Helo? Ada sesiapa di situ? Saya sesat di tangga ini sejak matahari terbenam!'],
      ['owl', 'o', 'This is the Trial of Wisdom. Each lamp holds a riddle. Answer well, and it will shine.', 'Inilah Ujian Kebijaksanaan. Setiap lampu menyimpan teka-teki. Jawab dengan baik, dan ia akan bersinar.'],
      ['item', 'n', 'The first lamp whispers: "The more you take of me, the more you leave behind. What am I?"', 'Lampu pertama berbisik: "Semakin banyak kamu ambil, semakin banyak kamu tinggalkan. Apakah aku?"', '🏮'],
      ['close', 'h', 'Hmm... more you take, more you leave... Footsteps! The answer is footsteps!', 'Hmm... semakin diambil, semakin ditinggal... Tapak kaki! Jawapannya tapak kaki!', '💡'],
      ['win', 'n', 'FLASH! The lamp glows bright orange. The traveller cheers.', 'KILAT! Lampu itu menyala jingga terang. Pengembara itu bersorak.'],
      ['villain', 'v', 'Pfft! Lucky guess. My shadow monsters will scramble your brain!', 'Pfft! Tekaan bertuah. Raksasa bayang aku akan mengelirukan otak kamu!'],
      ['foe', 'm', 'Wrong way! Wrong answer! Wrong, wrong, wrong!', 'Salah jalan! Salah jawapan! Salah, salah, salah!'],
      ['clash', 'n', 'Tricky shadows swirl around {hero}, shouting silly answers. {hero} stays focused and thinks.', 'Bayang-bayang licik berpusing di sekeliling {hero}, menjerit jawapan mengarut. {hero} terus fokus dan berfikir.'],
      ['crowd', 'x:🧳:Travellers:Para pengembara', 'Lamp by lamp, the steps light up! We can see the way home!', 'Lampu demi lampu, tangga menjadi terang! Kami nampak jalan pulang!', '🏮']
    ],
    b: [
      ['lair', 'n', 'On the highest step stands the Great Lantern, cold and dark.', 'Di anak tangga paling tinggi berdiri Tanglung Agung, sejuk dan gelap.'],
      ['reveal', 'b', 'Answer MY riddles, little knight, or stay in the dark forever! Mwahaha!', 'Jawab teka-teki AKU, kesatria kecil, atau kekal dalam gelap selama-lamanya! Mwahaha!'],
      ['talk', 'x:🧳:Lost Traveller:Pengembara Sesat', 'Those riddles are the hardest in the world. Nobody has ever answered them!', 'Teka-teki itu paling susah di dunia. Tiada siapa pernah menjawabnya!'],
      ['owl', 'o', 'A wise king listens, thinks, then speaks. Take your time.', 'Raja yang bijak mendengar, berfikir, kemudian bercakap. Ambil masa kamu.'],
      ['ready', 'h', 'I am listening. I am thinking. Ask away, {boss}!', 'Saya mendengar. Saya berfikir. Tanyalah, {boss}!']
    ],
    v: [
      ['vbeat', 'b', 'Impossible! You answered every riddle! Even the one about the banana!', 'Mustahil! Kamu jawab setiap teka-teki! Termasuk yang tentang pisang!'],
      ['item', 'n', 'The Great Lantern bursts into light. The whole valley glows gold.', 'Tanglung Agung menyala terang. Seluruh lembah bercahaya keemasan.', '🏮'],
      ['crowd', 'x:🧳:Travellers:Para pengembara', 'We are going home! Thank you, wise knight!', 'Kami pulang! Terima kasih, kesatria yang bijak!', '🧳'],
      ['vfix', 'o', 'Stamp! Trial 6 of 10, Wisdom: passed! Your brain is as strong as your sword.', 'Cop! Ujian 6 daripada 10, Kebijaksanaan: lulus! Otak kamu sekuat pedang kamu.'],
      ['vnext', 'n', 'Then, from far away, strange echoes call from {next}: "Help... help... help..."', 'Kemudian, dari jauh, gema yang pelik memanggil dari {next}: "Tolong... tolong... tolong..."']
    ]
  },
  6: {
    c: [
      ['wide', 'n', 'Six trials passed! {hero} walks into Echo Canyon. Its red walls are so tall they touch the clouds.', 'Enam ujian lulus! {hero} berjalan masuk ke Ngarai Gema. Dindingnya yang merah begitu tinggi hingga menyentuh awan.'],
      ['prob', 'n', 'SHOUT! YELL! The canyon villagers are arguing, and their echoes bounce everywhere.', 'JERIT! PEKIK! Penduduk ngarai sedang bertengkar, dan gema mereka melantun ke mana-mana.', '🔀'],
      ['crowd', 'x:👷:Builders:Pembina', 'The bridge goes LEFT! No, RIGHT! No, UP! Nobody listens to anybody!', 'Jambatan ke KIRI! Bukan, KANAN! Bukan, ATAS! Tiada siapa mendengar sesiapa!', '👷'],
      ['close', 'h', 'Everybody is talking, but nobody is listening!', 'Semua orang bercakap, tetapi tiada siapa mendengar!', '😵'],
      ['owl', 'o', 'This is the Trial of Unity. A king brings people together.', 'Inilah Ujian Perpaduan. Raja menyatukan rakyat.'],
      ['hero', 'h', 'Everyone! Let us take turns. One voice at a time. I will listen to all of you.', 'Semua! Mari bergilir-gilir. Satu suara pada satu masa. Saya akan dengar kamu semua.'],
      ['talk', 'x:👵:Grandma Rock:Nenek Batu', 'Well, I never! Nobody has asked what I think in forty years. I think... we build it together.', 'Wah! Tiada siapa tanya pendapat saya selama empat puluh tahun. Saya rasa... kita bina bersama-sama.'],
      ['villain', 'v', 'Boo! Argue more! Shout louder! I love a good fight!', 'Bu! Bertengkar lagi! Jerit lebih kuat! Aku suka pergaduhan!'],
      ['foe', 'm', 'CRASH! BANG! We make the most noise!', 'DEBUM! DENTUM! Kami paling bising!'],
      ['clash', 'n', 'Noisy monsters crash down the canyon walls. But this time, the villagers stand WITH {hero}!', 'Raksasa bising jatuh dari dinding ngarai. Tetapi kali ini, penduduk berdiri BERSAMA {hero}!'],
      ['win', 'n', 'Working as one team, the villagers build the bridge in a single afternoon.', 'Bekerja sebagai satu pasukan, penduduk membina jambatan dalam satu petang.']
    ],
    b: [
      ['lair', 'n', 'At the bottom of the canyon lies the Unity Bell. It is cracked right down the middle.', 'Di dasar ngarai terletak Loceng Perpaduan. Ia retak tepat di tengah-tengah.'],
      ['reveal', 'b', 'SHOUT LOUDER! ARGUE MORE! A cracked bell is a happy bell!', 'JERIT LEBIH KUAT! BERTENGKAR LAGI! Loceng retak ialah loceng gembira!'],
      ['crowd', 'x:👷:Builders:Pembina', 'We are with you, {hero}! All of us!', 'Kami bersama kamu, {hero}! Kami semua!', '👷'],
      ['owl', 'o', 'Alone you are strong. Together you are unbreakable.', 'Seorang diri kamu kuat. Bersama-sama kamu tidak dapat dipatahkan.'],
      ['ready', 'h', 'Together, everyone! Let us mend that bell!', 'Bersama-sama, semua! Mari baiki loceng itu!']
    ],
    v: [
      ['vbeat', 'b', 'So... quiet... You all listened to each other. I have no power here any more.', 'Sangat... senyap... Kamu semua saling mendengar. Aku tiada kuasa di sini lagi.'],
      ['item', 'n', 'Everyone grabs a hammer. Tink, tink, tink! The Unity Bell is whole again.', 'Semua orang mengambil tukul. Ting, ting, ting! Loceng Perpaduan bercantum semula.', '🔔'],
      ['crowd', 'x:👵:Grandma Rock:Nenek Batu', 'DONNNG! Now that is a sound I have not heard in years! Bless you, child.', 'DONNNG! Itulah bunyi yang sudah bertahun-tahun saya tidak dengar! Terima kasih, nak.', '👵'],
      ['vfix', 'o', 'Stamp! Trial 7 of 10, Unity: passed! Only three trials left!', 'Cop! Ujian 7 daripada 10, Perpaduan: lulus! Tinggal tiga ujian lagi!'],
      ['vnext', 'n', 'But far ahead, the great city of {next} has gone completely dark...', 'Tetapi jauh di hadapan, kota besar {next} telah menjadi gelap gelita...']
    ]
  },
  7: {
    c: [
      ['travel', 'n', 'Seven trials passed! Hoot and {hero} ride a little cart toward the great city of Golden Gate.', 'Tujuh ujian lulus! Hoot dan {hero} menaiki kereta kecil menuju kota besar Pintu Emas.', '🏙️'],
      ['clash', 'n', 'BUMP! The cart hits a pole by the road. Wobble, wobble... the pole leans over.', 'DUM! Kereta itu terlanggar sebatang tiang di tepi jalan. Goyang, goyang... tiang itu condong.', '⚡'],
      ['prob', 'n', 'When they reach the city, every light is out. A broken power line hangs loose.', 'Apabila mereka tiba di kota, semua lampu padam. Satu kabel elektrik yang putus terjuntai.', '🔌'],
      ['crowd', 'x:🧑‍🔧:City folk:Penduduk kota', 'Who broke the line? Was it a monster? Was it a thief?', 'Siapa yang putuskan kabel? Raksasa ke? Pencuri ke?', '🧑‍🔧'],
      ['owl', 'o', 'Psst... that was the pole our cart bumped. Nobody saw us. What will you do?', 'Psst... itu tiang yang kereta kita langgar. Tiada siapa nampak kita. Apa yang kamu akan buat?'],
      ['villain', 'v', 'Easy! Blame the monsters. Everybody blames the monsters!', 'Senang! Salahkan raksasa. Semua orang salahkan raksasa!'],
      ['close', 'h', 'No. This is the Trial of Responsibility. I must own my mistake.', 'Tidak. Inilah Ujian Tanggungjawab. Saya mesti mengaku kesilapan saya.', '🙏'],
      ['crowd', 'h', 'Everyone, it was our cart. I am sorry. And I will fix it.', 'Semua, itu kereta kami. Saya minta maaf. Dan saya akan membaikinya.', '🧑‍🔧'],
      ['talk', 'x:🧑‍🔧:Engineer Kai:Jurutera Kai', 'Wow. Most people just run away. Here, take my toolbox. I will help you!', 'Wah. Kebanyakan orang lari sahaja. Nah, ambil kotak alatan saya. Saya akan tolong!'],
      ['foe', 'm', 'Bzzzt! The wires are OURS now!', 'Bzzzt! Kabel ini MILIK kami sekarang!'],
      ['clash', 'n', 'Sparky monsters zap out of the wires! {hero} holds the toolbox tight and fights on.', 'Raksasa percikan memancar keluar dari kabel! {hero} memegang kotak alatan erat-erat dan terus berlawan.'],
      ['win', 'n', 'Click! The line is mended, and the city lights up brighter than ever before.', 'Klik! Kabel dibaiki, dan kota menyala lebih terang daripada sebelumnya.']
    ],
    b: [
      ['lair', 'n', 'In the Power Tower, the great Golden Switch is jammed. The whole city still flickers.', 'Di Menara Kuasa, Suis Emas yang besar tersekat. Seluruh kota masih berkelip-kelip.'],
      ['reveal', 'b', 'Crackle! Saying sorry is for losers! Just blame someone else, like me!', 'Krak! Minta maaf untuk orang kalah! Salahkan orang lain saja, macam aku!'],
      ['talk', 'x:🧑‍🔧:Engineer Kai:Jurutera Kai', 'If you push the switch while it sparks, it could blow! Be careful!', 'Kalau kamu tolak suis itu ketika ia berpercik, ia boleh meletup! Hati-hati!'],
      ['owl', 'o', 'Owning a mistake takes more courage than any battle.', 'Mengaku kesilapan memerlukan lebih keberanian daripada mana-mana pertempuran.'],
      ['ready', 'h', 'I made the mess, so I will finish the fix. A king owns up!', 'Saya yang buat kekacauan ini, jadi saya akan habiskan pembaikannya. Raja mengaku kesilapan!']
    ],
    v: [
      ['vbeat', 'b', 'Fzzz... You said sorry AND fixed it. That is twice as strong as blaming.', 'Fzzz... Kamu minta maaf DAN membaikinya. Itu dua kali lebih kuat daripada menyalahkan orang.'],
      ['item', 'n', 'CLUNK! The Golden Switch flips. Every window in the city blazes with light.', 'KLANG! Suis Emas dipetik. Setiap tingkap di kota menyala terang.', '💡'],
      ['crowd', 'x:🧑‍🔧:City folk:Penduduk kota', 'Hip hip hooray for the knight who said sorry!', 'Hip hip hore untuk kesatria yang meminta maaf!', '🧑‍🔧'],
      ['vfix', 'o', 'Stamp! Trial 8 of 10, Responsibility: passed! Only two to go.', 'Cop! Ujian 8 daripada 10, Tanggungjawab: lulus! Tinggal dua sahaja.'],
      ['vnext', 'n', 'The road out of the city leads to {next}, glowing quietly under the moon.', 'Jalan keluar dari kota menuju ke {next}, yang bercahaya tenang di bawah bulan.']
    ]
  },
  8: {
    c: [
      ['wide', 'n', 'Eight trials passed! {hero} walks into Moon Meadow. Fireflies blink and crickets sing.', 'Lapan ujian lulus! {hero} berjalan masuk ke Padang Bulan. Kelip-kelip berkelip dan cengkerik menyanyi.'],
      ['prob', 'n', 'But last night a storm swept through. The little rabbits\' burrows are full of mud.', 'Tetapi semalam ribut melanda. Lubang arnab-arnab kecil penuh dengan lumpur.', '🐰'],
      ['talk', 'x:🐇:Baby Rabbit:Anak Arnab', 'Sniff... we have nowhere to sleep. And it is getting so cold...', 'Sedu... kami tiada tempat tidur. Dan cuaca semakin sejuk...'],
      ['owl', 'o', 'This is the Trial of Kindness. Look around. Nobody is watching here. No crowds. No cheering.', 'Inilah Ujian Kebaikan. Lihat sekeliling. Tiada siapa yang melihat di sini. Tiada orang ramai. Tiada sorakan.'],
      ['close', 'h', 'Then it is just me and the rabbits. That is all I need.', 'Kalau begitu, hanya saya dan arnab-arnab. Itu sudah cukup.', '💗'],
      ['hero', 'n', '{hero} kneels in the cold mud and starts to dig new burrows with both hands.', '{hero} melutut di dalam lumpur yang sejuk dan mula menggali lubang baharu dengan kedua-dua tangan.'],
      ['villain', 'v', 'Ha! Look at you, all muddy! No trumpets, no crown, nobody clapping. Why bother?', 'Ha! Tengok kamu, penuh lumpur! Tiada trompet, tiada mahkota, tiada tepukan. Buat apa?'],
      ['talk', 'h', 'Kindness is not for clapping, Murk. It is for the rabbits.', 'Kebaikan bukan untuk tepukan, Murk. Ia untuk arnab-arnab ini.'],
      ['villain', 'v', '...It is for the rabbits? Hmph. I... I do not get it.', '...Untuk arnab? Hmph. Aku... aku tidak faham.', 'sad'],
      ['foe', 'm', 'Splat! Splat! More mud for everybody!', 'Pap! Pap! Lebih banyak lumpur untuk semua!'],
      ['clash', 'n', 'Mischievous monsters kick mud everywhere. {hero} protects the burrows like a castle wall!', 'Raksasa nakal menendang lumpur ke merata tempat. {hero} melindungi lubang arnab seperti tembok istana!'],
      ['win', 'n', 'Snug new homes dot the meadow. One by one, the rabbits hop inside and snuggle up.', 'Rumah-rumah baharu yang selesa memenuhi padang. Satu demi satu, arnab melompat masuk dan berpelukan.']
    ],
    b: [
      ['lair', 'n', 'In the middle of the meadow, the Moon Well shines silver.', 'Di tengah-tengah padang, Perigi Bulan bersinar keperakan.'],
      ['reveal', 'b', 'Splash! I will flood the burrows! Why help? Nobody will clap for you!', 'Cebur! Aku akan banjiri lubang-lubang itu! Kenapa tolong? Tiada siapa akan bertepuk untuk kamu!'],
      ['talk', 'x:🐇:Baby Rabbit:Anak Arnab', 'Please... please do not let it wash our homes away again.', 'Tolonglah... jangan biarkan ia menghanyutkan rumah kami lagi.'],
      ['owl', 'o', 'True kindness keeps going, even when it is hard and even when no one sees.', 'Kebaikan sejati terus berjalan, walaupun susah dan walaupun tiada siapa melihat.'],
      ['ready', 'h', 'I will not let it, little one. Stay behind me.', 'Saya tidak akan biarkan, si kecil. Duduk di belakang saya.']
    ],
    v: [
      ['vbeat', 'b', 'Glub... You kept going, even with no one clapping. That is... strangely nice.', 'Gluk... Kamu terus berusaha, walaupun tiada siapa bertepuk. Itu... baik juga rupanya.'],
      ['item', 'n', 'In the morning, a moon flower is waiting beside {hero}\'s muddy boots. A gift from the rabbits.', 'Pada waktu pagi, sekuntum bunga bulan menanti di sebelah but {hero} yang berlumpur. Hadiah daripada arnab-arnab.', '🌸'],
      ['crowd', 'x:🐇:Rabbits:Arnab-arnab', 'Thank you! Thank you! You are the kindest knight in the world!', 'Terima kasih! Terima kasih! Kamu kesatria paling baik di dunia!', '🐇'],
      ['vfix', 'o', 'Stamp! Trial 9 of 10, Kindness: passed! Only one trial left. The last and the hardest.', 'Cop! Ujian 9 daripada 10, Kebaikan: lulus! Tinggal satu ujian. Yang terakhir dan paling sukar.'],
      ['villain', 'v', 'I... I will get the crown first. I have to. Then everyone will like me...', 'Aku... aku akan dapatkan mahkota dahulu. Aku mesti. Barulah semua orang akan suka aku...', 'sad'],
      ['vnext', 'n', 'Murk races toward {next}, where the crown rests on its velvet cushion.', 'Murk berlari menuju {next}, tempat mahkota terletak di atas kusyen baldunya.']
    ]
  },
  9: {
    c: [
      ['wide', 'n', 'Nine trials passed! {hero} enters the castle of Cosmic Crown. The ceiling is a sky full of real stars.', 'Sembilan ujian lulus! {hero} memasuki istana Mahkota Kosmik. Silingnya ialah langit penuh bintang sebenar.'],
      ['prob', 'n', 'CRASH! Murk has grabbed the crown! But it is far too heavy for him.', 'DEBUM! Murk telah merampas mahkota! Tetapi ia terlalu berat untuknya.', '👑'],
      ['villain', 'v', 'It is mine! Mine! Wait... why is it so heavy? Why is it getting DARK?', 'Ia milik aku! Milik aku! Tunggu... kenapa ia begitu berat? Kenapa jadi GELAP?'],
      ['dark', 'n', 'A huge storm swirls out of the crown, round and round, with Murk trapped in the middle!', 'Ribut besar berpusing keluar dari mahkota, berpusing-pusing, dengan Murk terperangkap di tengah!', '🌪️'],
      ['villain', 'v', 'Help me! Please! I only wanted people to like me...', 'Tolong aku! Tolonglah! Aku cuma mahu orang suka aku...', 'sad'],
      ['owl', 'o', 'The crown is right there, {hero}. You could take it and leave. Or...', 'Mahkota ada di situ, {hero}. Kamu boleh ambil dan pergi. Atau...'],
      ['close', 'h', 'Or I can save him. A crown is not worth more than a friend.', 'Atau saya boleh selamatkan dia. Mahkota tidak lebih berharga daripada seorang kawan.', '💪'],
      ['foe', 'm', 'ROOOAR! The storm will swallow everything!', 'NGAUUUM! Ribut ini akan menelan segala-galanya!'],
      ['clash', 'n', 'The storm turns into the biggest monsters yet. {hero} fights through them, reaching for Murk\'s hand!', 'Ribut itu bertukar menjadi raksasa paling besar. {hero} berlawan menembusi mereka, mencapai tangan Murk!'],
      ['talk', 'h', 'Grab my hand, Murk! I have got you!', 'Pegang tangan saya, Murk! Saya pegang kamu!'],
      ['win', 'n', 'Whoosh... the storm fades away. Murk is safe, wobbly but safe.', 'Wusy... ribut itu hilang. Murk selamat, terhuyung-hayang tetapi selamat.'],
      ['talk', 'x:🤴:The Old King:Raja Tua', 'Courage, care, fairness, patience, honesty, wisdom, unity, responsibility, kindness... and mercy. You are ready.', 'Keberanian, penjagaan, keadilan, kesabaran, kejujuran, kebijaksanaan, perpaduan, tanggungjawab, kebaikan... dan belas kasihan. Kamu sudah sedia.']
    ],
    b: [
      ['lair', 'n', 'But the throne room still crackles with leftover storm light. Something is rising from it.', 'Tetapi bilik takhta masih berdesir dengan sisa cahaya ribut. Sesuatu sedang bangkit darinya.'],
      ['reveal', 'b', 'I am the last of the storm! The crown belongs to the strongest, not the kindest!', 'Akulah sisa terakhir ribut! Mahkota milik yang paling kuat, bukan yang paling baik!'],
      ['villain', 'v', 'Be careful, {hero}! That is my anger, all of it in one monster! I am so sorry!', 'Hati-hati, {hero}! Itu kemarahan aku, semuanya dalam satu raksasa! Aku minta maaf!', 'sad'],
      ['owl', 'o', 'The final trial is Mercy. A true king protects everyone, even a rival.', 'Ujian terakhir ialah Belas Kasihan. Raja sejati melindungi semua orang, walaupun seorang saingan.'],
      ['ready', 'h', 'Stand behind me, Murk. Let us finish this together!', 'Berdiri di belakang saya, Murk. Mari kita tamatkan ini bersama-sama!']
    ],
    v: [
      ['vbeat', 'b', 'Your heart... is stronger than any storm. I... fade... away...', 'Hati kamu... lebih kuat daripada mana-mana ribut. Aku... hilang... lenyap...'],
      ['villain', 'v', 'I am sorry, {hero}. For everything. You earned the crown. Every bit of it.', 'Aku minta maaf, {hero}. Untuk segala-galanya. Kamu layak memiliki mahkota itu. Sepenuhnya.', 'happy'],
      ['vfix', 'o', 'Stamp! Trial 10 of 10, Mercy: passed! ALL TEN TRIALS ARE COMPLETE!', 'Cop! Ujian 10 daripada 10, Belas Kasihan: lulus! KESEMUA SEPULUH UJIAN SELESAI!'],
      ['item', 'x:🤴:The Old King:Raja Tua', 'Kneel, young knight. ...Now rise, as the new King of all the land!', 'Melutut, kesatria muda. ...Sekarang bangun, sebagai Raja baharu seluruh negeri!', '👑'],
      ['crowd', 'x:🎺:The whole kingdom:Seluruh kerajaan', 'Long live the new king! Long live {hero}!', 'Daulat Tuanku! Hidup {hero}!', '🧑'],
      ['finale', 'n', 'And the very first thing the new king does? Make Murk the Royal Rainbow Painter. The end... of the beginning!', 'Dan perkara pertama yang dilakukan raja baharu? Melantik Murk sebagai Pelukis Pelangi Diraja. Tamat... dan permulaan baharu!']
    ]
  }
};
