var util = require("util")
  , Dummy = require("./carousel");

function Unit() {
    Dummy.call(this);

    this.id        = 0;
    this.page      = null;
    this.format    = null;
    this.networks  = [];
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.page = params.page || null;
    unit.format = params.format || null;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }
    
    return true;
};

Unit.prototype.addNetwork = function(network) {
    this.networks.push(network);
};

Unit.prototype.getNetworks = function() {
    return this.networks;
};

Unit.prototype.setFormat = function(format) {
    this.format = format;
};

Unit.prototype.getFormat = function() {
    return this.format;
};

Unit.prototype.setPage = function(page) {
    this.page = page;
};

Unit.prototype.getPage = function() {
    return this.page;
};

module.exports = Unit;



