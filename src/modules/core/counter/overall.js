var redis;

function Unit() {
    this.delta = 0;
    this.event = 0;
    this.object_id = null;
    this.object_name = null;

    this.redis = null;
}

Unit.setRedisClient = function(_redis_) {
    redis = _redis_;
};
Unit.getRedisClient = function(_redis_) {
    return redis;
};


Unit.Create = function(object_name, object_id, event) {
    var unit = new Unit();

    unit.event       = event || 1;
    unit.object_id   = object_id;
    unit.object_name = object_name;
    unit.redis       = redis;

    return unit;
};

Unit.prototype.incr = function(callback) {
    var self = this;
        
    this.redis.incr(this.getAllKeyName(), function(err, count) {
        if (!err) {
            self.delta++;
            callback(null, count);
        } else {
            callback(err);
        }
    });
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

Unit.prototype.getAllKeyName = function() {
    return "counter.overall." + this.object_name + "." + this.object_id + "." + this.event;
};

module.exports = Unit;