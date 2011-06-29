var async = require("async");

var Template = require("core/template")
  , Format   = require("core/format")
  , Network  = require("core/network")
  , Flight   = require("core/flight")
  , Creative = require("core/creative")
  , Profile  = require("core/profile")
  , Ruleset  = require("core/ruleset")
  , Banner   = require("core/banner")
  , Site     = require("core/site")
  , Page     = require("core/page")
  , Place    = require("core/place")

  , OverallCounter     = require("core/counter/overall")
  , LimitCounter       = require("core/counter/overall_limit")
  , UserOverallCounter = require("core/counter/user_overall")
  , UserPeriodCounter  = require("core/counter/user_period")
  ;

function Unit(app) {
    this.app = app;
    this.registry = app.registry;
}

Unit.prototype.getObject = function(type, id) {
    var object = this.registry[type][id];
    
    if (object) {
        return object;
    } else {
        console.warn("%s#%d is not found in registry", type, id);
        
        return null;
    }
};

Unit.prototype.createFormat = function(item, callback) {
    var registry = this.registry;
    
    Format.Create(item, function(err, object) {
        if (!err) {
            registry.format[item.id] = object;
        } 
        
        callback(err);
    }); 
};

Unit.prototype.createNetwork = function(item, callback) {
    var self = this
      , registry = this.registry;
    
    Network.Create(item, function(err, object) {
        if (!err) {
            var format = self.getObject('format', item.format_id);
            if (format) {
                format.addNetwork(object);
                object.setFormat(format);
            }
                        
            registry.network[item.id] = object;
        } 
        
        callback(err);
    }); 
};

Unit.prototype.createTemplate = function(item, callback) {
    var self = this
      , registry = this.registry;
    
    Template.Create(item, function(err, object) {
        if (!err) {
            var format = self.getObject('format', item.format_id);
            if (format) {
                object.setFormat(format);
                
                if (object.is_plug) {
                    format.setPlug(object);
                }
            }
            for (var i in item.params) {
                if (item.params.hasOwnProperty(i)) {
                    var param = item.params[i];
                    object.setParam(i, param.type, param['default'], param.require);
                }
            }
            
            registry.template[item.id] = object;
        }
        
        callback(err);
    });
};

Unit.prototype.createFlight = function(item, callback) {
    var self = this
      , registry = this.registry;

    Flight.Create(item, function(err, object) {
        if (!err) {
            var network = self.getObject('network', item.network_id);
            if (network) {
                if (!object.isPlug()) {
                    network.addFlight(object);
                }
                
                object.setNetwork(network);
            }

            registry.flight[item.id] = object;

            self._addCounters("flight", object, item, callback);
        } else {
            callback(err);
        }
    });
};

Unit.prototype.createCreative = function(item, callback) {
    var self = this
      , registry = this.registry;
    
    Creative.Create(item, function(err, object) {
        if (!err) {
            var flight = self.getObject('flight', item.flight_id);
            if (flight) {                
                object.setFlight(flight);
            }
            
            var template = self.getObject('template', item.template_id);
            if (template) {
                object.setTemplate(template);
            }
            
            for (var i in item.params) {
                if (item.params.hasOwnProperty(i)) {
                    object.setParam(i, item.params[i]);
                }
            }
            
            registry.creative[item.id] = object;
        } 
        
        callback(err);
    }); 
};

Unit.prototype.createProfile = function(item, callback) {
    var self = this
      , registry = this.registry;
    
    Profile.Create(item, function(err, object) {
        if (!err) {
            var flight = self.getObject('flight', item.flight_id);
            if (flight) {
                flight.addProfile(object);
                object.setFlight(flight);
            }
                        
            registry.profile[item.id] = object;

            self._addCounters("profile", object, item, callback);
        } else {
            callback(err);
        }
    }); 
};

Unit.prototype.createBanner = function(item, callback) {
    var self = this
      , registry = this.registry;
    
    Banner.Create(item, function(err, object) {
        if (!err) {
            var profile = self.getObject('profile', item.profile_id);
            if (profile) {
                profile.addBanner(object);
                object.setProfile(profile);
            }

            if (item.creative_id) { // banner in zeronet
                var creative = self.getObject('creative', item.creative_id);
                if (creative) {
                    object.setCreative(creative);
                }
            }

            registry.banner[item.id] = object;

            self._addCounters("banner", object, item, callback);
        } else {
            callback(err);
        }
    }); 
};

Unit.prototype.createSite = function(item, callback) {
    var self = this, registry = this.registry;
    
    Site.Create(item, function(err, object) {
        if (!err) {                        
            registry.site[item.id] = object;

            self._addCounters("site", object, item, callback);
        } else {
            callback(err);
        }
    }); 
};

