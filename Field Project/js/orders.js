document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.getElementById('orders-container');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        ordersContainer.innerHTML = '<p>Please log in to view your order history.</p>';
        return;
    }

    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('userId', loggedInUser.id)
            .order('orderDate', { ascending: false });

        if (error) throw error;

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>You have not placed any orders yet.</p>';
            return;
        }

        ordersContainer.innerHTML = '';
        orders.forEach(order => {
            const orderDate = new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
            const deliveryDate = new Date(order.orderDate);
            deliveryDate.setDate(deliveryDate.getDate() + 5);
            const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

            const itemsHTML = order.cart.map(item => `
                <a href="products.html?category=${item.category}&quickview_id=${item.id}" class="order-item-link">
                    <div class="order-item">
                        <div class="order-item-image"><img src="${item.imageUrl}" alt="${item.name}"></div>
                        <div class="order-item-details">
                            <strong>${item.name}</strong><br>
                            <span>Size: ${item.size} | Quantity: ${item.quantity}</span>
                        </div>
                    </div>
                </a>
            `).join('');

            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.innerHTML = `
                <div class="order-header">
                    <div><strong>Order Date:</strong><br>${orderDate}</div>
                    <div><strong>Total:</strong><br>₹${order.totalAmount}</div>
                    <div><strong>Shipped To:</strong><br>${order.shipping.address}</div>
                </div>
                <div class="order-body">
                    ${itemsHTML}
                </div>
            `;
            ordersContainer.appendChild(orderCard);
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        ordersContainer.innerHTML = '<p>Could not load your orders. Please try again later.</p>';
    }
});