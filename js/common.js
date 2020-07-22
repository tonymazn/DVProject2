/*
*    Common.js
*    Project 2 - ZM11 (Zhouning Ma)
*/


Common = function () {
    this.provincesList = ["British Columbia", "Alberta", "Saskatchewan", "Manitoba", "Ontario", "Quebec", "Newfoundland and Labrador", "New Brunswick", "Nova Scotia", "Prince Edward Island", "Yukon", "Northwest Territories", "Nunavut", "Repatriated travellers"];
    this.parseTime = d3.timeParse("%d-%m-%Y");
    this.formatTime = d3.timeFormat("%d-%m-%Y");

    //this.initVis();
}

//Common.protototype.initVis = function () {

//}

//Common.prototype.provincesList = function () {
//    return ["British Columbia", "Alberta", "Saskatchewan", "Manitoba", "Ontario", "Quebec", "Newfoundland and Labrador", "New Brunswick", "Nova Scotia", "Prince Edward Island", "Yukon", "Northwest Territories", "Nunavut", "Repatriated travellers"];
//}

//Common.prototype.parseTime = function () {
//    d3.timeParse("%d-%m-%Y");
//}

//Common.prototype.formatTime = function () {
//    d3.timeFormat("%d-%m-%Y");
//}

