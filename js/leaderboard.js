// leaderboard.js - Global leaderboard system (FIXED VERSION)

class Leaderboard {
    constructor() {
        this.players = [];
        this.loadLeaderboard();
    }

    // Load leaderboard from localStorage
    loadLeaderboard() {
        const saved = localStorage.getItem('globalLeaderboard');
        if (saved) {
            this.players = JSON.parse(saved);
        } else {
            // Initialize with some demo data
            this.players = [
                { id: 'bowxlss', name: 'bowxlss', level: 15, xp: 1250, country: 'ID', avatar: '🚀' },
                { id: 'coder_pro', name: 'CoderPro', level: 12, xp: 980, country: 'US', avatar: '💻' },
                { id: 'dev_guru', name: 'DevGuru', level: 11, xp: 850, country: 'UK', avatar: '🎯' },
                { id: 'tech_ninja', name: 'TechNinja', level: 10, xp: 720, country: 'JP', avatar: '🥷' },
                { id: 'web_wizard', name: 'WebWizard', level: 9, xp: 650, country: 'CA', avatar: '🧙' },
                { id: 'code_master', name: 'CodeMaster', level: 8, xp: 580, country: 'DE', avatar: '👨‍💻' },
                { id: 'byte_bender', name: 'ByteBender', level: 7, xp: 490, country: 'FR', avatar: '⚡' },
                { id: 'script_kid', name: 'ScriptKid', level: 6, xp: 420, country: 'BR', avatar: '🤓' },
                { id: 'debug_king', name: 'DebugKing', level: 5, xp: 350, country: 'IN', avatar: '🐛' },
                { id: 'lambda_hero', name: 'LambdaHero', level: 4, xp: 280, country: 'AU', avatar: 'λ' }
            ];
            this.saveLeaderboard();
        }
    }

    // Save leaderboard to localStorage
    saveLeaderboard() {
        localStorage.setItem('globalLeaderboard', JSON.stringify(this.players));
    }

    // Add or update current user in leaderboard
    updateCurrentUser() {
        const currentUser = {
            id: 'current_user',
            name: 'You',
            level: window.xpState ? window.xpState.level : 0,
            xp: window.calculateTotalXP ? window.calculateTotalXP() : 0,
            country: 'ID',
            avatar: '⭐',
            isCurrentUser: true
        };

        // Remove existing current user
        this.players = this.players.filter(player => player.id !== 'current_user');
        
        // Add current user
        this.players.push(currentUser);
        
        // Sort by XP (descending)
        this.players.sort((a, b) => b.xp - a.xp);
        
        this.saveLeaderboard();
    }

    // Get top players
    getTopPlayers(limit = 10) {
        return this.players.slice(0, limit);
    }

    // Get user rank
    getUserRank(userId = 'current_user') {
        const userIndex = this.players.findIndex(player => player.id === userId);
        return userIndex !== -1 ? userIndex + 1 : null;
    }

    // Get user position with surrounding players
    getUserPosition(userId = 'current_user', context = 2) {
        const userIndex = this.players.findIndex(player => player.id === userId);
        if (userIndex === -1) return null;

        const start = Math.max(0, userIndex - context);
        const end = Math.min(this.players.length, userIndex + context + 1);
        
        return {
            players: this.players.slice(start, end),
            userIndex: userIndex,
            userRank: userIndex + 1,
            totalPlayers: this.players.length
        };
    }

    // Add random activity to make leaderboard dynamic
    simulateActivity() {
        // Randomly update some players' XP
        this.players.forEach(player => {
            if (player.id !== 'current_user' && Math.random() > 0.7) {
                player.xp += Math.floor(Math.random() * 50) + 10;
                player.level = Math.floor(player.xp / 100) + 1;
            }
        });
        
        // Re-sort
        this.players.sort((a, b) => b.xp - a.xp);
        this.saveLeaderboard();
    }
}

// Initialize global leaderboard
const globalLeaderboard = new Leaderboard();

// Leaderboard UI functions
function viewLeaderboard() {
    globalLeaderboard.updateCurrentUser();
    
    const title = '🏆 Global Leaderboard';
    const content = generateLeaderboardContent();
    
    openModal(title, content);
}

