// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 1080;
var svgHeight = 720;

var margin = {
  	top: 50,
	bottom: 150,
	right: 50,
	left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(function(health_data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    health_data.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(health_data, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(health_data, d => d.smokes)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll(".stateCircle")
	    .data(health_data)
	    .enter()
	    .append("circle")
	    .attr("cx", d => xLinearScale(d.age))
	    .attr("cy", d => yLinearScale(d.smokes))
	    .attr("r", "20")
	    .attr("opacity", ".8")
	    .classed("stateCircle", true)

	var textGroup = chartGroup.selectAll(".stateText")
        .data(health_data)
        .enter()
        .append("text")
        .classed("stateText", "True")
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.smokes)+6)
        .text(d => d.abbr);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percent of Smokers");
      
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age of Smoker(s)");

    var toolTip = d3.select("body").append("div")
    .attr("class", "d3-tip");

  circlesGroup.on("mouseover", function(d) {
    toolTip.style("display", "block");
    toolTip.html(`State: <strong>${d.state}</strong> Age: <strong>${d.age}</strong> Smokes: <strong>${d.smokes}</strong>`)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY + "px");
  })
    .on("mouseout", function() {
      toolTip.style("display", "none");
    });

  }).catch(function(error) {
    console.log(error);
  });

