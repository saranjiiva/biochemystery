const slideGrid = document.getElementById("slideGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const viewerTitle = document.getElementById("viewerTitle");
const viewerControls = document.getElementById("viewerControls");
const viewerContainer = document.getElementById("viewerContainer");
const downloadBtn = document.getElementById("downloadBtn");

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageIndicator = document.getElementById("pageIndicator");

/* ================= SLIDE DATA ================= */
const slides = [
  {
    title: "Carbohydrate Metabolism",
    category: "biochemistry",
    file: "slides/carb_metabolism.pdf"
  },
  {
    title: "Enzyme Kinetics",
    category: "biochemistry",
    file: "slides/enzyme_kinetics.pdf"
  },
  {
    title: "Liver Function Tests",
    category: "pathology",
    file: "slides/lft.pdf"
  },
  {
    title: "Pharmacokinetics",
    category: "pharmacology",
    file: "slides/pharmacokinetics.pdf"
  }
];

/* ================= PDF.JS SETUP ================= */
const pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let pdfDoc = null;
let currentPage = 1;
let totalPages = 1;

/* ================= RENDER SLIDE CARDS ================= */
function renderSlides(list) {
  slideGrid.innerHTML = "";

  list.forEach(slide => {
    const card = document.createElement("div");
    card.className = "slide-card";
    card.innerHTML = `
      <div class="slide-thumb">
        <i class="fa-solid fa-file-pdf"></i>
      </div>
      <h3>${slide.title}</h3>
      <span>${slide.category}</span>
    `;
    card.onclick = () => openPDF(slide);
    slideGrid.appendChild(card);
  });
}

/* ================= SEARCH & FILTER ================= */
function filterSlides() {
  const text = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = slides.filter(slide => {
    const matchesText = slide.title.toLowerCase().includes(text);
    const matchesCategory = category === "all" || slide.category === category;
    return matchesText && matchesCategory;
  });

  renderSlides(filtered);
}

searchInput.addEventListener("input", filterSlides);
categoryFilter.addEventListener("change", filterSlides);

/* ================= OPEN PDF ================= */
async function openPDF(slide) {
  viewerTitle.textContent = slide.title;
  downloadBtn.href = slide.file;
  downloadBtn.classList.remove("hidden");

  viewerControls.classList.remove("hidden");

  pdfDoc = await pdfjsLib.getDocument(slide.file).promise;
  totalPages = pdfDoc.numPages;
  currentPage = 1;
  renderPage();
}

/* ================= RENDER PAGE ================= */
async function renderPage() {
  const page = await pdfDoc.getPage(currentPage);
  const viewport = page.getViewport({ scale: 1.2 });

  viewerContainer.innerHTML = "";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.height = viewport.height;
  canvas.width = viewport.width;
  viewerContainer.appendChild(canvas);

  await page.render({ canvasContext: ctx, viewport }).promise;

  pageIndicator.textContent = `${currentPage} / ${totalPages}`;
}

/* ================= CONTROLS ================= */
prevPageBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
};

nextPageBtn.onclick = () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
};

/* ================= INIT ================= */
renderSlides(slides);
