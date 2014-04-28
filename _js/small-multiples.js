//adapted from https://gist.github.com/mbostock/1157787
$(document).ready(function() {

function SmallMultiples(urlForData) {
  this.margin = {top: 8, right: 10, bottom: 2, left: 10};
  this.width = (960 - margin.left - margin.right)/4;
  this.height = 120 - margin.top - margin.bottom;
  var parseDate = d3.time.format("%b %Y").parse;
  this.x = d3.time.scale().range([0, width]);
  this.y = d3.scale.linear().range([height, 0]);
  this.yDomain = 0

  var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.riders); });

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.riders); });


  d3.csv(urlForData, objectConverterByRow, generateChartsFromData);

  function manipulateData(data) {

  //if json object isn't correctly typed, use function objectConverterbyRow to
  //iterate through objects and convert them here
//      data.sort(function(a,b) {return b.date-a.date;});
      data.sort(function(a,b) {return a.date-b.date;});

      // Nest data by destination.
      var destinations = d3.nest()
                      .key(function(raw_csv_row) {
                        return raw_csv_row.destination;
                      })
                      .entries(data);


      // Compute the maximum riders per destination, needed for the y-domain.
      destinations.forEach(function(destination) {
        destination.maxRiders = d3.max(destination.values, function(d) { return d.riders; });

        if (yDomain < destination.maxRiders) {
          yDomain = destination.maxRiders;
        };
      });

      destinations.sort(function(a,b) {return a.key.localeCompare(b.key);});

      console.log(destinations)
      // Compute the minimum and maximum date across destinations.
      // We assume values are sorted by date.
      this.x.domain([
        d3.max(destinations, function(destination) { return destination.values[0].date; }),
        d3.min(destinations, function(destination) { return destination.values[destination.values.length - 1].date; })
//        d3.min(destinations, function(destination) { return destination.values[0].date; }),
//        d3.max(destinations, function(destination) { return destination.values[destination.values.length - 1].date; })
      ]);

      return destinations;
  }

  function generateChartsFromData(error, data) {
    var destinations = manipulateData(data)

    // Add an SVG element for each destination, with the desired dimensions and margin.
    var svg = d3.select("#viz").selectAll("svg")
      .data(destinations)
      .enter()
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the area path elements. Note: the y-domain is set per element.
    svg.append("path")
      .attr("class", "area")
      .attr("d", function(d) { y.domain([0, yDomain]); return area(d.values); });
     
    // Add the line path elements. Note: the y-domain is set per element.
    svg.append("path")
      .attr("class", "line")
      .attr("d", function(d) { y.domain([0, yDomain]); return line(d.values); });
     
    // Add a small label for the destination name.
    svg.append("text")
      .attr("x", width - 6)
      .attr("y", height - 6)
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });
    }

  function objectConverterByRow(csv_object) {
    csv_object.riders = +csv_object.riders;
    csv_object.date = parseDate(csv_object.date);
    return csv_object;
  }
}

//MapDiagram.onclick() {
//do stuff to know what station they click
//do stuff to calculate the name of the csv robyn needs
//var csv_url = //

//SmallMultiples(csv_url)

//}
SmallMultiples("../_data/stocks.csv")

});

