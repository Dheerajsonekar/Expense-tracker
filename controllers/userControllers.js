const User = require('../models/User');
const bcrypt = require('bcrypt');


exports.signupPost = async (req, res)=>{
    
    const {name, email, password } = req.body;

    try{

    const alreadyExits = await User.findOne({where:{email}}); 

    if(alreadyExits){
        return res.status(400).json({message: 'Email already exits'})
    }

    // encrypt pass before storing with saltround=10
    const hashPassword = await bcrypt.hash(password, 10);
    const response = await User.create({name, email:email.toLowerCase(), password: hashPassword});

    if(response){

        return res.status(201).json({message:'User created successfully'});
    }
    

    }catch(err){
     console.error('Error during signUp', err);
     return res.status(500).json({message:'Error occurs during signup.'})
    }

}

exports.loginPost = async (req, res)=>{
  
 const {email, password } = req.body;

 try{
    const emailExits = await User.findOne({where: {email}})
    if(!emailExits){
        return res.status(400).json({message: "user doesn't exits."});
    }
    
    const isValidPassword = await bcrypt.compare(password, emailExits.password);
    if(!isValidPassword){
       return res.status(401).json({message: 'Invalid password! '})
    }
    
   return res.status(201).json({message: 'User logged in succesfully'})


 }catch(err){
    console.error('logged in failed', err);
    return res.status(500).json({message: 'Error in loggin'});
 }

}

