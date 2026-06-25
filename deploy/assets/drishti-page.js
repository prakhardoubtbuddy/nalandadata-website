/* DrishtiTable research page — CSP-safe interactions + live HF sync.
 * - Distribution toggle (Full corpus / Test set)
 * - Trajectory viewer step tabs
 * - Live leaderboard (TEDS + S-TEDS bars) + composition charts from HF endpoints
 * Hardcoded fallback stays if HF is unreachable.
 */
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---- distribution toggle ---- */
  function initToggle() {
    var btns = document.querySelectorAll('.toggle button[data-set]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var set = this.getAttribute('data-set');
        var sets = document.querySelectorAll('.dist-set');
        for (var j = 0; j < sets.length; j++) sets[j].classList.remove('active');
        var el = document.getElementById('set-' + set);
        if (el) el.classList.add('active');
        for (var k = 0; k < btns.length; k++) btns[k].classList.remove('active');
        this.classList.add('active');
      });
    }
  }

  /* ---- trajectory viewer steps ---- */
  function initViewer() {
    var tabs = document.querySelectorAll('#tvsteps .tvb[data-step]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        var n = this.getAttribute('data-step');
        var panels = document.querySelectorAll('.tvp');
        for (var j = 0; j < panels.length; j++) {
          panels[j].style.display = 'none';
          panels[j].classList.remove('active');
        }
        var el = document.querySelector('.tvp[data-step="' + n + '"]');
        if (el) { el.style.display = 'grid'; el.classList.add('active'); }
        for (var k = 0; k < tabs.length; k++) tabs[k].classList.remove('active');
        this.classList.add('active');
      });
    }
    // ensure only step 0 is visible at start
    var panels = document.querySelectorAll('.tvp');
    for (var p = 0; p < panels.length; p++) {
      panels[p].style.display = (panels[p].getAttribute('data-step') === '0') ? 'grid' : 'none';
    }
  }

  /* ---- live leaderboard bars ---- */
  function bars(boxId, rows, key) {
    var box = document.getElementById(boxId);
    if (!box || !rows || !rows.length) return;
    var sorted = rows.filter(function (r) { return typeof r[key] === 'number'; })
                     .sort(function (a, b) { return b[key] - a[key]; })
                     .slice(0, 6);
    if (!sorted.length) return;
    var max = sorted[0][key] || 100;
    var html = '';
    for (var i = 0; i < sorted.length; i++) {
      var r = sorted[i];
      var ours = r.category === 'fine-tuned' || (r.model && r.model.indexOf('DrishtiTable') !== -1);
      var w = Math.max(2, (r[key] / max) * 100);
      var label = ours ? 'DrishtiTable (ours)' : esc(r.model);
      html += '<div class="row' + (ours ? ' win' : '') + '">' +
        '<span class="lab">' + label + '</span>' +
        '<span class="track"><span class="fill" style="width:' + w.toFixed(1) + '%"></span></span>' +
        '<span class="val">' + r[key].toFixed(1) + '</span></div>';
    }
    box.innerHTML = html;
  }

  function loadLeaderboard() {
    fetch('/api/hf/leaderboard', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.rows) return;
        bars('lb-teds', d.rows, 'teds');
        bars('lb-steds', d.rows, 'steds');
        mark('lb-sync');
      })
      .catch(function () {});
  }

  /* ---- live composition charts ---- */
  function dist(boxId, obj) {
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
      html += '<div class="drow"><span class="lab">' + esc(keys[i]) + '</span>' +
        '<span class="track"><span class="fill" style="width:' + w.toFixed(1) + '%"></span></span>' +
        '<span class="val">' + obj[keys[i]] + '</span></div>';
    }
    box.innerHTML = html;
  }

  function loadComposition() {
    fetch('/api/hf/composition', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        if (d.full) {
          dist('comp-full-table_type', d.full.table_type);
          dist('comp-full-subject', d.full.subject);
          dist('comp-full-complexity', d.full.complexity);
        }
        if (d.test) {
          dist('comp-test-table_type', d.test.table_type);
          dist('comp-test-subject', d.test.subject);
          dist('comp-test-complexity', d.test.complexity);
        }
        mark('comp-sync');
      })
      .catch(function () {});
  }

  function mark(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = '\u25CF live'; el.classList.add('live'); }
  }

  function init() {
    initToggle();
    initViewer();
    if (window.fetch) { loadLeaderboard(); loadComposition(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
