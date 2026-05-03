(function () {
  const inIframe = window !== window.top;

  if (inIframe) {
    // Make this document transparent so the shell's background shows
    // through. Done unconditionally — even if the parent is cross-origin
    // (e.g. file:// in Chrome), the browser still composites the iframe
    // over the parent's bg canvas.
    const goTransparent = () => {
      document.documentElement.style.background = 'transparent';
      if (document.body) document.body.style.background = 'transparent';
    };
    goTransparent();
    if (!document.body) addEventListener('DOMContentLoaded', goTransparent);

    // Try to proxy to the parent's GameNav so clicks drive the shared shell
    // nav. Same-origin → works → cross-game continuity preserved. Cross-
    // origin → throws → fall through and build a local nav so the game
    // still has GameNav.* and can swap between games via iframe-internal
    // navigation (loses continuity for the swap, but the shell bg behind
    // us keeps running).
    let topNav = null;
    try { topNav = window.top.GameNav; } catch (e) { /* cross-origin */ }
    if (topNav) {
      window.GameNav = topNav;
      return;
    }
  }

  const GAMES = [
    { name: 'ARENA DRIBBLER', file: 'dribble-arena.html' },
    { name: 'DODGE ARENA',    file: 'dodge-arena.html' },
    { name: 'MEMORY ARENA',   file: 'memory-arena.html' },
    { name: 'APPROACH ARENA', file: 'approach-arena.html' },
  ];

  // pointer-events:none lets mouse events fall through the nav to whatever
  // is below (the iframe in shell mode, the canvas in standalone). All
  // hover/click logic is driven by GameNav.updateHover/handleClick instead
  // of native button events.
  const styles = `
    .nav {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 10;
      pointer-events: none;
      font-family: "Archivo Black", sans-serif;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .side-nav {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 10;
      pointer-events: none;
      font-family: "Archivo Black", sans-serif;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .icon-btn {
      width: 28px;
      height: 28px;
      border: 1.5px solid #3d3d40;
      background: transparent;
      cursor: none;
      color: #6b6b68;
      transition: border-color 0.15s, color 0.15s;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-btn.hover, .icon-btn.open {
      border-color: #e8e8e6;
      color: #e8e8e6;
    }
    .icon-btn svg {
      width: 16px;
      height: 16px;
      display: block;
      transition: transform 0.2s ease;
    }
    .sound-btn .icon-on { display: block; }
    .sound-btn .icon-off { display: none; }
    .sound-btn.muted .icon-on { display: none; }
    .sound-btn.muted .icon-off { display: block; }
    .settings-btn.open svg { transform: rotate(60deg); }
    .settings-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 6px;
      background: #1a1a1d;
      border: 1.5px solid #3d3d40;
      padding: 4px;
      display: none;
      flex-direction: column;
      min-width: 200px;
    }
    .settings-menu.open { display: flex; }
    .settings-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      font-size: 11px;
      letter-spacing: 0.5px;
      color: #6b6b68;
      cursor: none;
      transition: color 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .settings-row.label { cursor: default; padding-bottom: 4px; }
    .settings-row.hover {
      color: #e8e8e6;
      background: rgba(232,232,230,0.04);
    }
    .settings-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #6b6b68;
      transition: background 0.15s, box-shadow 0.15s;
    }
    .effects-row.on .settings-dot {
      background: #e8e8e6;
      box-shadow: 0 0 6px rgba(232,232,230,0.5);
    }
    .effects-row.hover .settings-dot { background: #e8e8e6; }
    .settings-divider {
      height: 1px;
      background: #3d3d40;
      margin: 4px 0;
    }
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      padding: 4px 10px 8px;
    }
    .palette-swatch {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      cursor: none;
      border: 1.5px solid transparent;
      transition: border-color 0.15s, transform 0.15s;
      box-sizing: border-box;
    }
    .palette-swatch.hover { transform: scale(1.15); }
    .palette-swatch.selected { border-color: #e8e8e6; }
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
    .nav-btn.hover { color: #e8e8e6; }
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
      cursor: none;
      transition: color 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .nav-item.hover {
      color: #e8e8e6;
      background: rgba(232,232,230,0.04);
    }
    .game-title {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      pointer-events: none;
      font-family: "Archivo Black", sans-serif;
      font-size: 10px;
      font-weight: 400;
      letter-spacing: 0.5px;
      color: #e8e8e6;
      padding: 6px 10px;
      transition: opacity 200ms ease, transform 200ms ease;
    }
    .game-title.swap-out {
      opacity: 0;
      transform: translateX(-50%) translateY(-6px);
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // The shell exposes window.GameShell to drive the two-iframe crossfade;
  // standalone game pages don't have it.
  const shell = window.GameShell || null;
  const isShell = !!shell;

  // Local-nav mode (cross-origin iframe in Chrome on file://, or a game
  // opened directly outside the shell) reloads via location.href, so the
  // shell's two-iframe crossfade never runs. Add a body-level fade so the
  // transition is still smooth: pre-paint at opacity 0 and fade up once
  // we've kicked off, then fade down right before navigating away.
  if (!isShell) {
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
      body { opacity: 0; transition: opacity 280ms ease; }
      body.fade-in { opacity: 1; }
    `;
    document.head.appendChild(fadeStyle);
    const fadeIn = () => {
      // Two rAFs so the initial opacity:0 paints before we transition up.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.body.classList.add('fade-in');
      }));
    };
    if (document.body) fadeIn();
    else addEventListener('DOMContentLoaded', fadeIn);
  }

  const nav = document.createElement('div');
  nav.className = 'nav';
  nav.innerHTML = `
    <div class="nav-btn">
      <span>OTHER GAMES</span>
      <span class="nav-caret">▾</span>
    </div>
    <div class="nav-menu"></div>
  `;
  document.body.appendChild(nav);

  // Cursor color palette — shared across games via the `arenaCursorColor`
  // localStorage key. Game render loops re-read that key each frame, so
  // changes here propagate without page reload.
  const PALETTE = [
    { name: 'DEFAULT', value: '#e8e8e6' },
    { name: 'RED',     value: '#e85d4a' },
    { name: 'AMBER',   value: '#e8a64a' },
    { name: 'LIME',    value: '#a8e84a' },
    { name: 'MINT',    value: '#4ae8b4' },
    { name: 'BLUE',    value: '#4aa6e8' },
    { name: 'VIOLET',  value: '#b44ae8' },
  ];

  // Right-side settings menu: the gear icon is the trigger, and the
  // dropdown holds the EFFECTS toggle + the cursor color palette.
  // Icons are inlined so they paint without an extra HTTP fetch — important
  // when running off file:// where mask-image url() requests can fail and
  // leave the icon-btn boxes empty.
  const ICON_VOLUME_ON = `<svg class="icon-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>`;
  const ICON_VOLUME_OFF = `<svg class="icon-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>`;
  const ICON_SETTINGS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
  const sideNav = document.createElement('div');
  sideNav.className = 'side-nav';
  sideNav.innerHTML = `
    <div class="icon-btn sound-btn" aria-label="Sound">${ICON_VOLUME_ON}${ICON_VOLUME_OFF}</div>
    <div class="icon-btn settings-btn" aria-label="Settings">${ICON_SETTINGS}</div>
    <div class="settings-menu">
      <div class="settings-row effects-row">
        <span>EFFECTS</span>
        <span class="settings-dot"></span>
      </div>
      <div class="settings-divider"></div>
      <div class="settings-row label"><span>CURSOR</span></div>
      <div class="palette-grid">
        ${PALETTE.map(p =>
          `<div class="palette-swatch" style="background:${p.value}" data-color="${p.value}" title="${p.name}"></div>`
        ).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(sideNav);

  const navBtn = nav.querySelector('.nav-btn');
  const navMenu = nav.querySelector('.nav-menu');
  const soundBtn = sideNav.querySelector('.sound-btn');
  const settingsBtn = sideNav.querySelector('.settings-btn');
  const settingsMenu = sideNav.querySelector('.settings-menu');
  const effectsRow = sideNav.querySelector('.effects-row');
  const swatchEls = [...sideNav.querySelectorAll('.palette-swatch')];

  const titleEl = document.createElement('div');
  titleEl.className = 'game-title';
  document.body.appendChild(titleEl);

  let navOpen = false;
  let settingsOpen = false;
  let navBtnRect = navBtn.getBoundingClientRect();
  let soundBtnRect = soundBtn.getBoundingClientRect();
  let settingsBtnRect = settingsBtn.getBoundingClientRect();
  let effectsRowRect = effectsRow.getBoundingClientRect();
  let swatchRects = [];
  let navItemRefs = [];
  let navItemRects = [];

  // Mute state lives in localStorage so the iframe's Sound module reads
  // the same value without any cross-frame coordination.
  const SOUND_KEY = 'penardiumMuted';
  function isSoundOn() {
    return localStorage.getItem(SOUND_KEY) !== '1';
  }
  function updateSoundBtn() {
    // .muted swaps which inline SVG is visible (volume-x vs volume-2).
    soundBtn.classList.toggle('muted', !isSoundOn());
  }
  function toggleSound() {
    const nowOn = !isSoundOn();
    localStorage.setItem(SOUND_KEY, nowOn ? '0' : '1');
    updateSoundBtn();
    // audible confirmation when turning it back on
    if (nowOn && window.Sound) window.Sound.click();
  }
  updateSoundBtn();

  // Background-effects toggle. When OFF, BackgroundFX paints just the flat
  // charcoal bg (the "original" look). State is shared with the shell via
  // localStorage; in a cross-origin iframe (Chrome on file://) we also
  // postMessage the parent so its own localStorage / canvas pick it up.
  const BG_KEY = 'penardiumBgOff';
  function isBgOn() {
    return localStorage.getItem(BG_KEY) !== '1';
  }
  function updateEffectsRow() {
    effectsRow.classList.toggle('on', isBgOn());
  }
  function toggleBg() {
    const nowOn = !isBgOn();
    localStorage.setItem(BG_KEY, nowOn ? '0' : '1');
    updateEffectsRow();
    if (window !== window.top) {
      try {
        window.top.postMessage({ type: 'gameBg:set', off: !nowOn }, '*');
      } catch (e) {}
    }
  }
  updateEffectsRow();

  // Cursor color — games re-read this from localStorage each frame, so we
  // just update the storage key and the swatch ring; the next render picks
  // it up. (Same-origin frames also get a 'storage' event, cross-origin
  // doesn't — but the per-frame read covers both.)
  const CURSOR_KEY = 'arenaCursorColor';
  function getCursorColor() {
    return localStorage.getItem(CURSOR_KEY) || PALETTE[0].value;
  }
  function updatePaletteUI() {
    const current = getCursorColor();
    swatchEls.forEach(el => {
      el.classList.toggle('selected', el.dataset.color === current);
    });
  }
  function setCursorColor(value) {
    localStorage.setItem(CURSOR_KEY, value);
    updatePaletteUI();
  }
  updatePaletteUI();

  // Pick up changes made by other windows (storage event fires across
  // same-origin documents — harmless if it never fires).
  addEventListener('storage', (e) => {
    if (e.key === SOUND_KEY) updateSoundBtn();
    if (e.key === BG_KEY) updateEffectsRow();
    if (e.key === CURSOR_KEY) updatePaletteUI();
  });

  function currentFile() {
    if (isShell) return shell.getCurrentFile();
    return location.pathname.split('/').pop();
  }

  function renderItems() {
    const current = currentFile();
    const others = GAMES.filter(g => g.file !== current);
    navMenu.innerHTML = others.map(g =>
      `<div class="nav-item" data-file="${g.file}">${g.name}</div>`
    ).join('');
    navItemRefs = [...navMenu.querySelectorAll('.nav-item')].map(el => ({
      el,
      file: el.dataset.file,
    }));
    updateTitle();
    refreshRects();
  }

  function updateTitle() {
    const current = currentFile();
    const game = GAMES.find(g => g.file === current);
    const next = game ? game.name : '';
    if (titleEl.textContent === next && !titleEl.classList.contains('swap-out')) return;

    // First render: snap in without animation so the title doesn't pop on load.
    if (!titleEl.textContent) {
      titleEl.textContent = next;
      return;
    }

    const finalize = () => {
      titleEl.textContent = next;
      // Two rAFs so the text/layout commits before the class flip transitions.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        titleEl.classList.remove('swap-out');
      }));
    };

    // navigateTo() pre-fades the title at click-time; just swap the text and
    // fade back in. Otherwise (hashchange, etc.) do the full fade-out → swap →
    // fade-in cycle ourselves.
    if (titleEl.classList.contains('swap-out')) {
      finalize();
    } else {
      titleEl.classList.add('swap-out');
      setTimeout(finalize, 200);
    }
  }

  function refreshRects() {
    navBtnRect = navBtn.getBoundingClientRect();
    soundBtnRect = soundBtn.getBoundingClientRect();
    settingsBtnRect = settingsBtn.getBoundingClientRect();
    effectsRowRect = effectsRow.getBoundingClientRect();
    swatchRects = swatchEls.map(el => ({
      el, color: el.dataset.color, rect: el.getBoundingClientRect(),
    }));
    navItemRects = navItemRefs.map(({ el, file }) => ({
      el, file, rect: el.getBoundingClientRect(),
    }));
  }

  function setOpen(open) {
    navOpen = open;
    navMenu.classList.toggle('open', navOpen);
    navBtn.classList.toggle('open', navOpen);
    if (open) setSettingsOpen(false);
    refreshRects();
  }

  function setSettingsOpen(open) {
    settingsOpen = open;
    settingsMenu.classList.toggle('open', settingsOpen);
    settingsBtn.classList.toggle('open', settingsOpen);
    if (open) setOpen(false);
    refreshRects();
  }

  function inRect(x, y, r) {
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function navigateTo(file) {
    setOpen(false);
    // Pre-fade the title at click-time so the user gets immediate feedback —
    // updateTitle() will swap the text and fade it back in once the new
    // iframe's load event fires (which is also when the iframe crossfade
    // resolves), so both animations land together.
    titleEl.classList.add('swap-out');
    if (isShell) {
      shell.navigate(file);
      // The shell will fire onChange once the new iframe finishes loading,
      // which re-renders the menu/title. We don't update either here so the
      // user keeps seeing the *current* game labeled until the swap lands.
      return;
    }
    // Local-nav: drop the fade-in class so the body transitions back to
    // opacity 0, then trigger the actual page nav once the fade completes.
    // The new page boots up at opacity 0 and fades in via the same hook.
    document.body.classList.remove('fade-in');
    setTimeout(() => { location.href = file; }, 280);
  }

  renderItems();
  addEventListener('resize', refreshRects);

  // If the active iframe is cross-origin (e.g. file:// in Chrome where every
  // file is its own origin), the iframe builds its own local nav and we'd
  // render a second one in the shell. Detect that case and hide ours so the
  // user only sees one. Same-origin → shell's nav stays and proxies as designed.
  if (isShell) {
    const updateNavVisibility = () => {
      const display = shell.isCrossOrigin() ? 'none' : '';
      nav.style.display = display;
      sideNav.style.display = display;
      titleEl.style.display = display;
    };
    shell.onChange(() => {
      updateNavVisibility();
      renderItems();
    });
    updateNavVisibility();
  }

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
      if (inRect(x, y, soundBtnRect)) {
        soundBtn.classList.add('hover');
        any = true;
      } else {
        soundBtn.classList.remove('hover');
      }
      if (inRect(x, y, settingsBtnRect)) {
        settingsBtn.classList.add('hover');
        any = true;
      } else {
        settingsBtn.classList.remove('hover');
      }
      if (settingsOpen) {
        if (inRect(x, y, effectsRowRect)) {
          effectsRow.classList.add('hover');
          any = true;
        } else {
          effectsRow.classList.remove('hover');
        }
        for (const { el, rect } of swatchRects) {
          if (inRect(x, y, rect)) {
            el.classList.add('hover');
            any = true;
          } else {
            el.classList.remove('hover');
          }
        }
      } else {
        effectsRow.classList.remove('hover');
        swatchEls.forEach(el => el.classList.remove('hover'));
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
        navItemRefs.forEach(({ el }) => el.classList.remove('hover'));
      }
      return any;
    },
    // Handle a click forwarded from the game's window-level handler.
    // Returns true if the click hit the nav (so the game should bail out
    // of its own click handling).
    handleClick(x, y) {
      if (inRect(x, y, navBtnRect)) {
        setOpen(!navOpen);
        return true;
      }
      if (inRect(x, y, soundBtnRect)) {
        setOpen(false);
        setSettingsOpen(false);
        toggleSound();
        return true;
      }
      if (inRect(x, y, settingsBtnRect)) {
        setSettingsOpen(!settingsOpen);
        return true;
      }
      if (settingsOpen) {
        if (inRect(x, y, effectsRowRect)) {
          toggleBg();
          return true;
        }
        for (const { rect, color } of swatchRects) {
          if (inRect(x, y, rect)) {
            setCursorColor(color);
            return true;
          }
        }
        // open + outside the settings menu: close but don't consume the click
        setSettingsOpen(false);
        // fall through so the OTHER GAMES menu logic below can also run
      }
      if (navOpen) {
        for (const { rect, file } of navItemRects) {
          if (inRect(x, y, rect)) {
            navigateTo(file);
            return true;
          }
        }
        // open + outside: close but don't consume the click
        setOpen(false);
        return false;
      }
      return false;
    },
    getCursorColor,
  };
})();
