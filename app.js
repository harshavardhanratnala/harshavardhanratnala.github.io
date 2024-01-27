document.addEventListener('DOMContentLoaded', () => {
    function getWeatherByCity() {
        const apiKey = 'ed8f81b0538294a64e47286bd83ddbbe';
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value;

        if (city === '') {
            alert('Please enter a city.');
            return;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetchWeather(apiUrl);
    }

    function getWeatherByLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const apiKey = 'ed8f81b0538294a64e47286bd83ddbbe';
                const { latitude, longitude } = position.coords;
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

                fetchWeather(apiUrl);
            }, error => {
                console.error('Error getting location:', error);
                alert('Error getting location. Please try again or enter a city manually.');
            });
        } else {
            alert('Geolocation is not supported by your browser. Please enter a city manually.');
        }
    }

    function fetchWeather(apiUrl) {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather data not found for the current location. Please try again or enter a city manually.');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error.message);
                alert(error.message);
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

    // Set up the event listeners for the buttons
    const getWeatherByCityButton = document.querySelector('button:nth-of-type(1)');
    getWeatherByCityButton.addEventListener('click', getWeatherByCity);

    const getWeatherByLocationButton = document.querySelector('button:nth-of-type(2)');
    getWeatherByLocationButton.addEventListener('click', getWeatherByLocation);
});
