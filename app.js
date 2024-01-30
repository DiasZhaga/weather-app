const express = require("express");
const axios = require("axios");
const app = express();
const moment = require("moment")

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { weather: null, location: null, newsData: null, sunriseSunsetData: null, error: null });
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = "b4b857a7d9d5a5c22c2c848613ab8a24";
  const googleMapsApiKey = "AIzaSyDsUA7j-lZ0J3sPtd_Lreq9v4cDnFWfMX0";
  const newsApiKey = "58e2cb2eebbf4003a5c0d968ca8175e5";

  let weather, location, newsData, sunriseSunsetData;
  let error = null;

  try {
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    weather = weatherResponse.data;

    const geocodingResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${googleMapsApiKey}`);
    location = geocodingResponse.data.results[0].geometry.location;

    const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(city)}&apiKey=${newsApiKey}`);
    newsData = newsResponse.data;

    const sunriseSunsetResponse = await axios.get(`https://api.sunrisesunset.io/json?lat=${location.lat}&lng=${location.lng}`);
    sunriseSunsetData = sunriseSunsetResponse.data.results;

    if (sunriseSunsetData) {
      sunriseSunsetData.sunrise = moment(sunriseSunsetData.sunrise, 'hh:mm A').format('HH:mm');
      sunriseSunsetData.sunset = moment(sunriseSunsetData.sunset, 'hh:mm A').format('HH:mm');
    }

  } catch (error) {
    weather = null;
    location = null;
    newsData = null;
    sunriseSunsetData = null;
    error = error.message || "Error, please try again";
  }
 
  res.render("index", { weather, location, newsData, sunriseSunsetData, error });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
