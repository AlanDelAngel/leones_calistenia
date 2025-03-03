document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Por favor, inicia sesión primero.');
        window.location.href = '/auth.html';
        return;
    }

    const userInfoDiv = document.getElementById('user-info');
    const packagesContainer = document.getElementById('packages-container');

    // Fetch user profile
    try {
        const response = await fetch('/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('No se pudo obtener el perfil');

        const user = await response.json();
        userInfoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${user.first_name} ${user.last_name}</p>
            <p><strong>Correo:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${user.role}</p>
        `;
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        userInfoDiv.innerHTML = '<p>Error al cargar los datos del perfil.</p>';
    }

    // Fetch user packages
    try {
        const response = await fetch('/packages/my-packages', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const packages = await response.json();
            if (packages.length > 0) {
                packagesContainer.innerHTML = packages.map(pkg => `
                    <div class="package-item">
                        <p><strong>Paquete:</strong> ${pkg.package_type} clases</p>
                        <p><strong>Clases Restantes:</strong> ${pkg.remaining_classes}</p>
                        <p><strong>Fecha de Compra:</strong> ${pkg.purchase_date}</p>
                        <p><strong>Expira el:</strong> ${pkg.expiration_date}</p>
                    </div>
                `).join('');
            } else {
                packagesContainer.innerHTML = '<p>No tienes paquetes activos.</p>';
            }
        } else {
            packagesContainer.innerHTML = '<p>Error al obtener los paquetes.</p>';
        }
    } catch (error) {
        console.error('Error al obtener paquetes:', error);
        packagesContainer.innerHTML = '<p>Error al cargar los paquetes.</p>';
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

document.addEventListener('DOMContentLoaded', () => {
    const purchaseButton = document.getElementById('purchase-package');
    const packageSelect = document.getElementById('package-selection');
    const purchaseStatus = document.getElementById('purchase-status');
    const token = localStorage.getItem('token');

    if (purchaseButton) {
        purchaseButton.addEventListener('click', async () => {
            const packageType = packageSelect.value;

            if (!token) {
                alert('Por favor, inicia sesión para comprar un paquete.');
                return;
            }

            try {
                const response = await fetch('/packages/purchase', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ package_type: packageType })
                });

                const data = await response.json();
                if (response.ok) {
                    purchaseStatus.innerText = 'Compra exitosa!';
                    purchaseStatus.style.color = 'green';
                } else {
                    purchaseStatus.innerText = `Error: ${data.error}`;
                    purchaseStatus.style.color = 'red';
                }
            } catch (error) {
                console.error('Error al comprar paquete:', error);
                purchaseStatus.innerText = 'Error al procesar la compra.';
                purchaseStatus.style.color = 'red';
            }
        });
    }
});