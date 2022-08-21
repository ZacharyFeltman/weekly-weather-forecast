var searchText = document.getElementById("form1");
var searchBtn = document.getElementById("search-button");

const WEATHER_API_KEY = "aa84670991614cba942d9086ea82fb79";
var fiveDayForecastUrl =
  "http://api.weatherbit.io/v2.0/forecast/daily?key=" +
  WEATHER_API_KEY +
  "&units=I&days=6";
var currentWeatherUrl =
  "http://api.weatherbit.io/v2.0/current?key=" + WEATHER_API_KEY + "&units=I";

function search(query) {
  let searchHistory = JSON.parse(
    localStorage.getItem("weather_app_search_history")
  );
  if (!searchHistory) searchHistory = [];
  searchHistory.push(searchText.value);
  localStorage.setItem(
    "weather_app_search_history",
    JSON.stringify(searchHistory)
  );
  loadSearchHistory();

  let url = currentWeatherUrl + "&city=" + query;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      let data = result.data[0];
      updateDashboard(data);
    });
  url = fiveDayForecastUrl + "&city=" + searchText.value;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      let data = result.data;
      updateFiveDayForecast(data);
    });
}

function loadSearchHistory() {
  let searchHistory = JSON.parse(
    localStorage.getItem("weather_app_search_history")
  );
  if (!searchHistory) searchHistory = [];
  let wrapper = document.getElementById("searchHistory");
  wrapper.innerHTML = "";
  
  for (let i = 1; i <= 5; i++) {
    let searchIndex = searchHistory.length - i;
    if (searchIndex < 0) break;
    let searchHistoryBtn = document.createElement("button");
    searchHistoryBtn.textContent = searchHistory[searchIndex];
    searchHistoryBtn.addEventListener("click", function (e) {
      search(e.currentTarget.innerText);
    });
    wrapper.appendChild(searchHistoryBtn);
  }
}

function updateFiveDayForecast(data) {
  for (let i = 1; i <= 5; i++) {
    let date = moment().add(i, "days").format("L");
    document.getElementById("day" + i + "_date").textContent = date;
    document.getElementById("day" + i + "_icon").style =
      "background: url('http://weatherbit.io/static/img/icons/" +
      data[i].weather.icon +
      ".png');";
    document.getElementById("day" + i + "_temp").textContent =
      data[i].temp + "\u00B0F";
    document.getElementById("day" + i + "_windspeed").textContent =
      data[i].wind_spd + " MPH " + data[i].wind_cdir;
    document.getElementById("day" + i + "_humidity").textContent =
      data[i].rh + "%";
  }
}

function updateDashboard(data) {
  let now = moment().format("MMMM Do YYYY, h:mm:ss a");
  document.getElementById("city").textContent = data.city_name;
  document.getElementById("date").textContent = now;
  document.getElementById("icon").style =
    "background: url('http://weatherbit.io/static/img/icons/" +
    data.weather.icon +
    ".png');";
  document.getElementById("temp").textContent = data.temp + "\u00B0F";
  document.getElementById("windspeed").textContent =
    data.wind_spd + " MPH " + data.wind_cdir;
  document.getElementById("humidity").textContent = data.rh + "%";
  document.getElementById("uv").textContent = data.uv;
  addUvIndexColor(parseInt(data.uv));
}

function addUvIndexColor(index) {
  let uv = document.getElementById("uv");
  if (index <= 2) {
    uv.style = "background-color: green;";
  } else if (index >= 3 && index <= 5) {
    uv.style = "background-color: yello;";
  } else if (index === 6 || index === 7) {
    uv.style = "background-color: orange;";
  } else if (index >= 8 && index <= 10) {
    uv.style = "background-color: red;";
  } else {
    uv.style = "background-color: purple;";
  }
}

function getDayData(data) {
  let dayString = data.temp.min + "/" + data.temp.max;
  return dayString;
}

searchBtn.addEventListener("click", function (event) {
  let query = searchText.value;
  search(query);
});

loadSearchHistory();
