// Weather API Integration
class WeatherApp {
    constructor() {
        this.apiKey = '4bac631262a33a2cdce791f90fd68869';
        this.weatherElement = null;
        this.init();
    }

    init() {
        this.createWeatherWidget();
        this.getWeatherByGeolocation();
        this.startWeatherUpdates();
    }

    createWeatherWidget() {
        this.weatherElement = document.createElement('div');
        this.weatherElement.className = 'weather-widget';
        this.weatherElement.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <h3><i class="fas fa-cloud-sun"></i> Live Weather</h3>
                    <button class="refresh-weather"><i class="fas fa-sync-alt"></i></button>
                </div>
                <div class="weather-content">
                    <div class="weather-loading">
                        <div class="loading-spinner"></div>
                        <p>Detecting location...</p>
                    </div>
                    <div class="weather-data" style="display: none;">
                        <div class="weather-main">
                            <div class="weather-icon">
                                <img id="weather-icon" src="" alt="Weather Icon">
                            </div>
                            <div class="weather-temp">
                                <span id="temperature">--</span>°
                                <div id="weather-description">--</div>
                            </div>
                        </div>
                        <div class="weather-details">
                            <div class="weather-detail">
                                <i class="fas fa-map-marker-alt"></i>
                                <span id="location">--</span>
                            </div>
                            <div class="weather-detail">
                                <i class="fas fa-wind"></i>
                                <span id="wind-speed">-- km/h</span>
                            </div>
                            <div class="weather-detail">
                                <i class="fas fa-tint"></i>
                                <span id="humidity">--%</span>
                            </div>
                            <div class="weather-detail">
                                <i class="fas fa-temperature-low"></i>
                                <span id="feels-like">--°</span>
                            </div>
                        </div>
                    </div>
                    <div class="weather-error" style="display: none;">
                        <p>❌ Weather data unavailable</p>
                    </div>
                </div>
            </div>
        `;

        // Add to page
        const socialTitle = document.querySelector('.social-title');
        if (socialTitle) {
            socialTitle.parentNode.insertBefore(this.weatherElement, socialTitle);
        }

        // Add refresh functionality
        this.weatherElement.querySelector('.refresh-weather').addEventListener('click', () => {
            this.getWeatherByGeolocation();
        });
    }

    getWeatherByGeolocation() {
        this.showLoading();
        
        if (!navigator.geolocation) {
            this.getWeatherByCity('Jakarta'); // Fallback to default city
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
            },
            (error) => {
                console.log('Geolocation failed, using default city:', error);
                this.getWeatherByCity('Jakarta'); // Fallback to default city
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000
            }
        );
    }

    getWeatherByCity(city) {
        this.fetchWeatherData(`q=${city}`);
    }

    async fetchWeatherData(query) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${this.apiKey}`
            );
            
            if (!response.ok) throw new Error('Weather API error');
            
            const data = await response.json();
            this.updateWeatherDisplay(data);
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError();
        }
    }

    updateWeatherDisplay(data) {
        const weatherData = this.weatherElement.querySelector('.weather-data');
        const weatherLoading = this.weatherElement.querySelector('.weather-loading');
        const weatherError = this.weatherElement.querySelector('.weather-error');

        weatherLoading.style.display = 'none';
        weatherError.style.display = 'none';
        weatherData.style.display = 'block';

        // Update weather data
        this.weatherElement.querySelector('#temperature').textContent = Math.round(data.main.temp);
        this.weatherElement.querySelector('#weather-description').textContent = 
            data.weather[0].description;
        this.weatherElement.querySelector('#location').textContent = data.name;
        this.weatherElement.querySelector('#wind-speed').textContent = 
            `${Math.round(data.wind.speed * 3.6)} km/h`;
        this.weatherElement.querySelector('#humidity').textContent = 
            `${data.main.humidity}%`;
        this.weatherElement.querySelector('#feels-like').textContent = 
            `${Math.round(data.main.feels_like)}°`;

        // Update weather icon
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        this.weatherElement.querySelector('#weather-icon').src = iconUrl;
        this.weatherElement.querySelector('#weather-icon').alt = data.weather[0].main;

        // Add weather animation
        this.addWeatherAnimation(data.weather[0].main);
    }

    addWeatherAnimation(weatherCondition) {
        const weatherCard = this.weatherElement.querySelector('.weather-card');
        
        // Remove existing animation classes
        weatherCard.classList.remove('weather-sunny', 'weather-rainy', 'weather-cloudy', 'weather-snowy');
        
        // Add new animation class based on condition
        switch (weatherCondition.toLowerCase()) {
            case 'clear':
                weatherCard.classList.add('weather-sunny');
                break;
            case 'rain':
            case 'drizzle':
                weatherCard.classList.add('weather-rainy');
                break;
            case 'clouds':
                weatherCard.classList.add('weather-cloudy');
                break;
            case 'snow':
                weatherCard.classList.add('weather-snowy');
                break;
        }
    }

    showLoading() {
        const weatherData = this.weatherElement.querySelector('.weather-data');
        const weatherLoading = this.weatherElement.querySelector('.weather-loading');
        const weatherError = this.weatherElement.querySelector('.weather-error');

        weatherData.style.display = 'none';
        weatherError.style.display = 'none';
        weatherLoading.style.display = 'block';
    }

    showError() {
        const weatherData = this.weatherElement.querySelector('.weather-data');
        const weatherLoading = this.weatherElement.querySelector('.weather-loading');
        const weatherError = this.weatherElement.querySelector('.weather-error');

        weatherData.style.display = 'none';
        weatherLoading.style.display = 'none';
        weatherError.style.display = 'block';
    }

    startWeatherUpdates() {
        // Update weather every 10 minutes
        setInterval(() => {
            this.getWeatherByGeolocation();
        }, 600000);
    }
}

// Initialize weather app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});