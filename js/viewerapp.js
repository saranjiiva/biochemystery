const decks = [
  {
    title: "TCA Cycle",
    slides: Array.from({length:35}, (_,i)=>`slides/tca/slide${i+1}.html`)
  },
  {
    title: "HMP",
    slides: [
      "slides/hmp/slide1.html",
      "slides/hmp/slide2.html",
      "slides/hmp/slide3.html",
      "slides/hmp/slide4.html"
    ]
  }
];

let currentDeckIndex = 0;
let currentSlideIndex = 0;

const sidebar = document.getElementById("sidebar");
const slideFrame = document.getElementById("slideFrame");
const counter = document.getElementById("counter");
const topbar = document.getElementById("topbar");
const mainContent = document.getElementById("mainContent");

function init() {
  buildDeckList();
  loadDeck(0);
}

function buildDeckList() {
  const deckList = document.getElementById("deckList");
  deckList.innerHTML = "";

  decks.forEach((deck, index) => {
    const div = document.createElement("div");
    div.className = "deck-item";
    div.innerText = deck.title;
    div.onclick = () => loadDeck(index);
    deckList.appendChild(div);
  });
}

function loadDeck(index) {
  currentDeckIndex = index;
  currentSlideIndex = 0;
  topbar.innerText = decks[index].title;
  highlightActive();
  loadSlide();
}

function highlightActive() {
  document.querySelectorAll(".deck-item").forEach((item, i) => {
    item.classList.toggle("active", i === currentDeckIndex);
  });
}

function loadSlide() {
  slideFrame.classList.add("fade");

  setTimeout(() => {
    slideFrame.src = decks[currentDeckIndex].slides[currentSlideIndex];
    counter.innerText = `Slide ${currentSlideIndex+1} of ${decks[currentDeckIndex].slides.length}`;
    slideFrame.classList.remove("fade");
  }, 200);
}

function nextSlide() {
  if (currentSlideIndex < decks[currentDeckIndex].slides.length - 1) {
    currentSlideIndex++;
    loadSlide();
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    loadSlide();
  }
}

/* Controls */
document.getElementById("nextBtn").onclick = nextSlide;
document.getElementById("prevBtn").onclick = prevSlide;

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
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

/* Swipe Navigation */
let startX = 0;
slideFrame.addEventListener("touchstart", e => {
  startX = e.changedTouches[0].screenX;
});

slideFrame.addEventListener("touchend", e => {
  let diff = e.changedTouches[0].screenX - startX;
  if (diff < -50) nextSlide();
  if (diff > 50) prevSlide();
});

/* Sidebar Toggle */
document.getElementById("menuToggle").onclick = () => {
  sidebar.classList.toggle("hidden");
};

init();
