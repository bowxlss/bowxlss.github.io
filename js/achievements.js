// achievements.js - Achievement system for portfolio

const achievements = {
    first_visit: { 
        name: "Welcome!", 
        desc: "Visit the website for the first time",
        icon: "🚀",
        xp: 10
    },
    terminal_master: { 
        name: "Terminal Master", 
        desc: "Use terminal 10 times",
        icon: "💻",
        xp: 50,
        target: 10
    },
    level_5: { 
        name: "Rising Star", 
        desc: "Reach Level 5",
        icon: "⭐",
        xp: 100
    },
    daily_streak: { 
        name: "Consistent Coder", 
        desc: "Visit 5 days in a row",
        icon: "🔥",
        xp: 75,
        target: 5
    },
    game_completed: { 
        name: "Game Champion", 
        desc: "Complete a game challenge",
        icon: "🎮",
        xp: 30
    },
    social_butterfly: {
        name: "Social Butterfly",
        desc: "Share your progress 3 times",
        icon: "📱",
        xp: 40,
        target: 3
    },
    code_enthusiast: {
        name: "Code Enthusiast",
        desc: "Write 100 lines of code",
        icon: "💻",
        xp: 60,
        target: 100
    },
    bug_hunter: {
        name: "Bug Hunter",
        desc: "Fix 5 bugs in the terminal",
        icon: "🐛",
        xp: 45,
        target: 5
    }
};

let userAchievements = {};

// Load achievements from localStorage
function loadAchievements() {
    const saved = localStorage.getItem('userAchievements');
    if (saved) {
        userAchievements = JSON.parse(saved);
    }
    renderAchievements();
}

// Save achievements to localStorage
function saveAchievements() {
    localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
}

// Check achievements based on user actions
function checkAchievements(action, count = 1) {
    const today = new Date().toDateString();
    
    for (let id in achievements) {
        if (userAchievements[id]) continue; // Already unlocked
        
        let unlocked = false;
        const achievement = achievements[id];
        
        switch(id) {
            case 'first_visit':
                if (action === 'visit') unlocked = true;
                break;
            case 'terminal_master':
                if (action === 'terminal') {
                    const terminalCount = getUserActionCount('terminal');
                    unlocked = terminalCount >= achievement.target;
                }
                break;
            case 'level_5':
                if (xpState.level >= 5) unlocked = true;
                break;
            case 'daily_streak':
                if (checkDailyStreak() >= achievement.target) unlocked = true;
                break;
            case 'game_completed':
                if (action === 'game') unlocked = true;
                break;
            case 'social_butterfly':
                if (action === 'social') {
                    const socialCount = getUserActionCount('social');
                    unlocked = socialCount >= achievement.target;
                }
                break;
        }
        
        if (unlocked) {
            unlockAchievement(id);
        }
    }
}

// Unlock achievement
function unlockAchievement(achievementId) {
    userAchievements[achievementId] = {
        unlocked: true,
        date: new Date().toISOString()
    };
    
    const achievement = achievements[achievementId];
    showNotification(`🏆 Achievement Unlocked: ${achievement.name} - ${achievement.desc} +${achievement.xp} XP`, 'success');
    
    // Award XP for achievement
    enhancedGainXP('achievement', null, achievement.xp);
    
    saveAchievements();
    renderAchievements();
    updateProgressDashboard();
}

// Render achievements in the container
function renderAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;
    
    let html = '';
    for (let id in achievements) {
        const achievement = achievements[id];
        const unlocked = userAchievements[id];
        
        html += `
            <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon-large">${achievement.icon}</div>
                <div class="achievement-content">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.desc}</p>
                    <span class="achievement-xp-badge">+${achievement.xp} XP</span>
                </div>
                <div class="achievement-status">${unlocked ? '✅' : '🔒'}</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Get user action count for specific action
function getUserActionCount(action) {
    let count = 0;
    const actions = Object.values(xpState.actions);
    for (let date of actions) {
        // Count how many times this action was performed (simplified)
        // In a real implementation, you'd track counts per action
        if (date) count++;
    }
    return Math.min(count, 10); // Cap for demo purposes
}

// Calculate total XP earned
function calculateTotalXP() {
    let total = xpState.currentXP;
    for (let i = 0; i < xpState.level; i++) {
        total += Math.floor(100 * Math.pow(1.5, i));
    }
    return total;
}

// Initialize achievements system
document.addEventListener('DOMContentLoaded', function() {
    loadAchievements();
});