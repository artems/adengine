var boot = require("./_boot")
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
                app.mysql.query("SELECT * FROM k_site", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("site", function(err, site) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        var state = item.site_state.indexOf("deleted") != -1 ? "deleted" : "active";
                        var approved = item.site_state.indexOf("approved") != -1;                       

                        site.insert({
                            id: item.site_id,
                            account_id: item.account_id,
                            url: item.site_url,
                            preg: new RegExp(item.site_preg == "*" ? ".*" : item.site_preg),
                            name: item.site_name,
                            state: state,
                            is_approved: approved,
                            buyout: item.site_buyout.split(",")
                        }, group.add());
                    });
                });

                group.finish();
            }
        ], callback);
    });
};