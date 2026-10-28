export const names = {
  huruf: ['Letters', 'Huruf'], kata: ['Words', 'Perkataan'], sukukata: ['Syllables', 'Suku kata'], lawan: ['Opposites and same meanings', 'Lawan kata dan sinonim'],
  tatabahasa: ['Grammar', 'Tatabahasa'], ayat: ['Sentences and spelling', 'Ayat dan ejaan'], bahasa: ['Proverbs and idioms', 'Peribahasa dan simpulan bahasa']
};
export default function (f) {
  f('bm', 1, [
    ["kata", "anggota", "👃", "What is this body part in Malay? 👃", "Hidung", "Apakah nama anggota badan ini? 👃", "Hidung", ["Mata", "Mulut", "Telinga"], ["Mata", "Mulut", "Telinga"]],   // v23
    ["kata", "anggota", "👂", "What is this body part in Malay? 👂", "Telinga", "Apakah nama anggota badan ini? 👂", "Telinga", ["Hidung", "Kaki", "Gigi"], ["Hidung", "Kaki", "Gigi"]],   // v23
    ["kata", "anggota", "✋", "What is this body part in Malay? ✋", "Tangan", "Apakah nama anggota badan ini? ✋", "Tangan", ["Kaki", "Perut", "Kepala"], ["Kaki", "Perut", "Kepala"]],   // v23
    ["kata", "anggota", "🦷", "What is this body part in Malay? 🦷", "Gigi", "Apakah nama anggota badan ini? 🦷", "Gigi", ["Jari", "Mata", "Mulut"], ["Jari", "Mata", "Mulut"]],   // v23
    ["kata", "anggota", "👁️", "Which body part do we use to see? (in Malay)", "Mata", "Anggota badan manakah yang kita gunakan untuk melihat?", "Mata", ["Telinga", "Hidung", "Kaki"], ["Telinga", "Hidung", "Kaki"]],   // v23
    ["kata", "salam", "🌅", "What do we say in the morning? (in Malay)", "Selamat pagi", "Apakah ucapan kita pada waktu pagi?", "Selamat pagi", ["Selamat malam", "Selamat petang", "Sama-sama"], ["Selamat malam", "Selamat petang", "Sama-sama"]],   // v23
    ["kata", "salam", "🌙", "What do we say at night? (in Malay)", "Selamat malam", "Apakah ucapan kita pada waktu malam?", "Selamat malam", ["Selamat pagi", "Selamat tengah hari", "Terima kasih"], ["Selamat pagi", "Selamat tengah hari", "Terima kasih"]],   // v23
    ["kata", "salam", "🎁", "Someone helps you. What do you say? (in Malay)", "Terima kasih", "Seseorang membantu kamu. Apakah yang kamu katakan?", "Terima kasih", ["Maaf", "Selamat malam", "Tolong"], ["Maaf", "Selamat malam", "Tolong"]],   // v23
    ["kata", "salam", "🙂", "Someone says 'Terima kasih' to you. What do you answer?", "Sama-sama", "Seseorang berkata 'Terima kasih' kepada kamu. Apakah jawapan kamu?", "Sama-sama", ["Maaf", "Tolong", "Selamat pagi"], ["Maaf", "Tolong", "Selamat pagi"]],   // v23
    ["kata", "salam", "🎉", "Which is the greeting for Hari Raya?", "Selamat Hari Raya", "Apakah ucapan untuk Hari Raya?", "Selamat Hari Raya", ["Selamat Deepavali", "Selamat Tahun Baru Cina", "Selamat malam"], ["Selamat Deepavali", "Selamat Tahun Baru Cina", "Selamat malam"]],   // v23
    ['huruf', 'abc', '🔤', "Which letter comes after H in the Malay alphabet?", "I", "Dalam abjad Melayu, huruf apakah selepas H?", "I"],
    ['huruf', 'abc', '🔤', "Which letter comes after B in the Malay alphabet?", "C", "Dalam abjad Melayu, huruf apakah selepas B?", "C"],
    ['huruf', 'abc', '🔤', "Which letter comes after K in the Malay alphabet?", "L", "Dalam abjad Melayu, huruf apakah selepas K?", "L"],
    ['huruf', 'abc', '🔤', "Which letter comes after D in the Malay alphabet?", "E", "Dalam abjad Melayu, huruf apakah selepas D?", "E"],
    ['huruf', 'abc', '🔤', "Which letter comes after E in the Malay alphabet?", "F", "Dalam abjad Melayu, huruf apakah selepas E?", "F"],
    ['huruf', 'vokal', '🅰️', "Which letter is a vowel (huruf vokal)? Hint: the first letter of 'apple'.", "A", "Yang manakah huruf vokal? Petunjuk: huruf pertama 'ayam'.", "A", ["B", "C", "D"], ["B", "C", "D"]],
    ['huruf', 'vokal', '🅰️', "Which letter is a vowel (huruf vokal)? Hint: the first letter of 'egg'.", "E", "Yang manakah huruf vokal? Petunjuk: huruf pertama 'enam'.", "E", ["F", "G", "H"], ["F", "G", "H"]],
    ['huruf', 'vokal', '🅰️', "Which letter is a vowel (huruf vokal)? Hint: the first letter of 'ink'.", "I", "Yang manakah huruf vokal? Petunjuk: huruf pertama 'ikan'.", "I", ["J", "K", "L"], ["J", "K", "L"]],
    ['huruf', 'vokal', '🅰️', "Which letter is a vowel (huruf vokal)? Hint: the first letter of 'orange'.", "O", "Yang manakah huruf vokal? Petunjuk: huruf pertama 'orang'.", "O", ["P", "Q", "R"], ["P", "Q", "R"]],
    ['huruf', 'vokal', '🅰️', "Which letter is a vowel (huruf vokal)? Hint: the first letter of 'umbrella'.", "U", "Yang manakah huruf vokal? Petunjuk: huruf pertama 'ular'.", "U", ["S", "T", "V"], ["S", "T", "V"]],
    ['kata', 'nama', '🍎', "What is 🍎 in Malay?", "Epal", "Apakah nama untuk 🍎?", "Epal"],
    ['kata', 'nama', '🐱', "What is 🐱 in Malay?", "Kucing", "Apakah nama untuk 🐱?", "Kucing"],
    ['kata', 'nama', '📖', "What is 📖 in Malay?", "Buku", "Apakah nama untuk 📖?", "Buku"],
    ['kata', 'nama', '🏠', "What is 🏠 in Malay?", "Rumah", "Apakah nama untuk 🏠?", "Rumah"],
    ['kata', 'nama', '⚽', "What is ⚽ in Malay?", "Bola", "Apakah nama untuk ⚽?", "Bola"],
    ['kata', 'nama', '🐟', "What is 🐟 in Malay?", "Ikan", "Apakah nama untuk 🐟?", "Ikan"],
    ['kata', 'nama', '🌸', "What is 🌸 in Malay?", "Bunga", "Apakah nama untuk 🌸?", "Bunga"],
    ['kata', 'nama', '🚗', "What is 🚗 in Malay?", "Kereta", "Apakah nama untuk 🚗?", "Kereta"],
    ['kata', 'nama', '🌳', "What is 🌳 in Malay?", "Pokok", "Apakah nama untuk 🌳?", "Pokok"],
    ['kata', 'nama', '🐔', "What is 🐔 in Malay?", "Ayam", "Apakah nama untuk 🐔?", "Ayam"],
    ['kata', 'nama', '🍌', "What is 🍌 in Malay?", "Pisang", "Apakah nama untuk 🍌?", "Pisang"],
    ['kata', 'nama', '🐘', "What is 🐘 in Malay?", "Gajah", "Apakah nama untuk 🐘?", "Gajah"],
    ['kata', 'nama', '🌙', "What is 🌙 in Malay?", "Bulan", "Apakah nama untuk 🌙?", "Bulan"],
    ['kata', 'nama', '⭐', "What is ⭐ in Malay?", "Bintang", "Apakah nama untuk ⭐?", "Bintang"],
    ['kata', 'nama', '💧', "What is 💧 in Malay?", "Air", "Apakah nama untuk 💧?", "Air"],
    ['lawan', 'lwn', '🐘🐭', "What is the opposite of 'besar' (big)?", "Kecil", "Apakah lawan bagi 'besar'?", "Kecil", ["Tinggi", "Panas", "Lapar"], ["Tinggi", "Panas", "Lapar"]],
    ['lawan', 'lwn', '🔥🧊', "What is the opposite of 'panas' (hot)?", "Sejuk", "Apakah lawan bagi 'panas'?", "Sejuk", ["Besar", "Cepat", "Gelap"], ["Besar", "Cepat", "Gelap"]],
    ['lawan', 'lwn', '☀️🌙', "What is the opposite of 'siang' (day)?", "Malam", "Apakah lawan bagi 'siang'?", "Malam", ["Pagi", "Petang", "Panas"], ["Pagi", "Petang", "Panas"]],
    ['lawan', 'lwn', '⬆️⬇️', "What is the opposite of 'atas' (up)?", "Bawah", "Apakah lawan bagi 'atas'?", "Bawah", ["Depan", "Dalam", "Besar"], ["Depan", "Dalam", "Besar"]]
  ]);
  f('bm', 2, [
    ["kata", "v24k2", "🦆", "Which Malay word names the animal 🦆?", "Itik", "Apakah nama haiwan 🦆 dalam bahasa Melayu?", "Itik", ["Ayam", "Burung", "Angsa"], ["Ayam", "Burung", "Angsa"]],   // v24
    ["kata", "v24k2", "🏫", "What is the Malay word for 'teacher'?", "Cikgu", "Apakah perkataan bahasa Melayu untuk 'teacher'?", "Cikgu", ["Murid", "Doktor", "Petani"], ["Murid", "Doktor", "Petani"]],   // v24
    ['sukukata', 'syl', '👏', "How many syllables are in 'kucing'?", "2", "Berapakah suku kata dalam perkataan 'kucing'?", "2"],
    ['sukukata', 'syl', '👏', "How many syllables are in 'kereta'?", "3", "Berapakah suku kata dalam perkataan 'kereta'?", "3"],
    ['sukukata', 'syl', '👏', "How many syllables are in 'sekolah'?", "3", "Berapakah suku kata dalam perkataan 'sekolah'?", "3"],
    ['sukukata', 'syl', '👏', "How many syllables are in 'buku'?", "2", "Berapakah suku kata dalam perkataan 'buku'?", "2"],
    ['sukukata', 'syl', '👏', "How many syllables are in 'pelangi'?", "3", "Berapakah suku kata dalam perkataan 'pelangi'?", "3"],
    ['sukukata', 'syl', '👏', "How many syllables are in 'kelapa'?", "3", "Berapakah suku kata dalam perkataan 'kelapa'?", "3"],
    ['sukukata', 'syl', '👏', "How many syllables are in 'ayam'?", "2", "Berapakah suku kata dalam perkataan 'ayam'?", "2"],
    ['sukukata', 'syl', '👏', "How many syllables are in 'telefon'?", "3", "Berapakah suku kata dalam perkataan 'telefon'?", "3"],
    ['tatabahasa', 'kn', '🧺', "Which word names a thing (kata nama)?", "Meja", "Yang manakah nama sesuatu benda?", "Meja", ["Lari", "Cantik", "Cepat"], ["Lari", "Cantik", "Cepat"]],
    ['tatabahasa', 'kn', '🧺', "Which word names a person (kata nama)?", "Guru", "Yang manakah nama seseorang?", "Guru", ["Makan", "Besar", "Laju"], ["Makan", "Besar", "Laju"]],
    ['tatabahasa', 'kk', '🏃', "Which word is a doing word (kata kerja)?", "Makan", "Yang manakah perkataan perbuatan (kata kerja)?", "Makan", ["Buku", "Merah", "Besar"], ["Buku", "Merah", "Besar"]],
    ['tatabahasa', 'kk', '🏃', "Which word shows an action (kata kerja)?", "Berlari", "Yang manakah menunjukkan tindakan (kata kerja)?", "Berlari", ["Kerusi", "Kecil", "Pandai"], ["Kerusi", "Kecil", "Pandai"]],
    ['tatabahasa', 'ks', '🎨', "Which word describes how something looks (kata sifat)?", "Cantik", "Yang manakah menerangkan rupa sesuatu (kata sifat)?", "Cantik", ["Pergi", "Meja", "Guru"], ["Pergi", "Meja", "Guru"]],
    ['tatabahasa', 'ks', '🎨', "Which word describes height (kata sifat)?", "Tinggi", "Yang manakah menerangkan ketinggian (kata sifat)?", "Tinggi", ["Tulis", "Pensel", "Kasut"], ["Tulis", "Pensel", "Kasut"]],
    ['tatabahasa', 'kg', '🙋', "Which word can take the place of 'Ali' (a boy) in 'Ali makan nasi'?", "Dia", "Perkataan manakah boleh menggantikan 'Ali' dalam ayat 'Ali makan nasi'?", "Dia", ["Kami", "Mereka", "Kita"], ["Kami", "Mereka", "Kita"]],
    ['lawan', 'lwn', '🐢🐇', "What is the opposite of 'cepat' (fast)?", "Lambat", "Apakah lawan bagi 'cepat'?", "Lambat", ["Laju", "Besar", "Sejuk"], ["Laju", "Besar", "Sejuk"]],
    ['lawan', 'lwn', '📏', "What is the opposite of 'panjang' (long)?", "Pendek", "Apakah lawan bagi 'panjang'?", "Pendek", ["Lebar", "Tinggi", "Berat"], ["Lebar", "Tinggi", "Berat"]],
    ['lawan', 'lwn', '🏢', "What is the opposite of 'tinggi' (tall or high) for a building?", "Rendah", "Apakah lawan bagi 'tinggi' bagi sebuah bangunan?", "Rendah", ["Kecil", "Panjang", "Sempit"], ["Kecil", "Pendek", "Sempit"]],
    ['lawan', 'lwn', '🌞🌑', "What is the opposite of 'terang' (bright)?", "Gelap", "Apakah lawan bagi 'terang'?", "Gelap", ["Panas", "Sejuk", "Basah"], ["Panas", "Sejuk", "Basah"]],
    ['lawan', 'lwn', '😃😢', "What is the opposite of 'gembira' (happy)?", "Sedih", "Apakah lawan bagi 'gembira'?", "Sedih", ["Marah", "Takut", "Lapar"], ["Marah", "Takut", "Lapar"]],
    ['lawan', 'sin', '🧠', "Which word means the same as 'pandai' (clever)?", "Bijak", "Perkataan manakah sama maksud dengan 'pandai'?", "Bijak", ["Malas", "Nakal", "Lemah"], ["Malas", "Nakal", "Lemah"]],
    ['lawan', 'sin', '🌺', "Which word means the same as 'cantik' (beautiful)?", "Indah", "Perkataan manakah sama maksud dengan 'cantik'?", "Indah", ["Hodoh", "Kotor", "Buruk"], ["Hodoh", "Kotor", "Buruk"]],
    ['kata', 'hari', '📅', "Which day comes after Monday (Isnin)?", "Selasa", "Hari apakah selepas hari Isnin?", "Selasa"],
    ['kata', 'hari', '📅', "Which day comes after Tuesday (Selasa)?", "Rabu", "Hari apakah selepas hari Selasa?", "Rabu"],
    ['kata', 'hari', '📅', "Which day comes after Wednesday (Rabu)?", "Khamis", "Hari apakah selepas hari Rabu?", "Khamis"],
    ['kata', 'hari', '📅', "Which day comes after Thursday (Khamis)?", "Jumaat", "Hari apakah selepas hari Khamis?", "Jumaat"],
    ['kata', 'hari', '📅', "Which day comes after Saturday (Sabtu)?", "Ahad", "Hari apakah selepas hari Sabtu?", "Ahad"],
    ['kata', 'kel', '👵', "What do we call our mother's or father's mother?", "Nenek", "Apakah panggilan bagi ibu kepada ibu atau bapa kita?", "Nenek", ["Kakak", "Adik", "Makcik"], ["Kakak", "Adik", "Makcik"]],
    ['ayat', 'tanda', '❓', "Which mark do we put at the end of a question?", "?", "Tanda baca apakah yang diletakkan di hujung ayat tanya?", "?", [".", "!", ","], [".", "!", ","]],
    ['ayat', 'tanda', '🔚', "Which mark do we put at the end of a normal sentence?", ".", "Tanda baca apakah yang diletakkan di hujung ayat penyata?", ".", ["?", "!", ","], ["?", "!", ","]],
    ['ayat', 'ejaan', '✏️', "Which spelling is correct for 'school'?", "sekolah", "Yang manakah ejaan yang betul untuk 'school'?", "sekolah", ["sekola", "skolah", "sekollah"], ["sekola", "skolah", "sekollah"]],
    ['ayat', 'ejaan', '✏️', "Which spelling is correct for 'happy'?", "gembira", "Yang manakah ejaan yang betul untuk 'happy'?", "gembira", ["gembera", "gimbira", "gembirah"], ["gembera", "gimbira", "gembirah"]],
    ['ayat', 'ejaan', '✏️', "Which spelling is correct for 'friend'?", "kawan", "Yang manakah ejaan yang betul untuk 'friend'?", "kawan", ["kawn", "kaan", "kowan"], ["kawn", "kaan", "kowan"]]
  ]);
  f('bm', 3, [
    ["tatabahasa", "v24t3", "🍽️", "Which word is the correct opposite of 'kenyang' (full)?", "Lapar", "Apakah lawan bagi perkataan 'kenyang'?", "Lapar", ["Dahaga", "Penat", "Sejuk"], ["Dahaga", "Penat", "Sejuk"]],   // v24
    ["huruf", "digraf", "🌸", "Which digraph is in 'bunga'?", "ng", "Digraf manakah dalam perkataan 'bunga'?", "ng", ["ny", "sy", "kh"], ["ny", "sy", "kh"]],   // v23
    ["huruf", "digraf", "🦟", "Which digraph is in 'nyamuk'?", "ny", "Digraf manakah dalam perkataan 'nyamuk'?", "ny", ["ng", "gh", "sy"], ["ng", "gh", "sy"]],   // v23
    ["huruf", "digraf", "🙏", "Which digraph is in 'syukur'?", "sy", "Digraf manakah dalam perkataan 'syukur'?", "sy", ["kh", "ny", "ng"], ["kh", "ny", "ng"]],   // v23
    ["huruf", "digraf", "📅", "Which digraph is in 'Khamis'?", "kh", "Digraf manakah dalam perkataan 'Khamis'?", "kh", ["gh", "sy", "ng"], ["gh", "sy", "ng"]],   // v23
    ["huruf", "digraf", "✂️", "How do we split 'banyak' into syllables?", "ba-nyak", "Bagaimanakah kita memecahkan 'banyak' kepada suku kata?", "ba-nyak", ["ban-yak", "bany-ak", "b-anyak"], ["ban-yak", "bany-ak", "b-anyak"]],   // v23
    ["kata", "bulan", "📅", "Which month comes after Julai?", "Ogos", "Bulan apakah selepas Julai?", "Ogos", ["Jun", "September", "Mac"], ["Jun", "September", "Mac"]],   // v23
    ["kata", "bulan", "📅", "What is the Malay word for 'March'?", "Mac", "Apakah 'March' dalam bahasa Melayu?", "Mac", ["Mei", "April", "Jun"], ["Mei", "April", "Jun"]],   // v23
    ["kata", "bulan", "📅", "What is the Malay word for 'August'?", "Ogos", "Apakah 'August' dalam bahasa Melayu?", "Ogos", ["Julai", "Oktober", "Jun"], ["Julai", "Oktober", "Jun"]],   // v23
    ["kata", "bulan", "🇲🇾", "Hari Kebangsaan is on 31 …", "Ogos", "Hari Kebangsaan disambut pada 31 …", "Ogos", ["Mac", "Disember", "Mei"], ["Mac", "Disember", "Mei"]],   // v23
    ["kata", "bulan", "📅", "Which month comes before Februari?", "Januari", "Bulan apakah sebelum Februari?", "Januari", ["Mac", "Disember", "April"], ["Mac", "Disember", "April"]],   // v23
    ["bahasa", "pantun", "📜", "How many lines does this pantun have?", "4", "Berapakah baris dalam pantun ini?", "4", ["2", "3", "6"], ["2", "3", "6"]],   // v23
    ["bahasa", "pantun", "📜", "The first two lines of a pantun are called the …", "Pembayang", "Dua baris pertama pantun dipanggil …", "Pembayang", ["Maksud", "Rangkap", "Tajuk"], ["Maksud", "Rangkap", "Tajuk"]],   // v23
    ["bahasa", "pantun", "📜", "The last two lines of a pantun carry the …", "Maksud", "Dua baris terakhir pantun membawa …", "Maksud", ["Pembayang", "Tajuk", "Rangkap"], ["Pembayang", "Tajuk", "Rangkap"]],   // v23
    ["bahasa", "pantun", "📜", "In a pantun, line 1 rhymes with line …", "3", "Dalam pantun, baris 1 berima dengan baris …", "3", ["2", "4", "1"], ["2", "4", "1"]],   // v23
    ["bahasa", "pantun", "📜", "Finish the pantun: 'Hutang emas boleh dibayar, / Hutang budi dibawa …'", "mati", "Lengkapkan pantun: 'Hutang emas boleh dibayar, / Hutang budi dibawa …'", "mati", ["lari", "pergi", "pulang"], ["lari", "pergi", "pulang"]],   // v23
    ['tatabahasa', 'pb', '🏡', "Which word goes with the counting word 'sebuah'? Sebuah ___", "rumah", "Perkataan manakah sesuai dengan penjodoh bilangan 'sebuah'? Sebuah ___", "rumah", ["kucing", "pokok", "baju"], ["kucing", "pokok", "baju"]],
    ['tatabahasa', 'pb', '🐈', "Which word goes with the counting word 'seekor'? Seekor ___", "kucing", "Perkataan manakah sesuai dengan penjodoh bilangan 'seekor'? Seekor ___", "kucing", ["rumah", "buku", "kain"], ["rumah", "buku", "kain"]],
    ['tatabahasa', 'pb', '🌳', "Which word goes with the counting word 'sebatang'? Sebatang ___", "pokok", "Perkataan manakah sesuai dengan penjodoh bilangan 'sebatang'? Sebatang ___", "pokok", ["kucing", "buku", "pisang"], ["kucing", "buku", "pisang"]],
    ['tatabahasa', 'pb', '🧣', "Which word goes with the counting word 'sehelai'? Sehelai ___", "kain", "Perkataan manakah sesuai dengan penjodoh bilangan 'sehelai'? Sehelai ___", "kain", ["pokok", "rumah", "ikan"], ["pokok", "rumah", "ikan"]],
    ['tatabahasa', 'pb', '🍎', "Which word goes with the counting word 'sebiji'? Sebiji ___", "epal", "Perkataan manakah sesuai dengan penjodoh bilangan 'sebiji'? Sebiji ___", "epal", ["kereta", "pokok", "kucing"], ["kereta", "pokok", "kucing"]],
    ['tatabahasa', 'pb', '🌸', "Which word goes with the counting word 'sekuntum'? Sekuntum ___", "bunga", "Perkataan manakah sesuai dengan penjodoh bilangan 'sekuntum'? Sekuntum ___", "bunga", ["kereta", "beg", "buku"], ["kereta", "beg", "buku"]],
    ['tatabahasa', 'pb', '🧒', "Which word goes with the counting word 'seorang'? Seorang ___", "murid", "Perkataan manakah sesuai dengan penjodoh bilangan 'seorang'? Seorang ___", "murid", ["ayam", "meja", "pokok"], ["ayam", "meja", "pokok"]],
    ['tatabahasa', 'kh', '🔗', "Fill in the blank: Ali ___ Ben bermain bola.", "dan", "Lengkapkan ayat: Ali ___ Ben bermain bola.", "dan", ["kerana", "tetapi", "atau"], ["kerana", "tetapi", "atau"]],
    ['tatabahasa', 'kh', '🔗', "Fill in the blank: Dia tidak ke sekolah ___ demam.", "kerana", "Lengkapkan ayat: Dia tidak ke sekolah ___ demam.", "kerana", ["dan", "atau", "supaya"], ["dan", "atau", "supaya"]],
    ['tatabahasa', 'kh', '🔗', "Fill in the blank: Mahu teh ___ kopi?", "atau", "Lengkapkan ayat: Mahu teh ___ kopi?", "atau", ["kerana", "dan", "tetapi"], ["kerana", "dan", "tetapi"]],
    ['tatabahasa', 'kh', '🔗', "Fill in the blank: Dia kecil ___ kuat.", "tetapi", "Lengkapkan ayat: Dia kecil ___ kuat.", "tetapi", ["kerana", "atau", "dan"], ["kerana", "atau", "dan"]],
    ['tatabahasa', 'im', '🧩', "Add the prefix 'me-' to 'baca' (read).", "membaca", "Tambahkan awalan 'me-' pada 'baca'.", "membaca", ["berbaca", "bacaan", "pembaca"], ["berbaca", "bacaan", "pembaca"]],
    ['tatabahasa', 'im', '🧩', "Add the prefix 'ber-' to 'lari' (run).", "berlari", "Tambahkan awalan 'ber-' pada 'lari'.", "berlari", ["melari", "larian", "pelari"], ["melari", "larian", "pelari"]],
    ['tatabahasa', 'im', '🧩', "Add the prefix 'pe-' to 'lari' to mean 'a person who runs'.", "pelari", "Tambahkan awalan 'pe-' pada 'lari' untuk maksud 'orang yang berlari'.", "pelari", ["berlari", "larian", "melari"], ["berlari", "larian", "melari"]],
    ['tatabahasa', 'im', '🧩', "Add the suffix '-an' to 'makan' to make a noun (food or meal).", "makanan", "Tambahkan akhiran '-an' pada 'makan' untuk membentuk kata nama.", "makanan", ["memakan", "pemakan", "bermakan"], ["memakan", "pemakan", "bermakan"]],
    ['lawan', 'lwn', '💪', "What is the opposite of 'rajin' (diligent)?", "Malas", "Apakah lawan bagi 'rajin'?", "Malas", ["Pandai", "Kuat", "Cepat"], ["Pandai", "Kuat", "Cepat"]],
    ['lawan', 'lwn', '🤝', "What is the opposite of 'jujur' (honest)?", "Curang", "Apakah lawan bagi 'jujur'?", "Curang", ["Rajin", "Berani", "Sabar"], ["Rajin", "Berani", "Sabar"]],
    ['lawan', 'lwn', '🧱', "What is the opposite of 'kasar' (rough)?", "Halus", "Apakah lawan bagi 'kasar'?", "Halus", ["Berat", "Besar", "Keras"], ["Berat", "Besar", "Keras"]],
    ['lawan', 'sin', '🏃', "Which word means the same as 'laju' (fast)?", "Pantas", "Perkataan manakah sama maksud dengan 'laju'?", "Pantas", ["Perlahan", "Lambat", "Senyap"], ["Perlahan", "Lambat", "Senyap"]],
    ['lawan', 'sin', '👨', "Which word means the same as 'bapa' (father)?", "Ayah", "Perkataan manakah sama maksud dengan 'bapa'?", "Ayah", ["Abang", "Datuk", "Pakcik"], ["Abang", "Datuk", "Pakcik"]],
    ['lawan', 'sin', '😄', "Which word means the same as 'gembira' (happy)?", "Riang", "Perkataan manakah sama maksud dengan 'gembira'?", "Riang", ["Sedih", "Marah", "Penat"], ["Sedih", "Marah", "Penat"]],
    ['bahasa', 'pb', '🐶🐱', "What does the proverb 'Bagai anjing dengan kucing' mean?", "Always quarrelling", "Apakah maksud peribahasa 'Bagai anjing dengan kucing'?", "Selalu bergaduh", ["Very good friends", "Very hungry", "Very tired"], ["Sahabat baik", "Sangat lapar", "Sangat penat"]],
    ['bahasa', 'pb', '🌾', "What does the idiom 'ringan tulang' mean?", "Hardworking", "Apakah maksud simpulan bahasa 'ringan tulang'?", "Rajin bekerja", ["Very lazy", "Very thin", "Very weak"], ["Sangat malas", "Sangat kurus", "Sangat lemah"]],
    ['bahasa', 'pb', '🗺️', "Which proverb tells us to ask when we do not know?", "Malu bertanya sesat jalan", "Peribahasa manakah menasihati kita supaya bertanya apabila tidak tahu?", "Malu bertanya sesat jalan", ["Ada udang di sebalik batu", "Seperti kacang lupakan kulit", "Bagai aur dengan tebing"], ["Ada udang di sebalik batu", "Seperti kacang lupakan kulit", "Bagai aur dengan tebing"]],
    ['bahasa', 'pb', '⛰️', "What does 'Sedikit demi sedikit, lama-lama menjadi bukit' teach us?", "Small efforts add up over time", "Apakah pengajaran peribahasa 'Sedikit demi sedikit, lama-lama menjadi bukit'?", "Usaha kecil yang berterusan akan membuahkan hasil", ["Never save money", "Hills are tall", "Do everything quickly"], ["Jangan menyimpan wang", "Bukit itu tinggi", "Buat semuanya dengan cepat"]],
    ['bahasa', 'pb', '🥜', "What does 'Seperti kacang lupakan kulit' mean?", "Forgetting the people who helped us", "Apakah maksud 'Seperti kacang lupakan kulit'?", "Melupakan orang yang pernah membantu kita", ["Loving peanuts", "Being very kind", "Planting beans"], ["Suka kacang", "Sangat baik hati", "Menanam kacang"]],
    ['bahasa', 'sb', '🪨', "What does the idiom 'kepala batu' mean?", "Stubborn", "Apakah maksud simpulan bahasa 'kepala batu'?", "Degil", ["Very clever", "Very tall", "Very kind"], ["Sangat pandai", "Sangat tinggi", "Sangat baik"]],
    ['bahasa', 'sb', '🤲', "What does the idiom 'panjang tangan' mean?", "Likes to steal", "Apakah maksud simpulan bahasa 'panjang tangan'?", "Suka mencuri", ["Has long arms", "Likes to help", "Likes to dance"], ["Mempunyai tangan yang panjang", "Suka menolong", "Suka menari"]],
    ['bahasa', 'sb', '🎒', "What does the idiom 'tangan terbuka' mean?", "Generous", "Apakah maksud simpulan bahasa 'tangan terbuka'?", "Murah hati", ["Greedy", "Angry", "Sleepy"], ["Tamak", "Marah", "Mengantuk"]],
    ['ayat', 'ejaan', '✏️', "Which spelling is correct for 'library'?", "perpustakaan", "Yang manakah ejaan yang betul untuk 'library'?", "perpustakaan", ["perputakaan", "perpustaka'an", "perpusstakaan"], ["perputakaan", "perpustaka'an", "perpusstakaan"]],
    ['ayat', 'ejaan', '✏️', "Which spelling is correct for 'teamwork'?", "kerjasama", "Yang manakah ejaan yang betul untuk 'teamwork'?", "kerjasama", ["kerjsama", "kerjesama", "kerjasamah"], ["kerja sama", "kerjesama", "kerjasamah"]],
    ['ayat', 'ayat', '📝', "Which is a correct sentence?", "Murid itu membaca buku di perpustakaan.", "Yang manakah ayat yang betul?", "Murid itu membaca buku di perpustakaan.", ["Murid itu buku membaca perpustakaan di.", "Membaca murid itu perpustakaan buku.", "Perpustakaan membaca di buku itu murid."], ["Murid itu buku membaca perpustakaan di.", "Membaca murid itu perpustakaan buku.", "Perpustakaan membaca di buku itu murid."]],
    ['ayat', 'tanda', '💬', "Which mark shows excitement, like 'Wah, cantiknya!'?", "!", "Tanda baca apakah yang menunjukkan perasaan seperti 'Wah, cantiknya'?", "!", [".", "?", ","], [".", "?", ","]]
  ]);
}
