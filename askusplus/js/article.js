import { supabase } from "./supabase.js";

/* =========================
   GET ARTICLE ID FROM URL
========================= */
const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");

const container = document.getElementById("articleContainer");

/* =========================
   LOAD ARTICLE
========================= */
async function loadArticle() {

  if (!articleId) {
    container.innerHTML = `
      <div class="article-error">
        <h2>Article not found</h2>
      </div>
    `;
    return;
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .single();

  if (error || !data) {
    container.innerHTML = `
      <div class="article-error">
        <h2>Article not found</h2>
      </div>
    `;
    return;
  }

  renderArticle(data);
}

/* =========================
   RENDER ARTICLE
========================= */
function renderArticle(article) {

  const formattedDate = new Date(article.created_at)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  container.innerHTML = `
    <article class="article-wrapper">

      <img 
        src="${article.cover}" 
        alt="${article.title}"
        class="article-cover"
      >

      <div class="article-content">

        <h1 class="article-title">
          ${article.title}
        </h1>

        <p class="article-date">
          ${formattedDate}
        </p>

        <div class="article-body">
          ${formatContent(article.content)}
        </div>

      </div>

    </article>
  `;
}

/* =========================
   FORMAT CONTENT
   (Auto Paragraph Split)
========================= */
function formatContent(text) {

  // Split by line breaks and wrap in <p>
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p>${line}</p>`)
    .join("");
}

/* =========================
   INIT
========================= */
loadArticle();
