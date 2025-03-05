document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button');
    const openRegisterBtn = document.getElementById('open-register');
    const registerModal = document.getElementById('register-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('role'); // Ensure role is also removed
            window.location.href = '/auth.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            if (!emailInput.value || !passwordInput.value) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role); // ✅ Save role in localStorage
                
                if (data.role === 'manager') {
                    window.location.href = '/manager.html'; // ✅ Redirect to Manager Dashboard
                } else {
                    window.location.href = '/profile.html';
                }
            } else {
                alert(data.error);
            }
        });
    }

    // Open Register Modal
    openRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'flex';
    });

    // Close Modal
    closeBtn.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });

    // Close modal when clicking outside the form
    window.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });


    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert("Por favor, verifica que no eres un robot.");
                return;
            }

            const firstNameInput = document.getElementById('register-firstname');
            const lastNameInput = document.getElementById('register-lastname');
            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');

            if (!firstNameInput.value || !lastNameInput.value || !emailInput.value || !passwordInput.value) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstNameInput.value,
                    last_name: lastNameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                    role: 'member',
                    recaptcha: recaptchaResponse
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registro exitoso! Ahora puedes iniciar sesión.');
                registerModal.style.display = 'none'; // Auto-close modal
            } else {
                alert(data.error);
            }
        });
    }
});