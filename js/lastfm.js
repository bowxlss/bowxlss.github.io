// Last.fm Integration - Spotify Now Playing
class LastFMIntegration {
    constructor() {
        this.apiKey = '64bd35b74194c2e3745e609bf011b76a';
        this.username = 'bowxlss';
        this.nowPlayingElement = null;
        this.currentTrack = null;
        this.pollInterval = null;
        this.init();
    }

    init() {
        this.createNowPlayingWidget();
        this.startPolling();
    }

    createNowPlayingWidget() {
        this.nowPlayingElement = document.createElement('div');
        this.nowPlayingElement.className = 'now-playing-widget';
        this.nowPlayingElement.innerHTML = `
            <div class="now-playing-card">
                <div class="now-playing-header">
                    <h3><i class="fab fa-spotify"></i> Now Playing</h3>
                    <div class="now-playing-badge" id="now-playing-badge">
                        <i class="fas fa-play"></i> LIVE
                    </div>
                </div>
                <div class="now-playing-content">
                    <div class="now-playing-loading">
                        <div class="loading-spinner"></div>
                        <p>Checking music status...</p>
                    </div>
                    <div class="now-playing-data" style="display: none;">
                        <div class="track-art">
                            <img id="track-image" src="" alt="Album Art">
                            <div class="playing-animation">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div class="track-info">
                            <div class="track-name" id="track-name">Track Name</div>
                            <div class="track-artist" id="track-artist">Artist Name</div>
                            <div class="track-album" id="track-album">Album Name</div>
                            <div class="track-meta">
                                <span class="track-time" id="track-time">--:--</span>
                            </div>
                        </div>
                    </div>
                    <div class="now-playing-idle" style="display: none;">
                        <div class="idle-icon">
                            <i class="fas fa-music"></i>
                        </div>
                        <div class="idle-message">
                            <p>Not currently playing</p>
                            <p class="idle-subtitle">Last played will show here</p>
                        </div>
                    </div>
                    <div class="now-playing-error" style="display: none;">
                        <p>🎵 Music data unavailable</p>
                    </div>
                </div>
                <div class="now-playing-actions">
                    <button class="now-playing-action open-spotify">
                        <i class="fab fa-spotify"></i> Open Spotify
                    </button>
                    <button class="now-playing-action view-profile">
                        <i class="fab fa-lastfm"></i> Last.fm Profile
                    </button>
                </div>
            </div>
        `;

        // Add to page
        const quoteWidget = document.querySelector('.quote-widget');
        if (quoteWidget) {
            quoteWidget.parentNode.insertBefore(this.nowPlayingElement, quoteWidget.nextSibling);
        }

        // Add event listeners
        this.nowPlayingElement.querySelector('.open-spotify').addEventListener('click', () => {
            this.openSpotify();
        });

        this.nowPlayingElement.querySelector('.view-profile').addEventListener('click', () => {
            this.openLastFMProfile();
        });
    }

    async startPolling() {
        // Initial fetch
        await this.fetchNowPlaying();
        
        // Poll every 15 seconds for now playing
        this.pollInterval = setInterval(async () => {
            await this.fetchNowPlaying();
        }, 15000);
    }

