let formContainer = document.querySelector("#search-form");
let locationInputEl = document.querySelector("#location");
let fromDateInputEl = document.querySelector("#from-date");
let toDateInputEl = document.querySelector("#to-date");
let searchBtnEl = document.querySelector("#search-btn");
let currentWeatherIconEl = document.querySelector("#current-weather-icon");
let currentTempValueEl = document.querySelector("#current-temp-value");
let currentFeelsLikeValueEl = document.querySelector("#current-fl-value");
let currentWindValueEl = document.querySelector("#current-wind-value");
let currentHumidityValueEl = document.querySelector("#current-humidity-value");

let apiKey = "40640050a45cbd8cf8d35ada1e14fee3";

/** Get user's location */
let userLocation = {};
if (window.navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      userLocation.latitude = latitude;
      userLocation.longitude = longitude;
    },
    (err) => console.log(err)
  );
}

/** Fetch Weather data */
function getWeather(searchCity) {
  let queryUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=5&appid=${apiKey}`;

  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      let cityData = data[0];
      let cityLon = cityData.lon;
      let cityLat = cityData.lat;
      getWeatherData(cityLat, cityLon);
    });
}

function getWeatherData(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((weatherData) => {
      let weatherInfo = weatherData.list;
      console.log(weatherInfo);

      // Display the current weather data on the screen
      currentWeatherIconEl.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${weatherInfo[0].weather[0].icon}@2x.png`
      );
      currentTempValueEl.textContent = weatherInfo[0].main.temp;
      currentFeelsLikeValueEl.textContent = weatherInfo[0].main.feels_like;
      currentHumidityValueEl.textContent = weatherInfo[0].main.humidity;
      currentWindValueEl.textContent = weatherInfo[0].wind.speed;
    });
}

searchBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Search button clicked");
  getWeather(locationInputEl.value);
});

$(function () {
  $(".datepicker").datepicker();
});
