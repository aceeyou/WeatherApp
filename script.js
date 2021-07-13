// const searchElement = document.querySelector("[data-city-search]")
// const searchBox = new.google.maps.places.searchBox(searchElement)
// searchBox.addListener('places_changed', () => {
//     const place = searchBox.getPlaces()[0]
//     if (place == null) return
//     const latitude = place.geometry.location.lat()
//     const longitude = place.geometry.location.lng()
//     fetch('/weather', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify({
//             latitude: latitude,
//             longitude: longitude
//         })
//     }).then(res => res.json()).then(data => {
//         setWeatherData(data, place.formatted_address)
//     })
// })

// const { response } = require("express");



let weather = {
    apiKey: "b86bf176c27b9d252a336e7190d12ac8",
    longi:0,
    lati:0,
    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&units=metric&appid="
            + this.apiKey
        ).then((response) => response.json())
        .then((data) => this.displayWeather(data))
        .catch(err => {
            let locationErr = document.querySelector(".location-error-text")
            locationErr.style.height = "auto"
            locationErr.style.visibility = "visible"
            locationErr.style.transform = "translateY(0px)"

            setTimeout(function() {
                // locationErr.style.height = "0"
                locationErr.style.visibility = "hidden"
                locationErr.style.transform = "translateY(-60px)"
            }, 3000)
        })
    },
    fetchWeatherByCoords: function() {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat="
            + this.lati
            + "&lon="
            + this.longi
            + "&units=metric&appid="
            + this.apiKey
        ).then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { feels_like } = data.main;
        
        console.log(name, icon, description, temp, humidity, speed, feels_like);
        document.querySelector("#location").innerText = name + ", " + temp + " °C";
        document.querySelector("#description").innerText = description;
        document.querySelector("#weather-icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

        document.querySelector(".wind-speed").innerHTML = speed + 'kph<ion-icon name="leaf" class="leaf-icon detail-icon"></ion-icon';
        document.querySelector(".humidity").innerHTML = humidity + '%<ion-icon name="water" class="water-icon detail-icon"></ion-icon>';
        document.querySelector(".feels_like").innerHTML = feels_like + ' °C <ion-icon name="thermometer"></ion-icon>';
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-input").value);
        document.querySelector(".search-input").value = "";
    },
};

document.querySelector(".search-input").addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        weather.search();
        document.querySelector(".search-input").value = "";
    }
})

function getInput(){
    weather.search();
}

const successCallback = (position) => {
    weather.lati = position.coords.latitude;
    weather.longi = position.coords.longitude;

    weather.fetchWeatherByCoords();
}

navigator.geolocation.getCurrentPosition(successCallback);
