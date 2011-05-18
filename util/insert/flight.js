db.flight.drop();

db.flight.save({"id": 1, "account_id": 1, "user_id": null, "campagin_id": null, "network_id": 12, "name": "plug#1", "priority": 1, "budget": 0, "balance": 0, "spent": 0, "distribution": "max", "buyout" : {"adv" : "none", "pub" : "none"}, "begin": new Date(1970, 1, 1), "end": new Date(2099, 12, 31), "is_plug": true, "limit" : {}, "state": "active", "comment": ""});

db.flight.save({"id": 100, "account_id": 1, "user_id": 1, "campagin_id": 1, "network_id": 6, "name": "flight#100", "priority": 5, "budget": 100.00, "balance": 50.00, "spent": 0, "distribution": "max", "buyout" : {"adv" : "cpm", "pub" : "cpc"}, "begin": new Date(2010, 0, 1), "end": new Date(2012, 11, 31), "is_plug": false, "limit" : {}, "state": "active", "comment": ""});
db.flight.save({"id": 101, "account_id": 1, "user_id": 1, "campagin_id": 1, "network_id": 6, "name": "flight#101", "priority": 5, "budget": 100.00, "balance": 50.00, "spent": 0, "distribution": "max", "buyout" : {"adv" : "cpm", "pub" : "cpc"}, "begin": new Date(2010, 0, 1), "end": new Date(2012, 11, 31), "is_plug": false, "limit" : {}, "state": "active", "comment": ""});

db.flight.update({"id": 100}, {"$set": {"limit.overall.exposure.day" : 100}});
db.flight.update({"id": 100}, {"$set": {"limit.overall.exposure.all" : 1000}});