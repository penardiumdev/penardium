(function () {
  const BG = '#1a1a1d';
  const BG_BLOBS = [
    { color: '88,60,140',  baseR: 520, ax: 0.32, ay: 0.45, kx: 0.000045, ky: 0.000033, phaseX: 0.0, phaseY: 1.7, alpha: 0.55 },
    { color: '180,74,232', baseR: 460, ax: 0.28, ay: 0.40, kx: 0.000058, ky: 0.000041, phaseX: 2.1, phaseY: 0.4, alpha: 0.40 },
    { color: '74,166,232', baseR: 580, ax: 0.36, ay: 0.50, kx: 0.000034, ky: 0.000049, phaseX: 4.3, phaseY: 2.9, alpha: 0.45 },
    { color: '232,93,74',  baseR: 420, ax: 0.30, ay: 0.42, kx: 0.000052, ky: 0.000028, phaseX: 5.6, phaseY: 4.1, alpha: 0.30 },
  ];

  let canvas, ctx, W, H, DPR = 1;

  function resize() {
    DPR = devicePixelRatio || 1;
    W = innerWidth; H = innerHeight;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function frame(now) {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // Effects off → just the flat charcoal bg, no blobs / vignette. The
    // raf loop keeps running so flipping it back on takes effect on the
    // next frame.
    if (localStorage.getItem('penardiumBgOff') === '1') {
      requestAnimationFrame(frame);
      return;
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const b of BG_BLOBS) {
      const cx = W * 0.5 + Math.sin(now * b.kx + b.phaseX) * W * b.ax;
      const cy = H * 0.5 + Math.cos(now * b.ky + b.phaseY) * H * b.ay;
      const r = b.baseR + Math.sin(now * 0.0004 + b.phaseX) * 60;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0,    `rgba(${b.color},${b.alpha})`);
      grad.addColorStop(0.4,  `rgba(${b.color},${b.alpha * 0.4})`);
      grad.addColorStop(1,    `rgba(${b.color},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W,H) * 0.35, W/2, H/2, Math.max(W,H) * 0.75);
    vg.addColorStop(0, 'rgba(26,26,29,0)');
    vg.addColorStop(1, 'rgba(26,26,29,0.85)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(frame);
  }

  window.BackgroundFX = {
    start(el) {
      canvas = el;
      ctx = canvas.getContext('2d');
      addEventListener('resize', resize);
      resize();
      requestAnimationFrame(frame);
    },
  };
})();
