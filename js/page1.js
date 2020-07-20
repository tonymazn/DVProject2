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


var provincesList = ["British Columbia","Alberta","Saskatchewan","Manitoba","Ontario","Quebec","Newfoundland and Labrador","New Brunswick","Nova Scotia","Prince Edward Island","Yukon","Northwest Territories","Nunavut","Repatriated travellers"];

// Scales
var x = d3.scaleLog()
    .base(10)
    .range([0, width])
    .domain([100, 110000]);
var y = d3.scaleLog()
    .base(100)
    .range([height, 0])
    .domain([1, 9000]);
var area = d3.scaleLinear()
    .range([25*Math.PI, 1500*Math.PI])
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
    .tickValues([100, 1000, 10000, 100000])
    .tickFormat(d3.format("$"));
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")
    .call(xAxisCall);

//var yAxisCall = d3.axisLeft(y)
//    .tickFormat(function(d){ return +d; });


var yAxisCall = d3.axisLeft(y)
    .tickValues([10, 100, 1000, 10000])
    .tickFormat(d3.format("$"));
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);

d3.csv("data/canadacovid19.csv").then(function(data){
    var formattedData = [];
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

    // Run the code every 0.1 second
    d3.interval(function(){
        // At the end of our data, loop back
        time = (time < formattedData.length) ? time+1 : 0
        update(formattedData[time]);            
    }, 100);

    // First run of the visualization
    update(formattedData[0]);

})

function update(data) {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(100);

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
            .attr("cx", function(d){ return x(d.numconf + 123); })
            .attr("r", function(d){ return Math.sqrt(area(d.numtested) / Math.PI); });

    // Update the time label
    timeLabel.text(data[0].date);
}



