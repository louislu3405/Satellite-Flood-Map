let map = L.map('mapid').setView([-14.53, 28.06], 15);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibG91aXMzNDA1IiwiYSI6ImNrY3duZ3JnaDBmdWwycWtkdWVja3h4bnQifQ.MEcSWWH2kKRPUaJ5IjXcfQ'
}).addTo(map);

/* Temperature and Geopotencial Height in GeoTIFF with 2 bands */
d3.request("src/testTiff(1224difference).tif").responseType('arraybuffer').get(
  function (error, tiffData) {
      // Geopotential height (BAND 0)
      let geo = L.ScalarField.fromGeoTIFF(tiffData.response);

      let layerGeo = L.canvasLayer.scalarField(geo, {
          color: chroma.scale(['FFFFFF', '145bde']).domain(geo.range),
          opacity: 0.65
      }).addTo(map);
      layerGeo.on('click', function (e) {
          if (e.value !== null) {
              let v = e.value.toFixed(2);
              let html = (`<span class="popupText">Pixel difference of 1224: ${v} dB</span>`);
              let popup = L.popup()
                  .setLatLng(e.latlng)
                  .setContent(html)
                  .openOn(map);
          }
      });


      L.control.layers({
          "Geopotential Height": layerGeo,
      }, {}, {
              position: 'bottomleft',
              collapsed: false
          }).addTo(map);

      map.fitBounds(layerGeo.getBounds());

  });