var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("format", function() {
                    callback();
                });
            },
                
            function(callback) {                
                app.mongo.collection("format", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {id: 1, name: 'ZeroPixel', size: 1, delay: 0}
                  , {id: 2, name: 'PopUnder', size: 1, delay: 60}
                  , {id: 3, name: 'RichMedia', size: 1, delay: 60}
                  , {id: 4, name: '240x400', size: 3, delay: 0}
                  , {id: 5, name: '728x90', size: 1, delay: 0}
                ], callback);
            }            
        ], callback)
    });
};