    async fetchNowPlaying() {
        try {
            const response = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.username}&api_key=${this.apiKey}&format=json&limit=1`
            );

            if (!response.ok) throw new Error('Last.fm API error');

            const data = await response.json();
            this.processNowPlaying(data);
        } catch (error) {
            console.error('Last.fm fetch error:', error);
            this.showError();
        }
    }

    processNowPlaying(data) {
        const tracks = data.recenttracks?.track;
        if (!tracks || tracks.length === 0) {
            this.showIdle();
            return;
        }

        const currentTrack = tracks[0];
        const isNowPlaying = currentTrack['@attr']?.nowplaying === 'true';

        this.updateNowPlayingDisplay(currentTrack, isNowPlaying);
        
        if (isNowPlaying) {
            this.currentTrack = currentTrack;
        }
    }

    updateNowPlayingDisplay(track, isNowPlaying) {
        const nowPlayingData = this.nowPlayingElement.querySelector('.now-playing-data');
        const nowPlayingLoading = this.nowPlayingElement.querySelector('.now-playing-loading');
        const nowPlayingIdle = this.nowPlayingElement.querySelector('.now-playing-idle');
        const nowPlayingError = this.nowPlayingElement.querySelector('.now-playing-error');
        const nowPlayingBadge = this.nowPlayingElement.querySelector('#now-playing-badge');

        nowPlayingLoading.style.display = 'none';
        nowPlayingIdle.style.display = 'none';
        nowPlayingError.style.display = 'none';
        nowPlayingData.style.display = 'flex';

        // Update track info
        this.nowPlayingElement.querySelector('#track-name').textContent = track.name;
        this.nowPlayingElement.querySelector('#track-artist').textContent = track.artist['#text'];
        this.nowPlayingElement.querySelector('#track-album').textContent = track.album['#text'];

        // Update track image
        const imageUrl = track.image[3]?.['#text'] || track.image[2]?.['#text'] || '';
        const trackImage = this.nowPlayingElement.querySelector('#track-image');
        if (imageUrl) {
            trackImage.src = imageUrl;
            trackImage.style.display = 'block';
        } else {
            trackImage.style.display = 'none';
        }

        // Update now playing status
        if (isNowPlaying) {
            nowPlayingBadge.innerHTML = '<i class="fas fa-play"></i> LIVE';
            nowPlayingBadge.classList.add('live');
            this.nowPlayingElement.querySelector('.playing-animation').style.display = 'flex';
        } else {
            nowPlayingBadge.innerHTML = '<i class="fas fa-clock"></i> RECENT';
            nowPlayingBadge.classList.remove('live');
            this.nowPlayingElement.querySelector('.playing-animation').style.display = 'none';
        }

        // Add pulse animation for new tracks
        nowPlayingData.style.animation = 'pulse 0.6s ease';
        setTimeout(() => {
            nowPlayingData.style.animation = '';
        }, 600);
    }

    showIdle() {
        const nowPlayingData = this.nowPlayingElement.querySelector('.now-playing-data');
        const nowPlayingLoading = this.nowPlayingElement.querySelector('.now-playing-loading');
        const nowPlayingIdle = this.nowPlayingElement.querySelector('.now-playing-idle');
        const nowPlayingError = this.nowPlayingElement.querySelector('.now-playing-error');

        nowPlayingData.style.display = 'none';
        nowPlayingLoading.style.display = 'none';
        nowPlayingError.style.display = 'none';
        nowPlayingIdle.style.display = 'block';
    }

    showError() {
        const nowPlayingData = this.nowPlayingElement.querySelector('.now-playing-data');
        const nowPlayingLoading = this.nowPlayingElement.querySelector('.now-playing-loading');
        const nowPlayingIdle = this.nowPlayingElement.querySelector('.now-playing-idle');
        const nowPlayingError = this.nowPlayingElement.querySelector('.now-playing-error');

        nowPlayingData.style.display = 'none';
        nowPlayingLoading.style.display = 'none';
        nowPlayingIdle.style.display = 'none';
        nowPlayingError.style.display = 'block';
    }

    openSpotify() {
        if (this.currentTrack) {
            // Try to open in Spotify (this is a fallback - actual Spotify links would need track ID)
            const searchQuery = encodeURIComponent(`${this.currentTrack.name} ${this.currentTrack.artist['#text']}`);
            window.open(`https://open.spotify.com/search/${searchQuery}`, '_blank');
        } else {
            window.open('https://open.spotify.com/', '_blank');
        }
    }

    openLastFMProfile() {
        window.open(`https://www.last.fm/user/${this.username}`, '_blank');
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }
}

// Initialize Last.fm integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LastFMIntegration();
});