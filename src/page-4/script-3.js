//Reference : https://gist.github.com/EmilienDupont/aaf429be5705b219aaaf8d691e27ca87


var width = 960,
    height = 500,
    nx = parseInt(width / 5), // grid sizes
    ny = parseInt(height / 5),
    h = 1e-7, // step used when approximating gradients
    drawing_time = 30; // max time to run optimization

var svg = d3.select("#plot3")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

// Parameters describing where function is defined
var domain_x = [-2, 2],
    domain_y = [-2, 2],
    domain_f = [-2, 8],
    contour_step = 0.5; // Step size of contour plot

var scale_x = d3.scaleLinear()
                .domain([0, width])
                .range(domain_x);

var scale_y = d3.scaleLinear()
                .domain([0, height])
                .range(domain_y);

var thresholds = d3.range(domain_f[0], domain_f[1], contour_step);

var color_scale = d3.scaleLinear()
    .domain(d3.extent(thresholds))
    .interpolate(function() { return d3.interpolateYlGnBu; });

var function_g = svg.append("g").on("mousedown", mousedown),
    gradient_path_g = svg.append("g"),
    menu_g = svg.append("g");

/*
 * Set up the function and gradients
 */

/* Value of f at (x, y) */
function f(x, y) {
    return -2 * Math.exp(-((x - 1) * (x - 1) + y * y) / .2) + -3 * Math.exp(-((x + 1) * (x + 1) + y * y) / .2) + x * x + y * y;
}

/* Returns gradient of f at (x, y) */
function grad_f(x,y) {
    var grad_x = (f(x + h, y) - f(x, y)) / h
        grad_y = (f(x, y + h) - f(x, y)) / h
    return [grad_x, grad_y];
}


/* Returns values of f(x,y) at each point on grid as 1 dim array. */
function get_f_values(nx, ny) {
    var grid = new Array(nx * ny);
    for (i = 0; i < nx; i++) {
        for (j = 0; j < ny; j++) {
            var x = scale_x( parseFloat(i) / nx * width ),
                y = scale_y( parseFloat(j) / ny * height );
            // Set value at ordering expected by d3.contour
            grid[i + j * nx] = f(x, y);
        }
    }
    return grid;
}

/*
 * Set up the contour plot
 */

var contours = d3.contours()
    .size([nx, ny])
    .thresholds(thresholds);

var f_values = get_f_values(nx, ny);

function_g.selectAll("path")
          .data(contours(f_values))
          .enter().append("path")
          .attr("d", d3.geoPath(d3.geoIdentity().scale(width / nx)))
          .attr("fill", function(d) { return color_scale(d.value); })
          .attr("stroke", "none");

/*
 * Set up buttons
 */
var draw_bool = {"SGD" : true, "RMSProp" : true, "Adam" : true};

var buttons = ["SGD", "RMSProp", "Adam"];

menu_g.append("rect")
      .attr("x", 0)
      .attr("y", height - 40)
      .attr("width", width)
      .attr("height", 40)
      .attr("fill", "white")
      .attr("opacity", 0.2);

menu_g.selectAll("circle")
      .data(buttons)
      .enter()
      .append("circle")
      .attr("cx", function(d,i) { return width/4 * (i + 0.9);} )
      .attr("cy", height - 20)
      .attr("r", 10)
      .attr("stroke-width", 0.5)
      .attr("stroke", "black")
      .attr("class", function(d) { console.log(d); return d;})
      .attr("fill-opacity", 0.5)
      .attr("stroke-opacity", 1)
      .on("mousedown", button_press);

menu_g.selectAll("text")
      .data(buttons)
      .enter()
      .append("text")
      .attr("x", function(d,i) { return width/4 * (i + 0.9) + 18;} )
      .attr("y", height - 14)
      .text(function(d) { return d; })
      .attr("text-anchor", "start")
      .attr("font-family", "Helvetica Neue")
      .attr("font-size", 15)
      .attr("font-weight", 200)
      .attr("fill", "white")
      .attr("fill-opacity", 0.8);

function button_press() {
    var type = d3.select(this).attr("class")
    if (draw_bool[type]) {
        d3.select(this).attr("fill-opacity", 0);
        draw_bool[type] = false;
    } else {
        d3.select(this).attr("fill-opacity", 0.5)
        draw_bool[type] = true;
    }
}

/*
 * Set up optimization/gradient descent functions.
 * SGD, RMSProp, Adam.
 */

function get_sgd_path(x0, y0, learning_rate, num_steps) {
    var sgd_history = [{"x": scale_x.invert(x0), "y": scale_y.invert(y0)}];
    var x1, y1, gradient;
    for (i = 0; i < num_steps; i++) {
        gradient = grad_f(x0, y0);
        x1 = x0 - learning_rate * gradient[0]
        y1 = y0 - learning_rate * gradient[1]
        sgd_history.push({"x" : scale_x.invert(x1), "y" : scale_y.invert(y1)})
        x0 = x1
        y0 = y1
    }
    return sgd_history;
}

function get_momentum_path(x0, y0, learning_rate, num_steps, momentum) {
    var v_x = 0,
        v_y = 0;
    var momentum_history = [{"x": scale_x.invert(x0), "y": scale_y.invert(y0)}];
    var x1, y1, gradient;
    for (i=0; i < num_steps; i++) {
        gradient = grad_f(x0, y0)
        v_x = momentum * v_x - learning_rate * gradient[0]
        v_y = momentum * v_y - learning_rate * gradient[1]
        x1 = x0 + v_x
        y1 = y0 + v_y
        momentum_history.push({"x" : scale_x.invert(x1), "y" : scale_y.invert(y1)})
        x0 = x1
        y0 = y1
    }
    return momentum_history
}

