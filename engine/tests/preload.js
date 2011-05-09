var Boot = require("./_boot")
  , Preload = require("action/preload");

Boot.run(function(err, app) {
    var action = new Preload(app);
    
    console.time('preload');
    
    action.execute(function(err) {
        if (err) {
            console.log(err.message);
        }
        
        console.timeEnd('preload');
        Boot.stop();
    })    
})  


