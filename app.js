document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'ed8f81b0538294a64e47286bd83ddbbe';

    function getWeatherByCity() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value;

        if (city === '') {
            alert('Please enter a city.');
            return;
        }

        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;

        fetchWeather(weatherApiUrl);
    }

    function getWeatherByLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

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
                console.log('Weather Data:', data);
                displayWeather(data);

                // Fetch air quality data using the same coordinates
                const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`;
                fetchAirQuality(airQualityUrl);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error.message);
                alert(error.message);
            });
    }

    function fetchAirQuality(airQualityUrl) {
        fetch(airQualityUrl)
            .then(response => response.json())
            .then(airQualityData => {
                console.log('Air Quality Data:', airQualityData);
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
        // Adjust the property access based on the structure of the API response
        const aqi = airQualityData.list[0].main.aqi;

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
