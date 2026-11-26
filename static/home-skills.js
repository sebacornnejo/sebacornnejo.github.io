for (const card of document.querySelectorAll(".home-skill-card")) {
  const description = card.querySelector(".home-skill-text").id;
  const show = (expanded) => {
    card.setAttribute("aria-expanded", String(expanded));
    if (expanded) card.setAttribute("aria-describedby", description);
    else card.removeAttribute("aria-describedby");
  };
  card.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") show(true);
  });
  card.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") show(false);
  });
  card.addEventListener("click", (event) => {
    show(event.pointerType === "mouse" || card.getAttribute("aria-expanded") !== "true");
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Escape") show(false);
  });
}
