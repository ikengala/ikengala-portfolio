// Home page: show a project's cover image that follows the cursor
// while hovering its title (recreates Squarespace's "hover follow" list).
(function () {
  var cover = document.querySelector('.hover-cover');
  if (!cover || !window.matchMedia('(hover: hover)').matches) return;

  var x = 0, y = 0, cx = 0, cy = 0, running = false;

  function tick() {
    cx += (x - cx) * 0.15;
    cy += (y - cy) * 0.15;
    cover.style.left = cx + 'px';
    cover.style.top = cy + 'px';
    if (running) requestAnimationFrame(tick);
  }

  document.querySelectorAll('.project-links a').forEach(function (link) {
    link.addEventListener('mouseenter', function (e) {
      cover.src = link.dataset.cover;
      x = cx = e.clientX; y = cy = e.clientY;
      cover.classList.add('is-visible');
      if (!running) { running = true; tick(); }
    });
    link.addEventListener('mouseleave', function () {
      cover.classList.remove('is-visible');
      running = false;
    });
  });

  document.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });
})();
