/* ================= Armory (143 items, 13 slots; v23 adds 21 knight items) ================= */
const ITEMS = [];
const mk = (slot, id, cost, en, ms, x = {}) => ITEMS.push({ slot, id, cost, en, ms, ...x });
/* look */
[['#FFDFC4', 'Peach', 'Pic'], ['#F5CBA7', 'Sand', 'Pasir'], ['#E3B07E', 'Honey', 'Madu'], ['#C68642', 'Caramel', 'Karamel'], ['#8D5A3B', 'Cocoa', 'Koko'], ['#5C3A28', 'Espresso', 'Kopi']]
  .forEach(([c, en, ms], i) => mk('skin', 'skin_' + (i + 1), 0, en, ms, { c }));
mk('hair', 'hair_short_brown', 0, 'Short brown', 'Pendek perang', { style: 'short', c: '#6B3E26' });
mk('hair', 'hair_long_black', 0, 'Long black', 'Panjang hitam', { style: 'long', c: '#2B2B33' });
mk('hair', 'hair_curly_ginger', 0, 'Curly ginger', 'Kerinting jingga', { style: 'curly', c: '#D0642C' });
mk('hair', 'hair_pigtails_blonde', 0, 'Blonde pigtails', 'Kuncit perang muda', { style: 'pigtails', c: '#E8C15A' });
mk('hair', 'hair_bun_purple', 0, 'Purple bun', 'Sanggul ungu', { style: 'bun', c: '#8E5CD9' });
mk('hair', 'hair_afro_black', 0, 'Big afro', 'Afro besar', { style: 'afro', c: '#2B2B33' });
mk('hair', 'hair_tudung_pink', 0, 'Pink tudung', 'Tudung merah jambu', { style: 'tudung', c: '#F28BB0' });
mk('hair', 'hair_tudung_blue', 0, 'Blue tudung', 'Tudung biru', { style: 'tudung', c: '#5B9BE8' });
mk('hair', 'hair_tudung_white', 0, 'White tudung', 'Tudung putih', { style: 'tudung', c: '#F4F4F8' });
mk('hair', 'hair_spiky_blue', 30, 'Spiky blue', 'Tegak biru', { style: 'spiky', c: '#3E7BE0' });
mk('hair', 'hair_wavy_teal', 40, 'Wavy teal', 'Beralun teal', { style: 'wavy', c: '#2BB5A0' });
mk('hair', 'hair_spiky_rainbow', 80, 'Rainbow spikes', 'Tegak pelangi', { style: 'spiky', c: 'rainbow' });
mk('face', 'face_none', 0, 'No face gear', 'Tiada aksesori');
mk('face', 'face_freckles', 15, 'Freckles', 'Jeragat');
mk('face', 'face_glasses', 20, 'Round glasses', 'Cermin mata bulat');
mk('face', 'face_whiskers', 25, 'Cat whiskers', 'Misai kucing');
mk('face', 'face_sunglasses', 30, 'Cool shades', 'Cermin mata hitam');
mk('face', 'face_paint', 35, 'Star paint', 'Cat bintang');
mk('face', 'face_mask', 40, 'Hero mask', 'Topeng wira');
/* clothes */
[['outfit_blue', 0, '#4DA3FF', 'Sky Tunic', 'Tunik langit', ''], ['outfit_green', 15, '#43C089', 'Leaf Tunic', 'Tunik daun', ''], ['outfit_purple', 15, '#9B7BFF', 'Grape Tunic', 'Tunik anggur', ''], ['outfit_orange', 15, '#FF9A3D', 'Mango Tunic', 'Tunik mangga', ''], ['outfit_pink', 15, '#FF6F91', 'Berry Tunic', 'Tunik beri', ''],
  ['outfit_coat', 30, '#F3F6FA', 'Scientist Coat', 'Kot saintis', 'coat'], ['outfit_vest', 35, '#C8B27A', 'Explorer Vest', 'Rompi penjelajah', 'vest'], ['outfit_melayu', 40, '#2BB5A0', 'Baju Melayu', 'Baju Melayu', 'sampin'], ['outfit_kurung', 40, '#E96A8D', 'Baju Kurung', 'Baju Kurung', 'kurung'],
  ['outfit_armor', 70, '#AAB4C8', 'Knight Armour', 'Perisai kesatria', 'armor'], ['outfit_robe', 80, '#4B3FA8', 'Wizard Robe', 'Jubah ahli sihir', 'stars'], ['outfit_space', 100, '#DDE3EE', 'Space Suit', 'Pakaian angkasa', 'space']]
  .forEach(([id, cost, c, en, ms, deco]) => mk('outfit', id, cost, en, ms, { c, deco }));
