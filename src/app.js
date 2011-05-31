var boot = require("./boot"),
    async = require("async"),
    connect = require('connect')

  , Preload  = require("action/preload")
  , Counter  = require("action/counter")
  , Exposure = require("action/exposure");

var _app   = null;
var server = connect(
    connect.cookieParser()
  , connect.static(__dirname + "/../public")
  , connect.router(function(router) {
        router.get('/', function(req, res) {
            res.end("/");
        });
        
        router.get('/exp', function(req, res) {
            Exposure(_app, req, res);
        });
    })
);

async.waterfall([
    function(callback) {
        boot.run(callback);
    },

    function(app, callback) {
        _app = app;

        _app.preload = new Preload(_app);
        _app.counter = new Counter(_app);
        callback();
    },

    function(callback) {        
        _app.preload.execute(callback);
    },

    function(callback) {        
        _app.counter.execute(callback);
    }

], function(err) {
    if (err) {
        console.log("Error: " + err.message);
        process.exit(1);
    }

    console.log('start listen');
});

module.exports = server;