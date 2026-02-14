const decks = [
  {
    title: "TCA Cycle",
    slides: Array.from({length: 10}, (_,i)=>`slides/tca/slide${i+1}.html`)
  },
  {
    title: "HMP Pathway",
    slides: Array.from({length: 5}, (_,i)=>`slides/hmp/slide${i+1}.html`)
  }
];

let currentDeckIndex = 0;
let currentSlideIndex = 0;

const deckContainer = document.getElementById("deckContainer");
const slideFrame = document.getElementById("slideFrame");
const counter = document.getElementById("counter");
const topbar = document.getElementById("topbar");
const mainContent = document.getElementById("mainContent");

function init() {
  buildSidebar();
  loadDeck(0);
}

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

function toggleDeck(index) {
  const slideList = document.getElementById(`slideList-${index}`);
  slideList.classList.toggle("expanded");
}

function loadDeck(index) {
  currentDeckIndex = index;
  currentSlideIndex = 0;
  topbar.innerText = decks[index].title;
  loadSlide();
  highlightActive();
}

function loadSlide() {
  slideFrame.src = decks[currentDeckIndex].slides[currentSlideIndex];
  counter.innerText =
    `Slide ${currentSlideIndex + 1} of ${decks[currentDeckIndex].slides.length}`;
}

function highlightActive() {
  document.querySelectorAll(".slide-tile").forEach(tile => tile.classList.remove("active"));

  const slideLists = document.querySelectorAll(".slide-list");
  slideLists.forEach(list => list.classList.remove("expanded"));

  const activeList = document.getElementById(`slideList-${currentDeckIndex}`);
  activeList.classList.add("expanded");

  const activeTile = activeList.children[currentSlideIndex];
  if (activeTile) activeTile.classList.add("active");
}

/* Controls */
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

document.getElementById("fullscreenBtn").onclick = () => {
  if (!document.fullscreenElement) {
    mainContent.requestFullscreen();
    document.body.classList.add("fullscreen");
  } else {
    document.exitFullscreen();
    document.body.classList.remove("fullscreen");
  }
};

/* Keyboard Navigation */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") document.getElementById("nextBtn").click();
  if (e.key === "ArrowLeft") document.getElementById("prevBtn").click();
});

/* Sidebar Toggle (Mobile) */
document.getElementById("menuToggle").onclick = () => {
  document.getElementById("sidebar").classList.toggle("hidden");
};

init();
