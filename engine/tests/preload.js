var boot = require("./_boot")
  , preload = require("action/preload");
  
  
boot.run(function(err, app) {
    p = new preload(app);

    p.execute(function(err) {
        if (err) {
            console.log(err.message);
        }
        console.log("done");
        boot.stop();
    })    
})  


