// scripts/navigation.js

const hamBtn = document.querySelector("#ham-btn");
const nav = document.querySelector("#primary-nav");

if (hamBtn && nav) {
    hamBtn.addEventListener("click", () => {
        hamBtn.classList.toggle("open");
        nav.classList.toggle("open");
    });
}
