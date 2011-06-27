var util = require("util")
  , async = require("async")
  , util2 = require("../util")
  , Parent = require("./user_overall")
;

function Unit() {
    Parent.call(this);

    this.period_limit    = 0;
    this.period_interval = 0;
}

util.inherits(Unit, Parent);

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
    
    unit.limit_all       = params.limit_all;
    unit.min_interval    = params.min_interval;
    unit.period_limit    = params.period_limit;
    unit.period_interval = params.period_interval;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (!Parent._isValidParams(params)) {
        return false;
    }

    if (isNaN(parseInt(params.period_limit)) || parseInt(params.limit_day) < 0) {
        return false;
    }

    if (isNaN(parseInt(params.period_interval)) || parseInt(params.period_interval) < 0) {
        return false;
    }

    return true;
};

Unit.prototype.incr = function(user_id, callback) {
    var self = this, result;

    async.waterfall([
        function(callback) {
            self.getLastAction(user_id, callback);
        },

        function(last_action, callback) {
            if (self.checkMinInterval(last_action)) {
                self.processPeriodInterval(last_action, user_id, callback);
            } else {
                callback(Error("USR-001")); // break async chain
            }
        },

        function(callback) {
            var group = async.group(callback);

            self.redis.incr(self.getAllKey(user_id), group.add("all"));
            self.redis.incr(self.getPeriodKey(user_id), group.add("period"));

            group.finish();
        },

        function(counts, callback) {
            var overall_overhead = (self.limit > 0 && counts["all"] > self.limit)
              , period_overhead  = (self.period_limit > 0 && counts["period"] > self.period_limit)
            ;
            
            result = (overall_overhead || period_overhead) ? false : true;

            callback();
        }
    ], function(err) {
        if (err && (err.message == "USR-001")) { // сработал мин. интревал
            callback(null, false);
        } else {
            callback(err, result);
        }
    });
};

Unit.prototype.decr = function(user_id, callback) {
    var self = this
      , group = async.group(function(err, counts) {
        if (err) {
            callback(err);
        } else {
            self.delta--;
            callback(null, true);
        }
    });

    this.redis.decr(this.getAllKey(user_id), group.add('all'));
    this.redis.decr(this.getPeriodKey(user_id), group.add('day'));

    group.finish();
};

Unit.prototype.processPeriodInterval = function(last_action, user_id, callback) {
    if (this.getBeginOfPeriod(last_action) != this.getBeginOfPeriod(util2.now())) {
        this.redis.set(this.getPeriodKey(user_id), 0, function(err, count) {
            callback(err)
        });
    } else {
        callback();
    }
};

Unit.prototype.getBeginOfPeriod = function(timestamp) {
    return Math.floor(Math.floor(timestamp / 1000) / this.period_interval) * this.period_interval;
};

Unit.prototype.getPeriodKey = function(user_id) {
    return [
        "counter"
      , "period"
      , user_id
      , this.object_name
      , this.object_id
      , this.event
    ].join(".");
};

module.exports = Unit;