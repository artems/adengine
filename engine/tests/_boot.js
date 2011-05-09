require.paths.unshift(__dirname + '/../modules');

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
            var mongo = new MongoDB(
                config.mongo.name
              , new MongoServer(config.mongo.host, config.mongo.port)
              // , {native_parser:true}
            );
            
            var client = new MySQLClient();
            client.user     = config.mysql.user;
            client.password = config.mysql.pass;
            client.host     = config.mysql.host;
            client.database = config.mysql.name;
            client.connect();

            app = {};
            app.mongo = mongo;
            app.mysql = client;
            app.registry = {};
            
            mongo.open(function(err) {
                callback(err, app);
            });
        }
    },

    stop : function(callback) {
        app.mysql && app.mysql.end();
        app.mongo && app.mongo.close();

        callback && callback();
    }
};

module.exports = boot;