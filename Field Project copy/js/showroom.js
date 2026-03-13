// Updated connection pooling configuration to set the maximum number of concurrent connections to 20 and added error handling for production safety.
const db = require('db-library');
db.configurePool({
  maxConnections: 20,
  minConnections: 5, // Added minimum connections for efficient resource utilization
  acquireTimeout: 30000, // Added acquire timeout to prevent indefinite waits
  idleTimeout: 60000 // Added idle timeout to prevent connection leaks
}, (err) => {
  if (err) {
    console.error('Error configuring database pool:', err);
  }
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