/* ================= Parent code (6 digits, hashed on this device) =================
   v21: the code is stretched with PBKDF2-SHA256 (Web Crypto, 150 000 rounds, random 16-byte salt).
   Codes saved by older versions (400 rounds of the hand-written SHA-256 below) still work and are
   upgraded to PBKDF2 the first time they are entered. Pages opened over plain http on a local network
   have no Web Crypto, so there the old hash is kept as a fallback. */
function sha256(ascii) {
  const rr = (v, a) => (v >>> a) | (v << (32 - a)), mp = Math.pow, mw = mp(2, 32);
  let i, j, result = '', words = [], hash = sha256.h = sha256.h || [], k = sha256.k = sha256.k || [], pc = k.length; const comp = {}, bits = ascii.length * 8;
  for (let c = 2; pc < 64; c++) if (!comp[c]) { for (i = 0; i < 313; i += c) comp[i] = c; hash[pc] = (mp(c, .5) * mw) | 0; k[pc++] = (mp(c, 1 / 3) * mw) | 0; }
  ascii += '\x80'; while (ascii.length % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) { j = ascii.charCodeAt(i); if (j >> 8) return ''; words[i >> 2] |= j << ((3 - i) % 4) * 8; }
  words[words.length] = (bits / mw) | 0; words[words.length] = bits;
  for (j = 0; j < words.length;) {
    const w = words.slice(j, j += 16), old = hash; hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
      const t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
      const t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(t1 + t2) | 0].concat(hash); hash[4] = (hash[4] + t1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + old[i]) | 0;
  }
  for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { const b = (hash[i] >> (j * 8)) & 255; result += (b < 16 ? 0 : '') + b.toString(16); }
  return result;
}
const pinHash = (pin, salt) => { let h = salt + pin; for (let i = 0; i < 400; i++) h = sha256(h + salt); return h; };   // legacy (v1)
const PIN_ITER = 150000, hasSubtle = () => !!(window.crypto && crypto.subtle && crypto.getRandomValues);
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
async function pinHash2(pin, salt, iter = PIN_ITER) {
  const enc = new TextEncoder(), key = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: iter }, key, 256));
}
async function pinSet(pin) {
  if (hasSubtle()) { const s = hex(crypto.getRandomValues(new Uint8Array(16))); DEV.pin = { v: 2, n: PIN_ITER, s, h: await pinHash2(pin, s) }; }
  else { const s = Array.from({ length: 16 }, () => Math.floor(Math.random() * 36).toString(36)).join(''); DEV.pin = { s, h: pinHash(pin, s) }; }
  saveDev();
}
async function pinCheck(pin) {
  const p = DEV.pin; if (!p) return false;
  if (p.v === 2) return hasSubtle() && (await pinHash2(pin, p.s, p.n || PIN_ITER)) === p.h;
  const ok = pinHash(pin, p.s) === p.h;
  if (ok && hasSubtle()) await pinSet(pin);     // upgrade an old code to PBKDF2
  return ok;
}

