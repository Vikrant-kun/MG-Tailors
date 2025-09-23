async function loadProducts() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const quickViewId = params.get('quickview_id');
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
            const { data: categories, error } = await supabase.from('categories').select('name');
            if (error) throw error;
            if (categories) {
                categoryList.innerHTML = '<li><a href="products.html">All Products</a></li>';
                categories.forEach(c => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="products.html?category=${c.name}">${c.name.charAt(0).toUpperCase() + c.name.slice(1)}</a>`;
                    categoryList.appendChild(li);
                });
            }
        }
    } catch (e) {
        console.error("Could not load categories", e);
    }

    try {
        let query = supabase.from('products').select('*');
        if (category) {
            query = query.eq('category', category);
        }
        const { data: products, error } = await query;
        if (error) throw error;
        
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
                <div class="product-image"><img src="${product.imageUrl}" alt="${product.name}"></div>
                <div class="product-info"><h3>${product.name}</h3><p>₹${product.price}</p></div>
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
        
        if(quickViewId) {
            openQuickView(quickViewId);
        }

    } catch (error) {
        console.error('Error fetching products:', error);
        if (productGrid) productGrid.innerHTML = '<p>Could not load products. Please try again later.</p>';
    }
}

async function openQuickView(productId) {
    try {
        const { data: product, error } = await supabase.from('products').select('*').eq('id', productId).single();
        if (error) throw error;
        
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        const sizeOptions = (product.sizes || []).map(size => `<button class="size-option" data-size="${size}">${size}</button>`).join('');
        const reviewsHTML = (product.reviews || []).map(review => `<div class="review"><p>"${review.text}"</p><span>- ${review.author}</span></div>`).join('');
        
        modal.innerHTML = `
            <div class="quick-view-content">
                <span class="quick-view-close">&times;</span>
                <div class="product-title-header">
                    <h2>${product.name}</h2>
                    <button class="wishlist-btn" title="Add to Wishlist"><i class="far fa-heart"></i></button>
                </div>
                <div class="quick-view-image"><img src="${product.imageUrl}" alt="${product.name}"></div>
                <div class="quick-view-details">
                    <p class="product-price">₹${product.price}</p>
                    <p class="product-description">${product.description || "N/A"}</p>
                    <p class="product-fabric"><strong>Fabric:</strong> ${product.fabric || "N/A"}</p>
                    <div class="size-selection"><label>Select Size:</label><div class="size-options">${sizeOptions}</div></div>
                    <button id="add-to-cart-modal" class="btn">Add to Cart</button>
                    <div class="product-reviews"><h4>Customer Reviews</h4>${reviewsHTML || '<p>No reviews yet.</p>'}</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

    } catch (error) {
        console.error('Error opening quick view:', error);
    }
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

document.addEventListener('DOMContentLoaded', loadProducts);
window.addEventListener('pageshow', (event) => { if (event.persisted) { loadProducts(); } });
window.addEventListener('storage', updateCartCount);