(function () {
  function init() {
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
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
