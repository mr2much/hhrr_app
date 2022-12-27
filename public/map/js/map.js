async function loadEntries() {
  const res = await fetch(API_URL);
  return res.json();
}

// const map = L.map('map', { center: [0, 0], zoom: 2 });

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//   attribution: '<a href="www.geoboundaries.org">geoBoundaries</a>',
// }).addTo(map);

async function showCandidatosInMap() {
  const allCandidatos = await loadEntries();
  //   var dataLayer = L.geoJson({ features: [{ name: 'Samana' }] });

  //   dataLayer.addTo(map);

  console.log(allCandidatos);

  showCountryRegion({});
}

showCandidatosInMap();
