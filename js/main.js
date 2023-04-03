// js file
// Bigfoot, UFOs, and Where to Find Them
// started 3/15/23

// extend circle marker class to include id
L.CircleMarker.include({
	id: null,
});

let currentMarkers = [];

// get markers currently in map view
function getFeaturesInView(map) {
  let features = [];
  map.eachLayer( function(layer) {
    try {
      if (map.getBounds().contains(layer.getLatLng())) {    
      	if ( (!(d3.select("#bf-legend-filter").classed("off")) && layer.options.id.startsWith("bf")) || 
      		 ( !(d3.select("#ufo-legend-filter").classed("off")) && layer.options.id.startsWith("ufo"))) {

      		features.push(layer.options.id);
      	}
      }
    } catch (error) {};
  });

  currentMarkers = features;
}


// filter function used for points on the map
function filter(event, object) {
	// checks if current selection has class of bigfoot sighting
	if (d3.select(object).classed("bf-legend")) {
		// checks if the selection doesn't have the class of off
		if (!(d3.select(object).classed("off"))) {
			// selects all elements with class of bigfoot active
			// changes the class to bf-inactive, and adds the off class
			d3.selectAll(".bf-active").classed("bf-inactive", true).classed("bf-active", false);
			d3.select(object).classed("off", true);
			d3.selectAll(".bar-bf-active").classed("bar-bf-inactive", true).classed("bar-bf-active", false);
			d3.select(object).classed("off", true);
			d3.select(object).style("stroke", "white").style("fill", "white");
		}

		// class of off
		else {
			// selects all inactive class, makes them have the active class
			// takes away the off class
			d3.selectAll(".bf-inactive").classed("bf-active", true).classed("bf-inactive", false);
			d3.select(object).classed("off", false);
			d3.selectAll(".bar-bf-inactive").classed("bar-bf-active", true).classed("bar-bf-inactive", false);
			d3.select(object).classed("off", false);
			d3.select(object).style("stroke", "orange").style("fill", "orange");
		}
	}

	else if (d3.select(object).classed("ufo-legend")) {
		// repeat the same for UFOs
		// no off class
		if (!d3.select(object).classed("off")) {
			// change from active to inactive & add off class
			d3.selectAll(".ufo-active").classed("ufo-inactive", true).classed("ufo-active", false);
			d3.select(object).classed("off", true);
			d3.selectAll(".bar-ufo-active").classed("bar-ufo-inactive", true).classed("bar-ufo-active", false);
			d3.select(object).classed("off", true);
			d3.select(object).style("stroke", "white").style("fill", "white");
		}

		else {
			// inactive to active, remove off class
			d3.selectAll(".ufo-inactive").classed("ufo-active", true).classed("ufo-inactive", false);
			d3.select(object).classed("off", false);
			d3.selectAll(".bar-ufo-inactive").classed("bar-ufo-active", true).classed("bar-ufo-inactive", false);
			d3.select(object).classed("off", false);
			d3.select(object).style("stroke", "steelblue").style("fill", "steelblue");
		}
	}
};

// ufo: x and y are going to be city_latitude & city_longitude
// bigfoot: x and y are latitude & longitude

