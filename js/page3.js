/*
*    Page3.js
*    Project 2 - ZM11 (Zhouning Ma)
*/

var parseTime = d3.timeParse("%d-%m-%Y");
var formatTime = d3.timeFormat("%d-%m-%Y");


// Add jQuery UI slider
$("#date-slider").slider({
    range: true,
    max: parseTime("03-11-2020").getTime(),
    min: parseTime("07-17-2020").getTime(),
    step: 86400000, // One day
    values: [parseTime("03-11-2020").getTime(), parseTime("07-17-2020").getTime()],
    slide: function (event, ui) {
        $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
        $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
        update();
    }
});

function update() {
    var sliderValues = $("#date-slider").slider("values");  
}

new CanadaMap();