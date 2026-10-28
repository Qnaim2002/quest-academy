/* Tests for v37: the simple home (Learn / Play / Hero / Cards, a lock button for grown-ups, Learn in three steps, Play with three big buttons). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadGame } from '../scripts/harness.mjs';

const EN = (await loadGame({ lang: 'en', band: 2 })).game;
const AGE4 = (await loadGame({ lang: 'en', band: 1 })).game;
const MS = (await loadGame({ lang: 'ms', band: 2 })).game;
const J = (G, code) => JSON.parse(G.ev(`JSON.stringify(${code})`));
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('index.html: five visible bottom buttons, the old ones hidden but still there, a lock button and a Play tab', () => {
  const nav = html.slice(html.indexOf('<nav class="nav"'), html.indexOf('</nav>'));
  const btns = [...nav.matchAll(/<button [^>]*id="nav-(\w+)"[^>]*>/g)].map(m => [m[1], /\bhidden\b/.test(m[0])]);
  assert.deepEqual(btns.filter(b => !b[1]).map(b => b[0]), ['studies', 'play', 'armory', 'cards', 'settings']);
  assert.deepEqual(btns.filter(b => b[1]).map(b => b[0]).sort(), ['adventure', 'kbat', 'parent', 'tower']);
  assert.ok(html.includes('id="tab-play"') && html.includes('id="v37Lock"') && html.includes('id="v37Sub"'));
  for (const id of ['studies', 'armory', 'adventure', 'cards', 'tower', 'kbat', 'parent']) assert.ok(html.includes(`id="tab-${id}"`), id);
});

test('texts: every v37 text exists in English and Malay', () => {
  for (const G of [EN, MS]) {
    const keys = J(G, `Object.keys(STR).filter(k => k.startsWith('v37.'))`);
    assert.ok(keys.length >= 15);
    for (const k of keys) { const v = J(G, `STR[${JSON.stringify(k)}]`); assert.ok(Array.isArray(v) && v[0] && v[1], k); }
  }
  assert.equal(J(EN, `t('nav.studies')`), 'Learn'); assert.equal(J(MS, `t('nav.studies')`), 'Belajar');
});

test('Learn step 1: open subjects, tracing and games; four tiles on a page; tracing first for age 4', () => {
  const r = J(EN, `(() => { const x = v37Tiles(); return { n: x.length, acts: x.map(a => a.act), per: V37_PER }; })()`);
  assert.equal(r.per, 4);
  assert.ok(r.n >= 12); assert.equal(r.acts[r.acts.length - 1], 'v37Games');
  assert.equal(r.acts.filter(a => a === 'v37Subj').length, 10);
  assert.equal(J(AGE4, `v37Tiles()[0].act`), 'traceOpen');
});

test('Learn step 2: every subject lists lessons for the age, in ladder order, and the first open lesson is the next one', () => {
  const r = J(EN, `(() => SUBJECTS.map(([id]) => { const l = v37Lessons(id); return { id, n: l.length, nx: v37Next(l), firstOpen: l.length ? l[0].open : true }; }))()`);
  assert.equal(r.length, 10);
  for (const s of r) { assert.ok(s.n > 0, s.id + ' has lessons'); assert.ok(s.nx >= 0, s.id + ' has a next lesson'); assert.equal(s.firstOpen, true); }
});

test('Learn: the pages show the right things (no age buttons, no pop-up list), and lesson locks are respected', () => {
  const h = J(EN, `(() => { UI.v37 = null; const a = v37HTML(); const v = v37(); v.step = 'lessons'; v.subj = 'math'; v.lp = 0; const b = v37HTML(); v.step = 'ready'; v.lesson = v37Lessons('math')[0].m.id; const c = v37HTML(); v.step = 'games'; const d = v37HTML(); UI.v37 = null; return { a, b, c, d }; })()`);
  assert.match(h.a, /v37-big/); assert.ok(!/data-act="sage"/.test(h.a + h.b + h.c + h.d));
  assert.match(h.b, /v37-lesson/); assert.match(h.b, /data-act="v37Lesson"/);
  assert.match(h.c, /data-act="open"/); assert.match(h.c, /v37-go/);
  assert.match(h.d, /data-act="actOpen"/);
});

test('Play: three big buttons and the tab switch names', () => {
  assert.equal(J(EN, `[v37Key('adventure'), v37Key('tower'), v37Key('kbat')]`).join(), 'battle,tower,think');
  assert.equal(J(EN, `V37_PLAY`).join(), 'adventure,tower,kbat');
});

test('the home screen is Learn, and the old tabs still work', () => {
  assert.equal(J(EN, `UI.tab`), 'studies');
  const src = fs.readFileSync(new URL('../src/parts/18-boot.js', import.meta.url), 'utf8');
  assert.match(src, /showTab\('studies', true\)/);
});

test('the style file is imported and keeps the old tabs reachable', () => {
  assert.match(fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8'), /29-v37\.css/);
  const css = fs.readFileSync(new URL('../src/css/29-v37.css', import.meta.url), 'utf8');
  assert.match(css, /\.nav button\[hidden\]/); assert.match(css, /\.v37-lock/); assert.match(css, /\.agebar/);
});
