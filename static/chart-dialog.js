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

  frame.addEventListener("load", () => {
    const plot = frame.contentDocument;
    if (!dialog.open || plot?.URL === "about:blank") return;
    body.setAttribute("aria-busy", "false");
    if (!plot?.querySelector(".plotly-graph-div")) {
      status.textContent = "The chart couldn’t load. Close this window and open the chart again to retry.";
      return;
    }

    // Give the toolbar a row above the title on narrow charts.
    const style = plot.createElement("style");
    style.textContent = `
      html, body { background-color: #121212; }
      .mobile-plot-view { padding-top: 2rem; }
      .mobile-plot-view .modebar-container { top: -2rem !important; }
    `;
    plot.head.append(style);
    const narrowChart = plot.querySelector(".mobile-plot-view");
    if (narrowChart) {
      const chartBottom = narrowChart.getBoundingClientRect().bottom;
      const height = Math.ceil(chartBottom + bar.offsetHeight + 16);
      dialog.style.setProperty("--chart-dialog-height", `${height}px`);
    }
    status.hidden = true;
    frame.setAttribute("data-ready", "");
    plot.addEventListener("keydown", event => {
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
