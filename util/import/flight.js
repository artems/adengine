var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("flight", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT * FROM k_flight", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("flight", function(err, flight) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        flight.insert({
                            id: item.flight_id,
                            campaign_id: item.campaign_id,
                            account_id: item.account_id,
                            user_id: item.user_id,
                            network_id: item.net_id,
                            priority:  item.flight_priority,
                            balance: item.flight_balance,
                            spent: item.flight_spent,
                            budget: item.flight_budget,
                            buyout: {"adv": "cpc", "pub": "cpm"},
                            distribution: item.flight_distribution,
                            begin: item.flight_dstart || new Date(1970, 1, 1),
                            end: item.flight_dfinish || new Date(2099, 12, 31),
                            is_plug: (item.flight_isplug == 1),
                            state: item.flight_status,
                            comment : item.flight_comment,
                            limit: {}
                        }, group.add());
                    });
                });

                group.finish();
            },

            function(results, callback) {
                app.mysql.query("SELECT * FROM k_flight_limit", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("flight", function(err, flight) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        var id     = item.flight_id;
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
                            flight.update({"id": id},  {$set: update}, group.add());
                        }
                    });
                });

                group.finish();
            }
        ], callback);
    });
};