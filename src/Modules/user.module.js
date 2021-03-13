'use strict'
const mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = Schema({
    user: String,
    password:String,
    role: Number
})
module.exports = mongoose.model('users',userSchema)