function generateLeaderboardContent() {
    globalLeaderboard.updateCurrentUser();
    const userPosition = globalLeaderboard.getUserPosition('current_user', 2);
    
    if (!userPosition) {
        return '<p>Error loading leaderboard</p>';
    }

    let html = `
        <div class="leaderboard-container">
            <div class="leaderboard-header">
                <div class="total-players">Total Developers: ${userPosition.totalPlayers}</div>
                <div class="last-updated">Updated: Just now</div>
            </div>
            
            <div class="leaderboard-top">
                <h4>🏅 Top Developers</h4>
                <div class="top-players">
    `;

    // Top 3 players with special styling
    const topPlayers = globalLeaderboard.getTopPlayers(3);
    topPlayers.forEach((player, index) => {
        const rankClass = index === 0 ? 'first' : index === 1 ? 'second' : 'third';
        html += `
            <div class="top-player ${rankClass} ${player.isCurrentUser ? 'current-user' : ''}">
                <div class="player-rank">${index + 1}</div>
                <div class="player-avatar">${player.avatar}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-stats">
                        <span class="player-level">Level ${player.level}</span>
                        <span class="player-xp">${player.xp} XP</span>
                    </div>
                </div>
                <div class="player-country">${getCountryFlag(player.country)}</div>
            </div>
        `;
    });

    html += `
                </div>
            </div>
            
            <div class="leaderboard-main">
                <h4>📊 Your Position</h4>
                <div class="player-list">
    `;

    // Show user's position with context
    userPosition.players.forEach((player, index) => {
        const actualIndex = userPosition.userIndex - (userPosition.userIndex - index);
        const isCurrentUser = player.isCurrentUser;
        
        html += `
            <div class="leaderboard-player ${isCurrentUser ? 'current-user-highlight' : ''}">
                <div class="player-rank">${userPosition.userIndex - (userPosition.userIndex - index) + 1}</div>
                <div class="player-avatar">${player.avatar}</div>
                <div class="player-info">
                    <div class="player-name">${player.name} ${isCurrentUser ? '(You)' : ''}</div>
                    <div class="player-stats">
                        <span class="player-level">Level ${player.level}</span>
                        <span class="player-xp">${player.xp} XP</span>
                    </div>
                </div>
                <div class="player-country">${getCountryFlag(player.country)}</div>
                <div class="player-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(player.xp % 100)}%"></div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
                </div>
            </div>
            
            <div class="leaderboard-stats">
                <div class="stat-card">
                    <div class="stat-value">${userPosition.userRank}</div>
                    <div class="stat-label">Your Rank</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.max(...globalLeaderboard.players.map(p => p.level))}</div>
                    <div class="stat-label">Highest Level</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.max(...globalLeaderboard.players.map(p => p.xp))}</div>
                    <div class="stat-label">Max XP</div>
                </div>
            </div>
            
            <div class="leaderboard-actions">
                <button class="action-btn" onclick="refreshLeaderboard()">🔄 Refresh</button>
                <button class="action-btn" onclick="shareLeaderboard()">📢 Share</button>
                <button class="action-btn" onclick="simulateLeaderboard()">🎮 Simulate Activity</button>
            </div>
        </div>
    `;

    return html;
}

function getCountryFlag(countryCode) {
    const flagMap = {
        'ID': '🇮🇩', 'US': '🇺🇸', 'UK': '🇬🇧', 'JP': '🇯🇵', 'CA': '🇨🇦',
        'DE': '🇩🇪', 'FR': '🇫🇷', 'BR': '🇧🇷', 'IN': '🇮🇳', 'AU': '🇦🇺'
    };
    return flagMap[countryCode] || '🌐';
}

// FIXED: Prevent multiple refresh calls
let isRefreshing = false;

function refreshLeaderboard() {
    if (isRefreshing) return;
    
    isRefreshing = true;
    globalLeaderboard.updateCurrentUser();
    const content = generateLeaderboardContent();
    document.getElementById('modal-content').innerHTML = content;
    
    // Show notification only if not called from simulateLeaderboard
    if (!window.simulateActivityInProgress) {
        showNotification('Leaderboard updated!', 'success');
    }
    
    setTimeout(() => {
        isRefreshing = false;
    }, 500);
}

function shareLeaderboard() {
    const userRank = globalLeaderboard.getUserRank('current_user');
    const currentLevel = window.xpState ? window.xpState.level : 0;
    const totalXP = window.calculateTotalXP ? window.calculateTotalXP() : 0;
    const message = `🏆 I'm ranked #${userRank} on the Global Developer Leaderboard! Level ${currentLevel} with ${totalXP} XP. Can you beat me? ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Developer Leaderboard',
            text: message,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(message);
        showNotification('Leaderboard rank copied to clipboard!', 'success');
    }
}

// FIXED: Prevent multiple simulate calls
let simulateActivityInProgress = false;

function simulateLeaderboard() {
    if (simulateActivityInProgress) return;
    
    simulateActivityInProgress = true;
    globalLeaderboard.simulateActivity();
    refreshLeaderboard();
    
    // Show notification after a delay to avoid conflict with refresh notification
    setTimeout(() => {
        showNotification('Simulated leaderboard activity!', 'success');
        simulateActivityInProgress = false;
    }, 600);
}

// Update leaderboard when user gains XP
function updateLeaderboardOnXP() {
    setTimeout(() => {
        globalLeaderboard.updateCurrentUser();
    }, 1000);
}

// Initialize leaderboard
document.addEventListener('DOMContentLoaded', function() {
    // Update leaderboard every 30 seconds for live feel
    setInterval(() => {
        globalLeaderboard.simulateActivity();
    }, 30000);
    
    // Initial update
    globalLeaderboard.updateCurrentUser();
});