const api = {
    key: "7055b12a6623e70c9988cf2e89bf1f83",
    BASE_URL: "https://api.openweathermap.org/data/2.5/"
}

const search = document.querySelector(".search-text");
const button = document.querySelector(".search-button");

button.addEventListener("click", getWeatherInfo);

function getWeatherInfo(event){
    event.preventDefault();
    if(event){
        getData(search.value);
        console.log(search.value);
    }
}

function getData(){
    fetch(`${api.BASE_URL}weather?q=${search.value}&units=imperial&appid=${api.key}`)
    .then(function(response){
        return response.json();
    })
    .then(displayData);
}

function displayData(response){
    console.log(response);
        var location = document.querySelector(".searched-location");
        location.innerHTML = `${response.name}, ${response.sys.country}`;

        var timeStamp = response.dt;
        var dateTime = new Date(timeStamp * 1000);
        var localDateTime = document.querySelector(".searched-location-date");
        localDateTime.innerHTML = (dateTime.toUTCString())

        var temp = document.querySelector(".searched-location-temp");
        temp.innerHTML = `${Math.round(response.main.temp)}°`

        var weatherIcon = document.querySelector(".weather-icon");
        var weatherIconURL = "http://openweathermap.org/img/w/";
        var weatherIconCode = response.weather[0].icon;
        weatherIcon.src = weatherIconURL + weatherIconCode + ".png";

        var description = document.querySelector(".searched-weather-description");
        description.innerHTML = `${response.weather[0].description}`

        var humidity = document.querySelector("#searched-location-humidity");
        humidity.innerHTML = `Humidity: ${response.main.humidity}%`

        var windSpeed = document.querySelector("#searched-location-wind");
        windSpeed.innerHTML = `Wind Speed: ${response.wind.speed} MPH`

        var longitude = response.coord.lon;
        var latitude = response.coord.lat;

        fetch(`${api.BASE_URL}onecall?lat=${latitude}&lon=${longitude}&appid=${api.key}`)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data)
            var uvIndex = document.querySelector("#searched-location-uvIndex");
            uvIndex.innerHTML = `${data.current.uvi}`
            uvIndexInt = parseInt(uvIndex.innerHTML)

            function changeUVStatus() {
                if(uvIndexInt < 3){
                    $(".uv").addClass("good")
                } else if(uvIndexInt > 3 && uvIndexInt < 7) {
                    $(".uv").removeClass("good")
                    $(".uv").addClass("moderate")
                } else {
                    $(".uv").removeClass("good")
                    $(".uv").removeClass("moderate")
                    $(".uv").addClass("bad")
                }
            }
            changeUVStatus()
        })



    }
