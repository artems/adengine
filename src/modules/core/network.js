var util = require("util")
  , Dummy = require("./dummy");
  
function Unit() {
    Dummy.call(this);
    
    this.id      = 0;
    this.group   = "";
    this.format  = null;
    this.flights = [];
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.group = params.group;
    unit.format = params.format || null;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }
    
    if (params.group == null || params.group == undefined || params.group.constructor != String) {
        return false;
    }

    return true;
};

Unit.prototype.getGroup = function() {
    return this.group;
};

Unit.prototype.setFormat = function(format) {
    this.format = format;
};

Unit.prototype.getFormat = function() {
    return this.format;
};

Unit.prototype.addFlight = function(flight) {
    this.flights.push(flight);
};

Unit.prototype.getFlights = function() {
    var result = [];

    for (var i=0, len = this.flights.length; i<len; i++) {
        if (!this.flights[i].deleted) {
            result.push(this.flights[i]);
        }
    }

    return result;
};

module.exports = Unit;
