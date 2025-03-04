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
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const users = await response.json();
            const usersTable = document.querySelector("#users-table tbody");
    
            usersTable.innerHTML = users
                .filter(user => user.role !== "manager") // Exclude managers from the list
                .map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.first_name} ${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>
                            <select id="role-${user.id}">
                                <option value="member" ${user.role === "member" ? "selected" : ""}>Miembro</option>
                                <option value="coach" ${user.role === "coach" ? "selected" : ""}>Coach</option>
                            </select>
                        </td>
                        <td>
                            <button class="update-btn" onclick="updateUserRole(${user.id})">Actualizar</button>
                        </td>
                    </tr>
                `).join("");
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }    
    
    async function updateUserRole(userId) {
        const selectedRole = document.getElementById(`role-${userId}`).value;
        
        try {
            const response = await fetch(`/manager/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: selectedRole })
            });
    
            if (response.ok) {
                alert("Rol actualizado correctamente.");
                fetchUsers(); // Refresh the user list after update
            } else {
                alert("Error al actualizar el rol.");
            }
        } catch (error) {
            console.error("Error al actualizar rol:", error);
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
            const response = await fetch("/manager/memberships", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const memberships = await response.json();
            const membershipsTable = document.querySelector("#memberships-table tbody");
    
            membershipsTable.innerHTML = memberships.map(pkg => `
                <tr>
                    <td>${pkg.member_name}</td>
                    <td>${pkg.package_type} clases</td>
                    <td>${pkg.remaining_classes}</td>
                    <td>${new Date(pkg.expiration_date).toLocaleDateString()}</td>
                </tr>
            `).join("");
        } catch (error) {
            console.error("Error al cargar membresías:", error);
        }
    }
    
    // Load memberships when the manager page loads
    document.addEventListener("DOMContentLoaded", fetchMemberships);
    
    
    document.getElementById("logout")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/auth.html";
    });
    
    fetchUsers();
    fetchClasses();
    fetchMemberships();
});

window.updateUserRole = async function(userId) {
    const selectedRole = document.getElementById(`role-${userId}`).value;
    
    try {
        const response = await fetch(`/manager/users/${userId}/role`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: selectedRole })
        });

        if (response.ok) {
            alert("Rol actualizado correctamente.");
        } else {
            alert("Error al actualizar el rol.");
        }
    } catch (error) {
        console.error("Error al actualizar rol:", error);
    }
};
