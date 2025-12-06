const HOME_LIST = document.querySelector('.checklist-items[data-list="home"]');
const CAR_LIST = document.querySelector('.checklist-items[data-list="car"]');
const HOME_PROGRESS = document.getElementById('homeProgress');
const CAR_PROGRESS = document.getElementById('carProgress');
const RETURN_MSG = document.getElementById('return-message');
const PLAN_TIMESTAMP = document.getElementById('planTimestamp');

const STORAGE_HOME = 'stormhub-home-kit';
const STORAGE_CAR = 'stormhub-car-kit';
const STORAGE_VISIT = 'stormhub-preparedness-last-visit';

// Timestamp hidden field for the form
if (PLAN_TIMESTAMP) {
    PLAN_TIMESTAMP.value = new Date().toISOString();
}

// Visit message using localStorage
(function handleVisitMessage() {
    if (!RETURN_MSG) return;

    const now = Date.now();
    const lastVisitStr = localStorage.getItem(STORAGE_VISIT);

    if (!lastVisitStr) {
        RETURN_MSG.textContent = 'Welcome! This is a great place to start your storm preparedness.';
    } else {
        const last = Number(lastVisitStr);
        const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            RETURN_MSG.textContent = 'Back so soon! Awesome—small steps add up quickly.';
        } else if (diffDays === 1) {
            RETURN_MSG.textContent = 'You last visited this preparedness page 1 day ago.';
        } else {
            RETURN_MSG.textContent = `You last visited this preparedness page ${diffDays} days ago.`;
        }
    }

    localStorage.setItem(STORAGE_VISIT, String(now));
})();

// Checklist helpers
function loadChecklist(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveChecklist(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
}

function initChecklist(container, storageKey, progressEl) {
    if (!container || !progressEl) return;

    const saved = loadChecklist(storageKey);
    const checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'));

    // Restore checked state
    checkboxes.forEach((cb) => {
        const item = cb.dataset.item;
        if (item && saved.includes(item)) {
            cb.checked = true;
        }
    });

    function updateProgress() {
        const total = checkboxes.length;
        const checked = checkboxes.filter((cb) => cb.checked).length;

        progressEl.textContent = `You have completed ${checked} of ${total} items in this checklist.`;

        const selectedItems = checkboxes
            .filter((cb) => cb.checked && cb.dataset.item)
            .map((cb) => cb.dataset.item);

        saveChecklist(storageKey, selectedItems);
    }

    // Initial progress
    updateProgress();

    // Event listeners
    checkboxes.forEach((cb) => {
        cb.addEventListener('change', updateProgress);
    });
}

initChecklist(HOME_LIST, STORAGE_HOME, HOME_PROGRESS);
initChecklist(CAR_LIST, STORAGE_CAR, CAR_PROGRESS);
