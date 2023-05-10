if(window.addEventListener) {
    let filesDropout = new Array();
    let fileNamesDropoutSum = new Array();
    let fileNamesDropoutRobust = new Array();
    let N_dropout = -1, scaleDropout = 0.8;
    let OptimisationType = 'coverage'
    let sliderDropout, valueDropout;


    window.addEventListener('load', function () {
        // Initialization sequence.
        function init () {
            // Find the image
            dropoutImage = document.getElementById("imagesDropout");
            console.log("HelloWorldDropout")
            /// GET THE I/O HTML OBJECTS
            sliderDropout = document.getElementById('sliderDropout');
            sliderDropout.addEventListener("input", function(e){setNDropout(e.target.value);}, false);
            valueDropout = document.getElementById('valueDropout');
            if (document.querySelector('input[name="pickOptimisation"]')) {
                document.querySelectorAll('input[name="pickOptimisation"]').forEach((elem) => {
                    elem.addEventListener("change", changeOptimisation, false);
                });
            }

            //sliderZoom = document.getElementById('sliderZoom');
            //sliderZoom.addEventListener("input", function(e){setZoom(e.target.value);}, false);

            /// Load the images
            for (let i = 0; i < 8; i++) {
                fileNamesDropoutSum[i] = "img/Dropouts/sum_8_50_dropout_" + i + ".png"; //URL.createObjectURL(fileNames[i]);
                fileNamesDropoutRobust[i] = "img/Dropouts/robust_main_road_NLOS_offset_new_8_50_dropout_" + i + ".png";
            }
            setNDropout(0);

        }
        function changeOptimisation()
        {
          OptimisationType = this.value;
          displayImage();
        }
        function setNDropout(N)
        {
            if ( N != N_dropout )
            {
                N_dropout = N;
                valueDropout.innerHTML = N_dropout.toString();
                requestAnimationFrame(displayImage);
            }
        }

        function displayImage()
        {
            if (OptimisationType == 'coverage')
            {
               dropoutImage.src = fileNamesDropoutSum[N_dropout];
            }
            else {
              dropoutImage.src = fileNamesDropoutRobust[N_dropout];
          }
        }
        init();

    }, false);
}
