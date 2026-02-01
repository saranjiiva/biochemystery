/****************************************************
 * BASIC TOGGLE SYSTEM
 ****************************************************/
function toggle(element) {
  const content = element.nextElementSibling;
  const parent = element.parentElement;

  if (parent.classList.contains("chapter")) {
    parent.classList.toggle("open");
  } else {
    parent.classList.toggle("open");
    content.style.display =
      content.style.display === "block" ? "none" : "block";
  }
}

function define(word) {
  const definition = word.parentElement.nextElementSibling;
  definition.style.display =
    definition.style.display === "block" ? "none" : "block";
}

/****************************************************
 * DARK MODE
 ****************************************************/
function toggleDark() {
  document.body.classList.toggle("dark");
}

/****************************************************
 * EXPAND / COLLAPSE ALL
 ****************************************************/
function expandAll() {
  document.querySelectorAll(".chapter").forEach(ch => ch.classList.add("open"));
  document.querySelectorAll(".content").forEach(c => c.style.display = "block");
}

function collapseAll() {
  document.querySelectorAll(".chapter").forEach(ch => ch.classList.remove("open"));
  document.querySelectorAll(".content").forEach(c => c.style.display = "none");
}

/****************************************************
 * SEARCH SYSTEM
 ****************************************************/
const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("input", handleSearch);

function handleSearch() {
  const query = searchBox.value.toLowerCase().trim();
  clearHighlights();

  if (!query) return;

  const textNodes = document.querySelectorAll("p, h2, h3");
  textNodes.forEach(node => {
    const text = node.textContent.toLowerCase();
    if (text.includes(query)) {
      highlightText(node, query);

      // Auto-open parents
      let parent = node.parentElement;
      while (parent && parent !== document.body) {
        if (parent.classList.contains("chapter")) parent.classList.add("open");
        if (parent.classList.contains("content")) parent.style.display = "block";
        parent = parent.parentElement;
      }
    }
  });
}

/****************************************************
 * SEARCH HIGHLIGHTING
 ****************************************************/
function highlightText(element, query) {
  const regex = new RegExp(`(${query})`, "gi");
  element.innerHTML = element.textContent.replace(regex, "<mark>$1</mark>");
}

function clearHighlights() {
  document.querySelectorAll("mark").forEach(mark => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}
