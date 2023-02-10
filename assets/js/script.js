//Create variables for each of the manipulated DOM elements
let locationInputEl = document.querySelector("#location");
let fromDateInputEl = document.querySelector("#from-date");
let toDateInputEl = document.querySelector("#to-date");
let searchBtnEl = document.querySelector("#search-btn");
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
let savedLocationsBtnEl = document.querySelector("#saved-btn");
let convertBtn = document.querySelector("#convertBtn");
let newsCards = document.querySelectorAll(".news-card");
let modalContainerEl = document.querySelector("#searched-cities");
let descriptionPlaceholder = document.querySelector("#city-description");
let populationPlaceholder = document.querySelector("#population");
let cityNameField = document.querySelector("#city-name");
let hiddenDiv = document.querySelector("#hidden-div");
let hiddenFoot = document.querySelector("#hidden-foot");
let imageDiv = document.querySelector("#image-div");
let frontImage = document.querySelector("#front-image");
let country;
let logoImg = document.querySelector("#logo-img");
let learnMore = document.querySelector("#learn-more");

logoImg.src = "./assets/image/logo.png";

//Create an empty city name variable for later use to prevent scope issues
let cityName = "";
currency();

//Define APIs and keys for subsequent use
// let newsAPIKey = "pub_165518ddbc391a0563b33c28f98a88bc39c78";
let newsAPIKey = "pub_163846ecaf8c51cdda7961c83e0673682ec1d";
let newsURL = `https://newsdata.io/api/1/news?apikey=${newsAPIKey}&language=en&qInTitle=${cityName}`;
let apiKey = "40640050a45cbd8cf8d35ada1e14fee3";
let cityAPIKey = "5ae2e3f221c38a28845f05b6fc79de7689f7ec4f4ccd8b2ae7179f74";

//Create an empty travelAPIURL for later use to prevent scope issues
let travelAPIURL;

// Initialize the views
frontImage.src = "./assets/image/travel.jpg";
frontImage.style.width = "100%";
frontImage.style.height = "100%";
imageDiv.hidden = false;
hiddenDiv.hidden = true;
hiddenFoot.hidden = true;

