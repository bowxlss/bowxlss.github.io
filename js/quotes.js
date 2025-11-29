// Quote API Integration
class QuoteGenerator {
    constructor() {
        this.currentQuote = null;
        this.quoteElement = null;
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

    async loadRandomQuote() {
        this.showLoading();

        try {
            // Try multiple quote APIs for fallback
            const apis = [
                'https://api.quotable.io/random',
                'https://quotes.rest/qod?category=inspire',
                'https://zenquotes.io/api/random'
            ];

            let quoteData = null;

            for (const api of apis) {
                try {
                    const response = await fetch(api);
                    if (response.ok) {
                        const data = await response.json();
                        quoteData = this.parseQuoteData(data, api);
                        if (quoteData) break;
                    }
                } catch (error) {
                    console.log(`API ${api} failed, trying next...`);
                    continue;
                }
            }

            if (quoteData) {
                this.displayQuote(quoteData);
            } else {
                this.showError();
            }
        } catch (error) {
            console.error('All quote APIs failed:', error);
            this.showError();
        }
    }

    parseQuoteData(data, api) {
        try {
            if (api.includes('quotable.io')) {
                return {
                    text: `"${data.content}"`,
                    author: `- ${data.author}`
                };
            } else if (api.includes('quotes.rest')) {
                return {
                    text: `"${data.contents.quotes[0].quote}"`,
                    author: `- ${data.contents.quotes[0].author}`
                };
            } else if (api.includes('zenquotes.io')) {
                return {
                    text: `"${data[0].q}"`,
                    author: `- ${data[0].a}`
                };
            }
        } catch (error) {
            return null;
        }
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
        // You can use your existing notification system
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message); // Fallback
        }
    }

    startQuoteRotation() {
        // Rotate quotes every 30 seconds
        setInterval(() => {
            this.loadRandomQuote();
        }, 30000);
    }
}

// Initialize quote generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuoteGenerator();
});