mk('hat', 'hat_none', 0, 'No hat', 'Tiada topi');
mk('hat', 'hat_cap', 20, 'Explorer Cap', 'Topi penjelajah');
mk('hat', 'hat_beanie', 25, 'Cosy Beanie', 'Beanie selesa');
mk('hat', 'hat_party', 30, 'Party Hat', 'Topi parti');
mk('hat', 'hat_chef', 35, 'Chef Hat', 'Topi chef');
mk('hat', 'hat_songkok', 40, 'Songkok', 'Songkok');
mk('hat', 'hat_flowers', 45, 'Flower Crown', 'Mahkota bunga');
mk('hat', 'hat_ladybug', 50, 'Ladybug Bands', 'Bando kepik');
mk('hat', 'hat_wizard', 60, 'Wizard Hat', 'Topi ahli sihir');
mk('hat', 'hat_grad', 70, 'Graduation Cap', 'Topi konvokesyen');
mk('hat', 'hat_cowboy', 75, 'Cowboy Hat', 'Topi koboi');
mk('hat', 'hat_helm', 90, 'Brave Helmet', 'Topi keledar berani');
mk('hat', 'hat_crown', 140, 'Golden Crown', 'Mahkota emas');
mk('hat', 'hat_astro', 150, 'Space Helmet', 'Topi keledar angkasa');
mk('cape', 'cape_none', 0, 'No cape', 'Tiada jubah');
mk('cape', 'cape_red', 30, 'Hero Cape', 'Jubah wira');
mk('cape', 'cape_leaf', 45, 'Leaf Cape', 'Jubah daun');
mk('cape', 'cape_star', 70, 'Starry Cape', 'Jubah berbintang');
mk('cape', 'wings_butterfly', 90, 'Butterfly Wings', 'Sayap rama-rama');
mk('cape', 'wings_angel', 110, 'Angel Wings', 'Sayap malaikat');
mk('cape', 'cape_rainbow', 120, 'Rainbow Cape', 'Jubah pelangi');
mk('cape', 'cape_gold', 160, 'Golden Cape', 'Jubah emas');
[['boots_brown', 0, '#5b4636', 'Trail Boots', 'But denai'], ['boots_red', 15, '#E5484D', 'Red Boots', 'But merah'], ['boots_blue', 15, '#3E7BE0', 'Blue Boots', 'But biru'], ['boots_gold', 60, '#E8B33A', 'Golden Boots', 'But emas'], ['boots_rainbow', 90, 'rainbow', 'Rainbow Boots', 'But pelangi']]
  .forEach(([id, cost, c, en, ms]) => mk('boots', id, cost, en, ms, { c }));
/* tools and shields give gameplay power; the rest is style */
[['weapon_pencil', 0, 0, 'Wooden Pencil', 'Pensel kayu'], ['weapon_crayon', 40, 3, 'Rainbow Crayon', 'Krayon pelangi'], ['weapon_ruler', 60, 5, 'Mighty Ruler', 'Pembaris perkasa'], ['weapon_paintbrush', 75, 6, 'Magic Brush', 'Berus ajaib'],
  ['weapon_wand', 95, 8, 'Star Wand', 'Tongkat bintang'], ['weapon_magnify', 120, 10, 'Magnifier', 'Kanta pembesar'], ['weapon_book', 140, 12, 'Spell Book', 'Buku mantera'], ['weapon_lollipop', 165, 13, 'Lolli Wand', 'Tongkat lolipop'],
  ['weapon_quill', 190, 15, 'Golden Quill', 'Pena bulu emas'], ['weapon_torch', 230, 17, 'Sun Torch', 'Obor suria'], ['weapon_rainbow', 280, 19, 'Rainbow Staff', 'Tongkat pelangi'], ['weapon_starhammer', 340, 22, 'Star Hammer', 'Tukul bintang']]
  .forEach(([id, cost, power, en, ms]) => mk('weapon', id, cost, en, ms, { power }));
[['shield_none', 0, 0, 'No shield', 'Tiada perisai'], ['shield_wood', 30, .25, 'Wooden Shield', 'Perisai kayu'], ['shield_lid', 45, .3, 'Pot-Lid Shield', 'Perisai penutup periuk'], ['shield_cookie', 60, .38, 'Cookie Shield', 'Perisai biskut'], ['shield_book', 80, .45, 'Book Shield', 'Perisai buku'],
  ['shield_heart', 100, .52, 'Heart Shield', 'Perisai hati'], ['shield_rainbow', 130, .6, 'Rainbow Shield', 'Perisai pelangi'], ['shield_star', 170, .68, 'Star Shield', 'Perisai bintang'], ['shield_planet', 220, .75, 'Planet Shield', 'Perisai planet']]
  .forEach(([id, cost, guard, en, ms]) => mk('shield', id, cost, en, ms, { guard }));
mk('pet', 'pet_none', 0, 'No pet', 'Tiada haiwan');
mk('pet', 'pet_cat', 50, 'Kitten', 'Anak kucing');
mk('pet', 'pet_dog', 50, 'Puppy', 'Anak anjing');
mk('pet', 'pet_bunny', 60, 'Bunny', 'Arnab');
mk('pet', 'pet_penguin', 70, 'Penguin', 'Penguin');
mk('pet', 'pet_slime', 80, 'Pet Slime', 'Lendir peliharaan');
mk('pet', 'pet_robot', 90, 'Robo-Buddy', 'Robot sahabat');
mk('pet', 'pet_dragon', 140, 'Baby Dragon', 'Anak naga');
mk('pet', 'pet_unicorn', 180, 'Unicorn', 'Unicorn');
mk('pet', 'pet_fox', 60, 'Little Fox', 'Anak rubah');
mk('pet', 'pet_hedgehog', 65, 'Hedgehog', 'Landak');
mk('pet', 'pet_turtle', 75, 'Turtle', 'Penyu');
mk('pet', 'pet_kancil', 85, 'Mouse-Deer', 'Kancil');
mk('pet', 'pet_panda', 90, 'Panda', 'Panda');
mk('pet', 'pet_owl', 95, 'Wise Owl', 'Burung hantu bijak');
mk('pet', 'pet_axolotl', 100, 'Axolotl', 'Axolotl');
mk('pet', 'pet_tiger', 110, 'Tiger Cub', 'Anak harimau');
mk('pet', 'pet_whale', 130, 'Baby Whale', 'Anak paus');
mk('pet', 'pet_phoenix', 200, 'Phoenix', 'Phoenix');
/* v13: knight skins (Tiny Tobias is free and worn from the start) */
mk('knight', 'knight_tobias', 0, 'Tiny Tobias', 'Tobias Kecil', { role: 'sentinel' });
mk('knight', 'knight_aldric', 120, 'Sir Aldric', 'Sir Aldric', { role: 'crusader' });
mk('knight', 'knight_elowen', 180, 'Lady Elowen', 'Lady Elowen', { role: 'guardian' });
mk('knight', 'knight_bram', 250, 'Bulwark Bram', 'Bram Benteng', { role: 'bastion' });
mk('knight', 'knight_onyx', 400, 'Onyx Warden', 'Pengawal Oniks', { role: 'onyx' });
mk('aura', 'aura_none', 0, 'No aura', 'Tiada aura');
mk('aura', 'aura_sparkle', 60, 'Sparkles', 'Kilauan');
mk('aura', 'aura_hearts', 80, 'Floating Hearts', 'Hati terapung');
mk('aura', 'aura_ring', 110, 'Rainbow Ring', 'Cincin pelangi');
mk('aura', 'aura_stars', 150, 'Orbiting Stars', 'Bintang mengorbit');
/* v23: more gear for the knights */
[['weapon_keris', 380, 23, 'Royal Keris', 'Keris Diraja'], ['weapon_trident', 420, 24, 'Sea Trident', 'Serampang Laut'], ['weapon_crystal', 470, 25, 'Crystal Sword', 'Pedang Kristal'],
  ['weapon_leaf', 520, 26, 'Jungle Blade', 'Pedang Rimba'], ['weapon_thunder', 580, 27, 'Thunder Spear', 'Lembing Petir'], ['weapon_moon', 650, 28, 'Moon Axe', 'Kapak Bulan']]
  .forEach(([id, cost, power, en, ms]) => mk('weapon', id, cost, en, ms, { power }));
