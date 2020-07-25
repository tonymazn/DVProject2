/*
*    stackedAreaChart.js
*    Project 2 - ZM11 (Zhouning Ma)
*/


StackedAreaChart = function (_parentElement) {
    this.parentElement = _parentElement;

    this.initVis();
};

StackedAreaChart.prototype.initVis = function () {
    var vis = this;

    vis.margin = { left: 80, right: 100, top: 50, bottom: 40 };
    vis.height = 370 - vis.margin.top - vis.margin.bottom;
    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left +
            ", " + vis.margin.top + ")");

    vis.t = () => { return d3.transition().duration(1000); }

    vis.color = d3.scaleOrdinal()
        .domain(common_provincesList)
        .range(["#a6cee3",  //"British Columbia"
            "#1f78b4",  //"Alberta"
            "#b2df8a",  //"Saskatchewan"
            "#33a02c",  //"Manitoba"
            "#fb9a99",  // "Ontario"
            "#e31a1c", // "Quebec"
            "#fdbf6f", // "Newfoundland and Labrador"
            "#ff7f00", // "New Brunswick"
            "#cab2d6", // "Nova Scotia"
            "#6a3d9a", // "Prince Edward Island"
            "#0331fc", // "Yukon"
            "#b15928", // "Northwest Territories"
            "#a6cee3", // "Nunavut"
            "#1f78b4"  // "Repatriated travellers"
        ]);
    //d3.scaleOrdinal(d3.schemePastel1);

    vis.x = d3.scaleTime().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.yAxisCall = d3.axisLeft()
    vis.xAxisCall = d3.axisBottom()
        .ticks(4);
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height + ")");
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis");

    vis.stack = d3.stack()
        .keys(common_provincesList);

    vis.area = d3.area()
        .x(function (d) { return vis.x(common_parseTime(d.data.date)); })
        .y0(function (d) { return vis.y(d[0]); })
        .y1(function (d) { return vis.y(d[1]); });

    vis.addLegend();

    vis.wrangleData();
};


StackedAreaChart.prototype.wrangleData = function () {
    var vis = this;

    vis.variable = $("#var-select").val()

    vis.dayNest = d3.nest()
        .key(function (d) { return common_formatTime(d.date); })
        .entries(page2_calls)

    vis.dataFiltered = vis.dayNest
        .map(function (day) {
            return day.values.reduce(function (accumulator, current) {
                accumulator.date = day.key
                accumulator[current.team] = accumulator[current.team] + current[vis.variable]
                return accumulator;
            }, {
                "British Columbia": 0,
                "Alberta": 0,
                "Saskatchewan": 0,
                "Manitoba": 0,
                "Ontario": 0,
                "Quebec": 0,
                "Newfoundland and Labrador": 0,
                "New Brunswick": 0,
                "Nova Scotia": 0,
                "Prince Edward Island": 0,
                "Yukon": 0,
                "Northwest Territories": 0,
                "Nunavut": 0,
                "Repatriated travellers": 0
            })
        })

    vis.updateVis();
};


StackedAreaChart.prototype.updateVis = function () {
    var vis = this;

    vis.maxDateVal = d3.max(vis.dataFiltered, function (d) {
        var vals = d3.keys(d).map(function (key) { return key !== 'date' ? d[key] : 0 });
        return d3.sum(vals);
    });

    // Update scales
    vis.x.domain(d3.extent(vis.dataFiltered, (d) => { return common_parseTime(d.date); }));
    vis.y.domain([0, vis.maxDateVal]);

    // Update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t()).call(vis.yAxisCall);

    vis.teams = vis.g.selectAll(".team")
        .data(vis.stack(vis.dataFiltered));

    // Update the path for each team
    vis.teams.select(".area")
        .attr("d", vis.area)

    vis.teams.enter().append("g")
        .attr("class", function (d) { return "team " + d.key })
        .append("path")
        .attr("class", "area")
        .attr("d", vis.area)
        .style("fill", function (d) {
            return vis.color(d.key)
        })
        .style("fill-opacity", 0.5)
};


StackedAreaChart.prototype.addLegend = function () {
    var vis = this;

    var legend = vis.g.append("g")
        .attr("transform", "translate(" + (vis.width - 10) + "," + (vis.height - 250) + ")");

    //var legendArray = [
    //    { label: "British Columbia", color: vis.color("british columbia") },
    //    { label: "Alberta", color: vis.color("alberta") },
    //    { label: "Saskatchewan", color: vis.color("saskatchewan") },
    //    { label: "Manitoba", color: vis.color("manitoba") },
    //    { label: "Ontario", color: vis.color("ontario") },
    //    { label: "Saskatchewan", color: vis.color("saskatchewan") },
    //    { label: "Quebec", color: vis.color("quebec") },
    //    { label: "Newfoundland and Labrador", color: vis.color("newfoundland and labrador") },
    //    { label: "New Brunswick", color: vis.color("new brunswick") },
    //    { label: "Nova Scotia", color: vis.color("nova scotia") },
    //    { label: "Prince Edward Island", color: vis.color("prince edward island") },
    //    { label: "Yukon", color: vis.color("yukon") },
    //    { label: "Northwest Territories", color: vis.color("northwest territories") },
    //    { label: "Nunavut", color: vis.color("nunavut") },
    //    { label: "Repatriated travellers", color: vis.color("repatriated travellers") }
    //]

    var legendArray = [
        { label: "British Columbia", color: vis.color("British Columbia") },
        { label: "Alberta", color: vis.color("Alberta") },
        { label: "Saskatchewan", color: vis.color("Saskatchewan") },
        { label: "Manitoba", color: vis.color("Manitoba") },
        { label: "Ontario", color: vis.color("Ontario") },
        { label: "Saskatchewan", color: vis.color("Saskatchewan") },
        { label: "Quebec", color: vis.color("Quebec") },
        { label: "Newfoundland and Labrador", color: vis.color("Newfoundland and Labrador") },
        { label: "New Brunswick", color: vis.color("New Brunswick") },
        { label: "Nova Scotia", color: vis.color("Nova Scotia") },
        { label: "Prince Edward Island", color: vis.color("Prince Edward Island") },
        { label: "Yukon", color: vis.color("Yukon") },
        { label: "Northwest Territories", color: vis.color("Northwest Territories") },
        { label: "Nunavut", color: vis.color("Nunavut") },
        { label: "Repatriated travellers", color: vis.color("Repatriated Travellers") }
    ]



    var legendCol = legend.selectAll(".legendCol")
        .data(legendArray)
        .enter().append("g")
        .attr("class", "legendCol")
        .attr("transform", (d, i) => {
            return "translate(20, " + (i * 12 + 30) + ")"
        });

    legendCol.append("rect")
        .attr("class", "legendRect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => { return d.color; })
        .attr("fill-opacity", 0.5);

    legendCol.append("text")
        .attr("class", "legendText")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .style("font-size", 9)
        .text(d => { return d.label; });
}