var fs = require("fs")
  , boot = require("../../boot")
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
                app.mongo.collection("template", callback);
            },

            function(coll, callback) {
                coll.insertAll([
                    {
                        id: 1, format_id: 4, size: 1, is_plug: false, name: "Simple 240x400"
                      , body: fs.readFileSync(__dirname + "/template/240x400.js").toString()
                      , params: {
                            'getURL' : {'type': 'file', 'name': 'Файл SWF', 'default': null, 'require': true}
                          , 'imageURL' : {'type': 'file', 'name': 'Файл SWF', 'default': null, 'require': true}
                          , 'trackingURL' : {'type': 'string', 'name': 'Трекинговый пиксель', 'default': null, 'require': false}
                          , 'backgroundColor': {'type': 'string', 'name': 'Цвет подложки', 'default': '#ffffff', 'require': true}
                          , 'flash_ver': {'type': 'string', 'name': 'Мин. версия флеша', 'default': '6', 'require': false}
                          , 'event1': {'type': 'string', 'name': '', 'default': null, 'require': false}
                          , 'user1': {'type': 'int', 'name': 'Брендированный', 'default': 0, 'require': false}
                        }
                    }
                  , {id: 2, format_id: 4, size: 1, is_plug: true, name: "Plug for 240x400", body: '%code%'}
                ], callback);
            }
        ], callback)
    });
};