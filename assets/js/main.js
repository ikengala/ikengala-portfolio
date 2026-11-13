// Small enhancements that recreate the original Squarespace behaviour.
// The site still reads fine with JavaScript off.
document.documentElement.classList.add('js');
var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// ---------- Dropdowns slide open and closed instead of snapping ----------
(function () {
  document.querySelectorAll('.accordion details').forEach(function (d) {
    var summary = d.querySelector('summary'), body = d.querySelector('.details-body'), anim = null;
    summary.addEventListener('click', function (e) {
      if (REDUCED || !body.animate) return;          // fall back to the native toggle
      e.preventDefault();
      if (anim) anim.cancel();
      if (!d.open) {
        d.open = true;
        var h = body.scrollHeight;
        anim = body.animate(
          [{ height: '0px', opacity: 0, transform: 'translateY(-12px)' },
           { height: h + 'px', opacity: 1, transform: 'translateY(0)' }],
          { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)' });
      } else {
        anim = body.animate(
          [{ height: body.offsetHeight + 'px', opacity: 1, transform: 'translateY(0)' },
           { height: '0px', opacity: 0, transform: 'translateY(-12px)' }],
          { duration: 350, easing: 'cubic-bezier(.4,0,.2,1)' });
        anim.onfinish = function () { d.open = false; };
      }
      anim.addEventListener('finish', function () { anim = null; });
    });
  });
})();

// ---------- Content fades up as it scrolls into view ----------
(function () {
  if (REDUCED || !('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll(
    '.fe-block, .strip-row, .gallery-slideshow, .gallery-reel, .glance-facts, .glance-stats li, .results-list li, .results h2, .project-links li');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach(function (el, i) {
    if (el.getBoundingClientRect().top < window.innerHeight) return;  // already on screen: leave it alone
    el.classList.add('reveal');
    // small stagger for items in a row
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    if (el.matches('li')) el.style.transitionDelay = Math.min(sib, 5) * 90 + 'ms';
    io.observe(el);
  });
})();

// ---------- Home page: numbers count up when they appear ----------
(function () {
  var counts = document.querySelectorAll('.count[data-to]');
  if (!counts.length || REDUCED || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      var el = en.target, to = +el.dataset.to, t0 = null;
      var dp = (el.dataset.to.split('.')[1] || '').length;   // keep decimals, e.g. 1.8
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1400, 1);
        el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dp);
        if (p < 1) requestAnimationFrame(frame);
      }
      el.textContent = (0).toFixed(dp);
      requestAnimationFrame(frame);
    });
  }, { threshold: 0.6 });
  counts.forEach(function (c) { io.observe(c); });
})();

// ---------- Sound buttons on the autoplaying clips (one clip plays sound at a time) ----------
(function () {
  var buttons = document.querySelectorAll('.sound-toggle');
  function set(btn, on) {
    var v = btn.parentNode.querySelector('video');
    v.muted = !on;
    if (on) v.play();
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
    btn.querySelector('.sound-label').textContent = on ? 'Sound off' : 'Sound on';
  }
  function toggle(btn) {
    var turnOn = btn.getAttribute('aria-pressed') !== 'true';
    buttons.forEach(function (b) { if (b !== btn) set(b, false); });
    set(btn, turnOn);
  }
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () { toggle(btn); });
    // tapping the clip itself toggles sound too
    btn.parentNode.querySelector('video').addEventListener('click', function () { toggle(btn); });
  });
})();

// ---------- Pause videos while they're off screen (saves battery and data) ----------
(function () {
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting) { if (!(REDUCED && v.classList.contains('bg-video'))) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
      else v.pause();
    });
  }, { rootMargin: '200px 0px' });
  document.querySelectorAll('video[autoplay]').forEach(function (v) { io.observe(v); });
})();

// ---------- Swipe through the Galatea slideshows on touch screens ----------
(function () {
  document.querySelectorAll('.gallery-slideshow .slides').forEach(function (stage) {
    var show = stage.closest('.gallery-slideshow'), x0 = null;
    stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) < 40) return;
      show.querySelector(dx < 0 ? '.slide-btn.next' : '.slide-btn.prev').click();
    });
  });
})();
