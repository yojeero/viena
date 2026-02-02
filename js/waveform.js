// ===================== @yojeero =====================
// ===================== VIENA WAVEFORM v5 =====================
window.WaveformVisualizer = (function () {
  let canvas, ctx, animFrame;
  const barCount = 120;
  let offsets, speeds;

  // ---- Colors and smooth mixing ----
  let colorFrom = [184, 230, 254];
  let colorTo = [184, 230, 254];
  let mix = 1;

  // --- Heart Rate Settings ---
  // 0.0015 very slow, almost breathing 
  // 0.0025 soft ambient 
  // 0.003 ideal for radio 
  // 0.004–0.005 noticeable pulse 
  // > 0.006 is already “beating” like a beat
  const pulseConfig = {
    speed: 0.003,    // heart rate (smaller = slower)
    strength: 0.15    // pulsation strength
  };

  function init({ canvasEl }) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");

    offsets = Array.from({ length: barCount }, () => Math.random() * Math.PI * 2);
    speeds = Array.from({ length: barCount }, () => 0.02 + Math.random() * 0.05);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  function setColor(rgb) {
    colorFrom = [...colorTo];
    colorTo = rgb;
    mix = 0;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function currentColor() {
    mix = Math.min(mix + 0.02, 1);
    return [
      Math.round(lerp(colorFrom[0], colorTo[0], mix)),
      Math.round(lerp(colorFrom[1], colorTo[1], mix)),
      Math.round(lerp(colorFrom[2], colorTo[2], mix))
    ];
  }

  function draw() {
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const centerY = h / 2;
    const barW = w / barCount;

    ctx.clearRect(0, 0, w, h);

    // --- gradient color with light pulse alpha ---
    const [r, g, b] = currentColor();
    const gradientAlpha = 0.25 + Math.random() * 0.05;
    const gradient = ctx.createLinearGradient(0, centerY, 0, 0);
    gradient.addColorStop(0, `rgba(${r},${g},${b},${gradientAlpha})`);
    gradient.addColorStop(1, `rgb(${r},${g},${b})`);
    ctx.fillStyle = gradient;

    const centerZone = 0.6;      // central zone for height limitation
    const maxCenterHeight = 0.2; // maximum height in the center
    const audioLevel = (window.audio && audio.volume) || 0;

    // --- center ripple (mixed sine + low-freq noise) ---
    const pulse =
      Math.sin(Date.now() * pulseConfig.speed) * 0.7 +
      Math.sin(Date.now() * pulseConfig.speed * 0.5) * 0.3 +
      (Math.random() - 0.5) * 0.02; // микро-шум
    const centerPulse = 1 + pulseConfig.strength * audioLevel * pulse;

    for (let i = 0; i < barCount; i++) {
      offsets[i] += speeds[i];

      const t = Math.abs(i / (barCount - 1) - 0.5) * 2; //distance from center 0..1

      const shape = Math.pow(1 - t, 2.6);
      const wave = (Math.sin(offsets[i]) + 1) / 2;
      const centerDip = 1 - Math.exp(-t * 6) * 0.18;
      const centerBreath = 1 + Math.sin(offsets[i] * 1.2 + i * 0.3) * 0.12 * Math.exp(-t * 4);

      // center height limit
      let centerLimit = 1;
      if (t < centerZone / 2) {
        const factor = t / (centerZone / 2);
        centerLimit = maxCenterHeight + (1 - maxCenterHeight) * factor;
      }

      // light jitter for edges
      let edgeBoost = 1;
      if (t > 0.8) {
        const jitter = (Math.random() - 0.5) * 0.05;
        edgeBoost = 1 + Math.sin(offsets[i] * 3 + i) * 0.15 + jitter;
      }

      // micro vibrations for airiness
      const microJitter = (Math.random() - 0.5) * 0.02;

      // final amplitude
      const pulseFactor = t < centerZone / 2 ? centerPulse : 1;
      const amplitude = shape * wave * centerDip * centerBreath * centerLimit * edgeBoost * pulseFactor * (1 + microJitter) * h * 0.45;

      const x = i * barW + barW * 0.1;
      const y = centerY - amplitude;
      const height = amplitude * 2;
      const radius = Math.min(barW * 0.4, height / 2);

      drawRoundedBar(x, y, barW * 0.6, height, radius, r, g, b);
    }

    // --- limit FPS for light loads ---
    animFrame = setTimeout(draw, 1000 / 35);
  }

  function drawRoundedBar(x, y, w, h, r, rCol, gCol, bCol) {
    ctx.shadowColor = `rgba(${rCol},${gCol},${bCol},0.3)`;
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  function start() {
    if (!animFrame) draw();
  }

  function stop() {
    if (animFrame) clearTimeout(animFrame);
    animFrame = null;
  }

  return {
    init,
    resizeCanvas,
    start,
    stop,
    setColor
  };
})();
