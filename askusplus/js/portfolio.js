import { supabase } from "./supabase.js";

const grid = document.getElementById("portfolioGrid");
const buttons = document.querySelectorAll(".filter-btn");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");
const dotsContainer = document.getElementById("portfolioDots");

let items = [];
let activeCategory = "social";
let currentSlide = 0;

/* =========================
   RESPONSIVE ITEMS COUNT
========================= */
function getItemsPerSlide() {
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) return 6;
  if (activeCategory === "videos") return 2;

  return 4;
}

/* =========================
   LOAD
========================= */
async function loadPortfolio() {
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  items = data || [];
  setActiveButton(activeCategory);
  render();
}

/* =========================
   RENDER
========================= */
function render() {
  grid.innerHTML = "";

  const filtered = items.filter(i => i.category === activeCategory);
  const ITEMS_PER_SLIDE = getItemsPerSlide();

  const totalSlides = Math.ceil(filtered.length / ITEMS_PER_SLIDE);
  if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;
  if (currentSlide < 0) currentSlide = 0;

  const start = currentSlide * ITEMS_PER_SLIDE;
  const end = start + ITEMS_PER_SLIDE;
  const slideItems = filtered.slice(start, end);

  slideItems.forEach(item => {
    const el = document.createElement("div");
    el.className = "portfolio-item";

    el.innerHTML =
      item.type === "video"
        ? `<video src="${item.media}" controls muted></video>`
        : `<img src="${item.media}" alt="">`;

        el.addEventListener("click", () => {
  openLightbox(item);
});


    grid.appendChild(el);
  });

  updateArrows(filtered.length, ITEMS_PER_SLIDE);
  renderDots(filtered.length, ITEMS_PER_SLIDE);
}

/* =========================
   ARROWS
========================= */
function updateArrows(totalItems, perSlide) {
  const totalSlides = Math.ceil(totalItems / perSlide);

  if (totalSlides <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  prevBtn.style.display = "grid";
  nextBtn.style.display = "grid";

  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide >= totalSlides - 1;
}

prevBtn.onclick = () => {
  if (currentSlide > 0) {
    grid.classList.add("reverse");
    currentSlide--;
    render();
  }
};

nextBtn.onclick = () => {
  grid.classList.remove("reverse");
  currentSlide++;
  render();
};

/* =========================
   DOTS
========================= */
function renderDots(totalItems, perSlide) {
  const totalSlides = Math.ceil(totalItems / perSlide);

  dotsContainer.innerHTML = "";

  if (totalSlides <= 1) {
    dotsContainer.classList.add("hidden");
    return;
  }

  dotsContainer.classList.remove("hidden");

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    dot.className = "portfolio-dot";
    if (i === currentSlide) dot.classList.add("active");

    dot.addEventListener("click", () => {
      currentSlide = i;
      render();
    });

    dotsContainer.appendChild(dot);
  }
}

/* =========================
   FILTERS
========================= */
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeCategory = btn.dataset.filter;
    currentSlide = 0;
    render();
  });
});

function setActiveButton(category) {
  buttons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.filter === category)
  );
}

/* =========================
   SWIPE (MOBILE ONLY)
========================= */
let startX = 0;

if (window.innerWidth <= 768) {
  grid.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  grid.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) < 50) return;

    diff > 0 ? nextBtn.click() : prevBtn.click();
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", loadPortfolio);

window.addEventListener("resize", () => {
  currentSlide = 0;
  render();
});

const lightbox = document.getElementById("portfolioLightbox");
const lightboxContent = lightbox.querySelector(".lightbox-content");
const closeBtn = lightbox.querySelector(".lightbox-close");

function openLightbox(item) {
  lightboxContent.innerHTML =
    item.type === "video"
      ? `<video src="${item.media}" controls autoplay></video>`
      : `<img src="${item.media}" alt="">`;

  lightbox.classList.remove("hidden");
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  lightboxContent.innerHTML = "";
}

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});

window.openVideo = function(url) {
  document.getElementById("videoFrame").src = url;
  document.getElementById("videoModal").style.display = "flex";
};

window.closeVideo = function() {
  document.getElementById("videoFrame").src = "";
  document.getElementById("videoModal").style.display = "none";
};
