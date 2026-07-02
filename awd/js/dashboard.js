/* ============================================================
   THAILAND TRAVEL GUIDE 2026 — Dashboard Script
   Loaded only on dashboard.html. Builds Chart.js visuals,
   progress indicators and the popular destinations table
   using the shared mock DESTINATIONS data.
   ============================================================ */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined" || !document.getElementById("lineChart")) return;

  const chartInstances = [];

  const getToken = (name, fallback = "") => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    return value ? value.trim() : fallback;
  };

  const readThemePalette = () => ({
    text: getToken("--chart-text", getToken("--color-text-secondary")),
    grid: getToken("--chart-grid", getToken("--color-border-light")),
    accent: getToken("--chart-accent", getToken("--color-accent-light")),
    gold: getToken("--chart-gold", getToken("--color-secondary")),
    coral: getToken("--chart-coral", getToken("--color-status-danger")),
    blue: getToken("--chart-blue", getToken("--blue")),
    lineFill: getToken("--color-overlay-md"),
    goldFill: getToken("--gold-14"),
    success: getToken("--color-status-success", getToken("--color-accent"))
  });

  const destroyCharts = () => {
    while (chartInstances.length) {
      chartInstances.pop().destroy();
    }
  };

  const renderCharts = () => {
    const palette = readThemePalette();

    Chart.defaults.font.family = "'Sarabun', sans-serif";
    Chart.defaults.color = palette.text;

    /* ---------- 1. LINE CHART: monthly visitor trend ---------- */
    chartInstances.push(new Chart(document.getElementById("lineChart"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "2026", data: [3.1, 3.4, 3.0, 2.6, 2.1, 1.9, 2.0, 2.2, 2.4, 3.2, 3.9, 4.1],
            borderColor: palette.accent, backgroundColor: palette.lineFill,
            borderWidth: 2.5, tension: 0.4, fill: true, pointRadius: 3, pointBackgroundColor: palette.accent
          },
          {
            label: "2025", data: [2.7, 3.0, 2.6, 2.3, 1.8, 1.6, 1.7, 1.9, 2.0, 2.8, 3.4, 3.6],
            borderColor: palette.blue, backgroundColor: "transparent",
            borderWidth: 2, borderDash: [5, 4], tension: 0.4, pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "top", labels: { boxWidth: 12, padding: 16 } } },
        scales: {
          y: { grid: { color: palette.grid }, ticks: { callback: v => v + "M" } },
          x: { grid: { display: false } }
        }
      }
    }));

    /* ---------- 2. PIE CHART: visitors by region ---------- */
    chartInstances.push(new Chart(document.getElementById("pieChart"), {
      type: "doughnut",
      data: {
        labels: ["South", "Central", "North", "East", "Northeast"],
        datasets: [{ data: [38, 28, 19, 9, 6], backgroundColor: [palette.accent, palette.blue, palette.gold, palette.coral, palette.blue], borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "62%",
        plugins: { legend: { position: "bottom", labels: { boxWidth: 11, padding: 14 } } }
      }
    }));

    /* ---------- 3. BAR CHART: top destinations by rating ---------- */
    const topByRating = [...DESTINATIONS].sort((a, b) => b.rating - a.rating).slice(0, 6);
    chartInstances.push(new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels: topByRating.map(d => d.name),
        datasets: [{
          label: "Rating", data: topByRating.map(d => d.rating),
          backgroundColor: [palette.accent, palette.blue, palette.gold, palette.coral, palette.blue, palette.success],
          borderRadius: 8, borderSkipped: false, maxBarThickness: 38
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 4, max: 5, grid: { color: palette.grid } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    }));

    /* ---------- 4. AREA CHART: cumulative review growth ---------- */
    chartInstances.push(new Chart(document.getElementById("areaChart"), {
      type: "line",
      data: {
        labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
        datasets: [{
          label: "Total Reviews", data: [620, 980, 1450, 1820, 2180, 2500],
          borderColor: palette.gold, backgroundColor: palette.goldFill,
          borderWidth: 2.5, fill: true, tension: 0.35, pointRadius: 3, pointBackgroundColor: palette.gold
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { grid: { color: palette.grid } }, x: { grid: { display: false } } }
      }
    }));
  };

  renderCharts();

  /* ---------- 5. PROGRESS BARS: category popularity ---------- */
  const progressPalette = readThemePalette();
  const categoryShares = [
    { label: "Beach",   value: 34, color: progressPalette.accent },
    { label: "Temple",  value: 27, color: progressPalette.gold },
    { label: "Nature",  value: 21, color: progressPalette.blue },
    { label: "Mountain",value: 12, color: progressPalette.coral },
    { label: "Other",   value: 6,  color: progressPalette.blue }
  ];
  const progressList = document.getElementById("progressList");
  if (progressList) {
    progressList.innerHTML = categoryShares.map(c => `
      <div class="progress-row">
        <div class="progress-head"><span>${c.label}</span><b>${c.value}%</b></div>
        <div class="progress-track"><div class="progress-fill" style="background:${c.color};width:0%" data-target="${c.value}"></div></div>
      </div>`).join("");
    // Animate after paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        progressList.querySelectorAll(".progress-fill").forEach(bar => {
          bar.style.width = bar.dataset.target + "%";
        });
      }, 200);
    });
  }

  /* ---------- 6. TABLE: top 6 destinations ---------- */
  const tbody = document.getElementById("destTableBody");
  if (tbody) {
    const top6 = [...DESTINATIONS].sort((a, b) => parseFloat(b.tourists) - parseFloat(a.tourists)).slice(0, 6);
    tbody.innerHTML = top6.map((d, i) => {
      const trendUp = i % 4 !== 3; // mostly upward mock trend
      const trendPct = (1.8 + i * 1.3).toFixed(1);
      const trendLabel = trendUp ? "increasing" : "decreasing";
      const trendIcon = trendUp ? "▲" : "▼";
      return `<tr>
        <td><div class="dt-name"><img src="${d.img}" alt="" class="dt-thumb" loading="lazy">${d.name}</div></td>
        <td>${d.province}</td>
        <td>★ ${d.rating}</td>
        <td>${d.tourists}</td>
        <td class="${trendUp ? "trend-up" : "trend-down"}" aria-label="trend ${trendLabel}">${trendIcon} ${trendPct}%</td>
      </tr>`;
    }).join("");
  }

  // Repaint charts when theme changes from the global toggle.
  window.addEventListener("themechange", () => {
    destroyCharts();
    renderCharts();
  });
});