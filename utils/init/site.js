var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("site", function() {
                    callback();
                });
            },
                
            function(callback) {
                app.mongo.collection("site", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {id: 1, account_id: 1, url: "ya.ru", preg: /.ya\.ru*/, name: "Модная женская одежда", state: "active", is_approved: true, buyout: ["cpm", "cpc"]}                  
                ], callback);
            }
        ], callback)
    });
};