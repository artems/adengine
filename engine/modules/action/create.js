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
  ;

function Unit(registry) {  
    this.registry = registry;
}

Unit.prototype.getObject = function(type, id) {
    var object = this.registry[type][id]
    
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
            for (var i in object.params) {
                if (object.params.hasOwnProperty(i)) {
                    var param = object.params[i];
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
                network.addFlight(object);
                object.setNetwork(network);
            }
            
            registry.flight[item.id] = object;
        } 
        
        callback(err);
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
            
            for (var i in object.params) {
                if (object.params.hasOwnProperty(i)) {
                    object.setParam(i, object.params[i]);
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
        } 
        
        callback(err);
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
        } 
        
        callback(err);
    }); 
};

Unit.prototype.createSite = function(item, callback) {
    var registry = this.registry;
    
    Site.Create(item, function(err, object) {
        if (!err) {                        
            registry.site[item.id] = object;
        } 
        
        callback(err);
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
                
                if (object.name == "*") {
                    site.setDefaultPage(object);
                }
            }
            
            registry.page[item.id] = object;
        } 
        
        callback(err);
    }); 
};

Unit.prototype.createPlace = function(item, callback) {
    var self = this
      , registry = this.registry;
    
    Place.Create(item, function(err, object) {
        if (!err) {
            var page = self.getObject('page', item.page_id);
            if (page) {
                page.addPlace(object);
                object.setPage(page);
            }
            
            var format = self.getObject('format', item.format_id);
            if (format) {
                object.setFormat(format);
            }
            
            for (var i in object.network) {
                if (object.network.hasOwnProperty(i)) {
                    var network = this.getObject('network', this.network[i]);
                    if (network) {
                        object.addNetwork(network);
                    }
                }
            }
            
            registry.place[item.id] = object;
        } 
        
        callback(err);
    });
};

Unit.prototype.createTargeting = function(item, callback) {    
    var self = this;
    
    Ruleset.Create(item, function(err, object) {
        if (!err) {
            var profile = self.getObject('profile', item.profile_id);
            if (profile) {
                profile.setTarget(object);
            }
        } 
        
        callback(err);
    });
};

Unit.prototype.createSitePlug = function(item, callback) {    
    var site   = this.getObject('site', item.site_id);
    var banner = this.getObject('banner', item.banner_id);
    
    if (site && banner) {
        site.addPlug(banner);
    }
    
    callback();
};

module.exports = Unit;