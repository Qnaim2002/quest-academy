# Changelog

All notable changes to Quest Academy. The version in `package.json` matches the newest entry here, and the
Parent Portal shows it at the bottom of the Privacy card. Versions before 21 were only tracked in README.txt;
they are listed below with the version numbers they were released under.

## [38.0.0] - 2026-10-27

### Added
- **Settings tab** (new bottom button, `src/parts/51-v38-settings.js`, `src/css/30-v38.css`): a page just for the child with big on/off rows for Sound and voice (read to me, sounds, music, voice, speed, loudness), Boss battle (big moves, boss talks, boss warns me, tell me why) and Easy reading (easy letters, calm screen, letter size). The Parent Portal still has everything too.
- **Hero armour:** the Knights section is gone. In its place are four new sections: Helmets, Body armor, Gauntlets and Leg armor, 9 pieces each (36 in all, 4 of them the free starter pieces). Every piece draws a different hero (own colours, shapes and extras, `src/parts/09c-pixel-knights.js`), has its own English and Malay name, and rolls its own bonus per child like the other gear (`31-v32-gear.js`, traits in `46-v35-armory.js`).
- **Ten more monsters** (`src/parts/09l-bestiary6.js`): Firefly, Pangolin, Hornbill, Sea Turtle, Paper Lantern, Pineapple Guard, Rainbow Snail, Cloud Dragon, Coconut Crab and Moon Rabbit. They appear in about one level in seven, have their own idle moves, and add 10 monster cards (80 kinds in all).
- **Parent summary:** the top of the Parent tab is now one friendly card ("How is {name} doing?"): four big numbers, one face per subject (great / on track / needs practice / just starting) and one tip (`src/parts/52-v38-parent.js`). The long analytics (this week, progress, mastery map, tricky questions, activity) are folded under "More details for grown-ups". Nothing was removed.

### Changed
- **The hero is weaker:** less guard (capped at 40%), a lower base attack and power growth, and a smaller finisher and crit bonus. Gear bonuses have lower caps, so armour cannot make the hero too strong.
- **How to answer:** Speak and Write now follow the question. If a question cannot be answered that way (for example a picture-only choice), the child sees the tap buttons with a small "Tap the answer for this one" note instead of an empty box. Voice answers also start ready to listen.
- **Malay check:** all Malay screen texts and the question and lesson banks were read through. Fixed: "Yang lain sendiri" -> "Yang berbeza", Undo ("Buat semula" -> "Buat asal"), "Lagenda" -> "Legenda", "pukul ... suku" -> "kurang suku", "Pinkan" -> "Semat", "Thp" -> "Tahap", "Gedung Perkakas" -> "Gedung Senjata", "Mungkiri" -> "Mungkir", "sebeg beras" -> "sekarung beras", "tinggal sebersama" -> "tinggal bersama", "rasalah" -> "rasailah", and a few more. The Hero tab and family texts no longer say "knights".
- The JS size limit in budget.json is raised from 1600 to 1640 KB (the new monsters and armour).

### Fixed
- Armour pieces could not be bought or worn because the item table was built before they were added. It is now complete (`03-items-and-levels.js`).
- Gear rolls were not capped; they now are (`GEAR_CAP`).
- The new monsters are listed in the sprite worker (`vite.config.js`) so they draw in the worker too.

## [37.2.0] - 2026-10-27

### Changed
- **Tracing:** the numbers now show at the start of every stroke. A, B, D, E, F, P and R had a "2" sitting on top of the "1". The Number line option is removed from tracing.
- **Lessons:** "Key words" is removed. The lesson cards keep only the big idea, two examples and the try-it. The practice card has a big question and big answers (no arena, no extra buttons). The "Pick a pet to get XP" text is gone.
- **Battle:** the Rival card is removed from the subject list. Every subject card is filled with its own colour.
- **Hero:** a simpler tab (one big picture, Power, three big tabs: Gear, Pet Haven, Wardrobe). The hero perks pop-up shows the level, a bar and the perks you have plus the next one.
- The CSS size limit in budget.json is raised from 260 to 270 KB (the new simple screens).
- **Pets:** pets are zoomed in to fill their pictures, with a ground shadow, stage dots and a clear "40 / 120 XP" count. Pets in the shop show their perk.

## [37.1.0] - 2026-10-27

### Changed
- **A simpler lesson page.** The lesson now shows one step at a time with big ‹ › arrows and dots (`src/parts/50-v37-simple.js`, `src/css/29-v37.css`):
  the warm-up question and the first card, then one big card per step (big idea, examples, try it, remember, careful), then the "Try it" page (see it, practice), then a last page with one big "I learned this ✔" button and ✔ Finish.
  The small step chips, the listen bar and the extra headings are hidden. All the old lesson parts are still there, so practice, quick check and rewards work as before.

## [37.0.0] - 2026-10-25

### Changed
- **A simpler home for small children** ("step by step" design). The bottom bar has four big buttons: **Learn, Play, Hero, Cards**. The Parents area is behind a 🔒 button at the top.
  The old tabs are still in the page (hidden buttons, same ids), so nothing was removed from the game and every saved game works.
- **Learn is three steps** (`src/parts/50-v37-simple.js`): 1 pick a subject (four big tiles on a page, with arrows), 2 pick a lesson (three big cards on a page: ⭐ done, ▶ next, 🔒 not yet),
  3 "Ready?" and a big Go button. Go is the ordinary lesson action, so quick checks, practice and the quiz work as before. Closing the lesson returns to the lesson list.
  Tracing and Games are tiles on the last page; the Games page shows the ten games as big pictures.
- **Gone from Learn:** the subject-list pop-up with age buttons, the "Starter / Builder / Expert" text, the pet strip, the subject banner, the lesson-of-the-week card and the activity wall.
  The lesson ladder still decides what is open (🔒) and what is done; the age is the one a grown-up chose (the age buttons are also hidden in Battle and Tower).
- **Play** holds three big buttons: Battle (the old Adventure), Tower and Think (KBAT). Each opens its screen with a back arrow, and Play stays lit in the bottom bar.
- The game now opens on Learn (it used to open on Adventure). Leaving the Parents area also goes to Learn.
- The top bar no longer shows the language button or the "Quest Academy" name (language is still in the Parent Portal and the welcome screen).
- "Studies" is now "Learn" (Belajar), "Armory" is now "Hero" (Wira).
- Tests: `tests/v37.test.mjs` (8 tests) and `tests/e2e/v37.spec.mjs` (computer and phone). The old browser tests now press the hidden tab buttons through a script (`evaluate(b => b.click())`) and open the Adventure tab before they start a battle directly.

### Notes
- Hero, Cards, Battle, Tower and Think keep their old contents inside the new bottom bar. They are the next screens to simplify.
- The lesson page itself (the cards you read) is unchanged.
- No new save keys.

## [36.0.0] - 2026-10-25

### Added
- **Fact tables.** `src/content/facts-data.js` stores 240 facts once (item, attribute, picture, English and Malay) in 23 sets (habitats, coverings, senses, shapes,
  opposites, manners, feelings, symbols, capitals, helpers, safety, colours, instruments ...). `src/content/facts.js` makes six question shapes from each fact:
  multiple choice, true/false, fill the gap, odd one out, sort, and tap the picture. About 3,100 different questions, English and Malay, from data that is easy to extend.
  The code is part of the lazy `formats` chunk (the lazy limit is still 100 KB; it is now 84 KB).
- **Per-child "seen" counts** (`S.seenQ`, `src/parts/47-v36-seen.js`). The game prefers a question the child has never seen, then the one seen longest ago. The `RECENT` list of 160
  still blocks quick repeats. The list is capped at 2,600 questions per child (the oldest 12% are dropped), so the save stays small. Parent Portal: "Start the questions fresh".
