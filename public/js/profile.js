document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "auth.html"; // Redirige si no hay sesión activa
        return;
    }

    try {
        // Solicitar datos del usuario
        const response = await fetch("/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error desconocido");
        }

        // Mostrar datos en el perfil
        document.getElementById("user-info").innerHTML = `
            <h2>${data.first_name} ${data.last_name}</h2>
            <p>Email: ${data.email}</p>
        `;

        // Obtener paquetes de clases
        const packageResponse = await fetch("/packages", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const packages = await packageResponse.json();
        const packageContainer = document.getElementById("packages-container");
        packageContainer.innerHTML = "";

        packages.forEach(pkg => {
            const div = document.createElement("div");
            div.classList.add("package-item");
            div.innerHTML = `<p>Paquete: ${pkg.package_type} clases - Restantes: ${pkg.remaining_classes}</p>`;
            packageContainer.appendChild(div);
        });

    } catch (error) {
        alert("Error al cargar perfil: " + error.message);
    }
});

// Manejar eliminación de cuenta
document.getElementById("delete-account")?.addEventListener("click", async () => {
    const confirmDelete = confirm("⚠️ ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("/users/delete", {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "No se pudo eliminar la cuenta.");
        }

        alert("Tu cuenta ha sido eliminada.");
        localStorage.removeItem("token");
        window.location.href = "auth.html";

    } catch (error) {
        alert("Error al eliminar la cuenta: " + error.message);
    }
});