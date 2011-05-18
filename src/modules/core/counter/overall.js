var redis;

function Unit() {
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

Unit.prototype.decr = function(callback) {
    this.redis.decr(this.getKeyName(), callback);
};

Unit.prototype.incr = function(callback) {
    this.redis.incr(this.getKeyName(), callback);
};

Unit.prototype.getEvent = function(callback) {
    return this.event;
};

Unit.prototype.getKeyName = function() {
    return "counter." + this.object_name + "." + this.object_id + "." + this.event;
};

module.exports = Unit;