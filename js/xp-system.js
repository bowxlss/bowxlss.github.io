// xp-system.js - XP and achievement system

// XP System State Management
let xpState = {
    currentXP: 1250,
    totalXP: 2000,
    level: 7,
    actions: {}
};

// Load XP state from localStorage
function loadXPState() {
    const saved = localStorage.getItem('xpState');
    if (saved) {
        xpState = JSON.parse(saved);
    }
    updateXPDisplay();
}

// Save XP state to localStorage
function saveXPState() {
    localStorage.setItem('xpState', JSON.stringify(xpState));
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
        const percentage = (xpState.currentXP / xpState.totalXP) * 100;
        xpProgress.style.width = `${percentage}%`;
    }
}

// FIXED XP System Functionality
function gainXP(action) {
    const xpValues = {
        'visit': 10,
        'terminal': 15,
        'game': 25,
        'social': 30
    };

    const points = xpValues[action];
    if (!points) return;

    // Check if action was already performed today
    const today = new Date().toDateString();
    if (xpState.actions[action] === today) {
        showNotification(`You already earned XP for ${action} today!`, 'info');
        return;
    }

    // Add XP
    xpState.currentXP += points;
    xpState.actions[action] = today;

    // Check for level up
    if (xpState.currentXP >= xpState.totalXP) {
        xpState.level++;
        xpState.currentXP = xpState.currentXP - xpState.totalXP;
        xpState.totalXP = Math.floor(xpState.totalXP * 1.2);
        showNotification(`🎉 Level Up! You are now Level ${xpState.level}`, 'success');
    }

    // Update display and save
    updateXPDisplay();
    saveXPState();
    showNotification(`+${points} XP gained for ${action}!`, 'success');

    // Visual feedback
    const xpProgress = document.querySelector('.xp-progress');
    if (xpProgress) {
        xpProgress.style.transition = 'width 0.5s ease';
        setTimeout(() => {
            xpProgress.style.transition = 'width 2s ease-in-out';
        }, 500);
    }
}

// Auto-gain XP for terminal usage
function setupXPTracking() {
    if (typeof TerminalGame === 'undefined') return;
    
    const originalProcessCommand = TerminalGame.prototype.processCommand;
    TerminalGame.prototype.processCommand = function(cmd) {
        const result = originalProcessCommand.call(this, cmd);
        
        // Award XP for terminal usage (excluding help and clear commands)
        if (!cmd.includes('help') && !cmd.includes('clear')) {
            setTimeout(() => gainXP('terminal'), 100);
        }
        
        return result;
    };
}

// Event Functions
function joinEvent(event) {
    showNotification(`Joined ${event} event! 🎉`, 'success');
    gainXP('game');
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