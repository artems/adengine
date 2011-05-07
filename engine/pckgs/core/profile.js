var util = require("util")
  , Dummy = require("./dummy");

function Unit() {
    Dummy.call(this);

    this.id = 0;
    this.flight = null;
    
    this.banners = [];
    this.targeting = {};    
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

Unit.prototype.removeBanner = function(banner) {
    var result= [];
    
    for (var i=0, len=this.banners.length; i<len; i++) {
        if (this.banners[i].id != banner.id) {
            result.push(this.banners[i])
        }
    }
    
    this.banners = result;
};

Unit.prototype.setTarget = function(ruleset) {
    this.targeting[ruleset.getTargetId()] = ruleset;
};

Unit.prototype.getTarget = function(target_id) {
    return this.targeting[target_id];
}

Unit.prototype.verify = function(callback) {
    if (this.deleted) {
        callback(null, false);
        return;
    }
    
    var session_vars = {};
    
    for (var i in this.targeting) {
        if (this.targeting.hasOwnProperty(i)) {
            if (!this.targeting[i].pass(session_vars)) {
                callback(null, false);
                return;
            }
        }
    }
    
    callback(null, true);
    return;
};

module.exports = Unit;
