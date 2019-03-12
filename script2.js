//////Select Dropdown Menu///////
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

//////Variable and Function Declaration///////

//set initial map data and title text
var translate = {attr: "waste", txt: "Food Security"};

//set height and width of svg
var svg = d3.select("#svgmap"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var tooltip = d3.select("div.tooltip");

//link to data files
hostdata = "Milestone2.csv"
jsondata ="world-110m.geojson"

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
var code = d3.map()

//set colors for map
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
  .defer(d3.csv, hostdata, function(d) {
    data.set(d["Country Code"], +d.waste);
    polity.set(d["Country Code"], +d.polity);
    lnyUN.set(d["Country Code"], +d.lnyUN);
    gin.set(d["Country Code"], +d.GINIW);
    schoolOECD.set(d["Country Code"], +d.schoolOECD);
    waste.set(d["Country Code"], +d.waste);
    country_name.set(d["Country Code"], d["Country Name"]);
    region.set(d["Country Code"], d.Region);
    code.set(d["Country Code"], d["Country Code"]);

    })
  .await(ready);

//tooltip for scatterplot
var tooltipSct = d3.select("div.tooltipSct");


//functions to set the data variables
function setReg(d) {
  d.region = region.get(d.id) || 0;
  return d.region;
}
function setPol(d) {
  d.polity = polity.get(d.id) || 0;
  return d.polity;
}
function setln(d) {
  d.lnyUN = lnyUN.get(d.id) || 0;
  return d.lnyUN;
}
function setSchool(d) {
  d.schoolOECD = schoolOECD.get(d.id) || 0;
  return d.schoolOECD;
}
function setName(d) {
  d.country_name = country_name.get(d.id) || 0;
  return d.country_name;
}
function setGin(d) {
  d.gin = gin.get(d.id) || 0;
  return d.gin;
}
function setCode(d) {
  d.country_code = code.get(d.id) || 0;
  return d.country_code;
}
function setWaste(d) {
  d.waste = waste.get(d.id) || 0;
  return d.waste;
}

//function to occur on .mousemove event on the map
function mousemovef(d){
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
}


//function to occur on the mouseover event on the map
function mouseoverf(d,i){
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
}

//function to occur on the mouseout event of map
function mouseoutf(d,i){
  d3.select(this).attr("stroke-width",1);
  d.region = region.get(d.id) || "-";
  d3.selectAll("path")
    .attr('fill-opacity', 1);
  tooltip.classed("hidden", true);
}

//functions to occur on mousemove and mouseout of scatterplot
function mouseoutsc(d) {
    tooltipSct.transition()
         .duration(500)
         .style("opacity", 0);
}
function mousemovesc(d) {
    tooltipSct.classed("hidden",false)
      .style("top", (d3.event.pageY - 28) + "px")
      .style("left", (d3.event.pageX + 5) + "px")
      .style("opacity", .9)
      .html("World<br/> (GDP: " + world_gdp +
        "<br/> Waste:" + world_waste + ")");
}


//declare variables for the
var xValueSct = function(d) {
  d.lnyUN = lnyUN.get(d.id) || "0";
  return d.lnyUN;} // data -> value


function mousemovesc1(d) {
    tooltipSct.classed("hidden",false)
      .style("top", (d3.event.pageY - 28) + "px")
      .style("left", (d3.event.pageX + 5) + "px")
      .style("opacity", .9)
      .html(d.id +
        "<br/> (" + xValueSct(d) +
        ", " + yValueSct(d)+ ")");
}


//main function
function ready(error, topo, params) {
  if (error) throw error;

  // Draw the map
  svg.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(topo.features)
    .enter().append("path")
      .attr("id", setReg)
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
      .on("mouseover", mouseoverf)
      .on("mousemove", mousemovef)
      .on("click",function(d){
        d3.select("#svgbar").selectAll("g").remove(); //remove existing bar chart
        d3.select("#svgscatter").selectAll("g").remove(); //remove existing scatter chart

        //get the data values to display in the tooltip
        d.waste = waste.get(d.id) || "-";
        d.country_name = country_name.get(d.id) || "-";
        d.region = region.get(d.id) || "-";
        d.polity = polity.get(d.id) || "-";
        d.lnyUN = lnyUN.get(d.id) || "-";
        d.schoolOECD = schoolOECD.get(d.id) || "-";
        d.gin = gin.get(d.id) || "-";
        d.country_code = code.get(d.id) || "-";

        //set region and world data values into a js object
        if (d.region != "-") {
          new_id = d.region;
          region1 = waste.get(new_id);
          world = waste.get("World");
          bar_data = [{country: d.country_name,
                    value_bar: d.waste},
                    {country: new_id,
                    value_bar: region1},
                    {country: "World",
                    value_bar: world}
                    ];
      //BAR!  //set margin, width, and height of bars
          const svgbar = d3.select('#svgbar');
          const marginbar = 30;
          const widthbar = 560 - 2 * marginbar;
          const heightbar = 300 - 2 * marginbar;

          const chartbar = svgbar.append('g')
            .attr('transform', `translate(${marginbar}, ${marginbar})`);

          //set axis
          const yScaleBar = d3.scaleLinear()
            .range([heightbar, 0])
            .domain([0, 10]);

          const xScaleBar = d3.scaleBand()
            .range([0, widthbar])
            .domain(bar_data.map((s) => s.country))
            .padding(0.2);

          chartbar.append('g')
            .call(d3.axisLeft(yScaleBar));

          chartbar.append('g')
            .attr('transform', `translate(0, ${heightbar})`)
            .call(d3.axisBottom(xScaleBar));

          //build bar chart
          chartbar.selectAll()
            .data(bar_data)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr('x', (s) => xScaleBar(s.country))
            .attr('y', (s) => yScaleBar(s.value_bar))
            .attr('height', (s) => heightbar - yScaleBar(s.value_bar))
            .attr('width', xScaleBar.bandwidth());

        };
    //END BAR!

    //SCATTER PLOT

    new_idsct = d.region;
    region2gdp = lnyUN.get(new_idsct);
    region2waste = waste.get(new_idsct);
    world_gdp = lnyUN.get("World");
    world_waste = waste.get("World");
    worldscat = [{country: "World",
                gdp_bar: world_gdp,
                waste_bar: world_waste},
                {country: new_idsct,
                gdp_bar: region2gdp,
                waste_bar: region2waste}
                ];

    var marginsct = {top: 30, right: 30, bottom: 30, left: 30},
        widthsct = 560,
        heightsct = 300;

        // setup x
    // var xValueSct = function(d) {
    //   d.lnyUN = lnyUN.get(d.id) || "0";
    //   return d.lnyUN;}, // data -> value

      xScaleSct = d3.scaleLinear()
        .domain([0, 10])
        .range([0, widthsct]), // value -> display  .domain([0, 10])
      xMapSct = function(d) {
          return xScaleSct(xValueSct(d))
      ;}, // data -> display
      xAxisSct = d3.axisBottom().scale(xScaleSct).ticks(5);

    // setup y
    var yValueSct = function(d) {
      d.waste = waste.get(d.id) || "0";
      return d.waste;}, // data -> value

        yScaleSct = d3.scaleLinear()
          .domain([0, 10])
          .range([heightsct, 0]),
        yMapSct = function(d) { return yScaleSct(yValueSct(d));}, // data -> display
        yAxisSct = d3.axisLeft().scale(yScaleSct).ticks(5);


    const svgSct = d3.select('#svgscatter');
    const chartSct = svgSct.append('g')
      .attr("transform", "translate(" + marginsct.left + "," + marginsct.top + ")");

    // add the tooltip area to the webpage
    // var tooltipSct = d3.select("div.tooltipSct");

   // x-axis
   chartSct.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + heightsct + ")")
       .call(xAxisSct)
     .append("text")
       .attr("class", "caption")
       .attr("x", widthsct)
       .attr("y", -6)
       .style("text-anchor", "end")
       .text("GDP Per Capita");

       // y-axis
    chartSct.append("g")
        .attr("class", "y axis")
        .call(yAxisSct)
      .append("text")
        .attr("class", "caption")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Waste");

      // draw dots for world and region
    chartSct.selectAll(".dot")
        .data(worldscat)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("id", (s)=> s.country)
        .attr("r", 3.5)
        .attr("cx", (s)=> xScaleSct(s.gdp_bar))
        .attr("cy", (s)=> yScaleSct(s.waste_bar))
        .style("fill", "#3897E1")
        .style("opacity", 1)
        .on("mousemove", mousemovesc)
        .on("mouseout", mouseoutsc);

        chartSct.selectAll(".dot")
            .data(topo.features)
          .enter().append("circle")
            .attr("id", setCode)
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMapSct)
            .attr("cy", yMapSct)
            .style("fill", "#3897E1")
            .style("opacity", function(d) {
              if (xValueSct(d) == 0 || yValueSct(d)==0) {
                return 0;
              } else if (d.country_name == bar_data[0].country || d.country_code == bar_data[1].country || d.country_code == bar_data[2].country) {
                return 1;
              } else if (d.country_code == "World"){
                return 1;
              } else {
                return 0.1;
              }
            })
            .on("mousemove", function(d) {
              tooltipSct.classed("hidden",false)
              .style("top", (d3.event.pageY - 28) + "px")
              .style("left", (d3.event.pageX + 5) + "px")
              .style("opacity", .9)
              .html(d.id +
                "<br/> (" + xValueSct(d) +
                ", " + yValueSct(d)+ ")");
              })
            .on("mouseout", mouseoutsc)
      })
      .on("mouseout", mouseoutf)
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

