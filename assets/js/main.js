(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const isLight = theme === "light";
    if (metaTheme) {
      metaTheme.setAttribute("content", isLight ? "#f5f8f7" : "#0b1120");
    }
    if (themeToggle) {
      const label = isLight ? "Ativar tema escuro" : "Ativar tema claro";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
  };

  applyTheme(root.dataset.theme === "light" ? "light" : "dark");

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {}
  });

  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  menuToggle?.addEventListener("click", () => {
    if (!menu) return;
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!menu?.classList.contains("is-open")) return;
    if (event.target.closest(".site-header")) return;
    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMenu();
  });

  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const targets = navLinks
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href")),
    }))
    .filter((target) => target.section);

  let ticking = false;

  const updateScrollState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);

    const offset = (header?.offsetHeight || 72) + 40;
    let current = null;

    targets.forEach((target) => {
      if (target.section.getBoundingClientRect().top <= offset) {
        current = target;
      }
    });

    const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atPageEnd && targets.length) {
      current = targets[targets.length - 1];
    }

    navLinks.forEach((link) => link.classList.remove("is-active"));
    current?.link.classList.add("is-active");
    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollState);
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateScrollState();

  const revealItems = document.querySelectorAll(".reveal");
  let observerDelivered = false;

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        observerDelivered = true;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    observerDelivered = true;
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  window.setTimeout(() => {
    if (!observerDelivered) root.classList.remove("js");
  }, 1500);

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

  let currentIndex = 0;
  let lastTrigger = null;

  const renderImage = (index) => {
    const item = galleryItems[index];
    if (!item || !lightboxImg) return;
    const img = item.querySelector("img");
    lightboxImg.src = item.dataset.full || img?.src || "";
    lightboxImg.alt = img?.alt || "";
    if (lightboxCaption) {
      lightboxCaption.textContent = item.dataset.caption || "";
    }
    currentIndex = index;
  };

  const openLightbox = (index) => {
    if (!lightbox || typeof lightbox.showModal !== "function") return;
    lastTrigger = galleryItems[index];
    renderImage(index);
    lightbox.showModal();
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
  };

  const stepImage = (direction) => {
    if (!galleryItems.length) return;
    const next = (currentIndex + direction + galleryItems.length) % galleryItems.length;
    renderImage(next);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => stepImage(-1));
  lightboxNext?.addEventListener("click", () => stepImage(1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox?.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    lastTrigger?.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.open) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepImage(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepImage(1);
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
