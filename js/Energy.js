if(window.addEventListener) {
    let filesNamesMetric = new Array();
    let fileNamesEnergy = new Array();
    let N_Energy = 10, scaleEnergy = 0.5;

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
            /// GET THE I/O HTML OBJECTS
            N_energy = 10
            sliderMinPower = document.getElementById('sliderMinPower');
            sliderMinPower.addEventListener("input", function(e){setMinPower(e.target.value);}, false);
            valueMinPower = document.getElementById('valueMinPower');
            sliderMeanPower = document.getElementById('sliderMeanPower');
            sliderMeanPower.addEventListener("input", function(e){setMeanPower(e.target.value);}, false);
            valueMeanPower = document.getElementById('valueMeanPower');
            energyUsage = document.getElementById('energyUsage');
            energySavings = document.getElementById('energySavings');
            imageEnergy = document.getElementById("EnergyCoverage");
            imageEnergyMetric = document.getElementById("EnergyMetric");
            //sliderZoom = document.getElementById('sliderZoom');
            //sliderZoom.addEventListener("input", function(e){setZoom(e.target.value);}, false);

            /// Load the images
            for (let i = 0; i < 30; i++) {
                fileNamesEnergy[i] = "img/Energy/" + i +".png";
                filesNamesMetric[i] = "img/Energy/metric_" + i +".png";
            }
            valueMinPower.innerHTML = currentMinPower.toString()+' dBm';
            valueMeanPower.innerHTML = currentMeanPower.toString()+' dBm';

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
                    calculate_new_index(currentMinPower, currentMeanPower);
                }
                readerMinPower.send(null);
            }
            function loadMeanPower() {
                readerMeanPower.open('get', "data/mean_power.txt", true);
                readerMeanPower.onreadystatechange = function() {
                    var text = readerMeanPower.responseText;
                    // Now convert it into array using regex
                    meanPower = text.split(/\n|\r/g).map(Number);
                    calculate_new_index(currentMinPower, currentMeanPower);
                }
                readerMeanPower.send(null);
            }
            function loadEnergy() {
                readerEnergy.open('get', "data/energy.txt", true);
                readerEnergy.onreadystatechange = function() {
                    var text = readerEnergy.responseText;
                    // Now convert it into array using regex
                    energy = text.split(/\n|\r/g).map(Number);
                    calculate_new_index(currentMinPower, currentMeanPower);
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
                    energySavings.value = (100 - currentEnergy*100/2511.89).toFixed(1).toString()+" %";
                    N_energy = i;
                    console.log(minPower[i], min, meanPower[i], mean);
                    break;
                }
            }
            displayImage();
        }

        function displayImage()
        {
            imageEnergy.src = fileNamesEnergy[N_energy];
            imageEnergyMetric.src = filesNamesMetric[N_energy];
        }
        init();


    }, false);
}
