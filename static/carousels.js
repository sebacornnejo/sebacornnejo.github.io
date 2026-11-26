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
    const destination = strip.scrollLeft + step * width;
    animating = true;
    $(strip).animate({ scrollLeft: destination }, 600, () => {
      if (strip.scrollLeft >= last() - 1) strip.scrollLeft = 0;
      animating = false;
    });
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
});
