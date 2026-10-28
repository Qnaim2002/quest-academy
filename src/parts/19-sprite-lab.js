/* ================= v21: Sprite Lab (visual QA page) =================
   Open the game with ?lab (for example http://localhost:5173/?lab) to see every sprite with all 6 frames
   (0-3 idle, 4 hurt, 5 attack): the 1000 level monsters (filter by subject, species and tier), the 10 zone
   bosses in each colour scheme, the 5 knights and every Armory item, and the story villains. Sprites are
   drawn by the sprite worker as they scroll into view. Nothing here touches a child's save. */
function startSpriteLab() {
  document.title = 'Sprite Lab · Quest Academy';
  const css = `body{margin:0;background:#15112A;color:#EDE6FF;font:14px/1.4 system-ui,sans-serif}
  .app,.nav{display:none!important}.lab{padding:12px 16px 40px}.lab h1{font:700 20px/1.2 system-ui;margin:4px 0 10px}
  .lab .labbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px;position:sticky;top:0;background:#15112A;padding:8px 0;z-index:2}
  .lab button,.lab select{font:600 13px system-ui;border:1px solid #4A3F7A;background:#241D45;color:#EDE6FF;border-radius:8px;padding:6px 10px;min-height:34px}
  .lab button[aria-pressed=true]{background:#7C5CFF;border-color:#A58BFF}
  .lab .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:10px}
  .lab .cell{background:var(--cb,#211A3E);border:1px solid #362C63;border-radius:10px;padding:8px}
  .lab .cell b{font-size:13px}.lab .cell small{display:block;color:#B5A9E0;font-size:11px;margin-bottom:6px}
  .lab .frames{display:grid;grid-template-columns:repeat(6,1fr);gap:4px}
  .lab .fr{aspect-ratio:1;background-repeat:no-repeat;background-size:600% 100%;image-rendering:pixelated;border-radius:4px;background-color:rgba(255,255,255,.04)}
  .lab .fl{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;font-size:10px;color:#8D82BA;text-align:center;margin-top:2px}
  .lab .stat{margin-left:auto;color:#B5A9E0;font-size:12px}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const root = document.createElement('div'); root.className = 'lab'; document.body.appendChild(root);
  const L = { tab: 'monsters', subj: 'all', sp: 'all', tier: 'all', bg: 'dark', drawn: 0, ms: 0 };
  const SPN = ['slime', 'goblin', 'mushroom', 'wraith', 'golem', 'gargoyle', 'crystal', 'troll', 'drake', 'shadow', ...Object.values(MALT), ...Object.values(MALT2), ...Object.values(MALT3), ...Object.values(MALT4), ...Object.values(MALT5), ...Object.values(MALT6)];
  const speciesOf = m => m.big ? 'boss' : (m.sp || MON2.BODY[m.b]);
  const bgCol = () => ({ dark: '#211A3E', light: '#F1E9DA', grass: '#7FB069' }[L.bg]);
  function items() {
    if (L.tab === 'monsters') {
      const out = [];
      for (const s of SUBJ_ORDER) if (L.subj === 'all' || L.subj === s) for (let n = 1; n <= LEVELS_PER; n++) {
        const m = monsterFor(s, n), tier = m.big ? 'big' : m.boss ? 'mini' : 'normal';
        if (L.tier !== 'all' && L.tier !== tier) continue;
        if (L.sp !== 'all' && L.sp !== speciesOf(m)) continue;
        out.push({ kind: 'mon', arg: m, title: `${s}:${n} · ${m.n}`, sub: `${speciesOf(m)}${m.big ? ' #' + m.arch + ' ' + BEAST.names[m.arch] : ''} · ${tier} · body ${m.b} · colour ${m.c} · eyes ${m.e} · ${m.m} · ${m.f.join(', ') || 'no features'}` });
      }
      return out;
    }
    if (L.tab === 'bosses') return BEAST.names.flatMap((nm, i) => [0, 1, 2, 3, 4, 5].map(c => ({ kind: 'mon', arg: { n: 'lab-boss-' + i + '-' + c, b: 'blob', c, e: 'two', m: 'teeth', f: [], t: 0, boss: 1, big: true, arch: i % 10, form: i >= 10 ? 1 : 0 }, title: `${nm} · scheme ${c}`, sub: `zone boss archetype ${i % 10}${i >= 10 ? ' (elder)' : ''}` })));
    if (L.tab === 'knights') {
      const base = { ...DEFAULT_EQUIP }, out = ITEMS.filter(i => i.slot === 'knight').map(k => ({ kind: 'hero', arg: { ...base, knight: k.id }, title: k.en, sub: k.id }));
      ['weapon', 'shield', 'cape', 'aura'].forEach(slot => ITEMS.filter(i => i.slot === slot).forEach(it => out.push({ kind: 'hero', arg: { ...base, [slot]: it.id }, title: `${it.en}`, sub: `${slot} · ${it.id}` })));
      return out;
    }
    return ['puff', 'momo', 'murk', 'glitch', 'demon'].flatMap(v => [0, 1].map(sad => ({ kind: 'villain', v, sad, title: v + (sad ? ' (sad)' : ''), sub: 'story villain (4 frames)' })));
  }
  const chip = (act, v, cur, label) => `<button data-lab="${act}" data-v="${v}" aria-pressed="${cur === v}">${label}</button>`;
  function render() {
    const list = items();
    root.innerHTML = `<h1>🧪 Sprite Lab</h1><div class="labbar">
      ${chip('tab', 'monsters', L.tab, 'Monsters')}${chip('tab', 'bosses', L.tab, 'Zone bosses')}${chip('tab', 'knights', L.tab, 'Knights & gear')}${chip('tab', 'villains', L.tab, 'Villains')}
      ${L.tab === 'monsters' ? `<select data-lab="subj"><option value="all">All subjects</option>${SUBJ_ORDER.map(s => `<option ${L.subj === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <select data-lab="sp"><option value="all">All species</option>${SPN.concat('boss').map(s => `<option ${L.sp === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <select data-lab="tier">${['all', 'normal', 'mini', 'big'].map(s => `<option ${L.tier === s ? 'selected' : ''}>${s}</option>`).join('')}</select>` : ''}
      ${chip('q', 'high', PX.Q.tier, 'Full quality')}${chip('q', 'lite', PX.Q.tier, 'Lite quality')}
      ${chip('bg', 'dark', L.bg, 'Dark')}${chip('bg', 'light', L.bg, 'Light')}${chip('bg', 'grass', L.bg, 'Grass')}
      <span class="stat" id="labStat">${list.length} sprites</span></div>
      <div class="grid">${list.map((it, i) => `<div class="cell" style="--cb:${bgCol()}" data-i="${i}"><b>${esc(it.title)}</b><small>${esc(it.sub)}</small><div class="frames">${[0, 1, 2, 3, 4, 5].map(f => `<div class="fr" data-f="${f}"></div>`).join('')}</div><div class="fl"><span>idle 1</span><span>idle 2</span><span>idle 3</span><span>idle 4</span><span>hurt</span><span>attack</span></div></div>`).join('')}</div>`;
    const cells = [...root.querySelectorAll('.cell')], io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); draw(e.target, list[+e.target.dataset.i]); } }), { rootMargin: '400px' });
    cells.forEach(c => io.observe(c));
  }
  async function draw(cell, it) {
    const t0 = performance.now(); let url = null, frames = 6;
    if (it.kind === 'villain') { const m = PXV.svg(it.v, it.sad).match(/href="([^"]+)"/); url = m && m[1]; frames = 4; }
    else url = (await SPRW.ask(it.kind, it.arg)) || (() => { const [k, recipe] = PX.job[it.kind](it.arg); return PX.kit.memo(k, () => PX.kit.sheet(...recipe())); })();
    L.drawn++; L.ms += performance.now() - t0;
    cell.querySelectorAll('.fr').forEach(fr => { const f = +fr.dataset.f; if (f >= frames) { fr.style.opacity = .15; return; } fr.style.backgroundImage = `url(${url})`; fr.style.backgroundSize = `${frames * 100}% 100%`; fr.style.backgroundPosition = `${frames > 1 ? f / (frames - 1) * 100 : 0}% 0`; });
    const s = document.getElementById('labStat'); if (s) s.textContent = `${items().length} sprites · ${L.drawn} drawn · avg ${Math.round(L.ms / L.drawn)} ms · ${SPRW.able() ? 'worker' : 'main thread'} · ${PX.Q.tier}`;
  }
  root.addEventListener('click', e => {
    const b = e.target.closest('button[data-lab]'); if (!b) return;
    const k = b.dataset.lab, v = b.dataset.v;
    if (k === 'tab') L.tab = v; if (k === 'bg') L.bg = v;
    if (k === 'q') { PX.Q.tier = v; PX.clear(); }
    L.drawn = 0; L.ms = 0; render();
  });
  root.addEventListener('change', e => { const s = e.target.closest('select[data-lab]'); if (!s) return; L[s.dataset.lab] = s.value; L.drawn = 0; L.ms = 0; render(); });
  render();
}
