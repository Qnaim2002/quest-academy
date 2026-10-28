/* npm run lint:bank — v31: a linter for the question banks (src/content/<subject>.js and the generated families).
   It looks at every row exactly as written (not only at a question built from it) and reports:
     ERROR  missing Bahasa Melayu text (question, answer, or the wrong answers when English has them)
            English and Malay lists of wrong answers that are not the same length
            the same wrong answer twice in a row (extra spaces do not count as a difference; capital letters do)
            the answer also listed as a wrong answer
            an empty wrong answer
            a row that cannot be shown with 4 different choices
     WARN   Malay text that is the English text copied over, extra spaces, wrong answers left in English inside the
            Malay list while the answer itself was translated
   v34 Malay QA (needs a person): the same text in English and Malay, English words left in Malay text, numbers that
   differ between the two languages, very different lengths, and a missing ? or ! are listed as "needs a native-speaker look".
   They never fail the build. `npm run lint:bank -- --review` writes MALAY-REVIEW.csv for a native speaker to mark;
   `npm run lint:bank -- --approve MALAY-REVIEW.csv` adds the rows marked "ok" to src/content/ms-reviewed.txt so they are not
   listed again. The screen texts (STR) are checked the same way, plus {placeholders} that do not match (an ERROR).
   Exit code 1 when there is an ERROR (so it can guard a release). Options: --quiet (totals only), --json. */
import { pathToFileURL } from 'node:url';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { loadGame } from './harness.mjs';

const key = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();   // capital letters DO count: some questions are about them
const looksCopy = (en, ms) => en && ms && en === ms && /[a-z]{3,} [a-z]{3,} [a-z]{3,}/i.test(en);
const spaced = (s) => typeof s === 'string' && (s !== s.trim() || / {2,}/.test(s));

/* returns { errors: [[kind, where, message]], warns: [...] } */
export function lintBank(G) {
  const errors = [], warns = [], E = (k, w, m) => errors.push([k, w, m]), W = (k, w, m) => warns.push([k, w, m]);
  for (const subj of Object.keys(G.BANK)) for (const band of Object.keys(G.BANK[subj])) G.BANK[subj][band].forEach((r, i) => {
    const where = `${subj} bank ${band} #${i + 1}${r.gen ? ' (generated)' : ''}: "${String(r.q[0]).slice(0, 60)}"`;
    if (!r.q[1] || !String(r.q[1]).trim()) E('missing-bm', where, 'no Malay question');
    if (r.a[1] === undefined || r.a[1] === null || !String(r.a[1]).trim()) E('missing-bm', where, 'no Malay answer');
    if (r.w && r.w[0] && (!r.w[1] || !r.w[1].length)) E('missing-bm', where, 'English wrong answers but no Malay ones');
    if (r.w && r.w[0] && r.w[1] && r.w[0].length !== r.w[1].length) E('bm-length', where, `${r.w[0].length} English wrong answers but ${r.w[1].length} Malay ones`);
    for (let li = 0; li < 2; li++) {
      const L = li ? 'BM' : 'EN', ans = r.a[li], w = r.w && r.w[li] ? r.w[li] : [];
      if (spaced(r.q[li]) || spaced(ans)) W('spaces', where, `extra spaces (${L})`);
      w.forEach((x) => { if (!String(x ?? '').trim()) E('empty-wrong', where, `an empty wrong answer (${L})`); else if (spaced(x)) W('spaces', where, `extra spaces in "${x}" (${L})`); });
      const ks = w.map(key);
      const dup = ks.filter((k, j) => k && ks.indexOf(k) !== j);
      if (dup.length) E('duplicate-wrong', where, `wrong answer listed twice: "${w[ks.indexOf(dup[0])]}" (${L})`);
      if (ks.includes(key(ans))) E('answer-is-wrong', where, `the answer "${ans}" is also a wrong answer (${L})`);
    }
    if (looksCopy(r.q[0], r.q[1])) W('bm-copy', where, 'the Malay question is the English text');
    if (r.w && r.w[0] && r.w[1] && key(r.a[0]) !== key(r.a[1])) {
      const same = r.w[1].filter((x, j) => key(x).toLowerCase() === key(r.w[0][j]).toLowerCase() && /[a-z]{4,}/i.test(x) && !/^[A-Z][a-z]+$/.test(x));
      if (same.length >= 2) W('bm-untranslated', where, `Malay wrong answers look English: ${same.slice(0, 3).join(', ')}`);
    }
    /* the row as a child sees it: 4 different choices with the answer among them, in both languages */
    for (const lang of ['en', 'ms']) {
      G.setLang(lang);
      let q; try { q = G.bankQ(subj, +band, null, new Set([r])); } catch (e) { E('build-failed', where, e.message); continue; }
      const o = q.options.map(String);
      if (o.length < 4 || new Set(o.map(key)).size !== o.length || o[q.correct] !== String(q.ansText)) E('not-4-choices', where, `${lang.toUpperCase()} choices: ${o.join(' | ')}`);
    }
    G.setLang('en');
  });
  return { errors, warns };
}

