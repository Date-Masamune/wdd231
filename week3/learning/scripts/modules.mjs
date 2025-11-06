import byuiCourse from './course.mjs';
import { setSectionSelection } from './sections.mjs';
import { setTitle, renderSections } from './output.mjs';

function getSelectedSectionNum() {
    const raw = document.querySelector('#sectionNumber').value;
    if (raw === '0' || raw === '') return null; // placeholder selected
    return Number(raw);
}

document.querySelector('#enrollStudent').addEventListener('click', () => {
    const sectionNum = getSelectedSectionNum();
    if (sectionNum == null) return;
    byuiCourse.changeEnrollment(sectionNum, true);
    renderSections(byuiCourse.sections);
});

document.querySelector('#dropStudent').addEventListener('click', () => {
    const sectionNum = getSelectedSectionNum();
    if (sectionNum == null) return;
    byuiCourse.changeEnrollment(sectionNum, false);
    renderSections(byuiCourse.sections);
});

setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);
