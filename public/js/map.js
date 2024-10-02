window.addEventListener('DOMContentLoaded', (e) => {
  // const map = L.map('map', { center: [0, 0], zoom: 2 });
  // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //   attribution: '<a href="www.geoboundaries.org">geoBoundaries</a>',
  // }).addTo(map);
  // Display amchart map when country and region being selected
  // function showCountryRegion(candidatos) {
  //   const candidatoCountryData = [];
  //   const excludeCountryData = [];
  //   candidatos.forEach((candidato) => {
  //     const { country, region } = candidato;
  //     const selectedCountryData = country_region.filter((data) =>
  //       data.includes(country)
  //     );
  //     let selectedCountryCode = selectedCountryData[0][0];
  //     selectedCountryCode = selectedCountryCode.replace('1', '');
  //     const selectedRegion = region;
  //     const titles = [];
  //     let amchart_id;
  //     $.getJSON('/crddm/plugins/amcharts/gds-amchart-mapping.json', (json) => {
  //       for (let i = 0; i < json.length; i++) {
  //         const country_code = json[i].geodatasource_country;
  //         const region_name = json[i].geodatasource_region;
  //         const region_code = json[i].amchart_id;
  //         // if (selectedCountryCode === country_code) {
  //         //   console.log('candidato:', selectedCountryCode);
  //         //   console.log('code:', country_code);
  //         // }
  //         // if (selectedRegion === region_name) {
  //         //   console.log('candidato:', selectedRegion);
  //         //   console.log('region:', region_name);
  //         // }
  //         if (
  //           selectedCountryCode === country_code &&
  //           selectedRegion === region_name
  //         ) {
  //           amchart_id = region_code;
  //           candidatoCountryData.push({
  //             id: country_code,
  //             name: country,
  //             selected: true,
  //             fill: am4core.color('#F05C5C'),
  //           });
  //         }
  //       }
  //     });
  //   });
  //   const chart = am4core.create('chartdiv', am4maps.MapChart);
  //   chart.geodata = am4geodata_worldHigh;
  //   chart.projection = new am4maps.projections.Miller();
  //   const polygonSeries = new am4maps.MapPolygonSeries();
  //   polygonSeries.useGeodata = true;
  //   chart.series.push(polygonSeries);
  //   const polygonTemplate = polygonSeries.mapPolygons.template;
  //   polygonSeries.data = candidatoCountryData;
  //   polygonTemplate.tooltipText = '{name}';
  //   polygonTemplate.interactive = true;
  //   polygonTemplate.strokeWidth = 2;
  //   // polygonTemplate.fill = am4core.color('#74b266');
  //   polygonTemplate.propertyFields.fill = 'fill';
  //   const hs = polygonTemplate.states.create('hover');
  //   hs.properties.fill = am4core.color('#f0fb25');
  //   polygonSeries.exclude = ['AQ'];
  //   // polygonSeries.exclude = excludeCountryData;
  // }
  // async function loadEntries() {
  //   const res = await fetch('/api/v1/candidatos/all');
  //   return res.json();
  // }
  // async function showCandidatosInMap() {
  //   const allCandidatos = await loadEntries();
  //   showCountryRegion(allCandidatos);
  // }
  // showCandidatosInMap();
  // async function displayMap(candidatos) {
  //   const candidatoCountryData = [];
  //   const drCandidates = [];

  //   const geoData = await $.getJSON(
  //     '/crddm/plugins/amcharts/gds-amchart-mapping.json'
  //   );

  //   candidatos.forEach((candidato) => {
  //     const { country, selectedIndex, region } = candidato.countryRegionData;

  //     let selectedCountryCode = country_region[selectedIndex][0];
  //     selectedCountryCode = selectedCountryCode.replace('1', '');

  //     const region_id = geoData.find(
  //       (entry) =>
  //         entry.geodatasource_country === selectedCountryCode &&
  //         entry.geodatasource_region === region
  //     );

  //     if (selectedCountryCode === 'DO') {
  //       drCandidates.push({
  //         id: selectedCountryCode,
  //         country,
  //         region,
  //         region_id: region_id.amchart_id,
  //         title: `${candidato.nombres} ${candidato.apellidos}`,
  //         value: candidato.exp_salario,
  //         fill: am4core.color('#f05c5c'),
  //       });
  //     } else {
  //       candidatoCountryData.push({
  //         id: selectedCountryCode,
  //         country,
  //         region,
  //         region_id: region_id.amchart_id,
  //         title: `${candidato.nombres} ${candidato.apellidos}`,
  //         value: candidato.exp_salario,
  //         fill: am4core.color('#f05c5c'),
  //       });
  //     }
  //   });

  //   const map = am4core.create('chartdiv', am4maps.MapChart);
  //   map.geodata = am4geodata_worldHigh;
  //   map.projection = new am4maps.projections.Miller();

  //   const worldSeries = new am4maps.MapPolygonSeries();
  //   map.series.push(worldSeries);
  //   worldSeries.useGeodata = true;
  //   worldSeries.exclude = ['AQ'];
  //   worldSeries.data = candidatoCountryData;

  //   // polygonSeries.include = candidatoCountryData;

  //   // Configure series
  //   const polygonTemplate = worldSeries.mapPolygons.template;
  //   polygonTemplate.tooltipText = '{name}: {title}';
  //   polygonTemplate.fill = am4core.color('#74b266');
  //   polygonTemplate.propertyFields.fill = 'fill';

  //   // Create hover state and set alternative fill color
  //   const hs = polygonTemplate.states.create('hover');
  //   hs.properties.fill = am4core.color('#367b25');

  //   const repDomSeries = map.series.push(new am4maps.MapPolygonSeries());
  //   repDomSeries.geodata = am4geodata_dominicanRepublicHigh;
  //   repDomSeries.data = drCandidates;

  //   const drPolygonTemplate = repDomSeries.mapPolygons.template;
  //   drPolygonTemplate.tooltipText = '{name}';
  //   drPolygonTemplate.fill = am4core.color('#00b266');
  //   // drPolygonTemplate.propertyFields.id = 'id';

  //   const drHs = drPolygonTemplate.states.create('hover');
  //   drHs.properties.fill = am4core.color('#360025');

  //   const labelSeries = map.series.push(new am4maps.MapImageSeries());
  //   const labelTemplate = labelSeries.mapImages.template.createChild(
  //     am4core.Label
  //   );

  //   labelTemplate.horizontalCenter = 'middle';
  //   labelTemplate.verticalCenter = 'middle';
  //   labelTemplate.fill = am4core.color('#000');
  //   labelTemplate.fontSize = 12;
  //   labelTemplate.nonScaling = true;
  //   labelTemplate.interactionsEnable = false;

  //   repDomSeries.events.on('inited', () => {
  //     drCandidates.forEach((candidate) => {
  //       const polygon = repDomSeries.getPolygonById(candidate.region_id);

  //       if (polygon) {
  //         const label = labelSeries.mapImages.create();
  //         label.latitude = polygon.visualLatitude;
  //         label.longitude = polygon.visualLongitude;
  //         label.children.getIndex(0).text = candidate.title;
  //       }
  //     });
  //   });

  //   map.zoomControl = new am4maps.ZoomControl();
  // }

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

  function importCustomMarker() {
    // return L.icon({
    //   iconUrl: '/res/img/leaflet/marker-icon.png',
    //   iconSize: [25, 41],
    //   iconAnchor: [12, 41],
    //   shadowUrl: '/res/img/leaflet/marker-shadow.png',
    //   shadowSize: [41, 41],
    // });

    // Allow crossorigin, or else, the marker won't show
    return L.Icon.Default.mergeOptions({ crossOrigin: true });
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

  function showMarkers(map) {
    // importCustomMarker();

    const marker = L.marker([51.5, -0.09]).addTo(map);

    marker
      .bindPopup('<strong>Hello World!</strong><br>I am a popup.')
      .openPopup();

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

    showMarkers(map);

    map.on('click', onMapClick);
  }

  async function showCandidatosInMap() {
    const allCandidatos = await loadEntries();

    displayMap(allCandidatos);
  }

  showCandidatosInMap();
});
