/* =====================================================
   DOM ELEMENTS
===================================================== */
const slideGrid = document.getElementById("slideGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const uploadInput = document.getElementById("uploadInput");
const toggleThemeBtn = document.getElementById("toggleTheme");

const viewerTitle = document.getElementById("viewerTitle");
const viewerSubtitle = document.getElementById("viewerSubtitle");
const metaPanel = document.getElementById("metaPanel");
const metaFile = document.getElementById("metaFile");
const metaCategory = document.getElementById("metaCategory");
const metaPages = document.getElementById("metaPages");

const viewerControls = document.getElementById("viewerControls");
const firstPageBtn = document.getElementById("firstPage");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const lastPageBtn = document.getElementById("lastPage");
const pageIndicator = document.getElementById("pageIndicator");
const zoomSlider = document.getElementById("zoomSlider");
const zoomLabel = document.getElementById("zoomLabel");
const downloadBtn = document.getElementById("downloadBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const viewerContainer = document.getElementById("viewerContainer");
const tabButtons = document.querySelectorAll(".tab-btn");

/* =====================================================
   DATA
===================================================== */

// Default slides (from GitHub /slides folder)
let slides = [
  {
    id: "carb",
    title: "Carbohydrate Metabolism",
    category: "biochemistry",
    file: "slides/carbohydrate_metabolism.pdf"
  },
  {
    id: "enz",
    title: "Enzyme Kinetics",
    category: "biochemistry",
    file: "slides/enzyme_kinetics.pdf"
  },
  {
    id: "lft",
    title: "Liver Function Tests",
    category: "pathology",
    file: "slides/lft.pdf"
  },
  {
    id: "pk",
    title: "Pharmacokinetics",
    category: "pharmacology",
    file: "slides/pharmacokinetics.pdf"
  }
];

// Load uploaded slides from localStorage
const savedUploads = JSON.parse(localStorage.getItem("uploadedSlides") || "[]");
slides = [...savedUploads, ...slides];

// Favorites & recents
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let recents = JSON.parse(localStorage.getItem("recents") || "[]");

// Viewer state
let pdfDoc = null;
let currentPage = 1;
let totalPages = 1;
let scale = 1;
let activeSlide = null;
let activeTab = "all";

/* =====================================================
   PDF.JS CONFIG
===================================================== */
const pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

/* =====================================================
   UTILITIES
===================================================== */
function saveUploads() {
  const uploads = slides.filter(s => s.category === "uploaded");
  localStorage.setItem("uploadedSlides", JSON.stringify(uploads));
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function saveRecents() {
  localStorage.setItem("recents", JSON.stringify(recents));
}

function isFavorite(id) {
  return favorites.includes(id);
}

function addRecent(id) {
  recents = recents.filter(r => r !== id);
  recents.unshift(id);
  recents = recents.slice(0, 10);
  saveRecents();
}

function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

/* =====================================================
   RENDER SLIDES
===================================================== */
function renderSlides(list = slides) {
  slideGrid.innerHTML = "";

  if (!list.length) {
    slideGrid.innerHTML = `<div class="placeholder" style="grid-column: 1/-1">
      <i class="fa-solid fa-folder-open"></i>
      <h3>No slides found</h3>
      <p>Try another search or upload a PDF.</p>
    </div>`;
    return;
  }

  list.forEach(slide => {
    const card = document.createElement("div");
    card.className = "slide-card";
    card.innerHTML = `
      ${isFavorite(slide.id) ? `<i class="fa-solid fa-star fav"></i>` : ""}
      <h3>${slide.title}</h3>
      <p>${slide.file.split("/").pop()}</p>
      <span>${slide.category}</span>
    `;

    card.onclick = () => openPDF(slide);
    slideGrid.appendChild(card);
  });
}

/* =====================================================
   SEARCH + FILTER + TABS
===================================================== */
function applyFilters() {
  const text = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  let filtered = slides.filter(slide => {
    const matchesText =
      slide.title.toLowerCase().includes(text) ||
      slide.file.toLowerCase().includes(text);
    const matchesCategory = category === "all" || slide.category === category;
    return matchesText && matchesCategory;
  });

  if (activeTab === "favorites") {
    filtered = filtered.filter(s => favorites.includes(s.id));
  } else if (activeTab === "recent") {
    filtered = recents.map(id => slides.find(s => s.id === id)).filter(Boolean);
  }

  renderSlides(filtered);
}

searchInput.addEventListener("input", debounce(applyFilters, 200));
categoryFilter.addEventListener("change", applyFilters);

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    applyFilters();
  });
});

