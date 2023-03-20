// ufo: x and y are going to be city_latitude & city_longitude
// bigfoot: x and y are latitude & longitude

// reads the data files 
Promise.all([d3.csv("data/bigfoot.csv"),
			 d3.csv("data/ufos.csv"), 
			 ]).then((files) => {

	// files [0]: bigfoot
	// files [1]: ufos

	// 10 lines of data printed to console
	console.log("bigfoot data" + files[0].slice(0, 10)); 
	console.log("ufos data" + files[1].slice(0, 10));

	// initialize the map; center around usa
	let mymap = L
	  .map("map")
	  .setView([38, -97], 4);

	// map background 

	// opt 1
	// L.tileLayer(
	//     'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
	//     maxZoom: 10,
	//     }).addTo(mymap);

	// opt 2
	// L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	// 	maxZoom: 20,
	// 	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
	// 	}).addTo(mymap);

	// opt 3
	L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
	}).addTo(mymap);

	for (let key in files[0]) {
		try {
			L.circleMarker([files[0][key].latitude, files[0][key].longitude], {
				radius: 7,
				className: "bf-coords"
			}).addTo(mymap)
			.bindPopup(`<strong>Bigfoot Sighting</strong><br>
  						<strong>Date</strong>: ${files[0][key].date}<br>
  						<strong>State</strong>: ${files[0][key].state}<br>
  						<strong>County</strong>: ${files[0][key].county}`);
			} catch (error) {}
	}

	for (let key in files[1]) {
		try {
			L.circleMarker([files[1][key].city_latitude, files[1][key].city_longitude], {
				radius: 7,
				className: "ufo-coords"
			}).addTo(mymap)
			.bindPopup(`<strong>UFO Sighting</strong><br>
  						<strong>Date</strong>: ${files[1][key].date_time}<br>
  						<strong>City</strong>: ${files[1][key].city}<br>
  						<strong>State</strong>: ${files[1][key].state}`);
		} catch (error) {}
	}

});




const FRAME = 
d3.select("#vis1")
    .append("svg")
        .attr("width", 750)
        .attr("height", 450)
        .attr("id", "svg2");

// Load the CSV file
// reads the data files 
Promise.all([d3.csv("data/bigfoot.csv"),
			 d3.csv("data/ufos.csv"), 
			 ]).then((files) => {

	// files [0]: bigfoot
	// files [1]: ufos

	// Perform the frequency count on the desired column
	var count = d3.rollup(files [1], v => v.length, d => d.season);
	var count2 = d3.rollup(files [0], v => v.length, d => d.season);
	console.log(count.values())
	var trace1 = {
		x: Array.from(count.keys()),
		y: Array.from(count.values()),
		//set1,
		name: 'UFO',
		type: 'bar'
	  };
	  var trace2 = {
		x: Array.from(count2.keys()),
		y: Array.from(count2.values()),
		//set2,
		name: 'bf',
		type: 'bar'
	  };
	var data = [trace1,trace2];
	var layout = {barmode: 'group'};
	
	// Create the bar chart
	//let svg = d3.select("#svg2");
	Plotly.newPlot('vis1', data, layout);

	// svg = svg.selectAll("rect")
	//   .data(count)
	//   .enter()
	//   .append("rect")
	//   .attr("x", function(d, i) { return i * 50; })
	//   .attr("y", function(d) { return svg.attr("height") - d[1]; })
	//   .attr("width", 20)
	//   .attr("height", function(d) { return d[1];})
	//   .attr("fill", "steelblue");

	//   svg = svg.selectAll("rect")
	//   .data(count2)
	//   .enter()
	//   .append("rect")
	//   .attr("x", function(d, i) { return i * 50 + 20; })
	//   .attr("y", function(d) { return svg.attr("height") - d[1]; })
	//   .attr("width", 20)
	//   .attr("height", function(d) { return d[1]; })
	//   .attr("fill", "orange");
  
  });

