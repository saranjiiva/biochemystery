/* =========================
   ELEMENTS
========================= */
const canvas = document.getElementById("canvas");
const viewport = document.getElementById("viewport");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");

/* =========================
   STATE
========================= */
let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let startX, startY;

let activePopupId = null;

/* =========================
   DATA MODEL (EXPAND HERE)
========================= */
const data = [
  {
    id: "alanine_rxn",
    from: "Alanine",
    to: "Pyruvate",
    label: "Transamination",
    details: {
      title: "Alanine → Pyruvate",
      enzyme: "Alanine Transaminase (ALT)",
      cofactor: "Pyridoxal Phosphate (Vitamin B6)",
      note: "Key reaction in glucose-alanine cycle"
    }
  }
];

/* =========================
   NODE POSITIONS
   (expandable)
========================= */
const positions = {
  "Alanine": { x: 200, y: 300 },
  "Pyruvate": { x: 450, y: 300 }
};

/* =========================
   CREATE NODE
========================= */
function createNode(name) {
  const node = document.createElement("div");
  node.className = "node";
  node.innerText = name;

  const pos = positions[name];
  node.style.left = pos.x + "px";
  node.style.top = pos.y + "px";

  node.onclick = (e) => {
    e.stopPropagation();
    togglePopup(e, {
      title: name,
      note: "Amino acid / metabolite"
    }, name);
  };

  canvas.appendChild(node);
}

/* =========================
   CREATE LINE
========================= */
function createLine(x1, y1, x2, y2) {
  const line = document.createElement("div");
  line.className = "line";

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  line.style.width = length + "px";
  line.style.left = x1 + "px";
  line.style.top = y1 + "px";
  line.style.transform = `rotate(${angle}deg)`;

  canvas.appendChild(line);
}

/* =========================
   CREATE LABEL
========================= */
function createLabel(text, x, y, details, id) {
  const label = document.createElement("div");
  label.className = "label";
  label.innerText = text;

  label.style.left = x + "px";
  label.style.top = y + "px";

  label.onclick = (e) => {
    e.stopPropagation();
    togglePopup(e, details, id);
  };

  canvas.appendChild(label);
}

/* =========================
   POPUP TOGGLE
========================= */
function togglePopup(e, details, id) {

  if (activePopupId === id) {
    popup.classList.add("hidden");
    activePopupId = null;
    return;
  }

  popupContent.innerHTML = `
    <h3>${details.title || ""}</h3>
    ${details.enzyme ? `<p><b>Enzyme:</b> ${details.enzyme}</p>` : ""}
    ${details.cofactor ? `<p><b>Cofactor:</b> ${details.cofactor}</p>` : ""}
    ${details.note ? `<p>${details.note}</p>` : ""}
  `;

  popup.style.left = e.clientX + "px";
  popup.style.top = e.clientY + "px";
  popup.classList.remove("hidden");

  activePopupId = id;
}

/* Close popup */
viewport.addEventListener("click", () => {
  popup.classList.add("hidden");
  activePopupId = null;
});

/* =========================
   RENDER MAP
========================= */
function render() {
  const created = new Set();

  data.forEach(link => {

    if (!created.has(link.from)) {
      createNode(link.from);
      created.add(link.from);
    }

    if (!created.has(link.to)) {
      createNode(link.to);
      created.add(link.to);
    }

    const p1 = positions[link.from];
    const p2 = positions[link.to];

    createLine(p1.x + 50, p1.y + 20, p2.x, p2.y + 20);

    createLabel(
      link.label,
      (p1.x + p2.x) / 2,
      (p1.y + p2.y) / 2 - 25,
      link.details,
      link.id
    );
  });
}

render();

/* =========================
   PAN (DRAG)
========================= */
viewport.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - originX;
  startY = e.clientY - originY;
});

viewport.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  originX = e.clientX - startX;
  originY = e.clientY - startY;

  updateTransform();
});

viewport.addEventListener("mouseup", () => {
  isDragging = false;
});

viewport.addEventListener("mouseleave", () => {
  isDragging = false;
});

/* =========================
   TOUCH DRAG (MOBILE)
========================= */
viewport.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX - originX;
  startY = e.touches[0].clientY - originY;
});

viewport.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  originX = e.touches[0].clientX - startX;
  originY = e.touches[0].clientY - startY;

  updateTransform();
});

viewport.addEventListener("touchend", () => {
  isDragging = false;
});

/* =========================
   ZOOM
========================= */
viewport.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomSpeed = 0.1;
  scale += e.deltaY * -zoomSpeed * 0.01;

  scale = Math.min(Math.max(0.5, scale), 2);

  updateTransform();
});

/* =========================
   APPLY TRANSFORM
========================= */
function updateTransform() {
  canvas.style.transform = `
    translate(${originX}px, ${originY}px)
    scale(${scale})
  `;
}

/* =========================
   BUTTON FUNCTIONS
========================= */
function resetView() {
  scale = 1;
  originX = 0;
  originY = 0;
  updateTransform();
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
}
