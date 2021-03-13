'use strict'
const mongoose = require("mongoose");
const app= require('./app');
const userControler = require('./src/controlers/user.controler')

mongoose.Promise= global.Promise;
mongoose.connect('mongodb://localhost:27017/ProyectoFinal', {useNewUrlParser: true, useUnifiedTopology: true  }).then(()=>{
console.log('Conexion:Correcto');
userControler.adminCreate()

app.listen(3000,function () {
    
    console.log('Servidor:Correcto')
    
})
}).catch(err=> console.log(err))