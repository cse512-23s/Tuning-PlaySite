var margin = { top: 20, right: 80, bottom: 120, left: 50 },
    width = 660 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
    .range([0, width]);
  var y = d3.scaleLinear()
    .range([height, 0]);
  var y2 = d3.scaleLinear()
    .range([height, 0]);
  //y3
  var y3 = d3.scaleLinear()
    .range([height, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(4);

  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(15);

  var yAxis2 = d3.axisLeft()
    .scale(y2)
    .ticks(15);

  var yAxis3 = d3.axisLeft()
    .scale(y2)
    .ticks(5);

  var maleLine = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.Epochs); })
    .y(function (d) { return y(d.Adam_loss); });

  var femaleLine = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.Epochs); })
    .y(function (d) { return y(d.SGD_loss); });

  var childline = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.Epochs); })
    .y(function (d) { return y(d.RMSprop_loss); });

  var svg = d3.select("#area1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var div = d3.select("text").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Get the data
  d3.tsv("Optimizer_Data.tsv", function (error, data) {
    data.forEach(function (d) {
      d.Epochs = +d.Epochs;
      d.Adam_loss = +d.Adam_loss;
      d.SGD_loss = +d.SGD_loss;
      d.RMSprop_loss = +d.RMSprop_loss;
    });

    x.domain([0, 150])
    y.domain([0, 5]);

    // Nest the entries by event
    dataNest = d3.nest()
      .key((d) => d.event)
      .entries(data);

    legendSpace = width / dataNest.length; // space for legend

    // Loop through each symbol / key
    dataNest.forEach(function (d, i) {
      svg.append("path")
        .attr("class", "line adam-line")
        .style("opacity", 1)
        .style("stroke", function () { return d.color = color(d.key); })
        .attr("id", 'tag' + d.key.replace(/\s+/g, ''))
        .attr("d", maleLine(d.values));

      svg.append("path")
        .attr("class", "line sgd-line")
        .style("opacity", 1)
        .style("stroke", "dimgray") // Set initial color to dim gray
        .style("stroke", function () { return d.color = color(d.key)})
        .style("stroke-dasharray", "10,3")
        .style("stroke-width", 3)
        .attr("id", 'tag' + d.key.replace(/\s+/g, ''))
        .attr("d", femaleLine(d.values));

      svg.append("path")
        .attr("class", "line rmsprop-line")
        .style("opacity", 1)
        .style("stroke", function () { return d.color = color(d.key); })
        .style("stroke-dasharray", "5 5 1,5")
        .style("stroke-width", 3)
        .attr("id", 'tag' + d.key.replace(/\s+/g, ''))
        .attr("d", childline(d.values));


      // Add the legend
      svg.append("text")
        .attr("x", (legendSpace / 2) + i * legendSpace)
        .attr("y", height + (margin.bottom / 2) + 22)
        .attr("class", "legend")
        .style("fill", function () { return d.color = color(d.key); })
        .on("click", function () {
          var active = d.active ? false : true,
            newOpacity = active ? 1 : 0;

          d3.selectAll("#tag" + d.key.replace(/\s+/g, ''))
            .transition().duration(100)
            .style("opacity", newOpacity);
          d3.select(this)
            .style("font-size", function () {
              if (active) { return "25px"; }
            });

          d.active = active;
        })
        .on("mouseover", function () {
          if (d.active !== true) {
            d3.selectAll("#tag" + d.key.replace(/\s+/g, ''))
              .transition()
              .duration(50)
              .style("opacity", 1);
            d3.select(this)
              .transition()
              .duration(50)
              .style("font-size", function () {
                if (d.active !== true) { return "25px"; }
              });
          }
        })
        .on("mouseout", function () {
          if (d.active !== true) {
            d3.selectAll("#tag" + d.key.replace(/\s+/g, ''))
              .transition()
              .duration(1000)
              .style("opacity", 0);
            d3.select(this)
              .transition()
              .duration(1000)
              .style("font-size", "16px");
          }
        })
        .text(d.key);
    });

   
    // Add x-axis label
svg.append("text")
  .attr("class", "x-axis-label")
  .attr("x", width / 2) // Position in the middle of the x-axis
  .attr("y", height + margin.bottom - 75) // Adjust the y position as needed
  .style("text-anchor", "middle") // Center the label horizontally
  .text("Epochs");

  //learning rate label
  svg.append("text")
  .attr("class", "x-axis-label")
  .attr("x", width / 2) // Position in the middle of the x-axis
  .attr("y", height + margin.bottom -15) // Adjust the y position as needed
  .style("text-anchor", "middle") // Center the label horizontally
  .text("Learning Rates");

  //y-axis label
  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -(height / 2)) // Position in the middle of the y-axis, but adjust x position negatively to rotate text
    .attr("y", -margin.left + 5) // Adjust the y position as needed
    .attr("dy", "0.71em")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)") // Rotate the label to be vertical
    .text("Training Loss");

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("transform", "translate(" + (width / 2) + ")")
    .attr("y", 235)
    .style("text-anchor", "middle")
    .text("Learning Rate");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -46)
      .attr("x", margin.top - height + 110)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Training Loss");
  });

  

// Add Adam button
d3.select("body")
  .append("button")
  .text("Adam")
  .on("click", function() {
    var adamLines = d3.selectAll(".adam-line");
    var adamOpacity = adamLines.style("opacity") === "0" ? 1 : 0;
    adamLines.style("opacity", adamOpacity);
     });

// Add RMSprop button
d3.select("body")
  .append("button")
  .text("RMSprop")
  .on("click", function() {
    var rmspropLines = d3.selectAll(".rmsprop-line");
    var rmspropOpacity = rmspropLines.style("opacity") === "0" ? 1 : 0;
    rmspropLines.style("opacity", rmspropOpacity);
  });

// Add SGD button
d3.select("body")
  .append("button")
  .text("SGD")
  .on("click", function() {
    var sgdLines = d3.selectAll(".sgd-line");
    var sgdOpacity = sgdLines.style("opacity") === "0" ? 1 : 0;
    sgdLines.style("opacity", sgdOpacity);
  });

  //clear the plot button
d3.select("body")
  .append("button")
  .text("Clear Plot")
  .on("click", function() {
    svg.selectAll(".adam-line").style("opacity", 0);
    svg.selectAll(".sgd-line").style("opacity", 0);
    svg.selectAll(".rmsprop-line").style("opacity", 0);
});

//see all button
d3.select("body")
  .append("button")
  .text("View All")
  .on("click", function() {
    svg.selectAll(".adam-line").style("opacity", 1);
    svg.selectAll(".sgd-line").style("opacity", 1);
    svg.selectAll(".rmsprop-line").style("opacity", 1);
});