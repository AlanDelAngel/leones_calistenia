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