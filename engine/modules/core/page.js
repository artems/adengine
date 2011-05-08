function Unit() {
    this.id       = 0;
    this.preg     = null;
    this.site     = null;
    this.category = [];    
    this.places   = [];
}

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);    
    unit.preg = params.preg;
    unit.site = params.site || null;
    unit.category = params.category || [];

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }
    
    if (!params.preg || params.preg.constructor != Array) {
        return false;
    }
    
    if (!params.category || params.category.constructor != Array) {
        return false;
    }

    return true;
};

Unit.prototype.getPreg = function() {
    return this.preg;
};

Unit.prototype.getSite = function() {
    return this.site;
};

Unit.prototype.setSite = function(site) {
    this.site = site;
};

Unit.prototype.getCategory = function(page) {
    return this.category;
};

Unit.prototype.addPlace = function(place) {
    this.places.push(place);
};

Unit.prototype.getPlaces = function() {
    return this.places;
};

module.exports = Unit;



