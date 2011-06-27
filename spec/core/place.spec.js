var init = require("../_init")
  , Place = require("core/place");

describe('Place', function() {
    describe('constructor', function() {
        it('should вернуть исключение, когда создан без параметров', function() {
            Place.Create({}, function(err, place) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id', function() {
            Place.Create({id: 1}, function(err, place) {
                expect(place).toBeTruthy();

                expect(place.getId()).toEqual(1);
            });
        });
    });
});