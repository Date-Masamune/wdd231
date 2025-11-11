// ================= NAV TOGGLE =================
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }
});

// ================= FOOTER DATES =================
const yearSpan = document.getElementById('year');
const lastModSpan = document.getElementById('lastModified');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
if (lastModSpan) lastModSpan.textContent = document.lastModified;

// ================= WEATHER (OpenWeatherMap) =================
// Get a free key at openweathermap.org and paste it here:
const WEATHER_API_KEY = "7859e2bf11f804126732c6aef9bc4409";

// Ogden, UT coords 
const LAT = 41.223;
const LON = -111.973;
const UNITS = "imperial";

async function loadWeather() {
    const currentEl = document.getElementById('weather-current');
    const forecastEl = document.getElementById('forecast');

    if (!currentEl || !forecastEl) return;

    if (!WEATHER_API_KEY || WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        currentEl.textContent = "Weather API key not configured.";
        forecastEl.textContent = "";
        return;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = data.list || [];
        if (!list.length) throw new Error("No forecast data");

        // Current = first item
        const now = list[0];
        const temp = Math.round(now.main.temp);
        const desc = now.weather[0].description;
        const icon = now.weather[0].icon;

        currentEl.innerHTML = `
      <div class="weather-current-main">
        <div>
          <p class="weather-temp">${temp}°F</p>
          <p class="weather-desc">${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
        </div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png"
             alt="${desc}" loading="lazy" width="64" height="64">
      </div>
    `;

        // 3-day forecast: take one entry per ~24h (8*3h blocks)
        const daily = list.filter((_, i) => i % 8 === 0).slice(1, 4);

        forecastEl.innerHTML = daily.map(item => {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const t = Math.round(item.main.temp);
            const d = item.weather[0].description;
            return `
        <div class="forecast-day">
          <p class="forecast-label">${dayName}</p>
          <p class="forecast-temp">${t}°F</p>
          <p class="forecast-desc">${d.charAt(0).toUpperCase() + d.slice(1)}</p>
        </div>
      `;
        }).join("");

    } catch (err) {
        console.error("Weather load failed:", err);
        currentEl.textContent = "Unable to load weather data.";
        forecastEl.textContent = "";
    }
}

loadWeather();

// ================= MEMBER SPOTLIGHTS =================
const MEMBERS_URL = "data/members.json";

async function loadSpotlights() {
    const container = document.getElementById('spotlight-container');
    if (!container) return;

    try {
        const res = await fetch(MEMBERS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const members = Array.isArray(data) ? data : (data.members || []);

        // Gold (3) or Silver (2) members only
        const qualified = members.filter(m => {
            const lvl = Number(m.membershipLevel);
            return lvl === 2 || lvl === 3;
        });

        if (!qualified.length) {
            container.innerHTML = "<p>No spotlight members available.</p>";
            return;
        }

        // Shuffle and take up to 3
        qualified.sort(() => Math.random() - 0.5);
        const picks = qualified.slice(0, 3);

        container.innerHTML = picks.map(m => {
            const lvl = Number(m.membershipLevel) === 3 ? "Gold" : "Silver";
            const logo = m.logo || "images/placeholder-logo.png";
            return `
        <article class="spotlight-card">
          <img src="${logo}" alt="${m.name} logo" loading="lazy" width="72" height="72"
               onerror="this.src='images/placeholder-logo.png'">
          <div>
            <h3>${m.name}</h3>
            <p class="spotlight-level">${lvl} Member</p>
            ${m.address ? `<p>${m.address}</p>` : ""}
            ${m.phone ? `<p>${m.phone}</p>` : ""}
            ${m.website ? `<p><a href="${m.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>` : ""}
          </div>
        </article>
      `;
        }).join("");

    } catch (err) {
        console.error("Spotlights load failed:", err);
        container.innerHTML = "<p>Unable to load member spotlights.</p>";
    }
}

loadSpotlights();
