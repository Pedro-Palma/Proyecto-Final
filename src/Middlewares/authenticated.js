'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret= 'passt'

exports.ensureAuth = function (req,res, next) {
    if(!req.headers.authorization){
        return res.status(401).send({mensaje:'la peticion no tiene la cabezera de autorizacion'})
    }
    var token = req.headers.authorization.replace(/['"]+/g,'')

    try{
        var payload = jwt.decode(token, secret)
            //expiracion
            if(payload.exp <= moment().unix()) {
                return res.status(401).send({

                    mensaje:'El token expiro'
                })

            }
    }catch(error){
        return res.status(404).send({
            mensaje:'El token no es valido'
        })

    }
    req.user= payload;
    console
    next();
}