- **Bilingual boost** (Parent Portal switch, off by default, `S.bilingual`). English → Malay and Malay → English word questions: fill the gap, join the words, true/false, tap the picture, multiple choice.
- **Format grid in `AUDIT.md`.** `npm run audit` now lists, for every subject, how often each of the 17 formats appears (from 1,200 draws). Every subject has at least 5 formats.
- **Age 7 banks grown:** Fitness 50 → 100, Socio-emotional 52 → 103, Citizenship 55 → 107, Moral 55 → 95 (English and Malay).
- **Story choices with consequences** (`src/parts/48-v36-path.js`). Every fork in a chapter story now picks a twist for the NEXT land of that subject (the last land's fork shapes itself):
  Helper (first mistake each fight is free), Bounty (extra coins), Steady Mind (+25% time), Bold Road (tougher foes, many more coins), Spark Trail (faster super charge),
  Healing Spring, or Treasure Hunt (win a fight there and pick 1 of 2 treasures). The result line says what changed, and the fights in that land show a chip.
- **Tower: builds.** The perks are now 9 in three builds: Scholar (Extra Time, Hoot's Hint, Strong Arm), Tank (+1 Heart, Second Chance, Healing Leaf), Lucky (Double Coins, new Lucky Charm, new Coin Magnet).
  3 perks of one build wake a small power (Clear Mind, Thick Skin, Haggler), 6 a big one (Sharp Focus, Second Wind, Fortune).
- **Tower: reroll and banish.** On every perk sheet the climb's coins can reroll the three offers (cost rises) or banish a perk for the rest of the climb.
- **Tower: Ascension (New Game+).** Reaching floor 100 opens Ascension 1 and gives a title (Tower Master ... Tower Legend, five steps, in the Me page). Each step adds a twist
  (tougher foes, less time, dearer shop and weaker campfire, more special floors and 2 perks to pick from, no Second Chance) and 25% more coins.
- **Tower: curse deals.** A third choice at the Shrine, only for ages 6 and 7: five floors of harder questions, a faster clock or tougher foes, paid back with double coins, a free perk now and a chest at the end. The child chooses it; ages 4 and 5 never see it.
- **Tower: milestone bosses.** Floors 25, 50, 75, 100 (and every 100th after) each break one rule: Twin Strike (damage lands every second right answer, twice as hard), Hourglass (the clock runs only after a wrong answer),
  Trickster (a wrong answer shuffles the answers and the boss heals a little), Grand Finale (one rule for each third of the boss's health). Banner, chip and a map mark.
- Tests: `tests/v36.test.mjs` (29 tests) and `tests/e2e/v36.spec.mjs` (computer and phone).

### Changed
- `QT.pickFor` can skip the share roll for extra candidates (`lv.force`), so a battle can look at 4 candidates and take the freshest one. With the Bilingual boost on, the exact non-multiple-choice share is approximate.
- The result line of a story choice now ends with what it changes.
- `budget.json`: main script 1,560 -> 1,600 KB, gzip 550 -> 575 KB (the Tower, story and seen-count parts are about 40 KB; they hook into the battle). First load is 608 of 625 KB gzip.

### Notes
- Save keys added without a schema change: `S.seenQ`, `S.seenN`, `S.bilingual`, `S.pathFx`, `tower().asc`. An older save simply has none of them.
- Choosing a story fork again in a replayed story picks a new twist for that land, unless its treasure was already taken.
- Ascension runs always start at floor 1 (the check-point button is hidden while a step is selected).

## [35.0.0] - 2026-10-25

### Added
- **13 new question formats** (lazy chunk `src/content/formats*.js`, about 52 KB, English and Malay): number line, fill the gap by drag, sort into boxes,
  build a sentence, spot the mistake, clock, money, hear-a-word-tap-the-picture, two-step, memory flash, tap the part of a picture, draw the answer, rhythm echo.
  Each has a hint after a wrong try, keyboard/button alternatives, and a "why" for the mistake review. Bosses get short forms (3 tiles, 3 pairs, a sentence of up to 4 words).
- **Damage follows the answer.** A quick answer (thinking bar above two thirds) +25%, above one third +10%; first try +10%, second try -20%, third or later -35%; a quick
  first try charges the super attack twice; a long streak adds up to +36% on the super attack. Kept between x0.5 and x1.7. Labels: Quick, First try, Streak.
- **Tower upgrades.** Perk choice after every mini boss (7 perks), floor twists with a banner (Speed, Calm, Order, Mirror, Lucky), rest rooms (Campfire, Merchant,
  Shrine, Puzzle Room), a subject choice at every 5th floor or a parent focus (`S.focus`), weaker subjects come up more, brother and sister "ghosts" on the daily
  board, a story beat every 10 floors and an ending at floor 100, and a map picture of the climb.
- **Armory upgrades.** Gear traits (6), compare panel, trophy gear (zone bosses, Tower milestones, a weekly piece), multi-relic slots (2 at hero level 20, 3 at 40),
  8 relic pairs, weapon evolution at upgrade level 5 (+3 attack, new look, ceremony), and a Wardrobe tab (looks only, no stat change).
- Tests: `tests/v35.test.mjs` (25 tests) and browser tests for formats, Tower and Armory (computer and phone, pixel and classic art).

### Changed
- **The share of non-multiple-choice questions is exact.** Before, a "no" was re-rolled up to three times, so the real share was far above the numbers in the
  notes (about 56% to 86%) and nobody could tune it. Now: age 4 = 60%, age 5 = 58%, age 6 = 55%, age 7 = 52% (`QT.SHARE`).
- Tower floor rewards, modifiers and subjects are now planned per climb (seeded, so a retried floor is the same).
- Phone: the four Armory tabs fit on one line, and the "keep it on your home screen" bar no longer covers the Parent Portal keypad.
- `budget.json`: main script limit 1,500 -> 1,560 KB, gzip 530 -> 550 KB, first load 600 -> 625 KB. The new Tower and Armory parts (about 60 KB) have to be in the
  main script because they hook into the battle and the hero. The new question formats are NOT in it (`formats` must stay lazy).

### Notes
- Trophy gear uses existing shop pieces; they are no longer for sale, owned pieces stay, and past wins give catch-up pieces when the Armory opens.
- Pixel-art Wardrobe: weapon, shield and cape only. Classic art: all six slots.
- The weekly piece counts all battles won this week (any subject).

## [34.0.0] - 2026-10-25

### Added
- **Content audit and 590 new questions.** `npm run audit` counts lessons, questions, topics and different questions for
  every subject and age and writes `AUDIT.md`. It showed thin spots (age 4, Fitness, Arts, Music, Citizenship), so the
  question banks grew from 1,145 to 1,735 rows (English and Malay) in `src/content/more/`. No subject and age is below the targets now.
- **First-launch placement quiz.** After the welcome, a short quiz climbs through each subject (stops at the first miss, or "I'm not
  sure") and sets where each subject starts on the map. It can be skipped, retaken or reset in the Parent Portal.
- **Questions adjust inside a battle.** Two right answers in a row make the next question a little harder; two wrong ones make it
  gentler. A small chip shows it and it is announced to screen readers. A Parent Portal switch turns it off.
- **Real-world word problems** (pasar malam, canteen, bus, kuih stall, cinema...) in Math, with a picture for younger children, in English and Malay.
- **Write the answer.** In Math the child can write number answers by hand on a write pad (reuses the tracing engine, tiny built-in
  digit recogniser, no downloads). A "Use buttons instead" button is always there.
- **KBAT tab (Think Hard).** A new tab with 84 higher-order thinking questions (apply, analyse, evaluate, create) across subjects, five per round,
  a short "why" after each answer, small daily-capped coins and a skills summary.
- **Me page (hero look).** Armory has a third view: a favourite colour, titles you earn, a picture frame, a battle cry, a win pose and a name (all free).
- **Pet friend chat.** The buddy pet says an encouraging line after a streak or a wrong answer, and the child can tap to chat with it.
- **Celebration pacing.** Finisher shows can be set to Always full, Full the first time only, or Short. Until someone chooses, a card offers it after the first show.
- **Update bar.** When a new version is waiting, a "New version ready - reload?" bar shows (only between battles). Nothing reloads by surprise.
- **Install nudge.** On a first visit (https or localhost) parents see a small "keep it on your home screen" bar, with help for iPhone. Not now / never are remembered.
- **Private counts (opt-in).** Parent Portal can keep anonymous counts on this device of which levels were started, won and left, and show where
  children get stuck. Off by default, never sent anywhere, can be copied, saved or cleared.
- **Content authoring tool.** `npm run author -- form` makes `tools/author.html` (open it by double-click, works offline), which checks each question as you type and downloads
  a CSV. `npm run author -- import file.csv` checks every row and adds it to `src/content/more/added.js`.
- **Malay QA.** `npm run lint:bank` now lists lines where English and Malay are identical, English words left in Malay, numbers that differ, odd lengths and
  missing ?/!. These never fail the build; `-- --review` writes MALAY-REVIEW.csv for a native speaker and `-- --approve` remembers the ones marked ok
  (`src/content/ms-reviewed.txt`).
- **Size budget in CI.** `budget.json` and `npm run budget` fail the build if the main script, style sheet, first download, worker or any lazy file passes its limit,
  or if the KBAT and light-show files get pulled back into the main script. `lighthouserc.json` adds Lighthouse (mobile), and `.github/workflows/ci.yml`
  runs check, lint:bank, test, build, budget, the browser tests and Lighthouse.
- **Low-end phone test.** `tests/e2e/perf.spec.mjs` slows the CPU 4x and checks start time and frame times in a battle.
- **More browser tests.** `tests/e2e/v34.spec.mjs` covers all 10 subjects, all 4 ages, the Parent Portal (wrong and right code), offline mode, a phone turned sideways,
  the placement quiz, KBAT, the write pad, the Me page and the update/install bars.

### Changed
- **Landscape.** Every popup and screen was reworked for a phone turned sideways (short screens): side navigation rail, two-column sheets, close button beside the sheet,
  battle layout, win sheet, story, shop and Parent Portal.
- **Lazy loading (partly).** The KBAT questions (36 KB) and the finisher light show (32 KB, now a real ES module `src/content/vfx.js`) load only when needed, with a quiet
  load a few seconds after start so nothing waits. Main script: 1,545 KB to 1,490 KB. The rest of the game is still one scope (see "Next" below).
- **Save file version 5** with a migrator (`src/parts/04z-save-schema.js`): old saves gain the new fields, a save from a newer app is left alone, junk is replaced
  safely, running it twice changes nothing. Tests cover each case.
- The service worker no longer takes over on its own (it waits for the update bar), and it ignores the "Vary" header when looking in the cache.

### Fixed
- **Lazy files did not load offline** (lessons, stories and now KBAT) in Chrome when the host sends `Vary: Origin`. The cache lookup now ignores Vary. An offline browser test guards it.

### Next (not done yet)
- Moving the whole game from one big scope (`HOOK`) to real ES modules, the saga (92 KB, used on 21 screens) and the pixel-art packs per zone. This needs a step-by-step move,
  each step with its tests; the size budget will show the gains.

## [33.0.0] - 2026-10-25

### Added
- **Finisher light shows.** All 13 finishers now draw their own light show on a small canvas, on top of the old
  effects: a charge-up around the hero, then Starfall (a rain of stars), Thunder (forked lightning and a dark sky),
  Meteor (a burning rock, shockwave and flying rubble), Frost Nova (rising ice spikes that shatter), Leaf Tornado
  (a spinning twister), Rainbow Beam (a seven-colour bridge), Dragon Flame (a fire dragon and a pillar of fire),
  Harimau Spirit (three claw slashes), Blossom Storm (a petal storm that ends in a big flower), Tidal Wave (a big
  curling wave), Eagle Dive (a golden eagle that swoops down), Volcano Burst (lava columns) and Galaxy Vortex (a spinning galaxy that
  bursts). Quiet mode and reduced motion skip all of it. The canvas is always removed, even on a slow phone.
- **Richer hero auras.** All 14 auras now have a soft glow around the hero, a double ground ring, a column of light
  and many more floating details (flames, notes, hearts, crystals, snowflakes, wisps, sun rays and so on).
- **Epic boss auras.** Bosses get a double ground ring with turning rune dots, rising embers and bright corner sparks.
- **More detailed characters.** A finishing pass gives heroes, knights, monsters and bosses edge light, form shadow,
  shade toward the ground and little glints. Every normal monster has one or two small markings of its own (freckles,
  belly patch, brow stripes, a scar, a forehead gem, blush or spots), chosen from its name.
- **More detailed pets.** All pets get a soft plush light (shading toward the edges, fine fur grain and a little shine)
  and shiny eyes. It is switched off in light mode and quiet mode.
- **Buy pets in Pet Haven.** Pets you do not own show their price. Tap Buy to adopt one with coins; your first pet
  also becomes your buddy.
- **Music and sound for every situation.** 19 new songs written by a small composer (different keys, tempos, lead
  sounds, bass and drums), a tune for home, studies, shop, haven, tower, story, each battle, boss, win and lose, and
  about 25 new sound effects. Every tab and button has its own sound.

### Changed
- **Stories start at scene 1.** The title card / introduction is gone from every story. Back stops at scene 1.
- **Simpler story buttons.** One big Next / Fight / Claim / Enter button and a sound button.
- **Text size fit.** At the biggest text size the pages, bottom bar, cards and buttons stay inside the screen (checked
  on a phone, a small phone, a phone on its side and a computer).

### Tests
- tests/v33.test.mjs: light shows run to the end, auras, pet detail, songs, sounds, story start.
- tests/e2e/v33.spec.mjs: buy a pet, story scene 1, finisher cleanup, big text fit.

## [32.0.0] - 2026-10-24

### Added
- **Rival knight (Sir Kilat)** at levels 25, 50 and 75: a chase, a duel scene, then a mixed-subject battle with
  coins and chests as prizes. Each duel unlocks after the one before it.
- **Boss powers and battle situations.** Each of the ten zone boss kinds has a signature power that appears in phase 2
  (Ember Roar, Grave Whisper, Boulder Toss, Horn Charge, Halo Flash, Spark Dance, Pixie Dust, Beast Pounce, Cog Spin,
  Many Heads) and a battle situation (Hot Floor, Thick Mist, Armour Plates, Healing Spring, Lightning Round, Wild Wind,
  Bodyguard, Weak Spot, Treasure Hoard, Moonlight). Every zone boss gets its own pair (100 different pairs).
- **Boss personalities.** Ten voices, with an intro, a rematch line, a rage line and a defeat line, in both languages.
- **Co-op team play.** A shared boss health bar, a strip with each player's stars and a team combo that only fires when
  every player answers right on the first try. The summary shows the number of team combos.
- **Gear rarity.** Common to Legendary, each with its own stat rolls (attack, hearts, time, guard, heal, coins),
  different for every child, with caps. Armory badges and a forge that re-rolls a piece and lets you keep the old or new roll.
- **Pet gear.** 16 hats, scarves and capes that fit all 23 pets, with small perks.
- **Sound for every battle action** and three new songs (sad, tense, triumph).
- **A cinematic finisher** with letterbox bars, a hero cut-in and a shockwave.
- **10 new monsters** (Moon Jelly, Dumpling Buddy, Mango Sprite, Moon Moth, Rocket Bot, Chili Imp, Giant Bloom,
  Scoop Critter, Lion Dancer, Lucky Cat) with quirks, idle motion, names in both languages and collection cards, and
  **10 elder zone bosses** (Frost Wyrm, Plague Lich, Crystal Titan, Shadow Fiend, Starlight Archon, Magma Lord,
  Autumn Queen, Cyber Chimera, Golden Colossus, Storm Hydra).
- **Story:** one villain arc across the zones (shadow, rival, mistake, rainbow), a mini-boss scene at level 5,
  cliffhanger endings, chapter beats for each subject, choice beats that change no plot but give a small reward,
  new scene shots (chase, rain, campfire, a map drawn live, split screen), music matched to the mood of each scene,
  text-to-speech voices with their own pitch and speed per speaker, a pet evolution scene, and English + Malay
  picture words in a pop-up.
- **Tests:** `tests/v32.test.mjs`.

### Changed
- About one ordinary level in six now shows one of the new monsters (the first 960 levels stay one-of-a-kind).
- `src/parts/09k-bestiary5.js` is part of the sprite worker list in `vite.config.js`.
- Collection now has 70 species cards (was 60). `tests/v21`, `v22` and `v29` were updated for this.

## [31.0.0] - 2026-10-24

### Added
- **Small letters for tracing.** a to z have their own guides (on lined-paper heights: x-height, tall letters,
  tails), a new "a b c" set in Tracing practice, and age-4 battles now ask for small letters about 4 times in 10.
  `traceScore` also checks every stroke on its own: leaving out the dot of an i, the bar of a t or an A no longer passes.
- **Mistake review.** After a battle, "Look at my mistakes" lists every question answered wrong: the question, what
  was tapped, the right answer and why the choice was wrong, worked out from the question (for example "493 is what
  you get when you add. This question asks you to take away: 323 − 170 = 153", "close, but 1 too many", "3/4 counts
  the parts that are NOT shaded", "'Topi' goes with 🧢"), plus a 🔊 button and a link to the lesson on that topic.
- **Parent code recovery.** Grown-ups can save a recovery question in the Parent Portal (first pet, home town,
  primary school, childhood friend, or their own question). "Forgot the code?" then asks that question; the right
  answer lets them choose a new code and nothing is erased. The answer is kept only as a PBKDF2 hash with its own
  salt; three wrong answers lock it for a minute (longer each time). Erasing everything stays as the last resort.
- **Vibration.** A short buzz for a right answer, a double buzz for a wrong one, a long pattern for a finisher and a
  light tick on every story scene (stronger for action scenes). Only on devices that can vibrate; off in calm mode
  and with the new Parent Portal switch "Vibration".
- **Problem log (telemetry-free crash log).** Script errors and failed promises are counted in local storage (at most
  30, the same problem counted once, never sent anywhere). The Parent Portal shows them with Export and Clear.
- **Tests and tools:** `tests/v31.test.mjs` (every math question has its answer among 4 different options, every bank
  row builds 4 different choices in both languages, hooks, crash log, tracing, mistake review, recovery, vibration,
  the age split), `npm run lint:bank` (duplicate wrong answers, an answer that is also a wrong answer, missing or
  mismatched Malay text, rows that cannot show 4 choices) and `npm run e2e`, a Playwright smoke test that opens a
  battle, answers (once wrong), wins, opens the mistake review and the Parent Portal, on a computer and a phone screen.

### Changed
- **Hooks instead of replaced functions.** About 50 places in parts 20-25 extended a function by replacing it
  (`const _win27 = win; win = async function () {...}`), so `win`, `startBattle`, `renderParent` and `famEvent` were
  wrapped three to six times across files. Such functions are now declared once as a door into `HOOK.call`, and
  extensions register with `HOOK.on / before / claim / filter / around` (src/parts/00c-hooks.js). The order is the same
  as before; an error inside an "on" or "before" extra goes to the problem log instead of stopping the game.
  `window.__quest` now hands out the full functions (before, it held the unwrapped first versions).
- **Stories and lessons load by age.** Each age's cutscene script is its own file loaded when needed
  (content/cutscenes.js), and lesson text is split by subject and age (content/lessons/<subject>/b<age band>.js; a
  lesson lives in the file of the youngest age that has it). The main game file is about 105 KB smaller.
- **Smoother stories.** Measured with Chrome tracing on a 4x slowed CPU, the main thread was busy about 39% of the time
  during a story; it is now about 26%, with about 40% fewer frame updates: falling petals, bubbles, embers, confetti,
  light rays and foreground shapes moved to an HTML layer the graphics chip animates; the decorative loops inside the
  picture hold still while the characters keep moving; lines appear word by word from a small timer instead of one
  CSS animation per letter; the game behind the story is not drawn while the story plays; the script of a story is
  worked out once instead of five times per scene. The dialogue portrait now holds still inside a gently bobbing frame.
- **A simpler Adventure tab.** Subjects are small tiles (picture, name, stars) in a tight grid instead of big cards with
  a sentence and two progress lines each; the age picker is one short row; Team play is one small button (player count
  and names are in its pop-up). The level map has one header row, one story line, a shorter zone banner, and closed or
  locked zones are slim rows.
- Warm/cool colour and high/low sound questions now have 4 choices ("Find the warm colour") instead of 2.

### Fixed
- An old `src/parts/10c-flashcards.js` left in some project folders declared `heroStripExtra` twice and failed two
  tests. The build and tests now skip it (it can be deleted).
- The open zone banner on the map was stretched to a 4:3 picture by a general rule; it is a short banner again.

## [30.0.0] - 2026-10-23

### Changed: code clean-up
- Removed the retired STEAM quest screen code (it was replaced by the Subject Mix levels in v21; the 20-level count
  they share is kept as `STEAM_N`), the unused map, world-card, star-row and goal-row helpers, the old Think-Back,
  hint-ladder and example-picture tables, and other functions nothing called any more.
- Removed about 220 text strings (English and Malay) and about 5 KB of CSS rules that no screen used.
- Removed the old copy of the tracing practice screen (v28 replaced it).
- Built game script is about 35 KB smaller (1,317 KB to 1,282 KB) and the stylesheet about 4 KB smaller.

### Fixed
- Spelling questions: v28's sound pad declared a second `misspell` function that replaced the original, so spelling
  questions could show broken wrong answers. The sound pad's helper is now called `phMisspell`. A new test fails if
  any function is ever declared twice again.

### Changed: smoother running
- Animations that replay (coin pop, answer shake, question card, hero poses, banners, pet hop, hit flash, battle
  intro) no longer use the "read offsetWidth" trick that forced a full page layout mid-script; a new helper
  `replayClass` rewinds the animation instead.
- Story scenes fit their picture in the next animation frame instead of forcing a layout straight away.
- Big-number ordering questions no longer use the slow `toLocaleString` to group digits.
- The Studies tab and lesson list are only rebuilt when their content changed (new helper `setHTML`), so moving
  through lesson cards no longer redraws the screen behind them.
- New "lite" mode: when the device is measured as slow (or Parent Portal quality is set to Lite), the page gets
  `data-lite="1"` and the purely decorative loops (twinkles, drifting clouds, sun rays, sparkles, button shine) and the
  blurred overlay background are switched off. Characters still move as normal.

## [29.0.0] - 2026-10-23

### Changed: stories
- **Every story is now a scripted cutscene.** Chapters, boss intros and victory stories no longer have a fixed six
  pictures. A chapter now has 9 to 13 scenes, a boss intro 5 and a victory 5 or 6, each with its own camera shot,
  and they play one after another like a game cutscene (tap Next, Back, Pause or Skip as before; a scene now lasts
  about 4 to 10 seconds, depending on how long its line is).
- **Characters talk.** Each line has a speaker: the narrator, the hero, Hoot, the age's villain (Puff, Momo, Murk or
  Drakmor), a monster, the zone boss, the pet, or one of many new townsfolk (Farmer Mei, Mama Duck, Princess Marina,
  Engineer Gizmo, Grandma Rock, the Old King and more). Speakers appear in a dialogue box with their face and name,
  in the classic look too (before, only pixel mode had it); the narrator speaks without a box.
- **New camera shots:** two characters talking with a speech bubble, close-ups with a feeling, action shots with speed
  lines and a screen shake, a glowing discovery, a cheering crowd, a dark scene with glowing eyes, a villain shot,
  and a journey path to the next land. The camera zooms or pans to suit each shot.
- **All four sagas rewritten** in English and Malay, keeping each age's story but with much more detail, humour and
  cliffhangers:
  - Age 4, The Little Knight's Wonder Book: short, simple lines; Puff is a mysterious grey cloud until zone 5.
  - Age 5, The Lone Knight and the Star of Tomorrow: Momo is only a little voice in the trees until zone 5.
  - Age 6, The Young Knight Who Would Be King: each Royal Trial is a real choice (a stolen badge, a bumped power pole,
    a muddy rescue nobody sees), and the finale crowns the new king.
  - Age 7, The Ten Star Seals: Drakmor's voice grows in the dark before he appears; friends made along the way (the
    sea people, the gear builders, the city) return to help in the last battles.
- The villain is never named before the meeting in zone 5.
- Because the stories are new, every chapter and boss story plays once more (the story keys moved to cine5 and boss4).
  "Always skip this story" settings are kept.

### Technical
- Scripts live in src/content/cutscenes/b1.js to b4.js; each beat is [shot, speaker, English, Malay, prop]. A zone
  without a script falls back to the older six lines in saga.js.
- cineKindsOf (16) is now a function so the cutscene part can replace it.

## [28.0.0] - 2026-10-21

### Added: lessons
- **Lesson ladders.** The lesson list of a subject is now a set of ladders, one per topic, instead of a flat grid.
  Each ladder has three rungs, 🌱 Starter, 🧱 Builder and 🏆 Expert, with the easier lessons first. A rung opens when
  every lesson on the rung below is finished ("Open all levels" in the Parent Portal opens them all). A topic with
  fewer than three lessons fills the missing rungs with a practice set (Builder) and a quiz where 3 of 5 is a pass
  (Expert). The age chips still filter the lessons.
- **Quick check (age 6-7).** A new lesson starts with two warm-up questions. Both right: "Skip to practice".
  It can always be skipped.
- **Teach-back cards (age 6-7).** After the last card, "Explain it": the child picks which of three sentences explains
  what the lesson taught (the other two come from other lessons). Right on the first try: +2 coins, once per lesson.
- **Picture-first lessons (age 4).** The first card is a big emoji picture with one short sentence.
- **Lesson notebook.** Every finished lesson saves its "Remember" tip (in English and Malay) to "📒 My notebook" in
  Studies. Lessons finished before v28 are added the first time the notebook opens.
- **Print & colour.** Art lessons have a printable colouring page (flower, fish, house, butterfly, wau or a pattern),
  and tracing practice can print its dotted letters, words, shapes or number line.
- **Lesson battle.** After a lesson's 3 practice questions, "⚔️ 3-round battle" starts a short battle that uses only
  that lesson's questions.
- **Topic boss.** Finishing every lesson of a topic wakes a 👑 topic boss at the top of its ladder: a mini-boss fight
  with only that topic's questions (first win: 30 coins and a treasure chest).
- **Study buffs.** Finishing a practice gives +3 attack in the next battle of that subject (used once, kept 3 days).

### Added: activities (a new "🎮 Activities" row in Studies)
- **Story builder:** put three pictures in order (beginning, middle, end) with the same order tiles as in battles;
  10 stories, read back as "First... Then... At the end...".
- **Word bench:** tap letter tiles to build the word for a picture (English or Malay); extra words made from the same
  tiles are bonus words.
- **Sifir race (age 6-7):** a calm, untimed ladder for the 2 to 9 times tables, one fact per rung, with a hint that
  counts up after a wrong answer and a tree that grows a fruit for every finished table.
- **Science lab:** mix colours, melt ice and plant a seed, each with a prediction question first.
- **Map explorer (Citizenship):** a simple map of Malaysia's 13 states and 3 federal territories; tap to learn the name,
  capital and one fact, or play "Find it".
- **Music maker:** an 8-step tune with 4 notes (Do, Re, Mi, So) that plays back.
- **Feelings journal (Socio-emotional):** a daily emoji check-in with an optional reason and a kind reply; the last 7
  days are shown. It stays on the device and is not shown in the Parent Portal.
- **Safety scenes (Health):** tap every unsafe thing in a kitchen and a street; each tap says why.
- **Tracing upgrades:** word tracing (letter by letter), shapes (circle, square, triangle, diamond, star, heart) and
  number-line hops (for example 2 + 3), all with a 1-3 star neatness rating; the best rating is kept.
- **Sound pad:** letter sounds (English) or syllables (Malay) with a picture word, then "blend two sounds" into a word;
  at age 6-7 a spelling question follows.
- Subjects linked to an activity (Citizenship, Socio-emotional, Music, Science, Health) show a button for it at the
  top of their lesson list. Activities of a subject turned off by a grown-up are hidden.

### Added: gameplay and studies
- **"Try the lesson on this".** A win with two or more misses on one topic (or a knock-out), or a lost Boss Rush or
  tower climb, shows a one-tap link to the lesson for the topic that was missed most.

### Safety and settings
- Quick checks, lesson battles, topic bosses, study buffs and bonus words are bonus modes: off in calm mode, and
  behind one new Parent Portal switch, "Study buffs and bonus modes".
- Two-step chains (quick check then skip, teach-back, blend then spell) and the sifir race are for age 6 and 7 only.

### Changed
- The order widget (07c) takes optional hooks so the Story builder can use it outside a battle; battles are unchanged.

## [27.0.0] - 2026-10-18

### Added
- **Telegraphed boss attacks.** On boss levels the boss sometimes shows "❗ Charging!" with a shrinking bar. A right
  answer before the bar runs out dodges the attack and makes the hero's next hit 25% stronger; if the bar runs out the
  boss lands a heavy hit. Off in calm mode and with "no time limit".
- **Rage moves.** In phase 3 every zone-boss type has its own move: Fire Breath (Dragon), Life Drain (Lich King),
  Earthquake that swaps the answers (Titan), Double Slash (Fiend Lord), Holy Barrier (Archon), Lightning Storm that
  takes time off the clock (Elemental Lord), Glitter Charm that covers answers (Fey Queen), Triple Bite (Chimera),
  Overclock that speeds up the angry bar (Colossus) and Regrow (Hydra). Healing never takes a boss out of phase 3.
- **Minion waves.** The Lich King, Fiend Lord, Fey Queen, Colossus and Hydra call 1 minion in phase 2 and 2 more in
  phase 3. Each right answer knocks one minion out (+1 coin) before the boss can be hit again.
- **Boss camera and slow-motion final hit** on every boss: the camera leans in on whoever attacks, and the last hit
  plays with letterbox bars, a freeze frame and slow motion. Parent Portal: "Boss camera & slow motion".
- **Monster talk.** Monsters tease after a wrong answer and say something funny when they lose; every zone boss has
  its own lines. Parent Portal: "Monster talk".
- **Secret levels.** All 3 goals on all 10 levels of a zone open a hidden 🌟 secret level there (the map shows how many
  goals are still missing). The first clear gives 40 coins and a chest.
- **Boss Rush.** With 2 or more zone bosses beaten, fight them all in a row. Health carries over (30% heal between
  bosses); the best run is saved; finishing gives a chest.
- **Endless Tower (new tab).** An endless climb: every floor hits harder, has more health and less time. Every 5th
  floor is a mini boss, every 10th a big boss with a chest. A knock-out ends the climb; the best floor is saved for
  each age, and a child can restart from floor 11, 21 ... once they reached it.
- **Subject Mix.** 20 levels (with stars and goals) that mix questions from three subjects in one battle.
- **"Why?" step (age 6 and 7).** After some right math answers the child picks the reason ("Because 7 + 5 = 12").
  The right reason makes the hit 30% stronger and gives 2 coins; a wrong reason shows the right working, no penalty.
  Parent Portal: "Why? questions".
- **Hero perks.** The hero level unlocks passive perks: +5% to +30% health, up to +9 attack, more thinking time, a little
  guard, healing and bonus coins. Tap "✨ perks" on the Adventure screen to see them; a level-up shows on the win card.
- **Weapon upgrades.** In the Armory, coins upgrade the weapon you wear up to level 5 (+2 attack per level).
- **Treasure chests.** The first win over any boss (and secret levels, Boss Rush, tower floors 10, 20 ...) gives a chest
  with an opening animation and one of 24 treasures that are never sold in the Armory. Use one at a time; they are
  kept on a new "💎 Treasures" shelf in the Cards tab.
- **Team play.** On the Adventure screen pick 2 or 3 players and type their names. Each new question goes to the next
  player ("Mei's turn"); the win card shows each player's score.
- **Auto-resume.** The battle is saved as it goes. If the page closes mid-battle, the game offers "Continue this
  battle" with the health of both sides (saved battles older than three days are dropped).
- **Story skip on replays.** A story the child has seen before gets a big "⏭ Skip story" button and an "Always skip
  this story" switch, saved for each child and each story.

### Changed
- **Zone boss levels (10, 20 ... 100): the timer is no longer reset after an answer.** It keeps running from one
  question to the next and only fills up again when it runs out. A note says so at the start of the fight.
- The menu has six tabs (Tower added).

## [26.0.0] - 2026-10-17

### Changed
- **Four brand-new sagas, one per age, told as one connected story across the ten zones.** Every chapter picks up
  where the last one ended, every boss victory moves the story on, and the map shows how far the hero has come.
  - **Age 4, The Little Knight's Wonder Book**: a little knight sets out to see every wonder in the world and fills one
    page of the Wonder Book in each land, clashing with monsters along the way. Puff, a grumpy grey cloud who thinks
    nothing is special, slowly becomes a friend and ends the story as a rainbow cloud.
  - **Age 5, The Lone Knight and the Star of Tomorrow**: a knight with an empty shield sets out alone to find out who
    they are and to brighten a gloomy future. Each land teaches one thing about themselves (brave, a good listener,
    patient, facing fears, kind, a clear thinker, asking for help, loyal, giving hope) and adds a mark to the shield.
    Momo the lonely monkey becomes their friend, and the lone knight ends the journey with a family of friends.
  - **Age 6, The Young Knight Who Would Be King**: to wear the crown the knight must pass ten Royal Trials (courage,
    care, fairness, patience, honesty, wisdom, unity, responsibility, kindness and mercy). Murk, a rival who tries to
    win by cheating, is saved by the knight in the last trial, and the old King crowns the new king.
  - **Age 7, The Ten Star Seals**: the giant demon Drakmor is breaking out from under the world. A young knight
    relights the ten Star Seals, one per land, and seals him away for good. Drakmor is a new villain, drawn in pixel
    and classic art (chained once he is sealed). The last zone is now the Shadow Citadel, with new level names.
- Stories use the hero's name; with no name given, the hero is called by the knight they wear (for example Tiny Tobias).
- The villain looks happy in the last shot of a saga where they become a friend, and the last shot belongs to the hero.
- The map shows the saga's progress under its title, for example "Royal Trials passed: 3 of 10" with ten pips.
- Chapters are stored under a new key, so each zone's new chapter plays once even if the old one was seen.
- **"Which one does not belong?"** now says what the group is: "Three of these are fruits. Which one is NOT a fruit?"
  ("Tiga daripada ini ialah buah. Yang manakah BUKAN buah?"); number questions say even or odd.

### Fixed
- **Faster tabs.** The tab change is a quick 0.14 s fade instead of a 0.28 s stepped slide. The Cards tab drew all 60
  monster pictures before it could appear (about 1.7 s on a normal phone); it now opens at once and the pictures are
  drawn by the sprite worker, which also prepares them in the background a few seconds after the game starts.

## [25.0.0] - 2026-10-15

### Fixed
- **Story scenes no longer stutter.** Each shot used to draw its pictures (hero, pet, monsters, props) at the moment
  the page turned, and every shot carried about 150 KB of inline image data that the browser had to parse and decode
  again. Drawn sprites are now kept as short blob links (about 9 KB of markup per shot), the sprite worker draws the
  story's hero and monsters as soon as it opens, and the next shot is built while the current one is still playing.
  The light rays pulse as one group, boss shots have fewer embers, and the title card no longer runs an endless text
  shine. Measured on a 6x slowed CPU: long freezes during shot changes went from eight to two (both behind the opening
  wipe); at normal speed the 99th-percentile frame dropped from 33 ms to 17 ms.
- **Studies: every pop-up closes.** The ✕ button and Escape now close tracing practice, lesson practice and lessons
  (before, tracing practice and flashcards reopened themselves).
- **Armory: the screen stays still** when you tap Knights, Weapons, Shields, Capes, Auras, Pets or Finishers (and when
  you buy or wear something). The chip row keeps its sideways scroll and the page never jumps or shrinks under your finger.

### Added
- **More gear, all different**: 3 knights (Sakura Ranger with a winged helm and rapier, Coral Tidewarden with a fin
  crest and sea glaive, Sunforge Paladin with a crowned helm and war pick), 5 weapons (Bubble Scepter, Coral Lance,
  Hornbill Bow, Comet Flail, Pirate Cutlass), 5 shields (Wave, Pawprint, Storm Tower, Royal Crest, Dragon Scale on a
  new oval shape), 5 capes (Sunset, Checkered Banner, Hornbill Feather, Galaxy, Dragon Wings), 5 auras (Music Notes,
  Blossom Petals, Gem Orbit, Shadow Mist, Sun Halo), 5 pets (Frog, Octopus, Baby Elephant, Baby Orangutan, Hornbill)
  and 5 finishers (Blossom Storm, Tidal Wave, Eagle Dive, Volcano Burst, Galaxy Vortex), each with its own animation
  and sound. Names are in English and Bahasa Melayu.
- A test draws every weapon, shield, cape and aura on every knight and fails if any two look the same. Three shop
  weapons that used to match a knight's own weapon (Short Sword, Longsword, Knight's Spear) were redrawn.
- **Pet Haven tabs**: under the room, the chip row now switches between Your Pets, Furniture & Deco and Themes.
- Armory pet cards show the pet itself instead of the knight.

### Removed
- Flashcards in the Studies tab.

## [24.0.0] - 2026-10-15

### Added
- **Zone music**: every zone has a signature instrument built into the synth: flute, marimba, harp, gamelan
  bonang, glockenspiel, oud, music box, brass horn, kompang drums and pipe organ. The instrument answers the melody at
  the end of every phrase, plays a soft counter-line in that zone's battles, and plays a short greeting when the zone
  opens on the map. Stories use the instrument of their zone.
- **Card rarity and foils**: every monster card is Common, Rare (levels ending in 3 and 7), Epic (captains) or
  Legendary (zone bosses), with a matching gem and glow. A card becomes a shiny holographic **Foil** once all three
  star goals have been won against that monster (in any age band). The Cards tab shows totals for each rarity and the
  number of foils; the victory card says "Foil card unlocked!".
- **Screen time for each child**: the Parent Portal lists every child with minutes played today and two daily limits
  (school days and weekends; weekends can follow school days). Limits can be set without switching player; each
  child's clock is separate.
- **Ten more monster species**: Snow Buddy, Pirate Parrot, Gnome Wizard, Beetle Knight, Puffer Fish, Sang Buaya,
  Malayan Tapir, Wau Spirit (a living moon kite), Cloud Sheep and Teapot Spirit, each with 4 colour sets and an idle
  quirk. Monsters are now a fifth each of the five species groups; the Cards tab has 60 kinds.
- **70 new questions** in English and Bahasa Melayu, mostly for Moral, Citizenship, Social-Emotional and Health
  (the subjects that had the fewest), plus Science, Math, English and Bahasa Melayu.
- **Livelier characters**: smooth, eased body motion on top of the pixel frames. The hero breathes; monsters float,
  sway, bounce or shift their weight depending on their kind; hits squash and jolt; attacks leave a motion trail; new
  monsters land with a puff of dust. Calm mode and reduced motion turn it off.

### Changed
- **No help in battle**: Hoot's help panel, the hint ladder and the "More help" button are gone. A wrong answer or a
  time-out just says "Not quite. Try again!" (lessons and practice still teach step by step). The third star goal is
  now **🛡️ No knock-outs**.
- **The battle screen fits the window** on phones, tablets and computers, with no scrolling: the stage shrinks to
  leave room for the question and answers, sprites follow the stage height, and wide or sideways screens put the
  stage on the left and the question on the right.
- **Every question is unique**: no question repeats inside a battle (the same choices in another order count as the
  same question), and no question text is shared by two subjects in either language. The Bahasa Melayu subject now asks
  about "the Malay alphabet", and `npm run check` reports any duplicate across subjects as an error.

## [23.0.0] - 2026-10-15

### Fixed
- **Monster names match the monster.** Names are built from what the monster really is, such as "Grumpy Bat",
  "Captain Jolly Fire Spirit" or "Hydra the Mighty", and in Bahasa Melayu they follow Malay word order
  ("Kelawar Pemarah", "Kapten Roh Api Ceria", "Hidra Gagah"). In classic (non-pixel) art the name follows the body shape.
  The old made-up names stay as a hidden seed, so every monster still looks exactly the same.
- **Tracing questions** now get a fresh pad when the next question is also a tracing question. Before, the old letter
  stayed on screen after it was finished.
- **Questions from the wrong subject**: at age 4, "This is called …" and colour statements were mixed into Science,
  Moral, Citizenship, Social-Emotional, Health and Music battles. They now only appear in English, Bahasa Melayu and Art.
- **Lesson practice and quiz** now pick questions about the lesson itself (matched to the lesson's title and text),
  not just its broad topic. Times-table, groups, sharing and halves lessons now practise those word problems instead of
  adding. 90 new bank questions cover the 18 lessons that had none of their own: heavy and light, AABB/ABC patterns,
  body parts, greetings, Malay and English digraphs, months, pantun, sentences, this/that, magic e, who/what/where,
  story order, traditional clothes, sleep, sun safety, masks, same and different tunes.

### Changed
- **Simpler level card**: the monster, its name and one goal line, the three star goals as small tiles, and one big
  Engage button. "How to answer" settings are tucked into a fold-out section.
- **Simpler victory card**: stars, coins, a small "New monster card" chip, one tip for the star still missing, and
  three buttons (Next level, Retry, Map).
- **Smaller tracing pad in battle**: the canvas sits beside its two buttons, and the reminder letter above is smaller.

### Added
- **21 new Armory items** for the knights: 6 weapons (Royal Keris, Sea Trident, Crystal Sword, Jungle Blade,
  Thunder Spear, Moon Axe), 5 shields (Batik, Turtle Shell, Moon, Tiger, Crystal), 5 capes (Ocean, Tiger, Batik,
  Night Sky, Phoenix Wings) and 5 auras (Falling Leaves, Bubbles, Snowflakes, Fire Ring, Rainbow Glow).
- **Ten more monster species**: Cupcake Critter, Bandit Raccoon, Durian Brute, Ghost Lantern, Little Alien,
  Scarecrow, Spiral Snail, Digger Mole, Treant and Frog Warrior, each with 4 colour sets, hurt and attack frames and an
  idle quirk. Monsters are now a quarter each of the classic, v20, v22 and v23 species; every level's monster is still
  one of a kind. The Cards tab now has 50 kinds to collect.

## [22.0.0] - 2026-10-15

### Added
- **Four new question types** that mix into battles (more often for the youngest: about 45% of questions at
  age 4, 35% at age 5, 25% at 6-7):
  - **True or false blast**: two big buttons, quick statements ("3 + 2 = 5", "A cat can fly").
  - **Tap the odd one out**: four pictures, one does not belong; the reason is shown after the answer.
  - **Drag to order**: drag (or tap) tiles into slots: days of the week, months, numbers, syllables, life cycles.
    A mistake keeps the right part and lets the child try again; there is an undo button.
  - **Match pairs**: join each word with its picture.
  Order and match appear on ordinary levels only, never on boss levels, and get a longer answer timer.
- **Combo finishers.** Every 5 right answers in a row the hero does a finisher (2.4x attack + 8 damage) with its own
  animation and sound. A combo meter shows the steps to the next finisher.
- **Finisher shop in the Armory**: 8 finishers (Starfall is free; Thunder Strike, Meteor Crash, Frost Nova, Leaf Tornado,
  Rainbow Beam, Dragon Flame and Harimau Spirit cost 150-420 coins). Each card plays a live preview.
- **Lessons linked to battles.** Every lesson ends with "Try 3 practice questions" on its own topic (+3 coins once a
  day per lesson) and a **5-question quick quiz** from the question bank, with the best score kept.
- **Flashcards**: a deck per subject (words, shapes, sifir, vocabulary and more, 17 decks) with flip,
  "I knew it" and "Again", and spaced review (1, 2, 4, 7, 14 days). Studies shows how many cards are due.
- **Six new interactive demos** in lessons: clock face (drag the hands), number line hopper, money counter,
  syllable clapper, float or sink, and magnets.
- **Lesson of the week**: grown-ups pick a lesson in the Parent Portal; it is pinned at the top of Studies.
- **Star goals you can see**: the three stars of a level are now three goals: 🎯 first try (8 of 10 right on
  the first try), ⚡ speed (no time-outs), 💡 no hints. Map nodes show which goal is still missing, the
  victory card lists them, and goals add up across replays.
- **Zone landmarks**: every zone header on the map is a small pixel scene (castle, forest, lighthouse, city...).
- **Hero on the path**: the hero stands on the next level and walks there after a first clear.
- **Hero name**: a name field on the welcome screen. Stories use the hero's name and the equipped pet
  ("Aiman and Kitten step into Crystal Cove, side by side.").
- **Epic story scenes**: letterbox bars, light rays, drifting embers, depth layers, a shining title card and a new
  "saga" story theme in the music.
- **Monster Cards tab** (🎴 Cards): beating a monster for the first time adds its card to the collection. Cards are
  grouped by species (30 species and the 10 zone bosses); each card shows the monster, its species, zone,
  subject and level, Captain or Zone boss tier, and the best goal stars won against it. Undiscovered species stay a
  dark "?". New cards wear a NEW ribbon and the tab shows how many are new. The victory card has a
  "New monster card!" button. Levels cleared before v22 give their cards automatically.
- **Ten new monster species**: Jelly Squid, Cactus Brute, Vampire Bat, Pumpkin Knight, Snow Yeti, Thunderbird,
  Robo Crab, Shell Knight (turtle), Bee Queen and Dino Rex, each with 4 colour sets, hurt and attack frames and
  its own idle quirk. A third of the monsters now use them; every level's monster is still one of a kind.

### Changed
- **Harder battles**: monsters have more health (21 per round plus 1.2 per zone) and hit a little harder
  (7 damage, plus 1 for every 8 levels). Level 1 is no easier than before; the last zone boss has 300+ health.
- Monster bodies are spread differently so every species (including Drake and Dire Wolf, which only ever
  appeared as hidden boss bodies before) shows up on ordinary levels. Some levels now have a different monster.
- Many question and lesson sentences were rewritten so they read naturally in English and Bahasa Melayu
  (singular and plural things, "Kura-kura", proverbs, a.m./p.m., number spacing, counting words, and more).

### Removed
- The daily quest and daily goal chips.

## [21.0.0] - 2026-10-14

### Added
- **Several children on one device.** Every child has their own progress, coins, knights and settings. The
  game asks "Who is playing?" once per visit, and a name button in the top bar changes player. Grown-ups add,
  rename and remove children in the Parent Portal ("Children on this device"). The parent code is shared.
  Old saves become the first child automatically.
- **Weekly summary** in the Parent Portal: minutes played per day, days played, questions, first-try
  accuracy, strongest and weakest skills, and a suggested focus that can be made today's focus with one tap.
- **Tricky questions** list: the questions a child missed on the first try most often.
- **Subject choices**: turn subjects off until further notice, or pick "Today's focus" subjects for one day.
  Locked subjects are dimmed with a lock tag on the Adventure and Lessons screens.
- **Bedtime**: a clock time (7:00 pm to 10:00 pm) after which the game stops until 6:00 am. Only the parent code
  gives 15 more minutes or turns bedtime off for one night. A gentle warning comes 10 minutes before.
- **Letter and number tracing** for age 4: guide paths with numbered start dots and a stroke check (how much of
  the path was covered, how much ink stayed near it). In battles (English, Bahasa Melayu, Math) and as a
  Tracing practice tile in Lessons (A-Z and 0-9, +1 coin for each new one).
- **Real spoken answers**: the 🎤 answer style listens with the browser's speech recognition (en-US or ms-MY)
  and understands numbers said as words in both languages. On-device recognition is used when the device has
  it; the online speech service is only used if a grown-up allows it. Quest Academy never records or keeps audio. Without
  support the child taps the answer they said.
- **New Art and Music questions** for ages 6 and 7: colour mixing, which two colours make a colour, warm and
  cool colours, pattern "what comes next", counting beats (ta, ti-ti, ta-a, rest), scale order, high and low.
- **Per-question statistics** (kept on the device, capped in size) behind the summary and tricky list.
- **Volume sliders** for music, sound effects and the reading voice.
- **More music**: one extra map song and one extra battle song for each zone mood (zones 1-3 bright, 4-6
  mystic, 7-10 wild) and an epic song for zone bosses.
- **Dynamic battle music**: layers join as the monster's health drops (hi-hats and an echo line, then doubled
  bass and snare pick-ups) and in a zone boss's third phase (toms, crashes, a high lead double), with the tempo
  nudged up a little each time.
- **Idle quirks** for all 20 monster species and the zone bosses (the slime squishes, the mimic licks its
  lips, the wolf howls, the golem stomps ...). Off in sensory mode and with reduced motion.
- **Colour-blind-safe colours** option: blue and orange with stripes and dots for health bars, the angry boss
  timer, the right answer, the fog and the rune shield, so nothing depends on red against green.
- **Screen reader announcements** in battle: each new question, hits and damage with health left, Hoot's
  hints, boss phase changes and victory.
- **Installable offline app (PWA)**: web app manifest, icons, and a service worker generated by the build that
  keeps the game and every lesson working offline.
- **Graphics quality** setting (Auto, Full, Lite). Auto runs a short sprite speed test once; Lite draws
  simpler glows and fewer idle frames for older tablets and phones.
- **Sprite Lab** (open the game with `?lab`): every level monster (filter by subject, species and tier), the
  10 zone bosses in every colour scheme, the knights and all Armory gear, and the story villains, each with its
  6 frames.
- `npm run check`: content validator (duplicate questions, answers missing from or repeated in the options,
  missing Bahasa Melayu text, zones with too few different questions).
- `npm test`: unit tests for monsters, levels, math questions, fresh sums, the local day key, spoken numbers,
  tracing, bedtime, subject locks, statistics and quirks (Node's built-in test runner, no extra packages).
- `CHANGELOG.md` (this file) and the app version in the Parent Portal.

### Changed
- The daily quest, session timer and new day now start at local midnight. Before, the day key was taken
  from UTC, so in Malaysia the day changed at 8:00 am.
- The parent code is now protected with PBKDF2 (SHA-256, 150 000 rounds, random salt) through the browser's
  Web Crypto API. Older codes are upgraded the next time they are entered.
- Saving is debounced: many quick changes become one write about 0.6 s later, and the game always saves when
  the page is hidden or closed.
- Lesson text is loaded per subject the first time it is opened (and quietly in the background), which cut
  the main bundle from about 1.1 MB to about 0.75 MB.
- Sprites are drawn in a Web Worker with OffscreenCanvas when the browser supports it, and kept in IndexedDB,
  so a returning player sees their knight and monsters straight away.
- The OpenDyslexic font is bundled with the app (with its OFL licence) instead of being fetched.
- Strings and lessons hold English and Bahasa Melayu only.

### Fixed
- Pattern questions with a repeated shape (for example 🟢 ⭐ ⭐) could show the same wrong option twice
  (found by `npm run check`).
- A leftover rematch check in the battle backdrop and other rematch code that could no longer run.
- Comments that still said 64x64 sprites or "1000 unique combos" (it is 960 body, colour and eye combos;
  the species variant makes all 1000 levels different).

### Removed
- Rematch quest code and saved rematch fields (rematch was switched off in v16).
- Spanish text (the game is English and Bahasa Melayu).

## [20.0.0] - 2026-10-14
### Changed
- Monster redesign: rounded volume shading lit from the top left, warm lights and cool purple shadows,
  coloured outlines, glossy highlights and clean scale, fur, stone and feather patterns.
- A shared monster kit: expressive eyes, brows, grins, roars, hurt faces, 8 detailed weapons and gear per
  creature. All 20 species redrawn with their own colour schemes; zone bosses upgraded with real faces.

## [19.0.0] - 2026-10-14
### Added
- 10 new species (Mimic, Horned Imp, Pixie Dryad, Skeleton Warrior, Clockwork Automaton, Seraph Sentinel, Fire
  Elemental, Cyclops, Dire Wolf, Owlbear) and 10 hand-built zone bosses with auras and animated effects.
### Changed
- Finer 96x96 sprite grid, surface textures, more knight detail, golden elite glow on mini-bosses.

## [18.0.0] - 2026-10-14
### Changed
- Heroic knight style for every knight, all Armory gear and all monsters.

## [17.0.0] - 2026-10-13
### Changed
- Smaller fighters; each age has its own question bank; no repeats until every question was asked; fresh
  numbers for sums; knights-only Armory (Explorer Kid retired).

## [16.0.0] - 2026-10-13
### Added
- Victory story after every zone boss; 10 s and 15 s pacing.
### Changed
- Bigger, more epic arena with compact controls.
### Removed
- Rematch quests (switched off).

## [15.0.0] - 2026-10-13
### Changed
- Character quality (tinted outlines, soft seams, rim light), pixel transitions, story layout, smoother screens.

## [14.0.0] - 2026-10-13
### Changed
- 64x64 pixel art engine with dithered shading and round monster eyes.

## [13.0.0] - 2026-10-13
### Added
- Pixel Knights: Tiny Tobias and four knight skins, knight-style monsters, the Royal Night look, RPG story dialogue.

## [12.1.0] - 2026-10-13
### Fixed
- The pixel font is bundled locally (no more missing @fontsource error without `npm install`).

## [12.0.0] - 2026-10-13
### Added
- 32x32 pixel art mode for the hero, monsters, owl, backgrounds and UI.

## [11.0.0] - 2026-10-12
- Every age band has its own saga with its own zone and level names. Earlier versions (1-10) were not
  recorded in a changelog.
