// scripts/courses.js


const courses = [

    {
        code: "WDD 130",
        name: "Web Fundamentals",
        credits: 2,
        category: "wdd",
        completed: true,
    },
    {
        code: "WDD 131",
        name: "Dynamic Web Fundamentals",
        credits: 2,
        category: "wdd",
        completed: true,
    },
    {
        code: "WDD 231",
        name: "Frontend Web Development I",
        credits: 3,
        category: "wdd",
        completed: false,
    },


    {
        code: "CSE 110",
        name: "Introduction to Programming",
        credits: 2,
        category: "cse",
        completed: true,
    },
    {
        code: "CSE 111",
        name: "Programming with Functions",
        credits: 2,
        category: "cse",
        completed: true,
    },
    {
        code: "CSE 210",
        name: "Programming with Classes",
        credits: 2,
        category: "cse",
        completed: false,
    },
];

const courseList = document.querySelector("#course-list");
const totalCreditsEl = document.querySelector("#total-credits");
const filterButtons = document.querySelectorAll(".courses .filters button");


function renderCourses(list) {
    if (!courseList) return;

    courseList.innerHTML = "";

    list.forEach((course) => {
        const card = document.createElement("div");
        card.classList.add("course-card");
        if (course.completed) {
            card.classList.add("completed");
        }

        const left = document.createElement("div");
        left.classList.add("left");

        const code = document.createElement("span");
        code.classList.add("code");
        code.textContent = course.code;

        const name = document.createElement("span");
        name.classList.add("name");
        name.textContent = ` – ${course.name}`;

        left.appendChild(code);
        left.appendChild(name);

        const credits = document.createElement("span");
        credits.classList.add("credits");
        credits.textContent = `${course.credits} cr`;

        card.appendChild(left);
        card.appendChild(credits);

        courseList.appendChild(card);
    });

    // update credits line
    const total = list.reduce((sum, course) => sum + course.credits, 0);
    if (totalCreditsEl) {
        totalCreditsEl.textContent = total;
    }
}


function getCoursesByFilter(filter) {
    if (filter === "wdd") {
        return courses.filter((c) => c.category === "wdd");
    } else if (filter === "cse") {
        return courses.filter((c) => c.category === "cse");
    }
    return courses;
}


filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        const filtered = getCoursesByFilter(filter);
        renderCourses(filtered);
    });
});


renderCourses(courses);
