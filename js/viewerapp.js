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
/* =========================
   NODES (ALL ENTITIES)
========================= */
function createNode(name) {
  const node = document.createElement("div");
  node.className = "node";
  node.innerText = name;

  const pos = positions[name];
  if (!pos) return;

  node.style.left = pos.x + "px";
  node.style.top = pos.y + "px";

  

  nodeLayer.appendChild(node);
}
const nodes = {
  "Alanine": { note: "Glucogenic amino acid, involved in glucose-alanine cycle" },
  "Pyruvate": { note: "Central metabolic intermediate" },

  "Serine": { note: "One-carbon metabolism, precursor of glycine" },
  "Glycine": { note: "Heme + purine synthesis" },

  "Aspartate": { note: "Urea cycle + pyrimidine synthesis" },
  "Oxaloacetate": { note: "TCA intermediate" },

  "Glutamate": { note: "Central amino group donor" },
  "Alpha-Ketoglutarate": { note: "TCA intermediate" },

  "Phenylalanine": { note: "Essential amino acid" },
  "Tyrosine": { note: "Precursor for dopamine, melanin" },

  "Tryptophan": { note: "Serotonin + niacin precursor" },

  "Methionine": { note: "Methyl donor (SAM)" },
  "Cysteine": { note: "Glutathione synthesis" },

  "Leucine": { note: "Ketogenic amino acid" },
  "Isoleucine": { note: "Both glucogenic + ketogenic" },
  "Valine": { note: "Glucogenic BCAA" },
   "Fumarate": { note: "TCA cycle intermediate" }
};

/* =========================
   LINKS (REACTIONS)
========================= */
const links = [

  {
    from: "Alanine",
    to: "Pyruvate",
    label: "Transamination",
    details: {
      title: "Alanine → Pyruvate",
      enzyme: "ALT",
      cofactor: "PLP",
      note: "Glucose-alanine cycle"
    }
  },

  {
    from: "Serine",
    to: "Pyruvate",
    label: "Deamination",
    details: {
      title: "Serine → Pyruvate",
      enzyme: "Serine dehydratase",
      note: "Occurs in liver"
    }
  },

  {
    from: "Serine",
    to: "Glycine",
    label: "One-carbon transfer",
    details: {
      title: "Serine ↔ Glycine",
      enzyme: "Serine hydroxymethyltransferase",
      cofactor: "Folate",
      note: "Important for nucleotide synthesis"
    }
  },

  {
    from: "Aspartate",
    to: "Oxaloacetate",
    label: "Transamination",
    details: {
      title: "Aspartate → OAA",
      enzyme: "AST",
      cofactor: "PLP",
      note: "Links amino acids to TCA"
    }
  },

  {
    from: "Glutamate",
    to: "Alpha-Ketoglutarate",
    label: "Oxidative deamination",
    details: {
      title: "Glutamate → α-KG",
      enzyme: "Glutamate dehydrogenase",
      note: "Ammonia release"
    }
  },

  {
    from: "Phenylalanine",
    to: "Tyrosine",
    label: "Hydroxylation",
    details: {
      title: "Phenylalanine → Tyrosine",
      enzyme: "Phenylalanine hydroxylase",
      cofactor: "BH4",
      note: "Defect → PKU"
    }
  },

  {
    from: "Tyrosine",
    to: "Fumarate",
    label: "Degradation",
    details: {
      title: "Tyrosine → Fumarate",
      note: "Links to TCA cycle"
    }
  },

  {
    from: "Tryptophan",
    to: "Alanine",
    label: "Degradation",
    details: {
      title: "Tryptophan → Alanine",
      note: "Also forms niacin"
    }
  },

  {
    from: "Methionine",
    to: "Cysteine",
    label: "Transsulfuration",
    details: {
      title: "Methionine → Cysteine",
      note: "Defect → Homocystinuria"
    }
  }

];
const positions = {
  "Alanine": { x: 300, y: 400 },
  "Pyruvate": { x: 600, y: 400 },

  "Serine": { x: 300, y: 550 },
  "Glycine": { x: 600, y: 550 },

  "Aspartate": { x: 300, y: 700 },
  "Oxaloacetate": { x: 600, y: 700 },

  "Glutamate": { x: 300, y: 850 },
  "Alpha-Ketoglutarate": { x: 600, y: 850 },

  "Phenylalanine": { x: 900, y: 400 },
  "Tyrosine": { x: 1200, y: 400 },

  "Tryptophan": { x: 900, y: 550 },

  "Methionine": { x: 900, y: 700 },
  "Cysteine": { x: 1200, y: 700 },
   "Leucine": { x: 300, y: 1000 },
"Isoleucine": { x: 600, y: 1000 },
"Valine": { x: 900, y: 1000 },
   "Fumarate": { note: "TCA cycle intermediate" }
};
function createLine(p1, p2, link) {

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  line.setAttribute("x1", p1.x);
  line.setAttribute("y1", p1.y);
  line.setAttribute("x2", p2.x);
  line.setAttribute("y2", p2.y);

  line.classList.add("link-path");

  line.addEventListener("click", (e) => {
    e.stopPropagation();
    line.classList.toggle("active");
    togglePopup(e, link.details, link.from + link.to);
  });

  svg.appendChild(line);

  createLabel(link.label, (p1.x + p2.x)/2 + 10,
(p1.y + p2.y)/2 - 10, link.details, link.from + link.to);
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

popup.style.left = Math.min(e.clientX, window.innerWidth - 260) + "px";
popup.style.top = Math.min(e.clientY, window.innerHeight - 150) + "px";

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

  // Create nodes
  Object.keys(nodes).forEach(name => {
    createNode(name);
  });

  // Create links
  links.forEach(link => {
    const p1 = positions[link.from];
    const p2 = positions[link.to];

    if (p1 && p2) {
      createLine(p1, p2, link);
    }
  });
}

render();
node.onclick = (e) => {
  e.stopPropagation();

  togglePopup(e, {
    title: name,
    note: nodes[name].note
  }, name);
};

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
