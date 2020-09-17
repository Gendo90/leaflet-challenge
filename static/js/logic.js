// Creating map object
let myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8,
    worldCopyJump: true
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

//get geoJSON data and add markers to map

let USGS_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let counter = 0;

let colorCutoffDepths = [10, 30, 50, 70, 90]
let colorMap = { 0: "00FFFF", 1: "00FF00", 2: "80FF00", 3: "FFFF00", 4: "FF8000", 5: "FF0000"};

d3.json(USGS_url, function(data) {
    for (let i = 0; i < data.features.length; i++) {
        let curr_quake = data.features[i]
        let quake_time = new Date(curr_quake.properties["time"])
        let mag_scale = curr_quake.properties["mag"]
        let quake_depth = curr_quake.geometry.coordinates[2];

        let curr_color = colorMap[colorCutoffDepths.reduce((a, b, i) => b<quake_depth ? i+1 : a, 0)]

        let markerIcon = L.divIcon({
            html: `<svg width="${mag_scale * 10}" height="${mag_scale * 10}">
                                <circle cx="${mag_scale * 5}" cy="${mag_scale * 5}" r="${mag_scale * 4}" stroke="black" stroke-width="1" fill=${"#"+curr_color} />
                                </svg>`,
            iconAnchor: L.point([mag_scale * 5, mag_scale * 5]), 
            className: "circleIcon"
        });

        let curr_item = L.marker([curr_quake.geometry.coordinates[1], curr_quake.geometry.coordinates[0]], {icon: markerIcon})
        curr_item.bindPopup("Magnitude: " + mag_scale +"<br>" + 
                            "Depth: " + quake_depth + "<br>" +
                            "Time: " + quake_time.toString());

        curr_item.addTo(myMap);
        counter++;
        console.log(counter)
    }
})