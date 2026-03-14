// Modified to handle potential null or undefined values, ensure the API key is not exposed in the code, and corrected syntax for production-ready code, using environment variables for sensitive information. Added error handling for Swiper initialization.
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = process.env.UNSPLASH_API_KEY; // Use environment variable for API key

    const heroSwiperWrapper = document.querySelector('.hero-swiper .swiper-wrapper');
    const homeGalleryGrid = document.querySelector('.work-gallery .gallery-grid');
    const fullGalleryGrid = document.querySelector('.full-gallery');
    const serviceItems = document.querySelectorAll('.service-item img');

    /**
     * Fetches images from Unsplash API and places them in the specified element.
     * @param {string} query - The search query for the images.
     * @param {number} count - The number of images to fetch.
     * @param {function} elementHandler - A callback function to handle the fetched images.
     */
    async function fetchAndPlaceImages(query, count, elementHandler) {
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${apiKey}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const photos = data.results;
            elementHandler(photos);
        } catch (error) {
            console.error(`Error fetching photos for query "${query}":`, error);
        }
    }

    if (heroSwiperWrapper) {
        fetchAndPlaceImages('haute couture fashion', 6, (photos) => {
            heroSwiperWrapper.innerHTML = '';
            photos.forEach((photo) => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `<img src="${photo.urls.regular}" alt="${photo.alt_description || 'Fashion'}">`;
                heroSwiperWrapper.appendChild(slide);
            });
            
            try {
                new Swiper('.hero-swiper', {
                    loop: true,
                    effect: 'fade',
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            } catch (error) {
                console.error('Error initializing Swiper:', error);
            }
        });
    }

    if (homeGalleryGrid) {
        fetchAndPlaceImages('fashion model', 4, (photos) => {
            homeGalleryGrid.innerHTML = '';
            photos.forEach((photo) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${photo.urls.small}" alt="${photo.alt_description || 'Fashion'}">`;
                homeGalleryGrid.appendChild(item);
            });
        });
    }

    if (fullGalleryGrid) {
        fetchAndPlaceImages('indian wedding fashion', 12, (photos) => {
            fullGalleryGrid.innerHTML = '';
            photos.forEach((photo) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${photo.urls.small}" alt="${photo.alt_description || 'Fashion'}">`;
                fullGalleryGrid.appendChild(item);
            });
        });
    }
    
    if (serviceItems.length > 0) {
        fetchAndPlaceImages('sewing fabric tailoring', serviceItems.length, (photos) => {
            serviceItems.forEach((img, index) => {
                if (photos[index]) {
                    img.src = photos[index].urls.small;
                }
            });
        });
    }
});