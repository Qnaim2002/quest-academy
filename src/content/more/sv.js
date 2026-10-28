/* v34 audit: more Visual Arts questions. Row = [topic, emoji, EN question, EN answer, [3 EN wrong], BM question, BM answer, [3 BM wrong]]. */
export const names = {};
export default function (f) {
  f('sv', 1, [
    ['warna', '🍌', 'Which colour is a ripe banana?', 'Yellow', ['Blue', 'Purple', 'Black'], 'Apakah warna pisang yang masak?', 'Kuning', ['Biru', 'Ungu', 'Hitam']],
    ['warna', '🌊', 'Which colour is the sea in a picture?', 'Blue', ['Red', 'Orange', 'Brown'], 'Apakah warna laut dalam lukisan?', 'Biru', ['Merah', 'Jingga', 'Perang']],
    ['warna', '☁️', 'Which colour are clouds on a sunny day?', 'White', ['Pink', 'Black', 'Purple'], 'Apakah warna awan pada hari cerah?', 'Putih', ['Merah jambu', 'Hitam', 'Ungu']],
    ['warna', '🌈', 'Which one is a colour in the rainbow?', 'Red', ['Gold dust', 'Wood', 'Sand'], 'Yang manakah warna dalam pelangi?', 'Merah', ['Debu emas', 'Kayu', 'Pasir']],
    ['warna', '🖍️', 'You want to draw grass. Which crayon do you take?', 'Green', ['Pink', 'Grey', 'White'], 'Anda mahu melukis rumput. Krayon manakah yang anda ambil?', 'Hijau', ['Merah jambu', 'Kelabu', 'Putih']],
    ['garis', '〰️', 'Which line goes up and down like waves?', 'Wavy line', ['Straight line', 'Dot', 'Square'], 'Garis manakah naik turun seperti ombak?', 'Garisan bergelombang', ['Garisan lurus', 'Titik', 'Segi empat sama']],
    ['garis', '➖', 'Which line goes from left to right?', 'Horizontal line', ['Vertical line', 'Round line', 'Zigzag'], 'Garis manakah dari kiri ke kanan?', 'Garisan mendatar', ['Garisan menegak', 'Garisan bulat', 'Zigzag']],
    ['garis', '|', 'Which line goes straight up and down?', 'Vertical line', ['Horizontal line', 'Curved line', 'Wavy line'], 'Garis manakah lurus ke atas dan ke bawah?', 'Garisan menegak', ['Garisan mendatar', 'Garisan melengkung', 'Garisan bergelombang']],
    ['garis', '⭕', 'What shape is a clock face?', 'Circle', ['Triangle', 'Square', 'Star'], 'Apakah bentuk muka jam?', 'Bulatan', ['Segi tiga', 'Segi empat sama', 'Bintang']],
    ['garis', '🟦', 'What shape has four equal sides?', 'Square', ['Circle', 'Triangle', 'Oval'], 'Apakah bentuk yang mempunyai empat sisi sama panjang?', 'Segi empat sama', ['Bulatan', 'Segi tiga', 'Bujur']],
    ['garis', '✏️', 'What do we use to draw a line on paper?', 'A pencil', ['A spoon', 'A shoe', 'A cup'], 'Apakah yang kita guna untuk melukis garisan di atas kertas?', 'Pensel', ['Sudu', 'Kasut', 'Cawan']],
    ['bahan', '✂️', 'What tool do we use to cut paper?', 'Scissors', ['A spoon', 'A comb', 'A pillow'], 'Apakah alat yang kita guna untuk memotong kertas?', 'Gunting', ['Sudu', 'Sikat', 'Bantal']],
    ['bahan', '🧽', 'What can you use to clean your paintbrush?', 'Water', ['Sand', 'Paper', 'Milk'], 'Apakah yang boleh anda guna untuk membersihkan berus cat?', 'Air', ['Pasir', 'Kertas', 'Susu']],
    ['bahan', '🧱', 'What soft material can you shape with your hands?', 'Clay', ['Glass', 'Metal', 'Stone'], 'Bahan lembut manakah yang boleh dibentuk dengan tangan?', 'Tanah liat', ['Kaca', 'Logam', 'Batu']],
    ['corak', '🔴', 'What comes next? 🔴 🔵 🔴 🔵 🔴 …', 'Blue circle', ['Red circle', 'Green square', 'Star'], 'Apakah yang seterusnya? 🔴 🔵 🔴 🔵 🔴 …', 'Bulatan biru', ['Bulatan merah', 'Segi empat hijau', 'Bintang']],
    ['corak', '🟩', 'What comes next? 🟩 🟨 🟩 🟨 🟩 …', 'Yellow square', ['Green square', 'Red circle', 'Blue star'], 'Apakah yang seterusnya? 🟩 🟨 🟩 🟨 🟩 …', 'Segi empat kuning', ['Segi empat hijau', 'Bulatan merah', 'Bintang biru']],
    ['corak', '🐱', 'What comes next? 🐱 🐶 🐱 🐶 🐱 …', 'Dog', ['Cat', 'Fish', 'Bird'], 'Apakah yang seterusnya? 🐱 🐶 🐱 🐶 🐱 …', 'Anjing', ['Kucing', 'Ikan', 'Burung']],
    ['corak', '⭐', 'A pattern is something that…', 'Repeats again and again', ['Never repeats', 'Is always red', 'Is always round'], 'Corak ialah sesuatu yang…', 'Berulang-ulang', ['Tidak pernah berulang', 'Sentiasa merah', 'Sentiasa bulat']],
    ['corak', '🌸', 'What comes next? 🌸 🌸 🍃 🌸 🌸 …', 'Leaf', ['Flower', 'Star', 'Sun'], 'Apakah yang seterusnya? 🌸 🌸 🍃 🌸 🌸 …', 'Daun', ['Bunga', 'Bintang', 'Matahari']],
    ['corak', '🔺', 'What comes next? 🔺 ⬛ 🔺 ⬛ 🔺 …', 'Black square', ['Triangle', 'Circle', 'Star'], 'Apakah yang seterusnya? 🔺 ⬛ 🔺 ⬛ 🔺 …', 'Segi empat hitam', ['Segi tiga', 'Bulatan', 'Bintang']],
    ['corak', '🐟', 'What comes next? 🐟 🐟 🐙 🐟 🐟 …', 'Octopus', ['Fish', 'Crab', 'Whale'], 'Apakah yang seterusnya? 🐟 🐟 🐙 🐟 🐟 …', 'Obor-obor', ['Ikan', 'Ketam', 'Ikan paus']],
    ['kraf', '🖐️', 'What can we make with our painted hand?', 'A hand print', ['A tree trunk', 'A cup', 'A shoe'], 'Apakah yang boleh kita buat dengan tangan yang dicat?', 'Cap tangan', ['Batang pokok', 'Cawan', 'Kasut']],
    ['kraf', '📰', 'What can we make from old newspaper?', 'A paper hat or boat', ['A glass window', 'A real car', 'A metal key'], 'Apakah yang boleh dibuat daripada surat khabar lama?', 'Topi atau bot kertas', ['Tingkap kaca', 'Kereta sebenar', 'Kunci besi']],
    ['kraf', '🍂', 'Which is a natural thing we can use in art?', 'Leaves', ['Plastic toy', 'Battery', 'Phone'], 'Yang manakah benda semula jadi yang boleh digunakan dalam seni?', 'Daun', ['Mainan plastik', 'Bateri', 'Telefon']],
    ['kraf', '📦', 'A clean empty box can become…', 'A robot or a house craft', ['Rubbish forever', 'Food', 'A cloud'], 'Kotak kosong yang bersih boleh menjadi…', 'Kraf robot atau rumah', ['Sampah selamanya', 'Makanan', 'Awan']],
    ['kraf', '🧶', 'Which is used to make a woven mat?', 'Strips of leaves or thread', ['Ice', 'Water', 'Sand'], 'Yang manakah digunakan untuk membuat tikar anyaman?', 'Jalinan daun atau benang', ['Ais', 'Air', 'Pasir']],
    ['kraf', '🥣', 'After art time, what should we do?', 'Clean up our table', ['Leave a mess', 'Hide the paint', 'Throw the brushes'], 'Selepas waktu seni, apa yang patut kita buat?', 'Mengemas meja kita', ['Meninggalkan sepah', 'Menyorokkan cat', 'Membaling berus']],
    ['kraf', '🪁', 'What do we call a paper toy folded into shapes?', 'Origami', ['Pizza', 'Balloon', 'Cement'], 'Apakah nama mainan kertas yang dilipat menjadi bentuk?', 'Origami', ['Piza', 'Belon', 'Simen']]
  ]);
  f('sv', 3, [
    ['garis', '📐', 'Which line is used to show distance in a drawing, going away from you?', 'A diagonal line', ['A dot', 'A circle', 'A square'], 'Garis manakah digunakan untuk menunjukkan jarak menjauhi anda dalam lukisan?', 'Garisan condong', ['Titik', 'Bulatan', 'Segi empat sama']],
    ['garis', '🏞️', 'In a drawing, things that are far away look…', 'Smaller', ['Bigger', 'Wetter', 'Louder'], 'Dalam lukisan, benda yang jauh kelihatan…', 'Lebih kecil', ['Lebih besar', 'Lebih basah', 'Lebih kuat']],
    ['garis', '🔷', 'What do we call the outer edge of a shape?', 'Outline', ['Centre', 'Sound', 'Smell'], 'Apakah nama tepi luar sesuatu bentuk?', 'Garis luar', ['Tengah', 'Bunyi', 'Bau']],
    ['garis', '🖊️', 'Thick, strong lines in a drawing can show…', 'Strong or dark feelings', ['Nothing at all', 'Only the weather', 'Only numbers'], 'Garisan tebal dan kuat dalam lukisan boleh menunjukkan…', 'Perasaan yang kuat atau gelap', ['Tiada apa-apa', 'Cuaca sahaja', 'Nombor sahaja']],
    ['garis', '🌅', 'The line where the sky seems to meet the sea is called the…', 'Horizon', ['Border', 'Floor', 'Roof'], 'Garis di mana langit seolah-olah bertemu laut dipanggil…', 'Ufuk', ['Sempadan', 'Lantai', 'Bumbung']],
    ['garis', '🧊', 'Which shape is 3D like a box?', 'Cube', ['Circle', 'Triangle', 'Line'], 'Bentuk manakah 3D seperti sebuah kotak?', 'Kubus', ['Bulatan', 'Segi tiga', 'Garisan']],
    ['garis', '📏', 'Which tool helps us draw a straight line?', 'A ruler', ['A sponge', 'A sock', 'A cup'], 'Alat manakah membantu kita melukis garisan lurus?', 'Pembaris', ['Span', 'Stokin', 'Cawan']],
    ['bahan', '🎨', 'Mixing blue and yellow paint makes…', 'Green', ['Pink', 'Black', 'Red'], 'Mencampur cat biru dan kuning menghasilkan…', 'Hijau', ['Merah jambu', 'Hitam', 'Merah']],
    ['bahan', '🖌️', 'Which paint dries and can be thinned with water?', 'Poster colour', ['Oil', 'Mud', 'Honey'], 'Cat manakah kering dan boleh dicairkan dengan air?', 'Warna poster', ['Minyak', 'Lumpur', 'Madu']],
    ['bahan', '🧵', 'Which material is used for batik painting?', 'Cloth and wax', ['Glass and ice', 'Stone and sand', 'Tin and nails'], 'Bahan manakah digunakan untuk melukis batik?', 'Kain dan lilin', ['Kaca dan ais', 'Batu dan pasir', 'Timah dan paku']],
    ['bahan', '♻️', 'Using waste materials to make art is called…', 'Recycling art', ['Wasting art', 'Throwing art', 'Breaking art'], 'Menggunakan bahan buangan untuk membuat seni dipanggil…', 'Seni kitar semula', ['Seni membazir', 'Seni membuang', 'Seni memecahkan']],
    ['bahan', '🪨', 'Which material do sculptors use to carve?', 'Wood or stone', ['Water', 'Air', 'Smoke'], 'Bahan manakah digunakan oleh pengukir untuk mengukir?', 'Kayu atau batu', ['Air', 'Udara', 'Asap']],
    ['bahan', '📜', 'Which paper is best for watercolour painting?', 'Thick drawing paper', ['Thin tissue', 'Cardboard with oil', 'Foil'], 'Kertas manakah paling sesuai untuk lukisan cat air?', 'Kertas lukisan tebal', ['Tisu nipis', 'Kadbod berminyak', 'Kerajang']],
    ['bahan', '🧪', 'A palette is used to…', 'Mix paint colours', ['Cut paper', 'Wash dishes', 'Boil water'], 'Palet digunakan untuk…', 'Mencampur warna cat', ['Memotong kertas', 'Membasuh pinggan', 'Mendidih air']],
    ['warna', '🌡️', 'Which colours feel warm?', 'Red, orange and yellow', ['Blue and green', 'Grey and white', 'Black and brown'], 'Warna manakah memberi rasa panas?', 'Merah, jingga dan kuning', ['Biru dan hijau', 'Kelabu dan putih', 'Hitam dan perang']],
    ['warna', '❄️', 'Which colours feel cool?', 'Blue, green and purple', ['Red and orange', 'Yellow only', 'Gold and red'], 'Warna manakah memberi rasa sejuk?', 'Biru, hijau dan ungu', ['Merah dan jingga', 'Kuning sahaja', 'Emas dan merah']],
    ['warna', '🎨', 'Which three are the primary colours?', 'Red, yellow and blue', ['Green, pink and grey', 'Black, white and brown', 'Orange, green and purple'], 'Manakah tiga warna primer?', 'Merah, kuning dan biru', ['Hijau, merah jambu dan kelabu', 'Hitam, putih dan perang', 'Jingga, hijau dan ungu']],
    ['warna', '🟠', 'Red mixed with yellow makes…', 'Orange', ['Purple', 'Green', 'Brown'], 'Merah dicampur kuning menghasilkan…', 'Jingga', ['Ungu', 'Hijau', 'Perang']],
    ['warna', '🟣', 'Red mixed with blue makes…', 'Purple', ['Orange', 'Green', 'Yellow'], 'Merah dicampur biru menghasilkan…', 'Ungu', ['Jingga', 'Hijau', 'Kuning']],
    ['warna', '⚪', 'To make a colour lighter, we add…', 'White', ['Black', 'Mud', 'Salt'], 'Untuk menjadikan warna lebih cerah, kita tambah…', 'Putih', ['Hitam', 'Lumpur', 'Garam']],
    ['warna', '⚫', 'To make a colour darker, we add a little…', 'Black', ['White', 'Yellow', 'Water only'], 'Untuk menjadikan warna lebih gelap, kita tambah sedikit…', 'Hitam', ['Putih', 'Kuning', 'Air sahaja']],
    ['kraf', '🪆', 'What is a wau?', 'A traditional Malaysian kite', ['A kind of cake', 'A fish', 'A shoe'], 'Apakah wau?', 'Layang-layang tradisional Malaysia', ['Sejenis kek', 'Ikan', 'Kasut']],
    ['kraf', '👘', 'Songket is a traditional Malaysian…', 'Woven cloth with gold thread', ['Metal tool', 'Fruit', 'Boat'], 'Songket ialah… tradisional Malaysia', 'Kain tenunan berbenang emas', ['Alat besi', 'Buah', 'Bot']],
    ['kraf', '🪘', 'Which craft is a traditional puppet show of Malaysia?', 'Wayang kulit', ['Wayang air', 'Rain dance', 'Paper plane'], 'Kraf manakah pertunjukan boneka tradisional Malaysia?', 'Wayang kulit', ['Wayang air', 'Tarian hujan', 'Kapal terbang kertas']],
    ['kraf', '🏺', 'Pottery is made from…', 'Clay', ['Paper', 'Cotton', 'Sugar'], 'Tembikar dibuat daripada…', 'Tanah liat', ['Kertas', 'Kapas', 'Gula']],
    ['kraf', '🧺', 'Weaving mengkuang leaves makes…', 'Mats and baskets', ['Glass bowls', 'Plastic bags', 'Metal pots'], 'Menganyam daun mengkuang menghasilkan…', 'Tikar dan bakul', ['Mangkuk kaca', 'Beg plastik', 'Periuk besi']],
    ['corak', '🔁', 'What comes next? 1 🔴, 2 🔵, 3 🔴, 4 🔵, 5 …', 'Red', ['Blue', 'Green', 'Yellow'], 'Apakah yang seterusnya? 1 🔴, 2 🔵, 3 🔴, 4 🔵, 5 …', 'Merah', ['Biru', 'Hijau', 'Kuning']],
    ['corak', '🌀', 'Which pattern repeats ABB ABB ABB?', 'Red, blue, blue, red, blue, blue', ['Red, blue, red, blue', 'Red, red, red, red', 'Blue, red, green'], 'Corak manakah berulang ABB ABB ABB?', 'Merah, biru, biru, merah, biru, biru', ['Merah, biru, merah, biru', 'Merah, merah, merah, merah', 'Biru, merah, hijau']],
    ['corak', '🧩', 'Repeating a shape to make a design is called…', 'A pattern', ['A mistake', 'A story', 'A sound'], 'Mengulang bentuk untuk membuat reka bentuk dipanggil…', 'Corak', ['Kesilapan', 'Cerita', 'Bunyi']]
  ]);
  f('sv', 1, [
    ['warna', '🍇', 'Which colour are grapes?', 'Purple', ['Orange', 'White', 'Black only'], 'Apakah warna anggur?', 'Ungu', ['Jingga', 'Putih', 'Hitam sahaja']],
    ['warna', '🌻', 'Which colour is a sunflower?', 'Yellow', ['Blue', 'Pink', 'Grey'], 'Apakah warna bunga matahari?', 'Kuning', ['Biru', 'Merah jambu', 'Kelabu']],
    ['bahan', '🖍️', 'What do we use to colour a picture?', 'Crayons', ['Spoons', 'Shoes', 'Rice'], 'Apakah yang kita guna untuk mewarna gambar?', 'Krayon', ['Sudu', 'Kasut', 'Nasi']],
    ['corak', '🟥', 'What comes next? 🟥 🟦 🟥 🟦 🟥 …', 'Blue square', ['Red square', 'Green circle', 'Yellow star'], 'Apakah yang seterusnya? 🟥 🟦 🟥 🟦 🟥 …', 'Segi empat biru', ['Segi empat merah', 'Bulatan hijau', 'Bintang kuning']]
  ]);
  f('sv', 1, [
    ['kraf', '🎭', 'What can we make with paper plates and string?', 'A mask', ['A real bicycle', 'A real boat', 'A pot of rice'], 'Apakah yang boleh kita buat dengan pinggan kertas dan tali?', 'Topeng', ['Basikal sebenar', 'Bot sebenar', 'Periuk nasi']],
    ['kraf', '🐠', 'We can paint a fish on…', 'Paper', ['Water', 'Air', 'Wind'], 'Kita boleh melukis ikan di atas…', 'Kertas', ['Air', 'Udara', 'Angin']]
  ]);
}
