 const jwt = require('jsonwebtoken');

 const {JWT_ADMIN_PASSWORD} = require("../config")
 function adminMiddleware(req, res, next){
    const token = req.headers.token
    // console.log(token);
    if(token === null || undefined){
        return res.json({
            message: "Token is required"
        })
    }
    try {
    
        const decodedData= jwt.verify(token,JWT_ADMIN_PASSWORD);
        if(!decodedData){
            return res.json({
                message: "Invalid token"
            })
        }
        req.adminId = decodedData.id;
            next();

    } catch (error) {
        return res.json({
            message: " YOu are not Signed in as an admin "
        })
        
    }
    
 }
 module.exports = {
    adminMiddleware
 }


