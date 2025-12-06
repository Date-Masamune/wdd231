const SUMMARY = document.getElementById('planSummary');

function safe(value, fallback = 'Not provided') {
    return value && value.trim() ? value : fallback;
}

function buildSummary() {
    if (!SUMMARY) return;

    const params = new URLSearchParams(window.location.search);

    const name = params.get('name');
    const email = params.get('email');
    const location = params.get('location');
    const housing = params.get('housing');
    const hasKit = params.get('hasKit');
    const notes = params.get('notes');
    const timestamp = params.get('timestamp');

    const concerns = params.getAll('concerns');

    const concernsText = concerns.length
        ? concerns.join(', ')
        : 'No specific hazards selected';

    const housingLabel = {
        '': 'Not specified',
        'apartment': 'Apartment',
        'single-family': 'Single-family home',
        'mobile-home': 'Mobile home / manufactured housing',
        'other': 'Other'
    }[housing ?? ''] ?? housing;

    const kitLabel = {
        'yes': 'Yes',
        'in-progress': 'In progress',
        'no': 'Not yet'
    }[hasKit ?? ''] ?? 'Not specified';

    SUMMARY.innerHTML = `
    <dt>Name</dt>
    <dd>${safe(name)}</dd>

    <dt>Email</dt>
    <dd>${safe(email)}</dd>

    <dt>Location</dt>
    <dd>${safe(location)}</dd>

    <dt>Housing Type</dt>
    <dd>${safe(housingLabel)}</dd>

    <dt>Main Weather Concerns</dt>
    <dd>${concernsText}</dd>

    <dt>Emergency Kit Status</dt>
    <dd>${kitLabel}</dd>

    <dt>Notes / Special Needs</dt>
    <dd>${safe(notes)}</dd>

    <dt>Form Submitted At</dt>
    <dd>${safe(timestamp)}</dd>
  `;
}

buildSummary();
