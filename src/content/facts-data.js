/* v36: FACT TABLES. A fact is written once: a picture, its name in English and Malay, and one attribute value
   (where it lives, what it is made of, what it is called ...). The engine (facts.js) turns each fact into up to six
   kinds of question: multiple choice, true or false, fill the gap, odd one out, sort into boxes and tap the picture.
   Fifty facts and five shapes give about 250 questions without writing 250 rows, and a new fact only needs one line.

   A set (one topic) is written like this:
     id      short name                         subj  the subjects that ask it         b  [lowest age, highest age] (1 = age 4 ... 4 = age 7)
     art     1 = put "a / an" before English names (an item marked 'm' is a mass word and never gets one)
     tag     small label above the question     viz   a picture to show instead of the item (when the item would give the answer away)
     ask / tf / fill / odd / pic   the sentences, [English, Malay]. {x} = the name, {X} = the name with a capital, {v} = the value.
             fill has ___ for the gap.  odd and pic may leave out {v}.
     vals    { key: [phrase EN, phrase MS, label EN, label MS] }  the phrase finishes the sentences, the label names a sort box
     items   [picture, name EN, name MS, value key, 'm'?]
     plain   1 = no odd-one-out and no sort (the tiles would give the answer away)       nopic  1 = no tap-the-picture
     nov     1 = the names are phrases, so they are not used for the Bilingual boost word lists */
