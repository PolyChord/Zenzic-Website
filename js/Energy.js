if(window.addEventListener) {
    let filesEnergy = new Array()
    let fileNamesEnergy = new Array();
    let N_Energy = -1, scaleEnergy = 0.5;

    let sliderMinPower, valueMinPower;
    let sliderMeanPower, valueMeanPower;
    let energyUsage;
    let currentEnergy, currentMinPower = -110, currentMeanPower = -95;
    let minPower = new Array();
    let meanPower = new Array();
    let energy = new Array();

    window.addEventListener('load', function () {
        var canvasEnergy, contextEnergy;
        var imageCanvasEnergy, imageContextEnergy;
        var canvasWrapperEnergy;
        // Initialization sequence.
        function init () {
            // Find the wrapper
            canvasWrapperEnergy = document.getElementById('canvasWrapperEnergy');
            if (!canvasWrapperEnergy) {
                alert('Error: I cannot find the canvas wrapper element!');
                return;
            }
            // Find the canvas elements.

            imageCanvasEnergy = document.getElementById('imagesEnergy');
            if (!imageCanvasEnergy) {
                alert('Error: I cannot find the canvas element!');
                return;
            }

            if (!imageCanvasEnergy.getContext) {
                alert('Error: no canvas.getContext!');
                return;
            }

            // Get the 2D canvas context.
            imageContextEnergy = imageCanvasEnergy.getContext('2d');
            if (!imageContextEnergy) {
                alert('Error: failed to getContext!');
                return;
            }
            /// GET THE I/O HTML OBJECTS
            sliderMinPower = document.getElementById('sliderMinPower');
            sliderMinPower.addEventListener("input", function(e){setMinPower(e.target.value);}, false);
            valueMinPower = document.getElementById('valueMinPower');
            sliderMeanPower = document.getElementById('sliderMeanPower');
            sliderMeanPower.addEventListener("input", function(e){setMeanPower(e.target.value);}, false);
            valueMeanPower = document.getElementById('valueMeanPower');
            energyUsage = document.getElementById('energyUsage');
            //sliderZoom = document.getElementById('sliderZoom');
            //sliderZoom.addEventListener("input", function(e){setZoom(e.target.value);}, false);

            /// Load the images
            for (let i = 0; i < 30; i++) {
                const img = document.createElement("img");
                img.classList.add("obj");
                img.src = "img/Energy/" + i +".png" //URL.createObjectURL(fileNames[i]);
                if (i == 29)
                {
                    img.onload = function(){
                      filesEnergy[i] = img;
                      valueMinPower.innerHTML = currentMinPower.toString()+' dBm';
                      valueMeanPower.innerHTML = currentMeanPower.toString()+' dBm';
                      calculate_new_index(currentMinPower, currentMeanPower);
                    }
                } else {
                    img.onload = function(){
                        filesEnergy[i] = img;
                    }
                }
            }

            /// load the data

            var readerMinPower = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
            var readerMeanPower = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
            var readerEnergy = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

            function loadMinPower() {
                readerMinPower.open('get', "data/min_power.txt", true);
                readerMinPower.onreadystatechange = function() {
                    var text = readerMinPower.responseText;
                    // Now convert it into array using regex
                    minPower = text.split(/\n|\r/g).map(Number);
                }
                readerMinPower.send(null);
            }
            function loadMeanPower() {
                readerMeanPower.open('get', "data/mean_power.txt", true);
                readerMeanPower.onreadystatechange = function() {
                    var text = readerMeanPower.responseText;
                    // Now convert it into array using regex
                    meanPower = text.split(/\n|\r/g).map(Number);
                }
                readerMeanPower.send(null);
            }
            function loadEnergy() {
                readerEnergy.open('get', "data/energy.txt", true);
                readerEnergy.onreadystatechange = function() {
                    var text = readerEnergy.responseText;
                    // Now convert it into array using regex
                    energy = text.split(/\n|\r/g).map(Number);
                }
                readerEnergy.send(null);
            }

            loadMinPower();
            loadMeanPower();
            loadEnergy();

        }
        function setMinPower(P)
        {
            if (P != currentMinPower)
            {
                currentMinPower = P;
                valueMinPower.innerHTML = currentMinPower.toString()+' dBm';
                calculate_new_index(currentMinPower, currentMeanPower);
            }
        }
        function setMeanPower(P)
        {
            if (P != currentMeanPower)
            {
                currentMeanPower = P;
                valueMeanPower.innerHTML = currentMeanPower.toString() + ' dBm';
                calculate_new_index(currentMinPower, currentMeanPower);
            }
        }
        function calculate_new_index(min, mean)
        {
            //console.log(min,mean, energy);
            for (let i = 0; i < energy.length; i++) {
                //console.log(minPower[i], min, meanPower[i], mean);
                if (minPower[i] >= min && meanPower[i] >= mean)
                {
                    currentEnergy = energy[i];
                    energyUsage.value = currentEnergy.toString()+" mW";
                    N_energy = i;
                    break;
                }
            }
            requestAnimationFrame(displayImage);
        }

        function displayImage()
        {
            //console.log(N_energy)
            var imageEnergy = filesEnergy[N_energy];
            if ((imageCanvasEnergy.width !== scaleEnergy*imageEnergy.width) || (imageCanvasEnergy.height !== scaleEnergy*imageEnergy.height)) {
                imageCanvasEnergy.width = scaleEnergy*imageEnergy.width;
                imageCanvasEnergy.height = scaleEnergy*imageEnergy.height;
                var widthstr = (scaleEnergy*imageEnergy.width).toString().concat('px');
                var heightstr = (scaleEnergy*imageEnergy.height).toString().concat('px');
                canvasWrapperEnergy.style.width = widthstr;
                canvasWrapperEnergy.style.height = heightstr;
            }
            imageContextEnergy.clearRect(0, 0, imageCanvasEnergy.width, imageCanvasEnergy.height);
            imageContextEnergy.setTransform(1, 0, 0, 1, 0, 0);
            imageContextEnergy.scale(scaleEnergy, scaleEnergy);
            imageContextEnergy.drawImage(imageEnergy, 0, 0);
        }
        init();


    }, false);
}
