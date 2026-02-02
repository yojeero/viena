
// ===================== @yojeero =====================
// ===================== VIENA PLAYER v2 =====================

const audio = new Audio();
audio.preload = "auto";
audio.crossOrigin = "anonymous";
audio.volume = 1;

let audioCtx = null;
let tracks = [];
let currentTrack = 0;
let isPlaying = false;

/* ===================== DOM ===================== */

const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const stopIcon = document.getElementById("stopIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const trackName = document.getElementById("trackName");
const artistName = document.getElementById("artistName");

const coverInner = document.getElementById("coverInner");
const coverImage = document.getElementById("coverImage");
const coverSpin = document.querySelector(".cover-spin");

const canvas = document.getElementById("visualizer");

/* ===================== AUDIO INIT ===================== */

function initAudio() {
  if (audioCtx) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  WaveformVisualizer?.init({
    audio,
    audioCtx,
    canvasEl: canvas
  });
}

/* ===================== PLAY / PAUSE ===================== */

function togglePlay() {
  if (!audioCtx) initAudio();

  if (isPlaying) {
    audio.pause();
    return;
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  audio.play();
}

/* ===================== AUDIO EVENTS ===================== */

audio.addEventListener("play", () => {
  isPlaying = true;
  playBtn.classList.add("is-playing");
  coverInner.classList.add("is-playing");

  coverSpin.classList.remove("is-reset");
  coverSpin.style.animationPlayState = "running";

  WaveformVisualizer?.start();
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playBtn.classList.remove("is-playing");
  coverInner.classList.remove("is-playing");

  coverSpin.classList.add("is-reset");
  WaveformVisualizer?.stop();
});

/* ===================== CONTROLS ===================== */

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

function resetCoverRotation() {
  coverSpin.classList.add("is-reset");
}

function nextTrack() {
  if (!tracks.length) return;
  resetCoverRotation();

  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);

  if (isPlaying) audio.play();
}

function prevTrack() {
  if (!tracks.length) return;
  resetCoverRotation();

  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);

  if (isPlaying) audio.play();
}

/* ===================== COLOR FROM COVER ===================== */

function getDominantColor(img) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");

  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, c.width, c.height).data;

  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 20) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  r /= count; g /= count; b /= count;

  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  const boost = brightness < 120 ? 1.3 : 0.9;

  return [
    Math.min(255, Math.round(r * boost)),
    Math.min(255, Math.round(g * boost)),
    Math.min(255, Math.round(b * boost))
  ];
}

/* ===================== UI ===================== */

function loadTrack(index) {
  const t = tracks[index];
  if (!t) return;

  audio.src = t.src;
  audio.load();

  trackName.textContent = t.name;
  artistName.textContent = t.artist;

  coverImage.onload = () => {
    const color = getDominantColor(coverImage);
    WaveformVisualizer?.setColor(color);
  };

  coverImage.src = t.cover;
}

/* ===================== INIT ===================== */

(async function init() {
  tracks = await fetch("js/tracks.json").then(r => r.json());
  loadTrack(0);

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
})();

/* ===================== CANVAS RESIZE ===================== */

function resizeCanvas() {
  WaveformVisualizer?.resizeCanvas();
}

/* ===================== KEYBOARD ===================== */

function handleKeydown(e) {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlay();
      break;
    case "ArrowRight":
      nextTrack();
      break;
    case "ArrowLeft":
      prevTrack();
      break;
  }
}

document.addEventListener("keydown", handleKeydown);

playBtn.addEventListener("mousemove", e => {
  const r = playBtn.getBoundingClientRect();
  playBtn.style.setProperty("--x", `${e.clientX - r.left}px`);
  playBtn.style.setProperty("--y", `${e.clientY - r.top}px`);
});

playBtn.addEventListener("mouseleave", () => {
  playBtn.style.setProperty("--x", "50%");
  playBtn.style.setProperty("--y", "50%");
});

