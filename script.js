// DevOps Test Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    init();
});

function init() {
    // Set build date
    setBuildDate();
    
    // Add smooth scrolling for navigation
    setupSmoothScrolling();
    
    // Add some interactive animations
    setupAnimations();
    
    // Simulate system health check
    simulateHealthCheck();
    
    console.log('🚀 DevOps Test Website initialized successfully!');
}

// Set current build date
function setBuildDate() {
    const buildDateElement = document.getElementById('build-date');
    if (buildDateElement) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        buildDateElement.textContent = formattedDate;
    }
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup animations for cards and features
function setupAnimations() {
    // Animate cards on scroll
    const cards = document.querySelectorAll('.card');
    const featureItems = document.querySelectorAll('.feature-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    cards.forEach(card => observer.observe(card));
    featureItems.forEach(item => observer.observe(item));
}

// Simulate a health check for the system
function simulateHealthCheck() {
    const statusElement = document.getElementById('status');
    const environmentElement = document.getElementById('environment');
    
    // Simulate different environments based on hostname or random
    const environments = ['Development', 'Staging', 'Production'];
    const randomEnv = environments[Math.floor(Math.random() * environments.length)];
    
    if (environmentElement) {
        environmentElement.textContent = randomEnv;
    }
    
    // Simulate health check with random status
    setTimeout(() => {
        const isHealthy = Math.random() > 0.1; // 90% chance of being healthy
        
        if (statusElement) {
            if (isHealthy) {
                statusElement.textContent = 'Online';
                statusElement.className = 'status-ok';
            } else {
                statusElement.textContent = 'Warning';
                statusElement.className = 'status-error';
            }
        }
    }, 1000);
}

// Function called by the CTA button
function showAlert() {
    const messages = [
        '🚀 DevOps pipeline đã được khởi chạy!',
        '✅ Hệ thống đang hoạt động tốt!',
        '🔧 Đang thực hiện deployment...',
        '📊 Monitoring system đã được kích hoạt!',
        '🎯 Test case đã được thực thi thành công!'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create custom alert modal
    createCustomAlert(randomMessage);
}

// Create a custom alert modal
function createCustomAlert(message) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-info-circle"></i>
                <h3>DevOps Notification</h3>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button onclick="closeCustomAlert()" class="modal-btn">
                    <i class="fas fa-check"></i> OK
                </button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            animation: slideUp 0.3s ease;
        }
        
        .modal-header {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .modal-header i {
            font-size: 2rem;
            margin-bottom: 10px;
            display: block;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 1.3rem;
        }
        
        .modal-body {
            padding: 30px 20px;
            text-align: center;
        }
        
        .modal-body p {
            margin: 0;
            font-size: 1.1rem;
            color: #333;
            line-height: 1.6;
        }
        
        .modal-footer {
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .modal-btn {
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .modal-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeCustomAlert();
    }, 5000);
}

// Close custom alert
function closeCustomAlert() {
    const modal = document.querySelector('.custom-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Add fade out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);

// API simulation for DevOps testing
const DevOpsAPI = {
    // Simulate build status check
    getBuildStatus: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const statuses = ['success', 'building', 'failed', 'pending'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                resolve({
                    status: randomStatus,
                    buildNumber: Math.floor(Math.random() * 1000) + 1,
                    timestamp: new Date().toISOString(),
                    branch: 'main'
                });
            }, 1000);
        });
    },
    
    // Simulate deployment status
    getDeploymentStatus: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    environment: 'production',
                    status: 'deployed',
                    version: '1.0.0',
                    deployedAt: new Date().toISOString()
                });
            }, 800);
        });
    },
    
    // Simulate health check
    healthCheck: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: 'healthy',
                    uptime: Math.floor(Math.random() * 86400) + 3600, // 1-24 hours in seconds
                    responseTime: Math.floor(Math.random() * 100) + 50 + 'ms',
                    memory: Math.floor(Math.random() * 40) + 30 + '%'
                });
            }, 500);
        });
    }
};

// Console welcome message
console.log(`
🎯 ================================
   DevOps Test Website Ready!
🎯 ================================

Available API methods:
- DevOpsAPI.getBuildStatus()
- DevOpsAPI.getDeploymentStatus() 
- DevOpsAPI.healthCheck()

Example usage:
DevOpsAPI.getBuildStatus().then(console.log);

Happy testing! 🚀
`);

// Add some development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode detected');
    
    // Add development tools to window
    window.devTools = {
        triggerAlert: showAlert,
        healthCheck: () => DevOpsAPI.healthCheck().then(console.log),
        buildStatus: () => DevOpsAPI.getBuildStatus().then(console.log),
        deployStatus: () => DevOpsAPI.getDeploymentStatus().then(console.log)
    };
    
    console.log('🛠️ Development tools available at window.devTools');
}

