var util = require("util")
  , async = require("async")
  , util2 = require("../util")
  , Parent = require("./overall");

function Unit() {
    Parent.call(this);

    this.limit_all    = 0;
    this.min_interval = 0;
}

util.inherits(Unit, Parent);

Unit.Create = function(params, redis, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.event        = params.event || 1;
    unit.object_id    = params.object_id;
    unit.object_name  = params.object_name;
    unit.limit_all    = params.limit_all;
    unit.min_interval = params.min_interval;
    unit.redis        = redis;

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (!Parent._isValidParams(params)) {
        console.log(1);
        return false;
    }

    if (params.limit_all && (isNaN(parseInt(params.limit_all)) || parseInt(params.limit_all) < 0)) {
        return false;
    }

    if (params.min_interval && (isNaN(parseInt(params.min_interval)) || parseInt(params.min_interval) < 0)) {
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
                callback();
            } else {
                callback(Error("USR-001")); // break async chain
            }
        },

        function(callback) {
            self.redis.incr(self.getAllKey(user_id), callback);
        },

        function(count, callback) {
            result = self.checkLimit(count);
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
    var self = this;

    this.redis.decr(this.getAllKey(user_id), function(err, count) {
        if (err) {
            callback(err);
        } else {
            self.delta--;
            callback(null, true);
        }
    });
};

Unit.prototype.getLastAction = function(user_id, callback) {
    this.redis.get(this.getLastActionKey(user_id), callback);
};

Unit.prototype.setLastAction = function(user_id, callback) {
    this.redis.set(this.getLastActionKey(user_id), +util2.now(), callback);
};

Unit.prototype.checkMinInterval = function(last_action) {
    last_action = last_action || 0;

    return this.min_interval == 0 || (util2.now() - last_action) > (this.min_interval * 1000);
};

Unit.prototype.checkLimit = function(count) {
    return this.limit_all == 0 || this.limit_all >= count;
};

Unit.prototype.getAllKey = function(user_id) {
    return [
        "counter"
      , "user"
      , user_id
      , this.object_name
      , this.object_id
      , this.event
    ].join(".");
};

Unit.prototype.getLastActionKey = function(user_id) {
    return [
        "counter"
      , "action"
      , user_id
      , this.object_name
      , this.object_id
      , this.event
    ].join(".");
};

module.exports = Unit;