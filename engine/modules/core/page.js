function Unit() {
    this.id       = 0;
    this.preg     = null;
    this.site     = null;
    this.category = [];    
    this.places   = {};
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
    var place_format_id = place.getFormat().id;
    if (!this.places[place_format_id]) {
        this.places[place_format_id] = [];
    }
    
    this.places[place_format_id].push(place);
};

Unit.prototype.getPlaceByFormatId = function(format_id) {
    var places_on_page = this.getPlacesByFormatId(format_id);

    return places_on_page[0];
}

Unit.prototype.getPlacesByFormatId = function(format_id) {
    return this.places[format_id] || [];
};

module.exports = Unit;



