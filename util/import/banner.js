var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("banner", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT COUNT(*) as cnt FROM k_banner", callback);
            },

            function(results, fields, callback) {
                var total = results[0]["cnt"];
                var start = 0, limit = 1000, end = limit;

                var insert = function(start, limit, callback) {
                    console.log("insert banner #" + start + " of " + total);

                    app.mongo.collection("banner", function(err, banner) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        async.waterfall([
                            function(callback) {
                                app.mysql.query("SELECT * FROM k_banner LIMIT "+start+","+limit, callback);
                            },

                            function(results, fields, callback) {
                                var group = async.group(callback);
                                results.forEach(function(item) {
                                    banner.insert({
                                        id: item.banner_id,
                                        profile_id: item.profile_id,
                                        creative_id: item.creative_id,
                                        name: item.banner_title,
                                        url: item.banner_url || "",
                                        priority: item.banner_priority,
                                        distribution: item.banner_distribution,
                                        begin: item.banner_dstart || new Date(1970, 1, 1),
                                        end: item.banner_dfinish || new Date(2099, 12, 31),
                                        state: item.banner_status,
                                        limit: {}
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
            },

            function(callback) {
                app.mysql.query("SELECT COUNT(*) as cnt FROM k_banner_limit", callback);
            },

            function(results, fields, callback) {
                var total = results[0]["cnt"];
                var start = 0, limit = 1000, end = limit;

                var insert = function(start, limit, callback) {
                    console.log("insert banner limit #" + start + " of " + total);

                    app.mongo.collection("banner", function(err, banner) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        async.waterfall([
                            function(callback) {
                                app.mysql.query("SELECT * FROM k_banner_limit LIMIT "+start+","+limit, callback);
                            },

                            function(results, fields, callback) {
                                var group = async.group(callback);
                                results.forEach(function(item) {
                                    var id     = item.banner_id;
                                    var period = "", type = "", event = "", interval = "", update;
                                    var limit  = item.limit_count;
            
                                    switch (item.limit_type) {
                                        case "day":
                                            period = "day";
                                            type = "overall";
                                            break;
                                        case "all" :
                                            period = "all";
                                            type ="overall";
                                            break;
                                            break;
                                        case "user_all":
                                            period = "all";
                                            type = "user";
                                            interval = item.limit_time;
                                            break;
                                        case "user":
                                            type = "user";
                                            switch (item.limit_time) {
                                                case 86400:
                                                    period = "day";
                                                    break;
                                                case 604800:
                                                    period = "week";
                                                    break;
                                                case 2592000:
                                                    period = "month";
                                                    break;
                                            }
                                            break;
                                    }

                                    switch (item.limit_event) {
                                        case 1: event  = "exposure"; break;
                                        case 2: event  = "click"; break;
                                        case 45: event = "show";
                                    }

                                    if (type == "overall" && period && event && limit > 0) {
                                        update = {};
                                        update["limit." + type + "." + event + "." + period] = limit;
                                        banner.update({"id": id},  {$set: update}, group.add());
                                    }
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