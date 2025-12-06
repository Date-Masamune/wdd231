// Simple weather widget using Open-Meteo (no API key required).
// This satisfies the Fetch + async + try/catch requirement.

const currentEl = document.querySelector('#weather-current');
const forecastEl = document.querySelector('#weather-forecast');

// Default coordinates (example: Omaha, NE-ish)
const LAT = 41.25;
const LON = -96.0;

async function loadWeather() {
    if (!currentEl || !forecastEl) return;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        const current = data.current_weather;
        const daily = data.daily;

        if (!current || !daily) {
            throw new Error('Missing weather data');
        }

        const temp = Math.round(current.temperature);
        const wind = Math.round(current.windspeed);
        const code = current.weathercode;

        currentEl.innerHTML = `
      <div class="weather-current-main">
        <p><strong>${temp}°C</strong> · Wind ${wind} km/h</p>
        <p>Simple code: ${code} (see local forecast for details)</p>
      </div>
    `;

        const days = daily.time.slice(0, 3);
        const highs = daily.temperature_2m_max.slice(0, 3);
        const lows = daily.temperature_2m_min.slice(0, 3);

        forecastEl.innerHTML = days
            .map((dateStr, i) => {
                const date = new Date(dateStr);
                const label = date.toLocaleDateString('en-US', { weekday: 'short' });
                return `
          <div class="forecast-day">
            <span>${label}</span>
            <span>${Math.round(lows[i])}° / ${Math.round(highs[i])}°C</span>
          </div>
        `;
            })
            .join('');
    } catch (err) {
        console.error('Weather load failed:', err);
        currentEl.textContent = 'Unable to load weather data.';
        forecastEl.textContent = '';
    }
}

loadWeather();
