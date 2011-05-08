var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("site_plug", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT * FROM k_site_plug WHERE banner_id IS NOT NULL", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("site_plug", function(err, site_plug) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        site_plug.insert({
                            id: item.plug_id,
                            site_id: item.site_id,
                            format_id: item.type_id,
                            banner_id : item.banner_id
                        }, group.add());
                    });
                });

                group.finish();
            }
        ], callback);
    });
};