var init = require("./_init")
  , Template = require("core/template");

describe('template', function() {
    it('should вернуть исключение, когда создан без параметров', function() {
        Template.Create({}, function(err, tpl) {
            expect(err).toBeTruthy();
            expect(tpl).toBeFalsy();
        });
    });

    it('should вернуть исключение, когда не переданы все обязательные параметры', function() {
        Template.Create({id: 1, size: 1}, function(err, unit) { expect(err).toBeTruthy();});
        Template.Create({id: 1, body: '...'}, function(err, unit) { expect(err).toBeTruthy();});
        Template.Create({size: 1, body: '...'}, function(err, unit) { expect(err).toBeTruthy();});
    });

    it('should принимать в конструкторе параметры id, size, body', function() {
        var params = {id: 1, size: 1, body: 'document.write("<script src=\"\"></script>")'}
        Template.Create(params, function(err, tpl) {
            expect(err).toBeFalsy();
            expect(tpl).toBeTruthy();
        });
    });

    it('should хранить и возращать параметры', function() {
        var params = {id: 1, size: 1, body: '...'}
        Template.Create(params, function(err, tpl) {
            // --
            expect(tpl.getParams()).toBeTruthy();
            expect(tpl.getParam('bgcolor')).toBeFalsy();

            // --
            tpl.setParam('bgcolor', 'string', 'Цвет фона', '#fff', false);

            var param = tpl.getParam('bgcolor');
            expect(param).toBeTruthy();
            expect(param.type).toBe("string");
            expect(param.name).toBe("Цвет фона");
            expect(param['default']).toBe("#fff");
            expect(param.require).toBeFalsy();

            // --
            var params = tpl.getParams()
            expect(params.bgcolor).toBe(param);
        });
    })
});