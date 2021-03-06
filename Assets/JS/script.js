const api = {
    key: "7055b12a6623e70c9988cf2e89bf1f83",
    BASE_URL: "https://api.openweathermap.org/data/2.5/"
}

var search = document.querySelector(".search-text");
const searchButton = document.querySelector(".search-button");

searchButton.addEventListener("click", getWeatherInfo);

const searchedCitiesArray = [];

function getWeatherInfo(event){
    event.preventDefault();
    if(event){
        getCityData(search.value);
        saveLocation(search.value)
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
    // console.log(response);

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
        } else if(uvIndexInt >= 3 && uvIndexInt < 7) {
            $(".uv").removeClass("good")
            $(".uv").addClass("moderate")
        } else if (uvIndexInt > 6) {
            $(".uv").removeClass("good")
            $(".uv").removeClass("moderate")
            $(".uv").addClass("bad")
            }
        }        
        changeUVStatus();


        function displayForecast(){
            // Create array from response data
            var forecastArray = response.daily;
            
            // Display 5 day forecast
            var forecastElement = document.querySelector(".daily-forecast");
            forecastElement.innerHTML= "";

            // Loop through forecast array starting from day after current day and pick out needed data
            for(let i = 1; i < 6; i++){
                var dailyDay= new Date(forecastArray[i].dt * 1000).toDateString();

                var dailyIconCode = forecastArray[i].weather[0].icon;
                var dailyIconURL = "http://openweathermap.org/img/w/" + dailyIconCode + ".png";

                var dailyTemp = forecastArray[i].temp.day;
                var dailyTemp_F = (((dailyTemp - 273.15) *1.8) + 32).toFixed(0);

                var dailyWind = forecastArray[i].wind_speed;

                var dailyHumidity = forecastArray[i].humidity;

                // Use template literals to display forecast
                var displayDailyForecast = 
                        `<div class="card each-day">
                            <ul>
                                <li class="dayOfWeek" >${dailyDay}</li>
                                <img src="${dailyIconURL}" class= "daily-icon">
                                <li>Temp: ${dailyTemp_F}°F</li>
                                <li>Wind: ${dailyWind} MPH</li>
                                <li>Humidity: ${dailyHumidity}%</li>
                            </ul>
                        </div>`;
                forecastElement.innerHTML += displayDailyForecast;
            }
        }

        displayForecast();
        search.value = "";
}

const searchedCities = document.querySelector("#searched-city-btn")
searchedCities.addEventListener("click", getSavedLocationData)

function saveLocation(){
    searchedCitiesArray.push(search.value)
    // console.log(searchedCitiesArray)
    localStorage.setItem("saved-location", JSON.stringify(searchedCitiesArray))
    var savedLocation=
    `<button type="button" class="list-group-item list-group-item-action" id= "searched-city-btn" aria-current="true">${search.value}
    </button>`;
    searchedCities.innerHTML += savedLocation;
}



function getSavedLocationData(event){
    event.preventDefault
    
    // searchedCitiesArray.forEach(displayLocationData)

    // function displayLocationData(){
       
    // }
}