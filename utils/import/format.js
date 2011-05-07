var boot = require("./_boot")
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
                app.mysql.query("SELECT * FROM k_banner_type", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("format", function(err, format) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        format.insert({
                            id: item.type_id
                          , name: item.type_title
                          , size: item.type_size
                          , delay: item.type_delay
                        }, group.add());
                    });
                });

                group.finish();
            }
        ], callback);
    });
};