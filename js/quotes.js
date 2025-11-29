// Quote API Integration - Fixed Version
class QuoteGenerator {
    constructor() {
        this.currentQuote = null;
        this.quoteElement = null;
        this.fallbackQuotes = this.getFallbackQuotes();
        this.init();
    }

    init() {
        this.createQuoteWidget();
        this.loadRandomQuote();
        this.startQuoteRotation();
    }

    createQuoteWidget() {
        this.quoteElement = document.createElement('div');
        this.quoteElement.className = 'quote-widget';
        this.quoteElement.innerHTML = `
            <div class="quote-card">
                <div class="quote-header">
                    <h3><i class="fas fa-quote-left"></i> Daily Inspiration</h3>
                    <button class="new-quote"><i class="fas fa-random"></i></button>
                </div>
                <div class="quote-content">
                    <div class="quote-loading">
                        <div class="loading-spinner"></div>
                        <p>Loading wisdom...</p>
                    </div>
                    <div class="quote-data" style="display: none;">
                        <p class="quote-text" id="quote-text">"The only way to do great work is to love what you do."</p>
                        <p class="quote-author" id="quote-author">- Steve Jobs</p>
                    </div>
                    <div class="quote-error" style="display: none;">
                        <p>💭 No quotes available</p>
                    </div>
                </div>
                <div class="quote-actions">
                    <button class="quote-action tweet-quote">
                        <i class="fab fa-twitter"></i> Tweet
                    </button>
                    <button class="quote-action copy-quote">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button class="quote-action save-quote">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        `;

        // Add to page
        const weatherWidget = document.querySelector('.weather-widget');
        if (weatherWidget) {
            weatherWidget.parentNode.insertBefore(this.quoteElement, weatherWidget.nextSibling);
        }

        // Add event listeners
        this.quoteElement.querySelector('.new-quote').addEventListener('click', () => {
            this.loadRandomQuote();
        });

        this.quoteElement.querySelector('.tweet-quote').addEventListener('click', () => {
            this.tweetQuote();
        });

        this.quoteElement.querySelector('.copy-quote').addEventListener('click', () => {
            this.copyQuote();
        });

        this.quoteElement.querySelector('.save-quote').addEventListener('click', () => {
            this.saveQuote();
        });
    }

    getFallbackQuotes() {
        return [
            {
                text: "\"The only way to do great work is to love what you do.\"",
                author: "- Steve Jobs"
            },
            {
                text: "\"Innovation distinguishes between a leader and a follower.\"",
                author: "- Steve Jobs"
            },
            {
                text: "\"Your time is limited, don't waste it living someone else's life.\"",
                author: "- Steve Jobs"
            },
            {
                text: "\"Stay hungry, stay foolish.\"",
                author: "- Steve Jobs"
            },
            {
                text: "\"The future belongs to those who believe in the beauty of their dreams.\"",
                author: "- Eleanor Roosevelt"
            },
            {
                text: "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"",
                author: "- Winston Churchill"
            },
            {
                text: "\"The way to get started is to quit talking and begin doing.\"",
                author: "- Walt Disney"
            },
            {
                text: "\"Don't watch the clock; do what it does. Keep going.\"",
                author: "- Sam Levenson"
            },
            {
                text: "\"The only limit to our realization of tomorrow will be our doubts of today.\"",
                author: "- Franklin D. Roosevelt"
            },
            {
                text: "\"It does not matter how slowly you go as long as you do not stop.\"",
                author: "- Confucius"
            },
            {
                text: "\"Everything you've ever wanted is on the other side of fear.\"",
                author: "- George Addair"
            },
            {
                text: "\"The harder I work, the more luck I seem to have.\"",
                author: "- Thomas Jefferson"
            },
            {
                text: "\"The mind is everything. What you think you become.\"",
                author: "- Buddha"
            },
            {
                text: "\"The best time to plant a tree was 20 years ago. The second best time is now.\"",
                author: "- Chinese Proverb"
            },
            {
                text: "\"I have not failed. I've just found 10,000 ways that won't work.\"",
                author: "- Thomas Edison"
            },
            {
                text: "\"The secret of getting ahead is getting started.\"",
                author: "- Mark Twain"
            },
            {
                text: "\"Don't be afraid to give up the good to go for the great.\"",
                author: "- John D. Rockefeller"
            },
            {
                text: "\"I find that the harder I work, the more luck I seem to have.\"",
                author: "- Thomas Jefferson"
            },
            {
                text: "\"The only place where success comes before work is in the dictionary.\"",
                author: "- Vidal Sassoon"
            },
            {
                text: "\"The road to success and the road to failure are almost exactly the same.\"",
                author: "- Colin R. Davis"
            }
        ];
    }