Unit.prototype.createPage = function(item, callback) {
    var self = this
      , registry = this.registry;
    
    Page.Create(item, function(err, object) {
        if (!err) {
            var site = self.getObject('site', item.site_id);

            if (site) {
                site.addPage(object);
                object.setSite(site);

                if (item.name == "*") {
                    site.setDefaultPage(object);
                }
            }
            
            registry.page[item.id] = object;

            self._addCounters("page", object, item, callback);
        } else {
            callback(err);
        }
    }); 
};

Unit.prototype.createPlace = function(item, callback) {
    var self = this
      , registry = this.registry;
    
    Place.Create(item, function(err, object) {
        if (!err) {
            var format = self.getObject('format', item.format_id);
            if (format) {
                object.setFormat(format);
            }

            var page = self.getObject('page', item.page_id);
            if (page) {
                page.addPlace(object);
                object.setPage(page);
            }
            
            for (var i in item.network) {
                if (item.network.hasOwnProperty(i)) {
                    var network = self.getObject('network', item.network[i]);
                    if (network) {
                        object.addNetwork(network);
                    }
                }
            }
            
            registry.place[item.id] = object;

            self._addCounters("place", object, item, callback);
        } else {
            callback(err);
        }
    });
};

Unit.prototype.createRuleset = function(item, callback) {
    var registry = this.registry;

    Ruleset.Create(item, function(err, object) {
        if (!err) {
            registry.ruleset[item.id] = object;
        }

        callback(err);
    });
};

Unit.prototype.assignRuleset = function(profile_ruleset, callback) {
    var self = this;

    for (var i in profile_ruleset) {
        if (profile_ruleset.hasOwnProperty(i)) {
            var ruleset = self.getObject('ruleset', i);

            if (ruleset) {
                for (var j=0, len = profile_ruleset[i].length; j<len; j++) {
                    var profile = self.getObject('profile', profile_ruleset[i][j]);

                    if (profile) {
                        profile.setTarget(ruleset);
                    }
                }
            }
        }
    }

    callback();
};

Unit.prototype.createSitePlug = function(item, callback) {
    var site   = this.getObject('site', item.site_id);
    var banner = this.getObject('banner', item.banner_id);
    
    if (site && banner) {
        site.addPlug(banner);
    }
    
    callback();
};

Unit.prototype._addCounters = function(type, object, item, callback) {
    var self = this;
    
    async.series([
        function(callback) {
            // Счетчик с общими ограничениями
            self._addOverallCounter(type, object, item, callback);
        },

        function(callback) {
            // Счетчик с общим ограничением по уникалам c проверкой на минимальный интервал
            self._addUserOverallCounter(type, object, item, callback);
        }
    ], callback);
};

Unit.prototype._addOverallCounter = function(type, object, item, callback) {
    var self = this;
    
    var params = {
        event       : 1
      , object_id   : item.id
      , object_name : type
    };
    
    var factory = OverallCounter.Create;

    if (item.limit && item.limit.overall && item.limit.overall.exposure) {
        params.limit_day = item.limit.overall.exposure.day || 0;
        params.limit_all = item.limit.overall.exposure.all || 0;

        if (params.limit_day > 0 || params.limit_all > 0) {
            factory = LimitCounter.Create;
        }
    }

    factory(params, this.app.redis, function(err, counter) {
        if (!err) {
            object.addCounter(counter);

            // Сохранить счетчик в общем пуле, где сбрасывать дельту
            self.app.counter.addCounter(counter);
        }

        callback(err);
    });
};

Unit.prototype._addUserOverallCounter = function(type, object, item, callback) {
    var params = {
        event       : 1
      , object_id   : item.id
      , object_name : type
    };

    var factory = null;

    if (item.limit && item.limit.user) {
        if (item.limit.user.exposure) {
            params.limit_all    = item.limit.user.exposure.all      || 0;
            params.min_interval = item.limit.user.exposure.interval || 0;

            if (params.limit_all > 0 || params.min_interval > 0) {
                factory = UserOverallCounter.Create;
            }
        }

        if (item.limit.user.period && item.limit.user.period.exposure) {
            params.period_limit    = item.limit.user.period.exposure.count    || 0;
            params.period_interval = item.limit.user.period.exposure.interval || 0;

            if (params.period_limit > 0 && params.period_interval > 0) {
                factory = UserPeriodCounter.Create;
            }
        }
    }
    
    if (factory) {
        factory(params, this.app.redis, function(err, counter) {
            if (!err) {
                object.addUserCounter(counter);
            }

            callback(err);
        });
    } else {
        callback();
    }
};

module.exports = Unit;