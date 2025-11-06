export function setTitle(course) {
    const nameEl = document.querySelector('#courseName');
    const codeEl = document.querySelector('#courseCode');
    if (nameEl) nameEl.textContent = course?.name ?? '';
    if (codeEl) codeEl.textContent = course?.code ?? '';
}

export function renderSections(sections) {
    const tbody = document.querySelector('#sections');
    if (!tbody || !Array.isArray(sections)) return;

    tbody.innerHTML = sections.map(s => `
    <tr>
      <td>${s.sectionNumber ?? ''}</td>
      <td>${s.enrolled ?? 0}</td>
      <td>${s.instructor ?? ''}</td>
    </tr>
  `).join('');
}
