(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const themeToggle = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  /* ---------- Theme ---------- */

  const applyTheme = (theme) => {
    const isDark = theme !== "light";
    root.dataset.theme = isDark ? "dark" : "light";

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      themeToggle.setAttribute(
        "title",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    }

    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#071417" : "#edf4f1");
    }
  };

  const storedTheme = (() => {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  })();

  applyTheme(storedTheme === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
      applyTheme(nextTheme);

      try {
        localStorage.setItem("theme", nextTheme);
      } catch {
        /* Theme still applies for this visit. */
      }
    });
  }

  /* ---------- Header state ---------- */

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile menu ---------- */

  const closeMenu = () => {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  };

  if (nav && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (event) => {
      if (nav.classList.contains("is-open") && !nav.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------- Active navigation section ---------- */

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${id}`;
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observedSections = ["about", "focus", "journey", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    observedSections.forEach((section) => activeObserver.observe(section));
  }

  /* ---------- Scroll reveals ---------- */

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

  revealItems.forEach((item) => {
    const delay = item.dataset.delay;
    if (delay) item.style.setProperty("--reveal-delay", `${delay}s`);
  });

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- Pointer glow ---------- */

  const glow = document.querySelector(".cursor-glow");

  if (glow && finePointer.matches && !reduceMotion.matches) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frame = null;

    const renderGlow = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      glow.style.transform = `translate3d(${currentX - 280}px, ${currentY - 280}px, 0)`;

      if (
        Math.abs(targetX - currentX) > 0.2 ||
        Math.abs(targetY - currentY) > 0.2
      ) {
        frame = requestAnimationFrame(renderGlow);
      } else {
        frame = null;
      }
    };

    document.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        if (frame === null) frame = requestAnimationFrame(renderGlow);
      },
      { passive: true }
    );
  }

  /* ---------- Subtle profile card tilt ---------- */

  const tiltCard = document.querySelector(".tilt");

  if (tiltCard && finePointer.matches && !reduceMotion.matches) {
    tiltCard.addEventListener("pointermove", (event) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tiltCard.style.setProperty("--ry", `${x * 8 - 2}deg`);
      tiltCard.style.setProperty("--rx", `${y * -7 + 2}deg`);
    });

    tiltCard.addEventListener("pointerleave", () => {
      tiltCard.style.setProperty("--rx", "2.5deg");
      tiltCard.style.setProperty("--ry", "-5deg");
    });
  }

  /* ---------- Copy email ---------- */

  const copyButton = document.querySelector("[data-copy-email]");

  const fallbackCopy = (text) => {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-9999px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    try {
      document.execCommand("copy");
    } finally {
      field.remove();
    }
  };

  if (copyButton) {
    const copyLabel = copyButton.querySelector(".copy-label");
    let resetTimer;

    copyButton.addEventListener("click", async () => {
      const email = copyButton.dataset.copyEmail || "";
      if (!email) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          fallbackCopy(email);
        }
      } catch {
        fallbackCopy(email);
      }

      copyButton.classList.add("is-copied");
      if (copyLabel) copyLabel.textContent = "Copied!";

      const status = document.getElementById("copy-status");
      if (status) status.textContent = `${email} copied to clipboard.`;

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        if (copyLabel) copyLabel.textContent = "Copy email";
        if (status) status.textContent = "";
      }, 2200);
    });
  }

  /* ---------- Footer year ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
