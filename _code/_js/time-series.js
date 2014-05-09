var margin_ts = {top: 20, right: 50, bottom: 30, left: 50},
    width = 899,
    height = 300 - margin_ts.top - margin_ts.bottom;


var parseDate = d3.time.format("%Y%m%d").parse;
var parseTimeSeriesDate = d3.time.format("%m/%Y").parse;


var dates = [parseTimeSeriesDate("01/2006"), parseTimeSeriesDate("12/2013")];
var x = d3.time.scale()
    .range([0, width])
    .domain([
            d3.min(dates),
            d3.max(dates)
     ]);;


var maxRiders = 5000;
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
    .orient("left")
    .ticks(4);


var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(parseTimeSeriesDate(d.time)); })
    .y(function(d) { return y(d.ridership); });


var svg_ts = d3.select(".span12").append("svg")
    .attr("width", width + margin_ts.left + margin_ts.right)
    .attr("height", height + margin_ts.top + margin_ts.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_ts.left + "," + margin_ts.top + ")");


var rectangle = svg_ts.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", width)
	.attr("height", height)
	.attr("class", "rectangle-time-series")
	.style("stroke", "#9FBAC5")
	.style("stroke-width", 1)
	.style("stroke-opacity", 1)
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

svg_ts.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .attr("transform", "translate(20,-5)");

svg_ts.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .selectAll("text")
  .attr("transform", "rotate(-90) translate(5,-20)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end");


//svg.append("g")
//    .attr("class", "x axis")
//    .attr("transform", "translate(0," + height + ")")
//    .call(xAxis)
//  .selectAll("text")
//    .attr("y", 0)
//    .attr("x", 9)
//    .attr("dy", ".35em")
//    .attr("transform", "rotate(90)")
//    .style("text-anchor", "start");


var destination = svg_ts.selectAll(".destination")
  .data(manipulatedData)
  .enter().append("g")
  .attr("class", "destination");

destination.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.ridership); })
    .style("stroke", "#619EB5");

function timeSeriesFiltersChanged(source, destination, region, time, weekend)
{
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
	var destination = svg_ts.selectAll(".destination")
	  .data(time_series_data);
	
	destination.transition()
		.duration(1000)
		.ease("quad")
		.select(".line")
		.attr("d", function(d) {
		  return line(d.ridership); });
}

function highlightDestinationTimeSeries(dest)
{
	var destination = svg_ts.selectAll(".destination");
 	destination.select(".line")
		.style("stroke", function(data) {
		if (data.destination == dest) {
			return "#619EB5";
		}else {
			return "#C8C8C8";
		}})
		.style("stroke-width", function(data) {
		if (data.destination == dest) {
			return 2;
		}else {
			return 0.5;
		}})
		.style("stroke-opacity", function(data) {
		if (data.destination == dest) {
			return 1;
		}else {
			return 0.8;
		}});
}

svg_ts.selectAll(".ticker")
	.data([{'x1':60,'x2':60,'y1':0,'y2':height}])
	.enter()
	.append("line")
	.attr("class", "ticker")
	.attr("x1", function (data) { return data.x1; })
	.attr("y1", function (data) { return data.y1; })
	.attr("x2", function (data) { return data.x2; })
	.attr("y2", function (data) { return data.y2; })
	.style("stroke", "black")
	.style("stroke-width", 1)
	.style("stroke-opacity", 0.4);
	
svg_ts.selectAll(".tickeryedge")
	.data([{'x1':width,'x2':width,'y1':0,'y2':height}])
	.enter()
	.append("line")
	.attr("class", "tickeryedge")
	.attr("x1", function (data) { return data.x1; })
	.attr("y1", function (data) { return data.y1; })
	.attr("x2", function (data) { return data.x2; })
	.attr("y2", function (data) { return data.y2; });
//	.style("stroke", "black")
//	.style("stroke-width", 1)
//	.style("stroke-opacity", 1);
//	.style("shape-rendering": "crispEdges");


function moveTicker(x)
{
	var ticker_data = [{'x1':x,'x2':x,'y1':0,'y2':height}];
	
	var ticker = svg_ts.selectAll(".ticker")
		.data(ticker_data)
		.attr("x1", function (data) { return data.x1; })
		.attr("y1", function (data) { return data.y1; })
		.attr("x2", function (data) { return data.x2; })
		.attr("y2", function (data) { return data.y2; })
}