var page1_formattedData = [];
var page1_time = 0;
var page1_continentColor;
var page1_area;
var page1_g;
var page1_interval;
var page1_x;
var page1_y;
var page1_timeLabel;
var div;

Page1 = function (_parentElement, _parameters) {
    this._parentElement = _parentElement;

    this.initVis(this._parentElement, _parameters);
}


Page1.prototype.initVis = function (_parentElement, _parameters) {
    var vis = this;

    margin = { left: 80, right: 20, top: 50, bottom: 100 };
    height = 500 - margin.top - margin.bottom,
        width = 800 - margin.left - margin.right;

    page1_g = d3.select(_parentElement).select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // Scales
    page1_x = d3.scaleLog()
        .base(100)
        .range([0, width])
        .domain([100, 110000]);
    page1_y = d3.scaleLog()
        .base(100)
        .range([height, 0])
        .domain([1, 9000]);
    page1_area = d3.scaleLinear()
        .range([25 * Math.PI, 2000 * Math.PI])
        .domain([0, 3500000]);


    //d3.schemeBlues[9]
    //d3.schemeSet1
    //page1_continentColor = d3.scaleOrdinal(d3.schemePaired);

    page1_continentColor = d3.scaleOrdinal()
        .domain(common_provincesList)
        .range(["#a6cee3",  //"British Columbia"
            "#1f78b4",  //"Alberta"
            "#b2df8a",  //"Saskatchewan"
            "#33a02c",  //"Manitoba"
            "#fb9a99",  // "Ontario"
            "#e31a1c", // "Quebec"
            "#fdbf6f", // "Newfoundland and Labrador"
            "#3386FF", // "New Brunswick"
            "#cab2d6", // "Nova Scotia"
            "#6a3d9a", // "Prince Edward Island"
            "#0331fc", // "Yukon"
            "#b15928", // "Northwest Territories"
            "#a6cee3", // "Nunavut"
            "#1f78b4"  // "Repatriated travellers"
        ]);


    //page1_continentColor = d3.scaleOrdinal(d3.schemePastel1);

    // Labels
    page1_g.append("text")
        .attr("y", height + 50)
        .attr("x", width / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Number of confirmed case");
    page1_g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -170)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Number of deaths")
    page1_timeLabel = page1_g.append("text")
        .attr("y", height - 10)
        .attr("x", width - 100)
        .attr("font-size", "40px")
        .attr("opacity", "0.4")
        .attr("text-anchor", "middle")
        .text("3-11-2020");

    // X Axis
    var xAxisCall = d3.axisBottom(page1_x)
        .tickValues([1, 100, 1000, 10000, 100000])
        .tickFormat(d3.format(","));
    page1_g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisCall);

    //var yAxisCall = d3.axisLeft(y)
    //    .tickFormat(function(d){ return +d; });


    var yAxisCall = d3.axisLeft(page1_y)
        .tickValues([1, 10, 100, 1000, 10000])
        .tickFormat(d3.format(","));

    page1_g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    div = d3.select(_parentElement).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //legend
    var legend = page1_g.append("g")
        .attr("transform", "translate(" + (width - 10) + "," + (height - 260) + ")");

    common_provincesList.forEach(function (continent, i) {
        var legendRow = legend.append("g")
            .attr("transform", "translate(0, " + (i * 12 + 30) + ")");

        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", page1_continentColor(continent));

        legendRow.append("text")
            .attr("x", -10)
            .attr("y", 10)
            .attr("text-anchor", "end")
            .style("text-transform", "capitalize")
            .style("font-size", 9)
            .text(continent);
    });


    d3.csv("data/canadacovid19.csv").then(function (data) {
        var provinces = [];
        var currentDate = data[0].date;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            item.numconf = + item.numconf;
            item.numdeaths = + item.numdeaths;
            item.numtested = + item.numtested;
            if (item.date == currentDate) {
                if (item.prname != "Canada") {
                    provinces.push(item);
                }
            } else {
                if (provinces.length == 13) {
                    page1_formattedData.push(provinces);
                }
                provinces = [];
                currentDate = data[i].date;
            }
        };

        // First run of the visualization
        update(page1_formattedData[0]);

    }).catch(function () {
        console.log("error loading file canadacovid19.csv, please press F5 and try again");
    });

    $(_parentElement)
        .on("click", "#play-button", function () {
            var button = $(this);
            if (button.text() == "Play") {
                button.text("Pause");
                page1_interval = setInterval(vis.step, 100);
            } else {
                button.text("Play");
                clearInterval(page1_interval);
            }
        });



    $(_parentElement)
        .on("click", "#reset-button", function () {
            page1_time = 0;
            update(page1_formattedData[0]);
        });
}

Page1.prototype.trigger = function (_parameters) {
    _parameters.currentPage = 1;

}


Page1.prototype.step = function () {
    page1_time = (page1_time < page1_formattedData.length) ? page1_time + 1 : 0;
    update(page1_formattedData[page1_time]);
}

function update(data) {
    var t = d3.transition()
        .duration(250);

    var circles = page1_g.selectAll("circle").data(data, function (d) {
        return d.prname;
    });

    try {
        circles.exit()
            //.attr("class", "exit")
            .remove();

        circles.enter()
            .append("circle")
            //.attr("class", "enter")
            .attr("fill", function (d) { return page1_continentColor(d.prname); })
            .merge(circles)
            .transition(t)
            .attr("cy", function (d) { return page1_y(d.numdeaths + 1); })
            .attr("cx", function (d) { return page1_x(d.numconf + 100); })
            .attr("r", function (d) { return Math.sqrt(page1_area(d.numtested) / Math.PI); });

        circles
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.prname + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Update the time label
        page1_timeLabel.text(data[0].date);
    } catch{
    }
}


//Show the tooltip on the hovered over slice
function showTooltip(d) {

    //Define and show the tooltip
    $(this).popover({
        placement: 'auto top',
        container: '#chart',
        trigger: 'manual',
        html: true,
        content: function () {
            return "<span style='font-size: 11px; text-align: center;'>" + d.Country + "</span>";
        }
    });
    $(this).popover('show');

    //Make chosen circle more visible
    d3.select(this).style("opacity", 1);

}//function showTooltip



//Hide the tooltip when the mouse moves away
function removeTooltip() {

    //Fade out the circle to normal opacity
    d3.select(this).style("opacity", opacityCircles);

    //Hide tooltip
    $('.popover').each(function () {
        $(this).remove();
    });

}//function removeTooltip