/** Fetch Weather data */
function getWeather(searchCity) {
  let queryUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=5&appid=${apiKey}`;

  // Fetch darta from the server
  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      let cityData = data[0];
      //Get the weather data for the city latitude and longitude
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

      // Display the current weather data on the screen
      currentDateEl.textContent = moment(weatherInfo[0].dt, "X").format(
        "ddd, MMM Do, h:mm A"
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
        weatherInfo[0],
        weatherInfo[8],
        weatherInfo[16],
        weatherInfo[24],
        weatherInfo[32],
        weatherInfo[39],
      ];
      // Dynamically render the forecast data for each dat on to the screen
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

//Search for a city matching the user's input
function doSearch(location, e) {
  hiddenDiv.hidden = false;
  hiddenFoot.hidden = false;
  imageDiv.hidden = true;
  cityName = location;
  //Get the attractions and information for that city
  getLocationInformation();
  //Get relevant news headlines for that city
  getNewsHeadlines();
  forecastContainerEl.innerHTML = "";

  // Save the serached city name to local storage
  let itemToSaveKey = location;
  localStorage.setItem(`${itemToSaveKey}`, `${itemToSaveKey}`);
  //Get the weather at the location
  getWeather(location);
}

//Add functionality to the search button
searchBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  doSearch(locationInputEl.value.trim(), e);
  locationInputEl.value = "";
});

//Add functionality to the learn more button to move to Wikipedia page
learnMore.addEventListener("click", function (event) {
  let destination = locationInputEl.value;
  window.open("https://en.wikipedia.org/wiki/" + destination);
});

//Add functionality to the saved locations button
savedLocationsBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  //Get data from local storage
  let storedCities = { ...localStorage };
  //Set the modal content to be empty to prevent repetition of elements
  modalContainerEl.innerHTML = "";
  //Iterate through locations stored in local storage
  for (const property in storedCities) {
    //If the stored city does not already exist
    if (!storedCities.property) {
      // Create a btn within the modal display for each location
      let btnEl = document.createElement("button");
      btnEl.classList.add("btn", "btn-primary", "modal-location-btn", "btn-sm");
      btnEl.setAttribute("data-bs-dismiss", "modal");
      btnEl.textContent = `${storedCities[property]}`;
      modalContainerEl.appendChild(btnEl);
    }
  }
});

//If the user clicks a button, perform a search for the corresponding location
const searchPreviousCity = (e) => {
  e.preventDefault();
  if (e.target.matches(".modal-location-btn")) {
    doSearch(e.target.textContent, e);
  }
};
//Add click functionality to the modal
document.addEventListener("click", searchPreviousCity);

//Get information about the queried country
function countryInfo() {
  //Create variables with assigned data for each of the placeholder elements
  let Tcountry = document.querySelector("#Tcountry");
  let Tcapital = document.querySelector("#Tcapital");
  let Tcurrency = document.querySelector("#Tcurrency");
  let TcurrencyCode = document.querySelector("#TcurrencyCode");
  let Tlanguage = document.querySelector("#Tlanguage");
  let Tpop = document.querySelector("#Tpop");
  let Tdrive = document.querySelector("#Tdrive");
  let Tcar = document.querySelector("#Tcar");
  let Tcontinent = document.querySelector("#Tcontinent");
  let Twebsite = document.querySelector("#Twebsite");

  //Query the API for details on the country
  fetch("https://restcountries.com/v3.1/name/" + country)
    .then((response) => response.json())
    .then((data) => {
      Tcountry.textContent = data[0].altSpellings[1] + " " + data[0].flag;
      Tcapital.textContent = "Capital: " + data[0].capital;
      Tcurrency.textContent =
        "Currency: " +
        Object.values(data[0].currencies)[0].name +
        " (" +
        Object.values(data[0].currencies)[0].symbol +
        " " +
        Object.keys(data[0].currencies)[0] +
        ")";
      Tlanguage.textContent = "Language: " + Object.values(data[0].languages);
      Tpop.textContent =
        "Population: " + data[0].population.toLocaleString("en-UK");
      Tdrive.textContent =
        "People drive on the  " + data[0].car.side + " side of the road.";
      Tcar.textContent =
        "The country code on the license plate is '" +
        data[0].car.signs[0] +
        "'";
      Tcontinent.textContent = data[0].region;
      Twebsite.textContent = "Internet code: " + data[0].tld[0];
    });
}

//Get an image that corresponds to the searched location
function image() {
  // let country = document.querySelector('#location').value;
  fetch(
    "https://pixabay.com/api/?key=33442906-03cc2a6146a25307dc8dd0c8d&q=" +
      country +
      "&image_type=photo&category=" +
      "travel"
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.hits.length) {
        let imageCountry = document.querySelector("#image1");
        imageCountry.src = data.hits[0].largeImageURL;
      } else {
        //If the image is not suitable search the places API
        fetch(
          "https://pixabay.com/api/?key=33442906-03cc2a6146a25307dc8dd0c8d&q=" +
            country +
            "&image_type=photo&category=" +
            "places"
        )
          .then((response) => response.json())
          .then((data) => {
            let imageCountry = document.querySelector("#image1");
            imageCountry.src = data.hits[0].largeImageURL;
          });
      }
    });
}

//Add functionality to the currency conversion button
convertBtn.addEventListener("click", function (event) {
  event.preventDefault();

  fetch(
    "https://openexchangerates.org/api/latest.json?app_id=4e8c4a0043c244ccaf102892798ae1c7"
  )
    .then((response) => response.json())
    .then((data) => {
      //Create variables to refer to elements in currency conversion fields
      let inputMoneyFrom = document.querySelector("#input-money").value;
      let fromSelect = document.querySelector("#from-select");
      let totalCurrency = document.querySelector("#total-currency");
      let fromCurrency = fromSelect.value;
      let toSelect = document.querySelector("#to-select");
      //Gather data from API and calculate converted value
      let toCurrency = toSelect.value;
      let from = data.rates[fromCurrency];
      let to = data.rates[toCurrency];
      let inputMoneyFrom2 = parseInt(inputMoneyFrom);
      let total = (to / from) * inputMoneyFrom2;

      totalCurrency.value = total.toFixed(2);
    });
});

//Fetch currency exchance rates for User's selected currencies
function currency() {
  fetch(
    "https://openexchangerates.org/api/latest.json?app_id=4e8c4a0043c244ccaf102892798ae1c7"
  )
    .then((response) => response.json())
    .then((data) => {
      let countries = Object.keys(data.rates);

      for (let i = 0; i < countries.length; i++) {
        let optionCurrencyFrom = document.createElement("option");
        optionCurrencyFrom.setAttribute("value", countries[i]);
        optionCurrencyFrom.innerHTML = countries[i];
        document.querySelector("#from-select").appendChild(optionCurrencyFrom);

        let optionCurrencyTo = document.createElement("option");
        optionCurrencyTo.setAttribute("value", countries[i]);
        optionCurrencyTo.innerHTML = countries[i];
        document.querySelector("#to-select").appendChild(optionCurrencyTo);
      }
    });
}

//Get local headlines from newsdata api and display in newsfeed
function getNewsHeadlines() {
  //Populate API URL with apikey and user city input
  let newsURL = `https://newsdata.io/api/1/news?apikey=${newsAPIKey}&language=en&qInTitle=${cityName}`;
  //Get data from API and convert to JSON
  fetch(newsURL)
    .then((response) => response.json())
    .then((newsData) => {
      //Take the first 3 articles
      for (let i = 0; i < 5; i++) {
        let maxLength = 75;
        //Get the corresponding card from the newsfeed
        const card = newsCards[i];
        const title = card
          .querySelector(".card-body")
          .querySelector(".card-title");
        const newsText = card
          .querySelector(".card-body")
          .querySelector(".card-text");
        const newsImage = card.querySelector(".card-img-top");
        try {
          //Set the card title to the news headline
          title.textContent = newsData.results[i].title.substr(0, 50) + "...";
          //If there is no description, display placeholder text
          if (newsData.results[i].description == null) {
            newsText.textContent = "No description available.";
          } else {
            //Otherwise, display the description but limit it to 100 characters
            newsText.textContent =
              newsData.results[i].description.substr(0, maxLength) + "...";
          }
          //If there is no image, display a placeholder image
          if (newsData.results[i].image_url == null) {
            newsImage.setAttribute("src", "./assets/image/Newspapers.jpg");
          } else {
            //Otherwise, display the image from the article
            newsImage.setAttribute("src", newsData.results[i].image_url);
          }
        } catch (err) {
          title.textContent = "No News Found";
          newsText.textContent = "No description available.";
          newsImage.setAttribute("src", "./assets/image/Newspapers.jpg");
        }
      }
    });
}

