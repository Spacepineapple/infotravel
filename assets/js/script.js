let formContainer = document.querySelector("#search-form");
let locationInputEl = document.querySelector("#location");
let fromDateInputEl = document.querySelector("#from-date");
let toDateInputEl = document.querySelector("#to-date");
let searchBtnEl = document.querySelector("#search-btn");
let convertBtn = document.querySelector("#convertBtn")

currency()

searchBtnEl.addEventListener("click", function (e) {
  e.preventDefault();

countryInfo()
image()



});

$(function () {
  $(".datepicker").datepicker();
});


function countryInfo() {

  let Tcountry = document.querySelector("#Tcountry")
  let Tcapital = document.querySelector("#Tcapital")
  let Tcurrency = document.querySelector("#Tcurrency")
  let TcurrencyCode = document.querySelector("#TcurrencyCode")
  let Tlanguage = document.querySelector("#Tlanguage")
  let Ttime = document.querySelector("#Ttime")
  let Tpop = document.querySelector("#Tpop")
  let Tdrive = document.querySelector("#Tdrive")
  let Tcar = document.querySelector("#Tcar")
  let Tcontinent = document.querySelector("#Tcontinent")
  let Twebsite = document.querySelector("#Twebsite")
  let country = locationInputEl.value
  let map = document.querySelector("#map")

  fetch("https://restcountries.com/v3.1/name/" + country)
    .then(response => response.json())
    .then(data =>{

      Tcountry.textContent = data[0].altSpellings[1] + " " + data[0].flag
      Tcapital.textContent = "Capital: " + data[0].capital
      Tcurrency.textContent = "Currency: " + Object.values(data[0].currencies)[0].name + " (" + Object.values(data[0].currencies)[0].symbol + ")"
      TcurrencyCode.textContent = "Code: " +  Object.keys(data[0].currencies)[0]
      Tlanguage.textContent = "Language: " + Object.values(data[0].languages)
      Ttime.textContent = data[0].timezones[0]
      Tpop.textContent = "Population: " + data[0].population.toLocaleString("en-UK")
      Tdrive.textContent = "Car drives on the " + data[0].car.side + " side"
      Tcar.textContent = "Country code on license plate " + data[0].car.signs[0]
      Tcontinent.textContent = data[0].region
      Twebsite.textContent = "Internet code: " + data[0].tld[0]
  
})
}


function currency() {
  
fetch("https://openexchangerates.org/api/latest.json?app_id=4e8c4a0043c244ccaf102892798ae1c7")
    .then(response => response.json())
    .then(data =>{

let countries = Object.keys(data.rates)

      for (let i = 0; i < countries.length; i++) {
        
        let optionCurrencyFrom = document.createElement("option")
        optionCurrencyFrom.setAttribute("value", countries[i])
        optionCurrencyFrom.innerHTML = countries[i]
        document.querySelector("#from-select").appendChild(optionCurrencyFrom)

        let optionCurrencyTo = document.createElement("option")
        optionCurrencyTo.setAttribute("value", countries[i])
        optionCurrencyTo.innerHTML = countries[i]
        document.querySelector("#to-select").appendChild(optionCurrencyTo)
         
      }})
    }


convertBtn.addEventListener("click", function(event){
event.preventDefault()

fetch("https://openexchangerates.org/api/latest.json?app_id=4e8c4a0043c244ccaf102892798ae1c7")
    .then(response => response.json())
    .then(data =>{
    
      let inputMoneyFrom = document.querySelector("#input-money").value
      let fromSelect = document.querySelector("#from-select")
      let totalCurrency = document.querySelector("#total-currency")
      let fromCurrency = fromSelect.value
      let toSelect = document.querySelector("#to-select")
      let toCurrency = toSelect.value
      let from = data.rates[fromCurrency]
      let to = data.rates[toCurrency]
      let inputMoneyFrom2 = parseInt(inputMoneyFrom)
      let total = (to/from) * inputMoneyFrom2

      totalCurrency.value = total.toFixed(2)
    }) 
})


function image() {
  
  let Icountry = locationInputEl.value

fetch("https://pixabay.com/api/?key=33442906-03cc2a6146a25307dc8dd0c8d&q=" + Icountry + "&image_type=photo&category=" + "travel")
    .then(response => response.json())
    .then(data =>{
      console.log(data)

      if(data.hits.length){
      let imageCountry = document.querySelector("#image1")
     imageCountry.src = data.hits[0].largeImageURL
      }else{

        return fetch("https://pixabay.com/api/?key=33442906-03cc2a6146a25307dc8dd0c8d&q=" + Icountry + "&image_type=photo&category=" + "places")
      } 
    }).then(response => response.json())
    .then(data =>{
      console.log(data)
      let imageCountry = document.querySelector("#image1")
     imageCountry.src = data.hits[0].largeImageURL

    })
  }