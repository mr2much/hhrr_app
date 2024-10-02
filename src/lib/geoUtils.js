const axios = require('axios');

function getCoordinatesFromCountryAndRegion(countryRegion) {
  const { country, region } = countryRegion;

  const address = `${country}, ${region}`;

  console.log('Address', address);
}

module.exports = { getCoordinatesFromCountryAndRegion };
