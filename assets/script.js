let submitButtonEl = document.querySelector("#submit-btn");
let cityInput = document.querySelector("#city");
let cardZone = document.querySelector("#weather-card");

submitButtonEl.addEventListener("click", getWeather);

async function getWeather(event) {
  event.preventDefault();
  let cityName = document.querySelector("#city").value;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?appid=d91f911bcf2c0f925fb6535547a5ddc9&q=${cityName}&units=imperial`
  );
  const res = await response.json();

  let iconUrl = `https://openweathermap.org/img/w/${res.weather[0].icon}.png`;

  const cardContainer = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h4');
  const cardIcon = document.createElement('img');
  const cardTemp = document.createElement('p');
  const cardWind = document.createElement('p');
  const cardHumidity = document.createElement('p');

  cardContainer.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  cardBody.setAttribute('id', 'card-body');
  cardTitle.setAttribute('class', 'card-title');
  cardIcon.setAttribute('src', iconUrl);
  cardTemp.setAttribute('class', 'card-text');
  cardWind.setAttribute('class', 'card-text');
  cardHumidity.setAttribute('class', 'card-text');

  cardTitle.textContent = cityName;
  cardTemp.textContent = `Temp: ${res.main.temp} °F`
  cardWind.textContent = `Wind: ${res.wind.speed} MPH`
  cardHumidity.textContent = `Humidity: ${res.main.humidity} %`

  cardContainer.append(cardBody);
  cardTitle.append(cardIcon);
  cardBody.append(cardTitle, cardTemp, cardWind, cardHumidity);
  cardZone.append(cardContainer);
  
  getUvi(res.coord.lon, res.coord.lat);
  getFiveDay(cityName);
}
async function getUvi(lon, lat) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d91f911bcf2c0f925fb6535547a5ddc9`
  );
  const res = await response.json();
  
  const cardUvi = document.createElement('p');
  cardUvi.setAttribute('class', 'card-text');
  cardUvi.textContent = `UVI: ${res.current.uvi}`
  let cardBody = document.querySelector("#card-body");
  cardBody.append(cardUvi);
}
async function getFiveDay(cityName) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=d91f911bcf2c0f925fb6535547a5ddc9`
  )
  const res = await response.json();
    console.log(res);
}

