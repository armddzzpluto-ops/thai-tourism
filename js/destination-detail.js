(() => {
  const button = document.getElementById("detail-language");

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
    try { localStorage.setItem("tt_language", next); } catch {}
  }

  button?.addEventListener("click", () => {
    applyLanguage(document.documentElement.lang === "en" ? "th" : "en");
  });

  let initialLanguage = "th";
  try {
    initialLanguage = localStorage.getItem("tt_language") || "th";
    document.documentElement.dataset.theme = localStorage.getItem("tt_theme") || "light";
  } catch {
    document.documentElement.dataset.theme = "light";
  }
  applyLanguage(initialLanguage);
})();
