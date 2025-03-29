/**
 * Finance Tracker - Main JavaScript
 * Handles core functionality and UI components
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer components
    loadComponent('header-container', '/components/header.html');
    loadComponent('footer-container', '/components/footer.html');
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize dropdowns
    initializeDropdowns();
    
    // Initialize modals
    initializeModals();
});

/**
 * Load HTML component into a container
 * @param {string} containerId - ID of the container element
 * @param {string} componentPath - Path to the HTML component file
 */
function loadComponent(containerId, componentPath) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            
            // Initialize mobile menu after header is loaded
            if (containerId === 'header-container') {
                initializeMobileMenu();
                initializeDropdowns();
                highlightCurrentPage();
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
            container.innerHTML = `<p>Error loading component. Please refresh the page.</p>`;
        });
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navList = document.getElementById('nav-list');
    
    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Toggle hamburger to X
            const bars = mobileMenuToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('active'));
        });
    }
}

/**
 * Initialize dropdown menus
 */
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
            // For mobile: toggle dropdown on click
            dropdownToggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
}

/**
 * Highlight current page in navigation
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath === linkPath || 
            (currentPath.includes('/services/') && linkPath.includes(currentPath))) {
            link.classList.add('active');
            
            // If it's in a dropdown, highlight the parent too
            const parentLi = link.closest('.dropdown');
            if (parentLi) {
                const parentLink = parentLi.querySelector('.dropdown-toggle');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });
}
// Include this script in your HTML file

document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('overview-chart').getContext('2d');
    const overviewChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Balance', 'Monthly Income', 'Monthly Expenses'],
            datasets: [{
                data: [50000, 100560, 632220],
                backgroundColor: ['#4CAF50', '#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#45a049', '#2e8bcb', '#ff4c61']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Financial Overview'
                }
            }
        }
    });
});

/**
 * Initialize modal functionality
 */
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

/**
 * Format currency value
 * @param {number} value - The value to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format date to display format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

/**
 * Get current date in YYYY-MM-DD format for input fields
 * @returns {string} - Current date in YYYY-MM-DD format
 */
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}-notification`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Style the notification
    notification.style.backgroundColor = type === 'success' ? '#5cb85c' : 
                                        type === 'error' ? '#d9534f' : '#5bc0de';
    notification.style.color = '#fff';
    notification.style.padding = '12px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';
    notification.style.animation = 'slideInFromRight 0.3s ease forwards';
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#fff';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '10px';
    
    closeButton.addEventListener('click', function() {
        notification.style.animation = 'slideInFromRight 0.3s ease reverse forwards';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    });
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode === notificationContainer) {
            notification.style.animation = 'slideInFromRight 0.3s ease reverse forwards';
            setTimeout(() => {
                if (notification.parentNode === notificationContainer) {
                    notificationContainer.removeChild(notification);
                }
            }, 300);
        }
    }, duration);
}