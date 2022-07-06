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

function formatDateForecast(timestamp) {
  let date = new Date(timestamp * 1000);

  let dayIndex = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  let forecast = response.data.daily;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                <div class="forecast-day">${formatDateForecast(
                  forecastDay.dt
                )}</div>
                <img
                  src="images/weather-icons/${forecastDay.weather[0].icon}.png"
                  alt="${forecastDay.weather[0].description}"
                  class="forecast-icon"
                />
                <div class="forecast-temperatures">
                  <span class="forecast-temperature-max">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <span class="forecast-temperature-min">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
              </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function formatDateHourlyWeather(timestamp) {
  let date = new Date(timestamp * 1000);

  let currentHours = date.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  return currentHours;
}

function displayHourlyWeather(response) {
  let hourlyElement = document.querySelector("#hourly-weather");

  let hourlyWeatherHTML = `<div class="row">`;

  let hourlyWeather = response.data.hourly;
  hourlyWeather.forEach(function (hour, index) {
    if (index < 12) {
      hourlyWeatherHTML =
        hourlyWeatherHTML +
        `<div class="col-1">
              <div class="weather-hour">${formatDateHourlyWeather(
                hour.dt
              )}</div>
              <img
                src="images/weather-icons/${hour.weather[0].icon}.png"
                alt="${hour.weather[0].description}"
                class="hourly-weather-icon"
              />
              <div class="hourly-temperature">${Math.round(hour.temp)}°</div>
            </div>`;
    }
  });

  hourlyWeatherHTML = hourlyWeatherHTML + `</div>`;
  hourlyElement.innerHTML = hourlyWeatherHTML;
}

function getForecast(coordinates) {
  let apiKey = "74e689e7d5e387f646d3bb8762c944a1";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayForecast);
}

function getHourlyWeather(coordinates) {
  let apiKey = "74e689e7d5e387f646d3bb8762c944a1";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayHourlyWeather);
}

