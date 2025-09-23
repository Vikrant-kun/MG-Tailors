document.addEventListener('DOMContentLoaded', () => {
    const heroSwiperWrapper = document.querySelector('.hero-swiper .swiper-wrapper');
    const homeGalleryGrid = document.querySelector('.work-gallery .gallery-grid');
    const fullGalleryGrid = document.querySelector('.full-gallery');
    const serviceItems = document.querySelectorAll('.service-item img');

    async function placeImages(count, elementHandler) {
        try {
            const { data: photos, error } = await supabaseClient
                .from('products')
                .select('imageUrl, name, category, id')
                .limit(count);

            if (error) throw error;
            elementHandler(photos);
        } catch (error) {
            console.error(`Error fetching photos from Supabase:`, error);
        }
    }

    if (heroSwiperWrapper) {
        placeImages(6, (photos) => {
            if (heroSwiperWrapper && photos) {
                heroSwiperWrapper.innerHTML = '';
                photos.forEach(photo => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.innerHTML = `<img src="${photo.imageUrl}" alt="${photo.name}">`;
                    heroSwiperWrapper.appendChild(slide);
                });
                new Swiper('.hero-swiper', {
                    loop: true,
                    effect: 'fade',
                    autoplay: { delay: 4000, disableOnInteraction: false },
                    pagination: { el: '.swiper-pagination', clickable: true },
                });
            }
        });
    }

    if (homeGalleryGrid) {
        placeImages(4, (photos) => {
            if (homeGalleryGrid && photos) {
                homeGalleryGrid.innerHTML = '';
                photos.forEach(photo => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `<img src="${photo.imageUrl}" alt="${photo.name}">`;
                    homeGalleryGrid.appendChild(item);
                });
            }
        });
    }

    if (fullGalleryGrid) {
        placeImages(12, (photos) => {
            if (fullGalleryGrid && photos) {
                fullGalleryGrid.innerHTML = '';
                photos.forEach(photo => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `<img src="${photo.imageUrl}" alt="${photo.name}">`;
                    fullGalleryGrid.appendChild(item);
                });
            }
        });
    }
    
    if (serviceItems.length > 0) {
        placeImages(serviceItems.length, (photos) => {
            if (photos) {
                serviceItems.forEach((img, index) => {
                    if (photos[index]) img.src = photos[index].imageUrl;
                });
            }
        });
    }
});