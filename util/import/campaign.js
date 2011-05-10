var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("campaign", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT * FROM k_campaign", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("campaign", function(err, campaign) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        campaign.insert({
                            id: item.campaign_id,
                            account_id: item.account_id,
                            client_id: item.client_id,
                            product_id: item.product_id,
                            project_id: item.project_id,
                            name: item.campaign_title,
                            state: item.campaign_status,
                            limit: {
                                click: item.u_clk_limit,
                                exposure: item.u_exp_limit
                            }
                        }, group.add());
                    });
                });

                group.finish();
            }
        ], callback);
    });
};