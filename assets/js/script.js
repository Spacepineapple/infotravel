let formContainer = document.querySelector("#search-form");
let locationInputEl = document.querySelector("#location");
let fromDateInputEl = document.querySelector("#from-date");
let toDateInputEl = document.querySelector("#to-date");
let searchBtnEl = document.querySelector("#search-btn");
let newsCards = document.querySelectorAll(".news-card");
let newsAPIKey = "pub_165518ddbc391a0563b33c28f98a88bc39c78"
let cityName = "London"
let newsURL = `https://newsdata.io/api/1/news?apikey=${newsAPIKey}&language=en&qInTitle=${cityName}`

searchBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
});

$(function () {
  $(".datepicker").datepicker();
});

function getNewsHeadlines() {
  fetch(newsURL)
  .then((response) => response.json())
  .then((newsData) => {
    console.log(newsData);
    for (let i=0; i<3; i++) {
      const card = newsCards[i];
      console.log(card);
      const title = card.querySelector(".card-body").querySelector(".card-title");
      title.textContent = newsData.results[i].title;
      const newsText = card.querySelector(".card-body").querySelector(".card-text");
      newsText.textContent = newsData.results[i].description;
      const newsImage = card.querySelector(".card-img-top");
      newsImage.setAttribute("src", newsData.results[i].image_url);
      console.log(newsData.results[i].title);
      console.log(newsData.results[i].description);
    }
  });
}

getNewsHeadlines()