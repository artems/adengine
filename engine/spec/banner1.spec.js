var init = require("./_init")
  , Banner = require("core/banner");

describe('banner', function() {
    it('should вернуть исключение, когда создан без параметров', function() {
        Banner.Create({}, function(err, banner) {
            expect(err).toBeTruthy();
            expect(banner).toBeFalsy();
        });
    });

    it('should вернуть исключение, когда не переданы все обязательные параметры', function() {
        var params = {id:1, priority: 5, distribution: 'max', url: 'http://ya.ru', begin: new Date(2000, 0, 1), end: new Date(2099, 11, 31)};
        var params_no_id = clone_without('id', params);
        var params_no_priority = clone_without('priority', params);
        var params_no_distribution = clone_without('distribution', params);
        var params_no_url   = clone_without('url', params);
        var params_no_begin = clone_without('begin', params);
        var params_no_end   = clone_without('end', params);

        Banner.Create(params, function(err, unit) { expect(unit).toBeTruthy();});

        // required
        Banner.Create(params_no_id, function(err, unit) { expect(err).toBeTruthy();});
        Banner.Create(params_no_priority, function(err, unit) { expect(err).toBeTruthy();});
        Banner.Create(params_no_distribution, function(err, unit) { expect(err).toBeTruthy();});
        Banner.Create(params_no_url, function(err, unit) { expect(err).toBeTruthy();});

        // optional
        Banner.Create(params_no_begin, function(err, unit) { expect(err).toBeFalsy();});
        Banner.Create(params_no_end, function(err, unit) { expect(err).toBeFalsy();});
    });

    it('should принимать в конструкторе параметры id, priority, distribution, url, begin, end', function() {
        var params = {id:1, priority: 5, distribution: 'max', url: 'http://ya.ru', begin: new Date(2000, 0, 1), end: new Date(2099, 11, 31)};
        Banner.Create(params, function(err, banner) {
            expect(err).toBeFalsy();
            expect(banner).toBeTruthy();
        });
    });

    it('should не проходить проверку, когда не имеет правильного креатива', function() {
        var params = {id:1, priority: 5, distribution: 'max', url: 'http://ya.ru'};
        Banner.Create(params, function(err, banner) {
            // -- нет креатива
            banner.verify(function(err, result) {
                expect(result).toBeFalsy();
            });

            // -- есть креатив
            var creative = {verify: function(callback) { callback(null, true)}};
            banner.setCreative(creative);
            banner.verify(function(err, result) {
                expect(result).toBeTruthy();
            });
        });
    });

    it('should не проходить проверку, когда время начала еще не наступило', function() {
        var params = {id:1, priority: 5, distribution: 'max', url: 'http://ya.ru'};
        Banner.Create(params, function(err, banner) {
            banner.setCreative({verify: function(callback) { callback(null, true)}});
            banner.setBegin(new Date('Tue, 31 Dec 2019 00:00:00 GMT'));
            banner.verify(function(err, result) {
                expect(result).toBeFalsy();
            });
        });
    });

    it('should не проходить проверку, когда время окончания уже прошло', function() {
        var params = {id:1, priority: 5, distribution: 'max', url: 'http://ya.ru'};
        Banner.Create(params, function(err, banner) {
            banner.setCreative({verify: function(callback) { callback(null, true)}});
            banner.setEnd(new Date('Fri, 01 Jan 1999 00:00:00 GMT'));
            banner.verify(function(err, result) {
                expect(result).toBeFalsy();
            });
        });
    });

    it('should отдавать код шаблона с замененными параметрами', function() {
        var flight = {id: 3, network_id: 8};
        var place  = {id: 5};
        var template_code = "";
        var creative_code = "";
        var code_excpect  = "";

        var creative = {
            getCode: function() { return template_code; }
          , replaceParams: function() { return creative_code; }
        };

        var profile  = {
            getFlight: function() { return flight; }
        };

        var params = {id:1, priority: 5, distribution: 'max', url: 'http://ya.ru'};
        
        Banner.Create(params, function(err, banner) {
            banner.setProfile(profile);
            banner.setCreative(creative);

            expect(banner.getCode(place)).toEqual(code_excpect);
        });
    });
});

function clone_without(to_delete, params) {
    var new_params = {};
    for (i in params) {
        if (i != to_delete) {
            new_params[i] = params[i];
        }
    }

    return new_params;
}
