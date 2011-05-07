var boot = require("../../boot")
  , async = require("async")
;

async.parallel([
    require("./format")
  , require("./network")
  , require("./category")
  , require("./site")
  , require("./site_page")
  , require("./site_place")
  , require("./campaign")
  , require("./flight")
  , require("./creative")
  , require("./profile")
  , require("./banner")
  , require("./template")
        
], function(err) {
    err && console.log(err.stack);

    boot.stop();
});

