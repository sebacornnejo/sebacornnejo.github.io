function loadImage(media) {
  let source = media.dataset.mediaSrc;
  const viewport = media.closest("svg").getBoundingClientRect();
  const density = window.devicePixelRatio || 1;
  for (const variant of ["thumb", "medium", "preview"]) {
    if (!media.dataset[variant]) continue;
    const [width, height] = media.dataset[variant + "Size"].split("x").map(Number);
    if (width >= viewport.width * density && height >= viewport.height * density) {
      source = media.dataset[variant];
      break;
    }
  }
  if (media.getAttribute("href") !== source) media.setAttribute("href", source);
}

const canObserve = typeof IntersectionObserver === "function";
const imageObserver = canObserve && new IntersectionObserver((entries) => {
  for (const { target, isIntersecting } of entries) {
    if (!isIntersecting) continue;
    imageObserver.unobserve(target);
    loadImage(target.querySelector("image[data-media-src]"));
  }
}, { rootMargin: "280px 0px", scrollMargin: "0px 120px" });

for (const image of document.querySelectorAll("image[data-media-src]")) {
  if (imageObserver) imageObserver.observe(image.closest("svg"));
  else loadImage(image);
}

const chartFrames = document.querySelectorAll("iframe[data-media-src]");
if (chartFrames.length && canObserve) {
  const visibleCharts = new Set();
  let loadingChart = false;
  let nextChart;

  function scheduleChart() {
    clearTimeout(nextChart);
    if (loadingChart || !visibleCharts.size) return;
    // Plotly builds the chart on the main thread. Wait until scrolling settles
    // and let only one visible chart initialize at a time.
    nextChart = setTimeout(() => {
      const chart = visibleCharts.values().next().value;
      visibleCharts.delete(chart);
      chartObserver.unobserve(chart);
      loadingChart = true;
      chart.addEventListener("load", () => {
        loadingChart = false;
        scheduleChart();
      }, { once: true });
      chart.src = chart.dataset.mediaSrc;
    }, 220);
  }

  const chartObserver = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) visibleCharts.add(target);
      else visibleCharts.delete(target);
    }
    scheduleChart();
  });
  for (const chart of chartFrames) chartObserver.observe(chart);
  window.addEventListener("scroll", scheduleChart, { passive: true });
} else {
  for (const chart of chartFrames) chart.src = chart.dataset.mediaSrc;
}

window.addEventListener("resize", () => {
  for (const media of document.querySelectorAll("image[data-media-src][href]")) {
    // On a larger viewport the preview may no longer have enough pixels.
    if (media.getAttribute("href") !== media.dataset.mediaSrc) loadImage(media);
  }
}, { passive: true });
