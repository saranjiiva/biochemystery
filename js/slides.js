/****************************************************
 * SLIDE DATA CONFIGURATION
 ****************************************************/
const slides = [
  {
    title: "Carbohydrate Metabolism",
    file: "slides/metabolism.pdf",
    category: "biochemistry",
    author: "Dr Para Saran",
    pages: 42,
    description: "Detailed pathways of glycolysis, gluconeogenesis, TCA cycle and their regulation."
  },
  {
    title: "Enzyme Kinetics & Inhibition",
    file: "slides/enzymes.pdf",
    category: "biochemistry",
    author: "Dr Para Saran",
    pages: 35,
    description: "Michaelis-Menten kinetics, Lineweaver-Burk plots, inhibitors and clinical correlations."
  },
  {
    title: "Liver Function Tests",
    file: "slides/lft.pdf",
    category: "pathology",
    author: "Dr Para Saran",
    pages: 28,
    description: "Interpretation of LFTs, patterns of jaundice, enzymes and biomarkers."
  },
  {
    title: "Heme Synthesis & Porphyrias",
    file: "slides/heme.pdf",
    category: "biochemistry",
    author: "Dr Para Saran",
    pages: 32,
    description: "Steps of heme biosynthesis, enzyme defects and clinical porphyrias."
  }
];

/****************************************************
 * DOM REFERENCES
 ****************************************************/
const slideGrid = document.getElementById("slideGrid");
const viewerTitle = document.getElementById("viewerTitle");
const viewerContainer = document.getElementById("viewerContainer");
const metaPanel = document.getElementById("metaPanel");
const metaAuthor = document.getElementById("metaAuthor");
const metaCategory = document.getElementById("metaCategory");
const metaPages = document.getElementById("metaPages");
const metaDescription = document.getElementById("metaDescription");
const downloadBtn = document.getElementById("downloadBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const viewerControls = document.getElementById("viewerControls");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageIndicator = document.getElementById("pageIndicator");
const zoomSlider = document.getElementById("zoomSlider");
const zoomLabel = document.getElementById("zoomLabel");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

/****************************************************
 * PDF STATE
 ****************************************************/
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let zoomLevel = 1;

/****************************************************
 * INITIAL LOAD
 ****************************************************/
renderSlideLibrary(slides);

/****************************************************
 * RENDER SLIDE LIBRARY
 ****************************************************/
function renderSlideLibrary(slideList) {
  slideGrid.innerHTML = "";

  slideList.forEach((slide, index) => {
    const card = document.createElement("div");
    card.className = "slide-card";
    card.innerHTML = `
      <div class="slide-thumb">
        <i class="fa-solid fa-file-powerpoint"></i>
      </div>
      <div class="slide-body">
        <p class="slide-title">${slide.title}</p>
        <p class="slide-meta">${capitalize(slide.category)}</p>
      </div>
      <div class="slide-footer">
        <span>${slide.pages} pages</span>
        <i class="fa-solid fa-eye"></i>
      </div>
    `;

    card.addEventListener("click", () => loadSlide(index));
    slideGrid.appendChild(card);
  });
}

/****************************************************
 * LOAD SLIDE INTO VIEWER
 ****************************************************/
async function loadSlide(index) {
  const slide = slides[index];

  viewerTitle.textContent = slide.title;
  metaAuthor.textContent = slide.author;
  metaCategory.textContent = capitalize(slide.category);
  metaPages.textContent = slide.pages;
  metaDescription.textContent = slide.description;

  metaPanel.classList.remove("hidden");
  viewerControls.classList.remove("hidden");

  downloadBtn.disabled = false;
  fullscreenBtn.disabled = false;
  downloadBtn.onclick = () => window.open(slide.file, "_blank");

  viewerContainer.innerHTML = "<p>Loading slides...</p>";

  const loadingTask = pdfjsLib.getDocument(slide.file);
  pdfDoc = await loadingTask.promise;

  totalPages = pdfDoc.numPages;
  currentPage = 1;
  zoomLevel = 1;

  zoomSlider.value = zoomLevel;
  zoomLabel.textContent = "100%";

  renderPage(currentPage);
}

/****************************************************
 * RENDER CURRENT PAGE
 ****************************************************/
async function renderPage(pageNumber) {
  const page = await pdfDoc.getPage(pageNumber);

  const viewport = page.getViewport({ scale: zoomLevel });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  viewerContainer.innerHTML = "";
  viewerContainer.appendChild(canvas);

  await page.render({ canvasContext: ctx, viewport }).promise;

  pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

/****************************************************
 * CONTROLS
 ****************************************************/
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

zoomSlider.addEventListener("input", () => {
  zoomLevel = parseFloat(zoomSlider.value);
  zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
  renderPage(currentPage);
});

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    viewerContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

/****************************************************
 * SEARCH + FILTER
 ****************************************************/
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = slides.filter(slide => {
    const matchesSearch =
      slide.title.toLowerCase().includes(searchText) ||
      slide.description.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "all" || slide.category === category;

    return matchesSearch && matchesCategory;
  });

  renderSlideLibrary(filtered);
}

/****************************************************
 * UTILITIES
 ****************************************************/
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
