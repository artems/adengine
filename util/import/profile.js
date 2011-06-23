var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("profile", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT * FROM k_profile", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("profile", function(err, profile) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        profile.insert({
                            id: item.profile_id,
                            flight_id: item.flight_id,
                            name: item.profile_title,
                            state: item.profile_status,
                            target: {}
                        }, group.add());
                    });
                });

                group.finish();
            },

            function(resuts, callback) {
                app.mysql.query("SELECT * FROM k_profile_targeting", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                var group = async.group(callback);

                app.mongo.collection("profile", function(err, profile) {
                    if (err) {
                        group.error(err);
                        return;
                    }
                    
                    results.forEach(function(item) {
                        var update = {}, targeting;

                        switch (item.target_id) {
                            case 1: targeting = "date"; break;
                            case 2: targeting = "weekday"; break;
                            case 3: targeting = "daytime"; break;
                            case 4: targeting = "geo"; break;
                            case 5: targeting = "ip"; break;
                            case 6: targeting = "useragent"; break;
                            case 7: targeting = "category"; break;
                            case 8: targeting = "placenet"; break;
                            case 9: targeting = "site"; break;
                        }

                        update["target." + targeting + ".on"] = (item.target_status == "active");
                        update["target." + targeting + ".invert"] = false;
                        update["target." + targeting + ".ruleset_id"] = item.set_id;

                        profile.update({id: item.profile_id}, {$set: update}, group.add());
                    });
                });

                group.finish();
            }
        ], callback);
    });
};