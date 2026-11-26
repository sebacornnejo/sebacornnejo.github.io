document.querySelectorAll(".carousel-controls").forEach((carousel) => {
  const strip = carousel.querySelector(".carousel-inner");
  const slides = Array.from(strip.children);
  const previous = carousel.querySelector(".carousel-control-prev");
  const next = carousel.querySelector(".carousel-control-next");
  if (!slides.length || !previous || !next) return;

  const clones = slides.map((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.tabIndex = -1;
    return clone;
  });
  strip.append(...clones);

  const mobile = matchMedia("(max-width: 767px)");
  const items = [...slides, ...clones];
  const fitCurrentSlide = () => {
    if (!mobile.matches) return;
    const index = Math.round(strip.scrollLeft / slides[0].getBoundingClientRect().width);
    const height = items[index]?.offsetHeight;
    if (height) strip.style.setProperty("--carousel-height", height + "px");
  };
  const resize = new ResizeObserver(fitCurrentSlide);
  const adaptLayout = () => {
    resize.disconnect();
    if (mobile.matches) items.forEach((slide) => resize.observe(slide));
    else strip.style.removeProperty("--carousel-height");
  };
  mobile.addEventListener("change", adaptLayout);
  adaptLayout();

  let animating = false;
  const last = () => clones[0].offsetLeft - slides[0].offsetLeft;
  const move = (step) => {
    if (animating) return;
    const width = slides[0].getBoundingClientRect().width;
    if (step < 0 && strip.scrollLeft < 1) strip.scrollLeft = last();
    if (step > 0 && strip.scrollLeft >= last() - 1) strip.scrollLeft = 0;
    const initial = strip.scrollLeft;
    const started = performance.now();
    animating = true;
    if (mobile.matches) {
      const index = Math.round(initial / width);
      const height = Math.max(items[index]?.offsetHeight ?? 0, items[index + step]?.offsetHeight ?? 0);
      if (height) strip.style.setProperty("--carousel-height", height + "px");
    }
    const frame = (now) => {
      const progress = Math.min(1, (now - started) / 600);
      // Preserve the carousel's original ease-in-out curve.
      strip.scrollLeft = initial + step * width * (1 - Math.cos(progress * Math.PI)) / 2;
      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }
      if (strip.scrollLeft >= last() - 1) strip.scrollLeft = 0;
      animating = false;
      fitCurrentSlide();
    };
    requestAnimationFrame(frame);
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
});
