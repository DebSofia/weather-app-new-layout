let apiKey = "349039acab4517a804dcf4a9066de7b5";

let now = new Date();

let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

const NUMBER_OF_DAYS_FORECAST = 4;

function displayCurrentDateTime(timeShift) {
  console.log("displayCurrentTime.timeShift", timeShift);

  let currentDate = new Date();

  currentDate.setSeconds(currentDate.getSeconds() + timeShift);

  let time = toUtcTime(currentDate);

  let timeElement = document.querySelector("#current-time");
  timeElement.innerHTML = time;

  let currentDay = weekDays[currentDate.getUTCDay()];

  let h5 = document.querySelector("#current-day-week");
  h5.innerHTML = currentDay;
}

/**
 *
 * @param {Date} date
 * @returns
 */
function toUtcTime(date) {
  return ` ${formatWithTwoDigits(date.getUTCHours())}:${formatWithTwoDigits(
    date.getUTCMinutes()
  )}`;
}

function formatWithTwoDigits(numb) {
  if (numb < 10) {
    return "0" + numb;
  } else {
    return numb;
  }
}

displayCurrentDateTime(0);

let celsiusTemperature = null;
let celsiusMaxTemp = null;
let celsiusMinTemp = null;
let forescastDataList = null;
let cityName = null;
let timeShift = null;

function displayCurrentTemp(response) {
  console.log(response);
  console.log(response.data.list[0].main.temp);

  forescastDataList = response.data.list;
  cityName = response.data.city.name;
  timeShift = response.data.city.timezone;

  let cityNameElement = document.querySelector("#current-city");
  cityNameElement.innerHTML = response.data.city.name;

  let currentData = response.data.list[0];
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
  displayForecast(
    forescastDataList.map((f) => {
      return {
        dt_txt: f.dt_txt,
        icon: f.weather[0].icon,
        description: f.weather[0].description,
        temp: f.main.temp,
        suffix: "ºC",
      };
    }),
    cityName,
    timeShift
  );
  displayCurrentDateTime(timeShift);
}

function getCurrentCityWeatherAndUpdateDom(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCurrentTemp);
}

function displayForecast(forecastList, cityName, timeShift) {
  const forecastElement = document.querySelectorAll(".second-city");
  const forecastDescriptionElement = document.querySelectorAll(
    ".current-description-forecast"
  );
  const forecastDegreesElement = document.querySelectorAll(
    ".secondary-temperature"
  );
  const forecastWeekDayElement = document.querySelectorAll(".week-day");
  const iconElement = document.querySelectorAll(".forecast-icon");

  for (let i = 0; i < NUMBER_OF_DAYS_FORECAST; i++) {
    const date = new Date();

    date.setSeconds(date.getSeconds() + timeShift);
    date.setDate(date.getDate() + i + 1);

    const fullDate = `${date.toISOString().split("T")[0]} 12:00:00`;
    const forecast = forecastList.find((f) => fullDate === f.dt_txt);

    let weatherIcon = forecast.icon;

    iconElement[i].setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${weatherIcon}.png`
    );

    let secondDescription = forecast.description;
    console.log(secondDescription);
    let capitalizedSecondDescription =
      secondDescription.charAt(0).toUpperCase() + secondDescription.slice(1);

    forecastDescriptionElement[i].innerHTML = capitalizedSecondDescription;
    forecastDegreesElement[i].innerHTML = `${Math.round(forecast.temp)} ${
      forecast.suffix
    }`;
    forecastWeekDayElement[i].innerHTML = weekDays[date.getDay()];
    forecastElement[i].innerHTML = cityName;
  }
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

  displayForecast(
    forescastDataList.map((f) => {
      return {
        dt_txt: f.dt_txt,
        icon: f.weather[0].icon,
        description: f.weather[0].description,
        temp: Math.round((f.main.temp * 9) / 5 + 32),
        suffix: "ºF",
      };
    }),
    cityName,
    timeShift
  );

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

  displayForecast(
    forescastDataList.map((f) => {
      return {
        dt_txt: f.dt_txt,
        icon: f.weather[0].icon,
        description: f.weather[0].description,
        temp: f.main.temp,
        suffix: "ºC",
      };
    }),
    cityName,
    timeShift
  );

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

function onLocationConfirm(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const locationUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  axios
    .get(locationUrl)
    .then((response) => {
      // Extract city name from the response
      const city = response.data[0].name;
      console.log(`City: ${city}`);
      getCurrentCityWeatherAndUpdateDom(city);
    })
    .catch((error) => {});
}

function onLocationCancel(params) {}

function getCurrentPosition(params) {
  navigator.geolocation.getCurrentPosition(
    onLocationConfirm,
    onLocationCancel,
    {}
  );
}
const currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);
