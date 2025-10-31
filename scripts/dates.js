const copyright = document.getElementById("copyright");
const lastModified = document.getElementById("lastModified");

const now = new Date();
const year = now.getFullYear();

if (copyright) {
    copyright.textContent = `© ${year} • Jacob Gishwiller • Utah, USA`;
}

if (lastModified) {
    lastModified.textContent = `Last modification: ${document.lastModified}`;
}