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

    this.counters      = {};
    this.user_counters = {};
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
    
    // url = "" if it is site plug
    if (params.url == null || params.url == undefined || params.url.constructor != String) {
        return false;
    }

    // TODO verify url by regexp

    if (params.begin && !params.end) {
        return false;
    }

    if (!params.begin && params.end) {
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

Unit.prototype.canRotate = function(callback) {
    Dummy.prototype.canRotate.call(this, function(err, result) {
        if (err || !result) {
            callback(err, result);
            return;
        }
        
        if (!this.creative) {
            callback(null, false);
            return;
        }

        var now = Dummy.now();

        if (this.end && this.end < now) {
            callback(null, false);
            return;
        }

        this.creative.verify(callback);
    }.bind(this));
};

Unit.prototype.getPriority = function() {
    return this.priority;
};

Unit.prototype.getDistribution = function() {
    return this.distribution;
};

Unit.prototype.getUrl = function() {
    return this.url;
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

Unit.prototype.getEnd = function() {
    return this.end;
};

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

Unit.prototype.addCounter = function(counter) {
    this.counters[counter.getEvent()] = counter;
};

Unit.prototype.getCounter = function(event) {
    return this.counters[event];
};

Unit.prototype.addUserCounter = function(counter) {
    this.user_counters[counter.getEvent()] = counter;
};

Unit.prototype.getUserCounter = function(event) {
    return this.user_counters[event];
};

Unit.prototype.getCode = function(place) {
    var profile  = this.getProfile()
      , creative = this.getCreative()
      , flight   = profile.getFlight()
      , code     = creative.getCode();

    code = creative.replaceParams(code);

    /*
    code = code
        //.replace(/b\.kavanga\.ru/g, 'localhost:8080')  // TODO remove
        //.replace(/localhost:8080\/cstore/g, 'b.kavanga.ru/cstore')  // TODO remove
        .replace(/%host%/g, 'localhost:8080')
        .replace(/%net%/g, flight.network_id)
        .replace(/%flight%/g, flight.id)
        .replace(/%banner%/g, this.id)
        .replace(/%place%/g, place.id)
        .replace(/%banner_url%/g, this.getUrl());
    */
    
    code = code
        .replace(/#host#/g, 'localhost:8080')
        .replace(/#place_id#/g, place.id)
        .replace(/#flight_id#/g, flight.id)
        .replace(/#banner_id#/g, this.id)
        .replace(/#banner_url#/g, this.getUrl());

    return code;
};

module.exports = Unit;
