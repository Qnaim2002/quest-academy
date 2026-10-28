export const names = {
  bunyi: ['Sounds', 'Bunyi'], alat: ['Instruments', 'Alat muzik'], irama: ['Beat and rhythm', 'Rentak dan irama'], lagu: ['Songs', 'Lagu'], nada: ['Notes', 'Nota']
};
export default function (f) {
f('mz', 1, [
    ["nada", "sametune", "🎵", "Someone hums la-la-la, then la-la-la again. Are the two tunes the same or different?", "Same", "Seseorang bersenandung la-la-la, kemudian la-la-la lagi. Adakah dua lagu itu sama atau berbeza?", "Sama", ["Different", "We cannot tell"], ["Berbeza", "Tidak boleh diketahui"]],   // v23
    ["nada", "sametune", "🎵", "Someone hums la-la-la, then mi-mi-mi. Are the two tunes the same or different?", "Different", "Seseorang bersenandung la-la-la, kemudian mi-mi-mi. Adakah dua lagu itu sama atau berbeza?", "Berbeza", ["Same", "We cannot tell"], ["Sama", "Tidak boleh diketahui"]],   // v23
    ["nada", "sametune", "👏", "Clap-clap-clap, then clap-clap. Are the two rhythms the same or different?", "Different", "Tepuk-tepuk-tepuk, kemudian tepuk-tepuk. Adakah dua irama itu sama atau berbeza?", "Berbeza", ["Same", "We cannot tell"], ["Sama", "Tidak boleh diketahui"]],   // v23
    ["nada", "sametune", "👯", "'Same' means …", "Matching, like twins", "'Sama' bermaksud …", "Serupa, seperti kembar", ["Not matching", "Very loud", "Very fast"], ["Tidak serupa", "Sangat kuat", "Sangat laju"]],   // v23
    ["nada", "sametune", "🎶", "Why do many songs repeat the same part?", "So we can sing along easily", "Mengapakah banyak lagu mengulang bahagian yang sama?", "Supaya kita mudah menyanyi bersama", ["So the song stops", "So nobody can sing", "So it is quiet"], ["Supaya lagu berhenti", "Supaya tiada orang boleh menyanyi", "Supaya ia senyap"]],   // v23
  ['bunyi', 'dyn', '🦁', "A lion's roar is…", "Loud", "Bunyi auman singa itu…", "Kuat", ["Soft", "Slow", "Sleepy"], ["Lembut", "Perlahan", "Mengantuk"]],
  ['bunyi', 'dyn', '🤫', "A whisper is…", "Soft", "Bisikan itu…", "Lembut", ["Loud", "Fast", "Angry"], ["Kuat", "Cepat", "Marah"]],
  ['bunyi', 'dyn', '🐦', "A tiny bird's chirp is a … sound.", "High", "Kicauan burung kecil ialah bunyi yang…", "Tinggi", ["Low", "Deep", "Slow"], ["Rendah", "Dalam", "Perlahan"]],
  ['bunyi', 'dyn', '🥁', "A big drum's boom is a … sound.", "Low", "Dentuman gendang besar ialah bunyi yang…", "Rendah", ["High", "Thin", "Fast"], ["Tinggi", "Nipis", "Cepat"]],
  ['bunyi', 'dyn', '🐢', "A turtle walks slowly, so the music is…", "Slow", "Kura-kura berjalan perlahan, jadi muziknya…", "Perlahan", ["Fast", "Jumpy", "Bouncy"], ["Cepat", "Melompat-lompat", "Melantun"]],
  ['bunyi', 'dyn', '🐇', "A rabbit hops quickly, so the music is…", "Fast", "Arnab melompat laju, jadi muziknya…", "Cepat", ["Slow", "Sleepy", "Still"], ["Perlahan", "Mengantuk", "Diam"]],
  ['alat', 'inst', '🥁', "Which instrument is 🥁?", "Drum", "Apakah nama alat muzik 🥁?", "Gendang"],
  ['alat', 'inst', '🎹', "Which instrument is 🎹?", "Piano", "Apakah nama alat muzik 🎹?", "Piano"],
  ['alat', 'inst', '🎸', "Which instrument is 🎸?", "Guitar", "Apakah nama alat muzik 🎸?", "Gitar"],
  ['alat', 'inst', '🎺', "Which instrument is 🎺?", "Trumpet", "Apakah nama alat muzik 🎺?", "Trompet"],
  ['alat', 'inst', '🎻', "Which instrument is 🎻?", "Violin", "Apakah nama alat muzik 🎻?", "Biola"],
  ['irama', 'clap', '👏👏', "How many claps: 👏👏?", "2", "Berapakah tepukan: 👏👏?", "2"],
  ['irama', 'clap', '👏👏👏', "How many claps: 👏👏👏?", "3", "Berapakah tepukan: 👏👏👏?", "3"],
  ['irama', 'clap', '👏👏👏👏', "How many claps: 👏👏👏👏?", "4", "Berapakah tepukan: 👏👏👏👏?", "4"],
  ['irama', 'clap', '👏👏👏👏👏', "How many claps: 👏👏👏👏👏?", "5", "Berapakah tepukan: 👏👏👏👏👏?", "5"],
  ['lagu', 'act', '🇲🇾', "What should we do when Negaraku (the national anthem) is played?", "Stand up straight and show respect", "Apakah yang patut kita buat apabila lagu Negaraku dimainkan?", "Berdiri tegak dan beri hormat", ["Keep playing", "Talk loudly", "Run around"], ["Terus bermain", "Bercakap kuat", "Berlari-lari"]],
  ['lagu', 'act', '👶', "How do we sing a lullaby to a baby?", "Softly", "Bagaimanakah kita menyanyikan lagu dodoi untuk bayi?", "Dengan lembut", ["Very loudly", "By shouting", "By stomping"], ["Sangat kuat", "Dengan menjerit", "Sambil menghentak kaki"]]
]);
f('mz', 2, [
  ['nada', 'solfa', '🎵', "In do-re-mi, which note comes after Do?", "Re", "Dalam do-re-mi, nota manakah selepas Do?", "Re"],
  ['nada', 'solfa', '🎵', "In do-re-mi, which note comes after Re?", "Mi", "Dalam do-re-mi, nota manakah selepas Re?", "Mi"],
  ['nada', 'solfa', '🎵', "In do-re-mi, which note comes after Mi?", "Fa", "Dalam do-re-mi, nota manakah selepas Mi?", "Fa"],
  ['nada', 'solfa', '🎵', "In do-re-mi, which note comes after Fa?", "So", "Dalam do-re-mi, nota manakah selepas Fa?", "So"],
  ['nada', 'solfa', '🎵', "In do-re-mi, which note comes after So?", "La", "Dalam do-re-mi, nota manakah selepas So?", "La"],
  ['nada', 'solfa', '🎵', "In do-re-mi, which note comes after La?", "Ti", "Dalam do-re-mi, nota manakah selepas La?", "Ti"],
  ['nada', 'solfa', '🎶', "Which note comes after Ti to make the high Do?", "Do", "Nota manakah selepas Ti untuk menjadi Do tinggi?", "Do"],
  ['nada', 'n5', '🎼', "How many different notes are in do-re-mi-fa-so-la-ti?", "7", "Berapakah nota yang berbeza dalam do-re-mi-fa-so-la-ti?", "7"],
  ['alat', 'play', '🥁', "A drum is played by…", "Hitting it", "Gendang dimainkan dengan cara…", "Memukulnya"],
  ['alat', 'play', '🎶', "A flute (seruling) is played by…", "Blowing into it", "Seruling dimainkan dengan cara…", "Meniupnya"],
  ['alat', 'play', '🎸', "A guitar is played by…", "Plucking or strumming the strings", "Gitar dimainkan dengan cara…", "Memetik tali-talinya"],
  ['alat', 'play', '🪇', "Maracas are played by…", "Shaking them", "Marakas dimainkan dengan cara…", "Menggoncangnya"],
  ['alat', 'mal', '🥁', "Which round hand drum is often played at weddings in Malaysia?", "Kompang", "Gendang tangan bulat yang sering dimainkan di majlis perkahwinan ialah?", "Kompang"],
  ['alat', 'mal', '🔔', "Which big metal disc is hit with a mallet?", "Gong", "Cakera logam besar yang dipukul dengan pemukul ialah?", "Gong"],
  ['alat', 'mal', '🪕', "Which long lute from Sarawak has strings that we pluck?", "Sape", "Alat muzik berdawai panjang dari Sarawak yang dipetik ialah?", "Sape"],
  ['alat', 'mal', '🎶', "Which traditional wind instrument is blown and has a bright, loud sound?", "Serunai", "Alat tiupan tradisional yang berbunyi nyaring ialah?", "Serunai"],
  ['lagu', 'song', '🇲🇾', "What is Malaysia's national anthem called?", "Negaraku", "Apakah nama lagu kebangsaan Malaysia?", "Negaraku", ["Rasa Sayang", "Bangau Oh Bangau", "Burung Kakak Tua"], ["Rasa Sayang", "Bangau Oh Bangau", "Burung Kakak Tua"]],
  ['irama', 'term', '💓', "The steady pulse in music, like a heartbeat, is the…", "Beat", "Denyutan tetap dalam muzik seperti degupan jantung ialah?", "Ketukan"]
]);
f('mz', 3, [
  ['irama', 'term', '👣', "A pattern of long and short sounds is the…", "Rhythm", "Corak bunyi panjang dan pendek ialah?", "Irama"],
  ['nada', 'term', '🎼', "A tune made of notes going up and down is the…", "Melody", "Lagu yang terdiri daripada nota naik dan turun ialah?", "Melodi"],
  ['nada', 'term', '🎹', "Many notes sounding together make…", "Harmony", "Beberapa nota yang berbunyi serentak menghasilkan?", "Harmoni"],
  ['bunyi', 'term', '⏱️', "How fast or slow the music is…", "Tempo", "Kelajuan muzik, cepat atau perlahan, ialah?", "Tempo"],
  ['bunyi', 'term', '🔊', "How loud or soft the music is…", "Dynamics", "Kuat atau lembutnya muzik ialah?", "Dinamik"],
  ['bunyi', 'term', '📈', "How high or low a note sounds…", "Pitch", "Tinggi atau rendahnya sesuatu nota ialah?", "Pic"],
  ['irama', 'n5', '🎼', "How many beats does a minim (half note) get?", "2", "Berapakah ketukan bagi not minim?", "2"],
  ['irama', 'n5', '🎼', "How many beats does a crotchet (quarter note) get?", "1", "Berapakah ketukan bagi not krocet?", "1"],
  ['irama', 'n5', '🎼', "How many beats does a semibreve (whole note) get?", "4", "Berapakah ketukan bagi not semibreve?", "4"],
  ['lagu', 'role', '🧑‍🎤', "Who leads the musicians in an orchestra?", "Conductor", "Siapakah yang memimpin pemuzik dalam orkestra?", "Konduktor", ["Dancer", "Painter", "Photographer"], ["Penari", "Pelukis", "Jurugambar"]],
  ['alat', 'mal', '🥁', "Which two-headed drum is played in silat and traditional music?", "Gendang", "Alat muzik pukulan dua muka yang dimainkan dalam silat dan muzik tradisional ialah?", "Gendang"],
  ['alat', 'mal', '🪕', "Which Malay lute is played in ghazal music?", "Gambus", "Alat muzik berdawai Melayu yang dimainkan dalam muzik ghazal ialah?", "Gambus"],
  ['irama', 'rest', '🤫', "A rest in music means…", "A moment of silence", "Rehat dalam muzik bermaksud…", "Seketika senyap", ["A very loud sound", "A fast tune", "A new song"], ["Bunyi yang sangat kuat", "Lagu yang cepat", "Lagu baharu"]],
  ['alat', 'fam', '🥁', "Which group of instruments includes the drum, gong and kompang?", "Percussion", "Kumpulan alat muzik manakah yang mengandungi gendang, gong dan kompang?", "Perkusi", ["Strings", "Wind", "Keyboard"], ["Dawai", "Tiupan", "Papan kekunci"]],
  ['alat', 'fam', '🎶', "Which group of instruments includes the flute and the serunai?", "Wind instruments", "Seruling dan serunai tergolong dalam alat muzik…", "Tiupan", ["Percussion", "Strings", "Keyboards"], ["Perkusi", "Dawai", "Papan kekunci"]],
  ['lagu', 'act', '🎤', "How should we sing together in a choir?", "Listen to each other and sing as one", "Bagaimanakah kita menyanyi bersama dalam kumpulan koir?", "Mendengar rakan dan menyanyi serentak", ["Sing as loudly as possible", "Sing different songs", "Whisper only"], ["Menyanyi sekuat-kuatnya", "Menyanyi lagu berbeza", "Berbisik sahaja"]]
]);
}
