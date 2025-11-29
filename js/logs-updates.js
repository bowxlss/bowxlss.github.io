// Logs Updates Integration with Toggle Button - FIXED VERSION
class LogsUpdates {
    constructor() {
        this.username = 'bowxlss';
        this.repo = 'bowxlss.github.io';
        this.apiUrl = `https://api.github.com/repos/${this.username}/${this.repo}`;
        this.updatesList = document.getElementById('logs-updates-list');
        this.container = document.getElementById('logs-updates-container');
        this.toggleBtn = document.getElementById('toggle-logs-btn');
        this.totalCommitsEl = document.getElementById('total-commits');
        this.lastUpdateEl = document.getElementById('last-update');
        this.repoStarsEl = document.getElementById('repo-stars');
        this.repoForksEl = document.getElementById('repo-forks');
        
        this.isLoaded = false;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        // Add event listener to toggle button
        this.toggleBtn.addEventListener('click', () => {
            this.toggleVisibility();
        });
    }
    
    toggleVisibility() {
        if (!this.isVisible) {
            this.showLogs();
        } else {
            this.hideLogs();
        }
    }
    
    showLogs() {
        this.isVisible = true;
        this.container.style.display = 'block';
        this.toggleBtn.innerHTML = '<i class="fas fa-code-branch"></i> Hide Updates';
        this.toggleBtn.classList.add('active');
        
        if (!this.isLoaded) {
            this.loadData();
        }
    }
    
    hideLogs() {
        this.isVisible = false;
        this.container.style.display = 'none';
        this.toggleBtn.innerHTML = '<i class="fas fa-code-branch"></i> Show Latest Updates';
        this.toggleBtn.classList.remove('active');
    }
    
    async loadData() {
        try {
            await this.loadRepoStats();
            await this.loadRecentCommits();
            this.isLoaded = true;
            this.startAutoRefresh();
        } catch (error) {
            console.error('Error loading logs updates:', error);
            this.showError('Failed to load logs updates');
        }
    }
    
    async loadRepoStats() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch repo data');
            
            const repoData = await response.json();
            
            // Update stats
            this.repoStarsEl.textContent = repoData.stargazers_count || 0;
            this.repoForksEl.textContent = repoData.forks_count || 0;
            
            // Get total commits count
            const commitsResponse = await fetch(`${this.apiUrl}/commits?per_page=1`);
            if (commitsResponse.ok) {
                const linkHeader = commitsResponse.headers.get('Link');
                if (linkHeader) {
                    const totalCommits = this.extractTotalCommits(linkHeader);
                    this.totalCommitsEl.textContent = totalCommits || 0;
                } else {
                    // If no Link header, try to count from the first page
                    const commitsData = await commitsResponse.json();
                    this.totalCommitsEl.textContent = commitsData.length || 0;
                }
            }
            
            // Update last update date - FIXED: Use pushed_at instead of updated_at
            if (repoData.pushed_at) {
                const lastUpdate = new Date(repoData.pushed_at);
                this.lastUpdateEl.textContent = this.formatDate(lastUpdate);
            } else if (repoData.updated_at) {
                const lastUpdate = new Date(repoData.updated_at);
                this.lastUpdateEl.textContent = this.formatDate(lastUpdate);
            }
            
        } catch (error) {
            console.error('Error loading repo stats:', error);
            // Set fallback values
            this.totalCommitsEl.textContent = '0';
            this.lastUpdateEl.textContent = 'Unknown';
            this.repoStarsEl.textContent = '0';
            this.repoForksEl.textContent = '0';
        }
    }
    
    extractTotalCommits(linkHeader) {
        try {
            const matches = linkHeader.match(/page=(\d+)>; rel="last"/);
            return matches ? parseInt(matches[1]) : null;
        } catch (error) {
            console.error('Error extracting total commits:', error);
            return null;
        }
    }
    
    async loadRecentCommits() {
        try {
            const response = await fetch(`${this.apiUrl}/commits?per_page=10`);
            if (!response.ok) throw new Error('Failed to fetch commits');
            
            const commits = await response.json();
            
            if (!commits || commits.length === 0) {
                this.showNoUpdates();
                return;
            }
            
            this.renderCommits(commits);
            
            // FIXED: Update last update with the most recent commit date
            if (commits[0] && commits[0].commit && commits[0].commit.author) {
                const lastCommitDate = new Date(commits[0].commit.author.date);
                this.lastUpdateEl.textContent = this.formatDate(lastCommitDate);
            }
            
        } catch (error) {
            console.error('Error loading recent commits:', error);
            this.showError('Failed to load recent commits');
        }
    }
    
    renderCommits(commits) {
        if (!this.updatesList) return;
        
        let html = '';
        
        commits.forEach(commit => {
            const commitData = commit.commit;
            const author = commitData.author;
            const date = author ? new Date(author.date) : new Date();
            const message = commitData.message;
            const sha = commit.sha.substring(0, 7);
            
            html += `
                <div class="logs-update-item" data-aos="fade-up">
                    <div class="logs-update-header">
                        <div class="logs-update-title">Commit: ${sha}</div>
                        <div class="logs-update-date">${this.formatDate(date)}</div>
                    </div>
                    <div class="logs-update-message">${this.escapeHtml(message)}</div>
                    <div class="logs-update-meta">
                        <span class="logs-update-hash">${sha}</span>
                        <a href="${commit.html_url}" target="_blank" class="logs-update-link">
                            View on GitHub →
                        </a>
                    </div>
                </div>
            `;
        });
        
        this.updatesList.innerHTML = html;
    }
    
    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // FIXED: More accurate date formatting
        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showNoUpdates() {
        if (this.updatesList) {
            this.updatesList.innerHTML = `
                <div class="no-updates">
                    No recent updates found
                </div>
            `;
        }
    }
    
    showError(message) {
        if (this.updatesList) {
            this.updatesList.innerHTML = `
                <div class="no-updates" style="color: #ff6b6b;">
                    ${message}
                </div>
            `;
        }
    }
    
    startAutoRefresh() {
        // Refresh every 5 minutes when logs are visible
        setInterval(() => {
            if (this.isVisible) {
                this.loadRepoStats();
                this.loadRecentCommits();
            }
        }, 5 * 60 * 1000);
    }
}

// Initialize Logs Updates when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LogsUpdates();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LogsUpdates;
}