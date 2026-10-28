/* ================= Bar models and fraction bars (SVG) ================= */
function barSVG(spec, hl) {
  const W = 320, padL = 10, rows = spec.rows;
  const vert = spec.total && spec.total.vertical;
  const hasAfter = rows.some(r => r.after !== undefined);
  const padR = 10 + (vert ? 44 : 0) + (hasAfter ? 40 : 0);
  const avail = W - padL - padR;
  const sums = rows.map(r => r.segs.reduce((s, g) => s + g.w, 0));
  const sc = avail / Math.max(...sums);
  const px = rows.map(r => r.segs.map(g => Math.max(28, g.w * sc)));
  const maxPx = Math.max(...px.map(a => a.reduce((s, v) => s + v, 0)));
  const f = maxPx > avail ? avail / maxPx : 1;
  const BH = 34;
  let y = spec.total && !vert ? 30 : 6, out = '', firstTop = null, lastBottom = 0;
  rows.forEach((r, ri) => {
    if (r.name) { out += `<text x="${padL}" y="${y + 11}" font-size="12" font-weight="800" fill="var(--muted)">${esc(r.name)}</text>`; y += 16; }
    if (firstTop === null) firstTop = y;
    let x = padL;
    r.segs.forEach((g, gi) => {
      const w = px[ri][gi] * f, fill = g.q ? 'var(--accent)' : `var(--bar${(gi % 3) + 1})`;
      const cls = hl ? (g.q ? 'sg-q' : (g.label !== '' ? 'sg-hl' : '')) : '';
      out += `<rect class="${cls}" x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="9" fill="${fill}" stroke="var(--surface)" stroke-width="2.5"${g.q ? ' stroke-dasharray="5 3"' : ''}/>`;
      if (g.label !== '' && g.label !== undefined) out += `<text x="${(x + w / 2).toFixed(1)}" y="${y + 23}" text-anchor="middle" font-size="17" font-weight="800" fill="${g.q ? '#fff' : 'var(--bar-ink)'}">${esc(g.label)}</text>`;
      x += w;
    });
    if (r.after !== undefined) out += `<text x="${(x + 8).toFixed(1)}" y="${y + 23}" font-size="16" font-weight="800" fill="var(--ink)">= ${esc(r.after)}</text>`;
    lastBottom = y + BH;
    if (spec.total && !vert && spec.total.row === ri) {
      const tw = px[ri].reduce((s, v) => s + v, 0) * f, ty = y - (r.name ? 16 : 0) - 12;
      out += `<path d="M${padL} ${ty + 8} V${ty} H${padL + tw} V${ty + 8}" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="${padL + tw / 2}" y="${ty - 4}" text-anchor="middle" font-size="16" font-weight="800" fill="var(--ink)">${esc(spec.total.label)}</text>`;
    }
    y += BH + 12;
  });
  if (vert) {
    const x = padL + maxPx * f + 6;
    out += `<path d="M${x} ${firstTop} H${x + 9} V${lastBottom} H${x}" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="${x + 16}" y="${(firstTop + lastBottom) / 2 + 6}" font-size="17" font-weight="800" fill="var(--ink)">${esc(spec.total.label)}</text>`;
  }
  return `<svg viewBox="0 0 ${W} ${y}" role="img" aria-label="Bar model">${out}</svg>`;
}
function fracSVG(n, k, tot, hl, qmark) {
  const W = 320, pad = 10, w = (W - 2 * pad) / n, top = tot ? 34 : 6; let o = '';
  if (tot) o += `<path d="M${pad} ${top - 8} V${top - 16} H${W - pad} V${top - 8}" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/><text x="${W / 2}" y="${top - 20}" text-anchor="middle" font-size="16" font-weight="800" fill="var(--ink)">${tot}</text>`;
  for (let i = 0; i < n; i++) o += `<rect class="${i < k && hl ? 'sg-hl' : ''}" x="${(pad + i * w).toFixed(1)}" y="${top}" width="${w.toFixed(1)}" height="42" rx="7" fill="${i < k ? 'var(--bar2)' : 'var(--surface2)'}" stroke="var(--ink)" stroke-width="2"/>`;
  if (qmark && k) o += `<text x="${(pad + k * w / 2).toFixed(1)}" y="${top + 28}" text-anchor="middle" font-size="20" font-weight="800" fill="var(--bar-ink)">?</text>`;
  return `<svg viewBox="0 0 ${W} ${top + 48}" role="img" aria-label="Fraction bar">${o}</svg>`;
}

