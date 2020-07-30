var canadamap_color;
var canadamap_svg;
var canadamap_mapdata;
var page3_titles;

CanadaMap = function () {
    console.log("start CanadaMap");
    this.initVis();
}


CanadaMap.prototype.initVis = function () {
    var vis = this;

    var margin = { left: 10, right: 20, top: 10, bottom: 10 };
    var height = 700 - margin.top - margin.bottom,
        width = 1000 - margin.left - margin.right;

    canadamap_svg = d3.select(".page3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var x = d3.scaleLinear()
        .domain([1, 10])
        .rangeRound([height, width]);

    //legend
    canadamap_color = d3.scaleThreshold()
        .domain(d3.range(1, 10))
        .range(d3.schemeBlues[9]);

    var g = canadamap_svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(-200,20)");

    g.selectAll("rect")
        .data(canadamap_color.range().map(function (d) {
            d = canadamap_color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function (d) { return x(d[0]); })
        .attr("width", function (d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function (d) { return canadamap_color(d[0]); });

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
        .tickFormat(function (x, i) {
            if (i == 0) {
                return "-1K";
            } else if (i == 1) {
                return "-100";
            } else if (i == 2) {
                return "-10";
            } else if (i == 3) {
                return "0";
            } else if (i == 4) {
                return "1K";
            } else if (i == 5) {
                return "10K";
            } else if (i == 6) {
                return "1M";
            } else {
                return "10M";
            }
        })
        .tickValues(canadamap_color.domain()))
        .select(".domain")
        .remove();
    //End of legend

    d3.json("data/canadamap.json").then(function (data) {
        canadamap_mapdata = data;
//        console.log("canadamap_mapdata");
//        console.log(canadamap_mapdata);
        vis.updateVis(null);
    });

}

function getColorLevel(item) {
    if (item <= 0) {
        return 3;
    } else if (item < 1000) {
        return 4;
    } else if (item < 10000) {
        return 5;
    } else if (item < 1000000) {
        return 6;
    } else {
        return 7;
    }
}

CanadaMap.prototype.updateVis = function (data) {
    console.log("data");
    console.log(data);
    if (!data || !canadamap_mapdata || !canadamap_mapdata.objects) {
        return;
    }

    var path = d3.geoPath();
    canadamap_svg.append("g")
        .attr("class", "counties")
        .attr("transform", "translate(-150,50)")
        .selectAll("path")
        .data(topojson.feature(canadamap_mapdata, canadamap_mapdata.objects.prov).features)
        .enter().append("path")
        .attr("fill", function (d, i) {return canadamap_color(getColorLevel(data[i]));})
        .attr("d", path)
        .append("title")
        .text(function (d, i) { return data[i] });

 //   console.log("canadamap_mapdata");
 //   console.log(canadamap_mapdata);

    canadamap_svg.append("path")
        .datum(topojson.mesh(canadamap_mapdata, canadamap_mapdata.objects.prov, function (a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("transform", "translate(-150,50)")
        .attr("d", path);
    var continents = topojson.feature(canadamap_mapdata, canadamap_mapdata.objects.prov).features;
    var centroids = [
        [260, 460], //British Columbia
        [690, 460], //Quebec
        [480, 290], //Nunavut
        [810, 520], //Prince Edward Island
        [410, 480], //Saskatchewan
        [230, 290], //Yukon
        [490, 450], //Manitoba 
        [580, 520], //Ontario
        [790, 550], //New Brunswick
        [370, 350], //Northwest Territories
        [340, 440], //Alberta
        [800, 420], //Newfoundland and Labrador
        [820, 580]]; //Newfoundland and Labrador


    $(".numbertitleclass").remove();
    canadamap_svg.selectAll(".name").data(centroids)
        .enter().append("text")
        .attr("transform", "translate(-150,50)")
        .attr("class", "numbertitleclass")
        .attr("x", function (d) { return d[0]; })
        .attr("y", function (d) { return d[1]; })
        .style("fill", "#C8C8C8")  //white color font
        .attr("text-anchor", "middle")
        .text(function (d, i) { return continents[i].properties.province; });


    $(".numberclass").remove();
    canadamap_svg.selectAll(".name").data(centroids)
        .enter().append("text")
        .attr("class", "numberclass")
        .attr("transform", "translate(-150,50)")
        .attr("x", function (d) { return d[0]; })
        .attr("y", function (d) { return d[1] + 15; })
        .style("fill", "#333")
        .attr("font-weight", "bold")
        .attr("font-family", "Open Sans")
        .attr("text-anchor", "middle")
        .text(function (d, i) { return common_formatnumber(data[i]); });


}



