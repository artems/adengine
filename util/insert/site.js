db.site.drop();

db.site.save({"id": 1, "account_id": 1, "url" : "adchange.co.cc", "preg": /adchange\.co\.cc/, "name": null, "state": "active", "is_approved": true, "buyout": [ "cpc", "cpm" ]});
db.site.save({"id": 2, "account_id": 1, "url" : "localhost", "preg": /localhost/, "name": null, "state": "active", "is_approved": true, "buyout": [ "cpc", "cpm" ]});