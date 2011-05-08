var async = require("async")
  , Template = require("core/template")
  , Format = require("core/format")
  , Network = require("core/network")
  , Flight = require("core/flight")
  ;

function Unit(app) {
    this.app = app;
}

Unit.prototype.execute = function(callback) {
    async.parallel([
        this.loadTemplates.bind(this)        
      , function(callback) {
            async.waterfall([
                this.loadFormats.bind(this)
              , this.loadNetworks.bind(this)
              , this.loadActiveFlights.bind(this)
              , this.loadActiveCreatives.bind(this)
              //, this.loadActiveProfiles.bind(this)
              //, this.loadActiveBanners.bind(this)
              //, this.loadSitePlugs.bind(this)
            ], callback)
        }.bind(this)
        /*
      , function(callback) {
            async.waterfall([
                this.loadSites.bind(this)
              , this.loadSitePages.bind(this)
              , this.loadSitePlaces.bind(this)
            ], callback)
        }.bind(this)
      , this.loadFormatPlugs.bind(this)
        */
    ], callback);

    // TODO optimization
    // Проверить весь список и
    //  - если в сценарии нет баннеров, удалить сценарий из реестра
    //  - если во флайте нет сценариев, удалить флайт из реестра
};

Unit.prototype.loadTemplates = function(callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    async.waterfall([
        function(callback) {
            mongo.collection("template", callback);
        },

        function(collection, callback) {
            collection.find(callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(result, callback) {
            var deferred = async.deferred(callback, result.length);
            
            registry.template = {};                        
            
            result.forEach(function(item) {
                Template.Create(item, function(err, template) {
                    if (!err) {
                        registry.template[item.id] = template;
                    }
                    deferred(err);
                });                
            });
            
            deferred();
        }
    ], callback);
};

Unit.prototype.loadFormats = function(callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    async.waterfall([
        function(callback) {
            mongo.collection("format", callback);
        },

        function(collection, callback) {
            collection.find(callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(result, callback) {
            var deferred = async.deferred(callback, result.length);
            
            registry.format = {};
                       
            result.forEach(function(item) {
                Format.Create(item, function(err, format) {
                    if (!err) {
                        registry.format[item.id] = format;
                    } 
                    deferred(err);
                });                
            });
            
            deferred();
        }
    ], callback);
};

Unit.prototype.loadNetworks = function(callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    async.waterfall([
        function(callback) {
            mongo.collection("network", callback);
        },

        function(collection, callback) {
            collection.find(callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(result, callback) {
            var deferred = async.deferred(callback, result.length);
            
            registry.network = {};
            
            result.forEach(function(item) {
                Network.Create(item, function(err, network) {
                    if (!err) {
                        network.setFormat(registry.format[item.format_id]);
                        
                        registry.network[item.id] = network;
                    } 
                    deferred(err);
                });                
            });
            
            deferred();
        }
    ], callback);
};

Unit.prototype.loadActiveFlights = function(callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    var flight_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("flight", callback);
        },

        function(collection, callback) {
            var now = new Date();
            var query = {
                state: "active",
                begin: {$lt: now},
                end: {$gt: now}
            };
            collection.find(query, null, {sort: ['prioprity', "ascending"]}, callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(flights, callback) {
            var deferred = async.deferred(callback, flights.length);
            
            registry.flight = {};
            
            flights.forEach(function(item) {
                Flight.Create(item, function(err, flight) {
                    if (!err) {
                        var network = registry.network[item.network_id];
                                                
                        flight.setNetwork(network);
                        
                        if (!item.is_plug) {
                            network.addFlight(flight);
                        }
                        
                        flight_id.push(item.id);
                        
                        registry.flight[item.id] = flight;
                    }
                    
                    deferred(err);
                });                
            });
            
            deferred();
        }
    ], function(err) {
        callback(err, flight_id);
    });
};

Unit.prototype.loadActiveCreatives = function(flight_id, callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    async.waterfall([
        function(callback) {
            mongo.collection("creative", callback);
        },

        function(collection, callback) {
            var query = {
                'flight_id' : {$in: flight_id}
            };
            collection.find(query, callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(creatives, callback) {
            var deferred = async.deferred(callback, creatives.length);

            registry.creative = {};          
                       
            creatives.forEach(function(item) {
                Creative.Create(item, function(err, creative) {
                    if (!err) {
                        creative.setFlight(registry.flight[item.flight_id]);
                        creative.setTemplate(registry.template[item.template_id]);
                        
                        registry.creative[item.id] = creative;
                    } 
                    deferred(err);
                });                
            });
            
            deferred();
        }
    ], function(err) {
        callback(err, flight_id);
    });
};
/*
Unit.prototype.loadActiveProfiles = function(flight_id, callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    var profile_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("profile", callback);
        },

        function(collection, callback) {
            var query = {
                'flight_id' : {$in: flight_id}
              , 'state': {$ne: 'deleted'}
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(profiles, callback) {
            var deferred = async.deferred(callback, profiles.length);
            
            registry.profile = {};

            callback(null, profile_id);
            
            profiles.forEach(function(item) {
                Profile.Create(item, function(err, profile) {
                    if (!err) {
                        profile.setFlight(registry.flight[item.flight_id]);
                        
                        profile_id.push(item.id);
                        
                        registry.profile[item.id] = profile;
                    } 
                    deferred(err);
                });                
            });
            
            deferred();
        }
    ], function(err) {
        callback(err, profile_id);
    });
};
/*
Unit.prototype.loadActiveBanners = function(profile_id, callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;    

    async.waterfall([
        function(callback) {
            mongo.collection("banner", callback);
        },

        function(collection, callback) {
            var now = new Date();
            var query = {
                state: "active",
                begin: {$lt: now},
                end: {$gt: now},
                profile_id: {$in: profile_id}
            };
            collection.find(query, null, {sort: ['prioprity', "ascending"]}, callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(banners, callback) {            
            registry.banner = {};

            banners.forEach(function(item) {
                registry.banner[item.id] = item;
                registry.profile[item.profile_id].banners.push(item);
            });

            callback();
        }
    ], callback);
};

Unit.prototype.loadFormatPlugs = function(callback) {
     var mongo = this.app.mongo
       , registry = this.app.registry;

     async.waterfall([
        function(callback) {
            mongo.collection("template", callback);
        },

        function(collection, callback) {
            collection.find({'is_plug': true}, callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(result, callback) {
            result.forEach(function(item) {
                if (registry.format[item.format_id].plug) {
                    var old_plug_id = registry.format[item.format_id].plug.id;
                    console.log('more then one plug for format '+ item.format_id + ' ('+ old_plug_id +' and ' + item.id +')');
                }
                
                registry.format[item.format_id].plug = item;
            });
            callback();
        }
    ], callback);
};

Unit.prototype.loadSitePlugs = function(callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    async.waterfall([
        function(callback) {
            mongo.collection("site_plug", callback);
        },

        function(collection, callback) {
            collection.find(callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(result, callback) {
            registry.site_plug = {};
            result.forEach(function(item) {
                if (!registry.site_plug[item.format_id]) {
                    registry.site_plug[item.format_id] = {};
                }
                
                if (!registry.site_plug[item.format_id][item.site_id]) {
                    registry.site_plug[item.format_id][item.site_id] = [];
                }

                var banner = registry.banner[item.banner_id];
                registry.site_plug[item.format_id][item.site_id].push(banner);
            });
            callback();
        }
    ], callback);
};

Unit.prototype.loadSites = function(callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    var site_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("site", callback);
        },

        function(collection, callback) {            
            collection.find({state: "active", is_approved: true}, callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(sites, callback) {
            registry.site = {};

            sites.forEach(function(item) {
                registry.site[item.id] = item;
                registry.site[item.id].default_page = null;
                site_id.push(item.id);
            });

            callback();
        }
    ], function(err) {
        callback(err, site_id);
    });
};

Unit.prototype.loadSitePages = function(site_id, callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    var page_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("site_page", callback);
        },

        function(collection, callback) {
            collection.find({site_id: {$in: site_id}}, callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(pages, callback) {
            registry.site_page = {};

            pages.forEach(function(item) {
                if (item.name == "*") {
                    registry.site[item.site_id].default_page = item;
                }

                registry.site_page[item.id] = item;
                registry.site_page[item.id].place = {};
                page_id.push(item.id);
            });

            callback();
        }
    ], function(err) {
        callback(err, page_id);
    });
};

Unit.prototype.loadSitePlaces = function(page_id, callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    async.waterfall([
        function(callback) {
            mongo.collection("site_place", callback);
        },

        function(collection, callback) {
            collection.find({page_id: {$in: page_id}}, callback);
        },

        function(cursor, callback) {
            cursor.toArray(callback);
        },

        function(sites, callback) {
            registry.site_place = {};

            sites.forEach(function(item) {
                if (!registry.site_page[item.page_id].place[item.format_id]) {
                    registry.site_page[item.page_id].place[item.format_id] = [];
                }

                registry.site_place[item.id] = item;
                registry.site_page[item.page_id].place[item.format_id].push(item);
            });

            callback();
        }
    ], function(err) {
        callback(err, page_id);
    });
};
*/

module.exports = Unit;