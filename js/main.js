// main.js - Main initialization and common functionality

// Utility function for notifications
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? 'rgba(34,197,94,0.9)' : 'rgba(59,130,246,0.9)'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Modal Functions
function openModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('challenges-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('challenges-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('challenges-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Time Greeting Function
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.getElementById('time-greeting');
    const messageElement = document.getElementById('greeting-message');
    
    let greeting, message;
    
    if (hour >= 5 && hour < 12) {
        greeting = '🌅 Good Morning!';
        message = 'Perfect time for some coding and chill vibes!';
    } else if (hour >= 12 && hour < 18) {
        greeting = '☀️ Good Afternoon!';
        message = 'Hope you\'re having a productive day!';
    } else if (hour >= 18 && hour < 22) {
        greeting = '🌙 Good Evening!';
        message = 'Great time for gaming and relaxation!';
    } else {
        greeting = '🌌 Hello Night Owl!';
        message = 'The world is quiet, perfect for deep work!';
    }
    
    if (greetingElement) {
        greetingElement.innerHTML = greeting;
        messageElement.textContent = message;
    }
}

// Typing Animation
const typingText = `Hi, I'm Bow — a non-competitive gamer who enjoys games as a space to unwind, stay relaxed, and enjoy the experience without unnecessary pressure. I value balance, mindset, and the idea that gaming should be fun, engaging, and stress-free.

Outside of gaming, I'm currently exploring coding and web development. This website is my first personal project, built as a learning experience and a foundation for my growth in front-end development. I'm continuously improving through hands-on practice, experimentation, and curiosity in creating intuitive web experiences. ✨`;

function typeWriter() {
    let i = 0;
    const speed = 20;
    const textElement = document.getElementById("typing-text");
    
    if (!textElement) return;
    
    function type() {
        if (i < typingText.length) {
            if (typingText.charAt(i) === '\n') {
                textElement.innerHTML += '<br>';
            } else {
                textElement.innerHTML += typingText.charAt(i);
            }
            i++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                const cursor = document.querySelector('.typing-cursor');
                if (cursor) cursor.style.display = 'none';
            }, 1000);
        }
    }
    
    setTimeout(type, 800);
}

// Live Stats Counter Animation
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Counter animation function
function animateCounterElement(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const current = parseInt(element.textContent) || 0;
    const increment = Math.ceil((target - current) / 20);
    let currentValue = current;
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if (target > 1000) {
            element.textContent = Math.min(currentValue, target).toLocaleString();
        } else {
            element.textContent = Math.min(currentValue, target);
        }
        
        if (currentValue >= target) {
            clearInterval(timer);
            element.textContent = target > 1000 ? target.toLocaleString() : target;
        }
    }, 50);
}

// Skill Progress Animation on Scroll
function initializeSkillAnimation() {
    const skillElements = document.querySelectorAll('.skill');
    
    if (skillElements.length === 0) return;
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('skill-animated');
                }, 200);
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    skillElements.forEach(skill => {
        skillObserver.observe(skill);
    });
}

// GitHub API Integration
function initializeGitHubIntegration() {
    // Only run on second.html
    if (!document.getElementById('public-repos')) return;
    
    loadGitHubStats();
    loadGitHubRepos();
}

