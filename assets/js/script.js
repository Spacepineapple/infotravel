let formContainer = document.querySelector("#search-form");
let locationInputEl = document.querySelector("#location");
let fromDateInputEl = document.querySelector("#from-date");
let toDateInputEl = document.querySelector("#to-date");
let searchBtnEl = document.querySelector("#search-btn");

searchBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
});

$(function () {
  $(".datepicker").datepicker();
});
