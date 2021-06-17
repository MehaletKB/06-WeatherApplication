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
        getCityData(search.value);
        console.log(search.value);
    }
}

function getCityData(){
    fetch(`${api.BASE_URL}weather?q=${search.value}&units=imperial&appid=${api.key}`)
    .then(function(response){
        return response.json();
    })
    .then(getCityLocation);
}


function getCityLocation(response){
    console.log(response);

    // Set up response for invalid search
    if (response.cod === "404"){
        document.querySelector(".error").innerHTML = "Please enter a valid city name";
        search.value = "";
    }

    // Display searched location
    var location = document.querySelector(".searched-location");
    location.innerHTML = `${response.name}, ${response.sys.country}`;
    
    // Display temperature of searched location in Fahrenheit
    var temp = document.querySelector(".searched-location-temp");
    temp.innerHTML = `${Math.round(response.main.temp)}°`
    
    // Get Coordinates for searched location
    var longitude = response.coord.lon;
    var latitude = response.coord.lat;

    // Fetch data for UV and daily forecast
    fetch(`${api.BASE_URL}onecall?lat=${latitude}&lon=${longitude}&appid=${api.key}`)
    .then(function(response){
        return response.json();
    })
    .then(displayData)
}

function displayData(response){
    console.log(response);

    // Get time and date of searched location
    var timeStamp = response.current.dt;
    var dateTime = new Date(timeStamp * 1000);
    document.querySelector(".searched-location-date").innerHTML = (dateTime.toUTCString());

    // Display corresponding icon
    var weatherIcon = document.querySelector(".weather-icon");
    var weatherIconURL = "http://openweathermap.org/img/w/";
    var weatherIconCode = response.current.weather[0].icon;
    weatherIcon.src = weatherIconURL + weatherIconCode + ".png";

    // Display weather description
    var description = document.querySelector(".searched-weather-description");
    description.innerHTML = `${response.current.weather[0].description}`

    // Display humidity percentage
    var humidity = document.querySelector("#searched-location-humidity");
    humidity.innerHTML = `Humidity: ${response.current.humidity}%`

    // Display wind speed in mph
    var windSpeed = document.querySelector("#searched-location-wind");
    windSpeed.innerHTML = `Wind Speed: ${response.current.wind_speed} MPH`;

    // Display UV Index
    var uvIndex = document.querySelector("#searched-location-uvIndex");
    uvIndex.innerHTML = response.current.uvi;

    // Change UV Index value into integer 
    uvIndexInt = parseInt(uvIndex.innerHTML);

    // Change class depending on UV Index value
    function changeUVStatus(){
        if(uvIndexInt < 3){
            $(".uv").addClass("good")
        } else if(uvIndexInt > 3 && uvIndexInt < 7) {
            $(".uv").removeClass("good")
            $(".uv").addClass("moderate")
        } else if (uvIndexInt > 6) {
            $(".uv").removeClass("good")
            $(".uv").removeClass("moderate")
            $(".uv").addClass("bad")
            }
        }        
        changeUVStatus()


        function displayForecast(){
            // var forecastElement = document.querySelector(".card-body");
            var forecastArray = response.daily
            console.log(forecastArray)

            for(let i = 1; i < 6; i++){
                var dailyTemp = forecastArray[i].temp.day;
                console.log(dailyTemp)

                var dailyWind = forecastArray[i].wind_speed;
                console.log(dailyWind)

                var dailyHumidity = forecastArray[i].humidity;
                console.log(dailyHumidity)
            }
            
            


        }
        displayForecast()




            // var forecastDay = "";
            // console.log(forecastDay)
            // response.daily.forEach((value, index) => {
            //     if(index > 0){
            //         var dayName = new Date(value.dt * 1000).toLocaleDateString("en", { weekday: "long",});
            //         var dayIcon = value.weather[0].icon;
            //         var dayTemp = value.temp.day.toFixed(0)
            //         forecastDay = `<div class="forecast-day">
            //         <p>${dayName}</p>
            //         <p><span class="ico-${dayIcon}" title="${dayIcon}"></span></p>
            //         <div class="forecast-day--temp">${dayTemp}<sup>°C</sup></div>
            //         </div>`
            //         forecastElement[0].insertAdjacentHTML('afterbegin', forecastDay)
                }
        //     })
        // }
        // displayForecast()



    // function getDaily(data){
    //     for (let i = 1; i <= 5; i++){
    //         var dailyForcast = createDailyForecast(data.daily[i]);
    //         getDaily(dailyForcast)
    //     }
    // }

    // funtion createDailyForecast (){
    //     var dayName = getDayName
    // }