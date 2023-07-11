/*
This code handles the interactive component of the Energy ("Energy-efficient networks") section.
Slider changes for required minimum signal and required average signal are caught
and the image is changed to show a layout that fulfills these conditions at the lowest power usage.
Energy usage with the current layout is displayed in watts and savings over maximum power settings.
*/
if(window.addEventListener) {
    let filesNamesMetric = new Array();
    let fileNamesEnergy = new Array();
    let N_Energy = 10, scaleEnergy = 0.5;

    let sliderMinPower, valueMinPower;
    let sliderMeanPower, valueMeanPower;
    let energyUsage;
    let currentEnergy, currentMinPower = -110, currentMeanPower = -96;
    let minPower = new Array();
    let meanPower = new Array();
    let energy = new Array();

    window.addEventListener('load', function () {
        // Initialization sequence.
        function init () {
            /// GET THE I/O HTML OBJECTS
            N_energy = 10
            sliderMinPower = document.getElementById('sliderMinPower'); // required minimum power
            sliderMinPower.addEventListener("input", function(e){setMinPower(e.target.value);}, false);
            valueMinPower = document.getElementById('valueMinPower');
            sliderMeanPower = document.getElementById('sliderMeanPower'); // required mean power
            sliderMeanPower.addEventListener("input", function(e){setMeanPower(e.target.value);}, false);
            valueMeanPower = document.getElementById('valueMeanPower');
            energyUsage = document.getElementById('energyUsage');
            energySavings = document.getElementById('energySavings');
            imageEnergy = document.getElementById("EnergyCoverage");
            imageEnergyMetric = document.getElementById("EnergyMetric");

            /// Load the images
            for (let i = 0; i < 30; i++) {
                fileNamesEnergy[i] = "img/Energy/" + i +".png"; // the coverage map files
                filesNamesMetric[i] = "img/Energy/metric_" + i +".png"; // the power vs received signal plot with current case highlighted
            }
            valueMinPower.innerHTML = currentMinPower.toString()+' dBm';
            valueMeanPower.innerHTML = currentMeanPower.toString()+' dBm';

            /* load the data. We have a set of precalculated power levels, each with minimum power, mean power and energy usage.
            These are stored in .txt files and loaded here into arrays. They are sorted from lowest to highest energy usage. */

            var readerMinPower = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
            var readerMeanPower = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
            var readerEnergy = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

            function loadMinPower() {
                readerMinPower.open('get', "data/Energy/min_power.txt", true);
                readerMinPower.onreadystatechange = function() {
                    var text = readerMinPower.responseText;
                    // Now convert it into array using regex
                    minPower = text.split(/\n|\r/g).map(Number);
                    loadMeanPower();
                }
                readerMinPower.send(null);
            }
            function loadMeanPower() {
                readerMeanPower.open('get', "data/Energy/mean_power.txt", true);
                readerMeanPower.onreadystatechange = function() {
                    var text = readerMeanPower.responseText;
                    // Now convert it into array using regex
                    meanPower = text.split(/\n|\r/g).map(Number);
                    loadEnergy();
                }
                readerMeanPower.send(null);
            }
            function loadEnergy() {
                readerEnergy.open('get', "data/Energy/energy.txt", true);
                readerEnergy.onreadystatechange = function() {
                    var text = readerEnergy.responseText;
                    // Now convert it into array using regex
                    energy = text.split(/\n|\r/g).map(Number);
                    calculate_new_index(currentMinPower, currentMeanPower);
                }
                readerEnergy.send(null);
            }
            // the arrays are loaded sequentially, such that the new index is
            // not calculated before they are all loaded (otherwise segfaults are possible on slow browsers)
            loadMinPower();




        }
        function setMinPower(P)
        {
          // this is called when the user changes the required minimum power. New index is calculated
            if (P != currentMinPower)
            {
                currentMinPower = P;
                valueMinPower.innerHTML = currentMinPower.toString()+' dBm';
                calculate_new_index(currentMinPower, currentMeanPower);
            }
        }
        function setMeanPower(P)
        {
          // this is called when the user changes the required mean power. New index is calculated
            if (P != currentMeanPower)
            {
                currentMeanPower = P;
                valueMeanPower.innerHTML = currentMeanPower.toString() + ' dBm';
                calculate_new_index(currentMinPower, currentMeanPower);
            }
        }
        function calculate_new_index(min, mean)
        {
          // this function loops from low to high energy usage power settings
          // to find the lowest one that fullfills current user requirements.
            for (let i = 0; i < energy.length; i++) {
                if (minPower[i] >= min && meanPower[i] >= mean)
                {
                    currentEnergy = energy[i];
                    energyUsage.value = currentEnergy.toString()+" mW";
                    // 2511.89 is the max energy usage
                    energySavings.value = (100 - currentEnergy*100/2511.89).toFixed(1).toString()+" %";
                    N_energy = i;
                    break;
                }
            }
            displayImage();
        }

        function displayImage()
        {
          // changes the image to the current setting
            imageEnergy.src = fileNamesEnergy[N_energy];
            imageEnergyMetric.src = filesNamesMetric[N_energy];
        }
        init();


    }, false);
}
