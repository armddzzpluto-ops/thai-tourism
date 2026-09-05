(() => {
  const button = document.getElementById("detail-language");
  const themeButton = document.getElementById("detail-theme");

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    const icon = themeButton?.querySelector("i");
    if (icon) icon.className = next === "dark" ? "fas fa-sun" : "fas fa-moon";
    if (themeButton) {
      const thai = document.documentElement.lang !== "en";
      themeButton.setAttribute("aria-label", next === "dark"
        ? (thai ? "ใช้ธีมสว่าง" : "Use light theme")
        : (thai ? "ใช้ธีมมืด" : "Use dark theme"));
    }
    try { localStorage.setItem("tt_theme", next); } catch {}
  }

  function applyLanguage(language) {
    const next = language === "en" ? "en" : "th";
    document.documentElement.lang = next;
    document.querySelectorAll("[data-th][data-en]").forEach(element => {
      element.textContent = element.dataset[next];
    });
    if (button) {
      button.textContent = next === "th" ? "EN" : "TH";
      button.setAttribute("aria-label", next === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย");
    }
    applyTheme(document.documentElement.dataset.theme);
    try { localStorage.setItem("tt_language", next); } catch {}
  }

  button?.addEventListener("click", () => {
    applyLanguage(document.documentElement.lang === "en" ? "th" : "en");
  });

  themeButton?.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  let initialLanguage = "th";
  try {
    initialLanguage = localStorage.getItem("tt_language") || "th";
    document.documentElement.dataset.theme = localStorage.getItem("tt_theme") || "light";
  } catch {
    document.documentElement.dataset.theme = "light";
  }
  applyTheme(document.documentElement.dataset.theme);
  applyLanguage(initialLanguage);
})();
