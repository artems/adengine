var util2 = require("core/util");

function Unit() {
    this.flight  = null;
    this.profile = null;
    this.banner  = null;
    
    this.flight_pool  = [];
    this.profile_pool = [];
    this.banner_pool  = [];
}

Unit.prototype.execute = function(uid, client, place, callback) {
    var self = this;

    this.uid = uid;
    this.place = place;
    this.client = client;
    this.flight_pool = [];

    this.flight_pool = this._getFlights();

    this._selectFlight(function(err, is_finded) {
        if (err || is_finded) {
            callback(err, self.banner);
        } else {
            callback(new Error("ENG-0005"));
        }
    });
};

Unit.prototype._getFlights = function() {
    var site    = this.place.getPage().getSite()
      , network = this.place.getNetworks()
      , pool    = [];

    for (var i=0, len=network.length; i<len; i++) {
        pool = pool.concat(network[i].getFlights());
    }

    // exclude by buyout
    var buyout = site.getBuyout();
    pool = pool.filter(function(flight) {        
        return buyout.indexOf(flight.getBuyout("pub") != -1);
    });

    // sort by priority
    pool.sort(function(flight_a, flight_b) {
        return flight_a.getPriority() > flight_b.getPriority() ? -1 : 1;
    });

    // radnomize (remove?)
    pool.sort(function(flight_a, flight_b) {
        if (flight_a.getPriority() == flight_b.getPriority()) {
            return Math.random() > 0.5 ? -1 : 1;
        } else {
            return -1;
        }
    });

    this._session_vars = {
        now        : util2.now()
      , uid        : this.uid
      , client_ip  : this.client.ip
      , user_agent : this.client.user_agent
      , site_id       : this.place.getPage().getSite().getId()
      , site_category : this.place.getPage().getCategory()
    };

    return pool;
};

Unit.prototype._selectFlight = function(callback) {
    if (this.flight) {
        var self = this
          , flight = this.flight;
        this.flight = null;

        flight.rollback(this.uid, function() {
            self._selectFlight(callback)
        });

        return;
    }
    
    this.flight = this.flight_pool.shift();

    if (!this.flight) {
        callback(null, false);
    } else {
        this.flight.rotate(this._session_vars, function(err, result) {
            if (err) {
                callback(err);
            }

            if (result) {
                this.profile_pool = this.flight.getProfiles();
                this._selectProfile(callback);
            } else {
                // TODO try to use process.nextTick
                this._selectFlight(callback);
            }
        }.bind(this));
    }
};

Unit.prototype._selectProfile = function(callback) {
    if (this.profile) {
        var self = this
          , profile = this.profile;
        this.profile = null;

        profile.rollback(this.uid, function() {
            self._selectProfile(callback)
        });

        return;
    }

    this.profile = this.profile_pool.shift();

    if (!this.profile) {
        this._selectFlight(callback);
    } else {
        this.profile.rotate(this._session_vars, function(err, result) {
            if (err) {
                callback(err);
            }

            if (result) {
                this.banner_pool = this.profile.getBanners();
                this._selectBanner(callback);
            } else {
                // TODO try to use process.nextTick
                this._selectProfile(callback);
            }
        }.bind(this));
    }
};

Unit.prototype._selectBanner = function(callback) {
    if (this.banner) {
        var self = this
          , banner = this.banner;
        this.banner = null;

        banner.rollback(this.uid, function() {
            self._selectBanner(callback)
        });

        return;
    }

    this.banner = this.banner_pool.shift();

    if (!this.banner) {
        this._selectProfile(callback);
    } else {
        this.banner.rotate(this._session_vars, function(err, result) {
            if (err) {
                callback(err);
            }

            if (result) {
                this._finish(callback);
            } else {
                // TODO try to use process.nextTick
                this._selectBanner(callback);
            }
        }.bind(this));
    }
};

var async = require("async");

Unit.prototype._finish = function(callback) {
    callback(null, true);
};


Unit.prototype._updateCounters = function(callback) {
    var self = this
      , next = null
      , result = false
      , uid = this.uid
    ;
    
    async.waterfall([
        function(callback) {
            self.banner.getCounter(1).incr(callback);
        },

        function(is_done, callback) {
            if (!is_done) {
                next = "_selectBanner";
                callback(null, false);
            } else {
                if (self.banner.getUserCounter(1)) {
                    self.banner.getUserCounter(1).incr(uid, callback);
                } else {
                    callback(null, true);
                }
            }
        },

        function(is_done, callback) {
            if (!is_done) {
                !next && (next = "_selectBanner");
                callback(null, false);
            } else {
                self.profile.getCounter(1).incr(callback);
            }
        },

        function(is_done, callback) {
            if (!is_done) {
                !next && (next = "_selectProfile");
                callback(null, false);
            } else {
                if (self.profile.getUserCounter(1)) {
                    self.profile.getUserCounter(1).incr(uid, callback);
                } else {
                    callback(null, true);
                }
            }
        },

        function(is_done, callback) {
            if (!is_done) {
                !next && (next = "_selectProfile");
                callback(null, false);
            } else {
                self.flight.getCounter(1).incr(callback);
            }
        },

        function(is_done, callback) {
            if (!is_done) {
                !next && (next = "_selectFlight");
                callback(null, false);
            } else {
                if (self.flight.getUserCounter(1)) {
                    self.flight.getUserCounter(1).incr(uid, callback);
                } else {
                    callback(null, true);
                }
            }
        },

        function(is_done, callback) {
            if (!is_done) {
                !next && (next = "_selectFlight");
                callback();
            } else {
                result = true;
                callback();
            }
        }
    ], function(err) {
        if (!err) {
            if (result) {
                callback(null, true);
            } else {
                self[next](callback);
            }
        } else {
            callback(err);
        }
    });
};

module.exports = Unit;
