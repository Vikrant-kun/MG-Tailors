// Modified to handle potential null pointer exceptions and improved code quality by adding error handling for localStorage operations
document.addEventListener('DOMContentLoaded', () => {
    const cartContent = document.getElementById('cart-content');
    const cartCountEl = document.getElementById('cart-count');

    function renderCart() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="cart-empty">
                        <p>Your cart is currently empty.</p>
                        <a href="services.html" class="btn">Continue Shopping</a>
                    </div>
                `;
                return;
            }

            let cartItemsHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.imageUrl}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>Size: ${item.size}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p><strong>₹${item.price}</strong></p>
                    </div>
                    <div class="cart-item-remove">
                        <button data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `).join('');

            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            cartContent.innerHTML = `
                <h2>Your Shopping Cart</h2>
                <div class="cart-layout">
                    <div class="cart-items-list">
                        ${cartItemsHTML}
                    </div>
                    <div class="cart-summary">
                        <h3>Order Summary</h3>
                        <div class="cart-total">
                            <span>Total</span>
                            <span>₹${totalPrice}</span>
                        </div>
                        <a href="checkout.html" class="btn">Proceed to Checkout</a>
                    </div>
                </div>
            `;

            document.querySelectorAll('.cart-item-remove button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const indexToRemove = event.currentTarget.dataset.index;
                    removeItemFromCart(indexToRemove);
                });
            });
        } catch (error) {
            console.error('Error rendering cart:', error);
        }
    }

    function removeItemFromCart(index) {
        try {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }
    
    function updateCartCount() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (cartCountEl) {
                cartCountEl.textContent = count;
                cartCountEl.style.display = count > 0 ? 'flex' : 'none';
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    renderCart();
    updateCartCount();
});