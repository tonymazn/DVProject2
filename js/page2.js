/*
*    Page2.js
*    Project 2 - ZM11 (Zhouning Ma)
*/

var page2_allCalls;
var page2_calls;
var page2_nestedCalls;

Page2 = function (_parentElement, _options) {
    this._parentElement = _parentElement;
    this._options = _options;

    this.initVis();
}


Page2.prototype.initVis = function (_parentElement, _options) {
    d3.csv("data/canadacovid19.csv").then(function (data) {
        newdata = [];
        data.map(function (d) {
            var item = [];
            item.numconf = +d.numconf
            item.numdeaths = +d.numdeaths
            item.numtested = +d.numtested
            item.prname = d.prname
            item.date = common_parseTime(d.date)
            item.team = d.prname
            newdata.push(item);
            return d
        })

        page2_allCalls = newdata;

        page2_calls = newdata;

        console.log(newdata);

        page2_nestedCalls = d3.nest()
            .key(function (d) {
                return d.category;
            })
            .entries(page2_calls)

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
    changeDates(newValues)
}

function changeDates(values) {
    page2_calls = page2_allCalls.filter(function (d) {
        return ((d.date > values[0]) && (d.date < values[1]))
    })

    page2_nestedCalls = d3.nest()
        .key(function (d) {
            return d.prname;
        })
        .entries(page2_calls)

    $("#dateLabel1").text(common_formatTime(values[0]))
    $("#dateLabel2").text(common_formatTime(values[1]))

    //donut.wrangleData();
    numdeathsBar.wrangleData();
    testedBar.wrangleData();
    numconfBar.wrangleData();
    stackedArea.wrangleData();
}