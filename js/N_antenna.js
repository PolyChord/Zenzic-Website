if(window.addEventListener) {
    let files = new Array()
    let fileNames = new Array("img/N_antenna/sum_N_2.png", "img/N_antenna/sum_N_3.png", "img/N_antenna/sum_N_4.png", "img/N_antenna/sum_N_5.png", "img/N_antenna/sum_N_6.png", "img/N_antenna/sum_N_7.png", "img/N_antenna/sum_N_8.png", "img/N_antenna/sum_N_9.png");
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
            // Find the wrapper
            canvasWrapper = document.getElementById('canvasWrapper');
            if (!canvasWrapper) {
                alert('Error: I cannot find the canvas wrapper element!');
                return;
            }
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
            canvas = document.getElementById('drawing');
            if (!canvas) {
                alert('Error: I cannot find the canvas element!');
                return;
            }

            if (!canvas.getContext) {
                alert('Error: no canvas.getContext!');
                return;
            }

            // Get the 2D canvas context.
            context = canvas.getContext('2d');
            if (!context) {
                alert('Error: failed to getContext!');
                return;
            }
            console.log("HelloWorld")
            /// GET THE I/O HTML OBJECTS
            sliderN = document.getElementById('sliderN');
            sliderN.addEventListener("input", function(e){setNAntenna(e.target.value);}, false);
            valueN = document.getElementById('valueN');
            //sliderZoom = document.getElementById('sliderZoom');
            //sliderZoom.addEventListener("input", function(e){setZoom(e.target.value);}, false);

            /// Load the images
            for (let i = 0; i < fileNames.length; i++) {
                const img = document.createElement("img");
                img.classList.add("obj");
                img.src = fileNames[i] //URL.createObjectURL(fileNames[i]);
                if (i == 6)
                {
                    img.onload = function(){
                    files[i] = img;
                    setNAntenna(6);
                    }
                } else {
                    img.onload = function(){
                        files[i] = img;
                    }
                }
            }
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
            var image = files[N_antenna-N_antenna_min];
            if ((canvas.width !== scale*image.width) || (canvas.height !== scale*image.height)) {
                canvas.width = scale*image.width;
                canvas.height = scale*image.height;
                imageCanvas.width = scale*image.width;
                imageCanvas.height = scale*image.height;
                var widthstr = (scale*image.width).toString().concat('px');
                var heightstr = (scale*image.height).toString().concat('px');
                canvasWrapper.style.width = widthstr;
                canvasWrapper.style.height = heightstr;
            }
            imageContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            imageContext.setTransform(1, 0, 0, 1, 0, 0);
            imageContext.scale(scale, scale);
            imageContext.drawImage(image, 0, 0);
        }
        init();

    }, false);
}
