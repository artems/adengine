var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("site_page", function() {
                    callback();
                });
            },

            function(callback) {
                app.mongo.collection("site_page", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {id: 1, site_id: 1, name: '*', order: '1', preg: /.*/, category: [1, 8]}                  
                ], callback);
            }
        ], callback)
    });
};