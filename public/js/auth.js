document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            if (!emailInput || !passwordInput) {
                console.error("Login form elements not found");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/profile.html';
            } else {
                alert(data.error);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstNameInput = document.getElementById('register-firstname');
            const lastNameInput = document.getElementById('register-lastname');
            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');

            if (!firstNameInput || !lastNameInput || !emailInput || !passwordInput) {
                console.error("Registration form elements not found");
                return;
            }

            const first_name = firstNameInput.value;
            const last_name = lastNameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first_name, last_name, email, password, role: 'member' })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = '/auth.html';
            } else {
                alert(data.error);
            }
        });
    }
});
