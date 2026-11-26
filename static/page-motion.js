(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canObserve = typeof IntersectionObserver === "function" && !reducedMotion;

  function revealOnEntry(elements, visibleClass, pendingClass) {
    const observer = canObserve && new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        if (pendingClass) target.classList.remove(pendingClass);
        target.classList.add(visibleClass);
        observer.unobserve(target);
      }
    }, { rootMargin: "0px 0px 10% 0px" });

    const toReveal = Array.from(elements, (element) => ({
      element,
      wait: observer && !element.matches("header.tag, header .tag, .home-name")
        && element.getBoundingClientRect().top >= innerHeight
    }));
    for (const {element, wait} of toReveal) {
      if (!wait) {
        element.classList.add(visibleClass);
      } else {
        if (pendingClass) element.classList.add(pendingClass);
        observer.observe(element);
      }
    }
  }

  revealOnEntry(document.querySelectorAll(".tag"), "visible", "reveal-pending");
  revealOnEntry(document.querySelectorAll(".timeline li"), "in-view");

  const headline = document.querySelector(".content-section__headline-container");
  const indicator = document.querySelector(".scroll-indicator");
  const line = indicator?.querySelector(".scroll-indicator__line");
  const labels = [...document.querySelectorAll(".fade-out")];
  const letters = [];

  if (headline) {
    const text = Array.from(headline.querySelector("h1").textContent.trim().replace(/\s+/g, " "));
    const fragment = document.createDocumentFragment();
    for (const [index, char] of text.entries()) {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00a0" : char;
      span.setAttribute("aria-hidden", "true");
      if (char === " ") span.classList.add("headline-gap");
      const position = index / Math.max(1, text.length - 1);
      letters.push({ span, speed: Math.exp(-Math.abs(position - 0.5) * 5) });
      fragment.append(span);
    }
    headline.append(fragment);
  }

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
      span.style.transform = `translate3d(0, ${-distance * speed * 5}px, 0)`;
      span.style.opacity = 1 - distance / duration;
    }
    if (indicator) indicator.style.opacity = Math.max(0, 1 - scroll / 150);
    if (line) line.style.transform = `scaleY(${Math.max(0, 1 - scroll / 100)})`;
  }

  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
  update();
})();
