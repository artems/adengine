var util = require("util")
  , async = require("async")
  , Dummy = require("../dummy")
  , Parent = require("./overall");

function Unit() {
    Parent.call(this);
    this.limit = 0;
}

util.inherits(Unit, Parent);

Unit.Create = function(object_name, object_id, event, limit_day, limit_all) {
    var unit = new Unit();

    unit.event       = event || 1;
    unit.object_id   = object_id;
    unit.object_name = object_name;
    unit.limit_day   = limit_day;
    unit.limit_all   = limit_all;
    unit.redis       = Parent.getRedisClient();

    return unit;
};

Unit.prototype.incr = function(callback) {
    var self = this;

    async.waterfall([
        function(callback) {
            var group = async.group(callback);

            self.redis.incr(self.getAllKeyName(), group.add('all'));
            self.redis.incr(self.getDayKeyName(), group.add('day'));

            group.finish();
        },

        function(counts, callback) {
            self.delta++;

            var all_overhead = counts["all"] > self.limit_all
              , day_overhead = counts["day"] > self.limit_day
            ;

            if (all_overhead || day_overhead) {
                callback(null, false)
            } else {
                callback(null, true)
            }
        },

        function(result, callback) {
            if (!result) {
                var group = async.group(callback);

                self.redis.decr(self.getAllKeyName(), group.add('all'));
                self.redis.decr(self.getDayKeyName(), group.add('day'));
                
                group.finish();

                self.delta--;
            } else {
                callback(null, true);
            }
        },

        function(count, callback) {
            if (count !== true) {
                callback(Error("1"))
            } else {
                callback();
            }
        }
    ], function(err) {
        if (err) {
            if (err.message == "1") {
                // сработало ограничение
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

Unit.prototype.getDayKeyName = function() {
    return "counter.period." + Dummy.today() + "." + this.object_name + "." + this.object_id + "." + this.event;
};

module.exports = Unit;