var util = require("util")
  , Dummy = require("./dummy");
  
function Unit() {
    Dummy.call(this);
    
    this.id      = 0;
    this.size    = 0;
    this.body    = null;
    this.format  = null;
    this.is_plug = false;
    this.params  = {};
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id      = parseInt(params.id);
    unit.size    = parseInt(params.size);
    unit.body    = params.body;
    unit.is_plug = params.is_plug || false;
    unit.format  = params.format  || null;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }

    if (isNaN(parseInt(params.size)) || parseInt(params.size) <= 0) {
        return false;
    }

    if (params.body == null && params.body == undefined || params.body.constructor != String) {
        return false;
    }

    if (params.is_plug == null || params.is_plug == undefined) {
        return false;
    }

    return true;
};

Unit.prototype.getCode = function() {
    return this.body;
};

Unit.prototype.getSize = function() {
    return this.size;
};

Unit.prototype.isPlug = function() {
    return this.is_plug;
};

Unit.prototype.setFormat = function(format) {
    this.format = format;
}

Unit.prototype.getFormat = function() {
    return this.format;
}

Unit.prototype.setParam = function(key, type, default_, require) {
    this.params[key] = {
        'type'    : type
      , 'default' : default_
      , 'require' : require
    };
};

Unit.prototype.getParam = function(name) {
    return this.params[name];
};

Unit.prototype.getParams = function() {
    return this.params;
};

module.exports = Unit;