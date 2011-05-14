function Unit() {
    this.flight  = null;
    this.profile = null;
    this.banner  = null;
    
    this.flight_pool  = [];
    this.profile_pool = [];
    this.banner_pool  = [];
}

Unit.prototype.execute = function(place, callback) {
    var self = this;

    this.place = place;
    this.flight_pool = [];

    this.flight_pool = this._getFlights();
  
    this._selectFlight(function(err, is_finded) {
        if (is_finded) {                        
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
        return flight_a.getPriority() > flight_b.getPriority() ? 1 : -1;
    });

    // radnomize (remove?)
    pool.sort(function(flight_a, flight_b) {
        if (flight_a.getPriority() == flight_b.getPriority()) {
            return Math.random() > 0.5 ? 1 : -1;
        } else {
            return -1;
        }
    });

    return pool;
};

Unit.prototype._selectFlight = function(callback) {   
    this.flight = this.flight_pool.shift();

    if (!this.flight) {
        callback(null, false);
    } else {
        this.flight.canRotate(function(err, result) {
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
    this.profile = this.profile_pool.shift();

    if (!this.profile) {
        this._selectFlight(callback);
    } else {
        this.profile.canRotate(function(err, result) {
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
    this.banner = this.banner_pool.shift();

    if (!this.banner) {
        this._selectProfile(callback);
    } else {
        this.banner.canRotate(function(err, result) {
            if (err) {
                callback(err);
            }
            
            if (result) {
                callback(null, true);
            } else {
                // TODO try to use process.nextTick
                this._selectBanner(callback);
            } 
        }.bind(this));
    }
};

module.exports = Unit;
