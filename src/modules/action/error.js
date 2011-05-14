var uniqid = require("utils/uniqeid").uniqeid;

function Unit(app, req, res) {
    this.app = app;
    this.req = req;
    this.res = res;

    this.jumps = 0;
};

Unit.errorHanlder = function(app, req, res, err, callback) {
    var handler = new Unit(app, req, res);

    if (!err) {
        handler.end(callback);
        return;
    }
    
    handler.process(err, callback);
};

Unit.prototype.process = function(err, callback) {
    this.jumps++;

    if (this.jumps >= 10) {
        console.log("ENGINE: Too much errors jumps");
        console.log(err.stack);
        
        this.end(callback);
    } else {
        var self = this;
        
        this.execute(err, function(err) {
            if (err) {
                self.process(err, callback);
            } else {
                self.end(callback);
            }
        });
    }
}

Unit.prototype.end = function(callback) {
    if (callback) {
        callback();
    } else {
        this.res.end();
    }
}

Unit.prototype.execute = function(err, callback) {
    var code = err.message.substr(0, 8);

    console.log(code);
    switch (code) {
        case "ENG-0001" : // Переданы не верные параметры запроса
            this._returnNoContent(callback);
            break;
        case "ENG-0002" : // Не удалось определить место
            this._returnNoContent(callback);
            break;
        case "ENG-0003" : // Пользователь без cookie, установить
            this._setCookieAndRefresh(callback);
            break;
        case "ENG-0004" : // Не удалось установить cookie, показать заглушку формата
            // TODO запустить ротацию по флайтам, где можно не учитывать пользователя
            this._showFormatPlug(callback);
            break;
        case "ENG-0005" : // Не нашлось баннеров для показа
            this._showFormatPlug(callback);
            break;
        case "ENG-0010" : // Не нашлось баннеров для показа и нет заглушки сайта
            this._showFormatPlug(callback);
            break;
        case "ENG-0011" : // Не прошел проверку реферер сайта
            this._showFormatPlug(callback);
            break;
        default :
            console.log("Unknow error\n" + err.stack);
            
            this._returnNoContent(callback);
    }
};

Unit.prototype._setCookieAndRefresh = function(callback) {
    var conn = this.req.url.indexOf("?") != -1 ? "&" : "?";
    
    this.res.statusCode = 302;
    this.res.setHeader("Location", this.req.url + conn + "cset=1");
    this.res.setHeader("Set-Cookie", this.app.config.cookie.name + "=" +  uniqid());

    callback();
};

Unit.prototype._showFormatPlug = function(callback) {
    if (!this.req.session.place) {
        callback(new Error("ENG-0001"));
        return;
    }

    var format = this.req.session.place.getFormat();

    if (!format || !format.getPlug()) {
        callback(new Error("ENG-0001"));
    } else {
        var tpl  = format.getPlug();
        var code = tpl.body.replace("%code%", "");

        this.res.write(code);
        
        callback();
    }
};

Unit.prototype._returnNoContent = function(callback) {
    this.res.statusCode = 204;

    callback();
};

module.exports = Unit;