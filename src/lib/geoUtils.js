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

// buildGeoJSONFromCandidatos = (candidatos) => ({
//   type: 'FeatureCollection',
//   features: candidatos.map((candidato) => ({
//     id: candidato._id,
//     type: 'Feature',
//     properties: {
//       name: candidato.fullName,
//       age: candidato.age,
//       iconUrl: candidato.imgUrl,
//     },
//     geometry: {
//       type: 'Point',
//       coordinates: candidato.countryRegionData.latLon.slice().reverse(),
//     },
//   })),
// });

buildGeoJSONFromCandidatos = (candidatos) => {
  const geoJSONFeaturesByRegion = {};

  candidatos.forEach((candidato) => {
    const candidatoName = candidato.fullName;
    const { region, latLon } = candidato.countryRegionData;

    if (geoJSONFeaturesByRegion[region]) {
      geoJSONFeaturesByRegion[region].properties.names += `<br>
      <div class="row g-0">
        <div class="col-md-3 d-flex justify-content-center align-items-center">
          <img src="${candidato.imgUrl}" class="img-small img-fluid rounded-start" alt="Photo for ${candidatoName}">
        </div>
        <div class="col-md-9">
          <div class="card-body">
            <h5 class="card-title fs-6 m-0 p-0">${candidatoName}</h5>
            <a href="/api/v1/candidatos/${candidato._id}">Ver detalles</a>
          </div>
        </div>
      </div>`;
    } else {
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: latLon.slice().reverse() },
        properties: {
          region,
          names: `<div class="row g-0">
                    <div class="col-md-3 d-flex justify-content-center align-items-center">
                      <img src="${candidato.imgUrl}" class="img-small img-fluid rounded-start" alt="Photo for ${candidatoName}">
                    </div>
                    <div class="col-md-9">
                      <div class="card-body">
                        <h5 class="card-title fs-6 m-0 p-0">${candidatoName}</h5>
                        <a href="/api/v1/candidatos/${candidato._id}">Ver detalles</a>
                      </div>
                    </div>
                  </div>`,
        },
      };
      geoJSONFeaturesByRegion[region] = feature;
    }
  });

  const geoJSONFeatures = {
    type: 'FeatureCollection',
    features: Object.values(geoJSONFeaturesByRegion),
  };
  return geoJSONFeatures;
};

module.exports = {
  getCoordinatesFromCountryAndRegion,
  buildGeoJSONFromCandidatos,
};
