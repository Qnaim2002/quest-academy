/* v35 formats 1 to 5: number line, fill the gap, sort into boxes, build the sentence, spot the mistake */
export function partA(K) {
  const { C, T, sl, cap, mk } = K, { t, L, pick, shuffle, rnd, esc, sfx, QT } = C;
  const S = () => C.S(), B = () => C.B();
  const tape = (a, b, step = 1) => { const o = []; for (let v = a; v <= b + 1e-9; v += step) o.push(+v.toFixed(4)); return o; };

  /* ---------------- 1. number line ---------------- */
  function nlCfg(band) {
    const ints = (lo, hi, tgt, tol, snap, tickStep, labels) => ({ lo, hi, target: tgt, tol, snap, ticks: tape(lo, hi, tickStep).map(v => ({ v, l: labels.includes(v) ? String(v) : '' })), label: String(tgt), shows: true });
    const frac = (n, d, ticksD, tol = .07) => ({ lo: 0, hi: 1, target: n / d, tol, snap: 0, ticks: tape(0, 1, 1 / ticksD).map((v, i) => ({ v, l: i === 0 ? '0' : i === ticksD ? '1' : '' })), label: `${n}/${d}`, shows: false });
    const dec = (v, ticksD = 10) => ({ lo: 0, hi: 1, target: v, tol: .06, snap: 0, ticks: tape(0, 1, 1 / ticksD).map((x, i) => ({ v: x, l: i === 0 ? '0' : i === ticksD ? '1' : i === ticksD / 2 && v !== .5 ? '0.5' : '' })), label: String(v), shows: false });
    const r = Math.random();
    if (band === 1) return ints(0, 10, rnd(1, 9), 0, 1, 1, [0, 5, 10]);
    if (band === 2) return r < .55 ? ints(0, 20, rnd(1, 19), 0, 1, 1, [0, 5, 10, 15, 20]) : ints(0, 100, rnd(1, 9) * 10, 0, 10, 10, [0, 50, 100]);
    if (band === 3) return r < .5 ? ints(0, 100, rnd(6, 94), 4, 1, 10, [0, 50, 100]) : r < .85 ? (() => { const [n, d] = pick([[1, 4], [3, 4], [1, 2]]); return frac(n, d, 4); })() : dec(.5, 10);
    return r < .35 ? ints(0, 1000, rnd(1, 99) * 10, 40, 10, 100, [0, 500, 1000]) : r < .6 ? dec(pick([.1, .2, .3, .4, .6, .7, .8, .9])) : r < .8 ? frac(pick([1, 2]), 3, 3, .08) : frac(pick([1, 3, 5, 7]), 8, 8, .06);
  }
  function numlineQ(subj, band) {
    if (subj !== 'math') return null;
    const c = nlCfg(band), span = c.hi - c.lo, label = c.label;
    const text = T(`Drag the marker to where ${label} belongs.`, `Seret penanda ke tempat ${label}.`);
    return mk(subj, 'numline', {
      text, reviewText: text, key: `${c.lo}-${c.hi}:${label}`, ansText: label, cfg: c, verify: v => Math.abs(v - c.target) <= c.tol + 1e-9,
      why: t('wx.why.nl', { v: label }), steps: K.steps(T(`Start at ${c.ticks[0].l || c.lo} on the left.`, `Mula di ${c.lo} di sebelah kiri.`), T(`The line ends at ${c.hi}.`, `Garis berakhir di ${c.hi}.`), T(`Find where ${label} sits between them.`, `Cari di mana ${label} terletak di antaranya.`)),
      speak: [[text]], viz: () => `<div class="clue big nq-big" aria-hidden="true">${esc(label)}</div>`,
      mount(host, H) {
        let cur = c.lo, done = false;
        const pc = v => ((v - c.lo) / span * 100).toFixed(2);
        host.innerHTML = `<div class="nq nq-nl"><div class="nl-track" role="slider" tabindex="0" aria-label="${esc(text)}" aria-valuemin="${c.lo}" aria-valuemax="${c.hi}" aria-valuenow="${c.lo}"><i class="nl-line"></i>
          ${c.ticks.map(k => `<b class="nl-tick ${k.l ? 'big' : ''}" style="left:${pc(k.v)}%"></b>${k.l ? `<u class="nl-lab" style="left:${pc(k.v)}%">${esc(k.l)}</u>` : ''}`).join('')}
          <i class="nl-hint" hidden></i><span class="nl-mark" style="left:0%">📍</span></div>
          <div class="nl-val" aria-live="polite">${c.shows ? c.lo : '·'}</div><div class="nq-acts"><button class="btn" data-wx="go">${t('wx.check')}</button></div></div>`;
        const root = host.querySelector('.nq'), tr = root.querySelector('.nl-track'), mark = root.querySelector('.nl-mark'), val = root.querySelector('.nl-val'), hint = root.querySelector('.nl-hint');
        const place = v => {
          v = Math.max(c.lo, Math.min(c.hi, v)); if (c.snap) v = c.lo + Math.round((v - c.lo) / c.snap) * c.snap;
          cur = +v.toFixed(4); mark.style.left = pc(cur) + '%'; tr.setAttribute('aria-valuenow', cur); if (c.shows) val.textContent = cur;
        };
        const fromX = x => { const b = tr.getBoundingClientRect(); return c.lo + Math.max(0, Math.min(1, (x - b.left) / (b.width || 1))) * span; };
        let drag = false;
        tr.addEventListener('pointerdown', e => { if (H.locked() || !H.still()) return; drag = true; try { tr.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } place(fromX(e.clientX)); sfx.pop(); });
        tr.addEventListener('pointermove', e => { if (drag) place(fromX(e.clientX)); });
        const end = () => { drag = false; }; tr.addEventListener('pointerup', end); tr.addEventListener('pointercancel', end);
        tr.addEventListener('keydown', e => {
          const st = c.snap || span / 20;
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { place(cur + st); e.preventDefault(); } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { place(cur - st); e.preventDefault(); } else if (e.key === 'Enter') go();
        });
        function go() {
          if (done || H.locked() || !H.still()) return;
          if (this_q.verify(cur)) { done = true; root.classList.add('good'); mark.classList.add('good'); H.ok(); }
          else { root.classList.add('bad'); setTimeout(() => root.classList.remove('bad'), 450); H.miss(); }
        }
        const this_q = this;
        root.querySelector('[data-wx="go"]').addEventListener('click', go);
        this.refresh = () => { const on = H.tier() >= 1 && !done; hint.hidden = !on; if (on) { const w = Math.max(c.tol, span * .06); hint.style.left = pc(Math.max(c.lo, c.target - w)) + '%'; hint.style.width = ((Math.min(c.hi, c.target + w) - Math.max(c.lo, c.target - w)) / span * 100) + '%'; } };
        this.refresh();
      }
    });
  }

  /* ---------------- 2. fill the gap ---------------- */
  /* [EN, BM, answer EN, answer BM, decoys EN, decoys BM, min band] */
  const CLOZE = {
    en: [['The cat ___ on the mat.', 'sits', ['sit', 'sitting']], ['I ___ an apple every day.', 'eat', ['eats', 'eating']], ['She ___ to school by bus.', 'goes', ['go', 'going']], ['A dog has four ___.', 'legs', ['wings', 'fins']], ['Birds can ___.', 'fly', ['bark', 'drive']], ['They ___ playing football.', 'are', ['is', 'am']], ['We see the moon at ___.', 'night', ['noon', 'breakfast']], ['There ___ three books on the desk.', 'are', ['is', 'am']], ['Yesterday I ___ to the market.', 'went', ['go', 'goes']], ['He has ___ umbrella.', 'an', ['two', 'many']], ['The baby ___ a lot.', 'sleeps', ['sleep', 'sleeping']], ['My brother is ___ than me.', 'taller', ['tall', 'tallest']]],
    bm: [['Saya makan ___.', 'nasi', ['kasut', 'buku']], ['Kucing minum ___.', 'susu', ['batu', 'kerusi']], ['Ibu memasak di ___.', 'dapur', ['padang', 'sekolah']], ['Ali membaca ___.', 'buku', ['nasi', 'air']], ['Ikan boleh ___.', 'berenang', ['terbang', 'menyanyi']], ['Adik pergi ke ___ dengan bas.', 'sekolah', ['dapur', 'sungai']], ['Hari ini cuaca ___.', 'panas', ['pensel', 'kereta']], ['Dia ___ bola di padang.', 'menendang', ['meminum', 'menulis']], ['Kami ___ lagu Negaraku.', 'menyanyikan', ['memakan', 'memotong']], ['Burung hinggap di ___ pokok.', 'atas', ['bawah', 'dalam']], ['Ayah memandu ___ ke pejabat.', 'kereta', ['kasut', 'pensel']], ['Langit pada waktu malam ___.', 'gelap', ['terang', 'manis']]],
    sc: [[['Plants need ___ to grow.', 'Tumbuhan perlukan ___ untuk membesar.'], ['water', 'air'], [['stones', 'toys'], ['batu', 'mainan']]], [['Ice melts when it is ___.', 'Ais mencair apabila ___.'], ['warm', 'panas'], [['cold', 'frozen'], ['sejuk', 'beku']]], [['We use our ___ to see.', 'Kita guna ___ untuk melihat.'], ['eyes', 'mata'], [['ears', 'hands'], ['telinga', 'tangan']]], [['A magnet pulls ___.', 'Magnet menarik ___.'], ['iron', 'besi'], [['wood', 'paper'], ['kayu', 'kertas']]], [['Fish live in ___.', 'Ikan hidup di dalam ___.'], ['water', 'air'], [['trees', 'sand'], ['pokok', 'pasir']]], [['The sun gives us light and ___.', 'Matahari memberi kita cahaya dan ___.'], ['heat', 'haba'], [['ice', 'snow'], ['ais', 'salji']]], [['We hear with our ___.', 'Kita mendengar dengan ___.'], ['ears', 'telinga'], [['eyes', 'nose'], ['mata', 'hidung']]], [['When it rains, the ground gets ___.', 'Apabila hujan, tanah menjadi ___.'], ['wet', 'basah'], [['dry', 'hot'], ['kering', 'panas']]]],
    pm: [[['I say “___” when someone helps me.', 'Saya sebut “___” apabila ada orang menolong saya.'], ['thank you', 'terima kasih'], [['go away', 'be quiet'], ['pergi', 'diam']]], [['I say “___” when I make a mistake.', 'Saya sebut “___” apabila saya membuat silap.'], ['sorry', 'maaf'], [['hurry', 'no'], ['cepat', 'tidak']]], [['We ___ our toys with friends.', 'Kita ___ mainan dengan kawan.'], ['share', 'berkongsi'], [['hide', 'break'], ['sorokkan', 'patahkan']]]]
  };
  function eqFill(band, small) {
    const f = Math.random(); let a, b, c, shape;
    if (band === 1) { c = rnd(3, 10); a = rnd(1, c - 1); b = c - a; shape = f < .5 ? 'p1' : 'p2'; }
    else if (band === 2) { if (f < .6) { c = rnd(6, 20); a = rnd(1, c - 1); b = c - a; shape = pick(['p1', 'p2']); } else { a = rnd(6, 20); b = rnd(1, a - 1); c = a - b; shape = 's2'; } }
    else if (band === 3) { if (f < .5) { a = rnd(2, 5); b = rnd(2, 10); c = a * b; shape = 'm1'; } else { b = rnd(10, 60); c = rnd(5, 40); a = b + c; shape = 's1'; } }
    else { if (f < .5) { a = rnd(3, 12); b = rnd(3, 12); c = a * b; shape = 'm1'; } else if (f < .8) { b = rnd(10, 400); c = rnd(10, 400); a = b + c; shape = 'p1'; } else { b = rnd(2, 9); c = rnd(2, 12); a = b * c; shape = 'd1'; } }
    /* p1: a + _ = (a+b)  p2: _ + b = (a+b)  s1: _ − b = c with the answer a  s2: a − _ = c  m1: a × _ = c  d1: a ÷ _ = c */
    let eq, ans;
    if (shape === 'p1') { eq = [`${a} +`, `= ${a + b}`]; ans = b; } else if (shape === 'p2') { eq = ['', `+ ${b} = ${a + b}`]; ans = a; }
    else if (shape === 's1') { eq = ['', `− ${b} = ${c}`]; ans = a; } else if (shape === 's2') { eq = [`${a} −`, `= ${c}`]; ans = b; }
    else if (shape === 'm1') { eq = [`${a} ×`, `= ${c}`]; ans = b; } else { eq = [`${a} ÷`, `= ${c}`]; ans = b; }
    const decoys = new Set(); const span = band >= 3 ? 6 : 3;
    while (decoys.size < (band >= 3 && !small ? 3 : 2)) { const d = ans + pick([-3, -2, -1, 1, 2, 3, span]); if (d > 0 && d !== ans) decoys.add(d); }
    return { eq, ans, opts: shuffle([ans, ...decoys]).map(String) };
  }
  function fillQ(subj, band, small, spec) {   // v36: spec = a ready sentence from a fact table (content/facts.js)
    let before = '', after = '', ans, opts, em = '🧩', text, sentence;
    if (spec) {
      before = spec.before; after = spec.after; ans = spec.ans; opts = shuffle(spec.opts.slice()); em = spec.em || em;
      sentence = `${before} ? ${after}`.trim(); text = spec.text || T('Drag the missing word into the sentence.', 'Seret perkataan yang hilang ke dalam ayat.');
    } else if (subj === 'math') {
      const f = eqFill(band, small); before = f.eq[0]; after = f.eq[1]; ans = String(f.ans); opts = f.opts; em = '➕';
      sentence = `${before} ? ${after}`.trim(); text = T('Drag the missing number into the gap.', 'Seret nombor yang hilang ke tempat kosong.');
    } else {
      let row;
      if (subj === 'en' || subj === 'bm') { if (band < 2) return null; row = pick(CLOZE[subj]); var s0 = row[0], a0 = row[1], d0 = row[2]; }
      else if (subj === 'sc' || subj === 'pm') { if (band < 2 && subj === 'pm') return null; const r = pick(CLOZE[subj]); s0 = r[0][L()]; a0 = r[1][L()]; d0 = r[2][L()]; }
      else return null;
      const parts = s0.split('___'); before = parts[0].trim(); after = (parts[1] || '').trim(); ans = a0; opts = shuffle([a0, ...d0]);
      sentence = s0.replace('___', '?'); text = T('Drag the missing word into the sentence.', 'Seret perkataan yang hilang ke dalam ayat.');
      em = subj === 'sc' ? '🔬' : '🧩';
    }
    return mk(subj, 'fill', {
      text, reviewText: sentence, key: sentence + '|' + opts.join(','), ansText: ans, verify: x => String(x) === String(ans), why: t('wx.why.fill', { a: ans }),
      steps: K.steps(T('Read the whole line first.', 'Baca seluruh baris dahulu.'), T('Try each piece in the gap.', 'Cuba setiap kepingan di tempat kosong.'), T(`The answer is ${ans}.`, `Jawapannya ${ans}.`)),
      speak: [[`${text} ${sentence.replace('?', T('blank', 'kosong'))}`, K.lc(subj)]], viz: () => `<div class="clue big" aria-hidden="true">${em}</div>`,
      mount(host, H) {
        let done = false; const wrong = new Set();
        host.innerHTML = `<div class="nq nq-fill"><div class="fl-line" role="group" aria-label="${esc(sentence)}">${before ? `<span>${esc(before)}</span>` : ''}<button class="fl-gap" data-gap type="button" aria-label="${esc(T('gap', 'tempat kosong'))}">?</button>${after ? `<span>${esc(after)}</span>` : ''}</div>
          <div class="fl-tray">${opts.map((o, i) => `<button class="fl-tile" data-i="${i}" type="button">${esc(o)}</button>`).join('')}</div></div>`;
        const root = host.querySelector('.nq'), gap = root.querySelector('.fl-gap');
        const tryIt = (tile) => {
          if (done || H.locked() || !H.still()) return; const v = opts[+tile.dataset.i];
          if (this_q.verify(v)) { done = true; gap.textContent = v; gap.classList.add('ok'); tile.classList.add('used'); sfx.ok(); H.ok(); }
          else { wrong.add(+tile.dataset.i); tile.classList.add('nope'); setTimeout(() => tile.classList.remove('nope'), 450); this_q.refresh(); H.miss(); }
        };
        const this_q = this;
        K.drag(root, '.fl-tile', '.fl-gap', (tile) => tryIt(tile), () => !done && !H.locked() && H.still());
        this.refresh = () => { root.querySelectorAll('.fl-tile').forEach(b => { b.classList.toggle('soft', wrong.has(+b.dataset.i)); b.classList.toggle('hl', H.tier() >= 1 && !done && opts[+b.dataset.i] === ans); }); };
        this.refresh();
      }
    });
  }

  /* ---------------- 3. sort into boxes ---------------- */
  const grp = g => ({ label: [QT.cap(QT.FP[g]), QT.cap(QT.F[g][1])], items: QT.G[g] });
  const NV = { n: [['🐱', 'cat', 'kucing'], ['📖', 'book', 'buku'], ['🏠', 'house', 'rumah'], ['🚗', 'car', 'kereta'], ['⚽', 'ball', 'bola'], ['🌳', 'tree', 'pokok']], v: [['🏃', 'run', 'lari'], ['😴', 'sleep', 'tidur'], ['🍽️', 'eat', 'makan'], ['🎤', 'sing', 'nyanyi'], ['📚', 'read', 'baca'], ['🦘', 'jump', 'lompat']] };
  const SL = { s: [['🪨', 'stone', 'batu'], ['📖', 'book', 'buku'], ['🪵', 'wood', 'kayu'], ['🧱', 'brick', 'bata'], ['✏️', 'pencil', 'pensel']], l: [['💧', 'water', 'air'], ['🥛', 'milk', 'susu'], ['🧃', 'juice', 'jus'], ['🛢️', 'oil', 'minyak'], ['☕', 'tea', 'teh']] };
  function bucketSet(subj, band) {
    const pool = [];
    const G2 = (a, b, c) => ({ boxes: [grp(a), grp(b), ...(c ? [grp(c)] : [])] });
    if (subj === 'sc') { pool.push(G2('living', 'nonliving')); if (band >= 2) pool.push({ boxes: [{ label: ['Solid', 'Pepejal'], items: SL.s }, { label: ['Liquid', 'Cecair'], items: SL.l }] }); }
    if (subj === 'fk') pool.push(G2('healthy', 'treat'));
    if (subj === 'pm') pool.push(G2('kind', 'unkind'));
    if (subj === 'se') pool.push(G2('happy', 'sad'));
    if (subj === 'sv') pool.push(G2('warm', 'cool'));
    if (subj === 'mz') pool.push(G2('instrument', 'animal', band >= 3 ? 'fruit' : null));
    if (subj === 'pk') pool.push(G2('my', 'abroad'));   // v36: from age 4 too (the audit grid showed Citizenship with only 4 formats at age 4)
    if (subj === 'bm' || subj === 'en') {
      pool.push(G2('fruit', 'animal', band >= 3 ? 'vehicle' : null), G2('clothes', 'school', band >= 3 ? 'sky' : null));
      if (band >= 2) pool.push({ boxes: [{ label: ['Naming words (nouns)', 'Kata nama'], items: NV.n }, { label: ['Doing words (verbs)', 'Kata kerja'], items: NV.v }] });
    }
    if (subj === 'math' && band >= 2) {
      pool.push({ nums: 'eo', boxes: [{ label: ['Even', 'Genap'] }, { label: ['Odd', 'Ganjil'] }] });
      if (band >= 3) pool.push({ nums: 'lt', boxes: [{ label: ['Less than 50', 'Kurang daripada 50'] }, { label: ['50 or more', '50 atau lebih'] }] });
    }
    return pool.length ? pick(pool) : null;
  }
  function bucketQ(subj, band, small, spec) {   // v36: spec = { boxes, per } from a fact table
    const set = spec || bucketSet(subj, band); if (!set) return null;
    const nb = set.boxes.length, per = set.per || (small || band <= 2 ? 2 : nb === 3 ? 2 : 3), li = sl(subj);
    const items = [];
    set.boxes.forEach((bx, bi) => {
      if (set.nums) {
        const hi = band <= 2 ? 20 : band === 3 ? 99 : 200, seen = new Set(items.map(x => x.w));
        while (items.filter(x => x.b === bi).length < per) {
          const n = rnd(1, hi); if (seen.has(String(n))) continue;
          const okBox = set.nums === 'eo' ? (n % 2 === 0 ? 0 : 1) : (n < 50 ? 0 : 1); if (okBox !== bi) continue; seen.add(String(n)); items.push({ e: '', w: String(n), b: bi });
        }
      } else shuffle(bx.items).slice(0, per).forEach(it => items.push({ e: it[0], w: cap(it[1 + li]), b: bi }));
    });
    const dup = new Set(items.map(x => x.w)); if (dup.size !== items.length) return null;
    const order = shuffle(items.map((_, i) => i)), labels = set.boxes.map(b => b.label[L()]);
    const text = T('Drag each one into the right box.', 'Seret setiap satu ke kotak yang betul.');
    return mk(subj, 'bucket', {
      text, reviewText: `${text} ${labels.join(' / ')}: ${items.map(x => x.w).join(', ')}`, key: labels.join('|') + ':' + items.map(x => x.w).sort().join(','), ansText: labels.map((l, bi) => `${l}: ${items.filter(x => x.b === bi).map(x => x.w).join(', ')}`).join(' · '),
      items, labels, verify: (i, b) => items[i] && items[i].b === b, why: '',
      steps: K.steps(T('Look at the names on the boxes.', 'Lihat nama pada kotak.'), T('Pick one thing and ask: which box?', 'Pilih satu benda dan tanya: kotak yang mana?')),
      speak: [[`${text} ${labels.join(', ')}.`]], viz: () => `<div class="clue big" aria-hidden="true">🧺</div>`,
      mount(host, H) {
        const placed = new Set(); const this_q = this;
        host.innerHTML = `<div class="nq nq-bk"><div class="bk-boxes bk-${nb}">${labels.map((l, bi) => `<div class="bk-box" data-b="${bi}" role="group" aria-label="${esc(l)}"><b>${esc(l)}</b><div class="bk-in"></div></div>`).join('')}</div>
          <div class="bk-tray">${order.map(i => `<button class="bk-tile" data-i="${i}" type="button">${items[i].e ? `<i>${items[i].e}</i>` : ''}<span>${esc(items[i].w)}</span></button>`).join('')}</div></div>`;
        const root = host.querySelector('.nq');
        K.drag(root, '.bk-tile:not(.in)', '.bk-box', (tile, box) => {
          if (H.locked() || !H.still()) return; const i = +tile.dataset.i, bi = +box.dataset.b;
          if (this_q.verify(i, bi)) {
            placed.add(i); tile.classList.add('in'); box.querySelector('.bk-in').appendChild(tile); sfx.ok(); this_q.refresh();
            if (placed.size === items.length) H.ok();
          } else { tile.classList.add('nope'); box.classList.add('nope'); setTimeout(() => { tile.classList.remove('nope'); box.classList.remove('nope'); }, 450); H.miss(); }
        }, () => !H.locked() && H.still());
        this.refresh = () => {
          root.querySelectorAll('.bk-tile').forEach(x => x.classList.remove('hl')); root.querySelectorAll('.bk-box').forEach(x => x.classList.remove('hl'));
          if (H.tier() < 1) return; const first = root.querySelector('.bk-tray .bk-tile:not(.in)'); if (!first) return;
          first.classList.add('hl'); const bx = root.querySelector(`.bk-box[data-b="${items[+first.dataset.i].b}"]`); if (bx) bx.classList.add('hl');
        };
        this.refresh();
      }
    });
  }

  /* ---------------- 4. build the sentence (the order widget) ---------------- */
  const SENT = {
    en: ['I like red apples', 'The cat is big', 'We play in the park', 'Birds can fly high', 'She eats rice every day', 'Dogs run very fast', 'My mother cooks dinner', 'He rides a red bicycle', 'The sun is hot today', 'Fish swim in the sea', 'Our school has a big field', 'Ali reads a new book', 'The moon shines at night', 'I wash my hands before eating', 'Rain falls from the grey clouds', 'Mei Ling draws a happy face'],
    bm: ['Saya suka makan nasi', 'Ibu memasak di dapur', 'Kucing itu sangat comel', 'Kami pergi ke sekolah', 'Ali membaca buku baru', 'Burung terbang di langit biru', 'Adik minum susu setiap pagi', 'Ayah memandu kereta merah', 'Matahari bersinar terang hari ini', 'Ikan berenang dalam laut', 'Kami bermain bola di padang', 'Nenek menanam bunga di halaman rumah', 'Saya mencuci tangan sebelum makan', 'Hujan turun dari awan kelabu'],
    any: [['We say thank you', 'Kami ucap terima kasih'], ['Plants need water and light', 'Tumbuhan perlukan air dan cahaya'], ['I wash my hands', 'Saya mencuci tangan'], ['Malaysia is my country', 'Malaysia ialah negara saya'], ['I love my mum and dad', 'Saya sayang ibu dan ayah'], ['Eat fruit and drink water', 'Makan buah dan minum air'], ['Be kind to your friends', 'Berbuat baik kepada kawan'], ['Wake up and brush your teeth', 'Bangun dan gosok gigi'], ['Look both ways before crossing', 'Lihat kiri dan kanan sebelum melintas']]
  };
  function sentQ(subj, band, small) {
    if (band < 2) return null;
    const list = subj === 'en' ? SENT.en : subj === 'bm' ? SENT.bm : ['sc', 'pm', 'pk', 'se', 'fk'].includes(subj) ? SENT.any.map(p => p[L()]) : null; if (!list) return null;
    const max = small ? 4 : band === 2 ? 4 : band === 3 ? 5 : 6;
    const fit = list.filter(s => { const w = s.split(' '); return w.length <= max && w.length >= Math.min(3, max) && new Set(w.map(x => x.toLowerCase())).size === w.length; });
    if (!fit.length) return null;
    const best = fit.filter(s => s.split(' ').length >= max - 1), s0 = pick(best.length ? best : fit), words = s0.split(' ');
    const items = words.map(w => ({ e: '', w })); let tray; do { tray = shuffle(items.map((_, i) => i)); } while (items.length > 1 && tray.every((v, i) => v === i));
    const text = T('Put the words in order to make a sentence.', 'Susun perkataan untuk membina ayat.');
    const q = QT.base(subj, 'order', { text, reviewText: `${text} ${shuffle(words).join(' · ')}`, items, tray, placed: [], options: words, correct: -1, key: 'sent:' + s0, memKey: 'sent:' + s0, ansText: s0, speak: [[`${text} ${shuffle(words).join(', ')}.`, K.lc(subj)]], viz: () => `<div class="clue big" aria-hidden="true">🧱</div>` });
    q.topic = subj + '_sent'; q.tag = t('wx.tag.sent'); q.sentence = s0; q.verify = arr => arr.join(' ') === s0; return q;
  }

  /* ---------------- 5. spot the mistake ---------------- */
  const SP_EN = [['The cats are sleeping.', 'The cats is sleeping.'], ['She goes to school.', 'She go to school.'], ['I have two eyes.', 'I has two eyes.'], ['He is my friend.', 'He are my friend.'], ['We eat rice.', 'We eats rice.'], ['They play football.', 'They plays football.'], ['The bird can fly.', 'The bird can flys.'], ['My mother is kind.', 'My mother are kind.']];
  const SP_BM = [['Kucing itu comel.', 'Kucing itu comil.'], ['Ibu pergi ke pasar.', 'Ibu pergi ke pasa.'], ['Ali membaca buku.', 'Ali membaca bukuu.'], ['Kami suka bermain bola.', 'Kami suka bermain bolla.'], ['Adik minum susu.', 'Adik minum suzu.'], ['Ayah makan nasi.', 'Ayah makan nassi.'], ['Saya ke sekolah.', 'Saya ke sekola.']];
  const mnum = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  function spotLines(subj, band) {
    if (subj === 'math') {
      if (band < 2) return null;
      const f = Math.random(); let a, b, c, o1, d, e, o2;
      if (band === 2) { a = rnd(3, 12); b = rnd(2, 9); o1 = '+'; c = a + b; d = rnd(1, c - 1); o2 = '−'; e = c - d; }
      else if (band === 3) { if (f < .5) { a = rnd(2, 9); b = rnd(2, 6); o1 = '×'; c = a * b; d = rnd(2, 9); o2 = '+'; e = c + d; } else { a = rnd(15, 60); b = rnd(5, 30); o1 = '+'; c = a + b; d = rnd(2, 20); o2 = '−'; e = c - d; } }
      else { if (f < .5) { a = rnd(30, 400); b = rnd(20, 300); o1 = '+'; c = a + b; d = rnd(10, Math.min(150, c - 1)); o2 = '−'; e = c - d; } else { a = rnd(3, 12); b = rnd(3, 12); o1 = '×'; c = a * b; d = rnd(5, 60); o2 = '+'; e = c + d; } }
      const bad = rnd(0, 2), big = band >= 4 && Math.random() < .5, dl = () => pick(big ? [-10, 10, -100, 100] : [-2, -1, 1, 2]);
      const sum = (x, o, y) => (o === '+' ? x + y : o === '−' ? x - y : x * y);
      let c2 = c, e2 = e;
      if (bad === 0) { do { c2 = c + dl(); } while (c2 === c || c2 < 1 || (o2 === '−' && c2 - d < 0)); e2 = sum(c2, o2, d); } else if (bad === 1) { do { e2 = e + dl(); } while (e2 === e || e2 < 0); } else { do { e2 = e + dl(); } while (e2 === e || e2 < 0); }
      const l = [`${mnum(a)} ${o1} ${mnum(b)} = ${mnum(c2)}`, `${mnum(c2)} ${o2} ${mnum(d)} = ${mnum(bad === 1 ? e2 : bad === 0 ? e2 : e)}`, T(`So the answer is ${mnum(bad === 2 ? e2 : bad === 1 ? e2 : bad === 0 ? e2 : e)}.`, `Jadi jawapannya ${mnum(bad === 2 ? e2 : bad === 1 ? e2 : bad === 0 ? e2 : e)}.`)];
      const good = [`${mnum(a)} ${o1} ${mnum(b)} = ${mnum(c)}`, `${mnum(c)} ${o2} ${mnum(d)} = ${mnum(e)}`, T(`So the answer is ${mnum(e)}.`, `Jadi jawapannya ${mnum(e)}.`)];
      return { lines: l, bad, fix: good[bad], ask: T('Tap the line with the mistake.', 'Sentuh baris yang ada kesilapan.'), em: '🔍' };
    }
    if (band < 2) return null;
    if (subj === 'en' || subj === 'bm') {
      const bank = subj === 'en' ? SP_EN : SP_BM, p = shuffle(bank), badPair = p[0], goods = p.slice(1, 3).map(x => x[0]);
      const lines = shuffle([{ s: badPair[1], bad: true }, ...goods.map(s => ({ s, bad: false }))]);
      return { lines: lines.map(x => x.s), bad: lines.findIndex(x => x.bad), fix: badPair[0], ask: T('Tap the sentence with the mistake.', 'Sentuh ayat yang ada kesilapan.'), em: '🔍' };
    }
    if (['sc', 'fk', 'pm', 'se', 'pk'].includes(subj) && band >= 3) {
      const all = (QT.TF[subj] || []), tr = shuffle(all.filter(x => x[3])), fa = shuffle(all.filter(x => !x[3])); if (tr.length < 2 || !fa.length) return null;
      const lines = shuffle([{ s: fa[0][1 + L()], bad: true, ok: fa[0] }, { s: tr[0][1 + L()], bad: false }, { s: tr[1][1 + L()], bad: false }]);
      return { lines: lines.map(x => x.s), bad: lines.findIndex(x => x.bad), fix: T('This is not true.', 'Ini tidak benar.'), ask: T('Tap the line that is NOT true.', 'Sentuh baris yang TIDAK benar.'), em: '🔍' };
    }
    return null;
  }
  function spotQ(subj, band) {
    const d = spotLines(subj, band); if (!d) return null;
    return mk(subj, 'spot', {
      text: d.ask, reviewText: d.ask + ' ' + d.lines.join(' / '), key: d.lines.join('|'), ansText: d.lines[d.bad], lines: d.lines, bad: d.bad, verify: i => i === d.bad, why: t('wx.why.spot', { g: d.fix }),
      steps: K.steps(T('Read each line slowly.', 'Baca setiap baris perlahan-lahan.'), T('Check each one, one at a time.', 'Semak satu demi satu.')),
      speak: [[d.ask + ' ' + d.lines.join('. '), K.lc(subj)]], viz: () => `<div class="clue big" aria-hidden="true">${d.em}</div>`,
      mount(host, H) {
        let done = false; const wrong = new Set(); const this_q = this;
        host.innerHTML = `<div class="nq nq-spot" role="list">${d.lines.map((l, i) => `<button class="sp-line" role="listitem" data-i="${i}" type="button"><em>${i + 1}</em><span>${esc(l)}</span></button>`).join('')}</div>`;
        const root = host.querySelector('.nq');
        root.addEventListener('click', e => {
          const b = e.target.closest('.sp-line'); if (!b || done || H.locked() || !H.still() || b.classList.contains('soft')) return; const i = +b.dataset.i;
          if (this_q.verify(i)) { done = true; b.classList.add('ok'); sfx.ok(); H.ok(); } else { wrong.add(i); b.classList.add('nope'); H.miss(); this_q.refresh(); setTimeout(() => b.classList.remove('nope'), 450); }
        });
        this.refresh = () => { root.querySelectorAll('.sp-line').forEach(b => { const i = +b.dataset.i; b.classList.toggle('soft', wrong.has(i)); b.disabled = wrong.has(i); b.classList.toggle('hl', H.tier() >= 2 && !done && i === d.bad); }); };
        this.refresh();
      }
    });
  }

  K.gens.numline = numlineQ; K.gens.fill = fillQ; K.gens.bucket = bucketQ; K.gens.sent = sentQ; K.gens.spot = spotQ;
  K.weights.numline = (s) => (s === 'math' ? 3 : 0);
  K.weights.fill = (s, b) => (s === 'math' ? 3 : (s === 'en' || s === 'bm') && b >= 2 ? 3 : s === 'sc' && b >= 2 ? 2 : s === 'pm' && b >= 2 ? 1 : 0);
  K.weights.bucket = (s, b) => (s === 'math' ? (b >= 2 ? 2 : 0) : ['sc', 'fk', 'pm', 'se', 'sv', 'bm', 'en'].includes(s) ? 2 : s === 'mz' ? 1 : s === 'pk' ? 1 : 0);
  K.weights.sent = (s, b) => ((s === 'en' || s === 'bm') && b >= 2 ? 3 : ['sc', 'pm', 'pk', 'se', 'fk'].includes(s) && b >= 3 ? 1 : 0);
  K.weights.spot = (s, b) => ((s === 'math' || s === 'en' || s === 'bm') && b >= 2 ? 2 : ['sc', 'fk', 'pm', 'se', 'pk'].includes(s) && b >= 3 ? 1 : 0);
  K.fillQ = fillQ; K.bucketQ = bucketQ;   // v36: the fact tables build their fill and sort questions with these
  K.nlCfg = nlCfg; K.CLOZE = CLOZE; K.SENT = SENT; K.SP_EN = SP_EN; K.SP_BM = SP_BM;
}
