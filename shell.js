// ── Shared site chrome behaviour: the rail's music toggle, the phone
// hamburger menu, and the email icon's copy-to-clipboard. Verbatim from
// the homepage, so every page behaves the same way.
(function () {
  const railMusic = document.getElementById('railMusic');
  if (railMusic) {
    let playing = false, music = null;
    railMusic.addEventListener('click', () => {
      playing = !playing;
      railMusic.classList.toggle('on', playing);
      railMusic.dataset.label = playing ? 'Music on' : 'Music off';
      railMusic.setAttribute('aria-pressed', String(playing));
      if (playing) {
        if (!music) { music = new Audio('sound effect/music.mp3'); music.loop = true; music.volume = 0.7; }
        music.play().catch(() => {});
      } else {
        music?.pause();
      }
    });
  }
})();

// ── Phone menu: hamburger toggles the full-frame list ──
(function () {
  const burger = document.getElementById('mBurger'), menu = document.getElementById('mMenu');
  if (!burger || !menu) return;
  const set = open => { document.body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', String(open)); };
  burger.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  window.addEventListener('resize', () => { if (innerWidth > 640) set(false); });
  document.addEventListener('click', e => { if (document.body.classList.contains('menu-open') && !menu.contains(e.target) && !burger.contains(e.target)) set(false); });
})();

// ── Case-study Back link: use real browser back navigation so the
// homepage is restored exactly where it was left (via bfcache), with
// no scroll animation, instead of jumping straight to the #projects
// anchor from a fresh navigation ──
(function () {
  const back = document.querySelector('.case-back');
  if (!back) return;
  back.addEventListener('click', e => {
    const cameFromSite = document.referrer && document.referrer.indexOf(location.origin) === 0;
    if (cameFromSite && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
})();

// ── Rail: the email icon copies the address to the clipboard ──
(function () {
  const el = document.getElementById('railEmail');
  if (!el) return;
  const EMAIL = 'taliaren0826@gmail.com';
  let t = 0;
  el.addEventListener('click', e => {
    if (!navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL).then(() => {
      el.dataset.label = 'Copied!'; el.classList.add('copied');
      clearTimeout(t);
      t = setTimeout(() => { el.classList.remove('copied'); el.dataset.label = 'Email'; }, 1600);
    }).catch(() => { location.href = el.href; });
  });
})();
