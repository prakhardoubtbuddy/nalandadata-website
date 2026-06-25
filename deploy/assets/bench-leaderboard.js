/* bench-leaderboard.js — progressive enhancement: ranked, sortable, filterable
   benchmark leaderboards. CSP-safe (external file, addEventListener, no inline).
   If anything throws, the static server-rendered tables are left intact. */
(function () {
  "use strict";
  function num(t) {
    if (t == null) return null;
    t = t.replace(/\u2212/g, '-').replace(/[%,+]/g, '').trim();
    if (t === '' || t === '-' || t === '\u2014') return null;
    var v = parseFloat(t);
    return isNaN(v) ? null : v;
  }
  function orgOf(name, ours) {
    if (ours) return 'Nalandadata';
    if (/claude/i.test(name)) return 'Anthropic';
    if (/gpt|^\s*o\d/i.test(name)) return 'OpenAI';
    if (/gemini/i.test(name)) return 'Google DeepMind';
    if (/qwen/i.test(name)) return 'Alibaba';
    if (/llama/i.test(name)) return 'Meta';
    if (/mistral|pixtral/i.test(name)) return 'Mistral';
    return '\u2014';
  }
  function mclassOf(m) {
    if (/fine-?tuned|sft|grpo|\brl\b|verified-reward/i.test(m)) return 'tuned';
    if (/zero-?shot|base/i.test(m)) return 'zero';
    return 'other';
  }
  function injectCss() {
    if (document.getElementById('lb-css')) return;
    var s = document.createElement('style');
    s.id = 'lb-css';
    s.textContent =
      '.lb-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 14px}' +
      '.lb-filter{display:flex;gap:6px;flex-wrap:wrap}' +
      '.lb-filter button{font:inherit;font-size:11.5px;font-family:var(--mono,monospace);letter-spacing:.04em;color:var(--muted,#9a9a9a);background:transparent;border:1px solid var(--line,#2a2a2a);border-radius:20px;padding:5px 13px;cursor:pointer;transition:.15s}' +
      '.lb-filter button:hover{color:var(--paper,#eee);border-color:var(--muted-2,#666)}' +
      '.lb-filter button.on{background:var(--accent-tint,rgba(200,169,110,.14));color:var(--accent,#C8A96E);border-color:var(--accent,#C8A96E)}' +
      '.lb-search{margin-left:auto;font:inherit;font-size:12.5px;color:var(--paper,#eee);background:var(--ink,#0f0f0f);border:1px solid var(--line,#2a2a2a);border-radius:6px;padding:6px 11px;min-width:150px}' +
      '.lb-search::placeholder{color:var(--muted-2,#666)}' +
      'table th.lb-sort{cursor:pointer;user-select:none;white-space:nowrap}' +
      'table th.lb-sort:hover{color:var(--accent,#C8A96E)}' +
      'table th.lb-sort .ar{opacity:.35;font-size:9px;margin-left:4px}' +
      'table th.lb-sort.act .ar{opacity:1;color:var(--accent,#C8A96E)}' +
      'td.lb-rank,th.lb-rank{text-align:right;width:34px;color:var(--muted-2,#777);font-variant-numeric:tabular-nums}' +
      'tr.best td.lb-rank{color:var(--accent,#C8A96E);font-weight:700}' +
      'td.lb-org{color:var(--muted,#9a9a9a);font-size:12.5px;white-space:nowrap}';
    document.head.appendChild(s);
  }
  function enhance(table) {
    var thead = table.tHead, tb = table.tBodies[0];
    if (!thead || !tb || !thead.rows[0]) return;
    var hrow = thead.rows[0];
    // Idempotency guard: if already enhanced (header has the rank col), only
    // re-enhance the BODY (rank/org cells), don't re-insert header columns.
    var alreadyEnhanced = hrow.querySelector && hrow.querySelector('.lb-rank');
    var rows = Array.prototype.slice.call(tb.rows);
    if (rows.length < 2) return;
    if (!alreadyEnhanced) {
      var rkH = document.createElement('th'); rkH.className = 'lb-rank'; rkH.textContent = '#';
      hrow.insertBefore(rkH, hrow.firstChild);
      var orgH = document.createElement('th'); orgH.textContent = 'Org';
      hrow.insertBefore(orgH, hrow.cells[2]);
    }
    rows.forEach(function (r) {
      if (r.querySelector && r.querySelector('.lb-rank')) return; // row already has rank/org

      var ours = r.classList.contains('best');
      var model = r.cells[0] ? r.cells[0].textContent : '';
      var rc = document.createElement('td'); rc.className = 'lb-rank';
      r.insertBefore(rc, r.firstChild);
      var oc = document.createElement('td'); oc.className = 'lb-org';
      oc.textContent = orgOf(model, ours);
      r.insertBefore(oc, r.cells[2]);
      r.dataset.model = model.toLowerCase();
      r.dataset.mclass = mclassOf(r.cells[3] ? r.cells[3].textContent : '');
    });
    var sortCols = [];
    for (var c = 4; c < hrow.cells.length; c++) {
      var hasNum = rows.some(function (r) { return num(r.cells[c] && r.cells[c].textContent) !== null; });
      if (hasNum) {
        hrow.cells[c].classList.add('lb-sort');
        hrow.cells[c].setAttribute('data-col', c);
        var ar = document.createElement('span'); ar.className = 'ar'; ar.textContent = '\u25BC';
        hrow.cells[c].appendChild(ar);
        sortCols.push(c);
      }
    }
    var st = { col: sortCols.length ? sortCols[0] : null, dir: -1, filter: 'all', q: '' };
    function draw() {
      var rs = rows.slice();
      if (st.col !== null) {
        rs.sort(function (a, b) {
          var va = num(a.cells[st.col].textContent), vb = num(b.cells[st.col].textContent);
          if (va === null && vb === null) return 0;
          if (va === null) return 1;
          if (vb === null) return -1;
          return (va - vb) * st.dir;
        });
      }
      rs.forEach(function (r) { tb.appendChild(r); });
      var rank = 0;
      rs.forEach(function (r) {
        var okF = st.filter === 'all' || r.dataset.mclass === st.filter;
        var okQ = !st.q || r.dataset.model.indexOf(st.q) !== -1;
        if (okF && okQ) { rank++; r.style.display = ''; r.cells[0].textContent = rank; }
        else { r.style.display = 'none'; }
      });
      for (var i = 0; i < hrow.cells.length; i++) {
        var h = hrow.cells[i];
        if (!h.classList.contains('lb-sort')) continue;
        var on = parseInt(h.getAttribute('data-col'), 10) === st.col;
        h.classList.toggle('act', on);
        var a = h.querySelector('.ar');
        if (a) a.textContent = on ? (st.dir < 0 ? '\u25BC' : '\u25B2') : '\u25BC';
      }
    }
    sortCols.forEach(function (c) {
      hrow.cells[c].addEventListener('click', function () {
        if (st.col === c) st.dir = -st.dir; else { st.col = c; st.dir = -1; }
        draw();
      });
    });
    var card = table.closest ? table.closest('.tablecard') : null;
    var hasFt = rows.some(function (r) { return r.dataset.mclass === 'tuned'; });
    var hasZs = rows.some(function (r) { return r.dataset.mclass === 'zero'; });
    var showFilter = rows.length >= 4 && hasFt && hasZs;
    var showSearch = rows.length >= 5;
    // Guard: don't add a second controls bar if this table already has one
    // (enhance() re-runs after bench-sync replaces the rows).
    var existingCtr = card && card.parentNode && card.parentNode.querySelector('.lb-controls');
    if ((showFilter || showSearch) && !existingCtr) {
      var ctr = document.createElement('div'); ctr.className = 'lb-controls';
      if (showFilter) {
        var fl = document.createElement('div'); fl.className = 'lb-filter';
        [['All', 'all'], ['Fine-tuned', 'tuned'], ['Zero-shot', 'zero']].forEach(function (d) {
          var b = document.createElement('button'); b.textContent = d[0];
          if (d[1] === 'all') b.className = 'on';
          b.addEventListener('click', function () {
            st.filter = d[1];
            var bs = fl.querySelectorAll('button');
            for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i] === b);
            draw();
          });
          fl.appendChild(b);
        });
        ctr.appendChild(fl);
      }
      if (showSearch) {
        var se = document.createElement('input');
        se.type = 'text'; se.className = 'lb-search'; se.placeholder = 'Search model\u2026';
        se.addEventListener('input', function () { st.q = se.value.trim().toLowerCase(); draw(); });
        ctr.appendChild(se);
      }
      if (card && card.parentNode) card.parentNode.insertBefore(ctr, card);
    }
    draw();
  }
  function enhanceAll() {
    try {
      var tables = document.querySelectorAll('.bench-panel .tablecard table');
      Array.prototype.forEach.call(tables, function (t) {
        // enhance each table at most once (avoids duplicate controls / stale state)
        if (t.dataset.lbEnhanced) return;
        t.dataset.lbEnhanced = '1';
        enhance(t);
      });
    } catch (e) { /* leave static tables intact */ }
  }
  function init() {
    try { injectCss(); } catch (e) {}
    enhanceAll();
  }
  // bench-sync replaces table bodies with live HF data, then fires 'bench:synced'.
  // We enhance AFTER that so the enhancement is built on the final rows (once).
  // If sync never fires (HF down -> fallback rows), enhance on DOM ready anyway.
  var enhancedViaSync = false;
  document.addEventListener('bench:synced', function () {
    enhancedViaSync = true;
    enhanceAll();
  });
  function deferredInit() {
    // small delay to let bench-sync's fetch resolve first; fall back if it doesn't
    setTimeout(function () { if (!enhancedViaSync) init(); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', deferredInit);
  else deferredInit();
})();
