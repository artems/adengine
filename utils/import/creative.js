var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("creative", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT COUNT(*) as cnt FROM k_creative", callback);
            },

            function(results, fields, callback) {
                var total = results[0]["cnt"];
                var start = 0, limit = 1000, end = limit;

                var insert = function(start, limit, callback) {
                    console.log("insert creative #" + start);

                    app.mongo.collection("creative", function(err, creative) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        async.waterfall([
                            function(callback) {
                                app.mysql.query("SELECT * FROM k_creative LIMIT "+start+","+limit, callback);
                            },

                            function(results, fields, callback) {
                                var group = async.group(callback);
                                
                                results.forEach(function(item) {
                                    creative.insert({
                                        id: item.creative_id,
                                        flight_id: item.flight_id,
                                        template_id: item.template_id,
                                        name: item.creative_title,
                                        uid: item.creative_uid || "",
                                        state: item.creative_status,
                                        params: {}
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
                app.mysql.query("SELECT COUNT(*) as cnt FROM k_creative_params", callback);
            },

            function(results, fields, callback) {
                var total = results[0]["cnt"];
                var start = 0, limit = 1000, end = limit;

                var insert = function(start, limit, callback) {
                    console.log("insert creative param#" + start);

                    app.mongo.collection("creative", function(err, creative) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        async.waterfall([
                            function(callback) {
                                app.mysql.query("SELECT * FROM k_creative_params LIMIT "+start+","+limit, callback);
                            },

                            function(results, fields, callback) {
                                var group = async.group(callback);

                                app.mongo.collection("creative", function(err, creative) {
                                    if (err) {
                                        group.error(err);
                                        return;
                                    }

                                    results.forEach(function(item) {
                                        var param = {}, name = 'params.' + item.param_name;
                                        param[name] = item.param_value;

                                        creative.update({id: item.creative_id}, {$set: param}, group.add());
                                    });
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