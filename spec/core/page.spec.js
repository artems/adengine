var init = require("../_init")
  , Page = require("core/page");

describe('Page', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {id: 1, preg: [/.*/], category: [1, 2]};
        }

        function getRequiredParamsWithout(key) {
            var params = getRequiredParams();
            delete params[key];

            return params;
        }
        
        it('should вернуть исключение, когда создан без параметров', function() {
            Page.Create({}, function(err, page) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id, preg, category', function() {
            var params = getRequiredParams();

            Page.Create(params, function(err, page) {
                expect(page).toBeTruthy();

                expect(page.getId()).toEqual(1);
                expect(page.getPreg()[0].toString()).toEqual('/.*/');
                expect(page.getCategory()[0]).toEqual(1);
            });
        });

        it('should вернуть исключение, если отсутсвует id', function() {
            Page.Create(getRequiredParamsWithout('id'), function(err, page) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует preg', function() {
            Page.Create(getRequiredParamsWithout('preg'), function(err, page) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует url', function() {
            Page.Create(getRequiredParamsWithout('category'), function(err, page) {
                expect(err).toBeTruthy();
            });
        });
    });
});