[['shield_batik', 260, .76, 'Batik Shield', 'Perisai Batik'], ['shield_turtle', 300, .77, 'Turtle Shell Shield', 'Perisai Tempurung'], ['shield_moon', 340, .78, 'Moon Shield', 'Perisai Bulan'],
  ['shield_tiger', 390, .79, 'Tiger Shield', 'Perisai Harimau'], ['shield_crystal', 450, .8, 'Crystal Shield', 'Perisai Kristal']]
  .forEach(([id, cost, guard, en, ms]) => mk('shield', id, cost, en, ms, { guard }));
[['cape_ocean', 130, 'Ocean Cape', 'Jubah Lautan'], ['cape_tiger', 150, 'Tiger Cape', 'Jubah Harimau'], ['cape_batik', 170, 'Batik Cape', 'Jubah Batik'],
  ['cape_night', 190, 'Night Sky Cape', 'Jubah Langit Malam'], ['wings_phoenix', 240, 'Phoenix Wings', 'Sayap Phoenix']]
  .forEach(([id, cost, en, ms]) => mk('cape', id, cost, en, ms));
[['aura_leaves', 120, 'Falling Leaves', 'Daun Gugur'], ['aura_bubbles', 140, 'Bubbles', 'Buih'], ['aura_snow', 170, 'Snowflakes', 'Kepingan Salji'],
  ['aura_fire', 210, 'Fire Ring', 'Cincin Api'], ['aura_rainbow', 260, 'Rainbow Glow', 'Cahaya Pelangi']]
  .forEach(([id, cost, en, ms]) => mk('aura', id, cost, en, ms));
/* v25: still more gear, every piece with its own look (tests/v25 checks no two pieces draw the same) */
[['weapon_scepter', 700, 29, 'Bubble Scepter', 'Tongkat Buih'], ['weapon_lance', 760, 30, 'Coral Lance', 'Lembing Karang'], ['weapon_bow', 820, 31, 'Hornbill Bow', 'Busur Enggang'],
  ['weapon_flail', 880, 32, 'Comet Flail', 'Cemeti Komet'], ['weapon_sabre', 950, 33, 'Pirate Cutlass', 'Pedang Lanun']]
  .forEach(([id, cost, power, en, ms]) => mk('weapon', id, cost, en, ms, { power }));
[['shield_wave', 500, .81, 'Wave Shield', 'Perisai Ombak'], ['shield_paw', 540, .82, 'Pawprint Shield', 'Perisai Tapak'], ['shield_bolt', 580, .83, 'Storm Tower Shield', 'Perisai Menara Ribut'],
  ['shield_crown', 630, .84, 'Royal Crest Shield', 'Perisai Jata Diraja'], ['shield_scale', 690, .85, 'Dragon Scale Shield', 'Perisai Sisik Naga']]
  .forEach(([id, cost, guard, en, ms]) => mk('shield', id, cost, en, ms, { guard }));
[['cape_sunset', 210, 'Sunset Cape', 'Jubah Senja'], ['cape_checker', 220, 'Checkered Banner', 'Jubah Panji Petak'], ['cape_feather', 250, 'Hornbill Feather Cape', 'Jubah Bulu Enggang'],
  ['cape_galaxy', 280, 'Galaxy Cape', 'Jubah Galaksi'], ['wings_dragon', 320, 'Dragon Wings', 'Sayap Naga']]
  .forEach(([id, cost, en, ms]) => mk('cape', id, cost, en, ms));
[['aura_music', 180, 'Music Notes', 'Not Muzik'], ['aura_petals', 200, 'Blossom Petals', 'Kelopak Bunga'], ['aura_gems', 240, 'Gem Orbit', 'Permata Mengorbit'],
  ['aura_shadow', 280, 'Shadow Mist', 'Kabus Bayang'], ['aura_sun', 320, 'Sun Halo', 'Halo Suria']]
  .forEach(([id, cost, en, ms]) => mk('aura', id, cost, en, ms));
