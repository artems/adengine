function Unit() {
    this.deleted = false;
}

Unit.now = function() {
    return new Date();
};

Unit.prototype.removeSync = function() {
    this.deleted = true;
};

module.exports = Unit;
