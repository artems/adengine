var boot = require(".swf./../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("network", function() {
                    callback();
                });
            },
                
            function(callback) {
                app.mongo.collection("network", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {id: 1, format_id: 1, name: 'ZeroNet: Light', group: 'light'}
                  , {id: 2, format_id: 1, name: 'ZeroNet: Category', group: 'category'}
                  , {id: 3, format_id: 2, name: 'PopUnder: Light', group: 'light'}
                  , {id: 4, format_id: 2, name: 'PopUnder: Category', group: 'category'}
                  , {id: 5, format_id: 3, name: 'RichMedia: Light', group: 'light'}
                  , {id: 6, format_id: 3, name: 'RichMedia: Category', group: 'category'}
                  , {id: 7, format_id: 4, name: '240x400: Light', group: 'light'}
                  , {id: 8, format_id: 4, name: '240x400: Category', group: 'category'}
                  , {id: 9, format_id: 5, name: '728x90: Light', group: 'light'}
                  , {id: 10, format_id: 5, name: '728x90: Category', group: 'category'}
                ], callback);
            }
        ], callback)
    });
};