mk('pet', 'pet_frog', 70, 'Frog', 'Katak');
mk('pet', 'pet_octopus', 105, 'Octopus', 'Sotong Kurita');
mk('pet', 'pet_elephant', 120, 'Baby Elephant', 'Anak Gajah');
mk('pet', 'pet_orangutan', 140, 'Baby Orangutan', 'Anak Orang Utan');
mk('pet', 'pet_hornbill', 160, 'Hornbill', 'Burung Enggang');
mk('knight', 'knight_sakura', 300, 'Sakura Ranger', 'Renjer Sakura', { role: 'blossom' });
mk('knight', 'knight_coral', 340, 'Coral Tidewarden', 'Pengawal Ombak Karang', { role: 'tide' });
mk('knight', 'knight_sol', 480, 'Sunforge Paladin', 'Paladin Tempa Suria', { role: 'sunforge' });
/* v22: combo finishers (cosmetic: all hit equally hard; see 11e) */
const FINISHERS = [
  ['fin_starfall', 0, '🌟', 'Starfall', 'Hujan Bintang'], ['fin_thunder', 150, '⚡', 'Thunder Strike', 'Panahan Petir'],
  ['fin_meteor', 190, '☄️', 'Meteor Crash', 'Hentaman Meteor'], ['fin_frost', 230, '❄️', 'Frost Nova', 'Letusan Fros'],
  ['fin_tornado', 260, '🌪️', 'Leaf Tornado', 'Puting Beliung Daun'], ['fin_rainbow', 300, '🌈', 'Rainbow Beam', 'Pancaran Pelangi'],
  ['fin_dragon', 360, '🐉', 'Dragon Flame', 'Api Naga'], ['fin_tiger', 420, '🐯', 'Harimau Spirit', 'Semangat Harimau'],
  /* v25 */
  ['fin_blossom', 320, '🌸', 'Blossom Storm', 'Ribut Kelopak'], ['fin_tidal', 380, '🌊', 'Tidal Wave', 'Ombak Besar'],
  ['fin_eagle', 450, '🦅', 'Eagle Dive', 'Junaman Helang'], ['fin_volcano', 500, '🌋', 'Volcano Burst', 'Letusan Gunung Berapi'],
  ['fin_galaxy', 560, '🌌', 'Galaxy Vortex', 'Pusaran Galaksi']
];
FINISHERS.forEach(([id, cost, em, en, ms]) => mk('finisher', id, cost, en, ms, { fem: em }));
const ITEM = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const itemName = it => it[S.lang] || it.en;
/* v17: in pixel mode the Armory is all about the knights: armour skins, tools, shields, capes, auras and pets */
const KNIGHT_SLOTS = ['weapon', 'shield', 'helmet', 'chest', 'gloves', 'legs', 'cape', 'aura', 'pet', 'finisher'];   // v38: the knight is not chosen any more; armour pieces are
const SLOTS = ['knight', 'skin', 'hair', 'face', 'outfit', 'hat', 'cape', 'boots', 'weapon', 'shield', 'pet', 'aura', 'finisher'];
/* v38: armour pieces. Each one draws a different knight (09c ARM) and rolls its own stats (31). */
[['helmet', 'helm', [['none', 0, "Knight's Own Helm", 'Topi keledar kesatria'], ['bucket', 40, 'Bucket Helm', 'Topi keledar baldi'], ['ranger', 60, 'Ranger Hood Helm', 'Topi keledar renjer'], ['viking', 90, 'Horned Viking Helm', 'Topi keledar Viking bertanduk'],
  ['dragon', 130, 'Dragon Crest Helm', 'Topi keledar jambul naga'], ['wing', 170, 'Wing Helm', 'Topi keledar bersayap'], ['sun', 230, 'Sun Crown Helm', 'Topi keledar mahkota suria'], ['shadow', 290, 'Shadow Visor Helm', 'Topi keledar visor bayang'], ['frost', 350, 'Frost Helm', 'Topi keledar ais']]],
 ['chest', 'chest', [['none', 0, "Knight's Own Armor", 'Baju besi kesatria'], ['leather', 40, 'Leather Jerkin', 'Jerkin kulit'], ['mail', 70, 'Chainmail Coat', 'Kot rantai besi'], ['cross', 110, 'Crusader Plate', 'Baju besi pahlawan salib'],
  ['forest', 150, 'Forest Mail', 'Baju besi hutan'], ['flame', 200, 'Flame Plate', 'Baju besi api'], ['tide', 260, 'Tide Plate', 'Baju besi ombak'], ['royal', 320, 'Royal Plate', 'Baju besi diraja'], ['storm', 400, 'Storm Plate', 'Baju besi ribut']]],
 ['gloves', 'glove', [['none', 0, "Knight's Own Gauntlets", 'Sarung tangan besi kesatria'], ['leather', 30, 'Leather Gloves', 'Sarung tangan kulit'], ['iron', 60, 'Iron Gauntlets', 'Sarung tangan besi'], ['gold', 100, 'Golden Gauntlets', 'Sarung tangan emas'],
  ['spike', 140, 'Spiked Gauntlets', 'Sarung tangan berduri'], ['frost', 190, 'Frost Mitts', 'Sarung tangan ais'], ['ember', 250, 'Ember Gauntlets', 'Sarung tangan bara'], ['vine', 310, 'Vine Wraps', 'Balutan pokok menjalar'], ['star', 380, 'Star Gauntlets', 'Sarung tangan bintang']]],
 ['legs', 'legs', [['none', 0, "Knight's Own Greaves", 'Perisai kaki kesatria'], ['leather', 30, 'Leather Leggings', 'Legging kulit'], ['mail', 60, 'Chain Leggings', 'Legging rantai besi'], ['plate', 100, 'Steel Greaves', 'Perisai kaki keluli'],
  ['gold', 150, 'Golden Greaves', 'Perisai kaki emas'], ['leaf', 200, 'Leaf Greaves', 'Perisai kaki daun'], ['flame', 260, 'Flame Greaves', 'Perisai kaki api'], ['wave', 320, 'Wave Greaves', 'Perisai kaki ombak'], ['shadow', 390, 'Shadow Greaves', 'Perisai kaki bayang']]]
].forEach(([slot, pre, list]) => list.forEach(([k, cost, en, ms]) => mk(slot, pre + '_' + k, cost, en, ms)));
ITEMS.forEach(i => { ITEM[i.id] = i; });   // ITEM was built above, before the armour was added
const SLOT_EM = { helmet: '⛑️', chest: '🥋', gloves: '🧤', legs: '🦿', knight: '🤺', skin: '🧑', hair: '💇', face: '🕶️', outfit: '👕', hat: '🎩', cape: '🦸', boots: '🥾', weapon: '⚔️', shield: '🛡️', pet: '🐾', aura: '✨', finisher: '💥' };
const DEFAULT_EQUIP = { knight: 'knight_tobias', skin: 'skin_2', hair: 'hair_short_brown', face: 'face_none', outfit: 'outfit_blue', hat: 'hat_none', cape: 'cape_none', boots: 'boots_brown', weapon: 'weapon_pencil', shield: 'shield_none', pet: 'pet_none', aura: 'aura_none', finisher: 'fin_starfall', helmet: 'helm_none', chest: 'chest_none', gloves: 'glove_none', legs: 'legs_none' };

