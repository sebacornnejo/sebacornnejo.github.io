(() => {
  const character = document.getElementById("bee");
  if (!character) return;

  character.style.position = "fixed";
  character.style.left = "0";
  character.style.top = "0";
  character.style.visibility = "hidden";
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  character.style.translate = "0px 0px";
  character.style.transition = "translate 320ms cubic-bezier(.18, .72, .25, 1)";
  character.style.willChange = "translate";
  let previousX = 0;

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    if (event.clientX !== previousX) {
      character.style.transform = event.clientX > previousX ? "scaleX(1)" : "scaleX(-1)";
      previousX = event.clientX;
    }
    character.style.visibility = "visible";
    character.style.translate = `${event.clientX}px ${event.clientY}px`;
  }, { passive: true });
})();
