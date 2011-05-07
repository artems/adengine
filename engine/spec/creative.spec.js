var init = require("./_init")
  , Creative = require("core/creative")
;

describe('creative', function() {
    it('should вернуть исключение, когда создан без параметров', function() {
        Creative.Create({}, function(err, tpl) {
            expect(err).toBeTruthy();
            expect(tpl).toBeFalsy();
        });
    });

    it('should вернуть исключение, когда не переданы все обязательные параметры', function() {
        Creative.Create({id: 1}, function(err, unit) { expect(err).toBeTruthy();});
        Creative.Create({uid: 'aaabbb'}, function(err, unit) { expect(err).toBeTruthy();});
    });


    it('should принимать в конструкторе параметры id, uid', function() {
        var params = {id:1, uid: 'aaabbb'};
        Creative.Create(params, function(err, tpl) {
            expect(err).toBeFalsy();
            expect(tpl).toBeTruthy();
        });
    });

    it('should проходить проверку, когда установлены все обязательные параметры из шаблона', function() {
        var params = {id:1, uid: 'aabbcc', template: createTemplate()};
        Creative.Create(params, function(err, creative) {
            // --
            creative.verify(function(err, result) {
                expect(result).toBeFalsy();
            });

            // --
            creative.setParam("flash_ver", "10.1");
            creative.verify(function(err, result) {
                expect(result).toBeTruthy();
            });
        });
    });

    it('should не проходить проверку, когда был удален', function() {
        var params = {id:1, uid: 'aabbcc', template: createTemplate()};
        Creative.Create(params, function(err, creative) {
            creative.setParam("flash_ver", "10.1");
            creative.remove();
            
            creative.verify(function(err, result) {
                expect(result).toBeFalsy();
            });
        });
    });

    it('should заменять переменные в шаблоне своими параметрами или значениями по умолчанию из шаблона', function() {
        var code = "\
            var host = '%host%';\
            var bgc  = '%bgcolor%';\
            var fv   = '%flash_ver%';";
        var code_for_comparison = "\
            var host = 'adengine.local';\
            var bgc  = '#fff';\
            var fv   = '10.1';";

        var params = {id:1, uid: 'aabbcc', template: createTemplate()};
        Creative.Create(params, function(err, creative) {
            creative.setParam("host", "adengine.local");
            creative.setParam("flash_ver", "10.1");

            var new_code = creative.replaceParams(code);

            expect(new_code).toEqual(code_for_comparison);
        });
    });
});

function createTemplate() {
    var tpl = {getParams: function() {}};
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

    spyOn(tpl, 'getParams').andReturn(tpl_params);

    return tpl;
}