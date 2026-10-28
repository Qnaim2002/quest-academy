/* v34: size budget (npm run budget, runs in CI after the build).
   Reads dist/ and budget.json, prints a small table, and fails if the game got too heavy for cheap phones.
   "First load" = the main script + the style sheet + index.html, compressed (what a child's phone downloads first).
   "mustBeLazy" lists chunks that have to stay OUT of the main script (they load only when used). */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const kb = (n) => Math.round(n / 1024 * 10) / 10;

export function measure(dist) {
  const assets = join(dist, 'assets');
  const files = readdirSync(assets).map((f) => ({ f, buf: readFileSync(join(assets, f)) }));
  const pick = (re) => files.filter((x) => re.test(x.f));
  const main = pick(/^index-.*\.js$/)[0], css = pick(/^index-.*\.css$/)[0], worker = pick(/^sprite-worker-.*\.js$/)[0];
  const html = readFileSync(join(dist, 'index.html'));
  const lazy = files.filter((x) => x.f.endsWith('.js') && x !== main && x !== worker);
  const walk = (d) => readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? walk(join(d, e.name)) : statSync(join(d, e.name)).size), 0);
  const gz = (b) => (b ? gzipSync(b).length : 0);
  return {
    mainJsKB: kb(main.buf.length), mainJsGzKB: kb(gz(main.buf)),
    cssKB: kb(css ? css.buf.length : 0), cssGzKB: kb(gz(css && css.buf)),
    spriteWorkerKB: kb(worker ? worker.buf.length : 0),
    firstLoadGzKB: kb(gz(main.buf) + gz(css && css.buf) + gz(html)),
    lazyChunkKB: kb(Math.max(0, ...lazy.map((x) => x.buf.length))),
    biggestLazy: lazy.sort((a, b) => b.buf.length - a.buf.length)[0]?.f || '',
    wholeAppKB: kb(walk(dist)),
    lazyNames: lazy.map((x) => x.f), mainText: main.buf.toString('utf8')
  };
}

export function judge(m, budget) {
  const rows = [], bad = [];
  for (const k of Object.keys(budget).filter((k) => typeof budget[k] === 'number')) {
    const ok = m[k] <= budget[k]; rows.push([k, m[k], budget[k], ok]); if (!ok) bad.push(`${k} is ${m[k]} KB, the limit is ${budget[k]} KB`);
  }
  for (const name of budget.mustBeLazy || []) {
    const chunk = m.lazyNames.some((f) => f.startsWith(name + '-'));
    if (!chunk) bad.push(`"${name}" is not a separate lazy file any more (it was pulled back into the main script)`);
  }
  return { rows, bad };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dist = join(ROOT, 'dist');
  if (!existsSync(join(dist, 'index.html'))) { console.error('No dist/ folder. Run: npm run build'); process.exit(2); }
  const budget = JSON.parse(readFileSync(join(ROOT, 'budget.json'), 'utf8'));
  const m = measure(dist), { rows, bad } = judge(m, budget);
  console.log('Size budget (KB)\n');
  for (const [k, v, lim, ok] of rows) console.log(`${ok ? 'ok  ' : 'FAIL'} ${k.padEnd(16)} ${String(v).padStart(8)}  / ${lim}`);
  console.log(`\nBiggest lazy file: ${m.biggestLazy}`);
  if (bad.length) { console.error('\nOVER BUDGET:\n- ' + bad.join('\n- ')); process.exit(1); }
  console.log('\nAll within budget.');
}
