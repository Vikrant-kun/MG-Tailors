document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const contentArea = document.getElementById('product-detail-content');

    if (!productId) {
        if (contentArea) contentArea.innerHTML = '<p>Product not found.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) throw new Error('not found');
        const product = await response.json();

        document.title = `${product.name} - MG's Tailoring`;
        const sizeOptions = (product.sizes || []).map(s => `<option value="${s}">${escapeHtml(s)}</option>`).join('');

        if (!contentArea) return;
        contentArea.innerHTML = `
            <div class="product-detail-layout">
                <div class="product-detail-image">
                    <img src="${normalizeImage(product.imageUrl)}" alt="${escapeHtml(product.name)}">
                </div>
                <div class="product-detail-info">
                    <h2>${escapeHtml(product.name)}</h2>
                    <p class="product-price">₹${product.price}</p>
                    <p class="product-description">${escapeHtml(product.description)}</p>
                    <p class="product-fabric"><strong>Fabric:</strong> ${escapeHtml(product.fabric)}</p>
                    <div class="size-selection">
                        <label for="size-select">Select Size:</label>
                        <select id="size-select">${sizeOptions}</select>
                    </div>
                    <button id="add-to-cart-btn" class="btn">Add to Cart</button>
                    <div class="custom-changes">
                        <p>Want custom changes or have questions?</p>
                        <a href="tel:+919876543210" class="btn btn-secondary"><i class="fas fa-phone"></i> Call Us</a>
                    </div>
                </div>
            </div>
        `;

        const addToCartBtn = document.getElementById('add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            const sizeSelect = document.getElementById('size-select');
            const selectedSize = sizeSelect.value;
            
            const cartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                size: selectedSize,
                quantity: 1,
                category: product.category
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            updateCartCount();
            showTempMessage('Item added to cart!');
        });

    } catch (error) {
        if (contentArea) contentArea.innerHTML = '<p>Could not load product details. Please try again later.</p>';
    }
});

function normalizeImage(url) {
    if (!url) return 'images/fallback.jpg';
    if (url.includes('images.unsplash.com') && !url.includes('auto=format')) {
        return url.includes('?') ? `${url}&auto=format&fit=crop&w=800&q=80` : `${url}?auto=format&fit=crop&w=800&q=80`;
    }
    return url;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

function showTempMessage(text) {
    const m = document.createElement('div');
    m.className = 'temp-toast';
    m.textContent = text;
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 2000);
}

document.addEventListener('DOMContentLoaded', updateCartCount);
window.addEventListener('storage', updateCartCount);