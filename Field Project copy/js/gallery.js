// Modified to handle potential API key exposure by removing the hardcoded key and to improve error handling for production readiness
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with a secure method of storing and retrieving API keys
    const query = 'indian fashion';
    const count = 12;
    const galleryGrid = document.querySelector('.full-gallery');
    const unsplashApiUrl = 'https://api.unsplash.com/photos/random';

    async function fetchPhotos() {
        try {
            const params = new URLSearchParams({
                query: query,
                count: count,
                client_id: apiKey
            });
            const response = await fetch(`${unsplashApiUrl}?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const photos = await response.json();

            if (galleryGrid) {
                galleryGrid.innerHTML = '';
                photos.forEach(photo => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    
                    const img = document.createElement('img');
                    img.src = photo.urls.regular;
                    img.alt = photo.alt_description || 'Fashion photo';

                    galleryItem.appendChild(img);
                    galleryGrid.appendChild(galleryItem);
                });
            }
        } catch (error) {
            console.error('Error fetching photos from Unsplash:', error);
            if(galleryGrid) {
                galleryGrid.innerHTML = '<p>Could not load images. Please try again later.</p>';
            }
        }
    }

    fetchPhotos();
});