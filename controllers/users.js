const jwt                   = require('jsonwebtoken');

const User                  = require('../models/User');
const validateRegisterInput = require('../validation/register');
const { JSONWebToken }      = require('../config/keys');


// Function for signing JSON Web Tokens
signToken = user => {
  return jwt.sign({
    iss: 'hexabets',                                  // Issued by:   Can be anything like name of company
    sub: user._id,                                    // Subject:     Has to be unique
    iat: new Date().getTime(),                        // Issued at:   Current time
    exp: new Date().setDate(new Date().getDate + 1)   // Expires at: 1 day ahead
  }, JSONWebToken.secret)
}

module.exports = {

  register: async(req, res, next) => {

    const { errors, isValid } = validateRegisterInput(req.body);  //request comes from the route

    const{  
      name,
      email, 
      password,
      password2
      } = req.body;

    // Check if any form errors are found
    if(!isValid) {
      return res.status(400).json({ errors })
    }

    // Check if user already exists by email
    const foundUser = await User.findOne(req.body); 
    if(foundUser) {
      errors.email = 'Email already exists';
      return res.status(403).json({ errors });  //403 means forbidden
    }

    // Create new user
    const newUser = new User({ 
                          name,
                          email, 
                          password,
                          password2
                          });

    // Save user to database                      
    await newUser.save();   //Waits for newUser to be saved to database before next line is processed

    // Create jwt token
    const token = signToken(newUser);

    // Respond with token
    res.status(200).json({ token });

  },


  login: async(req, res, next) => {
    // Generate token 
    console.log('UserController.login() called')
  },

  secret: async(req, res, next) => {
    console.log('UserController.secret() called')
  },



}