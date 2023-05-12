if(window.addEventListener) {
    let fileNamesExclusion = new Array();
    let imagesExclusion = new Array();
    let N_Exclusion = -1, scaleExclusion = 1.;
    let minSignal, meanSignal;
    let minPowerExclusion = new Array();
    let meanPowerExclusion = new Array();
    let coordinates = new Array();
    let excludedCoordinates = new Array();
    let excludedCoordinatesCanvas = new Array();
    let coord_x_min = 250, coord_x_max = 1000;
    let coord_y_min = 30, coord_y_max = 770;
    let map_to_canvas_ratio = (770-30)/(609-21);


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
            //sliderZoom = document.getElementById('sliderZoom');
            //sliderZoom.addEventListener("input", function(e){setZoom(e.target.value);}, false);

            // Find the wrapper

            // Find the canvas elements.

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

            imageCanvas.addEventListener("click", onClick, false);


            /// load the data

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
            loadMinPowerExclusion();


            function load_images() {
              /// Load the images
              for (let i = 0; i < 93; i++) {
                  fileNamesExclusion[i] = "img/Exclusion/" + i +".png";
                  const img = document.createElement("img");
                  img.classList.add("obj");
                  img.src = fileNamesExclusion[i];
                  if (i==0) {
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
            if ( N != N_Exclusion )
            {
                N_Exclusion = N;
                meanSignal.value = meanPowerExclusion[N_Exclusion].toString()+" dBm";
                minSignal.value = minPowerExclusion[N_Exclusion].toString()+" dBm";

            }
            requestAnimationFrame(displayImage);
        }

        function clearExclusions() {
          excludedCoordinates = new Array();
          excludedCoordinatesCanvas = new Array();
          calculate_new_coordinates();
        }

        function checkExclusionExists(coord) {
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
            excludedCoordinates.splice(i, 1);
            excludedCoordinatesCanvas.splice(i, 1);
          }
          return exists;
        }
        function calculate_new_coordinates() {
          var choose = true;
          var N = -1;
          for (let i = 0; i < coordinates.length; i++) {
            choose = true;
            for (let j = 0; j < excludedCoordinates.length; j++) {
              if (choose == false) {break;}
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
            excludedCoordinates.pop();
            excludedCoordinatesCanvas.pop();
            alert("All options exhausted. Please reset the excluded coordinates.")
          } else {
            setNExclusion(N);
          }
        }

        function displayImage()
        {
            var image = imagesExclusion[N_Exclusion];
            /*if ((imageCanvas.width !== scale*image.width) || (imageCanvas.height !== scale*image.height)) {
                imageCanvas.width = scale*image.width;
                imageCanvas.height = scale*image.height;
            }*/
            imageContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            imageContext.setTransform(1, 0, 0, 1, 0, 0);
            //imageContext.scale(scaleExclusion, scaleExclusion);
            imageContext.drawImage(image, 0, 0);//, width, height);
            for (let i = 0; i < excludedCoordinatesCanvas.length; i++) {
              imageContext.beginPath();
              imageContext.strokeStyle = '#DB0000';
              imageContext.lineWidth = 3;
              imageContext.arc(excludedCoordinatesCanvas[i][0], excludedCoordinatesCanvas[i][1], 25/map_to_canvas_ratio, 0, 2 * Math.PI);
              imageContext.stroke();
            }
        }
        function onClick(ev) {
          var rect = imageCanvas.getBoundingClientRect();
          var width = rect.width;
          var height = rect.height;
          scaleExclusion = 921/width;
          //console.log(width, height, scaleExclusion);
          canvas_x = ev.clientX - rect.left;
          canvas_y = ev.clientY - rect.top;
          coords_x = 250.+ (1000-250)*(canvas_x - 125./scaleExclusion)/((721-125)/scaleExclusion);
          coords_y = 770 - (770-30)*(canvas_y - 21./scaleExclusion)/((609-21)/scaleExclusion);
          canvas_x *= scaleExclusion;
          canvas_y *= scaleExclusion;
          //console.log(canvas_x, canvas_y, coords_x, coords_y);
          exclusionExists = checkExclusionExists([coords_x, coords_y]);
          if (!exclusionExists) {
            excludedCoordinatesCanvas.push([canvas_x, canvas_y]);
            excludedCoordinates.push([coords_x, coords_y]);
          }
          calculate_new_coordinates();
      }



        init();

    }, false);
}
