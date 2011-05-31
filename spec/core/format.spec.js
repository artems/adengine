var init = require("../_init")
  , Format = require("core/format");

describe('Format', function() {
    describe('constructor', function() {
        it('should вернуть исключение, когда создан без параметров', function() {
            Format.Create({}, function(err, format) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id', function() {
            Format.Create({id: 1}, function(err, format) {
                expect(format).toBeTruthy();

                expect(format.getId()).toEqual(1);
            });
        });
    });

    function getFormat(callback) {
        Format.Create({id: 1}, callback);
    }
});