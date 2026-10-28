/* v32 extras for age 6 (The Young Knight Who Would Be King). Format: see shared.js and src/parts/29-v32-story.js.
   The through-line of Murk, the grey shadow who wants to be liked: a shadow (lands 1-3), a rival (4-6),
   a mistake (7-9) and a redemption (10). words[z] = [Malay, English, picture]. */
export default {
  arc: {
    0: {
      c: [['dark', 'n', 'On the far hill stands a tall, grey shape. It watches {hero} for a moment, then melts into the mist.', 'Di bukit yang jauh berdiri satu bentuk kelabu yang tinggi. Ia memerhati {hero} seketika, kemudian lenyap dalam kabus.']],
      v: [['item', 'n', 'A grey glove lies on the path. It is cold to touch. Whose is it?', 'Sehelai sarung tangan kelabu terletak di atas jalan. Ia sejuk apabila disentuh. Milik siapa?', '🧤']]
    },
    1: {
      c: [['wide', 'n', 'Every tree has a tiny grey mark, like a thumbprint. Somebody has been here before {hero}.', 'Setiap pokok ada tanda kelabu kecil, seperti cap ibu jari. Seseorang sudah datang ke sini sebelum {hero}.']],
      v: [['owl', 'o', 'The marks lead towards the crown, {hero}. Whoever it is wants to be king too.', 'Tanda-tanda itu menuju ke arah mahkota, {hero}. Siapa pun dia mahu menjadi raja juga.']]
    },
    2: {
      c: [['villain', 'x:👤:Grey shadow:Bayang kelabu', 'A knight who wants to be king? Ha! Kings need to be tough. Are you tough?', 'Seorang kesatria yang mahu menjadi raja? Ha! Raja perlu tabah. Adakah kamu tabah?']],
      v: [['dark', 'n', 'The shadow does not like it that {hero} is winning. It disappears with a sulky grumble.', 'Bayang itu tidak suka {hero} menang. Ia hilang dengan rungutan merajuk.']]
    },
    3: {
      c: [['villain', 'x:👤:Grey shadow:Bayang kelabu', 'I am the rightful ruler of this land! Race you to the crown!', 'Saya pemerintah sah negeri ini! Mari berlumba ke mahkota!']],
      v: [['villain', 'x:👤:Grey shadow:Bayang kelabu', 'You are good, {hero}. But I am not done. Not yet!', 'Kamu bagus, {hero}. Tetapi saya belum selesai. Belum lagi!']]
    },
    4: {
      c: [['chase', 'v', 'Keep up, slowcoach! A real king is always first!', 'Kejar, lambat! Raja sebenar sentiasa yang pertama!', '👤']],
      v: [['villain', 'v', 'You were last in line and you still helped that little lamb. A king does that? Hmm.', 'Kamu yang terakhir dalam barisan dan kamu masih menolong anak biri-biri itu. Raja buat begitu? Hmm.', 'sad']]
    },
    5: {
      c: [['campfire', 'o', 'The shadow rival is learning about kindness, {hero}. Slowly, but he is learning.', 'Pesaing bayang itu sedang belajar tentang kebaikan, {hero}. Perlahan-lahan, tetapi dia belajar.']],
      v: [['villain', 'v', 'Everybody cheered for you. Nobody has ever cheered for me.', 'Semua orang bersorak untuk kamu. Tiada siapa pernah bersorak untuk saya.', 'sad']]
    },
    6: {
      c: [['rain', 'v', 'I only wanted to be first! I did not know the shortcut would crack the canyon wall!', 'Saya hanya mahu menjadi yang pertama! Saya tidak tahu jalan pintas itu akan meretakkan dinding ngarai!', 'storm']],
      v: [['villain', 'v', 'My mistake hurt people. I do not feel like a king at all.', 'Kesilapan saya menyakiti orang. Saya langsung tidak rasa seperti raja.', 'sad']]
    },
    7: {
      c: [['wide', 'n', 'The golden city is quiet. {v} stands alone at the gate, holding a broken stone in his hands.', 'Bandar emas itu sunyi. {v} berdiri sendirian di pintu gerbang, memegang sebongkah batu pecah.']],
      v: [['villain', 'v', 'Let me fix the wall. I am strong. I can carry the stones!', 'Biar saya baiki dinding itu. Saya kuat. Saya boleh angkat batu-batu itu!', 'happy']]
    },
    8: {
      c: [['talk', 'v', 'Do the people forgive me? I do not deserve it. But thank you for asking, {hero}.', 'Adakah orang ramai memaafkan saya? Saya tidak layak. Tetapi terima kasih kerana bertanya, {hero}.']],
      v: [['owl', 'o', 'Being sorry is brave, {hero}. Being forgiven is a gift. Both make us stronger.', 'Menyesal itu berani, {hero}. Dimaafkan itu hadiah. Kedua-duanya menjadikan kita lebih kuat.']]
    },
    9: {
      c: [['villain', 'v', 'The crown was too heavy for me. It was too heavy because I wanted it for the wrong reason.', 'Mahkota itu terlalu berat untuk saya. Ia berat kerana saya mahukannya atas sebab yang salah.', 'sad']],
      v: [['villain', 'v', 'A true king is not the strongest or the fastest. A true king is kind. That is you, {hero}.', 'Raja sebenar bukan yang terkuat atau terpantas. Raja sebenar yang baik hati. Itulah kamu, {hero}.', 'happy'], ['hero', 'h', 'And you can paint the rainbow, {v}. You are part of the kingdom now!', 'Dan kamu boleh melukis pelangi, {v}. Kamu sebahagian daripada kerajaan sekarang!']]
    }
  },
  words: {
    0: [['Selamat datang', 'Welcome', '👋'], ['Hari ini', 'Today', '📅'], ['Gembira', 'Happy', '😊']],
    1: [['Hijau', 'Green', '🟢'], ['Rusa', 'Deer', '🦌'], ['Pokok', 'Tree', '🌲']],
    2: [['Kerang', 'Shell', '🐚'], ['Mutiara', 'Pearl', '🦪'], ['Kristal', 'Crystal', '💎']],
    3: [['Awan', 'Cloud', '☁️'], ['Tinggi', 'Tall', '📏'], ['Hujan', 'Rain', '🌧️']],
    4: [['Pelangi', 'Rainbow', '🌈'], ['Warna', 'Colour', '🎨'], ['Oren', 'Orange', '🟠']],
    5: [['Tangga', 'Stairs', '🪜'], ['Langkah', 'Step', '👣'], ['Malam', 'Night', '🌃']],
    6: [['Gema', 'Echo', '🗣️'], ['Suara', 'Voice', '🎙️'], ['Gunung', 'Mountain', '⛰️']],
    7: [['Pintu', 'Door', '🚪'], ['Bandar', 'City', '🏙️'], ['Emas', 'Gold', '🥇']],
    8: [['Bulan', 'Moon', '🌙'], ['Padang', 'Field', '🌾'], ['Arnab', 'Rabbit', '🐇']],
    9: [['Mahkota', 'Crown', '👑'], ['Raja', 'King', '🤴'], ['Angkasa', 'Space', '🌌']]
  }
};
