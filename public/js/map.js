// Initialize map with the given lat and lng
const lat = latitude;
const lng = longitude;

const map = L.map('map').setView([lat, lng], 13);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Marker icon
const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
});

// Function to fetch location name via reverse geocoding
function fetchLocationName(lat, lng) {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
            signal: controller.signal
        })
            .then(response => response.json())
            .then(data => {
                clearTimeout(timeoutId);
                resolve(data.display_name || "Unknown location");
            })
            .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
}

// Fetch location name and add marker to map
fetchLocationName(lat, lng)
    .then(locationName => {
        L.marker([lat, lng], { icon: markerIcon })
            .addTo(map)
            .bindPopup('Location: ' + locationName)
            .openPopup();
    })
    .catch(error => {
        console.error('Error fetching location name:', error);
        // If error occurs, show coordinates as fallback
        L.marker([lat, lng], { icon: markerIcon })
            .addTo(map)
            .bindPopup('Location: ' + lat + ', ' + lng)
            .openPopup();
    });
