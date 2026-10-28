/* ================= v31: hooks =================
   Later parts used to extend a function by replacing it ("const _win27 = win; win = async function () { ... }"),
   so win, startBattle, renderParent and friends were wrapped three or four times across files and nobody could
   see the order. Now a function that others may extend is declared once, as a thin door into HOOK.call, and every
   extension is registered here with a name:

     function startBattle() { return HOOK.call('startBattle', startBattleBase, arguments); }

     HOOK.on('startBattle', id => ...)            runs after the function (after its promise, for async ones)
     HOOK.before('wrongPick', i => ...)           runs before it
     HOOK.claim('levelOf', (s, n) => value)       may answer instead: return anything but undefined to skip the rest
     HOOK.filter('atkBonus', (v, ...args) => v)   changes the result
     HOOK.around('win', async (next, ...args) => { ...; await next(...args); ... })   full control
     HOOK.emit('answer:wrong', q, pick)           an event with no function behind it (HOOK.on listens)

   Order is exactly what the old wrapping gave: the newest registration runs outermost, so "on" handlers run in the
   order the files load and "before"/"claim" handlers run newest first. Errors inside on/before handlers are caught
   and written to the crash log (00b) so one broken extra never stops the game; claim/filter/around errors still
   throw, because they decide what the function returns. HOOK.list() shows every hook (tests use it). */
const HOOK = (() => {
  const W = {};
  const add = (name, fn) => { (W[name] || (W[name] = [])).push(fn); };
  const thenable = r => !!r && typeof r.then === 'function';
  const report = (name, e) => { try { if (typeof CRASH !== 'undefined') CRASH.add(e, 'hook ' + name); } catch (x) { /* ignore */ } try { console.error('[hook ' + name + ']', e); } catch (x) { /* ignore */ } };
  const safe = (name, fn, args) => { try { const r = fn(...args); if (thenable(r)) return r.catch(e => report(name, e)); } catch (e) { report(name, e); } return undefined; };
  function call(name, core, args) {
    const L = W[name]; if (!L || !L.length) return core(...args);
    const step = k => (...a) => k < 0 ? core(...a) : L[k](step(k - 1), ...a);
    return step(L.length - 1)(...args);
  }
  return {
    call,
    around: add,
    on: (name, fn) => add(name, (next, ...a) => {
      const r = next(...a);
      if (thenable(r)) return r.then(v => Promise.resolve(safe(name, fn, [...a, v])).then(() => v));
      safe(name, fn, [...a, r]); return r;
    }),
    before: (name, fn) => add(name, (next, ...a) => { safe(name, fn, a); return next(...a); }),
    claim: (name, fn) => add(name, (next, ...a) => { const r = fn(...a); return r === undefined ? next(...a) : r; }),
    filter: (name, fn) => add(name, (next, ...a) => { const r = next(...a); return thenable(r) ? r.then(v => fn(v, ...a)) : fn(r, ...a); }),
    emit: (name, ...a) => call(name, () => undefined, a),
    has: name => !!(W[name] && W[name].length),
    list: () => Object.fromEntries(Object.keys(W).sort().map(k => [k, W[k].length]))
  };
})();
