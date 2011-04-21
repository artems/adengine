var Tempalte = {
    id: 0,
    format_id: 0,
    name: "",
    size: 0,
    is_plug: false,
    body: "",
    params : {
        getURL: {'type': 'file', 'name': 'Файл SWF', 'default': null, 'require': true}
      , getImage: {'type': 'file', 'name': 'Файл GIF', 'default': null, 'require': true}
      , backgroundColor: {'type': 'string', 'name': 'Цвет подложки', 'default': '#ffffff', 'require': true}
      // ... etc
    }
};