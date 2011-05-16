db.site.drop();

db.site.save({"id": 1, "account_id": 1, "url" : "adengine.dev", "preg": /adengine\.dev/, "name": null, "state": "active", "is_approved": true, "buyout": [ "cpc", "cpm" ]});
db.site.save({"id": 2, "account_id": 1, "url" : "localhost", "preg": /localhost/, "name": null, "state": "active", "is_approved": true, "buyout": [ "cpc", "cpm" ]});