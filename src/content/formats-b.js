/* v35 formats 6 to 9: clock hands, pay with coins, listen-and-tap pictures, two-step problems */
export function partB(K) {
  const { C, T, sl, cap, mk } = K, { t, L, pick, shuffle, rnd, esc, sfx, QT } = C;
  const pad2 = n => String(n).padStart(2, '0');

  /* ---------------- 6a. clock ---------------- */
  function clockQ(subj, band, small) {
    if (subj !== 'math') return null;
    const h = rnd(1, 12);
    let m = 0;
    if (band === 2 || small) m = pick([0, 0, 30]);
    else if (band === 3) m = pick([0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55].slice(0, Math.random() < .6 ? 4 : 12));
    else if (band >= 4) m = rnd(0, 11) * 5;
    const dig = `${h}:${pad2(m)}`;
    const wordsEN = m === 0 ? `${h} o’clock` : m === 30 ? `half past ${h}` : m === 15 ? `quarter past ${h}` : m === 45 ? `quarter to ${h % 12 + 1}` : '';
    const label = band === 1 ? T(`${h} o’clock`, `pukul ${h}`) : T(wordsEN ? `${wordsEN} (${dig})` : dig, `pukul ${dig}`);
    const text = T(`Move the hands to show ${label}.`, `Gerakkan jarum untuk menunjukkan ${label}.`);
    const start = h === 12 && m === 0 ? { h: 6, m: 0 } : { h: 12, m: 0 };
    return mk(subj, 'clock', {
      text, reviewText: text, key: dig + ':' + band, ansText: dig, target: { h, m }, timeMul: 2, verify: v => v.h === h && v.m === m, why: t('wx.why.clock'),
      steps: K.steps(T('The short hand tells the hour.', 'Jarum pendek menunjukkan jam.'), T('The long hand tells the minutes.', 'Jarum panjang menunjukkan minit.'), T(`Show ${dig}.`, `Tunjukkan ${dig}.`)),
      speak: [[text]], viz: () => `<div class="clue big nq-big" aria-hidden="true">${esc(band === 1 ? `${h}:00` : dig)}</div>`,
      mount(host, H) {
        let cur = { ...start }, done = false; const this_q = this;
        const nums = Array.from({ length: 12 }, (_, i) => { const a = (i + 1) * 30 * Math.PI / 180; return `<text x="${(100 + 74 * Math.sin(a)).toFixed(1)}" y="${(100 - 74 * Math.cos(a) + 5).toFixed(1)}" text-anchor="middle" class="ck-n">${i + 1}</text>`; }).join('');
        const ticks = Array.from({ length: 60 }, (_, i) => { const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 90 : 86; return `<line x1="${(100 + r1 * Math.sin(a)).toFixed(1)}" y1="${(100 - r1 * Math.cos(a)).toFixed(1)}" x2="${(100 + 92 * Math.sin(a)).toFixed(1)}" y2="${(100 - 92 * Math.cos(a)).toFixed(1)}" class="ck-t ${i % 5 ? '' : 'b'}"/>`; }).join('');
        host.innerHTML = `<div class="nq nq-clock"><svg viewBox="0 0 200 200" class="ck-face" role="img" aria-label="${esc(text)}"><circle cx="100" cy="100" r="96" class="ck-bg"/>${ticks}${nums}
          <line class="ck-h" x1="100" y1="100" x2="100" y2="52"/><line class="ck-m" x1="100" y1="100" x2="100" y2="26"/><circle class="ck-hh" cx="100" cy="52" r="10"/><circle class="ck-mh" cx="100" cy="26" r="10"/><circle cx="100" cy="100" r="5" class="ck-c"/></svg>
          <div class="ck-read" aria-live="polite">${cur.h}:${pad2(cur.m)}</div>
          <div class="ck-steps"><button class="chip" data-w="h-" type="button" aria-label="${esc(T('hour back', 'jam undur'))}">− ${T('hour', 'jam')}</button><button class="chip" data-w="h+" type="button" aria-label="${esc(T('hour forward', 'jam maju'))}">+ ${T('hour', 'jam')}</button><button class="chip" data-w="m-" type="button" aria-label="${esc(T('minutes back', 'minit undur'))}">− ${T('min', 'min')}</button><button class="chip" data-w="m+" type="button" aria-label="${esc(T('minutes forward', 'minit maju'))}">+ ${T('min', 'min')}</button></div>
          <div class="nq-acts"><button class="btn" data-wx="go">${t('wx.check')}</button></div></div>`;
        const root = host.querySelector('.nq'), svg = root.querySelector('svg'), hh = svg.querySelector('.ck-h'), mh = svg.querySelector('.ck-m'), hd = svg.querySelector('.ck-hh'), md = svg.querySelector('.ck-mh'), read = root.querySelector('.ck-read');
        const setHand = (ln, dot, ang, len) => { const a = ang * Math.PI / 180, x = 100 + len * Math.sin(a), y = 100 - len * Math.cos(a); ln.setAttribute('x2', x.toFixed(1)); ln.setAttribute('y2', y.toFixed(1)); dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1)); };
        const draw = () => { setHand(hh, hd, (cur.h % 12) * 30 + cur.m * .5, 48); setHand(mh, md, cur.m * 6, 74); read.textContent = `${cur.h}:${pad2(cur.m)}`; };
        const point = e => { const b = svg.getBoundingClientRect(), k = 200 / (b.width || 200); return { x: (e.clientX - b.left) * k - 100, y: (e.clientY - b.top) * k - 100 }; };
        let hand = null;
        const aim = e => {
          const p = point(e), ang = (Math.atan2(p.x, -p.y) * 180 / Math.PI + 360) % 360;
          if (hand === 'm') cur.m = Math.round(ang / 30) * 5 % 60;
          else { const base = ((ang - cur.m * .5) % 360 + 360) % 360; cur.h = Math.round(base / 30) % 12 || 12; }
          draw();
        };
        svg.addEventListener('pointerdown', e => {
          if (done || H.locked() || !H.still()) return; const p = point(e), d = Math.hypot(p.x, p.y); if (d < 12) return;
          hand = d < 56 ? 'h' : 'm'; try { svg.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } aim(e); sfx.pop();
        });
        svg.addEventListener('pointermove', e => { if (hand) aim(e); });
        const end = () => { hand = null; }; svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
        root.querySelector('.ck-steps').addEventListener('click', e => {
          const b = e.target.closest('[data-w]'); if (!b || done || H.locked() || !H.still()) return; const w = b.dataset.w;
          if (w === 'h+') cur.h = cur.h % 12 + 1; else if (w === 'h-') cur.h = (cur.h + 10) % 12 + 1; else if (w === 'm+') cur.m = (cur.m + 5) % 60; else cur.m = (cur.m + 55) % 60;
          draw(); sfx.pop();
        });
        root.querySelector('[data-wx="go"]').addEventListener('click', () => {
          if (done || H.locked() || !H.still()) return;
          if (this_q.verify(cur)) { done = true; root.classList.add('good'); H.ok(); } else { root.classList.add('bad'); setTimeout(() => root.classList.remove('bad'), 450); H.miss(); this_q.refresh(); }
        });
        this.refresh = () => { svg.classList.toggle('hint', H.tier() >= 1 && !done); };
        draw();
      }
    });
  }

  /* ---------------- 6b. money (pasar malam) ---------------- */
  const COIN = { 5: ['5 sen', 'coin'], 10: ['10 sen', 'coin'], 20: ['20 sen', 'coin'], 50: ['50 sen', 'coin'], 100: ['RM 1', 'note'], 500: ['RM 5', 'note'], 1000: ['RM 10', 'note'] };
  const FOOD = [['🍢', 'a satay stick', 'sate'], ['🧋', 'a teh tarik', 'teh tarik'], ['🥞', 'an apam balik', 'apam balik'], ['🍌', 'banana fritters', 'pisang goreng'], ['🌽', 'sweet corn', 'jagung manis'], ['🍡', 'a sweet dango', 'dango manis'], ['🥤', 'a cold drink', 'minuman sejuk'], ['🍉', 'a watermelon slice', 'sepotong tembikai']];
  function moneyQ(subj, band, small) {
    if (subj !== 'math') return null;
    let coins, target;
    if (band === 1) { coins = [100]; target = rnd(2, 4) * 100; }
    else if (band === 2 || small) { coins = [10, 20, 50]; target = rnd(2, 9) * 10; }
    else if (band === 3) { coins = [10, 20, 50, 100]; target = rnd(6, 50) * 10; }
    else { coins = [5, 10, 20, 50, 100, 500, 1000]; target = rnd(23, 300) * 5; }
    const f = pick(FOOD), price = K.money(target);
    const text = T(`${f[0]} ${cap(f[1])} costs ${price}. Tap coins to pay exactly.`, `${f[0]} ${cap(f[2])} berharga ${price}. Sentuh syiling untuk membayar tepat.`);
    return mk(subj, 'money', {
      text, reviewText: text, key: target + ':' + coins.join(','), ansText: price, coins, target, timeMul: 1.8, verify: list => list.reduce((a, b) => a + b, 0) === target, why: t('wx.why.pay', { v: price }),
      steps: K.steps(T('Pick the biggest coin that is not too much.', 'Pilih syiling terbesar yang tidak terlebih.'), T('Keep adding until you reach the price.', 'Teruskan menambah sehingga mencapai harga.')),
      speak: [[text]], viz: () => `<div class="clue big" aria-hidden="true">${f[0]}</div>`,
      mount(host, H) {
        const dish = []; let done = false; const this_q = this;
        host.innerHTML = `<div class="nq nq-money"><div class="mn-tag"><b>${esc(price)}</b></div><div class="mn-dish" role="group" aria-label="${esc(T('Your payment', 'Bayaran kamu'))}"></div><div class="mn-sum" aria-live="polite"></div>
          <div class="mn-tray">${coins.map(c => `<button class="mn-coin ${COIN[c][1]}" data-c="${c}" type="button" aria-label="${esc(COIN[c][0])}"><span>${esc(COIN[c][0])}</span></button>`).join('')}</div></div>`;
        const root = host.querySelector('.nq'), dishEl = root.querySelector('.mn-dish'), sum = root.querySelector('.mn-sum');
        const total = () => dish.reduce((a, b) => a + b, 0);
        const draw = () => { dishEl.innerHTML = dish.map((c, i) => `<button class="mn-coin ${COIN[c][1]} in" data-i="${i}" type="button" aria-label="${esc(T('take back ', 'ambil semula ') + COIN[c][0])}"><span>${esc(COIN[c][0])}</span></button>`).join('') || `<small>${esc(T('Tap coins below', 'Sentuh syiling di bawah'))}</small>`; sum.textContent = total() ? `${t('wx.paid', { v: K.money(total()) })} · ${t('wx.need', { v: K.money(Math.max(0, target - total())) })}` : ''; };
        root.addEventListener('click', e => {
          if (done || H.locked() || !H.still()) return;
          const tr = e.target.closest('.mn-tray .mn-coin'), di = e.target.closest('.mn-dish .mn-coin');
          if (di) { dish.splice(+di.dataset.i, 1); draw(); sfx.pop(); return; }
          if (!tr) return; dish.push(+tr.dataset.c); sfx.pop(); draw();
          const s = total(); if (s < target) return;
          if (this_q.verify(dish)) { done = true; root.classList.add('good'); sfx.ok(); H.ok(); }
          else { sum.textContent = t('wx.over'); root.classList.add('bad'); H.miss(); setTimeout(() => { root.classList.remove('bad'); if (!done) { dish.length = 0; draw(); } }, 700); }
        });
        this.refresh = () => { };
        draw();
      }
    });
  }

  /* ---------------- 7. listen and tap the picture ---------------- */
  const NUMW = [['zero', 'kosong'], ['one', 'satu'], ['two', 'dua'], ['three', 'tiga'], ['four', 'empat'], ['five', 'lima'], ['six', 'enam'], ['seven', 'tujuh'], ['eight', 'lapan'], ['nine', 'sembilan'], ['ten', 'sepuluh']];
  const PICW = () => [...QT.G.fruit, ...QT.G.animal, ...QT.G.vehicle, ...QT.G.school, ...QT.G.clothes, ...QT.G.body, ...QT.G.sky];
  function picwordQ(subj, band) {
    if (band > 2 || !['en', 'bm', 'sc', 'sv', 'math', 'fk'].includes(subj)) return null;
    const li = sl(subj); let word, target, opts, shown;
    if (subj === 'math') {
      const hi = band === 1 ? 5 : 9, ns = shuffle(Array.from({ length: hi }, (_, i) => i + 1)).slice(0, 3), n = ns[0];
      word = NUMW[n][li]; opts = shuffle(ns.map(k => ({ e: '🍎'.repeat(k), k: String(k), name: String(k) }))); target = opts.findIndex(o => o.k === String(n)); shown = String(n);
    } else {
      let pool = PICW(); if (subj === 'sc') pool = [...QT.G.animal, ...QT.G.body, ...QT.G.sky]; if (subj === 'sv') pool = QT.G.fruit.concat(QT.G.sky, QT.G.clothes); if (subj === 'fk') pool = [...QT.G.body, ...QT.G.healthy];
      const three = shuffle(pool).filter((x, i, a) => a.findIndex(y => y[0] === x[0]) === i).slice(0, 3); const tg = three[0];
      word = tg[1 + li]; opts = shuffle(three.map(x => ({ e: x[0], k: x[0], name: x[1 + li] }))); target = opts.findIndex(o => o.k === tg[0]); shown = word;
    }
    const text = T('Listen! Tap the picture you hear.', 'Dengar! Sentuh gambar yang kamu dengar.');
    return mk(subj, 'picword', {
      text, reviewText: `${text} ${opts.map(o => o.e).join(' ')}`, key: word + ':' + opts.map(o => o.k).join(','), ansText: `${opts[target].e} ${shown}`, word, opts, target, verify: i => i === target, why: t('wx.why.pic', { a: word }),
      steps: K.steps(T(`The word is “${word}”.`, `Perkataannya “${word}”.`)), speak: [[text], [word, K.lc(subj)]], viz: () => `<div class="clue big" aria-hidden="true">👂</div>`,
      mount(host, H) {
        let done = false; const wrong = new Set(); const this_q = this;
        const canSpeak = (() => { try { return 'speechSynthesis' in window; } catch (e) { return false; } })();
        host.innerHTML = `<div class="nq nq-pic"><button class="btn big pw-say" type="button" aria-label="${esc(t('wx.listen'))}">${t('wx.listen')}</button><p class="pw-word" ${canSpeak ? 'hidden' : ''}>${esc(word)}</p>
          <div class="pw-opts">${opts.map((o, i) => `<button class="pw-pic ${[...o.e].length > 2 ? 'many' : ''}" data-i="${i}" type="button" aria-label="${esc(o.name)}"><span>${o.e}</span></button>`).join('')}</div></div>`;
        const root = host.querySelector('.nq'), say = () => { try { C.speakSeq([[word, K.lc(subj)]]); } catch (e) { /* no voice */ } };
        root.querySelector('.pw-say').addEventListener('click', say);
        root.addEventListener('click', e => {
          const b = e.target.closest('.pw-pic'); if (!b || done || H.locked() || !H.still() || b.disabled) return; const i = +b.dataset.i;
          if (this_q.verify(i)) { done = true; b.classList.add('ok'); sfx.ok(); H.ok(); } else { wrong.add(i); b.classList.add('nope'); b.disabled = true; H.miss(); this_q.refresh(); }
        });
        this.refresh = () => { const w = root.querySelector('.pw-word'); if (w) w.hidden = canSpeak && H.tier() < 1; root.querySelectorAll('.pw-pic').forEach(b => b.classList.toggle('hl', H.tier() >= 2 && +b.dataset.i === target)); };
        setTimeout(() => { if (H.still() && !done) say(); }, 450);
      }
    });
  }

  /* ---------------- 8. two steps: choose the sum, then work it out ---------------- */
  const NAMES = ['Aisyah', 'Ravi', 'Mei Ling', 'Ali', 'Siti', 'Kumar', 'Farah'], THINGS = [['sweets', 'gula-gula'], ['stickers', 'pelekat'], ['marbles', 'guli'], ['stars', 'bintang'], ['apples', 'epal'], ['coins', 'syiling']];
  const OPN = { '+': ['add', 'tambah'], '−': ['take away', 'tolak'], '×': ['multiply', 'darab'], '÷': ['share equally', 'bahagi'] };
  function twostepQ(subj, band) {
    if (subj !== 'math' || band < 2) return null;
    const nm = pick(NAMES), th = pick(THINGS)[L()], ops = band === 2 ? ['+', '−'] : ['+', '−', '×', '÷'], op = pick(ops); let a, b, c, story;
    if (op === '+') { a = rnd(3, band === 2 ? 12 : band === 3 ? 60 : 400); b = rnd(2, band === 2 ? 9 : band === 3 ? 40 : 300); c = a + b; story = T(`${nm} has ${a} ${th}. ${nm} gets ${b} more. How many ${th} now?`, `${nm} ada ${a} ${th}. ${nm} dapat ${b} lagi. Berapakah ${th} sekarang?`); }
    else if (op === '−') { a = rnd(6, band === 2 ? 20 : band === 3 ? 80 : 500); b = rnd(2, a - 1); c = a - b; story = T(`${nm} has ${a} ${th}. ${nm} gives away ${b}. How many are left?`, `${nm} ada ${a} ${th}. ${nm} memberi ${b}. Berapa yang tinggal?`); }
    else if (op === '×') { a = rnd(2, band === 3 ? 6 : 10); b = rnd(2, band === 3 ? 6 : 10); c = a * b; story = T(`There are ${a} bags. Each bag has ${b} ${th}. How many ${th} are there in all?`, `Ada ${a} beg. Setiap beg ada ${b} ${th}. Berapakah jumlah ${th} semuanya?`); }
    else { b = rnd(2, band === 3 ? 5 : 9); c = rnd(2, band === 3 ? 6 : 10); a = b * c; story = T(`${nm} shares ${a} ${th} equally with ${b} friends. How many does each friend get?`, `${nm} berkongsi ${a} ${th} sama banyak dengan ${b} orang kawan. Berapa yang diterima setiap kawan?`); }
    const others = shuffle(['+', '−', '×', '÷'].filter(o => o !== op)).slice(0, 2), exprs = shuffle([op, ...others]).map(o => ({ o, s: `${a} ${o} ${b}` }));
    const res = new Set([c]); while (res.size < (band >= 3 ? 4 : 3)) { const d = c + pick([-2, -1, 1, 2, 3, -3, 10, -10]); if (d >= 0) res.add(d); }
    const nums = shuffle([...res]); const eq = `${a} ${op} ${b} = ${c}`;
    return mk(subj, 'twostep', {
      text: story, reviewText: story, key: story, ansText: `${a} ${op} ${b} = ${c}`, op, a, b, c, exprs, nums, timeMul: 2, verify: x => x.o === op && x.n === c,
      why: t('wx.why.two', { op: T(OPN[op][0], OPN[op][1]), eq }), steps: K.steps(T('Step 1: what happens in the story?', 'Langkah 1: apa yang berlaku dalam cerita?'), T(`Step 2: work out ${a} ${op} ${b}.`, `Langkah 2: kira ${a} ${op} ${b}.`)),
      speak: [[story]], viz: () => `<div class="clue big" aria-hidden="true">🪜</div>`,
      mount(host, H) {
        let stage = 1, done = false; const wrong = new Set(); const this_q = this;
        const draw = () => {
          host.innerHTML = `<div class="nq nq-two"><p class="ts-step"><b>${stage}</b>/2 · ${esc(stage === 1 ? T('Which sum fits the story?', 'Ayat matematik yang mana sesuai?') : T(`Work it out: ${a} ${op} ${b} = ?`, `Kira: ${a} ${op} ${b} = ?`))}</p>
            <div class="ts-opts ${stage === 2 ? 'nums' : ''}">${stage === 1 ? exprs.map((x, i) => `<button class="ts-opt" data-i="${i}" type="button">${esc(x.s)}</button>`).join('') : nums.map((n, i) => `<button class="ts-opt" data-i="${i}" type="button">${n}</button>`).join('')}</div></div>`;
          this.refresh();
        };
        host.addEventListener('click', e => {
          const b = e.target.closest('.ts-opt'); if (!b || done || H.locked() || !H.still() || b.disabled) return; const i = +b.dataset.i;
          if (stage === 1) {
            if (exprs[i].o === op) { stage = 2; wrong.clear(); sfx.ok(); draw(); } else { wrong.add(i); b.classList.add('nope'); b.disabled = true; H.miss(); }
          } else if (nums[i] === c) { done = true; b.classList.add('ok'); sfx.ok(); H.ok(); } else { wrong.add(i); b.classList.add('nope'); b.disabled = true; H.miss(); }
        });
        this.refresh = () => { host.querySelectorAll('.ts-opt').forEach(b => { const i = +b.dataset.i; b.classList.toggle('soft', wrong.has(i)); b.disabled = wrong.has(i); b.classList.toggle('hl', H.tier() >= 2 && (stage === 1 ? exprs[i].o === op : nums[i] === c)); }); };
        draw();
      }
    });
  }

  K.gens.clock = clockQ; K.gens.money = moneyQ; K.gens.picword = picwordQ; K.gens.twostep = twostepQ;
  K.weights.clock = (s) => (s === 'math' ? 2 : 0);
  K.weights.money = (s, b) => (s === 'math' ? 2 : 0);
  K.weights.picword = (s, b) => (b <= 2 ? ({ en: 4, bm: 4, sc: 2, sv: 1, math: 2, fk: 1 }[s] || 0) * (b === 1 ? 1.5 : 1) : 0);
  K.weights.twostep = (s, b) => (s === 'math' && b >= 2 ? (b >= 3 ? 3 : 2) : 0);
  K.NUMW = NUMW; K.FOOD = FOOD;
}
