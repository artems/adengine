module.exports = {
    mongo : {
        name : "aden"
      , host : "127.0.0.1"
      , port : 27017
    },

    redis : {
        host : "127.0.0.1"
      , port : 6379
    },

    cookie : {
        name : "uid"
    },

    log : {
        format : ':remote-addr [:date] ":method :url :http-version" :status ":user-agent"'
    }
};