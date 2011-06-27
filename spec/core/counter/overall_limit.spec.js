var init = require("../../_init")
  , OverallLimitCounter = require("core/counter/overall_limit");

describe('OverallLimitCounter', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {object_name: 'flight', object_id: 1, event: 1, limit_day: 0, limit_all: 0};
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            var redis = {};
            
            OverallLimitCounter.Create({}, redis, function(err, counter) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать параметры: limit_day, limit_all, один или оба параметра должны быть > 0', function() {
            var redis = {}
              , params = getRequiredParams();

            params.limit_day = 0;
            params.limit_all = 0;
            OverallLimitCounter.Create(params, redis, function(err, counter) {
                expect(counter).toBeFalsy();
            });

            params.limit_day = 1;
            params.limit_all = 0;

            OverallLimitCounter.Create(params, redis, function(err, counter) {
                expect(counter).toBeTruthy();
            });

            params.limit_day = 0;
            params.limit_all = 1;
            OverallLimitCounter.Create(params, redis, function(err, counter) {
                expect(counter).toBeTruthy();
            });

            params.limit_day = 1;
            params.limit_all = 1;
            OverallLimitCounter.Create(params, redis, function(err, counter) {
                expect(counter).toBeTruthy();
            });
        });
    });

    function getCounter(callback, limit_day, limit_all) {
        var count = {};
        
        var redis = {
            incr: function(key, callback) {
                if (!count[key])
                    count[key] = 0;
                callback(null, ++count[key]);
            },
            
            decr : function(key, callback) {
                if (!count[key])
                    count[key] = 0;
                callback(null, --count[key]);
            }
        };

        var params = {
            object_name: 'flight', object_id: 1, event: 1, limit_day: limit_day || 1, limit_all: limit_all || 1
        };

        OverallLimitCounter.Create(params, redis, callback);
    }

    it('should иметь возможность увечивать счетчик', function() {
        getCounter(function(err, counter) {
            counter.incr(function(err, count) {
                expect(count).toBeTruthy();
            });
        });
    });

    it('should не увеличивать счетчик, если сработало ограничение в день', function() {
        getCounter(function(err, counter) {
            counter.incr(function(err, count) {
                expect(count).toBeTruthy();

                counter.incr(function(err, count) {
                    expect(count).toBeFalsy();
                });
            });
        }, 1, 0);
    });

    it('should не увеличивать счетчик, если сработало ограничение всего', function() {
        getCounter(function(err, counter) {
            counter.incr(function(err, count) {
                expect(count).toBeTruthy();

                counter.incr(function(err, count) {
                    expect(count).toBeFalsy();
                });
            });
        }, 0, 1);
    });
});