require.paths.unshift(__dirname + '/modules');

var async  = require("async")
  , config = require("./config")

  , Redis       = require("redis")
  , MongoDB     = require('mongodb').Db
  , MongoServer = require('mongodb').Server;

var app = null;

var boot = {
    run : function(callback) {
        if (app !== null) {
            callback(null, app);
        } else {
            this._init(callback);
        }
    },

    stop : function(callback) {
        app.mongo && app.mongo.close(callback);
        app.redis && app.redis.quit();
    },

    _init : function(callback) {
        app = {};        
        app.config = config;
        app.registry = {};

        async.parallel([
            this._connMongo,
            this._connRedis,
        ], function(err) {
            callback(err, app);
        });
    },

    _connMongo : function(callback) {
        app.mongo = new MongoDB(config.mongo.name, new MongoServer(config.mongo.host, config.mongo.port));
        app.mongo.open(callback);
    },

    _connRedis : function(callback) {
        app.redis = Redis.createClient(config.redis.port, config.redis.host);

        callback();
    }
};

module.exports = boot;