// reads the data files 
Promise.all([d3.csv("data/bigfoot.csv"),
			 d3.csv("data/ufos.csv"), 
			 ]).then((files) => {

	// files [0]: bigfoot
	// files [1]: ufos

	// 10 lines of data printed to console
	console.log("bigfoot data:");
	console.log(files[0].slice(0, 10)); 
	console.log("UFO data:");
	console.log(files[1].slice(0, 10));

	// initialize the map; center around usa
	let mymap = L
	  .map("map")
	  .setView([38, -97], 4);

	// map background 

	// leaflet map
	L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, \
									GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
	}).addTo(mymap);

	// loop through the bigfoot file
	for (let key in files[0]) {

		// function to be called when a point on the map is clicked
		function pointClicked() {
			let text0 = "<strong>Summary of Bigfoot Sighting: </strong>";

			// text of bigfoot sighting
			let text1 = files[0][key].observed;

			// add the text to the scroll box
			document.getElementById("scroll-box").innerHTML = text0 + "<br>" + text1;
		}
		try {
			// create a point on the graph using the longitude and latitude
			L.circleMarker([files[0][key].latitude, files[0][key].longitude], {
				radius: 7,
				className: "bf-active",
				id: "bf" + files[0][key].number
			}).addTo(mymap)
			.on("click", pointClicked)

			// add a tooltip that prints out relevant information
			.bindPopup(`<strong>Bigfoot Sighting</strong><br>
  						<strong>Date</strong>: ${files[0][key].date}<br>
  						<strong>State</strong>: ${files[0][key].state}<br>
  						<strong>County</strong>: ${files[0][key].county}`);
			} catch (error) {}

	}

	// loop through the UFO file
	for (let key in files[1]) {

		// function to be called when a UFO point is clicked
		function pointClicked() {
			let text0 = "<strong>Summary of UFO Sighting: </strong>"
			let text1 = files[1][key].text;
			// add to the scrollbox
			document.getElementById("scroll-box").innerHTML = text0 + "<br>" + text1;
		}
		try {
			// add point based on the latitude and longitude
			L.circleMarker([files[1][key].city_latitude, files[1][key].city_longitude], {
				radius: 7,
				className: "ufo-active",
				id: "ufo" + files[1][key].number
			}).addTo(mymap)
			.on("click", pointClicked)
			// tooltip
			.bindPopup(`<strong>UFO Sighting</strong><br>
  						<strong>Date</strong>: ${files[1][key].date_time}<br>
  						<strong>City</strong>: ${files[1][key].city}<br>
  						<strong>State</strong>: ${files[1][key].state}`);
		} catch (error) {}
	}

	let labels = ['categories'];

	// for legend
	// labels & colors
	let categories = [{label: "Bigfoot Sighting", color: "orange"}, {label: "UFO Sighting", color: "steelblue"}];


	// create an svg element for the legend
	svg = d3.select("#legend").append("svg")
					.attr("width", 180)
					.attr("height", 150);
	
	svg.append("text")
				.attr("x", 20)
				.attr("y", 35)
				.text("Click to Filter:")
				.style("font-weight", "bold")
				.style("text-decoration", "underline");

	// use the categories array to make circles & add to svg
	svg.selectAll("legends").data(categories).enter()
			.append("circle")
				.attr("class", (d) => {if (d.label == "Bigfoot Sighting") {return "bf-legend"}
																else {return "ufo-legend"}})
				.attr("r", 10)
				.attr("cx", 30)
				.attr("cy", (d, i) => {return (i + 1) / 2 * 60 + 40})
				.style("fill", "white")
				.style("stroke", (d) => {return d.color})
				.style("stroke-width", 2);

	svg.selectAll("legends").data(categories).enter()
			.append("circle")
				.attr("class", (d) => {if (d.label == "Bigfoot Sighting") {return "bf-legend"}
																else {return "ufo-legend"}})
				.attr("id", (d) => {if (d.label == "Bigfoot Sighting") {return "bf-legend-filter"}
																else {return "ufo-legend-filter"}})
				.attr("r", 7)
				.attr("cx", 30)
				.attr("cy", (d, i) => {return (i + 1) / 2 * 60 + 40})
				.style("fill", (d) => {return d.color})
				.on("click", function (e) {
						filter(e, this);
						getFeaturesInView(mymap);
	    			plotBar();
					});

	// use categories array to add text labels to the legend
	svg.selectAll("labels").data(categories).enter()
			.append("text")
				.attr("x", 50)
				.attr("y", (d, i) => {return (i + 1) / 2 * 60 + 45})
				.text((d) => {return d.label});

	getFeaturesInView(mymap);

	// filter bar chart based on points in view
	mymap.on('zoomend', function() {
    getFeaturesInView(mymap);
    plotBar();
	});

	mymap.on('moveend', function() {
    getFeaturesInView(mymap);
    plotBar();
	});
	

});


