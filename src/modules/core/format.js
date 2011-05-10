var util = require("util")
  , Dummy = require("./dummy");
  
function Unit() {
    Dummy.call(this);
    
    this.id       = 0;
    this.plug     = null;
    this.networks = [];
    this.flights  = [];
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.plug = params.plug || null;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }

    return true;
};

Unit.prototype.setPlug = function(plug) {
    this.plug = plug;
};

Unit.prototype.getPlug = function() {
    return this.plug;
};

Unit.prototype.addNetwork = function(network) {
    this.networks.push(network);
};

Unit.prototype.getNetworks = function() {
    var result = [];

    for (var i=0, len = this.networks.length; i<len; i++) {
        if (!this.networks[i].deleted) {
            result.push(this.networks[i]);
        }
    }

    return result;
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
