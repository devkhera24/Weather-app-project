const apiKey = process.env.API_KEY;  // Replace with your OpenWeatherMap API key

require('dotenv').config();
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const errorMessage = document.getElementById("error-message");
  const weatherBox = document.getElementById("weatherBox");


  if (city === "") {
    errorMessage.textContent = "⚠️ Please enter a city name.";
    weatherBox.style.display = "none";
    return;
  }


  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");


    const data = await response.json();


    // UV Index
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const uvData = await uvResponse.json();


    // Display data
    document.getElementById("cityName").textContent = data.name + ", " + data.sys.country;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("temperature").textContent = data.main.temp + "°C";
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("wind").textContent = data.wind.speed;
    document.getElementById("pressure").textContent = data.main.pressure;
    document.getElementById("uv").textContent = uvData.value;


    document.getElementById("weatherIcon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


    // Reset effects
    document.body.className = "";
    clearRainEffect();
    clearSnowEffect();
    clearStars();


    // Determine if it’s day or night
    const currentTime = data.dt;  // current UTC time (seconds)
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const isNight = currentTime < sunrise || currentTime > sunset;


    const mainWeather = data.weather[0].main.toLowerCase();


    if (isNight) {
      document.body.classList.add("night");
      createStars(); // add stars
    }


    // Weather-specific effects
    if (mainWeather.includes("cloud")) {
      document.body.classList.add(isNight ? "cloudy-night" : "cloudy");
    } else if (mainWeather.includes("rain")) {
      document.body.classList.add(isNight ? "rainy-night" : "rainy");
      createRainEffect();
    } else if (mainWeather.includes("clear")) {
      document.body.classList.add(isNight ? "clear-night" : "sunny");
    } else if (mainWeather.includes("snow")) {
      document.body.classList.add(isNight ? "snowy-night" : "snowy");
      createSnowEffect();
    }


    weatherBox.style.display = "block";
    errorMessage.textContent = "";


  } catch (error) {
    weatherBox.style.display = "none";
    errorMessage.textContent = "❌ City not found. Try again!";
    clearRainEffect();
    clearSnowEffect();
    clearStars();
  }
}


/* ---- Rain Effect ---- */
function createRainEffect() {
  clearRainEffect();
  for (let i = 0; i < 50; i++) {
    let drop = document.createElement("div");
    drop.className = "raindrop";
    drop.style.left = Math.random() * window.innerWidth + "px";
    drop.style.animationDuration = 0.5 + Math.random() * 0.5 + "s";
    document.body.appendChild(drop);
  }
}
function clearRainEffect() {
  document.querySelectorAll(".raindrop").forEach(e => e.remove());
}


/* ---- Snow Effect ---- */
function createSnowEffect() {
  clearSnowEffect();
  for (let i = 0; i < 30; i++) {
    let snow = document.createElement("div");
    snow.className = "snowflake";
    snow.style.left = Math.random() * window.innerWidth + "px";
    snow.style.fontSize = (10 + Math.random() * 15) + "px";
    snow.style.animationDuration = (3 + Math.random() * 5) + "s";
    document.body.appendChild(snow);
  }
}
function clearSnowEffect() {
  document.querySelectorAll(".snowflake").forEach(e => e.remove());
}


/* ---- Stars Effect ---- */
function createStars() {
  clearStars();
  for (let i = 0; i < 50; i++) {
    let star = document.createElement("div");
    star.className = "star";
    star.style.top = Math.random() * window.innerHeight + "px";
    star.style.left = Math.random() * window.innerWidth + "px";
    document.body.appendChild(star);
  }
}
function clearStars() {
  document.querySelectorAll(".star").forEach(e => e.remove());
}
