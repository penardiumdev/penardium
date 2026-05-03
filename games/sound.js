(function () {
  const STORAGE_KEY = 'penardiumMuted';
  let actx = null;
  let masterGain = null;

  function getCtx() {
    if (actx) return actx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    actx = new Ctx();
    masterGain = actx.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(actx.destination);
    return actx;
  }

  function isMuted() {
    return localStorage.getItem(STORAGE_KEY) === '1';
  }
  function setMuted(m) {
    localStorage.setItem(STORAGE_KEY, m ? '1' : '0');
  }

  // C major pentatonic — no half-steps, so any combination of these notes
  // sounds consonant. Five notes per octave; index past 5 wraps an octave up.
  const PENTA = [261.63, 293.66, 329.63, 392.00, 440.00];
  function penta(i) {
    if (i < 0) i = 0;
    const oct = Math.floor(i / 5);
    return PENTA[i % 5] * Math.pow(2, oct);
  }

  function note(freq, opts) {
    if (isMuted()) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    opts = opts || {};
    const t0 = ctx.currentTime + (opts.delay || 0);
    const dur = opts.dur != null ? opts.dur : 0.18;
    const peak = opts.gain != null ? opts.gain : 0.3;
    const type = opts.type || 'sine';
    const osc = ctx.createOscillator();
    osc.type = type;
    const fStart = opts.glide || freq;
    osc.frequency.setValueAtTime(fStart, t0);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, freq),
      t0 + (opts.glideDur != null ? opts.glideDur : dur * 0.5)
    );
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(peak, t0 + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(env);
    env.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // --- presets used by the games ---

  // Looping melodic phrase instead of a relentless climb — past ~12 kicks
  // the old "ascend per combo" version drifted into shrill 3kHz+ territory.
  // The phrase rises then falls within ~1.5 octaves so the rhythm still
  // feels varied combo-to-combo, while the pitch stays comfortable forever.
  // Milestones every 8 kicks get a brief octave-down "thud" to mark progress
  // without raising the headline pitch.
  const KICK_PHRASE = [0, 2, 4, 5, 7, 5, 4, 2];
  function kick(combo) {
    const c = Math.max(combo - 1, 0);
    const idx = KICK_PHRASE[c % KICK_PHRASE.length];
    note(penta(idx + 4), { type: 'triangle', dur: 0.18, gain: 0.32 });
    if (c > 0 && c % 8 === 0) {
      note(penta(0) / 2, { type: 'sine', dur: 0.22, gain: 0.22 });
    }
  }

  function bounce() {
    note(140, { type: 'sine', dur: 0.07, gain: 0.18, glide: 220, glideDur: 0.04 });
  }

  function fail() {
    note(240, { type: 'square', dur: 0.18, gain: 0.16, glide: 300, glideDur: 0.07 });
    note(160, { type: 'square', dur: 0.28, gain: 0.16, glide: 220, glideDur: 0.1, delay: 0.08 });
  }

  function start() {
    note(penta(2), { type: 'sine', dur: 0.16, gain: 0.28 });
    note(penta(4), { type: 'sine', dur: 0.16, gain: 0.28, delay: 0.08 });
    note(penta(6), { type: 'sine', dur: 0.22, gain: 0.28, delay: 0.16 });
  }

  function tick() {
    note(880, { type: 'sine', dur: 0.04, gain: 0.16 });
  }

  function pop(i) {
    const idx = Math.min(Math.max(i, 0), 24);
    note(penta(idx + 4), { type: 'triangle', dur: 0.18, gain: 0.3 });
  }

  function win() {
    note(penta(4),  { type: 'sine', dur: 0.18, gain: 0.32 });
    note(penta(6),  { type: 'sine', dur: 0.18, gain: 0.32, delay: 0.09 });
    note(penta(8),  { type: 'sine', dur: 0.22, gain: 0.32, delay: 0.18 });
    note(penta(10), { type: 'sine', dur: 0.36, gain: 0.32, delay: 0.27 });
  }

  function click() {
    note(660, { type: 'triangle', dur: 0.04, gain: 0.18 });
  }

  window.Sound = {
    note, kick, bounce, fail, start, tick, pop, win, click,
    isMuted, setMuted,
  };
})();
