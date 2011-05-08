var boot = require("./_boot")
  , async = require("async")
;

module.exports = function(callback) {
    boot.run(function(err, app) {
        async.waterfall([
            function(callback) {
                app.mongo.dropCollection("template", function() {
                    callback();
                });
            },

            function(callback) {
                app.mysql.query("SELECT * FROM k_banner_template", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("template", function(err, template) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {                    
                        template.insert({
                            id: item.template_id
                          , format_id: item.type_id
                          , name: item.template_title
                          , size: item.template_size
                          , is_plug: (item.template_status == "plug") ? true : false
                          , body: item.template_javascript || ""
                          , params: {}
                        }, group.add());
                    });
                });

                group.finish();
            },

            function(results, callback) {                
                app.mysql.query("SELECT * FROM k_template_param_user", callback);
            },

            function(results, fields, callback) {
                var group = async.group(callback);

                app.mongo.collection("template", function(err, template) {
                    if (err) {
                        group.error(err);
                        return;
                    }

                    results.forEach(function(item) {
                        var param = {}, name = 'params.' + item.uparam_name;
                        param[name] = {
                            'type': item.uparam_type,
                            'name': item.uparam_title,
                            'default': item.uparam_default,
                            'require': (item.uparam_isrequire == 1)
                        };

                        template.update({id: item.template_id}, {$set: param}, group.add());
                    });
                });

                group.finish();
            }
        ], callback);
    });
};