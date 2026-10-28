/* npm run check: content validator for Quest Academy.
   Loads the real game data through scripts/harness.mjs (so generated question families are included) and reports:
     ERROR  duplicate questions inside a subject or across subjects (v24), an answer missing from (or repeated in) its options,
            a question with fewer than two possible options, missing Bahasa Melayu text
     WARN   Bahasa Melayu text that is just the English copied over, zones with too few different questions
   Exit code 1 when there is at least one ERROR (so it can guard a release). Use --quiet to print totals only. */
import { loadGame } from './harness.mjs';

const quiet = process.argv.includes('--quiet');
const { game: G } = await loadGame({ lang: 'en', band: 3 });
const errors = [], warns = [];
const E = (k, m) => errors.push([k, m]), W = (k, m) => warns.push([k, m]);
const norm = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
const looksEnglishCopy = (en, ms) => en && ms && en === ms && /[a-z]{3,} [a-z]{3,} [a-z]{3,}/i.test(en) && !/^[\d\s+\-x×÷=?.,]+$/.test(en);

/* ---- 1. question banks ---- */
const allEn = new Map(), allMs = new Map(), normX = (s) => norm(s).replace(/[.,!?'"…:;]+/g, '').replace(/\s+/g, ' ').trim();
for (const subj of Object.keys(G.BANK)) {
  const seenEn = new Map(), seenMs = new Map();
  for (const band of Object.keys(G.BANK[subj])) {
    const rows = G.BANK[subj][band];
    rows.forEach((r, i) => {
      const where = `${subj} age-bank ${band} #${i + 1}${r.gen ? ' (generated)' : ''}: "${r.q[0]}"`;
      const ke = norm(r.q[0]), km = norm(r.q[1]);
      if (seenEn.has(ke)) E('duplicate', `${where} repeats ${seenEn.get(ke)}`); else seenEn.set(ke, `bank ${band} #${i + 1}`);
      if (r.q[1] && seenMs.has(km) && seenMs.get(km) !== seenEn.get(ke)) W('duplicate-bm', `${where}: the BM question is the same as ${seenMs.get(km)}`); else seenMs.set(km, `bank ${band} #${i + 1}`);
      /* v24: every question is unique in the whole game, in both languages */
      const xe = normX(r.q[0]), xm = normX(r.q[1] || '');
      if (allEn.has(xe) && !allEn.get(xe).startsWith(subj + ' ')) E('duplicate-across', `${where} repeats ${allEn.get(xe)}`); else if (!allEn.has(xe)) allEn.set(xe, `${subj} bank ${band} #${i + 1}`);
      if (xm && allMs.has(xm) && !allMs.get(xm).startsWith(subj + ' ')) E('duplicate-across', `${where}: the BM question repeats ${allMs.get(xm)}`); else if (xm && !allMs.has(xm)) allMs.set(xm, `${subj} bank ${band} #${i + 1}`);
      if (!r.q[1] || !String(r.q[1]).trim()) E('missing-bm', `${where}: no BM question`);
      if (r.a[1] === undefined || r.a[1] === null || !String(r.a[1]).trim()) E('missing-bm', `${where}: no BM answer`);
      if (looksEnglishCopy(r.q[0], r.q[1])) W('bm-copy', `${where}: BM question is the English text`);
      for (let li = 0; li < 2; li++) {
        const ans = String(r.a[li]);
        if (r.w && r.w[li]) {
          const w = r.w[li].map(String);
          if (w.includes(ans)) E('answer-in-wrong', `${where}: the answer "${ans}" is also listed as a wrong option (${li ? 'BM' : 'EN'})`);
          if (new Set(w).size !== w.length) E('repeated-option', `${where}: a wrong option is listed twice (${li ? 'BM' : 'EN'})`);
          if (!w.length) E('no-options', `${where}: no wrong options (${li ? 'BM' : 'EN'})`);
        } else {
          /* options come from other answers in the same group (same subject, any bank) */
          const others = new Set();
          Object.values(G.BANK[subj]).forEach((rs) => rs.forEach((o) => { if (o.grp === r.grp && String(o.a[li]) !== ans) others.add(String(o.a[li])); }));
          if (others.size < 1) E('no-options', `${where}: group "${r.grp}" has no other answers to use as options (${li ? 'BM' : 'EN'})`);
          /* number answers also get nearby numbers as extra options, so they are never short of choices */
          else if (others.size < 2 && !/^-?\d+$/.test(ans.replace(/ /g, ''))) W('few-options', `${where}: group "${r.grp}" gives only ${others.size + 1} options (${li ? 'BM' : 'EN'})`);
        }
      }
    });
  }
}

/* ---- 2. built questions: the right answer is always one of the options ---- */
for (const subj of Object.keys(G.BANK)) for (const band of [1, 2, 3, 4]) {
  const topics = G.BTOP[subj] || [];
  for (const topic of topics) for (let i = 0; i < 25; i++) {
    let q; try { q = G.bankQ(subj, band, topic); } catch (e) { E('build-failed', `${subj} age ${band + 3} ${topic}: ${e.message}`); break; }
    if (!q) break;
    const opts = q.options.map(String);
    if (!(q.correct >= 0 && q.correct < opts.length)) E('answer-missing', `${subj} age ${band + 3} ${topic}: "${q.text}" — the answer is not among the options`);
    if (new Set(opts).size !== opts.length) E('repeated-option', `${subj} age ${band + 3} ${topic}: "${q.text}" shows the same option twice: ${opts.join(' | ')}`);
  }
}

/* ---- 3. strings, lessons and life-skills scenes ---- */
for (const [k, v] of Object.entries(G.STR)) {
  if (!Array.isArray(v)) continue;
  if (v.length < 2 || v[1] === undefined || v[1] === null || (typeof v[1] === 'string' && !v[1].trim())) E('missing-bm', `string "${k}" has no BM text`);
  else if (typeof v[0] === 'string' && looksEnglishCopy(v[0], v[1]) && v[0].length > 24) W('bm-copy', `string "${k}" BM text is the English text`);
}
for (const s of G.SUBJ_ORDER) await G.ensureLessons(s);
for (const m of G.MODULES) {
  if (!m.ms || !m.ms.title) E('missing-bm', `lesson ${m.id}: no BM title`);
  if (m.body && (!m.ms.body || !m.ms.body.length)) E('missing-bm', `lesson ${m.id}: no BM text`);
  else if (m.body && m.ms.body.length !== m.body.length) W('bm-lines', `lesson ${m.id}: ${m.body.length} EN lines but ${m.ms.body.length} BM lines`);
}
if (G.LIFE) for (const band of Object.keys(G.LIFE)) G.LIFE[band].forEach((r, i) => {
  const where = `life skills age-bank ${band} #${i + 1}: "${r.text}"`;
  if (r.wrongs.includes(r.answer)) E('answer-in-wrong', `${where}: the answer is also a wrong option`);
  if (!r.ms) E('missing-bm', `${where}: no BM version`);
  else if (r.ms.length < 4 || r.ms.slice(0, 4).some((x) => !x)) E('missing-bm', `${where}: BM version incomplete`);
  else if (r.ms[2] === r.ms[1] || r.ms[3] === r.ms[1]) E('answer-in-wrong', `${where}: BM answer is also a wrong option`);
});

/* ---- 4. zones with too few different questions ---- */
const MIN_PER_ZONE = 15;
for (const subj of G.SUBJ_ORDER) for (const band of [1, 2, 3, 4]) {
  const banks = G.BANK_FOR_AGE[band] || [];
  for (let z = 0; z < 10; z++) {
    const pool = new Set();
    for (let n = z * 10 + 1; n <= z * 10 + 10; n++) {
      G.levelOf(subj, n).pool.forEach((code) => {
        const [kind, s2, topic] = code.split(':');
        if (kind !== 'bank') { pool.add(code); return; }
        banks.forEach((b) => ((G.BANK[s2] || {})[b] || []).forEach((r) => { if (r.topic === topic) pool.add(r.q[0]); }));
      });
    }
    const count = [...pool].filter((x) => !String(x).includes(':')).length, gen = [...pool].some((x) => String(x).includes(':'));
    if (!gen && count < MIN_PER_ZONE) W('thin-zone', `${subj} age ${band + 3} zone ${z + 1}: only ${count} different questions (aim for ${MIN_PER_ZONE}+)`);
  }
}

/* ---- report ---- */
const group = (list) => list.reduce((o, [k, m]) => { (o[k] = o[k] || []).push(m); return o; }, {});
const show = (title, list) => {
  const g = group(list);
  console.log(`\n${title}: ${list.length}`);
  for (const [k, ms] of Object.entries(g)) {
    console.log(`  ${k} (${ms.length})`);
    if (!quiet) ms.slice(0, 25).forEach((m) => console.log('    - ' + m)), ms.length > 25 && console.log(`    … and ${ms.length - 25} more`);
  }
};
const totalQ = Object.values(G.BANK).reduce((a, s) => a + Object.values(s).reduce((b, r) => b + r.length, 0), 0);
console.log(`Quest Academy content check: ${totalQ} bank questions, ${Object.keys(G.STR).length} strings, ${G.MODULES.length} lessons`);
show('ERRORS', errors);
show('Warnings', warns);
process.exitCode = errors.length ? 1 : 0;
