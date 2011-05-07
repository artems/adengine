var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("category", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT * FROM k_category", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("category", function(err, category) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        category.insert({
                            id: item.cat_id,
                            name: item.cat_name,
                            parent_id: item.parent_id
                        }, group.add());
                    });
                });

                group.finish();
            }
        ], callback);
    });
};