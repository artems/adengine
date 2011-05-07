var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("flight", function() {
                    callback();
                });
            },

            function(callback) {
                app.mongo.collection("flight", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {
                        id: 1, account_id: 1, user_id: 1, campagin_id: 1, network_id: 7
                      , name: 'Sky_Express_240x400'
                      , prioprity: 5
                      , budget: 100.00
                      , balance: 48.20
                      , spent: 0
                      , distribution: 'max'
                      , begin: new Date(2010, 01, 01)
                      , end: new Date(2012, 12, 31)
                      , state: "active"
                      , comment: ''
                      , limit : {

                        }
                      , flags: {
                            day_done: 0
                          , total_done: 0
                        }
                    }
                ], callback);
            }
        ], callback)
    });
};