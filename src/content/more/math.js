/* v34 audit: more Math questions. Row = [topic, emoji, EN question, EN answer, [3 EN wrong], BM question, BM answer, [3 BM wrong]]. */
export const names = {};
export default function (f) {
  f('math', 1, [
    ['data', '🍎', 'There are 3 🍎 and 2 🍌. Which fruit is there more of?', 'Apples', ['Bananas', 'They are the same', 'There is no fruit'], 'Ada 3 🍎 dan 2 🍌. Buah manakah lebih banyak?', 'Epal', ['Pisang', 'Sama banyak', 'Tiada buah']],
    ['data', '🐶', 'There are 4 🐶 and 4 🐱. What can we say?', 'They are the same number', ['Dogs are more', 'Cats are more', 'There are no pets'], 'Ada 4 🐶 dan 4 🐱. Apa yang boleh kita katakan?', 'Bilangannya sama', ['Anjing lebih banyak', 'Kucing lebih banyak', 'Tiada haiwan']],
    ['data', '⭐', 'How many ⭐ are there? ⭐⭐⭐⭐', '4', ['3', '5', '6'], 'Berapakah ⭐? ⭐⭐⭐⭐', '4', ['3', '5', '6']],
    ['data', '🔴', 'There are 5 🔴 and 2 🔵. How many more 🔴 than 🔵?', '3', ['2', '5', '7'], 'Ada 5 🔴 dan 2 🔵. Berapa lebih banyak 🔴 daripada 🔵?', '3', ['2', '5', '7']],
    ['data', '🚗', 'We count 2 🚗 and 3 🚌. How many vehicles in all?', '5', ['4', '6', '1'], 'Kita kira 2 🚗 dan 3 🚌. Berapakah semua kenderaan?', '5', ['4', '6', '1']],
    ['data', '🌸', 'A tally shows |||| ||| shows|. How many is that?', '4', ['2', '5', '6'], 'Tally menunjukkan ||||. Berapakah itu?', '4', ['2', '5', '6']],
    ['masa', '🌅', 'Which part of the day is when the sun comes up?', 'Morning', ['Night', 'Evening', 'Midnight'], 'Bahagian hari manakah apabila matahari naik?', 'Pagi', ['Malam', 'Petang', 'Tengah malam']],
    ['masa', '📅', 'How many days are in a week?', '7', ['5', '6', '10'], 'Berapa hari dalam seminggu?', '7', ['5', '6', '10']],
    ['masa', '🍽️', 'Which meal do we eat in the morning?', 'Breakfast', ['Dinner', 'Supper', 'Tea at midnight'], 'Hidangan manakah yang kita makan pada waktu pagi?', 'Sarapan', ['Makan malam', 'Minum malam', 'Teh tengah malam']],
    ['masa', '⌚', 'We use a clock to tell…', 'The time', ['The weight', 'The colour', 'The shape'], 'Kita menggunakan jam untuk mengetahui…', 'Masa', ['Berat', 'Warna', 'Bentuk']],
    ['masa', '🕛', 'The short hand on a clock shows the…', 'Hour', ['Minute', 'Day', 'Month'], 'Jarum pendek pada jam menunjukkan…', 'Jam', ['Minit', 'Hari', 'Bulan']],
    ['wang', '💵', 'Which is more money?', 'RM5', ['RM1', '50 sen', '20 sen'], 'Yang manakah wang lebih banyak?', 'RM5', ['RM1', '50 sen', '20 sen']],
    ['wang', '🍬', 'A sweet costs 10 sen. How much do 2 sweets cost?', '20 sen', ['10 sen', '30 sen', '5 sen'], 'Sebiji gula-gula berharga 10 sen. Berapakah harga 2 biji?', '20 sen', ['10 sen', '30 sen', '5 sen']],
    ['wang', '🛒', 'You pay RM2 for a toy that costs RM2. How much change?', 'None', ['RM1', 'RM2', 'RM5'], 'Anda bayar RM2 untuk mainan berharga RM2. Berapakah baki?', 'Tiada baki', ['RM1', 'RM2', 'RM5']],
    ['wang', '🐷', 'Why do we save money in a piggy bank?', 'To use it later', ['To lose it', 'To throw it', 'To bury it for fun'], 'Mengapa kita menyimpan wang dalam tabung?', 'Untuk digunakan kemudian', ['Untuk menghilangkannya', 'Untuk membuangnya', 'Untuk menanamnya suka-suka']],
    ['wang', '🧒', 'Two 10 sen coins are worth…', '20 sen', ['10 sen', '30 sen', '50 sen'], 'Dua syiling 10 sen bernilai…', '20 sen', ['10 sen', '30 sen', '50 sen']],
    ['ruang', '⬆️', 'The bird is above the tree. Where is the tree?', 'Below the bird', ['Above the bird', 'Inside the bird', 'Behind the sky'], 'Burung berada di atas pokok. Di manakah pokok itu?', 'Di bawah burung', ['Di atas burung', 'Di dalam burung', 'Di belakang langit']],
    ['ruang', '📦', 'The ball is in the box. Where is the ball?', 'Inside the box', ['On the box', 'Under the box', 'Beside the box'], 'Bola berada dalam kotak. Di manakah bola?', 'Di dalam kotak', ['Di atas kotak', 'Di bawah kotak', 'Di sebelah kotak']],
    ['ruang', '🪑', 'The cat is under the chair. Where is the cat?', 'Below the chair', ['On the chair', 'Inside the chair', 'Above the chair'], 'Kucing berada di bawah kerusi. Di manakah kucing?', 'Di bawah kerusi', ['Di atas kerusi', 'Di dalam kerusi', 'Di atas kerusi lagi']]
  ]);
  f('math', 3, [
    ['data', '📊', 'A bar chart shows 6 apples and 4 bananas. How many more apples?', '2', ['1', '3', '10'], 'Carta palang menunjukkan 6 epal dan 4 pisang. Berapa lebih banyak epal?', '2', ['1', '3', '10']],
    ['data', '📊', 'In a chart: red 5, blue 8, green 3. Which colour is the most popular?', 'Blue', ['Red', 'Green', 'They are equal'], 'Dalam carta: merah 5, biru 8, hijau 3. Warna manakah paling popular?', 'Biru', ['Merah', 'Hijau', 'Sama banyak']],
    ['data', '📊', 'In a chart: red 5, blue 8, green 3. How many votes in all?', '16', ['13', '15', '18'], 'Dalam carta: merah 5, biru 8, hijau 3. Berapakah jumlah undi?', '16', ['13', '15', '18']],
    ['data', '📈', 'The tally |||| ||| shows how many?', '8', ['7', '9', '6'], 'Tally |||| ||| menunjukkan berapa?', '8', ['7', '9', '6']],
    ['data', '🐾', 'The most common pet in class is shown by the tallest bar. Which bar do we look at?', 'The tallest bar', ['The shortest bar', 'The thinnest bar', 'The first bar'], 'Haiwan peliharaan paling biasa ditunjukkan oleh palang tertinggi. Palang manakah kita lihat?', 'Palang tertinggi', ['Palang terpendek', 'Palang paling nipis', 'Palang pertama']],
    ['data', '🏆', 'Scores: Ali 12, Siti 15, Raj 9. Who scored the least?', 'Raj', ['Ali', 'Siti', 'They are equal'], 'Markah: Ali 12, Siti 15, Raj 9. Siapa mendapat markah paling rendah?', 'Raj', ['Ali', 'Siti', 'Sama']],
    ['masa', '🕑', 'School ends at 1:00 p.m. After 30 minutes we eat lunch. What time is lunch?', '1:30 p.m.', ['2:00 p.m.', '12:30 p.m.', '1:15 p.m.'], 'Sekolah tamat pada 1:00 petang. Selepas 30 minit kita makan tengah hari. Pukul berapa itu?', '1:30 petang', ['2:00 petang', '12:30 petang', '1:15 petang']],
    ['masa', '⏰', 'How many minutes are in 1 hour?', '60', ['30', '100', '24'], 'Berapa minit dalam 1 jam?', '60', ['30', '100', '24']],
    ['masa', '📆', 'How many months are in a year?', '12', ['10', '11', '13'], 'Berapa bulan dalam setahun?', '12', ['10', '11', '13']],
    ['masa', '⏱️', 'A half hour is how many minutes?', '30', ['15', '45', '60'], 'Setengah jam ialah berapa minit?', '30', ['15', '45', '60']],
    ['masa', '🌆', 'A film starts at 4:00 p.m. and lasts 1 hour. When does it end?', '5:00 p.m.', ['3:00 p.m.', '4:30 p.m.', '6:00 p.m.'], 'Sebuah filem bermula pada 4:00 petang dan berlangsung 1 jam. Bila ia tamat?', '5:00 petang', ['3:00 petang', '4:30 petang', '6:00 petang']],
    ['wang', '🛍️', 'A pen costs RM3 and a book costs RM5. How much for both?', 'RM8', ['RM2', 'RM7', 'RM15'], 'Pen berharga RM3 dan buku berharga RM5. Berapa untuk kedua-duanya?', 'RM8', ['RM2', 'RM7', 'RM15']],
    ['wang', '💰', 'You have RM10 and spend RM4. How much is left?', 'RM6', ['RM4', 'RM14', 'RM5'], 'Anda ada RM10 dan membelanjakan RM4. Berapa yang tinggal?', 'RM6', ['RM4', 'RM14', 'RM5']],
    ['wang', '🪙', 'Which two coins make 70 sen?', '50 sen and 20 sen', ['50 sen and 50 sen', '10 sen and 10 sen', '20 sen and 20 sen'], 'Dua syiling manakah menjadi 70 sen?', '50 sen dan 20 sen', ['50 sen dan 50 sen', '10 sen dan 10 sen', '20 sen dan 20 sen']],
    ['wang', '🧁', 'A cupcake costs RM2. How much for 4 cupcakes?', 'RM8', ['RM6', 'RM4', 'RM10'], 'Sebiji kek cawan berharga RM2. Berapa untuk 4 biji?', 'RM8', ['RM6', 'RM4', 'RM10']],
    ['ukuran', '📏', 'Which unit measures how long a pencil is?', 'Centimetre', ['Kilogram', 'Litre', 'Minute'], 'Unit manakah mengukur panjang sebatang pensel?', 'Sentimeter', ['Kilogram', 'Liter', 'Minit']],
    ['ukuran', '⚖️', 'Which unit do we use to weigh a bag of rice?', 'Kilogram', ['Metre', 'Litre', 'Second'], 'Unit manakah kita guna untuk menimbang sekarung beras?', 'Kilogram', ['Meter', 'Liter', 'Saat']],
    ['ukuran', '🥤', 'Which unit measures how much water is in a bottle?', 'Litre', ['Kilogram', 'Metre', 'Hour'], 'Unit manakah mengukur banyaknya air dalam sebotol?', 'Liter', ['Kilogram', 'Meter', 'Jam']],
    ['pola', '🔢', 'What comes next? 2, 4, 6, 8, …', '10', ['9', '11', '12'], 'Apakah yang seterusnya? 2, 4, 6, 8, …', '10', ['9', '11', '12']],
    ['pola', '🔢', 'What comes next? 5, 10, 15, 20, …', '25', ['21', '30', '24'], 'Apakah yang seterusnya? 5, 10, 15, 20, …', '25', ['21', '30', '24']],
    ['pola', '🔢', 'What comes next? 10, 20, 30, 40, …', '50', ['45', '60', '41'], 'Apakah yang seterusnya? 10, 20, 30, 40, …', '50', ['45', '60', '41']],
    ['pola', '🔢', 'What comes next? 1, 3, 5, 7, …', '9', ['8', '10', '11'], 'Apakah yang seterusnya? 1, 3, 5, 7, …', '9', ['8', '10', '11']],
    ['ruang', '🧭', 'Facing north, you turn right. Which way do you face?', 'East', ['West', 'South', 'North'], 'Menghadap utara, anda pusing ke kanan. Anda menghadap ke arah mana?', 'Timur', ['Barat', 'Selatan', 'Utara']],
    ['ruang', '🗺️', 'On a map, which side is usually up?', 'North', ['South', 'East', 'West'], 'Pada peta, bahagian mana biasanya di atas?', 'Utara', ['Selatan', 'Timur', 'Barat']],
    ['ruang', '🔄', 'A full turn is how many quarter turns?', '4', ['2', '3', '8'], 'Satu pusingan penuh ialah berapa suku pusingan?', '4', ['2', '3', '8']],
    ['nombor', '➗', 'Share 12 sweets equally between 3 friends. How many each?', '4', ['3', '6', '9'], 'Kongsi 12 gula-gula sama banyak antara 3 kawan. Berapa seorang?', '4', ['3', '6', '9']],
    ['nombor', '✖️', 'What is 5 × 3?', '15', ['8', '10', '20'], 'Berapakah 5 × 3?', '15', ['8', '10', '20']],
    ['nombor', '➕', 'What is 45 + 20?', '65', ['55', '75', '25'], 'Berapakah 45 + 20?', '65', ['55', '75', '25']],
    ['nombor', '➖', 'What is 80 − 30?', '50', ['40', '60', '110'], 'Berapakah 80 − 30?', '50', ['40', '60', '110']]
  ]);
  f('math', 3, [
    ['ruang', '🧭', 'Facing east, you turn left. Which way do you face?', 'North', ['South', 'West', 'East'], 'Menghadap timur, anda pusing ke kiri. Anda menghadap ke arah mana?', 'Utara', ['Selatan', 'Barat', 'Timur']],
    ['ruang', '🗺️', 'On a map, the opposite of north is…', 'South', ['East', 'West', 'Up'], 'Pada peta, lawan bagi utara ialah…', 'Selatan', ['Timur', 'Barat', 'Atas']],
    ['ruang', '📍', 'On a grid, the point (2, 3) is 2 across and how many up?', '3', ['2', '5', '1'], 'Pada grid, titik (2, 3) ialah 2 mendatar dan berapa menegak?', '3', ['2', '5', '1']]
  ]);
  f('math', 1, [
    ['ruang', '🔝', 'The sun is high in the sky. The word for high is…', 'Up', ['Down', 'Under', 'Inside'], 'Matahari tinggi di langit. Perkataan untuk tinggi ialah…', 'Atas', ['Bawah', 'Di bawah', 'Dalam']]
  ]);
  f('math', 3, [
    ['pola', '🔢', 'What comes next? 3, 6, 9, 12, …', '15', ['14', '16', '18'], 'Apakah yang seterusnya? 3, 6, 9, 12, …', '15', ['14', '16', '18']],
    ['pola', '🔢', 'What comes next? 100, 90, 80, 70, …', '60', ['65', '50', '75'], 'Apakah yang seterusnya? 100, 90, 80, 70, …', '60', ['65', '50', '75']]
  ]);
}
