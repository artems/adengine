function Unit() {
    this.id = 0;
    this.url = "";
    this.preg = null;
    this.buyout = [];
    
    this.pages = [];
    this.plugs = [];
}

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
    
    if (!params.preg || params.preg.constructor != RegExp) {
        return false;
    }
    
    if (!params.buyout || params.buyout.constructor != Array || params.buyout.length == 0) {
        return false;
    }

    return true;
};

Unit.prototype.addPage = function(page) {
    this.pages.push(page);
};

Unit.prototype.removePage = function(page) {
    var result = [];
    
    for (var i=0, len=this.pages.length; i<len; i++) {
        if (this.pages[i].id != page.id) {
            result.push(this.pages[i])
        }
    }
    
    this.pages = result;
};

Unit.prototype.addPlug = function(banner) {
    var format_id = banner.getProfile().getFlight().getFormat().id;
    
    if (!this.plugs[format_id]) {
        this.plugs[format_id] = [];
    }
    
    this.plugs[format_id].push(plug);
};

Unit.prototype.getRandomPlug = function(format_id) {
    var plugs = this.plugs[format_id];
    
    if (!plugs || plugs.length == 0) {
        return false;
    } else {
        var length = plugs.length;
        var index  = Math.random() * length;
        
        return plugs[index];
    }        
};

module.exports = Unit;

