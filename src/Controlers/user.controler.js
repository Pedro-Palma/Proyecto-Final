'use strict'
const user = require('../Modules/user.module')
const category = require('../Modules/category.module')
const product = require('../Modules/product.module')
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
function registerCategory(req,res){
    var categoryModel = category()
    var params = req.body
    if(req.user.role !=0)return res.status(500).send({mensaje:'No posee permisos'})
    if(params.name){
        categoryModel.name = params.name
        categoryModel.description = params.description
        category.find({$or:[
            {name:categoryModel.name}
        ]}).exec((err,categoryFound)=>{
            if(err) return res.status(500).send({mensaje:'error en la peticion'})
                if(categoryFound && categoryFound.length>=1){
                    return res.status(500).send({mensaje:'category ya existente'})
                }else{
                    categoryModel.save((err,categorySaved)=>{
                        if(err)return res.status(500).send({mensaje: 'error al guardar'})
                            if(categorySaved){
                                res.status(200).send(categorySaved)
                            }else{
                                res.status(404).send({mensaje:'no se pudo guardar'}) 
   
                            }
                    })
                }
        })
    }
}
function listCategories(req,res){
    if(req.user.role != 0 ) return res.status(500).send({mensaje:'No posee permisos'})
    category.find((err,categories)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticio'})
        if(categories.length<=0) return res.status(500).send({mensaje:'No se han ingresado categories'})
        return res.status(200).send({categories})
    })

}
function updateCategory(req,res){
    var params = req.body
    if(req.user.role !=0)return res.status(500).send({mensaje:'No posee permisos'})
    category.find({$or:[{
        _id:params.id
    }]}).exec((err,categoryFound)=>{
        if(err) return res.status(500).send({mensaje:'La categoria que desea actualizar no existe'})
        if(categoryFound){
            category.findByIdAndUpdate(params.id,params,{new:true},(err,categoryUpdated)=>{
                if(err) return res.status(500).send({mensaje:'error en la peticion '})
                if(!categoryUpdated)return res.status(500).send({mensaje:'error al actualizar categoria'})
                return res.status(200).send({categoryUpdated})
            })
        }else{

        }
    })
}
function deleteCategory(req,res){
    var params= req.body
    if(req.user.role !=0)return res.status(500).send({mensaje:'No posee permisos'})

    category.find({$or:[{
        _id:params.id
        
    }]}).exec((err,categoryFound)=>{    
        if(err) return res.status(500).send({mensaje:'La categoria que desea actualizar no existe'})
        category.findOneAndDelete(params.id,(err,categorytDeleted)=>{
            if (err) return res.status(500).send({mensaje:'error al eliminar categoria'})
            product.find({$or:[
                {category:categorytDeleted._id}
            ]}).exec((err,productFound)=>{
                console.log({productFound})
                console.log(product1)
                
            })
        })
        
    })

}
function registerProduct(req,res){
    var productModel =  product()
    var params = req.body
    if(req.user.role != 0 ) return res.status(500).send({mensaje:'No posee permisos'})
    if(params.name){
        productModel.name = params.name
        productModel.description =params.description
        productModel.price = params.price
        productModel.stock=params.stock
        productModel.category= params.category

        product.find({$or:[
            {name:productModel.name}
        ]}).exec((err,productFound)=>{
            if(err) return res.status(500).send({mensaje:'error en la peticion'})
                if(productFound && productFound.length>=1){
                    return res.status(500).send({mensaje:'product ya existente'})
                }else{
                    productModel.save((err,productSaved)=>{
                        if(err)return res.status(500).send({mensaje: 'error al guardar'})
                            if(productSaved){
                                res.status(200).send(productSaved)
                            }else{
                                res.status(404).send({mensaje:'no se pudo guardar'}) 
   
                            }
                    })
                }
        })
    }
}
function updateProduct(req,res){
    var params = req.body
    if(req.user.role != 0 ) return res.status(500).send({mensaje:'No posee permisos'})
    product.find({$or:[{
        _id:params.id
    }]}).exec((err,productFound)=>{
        if(err) return res.status(500).send({mensaje:'La categoria que desea actualizar no existe'})
        if(productFound){
            product.findByIdAndUpdate(params.id,params,{new:true},(err,productUpdated)=>{
                if(err) return res.status(500).send({mensaje:'error en la peticion '})
                if(!productUpdated)return res.status(500).send({mensaje:'error al actualizar categoria'})
                return res.status(200).send({productUpdated})
            })
        }else{

        }
    })
 
}
function listProduct(req,res){
    product.find((err,products)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticio'})
        if(products.length<=0) return res.status(500).send({mensaje:'No se han ingresado products'})
        return res.status(200).send({products})
    })
}
function listProductName(req,res){
    var params = req.body   
    product.find({$or:[{
        name:params.name
    }]}).exec((err,products)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticio'})
        if(products.length<=0) return res.status(500).send({mensaje:'No se han ingresado products'})
        return res.status(200).send({products})
    
    })
}
module.exports={
    adminCreate,
    registerUser,
    register,
    login,
    userDelete,
    userUpdate,
    registerCategory,
    listCategories,
    updateCategory,
    deleteCategory,
    registerProduct,
    updateProduct,
    listProduct,
    listProductName
    

}