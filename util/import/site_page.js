var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("site_page", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT * FROM k_site_page", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("site_page", function(err, site_page) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        site_page.insert({
                            id: item.page_id,
                            site_id: item.site_id,
                            name: item.page_title,
                            order: item.page_order,
                            category: [],
                            preg: []
                        }, group.add());
                    });
                });

                group.finish();
            },

            function(results, callback) {
                app.mysql.query("SELECT * FROM k_site_page_cat", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("site_page", function(err, site_page) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        site_page.update({id: item.page_id}, {$push: {'category': item.cat_id}}, group.add());
                    });
                });

                group.finish();
            },

            function(results, callback) {
                app.mysql.query("SELECT * FROM k_site_page_preg", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("site_page", function(err, site_page) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        var preg = new RegExp(item.preg_match.replace(/\*/g, '.*'));
                        site_page.update({id: item.page_id}, {$push: {'preg': preg}}, group.add());
                    });
                });

                group.finish();
            }
        ], callback);
    });
};