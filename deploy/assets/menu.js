/* Mobile nav toggle — CSP-safe (external file, no inline handlers).
 * Toggles the .menu-links dropdown when the hamburger button is tapped.
 * Works on every static page that includes:
 *   <button data-menu-toggle ...> and <div class="menu-links" id="menu-links">
 */
(function () {
  function init() {
    var btn = document.querySelector('[data-menu-toggle]');
    var menu = document.getElementById('menu-links');
    if (!btn || !menu) return;

    function setOpen(open) {
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!menu.classList.contains('open'));
    });

    // Close when a link is tapped
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });

    // Close when tapping outside
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) && !btn.contains(e.target)) {
        setOpen(false);
      }
    });

    // Close on resize back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
