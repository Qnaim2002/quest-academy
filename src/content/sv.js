export const names = {
  warna: ['Colours', 'Warna'], garis: ['Lines and shapes', 'Garisan dan bentuk'], bahan: ['Art tools', 'Alat melukis'], corak: ['Patterns and techniques', 'Corak dan teknik'], kraf: ['Malaysian crafts', 'Kraf Malaysia']
};
export default function (f) {
f('sv', 1, [
  ['warna', 'clr', '🐸', "What colour is a frog?", "Green", "Apakah warna katak?", "Hijau"],
  ['warna', 'clr', '🍅', "What colour is a ripe tomato?", "Red", "Apakah warna tomato yang masak?", "Merah"],
  ['warna', 'clr', '🌿', "What colour are most leaves?", "Green", "Apakah warna kebanyakan daun?", "Hijau"],
  ['warna', 'clr', '🌤️', "What colour is the sky on a sunny day?", "Blue", "Apakah warna langit pada hari yang cerah?", "Biru"],
  ['warna', 'clr', '🍊', "What colour is an orange?", "Orange", "Apakah warna buah oren?", "Oren"],
  ['warna', 'clr', '🍫', "What colour is chocolate?", "Brown", "Apakah warna coklat?", "Coklat"],
  ['warna', 'clr', '🍆', "What colour is an eggplant?", "Purple", "Apakah warna terung?", "Ungu"],
  ['garis', 'line', '〰️', "What kind of line is 〰️?", "Wavy line", "Apakah jenis garisan 〰️?", "Garisan bergelombang"],
  ['garis', 'line', '➖', "What kind of line is ➖?", "Straight line", "Apakah jenis garisan ➖?", "Garisan lurus"],
  ['garis', 'line', '⚡', "What kind of line is ⚡?", "Zigzag line", "Apakah jenis garisan ⚡?", "Garisan zigzag"],
  ['garis', 'shape', '🔵', "What shape is 🔵?", "Circle", "Apakah bentuk 🔵?", "Bulatan"],
  ['garis', 'shape', '🟦', "What shape is 🟦?", "Square", "Apakah bentuk 🟦?", "Segi empat sama"],
  ['garis', 'shape', '🔺', "What shape is 🔺?", "Triangle", "Apakah bentuk 🔺?", "Segi tiga"],
  ['bahan', 'tool', '🖌️', "What do we use to paint a picture?", "Paintbrush", "Apakah yang kita guna untuk melukis dengan cat?", "Berus cat"],
  ['bahan', 'tool', '✂️', "What do we use to cut paper?", "Scissors", "Apakah yang kita guna untuk menggunting kertas?", "Gunting"],
  ['bahan', 'tool', '🧴', "What do we use to stick paper together?", "Glue", "Apakah yang kita guna untuk melekatkan kertas?", "Gam"],
  ['bahan', 'tool', '🖍️', "What do we use to colour with a waxy stick?", "Crayon", "Apakah yang kita guna untuk mewarna dengan batang berlilin?", "Krayon"]
]);
f('sv', 2, [
  ['warna', 'clr', '🟥🟨', "Red + Yellow = ?", "Orange", "Merah + Kuning = ?", "Oren"],
  ['warna', 'clr', '🟦🟨', "Blue + Yellow = ?", "Green", "Biru + Kuning = ?", "Hijau"],
  ['warna', 'clr', '🟥🟦', "Red + Blue = ?", "Purple", "Merah + Biru = ?", "Ungu"],
  ['warna', 'clr', '🟥⬜', "Red + White = ?", "Pink", "Merah + Putih = ?", "Merah jambu"],
  ['warna', 'asas', '🎨', "Which one is a primary colour?", "Red", "Yang manakah warna asas?", "Merah", ["Green", "Orange", "Purple"], ["Hijau", "Oren", "Ungu"]],
  ['warna', 'asas', '🔥', "Which colour feels warm, like fire?", "Orange", "Warna manakah yang terasa panas seperti api?", "Oren", ["Blue", "Green", "Purple"], ["Biru", "Hijau", "Ungu"]],
  ['warna', 'asas', '💧', "Which colour feels cool, like water?", "Blue", "Warna manakah yang terasa sejuk seperti air?", "Biru", ["Red", "Orange", "Yellow"], ["Merah", "Oren", "Kuning"]],
  ['garis', 'line', '🌈', "A line that bends like a rainbow is a…", "Curved line", "Garisan yang melengkung seperti pelangi ialah…", "Garisan melengkung"],
  ['garis', 'shape', '🟦', "Which shape has 4 equal sides and 4 corners?", "Square", "Bentuk manakah yang mempunyai 4 sisi sama panjang dan 4 bucu?", "Segi empat sama"],
  ['garis', 'shape', '🔺', "Which shape has 3 sides?", "Triangle", "Bentuk manakah yang mempunyai 3 sisi?", "Segi tiga"],
  ['garis', 'shape', '⚪', "Which shape has no corners?", "Circle", "Bentuk manakah yang tiada bucu?", "Bulatan"],
  ['garis', 'shape', '▬', "Which shape has 4 sides: two long and two short?", "Rectangle", "Bentuk manakah yang mempunyai 4 sisi: dua panjang dan dua pendek?", "Segi empat tepat"],
  ['corak', 'dot', '🔴🔵🔴🔵🔴', "What comes next in the pattern 🔴🔵🔴🔵🔴?", "🔵", "Apakah yang seterusnya dalam corak 🔴🔵🔴🔵🔴?", "🔵", ["🔴", "🟢", "🟡"], ["🔴", "🟢", "🟡"]],
  ['corak', 'dot', '🟡🟡🟢🟡🟡', "What comes next in the pattern 🟡🟡🟢🟡🟡?", "🟢", "Apakah yang seterusnya dalam corak 🟡🟡🟢🟡🟡?", "🟢", ["🟡", "🔵", "🔴"], ["🟡", "🔵", "🔴"]],
  ['corak', 'fruit', '🍎🍌🍇🍎🍌', "What comes next in the pattern 🍎🍌🍇🍎🍌?", "🍇", "Apakah yang seterusnya dalam corak 🍎🍌🍇🍎🍌?", "🍇", ["🍎", "🍌", "🍊"], ["🍎", "🍌", "🍊"]],
  ['corak', 'fruit', '🍊🍇🍊🍇🍊', "What comes next in the pattern 🍊🍇🍊🍇🍊?", "🍇", "Apakah yang seterusnya dalam corak 🍊🍇🍊🍇🍊?", "🍇", ["🍊", "🍎", "🍌"], ["🍊", "🍎", "🍌"]],
  ['kraf', 'kraf', '🪁', "Which colourful kite from Kelantan is a traditional craft?", "Wau", "Layang-layang tradisional berwarna-warni dari Kelantan ialah?", "Wau"],
  ['kraf', 'kraf', '👘', "Cloth decorated with patterns using wax and dye is…", "Batik", "Kain yang dihias dengan corak menggunakan lilin dan pewarna ialah?", "Batik"]
]);
f('sv', 3, [
    ["kraf", "mask", "🎭", "Where do people wear masks?", "In plays, dances and festivals", "Di manakah orang memakai topeng?", "Dalam teater, tarian dan perayaan", ["Only in the bath", "Only when sleeping", "Only at the dentist"], ["Hanya di dalam bilik mandi", "Hanya ketika tidur", "Hanya di klinik gigi"]],   // v23
    ["kraf", "mask", "🍽️", "What can we use to make a simple mask?", "A paper plate", "Apakah yang boleh kita gunakan untuk membuat topeng yang mudah?", "Pinggan kertas", ["A glass cup", "A metal pot", "A pillow"], ["Cawan kaca", "Periuk besi", "Bantal"]],   // v23
    ["kraf", "mask", "👀", "What must a mask have so we can see?", "Two eye holes", "Apakah yang mesti ada pada topeng supaya kita boleh melihat?", "Dua lubang mata", ["A long tail", "A handle on top", "Ten buttons"], ["Ekor yang panjang", "Pemegang di atas", "Sepuluh butang"]],   // v23
    ["kraf", "mask", "🐯", "Which colours fit a tiger mask?", "Orange with black stripes", "Warna manakah sesuai untuk topeng harimau?", "Oren dengan jalur hitam", ["Pink with spots", "Green with dots", "Blue and white"], ["Merah jambu bertompok", "Hijau berbintik", "Biru dan putih"]],   // v23
    ["kraf", "mask", "✂️", "Who should help us cut the eye holes?", "A grown-up", "Siapakah yang patut membantu kita memotong lubang mata?", "Orang dewasa", ["Nobody", "A baby", "The cat"], ["Tiada sesiapa", "Bayi", "Kucing"]],   // v23
  ['kraf', 'kraf', '✨', "Cloth woven with shiny gold or silver thread is…", "Songket", "Kain tenunan dengan benang emas atau perak yang berkilau ialah?", "Songket"],
  ['kraf', 'kraf', '🧺', "Weaving mengkuang leaves into mats and baskets is called…", "Anyaman", "Menganyam daun mengkuang menjadi tikar dan bakul dipanggil?", "Anyaman"],
  ['kraf', 'kraf', '🪵', "Carving patterns into wood is called…", "Ukiran kayu", "Mengukir corak pada kayu dipanggil?", "Ukiran kayu"],
  ['kraf', 'kraf', '🎭', "Leather puppets lit from behind to tell stories are…", "Wayang kulit", "Patung kulit yang disuluh dari belakang untuk bercerita ialah?", "Wayang kulit"],
  ['corak', 'tech', '✂️', "Sticking pieces of paper or cloth onto a page to make a picture is…", "Collage", "Menampal kepingan kertas atau kain pada kertas untuk membuat gambar ialah?", "Kolaj"],
  ['corak', 'tech', '🍃', "Stamping paint with a leaf or a carved block to make a picture is…", "Printing", "Menekap cat dengan daun atau blok ukiran untuk membuat gambar ialah?", "Cetakan"],
  ['corak', 'tech', '🟦', "Making a picture from small pieces of coloured paper or tile is…", "Mosaic", "Membuat gambar daripada kepingan kecil kertas atau jubin berwarna ialah?", "Mozek"],
  ['corak', 'tech', '🕊️', "Folding paper into animals and shapes is…", "Origami", "Melipat kertas menjadi haiwan dan bentuk ialah?", "Origami"],
  ['corak', 'tech', '🏺', "Shaping soft clay with our hands to make a pot is…", "Clay modelling", "Membentuk tanah liat dengan tangan untuk membuat pasu ialah?", "Pembentukan tanah liat"],
  ['warna', 'mix', '🎨', "What do we get when we mix two primary colours?", "A secondary colour", "Apakah yang kita dapat apabila mencampurkan dua warna asas?", "Warna sekunder", ["A primary colour", "A black colour", "Nothing changes"], ["Warna asas", "Warna hitam", "Tiada perubahan"]],
  ['warna', 'mix', '⬜', "Adding white to a colour makes it…", "Lighter", "Menambah warna putih pada sesuatu warna menjadikannya…", "Lebih cerah", ["Darker", "Hotter", "Smaller"], ["Lebih gelap", "Lebih panas", "Lebih kecil"]],
  ['warna', 'mix', '⬛', "Adding black to a colour makes it…", "Darker", "Menambah warna hitam pada sesuatu warna menjadikannya…", "Lebih gelap", ["Lighter", "Brighter", "Wetter"], ["Lebih cerah", "Lebih terang", "Lebih basah"]],
  ['corak', 'ruang', '🏔️', "In a drawing, things that look small are usually…", "Far away", "Dalam lukisan, benda yang kelihatan kecil biasanya…", "Jauh", ["Very close", "Very heavy", "Very loud"], ["Sangat dekat", "Sangat berat", "Sangat bising"]],
  ['corak', 'ruang', '🌳', "Things drawn big and low on the page look…", "Closer", "Benda yang dilukis besar dan rendah pada kertas kelihatan…", "Lebih dekat", ["Farther away", "Invisible", "Older"], ["Lebih jauh", "Tidak kelihatan", "Lebih tua"]],
  ['warna', 'flag', '🇲🇾', "Which colours are on the Jalur Gemilang (Malaysia's flag)?", "Red, white, blue and yellow", "Apakah warna pada Jalur Gemilang?", "Merah, putih, biru dan kuning", ["Red, white and green", "Black and white", "Blue and green"], ["Merah, putih dan hijau", "Hitam dan putih", "Biru dan hijau"]],
  ['warna', 'flag', '🇲🇾', "How many red and white stripes are on the Jalur Gemilang?", "14", "Berapakah jalur merah dan putih pada Jalur Gemilang?", "14", ["13", "12", "10"], ["13", "12", "10"]],
  ['corak', 'tex', '🧱', "Which surface feels rough?", "Sandpaper", "Permukaan manakah yang terasa kasar?", "Kertas pasir", ["Silk", "A cotton ball", "A smooth stone"], ["Sutera", "Bebola kapas", "Batu yang licin"]]
]);

}
