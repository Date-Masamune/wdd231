// URL provided in the assignment
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Container for the cards
const cards = document.querySelector('#cards');

// Fetch + render
async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();

    // Peek at the data while developing:
    // console.table(data.prophets);

    displayProphets(data.prophets);
}
getProphetData();

// Renders an array of prophet records into cards
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // Elements
        const card = document.createElement('section');
        card.className = 'card';

        const fullName = document.createElement('h2');
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        const portrait = document.createElement('img');
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute(
            'alt',
            `Portrait of ${prophet.name} ${prophet.lastname}, the ${ordinal(prophet.order)} Latter-day Prophet`
        );
        portrait.setAttribute('loading', 'lazy');
        // Conservative intrinsic size to reduce CLS (actual image can be larger)
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        const content = document.createElement('div');
        content.className = 'content';

        // Extra info per instructions: Date of Birth & Place of Birth
        const dob = document.createElement('p');
        dob.textContent = `Date of Birth: ${prophet.birthdate}`;

        const pob = document.createElement('p');
        pob.textContent = `Place of Birth: ${prophet.birthplace}`;

        // Build
        card.appendChild(portrait);
        card.appendChild(fullName);
        content.appendChild(dob);
        content.appendChild(pob);
        card.appendChild(content);

        cards.appendChild(card);
    });
};

// Helper: 1 -> 1st, 2 -> 2nd, etc.
function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
