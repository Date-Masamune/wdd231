// Shared nav + footer logic

document.addEventListener('DOMContentLoaded', () => {
    // Nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    // Footer dates
    const yearSpan = document.getElementById('year');
    const lastModSpan = document.getElementById('lastModified');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (lastModSpan) lastModSpan.textContent = document.lastModified;
});
