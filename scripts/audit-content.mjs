/* npm run audit: how much content is there, for every subject and every age (4 to 7)?
   Counts, per subject x age: lessons, bank questions a child of that age can meet, distinct bank topics (and the
   thinnest topic), life-skill situations, and the number of DIFFERENT questions seen in 1500 random battle draws.
   Marks thin cells with "!" (below the targets at the top of this file). Use --write to save AUDIT.md.
   The targets are small on purpose: they are a floor, not a goal.
   v36: a second part, the FORMAT GRID: for every age, which of the 17 question formats really come up in each subject
   (12,000 draws per cell group, share of the non-multiple-choice questions; "-" means never, "!" marks subjects with fewer than 5 formats). */
import { writeFileSync } from 'node:fs';
import { loadGame } from './harness.mjs';

const TARGET = { lessons: 8, bank: 50, topics: 4, perTopic: 5 };
const write = process.argv.includes('--write');
const SUBJ = ['math', 'bm', 'en', 'sc', 'pm', 'pk', 'se', 'fk', 'sv', 'mz'];
const AGE = { 1: 'Age 4', 2: 'Age 5', 3: 'Age 6', 4: 'Age 7' };
const cell = {}, grid = {};
for (const band of [1, 2, 3, 4]) {
  const { game: G } = await loadGame({ lang: 'en', band });
  const J = (c) => JSON.parse(G.ev(`JSON.stringify(${c})`));
  const r = J(`(() => {
    const out = {};
    for (const s of ${JSON.stringify(SUBJ)}) {
      const banks = BANK_FOR_AGE[${band}], rows = banks.flatMap(b => (BANK[s] && BANK[s][b]) || []);
      const topics = {}; rows.forEach(r => { topics[r.topic] = (topics[r.topic] || 0) + 1; });
      const lessons = MODULES.filter(m => m.subject === s && m.bands.includes(${band})).length;
      const keys = new Set(); let draws = 0, fails = 0;
      S.band = ${band}; B.seen = new Set();
      for (let i = 0; i < 1500; i++) {
        try { const n = 1 + (i * 7) % 100, lv = levelOf(s, n), q = makeQ(lv.pool[i % lv.pool.length], ${band}, lv); if (q && q.key) keys.add(q.key); draws++; } catch (e) { fails++; }
      }
      out[s] = { lessons, bank: rows.length, gen: rows.filter(r => r.gen).length, topics: Object.keys(topics).length, thin: Math.min(...Object.values(topics), 99), thinName: Object.entries(topics).sort((a, b) => a[1] - b[1])[0]?.[0] || '', variety: keys.size, fails };
    }
    return out;
  })()`);
  cell[band] = r;
  grid[band] = J(`(() => {
    const out = {}, N = 1200;
    for (const s of ${JSON.stringify(SUBJ)}) {
      const c = {}; let mc = 0, facts = 0, tot = 0;
      for (let i = 0; i < N; i++) {
        let q = null; try { q = QT.pickFor({ subj: s, boss: i % 9 === 0 }, ${band}); } catch (e) { q = null; }
        tot++; if (!q) { mc++; continue; }
        const k = q.type === 'life' ? 'pic' : /_sent$/.test(q.topic || '') ? 'sent' : /_memory$/.test(q.topic || '') || q.mem ? 'memory' : (q.type || q.kind); c[k] = (c[k] || 0) + 1; if (/^fact:/.test(q.key || '')) facts++;
      }
      out[s] = { c, mc, facts, tot };
    }
    return out;
  })()`);
}
const flag = (v, t) => (v < t ? '!' : '');
const lines = [];
lines.push('# Quest Academy content audit', '', `Targets (a floor): lessons >= ${TARGET.lessons}, bank questions >= ${TARGET.bank}, bank topics >= ${TARGET.topics}, questions per topic >= ${TARGET.perTopic}, the draws should reach at least 80% of the bank questions. "!" marks a cell below target.`, '');
let thin = 0;
for (const s of SUBJ) {
  lines.push(`## ${s}`, '', '| Age | Lessons | Bank questions | Topics | Thinnest topic | Different questions (of 1500 draws) | Draw errors |', '|---|---|---|---|---|---|---|');
  for (const b of [1, 2, 3, 4]) {
    const c = cell[b][s];
    const fl = [flag(c.lessons, TARGET.lessons), flag(c.bank, TARGET.bank), flag(c.topics, TARGET.topics), flag(c.thin, TARGET.perTopic), flag(c.variety, Math.floor(c.bank * 0.8))];
    thin += fl.filter(Boolean).length;
    lines.push(`| ${AGE[b]} | ${c.lessons}${fl[0]} | ${c.bank}${fl[1]} (${c.gen} made by code) | ${c.topics}${fl[2]} | ${c.thinName} = ${c.thin}${fl[3]} | ${c.variety}${fl[4]} | ${c.fails} |`);
  }
  lines.push('');
}
lines.push(`Thin cells: ${thin}`, '');
/* ---- v36: which formats really appear where ---- */
const FORMATS = ['tf', 'odd', 'match', 'order', 'numline', 'fill', 'bucket', 'sent', 'spot', 'clock', 'money', 'picword', 'twostep', 'memory', 'hotspot', 'draw', 'rhythm'];
lines.push('# Format coverage', '', `The ${FORMATS.length} question formats other than plain multiple choice. Each cell is the share of that subject's non-multiple-choice questions (many draws per age, bosses included). "-" = never appears. "!" after a subject = fewer than 5 formats. "pic" (tap a picture from a fact table) and "mcq" are extra columns; "facts" = share that came from the fact tables.`, '');
let narrow = 0;
for (const b of [1, 2, 3, 4]) {
  lines.push(`## ${AGE[b]}`, '', `| Subject | ${FORMATS.join(' | ')} | pic | non-MCQ share | facts |`, `|---|${FORMATS.map(() => '---').join('|')}|---|---|---|`);
  for (const s of SUBJ) {
    const g = grid[b][s], n = g.tot - g.mc, seen = FORMATS.filter(f => g.c[f]).length, fl = seen < 5 ? '!' : ''; narrow += fl ? 1 : 0;
    const pc = f => (g.c[f] ? Math.max(1, Math.round(100 * g.c[f] / Math.max(1, n))) + '%' : '-');
    lines.push(`| ${s}${fl} (${seen}) | ${FORMATS.map(pc).join(' | ')} | ${pc('pic')} | ${Math.round(100 * n / g.tot)}% | ${n ? Math.round(100 * g.facts / n) + '%' : '-'} |`);
  }
  lines.push('');
}
lines.push(`Subjects with fewer than 5 formats: ${narrow}`);
const text = lines.join('\n');
console.log(text);
if (write) writeFileSync(new URL('../AUDIT.md', import.meta.url), text + '\n');
