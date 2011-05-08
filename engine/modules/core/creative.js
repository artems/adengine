var util = require("util")
  , Dummy = require("./dummy");
  
function Unit() {
    Dummy.call(this);
    
    this.id       = 0;
    this.uid      = null;
    this.flight   = null;
    this.template = null;
    this.params   = {};
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.uid = params.uid;    
    unit.flight = params.flight || null;
    unit.template = params.template || null;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }
    if (!params.uid || params.uid.constructor != String || params.uid.length != 6) {
        return false;
    }

    return true;
};

Unit.prototype.getUid = function() {
    return this.uid;
};

Unit.prototype.setParam = function(name, value) {
    this.params[name] = value;
};

Unit.prototype.getParam = function(name) {
    return this.params[name];
};

Unit.prototype.setFlight = function(flight) {
    this.flight = flight;
}

Unit.prototype.getFlight = function() {
    return this.flight;
}

Unit.prototype.setTemplate = function(template) {
    this.template = template;
}

Unit.prototype.getTemplate = function() {
    return this.template;
};

Unit.prototype.getCode = function() {
    return this.getTemplate().getCode();
};

Unit.prototype.verify = function(callback) {
    if (this.deleted) {
        callback(null, false);
        return;
    }

    var template = this.getTemplate()
      , params   = template.getParams()
      , result   = true;

    for (var i in params) {
        if (params.hasOwnProperty(i)) {
            if (params[i]['require']) {
                if (this.params[i] === null
                        || this.params[i] === false
                        || this.params[i] === undefined) {
                    result = false;
                    break;
                }
            }
        }
    }

    callback(null, result);
};

Unit.prototype.replaceParams = function(code) {
    var template = this.getTemplate()
      , params   = template.getParams()
    ;

    for (var i in params) {
        if (params.hasOwnProperty(i)) {
            var value =
                (typeof this.params[i] != "undefined") ? this.params[i] : params[i]['default'];
            code = code.replace('%' + i + '%', value);
        }
    }

    return code;
};

module.exports = Unit;
