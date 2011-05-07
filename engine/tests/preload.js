var boot = require("./_boot")
  , preload = require("action/preload");
  
  
boot.run(function(err, app) {
    p = new preload(app);

    p.execute(function() {
        console.log("done");
        boot.stop();
    })    
})  


