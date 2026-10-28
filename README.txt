Quest Academy v38.0.0 - SETTINGS TAB, HERO ARMOUR SETS, 10 NEW MONSTERS, SIMPLE PARENT CARD, WEAKER HERO, MALAY CHECK
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). No new packages are needed.

NEW FILES (ADD):
src/parts/09l-bestiary6.js, src/parts/51-v38-settings.js, src/parts/52-v38-parent.js, src/css/30-v38.css, tests/v38.test.mjs, tests/e2e/v38.spec.mjs
CHANGED FILES (REPLACE): package.json (38.0.0), package-lock.json, budget.json (JS limit 1640 KB), CHANGELOG.md, README.txt, index.html, vite.config.js, src/style.css, src/css/29-v37.css,
src/parts/01-setup.js, 02b-strings-v21.js, 02c-strings-v22.js, 02d-strings-v24.js, 03-items-and-levels.js, 09b-pixel.js, 09c-pixel-knights.js, 10-screens-tabs.js, 11-battle.js,
11b-speech-trace.js, 11d-quirks.js, 11g-anim.js, 14-adventure.js, 14c-collection.js, 16-bosses-steam-comics.js, 18-boot.js, 19-sprite-lab.js, 31-v32-gear.js, 44-v35-battle.js,
46-v35-armory.js, 50-v37-simple.js, src/content/pm.js, src/content/more/math.js, src/content/more/pk.js, src/content/lessons/sc.js, src/content/lessons/sc/b3.js,
tests/v21.test.mjs, v22.test.mjs, v25.test.mjs, v37.test.mjs, tests/e2e/v37.spec.mjs
No files to delete.

======================================================================================================================

Quest Academy v37.2.0 - TRACING FIX, SIMPLER LESSONS / HERO / PERKS, COLOURFUL BATTLE CARDS, BIGGER PETS
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). No new packages are needed.

NEW FILES: none.
CHANGED FILES (REPLACE): budget.json (CSS limit 270 KB), package.json (37.2.0), package-lock.json, CHANGELOG.md, README.txt, src/parts/11b-speech-trace.js, 24-v28-activities.js,
10-screens-tabs.js, 15-pets-and-haven.js, 16-bosses-steam-comics.js, 22-v27-hero.js, 29-v32-story.js, 50-v37-simple.js, src/css/29-v37.css
No files to delete.

======================================================================================================================

Quest Academy v37.1.0 - A SIMPLER LESSON PAGE (ONE STEP AT A TIME)
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). No new packages are needed.

NEW FILES: none.
CHANGED FILES (REPLACE): package.json (37.1.0), CHANGELOG.md, README.txt, src/parts/50-v37-simple.js, src/css/29-v37.css, tests/e2e/v37.spec.mjs
No files to delete.

WHAT CHANGED, IN SHORT
- The lesson shows one card at a time with big arrows and dots, then a Try page, then one big "I learned this" button and Finish.

======================================================================================================================

Quest Academy v37.0.0 - A SIMPLER HOME: LEARN / PLAY / HERO / CARDS, LEARN IN THREE STEPS, PLAY WITH THREE BIG BUTTONS
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). No new packages are needed.
npm run check, npm run lint:bank, npm run audit, npm run budget and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/50-v37-simple.js          -> Learn in three steps (subject, lesson, Go), the Play screen, the back arrow, bottom-bar highlight
src/css/29-v37.css                  -> styles for all of the above
tests/v37.test.mjs, tests/e2e/v37.spec.mjs -> tests

CHANGED FILES (REPLACE): package.json (37.0.0), package-lock.json, README.txt, CHANGELOG.md, index.html, src/style.css,
src/parts/05-state-and-sound.js, 13-events.js, 18-boot.js, 34-v33-audio.js,
tests/e2e/perf.spec.mjs, smoke.spec.mjs, v34.spec.mjs, v35.spec.mjs, v35-armory.spec.mjs, v35-tower.spec.mjs, v36.spec.mjs.
No files to delete.

WHAT CHANGED, IN SHORT
- Bottom bar: Learn, Play, Hero, Cards. Grown-ups use the 🔒 at the top. The old tabs are still there (hidden), so nothing was lost.
- Learn: 1 pick a subject, 2 pick a lesson, 3 press Go. No pop-up list, no age buttons, no ladder words.
- Play: Battle, Tower and Think are three big buttons, each with a back arrow.
- The game opens on Learn.

======================================================================================================================

Quest Academy v36.0.0 - FACT TABLES, "SEEN" COUNTS, BILINGUAL BOOST, BIGGER AGE-7 BANKS, STORY CHOICES THAT MATTER, A TOWER WITH BUILDS AND ASCENSION
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). No new packages are needed.
npm run check, npm run lint:bank, npm run audit, npm run budget and npm test need only Node 18+.

NEW FILES (ADD):
src/content/facts-data.js, facts.js -> the fact tables (240 facts) and the code that makes six question shapes from each (loaded when needed)
src/parts/47-v36-seen.js            -> "seen" counts, Bilingual boost switch, "start the questions fresh"
src/parts/48-v36-path.js            -> story choices that change the next land (7 twists, treasure pick)
src/parts/49-v36-tower.js           -> Tower builds, reroll/banish, Ascension, curse deals, milestone boss rules
src/css/28-v36.css                  -> styles for all of the above
tests/v36.test.mjs, tests/e2e/v36.spec.mjs -> tests

CHANGED FILES (REPLACE): package.json (36.0.0), package-lock.json, budget.json, README.txt, CHANGELOG.md, AUDIT.md, src/style.css,
scripts/audit-content.mjs,
src/content/formats.js, formats-a.js, more/fk.js, more/se.js, more/pk.js, more/pm.js,
src/parts/07c-question-types.js, 11-battle.js, 13-events.js, 29-v32-story.js, 45-v35-tower.js.
No files to delete.

WHAT CHANGED, IN SHORT
- Questions: facts are stored once and give six kinds of question (choose, true/false, fill the gap, odd one out, sort, tap the picture).
  The game remembers what each child has seen and shows new questions first. Age 7 has about twice as many Fitness, Socio-emotional, Citizenship and Moral questions.
