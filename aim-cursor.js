// ── Aim cursor: reticle follows the pointer with a little easing and locks
//    on over interactive elements ──
(function () {
  if (!document.getElementById('aimCursor')) {
    const d = document.createElement('div'); d.className = 'aim-cursor'; d.id = 'aimCursor'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<span class="ac-ring"></span><span class="ac-c ac-tl"></span><span class="ac-c ac-tr"></span><span class="ac-c ac-bl"></span><span class="ac-c ac-br"></span><span class="ac-dot"></span>';
    document.body.appendChild(d);
  }
  const cur = document.getElementById('aimCursor');
  if (!cur || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOT = 'a, button, .glyph, [role="button"], input, textarea, select, label';
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, shown = false, locked = false;
  const place = () => { cur.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; };
  window.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    if (!shown) { shown = true; x = tx; y = ty; place(); cur.classList.add('show'); }
    if (reduce) { x = tx; y = ty; place(); }
  }, { passive: true });
  document.addEventListener('mouseleave', () => { shown = false; cur.classList.remove('show'); });
  document.addEventListener('mouseenter', () => { shown = true; cur.classList.add('show'); });
  window.addEventListener('mousedown', () => cur.classList.add('down'));
  window.addEventListener('mouseup', () => cur.classList.remove('down'));
  // lock-on when the pointer is over anything interactive; over an <iframe>
  // the embedded page draws its own reticle, so hide this one
  document.addEventListener('mouseover', e => {
    if (e.target.tagName === 'IFRAME') { shown = false; cur.classList.remove('show', 'locked', 'pulse'); locked = false; return; }
    if (!shown) { shown = true; cur.classList.add('show'); }
    const hot = e.target.closest && e.target.closest(HOT);
    if (hot && !locked) { locked = true; cur.classList.add('locked'); cur.classList.remove('pulse'); void cur.offsetWidth; cur.classList.add('pulse'); }
    else if (!hot && locked) { locked = false; cur.classList.remove('locked', 'pulse'); }
  });
  if (!reduce) {
    (function tick() {
      x += (tx - x) * 0.35; y += (ty - y) * 0.35;   // tight, snappy follow
      place();
      requestAnimationFrame(tick);
    })();
  }
})();
