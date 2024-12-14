const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next)=>{
    const token = req.headers.authorization?.split('')[1];

    if(!token){
        return res.status(401).json({message: 'Authentication failed!'});
    }

    try{
      
        const decoded = jwt.verify(token, "secret key");
        const user = await findByPk(decoded.id);

        if(!user){
            return res.status(404).json({message: 'user not found!'})
        }

        req.user = user;

        next();

    }catch(err){
        console.error('failed to authenticate', err);
        return res.status(403).json({message:'failed to token generation.'})
    }

}