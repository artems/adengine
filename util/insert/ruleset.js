db.ruleset.drop();

db.ruleset.save({"id": 1, "name": "", "target_id" : "2", "is_template": false, "rules": [
    {"type": "allow", "dayofweek": 1, "begin": "10:00", "end": "18:00"}
  , {"any": "deny"}
]});

db.ruleset.save({"id": 2, "name": "", "target_id" : "5", "is_template": false, "rules": [
    {"type": "allow", "begin": 2130706432, "end": 2130706687}
  , {"any": "deny"}
]});

db.ruleset.save({"id": 3, "name": "", "target_id" : "6", "is_template": false, "rules": [
    {"type": "allow", "regexp": /MSIE/}
  , {"any": "deny"}
]});

db.ruleset.save({"id": 4, "name": "", "target_id" : "7", "is_template": false, "rules": [
    {"type": "allow", "category_id": 1}
  , {"any": "deny"}
]});

db.ruleset.save({"id": 5, "name": "", "target_id" : "9", "is_template": false, "rules": [
    {"type": "allow", "site_id": 1}
  , {"any": "deny"}
]});