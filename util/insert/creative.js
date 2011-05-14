db.creative.drop();

db.creative.save({"id": 1, "flight_id": 1, "template_id": 7, "name": "creative#1", "uid": "", "state": "active", "params": {
    "swf_url": 'http://localhost:8080/cstore/1/1/tks_beach2_240x400_kavanga.swf'
  , "gif_url": 'http://localhost:8080/cstore/1/1/tks_beach2_240x400_kavanga.jpg'
}});
db.creative.save({"id": 2, "flight_id": 2, "template_id": 8, "name": "creative#2", "uid": "", "state": "active", "params": {
    "code": "document.write('728x90');"
}});