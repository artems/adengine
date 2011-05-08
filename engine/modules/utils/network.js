module.exports.ip2long = function (client_ip) {
    var parts = client_ip.valueOf().split(/\./);
    if (parts.length == 4) {
        return parts[0] * Math.pow(256, 3) +
               parts[1] * Math.pow(256, 2) +
               parts[2] * Math.pow(256, 1) +
               parts[3] * Math.pow(256, 0);
    } else {
        return false;
    }
};

module.exports.long2ip = function(client_ip) {
    if (!isNaN(client_ip) && (client_ip >= 0 || client_ip <= 4294967295)) {
        return Math.floor(client_ip / Math.pow(256, 3)) + '.' +
            Math.floor((client_ip % Math.pow(256, 3)) / Math.pow(256, 2)) + '.' +
            Math.floor(((client_ip % Math.pow(256, 3)) % Math.pow(256, 2)) / Math.pow(256, 1) ) + '.' +
            Math.floor((((client_ip % Math.pow(256, 3)) % Math.pow( 256, 2)) % Math.pow( 256, 1)) / Math.pow(256, 0));
    } else {
        return false;
    }
};