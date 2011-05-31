var init = require("../_init")
  , Banner = require("core/banner");

describe('Banner', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {id: 1, priority: 5, distribution: 'flat', url: 'http://localhost/'};
        }

        function getRequiredParamsWithout(key) {
            var params = getRequiredParams();
            delete params[key];

            return params;
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            Banner.Create({}, function(err, banner) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id, priority, distribution, url', function() {
            var params = getRequiredParams();

            Banner.Create(params, function(err, banner) {
                expect(banner).toBeTruthy();

                expect(banner.getId()).toEqual(1);
                expect(banner.getPriority()).toEqual(5);
                expect(banner.getDistribution()).toEqual('flat');
                expect(banner.getUrl()).toEqual('http://localhost/');
            });
        });

        it('should принимать не обязательые параметры: begin, end', function() {
            var params   = getRequiredParams();
            params.begin = new Date(2000, 12, 31);
            params.end   = new Date(2020, 12, 31);

            Banner.Create(params, function(err, banner) {
                expect(banner).toBeTruthy();

                expect(banner.getBegin()).toEqual(params.begin);
                expect(banner.getEnd()).toEqual(params.end);
            });
        });

        it('should вернуть исключение, если отсутсвует id', function() {
            Banner.Create(getRequiredParamsWithout('id'), function(err, banner) {
                expect(err).toBeTruthy();
            });
        });
        
        it('should вернуть исключение, если отсутсвует priority', function() {
            Banner.Create(getRequiredParamsWithout('priority'), function(err, banner) {
                expect(err).toBeTruthy();
            });
        });        

        it('should вернуть исключение, если отсутсвует distribution', function() {
            Banner.Create(getRequiredParamsWithout('distribution'), function(err, banner) {
                expect(err).toBeTruthy();
            });
        });
        
        it('should вернуть исключение, если отсутсвует url', function() {
            Banner.Create(getRequiredParamsWithout('url'), function(err, banner) {
                expect(err).toBeTruthy();
            });
        });
        
        it('should вернуть исключение, если priority не лижит в диапазоне от 0 до 99', function() {
            var params = getRequiredParams();

            params.priority = -1;
            Banner.Create(params, function(err, banner) {
                expect(err).toBeTruthy();
            });

            params.priority = 150;
            Banner.Create(params, function(err, banner) {
                expect(err).toBeTruthy();
            });
        });
        
        it('should вернуть исключение, если distribution не равен max или flat', function() {
            var params = getRequiredParams();

            params.distribution = 'max';
            Banner.Create(params, function(err, banner) {
                expect(err).toBeFalsy();
            });

            params.distribution = 'flat';
            Banner.Create(params, function(err, banner) {
                expect(err).toBeFalsy();
            });

            params.distribution = 'manual';
            Banner.Create(params, function(err, banner) {
                expect(err).toBeTruthy();
            });
        });
        
        it('should вернуть исключение, если begin и end переданы по отдельности', function() {
            var params;
            
            params = getRequiredParams();
            params.begin = new Date(2010, 12, 31);
            Banner.Create(params, function(err, banner) {
                expect(err).toBeTruthy();
            });

            params = getRequiredParams();
            params.end = new Date(2020, 12, 31);
            Banner.Create(params, function(err, banner) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если begin в будущем', function() {
            var params = getRequiredParams();
            
            params.begin = new Date(2020, 12, 31);
            params.end   = new Date(2021, 12, 31);
            Banner.Create(params, function(err, banner) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если end уже в прошлом', function() {
            var params = getRequiredParams();

            params.begin = new Date(1990, 12, 31);
            params.end   = new Date(1991, 12, 31);
            Banner.Create(params, function(err, banner) {
                expect(err).toBeTruthy();
            });
        });
    });

    function getBanner(callback) {
        var params = {id: 1, priority: 5, distribution: 'flat', url: 'http://localhost/'};
        params.creative = {
            verify: function(callback) { callback(null, true) }
        };

        Banner.Create(params, callback);
    }
    
    describe('canRotate', function() {
        it('can откручаваться по умолчанию', function() {
            getBanner(function(err, banner) {
                banner.canRotate(function(err, result) {
                    expect(result).toBeTruthy();
                });
            });
        });

        it('should не должен откручаваться, если end в прошлом', function() {
            getBanner(function(err, banner) {
                banner.setEnd(new Date(2010, 12, 31));
                
                banner.canRotate(function(err, result) {
                    expect(result).toBeFalsy();
                });
            });
        });

        it('should не должен откручаваться, если нет креатива', function() {
            getBanner(function(err, banner) {
                banner.setCreative(null);

                banner.canRotate(function(err, result) {
                    expect(result).toBeFalsy();
                });
            });
        });

        it('should не должен откручаваться, если креатив не проходит провеку', function() {
            getBanner(function(err, banner) {
                banner.setCreative({
                    verify: function(callback) { callback(null, false) }
                });

                banner.canRotate(function(err, result) {
                    expect(result).toBeFalsy();
                });
            });
        });
    });

    it('should заменять параметры в шаблоне параметрами из креатива', function() {
        var flight        = {id: 3, network_id: 8};
        var place         = {id: 5};
        var template_code = "%code%";
        var creative_code = "42";
        var code_excpect  = "42";

        var profile  = {
            getFlight: function() { return flight; }
        };
        
        var creative = {
            getCode: function() { return template_code; }
          , replaceParams: function() { return creative_code; }
        };

        getBanner(function(err, banner) {
            banner.setProfile(profile);
            banner.setCreative(creative);

            expect(banner.getCode(place)).toEqual(code_excpect);
        });
    });
});