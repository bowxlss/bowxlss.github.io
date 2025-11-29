// dashboard.js - Progress dashboard functionality

// Update progress dashboard
function updateProgressDashboard() {
    updateDashboardStats();
    updateDailyGoals();
    updateAchievementsPreview();
}

// Update dashboard statistics
function updateDashboardStats() {
    const currentLevel = document.getElementById('current-level');
    const totalXp = document.getElementById('total-xp');
    const dayStreak = document.getElementById('day-streak');
    const achievementsCount = document.getElementById('achievements-count');
    
    if (currentLevel) currentLevel.textContent = xpState.level;
    if (totalXp) totalXp.textContent = calculateTotalXP();
    if (dayStreak) dayStreak.textContent = checkDailyStreak();
    if (achievementsCount) achievementsCount.textContent = Object.keys(userAchievements).length;
}

// Update daily goals
function updateDailyGoals() {
    const goalsContainer = document.getElementById('daily-goals');
    if (!goalsContainer) return;
    
    const today = new Date().toDateString();
    const goals = [
        { 
            action: 'terminal', 
            target: 3, 
            current: xpState.actions['terminal'] === today ? 1 : 0, 
            xp: 15,
            text: 'Use Terminal' 
        },
        { 
            action: 'game', 
            target: 1, 
            current: xpState.actions['game'] === today ? 1 : 0, 
            xp: 25,
            text: 'Play Game' 
        },
        { 
            action: 'social', 
            target: 1, 
            current: xpState.actions['social'] === today ? 1 : 0, 
            xp: 30,
            text: 'Share Profile' 
        },
        { 
            action: 'visit', 
            target: 1, 
            current: xpState.actions['visit'] === today ? 1 : 0, 
            xp: 10,
            text: 'Daily Visit' 
        }
    ];
    
    let html = '';
    goals.forEach(goal => {
        const completed = goal.current >= goal.target;
        html += `
            <div class="goal-item ${completed ? 'completed' : ''}">
                <span class="goal-text">${goal.text}: ${goal.current}/${goal.target}</span>
                <span class="goal-xp">+${goal.xp} XP</span>
            </div>
        `;
    });
    
    goalsContainer.innerHTML = html;
}

// Update achievements preview
function updateAchievementsPreview() {
    const previewContainer = document.getElementById('achievements-preview');
    if (!previewContainer) return;
    
    // Get recent achievements (last 3 unlocked)
    const unlockedAchievements = Object.keys(userAchievements)
        .filter(id => userAchievements[id])
        .slice(-3)
        .reverse();
    
    let html = '';
    if (unlockedAchievements.length > 0) {
        unlockedAchievements.forEach(id => {
            const achievement = achievements[id];
            html += `
                <div class="achievement-preview-item">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.desc}</p>
                    </div>
                </div>
            `;
        });
    } else {
        html = '<p style="text-align: center; opacity: 0.7;">No achievements yet. Keep exploring!</p>';
    }
    
    previewContainer.innerHTML = html;
}

// Daily login streak system
function checkDailyStreak() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    const streak = parseInt(localStorage.getItem('loginStreak')) || 0;
    
    if (!lastVisit) {
        // First visit
        localStorage.setItem('loginStreak', '1');
        localStorage.setItem('lastVisit', today);
        return 1;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastVisit === today) {
        return streak; // Already visited today
    } else if (lastVisit === yesterday.toDateString()) {
        // Consecutive day
        const newStreak = streak + 1;
        localStorage.setItem('loginStreak', newStreak.toString());
        localStorage.setItem('lastVisit', today);
        
        if (newStreak % 5 === 0) {
            showNotification(`🔥 ${newStreak} day streak! Bonus +25 XP!`, 'success');
            enhancedGainXP('streak', 25);
        }
        
        return newStreak;
    } else {
        // Streak broken
        localStorage.setItem('loginStreak', '1');
        localStorage.setItem('lastVisit', today);
        return 1;
    }
}

// Social sharing functionality
function shareProgress() {
    const message = `I'm Level ${xpState.level} Developer with ${calculateTotalXP()} XP on Bowxlss's portfolio! 🚀 Check it out: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Coding Progress',
            text: message,
            url: window.location.href
        }).then(() => {
            enhancedGainXP('social');
        }).catch(() => {
            // Fallback to clipboard
            copyToClipboard(message);
        });
    } else {
        // Fallback to clipboard
        copyToClipboard(message);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Progress copied to clipboard! 📋', 'success');
        enhancedGainXP('social');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'info');
    });
}

function joinCommunity() {
    showNotification('Join our Discord community! 🎉', 'success');
    // In a real implementation, this would open a Discord invite link
    setTimeout(() => {
        window.open('https://discord.com/users/bowxlss', '_blank');
    }, 1000);
}

function viewLeaderboard() {
    // Panggil fungsi leaderboard yang baru
    if (typeof globalLeaderboard !== 'undefined') {
        viewLeaderboard();
    } else {
        showNotification('Leaderboard is loading...', 'info');
        setTimeout(() => {
            if (typeof globalLeaderboard !== 'undefined') {
                viewLeaderboard();
            } else {
                showNotification('Leaderboard system ready!', 'success');
                // Reload leaderboard
                setTimeout(viewLeaderboard, 1000);
            }
        }, 1000);
    }
}

// Floating text effect
function createFloatingText(text, x, y, color = '#00ff00') {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;
    floatingText.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        color: ${color};
    `;
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        floatingText.remove();
    }, 1500);
}

// Enhanced XP gain with floating text
function enhancedGainXP(action, customMessage = null, customPoints = null) {
    const xpDisplay = document.querySelector('.xp-points');
    if (xpDisplay) {
        const rect = xpDisplay.getBoundingClientRect();
        const points = customPoints || {
            'visit': 10, 'terminal': 15, 'game': 25, 'social': 30,
            'achievement': customPoints, 'streak': customPoints
        }[action];
        
        if (points) {
            createFloatingText(`+${points} XP`, rect.left + 50, rect.top - 20, '#00ff00');
        }
    }
    
    // Check achievements
    checkAchievements(action);
    
    // Update dashboard
    updateProgressDashboard();
    
    // Continue with original gainXP
    gainXP(action, customMessage);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateProgressDashboard();
    
    // Update dashboard every minute for real-time features
    setInterval(updateProgressDashboard, 60000);
});