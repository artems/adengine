module.exports = {
    mongo : {
        name : "adex"
      , host : "127.0.0.1"
      , port : 27017
    },

    redis : {
        host : "localhost"
      , port : 0000
    },

    log : {
        format : ':remote-addr [:date] ":method :url :http-version" :status ":user-agent"'
    },

    cookie : {
        name : "uid"
    }
}