



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


function displayCurrentTemp(response){
  console.log(response);
  console.log(response.data.list[0].main.temp);

  let cityNameElement = document.querySelector("#current-city");
  

  let currentData = response.data.list[0];

  let currentTemp = Math.round(currentData.main.temp);
  console.log(currentTemp);

  let currentTempElement = document.querySelector("#current-temp");
  currentTempElement.innerHTML=`${currentTemp}ºC `;

  let windSpeed = Math.round(currentData.wind.speed);
  console.log(windSpeed);
  let maxTemp = Math.round(currentData.main.temp_max);
  console.log(maxTemp);
  let minTemp = Math.round(currentData.main.temp_min);
  console.log(minTemp);
  let currentHumidity = Math.round(currentData.main.humidity);
  console.log(currentHumidity);

  let currentDescription = currentData.weather[0].description;
  console.log(currentDescription);
  let capitalizedDescription =  currentDescription.charAt(0).toUpperCase()
  + currentDescription.slice(1)

  let descriptionElement = document.querySelector("#current-weather-description");
  descriptionElement.innerHTML = capitalizedDescription;

  let weatherIcon = currentData.weather[0].icon;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src",`https://openweathermap.org/img/wn/${weatherIcon}.png`) ;

  
  let currentWindSpeedElement = document.querySelector("#wind");
  currentWindSpeedElement.innerHTML = `${windSpeed}km/h`; 

  let currentMaxTempElement = document.querySelector("#max-temp");
  currentMaxTempElement.innerHTML = `${maxTemp}ºc` 
  
  let currentMinTempElement = document.querySelector("#min-temp"); 
  currentMinTempElement.innerHTML = `${minTemp}ºc`;
  
  let currentHumidityElement = document.querySelector("#humidity");
  currentHumidityElement.innerHTML = `${currentHumidity}%`
  
}

/*
function searchCity(cityName) {
  
}



function updateData(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-city-input");
searchCity(searchInputElement.value);
} */




let apiKey = "349039acab4517a804dcf4a9066de7b5";
let cityName = "Coimbra"
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCurrentTemp);





let form = document.querySelector("#search-form");
form.addEventListener("submit", updateData);

