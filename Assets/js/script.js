var geoCodeInfo =
  "http://api.openweathermap.org/geo/1.0/direct?appid=23b354b7d5c9e04089812b513d1cadea&q=";
var weatherInfo =
  "https://api.openweathermap.org/data/3.0/onecall?appid=23b354b7d5c9e04089812b513d1cadea&";
var searchText = document.getElementById("form1");
var searchBtn = document.getElementById("search-button");

function search(query) {
  let url = geoCodeInfo + query;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let result = data[0];
      getWeatherData(result.lat, result.lon, result.name + ", " + result.state);
    });
}

function getWeatherData(lat, lon, locale) {
  let url = weatherInfo + "lat=" + lat + "&lon=" + lon;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      updateDashboard(data, locale);
    });
}

function updateDashboard(data, locale) {
  document.getElementById("city").textContent = locale;
  document.getElementById("date").textContent = "";
  document.getElementById("icon").textContent = data.current.weather[0].icon;
  document.getElementById("temp").textContent = data.current.temp;
  document.getElementById("windspeed").textContent = data.current.wind_speed;
  document.getElementById("humidity").textContent = data.current.humidity;
  document.getElementById("uv").textContent = data.current.uvi;
  document.getElementById("day1").textContent= getDayData(data.daily[1]);
  document.getElementById("day2").textContent= getDayData(data.daily[2]);
}

function getDayData(data) {
    return data.temp.min + "/" + data.temp.max
}

searchBtn.addEventListener("click", function (event) {
  let query = searchText.value;
  search(query);
});