/* ================= Adventure (v5): 4 subjects x 100 levels ================= */
const PAL = ['#6BD18B', '#B28CFF', '#FF8FB1', '#FFA45C', '#7FD6E8', '#FFD65C', '#FF6B6B', '#8FA8FF', '#C9A27A', '#9AA9BD', '#4FD1C5', '#F2A0DC', '#9AE66E', '#D9C6FF', '#5B6EAE', '#FFC2A1'];
const SUBJ_ORDER = ['math', 'bm', 'en', 'sc', 'pm', 'pk', 'se', 'fk', 'sv', 'mz'];
const SUBJ_EM = { math: '🔢', bm: '📖', en: '🔤', sc: '🔬', pm: '🤝', pk: '🇲🇾', se: '💛', fk: '🏃', sv: '🎨', mz: '🎵' };
const SUBJ_COL = { math: '#FF8A1F', bm: '#E5484D', en: '#3E7BFA', sc: '#17A99B', pm: '#F2A900', pk: '#D6342C', se: '#F06FA8', fk: '#2E9E5B', sv: '#E5539C', mz: '#7C5CFF' };
const LEVELS_PER = 100;
const POOLCODE = { ph: 'lit:phonics', sy: 'lit:syll', sp: 'lit:spell', rh: 'lit:rhyme', mi: 'lit:missing', pw: 'math:pw', bk: 'bank:math', cm: 'math:cmp', un: 'math:units', fr: 'math:frac', wp: 'math:word', ce: 'stem:ce', so: 'stem:sort' };
const SKILLK = { ph: 'skill.phon', sy: 'skill.syll', sp: 'skill.spell', rh: 'skill.rhyme', mi: 'skill.missing', pw: 'skill.pw', bk: 'skill.pw', cm: 'skill.cmp', un: 'skill.units', fr: 'skill.frac', wp: 'skill.word', so: 'skill.sort' };
const CODES = { math: ['pw', 'bk', 'cm', 'bk', 'un', 'fr', 'wp'], lit: ['ph', 'sy', 'sp', 'rh', 'mi'], stem: ['ce', 'so'], life: ['li'] };
const STEMT = [['matter', 'forces'], ['living', 'react'], ['react', 'matter'], ['forces', 'living']];
const LIFET = ['feel', 'kind', 'safe', 'health'];
const SUBJ_IDX = { math: 0, bm: 1, en: 2, sc: 3, pm: 4, pk: 5, se: 6, fk: 7, sv: 8, mz: 9 };

