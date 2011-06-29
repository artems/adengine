var async   = require("async")
  , Create  = require("./create")
  , util2   = require("core/util")
  , Ruleset = require("core/ruleset")
;

function Unit(app) {
    this.app = app;
    this.registry = this.app.registry;
}

Unit.flight = function(flight_id, callback) {
    var self = this
      , mongo = this.app.mongo
      , factory = this.factory
      , registry = this.registry
    ;
    
    async.waterfall([
        function(callback) {
            mongo.collection("flight", callback);
        },

        function(collection, callback) {
            var query = {id: {$in: flight_id}};

            collection.find(query, callback);
        },

        function(cursor, callback) {
            var object, group = async.group(callback);

            cursor.each(function(err, item) {
                if (!err && item != null) {
                    object = registry.flight[item.id];
                    if (object) {
                        // (!) изменение сети невозможно
                        // (!) изменение флага is_plug невозможно
                        // изменение state -> удаление из сети
                        Flight.Update(object, item, group.add());
                    } else {
                        factory.createFlight(item, group.add());
                    }
                } else {
                    group.finish(err);
                }
            });
        }
    ], function(err) {
        err && console.log(err.stack);
        callback();
    });
};

Unit.prototype.updateFlight = function(object, item, callback) {
    
};