export const SETS = [
  { id: 'habitat', subj: ['sc'], b: [1, 4], art: 1, tag: ['Where animals live', 'Tempat haiwan tinggal'],
    ask: ['Where do you usually find {x}?', 'Di manakah kita biasanya jumpa {x}?'], tf: ['{X} is usually found {v}.', '{X} biasanya ada {v}.'], fill: ['{X} is usually found ___.', '{X} biasanya ada ___.'],
    odd: ['Three of these are usually found {v}. Which one is NOT?', 'Tiga daripada ini biasanya ada {v}. Yang mana BUKAN?'], pic: ['Tap the one that is usually found {v}.', 'Sentuh yang biasanya ada {v}.'],
    vals: { w: ['in the water', 'di dalam air', 'Water', 'Air'], l: ['on land', 'di darat', 'Land', 'Darat'], s: ['in the sky', 'di langit', 'Sky', 'Langit'] },
    items: [['🐟', 'fish', 'ikan', 'w'], ['🐬', 'dolphin', 'ikan lumba-lumba', 'w'], ['🐙', 'octopus', 'sotong kurita', 'w'], ['🐳', 'whale', 'ikan paus', 'w'], ['🐘', 'elephant', 'gajah', 'l'], ['🐯', 'tiger', 'harimau', 'l'], ['🐄', 'cow', 'lembu', 'l'], ['🐒', 'monkey', 'monyet', 'l'], ['🦅', 'eagle', 'helang', 's'], ['🦋', 'butterfly', 'rama-rama', 's'], ['🕊️', 'dove', 'burung merpati', 's'], ['🦜', 'parrot', 'burung kakak tua', 's']] },

  { id: 'covering', subj: ['sc'], b: [2, 4], art: 1, tag: ['Animal coverings', 'Penutup badan haiwan'],
    ask: ['What covers the body of {x}?', 'Apakah yang menutup badan {x}?'], tf: ['{X} is covered with {v}.', 'Badan {x} ditutupi {v}.'], fill: ['{X} is covered with ___.', 'Badan {x} ditutupi ___.'],
    odd: ['Three of these are covered with {v}. Which one is NOT?', 'Tiga daripada ini ditutupi {v}. Yang mana BUKAN?'], pic: ['Tap the one that is covered with {v}.', 'Sentuh yang ditutupi {v}.'],
    vals: { f: ['fur', 'bulu', 'Fur', 'Bulu'], e: ['feathers', 'bulu pelepah', 'Feathers', 'Bulu pelepah'], c: ['scales', 'sisik', 'Scales', 'Sisik'], h: ['a hard shell', 'cengkerang keras', 'Shell', 'Cengkerang'] },
    items: [['🐱', 'cat', 'kucing', 'f'], ['🐰', 'rabbit', 'arnab', 'f'], ['🐶', 'dog', 'anjing', 'f'], ['🐯', 'tiger', 'harimau', 'f'], ['🐔', 'hen', 'ayam', 'e'], ['🦆', 'duck', 'itik', 'e'], ['🦜', 'parrot', 'burung kakak tua', 'e'], ['🦢', 'swan', 'angsa', 'e'], ['🐟', 'fish', 'ikan', 'c'], ['🐍', 'snake', 'ular', 'c'], ['🐊', 'crocodile', 'buaya', 'c'], ['🦎', 'lizard', 'cicak', 'c'], ['🐢', 'turtle', 'kura-kura', 'h'], ['🐌', 'snail', 'siput', 'h'], ['🦀', 'crab', 'ketam', 'h']] },

  { id: 'diet', subj: ['sc'], b: [3, 4], art: 1, tag: ['What animals eat', 'Makanan haiwan'],
    ask: ['What is the main food of {x}?', 'Apakah makanan utama {x}?'], tf: ['The main food of {x} is {v}.', 'Makanan utama {x} ialah {v}.'], fill: ['The main food of {x} is ___.', 'Makanan utama {x} ialah ___.'],
    odd: ['Three of these mainly eat {v}. Which one does NOT?', 'Tiga daripada ini terutamanya makan {v}. Yang mana TIDAK?'], pic: ['Tap the one that mainly eats {v}.', 'Sentuh yang terutamanya makan {v}.'],
    vals: { p: ['plants', 'tumbuhan', 'Plant eaters', 'Pemakan tumbuhan'], m: ['meat', 'daging', 'Meat eaters', 'Pemakan daging'], i: ['insects', 'serangga', 'Insect eaters', 'Pemakan serangga'] },
    items: [['🐄', 'cow', 'lembu', 'p'], ['🐘', 'elephant', 'gajah', 'p'], ['🐰', 'rabbit', 'arnab', 'p'], ['🦒', 'giraffe', 'zirafah', 'p'], ['🐐', 'goat', 'kambing', 'p'], ['🐯', 'tiger', 'harimau', 'm'], ['🦁', 'lion', 'singa', 'm'], ['🐊', 'crocodile', 'buaya', 'm'], ['🦅', 'eagle', 'helang', 'm'], ['🐸', 'frog', 'katak', 'i'], ['🕷️', 'spider', 'labah-labah', 'i'], ['🦎', 'lizard', 'cicak', 'i']] },

  { id: 'matter', subj: ['sc'], b: [3, 4], art: 0, tag: ['Solid, liquid or gas', 'Pepejal, cecair atau gas'],
    ask: ['Is {x} a solid, a liquid or a gas?', 'Adakah {x} pepejal, cecair atau gas?'], tf: ['{X} is {v}.', '{X} ialah {v}.'], fill: ['{X} is ___.', '{X} ialah ___.'],
    odd: ['Three of these are {v}. Which one is NOT?', 'Tiga daripada ini ialah {v}. Yang mana BUKAN?'], pic: ['Tap the one that is {v}.', 'Sentuh yang ialah {v}.'],
    vals: { s: ['a solid', 'pepejal', 'Solid', 'Pepejal'], l: ['a liquid', 'cecair', 'Liquid', 'Cecair'], g: ['a gas', 'gas', 'Gas', 'Gas'] },
    items: [['🧊', 'ice', 'ais', 's'], ['🪨', 'stone', 'batu', 's'], ['🪵', 'wood', 'kayu', 's'], ['📖', 'a book', 'buku', 's'], ['💧', 'water', 'air', 'l'], ['🥛', 'milk', 'susu', 'l'], ['🧃', 'juice', 'jus', 'l'], ['🛢️', 'oil', 'minyak', 'l'], ['💨', 'air', 'udara', 'g'], ['♨️', 'steam', 'wap', 'g'], ['🌬️', 'wind', 'angin', 'g']] },

  { id: 'senses', subj: ['sc', 'fk'], b: [1, 4], art: 0, tag: ['Our senses', 'Deria kita'],
    ask: ['What do we use our {x} for?', 'Untuk apakah kita guna {x}?'], tf: ['We use our {x} {v}.', 'Kita guna {x} {v}.'], fill: ['We use our {x} ___.', 'Kita guna {x} ___.'],
    pic: ['Tap the part of the body we use {v}.', 'Sentuh anggota badan yang kita guna {v}.'], plain: 1,
    vals: { see: ['to see', 'untuk melihat'], hear: ['to hear', 'untuk mendengar'], smell: ['to smell', 'untuk menghidu'], taste: ['to taste', 'untuk merasa'], touch: ['to touch', 'untuk menyentuh'] },
    items: [['👁️', 'eyes', 'mata', 'see'], ['👂', 'ears', 'telinga', 'hear'], ['👃', 'nose', 'hidung', 'smell'], ['👅', 'tongue', 'lidah', 'taste'], ['✋', 'hands', 'tangan', 'touch']] },

  { id: 'plantparts', subj: ['sc'], b: [3, 4], art: 0, tag: ['Parts of a plant', 'Bahagian tumbuhan'],
    ask: ['What does the {x} of a plant do?', 'Apakah fungsi {x} tumbuhan?'], tf: ['The {x} of a plant {v}.', '{X} tumbuhan {v}.'], fill: ['The {x} of a plant ___.', '{X} tumbuhan ___.'],
    pic: ['Tap the part of the plant that {v}.', 'Sentuh bahagian tumbuhan yang {v}.'], plain: 1,
    vals: { r: ['takes in water', 'menyerap air'], s: ['holds the plant up', 'menegakkan tumbuhan'], l: ['makes food from sunlight', 'membuat makanan daripada cahaya matahari'], f: ['makes seeds', 'menghasilkan biji benih'] },
    items: [['🥕', 'root', 'akar', 'r'], ['🌿', 'stem', 'batang', 's'], ['🍃', 'leaf', 'daun', 'l'], ['🌸', 'flower', 'bunga', 'f']] },

  { id: 'floatsink', subj: ['sc'], b: [2, 4], art: 0, tag: ['Float, sink or dissolve', 'Terapung, tenggelam atau larut'], nov: 1,
    ask: ['What happens when you put {x} in water?', 'Apakah yang berlaku apabila {x} dimasukkan ke dalam air?'], tf: ['When you put {x} in water, it {v}.', 'Apabila {x} dimasukkan ke dalam air, ia {v}.'], fill: ['When you put {x} in water, it ___.', 'Apabila {x} dimasukkan ke dalam air, ia ___.'],
    odd: ['Put these in water. Three do the same thing. Which one is different?', 'Masukkan semuanya ke dalam air. Tiga melakukan perkara yang sama. Yang mana berbeza?'], pic: ['Tap the one that {v} in water.', 'Sentuh yang {v} dalam air.'],
    vals: { f: ['floats', 'terapung', 'Floats', 'Terapung'], s: ['sinks', 'tenggelam', 'Sinks', 'Tenggelam'], d: ['dissolves', 'larut', 'Dissolves', 'Larut'] },
    items: [['🪵', 'a piece of wood', 'sekeping kayu', 'f'], ['🍃', 'a leaf', 'sehelai daun', 'f'], ['🧊', 'an ice cube', 'seketul ais', 'f'], ['⚽', 'a ball', 'sebiji bola', 'f'], ['🪨', 'a stone', 'sebiji batu', 's'], ['🪙', 'a coin', 'sekeping syiling', 's'], ['🔑', 'a key', 'sebatang kunci', 's'], ['⚓', 'an anchor', 'sebuah sauh', 's'], ['🍬', 'sugar', 'gula', 'd'], ['🧂', 'salt', 'garam', 'd'], ['☕', 'instant coffee', 'kopi segera', 'd']] },

  { id: 'sides', subj: ['math'], b: [1, 4], art: 1, tag: ['Shapes and sides', 'Bentuk dan sisi'],
    ask: ['How many sides does {x} have?', 'Berapakah bilangan sisi {x}?'], tf: ['{X} has {v}.', '{X} mempunyai {v}.'], fill: ['{X} has ___.', '{X} mempunyai ___.'],
    odd: ['Three of these have {v}. Which one does NOT?', 'Tiga daripada ini mempunyai {v}. Yang mana TIDAK?'], pic: ['Tap the one that has {v}.', 'Sentuh yang mempunyai {v}.'],
    vals: { 3: ['3 sides', '3 sisi', '3 sides', '3 sisi'], 4: ['4 sides', '4 sisi', '4 sides', '4 sisi'], 8: ['8 sides', '8 sisi', '8 sides', '8 sisi'], 0: ['no straight sides', 'tiada sisi lurus', 'No straight sides', 'Tiada sisi lurus'] },
    items: [['🔺', 'triangle', 'segi tiga', '3'], ['⚠️', 'triangle road sign', 'papan tanda segi tiga', '3'], ['🟦', 'square', 'segi empat sama', '4'], ['🖼️', 'rectangle picture frame', 'bingkai gambar segi empat tepat', '4'], ['🔶', 'diamond', 'belah ketupat', '4'], ['🪟', 'window', 'tingkap', '4'], ['🛑', 'stop sign', 'papan tanda berhenti', '8'], ['⭕', 'circle', 'bulatan', '0'], ['🪙', 'coin', 'syiling', '0'], ['🛞', 'wheel', 'roda', '0'], ['🍽️', 'plate', 'pinggan', '0']] },

  { id: 'measure', subj: ['math'], b: [3, 4], art: 0, tag: ['Units of length', 'Unit panjang'], nov: 1,
    ask: ['Which unit is best for the length of {x}?', 'Unit manakah paling sesuai untuk panjang {x}?'], tf: ['We measure the length of {x} in {v}.', 'Kita ukur panjang {x} dalam {v}.'], fill: ['We measure the length of {x} in ___.', 'Kita ukur panjang {x} dalam ___.'],
    odd: ['Three of these are measured in {v}. Which one is NOT?', 'Tiga daripada ini diukur dalam {v}. Yang mana BUKAN?'], pic: ['Tap the one we measure in {v}.', 'Sentuh yang kita ukur dalam {v}.'],
    vals: { c: ['centimetres', 'sentimeter', 'Centimetres', 'Sentimeter'], m: ['metres', 'meter', 'Metres', 'Meter'], k: ['kilometres', 'kilometer', 'Kilometres', 'Kilometer'] },
    items: [['✏️', 'a pencil', 'sebatang pensel', 'c'], ['🔑', 'a key', 'sebatang kunci', 'c'], ['🍪', 'a biscuit', 'sekeping biskut', 'c'], ['🚪', 'a door', 'sebuah pintu', 'm'], ['🌳', 'a tree', 'sebatang pokok', 'm'], ['🚌', 'a bus', 'sebuah bas', 'm'], ['🏫', 'a classroom', 'sebuah bilik darjah', 'm'], ['🛣️', 'the road from Kuala Lumpur to Penang', 'jalan dari Kuala Lumpur ke Pulau Pinang', 'k'], ['✈️', 'a flight to Japan', 'penerbangan ke Jepun', 'k'], ['🚂', 'a train trip to Johor Bahru', 'perjalanan kereta api ke Johor Bahru', 'k']] },

  { id: 'groups', subj: ['bm', 'en'], b: [1, 3], art: 1, tag: ['What kind of thing?', 'Jenis benda apa?'],
    ask: ['What kind of thing is {x}?', 'Apakah jenis {x}?'], tf: ['{X} is {v}.', '{X} ialah {v}.'], fill: ['{X} is ___.', '{X} ialah ___.'],
    odd: ['Three of these belong together. Which one does NOT belong?', 'Tiga daripada ini sekumpulan. Yang mana TIDAK sekumpulan?'], pic: ['Tap the one that is {v}.', 'Sentuh yang ialah {v}.'],
    vals: { fr: ['a fruit', 'buah', 'Fruits', 'Buah-buahan'], an: ['an animal', 'haiwan', 'Animals', 'Haiwan'], ve: ['a vehicle', 'kenderaan', 'Vehicles', 'Kenderaan'], cl: ['a piece of clothing', 'pakaian', 'Clothes', 'Pakaian'], sc: ['a school thing', 'barang sekolah', 'School things', 'Barang sekolah'] },
    items: [['🍎', 'apple', 'epal', 'fr'], ['🍌', 'banana', 'pisang', 'fr'], ['🥭', 'mango', 'mangga', 'fr'], ['🍍', 'pineapple', 'nanas', 'fr'], ['🍉', 'watermelon', 'tembikai', 'fr'], ['🐱', 'cat', 'kucing', 'an'], ['🐶', 'dog', 'anjing', 'an'], ['🐘', 'elephant', 'gajah', 'an'], ['🐒', 'monkey', 'monyet', 'an'], ['🐰', 'rabbit', 'arnab', 'an'], ['🚗', 'car', 'kereta', 've'], ['🚌', 'bus', 'bas', 've'], ['🚲', 'bicycle', 'basikal', 've'], ['🚂', 'train', 'kereta api', 've'], ['🚢', 'ship', 'kapal', 've'], ['👕', 'shirt', 'baju', 'cl'], ['👟', 'shoe', 'kasut', 'cl'], ['🧢', 'cap', 'topi', 'cl'], ['👗', 'dress', 'gaun', 'cl'], ['📖', 'book', 'buku', 'sc'], ['✏️', 'pencil', 'pensel', 'sc'], ['📏', 'ruler', 'pembaris', 'sc'], ['🎒', 'school bag', 'beg sekolah', 'sc']] },

  { id: 'opposites', subj: ['en', 'bm'], b: [2, 4], art: 0, tag: ['Opposites', 'Perkataan berlawan'], nopic: 1, plain: 1,
    ask: ['What is the opposite of “{x}”?', 'Apakah lawan bagi “{x}”?'], tf: ['The opposite of “{x}” is “{v}”.', 'Lawan bagi “{x}” ialah “{v}”.'], fill: ['The opposite of “{x}” is ___.', 'Lawan bagi “{x}” ialah ___.'],
    vals: { cold: ['cold', 'sejuk'], small: ['small', 'kecil'], down: ['down', 'bawah'], sad: ['sad', 'sedih'], night: ['night', 'malam'], slow: ['slow', 'perlahan'], close: ['close', 'tutup'], empty: ['empty', 'kosong'], dark: ['dark', 'gelap'], short: ['short', 'pendek'] },
    items: [['🔥', 'hot', 'panas', 'cold'], ['🐘', 'big', 'besar', 'small'], ['⬆️', 'up', 'atas', 'down'], ['😀', 'happy', 'gembira', 'sad'], ['☀️', 'day', 'siang', 'night'], ['🐇', 'fast', 'laju', 'slow'], ['🚪', 'open', 'buka', 'close'], ['🥛', 'full', 'penuh', 'empty'], ['💡', 'light', 'cerah', 'dark'], ['🦒', 'tall', 'tinggi', 'short']] },

  { id: 'manners', subj: ['pm', 'se'], b: [1, 4], art: 0, tag: ['What do we say?', 'Apa yang kita sebut?'], nov: 1,
    ask: ['What do we say {x}?', 'Apakah yang kita sebut {x}?'], tf: ['We say “{v}” {x}.', 'Kita sebut “{v}” {x}.'], fill: ['We say “___” {x}.', 'Kita sebut “___” {x}.'],
    pic: ['Tap the picture where we say “{v}”.', 'Sentuh gambar apabila kita sebut “{v}”.'],
    vals: { th: ['thank you', 'terima kasih', 'Thank you', 'Terima kasih'], so: ['sorry', 'maaf', 'Sorry', 'Maaf'], pl: ['please', 'tolong', 'Please', 'Tolong'], gm: ['good morning', 'selamat pagi', 'Good morning', 'Selamat pagi'], gn: ['good night', 'selamat malam', 'Good night', 'Selamat malam'], ex: ['excuse me', 'tumpang lalu', 'Excuse me', 'Tumpang lalu'] },
    items: [['🎁', 'when someone gives you a gift', 'apabila seseorang memberi anda hadiah', 'th'], ['🤝', 'when someone helps you', 'apabila seseorang menolong anda', 'th'], ['🚶', 'when you bump into someone', 'apabila anda terlanggar seseorang', 'so'], ['🧸', 'when you break a friend’s toy', 'apabila anda merosakkan mainan kawan', 'so'], ['🙏', 'when you want to ask for something', 'apabila anda mahu meminta sesuatu', 'pl'], ['☀️', 'when you meet your teacher in the morning', 'apabila anda berjumpa guru pada waktu pagi', 'gm'], ['🌙', 'when you go to bed', 'apabila anda hendak tidur', 'gn'], ['🚧', 'when you need to pass through a crowd', 'apabila anda hendak lalu dalam kesesakan', 'ex']] },

  { id: 'kindness', subj: ['pm', 'se'], b: [1, 4], art: 0, tag: ['Kind or unkind?', 'Baik atau tidak baik?'],
    ask: ['Is {x} kind or unkind?', 'Adakah {x} baik atau tidak baik?'], tf: ['{X} is {v}.', '{X} adalah {v}.'], fill: ['{X} is ___.', '{X} adalah ___.'],
    odd: ['Three of these are {v}. Which one is NOT?', 'Tiga daripada ini adalah {v}. Yang mana BUKAN?'], pic: ['Tap the one that is {v}.', 'Sentuh yang adalah {v}.'],
    vals: { k: ['kind', 'baik', 'Kind', 'Baik'], u: ['unkind', 'tidak baik', 'Unkind', 'Tidak baik'] },
    items: [['🤝', 'helping a friend', 'membantu kawan', 'k'], ['🙏', 'saying thank you', 'berterima kasih', 'k'], ['🧹', 'tidying up', 'mengemas', 'k'], ['🎁', 'sharing', 'berkongsi', 'k'], ['🫂', 'comforting a sad friend', 'memujuk kawan yang sedih', 'k'], ['🚶', 'waiting in line', 'beratur', 'k'], ['🚪', 'holding the door open', 'menahan pintu', 'k'], ['👂', 'listening to others', 'mendengar orang lain', 'k'], ['😝', 'teasing', 'mengejek', 'u'], ['🗑️', 'littering', 'membuang sampah merata', 'u'], ['👊', 'hitting', 'memukul', 'u'], ['🙉', 'not listening', 'tidak mendengar kata', 'u'], ['🚷', 'pushing in a line', 'menolak semasa beratur', 'u'], ['🎒', 'taking things without asking', 'mengambil barang tanpa izin', 'u'], ['📢', 'shouting at friends', 'menjerit kepada kawan', 'u']] },

  { id: 'feelings', subj: ['se'], b: [2, 4], art: 0, tag: ['How would you feel?', 'Apakah perasaan anda?'], nov: 1,
    ask: ['How might you feel {x}?', 'Bagaimanakah perasaan anda {x}?'], tf: ['You might feel {v} {x}.', 'Anda mungkin berasa {v} {x}.'], fill: ['You might feel ___ {x}.', 'Anda mungkin berasa ___ {x}.'],
    pic: ['Tap the picture where you might feel {v}.', 'Sentuh gambar apabila anda mungkin berasa {v}.'],
    vals: { h: ['happy', 'gembira', 'Happy', 'Gembira'], s: ['sad', 'sedih', 'Sad', 'Sedih'], a: ['angry', 'marah', 'Angry', 'Marah'], f: ['scared', 'takut', 'Scared', 'Takut'], p: ['proud', 'bangga', 'Proud', 'Bangga'], n: ['nervous', 'gugup', 'Nervous', 'Gugup'] },
    items: [['🎁', 'when you get a present', 'apabila anda mendapat hadiah', 'h'], ['🎂', 'on your birthday', 'pada hari jadi anda', 'h'], ['🍦', 'when your ice cream falls on the floor', 'apabila aiskrim anda jatuh ke lantai', 's'], ['👋', 'when your best friend moves away', 'apabila kawan baik anda berpindah', 's'], ['😤', 'when someone takes your toy', 'apabila seseorang mengambil mainan anda', 'a'], ['⚡', 'when you hear loud thunder', 'apabila anda mendengar guruh yang kuat', 'f'], ['🔍', 'when you cannot find your mum', 'apabila anda tidak jumpa ibu', 'f'], ['🏆', 'when you win a game', 'apabila anda menang permainan', 'p'], ['🧩', 'when you finish a hard puzzle', 'apabila anda menyiapkan teka-teki yang sukar', 'p'], ['🏫', 'when you meet new classmates', 'apabila anda bertemu rakan sekelas baharu', 'n']] },

  { id: 'faces', subj: ['se'], b: [1, 3], art: 0, tag: ['Feeling faces', 'Muka perasaan'], plain: 1,
    ask: ['How does this face feel?', 'Bagaimanakah perasaan muka ini?'], tf: ['This face feels {v}.', 'Muka ini berasa {v}.'], fill: ['This face feels ___.', 'Muka ini berasa ___.'],
    pic: ['Tap the {v} face.', 'Sentuh muka yang {v}.'],
    vals: { h: ['happy', 'gembira'], s: ['sad', 'sedih'], a: ['angry', 'marah'], f: ['scared', 'takut'], z: ['sleepy', 'mengantuk'], u: ['surprised', 'terkejut'] },
    items: [['😀', 'face', 'muka', 'h'], ['😄', 'face', 'muka', 'h'], ['🥳', 'face', 'muka', 'h'], ['😢', 'face', 'muka', 's'], ['😭', 'face', 'muka', 's'], ['😞', 'face', 'muka', 's'], ['😠', 'face', 'muka', 'a'], ['😡', 'face', 'muka', 'a'], ['😨', 'face', 'muka', 'f'], ['😱', 'face', 'muka', 'f'], ['😴', 'face', 'muka', 'z'], ['🥱', 'face', 'muka', 'z'], ['😲', 'face', 'muka', 'u'], ['😮', 'face', 'muka', 'u']] },

  { id: 'symbols', subj: ['pk'], b: [1, 4], art: 0, tag: ['Malaysian symbols', 'Lambang Malaysia'], nov: 1, plain: 1,
    ask: ['What is {x}?', 'Apakah {x}?'], tf: ['{X} is {v}.', '{X} ialah {v}.'], fill: ['{X} is ___.', '{X} ialah ___.'],
    pic: ['Tap the picture for {v}.', 'Sentuh gambar untuk {v}.'],
    vals: { fl: ['the national flag', 'bendera kebangsaan'], fw: ['the national flower', 'bunga kebangsaan'], an: ['the national animal', 'haiwan kebangsaan'], at: ['the national anthem', 'lagu kebangsaan'], cp: ['the capital city', 'ibu negara'], mo: ['the money of Malaysia', 'wang Malaysia'], la: ['the national language', 'bahasa kebangsaan'] },
    items: [['🇲🇾', 'the Jalur Gemilang', 'Jalur Gemilang', 'fl'], ['🌺', 'the Bunga Raya', 'Bunga Raya', 'fw'], ['🐯', 'the Malayan tiger', 'Harimau Malaya', 'an'], ['🎵', 'Negaraku', 'Negaraku', 'at'], ['🏙️', 'Kuala Lumpur', 'Kuala Lumpur', 'cp'], ['💵', 'the Ringgit', 'Ringgit', 'mo'], ['🗣️', 'Bahasa Melayu', 'Bahasa Melayu', 'la']] },

  { id: 'capitals', subj: ['pk'], b: [3, 4], art: 0, tag: ['States and capitals', 'Negeri dan ibu negeri'], nov: 1, plain: 1, nopic: 1, viz: '🗺️',
    ask: ['What is the capital of {x}?', 'Apakah ibu negeri {x}?'], tf: ['The capital of {x} is {v}.', 'Ibu negeri {x} ialah {v}.'], fill: ['The capital of {x} is ___.', 'Ibu negeri {x} ialah ___.'],
    vals: { sa: ['Shah Alam', 'Shah Alam'], jb: ['Johor Bahru', 'Johor Bahru'], ip: ['Ipoh', 'Ipoh'], as: ['Alor Setar', 'Alor Setar'], kb: ['Kota Bharu', 'Kota Bharu'], kt: ['Kuala Terengganu', 'Kuala Terengganu'], kn: ['Kuantan', 'Kuantan'], se: ['Seremban', 'Seremban'], mc: ['Melaka City', 'Bandar Melaka'], gt: ['George Town', 'George Town'], ka: ['Kangar', 'Kangar'], kk: ['Kota Kinabalu', 'Kota Kinabalu'], ku: ['Kuching', 'Kuching'] },
    items: [['🗺️', 'Selangor', 'Selangor', 'sa'], ['🗺️', 'Johor', 'Johor', 'jb'], ['🗺️', 'Perak', 'Perak', 'ip'], ['🗺️', 'Kedah', 'Kedah', 'as'], ['🗺️', 'Kelantan', 'Kelantan', 'kb'], ['🗺️', 'Terengganu', 'Terengganu', 'kt'], ['🗺️', 'Pahang', 'Pahang', 'kn'], ['🗺️', 'Negeri Sembilan', 'Negeri Sembilan', 'se'], ['🗺️', 'Melaka', 'Melaka', 'mc'], ['🗺️', 'Penang', 'Pulau Pinang', 'gt'], ['🗺️', 'Perlis', 'Perlis', 'ka'], ['🗺️', 'Sabah', 'Sabah', 'kk'], ['🗺️', 'Sarawak', 'Sarawak', 'ku']] },

  { id: 'helpers', subj: ['pk', 'pm'], b: [1, 4], art: 1, tag: ['People who help us', 'Orang yang membantu kita'], plain: 1,
    ask: ['What does {x} do?', 'Apakah yang dilakukan oleh {x}?'], tf: ['{X} {v}.', '{X} {v}.'], fill: ['{X} ___.', '{X} ___.'],
    pic: ['Tap the one who {v}.', 'Sentuh orang yang {v}.'],
    vals: { sa: ['keeps us safe', 'menjaga keselamatan kita'], fi: ['puts out fires', 'memadamkan kebakaran'], dr: ['helps sick people', 'membantu orang sakit'], te: ['teaches us', 'mengajar kita'], fa: ['grows food', 'menanam makanan'], bu: ['drives people to places', 'membawa orang ke tempat'], co: ['cooks our meals', 'memasak makanan kita'] },
    items: [['👮', 'police officer', 'pegawai polis', 'sa'], ['🚒', 'firefighter', 'anggota bomba', 'fi'], ['🩺', 'doctor', 'doktor', 'dr'], ['🧑‍🏫', 'teacher', 'guru', 'te'], ['🧑‍🌾', 'farmer', 'petani', 'fa'], ['🚌', 'bus driver', 'pemandu bas', 'bu'], ['🧑‍🍳', 'cook', 'tukang masak', 'co']] },

  { id: 'foods', subj: ['fk'], b: [1, 4], art: 1, tag: ['Healthy foods', 'Makanan sihat'],
    ask: ['Is {x} a healthy food or a sweet treat?', 'Adakah {x} makanan sihat atau manisan?'], tf: ['{X} is {v}.', '{X} ialah {v}.'], fill: ['{X} is ___.', '{X} ialah ___.'],
    odd: ['Three of these are {v}. Which one is NOT?', 'Tiga daripada ini ialah {v}. Yang mana BUKAN?'], pic: ['Tap {v}.', 'Sentuh {v}.'],
    vals: { h: ['a healthy food', 'makanan sihat', 'Healthy foods', 'Makanan sihat'], t: ['a sweet treat', 'manisan', 'Sweet treats', 'Manisan'] },
    items: [['🥦', 'broccoli', 'brokoli', 'h', 'm'], ['🥕', 'carrot', 'lobak merah', 'h'], ['🍎', 'apple', 'epal', 'h'], ['🥛', 'milk', 'susu', 'h', 'm'], ['🐟', 'fish', 'ikan', 'h', 'm'], ['🍚', 'rice', 'nasi', 'h', 'm'], ['🥚', 'egg', 'telur', 'h'], ['🍌', 'banana', 'pisang', 'h'], ['🍭', 'lollipop', 'lolipop', 't'], ['🍩', 'doughnut', 'donat', 't'], ['🍬', 'sweet', 'gula-gula', 't'], ['🥤', 'fizzy drink', 'minuman bergas', 't'], ['🍰', 'cake', 'kek', 't'], ['🍫', 'chocolate', 'coklat', 't', 'm'], ['🍨', 'ice cream', 'aiskrim', 't', 'm']] },

  { id: 'safety', subj: ['fk'], b: [2, 4], art: 0, tag: ['Staying safe', 'Keselamatan diri'], nov: 1, plain: 1, viz: '🛟',
    ask: ['What should you do {x}?', 'Apakah yang patut anda buat {x}?'], tf: ['{X}, you should {v}.', '{X}, anda patut {v}.'], fill: ['{X}, you should ___.', '{X}, anda patut ___.'],
    pic: ['Tap the picture where you should {v}.', 'Sentuh gambar apabila anda patut {v}.'],
    vals: { rd: ['look right and left first', 'tengok kanan dan kiri dahulu'], fi: ['get out and call for help', 'keluar dan minta tolong'], cu: ['wash it and put on a plaster', 'basuh dan letak plaster'], su: ['drink water and stay in the shade', 'minum air dan berteduh'], st: ['say no and tell a grown-up', 'menolak dan memberitahu orang dewasa'], bi: ['wear a helmet', 'memakai topi keledar'] },
    items: [['🚸', 'when you want to cross the road', 'apabila anda hendak melintas jalan', 'rd'], ['🔥', 'if there is a fire', 'jika berlaku kebakaran', 'fi'], ['🩹', 'if you get a small cut', 'jika anda mendapat luka kecil', 'cu'], ['☀️', 'when the sun is very hot', 'apabila matahari sangat terik', 'su'], ['🚫', 'if a stranger offers you a ride', 'jika orang yang tidak dikenali mempelawa anda menumpang', 'st'], ['🚲', 'when you ride a bicycle', 'apabila anda menunggang basikal', 'bi']] },

  { id: 'colourmix', subj: ['sv'], b: [2, 4], art: 0, tag: ['Mixing colours', 'Mencampur warna'], plain: 1, viz: '🎨',
    ask: ['What colour do you make with {x}?', 'Apakah warna yang terhasil daripada {x}?'], tf: ['{X} make {v}.', '{X} menghasilkan {v}.'], fill: ['{X} make ___.', '{X} menghasilkan ___.'],
    pic: ['Tap the colour {v}.', 'Sentuh warna {v}.'],
    vals: { o: ['orange', 'oren'], g: ['green', 'hijau'], p: ['purple', 'ungu'], k: ['pink', 'merah jambu'], b: ['light blue', 'biru muda'] },
    items: [['🟧', 'red and yellow', 'merah dan kuning', 'o'], ['🟩', 'blue and yellow', 'biru dan kuning', 'g'], ['🟪', 'red and blue', 'merah dan biru', 'p'], ['🩷', 'red and white', 'merah dan putih', 'k'], ['🩵', 'blue and white', 'biru dan putih', 'b']] },

  { id: 'warmcool', subj: ['sv'], b: [1, 3], art: 0, tag: ['Warm and cool colours', 'Warna hangat dan sejuk'],
    ask: ['Is {x} a warm or a cool colour?', 'Adakah {x} warna hangat atau sejuk?'], tf: ['{X} is a {v} colour.', '{X} ialah warna {v}.'], fill: ['{X} is a ___ colour.', '{X} ialah warna ___.'],
    odd: ['Three of these are {v} colours. Which one is NOT?', 'Tiga daripada ini ialah warna {v}. Yang mana BUKAN?'], pic: ['Tap a {v} colour.', 'Sentuh warna {v}.'],
    vals: { w: ['warm', 'hangat', 'Warm', 'Hangat'], c: ['cool', 'sejuk', 'Cool', 'Sejuk'] },
    items: [['🟥', 'red', 'merah', 'w'], ['🟧', 'orange', 'oren', 'w'], ['🟨', 'yellow', 'kuning', 'w'], ['🟦', 'blue', 'biru', 'c'], ['🟩', 'green', 'hijau', 'c'], ['🟪', 'purple', 'ungu', 'c']] },

  { id: 'instruments', subj: ['mz'], b: [2, 4], art: 1, tag: ['How instruments are played', 'Cara alat muzik dimainkan'],
    ask: ['How do we play {x}?', 'Bagaimanakah kita memainkan {x}?'], tf: ['{X} is played {v}.', '{X} dimainkan {v}.'], fill: ['{X} is played ___.', '{X} dimainkan ___.'],
    odd: ['Three of these are played {v}. Which one is NOT?', 'Tiga daripada ini dimainkan {v}. Yang mana BUKAN?'], pic: ['Tap one that is played {v}.', 'Sentuh satu yang dimainkan {v}.'],
    vals: { s: ['by plucking or strumming strings', 'dengan memetik tali', 'Strings', 'Tali'], h: ['by hitting or shaking it', 'dengan memukul atau menggoncangnya', 'Hit or shake', 'Pukul atau goncang'], b: ['by blowing into it', 'dengan meniupnya', 'Blow', 'Tiup'] },
    items: [['🎸', 'guitar', 'gitar', 's'], ['🎻', 'violin', 'biola', 's'], ['🪕', 'banjo', 'banjo', 's'], ['🥁', 'drum', 'gendang', 'h'], ['🪇', 'maraca', 'marakas', 'h'], ['🔔', 'bell', 'loceng', 'h'], ['🎺', 'trumpet', 'trompet', 'b'], ['🪈', 'flute', 'seruling', 'b'], ['🎷', 'saxophone', 'saksofon', 'b']] }
];

