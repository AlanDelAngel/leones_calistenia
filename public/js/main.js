document.addEventListener('DOMContentLoaded', () => {
    // Highlight active navigation link
    const currentPage = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Show loading indicator while fetching data
    function showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '<p class="loading">Cargando...</p>';
    }

    function hideLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const loadingElement = container.querySelector('.loading');
            if (loadingElement) loadingElement.remove();
        }
    }

    // Display global error messages
    function showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = `<p class="error">${message}</p>`;
    }

    // Expose functions globally
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.showError = showError;
});

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    const navLinks = document.querySelector(".nav-links");

    if (role === "manager" && navLinks) {
        // Ensure button isn't added multiple times
        if (!document.querySelector("#manager-nav-item")) {
            const managerNavItem = document.createElement("li");
            managerNavItem.id = "manager-nav-item"; // Prevent duplicates
            managerNavItem.innerHTML = '<a href="manager.html">Panel de Administración</a>';
            navLinks.appendChild(managerNavItem);
        }
    }
});