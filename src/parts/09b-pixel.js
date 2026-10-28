/* ================= v12/v14/v19: 96x96 pixel-art mode =================
   Every character is drawn on a true 32x32 grid with the shaded-part engine from the
   "Pixel Knights" reference: parts are masks, each is shaded light-top-left / dark-bottom-right,
   parts get a dark seam where they overlap, and the whole sprite gets a 1px outline.
   Each sprite is a 6-frame sheet: 4 idle frames, 1 hurt frame, 1 attack frame.
   The sheet is drawn at 6x into a PNG and shown inside an <svg viewBox="0 0 32 32">,
   so every place that used the old vector sprites keeps working. S.pixel switches it on (default). */
let SPR_HOOK = null;   // v21: set by the sprite cache (09g); stays null inside the sprite worker
/* v35: what the hero WEARS can differ from what the hero HAS. S.wardrobe puts another owned piece over a gear slot (the stats
   stay with the real gear), and a weapon that evolved gets '+' on its id (every weapon drawing understands it). Only the
   player's own hero is dressed: S.equipped itself, or an object marked __me (the Armory preview). */
function dressEq(eq) {
  if (!eq || !(eq === S.equipped || eq.__me) || (!S.wardrobe && !S.evo)) return eq;
  const o = { ...eq }, lk = S.wardrobe || {};
  ['weapon', 'shield', 'hat', 'outfit', 'cape', 'boots'].forEach(s => { const id = lk[s]; if (id && ITEM[id] && ITEM[id].slot === s && (S.owned || []).includes(id)) o[s] = id; });
  if (S.evo && eq.weapon && S.evo[eq.weapon] && !String(o.weapon).endsWith('+')) o.weapon = (o.weapon || eq.weapon) + '+';
  return o;
}
function heroSVG(eq, opt = {}) { const e = dressEq(eq || S.equipped); return S.pixel ? PX.hero(e) : heroSVGClassic(e, opt); }
function monsterSVG(m, hue = 0) { if (m && m.rival && typeof rivalBattleSVG === 'function') return rivalBattleSVG(m.rival); return S.pixel ? PX.monster(m, hue) : monsterSVGClassic(m, hue); }   // v32: the rival knight (29)
function owlSVG() { return S.pixel ? PX.owl() : owlSVGClassic(); }

