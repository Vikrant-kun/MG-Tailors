document.addEventListener('DOMContentLoaded', () => {
    const confirmationContent = document.getElementById('confirmation-content');
    const finalOrder = JSON.parse(sessionStorage.getItem('finalOrder'));

    if (!finalOrder) {
        confirmationContent.innerHTML = `<h2>Thank You!</h2><p>Your order has been placed.</p>`;
    } else {
        const subtotal = finalOrder.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCharge = 40;
        const total = subtotal + deliveryCharge;
        const deliveryDate = new Date(finalOrder.orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        let itemsHTML = finalOrder.cart.map(item => `<li>${item.name} (Size: ${item.size}) - ₹${item.price}</li>`).join('');

        confirmationContent.innerHTML = `
            <div class="confirmation-container">
                <i class="fas fa-check-circle"></i>
                <h2>Thank you for shopping with us, ${finalOrder.shipping.name}!</h2>
                <p>Your order has been confirmed and will be delivered soon.</p>
                <div class="confirmation-summary">
                    <h4>Order Summary:</h4>
                    <p><strong>Shipping to:</strong> ${finalOrder.shipping.address}</p>
                    <p><strong>Payment Method:</strong> ${finalOrder.paymentMethod.toUpperCase()}</p>
                    <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
                    <p><strong>Total Paid:</strong> ₹${total}</p>
                    <ul>${itemsHTML}</ul>
                </div>
            </div>
            <section class="work-gallery">
                <h2>You Might Also Like</h2>
                <div class="gallery-grid" id="recommendations-grid"><p class="loading-message">Loading recommendations...</p></div>
            </section>
        `;
        sessionStorage.removeItem('finalOrder');
    }

    const recommendationsGrid = document.getElementById('recommendations-grid');
    if (recommendationsGrid) {
        fetch('http://localhost:3000/products')
            .then(res => res.json())
            .then(products => {
                recommendationsGrid.innerHTML = '';
                products.slice(0, 4).forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div class="product-image"><img src="${product.imageUrl}" alt="${product.name}"></div>
                        <div class="product-info"><h3>${product.name}</h3><p>₹${product.price}</p></div>
                    `;
                    recommendationsGrid.appendChild(card);
                });
            });
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            const modal = document.getElementById('custom-modal');
            const modalMessage = document.getElementById('modal-message');
            const confirmBtn = document.getElementById('modal-button-confirm');
            const actionBtn = document.getElementById('modal-button-action');
            const cancelBtn = document.getElementById('modal-button-cancel');
            const modalIcon = document.getElementById('modal-icon');
            
            if (!modal) return;
            
            modalIcon.innerHTML = '';
            modalMessage.textContent = 'Are you sure you want to log out?';
            confirmBtn.textContent = 'Yes, Logout';
            confirmBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
            actionBtn.style.display = 'none';
            modal.style.display = 'block';

            confirmBtn.onclick = () => {
                localStorage.removeItem('loggedInUser');
                modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                modalMessage.textContent = 'You have been logged out successfully.';
                confirmBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                actionBtn.style.display = 'inline-block';
                actionBtn.textContent = 'OK';
                actionBtn.onclick = () => {
                    document.querySelector('body').classList.add('fade-out');
                    setTimeout(() => { window.location.href = 'index.html'; }, 500);
                };
            };
            cancelBtn.onclick = () => {
                modal.style.display = 'none';
            };
        });
    }
});