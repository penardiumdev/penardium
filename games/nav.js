(function () {
  // Edit this list to add / remove / rename games. The current page is
  // matched by `match` (last path segment) and excluded from the dropdown.
  const GAMES = [
    { name: 'ARENA DRIBBLER', href: 'https://penardium.com/dribble-arena.html', match: 'dribble-arena.html' },
    { name: 'DODGE ARENA',    href: 'https://penardium.com/dodge-arena.html',    match: 'dodge-arena.html' },
    { name: 'MEMORY ARENA',   href: 'https://penardium.com/memory-arena.html',   match: 'memory-arena.html' },
    { name: 'APPROACH ARENA', href: 'https://penardium.com/approach-arena.html', match: 'approach-arena.html' },
  ];

  const styles = `
    .nav {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 10;
      font-family: "Archivo Black", sans-serif;
    }
    .nav-btn {
      background: transparent;
      border: none;
      color: #6b6b68;
      font-family: inherit;
      font-size: 10px;
      font-weight: 400;
      letter-spacing: 0.5px;
      padding: 6px 10px;
      cursor: none;
      transition: color 0.15s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-btn:hover, .nav-btn.hover { color: #e8e8e6; }
    .nav-caret {
      font-size: 8px;
      line-height: 1;
      transition: transform 0.15s;
    }
    .nav-btn.open .nav-caret { transform: rotate(180deg); }
    .nav-menu {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 6px;
      background: #1a1a1d;
      border: 1.5px solid #3d3d40;
      padding: 4px;
      display: none;
      flex-direction: column;
      min-width: 160px;
    }
    .nav-menu.open { display: flex; }
    .nav-item {
      background: transparent;
      border: none;
      color: #6b6b68;
      font-family: inherit;
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 0.5px;
      padding: 8px 10px;
      text-align: left;
      text-decoration: none;
      cursor: none;
      transition: color 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .nav-item:hover, .nav-item.hover {
      color: #e8e8e6;
      background: rgba(232,232,230,0.04);
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const currentPath = location.pathname.split('/').pop();
  const otherGames = GAMES.filter(g => g.match !== currentPath);

  const nav = document.createElement('div');
  nav.className = 'nav';
  nav.innerHTML = `
    <button class="nav-btn" type="button">
      <span>OTHER GAMES</span>
      <span class="nav-caret">▾</span>
    </button>
    <div class="nav-menu">
      ${otherGames.map(g => `<a class="nav-item" href="${g.href}">${g.name}</a>`).join('')}
    </div>
  `;
  document.body.appendChild(nav);

  const navBtn = nav.querySelector('.nav-btn');
  const navMenu = nav.querySelector('.nav-menu');
  const navItems = [...navMenu.querySelectorAll('a.nav-item')];

  let navOpen = false;
  let navBtnRect = navBtn.getBoundingClientRect();
  let navItemRects = [];

  const refreshRects = () => {
    navBtnRect = navBtn.getBoundingClientRect();
    navItemRects = navItems.map(el => ({ el, rect: el.getBoundingClientRect() }));
  };
  refreshRects();
  addEventListener('resize', refreshRects);

  const inRect = (x, y, r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;

  navBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navOpen = !navOpen;
    navMenu.classList.toggle('open', navOpen);
    navBtn.classList.toggle('open', navOpen);
    refreshRects();
  });

  addEventListener('click', () => {
    if (navOpen) {
      navOpen = false;
      navMenu.classList.remove('open');
      navBtn.classList.remove('open');
      refreshRects();
    }
  });

  window.GameNav = {
    // Apply hover classes for the current cursor position. Returns true if
    // any nav element is hovered (so the game can scale its custom cursor).
    updateHover(x, y) {
      let any = false;
      if (inRect(x, y, navBtnRect)) {
        navBtn.classList.add('hover');
        any = true;
      } else {
        navBtn.classList.remove('hover');
      }
      if (navOpen) {
        for (const { el, rect } of navItemRects) {
          if (inRect(x, y, rect)) {
            el.classList.add('hover');
            any = true;
          } else {
            el.classList.remove('hover');
          }
        }
      } else {
        navItems.forEach(el => el.classList.remove('hover'));
      }
      return any;
    },
    // Handle a canvas click. Returns true if the click hit the nav (the
    // game should bail out of its own click handling).
    handleClick(x, y) {
      if (inRect(x, y, navBtnRect)) return true;
      if (navOpen) {
        for (const { el, rect } of navItemRects) {
          if (inRect(x, y, rect)) {
            const href = el.getAttribute('href');
            if (href) location.href = href;
            return true;
          }
        }
      }
      return false;
    },
  };
})();