function loadGitHubStats() {
    const publicReposEl = document.getElementById('public-repos');
    const followersEl = document.getElementById('followers');
    const followingEl = document.getElementById('following');
    const totalStarsEl = document.getElementById('total-stars');
    
    // Show loading state
    [publicReposEl, followersEl, followingEl, totalStarsEl].forEach(el => {
        if (el) el.innerHTML = '<span class="github-loading"></span>';
    });
    
    fetch('https://api.github.com/users/bowxlss')
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(userData => {
            // Update user stats
            if (publicReposEl) publicReposEl.textContent = userData.public_repos || 0;
            if (followersEl) followersEl.textContent = userData.followers || 0;
            if (followingEl) followingEl.textContent = userData.following || 0;
            
            // Load repositories to calculate total stars
            return fetch('https://api.github.com/users/bowxlss/repos?per_page=100');
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(repos => {
            // Calculate total stars
            const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
            if (totalStarsEl) totalStarsEl.textContent = totalStars;
            
            // Update coding activity stats
            updateCodingActivityStats();
        })
        .catch(error => {
            console.error('Error loading GitHub stats:', error);
            handleGitHubError(error);
        });
}

function loadGitHubRepos() {
    const reposListEl = document.getElementById('github-repos-list');
    const statusEl = document.getElementById('github-repos-status');
    
    if (!reposListEl || !statusEl) return;
    
    // Show loading state
    reposListEl.innerHTML = '';
    statusEl.textContent = 'Loading repositories...';
    statusEl.style.display = 'block';
    
    fetch('https://api.github.com/users/bowxlss/repos?sort=updated&direction=desc&per_page=6')
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(repos => {
            statusEl.style.display = 'none';
            
            if (repos.length === 0) {
                reposListEl.innerHTML = '<div class="github-error">No repositories found.</div>';
                return;
            }
            
            // Display repositories
            reposListEl.innerHTML = repos.map(repo => `
                <div class="github-repo-item">
                    <div class="repo-header">
                        <h3 class="repo-name">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </h3>
                        <div class="repo-stats">
                            <div class="repo-stat" title="Stars">
                                <i class="fas fa-star"></i> ${repo.stargazers_count || 0}
                            </div>
                            <div class="repo-stat" title="Forks">
                                <i class="fas fa-code-branch"></i> ${repo.forks_count || 0}
                            </div>
                        </div>
                    </div>
                    <div class="repo-description">
                        ${repo.description || 'No description provided.'}
                    </div>
                    <div class="repo-meta">
                        <div class="repo-language">
                            ${repo.language ? `
                                <span class="language-color" style="background-color: ${getLanguageColor(repo.language)}"></span>
                                ${repo.language}
                            ` : ''}
                        </div>
                        <div class="repo-updated">
                            Updated ${formatDate(repo.updated_at)}
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error loading GitHub repositories:', error);
            statusEl.style.display = 'block';
            statusEl.innerHTML = `<div class="github-error">Failed to load repositories: ${error.message}</div>`;
        });
}

function updateCodingActivityStats() {
    const totalCommitsEl = document.getElementById('total-commits');
    const lastActiveEl = document.getElementById('last-active');
    const accountAgeEl = document.getElementById('account-age');
    
    if (!totalCommitsEl || !lastActiveEl || !accountAgeEl) return;
    
    // For now, we'll use placeholder values as GitHub API doesn't provide easy access to total commits
    // In a real implementation, you might use the GitHub Events API or a third-party service
    fetch('https://api.github.com/users/bowxlss/events?per_page=100')
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(events => {
            // Calculate approximate commit count (this is a rough estimate)
            const pushEvents = events.filter(event => event.type === 'PushEvent');
            const commitCount = pushEvents.reduce((sum, event) => sum + (event.payload.size || 0), 0);
            
            if (totalCommitsEl) totalCommitsEl.textContent = commitCount > 0 ? commitCount : 'N/A';
            
            // Get last active date
            if (events.length > 0 && lastActiveEl) {
                const lastEvent = events[0];
                lastActiveEl.textContent = formatDate(lastEvent.created_at, true);
            }
        })
        .catch(error => {
            console.error('Error loading GitHub activity:', error);
            if (totalCommitsEl) totalCommitsEl.textContent = 'N/A';
        });
    
    // Get account creation date
    fetch('https://api.github.com/users/bowxlss')
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(userData => {
            if (userData.created_at && accountAgeEl) {
                const created = new Date(userData.created_at);
                const now = new Date();
                const diffTime = Math.abs(now - created);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const years = Math.floor(diffDays / 365);
                const months = Math.floor((diffDays % 365) / 30);
                
                accountAgeEl.textContent = `${years}y ${months}m`;
            }
        })
        .catch(error => {
            console.error('Error loading GitHub user data:', error);
            if (accountAgeEl) accountAgeEl.textContent = 'N/A';
        });
}

function handleGitHubError(error) {
    // Handle specific GitHub API errors
    if (error.message.includes('403')) {
        showNotification('GitHub API rate limit exceeded. Please try again later.', 'error');
    } else if (error.message.includes('404')) {
        showNotification('GitHub user not found.', 'error');
    } else {
        showNotification('Failed to load GitHub data. Please check your connection.', 'error');
    }
}

// Utility functions
function formatDate(dateString, short = false) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (short) {
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'PHP': '#4F5D95',
        'C++': '#f34b7d',
        'C#': '#178600',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Shell': '#89e051'
    };
    
    return colors[language] || '#6c757d';
}

// Main initialization
document.addEventListener("DOMContentLoaded", function(){
    console.log("DOM loaded successfully");
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            disable: 'mobile'
        });
    } else {
        console.log("AOS not loaded");
    }
    
    // Initialize particles dengan error handling
    if (typeof particlesJS !== 'undefined') {
        const isMobile = window.innerWidth <= 600;
        particlesJS('particles-js', {
            particles: {
                number: { value: isMobile ? 30 : 60 },
                color: { value: "#ff00ff" },
                shape: { type: "circle" },
                opacity: { value: 0.6, random: true },
                size: { value: 2, random: true },
                line_linked: { enable: false },
                move: { enable: true, speed: 0.4 }
            }
        });
    } else {
        console.log("ParticlesJS not loaded");
    }
    
    // Initialize XP System
    if (typeof loadXPState === 'function') {
        loadXPState();
    }
    
    // Setup XP tracking for terminal
    if (typeof setupXPTracking === 'function') {
        setupXPTracking();
    }
    
    // Initialize Terminal Game
    if (typeof TerminalGame === 'function') {
        window.terminalGame = new TerminalGame();
    }
    
    // Initialize Skill Animation
    initializeSkillAnimation();
    
    // Initialize GitHub API Integration
    initializeGitHubIntegration();
    
    // Improved Theme Toggle with Smooth Transition & Local Storage
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        themeIcon.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click',() => {
        document.body.style.transition = 'all 0.5s ease';
        document.body.classList.toggle('light');
        
        // Update icon
        themeIcon.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
    
    // Initialize greeting
    updateGreeting();
    setInterval(updateGreeting, 60000);
    
    // Optimize video playback
    const video = document.getElementById('video-bg');
    if(video){
        const isMobile = window.innerWidth <= 600;
        if(isMobile){
            video.playbackRate = 0.8;
            video.muted = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
        } else {
            video.playbackRate = 1;
        }
        
        if(navigator.connection && (navigator.connection.effectiveType === '2g' || navigator.connection.saveData)){
            video.style.display = 'none';
        }
    }
    
    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Observe stats section for animation
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Initialize additional features
    if (typeof initializeVisitorMap === 'function') {
        initializeVisitorMap();
    }
    if (typeof updateVisitorStats === 'function') {
        updateVisitorStats();
    }
    if (typeof updateLiveCodingStats === 'function') {
        updateLiveCodingStats();
    }
    if (typeof updateCountdowns === 'function') {
        updateCountdowns();
    }
    
    // Set up intervals for dynamic content
    setInterval(() => {
        if (typeof updateCountdowns === 'function') updateCountdowns();
    }, 60000);
    setInterval(() => {
        if (typeof animateLiveCoding === 'function') animateLiveCoding();
    }, 5000);
    setInterval(() => {
        if (typeof updateVisitorStats === 'function') updateVisitorStats();
    }, 30000);
    setInterval(() => {
        if (typeof updateLiveCodingStats === 'function') updateLiveCodingStats();
    }, 15000);
    
    // Chat input enter key support
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (typeof sendMessage === 'function') sendMessage();
            }
        });
    }

    // Hide loading screen when page is fully loaded and start typing
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.opacity = '0';
                setTimeout(() => {
                    loadingElement.style.display = 'none';
                    typeWriter();
                    window.scrollTo(0, 0);
                }, 500);
            }
        }, 1000);
    });
    
    // Mobile optimizations
    if (window.innerWidth <= 600) {
        document.body.style.setProperty('--animation-duration', '0.5s');
    }
});

// Fallback jika DOMContentLoaded tidak terpicu
window.addEventListener('load', function() {
    console.log("Window fully loaded");
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
});

// Emergency fallback - hide loading setelah timeout
setTimeout(function() {
    const loading = document.getElementById('loading');
    if (loading && loading.style.display !== 'none') {
        console.log("Force hiding loading screen after timeout");
        loading.style.display = 'none';
    }
}, 5000);