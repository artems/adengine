var MongoDB = require('mongodb').Db
  , MongoServer = require('mongodb').Server;

var fs = require("fs");

var mongo = new MongoDB("aden", new MongoServer("127.0.0.1", 27017));

mongo.open(function(err) {
    mongo.collection("template", function(err, coll) {
        var param = {};
        param["body"] = fs.readFileSync('./tpl/7.js').toString();
        coll.update({id: 7}, {$set: param}, function(err) {
            mongo.close();
        });
    })
});