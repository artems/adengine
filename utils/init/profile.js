var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("profile", function() {
                    callback();
                });
            },

            function(callback) {
                app.mongo.collection("profile", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {
                        id: 1, flight_id: 1
                      , name: 'Profile#1'
                      , state: 'active'
                      , targeting: {
                            
                        }
                    }
                ], callback);
            }
        ], callback)
    });
};