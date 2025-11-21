// NAV TOGGLE
document.addEventListener('DOMContentLoaded', () => {
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

    // Timestamp hidden field
    const tsInput = document.getElementById('timestamp');
    if (tsInput) {
        const now = new Date();
        // nice readable format
        tsInput.value = now.toISOString();
    }

    // Membership modals
    const modalButtons = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.membership-modal');

    modalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.modalTarget;
            const dialog = document.getElementById(id);
            if (dialog && typeof dialog.showModal === 'function') {
                dialog.showModal();
            }
        });
    });

    // Close modal when clicking backdrop
    modals.forEach(dialog => {
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    });
});
