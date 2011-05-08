var util = require("util")
  , Dummy = require("./dummy");

function Unit() {
    Dummy.call(this);

    this.id      = 0;
    this.flight  = null;
    this.banners = [];
    this.target  = {};    
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

    this.banners = result;

    return result;
};

Unit.prototype.setTarget = function(ruleset) {
    this.target[ruleset.getTargetId()] = ruleset;
};

Unit.prototype.getTarget = function(target_id) {
    return this.target[target_id];
}

Unit.prototype.verify = function(callback) {
    if (this.deleted) {
        callback(null, false);
        return;
    }
    
    var session_vars = {};
    
    for (var i in this.target) {
        if (this.target.hasOwnProperty(i)) {
            if (!this.target[i].pass(session_vars)) {
                callback(null, false);
                return;
            }
        }
    }
    
    callback(null, true);
};

module.exports = Unit;
