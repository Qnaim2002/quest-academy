/* ================= v33: more detailed pets =================
   The 23 pets are flat drawings. Every pet now gets a soft "plush" light on top of its drawing (a light from the
   top left, shading toward the edges, a very fine fur grain and a little shine) and shiny eyes (a catch-light in
   each dark eye). It is one shared SVG filter, so no pet drawing had to change. In "light" mode (slow tablets) the
   filter is switched off in CSS and only the eye shine stays. */
const PET_FILTER = '<defs><filter id="qpd" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">'
  + '<feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>'
  + '<feDiffuseLighting in="b" surfaceScale="3.2" diffuseConstant="1.22" lighting-color="#fff" result="d"><feDistantLight azimuth="228" elevation="58"/></feDiffuseLighting>'
  + '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="lit"/>'
  + '<feSpecularLighting in="b" surfaceScale="3.6" specularConstant=".5" specularExponent="26" lighting-color="#fff" result="sp"><feDistantLight azimuth="228" elevation="52"/></feSpecularLighting>'
  + '<feComposite in="sp" in2="SourceAlpha" operator="in" result="sp2"/>'
  + '<feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="7" result="n"/>'
  + '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 .15  0 0 0 .32 -.12" result="n2"/>'
  + '<feComposite in="n2" in2="SourceAlpha" operator="in" result="n3"/>'
  + '<feMerge><feMergeNode in="lit"/><feMergeNode in="n3"/><feMergeNode in="sp2"/></feMerge></filter></defs>';
function petDetail(svg) {
  if (!svg || typeof svg !== 'string') return svg;
  /* shine in every dark round eye: a big spark and a tiny one */
  const eyes = svg.replace(/<circle cx="(-?[\d.]+)" cy="(-?[\d.]+)" r="([\d.]+)" fill="#(?:[0-3][0-9A-Fa-f]){3}"\s*\/>/g, (all, x, y, r) => {
    const R = +r; if (R < 1.4 || R > 4.6) return all;
    return all + `<circle cx="${(+x + R * .36).toFixed(2)}" cy="${(+y - R * .36).toFixed(2)}" r="${(R * .36).toFixed(2)}" fill="#fff"/><circle cx="${(+x - R * .34).toFixed(2)}" cy="${(+y + R * .4).toFixed(2)}" r="${(R * .16).toFixed(2)}" fill="#fff" opacity=".75"/>`;
  });
  return `${PET_FILTER}<g class="pet-lit" filter="url(#qpd)">${eyes}</g>`;
}
HOOK.filter('petBase', (svg, p) => petDetail(svg));
