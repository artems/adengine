var init = require("../_init")
  , Template = require("core/template");

describe('Template', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {id: 1, size: 1, body: 'xxx', is_plug: false};
        }

        function getRequiredParamsWithout(key) {
            var params = getRequiredParams();
            delete params[key];

            return params;
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            Template.Create({}, function(err, template) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id, size, body, is_plug', function() {
            var params = getRequiredParams();

            Template.Create(params, function(err, template) {
                expect(template).toBeTruthy();

                expect(template.getId()).toEqual(1);
                expect(template.getCode()).toEqual("xxx");
                expect(template.isPlug()).toBeFalsy();
            });
        });

        it('should вернуть исключение, если отсутсвует id', function() {
            Template.Create(getRequiredParamsWithout('id'), function(err, template) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует body', function() {
            Template.Create(getRequiredParamsWithout('body'), function(err, template) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует is_plug', function() {
            Template.Create(getRequiredParamsWithout('is_plug'), function(err, template) {
                expect(err).toBeTruthy();
            });
        });
    });

    function getTemplate(callback) {
        var params = {id: 1, size: 1, body: 'xxx', is_plug: false};

        Template.Create(params, callback);
    }


    it('should хранить параметры', function() {
        getTemplate(function(err, tpl) {
            // --
            expect(tpl.getParams()).toBeTruthy();

            // --
            tpl.setParam('bgcolor', 'string', '#fff', false);

            var param = tpl.getParam('bgcolor');
            
            expect(param).toBeTruthy();
            expect(param['type']).toEqual("string");
            expect(param['default']).toEqual("#fff");
            expect(param['require']).toBeFalsy();

            // --
            var params = tpl.getParams()
            expect(params.bgcolor).toBe(param);
        });
    });    
});