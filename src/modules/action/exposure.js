var url   = require("url")
  , async = require("async")
  , util2        = require("core/util")
  , Request      = require("action/request")
  , FindBanner   = require("action/find_banner")
  , ErrorHandler = require("action/error")
;

function Unit(app, req, res) {
    async.waterfall([
        function(callback) {
            initRequest(app, req, callback);
        },

        function(callback) {
            findBanner(req, callback);
        },

        function(callback) {
            showBanner(req, res, callback)
        }
    ], function(err) {
        ErrorHandler.errorHanlder(app, req, res, err);
    });
}


function initRequest(app, req, callback) {
    var url_parsed = url.parse(req.url, true)

    req.now     = util2.now();
    req.query   = url_parsed.query;
    req.session = {};

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
    ], function(err, results) {
        callback(err);
    });
}

function findBanner(req, callback) {
    var uid = req.session.uid
      , place = req.session.place
      , client = req.session.client
      , find_action = new FindBanner();

    find_action.execute(uid, client, place, function(err, banner) {
        if (err && err.message.substr(0, 8) == "ENG-0005") {
            getSitePlug(req, callback);
        } else {
            req.session.banner = banner;
            
            callback(err);
        }
    });
}

function getSitePlug(req, callback) {
    var place     = req.session.place
      , format    = place.getFormat()
      , format_id = format && format.getId()
      , page      = place.getPage()
      , site      = page && page.getSite();

    if (!format_id || !site) {
        callback(new Error("ENG-0001"));
        return;
    }

    var banner = site.getRandomPlug(format_id);

    if (!banner) {
        callback(new Error("ENG-0010"));        
    } else {
        req.session.banner = banner;

        callback();
    }
}

function showBanner(req, res, callback) {
    var banner = req.session.banner
      , code   = banner.getCode(req.session.place);

    res.write(code);

    callback();
}

module.exports = Unit;