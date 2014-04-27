//adapted from https://gist.github.com/mbostock/1157787
$(document).ready(function() {

function SmallMultiples() {
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
    .y1(function(d) { return y(d.price); });

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });


  d3.csv("../_data/stocks.csv", objectConverterByRow, generateChartsFromData);

  function manipulateData(data) {
//      data.sort(function(a,b) {return b.date-a.date;});
      data.sort(function(a,b) {return a.date-b.date;});

      // Nest data by symbol.
      var symbols = d3.nest()
                      .key(function(raw_csv_row) {
                        return raw_csv_row.symbol;
                      })
                      .entries(data);


      // Compute the maximum price per symbol, needed for the y-domain.
      symbols.forEach(function(symbol) {
        symbol.maxPrice = d3.max(symbol.values, function(d) { return d.price; });

        if (yDomain < symbol.maxPrice) {
          yDomain = symbol.maxPrice;
        };
      });

      symbols.sort(function(a,b) {return a.key.localeCompare(b.key);});

      console.log(symbols)
      // Compute the minimum and maximum date across symbols.
      // We assume values are sorted by date.
      this.x.domain([
        d3.max(symbols, function(symbol) { return symbol.values[0].date; }),
        d3.min(symbols, function(symbol) { return symbol.values[symbol.values.length - 1].date; })
//        d3.min(symbols, function(symbol) { return symbol.values[0].date; }),
//        d3.max(symbols, function(symbol) { return symbol.values[symbol.values.length - 1].date; })
      ]);

      return symbols;
  }

  function generateChartsFromData(error, data) {
    var symbols = manipulateData(data)

    // Add an SVG element for each symbol, with the desired dimensions and margin.
    var svg = d3.select("#viz").selectAll("svg")
      .data(symbols)
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
     
    // Add a small label for the symbol name.
    svg.append("text")
      .attr("x", width - 6)
      .attr("y", height - 6)
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });
    }

  function objectConverterByRow(csv_object) {
    csv_object.price = +csv_object.price;
    csv_object.date = parseDate(csv_object.date);
    return csv_object;
  }
}

SmallMultiples()
});

