document.addEventListener('DOMContentLoaded', () => {
    function getWeather() {
        const apiKey = 'ed8f81b0538294a64e47286bd83ddbbe';
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value;

        if (city === '') {
            alert('Please enter a city.');
            return;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found. Please recheck and enter a valid city.');
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

    // Set up the event listener for the button click
    const getWeatherButton = document.querySelector('button');
    getWeatherButton.addEventListener('click', getWeather);
});
