/* =========================
   ELEMENTS
========================= */
const canvas = document.getElementById("canvas");
const viewport = document.getElementById("viewport");
const nodeLayer = document.getElementById("node-layer");
const svg = document.getElementById("link-layer");

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
   DATA (EXPANDABLE)
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
      cofactor: "PLP (Vitamin B6)",
      note: "Important in glucose-alanine cycle"
    }
  }
];

/* =========================
   NODE POSITIONS
========================= */
const positions = {
  "Alanine": { x: 400, y: 500 },
  "Pyruvate": { x: 800, y: 500 }
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
      note: "Metabolite / Amino Acid"
    }, name);
  };

  nodeLayer.appendChild(node);
}

/* =========================
   CREATE CURVED LINK (SVG)
========================= */
function createCurve(p1, p2, link) {

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.classList.add("link-path");

  // Control point for curve (gives "neural bend")
  const dx = (p2.x - p1.x) * 0.5;
  const curveOffset = 80; // tweak for more curve

  const d = `
    M ${p1.x} ${p1.y}
    C ${p1.x + dx} ${p1.y - curveOffset},
      ${p2.x - dx} ${p2.y + curveOffset},
      ${p2.x} ${p2.y}
  `;

  path.setAttribute("d", d);

  /* CLICK INTERACTION */
  path.addEventListener("click", (e) => {
    e.stopPropagation();

    path.classList.toggle("active");

    togglePopup(e, link.details, link.id);
  });

  svg.appendChild(path);

  /* LABEL */
  createLabel(link.label, (p1.x + p2.x)/2, (p1.y + p2.y)/2, link.details, link.id);
}

/* =========================
   LABEL
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

  nodeLayer.appendChild(label);
}

/* =========================
   POPUP
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
   RENDER
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

    createCurve(p1, p2, link);
  });
}

render();

/* =========================
   PAN (MOUSE)
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

viewport.addEventListener("mouseup", () => isDragging = false);
viewport.addEventListener("mouseleave", () => isDragging = false);

/* =========================
   TOUCH PAN
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

viewport.addEventListener("touchend", () => isDragging = false);

/* =========================
   ZOOM
========================= */
viewport.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomSpeed = 0.1;
  scale += e.deltaY * -zoomSpeed * 0.01;

  scale = Math.min(Math.max(0.4, scale), 2.5);

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
