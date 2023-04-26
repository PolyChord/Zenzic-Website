if(window.addEventListener) {
    let filesDropout = new Array()
    let fileNamesDropout = new Array("img/Dropouts/robust_main_road_NLOS_offset_8_50_dropout_0.png", "img/Dropouts/robust_main_road_NLOS_offset_8_50_dropout_1.png", "img/Dropouts/robust_main_road_NLOS_offset_8_50_dropout_2.png", "img/Dropouts/robust_main_road_NLOS_offset_8_50_dropout_3.png", "img/Dropouts/robust_main_road_NLOS_offset_8_50_dropout_4.png", "img/Dropouts/robust_main_road_NLOS_offset_8_50_dropout_5.png", "img/Dropouts/robust_main_road_NLOS_offset_8_50_dropout_6.png", "img/Dropouts/robust_main_road_NLOS_offset_8_50_dropout_7.png");
    let N_dropout = -1, scaleDropout = 0.8;

    let sliderDropout, valueDropout;


    window.addEventListener('load', function () {
        var canvasDropout, contextDropout;
        var imageCanvasDropout, imageContextDropout;
        var canvasWrapperDropout;
        // Initialization sequence.
        function init () {
            // Find the wrapper
            canvasWrapperDropout = document.getElementById('canvasWrapperDropout');
            if (!canvasWrapperDropout) {
                alert('Error: I cannot find the canvas wrapper element!');
                return;
            }
            // Find the canvas elements.

            imageCanvasDropout = document.getElementById('imagesDropout');
            if (!imageCanvasDropout) {
                alert('Error: I cannot find the canvas element!');
                return;
            }

            if (!imageCanvasDropout.getContext) {
                alert('Error: no canvas.getContext!');
                return;
            }

            // Get the 2D canvas context.
            imageContextDropout = imageCanvasDropout.getContext('2d');
            if (!imageContextDropout) {
                alert('Error: failed to getContext!');
                return;
            }
            canvasDropout = document.getElementById('drawingDropout');
            if (!canvasDropout) {
                alert('Error: I cannot find the canvas element!');
                return;
            }

            if (!canvasDropout.getContext) {
                alert('Error: no canvas.getContext!');
                return;
            }

            // Get the 2D canvas context.
            contextDropout = canvasDropout.getContext('2d');
            if (!contextDropout) {
                alert('Error: failed to getContext!');
                return;
            }
            console.log("HelloWorldDropout")
            /// GET THE I/O HTML OBJECTS
            sliderDropout = document.getElementById('sliderDropout');
            sliderDropout.addEventListener("input", function(e){setNDropout(e.target.value);}, false);
            valueDropout = document.getElementById('valueDropout');
            //sliderZoom = document.getElementById('sliderZoom');
            //sliderZoom.addEventListener("input", function(e){setZoom(e.target.value);}, false);

            /// Load the images
            for (let i = 0; i < fileNamesDropout.length; i++) {
                const img = document.createElement("img");
                img.classList.add("obj");
                img.src = fileNamesDropout[i] //URL.createObjectURL(fileNames[i]);
                if (i == 0)
                {
                    img.onload = function(){
                    filesDropout[i] = img;
                    setNDropout(0);
                    }
                } else {
                    img.onload = function(){
                        filesDropout[i] = img;
                    }
                }
            }
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
            var imageDropout = filesDropout[N_dropout];
            if ((canvasDropout.width !== scaleDropout*imageDropout.width) || (canvasDropout.height !== scaleDropout*imageDropout.height)) {
                canvasDropout.width = scaleDropout*imageDropout.width;
                canvasDropout.height = scaleDropout*imageDropout.height;
                imageCanvasDropout.width = scaleDropout*imageDropout.width;
                imageCanvasDropout.height = scaleDropout*imageDropout.height;
                var widthstr = (scaleDropout*imageDropout.width).toString().concat('px');
                var heightstr = (scaleDropout*imageDropout.height).toString().concat('px');
                canvasWrapperDropout.style.width = widthstr;
                canvasWrapperDropout.style.height = heightstr;
            }
            imageContextDropout.clearRect(0, 0, imageCanvasDropout.width, imageCanvasDropout.height);
            imageContextDropout.setTransform(1, 0, 0, 1, 0, 0);
            imageContextDropout.scale(scaleDropout, scaleDropout);
            imageContextDropout.drawImage(imageDropout, 0, 0);
        }
        init();

    }, false);
}
