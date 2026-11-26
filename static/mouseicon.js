(() => {
  const character = document.getElementById("bee");
  if (!character) return;

  character.style.position = "fixed";
  character.style.left = "0";
  character.style.top = "0";
  character.style.visibility = "hidden";
  character.style.transition = "none";
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let direction = 1;
  let frame = 0;

  const follow = () => {
    x += (targetX - x) * 0.08;
    y += (targetY - y) * 0.22;
    character.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${direction})`;
    frame = Math.abs(targetX - x) < 1 && Math.abs(targetY - y) < 1 ? 0 : requestAnimationFrame(follow);
  };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    targetX = event.clientX;
    targetY = event.clientY;
    direction = targetX >= x ? 1 : -1;
    character.style.visibility = "visible";
    if (!frame) frame = requestAnimationFrame(follow);
  }, { passive: true });
})();
