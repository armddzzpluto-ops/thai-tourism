/* ============================================================
   THAILAND TRAVEL GUIDE 2026 — Dashboard Script
   Safe to load on any page. A chart is created only when its
   canvas exists, and an older Chart.js instance is destroyed.
   ============================================================ */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.Chart === "undefined") return;

  const chartInstances = [];
  const destinations = Array.isArray(window.DESTINATIONS)
    ? window.DESTINATIONS
    : [];

  const getToken = (name, fallback = "") => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return value || fallback;
  };

  const readThemePalette = () => ({
    text: getToken("--chart-text", getToken("--color-text-secondary", "#555")),
    grid: getToken("--chart-grid", getToken("--color-border-light", "rgba(0,0,0,.08)")),
    accent: getToken("--chart-accent", getToken("--color-accent-light", "#1a7a8a")),
    gold: getToken("--chart-gold", getToken("--color-secondary", "#c9a84c")),
    coral: getToken("--chart-coral", getToken("--color-status-danger", "#e8694a")),
    blue: getToken("--chart-blue", getToken("--blue", "#2eadc0")),
    lineFill: getToken("--color-overlay-md", "rgba(26,122,138,.08)"),
    goldFill: getToken("--gold-14", "rgba(201,168,76,.14)"),
    success: getToken("--color-status-success", getToken("--color-accent", "#1a7a8a"))
  });

  const destroyCharts = () => {
    while (chartInstances.length) {
      const chart = chartInstances.pop();
      if (chart && typeof chart.destroy === "function") chart.destroy();
    }
  };

  const createChart = (canvasId, config) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    if (typeof window.Chart.getChart === "function") {
      const existing = window.Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    try {
      const chart = new window.Chart(canvas, config);
      chartInstances.push(chart);
      return chart;
    } catch (error) {
      console.error(`Unable to render chart: ${canvasId}`, error);
      return null;
    }
  };

  const renderCharts = () => {
    const hasCanvas = ["lineChart", "doughnutChart", "barChart", "areaChart"]
      .some(id => document.getElementById(id));

    if (!hasCanvas) return;

    const palette = readThemePalette();
    window.Chart.defaults.font.family = "'Sarabun', sans-serif";
    window.Chart.defaults.color = palette.text;

    createChart("lineChart", {
      type: "line",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [{
          label: "2026",
          data: [3.1,3.4,3.0,2.6,2.1,1.9,2.0,2.2,2.4,3.2,3.9,4.1],
          borderColor: palette.accent,
          backgroundColor: palette.lineFill,
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: palette.accent
        }, {
          label: "2025",
          data: [2.7,3.0,2.6,2.3,1.8,1.6,1.7,1.9,2.0,2.8,3.4,3.6],
          borderColor: palette.blue,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [5,4],
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top", labels: { boxWidth: 12, padding: 16 } } },
        scales: {
          y: { grid: { color: palette.grid }, ticks: { callback: value => `${value}M` } },
          x: { grid: { display: false } }
        }
      }
    });

    createChart("doughnutChart", {
      type: "doughnut",
      data: {
        labels: ["South","Central","North","East","Northeast"],
        datasets: [{
          data: [38,28,19,9,6],
          backgroundColor: [palette.accent,palette.blue,palette.gold,palette.coral,palette.success],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: { legend: { position: "bottom", labels: { boxWidth: 11, padding: 14 } } }
      }
    });

    const topByRating = [...destinations]
      .filter(item => Number.isFinite(Number(item.rating)))
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 6);

    createChart("barChart", {
      type: "bar",
      data: {
        labels: topByRating.length
          ? topByRating.map(item => item.name)
          : ["Bangkok","Phuket","Chiang Mai","Krabi","Pattaya","Koh Samui"],
        datasets: [{
          label: "Rating",
          data: topByRating.length
            ? topByRating.map(item => Number(item.rating))
            : [4.5,4.8,4.9,4.7,4.3,4.6],
          backgroundColor: [palette.accent,palette.blue,palette.gold,palette.coral,palette.success,palette.blue],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 38
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 4, max: 5, grid: { color: palette.grid } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });

    createChart("areaChart", {
      type: "line",
      data: {
        labels: ["2021","2022","2023","2024","2025","2026"],
        datasets: [{
          label: "Total Reviews",
          data: [620,980,1450,1820,2180,2500],
          borderColor: palette.gold,
          backgroundColor: palette.goldFill,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: palette.gold
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: palette.grid } },
          x: { grid: { display: false } }
        }
      }
    });
  };

  renderCharts();

  const progressPalette = readThemePalette();
  const categoryShares = [
    { label: "Beach", value: 34, color: progressPalette.accent },
    { label: "Temple", value: 27, color: progressPalette.gold },
    { label: "Nature", value: 21, color: progressPalette.blue },
    { label: "Mountain", value: 12, color: progressPalette.coral },
    { label: "Other", value: 6, color: progressPalette.success }
  ];

  const progressList = document.getElementById("progressList");
  if (progressList) {
    progressList.innerHTML = categoryShares.map(item => `
      <div class="progress-row">
        <div class="progress-head"><span>${item.label}</span><b>${item.value}%</b></div>
        <div class="progress-track"><div class="progress-fill" style="background:${item.color};width:0%" data-target="${item.value}"></div></div>
      </div>`).join("");

    requestAnimationFrame(() => {
      setTimeout(() => {
        progressList.querySelectorAll(".progress-fill").forEach(bar => {
          bar.style.width = `${bar.dataset.target}%`;
        });
      }, 200);
    });
  }

  const tbody = document.getElementById("destTableBody");
  if (tbody && destinations.length) {
    const parseTourists = value =>
      Number.parseFloat(String(value || "0").replace(/[^0-9.]/g, "")) || 0;

    const top6 = [...destinations]
      .sort((a, b) => parseTourists(b.tourists) - parseTourists(a.tourists))
      .slice(0, 6);

    tbody.innerHTML = top6.map((item, index) => {
      const trendUp = index % 4 !== 3;
      const trendPct = (1.8 + index * 1.3).toFixed(1);

      return `<tr>
        <td><div class="dt-name"><img src="${item.img}" alt="" class="dt-thumb" loading="lazy">${item.name}</div></td>
        <td>${item.province || "-"}</td>
        <td>★ ${item.rating ?? "-"}</td>
        <td>${item.tourists || "-"}</td>
        <td class="${trendUp ? "trend-up" : "trend-down"}" aria-label="trend ${trendUp ? "increasing" : "decreasing"}">${trendUp ? "▲" : "▼"} ${trendPct}%</td>
      </tr>`;
    }).join("");
  }

  window.addEventListener("themechange", () => {
    destroyCharts();
    renderCharts();
  });
});