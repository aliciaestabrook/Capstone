<!DOCTYPE html>
<meta charset="utf-8">
<html lang="en">
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
   <title>HeatMap</title>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

      <link href="https://fonts.googleapis.com/css?family=Dosis|Staatliches" rel="stylesheet">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <link rel="stylesheet" type="text/css" href="capstonestyle.css">

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
      margin-top: 3%;
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
      /* margin-top: 3%;
      margin-left: 3%; */
      /* position: absolute; */
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
  div.tooltip, div.tooltipSct {
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
      text-align: center;
  }
  #svgmap, #svgscatter, #svgbar {
    font-family: Arial, Helvetica, sans-serif;
    display: block;
    margin:auto;
  }
  svg.banner {
    width: 100%; height: auto;
  }
  #svgdiv {
    width: 65%;
    margin: auto;
    display: inline-block;
    text-align: center;
  }
  #bardiv #scatterdiv {
    margin: auto;
    display: inline-block;
    text-align: center;
  }

  #svgscatter.axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  .dot {
    stroke: #000;
  }

  .tooltipSct {
    position: absolute;
    width: 200px;
    height: 90px;
  }

  #labels, #yscalebar, #xaxis, #yaxis {
    font-size: 120%;
  }

.chartcontainer {
  float: left;
  width: 100%;
}

#chartwrapper {
  border-radius: 15px;
}

.regression {
		  stroke-width: 1.4px;
		  stroke: #7F320C;
		  stroke-dasharray: 10,5;
		}
  #titleheader {
    text-align: center;
    font-size: 2.2em;
    font-weight: bold;
  }
  #geoheader{
    text-align: center;
    font-size: 1.8em;
    margin-top: -1.5%;
  }
  #hr {
    margin-top: 1%;
    margin-left: 5%;
    margin-right: 5%;
    border-width: 2%;
  }
  #chartheader {
    margin-bottom: -1.5%;

  }
  button {
    display: inline-block;
    float: left;
    border: none;
    padding: 1rem 2rem;
    margin: 0;
    text-decoration: none;
    background: #F9F8F8;
    color: black;
    font-family: sans-serif;
    font-size: 1.2rem;
    cursor: pointer;
    text-align: center;
    transition: background 250ms ease-in-out,
                transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
}

button:hover,
button:focus {
    background: #e0ebeb;
}

button:focus {
    outline: 1px solid #fff;
    outline-offset: -4px;
}

button:active {
    transform: scale(0.99);
}

table {
  width: 80%;
  margin: auto;
  font-size: 1.2em;
}

</style>
<body>
<?php
    include "menu.php";
?>
 <h2 id="heading">Food Security Interactive Heatmap</h2>
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
  		<p>Click on a country within the map below to view a bar chart that compares data for your chosen country with both the region and the world.</p>
	</div>




  <!-- map div -->
<div class="centerdiv container-fluid text-center " style="text-align: center; padding-bottom: 20%;">
  <div class="row" style="margin-bottom: 4%;">
    <div id="mapheadspan" class="col-2" style="padding: 2%;">
      <!-- <div " > -->
        <span id="menu"></span>
      <!-- </div> -->
    </div>
    <div id="svgdiv" class="col-8">
      <svg id="svgmap" width="960" height="600" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid meet"></svg>
      <div class="tooltip"></div>
    </div>
    <div class="col-2">
    </div>
  </div>

  <div id="chartwrapper" style="margin-left: 2.5%; margin-right: 2.5%; margin-bottom:3%; padding-top:2%;">

    <div class="row" >
      <div id="select2" class="col-3" style="margin-bottom: 2%;"  >
        <span id="menu2" style="display: inline-block; padding-left: 10%; "></span>
      </div>

      <div class="col-9">
      </div>
    </div>


    <div class="row" style="padding: 0%; padding-top: 0%;">
      <div id="chartheader" class="col-sm-12">
      </div>
    </div>



  <!-- bar chart div -->
  <div class="row" style="padding: 2%;">
    <div id="bardiv" style="text-align: center; margin-bottom:5%; background-color: #F9F8F8;" height="600" class="chartcontainer col-sm-6">
    </div>

    <!-- scatter chart div -->
    <div id="scatterdiv" style="text-align: center; margin-bottom:5%; background-color: #F9F8F8;" height="600" class="chartcontainer col-sm-6">
      <div class="tooltipSct hidden"></div>
    </div>
  </div>

  <div class="row" style="padding: 2%;">
        <div class="col-sm-12">
          <p> this is where the table would go! </p>
            <div id="tablediv" style="text-align: center; margin-bottom:5%; background-color: #F9F8F8;" height="600" class="chartcontainer col-sm-6">
            </div>

            <div class="col-sm-6">
            </div>

        </div>
  </div>

  <div class="row" style="padding: 2%;">
      <div id="scrollup" class="col-sm-12 hidden">
      </div>
  </div>

</div>
</div>

    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://d3js.org/topojson.v1.min.js"></script>
    <script src="https://datamaps.github.io/scripts/datamaps.world.min.js?v=1"></script>
    <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
    <script src="https://d3js.org/d3-geo-projection.v2.min.js"></script>
    <script src="https://d3js.org/d3-queue.v3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.24.0/d3-legend.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://unpkg.com/simple-statistics@7.0.2/dist/simple-statistics.min.js"></script>

    <script type='text/javascript' src='script_alex.js'></script>

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
