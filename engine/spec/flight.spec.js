var init = require("./_init")
  , Flight = require("core/flight");

describe('flight', function() {
    it('should вернуть исключение, когда создан без параметров', function() {
        Flight.Create({}, function(err, flight) {
            expect(err).toBeTruthy();
            expect(flight).toBeFalsy();
        });
    });

    it('should вернуть исключение, когда не переданы все обязательные параметры', function() {
        var params = {id:1, priority: 5, distribution: 'max', balance: 0.1, begin: new Date(2000, 0, 1), end: new Date(2099, 11, 31)};
        var params_no_id = clone_without('id', params);
        var params_no_priority = clone_without('priority', params);
        var params_no_distribution = clone_without('distribution', params);
        var params_no_begin = clone_without('begin', params);
        var params_no_end   = clone_without('end', params);

        Flight.Create(params, function(err, unit) { expect(unit).toBeTruthy();});

        // required
        Flight.Create(params_no_id, function(err, unit) { expect(err).toBeTruthy();});
        Flight.Create(params_no_priority, function(err, unit) { expect(err).toBeTruthy();});
        Flight.Create(params_no_distribution, function(err, unit) { expect(err).toBeTruthy();});

        // optional
        Flight.Create(params_no_begin, function(err, unit) { expect(err).toBeFalsy();});
        Flight.Create(params_no_end, function(err, unit) { expect(err).toBeFalsy();});        
    });

    it('should принимать в конструкторе параметры id, priority, distribution, balance, begin, end', function() {
        var params = {id:1, priority: 5, distribution: 'max', balance: 0.1, begin: new Date(2000, 0, 1), end: new Date(2099, 11, 31)};
        Flight.Create(params, function(err, flight) {
            expect(err).toBeFalsy();
            expect(flight).toBeTruthy();
        });
    });
    
    it('should не проходить проверку, когда время начала еще не наступило', function() {
        var params = {id:1, priority: 5, distribution: 'max', balance: 0.1};
        Flight.Create(params, function(err, flight) {
            flight.setBegin(new Date('Tue, 31 Dec 2019 00:00:00 GMT'));
            flight.verify(function(err, result) {
                expect(result).toBeFalsy();
            });
        });
    });

    it('should не проходить проверку, когда время окончания уже прошло', function() {
        var params = {id:1, priority: 5, distribution: 'max', balance: 0.1};
        Flight.Create(params, function(err, flight) {
            flight.setEnd(new Date('Fri, 01 Jan 1999 00:00:00 GMT'));
            flight.verify(function(err, result) {
                expect(result).toBeFalsy();
            });
        });
    });    
});

function clone_without(to_delete, params) {
    var new_params = {};
    for (i in params) {
        if (i != to_delete) {
            new_params[i] = params[i];
        }
    }

    return new_params;
}
