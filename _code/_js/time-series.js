var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;
var parseTimeSeriesDate = d3.time.format("%m/%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

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
  setXYDomains(parsedData);
}

function setXYDomains(parsedData) {
//    var dates = Object.keys(parsedData[0].ridership);
//
//    for (var i = 0; i < dates.length; i++)
//    {
//        dates[i] = parseTimeSeriesDate(dates[i])
//    }
//    dates = dates.sort(date_sort_asc)
//    console.log(dates)

    var dates = [parseTimeSeriesDate("01/2006"), parseTimeSeriesDate("12/2013")];


    x.domain([
        d3.min(dates),
        d3.max(dates)


      ]);

    var maxRiders = 3000;

//    parsedData.forEach(function(timeSeriesDataPoint) {
//        Object.keys(timeSeriesDataPoint.ridership).forEach(function (dateKey) {
//        var ridership = timeSeriesDataPoint.ridership[dateKey]
//            if (ridership > maxRiders) {
//                maxRiders = ridership
//            }
//        })
//    })

    y.domain([
        d3.min([0]),
        d3.max([maxRiders])
        ]);
}

function lineData(parsedData) {
    console.log(parsedData[0])
}

//console(lineData

//function lineData(parsedData) {
//    var destinationLines = [];
//    for (var i = 0; i < parsedData.length; i++) {
//        var dateRiders = [];
//        var dates = Object.keys(parsedData[i].ridership);
//
//        var riders = dates.map(function(v) {
//            return parsedData[i].ridership[v];
//            });
//        for (var j = 0; j < dates.length; j++) {
//            //parseTimeSeriesDate(dates[j]);
//            dateRiders.push({date: (parseTimeSeriesDate(dates[j])), riderNumber: riders[j]});
//            }
//        destinationLines.push({destination:parsedData[i].destination, lineDataPoint: dateRiders});
//
//        }
//    return destinationLines
//}
//
console.log(manipulatedData[0].ridership);

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
        .style("stroke", function(d) { return color(d.destination); });

//    destination.append("text")
//        .datum(function(d) { return {name: d.destination, value: d.lineDataPoint[d.lineDataPoint.length - 1]}; })
//        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.riderNumber) + ")"; })
//        .attr("x", 3)
//        .attr("dy", ".35em")
//        .text(function(d) { return d.destination; });


d3.csv("_data/data-fake.csv", function(error, data) {

//  data.forEach(function(d) {
//    d.date = parseDate(d.date);
//  });
  // parse date that is key in each dictionary (for each dictionary, get ridership key, ridership.get all keys function)



    });


//  destination.append("path")
//      .attr("class", "line")
//      .attr("d", function(d) {
//        return line(d.lineDataPoint); })
//      .style("stroke", function(d) { return color(d.destination); });
//
//  destination.append("text")
//      .datum(function(d) { return {name: d.destination, value: d.lineDataPoint[d.lineDataPoint.length - 1]}; })
//      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.riderNumber) + ")"; })
//      .attr("x", 3)
//      .attr("dy", ".35em")
//      .text(function(d) { return d.destination; });
//});
