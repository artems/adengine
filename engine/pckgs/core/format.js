function Unit() {
    this.id = 0;
    this.flights = [];
}

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }

    return true;
};

Unit.prototype.addFlight = function(flight) {
    this.flights.push(flight);
};

Unit.prototype.getFlights = function() {
    var result = [], len = this.flights.length;

    for (var i=0; i<len; i++) {
        if (!this.flights[i].deleted) {
            result.push(this.flights[i]);
        }
    }

    this.flights = result;

    return result;
};

module.exports = Unit;
