var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("geo_ip", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT COUNT(*) as cnt FROM k_geo_raw_addr", callback);
            },

            function(results, fields, callback) {
                var total = results[0]["cnt"];
                var start = 0, limit = 1000, end = limit;

                var insert = function(start, limit, callback) {
                    console.log("insert geo_id #" + start + " of " + total);

                    app.mongo.collection("geo_ip", function(err, geo_ip) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        async.waterfall([
                            function(callback) {
                                app.mysql.query("SELECT * FROM k_geo_raw_addr LIMIT "+start+","+limit, callback);
                            },

                            function(results, fields, callback) {
                                var group = async.group(callback);
                                results.forEach(function(item) {
                                    geo_ip.insert({
                                        begin: item.start_ip,
                                        end: item.end_ip,
                                        country_id: item.country_code,
                                        region_id: item.region_code,
                                        city_id: item.city_code
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