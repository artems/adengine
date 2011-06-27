var util = require("util")
  , util2 = require("./util")
  , Dummy = require("./carousel");
  
function Unit() {
    Dummy.call(this);
    
    this.id           = 0;    
    this.priority     = 0;
    this.balance      = 0.0;
    this.distribution = "max";
    this.is_plug      = false;
    this.buyout       = {};
    this.network      = null;
    this.begin        = null;
    this.end          = null;
    this.profiles     = [];
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);    
    unit.priority = parseInt(params.priority);
    unit.balance = parseFloat(params.balance);
    unit.distribution = params.distribution;
    unit.is_plug = params.is_plug;
    unit.buyout = params.buyout || null;
    unit.network = params.network || null;
    
    if (params.begin && params.end) {
        unit.begin = new Date(params.begin);
        unit.end = new Date(params.end)
    }

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }

    // skip checks for plugs
    if (params.is_plug) {
        return true;
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

    if (params.begin && !params.end) {
        return false;
    }

    if (!params.begin && params.end) {
        return false;
    }
   
    if (params.begin && params.end) {
        var begin = new Date(params.begin)
          , end   = new Date(params.end)
          , now   = util2.now();
        if (now < begin || now > end) {
            return false;
        }
    }
    
    return true;
};

Unit.prototype.getPriority = function() {
    return this.priority;
};

Unit.prototype.setPriority = function(priority) {
    this.priority = priority;
};

Unit.prototype.getBalance = function() {
    return this.balance;
};

Unit.prototype.setBalance = function(balance) {
    this.balance = balance;
};

Unit.prototype.getDistribution = function() {
    return this.distribution;
};

Unit.prototype.setDistribution = function(distribution) {
    this.distribution = distribution;
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

Unit.prototype.getBegin = function() {
    return this.begin;
};

Unit.prototype.setEnd = function(end) {
    this.end = end;
};

Unit.prototype.isPlug = function() {
    return this.is_plug;
};

Unit.prototype.getEnd = function() {
    return this.end;
};

Unit.prototype.setBuyout = function(buyout, dir) {
    this.buyout[dir] = buyout;
};

Unit.prototype.getBuyout = function(dir) {
    return this.buyout[dir];
};

Unit.prototype.addProfile = function(profile) {
    this.profiles.push(profile);
};

Unit.prototype.getProfiles = function() {
    var result = [], len = this.profiles.length;

    for (var i=0; i<len; i++) {
        if (!this.profiles[i].deleted) {
            result.push(this.profiles[i]);
        }
    }

    return result;
};

Unit.prototype.canRotate = function(callback) {
    Dummy.prototype.canRotate.call(this, function(err, result) {
        if (err || !result) {
            callback(err, result);
            return;
        }

        if (this.balance < 0) {
            callback(null, false);
            return;
        }

        var now = util2.now();

        if (this.end && this.end < now) {
            callback(null, false);
            return;
        }

        callback(null, true);
    }.bind(this));
};

module.exports = Unit;
