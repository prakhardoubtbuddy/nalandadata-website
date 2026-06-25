/* Live leaderboard sync — CSP-safe (external file).
 * Fetches the DrishtiTable leaderboard from the backend (which pulls
 * leaderboard.jsonl live from Hugging Face) and re-renders the table.
 * If the fetch fails, the hardcoded fallback rows in the HTML stay as-is.
 */
(function () {
  var ENDPOINT = '/api/hf/leaderboard';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fmt(n) { return (typeof n === 'number') ? n.toFixed(1) + '%' : '—'; }
  function notifySynced() {
    try { document.dispatchEvent(new CustomEvent('bench:synced')); } catch (e) {}
  }

  function render(rows) {
    var body = document.getElementById('drishti-lb-body');
    if (!body || !rows || !rows.length) return;

    var top = rows[0].teds;
    var html = '';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var research = r.category === 'research-unreleased';
      var ours = (r.category === 'fine-tuned') || research ||
                 (r.model && r.model.indexOf('DrishtiTable') !== -1);
      var delta = (i === 0)
        ? '&mdash;'
        : '<span class="dneg">&minus;' + (top - r.teds).toFixed(1) + '</span>';
      var badge = research ? ' <span class="badge" style="background:var(--accent-deep)">research</span>'
                           : (ours ? ' <span class="badge">ours</span>' : '');
      var name = esc(r.model) + badge;
      html += '<tr' + (ours ? ' class="best"' : '') + '>' +
        '<th>' + name + '</th>' +
        '<td>' + esc(r.method || '') + '</td>' +
        '<td style="text-align:right">' + fmt(r.teds) + '</td>' +
        '<td style="text-align:right">' + fmt(r.steds) + '</td>' +
        '<td style="text-align:right">' + delta + '</td>' +
      '</tr>';
    }
    body.innerHTML = html;
    body.removeAttribute('data-fallback');

    var sync = document.getElementById('lb-sync');
    if (sync) { sync.textContent = '\u25CF live from Hugging Face'; sync.classList.add('live'); }
    notifySynced();
  }

  function renderBars(rows) { barsBy('teds-bars', rows, 'teds'); barsBy('steds-bars', rows, 'steds'); }
  function barsBy(boxId, rows, key) {
    var box = document.getElementById(boxId);
    if (!box || !rows || !rows.length) return;
    var top = rows.filter(function (r) { return typeof r[key] === 'number'; })
                  .sort(function (a, b) { return b[key] - a[key]; })
                  .slice(0, 6);
    if (!top.length) return;
    var max = top[0][key] || 100;
    var html = '';
    for (var i = 0; i < top.length; i++) {
      var r = top[i];
      var ours = (r.category === 'fine-tuned') || r.category === 'research-unreleased' ||
                 (r.model && r.model.indexOf('DrishtiTable') !== -1);
      var pct = Math.max(2, (r[key] / max) * 100);
      // distinguish our models by size; shorten the long HF names for the bar label
      var label = esc(r.model);
      if (r.model && r.model.indexOf('Qwen3-VL-8B') !== -1) label = 'DrishtiTable 8B (research)';
      else if (r.model && r.model.indexOf('Qwen2.5-VL-7B') !== -1 && r.category === 'fine-tuned') label = 'DrishtiTable 7B (ours)';
      html += '<div class="bar-row' + (ours ? ' ours' : '') + '">' +
        '<span class="bar-label">' + label + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + pct.toFixed(1) + '%"></span></span>' +
        '<span class="bar-val">' + r[key].toFixed(1) + '%</span>' +
      '</div>';
    }
    box.innerHTML = html;
  }

  // ---- composition charts (by table type / subject / complexity) ----
  function renderDist(boxId, obj) {
    var box = document.getElementById(boxId);
    if (!box || !obj) return;
    var keys = Object.keys(obj);
    if (!keys.length) return;
    // sort high -> low; cap at 6 bars (group the rest into Other) so charts never overflow
    keys.sort(function (a, b) { return obj[b] - obj[a]; });
    if (keys.length > 6) {
      var head = keys.slice(0, 5), tail = keys.slice(5), otherSum = 0;
      for (var t = 0; t < tail.length; t++) otherSum += obj[tail[t]];
      var capped = {};
      for (var h = 0; h < head.length; h++) capped[head[h]] = obj[head[h]];
      capped['Other'] = otherSum;
      obj = capped;
      keys = Object.keys(obj);
    }
    var max = 0;
    for (var k = 0; k < keys.length; k++) if (obj[keys[k]] > max) max = obj[keys[k]];
    if (!max) return;
    var html = '';
    for (var i = 0; i < keys.length; i++) {
      var label = keys[i], val = obj[label];
      var pct = Math.max(1, (val / max) * 100);
      html += '<div class="bar-row">' +
        '<span class="bar-label">' + esc(label) + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + pct.toFixed(1) + '%"></span></span>' +
        '<span class="bar-val">' + val + '</span>' +
      '</div>';
    }
    box.innerHTML = html;
  }

  function loadComposition() {
    fetch('/api/hf/composition', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        if (d.full) {
          renderDist('comp-table_type', d.full.table_type);
          renderDist('comp-subject', d.full.subject);
          renderDist('comp-complexity', d.full.complexity);
        }
        if (d.test) {
          renderDist('comp-test-table_type', d.test.table_type);
          renderDist('comp-test-subject', d.test.subject);
          renderDist('comp-test-complexity', d.test.complexity);
        }
      })
      .catch(function () { /* keep fallback */ });
  }

  // ---- NalandaBench leaderboard table ----
  function renderNB(rows) {
    var body = document.getElementById('nalandabench-lb-body');
    if (!body || !rows || !rows.length) return;
    var html = '';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var ours = (r.category === 'fine-tuned') ||
                 (r.model && r.model.indexOf('Nalanda') !== -1 && r.category !== 'baseline');
      var base = (r.category === 'baseline');
      var nameExtra = ours ? ' <span class="badge">ours</span>' : (base ? ' <span class="who2">baseline</span>' : '');
      var vb = (r.vs_base === 0 || r.vs_base == null)
        ? '&mdash;'
        : '<span class="dpos">+' + r.vs_base + '</span>';
      html += '<tr' + (ours ? ' class="best"' : '') + '>' +
        '<th>' + esc(r.model) + nameExtra + '</th>' +
        '<td>' + esc(r.method || '') + '</td>' +
        '<td style="text-align:right">' + fmt(r.accuracy) + '</td>' +
        '<td style="text-align:right">' + vb + '</td>' +
      '</tr>';
    }
    body.innerHTML = html;
    var sync = document.getElementById('nb-sync');
    if (sync) { sync.textContent = '\u25CF live from Hugging Face'; sync.classList.add('live'); }
    notifySynced();
  }

  function loadNalandaBench() {
    fetch('/api/hf/nalandabench-leaderboard', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.rows) renderNB(d.rows); })
      .catch(function () { /* keep fallback */ });
  }

  function load() {
    if (!window.fetch) return; // very old browsers: keep fallback
    fetch(ENDPOINT, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && data.rows) { render(data.rows); renderBars(data.rows); }
      })
      .catch(function () { /* keep hardcoded fallback */ });
    loadComposition();
    loadNalandaBench();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
