const jwt=require('jsonwebtoken')
const USER=require('../models/user')

//the actual auth middleware
const redirectauth = async(req,res,next)=>{
    if(!req.cookies.userData){
        next()
    }else{
        res.redirect('/')
    }
    
}

module.exports= redirectauth