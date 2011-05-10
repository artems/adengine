var init = require("../_init")
  , Ruleset = require("core/ruleset");

describe('ruleset', function() {
    it('should вернуть исключение, когда создан без параметров', function() {
        Ruleset.Create({}, function(err, ruleset) {
            expect(err).toBeTruthy();
            expect(ruleset).toBeFalsy();
        });
    });
    
    describe('category target', function() {
        it('should срабатывать по правилам', function() {
            var params = {id: 1, target_id: Ruleset.TARGET_CATEGORY};
            params.rules = [
                {any: false, type: 'allow', category_id: 1}
              , {any: false, type: 'allow', category_id: 2}
              , {any: true,  type: 'deny',  category_id: null}
            ];


            Ruleset.Create(params, function(err, ruleset) {
                expect(ruleset.pass({site_category: [1]})).toBeTruthy();
                expect(ruleset.pass({site_category: [2]})).toBeTruthy();
                expect(ruleset.pass({site_category: [3]})).toBeFalsy();

                expect(ruleset.pass({site_category: [2, 3]})).toBeTruthy();
                expect(ruleset.pass({site_category: [3, 4]})).toBeFalsy();
                expect(ruleset.pass({site_category: []})).toBeFalsy();
            });
        });
               
        it('should учитывать родителей для категории сайта', function() {
            var params = {id: 1, target_id: Ruleset.TARGET_CATEGORY};
            params.rules = [
                {any: false, type: 'allow', category_id: 1}
              , {any: false, type: 'allow', category_id: 2}
              , {any: true,  type: 'deny'}
            ];
            
            Ruleset.setCategoryMap({
                4 : {parent_id: 1}
              , 5 : {parent_id: 3}
            });
            
            Ruleset.Create(params, function(err, ruleset) {
                expect(ruleset.pass({site_category: [4]})).toBeTruthy();
                expect(ruleset.pass({site_category: [5]})).toBeFalsy();
            });
        });
    });   
    
    describe('day of week target', function() {
        it('should срабатывать по правилам', function() {
            var params = {id: 1, target_id: Ruleset.TARGET_DAYOFWEEK};
            params.rules = [
                {any: false, type: 'allow', dayofweek: 1, begin: '09:00', end: '12:00'}
              , {any: false, type: 'allow', dayofweek: 1, begin: '18:00', end: '22:00'}
              , {any: true,  type: 'deny'}
            ];
                        
            var sunday1 = new Date('3 Jan 2010 10:55')
              , monday1 = new Date('4 Jan 2010 10:55')
              , monday2 = new Date('4 Jan 2010 23:00');

            Ruleset.Create(params, function(err, ruleset) {
                expect(ruleset.pass({now: sunday1})).toBeFalsy();
                expect(ruleset.pass({now: monday1})).toBeTruthy();
                expect(ruleset.pass({now: monday2})).toBeFalsy();
                
            });
        });
    });
    
    describe('geography target', function() {
        it('should срабатывать по правилам', function() {
            var params = {id: 1, target_id: Ruleset.TARGET_GEOGRAPHY};
            params.rules = [
                {any: false, type: 'allow', region_id: 1}
              , {any: true,  type: 'deny'}
            ];
                        
            var client_region1 = {
                country_id: 1
              , region_id: 2
              , city_id: 3
            };
            var client_region2 = {
                country_id: 4
              , region_id: 5
              , city_id: 6
            };

            Ruleset.Create(params, function(err, ruleset) {
                expect(ruleset.pass({client_region: client_region1})).toBeTruthy();
                expect(ruleset.pass({client_region: client_region2})).toBeFalsy();
            });
        });
    });
    
    describe('ip address target', function() {
        it('should срабатывать по правилам', function() {
            var params = {id: 1, target_id: Ruleset.TARGET_IPADDRESS};
            params.rules = [
                {any: false, type: 'allow', begin: 100, end: 200}
              , {any: false, type: 'allow', begin: 300, end: 500}
              , {any: true,  type: 'deny'}
            ];
                                    
            Ruleset.Create(params, function(err, ruleset) {
                expect(ruleset.pass({client_ip: 100})).toBeTruthy();
                expect(ruleset.pass({client_ip: 500})).toBeTruthy();
                expect(ruleset.pass({client_ip: 350})).toBeTruthy();
                expect(ruleset.pass({client_ip: 250})).toBeFalsy();
            });
        });
    });
    
    describe('site target', function() {
        it('should срабатывать по правилам', function() {
            var params = {id: 1, target_id: Ruleset.TARGET_SITE};
            params.rules = [
                {any: false, type: 'allow', site_id: 1}
              , {any: false, type: 'allow', site_id: 2}
              , {any: true,  type: 'deny'}
            ];            

            Ruleset.Create(params, function(err, ruleset) {
                expect(ruleset.pass({site_id: 1})).toBeTruthy();
                expect(ruleset.pass({site_id: 3})).toBeFalsy();
            });
        });
    });
    
    describe('user-agent target', function() {
        it('should срабатывать по правилам', function() {
            var params = {id: 1, target_id: Ruleset.TARGET_USERAGENT};
            params.rules = [
                {any: false, type: 'allow', regexp: /MSIE/}
              , {any: false, type: 'allow', regexp: /Opera/}
              , {any: true,  type: 'deny'}
            ];            

            Ruleset.Create(params, function(err, ruleset) {
                expect(ruleset.pass({user_agent: 'Mozilla/5.0 MSIE 8.0'})).toBeTruthy();
                expect(ruleset.pass({user_agent: 'Mozilla/5.0 WebKit'})).toBeFalsy();
            });
        });
    });
});