var boot = require("./_boot")
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
                app.mysql.query("SELECT * FROM k_network", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("network", function(err, network) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        network.insert({
                            id: item.net_id
                          , format_id: item.type_id
                          , name: item.net_title
                          , group: item.net_group || ""                         
                        }, group.add());
                    });
                });

                group.finish();
            }            
        ], callback);
    });
};