var bar_chart = $("#svgbar"),
  aspect_bar = bar_chart.width() / bar_chart.height(),
  container_bar = bar_chart.parent();
$(window).on("resize", function() {
  var targetWidth_bar = container_bar.width();
  bar_chart.attr("width", (targetWidth_bar * .8));
  bar_chart.attr("height", Math.round((targetWidth_bar / aspect_bar)*0.8));
}).trigger("resize");


var sct_chart = $("#svgscatter"),
  aspect_sct = sct_chart.width() / sct_chart.height(),
  container_sct = sct_chart.parent();
$(window).on("resize", function() {
  var targetWidth_sct = container_sct.width();
  sct_chart.attr("width", targetWidth_sct * 0.8);
  sct_chart.attr("height", Math.round((targetWidth_sct / aspect_sct)));
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
  d3.select("#svgbar").selectAll("g").remove();
  d3.select("#svgbar").selectAll("rect").remove();
  d3.select("#svgscatter").selectAll("g").remove();
  d3.select("#svgscatter").selectAll(".dot").remove();


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
    .defer(d3.csv, hostdata, function(d) {
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
          .attr("id", setReg)
          .attr("fill", function (d){
              d[selectValue] = data.get(d.id) || 0;
              return colorScale(d[selectValue]);
          })
          .attr("d", path)
          .on("mouseover", mouseoverf)
          .on("mousemove", mousemovef)
          .on("click",function(d){
            d3.select("#svgbar").selectAll("g").remove();
            d3.select("#svgscatter").selectAll("g").remove(); //remove existing scatter chart

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

                const marginbar = 30;
                const widthbar = 560 - 2 * marginbar;
                const heightbar = 300 - 2 * marginbar;
                const svgbar = d3.select('#svgbar');
                const chartbar = svgbar.append('g')
                  .attr('transform', `translate(${marginbar}, ${marginbar})`);

                const yScaleBar = d3.scaleLinear()
                  .range([heightbar, 0])
                  .domain([0, 10]);

                const xScaleBar = d3.scaleBand()
                  .range([0, widthbar])
                  .domain(bar_data.map((s) => s.country))
                  .padding(0.2);

                chartbar.append('g')
                  .call(d3.axisLeft(yScaleBar));

                chartbar.append('g')
                  .attr('transform', `translate(0, ${heightbar})`)
                  .call(d3.axisBottom(xScaleBar));

                chartbar.selectAll()
                  .data(bar_data)
                  .enter()
                  .append('rect')
                  .attr("class", "bar")
                  .attr('x', (s) => xScaleBar(s.country))
                  .attr('y', (s) => yScaleBar(s.value_bar))
                  .attr('height', (s) => heightbar - yScaleBar(s.value_bar))
                  .attr('width', xScaleBar.bandwidth());
              };

              new_idsct = d.region;
              region2gdp = lnyUN.get(new_idsct);
              region2waste = waste.get(new_idsct);
              world_gdp = lnyUN.get("World");
              world_val = waste.get("World");
              worldscat = [{country: "World",
                          gdp_bar: world_gdp,
                          value_bar: (d[selectValue] = data.get("World"))},
                          {country: new_idsct,
                          gdp_bar: region2gdp,
                          value_bar: (d[selectValue] = data.get(new_idsct))}
                          ];
              var marginsct = {top: 30, right: 30, bottom: 30, left: 30},
                  widthsct = 560 - marginsct.left - marginsct.right,
                  heightsct = 300 - marginsct.top - marginsct.bottom;

                  // setup x
              var xValueSct = function(d) {
                d.lnyUN = lnyUN.get(d.id) || "0";
                return d.lnyUN;}, // data -> value

                xScaleSct = d3.scaleLinear()
                  .domain([0, 10])
                  .range([0, widthsct]), // value -> display  .domain([0, 10])
                xMapSct = function(d) {
                    return xScaleSct(xValueSct(d))
                ;}, // data -> display
                xAxisSct = d3.axisBottom().scale(xScaleSct).ticks(5);

              // setup y
              var yValueSct = function(d) {
                d[selectValue] = data.get(d.id) || "0";
                return d[selectValue];}, // data -> value

                  yScaleSct = d3.scaleLinear()
                    .domain([0, 10])
                    .range([heightsct, 0]),
                  yMapSct = function(d) { return yScaleSct(yValueSct(d));}, // data -> display
                  yAxisSct = d3.axisLeft().scale(yScaleSct).ticks(5);


              const svgSct = d3.select('#svgscatter');
              const chartSct = svgSct.append('g')
                .attr("transform", "translate(" + marginsct.left + "," + marginsct.top + ")");

              // add the tooltip area to the webpage
              var tooltipSct = d3.select("div.tooltipSct");

              // x-axis
              chartSct.append("g")
                 .attr("class", "x axis")
                 .attr("transform", "translate(0," + heightsct + ")")
                 .call(xAxisSct)
               .append("text")
                 .attr("class", "caption")
                 .attr("x", widthsct)
                 .attr("y", -6)
                 .style("text-anchor", "end")
                 .text("GDP Per Capita");

                 // y-axis
              chartSct.append("g")
                  .attr("class", "y axis")
                  .call(yAxisSct)
                .append("text")
                  .attr("class", "caption")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text(title);

                // draw dots
              chartSct.selectAll(".dot")
                  .data(worldscat)
                .enter().append("circle")
                  .attr("class", "dot")
                  .attr("id", (s)=> s.country)
                  .attr("r", 3.5)
                  .attr("cx", (s)=> xScaleSct(s.gdp_bar))
                  .attr("cy", (s)=> yScaleSct(s.value_bar))
                  .style("fill", "#3897E1")
                  .style("opacity", 1)
                  .on("mousemove", mousemovesc)
                  .on("mouseout", mouseoutsc);

                  chartSct.selectAll(".dot")
                      .data(topo.features)
                    .enter().append("circle")
                      .attr("id", setCode)
                      .attr("class", "dot")
                      .attr("r", 3.5)
                      .attr("cx", xMapSct)
                      .attr("cy", yMapSct)
                      .style("fill", "#3897E1")
                      .style("opacity", function(d) {
                        if (xValueSct(d) == 0 || yValueSct(d)==0) {
                          return 0;
                        } else if (d.country_name == bar_data[0].country || d.country_code == bar_data[1].country || d.country_code == bar_data[2].country) {
                          return 1;
                        } else if (d.country_code == "World"){
                          return 1;
                        } else {
                          return 0.1;
                        }
                      })
                      .on("mousemove", mousemovesc1)
                      .on("mouseout", mouseoutsc);
          }) //end onclick
          .on("mouseout", mouseoutf);
    }
};

// ///on second change for new bar and scatter data
// function onchange2() {
//   //set the new attribute value selected
//   selectValue = d3.select("#menu2").select('select').property('value');
//   console.log(selectValue);
//
//   //determine title text based on new attribute
//   if (selectValue == "Choose an Attribute" || selectValue == "waste") {
//     selectValue = "waste";
//     title = "Food Security";
//   } else if (selectValue == "schoolOECD") {
//     title = "Secondary Net Enrollment";
//   } else if (selectValue == "polity") {
//     title = "Democracy";
//   } else if (selectValue == "GINIW") {
//     title = "Inequality";
//   } else if (selectValue == "lnyUN") {
//     title = "GDP Per Capita";
//   }
//
//   //delete the map and bar chart previously there so they don't show up together
//   // d3.select("#svgmap").selectAll("g").remove();
//   // d3.select("#svgmap").selectAll("text").remove();
//   d3.select("#svgbar").selectAll().remove("g");
//   d3.select("#svgbar").selectAll("rect").remove();
//   d3.select("#svgbar").selectAll("g").remove();
//   d3.select("#svgscatter").selectAll("g").remove();
//   d3.select("#svgscatter").selectAll(".dot").remove();
//
//
//
//             // d3.select("#svgbar").selectAll("g").remove();
//             // d3.select("#svgscatter").selectAll("g").remove(); //remove existing scatter chart
//     d3.queue()
//       .defer(d3.json, "https://enjalot.github.io/wwsd/data/world/world-110m.geojson")
//       .defer(d3.csv, hostdata, function(d) {
//         data.set(d["Country Code"], +d[selectValue]);
//       })
//       .await(ready);
//
//       function ready(error, topo) {
//         if (error) throw error;
//
//         function change1(d) {
//               d.country_name = country_name.get(d.id) || "-";
//               d.region = region.get(d.id) || "-";
//               console.log(d.country_name);
//               if (d.region != "-") {
//                 new_id = d.region;
//                 bar_data = [{country: d.country_name,
//                           value_bar: (d[selectValue] = data.get(d.id))},
//                           {country: new_id,
//                           value_bar: (d[selectValue] = data.get(new_id))},
//                           {country: "World",
//                           value_bar: (d[selectValue] = data.get("World"))}
//                           ];
//
//                 const marginbar = 30;
//                 const widthbar = 560 - 2 * marginbar;
//                 const heightbar = 300 - 2 * marginbar;
//                 const svgbar = d3.select('#svgbar');
//                 const chartbar = svgbar.append('g')
//                   .attr('transform', `translate(${marginbar}, ${marginbar})`);
//
//                 const yScaleBar = d3.scaleLinear()
//                   .range([heightbar, 0])
//                   .domain([0, 10]);
//
//                 const xScaleBar = d3.scaleBand()
//                   .range([0, widthbar])
//                   .domain(bar_data.map((s) => s.country))
//                   .padding(0.2);
//
//                 chartbar.append('g')
//                   .call(d3.axisLeft(yScaleBar));
//
//                 chartbar.append('g')
//                   .attr('transform', `translate(0, ${heightbar})`)
//                   .call(d3.axisBottom(xScaleBar));
//
//                 chartbar.selectAll()
//                   .data(bar_data)
//                   .enter()
//                   .append('rect')
//                   .attr("class", "bar")
//                   .attr('x', (s) => xScaleBar(s.country))
//                   .attr('y', (s) => yScaleBar(s.value_bar))
//                   .attr('height', (s) => heightbar - yScaleBar(s.value_bar))
//                   .attr('width', xScaleBar.bandwidth());
//               };
//
//               new_idsct = d.region;
//               region2gdp = lnyUN.get(new_idsct);
//               region2waste = waste.get(new_idsct);
//               world_gdp = lnyUN.get("World");
//               world_val = waste.get("World");
//               worldscat = [{country: "World",
//                           gdp_bar: world_gdp,
//                           value_bar: (d[selectValue] = data.get("World"))},
//                           {country: new_idsct,
//                           gdp_bar: region2gdp,
//                           value_bar: (d[selectValue] = data.get(new_idsct))}
//                           ];
//               var marginsct = {top: 30, right: 30, bottom: 30, left: 30},
//                   widthsct = 560 - marginsct.left - marginsct.right,
//                   heightsct = 300 - marginsct.top - marginsct.bottom;
//
//                   // setup x
//               var xValueSct = function(d) {
//                 d.lnyUN = lnyUN.get(d.id) || "0";
//                 return d.lnyUN;}, // data -> value
//
//                 xScaleSct = d3.scaleLinear()
//                   .domain([0, 10])
//                   .range([0, widthsct]), // value -> display  .domain([0, 10])
//                 xMapSct = function(d) {
//                     return xScaleSct(xValueSct(d))
//                 ;}, // data -> display
//                 xAxisSct = d3.axisBottom().scale(xScaleSct).ticks(5);
//
//               // setup y
//               var yValueSct = function(d) {
//                 d[selectValue] = data.get(d.id) || "0";
//                 return d[selectValue];}, // data -> value
//
//                   yScaleSct = d3.scaleLinear()
//                     .domain([0, 10])
//                     .range([heightsct, 0]),
//                   yMapSct = function(d) { return yScaleSct(yValueSct(d));}, // data -> display
//                   yAxisSct = d3.axisLeft().scale(yScaleSct).ticks(5);
//
//
//               // setup fill color
//               var cValue = function(d) { return d.id;},
//                   colorSct = d3.scaleOrdinal(d3.schemeCategory10);
//
//               const svgSct = d3.select('#svgscatter');
//               const chartSct = svgSct.append('g')
//                 .attr("transform", "translate(" + marginsct.left + "," + marginsct.top + ")");
//
//               // add the tooltip area to the webpage
//               var tooltipSct = d3.select("div.tooltipSct");
//
//               // x-axis
//               chartSct.append("g")
//                  .attr("class", "x axis")
//                  .attr("transform", "translate(0," + heightsct + ")")
//                  .call(xAxisSct)
//                .append("text")
//                  .attr("class", "caption")
//                  .attr("x", widthsct)
//                  .attr("y", -6)
//                  .style("text-anchor", "end")
//                  .text("GDP Per Capita");
//
//                  // y-axis
//               chartSct.append("g")
//                   .attr("class", "y axis")
//                   .call(yAxisSct)
//                 .append("text")
//                   .attr("class", "caption")
//                   .attr("transform", "rotate(-90)")
//                   .attr("y", 6)
//                   .attr("dy", ".71em")
//                   .style("text-anchor", "end")
//                   .text(title);
//
//                 // draw dots
//               chartSct.selectAll(".dot")
//                   .data(worldscat)
//                 .enter().append("circle")
//                   .attr("class", "dot")
//                   .attr("id", (s)=> s.country)
//                   .attr("r", 3.5)
//                   .attr("cx", (s)=> xScaleSct(s.gdp_bar))
//                   .attr("cy", (s)=> yScaleSct(s.value_bar))
//                   .style("fill", "#3897E1")
//                   .style("opacity", 1)
//                   .on("mousemove", function(d) {
//                       tooltipSct.classed("hidden",false)
//                         .style("top", (d3.event.pageY) + "px")
//                         .style("left", (d3.event.pageX + 5) + "px")
//                         .style("opacity", .9)
//                         .html(d.country + "<br/> GDP: " +
//                            world_gdp +
//                           "<br/> " + title + ": " + worldscat.value_bar + ")");
//                   })
//                   .on("mouseout", function(d) {
//                       tooltipSct.transition()
//                            .duration(500)
//                            .style("opacity", 0);
//                   });
//
//                   chartSct.selectAll(".dot")
//                       .data(topo.features)
//                     .enter().append("circle")
//                       .attr("id", function(d) {
//                         d.country_code = code.get(d.id) || 0;
//                         return d.country_code;
//                       })
//                       .attr("class", "dot")
//                       .attr("r", 3.5)
//                       .attr("cx", xMapSct)
//                       .attr("cy", yMapSct)
//                       .style("fill", "#3897E1")
//                       .style("opacity", function(d) {
//                         if (xValueSct(d) == 0 || yValueSct(d)==0) {
//                           return 0;
//                         } else if (d.country_name == bar_data[0].country || d.country_code == bar_data[1].country || d.country_code == bar_data[2].country) {
//                           return 1;
//                         } else if (d.country_code == "World"){
//                           return 1;
//                         } else {
//                           return 0.1;
//                         }
//                       })
//                       .on("mousemove", function(d) {
//                           tooltipSct.classed("hidden",false)
//                             .style("top", (d3.event.pageY - 28) + "px")
//                             .style("left", (d3.event.pageX + 5) + "px")
//                             .style("opacity", .9)
//                             .html(d.id +
//                               "<br/> (" + xValueSct(d) +
//                               ", " + yValueSct(d)+ ")");
//                       })
//                       .on("mouseout", function(d) {
//                           tooltipSct.transition()
//                                .duration(500)
//                                .style("opacity", 0);
//                       });
//
//                     }
//                   }
//           }; //end onclick
//           // .on("mouseout",function(d,i){
//           //   d3.select(this).attr("stroke-width",1);
//           //   d.region = region.get(d.id) || "-";
//           //   d3.selectAll("path")
//           //     .attr('fill-opacity', 1);
//           //   tooltip.classed("hidden", true);
//           // });
//     }
// };
