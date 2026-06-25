(function () {
  function initTabs() {
    var tabs = document.querySelectorAll('.bench-tab[data-bench]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        var all = document.querySelectorAll('.bench-tab');
        for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
        var panels = document.querySelectorAll('.bench-panel');
        for (var k = 0; k < panels.length; k++) panels[k].classList.remove('active');
        this.classList.add('active');
        var panel = document.getElementById('bp-' + this.getAttribute('data-bench'));
        if (panel) panel.classList.add('active');
      });
    }
  }
  // Recognition-viewer step tabs (DrishtiTable panel)
  function initViewer() {
    var btns = document.querySelectorAll('#dt-vsteps .dt-vb[data-vstep]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var n = this.getAttribute('data-vstep');
        var panels = document.querySelectorAll('.dt-vp');
        for (var j = 0; j < panels.length; j++) panels[j].classList.remove('active');
        var el = document.querySelector('.dt-vp[data-vstep="' + n + '"]');
        if (el) el.classList.add('active');
        for (var k = 0; k < btns.length; k++) btns[k].classList.remove('active');
        this.classList.add('active');
      });
    }
  }
  function initCset() {
    var btns = document.querySelectorAll('.dt-toggle button[data-cset]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var set = this.getAttribute('data-cset');
        var sets = document.querySelectorAll('.dt-cset');
        for (var j = 0; j < sets.length; j++) sets[j].classList.remove('active');
        var el = document.getElementById('dt-cset-' + set);
        if (el) el.classList.add('active');
        for (var k = 0; k < btns.length; k++) btns[k].classList.remove('active');
        this.classList.add('active');
      });
    }
  }
  function init() { initTabs(); initViewer(); initCset(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
