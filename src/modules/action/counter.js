var fs    = require("fs")
  , path  = require("path")
  , async = require("async")
  , Dummy = require("core/dummy");

function Unit(app) {
    this.app = app;
    this.intid = null;

    this._counter = {};
}

Unit.prototype.execute = function(callback) {
    // this.start();

    callback();
};

Unit.prototype.start = function() {
    var interval = this.app.config.counters.interval;
    
    this.intid = setInterval(this.saveCurrCounters.bind(this), Dummy.interval(interval));
};

Unit.prototype.stop = function() {
    clearInterval(this.intid);
};

Unit.prototype.addCounter = function(counter) {
    var object = counter.getObjectName();

    if (!this._counter[object]) {
        this._counter[object] = [];
    }
    this._counter[object].push(counter);
};

Unit.prototype.saveCurrCounters = function(callback) {
    async.parallel([
        this._saveFlightCounters.bind(this)
      , this._saveProfileCounters.bind(this)
      , this._saveBannerCounters.bind(this)
    ], function(err) {
        if (callback) {
            callback(err);
        }
    });
};

Unit.prototype._saveFlightCounters = function(callback) {
    this._saveObjectCounters("flight", callback);
};

Unit.prototype._saveProfileCounters = function(callback) {
    this._saveObjectCounters("profile", callback);
};

Unit.prototype._saveBannerCounters = function(callback) {
    this._saveObjectCounters("banner", callback);
};

Unit.prototype._saveObjectCounters = function(object, callback) {
    if (!this._counter[object]) {
        callback();
        return;
    }

    var self  = this
      , now   = Dummy.now()
      , mongo = this.app.mongo
      ;

    async.waterfall([
        function(callback) {
            mongo.collection("counter", callback);
        },

        function(coll, callback) {
            var group  = async.group(callback);
            
            for (var i in self._counter[object]) {
                var counter = self._counter[object][i]
                  , query1  = {
                        object : object
                      , id     : counter.getObjectId()
                      , event  : counter.getEvent()
                      , period : Dummy.today()
                    }
                  , query2  = {
                        object : object
                      , id     : counter.getObjectId()
                      , event  : counter.getEvent()
                      , period : 0
                    }
                  , update = {$inc: {count: counter.getCountAndReset()}};

                coll.update(query1, update, {upsert: true}, group.add());
                coll.update(query2, update, {upsert: true}, group.add());
            }

            group.finish();
        }
    ], callback);
};

module.exports = Unit;