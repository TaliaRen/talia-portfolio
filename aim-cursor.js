// ── Aim cursor: reticle follows the pointer with a little easing and locks
//    on over interactive elements ──
(function () {
  // Embedded (inside the homepage's project view): don't draw a reticle here —
  // forward the pointer to the parent, whose reticle is the topmost layer.
  if (window.parent !== window && /[?&]embed=1/.test(location.search)) {
    const HOT = 'a, button, .glyph, [role="button"], input, textarea, select, label';
    const TEXT = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, td, th, dt, dd';
    const send = (event, e) => { const hot = !!(e && e.target && e.target.closest && e.target.closest(HOT)); window.parent.postMessage({ type: 'cursor', event, x: e && e.clientX, y: e && e.clientY, hot, text: !hot && !!(e && e.target && e.target.closest && e.target.closest(TEXT)) }, '*'); };
    window.addEventListener('mousemove', e => send('move', e), { passive: true });
    window.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') send('move', e); }, { passive: true });
    document.addEventListener('mouseover', e => send('over', e));
    window.addEventListener('mousedown', e => send('down', e));
    window.addEventListener('mouseup', e => send('up', e));
    document.addEventListener('mouseleave', () => send('leave'));
    return;
  }
  if (!document.getElementById('aimCursor')) {
    const d = document.createElement('div'); d.className = 'aim-cursor'; d.id = 'aimCursor'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<span class="ac-ring"></span><span class="ac-c ac-tl"></span><span class="ac-c ac-tr"></span><span class="ac-c ac-bl"></span><span class="ac-c ac-br"></span><span class="ac-dot"></span>';
    document.body.appendChild(d);
  }
  const cur = document.getElementById('aimCursor');
  if (!cur || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOT = 'a, button, .glyph, [role="button"], input, textarea, select, label, .mallow-stick-el, [data-note]';   // data-note: anything the translator reads on hover (About portrait, record rows, prints)
  // reading text (project pages only, <html data-text-cursor>): the reticle becomes an I-beam, like a normal text cursor
  const TEXT = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, td, th, dt, dd';
  const textPages = document.documentElement.hasAttribute('data-text-cursor');
  const setText = on => cur.classList.toggle('text', !!on);
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, shown = false, locked = false;
  const place = () => { cur.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; };
  const onMove = e => {
    tx = e.clientX; ty = e.clientY;
    if (!shown) { shown = true; x = tx; y = ty; place(); cur.classList.add('show'); }
    if (reduce) { x = tx; y = ty; place(); }
  };
  window.addEventListener('mousemove', onMove, { passive: true });
  // pointermove keeps arriving while an element holds pointer capture (e.g. dragging the marshmallow stick),
  // when mousemove does not — so follow both
  window.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') onMove(e); }, { passive: true });
  document.addEventListener('mouseleave', () => { shown = false; cur.classList.remove('show'); });
  document.addEventListener('mouseenter', () => { shown = true; cur.classList.add('show'); });
  window.addEventListener('mousedown', () => cur.classList.add('down'));
  window.addEventListener('mouseup', () => cur.classList.remove('down'));
  // lock-on when the pointer is over anything interactive; over an <iframe>
  // the embedded page draws its own reticle, so hide this one
  const setLocked = hot => {
    if (hot && !locked) { locked = true; cur.classList.add('locked'); cur.classList.remove('pulse'); void cur.offsetWidth; cur.classList.add('pulse'); }
    else if (!hot && locked) { locked = false; cur.classList.remove('locked', 'pulse'); }
  };
  document.addEventListener('mouseover', e => {
    if (e.target.tagName === 'IFRAME') return;           // the iframe forwards its own pointer (see remote)
    if (!shown) { shown = true; cur.classList.add('show'); }
    const hot = e.target.closest && e.target.closest(HOT);
    setLocked(hot);
    setText(textPages && !hot && e.target.closest && e.target.closest(TEXT));
  });
  // pointer events forwarded from an embedded page (coords already in this window's space)
  window.aimCursor = { remote(event, px, py, hot, text) {
    if (event === 'leave') return;
    if (event === 'move') { tx = px; ty = py; if (!shown) { shown = true; x = tx; y = ty; place(); cur.classList.add('show'); } if (reduce) { x = tx; y = ty; place(); } return; }
    if (event === 'over') { if (!shown) { shown = true; cur.classList.add('show'); } setLocked(hot); setText(!hot && text); return; }
    if (event === 'down') cur.classList.add('down'); else if (event === 'up') cur.classList.remove('down');
  } };
  if (!reduce) {
    (function tick() {
      x += (tx - x) * 0.35; y += (ty - y) * 0.35;   // tight, snappy follow
      place();
      requestAnimationFrame(tick);
    })();
  }
})();
