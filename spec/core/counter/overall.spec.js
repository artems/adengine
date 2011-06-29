var init = require("../../_init")
  , OverallCounter = require("core/counter/overall");

describe('OverallCounter', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {object_name: 'flight', object_id: 1, event: 1};
        }

        function getRequiredParamsWithout(key) {
            var params = getRequiredParams();
            delete params[key];

            return params;
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            var redis = {};

            OverallCounter.Create({}, redis, function(err, counter) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать параметры при создании: object_name, object_id, event', function() {
            var redis = {}
              , params = getRequiredParams();

            OverallCounter.Create(params, redis, function(err, counter) {
                expect(counter).toBeTruthy();

                expect(counter.getEvent()).toEqual(1);
                expect(counter.getObjectId()).toEqual(1);
                expect(counter.getObjectName()).toEqual('flight');
            });
        });

        it('should вернуть исключение, если отсутсвует object_id', function() {
            OverallCounter.Create(getRequiredParamsWithout('object_id'), {}, function(err, counter) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует object_name', function() {
            OverallCounter.Create(getRequiredParamsWithout('object_id'), {}, function(err, counter) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если event < 0', function() {
            var params = getRequiredParams();
            params.event = -1;
            
            OverallCounter.Create(params, {}, function(err, counter) {
                expect(err).toBeTruthy();
            });
        });

        // особенность реализации, а не требование
        it('should событие 0 заменяеть на событие 1', function() {
            var params = getRequiredParams();
            params.event = 0;

            OverallCounter.Create(params, {}, function(err, counter) {
                expect(counter.getEvent(), 1);
            });
        });
    });


    function getCounter(callback) {
        var redis = {
            incr: function(key, callback) {
                callback(null, 1);
            },
            expire : function(key, seconds, callback) {
                callback();
            }
        };
        
        var params = {object_name: 'flight', object_id: 1, event: 1};

        OverallCounter.Create(params, redis, callback);
    }

    it('should иметь возможность увечивать счетчик', function() {
        getCounter(function(err, counter) {
            counter.incr(function(err, count) {
                expect(count).toBeTruthy();
            });
        });
    });

    it('should иметь возможность сбрасывать дельту', function() {
        getCounter(function(err, counter) {
            counter.incr(function(err, count) {
                counter.incr(function(err, count) {
                    var delta = counter.getCountAndReset();
                    expect(delta).toEqual(2);

                    counter.incr(function(err, count) {
                        var delta = counter.getCountAndReset();
                        expect(delta).toEqual(1);

                        var delta = counter.getCountAndReset();
                        expect(delta).toEqual(0);
                    });
                });
            });
        });
    });
});