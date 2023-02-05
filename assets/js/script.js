let formContainer = document.querySelector("#search-form");
let locationInputEl = document.querySelector("#location");
let fromDateInputEl = document.querySelector("#from-date");
let toDateInputEl = document.querySelector("#to-date");
let searchBtnEl = document.querySelector("#search-btn");
let currentLocationEl = document.querySelector("#current-location");
let currentDateEl = document.querySelector("#current-date");
let weatherDescriptionEl = document.querySelector("#weather-description");
let currentWeatherIconEl = document.querySelector("#current-weather-icon");
let currentTempValueEl = document.querySelector("#current-temp-value");
let highTempValueEl = document.querySelector("#high-temp-value");
let lowTempValueEl = document.querySelector("#low-temp-value");
let feelsLikeValueEl = document.querySelector("#fl-value");
let windValueEl = document.querySelector("#wind-value");
let humidityValueEl = document.querySelector("#humidity-value");
let visibilityValueEl = document.querySelector("#visibility-value");
let forecastContainerEl = document.querySelector("#forecast-container");

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

      currentLocationEl.textContent = cityData.name;

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
      currentDateEl.textContent = moment(weatherInfo[0].dt, "X").format(
        "dddd, Do MMM YYYY"
      );
      weatherDescriptionEl.textContent = weatherInfo[0].weather[0].description;
      currentWeatherIconEl.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${weatherInfo[0].weather[0].icon}@2x.png`
      );
      currentTempValueEl.textContent = weatherInfo[0].main.temp.toFixed();
      highTempValueEl.textContent = weatherInfo[0].main.temp_max.toFixed(2);
      lowTempValueEl.textContent = weatherInfo[0].main.temp_min.toFixed(2);
      feelsLikeValueEl.textContent = weatherInfo[0].main.feels_like;
      humidityValueEl.textContent = weatherInfo[0].main.humidity;
      windValueEl.textContent = weatherInfo[0].wind.speed;

      // Display the future weather forecast data on the screen
      let fiveDayForecastArr = [
        weatherInfo[8],
        weatherInfo[16],
        weatherInfo[24],
        weatherInfo[32],
        weatherInfo[39],
      ];
      fiveDayForecastArr.forEach((forecast) => {
        let day = moment(forecast.dt, "X").format("dddd");
        let forecastWeatherIconSrc = forecast.weather[0].icon;
        let forecastTemp = forecast.main.temp.toFixed();
        forecastContainerEl.innerHTML += `
          <div class="forecast-card card">
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${forecastWeatherIconSrc}@2x.png" alt="Weather Icon" id="current-weather-icon">
            <div class="forecast-day">${day}</div>
            <div>${forecastTemp}&deg;</div>
          </div>
        `;
      });
    });
}

searchBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Search button clicked");
  currentLocationEl.textContent = "";
  forecastContainerEl.innerHTML = "";
  getWeather(locationInputEl.value);
});

$(function () {
  $(".datepicker").datepicker();
});
