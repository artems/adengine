function Unit() {
    this.id = 0;
    this.group = "";
    this.format = null;
}

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.format = prarams.format || null;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }
    
    if (!params.group || params.group.constructor != String || params.group.length == 0) {
        return false;
    }

    return true;
};

Unit.prototype.setFormat = function(format) {
    this.format = format;
};

Unit.prototype.getFormat = function() {
    return this.format;
};

module.exports = Unit;
