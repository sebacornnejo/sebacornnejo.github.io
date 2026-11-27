(() => {
  const dialog = document.querySelector("#project-chart-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const bar = dialog.querySelector(".chart-dialog-bar");
  const title = dialog.querySelector("#chart-dialog-title");
  const body = dialog.querySelector(".chart-dialog-body");
  const frame = body.querySelector("iframe");
  const status = body.querySelector("[role=status]");
  let opener;

  document.querySelector("#interactive-examples").addEventListener("click", event => {
    const link = event.target.closest("a[data-chart]");
    if (!link || link.origin !== location.origin || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    event.preventDefault();

    opener = link;
    title.textContent = link.dataset.chart;
    frame.title = link.dataset.chart;
    dialog.style.removeProperty("--chart-dialog-height");
    frame.removeAttribute("data-ready");
    status.textContent = "Loading chart…";
    status.hidden = false;
    body.setAttribute("aria-busy", "true");
    dialog.showModal();
    frame.src = link.href;
  });

  frame.addEventListener("load", async () => {
    const chartDocument = frame.contentDocument;
    if (!dialog.open || chartDocument?.URL === "about:blank") return;
    const graph = chartDocument?.querySelector(".plotly-graph-div");
    if (!graph) {
      body.setAttribute("aria-busy", "false");
      status.textContent = "The chart couldn’t load. Close this window and open the chart again to retry.";
      return;
    }

    // Give the toolbar a row above the title on narrow charts.
    const style = chartDocument.createElement("style");
    style.textContent = `
      html, body { background-color: #121212; }
      .mobile-plot-view { padding-top: 2rem; }
      .mobile-plot-view .modebar-container { top: -2rem !important; }
    `;
    chartDocument.head.append(style);
    const narrowChart = chartDocument.querySelector(".mobile-plot-view");
    if (narrowChart) {
      const chartBottom = narrowChart.getBoundingClientRect().bottom;
      const height = Math.ceil(chartBottom + bar.offsetHeight + 16);
      dialog.style.setProperty("--chart-dialog-height", `${height}px`);
    } else if (graph.data?.some(trace => trace.type === "choropleth")) {
      // Keep the map and colour scale in view on shorter desktop screens.
      const viewport = chartDocument.defaultView;
      const margin = graph.getBoundingClientRect().top * 2;
      const height = Math.max(350, Math.floor(viewport.innerHeight - margin));
      if (graph.offsetHeight > height) {
        const originalHeight = graph.style.height;
        graph.style.height = `${height}px`;
        try {
          await viewport.Plotly.relayout(graph, { height });
        } catch {
          graph.style.height = originalHeight;
        }
      }
    }
    if (!dialog.open || frame.contentDocument !== chartDocument) return;
    body.setAttribute("aria-busy", "false");
    status.hidden = true;
    frame.setAttribute("data-ready", "");
    chartDocument.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialog.close();
      }
    }, true);
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    frame.removeAttribute("data-ready");
    frame.removeAttribute("src");
    opener?.focus({ preventScroll: true });
    opener = null;
  });
})();
