// Sample data
const data = [2, 4, 6, 8, 10, 8, 6, 4, 2, 0];

// Set up the SVG
const svg = d3.select("svg");
const margin = { top: 20, right: 20, bottom: 40, left: 60 };
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;
const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create the line generator
const line = d3.line()
  .x((d, i) => i * (width / data.length))
  .y(d => height - d * 10);

// Initial line plot
const path = g.append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line);

// X-axis label
g.append("text")
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
  .text("Alpha");

// Y-axis label
g.append("text")
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .attr("transform", `translate(${-margin.left + 10}, ${height / 2})rotate(-90)`)
  .text("Loss");

// X-axis
const xScale = d3.scaleLinear()
  .domain([1, 5])
  .range([0, width]);

const xAxis = d3.axisBottom(xScale);

g.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);

// Y-axis
const yScale = d3.scaleLinear()
  .domain([100, 140])
  .range([height, 0]);

const yAxis = d3.axisLeft(yScale);

g.append("g")
  .attr("class", "y-axis")
  .call(yAxis);

// Slider functionality
const slider = d3.select("#mySlider");
const sliderValue = d3.select("#sliderValue");
slider.on("input", function() {
  const value = +this.value;
  sliderValue.text(value.toFixed(4));

  data[4] = value; // Update the data point at index 4

  // Update the line
  path.datum(data)
    .transition()
    .duration(300)
    .attr("d", line);
});