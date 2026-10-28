export const names = {
  nombor: ['Numbers', 'Nombor'], ruang: ['Where is it?', 'Kedudukan'], pola: ['Patterns', 'Pola'], wang: ['Money', 'Wang'], masa: ['Time', 'Masa dan waktu'],
  bentuk: ['Shapes', 'Bentuk'], ukuran: ['Measuring', 'Ukuran'], data: ['Data', 'Data']
};
export default function (f) {
  f('math', 1, [
    ["nombor", "v24n1", "🖐️", "How many fingers are on two hands?", "10", "Berapakah jumlah jari pada dua tangan?", "10", ["8", "5", "12"], ["8", "5", "12"]],   // v24
    ["nombor", "v24n1", "🐞", "A ladybird has 3 spots on each wing. How many spots on 2 wings?", "6", "Seekor kumbang kura-kura ada 3 bintik pada setiap sayap. Berapakah bintik pada 2 sayap?", "6", ["5", "3", "9"], ["5", "3", "9"]],   // v24
    ["ukuran", "heavylt", "⚖️", "Which is heavier, a durian or a feather?", "A durian", "Mana lebih berat, durian atau sehelai bulu burung?", "Durian", ["A feather", "Both the same", "Neither"], ["Bulu burung", "Sama berat", "Tiada"]],   // v23
    ["ukuran", "heavylt", "🍃", "Which is lighter, a leaf or a big rock?", "A leaf", "Mana lebih ringan, sehelai daun atau batu besar?", "Sehelai daun", ["A big rock", "Both the same", "Neither"], ["Batu besar", "Sama berat", "Tiada"]],   // v23
    ["ukuran", "heavylt", "🎈", "A huge balloon and a small stone. Which is heavier?", "The small stone", "Belon yang besar dan batu yang kecil. Mana lebih berat?", "Batu yang kecil", ["The huge balloon", "Both the same", "Neither"], ["Belon yang besar", "Sama berat", "Tiada"]],   // v23
    ["ukuran", "heavylt", "🛝", "A see-saw tips down on the … side.", "Heavy", "Jongkang-jongket turun di sebelah yang …", "Berat", ["Light", "Empty", "Small"], ["Ringan", "Kosong", "Kecil"]],   // v23
    ["ukuran", "heavylt", "🎒", "Which school bag is heavier?", "The bag full of books", "Beg sekolah manakah lebih berat?", "Beg yang penuh dengan buku", ["The empty bag", "Both the same", "The bag with one pencil"], ["Beg yang kosong", "Sama berat", "Beg dengan sebatang pensel"]],   // v23
    ["pola", "abcpat", "🔁", "What comes next? 🔴 🔴 🔵 🔵 🔴 🔴 🔵 …", "🔵", "Apakah seterusnya? 🔴 🔴 🔵 🔵 🔴 🔴 🔵 …", "🔵", ["🔴", "🟢", "🟡"], ["🔴", "🟢", "🟡"]],   // v23
    ["pola", "abcpat", "🔁", "What comes next? 🔵 🟦 🔺 🔵 🟦 …", "🔺", "Apakah seterusnya? 🔵 🟦 🔺 🔵 🟦 …", "🔺", ["🔵", "🟦", "⭐"], ["🔵", "🟦", "⭐"]],   // v23
    ["pola", "abcpat", "🍎", "Which one is an AABB pattern?", "🍎 🍎 🍌 🍌 🍎 🍎 🍌 🍌", "Yang manakah corak AABB?", "🍎 🍎 🍌 🍌 🍎 🍎 🍌 🍌", ["🍎 🍌 🍎 🍌 🍎 🍌", "🍎 🍌 🍇 🍎 🍌 🍇", "🍎 🍎 🍎 🍌 🍌 🍌"], ["🍎 🍌 🍎 🍌 🍎 🍌", "🍎 🍌 🍇 🍎 🍌 🍇", "🍎 🍎 🍎 🍌 🍌 🍌"]],   // v23
    ["pola", "abcpat", "⭐", "Which one is an ABC pattern?", "⭐ 🌙 ☀️ ⭐ 🌙 ☀️", "Yang manakah corak ABC?", "⭐ 🌙 ☀️ ⭐ 🌙 ☀️", ["⭐ ⭐ 🌙 🌙 ⭐ ⭐", "⭐ 🌙 ⭐ 🌙 ⭐ 🌙", "⭐ 🌙 ☀️ ☀️ 🌙 ⭐"], ["⭐ ⭐ 🌙 🌙 ⭐ ⭐", "⭐ 🌙 ⭐ 🌙 ⭐ 🌙", "⭐ 🌙 ☀️ ☀️ 🌙 ⭐"]],   // v23
    ["pola", "abcpat", "👏", "Clap, clap, stomp, stomp, clap, clap, … What comes next?", "Stomp", "Tepuk, tepuk, hentak, hentak, tepuk, tepuk, … Apakah seterusnya?", "Hentak", ["Clap", "Jump", "Sit"], ["Tepuk", "Lompat", "Duduk"]],   // v23
    ['ruang', 'pos', '📦', "The ball is ON the box. Where is the ball?", "On top", "Bola ada DI ATAS kotak. Di manakah bola?", "Di atas", ["Under", "Inside", "Behind"], ["Di bawah", "Di dalam", "Di belakang"]],
    ['ruang', 'pos', '🐱', "The cat is UNDER the table. Where is the cat?", "Below", "Kucing ada DI BAWAH meja. Di manakah kucing?", "Di bawah", ["On top", "Beside", "Far away"], ["Di atas", "Di sebelah", "Jauh"]],
    ['ruang', 'pos', '🧸', "The toy is IN the box. Where is the toy?", "Inside", "Mainan ada DI DALAM kotak. Di manakah mainan?", "Di dalam", ["Outside", "On top", "Under"], ["Di luar", "Di atas", "Di bawah"]],
    ['ruang', 'pos', '🚗', "The red car is in FRONT of the blue car. Which car is first?", "Red car", "Kereta merah di DEPAN kereta biru. Kereta manakah di hadapan?", "Kereta merah", ["Blue car", "Both", "None"], ["Kereta biru", "Kedua-duanya", "Tiada"]],
    ['bentuk', 'shape', '🥫', "A tin can is shaped like which 3D shape?", "Cylinder", "Tin berbentuk seperti bentuk 3D yang mana?", "Silinder", ["Cube", "Sphere", "Pyramid"], ["Kubus", "Sfera", "Piramid"]],
    ['bentuk', 'shape', '🎲', "A dice is shaped like which 3D shape?", "Cube", "Dadu berbentuk seperti bentuk 3D yang mana?", "Kubus", ["Cylinder", "Sphere", "Pyramid"], ["Silinder", "Sfera", "Piramid"]],
    ['bentuk', 'shape', '⚽', "A ball is shaped like which 3D shape?", "Sphere", "Bola berbentuk seperti bentuk 3D yang mana?", "Sfera", ["Cube", "Cylinder", "Pyramid"], ["Kubus", "Silinder", "Piramid"]],
    ['pola', 'pat', '🔴', "What comes next? 🔴 🔵 🔴 🔵 …", "🔴", "Apakah seterusnya? 🔴 🔵 🔴 🔵 …", "🔴", ["🔵", "🟢", "🟡"], ["🔵", "🟢", "🟡"]],
    ['pola', 'pat', '⭐', "What comes next? ⭐ 🌙 ⭐ 🌙 …", "⭐", "Apakah seterusnya? ⭐ 🌙 ⭐ 🌙 …", "⭐", ["🌙", "☀️", "☁️"], ["🌙", "☀️", "☁️"]],
    ['pola', 'pat', '🟥', "What comes next? 🟥 🟥 🟦 🟥 🟥 …", "🟦", "Apakah seterusnya? 🟥 🟥 🟦 🟥 🟥 …", "🟦", ["🟥", "🟩", "🟨"], ["🟥", "🟩", "🟨"]],
    ['nombor', 'num', '🔢', "2 and what number make 6?", "4", "2 dan nombor apa menjadi 6?", "4"],
    ['nombor', 'num', '🔢', "3 and what number make 7?", "4", "3 dan nombor apa menjadi 7?", "4"],
    ['nombor', 'num', '🔢', "6 and what number make 10?", "4", "6 dan nombor apa menjadi 10?", "4"],
    ['nombor', 'num', '📏', "Count in tens: 10, 20, 30, ...", "40", "Bilang sepuluh-sepuluh: 10, 20, 30, ...", "40"],
    ['nombor', 'num', '🔢', "Count backwards: 5, 4, 3, ...", "2", "Bilang undur: 5, 4, 3, ...", "2"],
    ['data', 'data', '📊', "In the picture chart, there are 5 🍎 and 3 🍌. Which fruit is there more of?", "🍎 Apple", "Dalam carta gambar, 🍎 ada 5 dan 🍌 ada 3. Buah manakah lebih banyak?", "🍎 Epal", ["🍌 Banana", "Same", "None"], ["🍌 Pisang", "Sama", "Tiada"]],
    ['nombor', 'num', '✋', "How many fingers are on one hand?", "5", "Berapakah jari pada sebelah tangan?", "5"],
    ['nombor', 'num', '👀', "How many eyes do you have?", "2", "Berapakah mata yang kamu ada?", "2"],
    ['nombor', 'num', '🚲', "How many wheels does a bicycle have?", "2", "Berapakah roda sebuah basikal?", "2"],
    ['nombor', 'num', '🐱', "How many legs does a cat have?", "4", "Berapakah kaki seekor kucing?", "4"],
    ['nombor', 'num', '🔟', "What number comes after 9?", "10", "Nombor apakah selepas 9?", "10"],
    ['nombor', 'num', '1️⃣', "What number comes before 5?", "4", "Nombor apakah sebelum 5?", "4"],
    ['nombor', 'num', '🧮', "What number comes after 6?", "7", "Nombor apakah selepas 6?", "7"],
    ['nombor', 'num', '🥚', "I have 3 eggs. I get 1 more egg. How many eggs now?", "4", "Saya ada 3 biji telur. Saya dapat 1 lagi. Berapakah telur sekarang?", "4"],
    ['nombor', 'num', '🍌', "There are 5 bananas. A monkey eats 2. How many are left?", "3", "Ada 5 biji pisang. Seekor monyet makan 2. Berapakah yang tinggal?", "3"],
    ['nombor', 'num', '🔢', "Which number is the biggest? 3, 8, 5", "8", "Nombor manakah yang paling besar? 3, 8, 5", "8", ["3", "5", "2"], ["3", "5", "2"]],
    ['nombor', 'num', '🔢', "Which number is the smallest? 4, 9, 6", "4", "Nombor manakah yang paling kecil? 4, 9, 6", "4", ["9", "6", "10"], ["9", "6", "10"]],
    ['bentuk', 'shape', '🪙', "A coin is shaped like a ...", "Circle", "Duit syiling berbentuk ...", "Bulatan", ["Square", "Triangle", "Rectangle"], ["Segi empat sama", "Segi tiga", "Segi empat tepat"]],
    ['bentuk', 'shape', '🔲', "Which shape has 4 equal sides?", "Square", "Bentuk manakah ada 4 sisi yang sama panjang?", "Segi empat sama", ["Circle", "Triangle", "Star"], ["Bulatan", "Segi tiga", "Bintang"]],
    ['bentuk', 'shape', '⛺', "A tent looks like a ...", "Triangle", "Khemah kelihatan seperti ...", "Segi tiga", ["Circle", "Square", "Heart"], ["Bulatan", "Segi empat sama", "Hati"]],
    ['bentuk', 'shape', '🍕', "How many sides does a triangle have?", "3", "Berapakah sisi sebuah segi tiga?", "3"],
    ['bentuk', 'shape', '🟦', "How many sides does a square have?", "4", "Berapakah sisi sebuah segi empat sama?", "4"],
    ['ukuran', 'size', '🐘', "Which is bigger, an elephant or an ant?", "Elephant", "Yang manakah lebih besar, gajah atau semut?", "Gajah", ["Ant", "Both the same", "Neither"], ["Semut", "Sama besar", "Kedua-duanya tidak"]],
    ['ukuran', 'size', '🦒', "Which is taller, a giraffe or a cat?", "Giraffe", "Yang manakah lebih tinggi, zirafah atau kucing?", "Zirafah", ["Cat", "Both the same", "Neither"], ["Kucing", "Sama tinggi", "Kedua-duanya tidak"]],
    ['ukuran', 'size', '🪢', "Which is longer, a snake or a worm?", "Snake", "Yang manakah lebih panjang, ular atau cacing?", "Ular", ["Worm", "Both the same", "Neither"], ["Cacing", "Sama panjang", "Kedua-duanya tidak"]],
    ['masa', 'time', '🌞', "When do we see the sun?", "Daytime", "Bilakah kita nampak matahari?", "Waktu siang", ["Night", "Midnight", "Never"], ["Waktu malam", "Tengah malam", "Tidak pernah"]],
    ['masa', 'time', '🌙', "When do we sleep?", "Night", "Bilakah kita tidur?", "Waktu malam", ["Morning", "Noon", "Afternoon"], ["Pagi", "Tengah hari", "Petang"]],
    ['wang', 'money', '🪙', "Which one is money?", "Coin", "Yang manakah wang?", "Duit syiling", ["Button", "Stone", "Leaf"], ["Butang", "Batu", "Daun"]]
  ]);
  f('math', 2, [
    ["wang", "v24w2", "🪙", "You have two 50 sen coins. How much money is that?", "RM1", "Kamu ada dua syiling 50 sen. Berapakah jumlah wang itu?", "RM1", ["50 sen", "RM2", "RM10"], ["50 sen", "RM2", "RM10"]],   // v24
    ['nombor', 'num', '🧮', "What is 8 + 7?", "15", "Berapakah 8 + 7?", "15"],
    ['nombor', 'num', '🧮', "What is 14 + 9?", "23", "Berapakah 14 + 9?", "23"],
    ['nombor', 'num', '🧮', "What is 17 - 8?", "9", "Berapakah 17 - 8?", "9"],
    ['nombor', 'num', '🧮', "What is 40 - 15?", "25", "Berapakah 40 - 15?", "25"],
    ['nombor', 'num', '🔢', "What comes next? 10, 20, 30, ...", "40", "Apakah nombor seterusnya? 10, 20, 30, ...", "40"],
    ['nombor', 'num', '🔢', "What comes next? 2, 4, 6, 8, ...", "10", "Apakah nombor seterusnya? 2, 4, 6, 8, ...", "10"],
    ['nombor', 'num', '🔢', "Which number is odd?", "7", "Nombor manakah ganjil?", "7", ["4", "8", "10"], ["4", "8", "10"]],
    ['nombor', 'num', '🔢', "Which number is even?", "12", "Nombor manakah genap?", "12", ["7", "9", "11"], ["7", "9", "11"]],
    ['wang', 'money', '🪙', "How many sen are in RM1?", "100", "Berapakah sen dalam RM1?", "100", ["10", "50", "1000"], ["10", "50", "1000"]],
    ['wang', 'money', '🍬', "A sweet costs 50 sen. How much for 2 sweets?", "RM1", "Sebiji gula-gula berharga 50 sen. Berapakah harga 2 biji?", "RM1", ["50 sen", "RM2", "RM5"], ["50 sen", "RM2", "RM5"]],
    ['wang', 'money', '🛍️', "You pay RM5 for a toy that costs RM3. How much change?", "RM2", "Kamu bayar RM5 untuk mainan yang berharga RM3. Berapakah baki?", "RM2", ["RM1", "RM3", "RM8"], ["RM1", "RM3", "RM8"]],
    ['wang', 'money', '🥤', "A drink costs RM2 and a bun costs RM1. How much altogether?", "RM3", "Air berharga RM2 dan roti berharga RM1. Berapakah jumlahnya?", "RM3", ["RM1", "RM2", "RM4"], ["RM1", "RM2", "RM4"]],
    ['masa', 'time', '📅', "How many days are in one week?", "7", "Berapakah hari dalam seminggu?", "7"],
    ['masa', 'time', '📅', "How many months are in one year?", "12", "Berapakah bulan dalam setahun?", "12"],
    ['masa', 'time', '⏰', "How many hours are in one day?", "24", "Berapakah jam dalam sehari?", "24"],
    ['masa', 'time', '⏰', "How many minutes are in one hour?", "60", "Berapakah minit dalam sejam?", "60"],
    ['masa', 'time', '🗓️', "On a calendar, which day comes just before Wednesday?", "Tuesday", "Pada kalendar, hari apakah tepat sebelum hari Rabu?", "Selasa", ["Thursday", "Friday", "Sunday"], ["Khamis", "Jumaat", "Ahad"]],
    ['masa', 'time', '🗓️', "On a calendar, which day comes just before Friday?", "Thursday", "Pada kalendar, hari apakah tepat sebelum hari Jumaat?", "Khamis", ["Saturday", "Tuesday", "Monday"], ["Sabtu", "Selasa", "Isnin"]],
    ['bentuk', 'shape', '🧊', "A box shaped like a dice is called a ...", "Cube", "Kotak berbentuk dadu dipanggil ...", "Kubus", ["Sphere", "Cone", "Cylinder"], ["Sfera", "Kon", "Silinder"]],
    ['bentuk', 'shape', '⚽', "A ball has the shape of a ...", "Sphere", "Bola berbentuk ...", "Sfera", ["Cube", "Cone", "Cylinder"], ["Kubus", "Kon", "Silinder"]],
    ['bentuk', 'shape', '🍦', "An ice-cream cone has the shape of a ...", "Cone", "Kon aiskrim berbentuk ...", "Kon", ["Cube", "Sphere", "Cylinder"], ["Kubus", "Sfera", "Silinder"]],
    ['bentuk', 'shape', '🥫', "A can has the shape of a ...", "Cylinder", "Tin berbentuk ...", "Silinder", ["Cube", "Sphere", "Cone"], ["Kubus", "Sfera", "Kon"]],
    ['bentuk', 'shape', '📐', "How many sides does a rectangle have?", "4", "Berapakah sisi sebuah segi empat tepat?", "4"],
    ['ukuran', 'size', '📏', "We measure the length of a pencil in ...", "cm", "Kita mengukur panjang pensel dalam ...", "cm", ["kg", "litre", "minutes"], ["kg", "liter", "minit"]],
    ['ukuran', 'size', '⚖️', "We measure the mass of a mango in ...", "kg", "Kita mengukur jisim sebiji mangga dalam ...", "kg", ["cm", "litre", "hours"], ["cm", "liter", "jam"]],
    ['ukuran', 'size', '🥛', "We measure water in a bottle in ...", "litres", "Kita mengukur air dalam botol dalam ...", "liter", ["cm", "kg", "days"], ["cm", "kg", "hari"]],
    ['ukuran', 'size', '📏', "100 cm is the same as ...", "1 metre", "100 cm sama dengan ...", "1 meter", ["10 metres", "1 kg", "1 litre"], ["10 meter", "1 kg", "1 liter"]],
    ['data', 'data', '📊', "Ali has 5 red balls and 3 blue balls. How many balls altogether?", "8", "Ali ada 5 bola merah dan 3 bola biru. Berapakah jumlah bola?", "8"],
    ['data', 'data', '📊', "In a class, 12 like durian and 9 like mango. How many more like durian?", "3", "Dalam kelas, 12 orang suka durian dan 9 orang suka mangga. Berapa orang lebih suka durian?", "3"]
  ]);
  f('math', 3, [
    ["masa", "v24m3", "🕒", "A movie starts at 3:00 p.m. and lasts 2 hours. When does it end?", "5:00 p.m.", "Sebuah filem bermula pada 3:00 petang dan berlangsung selama 2 jam. Bilakah filem itu tamat?", "5:00 petang", ["4:00 p.m.", "6:00 p.m.", "2:00 p.m."], ["4:00 petang", "6:00 petang", "2:00 petang"]],   // v24
    ['nombor', 'num', '🧮', "What is 245 + 378?", "623", "Berapakah 245 + 378?", "623"],
    ['nombor', 'num', '🧮', "What is 1 000 - 450?", "550", "Berapakah 1 000 - 450?", "550"],
    ['nombor', 'num', '✖️', "What is 7 x 8?", "56", "Berapakah 7 x 8?", "56"],
    ['nombor', 'num', '✖️', "What is 12 x 5?", "60", "Berapakah 12 x 5?", "60"],
    ['nombor', 'num', '✖️', "What is 9 x 9?", "81", "Berapakah 9 x 9?", "81"],
    ['nombor', 'num', '➗', "What is 72 ÷ 8?", "9", "Berapakah 72 ÷ 8?", "9"],
    ['nombor', 'num', '➗', "What is 48 ÷ 6?", "8", "Berapakah 48 ÷ 6?", "8"],
    ['nombor', 'num', '🔢', "Round 47 to the nearest 10.", "50", "Bundarkan 47 kepada puluh yang terdekat.", "50", ["40", "45", "60"], ["40", "45", "60"]],
    ['nombor', 'num', '🔢', "Round 638 to the nearest 100.", "600", "Bundarkan 638 kepada ratus yang terdekat.", "600", ["700", "630", "640"], ["700", "630", "640"]],
    ['nombor', 'num', '🔢', "What is the value of the digit 7 in 3 742?", "700", "Apakah nilai digit 7 dalam 3 742?", "700", ["7", "70", "7 000"], ["7", "70", "7 000"]],
    ['nombor', 'num', '🔢', "Which number is the greatest? 4 521, 4 512, 4 251", "4 521", "Nombor manakah yang paling besar? 4 521, 4 512, 4 251", "4 521", ["4 512", "4 251", "4 125"], ["4 512", "4 251", "4 125"]],
    ['nombor', 'num', '🔢', "Which is a multiple of 6?", "18", "Yang manakah gandaan 6?", "18", ["16", "20", "25"], ["16", "20", "25"]],
    ['nombor', 'num', '🍰', "Which fraction means half?", "1/2", "Pecahan manakah bermaksud separuh?", "1/2", ["1/3", "1/4", "2/3"], ["1/3", "1/4", "2/3"]],
    ['nombor', 'num', '🍕', "A pizza is cut into 4 equal parts. You eat 1. What fraction did you eat?", "1/4", "Sebiji piza dipotong kepada 4 bahagian sama. Kamu makan 1 bahagian. Apakah pecahannya?", "1/4", ["1/3", "1/2", "3/4"], ["1/3", "1/2", "3/4"]],
    ['nombor', 'num', '🍫', "What is 1/2 of 20?", "10", "Berapakah 1/2 daripada 20?", "10", ["5", "40", "20"], ["5", "40", "20"]],
    ['nombor', 'num', '🔟', "What is 0.5 as a fraction?", "1/2", "Apakah 0.5 dalam bentuk pecahan?", "1/2", ["1/5", "1/10", "2/1"], ["1/5", "1/10", "2/1"]],
    ['wang', 'money', '🛒', "A pen costs RM2.50. How much do 2 pens cost?", "RM5.00", "Sebatang pen berharga RM2.50. Berapakah harga 2 batang?", "RM5.00", ["RM4.50", "RM2.50", "RM5.50"], ["RM4.50", "RM2.50", "RM5.50"]],
    ['wang', 'money', '💵', "You pay RM10 for a book that costs RM6.50. How much change?", "RM3.50", "Kamu bayar RM10 untuk buku berharga RM6.50. Berapakah baki?", "RM3.50", ["RM4.50", "RM3.00", "RM4.00"], ["RM4.50", "RM3.00", "RM4.00"]],
    ['wang', 'money', '🎒', "A bag costs RM25 and a bottle costs RM8. How much altogether?", "RM33", "Beg berharga RM25 dan botol berharga RM8. Berapakah jumlahnya?", "RM33", ["RM17", "RM32", "RM35"], ["RM17", "RM32", "RM35"]],
    ['wang', 'money', '💰', "You save RM5 every week. How much in 4 weeks?", "RM20", "Kamu menyimpan RM5 setiap minggu. Berapakah dalam 4 minggu?", "RM20", ["RM9", "RM15", "RM25"], ["RM9", "RM15", "RM25"]],
    ['masa', 'time', '🕒', "School starts at 7:30 a.m. and ends at 1:30 p.m. How many hours is that?", "6 hours", "Sekolah bermula pukul 7:30 pagi dan tamat pukul 1:30 petang. Berapa jamkah tempohnya?", "6 jam", ["5 hours", "7 hours", "8 hours"], ["5 jam", "7 jam", "8 jam"]],
    ['masa', 'time', '🕒', "How many minutes are in 2 hours?", "120", "Berapakah minit dalam 2 jam?", "120", ["60", "100", "200"], ["60", "100", "200"]],
    ['masa', 'time', '🕒', "How many seconds are in 1 minute?", "60", "Berapakah saat dalam 1 minit?", "60", ["30", "100", "24"], ["30", "100", "24"]],
    ['masa', 'time', '🕒', "Which month has 28 or 29 days?", "February", "Bulan manakah ada 28 atau 29 hari?", "Februari", ["January", "April", "June"], ["Januari", "April", "Jun"]],
    ['bentuk', 'shape', '📐', "A shape with 6 equal sides is called a ...", "Hexagon", "Bentuk yang ada 6 sisi sama panjang dipanggil ...", "Heksagon", ["Pentagon", "Octagon", "Triangle"], ["Pentagon", "Oktagon", "Segi tiga"]],
    ['bentuk', 'shape', '🛑', "A stop sign has 8 sides. It is an ...", "Octagon", "Papan tanda berhenti ada 8 sisi. Ia ialah ...", "Oktagon", ["Hexagon", "Pentagon", "Rectangle"], ["Heksagon", "Pentagon", "Segi empat tepat"]],
    ['bentuk', 'shape', '📐', "How many corners does a cube have?", "8", "Berapakah bucu sebuah kubus?", "8", ["4", "6", "12"], ["4", "6", "12"]],
    ['bentuk', 'shape', '📐', "A square has sides of 5 cm. What is its perimeter?", "20 cm", "Sebuah segi empat sama mempunyai sisi 5 cm. Berapakah perimeternya?", "20 cm", ["10 cm", "25 cm", "15 cm"], ["10 cm", "25 cm", "15 cm"]],
    ['bentuk', 'shape', '📐', "A rectangle is 6 cm long and 3 cm wide. What is its area?", "18 cm²", "Sebuah segi empat tepat panjangnya 6 cm dan lebarnya 3 cm. Berapakah luasnya?", "18 cm²", ["9 cm²", "12 cm²", "24 cm²"], ["9 cm²", "12 cm²", "24 cm²"]],
    ['ukuran', 'size', '📏', "How many cm are in 2 metres?", "200", "Berapakah cm dalam 2 meter?", "200", ["20", "2 000", "100"], ["20", "2 000", "100"]],
    ['ukuran', 'size', '⚖️', "How many grams are in 1 kg?", "1 000", "Berapakah gram dalam 1 kg?", "1 000", ["10", "100", "10 000"], ["10", "100", "10 000"]],
    ['ukuran', 'size', '🥛', "How many millilitres are in 1 litre?", "1 000", "Berapakah mililiter dalam 1 liter?", "1 000", ["10", "100", "10 000"], ["10", "100", "10 000"]],
    ['ukuran', 'size', '📏', "1.5 kg is the same as ...", "1 500 g", "1.5 kg sama dengan ...", "1 500 g", ["150 g", "15 g", "15 000 g"], ["150 g", "15 g", "15 000 g"]],
    ['data', 'data', '📊', "The scores are 4, 6, 8. What is the total?", "18", "Markah ialah 4, 6, 8. Berapakah jumlahnya?", "18", ["16", "14", "20"], ["16", "14", "20"]],
    ['data', 'data', '📊', "What is the average of 2, 4 and 6?", "4", "Berapakah purata bagi 2, 4 dan 6?", "4", ["3", "6", "12"], ["3", "6", "12"]],
    ['data', 'data', '📊', "In a bar chart, the tallest bar shows the ...", "Most", "Dalam carta palang, palang yang paling tinggi menunjukkan yang ...", "Paling banyak", ["Least", "Zero", "Average"], ["Paling sedikit", "Sifar", "Purata"]]
  ]);
}
