var util = require("util")
  , Dummy = require("./dummy");
  
function Unit() {
    Dummy.call(this);
    
    this.id     = 0;
    this.url    = "";
    this.preg   = null;
    this.buyout = [];    
    this.pages  = [];
    this.plugs  = [];
    
    this.default_page = null;
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.url = params.url;
    unit.preg = params.preg;
    unit.buyout = params.buyout || [];

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }

    if (!params.url || params.url.constructor != String) {
        return false;
    }
    
    if (!params.preg || params.preg.constructor != RegExp) {
        return false;
    }
    
    if (!params.buyout || params.buyout.constructor != Array || params.buyout.length == 0) {
        return false;
    }

    return true;
};

Unit.prototype.getUrl = function() {
    return this.url;
};

Unit.prototype.getPreg = function() {
    return this.preg;
};

Unit.prototype.getBuyout = function() {
    return this.buyout;
};

Unit.prototype.setDefaultPage = function(page) {
    this.default_page = page;
};

Unit.prototype.getDefaultPage = function() {
    return this.default_page;
};

Unit.prototype.addPage = function(page) {
    this.pages.push(page);
};

Unit.prototype.getPages = function(page) {
    var result = [];

    for (var i=0, len = this.pages.length; i<len; i++) {
        if (!this.pages[i].deleted) {
            result.push(this.pages[i]);
        }
    }

    return result;
};

Unit.prototype.addPlug = function(banner) {
    var format_id = -1;
    try {
        format_id = banner.getProfile().getFlight().getNetwork().getFormat().getId();

        if (!this.plugs[format_id]) {
            this.plugs[format_id] = [];
        }

        this.plugs[format_id].push(banner);
    } catch (e) {}
};

Unit.prototype.getRandomPlug = function(format_id) {
    var plugs = this.plugs[format_id];

    if (!plugs || plugs.length == 0) {
        return false;
    } else {
        var length = plugs.length
          , index  = Math.floor(Math.random() * length);

        return plugs[index];
    }        
};

module.exports = Unit;

