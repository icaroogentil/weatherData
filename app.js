var express = require("express");
var bodyParser = require("body-parser");
const axios = require("axios");

var app = express();

app.use(bodyParser.json());

app.get("/weatherData", async function (req, res) {
  var zipCode = req.query.zipCode;
  const geoCode = await getGeocode(zipCode);
  const weatherStation = await getWeatherStation(geoCode.ibge);
  res.send({
    instant_temperature: weatherStation.dados.TEM_INS,
    instant_moisture: weatherStation.dados.UMD_INS,
  });
});
const getGeocode = async (zipCode) => {
  var response;
  try {
    response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

const getWeatherStation = async (geoCode) => {
  var response;
  try {
    response = await axios.get(
      `https://apiprevmet3.inmet.gov.br/estacao/proxima/${geoCode}`
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};
app.listen(8000, function () {
  console.log("Servidor rodando na porta 8000.");
});
