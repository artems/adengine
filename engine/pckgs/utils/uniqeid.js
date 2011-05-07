var bson = require("mongodb").BSONPure;

module.exports.uniqeid = function() {
    return bson.ObjectID.createPk().toString();
};