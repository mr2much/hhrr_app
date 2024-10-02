const axios = require('axios');

async function getCoordinatesFromCountryAndRegion(countryRegion) {
  const { country, region } = countryRegion;

  const address = `${country}, ${region}`;

  const res = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}
  `,
    { headers: { 'User-Agent': 'hhrr_app/1.0 (anubis.lockward@gmail.com)' } }
  );

  if (res.data.length > 0) {
    const { lat, lon } = res.data[0];

    return [lat, lon];
  }
}

module.exports = { getCoordinatesFromCountryAndRegion };
