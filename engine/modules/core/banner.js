var util = require("util")
  , Dummy = require("./dummy");

function Unit() {
    Dummy.call(this);

    this.id           = 0;
    this.priority     = 0;
    this.distribution = "max";
    this.url          = null;
    this.profile      = null;
    this.creative     = null;
    this.begin        = null;
    this.end          = null;
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.prioprity = parseInt(params.priority);
    unit.distribution = params.distribution;
    unit.url = params.url;   
    unit.profile = params.profile || null;
    unit.creative = params.creative || null;
    
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
    if (isNaN(parseInt(params.priority)) || parseInt(params.priority) < 0 || parseInt(params.priority) > 99) {
        return false;
    }
    if (params.distribution != "max" && params.distribution != "flat") {
        return false;
    }
    if (!params.url || params.url.constructor != String || params.url.length == 0) {
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

Unit.prototype.verify = function(callback) {
    if (this.deleted) {
        callback(null, false);
        return;
    }

    if (!this.creative) {
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

    // TODO verify url

    this.creative.verify(callback);
};

Unit.prototype.getPriority = function() {
    return this.priority;
};

Unit.prototype.distribution = function() {
    return this.distribution;
};

Unit.prototype.getUrl = function() {
    return this.url;
};

Unit.prototype.setBegin = function(begin) {
    this.begin = begin;
}

Unit.prototype.setEnd = function(end) {
    this.end = end;
}

Unit.prototype.getUrl = function() {
    return this.url;
};

Unit.prototype.setProfile = function(profile) {
    this.profile = profile;
};

Unit.prototype.getProfile = function() {
    return this.profile;
};

Unit.prototype.setCreative = function(creative) {
    this.creative = creative;
};


Unit.prototype.getCreative = function() {
    return this.creative;
};

Unit.prototype.getCode = function(place) {
    var profile  = this.getProfile()
      , creative = this.getCreative()
      , flight   = profile.getFlight()
      , code     = creative.getCode();

    code = code
        .replace(/b\.kavanga\.ru/g, 'localhost:8080')  // TODO remove
        .replace(/%host%/g, 'localhost:8080')          // TODO remove
        .replace(/%net%/g, flight.network_id)
        .replace(/%flight%/g, flight.id)
        .replace(/%banner%/g, this.id)
        .replace(/%place%/g, place.id)
        .replace(/%banner_url%/g, this.getUrl());

    code = creative.replaceParams(code);

    return code;
};

module.exports = Unit;