function get_rmsprop_path(x0, y0, learning_rate, num_steps, decay_rate, eps) {
    var cache_x = 0,
        cache_y = 0;
    var rmsprop_history = [{"x": scale_x.invert(x0), "y": scale_y.invert(y0)}];
    var x1, y1, gradient;
    for (i = 0; i < num_steps; i++) {
        gradient = grad_f(x0, y0)
        cache_x = decay_rate * cache_x + (1 - decay_rate) * gradient[0] * gradient[0]
        cache_y = decay_rate * cache_y + (1 - decay_rate) * gradient[1] * gradient[1]
        x1 = x0 - learning_rate * gradient[0] / (Math.sqrt(cache_x) + eps)
        y1 = y0 - learning_rate * gradient[1] / (Math.sqrt(cache_y) + eps)
        rmsprop_history.push({"x" : scale_x.invert(x1), "y" : scale_y.invert(y1)})
        x0 = x1
        y0 = y1
    }
    return rmsprop_history;
}

function get_adam_path(x0, y0, learning_rate, num_steps, beta_1, beta_2, eps) {
    var m_x = 0,
        m_y = 0,
        v_x = 0,
        v_y = 0;
    var adam_history = [{"x": scale_x.invert(x0), "y": scale_y.invert(y0)}];
    var x1, y1, gradient;
    for (i = 0; i < num_steps; i++) {
        gradient = grad_f(x0, y0)
        m_x = beta_1 * m_x + (1 - beta_1) * gradient[0]
        m_y = beta_1 * m_y + (1 - beta_1) * gradient[1]
        v_x = beta_2 * v_x + (1 - beta_2) * gradient[0] * gradient[0]
        v_y = beta_2 * v_y + (1 - beta_2) * gradient[1] * gradient[1]
        x1 = x0 - learning_rate * m_x / (Math.sqrt(v_x) + eps)
        y1 = y0 - learning_rate * m_y / (Math.sqrt(v_y) + eps)
        adam_history.push({"x" : scale_x.invert(x1), "y" : scale_y.invert(y1)})
        x0 = x1
        y0 = y1
    }
    return adam_history;
}


/*
 * Functions necessary for path visualizations
 */

var line_function = d3.line()
                      .x(function(d) { return d.x; })
                      .y(function(d) { return d.y; });

function draw_path(path_data, type) {
    var gradient_path = gradient_path_g.selectAll(type)
                        .data(path_data)
                        .enter()
                        .append("path")
                        .attr("d", line_function(path_data.slice(0,1)))
                        .attr("class", type)
                        .attr("stroke-width", 3)
                        .attr("fill", "none")
                        .attr("stroke-opacity", 0.5)
                        .transition()
                        .duration(drawing_time)
                        .delay(function(d,i) { return drawing_time * i; })
                        .attr("d", function(d,i) { return line_function(path_data.slice(0,i+1));})
                        .remove();

    gradient_path_g.append("path")
                   .attr("d", line_function(path_data))
                   .attr("class", type)
                   .attr("stroke-width", 3)
                   .attr("fill", "none")
                   .attr("stroke-opacity", 0.5)
                   .attr("stroke-opacity", 0)
                   .transition()
                   .duration(path_data.length * drawing_time)
                   .attr("stroke-opacity", 0.5);
}

/*
 * Start minimization from click on contour map
 */

function mousedown() {
    /* Get initial point */
    var point = d3.mouse(this);
    // alert("click"+point);
    /* Minimize and draw paths */
    minimize(scale_x(point[0]), scale_y(point[1]));
}

let learning_Rate1 = 2e-2; //default : best 
let learning_Rate2 = 1e-2;
let learning_Rate3 = 1e-2;

d3.select("#learningRate1")
  .on("click", function() {
    // Add or remove the 'active' class based on the button state
    d3.select("#learningRate1").classed("active", true);
    d3.select("#learningRate2").classed("active", false);

    // Rest of your code
    learning_Rate1 = 10e-1;
    learning_Rate2 = 10e-2;
    learning_Rate3 = 10e-3;
  });

d3.select("#learningRate2")
  .on("click", function() {
    // Add or remove the 'active' class based on the button state
    d3.select("#learningRate1").classed("active", false);
    d3.select("#learningRate2").classed("active", true);

    // Rest of your code
    learning_Rate1 = 2e-2;  // sgd
    learning_Rate2 = 1e-2;  // rms
    learning_Rate3 = 1e-2;  // adam
  });



function minimize(x0,y0) {
    gradient_path_g.selectAll("path").remove();

    if (draw_bool.SGD) {
        var sgd_data = get_sgd_path(x0, y0, learning_Rate1, 500);
        draw_path(sgd_data, "sgd");
    }
  
    if (draw_bool.RMSProp) {
        var rmsprop_data = get_rmsprop_path(x0, y0, learning_Rate2, 300, 0.99, 1e-6);
        draw_path(rmsprop_data, "rmsprop");
    }
    if (draw_bool.Adam) {
        var adam_data = get_adam_path(x0, y0, learning_Rate3, 100, 0.7, 0.999, 1e-6);
        draw_path(adam_data, "adam");
    }
}
