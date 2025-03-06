document.addEventListener('DOMContentLoaded', function() {
    const getWeatherButton = document.getElementById('get-weather');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const weatherDataElement = document.getElementById('weather-data');
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const conditionElement = document.getElementById('condition');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');

    const apiKey = '483f7bb8a7b94c3a9c6120806232011';

    getWeatherButton.addEventListener('click', getWeatherData);

    function getWeatherData() {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        weatherDataElement.style.display = 'none';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeather, handleLocationError);
        } else {
            showError('Geolocation is not supported by your browser');
        }
    }

    function fetchWeather(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', apiUrl, true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    displayWeatherData(response);
                } catch (e) {
                    showError('Error parsing weather data');
                }
            } else {
                showError('Failed to fetch weather data. Status: ' + xhr.status);
            }
        };
        
        xhr.onerror = function() {
            showError('Network error occurred');
        };
        
        xhr.send();
    }

    function displayWeatherData(data) {
        loadingElement.style.display = 'none';
        
        const location = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        const temperature = data.current.temp_c;
        const condition = data.current.condition.text;
        const humidity = data.current.humidity;
        const wind = data.current.wind_kph;
        
        locationElement.textContent = location;
        temperatureElement.textContent = temperature;
        conditionElement.textContent = condition;
        humidityElement.textContent = humidity;
        windElement.textContent = wind;
        
        weatherDataElement.style.display = 'block';
    }

    function handleLocationError(error) {
        let errorMessage;
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'User denied the request for geolocation';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable';
                break;
            case error.TIMEOUT:
                errorMessage = 'The request to get user location timed out';
                break;
            case error.UNKNOWN_ERROR:
                errorMessage = 'An unknown error occurred';
                break;
        }
        
        showError(errorMessage);
    }

    function showError(message) {
        loadingElement.style.display = 'none';
        
        errorElement.querySelector('p').textContent = message;
        errorElement.style.display = 'block';
    }
});