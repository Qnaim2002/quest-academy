/* ================= v31: smooth stories =================
   Measured with Chrome's tracing on a 4x slowed CPU, the story kept the main thread busy on every frame. The causes and
   the fixes (see also 16-bosses-steam-comics.js, 16b-epic-story.js and css/22-v31.css):
     - every typed letter (and in the classic look every word) was its own CSS animation with a delay, so the browser
       tracked up to 150 animations per frame while a line was typing: now a small timer shows one word at a time
     - falling petals, bubbles, embers, confetti, light rays and the dark foreground shapes were animated inside the
       story picture, so the whole picture was redrawn every frame: they now sit in an HTML layer and only move with
       transform and opacity (the graphics chip does that alone)
     - decorative loops inside the picture (bobbing rows of props, glows, twinkles, spinning rays) hold still; the
       characters still move
     - the game behind the story is not drawn while the story plays
     - the cutscene script of a story is worked out once per story, not five times per scene change */
const TYPE = { t: 0, el: null };
function typeStop() { clearTimeout(TYPE.t); TYPE.t = 0; TYPE.el = null; }
function typeLine() {
  typeStop();
  const sh = $('#comicSheet'), p = sh && sh.querySelector ? sh.querySelector('.cn-bar.bot .cn-sub') : null; if (!p || !p.children) return;
  const words = [...p.children].filter(w => w.tagName === 'SPAN'); if (!words.length) return;
  const reduce = S.sensory || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dlg = p.closest ? p.closest('.cn-dlg') : null;
  if (reduce) { if (dlg) dlg.classList.add('typed'); return; }
  const pixel = !!S.pixel && !!dlg, at = words.map((w, i) => pixel ? 320 + (+w.style.getPropertyValue('--c') || 0) * 24 : 350 + i * 55);
  p.classList.add('jt'); TYPE.el = p;
  let k = 0;
  const step = () => {
    if (TYPE.el !== p) return;
    const now = performance.now() - t0;
    while (k < words.length && at[k] <= now + 8) words[k++].classList.add('on');
    if (k < words.length) TYPE.t = setTimeout(step, Math.max(16, at[k] - now));
    else { TYPE.t = 0; if (dlg) dlg.classList.add('typed'); }
  };
  const t0 = performance.now(); TYPE.t = setTimeout(step, at[0]);
}
HOOK.on('renderComic', () => typeLine());
