var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("creative", function() {
                    callback();
                });
            },

            function(callback) {
                app.mongo.collection("creative", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {
                        id: 1, flight_id: 1, template_id: 1,
                        name: 'Creative#1',
                        state: 'active',
                        params: {
                            'getURL': 'http://localhost:8080/store/1/1/izmena_240x400_root.swf'
                          , 'imageURL' : 'http://localhost:8080/store/1/1/izmena_240x400_root.swf'
                        }
                    }
                ], callback);
            }
        ], callback)
    });
};