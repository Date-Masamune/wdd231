const apiKey = '7859e2bf11f804126732c6aef9bc4409'; // 👈 replace
const lat = 49.748689597200254;
const lon = 6.638128103820769;

const tempEl = document.querySelector('#current-temp');
const iconEl = document.querySelector('#weather-icon');
const capEl = document.querySelector('figure figcaption');

tempEl.textContent = 'loading...';

const url =
    'https://api.openweathermap.org/data/2.5/weather'
    + `?lat=${lat}`
    + `&lon=${lon}`
    + `&appid=${apiKey}`
    + '&units=imperial'
    + '&lang=en';

function toTitle(s) { return String(s).replace(/\b\w/g, c => c.toUpperCase()); }

async function getWeather() {
    try {
        const res = await fetch(url);
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
            // Show exact reason from API if available
            tempEl.textContent = `error ${res.status}`;
            capEl.textContent = body?.message ? toTitle(body.message) : 'Request failed';
            return;
        }

        const tempF = Math.round(body?.main?.temp ?? 0);
        tempEl.textContent = `${tempF} °F`;

        const w = body?.weather?.[0];
        if (w?.icon) {
            iconEl.src = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
            iconEl.alt = w.description ?? 'weather';
            capEl.textContent = toTitle(w.description ?? '');
        } else {
            iconEl.removeAttribute('src');
            iconEl.alt = '';
            capEl.textContent = 'No weather description';
        }
    } catch (err) {
        console.error(err);
        tempEl.textContent = 'error';
        capEl.textContent = 'Weather data unavailable';
    }
}

getWeather();
