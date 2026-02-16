/* =========================
   SLIDE DECK CONFIGURATION
========================= */

const decks = [
  {
    title: "TCA Cycle",
    slides: Array.from({length: 10}, (_,i)=>`slides/tca/slide${i+1}.html`)
  },
  {
    title: "HMP Pathway",
    slides: Array.from({length: 5}, (_,i)=>`slides/hmp/slide${i+1}.html`)
  },
     {
    title: "Regulation of blood glucose",
    slides: Array.from({length: 5}, (_,i)=>`slides/rgb/slide${i+1}.html`)
  },
  {
    title: "Forensic Medicine",
    slides: Array.from({length: 6}, (_,i)=>`slides/fm/slide${i+1}.html`)
  }
];

/* =========================
   STATE VARIABLES
========================= */

let currentDeckIndex = 0;
let currentSlideIndex = 0;

/* =========================
   DOM ELEMENTS
========================= */

const deckContainer = document.getElementById("deckContainer");
const slideFrame = document.getElementById("slideFrame");
const counter = document.getElementById("counter");
const topbar = document.getElementById("topbar");
const mainContent = document.getElementById("mainContent");
const sidebar = document.getElementById("sidebar");

/* =========================
   INITIALIZE
========================= */

function init() {
  buildSidebar();
  loadDeck(0);
}

/* =========================
   BUILD SIDEBAR
========================= */

function buildSidebar() {
  deckContainer.innerHTML = "";

  decks.forEach((deck, deckIndex) => {

    const deckDiv = document.createElement("div");
    deckDiv.className = "deck";

    const titleDiv = document.createElement("div");
    titleDiv.className = "deck-title";
    titleDiv.innerHTML = `${deck.title} <span>▼</span>`;

    titleDiv.onclick = () => toggleDeck(deckIndex);

    const slideList = document.createElement("div");
    slideList.className = "slide-list";
    slideList.id = `slideList-${deckIndex}`;

    deck.slides.forEach((_, slideIndex) => {

      const slideTile = document.createElement("div");
      slideTile.className = "slide-tile";
      slideTile.innerText = `Slide ${slideIndex + 1}`;

      slideTile.onclick = () => {
        currentDeckIndex = deckIndex;
        currentSlideIndex = slideIndex;
        loadSlide();
        highlightActive();
      };

      slideList.appendChild(slideTile);
    });

    deckDiv.appendChild(titleDiv);
    deckDiv.appendChild(slideList);
    deckContainer.appendChild(deckDiv);
  });
}

/* =========================
   TOGGLE DECK EXPANSION
========================= */

function toggleDeck(index) {
  const slideList = document.getElementById(`slideList-${index}`);
  slideList.classList.toggle("expanded");
}

/* =========================
   LOAD DECK
========================= */

function loadDeck(index) {
  currentDeckIndex = index;
  currentSlideIndex = 0;
  topbar.innerText = decks[index].title;
  loadSlide();
  highlightActive();
}

/* =========================
   LOAD SLIDE
========================= */

function loadSlide() {
  slideFrame.style.opacity = 0;

  setTimeout(() => {
    slideFrame.src = decks[currentDeckIndex].slides[currentSlideIndex];
    counter.innerText =
      `Slide ${currentSlideIndex + 1} of ${decks[currentDeckIndex].slides.length}`;
    slideFrame.style.opacity = 1;
  }, 150);
}

/* =========================
   HIGHLIGHT ACTIVE SLIDE
========================= */

function highlightActive() {

  document.querySelectorAll(".slide-tile").forEach(tile =>
    tile.classList.remove("active")
  );

  document.querySelectorAll(".slide-list").forEach(list =>
    list.classList.remove("expanded")
  );

  const activeList = document.getElementById(`slideList-${currentDeckIndex}`);
  activeList.classList.add("expanded");

  const activeTile = activeList.children[currentSlideIndex];
  if (activeTile) activeTile.classList.add("active");
}

/* =========================
   NEXT / PREVIOUS
========================= */

document.getElementById("nextBtn").onclick = () => {
  if (currentSlideIndex < decks[currentDeckIndex].slides.length - 1) {
    currentSlideIndex++;
    loadSlide();
    highlightActive();
  }
};

document.getElementById("prevBtn").onclick = () => {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    loadSlide();
    highlightActive();
  }
};

/* =========================
   FULLSCREEN MODE
========================= */

document.getElementById("fullscreenBtn").onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.body.classList.add("fullscreen");
  } else {
    document.exitFullscreen();
    document.body.classList.remove("fullscreen");
  }
};

/* =========================
   KEYBOARD NAVIGATION
========================= */

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") {
    document.getElementById("nextBtn").click();
  }
  if (e.key === "ArrowLeft") {
    document.getElementById("prevBtn").click();
  }
});

/* =========================
   SWIPE SUPPORT (MOBILE)
========================= */

let startX = 0;

slideFrame.addEventListener("touchstart", e => {
  startX = e.changedTouches[0].screenX;
});

slideFrame.addEventListener("touchend", e => {
  let diff = e.changedTouches[0].screenX - startX;
  if (diff < -50) document.getElementById("nextBtn").click();
  if (diff > 50) document.getElementById("prevBtn").click();
});

/* =========================
   SIDEBAR TOGGLE (MOBILE)
========================= */

document.getElementById("menuToggle").onclick = () => {
  sidebar.classList.toggle("active");
};

/* =========================
   START
========================= */

init();
