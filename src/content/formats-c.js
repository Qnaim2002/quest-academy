/* v35 formats 10 to 13: memory flash, tap the spot, draw it, echo the beat */
export function partC(K) {
  const { C, T, sl, cap, mk } = K, { t, L, pick, shuffle, rnd, esc, sfx, QT } = C;
  const S = () => C.S(), B = () => C.B();

  /* ---------------- 10. memory flash (the order widget with the answer hidden) ---------------- */
  const WORD_EN = ['cat', 'dog', 'sun', 'pen', 'bus', 'fish', 'bird', 'frog', 'lamp', 'milk'], WORD_BM = ['kuda', 'meja', 'baju', 'topi', 'pisang', 'kucing', 'bola', 'rumah', 'lampu', 'ikan'];
  const uniq = w => new Set(w).size === w.length;
  function memoryQ(subj, band, small) {
    const n = small ? 3 : band === 1 ? 3 : band === 2 ? rnd(3, 4) : band === 3 ? rnd(4, 5) : rnd(5, 6), li = sl(subj); let items, kind, title;
    if (subj === 'sv') { const cs = shuffle([...QT.G.warm, ...QT.G.cool]).slice(0, Math.min(n, 6)); items = cs.map(x => ({ e: x[0], w: cap(x[1 + li]) })); kind = 'colour'; title = T('the colours', 'warna-warna'); }
    else if ((subj === 'en' || subj === 'bm') && band >= 2 && Math.random() < .5) { const w = pick((subj === 'en' ? WORD_EN : WORD_BM).filter(x => uniq(x) && x.length >= Math.min(n, 3) && x.length <= n + 1)); if (!w) return null; items = w.toUpperCase().split('').map(ch => ({ e: '', w: ch })); kind = 'letters'; title = T('the letters', 'huruf-huruf'); }
    else if (subj === 'math' && band >= 2) { const ds = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n); items = ds.map(d => ({ e: '', w: String(d) })); kind = 'digits'; title = T('the numbers', 'nombor-nombor'); }
    else {
      const pools = { sc: QT.G.animal, fk: QT.G.healthy, pm: QT.G.kind, se: QT.G.happy, pk: QT.G.my, mz: QT.G.instrument, math: [...QT.G.fruit], bm: [...QT.G.fruit, ...QT.G.animal], en: [...QT.G.fruit, ...QT.G.animal], sv: QT.G.fruit };
      const pool = pools[subj] || QT.G.animal; if (pool.length < 3) return null;
      items = shuffle(pool).slice(0, Math.min(n, pool.length)).map(x => ({ e: x[0], w: cap(x[1 + li]) })); kind = 'pictures'; title = T('the pictures', 'gambar-gambar');
    }
    if (items.length < 3 || !uniq(items.map(x => x.w))) return null;
    const ws = items.map(i => i.w); let tray; do { tray = shuffle(items.map((_, i) => i)); } while (tray.every((v, i) => v === i));
    const ms = 3000 + Math.max(0, items.length - 3) * 600 + (band === 1 ? 1000 : 0);
    const text = T(`Look carefully at ${title}. Then put them back in the same order.`, `Lihat ${title} dengan teliti. Kemudian susun semula mengikut turutan yang sama.`);
    const row = hidden => `<div class="mem-row ${hidden ? 'hid' : ''}" aria-label="${esc(hidden ? T('hidden', 'tersembunyi') : ws.join(', '))}">${items.map(i => `<i class="mem-card ${hidden ? 'back' : ''}">${hidden ? '❓' : esc(i.e || i.w)}</i>`).join('')}</div><p class="mem-note">${hidden ? T('Now put them back in the same order!', 'Kini susun semula mengikut turutan yang sama!') : T('Look carefully…', 'Lihat dengan teliti…')}</p>`;
    const q = QT.base(subj, 'order', { text, reviewText: `${text} ${ws.join(' · ')}`, items, tray, placed: [], options: ws, correct: -1, key: 'mem:' + ws.join('|') + ':' + rnd(0, 999), memKey: 'mem:' + ws.join('|'), ansText: ws.join(' → '), mem: true, speak: [[T('Look carefully, then put them back in the same order.', 'Lihat dengan teliti, kemudian susun semula mengikut turutan yang sama.')]] });
    q.topic = subj + '_memory'; q.tag = t('wx.tag.memory'); q.memKind = kind; q.timeMul = 1.4; q.verify = arr => arr.join('|') === ws.join('|'); q.why = t('wx.why.mem', { a: ws.join(' → ') });
    const show = hidden => { q.hidden = hidden; const v = document.querySelector('#qViz'); if (v && C.B().q === q) v.innerHTML = row(hidden); };
    q.viz = () => { if (!q.t0) { q.t0 = Date.now(); q.hidden = false; setTimeout(() => { if (C.B().q === q) show(true); }, ms); } return row(!!q.hidden); };
    q.peek = () => { show(false); setTimeout(() => { if (C.B().q === q) show(true); }, 1800); };
    return q;
  }

  /* ---------------- 11. hotspot ---------------- */
  const SCENES = {
    plant: () => ({
      zones: { roots: ['roots', 'akar'], stem: ['stem', 'batang'], leaf: ['leaf', 'daun'], flower: ['flower', 'bunga'] },
      art: `<rect width="200" height="132" fill="#CDEBFF"/><rect y="132" width="200" height="68" fill="#9B6B43"/>
        <g class="hz" data-z="roots" tabindex="0" role="button" aria-label="${esc(T('roots', 'akar'))}"><rect x="46" y="132" width="108" height="66" fill="transparent"/><path d="M100 136 C92 158 72 168 58 190 M100 136 C100 160 100 176 100 196 M100 136 C108 158 128 170 144 192" stroke="#E8C79A" stroke-width="6" fill="none" stroke-linecap="round"/></g>
        <g class="hz" data-z="stem" tabindex="0" role="button" aria-label="${esc(T('stem', 'batang'))}"><rect x="84" y="62" width="32" height="72" fill="transparent"/><rect x="95" y="62" width="10" height="74" rx="5" fill="#3FA34D"/></g>
        <g class="hz" data-z="leaf" tabindex="0" role="button" aria-label="${esc(T('leaf', 'daun'))}"><path d="M105 108 C142 86 156 104 156 114 C136 126 114 120 105 108Z" fill="#58C46A"/><path d="M95 90 C58 68 44 86 44 96 C64 108 86 102 95 90Z" fill="#58C46A"/></g>
        <g class="hz" data-z="flower" tabindex="0" role="button" aria-label="${esc(T('flower', 'bunga'))}"><g fill="#FF7EB6">${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${(100 + 15 * Math.sin(a * Math.PI / 180)).toFixed(1)}" cy="${(46 - 15 * Math.cos(a * Math.PI / 180)).toFixed(1)}" r="11"/>`).join('')}</g><circle cx="100" cy="46" r="10" fill="#FFD166"/></g>`
    }),
    face: () => ({
      zones: { hair: ['hair', 'rambut'], eyes: ['eyes', 'mata'], nose: ['nose', 'hidung'], mouth: ['mouth', 'mulut'], ear: ['ears', 'telinga'] },
      art: `<rect width="200" height="200" fill="#EAF6FF"/>
        <g class="hz" data-z="ear" tabindex="0" role="button" aria-label="${esc(T('ears', 'telinga'))}"><circle cx="30" cy="108" r="17" fill="#F5C49A"/><circle cx="170" cy="108" r="17" fill="#F5C49A"/></g>
        <circle cx="100" cy="108" r="68" fill="#FFD9B0"/>
        <g class="hz" data-z="hair" tabindex="0" role="button" aria-label="${esc(T('hair', 'rambut'))}"><path d="M32 100 C30 40 80 28 100 30 C130 28 172 44 168 100 C150 70 120 62 100 62 C76 62 50 70 32 100Z" fill="#5B3A29"/></g>
        <g class="hz" data-z="eyes" tabindex="0" role="button" aria-label="${esc(T('eyes', 'mata'))}"><circle cx="76" cy="98" r="11" fill="#fff"/><circle cx="124" cy="98" r="11" fill="#fff"/><circle cx="76" cy="99" r="5.5" fill="#2B1D3A"/><circle cx="124" cy="99" r="5.5" fill="#2B1D3A"/></g>
        <g class="hz" data-z="nose" tabindex="0" role="button" aria-label="${esc(T('nose', 'hidung'))}"><ellipse cx="100" cy="124" rx="10" ry="8" fill="#F0A97C"/></g>
        <g class="hz" data-z="mouth" tabindex="0" role="button" aria-label="${esc(T('mouth', 'mulut'))}"><path d="M76 146 Q100 168 124 146" stroke="#C0392B" stroke-width="7" fill="none" stroke-linecap="round"/></g>`
    }),
    shapes: () => ({
      zones: { circle: ['circle', 'bulatan'], square: ['square', 'segi empat sama'], triangle: ['triangle', 'segi tiga'], star: ['star', 'bintang'] },
      art: `<rect width="200" height="200" fill="#F6F0FF"/>
        <g class="hz" data-z="circle" tabindex="0" role="button" aria-label="${esc(T('circle', 'bulatan'))}"><circle cx="52" cy="52" r="34" fill="#FF8FB1"/></g>
        <g class="hz" data-z="square" tabindex="0" role="button" aria-label="${esc(T('square', 'segi empat sama'))}"><rect x="116" y="18" width="68" height="68" rx="4" fill="#4FD1C5"/></g>
        <g class="hz" data-z="triangle" tabindex="0" role="button" aria-label="${esc(T('triangle', 'segi tiga'))}"><polygon points="52,112 86,176 18,176" fill="#FFB547"/></g>
        <g class="hz" data-z="star" tabindex="0" role="button" aria-label="${esc(T('star', 'bintang'))}"><polygon points="150,108 159,134 187,134 164,150 173,177 150,160 127,177 136,150 113,134 141,134" fill="#B28CFF"/></g>`
    })
  };
  const sceneFor = subj => (subj === 'sc' ? pick(['plant', 'face', 'plant']) : ['fk', 'en', 'bm'].includes(subj) ? 'face' : ['math', 'sv'].includes(subj) ? 'shapes' : null);
  function staffScene(band) {
    let pos; do { pos = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3).sort((a, b) => a - b); } while (pos[1] - pos[0] < 2 || pos[2] - pos[1] < 2);
    const ys = pos.map(p => 120 - p * 7.5), xs = [56, 100, 144], which = shuffle([0, 1, 2]);
    const ask = band >= 4 && Math.random() < .35 ? 'mid' : pick(['hi', 'lo']), tgtPos = ask === 'hi' ? Math.max(...pos) : ask === 'lo' ? Math.min(...pos) : pos[1];
    const notes = which.map((wi, k) => ({ id: 'n' + k, y: ys[wi], p: pos[wi] }));
    const art = `<rect width="200" height="170" fill="#FFFBEF"/>${[0, 1, 2, 3, 4].map(i => `<line x1="14" y1="${60 + i * 15}" x2="186" y2="${60 + i * 15}" stroke="#2B1D3A" stroke-width="1.6"/>`).join('')}<text x="20" y="116" font-size="58" fill="#2B1D3A" aria-hidden="true">𝄞</text>
      ${notes.map((n, k) => `<g class="hz" data-z="${n.id}" tabindex="0" role="button" aria-label="${esc(T('note ', 'nota ') + (k + 1))}"><rect x="${xs[k] - 18}" y="${n.y - 24}" width="36" height="48" fill="transparent"/><ellipse cx="${xs[k]}" cy="${n.y}" rx="10" ry="7" transform="rotate(-18 ${xs[k]} ${n.y})" fill="#2B1D3A"/><line x1="${xs[k] + 9}" y1="${n.y - 2}" x2="${xs[k] + 9}" y2="${n.y - 30}" stroke="#2B1D3A" stroke-width="2.4"/></g>`).join('')}`;
    const target = notes.find(n => n.p === tgtPos).id, nameEN = ask === 'hi' ? 'highest note' : ask === 'lo' ? 'lowest note' : 'middle note', nameBM = ask === 'hi' ? 'nota paling tinggi' : ask === 'lo' ? 'nota paling rendah' : 'nota di tengah';
    return { art, target, nameEN, nameBM, viewBox: '0 0 200 170', zones: Object.fromEntries(notes.map(n => [n.id, [n.id, n.id]])) };
  }
  function mapScene(band) {
    const ST = C.STATES, ok = ST.filter(s => band >= 4 ? true : band === 3 ? s[5] !== 'xs' : ['selangor', 'penang', 'johor', 'sabah', 'sarawak', 'perak', 'kelantan'].includes(s[0]));
    const tg = pick(ok), dots = ST.map(([id, nm, , x, y, sz]) => `<button class="mstate sz-${sz}" style="left:${x}%;top:${y}%" data-z="${id}" type="button" aria-label="${esc(nm)}"><span>${esc(nm)}</span></button>`).join('');
    return { tg, html: `<div class="mymap nq-map"><i class="land pen" aria-hidden="true"></i><i class="land bor" aria-hidden="true"></i><span class="sea s1" aria-hidden="true">${esc(t('mp2.sea1'))}</span><span class="sea s2" aria-hidden="true">${esc(t('mp2.sea2'))}</span>${dots}</div>` };
  }
  function hotspotQ(subj, band, small) {
    let sc = null, kind;
    if (subj === 'pk' && band >= 2) kind = 'map'; else if (subj === 'mz' && band >= 3) kind = 'staff'; else { kind = sceneFor(subj); if (!kind) return null; }
    let text, target, name, html, zoneName;
    if (kind === 'map') { const m = mapScene(band); html = m.html; target = m.tg[0]; name = m.tg[1]; zoneName = id => (C.STATES.find(s => s[0] === id) || [])[1]; text = T(`Find and tap ${name} on the map.`, `Cari dan sentuh ${name} pada peta.`); }
    else if (kind === 'staff') { const s = staffScene(band); html = `<svg viewBox="${s.viewBox}" class="hs-svg" role="group" aria-label="${esc(T('Music staff', 'Garis not muzik'))}">${s.art}</svg>`; target = s.target; name = T(s.nameEN, s.nameBM); zoneName = id => id; text = T(`Tap the ${name}.`, `Sentuh ${name}.`); }
    else {
      sc = SCENES[kind](); const keys = Object.keys(sc.zones); target = pick(keys); const li = sl(subj); name = sc.zones[target][li]; zoneName = id => sc.zones[id][li];
      html = `<svg viewBox="0 0 200 200" class="hs-svg" role="group">${sc.art}</svg>`;
      text = kind === 'shapes' ? T(`Tap the ${name}.`, `Sentuh ${name}.`) : li ? `Sentuh ${name}.` : `Tap the ${name}.`;
    }
    return mk(subj, 'hotspot', {
      text, reviewText: text, key: kind + ':' + target + ':' + (kind === 'staff' ? text : ''), ansText: name, scene: kind, target, verify: id => id === target, why: t('wx.why.hot', { a: name }),
      steps: K.steps(T('Look at the whole picture.', 'Lihat seluruh gambar.'), T(`Find the ${name}.`, `Cari ${name}.`)), speak: [[text, kind === 'map' ? undefined : K.lc(subj)]], viz: () => `<div class="clue big" aria-hidden="true">👆</div>`,
      mount(host, H) {
        let done = false; const wrong = new Set(); const this_q = this;
        host.innerHTML = `<div class="nq nq-hot nq-${kind}">${html}</div>`;
        const root = host.querySelector('.nq');
        const pickZ = el => {
          if (done || H.locked() || !H.still()) return; const z = el.dataset.z;
          if (this_q.verify(z)) { done = true; el.classList.add('ok'); sfx.ok(); H.ok(); } else { wrong.add(z); el.classList.add('nope'); setTimeout(() => el.classList.remove('nope'), 450); H.miss(); this_q.refresh(); }
        };
        root.addEventListener('click', e => { const el = e.target.closest('[data-z]'); if (el && root.contains(el)) pickZ(el); });
        root.addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const el = e.target.closest('[data-z]'); if (el) { e.preventDefault(); pickZ(el); } });
        this.refresh = () => { const mp = root.querySelector('.nq-map'); if (mp) mp.classList.toggle('names', H.tier() >= 1); root.querySelectorAll('[data-z]').forEach(el => { el.classList.toggle('soft', wrong.has(el.dataset.z)); el.classList.toggle('hl', H.tier() >= 2 && !done && el.dataset.z === target); }); };
        this.refresh(); void zoneName;
      }
    });
  }

  /* ---------------- 12. draw it (the tracing engine, with the guide hidden for older ages) ---------------- */
  const circle = Array.from({ length: 29 }, (_, i) => { const a = (-90 + i * 360 / 28) * Math.PI / 180; return [+(50 + 32 * Math.cos(a)).toFixed(1), +(50 + 32 * Math.sin(a)).toFixed(1)]; });
  Object.assign(C.GLYPHS, { circle: [circle], square: [[[22, 22], [78, 22], [78, 78], [22, 78], [22, 22]]], triangle: [[[50, 16], [82, 80], [18, 80], [50, 16]]] });
  const SHAPE_NAME = { circle: ['circle', 'bulatan'], square: ['square', 'segi empat sama'], triangle: ['triangle', 'segi tiga'] };
  function drawQ(subj, band) {
    let glyph, text, ansText, hide = false, em = '✏️', eq = '';
    if (subj === 'sv' || (subj === 'math' && band <= 2 && Math.random() < .4)) {
      glyph = pick(['circle', 'square', 'triangle']); const nm = SHAPE_NAME[glyph][L()]; hide = band >= 3; ansText = nm;
      text = T(`Draw a ${nm}.`, `Lukis ${nm}.`); em = '🔷';
    } else if (subj === 'math' && band >= 2) {
      let a, b, c; const f = Math.random();
      if (band === 2 || f < .4) { c = rnd(2, 9); a = rnd(1, c - 1); b = c - a; eq = `${a} + ${b}`; }
      else if (f < .7) { a = rnd(3, 9); b = rnd(1, a); c = a - b; eq = `${a} − ${b}`; }
      else if (f < .9) { a = rnd(2, 3); b = rnd(2, 3); c = a * b; eq = `${a} × ${b}`; } else { b = rnd(2, 4); c = rnd(1, 4); a = b * c; eq = `${a} ÷ ${b}`; }
      glyph = String(c); hide = true; ansText = String(c); text = T(`Draw the answer: ${eq} =`, `Lukis jawapannya: ${eq} =`); em = '✏️';
    } else return null;
    return mk(subj, 'draw', {
      text, reviewText: text, key: text, ansText, glyph, hide, timeMul: 2.5, eq, verify: strokes => !!C.traceScore(glyph, strokes, hide).ok, why: t('wx.why.draw'),
      steps: K.steps(T('Follow the line with your finger.', 'Ikut garisan dengan jari kamu.')), speak: [[text]], viz: () => `<div class="clue big nq-big" aria-hidden="true">${esc(eq ? eq + ' =' : em)}</div>`,
      mount(host, H) {
        C.mountTrace(host, glyph, (sc, reset) => {
          if (H.locked() || !H.still()) return;
          if (sc.ok) { H.ok(); return; }
          H.miss(); setTimeout(() => { if (H.still() && !H.locked()) reset(); }, 1400);
        }, Math.max(150, Math.min(190, (typeof innerHeight === 'number' ? innerHeight : 700) * .24)), { hide, loose: hide });
      }
    });
  }

  /* ---------------- 13. echo the beat ---------------- */
  const PADS = [{ n: ['Boom', 'Boom'], f: 130, em: '🥁' }, { n: ['Ting', 'Ting'], f: 523, em: '🔔' }];
  function rhythmQ(subj, band, small) {
    if (subj !== 'mz') return null;
    const n = small ? 3 : band <= 2 ? 3 : band === 3 ? rnd(4, 5) : rnd(5, 6); let p;
    do { p = Array.from({ length: n }, () => rnd(0, 1)); } while (new Set(p).size < 2);
    const words = p.map(i => PADS[i].n[0]), text = T('Listen to the beat. Then tap it back!', 'Dengar rentak itu. Kemudian ulang semula!');
    return mk(subj, 'rhythm', {
      text, reviewText: `${text} (${words.join(' ')})`, key: p.join('') + ':' + n, ansText: words.join(' · '), pattern: p, timeMul: 2, verify: seq => seq.length === p.length && seq.every((v, i) => v === p[i]), why: t('wx.why.rhythm', { a: words.join(' · ') }),
      steps: K.steps(T('Listen to every beat.', 'Dengar setiap rentak.'), T('Tap the same drums in the same order.', 'Sentuh gendang yang sama mengikut turutan yang sama.')), speak: [[text]], viz: () => `<div class="clue big" aria-hidden="true">🥁</div>`,
      mount(host, H) {
        let at = 0, done = false, playing = false; const this_q = this, timers = [];
        host.innerHTML = `<div class="nq nq-rhythm"><div class="rh-dots" aria-hidden="true">${p.map(() => '<i></i>').join('')}</div><div class="rh-pads">${PADS.map((d, i) => `<button class="rh-pad rh-${i}" data-p="${i}" type="button" aria-label="${esc(d.n[0])}"><span>${d.em}</span><b>${esc(d.n[L()])}</b></button>`).join('')}</div>
          <p class="rh-hint" ${H.tier() >= 1 ? '' : 'hidden'}>${esc(words.join(' · '))}</p><div class="nq-acts"><button class="btn ghost" data-wx="again" type="button">${t('wx.listen')}</button></div></div>`;
        const root = host.querySelector('.nq'), dots = [...root.querySelectorAll('.rh-dots i')], pads = [...root.querySelectorAll('.rh-pad')];
        const hit = (i, delay = 0, quiet = false) => {
          if (!quiet && C.sfxOn()) { try { if (C.auCtx()) C.voice({ f: PADS[i].f, d: i ? .5 : .32, type: i ? 'triangle' : 'sine', v: .12, delay }); } catch (e) { /* no audio */ } }
          timers.push(setTimeout(() => { const pd = pads[i]; if (!pd || !pd.classList) return; pd.classList.add('lit'); setTimeout(() => pd.classList.remove('lit'), 220); }, delay * 1000));
        };
        const paint = () => dots.forEach((d, k) => d.classList.toggle('on', k < at));
        const play = () => {
          if (playing) return; playing = true; at = 0; paint();
          p.forEach((v, k) => hit(v, k * .56)); timers.push(setTimeout(() => { playing = false; }, p.length * 560 + 100));
        };
        root.querySelector('[data-wx="again"]').addEventListener('click', () => { if (!done && !H.locked() && H.still()) play(); });
        root.addEventListener('click', e => {
          const b = e.target.closest('.rh-pad'); if (!b || done || playing || H.locked() || !H.still()) return; const i = +b.dataset.p;
          hit(i, 0); if (i === p[at]) { at++; paint(); if (at === p.length) { done = true; root.classList.add('good'); H.ok(); } }
          else { root.classList.add('bad'); setTimeout(() => root.classList.remove('bad'), 450); at = 0; paint(); H.miss(); timers.push(setTimeout(() => { if (H.still() && !done) play(); }, 1500)); }
        });
        this.refresh = () => { const h = root.querySelector('.rh-hint'); if (h) h.hidden = H.tier() < 1; };
        timers.push(setTimeout(() => { if (H.still() && !done) play(); }, 600));
      }
    });
  }

  K.gens.memory = memoryQ; K.gens.hotspot = hotspotQ; K.gens.draw = drawQ; K.gens.rhythm = rhythmQ;
  K.weights.memory = (s, b) => (['en', 'bm', 'sv', 'math'].includes(s) ? 1.5 : 1);
  K.weights.hotspot = (s, b) => ({ sc: 2, fk: 1, en: b <= 3 ? 1 : 0, bm: b <= 3 ? 1 : 0, math: 1, sv: 1, pk: b >= 2 ? 2 : 0, mz: b >= 3 ? 2 : 0 }[s] || 0);
  K.weights.draw = (s, b) => (s === 'math' ? (b >= 2 ? 1.5 : 1) : s === 'sv' ? 1.5 : 0);
  K.weights.rhythm = (s) => (s === 'mz' ? 4 : 0);
  C.HOOK.on('answer:wrong', q => { if (q && q.mem && q.peek && C.B().q === q) q.peek(); });
}
