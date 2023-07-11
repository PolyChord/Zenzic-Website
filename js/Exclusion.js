/*
This code handles the interactive component of the Exclusion ("Network constraints") section.
When the user clicks on the coverag map, the coordinates are stored in an array. These are subsequently excluded from antenna placement.
and the code looks for a new layout that doesn't have any antennas in the excluded zones. Clicking on an already excluded zone, deletes it again.
When all 93 layout options are exhausted, the code pops an error message, asking the user to reset excluded coordinates.
*/
if(window.addEventListener) {
    let fileNamesExclusion = new Array();
    let imagesExclusion = new Array(); // stores coverage map image of each precalculated layout
    let N_Exclusion = -1, scaleExclusion = 1.;
    let minSignal, meanSignal;
    let minPowerExclusion = new Array(); // stores min power of each precalculated layout
    let meanPowerExclusion = new Array(); // stores mean power of each precalculated layout
    let coordinates = new Array();
    let excludedCoordinates = new Array();
    let excludedCoordinatesCanvas = new Array();
    let coord_x_min = 250, coord_x_max = 1000; // the boundary coordinates of the coverage map.
    let coord_y_min = 30, coord_y_max = 770;
    let pix_x_max = 721, pix_x_min = 125;
    let pix_y_max = 609, pix_y_min = 21;

    let map_to_canvas_ratio = (coord_y_max-coord_y_min)/(pix_y_max-pix_y_min); // this is needed to convert pixels on the image to coordinates on the WMG campus


    window.addEventListener('load', function () {
        var canvas, context;
        var imageCanvasEnergy, imageContextEnergy;
        var canvasWrapperEnergy;
        // Initialization sequence.
        function init () {
            /// GET THE I/O HTML OBJECTS
            meanSignal = document.getElementById('meanSignal');
            minSignal = document.getElementById('minSignal');
            imageEnergy = document.getElementById("EnergyCoverage");
            imageEnergyMetric = document.getElementById("EnergyMetric");
            buttonReset = document.getElementById("clearExclusions");
            buttonReset.addEventListener("click", clearExclusions, false);

            // Find the canvas elements. Here we need an html canvas such that we can draw the excluded zones on it.

            imageCanvas = document.getElementById('images');
            if (!imageCanvas) {
                alert('Error: I cannot find the canvas element!');
                return;
            }

            if (!imageCanvas.getContext) {
                alert('Error: no canvas.getContext!');
                return;
            }

            // Get the 2D canvas context.
            imageContext = imageCanvas.getContext('2d');
            if (!imageContext) {
                alert('Error: failed to getContext!');
                return;
            }

            imageCanvas.addEventListener("click", onClick, false); // function onClick gets called when user clicks somewhere on coverage map


            // load the data. We have a set of precalculated antenna layouts, each with minimum power and mean power, optimised for min+mean
            // These are stored in .txt files and loaded here into arrays. They are sorted from highest to lowest mean+min signal. */

            var readerMinPowerExclusion = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
            var readerMeanPowerExclusion = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
            var readerCoordinatesExclusion = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

            function loadMinPowerExclusion() {
                readerMinPowerExclusion.open('get', "data/Exclusion/min_power.txt", true);
                readerMinPowerExclusion.onreadystatechange = function() {
                    var text = readerMinPowerExclusion.responseText;
                    // Now convert it into array using regex
                    minPowerExclusion = text.split(/\n|\r/g).map(Number);
                    loadMeanPowerExclusion();
                }
                readerMinPowerExclusion.send(null);
            }
            function loadMeanPowerExclusion() {
                readerMeanPowerExclusion.open('get', "data/Exclusion/mean_power.txt", true);
                readerMeanPowerExclusion.onreadystatechange = function() {
                    var text = readerMeanPowerExclusion.responseText;
                    // Now convert it into array using regex
                    meanPowerExclusion = text.split(/\n|\r/g).map(Number);
                    loadCoordinatesExclusion();
                }
                readerMeanPowerExclusion.send(null);
            }
            function loadCoordinatesExclusion() {
                readerCoordinatesExclusion.open('get', "data/Exclusion/coordinates.txt", true);
                readerCoordinatesExclusion.onreadystatechange = function() {
                    coordinates = new Array();
                    var text = readerCoordinatesExclusion.responseText;
                    // Now convert it into array using regex
                    var coord_array = text.split(/\n|\r/g); //.map(Number);
                    var coords = new Array();
                    for (let i=0; i < coord_array.length; i++) {
                      coords.push(coord_array[i].split(" ", 2));
                      if (i % 6 == 5) {
                        coordinates.push(coords);
                        coords = new Array();
                      }
                    }
                    load_images();
                }
                readerCoordinatesExclusion.send(null);
            }
            // the arrays are loaded sequentially, such that the new layout index is
            // not calculated before they are all loaded (otherwise segfaults are possible on slow browsers)
            loadMinPowerExclusion();


            function load_images() {
              /// Load the images. Here we need to preload the images because otherwise we get problems with the canvas.
              for (let i = 0; i < 93; i++) {
                  fileNamesExclusion[i] = "img/Exclusion/" + i +".png";
                  // create a new img object for each image
                  const img = document.createElement("img");
                  img.classList.add("obj");
                  img.src = fileNamesExclusion[i];
                  if (i==0) {
                    // the first image is the default at the start
                    img.onload = function(){
                      imagesExclusion[i] = img;
                      setNExclusion(0);
                    }
                  } else {
                    img.onload = function(){
                      imagesExclusion[i] = img;
                    }
                  }
              }
          }

        }


        function setNExclusion(N)
        {
          // sets the displays of mean and min signal for the current antenna layout
            if ( N != N_Exclusion )
            {
                N_Exclusion = N;
                meanSignal.value = meanPowerExclusion[N_Exclusion].toString()+" dBm";
                minSignal.value = minPowerExclusion[N_Exclusion].toString()+" dBm";

            }
            requestAnimationFrame(displayImage);
        }

        function clearExclusions() {
          // this is called when the user clicks "Reset excluded coordinates".
          // Arrays are re-initialised. New layout is calculated (reset to default)
          excludedCoordinates = new Array();
          excludedCoordinatesCanvas = new Array();
          calculate_new_coordinates();
        }

        function checkExclusionExists(coord) {
          // check if the given coordinates are within 25m of an already existing exclusion zone
          // if so, the exclusion zone will be deleted.
          let exists = false;
          let i = 0;
          for (i = 0; i < excludedCoordinates.length; i++) {
            let distsq = (coord[0]-excludedCoordinates[i][0])**2 + (coord[1]-excludedCoordinates[i][1])**2;
            if (distsq < 625) {
              exists = true;
              break;
            }
          }
          if (exists) {
            // remove the exclusion zone that is within 25m of the given coordinates
            excludedCoordinates.splice(i, 1);
            excludedCoordinatesCanvas.splice(i, 1);
          }
          return exists;
        }

        function calculate_new_coordinates() {
          // loop through layout options from best to worst signal and choose the first without any antenna in an exlusion zone (25m)
          var choose = true;
          var N = -1;
          // loop through layouts
          for (let i = 0; i < coordinates.length; i++) {
            choose = true;
            // loop through exclusion zones
            for (let j = 0; j < excludedCoordinates.length; j++) {
              if (choose == false) {break;}
              // loop through all coordinates of the layout
              for (let k = 0; k < coordinates[i].length; k++) {
                let distsq = (coordinates[i][k][0]-excludedCoordinates[j][0])**2 + (coordinates[i][k][1]-excludedCoordinates[j][1])**2;
                if (distsq < 625) {
                  choose = false;
                  break;
                }
              }
            }
            if (choose == true) {
              N = i;
              break;
            }
          }
          if (N == -1) {
            // if no layout is found that satisfies all exclusion zones, pop an error message
            excludedCoordinates.pop();
            excludedCoordinatesCanvas.pop();
            alert("All options exhausted. Please reset the excluded coordinates.")
          } else {
            setNExclusion(N);
          }
        }

        function displayImage()
        {
          // set image to current layout
            var image = imagesExclusion[N_Exclusion];
            // reset the canvas
            imageContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            imageContext.setTransform(1, 0, 0, 1, 0, 0);
            imageContext.drawImage(image, 0, 0);//, width, height); // draw coverage map on canvas
            // draw a circle for every exclusion zone
            for (let i = 0; i < excludedCoordinatesCanvas.length; i++) {
              imageContext.beginPath();
              imageContext.strokeStyle = '#DB0000';
              imageContext.lineWidth = 3;
              // draw an arc with center at the excluded coordinates, of radius 25m (map scale), from 0 to 2pi  (a whole circle).
              imageContext.arc(excludedCoordinatesCanvas[i][0], excludedCoordinatesCanvas[i][1], 25/map_to_canvas_ratio, 0, 2 * Math.PI);
              imageContext.stroke(); // actually paint the circle you just defined
            }
            // add helpful text
            imageContext.font = "25px Helvetica";
            imageContext.fillText("Click on a location", imageCanvas.width*0.17, imageCanvas.height*0.75);
            imageContext.fillText("to exclude it from", imageCanvas.width*0.17, imageCanvas.height*0.78);
            imageContext.fillText("antenna placement", imageCanvas.width*0.17, imageCanvas.height*0.81);
        }
        function onClick(ev) {
          // this is called when the user clicks on the coverage map to exclude coordinates from an antenna placement.
          var rect = imageCanvas.getBoundingClientRect();
          var width = rect.width;
          var height = rect.height;
          scaleExclusion = 921/width; //the "real" image width devided by the current image width due to responsive design.
          canvas_x = ev.clientX - rect.left; // these are the coordinates of where the mouse was clicked
          canvas_y = ev.clientY - rect.top;
          // transform the mouse coords to WMG coords
          coords_x = coord_x_min + (coord_x_max-coord_x_min)*(canvas_x - pix_x_min/scaleExclusion)/((pix_x_max-pix_x_min)/scaleExclusion);
          coords_y = coord_y_max - (coord_y_max-coord_y_min)*(canvas_y - pix_y_min/scaleExclusion)/((pix_y_max-pix_y_min)/scaleExclusion);
          canvas_x *= scaleExclusion;
          canvas_y *= scaleExclusion;
          // check the exclusion already exists. If so, delete it (done in the function checkExclusionExists). If not, add it as a new one to the list
          exclusionExists = checkExclusionExists([coords_x, coords_y]);
          if (!exclusionExists) {
            excludedCoordinatesCanvas.push([canvas_x, canvas_y]);
            excludedCoordinates.push([coords_x, coords_y]);
          }
          // calculate new layout that satisfies all exclusions.
          calculate_new_coordinates();
      }



        init();

    }, false);
}
