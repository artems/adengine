var util = require("util")
  , Parent = require("./overall");

function Unit() {
    Parent.call(this);
    this.limit = 0;
}

util.inherits(Unit, Parent);

Unit.Create = function(object_name, object_id, event, limit) {
    var unit = new Unit();

    unit.event       = event || 1;
    unit.object_id   = object_id;
    unit.object_name = object_name;
    unit.limit       = limit;
    unit.redis       = Parent.getRedisClient();

    return unit;
};

Unit.prototype.incr = function(callback) {
    var self = this;

    this.redis.incr(this.getKeyName(), function(err, count) {
        if (!err) {
            self.delta++;
            
            if (count > self.limit) {
                self.decr(function(err) {
                    callback(err, false);
                });
            } else {
                callback(null, true)
            }
        } else {
            callback(err);
        }
    });
};

module.exports = Unit;