db.flight.drop();

db.flight.save({"id": 1, "account_id": 1, "user_id": 1, "campagin_id": 1, "network_id": 6, "name": "flight#1", "priority": 5, "budget": 100.00, "balance": 50.00, "spent": 0, "distribution": "max", "begin": new Date(2010, 0, 1), "end": new Date(2012, 11, 31), "limit" : {}, "state": "active", "comment": ""});