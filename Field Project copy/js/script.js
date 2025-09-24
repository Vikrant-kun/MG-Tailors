document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');

    const userIconButton = document.querySelector('.user-icon-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const loggedOutLinks = document.querySelector('.user-links-logged-out');
    const loggedInLinks = document.querySelector('.user-links-logged-in');
    const logoutLink = document.getElementById('logout-link');

    if (userIconButton) {
        userIconButton.addEventListener('click', (event) => {
            event.preventDefault();
            dropdownMenu.classList.toggle('show');
        });
    }

    window.addEventListener('click', (event) => {
        if (dropdownMenu && !event.target.closest('.dropdown')) {
            dropdownMenu.classList.remove('show');
        }
    });

    const navLinks = document.querySelectorAll('.navbar ul li a:not(.user-icon-btn)');
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (linkPage === 'index.html' && currentPage === '')) {
            link.classList.add('active-link');
        }
    });

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        if(loggedOutLinks) loggedOutLinks.style.display = 'none';
        if(loggedInLinks) loggedInLinks.style.display = 'block';
    } else {
        if(loggedOutLinks) loggedOutLinks.style.display = 'block';
        if(loggedInLinks) loggedInLinks.style.display = 'none';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            const modal = document.getElementById('custom-modal');
            const modalMessage = document.getElementById('modal-message');
            const confirmBtn = document.getElementById('modal-button-confirm');
            const actionBtn = document.getElementById('modal-button-action');
            const cancelBtn = document.getElementById('modal-button-cancel');
            const modalIcon = document.getElementById('modal-icon');
            
            if (!modal) return;
            
            modalIcon.innerHTML = '';
            modalMessage.textContent = 'Are you sure you want to log out?';
            confirmBtn.textContent = 'Yes, Logout';
            confirmBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
            actionBtn.style.display = 'none';
            modal.style.display = 'block';

            confirmBtn.onclick = () => {
                localStorage.removeItem('loggedInUser');
                modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                modalMessage.textContent = 'You have been logged out successfully.';
                confirmBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                actionBtn.style.display = 'inline-block';
                actionBtn.textContent = 'OK';
                actionBtn.onclick = () => {
                    document.querySelector('body').classList.add('fade-out');
                    setTimeout(() => { window.location.href = 'index.html'; }, 500);
                };
            };
            cancelBtn.onclick = () => {
                modal.style.display = 'none';
            };
        });
    }

    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(function(link) {
        const url = link.getAttribute('href');
        if (url && !url.startsWith('#') && !url.startsWith('http')) {
            const isDropdownLink = link.closest('.dropdown-menu');
            if (isDropdownLink) return;

            link.addEventListener('click', function(event) {
                event.preventDefault();
                document.querySelector('body').classList.add('fade-out');
                setTimeout(function() {
                    window.location.href = url;
                }, 500);
            });
        }
    });
});