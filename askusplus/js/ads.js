import { supabase } from "./supabase.js";


/* =====================
   DOM ELEMENTS
===================== */
const topContainer = document.getElementById("adsTop");
const bottomContainer = document.getElementById("adsBottom");

/* =====================
   LOAD ADS
===================== */
async function loadAds() {
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load ads:", error);
    return;
  }

  if (!data || data.length === 0) return;

  data.forEach(ad => {
   const box = document.createElement("a");
box.className = "ad-box";
box.href = ad.link || "#";
box.target = "_blank";
box.rel = "noopener noreferrer";

box.innerHTML = `
  <img src="${ad.image}" alt="Sponsored Ad">
  <span class="ad-badge">Sponsored</span>
`;


    if (ad.position === "top" && topContainer) {
      topContainer.appendChild(box);
    }

    if (ad.position === "bottom" && bottomContainer) {
      bottomContainer.appendChild(box);
    }
  });
}

/* =====================
   INIT
===================== */
loadAds();
