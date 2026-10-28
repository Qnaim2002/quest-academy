Quest Academy update - 5 files to REPLACE (same name, same folder):

src/content/lessons.js              -> new 281 detailed lessons (Studies tab)
src/parts/10-screens-tabs.js        -> Armory tap-to-preview
src/parts/13-events.js              -> Armory preview buttons + story controls
src/parts/16-bosses-steam-comics.js -> cinematic Adventure story (10 chapters)
src/css/09-v8-v9.css                -> styles for preview + cinematic

Unzip into your project root (the folder with index.html), say yes to overwrite,
then run: npm run build   (or npm run dev)

To edit the story text: src/parts/16-bosses-steam-comics.js, list CINE_TXT.
To edit lessons: src/content/lessons.js.
