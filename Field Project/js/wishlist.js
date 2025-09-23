document.addEventListener('DOMContentLoaded', async () => {
    const wishlistGrid = document.getElementById('wishlist-grid');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        wishlistGrid.innerHTML = '<p>Please log in to use the wishlist feature.</p>';
        return;
    }

    const wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlistIds.length === 0) {
        wishlistGrid.innerHTML = '<p>Your wishlist is empty. Add items by clicking the heart icon!</p>';
        return;
    }

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .in('id', wishlistIds);

        if (error) throw error;
        
        wishlistGrid.innerHTML = '';
        products.forEach(product => {
            if (product) {
                const productLink = document.createElement('a');
                productLink.href = `products.html?category=${product.category}&quickview_id=${product.id}`;
                
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="product-image"><img src="${product.imageUrl}" alt="${product.name}"></div>
                    <div class="product-info"><h3>${product.name}</h3><p>₹${product.price}</p></div>
                `;
                
                productLink.appendChild(card);
                wishlistGrid.appendChild(productLink);
            }
        });

    } catch (error) {
        console.error('Error fetching wishlist items:', error);
        wishlistGrid.innerHTML = '<p>Could not load your wishlist. Please try again later.</p>';
    }
});