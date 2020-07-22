/*
*    Page3.js
*    Project 2 - ZM11 (Zhouning Ma)
*/

Page3 = function (_parentElement, _options) {
    this._parentElement = _parentElement;
    this._options = _options;

    this.initVis();
}


Page3.prototype.initVis = function (_parentElement, _options) {
    $("#datepicker").datepicker();
    new CanadaMap();
    this.update();
}

Page3.prototype.update = function() {
    var sliderValues = $("#date-slider").slider("values");  
}

