var boot = require("./boot"),
    async = require("async"),
    connect = require('connect');

var PreloadAction  = require("action/preload");
var ExposureAction = require("action/exposure");

var _app   = null;
var server = connect(
    connect.bodyParser()
  , connect.cookieParser()
  // , connect.static(__dirname + "/public")
  , connect.router(function(router) {
        router.get('/', function(req, res) {
            res.end("/");
        });
        
        router.get('/exp', function(req, res) {
            ExposureAction(_app, req, res);
        });
    })
);

async.waterfall([
    function(callback) {
        boot.run(callback);
    },
    function(app, callback) {
        _app = app;
        
        app.preload = new PreloadAction(app);
        app.preload.execute(callback);
    }
], function(err) {
    if (err) {
        console.log("Something wrong: " + err.message);
        process.exit(1);
    }

    console.log('start listen');
});

module.exports = server;