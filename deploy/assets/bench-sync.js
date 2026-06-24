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

  function render(rows) {
    var body = document.getElementById('drishti-lb-body');
    if (!body || !rows || !rows.length) return;

    var top = rows[0].teds;
    var html = '';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var ours = (r.category === 'fine-tuned') ||
                 (r.model && r.model.indexOf('DrishtiTable') !== -1);
      var delta = (i === 0)
        ? '&mdash;'
        : '<span class="dneg">&minus;' + (top - r.teds).toFixed(1) + '</span>';
      var name = esc(r.model) + (ours ? ' <span class="badge">ours</span>' : '');
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
  }

  function renderBars(rows) {
    var box = document.getElementById('teds-bars');
    if (!box || !rows || !rows.length) return;
    var top = rows.slice(0, 6);          // show up to top 6
    var max = top[0].teds || 100;        // scale to leader for visual range
    var html = '';
    for (var i = 0; i < top.length; i++) {
      var r = top[i];
      var ours = (r.category === 'fine-tuned') ||
                 (r.model && r.model.indexOf('DrishtiTable') !== -1);
      var pct = Math.max(2, (r.teds / max) * 100);
      var label = ours ? 'DrishtiTable (ours)' : esc(r.model);
      html += '<div class="bar-row' + (ours ? ' ours' : '') + '">' +
        '<span class="bar-label">' + label + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + pct.toFixed(1) + '%"></span></span>' +
        '<span class="bar-val">' + r.teds.toFixed(1) + '%</span>' +
      '</div>';
    }
    box.innerHTML = html;
  }

  function load() {
    if (!window.fetch) return; // very old browsers: keep fallback
    fetch(ENDPOINT, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && data.rows) { render(data.rows); renderBars(data.rows); }
      })
      .catch(function () { /* keep hardcoded fallback */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
