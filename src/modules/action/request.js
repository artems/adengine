var async   = require("async")
  , ip2long = require("utils/network").ip2long
;

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
    var mongo  = app.mongo
      , client = {
        ip        : ip2long((req.socket && req.socket.remoteAddress) || "127.0.0.1"),
        useragent : req.headers['user-agent'] || "",
        region    : {
            city_id    : 0
          , region_id  : 0
          , country_id : 0
        }
    };

    async.waterfall([
        function(callback) {
            mongo.collection("geo_ip", callback);
        },

        function(geo_ip, callback) {
            geo_ip.findOne({begin: {$lt: client.ip}, end: {$gt: client.ip}}, callback);
        },

        function(geo_ip, callback) {
            if (geo_ip) {
                client.region.city_id    = geo_ip.city_id;
                client.region.region_id  = geo_ip.region_id;
                client.region.country_id = geo_ip.country_id;
            }

            req.session.client = client;

            callback();
        }
    ], callback);
};

Unit.findPlace = function(app, req, callback) {
    var registry  = app.registry
      , site_id   = parseInt(req.query.sid) || 0
      , page_id   = parseInt(req.query.pid) || 0
      , place_id  = parseInt(req.query.lid) || 0
      , format_id = parseInt(req.query.fid) || 0
      ;

    // TODO проверить preg для сайта и раздела

    if (place_id > 0) {
        Unit._findPlaceByPlaceId(registry, req, place_id, callback);
    } else if (page_id > 0 && format_id > 0) {
        Unit._findPlaceByPageIdAndFormatId(registry, req, page_id, format_id, callback);
    } else if (site_id > 0 && format_id > 0) {
        Unit._findPlaceBySiteIdAndFormatId(registry, req, site_id, format_id, callback);
    } else {
        callback(new Error("ENG-0001"));
    }
};

Unit._findPlaceByPlaceId = function(registry, req, place_id, callback) {
    var place = registry.place[place_id];

    if (!place) {
        callback(new Error("ENG-0002"));
        return;
    }   

    req.session.place = place;

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

    callback();
};

module.exports = Unit;

