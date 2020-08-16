const express = require("express");
var app = express();
const request = require('request-promise');
app.set("view engine", "ejs");
const config = require("./config.js");
var weatherAPIKey=config.config["weatherAPIKey"];
var imgAPIKey = config.config["imgAPIKey"];
var imgs =[];
function make_api_call(id) {
  return request({
    url: `https://api.unsplash.com/search/photos/?query=${id}%20city%20skyline&page=1&per_page=1&client_id=${imgAPIKey}`,
    method: "GET",
    json: true,
  });
}
async function processImgs(cities) {
  imgs=[];
  let result;
  for (let i = 0; i < cities.length; i++) {
    result = await make_api_call(cities[i]);
    imgs[i] = result.results[0].urls.small;
    console.log(cities[i]);
    console.log(imgs[i]);
  }
  return imgs;
}
async function findImgs(cities, res, bodyOfResponse) {
  let result = await processImgs(cities);
  res.render("home", {
    response: bodyOfResponse,
    imgs: imgs,
  });
}




app.get("/", function (req, res) {
  var bodyOfResponse;
  request(`http://api.openweathermap.org/data/2.5/group?id=2643743,6167863,993800,6173331,524894,3369157,1787093,1819729&appid=${weatherAPIKey}&units=metric`, function (error, response, body) {
    console.log("New Request");
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    bodyOfResponse = JSON.parse(body);
    console.log(bodyOfResponse);
    var cities=[];
    bodyOfResponse.list.forEach((city) => {
      cities.push(city.name);
    });
    findImgs(cities, res, bodyOfResponse);
  });

});




app.listen(3000, function () {
  console.log("Server has started");
})