var async   = require("async")
  , ip2long = require("utils/network").ip2long
;
// var GeoIp = require("geoip");

function Unit() {
    
}

Unit.getUid = function(app, req, callback) {
    var cookie  = app.config.cookie.name
      , user_id = req.cookies && req.cookies[cookie] || 0;

    if (user_id == 0) {
        var is_cookie_set = parseInt(req.query.cset) || 0;
        if (!is_cookie_set) {
            callback(new Error("ENG-0003"));
        } else {
            callback(new Error("ENG-0004"));
        }
    } else {
        req.session.uid = user_id;

        callback();
    }
};

Unit.getClient = function(app, req, callback) {
    var geoip  = app.geoip
      , client = {
        ip         : ip2long((req.socket && req.socket.remoteAddress) || "127.0.0.1"),
        user_agent : req.headers['user-agent'] || "",
        region     : {
            city_id    : 0
          , region_id  : 0
          , country_id : 0
        }
    };

    //client.geo = geoip.lookupSync(client.ip);

    req.session.client = client;

    callback();
};

Unit.findPlace = function(app, req, callback) {
    var registry  = app.registry
      , site_id   = parseInt(req.query.sid) || 0
      , page_id   = parseInt(req.query.pid) || 0
      , place_id  = parseInt(req.query.lid) || 0
      , format_id = parseInt(req.query.fid) || 0
      , check_referer = app.config.security.check_referer
      ;

    // TODO проверить preg раздела

    async.series([
        function(callback) {
            if (place_id > 0) {
                Unit._findPlaceByPlaceId(registry, req, place_id, callback);
            } else if (page_id > 0 && format_id > 0) {
                Unit._findPlaceByPageIdAndFormatId(registry, req, page_id, format_id, callback);
            } else if (site_id > 0 && format_id > 0) {
                Unit._findPlaceBySiteIdAndFormatId(registry, req, site_id, format_id, callback);
            } else {
                callback(new Error("ENG-0001"));
            }
        },

        function(callback) {
            var site = req.session.site
              , preg = site.getPreg()
              , url  = req.headers['referer'];

            if (check_referer && !preg.test(url)) {
                callback(new Error("ENG-0011"));
            } else {
                callback();
            }
        }
    ], callback);
    
};

Unit._findPlaceByPlaceId = function(registry, req, place_id, callback) {
    var place = registry.place[place_id];

    if (!place) {
        callback(new Error("ENG-0002"));
        return;
    }

    var page = place.getPage()
      , site = page && page.getSite();

    req.session.place = place;
    req.session.page  = page;
    req.session.site  = site;

    callback();
};

Unit._findPlaceByPageIdAndFormatId = function(registry, req, page_id, format_id, callback) {
    var page = registry.page[page_id];

    if (!page) {
        callback(new Error("ENG-0002"));
        return;
    }

    var place = page.getPlaceByFormatId(format_id);

    if (!place) {
        callback(new Error("ENG-0002"));
        return;
    }
        
    req.session.place = place;
    req.session.page  = page;
    req.session.site  = page.getSite();

    callback();
};

Unit._findPlaceBySiteIdAndFormatId = function(registry, req, site_id, format_id, callback) {
    var site = registry.site[site_id];

    if (!site) {
        callback(new Error("ENG-0002"));
        return;
    }

    var page = site.getDefaultPage();

    if (!page) {
        callback(new Error("ENG-0002"));
        return;
    }

    var place = page.getPlaceByFormatId(format_id);

    if (!place) {
        callback(new Error("ENG-0002"));
        return;
    }

    req.session.place = place;
    req.session.page  = page;
    req.session.site  = site;

    callback();
};

module.exports = Unit;

