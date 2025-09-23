async function loadProducts() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const pageTitle = document.getElementById('page-title');
    const productGrid = document.getElementById('product-grid');
    const categoryList = document.getElementById('category-list');

    if (pageTitle) {
        const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products';
        pageTitle.textContent = categoryName;
        document.title = `${categoryName} - MG's Tailoring`;
    }

    try {
        if (categoryList) {
            const respCats = await fetch('http://localhost:3000/categories');
            if (respCats.ok) {
                const cats = await respCats.json();
                categoryList.innerHTML = '<li><a href="products.html">All Products</a></li>';
                cats.forEach(c => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="products.html?category=${encodeURIComponent(c.name)}">${c.name.charAt(0).toUpperCase() + c.name.slice(1)}</a>`;
                    categoryList.appendChild(li);
                });
            }
        }
    } catch (e) {
        console.error("Could not load categories", e);
    }

    try {
        const url = category ? `http://localhost:3000/products?category=${encodeURIComponent(category)}` : `http://localhost:3000/products`;
        const response = await fetch(url);
        const products = await response.json();
        
        if (!productGrid) return;
        productGrid.innerHTML = '';

        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p>No products found in this category.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productId = product.id;
            card.innerHTML = `
                <div class="product-image">
                    <img src="${normalizeImage(product.imageUrl)}" alt="${escapeHtml(product.name)}">
                </div>
                <div class="product-info">
                    <h3>${escapeHtml(product.name)}</h3>
                    <p>₹${product.price}</p>
                </div>
            `;
            productGrid.appendChild(card);
        });

        productGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            if (card) {
                const productId = card.dataset.productId;
                openQuickView(productId);
            }
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        if (productGrid) productGrid.innerHTML = '<p>Could not load products. Please try again later.</p>';
    }
}

async function openQuickView(productId) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        const product = await response.json();

        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';

        const sizeOptions = (product.sizes || []).map(size => `<button class="size-option" data-size="${escapeHtml(size)}">${escapeHtml(size)}</button>`).join('');
        const reviewsHTML = (product.reviews || []).map(review => `
            <div class="review"><p>"${escapeHtml(review.text)}"</p><span>- ${escapeHtml(review.author)}</span></div>
        `).join('');

        modal.innerHTML = `
            <div class="quick-view-content">
                <span class="quick-view-close">&times;</span>
                <div class="quick-view-image"><img src="${normalizeImage(product.imageUrl)}" alt="${escapeHtml(product.name)}"></div>
                <div class="quick-view-details">
                    <div class="product-title-header">
                        <h2>${escapeHtml(product.name)}</h2>
                        <button class="wishlist-btn" title="Add to Wishlist"><i class="far fa-heart"></i></button>
                    </div>
                    <p class="product-price">₹${product.price}</p>
                    <p class="product-description">${escapeHtml(product.description || "N/A")}</p>
                    <p class="product-fabric"><strong>Fabric:</strong> ${escapeHtml(product.fabric || "N/A")}</p>
                    <div class="size-selection"><label>Select Size:</label><div class="size-options">${sizeOptions}</div></div>
                    <button id="add-to-cart-modal" class="btn">Add to Cart</button>
                    <div class="product-reviews"><h4>Customer Reviews</h4>${reviewsHTML || '<p>No reviews yet.</p>'}</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const wishlistBtn = modal.querySelector('.wishlist-btn');
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (wishlist.includes(product.id)) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }

        wishlistBtn.addEventListener('click', () => {
            let currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            if (!currentWishlist.includes(product.id)) {
                currentWishlist.push(product.id);
                localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
                wishlistBtn.classList.add('active');
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                showTempMessage('Added to Wishlist!');
            }
        });

        modal.querySelector('.quick-view-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (event) => { if (event.target === modal) modal.remove(); });

        let selectedSize = null;
        modal.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedSize = btn.dataset.size;
            });
        });

        modal.querySelector('#add-to-cart-modal').addEventListener('click', () => {
            if (!selectedSize && product.sizes && product.sizes.length > 0) {
                showTempMessage('Please select a size.');
                return;
            }
            const finalSize = selectedSize || "One Size";
            const cartItem = { id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, size: finalSize, quantity: 1, category: product.category };
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const idx = cart.findIndex(i => i.id == product.id && i.size === finalSize);
            if (idx > -1) { cart[idx].quantity += 1; } else { cart.push(cartItem); }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showTempMessage('Item added to your cart!');
            modal.remove();
        });

    } catch (error) { console.error('Error opening quick view:', error); }
}

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
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
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

document.addEventListener('DOMContentLoaded', loadProducts);
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        loadProducts();
    }
});
window.addEventListener('storage', updateCartCount);