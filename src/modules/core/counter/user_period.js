var util = require("util")
  , async = require("async")
  , Dummy = require("../dummy")
  , Parent = require("./user_overall")
  , Overall = require("./overall")
;

function Unit() {
    Parent.call(this);

    this.min_interval    = 0;
    this.period_limit    = 0;
    this.period_interval = 0;
}

util.inherits(Unit, Parent);

Unit.Create = function(object_name, object_id, event, limit, min_interval, period_limit, period_interval) {
    var unit = new Unit();

    unit.event       = event || 1;
    unit.object_id   = object_id;
    unit.object_name = object_name;
    unit.redis       = Overall.getRedisClient();
    
    unit.limit           = limit;
    unit.min_interval    = min_interval;
    unit.period_limit    = period_limit;
    unit.period_interval = period_interval;

    return unit;
};

Unit.prototype.incr = function(user_id, callback) {
    var self = this;

    async.waterfall([
        function(callback) {
            self.redis.get(self.getLastActionKeyName(user_id), callback);
        },

        function(lastaction, callback) {
            lastaction = lastaction || 0;

            if (self.min_interval != 0 && (Dummy.nowSec() - lastaction) < self.min_interval) {
                // еще не прошел минимальный интревал - выходим
                callback(Error("1"));
            } else if (self._getBeginOf(lastaction) != self._getBeginOf(Dummy.nowSec())) {
                // новый период счетчика, обнуляем счетчик
                self.redis.set(self.getPeriodKeyName(user_id), 0, callback);
            } else {
                // или просто идем дальше
                callback(null, 'OK');
            }
        },

        function(result, callback) {
            var group = async.group(callback);

            self.redis.incr(self.getPeriodKeyName(user_id), group.add("period"));
            self.redis.incr(self.getOverallKeyName(user_id), group.add("overall"));

            group.finish();
        },

        function(counts, callback) {
            var overall_overhead = (self.limit > 0 && counts["overall"] > self.limit)
              , period_overhead  = (self.period_limit > 0 && counts["period"] > self.period_limit)
            ;
            
            if (overall_overhead || period_overhead) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        },

        function(result, callback) {
            if (!result) {
                // неудача, откатываем все назад
                var group = async.group(callback);

                self.redis.decr(self.getPeriodKeyName(user_id), group.add("period"));
                self.redis.decr(self.getOverallKeyName(user_id), group.add("overall"));

                group.finish();
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


Unit.prototype.getPeriodKeyName = function(user_id) {
    return "counter.userperiod." + this.object_name + "." + this.object_id + "." + user_id + "." + this.event;
};

Unit.prototype._getBeginOf = function(timestamp) {
    return Math.floor(timestamp / this.period_interval) * this.period_interval;
};

module.exports = Unit;