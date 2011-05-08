var async = {};

async.waterfall = function(functions, error_handler) {
    function runErrorHandler(err) {
        if (error_handler) {
            error_handler(err);
        }
    }

    function callback() {
        var args = Array.prototype.slice.call(arguments);
        
        var err = args.shift();
        if (err instanceof Error) {
            runErrorHandler(err);
            return;
        }

        args.push(callback);

        var current = functions.shift();

        if (current) {
            current.apply(null, args);
        } else {
            runErrorHandler();
        }
    }

    callback();
};

async.series = function(functions, error_handler) {
    function callback(err) {
        if (err instanceof Error) {
            error_handler && error_handler(err);
            return;
        }

        var current = functions.shift();

        if (current) {
            current(callback);
        } else {
            error_handler && error_handler();
        }
    }

    callback();
};


async.parallel = function(functions, finish) {
    var err = null
      , count = 0
      , results = {}
      , i
    ;

    if (functions instanceof Array) {
        count = functions.length;
    } else {
        for (i in functions) {
            if (functions.hasOwnProperty(i)) {
                count++;
            }
        }
    }

    function callback(name) {
        return function() {
            if (arguments[0] instanceof Error && !err) {
                err = arguments[0];
            }

            if (arguments[1] != undefined) {
                results[name] = arguments[1];
            }
            
            if (--count == 0) {
                finish(err, results);
            }
        }
    }

    if (functions instanceof Array) {
        var length = count;
        for (i=0; i<length; i++) {
            functions[i](callback(i));
        }        
    } else {
        for (i in functions) {
            if (functions.hasOwnProperty(i)) {
                functions[i](callback(i));
            }
        }
    }
};

async.defer = function(callback, count) {
    var err = null;
    count++;
    
    return function(current_err) {
        if (current_err instanceof Error && !err) {
            err = current_err;
        }

        if (--count == 0) {        
            callback(err);
        }
    }
}

AsyncGroup = function(callback) {
    this.err = null;
    this.count = 1;
    this.results = {};
    this.callback = callback;
    this.index = 0;
};

AsyncGroup.prototype.add = function(name) {
    this.count++;

    if (!name) {
        name = this.index++;
    }
    
    var self = this;

    return function(err, result) {
        if (err instanceof Error && !self.err) {
            self.err = err;
        }

        if (result != undefined) {
            self.results[name] = result;
        }

        self.call();
    }
};

AsyncGroup.prototype.finish = function(err) {
    if (err instanceof Error && !this.err) {
        this.err = err;
    }

    this.call();
};

AsyncGroup.prototype.error = function(err) {
    this.err = err;
};

AsyncGroup.prototype.call = function() {    
    if (--this.count == 0) {        
        this.callback(this.err, this.results);
    }
};

async.group = function(callback) {
    return new AsyncGroup(callback);
};

module.exports = async;