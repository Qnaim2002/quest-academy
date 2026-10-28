/* v32 extras for age 5 (The Lone Knight and the Star of Tomorrow). Format: see shared.js and src/parts/29-v32-story.js.
   The through-line of Momo, the lonely little climber who takes the colours: a shadow (lands 1-3), a rival (4-6),
   a mistake (7-9) and a redemption (10). words[z] = [Malay, English, picture]. */
export default {
  arc: {
    0: {
      c: [['wide', 'n', 'A long, furry tail swishes between the rice stalks. Something small is watching {hero}.', 'Sebatang ekor berbulu yang panjang berayun di celah batang padi. Sesuatu yang kecil sedang memerhati {hero}.']],
      v: [['item', 'n', 'In the mud there is a tiny footprint with five little fingers. Who could it be?', 'Di dalam lumpur ada kesan tapak kecil dengan lima jari. Siapakah itu?', '👣']]
    },
    1: {
      c: [['dark', 'n', 'Rustle, rustle. The branches above shake. A few durians fall... and they are not ripe yet!', 'Kersak, kersak. Dahan di atas bergoyang. Beberapa biji durian jatuh... dan masih belum masak!']],
      v: [['owl', 'o', 'Somebody is taking the fruit, {hero}. But whoever it is, they leave a banana peel behind.', 'Seseorang mengambil buah-buahan, {hero}. Tetapi siapa pun dia, dia meninggalkan kulit pisang.']]
    },
    2: {
      c: [['villain', 'x:🐒:A little voice:Satu suara kecil', 'Hee hee! Catch me if you can! Nobody ever catches Momo!', 'Hi hi! Tangkap saya kalau boleh! Tiada siapa pernah menangkap Momo!']],
      v: [['item', 'n', 'The turtles found a pile of stolen colours behind the rocks. They sparkle like shy rainbows.', 'Penyu-penyu menjumpai timbunan warna curi di belakang batu. Ia berkilau seperti pelangi yang malu.', '🌈']]
    },
    3: {
      c: [['villain', 'x:🐒:A little voice:Satu suara kecil', 'I am the fastest climber in the whole land! Can you keep up, lone knight?', 'Saya pemanjat paling pantas di seluruh negeri! Boleh kamu kejar, kesatria seorang diri?']],
      v: [['villain', 'x:🐒:A little voice:Satu suara kecil', 'You kept up! Nobody has ever kept up with me before...', 'Kamu dapat mengejar! Tiada siapa pernah dapat mengejar saya sebelum ini...', 'sad']]
    },
    4: {
      c: [['chase', 'v', 'Race you up the hill! The first to the top finds the star pieces first!', 'Mari berlumba naik bukit! Siapa sampai dahulu ke puncak menemui kepingan bintang dahulu!', '🐒']],
      v: [['villain', 'v', 'You won, but you shared the star piece with me. Why?', 'Kamu menang, tetapi kamu berkongsi kepingan bintang itu dengan saya. Kenapa?', 'sad']]
    },
    5: {
      c: [['campfire', 'h', 'Momo, you are not so bad. Do you want to eat with us tonight?', 'Momo, kamu tidak seteruk itu. Mahu makan bersama kami malam ini?']],
      v: [['villain', 'v', 'Hee... a real friend. I think I forgot how that feels.', 'Hi... kawan sebenar. Saya rasa saya lupa bagaimana perasaan itu.', 'happy']]
    },
    6: {
      c: [['rain', 'v', 'Oh no! I took a shortcut and the waterfall flooded the cave! I did not mean it!', 'Alamak! Saya ambil jalan pintas dan air terjun membanjiri gua! Saya tidak sengaja!', 'storm']],
      v: [['villain', 'v', 'It was my mistake. I should have asked before I rushed. I am sorry.', 'Itu kesilapan saya. Saya patut bertanya sebelum tergesa-gesa. Saya minta maaf.', 'sad']]
    },
    7: {
      c: [['wide', 'n', '{v} climbs a tall mangrove tree and looks at the muddy mess he made. His ears droop.', '{v} memanjat pokok bakau yang tinggi dan melihat kekacauan berlumpur yang dibuatnya. Telinganya melayu.']],
      v: [['villain', 'v', 'I will fix it! I know all the little paths. I will show you the safe way through.', 'Saya akan baiki! Saya tahu semua jalan kecil. Saya akan tunjukkan jalan selamat.', 'happy']]
    },
    8: {
      c: [['talk', 'v', 'The tea farmers are not angry at me. They say I can help pick the leaves. Is that true?', 'Petani teh tidak marah kepada saya. Mereka kata saya boleh membantu memetik daun. Betulkah?']],
      v: [['owl', 'o', 'See, {hero}? Saying sorry and then helping is the best way to fix a mistake.', 'Lihat, {hero}? Minta maaf dan kemudian membantu ialah cara terbaik untuk membaiki kesilapan.']]
    },
    9: {
      c: [['villain', 'v', 'The grumpy cloud came from my wishes. I wished nobody had fun, because I felt left out.', 'Awan merajuk itu datang daripada hajat saya. Saya berharap tiada siapa seronok, kerana saya rasa tersisih.', 'sad']],
      v: [['villain', 'v', 'I give back every colour I took. From now on I climb to help, not to steal!', 'Saya kembalikan setiap warna yang saya ambil. Mulai sekarang saya memanjat untuk membantu, bukan mencuri!', 'happy'], ['hero', 'h', 'Welcome to the Future Stars, {v}!', 'Selamat datang ke Bintang Masa Depan, {v}!']]
    }
  },
  words: {
    0: [['Padi', 'Rice plant', '🌾'], ['Petani', 'Farmer', '🧑‍🌾'], ['Matahari', 'Sun', '☀️']],
    1: [['Durian', 'Durian', '🍈'], ['Pokok', 'Tree', '🌳'], ['Buah', 'Fruit', '🍎']],
    2: [['Penyu', 'Turtle', '🐢'], ['Ombak', 'Wave', '🌊'], ['Telur', 'Egg', '🥚']],
    3: [['Sungai', 'River', '🏞️'], ['Kelip-kelip', 'Firefly', '✨'], ['Perahu', 'Boat', '🛶']],
    4: [['Orkid', 'Orchid', '🌺'], ['Bukit', 'Hill', '⛰️'], ['Awan', 'Cloud', '☁️']],
    5: [['Hutan', 'Forest', '🌿'], ['Harimau', 'Tiger', '🐯'], ['Gajah', 'Elephant', '🐘']],
    6: [['Gua', 'Cave', '🕳️'], ['Air terjun', 'Waterfall', '💦'], ['Batu', 'Stone', '🪨']],
    7: [['Udang', 'Prawn', '🦐'], ['Lumpur', 'Mud', '🟤'], ['Burung', 'Bird', '🐦']],
    8: [['Teh', 'Tea', '🍵'], ['Cawan', 'Cup', '☕'], ['Kebun', 'Garden', '🌱']],
    9: [['Gunung', 'Mountain', '🏔️'], ['Puncak', 'Peak', '🗻'], ['Bendera', 'Flag', '🚩']]
  }
};
