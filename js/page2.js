var page2_allCalls;
var page2_calls;
var page2_nestedCalls;
var page2_timeline;

Page2 = function (_parentElement, _parameters) {
    this._parentElement = _parentElement;

    this.initVis(_parentElement, _parameters);
}


Page2.prototype.initVis = function (_parentElement, _parameters) {
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

        numconfBar = new BarChart("#numconf", "numconf", "numconf")
        numdeathsBar = new BarChart("#numdeaths", "numdeaths", "numdeaths")
        testedBar = new BarChart("#numtested", "numtested", "numtested")
        stackedArea = new StackedAreaChart("#stacked-area")
        page2_timeline = new Timeline("#timeline")

        // Type change
        $("#var-select").on("change", function () {
            _parameters.type = $("#var-select").val();
            changeDates([_parameters.startDate, _parameters.endDate])
        })
    })
}

Page2.prototype.trigger = function (_parameters) {
    _parameters.currentPage = 2;
    console.log(_parameters);
    $("#var-select").val(_parameters.type);

    var start = common_formatTime(_parameters.startDate);
    var end = common_formatTime(_parameters.endDate);
    $("#dateLabel1").text(start);
    $("#dateLabel2").text(end);
    stackedArea.wrangleData();
    changeDates([_parameters.startDate, _parameters.endDate]);
}

function setTimelineXRange(range) {
    page2_timeline.x.range()
}

function brushed() {
    console.log("d3.event.selection");
    console.log(d3.event.selection);
    var selection = d3.event.selection || page2_timeline.x.range();
    var newValues = selection.map(page2_timeline.x.invert)
    changeDates(newValues)
}

// Date range change
function changeDates(values) {
    page2_calls = page2_allCalls.filter(function (d) {
        return ((d.date >= values[0]) && (d.date <= values[1]))
    })

    page2_nestedCalls = d3.nest()
        .key(function (d) {
            return d.prname;
        })
        .entries(page2_calls)

    var type = $("#var-select").val();
    var totalrow = page2_calls[page2_calls.length - 1];

    console.log("totalrow");
    console.log(totalrow);
    if (totalrow) {
        var total = 0
        if (type == "numconf") {
            total = totalrow.numconf;
        } else if (type == "numdeaths") {
            total = totalrow.numdeaths;
        } else {
            total = totalrow.numtested;
        }
        $("#page2totalnumber").text(common_formatnumber(total));
    }

    $("#dateLabel1").text(common_formatTime(values[0]))
    $("#dateLabel2").text(common_formatTime(values[1]))

    _parameters.startDate = values[0];
    _parameters.endDate = values[1];

    numdeathsBar.wrangleData();
    testedBar.wrangleData();
    numconfBar.wrangleData();
    stackedArea.wrangleData();
}