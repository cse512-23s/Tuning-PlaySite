let margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let x = d3.scaleLinear().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y);

let svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain([0, 10]);
y.domain([0, 10]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add a transparent rectangle to capture mouse events
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

let lineGenerator = d3.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

let isDrawing = false;
let points = [];

d3.select("svg").on('mousedown', function(event) {
    isDrawing = true;
    var coords = d3.pointer(event);
    var newData = {x: x.invert(coords[0] - margin.left), y: y.invert(coords[1] - margin.top)};
    points.push(newData);
});

d3.select("svg").on('mousemove', function(event) {
    if (!isDrawing) return;
    var coords = d3.pointer(event);
    var newData = {x: x.invert(coords[0] - margin.left), y: y.invert(coords[1] - margin.top)};
    points.push(newData);

    svg.selectAll('.userPath').remove(); // Remove the old line before drawing a new one
    svg.append('path')
        .datum(points)
        .attr('class', 'userPath')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
});

d3.select("svg").on('mouseup', function() {
    isDrawing = false;
    // Do not reset points array to keep the user's line

    // Replace with real data
let realData = [{x: 1, y: 1}, {x: 5, y: 5}, {x: 9, y: 9}];

// Simulating some delay (0.5s) for real data to appear
setTimeout(() => {
  let realPath = svg.append("path")
      .datum(realData)
      .attr("class", "realDataPath")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

  let totalLength = realPath.node().getTotalLength();

  realPath
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
}, 500);

});

// Add X axis label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin.right)
    .attr("y", height + margin.bottom )
    .text("Batch size");

// Add Y axis label
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -margin.left + 10)
    .attr("x", -height / 2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("validation acc");



// Create new svg for second chart
let svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x2 = d3.scaleLog().base(2).range([0, width]); // use a logarithmic scale for x-axis
let y2 = d3.scaleLinear().range([height, 0]);

let xAxis2 = d3.axisBottom(x2);
let yAxis2 = d3.axisLeft(y2);

x2.domain([2, 512]); // start from 2 and increase exponentially
y2.domain([0, 1]); // acc ranges from 0 to 1

svg2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2);

svg2.append("g")
    .attr("class", "y axis")
    .call(yAxis2);

// Add a transparent rectangle to capture mouse events for second chart
svg2.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

let points2 = [];

let lineGenerator2 = d3.line()
    .x(function(d) { return x2(d.x); })
    .y(function(d) { return y2(d.y); });

// Add similar mouse events for second chart
d3.select(svg2.node().parentNode).on('mousedown', function(event) {
    isDrawing = true;
    var coords = d3.pointer(event);
    var newData = {x: x2.invert(coords[0] - margin.left), y: y2.invert(coords[1] - margin.top)};
    points2.push(newData);
});

d3.select(svg2.node().parentNode).on('mousemove', function(event) {
    if (!isDrawing) return;
    var coords = d3.pointer(event);
    var newData = {x: x2.invert(coords[0] - margin.left), y: y2.invert(coords[1] - margin.top)};
    points2.push(newData);

    svg2.selectAll('.userPath').remove();
    svg2.append('path')
        .datum(points2)
        .attr('class', 'userPath')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator2);
});

d3.select(svg2.node().parentNode).on('mouseup', function() {
    isDrawing = false;

    // Simulating some delay (0.5s) for real data to appear
    setTimeout(() => {
        let realPath2 = svg2.append("path")
            .datum(realData2)
            .attr("class", "realDataPath")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator2);

        let totalLength2 = realPath2.node().getTotalLength();

        realPath2
            .attr("stroke-dasharray", totalLength2 + " " + totalLength2)
            .attr("stroke-dashoffset", totalLength2)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }, 500);
});

// Replace with real data for the second chart
let realData2 = d3.range(2, 513, 2).map(i => { return {x: i, y: 0.5}; });

// Add X axis label
svg2.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin.right)
    .attr("y", height + margin.bottom )
    .text("Batch size");

// Add Y axis label
svg2.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -margin.left + 10)
    .attr("x", -height / 2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("validation acc");




// Create new svg for third chart
let svg3 = d3.select("#chart3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x3 = d3.scaleLinear().range([0, width]);
let y3 = d3.scaleLinear().range([height, 0]);

let xAxis3 = d3.axisBottom(x3);
let yAxis3 = d3.axisLeft(y3);

x3.domain([0, 10]); // set domain for x-axis
y3.domain([0, 10]); // set domain for y-axis

svg3.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis3);

svg3.append("g")
    .attr("class", "y axis")
    .call(yAxis3);

// Theoretical curve - Exponential decay
let theoryData = Array.from({length: 11}, (_, i) => ({x: i , y: 10 - i}));
let theoryPath = svg3.append("path")
    .datum(theoryData)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .style("stroke-dasharray", ("3, 3"))
    .attr("d", lineGenerator);

// Actual curve - Negative slope
let actualData = Array.from({length: 101}, (_, i) => ({x: i / 10, y: 5 * (2 - Math.pow((i / 100), 0.5))}));
let actualPath = svg3.append("path")
    .datum(actualData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", lineGenerator);

// Add X axis label
svg3.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin.right)
    .attr("y", height + margin.bottom )
    .text("Batch size");

// Add Y axis label
svg3.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -margin.left + 10)
    .attr("x", -height / 2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Steps for a 90% acc");