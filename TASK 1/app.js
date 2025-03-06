document.addEventListener('DOMContentLoaded', function() {
    // Get reference to DOM elements
    const getWeatherButton = document.getElementById('get-weather');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const weatherDataElement = document.getElementById('weather-data');
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const conditionElement = document.getElementById('condition');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');

    // API key for WeatherAPI.com
    // Note: In a production environment, this should be secured and not exposed in client-side code
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key from WeatherAPI.com

    // Add event listener to the button
    getWeatherButton.addEventListener('click', getWeatherData);

    function getWeatherData() {
        // Show loading indicator and hide other elements
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        weatherDataElement.style.display = 'none';

        // Check if geolocation is supported by the browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeather, handleLocationError);
        } else {
            // Geolocation is not supported
            showError('Geolocation is not supported by your browser');
        }
    }

    function fetchWeather(position) {
        // Get latitude and longitude from the position object
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Create the API URL with the coordinates
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

        // Create a new XMLHttpRequest object for AJAX
        const xhr = new XMLHttpRequest();
        
        // Configure the request
        xhr.open('GET', apiUrl, true);
        
        // Set up event handlers
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Request was successful
                try {
                    const response = JSON.parse(xhr.responseText);
                    displayWeatherData(response);
                } catch (e) {
                    showError('Error parsing weather data');
                }
            } else {
                // Request failed
                showError('Failed to fetch weather data. Status: ' + xhr.status);
            }
        };
        
        xhr.onerror = function() {
            showError('Network error occurred');
        };
        
        // Send the request
        xhr.send();
    }

    function displayWeatherData(data) {
        // Hide loading indicator
        loadingElement.style.display = 'none';
        
        // Extract relevant data from the response
        const location = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        const temperature = data.current.temp_c;
        const condition = data.current.condition.text;
        const humidity = data.current.humidity;
        const wind = data.current.wind_kph;
        
        // Update DOM elements with weather data
        locationElement.textContent = location;
        temperatureElement.textContent = temperature;
        conditionElement.textContent = condition;
        humidityElement.textContent = humidity;
        windElement.textContent = wind;
        
        // Show the weather data container
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
        // Hide loading indicator
        loadingElement.style.display = 'none';
        
        // Update error message and show error element
        errorElement.querySelector('p').textContent = message;
        errorElement.style.display = 'block';
    }
});