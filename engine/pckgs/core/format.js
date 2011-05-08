var util = require("util")
  , Dummy = require("./dummy");
  
function Unit() {
    Dummy.call(this);
    
    this.id       = 0;
    this.plug     = null;
    this.networks = null;    
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.plug = params.plug || null;

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

Unit.prototype.getNetwork = function() {
    return this.network;
};

Unit.prototype.setPlug = function(plug) {
    this.plug = plug;
};

Unit.prototype.getPlug = function() {
    return this.plug;
};

module.exports = Unit;
