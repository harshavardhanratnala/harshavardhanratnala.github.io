document.addEventListener('DOMContentLoaded', () => {
    const weatherApiKey = 'ed8f81b0538294a64e47286bd83ddbbe';
    const airQualityApiKey = 'ed8f81b0538294a64e47286bd83ddbbe';

    function getWeatherByCity() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value;

        if (city === '') {
            alert('Please enter a city.');
            return;
        }

        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherApiKey}`;

        fetchWeather(weatherApiUrl);
    }

    function getWeatherByLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`;

                fetchWeather(weatherApiUrl);
            }, error => {
                console.error('Error getting location:', error);
                alert('Error getting location. Please try again or enter a city manually.');
            });
        } else {
            alert('Geolocation is not supported by your browser. Please enter a city manually.');
        }
    }

    function fetchWeather(weatherApiUrl) {
        fetch(weatherApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather data not found. Please try again or enter a valid city.');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);

                // Extract latitude and longitude for air quality
                const latitude = data.coord.lat;
                const longitude = data.coord.lon;
                const airQualityApiUrl = `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${airQualityApiKey}`;

                fetchAirQuality(airQualityApiUrl);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error.message);
                alert(error.message);
            });
    }

    function fetchAirQuality(airQualityApiUrl) {
        fetch(airQualityApiUrl)
            .then(response => response.json())
            .then(airQualityData => {
                displayAirQuality(airQualityData);
            })
            .catch(error => {
                console.error('Error fetching air quality data:', error.message);
                alert('Error fetching air quality data.');
            });
    }

    function displayWeather(data) {
        const weatherInfo = document.getElementById('weather-info');
        const temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius

        const weatherHTML = `
            <h2>${data.name}</h2>
            <p>${data.weather[0].description}</p>
            <p>Temperature: ${temperature}°C</p>
        `;

        weatherInfo.innerHTML = weatherHTML;
    }

    function displayAirQuality(airQualityData) {
        const airQualityInfo = document.getElementById('air-quality-info');
        const aqi = airQualityData.data.current.pollution.aqius;

        const airQualityHTML = `
            <p>Air Quality Index: ${aqi}</p>
        `;

        airQualityInfo.innerHTML = airQualityHTML;
    }

    // Set up the event listeners for the buttons
    const getWeatherByCityButton = document.querySelector('button:nth-of-type(1)');
    getWeatherByCityButton.addEventListener('click', getWeatherByCity);

    const getWeatherByLocationButton = document.querySelector('button:nth-of-type(2)');
    getWeatherByLocationButton.addEventListener('click', getWeatherByLocation);
});
