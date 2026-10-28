/* npm run author: add questions without editing JavaScript lists.
     npm run author -- template          writes tools/questions-template.csv (the columns, with two example rows)
     npm run author -- form              writes tools/author.html: a form you open by double-clicking (it works offline).
                                         It checks each question as you type and downloads a CSV.
     npm run author -- import file.csv   checks every row (the same checks as npm run check and npm run lint:bank, plus a
                                         look for questions that already exist) and, when nothing is wrong, adds the rows
                                         to src/content/more/added.js. Add --dry to only check. Add --strict-ms to also stop
                                         for Malay lines that need a native speaker.
   CSV columns: subject, level, topic, emoji, question_en, answer_en, wrong1_en, wrong2_en, wrong3_en, question_ms, answer_ms,
   wrong1_ms, wrong2_ms, wrong3_ms. level is 1 (easier), 2 or 3 (harder). topic must be one of the topics shown in the form. */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadGame } from './harness.mjs';
import { parseCSV, malayCheck, loadReviewed } from './lint-bank.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ADDED = new URL('../src/content/more/added.js', import.meta.url);
export const COLS = ['subject', 'level', 'topic', 'emoji', 'question_en', 'answer_en', 'wrong1_en', 'wrong2_en', 'wrong3_en', 'question_ms', 'answer_ms', 'wrong1_ms', 'wrong2_ms', 'wrong3_ms'];
const norm = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim().replace(/[.,!?'"…:;]+/g, '').replace(/\s+/g, ' ').trim();
const cell = (s) => '"' + String(s ?? '').replace(/"/g, '""') + '"';
export const toCSV = (rows) => [COLS.join(',')].concat(rows.map((r) => COLS.map((c) => cell(r[c])).join(','))).join('\n') + '\n';

/* the facts the checks need: subjects, their topics, and every question that exists */
export async function knowledge() {
  const { game: G } = await loadGame({ lang: 'en', band: 3 });
  const J = (c) => JSON.parse(G.ev(`JSON.stringify(${c})`));
  const subjects = J('SUBJ_ORDER'), topics = J('BTOP'), names = J(`(() => { const o = {}; for (const s of SUBJ_ORDER) o[s] = BTOP[s].map(k => [k, STR['tp.' + s + '_' + k] ? STR['tp.' + s + '_' + k][0] : k]); o.__subj = Object.fromEntries(SUBJ_ORDER.map(s => [s, STR['subj.' + s] ? STR['subj.' + s][0] : s])); return o; })()`);
  const existing = { en: {}, ms: {} };
  for (const s of Object.keys(G.BANK)) for (const b of Object.keys(G.BANK[s])) G.BANK[s][b].forEach((r, i) => { existing.en[norm(r.q[0])] = `${s} level ${b} #${i + 1}`; if (r.q[1]) existing.ms[norm(r.q[1])] = `${s} level ${b} #${i + 1}`; });
  return { subjects, topics, names, existing };
}

/* check rows; returns { errors: [[row number, text]], warns: [...], rows: [clean rows] } */
export function checkRows(rows, K, reviewed = loadReviewed()) {
  const errors = [], warns = [], clean = [], seenEn = new Map(), seenMs = new Map();
  rows.forEach((raw, i) => {
    const n = i + 2, E = (m) => errors.push([n, m]), W = (m) => warns.push([n, m]);
    const r = {}; for (const c of COLS) r[c] = String(raw[c] ?? '').replace(/\s+/g, ' ').trim();
    const need = ['subject', 'level', 'topic', 'question_en', 'answer_en', 'wrong1_en', 'wrong2_en', 'wrong3_en', 'question_ms', 'answer_ms', 'wrong1_ms', 'wrong2_ms', 'wrong3_ms'];
    const gaps = need.filter((c) => !r[c]); if (gaps.length) { E('missing: ' + gaps.join(', ')); return; }
    if (!K.subjects.includes(r.subject)) { E(`subject "${r.subject}" is not one of: ${K.subjects.join(', ')}`); return; }
    if (!['1', '2', '3'].includes(r.level)) E(`level must be 1, 2 or 3 (not "${r.level}")`);
    if (!(K.topics[r.subject] || []).includes(r.topic)) E(`topic "${r.topic}" is not a topic of ${r.subject}. Topics: ${(K.topics[r.subject] || []).join(', ')}`);
    for (const lang of ['en', 'ms']) {
      const L = lang.toUpperCase(), ans = r['answer_' + lang], ws = [1, 2, 3].map((k) => r[`wrong${k}_${lang}`]), all = [ans, ...ws].map(norm);
      if (new Set(all).size !== all.length) E(`${L}: the answer and the three wrong answers must all be different`);
      if (r['question_' + lang].length < 8) E(`${L}: the question is very short`);
      if (!/[?:.…!)]$/.test(r['question_' + lang]) && !/___/.test(r['question_' + lang])) W(`${L}: the question does not end with ? or a full stop`);
    }
    const ke = norm(r.question_en), km = norm(r.question_ms);
    if (K.existing.en[ke]) E(`this English question already exists (${K.existing.en[ke]})`);
    else if (seenEn.has(ke)) E(`this English question is already on row ${seenEn.get(ke)}`);
    if (K.existing.ms[km]) E(`this Malay question already exists (${K.existing.ms[km]})`);
    else if (seenMs.has(km)) E(`this Malay question is already on row ${seenMs.get(km)}`);
    seenEn.set(ke, n); seenMs.set(km, n);
    const pairs = [['question', r.question_en, r.question_ms], ['answer', r.answer_en, r.answer_ms], ...[1, 2, 3].map((k) => ['wrong ' + k, r[`wrong${k}_en`], r[`wrong${k}_ms`]])];
    for (const [kind, en, ms] of pairs) { if (reviewed.has(norm(en))) continue; (malayCheck(en, ms, kind === 'question' ? 'question' : kind === 'answer' ? 'answer' : 'wrong', r.subject) || []).forEach((why) => W(`Malay ${kind}: ${why} ("${en.slice(0, 40)}")`)); }
    clean.push(r);
  });
  return { errors, warns, rows: clean };
}

/* the rows already in added.js (so import adds to them) */
export async function readAdded() {
  const out = [];
  const mod = await import(pathToFileURL(fileURLToPath(ADDED)).href + '?t=' + Date.now());
  mod.default((subj, level, list) => list.forEach((r) => out.push({ subject: subj, level: String(level), topic: r[0], emoji: r[1], question_en: r[2], answer_en: r[3], wrong1_en: r[4][0], wrong2_en: r[4][1], wrong3_en: r[4][2], question_ms: r[5], answer_ms: r[6], wrong1_ms: r[7][0], wrong2_ms: r[7][1], wrong3_ms: r[7][2] })));
  return out;
}
export function writeAdded(rows) {
  const by = {}; rows.forEach((r) => { (by[r.subject + '|' + r.level] = by[r.subject + '|' + r.level] || []).push(r); });
  const blocks = Object.keys(by).sort().map((k) => { const [s, l] = k.split('|'); return `  f(${JSON.stringify(s)}, ${l}, [\n${by[k].map((r) => '    ' + JSON.stringify([r.topic, r.emoji || '❓', r.question_en, r.answer_en, [r.wrong1_en, r.wrong2_en, r.wrong3_en], r.question_ms, r.answer_ms, [r.wrong1_ms, r.wrong2_ms, r.wrong3_ms]])).join(',\n')}\n  ]);`; });
  writeFileSync(ADDED, `/* Questions added with the authoring tool (npm run author). Do not edit by hand: change the CSV and import it again.
   Row format is the same as the other files in this folder (see sc.js): [topic, emoji, question EN, answer EN, [3 wrong EN], question MS, answer MS, [3 wrong MS]]. */
export default function (f) {
${blocks.join('\n')}
}
`);
}

async function main() {
  const [cmd, file] = process.argv.slice(2), flags = new Set(process.argv.slice(2).filter((a) => a.startsWith('--')));
  if (cmd === 'template') {
    mkdirSync(new URL('../tools/', import.meta.url), { recursive: true });
    const K0 = await knowledge();
    const ex = [{ subject: 'sc', level: '1', topic: 'haiwan', emoji: '🐘', question_en: 'Which animal has a long trunk?', answer_en: 'Elephant', wrong1_en: 'Cat', wrong2_en: 'Fish', wrong3_en: 'Bird', question_ms: 'Haiwan manakah ada belalai panjang?', answer_ms: 'Gajah', wrong1_ms: 'Kucing', wrong2_ms: 'Ikan', wrong3_ms: 'Burung' }];
    writeFileSync(new URL('../tools/questions-template.csv', import.meta.url), toCSV(ex));
    console.log('Wrote tools/questions-template.csv (one example row). The topic names for each subject are listed in the form: npm run author -- form.'); return;
  }
  if (cmd === 'form') {
    const K = await knowledge();
    const tpl = readFileSync(new URL('../tools/author.template.html', import.meta.url), 'utf8');
    const data = { subjects: K.subjects, names: K.names, existing: K.existing };
    writeFileSync(new URL('../tools/author.html', import.meta.url), tpl.replace('/*DATA*/null', JSON.stringify(data).replace(/</g, '\\u003c')));
    console.log(`Wrote tools/author.html (${Object.keys(K.existing.en).length} existing questions known). Open it in a browser.`); return;
  }
  if (cmd === 'import') {
    if (!file || !existsSync(file)) { console.error('Usage: npm run author -- import questions.csv [--dry] [--strict-ms]'); process.exit(2); }
    const table = parseCSV(readFileSync(file, 'utf8')).filter((r) => r.some((c) => c.trim()));
    const head = table[0].map((h) => h.trim().toLowerCase());
    const miss = COLS.filter((c) => !head.includes(c)); if (miss.length) { console.error('The CSV is missing the column(s): ' + miss.join(', ')); process.exit(2); }
    const rows = table.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
    const K = await knowledge(), res = checkRows(rows, K);
    res.errors.forEach(([n, m]) => console.log(`ERROR row ${n}: ${m}`));
    res.warns.forEach(([n, m]) => console.log(`  note row ${n}: ${m}`));
    console.log(`\n${rows.length} row(s): ${res.errors.length} error(s), ${res.warns.length} note(s).`);
    if (res.errors.length) { console.log('Nothing was added. Fix the rows above and run it again.'); process.exit(1); }
    if (flags.has('--strict-ms') && res.warns.some(([, m]) => m.startsWith('Malay'))) { console.log('Stopped: some Malay lines need a native speaker (--strict-ms).'); process.exit(1); }
    if (flags.has('--dry')) { console.log('Dry run: nothing was written.'); return; }
    const old = await readAdded(), all = old.concat(res.rows);
    writeAdded(all); console.log(`Added ${res.rows.length} row(s) to src/content/more/added.js (${all.length} in total). Now run: npm run check && npm test`); return;
  }
  console.log('Usage: npm run author -- template | form | import file.csv [--dry] [--strict-ms]');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
