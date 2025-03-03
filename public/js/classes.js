document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Por favor, inicia sesión primero.');
        window.location.href = '/auth.html';
        return;
    }

    const classList = document.getElementById('classes-container');
    if (!classList) return;

    try {
        const response = await fetch('/classes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const classes = await response.json();

        if (response.ok) {
            classList.innerHTML = classes.map(cls => `
                <div class="class-item">
                    <h3>${cls.class_type} - ${new Date(cls.class_date).toLocaleString()}</h3>
                    <p><strong>Coach:</strong> ${cls.coach_id || 'TBA'}</p>
                    <p><strong>Capacidad Máxima:</strong> ${cls.max_capacity}</p>
                    <p><strong>Ubicación:</strong> ${cls.branch_id || 'No especificado'}</p>
                    <button onclick="enroll(${cls.id})">Inscribirse</button>
                </div>
            `).join('');
        } else {
            classList.innerHTML = '<p>No hay clases disponibles.</p>';
        }
    } catch (error) {
        console.error('Error al cargar las clases:', error);
        classList.innerHTML = '<p>Error al cargar las clases.</p>';
    }
});

async function enroll(classId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Necesitas iniciar sesión para inscribirte.');
        return;
    }

    try {
        const response = await fetch(`/enroll/${classId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        alert(data.message || data.error);
        window.location.reload();
    } catch (error) {
        console.error('Error al inscribirse en la clase:', error);
    }
}
