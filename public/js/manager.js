document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        alert("Acceso denegado. Por favor, inicia sesión.");
        window.location.href = "/auth.html";
        return;
    }

    if (role !== "manager") {
        alert("Acceso denegado. Solo los administradores pueden acceder.");
        window.location.href = "/profile.html";
        return;
    }

    async function fetchUsers() {
        try {
            const response = await fetch("/manager/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const users = await response.json();
            const usersTable = document.querySelector("#users-table tbody");

            usersTable.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.first_name} ${user.last_name}</td>
                    <td>${user.email}</td>
                    <td>
                        <select onchange="updateUserRole(${user.id}, this.value)">
                            <option value="member" ${user.role === "member" ? "selected" : ""}>Miembro</option>
                            <option value="coach" ${user.role === "coach" ? "selected" : ""}>Coach</option>
                            <option value="manager" ${user.role === "manager" ? "selected" : ""}>Manager</option>
                        </select>
                    </td>
                    <td><button class="delete-btn" onclick="deleteUser(${user.id})">Eliminar</button></td>
                </tr>
            `).join("");
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }

    async function fetchClasses() {
        try {
            const response = await fetch("/manager/classes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const classes = await response.json();
            const classesTable = document.querySelector("#classes-table tbody");

            classesTable.innerHTML = classes.map(cls => `
                <tr>
                    <td>${cls.id}</td>
                    <td>${new Date(cls.class_date).toLocaleString()}</td>
                    <td>${cls.coach_id || "TBA"}</td>
                    <td>${cls.max_capacity}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteClass(${cls.id})">Eliminar</button>
                    </td>
                </tr>
            `).join("");
        } catch (error) {
            console.error("Error al cargar clases:", error);
        }
    }

    async function fetchMemberships() {
        try {
            const response = await fetch("/packages/my-packages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const memberships = await response.json();
            const membershipsTable = document.querySelector("#memberships-table tbody");

            membershipsTable.innerHTML = memberships.map(pkg => `
                <tr>
                    <td>${pkg.member_id}</td>
                    <td>${pkg.package_type} clases</td>
                    <td>${pkg.remaining_classes}</td>
                    <td>${new Date(pkg.expiration_date).toLocaleDateString()}</td>
                </tr>
            `).join("");
        } catch (error) {
            console.error("Error al cargar membresías:", error);
        }
    }

    async function updateUserRole(userId, newRole) {
        try {
            await fetch(`/manager/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: newRole })
            });
            alert("Rol actualizado correctamente.");
        } catch (error) {
            console.error("Error al actualizar rol:", error);
        }
    }

    async function deleteUser(userId) {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

        try {
            await fetch(`/manager/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Usuario eliminado.");
            fetchUsers();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    }

    async function deleteClass(classId) {
        if (!confirm("¿Seguro que deseas eliminar esta clase?")) return;

        try {
            await fetch(`/manager/classes/${classId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Clase eliminada.");
            fetchClasses();
        } catch (error) {
            console.error("Error al eliminar clase:", error);
        }
    }

    document.getElementById("logout")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/auth.html";
    });

    fetchUsers();
    fetchClasses();
    fetchMemberships();
});
