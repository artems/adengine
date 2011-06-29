var async = require("async")
  , util2 = require("../util")
;

function Unit() {
    this.delta = 0;
    this.event = 0;
    this.object_id   = null;
    this.object_name = null;

    this.redis = null;
}

Unit.Create = function(params, redis, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.event       = params.event || 1;
    unit.object_id   = params.object_id;
    unit.object_name = params.object_name;
    unit.redis       = redis;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.object_id)) || parseInt(params.object_id) <= 0) {
        return false;
    }

    if (!params.object_name || params.object_name.constructor != String) {
        return false;
    }
    
    if (params.event && (isNaN(parseInt(params.event)) || parseInt(params.event) < 0)) {
        return false;
    }

    return true;
};

Unit.prototype.incr = function(callback) {
    var self = this
      , group = async.group(function(err, counts) {
        if (err) {
            callback(err);
        } else {
            self.delta++;
            callback(null, true);
        }
    });

    this.redis.incr(this.getAllKey(), group.add('all'));
    this.redis.incr(this.getDayKey(), group.add('day'));

    // 604800 = (60s * 60m * 24h * 2d) = 7 days
    this.redis.expire(this.getAllKey(), 604800, group.add('all_expire'));
    // 172800 = (60s * 60m * 24h * 2d) = 2 days
    this.redis.expire(this.getDayKey(), 172800, group.add('day_expire'));

    group.finish();
};

Unit.prototype.decr = function(callback) {
    var self = this
      , group = async.group(function(err, counts) {
        if (err) {
            callback(err);
        } else {
            self.delta--;
            callback(null, true);
        }
    });

    this.redis.decr(this.getAllKey(), group.add('all'));
    this.redis.decr(this.getDayKey(), group.add('day'));

    group.finish();
};

Unit.prototype.getEvent = function() {
    return this.event;
};

Unit.prototype.getObjectId = function() {
    return this.object_id;
};

Unit.prototype.getObjectName = function() {
    return this.object_name;
};

Unit.prototype.getCountAndReset = function() {
    var delta = this.delta;

    this.delta = 0;

    return delta;
};

Unit.prototype.getAllKey = function() {
    return [
        "counter"
      , "all"
      , this.object_name
      , this.object_id
      , this.event
    ].join(".");
};

Unit.prototype.getDayKey = function() {
    return [
        "counter"
      , "day"
      , util2.today()
      , this.object_name
      , this.object_id
      , this.event
    ].join(".");
};

module.exports = Unit;