const PX = (() => {
  /* v19: sprites are drawn on a 96x96 grid (64x64 in v14). Part shapes are still written in 32-unit "design"
     coordinates (K = 3 raster pixels per unit), so every curve, edge and outline gets three times the detail. */
  const D = 32, K = 3, N = D * K, OLC = '#171A21', SEPC = '#1d1830', SC = 3, NF = 6;   // v19: 96x96 grid
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hx = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const rgb = (r, g, b) => '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = hx(a), B = hx(b); return rgb(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); };
  const RAMPS = new Map(), ramp = c => RAMPS.get(c) || (RAMPS.set(c, rampOf(c)), RAMPS.get(c)), rampOf = c => [mix(c, '#ffffff', .4), mix(c, '#ffffff', .16), c, mix(c, '#0E1418', .3), mix(c, '#0E1418', .52)];
  const dk = (c, t = .3) => mix(c, '#000000', t), lt = (c, t = .3) => mix(c, '#ffffff', t);

  class Mask {
    constructor() { this.a = new Uint8Array(N * N); }
    get(x, y) { return x >= 0 && y >= 0 && x < N && y < N && this.a[y * N + x] === 1; }
    raw(x, y) { if (x >= 0 && y >= 0 && x < N && y < N) this.a[y * N + x] = 1; return this; }
    /* one design pixel = a K x K block */
    px(x, y) { x = Math.round(x) * K; y = Math.round(y) * K; for (let j = 0; j < K; j++) for (let i = 0; i < K; i++) this.raw(x + i, y + j); return this; }
    r(x, y, w, h) { const x0 = Math.round(x * K), y0 = Math.round(y * K), x1 = Math.round((x + w) * K), y1 = Math.round((y + h) * K); for (let j = y0; j < y1; j++) for (let i = x0; i < x1; i++) this.raw(i, j); return this; }
    /* curves are tested at every raster pixel centre, inside a bounding box (fast) */
    box(x0, y0, x1, y1, test) { const a = clamp(Math.floor(x0 * K) - 1, 0, N), b = clamp(Math.ceil(x1 * K) + 1, 0, N), c = clamp(Math.floor(y0 * K) - 1, 0, N), d = clamp(Math.ceil(y1 * K) + 1, 0, N); for (let y = c; y < d; y++) for (let x = a; x < b; x++) if (test((x + .5) / K, (y + .5) / K)) this.a[y * N + x] = 1; return this; }
    e(cx, cy, rx, ry) { return this.box(cx - rx, cy - ry, cx + rx, cy + ry, (px, py) => { const dx = (px - cx) / rx, dy = (py - cy) / ry; return dx * dx + dy * dy <= 1; }); }
    p(pts) { const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]); return this.box(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), (px, py) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) c = !c; } return c; }); }
    l(x0, y0, x1, y1, w) { const vx = x1 - x0, vy = y1 - y0, L = vx * vx + vy * vy || 1, h = w / 2; return this.box(Math.min(x0, x1) - h, Math.min(y0, y1) - h, Math.max(x0, x1) + h, Math.max(y0, y1) + h, (px, py) => { const t = clamp(((px - x0) * vx + (py - y0) * vy) / L, 0, 1); return Math.hypot(px - x0 - vx * t, py - y0 - vy * t) <= h; }); }
    pts(list) { list.forEach(([x, y]) => this.px(x, y)); return this; }
    sub(fn) { const t = new Mask(); fn(t); for (let i = 0; i < N * N; i++) if (t.a[i]) this.a[i] = 0; return this; }
    and(fn) { const t = new Mask(); fn(t); for (let i = 0; i < N * N; i++) if (!t.a[i]) this.a[i] = 0; return this; }
  }
  const star = (cx, cy, R, r) => Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, d = i % 2 ? r : R; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]; });
  const softRamp = c => [mix(c, '#ffffff', .32), mix(c, '#ffffff', .12), c, mix(c, '#3a2028', .2), mix(c, '#2a1820', .36)];
  /* light from the top-left: 5 tones, with a checker dither where two tones meet (classic 16-bit look) */
  const MIXC = new Map(), mixC = (a, b, t) => { const k = a + b + t; let v = MIXC.get(k); if (!v) { v = mix(a, b, t); MIXC.set(k, v); } return v; };
  function shadeMask(mask, base, flat, soft) {
    const R = soft ? softRamp(base) : ramp(base), out = [], bounce = mix(R[2], '#A9B9FF', soft ? .12 : .26), a = mask.a;
    /* only scan the part's own bounding box, with direct array reads (this is the hot loop) */
    let x0 = N, y0 = N, x1 = -1, y1 = -1;
    for (let y = 0; y < N; y++) { const r = y * N; for (let x = 0; x < N; x++) if (a[r + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; y1 = y; } }
    const on = (x, y) => x >= 0 && y >= 0 && x < N && y < N && a[y * N + x] === 1;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (!a[y * N + x]) continue;
      if (flat) { out.push([x, y, base]); continue; }
      let dl = 0, dr = 0;
      while (dl < 5 * K && on(x - dl - 1, y - dl - 1)) dl++;
      while (dr < 5 * K && on(x + dr + 1, y + dr + 1)) dr++;
      /* v15 bounce light: a thin cool rim where the shadow side meets the outline gives every shape volume */
      /* v18 heroic style: flat, chunky tone bands like hand-made 16-bit sprites (no dither, no rim light) */
      const v = dr - dl;
      out.push([x, y, R[v >= 2.5 * K ? 0 : v >= K ? 1 : v >= -.5 * K ? 2 : v >= -2 * K ? 3 : 4]]);
    }
    return out;
  }
  function compile(parts, mode) {
    return parts.filter(Boolean).map(p => {
      const m = new Mask(); p.m(m); const px = mode === 'mon' && !p.flat && !p.band ? shadeVol(m, p.c, p) : shadeMask(m, p.c, p.flat, p.soft);
      /* fine: single raster pixels (design coords snapped to the 96 grid) for catchlights and tiny details */
      if (p.fine && p.fine.length) { const at = new Map(px.map(q => [q[1] * N + q[0], q])); p.fine.forEach(([x, y, c]) => { const q = at.get(Math.round(y * K) * N + Math.round(x * K)); if (q) q[2] = c || '#ffffff'; }); }
      if (p.dots && p.dots.length) {
        const at = new Map(px.map(q => [q[1] * N + q[0], q]));
        /* a white glint is one bright pixel with a softer halo around it, not a hard 2x2 block */
        p.dots.forEach(([x, y, c]) => { for (let j = 0; j < K; j++) for (let i = 0; i < K; i++) { const q = at.get((Math.round(y) * K + j) * N + Math.round(x) * K + i); if (q) q[2] = c && c !== '#ffffff' ? c : (i + j === 0 ? '#ffffff' : mixC(q[2], '#ffffff', .55)); } });
      }
      if (p.tex && !p.flat && !(mode === 'mon' && !p.band)) texture(px, p.tex);
      return { ...p, px };
    });
  }
  /* ================= v20 monster style =================
     Rounded volume shading: every shape is treated as a soft pillow lit from the top-left. The light is
     worked out from the shape's own distance-to-edge, then snapped to a six-tone ramp whose shadows lean
     cool purple and whose lights lean warm gold (hue-shifted, like hand-painted pixel art). A thin cool
     rim on the shadow edge separates forms; glossy parts (slime, gems, eyes, metal) get a specular glint.
     Surface patterns (scales, fur, stone, wood, feathers, mail) step the tone instead of adding noise. */
  const VR = new Map();
  const vramp = c => { let r = VR.get(c); if (!r) { r = [mix(c, '#FFF7E0', .62), mix(c, '#FFEBC2', .3), c, mix(c, '#43307A', .3), mix(c, '#21173F', .55), mix(c, '#A8C4FF', .3)]; VR.set(c, r); } return r; };
  const DT = new Float32Array(N * N), LX = -.48, LY = -.72, LZ = .5, LL = Math.hypot(LX, LY, LZ);
  function shadeVol(mask, base, p) {
    const a = mask.a, R6 = vramp(base), out = [];
    let x0 = N, y0 = N, x1 = -1, y1 = -1;
    for (let y = 0; y < N; y++) { const r = y * N; for (let x = 0; x < N; x++) if (a[r + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; y1 = y; } }
    if (x1 < 0) return out;
    /* chamfer distance to the outside (3-4 metric), inside the bounding box only */
    const X0 = Math.max(0, x0 - 1), Y0 = Math.max(0, y0 - 1), X1 = Math.min(N - 1, x1 + 1), Y1 = Math.min(N - 1, y1 + 1), BIG = 1e4;
    for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) DT[y * N + x] = a[y * N + x] ? BIG : 0;
    const d = (x, y) => (x < X0 || y < Y0 || x > X1 || y > Y1) ? 0 : DT[y * N + x];
    for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) { const i = y * N + x; if (!DT[i]) continue; DT[i] = Math.min(DT[i], d(x - 1, y) + 3, d(x, y - 1) + 3, d(x - 1, y - 1) + 4, d(x + 1, y - 1) + 4); }
    for (let y = Y1; y >= Y0; y--) for (let x = X1; x >= X0; x--) { const i = y * N + x; if (!DT[i]) continue; DT[i] = Math.min(DT[i], d(x + 1, y) + 3, d(x, y + 1) + 3, d(x + 1, y + 1) + 4, d(x - 1, y + 1) + 4); }
    let maxD = 0; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (a[y * N + x]) maxD = Math.max(maxD, DT[y * N + x] / 3);
    const Rr = Math.max(1.5, Math.min(maxD, (p.round || 3.4) * K));
    const H = (x, y) => { const v = d(x, y) / 3; if (!v) return 0; const t = Math.min(v, Rr) / Rr; return Math.sqrt(1 - (1 - t) * (1 - t)); };
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hw = Math.max(4, (x1 - x0) / 2), hh = Math.max(4, (y1 - y0) / 2), S = Rr * .9;
    const gloss = p.gloss, rim = p.rim !== false, tex = p.tex;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (!a[y * N + x]) continue;
      const gx = (H(x + 1, y) - H(x - 1, y)) / 2 * S, gy = (H(x, y + 1) - H(x, y - 1)) / 2 * S, nl = Math.hypot(gx, gy, 1);
      const nx = -gx / nl, ny = -gy / nl, nz = 1 / nl;
      let v = (nx * LX + ny * LY + nz * LZ) / LL - ((x - cx) / hw) * .13 - ((y - cy) / hh) * .2;
      let t = v > .97 ? 0 : v > .8 ? 1 : v > .5 ? 2 : v > .24 ? 3 : 4;
      if (!gloss && t === 0) t = 1;
      if (tex) t = Math.min(4, t + texStep(tex, x, y, t));
      const edge = d(x, y) <= 3;
      let c = R6[t];
      if (rim && edge && t >= 3 && (nx > .25 || ny > .45)) c = R6[5];
      if (gloss && t <= 1 && v > 1.02 && d(x, y) > 3) c = '#FFFFFF';
      out.push([x, y, c]);
    }
    return out;
  }
  const hs2 = (x, y) => ((Math.imul(x + 11, 374761393) ^ Math.imul(y + 7, 668265263)) >>> 0) % 997;
  function texStep(kind, x, y, t) {
    if (t === 0) return 0;
    if (kind === 'scale') { const row = Math.floor(y / 4), u = (x + (row % 2) * 3) % 6, w = y % 4; return (w === 3 && u > 0 && u < 5) || (w === 2 && (u === 0 || u === 5)) ? 1 : 0; }
    if (kind === 'fur') { const col = Math.floor((x + Math.floor(y / 5) * 2) / 3), ph = (hs2(col, Math.floor(y / 5)) % 5); return x % 3 === 0 && (y + ph) % 5 < 3 ? 1 : 0; }
    if (kind === 'feather') { const row = Math.floor(y / 5), u = (x + (row % 2) * 4) % 8, w = y % 5; return (w === 4 && u > 0 && u < 7) || (w === 3 && (u === 0 || u === 7)) ? 1 : 0; }
    if (kind === 'stone') {
      /* irregular chiselled cracks: the edges of a jittered Voronoi pattern, with a few broken gaps */
      const S = 9, gx = Math.floor(x / S), gy = Math.floor(y / S); let d1 = 1e9, d2 = 1e9;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const cx = gx + i, cy = gy + j, hh = hs2(cx * 7 + 3, cy * 13 + 5), px = (cx + .2 + (hh % 60) / 100) * S, py = (cy + .2 + ((hh >> 3) % 60) / 100) * S, dd = (px - x) * (px - x) + (py - y) * (py - y); if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd; }
      return Math.sqrt(d2) - Math.sqrt(d1) < 1.1 && hs2(x >> 2, y >> 2) % 5 ? 1 : 0;
    }
    if (kind === 'wood') return x % 5 === 0 && hs2(x, Math.floor(y / 7)) % 4 ? 1 : 0;
    if (kind === 'mail') return y % 2 === 0 && (x + (y % 4 ? 1 : 0)) % 3 === 0 ? 1 : 0;
    if (kind === 'plate') return y % 9 === 0 ? 1 : 0;
    if (kind === 'spots') return 0;
    return 0;
  }
  /* v19 surface textures, worked out on the 96-grid: chainmail, scales, fur, stone, wood, cloth */
  const hsh = (x, y) => (Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 0;
  function texture(px, kind) {
    for (const q of px) {
      const [x, y] = q, h = hsh(x, y);
      let d = 0;
      if (kind === 'mail') d = y % 2 === 0 && (x + (y % 4 ? 1 : 0)) % 3 === 0 ? -1 : 0;
      else if (kind === 'scale') { const r = Math.floor(y / 3); d = y % 3 === 0 && ((x + r * 2) % 5) <= 2 ? -1 : (y % 3 === 1 && (x + r * 2) % 5 === 1 ? 1 : 0); }
      else if (kind === 'fur') d = (x + (y >> 1)) % 4 === 0 && h % 3 === 0 ? -1 : h % 23 === 0 ? -.5 : 0;
      else if (kind === 'feather') { const r = Math.floor(y / 4); d = y % 4 === 3 && (x + r * 2) % 6 < 4 ? -1 : 0; }
      else if (kind === 'stone') d = h % 19 === 0 || (h % 41 === 1 && x % 2) ? -1 : h % 29 === 0 ? 1 : 0;
      else if (kind === 'wood') d = x % 4 === 0 && h % 5 ? -1 : 0;
      else if (kind === 'cloth') d = (x + y) % 4 === 0 ? -.5 : 0;
      else if (kind === 'plate') d = y % 9 === 0 ? -1 : 0;
      if (d < 0) q[2] = mixC(q[2], '#0E1418', d < -.7 ? .24 : .12); else if (d > 0) q[2] = mixC(q[2], '#ffffff', .2);
    }
  }
  const MINE = new Uint8Array(N * N), SEAM = new Uint8Array(N * N), INKD = '#0b0919';
  function renderFrame(parts, off, f) {
    const buf = new Array(N * N).fill(null), under = [];
    SEAM.fill(0);
    for (const p of parts) {
      if (p.fr && !p.fr.includes(f)) continue;
      const o = off[p.g] ? off[p.g](f) : [0, 0], dx = Math.round(o[0] * K), dy = Math.round(o[1] * K);
      if (p.shadow) { under.push([p, dx, dy]); continue; }
      if (p.sep !== false) {
        MINE.fill(0);
        for (const [x, y] of p.px) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < N && ny < N) MINE[ny * N + nx] = 1; }
        for (const [x, y] of p.px) for (let k = 0; k < 4; k++) {
          const nx = x + dx + (k === 0 ? -1 : k === 1 ? 1 : 0), ny = y + dy + (k === 2 ? -1 : k === 3 ? 1 : 0);
          if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue; const j = ny * N + nx;
          /* v15 seams are a dark tint of the part underneath (soft ambient shadow), not flat black */
          if (!MINE[j] && buf[j] !== null && !SEAM[j]) { buf[j] = mixC(buf[j], INKD, .62); SEAM[j] = 1; }
        }
      }
      for (const [x, y, c] of p.px) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < N && ny < N) { const j = ny * N + nx; buf[j] = c; SEAM[j] = 0; } }
    }
    /* v15 selective outline: each outline pixel is a very dark shade of the colour it borders */
    const out = new Array(N * N).fill(null);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x; if (buf[i] !== null) { out[i] = buf[i]; continue; }
      const nb = (y > 0 && buf[i - N]) || (x > 0 && buf[i - 1]) || (x < N - 1 && buf[i + 1]) || (y < N - 1 && buf[i + N]);
      if (nb) out[i] = RMODE === 'mon' && nb[0] === '#' ? mixC(nb, '#120A20', .78) : OLC;
    }
    /* v19 aura: a soft glow that hugs the whole silhouette (bosses, mini-bosses). Grown outward ring by
       ring (alternating 4- and 8-neighbour steps keeps it round); strong near the body, faint and
       checkered at the edge so it still reads as pixel art. */
    let gfill = null;
    for (const p of parts) if (p.glow && (!p.fr || p.fr.includes(f))) gfill = glowFill(out, p.glow, f);
    for (const [p, dx, dy] of under) for (const [x, y] of p.px) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < N && ny < N && out[ny * N + nx] === null) out[ny * N + nx] = p.c; }
    if (gfill) for (const [i, c] of gfill) if (out[i] === null) out[i] = c;
    return out;
  }
  const GD = new Int16Array(N * N);
  function glowFill(out, gw, f) {
    const R = Math.round((gw.r + (f === 2 || f === 3 ? gw.pulse || 0 : 0)) * K), inner = Math.round(R * .45);
    let front = [];
    for (let i = 0; i < N * N; i++) { if (out[i] !== null) { GD[i] = 0; front.push(i); } else GD[i] = 999; }
    for (let step = 1; step <= R && front.length; step++) {
      const nxt = [], diag = step % 2 === 0;
      for (const i of front) {
        const x = i % N, y = (i / N) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue; if (!diag && dx && dy) continue;
          const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= N || Y >= N) continue;
          const j = Y * N + X; if (GD[j] === 999) { GD[j] = step; nxt.push(j); }
        }
      }
      front = nxt;
    }
    const cA = gw.c1, cB = gw.c2, res = [];
    for (let i = 0; i < N * N; i++) {
      const d = GD[i]; if (d === 0 || d === 999) continue;
      if (d <= inner) res.push([i, cA]);
      else if (d < R - 1 || ((i % N) + ((i / N) | 0)) % 2 === 0) res.push([i, cB]);
    }
    return res;
  }
  /* colour strings -> RGBA bytes (cached), so a sheet is one putImageData instead of thousands of fillRects */
  const RGBA = new Map();
  function rgbaOf(c) {
    let v = RGBA.get(c); if (v) return v;
    if (c[0] === '#') v = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 255];
    else { const n = c.match(/[\d.]+/g).map(Number); v = [n[0], n[1], n[2], Math.round((n[3] == null ? 1 : n[3]) * 255)]; }
    RGBA.set(c, v); return v;
  }
  /* one PNG sheet with all frames side by side, drawn at SC x so it stays crisp when scaled up.
     v21: split into the pixel work (sheetImage) and the encoder: a DOM canvas here on the main thread,
     an OffscreenCanvas in the sprite worker (sheetBlob). Quality "lite" skips the aura glow, draws two
     idle poses instead of four and encodes at 2x, for slow tablets. */
  /* v33 finishing pass: after a frame is drawn, give every sprite (heroes, knights, monsters, bosses) a little more
     life: a bright rim on the lit (top-left) edge, a soft form shadow on the far edge, a dithered shade toward the
     bottom, and a few glints on the brightest spots. Works on the finished pixels, so it needs nothing from the
     artists' parts and is the same on every frame (no flicker). */
  const lumOf = c => { const v = rgbaOf(c); return v[0] * .3 + v[1] * .59 + v[2] * .11; };
  function detailPass(b) {
    const solid = new Uint8Array(N * N), lum = new Float32Array(N * N);
    let y0 = N, y1 = -1;
    for (let i = 0; i < N * N; i++) {
      const c = b[i]; if (!c || c[0] !== '#') continue;
      const l = lumOf(c); lum[i] = l; if (l >= 46) { solid[i] = 1; const y = (i / N) | 0; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (y1 < 0) return b;
    const o = b.slice(), H = y1 - y0 + 1;
    for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
      const i = y * N + x; if (!solid[i]) continue;
      if (y > 1 && y < N - 2 && x > 1 && x < N - 2) { let n = 0; for (let j = -2; j <= 2; j++) for (let k = -2; k <= 2; k++) n += solid[i + j * N + k]; if (n < 15) continue; } else continue;   // small floating bits (sparks, embers) stay clean
      const up = solid[i - N], lf = solid[i - 1], dn = solid[i + N], rt = solid[i + 1], ul = solid[i - N - 1], dr = solid[i + N + 1];
      let c = b[i];
      if ((!up || !lf || !ul) && dr && solid[i + N] && solid[i + 1]) c = mixC(c, '#FFFFFF', lum[i] > 150 ? .14 : .2);          // rim light, top-left
      else if ((!dn || !rt) && up && lf) c = mixC(c, '#0B0919', .2);                                                             // form shadow, bottom-right
      else if (y > y0 + H * .74 && (x + y) % 2 === 0 && up && lf) c = mixC(c, '#0B0919', .09);                                  // dithered ground shade
      else if (lum[i] > 205 && hs2(x, y) % 17 === 0 && up && lf && dn && rt) c = '#FFFFFF';                                      // glint
      o[i] = c;
    }
    return o;
  }
  let RMODE = '';
  const Q = { tier: 'high' };
  function sheetImage(parts, off, frames = NF, mode = '') {
    RMODE = mode;
    const lite = Q.tier === 'lite', c = compile(lite ? parts.filter(p => p && !p.glow) : parts, mode), W = N * frames, img = new ImageData(W, N), d = img.data;
    for (let f = 0; f < frames; f++) {
      if (lite && (f === 1 || f === 3) && frames > 3) { for (let y = 0; y < N; y++) d.copyWithin((y * W + f * N) * 4, (y * W + (f - 1) * N) * 4, (y * W + f * N) * 4); continue; }
      let b = renderFrame(c, off, f); if (!lite) b = detailPass(b); for (let i = 0; i < N * N; i++) if (b[i]) { const v = rgbaOf(b[i]), o = (((i / N) | 0) * W + f * N + (i % N)) * 4; d[o] = v[0]; d[o + 1] = v[1]; d[o + 2] = v[2]; d[o + 3] = v[3]; }
    }
    RMODE = '';
    return { img, W, sc: lite ? 2 : SC };
  }
  const scaleTo = (mk, img, W, sc) => { const small = mk(W, N); small.getContext('2d').putImageData(img, 0, 0); const cv = mk(W * sc, N * sc), g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(small, 0, 0, W * sc, N * sc); return cv; };
  function sheet(parts, off, frames = NF, mode = '') {
    const P0 = performance.now(), { img, W, sc } = sheetImage(parts, off, frames, mode), P1 = performance.now();
    const cv = scaleTo((w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }, img, W, sc), url = cv.toDataURL('image/png');
    const ms = performance.now() - P0; SPEED.push(ms); if (SPEED.length > 12) SPEED.shift();
    if (window.__pxprof) window.__pxprof.push([P1 - P0, performance.now() - P1]);
    return url;
  }
  async function sheetBlob(parts, off, frames = NF, mode = '') {
    const { img, W, sc } = sheetImage(parts, off, frames, mode);
    return scaleTo((w, h) => new OffscreenCanvas(w, h), img, W, sc).convertToBlob({ type: 'image/png' });
  }
  const SPEED = [];
  const svgOf = (url, cls, label, frames = NF, style = '') => `<svg class="px-svg ${cls}" viewBox="0 0 32 32" role="img" aria-label="${esc(label)}"${style}><svg x="0" y="0" width="32" height="32" viewBox="0 0 32 32" overflow="hidden"><image class="px-sheet" href="${url}" x="0" y="0" width="${32 * frames}" height="32" preserveAspectRatio="none" image-rendering="pixelated"/></svg></svg>`;
  /* v25: a drawn sheet is kept as a short blob: URL, not a long data: URL. Story scenes and battles rebuild their
     markup often; with 60 KB strings in every <image href> each rebuild re-parsed and re-decoded the art (a stutter) */
  const blobOf = v => {
    if (typeof v !== 'string' || !v.startsWith('data:image/png;base64,') || typeof Blob !== 'function' || !(window.URL && URL.createObjectURL)) return null;
    try { const bin = atob(v.slice(22)), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: 'image/png' }); } catch (_) { return null; }
  };
  const CACHE = new Map(), memo = (k, fn) => {
    if (!CACHE.has(k)) { if (CACHE.size > 600) CACHE.delete(CACHE.keys().next().value); const v = fn(), bl = blobOf(v); CACHE.set(k, bl ? URL.createObjectURL(bl) : v); if (SPR_HOOK) SPR_HOOK.put(k, bl || v); }   // drop the oldest, never the whole cache
    if (SPR_HOOK) SPR_HOOK.touch(k);
    return CACHE.get(k);
  };

  /* frame offsets: 0-3 idle, 4 hurt (knocked back), 5 attack (lunge forward) */
  const F = (idle, hurt, atk) => f => f < 4 ? idle[f] : f === 4 ? hurt : atk;
  const HOFF = {
    legs: F([[0, 0], [0, 0], [0, 0], [0, 0]], [-1, 0], [1, 0]),
    body: F([[0, 0], [0, 0], [0, 1], [0, 1]], [-1, 0], [1, 0]),
    head: F([[0, 0], [0, 0], [0, 1], [0, 1]], [-2, 1], [1, 0]),
    weap: F([[0, 0], [0, 1], [0, 1], [0, 0]], [-1, 1], [3, -1]),
    shield: F([[0, 0], [0, 1], [0, 1], [0, 0]], [-1, 0], [1, 0]),
    cape: F([[0, 0], [0, 1], [-1, 1], [-1, 0]], [-1, 0], [-1, 0]),
    plume: F([[0, 0], [1, 0], [1, 1], [0, 1]], [-2, 1], [0, 0]),
    aura: F([[0, 0], [0, -1], [0, -2], [0, -3]], [0, 0], [0, 0])
  };
  const GOLD = '#E3B341', BRN = '#7A5232', INK = '#2a2233', IDLE = [0, 1, 2, 3], NOTHURT = [0, 1, 2, 3, 5];

  /* ---------------- the hero: every Armory item has a pixel version ---------------- */
  function heroParts(eq) {
    const g = k => ITEM[eq[k]] || ITEM[DEFAULT_EQUIP[k]];
    const skin = g('skin').c || '#F5CBA7', hair = g('hair'), out = g('outfit'), boots = g('boots');
    const hc = hair.c === 'rainbow' ? '#B76BFF' : hair.c, oc = out.c, bc = boots.c === 'rainbow' ? '#FF6FB5' : boots.c;
    const hat = eq.hat || 'hat_none', cape = eq.cape || 'cape_none', W = eq.weapon || 'weapon_pencil', sh = eq.shield || 'shield_none', face = eq.face || 'face_none', aura = eq.aura || 'aura_none', d = out.deco;
    const helm = hat === 'hat_helm' || hat === 'hat_astro', st = hair.style, P = [];
    const add = (o) => P.push(o);
    const head = m => m.e(16, 10.5, 7.2, 6.8);
    /* behind everything: shadow, aura ring, cape, wings, back hair */
    add({ g: 'legs', c: 'rgba(20,10,40,.28)', shadow: true, flat: true, m: m => m.e(16, 30.6, 9, 1.4) });
    auraParts(aura, 'back').forEach(add);
    capeParts(cape).forEach(add);
    if (!helm) {
      if (st === 'long' || st === 'wavy') add({ g: 'head', c: hc, m: m => m.p([[8, 9], [24, 9], [25, 21], [22, 22], [19, 21], [16, 22], [13, 21], [10, 22], [7, 21]]) });
      if (st === 'pigtails') add({ g: 'head', c: hc, m: m => m.e(6.5, 14, 2.6, 4).e(25.5, 14, 2.6, 4) });
      if (st === 'afro') add({ g: 'head', c: hc, m: m => m.e(16, 9.5, 10.5, 9) });
      if (st === 'tudung') add({ g: 'head', c: hc, m: m => m.p([[8, 10], [24, 10], [26, 21], [22, 23], [10, 23], [6, 21]]) });
    }
    /* legs and boots */
    const pc = dk(oc, .5);
    if (d !== 'kurung' && d !== 'stars') add({ g: 'legs', c: pc, m: m => m.r(12, 23, 3, 5).r(17, 23, 3, 5) });
    add({ g: 'legs', c: bc, m: m => m.r(11, 27, 5, 3).r(17, 27, 5, 3) });
    if (boots.c === 'rainbow' || eq.boots === 'boots_gold') add({ g: 'legs', c: '#FFF3C4', flat: true, sep: false, m: m => m.r(11, 27, 5, 1).r(17, 27, 5, 1) });
    /* shield arm (back) */
    add({ g: 'body', c: oc, m: m => m.e(9.4, 19.5, 2, 3) });
    /* torso */
    const torso = d === 'kurung' || d === 'stars' ? (m => m.p([[11, 17], [21, 17], [23, 28], [9, 28]])) : (m => m.p([[11, 17], [21, 17], [22, 24], [10, 24]]));
    add({ g: 'body', c: oc, m: torso, dots: [[12, 18, lt(oc, .5)]] });
    if (!d) { add({ g: 'body', c: BRN, sep: false, m: m => m.r(10, 22, 12, 1) }); add({ g: 'body', c: '#ffffff', sep: false, m: m => m.p([[14, 17], [18, 17], [16, 20]]) }); }
    if (d === 'coat') { add({ g: 'body', c: '#C3CCDA', flat: true, sep: false, m: m => m.l(16, 17, 14, 24, 1).l(16, 17, 18, 24, 1).r(18, 20, 3, 2) }); }
    if (d === 'vest') { add({ g: 'body', c: dk(oc, .3), flat: true, sep: false, m: m => m.r(16, 17, 1, 7).r(11, 20, 3, 2).r(18, 20, 3, 2) }); }
    if (d === 'sampin') { add({ g: 'body', c: '#E8B33A', sep: false, m: m => m.r(10, 21, 12, 3) }); add({ g: 'body', c: '#B8481F', flat: true, sep: false, m: m => m.pts([[12, 22], [15, 22], [18, 22], [21, 22]]) }); }
    if (d === 'kurung') add({ g: 'body', c: '#FFE3EC', flat: true, sep: false, m: m => m.pts([[13, 21], [18, 22], [15, 25], [20, 26], [11, 26]]).r(9, 27, 14, 1) });
    if (d === 'stars') add({ g: 'body', c: '#FFE98A', flat: true, sep: false, m: m => m.pts([[13, 20], [19, 21], [15, 24], [21, 26], [11, 26], [12, 26], [16, 27]]) });
    if (d === 'armor') { add({ g: 'body', c: GOLD, sep: false, m: m => m.r(15, 17, 2, 7).r(10, 22, 12, 1) }); add({ g: 'body', c: '#C9D2DC', m: m => m.e(9.5, 17.5, 3.4, 2.6).e(22.5, 17.5, 3.4, 2.6) }); add({ g: 'body', c: GOLD, flat: true, sep: false, m: m => m.r(7, 19, 5, 1).r(20, 19, 5, 1) }); }
    if (d === 'space') { add({ g: 'body', c: '#4B5A78', sep: false, m: m => m.r(13, 19, 6, 3) }); add({ g: 'body', c: '#6BD18B', flat: true, sep: false, m: m => m.pts([[14, 20], [16, 20]]) }); add({ g: 'body', c: '#FF6B6B', flat: true, sep: false, m: m => m.pts([[17, 20]]) }); }
    /* head */
    add({ g: 'head', c: skin, soft: true, m: m => head(m).e(8.6, 11.5, 1.4, 1.6).e(23.4, 11.5, 1.4, 1.6), dots: [[11, 6, lt(skin, .55)], [12, 5, lt(skin, .55)]] });
    if (helm && hat === 'hat_helm') {
      /* the knight helm from the reference: steel great helm, gold T-visor, red plume */
      add({ g: 'plume', c: '#D63B3B', m: m => m.l(16, 4, 12.5, 1.5, 3).l(12.5, 1.5, 8, 3, 3).l(8, 3, 6, 7, 2.6) });
      add({ g: 'head', c: '#AAB4C8', m: m => m.p([[9, 7], [10, 4], [13, 2.5], [19, 2.5], [22, 4], [23, 7], [23.5, 17], [8.5, 17]]), dots: [[11, 5], [11, 6], [12, 4]] });
      add({ g: 'head', c: GOLD, sep: false, m: m => m.r(9, 9, 15, 2).r(15, 4, 2, 11) });
      add({ g: 'head', c: '#1b1c2a', flat: true, sep: false, m: m => m.r(10, 11, 4, 2).r(18, 11, 5, 2) });
      add({ g: 'head', c: GOLD, m: m => m.r(9, 16, 15, 2) });
    } else {
      /* face: eyes look right toward the enemy */
      add({ g: 'head', c: INK, flat: true, sep: false, fr: NOTHURT, m: m => m.r(13, 10, 2, 3).r(18, 10, 2, 3), dots: [[14, 10, '#ffffff'], [19, 10, '#ffffff']] });
      add({ g: 'head', c: INK, flat: true, sep: false, fr: [4], m: m => m.pts([[12, 10], [13, 11], [12, 12], [20, 10], [19, 11], [20, 12]]) });
      add({ g: 'head', c: '#FF8FA3', flat: true, sep: false, m: m => m.r(11, 13, 2, 1).r(20, 13, 2, 1) });
      add({ g: 'head', c: '#7A2D3A', flat: true, sep: false, fr: IDLE, m: m => m.r(15, 14, 3, 1).pts([[16, 15]]) });
      add({ g: 'head', c: '#7A2D3A', flat: true, sep: false, fr: [4, 5], m: m => m.r(15, 14, 2, 2) });
      if (face === 'face_freckles') add({ g: 'head', c: '#A5673F', flat: true, sep: false, m: m => m.pts([[11, 14], [12, 15], [20, 14], [21, 15]]) });
      if (face === 'face_glasses') add({ g: 'head', c: '#3b2a20', flat: true, sep: false, m: m => m.r(12, 9, 4, 5).sub(t => t.r(13, 10, 2, 3)).r(17, 9, 4, 5).sub(t => t.r(18, 10, 2, 3)).pts([[16, 10]]) });
      if (face === 'face_sunglasses') add({ g: 'head', c: '#1d1d28', flat: true, sep: false, m: m => m.r(11, 10, 5, 3).r(17, 10, 5, 3).pts([[16, 10]]), dots: [[12, 10, '#ffffff'], [18, 10, '#ffffff']] });
      if (face === 'face_mask') { add({ g: 'head', c: '#E5484D', sep: false, m: m => m.r(9, 9, 15, 4).sub(t => t.r(13, 10, 2, 3).r(18, 10, 2, 3)) }); }
      if (face === 'face_paint') add({ g: 'head', c: '#FFD166', flat: true, sep: false, m: m => m.pts([[11, 13], [10, 14], [11, 14], [12, 14], [11, 15]]) });
      if (face === 'face_whiskers') add({ g: 'head', c: INK, flat: true, sep: false, m: m => m.r(6, 13, 4, 1).r(23, 13, 4, 1).pts([[7, 15], [8, 14], [25, 14], [26, 15]]) });
      /* front hair */
      const fringe = m => m.p([[8.5, 11], [9, 7], [11, 4.5], [14, 3.4], [18, 3.4], [21, 4.5], [23, 7], [23.5, 11], [21.5, 8.5], [19, 9], [17, 7.5], [15, 9], [12.5, 8], [10.5, 9.5]]);
      if (st === 'tudung') add({ g: 'head', c: hc, m: m => m.e(16, 10.5, 8.4, 8.2).sub(t => t.e(16, 11.6, 5.8, 5.3)), dots: [[11, 4], [12, 4], [10, 5]] });
      else if (st === 'afro') add({ g: 'head', c: hc, m: m => m.e(16, 6.5, 8, 4).and(t => t.r(0, 0, 32, 9)) });
      else if (st === 'curly') add({ g: 'head', c: hc, m: m => m.e(10, 6, 2.8, 2.8).e(14, 4.4, 3, 2.8).e(18.5, 4.4, 3, 2.8).e(22.5, 6.4, 2.8, 2.8).e(8.8, 9.6, 2.2, 2.4).e(23.6, 10, 2.2, 2.4) });
      else if (st === 'spiky') add({ g: 'head', c: hc, m: m => { fringe(m); m.p([[9, 7], [9, 0.5], [13, 4]]).p([[12, 5], [15, -0.5], [18, 5]]).p([[17, 5], [21, 0], [22, 6]]).p([[21, 7], [25, 3], [23.5, 9]]); }, dots: [[10, 3], [14, 2]] });
      else add({ g: 'head', c: hc, m: fringe, dots: [[12, 5], [13, 5], [11, 6]] });
      if (st === 'bun') { add({ g: 'head', c: hc, m: m => m.e(16, 2.4, 3.2, 2.4) }); add({ g: 'head', c: '#FF8FB1', flat: true, sep: false, m: m => m.r(14, 4, 4, 1) }); }
      if (st === 'pigtails') add({ g: 'head', c: '#FF8FB1', flat: true, sep: false, m: m => m.r(7, 11, 2, 1).r(24, 11, 2, 1) });
      /* hats */
      if (hat === 'hat_cap') { add({ g: 'head', c: '#4DA3FF', m: m => m.e(16, 6.5, 7.8, 4).and(t => t.r(0, 0, 32, 7)) }); add({ g: 'head', c: '#2F7FD6', m: m => m.r(8, 6, 18, 2) }); }
      if (hat === 'hat_beanie') { add({ g: 'head', c: '#E5484D', m: m => m.e(16, 7, 8, 5).and(t => t.r(0, 0, 32, 8)) }); add({ g: 'head', c: '#B8282D', m: m => m.r(8, 7, 16, 2) }); add({ g: 'head', c: '#ffffff', m: m => m.e(16, 1.6, 1.8, 1.6) }); }
      if (hat === 'hat_party') { add({ g: 'head', c: '#FF6F91', m: m => m.p([[11, 7.5], [16, -1], [21, 7.5]]) }); add({ g: 'head', c: '#FFE98A', flat: true, sep: false, m: m => m.r(13, 4, 6, 1).r(12, 6, 8, 1).pts([[16, 0]]) }); }
      if (hat === 'hat_chef') add({ g: 'head', c: '#F8F9FD', m: m => m.r(10, 4, 12, 4).e(11.5, 3, 3, 2.8).e(16, 2, 3.6, 2.6).e(20.5, 3, 3, 2.8) });
      if (hat === 'hat_songkok') { add({ g: 'head', c: '#22222B', m: m => m.p([[10, 7.5], [10.5, 1.5], [21.5, 1.5], [22, 7.5]]) }); add({ g: 'head', c: GOLD, flat: true, sep: false, m: m => m.r(10, 6, 12, 1) }); }
      if (hat === 'hat_flowers') { [[10, 5, '#FF8FB1'], [13, 3.5, '#FFD166'], [16, 3, '#B79CFF'], [19, 3.5, '#FFD166'], [22, 5, '#FF8FB1']].forEach(([x, y, c]) => add({ g: 'head', c, m: m => m.e(x + .5, y + .5, 1.8, 1.8), dots: [[x, y, '#ffffff']] })); }
      if (hat === 'hat_ladybug') { add({ g: 'plume', c: INK, flat: true, m: m => m.l(13, 5, 10, 1, 1).l(19, 5, 22, 1, 1) }); add({ g: 'plume', c: '#E5484D', m: m => m.e(10, 1.4, 1.6, 1.6).e(22, 1.4, 1.6, 1.6) }); }
      if (hat === 'hat_wizard') { add({ g: 'head', c: '#7C5CFF', m: m => m.p([[9, 7], [14, 2], [18, -1], [17, 3], [23, 7]]) }); add({ g: 'head', c: '#5B3FD6', m: m => m.r(6, 6, 20, 2) }); add({ g: 'head', c: '#FFE98A', flat: true, sep: false, m: m => m.pts([[15, 4], [14, 5], [15, 5], [16, 5], [15, 6]]) }); }
      if (hat === 'hat_grad') { add({ g: 'head', c: '#33333F', m: m => m.r(11, 4, 10, 3) }); add({ g: 'head', c: '#22222B', m: m => m.p([[7, 3], [16, 0.5], [25, 3], [16, 5.5]]) }); add({ g: 'plume', c: '#FFD166', flat: true, m: m => m.r(24, 3, 1, 5).r(23, 8, 3, 1) }); }
      if (hat === 'hat_cowboy') { add({ g: 'head', c: '#A5673F', m: m => m.e(16, 6.6, 12, 1.8) }); add({ g: 'head', c: '#C88B54', m: m => m.p([[10, 6], [11, 1], [14, 2], [16, 1], [18, 2], [21, 1], [22, 6]]) }); add({ g: 'head', c: '#6B3E26', flat: true, sep: false, m: m => m.r(10, 4, 12, 1) }); }
      if (hat === 'hat_crown') add({ g: 'head', c: '#FFD166', m: m => m.p([[10, 7], [10, 1.5], [12.5, 4], [14.5, 0.5], [16, 3.5], [17.5, 0.5], [19.5, 4], [22, 1.5], [22, 7]]), dots: [[16, 5, '#FF5E8A'], [12, 5, '#4DA3FF'], [20, 5, '#4DA3FF']] });
    }
    if (hat === 'hat_astro') {
      add({ g: 'head', c: '#ffffff', flat: true, sep: false, m: m => m.e(16, 10.5, 10.2, 9.6).sub(t => t.e(16, 10.5, 9, 8.6)) });
      add({ g: 'head', c: '#9AA9BD', m: m => m.r(9, 18, 14, 2) });
      add({ g: 'head', c: '#ffffff', flat: true, sep: false, m: m => m.pts([[10, 5], [11, 4], [9, 6], [12, 3]]) });
    }
    if (helm && hat === 'hat_astro') { /* the astronaut keeps a visible face inside the glass */
      add({ g: 'head', c: INK, flat: true, sep: false, fr: NOTHURT, m: m => m.r(13, 10, 2, 3).r(18, 10, 2, 3), dots: [[14, 10, '#ffffff'], [19, 10, '#ffffff']] });
      add({ g: 'head', c: INK, flat: true, sep: false, fr: [4], m: m => m.pts([[12, 10], [13, 11], [12, 12], [20, 10], [19, 11], [20, 12]]) });
      add({ g: 'head', c: '#7A2D3A', flat: true, sep: false, m: m => m.r(15, 14, 3, 1) });
      add({ g: 'head', c: hc, m: m => m.p([[8.5, 10], [9, 6.5], [12, 4], [20, 4], [23, 6.5], [23.5, 10], [21, 8], [17, 7], [12, 8.5]]) });
    }
    /* weapon arm + weapon (right side, toward the enemy) */
    weaponParts(W).forEach(add);
    add({ g: 'body', c: oc, m: m => m.e(22.6, 19.5, 2, 3) });
    add({ g: 'weap', c: skin, soft: true, m: m => m.e(23.7, 22.4, 1.7, 1.7) });
    /* shield in the left hand */
    add({ g: 'shield', c: skin, soft: true, m: m => m.e(8.4, 22.4, 1.6, 1.6) });
    shieldParts(sh).forEach(add);
    /* auras float on top */
    auraParts(aura, 'front').forEach(add);
    return P;
  }
  function capeParts(cape) {
    const P = [], add = o => P.push(o);
    if (cape === 'wings_butterfly') { add({ g: 'cape', c: '#F28BB0', m: m => m.e(7, 14, 5.4, 5).e(25, 14, 5.4, 5) }); add({ g: 'cape', c: '#B79CFF', m: m => m.e(8, 21, 3.6, 3.4).e(24, 21, 3.6, 3.4) }); add({ g: 'cape', c: '#ffffff', flat: true, sep: false, m: m => m.r(5, 12, 2, 2).r(25, 12, 2, 2) }); }
    else if (cape === 'wings_angel') add({ g: 'cape', c: '#F4F6FF', m: m => m.p([[11, 16], [3, 10], [1, 15], [3, 19], [2, 22], [6, 23], [11, 21]]).p([[21, 16], [29, 10], [31, 15], [29, 19], [30, 22], [26, 23], [21, 21]]), dots: [[3, 15, '#C9D3F0'], [4, 18, '#C9D3F0'], [28, 15, '#C9D3F0'], [27, 18, '#C9D3F0']] });
    else if (cape !== 'cape_none') {
      const cc = { cape_red: '#D63B3B', cape_leaf: '#43C089', cape_star: '#5B3FD6', cape_rainbow: '#FF6B6B', cape_gold: '#F2B93B' }[cape] || '#D63B3B';
      const cm = m => m.p([[10, 17], [22, 17], [26, 29], [23, 30], [20, 28.5], [16, 30], [12, 28.5], [9, 30], [6, 29]]);
      add({ g: 'cape', c: cc, m: cm });
      if (cape === 'cape_rainbow') ['#FFD166', '#6BD18B', '#4DA3FF', '#B79CFF'].forEach((c, i) => add({ g: 'cape', c, sep: false, m: m => cm(m).and(t => t.r(0, 20 + i * 2.6, 32, 2)) }));
      if (cape === 'cape_star') add({ g: 'cape', c: '#FFE98A', flat: true, sep: false, m: m => m.pts([[8, 26], [24, 25], [7, 22], [25, 21], [20, 28]]) });
      if (cape === 'cape_leaf') add({ g: 'cape', c: '#2E8A5A', flat: true, sep: false, m: m => m.l(16, 18, 16, 29, 1).l(16, 22, 9, 26, 1).l(16, 24, 23, 27, 1) });
      if (cape === 'cape_gold') add({ g: 'cape', c: '#FFF3C4', flat: true, sep: false, m: m => m.r(7, 28, 18, 1) });
    }
    return P;
  }
  /* v33: every aura is richer now: a soft glow that hugs the hero, a double ground ring, a column of light behind,
     and more (and more detailed) things floating around: flames, notes, hearts, crystals, wisps, rays ... */
  const AUX = {
    aura_sparkle: ['255,226,120', 'rgba(255,226,120,.5)', 'rgba(255,226,120,.2)'],
    aura_hearts: ['255,120,150', 'rgba(255,120,150,.5)', 'rgba(255,120,150,.2)'],
    aura_ring: ['90,220,240', 'rgba(110,210,255,.5)', 'rgba(255,150,220,.2)'],
    aura_stars: ['158,216,240', 'rgba(158,216,240,.5)', 'rgba(150,170,255,.2)'],
    aura_leaves: ['110,190,80', 'rgba(120,200,90,.45)', 'rgba(120,200,90,.18)'],
    aura_bubbles: ['150,220,245', 'rgba(150,220,245,.45)', 'rgba(150,220,245,.18)'],
    aura_snow: ['225,245,255', 'rgba(210,240,255,.55)', 'rgba(170,215,255,.2)'],
    aura_fire: ['255,130,50', 'rgba(255,140,50,.55)', 'rgba(255,90,30,.22)'],
    aura_rainbow: ['190,140,255', 'rgba(200,150,255,.5)', 'rgba(255,170,210,.2)'],
    aura_music: ['190,150,255', 'rgba(190,150,255,.5)', 'rgba(255,215,120,.2)'],
    aura_petals: ['255,170,200', 'rgba(255,170,200,.5)', 'rgba(255,170,200,.2)'],
    aura_gems: ['120,220,255', 'rgba(255,220,120,.5)', 'rgba(130,200,255,.2)'],
    aura_shadow: ['140,100,220', 'rgba(110,70,190,.55)', 'rgba(70,40,130,.25)'],
    aura_sun: ['255,214,90', 'rgba(255,214,90,.55)', 'rgba(255,170,60,.22)']
  };
  const AS = {   /* little shapes, centred on x,y, s = size */
    heart: (m, x, y, s) => m.e(x - s * .5, y, s * .55, s * .5).e(x + s * .5, y, s * .55, s * .5).p([[x - s * 1.02, y + s * .2], [x + s * 1.02, y + s * .2], [x, y + s * 1.15]]),
    star4: (m, x, y, s) => m.p([[x, y - s * 1.2], [x + s * .3, y - s * .3], [x + s * 1.2, y], [x + s * .3, y + s * .3], [x, y + s * 1.2], [x - s * .3, y + s * .3], [x - s * 1.2, y], [x - s * .3, y - s * .3]]),
    flame: (m, x, y, s) => m.e(x, y + s * .3, s * .62, s * .75).p([[x - s * .55, y], [x - s * .1, y - s * 2], [x + s * .25, y - s * .9], [x + s * .6, y]]),
    flake: (m, x, y, s) => m.l(x - s, y, x + s, y, .32).l(x, y - s, x, y + s, .32).l(x - s * .7, y - s * .7, x + s * .7, y + s * .7, .28).l(x - s * .7, y + s * .7, x + s * .7, y - s * .7, .28),
    note: (m, x, y, s) => m.e(x, y + s * 1.2, s * .8, s * .6).l(x + s * .7, y + s * 1.2, x + s * .7, y - s * 1.3, .32).l(x + s * .7, y - s * 1.3, x + s * 1.9, y - s * .3, .34),
    petal: (m, x, y, s) => m.e(x, y, s * 1.1, s * .6),
    leaf: (m, x, y, s) => m.p([[x - s * 1.2, y + s * .3], [x, y - s * .7], [x + s * 1.2, y - s * .2], [x + s * .1, y + s * .8]]),
    gem: (m, x, y, s) => m.p([[x, y - s * 1.4], [x + s, y], [x, y + s * 1.4], [x - s, y]]),
    bubble: (m, x, y, s) => m.e(x, y, s, s).sub(t => t.e(x, y, s * .5, s * .5)),
    wisp: (m, x, y, s) => m.p([[x - s * .6, y + s * 1.2], [x - s * .9, y - s * .2], [x - s * .1, y - s * 1.4], [x + s * .5, y - s * .4], [x + s * .8, y + s * 1.1]]),
    dot: (m, x, y, s) => m.e(x, y, s * .6, s * .6),
    ray: (m, x, y, s, q) => m.l(x, y, x + Math.cos(q) * s * 2.4, y + Math.sin(q) * s * 2.4, .36)
  };
  function auraExtra(aura, layer) {
    const X = AUX[aura]; if (!X) return [];
    const P = [], add = o => P.push(o), rgb = X[0], cs = [`rgb(${rgb})`];
    const hex = '#' + rgb.split(',').map(n => (+n).toString(16).padStart(2, '0')).join('');
    /* a column of light and a glow, behind the hero */
    if (layer === 'back') {
      add({ g: 'legs', flat: true, sep: false, glow: { r: 1.5, pulse: .9, c1: X[1].replace(/[\d.]+\)$/, '.34)'), c2: X[2].replace(/[\d.]+\)$/, '.14)') }, c: '#000000', m: m => m });
      add({ g: 'legs', c: hex, flat: true, sep: false, fr: [0, 2], m: m => m.e(16, 30.2, 14.5, 2.5).sub(t => t.e(16, 30.2, 13.6, 1.9)) });
      add({ g: 'legs', c: hex, flat: true, sep: false, fr: [1, 3], m: m => m.e(16, 30.2, 13.6, 2.2).sub(t => t.e(16, 30.2, 12.7, 1.6)) });
      [[5, 29], [11, 31.4], [22, 31.2], [27, 29.2]].forEach(([x, y], i) => add({ g: 'legs', c: hex, flat: true, sep: false, fr: i % 2 ? [1, 2] : [0, 3], m: m => m.e(x, y, .8, .5) }));
      [[7, 26, 15], [25, 26, 14], [16, 28, 12]].forEach(([x, y, hh], i) => [0, 1, 2, 3].forEach(f => { const k = (f + i * 2) % 4; add({ g: 'body', c: hex, flat: true, sep: false, fr: [f], m: m => m.l(x, y - k * 2, x, y - hh + k * .6 - 2, .3) }); }));
      return P;
    }
    const rise = (shape, pts, o = {}) => pts.forEach(([x, y], i) => [0, 1, 2, 3].forEach(f => {
      const k = (f + i) % 4; if (k === 3 && !o.keep) return;
      const px = x + Math.sin((f + i) * 1.571) * (o.sway == null ? .7 : o.sway), py = y - k * (o.rise == null ? 2 : o.rise), c = o.cc ? o.cc[i % o.cc.length] : (o.c || hex);
      add({ g: 'body', c, flat: true, sep: false, fr: [f], m: m => shape(m, px, py, o.s || 1) });
    }));
    const orbit = (shape, n, rx, ry, cy, o = {}) => Array.from({ length: n }).forEach((_, i) => [0, 1, 2, 3].forEach(f => {
      const q = (i / n + f / 4 / n * (o.dir || 1)) * Math.PI * 2, x = 16 + Math.cos(q) * rx, y = cy + Math.sin(q) * ry, c = o.cc ? o.cc[i % o.cc.length] : (o.c || hex);
      if (o.front === false && Math.sin(q) > .75) return;
      add({ g: 'body', c, flat: true, sep: false, fr: [f], m: m => shape(m, x, y, o.s || 1, q) });
    }));
    switch (aura) {
      case 'aura_sparkle': rise(AS.star4, [[3, 24], [29, 21], [4, 12], [28, 9], [8, 4], [24, 3]], { c: '#FFF3B0', s: .9, rise: 2.4 }); orbit(AS.dot, 6, 12.8, 12, 16, { c: '#FFE98A', s: .8 }); break;
      case 'aura_hearts': rise(AS.heart, [[3, 26], [29, 24], [5, 15], [27, 13], [9, 8], [23, 6]], { cc: ['#FF7A99', '#FFB3C6', '#E8405E'], s: .9, rise: 2.4, sway: 1 }); break;
      case 'aura_ring': orbit(AS.dot, 12, 13.5, 2.4, 29.8, { cc: ['#FF6B6B', '#FFD166', '#6BD18B', '#4DA3FF', '#B79CFF', '#FF9FDA'], s: 1.1 }); rise(AS.star4, [[4, 24], [28, 22]], { c: '#B8F2F8', s: .8 }); break;
      case 'aura_stars': orbit(AS.star4, 4, 13, 11, 16, { cc: ['#FFE08A', '#9ED8F0', '#FFD166', '#C7B8FF'], s: 1.2 }); orbit(AS.dot, 8, 11, 9.5, 16, { c: '#FFFFFF', s: .8, dir: -1 }); break;
      case 'aura_leaves': rise(AS.leaf, [[3, 24], [29, 22], [4, 13], [28, 11], [9, 5], [24, 4]], { cc: ['#7AB84E', '#4E9A3E', '#A6D46A', '#D9A441'], s: 1, rise: 2.2, sway: 1.3 }); break;
      case 'aura_bubbles': rise(AS.bubble, [[3, 27], [29, 25], [5, 18], [27, 16], [8, 9], [24, 8]], { cc: ['#BDEBFA', '#9ED8F0', '#E6F8FF'], s: 1.15, rise: 2.6, sway: .9 }); break;
      case 'aura_snow': rise(AS.star4, [[3, 8], [29, 12], [4, 20], [28, 24], [10, 2], [23, 5]], { cc: ['#FFFFFF', '#D6F0FF'], s: 1, rise: -2.2, sway: 1 }); rise(AS.dot, [[7, 14], [26, 4], [8, 26], [27, 18]], { c: '#FFFFFF', s: .9, rise: -2.6 }); break;
      case 'aura_fire': rise(AS.flame, [[4, 29], [28, 29], [8, 30], [24, 30], [3, 22], [29, 21]], { cc: ['#FF8A2E', '#FFC24A', '#E8502E'], s: 1.9, rise: 2.4, sway: .6 }); rise(AS.dot, [[6, 20], [26, 18], [11, 12], [21, 10]], { c: '#FFE49A', s: .8, rise: 3 }); break;
      case 'aura_rainbow': orbit(AS.star4, 7, 13.2, 11.5, 15.5, { cc: ['#FF6B6B', '#FFB347', '#FFE45A', '#6BD18B', '#4DA3FF', '#B79CFF', '#FF9FDA'], s: 1 }); break;
      case 'aura_music': rise(AS.note, [[3, 27], [28, 25], [4, 17], [27, 15], [8, 8], [24, 6]], { cc: ['#C7A6FF', '#FFD166', '#9ED8F0'], s: .95, rise: 2.4, sway: 1.1 }); break;
      case 'aura_petals': rise(AS.petal, [[3, 8], [29, 10], [4, 18], [28, 22], [9, 3], [23, 5], [6, 26]], { cc: ['#FFB3CF', '#FFFFFF', '#FF8FB8'], s: .95, rise: -2.4, sway: 1.5 }); break;
      case 'aura_gems': orbit(AS.gem, 6, 13, 12, 16, { cc: ['#FF5A4E', '#6BD18B', '#4DA3FF', '#FFD166', '#C77BFF', '#7BE3E3'], s: .95 }); rise(AS.dot, [[5, 22], [27, 20]], { c: '#FFFFFF', s: .7 }); break;
      case 'aura_shadow': rise(AS.wisp, [[3, 28], [29, 27], [8, 30], [24, 30], [5, 20], [27, 18]], { cc: ['#6A4AB0', '#3A2A66', '#8A6AD0'], s: 1.3, rise: 2.6, sway: .8 }); rise(AS.dot, [[6, 12], [26, 10]], { c: '#B79CFF', s: .7 }); break;
      case 'aura_sun': orbit(AS.ray, 12, 8.6, 8.2, 7, { cc: ['#FFD95A', '#FFF1A8'], s: 1.1 }); orbit(AS.dot, 6, 13, 12, 17, { c: '#FFE98A', s: .8 }); break;
      default: break;
    }
    return P;
  }
  function auraParts(aura, layer) { return auraPartsBase(aura, layer).concat(auraExtra(aura, layer)); }
  function auraPartsBase(aura, layer) {
    /* v18 heroic auras: holy glimmer, rising embers, a rune circle, and storm sparks */
    const P = [], add = o => P.push(o);
    if (layer === 'back') {
      if (aura === 'aura_fire') { add({ g: 'legs', c: '#E8602E', flat: true, sep: false, m: m => m.e(16, 29.8, 12.5, 2.2).sub(t => t.e(16, 29.8, 11.2, 1.4)) }); [[4, 29, [0, 2]], [28, 29, [1, 3]], [9, 31, [1, 3]], [23, 31, [0, 2]], [16, 28, [0, 1]]].forEach(([x, y, fr]) => add({ g: 'legs', c: '#F2C14E', flat: true, sep: false, fr, m: m => m.pts([[x, y], [x, y - 1]]) })); }
      if (aura === 'aura_ring') { add({ g: 'legs', c: '#4FC9D9', flat: true, sep: false, m: m => m.e(16, 29.8, 12.5, 2.2).sub(t => t.e(16, 29.8, 11.2, 1.4)) }); add({ g: 'legs', c: '#B8F2F8', flat: true, sep: false, fr: [0, 2], m: m => m.pts([[5, 30], [27, 29], [16, 32]]) }); add({ g: 'legs', c: '#B8F2F8', flat: true, sep: false, fr: [1, 3], m: m => m.pts([[9, 31], [23, 31], [16, 28]]) }); }
      /* v25 */
      if (aura === 'aura_shadow') { add({ g: 'legs', c: '#3A2A5A', flat: true, sep: false, m: m => m.e(16, 30, 11.5, 2.1) }); add({ g: 'legs', c: '#5A3E8A', flat: true, sep: false, fr: [0, 2], m: m => m.e(16, 30, 9, 1.3) }); }
      if (aura === 'aura_sun') { add({ g: 'head', c: '#F2C14E', flat: true, sep: false, m: m => m.e(17, 6.8, 6.4, 6.4).sub(t => t.e(17, 6.8, 5.5, 5.5)) }); [0, 1, 2, 3, 4, 5, 6, 7].forEach(i => add({ g: 'head', c: '#FFE98A', flat: true, sep: false, fr: i % 2 ? [1, 3] : [0, 2], m: m => m.pts([[17 + Math.cos(i * Math.PI / 4) * 7.6, 6.8 + Math.sin(i * Math.PI / 4) * 7.6]]) })); }
      return P;
    }
    /* v25 */
    if (aura === 'aura_music') [[4, 25], [28, 23], [5, 15], [27, 13]].forEach(([x, y], i) => [0, 1, 2, 3].forEach(f => add({ g: 'body', c: i % 2 ? '#B58CF2' : '#F2C14E', flat: true, sep: false, fr: [f], m: m => m.e(x + (f % 2 ? .4 : -.4), y - f * 1.5, .8, .65).l(x + (f % 2 ? .4 : -.4) + .7, y - f * 1.5, x + (f % 2 ? .4 : -.4) + .7, y - f * 1.5 - 2.2, .3) })));
    if (aura === 'aura_petals') [[3, 4], [26, 3], [6, 15], [29, 16], [15, 1]].forEach(([x, y], i) => [0, 1, 2, 3].forEach(f => add({ g: 'body', c: i % 2 ? '#FFFFFF' : '#F7A8C4', flat: true, sep: false, fr: [f], m: m => m.e(x + f * .8, y + f * 1.4, .8, .5) })));
    if (aura === 'aura_gems') ['#E8402E', '#5FB85A', '#4FA8E8', '#F2C14E'].forEach((c, i) => [0, 1, 2, 3].forEach(f => { const q = i * Math.PI / 2 + f * Math.PI / 8, x = 16 + Math.cos(q) * 13.2, y = 16 + Math.sin(q) * 12; add({ g: 'body', c, flat: true, sep: false, fr: [f], m: m => m.p([[x, y - 1.6], [x + 1.2, y], [x, y + 1.6], [x - 1.2, y]]) }); }));
    if (aura === 'aura_shadow') [[5, 27], [27, 26], [9, 29], [23, 29]].forEach(([x, y], i) => [0, 1, 2, 3].forEach(f => add({ g: 'body', c: i % 2 ? '#7A5AC9' : '#4A3A6A', flat: true, sep: false, fr: [f], m: m => m.r(x + (f % 2 ? .5 : -.5), y - f * 2, 1, 1.4) })));
    if (aura === 'aura_sparkle') [[3, 6, [0, 1]], [28, 4, [1, 2]], [4, 22, [2, 3]], [29, 21, [3, 0]]].forEach(([x, y, fr]) => add({ g: 'body', c: '#F2D27A', flat: true, sep: false, fr, m: m => m.pts([[x, y - 1], [x - 1, y], [x, y], [x + 1, y], [x, y + 1]]) }));
    if (aura === 'aura_hearts') [[4, 26], [28, 24], [6, 16], [27, 12]].forEach(([x, y], i) => [0, 1, 2, 3].forEach(f => add({ g: 'body', c: f % 2 ? '#F2A33A' : '#E8603A', flat: true, sep: false, fr: [f], m: m => m.r(x + (i % 2 ? -.5 : .5) * f, y - f * 1.5, 1, 1) })));
    /* v23 */
    if (aura === 'aura_leaves') [[4, 6], [27, 9], [5, 18], [28, 20]].forEach(([x, y], i) => [0, 1, 2, 3].forEach(f => add({ g: 'body', c: i % 2 ? '#7AB84E' : '#4E9A3E', flat: true, sep: false, fr: [f], m: m => m.r(x + (f % 2 ? .5 : -.5), y + f * 1.2, 1.2, .7) })));
    if (aura === 'aura_bubbles') [[4, 26], [28, 24], [6, 16], [27, 14]].forEach(([x, y], i) => [0, 1, 2, 3].forEach(f => add({ g: 'body', c: '#9ED8F0', flat: true, sep: false, fr: [f], m: m => m.e(x + (i % 2 ? -.4 : .4) * f, y - f * 1.6, .9, .9).sub(t => t.e(x + (i % 2 ? -.4 : .4) * f, y - f * 1.6, .45, .45)) })));
    if (aura === 'aura_snow') [[3, 5, [0, 1]], [28, 7, [1, 2]], [4, 17, [2, 3]], [29, 18, [3, 0]], [16, 2, [0, 2]]].forEach(([x, y, fr]) => add({ g: 'body', c: '#FFFFFF', flat: true, sep: false, fr, m: m => m.pts([[x - 1, y - 1], [x + 1, y - 1], [x, y], [x - 1, y + 1], [x + 1, y + 1]]) }));
    if (aura === 'aura_rainbow') [['#E8603A', 3, 8, [0, 2]], ['#F2C14E', 28, 6, [1, 3]], ['#5FB85A', 4, 20, [2, 0]], ['#4FA8E8', 29, 19, [3, 1]], ['#B58CF2', 16, 3, [0, 2]]].forEach(([c, x, y, fr]) => add({ g: 'body', c, flat: true, sep: false, fr, m: m => m.pts([[x, y - 1], [x - 1, y], [x, y], [x + 1, y], [x, y + 1]]) }));
    if (aura === 'aura_stars') [[3, 10, [0]], [29, 8, [1]], [2, 20, [2]], [29, 22, [3]]].forEach(([x, y, fr]) => add({ g: 'body', c: '#9ED8F0', flat: true, sep: false, fr, m: m => m.pts([[x, y], [x + 1, y + 1], [x, y + 2], [x + 1, y + 3]]) }));
    return P;
  }

  /* v35: an evolved weapon (id + '+') is the same weapon, tinted gold, with sparkles */
  const mixGold = (c, k = .38) => /^#[0-9a-f]{6}$/i.test(c || '') ? '#' + [1, 3, 5].map((i, j) => Math.round(parseInt(c.substr(i, 2), 16) * (1 - k) + [255, 214, 102][j] * k).toString(16).padStart(2, '0')).join('') : c;
  const evoParts = list => list.map(p => (p.c ? { ...p, c: mixGold(p.c) } : p)).concat([{ g: 'weap', c: '#FFF3C4', flat: true, sep: false, fr: [0, 2], m: m => m.pts([[25, 1], [27, 3]]) }, { g: 'weap', c: '#FFD166', flat: true, sep: false, fr: [1, 3], m: m => m.pts([[22, 6], [28, 8]]) }]);
  function weaponParts(w) {
    if (typeof w === 'string' && w.endsWith('+')) return evoParts(weaponParts(w.slice(0, -1)));
    const G = 'weap', R = [];
    const a = o => R.push({ g: G, ...o });
    switch (w) {
      case 'weapon_crayon': a({ c: '#FF6B6B', m: m => m.r(24, 9, 3, 13).p([[24, 9], [25.5, 5.5], [27, 9]]), dots: [[24, 12, '#FFD166'], [24, 16, '#FFD166']] }); break;
      case 'weapon_ruler': a({ c: '#FFE6A0', m: m => m.r(24, 4, 3, 19) }); a({ c: '#8a6a1f', flat: true, sep: false, m: m => m.pts([[24, 6], [24, 8], [24, 10], [24, 12], [24, 14], [24, 16], [24, 18]]) }); break;
      case 'weapon_paintbrush': a({ c: '#8b5e3c', m: m => m.r(24, 11, 2, 12) }); a({ c: '#C9CED8', m: m => m.r(24, 9, 2, 2) }); a({ c: '#FF6F91', m: m => m.p([[23.5, 9], [25, 3.5], [26.5, 9]]) }); break;
      case 'weapon_wand': a({ c: '#8b5e3c', m: m => m.r(24, 10, 2, 13) }); a({ c: '#FFD166', m: m => m.p(star(25, 6.5, 5, 2.2)), dots: [[24, 5]] }); break;
      case 'weapon_magnify': a({ c: '#8b5e3c', m: m => m.r(24, 14, 2, 9) }); a({ c: '#BFE3FF', flat: true, sep: false, m: m => m.e(25, 9.5, 3, 3) }); a({ c: '#E8B33A', m: m => m.e(25, 9.5, 4.4, 4.4).sub(t => t.e(25, 9.5, 3, 3)) }); a({ c: '#ffffff', flat: true, sep: false, m: m => m.pts([[24, 8], [23, 9]]) }); break;
      case 'weapon_book': a({ c: '#7C5CFF', m: m => m.r(22, 13, 8, 9) }); a({ c: '#ffffff', sep: false, m: m => m.r(23, 14, 6, 7) }); a({ c: '#7C5CFF', flat: true, sep: false, m: m => m.r(26, 14, 1, 7) }); a({ c: '#FFD166', flat: true, sep: false, m: m => m.pts([[24, 17], [28, 16]]) }); break;
      case 'weapon_lollipop': a({ c: '#F4F4F8', m: m => m.r(24, 12, 1, 11) }); a({ c: '#FF6F91', m: m => m.e(24.5, 8, 4.4, 4.4) }); a({ c: '#ffffff', flat: true, sep: false, m: m => m.pts([[24, 8], [25, 7], [26, 8], [26, 9], [25, 10], [23, 9], [23, 7], [24, 6], [26, 6]]) }); break;
      case 'weapon_quill': a({ c: '#FFD166', m: m => m.p([[24, 23], [23, 13], [24, 7], [28, 2], [28, 8], [26, 14]]), dots: [[25, 6], [26, 5]] }); a({ c: '#E0A800', flat: true, sep: false, m: m => m.l(24, 22, 27, 4, 1) }); break;
      case 'weapon_torch': a({ c: '#8b5e3c', m: m => m.r(24, 13, 2, 10) }); a({ c: '#6B3E26', m: m => m.r(22, 11, 6, 2) }); a({ c: '#FF9A3D', fr: [0, 2, 4], m: m => m.p([[22, 11], [25, 2], [28, 11]]) }); a({ c: '#FF9A3D', fr: [1, 3, 5], m: m => m.p([[22, 11], [24, 3], [28, 11]]) }); a({ c: '#FFE98A', sep: false, m: m => m.p([[23.5, 11], [25, 6], [26.5, 11]]) }); break;
      case 'weapon_rainbow': a({ c: '#8b5e3c', m: m => m.r(24, 8, 2, 15) }); ['#FF6B6B', '#FFD166', '#6BD18B', '#4DA3FF'].forEach((c, i) => a({ c, flat: true, m: m => m.e(25, 8, 7 - i * 1.4, 7 - i * 1.4).sub(t => t.e(25, 8, 5.8 - i * 1.4, 5.8 - i * 1.4)).and(t => t.r(0, 0, 32, 8)) })); break;
      case 'weapon_starhammer': a({ c: '#8b5e3c', m: m => m.r(24, 10, 2, 13) }); a({ c: '#FFD166', m: m => m.p(star(25, 6, 6.4, 2.8)), dots: [[24, 4], [23, 5]] }); break;
      default: a({ c: '#FFC845', m: m => m.r(24, 9, 2, 13) }); a({ c: '#F4C99B', m: m => m.p([[24, 9], [25, 5.5], [26, 9]]) }); a({ c: '#3b2a20', flat: true, sep: false, m: m => m.pts([[25, 5], [24, 6]]) }); a({ c: '#FF8FA3', m: m => m.r(24, 21, 2, 2) });
    }
    return R;
  }
  function shieldParts(s) {
    const G = 'shield', R = [], a = o => R.push({ g: G, ...o });
    switch (s) {
      case 'shield_wood': a({ c: '#B9854F', m: m => m.e(6, 21, 5, 5) }); a({ c: '#D8A86B', sep: false, m: m => m.e(6, 21, 3.4, 3.4) }); a({ c: '#8b5e3c', m: m => m.e(6, 21, 1.4, 1.4) }); break;
      case 'shield_lid': a({ c: '#C9CED8', m: m => m.e(6, 21, 5, 5), dots: [[4, 18], [3, 19]] }); a({ c: '#6B7488', m: m => m.e(6, 20, 1.6, 1.4) }); break;
      case 'shield_cookie': a({ c: '#D9A25B', m: m => m.e(6, 21, 5, 5) }); a({ c: '#5A3A22', flat: true, sep: false, m: m => m.pts([[4, 19], [8, 20], [5, 23], [7, 24], [3, 22]]) }); break;
      case 'shield_book': a({ c: '#4DA3FF', m: m => m.r(2, 16, 9, 11) }); a({ c: '#ffffff', sep: false, m: m => m.r(3, 17, 7, 9) }); a({ c: '#4DA3FF', flat: true, sep: false, m: m => m.r(6, 17, 1, 9) }); break;
      case 'shield_heart': a({ c: '#FF5E8A', m: m => m.p([[6, 27], [1, 21], [1, 18], [3, 16], [5, 16], [6, 17.5], [7, 16], [9, 16], [11, 18], [11, 21]]), dots: [[3, 18], [3, 19]] }); break;
      case 'shield_rainbow': ['#B79CFF', '#4DA3FF', '#6BD18B', '#FFD166', '#FF6B6B'].forEach((c, i) => a({ c, flat: i > 0, sep: i === 0, m: m => m.e(6, 21, 5.2 - i, 5.2 - i) })); break;
      case 'shield_star': a({ c: GOLD, m: m => m.p([[1, 15], [11, 15], [11, 22], [6, 28], [1, 22]]) }); a({ c: '#ffffff', flat: true, sep: false, m: m => m.p(star(6, 20.5, 3.6, 1.5)) }); break;
      case 'shield_planet': a({ c: '#6B4DD6', m: m => m.e(6, 21, 4.6, 4.6) }); a({ c: '#FFD166', flat: true, m: m => m.l(0, 23, 12, 19, 1.4) }); break;
      default: break;
    }
    return R;
  }
  const HKEYS = ['skin', 'hair', 'face', 'outfit', 'hat', 'cape', 'boots', 'weapon', 'shield', 'aura'];
  const isKn = kn => kn && kn !== 'knight_explorer' && typeof KNIGHTS !== 'undefined' && KNIGHTS[kn];
  function heroKey(eq) {
    const kn = eq.knight || DEFAULT_EQUIP.knight;
    return isKn(kn) ? 'k:' + kn + '|' + ['weapon', 'shield', 'cape', 'aura', 'helmet', 'chest', 'gloves', 'legs'].map(s => eq[s] || '').join('|') : 'h:' + HKEYS.map(s => eq[s] || '').join('|');
  }
  /* v21: a sprite "job" is its cache key plus a recipe, so the main thread and the worker draw the same thing */
  const job = {
    hero: eq => { const kn = eq.knight || DEFAULT_EQUIP.knight; return [heroKey(eq), isKn(kn) ? () => [knightParts(kn, eq), KOFF, NF, ''] : () => [heroParts(eq), HOFF, NF, '']]; },
    mon: m => [monKey(m), () => typeof MON2 !== 'undefined' ? [MON2.parts(m), MON2.off, NF, 'mon'] : [monsterParts(m), MOFF, NF, '']]
  };
  function hero(eq) {
    const kn = eq.knight || DEFAULT_EQUIP.knight, [k, recipe] = job.hero(eq);
    return svgOf(memo(k, () => sheet(...recipe())), isKn(kn) ? 'hero-svg px-hero px-knight' : 'hero-svg px-hero', isKn(kn) ? KNIGHTS[kn].name : 'Hero');
  }
  const heroReady = eq => CACHE.has(heroKey(eq));
  const monKey = m => 'm:' + (m.seed || m.n) + ':' + m.b + ':' + m.c + ':' + m.e + ':' + (m.mo || m.m) + ':' + m.f.join(',') + ':' + (m.sp || '') + ':' + (m.big ? 'B' + (m.arch ?? '') + (m.form ? 'e' : '') : m.boss ? 'b' : '');
  /* knights (09c): offsets follow the reference idle loop, plus hurt + attack frames */
  const KOFF = {
    legs: F([[0, 0], [0, 0], [0, 0], [0, 0]], [-1, 0], [1, 0]),
    body: F([[0, 0], [0, 0], [0, 1], [0, 1]], [-1, 0], [1, 0]),
    weap: F([[0, 0], [0, 1], [0, 1], [0, 0]], [-1, 1], [3, -1]),
    shield: F([[0, 0], [0, 1], [0, 1], [0, 0]], [-1, 0], [1, 0]),
    cape: F([[0, 0], [0, 1], [-1, 1], [-1, 0]], [-1, 0], [-1, 0]),
    plume: F([[0, 0], [1, 0], [1, 1], [0, 1]], [-2, 1], [0, 0]),
    head: F([[0, 0], [0, 0], [0, .5], [0, .5]], [-1.5, .5], [1, 0]),
    torso: F([[0, 0], [0, 0], [0, .5], [0, .5]], [-1, 0], [1, 0]),
    arm: F([[0, 0], [0, .5], [0, .5], [0, 0]], [-1, .5], [2, -1]),
    aura: HOFF.aura
  };
  /* move / mirror a part without touching its lighting (shading is worked out after the move) */
  const xform = (p, fr, fd) => ({ ...p, m: mm => { const t = new Mask(); p.m(t); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (t.a[y * N + x]) { const [a, b] = fr(x, y); mm.raw(a, b); } }, dots: (p.dots || []).map(([x, y, c]) => [...fd(x, y), c]) });
  const flipP = p => xform(p, (x, y) => [N - 1 - x, y], (x, y) => [D - 1 - x, y]);
  const shiftP = (p, dx, dy) => xform(p, (x, y) => [x + Math.round(dx * K), y + Math.round(dy * K)], (x, y) => [x + dx, y + dy]);
  function knightParts(id, eq) {
    const K = KNIGHTS[id], W = eq.weapon || 'weapon_pencil', SH = eq.shield || 'shield_none', CP = eq.cape || 'cape_none', AU = eq.aura || 'aura_none';
    if (K.build) {   /* v18: heroic knights are assembled from a body + their gear */
      const P = [{ g: 'legs', c: 'rgba(15,18,24,.32)', shadow: true, flat: true, m: m => m.e(16, 30.8, 10.5, 1.3) }];
      auraParts(AU, 'back').forEach(p => P.push(p)); K.build(eq).forEach(p => P.push(p)); auraParts(AU, 'front').forEach(p => P.push(p));
      return P;
    }
    let parts = K.parts.map(p => K.flip ? flipP(p) : p);
    const P = [{ g: 'legs', c: 'rgba(20,10,40,.28)', shadow: true, flat: true, m: m => m.e(16, 30.6, 10, 1.4) }];
    auraParts(AU, 'back').forEach(p => P.push(p));
    /* a bought cape or wings: recolour the knight's own cape, or hang one behind */
    if (CP !== 'cape_none') { parts = parts.filter(p => p.g !== 'cape'); capeParts(CP).forEach(p => P.push(p)); }
    const swapW = W !== 'weapon_pencil', swapS = SH !== 'shield_none';
    let wDone = false, sDone = false;
    for (const p of parts) {
      if (swapW && p.g === 'weap') { if (!wDone) { wDone = true; const [gx, gy] = K.grip; weaponParts(W).forEach(q => P.push(shiftP(q, gx - 25, gy - 22))); P.push({ g: 'weap', c: K.hand, m: m => m.e(gx + .5, gy + .5, 2.4, 2.4) }); } continue; }
      if (swapS && p.g === 'shield') { if (!sDone) { sDone = true; shieldParts(SH).forEach(q => P.push(q)); } continue; }
      P.push(p);
    }
    if (swapS && !sDone) shieldParts(SH).forEach(q => P.push(q));
    auraParts(AU, 'front').forEach(p => P.push(p));
    return P;
  }

  /* ---------------- monsters: the level data (960 body+colour+eye combos + species variant), redrawn in pixels ---------------- */
  /* body: mask fn + metrics. cx/top/ey (eye row)/my (mouth row)/hw (half width)/bot */
  const MBODY = {
    blob: { cx: 16, top: 8, ey: 15, my: 21, hw: 11, bot: 29, m: m => m.p([[5, 29.5], [5, 20], [7, 13], [11, 9], [16, 7.6], [21, 9], [25, 13], [27, 20], [27, 29.5]]) },
    round: { cx: 16, top: 8, ey: 15, my: 21, hw: 11, bot: 29, m: m => m.e(16, 19, 11.2, 10.8) },
    egg: { cx: 16, top: 5, ey: 13, my: 20, hw: 9, bot: 29, m: m => m.e(16, 17.6, 9.4, 12.4) },
    ghost: { cx: 16, top: 6, ey: 13, my: 19, hw: 10, bot: 29, m: m => m.p([[6, 29.5], [6, 14], [8, 9], [12, 6.4], [20, 6.4], [24, 9], [26, 14], [26, 29.5], [23.5, 27], [21, 29.5], [18.5, 27], [16, 29.5], [13.5, 27], [11, 29.5], [8.5, 27]]) },
    box: { cx: 16, top: 9, ey: 15, my: 22, hw: 10, bot: 29, m: m => m.r(6, 9, 20, 21).sub(t => t.pts([[6, 9], [7, 9], [6, 10], [25, 9], [24, 9], [25, 10], [6, 29], [25, 29]])) },
    tri: { cx: 16, top: 5, ey: 18, my: 24, hw: 8, bot: 29, m: m => m.p([[16, 4.4], [19, 8], [27.5, 27], [25, 29.6], [7, 29.6], [4.5, 27], [13, 8]]) },
    star: { cx: 16, top: 6, ey: 16, my: 21, hw: 9, bot: 29, m: m => m.p(star(16, 18, 13, 7.4)) },
    cloud: { cx: 16, top: 7, ey: 15, my: 21, hw: 11, bot: 29, m: m => m.e(9.5, 21, 6, 6).e(16, 15, 8, 8).e(22.5, 20, 6.4, 6.4).r(7, 20, 18, 10) },
    fish: { cx: 13, top: 10, ey: 15, my: 20, hw: 9, bot: 27, m: m => m.e(14, 18.5, 10.5, 8.5).p([[22, 18.5], [30, 12], [28, 18.5], [30, 25]]) },
    bean: { cx: 16, top: 13, ey: 19, my: 24, hw: 12, bot: 29, m: m => m.e(16, 21.6, 12, 8.4).e(13, 18, 8, 6) }
  };
  const MOFF = {
    body: F([[0, 0], [0, 0], [0, 1], [0, 1]], [2, 0], [-2, 0]),
    face: F([[0, 0], [0, 0], [0, 1], [0, 1]], [2, 0], [-2, 0]),
    back: F([[0, 0], [0, 0], [0, 1], [0, 1]], [2, 0], [-2, 0]),
    wing: F([[0, 0], [0, -1], [0, -1], [0, 0]], [2, 1], [-2, -1]),
    tail: F([[0, 0], [1, 0], [1, 1], [0, 1]], [2, 0], [-1, 0]),
    float: F([[0, 0], [0, -1], [0, -1], [0, 0]], [2, -1], [-2, 0]),
    feet: F([[0, 0], [0, 0], [0, 0], [0, 0]], [1, 0], [-1, 0])
  };
  function monsterParts(m) {
    const B = MBODY[m.b] || MBODY.blob, { cx, top, ey, my, hw, bot } = B, c0 = PAL[m.c], c1 = dk(c0, .28), c2 = lt(c0, .55), F2 = new Set(m.f), R = [];
    const a = o => R.push(o), body = B.m, inBody = fn => (mm => { fn(mm); mm.and(body); });
    a({ g: 'feet', c: 'rgba(20,10,40,.28)', shadow: true, flat: true, m: mm => mm.e(cx + 1, 30.6, hw + 1, 1.4) });
    /* back features */
    if (F2.has('wingsBat')) a({ g: 'wing', c: c1, m: mm => mm.p([[cx - hw + 3, ey - 1], [cx - hw - 4, ey - 9], [cx - hw - 5, ey + 1], [cx - hw - 2, ey - 1], [cx - hw - 2, ey + 4], [cx - hw + 2, ey + 4]]).p([[cx + hw - 3, ey - 1], [cx + hw + 4, ey - 9], [cx + hw + 5, ey + 1], [cx + hw + 2, ey - 1], [cx + hw + 2, ey + 4], [cx + hw - 2, ey + 4]]) });
    if (F2.has('wingsAngel')) a({ g: 'wing', c: '#F4F6FF', m: mm => mm.e(cx - hw - 1, ey + 1, 4, 5).e(cx + hw + 1, ey + 1, 4, 5), dots: [[cx - hw - 2, ey + 2, '#C9D3F0'], [cx + hw + 1, ey + 2, '#C9D3F0']] });
    if (F2.has('tail') && m.b !== 'fish') a({ g: 'tail', c: c0, m: mm => mm.l(cx + hw - 2, bot - 3, cx + hw + 3, bot - 5, 2.4).l(cx + hw + 3, bot - 5, cx + hw + 3, bot - 11, 2.4) });
    if (F2.has('horns')) a({ g: 'back', c: '#FFE9A8', m: mm => mm.p([[cx - 7, top + 4], [cx - 7, top - 4], [cx - 3, top + 2]]).p([[cx + 7, top + 4], [cx + 7, top - 4], [cx + 3, top + 2]]) });
    if (F2.has('horn')) a({ g: 'back', c: '#FFD166', m: mm => mm.p([[cx - 2, top + 2], [cx, top - 6], [cx + 2, top + 2]]), dots: [[cx - 1, top - 1, '#E0A800'], [cx, top - 3, '#E0A800']] });
    if (F2.has('antennae')) { a({ g: 'float', c: c1, flat: true, m: mm => mm.l(cx - 3, top + 1, cx - 6, top - 4, 1).l(cx + 3, top + 1, cx + 6, top - 4, 1) }); a({ g: 'float', c: '#FFD166', m: mm => mm.e(cx - 6, top - 4.5, 1.7, 1.7) }); a({ g: 'float', c: '#FF6F91', m: mm => mm.e(cx + 6.5, top - 4.5, 1.7, 1.7) }); }
    if (F2.has('earsCat')) { a({ g: 'back', c: c0, m: mm => mm.p([[cx - 8, top + 4], [cx - 8, top - 4], [cx - 2, top + 2]]).p([[cx + 8, top + 4], [cx + 8, top - 4], [cx + 2, top + 2]]) }); a({ g: 'back', c: '#FF9FB0', flat: true, sep: false, m: mm => mm.pts([[cx - 7, top - 1], [cx - 7, top], [cx - 6, top + 1], [cx + 6, top - 1], [cx + 6, top], [cx + 5, top + 1]]) }); }
    if (F2.has('earsBunny')) { a({ g: 'back', c: c0, m: mm => mm.e(cx - 4, top - 4, 2, 6).e(cx + 4, top - 4, 2, 6) }); a({ g: 'back', c: '#FF9FB0', flat: true, sep: false, m: mm => mm.r(cx - 5, top - 7, 1, 6).r(cx + 3, top - 7, 1, 6) }); }
    if (F2.has('earsRound')) { a({ g: 'back', c: c0, m: mm => mm.e(cx - 7, top + 1, 3.4, 3.4).e(cx + 7, top + 1, 3.4, 3.4) }); a({ g: 'back', c: '#FF9FB0', flat: true, sep: false, m: mm => mm.e(cx - 7, top + 1, 1.6, 1.6).e(cx + 7, top + 1, 1.6, 1.6) }); }
    if (F2.has('spikes')) a({ g: 'back', c: c1, m: mm => { for (let i = 0; i < 5; i++) { const x = cx - 8 + i * 4, y = top + Math.abs(i - 2) * 1.6; mm.p([[x - 2, y + 3], [x, y - 4], [x + 2, y + 3]]); } } });
    if (F2.has('fins')) a({ g: 'back', c: c1, m: mm => mm.p([[cx - 3, top + 3], [cx + 1, top - 4], [cx + 6, top + 3]]) });
    if (F2.has('feet')) a({ g: 'feet', c: c1, m: mm => mm.e(cx - 5, bot + .4, 3.4, 1.8).e(cx + 5, bot + .4, 3.4, 1.8) });
    if (F2.has('arms')) a({ g: 'wing', c: c0, m: mm => mm.e(cx - hw - .5, my + 1, 2, 3).e(cx + hw + .5, my + 1, 2, 3) });
    /* the body */
    a({ g: 'body', c: c0, m: body, dots: [[cx - hw + 3, top + 4, lt(c0, .75)], [cx - hw + 4, top + 3, lt(c0, .75)]] });
    if (F2.has('belly')) a({ g: 'body', c: c2, sep: false, m: inBody(mm => mm.e(cx + 1, bot - 3, hw * .62, hw * .5)) });
    if (F2.has('spots')) a({ g: 'body', c: c1, flat: true, sep: false, m: inBody(mm => mm.e(cx - 6, ey + 6, 1.6, 1.6).e(cx + 6, ey + 4, 1.4, 1.4).e(cx + 3, bot - 3, 1.8, 1.6).e(cx - 2, top + 3, 1.2, 1.2)) });
    if (F2.has('stripes')) a({ g: 'body', c: c1, flat: true, sep: false, m: inBody(mm => mm.r(0, ey + 5, 32, 1).r(0, ey + 8, 32, 1).r(0, ey + 11, 32, 1)) });
    if (F2.has('sprinkles')) [['#FF6F91', [cx - 6, ey + 5]], ['#FFD166', [cx + 5, ey + 6]], ['#6BD18B', [cx - 2, bot - 3]], ['#4DA3FF', [cx + 7, top + 5]], ['#ffffff', [cx - 7, top + 6]]].forEach(([c, [x, y]]) => a({ g: 'body', c, flat: true, sep: false, m: inBody(mm => mm.r(x, y, 2, 1)) }));
    if (F2.has('bolt')) a({ g: 'body', c: '#FFD166', flat: true, sep: false, m: inBody(mm => mm.pts([[cx + 1, my + 3], [cx, my + 4], [cx - 1, my + 5], [cx, my + 5], [cx + 1, my + 5], [cx, my + 6], [cx - 1, my + 7]])) });
    /* face (looks left, toward the hero) */
    const eye = (x, y, w, h, pw, ph) => { a({ g: 'face', c: '#ffffff', flat: true, fr: NOTHURT, m: mm => mm.r(x, y, w, h) }); a({ g: 'face', c: INK, flat: true, sep: false, fr: NOTHURT, m: mm => mm.r(x, y + h - ph, pw, ph), dots: [[x, y + h - ph, '#ffffff']] }); };
    const ex = cx - 1;
    if (m.e === 'one') { a({ g: 'face', c: '#ffffff', flat: true, fr: NOTHURT, m: mm => mm.e(ex + .5, ey + .5, 3.4, 3.4) }); a({ g: 'face', c: INK, flat: true, sep: false, fr: NOTHURT, m: mm => mm.r(ex - 2, ey - 1, 3, 3), dots: [[ex - 2, ey - 1, '#ffffff']] }); }
    else if (m.e === 'three') { eye(ex - 6, ey, 3, 3, 2, 2); eye(ex - 1, ey - 2, 3, 3, 2, 2); eye(ex + 4, ey, 3, 3, 2, 2); }
    else if (m.e === 'stalk') { a({ g: 'float', c: c1, flat: true, m: mm => mm.l(ex - 3, top + 2, ex - 4, top - 4, 1).l(ex + 4, top + 2, ex + 5, top - 4, 1) }); eye(ex - 6, top - 7, 3, 3, 2, 2); eye(ex + 4, top - 7, 3, 3, 2, 2); }
    else if (m.e === 'sleepy') { a({ g: 'face', c: '#ffffff', flat: true, fr: NOTHURT, m: mm => mm.r(ex - 5, ey, 4, 2).r(ex + 2, ey, 4, 2) }); a({ g: 'face', c: INK, flat: true, sep: false, fr: NOTHURT, m: mm => mm.r(ex - 5, ey, 2, 2).r(ex + 2, ey, 2, 2).r(ex - 5, ey - 1, 4, 1).r(ex + 2, ey - 1, 4, 1) }); }
    else if (m.e === 'big') { eye(ex - 6, ey - 2, 4, 4, 2, 3); eye(ex + 2, ey - 2, 4, 4, 2, 3); }
    else { eye(ex - 5, ey - 1, 3, 3, 2, 2); eye(ex + 2, ey - 1, 3, 3, 2, 2); }
    /* hurt eyes: X X */
    a({ g: 'face', c: INK, flat: true, sep: false, fr: [4], m: mm => mm.pts([[ex - 5, ey - 1], [ex - 3, ey - 1], [ex - 4, ey], [ex - 5, ey + 1], [ex - 3, ey + 1], [ex + 2, ey - 1], [ex + 4, ey - 1], [ex + 3, ey], [ex + 2, ey + 1], [ex + 4, ey + 1]]) });
    if (F2.has('eyebrows') || m.big) a({ g: 'face', c: INK, flat: true, sep: false, m: mm => mm.pts([[ex - 6, ey - 3], [ex - 5, ey - 3], [ex - 4, ey - 2], [ex + 5, ey - 3], [ex + 4, ey - 3], [ex + 3, ey - 2]]) });
    if (F2.has('glasses')) a({ g: 'face', c: INK, flat: true, sep: false, fr: NOTHURT, m: mm => mm.r(ex - 6, ey - 2, 5, 5).sub(t => t.r(ex - 5, ey - 1, 3, 3)).r(ex + 1, ey - 2, 5, 5).sub(t => t.r(ex + 2, ey - 1, 3, 3)).r(ex - 1, ey, 2, 1) });
    if (F2.has('cheeks')) a({ g: 'face', c: '#FF8FA3', flat: true, sep: false, m: mm => mm.r(ex - 7, my - 1, 2, 1).r(ex + 5, my - 1, 2, 1) });
    if (F2.has('freckles')) a({ g: 'face', c: c1, flat: true, sep: false, m: mm => mm.pts([[ex - 7, my], [ex - 6, my + 1], [ex + 6, my], [ex + 7, my + 1]]) });
    const mx = ex, mo = m.mo || m.m;
    const mouth = {
      smile: mm => mm.pts([[mx - 3, my - 1], [mx - 2, my], [mx - 1, my], [mx, my], [mx + 1, my], [mx + 2, my - 1]]),
      open: mm => mm.r(mx - 2, my - 1, 4, 3), teeth: mm => mm.r(mx - 3, my - 1, 6, 3), tongue: mm => mm.pts([[mx - 3, my - 1], [mx - 2, my], [mx - 1, my], [mx, my], [mx + 1, my], [mx + 2, my - 1]]),
      oh: mm => mm.r(mx - 1, my - 1, 2, 3), zig: mm => mm.pts([[mx - 4, my], [mx - 3, my - 1], [mx - 2, my], [mx - 1, my - 1], [mx, my], [mx + 1, my - 1], [mx + 2, my], [mx + 3, my - 1]]),
      fang: mm => mm.pts([[mx - 3, my - 1], [mx - 2, my], [mx - 1, my], [mx, my], [mx + 1, my], [mx + 2, my - 1]])
    }[mo] || (mm => mm.r(mx - 2, my, 4, 1));
    a({ g: 'face', c: INK, flat: true, sep: false, fr: IDLE, m: mouth });
    if (mo === 'open') a({ g: 'face', c: '#FF6F91', flat: true, sep: false, fr: IDLE, m: mm => mm.r(mx - 1, my + 1, 2, 1) });
    if (mo === 'teeth') a({ g: 'face', c: '#ffffff', flat: true, sep: false, fr: IDLE, m: mm => mm.pts([[mx - 2, my - 1], [mx, my - 1], [mx + 2, my - 1]]) });
    if (mo === 'tongue') a({ g: 'face', c: '#FF6F91', flat: true, sep: false, fr: IDLE, m: mm => mm.r(mx, my + 1, 2, 2) });
    if (mo === 'fang') a({ g: 'face', c: '#ffffff', flat: true, sep: false, fr: IDLE, m: mm => mm.pts([[mx - 2, my + 1], [mx + 1, my + 1]]) });
    a({ g: 'face', c: INK, flat: true, sep: false, fr: [4], m: mm => mm.r(mx - 1, my - 1, 2, 2) });
    a({ g: 'face', c: INK, flat: true, sep: false, fr: [5], m: mm => mm.r(mx - 3, my - 1, 6, 3) });
    a({ g: 'face', c: '#ffffff', flat: true, sep: false, fr: [5], m: mm => mm.pts([[mx - 3, my - 1], [mx - 1, my - 1], [mx + 1, my - 1], [mx - 2, my + 1], [mx, my + 1], [mx + 2, my + 1]]) });
    /* front gear */
    if (F2.has('scarf')) { a({ g: 'body', c: '#E5484D', sep: false, m: inBody(mm => mm.r(0, my + 3, 32, 2)) }); a({ g: 'body', c: '#C23035', m: mm => mm.r(cx + 3, my + 5, 2, 4) }); }
    if (F2.has('bowtie')) a({ g: 'body', c: '#E5484D', m: mm => mm.p([[cx - 3, my + 3], [cx, my + 4.5], [cx - 3, my + 6]]).p([[cx + 3, my + 3], [cx, my + 4.5], [cx + 3, my + 6]]) });
    if (F2.has('ring')) a({ g: 'body', c: '#FFD166', flat: true, m: mm => mm.l(cx - hw - 3, ey + 7, cx + hw + 3, ey + 3, 1.6) });
    if (F2.has('crown')) a({ g: 'float', c: '#FFD166', m: mm => mm.p([[cx - 5, top + 2], [cx - 5, top - 4], [cx - 2.5, top - 1.5], [cx, top - 5], [cx + 2.5, top - 1.5], [cx + 5, top - 4], [cx + 5, top + 2]]), dots: [[cx, top - 1, '#FF5E8A'], [cx - 4, top, '#4DA3FF'], [cx + 3, top, '#4DA3FF']] });
    if (F2.has('partyHat')) { a({ g: 'float', c: '#FF6F91', m: mm => mm.p([[cx - 4, top + 2], [cx, top - 8], [cx + 4, top + 2]]) }); a({ g: 'float', c: '#FFE98A', flat: true, sep: false, m: mm => mm.r(cx - 2, top - 3, 4, 1).r(cx - 3, top, 6, 1).pts([[cx, top - 8]]) }); }
    if (F2.has('topHat')) { a({ g: 'float', c: '#2b2b3a', m: mm => mm.r(cx - 6, top, 12, 2).r(cx - 4, top - 6, 8, 6) }); a({ g: 'float', c: '#E5484D', flat: true, sep: false, m: mm => mm.r(cx - 4, top - 2, 8, 1) }); }
    if (F2.has('wizardHat')) { a({ g: 'float', c: '#5B3FD6', m: mm => mm.p([[cx - 6, top + 2], [cx + 1, top - 9], [cx + 6, top + 2]]).r(cx - 8, top + 1, 16, 2) }); a({ g: 'float', c: '#FFE98A', flat: true, sep: false, m: mm => mm.pts([[cx, top - 3], [cx - 1, top - 2], [cx, top - 2], [cx + 1, top - 2], [cx, top - 1]]) }); }
    if (F2.has('flower')) { a({ g: 'float', c: '#FF8FB1', m: mm => mm.e(cx + 4, top - 1, 1.5, 1.5).e(cx + 7, top - 1, 1.5, 1.5).e(cx + 5.5, top - 3, 1.5, 1.5).e(cx + 5.5, top + .8, 1.5, 1.5) }); a({ g: 'float', c: '#FFD166', flat: true, sep: false, m: mm => mm.r(cx + 5, top - 2, 1, 1) }); }
    if (F2.has('halo')) a({ g: 'float', c: '#FFD166', flat: true, m: mm => mm.e(cx, top - 3, 5.5, 1.6).sub(t => t.e(cx, top - 3, 3.6, .7)) });
    if (F2.has('bubbles')) [[cx + hw, top + 2, [0, 1]], [cx + hw + 2, top - 2, [1, 2]], [cx - hw - 2, top + 3, [2, 3]]].forEach(([x, y, fr]) => a({ g: 'float', c: '#DDF4FF', flat: true, fr, m: mm => mm.e(x, y, 1.6, 1.6).sub(t => t.r(x - .5, y - .5, 1, 1)) }));
    if (F2.has('stars')) [[cx - hw - 2, ey - 6, [0, 1]], [cx + hw + 1, ey - 8, [1, 2]], [cx + hw - 1, ey + 8, [2, 3]], [cx - hw, ey + 9, [3, 0]]].forEach(([x, y, fr]) => a({ g: 'float', c: '#FFE98A', flat: true, sep: false, fr, m: mm => mm.pts([[x, y - 1], [x - 1, y], [x, y], [x + 1, y], [x, y + 1]]) }));
    return R;
  }
  function monster(m, hue = 0) {
    const k = monKey(m);
    const recipe = job.mon(m)[1];
    return svgOf(memo(k, () => sheet(...recipe())), 'mon-svg px-mon', m.n, NF, hue ? ` style="filter:hue-rotate(${hue}deg)"` : '');
  }

  /* ---------------- Hoot the owl ---------------- */
  const OOFF = { body: F([[0, 0], [0, 0], [0, 1], [0, 1]], [0, 0], [0, 0]), wing: F([[0, 0], [0, -1], [0, 0], [0, 1]], [0, 0], [0, 0]) };
  function owlParts() {
    return [
      { g: 'body', c: '#7C5CFF', m: m => m.p([[7, 10], [8, 2], [13, 7]]).p([[25, 10], [24, 2], [19, 7]]) },
      { g: 'wing', c: '#6B4BE0', m: m => m.e(6.5, 19, 3, 6).e(25.5, 19, 3, 6) },
      { g: 'body', c: '#8F73FF', m: m => m.e(16, 17.5, 10.5, 11.5), dots: [[9, 10], [10, 9]] },
      { g: 'body', c: '#E8DEFF', sep: false, m: m => m.e(16, 22, 6.5, 6.5) },
      { g: 'body', c: '#C9B8FF', flat: true, sep: false, m: m => m.pts([[13, 21], [15, 21], [17, 21], [19, 21], [14, 24], [16, 24], [18, 24]]) },
      { g: 'body', c: '#ffffff', fr: [0, 1, 2], m: m => m.e(11.5, 13.5, 3.8, 3.8).e(20.5, 13.5, 3.8, 3.8) },
      { g: 'body', c: INK, flat: true, sep: false, fr: [0, 1, 2], m: m => m.r(11, 13, 2, 3).r(20, 13, 2, 3), dots: [[11, 13, '#ffffff'], [20, 13, '#ffffff']] },
      { g: 'body', c: INK, flat: true, fr: [3], m: m => m.r(9, 14, 5, 1).r(18, 14, 5, 1) },
      { g: 'body', c: '#FFB84D', m: m => m.p([[14, 16], [18, 16], [16, 19.5]]) },
      { g: 'body', c: '#FFB84D', m: m => m.r(11, 29, 3, 2).r(18, 29, 3, 2) }
    ];
  }
  function owl() { return svgOf(memo('owl', () => sheet(owlParts(), OOFF, 4)), 'px-owl', 'Hoot', 4); }

  /* ---------------- pixel battle backgrounds (192x108, scaled up crisp) ---------------- */
  const BGW = 192, BGH = 108, HZ = 70;
  const THEME = { '🧸': 'garden', '🌼': 'garden', '🌾': 'farm', '🌸': 'garden', '🍵': 'farm', '🎵': 'garden', '🧁': 'candy', '🦆': 'beach', '🏖️': 'beach', '🐢': 'beach', '🐚': 'beach', '🦀': 'beach', '🐞': 'mushroom', '🌲': 'forest', '🌳': 'forest', '🌿': 'forest', '☁️': 'clouds', '⚡': 'clouds', '🌈': 'rainbow', '🐰': 'meadow', '🌙': 'meadow', '🛶': 'river', '🪜': 'lanterns', '🏘️': 'city', '🏙️': 'city', '⚓': 'city', '⛰️': 'canyon', '⚙️': 'canyon', '💦': 'canyon', '🏜️': 'canyon', '🏰': 'castle', '🐠': 'sea', '💎': 'crystal', '❄️': 'snow', '🪐': 'space' };
  function bg(z, band = S.band, boss = false) {
    const zd = sagaOf(band).zones[Math.max(0, Math.min(9, z))], key = 'bg:' + band + ':' + z + ':' + (boss ? 1 : 0);
    return memo(key, () => {
      const th = THEME[zd.em] || 'garden', night = !!zd.night || th === 'space', h = zd.hue, R = rng(z * 977 + band * 31 + (boss ? 5 : 0));
      const cv = document.createElement('canvas'); cv.width = BGW; cv.height = BGH; const g = cv.getContext('2d');
      const P = (x, y, c, w = 1, hh = 1) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, hh); };
      const hsl = (H, s, l) => `hsl(${(H % 360 + 360) % 360} ${s}% ${l}%)`;
      /* sky: 7 bands with a checker dither on each seam */
      const sk = Array.from({ length: 7 }, (_, i) => night ? hsl(h + 10 + i * 6, 45 - i * 2, 10 + i * 4) : boss ? hsl(h + 330 + i * 4, 55, 34 + i * 6) : hsl(h + i * 4, 72, 62 + i * 4.6));
      const bh = Math.ceil(HZ / 7);
      for (let i = 0; i < 7; i++) { P(0, i * bh, sk[i], BGW, bh); if (i) for (let x = 0; x < BGW; x += 2) P(x + (i % 2), i * bh - 1, sk[i]), P(x + 1 - (i % 2), i * bh, sk[i - 1]); }
      if (th === 'sea') { P(0, 0, '#0E3A63', BGW, BGH); for (let i = 0; i < 6; i++) P(0, i * 9, hsl(205, 70, 18 + i * 4), BGW, 9); for (let i = 0; i < 9; i++) { const x = R() * BGW; for (let y = 0; y < 60; y += 4) P(x + Math.sin(y / 6) * 2, y, 'rgba(180,230,255,.18)', 2, 2); } }
      /* stars / sun / moon */
      if (night) { for (let i = 0; i < 46; i++) { const x = R() * BGW, y = R() * (HZ - 16), c = R() < .2 ? '#C9A8FF' : '#FFF6C8'; P(x, y, c); if (R() < .18) { P(x - 1, y, c); P(x + 1, y, c); P(x, y - 1, c); P(x, y + 1, c); } } }
      const disc = (cx, cy, r, c, ring) => { for (let y = -r - 2; y <= r + 2; y++) for (let x = -r - 2; x <= r + 2; x++) { const d = Math.hypot(x, y); if (d <= r) P(cx + x, cy + y, c); else if (ring && d <= r + 2 && (x + y) % 2 === 0) P(cx + x, cy + y, ring); } };
      if (th === 'space') { disc(150, 24, 12, '#B79CFF', '#7C5CFF'); for (let x = -20; x <= 20; x++) P(150 + x, 24 + Math.round(x * .25), '#FFD166'); disc(40, 18, 4, '#FF8FB1'); }
      else if (night) { disc(156, 20, 9, '#FFF3C4', 'rgba(255,243,196,.35)'); P(152, 17, '#E8DDB0', 2, 2); P(158, 22, '#E8DDB0', 3, 2); }
      else if (!boss && th !== 'sea') disc(160, 18, 8, '#FFF3A0', 'rgba(255,243,160,.6)');
      if (th === 'rainbow') ['#FF6B6B', '#FF9A3D', '#FFD166', '#6BD18B', '#4DA3FF', '#9B7BFF'].forEach((c, i) => { for (let a = 0; a <= 180; a += .5) { const r = 54 - i * 3, x = 96 + Math.cos(a * Math.PI / 180) * r, y = HZ - Math.sin(a * Math.PI / 180) * r; P(x, y, c, 1, 3); } });
      /* pixel clouds */
      const cloud = (x, y, w, c) => { P(x + 3, y, c, w - 6, 1); P(x + 1, y + 1, c, w - 2, 1); P(x, y + 2, c, w, 3); P(x + 2, y - 2, c, Math.floor(w / 3), 2); P(x + Math.floor(w / 2), y - 3, c, Math.floor(w / 3), 3); P(x + 1, y + 5, 'rgba(0,0,40,.12)', w - 2, 1); };
      if (th !== 'sea' && th !== 'space') for (let i = 0; i < (th === 'clouds' ? 7 : 3); i++) cloud(R() * (BGW - 30), 6 + R() * 26, 16 + Math.round(R() * 14), night ? 'rgba(200,200,255,.22)' : boss ? 'rgba(255,200,220,.4)' : '#FFFFFF');
      /* far mountains + mid hills (random walk silhouettes) */
      const ridge = (base, amp, step, c, jag) => { let y = base; for (let x = 0; x < BGW; x++) { if (x % step === 0) y = clamp(y + (R() - .5) * amp * (jag ? 2 : 1), base - amp, base + amp / 2); P(x, y, c, 1, BGH - y); } };
      const GREEN = ['garden', 'farm', 'forest', 'mushroom', 'meadow', 'river', 'lanterns'].includes(th), gh = 95 + (h % 45);
      const far = night ? hsl(h + 40, 30, 20) : boss ? hsl(h + 320, 30, 30) : hsl(h + 50, 30, 62), mid = GREEN ? hsl(gh + 10, night ? 25 : 40, night ? 15 : 42) : night ? hsl(h + 80, 30, 16) : boss ? hsl(h + 300, 30, 24) : hsl(h + 90, 38, 48);
      if (th === 'canyon') { for (let i = 0; i < 4; i++) { const x = R() * BGW, w = 18 + R() * 26, top = 30 + R() * 22; P(x, top, hsl(20, 55, night ? 22 : 52), w, BGH); P(x, top, hsl(20, 60, night ? 30 : 62), w, 2); for (let y = top + 6; y < HZ; y += 5) P(x, y, hsl(15, 50, night ? 18 : 44), w, 1); } }
      else if (th === 'city') { for (let i = 0; i < 11; i++) { const x = i * 18 + R() * 6, w = 12 + R() * 6, top = 26 + R() * 30, c = night ? hsl(240, 25, 18 + R() * 8) : hsl(215, 18, 50 + R() * 12); P(x, top, c, w, BGH); for (let y = top + 3; y < HZ - 2; y += 4) for (let xx = x + 2; xx < x + w - 2; xx += 3) if (R() < .6) P(xx, y, night ? '#FFD166' : '#CFE8FF', 1, 2); } }
      else if (th === 'castle') { const c = hsl(h + 10, 25, night ? 16 : 40); P(60, 34, c, 72, 40); [[56, 18], [86, 10], [126, 22]].forEach(([x, top]) => { P(x, top, c, 14, 60); for (let i = 0; i < 14; i += 4) P(x + i, top - 3, c, 2, 3); P(x + 5, top + 8, '#FFD166', 3, 4); P(x + 6, top - 9, '#E5484D', 1, 6); P(x + 7, top - 9, '#E5484D', 3, 2); }); for (let i = 0; i < 72; i += 4) P(60 + i, 31, c, 2, 3); P(90, 52, '#1a1030', 12, 22); }
      else if (th === 'crystal') { P(0, 0, '#1E1438', BGW, HZ); for (let i = 0; i < 14; i++) { const x = R() * BGW, hh = 10 + R() * 26, c = ['#9B5DE5', '#4DD2FF', '#FF8FB1'][i % 3]; for (let y = 0; y < hh; y++) { const w = Math.max(1, Math.round((1 - y / hh) * 5)); P(x - w / 2, HZ - y, c, w, 1); } P(x, HZ - hh * .6, '#ffffff'); } }
      else ridge(46, 14, 3, far, th === 'snow');
      if (!['city', 'castle', 'crystal', 'sea', 'space'].includes(th)) ridge(58, 6, 4, mid, false);
      /* ground */
      const gtop = HZ, gc = { beach: '#E9C98C', sea: '#C7A06A', canyon: '#C7743F', city: '#8A8FA3', castle: '#5C5470', crystal: '#4A3A6A', snow: '#EAF4FF', space: '#5B5478', clouds: '#F4F6FF', candy: '#FFB9CF', river: '#3E8E5A' }[th] || (night ? hsl(gh, 30, 21) : hsl(gh, 48, 44));
      const gcD = mix(gc.startsWith('#') ? gc : '#4a7a4a', '#000000', .2);
      P(0, gtop, gc, BGW, BGH - gtop);
      const gtopc = gc.startsWith('#') ? mix(gc, '#ffffff', .3) : hsl(gh, 52, night ? 30 : 58);
      P(0, gtop, gtopc, BGW, 2); for (let x = 0; x < BGW; x += 3) P(x, gtop - 1, gtopc, 1, 1);
      /* ground pattern: checker tiles fading toward the viewer */
      for (let y = gtop + 4; y < BGH; y += 6) for (let x = (y / 6 | 0) % 2 * 6; x < BGW; x += 12) P(x, y, gc.startsWith('#') ? mix(gc, '#000000', .1) : 'rgba(0,0,0,.1)', 6, 3);
      if (th === 'beach' || th === 'river' || th === 'sea') { const wc = th === 'sea' ? '#2A6FA8' : '#4DB6E8'; P(0, gtop - 6, wc, BGW, 6); for (let x = 0; x < BGW; x += 6) P(x + (R() * 3 | 0), gtop - 5 + (R() * 3 | 0), '#BFEAFF', 3, 1); }
      /* props */
      const tree = (x, y, s, c) => { P(x - 1, y - s, '#6B4423', 2, s); for (let j = -s; j <= 0; j++) for (let i = -s; i <= s; i++) if (i * i + j * j <= s * s) P(x + i, y - s - 3 + j, (i + j) < -s / 2 ? mix(c, '#ffffff', .25) : c); };
      const pine = (x, y, s, c) => { P(x, y - 3, '#5A3A22', 1, 3); for (let j = 0; j < s * 2; j++) P(x - Math.floor(j / 2), y - 3 - s * 2 + j, j % 4 < 2 ? c : mix(c, '#000000', .15), Math.floor(j / 2) * 2 + 1, 1); };
      const palm = (x, y) => { for (let j = 0; j < 22; j++) P(x + Math.round(Math.sin(j / 8) * 3), y - j, '#8B6A3E', 2, 1); const tx = x + 3, ty = y - 22; [[-1, -.2], [1, -.2], [-1, .5], [1, .5], [0, -1]].forEach(([dx, dy]) => { for (let k = 0; k < 9; k++) P(tx + dx * k, ty + dy * k + k * k * .08, '#3FA564', 2, 1); }); P(tx, ty + 1, '#7A5232', 2, 2); };
      const lamp = (x, y) => { P(x, y - 20, '#3B2A4F', 1, 20); P(x - 2, y - 24, '#FFB84D', 5, 4); P(x - 3, y - 25, '#3B2A4F', 7, 1); for (let i = -6; i <= 6; i += 2) P(x + i, y - 22 + Math.abs(i) / 2, 'rgba(255,200,90,.35)'); };
      const mush = (x, y) => { P(x - 1, y - 5, '#FFF3E0', 3, 5); P(x - 4, y - 8, '#E5484D', 9, 3); P(x - 3, y - 9, '#E5484D', 7, 1); P(x - 2, y - 8, '#ffffff'); P(x + 2, y - 7, '#ffffff'); };
      const flowers = n => { for (let i = 0; i < n; i++) { const x = R() * BGW, y = gtop + 4 + R() * 30, c = ['#FF8FB1', '#FFD166', '#ffffff', '#B79CFF'][i % 4]; P(x, y, c); P(x - 1, y + 1, c); P(x + 1, y + 1, c); P(x, y + 2, c); P(x, y + 1, '#FFD166'); } };
      if (th === 'garden' || th === 'farm' || th === 'candy') { for (let i = 0; i < 6; i++) tree(8 + i * 34 + R() * 10, gtop + 1, 5 + (R() * 3 | 0), th === 'candy' ? ['#FF8FB1', '#FFD166', '#7ED6C8'][i % 3] : night ? '#2E6B4A' : '#3FA564'); flowers(28); }
      if (th === 'forest' || th === 'river') for (let i = 0; i < 10; i++) pine(6 + i * 20 + R() * 6, gtop + 1, 6 + (R() * 4 | 0), night ? '#1F5A3E' : '#2E8A5A');
      if (th === 'mushroom') { for (let i = 0; i < 7; i++) mush(14 + i * 28 + R() * 8, gtop + 2 + R() * 4); flowers(20); }
      if (th === 'beach') { palm(20, gtop); palm(170, gtop + 2); for (let i = 0; i < 10; i++) P(R() * BGW, gtop + 6 + R() * 30, '#FFF3E0', 2, 1); }
      if (th === 'meadow') for (let i = 0; i < 70; i++) { const x = R() * BGW, y = gtop + R() * 34; P(x, y - 3, night ? '#5A8A6A' : '#6BD18B', 1, 3); }
      if (th === 'lanterns') { for (let i = 0; i < 5; i++) lamp(18 + i * 40, gtop + 1); for (let i = 0; i < 6; i++) P(0, gtop + 4 + i * 6, 'rgba(255,255,255,.08)', BGW, 1); }
      if (th === 'snow') { for (let i = 0; i < 6; i++) pine(10 + i * 34, gtop + 1, 7, '#2E6B5A'); for (let i = 0; i < 80; i++) P(R() * BGW, R() * BGH, '#ffffff'); }
      if (th === 'clouds') for (let i = 0; i < 6; i++) cloud(i * 34 - 6, gtop - 4 + R() * 3, 30, '#ffffff');
      if (th === 'sea') { for (let i = 0; i < 9; i++) { const x = 6 + i * 22, hh = 6 + R() * 12, c = ['#FF8FB1', '#FFB84D', '#B79CFF'][i % 3]; for (let k = 0; k < hh; k++) P(x + Math.round(Math.sin(k / 2) * 1.5), gtop - k, c, 2, 1); } for (let i = 0; i < 14; i++) { const x = R() * BGW, y = R() * 60; P(x, y, 'rgba(220,245,255,.6)'); } }
      if (th === 'space') for (let i = 0; i < 9; i++) { const x = R() * BGW, y = gtop + 4 + R() * 28; P(x, y, '#3E3860', 4, 2); }
      if (th === 'canyon') for (let i = 0; i < 9; i++) { const x = R() * BGW, y = gtop + 3 + R() * 30; P(x, y, '#8A4A25', 4, 2); P(x + 1, y - 1, '#A65E33', 2, 1); }
      /* fighters' arena: a flat lit oval in the middle of the ground */
      for (let y = 0; y < 14; y++) { const w = Math.round(Math.sqrt(1 - Math.pow((y - 7) / 7, 2)) * 84); P(96 - w, gtop + 14 + y, boss ? 'rgba(255,80,120,.16)' : 'rgba(255,255,255,.12)', w * 2, 1); }
      if (boss) { for (let i = 0; i < 24; i++) P(R() * BGW, R() * BGH, 'rgba(255,120,150,.5)'); P(0, 0, 'rgba(60,0,30,.18)', BGW, BGH); }
      /* bottom vignette rows */
      for (let i = 0; i < 6; i++) P(0, BGH - 6 + i, `rgba(10,0,30,${.05 + i * .04})`, BGW, 1);
      COLS[key] = { sky: sk[0], ground: mix(gc.startsWith('#') ? gc : '#3a6a3a', '#000000', .25) };
      return cv.toDataURL('image/png');
    });
  }

  /* app backdrop: a pixel night sky (or a sunny one for the parchment look) with a far-off castle */
  function uiBg(dark = true) {
    return memo('ui:' + (dark ? 1 : 0), () => {
      const W = 240, H = 160, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'), R = rng(77);
      const P = (x, y, c, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const sky = dark ? ['#0F0C26', '#14112E', '#191540', '#1F1A4C', '#262058', '#2E2664', '#372C6C'] : ['#9ED8F5', '#AEE0F7', '#BEE7F8', '#CFEDF8', '#DEF2F6', '#EAF4EE', '#F2EEDB'];
      const bh = Math.ceil(H / 7);
      for (let i = 0; i < 7; i++) { P(0, i * bh, sky[i], W, bh); if (i) for (let x = 0; x < W; x += 2) P(x + (i % 2), i * bh - 1, sky[i]); }
      if (dark) { for (let i = 0; i < 90; i++) { const x = R() * W, y = R() * H * .7, c = R() < .25 ? '#B79CFF' : R() < .5 ? '#FFE9A8' : '#FFFFFF'; P(x, y, c); if (R() < .12) { P(x - 1, y, c); P(x + 1, y, c); P(x, y - 1, c); P(x, y + 1, c); } } for (let y = -7; y <= 7; y++) for (let x = -7; x <= 7; x++) if (x * x + y * y <= 49) P(198 + x, 26 + y, x * x + y * y > 30 ? '#E8DDB0' : '#FFF3C4'); }
      else { for (let y = -9; y <= 9; y++) for (let x = -9; x <= 9; x++) if (x * x + y * y <= 81) P(200 + x, 24 + y, '#FFF3A0'); for (let i = 0; i < 4; i++) { const x = R() * 200, y = 10 + R() * 50, w = 20 + R() * 20; P(x + 3, y, '#fff', w - 6, 1); P(x, y + 1, '#fff', w, 3); P(x + 6, y - 2, '#fff', w / 3, 2); } }
      const hill = (base, amp, c, step) => { let y = base; for (let x = 0; x < W; x++) { if (x % step === 0) y = clamp(y + (R() - .5) * amp, base - amp, base + amp); P(x, y, c, 1, H - y); } };
      hill(H - 34, 6, dark ? '#221C4A' : '#B9D7C2', 4);
      /* castle */
      const cc = dark ? '#1A1540' : '#9DB8B0', cx = 150, top = H - 62;
      P(cx, top + 14, cc, 50, 50); [[cx - 6, top], [cx + 18, top - 8], [cx + 44, top + 4]].forEach(([x, t]) => { P(x, t, cc, 12, 70); for (let i = 0; i < 12; i += 4) P(x + i, t - 3, cc, 2, 3); P(x + 5, t - 10, dark ? '#E5484D' : '#E5484D', 1, 7); P(x + 6, t - 10, '#E5484D', 3, 2); if (dark) P(x + 4, t + 8, '#FFD166', 3, 4); });
      for (let i = 0; i < 50; i += 4) P(cx + i, top + 11, cc, 2, 3);
      if (dark) [[cx + 10, top + 24], [cx + 30, top + 28], [cx + 22, top + 40]].forEach(([x, y]) => P(x, y, '#FFB84D', 2, 3));
      hill(H - 18, 4, dark ? '#16122F' : '#8FBF8F', 3);
      return cv.toDataURL('image/png');
    });
  }

  /* any emoji as a tiny pixel sprite: drawn small, alpha snapped, colours posterised, outlined */
  function emo(ch) {
    return memo('e:' + ch, () => {
      const n = 30, cv = document.createElement('canvas'); cv.width = n; cv.height = n; const g = cv.getContext('2d', { willReadFrequently: true });
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '25px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.fillText(ch, n / 2, n / 2 + 1);
      const d = g.getImageData(0, 0, n, n).data, on = i => d[i * 4 + 3] > 120, out = document.createElement('canvas'), Z = 3; out.width = n * Z; out.height = n * Z; const o = out.getContext('2d');
      const q = v => Math.min(255, Math.round(v / 24) * 24 + 8);
      for (let i = 0; i < n * n; i++) {
        const x = i % n, y = (i / n) | 0;
        if (on(i)) { const a = d[i * 4 + 3] / 255; o.fillStyle = `rgb(${q(d[i * 4] / a)},${q(d[i * 4 + 1] / a)},${q(d[i * 4 + 2] / a)})`; o.fillRect(x * Z, y * Z, Z, Z); }
        else if ((x > 0 && on(i - 1)) || (x < n - 1 && on(i + 1)) || (y > 0 && on(i - n)) || (y < n - 1 && on(i + n))) { o.fillStyle = OLC; o.fillRect(x * Z, y * Z, Z, Z); }
      }
      return out.toDataURL('image/png');
    });
  }
  const COLS = {}, bgCols = (z, band = S.band, boss = false) => { bg(z, band, boss); return COLS['bg:' + band + ':' + z + ':' + (boss ? 1 : 0)] || { sky: '#223', ground: '#332' }; };
  return { hero, job, Q, SPEED, CACHE, sheetBlob, sheetImageOnly: sheetImage, heroKey, monKey, heroReady, monReady: m => CACHE.has(monKey(m)), emo, uiBg, bgCols, monster, owl, bg, heroParts, monsterParts, knightParts, clear: () => CACHE.clear(), kit: { sheet, svgOf, memo, OLC, Mask, mix, dk, lt, star, ramp, GOLD, BRN, INK, IDLE, NOTHURT, F, flipP, shiftP } };
})();

/* repaint every visible sprite after the pixel switch is flipped */
function repaintSprites() {
  if (B.active && B.lv) { const lv = B.lv, h = $('#heroSprite'), m = $('#monSprite'); if (h) h.innerHTML = heroSVG(S.equipped); if (m) m.innerHTML = monsterSVG(lv.mon, lv.hue || 0); $('#stage').style.background = S.pixel ? `url(${PX.bg(lv.z, S.band, !!lv.big)}) center bottom / cover no-repeat, #1a1430` : lv.bg; const ho = $('#battleView .hint .hrow > svg'); if (ho) ho.outerHTML = owlSVG(); }
  else { const ho = $('#battleView .hint .hrow > svg'); if (ho) ho.outerHTML = owlSVG(); }
}
Object.assign(STR, {
  'pp.pixel': ['Pixel art look: {s}', 'Gaya seni piksel: {s}'],
  'pp.pixelNote': ['Draws the knights, every monster, Hoot, the stories and the battle worlds as 96x96 pixel art, with the Royal Night look (choose Warm above for the Parchment look). Turn it off for the smooth classic drawings.', 'Melukis wira, semua raksasa, Hoot dan dunia pertarungan sebagai seni piksel 32x32. Matikan untuk lukisan klasik yang licin.']
});
