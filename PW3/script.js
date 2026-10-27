
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Current year
$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Light / dark theme
const themeToggle = $("#themeToggle");

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");

  themeToggle.textContent = isLight ? "☼" : "◐";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );

  document.querySelector('meta[name="theme-color"]')
    .setAttribute("content", isLight ? "#f0f3ec" : "#101a1b");
});

// Scroll reveal animations
const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Project category filters
const filterButtons = $$(".filter-btn");
const projectCards = $$(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    projectCards.forEach((card) => {
      const matches =
        filter === "all" || card.dataset.category === filter;

      card.classList.toggle("is-hidden", !matches);
    });
  });

  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );
});

// Cursor glow — desktop only
const cursorGlow = $(".cursor-glow");

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

// Project card tilt — subtle and desktop only
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  projectCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (card.classList.contains("is-hidden")) return;

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 3;
      const rotateX = (0.5 - y) * 3;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// Copy email
const copyEmailButton = $("#copyEmail");
const emailLabel = $("#emailLabel");

copyEmailButton.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.email;

  if (!email || email === "your.email@example.com") {
    emailLabel.textContent = "Add your email in index.html first";
    return;
  }

  try {
    await navigator.clipboard.writeText(email);
    emailLabel.textContent = "Email copied ✓";
  } catch {
    // Fallback for browsers where Clipboard API is unavailable.
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = email;
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copied = document.execCommand("copy");
    temporaryInput.remove();

    emailLabel.textContent = copied
      ? "Email copied ✓"
      : `Email: ${email}`;
  }

  window.setTimeout(() => {
    emailLabel.textContent = "Copy my email ↗";
  }, 2500);
});

// Close mobile navigation with Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Close navigation when switching back to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 700) {
    closeMenu();
  }
});
