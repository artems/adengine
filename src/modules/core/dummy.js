function Unit() {
    this.id = 0;
    this.deleted = false;
}

Unit.prototype.getId = function() {
    return this.id;
};

Unit.prototype.removeSync = function() {
    this.deleted = true;
};

module.exports = Unit;
