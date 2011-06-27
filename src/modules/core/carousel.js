var util = require("util")
  , async = require("async")
  , Dummy = require("./dummy")
;

function Unit() {
    Dummy.call(this);

    this.counters      = {};
    this.user_counters = {};
}

util.inherits(Unit, Dummy);

Unit.prototype.canRotate = function(callback) {
    if (this.deleted) {
        callback(null, false);
        return;
    }

    callback(null, true);
};

Unit.prototype.addCounter = function(counter) {
    this.counters[counter.getEvent()] = counter;
};

Unit.prototype.getCounter = function(event) {
    return this.counters[event];
};

Unit.prototype.addUserCounter = function(counter) {
    this.user_counters[counter.getEvent()] = counter;
};

Unit.prototype.getUserCounter = function(event) {
    return this.user_counters[event];
};

Unit.prototype.rotate = function(callback) {
    var group = async.group(function(err, group) {
        var result, group_array = [];

        for (var i in group) {
            if (group.hasOwnProperty(i)) {
                group_array.push(group[i]);
            }
        }

        result = group_array.every(function(item) { return item; });

        callback(err, result);
    });

    this.canRotate(group.add());

    if (this.getCounter(1)) {
        this.getCounter(1).incr(group.add());
    }

    if (this.getUserCounter(1)) {
        this.getUserCounter(1).incr(group.add());
    }

    group.finish();
};

Unit.prototype.rollback = function(callback) {
    var group = async.group(callback);

    if (this.getCounter(1)) {
        this.getCounter(1).decr(group.add());
    }

    if (this.getUserCounter(1)) {
        this.getUserCounter(1).decr(group.add());
    }

    group.finish();
};

module.exports = Unit;
