document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first!');
        window.location.href = '/auth.html';
        return;
    }

    const packageForm = document.getElementById('package-form');
    const packageTypeField = document.getElementById('package-type');

    packageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const package_type = packageTypeField.value;

        try {
            const response = await fetch('/packages', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ package_type })
            });
            const data = await response.json();
            alert(data.message || data.error);
            window.location.reload();
        } catch (error) {
            console.error('Package purchase error:', error);
        }
    });

    // Fetch active package info
    try {
        const response = await fetch('/packages/active', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const activePackage = await response.json();

        if (response.ok) {
            document.getElementById('active-package').innerText = `Active Package: ${activePackage.package_type} classes, ${activePackage.remaining_classes} remaining (Expires: ${activePackage.expiration_date})`;
        } else {
            document.getElementById('active-package').innerText = 'No active package available.';
        }
    } catch (error) {
        console.error('Error fetching active package:', error);
    }
});
