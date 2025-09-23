document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const formContainer = document.querySelector('.form-container');
    const checkoutWelcome = document.getElementById('checkout-welcome');

    if (!loggedInUser) {
        if (formContainer) formContainer.style.display = 'none';
        if (checkoutWelcome) checkoutWelcome.innerHTML = '';
        showLoginPrompt();
        return;
    }

    const nameInput = document.getElementById('name');
    const nameGroup = document.getElementById('name-group');
    if (checkoutWelcome) checkoutWelcome.innerHTML = `<h2>Welcome, ${loggedInUser.name}!</h2><p>Please confirm your shipping details.</p>`;
    if (nameInput) nameInput.value = loggedInUser.name;
    if (nameGroup) nameGroup.style.display = 'none';

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const orderDetails = {
                shipping: {
                    name: document.getElementById('name').value,
                    address: document.getElementById('address').value,
                    phone: document.getElementById('phone').value
                },
                paymentMethod: document.querySelector('input[name="payment"]:checked').value,
                cart: JSON.parse(localStorage.getItem('cart')) || [],
                userId: loggedInUser.id,
                orderDate: new Date().toISOString()
            };
            sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
            updateProgressBar('review');
            showOrderReviewModal(orderDetails);
        });
    }
});

function showLoginPrompt() {
    const modal = document.getElementById('custom-modal');
    if(!modal) return;
    modal.innerHTML = `
        <div class="modal-content">
            <p>You must be logged in to proceed. Please log in first to continue.</p>
            <div class="modal-buttons">
                <a href="login.html" class="btn">Go to Login</a>
            </div>
        </div>`;
    modal.style.display = 'block';
}

function showOrderReviewModal(orderDetails) {
    const modal = document.getElementById('custom-modal');
    if(!modal) return;
    
    const subtotal = orderDetails.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = 40;
    const total = subtotal + deliveryCharge;
    const isCOD = orderDetails.paymentMethod === 'cod';
    orderDetails.totalAmount = total;

    modal.innerHTML = `
        <div class="modal-content">
            <h4>Please Review Your Order</h4>
            <div class="review-details">
                <strong>Deliver to:</strong> ${orderDetails.shipping.name}<br>
                <strong>Address:</strong> ${orderDetails.shipping.address}<br>
                <strong>Phone:</strong> ${orderDetails.shipping.phone}
                <button id="edit-details-btn" class="edit-btn">Edit</button>
            </div>
            <table class="order-summary-table">
                <tr><td>Subtotal:</td><td>₹${subtotal}</td></tr>
                <tr><td>Delivery:</td><td>₹${deliveryCharge}</td></tr>
                <tr class="total-row"><td>Total to Pay:</td><td>₹${total}</td></tr>
            </table>
            <div class="modal-buttons">
                <button id="modal-button-cancel" class="btn btn-secondary">Cancel</button>
                <button id="modal-button-confirm" class="btn">${isCOD ? 'Confirm Order' : 'Make Payment'}</button>
            </div>
        </div>`;
    modal.style.display = 'block';

    modal.querySelector('#edit-details-btn').addEventListener('click', () => {
        modal.style.display = 'none';
        updateProgressBar('shipping');
    });

    modal.querySelector('#modal-button-confirm').addEventListener('click', () => {
        updateProgressBar('payment');
        if (isCOD) {
            completeOrder(orderDetails);
        } else {
            launchRazorpay(total, orderDetails);
        }
    });

    modal.querySelector('#modal-button-cancel').addEventListener('click', () => {
        modal.style.display = 'none';
        updateProgressBar('shipping');
    });
}

function updateProgressBar(activeStep) {
    document.querySelectorAll('.progress-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${activeStep}`).classList.add('active');
}

function launchRazorpay(totalAmount, orderDetails) {
    const options = {
        key: 'rzp_test_ILz2eDRp37hV3b',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'MG\'s Tailoring',
        description: 'Order Payment',
        handler: function (response) {
            orderDetails.paymentId = response.razorpay_payment_id;
            completeOrder(orderDetails);
        },
        prefill: {
            name: orderDetails.shipping.name,
            contact: orderDetails.shipping.phone
        },
        theme: {
            color: '#8c7851'
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
}

async function completeOrder(orderDetails) {
    try {
        const { error } = await supabase.from('orders').insert([orderDetails]);
        if (error) throw error;

        localStorage.removeItem('cart');
        sessionStorage.setItem('finalOrder', JSON.stringify(orderDetails));
        updateCartCount();
        window.location.href = 'order-confirmation.html';
    } catch (error) {
        console.error('Failed to save order:', error);
        alert('Could not place your order. Please try again.');
    }
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = '0';
        cartCountEl.style.display = 'none';
    }
}