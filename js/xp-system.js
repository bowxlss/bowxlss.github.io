// xp-system.js - XP and achievement system

// XP System State Management - START FROM LEVEL 0 FOR NEW VISITORS
let xpState = {
    currentXP: 0,
    totalXP: 100,
    level: 0,
    actions: {},
    lastReset: null
};

// Load XP state from localStorage
function loadXPState() {
    const saved = localStorage.getItem('xpState');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Check if we need to reset daily actions
        const today = new Date().toDateString();
        if (parsed.lastReset !== today) {
            // Reset daily actions for new day
            xpState = {
                currentXP: parsed.currentXP,
                totalXP: parsed.totalXP,
                level: parsed.level,
                actions: {},
                lastReset: today
            };
        } else {
            xpState = parsed;
        }
    } else {
        // NEW: Start from Level 0 for new visitors
        xpState = {
            currentXP: 0,
            totalXP: 100,
            level: 0,
            actions: {},
            lastReset: new Date().toDateString()
        };
        saveXPState();
    }
    updateXPDisplay();
}

// Save XP state to localStorage
function saveXPState() {
    localStorage.setItem('xpState', JSON.stringify(xpState));
}

// Calculate XP needed for next level
function calculateNextLevelXP() {
    // Progressive XP requirement: 100, 150, 225, 337, 505, etc.
    return Math.floor(100 * Math.pow(1.5, xpState.level));
}

// Update XP display
function updateXPDisplay() {
    const xpLevel = document.querySelector('.xp-level');
    const xpPoints = document.querySelector('.xp-points');
    const xpProgress = document.querySelector('.xp-progress');

    if (xpLevel) {
        xpLevel.textContent = `Level ${xpState.level} Developer`;
    }
    if (xpPoints) {
        xpPoints.textContent = `${xpState.currentXP}/${xpState.totalXP} XP`;
    }
    if (xpProgress) {
        const percentage = Math.min(100, (xpState.currentXP / xpState.totalXP) * 100);
        xpProgress.style.width = `${percentage}%`;
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,0,0.2)'};
        color: ${type === 'success' ? '#00ff00' : '#ffff00'};
        border: 1px solid ${type === 'success' ? '#00ff00' : '#ffff00'};
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        text-shadow: 0 0 10px ${type === 'success' ? '#00ff00' : '#ffff00'};
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification styles
function addNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// FIXED: XP System Functionality - Fixed double notification issue
let isProcessingAction = false;

function gainXP(action, customMessage = null) {
    // Prevent multiple simultaneous executions
    if (isProcessingAction) {
        return;
    }
    
    isProcessingAction = true;

    const xpValues = {
        'visit': 10,
        'terminal': 15,
        'game': 25,
        'social': 30
    };

    const points = xpValues[action];
    if (!points) {
        showNotification('Invalid action!', 'info');
        isProcessingAction = false;
        return;
    }

    // Check if action was already performed today - FIXED LOGIC
    const today = new Date().toDateString();
    
    // Check if this action was already done today
    if (xpState.actions[action] === today) {
        // Only show notification for manual actions, not for terminal usage
        if (action !== 'terminal') {
            showNotification(`You already earned XP for ${action} today! Come back tomorrow.`, 'info');
        }
        isProcessingAction = false;
        return;
    }

    // Add XP
    const oldLevel = xpState.level;
    xpState.currentXP += points;
    xpState.actions[action] = today;

    // Check for level up
    let levelUps = 0;
    while (xpState.currentXP >= xpState.totalXP) {
        xpState.currentXP -= xpState.totalXP;
        xpState.level++;
        levelUps++;
        xpState.totalXP = calculateNextLevelXP();
    }

    // Update display and save
    updateXPDisplay();
    saveXPState();
    
    // Show success notification - ONLY ONE NOTIFICATION
    // Use custom message if provided, otherwise use default
    const notificationMessage = customMessage || `+${points} XP gained for ${action}!`;
    showNotification(notificationMessage, 'success');
    
    if (levelUps > 0) {
        setTimeout(() => {
            showNotification(`🎉 Level Up! You are now Level ${xpState.level}`, 'success');
            triggerConfetti();
        }, 1000);
    }

    // Visual feedback
    const xpProgress = document.querySelector('.xp-progress');
    if (xpProgress) {
        xpProgress.style.transition = 'width 0.5s ease';
        setTimeout(() => {
            xpProgress.style.transition = 'width 2s ease-in-out';
        }, 500);
    }

    // Reset processing flag after a short delay to prevent rapid successive clicks
    setTimeout(() => {
        isProcessingAction = false;
    }, 1000);
}

// Auto-gain XP for terminal usage - MODIFIED: No notification for duplicate terminal usage
function setupXPTracking() {
    if (typeof TerminalGame === 'undefined') return;
    
    const originalProcessCommand = TerminalGame.prototype.processCommand;
    TerminalGame.prototype.processCommand = function(cmd) {
        const result = originalProcessCommand.call(this, cmd);
        
        // Award XP for terminal usage (excluding help and clear commands)
        if (cmd.trim() && !cmd.includes('help') && !cmd.includes('clear')) {
            setTimeout(() => {
                const today = new Date().toDateString();
                // Only award XP if terminal hasn't been used today
                if (xpState.actions['terminal'] !== today) {
                    gainXP('terminal');
                }
            }, 100);
        }
        
        return result;
    };
}

// Confetti effect for level up
function triggerConfetti() {
    const confettiCount = 50;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 2px;
                z-index: 9999;
                pointer-events: none;
                animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 20);
    }
}

