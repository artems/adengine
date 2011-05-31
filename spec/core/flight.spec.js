var init = require("../_init")
  , Flight = require("core/flight");

describe('Flight', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {id: 1, priority: 5, balance: 1.0, distribution: 'flat', is_plug: false};
        }

        function getRequiredParamsWithout(key) {
            var params = getRequiredParams();
            delete params[key];

            return params;
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            Flight.Create({}, function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id, priority, balance, distribution', function() {
            var params = getRequiredParams();

            Flight.Create(params, function(err, flight) {
                expect(flight).toBeTruthy();

                expect(flight.getId()).toEqual(1);
                expect(flight.getPriority()).toEqual(5);
                expect(flight.getBalance()).toEqual(1.0);
                expect(flight.getDistribution()).toEqual('flat');
            });
        });

        it('should принимать не обязательые параметры: begin, end', function() {
            var params   = getRequiredParams();
            params.begin = new Date(2000, 12, 31);
            params.end   = new Date(2020, 12, 31);

            Flight.Create(params, function(err, flight) {
                expect(flight).toBeTruthy();

                expect(flight.getBegin()).toEqual(params.begin);
                expect(flight.getEnd()).toEqual(params.end);
            });
        });

        it('should вернуть исключение, если отсутсвует id', function() {
            Flight.Create(getRequiredParamsWithout('id'), function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует priority', function() {
            Flight.Create(getRequiredParamsWithout('priority'), function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует balance', function() {
            Flight.Create(getRequiredParamsWithout('balance'), function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует distribution', function() {
            Flight.Create(getRequiredParamsWithout('distribution'), function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если priority не лижит в диапазоне от 0 до 99', function() {
            var params = getRequiredParams();

            params.priority = -1;
            Flight.Create(params, function(err, flight) {
                expect(err).toBeTruthy();
            });

            params.priority = 150;
            Flight.Create(params, function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если balance меньше 0', function() {
            var params = getRequiredParams();

            params.balance = 0.0;
            Flight.Create(params, function(err, flight) {
                expect(err).toBeFalsy();
            });

            params.balance = -100;
            Flight.Create(params, function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если distribution не равен max или flat', function() {
            var params = getRequiredParams();

            params.distribution = 'max';
            Flight.Create(params, function(err, flight) {
                expect(err).toBeFalsy();
            });

            params.distribution = 'flat';
            Flight.Create(params, function(err, flight) {
                expect(err).toBeFalsy();
            });

            params.distribution = 'manual';
            Flight.Create(params, function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если begin и end переданы по отдельности', function() {
            var params;
            
            params = getRequiredParams();
            params.begin = new Date(2010, 12, 31);
            Flight.Create(params, function(err, flight) {
                expect(err).toBeTruthy();
            });

            params = getRequiredParams();
            params.end = new Date(2020, 12, 31);
            Flight.Create(params, function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если begin в будущем', function() {
            var params = getRequiredParams();
            
            params.begin = new Date(2020, 12, 31);
            params.end   = new Date(2021, 12, 31);
            Flight.Create(params, function(err, flight) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если end уже в прошлом', function() {
            var params = getRequiredParams();

            params.begin = new Date(1990, 12, 31);
            params.end   = new Date(1991, 12, 31);
            Flight.Create(params, function(err, flight) {
                expect(err).toBeTruthy();
            });
        });
    });

    function getFlight(callback) {
        var params = {id: 1, priority: 5, balance: 1.0, distribution: 'flat', is_plug: false};

        Flight.Create(params, callback);
    }

    it('can хранить сценарии', function() {
        getFlight(function(err, flight) {
            flight.addProfile({});

            expect(flight.getProfiles().length).toEqual(1);
        })
    });

    it('should возращать копию списка сценариев', function() {
        getFlight(function(err, flight) {
            flight.addProfile({});
            flight.addProfile({});

            var list = flight.getProfiles();
            list.pop();

            expect(list.length).toEqual(1);
            expect(flight.getProfiles().length).toEqual(2);
        })
    });

    describe('canRotate', function() {
        it('should должен откручаваться по умолчанию', function() {
            getFlight(function(err, flight) {
                flight.canRotate(function(err, result) {
                    expect(result).toBeTruthy();
                });
            });
        });

        it('should не должен откручаваться, если balance меньше 0', function() {
            getFlight(function(err, flight) {
                flight.setBalance(-0.1);
                flight.canRotate(function(err, result) {
                    expect(result).toBeFalsy();
                });
            });
        });

        it('should не должен откручаваться, если end в прошлом', function() {
            getFlight(function(err, flight) {
                flight.setEnd(new Date(2010, 12, 31));
                
                flight.canRotate(function(err, result) {
                    expect(result).toBeFalsy();
                });
            });
        });
    });
});