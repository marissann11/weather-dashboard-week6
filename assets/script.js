$(document).ready(function () {
  let submitButtonEl = document.querySelector("#submit-btn");
  let cityInput = document.querySelector("#city");
  let cardZone = document.querySelector("#weather-card");
  let forecastZone = document.querySelector("#forecast-card");
  let formZone = document.querySelector("#form-card");

  // Function called when user manually searches for a city name that calls getWeather
  function getCity(e) {
    e.preventDefault();
    let cityName = cityInput.value;
    getWeather(cityName);
  }

  submitButtonEl.addEventListener("click", getCity);

  async function getWeather(cityName) {
    // Because all elements are dynamically created, this makes sure they are removed after new searches
    let weatherContainerEl = document.querySelector(".weather-container");
    if (weatherContainerEl) {
      weatherContainerEl.remove();
    }
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?appid=d91f911bcf2c0f925fb6535547a5ddc9&q=${cityName}&units=imperial`
    );
    const res = await response.json();

    let iconUrl = `https://openweathermap.org/img/w/${res.weather[0].icon}.png`;
    let currentDate = res.dt * 1000;

    // Dynamically creates main weather container with current weather of city
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
    saveSearch(cityName);
    $(".previous-btn").remove();
    displayHistory();
  }
  // A separate fetch was needed using the lon and lat coordinates to retrieve the uvi
  async function getUvi(lon, lat) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`
    );
    const res = await response.json();

    const cardUvi = document.createElement("p");

    cardUvi.setAttribute("class", "card-text");

    cardUvi.innerHTML = `UV Index: <span id="uvi">${res.current.uvi}</span>`;

    $("#card-body").append(cardUvi);

    // Adds classes based on uvi severity
    if (res.current.uvi <= 3) {
      $("#uvi").addClass("bg-success p-2 text-light rounded");
    } else if (res.current.uvi < 7) {
      $("#uvi").addClass("bg-warning p-2 text-light rounded");
    } else {
      $("#uvi").addClass("bg-danger p-2 text-light rounded");
    }
  }
  // Separate fetch using lon and lat for 5 day forecast
  async function getFiveDay(lon, lat) {
    // Removes current forecast (if applicable) before dynamically creating the new one
    if ($(".forecast-container")) {
      $(".forecast-container").remove();
    }
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`
    );
    const res = await response.json();

    for (i = 1; i <= 5; i++) {
      let iconUrl = `https://openweathermap.org/img/w/${res.daily[i].weather[0].icon}.png`;
      let dateTitle = res.daily[i].dt * 1000;

      const dailyContainer = document.createElement("div");
      const dailyDate = document.createElement("h4");
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
      dailyTemp.textContent = `Temp: ${res.daily[i].temp.day} °F`;
      dailyWind.textContent = `Wind: ${res.daily[i].wind_speed} MPH`;
      dailyHumidity.textContent = `Humidity: ${res.daily[i].humidity} %`;

      dailyContainer.append(dailyBody);
      dailyBody.append(
        dailyDate,
        dailyIcon,
        dailyTemp,
        dailyWind,
        dailyHumidity
      );
      forecastZone.append(dailyContainer);
    }
  }
  function saveSearch(cityName) {
    let searchedCities = JSON.parse(localStorage.getItem("cityname"));

    // If there are no cities in local storage, a new array is created. Unshift is to move city names to beginning rather than end
    if (searchedCities == null) {
      searchedCities = [];
      searchedCities.unshift(cityName);
      localStorage.setItem("cityname", JSON.stringify(searchedCities));
    }
    // User can only have max 8 previous buttons saved for quick searches
    if (searchedCities.length > 7) {
      searchedCities.pop();
    }
    if (!searchedCities.includes(cityName)) {
      searchedCities.unshift(cityName);
      localStorage.setItem("cityname", JSON.stringify(searchedCities));
    }
  }
  function displayHistory() {
    let searchedCities = JSON.parse(localStorage.getItem("cityname"));

    if (searchedCities) {
      for (i = 0; i < searchedCities.length; i++) {
        const previousBtn = document.createElement("button");

        previousBtn.setAttribute("class", "btn previous-btn");

        previousBtn.setAttribute("value", searchedCities[i]);

        previousBtn.textContent = searchedCities[i];

        previousBtn.onclick = checkHistory;

        formZone.append(previousBtn);
      }
    }
  }
  // Function called with click of a previous city button which redirects to getWeather function
  function checkHistory() {
    const cityName = this.value;
    getWeather(cityName);
  }

  displayHistory();
});
