/*
*    Page1.js
*    Project 2 - ZM11 (Zhouning Ma)
*/

var margin = { left:80, right:20, top:50, bottom:100 };
var height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

var time = 0;
var interval;
var formattedData = [];

var provincesList = ["British Columbia","Alberta","Saskatchewan","Manitoba","Ontario","Quebec","Newfoundland and Labrador","New Brunswick","Nova Scotia","Prince Edward Island","Yukon","Northwest Territories","Nunavut","Repatriated travellers"];

// Scales
var x = d3.scaleLog()
    .base(100)
    .range([0, width])
    .domain([100, 110000]);
var y = d3.scaleLog()
    .base(100)
    .range([height, 0])
    .domain([1, 9000]);
var area = d3.scaleLinear()
    .range([25*Math.PI, 2000*Math.PI])
    .domain([0, 3500000]);
var continentColor = d3.scaleOrdinal(d3.schemePastel1);


// Labels
var xLabel = g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Number of confirmed case");
var yLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Number of deaths")
var timeLabel = g.append("text")
    .attr("y", height -10)
    .attr("x", width - 100)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("3-11-2020");

// X Axis
var xAxisCall = d3.axisBottom(x)
    .tickValues([1, 100, 1000, 10000, 100000])
    .tickFormat(d3.format(","));
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")
    .call(xAxisCall);

//var yAxisCall = d3.axisLeft(y)
//    .tickFormat(function(d){ return +d; });


var yAxisCall = d3.axisLeft(y)
    .tickValues([1, 10, 100, 1000, 10000])
    .tickFormat(d3.format(","));
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);


//legend
var legend = g.append("g")
    .attr("transform", "translate(" + (width - 10) + "," + (height - 250) + ")");

provincesList.forEach(function (continent, i) {
    var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 12 + 30) + ")");

    legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", continentColor(continent));

    legendRow.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .style("font-size", 9)
        .text(continent);
});


d3.csv("data/canadacovid19.csv").then(function(data){
	var provinces = [];
    var startDate = data[0].date;	
	var currentDate = data[0].date;
    for (var i=0; i<data.length;i++){
   	    var item = data[i];
		item.numconf = + item.numconf;
		item.numdeaths = + item.numdeaths;
		item.numtested = + item.numtested;
		if (item.date == currentDate){
			if (item.prname != "Canada"){
			    provinces.push(item);
			}
		} else {
			if (provinces.length==13){
				formattedData.push(provinces);
			}
			provinces = [];
	        currentDate =  data[i].date; 
		}
	};    
	
    console.log(formattedData);

    // First run of the visualization
    update(formattedData[0]);

})

$("#play-button")
    .on("click", function () {
        var button = $(this);
        if (button.text() == "Play") {
            button.text("Pause");
            interval = setInterval(step, 100);
        } else {
            button.text("Play");
            clearInterval(interval);
        }
    })



$("#reset-button")
    .on("click", function() {
        time = 0;
        update(formattedData[0]);
    })

function step() {
    time = (time < formattedData.length) ? time + 1 : 0
    update(formattedData[time]);            
}

function update(data) {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(250);

    // JOIN new data with old elements.
    var circles = g.selectAll("circle").data(data, function(d){
        return d.prname;
    });

    // EXIT old elements not present in new data.
    //circles.exit()
    //    .attr("class", "exit")
    //    .remove();

    // ENTER new elements present in new data.
    circles.enter()
        .append("circle")
        .attr("class", "enter")
        .attr("fill", function(d) { return continentColor(d.prname); })
        .merge(circles)
        .transition(t)
            .attr("cy", function(d){ return y(d.numdeaths + 1); })
            .attr("cx", function(d){ return x( d.numconf + 100); })
            .attr("r", function(d){ return Math.sqrt(area(d.numtested) / Math.PI); });

    // Update the time label
    timeLabel.text(data[0].date);
}



