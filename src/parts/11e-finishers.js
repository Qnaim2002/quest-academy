/* ================= v22: combo finishers =================
   Five right answers in a row (no slip in between) fires the equipped finisher: a short cinematic attack that
   hits much harder than a normal one. The combo then keeps counting, so 10 in a row fires it again.
   Finishers are bought in the Armory (Finishers tab). They differ only in how they look and sound, so a
   child who cannot afford one is never weaker. runFinisher() draws into any layer, which is how the Armory
   shows a preview without a battle. */
const FIN_EVERY = 5;
/* the finisher items themselves are in 03 (FINISHERS), so saves and the Armory know them from the start */
const finOf = () => ITEM[(S.equipped && S.equipped.finisher) || 'fin_starfall'] || ITEM.fin_starfall;
const finName = it => it ? (S.lang === 'ms' ? it.ms : it.en) : '';

/* one particle that flies from a to b and fades */
function finBit(L, txt, a, b, o = {}) {
  const s = document.createElement('span'); s.className = 'finbit ' + (o.cls || ''); s.textContent = txt; s.style.left = '0px'; s.style.top = '0px'; s.style.fontSize = (o.size || 28) + 'px'; L.appendChild(s);
  const kf = [{ transform: `translate(${a.x}px,${a.y}px) translate(-50%,-50%) scale(${o.s0 ?? .6}) rotate(${o.r0 || 0}deg)`, opacity: o.o0 ?? 1 }];
  if (o.mid) kf.push({ transform: `translate(${o.mid.x}px,${o.mid.y}px) translate(-50%,-50%) scale(${o.sm ?? 1}) rotate(${(o.r1 || 0) / 2}deg)`, opacity: 1, offset: o.mo || .5 });
  kf.push({ transform: `translate(${b.x}px,${b.y}px) translate(-50%,-50%) scale(${o.s1 ?? 1}) rotate(${o.r1 || 0}deg)`, opacity: o.o1 ?? 0 });
  const an = s.animate(kf, { duration: o.d || 700, delay: o.delay || 0, easing: o.ease || 'cubic-bezier(.3,.6,.4,1)', fill: 'both' });
  an.onfinish = () => s.remove(); return an;
}
function finFlash(L, color, d = 260, delay = 0) { const f = document.createElement('div'); f.className = 'finflash'; f.style.background = color; L.appendChild(f); f.animate([{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 0 }], { duration: d, delay, fill: 'both' }).onfinish = () => f.remove(); }
function finBolt(L, x, y0, y1, delay) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), h = y1 - y0, pts = [];
  for (let i = 0; i <= 7; i++) pts.push(`${(i % 2 ? 1 : -1) * (6 + Math.random() * 10) * (i && i < 7 ? 1 : 0)},${h * i / 7}`);
  el.setAttribute('class', 'finbolt'); el.setAttribute('viewBox', `-30 0 60 ${h}`); el.style.left = (x - 30) + 'px'; el.style.top = y0 + 'px'; el.style.height = h + 'px';
  el.innerHTML = `<polyline points="${pts.join(' ')}" fill="none" stroke="#FFF7B0" stroke-width="7" stroke-linejoin="round"/><polyline points="${pts.join(' ')}" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>`;
  L.appendChild(el); el.animate([{ opacity: 0 }, { opacity: 1, offset: .1 }, { opacity: .2, offset: .4 }, { opacity: 1, offset: .55 }, { opacity: 0 }], { duration: 420, delay, fill: 'both' }).onfinish = () => el.remove();
}
const FIN_SFX = {
  fin_starfall: () => sx([0, 1, 2, 3, 4, 5].map(i => ({ f: NF(84 + i * 2), d: .25, type: 'triangle', v: .04, delay: i * .08 })).concat([{ f: 120, f2: 50, d: .5, v: .16, delay: .55 }])),
  fin_thunder: () => sx([{ n: 1, ft: 'lowpass', f: 3000, f2: 200, d: .9, v: .2 }, { f: 90, f2: 40, d: .7, v: .18, delay: .05 }, { n: 1, ft: 'highpass', f: 2000, d: .2, v: .12, delay: .35 }]),
  fin_meteor: () => sx([{ n: 1, ft: 'bandpass', f: 300, f2: 2400, d: .7, v: .08, q: 1.5 }, { f: 110, f2: 35, d: .8, v: .24, delay: .65 }, { n: 1, ft: 'lowpass', f: 1500, f2: 200, d: .6, v: .16, delay: .65 }]),
  fin_frost: () => sx([88, 91, 95, 100].map((m, i) => ({ f: NF(m), d: .35, v: .035, delay: i * .1 })).concat([{ n: 1, ft: 'highpass', f: 5000, d: .5, v: .1, delay: .7 }])),
  fin_tornado: () => sx([{ n: 1, ft: 'bandpass', f: 300, f2: 1800, d: 1.2, v: .1, q: 2 }, { n: 1, ft: 'bandpass', f: 1800, f2: 400, d: .6, v: .06, delay: .8 }]),
  fin_rainbow: () => sx([60, 64, 67, 72, 76, 79, 84].map((m, i) => ({ f: NF(m + 12), d: .5, v: .035, delay: i * .05 })).concat([{ f: 200, f2: 1600, d: .7, glide: .6, type: 'sawtooth', v: .03, lp: 2400 }])),
  fin_dragon: () => sx([{ f: 140, f2: 70, d: .9, type: 'sawtooth', v: .07, lp: 800 }, { n: 1, ft: 'lowpass', f: 1200, f2: 300, d: 1.1, v: .12, delay: .3 }]),
  fin_tiger: () => sx([{ f: 160, f2: 90, d: .6, type: 'sawtooth', v: .08, lp: 900 }, { n: 1, ft: 'bandpass', f: 1500, f2: 3500, d: .15, v: .1, delay: .55 }, { n: 1, ft: 'bandpass', f: 1500, f2: 3500, d: .15, v: .1, delay: .7 }, { n: 1, ft: 'bandpass', f: 1500, f2: 3500, d: .15, v: .1, delay: .85 }]),
  /* v25 */
  fin_blossom: () => sx([79, 76, 83, 81, 86].map((m, i) => ({ f: NF(m), d: .4, type: 'sine', v: .04, delay: i * .12 })).concat([{ n: 1, ft: 'bandpass', f: 2600, f2: 900, d: .8, v: .05, q: 3, delay: .2 }])),
  fin_tidal: () => sx([{ n: 1, ft: 'lowpass', f: 400, f2: 2400, d: 1, v: .14 }, { n: 1, ft: 'lowpass', f: 2400, f2: 300, d: .7, v: .16, delay: .9 }, { f: 70, f2: 40, d: .6, v: .14, delay: .95 }]),
  fin_eagle: () => sx([{ f: 1800, f2: 1100, d: .35, type: 'triangle', v: .05 }, { f: 1500, f2: 900, d: .3, type: 'triangle', v: .04, delay: .3 }, { n: 1, ft: 'highpass', f: 1200, f2: 4000, d: .5, v: .08, delay: .45 }, { f: 130, f2: 60, d: .4, v: .16, delay: .85 }]),
  fin_volcano: () => sx([{ f: 50, f2: 70, d: .9, type: 'sawtooth', v: .07, lp: 300 }, { n: 1, ft: 'lowpass', f: 300, f2: 1400, d: .5, v: .2, delay: .6 }, { f: 120, f2: 40, d: .7, v: .2, delay: .62 }]),
  fin_galaxy: () => sx([48, 55, 60, 63, 67].map((m, i) => ({ f: NF(m + 12), d: 1.4, type: 'sine', v: .03, a: .3, delay: i * .08 })).concat([{ f: 300, f2: 1400, d: 1.2, glide: 1, type: 'triangle', v: .03 }, { n: 1, ft: 'highpass', f: 3000, d: .3, v: .08, delay: 1.2 }]))
};
/* draws finisher `id` in layer L from hero point h to target point m; W/H = layer size. Resolves when done. */
function runFinisher() { return HOOK.call('runFinisher', runFinisherBase, arguments); }   // v33: the light show is drawn on top (35)
function runFinisherBase(id, L, h, m, W, H) {
  const P = (x, y) => ({ x, y }), R = (a, b) => a + Math.random() * (b - a), out = [];
  const add = a => { if (a) out.push(a.finished.catch(() => { })); };
  switch (id) {
    case 'fin_thunder': {
      const dark = document.createElement('div'); dark.className = 'findark'; L.appendChild(dark);
      dark.animate([{ opacity: 0 }, { opacity: .7, offset: .15 }, { opacity: .7, offset: .8 }, { opacity: 0 }], { duration: 1500, fill: 'both' }).onfinish = () => dark.remove();
      [0, 260, 520].forEach((d, i) => { finBolt(L, m.x + (i - 1) * 18, -10, m.y + 10, 250 + d); finFlash(L, 'rgba(255,255,220,.75)', 220, 300 + d); });
      for (let i = 0; i < 10; i++) add(finBit(L, pick(['⚡', '✨']), m, P(m.x + R(-90, 90), m.y + R(-80, 50)), { d: 600, delay: 900, size: 26 }));
      break;
    }
    case 'fin_meteor': {
      const a = P(W + 60, -80), mid = P((W + m.x) / 2, m.y * .25);
      add(finBit(L, '☄️', a, m, { mid, d: 760, size: 92, s0: .5, sm: 1, s1: 1.4, o1: 1, ease: 'cubic-bezier(.5,0,.9,.6)', r0: -20, r1: -20 }));
      setTimeout(() => { finFlash(L, 'rgba(255,150,40,.85)', 360); fx.shake($('#stage') || L, 16, 500); }, 740);
      for (let i = 0; i < 16; i++) add(finBit(L, pick(['🔥', '💥', '🪨', '✨']), m, P(m.x + R(-130, 130), m.y + R(-110, 40)), { d: 700, delay: 760, size: R(20, 34) }));
      break;
    }
    case 'fin_frost': {
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = 120; add(finBit(L, '❄️', P(m.x + Math.cos(a) * r, m.y + Math.sin(a) * r), m, { d: 650, delay: i * 25, size: 26, s1: .4, o1: 1, r1: 180 })); }
      const ice = document.createElement('div'); ice.className = 'finice'; ice.style.left = (m.x - 70) + 'px'; ice.style.top = (m.y - 80) + 'px'; L.appendChild(ice);
      ice.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: .9, transform: 'scale(1)', offset: .5 }, { opacity: .9, transform: 'scale(1)', offset: .8 }, { opacity: 0, transform: 'scale(1.3)' }], { duration: 1100, delay: 600, fill: 'both' }).onfinish = () => ice.remove();
      setTimeout(() => finFlash(L, 'rgba(200,240,255,.8)', 260), 1350);
      for (let i = 0; i < 12; i++) add(finBit(L, pick(['💎', '❄️', '✨']), m, P(m.x + R(-120, 120), m.y + R(-100, 60)), { d: 600, delay: 1400, size: 22 }));
      break;
    }
    case 'fin_tornado': {
      for (let i = 0; i < 22; i++) {
        const s = document.createElement('span'), a0 = Math.random() * 6.28; s.className = 'finbit'; s.textContent = pick(['🍃', '🍂', '🌿', '💨']); s.style.fontSize = R(18, 30) + 'px'; L.appendChild(s);
        const kf = []; for (let k = 0; k <= 8; k++) { const a = a0 + k * 1.1, r = 60 - k * 4 + (k > 6 ? 30 : 0); kf.push({ transform: `translate(${m.x + Math.cos(a) * r}px,${m.y + 40 - k * 16}px) translate(-50%,-50%) rotate(${k * 60}deg)`, opacity: k === 8 ? 0 : 1 }); }
        const an = s.animate(kf, { duration: 1400, delay: i * 30, easing: 'linear', fill: 'both' }); an.onfinish = () => s.remove(); add(an);
      }
      setTimeout(() => finFlash(L, 'rgba(180,255,180,.5)', 260), 1300);
      break;
    }
    case 'fin_rainbow': {
      const beam = document.createElement('div'), dx = m.x - h.x, dy = m.y - h.y, len = Math.hypot(dx, dy); beam.className = 'finbeam';
      beam.style.left = h.x + 'px'; beam.style.top = h.y + 'px'; beam.style.width = len + 'px'; beam.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`; L.appendChild(beam);
      beam.animate([{ clipPath: 'inset(0 100% 0 0)', opacity: 1 }, { clipPath: 'inset(0 0 0 0)', opacity: 1, offset: .35 }, { clipPath: 'inset(0 0 0 0)', opacity: 1, offset: .8 }, { clipPath: 'inset(0 0 0 0)', opacity: 0 }], { duration: 1300, fill: 'both' }).onfinish = () => beam.remove();
      for (let i = 0; i < 14; i++) add(finBit(L, pick(['✨', '🌟', '💫']), m, P(m.x + R(-110, 110), m.y + R(-100, 60)), { d: 650, delay: 500 + i * 30, size: 24 }));
      setTimeout(() => finFlash(L, 'rgba(255,255,255,.6)', 240), 520);
      break;
    }
    case 'fin_dragon': {
      add(finBit(L, '🐉', P(-80, m.y - 60), P(W + 80, m.y - 90), { mid: P(m.x - 40, m.y - 110), d: 1500, size: 96, s0: 1, sm: 1.1, s1: 1, o0: 1, o1: 1, ease: 'linear' }));
      for (let i = 0; i < 18; i++) add(finBit(L, pick(['🔥', '🔥', '✨']), P(m.x - 120 + i * 9, m.y - 70), P(m.x + R(-80, 80), m.y + R(-40, 60)), { d: 600, delay: 400 + i * 35, size: R(22, 36) }));
      setTimeout(() => finFlash(L, 'rgba(255,120,40,.55)', 300), 800);
      break;
    }
    case 'fin_tiger': {
      add(finBit(L, '🐯', P(h.x, h.y), P(m.x - 10, m.y - 10), { mid: P((h.x + m.x) / 2, Math.min(h.y, m.y) - 110), d: 650, size: 86, s0: .6, sm: 1.2, s1: 1.1, o1: 1 }));
      [0, 140, 280].forEach((d, i) => setTimeout(() => fx.slash ? slashIn(L, m.x + (i - 1) * 22, m.y - 10) : null, 650 + d));
      setTimeout(() => finFlash(L, 'rgba(255,190,60,.6)', 260), 700);
      for (let i = 0; i < 10; i++) add(finBit(L, pick(['💥', '✨', '🧡']), m, P(m.x + R(-100, 100), m.y + R(-90, 50)), { d: 600, delay: 900, size: 24 }));
      break;
    }
    /* v25 */
    case 'fin_blossom': {   /* petals spiral in from all round, then burst pink */
      for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, r = 150; add(finBit(L, pick(['🌸', '🌺', '💮']), P(m.x + Math.cos(a) * r, m.y + Math.sin(a) * r), m, { mid: P(m.x + Math.cos(a + 1.2) * r * .55, m.y + Math.sin(a + 1.2) * r * .55), d: 900, delay: i * 30, size: R(20, 30), s1: .5, r1: 360, o1: .9 })); }
      setTimeout(() => finFlash(L, 'rgba(255,170,210,.6)', 280), 1050);
      for (let i = 0; i < 12; i++) add(finBit(L, pick(['🌸', '✨']), m, P(m.x + R(-120, 120), m.y + R(-100, 60)), { d: 600, delay: 1100, size: 22 }));
      break;
    }
    case 'fin_tidal': {   /* a wall of waves rolls in from the hero's side and crashes over the monster */
      for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) add(finBit(L, '🌊', P(-60 - i * 34, m.y + 40 - row * 34), P(m.x + 40 + i * 10, m.y + 30 - row * 40), { d: 900, delay: row * 90 + i * 40, size: 44 - row * 6, s0: .9, s1: 1.2, o0: 1, o1: .2, ease: 'cubic-bezier(.3,.1,.5,1)' }));
      setTimeout(() => finFlash(L, 'rgba(120,200,255,.6)', 300), 950);
      for (let i = 0; i < 14; i++) add(finBit(L, pick(['💧', '🫧']), m, P(m.x + R(-120, 120), m.y + R(-120, 20)), { d: 650, delay: 1000, size: R(16, 26) }));
      break;
    }
    case 'fin_eagle': {   /* a great bird circles high, then dives onto the monster */
      add(finBit(L, '🦅', P(W * .15, -60), P(m.x, m.y - 10), { mid: P(W * .85, m.y * .2), mo: .55, d: 1000, size: 80, s0: .7, sm: 1, s1: 1.3, o0: 1, o1: 1, ease: 'cubic-bezier(.4,0,.8,.6)', r1: 30 }));
      setTimeout(() => { finFlash(L, 'rgba(255,255,255,.65)', 220); fx.shake($('#stage') || L, 10, 300); }, 980);
      for (let i = 0; i < 14; i++) add(finBit(L, pick(['🪶', '💨', '✨']), m, P(m.x + R(-130, 130), m.y + R(-110, 50)), { d: 650, delay: 1000, size: R(18, 28), r1: R(-120, 120) }));
      break;
    }
    case 'fin_volcano': {   /* the ground under the monster rumbles, then fire and rocks erupt upward */
      fx.shake($('#stage') || L, 6, 600);
      for (let i = 0; i < 20; i++) { const x = m.x + R(-50, 50); add(finBit(L, pick(['🔥', '🔥', '🪨', '💥']), P(x, H + 30), P(x + R(-40, 40), m.y - R(60, 170)), { mid: P(x, m.y + 20), mo: .4, d: 900, delay: 500 + i * 25, size: R(22, 38), s0: .6, s1: 1, o1: 0 })); }
      setTimeout(() => finFlash(L, 'rgba(255,110,40,.6)', 320), 650);
      break;
    }
    case 'fin_galaxy': {   /* the screen goes dark and stars swirl round the monster, closing in */
      const dark = document.createElement('div'); dark.className = 'findark'; dark.style.background = 'radial-gradient(circle at 50% 50%,rgba(60,20,120,.6),rgba(5,0,25,.9))'; L.appendChild(dark);
      dark.animate([{ opacity: 0 }, { opacity: .85, offset: .2 }, { opacity: .85, offset: .8 }, { opacity: 0 }], { duration: 1600, fill: 'both' }).onfinish = () => dark.remove();
      for (let i = 0; i < 14; i++) {
        const s = document.createElement('span'), a0 = i / 14 * Math.PI * 2; s.className = 'finbit'; s.textContent = pick(['⭐', '✨', '💫', '🪐']); s.style.fontSize = R(18, 30) + 'px'; L.appendChild(s);
        const kf = []; for (let k = 0; k <= 8; k++) { const a = a0 + k * .7, r = 140 - k * 16; kf.push({ transform: `translate(${m.x + Math.cos(a) * r}px,${m.y + Math.sin(a) * r * .7}px) translate(-50%,-50%) scale(${1 - k * .08})`, opacity: k === 8 ? 0 : 1 }); }
        const an = s.animate(kf, { duration: 1200, delay: 150 + i * 20, easing: 'ease-in', fill: 'both' }); an.onfinish = () => s.remove(); add(an);
      }
      setTimeout(() => finFlash(L, 'rgba(200,160,255,.75)', 300), 1300);
      break;
    }
    default: {   // starfall
      for (let i = 0; i < 16; i++) { const tx = m.x + R(-60, 60), ty = m.y + R(-50, 30); add(finBit(L, pick(['⭐', '🌟', '✨']), P(tx + 160, -40 - R(0, 80)), P(tx, ty), { d: 520, delay: i * 45, size: R(24, 40), s0: .8, s1: 1.2, o1: .1, ease: 'cubic-bezier(.6,0,1,.7)', r1: 200 })); }
      setTimeout(() => finFlash(L, 'rgba(255,240,170,.7)', 280), 900);
      for (let i = 0; i < 10; i++) add(finBit(L, '✨', m, P(m.x + R(-120, 120), m.y + R(-100, 60)), { d: 600, delay: 950, size: 22 }));
    }
  }
  return new Promise(res => setTimeout(res, 1650));
}
function slashIn(L, x, y) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); el.setAttribute('viewBox', '-60 -60 120 120'); el.setAttribute('class', 'fxslash'); el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.width = '150px';
  el.innerHTML = '<path d="M-40 -46 L36 44" fill="none" stroke="#FFD166" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="100"/>';
  L.appendChild(el); el.querySelector('path').animate([{ strokeDashoffset: 100 }, { strokeDashoffset: 0, offset: .5 }, { strokeDashoffset: -100 }], { duration: 300, fill: 'forwards' });
  el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 360 }).onfinish = () => el.remove();
}
function finBanner(L, it) {
  const b = document.createElement('div'); b.className = 'finbanner'; b.innerHTML = `<span>${it.fem}</span><b>${esc(finName(it))}!</b>`; L.appendChild(b);
  b.animate([{ opacity: 0, transform: 'translate(-50%,-50%) scale(.4) rotate(-6deg)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1.15) rotate(2deg)', offset: .18 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: .75 }, { opacity: 0, transform: 'translate(-50%,-60%) scale(.95)' }], { duration: 1500, fill: 'both' }).onfinish = () => b.remove();
}
/* the finisher in battle: hero leaps, effect plays, monster takes the hit */
function finisherSeq() { return HOOK.call('finisherSeq', finisherSeqBase, arguments); }   // v31: extensions register with HOOK (00c)
async function finisherSeqBase(dmg) {
  const tk = B.token, it = finOf(), h = hs(), m = ms(), L = fx.layer(), st = $('#stage');
  announce(t('fin.sr', { f: finName(it), m: monName(), d: dmg }));
  if (S.sensory || !L || !st) { B.mHp = Math.max(0, B.mHp - dmg); fx.num(fx.pos(m).x, fx.pos(m).y - 30, t('fin.hit', { f: finName(it), d: dmg }), 'crit'); updateHud(); await wait(400); return B.token === tk; }
  const ph = fx.pos(h), pm = fx.pos(m), r = st.getBoundingClientRect();
  st.classList.add('finishing'); h.classList.add('charging'); pose(h, 'attack', 1600); finBanner(L, it); (FIN_SFX[it.id] || FIN_SFX.fin_starfall)();
  await wait(350); if (B.token !== tk) { st.classList.remove('finishing'); return false; }
  h.classList.remove('charging');
  const done = runFinisher(it.id, L, { x: ph.x, y: ph.y - ph.h * .1 }, { x: pm.x, y: pm.y - pm.h * .05 }, r.width, r.height);
  await wait(900); if (B.token !== tk) { st.classList.remove('finishing'); return false; }
  B.mHp = Math.max(0, B.mHp - dmg); pose(m, 'hurt', 900); flashSprite(m); sfx.crit(); fx.num(pm.x, pm.y - pm.h * .45, '−' + dmg, 'crit'); updateHud();
  await done; st.classList.remove('finishing');
  return B.token === tk;
}
/* the combo meter on the stage: 🔥 and five pips that fill toward the finisher */
function comboHTML() {
  const c = B.combo || 0, k = c % FIN_EVERY;
  if (c < 1) return '';
  return `<span class="cmb-f" aria-hidden="true">🔥</span>${Array.from({ length: FIN_EVERY }, (_, i) => `<i class="${i < k ? 'on' : ''} ${k === FIN_EVERY - 1 && i === FIN_EVERY - 1 ? 'next' : ''}"></i>`).join('')}<b>${c}</b>`;
}
/* Armory preview: plays a finisher on a little practice dummy */
async function finPreview(id, host) {
  if (!host || host.dataset.busy) return; host.dataset.busy = '1';
  const L = host.querySelector('.finpv-l'), r = host.getBoundingClientRect(), it = ITEM[id];
  host.classList.add('on'); finBanner(L, it); (FIN_SFX[id] || FIN_SFX.fin_starfall)();
  await runFinisher(id, L, { x: r.width * .2, y: r.height * .65 }, { x: r.width * .74, y: r.height * .58 }, r.width, r.height);
  host.classList.remove('on'); delete host.dataset.busy;
}
function finStageHTML() {
  return `<p class="sub">${t('fin.note')}</p><div class="finpv" id="finPv" aria-hidden="true"><div class="finpv-hero">${heroSVG(S.equipped)}</div><div class="finpv-dummy">${monsterSVG(monsterFor('math', 3))}</div><div class="finpv-l"></div></div>`;
}
