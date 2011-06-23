var async   = require("async")
  , Create  = require("./create")
  , Dummy   = require("core/dummy")
  , Ruleset = require("core/ruleset")

  , OverallCounter = require("core/counter/overall");

function Unit(app) {
    this.app = app;
    
    var registry = {};
    
    registry.format   = {};    
    registry.network  = {};
    registry.template = {};
    registry.flight   = {};
    registry.creative = {};
    registry.profile  = {};
    registry.banner   = {};
    registry.site     = {};    
    registry.page     = {};
    registry.place    = {};
    registry.category = {};
    registry.ruleset  = {};
    registry.counter  = {};
    
    this.app.registry = registry;
}

Unit.prototype.execute = function(callback) {
    this.factory = new Create(this.app);

    this.ruleset_id = [];
    this.profile_ruleset = {};

    OverallCounter.setRedisClient(this.app.redis);

    async.series([
        this.loadFormats.bind(this)
      , this.loadNetworks.bind(this)
      , this.loadTemplates.bind(this)
      , function(callback) {
          async.waterfall([
              this.loadFlights.bind(this)
            , this.loadCreatives.bind(this)
            , this.loadProfiles.bind(this)
            , this.loadBanners.bind(this)
          ], callback)
      }.bind(this)
      , this.loadRulesets.bind(this)
      , function(callback) {
          async.waterfall([
              this.loadSites.bind(this)
            , this.loadPlugs.bind(this)
            , this.loadPages.bind(this)
            , this.loadPlaces.bind(this)
          ], callback);
      }.bind(this)
      , this.loadCategory.bind(this)
      , function(callback) {
          Ruleset.setCategoryMap(this.app.registry.category);
          callback();
      }.bind(this)
      // , this.loadCounters.bind(this)
    ], callback);
    
    // TODO optimization
    // Проверить весь список и
    //  - если в сценарии нет баннеров, удалить сценарий из реестра
    //  - если во флайте нет сценариев, удалить флайт из реестра
};

Unit.prototype.loadFormats = function(callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , format_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("format", callback);
        },

        function(collection, callback) {
            collection.find(callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);

            cursor.each(function(err, item) {
                if (!err && item != null) {
                    format_id.push(item.id);
                    
                    factory.createFormat(item, group.add());
                } else {
                    group.finish(err);
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, format_id);
    });
}

Unit.prototype.loadNetworks = function(callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , network_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("network", callback);
        },

        function(collection, callback) {
            collection.find(callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                
                if (!err && item != null) {
                    network_id.push(item.id);
                    
                    factory.createNetwork(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, network_id);
    });
}

Unit.prototype.loadTemplates = function(callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , template_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("template", callback);
        },

        function(collection, callback) {
            collection.find(callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                
                if (!err && item != null) {
                    template_id.push(item.id);
                    
                    factory.createTemplate(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, template_id)
    });
}

Unit.prototype.loadFlights = function(callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , flight_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("flight", callback);
        },

        function(collection, callback) {
            var now   = Dummy.now();
            var query = {
                $or : [{
                    is_plug : true
                }, {
                    state : "active"
                  , begin : {$lt: now}
                  , end   : {$gt: now}
                }]
            };
            
            collection.find(query, callback);
        },
        
        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {
                if (!err && item != null) {
                    flight_id.push(item.id);
                    
                    factory.createFlight(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, flight_id);
    });
};

