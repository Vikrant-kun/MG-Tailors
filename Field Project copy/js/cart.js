// Modified to handle potential null pointer exceptions, improved code quality by adding error handling for localStorage operations, and corrected potential issues with missing elements and invalid data; also added input validation for cart item removal, improved code readability, and ensured all variables are declared with const or let to avoid global scope pollution
document.addEventListener('DOMContentLoaded', () => {
    const cartContent = document.getElementById('cart-content');
    const cartCountEl = document.getElementById('cart-count');

    if (!cartContent || !cartCountEl) {
        console.error('Error: cart content or cart count element not found');
        return;
    }

    /**
     * Renders the cart content based on the items in local storage.
     */
    function renderCart() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="cart-empty">
                        <p>Your cart is currently empty.</p>
                        <a href="services.html" class="btn">Continue Shopping</a>
                    </div>
                `;
                return;
            }

            let cartItemsHTML = cart.map((item, index) => {
                if (!item || !item.name || !item.imageUrl || !item.size || !item.quantity || !item.price) {
                    console.error('Error: invalid cart item data');
                    return '';
                }
                return `
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
                `;
            }).join('');

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

            const removeButtons = document.querySelectorAll('.cart-item-remove button');
            removeButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const indexToRemove = parseInt(event.currentTarget.dataset.index);
                    if (isNaN(indexToRemove)) {
                        console.error('Error: invalid index');
                        return;
                    }
                    removeItemFromCart(indexToRemove);
                });
            });
        } catch (error) {
            console.error('Error rendering cart:', error);
        }
    }

    /**
     * Removes an item from the cart based on the provided index.
     * @param {number} index The index of the item to remove.
     */
    function removeItemFromCart(index) {
        try {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (index < 0 || index >= cart.length) {
                console.error('Error: invalid index');
                return;
            }
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }
    
    /**
     * Updates the cart count display based on the items in local storage.
     */
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