/* ============================================================
   BL4DE portfolio — main script
   ============================================================ */

const root = document.documentElement;
const body = document.body;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Loader exit ── */
const loader = document.getElementById("siteLoader");
if (loader) {
  const exitDelay = reduceMotion ? 100 : 1850;
  setTimeout(() => {
    loader.classList.add("exiting");
    setTimeout(() => loader.remove(), 520);
  }, exitDelay);
}

/* ── Mobile nav toggle ── */
const navToggle = document.querySelector(".nav-toggle");
const navLinks  = document.querySelectorAll(".site-nav a");

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ── Role switcher ── */
const roleText = document.querySelector("#roleText");
const roles = [
  "ai tools that pull weight",
  "clean websites from scratch",
  "bots that actually help",
  "edits that hit different",
  "backend that just works"
];

let roleIndex = 0;
if (roleText && !reduceMotion) {
  window.setInterval(() => {
    roleText.classList.add("switching");
    window.setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.textContent = roles[roleIndex];
      roleText.classList.remove("switching");
    }, 220);
  }, 2400);
}

/* ── Scroll reveal ── */
const revealItems = [...document.querySelectorAll(".reveal")];
revealItems.forEach((item, index) => {
  item.style.setProperty("--delay", `${Math.min(index % 7, 6) * 70}ms`);
});

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

/* ── Magnetic buttons ── */
const magneticItems = document.querySelectorAll("[data-magnet]");
magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (reduceMotion) return;
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width  / 2;
    const y = event.clientY - rect.top  - rect.height / 2;
    item.style.transform = `translate3d(${x * 0.12}px, ${y * 0.16}px, 0)`;
  });
  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

/* ── 3D tilt cards ── */
const tiltItems = document.querySelectorAll("[data-tilt]");
tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (reduceMotion) return;
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width  - 0.5;
    const y = (event.clientY - rect.top)  / rect.height - 0.5;
    item.style.setProperty("--ry", `${x * 7}deg`);
    item.style.setProperty("--rx", `${y * -7}deg`);
  });
  item.addEventListener("pointerleave", () => {
    item.style.setProperty("--ry", "0deg");
    item.style.setProperty("--rx", "0deg");
  });
});

/* ── Pointer sheen tracker ── */
window.addEventListener(
  "pointermove",
  (event) => {
    root.style.setProperty("--mx", `${event.clientX}px`);
    root.style.setProperty("--my", `${event.clientY}px`);
  },
  { passive: true }
);

/* ── Liquid canvas background ── */
const canvas = document.querySelector("#liquidCanvas");
const ctx    = canvas?.getContext("2d");
let width = 0, height = 0, dpr = 1, frame = 0;
let pointer = { x: 0.5, y: 0.35 };

function resizeCanvas() {
  if (!canvas || !ctx) return;
  dpr    = Math.min(window.devicePixelRatio || 1, 1.6);
  width  = window.innerWidth;
  height = window.innerHeight;
  canvas.width  = Math.floor(width  * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width  = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawRibbon(yBase, amplitude, phase, colorA, colorB, thickness) {
  if (!ctx) return;
  const grad = ctx.createLinearGradient(0, yBase - amplitude, width, yBase + amplitude);
  grad.addColorStop(0,    "rgba(255,255,255,0)");
  grad.addColorStop(0.24, colorA);
  grad.addColorStop(0.54, colorB);
  grad.addColorStop(1,    "rgba(255,255,255,0)");

  ctx.beginPath();
  for (let x = -80; x <= width + 80; x += 34) {
    const drift       = Math.sin(x * 0.008 + phase) * amplitude;
    const pointerPull = Math.sin((x / Math.max(width, 1)) * Math.PI) * (pointer.y - 0.5) * 42;
    const y = yBase + drift + pointerPull;
    if (x === -80) ctx.moveTo(x, y);
    else           ctx.lineTo(x, y);
  }
  ctx.lineWidth   = thickness;
  ctx.lineCap     = "round";
  ctx.strokeStyle = grad;
  ctx.shadowColor = "rgba(229,9,20,0.12)";
  ctx.shadowBlur  = 24;
  ctx.stroke();
  ctx.shadowBlur  = 0;
}

function drawLiquid() {
  if (!canvas || !ctx || reduceMotion) return;
  frame += 0.012;
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";

  drawRibbon(height * 0.18, 26, frame + pointer.x * 1.6, "rgba(229,9,20,0.16)", "rgba(255,255,255,0.68)", 38);
  drawRibbon(height * 0.46, 34, frame * 0.82 + 2.2,      "rgba(9,9,11,0.08)",   "rgba(229,9,20,0.12)",   46);
  drawRibbon(height * 0.74, 30, frame * 1.1  + 4.1,      "rgba(255,255,255,0.72)","rgba(229,9,20,0.12)", 42);

  ctx.globalAlpha  = 0.38;
  ctx.strokeStyle  = "rgba(9,9,11,0.06)";
  ctx.lineWidth    = 1;
  for (let i = 0; i < 7; i++) {
    const y = height * (0.15 + i * 0.12) + Math.sin(frame + i) * 10;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(width * 0.25, y + 22, width * 0.58, y - 28, width, y + 12);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  window.requestAnimationFrame(drawLiquid);
}

window.addEventListener("pointermove", (event) => {
  pointer = {
    x: event.clientX / Math.max(window.innerWidth,  1),
    y: event.clientY / Math.max(window.innerHeight, 1)
  };
}, { passive: true });

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
if (!reduceMotion) drawLiquid();