/* =====================================================
   OPEN PDF
===================================================== */
async function openPDF(slide) {
  try {
    viewerTitle.textContent = slide.title;
    viewerSubtitle.textContent = slide.file.split("/").pop();
    metaFile.textContent = slide.file.split("/").pop();
    metaCategory.textContent = slide.category;

    metaPanel.classList.remove("hidden");
    viewerControls.classList.remove("hidden");
    downloadBtn.disabled = false;
    fullscreenBtn.disabled = false;
    favoriteBtn.disabled = false;

    activeSlide = slide;
    updateFavoriteIcon();

    pdfDoc = await pdfjsLib.getDocument(slide.file).promise;
    totalPages = pdfDoc.numPages;
    currentPage = 1;
    scale = 1;

    metaPages.textContent = totalPages;
    zoomSlider.value = 1;
    zoomLabel.textContent = "100%";

    addRecent(slide.id);
    renderPage();
  } catch (err) {
    viewerContainer.innerHTML = `
      <div class="placeholder">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h3>Unable to load PDF</h3>
        <p>${err.message}</p>
      </div>`;
  }
}

/* =====================================================
   RENDER PAGE
===================================================== */
async function renderPage() {
  if (!pdfDoc) return;

  const page = await pdfDoc.getPage(currentPage);
  const viewport = page.getViewport({ scale });

  viewerContainer.innerHTML = "";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  viewerContainer.appendChild(canvas);

  await page.render({ canvasContext: ctx, viewport }).promise;

  pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;
}

/* =====================================================
   CONTROLS
===================================================== */
firstPageBtn.onclick = () => {
  if (pdfDoc && currentPage !== 1) {
    currentPage = 1;
    renderPage();
  }
};

prevPageBtn.onclick = () => {
  if (pdfDoc && currentPage > 1) {
    currentPage--;
    renderPage();
  }
};

nextPageBtn.onclick = () => {
  if (pdfDoc && currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
};

lastPageBtn.onclick = () => {
  if (pdfDoc && currentPage !== totalPages) {
    currentPage = totalPages;
    renderPage();
  }
};

zoomSlider.oninput = () => {
  scale = parseFloat(zoomSlider.value);
  zoomLabel.textContent = Math.round(scale * 100) + "%";
  renderPage();
};

downloadBtn.onclick = () => {
  if (!activeSlide) return;
  const link = document.createElement("a");
  link.href = activeSlide.file;
  link.download = activeSlide.file.split("/").pop();
  link.click();
};

fullscreenBtn.onclick = () => {
  viewerContainer.requestFullscreen?.();
};

/* =====================================================
   FAVORITES
===================================================== */
function updateFavoriteIcon() {
  if (!activeSlide) return;
  favoriteBtn.innerHTML = isFavorite(activeSlide.id)
    ? `<i class="fa-solid fa-star"></i>`
    : `<i class="fa-regular fa-star"></i>`;
}

favoriteBtn.onclick = () => {
  if (!activeSlide) return;

  if (isFavorite(activeSlide.id)) {
    favorites = favorites.filter(id => id !== activeSlide.id);
  } else {
    favorites.push(activeSlide.id);
  }

  saveFavorites();
  updateFavoriteIcon();
  applyFilters();
};

/* =====================================================
   UPLOAD HANDLING (LOCAL PREVIEW + STORAGE)
===================================================== */
uploadInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    alert("Please upload only PDF files.");
    return;
  }

  const url = URL.createObjectURL(file);
  const id = "upload_" + Date.now();

  const slide = {
    id,
    title: file.name.replace(".pdf", ""),
    category: "uploaded",
    file: url
  };

  slides.unshift(slide);
  saveUploads();
  applyFilters();
  openPDF(slide);
  uploadInput.value = "";
});

/* =====================================================
   THEME TOGGLE
===================================================== */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.body.classList.add("light-theme");

toggleThemeBtn.onclick = () => {
  document.body.classList.toggle("light-theme");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-theme") ? "light" : "dark"
  );
};

/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */
document.addEventListener("keydown", e => {
  if (!pdfDoc) return;

  if (e.key === "ArrowRight") nextPageBtn.click();
  if (e.key === "ArrowLeft") prevPageBtn.click();
  if (e.key === "+") {
    zoomSlider.value = Math.min(parseFloat(zoomSlider.value) + 0.1, 2.5);
    zoomSlider.dispatchEvent(new Event("input"));
  }
  if (e.key === "-") {
    zoomSlider.value = Math.max(parseFloat(zoomSlider.value) - 0.1, 0.5);
    zoomSlider.dispatchEvent(new Event("input"));
  }
});

/* =====================================================
   INIT
===================================================== */
applyFilters();
