var init = require("../_init")
  , Network = require("core/network");

describe('Network', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {id: 1, group: 'light'};
        }

        function getRequiredParamsWithout(key) {
            var params = getRequiredParams();
            delete params[key];

            return params;
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            Network.Create({}, function(err, network) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id, uid', function() {
            var params = getRequiredParams();

            Network.Create(params, function(err, network) {
                expect(network).toBeTruthy();

                expect(network.getId()).toEqual(1);
                expect(network.getGroup()).toEqual("light");
            });
        });

        it('should вернуть исключение, если отсутсвует id', function() {
            Network.Create(getRequiredParamsWithout('id'), function(err, network) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует group', function() {
            Network.Create(getRequiredParamsWithout('group'), function(err, network) {
                expect(err).toBeTruthy();
            });
        });
    });

    function getNetwork(callback) {
        var params = {id: 1, group: 'light'};

        Network.Create(params, callback);
    }

    it('should вернуть копию списка флайтов', function() {
        getNetwork(function(err, network) {
            network.addFlight({});
            network.addFlight({});

            var list = network.getFlights();
            list.pop();

            expect(list.length).toEqual(1);
            expect(network.getFlights().length).toEqual(2);
        });
    });
});