    async loadRandomQuote() {
        this.showLoading();

        try {
            // Try reliable APIs first
            const apis = [
                'https://zenquotes.io/api/random',
                'https://type.fit/api/quotes',
                'https://api.adviceslip.com/advice'
            ];

            let quoteData = null;

            for (const api of apis) {
                try {
                    console.log(`Trying API: ${api}`);
                    const response = await fetch(api, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                        timeout: 5000
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        quoteData = this.parseQuoteData(data, api);
                        if (quoteData) {
                            console.log('Success with API:', api);
                            break;
                        }
                    }
                } catch (error) {
                    console.log(`API ${api} failed:`, error);
                    continue;
                }
            }

            if (quoteData) {
                this.displayQuote(quoteData);
            } else {
                // Use fallback quotes if all APIs fail
                console.log('Using fallback quotes');
                this.useFallbackQuote();
            }
        } catch (error) {
            console.error('All quote APIs failed:', error);
            this.useFallbackQuote();
        }
    }

    parseQuoteData(data, api) {
        try {
            if (api.includes('quotable.io')) {
                return {
                    text: `"${data.content}"`,
                    author: `- ${data.author}`
                };
            } else if (api.includes('type.fit')) {
                const quotes = data;
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                return {
                    text: `"${randomQuote.text}"`,
                    author: `- ${randomQuote.author || 'Unknown'}`
                };
            } else if (api.includes('adviceslip.com')) {
                return {
                    text: `"${data.slip.advice}"`,
                    author: "- Advice Slip"
                };
            }
        } catch (error) {
            console.error('Error parsing quote data:', error);
            return null;
        }
    }

    useFallbackQuote() {
        const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
        const quoteData = this.fallbackQuotes[randomIndex];
        this.displayQuote(quoteData);
    }

    displayQuote(quoteData) {
        const quoteDataElement = this.quoteElement.querySelector('.quote-data');
        const quoteLoading = this.quoteElement.querySelector('.quote-loading');
        const quoteError = this.quoteElement.querySelector('.quote-error');

        quoteLoading.style.display = 'none';
        quoteError.style.display = 'none';
        quoteDataElement.style.display = 'block';

        this.quoteElement.querySelector('#quote-text').textContent = quoteData.text;
        this.quoteElement.querySelector('#quote-author').textContent = quoteData.author;

        this.currentQuote = quoteData;

        // Add fade-in animation
        quoteDataElement.style.animation = 'fadeInUp 0.6s ease';
        setTimeout(() => {
            quoteDataElement.style.animation = '';
        }, 600);
    }

    showLoading() {
        const quoteData = this.quoteElement.querySelector('.quote-data');
        const quoteLoading = this.quoteElement.querySelector('.quote-loading');
        const quoteError = this.quoteElement.querySelector('.quote-error');

        quoteData.style.display = 'none';
        quoteError.style.display = 'none';
        quoteLoading.style.display = 'block';
    }

    showError() {
        const quoteData = this.quoteElement.querySelector('.quote-data');
        const quoteLoading = this.quoteElement.querySelector('.quote-loading');
        const quoteError = this.quoteElement.querySelector('.quote-error');

        quoteData.style.display = 'none';
        quoteLoading.style.display = 'none';
        quoteError.style.display = 'block';
    }

    tweetQuote() {
        if (!this.currentQuote) return;

        const text = encodeURIComponent(`${this.currentQuote.text} ${this.currentQuote.author}`);
        const url = encodeURIComponent(window.location.href);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }

    copyQuote() {
        if (!this.currentQuote) return;

        const text = `${this.currentQuote.text} ${this.currentQuote.author}`;
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Quote copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Quote copied to clipboard!', 'success');
        });
    }

    saveQuote() {
        if (!this.currentQuote) return;

        // Save to localStorage
        const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
        savedQuotes.push({
            ...this.currentQuote,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));

        this.showNotification('Quote saved to favorites!', 'success');
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `quote-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(46, 204, 113, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    startQuoteRotation() {
        // Rotate quotes every 45 seconds
        setInterval(() => {
            this.loadRandomQuote();
        }, 45000);
    }
}

// Add CSS for notifications
const quoteNotificationStyles = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.quote-notification.success {
    background: rgba(46, 204, 113, 0.9) !important;
}

.quote-notification.info {
    background: rgba(52, 152, 219, 0.9) !important;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = quoteNotificationStyles;
document.head.appendChild(styleSheet);

// Initialize quote generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuoteGenerator();
});