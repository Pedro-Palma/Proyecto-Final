'use strict'
var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'passt'
exports.createToken = function (user) {
    var payload = {
        sub: user._id,   
        name: user.user,
        role: user.role,
        iat: moment().unix(),
        exp: moment().day(10,'days').unix()
    }
    return jwt.encode(payload,secret)
    
}