/* Global Variables */
const baseUrl = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Function that fetches weather information from openwearthermao.org
const getWeatherInfo = async (url, key, zipCode) => {
  try {
    const res = await fetch(`${url}${zipCode}&appid=${key}`);
    const weatherData = await res.json();
    if (weatherData.cod === 200) {
      console.log(weatherData);
      return { error: false, weatherData };
    }
    throw new Error(weatherData.message ? weatherData.message : "An error occured fetching weather info.");
  }
  catch (err) {
    return { error: true, message: err.message };
  }
}

// Helper function that post data to the server/backend
const postData = async (url, data) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(data)
    });

    const resData = await res.json();
    if (resData.status === "OK") {
      return { error: false };
    }
    throw new Error("Something went wrong processing your request. Try again later or contact site administrator for help.");
  }
  catch (err) {
    return { error: true, message: err.message };
  }
}

// Helper function that fetches data from the server
const getData = async () => {
  try {
    let res = await fetch("/weather");
    res = await res.json();
    if (res.status === "OK" && res.data) {
      const resData = res.data;
      document.getElementById("date").innerHTML = resData.weatherInfo.hasOwnProperty("date") ? "<span class='entryTitle'>Date:</span> " + resData.weatherInfo.date : "";
      document.getElementById("temp").innerHTML = resData.weatherInfo.hasOwnProperty("temperature") ? "<span class='entryTitle'>Temperature:</span> " + resData.weatherInfo.temperature : "";
      document.getElementById("content").innerHTML = resData.weatherInfo.hasOwnProperty("content") ? "<span class='entryTitle'>How You're Feeling:</span> " + resData.weatherInfo.content : "";
    }
    else {
      throw new Error("Something went wrong fetching data from server.");
    }
  }
  catch (err) {
    alert(err.message);
  }
}

//Generate button click handler
const generateHandler = () => {
  const zipCode = document.getElementById("zip").value;
  if (zipCode === "") {
    alert("Enter zip code");
    return;
  }
  getWeatherInfo(baseUrl, apiKey, zipCode)
    .then(res => {
      if (res.error) {
        throw new Error(res.message);
      }
      // weather info was returned successfully. Go ahead and post to the server
      const userFeelings = document.getElementById("feelings").value;
      const data = {
        temperature: res.weatherData.main.temp ? res.weatherData.main.temp : '',
        date: newDate,
        content: userFeelings,
      }
      postData("/weather/add", data)
        .then(res => {
          if (res.error) {
            throw new Error(res.message);
          }
          getData(); // fetch the new data
        })
    })
    .catch(err => alert(err.message));
}

document.getElementById("generate").addEventListener("click", generateHandler);