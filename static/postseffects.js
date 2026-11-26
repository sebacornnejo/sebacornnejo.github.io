for (const card of document.querySelectorAll(".card-project")) {
  const elements = card.querySelectorAll(".carousel-caption, .imagen-filtrada");
  card.addEventListener("mouseenter", () => {
    for (const element of elements) element.classList.add("active");
  });
  card.addEventListener("mouseleave", () => {
    for (const element of elements) element.classList.remove("active");
  });
}
