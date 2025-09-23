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

            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (error) {
                showModal(`Registration failed: ${error.message}`, 'Try Again', () => {
                    modal.style.display = 'none';
                });
            } else {
                showModal('Registration successful! Please check your email to confirm.', 'Go to Login', () => {
                    window.location.href = 'login.html';
                }, 'success');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = event.target.email.value;
            const password = event.target.password.value;

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                showModal(`Login failed: ${error.message}`, 'Try Again', () => {
                    modal.style.display = 'none';
                });
            } else {
                const user = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata.full_name
                };
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                showModal('Login successful! Welcome back.', 'Continue', () => {
                    window.location.href = 'index.html';
                }, 'success');
            }
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