/* ================= Fight effects (Web Animations API) ================= */
const wait = ms => new Promise(r => setTimeout(r, ms));
const fx = {
  layer: () => $('#fxLayer'),
  pos(el) { const st = $('#stage').getBoundingClientRect(), r = el.getBoundingClientRect(); return { x: r.left - st.left + r.width / 2, y: r.top - st.top + r.height / 2, w: r.width, h: r.height }; },
  burst(x, y, n = 10, items = ['✨', '⭐', '💥'], dist = 76) {
    if (S.sensory || !fx.layer()) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span'), a = Math.random() * 6.283, d = dist * (.5 + Math.random() * .7), rot = (Math.random() - .5) * 360;
      s.className = 'fxp'; s.textContent = pick(items); s.style.left = x + 'px'; s.style.top = y + 'px'; fx.layer().appendChild(s);
      s.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d - 22}px)) scale(1.25) rotate(${rot}deg)`, opacity: 1, offset: .55 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d * 1.1}px),calc(-50% + ${Math.sin(a) * d + 36}px)) scale(.5) rotate(${rot * 1.4}deg)`, opacity: 0 }], { duration: 620 + Math.random() * 320, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => s.remove();
    }
  },
  slash(x, y, color = '#fff', big = false) {
    if (S.sensory || !fx.layer()) return;
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); el.setAttribute('viewBox', '-60 -60 120 120'); el.setAttribute('class', 'fxslash'); el.style.left = x + 'px'; el.style.top = y + 'px'; if (big) el.style.width = '170px';
    el.innerHTML = `<path d="M-46 -36 Q8 -64 44 22" fill="none" stroke="${color}" stroke-width="${big ? 12 : 9}" stroke-linecap="round" pathLength="100" stroke-dasharray="100"/><path d="M-30 -40 Q18 -52 40 10" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity=".7" pathLength="100" stroke-dasharray="100"/>`;
    fx.layer().appendChild(el);
    el.querySelectorAll('path').forEach((p, i) => p.animate([{ strokeDashoffset: 100 }, { strokeDashoffset: 0, offset: .45 }, { strokeDashoffset: -100 }], { duration: 360 + i * 60, easing: 'ease-out', fill: 'forwards' }));
    el.animate([{ opacity: 1 }, { opacity: 1, offset: .6 }, { opacity: 0 }], { duration: 440 }).onfinish = () => el.remove();
  },
  ring(x, y, color = '#9fe8ff', size = 130) {
    if (S.sensory || !fx.layer()) return;
    const r = document.createElement('div'); r.className = 'fxring'; r.style.left = x + 'px'; r.style.top = y + 'px'; r.style.borderColor = color; fx.layer().appendChild(r);
    r.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 }, { transform: `translate(-50%,-50%) scale(${size / 60})`, opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => r.remove();
  },
  flash(color = 'rgba(255,255,255,.75)') {
    if (S.sensory) return; const st = $('#stage'); if (!st) return;
    const f = document.createElement('div'); f.className = 'fxflash'; f.style.background = color; st.appendChild(f); f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220 }).onfinish = () => f.remove();
  },
  shake(el, amp = 8, ms = 360) {
    if (S.sensory || !el) return;
    el.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${amp}px,${-amp / 3}px)` }, { transform: `translate(${-amp}px,${amp / 3}px)` }, { transform: `translate(${amp * .6}px,0)` }, { transform: `translate(${-amp * .4}px,0)` }, { transform: 'translate(0,0)' }], { duration: ms, easing: 'ease-out' });
  },
  num(x, y, text, cls = '') {
    if (!fx.layer()) return;
    const n = document.createElement('div'); n.className = 'fxnum ' + cls; n.textContent = text; n.style.left = x + 'px'; n.style.top = y + 'px'; fx.layer().appendChild(n);
    if (S.sensory) { setTimeout(() => n.remove(), 1000); return; }
    n.animate([{ transform: 'translate(-50%,0) scale(.4)', opacity: 0 }, { transform: 'translate(-50%,-14px) scale(1.35)', opacity: 1, offset: .2 }, { transform: 'translate(-50%,-30px) scale(1)', opacity: 1, offset: .55 }, { transform: 'translate(-50%,-78px) scale(.9)', opacity: 0 }], { duration: 1100, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => n.remove();
  },
  coins(fromEl, n = 6) {
    if (S.sensory || !fromEl) return; const to = $('#coins').getBoundingClientRect(), fr = fromEl.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div'); c.className = 'flycoin'; c.textContent = '🪙'; document.body.appendChild(c);
      const sx = fr.left + fr.width / 2, sy = fr.top + fr.height / 2, ex = to.left + to.width / 2, ey = to.top + to.height / 2, mx = sx + (Math.random() - .5) * 160, my = Math.min(sy, ey) - 60 - Math.random() * 60;
      c.animate([{ transform: `translate(${sx}px,${sy}px) scale(.4)`, opacity: 0 }, { transform: `translate(${mx}px,${my}px) scale(1.1)`, opacity: 1, offset: .4 }, { transform: `translate(${ex}px,${ey}px) scale(.6)`, opacity: .9 }], { duration: 800 + i * 70, delay: i * 60, easing: 'cubic-bezier(.4,0,.3,1)', fill: 'both' }).onfinish = () => c.remove();
    }
  }
};
Object.assign(sfx, { whoosh() { tone(420, .12, 'sawtooth', .02); tone(260, .14, 'sawtooth', .02, .05); }, crit() { [660, 880, 1175].forEach((f, i) => tone(f, .18, 'square', .025, i * .07)); }, block() { tone(520, .1, 'triangle', .04); tone(780, .14, 'sine', .03, .06); } });
