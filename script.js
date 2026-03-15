const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const navToggle = document.querySelector(".nav__toggle");
const toTopButton = document.querySelector(".to-top");
const galleryTrack = document.querySelector(".gallery__track");
const galleryItems = document.querySelectorAll(".gallery__item");
const galleryPrev = document.querySelector(".gallery__arrow--left");
const galleryNext = document.querySelector(".gallery__arrow--right");

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;

  if (currentY > lastScrollY && currentY > 120) {
    nav.classList.add("nav--hidden");
  } else {
    nav.classList.remove("nav--hidden");
  }

  lastScrollY = currentY;
});

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("nav__toggle--open");
    navLinks.classList.toggle("nav__links--open");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "a") {
      navToggle.classList.remove("nav__toggle--open");
      navLinks.classList.remove("nav__links--open");
    }
  });
}

const navOffset = () => {
  const navRect = nav ? nav.getBoundingClientRect() : { height: 80 };
  return navRect.height + 20;
};

const navLinksForSmoothScroll = document.querySelectorAll(
  '.nav__links a[href^="#"]'
);

navLinksForSmoothScroll.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - navOffset();

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  });
});

if (toTopButton) {
  toTopButton.classList.add("to-top--visible");
  toTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

let galleryIndex = 0;
let galleryVisibleCount = 3;
let galleryMaxIndex = 0;
let galleryItemWidth = 0;

const updateGalleryVisibleCount = () => {
  const width = window.innerWidth;
  if (width <= 500) {
    galleryVisibleCount = 1;
  } else if (width <= 900) {
    galleryVisibleCount = 2;
  } else {
    galleryVisibleCount = 3;
  }
};

const updateGallery = () => {
  if (!galleryTrack || galleryItems.length === 0) return;
  galleryMaxIndex = Math.max(0, galleryItems.length - galleryVisibleCount);
  const firstItem = galleryItems[0];
  galleryItemWidth = firstItem.getBoundingClientRect().width + 16; // 16px gap approx
  const offset = -(galleryItemWidth * galleryIndex);
  galleryTrack.style.transform = `translateX(${offset}px)`;
};

const nextGallery = () => {
  galleryIndex += 1;
  if (galleryIndex > galleryMaxIndex) {
    galleryTrack.style.transition = "none";
    galleryIndex = 0;
    const offset = -(galleryItemWidth * galleryIndex);
    galleryTrack.style.transform = `translateX(${offset}px)`;
    // force reflow then restore transition for smoothness
    void galleryTrack.offsetWidth;
    galleryTrack.style.transition = "";
  } else {
    updateGallery();
  }
};

const prevGallery = () => {
  galleryIndex -= 1;
  if (galleryIndex < 0) {
    galleryTrack.style.transition = "none";
    galleryIndex = galleryMaxIndex;
    const offset = -(galleryItemWidth * galleryIndex);
    galleryTrack.style.transform = `translateX(${offset}px)`;
    void galleryTrack.offsetWidth;
    galleryTrack.style.transition = "";
  } else {
    updateGallery();
  }
};

let galleryTimer;

const startGalleryAutoPlay = () => {
  if (!galleryTrack) return;
  stopGalleryAutoPlay();
  galleryTimer = setInterval(() => {
    nextGallery();
  }, 3500);
};

const stopGalleryAutoPlay = () => {
  if (galleryTimer) {
    clearInterval(galleryTimer);
    galleryTimer = null;
  }
};

if (galleryTrack) {
  updateGalleryVisibleCount();
  updateGallery();
  startGalleryAutoPlay();

  window.addEventListener("resize", () => {
    updateGalleryVisibleCount();
    updateGallery();
  });

  if (galleryNext) {
    galleryNext.addEventListener("click", () => {
      nextGallery();
      startGalleryAutoPlay();
    });
  }

  if (galleryPrev) {
    galleryPrev.addEventListener("click", () => {
      prevGallery();
      startGalleryAutoPlay();
    });
  }

  galleryTrack.addEventListener("mouseenter", stopGalleryAutoPlay);
  galleryTrack.addEventListener("mouseleave", startGalleryAutoPlay);
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

const revealElements = document.querySelectorAll(
  ".section__content, .section__media, .hero__text, .hero__image"
);

revealElements.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((el) => observer.observe(el));

