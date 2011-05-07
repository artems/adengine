var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("campaign", function() {
                    callback();
                });
            },

            function(callback) {
                app.mongo.collection("campaign", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {id: 1, account_id: 1, client_id: 1, name: 'Sky_Express', limit: {}, state: "active"}
                ], callback);
            }
        ], callback)
    });
};