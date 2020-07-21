var provincesList = ["British Columbia", "Alberta", "Saskatchewan", "Manitoba", "Ontario", "Quebec", "Newfoundland and Labrador", "New Brunswick", "Nova Scotia", "Prince Edward Island", "Yukon", "Northwest Territories", "Nunavut", "Repatriated travellers"];


$(document).ready(function () {
    $(".page1").hide();
    $(".page2").hide();
    $(".page3").hide();

    $(".page1").load("page1.html", function () {
        $.getScript("js/page1.js");
        return true;
    });
    $(".page2").load("page2.html", function () {
        $.getScript("js/page2.js");
        return true;
    });
    $(".page3").load("page3.html", function () {
        $.getScript("js/page3.js");
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
            $(".page2").hide();
            $(".page3").hide();
            $(".page1").show();
        }
        if (num == 2) {
            $(".page2").show();
            $(".page3").hide();
            $(".page1").hide();
        }
        if (num == 3) {
            $(".page1").hide();
            $(".page2").hide();
            $(".page3").show();
        }


        // ... after content load -> change total to 3
        $(this).bootpag({ total: 3, maxVisible: 3 });
    });


});

