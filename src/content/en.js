export const names = {
  abc: ['Letters and sounds', 'Huruf dan bunyi'], words: ['Words', 'Perkataan'], grammar: ['Grammar', 'Tatabahasa'],
  opp: ['Opposites', 'Perkataan berlawan'], spell: ['Spelling', 'Ejaan'], read: ['Reading', 'Bacaan']
};
export default function (f) {
  f('en', 1, [
    ['abc', 'let', '🔤', "Which letter comes after A?", "B", "Huruf apakah selepas A?", "B"],
    ['abc', 'let', '🔤', "Which letter comes after C?", "D", "Huruf apakah selepas C?", "D"],
    ['abc', 'let', '🔤', "Which letter comes after F?", "G", "Huruf apakah selepas F?", "G"],
    ['abc', 'let', '🔤', "Which letter comes after M?", "N", "Huruf apakah selepas M?", "N"],
    ['abc', 'let', '🔤', "Which letter comes after R?", "S", "Huruf apakah selepas R?", "S"],
    ['abc', 'sound', '🍎', "Which letter does 'apple' start with?", "A", "Perkataan 'apple' bermula dengan huruf apa?", "A"],
    ['abc', 'sound', '🐱', "Which letter does 'cat' start with?", "C", "Perkataan 'cat' bermula dengan huruf apa?", "C"],
    ['abc', 'sound', '🐶', "Which letter does 'dog' start with?", "D", "Perkataan 'dog' bermula dengan huruf apa?", "D"],
    ['abc', 'sound', '🐟', "Which letter does 'fish' start with?", "F", "Perkataan 'fish' bermula dengan huruf apa?", "F"],
    ['abc', 'sound', '☀️', "Which letter does 'sun' start with?", "S", "Perkataan 'sun' bermula dengan huruf apa?", "S"],
    ['abc', 'sound', '🐸', "Which letter does 'frog' start with?", "F", "Perkataan 'frog' bermula dengan huruf apa?", "F"],
    ['words', 'noun', '🍎', "What is 🍎?", "Apple", "Apakah 🍎 (dalam bahasa Inggeris)?", "Apple"],
    ['words', 'noun', '🐱', "What is 🐱?", "Cat", "Apakah 🐱 (dalam bahasa Inggeris)?", "Cat"],
    ['words', 'noun', '🐶', "What is 🐶?", "Dog", "Apakah 🐶 (dalam bahasa Inggeris)?", "Dog"],
    ['words', 'noun', '📖', "What is 📖?", "Book", "Apakah 📖 (dalam bahasa Inggeris)?", "Book"],
    ['words', 'noun', '🚗', "What is 🚗?", "Car", "Apakah 🚗 (dalam bahasa Inggeris)?", "Car"],
    ['words', 'noun', '🌳', "What is 🌳?", "Tree", "Apakah 🌳 (dalam bahasa Inggeris)?", "Tree"],
    ['words', 'noun', '🐟', "What is 🐟?", "Fish", "Apakah 🐟 (dalam bahasa Inggeris)?", "Fish"],
    ['words', 'noun', '🏠', "What is 🏠?", "House", "Apakah 🏠 (dalam bahasa Inggeris)?", "House"],
    ['words', 'noun', '⚽', "What is ⚽?", "Ball", "Apakah ⚽ (dalam bahasa Inggeris)?", "Ball"],
    ['words', 'noun', '☀️', "What is ☀️?", "Sun", "Apakah ☀️ (dalam bahasa Inggeris)?", "Sun"],
    ['words', 'clr', '🍌', "What colour is a banana?", "Yellow", "Apakah warna pisang (dalam bahasa Inggeris)?", "Yellow", ["Blue", "Red", "Green"], ["Blue", "Red", "Green"]],
    ['words', 'clr', '🌿', "What colour is a leaf?", "Green", "Apakah warna daun (dalam bahasa Inggeris)?", "Green", ["Pink", "Black", "Purple"], ["Pink", "Black", "Purple"]],
    ['words', 'clr', '❄️', "What colour is snow?", "White", "Apakah warna salji (dalam bahasa Inggeris)?", "White", ["Red", "Black", "Green"], ["Red", "Black", "Green"]],
    ['words', 'num', '1️⃣', "Which word is the number 1?", "One", "Perkataan manakah nombor 1 (dalam bahasa Inggeris)?", "One", ["Two", "Three", "Four"], ["Two", "Three", "Four"]],
    ['words', 'num', '3️⃣', "Which word is the number 3?", "Three", "Perkataan manakah nombor 3 (dalam bahasa Inggeris)?", "Three", ["One", "Two", "Five"], ["One", "Two", "Five"]],
    ['words', 'num', '5️⃣', "Which word is the number 5?", "Five", "Perkataan manakah nombor 5 (dalam bahasa Inggeris)?", "Five", ["Four", "Six", "Two"], ["Four", "Six", "Two"]],
    ['opp', 'opp', '🐘🐭', "What is the opposite of 'big'?", "Small", "Apakah lawan bagi 'big'?", "Small", ["Tall", "Hot", "Fast"], ["Tall", "Hot", "Fast"]],
    ['opp', 'opp', '🔥🧊', "What is the opposite of 'hot'?", "Cold", "Apakah lawan bagi 'hot'?", "Cold", ["Big", "Slow", "Dark"], ["Big", "Slow", "Dark"]],
    ['opp', 'opp', '⬆️⬇️', "What is the opposite of 'up'?", "Down", "Apakah lawan bagi 'up'?", "Down", ["In", "Big", "Wet"], ["In", "Big", "Wet"]]
  ]);
  f('en', 2, [
    ["words", "v24w2", "🐘", "Which animal has a long trunk?", "Elephant", "Haiwan manakah ada belalai panjang? (dalam bahasa Inggeris)", "Elephant", ["Giraffe", "Zebra", "Rabbit"], ["Giraffe", "Zebra", "Rabbit"]],   // v24
    ["words", "v24w2", "🌧️", "What do we call water falling from clouds?", "Rain", "Apakah nama air yang jatuh dari awan? (dalam bahasa Inggeris)", "Rain", ["Sand", "Smoke", "Snowman"], ["Sand", "Smoke", "Snowman"]],   // v24
    ['abc', 'rhy', '🐱', "Which word rhymes with 'cat'?", "Hat", "Perkataan manakah berima dengan 'cat'?", "Hat", ["Dog", "Sun", "Pen"], ["Dog", "Sun", "Pen"]],
    ['abc', 'rhy', '🌞', "Which word rhymes with 'sun'?", "Run", "Perkataan manakah berima dengan 'sun'?", "Run", ["Cat", "Bed", "Pig"], ["Cat", "Bed", "Pig"]],
    ['abc', 'rhy', '🛏️', "Which word rhymes with 'bed'?", "Red", "Perkataan manakah berima dengan 'bed'?", "Red", ["Pig", "Cup", "Dog"], ["Pig", "Cup", "Dog"]],
    ['abc', 'rhy', '🐷', "Which word rhymes with 'pig'?", "Big", "Perkataan manakah berima dengan 'pig'?", "Big", ["Cat", "Sun", "Bed"], ["Cat", "Sun", "Bed"]],
    ['abc', 'syl', '👏', "How many syllables are in 'banana'?", "3", "Berapakah suku kata dalam 'banana'?", "3"],
    ['abc', 'syl', '👏', "How many syllables are in 'apple'?", "2", "Berapakah suku kata dalam 'apple'?", "2"],
    ['abc', 'syl', '👏', "How many syllables are in 'elephant'?", "3", "Berapakah suku kata dalam 'elephant'?", "3"],
    ['abc', 'syl', '👏', "How many syllables are in 'cat'?", "1", "Berapakah suku kata dalam 'cat'?", "1"],
    ['words', 'vowel', '🅰️', "Which word has the vowel 'a' in the middle?", "Cat", "Perkataan manakah mempunyai vokal 'a' di tengah?", "Cat", ["Pig", "Sun", "Hen"], ["Pig", "Sun", "Hen"]],
    ['words', 'vowel', '🅰️', "Which word has the vowel 'u' in the middle?", "Sun", "Perkataan manakah mempunyai vokal 'u' di tengah?", "Sun", ["Dog", "Cat", "Pin"], ["Dog", "Cat", "Pin"]],
    ['words', 'fam', '👨‍👩‍👧', "Who is your mother's mother?", "Grandmother", "Siapakah ibu kepada ibu anda (dalam bahasa Inggeris)?", "Grandmother", ["Sister", "Aunt", "Cousin"], ["Sister", "Aunt", "Cousin"]],
    ['words', 'body', '👁️', "What do we use to see?", "Eyes", "Apakah yang kita gunakan untuk melihat (dalam bahasa Inggeris)?", "Eyes", ["Ears", "Nose", "Hands"], ["Ears", "Nose", "Hands"]],
    ['words', 'body', '👂', "What do we use to hear?", "Ears", "Apakah yang kita gunakan untuk mendengar (dalam bahasa Inggeris)?", "Ears", ["Eyes", "Feet", "Mouth"], ["Eyes", "Feet", "Mouth"]],
    ['words', 'place', '🏫', "Where do students learn?", "School", "Di manakah murid belajar (dalam bahasa Inggeris)?", "School", ["Zoo", "Market", "Hospital"], ["Zoo", "Market", "Hospital"]],
    ['words', 'place', '🏥', "Where do doctors work?", "Hospital", "Di manakah doktor bekerja (dalam bahasa Inggeris)?", "Hospital", ["School", "Farm", "Library"], ["School", "Farm", "Library"]],
    ['words', 'day', '📅', "Which day comes after Monday?", "Tuesday", "Hari apakah selepas Monday?", "Tuesday"],
    ['words', 'day', '📅', "Which day comes after Wednesday?", "Thursday", "Hari apakah selepas Wednesday?", "Thursday"],
    ['words', 'day', '📅', "Which day comes after Friday?", "Saturday", "Hari apakah selepas Friday?", "Saturday"],
    ['words', 'day', '📅', "Which day comes after Saturday?", "Sunday", "Hari apakah selepas Saturday?", "Sunday"],
    ['words', 'day', '📅', "Which day comes after Tuesday?", "Wednesday", "Hari apakah selepas Tuesday?", "Wednesday"],
    ['grammar', 'aan', '🍎', "Fill in the blank: I have ___ apple.", "an", "Lengkapkan: I have ___ apple.", "an", ["a", "the", "two"], ["a", "the", "two"]],
    ['grammar', 'aan', '🐶', "Fill in the blank: I see ___ dog.", "a", "Lengkapkan: I see ___ dog.", "a", ["an", "are", "is"], ["an", "are", "is"]],
    ['grammar', 'be', '🙋', "Fill in the blank: She ___ my friend.", "is", "Lengkapkan: She ___ my friend.", "is", ["am", "are", "be"], ["am", "are", "be"]],
    ['grammar', 'be', '🙋', "Fill in the blank: I ___ happy.", "am", "Lengkapkan: I ___ happy.", "am", ["is", "are", "be"], ["is", "are", "be"]],
    ['grammar', 'be', '👫', "Fill in the blank: They ___ at school.", "are", "Lengkapkan: They ___ at school.", "are", ["is", "am", "be"], ["is", "am", "be"]],
    ['grammar', 'plu', '🐱🐱', "What is the plural of 'cat'?", "Cats", "Apakah bentuk jamak bagi 'cat'?", "Cats", ["Cat", "Cates", "Catten"], ["Cat", "Cates", "Catten"]],
    ['grammar', 'plu', '📦📦', "What is the plural of 'box'?", "Boxes", "Apakah bentuk jamak bagi 'box'?", "Boxes", ["Boxs", "Boxen", "Box"], ["Boxs", "Boxen", "Box"]],
    ['grammar', 'prep', '📦', "The cat is ___ the box. (It is inside.)", "in", "The cat is ___ the box. (Ia berada di dalam.)", "in", ["on", "under", "behind"], ["on", "under", "behind"]],
    ['grammar', 'prep', '🪑', "The book is ___ the table. (It is on top.)", "on", "The book is ___ the table. (Ia berada di atas.)", "on", ["in", "under", "behind"], ["in", "under", "behind"]],
    ['opp', 'opp', '☀️🌙', "What is the opposite of 'day'?", "Night", "Apakah lawan bagi 'day'?", "Night", ["Morning", "Sun", "Light"], ["Morning", "Sun", "Light"]],
    ['opp', 'opp', '😃😢', "What is the opposite of 'happy'?", "Sad", "Apakah lawan bagi 'happy'?", "Sad", ["Glad", "Funny", "Kind"], ["Glad", "Funny", "Kind"]],
    ['opp', 'opp', '🐢🐇', "What is the opposite of 'fast'?", "Slow", "Apakah lawan bagi 'fast'?", "Slow", ["Quick", "Big", "Hot"], ["Quick", "Big", "Hot"]],
    ['spell', 'sp', '✏️', "Which spelling is correct for 'sekolah'?", "school", "Yang manakah ejaan yang betul untuk 'sekolah'?", "school", ["scool", "skool", "shcool"], ["scool", "skool", "shcool"]],
    ['spell', 'sp', '✏️', "Which spelling is correct for 'kawan'?", "friend", "Yang manakah ejaan yang betul untuk 'kawan'?", "friend", ["freind", "frend", "frind"], ["freind", "frend", "frind"]],
    ['spell', 'sp', '✏️', "Which spelling is correct for 'gembira'?", "happy", "Yang manakah ejaan yang betul untuk 'gembira'?", "happy", ["hapy", "hapi", "happee"], ["hapy", "hapi", "happee"]]
  ]);
  f('en', 3, [
    ["grammar", "v24g3", "🏃", "Choose the correct word: 'Yesterday, Ali ___ to the park.'", "ran", "Pilih perkataan yang betul: 'Yesterday, Ali ___ to the park.'", "ran", ["runs", "running", "run"], ["runs", "running", "run"]],   // v24
    ["grammar", "sentence", "✏️", "A sentence starts with a …", "Capital letter", "Ayat bermula dengan … (dalam bahasa Inggeris)", "Capital letter", ["Full stop", "Question mark", "Small letter"], ["Full stop", "Question mark", "Small letter"]],   // v23
    ["grammar", "sentence", "✏️", "Which one is a whole sentence?", "The boy is running down the road.", "Yang manakah ayat yang lengkap?", "The boy is running down the road.", ["running down the road", "the boy running", "down the road."], ["running down the road", "the boy running", "down the road."]],   // v23
    ["grammar", "sentence", "❓", "Which mark ends a question?", "?", "Tanda apakah di hujung soalan?", "?", [".", "!", ","], [".", "!", ","]],   // v23
    ["grammar", "sentence", "🎉", "'Wow, I won' shows a big feeling. Which mark goes at the end?", "!", "'Wow, I won' menunjukkan perasaan yang kuat. Tanda apakah di hujungnya?", "!", [".", "?", ","], [".", "?", ","]],   // v23
    ["grammar", "sentence", "✏️", "Which question is written correctly?", "Where is my bag?", "Soalan manakah ditulis dengan betul?", "Where is my bag?", ["where is my bag?", "Where is my bag.", "where is my bag"], ["where is my bag?", "Where is my bag.", "where is my bag"]],   // v23
    ["grammar", "thisthat", "✏️", "The pencil is in your hand. '___ is my pencil.'", "This", "Pensel itu di tangan kamu. '___ is my pencil.'", "This", ["That", "Those", "These"], ["That", "Those", "These"]],   // v23
    ["grammar", "thisthat", "🐦", "A bird is far away in a tree. '___ is a bird.'", "That", "Seekor burung jauh di atas pokok. '___ is a bird.'", "That", ["This", "These", "Those"], ["This", "These", "Those"]],   // v23
    ["grammar", "thisthat", "👟", "Your shoes are next to you. '___ are my shoes.'", "These", "Kasut kamu di sebelah kamu. '___ are my shoes.'", "These", ["This", "That", "Those"], ["This", "That", "Those"]],   // v23
    ["grammar", "thisthat", "🧦", "The socks are far away. '___ are your socks.'", "Those", "Stoking itu jauh dari kamu. '___ are your socks.'", "Those", ["These", "This", "That"], ["These", "This", "That"]],   // v23
    ["grammar", "thisthat", "📍", "We use 'this' for something …", "Near us", "Kita guna 'this' untuk benda yang … (dalam bahasa Inggeris)", "Near us", ["Far away", "Very big", "Very small"], ["Far away", "Very big", "Very small"]],   // v23
    ["abc", "digraph", "🐟", "Which digraph is in 'fish'?", "sh", "Digraf manakah dalam perkataan 'fish'?", "sh", ["ch", "th", "ph"], ["ch", "th", "ph"]],   // v23
    ["abc", "digraph", "🪑", "Which digraph is in 'chair'?", "ch", "Digraf manakah dalam perkataan 'chair'?", "ch", ["sh", "th", "wh"], ["sh", "th", "wh"]],   // v23
    ["abc", "digraph", "🛁", "Which digraph is in 'bath'?", "th", "Digraf manakah dalam perkataan 'bath'?", "th", ["sh", "ch", "ng"], ["sh", "ch", "ng"]],   // v23
    ["abc", "digraph", "🚢", "Which word starts with 'sh'?", "ship", "Perkataan manakah bermula dengan 'sh'?", "ship", ["chip", "tip", "lip"], ["chip", "tip", "lip"]],   // v23
    ["abc", "digraph", "🙏", "Which word starts with 'th'?", "thank", "Perkataan manakah bermula dengan 'th'?", "thank", ["tank", "sank", "bank"], ["tank", "sank", "bank"]],   // v23
    ["abc", "magice", "🧢", "Add magic e to 'cap'. Which word do you get?", "cape", "Tambah 'e ajaib' pada 'cap'. Perkataan apakah yang terhasil?", "cape", ["capy", "cupe", "cap"], ["capy", "cupe", "cap"]],   // v23
    ["abc", "magice", "🪁", "Add magic e to 'kit'. Which word do you get?", "kite", "Tambah 'e ajaib' pada 'kit'. Perkataan apakah yang terhasil?", "kite", ["kitt", "kat", "kits"], ["kitt", "kat", "kits"]],   // v23
    ["abc", "magice", "🐇", "Add magic e to 'hop'. Which word do you get?", "hope", "Tambah 'e ajaib' pada 'hop'. Perkataan apakah yang terhasil?", "hope", ["hopp", "hip", "hops"], ["hopp", "hip", "hops"]],   // v23
    ["abc", "magice", "🎂", "Which word has a magic e?", "cake", "Perkataan manakah ada 'e ajaib'?", "cake", ["cat", "cap", "can"], ["cat", "cap", "can"]],   // v23
    ["abc", "magice", "🚲", "In 'bike', the letter 'e' is …", "Silent", "Dalam perkataan 'bike', huruf 'e' … (dalam bahasa Inggeris)", "Silent", ["Loud", "Said like 'ee'", "The first sound"], ["Loud", "Said like 'ee'", "The first sound"]],   // v23
    ["grammar", "wh", "👩‍🏫", "'___ is that?' 'That is my teacher.'", "Who", "'___ is that?' 'That is my teacher.' (Pilih perkataan yang betul.)", "Who", ["What", "Where", "When"], ["What", "Where", "When"]],   // v23
    ["grammar", "wh", "⚽", "'___ is this?' 'It is a ball.'", "What", "'___ is this?' 'It is a ball.' (Pilih perkataan yang betul.)", "What", ["Who", "Where", "Why"], ["Who", "Where", "Why"]],   // v23
    ["grammar", "wh", "🐱", "'___ is the cat?' 'The cat is on the bed.'", "Where", "'___ is the cat?' 'The cat is on the bed.' (Pilih perkataan yang betul.)", "Where", ["Who", "What", "Which"], ["Who", "What", "Which"]],   // v23
    ["grammar", "wh", "🧑", "'Who' asks about …", "People", "'Who' bertanya tentang … (dalam bahasa Inggeris)", "People", ["Places", "Things", "Times"], ["Places", "Things", "Times"]],   // v23
    ["grammar", "wh", "🗺️", "'Where' asks about …", "Places", "'Where' bertanya tentang … (dalam bahasa Inggeris)", "Places", ["People", "Things", "Colours"], ["People", "Things", "Colours"]],   // v23
    ["read", "story", "📖", "Every story has a beginning, a middle and an …", "End", "Setiap cerita ada permulaan, pertengahan dan … (dalam bahasa Inggeris)", "End", ["Title", "Picture", "Answer"], ["Title", "Picture", "Answer"]],   // v23
    ["read", "story", "🐰", "'Once upon a time, a little rabbit lived in the forest.' Which part of the story is this?", "Beginning", "'Once upon a time, a little rabbit lived in the forest.' Bahagian manakah ini?", "Beginning", ["Middle", "End", "Title"], ["Middle", "End", "Title"]],   // v23
    ["read", "story", "🥕", "'One day, the rabbit lost his carrot.' Which part of the story is this?", "Middle", "'One day, the rabbit lost his carrot.' Bahagian manakah ini?", "Middle", ["Beginning", "End", "Title"], ["Beginning", "End", "Title"]],   // v23
    ["read", "story", "😊", "'He found the carrot under a tree. He was happy.' Which part of the story is this?", "End", "'He found the carrot under a tree. He was happy.' Bahagian manakah ini?", "End", ["Beginning", "Middle", "Title"], ["Beginning", "Middle", "Title"]],   // v23
    ["read", "story", "🔢", "Which words help us tell a story in order?", "First, then, last", "Perkataan manakah membantu kita bercerita mengikut urutan?", "First, then, last", ["Big, small, tall", "Red, blue, green", "Yes, no, maybe"], ["Big, small, tall", "Red, blue, green", "Yes, no, maybe"]],   // v23
    ['grammar', 'tense', '🏃', "Fill in the blank: Yesterday, I ___ to school. (go)", "went", "Lengkapkan: Yesterday, I ___ to school. (go)", "went", ["go", "goes", "going"], ["go", "goes", "going"]],
    ['grammar', 'tense', '🍽️', "Fill in the blank: Yesterday, she ___ rice. (eat)", "ate", "Lengkapkan: Yesterday, she ___ rice. (eat)", "ate", ["eat", "eats", "eating"], ["eat", "eats", "eating"]],
    ['grammar', 'tense', '⚽', "Fill in the blank: Now, he ___ football. (play)", "is playing", "Lengkapkan: Now, he ___ football. (play)", "is playing", ["played", "plays", "will played"], ["played", "plays", "will played"]],
    ['grammar', 'tense', '📅', "Fill in the blank: Tomorrow, we ___ visit grandma.", "will", "Lengkapkan: Tomorrow, we ___ visit grandma.", "will", ["did", "was", "were"], ["did", "was", "were"]],
    ['grammar', 'sv', '🐦', "Fill in the blank: The bird ___ in the tree.", "sings", "Lengkapkan: The bird ___ in the tree.", "sings", ["sing", "singing", "sung"], ["sing", "singing", "sung"]],
    ['grammar', 'sv', '👧', "Fill in the blank: She ___ homework every day.", "does", "Lengkapkan: She ___ homework every day.", "does", ["do", "doing", "done"], ["do", "doing", "done"]],
    ['grammar', 'adj', '🌹', "Which word is an adjective (a describing word)? 'The red rose is pretty.'", "pretty", "Yang manakah kata sifat (perkataan yang menerangkan) dalam 'The red rose is pretty'?", "pretty", ["rose", "is", "the"], ["rose", "is", "the"]],
    ['grammar', 'pron', '👩', "Which word can replace 'Mary' in 'Mary likes cake'?", "She", "Perkataan manakah boleh menggantikan 'Mary' dalam 'Mary likes cake'?", "She", ["He", "They", "It"], ["He", "They", "It"]],
    ['grammar', 'pron', '👨‍👩‍👧‍👦', "Which word can replace 'Ali and Siti' in 'Ali and Siti are friends'?", "They", "Perkataan manakah boleh menggantikan 'Ali and Siti'?", "They", ["He", "She", "We"], ["He", "She", "We"]],
    ['grammar', 'plu', '🧒', "What is the plural of 'child'?", "Children", "Apakah bentuk jamak bagi 'child'?", "Children", ["Childs", "Childen", "Childes"], ["Childs", "Childen", "Childes"]],
    ['grammar', 'plu', '🦷', "What is the plural of 'tooth'?", "Teeth", "Apakah bentuk jamak bagi 'tooth'?", "Teeth", ["Tooths", "Toothes", "Teeths"], ["Tooths", "Toothes", "Teeths"]],
    ['grammar', 'plu', '👣', "What is the plural of 'foot'?", "Feet", "Apakah bentuk jamak bagi 'foot'?", "Feet", ["Foots", "Feets", "Footes"], ["Foots", "Feets", "Footes"]],
    ['grammar', 'punct', '❓', "Which sentence is written correctly?", "Where do you live?", "Yang manakah ayat yang ditulis dengan betul?", "Where do you live?", ["where do you live", "Where do you live.", "where do you live?"], ["where do you live", "Where do you live.", "where do you live?"]],
    ['grammar', 'punct', '✍️', "Which sentence about a name is written correctly?", "My name is Aisha.", "Yang manakah ayat tentang nama yang ditulis dengan betul?", "My name is Aisha.", ["my name is aisha", "My name is aisha.", "my name is Aisha."], ["my name is aisha", "My name is aisha.", "my name is Aisha."]],
    ['words', 'syn', '😄', "Which word means almost the same as 'happy'?", "Glad", "Perkataan manakah hampir sama maksud dengan 'happy'?", "Glad", ["Angry", "Tired", "Hungry"], ["Angry", "Tired", "Hungry"]],
    ['words', 'syn', '🏃', "Which word means almost the same as 'quick'?", "Fast", "Perkataan manakah hampir sama maksud dengan 'quick'?", "Fast", ["Slow", "Heavy", "Quiet"], ["Slow", "Heavy", "Quiet"]],
    ['words', 'syn', '🐘', "Which word means almost the same as 'huge'?", "Very big", "Perkataan manakah hampir sama maksud dengan 'huge'?", "Very big", ["Very small", "Very cold", "Very sweet"], ["Very small", "Very cold", "Very sweet"]],
    ['opp', 'opp', '🌞🌑', "What is the opposite of 'bright'?", "Dark", "Apakah lawan bagi 'bright'?", "Dark", ["Hot", "Wet", "Loud"], ["Hot", "Wet", "Loud"]],
    ['opp', 'opp', '🤫', "What is the opposite of 'whisper'?", "Shout", "Apakah lawan bagi 'whisper'?", "Shout", ["Walk", "Eat", "Sleep"], ["Walk", "Eat", "Sleep"]],
    ['opp', 'opp', '🧱', "What is the opposite of 'smooth'?", "Rough", "Apakah lawan bagi 'smooth'?", "Rough", ["Soft", "Light", "Round"], ["Soft", "Light", "Round"]],
    ['opp', 'opp', '🚪', "What is the opposite of 'arrive'?", "Leave", "Apakah lawan bagi 'arrive'?", "Leave", ["Come", "Reach", "Stay"], ["Come", "Reach", "Stay"]],
    ['spell', 'sp', '✏️', "Which spelling is correct for 'cantik'?", "beautiful", "Yang manakah ejaan yang betul untuk 'cantik'?", "beautiful", ["beutiful", "beautifull", "butiful"], ["beutiful", "beautifull", "butiful"]],
    ['spell', 'sp', '✏️', "Which spelling is correct for 'kerana'?", "because", "Yang manakah ejaan yang betul untuk 'kerana'?", "because", ["becuase", "becouse", "becase"], ["becuase", "becouse", "becase"]],
    ['spell', 'sp', '✏️', "Which spelling is correct for 'berbeza'?", "different", "Yang manakah ejaan yang betul untuk 'berbeza'?", "different", ["diffrent", "diferent", "differant"], ["diffrent", "diferent", "differant"]],
    ['spell', 'sp', '✏️', "Which spelling is correct for 'perpustakaan'?", "library", "Yang manakah ejaan yang betul untuk 'perpustakaan'?", "library", ["libary", "liberry", "librery"], ["libary", "liberry", "librery"]],
    ['read', 'read', '📖', "Read: 'Mia has a red kite. She flies it in the park.' Where does Mia fly her kite?", "In the park", "Baca: 'Mia has a red kite. She flies it in the park.' Di manakah Mia menerbangkan layang-layangnya?", "In the park", ["At school", "At home", "At the beach"], ["At school", "At home", "At the beach"]],
    ['read', 'read', '📖', "Read: 'Ben has a red kite.' What colour is the kite?", "Red", "Baca: 'Ben has a red kite.' Apakah warna layang-layang itu?", "Red", ["Blue", "Green", "Yellow"], ["Blue", "Green", "Yellow"]],
    ['read', 'read', '📖', "Read: 'It is raining. Sam takes his umbrella.' Why does Sam take his umbrella?", "It is raining", "Baca: 'It is raining. Sam takes his umbrella.' Mengapakah Sam membawa payung?", "It is raining", ["It is sunny", "He is hungry", "He is sleepy"], ["It is sunny", "He is hungry", "He is sleepy"]],
    ['read', 'read', '📖', "Read: 'Lina waters the plants every morning.' When does Lina water the plants?", "Every morning", "Baca: 'Lina waters the plants every morning.' Bilakah Lina menyiram pokok?", "Every morning", ["Every night", "Every Sunday", "Never"], ["Every night", "Every Sunday", "Never"]]
  ]);
}
