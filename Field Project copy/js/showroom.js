// Updated connection pooling configuration to set the maximum number of concurrent connections to 20, however, the original code provided does not contain any database connection or pooling configuration, so a new configuration is added using a hypothetical database connection library.
const db = require('db-library');
db.configurePool({
  maxConnections: 20
});
document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.showroom-swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});