/* ---- monsters: 1000 levels, 960 body + colour + eyes combos; the species variant keeps every level's monster unique ---- */
const MBODY = ['blob', 'round', 'egg', 'ghost', 'box', 'tri', 'star', 'cloud', 'fish', 'bean'];
const MALT = { blob: 'mimic', round: 'imp', egg: 'dryad', ghost: 'skeleton', box: 'automaton', tri: 'seraph', star: 'fire', cloud: 'cyclops', fish: 'wolf', bean: 'owlbear' };
const MALT2 = { blob: 'squid', round: 'bat', egg: 'pumpkin', ghost: 'yeti', box: 'crab', tri: 'cactus', star: 'thunderbird', cloud: 'bee', fish: 'turtle', bean: 'rex' };
const MALT3 = { blob: 'cupcake', round: 'raccoon', egg: 'durian', ghost: 'lantern', box: 'alien', tri: 'scarecrow', star: 'snail', cloud: 'treant', fish: 'frog', bean: 'mole' };
const MALT6 = { blob: 'firefly', round: 'pangolin', egg: 'hornbill', ghost: 'paperlamp', box: 'seaturtle', tri: 'pineapple', star: 'rainsnail', cloud: 'clouddragon', fish: 'cococrab', bean: 'moonrabbit' };
const MALT5 = { blob: 'jelly', round: 'dumpling', egg: 'mango', ghost: 'moth', box: 'rocket', tri: 'chili', star: 'rafflesia', cloud: 'icecream', fish: 'liondance', bean: 'luckycat' };
const MALT4 = { blob: 'puffer', round: 'snowman', egg: 'teapot', ghost: 'wau', box: 'beetle', tri: 'gnome', star: 'sheep', cloud: 'tapir', fish: 'croc', bean: 'parrot' };
const MEYES = ['two', 'big', 'one', 'three', 'stalk', 'sleepy'];
const MMOUTH = ['smile', 'open', 'teeth', 'tongue', 'oh', 'zig', 'fang'];
const MGROUPS = {
  top: ['horns', 'horn', 'antennae', 'earsCat', 'earsBunny', 'earsRound', 'spikes', 'flower', 'halo'], hat: ['crown', 'partyHat', 'topHat', 'wizardHat'],
  side: ['wingsBat', 'wingsAngel', 'fins', 'arms'], decor: ['spots', 'stripes', 'belly', 'sprinkles', 'bolt', 'bubbles', 'stars', 'ring'],
  face: ['cheeks', 'freckles', 'eyebrows', 'glasses'], low: ['tail', 'feet', 'scarf', 'bowtie']
};
const PRE = ['Zippy', 'Grumble', 'Bubbly', 'Sneaky', 'Fuzzy', 'Snappy', 'Wobbly', 'Giggly', 'Sleepy', 'Spiky', 'Cheeky', 'Mighty', 'Dizzy', 'Jolly', 'Crafty', 'Sparky', 'Chilly', 'Toasty', 'Silly', 'Brainy', 'Dusty', 'Frosty', 'Gloomy', 'Happy', 'Itchy', 'Jumpy', 'Kooky', 'Lumpy', 'Moody', 'Nutty'];
const NOUN = ['Blob', 'Wump', 'Gloop', 'Snorf', 'Fizz', 'Mog', 'Plonk', 'Zork', 'Bop', 'Grub', 'Flib', 'Squish', 'Munch', 'Boing', 'Doodle', 'Noodle', 'Pip', 'Wiggle', 'Gizmo', 'Snickle', 'Tumble', 'Fluff', 'Glimmer', 'Bonk', 'Zing'];
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const tierOf = n => n % 10 === 0 ? 'big' : n % 5 === 0 ? 'mini' : 'normal';
/* v23: monster names that match the monster. [English, Bahasa Melayu]; Malay puts the describing word after */
const MADJ = [['Grumpy', 'Pemarah'], ['Cheeky', 'Nakal'], ['Sneaky', 'Licik'], ['Jolly', 'Ceria'], ['Sleepy', 'Mengantuk'], ['Shy', 'Pemalu'], ['Brave', 'Berani'], ['Mighty', 'Gagah'],
  ['Silly', 'Lucu'], ['Dizzy', 'Pening'], ['Noisy', 'Bising'], ['Stubborn', 'Degil'], ['Hungry', 'Lapar'], ['Clever', 'Pintar'], ['Lazy', 'Malas'], ['Speedy', 'Pantas'], ['Cute', 'Comel'],
  ['Proud', 'Sombong'], ['Fussy', 'Cerewet'], ['Greedy', 'Gelojoh'], ['Clumsy', 'Cemerkap'], ['Fierce', 'Garang'], ['Busy', 'Sibuk'], ['Gloomy', 'Muram'], ['Giggly', 'Suka Ketawa'], ['Curious', 'Ingin Tahu']];
