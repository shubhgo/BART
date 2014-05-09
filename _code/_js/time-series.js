var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var parseDate = d3.time.format("%Y%m%d").parse;
var parseTimeSeriesDate = d3.time.format("%m/%Y").parse;


var dates = [parseTimeSeriesDate("01/2006"), parseTimeSeriesDate("12/2013")];
var x = d3.time.scale()
    .range([0, width])
    .domain([
            d3.min(dates),
            d3.max(dates)
     ]);;


var maxRiders = 3000;
var y = d3.scale.linear()
    .range([height, 0])
    .domain([
    	d3.min([0]),
    	d3.max([maxRiders])
    ]);


var color = d3.scale.category10();


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(parseTimeSeriesDate(d.time)); })
    .y(function(d) { return y(d.ridership); });


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var rectangle = svg.append("rect")
	.attr("x", margin.left)
	.attr("y", margin.top)
	.attr("width", width)
	.attr("height", height)
	.style("stroke", "rgb(6,120,155)")
	.style("stroke-width", 1)
	.style("stroke-opacity", 0.6)
	.style("fill","white");

rectangle.on("mousemove", scrubbedToTime);

var manipulatedData = timeSeriesLines

var date_sort_asc = function (date1, date2) {
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

function getDestinations(parsedData) {
    var destinations = []
    manipulatedData.forEach(function(timeSeriesDataPoint) {
      destinations.push(timeSeriesDataPoint.destination);
    })
    return destinations
}

function setUpChart(parsedData) {
  var destinations = getDestinations(parsedData)
  color.domain(destinations)
}

setUpChart(manipulatedData);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Riders");

var destination = svg.selectAll(".destination")
  .data(manipulatedData)
  .enter().append("g")
  .attr("class", "destination");

destination.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.ridership); })
    .style("stroke", "blue");

function timeSeriesFiltersChanged(source, destination, region, time, weekend)
{
	console.log('timeSeriesFiltersChanged');
	// load data
	time_series_file = "_data/time_series/"+source_station_id+"_ridership.json";
	d3.json(time_series_file, function(json, error){
		if (error) return console.warn('Error: '+error);
		
		var time_line_data = json;
//		console.log(time_line_data);
		animateTimeSeriesWithData(time_line_data)
	});
}

function animateTimeSeriesWithData(time_series_data)
{
	// link data
	var destination = svg.selectAll(".destination")
	  .data(time_series_data);
	
	destination.transition()
		.duration(300)
		.ease("quad")
		.select(".line")
		.attr("d", function(d) {
		  return line(d.ridership); });
	// animate time viz
//	var ts_lines = destination.selectAll(".line");
	
//	ts_lines.transition()
//	.duration(300)
	

}
