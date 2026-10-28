/* v35: twelve new question formats, as a lazy module (loaded in the background after the game starts, so it is not
   part of the first download). makeFormats(C) gets what it needs from the game (C) and returns the generators.

   Every format makes a normal question object with kind 'wx' plus a mount(host, H) function that draws the widget.
   H is how the widget talks to the battle (or any other place that wants these questions):
     H.locked()  true while the monster is attacking or the answer is being celebrated
     H.still()   true while this question is still the current one
     H.tier()    how many wrong answers so far (hints appear from 1)
     H.ok()      the whole question is right
     H.miss()    one wrong try (the monster counter-attacks, the boss rune resets, the mistake is kept for review)
   q.verify(x) is the pure scoring rule for each format (tests use it too), q.ansText is the right answer in words.

   1 numline    drag a marker to where a number, fraction or decimal belongs
   2 fill       drag a word or number into the gap of a sentence or sum
   3 bucket     drag items into 2 or 3 labelled boxes
   4 sent       build a sentence from word tiles (uses the order widget)
   5 spot       tap the line with the mistake
   6 clock      drag the clock hands      7 money   tap coins to pay an exact amount
   8 picword    hear a word, tap the picture (no reading, ages 4 to 5)
   9 twostep    pick the operation, then work it out
  10 memory     see a sequence for a few seconds, then put it back (uses the order widget)
  11 hotspot    tap the right part of a picture        12 draw   draw the shape or digit
  13 rhythm     listen to a beat, tap it back */
import { partA } from './formats-a.js';
import { partB } from './formats-b.js';
import { partC } from './formats-c.js';
import { partD } from './facts.js';   // v36: fact tables and the Bilingual boost