- Parents: a "Bilingual boost" switch (English <-> Malay word questions) and a button to start the questions fresh (Parent Portal).
- Story: each choice in a chapter story now changes the next land (a helper, extra coins, more time, tougher foes with more coins, faster super charge,
  healing, or a treasure to pick). A small chip shows it in the fights.
- Tower: perks belong to three builds with bonuses at 3 and 6 perks; coins can reroll or banish a perk offer; floor 100 opens Ascension (title + harder climbs);
  a Shrine "dark bargain" for ages 6 and 7 (harder floors, bigger rewards); floors 25, 50, 75 and 100 break one rule each.

NOTES
- With the Bilingual boost on, the share of non-multiple-choice questions is a little different from the exact numbers in v35.
- Size: the main game file is about 1.57 MB (limit raised to 1,600 KB, see CHANGELOG). The new question code is in the lazy chunk.

======================================================================================================================

Quest Academy v35.0.0 - 13 NEW QUESTION TYPES, BATTLE DAMAGE THAT FOLLOWS YOUR ANSWER, A BIGGER TOWER, A BIGGER ARMORY
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). No new packages are needed.
npm run check, npm run lint:bank, npm run budget and npm test need only Node 18+.

NEW FILES (ADD):
src/content/formats.js, formats-a.js, formats-b.js, formats-c.js -> the 13 new question types (loaded when needed, about 52 KB)
src/parts/43-v35-formats.js         -> loads the new question types
src/parts/44-v35-battle.js          -> damage that depends on how you answered
src/parts/45-v35-tower.js           -> Tower: perks, floor twists, rest rooms, subject choice, story, map, brother/sister board
src/parts/46-v35-armory.js          -> Armory: gear traits, compare, trophy gear, weapon evolution, relic slots and pairs, Wardrobe
src/css/27-v35.css                  -> styles for all of the above
tests/v35.test.mjs                  -> tests
tests/e2e/v35.spec.mjs, v35-tower.spec.mjs, v35-armory.spec.mjs -> browser checks

CHANGED FILES (REPLACE): package.json (35.0.0), package-lock.json, budget.json, README.txt, CHANGELOG.md, src/style.css,
scripts/harness.mjs, tests/v27.test.mjs, tests/v34.test.mjs,
src/parts/07c-question-types.js, 09-sprites.js, 09b-pixel.js, 09c-pixel-knights.js, 09e-pixel-smooth.js, 10-screens-tabs.js,
11-battle.js, 11b-speech-trace.js, 15-pets-and-haven.js, 20-v27-battle.js, 21-v27-modes.js, 22-v27-hero.js,
27-v31-review.js, 30-v32-battle.js, 31-v32-gear.js, 39-v34-write.js, 42-v34-pwa.js.
No files to delete.

WHAT CHANGED, IN SHORT
- 13 new kinds of question: number line, drag a word into the gap, sort into boxes, build a sentence, spot the mistake,
  clock and money, hear a word and tap the picture, two-step sums, memory flash, tap the part of a picture, draw the answer,
  and tap a beat back. About 5 in 10 questions are now these (age 4 = 60%, 5 = 58%, 6 = 55%, 7 = 52%).
  Bosses use short forms. The old way of picking was not exact (the real share was often much higher); it is exact now.
- Battle: a quick answer, a first try and a streak hit harder. A second or third try hits softer. A small label shows why.
- Tower: pick a perk after each mini boss, floors with a twist (Speed, Calm, Order, Mirror, Lucky), rest rooms (Campfire,
  Merchant, Shrine, Puzzle), pick a subject at every 5th floor (or a parent sets a focus), weak subjects come up more,
  brothers and sisters appear as ghosts on the board, a story every 10 floors, an ending at floor 100, and a picture map.
- Armory: gear can have a special trait, a compare panel shows what changes before you wear something, some gear is won
  (zone bosses, Tower floors, a new piece each week), 2 relic slots at hero level 20 and 3 at level 40, relic pairs give a bonus,
  a weapon at upgrade level 5 can evolve (+3 attack, new look), and a Wardrobe changes how the hero looks (not the power).

NOTES
- Trophy gear is made from pieces already in the shop. They cannot be bought now, but anything a child already owns stays.
  A child who already beat a zone boss or reached a Tower floor gets the matching piece the next time the Armory opens.
- The Wardrobe in pixel-art mode changes weapon, shield and cape. In classic art it also changes hat, outfit and boots.
- Tower subject choice uses the child's own recent Tower answers; before there are enough, it uses topic mastery.
- Size: the main game file is now about 1.5 MB (limit raised from 1,500 to 1,560 KB, see CHANGELOG).

======================================================================================================================

