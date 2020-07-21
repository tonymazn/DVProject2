var provincesList = ["British Columbia", "Alberta", "Saskatchewan", "Manitoba", "Ontario", "Quebec", "Newfoundland and Labrador", "New Brunswick", "Nova Scotia", "Prince Edward Island", "Yukon", "Northwest Territories", "Nunavut", "Repatriated travellers"];


$(document).ready(function () {
    $('.page1').show();
    $('.page2').hide();
    $('.page3').hide();
    $.getScript("js/page1.js");
});

$('#pagination-here').bootpag({
    total: 3,          // total pages
    page: 1,            // default page
    maxVisible: 3,     // visible pagination
    leaps: true         // next/prev leaps through maxVisible
}).on("page", function (event, num) {
    $("#content").html("Page " + num); // or some ajax content loading...

    if (num == 1) {
        $("#chart-area").html("");
        $(".page1").show();
        $(".page2").hide();
        $(".page3").hide();
        $.getScript("js/page1.js");
    }
    if (num == 2) {
        $(".page1").hide();
        $(".page2").show();
        $(".page3").hide();
        $("#chart-area").html("");
        $.getScript("js/page2.js");
    }
    if (num == 3) {
        $(".page1").hide();
        $(".page2").hide();
        $(".page3").show();
        $("#chart-area").html("");
        $.getScript("js/page3.js");
    }


    // ... after content load -> change total to 3
    $(this).bootpag({ total: 3, maxVisible: 3 });
});

