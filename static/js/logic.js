var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(queryUrl, function(data) {

    createFeatures(data.features);
});

function createFeatures(earthquakeData) {


  // Popup
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  

  // geojson data
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255-80*feature.properties.mag);
      var b = Math.floor(255-80*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // creating map layer
  createMap(earthquakes);
  
}

function createMap(earthquakes) {

 
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})


  var baseMaps = {
    "Street Map": streetmap
  };

 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      38, -100
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });


  function getColor(m) {
      return m < 1 ? 'rgb(255,255,255)' :
            m < 2  ? 'rgb(255,225,225)' :
            m < 3  ? 'rgb(255,195,195)' :
            m < 4  ? 'rgb(255,165,165)' :
            m < 5  ? 'rgb(255,135,135)' :
            m < 6  ? 'rgb(255,105,105)' :
            m < 7  ? 'rgb(255,75,75)' :
            m < 8  ? 'rgb(255,45,45)' :
            m < 9  ? 'rgb(255,15,15)' :
                        'rgb(255,0,0)';
  }

  // Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      for (var d = 0; d < grades.length; d++) {
          div.innerHTML +=
              '<d style="background:' + getColor(grades[d] + 1) + '">&nbsp&nbsp&nbsp&nbsp</d> ' +
              grades[d] + (grades[d + 1] ? '&ndash;' + grades[d + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}