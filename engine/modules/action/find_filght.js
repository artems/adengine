function Unit() {
    this.flight  = null;
    this.profile = null;
    this.banner  = null;
    
    this.flight_pool  = [];
    this.profile_pool = [];
    this.banner_pool  = [];
}

Unit.prototype.execute = function(format, callback) {
    var self = this;

    this.flight_pool = format.getFlights();

    // TODO remove it
    this.flight_pool.sort(function(a, b) {
        return Math.random() > 0.5 ? 1 : -1;
    });
  
    this._selectFlight(function(err, is_finded) {
        if (is_finded) {                        
            callback(err, self.banner);
        } else {
            callback(new Error("ENG-0005"));
        }
    });
};

Unit.prototype._selectFlight = function(callback) {   
    this.flight = this.flight_pool.shift();

    if (!this.flight) {
        callback(null, false);
    } else {        
        this.flight.verify(function(err, result) {
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
        });
    }
};

Unit.prototype._selectProfile = function(callback) {
    this.profile = this.profile_pool.shift();

    if (!this.profile) {
        this._selectFlight(callback);
    } else {
        this.profile.verify(function(err, result) {
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
        });
    }
};

Unit.prototype._selectBanner = function(callback) {
    this.banner = this.banner_pool.shift();

    if (!this.banner) {
        this._selectProfile(callback);
    } else {
        this.banner.verify(function(err, result) {
            if (err) {
                callback(err);
            }
            
            if (result) {
                callback(null, true);
            } else {
                // TODO try to use process.nextTick
                this._selectBanner(callback);
            } 
        });
    }
};

module.exports = Unit;
