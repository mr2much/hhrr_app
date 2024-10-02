window.addEventListener('DOMContentLoaded', (e) => {
  async function loadEntries() {
    const res = await fetch('/api/v1/candidatos/all');

    return res.json();
  }

  function setupMap() {
    // Initialize map
    const map = L.map('chartdiv').setView([51.505, -0.09], 13);

    // add tile layer to map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Geocoding by <a href="https://nominatim.org">Nominatim</a>',
    }).addTo(map);

    return map;
  }

  function importCustomMarker(candidate) {
    const { imgUrl } = candidate;
    return L.icon({
      iconUrl: imgUrl,
      iconSize: [35, 35],
    });

    // Allow crossorigin, or else, the marker won't show
    // return L.Icon.Default.mergeOptions({ crossOrigin: true });
  }

  function circleMarker() {
    return L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500,
    });
  }

  function polygonMarker() {
    return L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047],
    ]);
  }

  function showMarkers(map, candidatos) {
    candidatos.forEach((candidato) => {
      const candidateMarker = importCustomMarker(candidato);

      const marker = L.marker(candidato.countryRegionData.latLon, {
        icon: candidateMarker,
      }).addTo(map);

      marker
        .bindPopup(
          `<strong>Nombre:</strong><br><a href="/api/v1/candidatos/${candidato._id}">${candidato.nombres} ${candidato.apellidos}</a><br><strong>LatLon: </strong> ${candidato.countryRegionData.latLon}`
        )
        .openPopup();
    });

    const roundMarker = circleMarker().addTo(map);
    roundMarker.bindPopup('I am a circle');

    const pMarker = polygonMarker().addTo(map);
    pMarker.bindPopup('I am a polygon');

    // Create standalone popup on map
    L.popup()
      .setLatLng([51.513, -0.09])
      .setContent('I am a standalone popup.')
      .openOn(map);

    // openOn() function automatically closes previously opened
    // popups, and opens the last one
  }

  function onMapClick(e) {
    alert(`You clicked the map at ${e.latlng}`);
  }

  function displayMap(candidatos) {
    const map = setupMap();

    showMarkers(map, candidatos);

    map.on('click', onMapClick);
  }

  async function showCandidatosInMap() {
    const allCandidatos = await loadEntries();

    displayMap(allCandidatos);
  }

  showCandidatosInMap();
});
