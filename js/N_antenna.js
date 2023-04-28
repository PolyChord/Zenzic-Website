if(window.addEventListener) {
    let files = new Array();
    let fileNames = new Array("img/N_antenna/sum_N_2.png", "img/N_antenna/sum_N_3.png", "img/N_antenna/sum_N_4.png", "img/N_antenna/sum_N_5.png", "img/N_antenna/sum_N_6.png", "img/N_antenna/sum_N_7.png", "img/N_antenna/sum_N_8.png", "img/N_antenna/sum_N_9.png");
    let filesMetric = new Array();
    let N_antenna = -1, N_antenna_min = 2, scale = 1;
    let rowId = 0, circleRadius = 3;
    let sliderN, valueN, sliderZoom;


    window.addEventListener('load', function () {
        var canvas, context;
        var imageCanvas, imageContext;
        var canvasWrapper;
        var color = '#A6FF00';
        // Initialization sequence.
        function init () {
            /// GET THE I/O HTML OBJECTS
            sliderN = document.getElementById('sliderN');
            sliderN.addEventListener("input", function(e){setNAntenna(e.target.value);}, false);
            valueN = document.getElementById('valueN');
            metricImage = document.getElementById("NAntennaMetric");
            coverageImage = document.getElementById("NAntennaCoverage");

            /// Load the images
            for (let i = 2; i < 10; i++) {
                filesMetric[i-2] = "img/N_antenna/metrics_N_" + i + ".png" //URL.createObjectURL(fileNames[i]);
                fileNames[i-2] = "img/N_antenna/sum_N_" + i + ".png"
            }
            setNAntenna(6);
        }
        function setNAntenna(N)
        {
            if ( N != N_antenna )
            {
                N_antenna = N;
                valueN.innerHTML = N_antenna.toString();
                requestAnimationFrame(displayImage);
            }
        }

        function displayImage()
        {
            metricImage.src = filesMetric[N_antenna-N_antenna_min];
            coverageImage.src = fileNames[N_antenna-N_antenna_min];
        }
        init();

    }, false);
}
