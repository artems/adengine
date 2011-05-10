var boot = require("./_boot")
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
                app.mysql.query("SELECT COUNT(*) as cnt FROM k_site_place", callback);
            },

            function(results, fields, callback) {
                var total = results[0]["cnt"];
                var start = 0, limit = 1000, end = limit;

                var insert = function(start, limit, callback) {
                    console.log("insert site place #" + start + " of " + total);

                    app.mongo.collection("site_place", function(err, site_place) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        async.waterfall([
                            function(callback) {
                                app.mysql.query("SELECT * FROM k_site_place LIMIT "+start+","+limit, callback);
                            },

                            function(results, fields, callback) {
                                var group = async.group(callback);
                                results.forEach(function(item) {
                                    var state = item.place_active == 1 ? "active" : "deleted";
                                    site_place.insert({
                                        id: item.place_id,
                                        site_id: item.site_id,
                                        page_id: item.page_id,
                                        format_id: item.type_id,
                                        name: item.place_title,
                                        code_type: item.place_type,
                                        state: state,
                                        category: item.place_cat == null ? [] : item.place_cat.split(","),
                                        comment: item.place_opcomment
                                    }, group.add());
                                });

                                group.finish();
                            }
                        ], callback);
                    });
                };

                var go_next = function () {
                    start = end;
                    end   = start + limit;

                    if (start < total) {
                        insert(start, limit, go_next);
                    } else {
                        callback()
                    }
                };

                insert(start, limit, go_next);
            }
        ], callback);
    });
};