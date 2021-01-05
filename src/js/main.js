// Build n deploy weather widget that use navigator geolocation API 
// to get user location and uses that location to obtain current weather
// and 5 day forecast for their region

// Notes:
// utilize at least 2 diff endpoints of Open Weather Map API:
// Current Weather Data n 5 DAY/ 3 Hr forecast
// forecast is 3hr blocks means recieve 8 diff temp forcasts per day. 
// choose a single time everday that will be used as condition for the day
// Output should indicate 'Current Conditions' as today and 5days forecast
// Need to use weather icons provieded by API
// *Temp r defaulted Kelvin need to pass a parameter to endpoint to request diff unit

// API key = 73e4aecd9fe239afc4b3c42f475e94a6
// http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&units=metric&appid=73e4aecd9fe239afc4b3c42f475e94a6
// fetch by geo coors : api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// api.openweathermap.org/data/2.5/forecast?lat=49.843404799999995&lon=-97.1636736&units=metric&tnt=3&appid=73e4aecd9fe239afc4b3c42f475e94a6

// api.openweathermap.org/data/2.5/weather?lat=49.843404799999995&lon=-97.1636736&units=metric&appid=73e4aecd9fe239afc4b3c42f475e94a6
const API = "73e4aecd9fe239afc4b3c42f475e94a6";
let Lat = 0, Long = 0;

const currentConditions = document.querySelector('.current-conditions')
const future5ForeCast = document.querySelector('.forecast')

navigator.geolocation.getCurrentPosition(success, error);

function success(pos) {
  let crd = pos.coords;
  Lat = crd.latitude;
  Long = crd.longitude;
  console.log(`Latitude : ${Lat}`);
  console.log(`Longitude: ${Long}`);
  getCurrentWeather(Lat, Long);
  get5DayWeather(Lat, Long)

}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getCurrentWeather(lat, long) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${API}`)
    .then(resp => { return resp.json() })
    .then(data => { renderCurrentConditions(data) })
    .catch(err => { console.log(err) })
}

function renderCurrentConditions(data) {
  currentConditions.innerHTML = "";
  currentConditions.insertAdjacentHTML('afterbegin', `
    <h2>Current Conditions</h2>
    <img src="http://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png" />
    <div class="current">
      <div class="temp">${Math.round(data.main.temp)}℃</div>
      <div class="condition">${data.weather[0]['description']}</div>
    </div>
  `)
}
function get5DayWeather(lat, long) {
  fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&tnt=3&appid=${API}`)
    .then(resp => { return resp.json() })
    .then(data => { render5DayForeCast(data) })
    .catch(err => { console.log(err) })
}

function render5DayForeCast(futureForecast) {
  future5ForeCast.innerHTML = "";
  let minTemp=futureForecast.list[0].main['temp_max'], maxTemp=futureForecast.list[0].main['temp_min'];
  for (let forecast of futureForecast.list) {
    if(forecast.main['temp_max']>maxTemp){
      maxTemp = forecast.main['temp_max']
    } else if (forecast.main['temp_min']<minTemp){
      minTemp = forecast.main['temp_min']
    }

    if (forecast['dt_txt'].slice(-8) == "21:00:00") {
      future5ForeCast.insertAdjacentHTML('beforeend', `
        <div class="day">
        <h3>${unixTimeToDateConvert(forecast['dt'])}</h3>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0]['icon']}@2x.png" />
        <div class="description">${forecast.weather[0]['description']}</div>
        <div class="temp">
          <span class="high">${Math.round(maxTemp)}℃</span>
          /<span class="low">${Math.round(minTemp)}℃</span>
        </div>
      </div>
      `)
    }
  }
}

function unixTimeToDateConvert(time) {
  let dateObject = new Date(time * 1000)
  return dateObject.toLocaleString("en-US", { weekday: "long" })
}