let submitButtonEl = document.querySelector("#submit-btn");
let cityInput = document.querySelector("#city");
let cardZone = document.querySelector("#weather-card");
let forecastZone = document.querySelector("#forecast-card");

submitButtonEl.addEventListener("click", getWeather);

async function getWeather(event) {
  // why arent you working anymore???
  let weatherContainerEl = document.querySelector(".weather-container");
  if (weatherContainerEl) {
    weatherContainerEl.remove();
  }
  event.preventDefault();
  let cityName = document.querySelector("#city").value;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?appid=d91f911bcf2c0f925fb6535547a5ddc9&q=${cityName}&units=imperial`
  );
  const res = await response.json();

  let iconUrl = `https://openweathermap.org/img/w/${res.weather[0].icon}.png`;
  let currentDate = res.dt * 1000;

  const cardContainer = document.createElement("div");
  const cardBody = document.createElement("div");
  const cardTitle = document.createElement("h4");
  const cardDate = document.createElement("h4");
  const cardIcon = document.createElement("img");
  const cardTemp = document.createElement("p");
  const cardWind = document.createElement("p");
  const cardHumidity = document.createElement("p");

  cardContainer.setAttribute("class", "card weather-container");
  cardBody.setAttribute("class", "card-body");
  cardBody.setAttribute("id", "card-body");
  cardTitle.setAttribute("class", "card-title, text-capitalize");
  cardIcon.setAttribute("src", iconUrl);
  cardTemp.setAttribute("class", "card-text");
  cardWind.setAttribute("class", "card-text");
  cardHumidity.setAttribute("class", "card-text");

  cardTitle.textContent = cityName;
  cardDate.textContent = new Date(currentDate).toLocaleDateString();
  cardTemp.textContent = `Temp: ${res.main.temp} °F`;
  cardWind.textContent = `Wind: ${res.wind.speed} MPH`;
  cardHumidity.textContent = `Humidity: ${res.main.humidity} %`;

  cardContainer.append(cardBody);
  cardTitle.append(cardDate, cardIcon);
  cardBody.append(cardTitle, cardTemp, cardWind, cardHumidity);
  cardZone.append(cardContainer);

  getUvi(res.coord.lon, res.coord.lat);
  getFiveDay(res.coord.lon, res.coord.lat);
}
async function getUvi(lon, lat) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d91f911bcf2c0f925fb6535547a5ddc9`
  );
  const res = await response.json();

  const cardUvi = document.createElement("p");
  cardUvi.setAttribute("class", "card-text");
  cardUvi.textContent = `UV Index: ${res.current.uvi}`;
  let cardBody = document.querySelector("#card-body");
  cardBody.append(cardUvi);
}
async function getFiveDay(lon, lat) {
  // NEED A WAY TO DO THIS THAT WILL ACTUALLY WORK
  let forecastContainerEl = document.querySelector(".forecast-container");
  if (forecastContainerEl) {
    forecastContainerEl.remove();
  }
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`
  );
  const res = await response.json();

  for (i = 0; i < 5; i++) {
    let iconUrl = `https://openweathermap.org/img/w/${res.daily[i].weather[0].icon}.png`;
    // NEED A WAY TO MAKE THIS START ON 1 NOT 0 IN ARRAY
    let dateTitle = res.daily[i].dt * 1000

    const dailyContainer = document.createElement("div");
    const dailyDate = document.createElement('h4');
    const dailyBody = document.createElement("div");
    const dailyIcon = document.createElement("img");
    const dailyTemp = document.createElement("p");
    const dailyWind = document.createElement("p");
    const dailyHumidity = document.createElement("p");

    dailyContainer.setAttribute("class", "card forecast-container");
    dailyBody.setAttribute("class", "card-body");
    dailyDate.setAttribute("class", "card-title");
    dailyIcon.setAttribute("src", iconUrl);
    dailyTemp.setAttribute("class", "card-text");
    dailyWind.setAttribute("class", "card-text");
    dailyHumidity.setAttribute("class", "card-text");

    dailyDate.textContent = new Date(dateTitle).toLocaleDateString();
    dailyTemp.textContent = `Temp: ${res.daily[i].temp.day} °F`
    dailyWind.textContent = `Wind: ${res.daily[i].wind_speed} MPH`
    dailyHumidity.textContent = `Humidity: ${res.daily[i].humidity} %`

    dailyContainer.append(dailyBody);
    dailyBody.append(dailyDate, dailyIcon, dailyTemp, dailyWind, dailyHumidity);
    forecastZone.append(dailyContainer);
  }
}

// btn-secondary  for previous search buttons 