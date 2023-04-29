let apiKey = "349039acab4517a804dcf4a9066de7b5";

let now = new Date();

let time = now.toLocaleTimeString("eu-PT", {
  hour: "2-digit",

  minute: "2-digit",
});

console.log(time);
console.log(now);

let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentDay = weekDays[now.getDay()];
console.log(currentDay);

let months = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "June",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let month = months[now.getMonth()];
console.log(month);

let day = now.getDate();
console.log(day);

let year = now.getFullYear();
console.log(year);

let weekDay = weekDays[now.getDay()];
console.log(weekDay);

function displayCurrentTime() {
  let p = document.querySelector("#current-time");
  console.log(p);

  p.innerHTML = time;
}
displayCurrentTime();

function displayCurrentWeekDay() {
  let h5 = document.querySelector("#current-day-week");
  h5.innerHTML = currentDay;
}
displayCurrentWeekDay();

let celsiusTemperature = null;
let celsiusMaxTemp = null;
let celsiusMinTemp = null;

function displayCurrentTemp(response) {
  console.log(response);
  console.log(response.data.list[0].main.temp);

  let cityNameElement = document.querySelector("#current-city");
  cityNameElement.innerHTML = response.data.city.name;

  let currentData = response.data.list[0];
  let currentTemp = Math.round(currentData.main.temp);
  let windSpeed = Math.round(currentData.wind.speed);
  let maxTemp = Math.round(currentData.main.temp_max);
  let minTemp = Math.round(currentData.main.temp_min);
  let currentHumidity = Math.round(currentData.main.humidity);

  celsiusTemperature = Math.round(currentData.main.temp);
  celsiusMaxTemp = maxTemp;
  celsiusMinTemp = minTemp;

  let currentDescription = currentData.weather[0].description;
  console.log(currentDescription);
  let capitalizedDescription =
    currentDescription.charAt(0).toUpperCase() + currentDescription.slice(1);

  let descriptionElement = document.querySelector(
    "#current-weather-description"
  );
  descriptionElement.innerHTML = capitalizedDescription;

  let weatherIcon = currentData.weather[0].icon;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weatherIcon}.png`
  );

  let currentWindSpeedElement = document.querySelector("#wind");
  currentWindSpeedElement.innerHTML = `${windSpeed}km/h`;

  let currentHumidityElement = document.querySelector("#humidity");
  currentHumidityElement.innerHTML = `${currentHumidity}%`;

  let temperatureObj = {
    currentTemp: celsiusTemperature,
    maxTemp: celsiusMinTemp,
    minTemp: celsiusMaxTemp,
    suffix: "ºC",
  };

  updateTemperaturesElements(temperatureObj);
}

function getCurrentCityWeatherAndUpdateDom(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCurrentTemp);
}

getCurrentCityWeatherAndUpdateDom("Coimbra");

function handleSearch(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-city-input");
  let searchInputValue = searchInputElement.value;
  getCurrentCityWeatherAndUpdateDom(searchInputValue);
}

/**
 * This function updates the displayed temperatures in celsius or fahreneit
 *
 * @param {{currentTemp: number, maxTemp:number, minTemp:number, suffix:string}} tempObj
 */
function updateTemperaturesElements(tempObj) {
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = `${tempObj.currentTemp}`;

  let currentMaxTempElement = document.querySelector("#max-temp");
  currentMaxTempElement.innerHTML = `${tempObj.maxTemp}${tempObj.suffix}`;

  let currentMinTempElement = document.querySelector("#min-temp");
  currentMinTempElement.innerHTML = `${tempObj.minTemp}${tempObj.suffix}`;
}

function showFharenheitTemp(event) {
  event.preventDefault();

  let fahrenheitTemp = Math.round((celsiusTemperature * 9) / 5 + 32);
  let fahrenheitMinTemp = Math.round((celsiusMinTemp * 9) / 5 + 32);
  let fahrenheitMaxTemp = Math.round((celsiusMaxTemp * 9) / 5 + 32);

  const tempObject = {
    currentTemp: fahrenheitTemp,
    maxTemp: fahrenheitMinTemp,
    minTemp: fahrenheitMaxTemp,
    suffix: "ºF",
  };

  updateTemperaturesElements(tempObject);

  celsiusLink.classList.add("temp-type-link");
  fahrenheitLink.classList.remove("temp-type-link");

  celsiusLink.classList.remove("temp-selected");
  fahrenheitLink.classList.add("temp-selected");
  console.log(fahrenheitLink.classList);
}

function showCelsiusTemp(event) {
  event.preventDefault();

  updateTemperaturesElements({
    currentTemp: celsiusTemperature,
    maxTemp: celsiusMinTemp,
    minTemp: celsiusMaxTemp,
    suffix: "ºC",
  });

  celsiusLink.classList.remove("temp-type-link");
  fahrenheitLink.classList.add("temp-type-link");

  celsiusLink.classList.add("temp-selected");
  fahrenheitLink.classList.remove("temp-selected");
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSearch);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFharenheitTemp);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemp);
