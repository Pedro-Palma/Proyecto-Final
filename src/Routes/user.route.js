'use strict'
const express = require("express")
const userControler= require('../Controlers/user.controler')
var md_auntentication = require('../Middlewares/authenticated')
var api = express.Router()
api.post('/registerUser/:idUser', userControler.registerUser)
api.post('/register', userControler.register)
api.post('/login',userControler.login)
api.delete('/deleteUser',md_auntentication.ensureAuth,userControler.userDelete)
api.put('/updateUser/:id',md_auntentication.ensureAuth,userControler.userUpdate)
module.exports = api;
