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

  const openDrawer = () => {
    drawer.classList.add("is-open");
    drawerOverlay.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "メニューを閉じる");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    drawer.classList.remove("is-open");
    drawerOverlay.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "メニューを開く");
    document.body.style.overflow = "";
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
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
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
