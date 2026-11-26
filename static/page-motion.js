(() => {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("preload");
    document.querySelector(".loader-wrapper")?.classList.add("loader-finished");
  }, { once: true });

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canObserve = typeof IntersectionObserver === "function" && !reducedMotion;

  function revealOnEntry(elements, visibleClass, pendingClass) {
    const observer = canObserve && new IntersectionObserver((entries) => {
      for (const { target, isIntersecting, boundingClientRect } of entries) {
        if (!isIntersecting && boundingClientRect.top > 0) {
          if (pendingClass) target.classList.add(pendingClass);
          continue;
        }
        if (pendingClass) target.classList.remove(pendingClass);
        target.classList.add(visibleClass);
        observer.unobserve(target);
      }
    }, { rootMargin: "0px 0px 10% 0px" });

    for (const element of elements) {
      if (observer && !element.matches("header.tag, header .tag, .home-name")) observer.observe(element);
      else element.classList.add(visibleClass);
    }
  }

  revealOnEntry(document.querySelectorAll(".tag"), "visible", "reveal-pending");
  revealOnEntry(document.querySelectorAll(".timeline li"), "in-view");

  const indicator = document.querySelector(".scroll-indicator");
  const line = indicator?.querySelector(".scroll-indicator__line");
  const labels = [...document.querySelectorAll(".fade-out")];
  const spans = [...document.querySelectorAll(".content-section__headline-container > span[aria-hidden]")];
  const letters = spans.map((span, index) => {
    const position = index / Math.max(1, spans.length - 1);
    return { span, speed: Math.exp(-Math.abs(position - 0.5) * 5) };
  });

  if (reducedMotion || (!letters.length && !labels.length)) return;
  const duration = 200 + Math.floor(Math.random() * 200);
  let frame = 0;
  let previousScroll = -1;

  function update() {
    frame = 0;
    const scroll = Math.min(Math.max(0, scrollY), Math.max(duration, innerHeight));
    if (scroll === previousScroll) return;
    previousScroll = scroll;

    const opacity = labels.map((label) => {
      const bounds = label.getBoundingClientRect();
      return Math.max(0, Math.min(1, 1.2 + bounds.top / Math.max(1, bounds.height)));
    });
    labels.forEach((label, index) => { label.style.opacity = opacity[index]; });

    const distance = Math.min(duration, scroll);
    for (const { span, speed } of letters) {
      span.style.transform = distance > 0 && distance < duration ? `translate3d(0, ${-distance * speed * 5}px, 0)` : "";
      span.style.opacity = 1 - distance / duration;
    }
    if (indicator) indicator.style.opacity = Math.max(0, 1 - scroll / 150);
    if (line) line.style.transform = `scaleY(${Math.max(0, 1 - scroll / 100)})`;
  }

  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
  if (scrollY) update();
})();
