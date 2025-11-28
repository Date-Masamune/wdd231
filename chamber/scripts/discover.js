import { places } from "../data/places.mjs";

// ---------- NAV + FOOTER ----------
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.querySelector(".site-nav");

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = siteNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    const yearSpan = document.getElementById("year");
    const lastModSpan = document.getElementById("lastModified");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (lastModSpan) lastModSpan.textContent = document.lastModified;

    buildPlaceCards();
    updateVisitMessage();
});

// ---------- BUILD CARDS FROM DATA ----------
function buildPlaceCards() {
    const grid = document.getElementById("discoverGrid");
    if (!grid) return;

    const areaNames = ["a", "b", "c", "d", "e", "f", "g", "h"];

    grid.innerHTML = places
        .map((place, index) => {
            const areaClass = `area-${areaNames[index] || "a"}`;
            return `
        <article class="discover-card ${areaClass}">
          <h3>${place.name}</h3>
          <figure>
            <img src="${place.image}"
                 alt="${place.alt}"
                 loading="lazy"
                 width="300"
                 height="200">
          </figure>
          <address>${place.address}</address>
          <p>${place.description}</p>
          <button type="button" class="discover-learn">Learn more</button>
        </article>
      `;
        })
        .join("");
}

// ---------- LAST VISIT MESSAGE ----------
function updateVisitMessage() {
    const msgEl = document.getElementById("visit-message");
    if (!msgEl) return;

    const STORAGE_KEY = "discoverLastVisit";
    const now = Date.now();
    const lastVisit = Number(localStorage.getItem(STORAGE_KEY));

    let message = "";

    if (!lastVisit) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const diffMs = now - lastVisit;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (days < 1) {
            message = "Back so soon! Awesome!";
        } else if (days === 1) {
            message = "You last visited 1 day ago.";
        } else {
            message = `You last visited ${days} days ago.`;
        }
    }

    localStorage.setItem(STORAGE_KEY, String(now));
    msgEl.textContent = message;
}
