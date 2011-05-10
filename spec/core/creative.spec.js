var init = require("../_init")
  , Creative = require("core/creative");

describe('Creative', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {id: 1, uid: 'aabbcc'};
        }

        function getRequiredParamsWithout(key) {
            var params = getRequiredParams();
            delete params[key];

            return params;
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            Creative.Create({}, function(err, creative) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id, uid', function() {
            var params = getRequiredParams();

            Creative.Create(params, function(err, creative) {
                expect(creative).toBeTruthy();

                expect(creative.getId()).toEqual(1);
                expect(creative.getUid()).toEqual("aabbcc");
            });
        });

        it('should вернуть исключение, если отсутсвует id', function() {
            Creative.Create(getRequiredParamsWithout('id'), function(err, creative) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует uid', function() {
            Creative.Create(getRequiredParamsWithout('uid'), function(err, creative) {
                expect(err).toBeTruthy();
            });
        });
        
        it('should вернуть исключение, если id нельзя преобразовать в число больше 0', function() {
            var params = getRequiredParams();

            params.id = "1";
            Creative.Create(params, function(err, creative) {
                expect(err).toBeFalsy();
            });

            params.id = "0";
            Creative.Create(params, function(err, creative) {
                expect(err).toBeTruthy();
            });
        });
    });

    function getCreative(callback) {
        var params = {id: 1, uid: "aabbcc", template: getTemplate()};

        Creative.Create(params, callback);
    }

    function getTemplate() {
        var tpl_params = {
            host : {
                'default': 'localhost'
              , 'require': false
            },
            bgcolor : {
                'default': '#fff'
              , 'require': false
            },
            flash_ver : {
                'default': null
              , 'require': true
            }
        };

        return {getParams: function() { return tpl_params; }};
    }
    
    it('should проходить проверку, когда установлены все обязательные параметры шаблона', function() {
        getCreative(function(err, creative) {
            creative.setParam("flash_ver", "10.1");
            creative.verify(function(err, result) {
                expect(result).toBeTruthy();
            });

            creative.setParam("flash_ver", "");
            creative.verify(function(err, result) {
                expect(result).toBeTruthy();
            });

            creative.setParam("flash_ver", undefined);
            creative.verify(function(err, result) {
                expect(result).toBeFalsy();
            });
        });
    });

    it('should заменять переменные в коде своими параметрами и значениями по умолчанию из шаблона', function() {
        var code = "\
            var host = '%host%';\
            var bgc  = '%bgcolor%';\
            var fv   = '%flash_ver%';";
        var code_for_comparison = "\
            var host = 'adengine.local';\
            var bgc  = '#fff';\
            var fv   = '10.1';";

        getCreative(function(err, creative) {
            creative.setParam("host", "adengine.local");
            creative.setParam("flash_ver", "10.1");

            expect(creative.replaceParams(code)).toEqual(code_for_comparison);
        });
    });
});