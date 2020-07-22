/*
*    Page3.js
*    Project 2 - ZM11 (Zhouning Ma)
*/

Page3 = function (_parentElement, _parameters) {
    this._parentElement = _parentElement;

    this.initVis(_parentElement, _parameters);
}


Page3.prototype.initVis = function (_parentElement, _parameters) {
    $("#datepicker").datepicker({
        dateFormat: "dd-mm-yy",
        minDate: _parameters.minDate,
        maxDate: _parameters.maxDate
    });

    new CanadaMap();

    $("#datepicker").on('change', function () {
        _parameters.endDate = endDate = common_parseTime($("#datepicker").val());
        if (_parameters.endDate < _parameters.startDate) {
            _parameters.startDate = _parameters.minDate;
        }
        page3Update(_parentElement, _parameters)
    });

    $("#type-select").on('change', function () {
        _parameters.type = $("#type-select").val();
        page3Update(_parentElement, _parameters)
    });
    page3Update(_parentElement, _parameters);
}


Page3.prototype.trigger = function (_parameters) {
    _parameters.currentPage = 3;

    $("#type-select").val(_parameters.type);
    $("#datepicker").datepicker("setDate", _parameters.endDate);

    stackedArea.wrangleData();
}


function page3Update(_parentElement, _parameters) {


}

