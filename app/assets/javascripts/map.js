var m_width = $("#map").width(),
  width = 938,
  height = 500,
  country,
  state;

var projection = d3.geo.mercator()
  .scale(150)
  .translate([width / 2, height / 1.5]);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("#map").append("svg")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("width", m_width)
  .attr("height", m_width * height / width);

  svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .on("click", country_clicked);

var tooltip = d3.select("#map").append("div")
  .attr("class", "tooltip");

var g = svg.append("g");

d3.json("/map/countries.topo.json", function(error, us) {
  g.append("g")
    .attr("id", "countries")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.countries).features)
    .enter()
    .append("path")
    .attr("id", function(d) { return d.id; })
    .attr("d", path)
    .on("click", country_clicked);
});

setTimeout(function() {
  d3.csv("map/cities.csv", function(error, data) {
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("a")
        .attr("xlink:href", function(d) {
          return "http://www.meetup.com/cities/"+d.country+"/"+d.city;
        })
      .append("circle") // display dot for each city
        .attr("cx", function(d) {
          return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.lon, d.lat])[1];
        })
        .attr("r", 2)
        .style("fill", "#ef4b5d");

    // show city name on hover
    g.selectAll("circle")
      .on("mouseover", function(d,i) {
        tooltip
          .attr("style", "display:block")
          .attr("style", "left:"+(d3.event.pageX+25)+"px;top:"+(d3.event.pageY-25)+"px")
          .html(d.city);
        })
      .on("mouseout", function(d,i) {
        tooltip
          .attr("style", "display:none")
      });
    });
}, 2000);

function zoom(xyz) {
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
    .selectAll(["#countries", "#states", "#cities"])
    .style("stroke-width", 1.0 / xyz[2] + "px")
    .selectAll(".city")
    .attr("d", path.pointRadius(20.0 / xyz[2]));
};

function get_xyz(d) {
  var bounds = path.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
};

function country_clicked(d) {
  g.selectAll(["#states", "#cities"]).remove();
  state = null;
  if (country) {
    g.selectAll("#" + country.id).style('display', null);
  };
  if (d && country !== d) {
    var xyz = get_xyz(d);
    country = d;
    zoom(xyz);
  } else {
    var xyz = [width / 2, height / 1.5, 1];
    country = null;
    zoom(xyz);
  };
};

$(window).resize(function() {
  var w = $("#map").width();
  svg.attr("width", w);
  svg.attr("height", w * height / width);
});
