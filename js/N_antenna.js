/*
This code handles the interactive component of the N_antenna ("Transmitter placement") section.
Slider changes for number of antennas to place are caught and the two images
(coverage map and signal vs number of antennas plot) are changed.
*/
if(window.addEventListener) {
    let files = new Array();
    let fileNames = new Array();
    let filesMetric = new Array();
    let N_antenna = -1, N_antenna_min = 2, N_antenna_max=9;
    let rowId = 0, circleRadius = 3;
    let sliderN, valueN, sliderZoom;


    window.addEventListener('load', function () {
        // Initialization sequence.
        function init () {
            /// GET THE I/O HTML OBJECTS
            sliderN = document.getElementById('sliderN');
            sliderN.addEventListener("input", function(e){setNAntenna(e.target.value);}, false);
            valueN = document.getElementById('valueN');
            metricImage = document.getElementById("NAntennaMetric");
            coverageImage = document.getElementById("NAntennaCoverage");

            /// set the image paths
            for (let i = N_antenna_min; i <= N_antenna_max; i++) {
                filesMetric[i-N_antenna_min] = "img/N_antenna/metrics_N_" + i + ".png"
                fileNames[i-N_antenna_min] = "img/N_antenna/sum_N_" + i + ".png"
            }
            setNAntenna(6); // the default is N=6
        }
        function setNAntenna(N)
        {
          // this function is called when the user moves the slider
            if ( N != N_antenna ) // if new value is different from old
            {
                N_antenna = N;
                valueN.innerHTML = N_antenna.toString(); // set display string next to slider
                requestAnimationFrame(displayImage); // update images
            }
        }

        function displayImage()
        {
          // this function updates the images to reflect the changed N_antenna
            metricImage.src = filesMetric[N_antenna-N_antenna_min];
            coverageImage.src = fileNames[N_antenna-N_antenna_min];
        }
        init();

    }, false);
}
