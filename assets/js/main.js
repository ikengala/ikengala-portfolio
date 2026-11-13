// Small enhancements that recreate the original Squarespace behaviour.
// The site still reads fine with JavaScript off.

// ---------- Curved / wavy section dividers ----------
// Same shapes Squarespace used: a clip path on the bottom edge of the section,
// recalculated whenever the section changes size.
(function () {
  var sections = document.querySelectorAll('.has-divider[data-divider]');
  if (!sections.length) return;
  var NS = 'http://www.w3.org/2000/svg';
  var defs = document.createElementNS(NS, 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.position = 'absolute';
  document.body.appendChild(defs);

  function shape(type, f) {
    var y = 1 - f, i, d;
    if (type === 'wave') {
      var a = (0.64 * f).toFixed(5);
      d = 'M-1,' + y + ' L-1,' + (1 - f / 2);
      for (i = 0; i < 3; i++) d += ' c0.25,-' + a + ' 0.25,-' + a + ' 0.5,0 s0.25,' + a + ' 0.5,0';
      return d + ' L2,-1 L-1,-1 z';
    }
    var rev = type === 'curve-rev', s = rev ? -1 : 1;
    d = 'M' + (rev ? 2 : -1) + ',' + y + ' L' + (rev ? 2 : -1) + ',1';
    for (i = 0; i < 3; i++) d += ' c' + 0.25 * s + ',0 ' + 0.5 * s + ',0 ' + s + ',-' + f + ' l0,' + f;
    return d + (rev ? ' L-1,-1 L2,-1 z' : ' L2,-1 L-1,-1 z');
  }

  sections.forEach(function (sec, n) {
    var id = 'divider-clip-' + n;
    var cp = document.createElementNS(NS, 'clipPath');
    cp.setAttribute('id', id); cp.setAttribute('clipPathUnits', 'objectBoundingBox');
    var path = document.createElementNS(NS, 'path');
    cp.appendChild(path); defs.appendChild(cp);
    function update() {
      var dh = parseFloat(getComputedStyle(sec).paddingBottom) || 0;
      var f = Math.min(dh / sec.offsetHeight, 0.5);
      path.setAttribute('d', shape(sec.dataset.divider, +f.toFixed(4)));
    }
    update();
    sec.style.clipPath = 'url(#' + id + ')';
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(sec);
    else window.addEventListener('resize', update);
  });
})();

// ---------- Slideshows (Galatea track cards + video covers) ----------
(function () {
  document.querySelectorAll('.gallery-slideshow').forEach(function (show) {
    var slides = show.querySelectorAll('.slide');
    var thumbs = show.querySelectorAll('.thumb');
    var cur = 0, timer = null, delay = +show.dataset.autoplay || 0;
    function go(i) {
      slides[cur].classList.remove('is-active');
      if (thumbs[cur]) thumbs[cur].classList.remove('is-active');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('is-active');
      if (thumbs[cur]) {
        thumbs[cur].classList.add('is-active');
        var box = thumbs[cur].parentNode;
        box.scrollTo({ left: thumbs[cur].offsetLeft - box.clientWidth / 2 + 40, behavior: 'smooth' });
      }
    }
    function restart() {
      if (!delay || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, delay);
    }
    show.querySelector('.slide-btn.prev').addEventListener('click', function () { go(cur - 1); restart(); });
    show.querySelector('.slide-btn.next').addEventListener('click', function () { go(cur + 1); restart(); });
    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); restart(); }); });
    show.addEventListener('mouseenter', function () { clearInterval(timer); });
    show.addEventListener('mouseleave', restart);
    restart();
  });
})();

// ---------- Reels (playlist covers): arrow buttons scroll the strip ----------
(function () {
  document.querySelectorAll('.gallery-reel').forEach(function (reel) {
    var track = reel.querySelector('.reel-track');
    function step(dir) {
      var item = track.querySelector('li');
      var w = item ? item.getBoundingClientRect().width : track.clientWidth / 3;
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      var atStart = track.scrollLeft <= 2;
      if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
      else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      else track.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    reel.querySelector('.reel-btn.prev').addEventListener('click', function () { step(-1); });
    reel.querySelector('.reel-btn.next').addEventListener('click', function () { step(1); });
  });
})();

// ---------- Home page: cover image follows the cursor over project titles ----------
(function () {
  var cover = document.querySelector('.hover-cover');
  if (!cover || !window.matchMedia('(hover: hover)').matches) return;
  var x = 0, y = 0, cx = 0, cy = 0, running = false;
  function tick() {
    cx += (x - cx) * 0.15; cy += (y - cy) * 0.15;
    cover.style.left = cx + 'px'; cover.style.top = cy + 'px';
    if (running) requestAnimationFrame(tick);
  }
  document.querySelectorAll('.project-links a').forEach(function (link) {
    link.addEventListener('mouseenter', function (e) {
      cover.src = link.dataset.cover;
      x = cx = e.clientX; y = cy = e.clientY;
      cover.classList.add('is-visible');
      if (!running) { running = true; tick(); }
    });
    link.addEventListener('mouseleave', function () { cover.classList.remove('is-visible'); running = false; });
  });
  document.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });
})();
