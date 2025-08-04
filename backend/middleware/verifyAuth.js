const jwt = require('jsonwebtoken');
const userData = require('../models/userData');

const JWT_code = process.env.JWT_SECRET;

const verifyAuth = async(req, res, next) => {
    const authHeader = req.header('Authorization');

    if(!authHeader) return res.status(400).json({error: "Token wrong, authorization failed"});

    const token = authHeader.split(' ')[1];        //Because Authorization: 'Bearer <tok>', we only need the tok

    if(!token) return res.status(400).json({error: "Token missing, auth failed"});

    try{
        const decodedJWT = jwt.verify(JWT_code, token);     //This returns an object if it verifies, the object is the payload that we sent through the jwt 

        const user = await userData.findById(decodedJWT.userID).select('-password');        //.userID from payload of jwt

        if(!user) return res.status(400).json({error: "no user found! auth failed"});

        req.user = user;        //This is used in createNewEvent as req.user.userID

        next();

    }catch(err){
        if(err.name === 'TokenExpiredError') return res.status(500).json({error: "Expired Token, auth failed"});
        if(err.name === 'JsonWebTokenError') return res.status(500).json({error: "invalid token"});
        console.log(err);
        return res.status(500).json({error: "Authorization failed!"});
    }


}

module.exports = verifyAuth; 