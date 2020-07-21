/*
*    Page3.js
*    Project 2 - ZM11 (Zhouning Ma)
*/


CanadaMap = function () {
    console.log("start CanadaMap");
    this.initVis();
}


CanadaMap.prototype.initVis = function () {
    var vis = this;

    var margin = { left: 10, right: 20, top: 10, bottom: 10 };
    var height = 600 - margin.top - margin.bottom,
        width = 1000 - margin.left - margin.right;

    var svg = d3.select(".page3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var numberofcase = d3.map();



    //legend
    var x = d3.scaleLinear()
        .domain([1, 10])
        .rangeRound([height, width]);

    var color = d3.scaleThreshold()
        .domain(d3.range(2, 10))
        .range(d3.schemeBlues[9]);

    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(50,40)");

    g.selectAll("rect")
        .data(color.range().map(function (d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function (d) { return x(d[0]); })
        .attr("width", function (d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function (d) { return color(d[0]); });

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Number of Case");

    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function (x, i) { return i ? x : x + "%"; })
        .tickValues(color.domain()))
        .select(".domain")
        .remove();

    //End of legend



    var promises = [
        d3.json("data/can.json"),
        d3.tsv("data/map.tsv", function (d) { numberofcase.set(d.id, +d.rate); })
    ]

    Promise.all(promises).then(function (data) {
        vis.ready(svg, color, data[0]);
    }).catch(function (error) {
        console.log(error);
    });

}

CanadaMap.prototype.ready = function (svg, color, canada) {
    console.log(canada);
    var path = d3.geoPath();
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(canada, canada.objects.nation).features)
        .enter().append("path")
        .attr("fill", function (d) { return color(d.rate = 3); })
        .attr("d", path)
        .append("title")
        .text(function (d) { return 2.0 + "%"; });

    svg.append("path")
        .datum(topojson.mesh(canada, canada.objects.prov, function (a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", path);
}