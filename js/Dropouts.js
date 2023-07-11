/*
This code handles the interactive component of the Dropout ("Fail-safe networks") section.
Slider inputs are caught and the image is changed to show the dropout case of the selected antenna.
The type of optimisation can also be changed via a 'querySelector' object.
*/

if(window.addEventListener) {
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
            /// GET THE I/O HTML OBJECTS
            sliderDropout = document.getElementById('sliderDropout');
            sliderDropout.addEventListener("input", function(e){setNDropout(e.target.value);}, false);
            valueDropout = document.getElementById('valueDropout');
            if (document.querySelector('input[name="pickOptimisation"]')) {
                document.querySelectorAll('input[name="pickOptimisation"]').forEach((elem) => {
                    elem.addEventListener("change", changeOptimisation, false);
                });
            }

            /// Load the images
            for (let i = 0; i < 8; i++) {
                fileNamesDropoutSum[i] = "img/Dropouts/sum_8_50_dropout_" + i + ".png"; //URL.createObjectURL(fileNames[i]);
                fileNamesDropoutRobust[i] = "img/Dropouts/robust_main_road_NLOS_offset_new_8_50_dropout_" + i + ".png";
            }
            setNDropout(0);

        }
        function changeOptimisation()
        {
          // this function is called when a user changes between optimisation for coverage and dropouts.
          OptimisationType = this.value; // get new optimisation type
          displayImage(); // render image
        }
        function setNDropout(N)
        {
          // this function is called when the user moves the slider.
            if ( N != N_dropout )
            {
                N_dropout = N; // set the new index of the failed antenna
                valueDropout.innerHTML = N_dropout.toString(); // change the displayed value
                requestAnimationFrame(displayImage); // render image
            }
        }

        function displayImage()
        {
          // this function re-loads the image based on the current parameters.
          // It is called by other functions that respond to user changes.
            if (OptimisationType == 'coverage')
            {
               dropoutImage.src = fileNamesDropoutSum[N_dropout]; // change the image src URL
            }
            else {
              dropoutImage.src = fileNamesDropoutRobust[N_dropout]; // change the image src URL
          }
        }
        init();

    }, false);
}
