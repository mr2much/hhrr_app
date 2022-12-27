window.addEventListener('DOMContentLoaded', (e) => {
  // const map = L.map('map', { center: [0, 0], zoom: 2 });

  // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //   attribution: '<a href="www.geoboundaries.org">geoBoundaries</a>',
  // }).addTo(map);

  //Display amchart map when country and region being selected
  function showCountryRegion(candidatos) {
    const candidatoCountryData = [];

    candidatos.forEach((candidato) => {
      const { country, selectedIndex, selectedRegion } =
        candidato.country_region_data;

      let selectedCountryCode = country_region[selectedIndex][0];
      selectedCountryCode = selectedCountryCode.replace('1', '');

      $.getJSON(
        '../crddm/plugins/amcharts/gds-amchart-mapping.json',
        function (json) {
          for (let i = 0; i < json.length; i++) {
            let country_code = json[i].geodatasource_country;
            let region_name = json[i].geodatasource_region;
            let region_code = json[i].amchart_id;

            if (
              selectedCountryCode === country_code &&
              selectedRegion === region_name
            ) {
              candidatoCountryData.push({
                id: country_code,
                name: country,
                selected: true,
                fill: am4core.color('#F05C5C'),
              });
            }
          }
        }
      );
    });

    const chart = am4core.create('chartdiv', am4maps.MapChart);

    chart.geodata = am4geodata_worldHigh;

    chart.projection = new am4maps.projections.Miller();

    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ['AQ'];
    polygonSeries.useGeodata = true;
    polygonSeries.data = candidatoCountryData;

    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = am4core.color('#74b266');
    polygonTemplate.propertyFields.fill = 'fill';
  }

  async function showCandidatosInMap() {
    const allCandidatos = await loadEntries();
    //   var dataLayer = L.geoJson({ features: [{ name: 'Samana' }] });

    //   dataLayer.addTo(map);

    showCountryRegion(allCandidatos);
  }

  async function loadEntries() {
    const res = await fetch(API_URL);
    return res.json();
  }

  showCandidatosInMap();
});
