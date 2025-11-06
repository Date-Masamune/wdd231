const apiKey = 'YOUR_API_KEY'; // <-- put your real key here
const lat = 49.748689597200254;
const lon = 6.638128103820769;

const url =
    'https://api.openweathermap.org/data/2.5/weather'
    + `?lat=${lat}`
    + `&lon=${lon}`
    + `&appid=${apiKey}`
    + '&units=imperial'
    + '&lang=en';

const tempEl = document.querySelector('#current-temp');
const iconEl = document.querySelector('#weather-icon');
const capEl = document.querySelector('figure figcaption');

function toTitle(s) {
    return String(s).replace(/\b\w/g, c => c.toUpperCase());
}

async function getWeather() {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            if (res.status === 401) throw new Error('Unauthorized (check API key)');
            if (res.status === 404) throw new Error('Not found (check lat/lon)');
            if (res.status === 429) throw new Error('Rate limited (too many requests)');
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        // Guard against missing fields
        const tempF = Math.round((data && data.main && data.main.temp) || 0);
        tempEl.textContent = `${tempF} °F`;

        const w = (data && data.weather && data.weather[0]) || { icon: '01d', description: 'clear sky' };
        iconEl.src = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
        iconEl.alt = w.description;
        capEl.textContent = toTitle(w.description);
    } catch (err) {
        console.error(err);
        tempEl.textContent = '(unavailable)';
        capEl.textContent = 'Weather data unavailable';
    }
}

getWeather();