function getLocationInformation() {
  //Populate the API URL with the user's input city name and API key
  travelAPIURL = `http://api.opentripmap.com/0.1/en/places/geoname?name=${cityName}&apikey=${cityAPIKey}`;
  //Query the API and convert the response to JSON
  fetch(travelAPIURL)
    .then((response) => response.json())
    .then((cityData) => {
      cityNameField.textContent = cityData.name;
      //Get the country code from the response
      let countryCode = cityData.country;
      //Use the country code to get the commonly used name for that country
      let countryNameURL = `https://restcountries.com/v3.1/alpha/${countryCode}`;
      fetch(countryNameURL)
        .then((response) => response.json())
        .then((countryData) => {
          country = countryData[0].name.common;
          //Get country information for the location
          countryInfo();
          //Get an image for the location
          image();
        });
      //Get the latitude of the city
      let lat = cityData.lat;
      //Get the longitude of the city
      let lon = cityData.lon;
      //Use the latitude and longitude to find attractions in a 1000m radius
      let radiusAPIURL = `https://api.opentripmap.com/0.1/en/places/radius?radius=1000&lon=${lon}&lat=${lat}&apikey=${cityAPIKey}`;
      fetch(radiusAPIURL)
        .then((response) => response.json())
        .then((placeData) => {
          let attractionHeadings = document.querySelectorAll(
            ".attraction-heading"
          );
          let attractionDescriptions = document.querySelectorAll(
            ".attraction-description"
          );
          let attractionImages = document.querySelectorAll(".attraction-image");
          //Get the first 6 results
          for (let i = 0; i < 3; i++) {
            //Get the name of the attraction
            let attractionName = placeData.features[i].properties.name;
            //Set the heading of the attraction area row in index.html to the name
            attractionHeadings[i].textContent = attractionName;
            //Get the Open Trip Map ID of the attraction
            let xid = placeData.features[i].properties.xid;
            //Query the API using this ID to get further data
            const xidAPIURL = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${cityAPIKey}`;
            fetch(xidAPIURL)
              .then((response) => response.json())
              .then((attractionData) => {
                //Create a variable to hold the image URL
                let imageURL;
                //Attempt to get the attraction image URL
                try {
                  imageURL = attractionData.preview.source;
                } catch (err) {
                  //If there is an error, instead use a placeholder image
                  imageURL = "./assets/image/Placeholder_attraction.jpg";
                }
                //Change the attraction image to match the image URL
                attractionImages[i].setAttribute("src", `${imageURL}`);
                //Attempt to get the attraction description, limited to 200 characters
                try {
                  attractionDescriptions[i].textContent =
                    attractionData.wikipedia_extracts.text.substr(0, 200) +
                    "...";
                } catch (err) {
                  //If there is an error, instead display placeholder text
                  attractionDescriptions[i].textContent =
                    "No description available for this attraction";
                }
              });
          }
        });
    });
}
