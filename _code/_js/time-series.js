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
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

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
    var dates = Object.keys(parsedData[0].ridership);
    for (var i = 0; i < dates.length; i++)
    {
        dates[i] = parseTimeSeriesDate(dates[i])
    }
    dates = dates.sort(date_sort_asc)

    x.domain([
        d3.min(dates),
        d3.max(dates)
      ]);

    var maxRiders = 0;

    parsedData.forEach(function(timeSeriesDataPoint) {
        Object.keys(timeSeriesDataPoint.ridership).forEach(function (dateKey) {
        var ridership = timeSeriesDataPoint.ridership[dateKey]
            if (ridership > maxRiders) {
                maxRiders = ridership
            }
        })
    })

    y.domain([
        d3.min([0]),
        d3.max([maxRiders])
        ]);
}

function lineData(parsedData) {
    var destinationLines = [];
    for (var i = 0; i < parsedData.length; i++) {
        var dateRiders = [];
        var dates = Object.keys(parsedData[i].ridership);
        var riders = dates.map(function(v) {
            return parsedData[i].ridership[v];
            });
        for (var j = 0; j < dates.length; j++) {
            dateRiders.push({date: parseTimeSeriesDate(dates[j]), riderNumber: riders[j]})
            }
        destinationLines.push({destination:parsedData[i].destination, line: dateRiders});
        }
}


d3.csv("_data/data-fake.csv", function(error, data) {

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });
  // parse date that is key in each dictionary (for each dictionary, get ridership key, ridership.get all keys function)


  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, temperature: +d[name]};
      })
    };
  });

    setUpChart(manipulatedData)

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

  var city = svg.selectAll(".city")
      .data(cities)
      .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
});
