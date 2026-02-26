import { supabase } from "./supabase.js";

/* =====================
   GLOBAL STATE
===================== */
let editingArticleId = null;
let currentPortfolioItems = [];
let activeCategory = "all";

/* =====================
   AUTH GUARD
===================== */
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "login.html";
}

/* =====================
   LOGOUT
===================== */
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html";
});

/* =====================
   SIDEBAR SECTION SWITCH
===================== */
document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".menu-btn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    const section = btn.dataset.section;

    document
      .querySelectorAll(".admin-section")
      .forEach((sec) => sec.classList.remove("active"));

    document.getElementById(section)?.classList.add("active");
  });
});

/* =====================
   ADS
===================== */
const uploadAdBtn = document.getElementById("uploadAdBtn");
const adsGrid = document.getElementById("adsGrid");

uploadAdBtn?.addEventListener("click", uploadAd);

async function uploadAd() {
  const file = document.getElementById("adFile").files[0];
  const link = document.getElementById("adLink").value.trim();
  const position = document.getElementById("adPosition").value;

  if (!file) return alert("Choose an ad image");

  const path = `ads/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from("ads").upload(path, file);

  if (error) return alert(error.message);

  const { data } = supabase.storage.from("ads").getPublicUrl(path);

  await supabase.from("ads").insert({
    image: data.publicUrl,
    link,
    position,
  });

  document.getElementById("adFile").value = "";
  document.getElementById("adLink").value = "";

  loadAds();
}

async function loadAds() {
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("id", { ascending: false });

  if (error) return console.error(error);

  adsGrid.innerHTML = "";

  data.forEach((ad) => {
    adsGrid.innerHTML += `
      <div class="admin-card">
        <span class="badge badge-${ad.position}">
          ${ad.position.toUpperCase()}
        </span>

        <img src="${ad.image}" alt="Ad">

        <input
          type="text"
          value="${ad.link || ""}"
          onchange="updateAdLink('${ad.id}', this.value)"
        >

        <button onclick="deleteAd('${ad.id}')">
          Delete
        </button>
      </div>
    `;
  });
}

window.updateAdLink = async (id, link) => {
  await supabase.from("ads").update({ link }).eq("id", id);
};

window.deleteAd = async (id) => {
  await supabase.from("ads").delete().eq("id", id);
  loadAds();
};

document
  .getElementById("deleteAllAdsBtn")
  ?.addEventListener("click", async () => {
    if (!confirm("Delete ALL ads?")) return;

    await supabase.from("ads").delete().not("id", "is", null);
    loadAds();
  });

/* =====================
   PORTFOLIO
===================== */
const uploadPortfolioBtn = document.getElementById("uploadPortfolioBtn");
const portfolioGrid = document.getElementById("portfolioGrid");

uploadPortfolioBtn?.addEventListener("click", uploadPortfolio);

async function uploadPortfolio() {
  const files = document.getElementById("portfolioFiles").files;
  const youtubeUrl = document.getElementById("portfolioYoutube").value.trim();
  const category = document.getElementById("portfolioCategory").value;

  // 🔥 If YouTube link exists → store that instead of uploading file
  if (youtubeUrl) {
    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) return alert("Invalid YouTube link");

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    await supabase.from("portfolio").insert({
      media: embedUrl,
      thumbnail: thumbnailUrl,
      type: "youtube",
      category,
      active: true,
    });

    document.getElementById("portfolioYoutube").value = "";
    await loadPortfolio();
    return;
  }

  // Otherwise fallback to normal upload
  if (!files.length) return alert("Choose file or YouTube link");

  for (const file of files) {
    const path = `portfolio/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(path, file);

    if (error) continue;

    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);

    await supabase.from("portfolio").insert({
      media: data.publicUrl,
      type: file.type.startsWith("video") ? "video" : "image",
      category,
      active: true,
    });
  }

  document.getElementById("portfolioFiles").value = "";
  await loadPortfolio();
}
function extractYoutubeId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function loadPortfolio() {
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("id", { ascending: false });

  if (error) return console.error(error);

  currentPortfolioItems = data;

  updatePortfolioCounts();
  renderPortfolio(activeCategory);
}

function renderPortfolio(category = "all") {
  portfolioGrid.innerHTML = "";

  const filtered =
    category === "all"
      ? currentPortfolioItems
      : currentPortfolioItems.filter(
          (item) => item.category?.toLowerCase() === category.toLowerCase(),
        );

  filtered.forEach((item) => {
    portfolioGrid.innerHTML += `
      <div class="admin-card">
        ${
          item.type === "youtube"
            ? `
            <div class="youtube-admin-card">
        <img src="${item.thumbnail}" alt="YouTube Video">
        <span class="youtube-badge">YouTube</span>
      </div>
      <div class="play-button">▶</div>
            <iframe 
         src="${item.media}" 
         frameborder="0" 
         allowfullscreen>
       </iframe>`
            : item.type === "video"
              ? `<video src="${item.media}" controls></video>`
              : `<img src="${item.media}" alt="Portfolio">`
        }

        <span class="badge badge-category">
          ${item.category}
        </span>
        <button onclick="deletePortfolio('${item.id}')">
          Delete
        </button>
      </div>
    `;
  });
}