// set the dimensions and margins of the graph
const MARGIN = {top: 10, right: 30, bottom: 50, left: 50},
    WIDTH = 740 - MARGIN.left - MARGIN.right,
    HEIGHT = 400 - MARGIN.top - MARGIN.bottom;

function plotBar() {
	Promise.all([d3.csv("data/bigfoot.csv"),
			 d3.csv("data/ufos.csv"), 
			 ]).then((files) => {

	d3.select("#vis1").selectAll("*").remove();

	// add title
  d3.select("#vis1").append("svg")
  	.attr("width", WIDTH)
  	.attr("height", "50px")
	  	.append("text")
		  	.attr("x", MARGIN.left)
		  	.attr("y", "25px")
		  	.style("font-size", "20px")
		  	.style("font-weight", "bold")
		  	.style("margin", "10px")
		  	.style("text-decoration", "underline")
		  	.text("Number of Sightings by Month");

	// append the svg object to the body of the page
	let svg2 = d3.select("#vis1")
			  .append("svg")
			    .attr("width", WIDTH + MARGIN.left + MARGIN.right)
			    .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
			  .append("g")
			    .attr("transform",`translate(${MARGIN.left},${MARGIN.top})`);

	// gather month counts for bf and ufo
	let monthsData = [{month: 'January', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, {month: 'February', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, 
										{month: 'March', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, {month: 'April', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, 
										{month: 'May', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, {month: 'June', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, 
										{month: 'July', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, {month: 'August', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, 
										{month: 'September', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, {month: 'October', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}},
										{month: 'November', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}, {month: 'December', data: {bf: {count: 0, label: 'bigfoot'}, ufo: {count: 0, label: 'ufo'}}}];

	// determine which data are currently zoomed on
	for (key in files[0]) {
		if (currentMarkers.includes('bf' + files[0][key].number)) {
			monthsData[files[0][key].month - 1].data.bf.count ++;
		}
	}

	for (key in files[1]) {
		if (currentMarkers.includes('ufo' + files[1][key].number)) {
			monthsData[files[1][key].month - 1].data.ufo.count ++;
		}
	}

	// plot formatting
	const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	const X = d3.scaleBand()
      .domain(MONTHS)
      .range([0, WIDTH])
      .padding([0.2]);

  svg2.append("g")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(d3.axisBottom(X).tickSize(0));

  // Add X-axis label
  svg2.append("text")
    .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT + 30})`)
    .style("text-anchor", "middle")
    .text("Month");

  // Add Y-axis label
  svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - MARGIN.left)
    .attr("x", 0 - (HEIGHT / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Sightings");

  // Add Y axis
  const Y = d3.scaleLinear()
    .domain([0, 130])
    .range([ HEIGHT, 0 ]);

  svg2.append("g")
    .call(d3.axisLeft(Y));

  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand()
    .domain(MONTHS)
    .range([0, X.bandwidth()])
    .padding([0.05]);

	svg2.selectAll("bars")
		.data(monthsData)
		.enter()
		.append("rect")
			.attr("class", "bar bar-bf-active")
			.attr("x", (d) => {return X(d.month) + (xSubgroup.bandwidth() * 6) + 3})
			.attr("y", (d) => {return Y(d.data.bf.count)})
			.attr("width", xSubgroup.bandwidth() * 6)
			.attr("height", (d) => {return HEIGHT - Y(d.data.bf.count)})
			.attr("fill", "orange");

	svg2.selectAll("bars")
		.data(monthsData)
		.enter()
		.append("rect")
			.attr("class", "bar bar-ufo-active")
			.attr("x", (d) => {return X(d.month)})
			.attr("y", (d) => {return Y(d.data.ufo.count)})
			.attr("width", xSubgroup.bandwidth() * 6)
			.attr("height", (d) => {return HEIGHT - Y(d.data.ufo.count)})
			.attr("fill", "steelblue");

  // Tooltip

  // To add a tooltip, we will need a blank div that we 
  //  fill in with the appropriate text. Be use to note the
  //  styling we set here and in the .css
  const TOOLTIP = d3.select("#vis1")
                      .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0); 

  // Define event handler functions for tooltips
  function handleMouseover(event, d) {
    if (d3.select(this).classed("bar-bf-active")) {
  		// on mouseover, make opaque 
  		TOOLTIP.style("opacity", 1); 
  		TOOLTIP.html("Kind: Bigfoot" + "<br>Value: " + d.data.bf.count);
		}

		else if (d3.select(this).classed("bar-ufo-active")) {
			// on mouseover, make opaque 
  		TOOLTIP.style("opacity", 1); 
  		TOOLTIP.html("Kind: UFO" + "<br>Value: " + d.data.ufo.count);

		}

  }

  function handleMousemove(event, d) {
    // position the tooltip and fill in information 
    TOOLTIP.style("left", (event.pageX ) + "px") //add offset
                                                        // from mouse
            .style("top", (event.pageY +5) + "px"); 
  }

  function handleMouseleave(event, d) {
    // on mouseleave, make transparant again 
    TOOLTIP.style("opacity", 0); 
  } 


  // Add event listeners
  svg2.selectAll(".bar")
        .on("mouseover", handleMouseover) //add event listeners
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave);  

});

};

plotBar();

// Parse the Data
// d3.csv("data/bar.csv").then( function(data) {
//   let categories = [{label: "Bigfoot Sighting", color: "orange"}, {label: "UFO Sighting", color: "steelblue"}];
//   // List of subgroups = header of the csv files = soil condition here
//   const subgroups = data.columns.slice(1)
//   console.log(subgroups)
//   // List of groups = species here = value of the first column called group -> I show them on the X axis
//   const groups = data.map(d => d.month)

//   console.log(groups)

//   // Add X axis
//   const x = d3.scaleBand()
//       .domain(groups)
//       .range([0, width])
//       .padding([0.2]); 

//   svg2.append("g")
//     .attr("transform", `translate(0, ${height})`)
//     .call(d3.axisBottom(x).tickSize(0));


//   // Add X-axis label
//   svg2.append("text")
//     .attr("transform", `translate(${width / 2}, ${height + 30})`)
//     .style("text-anchor", "middle")
//     .text(xAxisLabel);


//   // Add Y axis
//   const y = d3.scaleLinear()
//     .domain([0, 120])
//     .range([ height, 0 ]);
//   svg2.append("g")
//     .call(d3.axisLeft(y));



//   // Another scale for subgroup position?
//   const xSubgroup = d3.scaleBand()
//     .domain(subgroups)
//     .range([0, x.bandwidth()])
//     .padding([0.05]);

//   // color palette = one color per subgroup
//   const color = d3.scaleOrdinal()
//     .domain(subgroups)
//     .range(['orange','steelblue']);


//   // color palette = one color per subgroup
//   const clas = d3.scaleOrdinal()
//     .domain(subgroups)
//     .range(['bar-bf-active','bar-ufo-active']);

// 	  // color palette = one color per subgroup
//  const i_d = d3.scaleOrdinal()
// 	  .domain(subgroups)
// 	  .range(['Bigfoot','UFO']);
	  
//   // Show the bars
//   svg2.append("g")
//     .selectAll("g")
//     // Enter in data = loop group per group
//     .data(data)
//     .join("g")
//       .attr("transform", d => `translate(${x(d.month)}, 0)`)
//     .selectAll("rect")
//     .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
//     .join("rect")
//       .attr("x", d => xSubgroup(d.key))
//       .attr("y", d => y(d.value))
//       .attr("width", xSubgroup.bandwidth())
//       .attr("height", d => height - y(d.value))
//       .attr("fill", d => color(d.key))
// 	  .attr("class", d => clas(d.key))
// 	  .attr("id", "bar");	  

// });



