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

</body>

<footer id="foot" >
    Copyright &copy; 2019 - Capstone Group Project #1
  </footer>
</html>
