(() => {
  // ドメイン取得後はここだけ差し替えればOK
  const DEMO_SITE_URL = "https://lightwave-recruit-demo.jaga291.workers.dev/";

  document.querySelectorAll("[data-demo-link]").forEach((el) => {
    el.href = DEMO_SITE_URL;
  });
})();

(() => {
  const navToggle = document.getElementById("navToggle");
  const drawer = document.getElementById("mobileDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const drawerClose = document.getElementById("drawerClose");

  if (!navToggle || !drawer || !drawerOverlay) return;

  const getFocusable = () =>
    Array.from(drawer.querySelectorAll("a[href], button:not([disabled])"));

  const openDrawer = () => {
    drawer.classList.add("is-open");
    drawerOverlay.classList.add("is-open");
    drawer.removeAttribute("inert");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "メニューを閉じる");
    document.body.style.overflow = "hidden";
    drawerClose?.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove("is-open");
    drawerOverlay.classList.remove("is-open");
    drawer.setAttribute("inert", "");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "メニューを開く");
    document.body.style.overflow = "";
    navToggle.focus();
  };

  navToggle.addEventListener("click", () => {
    if (drawer.classList.contains("is-open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerOverlay.addEventListener("click", closeDrawer);
  drawerClose?.addEventListener("click", closeDrawer);

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (!drawer.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      closeDrawer();
      return;
    }

    if (e.key === "Tab") {
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

(() => {
  const ANIM_MS = 250;

  document.querySelectorAll(".faq-item").forEach((details) => {
    const summary = details.querySelector(".q");
    if (!summary) return;

    let animation = null;
    let isClosing = false;
    let isExpanding = false;

    const onFinish = (open) => {
      details.open = open;
      animation = null;
      isClosing = false;
      isExpanding = false;
      details.style.height = "";
      details.style.overflow = "";
    };

    const shrink = () => {
      isClosing = true;
      const startHeight = `${details.offsetHeight}px`;
      const endHeight = `${summary.offsetHeight}px`;
      details.style.overflow = "hidden";
      animation?.cancel();
      animation = details.animate(
        { height: [startHeight, endHeight] },
        { duration: ANIM_MS, easing: "ease-out" }
      );
      animation.onfinish = () => onFinish(false);
      animation.oncancel = () => { isClosing = false; };
    };

    const expand = () => {
      isExpanding = true;
      const startHeight = `${details.offsetHeight}px`;
      const endHeight = `${summary.offsetHeight + details.querySelector(".a").offsetHeight}px`;
      details.style.overflow = "hidden";
      animation?.cancel();
      animation = details.animate(
        { height: [startHeight, endHeight] },
        { duration: ANIM_MS, easing: "ease-out" }
      );
      animation.onfinish = () => onFinish(true);
      animation.oncancel = () => { isExpanding = false; };
    };

    const open = () => {
      details.style.height = `${details.offsetHeight}px`;
      details.open = true;
      window.requestAnimationFrame(expand);
    };

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      details.style.overflow = "hidden";
      if (isClosing || !details.open) {
        details.classList.add("is-open");
        open();
      } else if (isExpanding || details.open) {
        details.classList.remove("is-open");
        shrink();
      }
    });
  });
})();

(() => {
  const button = document.getElementById("backToTop");
  if (!button) return;

  const toggleVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 400);
  };

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
