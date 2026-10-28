/* ================= v36: the game remembers what each child has seen =================
   Before, only the last 160 questions were blocked from coming back (RECENT), and the bank keeps a per-subject round.
   Now every child's save keeps how many times (and how lately) each question was shown: S.seenQ = { shortKey: [count, order] }.
   When the game can choose, it prefers a question the child has never seen, and when everything has been seen it takes one
   from the least recently seen. Keys are short hashes of the question text, and the list is capped (SEEN_CAP), so the save
   stays small. It works for every kind of question (bank rows, true/false, odd one out, the new formats, fact questions). */
const SEEN_CAP = 2600;
function seenHash(s) { s = String(s); let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function seenMap() { return S.seenQ || (S.seenQ = {}); }
function seenKeyOf(q) { return q ? String(q.memKey || q.key || '') : ''; }
function seenInfo(k) { return k ? seenMap()[seenHash(k)] || null : null; }
function seenCount(k) { const e = seenInfo(k); return e ? e[0] : 0; }
function seenBump(q) {
  const k = seenKeyOf(q); if (!k) return;
  const m = seenMap(), h = seenHash(k), e = m[h]; S.seenN = (S.seenN | 0) + 1; m[h] = [(e ? e[0] : 0) + 1, S.seenN];
  const ks = Object.keys(m);
  if (ks.length > SEEN_CAP) { ks.sort((a, b) => m[a][1] - m[b][1]).slice(0, Math.ceil(SEEN_CAP * .12)).forEach(x => { delete m[x]; }); }
}
/* choose from a list: never seen first (at random), then among the least recently seen fifth */
function seenPick(list, keyFn) {
  if (!list || !list.length) return undefined;
  if (list.length === 1) return list[0];
  const rows = list.map(x => ({ x, e: seenInfo(String(keyFn ? keyFn(x) : x)) }));
  const fresh = rows.filter(r => !r.e);
  if (fresh.length) return fresh[Math.floor(Math.random() * fresh.length)].x;
  rows.sort((a, b) => a.e[1] - b.e[1]);
  return rows[Math.floor(Math.random() * Math.max(1, Math.ceil(rows.length * .2)))].x;
}
function seenBest(cands) { return seenPick(cands, seenKeyOf); }
if (window.__quest) window.__quest.v36 = Object.assign(window.__quest.v36 || {}, { seenPick, seenBump, seenCount, seenHash, SEEN_CAP });

/* ---------- Parent Portal: Bilingual boost and "start the questions fresh" ---------- */
const BI_HELP = ['Adds English ↔ Malay word questions (fill the gap, join the words, true or false, tap the picture, multiple choice).', 'Menambah soalan perkataan Inggeris ↔ Melayu (isi tempat kosong, padankan, betul atau salah, sentuh gambar, aneka pilihan).'];
function biCardHTML() {
  const on = !!S.bilingual, n = Object.keys(S.seenQ || {}).length;
  return `<div class="card v36card" id="v36Card"><h3>🔤 ${esc(t('v36.card'))}</h3>
    <div class="seg">${tog('biToggle', 'v36.bi', on)}</div><p class="note">${esc(BI_HELP[LI()])}</p>
    <p class="note">${esc(t('v36.seen', { n }))}</p><div class="seg"><button class="chip" data-act="seenReset">↺ ${esc(t('v36.seenReset'))}</button></div></div>`;
}
HOOK.on('renderParent', () => {
  if (!gate.unlocked) return;
  const c = $('#tab-parent #v34Card'), pc = $('#tab-parent [data-act="pinChange"]'), at = c || (pc && pc.closest ? pc.closest('.card') : null);
  if (at && at.insertAdjacentHTML) at.insertAdjacentHTML('afterend', biCardHTML());
});
HOOK.claim('famEvent', a => {
  if (a === 'biToggle') { S.bilingual = !S.bilingual; save(); renderParent(); return true; }
  if (a === 'seenReset') { S.seenQ = {}; S.seenN = 0; save(); toast(t('v36.seenDone')); renderParent(); return true; }
  return undefined;
});
Object.assign(STR, {
  'v36.card': ['Words and questions', 'Perkataan dan soalan'], 'v36.bi': ['Bilingual boost: {s}', 'Dwibahasa: {s}'],
  'v36.seen': ['Questions this child has seen: {n}. New ones come first, then the ones seen longest ago.', 'Soalan yang telah dilihat: {n}. Soalan baharu dahulu, kemudian yang dilihat paling lama dahulu.'],
  'v36.seenReset': ['Start the questions fresh', 'Mulakan soalan dari awal'], 'v36.seenDone': ['Done: every question counts as new again.', 'Siap: semua soalan dikira baharu semula.']
});
