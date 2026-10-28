/* v34: the light show, as a real ES module. It is loaded the first time a finisher plays (or is previewed), so the
   32 KB of painting code is not in the first download. makeVFX gets the three helpers it needs from the game. */
/* v33 light show notes:
   Every finisher used to be a handful of flying emoji. Now each of the 13 also gets its own painted light show on a
   little canvas: a charge-up around the hero, then a themed attack (falling stars, forked lightning, a burning
   meteor, ice spikes, a twister, a rainbow bridge, a fire dragon, tiger claws, a petal storm, a tidal wave, a
   golden eagle, an erupting volcano, a spinning galaxy) and a big impact. The old emoji effects still play
   underneath, so nothing is lost. Quiet mode / reduced motion skip all of it (the old code already does that). */
export function makeVFX($, fx, pick, document, window, requestAnimationFrame) {
return (() => {
  const R = (a, b) => a + Math.random() * (b - a), TAU = Math.PI * 2;
  const glowCache = {};
  const dotSpr = c => {
    if (glowCache[c]) return glowCache[c];
    const k = document.createElement('canvas'); k.width = k.height = 64; const g = k.getContext('2d');
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.22, `rgba(${c},.9)`); r.addColorStop(.6, `rgba(${c},.28)`); r.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); return (glowCache[c] = k);
  };
  /* the little scene object every recipe paints with */
  function scene(cv, W, H, dpr) {
    const g = cv.getContext('2d'), P = [], FX = [], EV = [];
    let t = 0;
    const V = {
      W, H, g,
      get t() { return t; },
      p(o) {   // a particle. times in seconds, speeds in px/s
        if (P.length > 1100) return null;
        const p = Object.assign({ x: 0, y: 0, vx: 0, vy: 0, gy: 0, drag: 0, life: .6, size: 6, size2: -1, c: '255,255,255', a: 1, shape: 'dot', rot: 0, vr: 0, age: 0, add: true }, o);
        if (p.size2 < 0) p.size2 = p.size * (p.shape === 'dot' ? .3 : .6);
        P.push(p); return p;
      },
      burst(x, y, n, o = {}) {
        const sp = o.speed || 220, a0 = o.a0 == null ? 0 : o.a0, a1 = o.a1 == null ? TAU : o.a1;
        for (let i = 0; i < n; i++) {
          const a = R(a0, a1), s = sp * R(.35, 1);
          V.p(Object.assign({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: R(.35, .8), size: R(3, 7), drag: 1.8 }, o.p || {}, o.c ? { c: Array.isArray(o.c) ? o.c[i % o.c.length] : o.c } : {}));
        }
      },
      at(ms, fn) { EV.push({ at: ms / 1000, fn }); },
      fx(a, b, fn) { FX.push({ a: a / 1000, b: b / 1000, fn }); },
      /* a soft glow ball */
      glow(x, y, r0, r1, a, b, c, al = .8) { V.fx(a, b, (g, k) => { const r = r0 + (r1 - r0) * k; g.globalAlpha = al * (1 - k * k); g.drawImage(dotSpr(c), x - r, y - r, r * 2, r * 2); }); },
      /* a ring on the ground (squashed) or flat */
      ring(x, y, r0, r1, a, b, c, w = 4, sq = .38) { V.fx(a, b, (g, k) => { const r = r0 + (r1 - r0) * (1 - Math.pow(1 - k, 2.2)); g.globalAlpha = (1 - k) * .95; g.strokeStyle = `rgba(${c},1)`; g.lineWidth = w * (1 - k * .6); g.beginPath(); g.ellipse(x, y, r, r * sq, 0, 0, TAU); g.stroke(); }); },
      tint(a, b, c, al) { V.fx(a, b, (g, k) => { g.globalCompositeOperation = 'source-over'; g.globalAlpha = al * Math.min(1, k * 6, (1 - k) * 4); g.fillStyle = c; g.fillRect(0, 0, W, H); }); },
      /* light beams in a star shape */
      flare(x, y, len, a, b, c, rays = 4) { V.fx(a, b, (g, k) => { const L = len * (k < .25 ? k * 4 : 1 - (k - .25) * .6); g.globalAlpha = 1 - k; g.fillStyle = `rgba(${c},.9)`; for (let i = 0; i < rays; i++) { const an = i * Math.PI / rays * 2 + k * .8; g.save(); g.translate(x, y); g.rotate(an); g.beginPath(); g.moveTo(-L, 0); g.lineTo(0, -L * .045); g.lineTo(L, 0); g.lineTo(0, L * .045); g.fill(); g.restore(); } g.drawImage(dotSpr(c), x - L * .3, y - L * .3, L * .6, L * .6); }); },
      /* forked lightning from (x1,y1) to (x2,y2) */
      bolt(x1, y1, x2, y2, a, dur, c = '190,170,255', w = 4, amp = 26) {
        const jag = (ax, ay, bx, by, n, am) => { const q = [[ax, ay]]; for (let i = 1; i < n; i++) { const k = i / n; q.push([ax + (bx - ax) * k + R(-am, am), ay + (by - ay) * k + R(-am * .35, am * .35)]); } q.push([bx, by]); return q; };
        const main = jag(x1, y1, x2, y2, 9, amp), forks = [];
        for (let i = 0; i < 3; i++) { const s = main[2 + Math.floor(Math.random() * 5)]; forks.push(jag(s[0], s[1], s[0] + R(-70, 70), s[1] + R(40, 90), 5, amp * .7)); }
        V.fx(a, a + dur, (g, k) => {
          const f = Math.sin(k * 42) > -.35 ? 1 : .35, line = (q, ww, st, al) => { g.globalAlpha = al * f * (1 - k * .7); g.strokeStyle = st; g.lineWidth = ww; g.lineJoin = 'round'; g.beginPath(); q.forEach((pt, i) => i ? g.lineTo(pt[0], pt[1]) : g.moveTo(pt[0], pt[1])); g.stroke(); };
          line(main, w * 4, `rgba(${c},.28)`, 1); line(main, w * 1.8, `rgba(${c},.9)`, 1); line(main, w * .7, '#fff', 1);
          forks.forEach(q => { line(q, w * 2, `rgba(${c},.5)`, 1); line(q, w * .5, '#fff', .9); });
        });
      },
      /* the surprise bang that every finisher ends with */
      impact(x, y, c, big = 1) {
        V.glow(x, y, 20, 150 * big, 0, 520, c, .95); V.glow(x, y, 8, 70 * big, 0, 300, '255,255,255', 1);
        V.ring(x, y + 26, 10, 150 * big, 0, 600, c, 5); V.ring(x, y + 26, 6, 100 * big, 90, 600, '255,255,255', 3);
        V.flare(x, y, 150 * big, 0, 520, c);
        V.burst(x, y, Math.round(34 * big), { speed: 330 * big, c, p: { shape: 'line', size: 2.4, life: .5, trail: .045 } });
        V.burst(x, y, Math.round(22 * big), { speed: 200, p: { gy: 420, size: 5, life: .9, c } });
      },
      /* a charge-up: light flows into the hero while a pillar of light grows */
      charge(h, c, ms = 560) {
        V.fx(0, ms, (g, k, dt) => {
          for (let i = 0; i < 3; i++) { const an = R(0, TAU), d = R(60, 110), life = .32, x = h.x + Math.cos(an) * d, y = h.y + Math.sin(an) * d * .8; V.p({ x, y, vx: -Math.cos(an) * d / life, vy: -Math.sin(an) * d * .8 / life, life, size: R(3, 6), size2: 1, c }); }
          g.globalAlpha = .55 * k; const r = 30 + 22 * k; g.drawImage(dotSpr(c), h.x - r, h.y - r, r * 2, r * 2);
          g.globalAlpha = .5 * k; g.fillStyle = `rgba(${c},1)`; g.fillRect(h.x - 3 - 6 * k, 0, 6 + 12 * k, h.y);
        });
        V.ring(h.x, h.y + 34, 70, 14, 0, ms, c, 3);
      },
      shake(amp, ms) { const st = $('#stage'); if (st && fx) fx.shake(st, amp, ms); }
    };
    V.step = dt => {
      t += dt;
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      for (let i = EV.length - 1; i >= 0; i--) if (EV[i].at <= t) { const e = EV.splice(i, 1)[0]; try { e.fn(); } catch (x) { /* a recipe slip never stops the game */ } }
      g.globalCompositeOperation = 'lighter';
      FX.forEach(f => { if (t < f.a || t > f.b) return; g.save(); g.globalCompositeOperation = 'lighter'; try { f.fn(g, (t - f.a) / (f.b - f.a || 1), dt); } catch (x) { /* ignore */ } g.restore(); });
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i]; p.age += dt; const k = p.age / p.life;
        if (k >= 1) { P.splice(i, 1); if (p.die) { try { p.die(p); } catch (x) { /* ignore */ } } continue; }
        if (p.drag) { const d = Math.max(0, 1 - p.drag * dt); p.vx *= d; p.vy *= d; }
        p.vy += p.gy * dt; if (p.f) p.f(p, dt, k); p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        if (p.trail && p.shape !== 'line') V.p({ x: p.x, y: p.y, life: .28, size: p.size * .8, size2: 1, c: p.tc || p.c, a: .7 });
        const sz = p.size + (p.size2 - p.size) * k, al = p.a * Math.min(1, k * 8) * (1 - Math.pow(k, 1.6));
        g.globalCompositeOperation = p.add ? 'lighter' : 'source-over'; g.globalAlpha = Math.max(0, al);
        if (p.shape === 'dot') g.drawImage(dotSpr(p.c), p.x - sz, p.y - sz, sz * 2, sz * 2);
        else if (p.shape === 'line') { const tl = p.trail || .04; g.strokeStyle = `rgba(${p.c},1)`; g.lineWidth = sz; g.lineCap = 'round'; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * tl, p.y - p.vy * tl); g.stroke(); }
        else {
          g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = `rgba(${p.c},1)`; g.beginPath();
          if (p.shape === 'star') { for (let j = 0; j < 8; j++) { const rr = j % 2 ? sz * .32 : sz; g.lineTo(Math.cos(j * Math.PI / 4) * rr, Math.sin(j * Math.PI / 4) * rr); } }
          else if (p.shape === 'petal') { g.ellipse(0, 0, sz, sz * .52, 0, 0, TAU); }
          else if (p.shape === 'shard') { g.moveTo(0, -sz * 1.4); g.lineTo(sz * .55, sz * .7); g.lineTo(-sz * .55, sz * .7); }
          else if (p.shape === 'feather') { g.moveTo(-sz, 0); g.quadraticCurveTo(0, -sz * .6, sz, 0); g.quadraticCurveTo(0, sz * .5, -sz, 0); }
          else g.arc(0, 0, sz, 0, TAU);
          g.closePath(); g.fill(); g.restore();
        }
      }
      return t;
    };
    V.alive = () => P.length > 0 || EV.length > 0 || FX.some(f => f.b > t);
    return V;
  }

  /* ------------ one recipe per finisher ------------ */
  const REC = {
    fin_starfall(V, h, m, u) {
      const C = ['255,226,110', '255,255,255', '255,190,70'];
      V.charge(h, '255,226,110'); V.tint(250, 1500, '12,10,40', .35);
      for (let i = 0; i < 40; i++) V.at(380 + i * 14 + R(0, 90), () => {
        const tx = m.x + R(-80, 80) * u, ty = m.y + R(-40, 50) * u, sx = tx + R(100, 240) * u, sy = -20, T = R(.32, .5);
        V.p({ x: sx, y: sy, vx: (tx - sx) / T, vy: (ty - sy) / T, life: T, size: R(7, 14) * u, size2: 6, c: pick(C), shape: 'star', trail: 1, tc: '255,226,110', vr: R(-6, 6), die: p => V.burst(p.x, p.y, 6, { speed: 110, c: '255,236,150', p: { size: 3, life: .4 } }) });
      });
      V.at(900, () => { V.impact(m.x, m.y, '255,226,110', 1.25); for (let i = 0; i < 8; i++) V.p({ x: m.x, y: m.y, vx: Math.cos(i * TAU / 8) * 160, vy: Math.sin(i * TAU / 8) * 160, life: .8, size: 12 * u, c: '255,255,200', shape: 'star', vr: 4, drag: 1.4 }); });
    },
    fin_thunder(V, h, m, u) {
      V.charge(h, '200,180,255'); V.tint(200, 1700, '8,4,30', .6);
      [420, 640, 860].forEach((a, i) => { const x = m.x + (i - 1) * 26 * u; V.at(a, () => { V.bolt(x, -10, m.x + (i - 1) * 6, m.y, 0, 330, '190,170,255', 4.5 * u, 30 * u); V.glow(m.x, m.y, 10, 130 * u, 0, 260, '210,190,255', .9); V.fx(0, 260, g => { g.globalAlpha = .22; g.fillStyle = '#fff'; g.fillRect(0, 0, V.W, V.H); }); V.shake(7, 200); }); });
      V.at(860, () => { for (let i = 0; i < 9; i++) { const an = i * TAU / 9 + R(-.2, .2); V.bolt(m.x, m.y + 24 * u, m.x + Math.cos(an) * 120 * u, m.y + 24 * u + Math.sin(an) * 40 * u, 0, 280, '255,240,150', 2.4 * u, 12 * u); } V.ring(m.x, m.y + 24 * u, 10, 160 * u, 0, 600, '210,190,255', 5); V.burst(m.x, m.y, 40, { speed: 340, c: ['255,245,160', '200,180,255'], p: { shape: 'line', size: 2.2, trail: .05, life: .6, gy: 300 } }); });
      V.fx(900, 1500, (g, k) => { for (let i = 0; i < 2; i++) { const an = R(0, TAU); const x2 = m.x + Math.cos(an) * R(20, 60) * u, y2 = m.y + Math.sin(an) * R(20, 70) * u; g.globalAlpha = .9 * (1 - k); g.strokeStyle = 'rgba(230,220,255,1)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(m.x, m.y); g.lineTo((m.x + x2) / 2 + R(-8, 8), (m.y + y2) / 2 + R(-8, 8)); g.lineTo(x2, y2); g.stroke(); } });
    },
    fin_meteor(V, h, m, u) {
      V.charge(h, '255,150,60'); V.tint(250, 1500, '40,8,0', .35);
      const sx = V.W + 80, sy = -90, T = .62;
      V.at(300, () => {
        const ball = V.p({ x: sx, y: sy, vx: (m.x - sx) / T, vy: (m.y - sy) / T, life: T, size: 40 * u, size2: 46 * u, c: '255,170,70', a: 1, die: () => 0 });
        V.p({ x: sx, y: sy, vx: (m.x - sx) / T, vy: (m.y - sy) / T, life: T, size: 20 * u, size2: 24 * u, c: '255,255,230', a: 1 });
        const em = { x: sx, y: sy }; V.fx(300, 300 + T * 1000, (g, k) => { for (let i = 0; i < 5; i++) { const x = sx + (m.x - sx) * k, y = sy + (m.y - sy) * k; V.p({ x: x + R(-10, 10), y: y + R(-10, 10), vx: R(40, 140), vy: R(-30, 60), life: R(.4, .8), size: R(12, 22) * u, size2: 3, c: pick(['255,120,30', '255,190,70', '230,60,20']) }); if (i < 2) V.p({ x, y, vx: R(60, 160), vy: R(-20, 40), life: R(.7, 1.1), size: R(14, 24) * u, size2: 30 * u, c: '70,50,50', add: false, a: .5 }); } });
      });
      V.at(300 + T * 1000, () => {
        V.impact(m.x, m.y, '255,150,60', 1.6); V.glow(m.x, m.y, 30, 220 * u, 0, 700, '255,200,100', 1); V.shake(12, 500);
        V.burst(m.x, m.y + 10, 30, { speed: 300, a0: Math.PI * 1.1, a1: Math.PI * 1.9, p: { shape: 'shard', c: '70,55,50', add: false, gy: 700, size: 7, life: 1, vr: 8, a: 1 } });
        V.burst(m.x, m.y, 40, { speed: 240, c: ['255,180,60', '255,90,20'], p: { gy: 300, size: 6, life: 1.1, drag: 1 } });
        V.p({ x: m.x, y: m.y + 20, vx: 0, vy: -90, life: 1.1, size: 40 * u, size2: 80 * u, c: '60,45,45', add: false, a: .55 });
      });
    },
    fin_frost(V, h, m, u) {
      V.charge(h, '160,225,255'); V.tint(250, 1700, '10,40,80', .4);
      const gy = m.y + 36 * u;
      for (let i = 0; i < 11; i++) V.at(420 + i * 45, () => {
        const x = m.x + (i - 5) * 17 * u + R(-5, 5), hh = R(60, 120) * u * (1 - Math.abs(i - 5) / 9), w = R(11, 17) * u;
        V.fx(0, 900, (g, k) => { const gr = Math.min(1, k * 4), f = k > .78 ? (k - .78) / .22 : 0, ht = hh * (1 - Math.pow(1 - gr, 3)); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 1 - f; const lg = g.createLinearGradient(x, gy, x, gy - ht); lg.addColorStop(0, 'rgba(120,200,255,.95)'); lg.addColorStop(1, 'rgba(235,252,255,.95)'); g.fillStyle = lg; g.beginPath(); g.moveTo(x - w / 2, gy); g.lineTo(x - w * .1, gy - ht); g.lineTo(x + w * .1, gy - ht); g.lineTo(x + w / 2, gy); g.fill(); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.4; g.stroke(); });
        V.ring(x, gy, 4, 36 * u, 0, 400, '200,240,255', 2);
        V.at(900, () => V.burst(x, gy - hh * .6, 6, { speed: 230, c: ['220,250,255', '140,210,255'], p: { shape: 'shard', size: 5, add: true, gy: 520, life: .8, vr: 9 } }));
      });
      V.fx(300, 1700, g => { for (let i = 0; i < 3; i++) V.p({ x: R(0, V.W), y: -10, vx: R(-40, 20), vy: R(120, 240), life: 1.2, size: R(2, 4), c: '235,250,255' }); });
      V.at(980, () => { V.impact(m.x, m.y, '170,225,255', 1.2); V.ring(m.x, gy, 8, 190 * u, 0, 800, '230,250,255', 6, .3); V.shake(9, 400); });
    },
    fin_tornado(V, h, m, u) {
      V.charge(h, '170,255,220'); V.tint(250, 1700, '10,40,35', .3);
      const gy = m.y + 34 * u;
      V.fx(380, 1650, (g, k) => {
        const grow = Math.min(1, k * 3), fade = k > .8 ? 1 - (k - .8) / .2 : 1;
        for (let i = 0; i < 9; i++) {
          const hgt = Math.random(), r = (14 + 62 * hgt) * u * grow, an = V.t * (9 - hgt * 3) + Math.random() * TAU;
          V.p({ x: m.x + Math.cos(an) * r, y: gy - hgt * 140 * u * grow, vx: -Math.sin(an) * 70, vy: -12, life: .45, size: R(3, 6) * u, size2: 1, c: pick(['190,255,235', '255,255,255', '120,230,200']), a: .9 * fade });
        }
        g.globalAlpha = .18 * fade; g.fillStyle = 'rgba(180,255,230,1)'; g.beginPath(); g.moveTo(m.x - 14 * u * grow, gy); g.lineTo(m.x - 70 * u * grow, gy - 140 * u * grow); g.lineTo(m.x + 70 * u * grow, gy - 140 * u * grow); g.lineTo(m.x + 14 * u * grow, gy); g.fill();
        if (Math.random() < .4) V.p({ x: m.x + R(-50, 50) * u, y: gy - R(0, 120) * u, vx: R(-120, 120), vy: R(-90, -20), life: .9, size: R(4, 7) * u, c: '110,170,90', shape: 'petal', vr: 12, add: false, a: .9 });
      });
      V.at(850, () => { V.ring(m.x, gy, 10, 130 * u, 0, 700, '190,255,235', 5, .3); V.shake(8, 600); });
      V.at(1400, () => V.impact(m.x, m.y - 20 * u, '170,255,220', 1));
    },
    fin_rainbow(V, h, m, u) {
      const RB = ['255,70,90', '255,160,60', '255,236,80', '90,230,110', '80,190,255', '110,110,255', '200,100,255'];
      V.charge(h, '255,255,255');
      const mid = { x: (h.x + m.x) / 2, y: Math.min(h.y, m.y) - 130 * u }, pt = k => { const a = 1 - k; return { x: a * a * h.x + 2 * a * k * mid.x + k * k * m.x, y: a * a * h.y + 2 * a * k * mid.y + k * k * m.y }; };
      V.fx(300, 1500, (g, k) => {
        const rev = Math.min(1, k * 2.6), fade = k > .7 ? 1 - (k - .7) / .3 : 1;
        RB.forEach((c, i) => { g.globalAlpha = .85 * fade; g.strokeStyle = `rgba(${c},1)`; g.lineWidth = 5.5 * u; g.lineCap = 'round'; g.beginPath(); for (let j = 0; j <= 40; j++) { const q = pt(j / 40 * rev); if (j) g.lineTo(q.x, q.y + (i - 3) * 5.6 * u); else g.moveTo(q.x, q.y + (i - 3) * 5.6 * u); } g.stroke(); });
        const q = pt(rev); for (let i = 0; i < 3; i++) V.p({ x: q.x + R(-10, 10), y: q.y + R(-14, 14), vx: R(-40, 40), vy: R(-50, 30), life: .6, size: R(3, 6) * u, c: pick(RB), a: fade });
      });
      V.at(800, () => { RB.forEach((c, i) => V.ring(m.x, m.y + 24 * u, 8, (60 + i * 24) * u, i * 40, 700, c, 4)); V.burst(m.x, m.y, 60, { speed: 360, c: RB, p: { size: 5, life: .9, drag: 1.4 } }); V.glow(m.x, m.y, 20, 180 * u, 0, 600, '255,255,255', .9); V.flare(m.x, m.y, 170 * u, 0, 600, '255,255,255', 6); V.shake(8, 400); });
    },
    fin_dragon(V, h, m, u) {
      V.charge(h, '255,120,40'); V.tint(250, 1700, '45,5,0', .4);
      const T = .8; let head = { x: h.x, y: h.y, an: 0 };
      V.fx(380, 380 + T * 1000, (g, k) => {
        const e = 1 - Math.pow(1 - k, 2), x = h.x + (m.x - h.x) * e, y = h.y + (m.y - h.y) * e + Math.sin(k * 11) * 34 * u * (1 - k), an = Math.atan2(m.y - h.y, m.x - h.x) + Math.cos(k * 11) * .4;
        head = { x, y, an };
        for (let i = 0; i < 8; i++) V.p({ x: x + R(-8, 8), y: y + R(-8, 8), vx: R(-70, 20), vy: R(-50, 50), life: R(.5, .9), size: R(11, 20) * u, size2: 3, c: pick(['255,110,30', '255,190,60', '255,60,20']) });
        g.save(); g.translate(x, y); g.rotate(an); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; const s = u * 1.05;
        g.fillStyle = '#7a1318'; g.beginPath(); g.moveTo(-30 * s, -14 * s); g.lineTo(18 * s, -16 * s); g.lineTo(46 * s, -4 * s); g.lineTo(46 * s, 8 * s); g.lineTo(14 * s, 16 * s); g.lineTo(-30 * s, 18 * s); g.closePath(); g.fill();
        g.fillStyle = '#c42a1c'; g.beginPath(); g.moveTo(-26 * s, -8 * s); g.lineTo(16 * s, -10 * s); g.lineTo(40 * s, -2 * s); g.lineTo(14 * s, 4 * s); g.lineTo(-26 * s, 8 * s); g.fill();
        g.fillStyle = '#ffd55a'; g.beginPath(); g.moveTo(-12 * s, -14 * s); g.lineTo(-36 * s, -32 * s); g.lineTo(-24 * s, -10 * s); g.fill(); g.beginPath(); g.moveTo(4 * s, -15 * s); g.lineTo(-14 * s, -38 * s); g.lineTo(-2 * s, -12 * s); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.moveTo(40 * s, 6 * s); g.lineTo(34 * s, 14 * s); g.lineTo(30 * s, 7 * s); g.fill();
        g.globalCompositeOperation = 'lighter'; g.fillStyle = '#ffee88'; g.beginPath(); g.arc(14 * s, -5 * s, 3.4 * s, 0, TAU); g.fill(); g.drawImage(dotSpr('255,200,60'), 4 * s, -16 * s, 22 * s, 22 * s);
        g.restore();
      });
      V.at(380 + T * 1000, () => {
        V.impact(m.x, m.y, '255,120,40', 1.5); V.shake(11, 500);
        V.fx(0, 900, (g, k) => { const ht = 170 * u * Math.min(1, k * 5) * (1 - Math.max(0, k - .7) / .3); const lg = g.createLinearGradient(0, m.y + 30 * u, 0, m.y + 30 * u - ht); lg.addColorStop(0, 'rgba(255,90,20,.9)'); lg.addColorStop(.5, 'rgba(255,190,60,.7)'); lg.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(m.x - 40 * u, m.y + 30 * u); g.quadraticCurveTo(m.x - 20 * u + Math.sin(k * 20) * 8, m.y - ht * .5, m.x, m.y + 30 * u - ht); g.quadraticCurveTo(m.x + 20 * u + Math.sin(k * 17) * 8, m.y - ht * .5, m.x + 40 * u, m.y + 30 * u); g.fill(); for (let i = 0; i < 3; i++) V.p({ x: m.x + R(-30, 30) * u, y: m.y + 20 * u, vx: R(-50, 50), vy: R(-260, -120), life: .8, size: R(4, 8) * u, c: '255,170,50' }); });
      });
    },
    fin_tiger(V, h, m, u) {
      V.charge(h, '255,170,60');
      const sl = (a, x0, y0, x1, y1, w) => V.fx(a, a + 460, (g, k) => {
        const e = Math.min(1, k * 3.2), fade = k < .4 ? 1 : 1 - (k - .4) / .6;
        for (let i = -1; i <= 1; i++) { const ox = i * 17 * u, oy = i * 6 * u, ex = x0 + ox + (x1 - x0) * e, ey = y0 + oy + (y1 - y0) * e; const dx = ex - (x0 + ox), dy = ey - (y0 + oy), L = Math.hypot(dx, dy) || 1, nx = -dy / L * w, ny = dx / L * w; g.globalAlpha = fade; g.fillStyle = 'rgba(255,190,80,.95)'; g.beginPath(); g.moveTo(x0 + ox, y0 + oy); g.quadraticCurveTo((x0 + ox + ex) / 2 + nx, (y0 + oy + ey) / 2 + ny, ex, ey); g.quadraticCurveTo((x0 + ox + ex) / 2 - nx * .2, (y0 + oy + ey) / 2 - ny * .2, x0 + ox, y0 + oy); g.fill(); g.globalAlpha = fade * .9; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x0 + ox, y0 + oy); g.quadraticCurveTo((x0 + ox + ex) / 2 + nx * .4, (y0 + oy + ey) / 2 + ny * .4, ex, ey); g.lineTo(x0 + ox, y0 + oy); g.fill(); }
      });
      V.fx(300, 760, (g, k) => { const x = h.x + (m.x - 40 * u - h.x) * Math.min(1, k * 1.5), y = h.y + (m.y - h.y) * Math.min(1, k * 1.5); for (let i = 0; i < 3; i++) V.p({ x: x + R(-14, 14), y: y + R(-14, 14), vx: R(-60, 20), vy: R(-30, 30), life: .4, size: R(9, 15) * u, c: pick(['255,140,30', '255,200,90']) }); });
      [[560, -60, -70, 70, 70], [680, 60, -70, -70, 70], [800, -70, 0, 80, 5]].forEach(([a, dx, dy, ex, ey], i) => V.at(a, () => { sl(0, m.x + dx * u, m.y + dy * u, m.x + (dx + ex * 1.8) * u, m.y + (dy + ey * 1.8) * u, 18 * u); V.burst(m.x, m.y, 10, { speed: 240, c: '255,200,90', p: { shape: 'line', size: 2.4, trail: .05 } }); V.shake(6 + i * 2, 160); }));
      V.at(920, () => { V.impact(m.x, m.y, '255,160,50', 1.3); V.fx(0, 500, (g, k) => { g.globalAlpha = .4 * (1 - k); g.fillStyle = 'rgba(255,170,60,1)'; for (let i = 0; i < 5; i++) { g.save(); g.translate(m.x + (i - 2) * 38 * u, m.y); g.rotate(.5); g.fillRect(-4 * u, -120 * u, 8 * u, 240 * u); g.restore(); } }); });
    },
    fin_blossom(V, h, m, u) {
      const PK = ['255,170,200', '255,210,225', '255,130,175', '255,255,255'];
      V.charge(h, '255,170,210'); V.tint(250, 1700, '60,10,40', .22);
      V.fx(300, 1500, (g, k) => {
        const fade = k > .75 ? 1 - (k - .75) / .25 : 1;
        for (let i = 0; i < 5; i++) { const t = Math.random(), x = h.x + (m.x - h.x) * t + Math.sin(t * 9 + V.t * 5) * 42 * u, y = h.y + (m.y - h.y) * t - Math.sin(t * Math.PI) * 70 * u + R(-36, 36) * u; V.p({ x, y, vx: R(-30, 60), vy: R(-20, 50), gy: 40, life: R(.8, 1.4), size: R(6, 11) * u, size2: 4 * u, c: pick(PK), shape: 'petal', vr: R(-7, 7), a: .95 * fade, add: false, f: (p, dt) => { p.vx += Math.sin(p.age * 6 + p.size) * 90 * dt; } }); }
      });
      V.at(900, () => {
        V.glow(m.x, m.y, 20, 190 * u, 0, 700, '255,170,210', .9);
        V.fx(0, 900, (g, k) => { const gr = Math.min(1, k * 3), fade = k > .6 ? 1 - (k - .6) / .4 : 1; g.globalCompositeOperation = 'source-over'; for (let j = 0; j < 2; j++) for (let i = 0; i < 8; i++) { g.save(); g.translate(m.x, m.y); g.rotate(i * TAU / 8 + j * .39 + k * .6); g.globalAlpha = fade * (j ? .7 : .95); g.fillStyle = j ? 'rgba(255,215,230,1)' : 'rgba(255,140,185,1)'; g.beginPath(); g.ellipse(0, -(34 + j * 24) * u * gr, 15 * u * gr, (32 + j * 22) * u * gr, 0, 0, TAU); g.fill(); g.restore(); } g.fillStyle = 'rgba(255,230,120,1)'; g.beginPath(); g.arc(m.x, m.y, 14 * u * gr, 0, TAU); g.fill(); });
        V.burst(m.x, m.y, 40, { speed: 300, c: PK, p: { shape: 'petal', size: 8 * u, life: 1.2, drag: 1.2, gy: 60, vr: 6, add: false } }); V.ring(m.x, m.y + 24 * u, 8, 150 * u, 0, 700, '255,170,210', 4); V.shake(5, 300);
      });
    },
    fin_tidal(V, h, m, u) {
      V.charge(h, '110,200,255'); V.tint(250, 1800, '0,20,60', .35);
      const gy = m.y + 38 * u, T = 1;
      V.fx(380, 1500, (g, k) => {
        const front = -120 * u + (m.x + 160 * u) * Math.min(1, k * 1.7), fade = k > .8 ? 1 - (k - .8) / .2 : 1, hgt = (90 + 30 * Math.sin(k * 6)) * u;
        g.globalCompositeOperation = 'source-over'; g.globalAlpha = .88 * fade;
        const lg = g.createLinearGradient(0, gy - hgt, 0, gy + 20 * u); lg.addColorStop(0, 'rgba(150,225,255,1)'); lg.addColorStop(1, 'rgba(20,100,200,1)'); g.fillStyle = lg; g.beginPath(); g.moveTo(front - 380 * u, gy + 20 * u);
        for (let x = front - 380 * u; x <= front; x += 8) { const q = (x - (front - 380 * u)) / (380 * u), curl = Math.pow(q, 2.2); g.lineTo(x, gy - hgt * curl + Math.sin(x * .05 + V.t * 9) * 5 * u); }
        g.lineTo(front + 22 * u, gy - hgt * .75); g.lineTo(front + 10 * u, gy - hgt * .35); g.lineTo(front, gy + 20 * u); g.closePath(); g.fill();
        g.globalCompositeOperation = 'lighter'; g.globalAlpha = .75 * fade; g.strokeStyle = 'rgba(255,255,255,1)'; g.lineWidth = 2.4; g.beginPath(); for (let x = front - 380 * u; x <= front; x += 8) { const q = (x - (front - 380 * u)) / (380 * u), curl = Math.pow(q, 2.2); const y = gy - hgt * curl + Math.sin(x * .05 + V.t * 9) * 5 * u; x === front - 380 * u ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
        for (let i = 0; i < 3; i++) V.p({ x: front + R(-20, 10), y: gy - hgt * R(.2, .9), vx: R(40, 160), vy: R(-130, -20), gy: 380, life: .7, size: R(2, 5) * u, c: '230,250,255' });
      });
      V.at(980, () => { V.impact(m.x, m.y, '110,200,255', 1.3); V.burst(m.x, m.y, 50, { speed: 330, a0: Math.PI * 1.05, a1: Math.PI * 1.95, c: ['230,250,255', '120,200,255'], p: { gy: 620, size: 5, life: 1 } }); V.ring(m.x, m.y + 30 * u, 8, 200 * u, 100, 900, '200,240,255', 5, .3); V.shake(10, 500); });
    },
    fin_eagle(V, h, m, u) {
      V.charge(h, '255,220,110'); V.tint(250, 1600, '30,25,0', .3);
      const top = { x: (h.x + m.x) / 2 - 20 * u, y: -50 * u }, T = 1.05, pt = k => { const a = 1 - k; return { x: a * a * h.x + 2 * a * k * top.x + k * k * m.x, y: a * a * h.y + 2 * a * k * top.y + k * k * m.y }; };
      V.fx(360, 360 + T * 1000, (g, k) => {
        const q = pt(Math.pow(k, 1.2)), q2 = pt(Math.min(1, Math.pow(k, 1.2) + .03)), an = Math.atan2(q2.y - q.y, q2.x - q.x), flap = Math.sin(k * 40), s = u * (1 + k * .5);
        for (let i = 0; i < 4; i++) V.p({ x: q.x + R(-8, 8), y: q.y + R(-8, 8), vx: R(-30, 30), vy: R(10, 60), life: .6, size: R(5, 8) * u, c: '255,220,110', shape: i % 2 ? 'feather' : 'dot', vr: R(-5, 5), add: true });
        g.save(); g.translate(q.x, q.y); g.rotate(an); g.globalCompositeOperation = 'lighter'; g.drawImage(dotSpr('255,210,90'), -50 * s, -50 * s, 100 * s, 100 * s); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
        g.fillStyle = '#ffe6a0'; g.beginPath(); g.moveTo(-34 * s, 0); g.quadraticCurveTo(-8 * s, -(34 + flap * 14) * s, 10 * s, -4 * s); g.quadraticCurveTo(-8 * s, -10 * s, -34 * s, 0); g.fill(); g.beginPath(); g.moveTo(-34 * s, 0); g.quadraticCurveTo(-8 * s, (34 + flap * 14) * s, 10 * s, 4 * s); g.quadraticCurveTo(-8 * s, 10 * s, -34 * s, 0); g.fill();
        g.fillStyle = '#fff6d0'; g.beginPath(); g.ellipse(6 * s, 0, 24 * s, 8 * s, 0, 0, TAU); g.fill(); g.fillStyle = '#ffb02e'; g.beginPath(); g.moveTo(28 * s, -3 * s); g.lineTo(42 * s, 3 * s); g.lineTo(28 * s, 7 * s); g.fill(); g.fillStyle = '#222'; g.beginPath(); g.arc(22 * s, -2 * s, 1.8 * s, 0, TAU); g.fill();
        g.restore();
      });
      V.at(360 + T * 1000, () => { V.impact(m.x, m.y, '255,220,110', 1.4); V.burst(m.x, m.y, 26, { speed: 300, a0: Math.PI, a1: TAU, p: { shape: 'feather', size: 9 * u, add: false, c: '255,235,170', gy: 160, life: 1.1, vr: 7, drag: 1.2 } }); V.ring(m.x, m.y, 10, 190 * u, 40, 700, '255,240,180', 3, 1); V.shake(10, 450); });
    },
    fin_volcano(V, h, m, u) {
      V.charge(h, '255,110,40'); V.tint(200, 1800, '45,6,0', .45);
      const gy = m.y + 34 * u;
      V.fx(380, 1400, (g, k) => {
        const f = Math.min(1, k * 4) * (k > .8 ? 1 - (k - .8) / .2 : 1);
        g.globalAlpha = .9 * f; g.strokeStyle = 'rgba(255,120,30,1)'; g.lineWidth = 3 * u;
        [[-70, 28], [-30, 60], [10, 44], [48, 66], [86, 30]].forEach(([dx, ht]) => { g.beginPath(); g.moveTo(m.x + dx * u, gy); g.lineTo(m.x + dx * u + R(-4, 4), gy - ht * u * f); g.lineTo(m.x + (dx + 8) * u, gy); g.stroke(); });
        g.drawImage(dotSpr('255,110,30'), m.x - 120 * u, gy - 30 * u, 240 * u, 60 * u);
        for (let i = 0; i < 4; i++) V.p({ x: m.x + R(-40, 40) * u, y: gy, vx: R(-120, 120), vy: R(-520, -260) * (.6 + f * .5), gy: 780, life: R(.8, 1.3), size: R(5, 10) * u, c: pick(['255,120,30', '255,200,70', '255,70,20']), trail: 1, tc: '255,100,20' });
        if (Math.random() < .5) V.p({ x: m.x + R(-30, 30) * u, y: gy - 10, vx: R(-30, 30), vy: R(-160, -80), life: 1.2, size: 20 * u, size2: 56 * u, c: '60,48,48', add: false, a: .5 });
      });
      V.at(700, () => { V.glow(m.x, gy, 30, 200 * u, 0, 900, '255,120,30', .9); V.ring(m.x, gy, 8, 170 * u, 0, 700, '255,170,60', 5, .3); V.shake(11, 800); });
      V.at(1000, () => { V.impact(m.x, m.y, '255,130,40', 1.5); V.fx(0, 700, (g, k) => { const ht = 190 * u * Math.min(1, k * 4) * (1 - Math.max(0, k - .6) / .4); const lg = g.createLinearGradient(0, gy, 0, gy - ht); lg.addColorStop(0, 'rgba(255,90,20,.95)'); lg.addColorStop(1, 'rgba(255,220,120,.2)'); g.fillStyle = lg; g.fillRect(m.x - 22 * u, gy - ht, 44 * u, ht); }); });
    },
    fin_galaxy(V, h, m, u) {
      V.charge(h, '190,170,255'); V.tint(150, 1900, '4,2,26', .75);
      const cx = m.x, cy = m.y - 20 * u, stars = Array.from({ length: 170 }, (_, i) => ({ a: (i % 2) * Math.PI + (i / 170) * 5.2, r: (i / 170), c: pick(['255,255,255', '190,170,255', '150,210,255', '255,200,230']), s: R(1.2, 3.4) }));
      V.fx(300, 1250, (g, k) => {
        const gr = Math.min(1, k * 2.4), col = k > .75 ? 1 - (k - .75) / .25 : 1, R0 = 120 * u * gr;
        g.globalAlpha = .55 * gr; g.drawImage(dotSpr('140,110,255'), cx - R0, cy - R0 * .8, R0 * 2, R0 * 1.6);
        stars.forEach(s => { const r = s.r * R0 * (k > .75 ? col : 1), an = s.a + V.t * (2.6 - s.r * 1.6) + s.r * 3; g.globalAlpha = .9 * gr * col; const x = cx + Math.cos(an) * r, y = cy + Math.sin(an) * r * .62, z = s.s * u * .8; g.drawImage(dotSpr(s.c), x - z, y - z, z * 2, z * 2); });
        g.globalAlpha = .9 * gr; g.drawImage(dotSpr('255,255,255'), cx - 18 * u * gr, cy - 18 * u * gr, 36 * u * gr, 36 * u * gr);
      });
      V.at(1250, () => {
        V.impact(m.x, m.y, '190,170,255', 1.7); V.glow(m.x, m.y, 20, 280 * u, 0, 800, '255,255,255', 1); V.flare(m.x, m.y, 240 * u, 0, 800, '220,200,255', 6); V.shake(13, 600);
        V.burst(m.x, m.y, 90, { speed: 420, c: ['255,255,255', '190,170,255', '150,210,255', '255,200,230'], p: { size: 4, life: 1.1, drag: 1.2 } });
        for (let i = 0; i < 3; i++) V.ring(m.x, m.y, 8, (120 + i * 60) * u, i * 110, 800, ['190,170,255', '150,210,255', '255,200,230'][i], 3, 1);
      });
    }
  };
  const COLORS = { fin_starfall: '255,226,110', fin_thunder: '200,180,255', fin_meteor: '255,150,60', fin_frost: '160,225,255', fin_tornado: '170,255,220', fin_rainbow: '255,255,255', fin_dragon: '255,120,40', fin_tiger: '255,170,60', fin_blossom: '255,170,210', fin_tidal: '110,200,255', fin_eagle: '255,220,110', fin_volcano: '255,110,40', fin_galaxy: '190,170,255' };
  const DUR = { fin_starfall: 1900, fin_thunder: 1800, fin_meteor: 1900, fin_frost: 1900, fin_tornado: 1900, fin_rainbow: 1700, fin_dragon: 1900, fin_tiger: 1700, fin_blossom: 1900, fin_tidal: 1900, fin_eagle: 2000, fin_volcano: 2000, fin_galaxy: 2100 };

  /* plays the light show for finisher `id` in layer L; resolves when it is over */
  function run(id, L, h, m, W, H) {
    const rec = REC[id];
    if (!rec || !L || !W || !H) return Promise.resolve();
    return new Promise(done => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1), cv = document.createElement('canvas');
      cv.className = 'vfxcv'; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.setAttribute('aria-hidden', 'true');
      L.insertBefore(cv, L.firstChild);
      const V = scene(cv, W, H, dpr), u = Math.max(.7, Math.min(1.5, W / 360));
      let fin = false, last = performance.now();
      const end = () => { if (fin) return; fin = true; cv.remove(); done(); };
      try { rec(V, h, m, u); } catch (e) { end(); return; }
      const tick = now => {
        if (fin) return;
        if (!cv.isConnected) { end(); return; }
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        let t = 0; try { t = V.step(dt); } catch (e) { end(); return; }
        if (t * 1000 > (DUR[id] || 1900) && !V.alive()) { end(); return; }
        if (t * 1000 > (DUR[id] || 1900) + 1500) { end(); return; }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(end, (DUR[id] || 1900) + 2600);   // a slow phone never leaves the canvas behind
    });
  }
  return { run, ids: Object.keys(REC), colors: COLORS, REC, scene };
})();

}
