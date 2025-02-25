document.getElementById("login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "profile.html";
    } else {
        alert("Error en la autenticación");
    }
});

document.getElementById("register-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name, last_name, email, password, role })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error desconocido en el registro");
        }

        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        window.location.href = "auth.html";

    } catch (error) {
        alert("Error en el registro: " + error.message);
    }
});
