/* Case-study page live sync (CSP-safe, self-contained).
 * Updates the DrishtiTable case-study results table + composition charts from the
 * same HF-backed endpoints as /benchmarks. Hardcoded fallback stays if HF is down.
 */
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function pct(n) { return (typeof n === 'number') ? n.toFixed(1) : '—'; }

  function renderTable(rows) {
    var body = document.getElementById('cs-lb-body');
    if (!body || !rows || !rows.length) return;
    var html = '';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var ours = r.category === 'fine-tuned' || (r.model && r.model.indexOf('DrishtiTable') !== -1);
      var note = ours ? ' <span style="font-weight:400;color:var(--muted)">&middot; released</span>' : '';
      var teds = (typeof r.teds === 'number') ? r.teds.toFixed(1) : '—';
      var steds = (typeof r.steds === 'number') ? r.steds.toFixed(1) : '—';
      html += '<tr' + (ours ? ' class="best"' : '') + '>' +
        '<th scope="row">' + esc(r.model) + note + '</th>' +
        '<td>' + esc(r.method || '') + '</td>' +
        '<td' + (ours ? ' class="pos"' : '') + ' style="text-align:right">' + teds + '</td>' +
        '<td style="text-align:right">' + steds + '</td>' +
      '</tr>';
    }
    body.innerHTML = html;
    body.removeAttribute('data-fallback');
    mark('cs-lb-sync');
  }

  function renderDist(boxId, obj) {
    var box = document.getElementById(boxId);
    if (!box || !obj) return;
    var keys = Object.keys(obj);
    if (!keys.length) return;
    keys.sort(function (a, b) { return obj[b] - obj[a]; });
    if (keys.length > 6) {
      var head = keys.slice(0, 5), tail = keys.slice(5), other = 0;
      for (var t = 0; t < tail.length; t++) other += obj[tail[t]];
      var capped = {};
      for (var h = 0; h < head.length; h++) capped[head[h]] = obj[head[h]];
      capped['Other'] = other; obj = capped; keys = Object.keys(obj);
    }
    var max = 0;
    for (var k = 0; k < keys.length; k++) if (obj[keys[k]] > max) max = obj[keys[k]];
    if (!max) return;
    var html = '';
    for (var i = 0; i < keys.length; i++) {
      var w = Math.max(1, (obj[keys[i]] / max) * 100);
      html += '<div class="cs-bar"><span class="l">' + esc(keys[i]) + '</span>' +
        '<span class="t"><span class="f" style="width:' + w.toFixed(1) + '%"></span></span>' +
        '<span class="v">' + obj[keys[i]] + '</span></div>';
    }
    box.innerHTML = html;
  }

  function mark(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = '\u25CF live from Hugging Face'; el.classList.add('live'); }
  }

  function load() {
    if (!window.fetch) return;
    fetch('/api/hf/leaderboard', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.rows) renderTable(d.rows); })
      .catch(function () {});
    fetch('/api/hf/composition', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.full) return;
        renderDist('cs-comp-table_type', d.full.table_type);
        renderDist('cs-comp-subject', d.full.subject);
        renderDist('cs-comp-complexity', d.full.complexity);
        mark('cs-comp-sync');
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
