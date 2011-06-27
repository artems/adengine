var util = require("util")
  , async = require("async")
  , Parent = require("./overall");

function Unit() {
    Parent.call(this);

    this.limit_day = 0;
    this.limit_all = 0;
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
    unit.limit_day   = params.limit_day;
    unit.limit_all   = params.limit_all;
    unit.redis       = redis;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (!Parent._isValidParams(params)) {
        return false;
    }

    if (params.limit_day && (isNaN(parseInt(params.limit_day)) || parseInt(params.limit_day) < 0)) {
        return false;
    }

    if (params.limit_all && (isNaN(parseInt(params.limit_day)) || parseInt(params.limit_day) < 0)) {
        return false;
    }

    if (!params.limit_day && !params.limit_all) {
        return false;
    }

    return true;
};

Unit.prototype.incr = function(callback) {
    var self = this, result;

    async.waterfall([
        function(callback) {
            var group = async.group(callback);

            self.redis.incr(self.getAllKey(), group.add('all'));
            self.redis.incr(self.getDayKey(), group.add('day'));

            group.finish();
        },

        function(counts, callback) {
            self.delta++;

            var all_overhead = self.limit_all > 0 && counts["all"] > self.limit_all
              , day_overhead = self.limit_day > 0 && counts["day"] > self.limit_day
            ;

            result = (all_overhead || day_overhead) ? false : true;

            callback();
        }
    ], function(err) {
        callback(err, result);
    });
};

module.exports = Unit;