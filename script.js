
AOS.init({
once: false,
mirror: true,
});



const header = document.querySelector('header');
const showThresholdTop = 80; // до скольки px сверху — прозрачный

function onScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop <= showThresholdTop) {
    header.classList.remove('scrolled');
  } else {
    header.classList.add('scrolled');
  }
}

window.addEventListener('scroll', onScroll);
onScroll();



(() => {
  const root = document.getElementById("textillate");
  if (!root) return;

  const phrases = [
    "Lower Cost at Scale",
    "Faster Time-to-Market",
    "Immediate Access to Scarce Expertise",
    "Predictable Cost Control",
    "Operational Flexibility",
    "Focus on Value-Adding Work"
  ];

  const letterDelay = 60;       // как в WP delay='60'
  const minDisplayTime = 2000;  // как minDisplayTime='2000'
  const inAnimMs = 450;
  const outAnimMs = 450;

  let i = 0;

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  function render(text){
    root.classList.remove("ti-line-out");
    root.innerHTML = "";

    // чтобы screen reader не “читал” по буквам:
    root.setAttribute("aria-label", text);

    const wrap = document.createElement("span");
    wrap.style.display = "inline-block";

    [...text].forEach((ch, idx) => {
      const s = document.createElement("span");
      s.className = "ti-letter";
      s.textContent = (ch === " ") ? "\u00A0" : ch;
      s.style.animationDelay = `${idx * letterDelay}ms`;
      wrap.appendChild(s);
    });

    root.appendChild(wrap);

    // время, когда последняя буква точно уже появилась
    return (text.length - 1) * letterDelay + inAnimMs;
  }

  async function loop(){
    while (true){
      const text = phrases[i];
      const inTotal = render(text);

      // держим после “въезда” букв
      await wait(inTotal + minDisplayTime);

      // fade-out всей строки
      root.classList.add("ti-line-out");
      await wait(outAnimMs);

      i = (i + 1) % phrases.length;
    }
  }

  loop();
})();


(() => {
  const stats = document.querySelectorAll(".stat");
  if (!stats.length) return;

  function animateStat(stat) {
    const valueEl = stat.querySelector(".stat__value");
    const target = Number(stat.dataset.target || 0);
    const suffix = stat.dataset.suffix || "";
    const duration = 1200; // мс
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // плавное ускорение/замедление
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * target);

      valueEl.textContent = current + suffix;

      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        animateStat(e.target);
        io.unobserve(e.target); // один раз
      }
    }
  }, { threshold: 0.35 });

  stats.forEach(s => io.observe(s));
})();


(() => {
  const root = document.querySelector(".t-slider");
  if (!root) return;

  const track = root.querySelector(".t-slider__track");
  const slides = Array.from(root.querySelectorAll(".t-slide"));
  const prevBtn = root.querySelector(".t-slider__arrow--prev");
  const nextBtn = root.querySelector(".t-slider__arrow--next");
  const dotsWrap = root.querySelector(".t-slider__dots");
  const viewport = root.querySelector(".t-slider__viewport");

  let index = 0;

  // dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.className = "t-dot" + (i === index ? " is-active" : "");
    b.type = "button";
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  // keyboard
  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  // swipe
  let x0 = null;
  viewport.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  viewport.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? goTo(index + 1) : goTo(index - 1);
  });

  render();
})();


document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('bg-video');
  if (video) {
    video.muted = true;
    video.play().catch(function (err) {
      console.log('Video autoplay error:', err);
    });
  }
});

