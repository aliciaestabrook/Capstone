<!DOCTYPE html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<html>
    <head>
		<title>HeatMap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="capstonestyle.css">
        <link href="https://fonts.googleapis.com/css?family=Dosis|Staatliches" rel="stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    </head>
    <style>
    .accordion {
  		background-color: #eee;
  		color: #444;
  		cursor: pointer;
  		padding: 18px;
  		width: 100%;
  		border: none;
  		text-align: left;
  		outline: none;
  		font-size: 15px;
  		transition: 0.4s;
	}

	.active, .accordion:hover {
  		background-color: #ccc;
	}

	.accordion:after {
  		content: '\002B';
  		color: #777;
  		font-weight: bold;
  		float: right;
  		margin-left: 5px;
	}

	.active:after {
  		content: "\2212";
	}

	.panel {
  		padding: 0 18px;
  		background-color: white;
  		max-height: 0;
  		overflow: hidden;
  		transition: max-height 0.2s ease-out;
	}
    
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
 <h2>Food Security Interactive Heatmap</h2>
	<button class="accordion">Interacting with the Heatmap</button>
	<div class="panel">
  		<p>Select an attribute from the dropdown menu to the left to view filtered data for each country.</p>
	</div>

	<button class="accordion">Bar Chart</button>
	<div class="panel">
  		<p>Click on a country within the map below to view a bar chart that compares data for your chosen country with both the region and the world.</p>
	</div>

	<button class="accordion">Scatter Plot</button>
	<div class="panel">
  		<p>Click on a country within the map below to view a scatterplot that compares data for your chosen country with both the region and the world.</p>
	</div>


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

<script>
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}
</script>
</body>
<footer id="foot" >
    Copyright &copy; 2019 - Capstone Group Project #1
  </footer>
</html>
