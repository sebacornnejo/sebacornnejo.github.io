for (const card of document.querySelectorAll(".home-skill-card")) {
  const show = (expanded) => card.setAttribute("aria-expanded", String(expanded));
  card.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") show(true);
  });
  card.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") show(false);
  });
  card.addEventListener("click", () => show(card.getAttribute("aria-expanded") !== "true"));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Escape") show(false);
  });
}
