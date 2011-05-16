db.profile.drop();

db.profile.save({"id": 1, "flight_id": 1, "name": "profile#1", "target": {}, "state": "active"});

db.profile.save({"id": 100, "flight_id": 100, "name": "profile#100", "target": {}, "state": "active"});
db.profile.save({"id": 101, "flight_id": 101, "name": "profile#101", "target": {}, "state": "active"});