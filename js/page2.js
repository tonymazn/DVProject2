/*
*    Page2.js
*    Project 2 - ZM11 (Zhouning Ma)
*/

var allCalls;
var calls;
var nestedCalls;

Page2 = function (_parentElement, _options) {
    this._parentElement = _parentElement;
    this._options = _options;
    this.common = new Common();
    this.initVis();
}


Page2.prototype.initVis = function (_parentElement, _options) {
    d3.csv("data/canadacovid19.csv").then(function (data) {
        var common = new Common();
        newdata = [];
        data.map(function (d) {
            var item = [];
            item.numconf = +d.numconf
            item.numdeaths = +d.numdeaths
            item.numtested = +d.numtested
            item.prname = d.prname
            item.date = common.parseTime(d.date)
            item.team = d.prname
            newdata.push(item);
            return d
        })

        allCalls = newdata;

        calls = newdata;

        console.log(newdata);

        nestedCalls = d3.nest()
            .key(function (d) {
                return d.category;
            })
            .entries(calls)

        //donut = new DonutChart("#confirmed-case")

        numconfBar = new BarChart("#numconf", "numconf", "numconf")
        numdeathsBar = new BarChart("#numdeaths", "numdeaths", "numdeaths")
        testedBar = new BarChart("#numtested", "numtested", "numtested")

        stackedArea = new StackedAreaChart("#stacked-area")

        timeline = new Timeline("#timeline")

        $("#var-select").on("change", function () {
            stackedArea.wrangleData();
        })
    })
}


function brushed() {
    var selection = d3.event.selection || timeline.x.range();
    var newValues = selection.map(timeline.x.invert)
    this.changeDates(newValues)
}

Page2.prototype.changeDates = function(values) {
    calls = allCalls.filter(function (d) {
        return ((d.date > values[0]) && (d.date < values[1]))
    })

    nestedCalls = d3.nest()
        .key(function (d) {
            return d.prname;
        })
        .entries(calls)

    $("#dateLabel1").text(this.common.formatTime(values[0]))
    $("#dateLabel2").text(this.common.formatTime(values[1]))

    //donut.wrangleData();
    numdeathsBar.wrangleData();
    testedBar.wrangleData();
    numconfBar.wrangleData();
    stackedArea.wrangleData();
}