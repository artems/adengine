db.network.drop();

db.network.save({"id": 1, "format_id": 10, "name": "ZeroNet", "group": "zero", "is_local": false});
db.network.save({"id": 2, "format_id": 20, "name": "PopUnder: Light", "group": "light", "is_local": false});
db.network.save({"id": 3, "format_id": 20, "name": "PopUnder: Category", "group": "category", "is_local": false});
db.network.save({"id": 4, "format_id": 21, "name": "RichMedia: Light", "group": "light", "is_local": false});
db.network.save({"id": 5, "format_id": 21, "name": "RichMedia: Category", "group": "category", "is_local": false});
db.network.save({"id": 6, "format_id": 30, "name": "240x400: Light", "group": "light", "is_local": false});
db.network.save({"id": 7, "format_id": 30, "name": "240x400: Category", "group": "category", "is_local": false});
db.network.save({"id": 8, "format_id": 31, "name": "728x90: Light", "group": "light", "is_local": false});
db.network.save({"id": 9, "format_id": 31, "name": "728x90: Category", "group": "category", "is_local": false});

db.network.save({"id": 11, "format_id": 31, "name": "LN 240x480 > adengine.dev", "group": "local", "is_local": true});
db.network.save({"id": 12, "format_id": 31, "name": "LN 728x90 > adengine.dev", "group": "local", "is_local": true});
