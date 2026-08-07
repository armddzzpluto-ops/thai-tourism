/* ==========================================================
   Phase 1 — Shared navigation, dialog and network stability
   ========================================================== */
(function () {
  "use strict";

  const dialogIds = ["modal", "lightbox", "blog-modal"];
  const fallbackImage = "assets/images/destinations/bangkok.webp";

  let activeDialog = null;
  let previousFocus = null;

  function isOpen(dialog) {
    return dialog.classList.contains("open");
  }

  function focusableElements(dialog) {
    return [...dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'
    )].filter(element => !element.hidden && element.getAttribute("aria-hidden") !== "true");
  }

  function syncDialog(dialog) {
    const open = isOpen(dialog);

    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-hidden", String(!open));

    if (open) {
      if (activeDialog !== dialog) {
        previousFocus = document.activeElement;
        activeDialog = dialog;
      }

      requestAnimationFrame(() => {
        dialog.querySelector(".modal-close, button[onclick*='close']")?.focus();
      });
    } else if (activeDialog === dialog) {
      activeDialog = null;

      const focusTarget = previousFocus;
      previousFocus = null;

      if (focusTarget instanceof HTMLElement) {
        requestAnimationFrame(() => {
          if (focusTarget.isConnected) focusTarget.focus();
        });
      }
    }
  }

  function closeDialog(dialog) {
    if (!dialog) return;

    if (dialog.id === "modal" && typeof window.closeModalBtn === "function") {
      window.closeModalBtn();
      return;
    }

    if (dialog.id === "lightbox" && typeof window.closeLightbox === "function") {
      window.closeLightbox();
      return;
    }

    dialog.querySelector(".modal-close")?.click();
  }

  function initDialogs() {
    dialogIds.forEach(id => {
      const dialog = document.getElementById(id);
      if (!dialog) return;

      if (id === "modal") dialog.setAttribute("aria-labelledby", "modal-title");
      if (id === "lightbox") dialog.setAttribute("aria-describedby", "lightbox-cap");
      if (id === "blog-modal") dialog.setAttribute("aria-labelledby", "blog-modal-title");

      syncDialog(dialog);

      new MutationObserver(() => syncDialog(dialog)).observe(dialog, {
        attributes: true,
        attributeFilter: ["class"]
      });
    });

    document.addEventListener("keydown", event => {
      const dialog = activeDialog;

      if (!dialog || !isOpen(dialog)) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog(dialog);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = focusableElements(dialog);

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function initImageFallback() {
    document.addEventListener("error", event => {
      const image = event.target;

      if (!(image instanceof HTMLImageElement)) return;
      if (image.dataset.fallbackApplied === "true") return;

      image.dataset.fallbackApplied = "true";
      image.src = fallbackImage;

      if (!image.alt.trim()) {
        image.alt = window.I18N?.t("system.imageUnavailable") || "Image unavailable";
      }
    }, true);
  }

  function initPlaceholderLinks() {
    document.querySelectorAll(".footer-social a[href='#']").forEach(link => {
      link.dataset.placeholderLink = "true";

      link.addEventListener("click", event => {
        event.preventDefault();

        const message = window.I18N?.t("footer.placeholder")
          || "This link is not available yet";

        window.Swal?.fire?.({
          toast: true,
          position: "top-end",
          icon: "info",
          title: message,
          showConfirmButton: false,
          timer: 1800
        });
      });
    });
  }

  function initHistoryAndNetwork() {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const updateOnlineState = () => {
      document.documentElement.classList.toggle("is-offline", !navigator.onLine);
    };

    updateOnlineState();
    window.addEventListener("online", updateOnlineState);
    window.addEventListener("offline", updateOnlineState);
  }

  function init() {
    initDialogs();
    initImageFallback();
    initPlaceholderLinks();
    initHistoryAndNetwork();

    document.addEventListener("languagechange", () => {
      window.I18N?.syncControls();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();