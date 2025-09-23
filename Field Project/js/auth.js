document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalIcon = document.getElementById('modal-icon');
    const confirmBtn = document.getElementById('modal-button-confirm');
    const actionBtn = document.getElementById('modal-button-action');
    const cancelBtn = document.getElementById('modal-button-cancel');

    function showModal(message, buttonText, onButtonClick, type = 'default') {
        if (!modal) return;
        
        modalIcon.innerHTML = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '';
        modalMessage.textContent = message;
        actionBtn.textContent = buttonText;
        actionBtn.onclick = onButtonClick;

        actionBtn.style.display = 'inline-block';
        confirmBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        modal.style.display = 'block';
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = event.target.username.value;
            const email = event.target.email.value;
            const password = event.target.password.value;
            
            try {
                const checkResponse = await fetch(`http://localhost:3000/users?email=${email}`);
                const existingUsers = await checkResponse.json();

                if (existingUsers.length > 0) {
                    showModal('This email is already registered.', 'Go to Login', () => {
                        window.location.href = 'login.html';
                    });
                    return;
                }

                const newUser = { name, email, password };
                const createResponse = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });

                if (createResponse.ok) {
                    showModal('Registration successful!', 'Go to Login', () => {
                        window.location.href = 'login.html';
                    }, 'success');
                } else {
                    showModal('Registration failed.', 'Try Again', () => {
                        modal.style.display = 'none';
                    });
                }
            } catch (error) { console.error('Error:', error); }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = event.target.email.value;
            const password = event.target.password.value;

            try {
                const response = await fetch(`http://localhost:3000/users?email=${email}`);
                const users = await response.json();

                if (users.length === 0) {
                    showModal('No user found. Please register.', 'Register', () => {
                        window.location.href = 'register.html';
                    });
                } else {
                    const user = users[0];
                    if (user.password === password) {
                        localStorage.setItem('loggedInUser', JSON.stringify(user));
                        showModal('Login successful! Welcome back.', 'Continue', () => {
                            window.location.href = 'index.html';
                        }, 'success');
                    } else {
                        showModal('Incorrect password.', 'Try Again', () => {
                            modal.style.display = 'none';
                        });
                    }
                }
            } catch (error) { console.error('Error:', error); }
        });
    }

    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});