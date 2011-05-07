var boot = require("./_boot")
  , async = require("async")
;

var mode   = ['all', 'basic']
var object = ['format', 'template', 'network', 'category', 'site', 'site_page', 'site_place', 'site_plug',  'campaign', 'flight', 'profile', 'creative', 'banner', 'geo_ip'];

var target = process.argv.pop();

if (object.indexOf(target) == -1) {
    target = '';
}

if (target) {
    require("./" + target + ".js")(function(err) {
        err && console.log(err.stack);
        boot.stop();
    });
}

/*
async.parallel([
//    require("./format")
//  , require("./template")
//  , require("./network")
//  , require("./category")
//  , require("./site")
//  , require("./site_page")
//  , require("./site_place")
//  , require("./campaign")
//  , require("./flight")
//  , require("./profile")
//  , require("./creative")
//  , require("./banner")
//  , require("./geo_ip")
], function(err) {    
    err && console.log(err.stack);

    boot.stop();
});
*/
