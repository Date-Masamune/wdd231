// scripts/hazards.js
// ES module for the Hazards page

const HAZARDS_URL = "data/hazards.json";
const VISIT_KEY = "stormhub-hazards-last-visit";

let allHazards = [];

document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initFooterDates();
    showVisitMessage();
    loadHazards();
});

/* ===============================
   NAV TOGGLE
   =============================== */
function initNav() {
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.querySelector(".site-nav");

    if (!navToggle || !siteNav) return;

    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
}

/* ===============================
   FOOTER DATES
   =============================== */
function initFooterDates() {
    const yearSpan = document.getElementById("year");
    const lastModSpan = document.getElementById("lastModified");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (lastModSpan) lastModSpan.textContent = document.lastModified;
}

/* ===============================
   LAST VISIT MESSAGE (localStorage)
   =============================== */
function showVisitMessage() {
    const messageEl = document.getElementById("visitMessage");
    if (!messageEl) return;

    const now = Date.now();
    const last = localStorage.getItem(VISIT_KEY);

    if (!last) {
        messageEl.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastTime = Number(last);
        const msDiff = now - lastTime;
        const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 1) {
            messageEl.textContent = "Back so soon! Awesome!";
        } else if (daysDiff === 1) {
            messageEl.textContent = "You last visited 1 day ago.";
        } else {
            messageEl.textContent = `You last visited ${daysDiff} days ago.`;
        }
    }

    localStorage.setItem(VISIT_KEY, String(now));
}

/* ===============================
   LOAD HAZARDS (Fetch + try/catch)
   =============================== */
async function loadHazards() {
    const grid = document.getElementById("hazardGrid");
    const statusEl = document.getElementById("hazardStatus");

    if (!grid) return;

    if (statusEl) {
        statusEl.textContent = "Loading hazards...";
    }

    try {
        const res = await fetch(HAZARDS_URL, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();

        // Support either a bare array or { hazards: [...] }
        const hazards = Array.isArray(data)
            ? data
            : Array.isArray(data.hazards)
                ? data.hazards
                : [];

        if (!hazards.length) {
            throw new Error("No hazards found in data file.");
        }

        allHazards = hazards;

        initFilter(); // wire up the select
        applyFilterAndRender(); // initial render

        if (statusEl) {
            statusEl.textContent = `Showing ${allHazards.length} hazards.`;
        }
    } catch (err) {
        console.error("Error loading hazards:", err);
        if (statusEl) {
            statusEl.textContent =
                "Unable to load hazard data. Please try again later.";
        }
    }
}

/* ===============================
   FILTER + RENDER
   =============================== */
function initFilter() {
    const filterSelect = document.getElementById("hazardFilter");
    if (!filterSelect || filterSelect.dataset.wired === "true") return;

    filterSelect.dataset.wired = "true";

    filterSelect.addEventListener("change", () => {
        applyFilterAndRender();
    });
}

function applyFilterAndRender() {
    const grid = document.getElementById("hazardGrid");
    const statusEl = document.getElementById("hazardStatus");
    const filterSelect = document.getElementById("hazardFilter");

    if (!grid) return;

    const filterValue = filterSelect ? filterSelect.value : "all";

    // filter by category
    let hazardsToShow =
        filterValue === "all"
            ? allHazards.slice()
            : allHazards.filter((h) => h.category === filterValue);

    // sort by risk level then name
    const riskRank = {
        High: 2,
        Moderate: 1,
        Low: 0,
    };

    hazardsToShow.sort((a, b) => {
        const aRank = riskRank[a.riskLevel] ?? 0;
        const bRank = riskRank[b.riskLevel] ?? 0;
        if (bRank !== aRank) return bRank - aRank;
        return a.name.localeCompare(b.name);
    });

    renderHazardCards(hazardsToShow, grid);

    if (statusEl) {
        statusEl.textContent = `Showing ${hazardsToShow.length} hazards${filterValue !== "all" ? ` in “${filterValue}”` : ""
            }.`;
    }
}

/* ===============================
   RENDER CARDS (Dynamic Content)
   =============================== */
function renderHazardCards(hazards, container) {
    container.innerHTML = hazards.map((h) => createHazardCardMarkup(h)).join("");

    setupHazardModalHandlers(hazards, container);
}

function createHazardCardMarkup(hazard) {
    const { id, name, category, riskLevel, summary, image, alt } = hazard;

    const riskClass = (riskLevel || "Unknown").toLowerCase().replace(/\s+/g, "-");

    return `
    <article class="hazard-card" data-hazard-id="${id}">
      <figure class="hazard-image-wrapper">
        <img src="${image}" alt="${alt}" class="hazard-image">
      </figure>

      <div class="hazard-content">
        <h3 class="hazard-title">${name}</h3>

        <p class="hazard-meta">
          <span class="hazard-risk hazard-risk--${riskClass}">
            ${riskLevel} risk
          </span>
          <span class="hazard-category-label">${category}</span>
        </p>

        <p class="hazard-summary">${summary}</p>

        <button class="hazard-details-btn" type="button">
          View safety details
        </button>
      </div>
    </article>
  `;
}


/* ===============================
   MODAL HANDLERS
   =============================== */
function setupHazardModalHandlers(hazards, container) {
    const dialog = document.getElementById("hazardModal");
    if (!dialog) return;

    // avoid wiring multiple times
    if (container.dataset.modalWired === "true") {
        container._hazardList = hazards;
        return;
    }
    container.dataset.modalWired = "true";
    container._hazardList = hazards;

    const closeBtn = dialog.querySelector(".hazard-modal-close");

    const titleEl = dialog.querySelector("#hazardModalTitle");
    const summaryEl = dialog.querySelector("#hazardModalSummary");
    const beforeEl = dialog.querySelector("#hazardModalBefore");
    const duringEl = dialog.querySelector("#hazardModalDuring");
    const afterEl = dialog.querySelector("#hazardModalAfter");

    container.addEventListener("click", (event) => {
        const btn = event.target.closest(".hazard-details-btn");
        if (!btn) return;

        const card = btn.closest(".hazard-card");
        if (!card) return;

        const hazardId = card.getAttribute("data-hazard-id");
        const list = container._hazardList || hazards;
        const hazard = list.find((h) => h.id === hazardId);
        if (!hazard) return;

        if (titleEl) titleEl.textContent = hazard.name;
        if (summaryEl) summaryEl.textContent = hazard.summary;
        if (beforeEl) beforeEl.textContent = hazard.before;
        if (duringEl) duringEl.textContent = hazard.during;
        if (afterEl) afterEl.textContent = hazard.after;

        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            dialog.close();
        });
    }

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            dialog.close();
        }
    });
}
