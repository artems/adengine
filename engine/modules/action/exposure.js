var url   = require("url")
  , async = require("async")
  , Dummy       = require("core/dummy")
  , InitRequest = require("action/init_request")
  , FindBanner  = require("action/find_banner")
  , Error       = require("action/error")
;

function Unit(app, req, res) {
    async.waterfall([
        function(callback) {
            var url_parsed = url.parse(req.url, true)

            req.now     = Dummy.now();
            req.query   = url_parsed.query;
            req.session = {};

            async.parallel([
                function(callback) {
                    InitRequest.getUid(app, req, callback);
                }
              , function(callback) {
                    InitRequest.getClient(app, req, callback);
                }
              , function(callback) {
                    InitRequest.findPlace(app, req, callback);
                }
            ], function(err, results) {
                callback(err);
            });
        },

        function(callback) {
            var place = req.session.place
              , find_action = new FindBanner();

            find_action.execute(place, callback);
        },

        function(banner, callback) {
            // show banner
            callback();
        }
    ], function(err) {
        Error.errorHanlder(app, req, res, err);
    });
};

module.exports = Unit;