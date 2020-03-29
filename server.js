// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 3000;
const server = app.listen(port, ()=> {
  console.log(`Server is running on localhost:${port}`);
});

// setting up routes

// get index page route
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

// get weather data route
app.get("/weather", (req, res) => {
  res.send({status:"OK", data: projectData});
});

// Post route
app.post("/weather/add", (req, res) => {
  const data = req.body;
  const newData = {
    temperature : data.temperature ? data.temperature : '',
    date : data.date ? data.date : '',
    content : data.content ? data.content : ''
  }

  projectData.weatherInfo = newData;
  res.send({status:"OK", data: newData});
});
