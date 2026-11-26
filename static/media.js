function whenIdle(callback) {
  if (typeof requestIdleCallback === "function") requestIdleCallback(callback, { timeout: 350 });
  else setTimeout(callback, 0);
}

function afterPaint(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

const painted = new Promise((resolve) => {
  document.addEventListener("DOMContentLoaded", () => {
    const name = "first-contentful-paint";
    if (performance.getEntriesByName(name).length) {
      resolve();
      return;
    }
    if (!window.PerformanceObserver?.supportedEntryTypes?.includes("paint")) {
      afterPaint(resolve);
      return;
    }
    const finish = () => {
      clearTimeout(fallback);
      observer.disconnect();
      resolve();
    };
    const observer = new PerformanceObserver((entries) => {
      if (entries.getEntries().some((entry) => entry.name === name)) finish();
    });
    observer.observe({ type: "paint", buffered: true });
    const fallback = setTimeout(finish, 2500);
  }, { once: true });
});

const poster = document.querySelector(".page-backdrop[data-animation-src]");
if (poster) {
  painted.then(async () => {
    const cursorImage = matchMedia("(hover: hover) and (pointer: fine)").matches
      && document.querySelector("#bee img");
    await Promise.allSettled([poster.decode(), cursorImage && cursorImage.decode()]);
    whenIdle(loadBackdrop);
  });
}

async function loadBackdrop() {
  const animation = new Image();
  animation.className = poster.className;
  animation.alt = "";
  animation.decoding = "async";
  animation.fetchPriority = "low";
  for (const source of [poster.dataset.animationSrc, poster.dataset.fallbackSrc]) {
    if (!source) continue;
    try {
      animation.src = source;
      await animation.decode();
      whenIdle(() => poster.replaceWith(animation));
      return;
    } catch {
      // Keep the first frame visible while trying the original animation.
    }
  }
}

function loadImage(media) {
  if (media instanceof HTMLImageElement) {
    if (media.dataset.mediaSrcset) media.srcset = media.dataset.mediaSrcset;
    media.src = media.dataset.mediaSrc;
    return;
  }
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
    loadImage(target instanceof HTMLImageElement ? target : target.querySelector("image[data-media-src]"));
  }
}, { rootMargin: "280px 0px", scrollMargin: "0px 120px" });

painted.then(() => {
  for (const image of document.querySelectorAll("image[data-media-src], img[data-media-src]")) {
    if (imageObserver) imageObserver.observe(image.closest("svg") || image);
    else loadImage(image);
  }
});

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
  painted.then(() => {
    for (const chart of chartFrames) chartObserver.observe(chart);
  });
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
