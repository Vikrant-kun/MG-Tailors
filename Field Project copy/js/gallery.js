document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'wYFzoEBGM7LEVGhR-gjKlMSgRlXl9zy4AoidpzlH_g8';
    const query = 'indian fashion';
    const count = 12;
    const galleryGrid = document.querySelector('.full-gallery');

    async function fetchPhotos() {
        try {
            const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&count=${count}&client_id=${apiKey}`);
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