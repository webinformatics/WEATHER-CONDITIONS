const API_KEY = 'd154f6b6f45d89883d5269c200d07bee'; // <-- Replace this

let map = L.map('map').setView([20.5937, 78.9629], 5); // Global view

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
const baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
    opacity: 0.5 // 🔴 Adjust this value as needed (0 = transparent, 1 = fully opaque)
});
baseMap.addTo(map);

let overlayLayer;

function setLayer(param) {
  if (overlayLayer) map.removeLayer(overlayLayer);

  const layerUrls = {
    temp: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    rain: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    humidity: `https://tile.openweathermap.org/map/humidity_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    wind: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    cloud: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`
  };

  overlayLayer = L.tileLayer(layerUrls[param], { opacity: 0.6 });
  overlayLayer.addTo(map);
}

map.on('click', function(e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('infoBox').innerHTML = `
        📍 <b>${data.name || 'Location'}</b><br>
        🌡️ Temperature: ${data.main.temp} °C<br>
        🌧️ Rainfall: ${data.rain ? data.rain['1h'] || 0 : 0} mm<br>
        💧 Humidity: ${data.main.humidity} %<br>
        💨 Wind: ${data.wind.speed} m/s<br>
        ☁️ Condition: ${data.weather[0].description}
      `;
    });
});

function locateUser() {
  map.locate({ setView: true, maxZoom: 8 });

  map.on('locationfound', function(e) {
    L.marker(e.latlng, {
      icon: L.icon({
        iconUrl: 'location-icon.png',
        iconSize: [25, 25]
      })
    }).addTo(map).bindPopup("You are here").openPopup();
  });
}

locateUser();

let currentStep = 0;
function updateTimeLabel() {
  document.getElementById("timeLabel").innerText = currentStep === 0 ? "Now" : `+${currentStep * 3} hrs`;
}

function prevTime() {
  if (currentStep > 0) {
    currentStep--;
    updateTimeLabel();
  }
}

function nextTime() {
  if (currentStep < 7) {
    currentStep++;
    updateTimeLabel();
  }
}
