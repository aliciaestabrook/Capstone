//////Select Menu///////
var data = ["Choose an Attribute", "schoolOECD", "waste", "lnyUN", "GINIW", "polity"];

var select = d3.select('#menu')
  .append('select')
    .attr('class','select')
    .on('change',onchange)

var options = select
  .selectAll('option')
  .data(data).enter()
  .append('option')
    .text(function (d) { return d; });

//////Map///////

//set initial map data and title text
var translate = {attr: "waste", txt: "Food Security"};

//set height and width of svg
var svg = d3.select("#svgmap"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var tooltip = d3.select("div.tooltip");

//link to public data file
urldata = "https://gist.githubusercontent.com/aliciaestabrook/b28afb79c72d24240b957704eaa8ed30/raw/4ce06e43802962012fade7a02822c14d851f4bdf/gistfile1.txt"

//Build Map:
//append the map title to the svg
svg.append("text")
  .attr("x", (width/2))
  .attr("y", 35)
  .attr("font-size", "24px")
  .attr("text-anchor", "middle")
  .text(translate.txt)

// Map and projection
//define path
var path = d3.geoPath();
//define projection boundaries
var projection = d3.geoNaturalEarth()
  .scale(175)//change this to zoom. original values: width / 2 / Math.PI
  .translate([(width / 2)-20, height / 2])
var path = d3.geoPath()
  .projection(projection);

// Declare data attributes for mapping
var data = d3.map();
var polity = d3.map();
var schoolOECD = d3.map();
var lnyUN = d3.map();
var gin = d3.map();
var country_name = d3.map()
var waste = d3.map()
var region = d3.map()

//set colors
var colorScale = d3.scaleThreshold()
.domain([1, 3, 5, 7, 9, 11])
.range(["#EFEDEB", "#D45810", "#EF935D", "#FBAF83", "#D9C3B6", "#8C7C72"]);

//Legend
var g = svg.append("g")
  .attr("class", "legendThreshold")
  .attr("transform", "translate(90,300)");
g.append("text")
  .attr("class", "caption")
  .attr("x", 0)
  .attr("y", -6)
  .attr("text-anchor", "middle")
  .text(translate.txt);
//legend number scale
var labels = ['-', '1-2', '3-4', '5-6', '7-8', '9-10', '> 10'];
var legend = d3.legendColor()
  .labels(function (d) { return labels[d.i]; })
  .shapePadding(4)
  .scale(colorScale);
svg.select(".legendThreshold")
  .call(legend);

//Load external data and set attributes
d3.queue()
  .defer(d3.json, "https://enjalot.github.io/wwsd/data/world/world-110m.geojson")
  .defer(d3.csv, urldata, function(d) {
    data.set(d["Country Code"], +d.waste);
    polity.set(d["Country Code"], +d.polity);
    lnyUN.set(d["Country Code"], +d.lnyUN);
    gin.set(d["Country Code"], +d.GINIW);
    schoolOECD.set(d["Country Code"], +d.schoolOECD);
    waste.set(d["Country Code"], +d.waste);
    country_name.set(d["Country Code"], d["Country Name"]);
    region.set(d["Country Code"], d.Region);
    })
  .await(ready);

function ready(error, topo, params) {
  if (error) throw error;

  // Draw the map
  svg.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(topo.features)
    .enter().append("path")
      .attr("id", function(d) {
        d.region = region.get(d.id) || 0;
        return d.region;
      })
      .attr("fill", function (d){
        // Pull data for this country
        d.waste = data.get(d.id) || 0;
        // Set the color
        return colorScale(d.waste);
      })
      .attr("d", path)
      //MAP EVENTS:
      //Mouseover: changes the opacity and border width of the countries based on regions
      //Mousemove: bring up tooltip
      //Click: select country to display data for in the bar chart
      //Mouseout: returnal to normal
      .on("mouseover",function(d,i){
        d.region = region.get(d.id) || "-";
        if (d.region != "-") {
          d3.select(this).attr("stroke-width",2);
          d3.selectAll("path")
            .attr('fill-opacity', 0.6);
          d3.selectAll("#" + d.region)
            .transition().duration(100)
            .attr('fill-opacity', 1);
          return tooltip.style("hidden", false).html(d.waste+"1");
        } else {
          d3.select(this).attr("stroke-width",1);
          d3.selectAll("path")
            .attr('fill-opacity', 1);
        }
        })
      .on("mousemove",function(d){
        //get the data values to display in the tooltip
        d.polity = polity.get(d.id) || "-";
        d.lnyUN = lnyUN.get(d.id) || "-";
        d.schoolOECD = schoolOECD.get(d.id) || "-";
        d.gin = gin.get(d.id) || "-";
        d.waste = waste.get(d.id) || "-";
        d.country_name = country_name.get(d.id) || "-";
        d.region = region.get(d.id) || "-";

        //change opacity based on regions
        if (d.region != "-") {
          d3.selectAll("path")
            .attr('fill-opacity', 0.6);
          d3.selectAll("#" + d.region)
            .attr('fill-opacity', 1);
        } else {
          d3.select(this).attr("stroke-width",1);
          d3.selectAll("path")
            .attr('fill-opacity', 1);
        }

        tooltip.classed("hidden", false)
          .style("top", (d3.event.pageY) + "px")
          .style("left", (d3.event.pageX + 10) + "px")
          .html("<strong>Country: </strong>" + d.country_name +
            "<br><strong>Region: </strong>" + d.region +
            "<br><strong>Food Security: </strong>" +d.waste +
            "<br><strong>Democracy: </strong>" + d.polity +
            "<br><strong>GDP Per Capita: </strong>" + d.lnyUN +
            "<br><strong>Secondary Net Enrollment: </strong>" + d.schoolOECD +
            "<br><strong>Inequality: </strong>" + d.gin);
      })
      .on("click",function(d){
        d3.select("#svgbar").selectAll("g").remove(); //remove existing bar chart

        //get the data values to display in the tooltip
        d.waste = waste.get(d.id) || "-";
        d.country_name = country_name.get(d.id) || "-";
        d.region = region.get(d.id) || "-";

        //set region and world data values into a js object
        if (d.region != "-") {
          new_id = d.region;
          region1 = waste.get(new_id);
          world = waste.get("World");
          console.log("world:" + world);
          bar_data = [{country: d.country_name,
                    value_bar: d.waste},
                    {country: new_id,
                    value_bar: region1},
                    {country: "World",
                    value_bar: world}
                    ];
          //set margin, width, and height of bars
          const margin = 60;
          const widthbar = 960 - 2 * margin;
          const heightbar = 600 - 2 * margin;
          const svgbar = d3.select('#svgbar');
          const chartbar = svgbar.append('g')
            .attr('transform', `translate(${margin}, ${margin})`);

          //set axis
          const yScale = d3.scaleLinear()
            .range([heightbar, 0])
            .domain([0, 10]);

          const xScale = d3.scaleBand()
            .range([0, widthbar])
            .domain(bar_data.map((s) => s.country))
            .padding(0.2);

          chartbar.append('g')
            .call(d3.axisLeft(yScale));

          chartbar.append('g')
            .attr('transform', `translate(0, ${heightbar})`)
            .call(d3.axisBottom(xScale));

          //build bar chart
          chartbar.selectAll()
            .data(bar_data)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr('x', (s) => xScale(s.country))
            .attr('y', (s) => yScale(s.value_bar))
            .attr('height', (s) => heightbar - yScale(s.value_bar))
            .attr('width', xScale.bandwidth());
        };
      })
      .on("mouseout",function(d,i){
        d3.select(this).attr("stroke-width",1);
        d.region = region.get(d.id) || "-";
        d3.selectAll("path")
          .attr('fill-opacity', 1);
        tooltip.classed("hidden", true);
      });
}
//responsive map functionality
var chart = $("#svgmap"),
  aspect = chart.width() / chart.height(),
  container = chart.parent();
$(window).on("resize", function() {
  var targetWidth = container.width();
  chart.attr("width", targetWidth);
  chart.attr("height", Math.round(targetWidth / aspect));
}).trigger("resize");

//what happens when a new attribute is selected from menu: repopulate map with new data
function onchange() {
  //set the new attribute value selected
  selectValue = d3.select('select').property('value');
  console.log(selectValue);

  //determine title text based on new attribute
  if (selectValue == "Choose an Attribute" || selectValue == "waste") {
    selectValue = "waste";
    title = "Food Security";
  } else if (selectValue == "schoolOECD") {
    title = "Secondary Net Enrollment";
  } else if (selectValue == "polity") {
    title = "Democracy";
  } else if (selectValue == "GINIW") {
    title = "Inequality";
  } else if (selectValue == "lnyUN") {
    title = "GDP Per Capita";
  }

  //delete the map and bar chart previously there so they don't show up together
  d3.select("#svgmap").selectAll("g").remove();
  d3.select("#svgmap").selectAll("text").remove();
  d3.select("#svgbar").selectAll().remove();

  //map title
  svg.append("text")
    .attr("x", (width/2))
    .attr("y", 35)
    .attr("font-size", "24px")
    .attr("text-anchor", "middle")
    .text(title)

  // Legend
  var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(90,300)");
  g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .attr("text-anchor", "middle")
    .text(title);
  var labels = ['-', '1-2', '3-4', '5-6', '7-8', '9-10', '> 10'];
  var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
  svg.select(".legendThreshold")
    .call(legend);

  // Load external data and boot
  d3.queue()
    .defer(d3.json, "https://enjalot.github.io/wwsd/data/world/world-110m.geojson")
    .defer(d3.csv, urldata, function(d) {
      data.set(d["Country Code"], +d[selectValue]);
    })
    .await(ready);

    function ready(error, topo) {
      if (error) throw error;
      d3.selectAll("path").remove();

      svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
          .attr("id", function(d) {
            d.region = region.get(d.id) || 0;
            return d.region;
          })
          .attr("fill", function (d){
              d[selectValue] = data.get(d.id) || 0;
              return colorScale(d[selectValue]);
          })
          .attr("d", path)
          .on("mouseover",function(d,i){
            d.region = region.get(d.id) || "-";
            if (d.region != "-") {
              d3.select(this).attr("stroke-width",2);
              d3.selectAll("path")
                .attr('fill-opacity', 0.6);
              d3.selectAll("#" + d.region)
                .transition().duration(100)
                .attr('fill-opacity', 1);
              return tooltip.style("hidden", false).html(d.waste+"1");
            } else {
              d3.select(this).attr("stroke-width",1);
              d3.selectAll("path")
                .attr('fill-opacity', 1);
            }
          })
          .on("mousemove",function(d){
            d.polity = polity.get(d.id) || "-";
            d.lnyUN = lnyUN.get(d.id) || "-";
            d.schoolOECD = schoolOECD.get(d.id) || "-";
            d.gin = gin.get(d.id) || "-";
            d.waste = waste.get(d.id) || "-";
            d.country_name = country_name.get(d.id) || "-";
            d.region = region.get(d.id) || "-";

            if (d.region != "-") {
              d3.selectAll("path")
                .attr('fill-opacity', 0.6);
              d3.selectAll("#" + d.region)
                .attr('fill-opacity', 1);
            } else {
              d3.select(this).attr("stroke-width",1);
              d3.selectAll("path")
                .attr('fill-opacity', 1);
            }
            tooltip.classed("hidden", false)
                   .style("top", (d3.event.pageY) + "px")
                   .style("left", (d3.event.pageX + 10) + "px")
                   .html("<strong>Country: </strong>" + d.country_name +
                   "<br><strong>Region: </strong>" + d.region +
                   "<br><strong>Food Security: </strong>" +d.waste +
                   "<br><strong>Democracy: </strong>" + d.polity +
                   "<br><strong>GDP Per Capita: </strong>" + d.lnyUN +
                   "<br><strong>Secondary Net Enrollment: </strong>" + d.schoolOECD +
                   "<br><strong>Inequality: </strong>" + d.gin);
          })
          .on("click",function(d){
            d3.select("#svgbar").selectAll("g").remove();
              d.country_name = country_name.get(d.id) || "-";
              d.region = region.get(d.id) || "-";

              if (d.region != "-") {
                new_id = d.region;
                bar_data = [{country: d.country_name,
                          value_bar: (d[selectValue] = data.get(d.id))},
                          {country: new_id,
                          value_bar: (d[selectValue] = data.get(new_id))},
                          {country: "World",
                          value_bar: (d[selectValue] = data.get("World"))}
                          ];

                const margin = 60;
                const widthbar = 960 - 2 * margin;
                const heightbar = 600 - 2 * margin;
                const svgbar = d3.select('#svgbar');
                const chartbar = svgbar.append('g')
                  .attr('transform', `translate(${margin}, ${margin})`);

                const yScale = d3.scaleLinear()
                  .range([heightbar, 0])
                  .domain([0, 10]);

                const xScale = d3.scaleBand()
                  .range([0, widthbar])
                  .domain(bar_data.map((s) => s.country))
                  .padding(0.2);

                chartbar.append('g')
                  .call(d3.axisLeft(yScale));

                chartbar.append('g')
                  .attr('transform', `translate(0, ${heightbar})`)
                  .call(d3.axisBottom(xScale));

                chartbar.selectAll()
                  .data(bar_data)
                  .enter()
                  .append('rect')
                  .attr("class", "bar")
                  .attr('x', (s) => xScale(s.country))
                  .attr('y', (s) => yScale(s.value_bar))
                  .attr('height', (s) => heightbar - yScale(s.value_bar))
                  .attr('width', xScale.bandwidth());
              };
          })
          .on("mouseout",function(d,i){
            d3.select(this).attr("stroke-width",1);
            d.region = region.get(d.id) || "-";
            d3.selectAll("path")
              .attr('fill-opacity', 1);
            tooltip.classed("hidden", true);
          });
    }
};
