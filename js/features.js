// features.js - Additional interactive features

// Visitor Map Functionality
function initializeVisitorMap() {
    const mapContainer = document.getElementById('world-map');
    if (!mapContainer) return;
    
    const points = 15;
    
    for (let i = 0; i < points; i++) {
        const point = document.createElement('div');
        point.className = 'map-point';
        point.style.left = Math.random() * 90 + 5 + '%';
        point.style.top = Math.random() * 85 + 5 + '%';
        point.style.animationDelay = (Math.random() * 2) + 's';
        mapContainer.appendChild(point);
    }
}

// Visitor Stats Counter
function updateVisitorStats() {
    const countries = Math.floor(Math.random() * 10) + 42;
    const cities = Math.floor(Math.random() * 20) + 120;
    const visitors = Math.floor(Math.random() * 500) + 1500;
    const online = Math.floor(Math.random() * 10) + 20;
    
    animateCounterElement('countries-count', countries);
    animateCounterElement('cities-count', cities);
    animateCounterElement('visitors-count', visitors);
    animateCounterElement('online-count', online);
}

// Live Coding Stats Update
function updateLiveCodingStats() {
    const linesToday = Math.floor(Math.random() * 50) + 100;
    const codingTime = Math.floor(Math.random() * 60) + 30;
    const bugsFixed = Math.floor(Math.random() * 3) + 1;
    const featuresAdded = Math.floor(Math.random() * 2) + 1;
    
    const linesElement = document.getElementById('lines-today');
    const timeElement = document.getElementById('coding-time');
    const bugsElement = document.getElementById('bugs-fixed');
    const featuresElement = document.getElementById('features-added');
    
    if (linesElement) linesElement.innerHTML = `⌨️ ${linesToday}`;
    if (timeElement) timeElement.innerHTML = `🚀 ${codingTime}min`;
    if (bugsElement) bugsElement.innerHTML = `🐛 ${bugsFixed}`;
    if (featuresElement) featuresElement.innerHTML = `✨ ${featuresAdded}`;
}

// AI Chat Functionality
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            const response = generateAIResponse(message);
            addChatMessage(response, 'bot');
        }, 1000 + Math.random() * 2000);
    }
}

function addChatMessage(text, sender) {
    const container = document.getElementById('chat-container');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `<strong>Bow-Bot:</strong> ${text}`;
    } else {
        messageDiv.innerHTML = `<strong>You:</strong> ${text}`;
    }
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    const responses = {
        greeting: ["Hey there! 👋", "Hello! How can I help you today?", "Hi! Nice to see you!"],
        coding: ["Coding is awesome! What language are you learning?", "I love talking about programming! 🚀", "Web development is so much fun!"],
        gaming: ["Gaming is the best way to relax! 🎮", "What games are you playing lately?", "I'm a big fan of chill gaming sessions"],
        default: ["That's interesting! Tell me more.", "I see... what do you think about that?", "Cool! Want to talk about something else?"]
    };
    
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
        return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.includes('code') || lowerMessage.includes('program') || lowerMessage.includes('html') || lowerMessage.includes('css') || lowerMessage.includes('js')) {
        return responses.coding[Math.floor(Math.random() * responses.coding.length)];
    } else if (lowerMessage.includes('game') || lowerMessage.includes('play') || lowerMessage.includes('gta') || lowerMessage.includes('samp')) {
        return responses.gaming[Math.floor(Math.random() * responses.gaming.length)];
    } else {
        return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
}

// Live Coding Animation
function animateLiveCoding() {
    const codeEditor = document.getElementById('live-code');
    if (!codeEditor) return;
    
    // Simulate typing effect occasionally
    if (Math.random() > 0.7) {
        codeEditor.style.animation = 'none';
        setTimeout(() => {
            codeEditor.style.animation = 'typing 0.5s ease-in-out';
        }, 10);
    }
}

// Seasonal Events Countdown
function updateCountdowns() {
    const now = new Date();
    
    // Halloween countdown (October 31)
    const halloween = new Date(now.getFullYear(), 9, 31);
    if (now > halloween) {
        halloween.setFullYear(halloween.getFullYear() + 1);
    }
    const halloweenDiff = halloween - now;
    
    // Christmas countdown (December 25)
    const christmas = new Date(now.getFullYear(), 11, 25);
    if (now > christmas) {
        christmas.setFullYear(christmas.getFullYear() + 1);
    }
    const christmasDiff = christmas - now;
    
    const halloweenElement = document.getElementById('halloween-countdown');
    const christmasElement = document.getElementById('christmas-countdown');
    
    if (halloweenElement) halloweenElement.textContent = formatCountdown(halloweenDiff);
    if (christmasElement) christmasElement.textContent = formatCountdown(christmasDiff);
}

function formatCountdown(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
}