Unit.prototype.loadCreatives = function(flight_id, callback) {
    var mongo = this.app.mongo
      , factory = this.factory;
      
    async.waterfall([
        function(callback) {
            mongo.collection("creative", callback);
        },

        function(collection, callback) {
            var query = {
                flight_id : {$in: flight_id}
              , state     : {$ne: 'deleted'}
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                                
                if (!err && item != null) {                   
                    factory.createCreative(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, flight_id);
    });
}

Unit.prototype.loadProfiles = function(flight_id, callback) {
    var mongo = this.app.mongo
      , self = this
      , factory = this.factory
      , profile_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("profile", callback);
        },

        function(collection, callback) {
            var query = {
                state     : {$ne: 'deleted'}
              , flight_id : {$in: flight_id}
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            var ruleset_id = self.ruleset_id;
            var profile_ruleset = self.profile_ruleset;
            
            cursor.each(function(err, item) {                                
                if (!err && item != null) {  
                    profile_id.push(item.id);

                    for (var i in item.target) {
                        if (item.target.hasOwnProperty(i)) {
                            if (item.target[i].on) {
                                var id = item.target[i].ruleset_id;

                                if (!profile_ruleset[id]) {
                                    profile_ruleset[id] = [];
                                }

                                ruleset_id.push(id);
                                profile_ruleset[id].push(item.id);
                            }
                        }
                    }
                    
                    factory.createProfile(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, profile_id);
    });
};

Unit.prototype.loadBanners = function(profile_id, callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , banner_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("banner", callback);
        },

        function(collection, callback) {
            var now   = Dummy.now();
            var query = {
                profile_id : {$in: profile_id}
              , state      : "active"
              , begin      : {$lt: now}
              , end        : {$gt: now}              
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                                
                if (!err && item != null) {  
                    banner_id.push(item.id);
                    
                    factory.createBanner(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, banner_id);
    });
};

Unit.prototype.loadRulesets = function( callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , ruleset_id = []
      , query_ruleset_id = this.ruleset_id
      , profile_ruleset = this.profile_ruleset;

    async.waterfall([
        function(callback) {
            mongo.collection("ruleset", callback);
        },

        function(collection, callback) {
            var query = {
                id : {$in: query_ruleset_id}
            };

            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);

            cursor.each(function(err, item) {
                if (!err && item != null) {
                    ruleset_id.push(item.id);

                    factory.createRuleset(item, group.add());
                } else {
                    group.finish(err);
                }
            });
        },

        function(results, callback) {
            factory.assignRuleset(profile_ruleset, callback);
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, ruleset_id);
    });
};

Unit.prototype.loadSites = function(callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , site_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("site", callback);
        },

        function(collection, callback) {
            var query = {
                state       : "active"
              , is_approved : true            
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                                
                if (!err && item != null) {  
                    site_id.push(item.id);
                    
                    factory.createSite(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, site_id);
    });
}

Unit.prototype.loadPlugs = function(site_id, callback) {
    var mongo = this.app.mongo
      , factory = this.factory;

    async.waterfall([
        function(callback) {
            mongo.collection("plug", callback);
        },

        function(collection, callback) {
            var query = {
                site_id : {$in: site_id}
              , state   : {$ne: 'deleted'}
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                                
                if (!err && item != null) {                     
                    factory.createSitePlug(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, site_id);
    });
}

Unit.prototype.loadPages = function(site_id, callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , page_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("page", callback);
        },

        function(collection, callback) {
            var query = {
                site_id : {$in: site_id}
              , state   : {$ne: 'deleted'}
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                                
                if (!err && item != null) {  
                    page_id.push(item.id);
                    
                    factory.createPage(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, page_id);
    });
}

Unit.prototype.loadPlaces = function(page_id, callback) {
    var mongo = this.app.mongo
      , factory = this.factory
      , place_id = [];

    async.waterfall([
        function(callback) {
            mongo.collection("place", callback);
        },

        function(collection, callback) {
            var query = {
                page_id : {$in: page_id}
              , state   : {$ne: 'deleted'}
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                                
                if (!err && item != null) {  
                    place_id.push(item.id);
                    
                    factory.createPlace(item, group.add());
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, place_id);
    });
};

Unit.prototype.loadCategory = function(callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry
      , category_id = [];
      
    async.waterfall([
        function(callback) {
            mongo.collection("category", callback);
        },

        function(collection, callback) {           
            collection.find(callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);
            
            cursor.each(function(err, item) {                                
                if (!err && item != null) {  
                    category_id.push(item.id);
                    
                    registry.category[item.id] = item;
                } else {
                    group.finish(err);                    
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null, category_id);
    });
};

Unit.prototype.loadCounters = function(callback) {
    var mongo = this.app.mongo
      , registry = this.app.registry;

    async.waterfall([
        function(callback) {
            mongo.collection("counter", callback);
        },

        function(collection, callback) {
            var query = {
                event: 1
            };
            
            collection.find(query, callback);
        },

        function(cursor, callback) {
            var group = async.group(callback);

            cursor.each(function(err, item) {
                if (!err && item != null) {
                    if (!registry.counter[item.object]) {
                        registry.counter[item.object] = {};
                    }
                    if (!registry.counter[item.object][item.id]) {
                        registry.counter[item.object][item.id] = {};
                    }

                    if (item.period !== 0) {
                        registry.counter[item.object][item.id].day = item.count;
                    } else {
                        registry.counter[item.object][item.id].all = item.count;
                    }
                } else {
                    group.finish(err);
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback(null);
    });
};

module.exports = Unit;