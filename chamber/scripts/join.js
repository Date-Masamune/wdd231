// NAV + PAGE INIT
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
        tsInput.value = new Date().toISOString();
    }

    // Membership modals
    const modalButtons = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.membership-modal');
    const closeButtons = document.querySelectorAll('.membership-modal .close-btn');

    // Open on "View benefits"
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

    // Close when clicking backdrop
    modals.forEach(dialog => {
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    });

    // Close when clicking X button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const dialog = btn.closest('dialog');
            if (dialog) dialog.close();
        });
    });
});