const MNOUN = {
  slime: ['Slime', 'Lendir'], goblin: ['Goblin', 'Goblin'], mushroom: ['Mushroom', 'Cendawan'], wraith: ['Wraith', 'Roh Kabus'], golem: ['Golem', 'Golem'], gargoyle: ['Gargoyle', 'Gargoyle'],
  crystal: ['Crystal Sprite', 'Pari Kristal'], troll: ['Troll', 'Troll'], drake: ['Drake', 'Naga Kecil'], shadow: ['Shadow Knight', 'Kesatria Bayang'],
  mimic: ['Mimic', 'Peti Ajaib'], imp: ['Imp', 'Imp'], dryad: ['Pixie', 'Pari-pari'], skeleton: ['Skeleton', 'Rangka'], automaton: ['Robot', 'Robot'], seraph: ['Sentinel', 'Pengawal'],
  fire: ['Fire Spirit', 'Roh Api'], cyclops: ['Cyclops', 'Gergasi Mata Satu'], wolf: ['Wolf', 'Serigala'], owlbear: ['Owlbear', 'Beruang Burung Hantu'],
  squid: ['Squid', 'Sotong'], cactus: ['Cactus', 'Kaktus'], bat: ['Bat', 'Kelawar'], pumpkin: ['Pumpkin Knight', 'Kesatria Labu'], yeti: ['Yeti', 'Yeti'], thunderbird: ['Thunderbird', 'Burung Guruh'],
  crab: ['Crab Bot', 'Ketam Robot'], turtle: ['Turtle Knight', 'Kesatria Kura-kura'], bee: ['Bee Queen', 'Ratu Lebah'], rex: ['Dino', 'Dino'],
  cupcake: ['Cupcake', 'Kek Cawan'], raccoon: ['Raccoon', 'Rakun'], durian: ['Durian', 'Durian'], lantern: ['Lantern', 'Tanglung'], alien: ['Alien', 'Makhluk Asing'],
  scarecrow: ['Scarecrow', 'Orang-orang'], snowman: ['Snow Buddy', 'Orang Salji'], parrot: ['Parrot', 'Burung Kakak Tua'], gnome: ['Gnome', 'Orang Kerdil'], beetle: ['Beetle', 'Kumbang'],
  puffer: ['Puffer Fish', 'Ikan Buntal'], croc: ['Crocodile', 'Buaya'], tapir: ['Tapir', 'Tapir'], wau: ['Wau Spirit', 'Roh Wau'], sheep: ['Cloud Sheep', 'Biri-biri Awan'], teapot: ['Teapot', 'Teko'], snail: ['Snail', 'Siput'], mole: ['Mole', 'Tikus Mondok'], treant: ['Tree Giant', 'Gergasi Pokok'], frog: ['Frog', 'Katak'],
  boss0: ['Dragon', 'Naga'], boss1: ['Bone King', 'Raja Tulang'], boss2: ['Titan', 'Titan Batu'], boss3: ['Horned Lord', 'Raja Bertanduk'], boss4: ['Archon', 'Pahlawan Cahaya'],
  boss10: ['Frost Wyrm', 'Naga Ais'], boss11: ['Plague Lich', 'Lich Wabak'], boss12: ['Crystal Titan', 'Titan Hablur'], boss13: ['Shadow Fiend', 'Iblis Bayang'], boss14: ['Starlight Archon', 'Pahlawan Bintang'],
  boss15: ['Magma Lord', 'Raja Magma'], boss16: ['Autumn Queen', 'Ratu Musim Luruh'], boss17: ['Cyber Chimera', 'Kimera Siber'], boss18: ['Golden Colossus', 'Gergasi Emas'], boss19: ['Storm Hydra', 'Hidra Ribut'],
  jelly: ['Moon Jelly', 'Obor-obor Bulan'], dumpling: ['Dumpling Buddy', 'Kawan Ladu'], mango: ['Mango Sprite', 'Pari Mangga'], moth: ['Moon Moth', 'Rama-rama Bulan'], rocket: ['Rocket Bot', 'Robot Roket'],
  chili: ['Chili Imp', 'Jin Cili'], rafflesia: ['Giant Bloom', 'Bunga Pakma'], icecream: ['Scoop Critter', 'Makhluk Aiskrim'], liondance: ['Lion Dancer', 'Tarian Singa'], luckycat: ['Lucky Cat', 'Kucing Bertuah'],
  firefly: ['Firefly', 'Kelip-kelip'], pangolin: ['Pangolin', 'Tenggiling'], hornbill: ['Hornbill', 'Burung Enggang'], seaturtle: ['Sea Turtle', 'Penyu'], paperlamp: ['Paper Lantern', 'Tanglung Kertas'],
  pineapple: ['Pineapple Guard', 'Pengawal Nanas'], rainsnail: ['Rainbow Snail', 'Siput Pelangi'], clouddragon: ['Cloud Dragon', 'Naga Awan'], cococrab: ['Coconut Crab', 'Ketam Kelapa'], moonrabbit: ['Moon Rabbit', 'Arnab Bulan'],
  boss5: ['Storm Lord', 'Raja Unsur'], boss6: ['Fairy Queen', 'Ratu Pari-pari'], boss7: ['Chimera', 'Kimera'], boss8: ['Colossus', 'Gergasi Jam'], boss9: ['Hydra', 'Hidra'],
  /* classic (non-pixel) art draws the body shape */
  c_blob: ['Blob', 'Gumpal'], c_round: ['Puffball', 'Bebola'], c_egg: ['Egg', 'Telur'], c_ghost: ['Ghost', 'Hantu'], c_box: ['Box Bot', 'Robot Kotak'], c_tri: ['Spike', 'Duri'],
  c_star: ['Star', 'Bintang'], c_cloud: ['Cloud', 'Awan'], c_fish: ['Fish', 'Ikan'], c_bean: ['Bean', 'Kacang']
};
const MBODY_SP = { blob: 'slime', round: 'goblin', egg: 'mushroom', ghost: 'wraith', box: 'golem', tri: 'gargoyle', star: 'crystal', cloud: 'troll', fish: 'drake', bean: 'shadow' };
function monKind(m) {
  if (typeof S !== 'undefined' && S && S.pixel === false) return 'c_' + m.b;
  return m.big ? 'boss' + (m.arch + 10 * (m.form || 0)) : (m.sp || MBODY_SP[m.b] || 'slime');
}
function monName2(m) {
  const li = L() ? 1 : 0, a = MADJ[(m.adj || 0) % MADJ.length][li], nn = (MNOUN[monKind(m)] || MNOUN.slime)[li];
  if (m.big) return li ? `${nn} ${a}` : `${nn} the ${a}`;
  const base = li ? `${nn} ${a}` : `${a} ${nn}`;
  return m.boss ? (li ? `Kapten ${base}` : `Captain ${base}`) : base;
}
const MONCACHE = {};
function monsterFor(subj, n) {
  const key = subj + n; if (MONCACHE[key]) return MONCACHE[key];
  const g = SUBJ_IDX[subj] * LEVELS_PER + (n - 1), tier = tierOf(n), r = rng(g * 7919 + 13), pick1 = a => a[Math.floor(r() * a.length)];
  const idx = (g * 353 + 101) % 960;                                   // one-to-one on 0..959; levels 961-1000 reuse a combo and differ by species variant
  const b = MBODY[(idx + Math.floor(idx / 160)) % 10], c =   /* v22: the eye group shifts the body, so every body (fish too) appears on ordinary levels */
     Math.floor(idx / 10) % 16, e = MEYES[Math.floor(idx / 160)];
  const names = Object.keys(MGROUPS), order = names.map(x => [r(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  const want = tier === 'big' ? 5 : tier === 'mini' ? 4 : 2 + Math.floor(r() * 3), f = [];
  for (const gr of order) { if (f.length >= want) break; if (gr === 'hat' && f.some(x => MGROUPS.top.includes(x))) continue; if (gr === 'top' && f.some(x => MGROUPS.hat.includes(x))) continue; f.push(pick1(MGROUPS[gr])); }
  if (tier !== 'normal' && !f.some(x => ['crown', 'horns', 'wingsBat', 'wingsAngel'].includes(x))) f.push(tier === 'big' ? 'crown' : pick1(['crown', 'horns']));
  if (tier === 'big') { if (!f.includes('crown')) f.push('crown'); if (!f.some(x => x.startsWith('wings'))) f.push('wingsBat'); }
  const p = (g * 37 + 11) % 750, nm = `${PRE[p % 30]} ${NOUN[Math.floor(p / 30) % 25]}`;
  /* v19: half the monsters are one of the ten newer species (beast, celestial, construct, fey, fiend, giant,
     monstrosity, undead, elemental); every zone boss is its own epic archetype, all ten different per subject */
  /* v22: a third of them are one of the ten newest species (squid, bat, pumpkin knight, yeti, crab, cactus,
     thunderbird, bee queen, shell knight, rex) */
  const v = (c + Math.floor(idx / 160) + Math.floor(g / 960)) % 5, sp0 = [undefined, MALT[b], MALT2[b], MALT3[b], MALT4[b]][v], z   /* v24: a fifth each */ = Math.floor((n - 1) / 10);
  /* v32: about one ordinary level in six uses one of ten newer species (MALT5: jelly, dumpling, mango, moth, rocket,
     chili, giant bloom, scoop critter, lion dancer, lucky cat); big zone bosses can be their ELDER form */
  const sp1 = tier !== 'big' && g < 960 && (g * 5 + c * 3 + idx) % 6 === 0 ? MALT5[b] : sp0, sp = tier !== 'big' && g < 960 && sp1 === sp0 && (g * 3 + c * 5 + idx * 2) % 7 === 1 ? MALT6[b] : sp1, form = tier === 'big' ? ((SUBJ_IDX[subj] % 2) ^ (z >= 5 ? 1 : 0)) : 0;
  /* v23: the shown name comes from what the monster really is (its species, or its body in classic art),
     in the game language; the old made-up name stays as a stable seed for the art */
  const mon = { seed: tier === 'big' ? `${nm} the Great` : tier === 'mini' ? `Captain ${nm}` : nm, b, c, e, m: pick1(MMOUTH), f: [...new Set(f)], t: g % 8, boss: tier !== 'normal' ? 1 : 0, big: tier === 'big', sp, form, lv: n, z, arch: tier === 'big' ? (z + SUBJ_IDX[subj]) % 10 : undefined, adj: p % MADJ.length, tier };
  Object.defineProperty(mon, 'n', { enumerable: true, get() { return monName2(this); } });
  return (MONCACHE[key] = mon);
}

/* ---- levels: generated on demand, always the same for the same subject + number ---- */
const SUBJ_BG = [130, 0, 215, 185, 45, 355, 330, 150, 300, 265];
const stageBG = (subj, z) => { const h = (z * 36 + SUBJ_IDX[subj] * 50 + 200) % 360, g = SUBJ_BG[SUBJ_IDX[subj]], dark = z >= 8 ? 30 : 0; return `linear-gradient(hsl(${h} 70% ${72 - dark}%) 0%,hsl(${(h + 25) % 360} 80% ${88 - dark}%) 58%,hsl(${g} 42% ${60 - dark / 2}%) 58%,hsl(${g} 42% ${44 - dark / 3}%) 100%)`; };
const LVCACHE = {};
function levelOf() { return HOOK.call('levelOf', levelOfBase, arguments); }   // v31: extensions register with HOOK (00c)
function levelOfBase(subj, n) {
  const key = subj + ':' + n; if (LVCACHE[key]) return LVCACHE[key];
  const z = Math.floor((n - 1) / 10), tier = tierOf(n), cs = CODES[subj] || [], m = cs.length;
  let codes; const BT = BTOP[subj], bm = BT && subj !== 'math' ? BT.length : 0;
  if (bm) codes = tier !== 'normal' ? [...BT, ...BT.slice(0, 2)].slice(0, 6) : [BT[(z + n) % bm], BT[(z + n) % bm], BT[(z + n + 1) % bm], BT[(z * 2 + n + 2) % bm]];
  else if (tier !== 'normal') codes = subj === 'stem' ? ['ce', 'so', 'ce', 'so'] : subj === 'life' ? ['li', 'li', 'li'] : [...cs, ...cs.slice(0, 2)];
  else if (subj === 'stem') codes = [['ce'], ['ce', 'so'], ['so', 'ce'], ['so', 'so', 'ce']][n % 4];
  else if (subj === 'life') codes = ['li', 'li'];
  else codes = [cs[(z + n) % m], cs[(z + n) % m], cs[(z + n + 1) % m], cs[(z * 2 + n + 2) % m]];
  const stem = subj === 'stem' ? STEMT[(z + n) % 4] : undefined, life = subj === 'life' ? LIFET[(z + n) % 4] : undefined;
  const pool = bm ? codes.map(c => 'bank:' + subj + ':' + c) : codes.map(c => c === 'li' ? (tier !== 'normal' ? 'life:sit' : `life:sit:${life}`) : POOLCODE[c]);
  const skills = bm ? [] : [...new Set(codes.map(c => c === 'ce' ? 'skill.' + stem[0] : c === 'li' ? 'skill.life' : SKILLK[c]))].slice(0, 4);
  const big = tier === 'big', mini = tier === 'mini';
  return (LVCACHE[key] = { id: key, subj, n, z, tier, boss: tier !== 'normal', big, mini, rounds: big ? 10 : mini ? 8 : 4 + Math.floor((n - 1) / 25), chip: 7 + Math.floor(n / 8) + (mini ? 2 : 0) + (big ? 4 : 0), dk: Math.min(1, .3 + .7 * (n - 1) / 99 + (big ? .1 : 0)), mon: monsterFor(subj, n), pool, skills, stem, bg: stageBG(subj, z), scene: ((SUBJ_IDX[subj] + z) % 6) + 1 });
}
