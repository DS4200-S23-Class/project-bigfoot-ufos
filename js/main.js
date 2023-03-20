function filter(event) {
	if (d3.select(this).classed("Bigfoot Sighting")) {

		if (!(d3.select(this).classed("off"))) {
			d3.selectAll(".bf-active").classed("bf-inactive", true).classed("bf-active", false);
			d3.select(this).classed("off", true)
			d3.selectAll(".bar-bf-active").classed("bar-bf-inactive", true).classed("bar-bf-active", false);
			d3.select(this).classed("off", true);
		}

		else {
			d3.selectAll(".bf-inactive").classed("bf-active", true).classed("bf-inactive", false);
			d3.select(this).classed("off", false)
			d3.selectAll(".bar-bf-inactive").classed("bar-bf-active", true).classed("bar-bf-inactive", false);
			d3.select(this).classed("off", false);
		}
	}

	else {
		
		if (!d3.select(this).classed("off")) {
			d3.selectAll(".ufo-active").classed("ufo-inactive", true).classed("ufo-active", false);
			d3.select(this).classed("off", true)
			d3.selectAll(".bar-ufo-active").classed("bar-ufo-inactive", true).classed("bar-ufo-active", false);
			d3.select(this).classed("off", true);
		}

		else {
			d3.selectAll(".ufo-inactive").classed("ufo-active", true).classed("ufo-inactive", false);
			d3.select(this).classed("off", false)
			d3.selectAll(".bar-ufo-inactive").classed("bar-ufo-active", true).classed("bar-ufo-inactive", false);
			d3.select(this).classed("off", false);
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
		function pointClicked() {
		let text0 = "<strong>Summary of Sighting: </strong>"
		let text1 = files[0][key].observed;
		document.getElementById("scroll-box").innerHTML = text0 + "<br>" + text1;
		}
		try {
			L.circleMarker([files[0][key].latitude, files[0][key].longitude], {
				radius: 7,
				className: "bf-active"
			}).addTo(mymap)
			.on("click", pointClicked)
			.bindPopup(`<strong>Bigfoot Sighting</strong><br>
  						<strong>Date</strong>: ${files[0][key].date}<br>
  						<strong>State</strong>: ${files[0][key].state}<br>
  						<strong>County</strong>: ${files[0][key].county}`);
			} catch (error) {}

	}

	for (let key in files[1]) {
		function pointClicked() {
		let text0 = "<strong>Summary of Sighting: </strong>"
		let text1 = files[1][key].text;
		document.getElementById("scroll-box").innerHTML = text0 + "<br>" + text1;
		}
		try {
			L.circleMarker([files[1][key].city_latitude, files[1][key].city_longitude], {
				radius: 7,
				className: "ufo-active"
			}).addTo(mymap)
			.on("click", pointClicked)
			.bindPopup(`<strong>UFO Sighting</strong><br>
  						<strong>Date</strong>: ${files[1][key].date_time}<br>
  						<strong>City</strong>: ${files[1][key].city}<br>
  						<strong>State</strong>: ${files[1][key].state}`);
		} catch (error) {}
	}

	let labels = ['categories'];
	let categories = [{label: "Bigfoot Sighting", color: "orange"}, {label: "UFO Sighting", color: "steelblue"}];

	svg = d3.select("#legend").append("svg")
					.attr("width", 180)
					.attr("height", 150);
		
	svg.selectAll("legends").data(categories).enter()
			.append("circle")
				.attr("class", (d) => {return d.label})
				.attr("r", 10)
				.attr("cx", 30)
				.attr("cy", (d, i) => {return (i + 1) * 50 - 5})
				.style("fill", (d) => {return d.color})
				.on("click", filter);

	svg.selectAll("labels").data(categories).enter()
			.append("text")
				.attr("x", 50)
				.attr("y", (d, i) => {return (i + 1) * 50})
				.text((d) => {return d.label});
	
	

});



// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#vis1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data/bar.csv").then( function(data) {
    let categories = [{label: "Bigfoot Sighting", color: "orange"}, {label: "UFO Sighting", color: "steelblue"}];
  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(1)
  console.log(subgroups)
  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.month)

  console.log(groups)

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 120])
    .range([ height, 0 ]);
  svg2.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['orange','steelblue'])


  // color palette = one color per subgroup
  const clas = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['bar-bf-active','bar-ufo-active'])

	  // color palette = one color per subgroup
 const i_d = d3.scaleOrdinal()
	  .domain(subgroups)
	  .range(['Bigfoot','UFO'])
	  
  // Show the bars
  svg2.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${x(d.month)}, 0)`)
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .join("rect")
      .attr("x", d => xSubgroup(d.key))
      .attr("y", d => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key))
	  .attr("class", d => clas(d.key))
	  .attr("id", "bar");	
	  
	  




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
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1); 
	  TOOLTIP.html("Kind: " + i_d(d.key) + "<br>Value: " + d.groups)
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
    svg2.selectAll("#bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);    

});