Quest Academy v34.0.0 - PLACEMENT QUIZ, THINK HARD (KBAT) TAB, WRITE THE ANSWER, WORD PROBLEMS, ME PAGE, SIDEWAYS PHONE, SPEED AND CHECKS
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm install (nothing new to download, but it is safe), then npm run dev (or npm run build).
npm run check, npm run lint:bank, npm run audit, npm run budget and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/04z-save-schema.js        -> save file version 5 and the migrator
src/parts/37-v34-place.js           -> placement quiz, harder/easier questions in a battle, Parent Portal card
src/parts/38-v34-words.js           -> real-world word problems
src/parts/39-v34-write.js           -> write the answer by hand
src/parts/40-v34-kbat.js            -> the KBAT (Think Hard) tab
src/parts/41-v34-look.js            -> Me page, pet friend chat, celebration pacing
src/parts/42-v34-pwa.js             -> update bar, install nudge, private counts
src/content/kbat.js                 -> 84 KBAT questions (loaded when needed)
src/content/vfx.js                  -> the finisher light show (loaded when needed)
src/content/more/*.js               -> 590 new bank questions (and added.js for the authoring tool)
src/content/ms-reviewed.txt         -> Malay lines a native speaker approved
src/css/25-v34.css, 26-landscape.css-> styles, and the sideways-phone layout
scripts/audit-content.mjs, author.mjs, check-budget.mjs
tools/author.template.html, author.html, questions-template.csv
tests/v34.test.mjs, tests/e2e/v34.spec.mjs, tests/e2e/perf.spec.mjs
budget.json, lighthouserc.json, .github/workflows/ci.yml, AUDIT.md

CHANGED FILES (REPLACE): package.json (34.0.0), package-lock.json, vite.config.js, index.html, README.txt, CHANGELOG.md,
src/style.css, src/css/24-v33.css, scripts/harness.mjs, scripts/lint-bank.mjs,
src/parts/00-imports.js, 02-strings.js, 03-items-and-levels.js, 05-state-and-sound.js, 11-battle.js, 12-welcome-parent-timer.js,
12b-family.js, 13-events.js, 14-adventure.js, 15-pets-and-haven.js, 18-boot.js, 35-v33-vfx.js.

WHAT CHANGED, IN SHORT
- Content: 590 new questions (1,145 -> 1,735). npm run audit shows where content is thin.
- Placement quiz on first launch sets where each subject starts. Questions get harder after 2 right and easier after 2 wrong.
- Word problems, and a write pad for number answers in Math.
- New KBAT tab with thinking questions. New Me page (colours, titles, frames, battle cry, win pose). The pet cheers you on.
- Celebration setting: always full, full the first time, or short.
- Everything fits a phone turned sideways.
- Parents: update bar, install nudge, optional private counts of where children get stuck.
- Faster start: KBAT and the light show load only when needed. Offline now works for lazy files too (bug fix).
- For the team: size budget, Lighthouse, low-end phone test, many more browser tests, a CI workflow, a question authoring tool
  (npm run author -- form), and Malay translation checks (npm run lint:bank).

======================================================================================================================

Quest Academy v33.0.0 - EPIC FINISHERS AND AURAS, MORE DETAIL, BUY PETS, MUSIC FOR EVERY MOMENT, SIMPLER STORIES
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). No new packages are needed.
npm run check, npm run lint:bank and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/34-v33-audio.js           -> 19 new songs, a tune for every situation, about 25 new sound effects
src/parts/35-v33-vfx.js             -> the light shows for all 13 finishers
src/parts/36-v33-pets.js            -> softer light and shiny eyes for all pets
src/css/24-v33.css                  -> text-size fit, simpler story buttons, light show and Pet Haven styles
tests/v33.test.mjs                  -> tests
tests/e2e/v33.spec.mjs              -> browser checks (buy a pet, story start, finisher, big text)

CHANGED FILES (REPLACE): package.json (33.0.0), package-lock.json, README.txt, CHANGELOG.md, src/style.css,
src/parts/09b-pixel.js, 09d-pixel-monsters.js, 09f-pixel-bestiary.js, 11e-finishers.js, 13-events.js,
14-adventure.js, 15-pets-and-haven.js, 16-bosses-steam-comics.js, 17-sound-engine.js.

WHAT CHANGED, IN SHORT
- Finishers: every one of the 13 now has its own big light show (falling stars, lightning, burning meteor, ice spikes,
  twister, rainbow bridge, fire dragon, tiger claws, petal storm, tidal wave, golden eagle, volcano, galaxy).
- Auras: all 14 hero auras glow, have a double ground ring and more floating details. Bosses have a stronger aura too.
- More detail: heroes, knights, monsters and bosses get edge light, shading and glints. Every normal monster gets
  its own small markings. Pets look soft and plush, with shiny eyes.
- Stories: no more title card. Every story starts at scene 1. The buttons are now one big button.
- Pet Haven: you can buy pets with coins.
- Text size: the screen now stays inside the screen, even at the biggest size.
- Music: 19 new songs, and the music now fits where you are (home, shop, haven, tower, story, battle, boss, win, lose).
  About 25 new sound effects, and every button and tab has its own sound.

======================================================================================================================

Quest Academy v32.0.0 - RIVAL KNIGHT, BOSS POWERS, TEAM COMBOS, GEAR RARITY, PET GEAR, NEW MONSTERS, A BIGGER STORY
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). No new packages are needed.
npm run check, npm run lint:bank and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/09k-bestiary5.js          -> 10 new monsters and 10 "elder" zone bosses (pixel art)
src/parts/29-v32-story.js           -> rival knight, mini-boss scene, voices, music moods, choices, picture words, pet evolution scene
src/parts/30-v32-battle.js          -> boss powers, boss situations, team combo bar, cooler finisher
src/parts/31-v32-gear.js            -> gear rarity, forge, pet gear
src/parts/32-v32-audio.js           -> a sound for every battle action, new songs
src/parts/33-v32-qa.js              -> handles used by the tests
src/content/cutscenes/shared.js, x1.js, x2.js, x3.js, x4.js -> story text (loaded by age, only when needed)
src/css/23-v32.css                  -> styles for all of the above
tests/v32.test.mjs                  -> tests

CHANGED FILES (REPLACE): package.json (32.0.0), package-lock.json, vite.config.js, README.txt, CHANGELOG.md, src/style.css,
src/content/cutscenes.js, tests/v21.test.mjs, tests/v22.test.mjs, tests/v29.test.mjs,
src/parts/03-items-and-levels.js, 09b-pixel.js, 09f-pixel-bestiary.js, 11-battle.js, 11d-quirks.js, 11g-anim.js,
13-events.js, 14-adventure.js, 14c-collection.js, 15-pets-and-haven.js, 16-bosses-steam-comics.js, 17-sound-engine.js,
19-sprite-lab.js, 20-v27-battle.js, 22-v27-hero.js, 25-v29-cutscenes.js.

WHAT CHANGED, IN SHORT
- Sir Kilat, a rival knight, challenges you at levels 25, 50 and 75 with a story scene and a mixed-subject duel.
- Every zone boss has its own power and its own battle twist, and talks in its own voice (also in rematches).
- Team play: the boss has one shared health bar, and the team combo hits only when every player is right.
- Armour, weapons and other gear now come in 5 rarities with their own bonus stats. A forge can re-roll them.
- Pets can wear hats, scarves and capes.
- Every battle action has its own sound. The finisher is now a big cinematic move.
- 10 new monsters and 10 "elder" bosses, so there is more to meet and collect.
- Stories: one villain arc across all 10 zones, a mini-boss scene at level 5, cliffhanger endings, subject-flavoured
  chapters, small choices with a tiny reward, new scene shots, music that matches the mood, voices with different
  pitch for each speaker, a pet evolution scene, and English + Malay picture words.

======================================================================================================================

Quest Academy v31.0.0 - MISTAKE REVIEW, SMALL LETTERS, CODE RECOVERY, VIBRATION, SMOOTHER STORIES, SIMPLER ADVENTURE
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm install (adds the Playwright test runner), then npm run dev (or npm run build).
npm run check, npm run lint:bank and npm test need only Node 18+. For npm run e2e, once: npx playwright install chromium

NEW FILES (ADD):
src/parts/00b-crashlog.js           -> problem log kept on this device (export or clear it in the Parent Portal)
src/parts/00c-hooks.js              -> HOOK: how later parts extend a function (replaces "win = async function ...")
src/parts/26-v31-parent.js          -> recovery question, problem log card, vibration
src/parts/27-v31-review.js          -> "Look at my mistakes" after a battle
src/parts/28-v31-story.js           -> word-by-word story text (part of the smoother stories)
src/content/lessons/<subject>/b1.js, b3.js, b4.js -> lesson text split by subject and age
src/css/22-v31.css                  -> styles for all of the above, smoother stories, simpler Adventure tab
scripts/lint-bank.mjs               -> npm run lint:bank
tests/v31.test.mjs, tests/e2e/smoke.spec.mjs, playwright.config.mjs -> tests

CHANGED FILES (REPLACE): package.json (31.0.0), package-lock.json, vite.config.js, .gitignore, README.txt, CHANGELOG.md,
src/style.css, src/content/cutscenes.js, scripts/harness.mjs, tests/v21.test.mjs, tests/v25.test.mjs, tests/v30.test.mjs,
src/parts/03-items-and-levels.js, 05-state-and-sound.js, 07b-question-families.js, 07c-question-types.js, 10-screens-tabs.js,
10b-lessons-plus.js, 11-battle.js, 11b-speech-trace.js, 11e-finishers.js, 12-welcome-parent-timer.js, 12b-family.js,
13-events.js, 14-adventure.js, 14c-collection.js, 16-bosses-steam-comics.js, 16b-epic-story.js, 17-sound-engine.js,
18-boot.js, 20-v27-battle.js, 21-v27-modes.js, 22-v27-hero.js, 23-v28-lessons.js, 24-v28-activities.js, 25-v29-cutscenes.js.

OLD FILES YOU CAN DELETE (they are no longer used; the game works even if they stay):
src/parts/10c-flashcards.js
src/content/lessons/bm.js, en.js, fk.js, math.js, mz.js, pk.js, pm.js, sc.js, se.js, sv.js  (now in the subject folders)

WHAT CHANGED, IN SHORT
- After a battle, "Look at my mistakes" explains why each wrong answer was wrong, with a lesson link.
- Tracing has small letters a-z, and every stroke must be traced (no skipping the dot of an i).
- Parents can set a recovery question, so a forgotten code no longer erases progress.
- Phones and tablets buzz for right and wrong answers, finishers and story scenes (switch in the Parent Portal).
- A problem log in the Parent Portal keeps errors on the device (export or clear).
- Stories run with about a third less work for the device, so they stutter much less on tablets.
- The Adventure tab is simpler: small subject tiles, one age row, slim locked zones.
- For developers: hooks instead of replaced functions, stories and lessons load by age, new tests, bank linter,
  browser smoke test.

======================================================================================================================

Quest Academy v30.0.0 - CLEANER CODE, SMOOTHER GAME
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
src/css/21-v30.css                  -> "lite" look for slow devices (rests the decorative looping effects)
tests/v30.test.mjs                  -> tests for v30

CHANGED FILES (REPLACE): package.json (30.0.0), src/style.css, README.txt, CHANGELOG.md, tests/v28.test.mjs,
src/css/03-adventure.css, 04-parent-motion.css, 05-v3-sensory.css, 06-v4.css, 07-v5-v7.css, 08-phone-v7.1-7.2.css,
09-v8-v9.css, 11-pixel.css, 12-royal.css, 14-v22.css,
src/parts/01-setup.js, 02-strings.js, 02c-strings-v22.js, 05-state-and-sound.js, 07-questions.js,
07c-question-types.js, 09-sprites.js, 09c-pixel-knights.js, 09e-pixel-smooth.js, 09g-sprite-cache.js,
10-screens-tabs.js, 11-battle.js, 11b-speech-trace.js, 12b-family.js, 13-events.js, 14-adventure.js,
14b-goals-map.js, 15-pets-and-haven.js, 16-bosses-steam-comics.js, 17-sound-engine.js, 18-boot.js,
20-v27-battle.js, 23-v28-lessons.js, 24-v28-activities.js.
No files to delete.

WHAT CHANGED, IN SHORT
- Removed old code nobody used any more: the retired STEAM quest screen, old map/world helpers, about 220 unused
  text strings and about 5 KB of unused styles. The game file is about 35 KB smaller.
- Fixed a hidden bug: two functions had the same name, so spelling questions could get broken wrong answers.
- Smoother: animations no longer force the browser to re-measure the whole page, story scenes are measured once
  per frame, the Studies tab only redraws what changed, and slow devices ("Lite" quality) skip background sparkles.

======================================================================================================================

Quest Academy v29.0.0 - EVERY STORY IS NOW A CUTSCENE: MORE SCENES, DIALOGUE, CHARACTERS AND ACTION
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/25-v29-cutscenes.js       -> plays the stories as scripted cutscenes (new camera shots, dialogue boxes)
src/content/cutscenes.js            -> joins the four story scripts
src/content/cutscenes/b1.js ... b4.js -> the new stories for age 4, 5, 6 and 7 (English and Malay)
src/css/20-v29.css                  -> dialogue boxes in the classic look, action shots
tests/v29.test.mjs                  -> tests for v29

CHANGED FILES (REPLACE): package.json (29.0.0), src/style.css, src/parts/14-adventure.js, src/parts/16-bosses-steam-comics.js,
src/parts/22-v27-hero.js, tests/v26.test.mjs, tests/v27.test.mjs, README.txt, CHANGELOG.md.

WHAT CHANGED, IN SHORT
- No more fixed 6 pages: chapters are 9-13 scenes, boss intros 5, victories 5-6, played like a game cutscene.
- Characters talk in dialogue boxes with their face and name: the hero, Hoot, the villain, monsters, bosses and
  townsfolk (farmers, ducks, mermaids, engineers ...). New shots: conversations, close-ups, action fights,
  glowing discoveries, cheering crowds, scary dark scenes and journeys.
- All four sagas were rewritten with more detail, jokes and cliffhangers. Every story plays once more.

======================================================================================================================

Quest Academy v28.0.0 - A BIGGER STUDIES TAB: LESSON LADDERS, NOTEBOOK, 10 NEW ACTIVITIES, LESSON BATTLES
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/23-v28-lessons.js         -> lesson ladders, quick check, teach-back, picture-first cards, notebook,
                                       print & colour, lesson battles, topic bosses, study buffs, battle tips
src/parts/24-v28-activities.js      -> the 10 activities (story builder, word bench, sifir race, science lab,
                                       map explorer, music maker, feelings journal, safety scenes, tracing, sound pad)
src/css/19-v28.css                  -> looks for all of the above
tests/v28.test.mjs                  -> tests for v28

CHANGED FILES (REPLACE): package.json (28.0.0), src/style.css, src/parts/07c-question-types.js (the order widget
now also works outside battles), tests/v21.test.mjs (counts only letter and number tracing guides), README.txt,
CHANGELOG.md.

WHAT CHANGED, IN SHORT
- Lessons: Starter / Builder / Expert ladders per topic, a quick warm-up check, "Explain it" cards, picture-first
  cards for age 4, a notebook of "Remember" tips, printable colouring pages for art and tracing.
- After practice: a 3-round lesson battle. All lessons of a topic done: a topic boss. Practice gives a study buff.
- A win with many misses suggests the lesson to try.
- 10 activities in Studies. New Parent Portal switch: "Study buffs and bonus modes".

======================================================================================================================

Quest Academy v27.0.0 - LIVELIER BOSSES, ENDLESS TOWER, BOSS RUSH, SECRET LEVELS, SUBJECT MIX, PERKS, CHESTS, TEAM PLAY
See CHANGELOG.md for the full list. Unzip the update zip into your project root and overwrite.
Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/20-v27-battle.js          -> charged attacks, rage moves, minions, boss camera + slow motion, monster talk,
                                       team turns, auto-resume
src/parts/21-v27-modes.js           -> secret levels, Boss Rush, Endless Tower tab, Subject Mix, team-play setup
src/parts/22-v27-hero.js            -> hero perks, weapon upgrades, treasure chests, "why?" step, story skip, settings
src/css/18-v27.css                  -> looks for all of the above (6-tab menu, tower, chests ...)
tests/v27.test.mjs                  -> tests for v27

CHANGED FILES (REPLACE): package.json (27.0.0), index.html (Tower tab), src/style.css, src/parts/10-screens-tabs.js,
src/parts/11-battle.js, src/parts/14-adventure.js, README.txt, CHANGELOG.md.

WHAT CHANGED, IN SHORT
- Bosses: "❗ Charging!" attacks you can dodge, a special rage move for each boss, minions, camera zoom and a
  slow-motion final hit (can be turned off in the Parent Portal), funny monster lines.
- Zone bosses (levels 10, 20 ... 100): the timer keeps running between questions.
- New: secret levels, Boss Rush, Endless Tower tab, Subject Mix, team play for 2-3 children.
- Hero levels give perks, coins upgrade your weapon, boss chests hold treasures that are not in the Armory.
- Age 6-7: "Why is it right?" after some math answers. Story replays can be skipped. Battles continue after the page closes.

======================================================================================================================

Quest Academy v26.0.0 - NEW CONNECTED SAGAS FOR EVERY AGE, CLEARER ODD-ONE-OUT QUESTIONS, FASTER TABS
See CHANGELOG.md for the full list. Unzip quest-academy-v26-full.zip into an empty folder, or unzip the update zip
into your project root and overwrite. Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
tests/v26.test.mjs                  -> tests for v26 (sagas, odd-one-out wording, quick tabs)

CHANGED FILES (REPLACE): package.json (26.0.0), src/content/saga.js (all four sagas rewritten), src/css/06-v4.css,
src/css/12-royal.css, src/css/17-v25.css, src/parts/02c, 02e, 07c, 09d, 09e, 14-adventure, 14c, 16-bosses-steam-comics,
16b, 18, 19.

WHAT CHANGED, IN SHORT
- Age 4: The Little Knight's Wonder Book. Age 5: The Lone Knight and the Star of Tomorrow.
  Age 6: The Young Knight Who Would Be King. Age 7: The Ten Star Seals (the demon Drakmor).
- Every chapter and victory continues the story; the map shows the saga's progress.
- Odd-one-out questions say what the group is. Tabs change faster; the Cards tab opens at once.

======================================================================================================================

Quest Academy v25.0.0 - SMOOTH STORIES, STUDIES POP-UPS CLOSE, NO FLASHCARDS, 33 NEW UNIQUE ARMORY ITEMS, STILL ARMORY, PET HAVEN TABS
See CHANGELOG.md for the full list. Unzip quest-academy-v25-full.zip into an empty folder, or unzip the update zip
into your project root and overwrite. Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/02e-strings-v25.js        -> Pet Haven tab names in English and Bahasa Melayu
src/css/17-v25.css                  -> Pet Haven tabs, pet pictures on Armory cards
tests/v25.test.mjs                  -> tests for v25 (including "no two items look the same")

DELETE: src/parts/10c-flashcards.js

CHANGED FILES (REPLACE): package.json (25.0.0), src/style.css, src/css/14-v22.css, src/parts/03, 09b, 09c, 10-screens-tabs,
11e, 13, 15, 16-bosses-steam-comics, 16b, 18, tests/v22.test.mjs.

WHAT CHANGED, IN SHORT
- Story scenes play smoothly (pictures prepared ahead, much lighter markup, fewer endless effects).
- Studies pop-ups close with the X and with Escape. Flashcards removed.
- 3 knights, 5 weapons, 5 shields, 5 capes, 5 auras, 5 pets and 5 finishers, every one different.
- The Armory no longer jumps when switching tabs; Pet Haven has Your Pets / Furniture & Deco / Themes tabs.

======================================================================================================================

Quest Academy v24.0.0 - ZONE MUSIC, CARD RARITY AND FOILS, SCREEN TIME PER CHILD, UNIQUE QUESTIONS, NO HELP, FIT-TO-SCREEN BATTLES
See CHANGELOG.md for the full list. Unzip quest-academy-v24-full.zip into an empty folder, or unzip the update zip
into your project root and overwrite. Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/02d-strings-v24.js        -> new English and Bahasa Melayu text for v24
src/parts/09j-bestiary4.js          -> ten more monster species
src/parts/11g-anim.js               -> smooth idle motion per kind of character
src/parts/12c-screen-time.js        -> daily limits for each child (school days and weekends)
src/css/16-v24.css                  -> fit-to-screen battle, feedback line, card rarity and foils, screen time, animation
tests/v24.test.mjs                  -> tests for v24

CHANGED FILES (REPLACE): package.json (24.0.0), vite.config.js, scripts/check-data.mjs, src/style.css,
src/content/bm, en, fk, ma, pk, pm, sc, se .js, src/parts/03, 07b, 07c, 11-battle, 11b, 11d, 12, 13, 14-adventure,
14b, 14c, 17, 18, 19, tests/v21.test.mjs, tests/v22.test.mjs.

WHAT CHANGED, IN SHORT
- Zone instruments and motifs in the music. Card rarity (Common/Rare/Epic/Legendary) and holographic foils.
- Per-child daily limits (school days and weekends) in the Parent Portal.
- No repeated questions in a battle; no duplicate questions across subjects; 70 new questions.
- Help removed from battle; the battle screen fits without scrolling.
- Ten new monster species (60 kinds of cards); smoother character animation.

======================================================================================================================

Quest Academy v23.0.0 - FIXES (NAMES, TRACING, SUBJECT MIX, LESSON PRACTICE), SIMPLER CARDS, NEW GEAR AND MONSTERS
See CHANGELOG.md for the full list. Unzip quest-academy-v23-full.zip into an empty folder, or unzip the update zip
into your project root and overwrite. Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/09i-bestiary3.js          -> ten more monster species
src/css/15-v23.css                  -> simpler level and victory cards, smaller tracing pad
tests/v23.test.mjs                  -> tests for v23

CHANGED FILES (REPLACE): package.json (23.0.0), vite.config.js (new species in the sprite worker), src/style.css,
src/content/bm, en, fk, ma, mz, pk, sv .js (lesson questions), src/parts/02c, 03, 07c, 09, 09b, 09c, 09d, 09f, 10b,
11-battle, 11b, 11d, 13, 14-adventure, 14c, 19, tests/v21.test.mjs, tests/v22.test.mjs.

WHAT CHANGED, IN SHORT
- Monster names now say what the monster is (and use Malay word order in BM).
- Tracing: a new letter always gets a fresh pad; the pad is smaller in battle.
- No more naming/colour questions inside other subjects; lesson practice follows the lesson.
- Simpler level card and victory card.
- 21 new Armory items; 10 new monster species (50 kinds of cards).

======================================================================================================================

Quest Academy v22.0.0 - NEW QUESTION TYPES, FINISHERS, LESSON PRACTICE, FLASHCARDS, STAR GOALS, MONSTER CARDS
See CHANGELOG.md for the full list. Unzip quest-academy-v22-full.zip into an empty folder, or unzip the update zip
into your project root and overwrite. Then: npm run dev (or npm run build). npm run check and npm test need only Node 18+.

NEW FILES (ADD):
src/parts/02c-strings-v22.js        -> all new English and Bahasa Melayu text for v22
src/parts/07c-question-types.js     -> true/false blast, odd one out, drag to order, match pairs
src/parts/09h-bestiary2.js          -> ten new monster species
src/parts/10b-lessons-plus.js       -> lesson practice (3 questions), quick quiz (5), lesson of the week
src/parts/10c-flashcards.js         -> flashcard decks with spaced review
src/parts/10d-demos.js              -> clock, number line, money, syllable clapper, float or sink, magnets
src/parts/11e-finishers.js          -> combo-5 finishers and their animations
src/parts/14b-goals-map.js          -> star goals, zone landmark scenes, hero walking the path
src/parts/14c-collection.js         -> Monster Cards tab
src/parts/16b-epic-story.js         -> hero name, pet in stories, epic story staging
src/css/14-v22.css                  -> styles for all of the above
tests/v22.test.mjs                  -> tests for v22

CHANGED FILES (REPLACE): index.html (Cards tab), package.json (22.0.0), vite.config.js (new species in the sprite
worker), scripts/check-data.mjs, src/style.css,
src/content/bm, en, fk, ma, mz, pk, pm, sc, se .js, src/content/lessons/en, math, pk .js,
src/parts/01, 02, 03, 05, 07, 07b, 10, 11, 11b, 11d, 12, 13, 14, 16, 17, 18, 19, tests/v21.test.mjs.

WHAT CHANGED, IN SHORT
- New question types (true/false, odd one out, drag to order, match pairs), more of them for age 4.
- Combo of 5 = a finisher move; 8 finishers to buy in the Armory.
- Battles are harder (more monster health, slightly stronger hits).
- Lessons end with 3 practice questions and a 5-question quiz; flashcards; 6 new demos; lesson of the week.
- Star goals (first try, speed, no hints) shown on the map; zone landmark scenes; the hero walks the path.
- Hero name on the welcome screen, used with the pet in stories; more epic story scenes.
- Monster Cards collection tab and ten new monster species.
- Daily quest removed; many sentences fixed.

======================================================================================================================

Quest Academy v21.0.0 - FAMILIES, OFFLINE APP, TRACING, REAL SPOKEN ANSWERS, PARENT TOOLS, SOUND AND ACCESSIBILITY
See CHANGELOG.md for the full list. The easiest way to install: unzip quest-academy-v21-full.zip into an empty folder,
or unzip the update zip into your project root and overwrite. Then: npm run dev (or npm run build). No npm install needed:
npm run check and npm test only use Node itself (Node 18 or newer).

NEW FILES (ADD):
src/parts/02b-strings-v21.js        -> all new English and Bahasa Melayu text for v21
src/parts/05b-stats.js              -> per-question stats, daily records, tricky questions, weekly summary
src/parts/09g-sprite-cache.js       -> sprites kept in IndexedDB, sprite worker, Auto/Full/Lite graphics quality
src/parts/11b-speech-trace.js       -> real spoken answers (en-US / ms-MY) and letter/number tracing for age 4
src/parts/11c-announce.js           -> screen reader announcements in battle (aria-live)
src/parts/11d-quirks.js             -> idle quirks for every monster species and the zone bosses
src/parts/12b-family.js             -> several children, Who is playing?, subject locks and today's focus, bedtime,
                                       and the new Parent Portal sections (week, tricky questions, listening, graphics, volume)
src/parts/19-sprite-lab.js          -> Sprite Lab: open the game with ?lab to see every sprite and all 6 frames
src/sprite-worker.js                -> placeholder; the build fills it with the sprite engine
src/content/lessons/*.js            -> lesson text, one file per subject, loaded when first needed
src/css/13-v21.css                  -> styles for all of the above, colour-blind-safe palette
src/fonts/opendyslexic-*.woff2      -> dyslexia-friendly font, bundled (licence: src/fonts/OpenDyslexic-OFL.txt)
public/manifest.webmanifest, public/icons/*   -> installable app (home screen icon, offline)
scripts/harness.mjs, scripts/check-data.mjs   -> npm run check (content validator)
tests/game.test.mjs, tests/v21.test.mjs       -> npm test (unit tests)
CHANGELOG.md                        -> version history

CHANGED FILES (REPLACE): index.html, package.json (version 21.0.0, check and test scripts), vite.config.js
(offline service worker, sprite worker, app version), src/style.css, src/content/lessons.js (now titles only),
src/css/00, 05, 06, 11, 12 and src/parts/01, 02, 03, 04, 05, 07b, 08, 09, 09b, 09c, 09d, 09e, 10, 11, 12, 13, 14, 15,
16, 17, 18.

WHAT CHANGED, IN SHORT
- Several children on one device, each with their own save. Add them in Parent Portal > Children on this device.
- Parent Portal: This week (time, days, accuracy, strongest/weakest skills, suggested focus), Tricky questions,
  Subjects (always available + today's focus), Bedtime, spoken answers settings, graphics quality,
  colour-blind-safe colours, volume sliders, app version.
- New day starts at local midnight (it used to change at 8:00 am in Malaysia). Parent code uses PBKDF2.
- Offline app with home-screen install. Lessons load per subject. Sprites drawn in a worker and remembered.
- Age 4 tracing; real speech recognition for the microphone answer style (on-device when available; the online
  service only if a grown-up allows it; Quest Academy never records audio).
- New Art and Music question generators for ages 6-7. Extra songs per zone mood; music grows more intense as the
  monster weakens and in a boss's third phase. Monster idle quirks.
- Removed: rematch leftovers and Spanish text.

CHECKS
  npm run check   -> content validator; exits with an error code if a question is broken (0 errors now; 46 notes
                     about short option lists and zones with fewer than 15 different questions at age 4)
  npm test        -> 14 unit tests
Offline mode works in the built app (npm run build, then npm run preview or any https host). In npm run dev the
service worker is off on purpose.

------------------------------------------------------------------
Quest Academy v20 - MONSTER REDESIGN. Files to REPLACE:

src/parts/09b-pixel.js              -> new monster render style: rounded volume shading lit from the top-left, warm lights and
                                       cool purple shadows, coloured outlines, glossy highlights, clean scale/fur/stone/feather patterns
src/parts/09d-pixel-monsters.js     -> shared monster kit (expressive eyes with iris and glint, angry brows, grins, roars,
                                       hurt faces, 8 detailed weapons, gear that suits each creature) + 10 species redrawn:
                                       Gel Slime, Goblin Raider, Myconid Guard, Wraith, Stone Golem, Gargoyle, Crystal Elemental,
                                       Troll Brute, Young Drake, Shadow Knight; every species has its own colour schemes
src/parts/09f-pixel-bestiary.js     -> 10 more species redrawn (Mimic, Horned Imp, Pixie Dryad, Skeleton Warrior, Clockwork
                                       Automaton, Seraph Sentinel, Fire Elemental, Cyclops, Dire Wolf, Owlbear); zone bosses upgraded
                                       with colour schemes and real faces (Ancient Dragon, Stone Titan, Archon, Fey Queen, Chimera, Hydra)

Unzip into your project root and overwrite, then restart: npm run dev (or npm run build). No npm install needed.

------------------------------------------------------------------
Quest Academy v19 - MORE DETAIL, SMOOTHER ART, NEW MONSTER TYPES, EPIC BOSSES. Files to REPLACE or ADD:

src/parts/09b-pixel.js              -> finer 96x96 pixel grid (was 64x64) for smoother shapes; surface textures (chainmail,
                                       scales, fur, feathers, stone, wood, cloth, plate); glowing boss aura that hugs the outline
src/parts/09c-pixel-knights.js      -> more knight detail: rivets, armour plate lines, chainmail sleeves and coif, helm ridge and
                                       breathing holes, gauntlet fingers, sword fuller and grip wrap, shield bevel and rivets, plume strands
src/parts/09d-pixel-monsters.js     -> textures on the older monsters; hooks for the new species and bosses
src/parts/09f-pixel-bestiary.js     -> NEW: 10 new species (Mimic, Horned Imp, Pixie Dryad, Skeleton Warrior, Clockwork Automaton,
                                       Seraph Sentinel, Fire Elemental, Cyclops, Dire Wolf, Owlbear) covering beast, celestial,
                                       construct, elemental, fey, fiend, giant, monstrosity and undead; 10 hand-built zone bosses
                                       (Ancient Dragon, Lich King, Stone Titan, Fiend Lord, Archon, Elemental Lord, Fey Queen, Chimera,
                                       Clockwork Colossus, Hydra) with auras and animated effects; mini-bosses get a golden elite glow
src/parts/03-items-and-levels.js    -> monsters pick their species; every subject meets all ten bosses, each in a different order
src/css/12-royal.css                -> zone bosses drawn bigger in battle

Unzip into your project root and overwrite, then restart: npm run dev (or npm run build). No npm install needed.

------------------------------------------------------------------
Quest Academy v18 - HEROIC KNIGHTS style. Files to REPLACE (same names, same folders):

src/parts/09c-pixel-knights.js  -> all 5 knights redrawn as heroic armoured knights; every weapon, shield and cape is real
                                   medieval gear; Armory items renamed (ids unchanged, so saves keep what they own)
src/parts/09d-pixel-monsters.js -> all monsters redrawn in the same style: Bog Slime, Goblin Raider, Mushroom Guard, Wraith,
                                   Stone Golem, Gargoyle, Crystal Elemental, Troll Brute, Drake, Shadow Knight
src/parts/09b-pixel.js          -> flat chunky shading + dark outline (classic 16-bit look); new auras

Unzip into your project root and overwrite, then restart: npm run dev (or npm run build). No npm install needed.

------------------------------------------------------------------
Quest Academy v17 - smaller fighters, unique questions, knights-only Armory. Files to REPLACE or ADD:

src/parts/07b-question-families.js  -> NEW: completes question families (letters, days, picture words, claps, instruments)
src/parts/13-events.js              -> each age has its own question bank; saved memory = no repeats until every question is asked; fresh numbers for sums
src/parts/11-battle.js              -> remembers which questions were asked
src/content/bm.js, en.js, sv.js, ma.js -> 5 questions that were shared between subjects rewritten
src/parts/03-items-and-levels.js    -> Explorer Kid removed; knights-only Armory tabs
src/parts/05-state-and-sound.js     -> old saves wearing Explorer Kid switch to Tiny Tobias
src/parts/09c-pixel-knights.js      -> no Explorer Kid previews
src/parts/10-screens-tabs.js        -> Armory tabs: Knights, Tools, Shields, Capes, Auras, Pets
src/parts/18-boot.js                -> test hook
src/css/12-royal.css                -> knight and monster a little smaller in battle

Unzip into your project root and overwrite, then restart: npm run dev (or npm run build). No npm install needed.

------------------------------------------------------------------
Quest Academy v16 - victory stories, epic battle, pacing. Files to REPLACE (same names, same folders):

src/parts/16-bosses-steam-comics.js -> victory story after every zone boss (levels 10-100), all 4 ages, EN + BM
src/parts/14-adventure.js           -> plays the victory story before rewards; "Victory story" replay button; no rematch
src/parts/13-events.js              -> victory story replay
src/parts/11-battle.js              -> new answer timers
src/parts/05-state-and-sound.js     -> pacing table (10 s, 15 s, 20 s, 45 s, unlimited); rematch switched off
src/parts/01-setup.js               -> pacing names
src/parts/10-screens-tabs.js        -> rematch removed from the map
src/parts/12-welcome-parent-timer.js-> new pacing choices; rematch settings removed
src/css/12-royal.css                -> bigger, more epic arena; smaller question, tools and answers

Unzip into your project root and overwrite, then restart: npm run dev (or npm run build). No npm install needed.

------------------------------------------------------------------
Quest Academy v15 - quality, transitions and fixes. Files to REPLACE (same names, same folders):

src/parts/09b-pixel.js              -> better characters: tinted outlines, soft seams, cool rim light, softer glints; faster shading
src/parts/09e-pixel-smooth.js       -> pixel wipe transition + screen slide helpers
src/parts/13-events.js              -> wipes into/out of battle, slide between subject and map screens
src/parts/16-bosses-steam-comics.js -> story picture sits above the caption box; story end opens the level card; wipes in/out of stories
src/css/12-royal.css                -> transitions, no text shadows in battle, smoother scrolling

Unzip into your project root and overwrite, then restart: npm run dev (or npm run build). No npm install needed.

------------------------------------------------------------------
Quest Academy v14 - 64x64 PIXEL ART update. Files to REPLACE (same names, same folders):

src/parts/09b-pixel.js          -> the sprite engine now draws every character on a 64x64 grid
                                   (finer curves, thin crisp outlines, dithered shading, sharper story props)
src/parts/09d-pixel-monsters.js -> monsters get round eyes with a one-pixel shine

Unzip into your project root and overwrite, then restart: npm run dev (or npm run build). No npm install needed.

------------------------------------------------------------------
Earlier: v13 (Pixel Knights) notes below
Quest Academy v13 - PIXEL KNIGHTS update. Files to REPLACE or ADD (same names, same folders):

src/parts/09c-pixel-knights.js      -> NEW: Tiny Tobias (your hero) + 4 knight skins to buy, Explorer Kid dress-up skin
src/parts/09d-pixel-monsters.js     -> NEW: every monster redrawn in the knight style (10 species: slime, goblin,
                                       mushroom, spectre, golem, imp, crystal, beast, dragon, beetle) + pixel villains
src/parts/09e-pixel-smooth.js       -> NEW: smoother screens (sprites drawn in small slices + ready before you need them)
src/css/12-royal.css                -> NEW: Royal Night look (Parchment look when the theme is Warm), RPG story dialogue box
src/parts/09b-pixel.js              -> faster sprite engine, knights, pixel props for stories, pixel sky backdrop
src/parts/03-items-and-levels.js    -> the Knights shop (Armory > Knights)
src/parts/05-state-and-sound.js     -> pixel mode uses the Royal Night look on "Auto"
src/parts/10-screens-tabs.js        -> Armory: knights tab, lazy cards
src/parts/14-adventure.js           -> gets the next monsters ready while you look at the map
src/parts/16-bosses-steam-comics.js -> story scenes: speaker portrait, name plate, letter-by-letter text, pixel props
src/parts/18-boot.js                -> warm-up at start
src/css/11-pixel.css, src/style.css -> styles

Unzip into your project root (the folder with index.html) and say yes to overwrite, then run:
  npm run build      (or npm run dev - restart it if it is already running)
No npm install needed.

Knights: Tiny Tobias is free. Sir Aldric 120, Lady Elowen 180, Bulwark Bram 250, Onyx Warden 400 coins.
Tools, shields, capes and auras show on every knight. Hair, faces, outfits, hats and boots are worn by the Explorer Kid skin.
The old look is still there: Parents tab -> "Pixel art" -> off. Theme "Warm" gives the light Parchment look.
To edit knights: src/parts/09c-pixel-knights.js. To edit monsters: src/parts/09d-pixel-monsters.js.
