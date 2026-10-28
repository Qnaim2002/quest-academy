/* ================= Sprites (v4): parametric hero, monsters, pets, scenery ================= */
const shade = (hex, a) => {
  const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a)));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(f).map(x => x.toString(16).padStart(2, '0')).join('');
};
const RB = u => `<linearGradient id="${u}rb" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#ff6b6b"/><stop offset=".25" stop-color="#ffd166"/><stop offset=".5" stop-color="#6bd18b"/><stop offset=".75" stop-color="#4da3ff"/><stop offset="1" stop-color="#b79cff"/></linearGradient>`;
const star5 = (cx, cy, R, r, rot = -90) => Array.from({ length: 10 }, (_, i) => { const a = (rot + i * 36) * Math.PI / 180, d = i % 2 ? r : R; return `${(cx + Math.cos(a) * d).toFixed(1)},${(cy + Math.sin(a) * d).toFixed(1)}`; }).join(' ');

/* ---------- Hero ---------- */
function heroSVGClassic(eq, opt = {}) {
  const u = 'h' + (uid++), g = k => ITEM[eq[k]] || ITEM[DEFAULT_EQUIP[k]];
  const skin = g('skin').c || '#F5CBA7', hair = g('hair'), out = g('outfit'), boots = g('boots'), dk = '#3b2a20';
  const hc = hair.c === 'rainbow' ? `url(#${u}rb)` : hair.c, hs = hair.c === 'rainbow' ? '#8E5CD9' : shade(hair.c, -.25);
  const cape = eq.cape || 'cape_none', hat = eq.hat || 'hat_none', W = eq.weapon || 'weapon_pencil', sh = eq.shield || 'shield_none', face = eq.face || 'face_none';
  const bc = boots.c === 'rainbow' ? `url(#${u}rb)` : boots.c;
  let s = `<svg class="hero-svg" viewBox="0 -24 200 264" role="img" aria-label="Hero"><defs>${RB(u)}<radialGradient id="${u}sk" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="${shade(skin, .28)}"/><stop offset="1" stop-color="${skin}"/></radialGradient><linearGradient id="${u}og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(out.c, .22)}"/><stop offset="1" stop-color="${out.c}"/></linearGradient><radialGradient id="${u}ir" cx=".4" cy=".35"><stop offset="0" stop-color="#8a5a3a"/><stop offset="1" stop-color="#3b2a20"/></radialGradient></defs>`;
  /* aura */
  const A = eq.aura || 'aura_none';
  if (A === 'aura_sparkle') s += `<g>${[[40, 90], [162, 70], [30, 170], [172, 160], [100, 20], [60, 40]].map(([x, y], i) => `<polygon class="twinkle" style="animation-delay:${-i * .4}s;transform-origin:${x}px ${y}px" points="${star5(x, y, 8, 3)}" fill="#FFE98A"/>`).join('')}</g>`;
  if (A === 'aura_hearts') s += `<g>${[[40, 190], [160, 200], [60, 210], [140, 190], [100, 205]].map(([x, y], i) => `<text class="rise" style="animation-delay:${-i * .7}s" x="${x}" y="${y}" font-size="16" text-anchor="middle">💗</text>`).join('')}</g>`;
  if (A === 'aura_ring') s += `<ellipse class="ringspin" cx="100" cy="212" rx="70" ry="14" fill="none" stroke="url(#${u}rb)" stroke-width="6" opacity=".9"/>`;
  if (A === 'aura_stars') s += `<g class="orbit">${[0, 120, 240].map(a => `<polygon transform="rotate(${a} 100 130) translate(0 -88)" points="${star5(100, 130, 9, 4)}" fill="#FFD166"/>`).join('')}</g>`;
  s += `<ellipse class="h-shadow" cx="100" cy="226" rx="46" ry="8" fill="rgba(0,0,0,.18)"/>`;
  /* cape / wings (behind) */
  if (cape === 'cape_red' || cape === 'cape_leaf' || cape === 'cape_star' || cape === 'cape_rainbow' || cape === 'cape_gold') {
    const f = { cape_red: '#E5484D', cape_leaf: '#43C089', cape_star: '#5B3FD6', cape_rainbow: `url(#${u}rb)`, cape_gold: '#F2B93B' }[cape];
    s += `<g class="h-cape"><path d="M70 122 Q40 180 46 224 Q100 206 154 224 Q160 180 130 122Z" fill="${f}"/>${cape === 'cape_star' ? [[60, 170], [140, 166], [100, 206], [78, 200], [124, 196]].map(([x, y]) => `<polygon points="${star5(x, y, 5, 2)}" fill="#FFE98A"/>`).join('') : ''}${cape === 'cape_leaf' ? '<path d="M100 130 V210 M100 160 L74 148 M100 180 L128 166" stroke="#2E9A6A" stroke-width="3" fill="none"/>' : ''}${cape === 'cape_gold' ? '<path d="M46 224 Q100 206 154 224" stroke="#fff" stroke-width="4" fill="none" opacity=".6"/>' : ''}</g>`;
  }
  if (cape === 'wings_butterfly') s += `<g class="h-wingL"><path d="M72 130 Q8 70 20 150 Q30 190 74 160Z" fill="#F28BB0"/><path d="M72 150 Q30 190 52 214 Q76 210 78 170Z" fill="#B79CFF"/><circle cx="34" cy="128" r="6" fill="#fff" opacity=".7"/></g><g class="h-wingR"><path d="M128 130 Q192 70 180 150 Q170 190 126 160Z" fill="#F28BB0"/><path d="M128 150 Q170 190 148 214 Q124 210 122 170Z" fill="#B79CFF"/><circle cx="166" cy="128" r="6" fill="#fff" opacity=".7"/></g>`;
  if (cape === 'wings_angel') s += `<g class="h-wingL"><path d="M74 126 Q10 96 14 150 Q18 190 52 178 Q40 196 78 190Z" fill="#fff" stroke="#DDE6F5" stroke-width="2"/></g><g class="h-wingR"><path d="M126 126 Q190 96 186 150 Q182 190 148 178 Q160 196 122 190Z" fill="#fff" stroke="#DDE6F5" stroke-width="2"/></g>`;
  /* back hair */
  const hb = hair.style;
  s += `<g class="h-head h-hairback">`;
  if (hb === 'long') s += `<path d="M54 80 Q36 150 58 176 L82 144 L118 144 L142 176 Q164 150 146 80Z" fill="${hc}" stroke="${hs}" stroke-width="2"/>`;
  if (hb === 'wavy') s += `<path d="M54 80 Q38 130 52 160 Q62 150 66 168 Q80 150 86 160 L114 160 Q120 150 134 168 Q138 150 148 160 Q162 130 146 80Z" fill="${hc}" stroke="${hs}" stroke-width="2"/>`;
  if (hb === 'pigtails') s += `<g class="h-pig"><ellipse cx="42" cy="116" rx="13" ry="26" fill="${hc}" stroke="${hs}" stroke-width="2" transform="rotate(14 42 116)"/><ellipse cx="158" cy="116" rx="13" ry="26" fill="${hc}" stroke="${hs}" stroke-width="2" transform="rotate(-14 158 116)"/></g>`;
  if (hb === 'afro') s += `<circle cx="100" cy="66" r="58" fill="${hc}" stroke="${hs}" stroke-width="2"/>`;
  if (hb === 'curly') s += [[52, 70], [46, 94], [56, 116], [148, 70], [154, 94], [144, 116]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${hc}" stroke="${hs}" stroke-width="2"/>`).join('');
  if (hb === 'tudung') s += `<path d="M46 86 Q46 24 100 24 Q154 24 154 86 Q158 134 150 160 Q126 146 100 148 Q74 146 50 160 Q42 134 46 86Z" fill="${hc}" stroke="${hair.c === '#F4F4F8' ? '#D5DBE8' : shade(hair.c, -.2)}" stroke-width="2"/>`;
  s += `</g>`;
  /* legs + boots */
  const pc = shade(out.c, -.5), pk = shade(out.c, -.66);
  s += `<g class="h-legs"><rect x="80" y="184" width="15" height="30" rx="7" fill="${pc}" stroke="${pk}" stroke-width="2"/><rect x="105" y="184" width="15" height="30" rx="7" fill="${pc}" stroke="${pk}" stroke-width="2"/><path d="M68 221 Q68 205 86 205 Q99 205 100 214 L100 222 Q84 226 68 221Z" fill="${bc}" stroke="rgba(0,0,0,.34)" stroke-width="2" stroke-linejoin="round"/><path d="M132 221 Q132 205 114 205 Q101 205 100 214 L100 222 Q116 226 132 221Z" fill="${bc}" stroke="rgba(0,0,0,.34)" stroke-width="2" stroke-linejoin="round"/><path d="M70 220 Q84 224 98 222 M130 220 Q116 224 102 222" stroke="rgba(255,255,255,.65)" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="80" cy="210" rx="5" ry="2.6" fill="#fff" opacity=".4"/><ellipse cx="120" cy="210" rx="5" ry="2.6" fill="#fff" opacity=".4"/></g>`;
  /* torso */
  const oc = out.c, ol = shade(oc, -.18), d = out.deco;
  s += `<g class="h-torso">`;
  if (d === 'kurung') s += `<path d="M70 126 Q70 114 84 114 L116 114 Q130 114 130 126 L142 206 Q100 218 58 206Z" fill="${oc}"/><path d="M58 206 Q100 218 142 206" stroke="#FFE3EC" stroke-width="5" fill="none"/>${[[84, 170], [116, 176], [100, 196], [76, 196], [124, 198]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#FFE3EC"/>`).join('')}`;
  else s += `<path d="M70 128 Q70 114 84 114 L116 114 Q130 114 130 128 L134 186 Q134 196 124 196 L76 196 Q66 196 66 186Z" fill="url(#${u}og)" stroke="${ol}" stroke-width="2"/>`;
  if (!d || d === '') s += `<rect x="86" y="140" width="28" height="20" rx="5" fill="#fff" opacity=".92"/><path d="M100 140v20" stroke="${ol}" stroke-width="2.5"/>`;
  if (d === 'coat') s += `<path d="M100 116 L88 196 M100 116 L112 196" stroke="#CBD5E3" stroke-width="3" fill="none"/><rect x="108" y="150" width="14" height="14" rx="3" fill="none" stroke="#CBD5E3" stroke-width="2.5"/><rect x="113" y="143" width="3" height="12" rx="1.5" fill="#4DA3FF"/><path d="M84 116 L100 134 L116 116" fill="#fff" stroke="#CBD5E3" stroke-width="2"/>`;
  if (d === 'vest') s += `<path d="M100 116 V196" stroke="${ol}" stroke-width="3"/><rect x="74" y="150" width="20" height="18" rx="4" fill="none" stroke="${ol}" stroke-width="2.5"/><rect x="106" y="150" width="20" height="18" rx="4" fill="none" stroke="${ol}" stroke-width="2.5"/><circle cx="100" cy="134" r="3" fill="${ol}"/><circle cx="100" cy="176" r="3" fill="${ol}"/>`;
  if (d === 'sampin') s += `<path d="M66 168 L134 168 L134 190 Q134 196 124 196 L76 196 Q66 196 66 190Z" fill="#E8B33A"/><path d="M66 168 L134 168" stroke="#fff" stroke-width="3"/>${[78, 92, 106, 120].map(x => `<path d="M${x} 176 l6 6 l-6 6 l-6 -6Z" fill="#B8481F"/>`).join('')}`;
  if (d === 'armor') s += `<path d="M76 118 L124 118 L120 164 Q100 176 80 164Z" fill="#DDE3EE" stroke="#8591AB" stroke-width="2"/><path d="M100 118 V170" stroke="#8591AB" stroke-width="2"/>${[84, 116].map(x => `<circle cx="${x}" cy="128" r="3" fill="#8591AB"/>`).join('')}`;
  if (d === 'stars') s += [[84, 140], [116, 150], [96, 172], [118, 182], [80, 186]].map(([x, y]) => `<polygon points="${star5(x, y, 6, 2.5)}" fill="#FFE98A"/>`).join('') + `<path d="M66 190 H134" stroke="#FFE98A" stroke-width="4"/>`;
  if (d === 'space') s += `<rect x="82" y="134" width="36" height="26" rx="6" fill="#4B5A78"/><circle cx="92" cy="147" r="4" fill="#6BD18B" class="twinkle"/><circle cx="104" cy="147" r="4" fill="#FF6B6B"/><circle cx="114" cy="147" r="3" fill="#FFD166"/><path d="M82 122 Q100 132 118 122" stroke="#9AA9BD" stroke-width="5" fill="none"/>`;
  s += `</g>`;
  /* arms: left holds shield, right holds tool */
  const sk2 = shade(skin, -.3);
  s += `<g class="h-armL"><ellipse cx="63" cy="138" rx="9.5" ry="17" fill="${oc}" stroke="${ol}" stroke-width="2" transform="rotate(14 63 138)"/><circle cx="55" cy="156" r="9" fill="${skin}" stroke="${sk2}" stroke-width="2"/><path d="M51 152 q3 -2.5 6.5 0" stroke="#fff" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>`;
  if (sh !== 'shield_none') s += `<g transform="translate(46 150)">${shieldSVG(sh, u)}</g>`;
  s += `</g><g class="h-armR"><ellipse cx="137" cy="138" rx="9.5" ry="17" fill="${oc}" stroke="${ol}" stroke-width="2" transform="rotate(-14 137 138)"/><g transform="translate(148 152) rotate(24)">${weaponSVG(W, u)}</g><circle cx="145" cy="156" r="9" fill="${skin}" stroke="${sk2}" stroke-width="2"/><path d="M141 152 q3 -2.5 6.5 0" stroke="#fff" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/></g>`;
  /* head */
  s += `<g class="h-head"><ellipse cx="100" cy="123" rx="17" ry="6" fill="${sk2}" opacity=".5"/><circle cx="56" cy="86" r="8" fill="${skin}" stroke="${sk2}" stroke-width="2"/><circle cx="144" cy="86" r="8" fill="${skin}" stroke="${sk2}" stroke-width="2"/><circle cx="100" cy="80" r="44" fill="url(#${u}sk)" stroke="${shade(skin, -.3)}" stroke-width="2"/>`;
  s += `<g class="h-eyes"><ellipse cx="84" cy="86" rx="10.5" ry="12.5" fill="#fff"/><ellipse cx="116" cy="86" rx="10.5" ry="12.5" fill="#fff"/><g class="h-pupil"><circle cx="86" cy="88" r="7.5" fill="url(#${u}ir)"/><circle cx="118" cy="88" r="7.5" fill="url(#${u}ir)"/><circle cx="86" cy="88" r="3.5" fill="#1d1410"/><circle cx="118" cy="88" r="3.5" fill="#1d1410"/><circle cx="89" cy="84" r="2.6" fill="#fff"/><circle cx="121" cy="84" r="2.6" fill="#fff"/><circle cx="83.5" cy="91.5" r="1.3" fill="#fff" opacity=".85"/><circle cx="115.5" cy="91.5" r="1.3" fill="#fff" opacity=".85"/></g><path d="M73 79 Q84 70 95 78 M105 78 Q116 70 127 79" stroke="${dk}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M74 80 l-5 -4 M126 80 l5 -4" stroke="${dk}" stroke-width="2.6" stroke-linecap="round"/></g>`;
  s += `<g class="h-eyes-x" style="display:none"><path d="M76 80 L92 92 M92 80 L76 92 M108 80 L124 92 M124 80 L108 92" stroke="${dk}" stroke-width="3.5" stroke-linecap="round"/></g>`;
  s += `<g class="h-brows"><path d="M74 68 Q84 62 94 68 M106 68 Q116 62 126 68" stroke="${shade(skin, -.45)}" stroke-width="3" fill="none" stroke-linecap="round"/></g><g class="h-cheek"><circle cx="72" cy="102" r="7" fill="#FF8FA3" opacity=".5"/><circle cx="128" cy="102" r="7" fill="#FF8FA3" opacity=".5"/></g><path d="M98 98 Q100 101 102 98" stroke="${shade(skin, -.4)}" stroke-width="2" fill="none" stroke-linecap="round"/><g class="h-mouth"><path d="M89 105 Q100 109 111 105 Q109 119 100 119 Q91 119 89 105Z" fill="#7A2D3A" stroke="${dk}" stroke-width="2.6" stroke-linejoin="round"/><path d="M93.5 114.5 Q100 110.5 106.5 114.5 Q104 119 100 119 Q96 119 93.5 114.5Z" fill="#FF8FA3"/><path d="M91.5 106.5 Q100 109.5 108.5 106.5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`;
  s += faceSVG(face, u) + hairFront(hair, hc, hs, u) + (hair.style === 'tudung' || hair.style === 'afro' ? '' : '<path d="M72 52 Q90 40 114 44" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".3"/>') + hatSVG(hat, u);
  s += `</g>`;
  if (eq.pet && eq.pet !== 'pet_none') s += `<g class="h-pet">${petSVG(eq.pet)}</g>`;
  return s + '</svg>';
}
function hairFront(h, hc, hs, u) {
  const st = h.style, P = (d) => `<path d="${d}" fill="${hc}" stroke="${hs}" stroke-width="2" stroke-linejoin="round"/>`;
  if (st === 'short' || st === 'long' || st === 'pigtails' || st === 'wavy') return P('M54 80 Q50 34 100 32 Q150 34 146 80 Q138 58 114 54 Q92 62 70 56 Q58 62 54 80Z');
  if (st === 'bun') return P('M54 80 Q50 34 100 32 Q150 34 146 80 Q138 58 114 54 Q92 62 70 56 Q58 62 54 80Z') + `<circle cx="100" cy="26" r="17" fill="${hc}" stroke="${hs}" stroke-width="2"/><rect x="90" y="38" width="20" height="5" rx="2.5" fill="#FF8FB1"/>`;
  if (st === 'afro') return P('M58 74 Q60 44 100 42 Q140 44 142 74 Q128 58 100 58 Q72 58 58 74Z');
  if (st === 'curly') return [[66, 48], [86, 38], [108, 38], [130, 48], [140, 66], [58, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="${hc}" stroke="${hs}" stroke-width="2"/>`).join('');
  if (st === 'spiky') return P('M54 76 Q50 40 74 36 L66 14 L88 32 L100 8 L112 32 L134 14 L126 36 Q150 40 146 76 Q136 58 100 56 Q64 58 54 76Z');
  if (st === 'tudung') return P('M54 84 Q50 34 100 30 Q150 34 146 84 Q140 62 100 56 Q60 62 54 84Z') + `<path d="M54 84 Q46 120 56 142 M146 84 Q154 120 144 142" stroke="${hc}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  return '';
}
function faceSVG(f, u) {
  if (f === 'face_glasses') return `<g><circle cx="84" cy="86" r="16" fill="#9ED8FF" fill-opacity=".25" stroke="#3b2a20" stroke-width="3"/><circle cx="116" cy="86" r="16" fill="#9ED8FF" fill-opacity=".25" stroke="#3b2a20" stroke-width="3"/><path d="M100 86 H100" stroke="#3b2a20" stroke-width="3"/></g>`;
  if (f === 'face_sunglasses') return `<path d="M66 78 H134 Q134 100 118 100 Q104 100 102 86 Q100 82 98 86 Q96 100 82 100 Q66 100 66 78Z" fill="#1d1d28" stroke="#fff" stroke-width="1.5"/><path d="M72 82 L84 82" stroke="#fff" stroke-width="2" opacity=".5"/>`;
  if (f === 'face_mask') return `<path d="M58 74 Q100 60 142 74 L142 92 Q122 104 108 92 Q100 88 92 92 Q78 104 58 92Z" fill="#E5484D"/><ellipse cx="84" cy="86" rx="10" ry="12" fill="#fff"/><ellipse cx="116" cy="86" rx="10" ry="12" fill="#fff"/><circle cx="86" cy="88" r="6" fill="#3b2a20"/><circle cx="118" cy="88" r="6" fill="#3b2a20"/>`;
  if (f === 'face_paint') return `<polygon points="${star5(70, 104, 9, 4)}" fill="#FFD166" stroke="#E0A800" stroke-width="1.5"/><polygon points="${star5(134, 104, 7, 3)}" fill="#FF6F91"/>`;
  if (f === 'face_whiskers') return `<path d="M60 102 L38 98 M60 108 L38 110 M140 102 L162 98 M140 108 L162 110" stroke="#3b2a20" stroke-width="2" stroke-linecap="round"/><path d="M95 96 L105 96 L100 102Z" fill="#FF8FA3"/>`;
  if (f === 'face_freckles') return [[76, 98], [82, 102], [70, 104], [124, 98], [118, 102], [130, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#A5673F"/>`).join('');
  return '';
}
function hatSVG(h, u) {
  const P = (d, f, x = '') => `<path d="${d}" fill="${f}" ${x}/>`;
  switch (h) {
    case 'hat_cap': return P('M52 62 Q100 4 148 62Z', '#4DA3FF') + `<rect x="46" y="56" width="108" height="10" rx="5" fill="#2F7FD6"/><rect x="118" y="58" width="44" height="8" rx="4" fill="#2F7FD6"/>`;
    case 'hat_beanie': return P('M54 62 Q54 12 100 12 Q146 12 146 62Z', '#E5484D') + `<rect x="50" y="54" width="100" height="14" rx="7" fill="#C23035"/><circle cx="100" cy="10" r="9" fill="#fff"/>`;
    case 'hat_party': return P('M70 56 L100 -6 L130 56Z', '#FF6F91') + `<path d="M82 34 L118 34 M76 46 L124 46" stroke="#FFE98A" stroke-width="4"/><circle cx="100" cy="-6" r="7" fill="#FFE98A"/>`;
    case 'hat_chef': return `<rect x="62" y="40" width="76" height="22" rx="6" fill="#fff" stroke="#DDE3EE" stroke-width="2"/><circle cx="72" cy="30" r="17" fill="#fff" stroke="#DDE3EE" stroke-width="2"/><circle cx="100" cy="22" r="20" fill="#fff" stroke="#DDE3EE" stroke-width="2"/><circle cx="128" cy="30" r="17" fill="#fff" stroke="#DDE3EE" stroke-width="2"/>`;
    case 'hat_songkok': return P('M64 54 L68 18 Q100 10 132 18 L136 54Z', '#22222B') + `<rect x="64" y="46" width="72" height="8" fill="#E8B33A"/>`;
    case 'hat_flowers': return [[58, 52], [76, 40], [100, 34], [124, 40], [142, 52]].map(([x, y], i) => `<g><circle cx="${x}" cy="${y}" r="10" fill="${['#FF8FB1', '#FFD166', '#B79CFF', '#FFD166', '#FF8FB1'][i]}"/><circle cx="${x}" cy="${y}" r="4" fill="#fff"/></g>`).join('');
    case 'hat_ladybug': return `<path d="M56 54 Q100 22 144 54" stroke="#22222B" stroke-width="4" fill="none"/><path d="M80 34 L72 8 M120 34 L128 8" stroke="#22222B" stroke-width="3" class="m-ant"/><circle cx="72" cy="8" r="9" fill="#E5484D"/><circle cx="128" cy="8" r="9" fill="#E5484D"/><circle cx="70" cy="6" r="2.5" fill="#22222B"/><circle cx="130" cy="10" r="2.5" fill="#22222B"/>`;
    case 'hat_wizard': return P('M56 56 L100 -18 L144 56Z', '#7C5CFF') + `<ellipse cx="100" cy="56" rx="56" ry="11" fill="#5B3FD6"/><polygon points="${star5(100, 26, 10, 4)}" fill="#FFE98A"/>`;
    case 'hat_grad': return `<polygon points="100,18 160,38 100,58 40,38" fill="#22222B"/><path d="M70 46 V62 Q100 72 130 62 V46" fill="#33333F"/><path d="M148 40 V68" stroke="#FFD166" stroke-width="3"/><circle cx="148" cy="70" r="5" fill="#FFD166"/>`;
    case 'hat_cowboy': return `<ellipse cx="100" cy="56" rx="66" ry="12" fill="#A5673F"/>` + P('M68 54 Q68 14 100 14 Q132 14 132 54Z', '#C88B54') + `<rect x="68" y="42" width="64" height="8" fill="#6B3E26"/>`;
    case 'hat_helm': return P('M52 78 Q52 20 100 20 Q148 20 148 78 L138 78 L138 62 L62 62 L62 78Z', '#AAB4C8', 'stroke="#8591AB" stroke-width="2"') + `<rect x="62" y="56" width="76" height="8" rx="3" fill="#8591AB"/><path d="M100 20 Q96 -2 122 -4 Q116 12 108 22Z" fill="#E5484D"/>`;
    case 'hat_crown': return P('M58 56 L64 18 L82 40 L100 8 L118 40 L136 18 L142 56Z', '#FFD166', 'stroke="#E0A800" stroke-width="2.5" stroke-linejoin="round"') + `<circle cx="100" cy="24" r="5" fill="#FF5E8A"/><circle cx="72" cy="38" r="3.5" fill="#4DA3FF"/><circle cx="128" cy="38" r="3.5" fill="#4DA3FF"/>`;
    case 'hat_astro': return `<circle cx="100" cy="80" r="58" fill="#BFE3FF" fill-opacity=".22" stroke="#DDE6F5" stroke-width="5"/><path d="M62 126 Q100 144 138 126" stroke="#9AA9BD" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M70 50 Q84 38 100 36" stroke="#fff" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>`;
    default: return '';
  }
}
function weaponSVG(w, u) {
  /* v35: a weapon that evolved (id + '+') glows gold and carries a star and sparkles */
  if (typeof w === 'string' && w.endsWith('+')) return `<g class="evo-w" style="filter:saturate(1.7) brightness(1.08) drop-shadow(0 0 7px #FFD166)">${weaponSVG(w.slice(0, -1), u)}</g><polygon points="${star5(0, -100, 11, 4.4)}" fill="#FFF3C4" stroke="#FFB400" stroke-width="2"/><circle cx="15" cy="-58" r="3.4" fill="#FFF3C4"/><circle cx="-14" cy="-78" r="2.8" fill="#FFF3C4"/>`;
  switch (w) {
    case 'weapon_pencil': return `<rect x="-6" y="-70" width="12" height="76" rx="3" fill="#FFC845"/><polygon points="-6,-70 6,-70 0,-86" fill="#F4C99B"/><polygon points="-2.5,-79 2.5,-79 0,-86" fill="#3b2a20"/><rect x="-6" y="2" width="12" height="10" rx="3" fill="#FF8FA3"/>`;
    case 'weapon_crayon': return `<rect x="-7" y="-72" width="14" height="82" rx="4" fill="url(#${u}rb)"/><polygon points="-7,-72 7,-72 0,-90" fill="#ff6b6b"/>`;
    case 'weapon_ruler': return `<rect x="-8" y="-92" width="16" height="104" rx="3" fill="#FFE6A0" stroke="#D9A940" stroke-width="2"/>${Array.from({ length: 9 }, (_, i) => `<path d="M-8 ${-86 + i * 11} h${i % 2 ? 6 : 10}" stroke="#8a6a1f" stroke-width="1.5"/>`).join('')}`;
    case 'weapon_paintbrush': return `<rect x="-3" y="-60" width="6" height="70" rx="3" fill="#8b5e3c"/><rect x="-5" y="-72" width="10" height="14" fill="#C9CED8"/><path d="M-6 -72 Q0 -98 6 -72Z" fill="#FF6F91"/>`;
    case 'weapon_wand': return `<rect x="-3" y="-70" width="6" height="80" rx="3" fill="#8b5e3c"/><polygon points="${star5(0, -82, 16, 7)}" fill="#FFD166" stroke="#E0A800" stroke-width="2" stroke-linejoin="round"/>`;
    case 'weapon_magnify': return `<rect x="-3" y="-44" width="6" height="56" rx="3" fill="#8b5e3c"/><circle cx="0" cy="-64" r="20" fill="#BFE3FF" fill-opacity=".5" stroke="#E8B33A" stroke-width="5"/><path d="M-10 -72 Q-6 -78 0 -78" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 'weapon_book': return `<rect x="-20" y="-58" width="40" height="52" rx="5" fill="#7C5CFF"/><rect x="-16" y="-54" width="32" height="44" rx="3" fill="#fff"/><path d="M0 -54 V-10" stroke="#7C5CFF" stroke-width="2"/><polygon points="${star5(0, -32, 7, 3)}" fill="#FFD166"/>`;
    case 'weapon_lollipop': return `<rect x="-2.5" y="-48" width="5" height="58" rx="2.5" fill="#fff" stroke="#DDE3EE"/><circle cx="0" cy="-64" r="22" fill="#FF6F91"/><path d="M0 -64 m0 0 a5 5 0 1 1 5 5 a10 10 0 1 1 -10 -10 a15 15 0 1 1 15 15" stroke="#fff" stroke-width="3.5" fill="none"/>`;
    case 'weapon_quill': return `<path d="M0 12 L0 -64 Q26 -56 20 -92 Q-4 -96 -10 -64 Q-14 -30 0 12Z" fill="#FFD166" stroke="#E0A800" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 -60 V10" stroke="#E0A800" stroke-width="2"/>`;
    case 'weapon_torch': return `<rect x="-5" y="-40" width="10" height="52" rx="4" fill="#8b5e3c"/><path d="M-12 -40 H12 L8 -50 H-8Z" fill="#6B3E26"/><path class="flame" d="M0 -96 Q18 -74 10 -56 Q0 -48 -10 -56 Q-18 -74 0 -96Z" fill="#FF9A3D"/><path class="flame" d="M0 -80 Q9 -68 5 -58 Q0 -54 -5 -58 Q-9 -68 0 -80Z" fill="#FFE98A"/>`;
    case 'weapon_rainbow': return `<rect x="-3" y="-60" width="6" height="72" rx="3" fill="#8b5e3c"/>${['#FF6B6B', '#FFD166', '#6BD18B', '#4DA3FF'].map((c, i) => `<path d="M${-26 + i * 5} -60 a${26 - i * 5} ${26 - i * 5} 0 0 1 ${(26 - i * 5) * 2} 0" stroke="${c}" stroke-width="5" fill="none"/>`).join('')}`;
    case 'weapon_starhammer': return `<rect x="-4" y="-56" width="8" height="68" rx="4" fill="#8b5e3c"/><polygon points="${star5(0, -70, 26, 11)}" fill="#FFD166" stroke="#E0A800" stroke-width="3" stroke-linejoin="round"/><circle cx="0" cy="-70" r="6" fill="#fff" opacity=".7"/>`;
    default: return '';
  }
}
function shieldSVG(s, u) {
  switch (s) {
    case 'shield_wood': return `<circle r="26" fill="#B9854F"/><circle r="18" fill="#D8A86B"/><circle r="5" fill="#8b5e3c"/>`;
    case 'shield_lid': return `<circle r="26" fill="#C9CED8" stroke="#8591AB" stroke-width="3"/><circle r="18" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/><circle cy="-4" r="6" fill="#6B7488"/>`;
    case 'shield_cookie': return `<circle r="26" fill="#D9A25B"/>${[[-9, -9], [10, -6], [-4, 10], [12, 12], [-14, 6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#5A3A22"/>`).join('')}`;
    case 'shield_book': return `<rect x="-24" y="-28" width="48" height="56" rx="8" fill="#4DA3FF"/><rect x="-18" y="-22" width="36" height="44" rx="4" fill="#fff"/><path d="M0 -22 V22" stroke="#4DA3FF" stroke-width="2.5"/>`;
    case 'shield_heart': return `<path d="M0 26 Q-30 4 -26 -12 Q-22 -26 -10 -24 Q-2 -22 0 -12 Q2 -22 10 -24 Q22 -26 26 -12 Q30 4 0 26Z" fill="#FF5E8A" stroke="#C4306A" stroke-width="3"/><path d="M-14 -12 Q-10 -18 -6 -16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`;
    case 'shield_rainbow': return `<circle r="26" fill="#B79CFF"/><circle r="21" fill="#4DA3FF"/><circle r="16" fill="#6BD18B"/><circle r="11" fill="#FFD166"/><circle r="6" fill="#FF6B6B"/>`;
    case 'shield_star': return `<path d="M0 -28 L26 -17 Q26 20 0 30 Q-26 20 -26 -17Z" fill="#FFD166" stroke="#E0A800" stroke-width="3"/><polygon points="${star5(0, 0, 14, 6)}" fill="#fff"/>`;
    case 'shield_planet': return `<circle r="26" fill="#6B4DD6"/><circle r="14" fill="#B79CFF"/><ellipse rx="34" ry="8" fill="none" stroke="#FFD166" stroke-width="4" transform="rotate(-20)"/>`;
    default: return '';
  }
}
function basePetOld(p) {
  const ey = (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#22222B"/>`;
  switch (p) {
    case 'pet_cat': return `<g transform="translate(8 176)"><path d="M44 36 Q64 34 58 14" stroke="#FFA45C" stroke-width="7" fill="none" stroke-linecap="round" class="m-tail"/><ellipse cx="26" cy="32" rx="22" ry="16" fill="#FFA45C"/><circle cx="20" cy="14" r="14" fill="#FFA45C"/><polygon points="8,6 10,-6 18,2" fill="#FFA45C"/><polygon points="32,6 30,-6 22,2" fill="#FFA45C"/>${ey(15, 13)}${ey(26, 13)}<path d="M18 19 Q21 22 24 19" stroke="#22222B" stroke-width="1.5" fill="none"/></g>`;
    case 'pet_dog': return `<g transform="translate(8 176)"><path d="M44 30 Q58 22 54 12" stroke="#C9A27A" stroke-width="6" fill="none" stroke-linecap="round" class="m-tail"/><ellipse cx="26" cy="32" rx="22" ry="16" fill="#C9A27A"/><circle cx="20" cy="14" r="14" fill="#C9A27A"/><ellipse cx="8" cy="16" rx="6" ry="11" fill="#8B6A45"/><ellipse cx="32" cy="16" rx="6" ry="11" fill="#8B6A45"/>${ey(16, 12)}${ey(26, 12)}<ellipse cx="21" cy="20" rx="4" ry="3" fill="#22222B"/></g>`;
    case 'pet_bunny': return `<g transform="translate(8 176)"><ellipse cx="26" cy="32" rx="20" ry="15" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><circle cx="22" cy="14" r="13" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><ellipse cx="14" cy="-8" rx="5" ry="15" fill="#fff" stroke="#E4E8F2" stroke-width="2" class="m-ant"/><ellipse cx="30" cy="-8" rx="5" ry="15" fill="#fff" stroke="#E4E8F2" stroke-width="2" class="m-ant"/>${ey(18, 12)}${ey(28, 12)}<circle cx="23" cy="18" r="2.5" fill="#FF8FA3"/></g>`;
    case 'pet_penguin': return `<g transform="translate(10 172)"><ellipse cx="22" cy="30" rx="18" ry="24" fill="#2B3350"/><ellipse cx="22" cy="36" rx="11" ry="17" fill="#fff"/>${ey(16, 18)}${ey(28, 18)}<path d="M17 23 L27 23 L22 29Z" fill="#FFA45C"/><ellipse cx="12" cy="54" rx="8" ry="3.5" fill="#FFA45C"/><ellipse cx="32" cy="54" rx="8" ry="3.5" fill="#FFA45C"/></g>`;
    case 'pet_slime': return `<g transform="translate(8 188)"><path d="M0 38 Q-4 6 26 4 Q56 6 52 38Z" fill="#6BD18B"/><ellipse cx="16" cy="14" rx="5" ry="3" fill="#fff" opacity=".5"/>${ey(17, 24)}${ey(35, 24)}<path d="M20 31 Q26 36 32 31" stroke="#22222B" stroke-width="2" fill="none"/></g>`;
    case 'pet_robot': return `<g transform="translate(8 172)"><rect x="6" y="14" width="40" height="30" rx="8" fill="#9AA9BD"/><rect x="12" y="20" width="28" height="14" rx="5" fill="#22222B"/><circle cx="21" cy="27" r="3.5" fill="#6BD18B" class="twinkle"/><circle cx="31" cy="27" r="3.5" fill="#6BD18B" class="twinkle"/><path d="M26 14 V2" stroke="#6B7488" stroke-width="3"/><circle cx="26" cy="2" r="4" fill="#FF6B6B" class="twinkle"/><rect x="10" y="44" width="10" height="8" rx="3" fill="#6B7488"/><rect x="32" y="44" width="10" height="8" rx="3" fill="#6B7488"/></g>`;
    case 'pet_dragon': return `<g transform="translate(6 170)"><path d="M46 40 Q66 38 60 18" stroke="#6BD18B" stroke-width="7" fill="none" stroke-linecap="round" class="m-tail"/><path d="M14 22 Q-6 8 4 34Z" fill="#4FAE6E" class="h-wingL"/><ellipse cx="28" cy="38" rx="22" ry="17" fill="#6BD18B"/><circle cx="24" cy="16" r="15" fill="#6BD18B"/><polygon points="12,4 14,-10 22,2" fill="#FFE98A"/><polygon points="36,4 34,-10 26,2" fill="#FFE98A"/>${ey(18, 14)}${ey(30, 14)}<ellipse cx="24" cy="38" rx="11" ry="9" fill="#FFE2B8"/></g>`;
    case 'pet_unicorn': return `<g transform="translate(4 170)"><path d="M48 38 Q64 40 60 52" stroke="#F2A0DC" stroke-width="7" fill="none" stroke-linecap="round" class="m-tail"/><ellipse cx="28" cy="40" rx="24" ry="16" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><circle cx="22" cy="16" r="14" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><polygon points="18,4 22,-16 28,4" fill="#FFD166"/><path d="M30 10 Q40 14 36 28" stroke="#B79CFF" stroke-width="6" fill="none" stroke-linecap="round"/>${ey(18, 16)}${ey(28, 16)}</g>`;
    default: return '';
  }
}

/* ---------- Monsters: built from parts so every monster is its own character ---------- */
const MB = {
  blob: { cx: 100, ey: 114, my: 142, top: 64, hw: 70, bot: 174, shape: a => `<path ${a} d="M30 160 Q24 82 100 62 Q176 82 170 160 Q170 176 154 176 L46 176 Q30 176 30 160Z"/>` },
  round: { cx: 100, ey: 104, my: 132, top: 50, hw: 62, bot: 174, shape: a => `<circle ${a} cx="100" cy="112" r="62"/>` },
  egg: { cx: 100, ey: 92, my: 124, top: 38, hw: 54, bot: 178, shape: a => `<ellipse ${a} cx="100" cy="108" rx="54" ry="70"/>` },
  ghost: { cx: 100, ey: 96, my: 130, top: 40, hw: 56, bot: 176, shape: a => `<path ${a} d="M44 176 L44 92 Q44 40 100 40 Q156 40 156 92 L156 176 Q142 160 128 176 Q114 160 100 176 Q86 160 72 176 Q58 160 44 176Z"/>` },
  box: { cx: 100, ey: 100, my: 134, top: 58, hw: 58, bot: 170, shape: a => `<rect ${a} x="42" y="58" width="116" height="112" rx="30"/>` },
  tri: { cx: 100, ey: 120, my: 150, top: 42, hw: 52, bot: 174, shape: a => `<path ${a} d="M100 40 Q116 40 152 148 Q158 176 132 176 L68 176 Q42 176 48 148 Q84 40 100 40Z"/>` },
  star: { cx: 100, ey: 106, my: 130, top: 38, hw: 58, bot: 170, shape: a => `<polygon ${a} points="${star5(100, 108, 70, 38)}" style="stroke-width:14px;stroke-linejoin:round;paint-order:stroke"/>` },
  cloud: { cx: 100, ey: 114, my: 140, top: 56, hw: 68, bot: 168, shape: a => `<g ${a}><circle cx="66" cy="124" r="36"/><circle cx="100" cy="100" r="44"/><circle cx="136" cy="122" r="38"/><rect x="60" y="120" width="82" height="48" rx="22"/></g>` },
  fish: { cx: 78, ey: 102, my: 128, top: 60, hw: 62, bot: 164, shape: a => `<ellipse ${a} cx="92" cy="112" rx="68" ry="52"/><path ${a} d="M150 112 L196 76 Q186 112 196 148Z"/>` },
  bean: { cx: 100, ey: 114, my: 144, top: 78, hw: 66, bot: 174, shape: a => `<path ${a} d="M34 152 Q28 92 90 80 Q170 70 174 142 Q176 176 142 176 L62 176 Q34 176 34 152Z"/>` }
};
function monsterSVGClassic(m, hue = 0) {
  const u = 'm' + (uid++), B = MB[m.b], { cx, ey, my, top, hw, bot } = B, c0 = PAL[m.c], c1 = shade(c0, -.22), c2 = shade(c0, .55), F = new Set(m.f), ink = '#2a2233';
  const clip = `<clipPath id="${u}c">${B.shape('')}</clipPath>`;
  let back = '', front = '', ov = '', tophat = '';
  if (F.has('fur')) for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; back += `<circle cx="${(cx + Math.cos(a) * hw * .88).toFixed(1)}" cy="${(112 + Math.sin(a) * hw * .84).toFixed(1)}" r="14" fill="${c0}"/>`; }
  if (F.has('wingsBat')) back += `<g class="m-wingL"><path d="M${cx - hw + 6} ${ey} Q${cx - hw - 50} ${ey - 56} ${cx - hw - 40} ${ey + 10} Q${cx - hw - 26} ${ey - 8} ${cx - hw - 20} ${ey + 18} Q${cx - hw - 8} ${ey + 4} ${cx - hw + 6} ${ey + 22}Z" fill="${c1}"/></g><g class="m-wingR"><path d="M${cx + hw - 6} ${ey} Q${cx + hw + 50} ${ey - 56} ${cx + hw + 40} ${ey + 10} Q${cx + hw + 26} ${ey - 8} ${cx + hw + 20} ${ey + 18} Q${cx + hw + 8} ${ey + 4} ${cx + hw - 6} ${ey + 22}Z" fill="${c1}"/></g>`;
  if (F.has('wingsAngel')) back += `<g class="m-wingL"><path d="M${cx - hw + 8} ${ey} Q${cx - hw - 44} ${ey - 40} ${cx - hw - 34} ${ey + 22} Q${cx - hw - 12} ${ey + 28} ${cx - hw + 8} ${ey + 16}Z" fill="#fff" stroke="#DDE6F5" stroke-width="2"/></g><g class="m-wingR"><path d="M${cx + hw - 8} ${ey} Q${cx + hw + 44} ${ey - 40} ${cx + hw + 34} ${ey + 22} Q${cx + hw + 12} ${ey + 28} ${cx + hw - 8} ${ey + 16}Z" fill="#fff" stroke="#DDE6F5" stroke-width="2"/></g>`;
  if (F.has('tail') && m.b !== 'fish') back += `<path class="m-tail" d="M${cx + hw - 8} ${bot - 22} Q${cx + hw + 34} ${bot - 20} ${cx + hw + 22} ${bot - 60}" stroke="${c0}" stroke-width="13" fill="none" stroke-linecap="round"/><polygon class="m-tail" points="${cx + hw + 12},${bot - 58} ${cx + hw + 36},${bot - 64} ${cx + hw + 24},${bot - 80}" fill="${c1}"/>`;
  if (F.has('earsCat')) back += [-1, 1].map(s => `<polygon points="${cx + s * hw * .74},${top + 34} ${cx + s * hw * .66},${top - 8} ${cx + s * hw * .22},${top + 12}" fill="${c0}"/><polygon points="${cx + s * hw * .62},${top + 22} ${cx + s * hw * .62},${top + 2} ${cx + s * hw * .36},${top + 14}" fill="#FF9FB0"/>`).join('');
  if (F.has('earsBunny')) back += [-1, 1].map(s => `<g class="m-ant"><ellipse cx="${cx + s * hw * .4}" cy="${top - 14}" rx="11" ry="34" fill="${c0}" transform="rotate(${s * 8} ${cx + s * hw * .4} ${top + 12})"/><ellipse cx="${cx + s * hw * .4}" cy="${top - 12}" rx="5.5" ry="24" fill="#FF9FB0" transform="rotate(${s * 8} ${cx + s * hw * .4} ${top + 12})"/></g>`).join('');
  if (F.has('earsRound')) back += [-1, 1].map(s => `<circle cx="${cx + s * hw * .66}" cy="${top + 16}" r="16" fill="${c0}"/><circle cx="${cx + s * hw * .66}" cy="${top + 16}" r="9" fill="#FF9FB0"/>`).join('');
  if (F.has('antennae')) back += [-1, 1].map(s => `<g class="m-ant"><path d="M${cx + s * 12} ${top + 8} Q${cx + s * 26} ${top - 20} ${cx + s * 22} ${top - 34}" stroke="${c1}" stroke-width="4" fill="none"/><circle cx="${cx + s * 22}" cy="${top - 36}" r="8" fill="${s < 0 ? '#FFD166' : '#FF6F91'}"/></g>`).join('');
  if (F.has('horns')) back += [-1, 1].map(s => `<path d="M${cx + s * hw * .5 - 10} ${top + 14} L${cx + s * hw * .56} ${top - 26} L${cx + s * hw * .5 + 12} ${top + 16}Z" fill="#FFE9A8" stroke="${c1}" stroke-width="2.5" stroke-linejoin="round"/>`).join('');
  if (F.has('horn')) back += `<path d="M${cx - 9} ${top + 12} L${cx + 2} ${top - 34} L${cx + 12} ${top + 12}Z" fill="#FFD166" stroke="#E0A800" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (F.has('spikes')) back += Array.from({ length: 5 }, (_, i) => { const x = cx - 32 + i * 16; return `<polygon points="${x - 7},${top + 16 + Math.abs(i - 2) * 6} ${x},${top - 10 + Math.abs(i - 2) * 6} ${x + 7},${top + 16 + Math.abs(i - 2) * 6}" fill="${c1}"/>`; }).join('');
  if (F.has('fins')) back += `<path d="M${cx - 10} ${top + 4} Q${cx + 4} ${top - 34} ${cx + 30} ${top + 10}Z" fill="${c1}"/><path d="M${cx + 20} ${bot - 22} L${cx + 52} ${bot + 4} L${cx + 14} ${bot - 4}Z" fill="${c1}"/>`;
  if (F.has('feet')) back += [-1, 1].map(s => `<ellipse cx="${cx + s * 26}" cy="${bot + 2}" rx="18" ry="8" fill="${c1}"/>`).join('');
  if (F.has('belly')) ov += `<ellipse cx="${cx}" cy="${bot - 26}" rx="${hw * .6}" ry="${hw * .46}" fill="${c2}"/>`;
  if (F.has('spots')) ov += [[-28, -6, 10], [20, -24, 8], [34, 14, 11], [-14, 34, 9], [4, 4, 6]].map(([x, y, r]) => `<circle cx="${cx + x}" cy="${ey + y + 20}" r="${r}" fill="${c1}" opacity=".6"/>`).join('');
  if (F.has('stripes')) ov += [0, 1, 2].map(i => `<path d="M${cx - hw} ${ey + 14 + i * 18} Q${cx} ${ey + 28 + i * 18} ${cx + hw} ${ey + 14 + i * 18}" stroke="${c1}" stroke-width="7" fill="none" opacity=".55"/>`).join('');
  if (F.has('sprinkles')) ov += [[-30, -30, 20], [16, -34, -30], [34, -8, 60], [-38, 4, -50], [-10, -12, 10], [24, 20, -10]].map(([x, y, r], i) => `<rect x="${cx + x - 6}" y="${ey + y}" width="12" height="4.5" rx="2.2" fill="${['#FF6F91', '#FFD166', '#6BD18B', '#4DA3FF', '#fff', '#B79CFF'][i]}" transform="rotate(${r} ${cx + x} ${ey + y + 2})"/>`).join('');
  if (F.has('bolt')) ov += `<polygon points="${cx + 4},${my + 4} ${cx - 12},${my + 28} ${cx - 1},${my + 28} ${cx - 6},${my + 46} ${cx + 14},${my + 20} ${cx + 3},${my + 20}" fill="#FFD166" stroke="#E0A800" stroke-width="2" stroke-linejoin="round"/>`;
  if (F.has('arms')) front += [-1, 1].map(s => `<ellipse cx="${cx + s * (hw + 4)}" cy="${my + 12}" rx="10" ry="16" fill="${c0}" stroke="${c1}" stroke-width="2" transform="rotate(${s * -22} ${cx + s * (hw + 4)} ${my + 12})"/>`).join('');
  if (F.has('ring')) front += `<ellipse cx="${cx}" cy="${ey + 30}" rx="${hw + 30}" ry="16" fill="none" stroke="#FFD166" stroke-width="9" transform="rotate(-14 ${cx} ${ey + 30})" opacity=".95"/>`;
  if (F.has('scarf')) front += `<path d="M${cx - hw * .8} ${my + 14} Q${cx} ${my + 34} ${cx + hw * .8} ${my + 14} L${cx + hw * .8} ${my + 30} Q${cx} ${my + 50} ${cx - hw * .8} ${my + 30}Z" fill="#E5484D"/><path d="M${cx + 22} ${my + 36} L${cx + 40} ${my + 66} L${cx + 22} ${my + 62}Z" fill="#C23035"/>`;
  if (F.has('bowtie')) front += `<polygon points="${cx},${my + 26} ${cx - 22},${my + 14} ${cx - 22},${my + 38}" fill="#E5484D"/><polygon points="${cx},${my + 26} ${cx + 22},${my + 14} ${cx + 22},${my + 38}" fill="#E5484D"/><circle cx="${cx}" cy="${my + 26}" r="5" fill="#C23035"/>`;
  /* face */
  const ex = 22, hurtX = `<g class="m-eyes-x" style="display:none"><path d="M${cx - ex - 8} ${ey - 8} l16 16 m0 -16 l-16 16 M${cx + ex - 8} ${ey - 8} l16 16 m0 -16 l-16 16" stroke="${ink}" stroke-width="4" stroke-linecap="round"/></g>`;
  const eye = (x, y, r, big) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${shade(c0, -.5)}" stroke-width="2.2"/><circle cx="${x - r * .25}" cy="${y + r * .1}" r="${r * (big ? .62 : .5)}" fill="${big ? shade(c0, -.45) : ink}"/>${big ? `<circle cx="${x - r * .25}" cy="${y + r * .1}" r="${r * .3}" fill="${ink}"/>` : ''}<circle cx="${x - r * .45}" cy="${y - r * .25}" r="${r * .2}" fill="#fff"/><circle cx="${x + r * .12}" cy="${y + r * .38}" r="${r * .1}" fill="#fff" opacity=".8"/>`;
  let eyes;
  if (m.e === 'one') eyes = eye(cx, ey, 21, 0);
  else if (m.e === 'three') eyes = eye(cx - 30, ey + 2, 10, 0) + eye(cx, ey - 6, 11, 0) + eye(cx + 30, ey + 2, 10, 0);
  else if (m.e === 'stalk') eyes = [-1, 1].map(s => `<path d="M${cx + s * ex} ${ey + 4} L${cx + s * (ex + 6)} ${ey - 26}" stroke="${c1}" stroke-width="5"/>`).join('') + eye(cx - ex - 6, ey - 34, 12, 0) + eye(cx + ex + 6, ey - 34, 12, 0);
  else if (m.e === 'sleepy') eyes = [-1, 1].map(s => `<circle cx="${cx + s * ex}" cy="${ey}" r="12" fill="#fff"/><circle cx="${cx + s * ex - 3}" cy="${ey + 3}" r="5.5" fill="${ink}"/><path d="M${cx + s * ex - 13} ${ey - 4} Q${cx + s * ex} ${ey - 14} ${cx + s * ex + 13} ${ey - 4} L${cx + s * ex + 13} ${ey - 14} L${cx + s * ex - 13} ${ey - 14}Z" fill="${c0}"/><path d="M${cx + s * ex - 13} ${ey - 4} Q${cx + s * ex} ${ey + 2} ${cx + s * ex + 13} ${ey - 4}" stroke="${ink}" stroke-width="3" fill="none"/>`).join('');
  else eyes = eye(cx - ex, ey, m.e === 'big' ? 15 : 12, m.e === 'big') + eye(cx + ex, ey, m.e === 'big' ? 15 : 12, m.e === 'big');
  const mo = { smile: `<path d="M${cx - 16} ${my} Q${cx} ${my + 16} ${cx + 16} ${my}" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    open: `<path d="M${cx - 18} ${my - 2} Q${cx} ${my + 32} ${cx + 18} ${my - 2}Z" fill="${ink}"/><ellipse cx="${cx}" cy="${my + 14}" rx="9" ry="6" fill="#FF6F91"/>`,
    teeth: `<path d="M${cx - 24} ${my - 4} Q${cx} ${my + 26} ${cx + 24} ${my - 4}Z" fill="${ink}"/><path d="M${cx - 18} ${my - 2} h8 v7 h-8Z M${cx - 4} ${my + 1} h8 v8 h-8Z M${cx + 10} ${my - 2} h8 v7 h-8Z" fill="#fff"/>`,
    tongue: `<path d="M${cx - 16} ${my} Q${cx} ${my + 14} ${cx + 16} ${my}" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${cx - 2} ${my + 8} Q${cx + 8} ${my + 8} ${cx + 8} ${my + 18} Q${cx + 4} ${my + 26} ${cx} ${my + 18}Z" fill="#FF6F91"/>`,
    oh: `<ellipse cx="${cx}" cy="${my + 4}" rx="8" ry="10" fill="${ink}"/>`,
    zig: `<path d="M${cx - 22} ${my + 2} l8 -8 l8 10 l8 -10 l8 10 l8 -8" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    fang: `<path d="M${cx - 16} ${my} Q${cx} ${my + 14} ${cx + 16} ${my}" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/><polygon points="${cx - 12},${my + 3} ${cx - 6},${my + 3} ${cx - 9},${my + 14}" fill="#fff"/><polygon points="${cx + 6},${my + 3} ${cx + 12},${my + 3} ${cx + 9},${my + 14}" fill="#fff"/>` }[m.mo || m.m];
  let facef = `<g class="m-eyes" style="animation-delay:${-(m.c * .7 + (m.seed || m.n).length * .3) % 4}s">${eyes}</g>${hurtX}<g class="m-mouth">${mo}</g>`;
  if (F.has('cheeks')) facef += [-1, 1].map(s => `<circle cx="${cx + s * (hw * .56)}" cy="${my - 6}" r="9" fill="#FF8FA3" opacity=".55"/>`).join('');
  if (F.has('freckles')) facef += [[-34, 4], [-28, 10], [-40, 10], [34, 4], [28, 10], [40, 10]].map(([x, y]) => `<circle cx="${cx + x}" cy="${my + y - 8}" r="2" fill="${c1}"/>`).join('');
  if (F.has('eyebrows')) facef += [-1, 1].map(s => `<path d="M${cx + s * ex - 12} ${ey - 20 + s * 4} L${cx + s * ex + 12} ${ey - 20 - s * 4}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`).join('');
  if (F.has('glasses')) facef += `<g fill="#BFE3FF" fill-opacity=".3" stroke="${ink}" stroke-width="3.5"><circle cx="${cx - ex}" cy="${ey}" r="19"/><circle cx="${cx + ex}" cy="${ey}" r="19"/></g><path d="M${cx - 3} ${ey} h6" stroke="${ink}" stroke-width="3.5"/>`;
  if (F.has('bubbles')) facef += [[hw * .7, -10, 9], [hw * .85, 12, 6], [-hw * .8, -20, 7]].map(([x, y, r]) => `<circle cx="${cx + x}" cy="${top + 30 + y}" r="${r}" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-width="2"/>`).join('');
  if (F.has('stars')) facef += [[-hw - 4, -30], [hw + 2, -40], [hw - 4, 40]].map(([x, y], i) => `<polygon class="twinkle" style="animation-delay:${-i * .5}s;transform-origin:${cx + x}px ${ey + y}px" points="${star5(cx + x, ey + y, 9, 4)}" fill="#FFE98A"/>`).join('');
  /* top gear */
  if (F.has('crown')) tophat += `<path d="M${cx - 28} ${top + 14} L${cx - 24} ${top - 18} L${cx - 10} ${top} L${cx} ${top - 26} L${cx + 10} ${top} L${cx + 24} ${top - 18} L${cx + 28} ${top + 14}Z" fill="#FFD166" stroke="#E0A800" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${cx}" cy="${top - 8}" r="4.5" fill="#FF5E8A"/>`;
  if (F.has('partyHat')) tophat += `<polygon points="${cx - 24},${top + 14} ${cx},${top - 46} ${cx + 24},${top + 14}" fill="#FF6F91"/><path d="M${cx - 14} ${top - 12} h28 M${cx - 19} ${top + 2} h38" stroke="#FFE98A" stroke-width="4"/><circle cx="${cx}" cy="${top - 46}" r="6" fill="#FFE98A"/>`;
  if (F.has('topHat')) tophat += `<rect x="${cx - 36}" y="${top + 4}" width="72" height="9" rx="4" fill="#2b2b3a"/><rect x="${cx - 22}" y="${top - 28}" width="44" height="34" rx="4" fill="#2b2b3a"/><rect x="${cx - 22}" y="${top - 6}" width="44" height="7" fill="#E5484D"/>`;
  if (F.has('wizardHat')) tophat += `<polygon points="${cx - 36},${top + 12} ${cx + 4},${top - 62} ${cx + 38},${top + 12}" fill="#5B3FD6"/><ellipse cx="${cx}" cy="${top + 12}" rx="48" ry="9" fill="#4630B0"/><polygon points="${star5(cx + 2, top - 20, 9, 4)}" fill="#FFE98A"/>`;
  if (F.has('flower')) tophat += `<g class="m-ant" style="transform-origin:${cx + hw * .3}px ${top + 10}px">${[0, 72, 144, 216, 288].map(a => `<circle cx="${cx + hw * .3 + Math.cos(a * Math.PI / 180) * 9}" cy="${top + Math.sin(a * Math.PI / 180) * 9}" r="7" fill="#FF8FB1"/>`).join('')}<circle cx="${cx + hw * .3}" cy="${top}" r="5" fill="#FFD166"/></g>`;
  if (F.has('halo')) tophat += `<ellipse class="m-halo" cx="${cx}" cy="${top - 14}" rx="28" ry="8" fill="none" stroke="#FFD166" stroke-width="6"/>`;
  const sv = `<svg class="mon-svg" viewBox="-40 -30 280 250" role="img" aria-label="${esc(m.n)}"${hue ? ` style="filter:hue-rotate(${hue}deg)"` : ''}><defs>${clip}<radialGradient id="${u}g" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${shade(c0, .32)}"/><stop offset="1" stop-color="${c0}"/></radialGradient></defs><ellipse class="m-shadow" cx="${cx}" cy="${bot + 8}" rx="${hw + 6}" ry="8" fill="rgba(0,0,0,.18)"/><g class="m-all">${back}<g>${B.shape(`fill="url(#${u}g)" stroke="${shade(c0, -.45)}" stroke-width="5" stroke-linejoin="round"`)}</g><g clip-path="url(#${u}c)">${ov}<ellipse cx="${cx}" cy="${bot + 4}" rx="${hw + 12}" ry="24" fill="${c1}" opacity=".28"/><ellipse class="m-gloss" cx="${cx - hw * .34}" cy="${top + 26}" rx="${hw * .3}" ry="${hw * .14}" fill="#fff" opacity=".32" transform="rotate(-28 ${cx - hw * .34} ${top + 26})"/><path d="M${cx + hw * .5} ${bot - 18} Q${cx + hw * .86} ${(top + bot) / 2} ${cx + hw * .5} ${top + 22}" stroke="${c1}" stroke-width="10" fill="none" opacity=".22" stroke-linecap="round"/></g>${front}${facef}${tophat}</g></svg>`;
  return sv;
}

function owlSVGClassic() {
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 22 L16 6 L28 14Z M52 22 L48 6 L36 14Z" fill="#7C5CFF"/><ellipse cx="32" cy="38" rx="22" ry="22" fill="#8F73FF"/><ellipse cx="32" cy="46" rx="13" ry="13" fill="#E8DEFF"/><g class="o-eyes"><circle cx="23" cy="30" r="9" fill="#fff"/><circle cx="41" cy="30" r="9" fill="#fff"/><circle cx="24" cy="31" r="4.5" fill="#2b2b3a"/><circle cx="40" cy="31" r="4.5" fill="#2b2b3a"/><circle cx="25.5" cy="29.5" r="1.4" fill="#fff"/><circle cx="41.5" cy="29.5" r="1.4" fill="#fff"/></g><path d="M28 37 L32 43 L36 37Z" fill="#FFB84D"/></svg>`;
}

/* ---------- Scenery: slowly drifting layers per world ---------- */
function sceneryHTML(w) {
  const far = { 1: `<circle cx="60" cy="40" r="18" fill="#fff" opacity=".8"/><circle cx="80" cy="46" r="14" fill="#fff" opacity=".8"/><circle cx="300" cy="30" r="16" fill="#fff" opacity=".7"/><circle cx="320" cy="36" r="12" fill="#fff" opacity=".7"/>`,
    2: [60, 140, 220, 300, 380].map(x => `<rect x="${x}" y="10" width="14" height="70" rx="3" fill="rgba(255,255,255,.18)"/>`).join(''),
    3: [[50, 40], [140, 30], [250, 44], [330, 28]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="rgba(255,255,255,.55)" class="twinkle"/>`).join(''),
    4: [[60, 36], [180, 28], [300, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#FFB3D1" opacity=".8"/><path d="M${x - 10} ${y + 6} q10 10 20 0" stroke="#fff" stroke-width="3" fill="none"/>`).join(''),
    5: `<ellipse cx="70" cy="44" rx="44" ry="16" fill="#fff" opacity=".85"/><ellipse cx="110" cy="38" rx="30" ry="14" fill="#fff" opacity=".85"/><ellipse cx="300" cy="30" rx="50" ry="16" fill="#fff" opacity=".8"/>`,
    6: [[30, 20], [90, 60], [150, 24], [210, 50], [270, 18], [330, 56], [380, 28]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 2 : 3}" fill="#fff" class="twinkle" style="animation-delay:${-i * .3}s"/>`).join('') + `<circle cx="320" cy="60" r="22" fill="#F4E9C8"/><circle cx="312" cy="54" r="5" fill="#E3D6A8"/>` }[w];
  const near = { 1: [30, 130, 250, 350].map((x, i) => `<rect x="${x + 8}" y="120" width="10" height="42" fill="#7A5230"/><circle cx="${x + 13}" cy="108" r="${i % 2 ? 24 : 28}" fill="#3FA564"/>`).join(''),
    2: [90, 270].map(x => `<rect x="${x}" y="100" width="6" height="60" fill="#6B5A7C"/><path class="flame" d="M${x + 3} 80 Q${x + 14} 96 ${x + 8} 104 Q${x + 3} 108 ${x - 2} 104 Q${x - 8} 96 ${x + 3} 80Z" fill="#FFB84D"/>`).join('') + `<path d="M0 160 h400" stroke="rgba(255,255,255,.2)" stroke-width="3" stroke-dasharray="30 10"/>`,
    3: [60, 200, 330].map(x => `<rect x="${x}" y="116" width="26" height="46" rx="4" fill="rgba(255,255,255,.35)"/><circle cx="${x + 13}" cy="108" r="12" fill="rgba(160,230,255,.6)"/><circle class="rise" cx="${x + 10}" cy="116" r="3" fill="#fff"/>`).join(''),
    4: [40, 160, 290].map((x, i) => `<rect x="${x + 8}" y="116" width="5" height="46" fill="#fff"/><circle cx="${x + 10}" cy="106" r="16" fill="${['#FF6F91', '#FFD166', '#7ED6C8'][i]}"/><path d="M${x + 10} 106 m-8 0 a8 8 0 1 1 8 8" stroke="#fff" stroke-width="3" fill="none"/>`).join(''),
    5: `<path d="M20 160 Q120 40 220 160" stroke="#FF6B6B" stroke-width="8" fill="none" opacity=".75"/><path d="M32 160 Q120 58 208 160" stroke="#FFD166" stroke-width="8" fill="none" opacity=".75"/><path d="M44 160 Q120 76 196 160" stroke="#6BD18B" stroke-width="8" fill="none" opacity=".75"/><path d="M56 160 Q120 94 184 160" stroke="#4DA3FF" stroke-width="8" fill="none" opacity=".75"/>`,
    6: `<circle cx="70" cy="120" r="26" fill="#B79CFF"/><ellipse cx="70" cy="120" rx="42" ry="9" fill="none" stroke="#FFD166" stroke-width="5" transform="rotate(-18 70 120)"/><circle cx="260" cy="132" r="16" fill="#FF8FB1"/>` }[w];
  return `<div class="sc-far"><svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMin slice">${far}</svg></div><div class="sc-near"><svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice">${near}</svg></div>`;
}

Object.assign(STR, {
  'pin.cancel': ['Cancel', 'Batal'], 'pin.title': ['Grown-ups only', 'Untuk orang dewasa sahaja'],
  'st.count': ['{n} lessons', '{n} pelajaran'],
  'st.age': ['Pick lessons by age', 'Pilih pelajaran mengikut umur'],
  'st.ageAll': ['All ages', 'Semua umur'],
  'st.close': ['Close', 'Tutup']
});
