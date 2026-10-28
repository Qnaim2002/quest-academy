/* v32 extras for age 4 (The Little Knight's Wonder Book). Format: see shared.js and src/parts/29-v32-story.js.
   arc[z].c = beats added to the chapter, arc[z].v = beats added to the victory story (before the last beat).
   The through-line of Puff, the little grey cloud: a shadow (lands 1-3), a rival (4-6), a mistake (7-9), a rainbow (10).
   words[z] = [Malay, English, picture] (Hoot teaches them with a picture pop-up). */
export default {
  arc: {
    0: {
      c: [['wide', 'n', 'A tiny grey wisp floats behind a tree. It peeks out... and hides again!', 'Seutas kabus kelabu kecil terapung di belakang pokok. Ia mengintai... dan bersembunyi semula!']],
      v: [['item', 'n', 'On the grass lies a small grey puff of fluff. Who left it here?', 'Di atas rumput ada segumpal bulu kelabu kecil. Siapa yang tinggalkannya di sini?', '☁️']]
    },
    1: {
      c: [['wide', 'n', 'Pitter-patter! Tiny raindrops follow {hero} along the pond. A little grey cloud keeps a long way behind.', 'Titik-titik! Titisan hujan kecil mengikut {hero} di tepi kolam. Awan kelabu kecil mengekori jauh di belakang.']],
      v: [['owl', 'o', 'The little grey cloud is following us, {hero}. I wonder why.', 'Awan kelabu kecil itu mengikut kita, {hero}. Saya hairan kenapa.']]
    },
    2: {
      c: [['villain', 'x:☁️:Grey cloud:Awan kelabu', 'Sniff... Everyone has friends. I have only rain. Drip, drip...', 'Sniff... Semua orang ada kawan. Saya hanya ada hujan. Titik, titik...', 'sad']],
      v: [['owl', 'o', 'Maybe the grey cloud is not mean. Maybe he is lonely. Hoo!', 'Mungkin awan kelabu itu tidak jahat. Mungkin dia kesepian. Hu!']]
    },
    3: {
      c: [['villain', 'x:☁️:Grey cloud:Awan kelabu', 'I am the greyest cloud in the sky! I will make this the greyest land ever. Try and stop me!', 'Saya awan paling kelabu di langit! Saya akan menjadikan negeri ini yang paling kelabu. Cuba halang saya!']],
      v: [['villain', 'x:☁️:Grey cloud:Awan kelabu', 'Hmph! You are fast, {hero}. Race you to the next land! The winner is the best!', 'Hmph! Kamu pantas, {hero}. Berlumba ke negeri seterusnya! Pemenang yang terbaik!']]
    },
    4: {
      c: [['chase', 'v', 'Race you down the rainbow slide! If I win, it turns grey!', 'Berlumba turun gelongsor pelangi! Kalau saya menang, ia menjadi kelabu!', '☁️']],
      v: [['villain', 'v', 'You won again... but you still smile at me. Why?', 'Kamu menang lagi... tetapi kamu masih senyum kepada saya. Kenapa?', 'sad']]
    },
    5: {
      c: [['campfire', 'o', 'Even a grumpy cloud can learn to glow, {hero}. Let us be patient.', 'Awan yang merajuk pun boleh belajar bercahaya, {hero}. Mari kita bersabar.']],
      v: [['villain', 'v', 'The bunnies were not scared of me. They shared their carrots. Nobody ever did that before.', 'Arnab-arnab itu tidak takut kepada saya. Mereka berkongsi lobak merah. Tiada siapa pernah buat begitu.', 'happy']]
    },
    6: {
      c: [['rain', 'v', 'Oh no, oh no! I rained too hard! The beach is flooded! It was a mistake!', 'Alamak, alamak! Hujan saya terlalu lebat! Pantai banjir! Ia satu kesilapan!', 'storm']],
      v: [['villain', 'v', 'I did not mean to. I am so sorry. Can I help clean up?', 'Saya tidak sengaja. Saya minta maaf. Boleh saya tolong bersihkan?', 'sad']]
    },
    7: {
      c: [['wide', 'n', 'The little birds cannot sing because of the wet. {v} looks up and sees what he has done.', 'Burung-burung kecil tidak dapat menyanyi kerana basah. {v} mendongak dan melihat apa yang dilakukannya.']],
      v: [['villain', 'v', 'I will make the rain stop. Just watch me!', 'Saya akan hentikan hujan. Tengok sahaja!', 'happy']]
    },
    8: {
      c: [['dark', 'n', 'The town is quiet. {v} hides in the dark, afraid that no one will forgive him.', 'Bandar itu sunyi. {v} bersembunyi dalam gelap, takut tiada siapa memaafkannya.']],
      v: [['owl', 'o', '{hero}, a friend can say sorry. And a friend can forgive. Hoot knows it!', '{hero}, seorang kawan boleh minta maaf. Dan seorang kawan boleh memaafkan. Hoot tahu itu!']]
    },
    9: {
      c: [['villain', 'v', 'I wanted to be special, but I was only sad. I am sorry for all the grey days.', 'Saya mahu menjadi istimewa, tetapi saya hanya sedih. Saya minta maaf untuk semua hari kelabu itu.', 'sad']],
      v: [['villain', 'v', 'I promise, from now on, I bring rainbows, not rain!', 'Saya berjanji, mulai sekarang, saya membawa pelangi, bukan hujan!', 'happy'], ['hero', 'h', 'Welcome to our team, {v}!', 'Selamat datang ke pasukan kami, {v}!']]
    }
  },
  words: {
    0: [['Selamat pagi', 'Good morning', '☀️'], ['Bunga', 'Flower', '🌸'], ['Beruang', 'Bear', '🧸']],
    1: [['Air', 'Water', '💧'], ['Itik', 'Duck', '🦆'], ['Ikan', 'Fish', '🐟']],
    2: [['Rumah', 'House', '🏠'], ['Kupu-kupu', 'Butterfly', '🦋'], ['Daun', 'Leaf', '🍃']],
    3: [['Kek', 'Cake', '🧁'], ['Susu', 'Milk', '🥛'], ['Terima kasih', 'Thank you', '🙏']],
    4: [['Merah', 'Red', '🔴'], ['Biru', 'Blue', '🔵'], ['Kuning', 'Yellow', '🟡']],
    5: [['Arnab', 'Rabbit', '🐰'], ['Lobak merah', 'Carrot', '🥕'], ['Selamat malam', 'Good night', '🌙']],
    6: [['Pasir', 'Sand', '🏖️'], ['Ketam', 'Crab', '🦀'], ['Laut', 'Sea', '🌊']],
    7: [['Bintang', 'Star', '⭐'], ['Bulan', 'Moon', '🌙'], ['Burung', 'Bird', '🐦']],
    8: [['Kawan', 'Friend', '🧑‍🤝‍🧑'], ['Maaf', 'Sorry', '😔'], ['Sayang', 'Love', '❤️']],
    9: [['Tidur', 'Sleep', '😴'], ['Mimpi', 'Dream', '💭'], ['Bantal', 'Pillow', '🛏️']]
  }
};
