const User = require('../models/User');
const path = require('path');

exports.signupPost = async (req, res)=>{
    
    const {name, email, password } = req.body;
    try{

    const alreadyExits = await User.findOne({where:{email}});
    if(alreadyExits){
        return res.status(400).json({message: 'Email already exits'})
    }
    const response = await User.create({name, email, password});
    if(response.ok){
        return res.status(201).json({message:'User created successfully'});
    }
    }catch(err){
     console.error('Error during signUp', err);
     return res.status(500).json({message:'Error occurs during signup.'})
    }

}