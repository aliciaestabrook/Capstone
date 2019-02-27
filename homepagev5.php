<!DOCTYPE html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<html>
    <head>
		<title>Home Page</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="capstonestyle.css">
        <link href="https://fonts.googleapis.com/css?family=Dosis|Staatliches" rel="stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    </head>
    <style>
    .countries {
            fill: none;
            stroke: #fff;
            stroke-linejoin: round;
          }
          .legendThreshold {
              font-size: 12px;
              font-family: sans-serif;
          }
          .caption {
              fill: #000;
              text-anchor: start;
              font-weight: bold;
          }
          #menu {
              margin-top: 1.5%;
              margin-left: 5%;
              position: absolute;
          }
          #title {
            position: relative;
          }
          .opac {
            opacity:0.4;
            filter:alpha(opacity=40);
          }
          .hidden {
              display: none;
          }
          div.tooltip {
              color: #222;
              background: #fff;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 75%;
              border-radius: 3px;
              box-shadow: 0px 0px 2px 0px #a6a6a6;
              padding: .2em;
              text-shadow: #f5f5f5 0 1px 0;
              opacity: .9;
              position: absolute;
              margin-left: 3%;
            }
          #svgmap {
            font-family: Arial, Helvetica, sans-serif;
            display: block;
          }
          svg.banner {
            width: 100%; height: auto;
          }
          #svgdiv {
            height: 75%;
            width: 75%;
            margin-bottom: 5%;
            margin-left: 5%;
            margin-right: 5%;
          }
    </style>
<body>

    <?php
    include "menu.php";
    ?>
    <article>
    	<h1>Interactive Visualization of Food Security</h1>
    	<h2>IT 7993 Capstone, Spring 2019</h2>
    	<h3>MSIT, Kennesaw State University</h3>
    	<img src="earth.jpg" alt="Image of Earth" width="465" height="309.24">
        <p>Team members: Chelsee Dickson, Carole English, Alicia Estabrook,
			Alejandro Sanchez (team lead), and Nasiya Sharif.</p>
        <p>The purpose of this project is to measure the impact of a country’s food security
        level on secondary school enrollment and the generation of income through the
        education channel.</p>
        	<ul>
				<li>Visualize food security and secondary school enrollment world wide</li>
				<li>Simulate the economic impact of changes in a country’s food security
				level through the education channel</li>
			</ul>
		<p>The project is to advance an interactive web-based tool that allows a user to
		click on a country to get information about its policy strengths and weaknesses
		from the perspective of a social market economy. The user can then simulate policy
		changes and see how this policy change changes the economic growth trajectory.
		Results will be presented through visualizations. Data sets will be prepared by the client. </p>
		<!-- <p>Please use the navigation bar above to view the heatmap.</p> -->

    </article>

    <!-- Set div of map, legend and header -->
    <div id="maphead" >
      <span id="menu"></span>
    </div>

    <!-- map div -->
    <div id="svgdiv">
      <svg id="svgmap" width="960" height="600" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid meet"></svg>
      <div class="tooltip"></div>
    </div>

    <!-- bar chart div -->
    <div id="bardiv">
      <svg id="svgbar" width="960" height="600" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid meet"></svg>
    </div>

    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://d3js.org/topojson.v1.min.js"></script>
    <script src="https://datamaps.github.io/scripts/datamaps.world.min.js?v=1"></script>
    <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
    <script src="https://d3js.org/d3-geo-projection.v2.min.js"></script>
    <script src="https://d3js.org/d3-queue.v3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.24.0/d3-legend.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script type='text/javascript' src='finaldraft5_m2.js'></script>

    <!-- <script>

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


    // The svg
    //set initial map data
    var translate = {attr: "waste", txt: "Food Security"};

    //link to public data file
    urldata = "https://gist.githubusercontent.com/aliciaestabrook/b28afb79c72d24240b957704eaa8ed30/raw/4ce06e43802962012fade7a02822c14d851f4bdf/gistfile1.txt"
    milestone1data = "https://gist.githubusercontent.com/aliciaestabrook/bbe5727be716448309be1c405e9a0ec7/raw/fa14a67a378a37f926fcf0d28fb7e949330e6fcf/gistfile1.txt"


    //set heigh and width of svg
    var svg = d3.select("#svgmap"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var tooltip = d3.select("div.tooltip");

    //map title
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
        .scale(175)//change this to zoom. orig: width / 2 / Math.PI
        .translate([(width / 2)-20, height / 2])
    var path = d3.geoPath()
        .projection(projection);

    // Data and color scale
    var data = d3.map();
    var polity = d3.map();
    var schoolOECD = d3.map();
    var lnyUN = d3.map();
    var gin = d3.map();
    var country_name = d3.map()
    var waste = d3.map()
    var region = d3.map()


    var colorScheme = d3.schemeRdGy[6];
    colorScheme.unshift("#eee")
    var colorScale = d3.scaleThreshold()
        .domain([1, 3, 5, 7, 9, 11])
        .range(["#EFEDEB", "#D45810", "#EF935D", "#FBAF83", "#D9C3B6", "#8C7C72"]);


    // Legend
    var g = svg.append("g")
        .attr("class", "legendThreshold")
        .attr("transform", "translate(90,300)");
    g.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", -6)
        .attr("text-anchor", "middle")
        .text(translate.txt);
    var labels = ['-', '1-2', '3-4', '5-6', '7-8', '9-10', '> 10'];
    var legend = d3.legendColor()
        .labels(function (d) { return labels[d.i]; })
        .shapePadding(4)
        .scale(colorScale);
    svg.select(".legendThreshold")
        .call(legend);

    //Load external data and boot
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
                        region.set(d["Country Code"], d.Region); })
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

              .on("mouseover",function(d,i){
                  // d3.select(this).attr("stroke-width",2);

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
                .on("mouseout",function(d,i){
                    d3.select(this).attr("stroke-width",1);
                    d.region = region.get(d.id) || "-";
                    d3.selectAll("path")
                      .attr('fill-opacity', 1);
                    tooltip.classed("hidden", true);
                });
        }
    //responsive aspect
        var chart = $("#svgmap"),
          aspect = chart.width() / chart.height(),
          container = chart.parent();
      $(window).on("resize", function() {
        var targetWidth = container.width();
        chart.attr("width", targetWidth);
        chart.attr("height", Math.round(targetWidth / aspect));
      }).trigger("resize");


    //what happens when a new attribute is selected - repopulate map with new data
    function onchange() {
    	selectValue = d3.select('select').property('value');
      console.log(selectValue);
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

      d3.selectAll("g").remove();
      d3.selectAll("text").remove();

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

              // Draw the map
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
                          // Pull data for this country
                          d[selectValue] = data.get(d.id) || 0;
                          // Set the color
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
                        .on("mouseout",function(d,i){
                            d3.select(this).attr("stroke-width",1);
                            d.region = region.get(d.id) || "-";
                            d3.selectAll("path")
                              .attr('fill-opacity', 1);
                            tooltip.classed("hidden", true);
                        });
          }
    }; -->
</script>
<div></div>
</body>

<footer id="foot" >
    Copyright &copy; 2019 - Capstone Group Project #1
  </footer>
</html>
