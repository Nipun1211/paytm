const express= require("express");
const jwt= require("jsonwebtoken");
const JWT_SECRET = require("./config");



const authMiddleware= function (req,res,next){

    const authHeader= req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({message:"Invalid headers"});
    }
     const token= authHeader.split(' ')[1];
     console.log(token);
     
    try{
        const decoded= jwt.verify(token, JWT_SECRET);
        req.userId= decoded.userId;
     
        next();
    }catch(err){
        return res.status(401).json({
            message:err
        });
    }
};

module.exports={
    authMiddleware
}