export function makeFormats(C) {
  const { t, L, pick, shuffle, rnd, esc, STR, sfx } = C;
  const K = { C, gens: {}, weights: {} };
  /* a text in the game language: T('English', 'Bahasa Melayu') */
  K.T = (en, bm) => (L() ? bm : en);
  /* the language index of a subject's words: Bahasa Melayu always Malay, English always English, the rest follow the game */
  K.sl = subj => (subj === 'bm' ? 1 : subj === 'en' ? 0 : L());
  K.lc = subj => (K.sl(subj) ? 'ms-MY' : 'en-US');
  K.cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  K.tid = (s, ...a) => s;   // marker for strings that are already in the right language
  /* the base of every new question */
  K.mk = (subj, type, extra) => ({ kind: 'wx', type, topic: subj + '_' + type, tag: t('wx.tag.' + type), memSubj: subj, cls: '', customSteps: true, noTap: true, options: [], correct: -1, ansText: '', ...extra, key: 'wx:' + type + ':' + (extra && extra.key || '') });
  /* steps shown by the mistake review */
  K.steps = (...lines) => () => lines.filter(Boolean);
  /* drag a tile onto a target, or tap a tile and then tap a target. onDrop(tileEl, targetEl). */
  K.drag = (root, tileSel, dropSel, onDrop, can) => {
    let sel = null;
    const clear = () => { root.querySelectorAll('.nq-sel').forEach(x => x.classList.remove('nq-sel')); sel = null; };
    root.addEventListener('pointerdown', e => {
      const b = e.target.closest(tileSel); if (!b || !can()) return;
      const r = b.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY; let ghost = null, moved = false;
      const move = ev => {
        if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;
        if (!moved) { moved = true; root.dataset.drag = '1'; clear(); ghost = b.cloneNode(true); ghost.classList.add('nq-ghost'); ghost.style.width = r.width + 'px'; document.body.appendChild(ghost); b.classList.add('lift'); }
        ghost.style.transform = `translate(${ev.clientX - r.width / 2}px,${ev.clientY - r.height / 2}px)`;
        const el = document.elementFromPoint(ev.clientX, ev.clientY), d = el && el.closest(dropSel);
        root.querySelectorAll(dropSel).forEach(x => x.classList.toggle('over', x === d));
      };
      const up = ev => {
        removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
        if (!moved) return;
        const el = document.elementFromPoint(ev.clientX, ev.clientY), d = el && el.closest(dropSel);
        root.querySelectorAll(dropSel).forEach(x => x.classList.remove('over'));
        if (ghost) ghost.remove(); b.classList.remove('lift'); setTimeout(() => { delete root.dataset.drag; }, 0);
        if (d && root.contains(d)) onDrop(b, d);
      };
      addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    });
    root.addEventListener('click', e => {
      if (root.dataset.drag || !can()) return;
      const b = e.target.closest(tileSel);
      if (b) { if (sel === b) { clear(); return; } clear(); sel = b; b.classList.add('nq-sel'); sfx.pop(); return; }
      const d = e.target.closest(dropSel); if (d && sel) { const s0 = sel; clear(); onDrop(s0, d); }
    });
    return { clear };
  };
  /* money: amounts are whole sen. 150 -> "RM 1.50", 50 -> "50 sen" */
  K.money = sen => (sen < 100 ? `${sen} sen` : `RM ${(sen / 100).toFixed(2)}`);
  K.pair = (en, bm) => [en, bm];

  STR['wx.tag.numline'] = ['📏 Number line', '📏 Garis nombor'];
  STR['wx.tag.fill'] = ['🧩 Fill the gap', '🧩 Isi tempat kosong'];
  STR['wx.tag.bucket'] = ['🧺 Sort it out', '🧺 Asingkan'];
  STR['wx.tag.sent'] = ['🧱 Build the sentence', '🧱 Bina ayat'];
  STR['wx.tag.spot'] = ['🔍 Spot the mistake', '🔍 Cari kesilapan'];
  STR['wx.tag.clock'] = ['🕒 Set the clock', '🕒 Laraskan jam'];
  STR['wx.tag.money'] = ['🪙 Pay the money', '🪙 Bayar wang'];
  STR['wx.tag.picword'] = ['👂 Listen and tap', '👂 Dengar dan sentuh'];
  STR['wx.tag.twostep'] = ['🪜 Two steps', '🪜 Dua langkah'];
  STR['wx.tag.memory'] = ['🧠 Remember it', '🧠 Ingat'];
  STR['wx.tag.hotspot'] = ['👆 Tap the spot', '👆 Sentuh tempat itu'];
  STR['wx.tag.draw'] = ['✏️ Draw it', '✏️ Lukis'];
  STR['wx.tag.rhythm'] = ['🥁 Echo the beat', '🥁 Ulang rentak'];
  Object.assign(STR, {
    'wx.ok': ['OK', 'OK'], 'wx.check': ['✓ Check', '✓ Semak'], 'wx.again': ['↺ Again', '↺ Ulang'], 'wx.listen': ['🔊 Listen', '🔊 Dengar'],
    'wx.peek': ['👀 Peek', '👀 Intai'], 'wx.need': ['Still to pay: {v}', 'Masih perlu bayar: {v}'], 'wx.paid': ['In the dish: {v}', 'Dalam pinggan: {v}'],
    'wx.over': ['Too much! Take the coins back and try again.', 'Terlebih! Ambil semula syiling dan cuba lagi.'],
    'wx.why.nl': ['Count along the line: {v} sits right here.', 'Kira di sepanjang garis: {v} terletak di sini.'],
    'wx.why.clock': ['The short hand shows the hour, the long hand shows the minutes.', 'Jarum pendek menunjukkan jam, jarum panjang menunjukkan minit.'],
    'wx.why.pay': ['Add the coins up until you reach {v}.', 'Tambah syiling sehingga mencapai {v}.'],
    'wx.why.sort': ['{x} goes in the {b} box.', '{x} masuk dalam kotak {b}.'],
    'wx.why.fill': ['The missing piece is {a}.', 'Bahagian yang hilang ialah {a}.'],
    'wx.why.spot': ['It should say: {g}', 'Sepatutnya: {g}'],
    'wx.why.mem': ['Look again: {a}', 'Lihat semula: {a}'], 'wx.why.hot': ['That is the {a}.', 'Itulah {a}.'], 'wx.why.rhythm': ['The beat was: {a}', 'Rentaknya: {a}'],
    'wx.why.two': ['First choose {op}, then work it out: {eq}.', 'Pilih {op} dahulu, kemudian kira: {eq}.'], 'wx.why.pic': ['You heard “{a}”.', 'Kamu dengar “{a}”.'],
    'wx.why.draw': ['Start at the green dot and follow the line.', 'Mula di titik hijau dan ikut garisan.'],
    'wx.noVoice': ['No voice here, so the word is shown.', 'Tiada suara, jadi perkataan dipaparkan.']
  });

  partA(K); partB(K); partC(K); partD(K);

  /* which new formats may be asked now: [[kind, weight], ...] */
  function weights(subj, band, boss) {
    const out = [];
    for (const [kind, fn] of Object.entries(K.weights)) { const w = fn(subj, band, !!boss); if (w > 0) out.push([kind, w]); }
    return out;
  }
  function make(kind, subj, band, small) {
    const g = K.gens[kind]; if (!g) return null;
    for (let i = 0; i < 4; i++) { const q = g(subj, band, !!small); if (q) return q; }
    return null;
  }
  return { gens: K.gens, weights, make, K, factMcq: (subj, band) => K.factMcq(subj, band) };
}
