db.banner.drop();

db.banner.save({"id": 1, "profile_id": 1, "creative_id": 1, "name": "banner#1", "url": "http://www.google.ru", "priority": 5, "distribution": "max", "begin": new Date(2010, 0, 1), "end": new Date(2012, 11, 31), "limit": {}, "state": "active"});
db.banner.save({"id": 2, "profile_id": 2, "creative_id": 2, "name": "site plug#1", "url": "", "priority": 1, "distribution": "max", "begin": new Date(1970, 1, 1), "end": new Date(2099, 12, 31), "limit": {}, "state": "active"});