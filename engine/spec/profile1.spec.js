var init = require("./_init")
  , Profile = require("core/profile");

describe('profile', function() {
    it('should вернуть исключение, когда создан без параметров', function() {
        Profile.Create({}, function(err, profile) {
            expect(err).toBeTruthy();
            expect(profile).toBeFalsy();
        });
    });

    it('should проходить проверку, когда у сценария нет таргетингов', function() {
        var params = {id:1};
        Profile.Create(params, function(err, profile) {
            profile.verify(function(err, result) {
                expect(result).toBeTruthy();
            });
        });
    });
    
    it('should проходить проверку, когда не сработал ни одни таргетинг', function() {
        var params = {id:1};
        Profile.Create(params, function(err, profile) {
            var geo_target = {
                getTargetId: function() { return 1; }
              , pass: function() { return true; }
            };
            var cat_target = {
                getTargetId: function() { return 2; }
              , pass: function() { return true; }
            };
            
            profile.setTarget(geo_target);
            profile.setTarget(cat_target);
            
            profile.verify(function(err, result) {
                expect(result).toBeTruthy();
            });            
        });
    });
    
    it('should не проходить проверку, когда сработал любой таргетинг', function() {
        var params = {id:1};
        Profile.Create(params, function(err, profile) {
            var geo_target = {
                getTargetId: function() { return 1; }
              , pass: function() { return false; }
            };
            
            profile.setTarget(geo_target);
            
            profile.verify(function(err, result) {
                expect(result).toBeFalsy();
            });            
        });
    });
});