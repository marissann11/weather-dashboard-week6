let submitButtonEl = document.querySelector("#submit-btn");
let cityInput = document.querySelector("#city");


submitButtonEl.addEventListener("click", getWeather);

function getWeather(event) {
    event.preventDefault();
    console.log("button works")
    let cityName = document.querySelector("#city").value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?appid=d91f911bcf2c0f925fb6535547a5ddc9&q=${cityName}&units=imperial`)
    .then(function(res) {
        return res.json()
    })
    .then(function(data) {
        let temp = data.main.temp;
        let humidity = data.main.humidity;
        let wind = data.wind.speed;
        console.log(temp, humidity, wind);
        getUvi(data.coord.lon, data.coord.lat);
        console.log(data);
        let iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        $("#weather-icon").attr('src', iconUrl)
    })
    function getUvi(lon, lat) {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d91f911bcf2c0f925fb6535547a5ddc9`)
        .then(function(res) {
            return res.json()
        })
        .then(function(data) {
            let uvi = data.current.uvi;
            console.log(uvi);
        });
        getFiveDay();
    }
    function getFiveDay() {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=d91f911bcf2c0f925fb6535547a5ddc9`)
        .then(function(res) {
            return res.json()
        })
        .then(function(data) {
            // loop through array 5 times to get temp, wind, humidity, and icon for next 5 days
            console.log(data)
        })
    }
}

