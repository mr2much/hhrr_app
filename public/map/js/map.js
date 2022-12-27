window.addEventListener('DOMContentLoaded', (e) => {
  // const map = L.map('map', { center: [0, 0], zoom: 2 });

  // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //   attribution: '<a href="www.geoboundaries.org">geoBoundaries</a>',
  // }).addTo(map);

  //Display amchart map when country and region being selected
  function showCountryRegion(candidato) {
    const { country, selectedIndex, selectedRegion } =
      candidato.country_region_data;

    //Get selected country code and region name from dropdown menu
    var selectedCountryCode = country_region[selectedIndex][0];
    // var selectedCountryCode =
    //   country_region[countryRegionData.selectedCountryIndex][0];
    // var selectedRegion = regionElement.options[regionElement.selectedIndex].value;

    // Implement amChart Map function -- US will be demonstrate as an example
    var countryMaps = {
      //   US: ['usaHigh'],
      DO: ['dominicanRepublicHigh'],
      //You may add other countries as below based on SVG filename in amChart
      //"AF": ["afghanistanHigh"],
      //"AL": ["albaniaHigh"]
    };

    var titles = [];
    var amchart_id;
    if (countryMaps[selectedCountryCode] !== undefined) {
      var currentMap = countryMaps[selectedCountryCode][0];
    }

    //Use mapping file
    $.getJSON(
      '../crddm/plugins/amcharts/gds-amchart-mapping.json',
      function (json) {
        for (var i = 0; i < json.length; i++) {
          //Get data from mapping file
          var country_code = json[i].geodatasource_country;
          var region_name = json[i].geodatasource_region;
          var region_code = json[i].amchart_id;

          //   console.log(`country_code: ${country_code}`);
          //   console.log(`region_name: ${region_name}`);
          //   console.log(`region_code: ${region_code}`);

          if (
            selectedCountryCode === country_code &&
            selectedRegion === region_name
          ) {
            amchart_id = region_code;

            console.log(
              `amchart_id: ${amchart_id} for region_code: ${region_code}`
            );

            //Set up amChart map
            var map = AmCharts.makeChart('chartdiv', {
              type: 'map',
              theme: 'none',
              dataProvider: {
                mapURL:
                  'https://www.amcharts.com/lib/3/maps/svg/' +
                  currentMap +
                  '.svg',
                zoomLevel: 0.9,
                areas: [
                  {
                    id: amchart_id,
                    showAsSelected: true,
                  },
                ],
              },
              areasSettings: {
                autoZoom: true,
                balloonText: '<strong>[[title]]</strong>',
                selectedColor: '#397ea8',
              },
              zoomControl: {
                minZoomLevel: 0.9,
              },
              titles: titles,
            });
          }
        }
      }
    );
  }

  async function showCandidatosInMap() {
    const allCandidatos = await loadEntries();
    //   var dataLayer = L.geoJson({ features: [{ name: 'Samana' }] });

    //   dataLayer.addTo(map);

    allCandidatos.forEach((candidato) => {
      showCountryRegion(candidato);
    });
  }

  async function loadEntries() {
    const res = await fetch(API_URL);
    return res.json();
  }

  showCandidatosInMap();
});
