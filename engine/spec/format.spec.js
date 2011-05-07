var init = require("./_init")
  , Format = require("core/format")
;

describe('format', function() {
    it('should вернуть пустой массив, если в формате нет флайтов', function() {
        Format.Create({id: 1}, function(err, format) {
            var flights = format.getFlights();
            expect(flights.constructor).toEqual(Array);
            expect(flights.length).toEqual(0);
        });
    });

    it('should вернуть копию массива флайтов', function() {
        var flight = {id: 1, deleted: false};

        Format.Create({id: 1}, function(err, format) {
            format.addFlight(flight);

            // --
            var flights = format.getFlights();
            expect(flights.constructor).toBe(Array);
            expect(flights.length).toEqual(1);

            // --
            var flights_again = format.getFlights();
            flights.pop();

            expect(flights.length).toEqual(0);
            expect(flights_again.length).toEqual(1);
        });
    });

    it('should вернуть только не удаленные флайты', function() {
        var flight1 = {id: 1, deleted: false};
        var flight2 = {id: 2, deleted: false};

        Format.Create({id: 1}, function(err, format) {
            format.addFlight(flight1);
            format.addFlight(flight2);

            flight2.deleted = true;

            // --
            var flights = format.getFlights();
            expect(flights.length).toEqual(1);
        });
    });
});