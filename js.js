let url = 'http://api.weatherapi.com/v1/forecast.json?key=5930211b4ea74a12b2d125418252904&q='
let city = 'London'
let input_search = document.getElementById("search_input")
let result_weather = document.querySelector(".weather_info")
let submit = document.querySelector(".btn-submit")
let days = '&days=14'
let week_result = document.querySelector("#week_result")
let select_city = document.querySelector("#select_city")
let backgroundElement = document.querySelector("#back_source")
let videoElement = document.querySelector(".background-video")

videoElement.load();
videoElement.play();

function loadWeather(city) {
    fetch(url + city + days)
        .then(async function (response) {
            let data = await response.json()
            console.log(data)
            drawWeatherInfo(data)
            drawWeatherPerWeek(data.forecast.forecastday)
            changeBackground(data.current.condition.text)
        })
        .catch(function(error) {
            console.error("Помилка:", error)
            result_weather.innerHTML = "<p>Не вдалося завантажити дані погоди.</p>"
        })
}

loadWeather(city)

submit.addEventListener("click", function (event) {
    event.preventDefault();
    city = input_search.value.trim();
    input_search.value = "";
    let lowerCity = city.toLowerCase();
    let existingOption = Array.from(select_city.options).find(
        opt => opt.value.toLowerCase() === lowerCity
    );

    if (existingOption) {
        select_city.value = existingOption.value; 
    } else {
        let newOption = document.createElement("option");
        newOption.value = city;
        newOption.textContent = city;
        select_city.appendChild(newOption);
        select_city.value = city;
    }
    loadWeather(city)
})
function drawWeatherInfo(city){
    result_weather.innerHTML = ""
    let weatherElement = document.createElement('div')
    weatherElement.classList.add("weatherElement")
    weatherElement.innerHTML = `
    <div class="top_pannel">
        <h2>${city.location.name}</h2>
        <img src="${city.current.condition.icon}">
    </div>
    <div class="central_pannel">
        <h2 class="date">${city.location.localtime}</h2>
        <h2 class="temp">${city.current.temp_c}℃</h2>
        <h2 class="text">${city.current.condition.text}</h2>
    </div>
    <div class="bottom_pannel">
        <div class="b_info"><h2>${city.current.wind_kph} km/h</h2><h2>Wind</h2></div>
        <div class="b_info"><h2>Hum</h2><h2>${city.current.humidity} %</h2></div>
    </div>
    `
    result_weather.append(weatherElement)
}

select_city.addEventListener("change", function(){
    city = this.value
    loadWeather(city)
    console.log(city)
})

function drawWeatherPerWeek(city) {
    week_result.innerHTML = ""
    city.forEach((day)=>{
        const dayName = getDayName(day.date);
        let dayElement = document.createElement('div')
        dayElement.classList.add("dayElement")
        dayElement.innerHTML = `
            <img src="${day.day.condition.icon}">
            <h2 class="temp">${day.day.maxtemp_c}℃ / ${day.day.mintemp_c}℃</h2>
            <h2 class="text">${day.day.condition.text}</h2>
            <h2 class="text">${dayName}</h2>
            <h2 class="text">${day.date}</h2>
        `
        week_result.appendChild(dayElement)
    })
}

function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" }); // наприклад: "Monday"
}

function changeBackground(state) {
    switch (state) {
        case "Sunny" :
        backgroundElement.setAttribute("src", "./video/sunny.mp4")
        break

        case "Patchy rain nearby" :
        backgroundElement.setAttribute("src", "./video/rain.mp4")
        break

        case "Overcast" :
        backgroundElement.setAttribute("src", "./video/overcast.mp4")
        break
        
        case "Partly cloudy" :
        backgroundElement.setAttribute("src", "./video/partlyCloudy.mp4")
        break

        default :
        backgroundElement.setAttribute("src", "./video/default.mp4")
        
    }
    videoElement.load();
    videoElement.play();
}