/* ================= v31: telemetry-free crash log =================
   When something goes wrong (a script error or a failed promise), a short note is kept in this browser's local
   storage: the message, where it happened, the first lines of the stack, how often and when. Nothing is ever sent
   anywhere. A grown-up can export the notes as a file (to send to whoever looks after the game) or clear them in
   the Parent Portal (Privacy card). The same problem is counted, not stored twice; at most CRASH_MAX notes are kept. */
const CRASH_KEY = 'quest-academy-crashlog', CRASH_MAX = 30;
const CRASH = (() => {
  let list = [];
  try { list = JSON.parse(localStorage.getItem(CRASH_KEY) || '[]'); if (!Array.isArray(list)) list = []; } catch (e) { list = []; }
  let busy = false;
  const store = () => { try { localStorage.setItem(CRASH_KEY, JSON.stringify(list)); } catch (e) { /* storage full or blocked: keep it in memory */ } };
  const ver = () => { try { return __APP_VERSION__; } catch (e) { return '?'; } };
  function add(err, where) {
    if (busy) return; busy = true;   // never let the log itself loop
    try {
      const msg = String((err && err.message) || err || 'Unknown error').slice(0, 300);
      const stack = String((err && err.stack) || '').split('\n').slice(0, 6).map(s => s.trim()).join('\n').slice(0, 900);
      const at = String(where || '').slice(0, 120), sig = msg + '|' + at, now = Date.now();
      let tab = ''; try { tab = typeof UI !== 'undefined' && UI ? [UI.tab, UI.tab === 'adventure' ? UI.adv : ''].filter(Boolean).join('/') : ''; } catch (e) { tab = ''; }
      const old = list.find(x => x.sig === sig);
      if (old) { old.n++; old.last = now; old.tab = tab || old.tab; }
      else list.push({ sig, msg, where: at, stack, tab, n: 1, first: now, last: now, v: ver() });
      while (list.length > CRASH_MAX) list.shift();
      store();
    } catch (e) { /* ignore */ }
    busy = false;
  }
  function exportFile() {
    const data = { app: 'Quest Academy', version: ver(), exported: new Date().toISOString(), userAgent: navigator.userAgent || '', language: navigator.language || '', problems: list.map(({ sig, ...x }) => ({ ...x, first: new Date(x.first).toISOString(), last: new Date(x.last).toISOString() })) };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'quest-academy-problem-log.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function clear() { list = []; store(); }
  addEventListener('error', e => { if (e && (e.error || e.message)) add(e.error || e.message, (e.filename ? String(e.filename).split('/').pop() : '') + (e.lineno ? ':' + e.lineno + ':' + (e.colno || 0) : '')); });
  addEventListener('unhandledrejection', e => add(e && e.reason, 'promise'));
  return { add, list: () => list.slice(), count: () => list.reduce((a, x) => a + x.n, 0), size: () => list.length, exportFile, clear };
})();
