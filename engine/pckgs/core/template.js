function Unit() {
    this.id     = 0;
    this.size   = 0;
    this.body   = null;
    this.format = null;

    this.params = {};
}

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id   = parseInt(params.id);
    unit.size = parseInt(params.size);
    unit.body = params.body;

    unit.format = params.format || null;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }

    if (isNaN(parseInt(params.size)) || parseInt(params.size) <= 0) {
        return false;
    }

    if (!params.body || params.body.constructor != String || params.body.length == 0) {
        return false;
    }

    return true;
};

Unit.prototype.getCode = function() {
    return this.body;
};

Unit.prototype.setFormat = function(format) {
    this.format = format;
}

Unit.prototype.getFormat = function() {
    return this.format;
}

Unit.prototype.setParam = function(key, type, name, default_, require) {
    this.params[key] = {
        'type'    : type
      , 'name'    : name
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