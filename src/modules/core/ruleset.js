var util = require("util")
  , Dummy = require("./dummy");

function Unit() {
    Dummy.call(this);
    
    this.id        = 0;
    this.rules     = [];
    this.target_id = null;        
}

util.inherits(Unit, Dummy);

Unit.Create = function(params, callback) {
    var unit = new Unit();

    if (!Unit._isValidParams(params)) {
        callback(new Error("ENG-0007"));
        return;
    }

    unit.id = parseInt(params.id);
    unit.rules = params.rules || [];
    unit.target_id = parseInt(params.target_id);    

    callback(null, unit);
};

Unit._isValidParams = function(params) {
    if (isNaN(parseInt(params.id)) || parseInt(params.id) <= 0) {
        return false;
    }
    
    if (isNaN(parseInt(params.target_id)) || parseInt(params.target_id) <= 0) {
        return false;
    }
    
    if (!params.rules || params.rules.constructor != Array || params.rules.length == 0) {
        return false;
    }
    
    return true;
};

var category_map = {};

Unit.setCategoryMap = function(map) {
    category_map = map;
}

Unit.prototype.getTargetId = function() {
    return this.target_id;
}

Unit.prototype.pass = function(session_vars) {
    var process = this._getProcessMethod();
    for (var i=0, len = this.rules.length; i<len; i++) {
        var rule = this.rules[i]
          , result = process.call(this, rule, session_vars);

        if (result) {
            return (rule.type == "allow");
        }
    }

    console.warn("can't find target default rule, return true. Ruleset#%d", this.id);

    return true;
}

Unit.TARGET_DAYOFWEEK = 2;
Unit.TARGET_GEOGRAPHY = 4;
Unit.TARGET_IPADDRESS = 5;
Unit.TARGET_USERAGENT = 6;
Unit.TARGET_CATEGORY  = 7;
Unit.TARGET_SITE      = 9;

Unit.prototype._getProcessMethod = function() {    
    switch (this.target_id) {
        case Unit.TARGET_CATEGORY :
            return this._processCategoryTarget;
        case Unit.TARGET_DAYOFWEEK :
            return this._processDayOfWeekTarget;
        case Unit.TARGET_GEOGRAPHY :
            return this._processGeographyTarget;
        case Unit.TARGET_IPADDRESS :
            return this._processIpAddressTarget;
        case Unit.TARGET_USERAGENT :
            return this._processUserAgentTarget;
        case Unit.TARGET_SITE :
            return this._processSiteTarget;
        default :
            return this._processDummy;
    }
};

Unit.prototype._processDummy = function() {
    console.warn("unknow target #%d, ignore. Ruleset#%d", this.target_id, this.id);
    
    return false;
};

Unit.prototype._processCategoryTarget = function(rule, session_vars) {
    var site_category = session_vars.site_category;
    
    if (rule.any) {
        return true;
    }
    
    for (var i=0; i<site_category.length; i++) {
        if (rule.category_id == site_category[i]) {
            return true;
        } else if (this._isParentCategory(rule.category_id, site_category[i])) {
            return true;
        }
    }

    return false;
};

Unit.prototype._processDayOfWeekTarget = function(rule, session_vars) {
    var now = session_vars.now
      , dayofweek = now.getDay()
      , time = [
          (now.getHours()   < 10 ? "0" : "") + now.getHours()
        , (now.getMinutes() < 10 ? "0" : "") + now.getMinutes()
      ].join(":");
          
    if (rule.any) {
        return true;
    }

    return (rule.dayofweek == dayofweek && time >= rule.begin && time <= rule.end);
}

Unit.prototype._processGeographyTarget = function(rule, session_vars) {
    var client_region = session_vars.client_region;
    
    if (rule.any) {
        return true;
    }
    
    if (rule.region_id == client_region.country_id) {
        return true;
    }

    if (rule.region_id == client_region.region_id) {
        return true;
    }

    if (rule.region_id == client_region.city_id) {
        return true;
    }   

    return false;
};

Unit.prototype._processIpAddressTarget = function(rule, session_vars) {
    var client_ip = session_vars.client_ip;
    
    if (rule.any) {
        return true;
    }
   
    return (client_ip >= rule.begin && client_ip <= rule.end);
};

Unit.prototype._processSiteTarget = function(rule, session_vars) {    
    if (rule.any) {
        return true;
    }

    return (rule.site_id == session_vars.site_id);
};

Unit.prototype._processUserAgentTarget = function(rule, session_vars) {
    if (rule.any) {
        return true;
    }

    return rule.regexp.test(session_vars.user_agent);
};

Unit.prototype._isParentCategory = function(rule_cat_id, place_cat_id) {
    var parent_id = (category_map[place_cat_id] || {}).parent_id || 0;   
    
    if (parent_id == 0) {
        return false;
    } else if (rule_cat_id == parent_id) {                
        return true;
    } else {
        return this._isParentCategory(rule_cat_id, parent_id);
    }
};

module.exports = Unit;
