var url     = require("url")
  , async   = require("async")
  , Boot    = require("./_boot")
  , Request = require("action/request")
  , Dummy   = require("core/dummy");

Boot.run(function(err, app) {
    console.time('request');

    app.config = {
        cookie : {
            name: "uid"
        }
    };
    app.registry = {
        place : {
            5 : {}
        }
    };

    var req = {};
    req.url     = "http://localhost:8080/exp?lid=5";
    req.now     = Dummy.now();
    req.cookies = {uid: 1};
    req.headers = {'user-agent': ''};
    req.session = {};
    req.socket  = {remoteAddress: '8.8.8.8'};
    
    var url_parsed = url.parse(req.url, true);
    
    req.query   = url_parsed.query;

    async.parallel([
        function(callback) {
            Request.getUid(app, req, callback);
        }
      , function(callback) {
            Request.getClient(app, req, callback);
        }
      , function(callback) {
            Request.findPlace(app, req, callback);
        }
    ], function(err) {
        if (err) {
            console.log(err.message);
        }

        console.timeEnd('request');
        Boot.stop();
    });
});


