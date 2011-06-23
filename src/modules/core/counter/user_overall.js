var util = require("util")
  , async = require("async")
  , Dummy = require("../dummy")
  , Parent = require("./overall");

function Unit() {
    Parent.call(this);

    this.limit = 0;
    this.min_interval = 0;
}

util.inherits(Unit, Parent);

Unit.Create = function(object_name, object_id, event, limit, min_interval) {
    var unit = new Unit();

    unit.event        = event || 1;
    unit.object_id    = object_id;
    unit.object_name  = object_name;
    unit.limit        = limit;
    unit.min_interval = min_interval;
    unit.redis        = Parent.getRedisClient();

    return unit;
};

Unit.prototype.incr = function(user_id, callback) {
    var self = this;

    async.waterfall([
        function(callback) {
            self.redis.get(self.getLastActionKeyName(user_id), callback);
        },

        function(lastaction, callback) {
            if (self.min_interval != 0 && (Dummy.nowSec() - lastaction) > self.min_interval) {
                callback(Error("1"));
            } else {
                callback();
            }
        },

        function(callback) {
            self.redis.incr(self.getOverallKeyName(user_id), callback);
        },

        function(count, callback) {
            if (self.limit > 0 && count > self.limit) {
                callback(null, false);
            } else {
                callback(null, false);
            }
        },

        function(result, callback) {
            if (!result) {
                self.redis.decr(self.getOverallKeyName(user_id), callback);
            } else {
                callback(null, true);
            }
        },

        function(count, callback) {
            if (count !== true) {
                callback(Error("2"))
            } else {
                callback();
            }
        },

        function(callback) {
            self.redis.set(self.getLastActionKeyName(user_id), Dummy.nowSec(), callback);
        }
    ], function(err) {
        if (err) {
            if (err.message == "1" || err.message == "2") {
                // сработали мин. интревал, либо ограничение
                callback(null, false);
            } else {
                // другая ошибка
                callback(err);
            }
        } else {
            // удачно увеличили счетчики
            callback(null, true);
        }
    });
};


Unit.prototype.getOverallKeyName = function(user_id) {
    return "counter.user." + this.object_name + "." + this.object_id + "." + user_id + "." + this.event;
};

Unit.prototype.getLastActionKeyName = function(user_id) {
    return "counter.lastaction." + this.object_name + "." + this.object_id + "." + user_id + "." + this.event;
};

module.exports = Unit;