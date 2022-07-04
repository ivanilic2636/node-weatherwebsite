const request = require("request");

const forecast = (lat, long, callback) => {
    const url =
      "http://api.weatherstack.com/current?access_key=39735eaeed605ac0922e8d4b7cbc8a69&query=" +
      lat +
      "," +
      long +
      "&units=m";
   // request({ url: url, json: true }, (error, response) => {
    request({ url, json: true }, (error, {body}) => {
      if (error) {
        callback("Could not connect to server", undefined);
      } else if (body.error) {
        callback("Unable to find location", undefined);
      } else {
        callback(undefined, {
          description: body.current.weather_descriptions[0],
          temperature: body.current.temperature,
          feels_like_temperature: body.current.feelslike,
        });
      }
    });
  };


module.exports = forecast;