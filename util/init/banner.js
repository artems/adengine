var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("banner", function() {
                    callback();
                });
            },

            function(callback) {
                app.mongo.collection("banner", callback);
            },

            function(coll, callback) {                
                coll.insertAll([
                    {
                        id: 1, profile_id: 1, creative_id: 1
                      , name: 'Banner#1'
                      , url: 'http://www.google.ru'
                      , priority: 5
                      , distribution: 'max'
                      , begin: new Date(2010, 01, 01)
                      , end: new Date(2012, 12, 31)
                      , state: 'active'
                      , limit: {
                        
                        }
                    }
                ], callback);
            }
        ], callback)
    });
};