/* extra everyday words for the Bilingual boost [picture, English, Malay] (the names inside the sets above are used too) */
export const VOCAB = [
  ['👩', 'mother', 'ibu'], ['👨', 'father', 'ayah'], ['👧', 'sister', 'kakak'], ['👦', 'brother', 'abang'], ['👵', 'grandmother', 'nenek'], ['👴', 'grandfather', 'datuk'], ['👶', 'baby', 'bayi'],
  ['🏫', 'school', 'sekolah'], ['📚', 'library', 'perpustakaan'], ['🏠', 'house', 'rumah'], ['🛏️', 'bed', 'katil'], ['🪑', 'chair', 'kerusi'], ['🚪', 'door', 'pintu'], ['🪟', 'window', 'tingkap'],
  ['🍞', 'bread', 'roti'], ['🥚', 'egg', 'telur'], ['🍵', 'tea', 'teh'], ['🥛', 'milk', 'susu'], ['💧', 'water', 'air'], ['🍚', 'rice', 'nasi'],
  ['🌳', 'tree', 'pokok'], ['🌸', 'flower', 'bunga'], ['🌊', 'sea', 'laut'], ['⛰️', 'mountain', 'gunung'], ['🌧️', 'rain', 'hujan'], ['☀️', 'sun', 'matahari'], ['🌙', 'moon', 'bulan'], ['⭐', 'star', 'bintang'],
  ['🍽️', 'eat', 'makan'], ['🥤', 'drink', 'minum'], ['😴', 'sleep', 'tidur'], ['🏃', 'run', 'lari'], ['📖', 'read', 'baca'], ['✍️', 'write', 'tulis'], ['🎤', 'sing', 'nyanyi'], ['🦘', 'jump', 'lompat'],
  ['🔴', 'red', 'merah'], ['🔵', 'blue', 'biru'], ['🟡', 'yellow', 'kuning'], ['🟢', 'green', 'hijau'], ['⚪', 'white', 'putih'], ['⚫', 'black', 'hitam'],
  ['1️⃣', 'one', 'satu'], ['2️⃣', 'two', 'dua'], ['3️⃣', 'three', 'tiga'], ['4️⃣', 'four', 'empat'], ['5️⃣', 'five', 'lima'], ['6️⃣', 'six', 'enam'], ['7️⃣', 'seven', 'tujuh'], ['8️⃣', 'eight', 'lapan'], ['9️⃣', 'nine', 'sembilan'], ['🔟', 'ten', 'sepuluh']
];
