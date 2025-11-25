// Get all navigation buttons and screens
const navButtons = document.querySelectorAll('.nav-btn');
const screens = document.querySelectorAll('.screen');

// Clear browser cache on every page load
function clearBrowserCache() {
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
            });
        });
    }
}

// Force refresh on load
window.addEventListener('load', () => {
    clearBrowserCache();
    // Add timestamp to prevent caching
    const link = document.createElement('meta');
    link.httpEquiv = 'Cache-Control';
    link.content = 'no-cache, no-store, must-revalidate';
    document.head.appendChild(link);
});

// Function to switch screens
function switchScreen(screenName) {
    // Hide all screens
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Remove active class from all navigation buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show the needed screen
    const activeScreen = document.getElementById(`${screenName}-screen`);
    if (activeScreen) {
        activeScreen.classList.add('active');
    }

    // Activate the corresponding button
    const activeBtn = document.querySelector(`.nav-btn[data-screen="${screenName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Add event listeners to navigation buttons
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const screenName = btn.getAttribute('data-screen');
        switchScreen(screenName);
    });
});

// Event handlers for buttons on screens
document.addEventListener('DOMContentLoaded', () => {
    // Find nearest bin - go to map
    const findBinBtn = document.querySelector('.quick-actions .primary-btn');
    if (findBinBtn) {
        findBinBtn.addEventListener('click', () => {
            switchScreen('map');
        });
    }

    // Get reward - go to rewards page
    const rewardBtn = document.querySelector('.quick-actions .secondary-btn');
    if (rewardBtn) {
        rewardBtn.addEventListener('click', () => {
            switchScreen('rewards');
        });
    }

    // "Claim" buttons for rewards
    const claimRewardBtns = document.querySelectorAll('.rewards-list .claim-btn:not(.disabled)');
    claimRewardBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showAlert('Reward added to your profile!');
        });
    });

    // Claim daily gift button
    const claimDailyBtn = document.querySelector('.claim-daily-btn');
    if (claimDailyBtn) {
        claimDailyBtn.addEventListener('click', () => {
            showAlert('You earned 50 points! 🎉');
        });
    }

    // Settings button in profile
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            showAlert('Profile Settings (in development)');
        });
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                showAlert('See you soon! 👋');
            }
        });
    }
});

// Function to show notifications
function showAlert(message) {
    // Create notification element
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: slideDown 0.3s ease;
    `;
    alert.textContent = message;

    document.body.appendChild(alert);

    // Remove notification after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize - show home screen on load
window.addEventListener('load', () => {
    switchScreen('home');
});