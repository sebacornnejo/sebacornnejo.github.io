const signoff = document.querySelector(".signoff-line");
if (signoff && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  signoff.style.setProperty("--letters", String(signoff.textContent.trim().length));
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      signoff.classList.add("typing");
      observer.disconnect();
    }
  });
  observer.observe(signoff);
}
