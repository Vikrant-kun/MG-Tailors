document.addEventListener('DOMContentLoaded', () => {
    const trackingForm = document.getElementById('tracking-form');
    const resultsContainer = document.getElementById('tracking-results');
    const statusUpdatesContainer = document.getElementById('status-updates');
    const mapContainer = document.getElementById('map');
    let map = null;

    if (!JSON.parse(localStorage.getItem('loggedInUser'))) {
        document.getElementById('tracking-content').innerHTML = '<p>Please log in to track an order.</p>';
        return;
    }

    trackingForm.addEventListener('submit', (event) => {
        event.preventDefault();
        resultsContainer.style.display = 'block';

        if (map) {
            map.remove();
        }
        
        map = L.map('map').setView([19.0760, 72.8777], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        const shopLocation = [19.0176, 72.8562];
        const hubLocation = [19.1121, 72.8613];
        const deliveryLocation = [19.0596, 72.8295];

        const locations = [
            { latlng: shopLocation, status: 'Order Placed at Dadar Workshop' },
            { latlng: hubLocation, status: 'In Transit - Andheri Hub' },
            { latlng: deliveryLocation, status: 'Out for Delivery - Bandra Area' }
        ];

        let statusHTML = '<h3>Live Status</h3>';
        const latlngs = [];

        locations.forEach(loc => {
            L.marker(loc.latlng).addTo(map).bindPopup(loc.status);
            latlngs.push(loc.latlng);
            statusHTML += `<div class="status-item">${loc.status}</div>`;
        });

        const polyline = L.polyline(latlngs, {color: 'var(--primary-color)'}).addTo(map);
        map.fitBounds(polyline.getBounds().pad(0.2));

        statusUpdatesContainer.innerHTML = statusHTML;
    });
});