'use strict'
const user = require('../Modules/user.module')
const bcrypt = require("bcrypt-nodejs")
const jwt = require('../services/jwt');




function adminCreate(req,res){
    var userModel = new user()
    userModel.user = 'Admin'
    userModel.password = '123456'
    userModel.role= '0'
    var params = userModel
    if(params.user){
        user.find({$or:[
            {user:userModel.user}
        ]}).exec((err, userFound)=>{
            if(userFound && userFound.length<1){
            bcrypt.hash(params.password, null,null,(err,passE)=>{
                userModel.password=passE
                userModel.save((err,userSaved)=>{
                        console.log('userFound')


                         })

            
                    })  
    
             }else{
        console.log('Admin ya existe')
             }
      })
    }
    
}
function userDelete(req,res){
var id = req.body.id


    
    
        if(req.user.sub!= id && req.user.role ==1) return res.status(500).send('No tiene permisos')
        if(req.user.sub ==id||req.user.role == 0 ){

           user.find({$or:[
               {_id:id}

           ]}).exec((err,userFound)=>{
            if(id != req.user.sub && userFound.role != 0) return res.status(500).send({mensaje:'Un admin No puede eliminar a otro admin'})

            if(err) return res.status(500).send({mensaje:'El usuario que desea eliminar no existe'})
            if(userFound){

                user.findByIdAndDelete(id,(err,userDeleted)=>{
                    if(err) return res.status(500).send({mensaje:'error en la peticion eliminar'})
                    if(!userDeleted)return res.status(500).send({mensaje:'error al eliminar usuario'})
                    return res.status(200).send({userDeleted})

                })
            }
            

           })
            
            
            
    }else{
        return res.status(500).send({mensaje:'No tiene permisos'})
    }

    
        
}
function userUpdate(req,res){
  
    var id = req.params.id
    var params = req.body
        if(req.user.sub!= id && req.user.role ==1) return res.status(500).send('No tiene permisos')
        if(req.user.sub ==id||req.user.role == 0 ){
            
            user.find({$or:[
                {_id:id}
 
            ]}).exec((err,userFound)=>{
             if(id != req.user.sub && userFound.role != 0) return res.status(500).send({mensaje:'Un admin No puede actualizar a otro admin'})
 
             if(err) return res.status(500).send({mensaje:'El usuario que desea actualizar no existe'})
             if(userFound){
 
                 user.findByIdAndUpdate(id,params,{new:true},(err,userUpdated)=>{
                     if(err) return res.status(500).send({mensaje:'error en la peticion '})
                     if(!userUpdated)return res.status(500).send({mensaje:'error al actualizar usuario'})
                     return res.status(200).send({userUpdated})

                 })
             }
            })
        }else{
            return res.status(500).send({mensaje:'No tiene permisos'})
        }

}
function registerUser(req,res){
    var idUser = req.params.idUser
    var userModel= user();
    var params = req.body;

    user.find({$or:[
        {_id:idUser}

    ]}).exec((err,userFound)=>{
        if(err)return res.status(500).send({mensaje:"No se logro identificar el usuario"})
            if(userFound.role==1) return res.status(500).send({mensaje:"no tiene permisos necesarios" })
                if(params.user){
                    userModel.user = params.user
                    userModel.password = params.password
                    userModel.role = params.role
                    user.find({$or:[
                        {user:userModel.user}
                    ]}).exec((err,userFound)=>{
                        if(err) return res.status(500).send({mensaje:'error en la peticion'})
                        if(userFound && userFound.length >=1){
                            return res.status(500).send({mensaje:"user ya existe"})

                        }else{
                            bcrypt.hash(params.password,null,null,(err,passE)=>{
                                userModel.password = passE
                                userModel.save((err,userSaved)=>{
                                    if(err)return res.status(500).send({mensaje: 'error al guardar'})
                                    if(userSaved){
                                        res.status(200).send(userSaved)
                                    }else{
                                        res.status(404).send({mensaje:'no se pudo registrar'}) 
                                    }

                                })
                            })
                        }
                    })

                }            


    })      
      



}
function register(req,res){
    var userModel = user()
    var params = req.body
        if(params.user){
            userModel.user = params.user
            userModel.password = params.password
            userModel.role = 1
            user.find({$or:[
                {user:userModel.user}
            ]}).exec((err,userFound)=>{
                if(err) return res.status(500).send({mensaje:'error en la peticion'})
                if(userFound && userFound.length >=1){
                    return res.status(500).send({mensaje:"user ya existe"})

                }else{
                    bcrypt.hash(params.password,null,null,(err,passE)=>{
                        userModel.password = passE
                        userModel.save((err,userSaved)=>{
                            if(err)return res.status(500).send({mensaje: 'error al guardar'})
                            if(userSaved){
                                res.status(200).send(userSaved)
                            }else{
                                res.status(404).send({mensaje:'no se pudo registrar'}) 
                            }

                        })
                    })
                }
            })

        }
}
function login(req,res){
    var params = req.body
    user.findOne({user:params.user}, (err,userFound)=>{
        if(userFound){
            bcrypt.compare(params.password, userFound.password,(err,passCorrect)=>{
            

                if(passCorrect){
                    
                    if(params.getToken==='true'){
                        return res.status(200).send({
                            token: jwt.createToken(userFound)
                        })
                    }else{
                        userFound.password= undefined
                        return res.status(200).send({userFound})
                    }
                }else{
                    return res.status(404).send({mensaje:'Password incorrecta'})
                }
            })
        }else{
            return res.status(404).send({mensaje:'User no encontrado'})
        }
    })  
}


module.exports={
    adminCreate,
    registerUser,
    register,
    login,
    userDelete,
    userUpdate

}