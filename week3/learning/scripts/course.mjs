const byuiCourse = {
    code: 'WDD231',
    name: 'Web Frontend Development I',
    sections: [
        { sectionNumber: 1, enrolled: 88, instructor: 'Brother Bingham' },
        { sectionNumber: 2, enrolled: 81, instructor: 'Sister Shultz' },
        { sectionNumber: 3, enrolled: 95, instructor: 'Sister Smith' },
    ],

    changeEnrollment(sectionNumber, add = true) {
        const idx = this.sections.findIndex(s => s.sectionNumber == sectionNumber);
        if (idx < 0) return false;
        const sec = this.sections[idx];
        sec.enrolled = add ? sec.enrolled + 1 : Math.max(0, sec.enrolled - 1);
        return sec;
    },
};

export default byuiCourse;
