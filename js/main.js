
var _parameters = {
    currentPage: 1,
    startDate: common_parseTime("11-03-2020"),
    endDate: common_parseTime("17-07-2020"),
    minDate: common_parseTime("11-03-2020"),
    maxDate: common_parseTime("17-07-2020"),
    type: "numconf"
};
var page1;
var page2;
var page3;


$(document).ready(function () {
    $(".page1").hide();
    $(".page2").hide();
    $(".page3").hide();

    $(".page1").load("page1.html", function () {
        page1 = new Page1(this, _parameters);
        return true;
    });
    $(".page2").load("page2.html", function () {
        page2 = new Page2(this, _parameters);
        return true;
    });
    $(".page3").load("page3.html", function () {
        page3 = new Page3(this, _parameters);
        return true;
    });

    $(".page2").hide();
    $(".page3").hide();
    $(".page1").show();

    $('#pagination-here').bootpag({
        total: 3,           // total pages
        page: 1,            // default page
        maxVisible: 3,      // visible pagination
        leaps: true         // next/prev leaps through maxVisible
    }).on("page", function (event, num) {
        $("#content").html("Page " + num); // or some ajax content loading...

        if (num == 1) {
            page1.trigger(_parameters);
            $(".page2").hide();
            $(".page3").hide();
            $(".page1").show();
            page1.trigger(_parameters);
        }
        if (num == 2) {
            page2.trigger(_parameters);
            $(".page2").show();
            $(".page3").hide();
            $(".page1").hide();
            page2.trigger(_parameters);
        }
        if (num == 3) {
            page3.trigger(_parameters);
            $(".page1").hide();
            $(".page2").hide();
            $(".page3").show();
            page3.trigger(_parameters);
        }

        $(this).bootpag({ total: 3, maxVisible: 3 });
    });


});

