var Unit = {};

Unit.now = function() {
    return new Date();
};

Unit.today = function() {
    var now = Unit.now();

    return (new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 1000
};

Unit.interval = function(interval) {
    return interval;
};

module.exports = Unit;
