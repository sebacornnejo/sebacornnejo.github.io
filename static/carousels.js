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
    };
    requestAnimationFrame(frame);
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
});
