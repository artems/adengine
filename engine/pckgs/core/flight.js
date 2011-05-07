var util = require("util")
  , Dummy = require("./dummy");
  
function Unit() {
    Dummy.call(this);
    
    this.id = 0;
    
    this.priority = 0;
    this.balance = 0.0;
    this.distribution = "max";
    this.network = null;
    this.begin = null;
    this.end   = null;

    this.profiles = [];
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id         = parseInt(params.id);    
    unit.prioprity  = parseInt(params.priority);
    unit.balance    = parseFloat(params.balance) || 0.0;
    unit.distribution = params.distribution;
    unit.network = params.network || null;
    unit.begin = params.begin;
    unit.end   = params.end;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }

    if (isNaN(parseInt(params.priority)) || parseInt(params.priority) < 0 || parseInt(params.priority) > 99) {
        return false;
    }
    
    if (isNaN(parseFloat(params.balance)) || parseFloat(params.balance) < 0) {
        return false;
    }
    
    if (params.distribution != "max" && params.distribution != "flat") {
        return false;
    }
   
    if (params.begin && params.end) {
        var begin = new Date(params.begin)
          , end   = new Date(params.end)
          , now   = Dummy.now();
        if (now < begin || now > end) {
            return false;
        }
    }
    
    return true;
};

Unit.prototype.setNetwork = function(network) {
    this.network = network;
};

Unit.prototype.getNetwork = function() {
    return this.network;
};

Unit.prototype.setBegin = function(begin) {
    this.begin = begin;
};

Unit.prototype.setEnd = function(end) {
    this.end = end;
};

Unit.prototype.getProfiles = function() {
    var result = [], len = this.profiles.length;

    for (var i=0; i<len; i++) {
        if (!this.profiles[i].deleted) {
            result.push(this.profiles[i]);
        }
    }

    this.profiles = result;

    return result;
};

Unit.prototype.addProfile = function(profile) {
    this.profiles.push(profile);
};

Unit.prototype.removeProfile = function(profile) {
    var result= [];
    
    for (var i=0, len=this.profiles.length; i<len; i++) {
        if (this.profiles[i].id != profile.id) {
            result.push(this.profiles[i])
        }
    }
    
    this.profiles = result;
};

Unit.prototype.verify = function(callback) {
    if (this.deleted) {
        callback(null, false);
        return;
    } 

    var now = Dummy.now();
    
    if (this.begin > now) {
        callback(null, false);
        return;
    }
    if (this.end < now) {
        callback(null, false);
        return;
    }
    
    callback(null, true);
};

module.exports = Unit;
