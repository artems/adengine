var fs    = require("fs")
  , async = require("async")
  , Boot  = require("./_boot");

Boot.run(function(err, app) {
    console.time('generate');

    async.waterfall([
        function(callback) {
            app.mysql.query("SELECT COUNT(*) as cnt FROM k_geo_raw_addr", callback);
        },

        function(results, fields, callback) {
            var total = results[0]["cnt"]
              , start = 0
              , limit = 50000
              , end   = limit;

            total = 1000000;

            var fd = "";
            var index = 0;
            var prefix = "  ";
            
            function start_file(index) {
                fd = fs.openSync('geo_ip'+index+'.js', "a+");
                fs.truncateSync(fd, 0);
                fs.writeSync(fd, "module.exports = [" + "\n");
            }

            function endFile() {
                fs.writeSync(fd, "]");
                fs.closeSync(fd);
                prefix = "  ";
            }

            start_file(index);

            var insert = function(start, limit, callback) {
                console.log("selected geo_id #" + start + " of " + total);

                if (start > 0 && start % 100000 == 0) {
                    endFile();
                    start_file(++index);
                }

                async.waterfall([
                    function(callback) {
                        app.mysql.query("SELECT start_ip, end_ip, country_code, region_code, city_code FROM k_geo_raw_addr LIMIT "+start+","+limit, callback);
                    },

                    function(results, fields, callback) {
                        results.forEach(function(item) {
                            var ip = "{s: " + item.start_ip + ", e: " + item.end_ip + ", c: " + item.city_code +"}";
                            fs.writeSync(fd, prefix + ip + "\n")
                            prefix = ", ";
                        });

                        callback();
                    }
                ], callback);
            };

            var go_next = function () {
                start = end;
                end   = start + limit;

                if (start < total) {
                    insert(start, limit, go_next);
                } else {
                    endFile();
                    callback()
                }
            };

            insert(start, limit, go_next);
        }
    ], function(err) {
        console.timeEnd('generate');
        Boot.stop();
    });
});


