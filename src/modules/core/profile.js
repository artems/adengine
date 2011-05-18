var util = require("util")
  , Dummy = require("./dummy");

function Unit() {
    Dummy.call(this);

    this.id      = 0;
    this.flight  = null;
    this.banners = [];
    this.target  = {};

    this.counters = {};
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.flight = params.flight || null;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }

    return true;
};

Unit.prototype.setFlight = function(flight) {
    this.flight = flight;
};

Unit.prototype.getFlight = function() {
    return this.flight;
};

Unit.prototype.addBanner = function(banner) {
    this.banners.push(banner);
};

Unit.prototype.getBanners = function() {
    var result = [], len = this.banners.length;

    for (var i=0; i<len; i++) {
        if (!this.banners[i].deleted) {
            result.push(this.banners[i]);
        }
    }

    return result;
};

Unit.prototype.setTarget = function(ruleset) {
    this.target[ruleset.getTargetId()] = ruleset;
};

Unit.prototype.getTarget = function(target_id) {
    return this.target[target_id];
};

Unit.prototype.addCounter = function(counter) {
    this.counters[counter.getEvent()] = counter;
};

Unit.prototype.getCounter = function(event) {
    return this.counters[event];
};


Unit.prototype.canRotate = function(session_vars, callback) {
    Dummy.prototype.canRotate.call(this, function(err, result) {
        if (err || !result) {
            callback(err, result);
            return;
        }

        for (var i in this.target) {
            if (this.target.hasOwnProperty(i)) {
                if (!this.target[i].pass(session_vars)) {
                    callback(null, false);
                    return;
                }
            }
        }

        callback(null, true);
    }.bind(this));
};

module.exports = Unit;
