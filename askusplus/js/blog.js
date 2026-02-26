import { supabase } from "./supabase.js";

const blogGrid = document.getElementById("blogGrid");
const blogLoading = document.getElementById("blogLoading");
const blogEmpty = document.getElementById("blogEmpty");

async function loadArticles() {

  blogLoading.style.display = "block";
  blogEmpty.style.display = "none";
  blogGrid.innerHTML = "";

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  blogLoading.style.display = "none";

  if (error) {
    console.error(error);
    blogEmpty.style.display = "block";
    return;
  }

  if (!data || data.length === 0) {
    blogEmpty.style.display = "block";
    return;
  }

  const isArabic = document.documentElement.dir === "rtl";

  data.forEach(article => {
    blogGrid.innerHTML += `
      <div class="blog-card" onclick="openArticle(${article.id})">
        <img src="${article.cover}" alt="">
        <div class="blog-card-content">
          <h3>${isArabic ? article.title_ar || article.title : article.title}</h3>
          <p>${isArabic ? article.excerpt_ar || article.excerpt : article.excerpt}</p>
        </div>
      </div>
    `;
  });
}

window.openArticle = function(id) {
  window.location.href = `article.html?id=${id}`;
};

loadArticles();