window.deletePortfolio = async (id) => {
  await supabase.from("portfolio").delete().eq("id", id);
  await loadPortfolio();
  renderPortfolio(activeCategory);
};

document
  .getElementById("deleteAllPortfolioBtn")
  ?.addEventListener("click", async () => {
    if (!confirm("Delete ALL portfolio items?")) return;

    await supabase.from("portfolio").delete().not("id", "is", null);

    await loadPortfolio();
    renderPortfolio(activeCategory);
  });

document.querySelectorAll(".portfolio-filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".portfolio-filter")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    activeCategory = btn.dataset.category;

    renderPortfolio(activeCategory);
  });
});

function updatePortfolioCounts() {
  const counts = {
    all: currentPortfolioItems.length,
    logos: 0,
    videos: 0,
    web: 0,
    social: 0,
  };

  currentPortfolioItems.forEach((item) => {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  });

  document.querySelectorAll(".count").forEach((span) => {
    span.textContent = counts[span.dataset.count] ?? 0;
  });
}

/* =====================
   ARTICLES
===================== */
const uploadArticleBtn = document.getElementById("uploadArticleBtn");
const articlesGrid = document.getElementById("articlesGrid");
const cancelEditBtn = document.getElementById("cancelEditBtn");

uploadArticleBtn?.addEventListener("click", uploadArticle);
cancelEditBtn?.addEventListener("click", resetArticleForm);

async function uploadArticle() {
  const title = document.getElementById("articleTitle")?.value.trim();
  const excerpt = document.getElementById("articleExcerpt")?.value.trim();
  const content = document.getElementById("articleContent")?.value.trim();
  const file = document.getElementById("articleCover")?.files[0];

  const titleArEl = document.getElementById("articleTitleAr");
  const excerptArEl = document.getElementById("articleExcerptAr");
  const contentArEl = document.getElementById("articleContentAr");

  const titleAr = titleArEl ? titleArEl.value.trim() : null;
  const excerptAr = excerptArEl ? excerptArEl.value.trim() : null;
  const contentAr = contentArEl ? contentArEl.value.trim() : null;

  if (!title || !content) return alert("Title and content required");

  let coverUrl = null;

  if (file) {
    const path = `articles/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("articles")
      .upload(path, file);

    if (error) return alert(error.message);

    const { data } = supabase.storage.from("articles").getPublicUrl(path);

    coverUrl = data.publicUrl;
  }

  if (editingArticleId) {
    const updateData = {
      title,
      excerpt,
      content,
      title_ar: titleAr,
      excerpt_ar: excerptAr,
      content_ar: contentAr,
    };

    if (coverUrl) updateData.cover = coverUrl;

    await supabase
      .from("articles")
      .update(updateData)
      .eq("id", editingArticleId);
  } else {
    if (!coverUrl) return alert("Please upload a cover image");

    await supabase.from("articles").insert({
      title,
      excerpt,
      content,
      title_ar: titleAr,
      excerpt_ar: excerptAr,
      content_ar: contentAr,
      cover: coverUrl,
    });
  }

  resetArticleForm();
  loadArticles();
}

async function loadArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return console.error(error);

  articlesGrid.innerHTML = "";

  data.forEach((article) => {
    articlesGrid.innerHTML += `
      <div class="admin-card">
        <img src="${article.cover}" alt="Cover">
        <h4>${article.title}</h4>
        <button onclick="editArticle('${article.id}')">Edit</button>
        <button onclick="deleteArticle('${article.id}')">Delete</button>
      </div>
    `;
  });
}

window.editArticle = async (id) => {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  editingArticleId = id;

  document.getElementById("articleTitle").value = data.title;
  document.getElementById("articleExcerpt").value = data.excerpt;
  document.getElementById("articleContent").value = data.content;

  uploadArticleBtn.textContent = "Update Article";
  cancelEditBtn.style.display = "block";

  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.deleteArticle = async (id) => {
  await supabase.from("articles").delete().eq("id", id);
  loadArticles();
};

document
  .getElementById("deleteAllArticlesBtn")
  ?.addEventListener("click", async () => {
    if (!confirm("Delete ALL articles?")) return;

    await supabase.from("articles").delete().not("id", "is", null);
    loadArticles();
  });

function resetArticleForm() {
  editingArticleId = null;

  document.getElementById("articleTitle").value = "";
  document.getElementById("articleExcerpt").value = "";
  document.getElementById("articleContent").value = "";
  document.getElementById("articleCover").value = "";

  uploadArticleBtn.textContent = "Publish Article";
  cancelEditBtn.style.display = "none";
}

/* =====================
   INIT
===================== */
loadAds();
loadPortfolio();
loadArticles();

/* =====================
   ARTICLE LANGUAGE SWITCH
===================== */

const langTabs = document.querySelectorAll(".lang-tab");
const langSections = document.querySelectorAll(".article-lang");

langTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // remove active from all tabs
    langTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // hide all sections
    langSections.forEach((sec) => sec.classList.remove("active"));

    // show selected language section
    const selectedLang = tab.dataset.lang;

    document.querySelector(`.article-${selectedLang}`).classList.add("active");
  });
});
