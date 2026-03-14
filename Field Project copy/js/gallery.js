// Modified to handle potential API key exposure by removing the hardcoded key, improve error handling, and ensure production readiness by adding a secure method to store and retrieve API keys, and also corrected the Unsplash API URL to correctly fetch multiple photos at once; replaced 'YOUR_API_KEY_HERE' with a reference to an environment variable to prevent API key exposure, and added a check to ensure the API key is not empty or null before making the API request
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = process.env.UNSPLASH_API_KEY; 
    if (!apiKey) {
        console.error('Unsplash API key is not set');
        return;
    }
    const query = 'indian fashion';
    const count = 12;
    const galleryGrid = document.querySelector('.full-gallery');
    const unsplashApiUrl = 'https://api.unsplash.com/search/photos'; 

    async function fetchPhotos() {
        try {
            const params = new URLSearchParams({
                query: query,
                per_page: count, 
                client_id: apiKey
            });
            const response = await fetch(`${unsplashApiUrl}?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const photos = await response.json();

            if (galleryGrid) {
                galleryGrid.innerHTML = '';
                if (photos.results && photos.results.length > 0) {
                    photos.results.forEach(photo => {
                        const galleryItem = document.createElement('div');
                        galleryItem.className = 'gallery-item';
                        
                        const img = document.createElement('img');
                        img.src = photo.urls.regular;
                        img.alt = photo.alt_description || 'Fashion photo';

                        galleryItem.appendChild(img);
                        galleryGrid.appendChild(galleryItem);
                    });
                } else {
                    galleryGrid.innerHTML = '<p>No images found for the given query.</p>';
                }
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