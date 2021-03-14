'use strict'
const mongoose = require('mongoose')
var Schema = mongoose.Schema

var categorySchema = Schema({
    name: String,
    description:String,
    price:Number,
    stock:Number,
    category:[{type: mongoose.Schema.Types.ObjectId,ref:'categories'}],
    sold:Number
})
module.exports = mongoose.model('products',categorySchema)