// Add confetti animation to CSS
function addConfettiStyles() {
    if (!document.querySelector('#confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// FIXED: Event Functions - No more double notification
function joinEvent(event) {
    // Use custom message to combine both notifications into one
    const eventMessages = {
        'halloween': '🎃 Joined Halloween event! +25 XP gained!',
        'christmas': '🎄 Joined Christmas event! +25 XP gained!'
    };
    
    gainXP('game', eventMessages[event] || `Joined ${event} event! +25 XP gained!`);
}

function viewChallenges(event) {
    let title = '';
    let content = '';
    
    if (event === 'halloween') {
        title = '🎃 Halloween Challenges';
        content = `
            <div class="challenge-list">
                <div class="challenge-item">
                    <h4>Spooky CSS Animation</h4>
                    <p>Create a Halloween-themed CSS animation with ghosts, pumpkins, or bats.</p>
                    <span class="challenge-status status-completed">Completed</span>
                </div>
                <div class="challenge-item">
                    <h4>Ghostly JavaScript Game</h4>
                    <p>Build a mini-game where players catch ghosts in a haunted house.</p>
                    <span class="challenge-status status-in-progress">In Progress</span>
                </div>
                <div class="challenge-item">
                    <h4>Dark Mode Toggle</h4>
                    <p>Implement a spooky dark mode theme for your website.</p>
                    <span class="challenge-status status-completed">Completed</span>
                </div>
                <div class="challenge-item">
                    <h4>Trick-or-Treat Simulator</h4>
                    <p>Create a fun simulator where users can go trick-or-treating.</p>
                    <span class="challenge-status status-not-started">Not Started</span>
                </div>
            </div>
        `;
    } else if (event === 'christmas') {
        title = '🎄 Christmas Projects';
        content = `
            <div class="project-list">
                <div class="project-item">
                    <h4>Christmas Countdown Timer</h4>
                    <p>Build an interactive countdown timer showing days until Christmas.</p>
                    <span class="project-status status-in-progress">In Progress</span>
                </div>
                <div class="project-item">
                    <h4>Snow Animation with CSS/JS</h4>
                    <p>Create realistic falling snow animation for your website.</p>
                    <span class="project-status status-not-started">Not Started</span>
                </div>
                <div class="project-item">
                    <h4>Gift Exchange App</h4>
                    <p>Develop an app that helps organize gift exchanges among friends.</p>
                    <span class="project-status status-not-started">Not Started</span>
                </div>
            </div>
        `;
    }
    
    openModal(title, content);
}

// Modal functions
function openModal(title, content) {
    const modal = document.getElementById('challenges-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    if (modal && modalTitle && modalContent) {
        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('challenges-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize XP system when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadXPState();
    setupXPTracking();
    addConfettiStyles();
    addNotificationStyles();
    
    // Auto-gain XP for first visit
    const firstVisit = !localStorage.getItem('firstVisitXP');
    if (firstVisit) {
        localStorage.setItem('firstVisitXP', 'true');
        setTimeout(() => {
            gainXP('visit', '🎊 Welcome! +10 XP for your first visit!');
        }, 2000);
    }
});

// Reset XP system (for testing)
function resetXP() {
    if (confirm('Are you sure you want to reset your XP? This cannot be undone!')) {
        xpState = {
            currentXP: 0,
            totalXP: 100,
            level: 0,
            actions: {},
            lastReset: new Date().toDateString()
        };
        localStorage.removeItem('xpState');
        localStorage.removeItem('firstVisitXP');
        updateXPDisplay();
        showNotification('XP system has been reset! Starting from Level 0.', 'info');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('challenges-modal');
    if (event.target === modal) {
        closeModal();
    }
});