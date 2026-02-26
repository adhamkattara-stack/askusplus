import { supabase } from "./supabase.js";


document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     SIMPLE FADE-IN ANIMATION
     ===================== */
  const sections = document.querySelectorAll("section");

  sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
  });

  const revealOnScroll = () => {
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      const triggerPoint = window.innerHeight - 100;

      if (top < triggerPoint) {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
        section.style.transition = "0.8s ease";
      }
    });
  };

  // Run on load
  revealOnScroll();

  // Run on scroll
  window.addEventListener("scroll", revealOnScroll);

});
// ============================
// HERO ANIMATION (HOME + ABOUT)
// ============================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (document.querySelector(".hero-badge")) {
    tl.from(".hero-badge", {
      opacity: 0,
      y: 20,
      duration: 0.6,
    });
  }

  if (document.querySelector(".hero-title")) {
    tl.from(".hero-title", {
      opacity: 0,
      y: 40,
      duration: 0.8,
    }, "-=0.3");
  }

  if (document.querySelector(".hero-text")) {
    tl.from(".hero-text", {
      opacity: 0,
      y: 30,
      duration: 0.7,
    }, "-=0.3");
  }

  if (document.querySelector(".hero-actions")) {
    tl.from(".hero-actions a", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.15,
    }, "-=0.2");
  }
});

// ==========================
// CARD SCROLL ANIMATIONS
// ==========================
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power3.out",
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  if (window.gsap) {
    gsap.from(".hero-badge", { opacity: 0, y: 20, duration: 0.6 });
    gsap.from(".hero h1", { opacity: 0, y: 40, duration: 0.8, delay: 0.1 });
    gsap.from(".hero p", { opacity: 0, y: 30, duration: 0.7, delay: 0.25 });
    gsap.from(".hero-actions a", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.4,
      stagger: 0.15,
    });

    gsap.from(".visual-card", {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      delay: 0.3,
      stagger: 0.2,
    });
  }
});
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

cards.forEach(card => {
  card.classList.add("hidden");
  observer.observe(card);
});
// ============================
// STATS COUNTER ANIMATION
// ============================

const statNumbers = document.querySelectorAll(".stat-number");

const statsObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let count = 0;

        const updateCount = () => {
          const increment = target / 60; // speed control
          count += increment;

          if (count < target) {
            el.innerText = Math.floor(count);
            requestAnimationFrame(updateCount);
          } else {
            el.innerText = target + "+";
          }
        };

        updateCount();
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.6 }
);

statNumbers.forEach(num => {
  statsObserver.observe(num);
});
const videoSection = document.querySelector(".video-wrapper");

if (videoSection) {
  videoSection.style.opacity = 0;
  videoSection.style.transform = "translateY(40px)";

  window.addEventListener("scroll", () => {
    const rect = videoSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      videoSection.style.transition = "all 0.8s ease";
      videoSection.style.opacity = 1;
      videoSection.style.transform = "translateY(0)";
    }
  });
}
const videoWrapper = document.querySelector(".video-wrapper");

if (videoWrapper) {
  videoWrapper.style.opacity = 0;
  videoWrapper.style.transform = "translateY(50px)";

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        videoWrapper.style.transition = "all 0.9s ease";
        videoWrapper.style.opacity = 1;
        videoWrapper.style.transform = "translateY(0)";
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(videoWrapper);
}
const options = document.querySelectorAll(".radial-options li");
const arrow = document.getElementById("arrow");

options.forEach((item) => {
  const angle = item.dataset.angle;
  item.style.transform = `rotate(${angle}deg) translateX(180px) rotate(-${angle}deg)`;

  item.addEventListener("click", () => {
    options.forEach(o => o.classList.remove("active"));
    item.classList.add("active");

    arrow.style.transform = `rotate(${angle}deg)`;
  });
});


// NAVBAR SCROLL EFFECT
// ============================

const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
// =====================
// MOBILE HAMBURGER MENU
// =====================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.style.display =
      mobileMenu.style.display === "flex" ? "none" : "flex";
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!hamburger || !mobileMenu) {
    console.error("Hamburger or mobile menu not found");
    return;
  }

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
});

const hasSponsor = true; // أو true حسب استخدامك
const adSlot = document.getElementById("ad-slot");
if (!hasSponsor) adSlot.remove();

async function loadSiteContent() {
  const { data } = await supabase.from("site_content").select("*");

  data.forEach(item => {
    const el = document.querySelector(`[data-content="${item.id}"]`);
    if (el) el.innerHTML = item.value;
  });
}
loadSiteContent();

function initNavbar() {

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}
initNavbar();



const homeBlogGrid = document.getElementById("homeBlogGrid");

async function loadLatestArticles() {

  if (!homeBlogGrid) return;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error(error);
    return;
  }

  homeBlogGrid.innerHTML = "";

  if (!data || data.length === 0) {
    homeBlogGrid.innerHTML = "<p>No articles yet.</p>";
    return;
  }

  data.forEach(article => {
    homeBlogGrid.innerHTML += `
      <div class="blog-card" onclick="window.location.href='article.html?id=${article.id}'">
        <img src="${article.cover}" alt="">
        <div class="blog-card-content">
          <h3>${article.title}</h3>
          <p>${article.excerpt}</p>
        </div>
      </div>
    `;
  });
}

if (homeBlogGrid) {
  loadLatestArticles();
}
