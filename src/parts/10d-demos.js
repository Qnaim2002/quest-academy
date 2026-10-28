/* ================= v22: more hands-on lesson demos =================
   clock    drag the hands of a clock; the time is read out in digits and words, with a "show this time" goal
   numline  a frog hops along a number line: tap + and − hops, the sum is written as you go
   money    tap coins and notes into the purse to pay exactly for a snack
   clap     clap once for every syllable of a word (Malay or English), then check
   float    guess "float or sink?", then drop the object in the water tank
   magnet   test things with a magnet and sort them into magnetic and not magnetic
   Demos keep their state in UI.dm[demo] so a re-render (language change, scrolling) does not reset them. */
const DEMO_FOR = { m_time: 'clock', math2_clock: 'clock', math2_addline: 'numline', m_add: 'numline', m_sub: 'numline', math2_beforeafter: 'numline', m_money: 'money', math2_coins: 'money', bm_suku: 'clap', bm2_kvkvk: 'clap', bm2_dua_tiga_suku: 'clap', mz_rentak: 'clap', en2_rhyme: 'clap', sc_apung: 'float', sc_magnet: 'magnet', sc_material: 'magnet' };
const dmState = (k, init) => { const D = UI.dm || (UI.dm = {}); return D[k] || (D[k] = init()); };
function demoHTML(m) { const k = m.demo && !['blend', 'react', 'ten', 'frac'].includes(m.demo) ? m.demo : DEMO_FOR[m.id]; return k ? lsec('🎮', t('lc.play'), '', `<div class="viz lpanel k-see"><div class="demo" data-demo="${k}"></div></div>`, 'see') : ''; }
function mountDemos(root) { (root || document).querySelectorAll('.demo[data-demo]').forEach(h => { const f = DEMOS[h.dataset.demo]; if (f) f(h); }); }
const twoD = n => String(n).padStart(2, '0'), up1 = s => L() ? s.charAt(0).toUpperCase() + s.slice(1) : s;   // Malay sentences start with the thing's name
const DEMOS = {
  clock(h) {
    const st = dmState('clock', () => ({ h: 3, m: 0, goal: [7, 30], ok: 0 }));
    const words = (hh, mm) => mm === 0 ? t('dm.oclock', { h: hh }) : mm === 30 ? t('dm.half', { h: hh }) : mm === 15 ? t('dm.qpast', { h: hh }) : mm === 45 ? t('dm.qto', { h: hh % 12 + 1 }) : t('dm.hm', { h: hh, m: twoD(mm) });
    function draw() {
      const ma = st.m * 6, ha = (st.h % 12) * 30 + st.m * .5, hit = st.h === st.goal[0] && st.m === st.goal[1];
      h.innerHTML = `<div class="dm-clock"><svg viewBox="-110 -110 220 220" class="clk" role="img" aria-label="${esc(words(st.h, st.m))}"><circle r="104" class="clk-face"/>${Array.from({ length: 60 }, (_, i) => `<line class="${i % 5 ? 'tk' : 'tk5'}" x1="0" y1="${i % 5 ? -96 : -90}" x2="0" y2="-102" transform="rotate(${i * 6})"/>`).join('')}${Array.from({ length: 12 }, (_, i) => { const a = (i + 1) * 30 * Math.PI / 180; return `<text x="${Math.sin(a) * 74}" y="${-Math.cos(a) * 74 + 7}" class="clk-n">${i + 1}</text>`; }).join('')}
        <line class="hand hh" x1="0" y1="10" x2="0" y2="-52" transform="rotate(${ha})" data-hand="h"/><line class="hand mh" x1="0" y1="14" x2="0" y2="-82" transform="rotate(${ma})" data-hand="m"/><circle r="7" class="clk-pin"/></svg>
        <div class="dm-side"><b class="dm-digital">${st.h}:${twoD(st.m)}</b><span>${esc(words(st.h, st.m))}</span><p class="dm-goal ${hit ? 'ok' : ''}">${hit ? '✅ ' + t('dm.yes') : '🎯 ' + t('dm.showTime', { t: `${st.goal[0]}:${twoD(st.goal[1])}` })}</p>
        <div class="seg"><button class="chip" data-dm="h-">− ${t('dm.hour')}</button><button class="chip" data-dm="h+">+ ${t('dm.hour')}</button><button class="chip" data-dm="m-">− 5 min</button><button class="chip" data-dm="m+">+ 5 min</button>${hit ? `<button class="chip" data-dm="goal">${t('dm.newGoal')}</button>` : ''}</div><small class="sub">${t('dm.dragHands')}</small></div></div>`;
      if (hit && !st.done) { st.done = true; sfx.ok(); }
    }
    h.onclick = e => { const b = e.target.closest('[data-dm]'); if (!b) return; const k = b.dataset.dm;
      if (k === 'h+') st.h = st.h % 12 + 1; if (k === 'h-') st.h = (st.h + 10) % 12 + 1;
      if (k === 'm+') { st.m += 5; if (st.m >= 60) { st.m = 0; st.h = st.h % 12 + 1; } } if (k === 'm-') { st.m -= 5; if (st.m < 0) { st.m = 55; st.h = (st.h + 10) % 12 + 1; } }
      if (k === 'goal') { st.goal = [rnd(1, 12), pick(S.band <= 2 ? [0, 30] : [0, 15, 30, 45])]; st.done = false; } sfx.tap(); draw(); };
    h.onpointerdown = e => {
      const hand = e.target.closest('[data-hand]'); if (!hand) return; e.preventDefault(); const svg = h.querySelector('svg'), which = hand.dataset.hand;
      const mv = ev => { const r = (h.querySelector('svg') || svg).getBoundingClientRect(), x = ev.clientX - r.left - r.width / 2, y = ev.clientY - r.top - r.height / 2, deg = (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360;
        if (which === 'm') { const nm = Math.round(deg / 30) * 5 % 60; if (st.m >= 45 && nm <= 10) st.h = st.h % 12 + 1; else if (st.m <= 10 && nm >= 45) st.h = (st.h + 10) % 12 + 1; st.m = nm; }
        else st.h = (Math.floor(((deg + 15) % 360) / 30) + 11) % 12 + 1; draw(); };
      const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    };
    draw();
  },
  numline(h) {
    const max = S.band <= 1 ? 10 : 20, st = dmState('numline', () => ({ at: 3, start: 3, hops: [] }));
    function draw(jump) {
      const eq = st.hops.length ? `${st.start} ${st.hops.map(x => (x > 0 ? '+ ' : '− ') + Math.abs(x)).join(' ')} = ${st.at}` : t('dm.nlStart', { n: st.start });
      h.innerHTML = `<div class="dm-nl"><div class="nl-track">${Array.from({ length: max + 1 }, (_, i) => `<button class="nl-n ${i === st.at ? 'at' : ''} ${i === st.start ? 'st' : ''}" data-nl="${i}" style="left:${i / max * 100}%">${i}</button>`).join('')}<span class="nl-frog" style="left:${st.at / max * 100}%">🐸</span></div>
        <b class="dm-eq">${eq}</b><div class="seg" style="justify-content:center">${[-2, -1, 1, 2, 3].map(d => `<button class="chip" data-hop="${d}" ${st.at + d < 0 || st.at + d > max ? 'disabled' : ''}>${d > 0 ? '+' : '−'}${Math.abs(d)}</button>`).join('')}<button class="chip" data-hop="reset">↺</button></div><small class="sub">${t('dm.nlTip')}</small></div>`;
      if (jump !== undefined) { const f = h.querySelector('.nl-frog'); if (f && !S.sensory) { const dx = jump * h.querySelector('.nl-track').offsetWidth / max; f.animate([{ transform: `translate(${-dx}px,0)` }, { transform: `translate(${-dx / 2}px,-34px)`, offset: .5 }, { transform: 'translate(0,0)' }], { duration: 420, easing: 'ease-out' }); } }
    }
    h.onclick = e => { const b = e.target.closest('[data-hop],[data-nl]'); if (!b) return;
      if (b.dataset.nl !== undefined) { st.start = st.at = +b.dataset.nl; st.hops = []; sfx.tap(); return draw(); }
      if (b.dataset.hop === 'reset') { st.at = st.start; st.hops = []; return draw(); }
      const d = +b.dataset.hop; st.at += d; st.hops.push(d); sfx.pop(); draw(d); };
    draw();
  },
  money(h) {
    const COINS = [[5, '5 sen'], [10, '10 sen'], [20, '20 sen'], [50, '50 sen'], [100, 'RM1'], [500, 'RM5']];
    const SNACKS = [['🍦', 120], ['🍌', 60], ['🧃', 150], ['🍪', 85], ['🍞', 230], ['🎈', 35], ['📒', 340]];
    const st = dmState('money', () => ({ purse: [], snack: 0 }));
    const rm = s => s >= 100 ? `RM${(s / 100).toFixed(2)}` : `${s} sen`;
    function draw() {
      const [em, price] = SNACKS[st.snack], tot = st.purse.reduce((a, b) => a + b, 0), ok = tot === price;
      h.innerHTML = `<div class="dm-money"><div class="mn-shop"><span class="mn-snack">${em}</span><b>${rm(price)}</b></div><p class="sub">${t('dm.payExact')}</p>
        <div class="mn-coins">${COINS.map(([v, l]) => `<button class="mn-c ${v >= 100 ? 'note' : ''}" data-coin="${v}">${l}</button>`).join('')}</div>
        <div class="mn-purse" aria-label="${esc(t('dm.purse'))}">${st.purse.map((v, i) => `<button class="mn-c sm ${v >= 100 ? 'note' : ''}" data-take="${i}">${COINS.find(c => c[0] === v)[1]}</button>`).join('') || `<small class="sub">${t('dm.purseEmpty')}</small>`}</div>
        <b class="dm-eq ${ok ? 'ok' : tot > price ? 'over' : ''}">${t('dm.total', { t: rm(tot) })} ${ok ? '✅' : tot > price ? '⚠️ ' + t('dm.tooMuch') : ''}</b>${ok ? `<button class="chip" data-coin="next">${t('dm.nextSnack')} ▶</button>` : ''}</div>`;
      if (ok && !st.done) { st.done = true; sfx.coin(); }
    }
    h.onclick = e => { const b = e.target.closest('[data-coin],[data-take]'); if (!b) return;
      if (b.dataset.take !== undefined) { st.purse.splice(+b.dataset.take, 1); st.done = false; return draw(); }
      if (b.dataset.coin === 'next') { st.snack = (st.snack + 1) % SNACKS.length; st.purse = []; st.done = false; return draw(); }
      st.purse.push(+b.dataset.coin); sfx.coin(); draw(); };
    draw();
  },
  clap(h) {
    const bm = S.lang === 'ms' || (UI.open || '').startsWith('bm');
    const WORDS = bm ? [['kucing', '🐱', ['ku', 'cing']], ['kereta', '🚗', ['ke', 're', 'ta']], ['bola', '⚽', ['bo', 'la']], ['matahari', '☀️', ['ma', 'ta', 'ha', 'ri']], ['ikan', '🐟', ['i', 'kan']], ['harimau', '🐯', ['ha', 'ri', 'mau']], ['rumah', '🏠', ['ru', 'mah']]]
      : [['cat', '🐱', ['cat']], ['apple', '🍎', ['ap', 'ple']], ['banana', '🍌', ['ba', 'na', 'na']], ['elephant', '🐘', ['el', 'e', 'phant']], ['tiger', '🐯', ['ti', 'ger']], ['watermelon', '🍉', ['wa', 'ter', 'mel', 'on']]];
    const st = dmState('clap' + (bm ? 'bm' : 'en'), () => ({ i: 0, claps: 0, res: '' }));
    function draw() {
      const [w, e, parts] = WORDS[st.i % WORDS.length];
      h.innerHTML = `<div class="dm-clap"><span class="cl-e">${e}</span><b class="cl-w">${st.res ? parts.map((p, k) => `<span class="chunk k${k % 3}">${esc(p)}</span>`).join('·') : esc(w)}</b>
        <div class="cl-dots">${Array.from({ length: Math.max(st.claps, 1) }, (_, k) => `<i class="${k < st.claps ? 'on' : ''}">👏</i>`).join('')}</div>
        <div class="seg" style="justify-content:center"><button class="btn big" data-cl="clap">👏 ${t('dm.clap')}</button><button class="btn ghost" data-cl="check" ${st.claps ? '' : 'disabled'}>✓ ${t('dm.check')}</button><button class="chip" data-cl="say">🔊</button></div>
        <p class="dm-goal ${st.res === 'ok' ? 'ok' : ''}">${st.res === 'ok' ? '✅ ' + t('dm.clapOk', { n: parts.length }) : st.res === 'no' ? t('dm.clapNo', { n: parts.length }) : t('dm.clapTip')}</p>${st.res ? `<button class="chip" data-cl="next">${t('dm.nextWord')} ▶</button>` : ''}</div>`;
    }
    h.onclick = e => { const b = e.target.closest('[data-cl]'); if (!b) return; const k = b.dataset.cl, [w, , parts] = WORDS[st.i % WORDS.length];
      if (k === 'clap') { if (st.res) { st.res = ''; st.claps = 0; } st.claps = Math.min(6, st.claps + 1); sx([{ n: 1, ft: 'bandpass', f: 1800, d: .08, v: .12 }]); }
      if (k === 'check') { st.res = st.claps === parts.length ? 'ok' : 'no'; if (st.res === 'ok') sfx.ok(); else sfx.soft(); }
      if (k === 'say') speak(parts.join(' - '), bm ? 'ms-MY' : 'en-US');
      if (k === 'next') { st.i++; st.claps = 0; st.res = ''; }
      draw(); void w; };
    draw();
  },
  float(h) {
    const OBJ = [['🪨', 0, 'stone', 'batu'], ['🪵', 1, 'wood', 'kayu'], ['🔑', 0, 'key', 'kunci'], ['🦆', 1, 'rubber duck', 'itik getah'], ['🍎', 1, 'apple', 'epal'], ['🪙', 0, 'coin', 'duit syiling'], ['🧽', 1, 'sponge', 'span'], ['⚓', 0, 'anchor', 'sauh']];
    const st = dmState('float', () => ({ sel: null, guess: null, done: {} }));
    function draw(drop) {
      const it = st.sel !== null ? OBJ[st.sel] : null;
      h.innerHTML = `<div class="dm-float"><div class="fl-tank">${Object.keys(st.done).map(k => { const o = OBJ[k]; return `<span class="fl-o ${o[1] ? 'top' : 'bot'}" style="left:${8 + k * 11}%">${o[0]}</span>`; }).join('')}<i class="fl-water"></i></div>
        <div class="fl-items">${OBJ.map((o, k) => `<button class="fl-it ${st.sel === k ? 'sel' : ''}" data-fl="${k}" ${st.done[k] !== undefined ? 'disabled' : ''} aria-label="${esc(o[2 + L()])}">${o[0]}</button>`).join('')}</div>
        ${it ? `<p><b>${it[0]} ${esc(it[2 + L()])}</b>: ${t('dm.guess')}</p><div class="seg" style="justify-content:center"><button class="btn" data-g="1">🛟 ${t('dm.floats')}</button><button class="btn" data-g="0">⬇️ ${t('dm.sinks')}</button></div>` : `<p class="sub">${Object.keys(st.done).length === OBJ.length ? t('dm.flAll', { n: Object.values(st.done).filter(Boolean).length, m: OBJ.length }) : t('dm.flPick')}</p>`}
        ${st.msg ? `<p class="dm-goal ${st.msgOk ? 'ok' : ''}">${st.msg}</p>` : ''}${Object.keys(st.done).length ? `<button class="chip" data-g="reset">↺</button>` : ''}</div>`;
      if (drop !== undefined && !S.sensory) { const el = h.querySelectorAll('.fl-o'); const last = [...el].find(x => x.style.left === `${8 + drop * 11}%`); if (last) last.animate([{ transform: 'translateY(-140px)' }, { transform: 'translateY(0)' }], { duration: 700, easing: 'cubic-bezier(.3,1.4,.6,1)' }); }
    }
    h.onclick = e => { const b = e.target.closest('[data-fl],[data-g]'); if (!b) return;
      if (b.dataset.fl !== undefined) { st.sel = +b.dataset.fl; st.msg = ''; sfx.tap(); return draw(); }
      if (b.dataset.g === 'reset') { st.done = {}; st.sel = null; st.msg = ''; return draw(); }
      const k = st.sel; if (k === null) return; const o = OBJ[k], g = +b.dataset.g, right = g === o[1];
      st.done[k] = right; st.msgOk = right; st.msg = (right ? '✅ ' : '🤔 ') + t(o[1] ? 'dm.didFloat' : 'dm.didSink', { o: up1(o[2 + L()]) }); st.sel = null; sx([{ n: 1, ft: 'lowpass', f: 900, f2: 300, d: .35, v: .08 }]); draw(k); };
    draw();
  },
  magnet(h) {
    const OBJ = [['📎', 1, 'paperclip', 'klip kertas'], ['✏️', 0, 'pencil', 'pensel'], ['🔩', 1, 'iron bolt', 'bolt besi'], ['🧸', 0, 'teddy bear', 'anak patung'], ['🍃', 0, 'leaf', 'daun'], ['🪡', 1, 'needle', 'jarum'], ['🥄', 0, 'plastic spoon', 'sudu plastik'], ['🔗', 1, 'iron chain', 'rantai besi']];
    const st = dmState('magnet', () => ({ res: {} }));
    function draw(test) {
      const yes = OBJ.filter((o, k) => st.res[k] === 1), no = OBJ.filter((o, k) => st.res[k] === 0);
      h.innerHTML = `<div class="dm-mag"><div class="mg-stage"><span class="mg-m">🧲</span>${test !== undefined ? `<span class="mg-t ${OBJ[test][1] ? 'stick' : 'stay'}">${OBJ[test][0]}</span>` : ''}</div>
        <div class="fl-items">${OBJ.map((o, k) => `<button class="fl-it" data-mg="${k}" ${st.res[k] !== undefined ? 'disabled' : ''} aria-label="${esc(o[2 + L()])}">${o[0]}</button>`).join('')}</div>
        <div class="mg-sort"><div><b>🧲 ${t('dm.magYes')}</b><span>${yes.map(o => o[0]).join(' ') || '–'}</span></div><div><b>🚫 ${t('dm.magNo')}</b><span>${no.map(o => o[0]).join(' ') || '–'}</span></div></div>
        <p class="sub">${test !== undefined ? esc(t(OBJ[test][1] ? 'dm.sticks' : 'dm.noStick', { o: OBJ[test][1] ? OBJ[test][2 + L()] : up1(OBJ[test][2 + L()]) })) : Object.keys(st.res).length === OBJ.length ? t('dm.magAll') : t('dm.magPick')}</p>${Object.keys(st.res).length ? `<button class="chip" data-mg="reset">↺</button>` : ''}</div>`;
    }
    h.onclick = e => { const b = e.target.closest('[data-mg]'); if (!b) return;
      if (b.dataset.mg === 'reset') { st.res = {}; return draw(); }
      const k = +b.dataset.mg; st.res[k] = OBJ[k][1]; if (OBJ[k][1]) sx([{ f: 900, f2: 1400, d: .12, type: 'square', v: .02, lp: 3000 }]); else sfx.soft(); draw(k); };
    draw();
  }
};
