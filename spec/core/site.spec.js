var init = require("../_init")
  , Site = require("core/site");

describe('Site', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {id: 1, url: 'localhost', preg: /.*/, buyout: ['cpm']};
        }

        function getRequiredParamsWithout(key) {
            var params = getRequiredParams();
            delete params[key];

            return params;
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            Site.Create({}, function(err, site) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id, url, preg, buyout', function() {
            var params = getRequiredParams();

            Site.Create(params, function(err, site) {
                expect(site).toBeTruthy();

                expect(site.getId()).toEqual(1);
                expect(site.getUrl()).toEqual("localhost");
                expect(site.getPreg().toString()).toEqual('/.*/');
                expect(site.getBuyout()[0]).toEqual("cpm");
            });
        });

        it('should вернуть исключение, если отсутсвует id', function() {
            Site.Create(getRequiredParamsWithout('id'), function(err, site) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует url', function() {
            Site.Create(getRequiredParamsWithout('url'), function(err, site) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует preg', function() {
            Site.Create(getRequiredParamsWithout('preg'), function(err, site) {
                expect(err).toBeTruthy();
            });
        });

        it('should вернуть исключение, если отсутсвует buyout', function() {
            var params = getRequiredParams();
            params.buyout = undefined;

            Site.Create(params, function(err, site) {
                expect(err).toBeTruthy();
            });

            params.buyout = [];
            Site.Create(params, function(err, site) {
                expect(err).toBeTruthy();
            });
        });
    });

    function getSite(callback) {
        var params = {id: 1, url: 'localhost', preg: /.*/, buyout: ['cpm']};

        Site.Create(params, callback);
    }

    function getPlug(format_id) {
        return {
            getProfile : function() {
                return {
                    getFlight : function() {
                        return {
                            getNetwork : function() {
                                return {
                                    getFormat : function() {
                                        return {
                                            getId : function() {
                                                return format_id;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    it('can возращать копию списка страниц', function() {
        getSite(function(err, site) {
            site.addPage({});
            site.addPage({});

            var list1 = site.getPages();
            var list2 = site.getPages();

            list1.pop();

            expect(list1.length).toEqual(1);
            expect(list2.length).toEqual(2);
        });
    });

    it('can возращать заглушку для сайта', function() {
        getSite(function(err, site) {
            var plug1 = getPlug(1);

            site.addPlug(plug1);

            var plug2 = site.getRandomPlug(1);

            expect(plug1 === plug2).toBeTruthy();
        });
    });

    it('should возращать случайную заглушку', function() {
        getSite(function(err, site) {
            var plug1 = getPlug(1);
            var plug2 = getPlug(1);
            var plug3 = getPlug(2);

            plug1.id = 1;
            plug2.id = 2;
            plug3.id = 3;

            site.addPlug(plug1);
            site.addPlug(plug2);
            site.addPlug(plug3);

            var result = [];
            for (var i=0; i<10; i++) {
                result.push(site.getRandomPlug(1));
            }

            var no_plug3  = false;
            var has_plug1 = false;
            var has_plug2 = false;
            
            for (var i=0; i<10; i++) {
                has_plug1 = has_plug1 || (plug1 === result[i]);
                has_plug2 = has_plug1 || (plug2 === result[i]);
                no_plug3  = no_plug3  || (plug3 === result[i]);
            }

            expect(has_plug1).toBeTruthy();
            expect(has_plug2).toBeTruthy();
            expect(no_plug3).toBeFalsy();
        });
    });
});