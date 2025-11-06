export function setSectionSelection(sections) {
    const sectionSelect = document.querySelector('#sectionNumber');
    if (!sectionSelect || !Array.isArray(sections)) return;

    sectionSelect.innerHTML = '<option value="0" disabled selected>--</option>';

    sections.forEach(({ sectionNumber }) => {
        if (sectionNumber == null) return;
        const option = document.createElement('option');
        option.value = sectionNumber;
        option.textContent = String(sectionNumber);
        sectionSelect.appendChild(option);
    });
}

// Optional alias if your lesson expects this name:
export function populateSections(sections) {
    setSectionSelection(sections);
}
