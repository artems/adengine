var boot = require("../../boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("site_place", function() {
                    callback();
                });
            },

            function(callback) {
                app.mongo.collection("site_place", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {id: 1, page_id: 1, format_id: 1, network_id: [1, 2], name: 'Место "ZeroPixel" на ya.ru', code_type: 'js', state: 'active', comment: null}
                  , {id: 2, page_id: 1, format_id: 2, network_id: [3, 4], name: 'Место "PopUnder" на ya.ru', code_type: 'js', state: 'active', comment: null}
                  , {id: 3, page_id: 1, format_id: 3, network_id: [5, 6], name: 'Место "RichMedia" на ya.ru', code_type: 'js', state: 'active', comment: null}
                  , {id: 4, page_id: 1, format_id: 4, network_id: [7, 8], name: 'Место "240x400" на ya.ru', code_type: 'js', state: 'active', comment: null}
                  , {id: 5, page_id: 1, format_id: 5, network_id: [9, 10], name: 'Место "728x90" на ya.ru', code_type: 'js', state: 'active', comment: null}
                ], callback);
            }
        ], callback)
    });
};