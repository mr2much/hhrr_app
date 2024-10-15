window.addEventListener('DOMContentLoaded', (e) => {
  const coords = [29.950125, 2.636991];
  const zoomLevel = 2;

  const candidatoInfo = L.control();

  async function loadEntries() {
    const res = await fetch('/api/v1/candidatos/all');

    return res.json();
  }

  function setupMap() {
    // Initialize map
    const map = L.map('chartdiv').setView(coords, zoomLevel);

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

  function highlightFeature(e) {
    const layer = e.target;

    candidatoInfo.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    candidatoInfo.update();
  }

  function showCandidate(e) {
    const { id } = e.target.feature;

    window.location = `/api/v1/candidatos/${id}`;
  }

  function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.names) {
      layer.bindPopup(feature.properties.names);
    }
  }

  function getCardHTML(properties) {
    return `<div class="row g-0">
              <div class="col-md-4">
                <img src="${properties.iconUrl}" class="img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${properties.name}</h5>
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                </div>
              </div>
            </div>`;
  }

  function showCandidatoCard(map) {
    candidatoInfo.update = function (properties) {
      this._div.innerHTML = properties
        ? getCardHTML(properties)
        : `<div class="card-body">
            Click a Candidato Marker
          </div>`;
    };

    candidatoInfo.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'card mb-3');
      this._div.style.maxWidth = '300px';
      this.update();

      return this._div;
    };

    candidatoInfo.addTo(map);
  }

  function showMarkers(map, candidatos) {
    const startingCoords =
      candidatos.features[0].geometry.coordinates.toReversed();

    const geojson = L.geoJson(candidatos, {
      pointToLayer(feature, latlng) {
        return L.marker(latlng);
      },
      onEachFeature,
    }).addTo(map);

    showCandidatoCard(map);

    // map.setView(startingCoords, 8.5);
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