/* ---------------- v34: automated Malay translation QA ---------------- */
const REVIEWED_FILE = new URL('../src/content/ms-reviewed.txt', import.meta.url);
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
export const loadReviewed = () => new Set(existsSync(REVIEWED_FILE) ? readFileSync(REVIEWED_FILE, 'utf8').split('\n').map((l) => norm(l)).filter((l) => l && !l.startsWith('#')) : []);
/* words that are written the same in both languages (loan words, names, units): not worth a person's time */
const SAME_OK = new Set(['radio', 'bus', 'taxi', 'robot', 'tv', 'video', 'internet', 'ok', 'hotel', 'zoo', 'panda', 'tiger', 'kiwi', 'mama', 'papa', 'ice cream', 'pizza', 'spaghetti', 'sushi', 'teksi', 'lori', 'motor', 'wifi', 'email', 'komputer', 'jam', 'bank', 'pos', 'polis', 'doktor', 'pilot', 'menu', 'gas', 'plastik', 'metal', 'oren', 'tulip', 'hobi', 'ski', 'drum', 'gitar', 'piano', 'violin', 'sirkus', 'filem', 'tema', 'ayam', 'lava', 'virus', 'bakteria', 'protein', 'vitamin']);
const EN_STOP = new Set(['the', 'and', 'which', 'what', 'how', 'is', 'are', 'of', 'to', 'you', 'your', 'with', 'many', 'from', 'does', 'this', 'that', 'there', 'they', 'when', 'where', 'who', 'why', 'should', 'would', 'can', 'will']);
const properName = (s) => /^[A-Z][\p{L}'’.-]*( [A-Z][\p{L}'’.-]*){0,3}$/u.test(String(s).trim());
const nothingToTranslate = (s) => !/[A-Za-z]{3,}/.test(String(s ?? '').replace(/\{[^}]*\}/g, ''));
const nums = (s) => (String(s).match(/\d+/g) || []).sort().join(',');
/* [reason, english, malay] for one pair of texts, or null */
export function malayCheck(en, ms, kind = 'text', subj = '') {
  const e = String(en ?? ''), m = String(ms ?? '');
  if (!e.trim() || !m.trim()) return null;
  const out = [];
  /* the Bahasa Melayu subject answers in Malay and the English subject answers in English, so a choice that is the same in both is right there */
  const sameOK = (subj === 'bm' || subj === 'en') && kind !== 'question';
  if (norm(e) === norm(m) && !nothingToTranslate(e) && !SAME_OK.has(norm(e)) && !properName(e) && !sameOK) out.push('same text in English and Malay');
  else if (norm(e) !== norm(m)) {
    const words = norm(m).replace(/[^a-z\s'’-]/g, ' ').split(/\s+/).filter(Boolean), hit = [...new Set(words.filter((w) => EN_STOP.has(w)))];
    if (subj !== 'en' && (hit.length >= 2 || (hit.length === 1 && words.length <= 4))) out.push('English words in the Malay text: ' + hit.slice(0, 4).join(', '));
    if (kind === 'question' || kind === 'answer') {
      const ne = (e.match(/\d+/g) || []), nm = (m.match(/\d+/g) || []);
      if (nm.some((x) => !ne.includes(x))) out.push(`the Malay text has a number the English text does not (${nm.filter((x) => !ne.includes(x)).join(', ')})`);
    }
    if (kind === 'question' && e.length > 25 && (m.length < e.length * .4 || m.length > e.length * 2.4)) out.push('very different length');
    if (kind === 'question' && /\?/.test(e) && !/\?/.test(m) && !/(…|\.\.\.)\s*$/.test(m.trim())) out.push('English asks a question (?), Malay has no ?');
  }
  return out.length ? out : null;
}
/* the whole content: bank rows and screen texts. Returns { errors, items: [{ subj, band, row, field, en, ms, reason }] } */
export function lintMalay(G, reviewed = loadReviewed()) {
  const errors = [], items = [];
  const add = (subj, band, row, field, en, ms, reasons) => { if (!reasons) return; if (reviewed.has(norm(en)) || reviewed.has(norm(subj + '|' + en))) return; reasons.forEach((reason) => items.push({ subj, band, row, field, en: String(en), ms: String(ms), reason })); };
  for (const subj of Object.keys(G.BANK)) for (const band of Object.keys(G.BANK[subj])) G.BANK[subj][band].forEach((r, i) => {
    add(subj, band, i + 1, 'question', r.q[0], r.q[1], malayCheck(r.q[0], r.q[1], 'question', subj));
    add(subj, band, i + 1, 'answer', r.a[0], r.a[1], malayCheck(r.a[0], r.a[1], 'answer', subj));
    (r.w && r.w[0] ? r.w[0] : []).forEach((x, j) => add(subj, band, i + 1, 'wrong ' + (j + 1), x, (r.w[1] || [])[j], malayCheck(x, (r.w[1] || [])[j], 'wrong', subj)));
  });
  for (const [k, v] of Object.entries(G.STR || {})) {
    if (!Array.isArray(v) || typeof v[0] !== 'string') continue;
    const ph = (s) => [...new Set([...String(s ?? '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
    const pe = ph(v[0]), pm = ph(v[1]);
    if (v.length < 2 || !String(v[1] ?? '').trim()) errors.push(['ui-missing-bm', `screen text "${k}"`, 'no Malay text']);
    else if (pm.some((x) => !pe.includes(x))) errors.push(['ui-placeholder', `screen text "${k}"`, `Malay uses {${pm.filter((x) => !pe.includes(x)).join('}, {')}} which the English text does not have`]);
    else if (pe.some((x) => !pm.includes(x) && !/^th[A-Z]/.test(x))) add('ui', '-', k, 'text', v[0], v[1], [`the Malay text leaves out {${pe.filter((x) => !pm.includes(x) && !/^th[A-Z]/.test(x)).join('}, {')}}`]);
    add('ui', '-', k, 'text', v[0], v[1], malayCheck(v[0], v[1], 'text', 'ui'));
  }
  return { errors, items };
}
const csvCell = (s) => '"' + String(s ?? '').replace(/"/g, '""') + '"';
export function reviewCSV(items) { return ['subject,age band,row,field,english,malay,reason,status (write ok, or the better Malay)'].concat(items.map((x) => [x.subj, x.band, x.row, x.field, x.en, x.ms, x.reason, ''].map(csvCell).join(','))).join('\n') + '\n'; }
export function parseCSV(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cur); cur = ''; } else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const quiet = process.argv.includes('--quiet'), json = process.argv.includes('--json');
  const { game: G } = await loadGame({ lang: 'en', band: 3 });
  const argv = process.argv, ai = argv.indexOf('--approve');
  if (ai > 0) {   // a native speaker has marked rows "ok": remember them so they are not listed again
    const file = argv[ai + 1]; if (!file || !existsSync(file)) { console.error('Usage: npm run lint:bank -- --approve MALAY-REVIEW.csv'); process.exit(2); }
    const rowsIn = parseCSV(readFileSync(file, 'utf8')).slice(1).filter((r) => r.length >= 8 && /^ok$/i.test(r[7].trim()));
    const have = loadReviewed(), add = [...new Set(rowsIn.map((r) => norm(r[4])))].filter((x) => x && !have.has(x));
    if (add.length) appendFileSync(REVIEWED_FILE, (existsSync(REVIEWED_FILE) ? '' : '# English texts a native Malay speaker has looked at and approved (one per line). Added by: npm run lint:bank -- --approve\n') + add.join('\n') + '\n');
    console.log(`Approved ${add.length} new text(s) from ${rowsIn.length} row(s) marked ok.`); process.exit(0);
  }
  const { errors: bankErrors, warns } = lintBank(G), ms = lintMalay(G), errors = bankErrors.concat(ms.errors), rows = Object.values(G.BANK).reduce((a, s) => a + Object.values(s).reduce((b, r) => b + r.length, 0), 0);
  if (argv.includes('--review')) { writeFileSync('MALAY-REVIEW.csv', reviewCSV(ms.items)); console.log(`Wrote MALAY-REVIEW.csv with ${ms.items.length} line(s) for a native Malay speaker. Ask them to write ok (or the better Malay) in the last column, then run: npm run lint:bank -- --approve MALAY-REVIEW.csv`); }
  if (json) console.log(JSON.stringify({ rows, errors, warns, review: ms.items.length }, null, 2));
  else {
    console.log(`Quest Academy bank linter: ${rows} rows checked`);
    for (const [title, list] of [['ERRORS', errors], ['Warnings', warns]]) {
      console.log(`\n${title}: ${list.length}`);
      const by = list.reduce((o, [k, w, m]) => { (o[k] = o[k] || []).push(`${w} — ${m}`); return o; }, {});
      for (const [k, ms] of Object.entries(by)) { console.log(`  ${k} (${ms.length})`); if (!quiet) { ms.slice(0, 30).forEach((m) => console.log('    - ' + m)); if (ms.length > 30) console.log(`    … and ${ms.length - 30} more`); } }
    }
  }
  if (!json) {
    const by = ms.items.reduce((o, x) => { const k = x.reason.replace(/:.*|\(.*/, '').trim(); (o[k] = o[k] || []).push(x); return o; }, {});
    console.log(`\nNeeds a native Malay speaker: ${ms.items.length} line(s)${ms.items.length ? '  (run: npm run lint:bank -- --review  to write MALAY-REVIEW.csv)' : ''}`);
    for (const [k, list] of Object.entries(by)) { console.log(`  ${k} (${list.length})`); if (!quiet) list.slice(0, 8).forEach((x) => console.log(`    - ${x.subj} ${x.band === '-' ? '' : 'bank ' + x.band + ' '}#${x.row} ${x.field}: "${x.en.slice(0, 50)}" / "${x.ms.slice(0, 50)}"`)); }
  }
  process.exitCode = errors.length ? 1 : 0;
}
