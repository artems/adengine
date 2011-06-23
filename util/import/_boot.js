require.paths.unshift(__dirname + '/../../src/modules');

var config = require("./_config");

var MongoDB = require('mongodb').Db
  , MongoServer = require('mongodb').Server
  , MySQLClient = require('mysql').Client
;

var app = null;

var boot = {
    run : function(callback) {
        if (app !== null) {
            callback(null, app);
        } else {
            var mongo = new MongoDB(config.mongo.name, new MongoServer(config.mongo.host, config.mongo.port));
            mongo.open(function(err) {
                callback(err, app);
            });

            var client = new MySQLClient();
            client.user     = config.mysql.user;
            client.password = config.mysql.pass;
            client.host     = config.mysql.host;
            client.database = config.mysql.name;
            client.connect();

            app = {};
            app.registry = {};
            app.config = config;
            app.mongo = mongo;
            app.mysql = client;
        }
    },

    stop : function(callback) {
        app.mysql && app.mysql.end();
        app.mongo && app.mongo.close();

        callback && callback();
    }
};

module.exports = boot;