/* =====================================================
   DATA SOURCE — EDIT THIS TO ADD YOUR SLIDES
===================================================== */
const slides = [
  {
    title: "Glycogen Metabolism",
    topic: "Carbohydrate Metabolism",
    author: "Dr. Para Saran",
    pages: 42,
    file: "slides/glycogen.pdf",
    tags: ["Biochemistry", "MBBS", "Metabolism"]
  },
  {
    title: "Liver Function Tests",
    topic: "Clinical Biochemistry",
    author: "Dr. Para Saran",
    pages: 36,
    file: "slides/lft.pdf",
    tags: ["Diagnostics", "Enzymes", "Clinical"]
  },
  {
    title: "Nucleotide Metabolism",
    topic: "Molecular Biology",
    author: "Dr. Para Saran",
    pages: 58,
    file: "slides/nucleotide.pdf",
    tags: ["DNA", "RNA", "Purines", "Pyrimidines"]
  },
  {
    title: "Disorders of Glycogen Metabolism",
    topic: "Carbohydrate Metabolism",
    author: "Dr. Para Saran",
    pages: 48,
    file: "slides/glycogen_disorders.pdf",
    tags: ["GSD", "Clinical", "MBBS"]
  }
];

/* =====================================================
   DOM REFERENCES
===================================================== */
const slideList = document.getElementById("slideList");
const viewerFrame = document.getElementById("viewerFrame");
const viewerTitle = document.getElementById("viewerTitle");
const viewerSubtitle = document.getElementById("viewerSubtitle");
const downloadBtn = document.getElementById("downloadBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const emptyState = document.getElementById("emptyState");
const footerLeft = document.getElementById("footerLeft");
const footerRight = document.getElementById("footerRight");

const searchInput = document.getElementById("searchInput");
const topicFilter = document.getElementById("topicFilter");
const authorFilter = document.getElementById("authorFilter");

let currentIndex = -1;
let filteredSlides = [...slides];

/* =====================================================
   INITIALIZATION
===================================================== */
initFilters();
renderSlideList(filteredSlides);
updateFooter();

/* =====================================================
   FILTERS & SEARCH
===================================================== */
function initFilters() {
  const topics = [...new Set(slides.map(s => s.topic))];
  const authors = [...new Set(slides.map(s => s.author))];

  topics.forEach(topic => {
    const opt = document.createElement("option");
    opt.value = topic;
    opt.textContent = topic;
    topicFilter.appendChild(opt);
  });

  authors.forEach(author => {
    const opt = document.createElement("option");
    opt.value = author;
    opt.textContent = author;
    authorFilter.appendChild(opt);
  });
}

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const topicVal = topicFilter.value;
  const authorVal = authorFilter.value;

  filteredSlides = slides.filter(slide => {
    const matchesSearch =
      slide.title.toLowerCase().includes(search) ||
      slide.topic.toLowerCase().includes(search) ||
      slide.author.toLowerCase().includes(search) ||
      (slide.tags || []).join(" ").toLowerCase().includes(search);

    const matchesTopic = topicVal === "all" || slide.topic === topicVal;
    const matchesAuthor = authorVal === "all" || slide.author === authorVal;

    return matchesSearch && matchesTopic && matchesAuthor;
  });

  renderSlideList(filteredSlides);
}

searchInput.addEventListener("input", applyFilters);
topicFilter.addEventListener("change", applyFilters);
authorFilter.addEventListener("change", applyFilters);

/* =====================================================
   RENDER SLIDE LIST
===================================================== */
function renderSlideList(list) {
  slideList.innerHTML = "";

  if (list.length === 0) {
    slideList.innerHTML = `
      <div style="padding:20px;color:#6b7280;font-size:14px">
        No slides found.
      </div>
    `;
    return;
  }

  list.forEach((slide, index) => {
    const div = document.createElement("div");
    div.className = "slide-item";
    div.dataset.index = index;

    div.innerHTML = `
      <div class="slide-title">${slide.title}</div>
      <div class="slide-meta">
        ${slide.topic} • ${slide.author} • ${slide.pages} slides
      </div>
      <div class="slide-tags">
        ${(slide.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;

    div.addEventListener("click", () => loadSlideByFilteredIndex(index));
    slideList.appendChild(div);
  });
}

/* =====================================================
   LOAD SLIDES
===================================================== */
function loadSlideByFilteredIndex(filteredIndex) {
  const slide = filteredSlides[filteredIndex];
  const actualIndex = slides.indexOf(slide);
  loadSlide(actualIndex);
}

function loadSlide(index) {
  if (index < 0 || index >= slides.length) return;

  currentIndex = index;
  const slide = slides[index];

  viewerFrame.src = slide.file;
  viewerTitle.textContent = slide.title;
  viewerSubtitle.textContent = `${slide.topic} • ${slide.author} • ${slide.pages} slides`;
  downloadBtn.onclick = () => window.open(slide.file, "_blank");

  emptyState.style.display = "none";

  highlightActiveSlide();
  updateFooter();
  updateNavButtons();
}

function highlightActiveSlide() {
  const items = document.querySelectorAll(".slide-item");
  items.forEach(item => item.classList.remove("active"));

  const activeSlide = slides[currentIndex];
  const filteredIndex = filteredSlides.indexOf(activeSlide);
  if (filteredIndex !== -1) {
    const activeItem = items[filteredIndex];
    if (activeItem) activeItem.classList.add("active");
  }
}

/* =====================================================
   NAVIGATION
===================================================== */
function nextSlide() {
  if (currentIndex < slides.length - 1) {
    loadSlide(currentIndex + 1);
  }
}

function prevSlide() {
  if (currentIndex > 0) {
    loadSlide(currentIndex - 1);
  }
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "f") toggleFullscreen();
});

/* =====================================================
   FULLSCREEN
===================================================== */
function toggleFullscreen() {
  const elem = document.querySelector(".viewer-body");

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

fullscreenBtn.addEventListener("click", toggleFullscreen);

/* =====================================================
   FOOTER / STATUS
===================================================== */
function updateFooter() {
  if (currentIndex === -1) {
    footerLeft.textContent = "Ready";
    footerRight.textContent = `${slides.length} presentations`;
  } else {
    const slide = slides[currentIndex];
    footerLeft.textContent = slide.title;
    footerRight.textContent = `${slides.indexOf(slide) + 1} of ${slides.length}`;
  }
}

function updateNavButtons() {
  prevBtn.style.opacity = currentIndex <= 0 ? 0.4 : 1;
  nextBtn.style.opacity = currentIndex >= slides.length - 1 ? 0.4 : 1;
}
