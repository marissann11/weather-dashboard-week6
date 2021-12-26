let submitButtonEl = document.querySelector("#submit-btn");
let cityInput = document.querySelector("#city");
//let currentWeather = document.querySelector(".current-weather")

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
        //let currentTemp = document.createElement('div');
        //currentWeather.appendChild(currentTemp);
        //currentTemp.appendChild(temp);
        let humidity = data.main.humidity;
        let wind = data.wind.speed;
        console.log(temp, humidity, wind);
        getUvi(data.coord.lon, data.coord.lat);
    })
    function getUvi(lon, lat) {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d91f911bcf2c0f925fb6535547a5ddc9`)
        .then(function(res) {
            return res.json()
        })
        .then(function(data) {
            let uvi = data.current.uvi;
            console.log(uvi);
        })
    }
}

