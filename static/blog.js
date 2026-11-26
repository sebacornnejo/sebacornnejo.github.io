document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("#blog-posts");
  const cards = Array.from(list.querySelectorAll("a[data-modal-target]"));
  const groups = cards.map((card) => ({
    wrapper: card.parentElement,
    details: document.querySelector(card.dataset.modalTarget)
  }));
  const fragment = document.createDocumentFragment();

  // Keep each preview paired with its card while shuffling the presentation order.
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }
  groups.forEach(({ wrapper, details }, index) => {
    cards[index].classList.toggle("active", index === 0);
    fragment.append(wrapper, details);
  });
  list.append(fragment);

  const panel = document.querySelector("#postDetailModal");
  const modal = bootstrap.Modal.getOrCreateInstance(panel);
  const modalBody = panel.querySelector(".modal-body");
  const previous = panel.querySelector("#prevModalBtn");
  const next = panel.querySelector("#nextModalBtn");
  let current = 0;
  let trigger;

  function showEntry(index) {
    current = (index + cards.length) % cards.length;
    modalBody.replaceChildren(...Array.from(groups[current].details.children, (node) => node.cloneNode(true)));
    for (const image of modalBody.querySelectorAll("img[data-modal-src]")) image.src = image.dataset.modalSrc;
    panel.scrollTop = 0;
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      trigger = card;
      showEntry(index);
      modal.show(card);
    });
  });
  previous.disabled = next.disabled = cards.length < 2;
  previous.addEventListener("click", () => showEntry(current - 1));
  next.addEventListener("click", () => showEntry(current + 1));
  panel.addEventListener("hidden.bs.modal", () => trigger?.focus());
});
