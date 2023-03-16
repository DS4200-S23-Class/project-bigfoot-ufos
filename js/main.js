// variables 
const MAP_WIDTH = 1000
const MAP_HEIGHT = 600

const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// ufo: x and y are going to be city_latitude & city_longitude
// bigfoot: x and y are latitude & longitude
const MAP = 
d3.select("#map")
	.append("svg")
		.attr("width", MAP_WIDTH)
		.attr("height", MAP_HEIGHT)
		.attr("class", "frame");

// reads the data files 
Promise.all([d3.csv("data/bigfoot.csv"),
			 d3.csv("data/ufos.csv"), 
			 ]).then((files) => {
	// files [0]: bigfoot
	// files [1]: ufos

	// 10 lines of data printed to console
	console.log("bigfoot data" + files[0].slice(0, 10)); 
	console.log("ufos data" + files[1].slice(0, 10));

	// scaling 
	const MAX_LAT = d3.max([d3.max(files[0], (d) => {return parseInt(d.latitude)}), 
					d3.max(files[1], (d) => {return parseInt(d.city_latitude)})]);

	const MAX_LONG = d3.max([d3.max(files[0], (d) => {return parseInt(d.longitude)}), 
					 d3.max(files[1], (d) => {return parseInt(d.city_longitude)})]);

	const MIN_LAT = d3.min([d3.min(files[0], (d) => {return parseInt(d.latitude)}), 
					d3.min(files[1], (d) => {return parseInt(d.city_latitude)})]);

	const MIN_LONG = d3.min([d3.min(files[0], (d) => {return parseInt(d.longitude)}), 
					 d3.min(files[1], (d) => {return parseInt(d.city_longitude)})]);

	console.log(MAP_HEIGHT, MAP_WIDTH);

	const SCALE_LAT = d3.scaleLinear()
							.domain([MIN_LAT, MAX_LAT])
							.range([MAP_HEIGHT  - MARGINS.bottom, MARGINS.top])
							;

	const SCALE_LONG = d3.scaleLinear()
							.domain([MIN_LONG, MAX_LONG])
							.range([MARGINS.left, MAP_WIDTH - MARGINS.right])
							;

	let bfCoords = MAP.selectAll("coords")
							.data(files[0])
							.enter()
							.append("circle")
								.attr("class", "bf-coords")
								.attr("cx", (d) => {return SCALE_LONG(d.longitude) + MARGINS.top})
								.attr("cy", (d) => {return SCALE_LAT(d.latitude) + MARGINS.left})
								.attr("r", 5);


	let ufoCoords = MAP.selectAll("coords")
							.data(files[1])
							.enter()
							.append("circle")
								.attr("class", "ufo-coords")
								.attr("cx", (d) => {return SCALE_LONG(d.city_longitude) + MARGINS.top})
								.attr("cy", (d) => {return SCALE_LAT(d.city_latitude) + MARGINS.left})
								.attr("r", 5);


});