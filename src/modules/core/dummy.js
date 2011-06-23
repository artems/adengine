function Unit() {
    this.deleted = false;
}

Unit.now = function() {
    return new Date();
};

Unit.nowSec = function() {
    return Math.floor(new Date() / 1000);
};

Unit.interval = function(interval) {
    return interval;
};

Unit.prototype.getId = function() {
    return this.id;
};

Unit.prototype.canRotate = function(callback) {
    if (this.deleted) {
        callback(null, false);
        return;
    }

    callback(null, true);
};

Unit.prototype.removeSync = function() {
    this.deleted = true;
};

module.exports = Unit;