/* ================= Virtual manipulatives (drag, snap and tap) ================= */
function mountManip(host, spec) {
  host.classList.add('mp-host');
  const w = spec.type === 'unit' ? mountUnit(host, spec) : spec.type === 'ten' ? mountTen(host, spec) : mountFrac(host, spec);
  host.__mp = w; return w;
}
/* Unit blocks: snap blocks into the slots of a bar model */
function mountUnit(host, spec) {
  const tracks = spec.tracks, fill = tracks.map(tk => tk.slots.map(s => !!s.pre)), hist = [];
  const ask = spec.ask || 0;
  const w = {
    kind: 'unit',
    value() {
      const placed = tracks[ask].slots.filter((s, i) => !s.pre && fill[ask][i]).length;
      return spec.is === 'total' ? placed + tracks[ask].slots.filter(s => s.pre).length : placed;
    },
    firstEmpty() {
      for (let k = 0; k < tracks.length; k++) { const ti = (ask + k) % tracks.length; const si = tracks[ti].slots.findIndex((s, i) => !s.pre && !fill[ti][i]); if (si >= 0) return [ti, si]; }
      return null;
    },
    add(at) { const p = at || w.firstEmpty(); if (!p || fill[p[0]][p[1]] || tracks[p[0]].slots[p[1]].pre) return; fill[p[0]][p[1]] = true; hist.push(p); sfx.soft(); render(); },
    del(ti, si) { if (tracks[ti].slots[si].pre || !fill[ti][si]) return; fill[ti][si] = false; render(); },
    slot(ti, si) { if (tracks[ti].slots[si].pre) return; fill[ti][si] ? w.del(ti, si) : w.add([ti, si]); },
    undo() { const p = hist.pop(); if (p) { fill[p[0]][p[1]] = false; render(); } },
    reset() { tracks.forEach((tk, ti) => tk.slots.forEach((s, si) => { fill[ti][si] = !!s.pre; })); hist.length = 0; render(); },
    drop(target) { const s = target && target.closest && target.closest('.uslot'); if (s && s.dataset.t !== undefined) w.add([+s.dataset.t, +s.dataset.s]); else if (target && target.closest && target.closest('.mp-tracks')) w.add(null); }
  };
  function render() {
    host.innerHTML = `<div class="mp-tracks">${tracks.map((tk, ti) => `<div class="mp-trk">${tk.name ? `<div class="mp-tname">${esc(tk.name)}</div>` : ''}<div class="utrack" style="grid-template-columns:repeat(${tk.slots.length},1fr)">${tk.slots.map((s, si) => `<button class="uslot c${s.c || 1} ${fill[ti][si] ? 'filled' : ''} ${s.pre ? 'pre' : ''} ${s.q && !fill[ti][si] ? 'q' : ''}" data-act="mpSlot" data-t="${ti}" data-s="${si}" ${s.pre ? 'disabled tabindex="-1"' : ''} aria-label="${si + 1}"></button>`).join('')}</div></div>`).join('')}</div>
      <div class="mp-bar"><button class="mp-stamp" data-act="mpStamp" data-k="u" aria-label="${esc(t('mp.add'))}"><i class="ublk"></i><span>＋1</span></button><div class="mp-info"><b>${t('mp.count', { n: w.value() })}</b><small>${t('mp.hintUnit')}</small></div></div>
      <div class="mp-bar">${spec.use ? `<button class="btn" data-act="mpUse">${t('mp.use')}</button>` : ''}<button class="btn ghost" data-act="mpUndo">${t('pad.undo')}</button><button class="btn ghost" data-act="mpReset">${t('mp.reset')}</button></div>`;
  }
  render(); return w;
}
/* Base-ten blocks: build any number from flats, rods and cubes; ten of one trade up */
function mountTen(host, spec) {
  const c = { h: 0, t: 0, o: 0 }; let msg = ''; const hist = [];
  const w = {
    kind: 'ten', value: () => c.h * 100 + c.t * 10 + c.o,
    add(k) {
      msg = '';
      if (k === 'h') { if (spec.hundreds && c.h < 9) c.h++; else msg = t('mp.cap'); }
      else if (k === 't') { if (c.t < 9) c.t++; else if (spec.hundreds && c.h < 9) { c.t = 0; c.h++; msg = t('mp.trade2'); } else msg = t('mp.cap'); }
      else if (c.o < 9) c.o++;
      else { c.o = 0; if (c.t < 9) { c.t++; msg = t('mp.trade1'); } else if (spec.hundreds && c.h < 9) { c.t = 0; c.h++; msg = t('mp.trade1') + ' ' + t('mp.trade2'); } else { c.o = 9; msg = t('mp.cap'); } }
      hist.push(w.value() === 0 ? null : { ...c }); sfx.soft(); render();
    },
    del(k) { if (c[k] > 0) { c[k]--; msg = ''; render(); } },
    undo() { hist.pop(); const p = hist[hist.length - 1]; if (p) Object.assign(c, p); else { c.h = c.t = c.o = 0; } msg = ''; render(); },
    reset() { c.h = c.t = c.o = 0; hist.length = 0; msg = ''; render(); },
    drop(target, stamp) { if (target && target.closest && target.closest('.tmat')) w.add(stamp.dataset.k); }
  };
  const blocks = (k, n) => Array.from({ length: n }, () => `<button class="blk ${k === 'h' ? 'flat' : k === 't' ? 'rod' : 'cube'}" data-act="mpTen" data-k="${k}" aria-label="−"></button>`).join('');
  function render() {
    const cols = [spec.hundreds ? ['h', t('mp.h')] : null, ['t', t('mp.t')], ['o', t('mp.o')]].filter(Boolean);
    host.innerHTML = `<div class="tmat" aria-label="${esc(t('mp.hintTen'))}">${cols.map(([k, lab]) => `<div class="tcol"><div class="tlab">${lab}: ${c[k]}</div><div class="tbl ${k}">${blocks(k, c[k])}</div></div>`).join('')}</div>
      <div class="mp-bar">${spec.hundreds ? `<button class="mp-stamp" data-act="mpStamp" data-k="h" aria-label="100"><i class="bflat"></i><span>100</span></button>` : ''}<button class="mp-stamp" data-act="mpStamp" data-k="t" aria-label="10"><i class="brod"></i><span>10</span></button><button class="mp-stamp" data-act="mpStamp" data-k="o" aria-label="1"><i class="bcube"></i><span>1</span></button>
        <div class="mp-info"><b>${t('mp.number', { n: w.value() })}</b><small aria-live="polite">${esc(msg || t('mp.hintTen'))}</small></div></div>
      <div class="mp-bar">${spec.use ? `<button class="btn" data-act="mpUse">${t('mp.useNum')}</button>` : ''}<button class="btn ghost" data-act="mpUndo">${t('pad.undo')}</button><button class="btn ghost" data-act="mpReset">${t('mp.reset')}</button></div>`;
  }
  render(); return w;
}
/* Sliceable fraction bar: choose how many equal pieces, then tap pieces to shade them */
function mountFrac(host, spec) {
  let n = spec.n0 || 1, sh = new Set(spec.shade || []);
  const w = {
    kind: 'frac', value: () => sh.size,
    cut(x) { n = x; sh = new Set(); render(); }, piece(i) { sh.has(i) ? sh.delete(i) : sh.add(i); render(); },
    undo() { w.reset(); }, reset() { n = spec.n0 || 1; sh = new Set(spec.shade || []); render(); }
  };
  function render() {
    const each = spec.total && spec.total % n === 0 ? spec.total / n : '';
    host.innerHTML = `<div class="fbar">${Array.from({ length: n }, (_, i) => `<button class="fpiece ${sh.has(i) ? 'on' : ''}" data-act="mpPiece" data-i="${i}" aria-pressed="${sh.has(i)}">${each}</button>`).join('')}</div>
      <div class="mp-info"><b>${t('mp.shaded', { k: sh.size, n })}</b>${each !== '' ? ` · <b>${t('mp.piece', { v: each })}</b>` : ''}<small>${t('mp.hintFrac')}</small></div>
      <div class="mp-cuts"><span>${t('mp.cut')}:</span>${[2, 3, 4, 5, 6, 8].map(x => `<button class="chip" data-act="mpCut" data-v="${x}" aria-pressed="${n === x}">${x}</button>`).join('')}<button class="btn ghost" data-act="mpReset">${t('mp.reset')}</button></div>`;
  }
  render(); return w;
}
/* one drag engine for every stamp button (tap also works, so it stays accessible) */
let drag = null;
document.addEventListener('pointerdown', e => {
  const s = e.target.closest && e.target.closest('.mp-stamp'); if (!s) return;
  drag = { el: s, x: e.clientX, y: e.clientY, moved: false, ghost: null, id: e.pointerId };
});
document.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 10) {
    drag.moved = true; const g = drag.el.cloneNode(true); g.classList.add('ghost'); g.removeAttribute('data-act'); document.body.appendChild(g); drag.ghost = g;
  }
  if (drag.moved) drag.ghost.style.transform = `translate(${e.clientX - 30}px,${e.clientY - 30}px)`;
});
function endDrag(e) {
  if (!drag || (e.pointerId !== undefined && e.pointerId !== drag.id)) return;
  const d = drag; drag = null;
  if (d.ghost) d.ghost.remove();
  if (d.moved) {
    const host = d.el.closest('.mp-host'), w = host && host.__mp;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (w && w.drop && e.type === 'pointerup') w.drop(target, d.el);
    d.el.dataset.suppress = '1'; setTimeout(() => { delete d.el.dataset.suppress; }, 80);
  }
}
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);