function displayWeather(response) {
  let temperatureElement = document.querySelector("#day-temperature");
  let descriptionElement = document.querySelector("#weather-description");
  let iconElement = document.querySelector("#current-weather-icon");
  let cityElement = document.querySelector("#current-city");
  let dateElement = document.querySelector("#date");
  let feelsLikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let pressureElement = document.querySelector("#pressure");

  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  descriptionElement.innerHTML = response.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    `images/weather-icons/${response.data.weather[0].icon}.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  feelsLikeCelsiusTemperature = response.data.main.feels_like;
  feelsLikeElement.innerHTML = Math.round(feelsLikeCelsiusTemperature);
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  pressureElement.innerHTML = Math.round(response.data.main.pressure);

  getHourlyWeather(response.data.coord);
  getForecast(response.data.coord);
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
  let searchInput = document.querySelector(".search-input");
  let currentCity = document.querySelector("#current-city");

  let input = searchInput.value.trim();
  if (input) {
    currentCity.innerHTML = ` `;
  } else {
    currentCity.innerHTML = null;
    alert("Enter a location, please");
  }

  let city = searchInput.value;

  searchCity(city);
}

function displayNewYorkWeather(event) {
  event.preventDefault();
  let city = "New York";
  searchCity(city);
}

function displayLondonWeather(event) {
  event.preventDefault();
  let city = "London";
  searchCity(city);
}

function displayParisWeather(event) {
  event.preventDefault();
  let city = "Paris";
  searchCity(city);
}

function displaySydneyWeather(event) {
  event.preventDefault();
  let city = "Sydney";
  searchCity(city);
}

function displayTokyoWeather(event) {
  event.preventDefault();
  let city = "Tokyo";
  searchCity(city);
}

function displayTelAvivWeather(event) {
  event.preventDefault();
  let city = "Tel Aviv";
  searchCity(city);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#day-temperature");
  let feelsLikeElement = document.querySelector("#feels-like");
  let unitFeelsLikeElement = document.querySelector("#feels-like-unit");

  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  celciusLink.classList.add("inactive");
  fahrenheitLink.classList.remove("inactive");

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let feelsLikeFahrenheitTemperature =
    (feelsLikeCelsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  feelsLikeElement.innerHTML = Math.round(feelsLikeFahrenheitTemperature);
  unitFeelsLikeElement.innerHTML = "°F";

  if (celsiusActive) {
    let temperatureMax = document.querySelectorAll(".forecast-temperature-max");
    let temperatureMin = document.querySelectorAll(".forecast-temperature-min");
    let hourlyTemperature = document.querySelectorAll(".hourly-temperature");

    for (let i = 0; i < temperatureMax.length; i++) {
      let temperatureFahrenheitMax =
        (parseInt(temperatureMax[i].innerText) * 9) / 5 + 32;
      temperatureMax[i].innerHTML = `${Math.round(temperatureFahrenheitMax)}°`;
    }

    for (let i = 0; i < temperatureMin.length; i++) {
      let temperatureFahrenheitMin =
        (parseInt(temperatureMin[i].innerText) * 9) / 5 + 32;
      temperatureMin[i].innerHTML = `${Math.round(temperatureFahrenheitMin)}°`;
    }

    for (let i = 0; i < hourlyTemperature.length; i++) {
      let temperatureHourlyFahrenheit =
        (parseInt(hourlyTemperature[i].innerText) * 9) / 5 + 32;
      hourlyTemperature[i].innerHTML = `${Math.round(
        temperatureHourlyFahrenheit
      )}°`;
    }

    celsiusActive = !celsiusActive;
  }
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#day-temperature");
  let feelsLikeElement = document.querySelector("#feels-like");
  let unitFeelsLikeElement = document.querySelector("#feels-like-unit");

  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  celciusLink.classList.remove("inactive");
  fahrenheitLink.classList.add("inactive");

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  feelsLikeElement.innerHTML = Math.round(feelsLikeCelsiusTemperature);
  unitFeelsLikeElement.innerHTML = "°C";

  if (!celsiusActive) {
    let temperatureMax = document.querySelectorAll(".forecast-temperature-max");
    let temperatureMin = document.querySelectorAll(".forecast-temperature-min");
    let hourlyTemperature = document.querySelectorAll(".hourly-temperature");

    for (let i = 0; i < temperatureMax.length; i++) {
      let temperatureCelsiusMax =
        ((parseInt(temperatureMax[i].innerText) - 32) * 5) / 9;
      temperatureMax[i].innerHTML = `${Math.round(temperatureCelsiusMax)}°`;
    }

    for (let i = 0; i < temperatureMin.length; i++) {
      let temperatureCelsiusMin =
        ((parseInt(temperatureMin[i].innerText) - 32) * 5) / 9;
      temperatureMin[i].innerHTML = `${Math.round(temperatureCelsiusMin)}°`;
    }

    for (let i = 0; i < hourlyTemperature.length; i++) {
      let temperatureHourlyCelsius =
        ((parseInt(hourlyTemperature[i].innerText) - 32) * 5) / 9;
      hourlyTemperature[i].innerHTML = `${Math.round(
        temperatureHourlyCelsius
      )}°`;
    }

    celsiusActive = !celsiusActive;
  }
}

let celsiusTemperature = null;
let feelsLikeCelsiusTemperature = null;
let celsiusActive = true;

let locationButton = document.querySelector(".current-location-button");
locationButton.addEventListener("click", getLocation);

let searchForm = document.querySelector("#searching-form");
searchForm.addEventListener("submit", handleSubmit);

let searchNewYork = document.querySelector("#new-york-link");
searchNewYork.addEventListener("click", displayNewYorkWeather);

let searchLondon = document.querySelector("#london-link");
searchLondon.addEventListener("click", displayLondonWeather);

let searchParis = document.querySelector("#paris-link");
searchParis.addEventListener("click", displayParisWeather);

let searchSydney = document.querySelector("#sydney-link");
searchSydney.addEventListener("click", displaySydneyWeather);

let searchTokyo = document.querySelector("#tokyo-link");
searchTokyo.addEventListener("click", displayTokyoWeather);

let searchTelAviv = document.querySelector("#tel-aviv-link");
searchTelAviv.addEventListener("click", displayTelAvivWeather);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemperature);

searchCity("Kyiv");
