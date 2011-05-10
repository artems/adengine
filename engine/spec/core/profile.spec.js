var init = require("../_init")
  , Profile = require("core/profile");

describe('profile', function() {
    describe('constructor', function() {
        function getRequiredParams() {
            return {id: 1};
        }

        it('should вернуть исключение, когда создан без параметров', function() {
            Profile.Create({}, function(err, profile) {
                expect(err).toBeTruthy();
            });
        });

        it('should принимать обязательые параметры: id', function() {
            Profile.Create(getRequiredParams(), function(err, profile) {
                expect(profile).toBeTruthy();

                expect(profile.getId()).toEqual(1);
            });
        });
    })

    function getProfile(callback) {
        var params = {id: 1};

        Profile.Create(params, callback);
    }

    it('can иметь баннеры', function() {
        getProfile(function(err, profile) {
            profile.addBanner({});

            expect(profile.getBanners().length).toEqual(1);
        })
    });

    it('can иметь таргетинги', function() {
        getProfile(function(err, profile) {
            var ruleset1 = {getTargetId: function() { return 1; }};

            profile.setTarget(ruleset1);
            var ruleset2 = profile.getTarget(1);

            expect(ruleset1).toBe(ruleset2);
        });
    });

    it('should возращать копию списка баннеров', function() {
        getProfile(function(err, profile) {
            profile.addBanner({});
            profile.addBanner({});

            var list = profile.getBanners();
            list.pop();

            expect(list.length).toEqual(1);
            expect(profile.getBanners().length).toEqual(2);
        })
    });

    describe('canRotate', function() {
        it('should должен откручаваться по умолчанию', function() {
            getProfile(function(err, profile) {
                profile.canRotate(function(err, result) {
                    expect(result).toBeTruthy();
                });
            });
        });

        it('should не должен откручаваться, если сработал таргетинг', function() {
            getProfile(function(err, profile) {
                var target = {
                    pass: function() { return false; }
                  , getTargetId: function() { return 1; }
                };

                profile.setTarget(target);

                profile.canRotate(function(err, result) {
                    expect(result).toBeFalsy();
                });
            });
        });
    });
});