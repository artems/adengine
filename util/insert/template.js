db.template.save({"id": 1, "format_id": 10, "name": "Plug for ZeroPixel", "is_plug" : true, "body" : "", "params" : {}});
db.template.save({"id": 2, "format_id": 20, "name": "Plug for PopUnder", "is_plug" : true, "body" : "", "params" : {}});
db.template.save({"id": 3, "format_id": 20, "name": "Default PopUnder", "is_plug" : false, "body" : "", "params" : {}});
db.template.save({"id": 4, "format_id": 21, "name": "Plug for RichMedia", "is_plug" : true, "body" : "", "params" : {}});
db.template.save({"id": 5, "format_id": 21, "name": "Default RichMedia", "is_plug" : false, "body" : "", "params" : {}});
db.template.save({"id": 6, "format_id": 30, "name": "Plug for 240x400", "is_plug" : true, "body" : "", "params" : {}});
db.template.save({"id": 7, "format_id": 30, "name": "Default 240x400", "is_plug" : false, "body" : "", "params" : {}});
db.template.save({"id": 8, "format_id": 31, "name": "Plug for 728x90", "is_plug" : true, "body" : "", "params" : {}});
db.template.save({"id": 9, "format_id": 31, "name": "Default 728x90", "is_plug" : false, "body" : "", "params" : {}});

db.template.update({id: 7}, {$set: {
    'params.swf_url': {
        "type" : "file", "name" : "swf file", "default" : null, "require" : true
    }, 'params.gif_url': {
        "type" : "file", "name" : "gif file", "default" : null, "require" : true
    }, 'params.flash_ver': {
        "type" : "string", "name" : "version of flash", "default" : 6, "require" : false
    }, 'params.bgcolor': {
        "type" : "string", "name" : "background color", "default" : "#ffffff", "require" : false
    }
}});