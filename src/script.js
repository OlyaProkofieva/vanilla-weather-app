function formatDate(timestamp) {
  let date = new Date(timestamp);
  let currentHours = date.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }

  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let currentDate = date.getDate();

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[dayIndex];

  let monthIndex = date.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let currentMonth = months[monthIndex];

  let formattedDate = `${currentDay}, ${currentDate} ${currentMonth}, ${currentHours}:${currentMinutes}`;
  return formattedDate;
}

function displayWeather(response) {
  console.log(response);
  let temperatureElement = document.querySelector("#day-temperature");
  let descriptionElement = document.querySelector("#weather-description");
  let iconElement = document.querySelector("#current-weather-icon");
  let cityElement = document.querySelector("#current-city");
  let dateElement = document.querySelector("#date");
  let feelsLikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let pressureElement = document.querySelector("#pressure");

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  descriptionElement.innerHTML = response.data.weather[0].description;
  console.log(response.data.weather[0].icon);
  iconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  pressureElement.innerHTML = Math.round(response.data.main.pressure);
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "74e689e7d5e387f646d3bb8762c944a1";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeather);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

function searchCity(city) {
  let apiKey = "74e689e7d5e387f646d3bb8762c944a1";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector(".search-input").value;
  searchCity(city);
}

let locationButton = document.querySelector(".current-location-button");
locationButton.addEventListener("click", getLocation);

let searchForm = document.querySelector("#searching-form");
searchForm.addEventListener("submit", handleSubmit);

searchCity("Kyiv");
